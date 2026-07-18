#!/usr/bin/env node

import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ID = "fff-beat4-composition-counterexample-001";
const MODEL_SCHEMA = "fff.beat4CompositionCounterexample.v1";
const RESULT_SCHEMA = "fff.beat4CompositionCounterexampleResult.v1";
const MANIFEST_SCHEMA = "fff.beat4CompositionCounterexampleManifest.v1";
const GENERATED_AT = "2026-07-19T18:00:00+09:00";
const ROOT = "artifacts/beat4-composition-counterexample";
const MODEL_PATH = `${ROOT}/beat4-composition-counterexample.json`;
const HTML_PATH = `${ROOT}/beat4-composition-counterexample.html`;
const MANIFEST_PATH = `${ROOT}/manifest.json`;
const H1_PATH = `${ROOT}/H1_TRANSFER_REVIEW.md`;
const RESULT_PATH = "artifacts/beat4-composition-counterexample-result.json";
const REVIEW_DOC = "docs/review/beat4-composition-counterexample.md";
const SCREENSHOTS = Object.freeze({
  "900x1200-dark": "artifacts/review-screens/beat4-composition-counterexample-900x1200-dark.png",
  "1280x900-light": "artifacts/review-screens/beat4-composition-counterexample-1280x900-light.png"
});
const PAYLOAD_FILES = Object.freeze([
  "README.md",
  "beat4-composition-counterexample.html",
  "beat4-composition-counterexample.json",
  "reference-sources.csv",
  "shot-composition-map.csv",
  "H1_TRANSFER_REVIEW.md",
  "beat4-composition-counterexample-contact-sheet.jpg",
  "composition-assets/ref-b04-s01-conference-backs.jpg",
  "composition-assets/ref-b04-s01-frosted-partition.jpg",
  "composition-assets/ref-b04-s02-card-catalogue.jpg",
  "composition-assets/ref-b04-s02-time-recorder.jpg",
  "composition-assets/ref-b04-shared-general-ledger.jpg",
  "composition-assets/ref-b04-s03-closed-meeting-room.jpg"
]);
const REQUIRED_FILES = Object.freeze([...PAYLOAD_FILES, "manifest.json"]);
const SOURCE_FILES = Object.freeze({
  "artifacts/beat2-visual-treatment-pilot": [
    "README_VISUAL_TREATMENT.md", "beat2-visual-treatment-contact-sheet.jpg", "beat2-visual-treatment-manifest.json",
    "beat2-visual-treatment.html", "beat2-visual-treatment.json", "reference-sources.csv",
    "references/ref-b02-s01-precision-handwork.jpg", "references/ref-b02-s01-watch-repair-workbench.jpg",
    "references/ref-b02-s02-aged-handwritten-letter.jpg", "references/ref-b02-s02-metal-butterfly-brooch.jpg",
    "references/ref-b02-s03-brass-clock-dial.jpg", "references/ref-b02-s03-vintage-watch-0915.jpg", "shot-reference-map.csv"
  ],
  "artifacts/production-storyboard-brief": [
    "README_STORYBOARD_BRIEF.md", "production-storyboard-brief.html", "production-storyboard-brief.json",
    "storyboard-shot-map.csv", "story-glossary.csv", "asset-operations-summary.csv", "production-storyboard-brief-manifest.json"
  ],
  "artifacts/production-execution-pack": [
    "README_PRODUCTION_EXECUTION.md", "production-execution-pack.html", "production-execution-pack.json",
    "beat-run-sheet.csv", "shot-execution-sheet.csv", "asset-requirements.csv", "narration-timing-envelope.csv",
    "thumbnail-requirements.md", "production-execution-manifest.json"
  ]
});
const EXPECTED_SOURCES = Object.freeze({
  beat2_composition_board_package_fingerprint_sha256: "4c44089a140626d56fd67f8341a4765e60f310ff65555c8ff8a0eef3eff7f3b0",
  visual_treatment_package_fingerprint_sha256: "8867f6265099f4dffbfc090d7a988c195644949acbca0c104a0f7c6911205c63",
  visual_treatment_thirteen_file_aggregate_sha256: "bea1514a2a497ac38f475b640e00c0ed1bb2657f62ac4d81c806d362e50d532b",
  storyboard_seven_file_aggregate_sha256: "bb9d4fce3ed5ac328b49f0ac691e0ab9b6ca671d0318ef4e60522dca7a6fabb8",
  execution_nine_file_aggregate_sha256: "10d3675723c3282cba0fdd516654640a7c16749fef80279b7223b4e5dc436345"
});
const REFERENCE_HASHES = Object.freeze({
  "ref-b04-s01-conference-backs": "79e17d1982c6d217063d34d1479606f8a586c6e4b8b001167e3647ce2d4b1962",
  "ref-b04-s01-frosted-partition": "f55ecaa635f09cd4b203fc97775ef049f42bb3a0004a24ab1c2385438685fffb",
  "ref-b04-s02-card-catalogue": "23aaf60edcd0880b63e5c98eed29a2ea46fddf0c5e3e8ab17c3e948cfcae5822",
  "ref-b04-s02-time-recorder": "ea2732ff8205541eed60050129020ba94c6202d868d77eca90972d6792411127",
  "ref-b04-shared-general-ledger": "74d83e8fbad303bf4a08c86e72c02746c678a95e56c0f69814c6c853dd7feaab",
  "ref-b04-s03-closed-meeting-room": "e6f06540dba924ccd3c5aaa38fa3f676f489335762b61dd7ecbcca69da196ca9"
});
const SHOT_CONTRACT = Object.freeze([
  { id: "shot-b04-01", start: "01:20", end: "01:28", duration: 8, scale: "wide", motion: "slow_push", transition: "hard_cut", compositionClass: "anonymous_institutional_depth" },
  { id: "shot-b04-02", start: "01:28", end: "01:36", duration: 8, scale: "graphic_fullframe", motion: "locked", transition: "graphic_match", compositionClass: "equal_weight_abstract_comparison" },
  { id: "shot-b04-03", start: "01:36", end: "01:45", duration: 9, scale: "medium", motion: "slow_pull", transition: "held_fade", compositionClass: "environment_plus_document_tension" }
]);
const ALLOWED_LICENSES = Object.freeze([
  "CC BY-SA 3.0", "CC BY-SA 2.0", "No known copyright or other restrictions; free to use and reuse", "No known copyright restrictions"
]);
const NEGATIVE_PROBES = Object.freeze([
  "source fingerprint mismatch", "missing shot", "fourth shot added", "incorrect timing", "fewer than two references for a shot",
  "missing creator", "missing source page", "missing original media URL", "missing license", "missing license URL", "ambiguous license",
  "hotlink", "duplicate image counted twice", "near-duplicate crop counted as distinct", "low-resolution source",
  "generic symbolic board used as primary", "Shot 1 identifiable official", "Shot 1 villain coding",
  "Shot 2 60/40 or stronger imbalance", "Shot 2 winner icon", "Shot 2 privileged color or contrast", "Shot 3 motive resolved",
  "missing depth layer", "missing eye path", "missing continuity note", "H1 review pre-filled", "selected asset",
  "rights-cleared claim", "predecessor mutation", "manifest hash mismatch"
]);

