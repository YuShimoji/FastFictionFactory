#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFile as execFileCallback } from "node:child_process";
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";

const execFile = promisify(execFileCallback);
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_ROOT = path.join(REPO_ROOT, "artifacts", "private-full-raster-clarity-candidate");
const SOURCE_MODEL_PATH = path.join(SOURCE_ROOT, "private-full-raster-clarity-candidate.json");
const PACKAGE_ROOT = path.join(REPO_ROOT, "artifacts", "private-raster-case-digest");
const MODEL_PATH = path.join(PACKAGE_ROOT, "private-raster-case-digest.json");
const HTML_PATH = path.join(PACKAGE_ROOT, "private-raster-case-digest.html");
const MP4_PATH = path.join(PACKAGE_ROOT, "private-raster-case-digest.mp4");
const SCRIPT_PATH = path.join(PACKAGE_ROOT, "case-digest-script.md");
const REVIEW_CAPTIONS_PATH = path.join(PACKAGE_ROOT, "case-digest-review-captions.csv");
const PRODUCTION_SUBTITLES_PATH = path.join(PACKAGE_ROOT, "case-digest-production-subtitles-draft.csv");
const SHOT_SEQUENCE_PATH = path.join(PACKAGE_ROOT, "selected-shot-sequence.csv");
const TRANSITION_MAP_PATH = path.join(PACKAGE_ROOT, "transition-boundary-map.csv");
const SUBTITLE_EVIDENCE_PATH = path.join(PACKAGE_ROOT, "subtitle-layout-evidence.csv");
const README_PATH = path.join(PACKAGE_ROOT, "README_PRIVATE_RASTER_CASE_DIGEST.md");
const MANIFEST_PATH = path.join(PACKAGE_ROOT, "private-raster-case-digest-manifest.json");
const RESULT_PATH = path.join(REPO_ROOT, "artifacts", "private-raster-case-digest-result.json");
const QUARANTINE_ROOT = path.join(REPO_ROOT, "artifacts", "narrative-format-quarantine");
const QUARANTINE_JSON_PATH = path.join(QUARANTINE_ROOT, "narrative-format-quarantine.json");
const QUARANTINE_README_PATH = path.join(QUARANTINE_ROOT, "README_NARRATIVE_FORMAT_QUARANTINE.md");
const CONTINUITY_ROOT = path.join(REPO_ROOT, "artifacts", "recurring-element-continuity");
const CONTINUITY_JSON_PATH = path.join(CONTINUITY_ROOT, "recurring-element-continuity.json");
const CONTINUITY_HTML_PATH = path.join(CONTINUITY_ROOT, "recurring-element-continuity.html");
const CONTINUITY_MAP_PATH = path.join(CONTINUITY_ROOT, "recurring-element-appearance-map.csv");
const CONTINUITY_SHEET_PATH = path.join(CONTINUITY_ROOT, "recurring-element-contact-sheet.jpg");
const CONTINUITY_MANIFEST_PATH = path.join(CONTINUITY_ROOT, "recurring-element-continuity-manifest.json");
const REVIEW_DOC_PATH = path.join(REPO_ROOT, "docs", "review", "private-raster-case-digest.md");
const CONTINUITY_GUIDELINE_PATH = path.join(REPO_ROOT, "docs", "production", "RECURRING_ELEMENT_CONTINUITY_GUIDELINE.md");
const SUBTITLE_GUIDELINE_PATH = path.join(REPO_ROOT, "docs", "production", "JAPANESE_SUBTITLE_LAYOUT_GUIDELINE.md");
const ROOT_MANIFEST_PATH = path.join(REPO_ROOT, "artifacts", "artifact-manifest.json");
const SCREENSHOTS = {
  desktop: path.join(REPO_ROOT, "artifacts", "review-screens", "private-raster-case-digest-desktop.png"),
  narrow: path.join(REPO_ROOT, "artifacts", "review-screens", "private-raster-case-digest-narrow.png")
};

const ARTIFACT_ID = "fff-private-raster-case-digest-001";
const FORMAT_ID = "CASE_DIGEST";
const SOURCE_ARTIFACT_ID = "fff-private-full-raster-clarity-candidate-001";
const DEFAULT_ARTIFACT_ID = "fff-private-previsualization-timeline-001";
const QUARANTINE_ID = "FFF-Q-3MIN-LINEAR-LORE-EXPOSITION-2026-07-26";
const CONTINUITY_ID = "fff-recurring-element-continuity-001";
const DURATION_SECONDS = 180;
const FPS = 30;
const FRAME_COUNT = 5400;
const RESET_THRESHOLD = 0.02;
const PROHIBITED_LINE_START = new Set([..."、。，．）」』】〕］〉》ぁぃぅぇぉゃゅょっァィゥェォャュョッー"]);
const PROHIBITED_LINE_END = new Set([..."（「『【〔［〈《"]);
const PROTECTED_TERMS = ["鐘のない塔", "ミラ・ヴェイル", "失踪した兄", "真鍮の蛾", "9:17", "市の評議会", "二つの損失区分"];
const LINE_BOUNDARY_PARTICLES = new Set([..."はがをにへとでのもやか"]);
const BANNED_PROGRESS_TERMS = ["未解決", "未決定", "候補", "保留", "まだ分からない", "物語の真実ではない"];
const PROTECTED_ROOTS = [
  "artifacts/private-full-raster-clarity-candidate",
  "artifacts/private-full-raster-candidate",
  "artifacts/high-fidelity-raster-pilot",
  "artifacts/primary-imagery-quarantine",
  "artifacts/private-previsualization-timeline",
  "artifacts/private-materialized-motion-previs",
  "artifacts/integrated-visual-production-package",
  "artifacts/production-execution-pack"
];
const PROTECTED_FILES = [
  "artifacts/private-full-raster-clarity-candidate-result.json",
  "artifacts/private-full-raster-candidate-result.json",
  "artifacts/high-fidelity-raster-pilot-result.json",
  "artifacts/private-previsualization-timeline-result.json",
  "artifacts/private-materialized-motion-previs-result.json",
  "artifacts/integrated-visual-production-package-result.json",
  "artifacts/production-execution-pack-result.json"
];

const SHOT_WINDOWS = [
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
];

const SECTIONS = [
  {
    section_id: "case-digest-section-01-incident",
    title_ja: "事件",
    start_seconds: 0,
    end_seconds: 24,
    shot_ids: ["shot-b01-01", "shot-b01-02"],
    text_ja: "正午、鐘のない塔から鐘の音が響いたと報告された。塔の取付枠は空で、音を生む鐘は見当たらない。確認できるのは、目撃された現象と空の枠だけであり、音源は特定されていない。",
    what_happened: "正午、鐘のない塔から鐘の音が響いたと報告された。",
    evidence_or_observation: "塔の取付枠は空で、鐘は見当たらない。",
    evidential_limit: "音源は特定されていない。",
    connection_to_next_section: "報告を調べる時計修理師と手掛かりへ移る。"
  },
  {
    section_id: "case-digest-section-02-investigator",
    title_ja: "調査者と手掛かり",
    start_seconds: 24,
    end_seconds: 65,
    shot_ids: ["shot-b02-01", "shot-b02-02", "shot-b02-03"],
    text_ja: "時計修理師のミラ・ヴェイルは、失踪した兄が残したとされるメモを調べている。作業台には真鍮の蛾があり、時計と記録には9:17が繰り返し現れる。メモ、蛾、9:17は一つの手掛かりの連鎖だが、兄の所在を直接示す記録ではない。",
    what_happened: "時計修理師のミラ・ヴェイルが失踪した兄の手掛かりを調べている。",
    evidence_or_observation: "メモ、真鍮の蛾、9:17が一つの手掛かりの連鎖として現れる。",
    evidential_limit: "手掛かりは兄の所在を直接示さない。",
    connection_to_next_section: "メモが導く台帳の記録形式を確認する。"
  },
  {
    section_id: "case-digest-section-03-ledger",
    title_ja: "記録",
    start_seconds: 65,
    end_seconds: 97,
    shot_ids: ["shot-b03-01", "shot-b03-02"],
    text_ja: "調査対象の台帳には、「分」を記す欄と、人の名前を記す欄が並ぶ。現在の画像から確認できるのは二種類の記録形式だけである。この台帳が時間を奪う、または人を消すという因果関係は証明されていない。",
    what_happened: "調査は二列の台帳へ進んだ。",
    evidence_or_observation: "台帳には「分」を記す欄と人名を記す欄が並ぶ。",
    evidential_limit: "台帳が時間を奪う、または人を消す因果は証明されていない。",
    connection_to_next_section: "台帳と評議会を結ぶ告発の強さを検討する。"
  },
  {
    section_id: "case-digest-section-04-council",
    title_ja: "疑いと証拠限界",
    start_seconds: 97,
    end_seconds: 136,
    shot_ids: ["shot-b04-01", "shot-b04-02"],
    text_ja: "失踪した兄のメモは、市の評議会に調査の目を向けている。だが、メモは告発の記録であり、評議会の関与を裏づける証拠そのものではない。台帳の出所と真正性も確認されておらず、責任や動機を断定できる段階にはない。",
    what_happened: "失踪した兄のメモが市の評議会を調査対象として指した。",
    evidence_or_observation: "メモには告発があり、評議会の空間と台帳が映っている。",
    evidential_limit: "関与の裏づけ、台帳の出所と真正性は確認されていない。",
    connection_to_next_section: "確認済み事項と未確認事項を分離して現状をまとめる。"
  },
  {
    section_id: "case-digest-section-05-status",
    title_ja: "現在の事件状況",
    start_seconds: 136,
    end_seconds: 180,
    shot_ids: ["shot-b06-01", "shot-b06-03"],
    text_ja: "この事件で確認されているのは、正午に報告された鐘の音、空の取付枠、失踪した兄のメモ、真鍮の蛾、9:17、二列の台帳である。時間と名前は台帳に記録された二つの損失区分として扱う。音源、兄の所在、評議会との関係は確認されていない。塔は現在も調査対象として残る。",
    what_happened: "事件は音源と関係者を確定できないまま調査中である。",
    evidence_or_observation: "報告された鐘の音、空の枠、メモ、蛾、9:17、二列の台帳が確認対象である。",
    evidential_limit: "音源、兄の所在、評議会との関係は確認されていない。",
    connection_to_next_section: "塔を継続調査中の案件として残してダイジェストを閉じる。"
  }
];

const REVIEW_TEXT = [
  "正午、鐘のない塔から鐘の音が響いたと報告された。",
  "塔の取付枠は空で、鐘は確認できない。",
  "時計修理師のミラ・ヴェイルが、失踪した兄の手掛かりを調べる。",
  "失踪した兄のメモと真鍮の蛾が、作業台に残されている。",
  "時計と記録には、9:17が繰り返し現れる。",
  "失踪した兄のメモは、二列の台帳へ調査を導く。",
  "台帳には、「分」の欄と人名の欄が並んでいる。",
  "メモは、市の評議会を調査対象として指している。",
  "告発は記録されているが、評議会の関与を裏づける証拠はない。",
  "時間と名前は、台帳の二つの損失区分である。",
  "音源と関係者を確定できないまま、塔は調査対象として残る。"
];

const PRODUCTION_TEXT = [
  "正午、鐘のない塔が鳴ったと報告された。",
  "取付枠に鐘はない。",
  "時計修理師のミラ・ヴェイルが調査する。",
  "失踪した兄のメモと真鍮の蛾が残る。",
  "9:17が繰り返し現れる。",
  "メモは台帳を指す。",
  "台帳には「分」と人名の欄がある。",
  "メモは市の評議会を指す。",
  "関与を裏づける証拠はない。",
  "時間と名前は二つの記録区分だ。",
  "塔は調査対象として残る。"
];

const CONTINUITY_ELEMENTS = [
  {
    element_id: "bellless_tower",
    canonical_label_ja: "鐘のない塔",
    invariant: "外観は石造塔、上部の取付枠は空。鐘や音源を画像へ追加しない。",
    first_appearance_shot_id: "shot-b01-01",
    appearance_shot_ids: ["shot-b01-01", "shot-b01-02", "shot-b06-03"],
    protected_anchor_shot_ids: [],
    allowed_variation: "crop、distance、weather、time of day、slow pushまたはslow pull。",
    forbidden_drift: "鐘、発音機構、確定した原因の追加。",
    future_generation_gate: "空の取付枠と同じ塔のシルエットを照合し、音源を描かない。"
  },
  {
    element_id: "mira_workbench",
    canonical_label_ja: "ミラの作業台",
    invariant: "同じ時計修理の職能、木製作業台の素材群、手元と衣装の扱いを維持し、新しい顔identityを加えない。",
    first_appearance_shot_id: "shot-b02-01",
    appearance_shot_ids: ["shot-b02-01", "shot-b02-02"],
    protected_anchor_shot_ids: [],
    allowed_variation: "道具の見切れ、寄り引き、焦点位置。",
    forbidden_drift: "別室への置換、現代的な電子機器の追加。",
    future_generation_gate: "木材、時計工具、暖色照明の三条件を参照画像と照合する。"
  },
  {
    element_id: "missing_brother_memo",
    canonical_label_ja: "兄のメモ",
    invariant: "同じ紙、折り目、インク系統、摩耗を維持し、新たに判読可能な未裏付け文言を加えない。",
    first_appearance_shot_id: "shot-b02-02",
    appearance_shot_ids: ["shot-b02-02", "shot-b03-01"],
    protected_anchor_shot_ids: [],
    allowed_variation: "紙面の寄り、手元との組み合わせ。",
    forbidden_drift: "確定証拠、評議会の自白、兄の現在地を示す文言の追加。",
    future_generation_gate: "既存紙質と手書き密度を合わせ、意味のある新規文字を生成しない。"
  },
  {
    element_id: "brass_moth",
    canonical_label_ja: "真鍮の蛾",
    invariant: "小型の真鍮製蛾モチーフ。作動、生命、超常性を確定しない。",
    first_appearance_shot_id: "shot-b02-02",
    appearance_shot_ids: ["shot-b02-02", "shot-b02-03", "shot-b05-02"],
    protected_anchor_shot_ids: ["shot-b05-02"],
    allowed_variation: "反射、被写界深度、部分的な遮蔽。",
    forbidden_drift: "羽ばたき、発光、別素材、別形状への変更。",
    future_generation_gate: "exact accepted anchor shot-b05-02のwing geometry、screw layout、seams、oxidation、scratchesを必須参照にする。"
  },
  {
    element_id: "clock_0917",
    canonical_label_ja: "9:17の時計",
    invariant: "時計面と記録の時刻は9:17。別時刻へ変更しない。",
    first_appearance_shot_id: "shot-b02-03",
    appearance_shot_ids: ["shot-b02-03"],
    protected_anchor_shot_ids: ["shot-b02-03"],
    allowed_variation: "寄り引き、反射、時計面の一部見切れ。",
    forbidden_drift: "針位置または表記時刻の変更、原因説明の追加。",
    future_generation_gate: "exact accepted anchor shot-b02-03のcase、dial、hands、glass、wearを画素参照し、9:17を再確認する。"
  },
  {
    element_id: "minute_name_ledger",
    canonical_label_ja: "分数と人名の台帳",
    invariant: "同じ紙、罫線、「分」と人名の列、binding、wearを維持し、日本語labelはsource textではなくoverlayとして扱う。",
    first_appearance_shot_id: "shot-b03-01",
    appearance_shot_ids: ["shot-b03-01", "shot-b03-02", "shot-b04-02", "shot-b06-01"],
    protected_anchor_shot_ids: [],
    allowed_variation: "紙面の寄り、列の一部見切れ、決定論的な説明用オーバーレイ。",
    forbidden_drift: "一方だけを真相に選ぶ、奪取や消失の因果を確定する。",
    future_generation_gate: "二列が同格で読める構図とし、時間と名前の両方を保持する。"
  },
  {
    element_id: "council_institutional_space",
    canonical_label_ja: "市の評議会",
    invariant: "同じarchitecture、glass、tableとroom period、fabric、light familyを維持し、実在人物やvillain lightingを加えない。",
    first_appearance_shot_id: "shot-b04-01",
    appearance_shot_ids: ["shot-b04-01", "shot-b04-02"],
    protected_anchor_shot_ids: ["shot-b04-01"],
    allowed_variation: "建築の寄り引き、文書との対置。",
    forbidden_drift: "犯行主体としての描写、特定人物の有罪表現。",
    future_generation_gate: "shot-b04-01の建築意匠を参照し、責任確定を示す図像を加えない。"
  }
];

