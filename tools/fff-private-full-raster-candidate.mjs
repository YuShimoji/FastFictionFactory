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
  stat,
  writeFile
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";

const execFile = promisify(execFileCallback);
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PACKAGE_ROOT = path.join(REPO_ROOT, "artifacts", "private-full-raster-candidate");
const BASE_ROOT = path.join(PACKAGE_ROOT, "images", "base");
const FINAL_ROOT = path.join(PACKAGE_ROOT, "images", "final");
const MODEL_PATH = path.join(PACKAGE_ROOT, "private-full-raster-candidate.json");
const HTML_PATH = path.join(PACKAGE_ROOT, "private-full-raster-candidate.html");
const MP4_PATH = path.join(PACKAGE_ROOT, "private-full-raster-candidate.mp4");
const CONTACT_SHEET_PATH = path.join(PACKAGE_ROOT, "private-full-raster-candidate-contact-sheet.jpg");
const MANIFEST_PATH = path.join(PACKAGE_ROOT, "private-full-raster-candidate-manifest.json");
const STYLE_CONTRACT_PATH = path.join(PACKAGE_ROOT, "visual-style-contract.json");
const ATTEMPT_SOURCE_PATH = path.join(PACKAGE_ROOT, "generation-attempts-source.json");
const ATTEMPT_CSV_PATH = path.join(PACKAGE_ROOT, "generation-attempts.csv");
const SHOT_MAP_PATH = path.join(PACKAGE_ROOT, "shot-image-map.csv");
const LINEAGE_PATH = path.join(PACKAGE_ROOT, "image-lineage.csv");
const MOTION_MAP_PATH = path.join(PACKAGE_ROOT, "motion-transition-map.csv");
const README_PATH = path.join(PACKAGE_ROOT, "README_PRIVATE_FULL_RASTER_CANDIDATE.md");
const RESULT_PATH = path.join(REPO_ROOT, "artifacts", "private-full-raster-candidate-result.json");
const REVIEW_DOC_PATH = path.join(REPO_ROOT, "docs", "review", "private-full-raster-candidate.md");
const ROOT_MANIFEST_PATH = path.join(REPO_ROOT, "artifacts", "artifact-manifest.json");
const PREVIEW_PATH = path.join(REPO_ROOT, "artifacts", "private-previsualization-timeline", "private-previsualization-timeline.json");
const EXECUTION_PATH = path.join(REPO_ROOT, "artifacts", "production-execution-pack", "production-execution-pack.json");
const QUARANTINE_PATH = path.join(REPO_ROOT, "artifacts", "primary-imagery-quarantine", "primary-imagery-quarantine.json");
const SCREENSHOTS = {
  desktop: path.join(REPO_ROOT, "artifacts", "review-screens", "private-full-raster-candidate-desktop.png"),
  narrow: path.join(REPO_ROOT, "artifacts", "review-screens", "private-full-raster-candidate-narrow.png")
};

const ARTIFACT_ID = "fff-private-full-raster-candidate-001";
const DEFAULT_ID = "fff-private-previsualization-timeline-001";
const REJECTED_ID = "fff-private-materialized-motion-previs-001";
const QUARANTINE_ID = "FFF-Q-PRIMARY-IMAGERY-SVG-2026-07-25";
const STYLE_CONTRACT_ID = "fff-full-raster-style-contract-001";
const DURATION_SECONDS = 180;
const FPS = 30;
const MAX_CALLS = 24;
const PLANNING_RATE_USD = 0.25;
const MAX_API_EQUIVALENT_USD = 6;

const ANCHORS = {
  "shot-b04-01": {
    path: path.join(REPO_ROOT, "artifacts", "high-fidelity-raster-pilot", "images", "shot-b04-01.jpg"),
    repo_path: "artifacts/high-fidelity-raster-pilot/images/shot-b04-01.jpg",
    sha256: "ec774118a012db4f70ee138ba0e4f8107e8abfdd98f8fb006a95c7e409b4c8d1"
  },
  "shot-b05-02": {
    path: path.join(REPO_ROOT, "artifacts", "high-fidelity-raster-pilot", "images", "shot-b05-02.jpg"),
    repo_path: "artifacts/high-fidelity-raster-pilot/images/shot-b05-02.jpg",
    sha256: "4ebf56180c1bf6ebfbcbff1ffd4a141a07e5c045645a2670ec5a776bee3374ac"
  },
  "shot-b02-03": {
    path: path.join(REPO_ROOT, "artifacts", "high-fidelity-raster-pilot", "images", "shot-b02-03.jpg"),
    repo_path: "artifacts/high-fidelity-raster-pilot/images/shot-b02-03.jpg",
    sha256: "5a2b371948dfeed3e15cbdcd81ec4de48e2d4f4db429bbea3ee021c9f74f1c31"
  }
};

const BASE_SHOT_IDS = [
  "shot-b01-01",
  "shot-b01-02",
  "shot-b01-03",
  "shot-b02-01",
  "shot-b02-02",
  "shot-b03-01",
  "shot-b03-02",
  "shot-b04-02",
  "shot-b04-03",
  "shot-b05-01",
  "shot-b05-03"
];

const DERIVATIVE_RECIPES = {
  "shot-b03-03": {
    source_shot_ids: ["shot-b03-02"],
    recipe: "Preserve the ledger photograph; add three deterministic paper-toned opacity washes over successive ruled regions as a visual-metaphor mask. No generated text and no literal-erasure claim."
  },
  "shot-b05-04": {
    source_shot_ids: ["shot-b05-01", "shot-b05-02", "shot-b05-03"],
    recipe: "Deterministic three-source raster composite using equal-width photographic crops for unresolved person, object, and institution families; no selected candidate."
  },
  "shot-b06-01": {
    source_shot_ids: ["shot-b03-02"],
    recipe: "Reframe the ledger base and add equal-status deterministic Japanese text overlays for time and names, separated by an unresolved center."
  },
  "shot-b06-02": {
    source_shot_ids: ["shot-b03-02"],
    recipe: "Tighter ledger callback crop with a deterministic paper-neutral lower wash and 未記入欄 overlay; no recovery or identity claim."
  },
  "shot-b06-03": {
    source_shot_ids: ["shot-b01-01"],
    recipe: "Non-destructive tower-family callback crop with a restrained slow-pull-safe grade; no bell, cause, or resolution added."
  }
};

const CANDIDATE_LABELS = {
  "shot-b03-03": ["視覚比喩", "証拠ではない", "真偽：未確定"],
  "shot-b04-02": ["証拠の可能性", "誘い餌・偽記録の可能性"],
  "shot-b04-03": ["動機：未確定", "責任範囲：未確定"],
  "shot-b05-01": ["生存", "死亡", "記録から消失", "自ら潜伏"],
  "shot-b05-02": ["鍵", "監視具", "記憶の器"],
  "shot-b05-03": ["利益", "圧力下の取引", "内部対立"],
  "shot-b05-04": ["トーマ", "真鍮の蛾", "評議会"],
  "shot-b06-01": ["時間", "名前"],
  "shot-b06-02": ["未記入欄", "結末は未選択"],
  "shot-b06-03": ["時間か、名前か", "解決：保留"]
};

const PROTECTED_PATHS = [
  "artifacts/primary-imagery-quarantine/primary-imagery-quarantine.json",
  "artifacts/high-fidelity-raster-pilot/high-fidelity-raster-pilot.json",
  "artifacts/high-fidelity-raster-pilot-result.json",
  "artifacts/high-fidelity-raster-pilot/images/shot-b04-01.jpg",
  "artifacts/high-fidelity-raster-pilot/images/shot-b05-02.jpg",
  "artifacts/high-fidelity-raster-pilot/images/shot-b02-03.jpg",
  "artifacts/private-previsualization-timeline/private-previsualization-timeline.json",
  "artifacts/private-previsualization-timeline/private-previsualization-timeline.mp4",
  "artifacts/private-previsualization-timeline-result.json",
  "artifacts/private-materialized-motion-previs/private-materialized-motion-previs.json",
  "artifacts/private-materialized-motion-previs/private-materialized-motion-previs.mp4",
  "artifacts/private-materialized-motion-previs-result.json"
];

