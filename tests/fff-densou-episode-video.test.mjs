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

test("Densou Episode 1 video plan binds all accepted segments and claims", () => {
  const result = runTool(["validate-plan"]);
  assert.equal(result.status, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.result, "PASS");
  assert.equal(payload.segment_count, 8);
  assert.equal(payload.claim_count, 12);
  assert.equal(payload.visual_update_count, 15);
  assert.equal(payload.maximum_visual_update_gap_seconds, 14);
  assert.equal(payload.unsupported_claim_count, 0);
});

test("playable package passes source, benchmark, decode, and media-health verification", () => {
  const result = runTool(["verify", "--root", packageRoot]);
  assert.equal(result.status, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.result, "PASS");
  assert.equal(payload.segment_count, 8);
  assert.equal(payload.source_claim_count, 12);
  assert.equal(payload.evidence_manifest_mismatches, 0);
  assert.equal(payload.packet_manifest_mismatches, 0);
  assert.equal(payload.full_decode, true);
  assert.equal(payload.blackdetect_events, 0);
  assert.equal(payload.audio_stream_count, 0);
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

test("source identity tamper fails closed", () => {
  const tempRoot = mkdtempSync(path.join(os.tmpdir(), "fff-densou-video-test-"));
  try {
    const plan = JSON.parse(readFileSync(planPath, "utf8"));
    plan.source_sha256 = "0".repeat(64);
    const tamperedPath = path.join(tempRoot, "tampered-plan.json");
    writeFileSync(tamperedPath, `${JSON.stringify(plan, null, 2)}\n`, "utf8");
    const result = runTool(["validate-plan", "--plan", tamperedPath]);
    assert.notEqual(result.status, 0);
    const payload = JSON.parse(result.stderr);
    assert.equal(payload.result, "FAIL");
    assert.equal(payload.code, "INVALID_PLAN");
  } finally {
    const resolved = path.resolve(tempRoot);
    assert.ok(resolved.startsWith(path.resolve(os.tmpdir()) + path.sep));
    rmSync(resolved, { recursive: true, force: true });
  }
});
