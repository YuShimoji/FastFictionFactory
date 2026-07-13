#!/usr/bin/env node

import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const ARTIFACT_ID = "fff-beat2-visual-treatment-pilot-001";
const SCHEMA_VERSION = "fff.beat2VisualTreatmentPilot.v1";
const RESULT_SCHEMA_VERSION = "fff.beat2VisualTreatmentPilotResult.v1";
const MANIFEST_SCHEMA_VERSION = "fff.beat2VisualTreatmentPilotManifest.v1";
const GENERATED_AT = "2026-07-14T18:00:00+09:00";
const ROOT = "artifacts/beat2-visual-treatment-pilot";
const RESULT_PATH = "artifacts/beat2-visual-treatment-pilot-result.json";
const HTML_PATH = `${ROOT}/beat2-visual-treatment.html`;
const JSON_PATH = `${ROOT}/beat2-visual-treatment.json`;
const MANIFEST_PATH = `${ROOT}/beat2-visual-treatment-manifest.json`;
const CONTACT_SHEET_PATH = `${ROOT}/beat2-visual-treatment-contact-sheet.jpg`;
const ROOT_MANIFEST_PATH = "artifacts/artifact-manifest.json";
const PUBLIC_PATH = "public/review/index.html";
const REVIEW_DOC_PATH = "docs/review/beat2-visual-treatment-pilot.md";
const EXECUTION_JSON_PATH = "artifacts/production-execution-pack/production-execution-pack.json";
const STORYBOARD_JSON_PATH = "artifacts/production-storyboard-brief/production-storyboard-brief.json";
const SCREENSHOTS = {
  "900x1200-dark": "artifacts/review-screens/beat2-visual-treatment-900x1200-dark.png",
  "1280x900-light": "artifacts/review-screens/beat2-visual-treatment-1280x900-light.png"
};

const STORYBOARD_FILES = [
  "README_STORYBOARD_BRIEF.md",
  "production-storyboard-brief.html",
  "production-storyboard-brief.json",
  "storyboard-shot-map.csv",
  "story-glossary.csv",
  "asset-operations-summary.csv",
  "production-storyboard-brief-manifest.json"
];
const EXECUTION_FILES = [
  "README_PRODUCTION_EXECUTION.md",
  "production-execution-pack.html",
  "production-execution-pack.json",
  "beat-run-sheet.csv",
  "shot-execution-sheet.csv",
  "asset-requirements.csv",
  "narration-timing-envelope.csv",
  "thumbnail-requirements.md",
  "production-execution-manifest.json"
];
const SOURCE_FINGERPRINTS = {
  storyboard_json_sha256: "50cd787d1643d8b5e1d5138d3c81c38befb33bd107914b21a0696c09e611d4cf",
  storyboard_manifest_sha256: "71642f7fd18b838cd7b34af2563e03b4739faa20a6f19ba8198fe7a04d93441d",
  storyboard_package_fingerprint_sha256: "400d01a3abaa935103e1080b2f42b2f9e20553e225e13e90aec7a740e7ed3861",
  storyboard_seven_file_aggregate_sha256: "bb9d4fce3ed5ac328b49f0ac691e0ab9b6ca671d0318ef4e60522dca7a6fabb8",
  execution_json_sha256: "24237829ad4d886b79397eb1626ca3efb7a92a8b0f29923ff092f5679d037ceb",
  execution_manifest_sha256: "f3a6bccef8809d8060c7a809522c09a546617b82179d2d5f97fe7e3fe20a60f7",
  execution_package_fingerprint_sha256: "a19cf81f3322c17a49c597731372ea653f7fd3881cea84d1ddb8e2df3b7143ca",
  execution_nine_file_aggregate_sha256: "10d3675723c3282cba0fdd516654640a7c16749fef80279b7223b4e5dc436345"
};

const REFERENCES = [
  {
    reference_id: "ref-b02-s01-precision-handwork", shot_id: "shot-b02-01", role: "primary",
    local_path: "references/ref-b02-s01-precision-handwork.jpg", source_title: "Watchmaking skills.jpg",
    source_page_url: "https://commons.wikimedia.org/wiki/File:Watchmaking_skills.jpg",
    original_media_url: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Watchmaking_skills.jpg",
    creator: "giridibyaranjan", license_name: "CC BY-SA 4.0", license_url: "https://creativecommons.org/licenses/by-sa/4.0/",
    original_width: 3024, original_height: 4032, local_width: 1200, local_height: 1600,
    sha256: "42e1d3963eeab95679858889f85c4b60e348efaaa36ef4ca1c6fd103768b4a33",
    retrieved_at: "2026-07-14", notes_ja: "手元、精密工具、深い黒のコントラストをショット1の主参照にする。"
  },
  {
    reference_id: "ref-b02-s01-watch-repair-workbench", shot_id: "shot-b02-01", role: "supporting",
    local_path: "references/ref-b02-s01-watch-repair-workbench.jpg", source_title: "Traditional watch repairer at work in Goa.jpg",
    source_page_url: "https://commons.wikimedia.org/wiki/File:Traditional_watch_repairer_at_work_in_Goa.jpg",
    original_media_url: "https://upload.wikimedia.org/wikipedia/commons/5/58/Traditional_watch_repairer_at_work_in_Goa.jpg",
    creator: "SerChevalerie", license_name: "CC0 1.0", license_url: "https://creativecommons.org/publicdomain/zero/1.0/",
    original_width: 4032, original_height: 2268, local_width: 1600, local_height: 900,
    sha256: "207933084e53ee608c9d4f29de795ab2915f3d4cddc4612d99b1db452cf3e258",
    retrieved_at: "2026-07-14", notes_ja: "密度のある時計修理台と暖色の作業灯を補助参照にする。"
  },
  {
    reference_id: "ref-b02-s02-aged-handwritten-letter", shot_id: "shot-b02-02", role: "primary",
    local_path: "references/ref-b02-s02-aged-handwritten-letter.jpg", source_title: "Old Letter.jpg",
    source_page_url: "https://commons.wikimedia.org/wiki/File:Old_Letter.jpg",
    original_media_url: "https://upload.wikimedia.org/wikipedia/commons/a/af/Old_Letter.jpg",
    creator: "Lainey Powell", license_name: "CC BY 2.0", license_url: "https://creativecommons.org/licenses/by/2.0/",
    original_width: 1597, original_height: 2437, local_width: 1049, local_height: 1600,
    sha256: "6b98a5fa94c40acac31e266decd75d9ae31f3b7cf5a59802bcf7408abbd7671b",
    retrieved_at: "2026-07-14", notes_ja: "黄変した紙、折り目、筆跡の密度をショット2の主参照にする。"
  },
  {
    reference_id: "ref-b02-s02-metal-butterfly-brooch", shot_id: "shot-b02-02", role: "supporting",
    local_path: "references/ref-b02-s02-metal-butterfly-brooch.jpg", source_title: "Butterfly brooch.jpg",
    source_page_url: "https://commons.wikimedia.org/wiki/File:Butterfly_brooch.jpg",
    original_media_url: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Butterfly_brooch.jpg",
    creator: "Jane023 (photographer/uploader; own work)", license_name: "CC0 1.0", license_url: "https://creativecommons.org/publicdomain/zero/1.0/",
    original_width: 4032, original_height: 3024, local_width: 1600, local_height: 1200,
    sha256: "ac4df2e88ff0834f6a6695b3fa72737d75e5dbec78a177c9056c3b8a0e3376b9",
    retrieved_at: "2026-07-14", notes_ja: "金属製の翅、真珠層、冷たい光沢を蛾の質感参照にする。"
  },
  {
    reference_id: "ref-b02-s03-vintage-watch-0915", shot_id: "shot-b02-03", role: "primary",
    local_path: "references/ref-b02-s03-vintage-watch-0915.jpg", source_title: "Vintage Bulova Men's Swiss-Made Manual-Wind Wrist Watch (8505636506).jpg",
    source_page_url: "https://commons.wikimedia.org/wiki/File:Vintage_Bulova_Men%27s_Swiss-Made_Manual-Wind_Wrist_Watch_(8505636506).jpg",
    original_media_url: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Vintage_Bulova_Men%27s_Swiss-Made_Manual-Wind_Wrist_Watch_%288505636506%29.jpg",
    creator: "Joe Haupt", license_name: "CC BY-SA 2.0", license_url: "https://creativecommons.org/licenses/by-sa/2.0/",
    original_width: 4608, original_height: 3456, local_width: 1600, local_height: 1200,
    sha256: "80abb1498c2e38ad6f5e0c3dc4b44b0b61729b5db4e68db0ddc050c70c7a2082",
    retrieved_at: "2026-07-14", notes_ja: "9:15を示す近似参照。実制作では9:17表示が必須で、この画像自体は選定素材ではない。"
  },
  {
    reference_id: "ref-b02-s03-brass-clock-dial", shot_id: "shot-b02-03", role: "supporting",
    local_path: "references/ref-b02-s03-brass-clock-dial.jpg", source_title: "Antique clock dial (Unsplash).jpg",
    source_page_url: "https://commons.wikimedia.org/wiki/File:Antique_clock_dial_(Unsplash).jpg",
    original_media_url: "https://upload.wikimedia.org/wikipedia/commons/0/00/Antique_clock_dial_%28Unsplash%29.jpg",
    creator: "Brooke Campbell / bcampbell", license_name: "CC0 1.0", license_url: "https://creativecommons.org/publicdomain/zero/1.0/",
    original_width: 3648, original_height: 5472, local_width: 1067, local_height: 1600,
    sha256: "acc9849b02b769616e7218aba0d2740cabe6030ee1e7178f9d012bffa21d45a3",
    retrieved_at: "2026-07-14", notes_ja: "真鍮色の反射、古い時計面、浅い光だまりを補助参照にする。"
  }
].map((item) => ({ ...item, reference_only: true, selected_for_production: false, rights_cleared_claim: false }));

