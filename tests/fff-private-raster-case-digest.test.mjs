import assert from "node:assert/strict";
import { execFile as execFileCallback } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFile = promisify(execFileCallback);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageRoot = path.join(repoRoot, "artifacts", "private-raster-case-digest");
const modelPath = path.join(packageRoot, "private-raster-case-digest.json");
const resultPath = path.join(repoRoot, "artifacts", "private-raster-case-digest-result.json");
const sourceModelPath = path.join(repoRoot, "artifacts", "private-full-raster-clarity-candidate", "private-full-raster-clarity-candidate.json");
const quarantinePath = path.join(repoRoot, "artifacts", "narrative-format-quarantine", "narrative-format-quarantine.json");
const continuityPath = path.join(repoRoot, "artifacts", "recurring-element-continuity", "recurring-element-continuity.json");
const rootManifestPath = path.join(repoRoot, "artifacts", "artifact-manifest.json");
const packageManifestPath = path.join(packageRoot, "private-raster-case-digest-manifest.json");
const toolPath = path.join(repoRoot, "tools", "fff-private-raster-case-digest.mjs");

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function sha256(filePath) {
  return createHash("sha256").update(await readFile(filePath)).digest("hex");
}

test("CASE_DIGEST uses the exact five sections and eleven shot windows", async () => {
  const model = await readJson(modelPath);
  assert.equal(model.format_id, "CASE_DIGEST");
  assert.equal(model.duration_seconds, 180);
  assert.equal(model.exact_frame_count, 5400);
  assert.equal(model.sections.length, 5);
  assert.deepEqual(model.sections.map((section) => section.title_ja), [
    "事件",
    "調査者と手掛かり",
    "記録",
    "疑いと証拠限界",
    "現在の事件状況"
  ]);
  assert.deepEqual(model.shots.map((shot) => [shot.shot_id, shot.start_seconds, shot.end_seconds]), [
    ["shot-b01-01", 0, 12],
    ["shot-b01-02", 12, 24],
    ["shot-b02-01", 24, 38],
    ["shot-b02-02", 38, 52],
    ["shot-b02-03", 52, 65],
    ["shot-b03-01", 65, 81],
    ["shot-b03-02", 81, 97],
    ["shot-b04-01", 97, 116],
    ["shot-b04-02", 116, 136],
    ["shot-b06-01", 136, 158],
    ["shot-b06-03", 158, 180]
  ]);
});

test("all nineteen accepted raster identities and three anchors remain immutable", async () => {
  const [model, source, result] = await Promise.all([readJson(modelPath), readJson(sourceModelPath), readJson(resultPath)]);
  assert.equal(result.image_identity.accepted_source_count, 19);
  assert.equal(result.image_identity.changed_image_count, 0);
  assert.equal(result.image_identity.generated_image_count, 0);
  assert.deepEqual(
    result.image_identity.accepted_source_images.map((image) => [image.shot_id, image.path, image.sha256]),
    source.shots.map((shot) => [shot.shot_id, shot.image_path, shot.sha256])
  );
  assert.equal(model.shots.find((shot) => shot.shot_id === "shot-b02-03").sha256, "5a2b371948dfeed3e15cbdcd81ec4de48e2d4f4db429bbea3ee021c9f74f1c31");
  assert.equal(model.shots.find((shot) => shot.shot_id === "shot-b04-01").sha256, "ec774118a012db4f70ee138ba0e4f8107e8abfdd98f8fb006a95c7e409b4c8d1");
  assert.equal(result.image_identity.accepted_source_images.find((image) => image.shot_id === "shot-b05-02").sha256, "4ebf56180c1bf6ebfbcbff1ffd4a141a07e5c045645a2670ec5a776bee3374ac");
});

test("narrative quarantine rejects text structure while preserving visual and transition scope", async () => {
  const quarantine = await readJson(quarantinePath);
  assert.equal(quarantine.status, "ACTIVE");
  assert.equal(quarantine.quarantine_id, "FFF-Q-3MIN-LINEAR-LORE-EXPOSITION-2026-07-26");
  assert.equal(quarantine.narrative_verdict, "REJECTED_NARRATIVE_FORMAT");
  assert.equal(quarantine.narrative_archive_only, true);
  assert.equal(quarantine.narrative_successor_candidate, false);
  assert.equal(quarantine.quarantined_signature.length, 9);
  assert.equal(quarantine.primary_images_accepted, true);
  assert.equal(quarantine.transition_engine_accepted, true);
  assert.equal(quarantine.preserved_components.includes("all 19 accepted primary-image bytes"), true);
  assert.equal(quarantine.preserved_components.includes("terminal-frame transition implementation"), true);
  assert.equal(quarantine.replacement_artifact_id, "fff-private-raster-case-digest-001");
  assert.equal(quarantine.replacement_status, "ACCEPTED_SCOPED_DEFAULT_OFF_SUCCESSOR_CANDIDATE");
});

