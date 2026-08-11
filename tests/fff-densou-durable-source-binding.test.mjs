import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const toolPath = path.join(repoRoot, "tools", "fff-densou-durable-source-binding.mjs");
const fixturePath = path.join(repoRoot, "tests", "fixtures", "densou-durable-source-binding", "synthetic-noncanon-source.txt");
const wrongSamplePath = path.join(repoRoot, "artifacts", "sample-raw-memo.md");
const scope = "synthetic-test";

function run(args, { cwd = repoRoot, vaultRoot } = {}) {
  return spawnSync(process.execPath, [toolPath, ...args], {
    cwd,
    encoding: "utf8",
    env: { ...process.env, FFF_DENSOU_VAULT_ROOT: vaultRoot }
  });
}

function json(result) {
  return JSON.parse(result.status === 0 || result.status === 75 ? result.stdout : result.stderr);
}

async function makeTemp(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), "fff-densou-durable-binding-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

function bindArgs(extra = []) {
  return [
    "bind-source",
    "--path", fixturePath,
    "--revision", "synthetic-fixture-r1",
    "--canon-label", "NONCANON_SYNTHETIC_FIXTURE",
    "--provenance-assertion", "synthetic_fixture_created_only_for_durable_binding_tests",
    "--rights-assertion", "synthetic_fixture_local_test_use_only_no_real_work_claim",
    "--scope", scope,
    "--synthetic-fixture", "true",
    ...extra
  ];
}

function bindingPath(vaultRoot, bindingId) {
  return path.join(vaultRoot, "scopes", scope, "bindings", bindingId, "binding.json");
}

async function boundRecord(vaultRoot, bindingId) {
  return JSON.parse(await readFile(bindingPath(vaultRoot, bindingId), "utf8"));
}

function objectPath(vaultRoot, record) {
  return path.join(vaultRoot, "scopes", scope, ...record.portable_vault_locator.split("/"));
}

test("tracked contract makes the legacy unbound template explicitly non-authoritative", async () => {
  const contract = JSON.parse(await readFile(path.join(repoRoot, "artifacts", "densou-durable-source-binding", "binding-contract.json"), "utf8"));
  const authority = JSON.parse(await readFile(path.join(repoRoot, "artifacts", "densou-series-intake", "densou-authority-input.json"), "utf8"));
  assert.equal(contract.authority_model.sole_authoritative_record, "ignored_local_vault_binding_record");
  assert.equal(contract.authority_model.tracked_unbound_authority_allowed, false);
  assert.equal(authority.authority_role, "legacy_fixture_template_non_authoritative");
  assert.equal(authority.source_binding.authoritative, false);
  assert.equal(authority.must_not_be_used_as_active_binding, true);
});

test("one-shot bind creates one durable binding and substantive material", async (t) => {
  const root = await makeTemp(t);
  const vaultRoot = path.join(root, "vault");
  const result = run(bindArgs(), { vaultRoot });
  assert.equal(result.status, 0, result.stderr);
  const output = json(result);
  assert.equal(output.result, "PASS");
  assert.equal(output.idempotent, false);
  assert.equal(output.status, "BOUND");
  assert.equal(output.state, "MATERIALIZED");
  assert.equal(output.source_path_required, false);
  const record = await boundRecord(vaultRoot, output.binding_id);
  assert.deepEqual(record.state_history.map((entry) => entry.state), ["BOUND", "VERIFIED", "INGEST_READY", "MATERIALIZED"]);
  assert.equal(record.verified_at !== null, true);
  assert.equal(record.original_bytes_sha256, record.canonical_utf8_sha256);
  assert.equal(record.absolute_locator_recorded, false);
  assert.equal(JSON.stringify(record).includes(fixturePath), false);
  const materialPath = path.join(vaultRoot, "scopes", scope, ...output.material.portable_locator.split("/"));
  const material = JSON.parse(await readFile(materialPath, "utf8"));
  assert.equal(material.binding_id, output.binding_id);
  assert.match(material.substantive_fixture_derived_material.source_lines[0], /THIS IS NOT DENSOU/);
  assert.equal(material.substantive_fixture_derived_material.episode_seed_lines.length, 2);
  assert.equal(material.substantive_fixture_derived_material.voice_input_lines.length, 1);
});

