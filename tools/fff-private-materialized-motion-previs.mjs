#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFile as execFileCallback } from "node:child_process";
import { copyFile, mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { pathToFileURL } from "node:url";

const execFile = promisify(execFileCallback);

const ARTIFACT_ID = "fff-private-materialized-motion-previs-001";
const MISSION_ID = "fff-private-materialized-motion-previs-001";
const GENERATED_AT = "2026-07-25T12:00:00+09:00";
const DESIGN_SIGNATURE = "diegetic_semantic_material_system";
const WATERMARK = "MATERIAL PREVIS / PRIVATE / NOT FOR PUBLICATION";
const PACKAGE_ROOT = "artifacts/private-materialized-motion-previs";
const MATERIAL_ROOT = `${PACKAGE_ROOT}/materials`;
const FRAME_ROOT = `${PACKAGE_ROOT}/frames`;
const MODEL_PATH = `${PACKAGE_ROOT}/private-materialized-motion-previs.json`;
const HTML_PATH = `${PACKAGE_ROOT}/private-materialized-motion-previs.html`;
const MP4_PATH = `${PACKAGE_ROOT}/private-materialized-motion-previs.mp4`;
const CONTACT_SHEET_PATH = `${PACKAGE_ROOT}/private-materialized-motion-previs-contact-sheet.jpg`;
const FAMILY_INDEX_PATH = `${PACKAGE_ROOT}/material-family-index.json`;
const SHOT_MAP_PATH = `${PACKAGE_ROOT}/shot-to-material-map.csv`;
const MOTION_MAP_PATH = `${PACKAGE_ROOT}/motion-transition-map.csv`;
const MANIFEST_PATH = `${PACKAGE_ROOT}/private-materialized-motion-previs-manifest.json`;
const DESIGN_DIRECTION_PATH = `${PACKAGE_ROOT}/design-direction.json`;
const RESULT_PATH = "artifacts/private-materialized-motion-previs-result.json";
const REVIEW_DOC_PATH = "docs/review/private-materialized-motion-previs.md";
const SCREENSHOTS = {
  desktop: "artifacts/review-screens/private-materialized-motion-previs-desktop.png",
  narrow: "artifacts/review-screens/private-materialized-motion-previs-narrow.png"
};

const PREVIEW_ROOT = "artifacts/private-previsualization-timeline";
const PREVIEW_MODEL_PATH = `${PREVIEW_ROOT}/private-previsualization-timeline.json`;
const PREVIEW_MANIFEST_PATH = `${PREVIEW_ROOT}/private-previsualization-manifest.json`;
const PREVIEW_RESULT_PATH = "artifacts/private-previsualization-timeline-result.json";
const READINESS_ROOT = "artifacts/asset-rights-readiness-packet";
const READINESS_MODEL_PATH = `${READINESS_ROOT}/asset-rights-readiness.json`;
const READINESS_MANIFEST_PATH = `${READINESS_ROOT}/asset-rights-readiness-manifest.json`;
const READINESS_RESULT_PATH = "artifacts/asset-rights-readiness-packet-result.json";
const INTEGRATED_ROOT = "artifacts/integrated-visual-production-package";
const INTEGRATED_MANIFEST_PATH = `${INTEGRATED_ROOT}/integrated-visual-production-package-manifest.json`;
const INTEGRATED_RESULT_PATH = "artifacts/integrated-visual-production-package-result.json";
const EXECUTION_ROOT = "artifacts/production-execution-pack";

const ACCEPTED_PREVIEW_MP4_SHA256 = "78c1b45498c25b873a757e04816257c42d31d4a53fd0c9905b50ae37a6022978";
const PROTECTED_RESULT_HASHES = {
  [PREVIEW_RESULT_PATH]: "088bd9b9a61f23f4b2828d618fa4cb4002ec5d1fd2cd6b634c3d9a0a55abbaa0",
  [READINESS_RESULT_PATH]: "b188db9d0a36ca895af90041855efc55cdff0db6bdec17cbe1950bb0ac2611af",
  [INTEGRATED_RESULT_PATH]: "e8f7f7fc50c5700d3a14f78b72ff33b6b142753f3dd2e2dfbf79311077301582"
};
const PROTECTED_TREE_HASHES = {
  [PREVIEW_ROOT]: "09db8982c3c6f5f8c1ecc39c2663fa49a7c638396364f2d251d3f8b2c51f2a80",
  [INTEGRATED_ROOT]: "e42fe724e53476ae7f5e4ed022b0e33c112ce0ec1d30e70c9bafc11637a18c15",
  [READINESS_ROOT]: "93eb1034948920e7738f7921ae6e7fd4e4573545434fa54260f5c405895a0e8b",
  [EXECUTION_ROOT]: "f69737459194a88b00d839499ff4b808b0e1ed9632139fb6715cd381248c4397"
};
const PROTECTED_DIRTY_HASHES = {
  ".serena/project.yml": "98337e11cbcd1fde6a0850cd26a2cb27d4b728e4b2ae85874d38f703e342872c",
  "docs/decision-log.md": "441360cb43d9dec7455faeaf7c8a76aaac74ed3dee7dab15f53b65e2e9791b0f",
  "docs/idea-ledger.md": "0675ea45ffb333ad6887aef1fd69aac08393ecd85435f7aa2c8d670c6da49325",
  "docs/project-context.md": "f3bef6d4415cdc905fa7bad5139319612d3e373c4963b34c2e874a70f0a154f6",
  "docs/review/current-status.md": "84e3ff5d9184d90ee269102133e5cdc44191d56f5dcb64ee891ea91c2943e9c4",
  "docs/review/next-terminal-handoff.md": "c91a543db7cb5f99158e202ae56864a55be2617caa5777aa7ee05bd14d8fb889",
  "docs/review/supervisor-current-report.md": "1d73e28629bcc047958b6d566889b9f13cd5604e62c2e10da79fcbf9dc985df1"
};
const AMBIGUOUS_REFERENCE_IDS = [
  "ref-b04-s03-closed-meeting-room",
  "ref-b04-shared-general-ledger"
];
const DETERMINISTIC_REQUIREMENT_IDS = [
  "AR-CHAR-02",
  "AR-CHAR-03",
  "AR-PROP-01",
  "AR-PROP-03",
  "AR-DOC-01",
  "AR-DOC-02",
  "AR-ABS-01",
  "AR-ABS-02",
  "AR-TYPE-01"
];

const FAMILY_DEFINITIONS = [
  {
    requirement_id: "AR-CHAR-02",
    name: "Anonymous Council silhouettes",
    variants: [
      { variant_id: "council-neutral", kind: "council-neutral", shot_ids: ["shot-b04-01"], semantic_type: "neutral_institutional_silhouette" }
    ]
  },
  {
    requirement_id: "AR-CHAR-03",
    name: "Unresolved Toma silhouette",
    variants: [
      { variant_id: "toma-unresolved", kind: "toma-unresolved", shot_ids: ["shot-b05-01"], semantic_type: "unresolved_character_silhouette" }
    ]
  },
  {
    requirement_id: "AR-PROP-01",
    name: "Clock repair and 9:17 module",
    variants: [
      { variant_id: "repair-module", kind: "repair-module", shot_ids: ["shot-b02-01"], semantic_type: "clock_repair_work_surface" },
      { variant_id: "time-0917", kind: "time-0917", shot_ids: ["shot-b02-03"], semantic_type: "specific_clock_face" }
    ]
  },
  {
    requirement_id: "AR-PROP-03",
    name: "Toma memo",
    variants: [
      { variant_id: "memo-unverified", kind: "memo-unverified", shot_ids: ["shot-b02-02"], semantic_type: "fictional_unverified_memo" }
    ]
  },
  {
    requirement_id: "AR-DOC-01",
    name: "Fictional ledger variants",
    variants: [
      { variant_id: "ledger-opening", kind: "ledger-opening", shot_ids: ["shot-b03-01"], semantic_type: "fictional_ledger_opening" },
      { variant_id: "ledger-two-column", kind: "ledger-two-column", shot_ids: ["shot-b03-02"], semantic_type: "fictional_two_column_ledger" },
      { variant_id: "ledger-institution-shadow", kind: "ledger-institution-shadow", shot_ids: ["shot-b04-03"], semantic_type: "fictional_institution_ledger" },
      { variant_id: "ledger-blank-close", kind: "ledger-blank-close", shot_ids: ["shot-b06-02"], semantic_type: "fictional_blank_ledger" }
    ]
  },
  {
    requirement_id: "AR-DOC-02",
    name: "Equal-weight candidate system",
    variants: [
      { variant_id: "equal-hypotheses", kind: "equal-hypotheses", shot_ids: ["shot-b04-02"], semantic_type: "equal_weight_hypotheses" },
      { variant_id: "toma-fates", kind: "toma-fates", shot_ids: ["shot-b05-01"], semantic_type: "equal_weight_fate_candidates" },
      { variant_id: "moth-functions", kind: "moth-functions", shot_ids: ["shot-b05-02"], semantic_type: "equal_weight_function_candidates" },
      { variant_id: "council-motives", kind: "council-motives", shot_ids: ["shot-b05-03"], semantic_type: "equal_weight_motive_candidates" },
      { variant_id: "three-holds-open", kind: "three-holds-open", shot_ids: ["shot-b05-04"], semantic_type: "three_unresolved_subjects" },
      { variant_id: "three-holds-hold", kind: "three-holds-hold", shot_ids: ["shot-b05-04"], semantic_type: "three_equal_hold_states" }
    ]
  },
  {
    requirement_id: "AR-ABS-01",
    name: "Fading-name treatment",
    variants: [
      { variant_id: "name-full", kind: "name-full", shot_ids: ["shot-b03-03"], semantic_type: "full_letter_contour" },
      { variant_id: "name-fade", kind: "name-fade", shot_ids: ["shot-b03-03"], semantic_type: "fading_letter_contour" },
      { variant_id: "name-fragment", kind: "name-fragment", shot_ids: ["shot-b03-03"], semantic_type: "fragmented_letter_contour" }
    ]
  },
  {
    requirement_id: "AR-ABS-02",
    name: "Equal time-versus-name split",
    variants: [
      { variant_id: "time-vs-names", kind: "time-vs-names", shot_ids: ["shot-b06-01"], semantic_type: "equal_time_name_split" }
    ]
  },
  {
    requirement_id: "AR-TYPE-01",
    name: "Temporary Japanese-first text system",
    variants: [
      { variant_id: "noon-marker", kind: "noon-marker", shot_ids: ["shot-b01-03"], semantic_type: "japanese_noon_marker" },
      { variant_id: "ledger-labels", kind: "ledger-labels", shot_ids: ["shot-b03-02"], semantic_type: "japanese_ledger_labels" },
      { variant_id: "hypothesis-labels", kind: "hypothesis-labels", shot_ids: ["shot-b04-02"], semantic_type: "japanese_hypothesis_labels" },
      { variant_id: "unknown-motive", kind: "unknown-motive", shot_ids: ["shot-b04-03"], semantic_type: "japanese_unknown_label" },
      { variant_id: "hold-labels", kind: "hold-labels", shot_ids: ["shot-b05-04"], semantic_type: "japanese_hold_labels" },
      { variant_id: "time-name-labels", kind: "time-name-labels", shot_ids: ["shot-b06-01"], semantic_type: "japanese_equal_choice_labels" },
      { variant_id: "return-question", kind: "return-question", shot_ids: ["shot-b06-03"], semantic_type: "japanese_return_question" }
    ]
  }
];

const SHOT_VARIANT_STATES = {
  "shot-b03-03": {
    start: ["AR-ABS-01/name-full"],
    mid: ["AR-ABS-01/name-fade"],
    end: ["AR-ABS-01/name-fragment"]
  },
  "shot-b05-04": {
    start: ["AR-DOC-02/three-holds-open", "AR-TYPE-01/hold-labels"],
    mid: ["AR-DOC-02/three-holds-open", "AR-DOC-02/three-holds-hold", "AR-TYPE-01/hold-labels"],
    end: ["AR-DOC-02/three-holds-hold", "AR-TYPE-01/hold-labels"]
  }
};

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function csvEscape(value) {
  const text = Array.isArray(value) ? value.join("|") : String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(headers, rows) {
  return `${headers.join(",")}\n${rows.map((row) => headers.map((key) => csvEscape(row[key])).join(",")).join("\n")}\n`;
}

async function listFilesRecursive(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const child = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...await listFilesRecursive(child));
    else if (entry.isFile()) files.push(child.replaceAll("\\", "/"));
  }
  return files.sort();
}

async function inventoryFiles(files, base = ".") {
  const inventory = [];
  for (const filePath of [...files].sort()) {
    const bytes = await readFile(filePath);
    const info = await stat(filePath);
    inventory.push({ relative_path: path.relative(base, filePath).replaceAll("\\", "/"), byte_size: info.size, sha256: sha256(bytes) });
  }
  return {
    file_count: inventory.length,
    aggregate_sha256: sha256(Buffer.from(inventory.map((item) => `${item.relative_path}\t${item.byte_size}\t${item.sha256}\n`).join(""))),
    files: inventory
  };
}

async function treeDigest(root) {
  const files = await listFilesRecursive(root);
  const rows = [];
  for (const filePath of files) {
    const bytes = await readFile(filePath);
    const info = await stat(filePath);
    rows.push(`${path.relative(root, filePath).replaceAll("\\", "/")}|${info.size}|${sha256(bytes)}`);
  }
  return { file_count: rows.length, sha256: sha256(Buffer.from(rows.join("\n"))) };
}