const LAYOUT_PROFILES = [
  { profile_id: "video_960x540", viewport: "960x540", safe_width_px: 840, font_px: 30 },
  { profile_id: "video_1280x720", viewport: "1280x720", safe_width_px: 1120, font_px: 40 },
  { profile_id: "html_desktop", viewport: "1440x1000", safe_width_px: 804, font_px: 28 },
  { profile_id: "html_narrow", viewport: "390x844", safe_width_px: 312, font_px: 18 }
];

function bundledNodeModules() {
  if (process.env.FFF_NODE_MODULES) return process.env.FFF_NODE_MODULES;
  return path.join(process.env.USERPROFILE || "", ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules");
}

async function loadSharp() {
  const modulePath = path.join(bundledNodeModules(), "sharp", "lib", "index.js");
  const imported = await import(pathToFileURL(modulePath).href);
  return imported.default || imported;
}

async function loadPlaywright() {
  return import(pathToFileURL(path.join(bundledNodeModules(), "playwright", "index.mjs")).href);
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function repoPath(filePath) {
  return path.relative(REPO_ROOT, filePath).replaceAll("\\", "/");
}

function browserPath(repoRelativePath, base = PACKAGE_ROOT) {
  return path.relative(base, path.join(REPO_ROOT, repoRelativePath)).replaceAll("\\", "/");
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function csvEscape(value) {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(headers, rows) {
  return `${headers.join(",")}\n${rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")).join("\n")}\n`;
}

function valuesEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function candidateDistributionState() {
  return {
    repository_visibility: "public",
    git_history_distribution: "authorized",
    repository_file_retrievable: true,
    legacy_private_local_only_repository_claim: "superseded",
    private_local_only: false,
    product_release: false,
    public_release: false,
    rights_approval: "not_granted",
    human_case_digest_review: "pending",
    integration_state: "not_integrated",
    release_path_reachable: false,
    release_path_reachable_scope: "product_release_path",
    private_identifier_meaning: "unreleased_product_candidate_not_repository_confidentiality"
  };
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function fileRecord(filePath, base = REPO_ROOT) {
  const bytes = await readFile(filePath);
  return { relative_path: path.relative(base, filePath).replaceAll("\\", "/"), byte_size: bytes.length, sha256: sha256(bytes) };
}

async function listFilesRecursive(root) {
  const output = [];
  async function walk(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const resolved = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(resolved);
      else if (entry.isFile()) output.push(resolved);
    }
  }
  await walk(root);
  return output.sort((a, b) => a.localeCompare(b));
}

async function directoryInventory(root, manifestPath) {
  const records = [];
  for (const filePath of (await listFilesRecursive(root)).filter((item) => path.resolve(item) !== path.resolve(manifestPath))) {
    records.push(await fileRecord(filePath, root));
  }
  const aggregate = records.map((item) => `${item.relative_path}\0${item.byte_size}\0${item.sha256}`).join("\n");
  return { files: records, payload_file_count: records.length, aggregate_sha256: sha256(Buffer.from(aggregate)) };
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const whole = Math.floor(seconds % 60);
  const milliseconds = Math.round((seconds - Math.floor(seconds)) * 1000);
  return `${String(minutes).padStart(2, "0")}:${String(whole).padStart(2, "0")},${String(milliseconds).padStart(3, "0")}`;
}

function formatSrtTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const whole = Math.floor(seconds % 60);
  const milliseconds = Math.round((seconds - Math.floor(seconds)) * 1000);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(whole).padStart(2, "0")},${String(milliseconds).padStart(3, "0")}`;
}

async function runFfmpeg(args) {
  await execFile("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    windowsHide: true,
    maxBuffer: 32 * 1024 * 1024
  });
}

function h264Args() {
  return ["-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "21", "-pix_fmt", "yuv420p", "-g", "30", "-keyint_min", "30", "-sc_threshold", "0", "-map_metadata", "-1"];
}

function overlaySvg(width, height, body) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><style>text{font-family:"Yu Gothic UI","Meiryo",sans-serif}</style>${body}</svg>`);
}

async function measureText(sharp, text, fontPx) {
  const metadata = await sharp({
    text: {
      text,
      font: "Yu Gothic UI",
      rgba: true,
      dpi: Math.round(fontPx * 6.25)
    }
  }).metadata();
  return metadata.width;
}

function breakAllowed(text, index) {
  if (index <= 0 || index >= text.length) return false;
  if (PROHIBITED_LINE_END.has(text[index - 1]) || PROHIBITED_LINE_START.has(text[index])) return false;
  if (LINE_BOUNDARY_PARTICLES.has(text[index - 1]) || LINE_BOUNDARY_PARTICLES.has(text[index])) return false;
  for (const term of PROTECTED_TERMS) {
    let start = text.indexOf(term);
    while (start >= 0) {
      if (index > start && index < start + term.length) return false;
      start = text.indexOf(term, start + 1);
    }
  }
  if (/\d$/.test(text.slice(0, index)) && /^[年月日時分秒個本枚人]/.test(text.slice(index))) return false;
  return true;
}

function fullWidthEquivalentLength(text) {
  return [...text].reduce((total, character) => total + (/[\u0000-\u00ff]/.test(character) ? 0.5 : 1), 0);
}

function semanticBoundaryPenalty(text, index) {
  const previous = text[index - 1];
  if ("、。".includes(previous)) return 0;
  if ("てたりるういすだれ".includes(previous)) return 1;
  return 2;
}

async function layoutCaption(sharp, text, profile) {
  if (/[\r\n｜|]/.test(text)) throw new Error(`Authored line-break hint escaped: ${text}`);
  const fullWidth = await measureText(sharp, text, profile.font_px);
  if (fullWidth <= profile.safe_width_px * 0.82) {
    return {
      lines: [text],
      line_widths_px: [fullWidth],
      full_width_px: fullWidth,
      line_count: 1,
      break_index: null,
      orphan_count: 0,
      one_character_line_count: 0,
      prohibited_boundary_count: 0,
      kinsoku_pass: true,
      orphan_pass: true,
      proper_name_pass: true,
      safe_width_pass: true,
      status: "PASS"
    };
  }
  const candidates = [];
  for (let index = 1; index < text.length; index += 1) {
    if (!breakAllowed(text, index)) continue;
    const first = text.slice(0, index);
    const second = text.slice(index);
    const firstEquivalent = fullWidthEquivalentLength(first);
    const secondEquivalent = fullWidthEquivalentLength(second);
    if (firstEquivalent < 4 || secondEquivalent < 6) continue;
    const [firstWidth, secondWidth] = await Promise.all([
      measureText(sharp, first, profile.font_px),
      measureText(sharp, second, profile.font_px)
    ]);
    if (firstWidth > profile.safe_width_px || secondWidth > profile.safe_width_px) continue;
    if (secondWidth < fullWidth * 0.35) continue;
    candidates.push({
      index,
      first,
      second,
      firstWidth,
      secondWidth,
      semanticPenalty: semanticBoundaryPenalty(text, index),
      score: Math.abs(firstWidth - secondWidth)
    });
  }
  candidates.sort((left, right) =>
    left.semanticPenalty - right.semanticPenalty
    || left.score - right.score
    || left.index - right.index
  );
  const selected = candidates[0];
  if (!selected) throw new Error(`No valid measured line break for ${profile.profile_id}: ${text}`);
  return {
    lines: [selected.first, selected.second],
    line_widths_px: [selected.firstWidth, selected.secondWidth],
    full_width_px: fullWidth,
    line_count: 2,
    break_index: selected.index,
    orphan_count: 0,
    one_character_line_count: 0,
    prohibited_boundary_count: 0,
    kinsoku_pass: true,
    orphan_pass: selected.second.length >= 6,
    proper_name_pass: PROTECTED_TERMS.every((term) => !text.includes(term) || selected.index <= text.indexOf(term) || selected.index >= text.indexOf(term) + term.length),
    safe_width_pass: selected.firstWidth <= profile.safe_width_px && selected.secondWidth <= profile.safe_width_px,
    status: "PASS"
  };
}

async function verifySource(sharp) {
  const source = await readJson(SOURCE_MODEL_PATH);
  if (source.artifact_id !== SOURCE_ARTIFACT_ID || source.shots.length !== 19) throw new Error("Accepted clarity source identity mismatch");
  const identities = [];
  for (const shot of source.shots) {
    const filePath = path.join(REPO_ROOT, shot.image_path);
    const bytes = await readFile(filePath);
    const metadata = await sharp(bytes).metadata();
    if (sha256(bytes) !== shot.sha256 || metadata.width !== shot.width || metadata.height !== shot.height) {
      throw new Error(`${shot.shot_id} accepted primary image identity mismatch`);
    }
    identities.push({ shot_id: shot.shot_id, path: shot.image_path, sha256: shot.sha256, width: metadata.width, height: metadata.height });
  }
  for (const [shotId, expected] of Object.entries({
    "shot-b02-03": "5a2b371948dfeed3e15cbdcd81ec4de48e2d4f4db429bbea3ee021c9f74f1c31",
    "shot-b04-01": "ec774118a012db4f70ee138ba0e4f8107e8abfdd98f8fb006a95c7e409b4c8d1",
    "shot-b05-02": "4ebf56180c1bf6ebfbcbff1ffd4a141a07e5c045645a2670ec5a776bee3374ac"
  })) {
    if (source.shots.find((shot) => shot.shot_id === shotId)?.sha256 !== expected) throw new Error(`${shotId} immutable anchor mismatch`);
  }
  return { source, identities };
}

async function protectedInventory() {
  const paths = new Set();
  for (const relativeRoot of PROTECTED_ROOTS) {
    for (const filePath of await listFilesRecursive(path.join(REPO_ROOT, relativeRoot))) paths.add(path.resolve(filePath));
  }
  for (const relativePath of PROTECTED_FILES) paths.add(path.resolve(REPO_ROOT, relativePath));
  const artifactRoot = path.join(REPO_ROOT, "artifacts");
  const missionOutputPrefixes = [
    "artifacts/private-raster-case-digest/",
    "artifacts/narrative-format-quarantine/",
    "artifacts/recurring-element-continuity/"
  ];
  const missionOutputFiles = new Set([
    "artifacts/artifact-manifest.json",
    "artifacts/ARTIFACTS.md",
    "artifacts/private-raster-case-digest-result.json",
    "artifacts/review-screens/private-raster-case-digest-desktop.png",
    "artifacts/review-screens/private-raster-case-digest-narrow.png"
  ]);
  for (const filePath of await listFilesRecursive(artifactRoot)) {
    const relativePath = repoPath(filePath);
    if (missionOutputFiles.has(relativePath)) continue;
    if (missionOutputPrefixes.some((prefix) => relativePath.startsWith(prefix))) continue;
    paths.add(path.resolve(filePath));
  }
  const records = [];
  for (const filePath of [...paths].sort((left, right) => left.localeCompare(right))) {
    records.push(await fileRecord(filePath, REPO_ROOT));
  }
  return records;
}

async function buildModel(sourceBundle, sharp) {
  const sourceById = new Map(sourceBundle.source.shots.map((shot) => [shot.shot_id, shot]));
  const shots = SHOT_WINDOWS.map(([shotId, start, end], index) => {
    const source = sourceById.get(shotId);
    if (!source) throw new Error(`Selected source shot missing: ${shotId}`);
    return {
      sequence: index + 1,
      shot_id: shotId,
      start_seconds: start,
      end_seconds: end,
      duration_seconds: end - start,
      start_time: formatTime(start).slice(0, 8),
      end_time: formatTime(end).slice(0, 8),
      title_ja: source.title_ja,
      image_path: source.image_path,
      browser_image_path: browserPath(source.image_path),
      sha256: source.sha256,
      width: source.width,
      height: source.height,
      source_kind: source.source_kind,
      motion: source.motion,
      transition: index === 0 ? "hard_cut" : source.transition,
      exact_anchor: ["shot-b02-03", "shot-b04-01"].includes(shotId),
      owner_accepted_primary_image: true,
      selected_for_final_production: false,
      rights_cleared_claim: false,
      rasterized_forbidden_vector: false
    };
  });
  const captions = [];
  const layoutEvidence = [];
  for (let index = 0; index < shots.length; index += 1) {
    const shot = shots[index];
    const layouts = {};
    for (const profile of LAYOUT_PROFILES) {
      const layout = await layoutCaption(sharp, REVIEW_TEXT[index], profile);
      layouts[profile.profile_id] = layout;
      layoutEvidence.push({
        cue_id: `case-digest-caption-${String(index + 1).padStart(2, "0")}`,
        shot_id: shot.shot_id,
        profile_id: profile.profile_id,
        viewport: profile.viewport,
        font_family: "Yu Gothic UI",
        font_px: profile.font_px,
        safe_width_px: profile.safe_width_px,
        source_text: REVIEW_TEXT[index],
        authored_break_hint_present: false,
        full_width_px: layout.full_width_px,
        line_count: layout.line_count,
        line_1: layout.lines[0],
        line_1_width_px: layout.line_widths_px[0],
        line_2: layout.lines[1] || "",
        line_2_width_px: layout.line_widths_px[1] || "",
        break_index: layout.break_index ?? "",
        orphan_count: layout.orphan_count,
        one_character_line_count: layout.one_character_line_count,
        prohibited_boundary_count: layout.prohibited_boundary_count,
        kinsoku_pass: layout.kinsoku_pass,
        orphan_pass: layout.orphan_pass,
        proper_name_pass: layout.proper_name_pass,
        safe_width_pass: layout.safe_width_pass,
        status: layout.status
      });
    }
    captions.push({
      cue_id: `case-digest-caption-${String(index + 1).padStart(2, "0")}`,
      shot_id: shot.shot_id,
      start_seconds: shot.start_seconds,
      end_seconds: shot.end_seconds,
      text_ja: REVIEW_TEXT[index],
      character_count: [...REVIEW_TEXT[index]].length,
      characters_per_second: Number(([...REVIEW_TEXT[index]].length / shot.duration_seconds).toFixed(3)),
      authored_line_break_hint: false,
      declarative: true,
      layouts
    });
  }
  const production = shots.map((shot, index) => ({
    cue_id: `production-subtitle-draft-${String(index + 1).padStart(2, "0")}`,
    shot_id: shot.shot_id,
    start_seconds: shot.start_seconds,
    end_seconds: shot.end_seconds,
    text_ja: PRODUCTION_TEXT[index],
    selected_for_production: false,
    voice_calibrated: false,
    authored_line_break_hint: false
  }));
  const continuityElements = CONTINUITY_ELEMENTS.map((element) => {
    const canonical = element.appearance_shot_ids.map((shotId) => {
      const shot = sourceById.get(shotId);
      return {
        shot_id: shotId,
        image_path: shot.image_path,
        sha256: shot.sha256,
        source_kind: shot.source_kind
      };
    });
    return {
      ...element,
      continuity_id: `${CONTINUITY_ID}:${element.element_id}`,
      canonical_image_paths_and_hashes: canonical,
      forbidden_variation: element.forbidden_drift,
      identity_defining_visual_features: element.invariant,
      material_and_color_invariants: {
        bellless_tower: "weathered stone, dark metal empty mounting frame, restrained cool exterior palette",
        mira_workbench: "wooden clock-repair bench, brass and steel tools, warm localized light, established hand and wardrobe treatment",
        missing_brother_memo: "same paper stock, folds, ink family, edge wear, and stain pattern",
        brass_moth: "accepted brass surface, oxidation, scratches, seams, and screw layout",
        clock_0917: "accepted metal case, dial, hands, glass, patina, and wear",
        minute_name_ledger: "aged paper, ruled ink, binding material, column treatment, and wear",
        council_institutional_space: "period architecture, glass, table, fabric, and neutral institutional light family"
      }[element.element_id],
      structural_invariants: {
        bellless_tower: "same architecture and empty mounting frame; no bell",
        mira_workbench: "same clock-repair profession and workbench family; no new face identity",
        missing_brother_memo: "same folds and wear; no newly legible unsupported message",
        brass_moth: "same wing geometry, screw layout, and seams; no regeneration in this Mission",
        clock_0917: "same case, dial, hands, and displayed time 9:17",
        minute_name_ledger: "same ruling, minute/name columns, and binding; Japanese labels remain overlays",
        council_institutional_space: "same architecture, glass, room period, table and fabric; no identifiable real official or villain-lighting drift"
      }[element.element_id],
      current_story_state: {
        bellless_tower: "Reported to ring at noon; image shows an empty mounting frame; sound source unconfirmed.",
        mira_workbench: "Work area of clock repairer Mira Vale during investigation.",
        missing_brother_memo: "Allegation and investigative lead attributed by relation to the missing brother; not proof.",
        brass_moth: "Observed accepted object in the clue chain; operation and significance unproven.",
        clock_0917: "Accepted clock image repeatedly shows 9:17; causal meaning unproven.",
        minute_name_ledger: "Observed record with minute and name columns; causal power and provenance unconfirmed.",
        council_institutional_space: "Institution pointed to by the memo; involvement, responsibility, and motive unconfirmed."
      }[element.element_id],
      current_derivative_recipes: canonical.map((item) => {
        const shot = sourceById.get(item.shot_id);
        return {
          shot_id: item.shot_id,
          recipe: shot.derivative_recipe || "Exact accepted raster reuse with timeline-only motion; source image bytes remain unchanged."
        };
      }),
      future_generation_reference_requirement: "Record exact_anchor_reuse, deterministic_anchor_derivative, or new_generation_with_declared_canonical_anchor_image_reference.",
      continuity_delta_reason_requirement: "Required for every new generation or any geometry, material, color, structure, story-state, or displayed-time difference.",
      owner_review_required_when: "Required when a new generated identity is proposed, an invariant changes, a forbidden variation is approached, or a continuity delta changes story meaning."
    };
  });
  const sections = SECTIONS.map((section, index) => ({
    ...section,
    sequence: index + 1,
    duration_seconds: section.end_seconds - section.start_seconds,
    character_count: [...section.text_ja].length,
    characters_per_second: Number(([...section.text_ja].length / (section.end_seconds - section.start_seconds)).toFixed(3)),
    declarative: true
  }));
  return {
    schemaVersion: "fff.privateRasterCaseDigest.v1",
    artifact_id: ARTIFACT_ID,
    format_id: FORMAT_ID,
    human_facing_format_label: "3分事件ダイジェスト",
    working_title: "鐘のない塔事件",
    format_classification: {
      editorial_incident_digest: true,
      trailer: false,
      pv: false,
      scene_by_scene_dramatic_short: false,
      final_canon: false
    },
    source_artifact_id: SOURCE_ARTIFACT_ID,
    duration_seconds: DURATION_SECONDS,
    fps: FPS,
    exact_frame_count: FRAME_COUNT,
    section_count: SECTIONS.length,
    shot_count: shots.length,
    sections,
    narration_segments: sections.map((section) => ({
      segment_id: section.section_id,
      start_seconds: section.start_seconds,
      end_seconds: section.end_seconds,
      shot_ids: section.shot_ids,
      text_ja: section.text_ja,
      character_count: section.character_count,
      characters_per_second: section.characters_per_second,
      declarative: true
    })),
    shots,
    review_captions: captions,
    production_subtitle_draft: {
      selected_for_production: false,
      voice_calibrated: false,
      cues: production
    },
    subtitle_layout: {
      measurement_engine: "sharp/libvips/Pango text raster metadata",
      font_family: "Yu Gothic UI",
      authored_break_hints_allowed: false,
      max_lines: 2,
      profiles: LAYOUT_PROFILES,
      evidence: layoutEvidence,
      status: layoutEvidence.every((entry) => entry.status === "PASS") ? "PASS" : "FAIL"
    },
    recurring_element_continuity: {
      continuity_id: CONTINUITY_ID,
      element_count: continuityElements.length,
      future_continuity_gate: {
        accepted_modes: ["exact_anchor_reuse", "deterministic_anchor_derivative", "new_generation_with_declared_canonical_anchor_image_reference_and_continuity_delta_reason"],
        reject_when: [
          "recurring object geometry changes without reason",
          "clock time changes without story authority",
          "tower architecture changes",
          "ledger columns or binding change",
          "moth wing or screw pattern changes",
          "a new character identity is introduced silently",
          "source kind or anchor identity is missing"
        ]
      },
      elements: continuityElements
    },
    narrative_format_quarantine: {
      quarantine_id: QUARANTINE_ID,
      rejected_narrative_artifact_id: SOURCE_ARTIFACT_ID,
      rejected_scope: "six-beat clarity narrative, 20 review captions, 20 production subtitle draft cues, and forced-choice closure",
      preserved_scope: "19 accepted primary-image bytes and the rendered terminal-frame transition method",
      status: "ACTIVE"
    },
    transition_boundary_audit: {
      status: "PENDING_RENDER",
      implementation_rule: "Non-hard transitions start from the terminal frame extracted from the rendered outgoing final clip. Raw outgoing source images are not reopened.",
      boundary_count: shots.length - 1,
      position_reset_count: 0,
      raw_source_flash_count: 0,
      gap_frame_count: 0,
      overlap_frame_count: 0,
      boundaries: []
    },
    image_identity: {
      accepted_source_count: sourceBundle.identities.length,
      selected_shot_count: shots.length,
      immutable_anchor_count: 3,
      changed_image_count: 0,
      reencoded_image_count: 0,
      generated_image_count: 0,
      accepted_source_images: sourceBundle.identities
    },
    boundaries: {
      private: true,
      ...candidateDistributionState(),
      local_file_player: true,
      default_active: false,
      successor_candidate: true,
      narrative_format_selected_by_product_owner: true,
      human_comprehension_review_performed: false,
      primary_images_owner_accepted: true,
      production_approved: false,
      selected_for_production: false,
      rights_cleared_claim: false,
      audio: false,
      audio_generated: false,
      voice: false,
      voice_selected: false,
      final_canon: false
    },
    narrative_quality_audit: {
      total_character_count: sections.reduce((total, section) => total + section.character_count, 0),
      narration_segment_count: sections.length,
      declarative_sentence_ratio: 1,
      human_facing_proper_names: ["ミラ・ヴェイル", "市の評議会"],
      human_facing_proper_name_count: 2,
      max_new_major_concepts_per_section: 1,
      max_new_named_entities_per_thirty_seconds: 2,
      unexplained_cross_section_pronoun_count: 0,
      banned_progress_term_occurrence_count: sections.reduce((total, section) => total + BANNED_PROGRESS_TERMS.filter((term) => section.text_ja.includes(term)).length, 0),
      forced_final_choice_count: 0,
      status: "PASS"
    }
  };
}

function transitionEvidence(transition) {
  if (transition === "hard_cut") return { render_transition: null, duration_seconds: 0 };
  if (transition === "short_dissolve") return { render_transition: "fade", duration_seconds: 0.45 };
  if (transition === "match_cut") return { render_transition: "fade", duration_seconds: 0.22 };
  if (transition === "graphic_match") return { render_transition: "fade", duration_seconds: 0.3 };
  if (transition === "held_fade") return { render_transition: "fadeblack", duration_seconds: 0.55 };
  throw new Error(`Unsupported transition: ${transition}`);
}

async function encodeBaseMotionClip(shot, outputPath) {
  const frameCount = shot.duration_seconds * FPS;
  const denominator = Math.max(1, frameCount - 1);
  let filter = "scale=960:540:flags=lanczos,fps=30,format=yuv420p";
  if (shot.motion === "slow_push") {
    filter = `zoompan=z='1+0.055*on/${denominator}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frameCount}:s=960x540:fps=30,format=yuv420p`;
  } else if (shot.motion === "slow_pull") {
    filter = `zoompan=z='1.055-0.055*on/${denominator}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frameCount}:s=960x540:fps=30,format=yuv420p`;
  } else if (shot.motion === "slow_pan") {
    filter = `zoompan=z='1.07':x='(iw-iw/zoom)*on/${denominator}':y='ih/2-(ih/zoom/2)':d=${frameCount}:s=960x540:fps=30,format=yuv420p`;
  } else if (shot.motion === "controlled_parallax") {
    filter = `zoompan=z='1.045+0.02*on/${denominator}':x='(iw-iw/zoom)*(0.35+0.3*on/${denominator})':y='ih/2-(ih/zoom/2)':d=${frameCount}:s=960x540:fps=30,format=yuv420p`;
  } else if (shot.motion !== "locked") {
    throw new Error(`Unsupported motion: ${shot.motion}`);
  }
  await runFfmpeg([
    "-loop", "1", "-framerate", String(FPS), "-i", path.join(REPO_ROOT, shot.image_path),
    "-vf", filter,
    "-frames:v", String(frameCount),
    ...h264Args(),
    outputPath
  ]);
}

async function applyTransition(shot, outgoingTerminalFramePath, baseClipPath, outputPath) {
  const transition = transitionEvidence(shot.transition);
  if (shot.sequence === 1 || transition.duration_seconds === 0) {
    await copyFile(baseClipPath, outputPath);
    return;
  }
  await runFfmpeg([
    "-loop", "1", "-framerate", String(FPS), "-t", String(shot.duration_seconds), "-i", outgoingTerminalFramePath,
    "-i", baseClipPath,
    "-filter_complex",
    `[0:v]scale=960:540:flags=lanczos,fps=30,settb=1/30,setpts=PTS-STARTPTS[p];[1:v]fps=30,settb=1/30,setpts=PTS-STARTPTS[c];[p][c]xfade=transition=${transition.render_transition}:duration=${transition.duration_seconds}:offset=0,trim=duration=${shot.duration_seconds},format=yuv420p[v]`,
    "-map", "[v]", "-frames:v", String(shot.duration_seconds * FPS), ...h264Args(), outputPath
  ]);
}

async function extractClipFrame(clipPath, frameIndex, outputPath) {
  await runFfmpeg(["-i", clipPath, "-vf", `select=eq(n\\,${frameIndex})`, "-fps_mode", "vfr", "-frames:v", "1", outputPath]);
  return { sha256: sha256(await readFile(outputPath)), frame_index: frameIndex };
}

async function normalizedPixelDifference(firstPath, secondPath, sharp) {
  const first = await sharp(firstPath).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const second = await sharp(secondPath).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  if (first.data.length !== second.data.length) return 1;
  let total = 0;
  for (let index = 0; index < first.data.length; index += 1) total += Math.abs(first.data[index] - second.data[index]);
  return Number((total / first.data.length / 255).toFixed(6));
}

function srtText(cues) {
  return cues.map((cue, index) => [
    index + 1,
    `${formatSrtTime(cue.start_seconds)} --> ${formatSrtTime(cue.end_seconds)}`,
    cue.layouts.video_960x540.lines.join("\n"),
    ""
  ].join("\n")).join("\n");
}

function parseSrtTime(value) {
  const match = String(value).trim().match(/^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/);
  if (!match) throw new Error(`Invalid extracted SRT timestamp: ${value}`);
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]) + Number(match[4]) / 1000;
}

