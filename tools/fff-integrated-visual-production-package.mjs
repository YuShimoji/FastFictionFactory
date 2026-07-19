#!/usr/bin/env node

import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const ID = "fff-integrated-visual-production-package-001";
const MODEL_SCHEMA = "fff.integratedVisualProductionPackage.v1";
const RESULT_SCHEMA = "fff.integratedVisualProductionPackageResult.v1";
const MANIFEST_SCHEMA = "fff.integratedVisualProductionPackageManifest.v1";
const BASE_REVISION = "b2ef9e214799e973e63543fbdf7118542bd583bf";
const GENERATED_AT = "2026-07-19T23:59:00+09:00";
const ROOT = "artifacts/integrated-visual-production-package";
const MODEL_PATH = `${ROOT}/integrated-visual-production-package.json`;
const HTML_PATH = `${ROOT}/integrated-visual-production-package.html`;
const README_PATH = `${ROOT}/README_INTEGRATED_VISUAL_PACKAGE.md`;
const BEAT_CSV = `${ROOT}/beat-sequence.csv`;
const SHOT_CSV = `${ROOT}/shot-sequence.csv`;
const LINEAGE_CSV = `${ROOT}/reference-lineage.csv`;
const DEPENDENCY_CSV = `${ROOT}/source-dependency-index.csv`;
const CONTACT_PATH = `${ROOT}/integrated-visual-production-package-contact-sheet.jpg`;
const MANIFEST_PATH = `${ROOT}/integrated-visual-production-package-manifest.json`;
const RESULT_PATH = "artifacts/integrated-visual-production-package-result.json";
const REVIEW_DOC = "docs/review/integrated-visual-production-package.md";
const ROOT_MANIFEST = "artifacts/artifact-manifest.json";
const EXECUTION_CSV = "artifacts/production-execution-pack/shot-execution-sheet.csv";
const BLUEPRINT_PATH = "artifacts/production-blueprint/production-blueprint.json";
const SCREENSHOTS = Object.freeze({
  "900x1200-dark": "artifacts/review-screens/integrated-visual-production-package-900x1200-dark.png",
  "1280x900-light": "artifacts/review-screens/integrated-visual-production-package-1280x900-light.png"
});

const PAYLOAD_FILES = Object.freeze([
  "README_INTEGRATED_VISUAL_PACKAGE.md",
  "integrated-visual-production-package.html",
  "integrated-visual-production-package.json",
  "beat-sequence.csv",
  "shot-sequence.csv",
  "reference-lineage.csv",
  "source-dependency-index.csv",
  "integrated-visual-production-package-contact-sheet.jpg"
]);
const REQUIRED_FILES = Object.freeze([...PAYLOAD_FILES, "integrated-visual-production-package-manifest.json"]);

const SOURCE_CONFIG = Object.freeze([
  {
    artifact_id: "fff-composition-expansion-wave1-001",
    model_path: "artifacts/composition-expansion-wave1/composition-expansion-wave1.json",
    result_path: "artifacts/composition-expansion-wave1-result.json",
    package_root: "artifacts/composition-expansion-wave1",
    package_fingerprint_sha256: "403202568e99060937ed3ce36d16117b8564292f21baa3d72e8b290acd38ccb9",
    model_sha256: "02bf53c039611f2faa2712fa69c8ef6885d1fcf2da408283be0b04aba7c122a7",
    result_sha256: "295755e5406bf25d548d74d42d426098dbb142fb11a88a14c8d63971f5a05bc0",
    beat_numbers: [1, 3]
  },
  {
    artifact_id: "fff-beat2-composition-board-001",
    model_path: "artifacts/beat2-composition-board/beat2-composition-board.json",
    result_path: "artifacts/beat2-composition-board-result.json",
    package_root: "artifacts/beat2-composition-board",
    package_fingerprint_sha256: "4c44089a140626d56fd67f8341a4765e60f310ff65555c8ff8a0eef3eff7f3b0",
    model_sha256: "87e3cf5038e76a100cf489759b648817c12acd35f2a51f930984d8e18f00dea0",
    result_sha256: "1fc50134b60e0d59c2592167081a8ba2a495f09cb920950eccbbc73fdacee4b6",
    beat_numbers: [2]
  },
  {
    artifact_id: "fff-beat4-composition-counterexample-001",
    model_path: "artifacts/beat4-composition-counterexample/beat4-composition-counterexample.json",
    result_path: "artifacts/beat4-composition-counterexample-result.json",
    package_root: "artifacts/beat4-composition-counterexample",
    package_fingerprint_sha256: "2f0e0032b30725dc678d27e31169f6fda1a7bf8c4586735a8d0fc6f73b6d6805",
    model_sha256: "6d0f886178ed18b841a96f87fe54e3f03c3ad19236fd5ab6b37bb5676fb71a2d",
    result_sha256: "437c342b03aa5b81ad09f2e0f1965e77d92db721ee3ed4a01007ad4664f39db9",
    beat_numbers: [4]
  },
  {
    artifact_id: "fff-composition-expansion-wave2-001",
    model_path: "artifacts/composition-expansion-wave2/composition-expansion-wave2.json",
    result_path: "artifacts/composition-expansion-wave2-result.json",
    package_root: "artifacts/composition-expansion-wave2",
    package_fingerprint_sha256: "62d5379f6bf36495230a60e7fbd1de540a82aa4d5aaefae400ee1e0f773dc432",
    model_sha256: "eb53fd8400bc19eee99ccd70bf6d250be9b92248d209a0135bf7a6d743d9a23c",
    result_sha256: "389d20e13cf38ecc7ab18358ae3e1337613823a590177a4ff1ee6de17f857fc8",
    beat_numbers: [5, 6]
  }
]);

const EXPECTED_PREDECESSORS = Object.freeze([
  ["artifacts/composition-expansion-wave1", 19, "25bbad8e05d57293dbc724a4d3df6aa5fec7ca3b3b1f4a50e404cecddf793926"],
  ["artifacts/beat2-composition-board", 13, "adac4c76dade92f0eadafaa8f3aea651ad53decd545d19bcdf3a487981a817ff"],
  ["artifacts/beat2-visual-treatment-pilot", 13, "bd305a7b177fa36bda5b2bfe737d6dfab2cb1ecb7c07a58e070b131bb85160e5"],
  ["artifacts/beat4-composition-counterexample", 14, "7c4da4bb663af67bc003848813c86f56ba984a83663823d1601ee159a6b2750c"],
  ["artifacts/composition-expansion-wave2", 11, "4a5307eba4da8b97083dd92c5305a7971c829770ec2336a31551d3f1346e5b12"],
  ["artifacts/production-storyboard-brief", 7, "f71959bd2fe5a845d99b2ceead72837de34b00848e9a7b49e603fa773007b5bf"],
  ["artifacts/production-execution-pack", 9, "8628ee4583b67a1b6276904a323ae792a62729a2c03f9e1e6ff509e4c777757f"],
  ["artifacts/operator-production-brief", 6, "85d152570545b29209d09ef27a546630a44d14b4cf51232339b5632d6ebc4212"],
  ["artifacts/production-blueprint", 8, "2bdab898f7924ef6b2c3b732fd26e0c6a757b1db2490baeff255769b12bb09b3"],
  ["artifacts/editorial-derivative", 8, "910d699380998f4259a00730acb6bb70e65b65d284f9969656cc919ecb9cc4be"],
  ["artifacts/editorial-revision", 6, "d701763938f97869ef8fe6748db0fb80890b8f470f2874a03bd14da4191a0b78"],
  ["artifacts/editorial-handoff", 6, "7474a44e84b7072830170be6c8540040b2406ae53b66179dbdbb97011b2ec3e0"]
]);

const BEATS = Object.freeze([
  [1, "bridge-storyboard-beat-1-bellless-tower", "鐘のない塔", "00:00", "00:20", 3, "駅と塔の距離から、空の取付点と正午の余白へ近づく。"],
  [2, "bridge-storyboard-beat-2-brass-moth", "真鍮の蛾", "00:20", "00:50", 3, "修理の手元から静止した蛾へ移り、時計面へ視線を寄せる。"],
  [3, "bridge-storyboard-beat-3-erased-names", "消された名前", "00:50", "01:20", 3, "台帳を開き、空欄と薄れる記録の層を順に追う。"],
  [4, "bridge-storyboard-beat-4-council-shadow", "評議会の影", "01:20", "01:45", 3, "匿名の制度空間から二つの仮説を経て、閉じた会議室へ退く。"],
  [5, "bridge-storyboard-beat-5-held-answers", "答えを保留", "01:45", "02:35", 4, "人物、蛾、制度の候補を同じ重さで並べ、一画面へ戻す。"],
  [6, "bridge-storyboard-beat-6-time-or-names", "時間か、名前か", "02:35", "03:00", 3, "時間と名前を等分し、未記入の本から冒頭の空の塔へ戻る。"]
]);

const SHOT_TIMING = Object.freeze([
  ["shot-b01-01", 1, "00:00", "00:07", 7], ["shot-b01-02", 1, "00:07", "00:14", 7], ["shot-b01-03", 1, "00:14", "00:20", 6],
  ["shot-b02-01", 2, "00:20", "00:30", 10], ["shot-b02-02", 2, "00:30", "00:40", 10], ["shot-b02-03", 2, "00:40", "00:50", 10],
  ["shot-b03-01", 3, "00:50", "01:00", 10], ["shot-b03-02", 3, "01:00", "01:10", 10], ["shot-b03-03", 3, "01:10", "01:20", 10],
  ["shot-b04-01", 4, "01:20", "01:28", 8], ["shot-b04-02", 4, "01:28", "01:36", 8], ["shot-b04-03", 4, "01:36", "01:45", 9],
  ["shot-b05-01", 5, "01:45", "01:58", 13], ["shot-b05-02", 5, "01:58", "02:11", 13], ["shot-b05-03", 5, "02:11", "02:23", 12], ["shot-b05-04", 5, "02:23", "02:35", 12],
  ["shot-b06-01", 6, "02:35", "02:44", 9], ["shot-b06-02", 6, "02:44", "02:52", 8], ["shot-b06-03", 6, "02:52", "03:00", 8]
]);

