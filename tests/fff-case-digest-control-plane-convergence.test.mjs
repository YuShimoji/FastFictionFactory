import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const toolPath = path.join(repoRoot, "tools", "fff-state.mjs");
const schemaVersion = "fff.caseDigestControlPlaneConvergence.v1";

function validSnapshot() {
  return {
    schemaVersion,
    control: {
      current_project_state_integrity: true,
      canonical_root_command: true,
      case_digest_mandatory: true,
      writer_integration_registered: true,
      writer_validation_mandatory: true,
      writer_source_adaptation_artifact_id: "fff-writer-source-adaptation-v0-001",
      writer_decision_workspace_artifact_id: "fff-writer-decision-workspace-v1-001",
      writer_candidate_only: true,
      writer_effect_boundaries_closed: true,
      predecessor_unique_successor_required: false,
      clean_checkout_requires_historical_dirty_fingerprint: false,
      validation_writes_result: false
    },
    state: {
      active_default_artifact_id: "fff-private-previsualization-timeline-001",
      accepted_successor_artifact_id: "fff-private-raster-case-digest-001",
      accepted_successor_default_active: false,
      accepted_successor_human_scope: "accepted_scoped",
      production_rights_release_closed: true,
      rejected_motion_promoted: false,
      clarity_narrative_promoted: false
    },
    current_validations: {
      active_default_pass: true,
      case_digest_validator_pass: true,
      case_digest_tests_pass: true,
      case_digest_tests_total: 14,
      case_digest_tests_passed: 14,
      writer_source_cli_pass: true,
      writer_decision_cli_pass: true,
      writer_tests_pass: true,
      writer_tests_total: 31,
      writer_tests_passed: 31
    },
    quarantines: {
      primary_imagery_pass: true,
      narrative_format_pass: true
    },
    archive: {
      self_integrity_pass: true,
      items: [
        { artifact_id: "fff-private-materialized-motion-previs-001", role: "rejected_archive", passed: true },
        { artifact_id: "fff-private-full-raster-candidate-001", role: "superseded_predecessor", passed: true },
        { artifact_id: "fff-private-full-raster-clarity-candidate-001", role: "superseded_narrative_predecessor", passed: true }
      ],
      registration_mismatches: []
    },
    baseline: {
      baseline_count: 76,
      protected_subset_count: 76,
      missing_paths: [],
      hash_changed_paths: [],
      additive_descendant_count: 5,
      valid_additive_paths: [
        "artifacts/high-fidelity-raster-pilot-result.json",
        "artifacts/private-materialized-motion-previs-result.json",
        "artifacts/private-full-raster-candidate-result.json",
        "artifacts/private-full-raster-clarity-candidate-result.json",
        "artifacts/private-raster-case-digest-result.json"
      ],
      invalid_additive_paths: []
    },
    non_blocking_debt: [],
    validation_revision: "bcdf84e4d89f26bf41d288f8282d7ae50911cc1e",
    mutation_detected: false
  };
}

function runAudit(snapshot) {
  const run = spawnSync(process.execPath, [toolPath, "audit-case-digest-control-plane-model", "-"], {
    cwd: repoRoot,
    encoding: "utf8",
    input: JSON.stringify(snapshot),
    windowsHide: true
  });
  return {
    ...run,
    result: JSON.parse(run.stdout)
  };
}

function failureCodes(run) {
  return run.result.failures.map((failure) => failure.code);
}

test("current chain fails closed when CASE_DIGEST is missing", () => {
  const snapshot = validSnapshot();
  snapshot.control.case_digest_mandatory = false;
  const run = runAudit(snapshot);
  assert.notEqual(run.status, 0);
  assert.ok(failureCodes(run).includes("CASE_DIGEST_MISSING_FROM_CURRENT_CHAIN"));
});

test("integrated Writer support must stay registered and candidate-only", () => {
  const snapshot = validSnapshot();
  snapshot.control.writer_integration_registered = false;
  snapshot.control.writer_candidate_only = false;
  const run = runAudit(snapshot);
  assert.notEqual(run.status, 0);
  assert.ok(failureCodes(run).includes("WRITER_INTEGRATION_NOT_REGISTERED"));
});

test("integrated Writer focused validation is part of current health", () => {
  const snapshot = validSnapshot();
  snapshot.current_validations.writer_tests_passed = 30;
  const run = runAudit(snapshot);
  assert.notEqual(run.status, 0);
  assert.ok(failureCodes(run).includes("WRITER_FOCUSED_ACCEPTANCE_FAILED"));
});

test("rejected materialized motion cannot be promoted to current state", () => {
  const snapshot = validSnapshot();
  snapshot.state.rejected_motion_promoted = true;
  const run = runAudit(snapshot);
  assert.notEqual(run.status, 0);
  assert.ok(failureCodes(run).includes("REJECTED_MOTION_PROMOTED"));
});

