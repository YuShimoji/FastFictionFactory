import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (relativePath) => JSON.parse(readFileSync(resolve(repoRoot, relativePath), "utf8"));
const sha256 = (relativePath) => createHash("sha256").update(readFileSync(resolve(repoRoot, relativePath))).digest("hex");

const mediaPath = "artifacts/private-raster-case-digest-ichiro-successor-20260813-001/private-raster-case-digest-ichiro-provisional.mp4";
const mediaSha = "1499cd6e753888e29db6cfc269db75cef312c049776ffe30b021dd13e5f2bc10";
const surfaceDir = "artifacts/case-digest-development-review-surface-20260813-001";

test("development timing voice acceptance binds only the exact Ichiro media", () => {
  const receipt = readJson("artifacts/nondensou-voice-convergence-20260813-001/development-timing-voice-acceptance.json");
  assert.equal(receipt.verdict, "ACCEPT_DEVELOPMENT_TIMING_VOICE");
  assert.equal(receipt.scope, "DEVELOPMENT_TIMING_VOICE_ONLY");
  assert.equal(receipt.binding.media_sha256, mediaSha);
  assert.equal(receipt.binding.media_bytes, 18300218);
  assert.equal(receipt.closed_gate.state, "CLOSED_ACCEPTED");
  assert.equal(receipt.supersession.active_human_voice_gate, null);
  assert.equal(receipt.supersession.active_voice_candidate, null);
  assert.equal(receipt.supersession.final_voice_comparison_deferred, true);
  assert.ok(Object.values(receipt.not_accepted).every((value) => value === false));
  if (existsSync(resolve(repoRoot, mediaPath))) {
    assert.equal(statSync(resolve(repoRoot, mediaPath)).size, 18300218);
    assert.equal(sha256(mediaPath), mediaSha);
  } else {
    const model = readJson(surfaceDir + "/surface-model.json");
    assert.equal(model.review_route.missing_or_mismatched_media.challenge_id, "fff-missing-media-challenge-1499cd6e7538");
    assert.equal(model.review_route.missing_or_mismatched_media.substitution_allowed, false);
  }
});

test("surface keeps exact bytes available only as parked historical presentation evidence", () => {
  const model = readJson(surfaceDir + "/surface-model.json");
  const manifest = readJson(surfaceDir + "/surface-manifest.json");
  assert.equal(model.review_route.state, "PARKED_PRESENTATION_EVIDENCE");
  assert.equal(model.review_route.historical, true);
  assert.equal(model.review_route.exact_media_availability, "AVAILABLE_EXACT_BYTES");
  assert.equal(model.review_route.current_project_gate, false);
  assert.equal(model.review_route.current_human_action, false);
  assert.equal(model.review_route.superseded_by.owner, "docs/production-lanes.md");
  assert.equal(model.review_route.superseded_by.machine_state, "artifacts/case-digest-production-state.json");
  assert.equal(model.review_axis.state, "HISTORICAL_SUPERSEDED");
  assert.equal(model.review_axis.current_review_packet_allowed, false);
  assert.equal(model.review_axis.packet_generation, "DISABLED_SUPERSEDED");
  assert.equal(model.review_route.initial_playback, "PAUSED");
  assert.equal(model.review_route.missing_or_mismatched_media.challenge_id, "fff-missing-media-challenge-1499cd6e7538");
  assert.equal(model.review_route.missing_or_mismatched_media.substitution_allowed, false);
  assert.equal(model.review_route.missing_or_mismatched_media.phantom_review_allowed, false);
  assert.equal(model.identity.media_sha256, mediaSha);
  assert.equal(model.integrity.media_is_referenced_not_copied, true);
  assert.equal(model.integrity.picture_changed, false);
  assert.equal(model.integrity.subtitle_text_or_timing_changed, false);
  assert.equal(model.integrity.accepted_development_audio_changed, false);
  assert.equal(manifest.surface_id, model.surface_id);
  assert.equal(manifest.review_route, "PARKED_PRESENTATION_EVIDENCE");
  assert.equal(manifest.current_project_gate, false);
  assert.equal(manifest.current_human_action, false);
  assert.equal(manifest.review_capability.current_human_axis, null);
  assert.equal(manifest.review_capability.current_review_packet_allowed, false);
  assert.equal(manifest.exact_media.sha256, mediaSha);
  assert.equal(manifest.exact_media.referenced_not_copied, true);
  assert.equal(manifest.decision.scope, "DEVELOPMENT_TIMING_VOICE_ONLY");
});

test("five story stages index all eleven exact caption and shot bindings", () => {
  const model = readJson(surfaceDir + "/surface-model.json");
  const captionLines = readFileSync(resolve(repoRoot, "artifacts/private-raster-case-digest/case-digest-review-captions.csv"), "utf8").trim().split(/\r?\n/).slice(1);
  const shotLines = readFileSync(resolve(repoRoot, "artifacts/private-raster-case-digest/selected-shot-sequence.csv"), "utf8").trim().split(/\r?\n/).slice(1);
  assert.equal(model.story_stages.length, 5);
  assert.equal(model.cues.length, 11);
  assert.equal(new Set(model.cues.map((cue) => cue.stage_id)).size, 5);
  model.cues.forEach((cue, index) => {
    const caption = captionLines[index].split(",");
    const shot = shotLines[index].split(",");
    assert.equal(cue.cue_id, caption[0]);
    assert.equal(cue.shot_id, caption[1]);
    assert.equal(cue.start_seconds, Number(caption[2]));
    assert.equal(cue.end_seconds, Number(caption[3]));
    assert.equal(cue.text_ja, caption[4]);
    assert.equal(cue.shot_id, shot[1]);
    assert.equal(cue.image_sha256, shot[6]);
  });
});

