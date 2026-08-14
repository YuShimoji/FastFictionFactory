import assert from "node:assert/strict";
import { execFile as execFileCallback } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFile = promisify(execFileCallback);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rejectedRoot = path.join(repoRoot, "artifacts", "private-raster-case-digest-audio-continuation-20260812-001");
const successorRoot = path.join(repoRoot, "artifacts", "private-raster-case-digest-ichiro-successor-20260813-001");
const convergenceRoot = path.join(repoRoot, "artifacts", "nondensou-voice-convergence-20260813-001");
const toolPath = path.join(repoRoot, "tools", "fff-private-raster-case-digest-audio-continuation.mjs");

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function sha256(filePath) {
  return createHash("sha256").update(await readFile(filePath)).digest("hex");
}

test("exact Haruka rejection is closed without changing the historical package", async () => {
  const receipt = await readJson(path.join(convergenceRoot, "rejection-receipt.json"));
  assert.equal(receipt.candidate.artifact_id, "fff-private-raster-case-digest-audio-continuation-20260812-001");
  assert.equal(receipt.candidate.media_sha256, "cea496c12c7485a47a992877dc2544bff4be9cd6a1a7c7192574adb7215f0c12");
  assert.equal(receipt.verdict, "REJECT");
  assert.equal(receipt.usable, false);
  assert.equal(receipt.review_action.old_review_action, "CLOSED");
  assert.equal(receipt.review_action.implicit_acceptance, false);
  assert.equal(receipt.review_action.may_reopen_from_machine_pass, false);
  assert.equal(receipt.preservation.candidate_directory_modified, false);
  const liveFiles = (await readdir(rejectedRoot)).sort();
  assert.deepEqual(liveFiles, receipt.preserved_package_files.map((item) => item.path).sort());
  for (const item of receipt.preserved_package_files) {
    const filePath = path.join(rejectedRoot, item.path);
    assert.equal((await readFile(filePath)).length, item.bytes);
    assert.equal(await sha256(filePath), item.sha256);
  }
});

test("one project voice owner separates narration, closes the accepted timing gate, and defers final voice", async () => {
  const [vision, inventory] = await Promise.all([
    readFile(path.join(repoRoot, "docs", "voice-vision.md"), "utf8"),
    readJson(path.join(convergenceRoot, "voice-inventory.json"))
  ]);
  assert.match(vision, /Original Japanese narration/);
  assert.match(vision, /Final Japanese voice/);
  assert.match(vision, /YouTube localization/);
  assert.match(vision, /there is no active voice candidate or voice review packet/i);
  assert.match(vision, /A_REPLACEABLE_ASSETS_AND_METADATA/);
  assert.match(vision, /parked presentation evidence rather than the current project gate/i);
  assert.match(vision, /ACCEPT_DEVELOPMENT_TIMING_VOICE/);
  assert.match(vision, /cea496c12c7485a47a992877dc2544bff4be9cd6a1a7c7192574adb7215f0c12/);
  assert.match(vision, /machine checks[\s\S]*do not certify/i);
  assert.equal(inventory.authority_owner, "docs/voice-vision.md");
  assert.equal(inventory.active_implementation_lane_count, 1, "inventory is the preserved pre-acceptance snapshot");
  assert.equal(inventory.active_human_gate_count, 1, "inventory is the preserved pre-acceptance snapshot");
  const classifications = new Set(inventory.items.map((item) => item.classification));
  for (const required of [
    "canonical_current",
    "provisional_evidence",
    "rejected_superseded",
    "duplicate_task_wording",
    "future_final_voice_gate",
    "youtube_localization",
    "densou_specific_out_of_lane"
  ]) assert.equal(classifications.has(required), true, `missing classification ${required}`);
});

test("noise diagnosis starts at raw Haruka and never converts metrics into listening acceptance", async () => {
  const diagnosis = await readJson(path.join(convergenceRoot, "noise-root-cause.json"));
  assert.equal(diagnosis.rejected_candidate.media_sha256, "cea496c12c7485a47a992877dc2544bff4be9cd6a1a7c7192574adb7215f0c12");
  assert.match(diagnosis.layer_findings.raw_synthesizer_output, /earliest observed failure/);
  assert.ok(diagnosis.stages[0].dc_offset > 0.019);
  assert.ok(diagnosis.stages[2].dc_offset > diagnosis.stages[0].dc_offset);
  assert.ok(diagnosis.stages[3].dc_offset > 0.026);
  assert.equal(diagnosis.stages.every((stage) => stage.clipped_sample_count === 0), true);
  assert.equal(diagnosis.stages.every((stage) => stage.adjacent_delta_over_0_75_count === 0), true);
  assert.equal(diagnosis.successor_probe.objective_noise_gate_pass, true);
  assert.equal(diagnosis.successor_probe.perceptual_acceptance_claimed, false);
  assert.equal(diagnosis.successor_full_candidate.perceptual_acceptance_claimed, false);
});

