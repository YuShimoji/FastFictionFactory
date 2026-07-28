import assert from "node:assert/strict";
import { execFile as execFileCallback } from "node:child_process";
import { createHash } from "node:crypto";
import {
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import test from "node:test";
import {
  buildAll,
  buildWorkspaceModel,
  ingestMarkdown,
  renderWorkspace,
  validateDecisionSet
} from "../tools/fff-writer-decision-workspace.mjs";
import {
  stableStringify,
  validateAgainstSchema
} from "../tools/fff-writer-source-adaptation.mjs";

const execFile = promisify(execFileCallback);
const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const ARTIFACT_ROOT = path.join(
  REPO_ROOT,
  "artifacts",
  "writer-decision-workspace-v1"
);
const FIXTURE_ROOT = path.join(
  REPO_ROOT,
  "fixtures",
  "writer-decision-workspace"
);
const FIXTURE_SET = path.join(FIXTURE_ROOT, "fixture-set.json");
const TOOL = path.join(
  REPO_ROOT,
  "tools",
  "fff-writer-decision-workspace.mjs"
);
const PREDECESSOR = "11c30b264f8f257cc802ac218998479b805648e7";

const GENERATED_FILES = [
  "case-digest-markdown-intake-result.json",
  "fragment-before-decisions-result.json",
  "fragment-after-decisions-result.json",
  "writer-proposal-application-result.json",
  "successor-narrative-ir.json",
  "successor-editorial-handoff-input.json",
  "writer-decision-records.json",
  "writer-decision-workspace-result.json",
  "writer-decision-workspace.html"
];

function hash(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

test("all v1 schemas parse, validate samples, and reject malformed required fields", async () => {
  const samples = {
    "writer-decision-record.schema.json": (
      await readJson(path.join(FIXTURE_ROOT, "proposal-decisions.json"))
    ).records[0],
    "raw-markdown-intake.schema.json": await readJson(
      path.join(ARTIFACT_ROOT, "case-digest-markdown-intake-result.json")
    ),
    "proposal-application-result.schema.json": await readJson(
      path.join(ARTIFACT_ROOT, "writer-proposal-application-result.json")
    ),
    "successor-narrative-ir.schema.json": await readJson(
      path.join(ARTIFACT_ROOT, "successor-narrative-ir.json")
    )
  };
  for (const [name, sample] of Object.entries(samples)) {
    const schema = await readJson(path.join(ARTIFACT_ROOT, name));
    assert.deepEqual(
      validateAgainstSchema(sample, schema),
      [],
      `${name} rejected its generated sample`
    );
    const malformed = structuredClone(sample);
    delete malformed[schema.required[0]];
    assert.ok(
      validateAgainstSchema(malformed, schema).length > 0,
      `${name} accepted a missing ${schema.required[0]}`
    );
  }
});

test("actual CASE_DIGEST Markdown reconstructs exact lines, characters, and UTF-8 bytes", async () => {
  const intake = await readJson(
    path.join(ARTIFACT_ROOT, "case-digest-markdown-intake-result.json")
  );
  const bytes = await readFile(path.join(REPO_ROOT, intake.source.relative_path));
  const text = bytes.toString("utf8");
  assert.equal(hash(bytes), intake.source.utf8_sha256);
  assert.equal(bytes.length, intake.source.utf8_byte_size);
  assert.equal(hash(Buffer.from(text, "utf8")), intake.source.exact_text_sha256);
  assert.equal(intake.input_json_embeds_full_prose, false);
  assert.equal(intake.semantic_normalization_performed, false);
  for (const line of intake.line_spans) {
    const characterText = text.slice(
      line.character_range.start,
      line.character_range.end
    );
    const byteText = bytes
      .subarray(line.byte_range.start, line.byte_range.end)
      .toString("utf8");
    assert.equal(characterText, byteText);
    assert.equal(hash(Buffer.from(characterText, "utf8")), line.line_text_sha256);
  }
  for (const span of intake.segments) {
    const characterText = text.slice(
      span.character_range.start,
      span.character_range.end
    );
    const byteText = bytes
      .subarray(span.byte_range.start, span.byte_range.end)
      .toString("utf8");
    assert.equal(characterText, byteText);
    assert.equal(
      hash(Buffer.from(characterText, "utf8")),
      span.exact_text_sha256
    );
  }
  assert.equal(intake.reconstruction_passed, true);
});

test("UTF-8 .txt intake records mixed newline normalization without semantic rewriting", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "fff-writer-txt-"));
  t.after(async () => rm(root, { recursive: true, force: true }));
  const source = path.join(root, "sample.txt");
  const metadata = path.join(root, "sample.metadata.json");
  await writeFile(source, Buffer.from("一行目\r\n二行目\r三行目\n", "utf8"));
  await writeFile(
    metadata,
    stableStringify({
      schema_version: "fff.rawMarkdownMetadata.v1",
      source_id: "mixed-newline-txt",
      input_kind: "text_fixture",
      source_file_path: source,
      media_type: "text/plain",
      format_identity: null,
      target_duration_seconds: 1,
      semantic_normalization_allowed: false,
      newline_normalization: "record_only_lf_target",
      segments: [
        {
          segment_id: "mixed-lines",
          line_start: 1,
          line_end: 3,
          semantic_roles: ["fixture"]
        }
      ]
    })
  );
  const intake = await ingestMarkdown(source, metadata);
  assert.equal(intake.source.media_type, "text/plain");
  assert.deepEqual(intake.newline_normalization.original_counts, {
    LF: 1,
    CRLF: 1,
    CR: 1,
    EOF: 0
  });
  assert.equal(intake.newline_normalization.mapping.length, 3);
  assert.equal(intake.reconstruction_passed, true);
  assert.equal(intake.semantic_normalization_performed, false);
});