function bundledNodeModules() {
  if (process.env.FFF_NODE_MODULES) return process.env.FFF_NODE_MODULES;
  return path.join(
    process.env.USERPROFILE || "",
    ".cache",
    "codex-runtimes",
    "codex-primary-runtime",
    "dependencies",
    "node",
    "node_modules"
  );
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

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function repoPath(filePath) {
  return path.relative(REPO_ROOT, filePath).replaceAll("\\", "/");
}

function packageBrowserPath(repoRelativePath) {
  return path.relative(PACKAGE_ROOT, path.join(REPO_ROOT, repoRelativePath)).replaceAll("\\", "/");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function csvEscape(value) {
  const string = value === null || value === undefined ? "" : String(value);
  return /[",\r\n]/.test(string) ? `"${string.replaceAll('"', '""')}"` : string;
}

function toCsv(headers, rows) {
  return `${headers.join(",")}\n${rows.map((row) => headers.map((key) => csvEscape(row[key])).join(",")).join("\n")}\n`;
}

async function fileRecord(filePath, base = REPO_ROOT) {
  const bytes = await readFile(filePath);
  return {
    relative_path: path.relative(base, filePath).replaceAll("\\", "/"),
    byte_size: bytes.length,
    sha256: sha256(bytes)
  };
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

async function packageInventory() {
  const files = (await listFilesRecursive(PACKAGE_ROOT))
    .filter((filePath) => filePath !== MANIFEST_PATH)
    .map((filePath) => path.resolve(filePath));
  const records = [];
  for (const filePath of files) records.push(await fileRecord(filePath, PACKAGE_ROOT));
  const aggregate = records.map((item) => `${item.relative_path}\0${item.byte_size}\0${item.sha256}`).join("\n");
  return {
    files: records,
    payload_file_count: records.length,
    aggregate_sha256: sha256(Buffer.from(aggregate))
  };
}

async function protectedInventory() {
  const records = [];
  for (const relativePath of PROTECTED_PATHS) {
    records.push(await fileRecord(path.join(REPO_ROOT, relativePath), REPO_ROOT));
  }
  return records;
}

function valuesEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const whole = Math.floor(seconds % 60);
  const milliseconds = Math.round((seconds - Math.floor(seconds)) * 1000);
  return `${String(minutes).padStart(2, "0")}:${String(whole).padStart(2, "0")},${String(milliseconds).padStart(3, "0")}`;
}

async function runFfmpeg(args) {
  await execFile("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    windowsHide: true,
    maxBuffer: 32 * 1024 * 1024
  });
}

function h264Args() {
  return [
    "-an",
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-crf", "21",
    "-pix_fmt", "yuv420p",
    "-g", "30",
    "-keyint_min", "30",
    "-sc_threshold", "0",
    "-map_metadata", "-1"
  ];
}

async function verifyInputs(sharp) {
  const [preview, execution, quarantine, style, attempts] = await Promise.all([
    readJson(PREVIEW_PATH),
    readJson(EXECUTION_PATH),
    readJson(QUARANTINE_PATH),
    readJson(STYLE_CONTRACT_PATH),
    readJson(ATTEMPT_SOURCE_PATH)
  ]);
  if (quarantine.status !== "ACTIVE" || quarantine.quarantine_id !== QUARANTINE_ID) {
    throw new Error("Active primary-imagery quarantine identity mismatch");
  }
  if (style.contract_id !== STYLE_CONTRACT_ID || style.frozen_before_first_new_generation !== true) {
    throw new Error("Visual style contract is missing or not frozen");
  }
  if (preview.shots.length !== 19 || preview.beats.length !== 6) throw new Error("Preview chronology identity mismatch");
  if (preview.duration_seconds !== DURATION_SECONDS) throw new Error("Preview duration identity mismatch");
  if (preview.timeline_tracks.subtitles.length !== 20 || preview.timeline_tracks.narration_text.length !== 6) {
    throw new Error("Text-track identity mismatch");
  }
  if (attempts.attempts.length > MAX_CALLS) throw new Error("Image-generation call ceiling exceeded");
  if (attempts.attempts.length * PLANNING_RATE_USD > MAX_API_EQUIVALENT_USD) {
    throw new Error("API-equivalent planning-cost ceiling exceeded");
  }
  const calibration = attempts.attempts.filter((attempt) => attempt.calibration);
  if (calibration.length !== 4 || calibration.filter((attempt) => attempt.accepted).length < 3) {
    throw new Error("RASTER_SCALE_COHERENCE_BLOCKER");
  }
  if (attempts.attempts.some((attempt) => attempt.attempt_number > 2)) {
    throw new Error("Calibration or generation retry ceiling exceeded");
  }
  for (const attempt of attempts.attempts) {
    const filePath = path.join(REPO_ROOT, attempt.workspace_source_path);
    const bytes = await readFile(filePath);
    const metadata = await sharp(bytes).metadata();
    if (sha256(bytes) !== attempt.sha256 || metadata.width !== attempt.width || metadata.height !== attempt.height) {
      throw new Error(`${attempt.shot_id} generated-original provenance mismatch`);
    }
    if (!Array.isArray(attempt.prompt_lines) || attempt.prompt_lines.length < 10) {
      throw new Error(`${attempt.shot_id} prompt evidence is incomplete`);
    }
  }
  for (const [shotId, anchor] of Object.entries(ANCHORS)) {
    const bytes = await readFile(anchor.path);
    const metadata = await sharp(bytes).metadata();
    if (sha256(bytes) !== anchor.sha256 || metadata.width !== 1600 || metadata.height !== 900) {
      throw new Error(`${shotId} immutable anchor mismatch`);
    }
  }
  return { preview, execution, quarantine, style, attempts };
}

async function normalizeBaseImages(sharp, attempts) {
  await mkdir(BASE_ROOT, { recursive: true });
  const accepted = new Map(attempts.attempts.filter((attempt) => attempt.accepted).map((attempt) => [attempt.shot_id, attempt]));
  for (const shotId of BASE_SHOT_IDS) {
    const attempt = accepted.get(shotId);
    if (!attempt) throw new Error(`Accepted generated base is missing for ${shotId}`);
    const sourcePath = path.join(REPO_ROOT, attempt.workspace_source_path);
    const outputPath = path.join(BASE_ROOT, `${shotId}.jpg`);
    await sharp(sourcePath)
      .resize(1600, 900, { fit: "cover", position: "centre" })
      .jpeg({ quality: 94, chromaSubsampling: "4:4:4", mozjpeg: true })
      .toFile(outputPath);
  }
}

function overlaySvg(width, height, body) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><style>text{font-family:"Yu Gothic UI","Meiryo",sans-serif}</style>${body}</svg>`
  );
}

async function buildDerivatives(sharp) {
  await mkdir(FINAL_ROOT, { recursive: true });
  const ledger = path.join(BASE_ROOT, "shot-b03-02.jpg");
  await sharp(ledger)
    .composite([{
      input: overlaySvg(1600, 900, `
        <rect x="765" y="180" width="600" height="112" rx="10" fill="#e4ddce" opacity=".20"/>
        <rect x="765" y="315" width="600" height="112" rx="10" fill="#e4ddce" opacity=".42"/>
        <rect x="765" y="450" width="600" height="112" rx="10" fill="#e4ddce" opacity=".68"/>
      `)
    }])
    .jpeg({ quality: 94, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toFile(path.join(FINAL_ROOT, "shot-b03-03.jpg"));

  const toma = await sharp(path.join(BASE_ROOT, "shot-b05-01.jpg")).resize(620, 900, { fit: "cover" }).jpeg({ quality: 94 }).toBuffer();
  const moth = await sharp(ANCHORS["shot-b05-02"].path).resize(620, 900, { fit: "cover" }).jpeg({ quality: 94 }).toBuffer();
  const council = await sharp(path.join(BASE_ROOT, "shot-b05-03.jpg")).resize(620, 900, { fit: "cover" }).jpeg({ quality: 94 }).toBuffer();
  await sharp({ create: { width: 1600, height: 900, channels: 3, background: "#171a1d" } })
    .composite([
      { input: toma, left: 0, top: 0 },
      { input: moth, left: 490, top: 0 },
      { input: council, left: 980, top: 0 },
      { input: overlaySvg(1600, 900, `
        <defs>
          <linearGradient id="a"><stop offset="0" stop-color="#171a1d" stop-opacity="0"/><stop offset=".5" stop-color="#171a1d" stop-opacity=".35"/><stop offset="1" stop-color="#171a1d" stop-opacity="0"/></linearGradient>
        </defs>
        <rect x="460" width="100" height="900" fill="url(#a)"/>
        <rect x="950" width="100" height="900" fill="url(#a)"/>
      `), left: 0, top: 0 }
    ])
    .jpeg({ quality: 94, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toFile(path.join(FINAL_ROOT, "shot-b05-04.jpg"));

  await sharp(ledger)
    .composite([{
      input: overlaySvg(1600, 900, `
        <rect x="90" y="90" width="645" height="720" rx="18" fill="#12171b" opacity=".24"/>
        <rect x="865" y="90" width="645" height="720" rx="18" fill="#12171b" opacity=".24"/>
        <rect x="760" y="90" width="80" height="720" fill="#d8cfbd" opacity=".10"/>
        <text x="412" y="760" fill="#f2ede3" font-size="48" font-weight="650" text-anchor="middle">時間（候補）</text>
        <text x="1188" y="760" fill="#f2ede3" font-size="48" font-weight="650" text-anchor="middle">名前（候補）</text>
      `)
    }])
    .jpeg({ quality: 94, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toFile(path.join(FINAL_ROOT, "shot-b06-01.jpg"));

  const ledgerCrop = await sharp(ledger)
    .resize(1760, 990, { fit: "cover" })
    .extract({ left: 80, top: 45, width: 1600, height: 900 })
    .toBuffer();
  await sharp(ledgerCrop)
    .composite([{
      input: overlaySvg(1600, 900, `
        <rect x="0" y="690" width="1600" height="210" fill="#d9d0bd" opacity=".62"/>
        <text x="800" y="812" fill="#252c31" font-size="50" font-weight="650" text-anchor="middle">未記入欄 · 結末は未選択</text>
      `)
    }])
    .jpeg({ quality: 94, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toFile(path.join(FINAL_ROOT, "shot-b06-02.jpg"));

  await sharp(path.join(BASE_ROOT, "shot-b01-01.jpg"))
    .resize(1760, 990, { fit: "cover" })
    .extract({ left: 80, top: 45, width: 1600, height: 900 })
    .modulate({ brightness: 0.92, saturation: 0.88 })
    .jpeg({ quality: 94, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toFile(path.join(FINAL_ROOT, "shot-b06-03.jpg"));
}

function shotImagePlan(shotId) {
  if (ANCHORS[shotId]) {
    return {
      source_kind: "accepted_generated_raster_anchor",
      image_path: ANCHORS[shotId].repo_path,
      browser_image_path: packageBrowserPath(ANCHORS[shotId].repo_path),
      exact_anchor: true,
      derivative: false,
      lineage_source_shot_ids: [shotId],
      derivative_recipe: "Byte-identical accepted pilot anchor; no regeneration, overwrite, recolor, replacement, or re-encoding."
    };
  }
  if (DERIVATIVE_RECIPES[shotId]) {
    const repoImagePath = `artifacts/private-full-raster-candidate/images/final/${shotId}.jpg`;
    return {
      source_kind: "deterministic_raster_composite",
      image_path: repoImagePath,
      browser_image_path: packageBrowserPath(repoImagePath),
      exact_anchor: false,
      derivative: true,
      lineage_source_shot_ids: DERIVATIVE_RECIPES[shotId].source_shot_ids,
      derivative_recipe: DERIVATIVE_RECIPES[shotId].recipe
    };
  }
  const repoImagePath = `artifacts/private-full-raster-candidate/images/base/${shotId}.jpg`;
  return {
    source_kind: "generated_raster",
    image_path: repoImagePath,
    browser_image_path: packageBrowserPath(repoImagePath),
    exact_anchor: false,
    derivative: false,
    lineage_source_shot_ids: [shotId],
    derivative_recipe: "Sharp center crop and resize from observed 1672x941 PNG to 1600x900 JPEG; quality 94; 4:4:4 chroma; mozjpeg."
  };
}

async function buildModel(source, sharp) {
  const executionByShot = new Map(source.execution.shots.map((shot) => [shot.shot_id, shot]));
  const shots = [];
  for (const previewShot of source.preview.shots) {
    const imagePlan = shotImagePlan(previewShot.shot_id);
    const absoluteImagePath = path.join(REPO_ROOT, imagePlan.image_path);
    const bytes = await readFile(absoluteImagePath);
    const metadata = await sharp(bytes).metadata();
    const executionShot = executionByShot.get(previewShot.shot_id);
    shots.push({
      ...previewShot,
      sequence: shots.length + 1,
      truth_boundary: executionShot.truth_boundary,
      style_contract_id: STYLE_CONTRACT_ID,
      style_contract_version: source.style.contract_version,
      ...imagePlan,
      width: metadata.width,
      height: metadata.height,
      byte_size: bytes.length,
      sha256: sha256(bytes),
      candidate_labels: CANDIDATE_LABELS[previewShot.shot_id] || [],
      pending_owner_review: true,
      owner_visual_acceptance: imagePlan.exact_anchor,
      immutable_visual_anchor: imagePlan.exact_anchor,
      production_candidate_eligible: imagePlan.exact_anchor,
      selected_for_final_production: false,
      rights_cleared_claim: false,
      rasterized_forbidden_vector: false
    });
  }
  return {
    schemaVersion: "fff.privateFullRasterCandidate.v1",
    artifact_id: ARTIFACT_ID,
    launch_set_id: "fff-2026-07-25-full-raster-candidate",
    mission_id: "fff-private-full-raster-candidate-001",
    generated_at: "2026-07-26",
    title_ja: "全編フルラスター候補",
    subtitle_ja: "PRIVATE · DEFAULT OFF · PRODUCT OWNER WHOLE-STORY REVIEW PENDING",
    source_artifact_id: source.preview.artifact_id,
    style_contract_id: STYLE_CONTRACT_ID,
    style_contract_version: source.style.contract_version,
    duration_seconds: DURATION_SECONDS,
    timebase_fps: FPS,
    beats: source.preview.beats,
    shots,
    timeline_tracks: source.preview.timeline_tracks,
    generation_evidence: {
      call_count: source.attempts.attempts.length,
      accepted_count: source.attempts.attempts.filter((attempt) => attempt.accepted).length,
      rejected_count: source.attempts.attempts.filter((attempt) => !attempt.accepted).length,
      retry_count: source.attempts.attempts.filter((attempt) => attempt.attempt_number > 1).length,
      calibration_call_count: source.attempts.attempts.filter((attempt) => attempt.calibration).length,
      calibration_pass_count: source.attempts.attempts.filter((attempt) => attempt.calibration && attempt.accepted).length,
      planning_rate_usd_per_high_quality_landscape: PLANNING_RATE_USD,
      api_equivalent_planning_cost_usd: source.attempts.attempts.length * PLANNING_RATE_USD,
      actual_monetary_cost_observed: false,
      actual_monetary_cost_usd: null,
      model_observed: false,
      seed_observed_count: source.attempts.attempts.filter((attempt) => attempt.seed !== null).length
    },
    coherence_audit: {
      status: "TECHNICAL_PASS_HUMAN_REVIEW_PENDING",
      primary_frame_count: 19,
      accepted_anchor_count: 3,
      generated_base_count: BASE_SHOT_IDS.length,
      deterministic_derivative_count: Object.keys(DERIVATIVE_RECIPES).length,
      accidental_exact_duplicate_count: new Set(shots.map((shot) => shot.sha256)).size === shots.length ? 0 : shots.length - new Set(shots.map((shot) => shot.sha256)).size,
      callbacks: [
        { family: "tower", shots: ["shot-b01-01", "shot-b01-02", "shot-b01-03", "shot-b06-03"] },
        { family: "clock-repair", shots: ["shot-b02-01", "shot-b02-02", "shot-b02-03"] },
        { family: "ledger", shots: ["shot-b03-01", "shot-b03-02", "shot-b03-03", "shot-b06-01", "shot-b06-02"] },
        { family: "council", shots: ["shot-b04-01", "shot-b04-02", "shot-b04-03", "shot-b05-03", "shot-b05-04"] },
        { family: "toma", shots: ["shot-b05-01", "shot-b05-04"] },
        { family: "brass-moth", shots: ["shot-b02-02", "shot-b02-03", "shot-b05-02", "shot-b05-04"] }
      ],
      no_human_acceptance_claim_for_whole_candidate: true
    },
    boundaries: {
      private: true,
      default_active: false,
      successor_candidate: true,
      release_path_reachable: false,
      selected_for_final_production: false,
      rights_cleared_claim: false,
      public_release: false,
      publication: false,
      audio: false,
      voice: false,
      final_canon: false,
      product_owner_whole_story_review: "pending"
    }
  };
}

function generationAttemptsCsv(attemptSource) {
  const headers = [
    "call_number", "shot_id", "attempt_number", "calibration", "accepted", "rejection_reason",
    "tool", "observed_model", "observed_seed", "generated_original_path", "workspace_source_path",
    "width", "height", "source_sha256", "planning_rate_usd", "api_equivalent_cost_usd",
    "actual_monetary_cost_usd", "prompt"
  ];
  return toCsv(headers, attemptSource.attempts.map((attempt) => ({
    call_number: attempt.call_number,
    shot_id: attempt.shot_id,
    attempt_number: attempt.attempt_number,
    calibration: attempt.calibration,
    accepted: attempt.accepted,
    rejection_reason: attempt.rejection_reason,
    tool: attempt.tool,
    observed_model: attempt.model,
    observed_seed: attempt.seed,
    generated_original_path: attempt.generated_original_path,
    workspace_source_path: attempt.workspace_source_path,
    width: attempt.width,
    height: attempt.height,
    source_sha256: attempt.sha256,
    planning_rate_usd: PLANNING_RATE_USD.toFixed(2),
    api_equivalent_cost_usd: PLANNING_RATE_USD.toFixed(2),
    actual_monetary_cost_usd: "",
    prompt: attempt.prompt_lines.join("\n")
  })));
}

function shotMapCsv(model) {
  const headers = [
    "sequence", "shot_id", "beat_number", "start_time", "end_time", "duration_seconds",
    "source_kind", "image_path", "width", "height", "sha256", "style_contract_version",
    "exact_anchor", "derivative", "pending_owner_review", "selected_for_final_production",
    "rights_cleared_claim", "truth_boundary"
  ];
  return toCsv(headers, model.shots.map((shot) => Object.fromEntries(headers.map((header) => [header, shot[header]]))));
}

function lineageCsv(model) {
  const headers = [
    "shot_id", "source_kind", "source_shot_ids", "source_image_path", "final_image_path",
    "exact_byte_identity", "derivative_recipe", "purpose", "style_contract_version",
    "final_sha256", "selected_for_final_production", "rights_cleared_claim"
  ];
  return toCsv(headers, model.shots.map((shot) => ({
    shot_id: shot.shot_id,
    source_kind: shot.source_kind,
    source_shot_ids: shot.lineage_source_shot_ids.join("|"),
    source_image_path: shot.exact_anchor ? shot.image_path : shot.lineage_source_shot_ids.map((sourceShotId) => ANCHORS[sourceShotId]?.repo_path || `artifacts/private-full-raster-candidate/images/base/${sourceShotId}.jpg`).join("|"),
    final_image_path: shot.image_path,
    exact_byte_identity: shot.exact_anchor,
    derivative_recipe: shot.derivative_recipe,
    purpose: shot.title_ja,
    style_contract_version: shot.style_contract_version,
    final_sha256: shot.sha256,
    selected_for_final_production: false,
    rights_cleared_claim: false
  })));
}

function motionMapCsv(model) {
  const headers = [
    "sequence", "shot_id", "start_seconds", "end_seconds", "duration_seconds",
    "motion", "transition", "implementation", "callback_family", "watermark_required"
  ];
  return toCsv(headers, model.shots.map((shot) => ({
    sequence: shot.sequence,
    shot_id: shot.shot_id,
    start_seconds: shot.start_seconds,
    end_seconds: shot.end_seconds,
    duration_seconds: shot.duration_seconds,
    motion: shot.motion,
    transition: shot.transition,
    implementation: shot.motion === "locked" ? "locked 960x540 raster" : `${shot.motion} via bounded FFmpeg 30fps raster transform`,
    callback_family: model.coherence_audit.callbacks.find((item) => item.shots.includes(shot.shot_id))?.family || "",
    watermark_required: true
  })));
}

async function renderContactSheet(model, sharp) {
  const columns = 5;
  const tileWidth = 320;
  const imageHeight = 180;
  const labelHeight = 58;
  const rows = Math.ceil(model.shots.length / columns);
  const canvas = sharp({
    create: {
      width: columns * tileWidth,
      height: rows * (imageHeight + labelHeight),
      channels: 3,
      background: "#101519"
    }
  });
  const composites = [];
  for (const shot of model.shots) {
    const index = shot.sequence - 1;
    const left = (index % columns) * tileWidth;
    const top = Math.floor(index / columns) * (imageHeight + labelHeight);
    const image = await sharp(path.join(REPO_ROOT, shot.image_path))
      .resize(tileWidth, imageHeight, { fit: "cover" })
      .jpeg({ quality: 90 })
      .toBuffer();
    composites.push({ input: image, left, top });
    composites.push({
      input: overlaySvg(tileWidth, labelHeight, `
        <rect width="${tileWidth}" height="${labelHeight}" fill="#172027"/>
        <text x="12" y="22" fill="#f3efe5" font-size="16" font-weight="700">${escapeHtml(`${shot.sequence}. ${shot.shot_id}`)}</text>
        <text x="12" y="44" fill="#aebbc3" font-size="14">${escapeHtml(`${shot.start_time}–${shot.end_time} · ${shot.title_ja}`)}</text>
      `),
      left,
      top: top + imageHeight
    });
  }
  await canvas.composite(composites).jpeg({ quality: 91, mozjpeg: true }).toFile(CONTACT_SHEET_PATH);
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
  const inputPath = path.join(REPO_ROOT, shot.image_path);
  if (shot.motion === "graphic_dissolve") {
    await runFfmpeg([
      "-loop", "1", "-framerate", String(FPS), "-t", String(shot.duration_seconds), "-i", inputPath,
      "-loop", "1", "-framerate", String(FPS), "-t", String(shot.duration_seconds), "-i", inputPath,
      "-filter_complex",
      `[0:v]scale=960:540,gblur=sigma=7,fps=30,settb=1/30,setpts=PTS-STARTPTS[a];[1:v]scale=960:540,fps=30,settb=1/30,setpts=PTS-STARTPTS[b];[a][b]xfade=transition=dissolve:duration=${shot.duration_seconds}:offset=0,trim=duration=${shot.duration_seconds},format=yuv420p[v]`,
      "-map", "[v]", "-frames:v", String(frameCount), ...h264Args(), outputPath
    ]);
    return;
  }
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
    "-loop", "1", "-framerate", String(FPS), "-i", inputPath,
    "-vf", filter,
    "-frames:v", String(frameCount),
    ...h264Args(),
    outputPath
  ]);
}

async function applyTransition(shot, previousShot, baseClipPath, outputPath) {
  const evidence = transitionEvidence(shot.transition);
  if (shot.sequence === 1 || evidence.duration_seconds === 0) {
    await copyFile(baseClipPath, outputPath);
    return;
  }
  const previousImage = path.join(REPO_ROOT, previousShot.image_path);
  const frameCount = shot.duration_seconds * FPS;
  await runFfmpeg([
    "-loop", "1", "-framerate", String(FPS), "-t", String(shot.duration_seconds), "-i", previousImage,
    "-i", baseClipPath,
    "-filter_complex",
    `[0:v]scale=960:540,fps=30,settb=1/30,setpts=PTS-STARTPTS[p];[1:v]fps=30,settb=1/30,setpts=PTS-STARTPTS[c];[p][c]xfade=transition=${evidence.render_transition}:duration=${evidence.duration_seconds}:offset=0,trim=duration=${shot.duration_seconds},format=yuv420p[v]`,
    "-map", "[v]", "-frames:v", String(frameCount), ...h264Args(), outputPath
  ]);
}

function srtText(cues) {
  return cues.map((cue, index) => [
    index + 1,
    `${formatTime(cue.start_seconds)} --> ${formatTime(cue.end_seconds)}`,
    cue.text_ja,
    ""
  ].join("\n")).join("\n");
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
    watermark_text: "FULL RASTER CANDIDATE / PRIVATE / NOT FOR PUBLICATION"
  };
}

async function encodeTimeline(model, sharp) {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "fff-full-raster-candidate-"));
  try {
    const clipRoot = path.join(tempRoot, "clips");
    await mkdir(clipRoot, { recursive: true });
    const finalClips = [];
    for (const shot of model.shots) {
      const baseClip = path.join(clipRoot, `${shot.shot_id}-base.mp4`);
      const finalClip = path.join(clipRoot, `${shot.shot_id}-final.mp4`);
      await encodeBaseMotionClip(shot, baseClip);
      await applyTransition(shot, model.shots[shot.sequence - 2], baseClip, finalClip);
      finalClips.push(finalClip);
    }
    const quote = (filePath) => path.resolve(filePath).replaceAll("\\", "/").replaceAll("'", "'\\''");
    const concatPath = path.join(tempRoot, "clips.ffconcat");
    await writeFile(concatPath, `ffconcat version 1.0\n${finalClips.map((clip) => `file '${quote(clip)}'`).join("\n")}\n`, "utf8");
    const watermarkPath = path.join(tempRoot, "watermark.png");
    await sharp(overlaySvg(960, 42, `
      <rect width="960" height="42" fill="#0c1115" opacity=".80"/>
      <text x="480" y="28" fill="#f3efe5" font-size="19" font-weight="700" text-anchor="middle" letter-spacing="1.2">FULL RASTER CANDIDATE / PRIVATE / NOT FOR PUBLICATION</text>
    `)).png().toFile(watermarkPath);
    const watermarkedPath = path.join(tempRoot, "watermarked.mp4");
    await runFfmpeg([
      "-f", "concat", "-safe", "0", "-i", concatPath,
      "-loop", "1", "-framerate", String(FPS), "-i", watermarkPath,
      "-filter_complex", "[0:v]tpad=stop_mode=clone:stop_duration=0.1[base];[base][1:v]overlay=x=0:y=H-h:shortest=1,fps=30,format=yuv420p[v]",
      "-map", "[v]",
      "-frames:v", String(DURATION_SECONDS * FPS),
      "-an",
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "22",
      "-g", "30", "-keyint_min", "30", "-sc_threshold", "0",
      "-movflags", "+faststart", "-map_metadata", "-1",
      watermarkedPath
    ]);
    const subtitlePath = path.join(tempRoot, "subtitles.srt");
    await writeFile(subtitlePath, srtText(model.timeline_tracks.subtitles), "utf8");
    await runFfmpeg([
      "-i", watermarkedPath,
      "-f", "srt", "-i", subtitlePath,
      "-map", "0:v:0", "-map", "1:s:0",
      "-c:v", "copy", "-c:s", "mov_text",
      "-metadata", "title=Fast Fiction Factory Full Raster Candidate",
      "-metadata", "comment=PRIVATE / NOT FOR PUBLICATION / SILENT",
      "-metadata:s:s:0", "language=jpn",
      "-t", String(DURATION_SECONDS),
      "-movflags", "+faststart",
      MP4_PATH
    ]);
    return await probeMp4(MP4_PATH);
  } finally {
    const resolvedTemp = path.resolve(tempRoot);
    if (path.dirname(resolvedTemp) !== path.resolve(tmpdir()) || !path.basename(resolvedTemp).startsWith("fff-full-raster-candidate-")) {
      throw new Error("Temporary cleanup target escaped the expected OS temp boundary");
    }
    await rm(resolvedTemp, { recursive: true, force: true });
  }
}

function timelineClip(item, className, text, title) {
  const left = (item.start_seconds / DURATION_SECONDS) * 100;
  const width = ((item.end_seconds - item.start_seconds) / DURATION_SECONDS) * 100;
  return `<button class="clip ${className}" style="left:${left}%;width:${width}%" data-jump="${item.start_seconds}" title="${escapeHtml(title)}"><span>${escapeHtml(text)}</span></button>`;
}

function renderHtml(model) {
  const embedded = JSON.stringify(model).replaceAll("<", "\\u003c");
  const pictureTrack = model.shots.map((shot) => timelineClip(shot, "picture-clip", shot.shot_id, `${shot.start_time}–${shot.end_time} ${shot.title_ja}`)).join("");
  const subtitleTrack = model.timeline_tracks.subtitles.map((cue) => timelineClip(cue, "subtitle-clip", cue.id, `${formatTime(cue.start_seconds)} ${cue.text_ja}`)).join("");
  const narrationTrack = model.timeline_tracks.narration_text.map((segment) => timelineClip(segment, "narration-clip", segment.id, segment.text_ja)).join("");
  const beatButtons = model.beats.map((beat) => `<button data-jump="${beat.start_seconds}">Beat ${beat.beat_number} · ${escapeHtml(beat.title_ja)}</button>`).join("");
  const thumbnails = model.shots.map((shot) => `
    <button class="thumb" data-jump="${shot.start_seconds}" aria-label="${escapeHtml(`${shot.shot_id} ${shot.title_ja}へ移動`)}">
      <img src="${escapeHtml(shot.browser_image_path)}" alt="" loading="lazy"/>
      <span>${shot.sequence}. ${escapeHtml(shot.title_ja)}</span>
    </button>`).join("");
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>全編フルラスター候補 · PRIVATE</title>
<style>
:root{color-scheme:dark;--bg:#0b1014;--panel:#141c22;--line:#2b3942;--ink:#f3efe5;--muted:#aab7bf;--brass:#c4a76a;--focus:#8fd8ff}
*{box-sizing:border-box}body{margin:0;background:linear-gradient(160deg,#0a0f13,#12191e);color:var(--ink);font-family:"Yu Gothic UI","Meiryo",system-ui,sans-serif}
button,input,video{font:inherit}button{color:inherit;background:#1b252c;border:1px solid #34434d;border-radius:.5rem;padding:.55rem .72rem;cursor:pointer}
button:hover{border-color:var(--brass)}button:focus-visible,input:focus-visible,video:focus-visible{outline:3px solid var(--focus);outline-offset:3px}
main{width:min(1380px,100%);margin:auto;padding:1rem}.mast{display:flex;gap:1rem;justify-content:space-between;align-items:flex-start;margin-bottom:.8rem}
h1{font-size:clamp(1.45rem,3vw,2.5rem);margin:.15rem 0}.eyebrow{color:var(--brass);font-weight:750;letter-spacing:.12em;font-size:.78rem}
.boundary{max-width:58ch;color:var(--muted);line-height:1.55}.player-grid{display:grid;grid-template-columns:minmax(0,2.2fr) minmax(250px,.8fr);gap:1rem}
.stage{position:relative;background:#000;border:1px solid var(--line);border-radius:.75rem;overflow:hidden;aspect-ratio:16/9}
video{width:100%;height:100%;display:block}.subtitle{position:absolute;left:8%;right:8%;bottom:3.4rem;text-align:center;font-size:clamp(1rem,2.4vw,1.65rem);font-weight:750;text-shadow:0 2px 9px #000;background:#071016bb;border-radius:.4rem;padding:.35rem .55rem;pointer-events:none}
.candidate-labels{position:absolute;left:1rem;right:1rem;top:1rem;display:flex;gap:.45rem;justify-content:center;flex-wrap:wrap;pointer-events:none}
.candidate-labels span{background:#0a1117d9;border:1px solid #c4a76a88;border-radius:999px;padding:.32rem .58rem;font-size:.78rem}
.side{background:var(--panel);border:1px solid var(--line);border-radius:.75rem;padding:1rem;display:grid;align-content:start;gap:.75rem}
.time{font-variant-numeric:tabular-nums;color:var(--brass);font-size:1.15rem}.side h2{margin:0;font-size:1.25rem}.meta{color:var(--muted);line-height:1.5}
.controls{display:grid;grid-template-columns:auto auto auto 1fr;gap:.55rem;margin:.75rem 0;align-items:center}.controls input{width:100%}.beat-jumps{display:flex;flex-wrap:wrap;gap:.45rem;margin:.65rem 0}
.timeline{position:relative;background:#10171c;border:1px solid var(--line);border-radius:.75rem;padding:1rem;overflow:hidden}.lane{position:relative;height:3.2rem;margin:1.2rem 0}.lane-name{position:absolute;top:-1.05rem;color:var(--muted);font-size:.75rem}
.clip{position:absolute;top:0;height:2.4rem;overflow:hidden;border-radius:.25rem;padding:.2rem;font-size:.64rem;text-align:left}.clip span{white-space:nowrap}
.picture-clip{background:#263842}.narration-clip{background:#4a3e29}.subtitle-clip{background:#293e31}.playhead{position:absolute;top:1rem;bottom:1rem;width:2px;background:#e4c273;left:0;z-index:5;pointer-events:none}
.thumbs{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:.55rem;margin-top:1rem}.thumb{padding:0;overflow:hidden;text-align:left}.thumb img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}.thumb span{display:block;padding:.4rem;font-size:.7rem}
.legend{margin-top:1rem;color:var(--muted);font-size:.8rem;line-height:1.55}
@media(max-width:820px){main{padding:.65rem}.mast{display:block}.player-grid{grid-template-columns:1fr}.controls{grid-template-columns:repeat(3,1fr)}.controls input{grid-column:1/-1}.thumbs{grid-template-columns:repeat(2,minmax(0,1fr))}.clip span{display:none}}
</style>
</head>
<body>
<main>
  <header class="mast">
    <div><div class="eyebrow">FULL RASTER CANDIDATE · PRIVATE · NOT FOR PUBLICATION</div><h1>全編フルラスター候補</h1></div>
    <div class="boundary">Product Owner whole-story review pending。旧 private preview が引き続き active default。本候補は default-off / successor candidate であり、最終production選択・rights clearance・公開・音声・canonを主張しません。</div>
  </header>
  <section class="player-grid">
    <div class="stage">
      <video id="video" src="private-full-raster-candidate.mp4" controls muted preload="metadata" tabindex="0"></video>
      <div id="candidateLabels" class="candidate-labels"></div>
      <div id="subtitle" class="subtitle" aria-live="polite"></div>
    </div>
    <aside class="side">
      <output id="timecode" class="time">00:00.0 / 03:00.0</output>
      <div id="beatIdentity" class="eyebrow"></div>
      <h2 id="shotTitle"></h2>
      <div id="shotIdentity" class="meta"></div>
      <div id="shotSource" class="meta"></div>
      <div id="shotTruth" class="meta"></div>
      <div class="meta"><strong>Style contract</strong><br/>fff-full-raster-style-contract-001 · v1.0.0</div>
    </aside>
  </section>
  <div class="controls">
    <button id="prevShot" aria-label="前のshot">◀ 前</button>
    <button id="togglePlay" aria-label="再生" aria-pressed="false">▶ 再生</button>
    <button id="nextShot" aria-label="次のshot">次 ▶</button>
    <input id="scrubber" type="range" min="0" max="180" step=".1" value="0" aria-label="180秒タイムライン"/>
  </div>
  <nav class="beat-jumps" aria-label="Beat移動">${beatButtons}</nav>
  <section class="timeline" aria-label="timeline-first review surface">
    <div id="playhead" class="playhead"></div>
    <div class="lane"><div class="lane-name">PICTURE · 19 SHOTS</div>${pictureTrack}</div>
    <div class="lane"><div class="lane-name">NARRATION METADATA · 6 SEGMENTS · SILENT</div>${narrationTrack}</div>
    <div class="lane"><div class="lane-name">SUBTITLES · 20 CUES</div>${subtitleTrack}</div>
  </section>
  <section class="thumbs">${thumbnails}</section>
  <p class="legend">Keyboard: Space 再生/停止 · Home/End 先頭/末尾 · ←/→ 1秒 · Shift+←/→ 5秒。19 shotはすべて1600×900以上。3 anchorはbyte-identical。critical Japanese labelsはこのHTML/CSSまたはdeterministic raster overlayで追加し、image generationには埋め込んでいません。</p>
</main>
<script id="candidateModel" type="application/json">${embedded}</script>
<script>
(()=>{const model=JSON.parse(document.getElementById("candidateModel").textContent);const video=document.getElementById("video");const scrubber=document.getElementById("scrubber");const subtitle=document.getElementById("subtitle");const labels=document.getElementById("candidateLabels");const playhead=document.getElementById("playhead");const toggle=document.getElementById("togglePlay");const clamp=(v)=>Math.max(0,Math.min(180,Number(v)||0));const shotAt=(t)=>model.shots.find((s)=>t>=s.start_seconds&&t<s.end_seconds)||model.shots.at(-1);const beatAt=(t)=>model.beats.find((b)=>t>=b.start_seconds&&t<b.end_seconds)||model.beats.at(-1);const cueAt=(t)=>model.timeline_tracks.subtitles.find((c)=>t>=c.start_seconds&&t<c.end_seconds);const fmt=(v)=>{v=clamp(v);return String(Math.floor(v/60)).padStart(2,"0")+":"+String(Math.floor(v%60)).padStart(2,"0")+"."+Math.floor((v%1)*10)};let active="";function render(){const t=clamp(video.currentTime);const shot=shotAt(t),beat=beatAt(t),cue=cueAt(t);scrubber.value=String(t);playhead.style.left=(t/180*100)+"%";document.getElementById("timecode").value=fmt(t)+" / 03:00.0";subtitle.textContent=cue?cue.text_ja:"";if(active!==shot.shot_id){active=shot.shot_id;document.getElementById("beatIdentity").textContent="BEAT "+beat.beat_number+" · "+beat.title_ja;document.getElementById("shotTitle").textContent=shot.title_ja;document.getElementById("shotIdentity").textContent=shot.shot_id+" · "+shot.start_time+"–"+shot.end_time+" · "+shot.motion+" / "+shot.transition;document.getElementById("shotSource").textContent=shot.source_kind+" · "+shot.width+"×"+shot.height+" · SHA "+shot.sha256.slice(0,12)+"…";document.getElementById("shotTruth").textContent="Truth boundary: "+shot.truth_boundary;labels.replaceChildren(...shot.candidate_labels.map((value)=>{const span=document.createElement("span");span.textContent=value;return span}))}}function seek(v){video.currentTime=clamp(v);render()}async function play(){if(video.currentTime>=179.95)seek(0);video.muted=true;await video.play();toggle.textContent="❚❚ 停止";toggle.setAttribute("aria-pressed","true")}function pause(){video.pause();toggle.textContent="▶ 再生";toggle.setAttribute("aria-pressed","false")}function togglePlay(){video.paused?play().catch(()=>{}):pause()}video.addEventListener("timeupdate",render);video.addEventListener("seeked",render);video.addEventListener("loadedmetadata",render);video.addEventListener("ended",pause);toggle.addEventListener("click",togglePlay);scrubber.addEventListener("input",()=>seek(scrubber.value));document.getElementById("prevShot").addEventListener("click",()=>{const shot=shotAt(video.currentTime);seek(video.currentTime-shot.start_seconds>.4?shot.start_seconds:model.shots[Math.max(0,shot.sequence-2)].start_seconds)});document.getElementById("nextShot").addEventListener("click",()=>{const shot=shotAt(video.currentTime);seek(shot.sequence<19?model.shots[shot.sequence].start_seconds:180)});for(const button of document.querySelectorAll("[data-jump]"))button.addEventListener("click",()=>seek(button.dataset.jump));document.addEventListener("keydown",(event)=>{if(event.target===scrubber)return;if(event.code==="Space"){event.preventDefault();togglePlay()}else if(event.key==="Home"){event.preventDefault();seek(0)}else if(event.key==="End"){event.preventDefault();seek(180)}else if(event.key==="ArrowLeft"){event.preventDefault();seek(video.currentTime-(event.shiftKey?5:1))}else if(event.key==="ArrowRight"){event.preventDefault();seek(video.currentTime+(event.shiftKey?5:1))}});window.__FULL_RASTER__={model,video,shotAt,beatAt,cueAt,seek,getState:()=>({current_time:video.currentTime,duration:video.duration,ready_state:video.readyState,muted:video.muted,shot_id:shotAt(video.currentTime).shot_id,subtitle:cueAt(video.currentTime)?.text_ja||""})};render()})();
</script>
</body>
</html>`;
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
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => pageErrors.push(error.message));
      page.on("request", (request) => {
        if (/^https?:/i.test(request.url())) externalRequests.push(request.url());
      });
      await page.goto(pathToFileURL(HTML_PATH).href, { waitUntil: "load" });
      await page.waitForFunction(() => window.__FULL_RASTER__ && window.__FULL_RASTER__.video.readyState >= 1);
      for (const shot of model.shots) {
        await page.evaluate((seconds) => window.__FULL_RASTER__.seek(seconds), shot.start_seconds + Math.min(0.2, shot.duration_seconds / 4));
        const state = await page.evaluate(() => window.__FULL_RASTER__.getState());
        if (state.shot_id !== shot.shot_id) throw new Error(`Browser shot-boundary mismatch for ${shot.shot_id}`);
      }
      await page.evaluate((seconds) => window.__FULL_RASTER__.seek(seconds), seekTo);
      await page.locator("#togglePlay").focus();
      const metrics = await page.evaluate(() => {
        const focusStyle = getComputedStyle(document.activeElement);
        const video = document.getElementById("video");
        return {
          document_width: document.documentElement.scrollWidth,
          viewport_width: window.innerWidth,
          horizontal_overflow_px: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
          nested_vertical_scroll_count: [...document.querySelectorAll("main *")].filter((element) => element.scrollHeight > element.clientHeight + 2 && getComputedStyle(element).overflowY !== "visible").length,
          video_duration: video.duration,
          video_muted: video.muted,
          focus_outline_style: focusStyle.outlineStyle,
          focus_outline_width: focusStyle.outlineWidth,
          shot_button_count: document.querySelectorAll(".thumb").length,
          timeline_lane_count: document.querySelectorAll(".lane").length
        };
      });
      await page.screenshot({ path: screenshotPath, fullPage: false, animations: "disabled" });
      const screenshot = await fileRecord(screenshotPath, REPO_ROOT);
      await page.close();
      return {
        ...metrics,
        screenshot_path: screenshot.relative_path,
        screenshot_byte_size: screenshot.byte_size,
        screenshot_sha256: screenshot.sha256
      };
    };
    await mkdir(path.dirname(SCREENSHOTS.desktop), { recursive: true });
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
      && results.desktop.shot_button_count === 19
      && results.narrow.shot_button_count === 19
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