test("Ichiro successor is one non-Densou provisional gate with immutable picture and subtitles", async () => {
  if (!existsSync(path.join(successorRoot, "audio-sync-receipt.json"))) {
    const acceptance = await readJson(path.join(convergenceRoot, "development-timing-voice-acceptance.json"));
    assert.equal(acceptance.binding.media_sha256, "1499cd6e753888e29db6cfc269db75cef312c049776ffe30b021dd13e5f2bc10");
    assert.equal(acceptance.supersession.active_human_voice_gate, null);
    return;
  }
  const [receipt, manifest, html] = await Promise.all([
    readJson(path.join(successorRoot, "audio-sync-receipt.json")),
    readJson(path.join(successorRoot, "package-manifest.json")),
    readFile(path.join(successorRoot, "review.html"), "utf8")
  ]);
  assert.equal(receipt.artifact_id, "fff-private-raster-case-digest-ichiro-successor-20260813-001");
  assert.equal(receipt.content_lane, "NON_DENSOU_CASE_DIGEST");
  assert.equal(receipt.media.probe.duration_seconds, 180);
  assert.equal(receipt.media.probe.video.frame_count, 5400);
  assert.equal(receipt.voice.voice_name, "Microsoft Ichiro");
  assert.equal(receipt.voice.gender, "Male");
  assert.equal(receipt.voice.timing_voice_only, true);
  assert.equal(receipt.voice.final_voice_selected, false);
  assert.equal(receipt.voice.playback_used, false);
  assert.equal(receipt.media.exact_parent_video_essence_match, true);
  assert.equal(receipt.media.exact_parent_subtitle_text_timing_match, true);
  assert.equal(receipt.media.signal_quality.objective_noise_gate_pass, true);
  assert.equal(receipt.media.signal_quality.perceptual_acceptance_claimed, false);
  assert.equal(receipt.media.signal_quality.cue_regions.length, 11);
  assert.equal(receipt.media.signal_quality.cue_regions.every((cue) => cue.objective_noise_gate_pass), true);
  assert.equal(receipt.boundaries.audio_human_accepted, false);
  assert.equal(receipt.boundaries.actual_densou_source_used, false);
  assert.equal(receipt.boundaries.densou_source_gate_polled_or_reopened, false);
  assert.equal(manifest.payload_count, 5);
  for (const payload of manifest.payloads) {
    const filePath = path.join(successorRoot, payload.path);
    assert.equal((await readFile(filePath)).length, payload.bytes);
    assert.equal(await sha256(filePath), payload.sha256);
  }
  const mediaPayload = manifest.payloads.find((payload) => payload.path.endsWith(".mp4"));
  assert.equal(mediaPayload.sha256, "1499cd6e753888e29db6cfc269db75cef312c049776ffe30b021dd13e5f2bc10");
  assert.match(html, /NON-DENSOU/);
  assert.match(html, /NOT ACCEPTED/);
  assert.match(html, /暗黙に受入れ済みではありません/);
  assert.match(html, /Objective signal gate/);
  assert.doesNotMatch(html, /autoplay\s*=/i);
  assert.match(html, /<video controls preload="metadata">/);
  assert.match(html, /private-raster-case-digest-ichiro-provisional\.mp4/);
});

test("successor verifier passes without synthesis, playback, or external access", async () => {
  if (!existsSync(path.join(successorRoot, "private-raster-case-digest-ichiro-provisional.mp4"))) {
    const acceptance = await readJson(path.join(convergenceRoot, "development-timing-voice-acceptance.json"));
    assert.equal(acceptance.scope, "DEVELOPMENT_TIMING_VOICE_ONLY");
    assert.equal(acceptance.supersession.active_voice_candidate, null);
    return;
  }
  const { stdout } = await execFile(process.execPath, [toolPath, "verify", "ichiro-provisional"], {
    cwd: repoRoot,
    windowsHide: true,
    timeout: 60_000
  });
  const result = JSON.parse(stdout.trim());
  assert.equal(result.result, "PASS");
  assert.equal(result.artifact_id, "fff-private-raster-case-digest-ichiro-successor-20260813-001");
  assert.equal(result.media.sha256, "1499cd6e753888e29db6cfc269db75cef312c049776ffe30b021dd13e5f2bc10");
});

test("voice convergence evidence manifest closes every supporting text and tool by hash", async () => {
  const manifest = await readJson(path.join(convergenceRoot, "evidence-manifest.json"));
  assert.equal(manifest.transition.acceptance_ready, false);
  assert.equal(manifest.transition.human_audio_accepted, true);
  assert.equal(manifest.transition.human_audio_acceptance_scope, "DEVELOPMENT_TIMING_VOICE_ONLY");
  assert.equal(manifest.transition.active_human_voice_gate, null);
  assert.equal(manifest.transition.active_project_implementation_lane, "CASE_DIGEST_CONTENT_PROCESS_REVIEW", "preserved 2026-08-13 transition snapshot");
  assert.equal(manifest.current_authority_update.active_project_implementation_lane, "STRUCTURED_PRODUCTION_LANES");
  assert.equal(manifest.current_authority_update.legacy_content_process_surface, "PARKED_PRESENTATION_EVIDENCE");
  assert.equal(manifest.transition.final_voice_selected, false);
  assert.equal(manifest.boundaries.playback_performed, false);
  assert.equal(manifest.boundaries.gui_opened, false);
  assert.equal(manifest.boundaries.dependency_added_or_downloaded, false);
  for (const item of manifest.evidence_files) {
    const filePath = path.join(repoRoot, item.path);
    assert.equal((await readFile(filePath)).length, item.bytes);
    assert.equal(await sha256(filePath), item.sha256);
  }
});
