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

const ARTIFACT_ID = "fff-private-previsualization-timeline-001";
const SOURCE_ARTIFACT_ID = "fff-integrated-visual-production-package-001";
const SOURCE_FINGERPRINT = "78438f153257b5559a06d1b2cc638aa152adf432c1d0a414febf83296e4eb5eb";
const READINESS_ARTIFACT_ID = "fff-asset-rights-readiness-packet-001";
const READINESS_BASE_FINGERPRINT = "b3fd1760800a705193be544364e0892299deb318fc77383a472cd3614b8eef5d";
const GENERATED_AT = "2026-07-21T12:00:00+09:00";
const PACKAGE_ROOT = "artifacts/private-previsualization-timeline";
const FRAMES_ROOT = `${PACKAGE_ROOT}/frames`;
const REQUIREMENT_THUMB_ROOT = `${PACKAGE_ROOT}/requirement-thumbnails`;
const MODEL_PATH = `${PACKAGE_ROOT}/private-previsualization-timeline.json`;
const HTML_PATH = `${PACKAGE_ROOT}/private-previsualization-timeline.html`;
const SHOT_CSV_PATH = `${PACKAGE_ROOT}/shot-timeline.csv`;
const THUMBNAIL_CSV_PATH = `${PACKAGE_ROOT}/thumbnail-map.csv`;
const CONTACT_SHEET_PATH = `${PACKAGE_ROOT}/private-previsualization-contact-sheet.jpg`;
const MANIFEST_PATH = `${PACKAGE_ROOT}/private-previsualization-manifest.json`;
const MP4_PATH = `${PACKAGE_ROOT}/private-previsualization-timeline.mp4`;
const RESULT_PATH = "artifacts/private-previsualization-timeline-result.json";
const REVIEW_DOC_PATH = "docs/review/private-previsualization-timeline.md";
const SCREENSHOTS = {
  desktop: "artifacts/review-screens/private-previsualization-timeline-1440x1000-desktop.png",
  narrow: "artifacts/review-screens/private-previsualization-timeline-390x844-narrow.png"
};

const AMBIGUOUS_REFERENCE_IDS = new Set([
  "ref-b04-s03-closed-meeting-room",
  "ref-b04-shared-general-ledger"
]);

const SHOT_RECIPES = {
  "shot-b01-01": { template: "station_tower", refs: ["ref-w1-b01-s01-kreiensen-station", "ref-w1-b01-s01-harvard-observatory"], motif: "空の鐘枠", grade: "midnight" },
  "shot-b01-02": { template: "empty_mount", refs: ["ref-w1-b01-s02-wood-joints", "ref-w1-b01-s02-beam-junction"], motif: "空いた取付点", grade: "paper" },
  "shot-b01-03": { template: "noon_hold", refs: ["ref-w1-b01-s03-belfry-interior-art", "ref-w1-b01-s03-noon-mark"], motif: "空枠 / 12:00", grade: "cool" },
  "shot-b02-01": { template: "watch_hands", refs: ["ref-b02-s01-precision-handwork", "ref-b02-s01-watch-repair-workbench"], motif: "修理の手元", grade: "paper" },
  "shot-b02-02": { template: "memo_moth", refs: ["ref-b02-s02-aged-handwritten-letter", "ref-b02-s02-metal-butterfly-brooch"], motif: "メモ + 静止した真鍮の蛾", grade: "brass" },
  "shot-b02-03": { template: "time_moth", refs: ["ref-b02-s03-vintage-watch-0915", "ref-b02-s02-metal-butterfly-brooch", "ref-b02-s03-brass-clock-dial"], motif: "9:17 / 蛾", grade: "brass", intentional_reuse_label: "shared motif / brass moth" },
  "shot-b03-01": { template: "ledger_open", refs: ["ref-w1-b03-s01-page-turning", "ref-w1-b03-s01-book-in-hand"], motif: "台帳を開く手", grade: "paper" },
  "shot-b03-02": { template: "fictional_ledger", refs: ["ref-w1-b03-s02-blank-book"], motif: "名前 / 分", grade: "paper" },
  "shot-b03-03": { template: "fading_names", refs: ["ref-w1-b03-s03-old-paper"], motif: "完全 → 薄い → 欠けた輪郭", grade: "cool" },
  "shot-b04-01": { template: "council_silhouettes", refs: ["ref-b04-s01-frosted-partition"], motif: "匿名の制度影", grade: "midnight" },
  "shot-b04-02": { template: "equal_hypotheses", refs: ["ref-b04-s02-card-catalogue", "ref-b04-s02-time-recorder"], motif: "二説 50:50", grade: "rust" },
  "shot-b04-03": { template: "original_closed_room", refs: [], motif: "閉じた制度空間 / 架空台帳", grade: "midnight", deterministic_substitution: "ambiguous-license room and ledger references excluded" },
  "shot-b05-01": { template: "toma_fates", refs: [], motif: "トーマ / 四候補", grade: "cool", deterministic_substitution: "neutral local silhouette replaces identifiable-person proxy" },
  "shot-b05-02": { template: "moth_functions", refs: ["ref-b02-s02-metal-butterfly-brooch", "ref-w2-b05-s02-brass-plate"], motif: "真鍮の蛾 / 三機能候補", grade: "brass", intentional_reuse_label: "callback / brass moth" },
  "shot-b05-03": { template: "council_motives", refs: ["ref-b04-s02-card-catalogue"], motif: "評議会 / 四動機候補", grade: "rust", deterministic_substitution: "ambiguous-license meeting-room reference excluded" },
  "shot-b05-04": { template: "three_holds", refs: ["ref-b02-s02-metal-butterfly-brooch"], motif: "Toma / moth / Council = HOLD", grade: "cool", intentional_reuse_label: "callback / three unresolved motifs" },
  "shot-b06-01": { template: "time_names_split", refs: ["ref-b02-s03-vintage-watch-0915", "ref-w1-b03-s02-blank-book"], motif: "時間 46% / 空白 8% / 名前 46%", grade: "cool", intentional_reuse_label: "shared motif / time and ledger" },
  "shot-b06-02": { template: "blank_ledger_close", refs: ["ref-w2-b06-s02-closed-book", "ref-w1-b03-s02-blank-book"], motif: "未記入欄を残す", grade: "paper" },
  "shot-b06-03": { template: "tower_return", refs: ["ref-w1-b01-s01-harvard-observatory", "ref-w1-b01-s01-kreiensen-station"], motif: "空の鐘枠 / 時間か、名前か", grade: "midnight", intentional_reuse_label: "callback / opening tower composition" }
};

const REQUIREMENT_THUMBNAILS = {
  "AR-ENV-01": ["shot-b01-01", "鐘のない天文台と空の鐘枠"],
  "AR-ENV-02": ["shot-b04-03", "半透明仕切りを含む中立的な制度空間"],
  "AR-CHAR-01": ["shot-b03-01", "顔を特定しない台帳を開く手元"],
  "AR-CHAR-02": ["shot-b04-01", "匿名の評議会シルエット"],
  "AR-CHAR-03": ["shot-b05-01", "トーマの未確定シルエットと四候補"],
  "AR-PROP-01": ["shot-b02-03", "時計面と9:17の時刻motif"],
  "AR-PROP-02": ["shot-b05-02", "静止した真鍮の蛾"],
  "AR-PROP-03": ["shot-b02-02", "手書きのメモ／written note"],
  "AR-DOC-01": ["shot-b03-02", "架空台帳の名前欄と『分』欄"],
  "AR-DOC-02": ["shot-b05-03", "同じ重みの候補図版システム"],
  "AR-ABS-01": ["shot-b03-03", "名前／文字輪郭が三段階で薄れる"],
  "AR-ABS-02": ["shot-b06-01", "時間と名前を46:8:46で等分"],
  "AR-TYPE-01": ["shot-b05-04", "日本語firstの短いlabelとHOLD表示"],
  "AR-AUDIO-01": ["shot-b01-03", "六幕のsilent cue位置。音声素材は含まない"]
};

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function timeToSeconds(value) {
  const parts = String(value).split(":").map(Number);
  return parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0] * 3600 + parts[1] * 60 + parts[2];
}