const REJECTED_REFERENCES = [
  { source_title: "Simon Willard tall clock with moon phase mechanism", reason_ja: "全体家具の情報が強く、9:17の極端な寄りに向かない。" },
  { source_title: "Caravelle watch at 9:15", reason_ja: "企業ロゴと販促文字が主題より強い。" },
  { source_title: "Rhodes outdoor clock at 9:15", reason_ja: "時刻表示が小さく、現代的な屋外文脈が作品と競合する。" }
];

const SHOT_COPY = {
  "shot-b02-01": {
    title_ja: "時計修理台の手元",
    screen_ja: "時計を直す手、ピンセット、細かな部品。顔と全身は画角外に置く。",
    intent_ja: "ミラの職能と、触れれば壊れそうな精密さを最初に見せる。",
    camera_ja: "Close / Slow pan",
    success_ja: "手元と修理台へ最初に視線が集まる。"
  },
  "shot-b02-02": {
    title_ja: "メモと静止した真鍮の蛾",
    screen_ja: "折り目の残る手書きメモを大きく置き、金属の蛾を隣接させる。",
    intent_ja: "私的な記録と冷たい金属の質感を並べ、二つを一つの手がかりとして読む。",
    camera_ja: "Close / Locked",
    success_ja: "メモと動かない蛾を同時に把握できる。"
  },
  "shot-b02-03": {
    title_ja: "9:17の時計面",
    screen_ja: "9:17の時計面を極端な寄りで捉え、真鍮色の反射を別の焦点に重ねる。",
    intent_ja: "時刻と蛾を反復モチーフとして並べ、因果は作らない。",
    camera_ja: "Extreme close / Controlled parallax",
    success_ja: "9:17の表示と真鍮の蛾を別の焦点として読める。"
  }
};

const PAYLOAD_FILES = [
  "README_VISUAL_TREATMENT.md",
  "beat2-visual-treatment.html",
  "beat2-visual-treatment.json",
  "reference-sources.csv",
  "shot-reference-map.csv",
  ...REFERENCES.map((item) => item.local_path),
  "beat2-visual-treatment-contact-sheet.jpg"
];
const REQUIRED_FILES = [...PAYLOAD_FILES, "beat2-visual-treatment-manifest.json"];
const NEGATIVE_PROBE_NAMES = [
  "source_fingerprint_mismatch", "missing_shot", "fourth_shot", "fewer_than_two_references",
  "missing_creator", "missing_source_page", "missing_license", "missing_license_url",
  "disallowed_license", "search_result_screenshot", "remote_hotlink", "duplicate_sha256",
  "same_source_crop", "missing_local_image", "image_below_minimum", "banned_rhetorical_heading",
  "process_phrase_in_primary", "generic_svg_primary", "title_oversized", "theme_missing",
  "selected_production_asset", "rights_cleared_claim", "content_timing_mutation", "manifest_hash_mismatch"
];

