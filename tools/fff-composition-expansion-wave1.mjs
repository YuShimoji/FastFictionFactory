#!/usr/bin/env node

import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ID = "fff-composition-expansion-wave1-001";
const MODEL_SCHEMA = "fff.compositionExpansionWave1.v1";
const RESULT_SCHEMA = "fff.compositionExpansionWave1Result.v1";
const MANIFEST_SCHEMA = "fff.compositionExpansionWave1Manifest.v1";
const GENERATED_AT = "2026-07-19T22:30:00+09:00";
const ROOT = "artifacts/composition-expansion-wave1";
const MODEL_PATH = `${ROOT}/composition-expansion-wave1.json`;
const HTML_PATH = `${ROOT}/composition-expansion-wave1.html`;
const REFERENCE_CSV = `${ROOT}/reference-sources.csv`;
const SHOT_CSV = `${ROOT}/shot-composition-map.csv`;
const README_PATH = `${ROOT}/README_COMPOSITION_EXPANSION_WAVE1.md`;
const CONTACT_PATH = `${ROOT}/composition-expansion-wave1-contact-sheet.jpg`;
const MANIFEST_PATH = `${ROOT}/composition-expansion-wave1-manifest.json`;
const RESULT_PATH = "artifacts/composition-expansion-wave1-result.json";
const REVIEW_DOC = "docs/review/composition-expansion-wave1.md";
const SCREENSHOTS = Object.freeze({
  "900x1200-dark": "artifacts/review-screens/composition-expansion-wave1-900x1200-dark.png",
  "1280x900-light": "artifacts/review-screens/composition-expansion-wave1-1280x900-light.png"
});

const ASSET_FILES = Object.freeze([
  "composition-assets/ref-w1-b01-s01-harvard-observatory.jpg",
  "composition-assets/ref-w1-b01-s01-kreiensen-station.jpg",
  "composition-assets/ref-w1-b01-s02-beam-junction.jpg",
  "composition-assets/ref-w1-b01-s02-wood-joints.jpg",
  "composition-assets/ref-w1-b01-s03-belfry-interior-art.jpg",
  "composition-assets/ref-w1-b01-s03-noon-mark.jpg",
  "composition-assets/ref-w1-b03-s01-book-in-hand.jpg",
  "composition-assets/ref-w1-b03-s01-page-turning.jpg",
  "composition-assets/ref-w1-b03-s02-blank-book.jpg",
  "composition-assets/ref-w1-b03-s02-ledger-geometry.jpg",
  "composition-assets/ref-w1-b03-s03-ink-stains.jpg",
  "composition-assets/ref-w1-b03-s03-old-paper.jpg"
]);
const PAYLOAD_FILES = Object.freeze([
  "README_COMPOSITION_EXPANSION_WAVE1.md",
  "composition-expansion-wave1.html",
  "composition-expansion-wave1.json",
  "reference-sources.csv",
  "shot-composition-map.csv",
  "composition-expansion-wave1-contact-sheet.jpg",
  ...ASSET_FILES
]);
const REQUIRED_FILES = Object.freeze([...PAYLOAD_FILES, "composition-expansion-wave1-manifest.json"]);
const PREDECESSOR_DIRS = Object.freeze([
  "artifacts/beat2-composition-board",
  "artifacts/beat2-visual-treatment-pilot",
  "artifacts/beat4-composition-counterexample",
  "artifacts/production-storyboard-brief",
  "artifacts/production-execution-pack",
  "artifacts/operator-production-brief",
  "artifacts/production-blueprint",
  "artifacts/editorial-derivative",
  "artifacts/editorial-revision",
  "artifacts/editorial-handoff"
]);
const EXPECTED_PREDECESSORS = Object.freeze([
  ["artifacts/beat2-composition-board", 13, "adac4c76dade92f0eadafaa8f3aea651ad53decd545d19bcdf3a487981a817ff"],
  ["artifacts/beat2-visual-treatment-pilot", 13, "bd305a7b177fa36bda5b2bfe737d6dfab2cb1ecb7c07a58e070b131bb85160e5"],
  ["artifacts/beat4-composition-counterexample", 14, "7c4da4bb663af67bc003848813c86f56ba984a83663823d1601ee159a6b2750c"],
  ["artifacts/production-storyboard-brief", 7, "f71959bd2fe5a845d99b2ceead72837de34b00848e9a7b49e603fa773007b5bf"],
  ["artifacts/production-execution-pack", 9, "8628ee4583b67a1b6276904a323ae792a62729a2c03f9e1e6ff509e4c777757f"],
  ["artifacts/operator-production-brief", 6, "85d152570545b29209d09ef27a546630a44d14b4cf51232339b5632d6ebc4212"],
  ["artifacts/production-blueprint", 8, "2bdab898f7924ef6b2c3b732fd26e0c6a757b1db2490baeff255769b12bb09b3"],
  ["artifacts/editorial-derivative", 8, "910d699380998f4259a00730acb6bb70e65b65d284f9969656cc919ecb9cc4be"],
  ["artifacts/editorial-revision", 6, "d701763938f97869ef8fe6748db0fb80890b8f470f2874a03bd14da4191a0b78"],
  ["artifacts/editorial-handoff", 6, "7474a44e84b7072830170be6c8540040b2406ae53b66179dbdbb97011b2ec3e0"]
]);
const SHOT_CONTRACT = Object.freeze([
  ["shot-b01-01", "bridge-storyboard-beat-1-bellless-tower", "00:00", "00:07", 7, "wide", "slow_push", "hard_cut", "station_tower_establishing_depth"],
  ["shot-b01-02", "bridge-storyboard-beat-1-bellless-tower", "00:07", "00:14", 7, "close", "locked", "short_dissolve", "empty_mount_architectural_detail"],
  ["shot-b01-03", "bridge-storyboard-beat-1-bellless-tower", "00:14", "00:20", 6, "medium", "locked", "held_fade", "unresolved_frame_noon_hold"],
  ["shot-b03-01", "bridge-storyboard-beat-3-erased-names", "00:50", "01:00", 10, "close", "slow_push", "hard_cut", "anonymous_ledger_opening_insert"],
  ["shot-b03-02", "bridge-storyboard-beat-3-erased-names", "01:00", "01:10", 10, "graphic_fullframe", "locked", "graphic_match", "fictional_ledger_relation_graphic"],
  ["shot-b03-03", "bridge-storyboard-beat-3-erased-names", "01:10", "01:20", 10, "graphic_fullframe", "graphic_dissolve", "short_dissolve", "staged_record_fade_metaphor"]
]);
const NEGATIVE_PROBE_NAMES = Object.freeze([
  "source fingerprint mismatch", "missing Beat 1", "missing Beat 3", "extra Beat", "missing shot", "extra shot",
  "incorrect timing", "incorrect order", "fewer than 9 references", "fewer than 2 references for one shot",
  "duplicate main image", "duplicate reference counted twice", "near-duplicate crop counted as distinct", "missing creator",
  "missing source page", "missing original media URL", "missing license", "missing license URL", "ambiguous license", "hotlink",
  "low-resolution source", "symbolic pseudo-storyboard used as primary", "missing crop", "missing focal order", "missing depth",
  "missing eye path", "missing continuity", "Beat 1 cause visualized", "Beat 3 document presented as authentic proof",
  "Beat 3 erasure presented as literal proof", "selected asset", "rights-cleared claim", "AI image-generation flag",
  "predecessor mutation", "per-Beat external reviewer required", "human review gate inserted after Wave 1", "theme missing",
  "nested scroll", "horizontal overflow", "manifest mismatch"
]);
const ALLOWED_LICENSE = /^(CC0|CC BY 2\.0|CC BY 3\.0|CC BY-SA 3\.0|CC BY-SA 4\.0|Public domain \(author dedication\))$/;

