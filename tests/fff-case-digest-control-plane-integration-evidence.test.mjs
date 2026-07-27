import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const toolPath = path.join(repoRoot, "tools", "fff-state.mjs");
const evidencePath = path.join(
  repoRoot,
  "artifacts",
  "case-digest-control-plane-integration-evidence-result.json"
);

function baselineRecord(suffix) {
  return {
    path: `artifacts/baseline-${suffix}-result.json`,
    artifact_id: `fff-baseline-${suffix}-001`,
    byte_size: 100 + suffix.charCodeAt(0),
    sha256: `${suffix}`.repeat(64)
  };
}

function observed(record, overrides = {}) {
  return {
    ...record,
    well_formed_passing: true,
    claims_current_authority: false,
    archived_or_superseded: false,
    declared_nonresult: false,
    ...overrides
  };
}

function validModel() {
  const baseline = [baselineRecord("a"), baselineRecord("b")];
  return {
    inventory: {
      required_baseline_count: 2,
      reported_total: 5,
      baseline_records: baseline,
      records: [
        ...baseline.map((record) => observed(record)),
        observed(
          {
            path: "artifacts/current-control-result.json",
            artifact_id: "fff-current-control-001",
            byte_size: 240,
            sha256: "c".repeat(64)
          },
          { claims_current_authority: true }
        ),
        observed(
          {
            path: "artifacts/current-authority-result.json",
            artifact_id: "fff-current-authority-001",
            byte_size: 260,
            sha256: "d".repeat(64)
          },
          { claims_current_authority: true }
        ),
        observed({
          path: "artifacts/additive-result.json",
          artifact_id: "fff-additive-001",
          byte_size: 280,
          sha256: "e".repeat(64)
        })
      ],
      explicit_classes: {
        current_control_plane_result: [
          "artifacts/current-control-result.json"
        ],
        baseline_or_current_authority_nonbaseline: [
          "artifacts/current-authority-result.json"
        ]
      }
    },
    path_audit: {
      writer_paths: ["artifacts/writer-only.json"],
      control_paths: ["tools/control-only.mjs"],
      followup_paths: ["docs/review/control-followup.md"]
    },
    mutation_detected: false
  };
}

function runAudit(model) {
  const run = spawnSync(
    process.execPath,
    [toolPath, "audit-case-digest-integration-evidence-model", "-"],
    {
      cwd: repoRoot,
      encoding: "utf8",
      input: JSON.stringify(model),
      windowsHide: true
    }
  );
  return {
    ...run,
    result: JSON.parse(run.stdout)
  };
}

function failureCodes(run) {
  return run.result.failures.map((failure) => failure.code);
}

test("complete inventory assigns every result exactly once", () => {
  const run = runAudit(validModel());
  assert.equal(run.status, 0);
  assert.equal(run.result.passed, true);
  assert.equal(run.result.inventory.observed_result_total, 5);
  assert.equal(run.result.inventory.classified_result_total, 5);
  assert.equal(run.result.inventory.unclassified_result_count, 0);
  assert.equal(run.result.inventory.duplicate_classification_count, 0);
});

test("unclassified result fails closed", () => {
  const model = validModel();
  model.inventory.records.push(
    observed(
      {
        path: "artifacts/invalid-result.json",
        artifact_id: "fff-invalid-001",
        byte_size: 300,
        sha256: "f".repeat(64)
      },
      { well_formed_passing: false }
    )
  );
  model.inventory.reported_total = 6;
  const run = runAudit(model);
  assert.notEqual(run.status, 0);
  assert.ok(failureCodes(run).includes("UNCLASSIFIED_RESULT"));
});

test("duplicate classification fails closed", () => {
  const model = validModel();
  model.inventory.explicit_classes.current_control_plane_result.push(
    "artifacts/current-authority-result.json"
  );
  const run = runAudit(model);
  assert.notEqual(run.status, 0);
  assert.ok(failureCodes(run).includes("DUPLICATE_RESULT_CLASSIFICATION"));
});

test("missing protected baseline file fails closed", () => {
  const model = validModel();
  model.inventory.records = model.inventory.records.filter(
    (record) => record.path !== "artifacts/baseline-b-result.json"
  );
  model.inventory.reported_total = 4;
  const run = runAudit(model);
  assert.notEqual(run.status, 0);
  assert.ok(failureCodes(run).includes("PROTECTED_BASELINE_FILE_MISSING"));
});