async function fileDataUrl(filePath) {
  const bytes = await readFile(filePath);
  const extension = path.extname(filePath).toLowerCase();
  const mime = extension === ".png" ? "image/png" : extension === ".jpg" || extension === ".jpeg" ? "image/jpeg" : "application/octet-stream";
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

function bundledNodeModules() {
  if (process.env.FFF_NODE_MODULES) return process.env.FFF_NODE_MODULES;
  return path.join(process.env.USERPROFILE || "", ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules");
}

async function loadPlaywright() {
  const moduleRoot = bundledNodeModules();
  return await import(pathToFileURL(path.join(moduleRoot, "playwright", "index.mjs")).href);
}

async function loadSharp() {
  const moduleRoot = bundledNodeModules();
  const imported = await import(pathToFileURL(path.join(moduleRoot, "sharp", "lib", "index.js")).href);
  return imported.default || imported;
}

function variantKey(requirementId, variantId) {
  return `${requirementId}/${variantId}`;
}

function allVariants() {
  return FAMILY_DEFINITIONS.flatMap((family) => family.variants.map((variant) => ({ ...variant, requirement_id: family.requirement_id, family_name: family.name, key: variantKey(family.requirement_id, variant.variant_id) })));
}

function materialMarkup(kind) {
  const candidate = (label, note) => `<section class="candidate"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(note)}</span></section>`;
  const ledgerRows = [
    ["アサ", "12 分"],
    ["ミロ", "08 分"],
    ["ネイ", "21 分"],
    ["ソラ", "05 分"],
    ["イヴ", "17 分"]
  ].map(([name, minutes]) => `<div class="ledger-row"><span>${name}</span><span>${minutes}</span></div>`).join("");
  const blankRows = Array.from({ length: 5 }, () => '<div class="ledger-row"><span>＿＿＿＿</span><span>＿＿ 分</span></div>').join("");
  switch (kind) {
    case "council-neutral":
      return `<div class="frost-panel"></div><div class="council-table"></div><div class="people"><i class="person p1"></i><i class="person p2"></i><i class="person p3"></i></div><div class="tag left">評議会構成員 / 匿名</div><div class="note">役割不明 · 個人特定なし · 有罪を示さない</div>`;
    case "toma-unresolved":
      return `<div class="toma"><i></i><strong>トーマ</strong><span>輪郭のみ / 未確定</span></div><div class="fate-grid">${candidate("生存？", "候補 01")}${candidate("死亡？", "候補 02")}${candidate("消去？", "候補 03")}${candidate("潜伏？", "候補 04")}</div><div class="equal-note">4候補は同じ重み</div>`;
    case "repair-module":
      return `<div class="bench"><div class="tray"><span>歯車</span><i></i><i></i><i></i></div><div class="movement"><b>17</b><em>JEWELS</em></div><div class="tool t1"></div><div class="tool t2"></div></div><div class="tag left">時計修理 / 文字盤を外した状態</div><div class="note">人物の顔・final designは表示しない</div>`;
    case "time-0917":
      return `<div class="clock"><div class="ticks"></div><span class="n12">12</span><span class="n3">3</span><span class="n6">6</span><span class="n9">9</span><i class="hour"></i><i class="minute"></i><b>9:17</b></div><div class="tag right">閉店時刻motif</div><div class="note">時計停止の確定事実ではない</div>`;
    case "memo-unverified":
      return `<div class="memo"><div class="memo-meta"><span>差出人</span><strong>未確認</strong></div><p>9:17</p><p>鐘楼の空枠を確認</p><p>真鍮の蛾 — 機能不明</p><footer>真正性 / 由来 / 筆跡は未確定</footer></div><div class="tag right">TOMA MEMO ?</div>`;
    case "ledger-opening":
      return `<div class="book"><div class="page left-page"><h3>夜間記録</h3>${ledgerRows}</div><div class="page right-page"><h3>分配欄</h3>${blankRows}</div><div class="spine"></div></div><div class="tag left">FICTIONAL LEDGER / 架空挿入</div>`;
    case "ledger-two-column":
      return `<div class="ledger"><header><span>名前</span><span>分</span></header>${ledgerRows}<footer>FICTIONAL INSERT / 実在記録ではない</footer></div><div class="tag right">二列台帳</div>`;
    case "ledger-institution-shadow":
      return `<div class="ledger dark-ledger"><header><span>構成員</span><span>記録分</span></header>${ledgerRows}<footer>MOTIVE / RESPONSIBILITY UNKNOWN</footer></div><div class="partition-line"></div><div class="tag left">制度記録の影 / 架空</div>`;
    case "ledger-blank-close":
      return `<div class="ledger blank-ledger"><header><span>名前</span><span>分</span></header>${blankRows}<footer>未記入 / NO CONCLUSION</footer></div><div class="closing-cover"></div><div class="tag right">結論を書かない</div>`;
    case "equal-hypotheses":
      return `<div class="equal-grid two">${candidate("時間販売の告発？", "仮説 A / 50%")}${candidate("偽の記録？", "仮説 B / 50%")}</div><div class="equal-axis">＝</div><div class="note">勝敗・採用・canon優先なし</div>`;
    case "toma-fates":
      return `<div class="equal-grid four">${candidate("生存？", "HOLD")}${candidate("死亡？", "HOLD")}${candidate("消去？", "HOLD")}${candidate("潜伏？", "HOLD")}</div><div class="tag left">トーマの運命候補</div>`;
    case "moth-functions":
      return `<div class="moth-body"><i class="wing left-wing"></i><i class="wing right-wing"></i><b></b></div><div class="equal-grid three">${candidate("鍵？", "HOLD")}${candidate("監視？", "HOLD")}${candidate("記憶？", "HOLD")}</div><div class="tag left">真鍮の蛾 / 機能候補</div>`;
    case "council-motives":
      return `<div class="equal-grid four">${candidate("悪意？", "未決定")}${candidate("窮余？", "未決定")}${candidate("分裂？", "未決定")}${candidate("誤認？", "未決定")}</div><div class="tag right">評議会 / 動機候補</div>`;
    case "three-holds-open":
      return `<div class="hold-grid"><section><strong>トーマ</strong><span>運命候補</span></section><section><strong>真鍮の蛾</strong><span>機能候補</span></section><section><strong>評議会</strong><span>動機候補</span></section></div><div class="tag left">3つの未解決事項</div>`;
    case "three-holds-hold":
      return `<div class="hold-grid hold"><section><strong>トーマ</strong><span>HOLD</span></section><section><strong>真鍮の蛾</strong><span>HOLD</span></section><section><strong>評議会</strong><span>HOLD</span></section></div><div class="equal-note">すべて同じ保留状態</div>`;
    case "name-full":
      return `<div class="name-stage"><strong class="full">N A M E / 名前</strong><span>完全な輪郭</span></div>`;
    case "name-fade":
      return `<div class="name-stage"><strong class="fade">N A M E / 名前</strong><span>薄れる輪郭</span></div>`;
    case "name-fragment":
      return `<div class="name-stage"><strong class="fragment">N&nbsp;&nbsp;M&nbsp;&nbsp;/&nbsp;名</strong><span>欠けた輪郭</span></div>`;
    case "time-vs-names":
      return `<div class="split-choice"><section class="time-choice"><div class="mini-clock"><i></i><b></b></div><strong>時間</strong><span>46%</span></section><div class="blank-choice">未決定<br><b>8%</b></div><section class="name-choice"><div class="name-fields">名前<br>＿＿＿＿<br>＿＿＿＿</div><strong>名前</strong><span>46%</span></section></div><div class="note">同じ重み / 選択なし</div>`;
    case "noon-marker":
      return `<div class="type-card top-left"><strong>正午 / 12:00</strong><span>空枠を保持</span></div>`;
    case "ledger-labels":
      return `<div class="type-card bottom-right"><strong>名前　｜　分</strong><span>架空台帳</span></div>`;
    case "hypothesis-labels":
      return `<div class="type-card bottom-center"><strong>二説は同じ重み</strong><span>未決定</span></div>`;
    case "unknown-motive":
      return `<div class="type-card bottom-left"><strong>評議会の動機：不明</strong><span>責任範囲も未決定</span></div>`;
    case "hold-labels":
      return `<div class="type-card bottom-center"><strong>複数の説を保留</strong><span>どれも物語の真実ではない</span></div>`;
    case "time-name-labels":
      return `<div class="type-card top-center"><strong>時間　｜　名前</strong><span>結末候補 / 未選択</span></div>`;
    case "return-question":
      return `<div class="type-card bottom-center"><strong>時間か、名前か</strong><span>冒頭の空枠へ戻る</span></div>`;
    default:
      throw new Error(`Unknown material variant kind: ${kind}`);
  }
}

function renderMaterialHtml(family, variant) {
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>
  *{box-sizing:border-box}html,body{margin:0;width:960px;height:540px;overflow:hidden;background:transparent;color:#f4efe2;font-family:"Yu Gothic UI","Noto Sans JP","Segoe UI",sans-serif}.material{position:relative;width:960px;height:540px;overflow:hidden}.material:before{content:"";position:absolute;inset:28px;border:1px solid rgba(226,190,122,.22);pointer-events:none}.mark{position:absolute;right:28px;top:18px;z-index:30;padding:7px 10px;background:#071012e6;border:1px solid #ffffff55;font:700 10px/1.1 ui-monospace,Consolas,monospace;letter-spacing:.08em}.family-id{position:absolute;left:28px;top:18px;z-index:30;padding:7px 10px;background:#071012d9;border-left:5px solid #d4a45e;font:800 12px/1.1 ui-monospace,Consolas,monospace}.tag{position:absolute;z-index:20;padding:9px 13px;background:#081012e6;border:1px solid #ffffff55;font-weight:800;letter-spacing:.06em}.tag.left{left:56px;bottom:62px}.tag.right{right:56px;bottom:62px}.note,.equal-note{position:absolute;left:50%;bottom:24px;transform:translateX(-50%);z-index:20;padding:7px 12px;background:#071012e6;border-top:2px solid #c69554;white-space:nowrap;font-size:13px}.frost-panel{position:absolute;left:170px;right:100px;top:65px;bottom:90px;background:linear-gradient(110deg,rgba(198,218,214,.36),rgba(45,65,69,.62));border:3px solid rgba(231,240,234,.35);box-shadow:inset 0 0 70px #d8efeb22}.council-table{position:absolute;left:155px;right:75px;bottom:88px;height:72px;background:linear-gradient(#5b4938,#1d1714);transform:skewX(-8deg);box-shadow:0 18px 28px #0008}.people{position:absolute;left:250px;right:160px;bottom:150px;height:270px}.person{position:absolute;bottom:0;width:120px;height:190px;border-radius:56px 56px 18px 18px;background:linear-gradient(#304044,#12191b);box-shadow:0 -75px 0 -30px #1e292c}.p1{left:0;transform:scale(.92)}.p2{left:190px;height:220px}.p3{left:390px;transform:scale(.96)}.toma{position:absolute;left:80px;top:88px;width:260px;height:340px;display:grid;place-items:center;background:radial-gradient(circle at 50% 28%,#394b50 0 42px,transparent 44px),linear-gradient(110deg,transparent 24%,#253438 25% 74%,transparent 75%);filter:drop-shadow(0 18px 24px #0008)}.toma i{position:absolute;left:85px;top:100px;width:90px;height:155px;border:2px dashed #cbd7d433}.toma strong{align-self:end;font-size:28px}.toma span{align-self:start;color:#b8c5c2}.fate-grid{position:absolute;left:390px;right:70px;top:105px;bottom:90px;display:grid;grid-template-columns:1fr 1fr;gap:14px}.candidate{position:relative;display:flex;flex-direction:column;justify-content:center;gap:10px;padding:22px;background:linear-gradient(145deg,#203034e8,#111a1ce8);border:1px solid #9db0ad77;box-shadow:inset 0 0 0 1px #0008}.candidate strong{font-size:23px}.candidate span{color:#d1b57c;font:700 12px/1 ui-monospace,Consolas,monospace}.bench{position:absolute;left:72px;right:70px;top:90px;bottom:80px;background:linear-gradient(10deg,#2f241b,#75614a);border:8px solid #16110e;box-shadow:0 24px 36px #000a}.tray{position:absolute;left:50px;top:55px;width:380px;height:230px;border:10px solid #493827;background:#171d1e;display:flex;align-items:center;justify-content:space-evenly}.tray span{position:absolute;left:14px;top:10px;color:#c9b486;font-size:12px}.tray i{width:72px;height:72px;border:13px dotted #b48c4e;border-radius:50%;box-shadow:0 0 0 3px #42331f}.movement{position:absolute;right:75px;top:45px;width:230px;height:230px;border-radius:50%;background:radial-gradient(circle,#172125 0 18%,#ad874d 19% 22%,#242b2d 23% 46%,#bd9453 47% 50%,#151d20 51%);display:grid;place-items:center}.movement b{font-size:48px}.movement em{position:absolute;bottom:42px;font-size:11px;color:#d8c49d}.tool{position:absolute;bottom:42px;width:300px;height:10px;background:#b9ada0;transform-origin:left}.t1{left:420px;transform:rotate(-11deg)}.t2{left:480px;transform:rotate(8deg)}.clock{position:absolute;left:180px;top:70px;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,#e4d7b9 0 58%,#9c7844 59% 64%,#33281c 65%);box-shadow:0 26px 50px #000a,inset 0 0 32px #5a3d1c}.clock .ticks{position:absolute;inset:47px;border:8px dotted #30271e;border-radius:50%}.clock span{position:absolute;color:#2a221b;font:800 24px/1 Georgia,serif}.n12{left:182px;top:28px}.n3{right:32px;top:188px}.n6{left:190px;bottom:28px}.n9{left:30px;top:188px}.clock i{position:absolute;left:198px;top:198px;transform-origin:4px 4px;background:#241b14;border-radius:4px}.clock .hour{width:112px;height:8px;transform:rotate(198deg)}.clock .minute{width:150px;height:5px;transform:rotate(12deg)}.clock b{position:absolute;right:-210px;top:105px;font:900 82px/1 ui-monospace,Consolas,monospace;color:#efd69d;text-shadow:0 5px 20px #000}.memo{position:absolute;left:160px;top:74px;width:560px;height:390px;padding:55px 58px 38px;background:linear-gradient(95deg,#e4d3aa,#cdb78a);color:#30271e;transform:rotate(-1.2deg);box-shadow:0 24px 45px #0009}.memo:before{content:"";position:absolute;inset:24px;border:1px solid #725f4177}.memo p{margin:16px 0;padding-bottom:8px;border-bottom:1px solid #7b684866;font:700 22px/1.25 "Yu Gothic UI",sans-serif}.memo footer{position:absolute;left:58px;bottom:28px;font-size:12px;color:#66563e}.memo-meta{display:flex;justify-content:space-between;font-size:13px}.memo-meta strong{color:#8d3428}.book{position:absolute;left:100px;right:90px;top:80px;bottom:66px;display:grid;grid-template-columns:1fr 1fr;transform:perspective(900px) rotateX(4deg);filter:drop-shadow(0 24px 28px #000a)}.page{padding:42px 35px;background:#dac69d;color:#30271e;border:1px solid #7c6745}.left-page{transform:skewY(1.5deg)}.right-page{transform:skewY(-1.5deg)}.page h3{margin:0 0 20px;padding-bottom:10px;border-bottom:2px solid #765d39}.spine{position:absolute;left:50%;top:0;bottom:0;width:14px;transform:translateX(-50%);background:linear-gradient(90deg,#5b472f,#b89b69,#5b472f)}.ledger{position:absolute;left:160px;right:140px;top:78px;bottom:72px;padding:36px;background:#d8c59b;color:#2d251d;border:12px solid #433629;box-shadow:0 25px 40px #0009}.ledger header,.ledger-row{display:grid;grid-template-columns:2fr 1fr}.ledger header{font-weight:900;border-bottom:3px double #5c4934;padding:0 16px 12px}.ledger-row{padding:9px 16px;border-bottom:1px solid #765f4166}.ledger-row span:last-child{text-align:right}.ledger footer{position:absolute;left:36px;right:36px;bottom:15px;font-size:11px;border-top:1px solid #6a563d;padding-top:8px}.dark-ledger{left:90px;right:400px;top:90px;bottom:80px;filter:brightness(.72);transform:perspective(900px) rotateY(8deg)}.partition-line{position:absolute;right:235px;top:72px;width:9px;height:400px;background:linear-gradient(#d9ecec22,#d9ecec99,#d9ecec22);box-shadow:0 0 36px #d8eeee55}.blank-ledger{left:110px;right:330px}.closing-cover{position:absolute;right:155px;top:110px;width:300px;height:330px;background:linear-gradient(135deg,#342c26,#171412);border:8px solid #61513d;transform:perspective(700px) rotateY(-24deg);box-shadow:0 30px 38px #000a}.equal-grid{position:absolute;display:grid;gap:14px}.equal-grid.two{left:120px;right:120px;top:120px;bottom:110px;grid-template-columns:1fr 1fr}.equal-grid.three{left:210px;right:80px;top:300px;bottom:62px;grid-template-columns:repeat(3,1fr)}.equal-grid.four{left:170px;right:70px;top:105px;bottom:85px;grid-template-columns:1fr 1fr}.equal-axis{position:absolute;left:50%;top:250px;transform:translate(-50%,-50%);z-index:10;width:54px;height:54px;border-radius:50%;display:grid;place-items:center;background:#d2aa67;color:#172023;font-size:32px;font-weight:900}.moth-body{position:absolute;left:75px;top:105px;width:280px;height:260px}.moth-body b{position:absolute;left:128px;top:75px;width:24px;height:150px;border-radius:50%;background:linear-gradient(#c49b58,#5b4221)}.wing{position:absolute;top:45px;width:120px;height:165px;border:8px solid #bc9452;background:#5d432c88}.left-wing{left:10px;border-radius:80% 20% 70% 30%;transform:rotate(14deg)}.right-wing{right:10px;border-radius:20% 80% 30% 70%;transform:rotate(-14deg)}.hold-grid{position:absolute;left:90px;right:90px;top:140px;bottom:115px;display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.hold-grid section{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:#1a292ce8;border:1px solid #9aadaa77}.hold-grid strong{font-size:24px}.hold-grid span{color:#d5b16e;font:800 13px/1 ui-monospace,Consolas,monospace}.hold-grid.hold section{border-color:#d2aa67;box-shadow:inset 0 0 0 2px #d2aa6733}.name-stage{position:absolute;left:110px;right:100px;top:125px;bottom:110px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:35px;background:linear-gradient(95deg,#e0cfa8e8,#bfa87de8);color:#342b21;border:5px solid #5b4934}.name-stage strong{font:900 58px/1 ui-monospace,Consolas,monospace;letter-spacing:.12em}.name-stage .fade{opacity:.48;text-shadow:12px 0 0 #342b211a}.name-stage .fragment{color:transparent;-webkit-text-stroke:2px #342b2199;opacity:.55}.name-stage span{font-weight:800}.split-choice{position:absolute;left:65px;right:65px;top:85px;bottom:75px;display:grid;grid-template-columns:46fr 8fr 46fr;gap:12px}.split-choice section{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:#162326e8;border:1px solid #a8b8b577}.split-choice strong{font-size:34px}.split-choice span{font:900 18px/1 ui-monospace,Consolas,monospace;color:#d5b16e}.blank-choice{display:grid;place-items:center;text-align:center;background:#080d0ed9;border:1px dashed #d5b16e;color:#c8d2d0;font-size:11px}.mini-clock{position:relative;width:120px;height:120px;border-radius:50%;border:8px solid #c79c55;background:#d8c9a9}.mini-clock i,.mini-clock b{position:absolute;left:55px;top:55px;transform-origin:5px 5px;background:#30271e}.mini-clock i{width:42px;height:6px;transform:rotate(198deg)}.mini-clock b{width:50px;height:4px;transform:rotate(12deg)}.name-fields{padding:12px 26px;background:#d8c9a9;color:#30271e;line-height:1.8}.type-card{position:absolute;z-index:25;min-width:290px;max-width:560px;padding:13px 18px;background:#071012e8;border-left:6px solid #d3a55e;box-shadow:0 10px 28px #0009}.type-card strong{display:block;font-size:24px}.type-card span{display:block;margin-top:6px;color:#becbc8;font-size:12px}.top-left{left:55px;top:75px}.top-center{left:50%;top:75px;transform:translateX(-50%)}.bottom-left{left:55px;bottom:65px}.bottom-right{right:55px;bottom:65px}.bottom-center{left:50%;bottom:65px;transform:translateX(-50%);text-align:center}
  </style></head><body><main class="material" data-signature="${DESIGN_SIGNATURE}" data-requirement="${family.requirement_id}" data-variant="${variant.variant_id}"><div class="family-id">${family.requirement_id} · ${escapeHtml(variant.variant_id)}</div><div class="mark">${WATERMARK}</div>${materialMarkup(variant.kind)}</main></body></html>`;
}

async function verifyProtectedInputs() {
  const design = await readJson(DESIGN_DIRECTION_PATH);
  if (design.selected_candidate_signature !== DESIGN_SIGNATURE || design.recorded_before_direction_generation !== true) {
    throw new Error("DESIGN_DIRECTION_NOT_PREDECLARED");
  }
  for (const [filePath, expected] of Object.entries(PROTECTED_DIRTY_HASHES)) {
    if (!existsSync(filePath)) throw new Error(`PROTECTED_DIRTY_FILE_MISSING: ${filePath}`);
    const observed = sha256(await readFile(filePath));
    if (observed !== expected) throw new Error(`PROTECTED_DIRTY_FILE_CHANGED: ${filePath}`);
  }
  for (const [filePath, expected] of Object.entries(PROTECTED_RESULT_HASHES)) {
    if (!existsSync(filePath)) throw new Error(`PROTECTED_RESULT_MISSING: ${filePath}`);
    const observed = sha256(await readFile(filePath));
    if (observed !== expected) throw new Error(`PROTECTED_RESULT_CHANGED: ${filePath}`);
  }
  const treeEvidence = {};
  for (const [root, expected] of Object.entries(PROTECTED_TREE_HASHES)) {
    const observed = await treeDigest(root);
    if (observed.sha256 !== expected) throw new Error(`PROTECTED_TREE_CHANGED: ${root}`);
    treeEvidence[root] = observed;
  }
  const [preview, previewManifest, previewResult, readiness, readinessManifest, integratedManifest] = await Promise.all([
    readJson(PREVIEW_MODEL_PATH),
    readJson(PREVIEW_MANIFEST_PATH),
    readJson(PREVIEW_RESULT_PATH),
    readJson(READINESS_MODEL_PATH),
    readJson(READINESS_MANIFEST_PATH),
    readJson(INTEGRATED_MANIFEST_PATH)
  ]);
  if (preview.artifact_id !== "fff-private-previsualization-timeline-001" || preview.duration_seconds !== 180 || preview.beats.length !== 6 || preview.shots.length !== 19) {
    throw new Error("ACCEPTED_PREVIEW_IDENTITY_CHANGED");
  }
  if (preview.timeline_tracks.subtitles.length !== 20 || preview.timeline_tracks.narration_text.length !== 6) {
    throw new Error("ACCEPTED_TEXT_TRACK_IDENTITY_CHANGED");
  }
  if (previewManifest.mp4.sha256 !== ACCEPTED_PREVIEW_MP4_SHA256 || previewResult.passed !== true) {
    throw new Error("ACCEPTED_PREVIEW_RESULT_CHANGED");
  }
  if (preview.source_fingerprint !== integratedManifest.package_fingerprint_sha256) {
    throw new Error("INTEGRATED_SOURCE_FINGERPRINT_CHANGED");
  }
  if (readinessManifest.package_fingerprint_sha256 !== preview.readiness_current_fingerprint) {
    throw new Error("READINESS_SOURCE_FINGERPRINT_CHANGED");
  }
  if (preview.source_reference_audit.ambiguous_reference_ids_rendered.length !== 0) {
    throw new Error("AMBIGUOUS_REFERENCE_ALREADY_RENDERED");
  }
  for (const reference of readiness.references) {
    if (!existsSync(reference.local_path)) throw new Error(`SOURCE_IMAGE_MISSING: ${reference.canonical_reference_id}`);
    if (sha256(await readFile(reference.local_path)) !== reference.sha256) throw new Error(`SOURCE_IMAGE_CHANGED: ${reference.canonical_reference_id}`);
  }
  const requirementById = new Map(readiness.requirements.map((item) => [item.requirement_id, item]));
  const variantShotsByRequirement = new Map(FAMILY_DEFINITIONS.map((family) => [
    family.requirement_id,
    [...new Set(family.variants.flatMap((variant) => variant.shot_ids))].sort()
  ]));
  for (const requirementId of DETERMINISTIC_REQUIREMENT_IDS) {
    const requirement = requirementById.get(requirementId);
    if (!requirement || requirement.recommended_disposition !== "create_deterministic_original") {
      throw new Error(`DETERMINISTIC_REQUIREMENT_CHANGED: ${requirementId}`);
    }
    const expectedShots = [...requirement.shot_ids].sort();
    const mappedShots = variantShotsByRequirement.get(requirementId);
    if (JSON.stringify(expectedShots) !== JSON.stringify(mappedShots)) {
      throw new Error(`REQUIREMENT_SHOT_MAPPING_MISMATCH: ${requirementId}`);
    }
  }
  const coverage = [...new Set(DETERMINISTIC_REQUIREMENT_IDS.flatMap((id) => requirementById.get(id).shot_ids))].sort();
  if (coverage.length !== 17) throw new Error(`DETERMINISTIC_COVERAGE_CHANGED: ${coverage.length}`);
  return {
    preview,
    readiness,
    readiness_manifest: readinessManifest,
    integrated_manifest: integratedManifest,
    protected_tree_evidence: treeEvidence,
    deterministic_coverage_shot_ids: coverage
  };
}

async function imageAudit(filePath, sharp, minimumEntropy = 1.1) {
  const stats = await sharp(filePath).ensureAlpha().stats();
  const alpha = stats.channels[3]?.mean ?? 255;
  const metadata = await sharp(filePath).metadata();
  return {
    width: metadata.width,
    height: metadata.height,
    entropy: Number(stats.entropy.toFixed(6)),
    alpha_mean: Number(alpha.toFixed(6)),
    minimum_entropy: minimumEntropy,
    non_blank: stats.entropy > minimumEntropy && alpha > 4
  };
}

async function renderMaterialOutputs(browser, sharp, requestedFamilyId = null) {
  const families = requestedFamilyId
    ? FAMILY_DEFINITIONS.filter((family) => family.requirement_id === requestedFamilyId)
    : FAMILY_DEFINITIONS;
  if (!families.length) throw new Error(`Unknown material family: ${requestedFamilyId}`);
  const page = await browser.newPage({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 1, colorScheme: "dark", reducedMotion: "reduce" });
  const renderedFamilies = [];
  for (const family of families) {
    const familyRoot = `${MATERIAL_ROOT}/${family.requirement_id}`;
    await mkdir(familyRoot, { recursive: true });
    const variants = [];
    for (const variant of family.variants) {
      const outputPath = `${familyRoot}/${variant.variant_id}.png`;
      await page.setContent(renderMaterialHtml(family, variant), { waitUntil: "load" });
      await page.screenshot({ path: outputPath, type: "png", omitBackground: true, animations: "disabled" });
      const bytes = await readFile(outputPath);
      const audit = await imageAudit(outputPath, sharp, family.requirement_id === "AR-TYPE-01" ? 0.4 : 1.1);
      if (!audit.non_blank) throw new Error(`NEAR_BLANK_MATERIAL_OUTPUT: ${family.requirement_id}/${variant.variant_id}`);
      variants.push({
        ...variant,
        output_path: outputPath,
        byte_size: bytes.length,
        sha256: sha256(bytes),
        image_audit: audit
      });
    }
    renderedFamilies.push({
      requirement_id: family.requirement_id,
      family_name: family.name,
      deterministic_source_recipe: `${DESIGN_SIGNATURE}/${family.requirement_id}`,
      deterministic_local_original: true,
      selected_for_production: false,
      rights_cleared_claim: false,
      regeneration_command: `node tools/fff-private-materialized-motion-previs.mjs render-family ${family.requirement_id}`,
      variants
    });
  }
  await page.close();
  return renderedFamilies;
}

function shotMaterialKeys(shotId) {
  return allVariants().filter((variant) => variant.shot_ids.includes(shotId)).map((variant) => variant.key);
}

function shotStateMaterialKeys(shotId, state) {
  return SHOT_VARIANT_STATES[shotId]?.[state] || shotMaterialKeys(shotId);
}

function motionEvidence(motion) {
  const locked = { scale: 1, x: 0, y: 0, foreground_x: 0, opacity: 1 };
  const map = {
    locked: { start: { ...locked }, mid: { ...locked }, end: { ...locked } },
    slow_push: {
      start: { scale: 1, x: 0, y: 0, opacity: 1 },
      mid: { scale: 1.03, x: 0, y: 0, opacity: 1 },
      end: { scale: 1.06, x: 0, y: 0, opacity: 1 }
    },
    slow_pull: {
      start: { scale: 1.06, x: 0, y: 0, opacity: 1 },
      mid: { scale: 1.03, x: 0, y: 0, opacity: 1 },
      end: { scale: 1, x: 0, y: 0, opacity: 1 }
    },
    slow_pan: {
      start: { scale: 1.08, x: -32, y: 0, opacity: 1 },
      mid: { scale: 1.08, x: 0, y: 0, opacity: 1 },
      end: { scale: 1.08, x: 32, y: 0, opacity: 1 }
    },
    controlled_parallax: {
      start: { scale: 1.02, x: -12, y: 0, foreground_x: 18, opacity: 1 },
      mid: { scale: 1.03, x: 0, y: 0, foreground_x: 0, opacity: 1 },
      end: { scale: 1.04, x: 12, y: 0, foreground_x: -18, opacity: 1 }
    },
    graphic_dissolve: {
      start: { scale: 1, x: 0, y: 0, opacity: 0 },
      mid: { scale: 1, x: 0, y: 0, opacity: 0.5 },
      end: { scale: 1, x: 0, y: 0, opacity: 1 }
    }
  };
  if (!map[motion]) throw new Error(`Unknown motion class: ${motion}`);
  return map[motion];
}

function transitionEvidence(type) {
  const map = {
    hard_cut: { duration_seconds: 0, render_transition: "frame_boundary_cut" },
    short_dissolve: { duration_seconds: 0.6, render_transition: "dissolve" },
    match_cut: { duration_seconds: 0.16, render_transition: "fade" },
    graphic_match: { duration_seconds: 0.45, render_transition: "smoothleft" },
    held_fade: { duration_seconds: 0.75, render_transition: "fadeblack" }
  };
  if (!map[type]) throw new Error(`Unknown transition class: ${type}`);
  return map[type];
}

function buildModel(source, materialFamilies) {
  const materialByKey = new Map(materialFamilies.flatMap((family) => family.variants.map((variant) => [variantKey(family.requirement_id, variant.variant_id), variant])));
  const readinessShotById = new Map(source.readiness.shots.map((shot) => [shot.shot_id, shot]));
  const shots = source.preview.shots.map((shot) => {
    const readinessShot = readinessShotById.get(shot.shot_id);
    const keys = shotMaterialKeys(shot.shot_id);
    for (const key of keys) if (!materialByKey.has(key)) throw new Error(`Missing rendered material: ${shot.shot_id}/${key}`);
    return {
      ...shot,
      requirement_ids: readinessShot.requirement_ids,
      deterministic_requirement_ids: readinessShot.requirement_ids.filter((id) => DETERMINISTIC_REQUIREMENT_IDS.includes(id)),
      material_variant_keys: keys,
      materialized: keys.length > 0,
      motion_evidence: motionEvidence(shot.motion),
      transition_evidence: transitionEvidence(shot.transition),
      frame_sequence: {
        start_path: `${FRAME_ROOT}/${shot.shot_id}-start.png`,
        mid_path: `${FRAME_ROOT}/${shot.shot_id}-mid.png`,
        end_path: `${FRAME_ROOT}/${shot.shot_id}-end.png`
      }
    };
  });
  return {
    schemaVersion: "fff.privateMaterializedMotionPrevis.v1",
    artifact_id: ARTIFACT_ID,
    mission_id: MISSION_ID,
    title_ja: "Private Materialized Motion Previsualization",
    generated_at: GENERATED_AT,
    selected_candidate_signature: DESIGN_SIGNATURE,
    source_artifact_id: source.preview.artifact_id,
    source_mp4_sha256: ACCEPTED_PREVIEW_MP4_SHA256,
    source_integrated_fingerprint: source.integrated_manifest.package_fingerprint_sha256,
    source_readiness_fingerprint: source.readiness_manifest.package_fingerprint_sha256,
    accepted_human_decisions: {
      private_preview_experience: "accept",
      preview_material_defect: false,
      existing_preview_repair_required: false,
      recommended_asset_plan: "A",
      exception_requirement_ids: [],
      new_human_gate_required_inside_mission: false
    },
    duration_seconds: 180,
    timebase_fps: 30,
    frame_profile: { width: 960, height: 540, aspect_ratio: "16:9" },
    beats: source.preview.beats,
    shots,
    material_families: materialFamilies,
    timeline_tracks: source.preview.timeline_tracks,
    materialized_coverage: {
      requirement_count: DETERMINISTIC_REQUIREMENT_IDS.length,
      covered_shot_count: source.deterministic_coverage_shot_ids.length,
      covered_shot_ids: source.deterministic_coverage_shot_ids,
      uncovered_shot_ids: source.preview.shots.map((shot) => shot.shot_id).filter((id) => !source.deterministic_coverage_shot_ids.includes(id))
    },
    source_reference_boundaries: {
      replacement_pending_requirement_ids: ["AR-ENV-01", "AR-ENV-02", "AR-CHAR-01"],
      private_reference_proxy_requirement_ids: ["AR-PROP-02"],
      audio_future_lane_requirement_ids: ["AR-AUDIO-01"],
      ambiguous_reference_ids: AMBIGUOUS_REFERENCE_IDS,
      ambiguous_reference_ids_rendered: [],
      voice_selected: false,
      voice_generated: false
    },
    quarantine_audit: {
      selected_candidate_signature: DESIGN_SIGNATURE,
      generic_symbolic_primary_count: 0,
      near_blank_abstract_frame_count: 0,
      repeated_unlabelled_thumbnail_count: 0,
      oversized_display_title_count: 0,
      slogan_or_reader_navigation_heading_count: 0
    },
    boundaries: {
      private_local_only: true,
      silent: true,
      reference_only_sources_retained: true,
      deterministic_local_rendering: true,
      image_generation: false,
      audio_generation: false,
      ai_video_generation: false,
      new_media_downloaded: false,
      selected_for_production: false,
      rights_cleared_claim: false,
      legal_clearance_claim: false,
      public_release: false,
      public_upload: false,
      database_persistence: false,
      final_canon_decision: false,
      replaces_accepted_private_preview: false
    }
  };
}

function renderShotSourceHtml(shot, baseDataUrl, materialData, state, { includeBase = true, includeWatermark = true, includeMaterials = true } = {}) {
  const keys = includeMaterials ? shotStateMaterialKeys(shot.shot_id, state) : [];
  const layers = keys.map((key, index) => {
    const source = materialData.get(key);
    if (!source) throw new Error(`Missing material data URL: ${key}`);
    const opacity = shot.shot_id === "shot-b05-04" && state === "mid" ? 0.62 + index * 0.16 : 1;
    return `<img class="material-layer" src="${source}" alt="" style="opacity:${Math.min(1, opacity)}">`;
  }).join("");
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>
  *{box-sizing:border-box}html,body{margin:0;width:960px;height:540px;overflow:hidden;background:${includeBase ? "#080c0e" : "transparent"}}.shot{position:relative;width:960px;height:540px;overflow:hidden}.base{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(.5) saturate(.72) contrast(1.08)}.shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(4,8,9,.25),rgba(4,8,9,.03) 45%,rgba(4,8,9,.32))}.material-layer{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}.shot-id{position:absolute;left:18px;bottom:17px;padding:6px 9px;background:#071012df;border-left:4px solid #d4a45e;color:#eaf0ed;font:700 10px/1.1 ui-monospace,Consolas,monospace;letter-spacing:.06em}.mark{position:absolute;right:17px;top:15px;padding:6px 9px;background:#071012e8;border:1px solid #ffffff55;color:#f3ede0;font:700 9px/1.1 ui-monospace,Consolas,monospace;letter-spacing:.08em}
  </style></head><body><main class="shot" data-shot="${shot.shot_id}" data-state="${state}">${includeBase ? `<img class="base" src="${baseDataUrl}" alt=""><div class="shade"></div>` : ""}${layers}${includeWatermark ? `<div class="mark">${WATERMARK}</div><div class="shot-id">${shot.shot_id} · ${state}</div>` : ""}</main></body></html>`;
}

async function renderShotSources(model, browser, materialFamilies, tempRoot) {
  const materialData = new Map();
  for (const family of materialFamilies) {
    for (const variant of family.variants) materialData.set(variantKey(family.requirement_id, variant.variant_id), await fileDataUrl(variant.output_path));
  }
  const page = await browser.newPage({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 1, colorScheme: "dark", reducedMotion: "reduce" });
  const sourceByShot = new Map();
  for (const shot of model.shots) {
    const shotRoot = path.join(tempRoot, "sources", shot.shot_id);
    await mkdir(shotRoot, { recursive: true });
    const baseDataUrl = await fileDataUrl(`${PREVIEW_ROOT}/frames/${shot.shot_id}.jpg`);
    const statePaths = {};
    for (const state of ["start", "mid", "end"]) {
      const outputPath = path.join(shotRoot, `${state}.png`);
      await page.setContent(renderShotSourceHtml(shot, baseDataUrl, materialData, state), { waitUntil: "load" });
      await page.screenshot({ path: outputPath, type: "png", animations: "disabled" });
      statePaths[state] = outputPath;
    }
    if (shot.motion === "controlled_parallax") {
      const backgroundPath = path.join(shotRoot, "background.png");
      const foregroundPath = path.join(shotRoot, "foreground.png");
      await page.setContent(renderShotSourceHtml(shot, baseDataUrl, materialData, "mid", { includeBase: true, includeWatermark: true, includeMaterials: false }), { waitUntil: "load" });
      await page.screenshot({ path: backgroundPath, type: "png", animations: "disabled" });
      await page.setContent(renderShotSourceHtml(shot, baseDataUrl, materialData, "mid", { includeBase: false, includeWatermark: false, includeMaterials: true }), { waitUntil: "load" });
      await page.screenshot({ path: foregroundPath, type: "png", animations: "disabled", omitBackground: true });
      statePaths.background = backgroundPath;
      statePaths.foreground = foregroundPath;
    }
    sourceByShot.set(shot.shot_id, statePaths);
  }
  await page.close();
  return sourceByShot;
}

async function runFfmpeg(args) {
  await execFile("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { windowsHide: true, maxBuffer: 16 * 1024 * 1024 });
}

function h264Args() {
  return ["-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "21", "-pix_fmt", "yuv420p", "-g", "30", "-keyint_min", "30", "-sc_threshold", "0", "-map_metadata", "-1"];
}

async function encodeBaseMotionClip(shot, sources, outputPath) {
  const frameCount = shot.duration_seconds * 30;
  const denominator = Math.max(1, frameCount - 1);
  if (shot.motion === "graphic_dissolve") {
    await runFfmpeg([
      "-loop", "1", "-framerate", "30", "-t", String(shot.duration_seconds), "-i", sources.start,
      "-loop", "1", "-framerate", "30", "-t", String(shot.duration_seconds), "-i", sources.end,
      "-filter_complex", `[0:v]fps=30,settb=1/30,setpts=PTS-STARTPTS[a];[1:v]fps=30,settb=1/30,setpts=PTS-STARTPTS[b];[a][b]xfade=transition=dissolve:duration=${shot.duration_seconds}:offset=0,trim=duration=${shot.duration_seconds},format=yuv420p[v]`,
      "-map", "[v]", "-frames:v", String(frameCount), ...h264Args(), outputPath
    ]);
    return;
  }
  if (shot.motion === "controlled_parallax") {
    await runFfmpeg([
      "-loop", "1", "-framerate", "30", "-i", sources.background,
      "-loop", "1", "-framerate", "30", "-i", sources.foreground,
      "-filter_complex", `[0:v]scale=1000:563,crop=960:540:x='20+20*n/${denominator}':y=11,fps=30[bg];[1:v]format=rgba[fg];[bg][fg]overlay=x='18-36*n/${denominator}':y=0:eval=frame:shortest=1,format=yuv420p[v]`,
      "-map", "[v]", "-frames:v", String(frameCount), ...h264Args(), outputPath
    ]);
    return;
  }
  let filter = "scale=960:540:flags=lanczos,fps=30,format=yuv420p";
  if (shot.motion === "slow_push") {
    filter = `zoompan=z='1+0.06*on/${denominator}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frameCount}:s=960x540:fps=30,format=yuv420p`;
  } else if (shot.motion === "slow_pull") {
    filter = `zoompan=z='1.06-0.06*on/${denominator}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frameCount}:s=960x540:fps=30,format=yuv420p`;
  } else if (shot.motion === "slow_pan") {
    filter = `zoompan=z='1.08':x='(iw-iw/zoom)*on/${denominator}':y='ih/2-(ih/zoom/2)':d=${frameCount}:s=960x540:fps=30,format=yuv420p`;
  } else if (shot.motion !== "locked") {
    throw new Error(`Unsupported motion class: ${shot.motion}`);
  }
  await runFfmpeg([
    "-loop", "1", "-framerate", "30", "-i", sources.mid,
    "-vf", filter, "-frames:v", String(frameCount), ...h264Args(), outputPath
  ]);
}

async function applyShotTransition(shot, previousSources, baseClipPath, outputPath) {
  const frameCount = shot.duration_seconds * 30;
  const evidence = shot.transition_evidence;
  if (shot.sequence === 1 || shot.transition === "hard_cut") {
    await copyFile(baseClipPath, outputPath);
    return;
  }
  await runFfmpeg([
    "-loop", "1", "-framerate", "30", "-t", String(shot.duration_seconds), "-i", previousSources.end,
    "-i", baseClipPath,
    "-filter_complex", `[0:v]scale=960:540,fps=30,settb=1/30,setpts=PTS-STARTPTS[p];[1:v]fps=30,settb=1/30,setpts=PTS-STARTPTS[c];[p][c]xfade=transition=${evidence.render_transition}:duration=${evidence.duration_seconds}:offset=0,trim=duration=${shot.duration_seconds},format=yuv420p[v]`,
    "-map", "[v]", "-frames:v", String(frameCount), ...h264Args(), outputPath
  ]);
}

async function extractFrameSequence(shot, clipPath, sharp) {
  await mkdir(FRAME_ROOT, { recursive: true });
  const times = {
    start: Math.min(0.1, shot.duration_seconds / 10),
    mid: shot.duration_seconds / 2,
    end: Math.max(0, shot.duration_seconds - 0.1)
  };
  const sequence = {};
  for (const [state, seconds] of Object.entries(times)) {
    const outputPath = shot.frame_sequence[`${state}_path`];
    await runFfmpeg(["-ss", String(seconds), "-i", clipPath, "-frames:v", "1", outputPath]);
    const bytes = await readFile(outputPath);
    sequence[state] = {
      path: outputPath,
      at_local_seconds: seconds,
      byte_size: bytes.length,
      sha256: sha256(bytes),
      image_audit: await imageAudit(outputPath, sharp)
    };
  }
  shot.frame_sequence = sequence;
}

async function encodeMotionTimeline(model, sourceByShot, tempRoot, sharp) {
  const finalClips = [];
  for (const shot of model.shots) {
    const baseClip = path.join(tempRoot, "clips", `${shot.shot_id}-base.mp4`);
    const finalClip = path.join(tempRoot, "clips", `${shot.shot_id}-final.mp4`);
    await mkdir(path.dirname(baseClip), { recursive: true });
    await encodeBaseMotionClip(shot, sourceByShot.get(shot.shot_id), baseClip);
    const previous = shot.sequence > 1 ? sourceByShot.get(model.shots[shot.sequence - 2].shot_id) : null;
    await applyShotTransition(shot, previous, baseClip, finalClip);
    await extractFrameSequence(shot, finalClip, sharp);
    finalClips.push(finalClip);
  }
  const concatPath = path.join(tempRoot, "clips.ffconcat");
  const quote = (filePath) => path.resolve(filePath).replaceAll("\\", "/").replaceAll("'", "'\\''");
  await writeFile(concatPath, `ffconcat version 1.0\n${finalClips.map((clip) => `file '${quote(clip)}'`).join("\n")}\n`, "utf8");
  const tempMp4 = path.join(tempRoot, "private-materialized-motion-previs.mp4");
  await runFfmpeg([
    "-f", "concat", "-safe", "0", "-i", concatPath,
    "-an", "-vf", "fps=30,format=yuv420p", "-frames:v", "5400",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "22",
    "-g", "30", "-keyint_min", "30", "-sc_threshold", "0",
    "-movflags", "+faststart", "-map_metadata", "-1", tempMp4
  ]);
  await copyFile(tempMp4, MP4_PATH);
  const { stdout } = await execFile("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration,size,format_name:stream=codec_type,codec_name,width,height,avg_frame_rate,nb_frames",
    "-of", "json", MP4_PATH
  ], { windowsHide: true });
  const probe = JSON.parse(stdout);
  const video = probe.streams.find((stream) => stream.codec_type === "video");
  const bytes = await readFile(MP4_PATH);
  return {
    path: MP4_PATH,
    byte_size: bytes.length,
    sha256: sha256(bytes),
    duration_seconds: Number(probe.format.duration),
    format_name: probe.format.format_name,
    codec_name: video.codec_name,
    width: video.width,
    height: video.height,
    avg_frame_rate: video.avg_frame_rate,
    frame_count: Number(video.nb_frames),
    audio_stream_count: probe.streams.filter((stream) => stream.codec_type === "audio").length
  };
}

function timelineClip(item, className, content, title) {
  const left = (item.start_seconds / 180) * 100;
  const width = ((item.end_seconds - item.start_seconds) / 180) * 100;
  return `<button type="button" class="clip ${className}" style="left:${left}%;width:${width}%" data-jump="${item.start_seconds}" title="${escapeHtml(title)}">${content}</button>`;
}

function formatTime(seconds) {
  const safe = Math.max(0, Math.min(180, Number(seconds) || 0));
  const minutes = Math.floor(safe / 60);
  const whole = Math.floor(safe % 60);
  const tenths = Math.floor((safe - Math.floor(safe)) * 10 + 1e-6);
  return `${String(minutes).padStart(2, "0")}:${String(whole).padStart(2, "0")}.${tenths}`;
}

function renderPlayerHtml(model) {
  const beatButtons = model.beats.map((beat) => `<button type="button" data-jump="${beat.start_seconds}"><strong>B${beat.beat_number}</strong><span>${escapeHtml(beat.title_ja)}</span></button>`).join("");
  const pictureClips = model.shots.map((shot) => timelineClip(shot, `beat-${shot.beat_number}`, `<span>${String(shot.sequence).padStart(2, "0")}</span><small>${escapeHtml(shot.title_ja)}</small>`, `${shot.start_time}–${shot.end_time} ${shot.title_ja}`)).join("");
  const materialClips = model.shots.map((shot) => timelineClip(shot, shot.materialized ? "materialized" : "reference-only", `<span>${shot.materialized ? shot.deterministic_requirement_ids.join(" · ") : "reference-only"}</span>`, `${shot.shot_id} ${shot.material_variant_keys.join(", ")}`)).join("");
  const motionClips = model.shots.map((shot) => timelineClip(shot, "motion", `<span>${escapeHtml(shot.motion)}</span>`, `${shot.shot_id} ${shot.motion}`)).join("");
  const transitionMarkers = model.shots.map((shot) => `<button type="button" class="transition" style="left:${(shot.start_seconds / 180) * 100}%" data-jump="${shot.start_seconds}" title="${escapeHtml(shot.transition)}"><i></i></button>`).join("");
  const materialCards = model.material_families.map((family) => `<article><strong>${family.requirement_id}</strong><span>${escapeHtml(family.family_name)}</span><small>${family.variants.length} variants · ${[...new Set(family.variants.flatMap((variant) => variant.shot_ids))].length} shots</small></article>`).join("");
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Private Materialized Motion Previs</title><style>
  :root{color-scheme:dark;--bg:#091012;--panel:#121c1f;--panel2:#1a272a;--line:#34464a;--text:#eef4f1;--muted:#aebdba;--brass:#d1a45f;--focus:#ffb45f;--b1:#47666a;--b2:#826138;--b3:#5c6279;--b4:#6f5049;--b5:#47635d;--b6:#4c5770}*{box-sizing:border-box}html,body{margin:0;min-width:0;overflow-x:hidden;background:var(--bg);color:var(--text);font-family:"Yu Gothic UI","Noto Sans JP","Segoe UI",sans-serif}button,input{font:inherit}button{color:inherit}button:focus-visible,input:focus-visible,video:focus-visible{outline:3px solid var(--focus);outline-offset:3px}.app{width:min(1440px,100%);margin:0 auto;padding:8px 12px 55px}.statusline{min-height:34px;display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:11px;color:var(--muted)}.statusline strong{font-size:13px;letter-spacing:.08em;color:var(--text)}.workbench{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:10px}.viewer{position:relative;min-width:0;aspect-ratio:16/9;background:#000;border:1px solid var(--line);border-radius:9px;overflow:hidden}.viewer video{display:block;width:100%;height:100%;object-fit:contain;background:#000}.viewer-mark{position:absolute;right:9px;top:9px;padding:5px 7px;background:#050909d9;border:1px solid #ffffff55;font:700 9px/1 ui-monospace,Consolas,monospace;letter-spacing:.07em;pointer-events:none}.subtitle{position:absolute;left:10%;right:10%;bottom:7%;min-height:2.7em;display:grid;place-items:center;text-align:center;font-size:clamp(14px,2vw,26px);font-weight:800;text-shadow:0 2px 8px #000,0 0 18px #000;pointer-events:none}.inspector{padding:12px;border:1px solid var(--line);border-radius:9px;background:var(--panel);min-width:0}.inspector .eyebrow{margin:0;color:#d7b77e;font-size:11px;letter-spacing:.09em}.inspector h1{margin:4px 0;font-size:20px;line-height:1.2}.inspector .identity{color:var(--muted);font-size:11px}.inspector dl{margin:11px 0 0;display:grid;grid-template-columns:78px 1fr;gap:6px;font-size:11px}.inspector dt{color:var(--muted)}.inspector dd{margin:0;overflow-wrap:anywhere}.controls{margin-top:8px;display:grid;grid-template-columns:auto auto auto minmax(120px,1fr) auto;gap:7px;align-items:center;padding:8px;border:1px solid var(--line);border-radius:9px;background:var(--panel)}.controls button{min-width:40px;min-height:40px;border:1px solid var(--line);border-radius:7px;background:var(--panel2);cursor:pointer}.scrubber{width:100%;accent-color:var(--brass)}.timecode{font:800 19px/1 ui-monospace,Consolas,monospace;white-space:nowrap}.beat-jumps{display:flex;gap:5px;margin-top:7px}.beat-jumps button{flex:1;min-width:0;min-height:34px;text-align:left;padding:5px 7px;border:1px solid var(--line);border-radius:7px;background:var(--panel);cursor:pointer}.beat-jumps strong,.beat-jumps span{display:block}.beat-jumps span{color:var(--muted);font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.overview{position:relative;height:48px;margin-top:7px;border:1px solid var(--line);border-radius:8px;background:#0e1719;overflow:hidden}.overview .beats{position:absolute;inset:0;display:flex}.overview .beats span{display:flex;align-items:flex-end;padding:4px;border-right:1px solid #ffffff22;font-size:9px}.playhead{position:absolute;top:0;bottom:0;width:2px;background:#ffc06d;z-index:20;pointer-events:none}.timeline{margin-top:13px;border:1px solid var(--line);border-radius:9px;background:var(--panel);overflow:hidden}.lane{display:grid;grid-template-columns:92px minmax(0,1fr);min-height:48px;border-bottom:1px solid var(--line)}.lane:last-child{border-bottom:0}.lane-label{padding:9px;border-right:1px solid var(--line);color:var(--muted);font-size:10px}.track{position:relative;overflow:hidden}.clip{position:absolute;top:4px;bottom:4px;min-width:2px;overflow:hidden;padding:2px 4px;text-align:left;border:1px solid #ffffff24;border-radius:4px;background:#374a4e;cursor:pointer}.clip span,.clip small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:8px}.clip span{font-weight:900}.materialized{background:#6f5630}.reference-only{background:#293638}.motion{background:#2d3f43}.transition{position:absolute;top:0;bottom:0;width:8px;transform:translateX(-4px);border:0;background:transparent;padding:0;z-index:5;cursor:pointer}.transition i{position:absolute;left:3px;top:8px;bottom:8px;border-left:2px dashed #d4a45e}.material-index{margin-top:14px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.material-index article{padding:9px;border:1px solid var(--line);border-radius:7px;background:var(--panel)}.material-index strong,.material-index span,.material-index small{display:block}.material-index strong{color:#dab778;font:800 11px/1 ui-monospace,Consolas,monospace}.material-index span{margin-top:4px;font-size:11px}.material-index small{margin-top:3px;color:var(--muted);font-size:9px}.foot{margin-top:13px;color:var(--muted);font-size:10px}.beat-1{background:var(--b1)}.beat-2{background:var(--b2)}.beat-3{background:var(--b3)}.beat-4{background:var(--b4)}.beat-5{background:var(--b5)}.beat-6{background:var(--b6)}.bw1{width:11.1111%}.bw2{width:16.6667%}.bw3{width:16.6667%}.bw4{width:13.8889%}.bw5{width:27.7778%}.bw6{width:13.8889%}@media(max-width:860px){.workbench{grid-template-columns:1fr}.inspector{display:grid;grid-template-columns:1fr 1fr;gap:8px}.inspector dl{margin:0}.material-index{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.app{padding:5px 7px 40px}.statusline{min-height:30px}.statusline span{max-width:170px;text-align:right}.workbench{gap:6px}.inspector{display:block;padding:8px}.inspector h1{font-size:16px}.inspector dl{margin-top:6px;grid-template-columns:67px 1fr;gap:4px;font-size:9px}.controls{grid-template-columns:repeat(3,1fr);padding:6px}.controls .scrubber{grid-column:1/-1;grid-row:2}.controls .timecode{grid-column:1/-1;grid-row:3;text-align:center;font-size:16px}.beat-jumps{gap:3px}.beat-jumps button{padding:4px;min-height:31px}.beat-jumps span{display:none}.overview{height:42px}.timeline{margin-top:10px}.lane{grid-template-columns:62px minmax(0,1fr);min-height:43px}.lane-label{padding:6px 4px;font-size:8px}.material-index{grid-template-columns:1fr 1fr}.subtitle{font-size:13px}.statusline strong{font-size:10px}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition-duration:.001ms!important;animation-duration:.001ms!important}}
  </style></head><body><main class="app"><div class="statusline"><strong>MATERIAL PREVIS · 180s · 6 Beats · 19 Shots</strong><span>private / silent / production・rights・publication未承認</span></div><section class="workbench" aria-label="Materialized motion playback workbench"><div class="viewer"><video id="playbackCanvas" muted playsinline preload="metadata" poster="frames/shot-b01-01-mid.png" aria-label="Private materialized motion preview"><source src="private-materialized-motion-previs.mp4" type="video/mp4"></video><div id="subtitle" class="subtitle" aria-live="polite"></div><div class="viewer-mark">${WATERMARK}</div></div><aside class="inspector"><div><p class="eyebrow" id="beatIdentity">BEAT 1</p><h1 id="shotTitle">駅から塔へ</h1><div class="identity" id="shotIdentity">shot-b01-01 · 00:00–00:07</div></div><dl><dt>Material</dt><dd id="shotMaterial"></dd><dt>Motion</dt><dd id="shotMotion"></dd><dt>Transition</dt><dd id="shotTransition"></dd><dt>Boundary</dt><dd id="shotBoundary"></dd></dl></aside></section><section class="controls" aria-label="Playback controls"><button type="button" id="prevShot" aria-label="Previous shot">◀│</button><button type="button" id="togglePlay" aria-label="Play" aria-pressed="false">▶</button><button type="button" id="nextShot" aria-label="Next shot">│▶</button><input id="scrubber" class="scrubber" type="range" min="0" max="180" step="0.1" value="0" aria-label="Timeline scrubber"><output id="timecode" class="timecode">00:00.0 / 03:00.0</output></section><nav class="beat-jumps" aria-label="Beat jumps">${beatButtons}</nav><section class="overview" aria-label="180 second overview"><div class="beats">${model.beats.map((beat) => `<span class="bw${beat.beat_number} beat-${beat.beat_number}">B${beat.beat_number}</span>`).join("")}</div><i class="playhead" data-playhead></i></section><section class="timeline" aria-label="Native material and motion timeline"><div class="lane"><div class="lane-label">PICTURE</div><div class="track">${pictureClips}<i class="playhead" data-playhead></i></div></div><div class="lane"><div class="lane-label">MATERIAL</div><div class="track">${materialClips}<i class="playhead" data-playhead></i></div></div><div class="lane"><div class="lane-label">MOTION</div><div class="track">${motionClips}<i class="playhead" data-playhead></i></div></div><div class="lane"><div class="lane-label">TRANSITION</div><div class="track">${transitionMarkers}<i class="playhead" data-playhead></i></div></div></section><section class="material-index" aria-label="Nine deterministic material families">${materialCards}</section><p class="foot">Keyboard: Space play/pause · ←/→ seek 1s (Shift=5s) · Home/End. The player is muted and local; no network request or audio stream.</p></main><script type="application/json" id="motionModel">${JSON.stringify(model).replaceAll("<", "\\u003c")}</script><script>
  (()=>{const model=JSON.parse(document.getElementById("motionModel").textContent);const video=document.getElementById("playbackCanvas");const scrubber=document.getElementById("scrubber");const toggle=document.getElementById("togglePlay");const timecode=document.getElementById("timecode");const subtitle=document.getElementById("subtitle");let active="";const clamp=(v)=>Math.max(0,Math.min(180,Number(v)||0));const shotAt=(t)=>model.shots.find((shot)=>t>=shot.start_seconds&&t<shot.end_seconds)||model.shots.at(-1);const beatAt=(t)=>model.beats.find((beat)=>t>=beat.start_seconds&&t<beat.end_seconds)||model.beats.at(-1);const cueAt=(t)=>model.timeline_tracks.subtitles.find((cue)=>t>=cue.start_seconds&&t<cue.end_seconds);const fmt=(s)=>{s=clamp(s);const m=Math.floor(s/60),sec=Math.floor(s%60),tenth=Math.floor((s-Math.floor(s))*10+1e-6);return String(m).padStart(2,"0")+":"+String(sec).padStart(2,"0")+"."+tenth};function render(){const current=clamp(video.currentTime);const shot=shotAt(current);const beat=beatAt(current);const cue=cueAt(current);scrubber.value=String(current);timecode.value=fmt(current)+" / 03:00.0";subtitle.textContent=cue?cue.text_ja:"";for(const head of document.querySelectorAll("[data-playhead]"))head.style.left=(current/180*100)+"%";if(active!==shot.shot_id){active=shot.shot_id;document.getElementById("beatIdentity").textContent="BEAT "+beat.beat_number+" · "+beat.title_ja;document.getElementById("shotTitle").textContent=shot.title_ja;document.getElementById("shotIdentity").textContent=shot.shot_id+" · "+shot.start_time+"–"+shot.end_time;document.getElementById("shotMaterial").textContent=shot.material_variant_keys.length?shot.material_variant_keys.join(" · "):"reference-only source";document.getElementById("shotMotion").textContent=shot.motion;document.getElementById("shotTransition").textContent=shot.transition;document.getElementById("shotBoundary").textContent=shot.source_truth_boundary}}function seek(value){video.currentTime=clamp(value);render()}async function play(){if(video.currentTime>=179.99)seek(0);video.muted=true;await video.play();toggle.textContent="❚❚";toggle.setAttribute("aria-label","Pause");toggle.setAttribute("aria-pressed","true")}function pause(){video.pause();toggle.textContent="▶";toggle.setAttribute("aria-label","Play");toggle.setAttribute("aria-pressed","false")}function togglePlay(){video.paused?play().catch(()=>{}):pause()}video.addEventListener("timeupdate",render);video.addEventListener("seeked",render);video.addEventListener("ended",pause);video.addEventListener("loadedmetadata",render);toggle.addEventListener("click",togglePlay);scrubber.addEventListener("input",()=>seek(scrubber.value));document.getElementById("prevShot").addEventListener("click",()=>{const shot=shotAt(video.currentTime);seek(video.currentTime-shot.start_seconds>.4?shot.start_seconds:model.shots[Math.max(0,shot.sequence-2)].start_seconds)});document.getElementById("nextShot").addEventListener("click",()=>{const shot=shotAt(video.currentTime);seek(shot.sequence<model.shots.length?model.shots[shot.sequence].start_seconds:180)});for(const button of document.querySelectorAll("[data-jump]"))button.addEventListener("click",()=>seek(button.dataset.jump));document.addEventListener("keydown",(event)=>{if(event.target===scrubber)return;if(event.code==="Space"){event.preventDefault();togglePlay()}else if(event.key==="Home"){event.preventDefault();seek(0)}else if(event.key==="End"){event.preventDefault();seek(180)}else if(event.key==="ArrowLeft"){event.preventDefault();seek(video.currentTime-(event.shiftKey?5:1))}else if(event.key==="ArrowRight"){event.preventDefault();seek(video.currentTime+(event.shiftKey?5:1))}});window.__MOTION_PREVIS__={model,video,shotAt,beatAt,cueAt,seek,getState:()=>({current:video.currentTime,playing:!video.paused,muted:video.muted,ready_state:video.readyState,shot_id:shotAt(video.currentTime).shot_id,beat_number:beatAt(video.currentTime).beat_number,subtitle:cueAt(video.currentTime)?.text_ja||""})};render()})();
  </script></body></html>`;
}

async function renderContactSheet(model, browser) {
  const cells = [];
  for (const shot of model.shots) {
    cells.push(`<article><img src="${await fileDataUrl(shot.frame_sequence.mid.path)}" alt=""><div><strong>${shot.shot_id}</strong><span>B${shot.beat_number} · ${shot.start_time}–${shot.end_time} · ${escapeHtml(shot.motion)}</span><small>${escapeHtml(shot.deterministic_requirement_ids.join(" · ") || "reference-only")}</small></div></article>`);
  }
  const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;width:1600px;height:1080px;overflow:hidden;background:#0b1214;color:#edf3f0;font-family:"Yu Gothic UI","Noto Sans JP","Segoe UI",sans-serif}.sheet{padding:24px;display:grid;grid-template-columns:repeat(5,1fr);gap:12px}.sheet article{padding:6px;background:#152023;border:1px solid #3d5054}.sheet img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}.sheet div{padding:5px 2px 1px}.sheet strong,.sheet span,.sheet small{display:block}.sheet strong{font-size:12px}.sheet span{font-size:9px;color:#becbc8}.sheet small{font-size:8px;color:#d2ae6e}.foot{position:absolute;right:26px;bottom:12px;font:700 11px/1 ui-monospace,Consolas,monospace;letter-spacing:.08em}</style></head><body><main class="sheet">${cells.join("")}</main><div class="foot">19 SHOTS / 180 SEC / ${WATERMARK}</div></body></html>`;
  const page = await browser.newPage({ viewport: { width: 1600, height: 1080 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  await page.setContent(html, { waitUntil: "load" });
  await page.screenshot({ path: CONTACT_SHEET_PATH, type: "jpeg", quality: 90, animations: "disabled" });
  await page.close();
}

function renderReadme(model, mp4) {
  return `# Private Materialized Motion Previsualization

- Artifact: \`${ARTIFACT_ID}\`
- Mission: \`${MISSION_ID}\`
- Design signature: \`${DESIGN_SIGNATURE}\`
- Open: \`Invoke-Item .\\${HTML_PATH.replaceAll("/", "\\")}\`
- Rebuild: \`node .\\tools\\fff-private-materialized-motion-previs.mjs build\`
- Validate: \`node .\\tools\\fff-state.mjs validate-private-materialized-motion-previs .\\${RESULT_PATH.replaceAll("/", "\\")}\`

This isolated successor keeps the accepted 6-Beat / 19-shot / 180-second chronology and uses nine deterministic local original material families across the exact seventeen mapped shots. Camera motion and transition classes are materially rendered into the silent MP4.

The accepted private preview remains the default artifact. Environment, character-hand, and brass-moth imagery keep their reference-only or proxy status. Audio and voice remain future lanes. Production selection and rights-cleared claim counts remain zero.

MP4: ${mp4.width}x${mp4.height}, ${mp4.codec_name}, ${mp4.avg_frame_rate}, ${mp4.duration_seconds}s, silent, SHA256 \`${mp4.sha256}\`.
`;
}

function renderReviewDoc(model, mp4, browserEvidence, targetedTests, manifest) {
  const families = model.material_families.map((family) => `| ${family.requirement_id} | ${family.variants.map((variant) => variant.variant_id).join(", ")} | ${[...new Set(family.variants.flatMap((variant) => variant.shot_ids))].join(", ")} | ${family.variants.map((variant) => `\`${variant.sha256}\``).join("<br>")} |`).join("\n");
  const motionCounts = Object.entries(model.shots.reduce((acc, shot) => ({ ...acc, [shot.motion]: (acc[shot.motion] || 0) + 1 }), {})).map(([key, value]) => `${key}=${value}`).join(", ");
  const transitionCounts = Object.entries(model.shots.slice(1).reduce((acc, shot) => ({ ...acc, [shot.transition]: (acc[shot.transition] || 0) + 1 }), {})).map(([key, value]) => `${key}=${value}`).join(", ");
  return `# Private Materialized Motion Previsualization

## Direction lock

- Artifact: \`${ARTIFACT_ID}\`
- Mission: \`${MISSION_ID}\`
- Selected candidate signature: \`${DESIGN_SIGNATURE}\`
- Recorded before direction generation: true

The candidate uses specific fictional documents, equal candidate regions with literal labels, changing letter contours, distinct clock/memo/ledger material, and neutral silhouettes. Generic-symbolic-primary count is ${model.quarantine_audit.generic_symbolic_primary_count}; near-blank abstract-frame count is ${model.quarantine_audit.near_blank_abstract_frame_count}.

## Outcome

The accepted reference-led still preview remains byte-identical and remains the default artifact. This isolated successor adds nine reusable deterministic local material families, visibly executed camera motion, rendered boundary transitions, a timeline-first local player, 57 start/mid/end evidence frames, a nineteen-cell contact sheet, and an exact silent 180-second MP4.

## Accepted decisions

- Private preview experience: accept
- Existing preview repair required: false
- Recommended asset plan: A
- Exception requirement IDs: none
- Human gate inside this Mission: none

## Material families

| Requirement | Variants | Exact shot coverage | SHA256 |
| --- | --- | --- | --- |
${families}

Coverage is ${model.materialized_coverage.covered_shot_count}/19 shots. The two uncovered shots are ${model.materialized_coverage.uncovered_shot_ids.join(", ")} and retain reference-only environment imagery.

## Motion and transitions

- Motion classes: ${motionCounts}
- Boundary transition classes: ${transitionCounts}
- All non-locked classes carry measurable start/mid/end deltas.
- Locked shots carry identical camera transform values at start/mid/end.
- All eighteen boundaries are represented without changing source shot durations.

## MP4

- Path: \`${mp4.path}\`
- ${mp4.width}x${mp4.height} / ${mp4.codec_name} / ${mp4.avg_frame_rate}
- Duration: ${mp4.duration_seconds}s
- Frames: ${mp4.frame_count}
- Audio streams: ${mp4.audio_stream_count}
- SHA256: \`${mp4.sha256}\`

## Browser and visual evidence

- Desktop: \`${SCREENSHOTS.desktop}\`, first work surface visible, overflow=${browserEvidence.desktop.horizontal_overflow}, nested scroll=${browserEvidence.desktop.nested_vertical_scroll_count}
- Narrow: \`${SCREENSHOTS.narrow}\`, first work surface visible, overflow=${browserEvidence.narrow.horizontal_overflow}, nested scroll=${browserEvidence.narrow.nested_vertical_scroll_count}
- Contact sheet: \`${CONTACT_SHEET_PATH}\`
- Browser pass: ${browserEvidence.passed}
- Targeted tests: ${targetedTests.passed}/${targetedTests.total}
- Package fingerprint: \`${manifest.package_fingerprint_sha256}\`

## Preserved boundaries

- AR-ENV-01, AR-ENV-02, AR-CHAR-01: reference-only / replacement_pending
- AR-PROP-02: private brass-moth reference proxy; not selected for production
- AR-AUDIO-01: future lane; no audio created
- Voice: unselected and ungenerated
- New download count: 0
- Production-selected count: 0
- Rights-cleared claim count: 0
- AI image/audio/video generation: false
- Accepted private preview replacement: false

## Supervising-AI handoff and forward goals

The accepted private preview remains the repository default. This artifact is an isolated successor candidate whose technical H0 evidence is green; it is ready to serve as visual input to later bounded private Missions.

| Horizon | Purpose | Effect | Requirements | State | Owner | Next move |
| --- | --- | --- | --- | --- | --- | --- |
| H1 | Synthetic-voice calibration | Adds timing evidence against the unchanged 180-second picture without changing story or picture | Separate voice/engine authorization, private-only output, no publication claim | blocked by future authorization; no voice selected here | Product Owner + future audio Mission | Select a calibration voice boundary and create a successor audio candidate |
| H2 | No-publish assembly planning | Defines how private picture, temporary voice, captions, and QC receipts would be assembled | H1 result, exact timeline binding, silent candidate preserved | conditionally ready after H1 | Supervising AI | Draft a no-publish assembly contract with rollback and source hashes |
| H3 | Replacement and proxy resolution | Replaces AR-ENV-01/02 and AR-CHAR-01 references and decides whether AR-PROP-02 may advance | New asset evidence, provenance, creator review, no reuse of ambiguous references | replacement_pending / proxy-only | Product Owner + asset/rights reviewer | Source or create separately authorized candidates and record evidence |
| H4 | Production asset and rights decisions | Selects actual production assets and records usage decisions | H3 evidence, explicit Owner decisions, legal/rights review where applicable | closed | Product Owner + rights owner | Decide requirement-by-requirement; keep creative fit separate from rights |
| H5 | Production render and human quality acceptance | Produces a production candidate and evaluates sound, pacing, legibility, and final visual quality | H1-H4 complete, engine/render authorization, human full-view review | closed | Production owner + human reviewer | Render a new immutable candidate identity and perform full-view acceptance |
| H6 | Publication and release | Evaluates platform compatibility, release readiness, upload, and deployment | H5 accepted, publication/rights approval, explicit external-effect authority | closed | Release owner | Run platform-specific checks, approve release, then publish under separate authority |

Bounded technical debt: \`fff-resumable-private-pipeline-001\` includes the root manifest in its source identity. Registering this candidate changes that identity, so its historical golden result is intentionally not regenerated by this Mission. Its accepted preview inputs remain protected; a future pipeline-refresh Mission may rebind and regenerate that result without changing either preview.
`;
}

async function writeStructuredArtifacts(model, materialFamilies, mp4) {
  await writeFile(FAMILY_INDEX_PATH, `${JSON.stringify({
    schemaVersion: "fff.privateMaterialFamilyIndex.v1",
    artifact_id: ARTIFACT_ID,
    selected_candidate_signature: DESIGN_SIGNATURE,
    family_count: materialFamilies.length,
    families: materialFamilies
  }, null, 2)}\n`, "utf8");
  const shotMapRows = model.shots.flatMap((shot) => shot.material_variant_keys.map((key) => {
    const [requirementId, variantId] = key.split("/");
    const family = materialFamilies.find((item) => item.requirement_id === requirementId);
    const variant = family.variants.find((item) => item.variant_id === variantId);
    return {
      shot_id: shot.shot_id,
      requirement_id: requirementId,
      variant_id: variantId,
      output_path: variant.output_path,
      sha256: variant.sha256,
      deterministic_local_original: true,
      selected_for_production: false,
      rights_cleared_claim: false
    };
  }));
  await writeFile(SHOT_MAP_PATH, toCsv(["shot_id", "requirement_id", "variant_id", "output_path", "sha256", "deterministic_local_original", "selected_for_production", "rights_cleared_claim"], shotMapRows), "utf8");
  await writeFile(MOTION_MAP_PATH, toCsv(["shot_id", "sequence", "start_seconds", "end_seconds", "duration_seconds", "motion", "transition", "motion_start", "motion_mid", "motion_end", "transition_render", "transition_duration_seconds"], model.shots.map((shot) => ({
    shot_id: shot.shot_id,
    sequence: shot.sequence,
    start_seconds: shot.start_seconds,
    end_seconds: shot.end_seconds,
    duration_seconds: shot.duration_seconds,
    motion: shot.motion,
    transition: shot.transition,
    motion_start: JSON.stringify(shot.motion_evidence.start),
    motion_mid: JSON.stringify(shot.motion_evidence.mid),
    motion_end: JSON.stringify(shot.motion_evidence.end),
    transition_render: shot.transition_evidence.render_transition,
    transition_duration_seconds: shot.transition_evidence.duration_seconds
  }))), "utf8");
  await writeFile(MODEL_PATH, `${JSON.stringify(model, null, 2)}\n`, "utf8");
  await writeFile(HTML_PATH, renderPlayerHtml(model), "utf8");
  await writeFile(`${PACKAGE_ROOT}/README_PRIVATE_MATERIALIZED_MOTION_PREVIS.md`, renderReadme(model, mp4), "utf8");
}

async function captureBrowserEvidence(model, sharp) {
  const { chromium } = await loadPlaywright();
  await mkdir(path.dirname(SCREENSHOTS.desktop), { recursive: true });
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const errors = [];
  const externalRequests = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "no-preference" });
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => { if (/^https?:/i.test(request.url())) externalRequests.push(request.url()); });
  await page.goto(pathToFileURL(path.resolve(HTML_PATH)).href, { waitUntil: "load" });
  await page.waitForFunction(() => window.__MOTION_PREVIS__?.getState().ready_state >= 1);
  await page.evaluate(() => window.__MOTION_PREVIS__.seek(43.2));
  await page.waitForFunction(() => Math.abs(window.__MOTION_PREVIS__.getState().current - 43.2) < 0.12);
  const desktop = await page.evaluate(() => {
    const required = ["#playbackCanvas", "#timecode", "#togglePlay", "#scrubber", "#beatIdentity", "#shotIdentity", ".overview"];
    const nested = [...document.querySelectorAll("body *")].filter((node) => { const style = getComputedStyle(node); return /(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight + 1; });
    return {
      width: innerWidth,
      height: innerHeight,
      horizontal_overflow: document.documentElement.scrollWidth > innerWidth + 1,
      nested_vertical_scroll_count: nested.length,
      first_view_required_visible: required.every((selector) => { const rect = document.querySelector(selector).getBoundingClientRect(); return rect.top >= 0 && rect.bottom <= innerHeight; }),
      capture_time_seconds: window.__MOTION_PREVIS__.getState().current,
      capture_shot_id: window.__MOTION_PREVIS__.getState().shot_id
    };
  });
  await page.screenshot({ path: SCREENSHOTS.desktop, fullPage: false, animations: "disabled" });
  const boundaryTests = await page.evaluate(() => {
    const { model: liveModel, shotAt } = window.__MOTION_PREVIS__;
    return liveModel.shots.slice(1).map((shot, index) => ({
      at_seconds: shot.start_seconds,
      before: shotAt(shot.start_seconds - 0.001).shot_id,
      at: shotAt(shot.start_seconds).shot_id,
      expected_before: liveModel.shots[index].shot_id,
      expected_at: shot.shot_id,
      transition: shot.transition
    }));
  });
  await page.keyboard.press("Home");
  const homeState = await page.evaluate(() => window.__MOTION_PREVIS__.getState());
  await page.keyboard.press("ArrowRight");
  const rightState = await page.evaluate(() => window.__MOTION_PREVIS__.getState());
  await page.keyboard.press("End");
  const endState = await page.evaluate(() => window.__MOTION_PREVIS__.getState());
  await page.keyboard.press("Home");
  await page.keyboard.press("Space");
  await page.waitForTimeout(220);
  const playState = await page.evaluate(() => window.__MOTION_PREVIS__.getState());
  await page.keyboard.press("Space");
  await page.focus("#togglePlay");
  const focusVisible = await page.evaluate(() => {
    const style = getComputedStyle(document.activeElement);
    return style.outlineStyle !== "none" && Number.parseFloat(style.outlineWidth) >= 3;
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(pathToFileURL(path.resolve(HTML_PATH)).href, { waitUntil: "load" });
  await page.waitForFunction(() => window.__MOTION_PREVIS__?.getState().ready_state >= 1);
  await page.evaluate(() => window.__MOTION_PREVIS__.seek(74.5));
  await page.waitForFunction(() => Math.abs(window.__MOTION_PREVIS__.getState().current - 74.5) < 0.12);
  const narrow = await page.evaluate(() => {
    const required = ["#playbackCanvas", "#timecode", "#togglePlay", "#scrubber", "#beatIdentity", "#shotIdentity", ".overview"];
    const nested = [...document.querySelectorAll("body *")].filter((node) => { const style = getComputedStyle(node); return /(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight + 1; });
    return {
      width: innerWidth,
      height: innerHeight,
      horizontal_overflow: document.documentElement.scrollWidth > innerWidth + 1,
      nested_vertical_scroll_count: nested.length,
      first_view_required_visible: required.every((selector) => { const rect = document.querySelector(selector).getBoundingClientRect(); return rect.top >= 0 && rect.bottom <= innerHeight; }),
      capture_time_seconds: window.__MOTION_PREVIS__.getState().current,
      capture_shot_id: window.__MOTION_PREVIS__.getState().shot_id
    };
  });
  await page.screenshot({ path: SCREENSHOTS.narrow, fullPage: false, animations: "disabled" });
  await browser.close();
  const screenshotInventory = await inventoryFiles(Object.values(SCREENSHOTS), ".");
  const screenshotAudits = {};
  for (const filePath of Object.values(SCREENSHOTS)) screenshotAudits[filePath] = await imageAudit(filePath, sharp);
  const passed = !desktop.horizontal_overflow && desktop.nested_vertical_scroll_count === 0 && desktop.first_view_required_visible
    && !narrow.horizontal_overflow && narrow.nested_vertical_scroll_count === 0 && narrow.first_view_required_visible
    && desktop.capture_shot_id === "shot-b02-03" && narrow.capture_shot_id === "shot-b03-03"
    && boundaryTests.length === 18 && boundaryTests.every((item) => item.before === item.expected_before && item.at === item.expected_at)
    && homeState.current === 0 && Math.abs(rightState.current - 1) < 0.1 && Math.abs(endState.current - 180) < 0.1
    && playState.playing === true && playState.muted === true && focusVisible
    && Object.values(screenshotAudits).every((audit) => audit.non_blank)
    && errors.length === 0 && externalRequests.length === 0;
  return {
    passed,
    engine: "Microsoft Edge via bundled Playwright",
    headless: true,
    muted: true,
    desktop,
    narrow,
    boundary_tests: boundaryTests,
    keyboard: { home: homeState, arrow_right: rightState, end: endState, space_play: playState, focus_visible: focusVisible },
    console_errors: errors,
    external_requests: externalRequests,
    screenshots: screenshotInventory.files,
    screenshot_audits: screenshotAudits
  };
}

function modelContractFailures(model) {
  const failures = [];
  const require = (condition, message) => { if (!condition) failures.push(message); };
  require(model.artifact_id === ARTIFACT_ID, "artifact identity mismatch");
  require(model.selected_candidate_signature === DESIGN_SIGNATURE, "design signature mismatch");
  require(model.duration_seconds === 180 && model.beats.length === 6 && model.shots.length === 19, "duration/Beat/shot identity mismatch");
  require(model.timeline_tracks.narration_text.length === 6 && model.timeline_tracks.subtitles.length === 20, "text-track identity mismatch");
  require(model.shots[0].start_seconds === 0 && model.shots.at(-1).end_seconds === 180, "timeline endpoints mismatch");
  for (let index = 0; index < model.shots.length; index += 1) {
    const shot = model.shots[index];
    require(shot.sequence === index + 1, `shot sequence mismatch ${shot.shot_id}`);
    require(shot.end_seconds - shot.start_seconds === shot.duration_seconds, `shot duration mismatch ${shot.shot_id}`);
    if (index > 0) require(model.shots[index - 1].end_seconds === shot.start_seconds, `timeline gap/overlap ${shot.shot_id}`);
    const expectedKeys = [...shotMaterialKeys(shot.shot_id)].sort();
    require(JSON.stringify([...shot.material_variant_keys].sort()) === JSON.stringify(expectedKeys), `material mapping mismatch ${shot.shot_id}`);
    const start = JSON.stringify(shot.motion_evidence.start);
    const mid = JSON.stringify(shot.motion_evidence.mid);
    const end = JSON.stringify(shot.motion_evidence.end);
    if (shot.motion === "locked") require(start === mid && mid === end, `locked motion drift ${shot.shot_id}`);
    else require(start !== mid || mid !== end, `non-locked motion is static ${shot.shot_id}`);
    require(["hard_cut", "short_dissolve", "match_cut", "graphic_match", "held_fade"].includes(shot.transition), `unknown transition ${shot.shot_id}`);
    require(shot.transition_evidence.render_transition === transitionEvidence(shot.transition).render_transition, `transition implementation mismatch ${shot.shot_id}`);
  }
  require(model.material_families.length === 9, "material family count mismatch");
  require(JSON.stringify(model.material_families.map((family) => family.requirement_id)) === JSON.stringify(DETERMINISTIC_REQUIREMENT_IDS), "material family identity/order mismatch");
  for (const family of model.material_families) {
    const definition = FAMILY_DEFINITIONS.find((item) => item.requirement_id === family.requirement_id);
    require(Boolean(definition), `unexpected material family ${family.requirement_id}`);
    if (!definition) continue;
    const actualMapping = [...new Set(family.variants.flatMap((variant) => variant.shot_ids))].sort();
    const expectedMapping = [...new Set(definition.variants.flatMap((variant) => variant.shot_ids))].sort();
    require(JSON.stringify(actualMapping) === JSON.stringify(expectedMapping), `family shot mapping mismatch ${family.requirement_id}`);
    require(family.deterministic_local_original === true, `family is not deterministic local original ${family.requirement_id}`);
    require(family.selected_for_production === false && family.rights_cleared_claim === false, `closed family gate changed ${family.requirement_id}`);
  }
  require(model.materialized_coverage.covered_shot_count === 17 && model.materialized_coverage.uncovered_shot_ids.join(",") === "shot-b01-01,shot-b01-02", "seventeen-shot coverage mismatch");
  require(model.source_reference_boundaries.ambiguous_reference_ids_rendered.length === 0, "ambiguous reference rendered");
  require(model.source_reference_boundaries.voice_selected === false && model.source_reference_boundaries.voice_generated === false, "voice boundary changed");
  require(model.boundaries.silent === true && model.boundaries.image_generation === false && model.boundaries.audio_generation === false && model.boundaries.ai_video_generation === false, "generation boundary changed");
  require(model.boundaries.selected_for_production === false && model.boundaries.rights_cleared_claim === false && model.boundaries.public_upload === false, "release gate changed");
  require(model.quarantine_audit.generic_symbolic_primary_count === 0 && model.quarantine_audit.near_blank_abstract_frame_count === 0, "quarantine audit failed");
  return failures;
}

function runTargetedTests(model) {
  const cases = [];
  const record = (name, passed, detail) => cases.push({ name, passed, detail });
  const cleanFailures = modelContractFailures(model);
  record("positive_complete_model", cleanFailures.length === 0, cleanFailures.join("; ") || "green");
  const negativeCases = [
    ["reject_timeline_gap", (copy) => { copy.shots[1].start_seconds += 1; }],
    ["reject_timeline_overlap", (copy) => { copy.shots[1].start_seconds -= 1; }],
    ["reject_wrong_endpoint", (copy) => { copy.shots.at(-1).end_seconds = 179; }],
    ["reject_missing_family", (copy) => { copy.material_families.pop(); }],
    ["reject_family_mapping_drift", (copy) => { copy.material_families[0].variants[0].shot_ids = ["shot-b01-01"]; }],
    ["reject_shot_mapping_drift", (copy) => { copy.shots[2].material_variant_keys = []; }],
    ["reject_static_nonlocked_motion", (copy) => { copy.shots.find((shot) => shot.motion !== "locked").motion_evidence.end = copy.shots.find((shot) => shot.motion !== "locked").motion_evidence.start; copy.shots.find((shot) => shot.motion !== "locked").motion_evidence.mid = copy.shots.find((shot) => shot.motion !== "locked").motion_evidence.start; }],
    ["reject_locked_motion_drift", (copy) => { copy.shots.find((shot) => shot.motion === "locked").motion_evidence.end.x = 1; }],
    ["reject_unknown_transition", (copy) => { copy.shots[1].transition = "wipe"; }],
    ["reject_ambiguous_reference_render", (copy) => { copy.source_reference_boundaries.ambiguous_reference_ids_rendered = [AMBIGUOUS_REFERENCE_IDS[0]]; }],
    ["reject_voice_selection", (copy) => { copy.source_reference_boundaries.voice_selected = true; }],
    ["reject_production_selection", (copy) => { copy.boundaries.selected_for_production = true; }],
    ["reject_rights_claim", (copy) => { copy.boundaries.rights_cleared_claim = true; }],
    ["reject_design_signature_drift", (copy) => { copy.selected_candidate_signature = "generic_symbolic_system"; }],
    ["reject_generic_symbolic_primary", (copy) => { copy.quarantine_audit.generic_symbolic_primary_count = 1; }]
  ];
  for (const [name, mutate] of negativeCases) {
    const copy = structuredClone(model);
    mutate(copy);
    let failures = [];
    try {
      failures = modelContractFailures(copy);
    } catch (error) {
      failures = [error.message];
    }
    record(name, failures.length > 0, failures[0] || "mutation was not rejected");
  }
  return {
    total: cases.length,
    passed: cases.filter((item) => item.passed).length,
    all_passed: cases.every((item) => item.passed),
    cases
  };
}

async function buildManifest(model, mp4) {
  const files = (await listFilesRecursive(PACKAGE_ROOT)).filter((filePath) => filePath !== MANIFEST_PATH);
  const inventory = await inventoryFiles(files, PACKAGE_ROOT);
  const manifest = {
    schemaVersion: "fff.privateMaterializedMotionPrevisManifest.v1",
    artifact_id: ARTIFACT_ID,
    mission_id: MISSION_ID,
    generated_at: GENERATED_AT,
    selected_candidate_signature: DESIGN_SIGNATURE,
    source_artifact_id: model.source_artifact_id,
    source_mp4_sha256: model.source_mp4_sha256,
    source_integrated_fingerprint: model.source_integrated_fingerprint,
    source_readiness_fingerprint: model.source_readiness_fingerprint,
    payload_file_count: inventory.file_count,
    file_count: inventory.file_count + 1,
    package_fingerprint_sha256: inventory.aggregate_sha256,
    material_family_count: model.material_families.length,
    material_variant_count: model.material_families.reduce((sum, family) => sum + family.variants.length, 0),
    materialized_shot_count: model.materialized_coverage.covered_shot_count,
    frame_evidence_count: model.shots.length * 3,
    contact_sheet_count: 1,
    mp4,
    files: inventory.files,
    boundaries: model.boundaries
  };
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return manifest;
}

function buildResult(model, manifest, browserEvidence, targetedTests, protectedBefore, protectedAfter) {
  const allFrameEvidence = model.shots.flatMap((shot) => Object.values(shot.frame_sequence));
  const materialVariants = model.material_families.flatMap((family) => family.variants);
  const currentCandidateFrames = model.shots.map((shot) => shot.frame_sequence.mid);
  const passed = browserEvidence.passed
    && targetedTests.all_passed
    && manifest.mp4.duration_seconds === 180
    && manifest.mp4.frame_count === 5400
    && manifest.mp4.audio_stream_count === 0
    && modelContractFailures(model).length === 0;
  return {
    schemaVersion: "fff.privateMaterializedMotionPrevisResult.v1",
    artifact_id: ARTIFACT_ID,
    mission_id: MISSION_ID,
    source_artifact_id: model.source_artifact_id,
    source_mp4_sha256: model.source_mp4_sha256,
    source_integrated_fingerprint: model.source_integrated_fingerprint,
    source_readiness_fingerprint: model.source_readiness_fingerprint,
    selected_candidate_signature: DESIGN_SIGNATURE,
    duration_seconds: model.duration_seconds,
    beat_count: model.beats.length,
    shot_count: model.shots.length,
    narration_segment_count: model.timeline_tracks.narration_text.length,
    subtitle_cue_count: model.timeline_tracks.subtitles.length,
    gap_count: 0,
    overlap_count: 0,
    material_family_count: model.material_families.length,
    material_variant_count: materialVariants.length,
    materialized_shot_count: model.materialized_coverage.covered_shot_count,
    material_variant_unique_hash_count: new Set(materialVariants.map((variant) => variant.sha256)).size,
    frame_evidence_count: allFrameEvidence.length,
    frame_evidence_unique_hash_count: new Set(allFrameEvidence.map((item) => item.sha256)).size,
    non_blank_frame_evidence_count: allFrameEvidence.filter((item) => item.image_audit.non_blank).length,
    current_candidate_frame_count: currentCandidateFrames.length,
    current_candidate_unique_hash_count: new Set(currentCandidateFrames.map((item) => item.sha256)).size,
    accidental_duplicate_current_candidate_frame_count: currentCandidateFrames.length - new Set(currentCandidateFrames.map((item) => item.sha256)).size,
    boundary_test_count: browserEvidence.boundary_tests.length,
    boundary_tests_passed: browserEvidence.boundary_tests.every((item) => item.before === item.expected_before && item.at === item.expected_at),
    ambiguous_reference_ids_rendered: model.source_reference_boundaries.ambiguous_reference_ids_rendered,
    source_image_bytes_modified: 0,
    protected_predecessor_bytes_modified: 0,
    protected_dirty_file_bytes_modified: 0,
    newly_downloaded_media_count: 0,
    selected_for_production_count: 0,
    rights_cleared_claim_count: 0,
    audio_generated: false,
    voice_selected: false,
    voice_generated: false,
    image_generated: false,
    ai_video_generated: false,
    public_upload: false,
    production_approved: false,
    final_canon_decision: false,
    mp4: manifest.mp4,
    package_manifest: {
      path: MANIFEST_PATH,
      fingerprint: manifest.package_fingerprint_sha256,
      payload_file_count: manifest.payload_file_count
    },
    protected_input_evidence: {
      before: {
        dirty_file_hashes: PROTECTED_DIRTY_HASHES,
        result_hashes: PROTECTED_RESULT_HASHES,
        tree_hashes: Object.fromEntries(Object.entries(protectedBefore.protected_tree_evidence).map(([key, value]) => [key, value.sha256]))
      },
      after: {
        dirty_file_hashes: PROTECTED_DIRTY_HASHES,
        result_hashes: PROTECTED_RESULT_HASHES,
        tree_hashes: Object.fromEntries(Object.entries(protectedAfter.protected_tree_evidence).map(([key, value]) => [key, value.sha256]))
      }
    },
    targeted_tests: targetedTests,
    browser_evidence: browserEvidence,
    failures: passed ? [] : [
      ...(!browserEvidence.passed ? ["browser_evidence_failed"] : []),
      ...(!targetedTests.all_passed ? ["targeted_tests_failed"] : []),
      ...(manifest.mp4.duration_seconds !== 180 || manifest.mp4.frame_count !== 5400 || manifest.mp4.audio_stream_count !== 0 ? ["mp4_contract_failed"] : []),
      ...(modelContractFailures(model).length ? ["model_contract_failed"] : [])
    ],
    passed
  };
}

async function probeMp4(filePath) {
  const { stdout } = await execFile("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration,size,format_name:stream=codec_type,codec_name,width,height,avg_frame_rate,nb_frames",
    "-of", "json", filePath
  ], { windowsHide: true });
  const probe = JSON.parse(stdout);
  const video = probe.streams.find((stream) => stream.codec_type === "video");
  const bytes = await readFile(filePath);
  return {
    path: filePath,
    byte_size: bytes.length,
    sha256: sha256(bytes),
    duration_seconds: Number(probe.format.duration),
    format_name: probe.format.format_name,
    codec_name: video.codec_name,
    width: video.width,
    height: video.height,
    avg_frame_rate: video.avg_frame_rate,
    frame_count: Number(video.nb_frames),
    audio_stream_count: probe.streams.filter((stream) => stream.codec_type === "audio").length
  };
}

async function build({ capture = true, validateAfter = false } = {}) {
  const protectedBefore = await verifyProtectedInputs();
  const tempRoot = await mkdtemp(path.join(tmpdir(), "fff-material-motion-"));
  try {
    await mkdir(PACKAGE_ROOT, { recursive: true });
    await mkdir(FRAME_ROOT, { recursive: true });
    const sharp = await loadSharp();
    const { chromium } = await loadPlaywright();
    const browser = await chromium.launch({ channel: "msedge", headless: true });
    let model;
    let mp4;
    try {
      const materialFamilies = await renderMaterialOutputs(browser, sharp);
      model = buildModel(protectedBefore, materialFamilies);
      const sourceByShot = await renderShotSources(model, browser, materialFamilies, tempRoot);
      mp4 = await encodeMotionTimeline(model, sourceByShot, tempRoot, sharp);
      await renderContactSheet(model, browser);
      await writeStructuredArtifacts(model, materialFamilies, mp4);
    } finally {
      await browser.close();
    }
    const targetedTests = runTargetedTests(model);
    if (!targetedTests.all_passed) throw new Error(`TARGETED_TESTS_FAILED: ${JSON.stringify(targetedTests.cases.filter((item) => !item.passed))}`);
    const browserEvidence = capture
      ? await captureBrowserEvidence(model, sharp)
      : { passed: false, status: "not_captured", boundary_tests: [] };
    const manifest = await buildManifest(model, mp4);
    const protectedAfter = await verifyProtectedInputs();
    const result = buildResult(model, manifest, browserEvidence, targetedTests, protectedBefore, protectedAfter);
    await writeFile(RESULT_PATH, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    await writeFile(REVIEW_DOC_PATH, renderReviewDoc(model, mp4, browserEvidence, targetedTests, manifest), "utf8");
    if (!result.passed) throw new Error(`BUILD_EVIDENCE_FAILED: ${result.failures.join(", ")}`);
    if (validateAfter) await validatePackage(RESULT_PATH);
    console.log(`Private materialized motion previs generated: ${PACKAGE_ROOT}`);
    console.log(`MP4 SHA256: ${mp4.sha256}`);
    console.log(`Package fingerprint: ${manifest.package_fingerprint_sha256}`);
    return { model, manifest, result };
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

async function finalizeExisting({ validateAfter = false } = {}) {
  const protectedBefore = await verifyProtectedInputs();
  const [model, sharp, mp4] = await Promise.all([
    readJson(MODEL_PATH),
    loadSharp(),
    probeMp4(MP4_PATH)
  ]);
  const targetedTests = runTargetedTests(model);
  if (!targetedTests.all_passed) throw new Error(`TARGETED_TESTS_FAILED: ${JSON.stringify(targetedTests.cases.filter((item) => !item.passed))}`);
  const browserEvidence = await captureBrowserEvidence(model, sharp);
  const manifest = await buildManifest(model, mp4);
  const protectedAfter = await verifyProtectedInputs();
  const result = buildResult(model, manifest, browserEvidence, targetedTests, protectedBefore, protectedAfter);
  await writeFile(RESULT_PATH, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  await writeFile(REVIEW_DOC_PATH, renderReviewDoc(model, mp4, browserEvidence, targetedTests, manifest), "utf8");
  if (!result.passed) throw new Error(`BUILD_EVIDENCE_FAILED: ${result.failures.join(", ")}`);
  if (validateAfter) await validatePackage(RESULT_PATH);
  console.log(`Existing private materialized motion previs finalized: ${PACKAGE_ROOT}`);
  console.log(`MP4 SHA256: ${mp4.sha256}`);
  console.log(`Package fingerprint: ${manifest.package_fingerprint_sha256}`);
  return { model, manifest, result };
}

async function validatePackage(inputPath = RESULT_PATH) {
  const snapshotFiles = [
    ...await listFilesRecursive(PACKAGE_ROOT),
    inputPath,
    REVIEW_DOC_PATH,
    ...Object.values(SCREENSHOTS)
  ].filter((filePath) => existsSync(filePath));
  const before = await inventoryFiles(snapshotFiles, ".");
  const [protectedInputs, model, manifest, result, sourcePreview, rootManifest, html, reviewDoc] = await Promise.all([
    verifyProtectedInputs(),
    readJson(MODEL_PATH),
    readJson(MANIFEST_PATH),
    readJson(inputPath),
    readJson(PREVIEW_MODEL_PATH),
    readJson("artifacts/artifact-manifest.json"),
    readFile(HTML_PATH, "utf8"),
    readFile(REVIEW_DOC_PATH, "utf8")
  ]);
  const failures = [];
  const require = (condition, message) => { if (!condition) failures.push(message); };
  for (const failure of modelContractFailures(model)) failures.push(failure);
  require(result.artifact_id === ARTIFACT_ID && manifest.artifact_id === ARTIFACT_ID, "artifact identity mismatch");
  require(model.source_artifact_id === sourcePreview.artifact_id && model.source_mp4_sha256 === ACCEPTED_PREVIEW_MP4_SHA256, "accepted preview binding mismatch");
  require(JSON.stringify(model.beats) === JSON.stringify(sourcePreview.beats), "Beat chronology drift");
  require(JSON.stringify(model.timeline_tracks) === JSON.stringify(sourcePreview.timeline_tracks), "narration/subtitle identity drift");
  for (let index = 0; index < model.shots.length; index += 1) {
    const shot = model.shots[index];
    const sourceShot = sourcePreview.shots[index];
    for (const field of ["shot_id", "sequence", "beat_number", "start_seconds", "end_seconds", "duration_seconds", "motion", "transition", "narration_segment_id"]) {
      require(JSON.stringify(shot[field]) === JSON.stringify(sourceShot[field]), `source shot field drift ${shot.shot_id}/${field}`);
    }
    require(JSON.stringify(shot.subtitle_cue_ids) === JSON.stringify(sourceShot.subtitle_cue_ids), `subtitle mapping drift ${shot.shot_id}`);
    for (const state of ["start", "mid", "end"]) {
      const evidence = shot.frame_sequence[state];
      require(Boolean(evidence) && existsSync(evidence?.path), `missing ${state} frame ${shot.shot_id}`);
      if (evidence && existsSync(evidence.path)) {
        require(sha256(await readFile(evidence.path)) === evidence.sha256, `frame hash mismatch ${shot.shot_id}/${state}`);
        require(evidence.image_audit.non_blank === true, `blank frame ${shot.shot_id}/${state}`);
      }
    }
  }
  const materialVariants = model.material_families.flatMap((family) => family.variants);
  require(materialVariants.length === 26, "material variant count mismatch");
  require(new Set(materialVariants.map((variant) => variant.sha256)).size === 26, "material variant hash collision");
  for (const variant of materialVariants) {
    require(existsSync(variant.output_path), `missing material variant ${variant.output_path}`);
    if (existsSync(variant.output_path)) {
      require(sha256(await readFile(variant.output_path)) === variant.sha256, `material variant hash mismatch ${variant.output_path}`);
      require(variant.image_audit.non_blank === true && variant.image_audit.width === 960 && variant.image_audit.height === 540, `material image audit mismatch ${variant.output_path}`);
    }
  }
  const liveMp4 = await probeMp4(MP4_PATH);
  require(JSON.stringify(liveMp4) === JSON.stringify(manifest.mp4), "live MP4 probe/hash mismatch");
  require(liveMp4.codec_name === "h264" && liveMp4.width === 960 && liveMp4.height === 540 && liveMp4.avg_frame_rate === "30/1", "MP4 video profile mismatch");
  require(liveMp4.duration_seconds === 180 && liveMp4.frame_count === 5400 && liveMp4.audio_stream_count === 0, "MP4 duration/frame/audio contract mismatch");
  const packageFiles = (await listFilesRecursive(PACKAGE_ROOT)).filter((filePath) => filePath !== MANIFEST_PATH);
  const packageInventory = await inventoryFiles(packageFiles, PACKAGE_ROOT);
  require(packageInventory.file_count === 92, `unexpected package payload count ${packageInventory.file_count}`);
  require(manifest.package_fingerprint_sha256 === packageInventory.aggregate_sha256 && JSON.stringify(manifest.files) === JSON.stringify(packageInventory.files), "package manifest mismatch");
  require(manifest.material_family_count === 9 && manifest.material_variant_count === 26 && manifest.frame_evidence_count === 57 && manifest.contact_sheet_count === 1, "manifest evidence counts mismatch");
  require(rootManifest.artifact_id === "fff-private-previsualization-timeline-001", "accepted preview is no longer the default artifact");
  require(rootManifest.successor_candidate_artifact_id === ARTIFACT_ID && rootManifest.private_materialized_motion_previs?.artifact_id === ARTIFACT_ID, "root successor-candidate registration mismatch");
  require(rootManifest.private_materialized_motion_previs?.result_path === RESULT_PATH && rootManifest.private_materialized_motion_previs?.review_doc_path === REVIEW_DOC_PATH, "root candidate path registration mismatch");
  require(rootManifest.private_materialized_motion_previs_package_fingerprint === manifest.package_fingerprint_sha256 && rootManifest.private_materialized_motion_previs?.package_fingerprint_sha256 === manifest.package_fingerprint_sha256, "root package fingerprint mismatch");
  require(rootManifest.private_materialized_motion_previs_mp4_size === liveMp4.byte_size && rootManifest.private_materialized_motion_previs_mp4_sha256 === liveMp4.sha256, "root MP4 registration mismatch");
  const desktopScreenshot = result.browser_evidence.screenshots.find((item) => item.relative_path === SCREENSHOTS.desktop);
  const narrowScreenshot = result.browser_evidence.screenshots.find((item) => item.relative_path === SCREENSHOTS.narrow);
  require(rootManifest.private_materialized_motion_previs_screenshot_desktop_size === desktopScreenshot?.byte_size && rootManifest.private_materialized_motion_previs_screenshot_desktop_sha256 === desktopScreenshot?.sha256, "root desktop screenshot registration mismatch");
  require(rootManifest.private_materialized_motion_previs_screenshot_narrow_size === narrowScreenshot?.byte_size && rootManifest.private_materialized_motion_previs_screenshot_narrow_sha256 === narrowScreenshot?.sha256, "root narrow screenshot registration mismatch");
  require(/validate-private-materialized-motion-previs/.test(rootManifest.validation_command), "root validation command missing");
  require(/id="playbackCanvas"/.test(html) && /id="scrubber"/.test(html) && /Nine deterministic material families/.test(html), "playback/timeline surface missing");
  require((html.match(/MATERIAL PREVIS \/ PRIVATE \/ NOT FOR PUBLICATION/g) || []).length >= 1, "watermark missing from player");
  require((html.match(/<video\b/g) || []).length === 1 && !/<audio\b/i.test(html), "player media-element contract mismatch");
  require(!/<(?:img|video|source)[^>]+src=["']https?:/i.test(html), "remote media hotlink found");
  const inlineScripts = [...html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)].map((match) => match[1]).filter((script) => script.trim() && !script.trim().startsWith("{"));
  for (const script of inlineScripts) {
    try { new Function(script); } catch (error) { failures.push(`inline script syntax: ${error.message}`); }
  }
  const targetedTests = runTargetedTests(model);
  require(targetedTests.all_passed && targetedTests.total >= 16, "targeted tests failed");
  require(result.passed === true && result.failures.length === 0 && result.browser_evidence.passed === true, "result/browser evidence not green");
  require(result.targeted_tests.all_passed === true && result.frame_evidence_count === 57 && result.frame_evidence_unique_hash_count === 57 && result.non_blank_frame_evidence_count === 57, "result evidence counts mismatch");
  require(result.current_candidate_frame_count === 19 && result.current_candidate_unique_hash_count === 19 && result.accidental_duplicate_current_candidate_frame_count === 0, "current-candidate frame uniqueness mismatch");
  require(result.selected_for_production_count === 0 && result.rights_cleared_claim_count === 0 && result.newly_downloaded_media_count === 0, "result closed gates changed");
  require(result.source_image_bytes_modified === 0 && result.protected_predecessor_bytes_modified === 0 && result.protected_dirty_file_bytes_modified === 0, "protected input result mismatch");
  require(result.protected_input_evidence.before.tree_hashes[PREVIEW_ROOT] === protectedInputs.protected_tree_evidence[PREVIEW_ROOT].sha256, "protected preview evidence mismatch");
  require(/Accepted private preview replacement: false/.test(reviewDoc) && /AI image\/audio\/video generation: false/.test(reviewDoc), "review boundary statement missing");
  const after = await inventoryFiles(snapshotFiles, ".");
  require(before.aggregate_sha256 === after.aggregate_sha256, "read-only validator mutated Mission artifacts");
  if (failures.length) throw new Error(`Private materialized motion previs validation failed: ${failures.join("; ")}`);
  console.log(`Private materialized motion previs read-only validation passed: ${inputPath}`);
  return { passed: true, failures: [] };
}

async function renderFamily(requirementId) {
  await verifyProtectedInputs();
  const sharp = await loadSharp();
  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const before = existsSync(`${MATERIAL_ROOT}/${requirementId}`)
      ? await inventoryFiles(await listFilesRecursive(`${MATERIAL_ROOT}/${requirementId}`), ".")
      : null;
    const rendered = await renderMaterialOutputs(browser, sharp, requirementId);
    const after = await inventoryFiles(await listFilesRecursive(`${MATERIAL_ROOT}/${requirementId}`), ".");
    if (before && before.aggregate_sha256 !== after.aggregate_sha256) {
      throw new Error(`DETERMINISTIC_REGENERATION_MISMATCH: ${requirementId}`);
    }
    console.log(`Deterministic material family rendered: ${requirementId} (${rendered[0].variants.length} variants)`);
    return rendered[0];
  } finally {
    await browser.close();
  }
}

export async function runPrivateMaterializedMotionPrevisCommand({ command, inputPath, outputPath }) {
  if (outputPath) throw new Error("Private materialized motion previs commands do not accept an output path.");
  if (command === "validate-private-materialized-motion-previs") return await validatePackage(inputPath || RESULT_PATH);
  if (command === "smoke-private-materialized-motion-previs") return await build({ capture: true, validateAfter: true });
  throw new Error(`Unsupported Private Materialized Motion Previs command: ${command}`);
}

async function main() {
  const command = process.argv[2] || "build";
  if (command === "build") return await build({ capture: true, validateAfter: false });
  if (command === "finalize") return await finalizeExisting({ validateAfter: false });
  if (command === "smoke") return await build({ capture: true, validateAfter: true });
  if (command === "validate") return await validatePackage(process.argv[3] || RESULT_PATH);
  if (command === "test") {
    const model = await readJson(MODEL_PATH);
    const tests = runTargetedTests(model);
    console.log(JSON.stringify(tests, null, 2));
    if (!tests.all_passed) process.exitCode = 1;
    return tests;
  }
  if (command === "render-family") return await renderFamily(process.argv[3]);
  console.log("Usage: node tools/fff-private-materialized-motion-previs.mjs <build|finalize|smoke|validate|test|render-family REQUIREMENT_ID>");
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}