test("scoped human acceptance is inherited from exact C2 without expanding production authority", async () => {
  const [model, result, manifest] = await Promise.all([
    readJson(modelPath),
    readJson(resultPath),
    readJson(packageManifestPath)
  ]);
  for (const decision of [model.human_acceptance, result.human_acceptance, manifest.human_acceptance]) {
    assert.equal(decision.decision_id, "FFF-SUP-CASE-DIGEST-C2-ACCEPT-20260726");
    assert.equal(decision.verdict, "ACCEPTED_SCOPED");
    assert.equal(decision.source_binding.human_review_context_commit, "f817003ea2156817220225a1b25f39cbcd7b09f3");
    assert.equal(decision.source_binding.accepted_source_commit, "2e96bd380d47869024587eeb19b3f054064390af");
    assert.equal(decision.source_binding.accepted_source_tree, "accfb3fc5474f4ecb2e39b5c4d69fd8de6a7e841");
    assert.equal(decision.source_binding.accepted_mp4_sha256, "0fb679b5d13d56b726a505d060bf9678daa49a1c138e10657954cd7053765df1");
    assert.equal(decision.integration_candidate_binding.parent_commit, "701869936943f9babd7d4d5287008b646106188b");
    assert.equal(decision.inheritance_proof.accepted_creative_content_changed, false);
    assert.deepEqual(decision.accepted_dimensions, [
      "CASE_DIGEST comprehension and format fitness",
      "review-caption wording and line-break/readability",
      "unchanged existing image sequence and visual essence"
    ]);
    assert.equal(decision.excluded_dimensions.includes("production subtitle selection"), true);
    assert.equal(decision.excluded_dimensions.includes("rights approval or clearance"), true);
    assert.equal(decision.excluded_dimensions.includes("product or public release"), true);
  }
  assert.equal(model.boundaries.production_subtitle_selected, false);
  assert.equal(model.boundaries.audio_generated, false);
  assert.equal(model.boundaries.voice_selected, false);
  assert.equal(model.boundaries.main_integration_performed, false);
  assert.equal(model.boundaries.final_canon, false);
});

test("accepted fixed payloads retain their exact C2 identities", async () => {
  assert.equal(await sha256(path.join(packageRoot, "case-digest-review-captions.csv")), "447512097ba63c63685e2fd5e8549c714fd853de8978cfd93b04322ec35c6f7d");
  assert.equal(await sha256(path.join(packageRoot, "selected-shot-sequence.csv")), "fa50635ec9dc17dfed233bac9c28197644be91e986033c309c8f3019066b7ec2");
  assert.equal(await sha256(path.join(packageRoot, "subtitle-layout-evidence.csv")), "cc7d02ac77d92e95ed94caef70ffa6b1905fb23369b5eb57f260a42ddaf855eb");
  assert.equal(await sha256(path.join(packageRoot, "transition-boundary-map.csv")), "e67312d91f7d8d1e9231acdd419263b05bbcb78044eadb0bd2fcd4568dede5d3");
  assert.equal(await sha256(path.join(packageRoot, "private-raster-case-digest.mp4")), "0fb679b5d13d56b726a505d060bf9678daa49a1c138e10657954cd7053765df1");
});

test("current successor assertions supersede both stale predecessor self-successor contracts", async () => {
  const root = await readJson(rootManifestPath);
  assert.equal(root.active_default_artifact_id, "fff-private-previsualization-timeline-001");
  assert.equal(root.successor_candidate_artifact_id, "fff-private-raster-case-digest-001");
  assert.equal(root.private_full_raster_candidate.successor_candidate, false);
  assert.equal(root.private_full_raster_clarity_candidate.successor_candidate, false);
  assert.equal(root.private_raster_case_digest.successor_candidate, true);
  assert.equal(root.private_raster_case_digest.active_default, false);
  assert.equal(root.private_raster_case_digest.main_integration_performed, false);
});