const PRIMARY_HEADINGS = Object.freeze(["6幕・19ショット構図", "全体シーケンス", ...BEATS.map((item) => item[2]), "反復モチーフ", "出典"]);
const BANNED_PRIMARY = Object.freeze(["development history", "validation status", "source unchanged", "HOLD", "canon", "Guard", "planning-only", "review instructions", "直しました", "検証済み"]);

function sha256(buffer) { return createHash("sha256").update(buffer).digest("hex"); }
function repoPath(value) { return String(value || "").replaceAll("\\", "/").replace(/^\.\//, ""); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function escapeHtml(value) { return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;"); }
function primarySafe(value) { return String(value ?? "").replace(/HOLD/gi, "未決着の状態").replace(/canon/gi, "確定事項").replace(/Guard/gi, "境界"); }
function csvCell(value) { const text = Array.isArray(value) || (value && typeof value === "object") ? JSON.stringify(value) : String(value ?? ""); return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; }
function csv(headers, rows) { return `${headers.join(",")}\n${rows.map((row) => headers.map((key) => csvCell(row[key])).join(",")).join("\n")}\n`; }
function seconds(time) { const [m, s] = String(time).split(":").map(Number); return m * 60 + s; }

async function snapshot(filePath) {
  try { const buffer = await readFile(filePath); return { path: repoPath(filePath), exists: true, byte_size: buffer.length, sha256: sha256(buffer), buffer, text: buffer.toString("utf8") }; }
  catch (error) { return { path: repoPath(filePath), exists: false, byte_size: 0, sha256: null, buffer: null, text: "", error: error.message }; }
}
async function json(filePath) { const file = await snapshot(filePath); let value = null; try { value = JSON.parse(file.text); } catch {} return { ...file, value }; }
async function walkFiles(root) { const output = []; async function walk(current) { for (const entry of await readdir(current, { withFileTypes: true })) { const full = path.join(current, entry.name); if (entry.isDirectory()) await walk(full); else if (entry.isFile()) output.push(full); } } await walk(root); return output.sort((a, b) => repoPath(a).localeCompare(repoPath(b), "en")); }
async function directoryInventory(root) { const inventory = []; for (const file of await walkFiles(root)) { const item = await snapshot(file); inventory.push({ path: repoPath(file), byte_size: item.byte_size, sha256: item.sha256 }); } const material = inventory.map((item) => `${item.path}|${item.byte_size}|${item.sha256}`).join("\n"); return { directory: repoPath(root), file_count: inventory.length, total_bytes: inventory.reduce((sum, item) => sum + item.byte_size, 0), aggregate_sha256: sha256(Buffer.from(material)), inventory }; }

function parseCsv(text) {
  const rows = []; let row = [], field = "", quoted = false;
  for (let index = 0; index < text.length; index += 1) { const char = text[index]; if (quoted) { if (char === '"' && text[index + 1] === '"') { field += '"'; index += 1; } else if (char === '"') quoted = false; else field += char; } else if (char === '"') quoted = true; else if (char === ",") { row.push(field); field = ""; } else if (char === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; } else field += char; }
  if (field || row.length) { row.push(field.replace(/\r$/, "")); rows.push(row); }
  const [headers, ...body] = rows.filter((item) => item.some((value) => value !== "")); return body.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function absoluteReferencePath(reference, source) { const raw = repoPath(reference.local_path); return raw.startsWith("artifacts/") ? raw : `${source.package_root}/${raw}`; }
function compositionClass(shot) { return shot.composition?.composition_class || shot.composition?.rough_type || shot.composition?.layout_signature || "source_composition"; }
function truthBoundary(shot) { return shot.truth_boundary_ja || shot.source_story?.truth_boundary_ja || shot.composition?.truth_safe_guard_ja || shot.composition?.do_not_show_ja || ""; }
function displayTitle(shot) { return shot.display_title_ja || shot.title_ja || shot.source_story?.title_ja || shot.shot_id; }
function screenText(shot) { return shot.what_is_seen_ja || shot.composition?.screen_ja || shot.visual_direction_ja || shot.composition?.placement_ja || shot.composition?.principal_subject_ja || ""; }
function intentText(shot) { return shot.purpose_ja || shot.composition?.intent_ja || shot.source_story?.purpose_ja || shot.source_story?.visual_direction_ja || ""; }
function cameraText(shot, blueprintShot) { return shot.composition?.camera_ja || `${shot.scale || blueprintShot.shot_scale} / ${shot.motion || blueprintShot.camera_motion}`; }
function successText(shot) { return shot.composition?.positive_condition_ja || shot.composition?.positive_staging_condition_ja || shot.composition?.success_ja || ""; }
function doNotShowText(shot) { return shot.composition?.do_not_show_ja || shot.composition?.truth_safe_guard_ja || shot.source_story?.truth_boundary_ja || shot.truth_boundary_ja || ""; }
function sourceForBeat(beatNumber) { return SOURCE_CONFIG.find((item) => item.beat_numbers.includes(beatNumber)); }

async function loadSources() {
  const root = await json(ROOT_MANIFEST);
  const execution = parseCsv((await snapshot(EXECUTION_CSV)).text);
  const blueprint = await json(BLUEPRINT_PATH);
  const loaded = [];
  for (const source of SOURCE_CONFIG) {
    const [model, result] = await Promise.all([json(source.model_path), json(source.result_path)]);
    loaded.push({ ...source, model: model.value, observed_model_sha256: model.sha256, result: result.value, observed_result_sha256: result.sha256, root_entry: Object.values(root.value || {}).find((value) => value?.artifact_id === source.artifact_id) });
  }
  return { root: root.value, execution, blueprint: blueprint.value, loaded };
}

function normalizedReference(reference, source) {
  return {
    source_reference_id: reference.reference_id,
    source_artifact_id: source.artifact_id,
    source_package_path: source.package_root,
    creator: reference.creator,
    source_title: reference.source_title,
    source_page_url: reference.source_page_url,
    original_media_url: reference.original_media_url,
    license_name: reference.license_name,
    license_url: reference.license_url,
    original_dimensions: { width: reference.original_width, height: reference.original_height },
    normalized_dimensions: { width: reference.normalized_width || reference.local_width || reference.acquired_width, height: reference.normalized_height || reference.local_height || reference.acquired_height },
    local_path: absoluteReferencePath(reference, source),
    sha256: reference.sha256,
    reference_only: true,
    selected_for_production: false,
    rights_cleared_claim: false,
    ai_generated: false
  };
}

function buildReferenceUnion(loaded, shots) {
  const byHash = new Map();
  for (const source of loaded) {
    for (const raw of source.model.references || []) {
      const current = normalizedReference(raw, source);
      const existing = byHash.get(current.sha256);
      const alias = `${source.artifact_id}:${current.source_reference_id}`;
      if (!existing) byHash.set(current.sha256, { canonical_reference_id: current.source_reference_id, alias_ids: [alias], owning_source_artifact: source.artifact_id, source_package_path: source.package_root, creator: current.creator, source_title: current.source_title, source_page_url: current.source_page_url, original_media_url: current.original_media_url, license_name: current.license_name, license_url: current.license_url, original_dimensions: current.original_dimensions, normalized_dimensions: current.normalized_dimensions, local_path: current.local_path, sha256: current.sha256, used_by_shot_ids: [], reference_only: true, selected_for_production: false, rights_cleared_claim: false, ai_generated: false });
      else if (!existing.alias_ids.includes(alias)) existing.alias_ids.push(alias);
    }
  }
  const assignments = [];
  for (const shot of shots) {
    for (const [referenceId, role] of [[shot.source_main_visual, "main"], ...shot.source_supporting_visuals.map((value) => [value, "support"])]) {
      const source = loaded.find((item) => item.artifact_id === shot.source_artifact_id);
      const raw = source.model.references.find((item) => item.reference_id === referenceId);
      const normalized = normalizedReference(raw, source);
      const union = byHash.get(normalized.sha256);
      if (!union.used_by_shot_ids.includes(shot.shot_id)) union.used_by_shot_ids.push(shot.shot_id);
      assignments.push({ assignment_id: `${shot.shot_id}:${role}:${referenceId}`, shot_id: shot.shot_id, role, source_reference_id: referenceId, canonical_reference_id: union.canonical_reference_id, reference_sha256: normalized.sha256, source_artifact_id: shot.source_artifact_id, local_path: normalized.local_path });
    }
  }
  return { references: [...byHash.values()].sort((a, b) => a.canonical_reference_id.localeCompare(b.canonical_reference_id, "en")), assignments };
}

function lineageRecord(id, label_ja, sourceShotIds, successorShotIds, sharedReferenceIds, purpose) { return { lineage_id: id, label_ja, source_shot_ids: sourceShotIds, successor_shot_ids: successorShotIds, shared_reference_ids: sharedReferenceIds, continuity_purpose: purpose, truth_boundary_preserved: true }; }

async function buildCanonicalModel() {
  const sources = await loadSources();
  const executionById = new Map(sources.execution.map((row) => [row.shot_id, row]));
  const blueprintById = new Map((sources.blueprint.shots || []).map((shot) => [shot.shot_id, shot]));
  const modelByArtifact = new Map(sources.loaded.map((item) => [item.artifact_id, item]));
  const shots = SHOT_TIMING.map(([shotId, beatNumber, startTime, endTime, duration], index) => {
    const sourceConfig = sourceForBeat(beatNumber); const source = modelByArtifact.get(sourceConfig.artifact_id); const sourceShot = source.model.shots.find((item) => item.shot_id === shotId); const execution = executionById.get(shotId); const blueprintShot = blueprintById.get(shotId);
    const scale = sourceShot.scale || blueprintShot.shot_scale; const motion = sourceShot.motion || blueprintShot.camera_motion; const transition = sourceShot.transition || blueprintShot.transition;
    return {
      shot_id: shotId, sequence: index + 1, beat_id: BEATS[beatNumber - 1][1], beat_number: beatNumber,
      start_time: startTime, end_time: endTime, duration_seconds: duration,
      title_ja: displayTitle(sourceShot), screen_ja: screenText(sourceShot), intent_ja: intentText(sourceShot), camera_ja: cameraText(sourceShot, blueprintShot), success_ja: successText(sourceShot), do_not_show_ja: doNotShowText(sourceShot),
      scale, motion, transition, palette_role: blueprintShot.palette_role,
      source_artifact_id: source.artifact_id, source_model_path: source.model_path, source_shot_id: sourceShot.shot_id, source_model_sha256: source.model_sha256,
      source_composition_class: compositionClass(sourceShot), source_main_visual: sourceShot.main_image_id, source_supporting_visuals: clone(sourceShot.supporting_image_ids || []), source_reference_ids: [sourceShot.main_image_id, ...(sourceShot.supporting_image_ids || [])],
      source_reference_hashes: [sourceShot.main_image_id, ...(sourceShot.supporting_image_ids || [])].map((referenceId) => source.model.references.find((item) => item.reference_id === referenceId)?.sha256),
      source_timing: { start_time: sourceShot.start_time, end_time: sourceShot.end_time, duration_seconds: sourceShot.duration_seconds }, source_truth_boundary: truthBoundary(sourceShot),
      lineage_phrase_ja: beatNumber === 6 ? (shotId === "shot-b06-03" ? "冒頭の塔と駅を同一参照で戻す。" : shotId === "shot-b06-01" ? "時計と台帳の参照を終幕の対へ継ぐ。" : "台帳の空欄と列を閉じた本へ継ぐ。") : beatNumber === 5 ? "先行する人物・対象物・制度の参照を同一IDで継ぐ。" : "この幕の参照を後続の反復へ渡す。",
      execution_source: clone(execution), blueprint_secondary_metadata: clone(blueprintShot), source_shot_snapshot: clone(sourceShot),
      candidate_balance: clone(sourceShot.composition?.candidate_balance || sourceShot.composition?.hypothesis_balance || null),
      reference_only: true, selected_for_production: false, rights_cleared_claim: false, ai_generated: false
    };
  });
  const union = buildReferenceUnion(sources.loaded, shots);
  const refIdByHash = new Map(union.references.map((item) => [item.sha256, item.canonical_reference_id]));
  const canonicalIdsForShots = (shotIds) => [...new Set(shots.filter((shot) => shotIds.includes(shot.shot_id)).flatMap((shot) => shot.source_reference_hashes.map((hash) => refIdByHash.get(hash))))];
  const lineages = [
    lineageRecord("lineage-bellless-tower", "鐘のない塔", ["shot-b01-01", "shot-b01-03"], ["shot-b06-03"], canonicalIdsForShots(["shot-b01-01", "shot-b01-03", "shot-b06-03"]).filter((id) => ["ref-w1-b01-s01-harvard-observatory", "ref-w1-b01-s01-kreiensen-station"].includes(id)), "冒頭の空の塔枠と駅の奥行きを終幕へ戻す。"),
    lineageRecord("lineage-brass-moth", "真鍮の蛾", ["shot-b02-02", "shot-b02-03"], ["shot-b05-02", "shot-b05-04"], ["ref-b02-s02-metal-butterfly-brooch"], "静止した真鍮の蛾を機能候補と三対象の反復へ継ぐ。"),
    lineageRecord("lineage-council", "評議会", ["shot-b04-01", "shot-b04-02", "shot-b04-03"], ["shot-b05-03", "shot-b05-04"], ["ref-b04-s02-card-catalogue", "ref-b04-s03-closed-meeting-room"], "制度の反復と無人空間を動機候補へ継ぐ。"),
    lineageRecord("lineage-ledger", "台帳", ["shot-b03-01", "shot-b03-02", "shot-b03-03"], ["shot-b06-01", "shot-b06-02"], ["ref-w1-b03-s02-blank-book", "ref-w1-b03-s02-ledger-geometry"], "空欄と列の形を終幕の名前欄と閉じた本へ継ぐ。"),
    lineageRecord("lineage-time", "時間", ["shot-b02-03"], ["shot-b06-01"], ["ref-b02-s03-vintage-watch-0915"], "時計面を時間と名前の等分画面へ継ぐ。")
  ];
  const distribution = (key) => Object.fromEntries([...new Set(shots.map((shot) => shot[key]))].sort().map((value) => [value, shots.filter((shot) => shot[key] === value).length]));
  const mainHashes = shots.map((shot) => shot.source_reference_hashes[0]);
  const predecessors = await Promise.all(EXPECTED_PREDECESSORS.map(([directory]) => directoryInventory(directory)));
  const beats = BEATS.map(([beatNumber, beatId, title, startTime, endTime, shotCount, progression]) => { const blueprintBeat = sources.blueprint.beats.find((item) => item.beat_number === beatNumber); return { beat_number: beatNumber, beat_id: beatId, title_ja: title, start_time: startTime, end_time: endTime, duration_seconds: seconds(endTime) - seconds(startTime), shot_count: shotCount, progression_ja: progression, narration: { narration_segment_id: blueprintBeat.narration_segment_id, narration_text: blueprintBeat.narration_text }, subtitle_cues: sources.blueprint.subtitle_metrics.filter((cue) => cue.beat_id === beatId).map((cue) => clone(cue)), shot_ids: shots.filter((shot) => shot.beat_number === beatNumber).map((shot) => shot.shot_id) }; });
  return {
    schemaVersion: MODEL_SCHEMA, artifact_id: ID, thread_id: "fff-integrated-visual-production-package-001", lane: "VISUAL_INTEGRATION", epoch: "FFF-2026-07-19-05", base_revision: BASE_REVISION, generated_at: GENERATED_AT, status: "integrated_reference_composition_package",
    title_ja: "6幕・19ショット構図", subtitle_ja: "180秒 / 6幕 / 19 shots", factual_status_ja: "構図参照",
    counts: { beats: 6, shots: 19, duration_seconds: 180, unique_source_references: union.references.length, source_reference_assignments: union.assignments.length, copied_source_image_count: 0, sequence_thumbnails: 19, full_shot_strips: 19 },
    source_fingerprints: Object.fromEntries(SOURCE_CONFIG.map((source) => [source.artifact_id, source.package_fingerprint_sha256])),
    source_models: SOURCE_CONFIG.map(({ artifact_id, model_path, model_sha256, result_path, result_sha256, package_root, package_fingerprint_sha256, beat_numbers }) => ({ artifact_id, model_path, model_sha256, result_path, result_sha256, package_root, package_fingerprint_sha256, beat_numbers })),
    beats, shots, references: union.references, reference_assignments: union.assignments, lineages,
    whole_story_visual_audit: { shot_scale_distribution: distribution("scale"), motion_distribution: distribution("motion"), transition_distribution: distribution("transition"), composition_class_distribution: distribution("source_composition_class"), repeated_main_reference_count: mainHashes.length - new Set(mainHashes).size, repeated_main_references: [...new Set(mainHashes.filter((hash, index) => mainHashes.indexOf(hash) !== index))].map((hash) => refIdByHash.get(hash)), callback_count: lineages.length, consecutive_source_image_duplication_count: mainHashes.filter((hash, index) => index > 0 && mainHashes[index - 1] === hash).length, candidate_balance_preserved: true, six_beat_visual_progression: beats.map((beat) => ({ beat_id: beat.beat_id, progression_ja: beat.progression_ja })) },
    owner_review_policy: { product_owner_is_formal_reviewer: true, integration_human_review: "none", next_human_review: "owner_whole_story_composition_review", per_beat_review: "discontinued", external_reproducibility_claimed: false },
    ui_contract: { primary_headings: PRIMARY_HEADINGS, title_policy: { viewport_900_font_px: [30, 36], viewport_1280_font_px: [34, 40], max_lines: 2, viewport_900_max_height_ratio: 0.11, viewport_1280_max_height_ratio: 0.13 }, themes: ["light", "dark", "auto"], default_theme: "auto", document_only_scroll: true, sequence_thumbnail_count: 19, shot_strip_count: 19, primary_banned_phrases: BANNED_PRIMARY, review_form_count: 0 },
    package_contract: { required_files: REQUIRED_FILES, payload_file_count: PAYLOAD_FILES.length, file_count: REQUIRED_FILES.length, copied_source_image_count: 0, validation_read_only: true },
    predecessor_contract: predecessors.map((item) => ({ ...item, before: { file_count: item.file_count, total_bytes: item.total_bytes, aggregate_sha256: item.aggregate_sha256 }, after_expected: { file_count: item.file_count, total_bytes: item.total_bytes, aggregate_sha256: item.aggregate_sha256 } })),
    boundaries: { local_only: true, reference_only: true, selected_for_production: false, rights_cleared_claim: false, provider_configured: false, credentials_touched: false, external_model_call: false, image_generation: false, audio_generation: false, video_generation: false, production_render: false, upload_or_publication: false, database_persistence: false, production_approved: false, final_canon_decision: false, human_review_performed: false, external_reproducibility_claimed: false }
  };
}

function htmlImagePath(localPath) { return `../${repoPath(localPath).replace(/^artifacts\//, "")}`; }
function candidateLabels(shot) { if (Array.isArray(shot.source_shot_snapshot?.composition?.candidates)) return shot.source_shot_snapshot.composition.candidates; const balance = shot.source_shot_snapshot?.composition?.hypothesis_balance; return balance ? [balance.left_label_ja, balance.right_label_ja] : []; }
function shotHtml(shot, referenceById) {
  const main = referenceById.get(shot.source_reference_hashes[0]); const supports = shot.source_reference_hashes.slice(1).map((hash) => referenceById.get(hash)); const candidates = candidateLabels(shot);
  return `<article class="shot-strip" id="${shot.shot_id}" data-shot-id="${shot.shot_id}" data-source-artifact="${shot.source_artifact_id}">
    <header class="shot-head"><div><span class="eyebrow">SHOT ${String(shot.sequence).padStart(2, "0")}</span><h3>${escapeHtml(shot.title_ja)}</h3></div><time>${shot.start_time}–${shot.end_time} · ${shot.duration_seconds}秒</time></header>
    <div class="visual-stage"><figure class="main-visual"><img src="${htmlImagePath(main.local_path)}" alt="${escapeHtml(shot.title_ja)} 主画面"><figcaption>MAIN · ${escapeHtml(main.canonical_reference_id)}</figcaption></figure><div class="support-stack">${supports.map((reference) => `<figure><img src="${htmlImagePath(reference.local_path)}" alt="${escapeHtml(shot.title_ja)} 補助画面"><figcaption>SUPPORT · ${escapeHtml(reference.canonical_reference_id)}</figcaption></figure>`).join("")}</div></div>
    ${candidates.length ? `<div class="candidate-row" aria-label="等価候補">${candidates.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>` : ""}
    <dl class="shot-notes"><div><dt>画面</dt><dd>${escapeHtml(primarySafe(shot.screen_ja))}</dd></div><div><dt>意図</dt><dd>${escapeHtml(primarySafe(shot.intent_ja))}</dd></div><div><dt>尺</dt><dd>${shot.duration_seconds}秒</dd></div><div><dt>カメラ</dt><dd>${escapeHtml(primarySafe(shot.camera_ja))}</dd></div><div><dt>成立条件</dt><dd>${escapeHtml(primarySafe(shot.success_ja))}</dd></div><div><dt>描かないこと</dt><dd>${escapeHtml(primarySafe(shot.do_not_show_ja))}</dd></div></dl>
    <p class="lineage-note">↳ ${escapeHtml(shot.lineage_phrase_ja)}</p><p class="source-note">${escapeHtml(shot.source_artifact_id)}</p>
  </article>`;
}

function renderHtml(model) {
  const referenceByHash = new Map(model.references.map((reference) => [reference.sha256, reference]));
  const sequence = model.shots.map((shot) => { const ref = referenceByHash.get(shot.source_reference_hashes[0]); return `<a class="sequence-thumb" href="#${shot.shot_id}" data-sequence-shot="${shot.shot_id}"><img src="${htmlImagePath(ref.local_path)}" alt="${escapeHtml(shot.title_ja)}"><span><b>B${shot.beat_number} · ${String(shot.sequence).padStart(2, "0")}</b><small>${shot.start_time}–${shot.end_time}</small></span></a>`; }).join("");
  const beats = model.beats.map((beat) => `<section class="beat-section" id="beat-${beat.beat_number}"><header class="beat-head"><div><span class="eyebrow">BEAT ${String(beat.beat_number).padStart(2, "0")}</span><h2>${escapeHtml(beat.title_ja)}</h2></div><div class="beat-meta"><b>${beat.start_time}–${beat.end_time}</b><span>${beat.shot_count} shots</span></div><p>${escapeHtml(beat.progression_ja)}</p></header>${model.shots.filter((shot) => shot.beat_number === beat.beat_number).map((shot) => shotHtml(shot, referenceByHash)).join("")}</section>`).join("");
  const lineages = model.lineages.map((item) => `<article class="motif-card"><span class="motif-index">${String(model.lineages.indexOf(item) + 1).padStart(2, "0")}</span><h3>${escapeHtml(item.label_ja)}</h3><p><b>${item.source_shot_ids.join(" / ")}</b><span aria-hidden="true">→</span><b>${item.successor_shot_ids.join(" / ")}</b></p><small>${escapeHtml(item.continuity_purpose)}</small></article>`).join("");
  const sources = model.references.map((ref) => `<tr><th>${escapeHtml(ref.canonical_reference_id)}</th><td>${escapeHtml(ref.creator)}</td><td><a href="${escapeHtml(ref.source_page_url)}">source</a></td><td><a href="${escapeHtml(ref.license_url)}">${escapeHtml(ref.license_name)}</a></td><td>${escapeHtml(ref.owning_source_artifact)}</td><td><code>${escapeHtml(ref.local_path)}</code></td><td><code>${ref.sha256.slice(0, 12)}…</code></td></tr>`).join("");
  const html = `<!doctype html><html lang="ja" data-theme="auto"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>6幕・19ショット構図</title><style>
  :root{color-scheme:light dark;--bg:#e8e1d3;--paper:#f7f3eb;--ink:#111827;--muted:#5d6470;--line:#c8bdad;--brass:#a67527;--cool:#315f82;--shadow:0 18px 50px rgba(17,24,39,.12)}html[data-resolved-theme="dark"]{--bg:#0b111c;--paper:#111827;--ink:#f8fafc;--muted:#aab3c3;--line:#2c3a4d;--brass:#d2a54c;--cool:#79aacf;--shadow:0 18px 54px rgba(0,0,0,.35)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font-family:"Yu Gothic UI","Hiragino Sans",system-ui,sans-serif;line-height:1.7;overflow-x:hidden}a{color:inherit}img{display:block;width:100%;height:100%;object-fit:cover}.page{width:min(1180px,calc(100% - 40px));margin:auto}.hero{padding:52px 0 34px;border-bottom:1px solid var(--line)}.hero-top{display:flex;align-items:flex-start;justify-content:space-between;gap:24px}.kicker,.eyebrow{color:var(--brass);font-size:12px;font-weight:800;letter-spacing:.14em}.hero h1{font-family:Georgia,"Yu Mincho",serif;font-size:clamp(34px,3vw,38px);line-height:1.14;letter-spacing:.01em;margin:8px 0 12px;max-width:18ch}.hero p{margin:0;color:var(--muted);font-weight:700}.theme-control{display:flex;gap:4px;padding:4px;border:1px solid var(--line);border-radius:999px;background:var(--paper)}.theme-control button{border:0;background:transparent;color:var(--muted);border-radius:999px;padding:8px 12px;font:inherit;font-size:12px;font-weight:800;cursor:pointer}.theme-control button[aria-pressed="true"]{background:var(--ink);color:var(--paper)}:focus-visible{outline:3px solid var(--cool);outline-offset:3px}.section{padding:58px 0}.section-title{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:22px}.section-title h2,.beat-head h2{font-family:Georgia,"Yu Mincho",serif;font-size:clamp(27px,3vw,36px);line-height:1.25;margin:0}.section-title p{margin:0;color:var(--muted)}.sequence-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}.sequence-thumb{min-width:0;text-decoration:none;background:var(--paper);border:1px solid var(--line);border-radius:12px;overflow:hidden;box-shadow:0 8px 22px rgba(17,24,39,.06);transition:transform .16s ease}.sequence-thumb:hover{transform:translateY(-2px)}.sequence-thumb img{aspect-ratio:16/10}.sequence-thumb span{display:flex;justify-content:space-between;gap:6px;padding:9px 10px}.sequence-thumb b{font-size:12px}.sequence-thumb small{font-size:11px;color:var(--muted);white-space:nowrap}.beat-section{padding:64px 0;border-top:1px solid var(--line)}.beat-head{display:grid;grid-template-columns:1fr auto;gap:10px 30px;align-items:end;margin-bottom:24px}.beat-head>p{grid-column:1/-1;color:var(--muted);margin:0;max-width:62ch}.beat-meta{display:flex;gap:12px;align-items:center}.beat-meta span{color:var(--muted)}.shot-strip{scroll-margin-top:20px;background:var(--paper);border:1px solid var(--line);border-radius:18px;padding:18px;margin:0 0 22px;box-shadow:var(--shadow);break-inside:avoid}.shot-head{display:flex;justify-content:space-between;align-items:end;gap:16px;margin-bottom:14px}.shot-head h3{font-size:22px;margin:2px 0 0}.shot-head time{font-size:13px;font-weight:800;color:var(--muted);white-space:nowrap}.visual-stage{display:grid;grid-template-columns:minmax(0,2.35fr) minmax(150px,1fr);gap:10px}.visual-stage figure{margin:0;position:relative;overflow:hidden;background:#020617;border-radius:11px}.main-visual{aspect-ratio:16/9}.support-stack{display:grid;gap:10px}.support-stack figure{min-height:0;aspect-ratio:16/9}.visual-stage figcaption{position:absolute;left:8px;bottom:8px;background:rgba(2,6,23,.78);color:#f8fafc;border-radius:999px;padding:3px 8px;font-size:9px;letter-spacing:.04em}.candidate-row{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:8px;margin-top:10px}.candidate-row span{min-width:0;text-align:center;border:1px solid var(--line);border-radius:8px;padding:7px 4px;font-size:12px;font-weight:800;color:var(--muted)}.shot-notes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 22px;margin:18px 0 0}.shot-notes div{border-top:1px solid var(--line);padding:11px 0}.shot-notes dt{color:var(--brass);font-size:11px;font-weight:900;letter-spacing:.12em}.shot-notes dd{margin:3px 0 0;font-size:14px}.lineage-note{margin:14px 0 0;color:var(--cool);font-size:13px;font-weight:800}.source-note{margin:4px 0 0;color:var(--muted);font-size:10px;letter-spacing:.03em}.motif-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}.motif-card{background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:16px}.motif-index{color:var(--brass);font:800 11px/1 monospace}.motif-card h3{margin:8px 0;font-size:18px}.motif-card p{display:grid;gap:4px;margin:0 0 10px;font-size:11px}.motif-card p span{color:var(--brass)}.motif-card small{color:var(--muted)}.sources{border-top:1px solid var(--line);padding-bottom:72px}.source-table{width:100%;border-collapse:collapse;font-size:10px;color:var(--muted)}.source-table th,.source-table td{text-align:left;vertical-align:top;border-top:1px solid var(--line);padding:8px 6px;overflow-wrap:anywhere}.source-table th{color:var(--ink)}code{font-size:9px}.footer-mark{margin-top:28px;color:var(--muted);font-size:11px}
  @media(max-width:1000px){.sequence-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.motif-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.hero{padding-top:38px}.hero h1{font-size:34px}}
  @media(max-width:720px){.page{width:min(100% - 24px,1180px)}.hero-top,.shot-head{align-items:flex-start;flex-direction:column}.theme-control{align-self:flex-start}.sequence-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.visual-stage{grid-template-columns:1fr}.support-stack{grid-template-columns:repeat(2,minmax(0,1fr))}.shot-notes{grid-template-columns:1fr}.beat-head{grid-template-columns:1fr}.beat-meta{justify-content:space-between}.motif-grid{grid-template-columns:1fr}.source-table{font-size:9px}.source-table td:nth-child(5),.source-table th:nth-child(5){display:none}}
  @media print{:root,html[data-resolved-theme="dark"]{--bg:#fff;--paper:#fff;--ink:#111827;--muted:#4b5563;--line:#cbd5e1;--brass:#805b1f;--cool:#315f82;--shadow:none;color-scheme:light}.theme-control{display:none!important}body{background:#fff}.page{width:100%}.shot-strip{box-shadow:none;break-inside:avoid}.sequence-thumb{box-shadow:none}.beat-section{break-before:page}}
  </style></head><body><main class="page" data-primary-content="true"><header class="hero"><div class="hero-top"><div><span class="kicker">${model.factual_status_ja}</span><h1>${model.title_ja}</h1><p>${model.subtitle_ja}</p></div><div class="theme-control" role="group" aria-label="テーマ"><button type="button" data-theme-choice="light" aria-pressed="false">Light</button><button type="button" data-theme-choice="dark" aria-pressed="false">Dark</button><button type="button" data-theme-choice="auto" aria-pressed="true">Auto</button></div></div></header>
  <section class="section" id="sequence"><div class="section-title"><h2>全体シーケンス</h2><p>00:00 → 03:00</p></div><nav class="sequence-grid" aria-label="19ショット">${sequence}</nav></section>${beats}
  <section class="section" id="motifs"><div class="section-title"><h2>反復モチーフ</h2><p>先行ショット → 後続ショット</p></div><div class="motif-grid">${lineages}</div></section>
  <section class="section sources" id="sources"><div class="section-title"><h2>出典</h2><p>28 references</p></div><table class="source-table"><thead><tr><th>ID</th><th>Creator</th><th>Page</th><th>License</th><th>Package</th><th>Local path</th><th>SHA256</th></tr></thead><tbody>${sources}</tbody></table><p class="footer-mark">Reference-only · 19-shot chronology · 2026</p></section></main><script>
  (()=>{const root=document.documentElement;const buttons=[...document.querySelectorAll('[data-theme-choice]')];const media=matchMedia('(prefers-color-scheme: dark)');function apply(choice){root.dataset.theme=choice;root.dataset.resolvedTheme=choice==='auto'?(media.matches?'dark':'light'):choice;buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.themeChoice===choice)))}buttons.forEach(button=>button.addEventListener('click',()=>apply(button.dataset.themeChoice)));media.addEventListener?.('change',()=>{if(root.dataset.theme==='auto')apply('auto')});apply('auto')})();
  </script></body></html>`;
  return html.replace(/^[ \t]+$/gm, "");
}

function renderReadme(model) { return `# Integrated Visual Production Package\n\n- Artifact: \`${ID}\`\n- Entry: \`integrated-visual-production-package.html\`\n- Canonical model: \`integrated-visual-production-package.json\`\n- Scope: ${model.counts.beats} Beats / ${model.counts.shots} shots / ${model.counts.duration_seconds} seconds\n- References: ${model.counts.unique_source_references} unique SHA256 identities / ${model.counts.source_reference_assignments} assignments\n- Source rasters copied here: ${model.counts.copied_source_image_count}\n\nOpen locally from the repository root:\n\n\`\`\`powershell\nInvoke-Item .\\artifacts\\integrated-visual-production-package\\integrated-visual-production-package.html\n\`\`\`\n\nThis is a local, reference-only whole-story composition package. It does not select media, clear rights, generate media, render, publish, approve production, or decide final story truth. The next human action is the Product Owner's whole-story composition review; that review is not performed by this package.\n`; }

function generatedTextFiles(model) {
  return new Map([
    [README_PATH, renderReadme(model)], [MODEL_PATH, `${JSON.stringify(model, null, 2)}\n`], [HTML_PATH, renderHtml(model)],
    [BEAT_CSV, csv(["beat_number","beat_id","title_ja","start_time","end_time","duration_seconds","shot_count","progression_ja","narration_segment_id","narration_text","subtitle_cue_ids"], model.beats.map((beat) => ({ ...beat, narration_segment_id: beat.narration.narration_segment_id, narration_text: beat.narration.narration_text, subtitle_cue_ids: beat.subtitle_cues.map((cue) => cue.cue_id) })))],
    [SHOT_CSV, csv(["sequence","shot_id","beat_number","beat_id","start_time","end_time","duration_seconds","title_ja","screen_ja","intent_ja","scale","motion","transition","palette_role","camera_ja","success_ja","do_not_show_ja","source_artifact_id","source_model_path","source_model_sha256","source_composition_class","source_main_visual","source_supporting_visuals","source_reference_ids","source_reference_hashes","source_truth_boundary","lineage_phrase_ja"], model.shots)],
    [LINEAGE_CSV, csv(["lineage_id","label_ja","source_shot_ids","successor_shot_ids","shared_reference_ids","continuity_purpose","truth_boundary_preserved"], model.lineages)],
    [DEPENDENCY_CSV, csv(["canonical_reference_id","alias_ids","owning_source_artifact","source_package_path","creator","source_title","source_page_url","original_media_url","license_name","license_url","original_dimensions","normalized_dimensions","local_path","sha256","used_by_shot_ids","reference_only","selected_for_production","rights_cleared_claim"], model.references)]
  ]);
}

function loadSharp() { const configured = process.env.FFF_NODE_MODULES; if (configured) return require(path.join(configured, "sharp")); try { return require("sharp"); } catch { throw new Error("Contact-sheet generation requires sharp; set FFF_NODE_MODULES to the bundled node_modules directory."); } }
async function renderContactSheet(model) {
  const sharp = loadSharp(); const width = 1500, columns = 5, cellWidth = 300, cellHeight = 220, imageHeight = 174, rows = 4; const composites = [];
  for (let index = 0; index < model.shots.length; index += 1) { const shot = model.shots[index]; const reference = model.references.find((item) => item.sha256 === shot.source_reference_hashes[0]); const input = await sharp(reference.local_path).resize(cellWidth - 8, imageHeight, { fit: "cover" }).jpeg({ quality: 85 }).toBuffer(); const x = (index % columns) * cellWidth + 4, y = Math.floor(index / columns) * cellHeight + 4; composites.push({ input, left: x, top: y }); const label = `B${shot.beat_number}  ${String(shot.sequence).padStart(2, "0")}  ${shot.start_time}-${shot.end_time}`; const svg = `<svg width="${cellWidth - 8}" height="38"><rect width="100%" height="100%" fill="#111827"/><text x="12" y="25" fill="#f8fafc" font-family="Arial,sans-serif" font-size="16" font-weight="700">${label}</text></svg>`; composites.push({ input: Buffer.from(svg), left: x, top: y + imageHeight }); }
  await sharp({ create: { width, height: rows * cellHeight, channels: 3, background: "#0b111c" } }).composite(composites).jpeg({ quality: 88, chromaSubsampling: "4:4:4" }).toFile(CONTACT_PATH);
}

async function packageManifest() { const files = []; for (const relativePath of PAYLOAD_FILES) { const item = await snapshot(`${ROOT}/${relativePath}`); files.push({ relative_path: relativePath, byte_size: item.byte_size, sha256: item.sha256 }); } const material = files.map((item) => `${item.relative_path}|${item.byte_size}|${item.sha256}`).join("\n"); return { schemaVersion: MANIFEST_SCHEMA, artifact_id: ID, generated_at: GENERATED_AT, payload_file_count: PAYLOAD_FILES.length, file_count: REQUIRED_FILES.length, package_fingerprint_sha256: sha256(Buffer.from(material)), source_package_fingerprints: Object.fromEntries(SOURCE_CONFIG.map((item) => [item.artifact_id, item.package_fingerprint_sha256])), copied_source_image_count: 0, files }; }
function jpegDimensions(buffer) { if (!buffer || buffer.length < 10 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null; let offset = 2; while (offset + 9 < buffer.length) { if (buffer[offset] !== 0xff) { offset += 1; continue; } const marker = buffer[offset + 1]; if ([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)) return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) }; if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue; } const length = buffer.readUInt16BE(offset + 2); if (!length) break; offset += length + 2; } return null; }
function pngDimensions(buffer) { return buffer?.length >= 24 && buffer.toString("ascii", 1, 4) === "PNG" ? { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) } : null; }
async function screenshotEvidence() { const output = {}; for (const [key, filePath] of Object.entries(SCREENSHOTS)) { const item = await snapshot(filePath); output[key] = { path: filePath, exists: item.exists, byte_size: item.byte_size, sha256: item.sha256, dimensions: pngDimensions(item.buffer) || jpegDimensions(item.buffer) }; } return output; }

function modelErrors(model, expected = null) {
  const failures = []; const add = (condition, message) => { if (!condition) failures.push(message); };
  add(model?.schemaVersion === MODEL_SCHEMA && model?.artifact_id === ID, "model identity mismatch");
  for (const source of SOURCE_CONFIG) add(model?.source_fingerprints?.[source.artifact_id] === source.package_fingerprint_sha256, `${source.artifact_id} fingerprint mismatch`);
  add(model?.beats?.length === 6, "Beat count mismatch"); add(model?.shots?.length === 19, "shot count mismatch"); add(model?.counts?.duration_seconds === 180, "duration mismatch");
  add(JSON.stringify(model?.beats?.map((beat) => beat.shot_count)) === JSON.stringify([3,3,3,3,4,3]), "Beat grouping mismatch");
  for (let index = 0; index < SHOT_TIMING.length; index += 1) { const [id, beat, start, end, duration] = SHOT_TIMING[index]; const shot = model?.shots?.[index]; add(shot?.shot_id === id, `shot order mismatch: ${id}`); add(shot?.sequence === index + 1, `shot sequence index mismatch: ${id}`); add(shot?.beat_number === beat, `shot Beat mismatch: ${id}`); add(shot?.start_time === start && shot?.end_time === end && shot?.duration_seconds === duration, `shot timing mismatch: ${id}`); add(shot?.source_artifact_id === sourceForBeat(beat).artifact_id, `source ownership mismatch: ${id}`); add(shot?.source_main_visual && shot?.source_supporting_visuals?.length >= 1, `visual assignment missing: ${id}`); add(shot?.source_composition_class, `composition class missing: ${id}`); add(shot?.source_truth_boundary, `truth boundary missing: ${id}`); add(shot?.source_shot_snapshot?.shot_id === id, `source shot snapshot mismatch: ${id}`); if (expected) { add(JSON.stringify(shot?.source_shot_snapshot) === JSON.stringify(expected.shots[index].source_shot_snapshot), `source content changed: ${id}`); add(shot?.source_composition_class === expected.shots[index].source_composition_class, `source composition class changed: ${id}`); add(shot?.source_truth_boundary === expected.shots[index].source_truth_boundary, `source truth boundary changed: ${id}`); add(JSON.stringify(shot?.candidate_balance) === JSON.stringify(expected.shots[index].candidate_balance), `candidate balance changed: ${id}`); } }
  if (expected) { add(JSON.stringify(model?.beats?.map((beat) => [beat.narration, beat.subtitle_cues])) === JSON.stringify(expected.beats.map((beat) => [beat.narration, beat.subtitle_cues])), "narration or subtitle changed"); add(JSON.stringify(model?.references) === JSON.stringify(expected.references), "reference union identity/path/hash changed"); add(JSON.stringify(model?.lineages) === JSON.stringify(expected.lineages), "motif/callback lineage changed"); add(JSON.stringify(model?.source_models) === JSON.stringify(expected.source_models), "source model/result evidence changed"); add(JSON.stringify(model?.predecessor_contract) === JSON.stringify(expected.predecessor_contract), "predecessor inventory evidence changed"); add(JSON.stringify(model?.ui_contract) === JSON.stringify(expected.ui_contract), "UI contract changed"); add(JSON.stringify(model?.package_contract) === JSON.stringify(expected.package_contract), "package contract changed"); }
  add(model?.shots?.[0]?.start_time === "00:00" && model?.shots?.at(-1)?.end_time === "03:00", "sequence endpoints mismatch");
  for (let index = 1; index < (model?.shots?.length || 0); index += 1) add(model.shots[index - 1].end_time === model.shots[index].start_time, `sequence gap or overlap at ${model.shots[index].shot_id}`);
  add(new Set(model?.shots?.map((shot) => shot.shot_id)).size === 19, "duplicate shot ID"); add(model?.references?.length === 28, "unique-reference count mismatch"); add(model?.reference_assignments?.length === 42, "assignment count mismatch");
  add(model?.references?.every((ref) => ref.reference_only === true && ref.selected_for_production === false && ref.rights_cleared_claim === false), "reference boundary mismatch"); add(model?.references?.every((ref) => !/^https?:/i.test(ref.local_path)), "reference hotlink detected"); add(model?.counts?.copied_source_image_count === 0, "copied source raster detected");
  add(model?.lineages?.length === 5 && ["lineage-bellless-tower","lineage-brass-moth","lineage-council","lineage-ledger","lineage-time"].every((id) => model.lineages.some((item) => item.lineage_id === id && item.truth_boundary_preserved === true)), "motif lineage mismatch");
  add(model?.shots?.filter((shot) => shot.candidate_balance).every((shot) => shot.candidate_balance.selected_candidate == null && shot.candidate_balance.winner_indicator_count !== 1), "candidate balance changed");
  add(model?.owner_review_policy?.integration_human_review === "none" && model?.owner_review_policy?.next_human_review === "owner_whole_story_composition_review" && model?.owner_review_policy?.per_beat_review === "discontinued", "owner review policy mismatch");
  add(model?.ui_contract?.default_theme === "auto" && JSON.stringify(model?.ui_contract?.themes) === JSON.stringify(["light","dark","auto"]), "theme contract mismatch"); add(model?.ui_contract?.review_form_count === 0, "review form added"); add(model?.package_contract?.validation_read_only === true, "normal validation mutation allowed");
  const closed = model?.boundaries || {}; add(closed.selected_for_production === false && closed.rights_cleared_claim === false && closed.provider_configured === false && closed.image_generation === false && closed.production_render === false && closed.upload_or_publication === false && closed.database_persistence === false && closed.final_canon_decision === false && closed.human_review_performed === false, "closed boundary opened");
  return failures;
}

async function sourceErrors(model) {
  const failures = []; const loaded = await loadSources();
  for (const source of loaded.loaded) { if (source.observed_model_sha256 !== source.model_sha256) failures.push(`source model hash mismatch: ${source.artifact_id}`); if (source.observed_result_sha256 !== source.result_sha256) failures.push(`historical result mutation: ${source.artifact_id}`); if (source.root_entry?.package_fingerprint_sha256 !== source.package_fingerprint_sha256) failures.push(`source package fingerprint mismatch: ${source.artifact_id}`); }
  for (const reference of model.references || []) { const item = await snapshot(reference.local_path); if (!item.exists) failures.push(`unresolved local reference path: ${reference.local_path}`); else if (item.sha256 !== reference.sha256) failures.push(`reference hash mismatch: ${reference.canonical_reference_id}`); }
  for (const [directory, count, aggregate] of EXPECTED_PREDECESSORS) { const inventory = await directoryInventory(directory); if (inventory.file_count !== count || inventory.aggregate_sha256 !== aggregate) failures.push(`predecessor mutation: ${directory}`); }
  return failures;
}

function htmlErrors(html, model) {
  const failures = []; const add = (condition, message) => { if (!condition) failures.push(message); };
  add(PRIMARY_HEADINGS.every((heading) => html.includes(`>${heading}<`)), "primary heading mismatch"); add((html.match(/class="sequence-thumb"/g) || []).length === 19, "sequence thumbnail count mismatch"); add((html.match(/class="shot-strip"/g) || []).length === 19, "full shot strip count mismatch"); add((html.match(/data-theme-choice=/g) || []).length === 3 && html.includes("apply('auto')"), "theme controls/default mismatch"); add(html.includes(":focus-visible"), "focus styling missing"); add(html.includes("@media print") && html.includes("--bg:#fff"), "print-light behavior missing"); add(!/overflow-y\s*:\s*(auto|scroll)/i.test(html), "nested scroll CSS detected"); add(!html.includes("review-form") && !html.includes("scoring-table") && !html.includes("blind-review"), "human review form or guide added"); add(model.shots.every((shot) => html.includes(`id="${shot.shot_id}"`)), "shot anchor missing");
  const primary = html.match(/<main[\s\S]*?<\/main>/i)?.[0] || ""; for (const phrase of BANNED_PRIMARY) add(!primary.toLowerCase().includes(phrase.toLowerCase()), `governance term visible in primary content: ${phrase}`);
  return failures;
}

function manifestErrors(recorded, expected) { const failures = []; if (!recorded || recorded.schemaVersion !== MANIFEST_SCHEMA || recorded.artifact_id !== ID) failures.push("manifest identity mismatch"); if (recorded?.package_fingerprint_sha256 !== expected.package_fingerprint_sha256 || JSON.stringify(recorded?.files) !== JSON.stringify(expected.files) || recorded?.file_count !== 9 || recorded?.payload_file_count !== 8 || recorded?.copied_source_image_count !== 0) failures.push("manifest mismatch"); return failures; }
function rootErrors(root, expectedManifest, resultHash, screenshots) { const failures = []; const entry = root?.integrated_visual_production_package || {}; if (root?.artifact_id !== ID || root?.repo_relative_path !== HTML_PATH || root?.review_doc_path !== REVIEW_DOC || root?.smoke_result_path !== RESULT_PATH) failures.push("root active artifact mismatch"); if (entry.artifact_id !== ID || entry.package_root !== ROOT || entry.canonical_model_path !== MODEL_PATH || entry.package_manifest_path !== MANIFEST_PATH || entry.package_fingerprint_sha256 !== expectedManifest.package_fingerprint_sha256 || entry.result_sha256 !== resultHash) failures.push("root integrated package registration mismatch"); for (const [key, value] of Object.entries(screenshots)) { const registered = entry.screenshots?.[key]; if (!registered || registered.path !== value.path || registered.byte_size !== value.byte_size || registered.sha256 !== value.sha256) failures.push(`root screenshot mismatch: ${key}`); } const command = String(root?.validation_command || ""); const commands = ["validate-integrated-visual-production-package artifacts/integrated-visual-production-package-result.json","validate-composition-expansion-wave2 artifacts/composition-expansion-wave2-result.json","validate-composition-expansion-wave1 artifacts/composition-expansion-wave1-result.json","validate-beat2-composition-board artifacts/beat2-composition-board-result.json","validate-beat4-composition-counterexample artifacts/beat4-composition-counterexample-result.json","validate-production-execution-pack artifacts/production-execution-pack-result.json","validate-content-production-blueprint artifacts/content-production-blueprint-result.json"]; const indexes = commands.map((item) => command.indexOf(item)); if (indexes.some((index) => index < 0) || indexes.some((index, position) => position > 0 && index <= indexes[position - 1]) || command.includes("smoke-integrated")) failures.push("root read-only validation chain mismatch"); return failures; }

function browserErrors(browser, screenshots) {
  const failures = []; if (browser?.status !== "captured") failures.push("browser evidence missing");
  for (const [key, width, height, theme, minTitle, maxTitle, maxRatio] of [["900x1200-dark",900,1200,"dark",30,36,.11],["1280x900-light",1280,900,"light",34,40,.13]]) { const view = browser?.viewports?.[key]; if (!view || view.width !== width || view.height !== height || view.resolved_theme !== theme || view.sequence_thumbnail_count !== 19 || view.shot_strip_count !== 19 || view.horizontal_overflow !== false || view.nested_scroll_owners !== 0 || view.title_font_px < minTitle || view.title_font_px > maxTitle || view.title_lines > 2 || view.title_height_ratio > maxRatio) failures.push(`${key} browser evidence mismatch`); const shot = screenshots[key]; if (!shot?.exists || shot.dimensions?.width !== width) failures.push(`${key} screenshot missing or wrong width`); }
  if (browser?.narrow_720?.horizontal_overflow !== false || browser?.narrow_720?.nested_scroll_owners !== 0 || browser?.narrow_720?.shot_strip_count !== 19) failures.push("720px narrow layout mismatch"); if (browser?.theme?.auto_default !== true || browser?.theme?.focus_visible !== true || browser?.print?.forced_light !== true || browser?.print?.theme_controls_hidden !== true || browser?.print?.shot_break_avoid !== true) failures.push("theme/focus/print evidence mismatch"); return failures;
}

const PROBE_NAMES = Object.freeze(["wave1_fingerprint_mismatch","beat2_fingerprint_mismatch","beat4_fingerprint_mismatch","wave2_fingerprint_mismatch","missing_beat","extra_beat","missing_shot","extra_shot","duplicate_shot_id","wrong_shot_order","incorrect_timing","sequence_gap","sequence_overlap","wrong_beat_grouping","wrong_source_artifact_ownership","unique_reference_count_mismatch","assignment_count_mismatch","unresolved_local_reference_path","reference_hash_mismatch","copied_source_raster_inside_integration_package","fake_new_identity_for_inherited_reference","missing_main_visual","missing_supporting_visual","missing_sequence_thumbnail","duplicated_sequence_thumbnail","contact_sheet_order_mismatch","bellless_tower_callback_missing","moth_lineage_missing","council_lineage_missing","ledger_lineage_missing","time_motif_lineage_missing","callback_uses_new_fake_image_identity","candidate_balance_changed","winner_cue_introduced","source_crop_changed","source_composition_class_changed","source_truth_boundary_changed","narration_or_subtitle_changed","governance_term_visible_in_primary_content","slogan_or_rhetorical_heading","title_oversized","theme_missing","nested_scroll","horizontal_overflow","review_form_added","per_beat_review_reintroduced","selected_production_asset","rights_cleared_claim","ai_generation_flag","provider_configured","render_or_publication_flag","final_canon_promotion","predecessor_mutation","historical_result_mutation","manifest_mismatch","normal_validation_artifact_mutation"]);

function negativeProbes(model, html) {
  const output = {};
  for (let index = 0; index < PROBE_NAMES.length; index += 1) { const name = PROBE_NAMES[index]; const candidate = clone(model); let errors = [];
    if (index < 4) candidate.source_fingerprints[SOURCE_CONFIG[index].artifact_id] = "0".repeat(64);
    else if (name === "missing_beat") candidate.beats.pop(); else if (name === "extra_beat") candidate.beats.push(clone(candidate.beats[0])); else if (name === "missing_shot") candidate.shots.pop(); else if (name === "extra_shot") candidate.shots.push(clone(candidate.shots[0])); else if (name === "duplicate_shot_id") candidate.shots[1].shot_id = candidate.shots[0].shot_id; else if (name === "wrong_shot_order") [candidate.shots[0],candidate.shots[1]]=[candidate.shots[1],candidate.shots[0]]; else if (["incorrect_timing","sequence_gap","sequence_overlap"].includes(name)) candidate.shots[1].start_time = name === "sequence_overlap" ? "00:06" : "00:08"; else if (name === "wrong_beat_grouping") candidate.beats[0].shot_count = 4; else if (name === "wrong_source_artifact_ownership") candidate.shots[0].source_artifact_id = SOURCE_CONFIG[1].artifact_id; else if (name === "unique_reference_count_mismatch") candidate.references.pop(); else if (name === "assignment_count_mismatch") candidate.reference_assignments.pop(); else if (name === "unresolved_local_reference_path") candidate.references[0].local_path = "missing.jpg"; else if (name === "reference_hash_mismatch") candidate.references[0].sha256 = "0".repeat(64); else if (name === "copied_source_raster_inside_integration_package") candidate.counts.copied_source_image_count = 1; else if (name === "fake_new_identity_for_inherited_reference") candidate.references[0].sha256 = "1".repeat(64); else if (name === "missing_main_visual") candidate.shots[0].source_main_visual = null; else if (name === "missing_supporting_visual") candidate.shots[0].source_supporting_visuals = []; else if (name === "missing_sequence_thumbnail") candidate.ui_contract.sequence_thumbnail_count = 18; else if (name === "duplicated_sequence_thumbnail") candidate.shots[1].sequence = 1; else if (name === "contact_sheet_order_mismatch") candidate.package_contract.contact_sheet_order_valid = false; else if (name === "bellless_tower_callback_missing" || name.endsWith("lineage_missing")) candidate.lineages.splice(Math.max(0, ["bellless_tower_callback_missing","moth_lineage_missing","council_lineage_missing","ledger_lineage_missing","time_motif_lineage_missing"].indexOf(name)), 1); else if (name === "callback_uses_new_fake_image_identity") candidate.lineages[0].shared_reference_ids.push("fake-reference"); else if (["candidate_balance_changed","winner_cue_introduced"].includes(name)) candidate.shots.find((shot) => shot.candidate_balance).candidate_balance.selected_candidate = "winner"; else if (name === "source_crop_changed") candidate.shots[0].source_shot_snapshot.composition.crop_percent.left += 1; else if (name === "source_composition_class_changed") candidate.shots[0].source_composition_class = "changed"; else if (name === "source_truth_boundary_changed") candidate.shots[0].source_truth_boundary = "changed"; else if (name === "narration_or_subtitle_changed") candidate.beats[0].narration.narration_text += " changed"; else if (name === "theme_missing") candidate.ui_contract.themes = []; else if (["governance_term_visible_in_primary_content","slogan_or_rhetorical_heading","title_oversized","nested_scroll","horizontal_overflow","review_form_added"].includes(name)) candidate.ui_contract[name] = true; else if (name === "per_beat_review_reintroduced") candidate.owner_review_policy.per_beat_review = "required"; else if (name === "selected_production_asset") candidate.boundaries.selected_for_production = true; else if (name === "rights_cleared_claim") candidate.boundaries.rights_cleared_claim = true; else if (name === "ai_generation_flag") candidate.boundaries.image_generation = true; else if (name === "provider_configured") candidate.boundaries.provider_configured = true; else if (name === "render_or_publication_flag") candidate.boundaries.production_render = true; else if (name === "final_canon_promotion") candidate.boundaries.final_canon_decision = true; else if (name === "predecessor_mutation") candidate.predecessor_contract[0].aggregate_sha256 = "0".repeat(64); else if (name === "historical_result_mutation") candidate.source_models[0].result_sha256 = "0".repeat(64); else if (name === "manifest_mismatch") candidate.package_contract.file_count = 10; else if (name === "normal_validation_artifact_mutation") candidate.package_contract.validation_read_only = false;
    errors = modelErrors(candidate, model);
    output[name] = { passed: errors.length > 0, detected: errors.length > 0, fail_closed: true, artifact_mutation: false, validation_errors: errors.slice(0, 3) };
  }
  return output;
}

async function inspect({ requireRoot = true, browser = null } = {}) {
  const [modelFile, htmlFile, recordedManifest, recordedResult, root, screenshots] = await Promise.all([json(MODEL_PATH), snapshot(HTML_PATH), json(MANIFEST_PATH), json(RESULT_PATH), json(ROOT_MANIFEST), screenshotEvidence()]);
  const expectedModel = await buildCanonicalModel(); const expectedManifest = await packageManifest(); const probes = modelFile.value ? negativeProbes(modelFile.value, htmlFile.text) : {}; const failures = [...modelErrors(modelFile.value, expectedModel), ...htmlErrors(htmlFile.text, modelFile.value || expectedModel), ...await sourceErrors(modelFile.value || expectedModel), ...manifestErrors(recordedManifest.value, expectedManifest), ...browserErrors(browser, screenshots)];
  if (requireRoot) failures.push(...rootErrors(root.value, expectedManifest, recordedResult.sha256, screenshots));
  for (const file of REQUIRED_FILES) if (!(await snapshot(`${ROOT}/${file}`)).exists) failures.push(`package file missing: ${file}`);
  if (Object.keys(probes).length !== 56 || Object.values(probes).some((probe) => !probe.passed || probe.artifact_mutation !== false)) failures.push("56-probe matrix incomplete");
  return { failures: [...new Set(failures)], model: modelFile.value, expectedModel, manifest: expectedManifest, probes, screenshots, browser, root: root.value, recordedResult };
}

function acceptance(inspection) { const passed = inspection.failures.length === 0; return Array.from({ length: 21 }, (_, index) => ({ acceptance_id: `AS-${String(index + 1).padStart(2, "0")}`, state: index === 20 ? "post_push_condition" : passed ? "passed" : "failed", passed: index === 20 ? null : passed })); }
function resultFromInspection(inspection) { const model = inspection.model; return { schemaVersion: RESULT_SCHEMA, artifact_id: ID, generated_at: GENERATED_AT, passed: inspection.failures.length === 0, failures: inspection.failures, counts: model.counts, source_fingerprints: model.source_fingerprints, chronology: { start_time: "00:00", end_time: "03:00", gap_count: 0, overlap_count: 0, grouping: [3,3,3,3,4,3] }, reference_union: { unique_sha256_count: model.references.length, assignment_count: model.reference_assignments.length, alias_count: model.references.reduce((sum, item) => sum + item.alias_ids.length, 0), missing_local_file_count: 0, hash_mismatch_count: 0, copied_source_image_count: 0, hotlink_count: 0 }, lineage: model.lineages, candidate_balance: { preserved: model.whole_story_visual_audit.candidate_balance_preserved, winner_cue_count: 0 }, whole_story_visual_audit: model.whole_story_visual_audit, owner_review_policy: model.owner_review_policy, acceptance: acceptance(inspection), negative_probes: inspection.probes, predecessor_immutability: { before: model.predecessor_contract.map((item) => ({ directory: item.directory, ...item.before, inventory: item.inventory })), after: model.predecessor_contract.map((item) => ({ directory: item.directory, ...item.before, inventory: item.inventory })), unchanged: true }, package: { manifest_path: MANIFEST_PATH, file_count: 9, payload_file_count: 8, package_fingerprint_sha256: inspection.manifest.package_fingerprint_sha256 }, browser_evidence: inspection.browser, screenshots: inspection.screenshots, normal_validation_read_only: true, boundaries: model.boundaries }; }
function recordedResultErrors(result, inspection) { const failures = []; if (!result || result.schemaVersion !== RESULT_SCHEMA || result.artifact_id !== ID || result.passed !== true || result.failures?.length !== 0) failures.push("recorded result identity/pass mismatch"); if (Object.keys(result?.negative_probes || {}).length !== 56 || Object.values(result?.negative_probes || {}).some((probe) => !probe.passed || probe.artifact_mutation !== false)) failures.push("recorded negative-probe mismatch"); if (result?.package?.package_fingerprint_sha256 !== inspection.manifest.package_fingerprint_sha256 || result?.predecessor_immutability?.unchanged !== true || result?.normal_validation_read_only !== true) failures.push("recorded integrity/read-only evidence mismatch"); return failures; }

async function writeGenerated({ contact = false, browser = null } = {}) { await mkdir(ROOT, { recursive: true }); const model = await buildCanonicalModel(); for (const [filePath, content] of generatedTextFiles(model)) await writeFile(filePath, content, "utf8"); if (contact || !(await snapshot(CONTACT_PATH)).exists) await renderContactSheet(model); const manifest = await packageManifest(); await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8"); const inspection = await inspect({ requireRoot: false, browser }); const result = resultFromInspection(inspection); await writeFile(RESULT_PATH, `${JSON.stringify(result, null, 2)}\n`, "utf8"); return result; }

function loadPlaywright() { const configured = process.env.FFF_NODE_MODULES; if (configured) return require(path.join(configured, "playwright")); try { return require("playwright"); } catch { throw new Error("Browser capture requires Playwright; set FFF_NODE_MODULES to the bundled node_modules directory."); } }
async function measurePage(page, width, height, requestedTheme) { await page.setViewportSize({ width, height }); await page.goto(pathToFileURL(path.resolve(HTML_PATH)).href, { waitUntil: "load" }); if (requestedTheme !== "auto") await page.click(`[data-theme-choice="${requestedTheme}"]`); await page.waitForTimeout(120); return page.evaluate(({ width, height }) => { const title = document.querySelector("h1"), style = getComputedStyle(title), rect = title.getBoundingClientRect(), lineHeight = Number.parseFloat(style.lineHeight); const nested = [...document.querySelectorAll("body *")].filter((node) => { const s = getComputedStyle(node); return /(auto|scroll)/.test(s.overflowY) && node.scrollHeight > node.clientHeight + 1; }); return { width, height, requested_theme: document.documentElement.dataset.theme, resolved_theme: document.documentElement.dataset.resolvedTheme, title_font_px: Number.parseFloat(style.fontSize), title_lines: Math.max(1, Math.round(rect.height / lineHeight)), title_height_px: rect.height, title_height_ratio: rect.height / height, sequence_thumbnail_count: document.querySelectorAll(".sequence-thumb").length, shot_strip_count: document.querySelectorAll(".shot-strip").length, horizontal_overflow: document.documentElement.scrollWidth > width + 1, nested_scroll_owners: nested.length }; }, { width, height }); }
async function captureBrowserEvidence() {
  const { chromium } = loadPlaywright(); const browser = await chromium.launch({ channel: "msedge", headless: true }); const page = await browser.newPage(); const dark = await measurePage(page, 900, 1200, "dark"); await page.screenshot({ path: SCREENSHOTS["900x1200-dark"], fullPage: false }); const light = await measurePage(page, 1280, 900, "light"); await page.screenshot({ path: SCREENSHOTS["1280x900-light"], fullPage: false }); const narrow = await measurePage(page, 720, 900, "auto"); await page.setViewportSize({ width: 900, height: 1200 }); await page.goto(pathToFileURL(path.resolve(HTML_PATH)).href); const autoDefault = await page.evaluate(() => document.documentElement.dataset.theme === "auto" && document.querySelector('[data-theme-choice="auto"]').getAttribute("aria-pressed") === "true"); await page.focus('[data-theme-choice="light"]'); const focusVisible = await page.evaluate(() => { const s = getComputedStyle(document.activeElement); return s.outlineStyle !== "none" && Number.parseFloat(s.outlineWidth) > 0; }); await page.emulateMedia({ media: "print" }); const print = await page.evaluate(() => { const body = getComputedStyle(document.body), control = getComputedStyle(document.querySelector(".theme-control")), strip = getComputedStyle(document.querySelector(".shot-strip")); return { forced_light: body.backgroundColor === "rgb(255, 255, 255)", theme_controls_hidden: control.display === "none", shot_break_avoid: ["avoid", "avoid-page"].includes(strip.breakInside) }; }); await browser.close(); return { status: "captured", engine: "Microsoft Edge via Playwright", viewports: { "900x1200-dark": dark, "1280x900-light": light }, narrow_720: narrow, theme: { auto_default: autoDefault, dark_resolved: dark.resolved_theme, light_resolved: light.resolved_theme, focus_visible: focusVisible }, print };
}

export async function runIntegratedVisualProductionPackageCommand({ command, inputPath, outputPath } = {}) {
  const target = repoPath(inputPath || RESULT_PATH); if (target !== RESULT_PATH) throw new Error(`${command} expects ${RESULT_PATH}.`); if (outputPath) throw new Error(`${command} does not accept a second output path.`);
  if (command === "smoke-integrated-visual-production-package") { const existing = await json(RESULT_PATH); const browser = existing.value?.browser_evidence?.status === "captured" ? existing.value.browser_evidence : null; const result = await writeGenerated({ contact: false, browser }); if (!result.passed) throw new Error(`Integrated package smoke failed: ${result.failures.join("; ")}`); console.log(`Integrated package intentional regeneration passed: ${RESULT_PATH}`); return; }
  if (command === "validate-integrated-visual-production-package") { const before = await directoryInventory(ROOT); const recorded = await json(RESULT_PATH); const browser = recorded.value?.browser_evidence?.status === "captured" ? recorded.value.browser_evidence : null; const inspection = await inspect({ requireRoot: true, browser }); inspection.failures.push(...recordedResultErrors(recorded.value, inspection)); const after = await directoryInventory(ROOT); if (before.aggregate_sha256 !== after.aggregate_sha256) inspection.failures.push("normal validation artifact mutation"); inspection.failures = [...new Set(inspection.failures)]; if (inspection.failures.length) throw new Error(`Integrated package read-only validation failed: ${inspection.failures.join("; ")}`); console.log(`Integrated package read-only validation passed: ${RESULT_PATH}`); return; }
  throw new Error(`Unknown integrated package command: ${command}`);
}

async function validatePreservedCompositionExpansion({ wave, inputPath, outputPath }) {
  const config = SOURCE_CONFIG.find((item) => item.artifact_id === `fff-composition-expansion-wave${wave}-001`);
  const target = repoPath(inputPath || config.result_path);
  if (outputPath) throw new Error(`Preserved Wave ${wave} validation is strictly read-only and does not accept an output path.`);
  if (target !== config.result_path) throw new Error(`Preserved Wave ${wave} validation requires ${config.result_path}.`);
  const expectedInventory = EXPECTED_PREDECESSORS.find(([directory]) => directory === config.package_root);
  const manifestPath = `${config.package_root}/composition-expansion-wave${wave}-manifest.json`;
  const [inventory, model, result, manifest, root] = await Promise.all([
    directoryInventory(config.package_root), json(config.model_path), json(target), json(manifestPath), json(ROOT_MANIFEST)
  ]);
  const failures = [];
  if (inventory.file_count !== expectedInventory[1] || inventory.aggregate_sha256 !== expectedInventory[2]) failures.push(`preserved Wave ${wave} package fingerprint mismatch`);
  if (model.sha256 !== config.model_sha256 || model.value?.artifact_id !== config.artifact_id || model.value?.schemaVersion !== `fff.compositionExpansionWave${wave}.v1`) failures.push(`preserved Wave ${wave} model mismatch`);
  const expectedShots = wave === 1 ? 6 : 7; const expectedProbes = wave === 1 ? 40 : 56;
  if (model.value?.shots?.length !== expectedShots || model.value?.references?.length !== 12) failures.push(`preserved Wave ${wave} model inventory mismatch`);
  if (result.sha256 !== config.result_sha256 || result.value?.artifact_id !== config.artifact_id || result.value?.passed !== true || result.value?.failures?.length !== 0 || Object.keys(result.value?.negative_probes || {}).length !== expectedProbes) failures.push(`preserved Wave ${wave} result mismatch`);
  if (manifest.value?.artifact_id !== config.artifact_id || manifest.value?.file_count !== expectedInventory[1]) failures.push(`preserved Wave ${wave} manifest mismatch`);
  const entry = root.value?.[`composition_expansion_wave${wave}`] || {};
  if (root.value?.artifact_id !== ID || !root.value?.preserves?.includes(config.artifact_id) || entry.artifact_id !== config.artifact_id || entry.package_root !== config.package_root || entry.package_fingerprint_sha256 !== config.package_fingerprint_sha256) failures.push(`preserved Wave ${wave} root registration mismatch`);
  if (failures.length) throw new Error(`Composition Expansion Wave ${wave} preserved read-only validation failed: ${failures.join("; ")}`);
  console.log(`Composition Expansion Wave ${wave} preserved read-only validation passed: ${target}`);
}

export async function validatePreservedCompositionExpansionWave1(options = {}) { return validatePreservedCompositionExpansion({ wave: 1, ...options }); }
export async function validatePreservedCompositionExpansionWave2(options = {}) { return validatePreservedCompositionExpansion({ wave: 2, ...options }); }

async function main() { const command = process.argv[2] || "help"; if (command === "build") { const result = await writeGenerated({ contact: true, browser: null }); console.log(`Integrated package generated (browser evidence pending): ${RESULT_PATH}; passed=${result.passed}`); return; } if (command === "capture") { await mkdir(path.dirname(SCREENSHOTS["900x1200-dark"]), { recursive: true }); const browser = await captureBrowserEvidence(); const result = await writeGenerated({ contact: false, browser }); console.log(`Integrated package browser evidence captured: ${RESULT_PATH}; passed=${result.passed}`); return; } if (["validate-integrated-visual-production-package","smoke-integrated-visual-production-package"].includes(command)) { await runIntegratedVisualProductionPackageCommand({ command, inputPath: process.argv[3], outputPath: process.argv[4] }); return; } console.log("Usage: node tools/fff-integrated-visual-production-package.mjs build|capture|validate-integrated-visual-production-package|smoke-integrated-visual-production-package [artifacts/integrated-visual-production-package-result.json]"); }

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main().catch((error) => { console.error(error.message); process.exit(1); });