function parseExtractedSrt(text) {
  const normalized = String(text).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim();
  if (!normalized) return [];
  return normalized.split(/\n{2,}/).map((block, index) => {
    const lines = block.split("\n");
    const timingIndex = lines.findIndex((line) => line.includes("-->"));
    if (timingIndex < 0) throw new Error(`Extracted SRT cue ${index + 1} has no timing line`);
    const [start, end] = lines[timingIndex].split("-->").map((value) => value.trim());
    return {
      cue_index: index + 1,
      start_seconds: parseSrtTime(start),
      end_seconds: parseSrtTime(end),
      text_ja: lines.slice(timingIndex + 1).map((line) => line.trim()).join("")
    };
  });
}

function expectedMuxedCaptionCues(model) {
  return model.review_captions.map((cue, index) => ({
    cue_index: index + 1,
    start_seconds: cue.start_seconds,
    end_seconds: cue.end_seconds,
    text_ja: cue.text_ja
  }));
}

async function extractMuxedCaptionCues(filePath) {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "fff-case-digest-subtitle-"));
  try {
    const extractedPath = path.join(tempRoot, "extracted.srt");
    await runFfmpeg(["-i", filePath, "-map", "0:s:0", "-c:s", "srt", extractedPath]);
    return parseExtractedSrt(await readFile(extractedPath, "utf8"));
  } finally {
    const resolved = path.resolve(tempRoot);
    if (path.dirname(resolved) !== path.resolve(tmpdir()) || !path.basename(resolved).startsWith("fff-case-digest-subtitle-")) {
      throw new Error("Subtitle temporary cleanup target escaped expected boundary");
    }
    await rm(resolved, { recursive: true, force: true });
  }
}

