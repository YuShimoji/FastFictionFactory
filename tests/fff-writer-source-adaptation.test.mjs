import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile as execFileCallback } from "node:child_process";
import {
  mkdtemp,
  readFile,
  readdir,
  rm
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import test from "node:test";
import {
  AUTHORITY_CLASSES,
  FORMAT_CANDIDATES,
  INPUT_KINDS,
  buildFixture,
  buildFixtureSet,
  stableStringify,
  validateAgainstSchema
} from "../tools/fff-writer-source-adaptation.mjs";

const execFile = promisify(execFileCallback);
const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const ARTIFACT_ROOT = path.join(
  REPO_ROOT,
  "artifacts",
  "writer-source-adaptation-v0"
);
const FIXTURE_ROOT = path.join(
  REPO_ROOT,
  "fixtures",
  "writer-source-adaptation"
);
const BASE = "bcdf84e4d89f26bf41d288f8282d7ae50911cc1e";
const SCHEMAS = {
  "writer-source-packet.schema.json": ["case", "source_packet"],
  "story-authority-ledger.schema.json": ["case", "authority_ledger"],
  "format-selection.schema.json": ["case", "format_selection"],
  "narrative-ir.schema.json": ["case", "narrative_ir"],
  "writer-proposal.schema.json": ["proposal", "writer_proposal_impact"],
  "editorial-handoff-input.schema.json": ["case", "editorial_handoff_input"]
};
const GENERATED_FIXTURES = {
  case: "case-digest-fixture-output.json",
  linear: "linear-lore-counterexample-output.json",
  fragment: "fragment-bundle-fixture-output.json",
  proposal: "writer-proposal-roundtrip-output.json"
};

function hash(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function generatedOutputs() {
  return Object.fromEntries(
    await Promise.all(
      Object.entries(GENERATED_FIXTURES).map(async ([key, fileName]) => [
        key,
        await readJson(path.join(ARTIFACT_ROOT, fileName))
      ])
    )
  );
}

async function fixtureHashes() {
  const names = (await readdir(FIXTURE_ROOT)).sort();
  return Object.fromEntries(
    await Promise.all(
      names.map(async (name) => [
        name,
        hash(await readFile(path.join(FIXTURE_ROOT, name)))
      ])
    )
  );
}

function assertTextResolves(text, spanIds, spanMap, origin = null) {
  assert.ok(spanIds.length > 0, `missing source spans for ${text}`);
  for (const spanId of spanIds) {
    const span = spanMap.get(spanId);
    assert.ok(span, `unknown source span ${spanId}`);
    if (origin) assert.equal(span.origin, origin);
    assert.ok(
      span.exact_text.includes(text) || text.includes(span.exact_text),
      `${JSON.stringify(text)} does not resolve to ${spanId}`
    );
  }
}

function assertLineage(output) {
  const ir = output.narrative_ir;
  const spanMap = new Map(
    output.source_packet.source_spans.map((span) => [span.source_span_id, span])
  );
  const directMaterials = [
    ir.audience_promise,
    ...ir.protagonist_or_subject,
    ...(ir.incident ? [ir.incident] : []),
    ...ir.events,
    ...ir.causal_edges,
    ...ir.missing_causal_edges,
    ...ir.narration_units,
    ...ir.caption_units,
    ...ir.visual_intent_placeholders,
    ...ir.unresolved_items,
    ...(ir.ending_state ? [ir.ending_state] : [])
  ];
  for (const material of directMaterials) {
    assert.ok(material.lineage, `missing lineage on ${JSON.stringify(material)}`);
    if (material.lineage.mode === "adapter_generated_non_factual") {
      assert.deepEqual(material.lineage.source_span_ids, []);
      continue;
    }
    assertTextResolves(
      material.text ?? material.intent,
      material.lineage.source_span_ids,
      spanMap,
      material.lineage.mode === "writer_authored_proposal"
        ? "writer_authored_proposal"
        : null
    );
  }
  for (const claim of ir.evidence_claim_status) {
    assertTextResolves(claim.text, claim.source_span_ids, spanMap);
  }
  for (const entity of ir.named_entities) {
    assertTextResolves(entity.name, entity.source_span_ids, spanMap);
  }
  for (const introduction of ir.first_introduction_wording) {
    assertTextResolves(introduction.wording, introduction.source_span_ids, spanMap);
  }
  for (const section of ir.section_beat_plan) {
    if (section.structural_lineage === "adapter_generated_non_factual") {
      assert.deepEqual(section.source_span_ids, []);
    } else {
      assertTextResolves(section.label, section.source_span_ids, spanMap);
    }
  }
  for (const entry of ir.source_span_lineage) {
    assert.ok(entry.source_span_ids.length > 0);
    entry.source_span_ids.forEach((spanId) => assert.ok(spanMap.has(spanId)));
  }
}

test("the public contract supports exactly three inputs and six formats", () => {
  assert.deepEqual(INPUT_KINDS, [
    "prose_markdown_v0",
    "fragment_bundle_v0",
    "writer_proposal_v0"
  ]);
  assert.deepEqual(FORMAT_CANDIDATES, [
    "CASE_DIGEST",
    "SHORT_DRAMA",
    "SCENE_EXCERPT",
    "PLOT_SUMMARY",
    "LORE_EXPLAINER",
    "TRAILER_PV"
  ]);
  assert.deepEqual(AUTHORITY_CLASSES, [
    "established_fact",
    "observed_event",
    "reported_claim",
    "allegation",
    "inference",
    "unresolved",
    "must_preserve",
    "preferred",
    "optional",
    "forbidden_to_infer",
    "writer_authored_proposal"
  ]);
});

test("all six schemas parse, validate their outputs, and reject a missing required field", async () => {
  const outputs = await generatedOutputs();
  for (const [schemaName, [fixtureKey, componentKey]] of Object.entries(SCHEMAS)) {
    const schema = await readJson(path.join(ARTIFACT_ROOT, schemaName));
    const sample = outputs[fixtureKey][componentKey];
    assert.deepEqual(
      validateAgainstSchema(sample, schema),
      [],
      `${schemaName} rejected its generated sample`
    );
    const malformed = structuredClone(sample);
    delete malformed[schema.required[0]];
    assert.ok(
      validateAgainstSchema(malformed, schema).length > 0,
      `${schemaName} accepted a missing ${schema.required[0]}`
    );
  }
});

test("source identities, byte ranges, character ranges, and exact-text hashes reproduce", async () => {
  const outputs = await generatedOutputs();
  for (const output of Object.values(outputs)) {
    const fileMap = new Map();
    for (const identity of output.source_packet.source_files) {
      const bytes = await readFile(path.join(REPO_ROOT, identity.relative_path));
      assert.equal(bytes.length, identity.utf8_byte_size);
      assert.equal(hash(bytes), identity.sha256);
      fileMap.set(identity.source_file_id, {
        bytes,
        text: bytes.toString("utf8")
      });
    }
    const ids = new Set();
    for (const span of output.source_packet.source_spans) {
      assert.ok(!ids.has(span.source_span_id), `duplicate ${span.source_span_id}`);
      ids.add(span.source_span_id);
      const source = fileMap.get(span.source_file_id);
      assert.ok(source, `unknown source file ${span.source_file_id}`);
      assert.equal(
        source.text.slice(
          span.character_range.start,
          span.character_range.end
        ),
        span.exact_text
      );
      assert.equal(
        source.bytes
          .subarray(span.byte_range.start, span.byte_range.end)
          .toString("utf8"),
        span.exact_text
      );
      assert.equal(hash(Buffer.from(span.exact_text, "utf8")), span.exact_text_sha256);
    }
  }
});

test("every material IR statement has complete authority without unsupported facts", async () => {
  const outputs = await generatedOutputs();
  for (const output of Object.values(outputs)) {
    assert.equal(output.validation_summary.schemas_valid, true);
    assert.equal(output.validation_summary.material_lineage_complete, true);
    assert.equal(output.narrative_ir.unsupported_factual_claim_count, 0);
    assert.equal(output.validation_summary.unsupported_factual_claim_count, 0);
    assertLineage(output);
    const spanIds = new Set(
      output.source_packet.source_spans.map((span) => span.source_span_id)
    );
    for (const entry of output.authority_ledger.entries) {
      assert.ok(AUTHORITY_CLASSES.includes(entry.authority_class));
      assert.ok(entry.source_span_ids.length > 0);
      entry.source_span_ids.forEach((spanId) => assert.ok(spanIds.has(spanId)));
      for (const required of [
        "authority_id",
        "normalized_claim",
        "original_wording",
        "source_status",
        "confidence_source_certainty",
        "mutable_by_writer_proposal",
        "human_author_required",
        "canon_status",
        "downstream_consumers"
      ]) {
        assert.ok(Object.hasOwn(entry, required), `ledger entry missing ${required}`);
      }
    }
  }
});

test("accepted CASE_DIGEST compiles to its five source-bound sections and compatible handoff", async () => {
  const { case: output } = await generatedOutputs();
  const metrics = output.format_selection.capacity_metrics;
  assert.equal(output.format_selection.status, "SELECTED");
  assert.equal(output.format_selection.selected_format, "CASE_DIGEST");
  assert.equal(metrics.target_duration_seconds, 180);
  assert.equal(metrics.source_character_count, 515);
  assert.equal(metrics.named_entity_count, 2);
  assert.equal(metrics.unexplained_named_entity_count, 0);
  assert.equal(output.narrative_ir.section_beat_plan.length, 5);
  assert.equal(output.narrative_ir.narration_units.length, 5);
  assert.equal(output.narrative_ir.caption_units.length, 11);
  assert.equal(output.narrative_ir.visual_intent_placeholders.length, 11);
  assert.equal(output.editorial_handoff_input.consumer_compatibility.compatible, true);
  assert.deepEqual(
    Object.values(output.editorial_handoff_input.closed_flags),
    [false, false, false, false, false, false, false]
  );
});

test("quarantined linear lore is rejected as SHORT_DRAMA before handoff", async () => {
  const { linear: output } = await generatedOutputs();
  const metrics = output.format_selection.capacity_metrics;
  const shortDrama = output.format_selection.ranked_candidates.find(
    (candidate) => candidate.format_id === "SHORT_DRAMA"
  );
  assert.equal(output.format_selection.status, "AUTHOR_DECISION_REQUIRED");
  assert.notEqual(output.format_selection.selected_format, "SHORT_DRAMA");
  assert.equal(shortDrama.decision, "REJECTED");
  assert.equal(shortDrama.contract_checks.enacted_causality_present, false);
  assert.ok(shortDrama.rejection_reasons.includes("enacted_causality_missing"));
  assert.ok(
    shortDrama.rejection_reasons.includes(
      "information_envelope_exceeds_reference_bound_180_second_capacity"
    )
  );
  assert.equal(metrics.target_duration_seconds, 180);
  assert.equal(metrics.source_character_count, 631);
  assert.equal(metrics.enacted_action_count, 0);
  assert.equal(metrics.causal_step_count, 0);
  assert.equal(metrics.missing_causal_link_count, 6);
  assert.equal(metrics.exposition_unit_count, 14);
  assert.equal(output.editorial_handoff_input, null);
});

test("fragment bundle preserves unknown order and causality", async () => {
  const { fragment: output } = await generatedOutputs();
  assert.equal(output.format_selection.status, "AUTHOR_DECISION_REQUIRED");
  assert.equal(output.format_selection.selected_format, null);
  assert.deepEqual(
    output.narrative_ir.information_reveal_order.map((entry) => entry.order),
    [null, null, null]
  );
  assert.deepEqual(output.narrative_ir.causal_edges, []);
  assert.equal(output.narrative_ir.missing_causal_edges.length, 2);
  assert.equal(
    output.format_selection.capacity_metrics.missing_causal_link_count,
    2
  );
  assert.ok(output.narrative_ir.writer_decisions_required.length >= 3);
  assert.equal(output.editorial_handoff_input, null);
});

test("writer proposal covers every operation and impact class without applying canon", async () => {
  const { case: accepted, proposal: output } = await generatedOutputs();
  const impact = output.writer_proposal_impact;
  assert.deepEqual(
    new Set(impact.changes.map((change) => change.operation)),
    new Set([
      "add",
      "remove",
      "replace",
      "reorder",
      "clarify",
      "mark_undecided",
      "attach_writer_authored_text"
    ])
  );
  assert.deepEqual(
    new Set(impact.changes.map((change) => change.impact_classification)),
    new Set([
      "L0 wording only",
      "L1 subject explanation",
      "L2 relation or section impact",
      "L3 format or structure impact",
      "AUTHOR_DECISION_REQUIRED",
      "FORBIDDEN_UNSUPPORTED_INFERENCE"
    ])
  );
  assert.equal(impact.auto_accept_canon_proposals, false);
  assert.equal(impact.overall_status, "FORBIDDEN_UNSUPPORTED_INFERENCE");
  assert.ok(impact.changes.every((change) => change.auto_accept === false));
  assert.equal(output.editorial_handoff_input.proposal_application_status, "not_applied");
  assert.equal(
    stableStringify(output.narrative_ir.narration_units),
    stableStringify(accepted.narrative_ir.narration_units)
  );
  const spanMap = new Map(
    output.source_packet.source_spans.map((span) => [span.source_span_id, span])
  );
  for (const change of impact.changes.filter(
    (candidate) => candidate.new_text_origin === "writer_authored_proposal"
  )) {
    assert.ok(change.new_text_source_span_ids.length > 0);
    assertTextResolves(
      change.new_text,
      change.new_text_source_span_ids,
      spanMap,
      "writer_authored_proposal"
    );
  }
});

test("downstream audit records only compatibility fields that exist", async () => {
  const contract = await readJson(
    path.join(ARTIFACT_ROOT, "downstream-contract-map.json")
  );
  for (const audited of contract.audited_sources) {
    assert.ok(!Object.hasOwn(audited, "top_level_fields"));
    assert.ok(audited.fields_read_for_upstream_compatibility.length > 0);
    const consumer = await readJson(path.join(REPO_ROOT, audited.relative_path));
    audited.fields_read_for_upstream_compatibility.forEach((field) =>
      assert.ok(Object.hasOwn(consumer, field), `${audited.consumer} lacks ${field}`)
    );
  }
});

test("validation is read-only and each CLI generator writes only its explicit directory", async (t) => {
  const before = await fixtureHashes();
  const caseInput = path.join(FIXTURE_ROOT, "case-digest.prose.json");
  const proposalInput = path.join(FIXTURE_ROOT, "writer-proposal.json");
  const tool = path.join(REPO_ROOT, "tools", "fff-writer-source-adaptation.mjs");
  const root = await mkdtemp(path.join(os.tmpdir(), "fff-writer-cli-"));
  t.after(async () => rm(root, { recursive: true, force: true }));

  const validated = await execFile(process.execPath, [
    tool,
    "validate-source",
    "--input",
    caseInput
  ]);
  const validationResult = JSON.parse(validated.stdout);
  assert.equal(validationResult.writes_performed, 0);
  assert.equal(validationResult.schemas_valid, true);
  assert.equal(validationResult.material_lineage_complete, true);

  const commands = [
    "build-source-packet",
    "build-authority-ledger",
    "select-format",
    "build-narrative-ir",
    "build-handoff-input",
    "apply-writer-proposal",
    "build-all"
  ];
  for (const command of commands) {
    const destination = path.join(root, command);
    const input = command === "apply-writer-proposal" ? proposalInput : caseInput;
    await execFile(process.execPath, [
      tool,
      command,
      "--input",
      input,
      "--output-dir",
      destination
    ]);
    const created = await readdir(destination, { withFileTypes: true });
    assert.equal(created.length, 1, `${command} wrote an unexpected file count`);
    assert.ok(created[0].isFile());
  }
  assert.deepEqual(await fixtureHashes(), before);
});

test("accepted fixture produces identical structured bytes in two separate directories", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "fff-writer-determinism-"));
  t.after(async () => rm(root, { recursive: true, force: true }));
  const tool = path.join(REPO_ROOT, "tools", "fff-writer-source-adaptation.mjs");
  const input = path.join(FIXTURE_ROOT, "case-digest.prose.json");
  const hashes = [];
  for (const run of ["run-1", "run-2"]) {
    const destination = path.join(root, run);
    await execFile(process.execPath, [
      tool,
      "build-all",
      "--input",
      input,
      "--output-dir",
      destination
    ]);
    const [name] = await readdir(destination);
    hashes.push(hash(await readFile(path.join(destination, name))));
  }
  assert.equal(hashes[0], hashes[1]);
});