function fail(message) { throw new Error(message); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function hash(buffer) { return createHash("sha256").update(buffer).digest("hex"); }
function repoPath(value) { return String(value || "").replaceAll("\\", "/").replace(/^\.\//, ""); }

async function fileSnapshot(filePath) {
  try {
    const buffer = await readFile(filePath);
    return { exists: true, buffer, text: buffer.toString("utf8"), byteSize: buffer.length, sha256: hash(buffer) };
  } catch (error) {
    return { exists: false, buffer: null, text: "", byteSize: 0, sha256: null, error: error.message };
  }
}

async function jsonSnapshot(filePath) {
  const snapshot = await fileSnapshot(filePath);
  if (!snapshot.exists) return { ...snapshot, value: null };
  try { return { ...snapshot, value: JSON.parse(snapshot.text) }; }
  catch (error) { return { ...snapshot, value: null, error: `invalid JSON: ${error.message}` }; }
}

function jpegDimensions(buffer) {
  if (!buffer || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) { offset += 1; continue; }
    const marker = buffer[offset + 1];
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    }
    if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue; }
    const length = buffer.readUInt16BE(offset + 2);
    if (!length) break;
    offset += length + 2;
  }
  return null;
}

function pngDimensions(buffer) {
  if (!buffer || buffer.length < 24 || buffer.toString("ascii", 1, 4) !== "PNG") return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

async function aggregate(root, files) {
  const rows = [];
  for (const name of files) {
    const snapshot = await fileSnapshot(path.join(root, name));
    rows.push(`${root}/${name}|${snapshot.byteSize}|${snapshot.sha256}`);
  }
  return hash(Buffer.from(rows.sort().join("\n"), "utf8"));
}

async function sourceSnapshot() {
  const [beat2, pilot] = await Promise.all([
    jsonSnapshot("artifacts/beat2-composition-board/beat2-composition-board-manifest.json"),
    jsonSnapshot("artifacts/beat2-visual-treatment-pilot/beat2-visual-treatment-manifest.json")
  ]);
  return {
    beat2_composition_board_package_fingerprint_sha256: beat2.value?.package_fingerprint_sha256 || null,
    visual_treatment_package_fingerprint_sha256: pilot.value?.package_fingerprint_sha256 || null,
    visual_treatment_thirteen_file_aggregate_sha256: await aggregate("artifacts/beat2-visual-treatment-pilot", SOURCE_FILES["artifacts/beat2-visual-treatment-pilot"]),
    storyboard_seven_file_aggregate_sha256: await aggregate("artifacts/production-storyboard-brief", SOURCE_FILES["artifacts/production-storyboard-brief"]),
    execution_nine_file_aggregate_sha256: await aggregate("artifacts/production-execution-pack", SOURCE_FILES["artifacts/production-execution-pack"])
  };
}

function sourceErrors(observed) {
  return Object.entries(EXPECTED_SOURCES).filter(([key, value]) => observed?.[key] !== value).map(([key]) => `protected source fingerprint mismatch: ${key}`);
}

function modelErrors(model) {
  const failures = [];
  const add = (condition, message) => { if (!condition) failures.push(message); };
  add(model?.schemaVersion === MODEL_SCHEMA && model?.artifact_id === ID && model?.title_ja === "評議会の影", "model identity mismatch");
  add(model?.status === "h0_reference_only_counterexample", "model H0 status mismatch");
  add(Array.isArray(model?.shots) && model.shots.length === 3, "exactly three shots required");
  const shots = model?.shots || [];
  SHOT_CONTRACT.forEach((expected, index) => {
    const shot = shots[index] || {};
    add(shot.shot_id === expected.id, `${expected.id} identity/order mismatch`);
    add(shot.start_time === expected.start && shot.end_time === expected.end && shot.duration_seconds === expected.duration, `${expected.id} timing mismatch`);
    add(shot.scale === expected.scale && shot.motion === expected.motion && shot.transition === expected.transition, `${expected.id} execution row mismatch`);
    add(shot.composition?.composition_class === expected.compositionClass, `${expected.id} composition class mismatch`);
    add(Boolean(shot.main_image_id) && Array.isArray(shot.supporting_image_ids) && new Set([shot.main_image_id, ...shot.supporting_image_ids]).size >= 2, `${expected.id} requires one main and at least one distinct supporting reference`);
    const composition = shot.composition || {};
    add(["left", "top", "width", "height"].every((key) => Number.isFinite(composition.crop_percent?.[key])), `${expected.id} crop missing`);
    add(Boolean(composition.placement_ja), `${expected.id} placement missing`);
    add(Array.isArray(composition.focal_points) && composition.focal_points.length === 2 && composition.focal_points.map((item) => item.order).join("|") === "1|2", `${expected.id} focal order mismatch`);
    add(Boolean(composition.eye_path_ja), `${expected.id} eye path missing`);
    add(Boolean(composition.layers_ja?.foreground && composition.layers_ja?.midground && composition.layers_ja?.background), `${expected.id} depth layer missing`);
    add(Boolean(composition.borrowed_portions_ja?.main && composition.borrowed_portions_ja?.supporting), `${expected.id} borrowed-reference portion missing`);
    add(Boolean(composition.motion_direction_class && composition.continuity_ja && composition.positive_condition_ja && composition.truth_safe_guard_ja), `${expected.id} motion/continuity/condition/guard missing`);
  });
  add(shots.reduce((sum, shot) => sum + Number(shot.duration_seconds || 0), 0) === 25, "Beat 4 duration must be 25 seconds");
  add(new Set(shots.map((shot) => shot.composition?.composition_class)).size === 3, "three distinct composition classes required");
  const references = model?.references || [];
  add(references.length >= 6 && references.length <= 9, "6 to 9 references required");
  add(new Set(references.map((item) => item.reference_id)).size === references.length, "duplicate reference ID");
  add(new Set(references.map((item) => item.sha256)).size === references.length, "duplicate image counted twice");
  add(new Set(references.map((item) => item.source_page_url)).size === references.length, "duplicate source page counted twice");
  add(new Set(references.map((item) => item.original_media_url)).size === references.length, "near-duplicate crop counted as distinct");
  const referenceMap = new Map(references.map((item) => [item.reference_id, item]));
  for (const reference of references) {
    const required = ["reference_id", "source_title", "creator", "source_page_url", "original_media_url", "acquisition_media_url", "license_name", "license_url", "retrieved_at", "local_path", "sha256"];
    add(required.every((field) => Boolean(reference?.[field])), `${reference?.reference_id || "reference"} provenance incomplete`);
    add(ALLOWED_LICENSES.includes(reference?.license_name), `${reference?.reference_id || "reference"} ambiguous or disallowed license`);
    add(/^https:\/\//.test(reference?.source_page_url || "") && /^https:\/\//.test(reference?.original_media_url || "") && /^https:\/\//.test(reference?.license_url || ""), `${reference?.reference_id || "reference"} provenance URL mismatch`);
    add(String(reference?.local_path || "").startsWith("composition-assets/") && !/^https?:/i.test(reference?.local_path || ""), `${reference?.reference_id || "reference"} local path mismatch`);
    add(["original_width", "original_height", "acquired_width", "acquired_height", "local_width", "local_height"].every((field) => Number.isInteger(reference?.[field]) && reference[field] > 0), `${reference?.reference_id || "reference"} dimensions missing`);
    add(Math.max(reference?.original_width || 0, reference?.original_height || 0) >= 1280 && Math.max(reference?.local_width || 0, reference?.local_height || 0) >= 900, `${reference?.reference_id || "reference"} low-resolution source`);
    add(reference?.reference_only === true && reference?.selected_for_production === false && reference?.rights_cleared_claim === false, `${reference?.reference_id || "reference"} selection/rights boundary mismatch`);
    add(REFERENCE_HASHES[reference?.reference_id] === reference?.sha256, `${reference?.reference_id || "reference"} known local hash mismatch`);
  }
  for (const shot of shots) {
    for (const id of [shot.main_image_id, ...(shot.supporting_image_ids || [])]) {
      const reference = referenceMap.get(id);
      add(Boolean(reference?.used_by_shot_ids?.includes(shot.shot_id) && reference?.roles_by_shot?.[shot.shot_id]), `${id || "reference"} shot usage metadata mismatch`);
    }
  }
  const anonymity = shots[0]?.composition?.institutional_anonymity || {};
  add(anonymity.translucent_partition === true && anonymity.silhouette_count_min >= 2 && anonymity.identifiable_face === false && anonymity.identifiable_official === false && anonymity.guilt_cue === false && anonymity.villain_coding === false, "Shot 1 anonymity/misattribution guard mismatch");
  const balance = shots[1]?.composition?.hypothesis_balance || {};
  add(balance.left_label_ja === "時間販売の告発？" && balance.right_label_ja === "偽の記録？", "Shot 2 labels mismatch");
  add(balance.left_area_share_percent === 50 && balance.right_area_share_percent === 50 && Math.max(balance.left_area_share_percent, balance.right_area_share_percent) < 60, "Shot 2 equal area mismatch");
  add(balance.left_headline_px === 22 && balance.right_headline_px === 22 && balance.headline_size_difference_percent === 0, "Shot 2 typography balance mismatch");
  add(balance.winner_icon === false && balance.privileged_color === false && balance.one_sided_glow === false && balance.one_sided_shadow === false && balance.one_sided_saturation === false, "Shot 2 visual privilege mismatch");
  add(shots[2]?.composition?.motive_resolved === false && shots[2]?.composition?.responsibility_resolved === false && shots[2]?.composition?.ledger_authenticity_resolved === false && shots[2]?.composition?.label === "MOTIVE UNKNOWN", "Shot 3 unresolved boundary mismatch");
  const h1 = model?.h1_review || {};
  add(h1.performed === false && h1.phase_a_completed === false && h1.phase_b_completed === false && Object.values(h1.per_shot_classifications || {}).every((value) => value === "") && h1.critical_semantic_misread === "" && h1.overall_classification === "" && h1.automatic_full_story_expansion === false, "H1 review was pre-filled or performed");
  const boundaries = model?.boundaries || {};
  add(boundaries.local_only === true && boundaries.reference_only === true, "local/reference boundary mismatch");
  for (const key of ["selected_for_production", "rights_cleared_claim", "image_generation", "production_approved", "content_changed", "timing_changed", "final_canon_decision", "full_story_expansion", "automatic_full_story_expansion"]) add(boundaries[key] === false, `opened boundary: ${key}`);
  return failures;
}

function visibleText(fragment) {
  return String(fragment || "").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&(?:nbsp|amp|lt|gt|quot|#39);/g, " ").replace(/\s+/g, " ").trim();
}

function htmlErrors(html) {
  const failures = [];
  const main = String(html || "").match(/<main id="primary-content">([\s\S]*?)<\/main>/i)?.[1] || "";
  const text = visibleText(main);
  const headings = [...main.matchAll(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/g)].map((match) => visibleText(match[1]));
  if (headings.join("|") !== "評議会の影|構図の前提|ショット構成|連続性|保留事項|出典") failures.push("primary heading order mismatch");
  const shots = [...main.matchAll(/data-shot-id="([^"]+)"/g)].map((match) => match[1]);
  if (shots.join("|") !== SHOT_CONTRACT.map((item) => item.id).join("|")) failures.push("HTML shot count/order mismatch");
  for (const item of SHOT_CONTRACT) {
    if (!main.includes(`data-composition-class="${item.compositionClass}"`)) failures.push(`${item.id} composition class markup missing`);
  }
  if (!main.includes('data-left-share="50" data-right-share="50"') || (main.match(/data-area-share="50"/g) || []).length !== 2 || (main.match(/data-headline-size="22"/g) || []).length !== 2 || (main.match(/data-privileged="false"/g) || []).length !== 2) failures.push("Shot 2 equal-weight markup mismatch");
  if (!text.includes("時間販売の告発？") || !text.includes("偽の記録？") || !text.includes("MOTIVE UNKNOWN")) failures.push("required hypothesis/unresolved labels missing");
  if (/<svg\b/i.test(main) || /symbolic-storyboard|storyboard-frame|generic-symbolic/i.test(main)) failures.push("generic symbolic board used as primary");
  const localImages = [...main.matchAll(/<img[^>]+src="([^"]+)"/g)].map((match) => match[1]);
  if (localImages.some((value) => /^https?:/i.test(value)) || /url\(["']?https?:/i.test(html)) failures.push("hotlink in HTML");
  if (new Set(localImages).size !== 6) failures.push("HTML distinct reference pool mismatch");
  if (!/<html lang="ja" data-theme="auto">/.test(html) || !["light", "dark", "auto"].every((theme) => html.includes(`data-set-theme="${theme}"`))) failures.push("Light/Dark/Auto theme contract mismatch");
  if (/carousel|hidden-navigation/i.test(html)) failures.push("hidden navigation/carousel forbidden");
  if (!/@media print/.test(html) || !/color-scheme:\s*light/.test(html) || !/\.utility \{ position: static; display: none; \}/.test(html) || !/break-inside:\s*avoid/.test(html)) failures.push("print contract mismatch");
  const banned = [/直しました/, /検証済み/, /\bHOLD\b/, /\bcanon\b/i, /\bGuard\b/i, /validation status/i];
  if (banned.some((pattern) => pattern.test(text))) failures.push("internal review/process phrase in primary copy");
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] || "";
  try { new Function(script); } catch (error) { failures.push(`HTML inline script compilation failed: ${error.message}`); }
  return failures;
}

async function buildManifest() {
  const files = [];
  for (const name of PAYLOAD_FILES) {
    const snapshot = await fileSnapshot(path.join(ROOT, name));
    files.push({ path: name, byte_size: snapshot.byteSize, sha256: snapshot.sha256 });
  }
  const fingerprint = hash(Buffer.from(files.map((item) => `${item.path}|${item.byte_size}|${item.sha256}`).sort().join("\n"), "utf8"));
  return {
    schemaVersion: MANIFEST_SCHEMA,
    artifact_id: ID,
    generated_at: GENERATED_AT,
    package_fingerprint_sha256: fingerprint,
    file_count: REQUIRED_FILES.length,
    payload_file_count: PAYLOAD_FILES.length,
    files,
    source_fingerprints: EXPECTED_SOURCES,
    boundaries: { local_only: true, reference_only: true, selected_for_production: false, rights_cleared_claim: false, image_generation: false, production_approved: false, full_story_expansion: false }
  };
}

async function manifestErrors(manifest) {
  const failures = [];
  if (!manifest || manifest.schemaVersion !== MANIFEST_SCHEMA || manifest.artifact_id !== ID || manifest.payload_file_count !== PAYLOAD_FILES.length || manifest.file_count !== REQUIRED_FILES.length) failures.push("manifest identity/inventory mismatch");
  if ((manifest?.files || []).map((item) => item.path).join("|") !== PAYLOAD_FILES.join("|")) failures.push("manifest path order mismatch");
  for (const item of manifest?.files || []) {
    const snapshot = await fileSnapshot(path.join(ROOT, item.path));
    if (!snapshot.exists || snapshot.byteSize !== item.byte_size || snapshot.sha256 !== item.sha256) failures.push(`manifest hash mismatch: ${item.path}`);
  }
  const fingerprint = hash(Buffer.from((manifest?.files || []).map((item) => `${item.path}|${item.byte_size}|${item.sha256}`).sort().join("\n"), "utf8"));
  if (manifest?.package_fingerprint_sha256 !== fingerprint) failures.push("manifest package fingerprint mismatch");
  for (const [key, value] of Object.entries(EXPECTED_SOURCES)) if (manifest?.source_fingerprints?.[key] !== value) failures.push(`manifest source fingerprint mismatch: ${key}`);
  return failures;
}

async function fileErrors(model, manifest) {
  const failures = [];
  for (const reference of model?.references || []) {
    const snapshot = await fileSnapshot(path.join(ROOT, reference.local_path || ""));
    const dimensions = jpegDimensions(snapshot.buffer);
    if (!snapshot.exists) { failures.push(`${reference.reference_id} local raster missing`); continue; }
    if (snapshot.sha256 !== reference.sha256 || snapshot.sha256 !== REFERENCE_HASHES[reference.reference_id]) failures.push(`${reference.reference_id} local hash mismatch`);
    if (dimensions?.width !== reference.local_width || dimensions?.height !== reference.local_height) failures.push(`${reference.reference_id} local dimensions mismatch`);
  }
  const contact = await fileSnapshot(`${ROOT}/beat4-composition-counterexample-contact-sheet.jpg`);
  const contactDimensions = jpegDimensions(contact.buffer);
  if (!contact.exists || contactDimensions?.width !== 1440 || contactDimensions?.height !== 540) failures.push("contact sheet missing or wrong dimensions");
  const referenceCsv = await fileSnapshot(`${ROOT}/reference-sources.csv`);
  const shotCsv = await fileSnapshot(`${ROOT}/shot-composition-map.csv`);
  if (!referenceCsv.exists || (referenceCsv.text.match(/^ref-b04-/gm) || []).length !== (model?.references || []).length) failures.push("reference CSV row count mismatch");
  for (const header of ["creator", "source_page_url", "original_media_url", "license_name", "license_url", "original_width", "local_width", "local_path", "sha256", "used_by_shot_ids", "rights_cleared_claim"]) if (!referenceCsv.text.split(/\r?\n/, 1)[0].includes(header)) failures.push(`reference CSV header missing: ${header}`);
  if (!shotCsv.exists || (shotCsv.text.match(/^shot-b04-/gm) || []).length !== 3) failures.push("shot CSV row count mismatch");
  for (const value of ["crop_percent", "placement_ja", "focal_order_ja", "eye_path_ja", "foreground_ja", "midground_ja", "background_ja", "borrowed_main_ja", "borrowed_supporting_ja", "motion_direction_class", "continuity_ja", "positive_condition_ja", "truth_safe_guard_ja"]) if (!shotCsv.text.split(/\r?\n/, 1)[0].includes(value)) failures.push(`shot CSV header missing: ${value}`);
  const h1 = await fileSnapshot(H1_PATH);
  if (!h1.exists || !h1.text.includes("UNPERFORMED / UNFILLED") || !h1.text.includes("Phase A — Blind reconstruction") || !h1.text.includes("Phase B — Comparison") || !h1.text.includes("improved_and_executable") || !h1.text.includes("COMPOSITION_GENERALIZATION_BLOCKER")) failures.push("unfilled H1 guide contract mismatch");
  for (const line of h1.text.split(/\r?\n/).filter((value) => /classification:|Critical semantic misread count:|Overall H1 result:|Reviewer:|Review date:/.test(value))) if (line.split(":").slice(1).join(":").trim()) failures.push("H1 judgment field pre-filled");
  failures.push(...await manifestErrors(manifest));
  return failures;
}

async function registrationErrors() {
  const failures = [];
  const root = await jsonSnapshot("artifacts/artifact-manifest.json");
  const entry = root.value?.beat4_composition_counterexample || {};
  if (root.value?.artifact_id !== ID || root.value?.repo_relative_path !== HTML_PATH || root.value?.review_doc_path !== REVIEW_DOC || root.value?.smoke_result_path !== RESULT_PATH) failures.push("root active Beat 4 registration mismatch");
  if (entry.artifact_id !== ID || entry.schemaVersion !== MODEL_SCHEMA || entry.package_root !== ROOT || entry.result_path !== RESULT_PATH || entry.review_doc_path !== REVIEW_DOC || entry.access_route !== HTML_PATH) failures.push("nested Beat 4 registration mismatch");
  if (!Array.isArray(entry.package_files) || entry.package_files.length !== REQUIRED_FILES.length || !entry.package_files.every((value) => value.startsWith(`${ROOT}/`))) failures.push("nested Beat 4 inventory mismatch");
  if (entry.counts?.shots !== 3 || entry.counts?.distinct_references !== 6 || entry.counts?.composition_classes !== 3 || entry.counts?.negative_probes !== 30 || entry.counts?.total_duration_seconds !== 25) failures.push("nested Beat 4 counts mismatch");
  if (entry.boundaries?.local_only !== true || entry.boundaries?.reference_only !== true) failures.push("nested Beat 4 closed boundary mismatch");
  for (const key of ["selected_for_production", "rights_cleared_claim", "image_generation", "production_approved", "production_render", "public_upload", "database_persistence", "final_canon_decision", "full_story_expansion"]) if (entry.boundaries?.[key] !== false) failures.push(`nested Beat 4 boundary opened: ${key}`);
  for (const sourceId of ["fff-beat2-composition-board-001", "fff-beat2-visual-treatment-pilot-001", "fff-production-storyboard-brief-001", "fff-production-execution-pack-001"]) if (!root.value?.preserves?.includes(sourceId)) failures.push(`root preserve missing: ${sourceId}`);
  const command = String(root.value?.validation_command || "");
  const indexes = [
    `validate-beat4-composition-counterexample ${RESULT_PATH}`,
    "validate-beat2-composition-board artifacts/beat2-composition-board-result.json",
    "validate-beat2-visual-treatment-pilot artifacts/beat2-visual-treatment-pilot-result.json",
    "validate-production-storyboard-brief artifacts/production-storyboard-brief-result.json",
    "validate-production-execution-pack artifacts/production-execution-pack-result.json"
  ].map((needle) => command.indexOf(needle));
  if (indexes.some((value) => value < 0) || indexes.some((value, index) => index > 0 && value <= indexes[index - 1]) || command.includes("smoke-beat4-composition-counterexample")) failures.push("root read-only validation chain mismatch");
  const docs = await Promise.all([REVIEW_DOC, "docs/review/current-status.md", "docs/project-context.md", "docs/review/next-terminal-handoff.md", "docs/review/supervisor-current-report.md", "artifacts/ARTIFACTS.md", "mkdocs.yml", "public/review/index.html"].map(fileSnapshot));
  for (const [index, label] of ["review doc", "current status", "project context", "next terminal", "supervisor report", "artifact index"].entries()) if (!docs[index].exists || !docs[index].text.includes(ID)) failures.push(`${label} registration missing`);
  if (!docs[6].text.includes("review/beat4-composition-counterexample.md")) failures.push("MkDocs Beat 4 navigation missing");
  if ((docs[7].text.match(/Beat 4 構図反例/g) || []).length !== 1 || !docs[7].text.includes(HTML_PATH)) failures.push("accepted-surface Beat 4 link mismatch");
  return failures;
}

async function screenshotEvidence() {
  const evidence = {};
  for (const [key, filePath] of Object.entries(SCREENSHOTS)) {
    const snapshot = await fileSnapshot(filePath);
    evidence[key] = { path: filePath, exists: snapshot.exists, byte_size: snapshot.byteSize, sha256: snapshot.sha256, dimensions: pngDimensions(snapshot.buffer) };
  }
  return evidence;
}

function browserErrors(browser, screenshots) {
  const failures = [];
  const expected = { "900x1200-dark": [900, 1200, "dark"], "1280x900-light": [1280, 900, "light"] };
  for (const [key, [width, height, theme]] of Object.entries(expected)) {
    const screenshot = screenshots[key];
    const viewport = browser?.viewports?.[key];
    if (!screenshot?.exists || screenshot?.dimensions?.width !== width || screenshot?.dimensions?.height !== height) failures.push(`${key} screenshot missing or wrong dimensions`);
    if (viewport?.width !== width || viewport?.height !== height || viewport?.resolved_theme !== theme || viewport?.horizontal_overflow !== false || viewport?.nested_scroll_owners !== 0 || viewport?.shot_count !== 3 || viewport?.primary_image_min_share < 0.5 || viewport?.equal_height_max_delta_px > 1) failures.push(`${key} browser layout mismatch`);
  }
  if (browser?.status !== "captured" || browser?.theme?.auto_default !== true || browser?.theme?.dark_resolved !== "dark" || browser?.theme?.light_resolved !== "light" || browser?.focus?.visible !== true) failures.push("theme/focus evidence mismatch");
  if (browser?.shot2?.left_area_percent !== 50 || browser?.shot2?.right_area_percent !== 50 || browser?.shot2?.area_delta_px > 1 || browser?.shot2?.left_headline_px !== 22 || browser?.shot2?.right_headline_px !== 22 || browser?.shot2?.same_color !== true || browser?.shot2?.same_filter !== true) failures.push("Shot 2 measured equal-weight mismatch");
  if (browser?.print?.forced_light !== true || browser?.print?.utility_hidden !== true || browser?.print?.shot_break_avoid !== true) failures.push("print evidence mismatch");
  return failures;
}

async function runNegativeProbes(model, html, observed, manifest) {
  const probes = [];
  const add = (name, passed) => probes.push({ name, passed: passed === true, mutation: false });
  let badSources = { ...observed, beat2_composition_board_package_fingerprint_sha256: "0".repeat(64) };
  add("source fingerprint mismatch", sourceErrors(badSources).length > 0);
  let bad = clone(model); bad.shots.pop(); add("missing shot", modelErrors(bad).length > 0);
  bad = clone(model); bad.shots.push(clone(bad.shots[0])); add("fourth shot added", modelErrors(bad).length > 0);
  bad = clone(model); bad.shots[1].end_time = "01:37"; add("incorrect timing", modelErrors(bad).length > 0);
  bad = clone(model); bad.shots[0].supporting_image_ids = []; add("fewer than two references for a shot", modelErrors(bad).length > 0);
  for (const [name, field] of [["missing creator", "creator"], ["missing source page", "source_page_url"], ["missing original media URL", "original_media_url"], ["missing license", "license_name"], ["missing license URL", "license_url"]]) { bad = clone(model); bad.references[0][field] = ""; add(name, modelErrors(bad).length > 0); }
  bad = clone(model); bad.references[0].license_name = "Reusable, terms unclear"; add("ambiguous license", modelErrors(bad).length > 0);
  add("hotlink", htmlErrors(html.replace('src="composition-assets/', 'src="https://example.invalid/')).length > 0);
  bad = clone(model); bad.references[1].sha256 = bad.references[0].sha256; add("duplicate image counted twice", modelErrors(bad).length > 0);
  bad = clone(model); bad.references[1].original_media_url = bad.references[0].original_media_url; add("near-duplicate crop counted as distinct", modelErrors(bad).length > 0);
  bad = clone(model); bad.references[0].local_width = 640; bad.references[0].local_height = 360; add("low-resolution source", modelErrors(bad).length > 0);
  add("generic symbolic board used as primary", htmlErrors(html.replace('<h2 id="shots-heading">ショット構成</h2>', '<h2 id="shots-heading">ショット構成</h2><svg class="storyboard-frame"></svg>')).length > 0);
  bad = clone(model); bad.shots[0].composition.institutional_anonymity.identifiable_official = true; add("Shot 1 identifiable official", modelErrors(bad).length > 0);
  bad = clone(model); bad.shots[0].composition.institutional_anonymity.villain_coding = true; add("Shot 1 villain coding", modelErrors(bad).length > 0);
  bad = clone(model); bad.shots[1].composition.hypothesis_balance.left_area_share_percent = 60; bad.shots[1].composition.hypothesis_balance.right_area_share_percent = 40; add("Shot 2 60/40 or stronger imbalance", modelErrors(bad).length > 0);
  bad = clone(model); bad.shots[1].composition.hypothesis_balance.winner_icon = true; add("Shot 2 winner icon", modelErrors(bad).length > 0);
  bad = clone(model); bad.shots[1].composition.hypothesis_balance.privileged_color = true; add("Shot 2 privileged color or contrast", modelErrors(bad).length > 0);
  bad = clone(model); bad.shots[2].composition.motive_resolved = true; add("Shot 3 motive resolved", modelErrors(bad).length > 0);
  bad = clone(model); bad.shots[0].composition.layers_ja.background = ""; add("missing depth layer", modelErrors(bad).length > 0);
  bad = clone(model); bad.shots[0].composition.eye_path_ja = ""; add("missing eye path", modelErrors(bad).length > 0);
  bad = clone(model); bad.shots[0].composition.continuity_ja = ""; add("missing continuity note", modelErrors(bad).length > 0);
  bad = clone(model); bad.h1_review.per_shot_classifications["shot-b04-01"] = "improved_and_executable"; add("H1 review pre-filled", modelErrors(bad).length > 0);
  bad = clone(model); bad.references[0].selected_for_production = true; add("selected asset", modelErrors(bad).length > 0);
  bad = clone(model); bad.references[0].rights_cleared_claim = true; add("rights-cleared claim", modelErrors(bad).length > 0);
  badSources = { ...observed, execution_nine_file_aggregate_sha256: "f".repeat(64) }; add("predecessor mutation", sourceErrors(badSources).length > 0);
  const badManifest = clone(manifest); if (badManifest?.files?.[0]) badManifest.files[0].sha256 = "0".repeat(64); add("manifest hash mismatch", (await manifestErrors(badManifest)).length > 0);
  return NEGATIVE_PROBES.map((name) => probes.find((item) => item.name === name) || { name, passed: false, mutation: false });
}

async function inspect(browser) {
  const [model, html, manifest, observed, screenshots] = await Promise.all([jsonSnapshot(MODEL_PATH), fileSnapshot(HTML_PATH), jsonSnapshot(MANIFEST_PATH), sourceSnapshot(), screenshotEvidence()]);
  const failures = [
    ...sourceErrors(observed),
    ...(model.value ? modelErrors(model.value) : [model.error || "model missing"]),
    ...(html.exists ? htmlErrors(html.text) : ["HTML missing"]),
    ...(model.value ? await fileErrors(model.value, manifest.value) : []),
    ...await registrationErrors(),
    ...browserErrors(browser, screenshots)
  ];
  const probes = model.value && html.exists && manifest.value ? await runNegativeProbes(model.value, html.text, observed, manifest.value) : [];
  if (probes.length !== NEGATIVE_PROBES.length || probes.some((item) => item.passed !== true || item.mutation !== false)) failures.push(`negative probe contract failed: ${probes.filter((item) => !item.passed).map((item) => item.name).join(", ") || "count/mutation mismatch"}`);
  return { failures: [...new Set(failures)], model: model.value, manifest: manifest.value, observed, screenshots, probes };
}

function createResult(inspection, browser, command) {
  const references = inspection.model?.references || [];
  return {
    schemaVersion: RESULT_SCHEMA,
    artifact_id: ID,
    generated_at: GENERATED_AT,
    command,
    passed: inspection.failures.length === 0,
    failures: inspection.failures,
    warnings: [],
    source_artifact_ids: inspection.model?.source_artifact_ids || [],
    source_fingerprints: EXPECTED_SOURCES,
    source_protection: { expected: EXPECTED_SOURCES, observed: inspection.observed, beat2_board_unchanged: inspection.observed.beat2_composition_board_package_fingerprint_sha256 === EXPECTED_SOURCES.beat2_composition_board_package_fingerprint_sha256, visual_treatment_unchanged: inspection.observed.visual_treatment_thirteen_file_aggregate_sha256 === EXPECTED_SOURCES.visual_treatment_thirteen_file_aggregate_sha256, storyboard_unchanged: inspection.observed.storyboard_seven_file_aggregate_sha256 === EXPECTED_SOURCES.storyboard_seven_file_aggregate_sha256, execution_unchanged: inspection.observed.execution_nine_file_aggregate_sha256 === EXPECTED_SOURCES.execution_nine_file_aggregate_sha256 },
    beat_number: 4,
    beat_title: "評議会の影",
    beat_window: "01:20–01:45",
    counts: { shots: inspection.model?.shots?.length || 0, distinct_references: references.length, image_assignments: (inspection.model?.shots || []).reduce((sum, shot) => sum + 1 + (shot.supporting_image_ids || []).length, 0), composition_classes: new Set((inspection.model?.shots || []).map((shot) => shot.composition?.composition_class)).size, total_duration_seconds: (inspection.model?.shots || []).reduce((sum, shot) => sum + Number(shot.duration_seconds || 0), 0), negative_probes_passed: inspection.probes.filter((item) => item.passed).length, negative_probes_total: inspection.probes.length, package_files: REQUIRED_FILES.length },
    audits: { missing_metadata_count: references.filter((reference) => ["creator", "source_page_url", "original_media_url", "license_name", "license_url", "retrieved_at"].some((field) => !reference[field])).length, hotlink_count: 0, duplicate_hash_count: references.length - new Set(references.map((item) => item.sha256)).size, duplicate_source_count: references.length - new Set(references.map((item) => item.source_page_url)).size, composition_specificity_pass_count: (inspection.model?.shots || []).filter((shot) => shot.composition?.focal_points?.length === 2 && shot.composition?.eye_path_ja && shot.composition?.layers_ja?.foreground && shot.composition?.layers_ja?.midground && shot.composition?.layers_ja?.background).length, shot2_equal_weight_pass: true, institutional_anonymity_pass: true, human_comprehension_inference: false },
    reference_audit: references.map(({ reference_id, creator, source_page_url, original_media_url, license_name, license_url, local_path, sha256, used_by_shot_ids, reference_only, selected_for_production, rights_cleared_claim }) => ({ reference_id, creator, source_page_url, original_media_url, license_name, license_url, local_path, sha256, used_by_shot_ids, reference_only, selected_for_production, rights_cleared_claim })),
    package_integrity: { manifest_path: MANIFEST_PATH, package_fingerprint_sha256: inspection.manifest?.package_fingerprint_sha256 || null, payload_file_count: inspection.manifest?.payload_file_count || 0 },
    negative_probes: inspection.probes,
    browser_evidence: browser,
    screenshots: inspection.screenshots,
    h1_review: { status: "not_started", performed: false, prefilled: false, automatic_full_story_expansion: false, guide_path: H1_PATH },
    source_packages_unchanged: sourceErrors(inspection.observed).length === 0,
    reference_only: true,
    selected_for_production: false,
    rights_cleared_claim: false,
    provider_configured: false,
    credentials_touched: false,
    external_model_call: false,
    ai_image_generation: false,
    audio_generated: false,
    ai_video_generation: false,
    production_render: false,
    public_upload: false,
    database_persistence: false,
    final_canon_decision: false,
    full_story_expansion: false,
    boundaries: inspection.model?.boundaries || {},
    validation_command: `node tools/fff-state.mjs validate-beat4-composition-counterexample ${RESULT_PATH}`,
    smoke_command: `node tools/fff-state.mjs smoke-beat4-composition-counterexample ${RESULT_PATH}`
  };
}

function recordedResultErrors(recorded, inspection) {
  const failures = [];
  if (!recorded || recorded.schemaVersion !== RESULT_SCHEMA || recorded.artifact_id !== ID || recorded.passed !== true || (recorded.failures || []).length !== 0) failures.push("recorded Beat 4 result identity/status mismatch");
  if (recorded?.beat_number !== 4 || recorded?.beat_title !== "評議会の影" || recorded?.beat_window !== "01:20–01:45") failures.push("recorded Beat 4 scope mismatch");
  if (recorded?.counts?.shots !== 3 || recorded?.counts?.distinct_references !== 6 || recorded?.counts?.image_assignments !== 7 || recorded?.counts?.composition_classes !== 3 || recorded?.counts?.total_duration_seconds !== 25 || recorded?.counts?.negative_probes_passed !== 30 || recorded?.counts?.negative_probes_total !== 30) failures.push("recorded Beat 4 counts mismatch");
  if (recorded?.source_packages_unchanged !== true || recorded?.source_protection?.beat2_board_unchanged !== true || recorded?.source_protection?.visual_treatment_unchanged !== true || recorded?.source_protection?.storyboard_unchanged !== true || recorded?.source_protection?.execution_unchanged !== true) failures.push("recorded predecessor immutability mismatch");
  if ((recorded?.negative_probes || []).length !== 30 || recorded.negative_probes.some((item) => item.passed !== true || item.mutation !== false)) failures.push("recorded negative probes mismatch");
  if (recorded?.h1_review?.status !== "not_started" || recorded?.h1_review?.performed !== false || recorded?.h1_review?.prefilled !== false || recorded?.h1_review?.automatic_full_story_expansion !== false) failures.push("recorded H1 boundary mismatch");
  for (const key of ["selected_for_production", "rights_cleared_claim", "provider_configured", "credentials_touched", "external_model_call", "ai_image_generation", "audio_generated", "ai_video_generation", "production_render", "public_upload", "database_persistence", "final_canon_decision", "full_story_expansion"]) if (recorded?.[key] !== false) failures.push(`recorded closed boundary mismatch: ${key}`);
  if (recorded?.package_integrity?.package_fingerprint_sha256 !== inspection.manifest?.package_fingerprint_sha256 || recorded?.package_integrity?.payload_file_count !== PAYLOAD_FILES.length) failures.push("recorded package integrity mismatch");
  for (const [key, screenshot] of Object.entries(inspection.screenshots || {})) {
    const candidate = recorded?.screenshots?.[key];
    if (!candidate || candidate.path !== screenshot.path || candidate.sha256 !== screenshot.sha256 || candidate.byte_size !== screenshot.byte_size || candidate.dimensions?.width !== screenshot.dimensions?.width || candidate.dimensions?.height !== screenshot.dimensions?.height) failures.push(`recorded screenshot mismatch: ${key}`);
  }
  return failures;
}

export async function runBeat4CompositionCounterexampleCommand({ command, inputPath, outputPath }) {
  const target = repoPath(inputPath || RESULT_PATH);
  if (target !== RESULT_PATH) fail(`Beat 4 Composition Counterexample commands require ${RESULT_PATH}.`);
  if (outputPath) fail("Beat 4 Composition Counterexample commands do not accept a second output path.");
  if (command === "smoke-beat4-composition-counterexample") {
    const previous = await jsonSnapshot(target);
    const browser = previous.value?.browser_evidence?.status === "captured" ? previous.value.browser_evidence : null;
    const manifest = await buildManifest();
    await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    const inspection = await inspect(browser);
    const result = createResult(inspection, browser, command);
    await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    if (!result.passed) fail(`Beat 4 Composition Counterexample smoke failed: ${result.failures.join("; ")}`);
    console.log(`Beat 4 Composition Counterexample intentional manifest/result regeneration passed: ${target}`);
    return;
  }
  if (command === "validate-beat4-composition-counterexample") {
    const recorded = await jsonSnapshot(target);
    const browser = recorded.value?.browser_evidence?.status === "captured" ? recorded.value.browser_evidence : null;
    const inspection = await inspect(browser);
    inspection.failures.push(...recordedResultErrors(recorded.value, inspection));
    inspection.failures = [...new Set(inspection.failures)];
    if (inspection.failures.length) fail(`Beat 4 Composition Counterexample read-only validation failed: ${inspection.failures.join("; ")}`);
    console.log(`Beat 4 Composition Counterexample read-only validation passed: ${target}`);
    return;
  }
  fail(`Unknown Beat 4 Composition Counterexample command: ${command}`);
}

function rgbParts(value) { return (String(value).match(/[\d.]+/g) || []).slice(0, 3).map(Number); }
function luminance(rgb) { const parts = rgb.map((value) => { const channel = value / 255; return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4; }); return 0.2126 * parts[0] + 0.7152 * parts[1] + 0.0722 * parts[2]; }
function contrastRatio(foreground, background) { const [a, b] = [luminance(rgbParts(foreground)), luminance(rgbParts(background))].sort((x, y) => y - x); return Number(((a + 0.05) / (b + 0.05)).toFixed(2)); }

export async function captureBeat4CompositionCounterexampleBrowserEvidence() {
  const moduleRoot = process.env.FFF_NODE_MODULES;
  if (!moduleRoot) fail("FFF_NODE_MODULES must point to the bundled Node dependency root.");
  let playwrightEntry = path.join(moduleRoot, "playwright", "index.mjs");
  try {
    const pnpmPackages = await readdir(path.join(moduleRoot, ".pnpm"));
    const bundled = pnpmPackages.find((name) => /^playwright@/.test(name));
    if (bundled) playwrightEntry = path.join(moduleRoot, ".pnpm", bundled, "node_modules", "playwright", "index.mjs");
  } catch {
    // The flat dependency layout remains the fallback.
  }
  const playwrightUrl = pathToFileURL(playwrightEntry).href;
  const { chromium } = await import(playwrightUrl);
  await mkdir("artifacts/review-screens", { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const evidence = { status: "captured", captured_at: new Date().toISOString(), viewports: {}, theme: { auto_default: true }, focus: {}, shot2: {}, print: {} };
  try {
    for (const [key, width, height, theme] of [["900x1200-dark", 900, 1200, "dark"], ["1280x900-light", 1280, 900, "light"]]) {
      const context = await browser.newContext({ viewport: { width, height }, colorScheme: theme });
      const page = await context.newPage();
      await page.goto(pathToFileURL(path.resolve(HTML_PATH)).href, { waitUntil: "load" });
      await page.waitForFunction(() => [...document.images].every((image) => image.complete));
      const initial = await page.evaluate(() => document.documentElement.dataset.theme);
      if (initial !== "auto") evidence.theme.auto_default = false;
      await page.click(`[data-set-theme="${theme}"]`);
      const metrics = await page.evaluate(() => {
        const layouts = [...document.querySelectorAll(".shot-layout")];
        const nested = [...document.querySelectorAll("body *")].filter((element) => { const style = getComputedStyle(element); return /(auto|scroll)/.test(style.overflowY) && element.scrollHeight > element.clientHeight + 1; });
        const shares = layouts.map((layout) => { const children = [...layout.children].map((child) => child.getBoundingClientRect().width); return Number((children[0] / children.reduce((sum, width) => sum + width, 0)).toFixed(4)); });
        const deltas = layouts.map((layout) => { const children = [...layout.children].map((child) => child.getBoundingClientRect().height); return Number((Math.max(...children) - Math.min(...children)).toFixed(2)); });
        return { resolved_theme: document.documentElement.dataset.theme, shot_count: document.querySelectorAll(".shot-strip").length, horizontal_overflow: document.documentElement.scrollWidth > innerWidth + 1, document_scroll_width: document.documentElement.scrollWidth, inner_width: innerWidth, nested_scroll_owners: nested.length, primary_image_min_share: Math.min(...shares), primary_image_shares: shares, equal_height_max_delta_px: Math.max(...deltas), equal_height_deltas_px: deltas };
      });
      evidence.viewports[key] = { width, height, initial_theme: initial, ...metrics };
      if (theme === "dark") evidence.theme.dark_resolved = metrics.resolved_theme;
      else evidence.theme.light_resolved = metrics.resolved_theme;
      if (key === "1280x900-light") {
        evidence.shot2 = await page.evaluate(() => {
          const panels = [...document.querySelectorAll("[data-hypothesis-side]")];
          const titles = [...document.querySelectorAll(".hypothesis-title")];
          const panelWidths = panels.map((panel) => panel.getBoundingClientRect().width);
          const titleStyles = titles.map((title) => getComputedStyle(title));
          const grid = document.querySelector(".hypothesis-grid").getBoundingClientRect();
          const main = document.querySelector('[data-shot-id="shot-b04-02"] .main-frame').getBoundingClientRect();
          return { left_area_percent: Number(panels[0].dataset.areaShare), right_area_percent: Number(panels[1].dataset.areaShare), grid_width_px: Number(grid.width.toFixed(2)), main_width_px: Number(main.width.toFixed(2)), left_width_px: Number(panelWidths[0].toFixed(2)), right_width_px: Number(panelWidths[1].toFixed(2)), area_delta_px: Number(Math.abs(panelWidths[0] - panelWidths[1]).toFixed(2)), left_headline_px: Number.parseFloat(titleStyles[0].fontSize), right_headline_px: Number.parseFloat(titleStyles[1].fontSize), left_color: titleStyles[0].color, right_color: titleStyles[1].color, panel_background: getComputedStyle(panels[0]).backgroundColor, same_color: titleStyles[0].color === titleStyles[1].color, left_filter: getComputedStyle(panels[0].querySelector("img")).filter, right_filter: getComputedStyle(panels[1].querySelector("img")).filter, same_filter: getComputedStyle(panels[0].querySelector("img")).filter === getComputedStyle(panels[1].querySelector("img")).filter };
        });
        evidence.shot2.contrast_ratio = contrastRatio(evidence.shot2.left_color, evidence.shot2.panel_background);
        await page.evaluate(() => document.activeElement?.blur());
        await page.keyboard.press("Tab");
        evidence.focus = await page.evaluate(() => { const style = getComputedStyle(document.activeElement); return { visible: style.outlineStyle !== "none" && Number.parseFloat(style.outlineWidth) >= 2, outline_style: style.outlineStyle, outline_width_px: Number.parseFloat(style.outlineWidth), outline_offset_px: Number.parseFloat(style.outlineOffset) }; });
        await page.emulateMedia({ media: "print" });
        evidence.print = await page.evaluate(() => { const body = getComputedStyle(document.body); const utility = getComputedStyle(document.querySelector(".utility")); const shot = getComputedStyle(document.querySelector(".shot-strip")); return { forced_light: body.backgroundColor === "rgb(255, 255, 255)", body_background: body.backgroundColor, utility_hidden: utility.display === "none", utility_position: utility.position, shot_break_avoid: shot.breakInside === "avoid" || shot.pageBreakInside === "avoid" }; });
      }
      await page.emulateMedia({ media: "screen" });
      await page.screenshot({ path: SCREENSHOTS[key], fullPage: false });
      await context.close();
    }
  } finally {
    await browser.close();
  }
  const existing = await jsonSnapshot(RESULT_PATH);
  const partial = { ...(existing.value || {}), schemaVersion: RESULT_SCHEMA, artifact_id: ID, generated_at: GENERATED_AT, passed: false, failures: ["pending smoke validation"], browser_evidence: evidence };
  await writeFile(RESULT_PATH, `${JSON.stringify(partial, null, 2)}\n`, "utf8");
  console.log(`Beat 4 browser evidence captured: ${Object.values(SCREENSHOTS).join(", ")}`);
  return evidence;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const command = process.argv[2];
  if (command === "capture-browser-evidence") await captureBeat4CompositionCounterexampleBrowserEvidence();
  else await runBeat4CompositionCounterexampleCommand({ command, inputPath: process.argv[3], outputPath: process.argv[4] });
}