test("decision records are explicit and fail closed without accepted provenance", async (t) => {
  const valid = await validateDecisionSet(
    path.join(FIXTURE_ROOT, "proposal-decisions.json")
  );
  assert.equal(valid.record_count, 6);
  assert.ok(valid.validation_results.every((result) => result.valid));
  const root = await mkdtemp(path.join(os.tmpdir(), "fff-writer-decision-"));
  t.after(async () => rm(root, { recursive: true, force: true }));
  const invalidPath = path.join(root, "invalid.json");
  const invalid = await readJson(
    path.join(FIXTURE_ROOT, "proposal-decisions.json")
  );
  invalid.records[0].accepted_text_provenance = null;
  await writeFile(invalidPath, stableStringify(invalid));
  await assert.rejects(
    validateDecisionSet(invalidPath),
    /authorized text provenance|schema failure|expected type/u
  );
});

test("only accepted or replaced writer-authorized decisions alter the successor", async () => {
  const application = await readJson(
    path.join(ARTIFACT_ROOT, "writer-proposal-application-result.json")
  );
  const applied = application.decision_results.filter((result) => result.applied);
  assert.deepEqual(
    applied.map((result) => result.decision_record_id),
    [
      "decision-replace-opening-wording",
      "decision-accept-relation-explanation",
      "decision-accept-motive-undecided"
    ]
  );
  assert.ok(
    applied.every(
      (result) =>
        result.accepted_text_provenance.source_kind ===
        "writer_authored_proposal"
    )
  );
  assert.deepEqual(application.missing_decision_proposal_ids, [
    "proposal-clarify-moth-unknown",
    "proposal-remove-repeated-clue-wording"
  ]);
  assert.equal(
    application.decision_results.find(
      (result) => result.proposal_id === "proposal-reorder-evidence-and-allegation"
    ).applied,
    false
  );
  assert.equal(
    application.decision_results.find(
      (result) => result.proposal_id === "proposal-assert-council-guilt"
    ).application_status,
    "REJECTED_FORBIDDEN_UNSUPPORTED_INFERENCE"
  );
  assert.equal(application.unsupported_factual_claim_count, 0);
});

test("impact levels preserve local scope and trigger L3 format re-selection", async () => {
  const application = await readJson(
    path.join(ARTIFACT_ROOT, "writer-proposal-application-result.json")
  );
  assert.equal(application.regeneration_scope.l2_section_local_only, true);
  assert.deepEqual(application.regeneration_scope.affected_section_ids, [
    "case-digest-section-01-incident",
    "case-digest-section-03-ledger",
    "case-digest-section-04-council"
  ]);
  assert.equal(application.format_reselection.triggered, true);
  assert.equal(
    application.format_reselection.full_capacity_evaluation_performed,
    true
  );
  assert.equal(application.format_reselection.selected_before, "CASE_DIGEST");
  assert.equal(application.format_reselection.selected_after, "CASE_DIGEST");
  assert.equal(application.format_reselection.deferred_l3_applied, false);
});

