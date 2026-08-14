import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const toolPath = "tools/fff-case-digest-production-state.mjs";
const statePath = "artifacts/case-digest-production-state.json";
const supportRegistryPath = "artifacts/case-digest-literal-fact-support-registry.json";
const presentationInventoryPath = "artifacts/case-digest-presentation-provenance-rights-inventory.json";
const packageDir = "artifacts/private-raster-case-digest-ichiro-successor-20260813-001";

const readJson = (relativePath) => JSON.parse(readFileSync(resolve(repoRoot, relativePath), "utf8"));
const sha256 = (relativePath) => createHash("sha256").update(readFileSync(resolve(repoRoot, relativePath))).digest("hex");
const sha256Text = (value) => createHash("sha256").update(value, "utf8").digest("hex");

function literalLocator(quote) {
  const projectState = readJson("artifacts/current-project-state.json");
  const start = projectState.rawMemo.indexOf(quote);
  assert.ok(start >= 0, `quote not found in rawMemo: ${quote}`);
  return {
    locator_class: "literal_author_memo_span",
    source_binding_role: "project_state",
    json_pointer: "/rawMemo",
    offset_range: {
      start,
      end: start + quote.length,
      unit: "utf16_code_unit"
    },
    exact_quote: quote,
    quote_sha256: sha256Text(quote)
  };
}

function locatorSpanKey(locator) {
  return `${locator.json_pointer}#${locator.offset_range.start}:${locator.offset_range.end}@${locator.quote_sha256}`;
}

function runVerifier(optionalStatePath, optionalInventoryPath) {
  const args = [toolPath, "verify"];
  if (optionalStatePath || optionalInventoryPath) args.push(optionalStatePath || statePath);
  if (optionalInventoryPath) args.push(optionalInventoryPath);
  const result = spawnSync(process.execPath, args, { cwd: repoRoot, encoding: "utf8" });
  return { ...result, report: JSON.parse(result.stdout) };
}