function contractFailures(model) {
  const failures = [];
  const require = (condition, message) => { if (!condition) failures.push(message); };
  require(model.artifact_id === ARTIFACT_ID, "artifact identity mismatch");
  require(model.duration_seconds === 180 && model.beats.length === 6 && model.shots.length === 19, "chronology count mismatch");
  require(model.timeline_tracks.subtitles.length === 20 && model.timeline_tracks.narration_text.length === 6, "text-track count mismatch");
  require(model.generation_evidence.call_count <= 24, "image-generation call ceiling exceeded");
  require(model.generation_evidence.api_equivalent_planning_cost_usd <= 6, "API-equivalent planning cost ceiling exceeded");
  require(model.generation_evidence.calibration_pass_count >= 3, "calibration pass floor failed");
  require(model.shots.every((shot) => shot.width >= 1600 && shot.height >= 900), "minimum frame dimensions failed");
  require(new Set(model.shots.map((shot) => shot.shot_id)).size === 19, "shot identity duplicate");
  require(new Set(model.shots.map((shot) => shot.sha256)).size === 19, "accidental exact duplicate primary frame");
  require(model.shots.every((shot) => ["accepted_generated_raster_anchor", "generated_raster", "generated_raster_edit", "licensed_photocomposite", "deterministic_raster_composite"].includes(shot.source_kind)), "forbidden or missing source kind");
  require(model.shots.every((shot) => shot.rasterized_forbidden_vector === false), "rasterized forbidden-vector lineage");
  require(model.shots.every((shot) => shot.selected_for_final_production === false && shot.rights_cleared_claim === false), "selection or rights claim escaped");
  require(model.boundaries.private === true && model.boundaries.default_active === false && model.boundaries.successor_candidate === true, "candidate state mismatch");
  require(model.boundaries.release_path_reachable === false && model.boundaries.public_release === false && model.boundaries.audio === false && model.boundaries.final_canon === false, "closed boundary escaped");
  require(model.coherence_audit.accidental_exact_duplicate_count === 0, "coherence duplicate audit failed");
  for (const [shotId, anchor] of Object.entries(ANCHORS)) {
    const shot = model.shots.find((item) => item.shot_id === shotId);
    require(shot?.sha256 === anchor.sha256 && shot?.exact_anchor === true, `${shotId} immutable anchor mismatch`);
  }
  return failures;
}