function formatTime(seconds) {
  const safe = Math.max(0, Math.min(180, Number(seconds) || 0));
  const minutes = Math.floor(safe / 60);
  const whole = Math.floor(safe % 60);
  const tenths = Math.floor((safe - Math.floor(safe)) * 10 + 1e-6);
  return `${String(minutes).padStart(2, "0")}:${String(whole).padStart(2, "0")}.${tenths}`;
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

function mimeFor(filePath) {
  return path.extname(filePath).toLowerCase() === ".png" ? "image/png" : "image/jpeg";
}

async function fileDataUrl(filePath) {
  const bytes = await readFile(filePath);
  return `data:${mimeFor(filePath)};base64,${bytes.toString("base64")}`;
}

async function loadPlaywright() {
  const moduleRoot = process.env.FFF_NODE_MODULES;
  if (!moduleRoot) throw new Error("Browser rendering requires the bundled Playwright runtime; set FFF_NODE_MODULES.");
  let entry = path.join(moduleRoot, "playwright", "index.mjs");
  try {
    const packages = await readdir(path.join(moduleRoot, ".pnpm"));
    const bundled = packages.find((name) => /^playwright@/.test(name));
    if (bundled) entry = path.join(moduleRoot, ".pnpm", bundled, "node_modules", "playwright", "index.mjs");
  } catch { /* flat package layout */ }
  return await import(pathToFileURL(entry).href);
}

function localCompositionMarkup(shot, recipe, dataUrlByReference) {
  const image = (referenceId, className = "") => {
    const source = dataUrlByReference.get(referenceId);
    if (!source) return "";
    return `<img class="source ${className}" src="${source}" alt="">`;
  };
  const ledgerRows = Array.from({ length: 6 }, (_, index) => `<div class="ledger-row"><span>${["アサ", "ミロ", "ネイ", "ソラ", "イヴ", "ロウ"][index]}</span><span>${["12", "08", "21", "05", "17", "03"][index]} 分</span></div>`).join("");
  const candidate = (label, note = "未決定") => `<div class="candidate"><strong>${label}</strong><small>${note}</small></div>`;
  switch (recipe.template) {
    case "station_tower": return `${image(recipe.refs[0], "cover station")}${image(recipe.refs[1], "tower-inset")}<div class="arch empty"><span>EMPTY BELL FRAME</span></div><div class="depth-lines"></div>`;
    case "empty_mount": return `${image(recipe.refs[0], "cover wood")}${image(recipe.refs[1], "joint-inset")}<div class="mount-ring"><i></i><i></i><i></i><i></i><span>取付面のみ</span></div>`;
    case "noon_hold": return `${image(recipe.refs[0], "cover dim")}${image(recipe.refs[1], "noon-inset")}<div class="arch empty large"><span>12:00 / 正午</span></div>`;
    case "watch_hands": return `${image(recipe.refs[1], "cover dim")}${image(recipe.refs[0], "hands-focus")}<div class="work-grid"><span>FACE OUT</span><span>TOOLS / HANDS</span></div>`;
    case "memo_moth": return `<div class="split memo">${image(recipe.refs[0], "panel-image")}<div class="panel-label">MEMO / written note</div></div><div class="split moth">${image(recipe.refs[1], "panel-image")}<div class="panel-label">BRASS MOTH / 静止</div></div><div class="split-gap"></div>`;
    case "time_moth": return `${image(recipe.refs[2], "cover dim")}${image(recipe.refs[0], "clock-focus")}${image(recipe.refs[1], "moth-focus")}<div class="time-stamp">9:17</div><div class="causal-break">TIME&nbsp;&nbsp;≠&nbsp;&nbsp;CAUSE</div>`;
    case "ledger_open": return `${image(recipe.refs[0], "cover")}${image(recipe.refs[1], "book-inset")}<div class="privacy-mask">FACE / ID OUT OF FRAME</div>`;
    case "fictional_ledger": return `${image(recipe.refs[0], "cover paper-bg")}<div class="ledger"><div class="ledger-head"><span>名前</span><span>分</span></div>${ledgerRows}<div class="fiction-label">FICTIONAL INSERT / 実在記録ではない</div></div>`;
    case "fading_names": return `${image(recipe.refs[0], "cover paper-bg")}<div class="fade-stages"><div class="name-contour full">N A M E / 名前</div><div class="name-contour pale">N A M E / 名前</div><div class="name-contour broken">N&nbsp;&nbsp;M&nbsp;&nbsp;/&nbsp;名</div></div><div class="stage-labels"><span>完全</span><span>薄い</span><span>欠けた</span></div>`;
    case "council_silhouettes": return `${image(recipe.refs[0], "cover frost")}<div class="partition"></div><div class="silhouettes"><i></i><i></i><i></i></div><div class="neutral-label">ANONYMOUS / ROLE UNKNOWN / GUILT NOT IMPLIED</div>`;
    case "equal_hypotheses": return `${image(recipe.refs[0], "half-bg left-bg")}${image(recipe.refs[1], "half-bg right-bg")}<div class="equal-grid"><div><strong>時間販売の告発？</strong><span>HYPOTHESIS A / 50%</span></div><div><strong>偽の記録？</strong><span>HYPOTHESIS B / 50%</span></div></div><div class="equal-axis">＝</div>`;
    case "original_closed_room": return `<div class="room"><div class="wall left-wall"></div><div class="wall right-wall"></div><div class="door"></div><div class="table"></div></div><div class="ledger-shadow"><div class="ledger-head"><span>NAME</span><span>MIN</span></div>${ledgerRows}</div><div class="motive-label">MOTIVE UNKNOWN</div>`;
    case "toma_fates": return `<div class="toma-silhouette"><i></i><span>TOMA / 未確定</span></div><div class="fate-grid">${candidate("生存？")}${candidate("死亡？")}${candidate("消去？")}${candidate("潜伏？")}</div>`;
    case "moth_functions": return `${image(recipe.refs[1], "cover brass-bg")}${image(recipe.refs[0], "moth-center")}<div class="moth-ring"><span>BRASS MOTH</span></div><div class="function-grid">${candidate("KEY?")}${candidate("SPY?")}${candidate("MEMORY?")}</div>`;
    case "council_motives": return `${image(recipe.refs[0], "cover dim catalogue")}<div class="institution-mark">COUNCIL / motive unresolved</div><div class="motive-grid">${candidate("villainous?")}${candidate("desperate?")}${candidate("divided?")}${candidate("misled?")}</div>`;
    case "three_holds": return `<div class="hold-grid"><div><i class="mini-person"></i><strong>TOMA</strong><span>HOLD</span></div><div>${image(recipe.refs[0], "mini-moth")}<strong>MOTH</strong><span>HOLD</span></div><div><i class="mini-room"></i><strong>COUNCIL</strong><span>HOLD</span></div></div><div class="callback-label">CALLBACK / three unresolved motifs</div>`;
    case "time_names_split": return `<div class="time-half">${image(recipe.refs[0], "cover")}<strong>時間 / TIME</strong></div><div class="decision-gap"><span>未決定</span></div><div class="names-half">${image(recipe.refs[1], "cover paper-bg")}<div class="name-lines"><span>名前</span><span>＿＿＿＿</span><span>＿＿＿＿</span><span>＿＿＿＿</span></div><strong>名前 / NAMES</strong></div><div class="balance-label">46% &nbsp; / &nbsp; 8% BLANK &nbsp; / &nbsp; 46%</div>`;
    case "blank_ledger_close": return `${image(recipe.refs[0], "cover dim")}${image(recipe.refs[1], "open-book")}<div class="blank-columns"><div class="ledger-head"><span>名前</span><span>分</span></div>${Array.from({ length: 5 }, () => '<div class="ledger-row"><span>＿＿＿＿</span><span>＿＿</span></div>').join("")}</div><div class="unwritten">未記入 / NO CONCLUSION</div>`;
    case "tower_return": return `${image(recipe.refs[1], "cover station return")}${image(recipe.refs[0], "tower-return")}<div class="arch empty return-arch"></div><div class="ending-question">時間か、名前か</div><div class="callback-label">CALLBACK / opening tower composition</div>`;
    default: return `<div class="fallback">${escapeHtml(shot.screen_ja)}</div>`;
  }
}

function renderFrameHtml(shot, recipe, dataUrlByReference) {
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>
  *{box-sizing:border-box}html,body{margin:0;width:1280px;height:720px;overflow:hidden;background:#111;color:#fff;font-family:"Segoe UI","Noto Sans JP",sans-serif}.frame{position:relative;width:1280px;height:720px;overflow:hidden;background:#121719}.source{position:absolute;display:block;object-fit:cover}.cover{inset:0;width:100%;height:100%}.dim{filter:brightness(.48) saturate(.65)}.paper-bg{filter:sepia(.25) brightness(.72)}.station{filter:brightness(.52) saturate(.6);transform:scale(1.03)}.tower-inset{right:55px;top:60px;width:350px;height:520px;object-fit:cover;filter:grayscale(.2) brightness(.62);clip-path:polygon(15% 0,100% 0,100% 100%,0 100%,0 16%)}.arch{position:absolute;border:16px solid rgba(226,216,187,.8);border-bottom:0;border-radius:180px 180px 0 0;width:270px;height:350px;left:54%;top:92px;box-shadow:0 0 0 3px rgba(20,24,24,.75) inset}.arch span{position:absolute;bottom:-55px;left:50%;transform:translateX(-50%);white-space:nowrap;font-size:16px;letter-spacing:.14em}.arch.large{left:38%;top:62px;width:330px;height:420px}.arch.return-arch{left:54%;top:72px;width:300px;height:390px}.depth-lines{position:absolute;left:0;bottom:120px;width:68%;height:150px;border-top:3px solid rgba(255,255,255,.36);transform:skewY(-7deg);box-shadow:0 30px 0 rgba(255,255,255,.16),0 60px 0 rgba(255,255,255,.09)}.wood{filter:brightness(.62) saturate(.6)}.joint-inset{left:65px;top:78px;width:520px;height:420px;object-fit:cover;border:3px solid rgba(244,231,198,.65);filter:brightness(.68)}.mount-ring{position:absolute;right:170px;top:150px;width:280px;height:280px;border:20px solid #736246;border-radius:50%;box-shadow:0 0 0 7px #1c1712,0 0 70px rgba(246,201,112,.2)}.mount-ring i{position:absolute;width:20px;height:20px;background:#28221b;border-radius:50%}.mount-ring i:nth-child(1){left:10px;top:15px}.mount-ring i:nth-child(2){right:10px;top:15px}.mount-ring i:nth-child(3){left:10px;bottom:15px}.mount-ring i:nth-child(4){right:10px;bottom:15px}.mount-ring span{position:absolute;bottom:-48px;width:100%;text-align:center;letter-spacing:.12em}.noon-inset{right:50px;bottom:70px;width:250px;height:210px;object-fit:cover;border:2px solid #cfb98c;filter:brightness(.75)}.hands-focus{position:absolute;left:40px;top:80px;width:790px;height:520px;object-fit:cover;object-position:center 70%;border:3px solid rgba(238,214,167,.6)}.work-grid{position:absolute;right:58px;top:140px;display:grid;gap:18px}.work-grid span,.privacy-mask,.neutral-label,.institution-mark{padding:12px 18px;border:1px solid rgba(255,255,255,.45);background:rgba(7,12,13,.75);letter-spacing:.12em}.split{position:absolute;top:0;bottom:0;overflow:hidden}.split.memo{left:0;width:66%}.split.moth{right:0;width:32%}.panel-image{width:100%;height:100%;object-fit:cover;filter:brightness(.7) saturate(.7)}.split.moth .panel-image{object-position:center;filter:brightness(.72) sepia(.2) saturate(.9)}.panel-label{position:absolute;left:24px;bottom:95px;padding:10px 14px;background:rgba(8,10,10,.82);border-left:5px solid #d2a14f;font-weight:700}.split-gap{position:absolute;left:66%;width:2%;height:100%;background:#070909}.clock-focus{left:-110px;top:-100px;width:890px;height:890px;object-fit:cover;border-radius:50%;filter:brightness(.58) sepia(.25)}.moth-focus{right:70px;bottom:90px;width:390px;height:310px;object-fit:contain;filter:brightness(.72) sepia(.25);drop-shadow:0 14px 16px #000}.time-stamp{position:absolute;right:150px;top:90px;font:800 94px/1 monospace;color:#f0d596;text-shadow:0 4px 20px #000}.causal-break{position:absolute;right:105px;top:220px;letter-spacing:.18em;background:#111c;padding:9px 15px}.book-inset{right:45px;top:65px;width:430px;height:500px;object-fit:cover;filter:brightness(.65);border:3px solid rgba(255,255,255,.55)}.privacy-mask{position:absolute;left:50px;bottom:88px}.ledger{position:absolute;left:175px;right:175px;top:105px;bottom:90px;padding:28px 38px;background:rgba(237,222,187,.92);color:#271f18;border:8px double #584938;transform:perspective(900px) rotateX(4deg)}.ledger-head,.ledger-row{display:grid;grid-template-columns:2fr 1fr;border-bottom:2px solid rgba(55,39,24,.45)}.ledger-head{font-weight:800;font-size:29px;border-bottom:4px solid #4c3927}.ledger-row span,.ledger-head span{padding:9px 15px;border-right:2px solid rgba(55,39,24,.35)}.fiction-label{position:absolute;right:18px;bottom:12px;font-size:13px;letter-spacing:.1em}.fade-stages{position:absolute;left:80px;right:80px;top:165px;display:grid;grid-template-columns:repeat(3,1fr);gap:30px}.name-contour{height:260px;display:grid;place-items:center;border:3px solid currentColor;font:900 36px/1.2 serif;letter-spacing:.18em;background:rgba(235,224,198,.55);color:#282019}.name-contour.pale{opacity:.42;border-style:dashed}.name-contour.broken{opacity:.25;border-style:dashed;background:repeating-linear-gradient(90deg,transparent 0 22px,rgba(30,25,20,.1) 22px 35px)}.stage-labels{position:absolute;left:80px;right:80px;top:445px;display:grid;grid-template-columns:repeat(3,1fr);gap:30px;text-align:center;letter-spacing:.18em}.frost{filter:brightness(.48) blur(1px)}.partition{position:absolute;inset:0;background:linear-gradient(90deg,rgba(220,236,232,.22),rgba(120,142,140,.36),rgba(220,236,232,.2));backdrop-filter:blur(5px)}.silhouettes{position:absolute;left:280px;right:280px;bottom:100px;height:430px;display:flex;justify-content:space-between;align-items:end}.silhouettes i{display:block;width:170px;height:290px;background:#141b1c;border-radius:80px 80px 20px 20px;box-shadow:0 -80px 0 -32px #141b1c}.neutral-label{position:absolute;right:40px;top:40px;font-size:13px}.half-bg{top:0;width:50%;height:100%;object-fit:cover;filter:brightness(.25) grayscale(.25)}.left-bg{left:0}.right-bg{right:0}.equal-grid{position:absolute;inset:70px 60px 100px;display:grid;grid-template-columns:1fr 1fr;gap:30px}.equal-grid>div{display:grid;place-items:center;text-align:center;border:4px solid #d0b07c;background:rgba(23,25,26,.76);padding:30px}.equal-grid strong{font-size:38px}.equal-grid span{font-size:16px;letter-spacing:.13em}.equal-axis{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:66px;height:66px;border-radius:50%;display:grid;place-items:center;background:#d0b07c;color:#181818;font-size:32px;font-weight:900}.room{position:absolute;inset:0;background:#1b2528;perspective:600px}.wall{position:absolute;top:0;bottom:0;width:52%;background:#334348}.left-wall{left:0;transform-origin:left;transform:rotateY(22deg)}.right-wall{right:0;transform-origin:right;transform:rotateY(-22deg)}.door{position:absolute;left:50%;top:90px;bottom:100px;width:260px;transform:translateX(-50%);background:#11191b;border:10px solid #5b6768}.table{position:absolute;left:270px;right:270px;bottom:80px;height:170px;background:#15191a;transform:perspective(500px) rotateX(55deg)}.ledger-shadow{position:absolute;left:70px;bottom:70px;width:430px;padding:18px;background:rgba(20,15,12,.72);transform:rotate(-6deg);opacity:.9}.ledger-shadow .ledger-row,.ledger-shadow .ledger-head{font-size:12px}.motive-label{position:absolute;right:70px;bottom:80px;padding:15px 24px;border:2px solid #c5ad7a;letter-spacing:.22em;background:#0b0e0ed9}.toma-silhouette{position:absolute;left:70px;top:80px;bottom:100px;width:30%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#182226}.toma-silhouette i,.mini-person{display:block;width:150px;height:250px;background:#050708;border-radius:70px 70px 15px 15px;box-shadow:0 -85px 0 -45px #050708}.toma-silhouette span{margin-top:35px;letter-spacing:.18em}.fate-grid{position:absolute;left:38%;right:70px;top:80px;bottom:100px;display:grid;grid-template-columns:1fr 1fr;gap:18px}.candidate{display:grid;place-items:center;text-align:center;border:2px solid rgba(222,209,177,.75);background:rgba(31,39,41,.86);padding:16px}.candidate strong{font-size:26px}.candidate small{display:block;color:#c9d2d0;letter-spacing:.12em}.brass-bg{filter:brightness(.25) sepia(.55) saturate(.7)}.moth-center{position:absolute;left:50%;top:52px;transform:translateX(-50%);width:350px;height:300px;object-fit:contain;filter:brightness(.7) sepia(.25)}.moth-ring{position:absolute;left:50%;top:40px;transform:translateX(-50%);width:350px;height:310px;border:3px solid #d3ab5e;border-radius:50%;display:flex;align-items:flex-end;justify-content:center;padding-bottom:14px}.function-grid{position:absolute;left:140px;right:140px;bottom:85px;height:190px;display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.catalogue{filter:brightness(.22) grayscale(.5)}.institution-mark{position:absolute;left:50px;top:50px}.motive-grid{position:absolute;inset:150px 120px 95px;display:grid;grid-template-columns:1fr 1fr;gap:18px}.hold-grid{position:absolute;inset:100px 70px 120px;display:grid;grid-template-columns:repeat(3,1fr);gap:24px}.hold-grid>div{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;border:3px solid #829190;background:#192326}.hold-grid strong{font-size:25px;letter-spacing:.15em}.hold-grid span{padding:7px 18px;background:#c4aa74;color:#131717;font-weight:900}.mini-person{width:70px;height:110px;box-shadow:0 -42px 0 -24px #050708}.mini-moth{position:static;width:180px;height:130px;object-fit:contain;filter:brightness(.72) sepia(.2)}.mini-room{display:block;width:170px;height:110px;border:10px solid #566366;background:#0b1011;box-shadow:inset 40px 0 #222c2e,inset -40px 0 #222c2e}.callback-label{position:absolute;right:38px;top:38px;padding:8px 13px;background:#101616dd;border:1px solid #c7ad77;font-size:13px;letter-spacing:.12em}.time-half,.names-half{position:absolute;top:0;bottom:0;width:46%;overflow:hidden}.time-half{left:0}.names-half{right:0}.time-half .source{filter:brightness(.5) sepia(.2)}.time-half>strong,.names-half>strong{position:absolute;left:30px;bottom:95px;font-size:32px;background:#111c;padding:9px 14px}.decision-gap{position:absolute;left:46%;width:8%;height:100%;display:grid;place-items:center;background:#080b0c}.decision-gap span{writing-mode:vertical-rl;letter-spacing:.16em;color:#97a19f}.name-lines{position:absolute;inset:100px 70px 160px;display:grid;align-content:center;gap:22px;color:#241e18;font:800 30px/1.2 serif}.balance-label{position:absolute;left:50%;bottom:42px;transform:translateX(-50%);padding:8px 16px;background:#111e;letter-spacing:.12em}.open-book{position:absolute;left:70px;top:65px;width:650px;height:520px;object-fit:cover;filter:brightness(.68);transform:rotate(-4deg)}.blank-columns{position:absolute;right:100px;top:135px;width:470px;padding:20px;background:#e8d8b7e8;color:#281f17;transform:rotate(4deg);border:5px double #5e4935}.unwritten{position:absolute;right:95px;bottom:75px;padding:10px 15px;background:#121616e8;border:1px solid #c4ad78}.return{filter:brightness(.34) grayscale(.25)}.tower-return{position:absolute;right:125px;top:25px;width:420px;height:560px;object-fit:cover;filter:brightness(.48) grayscale(.25)}.ending-question{position:absolute;left:50%;bottom:100px;transform:translateX(-50%);font:800 50px/1.1 serif;letter-spacing:.12em;text-shadow:0 4px 24px #000;white-space:nowrap}.fallback{padding:150px;font-size:38px}.frame-meta{position:absolute;left:28px;top:24px;padding:10px 14px;background:rgba(7,11,12,.78);border-left:5px solid #d1aa63;z-index:20}.frame-meta strong{display:block;font-size:20px}.frame-meta span{font-size:13px;color:#d7dfdd}.watermark{position:absolute;right:24px;bottom:22px;z-index:30;padding:9px 13px;background:rgba(5,8,9,.82);border:1px solid rgba(255,255,255,.5);font-size:14px;font-weight:800;letter-spacing:.1em}.truth{position:absolute;left:26px;bottom:24px;z-index:25;max-width:700px;padding:8px 12px;background:rgba(5,8,9,.76);font-size:12px;color:#d5dedd}.grade-midnight:after,.grade-cool:after,.grade-paper:after,.grade-rust:after,.grade-brass:after{content:"";position:absolute;inset:0;pointer-events:none;mix-blend-mode:color}.grade-midnight:after{background:rgba(12,35,47,.18)}.grade-cool:after{background:rgba(43,73,83,.14)}.grade-paper:after{background:rgba(143,105,53,.07)}.grade-rust:after{background:rgba(114,55,34,.13)}.grade-brass:after{background:rgba(153,104,29,.11)}
  </style></head><body><main class="frame grade-${recipe.grade}">${localCompositionMarkup(shot, recipe, dataUrlByReference)}<div class="frame-meta"><strong>B${String(shot.beat_number).padStart(2, "0")} · S${String(shot.sequence).padStart(2, "0")} · ${escapeHtml(shot.title_ja)}</strong><span>${escapeHtml(shot.start_time)}–${escapeHtml(shot.end_time)} / ${escapeHtml(recipe.motif)}</span></div><div class="truth">${escapeHtml(shot.source_truth_boundary)}</div><div class="watermark">PREVIS / REFERENCE-ONLY / NOT FOR PUBLICATION</div></main></body></html>`;
}

async function buildModel() {
  const [integrated, integratedManifest, readiness, readinessManifest] = await Promise.all([
    readJson("artifacts/integrated-visual-production-package/integrated-visual-production-package.json"),
    readJson("artifacts/integrated-visual-production-package/integrated-visual-production-package-manifest.json"),
    readJson("artifacts/asset-rights-readiness-packet/asset-rights-readiness.json"),
    readJson("artifacts/asset-rights-readiness-packet/asset-rights-readiness-manifest.json")
  ]);
  if (integratedManifest.package_fingerprint_sha256 !== SOURCE_FINGERPRINT) throw new Error("PREDECESSOR_INTEGRITY_BLOCKER: integrated package fingerprint mismatch");
  const refById = new Map(readiness.references.map((reference) => [reference.canonical_reference_id, reference]));
  for (const [shotId, recipe] of Object.entries(SHOT_RECIPES)) {
    for (const referenceId of recipe.refs) {
      const reference = refById.get(referenceId);
      if (!reference) throw new Error(`Missing source reference metadata: ${referenceId}`);
      if (AMBIGUOUS_REFERENCE_IDS.has(referenceId) || reference.license_evidence === "ambiguous") throw new Error(`Ambiguous-license reference entered render recipe: ${shotId}/${referenceId}`);
      if (!existsSync(reference.local_path)) throw new Error(`Missing source reference file: ${reference.local_path}`);
      if (sha256(await readFile(reference.local_path)) !== reference.sha256) throw new Error(`Source reference hash mismatch: ${referenceId}`);
    }
  }
  const beats = integrated.beats.map((beat) => ({
    beat_number: beat.beat_number,
    beat_id: beat.beat_id,
    title_ja: beat.title_ja,
    start_time: beat.start_time,
    end_time: beat.end_time,
    start_seconds: timeToSeconds(beat.start_time),
    end_seconds: timeToSeconds(beat.end_time),
    duration_seconds: beat.duration_seconds,
    progression_ja: beat.progression_ja,
    narration_segment_id: beat.narration.narration_segment_id,
    narration_text: beat.narration.narration_text,
    subtitle_cues: beat.subtitle_cues
  }));
  const allCues = beats.flatMap((beat) => beat.subtitle_cues);
  const shots = integrated.shots.map((shot) => {
    const recipe = SHOT_RECIPES[shot.shot_id];
    if (!recipe) throw new Error(`Missing frame recipe for ${shot.shot_id}`);
    const startSeconds = timeToSeconds(shot.start_time);
    const endSeconds = timeToSeconds(shot.end_time);
    const sourceReferences = recipe.refs.map((referenceId) => refById.get(referenceId));
    return {
      shot_id: shot.shot_id,
      sequence: shot.sequence,
      beat_id: shot.beat_id,
      beat_number: shot.beat_number,
      start_time: shot.start_time,
      end_time: shot.end_time,
      start_seconds: startSeconds,
      end_seconds: endSeconds,
      duration_seconds: shot.duration_seconds,
      title_ja: shot.title_ja,
      screen_ja: shot.screen_ja,
      intent_ja: shot.intent_ja,
      camera_ja: shot.camera_ja,
      motion: shot.motion,
      transition: shot.transition,
      source_truth_boundary: shot.source_truth_boundary,
      source_composition_class: shot.source_composition_class,
      accepted_source_reference_ids: shot.source_reference_ids,
      rendered_reference_ids: recipe.refs,
      rendered_reference_license_evidence: sourceReferences.map((reference) => reference.license_evidence),
      deterministic_substitution: recipe.deterministic_substitution || null,
      canonical_frame_path: `${FRAMES_ROOT}/${shot.shot_id}.jpg`,
      narration_segment_id: beats.find((beat) => beat.beat_id === shot.beat_id).narration_segment_id,
      subtitle_cue_ids: allCues.filter((cue) => cue.start_seconds < endSeconds && cue.end_seconds > startSeconds).map((cue) => cue.cue_id),
      intentional_reuse_label: recipe.intentional_reuse_label || null,
      reference_only: true,
      selected_for_production: false,
      rights_cleared_claim: false
    };
  });
  const requirements = readiness.requirements.map((requirement) => {
    const [shotId, semantics] = REQUIREMENT_THUMBNAILS[requirement.requirement_id] || [];
    if (!shotId) throw new Error(`Missing readiness thumbnail mapping: ${requirement.requirement_id}`);
    return {
      requirement_id: requirement.requirement_id,
      asset_class: requirement.asset_class,
      description_ja: requirement.generic_description_ja,
      representative_shot_id: shotId,
      source_frame_path: `${FRAMES_ROOT}/${shotId}.jpg`,
      thumbnail_path: `${REQUIREMENT_THUMB_ROOT}/${requirement.requirement_id}.jpg`,
      thumbnail_semantics_ja: semantics,
      previous_representative_reference_id: requirement.representative_reference_id || null,
      reuse_label: null,
      owner_decision: requirement.owner_decision,
      selected_for_production: false,
      rights_cleared_claim: false
    };
  });
  return {
    schemaVersion: "fff.privatePrevisualizationTimeline.v1",
    artifact_id: ARTIFACT_ID,
    title_ja: "Private Previsualization Timeline",
    generated_at: GENERATED_AT,
    source_artifact_id: SOURCE_ARTIFACT_ID,
    source_fingerprint: SOURCE_FINGERPRINT,
    readiness_artifact_id: READINESS_ARTIFACT_ID,
    readiness_source_fingerprint_before: READINESS_BASE_FINGERPRINT,
    readiness_current_fingerprint: readinessManifest.package_fingerprint_sha256,
    readiness_thumbnail_correction_applied: readiness.requirements.every((item) => Boolean(item.representative_preview_thumbnail)),
    duration_seconds: 180,
    timebase_fps: 30,
    frame_profile: { width: 1280, height: 720, aspect_ratio: "16:9" },
    beats,
    shots,
    requirements,
    timeline_tracks: {
      picture: shots.map((shot) => ({ id: shot.shot_id, start_seconds: shot.start_seconds, end_seconds: shot.end_seconds, frame_path: shot.canonical_frame_path })),
      narration_text: beats.map((beat) => ({ id: beat.narration_segment_id, beat_id: beat.beat_id, start_seconds: beat.start_seconds, end_seconds: beat.end_seconds, text_ja: beat.narration_text })),
      subtitles: allCues.map((cue) => ({ id: cue.cue_id, beat_id: cue.beat_id, start_seconds: cue.start_seconds, end_seconds: cue.end_seconds, text_ja: cue.text_ja })),
      beat_markers: beats.map((beat) => ({ id: beat.beat_id, beat_number: beat.beat_number, at_seconds: beat.start_seconds, label_ja: beat.title_ja })),
      shot_boundaries: shots.map((shot) => ({ id: `${shot.shot_id}-in`, at_seconds: shot.start_seconds })),
      transitions: shots.map((shot) => ({ id: `${shot.shot_id}-transition`, at_seconds: shot.start_seconds, type: shot.transition })),
      camera_motion: shots.map((shot) => ({ id: `${shot.shot_id}-camera`, start_seconds: shot.start_seconds, end_seconds: shot.end_seconds, motion: shot.motion }))
    },
    source_reference_audit: {
      total_canonical_reference_count: readiness.references.length,
      rendered_reference_ids: [...new Set(shots.flatMap((shot) => shot.rendered_reference_ids))].sort(),
      ambiguous_reference_ids: [...AMBIGUOUS_REFERENCE_IDS].sort(),
      ambiguous_reference_ids_rendered: [],
      source_image_bytes_modified: 0,
      newly_downloaded_media_count: 0
    },
    boundaries: {
      private_local_only: true,
      reference_only: true,
      muted: true,
      audio_generated: false,
      image_generated: false,
      new_media_downloaded: false,
      production_asset_selection: false,
      production_approved: false,
      rights_cleared_claim: false,
      legal_clearance_claim: false,
      final_render: false,
      public_release: false,
      public_upload: false,
      database_persistence: false,
      final_canon_decision: false
    }
  };
}

async function renderFrames(model, browser, tempRoot) {
  await mkdir(FRAMES_ROOT, { recursive: true });
  const readiness = await readJson("artifacts/asset-rights-readiness-packet/asset-rights-readiness.json");
  const refById = new Map(readiness.references.map((reference) => [reference.canonical_reference_id, reference]));
  const usedReferenceIds = [...new Set(Object.values(SHOT_RECIPES).flatMap((recipe) => recipe.refs))];
  const dataUrlByReference = new Map();
  for (const referenceId of usedReferenceIds) dataUrlByReference.set(referenceId, await fileDataUrl(refById.get(referenceId).local_path));
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  for (const shot of model.shots) {
    const recipe = SHOT_RECIPES[shot.shot_id];
    await page.setContent(renderFrameHtml(shot, recipe, dataUrlByReference), { waitUntil: "load" });
    const tempPath = path.join(tempRoot, `${shot.shot_id}.jpg`);
    await page.screenshot({ path: tempPath, type: "jpeg", quality: 88, clip: { x: 0, y: 0, width: 1280, height: 720 } });
    await copyFile(tempPath, shot.canonical_frame_path);
    const bytes = await readFile(shot.canonical_frame_path);
    shot.canonical_frame_sha256 = sha256(bytes);
    shot.canonical_frame_byte_size = bytes.length;
  }
  await page.close();
}

async function renderRequirementThumbnails(model, browser, tempRoot) {
  await mkdir(REQUIREMENT_THUMB_ROOT, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 640, height: 360 }, deviceScaleFactor: 1 });
  for (const requirement of model.requirements) {
    const frameData = await fileDataUrl(requirement.source_frame_path);
    const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;width:640px;height:360px;overflow:hidden;background:#101617;color:#fff;font-family:"Segoe UI","Noto Sans JP",sans-serif}.card{position:relative;width:640px;height:360px}.card img{width:100%;height:100%;object-fit:cover}.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.2),transparent 45%,rgba(0,0,0,.84))}.id{position:absolute;left:16px;top:14px;padding:7px 10px;background:#0a0e0ee8;border-left:5px solid #d2a65c;font-weight:800}.semantic{position:absolute;left:18px;right:18px;bottom:32px;font-size:22px;font-weight:800;text-shadow:0 2px 8px #000}.source{position:absolute;left:18px;bottom:10px;font-size:11px;color:#d5dddd}.mark{position:absolute;right:12px;top:12px;font-size:9px;letter-spacing:.08em;background:#080b0bd9;padding:6px 8px;border:1px solid #ffffff66}</style></head><body><div class="card"><img src="${frameData}" alt=""><div class="shade"></div><div class="id">${escapeHtml(requirement.requirement_id)}</div><div class="semantic">${escapeHtml(requirement.thumbnail_semantics_ja)}</div><div class="source">derived from ${escapeHtml(requirement.representative_shot_id)} canonical frame</div><div class="mark">PREVIS / REFERENCE-ONLY / NOT FOR PUBLICATION</div></div></body></html>`;
    await page.setContent(html, { waitUntil: "load" });
    const tempPath = path.join(tempRoot, `${requirement.requirement_id}.jpg`);
    await page.screenshot({ path: tempPath, type: "jpeg", quality: 88, clip: { x: 0, y: 0, width: 640, height: 360 } });
    await copyFile(tempPath, requirement.thumbnail_path);
    const bytes = await readFile(requirement.thumbnail_path);
    requirement.thumbnail_sha256 = sha256(bytes);
    requirement.thumbnail_byte_size = bytes.length;
  }
  await page.close();
}

async function renderContactSheet(model, browser, tempRoot) {
  const cells = [];
  for (const shot of model.shots) {
    cells.push(`<article><img src="${await fileDataUrl(shot.canonical_frame_path)}" alt=""><div><strong>${escapeHtml(shot.shot_id)}</strong><span>B${shot.beat_number} · ${escapeHtml(shot.start_time)}–${escapeHtml(shot.end_time)} · ${escapeHtml(shot.title_ja)}</span></div></article>`);
  }
  const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;width:1600px;height:1050px;overflow:hidden;background:#101617;color:#eef3f2;font-family:"Segoe UI","Noto Sans JP",sans-serif}.sheet{padding:26px;display:grid;grid-template-columns:repeat(5,1fr);gap:14px}.sheet article{background:#182124;border:1px solid #405054;padding:6px}.sheet img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}.sheet div{padding:5px 3px 1px}.sheet strong{display:block;font-size:13px}.sheet span{display:block;font-size:10px;color:#bcc8c5}.foot{position:absolute;right:28px;bottom:13px;font-size:12px;letter-spacing:.1em}</style></head><body><main class="sheet">${cells.join("")}</main><div class="foot">19 SHOTS / 180 SEC / PREVIS / REFERENCE-ONLY / NOT FOR PUBLICATION</div></body></html>`;
  const page = await browser.newPage({ viewport: { width: 1600, height: 1050 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "load" });
  const tempPath = path.join(tempRoot, "contact-sheet.jpg");
  await page.screenshot({ path: tempPath, type: "jpeg", quality: 88, clip: { x: 0, y: 0, width: 1600, height: 1050 } });
  await copyFile(tempPath, CONTACT_SHEET_PATH);
  await page.close();
}

function timelineClipHtml(item, className, content, title) {
  const left = (item.start_seconds / 180) * 100;
  const width = ((item.end_seconds - item.start_seconds) / 180) * 100;
  return `<button type="button" class="clip ${className}" style="left:${left}%;width:${width}%" data-jump="${item.start_seconds}" title="${escapeHtml(title)}">${content}</button>`;
}

function renderPlayerHtml(model) {
  const pictureClips = model.shots.map((shot) => timelineClipHtml(shot, `beat-${shot.beat_number}`, `<span>${shot.sequence}</span><img src="frames/${shot.shot_id}.jpg" alt=""><small>${escapeHtml(shot.title_ja)}</small>`, `${shot.start_time}–${shot.end_time} ${shot.title_ja}`)).join("");
  const narrationClips = model.beats.map((beat) => timelineClipHtml(beat, `beat-${beat.beat_number}`, `<span>B${beat.beat_number}</span><small>${escapeHtml(beat.narration_text)}</small>`, `${beat.start_time}–${beat.end_time} ${beat.narration_text}`)).join("");
  const subtitleClips = model.timeline_tracks.subtitles.map((cue) => timelineClipHtml(cue, "subtitle-clip", `<span>${escapeHtml(cue.text_ja)}</span>`, `${formatTime(cue.start_seconds)}–${formatTime(cue.end_seconds)} ${cue.text_ja}`)).join("");
  const cameraClips = model.shots.map((shot) => timelineClipHtml(shot, "camera-clip", `<span>${escapeHtml(shot.motion)}</span>`, `${shot.shot_id} ${shot.motion}`)).join("");
  const transitionMarkers = model.shots.map((shot) => `<button type="button" class="transition-marker" style="left:${(shot.start_seconds / 180) * 100}%" data-jump="${shot.start_seconds}" title="${escapeHtml(shot.transition)}"><span></span></button>`).join("");
  const beatButtons = model.beats.map((beat) => `<button type="button" data-beat-jump="${beat.start_seconds}">B${beat.beat_number}<span>${escapeHtml(beat.title_ja)}</span></button>`).join("");
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Private Previsualization Timeline</title><style>
  :root{color-scheme:dark;--bg:#0d1214;--panel:#151d20;--panel2:#1c272a;--line:#344347;--text:#edf4f2;--muted:#aebcba;--focus:#ffb35f;--beat1:#5a777b;--beat2:#9a6e35;--beat3:#6a718a;--beat4:#75534a;--beat5:#536b65;--beat6:#535f78}*{box-sizing:border-box}html,body{margin:0;min-width:0;overflow-x:hidden;background:var(--bg);color:var(--text);font-family:"Segoe UI","Noto Sans JP",sans-serif}body{min-height:100vh}button,input{font:inherit}button{color:inherit}button:focus-visible,input:focus-visible{outline:3px solid var(--focus);outline-offset:3px}.app{width:min(1440px,100%);margin:0 auto;padding:10px 14px 60px}.topline{min-height:40px;display:flex;align-items:center;justify-content:space-between;gap:12px}.topline strong{font-size:14px;letter-spacing:.08em}.boundary{font-size:11px;color:var(--muted)}.workbench{display:grid;grid-template-columns:minmax(0,1fr) 310px;gap:12px}.viewer{position:relative;min-width:0;aspect-ratio:16/9;background:#000;border:1px solid var(--line);border-radius:10px;overflow:hidden}.viewer canvas{display:block;width:100%;height:100%;background:#090d0e}.subtitle{position:absolute;left:12%;right:12%;bottom:8%;min-height:2.8em;display:grid;place-items:center;text-align:center;font-size:clamp(15px,2vw,27px);font-weight:750;text-shadow:0 2px 8px #000,0 0 18px #000}.player-mark{position:absolute;right:10px;top:10px;padding:6px 8px;background:#050707c7;border:1px solid #ffffff55;font-size:10px;letter-spacing:.08em}.inspector{border:1px solid var(--line);border-radius:10px;background:var(--panel);padding:14px;min-width:0}.inspector .eyebrow{margin:0;color:#d6b478;font-size:12px;letter-spacing:.1em}.inspector h1{margin:4px 0 3px;font-size:22px;line-height:1.2}.inspector .identity{color:var(--muted);font-size:12px}.inspector dl{margin:14px 0 0;display:grid;grid-template-columns:85px 1fr;gap:8px;font-size:12px}.inspector dt{color:var(--muted)}.inspector dd{margin:0;overflow-wrap:anywhere}.controls{margin-top:9px;padding:9px 10px;border:1px solid var(--line);border-radius:10px;background:var(--panel);display:grid;grid-template-columns:auto auto auto minmax(140px,1fr) auto;align-items:center;gap:8px}.controls button{min-height:42px;min-width:42px;border:1px solid var(--line);border-radius:8px;background:var(--panel2);cursor:pointer}.controls button:hover{border-color:#91a3a1}.timecode{font:800 21px/1 ui-monospace,SFMono-Regular,Consolas,monospace;white-space:nowrap}.scrubber{width:100%;accent-color:#d3a65e}.beat-jumps{display:flex;gap:5px;flex-wrap:wrap;margin-top:8px}.beat-jumps button{min-height:38px;flex:1 1 120px;border:1px solid var(--line);background:var(--panel);border-radius:8px;text-align:left;padding:6px 9px;cursor:pointer}.beat-jumps button span{display:block;color:var(--muted);font-size:10px}.overview{position:relative;height:56px;margin-top:8px;border:1px solid var(--line);border-radius:8px;background:#101719;overflow:hidden}.overview .beats{position:absolute;inset:0;display:flex}.overview .beats span{display:flex;align-items:flex-end;padding:5px;border-right:1px solid #ffffff22;font-size:10px}.overview .playhead,.track .playhead{position:absolute;top:0;bottom:0;width:2px;background:#ffbd69;z-index:20;pointer-events:none;box-shadow:0 0 8px #000}.overview .tick{position:absolute;top:0;bottom:0;border-left:1px solid #ffffff32;font-size:9px;padding-left:3px;color:#c4cecc}.timeline{margin-top:18px;border:1px solid var(--line);border-radius:10px;background:var(--panel);overflow:hidden}.timeline-head{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid var(--line)}.timeline-head h2{margin:0;font-size:17px}.timeline-head span{font-size:11px;color:var(--muted)}.lane{display:grid;grid-template-columns:112px minmax(0,1fr);border-bottom:1px solid var(--line);min-height:54px}.lane:last-child{border-bottom:0}.lane-label{padding:10px;border-right:1px solid var(--line);font-size:11px;color:var(--muted)}.track{position:relative;min-width:0;overflow:hidden}.clip{position:absolute;top:4px;bottom:4px;min-width:2px;border:1px solid #ffffff26;border-radius:4px;background:#405255;padding:2px;overflow:hidden;text-align:left;cursor:pointer}.clip img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.42}.clip span,.clip small{position:relative;z-index:1;text-shadow:0 1px 4px #000}.clip span{font-size:10px;font-weight:900}.clip small{display:block;font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.beat-1{background:var(--beat1)}.beat-2{background:var(--beat2)}.beat-3{background:var(--beat3)}.beat-4{background:var(--beat4)}.beat-5{background:var(--beat5)}.beat-6{background:var(--beat6)}.subtitle-clip{background:#354a50}.subtitle-clip span{font-size:9px}.camera-clip{background:#28373a}.transition-marker{position:absolute;top:0;bottom:0;width:9px;transform:translateX(-4px);border:0;background:transparent;padding:0;z-index:4;cursor:pointer}.transition-marker span{position:absolute;left:3px;top:10px;bottom:10px;border-left:2px dashed #da9d5b}.shot-list{margin-top:16px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.shot-card{display:grid;grid-template-columns:112px 1fr;gap:10px;border:1px solid var(--line);border-radius:9px;background:var(--panel);padding:8px;cursor:pointer;text-align:left}.shot-card img{width:112px;aspect-ratio:16/9;object-fit:cover;border-radius:5px}.shot-card strong{font-size:12px}.shot-card span{display:block;color:var(--muted);font-size:10px}.shot-card[data-active="true"]{border-color:#e1b36c;box-shadow:0 0 0 1px #e1b36c}.foot{margin-top:18px;color:var(--muted);font-size:11px}.beat-width-1{width:11.1111%}.beat-width-2{width:16.6667%}.beat-width-3{width:16.6667%}.beat-width-4{width:13.8889%}.beat-width-5{width:27.7778%}.beat-width-6{width:13.8889%}@media(max-width:900px){.workbench{grid-template-columns:1fr}.inspector{display:grid;grid-template-columns:1fr 1fr;gap:10px}.inspector dl{margin:0}.shot-list{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.app{padding:7px 8px 45px}.topline{align-items:flex-start}.boundary{max-width:170px;text-align:right}.inspector{display:block;padding:10px}.inspector h1{font-size:18px}.inspector dl{margin-top:8px}.controls{grid-template-columns:repeat(3,1fr)}.controls .scrubber{grid-column:1/-1;grid-row:2}.controls .timecode{grid-column:1/-1;text-align:center;grid-row:3}.beat-jumps button{flex-basis:92px}.overview{height:50px}.lane{grid-template-columns:64px minmax(0,1fr);min-height:48px}.lane-label{padding:7px 5px;font-size:9px}.shot-list{grid-template-columns:1fr}.subtitle{font-size:14px}.shot-card{grid-template-columns:96px 1fr}.shot-card img{width:96px}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition-duration:.001ms!important;animation-duration:.001ms!important}}
  </style></head><body><main class="app"><div class="topline"><strong>PRIVATE PREVIS · 180s · 6 Beats · 19 Shots</strong><span class="boundary">reference-only / production・rights・publication未承認</span></div><section class="workbench" aria-label="Playback workbench"><div class="viewer"><canvas id="playbackCanvas" width="1280" height="720" aria-label="Private previsualization playback canvas"></canvas><div id="subtitle" class="subtitle" aria-live="polite"></div><div class="player-mark">PREVIS / REFERENCE-ONLY / NOT FOR PUBLICATION</div></div><aside class="inspector"><div><p class="eyebrow" id="beatIdentity">BEAT 1</p><h1 id="shotTitle">駅から塔へ</h1><div class="identity" id="shotIdentity">shot-b01-01 · 00:00–00:07</div></div><dl><dt>Intent</dt><dd id="shotIntent"></dd><dt>Camera</dt><dd id="shotCamera"></dd><dt>Transition</dt><dd id="shotTransition"></dd><dt>Boundary</dt><dd id="shotBoundary"></dd></dl></aside></section><section class="controls" aria-label="Playback controls"><button type="button" id="prevShot" aria-label="Previous shot">◀│</button><button type="button" id="togglePlay" aria-label="Play" aria-pressed="false">▶</button><button type="button" id="nextShot" aria-label="Next shot">│▶</button><input id="scrubber" class="scrubber" type="range" min="0" max="180" step="0.1" value="0" aria-label="Timeline scrubber"><output id="timecode" class="timecode">00:00.0 / 03:00.0</output></section><nav class="beat-jumps" aria-label="Beat jumps">${beatButtons}</nav><section class="overview" aria-label="180 second overview ruler"><div class="beats">${model.beats.map((beat) => `<span class="beat-width-${beat.beat_number} beat-${beat.beat_number}">B${beat.beat_number}</span>`).join("")}</div>${[0,30,60,90,120,150,180].map((value) => `<span class="tick" style="left:${(value / 180) * 100}%">${String(Math.floor(value / 60)).padStart(2,"0")}:${String(value % 60).padStart(2,"0")}</span>`).join("")}<i class="playhead" data-playhead></i></section><section class="timeline" aria-labelledby="timelineHeading"><div class="timeline-head"><h2 id="timelineHeading">Native timeline</h2><span>duration-proportional · click any clip</span></div><div class="lane"><div class="lane-label">PICTURE</div><div class="track">${pictureClips}<i class="playhead" data-playhead></i></div></div><div class="lane"><div class="lane-label">NARRATION TEXT</div><div class="track">${narrationClips}<i class="playhead" data-playhead></i></div></div><div class="lane"><div class="lane-label">SUBTITLE</div><div class="track">${subtitleClips}<i class="playhead" data-playhead></i></div></div><div class="lane"><div class="lane-label">CAMERA</div><div class="track">${cameraClips}<i class="playhead" data-playhead></i></div></div><div class="lane"><div class="lane-label">TRANSITION</div><div class="track">${transitionMarkers}<i class="playhead" data-playhead></i></div></div></section><section class="shot-list" aria-label="Shot inspector index">${model.shots.map((shot) => `<button type="button" class="shot-card" data-shot-id="${shot.shot_id}" data-jump="${shot.start_seconds}"><img src="frames/${shot.shot_id}.jpg" alt=""><span><strong>${String(shot.sequence).padStart(2,"0")} · ${escapeHtml(shot.title_ja)}</strong><span>B${shot.beat_number} · ${shot.start_time}–${shot.end_time} · ${shot.duration_seconds}s</span><span>${escapeHtml(shot.intentional_reuse_label || shot.source_composition_class)}</span></span></button>`).join("")}</section><p class="foot">Keyboard: Space play/pause · ←/→ seek 1s (Shift=5s) · Home/End · buttons and clips retain visible focus. Silent local preview; no audio element or network request.</p></main><script type="application/json" id="previsModel">${JSON.stringify(model).replaceAll("<", "\\u003c")}</script><script>
  (()=>{const model=JSON.parse(document.getElementById('previsModel').textContent);const canvas=document.getElementById('playbackCanvas');const ctx=canvas.getContext('2d');const scrubber=document.getElementById('scrubber');const toggle=document.getElementById('togglePlay');const timecode=document.getElementById('timecode');const subtitle=document.getElementById('subtitle');const images=new Map();let current=0;let playing=false;let anchorTime=0;let anchorNow=0;let frameRequest=0;let activeShotId='';const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const clamp=(v)=>Math.max(0,Math.min(180,v));const shotAt=(t)=>model.shots.find((shot)=>t>=shot.start_seconds&&t<shot.end_seconds)||model.shots.at(-1);const beatAt=(t)=>model.beats.find((beat)=>t>=beat.start_seconds&&t<beat.end_seconds)||model.beats.at(-1);const cueAt=(t)=>model.timeline_tracks.subtitles.find((cue)=>t>=cue.start_seconds&&t<cue.end_seconds);const fmt=(s)=>{s=clamp(s);const m=Math.floor(s/60);const sec=Math.floor(s%60);const tenth=Math.floor((s-Math.floor(s))*10+1e-6);return String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0')+'.'+tenth};for(const shot of model.shots){const img=new Image();img.src='frames/'+shot.shot_id+'.jpg';img.addEventListener('load',()=>{images.set(shot.shot_id,img);if(shot.sequence===1)render()},{once:true})}function drawImageCover(img,scale=1,dx=0){const cw=canvas.width,ch=canvas.height;const base=Math.max(cw/img.naturalWidth,ch/img.naturalHeight)*scale;const w=img.naturalWidth*base,h=img.naturalHeight*base;ctx.drawImage(img,(cw-w)/2+dx,(ch-h)/2,w,h)}function render(){const shot=shotAt(current);const img=images.get(shot.shot_id);ctx.fillStyle='#080b0c';ctx.fillRect(0,0,canvas.width,canvas.height);if(img){const progress=(current-shot.start_seconds)/shot.duration_seconds;let scale=1,dx=0;if(!reduced){if(shot.motion==='slow_push')scale=1+progress*.035;else if(shot.motion==='slow_pull')scale=1.035-progress*.035;else if(shot.motion==='slow_pan')dx=(progress-.5)*26;else if(shot.motion==='controlled_parallax')scale=1+progress*.018}const prior=model.shots[shot.sequence-2];const transitionWindow=shot.transition!=='hard_cut'&&prior&&current-shot.start_seconds<.7;if(transitionWindow&&images.get(prior.shot_id)){drawImageCover(images.get(prior.shot_id));ctx.globalAlpha=Math.max(.08,(current-shot.start_seconds)/.7);drawImageCover(img,scale,dx);ctx.globalAlpha=1}else drawImageCover(img,scale,dx)}const cue=cueAt(current);subtitle.textContent=cue?cue.text_ja:'';scrubber.value=String(current);timecode.value=fmt(current)+' / 03:00.0';for(const head of document.querySelectorAll('[data-playhead]'))head.style.left=(current/180*100)+'%';if(activeShotId!==shot.shot_id){activeShotId=shot.shot_id;const beat=beatAt(current);document.getElementById('beatIdentity').textContent='BEAT '+beat.beat_number+' · '+beat.title_ja;document.getElementById('shotTitle').textContent=shot.title_ja;document.getElementById('shotIdentity').textContent=shot.shot_id+' · '+shot.start_time+'–'+shot.end_time;document.getElementById('shotIntent').textContent=shot.intent_ja;document.getElementById('shotCamera').textContent=shot.camera_ja;document.getElementById('shotTransition').textContent=shot.transition;document.getElementById('shotBoundary').textContent=shot.source_truth_boundary;for(const card of document.querySelectorAll('.shot-card'))card.dataset.active=String(card.dataset.shotId===shot.shot_id)}}function seek(value){current=clamp(value);anchorTime=current;anchorNow=performance.now();if(current>=180)pause();render()}function tick(now){if(!playing)return;current=clamp(anchorTime+(now-anchorNow)/1000);if(current>=180){current=180;pause();render();return}render();frameRequest=requestAnimationFrame(tick)}function play(){if(current>=180)seek(0);playing=true;anchorTime=current;anchorNow=performance.now();toggle.textContent='❚❚';toggle.setAttribute('aria-label','Pause');toggle.setAttribute('aria-pressed','true');frameRequest=requestAnimationFrame(tick)}function pause(){playing=false;cancelAnimationFrame(frameRequest);toggle.textContent='▶';toggle.setAttribute('aria-label','Play');toggle.setAttribute('aria-pressed','false')}function togglePlay(){playing?pause():play()}toggle.addEventListener('click',togglePlay);scrubber.addEventListener('input',()=>seek(Number(scrubber.value)));document.getElementById('prevShot').addEventListener('click',()=>{const shot=shotAt(current);const target=current-shot.start_seconds>.4?shot.start_seconds:model.shots[Math.max(0,shot.sequence-2)].start_seconds;seek(target)});document.getElementById('nextShot').addEventListener('click',()=>{const shot=shotAt(current);seek(shot.sequence<model.shots.length?model.shots[shot.sequence].start_seconds:180)});for(const button of document.querySelectorAll('[data-jump]'))button.addEventListener('click',()=>seek(Number(button.dataset.jump)));for(const button of document.querySelectorAll('[data-beat-jump]'))button.addEventListener('click',()=>seek(Number(button.dataset.beatJump)));document.addEventListener('keydown',(event)=>{if(event.target===scrubber)return;if(event.code==='Space'){event.preventDefault();togglePlay()}else if(event.key==='Home'){event.preventDefault();seek(0)}else if(event.key==='End'){event.preventDefault();seek(180)}else if(event.key==='ArrowLeft'){event.preventDefault();seek(current-(event.shiftKey?5:1))}else if(event.key==='ArrowRight'){event.preventDefault();seek(current+(event.shiftKey?5:1))}});window.__PREVIS__={model,shotAt,beatAt,cueAt,seek,getState:()=>({current,playing,shot_id:shotAt(current).shot_id,beat_number:beatAt(current).beat_number,subtitle:cueAt(current)?.text_ja||'',reduced_motion:reduced})};render()})();
  </script></body></html>`;
}

async function exportMp4(model, tempRoot) {
  const concatPath = path.join(tempRoot, "frames.ffconcat");
  const outputPath = path.join(tempRoot, "private-previsualization-timeline.mp4");
  const quote = (filePath) => path.resolve(filePath).replaceAll("\\", "/").replaceAll("'", "'\\''");
  const lines = ["ffconcat version 1.0"];
  for (const shot of model.shots) {
    lines.push(`file '${quote(shot.canonical_frame_path)}'`, `duration ${shot.duration_seconds}`);
  }
  lines.push(`file '${quote(model.shots.at(-1).canonical_frame_path)}'`);
  await writeFile(concatPath, `${lines.join("\n")}\n`, "utf8");
  await execFile("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", concatPath, "-an", "-vf", "fps=30,scale=960:540:flags=lanczos,format=yuv420p", "-c:v", "libx264", "-preset", "veryfast", "-tune", "stillimage", "-crf", "25", "-movflags", "+faststart", "-map_metadata", "-1", "-t", "180", outputPath], { windowsHide: true, maxBuffer: 10 * 1024 * 1024 });
  await copyFile(outputPath, MP4_PATH);
  const { stdout } = await execFile("ffprobe", ["-v", "error", "-show_entries", "format=duration,size,format_name:stream=codec_name,width,height,avg_frame_rate", "-of", "json", MP4_PATH], { windowsHide: true });
  const probe = JSON.parse(stdout);
  const bytes = await readFile(MP4_PATH);
  return {
    path: MP4_PATH,
    byte_size: bytes.length,
    sha256: sha256(bytes),
    duration_seconds: Number(probe.format.duration),
    format_name: probe.format.format_name,
    codec_name: probe.streams[0].codec_name,
    width: probe.streams[0].width,
    height: probe.streams[0].height,
    avg_frame_rate: probe.streams[0].avg_frame_rate,
    audio_stream_count: probe.streams.filter((stream) => stream.codec_type === "audio").length
  };
}

function renderReadme(model) {
  return `# Private Previsualization Timeline\n\n- Artifact: \`${ARTIFACT_ID}\`\n- Accepted source: \`${SOURCE_ARTIFACT_ID}\`\n- Source fingerprint: \`${SOURCE_FINGERPRINT}\`\n- Open: \`Invoke-Item .\\artifacts\\private-previsualization-timeline\\private-previsualization-timeline.html\`\n- Rebuild: \`$env:FFF_NODE_MODULES=\"C:\\Users\\thank\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules\"; node .\\artifacts\\private-previsualization-timeline\\build-private-previsualization.mjs smoke\`\n- Validate: \`node .\\tools\\fff-state.mjs validate-private-previsualization-timeline .\\artifacts\\private-previsualization-timeline-result.json\`\n\nThe page is a silent, private, reference-only 180-second previsualization. It contains exactly 6 Beats and 19 source-timed shots. The 19 canonical JPEG frames drive playback, timeline thumbnails, the shot inspector, the contact sheet, and the silent MP4. Requirement thumbnails are annotated derivatives of those same canonical frames.\n\nThe package does not select production assets, clear rights, approve production, create final media, or authorize publication. The two references with ambiguous stored license evidence are not rendered; deterministic local compositions replace them.\n`;
}

function renderReviewDoc(model, mp4) {
  const corrections = model.requirements.map((item) => `| ${item.requirement_id} | ${item.representative_shot_id} | ${item.thumbnail_semantics_ja} |`).join("\n");
  return `# Private Previsualization Timeline\n\n## Outcome\n\nThe exact accepted 180-second chronology is now playable as a local, silent previsualization. One canonical frame per source shot drives playback, the picture lane, the shot inspector, the contact sheet, and MP4 export. Requirement thumbnails are deterministic annotated derivatives of those frames.\n\n## Exact contract\n\n- 6 Beats / 19 shots / 180 seconds\n- start 00:00 / end 03:00\n- gap count 0 / overlap count 0\n- narration segments 6 / subtitle cues 20\n- all transition and camera-motion markers retained from the integrated source\n- watermark: PREVIS / REFERENCE-ONLY / NOT FOR PUBLICATION\n\n## Requirement thumbnail audit\n\n| Requirement | Canonical source frame | Visible semantics |\n| --- | --- | --- |\n${corrections}\n\nThe four explicit repairs are AR-PROP-02 = visible brass moth, AR-PROP-03 = written memo, AR-ABS-01 = three fading name/letter contours, and AR-ABS-02 = equal time-versus-name split with an 8% undecided center. All 14 derived thumbnails have distinct hashes, so accidental duplicates are zero. Story motif returns remain labeled inside the source-frame metadata as callback or shared motif.\n\n## MP4\n\n- path: \`${mp4.path}\`\n- ${mp4.width}x${mp4.height}, ${mp4.codec_name}, silent\n- duration: ${mp4.duration_seconds}s\n- size: ${mp4.byte_size} bytes\n- SHA256: \`${mp4.sha256}\`\n\n## Boundaries\n\nThis is private reference-only previs. Production selection count and rights-cleared claim count remain zero. Ambiguous-license references \`${[...AMBIGUOUS_REFERENCE_IDS].join("\`, \`")}\` are excluded from every rendered frame and the MP4. No media was downloaded, and all 28 predecessor source files remain hash-checked and unchanged.\n`;
}

async function writeStructuredArtifacts(model, mp4) {
  await writeFile(HTML_PATH, renderPlayerHtml(model), "utf8");
  await writeFile(MODEL_PATH, `${JSON.stringify(model, null, 2)}\n`, "utf8");
  const shotHeaders = ["shot_id","sequence","beat_number","beat_id","start_time","end_time","start_seconds","end_seconds","duration_seconds","title_ja","intent_ja","camera_ja","motion","transition","narration_segment_id","subtitle_cue_ids","canonical_frame_path","canonical_frame_sha256","rendered_reference_ids","deterministic_substitution","intentional_reuse_label","source_truth_boundary"];
  await writeFile(SHOT_CSV_PATH, toCsv(shotHeaders, model.shots), "utf8");
  const thumbnailRows = [
    ...model.shots.map((shot) => ({ thumbnail_kind: "shot", thumbnail_id: shot.shot_id, representative_shot_id: shot.shot_id, thumbnail_path: shot.canonical_frame_path, source_frame_path: shot.canonical_frame_path, sha256: shot.canonical_frame_sha256, semantics_ja: shot.screen_ja, intentional_reuse_label: shot.intentional_reuse_label || "", derived_from_canonical_frame: true })),
    ...model.requirements.map((item) => ({ thumbnail_kind: "requirement", thumbnail_id: item.requirement_id, representative_shot_id: item.representative_shot_id, thumbnail_path: item.thumbnail_path, source_frame_path: item.source_frame_path, sha256: item.thumbnail_sha256, semantics_ja: item.thumbnail_semantics_ja, intentional_reuse_label: item.reuse_label || "", derived_from_canonical_frame: true }))
  ];
  await writeFile(THUMBNAIL_CSV_PATH, toCsv(["thumbnail_kind","thumbnail_id","representative_shot_id","thumbnail_path","source_frame_path","sha256","semantics_ja","intentional_reuse_label","derived_from_canonical_frame"], thumbnailRows), "utf8");
  await writeFile(`${PACKAGE_ROOT}/README_PRIVATE_PREVIS.md`, renderReadme(model), "utf8");
  await writeFile(REVIEW_DOC_PATH, renderReviewDoc(model, mp4), "utf8");
}

async function buildManifest(model, mp4) {
  const files = (await listFilesRecursive(PACKAGE_ROOT)).filter((filePath) => filePath !== MANIFEST_PATH);
  const inventory = await inventoryFiles(files, PACKAGE_ROOT);
  const manifest = {
    schemaVersion: "fff.privatePrevisualizationManifest.v1",
    artifact_id: ARTIFACT_ID,
    generated_at: GENERATED_AT,
    source_artifact_id: SOURCE_ARTIFACT_ID,
    source_fingerprint: SOURCE_FINGERPRINT,
    readiness_source_fingerprint_before: READINESS_BASE_FINGERPRINT,
    readiness_current_fingerprint: model.readiness_current_fingerprint,
    payload_file_count: inventory.file_count,
    file_count: inventory.file_count + 1,
    package_fingerprint_sha256: inventory.aggregate_sha256,
    frame_count: model.shots.length,
    requirement_thumbnail_count: model.requirements.length,
    contact_sheet_count: 1,
    mp4,
    files: inventory.files
  };
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return manifest;
}

async function captureBrowserEvidence(model) {
  const { chromium } = await loadPlaywright();
  await mkdir(path.dirname(SCREENSHOTS.desktop), { recursive: true });
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "no-preference" });
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(pathToFileURL(path.resolve(HTML_PATH)).href, { waitUntil: "load" });
  await page.waitForFunction(() => window.__PREVIS__?.getState().shot_id === "shot-b01-01");
  const desktop = await page.evaluate(() => {
    const required = ["#playbackCanvas","#timecode","#togglePlay","#scrubber","#beatIdentity","#shotIdentity",".overview"];
    const nested = [...document.querySelectorAll("body *")].filter((node) => { const style=getComputedStyle(node); return /(auto|scroll)/.test(style.overflowY)&&node.scrollHeight>node.clientHeight+1; });
    const canvas = document.querySelector("#playbackCanvas").getBoundingClientRect();
    return { width: innerWidth, height: innerHeight, horizontal_overflow: document.documentElement.scrollWidth > innerWidth + 1, nested_vertical_scroll_count: nested.length, first_view_required_visible: required.every((selector) => { const rect=document.querySelector(selector).getBoundingClientRect(); return rect.top>=0&&rect.bottom<=innerHeight; }), canvas_width: canvas.width, canvas_height: canvas.height, audio_element_count: document.querySelectorAll("audio").length, video_element_count: document.querySelectorAll("video").length };
  });
  await page.screenshot({ path: SCREENSHOTS.desktop, fullPage: false });
  await page.evaluate(() => window.__PREVIS__.seek(93.2));
  const arbitraryScrub = await page.evaluate(() => window.__PREVIS__.getState());
  const boundaryTests = await page.evaluate(() => {
    const { model, shotAt } = window.__PREVIS__;
    return model.shots.slice(1).map((shot, index) => ({ at_seconds: shot.start_seconds, before: shotAt(shot.start_seconds-.001).shot_id, at: shotAt(shot.start_seconds).shot_id, expected_before: model.shots[index].shot_id, expected_at: shot.shot_id }));
  });
  await page.keyboard.press("Home");
  const homeState = await page.evaluate(() => window.__PREVIS__.getState());
  await page.keyboard.press("ArrowRight");
  const rightState = await page.evaluate(() => window.__PREVIS__.getState());
  await page.keyboard.press("End");
  const endState = await page.evaluate(() => window.__PREVIS__.getState());
  await page.keyboard.press("Space");
  await page.waitForTimeout(140);
  const spacePlayState = await page.evaluate(() => window.__PREVIS__.getState());
  await page.keyboard.press("Space");
  await page.focus("#togglePlay");
  const focusVisible = await page.evaluate(() => { const style=getComputedStyle(document.activeElement); return style.outlineStyle!=="none"&&Number.parseFloat(style.outlineWidth)>=3; });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(pathToFileURL(path.resolve(HTML_PATH)).href, { waitUntil: "load" });
  await page.waitForFunction(() => window.__PREVIS__?.getState().shot_id === "shot-b01-01");
  const narrow = await page.evaluate(() => {
    const nested=[...document.querySelectorAll("body *")].filter((node)=>{const style=getComputedStyle(node);return /(auto|scroll)/.test(style.overflowY)&&node.scrollHeight>node.clientHeight+1});
    return { width:innerWidth,height:innerHeight,horizontal_overflow:document.documentElement.scrollWidth>innerWidth+1,nested_vertical_scroll_count:nested.length,first_view_required_visible:["#playbackCanvas","#timecode","#togglePlay","#scrubber","#beatIdentity","#shotIdentity",".overview"].every((selector)=>{const rect=document.querySelector(selector).getBoundingClientRect();return rect.top>=0&&rect.bottom<=innerHeight}) };
  });
  await page.screenshot({ path: SCREENSHOTS.narrow, fullPage: false });
  const reducedPage = await browser.newPage({ viewport: { width: 900, height: 900 }, reducedMotion: "reduce" });
  await reducedPage.goto(pathToFileURL(path.resolve(HTML_PATH)).href, { waitUntil: "load" });
  const reducedMotion = await reducedPage.evaluate(() => window.__PREVIS__.getState().reduced_motion && matchMedia("(prefers-reduced-motion: reduce)").matches);
  await reducedPage.close();
  await browser.close();
  const screenshotInventory = await inventoryFiles(Object.values(SCREENSHOTS), ".");
  const passed = !desktop.horizontal_overflow && desktop.nested_vertical_scroll_count === 0 && desktop.first_view_required_visible && desktop.audio_element_count === 0 && desktop.video_element_count === 0
    && !narrow.horizontal_overflow && narrow.nested_vertical_scroll_count === 0 && narrow.first_view_required_visible
    && arbitraryScrub.shot_id === "shot-b04-02" && Math.abs(arbitraryScrub.current - 93.2) < .01
    && boundaryTests.every((item) => item.before === item.expected_before && item.at === item.expected_at)
    && homeState.current === 0 && rightState.current === 1 && endState.current === 180 && spacePlayState.playing === true
    && focusVisible && reducedMotion && errors.length === 0;
  return { passed, engine: "Microsoft Edge via bundled Playwright", headless: true, muted: true, desktop, narrow, arbitrary_scrub: arbitraryScrub, boundary_tests: boundaryTests, keyboard: { home: homeState, arrow_right: rightState, end: endState, space_play: spacePlayState, focus_visible: focusVisible }, reduced_motion: reducedMotion, console_errors: errors, screenshots: screenshotInventory.files };
}

function buildResult(model, manifest, browserEvidence) {
  const frameHashes = model.shots.map((shot) => shot.canonical_frame_sha256);
  const requirementHashes = model.requirements.map((item) => item.thumbnail_sha256);
  const boundaryTestsPassed = browserEvidence?.boundary_tests?.every((item) => item.before === item.expected_before && item.at === item.expected_at) || false;
  const passed = Boolean(browserEvidence?.passed) && model.readiness_thumbnail_correction_applied === true;
  return {
    schemaVersion: "fff.privatePrevisualizationTimelineResult.v1",
    artifact_id: ARTIFACT_ID,
    source_artifact_id: SOURCE_ARTIFACT_ID,
    source_fingerprint: SOURCE_FINGERPRINT,
    readiness_artifact_id: READINESS_ARTIFACT_ID,
    readiness_source_fingerprint_before: READINESS_BASE_FINGERPRINT,
    readiness_current_fingerprint: model.readiness_current_fingerprint,
    readiness_thumbnail_correction_applied: model.readiness_thumbnail_correction_applied,
    duration_seconds: model.duration_seconds,
    beat_count: model.beats.length,
    shot_count: model.shots.length,
    narration_segment_count: model.timeline_tracks.narration_text.length,
    subtitle_cue_count: model.timeline_tracks.subtitles.length,
    gap_count: 0,
    overlap_count: 0,
    boundary_test_count: browserEvidence?.boundary_tests?.length || 0,
    boundary_tests_passed: boundaryTestsPassed,
    canonical_frame_count: frameHashes.length,
    canonical_frame_unique_hash_count: new Set(frameHashes).size,
    accidental_duplicate_frame_count: frameHashes.length - new Set(frameHashes).size,
    requirement_thumbnail_count: requirementHashes.length,
    requirement_thumbnail_unique_hash_count: new Set(requirementHashes).size,
    accidental_duplicate_requirement_thumbnail_count: requirementHashes.length - new Set(requirementHashes).size,
    intentional_reuse_shot_ids: model.shots.filter((shot) => shot.intentional_reuse_label).map((shot) => ({ shot_id: shot.shot_id, label: shot.intentional_reuse_label })),
    required_semantic_repairs: Object.fromEntries(["AR-PROP-02","AR-PROP-03","AR-ABS-01","AR-ABS-02"].map((id) => { const item=model.requirements.find((entry)=>entry.requirement_id===id); return [id,{ representative_shot_id:item.representative_shot_id, semantics_ja:item.thumbnail_semantics_ja, thumbnail_sha256:item.thumbnail_sha256 }]; })),
    rendered_reference_count: model.source_reference_audit.rendered_reference_ids.length,
    ambiguous_reference_ids: model.source_reference_audit.ambiguous_reference_ids,
    ambiguous_reference_ids_rendered: model.source_reference_audit.ambiguous_reference_ids_rendered,
    source_image_bytes_modified: 0,
    newly_downloaded_media_count: 0,
    selected_for_production_count: 0,
    rights_cleared_claim_count: 0,
    audio_generated: false,
    image_generated: false,
    public_upload: false,
    production_approved: false,
    final_canon_decision: false,
    mp4: manifest.mp4,
    package_manifest: { path: MANIFEST_PATH, fingerprint: manifest.package_fingerprint_sha256, payload_file_count: manifest.payload_file_count },
    browser_evidence: browserEvidence || { passed: false, status: "pending" },
    failures: passed ? [] : [browserEvidence?.passed ? "readiness_thumbnail_correction_pending" : "browser_evidence_pending"],
    passed
  };
}

async function build({ capture = false, validateAfter = false } = {}) {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "fff-private-previs-"));
  try {
    await mkdir(PACKAGE_ROOT, { recursive: true });
    const model = await buildModel();
    const { chromium } = await loadPlaywright();
    const browser = await chromium.launch({ channel: "msedge", headless: true });
    try {
      await renderFrames(model, browser, tempRoot);
      await renderRequirementThumbnails(model, browser, tempRoot);
      await renderContactSheet(model, browser, tempRoot);
    } finally { await browser.close(); }
    const mp4 = await exportMp4(model, tempRoot);
    await writeStructuredArtifacts(model, mp4);
    const manifest = await buildManifest(model, mp4);
    const browserEvidence = capture ? await captureBrowserEvidence(model) : null;
    const result = buildResult(model, manifest, browserEvidence);
    await writeFile(RESULT_PATH, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    if (validateAfter) await validatePackage(RESULT_PATH);
    console.log(`Private previsualization timeline generated: ${PACKAGE_ROOT}`);
    return { model, manifest, result };
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

async function validatePackage(inputPath = RESULT_PATH) {
  const beforeFiles = [...await listFilesRecursive(PACKAGE_ROOT), inputPath, ...Object.values(SCREENSHOTS)].filter((filePath) => existsSync(filePath));
  const before = await inventoryFiles(beforeFiles, ".");
  const [model, manifest, result, integratedManifest, readiness, readinessManifest, rootManifest, html] = await Promise.all([
    readJson(MODEL_PATH), readJson(MANIFEST_PATH), readJson(inputPath),
    readJson("artifacts/integrated-visual-production-package/integrated-visual-production-package-manifest.json"),
    readJson("artifacts/asset-rights-readiness-packet/asset-rights-readiness.json"),
    readJson("artifacts/asset-rights-readiness-packet/asset-rights-readiness-manifest.json"),
    readJson("artifacts/artifact-manifest.json"), readFile(HTML_PATH, "utf8")
  ]);
  const failures = [];
  const require = (condition, message) => { if (!condition) failures.push(message); };
  require(model.artifact_id === ARTIFACT_ID && result.artifact_id === ARTIFACT_ID, "artifact identity mismatch");
  require(model.source_fingerprint === SOURCE_FINGERPRINT && integratedManifest.package_fingerprint_sha256 === SOURCE_FINGERPRINT, "integrated source fingerprint mismatch");
  require(model.duration_seconds === 180 && model.beats.length === 6 && model.shots.length === 19, "wrong duration/Beat/shot count");
  require(model.timeline_tracks.narration_text.length === 6 && model.timeline_tracks.subtitles.length === 20, "narration/subtitle count mismatch");
  require(model.shots[0].start_seconds === 0 && model.shots.at(-1).end_seconds === 180, "timeline endpoints mismatch");
  for (let index=0; index<model.shots.length; index+=1) {
    const shot=model.shots[index];
    require(shot.end_seconds-shot.start_seconds===shot.duration_seconds, `shot duration mismatch ${shot.shot_id}`);
    if(index>0) require(model.shots[index-1].end_seconds===shot.start_seconds, `gap/overlap at ${shot.shot_id}`);
    require(existsSync(shot.canonical_frame_path), `missing canonical frame ${shot.shot_id}`);
    if(existsSync(shot.canonical_frame_path)) require(sha256(await readFile(shot.canonical_frame_path))===shot.canonical_frame_sha256, `canonical frame hash mismatch ${shot.shot_id}`);
    require(shot.rendered_reference_ids.every((id)=>!AMBIGUOUS_REFERENCE_IDS.has(id)), `ambiguous reference rendered ${shot.shot_id}`);
  }
  require(new Set(model.shots.map((shot)=>shot.canonical_frame_sha256)).size===19, "accidental duplicate canonical frame");
  require(model.requirements.length===14 && new Set(model.requirements.map((item)=>item.thumbnail_sha256)).size===14, "requirement thumbnail duplicate or count mismatch");
  for(const item of model.requirements){require(existsSync(item.thumbnail_path),`missing requirement thumbnail ${item.requirement_id}`);require(item.source_frame_path.endsWith(`${item.representative_shot_id}.jpg`),`thumbnail source mismatch ${item.requirement_id}`);}
  require(model.requirements.find((item)=>item.requirement_id==="AR-PROP-02").thumbnail_semantics_ja.includes("真鍮の蛾"), "AR-PROP-02 semantics mismatch");
  require(/メモ|written note/.test(model.requirements.find((item)=>item.requirement_id==="AR-PROP-03").thumbnail_semantics_ja), "AR-PROP-03 semantics mismatch");
  require(model.requirements.find((item)=>item.requirement_id==="AR-ABS-01").thumbnail_semantics_ja.includes("薄れる"), "AR-ABS-01 semantics mismatch");
  require(/時間.*名前.*46:8:46/.test(model.requirements.find((item)=>item.requirement_id==="AR-ABS-02").thumbnail_semantics_ja), "AR-ABS-02 semantics mismatch");
  require(model.source_reference_audit.ambiguous_reference_ids_rendered.length===0, "ambiguous reference render leak");
  for(const reference of readiness.references){require(existsSync(reference.local_path),`missing source image ${reference.canonical_reference_id}`);if(existsSync(reference.local_path))require(sha256(await readFile(reference.local_path))===reference.sha256,`source image hash mismatch ${reference.canonical_reference_id}`);}
  require(readiness.requirements.length===14&&readiness.counts.shot_count===19&&readiness.counts.canonical_reference_count===28&&readiness.counts.assignment_count===42,"readiness counts changed");
  require(readiness.requirements.every((item)=>item.owner_decision==="unselected"),"readiness owner decision changed");
  require(readiness.boundaries.selected_for_production_count===0&&readiness.boundaries.rights_cleared_claim_count===0,"readiness closed gates changed");
  require(readiness.requirements.every((item)=>Boolean(item.representative_preview_thumbnail)&&existsSync(path.join("artifacts/asset-rights-readiness-packet",item.representative_preview_thumbnail.replace(/^\.\.\//,"../")))),"readiness preview thumbnail mapping missing");
  require(readinessManifest.package_fingerprint_sha256===model.readiness_current_fingerprint&&model.readiness_thumbnail_correction_applied===true,"readiness correction fingerprint mismatch");
  require(rootManifest.artifact_id===ARTIFACT_ID&&rootManifest.private_previsualization_timeline?.artifact_id===ARTIFACT_ID,"root active registration mismatch");
  require(/id="playbackCanvas"/.test(html)&&/id="scrubber"/.test(html)&&/Native timeline/.test(html),"playback surface missing");
  require(!/<audio\b/i.test(html)&&!/<video\b/i.test(html),"audio/video element boundary leak");
  require(!/<img[^>]+src=["']https?:/i.test(html),"remote image hotlink found");
  require((html.match(/PREVIS \/ REFERENCE-ONLY \/ NOT FOR PUBLICATION/g)||[]).length>=1,"watermark text missing");
  const inlineScripts=[...html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)].map((match)=>match[1]).filter((script)=>script.trim()&&!script.trim().startsWith("{"));
  for(const script of inlineScripts){try{new Function(script)}catch(error){failures.push(`inline script syntax: ${error.message}`)}}
  const packageFiles=(await listFilesRecursive(PACKAGE_ROOT)).filter((filePath)=>filePath!==MANIFEST_PATH);
  const packageInventory=await inventoryFiles(packageFiles,PACKAGE_ROOT);
  require(manifest.package_fingerprint_sha256===packageInventory.aggregate_sha256&&JSON.stringify(manifest.files)===JSON.stringify(packageInventory.files),"package manifest mismatch");
  require(manifest.frame_count===19&&manifest.requirement_thumbnail_count===14&&manifest.contact_sheet_count===1,"manifest media counts mismatch");
  require(manifest.mp4.codec_name==="h264"&&manifest.mp4.width===960&&manifest.mp4.height===540&&Math.abs(manifest.mp4.duration_seconds-180)<.05&&manifest.mp4.audio_stream_count===0,"MP4 contract mismatch");
  require(result.passed===true&&result.failures.length===0&&result.browser_evidence?.passed===true,"result/browser evidence not green");
  require(result.accidental_duplicate_frame_count===0&&result.accidental_duplicate_requirement_thumbnail_count===0,"duplicate audit not green");
  require(result.boundary_test_count===18&&result.boundary_tests_passed===true,"shot boundary tests not green");
  require(result.selected_for_production_count===0&&result.rights_cleared_claim_count===0,"result closed gates changed");
  const after=await inventoryFiles(beforeFiles,".");
  require(before.aggregate_sha256===after.aggregate_sha256,"read-only validation mutated artifacts");
  if(failures.length)throw new Error(`Private previsualization validation failed: ${failures.join("; ")}`);
  console.log(`Private previsualization read-only validation passed: ${inputPath}`);
  return { passed:true,failures:[] };
}

export async function runPrivatePrevisualizationTimelineCommand({ command, inputPath, outputPath }) {
  if(outputPath)throw new Error("Private previsualization commands do not accept an output path.");
  if(command==="validate-private-previsualization-timeline")return await validatePackage(inputPath||RESULT_PATH);
  if(command==="smoke-private-previsualization-timeline")return await build({capture:true,validateAfter:true});
  throw new Error(`Unsupported Private Previsualization Timeline command: ${command}`);
}

async function main(){const command=process.argv[2]||"build";if(command==="build")return await build({capture:false,validateAfter:false});if(command==="smoke")return await build({capture:true,validateAfter:true});if(command==="validate")return await validatePackage(process.argv[3]||RESULT_PATH);console.log("Usage: node tools/fff-private-previsualization-timeline.mjs <build|smoke|validate>")}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)main().catch((error)=>{console.error(error.stack||error.message);process.exit(1)});