test("rerunning the same one-shot bind is idempotent and does not ask again", async (t) => {
  const root = await makeTemp(t);
  const vaultRoot = path.join(root, "vault");
  const first = json(run(bindArgs(), { vaultRoot }));
  const secondResult = run(bindArgs(), { vaultRoot });
  assert.equal(secondResult.status, 0, secondResult.stderr);
  const second = json(secondResult);
  assert.equal(second.binding_id, first.binding_id);
  assert.equal(second.idempotent, true);
  assert.equal(second.state, "MATERIALIZED");
  assert.equal("question" in second, false);
});

test("safe interruption after BOUND resumes without the original path", async (t) => {
  const root = await makeTemp(t);
  const vaultRoot = path.join(root, "vault");
  const interrupted = run(bindArgs(["--interrupt-after", "BOUND"]), { vaultRoot });
  assert.equal(interrupted.status, 75, interrupted.stderr);
  const checkpoint = json(interrupted);
  assert.equal(checkpoint.state, "BOUND");
  const resumed = run(["resume", "--scope", scope, "--binding-id", checkpoint.binding_id], { vaultRoot, cwd: root });
  assert.equal(resumed.status, 0, resumed.stderr);
  const output = json(resumed);
  assert.equal(output.resumed_without_source_path, true);
  assert.equal(output.state, "MATERIALIZED");
  assert.equal(output.binding_id, checkpoint.binding_id);
});

test("a different cwd resolves status init and verify by binding id", async (t) => {
  const root = await makeTemp(t);
  const vaultRoot = path.join(root, "vault");
  const bound = json(run(bindArgs(), { vaultRoot }));
  for (const command of ["status", "init", "verify"]) {
    const result = run([command, "--scope", scope, "--binding-id", bound.binding_id], { vaultRoot, cwd: root });
    assert.equal(result.status, 0, result.stderr);
    const output = json(result);
    assert.equal(output.binding_id, bound.binding_id);
    assert.notEqual(output.state, "UNBOUND");
    assert.equal(output.source_path_required, false);
    assert.doesNotMatch(result.stdout, /DENSOU_SOURCE_LOCATOR_MISSING/);
  }
});

test("known wrong sample remains REJECTED and creates no active binding", async (t) => {
  const root = await makeTemp(t);
  const vaultRoot = path.join(root, "vault");
  const args = bindArgs();
  args[2] = wrongSamplePath;
  const result = run(args, { vaultRoot });
  assert.equal(result.status, 4);
  const output = json(result);
  assert.equal(output.state_code, "REJECTED");
  assert.equal(output.status, "REJECTED");
  assert.equal(output.source_path_retained, false);
});

test("vault missing is a differential blocker and duplicate fingerprint suppresses the question", async (t) => {
  const root = await makeTemp(t);
  const vaultRoot = path.join(root, "vault");
  const bound = json(run(bindArgs(), { vaultRoot }));
  const record = await boundRecord(vaultRoot, bound.binding_id);
  await rm(objectPath(vaultRoot, record));
  const first = run(["status", "--scope", scope, "--binding-id", bound.binding_id], { vaultRoot });
  const second = run(["status", "--scope", scope, "--binding-id", bound.binding_id], { vaultRoot });
  assert.equal(first.status, 6);
  assert.equal(second.status, 6);
  const one = json(first);
  const two = json(second);
  assert.equal(one.state_code, "VAULT_OBJECT_MISSING");
  assert.equal(one.blocker.question_suppressed, false);
  assert.equal(two.blocker.question_suppressed, true);
  assert.equal(two.blocker.question, null);
  assert.equal(one.blocker.fingerprint, `${bound.binding_id}|actual_densou_original|VAULT_OBJECT_MISSING`);
  assert.equal(two.blocker.fingerprint_sha256, one.blocker.fingerprint_sha256);
});