function targetedTests(model) {
  const baseFailures = contractFailures(model);
  const mutate = () => structuredClone(model);
  const cases = [
    { id: "accept-complete-candidate", passed: baseFailures.length === 0, observed_failures: baseFailures },
    {
      id: "reject-production-selection",
      expected: "selection or rights claim escaped",
      evaluate: (candidate) => { candidate.shots[0].selected_for_final_production = true; }
    },
    {
      id: "reject-rights-clearance",
      expected: "selection or rights claim escaped",
      evaluate: (candidate) => { candidate.shots[0].rights_cleared_claim = true; }
    },
    {
      id: "reject-default-promotion",
      expected: "candidate state mismatch",
      evaluate: (candidate) => { candidate.boundaries.default_active = true; }
    },
    {
      id: "reject-call-ceiling",
      expected: "image-generation call ceiling exceeded",
      evaluate: (candidate) => { candidate.generation_evidence.call_count = 25; }
    },
    {
      id: "reject-calibration-floor",
      expected: "calibration pass floor failed",
      evaluate: (candidate) => { candidate.generation_evidence.calibration_pass_count = 2; }
    },
    {
      id: "reject-forbidden-source-kind",
      expected: "forbidden or missing source kind",
      evaluate: (candidate) => { candidate.shots[0].source_kind = "svg_primary"; }
    },
    {
      id: "reject-exact-duplicate-primary",
      expected: "accidental exact duplicate primary frame",
      evaluate: (candidate) => {
        candidate.shots[1].sha256 = candidate.shots[0].sha256;
        candidate.coherence_audit.accidental_exact_duplicate_count = 1;
      }
    }
  ];
  for (const testCase of cases.slice(1)) {
    const candidate = mutate();
    testCase.evaluate(candidate);
    const failures = contractFailures(candidate);
    testCase.observed_failures = failures;
    testCase.passed = failures.includes(testCase.expected);
    delete testCase.evaluate;
  }
  return {
    total: cases.length,
    passed: cases.filter((item) => item.passed).length,
    all_passed: cases.every((item) => item.passed),
    cases
  };
}

