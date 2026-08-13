import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const expected = {
  mediaPath: "artifacts/private-raster-case-digest-ichiro-successor-20260813-001/private-raster-case-digest-ichiro-provisional.mp4",
  mediaBytes: 18300218,
  mediaSha256: "1499cd6e753888e29db6cfc269db75cef312c049776ffe30b021dd13e5f2bc10",
  rejectedMediaPath: "artifacts/private-raster-case-digest-audio-continuation-20260812-001/private-raster-case-digest-audio-continuation.mp4",
  rejectedMediaSha256: "cea496c12c7485a47a992877dc2544bff4be9cd6a1a7c7192574adb7215f0c12",
  challengeId: "fff-missing-media-challenge-1499cd6e7538",
  surfaceDir: "artifacts/case-digest-development-review-surface-20260813-001",
  surfaceManifestPath: "artifacts/case-digest-development-review-surface-20260813-001/surface-manifest.json",
  acceptancePath: "artifacts/nondensou-voice-convergence-20260813-001/development-timing-voice-acceptance.json",
  syncReceiptPath: "artifacts/private-raster-case-digest-ichiro-successor-20260813-001/audio-sync-receipt.json",
  captionCsvPath: "artifacts/private-raster-case-digest/case-digest-review-captions.csv",
  shotCsvPath: "artifacts/private-raster-case-digest/selected-shot-sequence.csv"
};

const acceptedPackageHashes = {
  "audio-sync-receipt.json": "bc8a594992f8cbd354ee3ce8fb0e32bb33f5d4ca7ecf187175e36b6ee687d4c1",
  "audio-waveform.jpg": "684fe5e5651f84e616e53fea8963f163560fd2468de6c7114109c8d8c2e0e350",
  "package-manifest.json": "1c692ac41c6c6226fae2b290de73f325f0a81689860582639dea338ab8365586",
  "private-raster-case-digest-ichiro-provisional.mp4": "1499cd6e753888e29db6cfc269db75cef312c049776ffe30b021dd13e5f2bc10",
  "README.md": "3a1da6f4cab0f54b5d87c0f3aac62926645847287ab0fb148ff2c3baacbf699f",
  "review.html": "e1ccf25fb183c45d35417a92dfcfeb7efd0a1b6d4c975150f44288ffb7ee050e"
};

function absolute(relativePath) {
  return resolve(repoRoot, relativePath);
}

function hashFile(relativePath) {
  return createHash("sha256").update(readFileSync(absolute(relativePath))).digest("hex");
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(absolute(relativePath), "utf8"));
}

function parseCsv(relativePath) {
  const lines = readFileSync(absolute(relativePath), "utf8").trim().split(/\r?\n/);
  const headers = lines.shift().split(",");
  return lines.map((line) => Object.fromEntries(line.split(",").map((value, index) => [headers[index], value])));
}

function issue(issues, condition, code, detail) {
  if (!condition) {
    issues.push({ code, detail });
  }
}

function blockForExactMedia(reason, observed = null) {
  const result = {
    schema_version: "fff.caseDigestDevelopmentReviewSurfaceVerification.v1",
    status: "BLOCKED_DISTINCT_CHALLENGE",
    challenge_id: expected.challengeId,
    reason,
    expected_media: {
      path: expected.mediaPath,
      bytes: expected.mediaBytes,
      sha256: expected.mediaSha256
    },
    observed,
    substitution_allowed: false,
    phantom_review_allowed: false,
    playback_performed: false
  };
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  process.exitCode = 2;
}