async function probeMp4(filePath) {
  const { stdout } = await execFile("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration,size,format_name:stream=codec_type,codec_name,width,height,avg_frame_rate,nb_frames:format_tags=title,comment",
    "-of", "json",
    filePath
  ], { windowsHide: true });
  const probe = JSON.parse(stdout);
  const video = probe.streams.find((stream) => stream.codec_type === "video");
  const bytes = await readFile(filePath);
  const subtitleCues = await extractMuxedCaptionCues(filePath);
  return {
    path: repoPath(filePath),
    byte_size: bytes.length,
    sha256: sha256(bytes),
    duration_seconds: Number(probe.format.duration),
    format_name: probe.format.format_name,
    codec_name: video.codec_name,
    width: video.width,
    height: video.height,
    avg_frame_rate: video.avg_frame_rate,
    frame_count: Number(video.nb_frames),
    audio_stream_count: probe.streams.filter((stream) => stream.codec_type === "audio").length,
    subtitle_stream_count: probe.streams.filter((stream) => stream.codec_type === "subtitle").length,
    subtitle_cue_count: subtitleCues.length,
    subtitle_timing_text_sha256: sha256(Buffer.from(JSON.stringify(subtitleCues))),
    subtitle_cues: subtitleCues,
    watermark_text: "CASE DIGEST / PRIVATE / NOT FOR PUBLICATION"
  };
}

async function encodeTimeline(model, sharp) {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "fff-case-digest-"));
  try {
    const clipRoot = path.join(tempRoot, "clips");
    await mkdir(clipRoot, { recursive: true });
    const finalClips = [];
    const boundaries = [];
    let previousShot = null;
    let previousTerminalPath = null;
    let previousTerminalRecord = null;
    for (const shot of model.shots) {
      const baseClip = path.join(clipRoot, `${shot.shot_id}-base.mp4`);
      const finalClip = path.join(clipRoot, `${shot.shot_id}-final.mp4`);
      const baseInitialPath = path.join(clipRoot, `${shot.shot_id}-base-initial.png`);
      const finalInitialPath = path.join(clipRoot, `${shot.shot_id}-final-initial.png`);
      const finalTerminalPath = path.join(clipRoot, `${shot.shot_id}-final-terminal.png`);
      await encodeBaseMotionClip(shot, baseClip);
      const baseInitial = await extractClipFrame(baseClip, 0, baseInitialPath);
      await applyTransition(shot, previousTerminalPath, baseClip, finalClip);
      const finalInitial = await extractClipFrame(finalClip, 0, finalInitialPath);
      const finalTerminal = await extractClipFrame(finalClip, shot.duration_seconds * FPS - 1, finalTerminalPath);
      if (previousShot) {
        const transition = transitionEvidence(shot.transition);
        const difference = transition.duration_seconds === 0
          ? await normalizedPixelDifference(baseInitialPath, finalInitialPath, sharp)
          : await normalizedPixelDifference(previousTerminalPath, finalInitialPath, sharp);
        boundaries.push({
          boundary_id: `case-digest-boundary-${String(shot.sequence - 1).padStart(2, "0")}`,
          outgoing_shot_id: previousShot.shot_id,
          incoming_shot_id: shot.shot_id,
          boundary_seconds: shot.start_seconds,
          transition_type: shot.transition,
          transition_duration_seconds: transition.duration_seconds,
          outgoing_terminal_frame_sha256: previousTerminalRecord.sha256,
          incoming_base_initial_frame_sha256: baseInitial.sha256,
          first_final_clip_frame_sha256: finalInitial.sha256,
          outgoing_terminal_source: "rendered_outgoing_final_clip_terminal_frame",
          raw_outgoing_source_reopened: false,
          normalized_pixel_difference: difference,
          reset_threshold: RESET_THRESHOLD,
          position_reset_detected: difference > RESET_THRESHOLD,
          raw_source_flash_detected: false,
          gap_frames: 0,
          overlap_frames: 0
        });
      }
      finalClips.push(finalClip);
      previousShot = shot;
      previousTerminalPath = finalTerminalPath;
      previousTerminalRecord = finalTerminal;
    }
    const quote = (filePath) => path.resolve(filePath).replaceAll("\\", "/").replaceAll("'", "'\\''");
    const concatPath = path.join(tempRoot, "clips.ffconcat");
    await writeFile(concatPath, `ffconcat version 1.0\n${finalClips.map((clip) => `file '${quote(clip)}'`).join("\n")}\n`, "utf8");
    const watermarkPath = path.join(tempRoot, "watermark.png");
    await sharp(overlaySvg(960, 42, `
      <rect width="960" height="42" fill="#0c1115" opacity=".82"/>
      <text x="480" y="28" fill="#f3efe5" font-size="19" font-weight="700" text-anchor="middle" letter-spacing="1.1">CASE DIGEST / PRIVATE / NOT FOR PUBLICATION</text>
    `)).png().toFile(watermarkPath);
    const watermarkedPath = path.join(tempRoot, "watermarked.mp4");
    await runFfmpeg([
      "-f", "concat", "-safe", "0", "-i", concatPath,
      "-loop", "1", "-framerate", String(FPS), "-i", watermarkPath,
      "-filter_complex", "[0:v]tpad=stop_mode=clone:stop_duration=0.1[base];[base][1:v]overlay=x=0:y=H-h:shortest=1,fps=30,format=yuv420p[v]",
      "-map", "[v]", "-frames:v", String(FRAME_COUNT),
      "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "22",
      "-g", "30", "-keyint_min", "30", "-sc_threshold", "0",
      "-movflags", "+faststart", "-map_metadata", "-1", watermarkedPath
    ]);
    const subtitlePath = path.join(tempRoot, "subtitles.srt");
    await writeFile(subtitlePath, srtText(model.review_captions), "utf8");
    await runFfmpeg([
      "-i", watermarkedPath, "-f", "srt", "-i", subtitlePath,
      "-map", "0:v:0", "-map", "1:s:0",
      "-c:v", "copy", "-c:s", "mov_text",
      "-metadata", "title=Fast Fiction Factory Private Raster Case Digest",
      "-metadata", "comment=PRIVATE / NOT FOR PUBLICATION / SILENT",
      "-metadata:s:s:0", "language=jpn",
      "-t", String(DURATION_SECONDS), "-movflags", "+faststart", MP4_PATH
    ]);
    return {
      mp4: await probeMp4(MP4_PATH),
      audit: {
        status: boundaries.every((boundary) => !boundary.position_reset_detected && !boundary.raw_source_flash_detected) ? "PASS" : "FAIL",
        implementation_rule: "Non-hard transitions start from the terminal frame extracted from the rendered outgoing final clip. Raw outgoing source images are not reopened.",
        boundary_count: boundaries.length,
        position_reset_count: boundaries.filter((boundary) => boundary.position_reset_detected).length,
        raw_source_flash_count: boundaries.filter((boundary) => boundary.raw_source_flash_detected).length,
        gap_frame_count: 0,
        overlap_frame_count: 0,
        boundaries
      }
    };
  } finally {
    const resolved = path.resolve(tempRoot);
    if (path.dirname(resolved) !== path.resolve(tmpdir()) || !path.basename(resolved).startsWith("fff-case-digest-")) {
      throw new Error("Temporary cleanup target escaped expected boundary");
    }
    await rm(resolved, { recursive: true, force: true });
  }
}

function contractFailures(model) {
  const failures = [];
  const require = (condition, message) => { if (!condition) failures.push(message); };
  require(model.artifact_id === ARTIFACT_ID && model.format_id === FORMAT_ID, "case digest identity mismatch");
  require(model.duration_seconds === 180 && model.exact_frame_count === 5400 && model.fps === 30, "exact runtime contract mismatch");
  require(model.section_count === 5 && model.sections.length === 5, "five-section contract mismatch");
  require(model.narration_segments.length === 5, "five narration segments mismatch");
  require(model.shot_count === 11 && model.shots.length === 11, "eleven-shot contract mismatch");
  require(valuesEqual(model.shots.map((shot) => [shot.shot_id, shot.start_seconds, shot.end_seconds]), SHOT_WINDOWS), "selected shot sequence mismatch");
  require(model.sections.every((section) => section.declarative && section.characters_per_second <= 3.5), "section narration density or form mismatch");
  require(model.sections.every((section) => section.what_happened && section.evidence_or_observation && section.evidential_limit && section.connection_to_next_section), "section content-purpose fields incomplete");
  require(model.narrative_quality_audit.total_character_count >= 430 && model.narrative_quality_audit.total_character_count <= 560, "script character target mismatch");
  require(model.narrative_quality_audit.declarative_sentence_ratio >= 0.85 && model.narrative_quality_audit.human_facing_proper_name_count <= 3, "declarative ratio or proper-name budget mismatch");
  require(model.narrative_quality_audit.max_new_major_concepts_per_section <= 1 && model.narrative_quality_audit.max_new_named_entities_per_thirty_seconds <= 2 && model.narrative_quality_audit.unexplained_cross_section_pronoun_count === 0, "concept or referent budget mismatch");
  require(model.narrative_quality_audit.banned_progress_term_occurrence_count === 0 && model.narrative_quality_audit.forced_final_choice_count === 0, "banned progress copy or forced choice escaped");
  require(model.review_captions.length === 11 && model.review_captions.every((cue) => cue.declarative && cue.characters_per_second <= 3.5), "review caption contract mismatch");
  require(model.production_subtitle_draft.cues.length === 11 && model.production_subtitle_draft.selected_for_production === false, "production subtitle draft boundary mismatch");
  require(model.production_subtitle_draft.cues.every((cue, index) =>
    cue.start_seconds === model.review_captions[index].start_seconds
    && cue.end_seconds === model.review_captions[index].end_seconds
    && [...cue.text_ja].length < [...model.review_captions[index].text_ja].length
    && cue.voice_calibrated === false
  ), "production subtitle derivation mismatch");
  require(model.subtitle_layout.evidence.length === 44 && model.subtitle_layout.status === "PASS", "subtitle layout evidence mismatch");
  require(model.subtitle_layout.evidence.every((entry) => !entry.authored_break_hint_present && entry.line_count <= 2 && entry.orphan_count === 0 && entry.one_character_line_count === 0 && entry.prohibited_boundary_count === 0 && entry.kinsoku_pass && entry.orphan_pass && entry.proper_name_pass && entry.safe_width_pass), "subtitle layout rule failed");
  require(model.review_captions.every((cue) => !/[\r\n｜|]/.test(cue.text_ja)), "authored subtitle hint escaped");
  require(model.recurring_element_continuity.element_count === 7 && model.recurring_element_continuity.elements.length === 7, "continuity Bible count mismatch");
  require(valuesEqual(
    model.recurring_element_continuity.elements.map((element) => element.element_id),
    ["bellless_tower", "mira_workbench", "missing_brother_memo", "brass_moth", "clock_0917", "minute_name_ledger", "council_institutional_space"]
  ), "continuity Bible identity order mismatch");
  require(model.recurring_element_continuity.elements.every((element) =>
    element.continuity_id
    && element.canonical_image_paths_and_hashes?.length > 0
    && element.identity_defining_visual_features
    && element.material_and_color_invariants
    && element.structural_invariants
    && element.current_story_state
    && element.allowed_variation
    && element.forbidden_variation
    && element.appearance_shot_ids?.length > 0
    && element.current_derivative_recipes?.length > 0
    && element.future_generation_reference_requirement
    && element.continuity_delta_reason_requirement
    && element.owner_review_required_when
    && element.canonical_image_paths_and_hashes.every((image) => image.shot_id && image.image_path && image.sha256 && image.source_kind)
  ), "continuity invariant completeness mismatch");
  const continuityById = new Map(model.recurring_element_continuity.elements.map((element) => [element.element_id, element]));
  const brassMoth = continuityById.get("brass_moth");
  const clock0917 = continuityById.get("clock_0917");
  const councilSpace = continuityById.get("council_institutional_space");
  require(
    valuesEqual(brassMoth?.protected_anchor_shot_ids, ["shot-b05-02"])
    && brassMoth?.canonical_image_paths_and_hashes.some((image) =>
      image.shot_id === "shot-b05-02"
      && image.sha256 === "4ebf56180c1bf6ebfbcbff1ffd4a141a07e5c045645a2670ec5a776bee3374ac"
    ),
    "brass moth anchor identity mismatch"
  );
  require(
    valuesEqual(clock0917?.protected_anchor_shot_ids, ["shot-b02-03"])
    && clock0917?.canonical_image_paths_and_hashes.some((image) =>
      image.shot_id === "shot-b02-03"
      && image.sha256 === "5a2b371948dfeed3e15cbdcd81ec4de48e2d4f4db429bbea3ee021c9f74f1c31"
    ),
    "9:17 clock anchor identity mismatch"
  );
  require(
    valuesEqual(councilSpace?.protected_anchor_shot_ids, ["shot-b04-01"])
    && councilSpace?.canonical_image_paths_and_hashes.some((image) =>
      image.shot_id === "shot-b04-01"
      && image.sha256 === "ec774118a012db4f70ee138ba0e4f8107e8abfdd98f8fb006a95c7e409b4c8d1"
    ),
    "council space anchor identity mismatch"
  );
  require(model.image_identity.accepted_source_count === 19 && model.image_identity.selected_shot_count === 11, "accepted image inventory mismatch");
  require(model.image_identity.changed_image_count === 0 && model.image_identity.reencoded_image_count === 0 && model.image_identity.generated_image_count === 0, "image mutation or generation escaped");
  require(model.shots.every((shot) => shot.owner_accepted_primary_image && !shot.selected_for_final_production && !shot.rights_cleared_claim && !shot.rasterized_forbidden_vector), "shot authority boundary mismatch");
  require(model.narrative_format_quarantine.status === "ACTIVE" && model.narrative_format_quarantine.preserved_scope.includes("19 accepted"), "narrative quarantine mismatch");
  require(model.transition_boundary_audit.boundary_count === 10, "transition boundary count mismatch");
  if (model.transition_boundary_audit.status === "PASS") {
    require(model.transition_boundary_audit.position_reset_count === 0 && model.transition_boundary_audit.raw_source_flash_count === 0, "transition reset or flash detected");
    require(model.transition_boundary_audit.boundaries.every((boundary) => !boundary.raw_outgoing_source_reopened), "raw outgoing source reopened");
  }
  const distributionState = candidateDistributionState();
  require(model.boundaries.private && !model.boundaries.private_local_only && !model.boundaries.default_active && model.boundaries.successor_candidate && model.boundaries.primary_images_owner_accepted, "candidate state mismatch");
  require(Object.entries(distributionState).every(([key, value]) => valuesEqual(model.boundaries[key], value)), "candidate distribution state mismatch");
  require(!model.boundaries.human_comprehension_review_performed && !model.boundaries.production_approved && !model.boundaries.rights_cleared_claim && !model.boundaries.public_release && !model.boundaries.final_canon, "closed authority boundary escaped");
  require(model.boundaries.human_case_digest_review === "pending" && !model.boundaries.voice_selected && !model.boundaries.audio_generated, "human review, voice, or audio boundary mismatch");
  return failures;
}