function renderReadme(model, mp4) {
  return `# Private Full Raster Candidate

Artifact: \`${ARTIFACT_ID}\`

This is a private, default-off successor candidate for one Product Owner whole-story visual review. The accepted \`${DEFAULT_ID}\` remains the active default until that review. The rejected \`${REJECTED_ID}\` remains archive-only and is not a visual source.

## Exact package contract

- 6 Beats / 19 shots / 180 seconds / 20 subtitle cues
- 3 byte-identical Product Owner-accepted anchors
- ${model.generation_evidence.call_count} built-in image-generation calls; ${model.generation_evidence.accepted_count} accepted; ${model.generation_evidence.rejected_count} rejected; ${model.generation_evidence.retry_count} retries
- API-equivalent planning cost: USD ${model.generation_evidence.api_equivalent_planning_cost_usd.toFixed(2)} at USD ${PLANNING_RATE_USD.toFixed(2)} per high-quality landscape
- Actual monetary cost: unknown / not observed
- ${BASE_SHOT_IDS.length} accepted new base images and ${Object.keys(DERIVATIVE_RECIPES).length} deterministic raster derivatives
- 19 unique 1600x900 final primary frames; accidental exact duplicates: 0
- Silent H.264 MP4: ${mp4.width}x${mp4.height}, ${mp4.duration_seconds.toFixed(3)} seconds, ${mp4.frame_count} frames, audio streams ${mp4.audio_stream_count}, Japanese subtitle tracks ${mp4.subtitle_stream_count}
- Watermark: \`${mp4.watermark_text}\`

## Review route

Open \`private-full-raster-candidate.html\`. Review chronology, family coherence, material realism, unresolved-truth neutrality, motion, transitions, and critical Japanese overlays as one 180-second sequence.

## Closed boundaries

No final production selection, rights-cleared claim, release, publication, audio, voice, or final canon is made. All generated-image model and seed fields remain null because the built-in route did not expose them.
`;
}