test("review HTML is directly bound, initially paused, muted in validation mode, and cannot create a current packet", () => {
  const html = readFileSync(resolve(repoRoot, surfaceDir, "review.html"), "utf8");
  assert.match(html, /\.\.\/private-raster-case-digest-ichiro-successor-20260813-001\/private-raster-case-digest-ichiro-provisional\.mp4/);
  assert.doesNotMatch(html, /\bautoplay\b/i);
  assert.match(html, /validationMuted/);
  assert.match(html, /media\.muted = true/);
  assert.match(html, /media\.volume = 0/);
  assert.match(html, /media\.pause\(\)/);
  assert.match(html, /PARKED_PRESENTATION_EVIDENCE/);
  assert.match(html, /current_project_gate=false \/ current_human_action=false/);
  assert.match(html, /docs\/production-lanes\.md/);
  assert.match(html, /artifacts\/case-digest-production-state\.json/);
  assert.doesNotMatch(html, /data-verdict/);
  assert.doesNotMatch(html, /id="review-note"/);
  assert.doesNotMatch(html, /id="build-summary"/);
  assert.doesNotMatch(html, /ACTIVE_EXACT_MEDIA|ACTIVE_SINGLE_REVIEW_AXIS|ACTIVE SINGLE AXIS/);
  assert.match(html, /fff-missing-media-challenge-1499cd6e7538/);
});

test("portable new evidence contains no host thread or work-order identifier", () => {
  [
    "artifacts/nondensou-voice-convergence-20260813-001/development-timing-voice-acceptance.json",
    surfaceDir + "/surface-model.json",
    surfaceDir + "/review.html",
    surfaceDir + "/README.md",
    surfaceDir + "/surface-manifest.json"
  ].forEach((relativePath) => {
    const content = readFileSync(resolve(repoRoot, relativePath), "utf8");
    assert.doesNotMatch(content, /019ff[0-9a-f-]+/i);
    assert.doesNotMatch(content, /WO-\d{8}-[A-Z0-9-]+/);
  });
});

test("standalone verifier reports a parked exact-media surface without playback or a current action", () => {
  const result = spawnSync(process.execPath, ["tools/fff-case-digest-development-review-surface.mjs", "verify"], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  const report = JSON.parse(result.stdout);
  if (existsSync(resolve(repoRoot, mediaPath))) {
    assert.equal(result.status, 0, result.stderr + "\n" + result.stdout);
    assert.equal(report.status, "PASS");
    assert.equal(report.review_route, "PARKED_PRESENTATION_EVIDENCE");
    assert.equal(report.current_project_gate, false);
    assert.equal(report.current_human_action, false);
    assert.equal(report.exact_media.sha256, mediaSha);
    assert.equal(report.review_surface.story_stage_count, 5);
    assert.equal(report.review_surface.cue_shot_count, 11);
    assert.equal(report.review_surface.natural_language_reply_supported, false);
    assert.equal(report.review_surface.current_review_packet_allowed, false);
    assert.equal(report.superseded_by.owner, "docs/production-lanes.md");
    assert.ok(report.evidence_manifest.evidence_file_count >= 10);
    assert.equal(report.side_effects.playback_performed, false);
    assert.equal(report.side_effects.media_written, false);
    assert.deepEqual(report.issues, []);
  } else {
    assert.equal(result.status, 2, result.stderr + "\n" + result.stdout);
    assert.equal(report.status, "BLOCKED_DISTINCT_CHALLENGE");
    assert.equal(report.challenge_id, "fff-missing-media-challenge-1499cd6e7538");
    assert.equal(report.substitution_allowed, false);
    assert.equal(report.phantom_review_allowed, false);
  }
});

test("legacy surface verifier rejects any attempt to become current or generate a current clear/fix packet", () => {
  const directory = mkdtempSync(join(tmpdir(), "fff-parked-surface-"));
  try {
    const model = readJson(surfaceDir + "/surface-model.json");
    model.review_route.state = "ACTIVE_EXACT_MEDIA";
    model.review_route.current_project_gate = true;
    model.review_route.current_human_action = true;
    model.review_axis.state = "ACTIVE_SINGLE_REVIEW_AXIS";
    model.review_axis.natural_language_reply_supported = true;
    model.review_axis.current_review_packet_allowed = true;
    model.review_axis.packet_generation = "CLEAR_FIX_PACKET";
    const candidatePath = join(directory, "surface-model.json");
    writeFileSync(candidatePath, JSON.stringify(model, null, 2));

    const result = spawnSync(process.execPath, ["tools/fff-case-digest-development-review-surface.mjs", "verify", candidatePath], {
      cwd: repoRoot,
      encoding: "utf8"
    });
    const report = JSON.parse(result.stdout);
    assert.equal(result.status, 1, result.stderr + "\n" + result.stdout);
    assert.equal(report.status, "FAIL");
    assert.equal(report.current_project_gate, false);
    assert.equal(report.current_human_action, false);
    assert.ok(report.issues.some((entry) => entry.code === "LEGACY_ROUTE_NOT_PARKED"));
    assert.ok(report.issues.some((entry) => entry.code === "LEGACY_SURFACE_CURRENT_PROJECT_GATE"));
    assert.ok(report.issues.some((entry) => entry.code === "LEGACY_SURFACE_CURRENT_HUMAN_ACTION"));
    assert.ok(report.issues.some((entry) => entry.code === "LEGACY_CURRENT_REVIEW_PACKET_ENABLED"));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