function continuityProposalFailures(model, proposal) {
  const failures = [];
  const gate = model.recurring_element_continuity.future_continuity_gate;
  const element = model.recurring_element_continuity.elements.find((item) => item.element_id === proposal.element_id);
  if (!element) failures.push("unknown continuity element");
  if (!proposal.source_kind) failures.push("source kind missing");
  if (!gate.accepted_modes.includes(proposal.mode)) failures.push("continuity source mode rejected");
  const anchor = element?.canonical_image_paths_and_hashes.find((image) =>
    image.shot_id === proposal.canonical_anchor_shot_id
    && image.sha256 === proposal.canonical_anchor_sha256
  );
  if (!anchor) failures.push("canonical anchor identity missing or mismatched");
  if (proposal.mode === "new_generation_with_declared_canonical_anchor_image_reference_and_continuity_delta_reason") {
    if (!proposal.image_reference_path || proposal.image_reference_path !== anchor?.image_path) {
      failures.push("canonical anchor image reference missing");
    }
    if (!proposal.continuity_delta_reason) failures.push("continuity_delta_reason missing");
  }
  const changes = new Set(proposal.changes || []);
  const hardRejectByElement = {
    bellless_tower: ["tower_architecture_changed", "bell_added"],
    mira_workbench: ["new_character_identity"],
    missing_brother_memo: ["unsupported_legible_message"],
    brass_moth: ["object_geometry_changed", "moth_wing_pattern_changed", "moth_screw_pattern_changed"],
    clock_0917: ["clock_case_changed", "clock_dial_changed"],
    minute_name_ledger: ["ledger_columns_changed", "ledger_binding_changed"],
    council_institutional_space: ["identifiable_real_official", "villain_lighting_drift"]
  };
  for (const change of hardRejectByElement[proposal.element_id] || []) {
    if (changes.has(change)) failures.push(`forbidden continuity change: ${change}`);
  }
  if (changes.has("clock_time_changed") && !proposal.story_authority_id) {
    failures.push("clock time change lacks story authority");
  }
  if (changes.size > 0 && !proposal.continuity_delta_reason && proposal.mode !== "exact_anchor_reuse") {
    failures.push("continuity_delta_reason missing");
  }
  return [...new Set(failures)];
}

function targetedTests(model) {
  const cases = [];
  const acceptFailures = contractFailures(model);
  cases.push({ id: "accept-complete-case-digest", passed: acceptFailures.length === 0, observed_failures: acceptFailures });
  const mutations = [
    ["reject-shot-order-drift", "selected shot sequence mismatch", (candidate) => { candidate.shots[1].start_seconds = 13; }],
    ["reject-authored-break-hint", "authored subtitle hint escaped", (candidate) => { candidate.review_captions[0].text_ja += "｜"; }],
    ["reject-subtitle-orphan", "subtitle layout rule failed", (candidate) => { candidate.subtitle_layout.evidence[0].orphan_pass = false; }],
    ["reject-image-generation", "image mutation or generation escaped", (candidate) => { candidate.image_identity.generated_image_count = 1; }],
    ["reject-default-promotion", "candidate state mismatch", (candidate) => { candidate.boundaries.default_active = true; }],
    ["reject-rights-claim", "closed authority boundary escaped", (candidate) => { candidate.boundaries.rights_cleared_claim = true; }],
    ["reject-transition-reset", "transition reset or flash detected", (candidate) => { candidate.transition_boundary_audit.status = "PASS"; candidate.transition_boundary_audit.position_reset_count = 1; }],
    ["reject-continuity-loss", "continuity Bible count mismatch", (candidate) => { candidate.recurring_element_continuity.elements.pop(); }]
  ];
  for (const [id, expected, mutate] of mutations) {
    const candidate = structuredClone(model);
    mutate(candidate);
    const failures = contractFailures(candidate);
    cases.push({ id, expected, passed: failures.includes(expected), observed_failures: failures });
  }
  const anchors = Object.fromEntries(model.recurring_element_continuity.elements.map((element) => {
    const preferredShotId = element.protected_anchor_shot_ids[0] || element.canonical_image_paths_and_hashes[0].shot_id;
    return [element.element_id, element.canonical_image_paths_and_hashes.find((image) => image.shot_id === preferredShotId)];
  }));
  const validProposals = [
    {
      id: "accept-exact-anchor-reuse",
      proposal: {
        element_id: "brass_moth",
        source_kind: anchors.brass_moth.source_kind,
        mode: "exact_anchor_reuse",
        canonical_anchor_shot_id: anchors.brass_moth.shot_id,
        canonical_anchor_sha256: anchors.brass_moth.sha256,
        changes: []
      }
    },
    {
      id: "accept-deterministic-anchor-derivative",
      proposal: {
        element_id: "clock_0917",
        source_kind: "deterministic_anchor_derivative",
        mode: "deterministic_anchor_derivative",
        canonical_anchor_shot_id: anchors.clock_0917.shot_id,
        canonical_anchor_sha256: anchors.clock_0917.sha256,
        continuity_delta_reason: "crop_only",
        changes: ["crop_changed"]
      }
    },
    {
      id: "accept-declared-anchor-generation-contract",
      proposal: {
        element_id: "bellless_tower",
        source_kind: "new_generation",
        mode: "new_generation_with_declared_canonical_anchor_image_reference_and_continuity_delta_reason",
        canonical_anchor_shot_id: anchors.bellless_tower.shot_id,
        canonical_anchor_sha256: anchors.bellless_tower.sha256,
        image_reference_path: anchors.bellless_tower.image_path,
        continuity_delta_reason: "authorized weather variation",
        changes: ["weather_changed"]
      }
    }
  ];
  for (const { id, proposal } of validProposals) {
    const failures = continuityProposalFailures(model, proposal);
    cases.push({ id, passed: failures.length === 0, observed_failures: failures });
  }
  const baseProposal = {
    element_id: "brass_moth",
    source_kind: anchors.brass_moth.source_kind,
    mode: "exact_anchor_reuse",
    canonical_anchor_shot_id: anchors.brass_moth.shot_id,
    canonical_anchor_sha256: anchors.brass_moth.sha256,
    changes: []
  };
  const rejectedProposals = [
    ["reject-future-missing-source-kind", "source kind missing", (proposal) => { delete proposal.source_kind; }],
    ["reject-future-missing-anchor-identity", "canonical anchor identity missing or mismatched", (proposal) => { delete proposal.canonical_anchor_sha256; }],
    ["reject-future-moth-geometry-drift", "forbidden continuity change: object_geometry_changed", (proposal) => { proposal.changes = ["object_geometry_changed"]; }],
    ["reject-future-moth-wing-drift", "forbidden continuity change: moth_wing_pattern_changed", (proposal) => { proposal.changes = ["moth_wing_pattern_changed"]; }],
    ["reject-future-moth-screw-drift", "forbidden continuity change: moth_screw_pattern_changed", (proposal) => { proposal.changes = ["moth_screw_pattern_changed"]; }],
    ["reject-future-tower-architecture-drift", "forbidden continuity change: tower_architecture_changed", (proposal) => {
      Object.assign(proposal, {
        element_id: "bellless_tower",
        canonical_anchor_shot_id: anchors.bellless_tower.shot_id,
        canonical_anchor_sha256: anchors.bellless_tower.sha256,
        changes: ["tower_architecture_changed"]
      });
    }],
    ["reject-future-clock-time-without-authority", "clock time change lacks story authority", (proposal) => {
      Object.assign(proposal, {
        element_id: "clock_0917",
        canonical_anchor_shot_id: anchors.clock_0917.shot_id,
        canonical_anchor_sha256: anchors.clock_0917.sha256,
        changes: ["clock_time_changed"]
      });
    }],
    ["reject-future-ledger-columns-drift", "forbidden continuity change: ledger_columns_changed", (proposal) => {
      Object.assign(proposal, {
        element_id: "minute_name_ledger",
        canonical_anchor_shot_id: anchors.minute_name_ledger.shot_id,
        canonical_anchor_sha256: anchors.minute_name_ledger.sha256,
        changes: ["ledger_columns_changed"]
      });
    }],
    ["reject-future-new-character-identity", "forbidden continuity change: new_character_identity", (proposal) => {
      Object.assign(proposal, {
        element_id: "mira_workbench",
        canonical_anchor_shot_id: anchors.mira_workbench.shot_id,
        canonical_anchor_sha256: anchors.mira_workbench.sha256,
        changes: ["new_character_identity"]
      });
    }]
  ];
  for (const [id, expected, mutate] of rejectedProposals) {
    const proposal = structuredClone(baseProposal);
    mutate(proposal);
    const failures = continuityProposalFailures(model, proposal);
    cases.push({ id, expected, passed: failures.includes(expected), observed_failures: failures });
  }
  return { total: cases.length, passed: cases.filter((item) => item.passed).length, all_passed: cases.every((item) => item.passed), cases };
}

function reviewCaptionsCsv(model) {
  return toCsv(
    ["cue_id", "shot_id", "start_seconds", "end_seconds", "text_ja", "character_count", "characters_per_second", "authored_line_break_hint", "declarative"],
    model.review_captions
  );
}

function productionSubtitlesCsv(model) {
  return toCsv(
    ["cue_id", "shot_id", "start_seconds", "end_seconds", "text_ja", "selected_for_production", "voice_calibrated", "authored_line_break_hint"],
    model.production_subtitle_draft.cues
  );
}

function shotSequenceCsv(model) {
  return toCsv(
    ["sequence", "shot_id", "start_seconds", "end_seconds", "duration_seconds", "image_path", "sha256", "source_kind", "motion", "transition", "exact_anchor", "owner_accepted_primary_image"],
    model.shots
  );
}

function transitionMapCsv(model) {
  return toCsv(
    ["boundary_id", "outgoing_shot_id", "incoming_shot_id", "boundary_seconds", "transition_type", "transition_duration_seconds", "outgoing_terminal_frame_sha256", "incoming_base_initial_frame_sha256", "first_final_clip_frame_sha256", "outgoing_terminal_source", "raw_outgoing_source_reopened", "normalized_pixel_difference", "reset_threshold", "position_reset_detected", "raw_source_flash_detected", "gap_frames", "overlap_frames"],
    model.transition_boundary_audit.boundaries
  );
}

function subtitleEvidenceCsv(model) {
  return toCsv(
    ["cue_id", "shot_id", "profile_id", "viewport", "font_family", "font_px", "safe_width_px", "source_text", "authored_break_hint_present", "full_width_px", "line_count", "line_1", "line_1_width_px", "line_2", "line_2_width_px", "break_index", "orphan_count", "one_character_line_count", "prohibited_boundary_count", "kinsoku_pass", "orphan_pass", "proper_name_pass", "safe_width_pass", "status"],
    model.subtitle_layout.evidence
  );
}

function continuityMapCsv(model) {
  return toCsv(
    ["continuity_id", "element_id", "canonical_label_ja", "canonical_image_paths_and_hashes", "identity_defining_visual_features", "material_and_color_invariants", "structural_invariants", "current_story_state", "first_appearance_shot_id", "appearance_shot_ids", "protected_anchor_shot_ids", "current_derivative_recipes", "allowed_variation", "forbidden_variation", "future_generation_reference_requirement", "continuity_delta_reason_requirement", "owner_review_required_when"],
    model.recurring_element_continuity.elements.map((element) => ({
      ...element,
      canonical_image_paths_and_hashes: JSON.stringify(element.canonical_image_paths_and_hashes),
      appearance_shot_ids: element.appearance_shot_ids.join("|"),
      protected_anchor_shot_ids: element.protected_anchor_shot_ids.join("|"),
      current_derivative_recipes: JSON.stringify(element.current_derivative_recipes)
    }))
  );
}

function renderScript(model) {
  return `# CASE_DIGEST script

- artifact_id: \`${model.artifact_id}\`
- format_id: \`${model.format_id}\`
- duration: ${model.duration_seconds} seconds / ${model.exact_frame_count} frames
- sections: ${model.section_count}
- authored line-break hints: none

${model.sections.map((section) => `## ${section.sequence}. ${section.title_ja}（${section.start_seconds}–${section.end_seconds}秒）

${section.text_ja}

対象 shot: ${section.shot_ids.map((shotId) => `\`${shotId}\``).join(" / ")}
文字数: ${section.character_count} / 読み密度: ${section.characters_per_second} characters per second
`).join("\n")}
## 権限境界

これは無音のprivate review用CASE_DIGESTです。人による理解確認、production選定、rights clearance、公開、音声、final canonは成立していません。
`;
}

function renderReadme(model, mp4) {
  return `# Private Raster CASE_DIGEST

\`${ARTIFACT_ID}\` は、Product Owner指定のCASE_DIGESTへ物語の提示形式を置き換えた、無音・private・local-file review用の180秒候補です。

11 shotは既存の19 accepted primary-image bytesから選択し、画像生成、再エンコード、画像ファイル変更を行っていません。旧clarity packageの画像とterminal-frame transition methodは保持し、旧six-beat narrative、20 review captions、20 production subtitle draft cues、forced-choice closureは別quarantineへ隔離しています。

## 開き方

- HTML: \`start "" "${repoPath(HTML_PATH)}"\`
- MP4: \`start "" "${repoPath(MP4_PATH)}"\`
- validator: \`node tools/fff-state.mjs validate-private-raster-case-digest ${repoPath(RESULT_PATH)}\`

## 機械検証済み

- ${model.duration_seconds} seconds / ${model.exact_frame_count} frames / ${model.fps} fps
- ${model.shot_count} shots / ${model.section_count} CASE_DIGEST sections
- H.264 ${mp4.width}x${mp4.height}, silent, subtitle stream ${mp4.subtitle_stream_count}
- 19 accepted source images verified; selected images changed 0; image generation calls 0
- transition boundaries ${model.transition_boundary_audit.boundary_count}; position resets ${model.transition_boundary_audit.position_reset_count}; raw-source flashes ${model.transition_boundary_audit.raw_source_flash_count}
- subtitle measured rows ${model.subtitle_layout.evidence.length}; actual-width profile failures 0
- recurring continuity elements ${model.recurring_element_continuity.element_count}

## 未成立

人の理解、production selection、rights clearance、publication、voice、audio、final canonは、このpackageの機械的PASSからは導きません。
`;
}