test("continuity Bible contains the exact seven required elements and future gates", async () => {
  const continuity = await readJson(continuityPath);
  assert.equal(continuity.element_count, 7);
  assert.deepEqual(continuity.elements.map((element) => element.element_id), [
    "bellless_tower",
    "mira_workbench",
    "missing_brother_memo",
    "brass_moth",
    "clock_0917",
    "minute_name_ledger",
    "council_institutional_space"
  ]);
  assert.equal(continuity.elements.every((element) => element.invariant && element.forbidden_drift && element.future_generation_gate), true);
  const brassMoth = continuity.elements.find((element) => element.element_id === "brass_moth");
  assert.deepEqual(brassMoth.protected_anchor_shot_ids, ["shot-b05-02"]);
  assert.equal(
    brassMoth.canonical_image_paths_and_hashes.find((image) => image.shot_id === "shot-b05-02").sha256,
    "4ebf56180c1bf6ebfbcbff1ffd4a141a07e5c045645a2670ec5a776bee3374ac"
  );
});

test("subtitle layouts use actual width evidence without authored break hints or line-rule failures", async () => {
  const model = await readJson(modelPath);
  assert.equal(model.subtitle_layout.measurement_engine, "sharp/libvips/Pango text raster metadata");
  assert.equal(model.subtitle_layout.evidence.length, 44);
  assert.equal(model.review_captions.every((cue) => !/[\r\n｜|]/.test(cue.text_ja)), true);
  assert.equal(model.subtitle_layout.evidence.every((entry) =>
    entry.status === "PASS"
    && entry.line_count <= 2
    && entry.kinsoku_pass
    && entry.orphan_pass
    && entry.proper_name_pass
    && entry.safe_width_pass
  ), true);
  assert.equal(model.production_subtitle_draft.cues.every((cue, index) =>
    cue.start_seconds === model.review_captions[index].start_seconds
    && cue.end_seconds === model.review_captions[index].end_seconds
    && [...cue.text_ja].length < [...model.review_captions[index].text_ja].length
    && cue.selected_for_production === false
    && cue.voice_calibrated === false
  ), true);
});

test("transition implementation starts non-hard transitions from rendered outgoing terminal frames", async () => {
  const source = await readFile(toolPath, "utf8");
  const applyTransition = source.slice(source.indexOf("async function applyTransition"), source.indexOf("async function extractClipFrame"));
  assert.equal(applyTransition.includes("outgoingTerminalFramePath"), true);
  assert.equal(applyTransition.includes("previousShot.image_path"), false);
  const result = await readJson(resultPath);
  assert.equal(result.transition_boundary_audit.status, "PASS");
  assert.equal(result.transition_boundary_audit.boundary_count, 10);
  assert.equal(result.transition_boundary_audit.position_reset_count, 0);
  assert.equal(result.transition_boundary_audit.raw_source_flash_count, 0);
  assert.equal(result.transition_boundary_audit.boundaries.every((boundary) => boundary.raw_outgoing_source_reopened === false), true);
});

test("future continuity gate accepts the three declared modes and rejects identity drift", async () => {
  const result = await readJson(resultPath);
  const testById = new Map(result.targeted_tests.cases.map((item) => [item.id, item]));
  for (const id of [
    "accept-exact-anchor-reuse",
    "accept-deterministic-anchor-derivative",
    "accept-declared-anchor-generation-contract",
    "reject-future-missing-source-kind",
    "reject-future-missing-anchor-identity",
    "reject-future-moth-geometry-drift",
    "reject-future-moth-wing-drift",
    "reject-future-moth-screw-drift",
    "reject-future-tower-architecture-drift",
    "reject-future-clock-time-without-authority",
    "reject-future-ledger-columns-drift",
    "reject-future-new-character-identity"
  ]) {
    assert.equal(testById.get(id)?.passed, true, `${id} must pass`);
  }
});

test("silent H.264 media and local browser evidence retain exact runtime", async () => {
  const result = await readJson(resultPath);
  assert.equal(result.mp4.codec_name, "h264");
  assert.equal(result.mp4.duration_seconds, 180);
  assert.equal(result.mp4.frame_count, 5400);
  assert.equal(result.mp4.audio_stream_count, 0);
  assert.equal(result.mp4.subtitle_stream_count, 1);
  assert.equal(result.browser_evidence.passed, true);
  assert.equal(result.browser_evidence.desktop.horizontal_overflow_px, 0);
  assert.equal(result.browser_evidence.narrow.horizontal_overflow_px, 0);
});

test("state dispatcher performs the read-only CASE_DIGEST validation", async () => {
  const { stdout } = await execFile(
    process.execPath,
    [path.join(repoRoot, "tools", "fff-state.mjs"), "validate-private-raster-case-digest", resultPath],
    { cwd: repoRoot, windowsHide: true, maxBuffer: 16 * 1024 * 1024 }
  );
  assert.match(stdout, /Validated fff-private-raster-case-digest-001: PASS/);
  assert.match(stdout, /Accepted source inventory stable: 19 images/);
});