test("vault hash mismatch and explicit revision or canon changes are source differential blockers", async (t) => {
  const root = await makeTemp(t);
  const vaultRoot = path.join(root, "vault");
  const bound = json(run(bindArgs(), { vaultRoot }));
  const record = await boundRecord(vaultRoot, bound.binding_id);
  await writeFile(objectPath(vaultRoot, record), "tampered synthetic bytes\n", "utf8");
  const mismatch = run(["status", "--scope", scope, "--binding-id", bound.binding_id], { vaultRoot });
  assert.equal(mismatch.status, 6);
  assert.equal(json(mismatch).state_code, "VAULT_HASH_MISMATCH");

  const secondRoot = await makeTemp(t);
  const secondVault = path.join(secondRoot, "vault");
  const secondBound = json(run(bindArgs(), { vaultRoot: secondVault }));
  const revision = run(["status", "--scope", scope, "--binding-id", secondBound.binding_id, "--revision", "synthetic-fixture-r2"], { vaultRoot: secondVault });
  assert.equal(revision.status, 6);
  assert.equal(json(revision).state_code, "EXPLICIT_REVISION_CHANGE");

  const canon = run(["status", "--scope", scope, "--binding-id", secondBound.binding_id, "--canon-label", "NONCANON_SYNTHETIC_CHANGED"], { vaultRoot: secondVault });
  assert.equal(canon.status, 6);
  assert.equal(json(canon).state_code, "EXPLICIT_CANON_CHANGE");
});

test("a non-source resource blocker leaves the source binding closed", async (t) => {
  const root = await makeTemp(t);
  const vaultRoot = path.join(root, "vault");
  const bound = json(run(bindArgs(), { vaultRoot }));
  const missing = path.join(root, "missing-render-resource.bin");
  const blocked = run(["materialize", "--scope", scope, "--binding-id", bound.binding_id, "--require-resource", missing], { vaultRoot });
  assert.equal(blocked.status, 7);
  const failure = json(blocked);
  assert.equal(failure.state_code, "RESOURCE_DEPENDENCY_MISSING");
  assert.equal(failure.source_binding_closed, true);
  assert.equal(failure.source_question_reopened, false);
  const status = json(run(["status", "--scope", scope, "--binding-id", bound.binding_id], { vaultRoot }));
  assert.equal(status.state, "MATERIALIZED");
  assert.equal(status.source_question, null);
});

test("durable verify rejects a packet that conflicts with the binding", async (t) => {
  const root = await makeTemp(t);
  const vaultRoot = path.join(root, "vault");
  const bound = json(run(bindArgs(), { vaultRoot }));
  const packetPath = path.join(vaultRoot, "scopes", scope, "packages", bound.binding_id, "source-bound-ingest-packet.json");
  const packet = JSON.parse(await readFile(packetPath, "utf8"));
  packet.binding_id = "densou-binding-conflict";
  await writeFile(packetPath, `${JSON.stringify(packet, null, 2)}\n`, "utf8");
  const result = run(["verify", "--scope", scope, "--binding-id", bound.binding_id], { vaultRoot });
  assert.equal(result.status, 5);
  assert.equal(json(result).state_code, "PACKAGE_BINDING_MISMATCH");
});

test("durable CLI refuses legacy authority overrides", async (t) => {
  const root = await makeTemp(t);
  const result = run(["status", "--scope", scope, "--authority", "artifacts/densou-series-intake/densou-authority-input.json"], { vaultRoot: path.join(root, "vault") });
  assert.equal(result.status, 2);
  assert.equal(json(result).state_code, "INVALID_ARGUMENT");
});