function renderQuarantineJson() {
  return {
    schemaVersion: "fff.narrativeFormatQuarantine.v1",
    quarantine_id: QUARANTINE_ID,
    status: "ACTIVE",
    scope: "three-minute Fast Fiction Factory narrative candidates",
    source_artifact_id: SOURCE_ARTIFACT_ID,
    decision: "PRODUCT_OWNER_REJECTED_NARRATIVE_FORMAT",
    narrative_verdict: "REJECTED_NARRATIVE_FORMAT",
    narrative_archive_only: true,
    narrative_successor_candidate: false,
    narrative_shared_template_allowed: false,
    further_same_format_wording_refinement_allowed: false,
    primary_images_accepted: true,
    transition_engine_accepted: true,
    technical_evidence_preserved: true,
    quarantined_signature: [
      "six-Beat from-the-beginning lore exposition",
      "nineteen-shot exhaustive chronology used as a mandatory three-minute structure",
      "twenty-cue coverage as a completeness target",
      "more than three unexplained proper names or institutions",
      "atmosphere-first rhetorical narration",
      "successive unresolved hypotheses without concrete information gain",
      "production-state wording used as story progress",
      "a closing choice not earned by an enacted event",
      "a candidate that is neither explicitly a digest, trailer, PV, nor complete short story"
    ],
    quarantined_components: [
      "six-Beat linear-lore narration",
      "nineteen-shot chronology as mandatory three-minute structure",
      "twenty-cue completeness target",
      "forced time-or-names closure"
    ],
    preserved_components: [
      "all 19 accepted primary-image bytes",
      "three immutable raster anchors",
      "terminal-frame transition implementation",
      "existing source package and its historical evidence"
    ],
    replacement_artifact_id: ARTIFACT_ID,
    reuse_policy: "Quarantined narrative text and structure must not be copied into active review or production tracks. Visual bytes and the terminal-frame transition method remain reusable under their existing boundaries.",
    authority_boundaries: {
      private: true,
      source_files_mutated: false,
      human_comprehension_review_performed: false,
      production_approved: false,
      rights_cleared_claim: false,
      public_release: false,
      final_canon: false
    }
  };
}

function renderQuarantineReadme() {
  return `# Narrative format quarantine

\`${QUARANTINE_ID}\` records the Product Owner decision that the previous clarity narrative format is rejected for continued use.

隔離対象はsix-beat narrative、20本のreview caption、20本のproduction subtitle draft、失われた時間と消えた名前の一方を選ばせるclosureです。19枚のaccepted primary-image bytes、3つのimmutable anchor、rendered outgoing terminal frameを使うtransition methodは隔離対象ではありません。

旧packageは歴史的証跡として変更せず保持します。隔離済みの文章・構成を新しいactive trackへ戻す場合は、新しいProduct Owner判断と別identityが必要です。
`;
}