function verify() {
  const mediaAbsolute = absolute(expected.mediaPath);
  if (!existsSync(mediaAbsolute)) {
    blockForExactMedia("EXACT_MEDIA_MISSING");
    return;
  }

  const observedMedia = {
    bytes: statSync(mediaAbsolute).size,
    sha256: hashFile(expected.mediaPath)
  };
  if (observedMedia.bytes !== expected.mediaBytes || observedMedia.sha256 !== expected.mediaSha256) {
    blockForExactMedia("EXACT_MEDIA_IDENTITY_MISMATCH", observedMedia);
    return;
  }

  const issues = [];
  const acceptance = readJson(expected.acceptancePath);
  const syncReceipt = readJson(expected.syncReceiptPath);
  const model = readJson(expected.surfaceDir + "/surface-model.json");
  const surfaceManifest = readJson(expected.surfaceManifestPath);
  const captions = parseCsv(expected.captionCsvPath);
  const shots = parseCsv(expected.shotCsvPath);
  const html = readFileSync(absolute(expected.surfaceDir + "/review.html"), "utf8");
  const readme = readFileSync(absolute(expected.surfaceDir + "/README.md"), "utf8");
  const voiceOwner = readFileSync(absolute("docs/voice-vision.md"), "utf8");
  const workflow = readFileSync(absolute("docs/workflow.md"), "utf8");

  issue(issues, acceptance.verdict === "ACCEPT_DEVELOPMENT_TIMING_VOICE", "ACCEPTANCE_VERDICT", acceptance.verdict);
  issue(issues, acceptance.scope === "DEVELOPMENT_TIMING_VOICE_ONLY", "ACCEPTANCE_SCOPE", acceptance.scope);
  issue(issues, acceptance.binding?.media_sha256 === expected.mediaSha256, "ACCEPTANCE_MEDIA_HASH", acceptance.binding?.media_sha256);
  issue(issues, acceptance.binding?.media_bytes === expected.mediaBytes, "ACCEPTANCE_MEDIA_BYTES", acceptance.binding?.media_bytes);
  issue(issues, acceptance.closed_gate?.state === "CLOSED_ACCEPTED", "VOICE_GATE_NOT_CLOSED", acceptance.closed_gate?.state);
  issue(issues, acceptance.supersession?.active_human_voice_gate === null, "PHANTOM_VOICE_GATE", acceptance.supersession?.active_human_voice_gate);
  issue(issues, acceptance.supersession?.active_voice_candidate === null, "PHANTOM_VOICE_CANDIDATE", acceptance.supersession?.active_voice_candidate);
  issue(issues, acceptance.supersession?.final_voice_comparison_deferred === true, "FINAL_VOICE_NOT_DEFERRED", acceptance.supersession?.final_voice_comparison_deferred);
  issue(issues, Object.values(acceptance.not_accepted || {}).every((value) => value === false), "ACCEPTANCE_SCOPE_LEAK", acceptance.not_accepted);

  issue(issues, syncReceipt.artifact_id === acceptance.binding.artifact_id, "SYNC_ARTIFACT_DRIFT", syncReceipt.artifact_id);
  issue(issues, syncReceipt.media?.probe?.duration_seconds === 180, "SYNC_DURATION_DRIFT", syncReceipt.media?.probe?.duration_seconds);
  issue(issues, syncReceipt.media?.exact_parent_video_essence_match === true, "PICTURE_ESSENCE_DRIFT", syncReceipt.media?.exact_parent_video_essence_match);
  issue(issues, syncReceipt.media?.exact_parent_subtitle_text_timing_match === true, "SUBTITLE_DRIFT", syncReceipt.media?.exact_parent_subtitle_text_timing_match);
  issue(issues, syncReceipt.media?.parent_video_essence_sha256 === model.identity.picture_essence_sha256, "PICTURE_BINDING_DRIFT", model.identity.picture_essence_sha256);
  issue(issues, syncReceipt.media?.parent_subtitle_srt_sha256 === model.identity.subtitle_text_timing_srt_sha256, "SUBTITLE_BINDING_DRIFT", model.identity.subtitle_text_timing_srt_sha256);

  issue(issues, model.review_route?.state === "ACTIVE_EXACT_MEDIA", "REVIEW_ROUTE_INACTIVE", model.review_route?.state);
  issue(issues, model.review_route?.missing_or_mismatched_media?.challenge_id === expected.challengeId, "CHALLENGE_ID_DRIFT", model.review_route?.missing_or_mismatched_media?.challenge_id);
  issue(issues, model.review_route?.missing_or_mismatched_media?.substitution_allowed === false, "SUBSTITUTION_OPEN", model.review_route?.missing_or_mismatched_media?.substitution_allowed);
  issue(issues, model.identity?.media_sha256 === expected.mediaSha256, "MODEL_MEDIA_HASH", model.identity?.media_sha256);
  issue(issues, model.identity?.media_bytes === expected.mediaBytes, "MODEL_MEDIA_BYTES", model.identity?.media_bytes);
  issue(issues, model.story_stages?.length === 5, "STAGE_COUNT", model.story_stages?.length);
  issue(issues, model.cues?.length === 11, "CUE_COUNT", model.cues?.length);
  issue(issues, model.provenance_stages?.length >= 8, "PROVENANCE_STAGE_COUNT", model.provenance_stages?.length);
  issue(issues, model.integrity?.media_is_referenced_not_copied === true, "MEDIA_COPY_POLICY", model.integrity?.media_is_referenced_not_copied);
  issue(issues, Object.entries(model.integrity || {}).filter(([key]) => key !== "media_is_referenced_not_copied").every(([, value]) => value === false), "SURFACE_SCOPE_LEAK", model.integrity);
  issue(issues, surfaceManifest.surface_id === model.surface_id, "SURFACE_MANIFEST_ID_DRIFT", surfaceManifest.surface_id);
  issue(issues, surfaceManifest.exact_media?.sha256 === expected.mediaSha256, "SURFACE_MANIFEST_MEDIA_HASH", surfaceManifest.exact_media?.sha256);
  issue(issues, surfaceManifest.exact_media?.referenced_not_copied === true, "SURFACE_MANIFEST_MEDIA_COPY_POLICY", surfaceManifest.exact_media?.referenced_not_copied);
  issue(issues, surfaceManifest.decision?.scope === "DEVELOPMENT_TIMING_VOICE_ONLY", "SURFACE_MANIFEST_ACCEPTANCE_SCOPE", surfaceManifest.decision?.scope);
  for (const entry of surfaceManifest.evidence_files || []) {
    issue(issues, existsSync(absolute(entry.path)), "SURFACE_EVIDENCE_MISSING_" + entry.path, null);
    if (existsSync(absolute(entry.path))) {
      issue(issues, statSync(absolute(entry.path)).size === entry.bytes, "SURFACE_EVIDENCE_BYTES_" + entry.path, statSync(absolute(entry.path)).size);
      issue(issues, hashFile(entry.path) === entry.sha256, "SURFACE_EVIDENCE_HASH_" + entry.path, hashFile(entry.path));
    }
  }

  captions.forEach((caption, index) => {
    const cue = model.cues[index];
    issue(issues, cue?.cue_id === caption.cue_id, "CUE_ID_DRIFT_" + (index + 1), cue?.cue_id);
    issue(issues, cue?.shot_id === caption.shot_id, "CUE_SHOT_DRIFT_" + (index + 1), cue?.shot_id);
    issue(issues, cue?.start_seconds === Number(caption.start_seconds), "CUE_START_DRIFT_" + (index + 1), cue?.start_seconds);
    issue(issues, cue?.end_seconds === Number(caption.end_seconds), "CUE_END_DRIFT_" + (index + 1), cue?.end_seconds);
    issue(issues, cue?.text_ja === caption.text_ja, "CUE_TEXT_DRIFT_" + (index + 1), cue?.text_ja);
    issue(issues, cue?.shot_id === shots[index]?.shot_id, "SHOT_SEQUENCE_DRIFT_" + (index + 1), shots[index]?.shot_id);
    issue(issues, cue?.image_sha256 === shots[index]?.sha256, "SHOT_IMAGE_HASH_DRIFT_" + (index + 1), cue?.image_sha256);
  });

  issue(issues, html.includes("../private-raster-case-digest-ichiro-successor-20260813-001/private-raster-case-digest-ichiro-provisional.mp4"), "HTML_MEDIA_BINDING_MISSING", null);
  issue(issues, !/\bautoplay\b/i.test(html), "HTML_AUTOPLAY_PRESENT", null);
  issue(issues, html.includes("validation") && html.includes("media.muted = true") && html.includes("media.volume = 0") && html.includes("media.pause()"), "MUTED_VALIDATION_CONTRACT_MISSING", null);
  issue(issues, html.includes(expected.challengeId), "HTML_CHALLENGE_MISSING", null);
  issue(issues, html.includes("data-verdict") && html.includes("review-note") && html.includes("build-summary"), "NATURAL_LANGUAGE_REVIEW_UI_MISSING", null);
  issue(issues, (html.match(/class=\"cue-button\"/g) || []).length === 0, "STATIC_CUE_BUTTON_DUPLICATION", "cue buttons must be generated from bound data");
  issue(issues, readme.includes(expected.mediaSha256) && readme.includes(expected.challengeId), "README_IDENTITY_MISSING", null);
  issue(issues, voiceOwner.includes(expected.mediaSha256) && voiceOwner.includes("there is no active voice candidate or voice review packet"), "VOICE_OWNER_NOT_CLOSED", null);
  issue(issues, workflow.includes("distinct deterministic missing-media challenge") && workflow.includes("must not substitute"), "WORKFLOW_CHALLENGE_POLICY_MISSING", null);

  const portableNewFiles = [
    expected.acceptancePath,
    expected.surfaceDir + "/surface-model.json",
    expected.surfaceDir + "/review.html",
    expected.surfaceDir + "/README.md",
    expected.surfaceManifestPath
  ];
  portableNewFiles.forEach((relativePath) => {
    const content = readFileSync(absolute(relativePath), "utf8");
    issue(issues, !/019ff[0-9a-f-]+/i.test(content), "HOST_THREAD_ID_IN_" + relativePath, null);
    issue(issues, !/WO-\d{8}-[A-Z0-9-]+/.test(content), "HOST_WORK_ORDER_ID_IN_" + relativePath, null);
  });

  Object.entries(acceptedPackageHashes).forEach(([fileName, sha256]) => {
    const relativePath = "artifacts/private-raster-case-digest-ichiro-successor-20260813-001/" + fileName;
    issue(issues, existsSync(absolute(relativePath)), "ACCEPTED_PACKAGE_FILE_MISSING_" + fileName, null);
    if (existsSync(absolute(relativePath))) {
      issue(issues, hashFile(relativePath) === sha256, "ACCEPTED_PACKAGE_FILE_CHANGED_" + fileName, hashFile(relativePath));
    }
  });

  issue(issues, existsSync(absolute(expected.rejectedMediaPath)), "REJECTED_EVIDENCE_MISSING", expected.rejectedMediaPath);
  if (existsSync(absolute(expected.rejectedMediaPath))) {
    issue(issues, hashFile(expected.rejectedMediaPath) === expected.rejectedMediaSha256, "REJECTED_EVIDENCE_CHANGED", hashFile(expected.rejectedMediaPath));
  }

  const result = {
    schema_version: "fff.caseDigestDevelopmentReviewSurfaceVerification.v1",
    status: issues.length === 0 ? "PASS" : "FAIL",
    surface_id: model.surface_id,
    review_route: issues.length === 0 ? "ACTIVE_EXACT_MEDIA" : "BLOCKED_VALIDATION_FAILURE",
    exact_media: {
      path: expected.mediaPath,
      bytes: observedMedia.bytes,
      sha256: observedMedia.sha256,
      duration_seconds: model.identity.duration_seconds
    },
    voice_gate: {
      verdict: acceptance.verdict,
      scope: acceptance.scope,
      state: acceptance.closed_gate?.state,
      active_human_voice_gate: acceptance.supersession?.active_human_voice_gate,
      final_voice_deferred: acceptance.supersession?.final_voice_comparison_deferred
    },
    review_surface: {
      path: expected.surfaceDir + "/review.html",
      story_stage_count: model.story_stages.length,
      cue_shot_count: model.cues.length,
      natural_language_reply_supported: model.review_axis.natural_language_reply_supported,
      initial_playback: model.review_route.initial_playback,
      muted_validation_query: model.review_route.validation_query
    },
    evidence_manifest: {
      path: expected.surfaceManifestPath,
      evidence_file_count: surfaceManifest.evidence_files.length
    },
    preservation: {
      accepted_package_file_count: Object.keys(acceptedPackageHashes).length,
      accepted_candidate_bytes_unchanged: issues.every((entry) => !entry.code.startsWith("ACCEPTED_PACKAGE_FILE_")),
      rejected_evidence_unchanged: issues.every((entry) => !entry.code.startsWith("REJECTED_EVIDENCE_")),
      picture_essence_exact_parent_match: syncReceipt.media.exact_parent_video_essence_match,
      subtitle_text_timing_exact_parent_match: syncReceipt.media.exact_parent_subtitle_text_timing_match
    },
    challenge_contract: {
      id: expected.challengeId,
      substitution_allowed: false,
      phantom_review_allowed: false
    },
    side_effects: {
      playback_performed: false,
      media_written: false,
      external_call: false,
      dependency_install: false
    },
    issues
  };
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  if (issues.length > 0) {
    process.exitCode = 1;
  }
}

if (process.argv[2] !== "verify" || process.argv.length !== 3) {
  process.stderr.write("Usage: node tools/fff-case-digest-development-review-surface.mjs verify\n");
  process.exitCode = 64;
} else {
  verify();
}
