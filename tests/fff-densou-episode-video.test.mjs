import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testPath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(testPath), "..");
const toolPath = path.join(repoRoot, "tools", "fff-densou-episode-video.mjs");
const planPath = path.join(repoRoot, "artifacts", "densou-s01e01-benchmark-video-slice-plan.json");
const packageRoot = path.join(repoRoot, "artifacts", "densou-s01e01-benchmark-video-slice-001");
const resultPath = path.join(repoRoot, "artifacts", "densou-s01e01-benchmark-video-slice-result.json");

function runTool(args) {
  return spawnSync(process.execPath, [toolPath, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
    windowsHide: true,
    timeout: 180_000
  });
}

test("Densou Episode 1 video plan fails closed as wrong-source evidence", () => {
  const result = runTool(["validate-plan"]);
  assert.equal(result.status, 4);
  const payload = JSON.parse(result.stderr);
  assert.equal(payload.code, "WRONG_SOURCE_EVIDENCE_QUARANTINED");
  assert.doesNotMatch(payload.message, /FastFictionFactory-runs/);
});

test("playable package verification stops before decode or packet lookup", () => {
  const result = runTool(["verify", "--root", packageRoot]);
  assert.equal(result.status, 4);
  const payload = JSON.parse(result.stderr);
  assert.equal(payload.code, "WRONG_SOURCE_EVIDENCE_QUARANTINED");
});

test("result records the exact bounded 180-of-720 product delta", () => {
  const result = JSON.parse(readFileSync(resultPath, "utf8"));
  assert.equal(result.artifact_id, "fff-densou-s01e01-benchmark-video-slice-001");
  assert.equal(result.source_sha256, "256837a94afd521cadfcb676da2c3873a914ce95f11f493d5b60e15bc42f9a32");
  assert.equal(result.verification.result, "PASS");
  assert.equal(result.quantitative_gap.current_playable_seconds, 180);
  assert.equal(result.quantitative_gap.target_seconds, 720);
  assert.equal(result.quantitative_gap.remaining_seconds, 540);
  assert.equal(result.boundaries.final_canon, false);
  assert.equal(result.boundaries.production_approval, false);
  assert.equal(result.boundaries.not_for_publication, true);
});

test("build fails closed without creating a derived package", () => {
  const tempRoot = mkdtempSync(path.join(os.tmpdir(), "fff-densou-video-test-"));
  try {
    const outputRoot = path.join(tempRoot, "output");
    const result = runTool(["build", "--out", outputRoot]);
    assert.equal(result.status, 4);
    const payload = JSON.parse(result.stderr);
    assert.equal(payload.result, "FAIL");
    assert.equal(payload.code, "WRONG_SOURCE_EVIDENCE_QUARANTINED");
    assert.equal(readFileSync(planPath, "utf8").includes("256837a94afd521c"), true);
  } finally {
    const resolved = path.resolve(tempRoot);
    assert.ok(resolved.startsWith(path.resolve(os.tmpdir()) + path.sep));
    rmSync(resolved, { recursive: true, force: true });
  }
});