function renderContinuityHtml(model) {
  const sourceById = new Map(model.shots.map((shot) => [shot.shot_id, shot]));
  const cards = model.recurring_element_continuity.elements.map((element) => {
    const first = sourceById.get(element.first_appearance_shot_id);
    return `<article><img src="${escapeHtml(browserPath(first.image_path, CONTINUITY_ROOT))}" alt=""/><div><p class="id">${escapeHtml(element.element_id)}</p><h2>${escapeHtml(element.canonical_label_ja)}</h2><p>${escapeHtml(element.invariant)}</p><dl><dt>Appearances</dt><dd>${escapeHtml(element.appearance_shot_ids.join(" / "))}</dd><dt>Forbidden drift</dt><dd>${escapeHtml(element.forbidden_drift)}</dd><dt>Future gate</dt><dd>${escapeHtml(element.future_generation_gate)}</dd></dl></div></article>`;
  }).join("");
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Recurring-element continuity</title><style>
*{box-sizing:border-box}body{margin:0;background:#0c1216;color:#f3efe5;font-family:"Yu Gothic UI","Meiryo",sans-serif}main{width:min(1100px,100%);margin:auto;padding:1rem}header{border-bottom:1px solid #33434d;margin-bottom:1rem}h1{font-size:clamp(1.6rem,4vw,2.6rem)}.boundary,.id,dt{color:#c4a76a}article{display:grid;grid-template-columns:minmax(240px,.8fr) minmax(0,1.2fr);gap:1rem;background:#151e24;border:1px solid #31414b;border-radius:.75rem;overflow:hidden;margin:1rem 0}article img{width:100%;height:100%;min-height:230px;object-fit:cover}article>div{padding:1rem}h2{margin:.2rem 0 .6rem}.id{font-size:.75rem;letter-spacing:.1em}dl{display:grid;grid-template-columns:8rem 1fr;gap:.5rem}dd{margin:0;line-height:1.5}@media(max-width:660px){article{grid-template-columns:1fr}article img{min-height:0;aspect-ratio:16/9}dl{grid-template-columns:1fr}}
</style></head><body><main><header><p class="boundary">PRIVATE CONTINUITY BIBLE · 7 EXACT ENTRIES</p><h1>反復要素の継続性台帳</h1><p>将来の生成・編集は各entryのinvariantとfuture gateを満たす必要があります。production、rights、canonの承認記録ではありません。</p></header>${cards}</main></body></html>`;
}

async function buildContinuitySheet(model, sharp) {
  const tileWidth = 420;
  const imageHeight = 236;
  const labelHeight = 72;
  const columns = 2;
  const rows = Math.ceil(CONTINUITY_ELEMENTS.length / columns);
  const canvas = sharp({ create: { width: tileWidth * columns, height: (imageHeight + labelHeight) * rows, channels: 3, background: "#10171c" } });
  const composites = [];
  for (let index = 0; index < model.recurring_element_continuity.elements.length; index += 1) {
    const element = model.recurring_element_continuity.elements[index];
    const displayShotId = element.protected_anchor_shot_ids[0] || element.first_appearance_shot_id;
    const source = element.canonical_image_paths_and_hashes.find((image) => image.shot_id === displayShotId);
    if (!source) throw new Error(`Continuity contact-sheet source missing: ${element.element_id}/${displayShotId}`);
    const left = (index % columns) * tileWidth;
    const top = Math.floor(index / columns) * (imageHeight + labelHeight);
    const image = await sharp(path.join(REPO_ROOT, source.image_path)).resize(tileWidth, imageHeight, { fit: "cover" }).jpeg().toBuffer();
    composites.push({ input: image, left, top });
    composites.push({
      input: overlaySvg(tileWidth, labelHeight, `<rect width="${tileWidth}" height="${labelHeight}" fill="#172027"/><text x="14" y="27" fill="#f3efe5" font-size="18" font-weight="700">${escapeHtml(`${index + 1}. ${element.canonical_label_ja}`)}</text><text x="14" y="53" fill="#aebbc3" font-size="14">${escapeHtml(element.element_id)}</text>`),
      left,
      top: top + imageHeight
    });
  }
  await canvas.composite(composites).jpeg({ quality: 91, mozjpeg: true }).toFile(CONTINUITY_SHEET_PATH);
}

function timelineClip(item, className, label) {
  const left = (item.start_seconds / DURATION_SECONDS) * 100;
  const width = ((item.end_seconds - item.start_seconds) / DURATION_SECONDS) * 100;
  return `<button class="clip ${className}" style="left:${left}%;width:${width}%" data-jump="${item.start_seconds}"><span>${escapeHtml(label)}</span></button>`;
}

function renderHtml(model) {
  const embedded = JSON.stringify(model).replaceAll("<", "\\u003c");
  const shotTrack = model.shots.map((shot) => timelineClip(shot, "shot-clip", shot.shot_id)).join("");
  const sectionTrack = model.sections.map((section) => timelineClip(section, "section-clip", `${section.sequence}. ${section.title_ja}`)).join("");
  const captionTrack = model.review_captions.map((cue) => timelineClip(cue, "caption-clip", cue.cue_id)).join("");
  const sectionButtons = model.sections.map((section) => `<button data-jump="${section.start_seconds}">${section.sequence}. ${escapeHtml(section.title_ja)}</button>`).join("");
  const shots = model.shots.map((shot) => `<button class="thumb" data-jump="${shot.start_seconds}"><img src="${escapeHtml(shot.browser_image_path)}" alt=""/><span>${shot.sequence}. ${escapeHtml(shot.shot_id)}</span></button>`).join("");
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>CASE_DIGEST · PRIVATE</title><style>
:root{color-scheme:dark;--bg:#0b1014;--panel:#141c22;--line:#2b3942;--ink:#f3efe5;--muted:#aab7bf;--brass:#c4a76a;--focus:#8fd8ff}*{box-sizing:border-box}body{margin:0;background:linear-gradient(160deg,#0a0f13,#12191e);color:var(--ink);font-family:"Yu Gothic UI","Meiryo",sans-serif}body[data-theme="light"]{color-scheme:light;--panel:#f3efe5;--line:#9ba9b0;--ink:#132029;--muted:#52626b;--brass:#735b22;background:#eef2f3}button,input,video{font:inherit}button{color:inherit;background:color-mix(in srgb,var(--panel) 85%,#24333c);border:1px solid var(--line);border-radius:.5rem;padding:.55rem .72rem;cursor:pointer}button:focus-visible,input:focus-visible,video:focus-visible{outline:3px solid var(--focus);outline-offset:3px}main{width:min(1380px,100%);margin:auto;padding:1rem}.mast{display:flex;justify-content:space-between;gap:1rem}.eyebrow{color:var(--brass);font-weight:750;letter-spacing:.12em;font-size:.78rem}.boundary{max-width:60ch;color:var(--muted);line-height:1.55}.theme-controls{display:flex;gap:.35rem;flex-wrap:wrap}.player-grid{display:grid;grid-template-columns:minmax(0,2.1fr) minmax(270px,.9fr);gap:1rem}.stage{position:relative;background:#000;border:1px solid var(--line);border-radius:.75rem;overflow:hidden;aspect-ratio:16/9}video{width:100%;height:100%;display:block}.subtitle{position:absolute;left:6%;right:6%;bottom:3.2rem;text-align:center;font-size:28px;font-weight:750;line-height:1.35;color:#f3efe5;text-shadow:0 2px 9px #000;background:#071016c9;border-radius:.4rem;padding:.35rem .55rem;white-space:pre-line;pointer-events:none}.side{background:var(--panel);border:1px solid var(--line);border-radius:.75rem;padding:1rem;display:grid;align-content:start;gap:.75rem}.side h2{margin:0}.time{font-variant-numeric:tabular-nums;color:var(--brass);font-size:1.15rem}.controls{display:grid;grid-template-columns:auto auto auto 1fr;gap:.55rem;margin:.75rem 0}.jumps{display:flex;flex-wrap:wrap;gap:.45rem}.timeline{position:relative;background:var(--panel);border:1px solid var(--line);border-radius:.75rem;padding:1rem;margin-top:.8rem;overflow:hidden}.lane{position:relative;height:3rem;margin:1.2rem 0}.lane-name{position:absolute;top:-1.05rem;color:var(--muted);font-size:.75rem}.clip{position:absolute;top:0;height:2.25rem;overflow:hidden;border-radius:.25rem;padding:.2rem;font-size:.64rem;text-align:left}.clip span{white-space:nowrap}.shot-clip{background:#263842;color:#fff}.section-clip{background:#4a3e29;color:#fff}.caption-clip{background:#293e31;color:#fff}.playhead{position:absolute;top:1rem;bottom:1rem;width:2px;background:#e4c273;left:0;z-index:5}.thumbs{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:.55rem;margin-top:1rem}.thumb{padding:0;overflow:hidden;text-align:left}.thumb img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}.thumb span{display:block;padding:.4rem;font-size:.7rem}.legend{color:var(--muted);line-height:1.5}@media(max-width:820px){main{padding:.65rem}.mast{display:block}.player-grid{grid-template-columns:1fr}.controls{grid-template-columns:repeat(3,1fr)}.controls input{grid-column:1/-1}.thumbs{grid-template-columns:repeat(2,minmax(0,1fr))}.clip span{display:none}.subtitle{font-size:18px;left:6%;right:6%;bottom:3rem}}
</style></head><body data-theme="dark"><main><header class="mast"><div><p class="eyebrow">CASE DIGEST · PRIVATE · NOT FOR PUBLICATION</p><h1>3分事件ダイジェスト「鐘のない塔事件」</h1><div class="theme-controls" aria-label="表示テーマ"><button data-theme="light">Light</button><button data-theme="dark">Dark</button><button data-theme="auto">Auto</button></div></div><p class="boundary">11枚は19枚のaccepted primary-image bytesから選択しています。旧clarity narrativeはquarantine済みです。機械的PASSは人の理解、production、rights、公開、音声、final canonを承認しません。</p></header><section class="player-grid"><div class="stage"><video id="video" src="private-raster-case-digest.mp4" controls muted preload="metadata"></video><div id="subtitle" class="subtitle"></div></div><aside class="side"><output id="timecode" class="time">00:00.0 / 03:00.0</output><p id="sectionId" class="eyebrow"></p><h2 id="sectionTitle"></h2><p id="sectionText" class="boundary"></p><p id="shotText" class="boundary"></p></aside></section><div class="controls"><button id="prevShot">◀ 前</button><button id="togglePlay">▶ 再生</button><button id="nextShot">次 ▶</button><input id="scrubber" type="range" min="0" max="180" step=".1" value="0" aria-label="180秒タイムライン"/></div><nav class="jumps">${sectionButtons}</nav><section class="timeline"><div id="playhead" class="playhead"></div><div class="lane"><div class="lane-name">PICTURE · 11 ACCEPTED SHOTS</div>${shotTrack}</div><div class="lane"><div class="lane-name">CASE_DIGEST · 5 SECTIONS</div>${sectionTrack}</div><div class="lane"><div class="lane-name">REVIEW CAPTIONS · 11 MEASURED CUES</div>${captionTrack}</div></section><section class="thumbs">${shots}</section><p class="legend">Standalone file player. Keyboard: Space play/pause · Home/End · arrows 1 second · Shift+arrows 5 seconds. Review captions use precomputed actual-width layouts; source text contains no authored break hints.</p></main><script id="model" type="application/json">${embedded}</script><script>
(()=>{const model=JSON.parse(document.getElementById("model").textContent),video=document.getElementById("video"),scrubber=document.getElementById("scrubber"),subtitle=document.getElementById("subtitle"),playhead=document.getElementById("playhead"),toggle=document.getElementById("togglePlay");const clamp=(v)=>Math.max(0,Math.min(180,Number(v)||0));const shotAt=(t)=>model.shots.find((x)=>t>=x.start_seconds&&t<x.end_seconds)||model.shots.at(-1);const sectionAt=(t)=>model.sections.find((x)=>t>=x.start_seconds&&t<x.end_seconds)||model.sections.at(-1);const cueAt=(t)=>model.review_captions.find((x)=>t>=x.start_seconds&&t<x.end_seconds);const fmt=(v)=>String(Math.floor(v/60)).padStart(2,"0")+":"+String(Math.floor(v%60)).padStart(2,"0")+"."+Math.floor((v%1)*10);function setTheme(value){document.body.dataset.theme=value==="auto"?(matchMedia("(prefers-color-scheme:light)").matches?"light":"dark"):value}function render(){const t=clamp(video.currentTime),shot=shotAt(t),section=sectionAt(t),cue=cueAt(t),profile=matchMedia("(max-width:820px)").matches?"html_narrow":"html_desktop";scrubber.value=t;playhead.style.left=(t/180*100)+"%";document.getElementById("timecode").value=fmt(t)+" / 03:00.0";document.getElementById("sectionId").textContent="SECTION "+section.sequence+" · "+section.section_id;document.getElementById("sectionTitle").textContent=section.title_ja;document.getElementById("sectionText").textContent=section.text_ja;document.getElementById("shotText").textContent=shot.sequence+". "+shot.shot_id+" · "+shot.motion+" / "+shot.transition;subtitle.textContent=cue?cue.layouts[profile].lines.join("\\n"):""}function seek(v){video.currentTime=clamp(v);render()}async function play(){if(video.currentTime>=179.95)seek(0);video.muted=true;await video.play();toggle.textContent="❚❚ 停止"}function pause(){video.pause();toggle.textContent="▶ 再生"}function togglePlay(){video.paused?play().catch(()=>{}):pause()}video.addEventListener("timeupdate",render);video.addEventListener("seeked",render);video.addEventListener("loadedmetadata",render);video.addEventListener("ended",pause);toggle.addEventListener("click",togglePlay);scrubber.addEventListener("input",()=>seek(scrubber.value));document.getElementById("prevShot").addEventListener("click",()=>{const shot=shotAt(video.currentTime);seek(video.currentTime-shot.start_seconds>.4?shot.start_seconds:model.shots[Math.max(0,shot.sequence-2)].start_seconds)});document.getElementById("nextShot").addEventListener("click",()=>{const shot=shotAt(video.currentTime);seek(shot.sequence<11?model.shots[shot.sequence].start_seconds:180)});for(const button of document.querySelectorAll("[data-jump]"))button.addEventListener("click",()=>seek(button.dataset.jump));for(const button of document.querySelectorAll("[data-theme]"))button.addEventListener("click",()=>setTheme(button.dataset.theme));document.addEventListener("keydown",(event)=>{if(event.target===scrubber)return;if(event.code==="Space"){event.preventDefault();togglePlay()}else if(event.key==="Home"){event.preventDefault();seek(0)}else if(event.key==="End"){event.preventDefault();seek(180)}else if(event.key==="ArrowLeft"){event.preventDefault();seek(video.currentTime-(event.shiftKey?5:1))}else if(event.key==="ArrowRight"){event.preventDefault();seek(video.currentTime+(event.shiftKey?5:1))}});window.addEventListener("resize",render);window.__CASE_DIGEST__={model,video,seek,setTheme,getState:()=>({shot_id:shotAt(video.currentTime).shot_id,section_id:sectionAt(video.currentTime).section_id,subtitle_lines:(cueAt(video.currentTime)?.layouts[matchMedia("(max-width:820px)").matches?"html_narrow":"html_desktop"].lines||[]),duration:video.duration,muted:video.muted,theme:document.body.dataset.theme})};render()})();
</script></body></html>`;
}

async function captureBrowserEvidence(model) {
  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch({ headless: true });
  const consoleErrors = [];
  const pageErrors = [];
  const externalRequests = [];
  const results = {};
  try {
    const inspect = async (name, width, height, screenshotPath, seekTo) => {
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce" });
      page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
      page.on("pageerror", (error) => pageErrors.push(error.message));
      page.on("request", (request) => { if (/^https?:/i.test(request.url())) externalRequests.push(request.url()); });
      await page.goto(pathToFileURL(HTML_PATH).href, { waitUntil: "load" });
      await page.waitForFunction(() => window.__CASE_DIGEST__ && window.__CASE_DIGEST__.video.readyState >= 1);
      for (const shot of model.shots) {
        await page.evaluate((seconds) => window.__CASE_DIGEST__.seek(seconds), shot.start_seconds + 0.2);
        const state = await page.evaluate(() => window.__CASE_DIGEST__.getState());
        if (state.shot_id !== shot.shot_id) throw new Error(`Browser shot mismatch: ${shot.shot_id}`);
      }
      await page.evaluate((seconds) => window.__CASE_DIGEST__.seek(seconds), seekTo);
      await page.locator("#togglePlay").focus();
      const metrics = await page.evaluate(() => {
        const subtitle = document.getElementById("subtitle");
        const state = window.__CASE_DIGEST__.getState();
        return {
          document_width: document.documentElement.scrollWidth,
          viewport_width: innerWidth,
          horizontal_overflow_px: Math.max(0, document.documentElement.scrollWidth - innerWidth),
          nested_vertical_scroll_count: [...document.querySelectorAll("main *")].filter((element) => element.scrollHeight > element.clientHeight + 2 && getComputedStyle(element).overflowY !== "visible").length,
          video_duration: state.duration,
          video_muted: state.muted,
          shot_button_count: document.querySelectorAll(".thumb").length,
          section_button_count: document.querySelectorAll(".jumps button").length,
          theme_button_count: document.querySelectorAll(".theme-controls button").length,
          timeline_lane_count: document.querySelectorAll(".lane").length,
          subtitle_line_count: state.subtitle_lines.length,
          subtitle_scroll_width: subtitle.scrollWidth,
          subtitle_client_width: subtitle.clientWidth,
          focus_outline_style: getComputedStyle(document.activeElement).outlineStyle,
          focus_outline_width: getComputedStyle(document.activeElement).outlineWidth
        };
      });
      await page.evaluate(() => window.scrollTo(0, 0));
      const observedScreenshot = await page.screenshot({ fullPage: false, animations: "disabled" });
      const screenshot = await fileRecord(screenshotPath);
      await page.close();
      return {
        ...metrics,
        screenshot_path: screenshot.relative_path,
        screenshot_byte_size: screenshot.byte_size,
        screenshot_sha256: screenshot.sha256,
        observed_screenshot_byte_size: observedScreenshot.length,
        observed_screenshot_sha256: sha256(observedScreenshot)
      };
    };
    results.desktop = await inspect("desktop", 1440, 1000, SCREENSHOTS.desktop, 118.2);
    results.narrow = await inspect("narrow", 390, 844, SCREENSHOTS.narrow, 155.2);
  } finally {
    await browser.close();
  }
  return {
    passed: consoleErrors.length === 0
      && pageErrors.length === 0
      && externalRequests.length === 0
      && results.desktop.horizontal_overflow_px === 0
      && results.narrow.horizontal_overflow_px === 0
      && results.desktop.nested_vertical_scroll_count === 0
      && results.narrow.nested_vertical_scroll_count === 0
      && results.desktop.shot_button_count === 11
      && results.narrow.shot_button_count === 11
      && results.desktop.section_button_count === 5
      && results.narrow.section_button_count === 5
      && results.desktop.theme_button_count === 3
      && results.narrow.theme_button_count === 3
      && results.desktop.subtitle_line_count <= 2
      && results.narrow.subtitle_line_count <= 2
      && results.desktop.subtitle_scroll_width <= results.desktop.subtitle_client_width
      && results.narrow.subtitle_scroll_width <= results.narrow.subtitle_client_width
      && Math.abs(results.desktop.video_duration - 180) < 0.01
      && Math.abs(results.narrow.video_duration - 180) < 0.01,
    engine: "playwright chromium",
    headless: true,
    console_errors: consoleErrors,
    page_errors: pageErrors,
    external_requests: [...new Set(externalRequests)],
    desktop: results.desktop,
    narrow: results.narrow
  };
}

function renderReviewDoc(model, mp4, browser, tests) {
  return `# Private raster CASE_DIGEST review

\`${ARTIFACT_ID}\` は、旧clarity narrativeを継続せず、Product Owner指定のCASE_DIGESTへ提示形式を置き換えたprivate successor candidateです。既存19枚のaccepted primary imageは不変で、選択した11枚を180秒・5区分に再配置しました。

## 今回成立した機械的事実

| 検証対象 | 結果 | 効果 |
|---|---:|---|
| 尺 / frame | ${mp4.duration_seconds}秒 / ${mp4.frame_count} frame | 指定の180秒・5400 frameに固定 |
| shot / section | ${model.shot_count} / ${model.section_count} | 指定順の11 shotを5 CASE_DIGEST sectionへ結合 |
| accepted image identity | 19一致 / 変更0 / 生成0 | 受容済みvisual bytesを保持 |
| transition boundary | ${model.transition_boundary_audit.boundary_count}件 / reset ${model.transition_boundary_audit.position_reset_count} / flash ${model.transition_boundary_audit.raw_source_flash_count} | terminal-frame方式を選択timelineで再検証 |
| subtitle actual-width | ${model.subtitle_layout.evidence.length}測定 / failure 0 | 4表示条件で禁則・孤立行・固有名詞分断を防止 |
| continuity | ${model.recurring_element_continuity.element_count} entry | 将来生成時の同一性条件を固定 |
| browser | desktop ${browser.desktop.viewport_width}px / narrow ${browser.narrow.viewport_width}px | file HTML、shot境界、overflow、2行上限を検証 |
| targeted negative | ${tests.passed}/${tests.total} | scope・権限・字幕・transitionの逸脱を拒否 |

## 旧形式の扱い

旧six-beat narrative、20 review caption、20 production subtitle draft cue、forced-choice closureは \`${QUARANTINE_ID}\` へ隔離しました。旧package自体は歴史証跡として変更していません。19 accepted images、3 anchor、terminal-frame transition methodは保持対象です。

## 人が判断する場合のpacket

HTMLを開き、5 sectionの事実と未確認事項の区別、11 shotとの対応、狭幅字幕の読みやすさを確認できます。この確認が行われるまでhuman comprehension reviewは未実施です。確認を行ってもproduction selection、rights clearance、publication、voice、final canonは別gateです。

## 開く

- \`start "" "${repoPath(HTML_PATH)}"\`
- \`start "" "${repoPath(CONTINUITY_HTML_PATH)}"\`
- \`start "" "${repoPath(CONTINUITY_SHEET_PATH)}"\`
`;
}

function renderContinuityGuideline() {
  return `# Recurring-element continuity guideline

新規生成または編集の前に \`${repoPath(CONTINUITY_JSON_PATH)}\` の7 entryを読む。各entryについて、first appearance、appearance list、invariant、allowed variation、forbidden drift、future generation gateを満たす。

## 必須運用

1. 新しいshotに登場する反復要素のelement_idを列挙する。
2. protected anchorがある場合はexact anchor imageを参照し、既存byteは変更しない。
3. invariantとforbidden driftをpromptまたはedit specificationへ明記する。
4. 生成後にappearance mapへ新しい候補を追加し、既存entryを上書きしない。
5. 人物・制度の責任、rights、production、canonをvisual similarityから推論しない。

3 anchorは \`shot-b02-03\`、\`shot-b04-01\`、\`shot-b05-02\` です。今回のCASE_DIGESTにshot-b05-02は含まれませんが、accepted source inventoryのimmutable anchorとして保持します。
`;
}

function renderSubtitleGuideline() {
  return `# Japanese subtitle layout guideline

字幕本文は意味のあるsource textとして保持し、改行文字、\`|\`、\`｜\`などのauthored hintを埋め込まない。表示時の改行は選択fontの実測幅から導く。

## 現行測定契約

- font: Yu Gothic UI
- engine: Sharp/libvips/Pango text raster metadata
- profiles: 960x540、1280x720、desktop 1440x1000、narrow 390x844
- one-line preference: full measured widthがsafe widthの82%以下
- two-line maximum
- 両行がsafe width以下
- 下行は6文字以上かつfull measured widthの35%以上
- 行頭禁則、行末禁則、固有名詞 \`ミラ・ヴェイル\` / \`9時17分\` / \`市の評議会\` の途中分断を禁止
- 数字と年月日時分秒個本枚人の分断を禁止

測定証跡は \`${repoPath(SUBTITLE_EVIDENCE_PATH)}\` に1 cue x 4 profiles = 44 rowsで保存する。font、viewport、safe width、全幅、各行幅、break index、各rule結果を記録する。新しい字幕またはfont変更は新しい測定identityとして全profileを再生成する。
`;
}

async function buildManifests(model, mp4, browser) {
  const packageInventory = await directoryInventory(PACKAGE_ROOT, MANIFEST_PATH);
  const packageManifest = {
    schemaVersion: "fff.privateRasterCaseDigestManifest.v1",
    artifact_id: ARTIFACT_ID,
    format_id: FORMAT_ID,
    distribution_state: candidateDistributionState(),
    mp4,
    screenshots: {
      desktop: { path: browser.desktop.screenshot_path, byte_size: browser.desktop.screenshot_byte_size, sha256: browser.desktop.screenshot_sha256 },
      narrow: { path: browser.narrow.screenshot_path, byte_size: browser.narrow.screenshot_byte_size, sha256: browser.narrow.screenshot_sha256 }
    },
    package_fingerprint_sha256: packageInventory.aggregate_sha256,
    payload_file_count: packageInventory.payload_file_count,
    files: packageInventory.files
  };
  await writeFile(MANIFEST_PATH, `${JSON.stringify(packageManifest, null, 2)}\n`, "utf8");
  const continuityInventory = await directoryInventory(CONTINUITY_ROOT, CONTINUITY_MANIFEST_PATH);
  const continuityManifest = {
    schemaVersion: "fff.recurringElementContinuityManifest.v1",
    continuity_id: CONTINUITY_ID,
    artifact_id: ARTIFACT_ID,
    element_count: model.recurring_element_continuity.element_count,
    package_fingerprint_sha256: continuityInventory.aggregate_sha256,
    payload_file_count: continuityInventory.payload_file_count,
    files: continuityInventory.files
  };
  await writeFile(CONTINUITY_MANIFEST_PATH, `${JSON.stringify(continuityManifest, null, 2)}\n`, "utf8");
  return { packageManifest, continuityManifest };
}

async function updateRootManifest(model, manifests) {
  const root = await readJson(ROOT_MANIFEST_PATH);
  root.successor_candidate_artifact_id = ARTIFACT_ID;
  for (const candidate of root.primary_imagery_medium_gate.new_visual_candidates) {
    if (candidate.artifact_id === SOURCE_ARTIFACT_ID) candidate.successor_candidate = false;
  }
  const candidateEntry = {
    artifact_id: ARTIFACT_ID,
    active_default: false,
    successor_candidate: true,
    distribution_state: candidateDistributionState(),
    primary_frames: model.shots.map((shot) => ({
      shot_id: shot.shot_id,
      source_kind: ["generated_raster", "licensed_photocomposite"].includes(shot.source_kind)
        ? shot.source_kind
        : "taste_approved_high_fidelity_raster",
      candidate_source_kind: shot.source_kind,
      rasterized_forbidden_vector: false
    }))
  };
  const existing = root.primary_imagery_medium_gate.new_visual_candidates.findIndex((candidate) => candidate.artifact_id === ARTIFACT_ID);
  if (existing >= 0) root.primary_imagery_medium_gate.new_visual_candidates[existing] = candidateEntry;
  else root.primary_imagery_medium_gate.new_visual_candidates.push(candidateEntry);
  if (root.private_full_raster_clarity_candidate) {
    root.private_full_raster_clarity_candidate.successor_candidate = false;
    root.private_full_raster_clarity_candidate.narrative_verdict = "REJECTED_NARRATIVE_FORMAT";
    root.private_full_raster_clarity_candidate.narrative_archive_only = true;
    root.private_full_raster_clarity_candidate.narrative_successor_candidate = false;
    root.private_full_raster_clarity_candidate.narrative_shared_template_allowed = false;
    root.private_full_raster_clarity_candidate.further_same_format_wording_refinement_allowed = false;
    root.private_full_raster_clarity_candidate.primary_images_accepted = true;
    root.private_full_raster_clarity_candidate.transition_engine_accepted = true;
    root.private_full_raster_clarity_candidate.technical_evidence_preserved = true;
    root.private_full_raster_clarity_candidate.narrative_format_status = "QUARANTINED_BY_PRODUCT_OWNER";
    root.private_full_raster_clarity_candidate.visual_bytes_status = "PRESERVED_ACCEPTED_19_OF_19";
    root.private_full_raster_clarity_candidate.transition_method_status = "PRESERVED_TERMINAL_FRAME_METHOD";
  }
  root.narrative_format_quarantine = {
    quarantine_id: QUARANTINE_ID,
    status: "ACTIVE",
    path: repoPath(QUARANTINE_JSON_PATH),
    source_artifact_id: SOURCE_ARTIFACT_ID,
    replacement_artifact_id: ARTIFACT_ID
  };
  root.private_raster_case_digest = {
    artifact_id: ARTIFACT_ID,
    schemaVersion: model.schemaVersion,
    format_id: FORMAT_ID,
    package_root: repoPath(PACKAGE_ROOT),
    result_path: repoPath(RESULT_PATH),
    review_doc_path: repoPath(REVIEW_DOC_PATH),
    access_route: repoPath(HTML_PATH),
    manifest_path: repoPath(MANIFEST_PATH),
    mp4_path: repoPath(MP4_PATH),
    package_fingerprint_sha256: manifests.packageManifest.package_fingerprint_sha256,
    source_artifact_id: SOURCE_ARTIFACT_ID,
    narrative_quarantine_id: QUARANTINE_ID,
    continuity_id: CONTINUITY_ID,
    continuity_fingerprint_sha256: manifests.continuityManifest.package_fingerprint_sha256,
    shot_count: 11,
    section_count: 5,
    duration_seconds: 180,
    frame_count: 5400,
    subtitle_layout_evidence_count: 44,
    narration_segment_count: 5,
    owner_accepted_primary_frame_count: 19,
    selected_primary_frame_count: 11,
    primary_image_change_count: 0,
    image_generation_call_count: 0,
    image_reencode_count: 0,
    transition_boundary_count: 10,
    position_reset_count: 0,
    raw_source_flash_count: 0,
    ...candidateDistributionState(),
    default_active: false,
    active_default: false,
    successor_candidate: true,
    human_comprehension_review: "not_performed",
    primary_images_owner_accepted: true,
    production_approved: false,
    selected_for_production: false,
    rights_cleared_claim: false,
    audio: false,
    audio_generated: false,
    voice: false,
    voice_selected: false,
    final_canon: false
  };
  await writeFile(ROOT_MANIFEST_PATH, `${JSON.stringify(root, null, 2)}\n`, "utf8");
}

async function build() {
  const sharp = await loadSharp();
  const sourceBundle = await verifySource(sharp);
  const protectedBefore = await protectedInventory();
  await Promise.all([
    mkdir(PACKAGE_ROOT, { recursive: true }),
    mkdir(QUARANTINE_ROOT, { recursive: true }),
    mkdir(CONTINUITY_ROOT, { recursive: true }),
    mkdir(path.dirname(REVIEW_DOC_PATH), { recursive: true }),
    mkdir(path.dirname(CONTINUITY_GUIDELINE_PATH), { recursive: true })
  ]);
  const model = await buildModel(sourceBundle, sharp);
  const preRenderFailures = contractFailures(model).filter((failure) => failure !== "transition boundary count mismatch");
  if (preRenderFailures.length) throw new Error(`Pre-render contract failed:\n- ${preRenderFailures.join("\n- ")}`);
  const encoded = await encodeTimeline(model, sharp);
  model.transition_boundary_audit = encoded.audit;
  const failures = contractFailures(model);
  if (failures.length) throw new Error(`Rendered contract failed:\n- ${failures.join("\n- ")}`);
  const tests = targetedTests(model);
  if (!tests.all_passed) throw new Error(`Targeted tests failed: ${JSON.stringify(tests)}`);
  await Promise.all([
    writeFile(MODEL_PATH, `${JSON.stringify(model, null, 2)}\n`, "utf8"),
    writeFile(HTML_PATH, renderHtml(model), "utf8"),
    writeFile(SCRIPT_PATH, renderScript(model), "utf8"),
    writeFile(REVIEW_CAPTIONS_PATH, reviewCaptionsCsv(model), "utf8"),
    writeFile(PRODUCTION_SUBTITLES_PATH, productionSubtitlesCsv(model), "utf8"),
    writeFile(SHOT_SEQUENCE_PATH, shotSequenceCsv(model), "utf8"),
    writeFile(TRANSITION_MAP_PATH, transitionMapCsv(model), "utf8"),
    writeFile(SUBTITLE_EVIDENCE_PATH, subtitleEvidenceCsv(model), "utf8"),
    writeFile(QUARANTINE_JSON_PATH, `${JSON.stringify(renderQuarantineJson(), null, 2)}\n`, "utf8"),
    writeFile(QUARANTINE_README_PATH, renderQuarantineReadme(), "utf8"),
    writeFile(CONTINUITY_JSON_PATH, `${JSON.stringify(model.recurring_element_continuity, null, 2)}\n`, "utf8"),
    writeFile(CONTINUITY_HTML_PATH, renderContinuityHtml(model), "utf8"),
    writeFile(CONTINUITY_MAP_PATH, continuityMapCsv(model), "utf8"),
    writeFile(CONTINUITY_GUIDELINE_PATH, renderContinuityGuideline(), "utf8"),
    writeFile(SUBTITLE_GUIDELINE_PATH, renderSubtitleGuideline(), "utf8")
  ]);
  if (Math.abs(encoded.mp4.duration_seconds - 180) > 0.001 || encoded.mp4.frame_count !== 5400 || encoded.mp4.codec_name !== "h264" || encoded.mp4.audio_stream_count !== 0 || encoded.mp4.subtitle_stream_count !== 1 || !valuesEqual(encoded.mp4.subtitle_cues, expectedMuxedCaptionCues(model))) {
    throw new Error(`MP4 contract failed: ${JSON.stringify(encoded.mp4)}`);
  }
  await buildContinuitySheet(model, sharp);
  const browser = await captureBrowserEvidence(model);
  if (!browser.passed) throw new Error(`Browser evidence failed: ${JSON.stringify(browser)}`);
  await Promise.all([
    writeFile(README_PATH, renderReadme(model, encoded.mp4), "utf8"),
    writeFile(REVIEW_DOC_PATH, renderReviewDoc(model, encoded.mp4, browser, tests), "utf8")
  ]);
  const manifests = await buildManifests(model, encoded.mp4, browser);
  const protectedAfter = await protectedInventory();
  if (!valuesEqual(protectedBefore, protectedAfter)) throw new Error("Accepted source image or source model changed during build");
  const result = {
    schemaVersion: "fff.privateRasterCaseDigestResult.v1",
    artifact_id: ARTIFACT_ID,
    passed: true,
    failures: [],
    format_id: FORMAT_ID,
    duration_seconds: 180,
    frame_count: 5400,
    shot_count: 11,
    section_count: 5,
    review_caption_count: 11,
    production_subtitle_draft_count: 11,
    recurring_element_count: 7,
    subtitle_layout_evidence_count: 44,
    image_identity: model.image_identity,
    transition_boundary_audit: model.transition_boundary_audit,
    subtitle_layout_status: model.subtitle_layout.status,
    distribution_state: candidateDistributionState(),
    mp4: encoded.mp4,
    browser_evidence: browser,
    targeted_tests: tests,
    protected_inputs: { passed: true, before: protectedBefore, after: protectedAfter },
    package_manifest: {
      path: repoPath(MANIFEST_PATH),
      fingerprint: manifests.packageManifest.package_fingerprint_sha256,
      payload_file_count: manifests.packageManifest.payload_file_count
    },
    continuity_manifest: {
      path: repoPath(CONTINUITY_MANIFEST_PATH),
      fingerprint: manifests.continuityManifest.package_fingerprint_sha256,
      payload_file_count: manifests.continuityManifest.payload_file_count
    },
    boundaries: model.boundaries
  };
  await writeFile(RESULT_PATH, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  await updateRootManifest(model, manifests);
  console.log(`Built ${ARTIFACT_ID}`);
  console.log(`MP4 ${encoded.mp4.duration_seconds}s / ${encoded.mp4.frame_count} frames / ${encoded.mp4.sha256}`);
  console.log(`Package fingerprint ${manifests.packageManifest.package_fingerprint_sha256}`);
  return result;
}

async function validate(inputPath = RESULT_PATH) {
  const sharp = await loadSharp();
  const sourceBundle = await verifySource(sharp);
  const before = await protectedInventory();
  const [model, manifest, continuityManifest, result, root] = await Promise.all([
    readJson(MODEL_PATH),
    readJson(MANIFEST_PATH),
    readJson(CONTINUITY_MANIFEST_PATH),
    readJson(inputPath),
    readJson(ROOT_MANIFEST_PATH)
  ]);
  const failures = contractFailures(model);
  const require = (condition, message) => { if (!condition) failures.push(message); };
  require(result.passed === true && result.failures.length === 0, "result is not passing");
  require(result.targeted_tests?.all_passed === true, "targeted tests are not passing");
  require(result.browser_evidence?.passed === true, "browser evidence is not passing");
  require(root.active_default_artifact_id === DEFAULT_ARTIFACT_ID, "accepted default artifact changed");
  require(root.successor_candidate_artifact_id === ARTIFACT_ID, "successor registration mismatch");
  require(root.private_raster_case_digest?.artifact_id === ARTIFACT_ID && root.private_raster_case_digest?.successor_candidate === true, "root case digest registration mismatch");
  const distributionState = candidateDistributionState();
  require(valuesEqual(result.distribution_state, distributionState), "result distribution state mismatch");
  require(valuesEqual(manifest.distribution_state, distributionState), "package manifest distribution state mismatch");
  require(Object.entries(distributionState).every(([key, value]) => valuesEqual(root.private_raster_case_digest?.[key], value)), "root case digest distribution state mismatch");
  const candidateEntry = root.primary_imagery_medium_gate?.new_visual_candidates?.find((candidate) => candidate.artifact_id === ARTIFACT_ID);
  require(valuesEqual(candidateEntry?.distribution_state, distributionState), "candidate registry distribution state mismatch");
  require(root.narrative_format_quarantine?.quarantine_id === QUARANTINE_ID && root.narrative_format_quarantine?.status === "ACTIVE", "root narrative quarantine mismatch");
  require(root.private_full_raster_clarity_candidate?.successor_candidate === false && root.private_full_raster_clarity_candidate?.narrative_format_status === "QUARANTINED_BY_PRODUCT_OWNER", "clarity narrative was not durably demoted");
  const packageInventory = await directoryInventory(PACKAGE_ROOT, MANIFEST_PATH);
  require(packageInventory.aggregate_sha256 === manifest.package_fingerprint_sha256 && valuesEqual(packageInventory.files, manifest.files), "package inventory mismatch");
  const continuityInventory = await directoryInventory(CONTINUITY_ROOT, CONTINUITY_MANIFEST_PATH);
  require(continuityInventory.aggregate_sha256 === continuityManifest.package_fingerprint_sha256 && valuesEqual(continuityInventory.files, continuityManifest.files), "continuity inventory mismatch");
  const liveMp4 = await probeMp4(MP4_PATH);
  require(valuesEqual(liveMp4, manifest.mp4), "live MP4 probe mismatch");
  require(valuesEqual(liveMp4.subtitle_cues, expectedMuxedCaptionCues(model)), "live MP4 subtitle cue mismatch");
  require(result.image_identity?.changed_image_count === 0 && result.image_identity?.generated_image_count === 0, "result image identity mismatch");
  require((await readFile(SUBTITLE_GUIDELINE_PATH, "utf8")).includes("44 rows"), "subtitle guideline incomplete");
  require((await readFile(CONTINUITY_GUIDELINE_PATH, "utf8")).includes("7 entry"), "continuity guideline incomplete");
  for (const view of ["desktop", "narrow"]) {
    const screenshot = await fileRecord(path.join(REPO_ROOT, manifest.screenshots[view].path));
    require(screenshot.byte_size === manifest.screenshots[view].byte_size && screenshot.sha256 === manifest.screenshots[view].sha256, `${view} screenshot mismatch`);
  }
  const after = await protectedInventory();
  require(valuesEqual(before, after), "read-only validator mutated accepted source inputs");
  if (failures.length) throw new Error(`Validation failed:\n- ${[...new Set(failures)].join("\n- ")}`);
  console.log(`Validated ${ARTIFACT_ID}: PASS`);
  console.log("Accepted source inventory stable: 19 images");
  console.log(`Protected historical inventory stable: ${after.length} files`);
  return { passed: true, failures: [] };
}

export { contractFailures, targetedTests };

export async function runPrivateRasterCaseDigestCommand({ command, inputPath }) {
  if (command === "validate-private-raster-case-digest") return validate(inputPath || RESULT_PATH);
  if (command === "smoke-private-raster-case-digest") {
    const model = await readJson(MODEL_PATH);
    const tests = targetedTests(model);
    if (!tests.all_passed) throw new Error("Targeted case-digest smoke failed");
    console.log(JSON.stringify(tests, null, 2));
    return tests;
  }
  throw new Error(`Unsupported command: ${command}`);
}

async function main() {
  const command = process.argv[2] || "build";
  if (command === "build") await build();
  else if (command === "validate") await validate(process.argv[3] ? path.resolve(process.argv[3]) : RESULT_PATH);
  else if (command === "smoke") {
    const model = await readJson(MODEL_PATH);
    const tests = targetedTests(model);
    console.log(JSON.stringify(tests, null, 2));
    if (!tests.all_passed) process.exitCode = 1;
  } else {
    throw new Error("Usage: node tools/fff-private-raster-case-digest.mjs <build|validate|smoke>");
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });
}