test("successor identity is new, parent-bound, candidate-only, and exact-diffed", async () => {
  const application = await readJson(
    path.join(ARTIFACT_ROOT, "writer-proposal-application-result.json")
  );
  const successor = application.successor_narrative_ir;
  assert.notEqual(
    successor.narrative_ir_id,
    application.base_narrative_ir_identity.narrative_ir_id
  );
  assert.deepEqual(
    successor.parent_narrative_ir_identity,
    application.base_narrative_ir_identity
  );
  assert.equal(successor.candidate_only, true);
  assert.equal(successor.final_canon, false);
  const unresolvedProposalIds = successor.unresolved_author_decisions
    .map((decision) => decision.proposal_id)
    .filter(Boolean);
  assert.ok(unresolvedProposalIds.includes("proposal-clarify-moth-unknown"));
  assert.ok(
    unresolvedProposalIds.includes("proposal-remove-repeated-clue-wording")
  );
  assert.ok(
    !unresolvedProposalIds.includes("proposal-add-relation-explanation")
  );
  assert.ok(
    !unresolvedProposalIds.includes("proposal-mark-council-motive-undecided")
  );
  assert.ok(successor.structural_diff.length >= 3);
  for (const diff of successor.structural_diff) {
    assert.equal(
      hash(Buffer.from(stableStringify(diff.before), "utf8")),
      diff.before_sha256
    );
    assert.equal(
      hash(Buffer.from(stableStringify(diff.after), "utf8")),
      diff.after_sha256
    );
  }
});

test("fragment fixture remains incomplete before decisions and becomes a bounded candidate after", async () => {
  const before = await readJson(
    path.join(ARTIFACT_ROOT, "fragment-before-decisions-result.json")
  );
  const after = await readJson(
    path.join(ARTIFACT_ROOT, "fragment-after-decisions-result.json")
  );
  assert.equal(before.complete, false);
  assert.deepEqual(before.information_order, [null, null, null]);
  assert.equal(before.missing_causal_link_count, 2);
  assert.equal(before.handoff_available, false);
  assert.equal(before.editorial_handoff_input, null);
  assert.equal(after.complete, true);
  assert.deepEqual(after.information_order, [
    "fragment-incident",
    "fragment-clue-chain",
    "fragment-council-limit"
  ]);
  assert.equal(after.missing_causal_link_count, 0);
  assert.equal(after.format_selection.selected_format, "CASE_DIGEST");
  assert.equal(after.format_selection.format_reselection_triggered, true);
  assert.equal(after.handoff_available, true);
  assert.equal(
    after.editorial_handoff_input.consumer_compatibility.compatible,
    true
  );
  assert.equal(after.mechanism_proof_only, true);
  assert.equal(after.project_canon_established, false);
  assert.equal(after.literary_quality_established, false);
  assert.equal(after.production_ready, false);
});

test("accepted CASE_DIGEST remains five-section, source-bound, and fact-stable", async () => {
  const intake = await readJson(
    path.join(ARTIFACT_ROOT, "case-digest-markdown-intake-result.json")
  );
  assert.equal(intake.case_digest_stability.selected_format_before, "CASE_DIGEST");
  assert.equal(intake.case_digest_stability.selected_format_after, "CASE_DIGEST");
  assert.equal(intake.case_digest_stability.five_section_semantics_stable, true);
  assert.equal(
    intake.case_digest_stability.source_spans_resolve_to_actual_markdown_bytes,
    true
  );
  assert.equal(
    intake.case_digest_stability.handoff_field_family_compatible,
    true
  );
  assert.equal(intake.case_digest_stability.unsupported_factual_claim_count, 0);
});

test("successor Handoff validates against the unchanged v0 input contract", async () => {
  const handoff = await readJson(
    path.join(ARTIFACT_ROOT, "successor-editorial-handoff-input.json")
  );
  const schema = await readJson(
    path.join(
      REPO_ROOT,
      "artifacts",
      "writer-source-adaptation-v0",
      "editorial-handoff-input.schema.json"
    )
  );
  assert.deepEqual(validateAgainstSchema(handoff, schema), []);
  assert.equal(handoff.consumer_compatibility.compatible, true);
  assert.deepEqual(
    Object.values(handoff.closed_flags),
    [false, false, false, false, false, false, false]
  );
  assert.equal(handoff.candidate_only, true);
  assert.equal(handoff.final_canon, false);
});

test("build-all is deterministic and matches every committed generated file", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "fff-writer-v1-build-"));
  t.after(async () => rm(root, { recursive: true, force: true }));
  const runOne = path.join(root, "run-1");
  const runTwo = path.join(root, "run-2");
  const first = await buildAll(FIXTURE_SET, runOne);
  const second = await buildAll(FIXTURE_SET, runTwo);
  assert.equal(first.deterministic_hash, second.deterministic_hash);
  for (const name of GENERATED_FILES) {
    const committed = await readFile(path.join(ARTIFACT_ROOT, name));
    const firstBytes = await readFile(path.join(runOne, name));
    const secondBytes = await readFile(path.join(runTwo, name));
    assert.equal(hash(firstBytes), hash(secondBytes), `${name} changed between runs`);
    assert.equal(hash(firstBytes), hash(committed), `${name} differs from committed output`);
  }
});