function verifyInventoryMutation(mutator) {
  const directory = mkdtempSync(join(tmpdir(), "fff-presentation-inventory-"));
  try {
    const candidate = readJson(presentationInventoryPath);
    mutator(candidate);
    const candidatePath = join(directory, "candidate.json");
    writeFileSync(candidatePath, JSON.stringify(candidate, null, 2));
    return runVerifier(undefined, candidatePath);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function verifyMutation(mutator) {
  const directory = mkdtempSync(join(tmpdir(), "fff-production-state-"));
  try {
    const candidate = readJson(statePath);
    mutator(candidate);
    const candidatePath = join(directory, "candidate.json");
    writeFileSync(candidatePath, JSON.stringify(candidate, null, 2));
    return runVerifier(candidatePath);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("production state verifier recomputes the straight-line current position", () => {
  const result = runVerifier();
  assert.equal(result.status, 0, result.stderr + "\n" + result.stdout);
  assert.equal(result.report.status, "PASS");
  assert.equal(result.report.identity.content_lane, "NON_DENSOU_CASE_DIGEST");
  assert.equal(result.report.identity.densou_identity, "OUT_OF_LANE");
  assert.equal(result.report.metrics.facts, 28);
  assert.equal(result.report.metrics.profiles, 11);
  assert.equal(result.report.metrics.relationship_edges, 18);
  assert.equal(result.report.metrics.claims, 9);
  assert.equal(result.report.metrics.events, 8);
  assert.equal(result.report.metrics.literal_fact_support_contracts, 23);
  assert.equal(result.report.metrics.authored_beats, 5);
  assert.equal(result.report.metrics.shots, 11);
  assert.equal(result.report.metrics.objective_audio_cues, 11);
  assert.equal(result.report.metrics.presentation_source_kind_inventory_records, 11);
  assert.equal(result.report.metrics.presentation_technical_usability_inventory_records, 11);
  assert.equal(result.report.metrics.presentation_owner_acceptance_inventory_records, 11);
  assert.equal(result.report.metrics.presentation_provenance_status_inventory_records, 11);
  assert.equal(result.report.metrics.presentation_repository_chains_observed, 9);
  assert.equal(result.report.metrics.presentation_recorded_chains_source_bytes_not_repository_bound, 2);
  assert.equal(result.report.metrics.presentation_rights_evidence_present, 0);
  assert.equal(result.report.metrics.presentation_rights_evidence_absent, 11);
  assert.equal(result.report.metrics.presentation_rights_evidence_unresolved, 0);
  assert.equal(result.report.metrics.presentation_rights_decisions_unresolved, 11);
  assert.equal(result.report.metrics.active_requirement_records, 42);
  assert.equal(result.report.metrics.unique_integer_requirement_orders, 42);
  assert.equal(result.report.metrics.satisfied_requirements, 29);
  assert.equal(result.report.metrics.unsatisfied_requirements, 3);
  assert.equal(result.report.metrics.blocked_by_dependency_requirements, 10);
  assert.equal(result.report.metrics.not_applicable_requirements, 0);
  assert.equal(result.report.schema_version, "fff.caseDigestProductionStateVerification.v2");
  assert.equal(result.report.metrics.literal_author_memo_locators, 23);
  assert.equal(result.report.metrics.literal_author_memo_locator_requirement, 23);
  assert.equal(result.report.metrics.audited_literal_author_memo_locators, 23);
  assert.equal(result.report.metrics.unique_literal_locator_spans, 23);
  assert.equal(result.report.metrics.shared_literal_locator_span_groups, 0);
  assert.equal(result.report.metrics.overbroad_literal_locator_spans, 1);
  assert.equal(result.report.metrics.whole_raw_memo_locator_spans, 0);
  assert.equal(result.report.metrics.invalid_literal_author_memo_locators, 0);
  assert.equal(result.report.metrics.nonliteral_source_classifications, 5);
  assert.equal(result.report.metrics.nonliteral_source_classification_requirement, 5);
  assert.equal(result.report.metrics.unclassified_source_records, 0);
  assert.equal(result.report.first_failed_requirement, "C.PRODUCTION_SELECTED_BEATS");
  assert.equal(result.report.first_failed_requirement_owner, "human_owned");
  assert.deepEqual(result.report.control_alignment, {
    model_id: "content-production-lanes/v1",
    portable_coordinator_locator: "docs/content-production-lanes-v1.md",
    sha256: "ba2042aea1e0c9fd07718ecb0dc3d26f119114db60ee6e7d374a6d8ee8df2968",
    scope: "CONTROL_ONLY",
    project_authority_owner: "docs/production-lanes.md",
    project_authority_replaced: false
  });
  assert.equal(result.report.wrong_fact_support_issue_count, 0);
  assert.equal(result.report.legacy_review_surface, "PARKED_PRESENTATION_EVIDENCE");
  const requirements = result.report.requirement_vectors.flatMap((stage) => stage.requirement_vectors);
  assert.ok(requirements.every((entry) =>
    Number.isInteger(entry.order)
      && Number.isInteger(entry.observed)
      && Number.isInteger(entry.required)
      && typeof entry.unit === "string"
      && typeof entry.lane === "string"
      && typeof entry.project_lane === "string"
      && typeof entry.owner === "string"
      && Array.isArray(entry.depends_on)
      && typeof entry.evidence === "string"
      && typeof entry.authority_effect === "string"
      && entry.authority_effect.includes("may_change=")
      && entry.authority_effect.includes("may_not_change=")
  ));
  assert.equal(new Set(requirements.map((entry) => entry.order)).size, 42);
  assert.equal(requirements.find((entry) => entry.requirement_id === "C.PRODUCTION_SELECTED_BEATS").order, 16);
  assert.equal(requirements.find((entry) => entry.requirement_id === "C.PRODUCTION_SELECTED_BEATS").status, "UNSATISFIED");
  assert.equal(requirements.find((entry) => entry.requirement_id === "D.PROVENANCE_STATUS_INVENTORY_RECORDS").status, "SATISFIED");
  assert.equal(requirements.find((entry) => entry.requirement_id === "D.SCREEN_EFFECT_BEAT_RECORDS").status, "BLOCKED_BY_DEPENDENCY");
  assert.equal(requirements.find((entry) => entry.requirement_id === "D.RIGHTS_CLEARED_PRIMARY_CHOICES").status, "BLOCKED_BY_DEPENDENCY");
  assert.equal(requirements.some((entry) => entry.status === "N/A"), false);
  assert.deepEqual(result.report.side_effects, {
    playback_performed: false,
    media_written: false,
    external_call: false,
    dependency_install: false
  });
  assert.deepEqual(result.report.issues, []);
});

test("first-failed selection is stable when stage and requirement arrays are reordered", () => {
  const result = verifyMutation((state) => {
    state.production_ladder.reverse();
    for (const stage of state.production_ladder) stage.requirement_vectors.reverse();
  });
  assert.equal(result.status, 0, result.stderr + "\n" + result.stdout);
  assert.equal(result.report.status, "PASS");
  assert.equal(result.report.first_failed_requirement, "C.PRODUCTION_SELECTED_BEATS");
  assert.equal(result.report.first_failed_requirement_owner, "human_owned");
  assert.deepEqual(result.report.issues, []);
});

test("missing non-integer and duplicate requirement orders fail closed", () => {
  const missing = verifyMutation((state) => {
    delete state.production_ladder.flatMap((stage) => stage.requirement_vectors)
      .find((entry) => entry.requirement_id === "C.PRODUCTION_SELECTED_BEATS").order;
  });
  assert.equal(missing.status, 1);
  assert.ok(missing.report.issues.some((entry) => entry.code === "REQUIREMENT_ORDER_MISSING_C.PRODUCTION_SELECTED_BEATS"));

  const nonInteger = verifyMutation((state) => {
    state.production_ladder.flatMap((stage) => stage.requirement_vectors)
      .find((entry) => entry.requirement_id === "C.PRODUCTION_SELECTED_BEATS").order = 16.5;
  });
  assert.equal(nonInteger.status, 1);
  assert.ok(nonInteger.report.issues.some((entry) => entry.code === "REQUIREMENT_ORDER_NON_INTEGER_C.PRODUCTION_SELECTED_BEATS"));

  const duplicate = verifyMutation((state) => {
    state.production_ladder.flatMap((stage) => stage.requirement_vectors)
      .find((entry) => entry.requirement_id === "C.PRODUCTION_SELECTED_BEATS").order = 15;
  });
  assert.equal(duplicate.status, 1);
  assert.ok(duplicate.report.issues.some((entry) => entry.code === "REQUIREMENT_ORDER_DUPLICATE"));
});

test("an active missing gate cannot be recast as not applicable", () => {
  const result = verifyMutation((state) => {
    const requirement = state.production_ladder.flatMap((stage) => stage.requirement_vectors)
      .find((entry) => entry.requirement_id === "C.PRODUCTION_SELECTED_BEATS");
    requirement.status = "N/A";
    requirement.na_reason = "plot selection still exists but has not happened";
    requirement.na_dependency_effect = "would incorrectly release downstream dependencies";
  });
  assert.equal(result.status, 1);
  assert.ok(result.report.issues.some((entry) => entry.code === "REQUIREMENT_MISSING_GATE_MISCLASSIFIED_NA_C.PRODUCTION_SELECTED_BEATS"));
});

test("a genuine N/A record would require an explicit reason and dependency effect", () => {
  const result = verifyMutation((state) => {
    const requirement = state.production_ladder.flatMap((stage) => stage.requirement_vectors)
      .find((entry) => entry.requirement_id === "C.PRODUCTION_SELECTED_BEATS");
    requirement.status = "N/A";
  });
  assert.equal(result.status, 1);
  assert.ok(result.report.issues.some((entry) => entry.code === "REQUIREMENT_NA_REASON_MISSING_C.PRODUCTION_SELECTED_BEATS"));
  assert.ok(result.report.issues.some((entry) => entry.code === "REQUIREMENT_NA_DEPENDENCY_EFFECT_MISSING_C.PRODUCTION_SELECTED_BEATS"));
});

test("presentation provenance and rights inventory classifies all eleven shots without granting rights", () => {
  const inventory = readJson(presentationInventoryPath);
  assert.equal(inventory.schema_version, "fff.caseDigestPresentationProvenanceRightsInventory.v1");
  assert.equal(inventory.records.length, 11);
  assert.deepEqual(inventory.observed_status_counts.source_kinds, {
    generated_raster: 7,
    accepted_generated_raster_anchor: 2,
    deterministic_raster_composite: 2
  });
  assert.equal(inventory.observed_status_counts.technically_usable, 11);
  assert.equal(inventory.observed_status_counts.owner_accepted_primary_image, 11);
  assert.equal(inventory.observed_status_counts.provenance_observed, 11);
  assert.equal(inventory.observed_status_counts.repository_chain_observed, 9);
  assert.equal(inventory.observed_status_counts.recorded_chain_source_bytes_not_repository_bound, 2);
  assert.equal(inventory.observed_status_counts.rights_evidence_present, 0);
  assert.equal(inventory.observed_status_counts.rights_evidence_absent, 11);
  assert.equal(inventory.observed_status_counts.rights_evidence_unresolved, 0);
  assert.equal(inventory.observed_status_counts.rights_decision_unresolved, 11);
  assert.equal(inventory.observed_status_counts.rights_cleared, 0);
  assert.ok(inventory.records.every((record) => record.rights_cleared === false && record.production_selected === false));
});

test("missing or unknown provenance cannot masquerade as rights clearance", () => {
  const result = verifyInventoryMutation((inventory) => {
    const record = inventory.records.find((entry) => entry.shot_id === "shot-b01-01");
    record.provenance = { status: "UNKNOWN", observed: false, chain_steps: [] };
    record.rights_clearance_status = "CLEARED";
    record.rights_cleared = true;
    inventory.observed_status_counts.provenance_observed = 10;
    inventory.observed_status_counts.repository_chain_observed = 8;
    inventory.observed_status_counts.rights_cleared = 1;
  });
  assert.equal(result.status, 1);
  assert.equal(result.report.status, "FAIL");
  assert.ok(result.report.issues.some((entry) => entry.code === "D_PRESENTATION_PROVENANCE_CHAIN_shot-b01-01"));
  assert.ok(result.report.issues.some((entry) => entry.code === "D_UNKNOWN_PROVENANCE_CANNOT_CLEAR_shot-b01-01"));
  assert.ok(result.report.issues.some((entry) => entry.code === "D_RIGHTS_CLEARANCE_WITHOUT_EXPLICIT_AUTHORITY_shot-b01-01"));
});

test("generated or derived raster compatibility cannot self-grant rights", () => {
  const result = verifyInventoryMutation((inventory) => {
    const record = inventory.records.find((entry) => entry.shot_id === "shot-b06-01");
    record.rights_evidence_status = "PRESENT_SELF_CLAIM";
    record.rights_clearance_status = "CLEARED";
    record.rights_cleared = true;
    inventory.observed_status_counts.rights_evidence_present = 1;
    inventory.observed_status_counts.rights_evidence_absent = 10;
    inventory.observed_status_counts.rights_cleared = 1;
  });
  assert.equal(result.status, 1);
  assert.equal(result.report.status, "FAIL");
  assert.ok(result.report.issues.some((entry) => entry.code === "D_RASTER_COMPATIBILITY_SELF_GRANTED_RIGHTS_shot-b06-01"));
  assert.ok(result.report.issues.some((entry) => entry.code === "D_RIGHTS_CLEARANCE_WITHOUT_EXPLICIT_AUTHORITY_shot-b06-01"));
});

test("dependency DAG isolates replaceable materials from reference and plot authority", () => {
  const state = readJson(statePath);
  const edges = new Set(state.dependency_dag.edges.map((edge) => `${edge.from}->${edge.to}`));
  assert.equal(edges.has("A_REPLACEABLE_ASSETS_AND_METADATA->B_STORY_REFERENCE_MODEL"), false);
  assert.equal(edges.has("A_REPLACEABLE_ASSETS_AND_METADATA->C_AUTHORED_PLOT_SPINE"), false);
  assert.equal(state.lanes.A_REPLACEABLE_ASSETS_AND_METADATA.may_overwrite_plot_or_presentation_authority, false);
  assert.equal(state.lanes.B_STORY_REFERENCE_MODEL.auto_create_plot_beats, false);
  assert.equal(state.lanes.C_AUTHORED_PLOT_SPINE.generated_from_reference_coverage, false);
  assert.equal(state.lanes.D_STORY_PRESENTATION.nested_under, "STORY");
  assert.equal(state.lanes.E_INTEGRATION_CHECK.may_promote_evidence_to_acceptance, false);
});

test("reference coverage cannot silently create or accept a plot beat", () => {
  const result = verifyMutation((state) => {
    state.lanes.B_STORY_REFERENCE_MODEL.auto_create_plot_beats = true;
    state.lanes.C_AUTHORED_PLOT_SPINE.beats[0].production_selected = true;
  });
  assert.equal(result.status, 1);
  assert.equal(result.report.status, "FAIL");
  assert.ok(result.report.issues.some((entry) => entry.code === "B_PLOT_AUTHORITY_auto_create_plot_beats"));
  assert.ok(result.report.issues.some((entry) => entry.code === "C_BEAT_SILENT_SELECTION_case-digest-beat-01-anomaly"));
});

test("replaceable assets and integration checks cannot acquire creative authority", () => {
  const result = verifyMutation((state) => {
    state.lanes.A_REPLACEABLE_ASSETS_AND_METADATA.may_overwrite_plot_or_presentation_authority = true;
    state.lanes.E_INTEGRATION_CHECK.may_choose_content = true;
  });
  assert.equal(result.status, 1);
  assert.ok(result.report.issues.some((entry) => entry.code === "A_AUTHORITY_OVERWRITE"));
  assert.ok(result.report.issues.some((entry) => entry.code === "E_AUTHORITY_LEAK_may_choose_content"));
});

test("prose labels and declared review questions cannot inflate stage progress", () => {
  const result = verifyMutation((state) => {
    state.authority.declared_axis_counts_as_progress = true;
    state.production_ladder[0].requirement_vectors[0].observed += 1;
    state.production_ladder[0].progress = { scalar_completion: true };
  });
  assert.equal(result.status, 1);
  assert.ok(result.report.issues.some((entry) => entry.code === "DECLARED_AXIS_PROGRESS_LEAK"));
  assert.ok(result.report.issues.some((entry) => entry.code === "REQUIREMENT_FIELD_observed_B.FACT_RECORDS"));
  assert.ok(result.report.issues.some((entry) => entry.code === "LADDER_SCALAR_PROGRESS_FORBIDDEN_REFERENCE_MODEL"));
});

test("the materialized Mira locator resolves to rawMemo and its accepted fact support contract", () => {
  const state = readJson(statePath);
  const fact = state.lanes.B_STORY_REFERENCE_MODEL.fact_table.find((entry) => entry.id === "el-person-001");
  assert.deepEqual(fact.source_locator, literalLocator("Mira Vale"));
  const result = runVerifier();
  assert.equal(result.status, 0, result.stderr + "\n" + result.stdout);
  assert.equal(result.report.metrics.literal_author_memo_locators, 23);
  assert.equal(result.report.first_failed_requirement, "C.PRODUCTION_SELECTED_BEATS");
  assert.deepEqual(result.report.issues, []);
});

test("the versioned literal support registry explicitly covers every author-memo fact", () => {
  const state = readJson(statePath);
  const registry = readJson(supportRegistryPath);
  const authorMemoFactIds = state.lanes.B_STORY_REFERENCE_MODEL.fact_table
    .filter((fact) => fact.source_status === "author_memo")
    .map((fact) => fact.id)
    .sort();
  const contractFactIds = registry.fact_support_contracts.map((contract) => contract.fact_id).sort();
  assert.equal(registry.schema_version, "fff.caseDigestLiteralFactSupportRegistry.v1");
  assert.equal(registry.source_contract.support_rule, "quote_contains_all_required_anchors_exact_case");
  assert.equal(registry.source_contract.runtime_title_derivation_allowed, false);
  assert.equal(registry.source_contract.fuzzy_matching_allowed, false);
  assert.equal(registry.source_contract.llm_judgment_allowed, false);
  assert.deepEqual(contractFactIds, authorMemoFactIds);
  assert.equal(new Set(contractFactIds).size, 23);
});

test("a valid Toma rawMemo span cannot satisfy the Mira fact support contract", () => {
  const result = verifyMutation((state) => {
    state.lanes.B_STORY_REFERENCE_MODEL.fact_table.find((entry) => entry.id === "el-person-001").source_locator = literalLocator("Toma Vale");
  });
  assert.equal(result.status, 1);
  assert.equal(result.report.metrics.literal_author_memo_locators, 22);
  assert.equal(result.report.metrics.invalid_literal_author_memo_locators, 1);
  assert.equal(result.report.wrong_fact_support_issue_count, 1);
  const issue = result.report.issues.find((entry) => entry.code === "B_LITERAL_WRONG_FACT_SUPPORT_el-person-001");
  assert.ok(issue);
  assert.equal(issue.detail.fact_id, "el-person-001");
  assert.deepEqual(issue.detail.missing_required_anchors, ["Mira Vale"]);
});

test("an otherwise valid shared literal span fails unless its duplicate use is explicitly audited", () => {
  const result = verifyMutation((state) => {
    const facts = state.lanes.B_STORY_REFERENCE_MODEL.fact_table;
    const eventLocator = facts.find((entry) => entry.id === "el-event-001").source_locator;
    facts.find((entry) => entry.id === "el-timeline-001").source_locator = structuredClone(eventLocator);
  });
  assert.equal(result.status, 1);
  assert.ok(result.report.issues.some((entry) => entry.code === "B_LITERAL_DUPLICATE_SPAN_AUDIT_MISMATCH"));
  assert.ok(result.report.issues.some((entry) => entry.code === "B_LITERAL_LOCATOR_AUDIT_UNIQUE_COUNT"));
});

test("distinct fact contracts may share one supporting sentence only with an explicit audit group", () => {
  const result = verifyMutation((state) => {
    const lane = state.lanes.B_STORY_REFERENCE_MODEL;
    const eventLocator = lane.fact_table.find((entry) => entry.id === "el-event-001").source_locator;
    lane.fact_table.find((entry) => entry.id === "el-timeline-001").source_locator = structuredClone(eventLocator);
    lane.literal_locator_audit.unique_exact_span_count = 22;
    lane.literal_locator_audit.shared_span_groups = [{
      span_key: locatorSpanKey(eventLocator),
      fact_ids: ["el-event-001", "el-timeline-001"],
      reason_code: "DISTINCT_FACT_CONTRACTS_SHARE_EXACT_SUPPORTING_SPAN"
    }];
  });
  assert.equal(result.status, 0, result.stderr + "\n" + result.stdout);
  assert.equal(result.report.metrics.literal_author_memo_locators, 23);
  assert.equal(result.report.metrics.unique_literal_locator_spans, 22);
  assert.equal(result.report.metrics.shared_literal_locator_span_groups, 1);
  assert.deepEqual(result.report.issues, []);
});

test("the one accepted multi-section span must stay visible in the overbroad audit", () => {
  const result = verifyMutation((state) => {
    state.lanes.B_STORY_REFERENCE_MODEL.literal_locator_audit.overbroad_span_records = [];
  });
  assert.equal(result.status, 1);
  assert.ok(result.report.issues.some((entry) => entry.code === "B_LITERAL_OVERBROAD_SPAN_AUDIT_MISMATCH"));
});

test("an arbitrary nonempty source locator string is rejected", () => {
  const result = verifyMutation((state) => {
    state.lanes.B_STORY_REFERENCE_MODEL.fact_table.find((entry) => entry.id === "el-person-001").source_locator = "Mira Vale";
  });
  assert.equal(result.status, 1);
  assert.ok(result.report.issues.some((entry) => entry.code === "B_LITERAL_LOCATOR_RECORD_TYPE_el-person-001"));
});

test("a literal locator with out-of-range offsets is rejected", () => {
  const result = verifyMutation((state) => {
    const locator = literalLocator("Mira Vale");
    locator.offset_range.start = 999999;
    locator.offset_range.end = 1000008;
    state.lanes.B_STORY_REFERENCE_MODEL.fact_table.find((entry) => entry.id === "el-person-001").source_locator = locator;
  });
  assert.equal(result.status, 1);
  assert.ok(result.report.issues.some((entry) => entry.code === "B_LITERAL_OFFSET_RANGE_el-person-001"));
});

test("literal locator quote slices and quote hashes must both match", () => {
  const result = verifyMutation((state) => {
    const quoteMismatch = literalLocator("Mira Vale");
    quoteMismatch.exact_quote = "Toma Vale";
    quoteMismatch.quote_sha256 = sha256Text("Toma Vale");
    state.lanes.B_STORY_REFERENCE_MODEL.fact_table.find((entry) => entry.id === "el-person-001").source_locator = quoteMismatch;

    const hashMismatch = literalLocator("Toma Vale");
    hashMismatch.quote_sha256 = "0".repeat(64);
    state.lanes.B_STORY_REFERENCE_MODEL.fact_table.find((entry) => entry.id === "el-person-002").source_locator = hashMismatch;
  });
  assert.equal(result.status, 1);
  assert.ok(result.report.issues.some((entry) => entry.code === "B_LITERAL_QUOTE_SLICE_el-person-001"));
  assert.ok(result.report.issues.some((entry) => entry.code === "B_LITERAL_QUOTE_HASH_el-person-002"));
});

test("derived inferred and missing-decision records cannot masquerade as literal spans", () => {
  const result = verifyMutation((state) => {
    const fact = state.lanes.B_STORY_REFERENCE_MODEL.fact_table.find((entry) => entry.id === "el-foreshadow-001");
    fact.source_locator = literalLocator("9:17");
  });
  assert.equal(result.status, 1);
  assert.ok(result.report.issues.some((entry) => entry.code === "B_NONLITERAL_CLASS_SOURCE_MISMATCH_el-foreshadow-001"));
  assert.ok(result.report.issues.some((entry) => entry.code === "B_NONLITERAL_MASQUERADES_AS_LITERAL_el-foreshadow-001"));
});

test("rejected or unselected ending references cannot affirm or select a plot ending", () => {
  const result = verifyMutation((state) => {
    const beat = state.lanes.C_AUTHORED_PLOT_SPINE.beats.find((entry) => entry.beat_id === "case-digest-beat-05-open-status");
    beat.unresolved_candidate_refs = beat.unresolved_candidate_refs.filter((ref) => !["claim-ending-restores-hour", "timeline-ending-hour-return"].includes(ref));
    beat.rejected_reference_refs = [];
    beat.affirmative_support_refs.push("claim-ending-restores-hour", "timeline-ending-hour-return", "profile-final-answer-ghost");
    beat.production_selected = true;
  });
  assert.equal(result.status, 1);
  assert.ok(result.report.issues.some((entry) => entry.code === "C_AFFIRMATIVE_REF_CANDIDATE_ENDING_case-digest-beat-05-open-status"));
  assert.ok(result.report.issues.some((entry) => entry.code === "C_AFFIRMATIVE_REF_REJECTED_case-digest-beat-05-open-status"));
  assert.ok(result.report.issues.some((entry) => entry.code === "C_BEAT_SILENT_SELECTION_case-digest-beat-05-open-status"));
});

test("the six exact Ichiro package files remain byte-bound and separate from Densou", () => {
  const expected = {
    "private-raster-case-digest-ichiro-provisional.mp4": [18300218, "1499cd6e753888e29db6cfc269db75cef312c049776ffe30b021dd13e5f2bc10"],
    "audio-sync-receipt.json": [24201, "bc8a594992f8cbd354ee3ce8fb0e32bb33f5d4ca7ecf187175e36b6ee687d4c1"],
    "audio-waveform.jpg": [16060, "684fe5e5651f84e616e53fea8963f163560fd2468de6c7114109c8d8c2e0e350"],
    "package-manifest.json": [1292, "1c692ac41c6c6226fae2b290de73f325f0a81689860582639dea338ab8365586"],
    "README.md": [866, "3a1da6f4cab0f54b5d87c0f3aac62926645847287ab0fb148ff2c3baacbf699f"],
    "review.html": [4889, "e1ccf25fb183c45d35417a92dfcfeb7efd0a1b6d4c975150f44288ffb7ee050e"]
  };
  for (const [fileName, [bytes, hash]] of Object.entries(expected)) {
    const relativePath = `${packageDir}/${fileName}`;
    assert.equal(statSync(resolve(repoRoot, relativePath)).size, bytes);
    assert.equal(sha256(relativePath), hash);
  }
  const state = readJson(statePath);
  assert.equal(state.identity.content_lane, "NON_DENSOU_CASE_DIGEST");
  assert.equal(state.identity.densou_identity, "OUT_OF_LANE");
  assert.equal(state.identity.densou_may_satisfy_dependencies, false);
});