test("fixture-set regeneration matches committed structured outputs", async (t) => {
  const destination = await mkdtemp(
    path.join(os.tmpdir(), "fff-writer-fixture-set-")
  );
  t.after(async () => rm(destination, { recursive: true, force: true }));
  const built = await buildFixtureSet(
    path.join(FIXTURE_ROOT, "fixture-set.json"),
    destination
  );
  assert.equal(built.result.passed, true);
  for (const name of [
    "format-capacity-contract.json",
    "downstream-contract-map.json",
    ...Object.values(GENERATED_FIXTURES),
    "writer-source-adaptation-result.json"
  ]) {
    assert.equal(
      hash(await readFile(path.join(destination, name))),
      hash(await readFile(path.join(ARTIFACT_ROOT, name))),
      `${name} is not deterministically regenerated`
    );
  }
});

test("standalone readback contains required evidence with no scripts or external resources", async () => {
  const html = await readFile(
    path.join(ARTIFACT_ROOT, "writer-source-adaptation-readback.html"),
    "utf8"
  );
  for (const requiredText of [
    "Source spans",
    "Story Authority Ledger",
    "Format decision and capacity",
    "Rejected alternatives",
    "Accepted Narrative IR sections",
    "Unresolved author decisions",
    "Editorial Handoff summary"
  ]) {
    assert.ok(html.includes(requiredText), `readback lacks ${requiredText}`);
  }
  assert.doesNotMatch(html, /<script\b/iu);
  assert.doesNotMatch(html, /\bhttps?:\/\//iu);
  assert.doesNotMatch(html, /\bsrc\s*=/iu);
  assert.match(html, /@media\(max-width:720px\)/u);
});

test("protected product paths have no diff from the exact base", async () => {
  const protectedPaths = [
    "artifacts/private-raster-case-digest",
    "artifacts/private-raster-case-digest-result.json",
    "artifacts/narrative-format-quarantine",
    "artifacts/primary-imagery-quarantine",
    "artifacts/editorial-handoff",
    "artifacts/editorial-revision",
    "artifacts/editorial-derivative",
    "artifacts/production-blueprint"
  ];
  const result = await execFile(
    "git",
    ["diff", "--name-only", BASE, "--", ...protectedPaths],
    { cwd: REPO_ROOT }
  );
  assert.equal(result.stdout.trim(), "");
});

test("result records zero external, provider, credential, media, render, and public effects", async () => {
  const result = await readJson(
    path.join(ARTIFACT_ROOT, "writer-source-adaptation-result.json")
  );
  assert.equal(result.passed, true);
  assert.equal(result.determinism.structured_outputs_match, true);
  assert.ok(Object.values(result.external_effects).every((count) => count === 0));
  assert.equal(result.boundaries.local_only, true);
  assert.equal(result.boundaries.production_approved, false);
  assert.equal(result.boundaries.rights_cleared_claim, false);
  assert.equal(result.boundaries.final_canon, false);
  assert.equal(result.boundaries.push_performed, false);
});

test("direct builder remains deterministic and read-only", async () => {
  const input = path.join(FIXTURE_ROOT, "case-digest.prose.json");
  const first = await buildFixture(input);
  const second = await buildFixture(input);
  assert.equal(stableStringify(first), stableStringify(second));
});
