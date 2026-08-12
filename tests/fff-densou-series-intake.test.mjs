import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const toolPath = path.join(repoRoot, "tools", "fff-densou-series-intake.mjs");
const authorityPath = path.join(repoRoot, "artifacts", "densou-series-intake", "densou-authority-input.json");
const resultPath = path.join(repoRoot, "artifacts", "densou-series-intake-result.json");

function run(args) {
  return spawnSync(process.execPath, [toolPath, ...args], { cwd: repoRoot, encoding: "utf8" });
}

function outputJson(result) {
  return JSON.parse(result.stdout);
}

function failureJson(result) {
  return JSON.parse(result.stderr);
}

async function makeTemp(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), "fff-densou-intake-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

test("tracked Densou intake contract validates", () => {
  const result = run(["validate-contract", "--result", resultPath]);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(outputJson(result), {
    result: "PASS",
    artifact_id: "fff-densou-series-intake-v1",
    classification: "WRONG_SOURCE_EVIDENCE_QUARANTINED",
    active_authority: false,
    reuse_allowed: false,
    checks_passed: 12,
    checks_total: 12,
    state_code: "CONTINUE"
  });
});

test("status fails closed when no exact source locator is supplied", () => {
  const result = run(["status", "--authority", authorityPath]);
  assert.equal(result.status, 3);
  const status = outputJson(result);
  assert.equal(status.state_code, "DEPENDENCY_MISSING");
  assert.equal(status.required_input.count, 1);
  assert.equal(status.source_locator, null);
});

test("legacy status refuses to inspect a candidate source", async (t) => {
  const root = await makeTemp(t);
  const sourcePath = path.join(root, "densou-fixture.txt");
  await writeFile(sourcePath, "DENSOU_TEST_SOURCE_BYTES_V1\n", "utf8");
  const result = run(["status", "--authority", authorityPath, "--source", sourcePath]);
  assert.equal(result.status, 4);
  assert.equal(failureJson(result).state_code, "LEGACY_MUTATION_DISABLED");
  assert.doesNotMatch(result.stderr, new RegExp(sourcePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("legacy init refuses source binding before creating output", async (t) => {
  const root = await makeTemp(t);
  const sourcePath = path.join(root, "densou-fixture.txt");
  const outputPath = path.join(root, "packet");
  await writeFile(sourcePath, "DENSOU_TEST_SOURCE_BYTES_V1\n", "utf8");
  const result = run(["init", "--authority", authorityPath, "--source", sourcePath, "--out", outputPath]);
  assert.equal(result.status, 4);
  assert.equal(failureJson(result).state_code, "LEGACY_MUTATION_DISABLED");
  await assert.rejects(readFile(outputPath, "utf8"), { code: "ENOENT" });
});

test("authority cannot silently lose full adaptation permission", async (t) => {
  const root = await makeTemp(t);
  const authority = JSON.parse(await readFile(authorityPath, "utf8"));
  authority.allowed_scope.full_adaptation_and_modification = false;
  const invalidAuthorityPath = path.join(root, "invalid-authority.json");
  await writeFile(invalidAuthorityPath, `${JSON.stringify(authority)}\n`, "utf8");
  const result = run(["status", "--authority", invalidAuthorityPath]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /AUTHORITY_REQUIRED/);
});

test("legacy source input is never opened even when the path is empty", async (t) => {
  const root = await makeTemp(t);
  const sourcePath = path.join(root, "empty.txt");
  await writeFile(sourcePath, "", "utf8");
  const result = run(["status", "--authority", authorityPath, "--source", sourcePath]);
  assert.equal(result.status, 4);
  assert.equal(failureJson(result).state_code, "LEGACY_MUTATION_DISABLED");
});

test("legacy init stays disabled when the proposed output is occupied", async (t) => {
  const root = await makeTemp(t);
  const sourcePath = path.join(root, "densou-fixture.txt");
  const outputPath = path.join(root, "packet");
  await writeFile(sourcePath, "DENSOU_TEST_SOURCE_BYTES_V1\n", "utf8");
  await writeFile(outputPath, "occupied", "utf8");
  const result = run(["init", "--authority", authorityPath, "--source", sourcePath, "--out", outputPath]);
  assert.equal(result.status, 4);
  assert.equal(failureJson(result).state_code, "LEGACY_MUTATION_DISABLED");
});