test("predecessors are not required to remain the unique successor", () => {
  const snapshot = validSnapshot();
  snapshot.control.predecessor_unique_successor_required = true;
  const run = runAudit(snapshot);
  assert.notEqual(run.status, 0);
  assert.ok(failureCodes(run).includes("PREDECESSOR_UNIQUE_SUCCESSOR_REQUIRED"));
});

test("historical machine-local dirty fingerprints cannot become clean-checkout requirements", () => {
  const snapshot = validSnapshot();
  snapshot.control.clean_checkout_requires_historical_dirty_fingerprint = true;
  const run = runAudit(snapshot);
  assert.notEqual(run.status, 0);
  assert.ok(failureCodes(run).includes("HISTORICAL_DIRTY_FINGERPRINT_REQUIRED"));
});

test("a missing protected baseline result blocks safety", () => {
  const snapshot = validSnapshot();
  snapshot.baseline.protected_subset_count = 75;
  snapshot.baseline.missing_paths = ["artifacts/example-baseline-result.json"];
  const run = runAudit(snapshot);
  assert.notEqual(run.status, 0);
  assert.ok(failureCodes(run).includes("PROTECTED_BASELINE_FILE_MISSING"));
});

test("a changed protected baseline hash blocks safety", () => {
  const snapshot = validSnapshot();
  snapshot.baseline.protected_subset_count = 75;
  snapshot.baseline.hash_changed_paths = ["artifacts/example-baseline-result.json"];
  const run = runAudit(snapshot);
  assert.notEqual(run.status, 0);
  assert.ok(failureCodes(run).includes("PROTECTED_BASELINE_HASH_CHANGED"));
});

test("a valid additive descendant does not invalidate the protected baseline subset", () => {
  const snapshot = validSnapshot();
  snapshot.baseline.additive_descendant_count = 6;
  snapshot.baseline.valid_additive_paths.push("artifacts/future-valid-result.json");
  const run = runAudit(snapshot);
  assert.equal(run.status, 0);
  assert.equal(run.result.current_path_pass, true);
  assert.equal(run.result.readiness_baseline_subset.additive_descendant_count, 6);
});

test("current CASE_DIGEST corruption cannot be downgraded to non-blocking debt", () => {
  const snapshot = validSnapshot();
  snapshot.current_validations.case_digest_validator_pass = false;
  snapshot.non_blocking_debt.push({
    code: "ATTEMPTED_DOWNGRADE",
    decision_effect: "DEBT_NONBLOCKING",
    detail: "must not hide current corruption"
  });
  const run = runAudit(snapshot);
  assert.notEqual(run.status, 0);
  assert.ok(failureCodes(run).includes("CASE_DIGEST_CURRENT_CORRUPTION"));
});

test("an archive registration mismatch remains visible without blocking the current path", () => {
  const snapshot = validSnapshot();
  snapshot.archive.registration_mismatches.push("historical archive registration is stale");
  const run = runAudit(snapshot);
  assert.equal(run.status, 0);
  assert.equal(run.result.current_path_pass, true);
  assert.ok(run.result.non_blocking_debt.some((item) => item.code === "ARCHIVE_REGISTRATION_MISMATCH"));
});

test("normal validation rejects any result-writing configuration or output path", () => {
  const snapshot = validSnapshot();
  snapshot.control.validation_writes_result = true;
  const audit = runAudit(snapshot);
  assert.notEqual(audit.status, 0);
  assert.ok(failureCodes(audit).includes("NORMAL_VALIDATION_WRITES_RESULT"));

  const command = spawnSync(process.execPath, [
    toolPath,
    "validate-case-digest-control-plane",
    "artifacts/artifact-manifest.json",
    "artifacts/should-not-be-written.json"
  ], {
    cwd: repoRoot,
    encoding: "utf8",
    windowsHide: true
  });
  assert.notEqual(command.status, 0);
  assert.match(command.stderr, /read-only and does not accept an output path/);
});

test("repository root health includes the integrated Writer artifacts", () => {
  const childEnvironment = { ...process.env };
  delete childEnvironment.NODE_TEST_CONTEXT;
  const run = spawnSync(process.execPath, [
    toolPath,
    "validate-case-digest-control-plane",
    "artifacts/artifact-manifest.json"
  ], {
    cwd: repoRoot,
    encoding: "utf8",
    windowsHide: true,
    env: childEnvironment
  });
  assert.equal(run.status, 0, run.stderr || run.stdout);
  const result = JSON.parse(run.stdout);
  assert.equal(result.current_path_pass, true);
  assert.equal(result.writer_integration.registered, true);
  assert.equal(result.writer_integration.read_only_cli_pass, true);
  assert.equal(result.writer_integration.focused_tests, "31/31");
  assert.equal(result.writer_integration.candidate_only, true);
  assert.equal(
    result.writer_integration.production_rights_release_canon_closed,
    true
  );
  assert.equal(result.other_nonbaseline_count.excluded_nonresult, 4);
  assert.equal(result.unclassified_result_count, 0);
  assert.equal(result.mutation_detected, false);
});