function renderReviewDoc(model, mp4, browserEvidence, tests) {
  return `# Private Full Raster Candidate Review

## Current state

\`${ARTIFACT_ID}\` is technically complete and ready for one whole-story Product Owner review. It is private, default-off, successor-candidate-only, release-unreachable, silent, and not selected for production. \`${DEFAULT_ID}\` remains active/default. \`${REJECTED_ID}\` remains rejected and archive-only.

## Anchor acceptance

The Product Owner accepted \`shot-b04-01\`, \`shot-b05-02\`, and \`shot-b02-03\` as coherent, high-quality visual anchors eligible for production consideration. They are byte-identical in this candidate. Their durable state is \`owner_visual_acceptance=true\`, \`immutable_visual_anchor=true\`, \`production_candidate_eligible=true\`, \`selected_for_final_production=false\`, and \`rights_cleared_claim=false\`.

## Generation and calibration

- Calls: ${model.generation_evidence.call_count} / 24
- Accepted / rejected / retries: ${model.generation_evidence.accepted_count} / ${model.generation_evidence.rejected_count} / ${model.generation_evidence.retry_count}
- Calibration: ${model.generation_evidence.calibration_pass_count} / ${model.generation_evidence.calibration_call_count} on first attempts
- API-equivalent planning cost: USD ${model.generation_evidence.api_equivalent_planning_cost_usd.toFixed(2)} / USD 6.00
- Actual monetary cost: unknown because the built-in route exposed no billing receipt
- Observed model: unknown; observed seed count: ${model.generation_evidence.seed_observed_count}

## Technical evidence

- Final frames: 19 / 19 at 1600x900
- Accidental exact duplicate primary frames: ${model.coherence_audit.accidental_exact_duplicate_count}
- Contact sheet: \`artifacts/private-full-raster-candidate/private-full-raster-candidate-contact-sheet.jpg\`
- MP4: ${mp4.duration_seconds.toFixed(3)} s, ${mp4.codec_name}, ${mp4.width}x${mp4.height}, ${mp4.frame_count} frames, ${mp4.audio_stream_count} audio streams, SHA256 \`${mp4.sha256}\`
- Browser evidence: ${browserEvidence.passed ? "PASS" : "FAIL"} at 1440x1000 and 390x844
- Targeted tests: ${tests.passed}/${tests.total}

## Product Owner review question

Does the exact 19-shot sequence read as one coherent, materially convincing raster story while keeping bell cause, Toma fate, moth function, ledger truth/ownership, Council motive/responsibility, time-versus-names, and the ending unresolved?

Record acceptance or findings against exact shot IDs, cue IDs, or timestamps. Acceptance would not by itself select final production media, clear rights, authorize audio/voice, authorize publication, or establish final canon.
`;
}

