import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testPath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(testPath), "..");
const toolPath = path.join(repoRoot, "tools", "fff-densou-episode-audio-repair.mjs");
const planPath = path.join(repoRoot, "artifacts", "densou-s01e01-benchmark-video-slice-audio-repair-plan.json");
const resultPath = path.join(repoRoot, "artifacts", "densou-s01e01-benchmark-video-slice-audio-repair-result.json");
const packageRoot = path.join(repoRoot, "artifacts", "densou-s01e01-benchmark-video-slice-audio-repair-001");
const originalPath = path.join(repoRoot, "artifacts", "densou-s01e01-benchmark-video-slice-001", "densou-s01e01-benchmark-video-slice.mp4");
const revisedPath = path.join(packageRoot, "densou-s01e01-benchmark-video-slice-audio-repair.mp4");

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function runTool(args, options = {}) {
  return execFileSync(process.execPath, [toolPath, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: options.stdio ?? ["ignore", "pipe", "pipe"]
  });
}

function runFailure(args) {
  try {
    runTool(args);
    assert.fail("command unexpectedly passed");
  } catch (error) {
    return JSON.parse(error.stderr?.toString() ?? "{}");
  }
}

test("audio-repair plan fails closed as wrong-source evidence", () => {
  const output = runFailure(["validate-plan"]);
  assert.equal(output.code, "WRONG_SOURCE_EVIDENCE_QUARANTINED");
});

test("repaired package verification stops before decode", () => {
  const output = runFailure(["verify"]);
  assert.equal(output.code, "WRONG_SOURCE_EVIDENCE_QUARANTINED");
});

test("original and revised exact identities are distinct while subtitles remain byte-identical", async () => {
  const result = await readJson(resultPath);
  assert.equal(sha256(await readFile(originalPath)), "0254d1946b1b3b6ac0e544ddbdcb8f097a451330f371b629d56a4ddc0c6cc9fc");
  assert.equal(sha256(await readFile(revisedPath)), result.media_sha256);
  assert.notEqual(result.media_sha256, result.original_media_sha256);
  const parentSrt = await readFile(path.join(repoRoot, "artifacts", "densou-s01e01-benchmark-video-slice-001", "densou-s01e01-benchmark-video-slice.ja.srt"));
  const revisedSrt = await readFile(path.join(packageRoot, "densou-s01e01-benchmark-video-slice-audio-repair.ja.srt"));
  assert.equal(sha256(parentSrt), sha256(revisedSrt));
  assert.equal(result.original_media_unchanged, true);
  assert.equal(result.video_essence_exact_match, true);
});

test("S packet keeps the partial-production and human/rights/canon gates explicit", async () => {
  const packet = await readJson(path.join(packageRoot, "s-review-packet.json"));
  const sync = await readJson(path.join(packageRoot, "audio-subtitle-sync.json"));
  const segmentMap = await readJson(path.join(packageRoot, "segment-source-map.json"));
  const html = await readFile(path.join(packageRoot, "review.html"), "utf8");
  assert.equal(packet.classification, "PARTIAL_PRODUCTION_SLICE");
  assert.equal(packet.episode_completion, false);
  assert.equal(packet.final_acceptance_claimed, false);
  assert.deepEqual(Object.keys(packet.review_axes), [
    "visual_grammar", "character_scene_readability", "dialogue_pacing", "subtitles", "audio", "source_fidelity", "expandability"
  ]);
  assert.equal(sync.counts.audio_cues, 15);
  assert.equal(sync.counts.audible_cues, 15);
  assert.equal(sync.counts.dialogue_units, 0);
  assert.equal(sync.content_policy.new_canon_claims, 0);
  assert.equal(segmentMap.counts.mapped_segments, 8);
  assert.equal(segmentMap.counts.distinct_source_claims, 12);
  assert.equal(segmentMap.counts.unsupported_claims, 0);
  assert.equal(segmentMap.counts.hidden_causal_bridges, 0);
  assert.match(html, /<video controls preload="metadata"/);
  assert.match(html, /audio-repair-waveform\.png/);
  assert.doesNotMatch(html, /https?:\/\//);
  assert.doesNotMatch(html, /<form|autoplay|fetch\(|XMLHttpRequest/i);
});

test("quarantine precedes retained-media identity checks", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "fff-densou-audio-repair-test-"));
  try {
    const plan = await readJson(planPath);
    plan.original_media.sha256 = "0".repeat(64);
    const tamperedPlan = path.join(tempRoot, "tampered-plan.json");
    await writeFile(tamperedPlan, `${JSON.stringify(plan, null, 2)}\n`, "utf8");
    let stderr = "";
    try {
      runTool(["validate-plan", "--plan", tamperedPlan]);
      assert.fail("tampered original identity unexpectedly passed");
    } catch (error) {
      stderr = error.stderr?.toString() ?? "";
    }
    assert.match(stderr, /WRONG_SOURCE_EVIDENCE_QUARANTINED/);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});