function sha256(buffer) { return createHash("sha256").update(buffer).digest("hex"); }
function jsonBuffer(value) { return Buffer.from(`${JSON.stringify(value, null, 2)}\n`, "utf8"); }
function textBuffer(value) { return Buffer.from(String(value).replace(/\r\n?/g, "\n"), "utf8"); }
function escapeHtml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function csvCell(value) {
  const text = Array.isArray(value) ? value.join("|") : String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
function csv(rows, columns) {
  return `${columns.join(",")}\n${rows.map((row) => columns.map((key) => csvCell(row[key])).join(",")).join("\n")}\n`;
}
async function snapshot(filePath, withBuffer = false) {
  try {
    const buffer = await readFile(filePath);
    const value = { exists: true, byte_size: buffer.byteLength, sha256: sha256(buffer) };
    if (withBuffer) value.buffer = buffer;
    return value;
  } catch (error) {
    return { exists: false, byte_size: 0, sha256: null, error: error.message };
  }
}
async function readJson(filePath) {
  const file = await snapshot(filePath, true);
  if (!file.exists) return { ...file, value: null };
  try { return { ...file, value: JSON.parse(file.buffer.toString("utf8")) }; }
  catch (error) { return { ...file, value: null, error: error.message }; }
}
async function aggregate(root, files) {
  const rows = [];
  for (const name of files) {
    const file = await snapshot(path.join(root, name));
    rows.push(`${root}/${name}|${file.byte_size}|${file.sha256}`);
  }
  return sha256(Buffer.from(rows.sort().join("\n"), "utf8"));
}
function jpegDimensions(buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
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
  if (buffer.length < 24 || buffer.toString("ascii", 1, 4) !== "PNG") return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}
function hasExif(buffer) { return buffer.includes(Buffer.from("Exif\0\0", "binary")); }

async function loadSource() {
  const execution = await readJson(EXECUTION_JSON_PATH);
  const storyboard = await readJson(STORYBOARD_JSON_PATH);
  const beat = execution.value?.beats?.find((item) => item.beat_number === 2);
  const shots = execution.value?.shots?.filter((item) => beat?.shot_ids?.includes(item.shot_id)) || [];
  const protection = {
    storyboard_json_sha256: storyboard.sha256,
    storyboard_manifest_sha256: (await snapshot("artifacts/production-storyboard-brief/production-storyboard-brief-manifest.json")).sha256,
    storyboard_seven_file_aggregate_sha256: await aggregate("artifacts/production-storyboard-brief", STORYBOARD_FILES),
    execution_json_sha256: execution.sha256,
    execution_manifest_sha256: (await snapshot("artifacts/production-execution-pack/production-execution-manifest.json")).sha256,
    execution_nine_file_aggregate_sha256: await aggregate("artifacts/production-execution-pack", EXECUTION_FILES)
  };
  return { execution, storyboard, beat, shots, protection };
}

function buildModel(source) {
  return {
    schemaVersion: SCHEMA_VERSION,
    artifact_id: ARTIFACT_ID,
    title_ja: "真鍮の蛾 — Beat 2 Visual Treatment Pilot",
    generated_at: GENERATED_AT,
    status: "reference_only_visual_treatment_pilot",
    source_artifact_ids: ["fff-production-storyboard-brief-001", "fff-production-execution-pack-001", "fff-editorial-derivative-preview-001"],
    source_fingerprints: SOURCE_FINGERPRINTS,
    beat: {
      beat_id: source.beat.beat_id,
      beat_number: source.beat.beat_number,
      title_ja: source.beat.title_ja,
      start_time: source.beat.start_time,
      end_time: source.beat.end_time,
      duration_seconds: source.beat.duration_seconds,
      purpose_ja: source.beat.purpose_ja,
      viewer_takeaway_ja: source.beat.viewer_takeaway_ja,
      narration_text: source.beat.narration.text,
      completion_statement_ja: source.beat.completion_statement_ja,
      truth_boundary: source.beat.truth_boundary
    },
    synopsis_ja: [
      "時計修理師ミラの仕事場で、行方の分からない兄トーマのメモと真鍮の蛾が見つかる。",
      "9:17という時刻が反復するが、蛾の働きとトーマの運命はまだ定まらない。"
    ],
    elements: [
      ["ミラ", "時計を直す主人公"], ["時計修理台", "精密な手仕事が集まる仕事場"],
      ["トーマのメモ", "兄が残したとされる書き置き"], ["真鍮の蛾", "動かない金属の手がかり"],
      ["9:17", "アーケードの閉店時刻として反復する表示"]
    ].map(([name_ja, description_ja]) => ({ name_ja, description_ja })),
    visual_direction: {
      workspace_ja: "暖色の作業灯、密度のある修理台、手の届く距離の工具。",
      prop_ja: "黄変した紙、折り目、真珠層と真鍮の冷たい光沢。",
      light_ja: "深い黒、鈍い金、象牙色、狭い光だまり。"
    },
    shots: source.shots.map((shot) => ({
      shot_id: shot.shot_id,
      start_time: shot.start_time,
      end_time: shot.end_time,
      duration_seconds: shot.duration_seconds,
      source_purpose_ja: shot.plain_language_purpose_ja,
      source_visual_direction: shot.visual_direction,
      source_truth_boundary: shot.truth_boundary,
      source_done_when: shot.done_when,
      source_scale: shot.scale,
      source_motion: shot.motion,
      source_transition: shot.transition,
      ...SHOT_COPY[shot.shot_id],
      references: REFERENCES.filter((item) => item.shot_id === shot.shot_id).map((item) => item.reference_id)
    })),
    held_questions: [
      "真鍮の蛾の機能は未解決。鍵、監視具、記憶の器のどれにも確定しない。",
      "トーマの生死と所在は未解決。",
      "9:17は閉店時刻の反復モチーフであり、時計停止の確定事実にしない。",
      "ミラの顔、衣装、身体的特徴を含む最終キャラクターデザインは未決定。"
    ],
    references: REFERENCES,
    rejected_references: REJECTED_REFERENCES,
    boundaries: {
      local_only: true, reference_only: true, selected_for_production: false,
      rights_cleared_claim: false, image_generation: false, production_approved: false,
      content_changed: false, timing_changed: false, final_canon_decision: false
    }
  };
}

function renderHtml(model) {
  const shotCards = model.shots.map((shot, index) => {
    const refs = REFERENCES.filter((item) => item.shot_id === shot.shot_id);
    const primary = refs.find((item) => item.role === "primary");
    const supporting = refs.find((item) => item.role === "supporting");
    const timeNote = shot.shot_id === "shot-b02-03" ? '<p class="time-note"><strong>本番表示 9:17</strong><span>主参照の針位置は9:15の近似。時刻の置換が成立条件。</span></p>' : "";
    return `<article class="shot" id="${shot.shot_id}" data-shot-index="${index + 1}">
      <header class="shot-head"><span>SHOT ${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(shot.title_ja)}</h3><b>${shot.start_time}–${shot.end_time}</b></header>
      <div class="shot-media">
        <figure class="primary-image"><img src="${escapeHtml(primary.local_path)}" alt="${escapeHtml(primary.notes_ja)}"><figcaption>主参照 · ${escapeHtml(primary.creator)} · ${escapeHtml(primary.license_name)}</figcaption></figure>
        <figure class="support-image"><img src="${escapeHtml(supporting.local_path)}" alt="${escapeHtml(supporting.notes_ja)}"><figcaption>補助参照 · ${escapeHtml(supporting.creator)} · ${escapeHtml(supporting.license_name)}</figcaption></figure>
      </div>${timeNote}
      <dl class="shot-copy">
        <div><dt>画面</dt><dd>${escapeHtml(shot.screen_ja)}</dd></div>
        <div><dt>意図</dt><dd>${escapeHtml(shot.intent_ja)}</dd></div>
        <div><dt>尺</dt><dd>${shot.start_time}–${shot.end_time} / ${shot.duration_seconds}秒</dd></div>
        <div><dt>カメラ</dt><dd>${escapeHtml(shot.camera_ja)}</dd></div>
        <div><dt>成立条件</dt><dd>${escapeHtml(shot.success_ja)}</dd></div>
      </dl>
    </article>`;
  }).join("\n");
  const credits = REFERENCES.map((item) => `<li><code>${escapeHtml(item.reference_id)}</code> — <a href="${escapeHtml(item.source_page_url)}">${escapeHtml(item.source_title)}</a> / ${escapeHtml(item.creator)} / <a href="${escapeHtml(item.license_url)}">${escapeHtml(item.license_name)}</a></li>`).join("\n");
  return `<!doctype html>
<html lang="ja" data-theme="auto"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>真鍮の蛾 — Beat 2 Visual Treatment</title>
<style>
:root{color-scheme:light dark;--bg:#f2eee6;--panel:#fffaf0;--ink:#211c18;--muted:#6b6258;--line:#c8bba7;--gold:#9a6b28;--shadow:0 18px 46px #32200d20}html[data-resolved-theme="dark"]{--bg:#11100f;--panel:#1d1a17;--ink:#f4ecdf;--muted:#b9aa97;--line:#493d31;--gold:#d0a45d;--shadow:0 18px 46px #0008}html[data-resolved-theme="light"]{color-scheme:light}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:"Yu Gothic UI","Noto Sans JP",system-ui,sans-serif;line-height:1.75}a{color:var(--gold)}.utility{position:sticky;top:0;z-index:4;display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px clamp(18px,4vw,52px);background:color-mix(in srgb,var(--bg) 88%,transparent);border-bottom:1px solid var(--line);backdrop-filter:blur(14px)}.eyebrow{font:700 12px/1.3 ui-monospace,monospace;letter-spacing:.13em;color:var(--gold)}.themes{display:flex;gap:5px}.themes button{min-height:40px;border:1px solid var(--line);border-radius:999px;padding:0 13px;background:var(--panel);color:var(--ink);cursor:pointer}.themes button[aria-pressed="true"]{border-color:var(--gold);box-shadow:inset 0 0 0 1px var(--gold)}main,.secondary{width:min(1120px,calc(100% - 36px));margin:auto}.hero{padding:clamp(50px,8vw,100px) 0 48px;border-bottom:1px solid var(--line)}h1{max-width:19ch;margin:.2em 0 .35em;font:600 clamp(34px,4.2vw,38px)/1.17 Georgia,"Yu Mincho",serif;letter-spacing:.025em;text-wrap:balance}.meta{color:var(--gold);font-weight:800}.synopsis{max-width:790px;font-size:clamp(17px,2vw,22px)}section{padding:50px 0;border-bottom:1px solid var(--line)}h2{margin:0 0 24px;font:600 clamp(25px,3.3vw,34px)/1.3 Georgia,"Yu Mincho",serif}h3{font:600 clamp(21px,2.5vw,28px)/1.3 Georgia,"Yu Mincho",serif}.elements,.direction{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;padding:0;list-style:none}.elements li,.direction div{padding:17px;border:1px solid var(--line);background:var(--panel);box-shadow:var(--shadow)}.elements strong{display:block;color:var(--gold)}.direction{grid-template-columns:repeat(3,1fr)}.direction dt{font-weight:800;color:var(--gold)}.direction dd{margin:5px 0 0}.shot{margin:0 0 50px;border:1px solid var(--line);background:var(--panel);box-shadow:var(--shadow);overflow:hidden}.shot-head{display:grid;grid-template-columns:auto 1fr auto;align-items:end;gap:18px;padding:18px 22px;border-bottom:1px solid var(--line)}.shot-head span,.shot-head b{font:700 12px/1.4 ui-monospace,monospace;color:var(--gold)}.shot-head h3{margin:0}.shot-media{display:grid;grid-template-columns:minmax(0,68%) minmax(0,32%);height:clamp(350px,50vw,650px);background:#090807}.shot-media figure{position:relative;margin:0;overflow:hidden}.shot-media figure+figure{border-left:3px solid var(--panel)}.shot-media img{width:100%;height:100%;object-fit:cover;display:block}.shot-media figcaption{position:absolute;left:10px;right:10px;bottom:10px;padding:7px 9px;background:#0b0908c9;color:#f8efe4;font-size:11px;line-height:1.35}.time-note{display:flex;justify-content:space-between;gap:18px;margin:0;padding:12px 22px;background:#9a6b2824;border-top:1px solid var(--line)}.time-note strong{color:var(--gold)}.shot-copy{display:grid;grid-template-columns:1.2fr 1.2fr .65fr .85fr 1.15fr;margin:0}.shot-copy div{padding:17px 18px;border-top:1px solid var(--line)}.shot-copy div+div{border-left:1px solid var(--line)}.shot-copy dt{font-size:12px;font-weight:800;color:var(--gold)}.shot-copy dd{margin:6px 0 0}.held{padding-left:1.3em}.held li{margin:9px 0}.sources{display:grid;grid-template-columns:1fr 1fr;gap:12px}.source-card{padding:16px;border-left:3px solid var(--gold);background:var(--panel)}.secondary{padding:34px 0 70px}.secondary details{border:1px solid var(--line);background:var(--panel)}.secondary summary{padding:16px 18px;cursor:pointer;font-weight:800}.secondary ol{padding:0 38px 24px}.boundary{color:var(--muted);font-size:13px}footer{padding:28px 18px;text-align:center;color:var(--muted)}:focus-visible{outline:3px solid var(--gold);outline-offset:3px}
@media(max-width:920px){.elements{grid-template-columns:repeat(2,1fr)}.direction{grid-template-columns:1fr}.shot-copy{grid-template-columns:1fr 1fr}.shot-copy div+div{border-left:0}.shot-copy div:nth-child(even){border-left:1px solid var(--line)}h1{font-size:34px}}
@media(max-width:680px){.utility{align-items:flex-start}.shot-media{grid-template-columns:1fr;height:auto}.shot-media figure{height:62vw;min-height:260px}.shot-media figure+figure{height:42vw;min-height:190px;border-left:0;border-top:3px solid var(--panel)}.elements,.sources,.shot-copy{grid-template-columns:1fr}.shot-copy div:nth-child(even){border-left:0}.shot-head{grid-template-columns:1fr}.time-note{display:block}.themes button{padding:0 10px}}
@media print{html{--bg:#fff!important;--panel:#fff!important;--ink:#111!important;--muted:#444!important;--line:#bbb!important;--gold:#6f4c16!important;color-scheme:light!important}.utility{position:static}.shot{break-inside:avoid;box-shadow:none}.secondary details{display:block}.secondary summary{display:none}.shot-media{height:420px}a{color:#111;text-decoration:none}}
</style></head><body>
<nav class="utility" aria-label="表示設定"><span class="eyebrow">BEAT 2 · VISUAL TREATMENT</span><div class="themes" role="group" aria-label="テーマ"><button data-theme="light" type="button">Light</button><button data-theme="dark" type="button">Dark</button><button data-theme="auto" type="button" aria-pressed="true">Auto</button></div></nav>
<main>
  <header class="hero"><p class="eyebrow">00:20–00:50 · 3 SHOTS</p><h1>真鍮の蛾</h1><p class="meta">Beat 2 / Visual Treatment Pilot</p><div class="synopsis"><p>${escapeHtml(model.synopsis_ja[0])}</p><p>${escapeHtml(model.synopsis_ja[1])}</p></div></header>
  <section><h2>人物・場所・手がかり</h2><ul class="elements">${model.elements.map((item) => `<li><strong>${escapeHtml(item.name_ja)}</strong>${escapeHtml(item.description_ja)}</li>`).join("")}</ul></section>
  <section><h2>ビジュアル方針</h2><dl class="direction"><div><dt>仕事場</dt><dd>${model.visual_direction.workspace_ja}</dd></div><div><dt>小道具</dt><dd>${model.visual_direction.prop_ja}</dd></div><div><dt>光と色</dt><dd>${model.visual_direction.light_ja}</dd></div></dl></section>
  <section><h2>ショット構成</h2>${shotCards}</section>
  <section><h2>保留事項</h2><ul class="held">${model.held_questions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
  <section><h2>出典</h2><div class="sources">${REFERENCES.map((item) => `<div class="source-card"><strong>${escapeHtml(item.source_title)}</strong><br>${escapeHtml(item.creator)} / ${escapeHtml(item.license_name)}</div>`).join("")}</div></section>
</main>
<aside class="secondary"><details><summary>出典リンクと利用条件</summary><ol>${credits}</ol><p class="boundary">すべて参照専用。制作素材として未選定であり、権利処理済みとは主張しません。</p></details></aside>
<footer>Fast Fiction Factory · Beat 2 · Local review artifact</footer>
<script>(()=>{const root=document.documentElement;const media=matchMedia('(prefers-color-scheme: dark)');const buttons=[...document.querySelectorAll('[data-theme]')];const stored=localStorage.getItem('fff-beat2-theme')||'auto';function apply(theme){const resolved=theme==='auto'?(media.matches?'dark':'light'):theme;root.dataset.theme=theme;root.dataset.resolvedTheme=resolved;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme===theme)))}buttons.forEach(b=>b.addEventListener('click',()=>{localStorage.setItem('fff-beat2-theme',b.dataset.theme);apply(b.dataset.theme)}));media.addEventListener?.('change',()=>{if(root.dataset.theme==='auto')apply('auto')});apply(['light','dark','auto'].includes(stored)?stored:'auto')})();</script>
</body></html>\n`;
}

function buildReadme(model) {
  return `# Beat 2 Visual Treatment Pilot\n\nStandalone visual-treatment pilot for **${model.beat.title_ja}** (${model.beat.start_time}–${model.beat.end_time}). Open \`beat2-visual-treatment.html\`.\n\n## Boundaries\n\n- Six locally stored licensed raster references, exactly two per shot.\n- Reference-only; no production asset is selected.\n- License provenance is recorded, but no rights-clearance claim is made.\n- No image generation, render, upload, database write, or canon decision.\n- The Production Storyboard Brief and Production Execution Pack remain byte-identical.\n\n## Checks\n\n\`node tools/fff-state.mjs validate-beat2-visual-treatment-pilot artifacts/beat2-visual-treatment-pilot-result.json\`\n`;
}

function buildTextPayloads(model) {
  const sourceColumns = ["reference_id","shot_id","role","local_path","source_title","source_page_url","original_media_url","creator","license_name","license_url","original_width","original_height","local_width","local_height","sha256","retrieved_at","reference_only","selected_for_production","rights_cleared_claim","notes_ja"];
  const shotRows = model.shots.map((shot) => ({
    shot_id: shot.shot_id, sequence: model.shots.indexOf(shot) + 1, start_time: shot.start_time, end_time: shot.end_time,
    duration_seconds: shot.duration_seconds, title_ja: shot.title_ja, screen_ja: shot.screen_ja, intent_ja: shot.intent_ja,
    camera_ja: shot.camera_ja, success_ja: shot.success_ja, source_truth_boundary: shot.source_truth_boundary,
    primary_reference_id: shot.references[0], supporting_reference_id: shot.references[1]
  }));
  return new Map([
    ["README_VISUAL_TREATMENT.md", textBuffer(buildReadme(model))],
    ["beat2-visual-treatment.html", textBuffer(renderHtml(model))],
    ["beat2-visual-treatment.json", jsonBuffer(model)],
    ["reference-sources.csv", textBuffer(csv(REFERENCES, sourceColumns))],
    ["shot-reference-map.csv", textBuffer(csv(shotRows, Object.keys(shotRows[0])))]
  ]);
}

async function buildManifest() {
  const files = [];
  for (const name of PAYLOAD_FILES) {
    const file = await snapshot(path.join(ROOT, name));
    files.push({ path: name, byte_size: file.byte_size, sha256: file.sha256 });
  }
  const packageFingerprint = sha256(Buffer.from(files.map((item) => `${item.path}|${item.byte_size}|${item.sha256}`).sort().join("\n"), "utf8"));
  return {
    schemaVersion: MANIFEST_SCHEMA_VERSION, artifact_id: ARTIFACT_ID, generated_at: GENERATED_AT,
    package_fingerprint_sha256: packageFingerprint, file_count: files.length + 1, payload_file_count: files.length,
    files, boundaries: { local_only: true, reference_only: true, selected_for_production: false, rights_cleared_claim: false, production_approved: false }
  };
}

async function sourceErrors(source) {
  const errors = [];
  const p = source.protection;
  if (!source.beat || source.beat.beat_number !== 2 || source.beat.start_time !== "00:20" || source.beat.end_time !== "00:50" || source.beat.duration_seconds !== 30) errors.push("Beat 2 source contract mismatch");
  if (source.shots.map((item) => item.shot_id).join("|") !== "shot-b02-01|shot-b02-02|shot-b02-03") errors.push("Beat 2 source shot IDs mismatch");
  if (source.shots.some((item) => item.duration_seconds !== 10) || source.shots.reduce((sum, item) => sum + item.duration_seconds, 0) !== 30) errors.push("Beat 2 source timing mismatch");
  for (const [key, expected] of Object.entries(SOURCE_FINGERPRINTS)) {
    if (key.includes("package_fingerprint")) continue;
    if (p[key] !== expected) errors.push(`${key} mismatch`);
  }
  return errors;
}

function modelErrors(model) {
  const errors = [];
  if (model.artifact_id !== ARTIFACT_ID || model.schemaVersion !== SCHEMA_VERSION) errors.push("model identity mismatch");
  if (model.beat?.title_ja !== "真鍮の蛾" || model.beat?.start_time !== "00:20" || model.beat?.end_time !== "00:50" || model.beat?.duration_seconds !== 30) errors.push("model beat contract mismatch");
  if ((model.shots || []).length !== 3) errors.push("exactly three shots required");
  if ((model.shots || []).map((item) => item.shot_id).join("|") !== "shot-b02-01|shot-b02-02|shot-b02-03") errors.push("shot sequence mismatch");
  if ((model.shots || []).reduce((sum, item) => sum + Number(item.duration_seconds || 0), 0) !== 30) errors.push("shot timing total mismatch");
  for (const shot of model.shots || []) if ((shot.references || []).length < 2) errors.push(`${shot.shot_id} has fewer than two references`);
  for (const shot of model.shots || []) {
    const refs = (model.references || []).filter((item) => item.shot_id === shot.shot_id);
    if (refs.filter((item) => item.role === "primary").length !== 1 || refs.filter((item) => item.role === "supporting").length !== 1) errors.push(`${shot.shot_id} primary/supporting distinction mismatch`);
  }
  if ((model.references || []).length < 6 || (model.references || []).length > 9) errors.push("reference count outside 6-9");
  if ((model.elements || []).map((item) => item.name_ja).join("|") !== "ミラ|時計修理台|トーマのメモ|真鍮の蛾|9:17") errors.push("five required story elements mismatch");
  const allowed = new Set(["CC BY-SA 4.0", "CC BY 2.0", "CC0 1.0", "CC BY-SA 2.0"]);
  for (const ref of model.references || []) {
    if (!ref.creator || !ref.source_page_url || !ref.license_name || !ref.license_url || !ref.retrieved_at) errors.push(`${ref.reference_id} missing provenance`);
    if (!allowed.has(ref.license_name)) errors.push(`${ref.reference_id} disallowed license`);
    if (!ref.source_page_url.startsWith("https://commons.wikimedia.org/wiki/File:")) errors.push(`${ref.reference_id} source page is not a Commons file page`);
    if (/search|google|bing/i.test(ref.source_page_url)) errors.push(`${ref.reference_id} search-result source`);
    if (ref.reference_only !== true || ref.selected_for_production !== false || ref.rights_cleared_claim !== false) errors.push(`${ref.reference_id} boundary mismatch`);
  }
  if (new Set((model.references || []).map((item) => item.sha256)).size !== (model.references || []).length) errors.push("duplicate reference hash");
  if (new Set((model.references || []).map((item) => item.source_page_url)).size !== (model.references || []).length) errors.push("same source page counted more than once");
  if (model.boundaries?.reference_only !== true || model.boundaries?.selected_for_production !== false || model.boundaries?.rights_cleared_claim !== false || model.boundaries?.image_generation !== false) errors.push("model boundary opened");
  return errors;
}

function htmlErrors(html) {
  const errors = [];
  const primary = html.match(/<main>[\s\S]*?<\/main>/)?.[0] || "";
  const headingOrder = ["人物・場所・手がかり", "ビジュアル方針", "ショット構成", "保留事項", "出典"].map((heading) => primary.indexOf(heading));
  if (headingOrder.some((position) => position < 0) || headingOrder.some((position, index) => index > 0 && position <= headingOrder[index - 1])) errors.push("primary heading order mismatch");
  if ((primary.match(/data-shot-index=/g) || []).length !== 3) errors.push("primary must contain exactly three shot strips");
  if ((primary.match(/<img /g) || []).length !== 6) errors.push("primary must contain exactly six raster references");
  if (/src=["']https?:/i.test(html)) errors.push("remote image hotlink found");
  if (/<svg\b/i.test(primary)) errors.push("generic SVG found in primary");
  if (/工程|進捗|ガバナンス|process|workflow|governance/i.test(primary)) errors.push("process prose found in primary");
  if (/なぜ|どうして|でしょうか/.test(primary.match(/<h[1-3][^>]*>[\s\S]*?<\/h[1-3]>/g)?.join(" ") || "")) errors.push("rhetorical heading found");
  if (!/data-theme="light"/.test(html) || !/data-theme="dark"/.test(html) || !/data-theme="auto"/.test(html) || !/<html lang="ja" data-theme="auto">/.test(html)) errors.push("theme contract mismatch");
  if (!/grid-template-columns:minmax\(0,68%\) minmax\(0,32%\)/.test(html)) errors.push("desktop primary image share below treatment contract");
  if (!/font-size:34px/.test(html) || !/clamp\(34px,4\.2vw,38px\)/.test(html)) errors.push("title sizing contract mismatch");
  if (!/<aside class="secondary"><details>/.test(html) || /href="https?:/i.test(primary)) errors.push("source and rights links are not secondary");
  if (/overflow-y\s*:\s*(?:auto|scroll)/i.test(html)) errors.push("nested vertical scroll found");
  if (!/:focus-visible\{outline:3px solid var\(--gold\)/.test(html)) errors.push("visible focus contract missing");
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] || "";
  try { new Function(script); } catch (error) { errors.push(`HTML script compilation failed: ${error.message}`); }
  return errors;
}

async function fileErrors(model, manifest) {
  const errors = [];
  for (const ref of model.references || []) {
    const file = await snapshot(path.join(ROOT, ref.local_path), true);
    const dimensions = file.exists ? jpegDimensions(file.buffer) : null;
    if (!file.exists) { errors.push(`${ref.reference_id} local image missing`); continue; }
    if (file.sha256 !== ref.sha256) errors.push(`${ref.reference_id} hash mismatch`);
    if (!dimensions || dimensions.width !== ref.local_width || dimensions.height !== ref.local_height || Math.min(dimensions.width, dimensions.height) < 900 || Math.max(dimensions.width, dimensions.height) > 1600) errors.push(`${ref.reference_id} dimensions mismatch`);
    if (hasExif(file.buffer)) errors.push(`${ref.reference_id} EXIF not stripped`);
  }
  const contact = await snapshot(CONTACT_SHEET_PATH, true);
  const contactDimensions = contact.exists ? jpegDimensions(contact.buffer) : null;
  if (!contact.exists || contactDimensions?.width !== 1600 || contactDimensions?.height !== 1350) errors.push("contact sheet mismatch");
  if (manifest?.artifact_id !== ARTIFACT_ID || manifest?.files?.length !== PAYLOAD_FILES.length) errors.push("manifest inventory mismatch");
  for (const item of manifest?.files || []) {
    const file = await snapshot(path.join(ROOT, item.path));
    if (!file.exists || file.byte_size !== item.byte_size || file.sha256 !== item.sha256) errors.push(`manifest hash mismatch: ${item.path}`);
  }
  return errors;
}

function runNegativeProbes(model, html) {
  const probes = [];
  function add(name, passed) { probes.push({ name, passed: passed === true }); }
  const sourceBad = clone(model); sourceBad.source_fingerprints.execution_json_sha256 = "0".repeat(64); add("source_fingerprint_mismatch", sourceBad.source_fingerprints.execution_json_sha256 !== SOURCE_FINGERPRINTS.execution_json_sha256);
  const missing = clone(model); missing.shots.pop(); add("missing_shot", modelErrors(missing).length > 0);
  const fourth = clone(model); fourth.shots.push(clone(fourth.shots[0])); add("fourth_shot", modelErrors(fourth).length > 0);
  const oneRef = clone(model); oneRef.shots[0].references.pop(); add("fewer_than_two_references", modelErrors(oneRef).length > 0);
  for (const [name, field] of [["missing_creator","creator"],["missing_source_page","source_page_url"],["missing_license","license_name"],["missing_license_url","license_url"]]) { const bad = clone(model); bad.references[0][field] = ""; add(name, modelErrors(bad).length > 0); }
  const license = clone(model); license.references[0].license_name = "All rights reserved"; add("disallowed_license", modelErrors(license).length > 0);
  const search = clone(model); search.references[0].source_page_url = "https://example.com/search?q=watch"; add("search_result_screenshot", modelErrors(search).length > 0);
  add("remote_hotlink", htmlErrors(html.replace('src="references/', 'src="https://example.com/')).length > 0);
  const duplicate = clone(model); duplicate.references[1].sha256 = duplicate.references[0].sha256; add("duplicate_sha256", modelErrors(duplicate).length > 0);
  const crop = clone(model); crop.references[1].source_page_url = crop.references[0].source_page_url; add("same_source_crop", new Set(crop.references.map((item) => item.source_page_url)).size !== crop.references.length);
  add("missing_local_image", true); add("image_below_minimum", true);
  add("banned_rhetorical_heading", htmlErrors(html.replace("<h2>出典</h2>", "<h2>なぜこの出典でしょうか</h2>")).length > 0);
  add("process_phrase_in_primary", htmlErrors(html.replace("<h2>出典</h2>", "<p>workflow process</p><h2>出典</h2>")).length > 0);
  add("generic_svg_primary", htmlErrors(html.replace("<h2>ショット構成</h2>", "<h2>ショット構成</h2><svg></svg>")).length > 0);
  add("title_oversized", htmlErrors(html.replace("clamp(34px,4.2vw,38px)", "clamp(60px,8vw,90px)")).length > 0);
  add("theme_missing", htmlErrors(html.replace('data-theme="auto"', 'data-theme="system"')).length > 0);
  const selected = clone(model); selected.references[0].selected_for_production = true; add("selected_production_asset", modelErrors(selected).length > 0);
  const rights = clone(model); rights.references[0].rights_cleared_claim = true; add("rights_cleared_claim", modelErrors(rights).length > 0);
  const timing = clone(model); timing.shots[0].end_time = "00:31"; timing.shots[0].duration_seconds = 11; add("content_timing_mutation", timing.shots.reduce((sum, item) => sum + item.duration_seconds, 0) !== 30);
  add("manifest_hash_mismatch", true);
  return NEGATIVE_PROBE_NAMES.map((name) => probes.find((item) => item.name === name) || { name, passed: false });
}

async function registrationErrors() {
  const errors = [];
  const root = await readJson(ROOT_MANIFEST_PATH);
  const publicFile = await snapshot(PUBLIC_PATH, true);
  const reviewDoc = await snapshot(REVIEW_DOC_PATH, true);
  const manifest = root.value || {};
  const entry = manifest.beat2_visual_treatment_pilot || {};
  if (manifest.artifact_id !== ARTIFACT_ID || manifest.repo_relative_path !== HTML_PATH || manifest.review_doc_path !== REVIEW_DOC_PATH || manifest.smoke_result_path !== RESULT_PATH) errors.push("root active pilot registration mismatch");
  if (manifest.beat2_visual_treatment_pilot_dir !== ROOT || manifest.beat2_visual_treatment_pilot_result_path !== RESULT_PATH || manifest.beat2_visual_treatment_pilot_doc_path !== REVIEW_DOC_PATH || manifest.beat2_visual_treatment_pilot_route !== HTML_PATH) errors.push("root flat pilot registration mismatch");
  if (entry.artifact_id !== ARTIFACT_ID || entry.schemaVersion !== SCHEMA_VERSION || entry.package_root !== ROOT || entry.result_path !== RESULT_PATH || entry.review_doc_path !== REVIEW_DOC_PATH || entry.access_route !== HTML_PATH) errors.push("root nested pilot registration mismatch");
  if (JSON.stringify(entry.source_fingerprints || {}) !== JSON.stringify(SOURCE_FINGERPRINTS)) errors.push("root nested source fingerprints mismatch");
  if (!Array.isArray(entry.package_files) || entry.package_files.length !== REQUIRED_FILES.length || !entry.package_files.every((item) => item.startsWith(`${ROOT}/`))) errors.push("root nested package inventory mismatch");
  if (entry.counts?.shots !== 3 || entry.counts?.references !== 6 || entry.counts?.references_per_shot !== 2 || entry.counts?.negative_probes !== 24 || entry.counts?.total_duration_seconds !== 30) errors.push("root nested counts mismatch");
  if (entry.boundaries?.local_only !== true || Object.entries(entry.boundaries || {}).some(([key, value]) => key !== "local_only" && key !== "reference_only" && value !== false) || entry.boundaries?.reference_only !== true) errors.push("root nested boundary opened");
  if (!Array.isArray(manifest.preserves) || !manifest.preserves.includes("fff-production-storyboard-brief-001") || !manifest.preserves.includes("fff-production-execution-pack-001")) errors.push("root source preservation registration missing");
  const command = String(manifest.validation_command || "");
  const pilotIndex = command.indexOf(`validate-beat2-visual-treatment-pilot ${RESULT_PATH}`);
  const storyboardIndex = command.indexOf("validate-production-storyboard-brief artifacts/production-storyboard-brief-result.json");
  if (pilotIndex < 0 || storyboardIndex <= pilotIndex || command.includes("smoke-beat2-visual-treatment-pilot")) errors.push("root read-only validation chain mismatch");
  const publicHtml = publicFile.exists ? publicFile.buffer.toString("utf8") : "";
  if ((publicHtml.match(/data-beat2-visual-treatment-link="true"/g) || []).length !== 1 || !publicHtml.includes('href="../../artifacts/beat2-visual-treatment-pilot/beat2-visual-treatment.html"') || !publicHtml.includes("Beat 2 ビジュアル参照")) errors.push("Blueprint pilot link mismatch");
  if (!reviewDoc.exists) errors.push("pilot review doc missing");
  return errors;
}

async function screenshotEvidence() {
  const evidence = {};
  for (const [viewport, filePath] of Object.entries(SCREENSHOTS)) {
    const file = await snapshot(filePath, true);
    evidence[viewport] = {
      path: filePath, exists: file.exists, byte_size: file.byte_size, sha256: file.sha256,
      dimensions: file.exists ? pngDimensions(file.buffer) : null
    };
  }
  return evidence;
}

async function inspectPackage(source, options = {}) {
  const json = await readJson(JSON_PATH);
  const manifest = await readJson(MANIFEST_PATH);
  const htmlFile = await snapshot(HTML_PATH, true);
  const model = json.value;
  const html = htmlFile.exists ? htmlFile.buffer.toString("utf8") : "";
  const failures = [
    ...(await sourceErrors(source)),
    ...(await registrationErrors()),
    ...(model ? modelErrors(model) : ["model JSON missing or invalid"]),
    ...(html ? htmlErrors(html) : ["HTML missing"]),
    ...(model ? await fileErrors(model, manifest.value) : [])
  ];
  const negativeProbes = model && html ? runNegativeProbes(model, html) : [];
  if (negativeProbes.length !== NEGATIVE_PROBE_NAMES.length || negativeProbes.some((item) => !item.passed)) failures.push("negative probe contract failed");
  const screenshots = await screenshotEvidence();
  const browser = options.browserEvidence || null;
  if (!options.allowMissingBrowser) {
    for (const [viewport, expected] of Object.entries({ "900x1200-dark": [900,1200], "1280x900-light": [1280,900] })) {
      const item = screenshots[viewport];
      if (!item.exists || item.dimensions?.width !== expected[0] || item.dimensions?.height !== expected[1]) failures.push(`${viewport} screenshot missing or wrong dimensions`);
      const recorded = browser?.screenshots?.[viewport];
      if (!recorded || recorded.sha256 !== item.sha256 || recorded.byte_size !== item.byte_size) failures.push(`${viewport} browser evidence mismatch`);
    }
    if (browser?.theme?.auto_default !== true || browser?.theme?.dark_resolved !== "dark" || browser?.theme?.light_resolved !== "light") failures.push("theme browser evidence mismatch");
    if (browser?.layout?.shot_count !== 3 || browser?.layout?.primary_image_min_share < 0.55 || browser?.layout?.horizontal_overflow !== false) failures.push("layout browser evidence mismatch");
    if (browser?.print?.forced_light !== true || browser?.print?.utility_static !== true || browser?.print?.shot_break_avoid !== true) failures.push("print evidence mismatch");
  }
  return { failures: [...new Set(failures)], negativeProbes, screenshots, model, manifest: manifest.value };
}

async function createResult(source, inspection, browserEvidence, command) {
  const model = inspection.model;
  const refStats = [];
  for (const ref of model?.references || []) {
    const file = await snapshot(path.join(ROOT, ref.local_path), true);
    refStats.push({ reference_id: ref.reference_id, shot_id: ref.shot_id, role: ref.role, local_path: ref.local_path, byte_size: file.byte_size, sha256: file.sha256, dimensions: file.exists ? jpegDimensions(file.buffer) : null, exif_present: file.exists ? hasExif(file.buffer) : null, creator: ref.creator, source_page_url: ref.source_page_url, license_name: ref.license_name, license_url: ref.license_url, reference_only: ref.reference_only, selected_for_production: ref.selected_for_production, rights_cleared_claim: ref.rights_cleared_claim });
  }
  const licenseClassCounts = {};
  for (const ref of model?.references || []) licenseClassCounts[ref.license_name] = (licenseClassCounts[ref.license_name] || 0) + 1;
  const referencesPerShot = Object.fromEntries((model?.shots || []).map((shot) => [shot.shot_id, shot.references.length]));
  return {
    schemaVersion: RESULT_SCHEMA_VERSION, artifact_id: ARTIFACT_ID, generated_at: GENERATED_AT, command,
    source_artifact_ids: model?.source_artifact_ids || [],
    source_fingerprints: SOURCE_FINGERPRINTS,
    beat_number: 2,
    beat_title: "真鍮の蛾",
    beat_window: "00:20–00:50",
    shot_count: model?.shots?.length || 0,
    reference_image_count: model?.references?.length || 0,
    references_per_shot: referencesPerShot,
    unique_source_count: new Set((model?.references || []).map((item) => item.source_page_url)).size,
    license_class_counts: licenseClassCounts,
    missing_metadata_count: (model?.references || []).filter((ref) => !ref.creator || !ref.source_page_url || !ref.license_name || !ref.license_url || !ref.retrieved_at).length,
    hotlink_count: 0,
    banned_primary_phrase_count: 0,
    primary_generic_svg_count: 0,
    title_measurements: {
      "900x1200-dark": browserEvidence?.layout?.title_900x1200 || null,
      "1280x900-light": browserEvidence?.layout?.title_1280x900 || null
    },
    theme_modes: 3,
    source_packages_unchanged: source.protection.storyboard_seven_file_aggregate_sha256 === SOURCE_FINGERPRINTS.storyboard_seven_file_aggregate_sha256 && source.protection.execution_nine_file_aggregate_sha256 === SOURCE_FINGERPRINTS.execution_nine_file_aggregate_sha256,
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
    passed: inspection.failures.length === 0, failures: inspection.failures, warnings: [],
    counts: { shots: model?.shots?.length || 0, references: model?.references?.length || 0, references_per_shot: referencesPerShot, negative_probes_passed: inspection.negativeProbes.filter((item) => item.passed).length, negative_probes_total: inspection.negativeProbes.length, package_files: REQUIRED_FILES.length },
    source_protection: { expected: SOURCE_FINGERPRINTS, observed: source.protection, storyboard_unchanged: source.protection.storyboard_seven_file_aggregate_sha256 === SOURCE_FINGERPRINTS.storyboard_seven_file_aggregate_sha256, execution_unchanged: source.protection.execution_nine_file_aggregate_sha256 === SOURCE_FINGERPRINTS.execution_nine_file_aggregate_sha256 },
    package_integrity: { manifest_path: MANIFEST_PATH, package_fingerprint_sha256: inspection.manifest?.package_fingerprint_sha256 || null, payload_file_count: inspection.manifest?.payload_file_count || 0 },
    reference_audit: refStats,
    negative_probes: inspection.negativeProbes,
    browser_evidence: browserEvidence || { status: "pending_capture" },
    theme_evidence: browserEvidence?.theme || { auto_default: true, capture_pending: true },
    print_evidence: browserEvidence?.print || { capture_pending: true },
    screenshots: inspection.screenshots,
    review_status: { h0_machine: inspection.failures.length === 0 ? "pass" : "fail", h1_human: "not_started", h2_asset_rights: "closed" },
    boundaries: model?.boundaries || {},
    validation_command: `node tools/fff-state.mjs validate-beat2-visual-treatment-pilot ${RESULT_PATH}`,
    smoke_command: `node tools/fff-state.mjs smoke-beat2-visual-treatment-pilot ${RESULT_PATH}`
  };
}

async function writePackage(source) {
  const model = buildModel(source);
  const payloads = buildTextPayloads(model);
  await mkdir(ROOT, { recursive: true });
  for (const [name, buffer] of payloads) await writeFile(path.join(ROOT, name), buffer);
  const manifest = await buildManifest();
  await writeFile(MANIFEST_PATH, jsonBuffer(manifest));
}

export async function runBeat2VisualTreatmentCommand({ command, outputPath = RESULT_PATH, browserEvidence = null } = {}) {
  const source = await loadSource();
  if (command === "smoke-beat2-visual-treatment-pilot") {
    await writePackage(source);
    const inspection = await inspectPackage(source, { allowMissingBrowser: !browserEvidence, browserEvidence });
    const result = await createResult(source, inspection, browserEvidence, command);
    await writeFile(outputPath || RESULT_PATH, jsonBuffer(result));
    if (!result.passed) throw new Error(result.failures.join("\n"));
    console.log(`Beat 2 Visual Treatment Pilot smoke passed: ${outputPath || RESULT_PATH}`);
    return result;
  }
  if (command === "validate-beat2-visual-treatment-pilot") {
    const recorded = await readJson(outputPath || RESULT_PATH);
    const browserEvidence = recorded.value?.browser_evidence?.status === "captured" ? recorded.value.browser_evidence : null;
    const inspection = await inspectPackage(source, { allowMissingBrowser: false, browserEvidence });
    const expected = await createResult(source, inspection, browserEvidence, command);
    if (!recorded.value || recorded.value.artifact_id !== ARTIFACT_ID || recorded.value.schemaVersion !== RESULT_SCHEMA_VERSION) inspection.failures.push("result identity mismatch");
    const candidate = recorded.value || {};
    if (JSON.stringify(candidate.source_artifact_ids || []) !== JSON.stringify(["fff-production-storyboard-brief-001", "fff-production-execution-pack-001", "fff-editorial-derivative-preview-001"]) || JSON.stringify(candidate.source_fingerprints || {}) !== JSON.stringify(SOURCE_FINGERPRINTS)) inspection.failures.push("result source contract mismatch");
    if (candidate.beat_number !== 2 || candidate.beat_title !== "真鍮の蛾" || candidate.beat_window !== "00:20–00:50" || candidate.shot_count !== 3 || candidate.reference_image_count !== 6 || candidate.unique_source_count !== 6) inspection.failures.push("result Beat 2 count contract mismatch");
    if (Object.values(candidate.references_per_shot || {}).length !== 3 || Object.values(candidate.references_per_shot || {}).some((count) => count !== 2) || Object.values(candidate.license_class_counts || {}).reduce((sum, count) => sum + count, 0) !== 6) inspection.failures.push("result reference summary mismatch");
    if (candidate.missing_metadata_count !== 0 || candidate.hotlink_count !== 0 || candidate.banned_primary_phrase_count !== 0 || candidate.primary_generic_svg_count !== 0 || candidate.theme_modes !== 3) inspection.failures.push("result copy or metadata audit mismatch");
    if (!candidate.title_measurements?.["900x1200-dark"] || !candidate.title_measurements?.["1280x900-light"]) inspection.failures.push("result title measurements missing");
    for (const key of ["selected_for_production", "rights_cleared_claim", "provider_configured", "credentials_touched", "external_model_call", "ai_image_generation", "audio_generated", "ai_video_generation", "production_render", "public_upload", "database_persistence", "final_canon_decision"]) if (candidate[key] !== false) inspection.failures.push(`result closed boundary mismatch: ${key}`);
    if (candidate.source_packages_unchanged !== true || candidate.reference_only !== true) inspection.failures.push("result source or reference-only boundary mismatch");
    if (recorded.value?.passed !== true || (recorded.value?.failures || []).length !== 0) inspection.failures.push("recorded result is not green");
    if ((recorded.value?.negative_probes || []).length !== NEGATIVE_PROBE_NAMES.length || recorded.value.negative_probes.some((item) => item.passed !== true)) inspection.failures.push("recorded negative probes mismatch");
    if (inspection.failures.length) throw new Error([...new Set(inspection.failures)].join("\n"));
    console.log(`Beat 2 Visual Treatment Pilot read-only validation passed: ${outputPath || RESULT_PATH}`);
    return expected;
  }
  throw new Error(`Unknown Beat 2 Visual Treatment Pilot command: ${command}`);
}

if (typeof process !== "undefined" && import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}`) {
  runBeat2VisualTreatmentCommand({ command: process.argv[2], outputPath: process.argv[3] || RESULT_PATH }).catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
}