async function buildManifest(model, mp4, browserEvidence) {
  const inventory = await packageInventory();
  const manifest = {
    schemaVersion: "fff.privateFullRasterCandidateManifest.v1",
    artifact_id: ARTIFACT_ID,
    generated_at: "2026-07-26",
    style_contract_id: STYLE_CONTRACT_ID,
    shot_count: model.shots.length,
    primary_frame_count: model.shots.length,
    generated_base_count: BASE_SHOT_IDS.length,
    accepted_anchor_count: Object.keys(ANCHORS).length,
    deterministic_derivative_count: Object.keys(DERIVATIVE_RECIPES).length,
    contact_sheet_count: 1,
    mp4,
    screenshots: {
      desktop: {
        path: browserEvidence.desktop.screenshot_path,
        byte_size: browserEvidence.desktop.screenshot_byte_size,
        sha256: browserEvidence.desktop.screenshot_sha256
      },
      narrow: {
        path: browserEvidence.narrow.screenshot_path,
        byte_size: browserEvidence.narrow.screenshot_byte_size,
        sha256: browserEvidence.narrow.screenshot_sha256
      }
    },
    package_fingerprint_sha256: inventory.aggregate_sha256,
    payload_file_count: inventory.payload_file_count,
    files: inventory.files
  };
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return manifest;
}

async function updateRootManifest(model, manifest) {
  const root = await readJson(ROOT_MANIFEST_PATH);
  root.successor_candidate_artifact_id = ARTIFACT_ID;
  const registry = root.primary_imagery_medium_gate.new_visual_candidates;
  const entry = {
    artifact_id: ARTIFACT_ID,
    active_default: false,
    successor_candidate: true,
    primary_frames: model.shots.map((shot) => ({
      shot_id: shot.shot_id,
      source_kind: "generated_raster",
      candidate_source_kind: shot.source_kind,
      rasterized_forbidden_vector: false
    }))
  };
  const index = registry.findIndex((candidate) => candidate.artifact_id === ARTIFACT_ID);
  if (index >= 0) registry[index] = entry;
  else registry.push(entry);
  root.private_full_raster_candidate_dir = "artifacts/private-full-raster-candidate";
  root.private_full_raster_candidate_result_path = "artifacts/private-full-raster-candidate-result.json";
  root.private_full_raster_candidate_doc_path = "docs/review/private-full-raster-candidate.md";
  root.private_full_raster_candidate_route = "artifacts/private-full-raster-candidate/private-full-raster-candidate.html";
  root.private_full_raster_candidate_manifest_path = "artifacts/private-full-raster-candidate/private-full-raster-candidate-manifest.json";
  root.private_full_raster_candidate_contact_sheet_path = "artifacts/private-full-raster-candidate/private-full-raster-candidate-contact-sheet.jpg";
  root.private_full_raster_candidate_mp4_path = "artifacts/private-full-raster-candidate/private-full-raster-candidate.mp4";
  root.private_full_raster_candidate_package_fingerprint = manifest.package_fingerprint_sha256;
  root.private_full_raster_candidate = {
    artifact_id: ARTIFACT_ID,
    schemaVersion: model.schemaVersion,
    package_root: "artifacts/private-full-raster-candidate",
    result_path: "artifacts/private-full-raster-candidate-result.json",
    review_doc_path: "docs/review/private-full-raster-candidate.md",
    access_route: "artifacts/private-full-raster-candidate/private-full-raster-candidate.html",
    source_artifact_id: DEFAULT_ID,
    quarantine_id: QUARANTINE_ID,
    style_contract_id: STYLE_CONTRACT_ID,
    package_fingerprint_sha256: manifest.package_fingerprint_sha256,
    shot_count: model.shots.length,
    generated_base_count: BASE_SHOT_IDS.length,
    accepted_anchor_count: Object.keys(ANCHORS).length,
    deterministic_derivative_count: Object.keys(DERIVATIVE_RECIPES).length,
    private_local_only: true,
    default_active: false,
    active_default: false,
    successor_candidate: true,
    release_path_reachable: false,
    product_owner_whole_story_review: "pending",
    selected_for_production: false,
    rights_cleared_claim: false,
    public_release: false,
    audio: false,
    voice: false,
    final_canon: false
  };
  await writeFile(ROOT_MANIFEST_PATH, `${JSON.stringify(root, null, 2)}\n`, "utf8");
}