test("changed protected baseline hash fails closed", () => {
  const model = validModel();
  model.inventory.records.find(
    (record) => record.path === "artifacts/baseline-a-result.json"
  ).sha256 = "0".repeat(64);
  const run = runAudit(model);
  assert.notEqual(run.status, 0);
  assert.ok(failureCodes(run).includes("PROTECTED_BASELINE_HASH_CHANGED"));
});

test("valid additive descendant may increase the total", () => {
  const model = validModel();
  model.inventory.records.push(
    observed({
      path: "artifacts/future-additive-result.json",
      artifact_id: "fff-future-additive-001",
      byte_size: 320,
      sha256: "1".repeat(64)
    })
  );
  model.inventory.reported_total = 6;
  const run = runAudit(model);
  assert.equal(run.status, 0);
  assert.equal(run.result.passed, true);
  assert.equal(run.result.inventory.accepted_additive_descendant_count, 2);
});

test("unregistered current-authority result fails closed", () => {
  const model = validModel();
  model.inventory.records.push(
    observed(
      {
        path: "artifacts/unregistered-authority-result.json",
        artifact_id: "fff-unregistered-authority-001",
        byte_size: 340,
        sha256: "2".repeat(64)
      },
      { claims_current_authority: true }
    )
  );
  model.inventory.reported_total = 6;
  const run = runAudit(model);
  assert.notEqual(run.status, 0);
  assert.ok(
    failureCodes(run).includes("UNREGISTERED_CURRENT_AUTHORITY_CLAIM")
  );
});

test("nonbaseline result cannot collide with a protected artifact identity", () => {
  const model = validModel();
  model.inventory.records.push(
    observed({
      path: "artifacts/colliding-result.json",
      artifact_id: "fff-baseline-a-001",
      byte_size: 360,
      sha256: "3".repeat(64)
    })
  );
  model.inventory.reported_total = 6;
  const run = runAudit(model);
  assert.notEqual(run.status, 0);
  assert.ok(failureCodes(run).includes("BASELINE_RESULT_IDENTITY_COLLISION"));
});

test("reported total must match enumerated and classified arithmetic", () => {
  const model = validModel();
  model.inventory.reported_total = 4;
  const run = runAudit(model);
  assert.notEqual(run.status, 0);
  assert.ok(failureCodes(run).includes("OBSERVED_RESULT_TOTAL_MISMATCH"));
});

test("writer and control changed-path overlap fails readiness", () => {
  const model = validModel();
  model.path_audit.writer_paths.push("tools/control-only.mjs");
  const run = runAudit(model);
  assert.notEqual(run.status, 0);
  assert.ok(failureCodes(run).includes("WRITER_CONTROL_PATH_OVERLAP"));
  assert.deepEqual(run.result.path_audit.writer_control_intersection, [
    "tools/control-only.mjs"
  ]);
});

test("normal validation mutation fails readiness", () => {
  const model = validModel();
  model.mutation_detected = true;
  const run = runAudit(model);
  assert.notEqual(run.status, 0);
  assert.ok(
    failureCodes(run).includes("NORMAL_VALIDATION_MUTATED_REPOSITORY")
  );
});

test("committed evidence binds both audited branch tips without claiming integration", () => {
  const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
  assert.deepEqual(
    evidence.accepted_local_inputs.map((entry) => entry.commit_id),
    [
      "197d23d47760e727126f7ad7e3e4e3120b2ae98c",
      "a49b07c94a75fcda8bf8e85f4cd995af8018622d"
    ]
  );
  assert.equal(evidence.path_overlap_audit.control_changed_paths.length, 16);
  assert.equal(evidence.path_overlap_audit.writer_changed_paths.length, 51);
  assert.equal(evidence.path_overlap_audit.writer_control_intersection_count, 0);
  assert.equal(evidence.path_overlap_audit.writer_followup_intersection_count, 0);
  assert.equal(evidence.boundaries.writer_v0_local_branch_passed, true);
  assert.equal(evidence.boundaries.writer_v1_local_branch_passed, true);
  assert.equal(evidence.boundaries.writer_branch_integrated, false);
  assert.equal(evidence.boundaries.branch_integration_performed, false);
  assert.equal(evidence.boundaries.push_performed, false);
  assert.ok(
    evidence.integration_readiness.targeted_validation_after_integration.includes(
      "node --test tests/fff-writer-decision-workspace.test.mjs"
    )
  );
});
