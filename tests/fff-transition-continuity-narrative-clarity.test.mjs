import assert from "node:assert/strict";
import { execFile as execFileCallback } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFile = promisify(execFileCallback);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const modelPath = path.join(repoRoot, "artifacts", "private-full-raster-clarity-candidate", "private-full-raster-clarity-candidate.json");
const resultPath = path.join(repoRoot, "artifacts", "private-full-raster-clarity-candidate-result.json");
const sourceModelPath = path.join(repoRoot, "artifacts", "private-full-raster-candidate", "private-full-raster-candidate.json");
const toolPath = path.join(repoRoot, "tools", "fff-transition-continuity-narrative-clarity.mjs");

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

test("transition implementation never reopens the previous raw image", async () => {
  const source = await readFile(toolPath, "utf8");
  const applyTransition = source.slice(source.indexOf("async function applyTransition"), source.indexOf("async function extractClipFrame"));
  assert.equal(applyTransition.includes("previousShot.image_path"), false);
  assert.equal(applyTransition.includes("outgoingTerminalFramePath"), true);
  assert.equal(source.includes("rendered_outgoing_final_clip_terminal_frame"), true);
});

test("all eighteen boundaries preserve continuity evidence without reset or flash", async () => {
  const result = await readJson(resultPath);
  const audit = result.transition_boundary_audit;
  assert.equal(audit.status, "PASS");
  assert.equal(audit.boundary_count, 18);
  assert.equal(audit.position_reset_count, 0);
  assert.equal(audit.raw_source_flash_count, 0);
  assert.equal(audit.gap_frame_count, 0);
  assert.equal(audit.overlap_frame_count, 0);
  assert.equal(audit.boundaries.every((boundary) => boundary.reset_allowed === false), true);
  assert.equal(audit.boundaries.every((boundary) => boundary.normalized_pixel_difference <= 0.02), true);
  assert.equal(audit.boundaries.every((boundary) =>
    boundary.boundary_minus_2_sha256
    && boundary.boundary_minus_1_sha256
    && boundary.boundary_at_sha256
    && boundary.boundary_plus_1_sha256
    && boundary.transition_midpoint_sha256
  ), true);
});

test("all nineteen accepted primary image identities remain exact", async () => {
  const [model, sourceModel, result] = await Promise.all([
    readJson(modelPath),
    readJson(sourceModelPath),
    readJson(resultPath)
  ]);
  assert.equal(model.shots.length, 19);
  assert.deepEqual(
    model.shots.map((shot) => [shot.shot_id, shot.image_path, shot.sha256]),
    sourceModel.shots.map((shot) => [shot.shot_id, shot.image_path, shot.sha256])
  );
  assert.equal(result.primary_image_identity.every((record) => record.byte_identical === true), true);
  assert.equal(result.image_generation_call_count, 0);
});

test("clarity tracks and narrative bindings stay within the L1 repair lane", async () => {
  const model = await readJson(modelPath);
  assert.equal(model.timeline_tracks.narration_text.length, 6);
  assert.equal(model.timeline_tracks.subtitles.length, 20);
  assert.equal(model.production_subtitle_draft.cues.length, 20);
  assert.equal(model.narrative_visual_binding.bindings.length, 46);
  assert.deepEqual(model.narrative_visual_binding.revised_binding_counts, {
    L0_caption_only: 0,
    L1_subject_bound: 46,
    L2_relation_bound: 0,
    L3_structure_bound: 0
  });
  assert.equal(model.narrative_visual_binding.full_reassembly_required, false);
  assert.equal(model.final_major_unresolved_questions.length, 2);
  assert.equal(model.timeline_tracks.subtitles.every((cue) => cue.readability_status === "pass"), true);
});

test("media and browser evidence retain the exact silent 180-second timeline", async () => {
  const result = await readJson(resultPath);
  assert.equal(result.mp4.duration_seconds, 180);
  assert.equal(result.mp4.frame_count, 5400);
  assert.equal(result.mp4.width, 960);
  assert.equal(result.mp4.height, 540);
  assert.equal(result.mp4.audio_stream_count, 0);
  assert.equal(result.mp4.subtitle_stream_count, 1);
  assert.equal(result.browser_evidence.passed, true);
  assert.equal(result.browser_evidence.desktop.horizontal_overflow_px, 0);
  assert.equal(result.browser_evidence.narrow.horizontal_overflow_px, 0);
});

test("state dispatcher performs the read-only candidate validation", async () => {
  const { stdout } = await execFile(
    process.execPath,
    [
      path.join(repoRoot, "tools", "fff-state.mjs"),
      "validate-private-full-raster-clarity-candidate",
      resultPath
    ],
    { cwd: repoRoot, windowsHide: true, maxBuffer: 16 * 1024 * 1024 }
  );
  assert.match(stdout, /Validated fff-private-full-raster-clarity-candidate-001: PASS/);
  assert.match(stdout, /Read-only protected inventory stable:/);
});