async function build() {
  const sharp = await loadSharp();
  const protectedBefore = await protectedInventory();
  const source = await verifyInputs(sharp);
  await normalizeBaseImages(sharp, source.attempts);
  await buildDerivatives(sharp);
  const model = await buildModel(source, sharp);
  const failures = contractFailures(model);
  if (failures.length) throw new Error(`Candidate contract failed: ${failures.join("; ")}`);
  const tests = targetedTests(model);
  if (!tests.all_passed) throw new Error("Targeted tests failed");
  await Promise.all([
    writeFile(ATTEMPT_CSV_PATH, generationAttemptsCsv(source.attempts), "utf8"),
    writeFile(SHOT_MAP_PATH, shotMapCsv(model), "utf8"),
    writeFile(LINEAGE_PATH, lineageCsv(model), "utf8"),
    writeFile(MOTION_MAP_PATH, motionMapCsv(model), "utf8"),
    writeFile(MODEL_PATH, `${JSON.stringify(model, null, 2)}\n`, "utf8"),
    writeFile(HTML_PATH, renderHtml(model), "utf8"),
    renderContactSheet(model, sharp)
  ]);
  const mp4 = await encodeTimeline(model, sharp);
  if (
    Math.abs(mp4.duration_seconds - 180) > 0.001
    || mp4.codec_name !== "h264"
    || mp4.width !== 960
    || mp4.height !== 540
    || mp4.frame_count !== 5400
    || mp4.audio_stream_count !== 0
    || mp4.subtitle_stream_count !== 1
  ) {
    throw new Error(`MP4 contract failed: ${JSON.stringify(mp4)}`);
  }
  await writeFile(README_PATH, renderReadme(model, mp4), "utf8");
  const browserEvidence = await captureBrowserEvidence(model);
  if (!browserEvidence.passed) throw new Error(`Browser evidence failed: ${JSON.stringify(browserEvidence)}`);
  await writeFile(REVIEW_DOC_PATH, renderReviewDoc(model, mp4, browserEvidence, tests), "utf8");
  const manifest = await buildManifest(model, mp4, browserEvidence);
  const protectedAfter = await protectedInventory();
  if (!valuesEqual(protectedBefore, protectedAfter)) throw new Error("Protected predecessor bytes changed during build");
  const result = {
    schemaVersion: "fff.privateFullRasterCandidateResult.v1",
    artifact_id: ARTIFACT_ID,
    passed: true,
    failures: [],
    shot_count: model.shots.length,
    beat_count: model.beats.length,
    duration_seconds: model.duration_seconds,
    subtitle_cue_count: model.timeline_tracks.subtitles.length,
    narration_segment_count: model.timeline_tracks.narration_text.length,
    primary_frame_count: model.shots.length,
    generated_base_count: BASE_SHOT_IDS.length,
    accepted_anchor_count: Object.keys(ANCHORS).length,
    deterministic_derivative_count: Object.keys(DERIVATIVE_RECIPES).length,
    accidental_exact_duplicate_count: model.coherence_audit.accidental_exact_duplicate_count,
    generation_evidence: model.generation_evidence,
    calibration: {
      status: "PASS",
      call_count: model.generation_evidence.calibration_call_count,
      passed_count: model.generation_evidence.calibration_pass_count,
      failed_count: model.generation_evidence.calibration_call_count - model.generation_evidence.calibration_pass_count,
      retry_count: 0,
      classes: ["environment", "hands", "fictional_document", "unresolved_human"]
    },
    anchors: model.shots.filter((shot) => shot.exact_anchor).map((shot) => ({
      shot_id: shot.shot_id,
      path: shot.image_path,
      sha256: shot.sha256,
      owner_visual_acceptance: true,
      immutable_visual_anchor: true,
      production_candidate_eligible: true,
      selected_for_final_production: false,
      rights_cleared_claim: false
    })),
    coherence_audit: model.coherence_audit,
    mp4,
    browser_evidence: browserEvidence,
    targeted_tests: tests,
    protected_inputs: {
      passed: true,
      before: protectedBefore,
      after: protectedAfter
    },
    package_manifest: {
      path: repoPath(MANIFEST_PATH),
      fingerprint: manifest.package_fingerprint_sha256,
      payload_file_count: manifest.payload_file_count
    },
    boundaries: model.boundaries
  };
  await writeFile(RESULT_PATH, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  await updateRootManifest(model, manifest);
  console.log(`Built ${ARTIFACT_ID}`);
  console.log(`Package fingerprint: ${manifest.package_fingerprint_sha256}`);
  console.log(`MP4 SHA256: ${mp4.sha256}`);
  return result;
}

async function validatePackage(inputPath = RESULT_PATH) {
  const sharp = await loadSharp();
  const before = await protectedInventory();
  const [model, manifest, result, root, source] = await Promise.all([
    readJson(MODEL_PATH),
    readJson(MANIFEST_PATH),
    readJson(inputPath),
    readJson(ROOT_MANIFEST_PATH),
    verifyInputs(sharp)
  ]);
  const failures = contractFailures(model);
  const require = (condition, message) => { if (!condition) failures.push(message); };
  require(result.passed === true && result.failures.length === 0, "result is not passing");
  require(result.targeted_tests?.all_passed === true, "targeted tests are not passing");
  require(result.browser_evidence?.passed === true, "browser evidence is not passing");
  require(root.active_default_artifact_id === DEFAULT_ID, "accepted preview is no longer active default");
  require(root.successor_candidate_artifact_id === ARTIFACT_ID, "successor candidate registration mismatch");
  require(root.private_materialized_motion_previs?.visual_verdict === "REJECTED_VISUAL_DIRECTION", "rejected candidate verdict changed");
  require(root.private_materialized_motion_previs?.archive_only === true && root.private_materialized_motion_previs?.successor_candidate === false, "rejected candidate archive boundary changed");
  require(root.private_full_raster_candidate?.default_active === false && root.private_full_raster_candidate?.successor_candidate === true, "root candidate state mismatch");
  require(root.private_full_raster_candidate?.package_fingerprint_sha256 === manifest.package_fingerprint_sha256, "root package fingerprint mismatch");
  const inventory = await packageInventory();
  require(inventory.aggregate_sha256 === manifest.package_fingerprint_sha256, "package fingerprint mismatch");
  require(valuesEqual(inventory.files, manifest.files), "package inventory differs");
  require(inventory.payload_file_count === manifest.payload_file_count, "package file count differs");
  for (const shot of model.shots) {
    const bytes = await readFile(path.join(REPO_ROOT, shot.image_path));
    const metadata = await sharp(bytes).metadata();
    require(sha256(bytes) === shot.sha256, `${shot.shot_id} final hash mismatch`);
    require(metadata.width === shot.width && metadata.height === shot.height, `${shot.shot_id} final dimensions mismatch`);
  }
  const liveMp4 = await probeMp4(MP4_PATH);
  require(valuesEqual(liveMp4, manifest.mp4), "live MP4 probe/hash mismatch");
  require(model.generation_evidence.call_count === source.attempts.attempts.length, "generation evidence call count mismatch");
  for (const view of ["desktop", "narrow"]) {
    const evidence = manifest.screenshots[view];
    const screenshot = await fileRecord(path.join(REPO_ROOT, evidence.path), REPO_ROOT);
    require(screenshot.byte_size === evidence.byte_size && screenshot.sha256 === evidence.sha256, `${view} screenshot mismatch`);
  }
  const after = await protectedInventory();
  require(valuesEqual(before, after), "read-only validator mutated protected inputs");
  if (failures.length) throw new Error(`Validation failed:\n- ${failures.join("\n- ")}`);
  console.log(`Validated ${ARTIFACT_ID}: PASS`);
  console.log(`Read-only protected inventory stable: ${after.length} files`);
  return { passed: true, failures: [] };
}

export { contractFailures, targetedTests };

export async function runPrivateFullRasterCandidateCommand({ command, inputPath }) {
  if (command === "validate-private-full-raster-candidate") return validatePackage(inputPath || RESULT_PATH);
  if (command === "smoke-private-full-raster-candidate") {
    const model = await readJson(MODEL_PATH);
    const tests = targetedTests(model);
    if (!tests.all_passed) throw new Error("Targeted smoke tests failed");
    console.log(JSON.stringify(tests, null, 2));
    return tests;
  }
  throw new Error(`Unsupported command: ${command}`);
}

async function main() {
  const command = process.argv[2] || "build";
  if (command === "build") await build();
  else if (command === "validate") await validatePackage(process.argv[3] ? path.resolve(process.argv[3]) : RESULT_PATH);
  else if (command === "smoke") {
    const model = await readJson(MODEL_PATH);
    const tests = targetedTests(model);
    console.log(JSON.stringify(tests, null, 2));
    if (!tests.all_passed) process.exitCode = 1;
  } else {
    throw new Error("Usage: node tools/fff-private-full-raster-candidate.mjs <build|validate|smoke>");
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });
}