test("each CLI action requires an explicit output directory and writes only there", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "fff-writer-v1-cli-"));
  t.after(async () => rm(root, { recursive: true, force: true }));
  const validation = await execFile(process.execPath, [
    TOOL,
    "validate-decision-record",
    "--input",
    path.join(FIXTURE_ROOT, "proposal-decisions.json")
  ]);
  const validationResult = JSON.parse(validation.stdout);
  assert.equal(validationResult.writes_performed, 0);
  await assert.rejects(
    execFile(process.execPath, [
      TOOL,
      "validate-decision-record",
      "--input",
      path.join(FIXTURE_ROOT, "proposal-decisions.json"),
      "--output-dir",
      path.join(root, "forbidden")
    ])
  );
  const commands = [
    "apply-decisions",
    "rebuild-format-selection",
    "build-successor-ir",
    "build-successor-handoff",
    "build-decision-workspace"
  ];
  for (const command of commands) {
    await assert.rejects(
      execFile(process.execPath, [
        TOOL,
        command,
        "--fixture-set",
        FIXTURE_SET
      ]),
      /Missing --output-dir/u
    );
    const output = path.join(root, command);
    await execFile(process.execPath, [
      TOOL,
      command,
      "--fixture-set",
      FIXTURE_SET,
      "--output-dir",
      output
    ]);
    assert.equal((await readdir(output)).length, 1);
  }
});

test("standalone workspace is read-only, responsive, inline, and externally silent", async () => {
  const model = await buildWorkspaceModel(FIXTURE_SET);
  const generated = renderWorkspace(model);
  const committed = await readFile(
    path.join(ARTIFACT_ROOT, "writer-decision-workspace.html"),
    "utf8"
  );
  assert.equal(generated, committed);
  for (const required of [
    "Actual source and byte spans",
    "Proposal decisions and provenance",
    "Before / after Narrative IR",
    "Format and fragment completion",
    "Successor Handoff summary",
    "Unresolved author and canon boundary"
  ]) {
    assert.ok(committed.includes(required), `HTML lacks ${required}`);
  }
  assert.equal((committed.match(/<script\b/gu) ?? []).length, 1);
  assert.doesNotMatch(committed, /\bhttps?:\/\//iu);
  assert.doesNotMatch(committed, /<(?:img|audio|video|iframe)\b/iu);
  assert.match(committed, /<link rel="icon" href="data:,">/u);
  assert.match(committed, /@media\(max-width:760px\)/u);
  assert.match(committed, /saveControlCount:0/u);
  assert.match(committed, /data-runtime-ready="false"/u);
});

test("predecessor, accepted source, downstream consumer, and product paths remain unchanged", async () => {
  const protectedPaths = [
    "artifacts/writer-source-adaptation-v0",
    "fixtures/writer-source-adaptation",
    "tools/fff-writer-source-adaptation.mjs",
    "tests/fff-writer-source-adaptation.test.mjs",
    "docs/architecture/WRITER_SOURCE_ADAPTATION_V0.md",
    "docs/review/writer-source-adaptation-v0.md",
    "artifacts/private-raster-case-digest",
    "artifacts/private-raster-case-digest-result.json",
    "artifacts/editorial-handoff",
    "artifacts/editorial-revision",
    "artifacts/editorial-derivative",
    "artifacts/production-blueprint",
    "artifacts/private-full-raster-clarity-candidate/narrative-visual-binding-contract.json"
  ];
  const { stdout } = await execFile(
    "git",
    ["diff", "--name-only", PREDECESSOR, "--", ...protectedPaths],
    { cwd: REPO_ROOT }
  );
  assert.equal(stdout.trim(), "");
});

test("result records no provider, model, network, media, production, rights, canon, or public effect", async () => {
  const result = await readJson(
    path.join(ARTIFACT_ROOT, "writer-decision-workspace-result.json")
  );
  assert.equal(result.passed, true);
  assert.equal(result.failures.length, 0);
  assert.ok(Object.values(result.external_effects).every((count) => count === 0));
  assert.equal(result.boundaries.production_approved, false);
  assert.equal(result.boundaries.rights_cleared_claim, false);
  assert.equal(result.boundaries.release_ready, false);
  assert.equal(result.boundaries.production_ready_script, false);
  assert.equal(result.boundaries.arbitrary_novel_adaptation, false);
  assert.equal(result.boundaries.literary_quality_claim, false);
  assert.equal(result.boundaries.automatic_canon_completion, false);
  assert.equal(result.boundaries.final_canon, false);
  assert.equal(result.boundaries.push_performed, false);
  assert.equal(result.html_runtime_contract.runtime_validation_performed, true);
  assert.equal(result.html_runtime_contract.runtime_ready, true);
  assert.ok(
    result.html_runtime_contract.tested_viewports.every(
      (viewport) => viewport.horizontal_overflow === false
    )
  );
  assert.equal(result.html_runtime_contract.console_error_count, 0);
  assert.equal(result.html_runtime_contract.external_request_count, 0);
});
