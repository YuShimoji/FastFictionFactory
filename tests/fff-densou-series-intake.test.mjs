import assert from "node:assert/strict";
import { createHash } from "node:crypto";
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
const fixtureBytes = Buffer.from("DENSOU_TEST_SOURCE_BYTES_V1\n", "utf8");

function run(args) {
  return spawnSync(process.execPath, [toolPath, ...args], { cwd: repoRoot, encoding: "utf8" });
}

function outputJson(result) {
  return JSON.parse(result.stdout);
}

async function makeTemp(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), "fff-densou-intake-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

async function createPacket(t) {
  const root = await makeTemp(t);
  const sourcePath = path.join(root, "densou-fixture.txt");
  const packetPath = path.join(root, "packet");
  await writeFile(sourcePath, fixtureBytes);
  const init = run(["init", "--authority", authorityPath, "--source", sourcePath, "--out", packetPath]);
  assert.equal(init.status, 0, init.stderr);
  return { root, sourcePath, packetPath, init: outputJson(init) };
}

test("tracked Densou intake contract validates", () => {
  const result = run(["validate-contract", "--result", resultPath]);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(outputJson(result), {
    result: "PASS",
    artifact_id: "fff-densou-series-intake-v1",
    checks_passed: 12,
    checks_total: 12,
    state_code: "DEPENDENCY_MISSING"
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

test("status reports a reproducible hash and revision for exact bytes", async (t) => {
  const root = await makeTemp(t);
  const sourcePath = path.join(root, "densou-fixture.txt");
  await writeFile(sourcePath, fixtureBytes);
  const result = run(["status", "--authority", authorityPath, "--source", sourcePath]);
  assert.equal(result.status, 0, result.stderr);
  const status = outputJson(result);
  const expectedHash = createHash("sha256").update(fixtureBytes).digest("hex");
  assert.equal(status.source_sha256, expectedHash);
  assert.equal(status.revision_id, `densou-${expectedHash.slice(0, 16)}`);
});

test("init emits exact source, authority, receipt, series, season, episode and review evidence", async (t) => {
  const packet = await createPacket(t);
  const expectedHash = createHash("sha256").update(fixtureBytes).digest("hex");
  assert.equal(packet.init.source_sha256, expectedHash);
  assert.equal(packet.init.revision_id, `densou-${expectedHash.slice(0, 16)}`);
  const snapshot = await readFile(path.join(packet.packetPath, "source", "densou-source-original.txt"));
  assert.deepEqual(snapshot, fixtureBytes);
  const receipt = JSON.parse(await readFile(path.join(packet.packetPath, "source-receipt.json"), "utf8"));
  assert.equal(receipt.exact_source_locator, path.resolve(packet.sourcePath));
  assert.equal(receipt.source_snapshot_sha256, expectedHash);
  const episode = JSON.parse(await readFile(path.join(packet.packetPath, "episode-001.json"), "utf8"));
  assert.equal(episode.state, "source_bound_adaptation_pending");
  assert.deepEqual(episode.source_spans, []);
  assert.equal(episode.adaptation, null);
  assert.equal(episode.viewer_artifact, null);
});

test("verify passes the immutable packet and reports all thirteen checks", async (t) => {
  const packet = await createPacket(t);
  const result = run(["verify", "--packet", packet.packetPath]);
  assert.equal(result.status, 0, result.stderr);
  const verification = outputJson(result);
  assert.equal(verification.result, "PASS");
  assert.equal(verification.checks_passed, 13);
  assert.equal(verification.checks_total, 13);
  assert.equal(verification.state_code, "CONTINUE");
});

test("generated review is local-only and never exposes source content", async (t) => {
  const packet = await createPacket(t);
  const html = await readFile(path.join(packet.packetPath, "densou-source-readback.html"), "utf8");
  assert.doesNotMatch(html, /https?:\/\//i);
  assert.doesNotMatch(html, /<(?:script|form|input|textarea|button)\b/i);
  assert.doesNotMatch(html, /autoplay/i);
  assert.equal(html.includes(fixtureBytes.toString("utf8").trim()), false);
});

test("verify rejects a source snapshot byte change", async (t) => {
  const packet = await createPacket(t);
  await writeFile(path.join(packet.packetPath, "source", "densou-source-original.txt"), "tampered\n", "utf8");
  const result = run(["verify", "--packet", packet.packetPath]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /SHA-256 mismatch|byte-size mismatch/);
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

test("empty source bytes are invalid rather than accepted as incomplete", async (t) => {
  const root = await makeTemp(t);
  const sourcePath = path.join(root, "empty.txt");
  await writeFile(sourcePath, "", "utf8");
  const result = run(["status", "--authority", authorityPath, "--source", sourcePath]);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /SOURCE_INVALID/);
});

test("init refuses to overwrite a non-empty output directory", async (t) => {
  const root = await makeTemp(t);
  const sourcePath = path.join(root, "densou-fixture.txt");
  const outputPath = path.join(root, "packet");
  await writeFile(sourcePath, fixtureBytes);
  await writeFile(outputPath, "occupied", "utf8");
  const result = run(["init", "--authority", authorityPath, "--source", sourcePath, "--out", outputPath]);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /output path exists and is not a directory/);
});