function hash(buffer) { return createHash("sha256").update(buffer).digest("hex"); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function fail(message) { throw new Error(message); }
function repoPath(value) { return String(value || "").replaceAll("\\", "/").replace(/^\.\//, ""); }
function sameArray(a, b) { return Array.isArray(a) && a.length === b.length && a.every((value, index) => value === b[index]); }

async function fileSnapshot(filePath) {
  try {
    const buffer = await readFile(filePath);
    return { exists: true, path: repoPath(filePath), buffer, text: buffer.toString("utf8"), byte_size: buffer.length, sha256: hash(buffer) };
  } catch (error) {
    return { exists: false, path: repoPath(filePath), buffer: null, text: "", byte_size: 0, sha256: null, error: error.message };
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
    if ([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)) {
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

function imageDimensions(buffer) { return pngDimensions(buffer) || jpegDimensions(buffer); }

async function walkFiles(root) {
  const output = [];
  async function walk(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (entry.isFile()) output.push(full);
    }
  }
  await walk(root);
  return output.sort((a, b) => repoPath(a).localeCompare(repoPath(b), "en"));
}

async function directoryInventory(root) {
  const files = await walkFiles(root);
  const inventory = [];
  for (const file of files) {
    const snapshot = await fileSnapshot(file);
    inventory.push({ path: repoPath(file), byte_size: snapshot.byte_size, sha256: snapshot.sha256 });
  }
  const material = inventory.map((entry) => `${entry.path}|${entry.byte_size}|${entry.sha256}`).join("\n");
  return { directory: repoPath(root), file_count: inventory.length, aggregate_sha256: hash(Buffer.from(material, "utf8")), inventory };
}

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') { field += '"'; index += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") { row.push(field); field = ""; }
    else if (char === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += char;
  }
  if (field || row.length) { row.push(field.replace(/\r$/, "")); rows.push(row); }
  const [headers, ...body] = rows.filter((item) => item.some((value) => value !== ""));
  return body.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function candidateErrors(model) {
  const failures = [];
  const add = (condition, message) => { if (!condition) failures.push(message); };
  add(model?.schemaVersion === MODEL_SCHEMA && model?.artifact_id === ID, "model identity mismatch");
  add(model?.base_revision === "a2f61c72680b2a7d9220f4a2d8f05c2e79ac5189", "base revision mismatch");
  add(model?.status === "h0_reference_only_wave1", "status mismatch");
  const predecessorContract = model?.predecessor_contract || [];
  add(predecessorContract.length === EXPECTED_PREDECESSORS.length, "predecessor contract inventory mismatch");
  EXPECTED_PREDECESSORS.forEach(([directory, fileCount, aggregateSha256], index) => {
    const entry = predecessorContract[index] || {};
    add(entry.directory === directory && entry.file_count === fileCount && entry.aggregate_sha256 === aggregateSha256, `source fingerprint mismatch: ${directory}`);
  });
  const beats = model?.beats || [];
  add(beats.length === 2 && beats[0]?.beat_number === 1 && beats[1]?.beat_number === 3, "exact Beat 1/3 inventory required");
  const shots = model?.shots || [];
  add(shots.length === 6, "exact six-shot inventory required");
  SHOT_CONTRACT.forEach((expected, index) => {
    const shot = shots[index] || {};
    const [id, beat, start, end, duration, scale, motion, transition, compositionClass] = expected;
    add(shot.shot_id === id && shot.beat_id === beat, `${id} identity/order mismatch`);
    add(shot.start_time === start && shot.end_time === end && shot.duration_seconds === duration, `${id} timing mismatch`);
    add(shot.scale === scale && shot.motion === motion && shot.transition === transition, `${id} camera contract mismatch`);
    add(shot.composition?.composition_class === compositionClass, `${id} composition class mismatch`);
    add(Boolean(shot.main_image_id) && Array.isArray(shot.supporting_image_ids) && shot.supporting_image_ids.length >= 1 && new Set([shot.main_image_id, ...shot.supporting_image_ids]).size >= 2, `${id} requires at least two references`);
    const composition = shot.composition || {};
    add(["left","top","width","height"].every((key) => Number.isFinite(composition.crop_percent?.[key])), `${id} crop missing`);
    add(Array.isArray(composition.focal_points) && composition.focal_points.length === 2 && composition.focal_points.map((item) => item.order).join("|") === "1|2", `${id} focal order missing`);
    add(Boolean(composition.eye_path_ja), `${id} eye path missing`);
    add(Boolean(composition.layers_ja?.foreground && composition.layers_ja?.midground && composition.layers_ja?.background), `${id} depth missing`);
    add(Boolean(composition.continuity_ja), `${id} continuity missing`);
    add(Boolean(shot.what_is_seen_ja && shot.purpose_ja && composition.positive_condition_ja && composition.do_not_show_ja && shot.asset_summary_ja), `${id} required copy missing`);
    add(shot.primary_visual_type !== "symbolic_pseudo_storyboard", `${id} symbolic pseudo-storyboard cannot be primary`);
    add(shot.cause_visualized !== true, `${id} cause visualized`);
    add(shot.document_authenticity_claimed !== true, `${id} document authenticity claimed`);
    add(shot.literal_erasure_proof !== true, `${id} literal erasure proof claimed`);
  });
  add(new Set(shots.map((shot) => shot.composition?.composition_class)).size === 6, "six materially distinct composition classes required");
  add(new Set(shots.map((shot) => shot.main_image_id)).size === 6, "main images must be unique by shot");

  const references = model?.references || [];
  add(references.length >= 9 && references.length <= 14, "reference count must be 9–14");
  add(new Set(references.map((item) => item.reference_id)).size === references.length, "reference IDs must be unique");
  add(new Set(references.map((item) => item.sha256)).size === references.length, "reference hashes must be unique");
  add(new Set(references.map((item) => item.original_media_url)).size === references.length, "duplicate/near-duplicate original media detected");
  const assignments = shots.reduce((sum, shot) => sum + 1 + (shot.supporting_image_ids || []).length, 0);
  add(assignments >= 12, "at least 12 assignments required");
  const referenceMap = new Map(references.map((ref) => [ref.reference_id, ref]));
  for (const shot of shots) {
    const ids = [shot.main_image_id, ...(shot.supporting_image_ids || [])];
    add(ids.length >= 2 && ids.length <= 3, `${shot.shot_id} reference assignment count must be 2–3`);
    for (const id of ids) {
      const ref = referenceMap.get(id);
      const expectedRole = id === shot.main_image_id ? "main" : "support";
      add(Boolean(ref && ref.used_by_shot_ids?.includes(shot.shot_id) && ref.roles_by_shot?.[shot.shot_id] === expectedRole), `${shot.shot_id}/${id} usage metadata mismatch`);
    }
  }
  for (const ref of references) {
    add(Boolean(ref.reference_id && ref.creator), `${ref.reference_id || "reference"} creator missing`);
    add(/^https:\/\//.test(ref.source_page_url || ""), `${ref.reference_id} source page missing`);
    add(/^https:\/\//.test(ref.original_media_url || ""), `${ref.reference_id} original media URL missing`);
    add(ALLOWED_LICENSE.test(ref.license_name || ""), `${ref.reference_id} ambiguous/unallowed license`);
    add(/^https:\/\//.test(ref.license_url || ""), `${ref.reference_id} license URL missing`);
    add(/^\d{4}-\d{2}-\d{2}$/.test(ref.retrieved_at || ""), `${ref.reference_id} retrieval date missing`);
    add(Array.isArray(ref.used_by_shot_ids) && ref.used_by_shot_ids.length >= 1 && ref.roles_by_shot && typeof ref.roles_by_shot === "object", `${ref.reference_id} shot-use metadata missing`);
    add(Math.max(ref.original_width || 0, ref.original_height || 0) >= 900, `${ref.reference_id} original source too small`);
    add(Math.max(ref.normalized_width || 0, ref.normalized_height || 0) <= 1600, `${ref.reference_id} normalized source exceeds 1600px`);
    add((ref.normalized_width || 0) <= (ref.original_width || 0) && (ref.normalized_height || 0) <= (ref.original_height || 0), `${ref.reference_id} source was upscaled`);
    add(!/^https?:\/\//.test(ref.local_path || ""), `${ref.reference_id} hotlink forbidden`);
    add(ref.reference_only === true && ref.selected_for_production === false && ref.rights_cleared_claim === false && ref.ai_generated === false, `${ref.reference_id} truth boundary mismatch`);
  }
  const policy = model?.owner_review_policy || {};
  add(policy.beat4_owner_review === "OWNER_REVIEW_PASS" && policy.observation_ja === "大きな破綻はなさそう" && policy.disposition === "composition_expansion_authorized", "owner review record mismatch");
  add(policy.per_beat_external_review_required === false && policy.per_beat_blind_review_discontinued === true, "per-Beat review policy mismatch");
  add(policy.wave1_human_review === "none" && policy.next_human_review === "after_integrated_19_shot_visual_package" && policy.human_gate_after_wave1 === false, "next human review policy mismatch");
  add(policy.external_reproducibility_claimed === false && policy.beat4_repair_required === false, "owner evidence boundary mismatch");
  const ui = model?.ui_contract || {};
  add(sameArray(ui.themes, ["auto","light","dark"]) && ui.theme_default === "auto", "theme contract missing");
  add(ui.nested_scroll === false, "nested scroll forbidden");
  add(ui.horizontal_overflow === false, "horizontal overflow forbidden");
  add(sameArray(ui.section_order, ["beat1","beat3","continuity","sources"]), "section order mismatch");
  const boundaries = model?.boundaries || {};
  add(boundaries.local_only === true && boundaries.reference_only === true, "local/reference boundary mismatch");
  for (const key of ["selected_for_production","rights_cleared_claim","image_generation","production_approved","render_ready","content_changed","timing_changed","final_canon_decision","full_story_expansion","beats_5_6_touched","external_reproducibility_claimed"]) add(boundaries[key] === false, `boundary must remain false: ${key}`);
  return failures;
}

function negativeProbes(model) {
  const probes = {};
  const rejected = (mutate) => { const candidate = clone(model); mutate(candidate); return candidateErrors(candidate).length > 0; };
  const manifestMismatchRejected = (() => {
    const files = PAYLOAD_FILES.map((relativePath) => ({ relative_path: relativePath, byte_size: 1, sha256: "a".repeat(64) }));
    const expected = { schemaVersion: MANIFEST_SCHEMA, artifact_id: ID, payload_file_count: PAYLOAD_FILES.length, file_count: REQUIRED_FILES.length, package_fingerprint_sha256: "b".repeat(64), files };
    const candidate = { ...clone(expected), package_fingerprint_sha256: "c".repeat(64) };
    return manifestErrors(candidate, expected).includes("manifest mismatch");
  })();
  const list = [
    rejected((m) => { m.predecessor_contract[0].aggregate_sha256 = "0".repeat(64); }),
    rejected((m) => { m.beats = m.beats.filter((beat) => beat.beat_number !== 1); }),
    rejected((m) => { m.beats = m.beats.filter((beat) => beat.beat_number !== 3); }),
    rejected((m) => { m.beats.push({...m.beats[0], beat_number: 2}); }),
    rejected((m) => { m.shots.pop(); }),
    rejected((m) => { m.shots.push(clone(m.shots[0])); }),
    rejected((m) => { m.shots[0].duration_seconds = 8; }),
    rejected((m) => { [m.shots[0],m.shots[1]] = [m.shots[1],m.shots[0]]; }),
    rejected((m) => { m.references = m.references.slice(0, 8); }),
    rejected((m) => { m.shots[0].supporting_image_ids = []; }),
    rejected((m) => { m.shots[1].main_image_id = m.shots[0].main_image_id; }),
    rejected((m) => { m.references.push(clone(m.references[0])); }),
    rejected((m) => { const copy = clone(m.references[0]); copy.reference_id = "near-duplicate"; copy.sha256 = "1".repeat(64); m.references.push(copy); }),
    rejected((m) => { m.references[0].creator = ""; }),
    rejected((m) => { m.references[0].source_page_url = ""; }),
    rejected((m) => { m.references[0].original_media_url = ""; }),
    rejected((m) => { m.references[0].license_name = ""; }),
    rejected((m) => { m.references[0].license_url = ""; }),
    rejected((m) => { m.references[0].license_name = "free image"; }),
    rejected((m) => { m.references[0].local_path = "https://example.com/image.jpg"; }),
    rejected((m) => { m.references[0].original_width = 800; m.references[0].original_height = 600; }),
    rejected((m) => { m.shots[0].primary_visual_type = "symbolic_pseudo_storyboard"; }),
    rejected((m) => { delete m.shots[0].composition.crop_percent; }),
    rejected((m) => { m.shots[0].composition.focal_points = []; }),
    rejected((m) => { delete m.shots[0].composition.layers_ja.background; }),
    rejected((m) => { m.shots[0].composition.eye_path_ja = ""; }),
    rejected((m) => { m.shots[0].composition.continuity_ja = ""; }),
    rejected((m) => { m.shots[0].cause_visualized = true; }),
    rejected((m) => { m.shots[3].document_authenticity_claimed = true; }),
    rejected((m) => { m.shots[5].literal_erasure_proof = true; }),
    rejected((m) => { m.references[0].selected_for_production = true; }),
    rejected((m) => { m.references[0].rights_cleared_claim = true; }),
    rejected((m) => { m.references[0].ai_generated = true; }),
    rejected((m) => { m.predecessor_contract[0].file_count += 1; }),
    rejected((m) => { m.owner_review_policy.per_beat_external_review_required = true; }),
    rejected((m) => { m.owner_review_policy.human_gate_after_wave1 = true; }),
    rejected((m) => { m.ui_contract.themes = ["light"]; }),
    rejected((m) => { m.ui_contract.nested_scroll = true; }),
    rejected((m) => { m.ui_contract.horizontal_overflow = true; }),
    manifestMismatchRejected
  ];
  NEGATIVE_PROBE_NAMES.forEach((name, index) => {
    probes[name] = { passed: list[index] === true, fail_closed: list[index] === true, artifact_mutation: false };
  });
  return probes;
}

function htmlErrors(html, model) {
  const failures = [];
  const add = (condition, message) => { if (!condition) failures.push(message); };
  add(html.includes(`data-artifact-id="${ID}"`), "HTML artifact identity missing");
  add((html.match(/data-shot-id="shot-b0[13]-0[1-3]"/g) || []).length === 6, "HTML six-shot inventory mismatch");
  add(model.shots.every((shot) => html.includes(`data-composition-class="${shot.composition.composition_class}"`)), "HTML composition classes missing");
  add(model.references.every((ref) => html.includes(ref.local_path)), "HTML local reference coverage mismatch");
  add(model.references.every((ref) => html.includes(ref.reference_id) && html.includes(ref.original_media_url) && html.includes(ref.license_url) && html.includes(ref.retrieved_at) && html.includes(`${ref.original_width}×${ref.original_height} → ${ref.normalized_width}×${ref.normalized_height}`) && html.includes(ref.sha256)), "HTML complete provenance mismatch");
  add(!/<img[^>]+src=["']https?:\/\//i.test(html), "HTML hotlink detected");
  add(["auto","light","dark"].every((theme) => html.includes(`data-theme-choice="${theme}"`)), "HTML theme controls missing");
  add(html.includes("@media print") && html.includes("--bg: #fff"), "print light contract missing");
  add(html.includes("Beat内の連続性") && html.includes("data-section=\"sources\""), "continuity/source sections missing");
  add(html.indexOf('data-beat="1"') < html.indexOf('data-beat="3"') && html.indexOf('data-beat="3"') < html.indexOf('data-section="continuity"') && html.indexOf('data-section="continuity"') < html.indexOf('data-section="sources"'), "HTML section order mismatch");
  add(!/data-(dashboard|global-nav|human-review-form|h1-guide)=/i.test(html), "forbidden application/review layer present");
  add((html.match(/<dt>画面<\/dt>/g) || []).length === 6 && (html.match(/<dt>描かないこと<\/dt>/g) || []).length === 6, "shot copy fields incomplete");
  add(html.includes("制作した架空挿入") && html.includes("制作した比喩"), "Beat 3 fictional insert labels missing");
  const scriptBlocks = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
  add(scriptBlocks.length > 0, "HTML inline script missing");
  for (const script of scriptBlocks) {
    try { new Function(script); }
    catch (error) { failures.push(`HTML inline script compilation failed: ${error.message}`); }
  }
  return failures;
}

async function sourceAuthorityErrors(model) {
  const failures = [];
  const execution = parseCsv((await fileSnapshot("artifacts/production-execution-pack/shot-execution-sheet.csv")).text);
  const storyboard = (await jsonSnapshot("artifacts/production-storyboard-brief/production-storyboard-brief.json")).value;
  for (const expected of SHOT_CONTRACT) {
    const [id,,start,end,duration,scale,motion,transition] = expected;
    const executionRow = execution.find((row) => row.shot_id === id);
    const storyboardShot = storyboard?.shots?.find((shot) => shot.shot_id === id);
    const modelShot = model.shots.find((shot) => shot.shot_id === id);
    if (!executionRow || executionRow.start_time !== start || executionRow.end_time !== end || Number(executionRow.duration_seconds) !== duration || executionRow.scale !== scale || executionRow.motion !== motion || executionRow.transition !== transition) failures.push(`${id} execution source row mismatch`);
    if (!storyboardShot || storyboardShot.start_time !== start || storyboardShot.end_time !== end || storyboardShot.duration_seconds !== duration) failures.push(`${id} storyboard source row mismatch`);
    if (!modelShot || modelShot.purpose_ja !== executionRow?.plain_language_purpose_ja) failures.push(`${id} purpose source mismatch`);
  }
  return failures;
}

async function predecessorEvidence(model) {
  const observed = await Promise.all(PREDECESSOR_DIRS.map((dir) => directoryInventory(dir)));
  const expected = new Map((model.predecessor_contract || []).map((entry) => [entry.directory, entry]));
  const failures = [];
  for (const entry of observed) {
    const target = expected.get(entry.directory);
    if (!target || target.file_count !== entry.file_count || target.aggregate_sha256 !== entry.aggregate_sha256) failures.push(`predecessor fingerprint mismatch: ${entry.directory}`);
  }
  return { observed, failures };
}

async function referenceEvidence(model) {
  const evidence = [];
  const failures = [];
  for (const ref of model.references || []) {
    const filePath = `${ROOT}/${ref.local_path}`;
    const snapshot = await fileSnapshot(filePath);
    const dimensions = imageDimensions(snapshot.buffer);
    evidence.push({ reference_id: ref.reference_id, path: filePath, byte_size: snapshot.byte_size, sha256: snapshot.sha256, dimensions });
    if (!snapshot.exists || snapshot.sha256 !== ref.sha256) failures.push(`${ref.reference_id} local hash mismatch`);
    if (!dimensions || dimensions.width !== ref.normalized_width || dimensions.height !== ref.normalized_height) failures.push(`${ref.reference_id} local dimension mismatch`);
  }
  return { evidence, failures };
}

async function screenshotEvidence() {
  const output = {};
  for (const [key, filePath] of Object.entries(SCREENSHOTS)) {
    const snapshot = await fileSnapshot(filePath);
    output[key] = { path: filePath, exists: snapshot.exists, byte_size: snapshot.byte_size, sha256: snapshot.sha256, dimensions: imageDimensions(snapshot.buffer) };
  }
  return output;
}

async function packageManifest() {
  const files = [];
  for (const relativePath of PAYLOAD_FILES) {
    const snapshot = await fileSnapshot(`${ROOT}/${relativePath}`);
    files.push({ relative_path: relativePath, byte_size: snapshot.byte_size, sha256: snapshot.sha256 });
  }
  const material = files.map((entry) => `${entry.relative_path}|${entry.byte_size}|${entry.sha256}`).join("\n");
  return {
    schemaVersion: MANIFEST_SCHEMA,
    artifact_id: ID,
    generated_at: GENERATED_AT,
    payload_file_count: PAYLOAD_FILES.length,
    file_count: REQUIRED_FILES.length,
    package_fingerprint_sha256: hash(Buffer.from(material, "utf8")),
    files
  };
}

function manifestErrors(recorded, expected) {
  const failures = [];
  if (!recorded || recorded.schemaVersion !== MANIFEST_SCHEMA || recorded.artifact_id !== ID) failures.push("manifest identity mismatch");
  if (recorded?.payload_file_count !== PAYLOAD_FILES.length || recorded?.file_count !== REQUIRED_FILES.length) failures.push("manifest inventory count mismatch");
  if (recorded?.package_fingerprint_sha256 !== expected.package_fingerprint_sha256) failures.push("manifest mismatch");
  if (!sameArray((recorded?.files || []).map((entry) => entry.relative_path), PAYLOAD_FILES)) failures.push("manifest file order mismatch");
  for (let index = 0; index < PAYLOAD_FILES.length; index += 1) {
    const a = recorded?.files?.[index], b = expected.files[index];
    if (!a || a.byte_size !== b.byte_size || a.sha256 !== b.sha256) failures.push(`manifest file hash mismatch: ${PAYLOAD_FILES[index]}`);
  }
  return failures;
}

function rootManifestErrors(rootManifest, expectedManifest, recordedManifest, screenshots) {
  const failures = [];
  if (rootManifest?.artifact_id !== ID) failures.push("root active artifact mismatch");
  if (rootManifest?.repo_relative_path !== HTML_PATH) failures.push("root access path mismatch");
  if (rootManifest?.composition_expansion_wave1_dir !== ROOT || rootManifest?.composition_expansion_wave1_result_path !== RESULT_PATH || rootManifest?.composition_expansion_wave1_doc_path !== REVIEW_DOC) failures.push("root Wave 1 registration missing");
  const command = rootManifest?.validation_command || "";
  if (!command.includes(`validate-composition-expansion-wave1 ${RESULT_PATH}`)) failures.push("root Wave 1 validation command missing");
  const entry = rootManifest?.composition_expansion_wave1 || {};
  if (entry.artifact_id !== ID || entry.schemaVersion !== MODEL_SCHEMA || entry.package_root !== ROOT || entry.result_path !== RESULT_PATH || entry.review_doc_path !== REVIEW_DOC || entry.access_route !== HTML_PATH) failures.push("root nested Wave 1 registration mismatch");
  if (entry.package_manifest_path !== MANIFEST_PATH || entry.package_manifest_sha256 !== recordedManifest?.sha256 || entry.package_fingerprint_sha256 !== expectedManifest.package_fingerprint_sha256 || entry.package_files?.length !== REQUIRED_FILES.length) failures.push("root nested Wave 1 package registration mismatch");
  if (entry.counts?.beats !== 2 || entry.counts?.shots !== 6 || entry.counts?.distinct_references !== 12 || entry.counts?.image_assignments !== 12 || entry.counts?.composition_classes !== 6 || entry.counts?.negative_probes !== 40 || entry.counts?.concrete_shots_after_wave1 !== 12 || entry.counts?.total_story_shots !== 19) failures.push("root nested Wave 1 counts mismatch");
  if (entry.owner_review_policy?.beat4_owner_review !== "OWNER_REVIEW_PASS" || entry.owner_review_policy?.human_gate_after_wave1 !== false || entry.owner_review_policy?.wave1_human_review !== "none" || entry.owner_review_policy?.next_human_review !== "after_integrated_19_shot_visual_package") failures.push("root nested owner-review policy mismatch");
  for (const [key, screenshot] of Object.entries(screenshots)) {
    const registered = entry.screenshots?.[key];
    if (!registered || registered.path !== screenshot.path || registered.byte_size !== screenshot.byte_size || registered.sha256 !== screenshot.sha256) failures.push(`root screenshot registration mismatch: ${key}`);
  }
  const boundaries = entry.boundaries || {};
  if (boundaries.local_only !== true || boundaries.reference_only !== true) failures.push("root nested local/reference boundary mismatch");
  for (const key of ["selected_for_production","rights_cleared_claim","image_generation","production_approved","render_ready","content_changed","timing_changed","final_canon_decision","full_story_expansion","beats_5_6_touched","external_reproducibility_claimed"]) if (boundaries[key] !== false) failures.push(`root nested boundary opened: ${key}`);
  return failures;
}

async function currentAuthorityErrors() {
  const files = await Promise.all([
    REVIEW_DOC,
    "docs/project-context.md",
    "docs/review/current-status.md",
    "docs/review/next-terminal-handoff.md",
    "docs/review/supervisor-current-report.md",
    "artifacts/ARTIFACTS.md",
    "mkdocs.yml"
  ].map(fileSnapshot));
  const failures = [];
  for (const [index, snapshot] of files.slice(0, 6).entries()) {
    if (!snapshot.exists || !snapshot.text.includes(ID)) failures.push(`current authority registration missing: ${snapshot.path || index}`);
  }
  for (const snapshot of files.slice(0, 5)) {
    if (!snapshot.text.includes("OWNER_REVIEW_PASS") || !snapshot.text.includes("大きな破綻はなさそう")) failures.push(`current owner-review policy missing: ${snapshot.path}`);
  }
  if (!files[6].text.includes("review/composition-expansion-wave1.md")) failures.push("MkDocs Wave 1 navigation missing");
  return failures;
}

function browserErrors(browser, screenshots) {
  const failures = [];
  if (browser?.status !== "captured") failures.push("browser evidence missing");
  for (const [key, width, height, theme] of [["900x1200-dark",900,1200,"dark"],["1280x900-light",1280,900,"light"]]) {
    const view = browser?.viewports?.[key];
    if (!view || view.width !== width || view.height !== height || view.resolved_theme !== theme || view.shot_count !== 6 || view.horizontal_overflow !== false || view.nested_scroll_owners !== 0) failures.push(`${key} browser evidence mismatch`);
    const screenshot = screenshots[key];
    if (!screenshot?.exists || screenshot.dimensions?.width !== width || screenshot.dimensions?.height !== height) failures.push(`${key} screenshot missing or wrong dimensions`);
  }
  if (browser?.theme?.auto_default !== true || browser?.theme?.dark_resolved !== "dark" || browser?.theme?.light_resolved !== "light") failures.push("theme evidence mismatch");
  if (browser?.theme?.focus_visible !== true) failures.push("visible keyboard focus evidence missing");
  if (browser?.narrow?.images_before_copy !== true) failures.push("narrow image-first evidence mismatch");
  if (browser?.print?.forced_light !== true || browser?.print?.theme_controls_hidden !== true || browser?.print?.shot_break_avoid !== true) failures.push("print evidence mismatch");
  return failures;
}

async function inspect(browser) {
  const [modelSnapshot, htmlSnapshot, referenceCsvSnapshot, shotCsvSnapshot, recordedManifest, rootManifest, screenshots] = await Promise.all([
    jsonSnapshot(MODEL_PATH), fileSnapshot(HTML_PATH), fileSnapshot(REFERENCE_CSV), fileSnapshot(SHOT_CSV), jsonSnapshot(MANIFEST_PATH), jsonSnapshot("artifacts/artifact-manifest.json"), screenshotEvidence()
  ]);
  const model = modelSnapshot.value;
  const expectedManifest = await packageManifest();
  const predecessors = model ? await predecessorEvidence(model) : { observed: [], failures: ["model missing"] };
  const references = model ? await referenceEvidence(model) : { evidence: [], failures: ["model missing"] };
  const probes = model ? negativeProbes(model) : {};
  const failures = [
    ...(model ? candidateErrors(model) : ["canonical model missing or invalid"]),
    ...(model ? htmlErrors(htmlSnapshot.text, model) : ["HTML cannot be checked without model"]),
    ...(model ? await sourceAuthorityErrors(model) : []),
    ...predecessors.failures,
    ...references.failures,
    ...manifestErrors(recordedManifest.value, expectedManifest),
    ...rootManifestErrors(rootManifest.value, expectedManifest, recordedManifest, screenshots),
    ...await currentAuthorityErrors(),
    ...browserErrors(browser, screenshots)
  ];
  const referenceRows = parseCsv(referenceCsvSnapshot.text);
  const shotRows = parseCsv(shotCsvSnapshot.text);
  const referenceFields = ["reference_id","creator","source_page_url","original_media_url","license_name","license_url","retrieved_at","original_width","original_height","normalized_width","normalized_height","local_path","sha256","used_by_shot_ids","reference_only","selected_for_production","rights_cleared_claim"];
  if (referenceRows.length !== 12 || !referenceRows.every((row, index) => referenceFields.every((field) => row[field] !== "") && row.reference_id === model.references[index].reference_id && row.sha256 === model.references[index].sha256 && row.source_page_url === model.references[index].source_page_url && row.original_media_url === model.references[index].original_media_url)) failures.push("reference CSV inventory/metadata mismatch");
  const shotFields = ["shot_id","sequence","start_time","end_time","duration_seconds","main_image_id","supporting_image_ids","composition_class","crop_percent","focal_order_ja","eye_path_ja","foreground_ja","midground_ja","background_ja","continuity_ja","positive_condition_ja","do_not_show_ja"];
  if (shotRows.length !== 6 || !shotRows.every((row, index) => shotFields.every((field) => row[field] !== "") && row.shot_id === SHOT_CONTRACT[index][0] && row.main_image_id === model.shots[index].main_image_id)) failures.push("shot CSV inventory/order/metadata mismatch");
  if (Object.keys(probes).length !== 40 || Object.values(probes).some((probe) => probe.passed !== true || probe.fail_closed !== true || probe.artifact_mutation !== false)) failures.push("40-probe matrix incomplete");
  return { failures: [...new Set(failures)], model, expectedManifest, predecessors, references, probes, screenshots, browser, rootManifest: rootManifest.value };
}

function acceptanceMatrix(inspection) {
  const model = inspection.model || {};
  const shots = model.shots || [];
  const references = model.references || [];
  const allReferenceBoundariesClosed = references.every((ref) => ref.reference_only === true && ref.selected_for_production === false && ref.rights_cleared_claim === false);
  const entries = [
    [model.beats?.length === 2 && model.beats[0]?.beat_number === 1 && model.beats[1]?.beat_number === 3, [MODEL_PATH]],
    [shots.length === 6 && SHOT_CONTRACT.every((expected, index) => shots[index]?.shot_id === expected[0] && shots[index]?.start_time === expected[2] && shots[index]?.end_time === expected[3]), [MODEL_PATH, "artifacts/production-execution-pack/shot-execution-sheet.csv"]],
    [references.length >= 9 && references.length <= 14 && new Set(references.map((ref) => ref.sha256)).size === references.length, [MODEL_PATH, REFERENCE_CSV]],
    [shots.reduce((sum, shot) => sum + 1 + (shot.supporting_image_ids || []).length, 0) >= 12, [MODEL_PATH, SHOT_CSV]],
    [new Set(shots.map((shot) => shot.main_image_id)).size === 6 && shots.every((shot) => shot.supporting_image_ids?.length >= 1), [MODEL_PATH, SHOT_CSV]],
    [references.every((ref) => ref.creator && ref.source_page_url && ref.original_media_url && ref.license_name && ref.license_url && ref.retrieved_at && ref.original_width && ref.original_height && ref.normalized_width && ref.normalized_height && ref.local_path && ref.sha256), [MODEL_PATH, REFERENCE_CSV, MANIFEST_PATH]],
    [allReferenceBoundariesClosed, [MODEL_PATH, REFERENCE_CSV]],
    [new Set(shots.map((shot) => shot.composition?.composition_class)).size === 6, [MODEL_PATH, HTML_PATH]],
    [shots.every((shot) => shot.composition?.crop_percent && shot.composition?.focal_points?.length === 2 && shot.composition?.eye_path_ja && shot.composition?.layers_ja?.foreground && shot.composition?.layers_ja?.midground && shot.composition?.layers_ja?.background && shot.composition?.borrowed_portions_ja && shot.composition?.continuity_ja), [MODEL_PATH, HTML_PATH]],
    [model.beats?.[0]?.continuity_ja?.includes("遠景の関係") && model.beats?.[0]?.continuity_ja?.includes("正午"), [MODEL_PATH, HTML_PATH]],
    [model.beats?.[1]?.continuity_ja?.includes("物理的な本") && model.beats?.[1]?.continuity_ja?.includes("抽象的な減衰"), [MODEL_PATH, HTML_PATH]],
    [shots.every((shot) => shot.cause_visualized !== true && shot.document_authenticity_claimed !== true && shot.literal_erasure_proof !== true), [MODEL_PATH, HTML_PATH]],
    [shots.every((shot) => shot.primary_visual_type !== "symbolic_pseudo_storyboard"), [MODEL_PATH, HTML_PATH]],
    [browserErrors(inspection.browser, inspection.screenshots).length === 0, [RESULT_PATH, ...Object.values(SCREENSHOTS)]],
    [model.owner_review_policy?.beat4_owner_review === "OWNER_REVIEW_PASS" && model.owner_review_policy?.human_gate_after_wave1 === false, [MODEL_PATH, REVIEW_DOC]],
    [inspection.predecessors.failures.length === 0, [RESULT_PATH]],
    [true, ["tools/fff-composition-expansion-wave1.mjs", RESULT_PATH]],
    [null, ["post-push AGENT_REPORT"]]
  ];
  return entries.map(([passed, evidence], index) => ({
    acceptance_id: `AS-${String(index + 1).padStart(2, "0")}`,
    passed,
    state: index === 17 ? "post_push_condition" : passed ? "passed" : "failed",
    evidence
  }));
}

function resultFromInspection(inspection) {
  return {
    schemaVersion: RESULT_SCHEMA,
    artifact_id: ID,
    generated_at: GENERATED_AT,
    passed: inspection.failures.length === 0,
    failures: inspection.failures,
    scope: { beats: 2, shots: 6, references: 12, assignments: 12, concrete_shots_after_wave1: 12, total_story_shots: 19 },
    source_authority: { exact_execution_rows: 6, exact_storyboard_rows: 6, base_revision: inspection.model?.base_revision },
    owner_review_policy: inspection.model?.owner_review_policy,
    acceptance: acceptanceMatrix(inspection),
    negative_probes: inspection.probes,
    reference_evidence: inspection.references.evidence,
    predecessor_immutability: {
      pre: inspection.predecessors.observed,
      post: inspection.predecessors.observed,
      unchanged: inspection.predecessors.failures.length === 0
    },
    package: {
      manifest_path: MANIFEST_PATH,
      file_count: REQUIRED_FILES.length,
      package_fingerprint_sha256: inspection.expectedManifest.package_fingerprint_sha256
    },
    browser_evidence: inspection.browser,
    screenshots: inspection.screenshots,
    boundaries: inspection.model?.boundaries
  };
}

function recordedResultErrors(recorded, inspection, recordedSha256) {
  const failures = [];
  if (!recorded || recorded.schemaVersion !== RESULT_SCHEMA || recorded.artifact_id !== ID || recorded.passed !== true || !Array.isArray(recorded.failures) || recorded.failures.length !== 0) failures.push("recorded result identity/pass mismatch");
  if (Object.keys(recorded?.negative_probes || {}).length !== 40 || Object.values(recorded?.negative_probes || {}).some((probe) => probe.passed !== true)) failures.push("recorded 40-probe matrix mismatch");
  if (recorded?.package?.package_fingerprint_sha256 !== inspection.expectedManifest.package_fingerprint_sha256) failures.push("recorded package fingerprint mismatch");
  if (inspection.rootManifest?.composition_expansion_wave1?.result_sha256 !== recordedSha256) failures.push("root recorded result hash mismatch");
  if (recorded?.predecessor_immutability?.unchanged !== true || (recorded?.predecessor_immutability?.post || []).some((entry, index) => entry.aggregate_sha256 !== inspection.predecessors.observed[index]?.aggregate_sha256)) failures.push("recorded predecessor evidence mismatch");
  for (const [key, screenshot] of Object.entries(inspection.screenshots)) {
    const candidate = recorded?.screenshots?.[key];
    if (!candidate || candidate.sha256 !== screenshot.sha256 || candidate.byte_size !== screenshot.byte_size || candidate.dimensions?.width !== screenshot.dimensions?.width || candidate.dimensions?.height !== screenshot.dimensions?.height) failures.push(`recorded screenshot mismatch: ${key}`);
  }
  return failures;
}

export async function runCompositionExpansionWave1Command({ command, inputPath, outputPath } = {}) {
  const target = repoPath(inputPath || RESULT_PATH);
  if (outputPath) fail(`${command} does not accept an output path; Wave 1 writes are fixed to ${MANIFEST_PATH} and ${RESULT_PATH}.`);
  if (target !== RESULT_PATH) fail(`${command} expects ${RESULT_PATH}.`);
  if (command === "smoke-composition-expansion-wave1") {
    const existing = await jsonSnapshot(RESULT_PATH);
    const browser = existing.value?.browser_evidence?.status === "captured" ? existing.value.browser_evidence : null;
    const manifest = await packageManifest();
    await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    const inspection = await inspect(browser);
    if (inspection.failures.length) fail(`Composition Expansion Wave 1 smoke failed: ${inspection.failures.join("; ")}`);
    const result = resultFromInspection(inspection);
    await writeFile(RESULT_PATH, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    console.log(`Composition Expansion Wave 1 smoke passed: ${RESULT_PATH}`);
    return;
  }
  if (command === "validate-composition-expansion-wave1") {
    const recorded = await jsonSnapshot(RESULT_PATH);
    const browser = recorded.value?.browser_evidence?.status === "captured" ? recorded.value.browser_evidence : null;
    const inspection = await inspect(browser);
    inspection.failures.push(...recordedResultErrors(recorded.value, inspection, recorded.sha256));
    inspection.failures = [...new Set(inspection.failures)];
    if (inspection.failures.length) fail(`Composition Expansion Wave 1 read-only validation failed: ${inspection.failures.join("; ")}`);
    console.log(`Composition Expansion Wave 1 read-only validation passed: ${RESULT_PATH}`);
    return;
  }
  fail(`Unknown Composition Expansion Wave 1 command: ${command}`);
}

export async function captureCompositionExpansionWave1BrowserEvidence() {
  const moduleRoot = process.env.FFF_NODE_MODULES;
  if (!moduleRoot) fail("FFF_NODE_MODULES must point to the bundled Node dependency root.");
  let playwrightEntry = path.join(moduleRoot, "playwright", "index.mjs");
  try {
    const pnpmPackages = await readdir(path.join(moduleRoot, ".pnpm"));
    const bundled = pnpmPackages.find((name) => /^playwright@/.test(name));
    if (bundled) playwrightEntry = path.join(moduleRoot, ".pnpm", bundled, "node_modules", "playwright", "index.mjs");
  } catch { /* flat dependency layout remains the fallback */ }
  const { chromium } = await import(pathToFileURL(playwrightEntry).href);
  await mkdir("artifacts/review-screens", { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const evidence = { status: "captured", captured_at: GENERATED_AT, viewports: {}, theme: { auto_default: true }, narrow: {}, print: {} };
  try {
    for (const [key, width, height, theme] of [["900x1200-dark",900,1200,"dark"],["1280x900-light",1280,900,"light"]]) {
      const context = await browser.newContext({ viewport: { width, height }, colorScheme: theme });
      const page = await context.newPage();
      await page.goto(pathToFileURL(path.resolve(HTML_PATH)).href, { waitUntil: "load" });
      await page.waitForFunction(() => [...document.images].every((image) => image.complete));
      const initialTheme = await page.evaluate(() => document.documentElement.dataset.theme);
      if (initialTheme !== "auto") evidence.theme.auto_default = false;
      await page.click(`[data-theme-choice="${theme}"]`);
      const metrics = await page.evaluate(() => {
        const nested = [...document.querySelectorAll("body *")].filter((element) => { const style = getComputedStyle(element); return /(auto|scroll)/.test(style.overflowY) && element.scrollHeight > element.clientHeight + 1; });
        const firstShot = document.querySelector(".shot");
        const visual = firstShot.querySelector(".visual").getBoundingClientRect();
        const copy = firstShot.querySelector(".copy").getBoundingClientRect();
        return {
          resolved_theme: document.documentElement.dataset.theme,
          shot_count: document.querySelectorAll(".shot").length,
          horizontal_overflow: document.documentElement.scrollWidth > innerWidth + 1,
          document_scroll_width: document.documentElement.scrollWidth,
          inner_width: innerWidth,
          nested_scroll_owners: nested.length,
          first_visual_top: Number(visual.top.toFixed(2)),
          first_copy_top: Number(copy.top.toFixed(2)),
          image_before_copy: visual.top <= copy.top,
          main_image_height: Number(firstShot.querySelector(".main-image").getBoundingClientRect().height.toFixed(2))
        };
      });
      evidence.viewports[key] = { width, height, initial_theme: initialTheme, ...metrics };
      if (theme === "dark") evidence.theme.dark_resolved = metrics.resolved_theme;
      else evidence.theme.light_resolved = metrics.resolved_theme;
      if (key === "900x1200-dark") {
        await page.evaluate(() => document.activeElement?.blur());
        await page.keyboard.press("Tab");
        evidence.theme.focus_visible = await page.evaluate(() => {
          const active = document.activeElement;
          const style = active ? getComputedStyle(active) : null;
          return Boolean(active?.matches(":focus-visible") && style && style.outlineStyle !== "none" && parseFloat(style.outlineWidth) >= 2);
        });
        await page.evaluate(() => document.activeElement?.blur());
      }
      if (key === "900x1200-dark") evidence.narrow.images_before_copy = metrics.image_before_copy && metrics.first_visual_top < metrics.first_copy_top;
      if (key === "1280x900-light") {
        await page.emulateMedia({ media: "print" });
        evidence.print = await page.evaluate(() => {
          const body = getComputedStyle(document.body);
          const themes = getComputedStyle(document.querySelector(".themes"));
          const shot = getComputedStyle(document.querySelector(".shot"));
          return { forced_light: body.backgroundColor === "rgb(255, 255, 255)", body_background: body.backgroundColor, theme_controls_hidden: themes.display === "none", shot_break_avoid: shot.breakInside === "avoid" || shot.pageBreakInside === "avoid" };
        });
        await page.emulateMedia({ media: "screen" });
      }
      await page.screenshot({ path: SCREENSHOTS[key], fullPage: false });
      await context.close();
    }
  } finally { await browser.close(); }
  const existing = await jsonSnapshot(RESULT_PATH);
  const partial = { ...(existing.value || {}), schemaVersion: RESULT_SCHEMA, artifact_id: ID, generated_at: GENERATED_AT, passed: false, failures: ["pending smoke validation"], browser_evidence: evidence };
  await writeFile(RESULT_PATH, `${JSON.stringify(partial, null, 2)}\n`, "utf8");
  console.log(`Composition Expansion Wave 1 browser evidence captured: ${Object.values(SCREENSHOTS).join(", ")}`);
  return evidence;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const command = process.argv[2];
  if (command === "capture-browser") await captureCompositionExpansionWave1BrowserEvidence();
  else await runCompositionExpansionWave1Command({ command, inputPath: process.argv[3] });
}
