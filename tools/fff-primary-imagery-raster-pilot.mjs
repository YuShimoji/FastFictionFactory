import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PACKAGE_ROOT = path.join(REPO_ROOT, "artifacts", "high-fidelity-raster-pilot");
const IMAGE_ROOT = path.join(PACKAGE_ROOT, "images");
const MODEL_PATH = path.join(PACKAGE_ROOT, "high-fidelity-raster-pilot.json");
const HTML_PATH = path.join(PACKAGE_ROOT, "high-fidelity-raster-pilot.html");
const CSV_PATH = path.join(PACKAGE_ROOT, "source-provenance.csv");
const RECIPES_PATH = path.join(PACKAGE_ROOT, "prompt-or-composite-recipes.md");
const CONTACT_SHEET_PATH = path.join(PACKAGE_ROOT, "high-fidelity-raster-pilot-contact-sheet.jpg");
const MANIFEST_PATH = path.join(PACKAGE_ROOT, "high-fidelity-raster-pilot-manifest.json");
const RESULT_PATH = path.join(REPO_ROOT, "artifacts", "high-fidelity-raster-pilot-result.json");
const QUARANTINE_PATH = path.join(REPO_ROOT, "artifacts", "primary-imagery-quarantine", "primary-imagery-quarantine.json");
const ARTIFACT_MANIFEST_PATH = path.join(REPO_ROOT, "artifacts", "artifact-manifest.json");
const SCREENSHOTS = {
  desktop: path.join(REPO_ROOT, "artifacts", "review-screens", "high-fidelity-raster-pilot-desktop.png"),
  narrow: path.join(REPO_ROOT, "artifacts", "review-screens", "high-fidelity-raster-pilot-narrow.png")
};

const ARTIFACT_ID = "fff-high-fidelity-raster-pilot-001";
const QUARANTINE_ID = "FFF-Q-PRIMARY-IMAGERY-SVG-2026-07-25";
const REJECTED_ID = "fff-private-materialized-motion-previs-001";
const DEFAULT_ID = "fff-private-previsualization-timeline-001";
const EXACT_SHOT_IDS = ["shot-b04-01", "shot-b05-02", "shot-b02-03"];
const ALLOWED_SOURCE_KINDS = [
  "generated_raster",
  "curated_free_asset",
  "licensed_photocomposite",
  "taste_approved_high_fidelity_raster",
  "captured_real_media"
];
const FORBIDDEN_SOURCE_KINDS = [
  "svg_primary",
  "rasterized_svg_primary",
  "css_shape_primary",
  "canvas_primitive_primary",
  "generic_symbolic_primary",
  "blank_abstract_primary"
];
const EXPECTED_REJECTED_STATE = {
  visual_verdict: "REJECTED_VISUAL_DIRECTION",
  archive_only: true,
  active_default: false,
  successor_candidate: false,
  release_path_reachable: false,
  shared_generator_allowed: false,
  further_variant_generation_allowed: false
};
const PACKAGE_FILES = [
  "high-fidelity-raster-pilot.html",
  "high-fidelity-raster-pilot.json",
  "source-provenance.csv",
  "prompt-or-composite-recipes.md",
  "high-fidelity-raster-pilot-contact-sheet.jpg",
  "images/shot-b04-01.jpg",
  "images/shot-b05-02.jpg",
  "images/shot-b02-03.jpg"
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
  return await import(pathToFileURL(path.join(bundledNodeModules(), "playwright", "index.mjs")).href);
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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function unique(values) {
  return [...new Set(values)];
}

function valuesEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function validateQuarantine(quarantine) {
  const failures = [];
  if (quarantine?.quarantine_id !== QUARANTINE_ID) failures.push("quarantine id is missing or incorrect");
  if (quarantine?.status !== "ACTIVE") failures.push("quarantine must be ACTIVE");
  if (quarantine?.append_only !== true) failures.push("quarantine must be append-only");
  if (!valuesEqual(quarantine?.forbidden_primary_source_kinds, FORBIDDEN_SOURCE_KINDS)) failures.push("forbidden primary source kinds differ from the gate contract");
  if (!valuesEqual(quarantine?.allowed_primary_source_kinds, ALLOWED_SOURCE_KINDS)) failures.push("allowed primary source kinds differ from the gate contract");
  if (!Array.isArray(quarantine?.quarantined_signatures) || quarantine.quarantined_signatures.length !== 8) failures.push("eight quarantined signatures are required");
  if (!Array.isArray(quarantine?.allowed_svg_uses) || quarantine.allowed_svg_uses.length !== 8) failures.push("eight allowed SVG utility uses are required");
  return failures;
}

function validateManifestRegistration(manifest, quarantine) {
  const failures = [];
  const rejected = manifest?.private_materialized_motion_previs;
  const current = manifest?.private_previsualization_timeline;
  const pilot = manifest?.high_fidelity_raster_pilot;
  const gate = manifest?.primary_imagery_medium_gate;
  for (const [key, expected] of Object.entries(EXPECTED_REJECTED_STATE)) {
    if (rejected?.[key] !== expected) failures.push(`${REJECTED_ID}.${key} must be ${JSON.stringify(expected)}`);
  }
  if (manifest?.successor_candidate_artifact_id === REJECTED_ID || rejected?.successor_candidate === true) failures.push("rejected candidate was promoted into successor selection");
  if (manifest?.active_default_artifact_id !== DEFAULT_ID) failures.push(`${DEFAULT_ID} must remain the active default`);
  if (current?.active_default !== true) failures.push(`${DEFAULT_ID}.active_default must be true`);
  if (pilot?.artifact_id !== ARTIFACT_ID) failures.push("pilot registration is missing");
  if (pilot?.default_active !== false || pilot?.active_default !== false) failures.push("pilot must remain default-off");
  if (pilot?.successor_candidate !== false) failures.push("pilot must remain outside successor selection");
  if (pilot?.release_path_reachable !== false) failures.push("pilot must remain release-unreachable");
  if (pilot?.selected_for_production !== false || pilot?.rights_cleared_claim !== false) failures.push("pilot selection/rights boundaries must remain false");
  if (pilot?.quarantine_id !== quarantine?.quarantine_id) failures.push("pilot registration must bind the active quarantine");
  if (gate?.active !== true) failures.push("Primary Imagery Medium Gate must be active");
  if (gate?.quarantine_id !== quarantine?.quarantine_id) failures.push("Primary Imagery Medium Gate must bind the active quarantine");
  if (gate?.grandfathered_default_artifact_id !== DEFAULT_ID) failures.push("only the accepted old preview may use the grandfathered-default exemption");
  const candidates = Array.isArray(gate?.new_visual_candidates) ? gate.new_visual_candidates : [];
  const pilotGateEntry = candidates.find((candidate) => candidate?.artifact_id === ARTIFACT_ID);
  if (!pilotGateEntry) failures.push("pilot is missing from the Primary Imagery Medium Gate registry");
  if (pilotGateEntry && (pilotGateEntry.active_default !== false || pilotGateEntry.successor_candidate !== false)) failures.push("pilot gate registry state must remain default-off and non-successor");

  const requireCandidate = (artifactId, stateKey) => {
    const candidate = candidates.find((entry) => entry?.artifact_id === artifactId);
    if (!candidate) {
      failures.push(`${stateKey} visual artifact ${artifactId} lacks Primary Imagery Medium Gate metadata`);
      return;
    }
    if (candidate?.[stateKey] !== true) failures.push(`${artifactId}.${stateKey} registry state must be true`);
    if (!Array.isArray(candidate?.primary_frames) || candidate.primary_frames.length === 0) {
      failures.push(`${artifactId} active/default candidate is missing primary-frame source metadata`);
      return;
    }
    for (const frame of candidate.primary_frames) {
      if (!ALLOWED_SOURCE_KINDS.includes(frame?.source_kind)) failures.push(`${artifactId}/${frame?.shot_id || "unknown"} active/default frame has missing or forbidden source_kind`);
      if (FORBIDDEN_SOURCE_KINDS.includes(frame?.source_kind)) failures.push(`${artifactId}/${frame?.shot_id || "unknown"} active/default frame uses forbidden primary source`);
      if (frame?.rasterized_forbidden_vector !== false) failures.push(`${artifactId}/${frame?.shot_id || "unknown"} active/default frame has rasterized forbidden-vector lineage`);
    }
  };
  if (manifest?.active_default_artifact_id !== DEFAULT_ID) requireCandidate(manifest?.active_default_artifact_id, "active_default");
  if (manifest?.successor_candidate_artifact_id) requireCandidate(manifest.successor_candidate_artifact_id, "successor_candidate");
  return failures;
}

function validateShotContract(model) {
  const failures = [];
  if (model?.artifact_id !== ARTIFACT_ID) failures.push(`artifact_id must be ${ARTIFACT_ID}`);
  if (model?.schemaVersion !== "fff.highFidelityRasterPilot.v1") failures.push("unexpected pilot schemaVersion");
  if (!valuesEqual(model?.shot_ids, EXACT_SHOT_IDS)) failures.push("shot_ids must be the exact bounded three-shot order");
  if (!Array.isArray(model?.shots) || model.shots.length !== 3) return [...failures, "pilot must contain exactly three shots"];
  if (!valuesEqual(model.shots.map((shot) => shot.shot_id), EXACT_SHOT_IDS)) failures.push("shot rows must match the exact bounded three-shot order");
  const hashes = [];
  for (const shot of model.shots) {
    const label = shot?.shot_id || "unknown-shot";
    if (!ALLOWED_SOURCE_KINDS.includes(shot?.source_kind)) failures.push(`${label} source_kind is missing or forbidden`);
    if (FORBIDDEN_SOURCE_KINDS.includes(shot?.source_kind)) failures.push(`${label} uses a forbidden primary source kind`);
    if (shot?.source_lineage?.rasterized_forbidden_vector !== false) failures.push(`${label} must explicitly disavow rasterized forbidden-vector lineage`);
    if (shot?.source_lineage?.upstream_primary_kind !== "text_to_image_generated_raster") failures.push(`${label} upstream primary kind must be generated raster`);
    if (shot?.selected_for_production !== false) failures.push(`${label} selected_for_production must be false`);
    if (shot?.rights_cleared_claim !== false) failures.push(`${label} rights_cleared_claim must be false`);
    if (shot?.default_active !== false) failures.push(`${label} default_active must be false`);
    if (!Number.isFinite(shot?.start_seconds) || !Number.isFinite(shot?.end_seconds) || shot.end_seconds <= shot.start_seconds) failures.push(`${label} timing is invalid`);
    if (typeof shot?.truth_boundary !== "string" || shot.truth_boundary.length < 12) failures.push(`${label} truth boundary is missing`);
    if (typeof shot?.image_path !== "string" || !shot.image_path.endsWith(`${label}.jpg`)) failures.push(`${label} image path is invalid`);
    if (!/^[0-9a-f]{64}$/.test(shot?.sha256 || "")) failures.push(`${label} SHA256 is missing`);
    if (shot?.width !== 1600 || shot?.height !== 900) failures.push(`${label} must declare 1600x900`);
    if (!shot?.generation_record?.tool || !shot?.generation_record?.prompt) failures.push(`${label} generation record is incomplete`);
    if (shot?.generation_record?.seed !== null) failures.push(`${label} seed must remain null when unobserved`);
    hashes.push(shot?.sha256);
  }
  if (unique(hashes).length !== 3) failures.push("each pilot image must have a unique SHA256");
  const counts = model?.medium_counts || {};
  for (const key of FORBIDDEN_SOURCE_KINDS) {
    if (counts[key] !== 0) failures.push(`${key}_count must be zero`);
  }
  if (model?.default_active !== false || model?.release_path_reachable !== false) failures.push("pilot must be default-off and release-unreachable");
  return failures;
}

async function inspectPrimaryImages(model) {
  const failures = [];
  const sharp = await loadSharp();
  for (const shot of model.shots || []) {
    const absolute = path.join(REPO_ROOT, ...String(shot.image_path || "").split("/"));
    let bytes;
    try {
      bytes = await readFile(absolute);
    } catch {
      failures.push(`${shot.shot_id} primary image is missing`);
      continue;
    }
    const metadata = await sharp(bytes).metadata();
    if (metadata.format !== "jpeg") failures.push(`${shot.shot_id} primary image must be JPEG raster`);
    if (metadata.width !== 1600 || metadata.height !== 900) failures.push(`${shot.shot_id} actual dimensions must be 1600x900`);
    if (sha256(bytes) !== shot.sha256) failures.push(`${shot.shot_id} actual SHA256 differs from the model`);
    if (bytes.subarray(0, 2).toString("hex") !== "ffd8") failures.push(`${shot.shot_id} lacks JPEG raster signature`);
  }
  const entries = await readdir(IMAGE_ROOT, { withFileTypes: true });
  const rasterFiles = entries.filter((entry) => entry.isFile() && /\.(?:jpe?g|png|webp)$/i.test(entry.name));
  if (rasterFiles.length !== 3) failures.push(`images/ must contain exactly three raster files, found ${rasterFiles.length}`);
  if (entries.some((entry) => entry.isFile() && /\.svg$/i.test(entry.name))) failures.push("SVG file found in pilot images/");
  return failures;
}

function provenanceCsv(model) {
  const headers = [
    "shot_id",
    "image_path",
    "source_kind",
    "tool",
    "model",
    "seed",
    "generated_original_path",
    "generated_original_mime",
    "generated_original_sha256",
    "retrieval_date",
    "postprocess_recipe",
    "width",
    "height",
    "sha256",
    "selected_for_production",
    "rights_cleared_claim",
    "default_active"
  ];
  const rows = model.shots.map((shot) => {
    const record = shot.generation_record;
    return [
      shot.shot_id,
      shot.image_path,
      shot.source_kind,
      record.tool,
      record.model ?? "",
      record.seed ?? "",
      record.generated_original_path,
      record.generated_original_mime,
      record.generated_original_sha256,
      record.generated_at,
      record.postprocess_recipe,
      shot.width,
      shot.height,
      shot.sha256,
      shot.selected_for_production,
      shot.rights_cleared_claim,
      shot.default_active
    ].map(csvEscape).join(",");
  });
  return `${headers.join(",")}\n${rows.join("\n")}\n`;
}

function recipesMarkdown(model) {
  const sections = model.shots.map((shot) => {
    const record = shot.generation_record;
    return `## ${shot.shot_id}

- Source kind: \`${shot.source_kind}\`
- Tool: ${record.tool}
- Model: ${record.model ?? "not exposed by the built-in tool"}
- Seed: ${record.seed ?? "not exposed"}
- Built-in output: \`${record.generated_original_path}\`
- Built-in output SHA256: \`${record.generated_original_sha256}\`
- Raster post-process: ${record.postprocess_recipe}
- Final image: \`${shot.image_path}\`
- Final SHA256: \`${shot.sha256}\`

### Prompt

\`\`\`text
${record.prompt}
\`\`\`
`;
  }).join("\n");
  return `# High-Fidelity Raster Pilot prompts and recipes

All three primaries were generated with the built-in raster image-generation facility. The facility did not expose a model name or seed, so neither is invented here. The generated originals remain outside the repository at the observed paths; the repository contains only the three bounded 1600x900 JPEG primaries.

Taste usage: unavailable. No Taste skill was present in the execution environment, and no Taste claim is made.

No SVG, rasterized SVG, CSS-shape scene, Canvas primitive scene, generic geometric pseudo-art, or licensed third-party asset was used for these three primaries.

${sections}`;
}

function themeControls() {
  return `<fieldset class="theme" aria-label="表示テーマ">
    <legend>Theme</legend>
    <label><input type="radio" name="theme" value="auto" checked>Auto</label>
    <label><input type="radio" name="theme" value="light">Light</label>
    <label><input type="radio" name="theme" value="dark">Dark</label>
  </fieldset>`;
}

function shotMarkup(shot, index) {
  const candidateLabels = shot.shot_id === "shot-b05-02"
    ? `<div class="candidates" aria-label="未解決の機能候補"><span>鍵？</span><span>監視？</span><span>記憶？</span></div>`
    : "";
  return `<article class="shot" id="${escapeHtml(shot.shot_id)}">
    <header>
      <p class="eyebrow">${String(index + 1).padStart(2, "0")} / ${escapeHtml(shot.shot_id)} · ${escapeHtml(shot.start_time)}–${escapeHtml(shot.end_time)}</p>
      <h2>${escapeHtml(shot.title_ja)}</h2>
      <p>${escapeHtml(shot.review_intent)}</p>
    </header>
    <figure>
      <img src="./images/${escapeHtml(shot.shot_id)}.jpg" width="1600" height="900" alt="${escapeHtml(shot.alt_ja)}">${candidateLabels ? `\n      ${candidateLabels}` : ""}
    </figure>
    <dl>
      <div><dt>Source</dt><dd>${escapeHtml(shot.source_kind)}</dd></div>
      <div><dt>Timing</dt><dd>${escapeHtml(shot.duration_seconds)}秒 · ${escapeHtml(shot.motion)} · ${escapeHtml(shot.transition)}</dd></div>
      <div><dt>Truth boundary</dt><dd>${escapeHtml(shot.truth_boundary)}</dd></div>
      <div><dt>State</dt><dd>candidate-only · default-off · rights not cleared</dd></div>
    </dl>
  </article>`;
}

function renderHtml(model) {
  const anti = [
    {
      label: "rounded silhouette",
      src: "../private-materialized-motion-previs/materials/AR-CHAR-02/council-neutral.png",
      note: "人物を丸い記号へ縮約した方向"
    },
    {
      label: "line icon + cards",
      src: "../private-materialized-motion-previs/materials/AR-DOC-02/moth-functions.png",
      note: "線画の蛾と反復パネル"
    },
    {
      label: "vector clock",
      src: "../private-materialized-motion-previs/materials/AR-PROP-01/time-0917.png",
      note: "平坦な時計面を主画像にした方向"
    }
  ];
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <title>High-Fidelity Raster Pilot</title>
  <style>
    :root { --bg:#eef0ed; --paper:#faf9f5; --ink:#181b1c; --muted:#5f6666; --line:#c9cbc5; --accent:#8a5b23; --shadow:0 18px 48px #19222217; color-scheme:light dark; }
    :root:has(input[value="dark"]:checked) { --bg:#111516; --paper:#191e1f; --ink:#f2f0e8; --muted:#aab0ad; --line:#394041; --accent:#d9a25d; --shadow:0 18px 56px #0008; color-scheme:dark; }
    :root:has(input[value="light"]:checked) { --bg:#eef0ed; --paper:#faf9f5; --ink:#181b1c; --muted:#5f6666; --line:#c9cbc5; --accent:#8a5b23; --shadow:0 18px 48px #19222217; color-scheme:light; }
    @media (prefers-color-scheme:dark) { :root { --bg:#111516; --paper:#191e1f; --ink:#f2f0e8; --muted:#aab0ad; --line:#394041; --accent:#d9a25d; --shadow:0 18px 56px #0008; } }
    * { box-sizing:border-box; }
    html { background:var(--bg); color:var(--ink); font-family:Inter, "Yu Gothic UI", "Hiragino Sans", system-ui, sans-serif; }
    body { margin:0; min-width:0; }
    img { display:block; max-width:100%; height:auto; }
    .shell { width:min(1180px, calc(100% - 40px)); margin:0 auto; padding:26px 0 80px; }
    .topbar { display:flex; justify-content:space-between; align-items:flex-start; gap:20px; padding-bottom:24px; border-bottom:1px solid var(--line); }
    .topbar h1 { font:700 clamp(1.15rem,2.2vw,1.55rem)/1.15 Georgia,serif; margin:.2rem 0 .35rem; }
    .topbar p { margin:0; color:var(--muted); max-width:760px; }
    .status { color:var(--accent); letter-spacing:.12em; font-size:.72rem; text-transform:uppercase; }
    .theme { border:0; padding:0; margin:0; display:flex; gap:6px; flex:0 0 auto; }
    .theme legend { position:absolute; width:1px; height:1px; clip:rect(0,0,0,0); overflow:hidden; }
    .theme label { border:1px solid var(--line); border-radius:999px; padding:7px 10px; font-size:.72rem; cursor:pointer; }
    .theme input { position:absolute; opacity:0; }
    .theme label:has(input:checked) { border-color:var(--accent); color:var(--accent); }
    .shots { display:grid; gap:56px; padding:48px 0; }
    .shot { display:grid; grid-template-columns:minmax(210px,.34fr) minmax(0,1fr); gap:24px 32px; align-items:start; }
    .shot header { position:sticky; top:20px; }
    .eyebrow { color:var(--accent)!important; letter-spacing:.1em; font-size:.74rem; text-transform:uppercase; }
    .shot h2 { font:700 clamp(1.45rem,3vw,2.1rem)/1.08 Georgia,serif; margin:.5rem 0 .75rem; }
    .shot header p { color:var(--muted); line-height:1.7; }
    .shot figure { margin:0; position:relative; box-shadow:var(--shadow); background:#000; }
    .shot figure img { width:100%; aspect-ratio:16/9; object-fit:cover; }
    .candidates { position:absolute; inset:auto 18px 18px 18px; display:flex; justify-content:flex-end; gap:8px; }
    .candidates span { background:#121616cc; color:#f5efe4; border:1px solid #ffffff38; backdrop-filter:blur(8px); border-radius:999px; padding:7px 11px; font-size:.72rem; }
    dl { grid-column:2; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:1px; margin:0; background:var(--line); border:1px solid var(--line); }
    dl div { background:var(--paper); padding:12px 14px; min-width:0; }
    dt { color:var(--muted); font-size:.68rem; letter-spacing:.08em; text-transform:uppercase; margin-bottom:4px; }
    dd { margin:0; line-height:1.55; overflow-wrap:anywhere; }
    .anti { border-top:1px solid var(--line); padding-top:32px; }
    .anti-head { display:flex; justify-content:space-between; gap:20px; align-items:end; margin-bottom:18px; }
    .anti h2 { font:700 1.25rem/1.2 Georgia,serif; margin:0; }
    .anti-head p { margin:0; color:var(--muted); max-width:620px; }
    .anti-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; }
    .anti figure { margin:0; border:1px solid var(--line); background:var(--paper); opacity:.72; }
    .anti img { width:100%; aspect-ratio:16/9; object-fit:cover; filter:saturate(.45) contrast(.9); }
    .anti figcaption { padding:10px 12px; color:var(--muted); font-size:.76rem; line-height:1.5; }
    .anti strong { color:var(--ink); display:block; }
    footer { margin-top:44px; border-top:1px solid var(--line); padding-top:18px; color:var(--muted); font-size:.78rem; line-height:1.6; }
    @media (max-width:760px) {
      .shell { width:min(100% - 24px, 620px); padding-top:14px; }
      .topbar { display:grid; }
      .shot { grid-template-columns:1fr; gap:14px; }
      .shot header { position:static; }
      dl { grid-column:1; grid-template-columns:1fr; }
      .anti-head { display:grid; }
      .anti-grid { grid-template-columns:repeat(3,minmax(0,1fr)); gap:6px; }
      .anti figcaption { padding:6px; font-size:.64rem; }
    }
    @media print { :root { --bg:#fff; --paper:#fff; --ink:#111; --muted:#555; --line:#bbb; } .theme { display:none; } .shot { break-inside:avoid; } }
  </style>
</head>
<body>
  <main class="shell">
    <section class="topbar">
      <div>
        <span class="status">Default off · candidate only · three shots</span>
        <h1>High-Fidelity Raster Pilot</h1>
        <p>一次画像の媒体を3ショットだけ検証する Product Owner 向けレビュー面。旧SVG方向は比較用の小さな anti-reference としてのみ表示します。</p>
      </div>
      ${themeControls()}
    </section>
    <section class="shots" aria-label="新しいラスター一次画像">
      ${model.shots.map(shotMarkup).join("\n")}
    </section>
    <section class="anti">
      <div class="anti-head"><h2>Quarantined anti-reference</h2><p>以下は再利用・改稿・変種生成の対象ではありません。新しい3枚が避けるべき署名を確認するためだけの縮小比較です。</p></div>
      <div class="anti-grid">
        ${anti.map((item) => `<figure><img src="${escapeHtml(item.src)}" alt=""><figcaption><strong>${escapeHtml(item.label)}</strong>${escapeHtml(item.note)}</figcaption></figure>`).join("\n")}
      </div>
    </section>
    <footer>Quarantine ${QUARANTINE_ID} · ${REJECTED_ID} is archive-only · ${DEFAULT_ID} remains the active default. No production selection, rights clearance, release, or canon claim.</footer>
  </main>
</body>
</html>
`;
}

async function renderContactSheet(model) {
  const sharp = await loadSharp();
  const width = 1600;
  const tileHeight = 300;
  const labelWidth = 255;
  const canvas = sharp({
    create: { width, height: tileHeight * 3, channels: 3, background: "#121718" }
  });
  const composites = [];
  for (let index = 0; index < model.shots.length; index += 1) {
    const shot = model.shots[index];
    const imagePath = path.join(REPO_ROOT, ...shot.image_path.split("/"));
    const tile = await sharp(imagePath).resize(width - labelWidth, tileHeight, { fit: "cover" }).jpeg({ quality: 90 }).toBuffer();
    const label = Buffer.from(`<svg width="${labelWidth}" height="${tileHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#121718"/><text x="28" y="78" fill="#d9a25d" font-family="Arial" font-size="21">${escapeHtml(shot.shot_id)}</text><text x="28" y="116" fill="#f2f0e8" font-family="Arial" font-size="18">${escapeHtml(shot.start_time)}–${escapeHtml(shot.end_time)}</text><text x="28" y="155" fill="#aab0ad" font-family="Arial" font-size="15">generated raster</text><text x="28" y="184" fill="#aab0ad" font-family="Arial" font-size="15">default off</text></svg>`);
    composites.push({ input: label, left: 0, top: index * tileHeight });
    composites.push({ input: tile, left: labelWidth, top: index * tileHeight });
  }
  await canvas.composite(composites).jpeg({ quality: 90, chromaSubsampling: "4:4:4" }).toFile(CONTACT_SHEET_PATH);
}

async function fileManifest() {
  const files = [];
  for (const relative of PACKAGE_FILES) {
    const absolute = path.join(PACKAGE_ROOT, ...relative.split("/"));
    const bytes = await readFile(absolute);
    files.push({ path: `artifacts/high-fidelity-raster-pilot/${relative}`, byte_size: bytes.length, sha256: sha256(bytes) });
  }
  const aggregate = files.map((entry) => `${entry.path}|${entry.byte_size}|${entry.sha256}`).join("\n");
  return {
    schemaVersion: "fff.highFidelityRasterPilotManifest.v1",
    artifact_id: ARTIFACT_ID,
    quarantine_id: QUARANTINE_ID,
    file_count: files.length,
    files,
    package_fingerprint_sha256: sha256(Buffer.from(aggregate, "utf8"))
  };
}

async function validatePackage({ includeResult = true } = {}) {
  const failures = [];
  const [model, quarantine, artifactManifest] = await Promise.all([
    readJson(MODEL_PATH),
    readJson(QUARANTINE_PATH),
    readJson(ARTIFACT_MANIFEST_PATH)
  ]);
  failures.push(...validateQuarantine(quarantine));
  failures.push(...validateManifestRegistration(artifactManifest, quarantine));
  failures.push(...validateShotContract(model));
  failures.push(...await inspectPrimaryImages(model));

  const expectedCsv = provenanceCsv(model);
  const expectedRecipes = recipesMarkdown(model);
  const expectedHtml = renderHtml(model);
  const [actualCsv, actualRecipes, actualHtml, actualManifest] = await Promise.all([
    readFile(CSV_PATH, "utf8"),
    readFile(RECIPES_PATH, "utf8"),
    readFile(HTML_PATH, "utf8"),
    readJson(MANIFEST_PATH)
  ]);
  if (actualCsv !== expectedCsv) failures.push("source-provenance.csv differs from the model");
  if (actualRecipes !== expectedRecipes) failures.push("prompt-or-composite-recipes.md differs from the model");
  if (actualHtml !== expectedHtml) failures.push("review HTML differs from the model");
  if (/https?:\/\//i.test(actualHtml)) failures.push("review HTML contains a remote URL");
  if ((actualHtml.match(/class="shot"/g) || []).length !== 3) failures.push("review HTML must render exactly three pilot shots");
  if ((actualHtml.match(/class="anti"/g) || []).length !== 1) failures.push("review HTML anti-reference section is missing");
  const rebuiltManifest = await fileManifest();
  if (!valuesEqual(actualManifest, rebuiltManifest)) failures.push("package manifest differs from current package bytes");

  if (includeResult) {
    const result = await readJson(RESULT_PATH);
    if (result?.passed !== true || !Array.isArray(result?.failures) || result.failures.length !== 0) failures.push("result JSON is not green");
    if (result?.artifact_id !== ARTIFACT_ID || result?.quarantine_id !== QUARANTINE_ID) failures.push("result identity differs");
    if (result?.shot_count !== 3 || result?.primary_raster_image_count !== 3) failures.push("result must report exactly three shots and three primary rasters");
    if (result?.targeted_tests?.all_passed !== true || result?.targeted_tests?.passed !== result?.targeted_tests?.total) failures.push("targeted positive/negative tests are not green");
    if (result?.browser_evidence?.passed !== true) failures.push("browser evidence is not green");
    for (const viewName of ["desktop", "narrow"]) {
      const evidence = result?.browser_evidence?.[viewName];
      const expectedPath = SCREENSHOTS[viewName];
      let bytes;
      try {
        bytes = await readFile(expectedPath);
      } catch {
        failures.push(`${viewName} screenshot is missing`);
        continue;
      }
      if (evidence?.path !== repoPath(expectedPath)) failures.push(`${viewName} screenshot path differs`);
      if (evidence?.byte_size !== bytes.length || evidence?.sha256 !== sha256(bytes)) failures.push(`${viewName} screenshot bytes differ from recorded evidence`);
      if (evidence?.horizontal_overflow_px !== 0 || evidence?.nested_vertical_scroll_count !== 0) failures.push(`${viewName} screenshot runtime layout evidence is not clean`);
    }
  }
  return { model, quarantine, artifactManifest, failures };
}

function negativeProbeCases(model, quarantine, manifest) {
  const clone = (value) => structuredClone(value);
  const cases = [];
  const forbidden = clone(model);
  forbidden.shots[0].source_kind = "svg_primary";
  cases.push({
    id: "reject-forbidden-primary-source",
    expected_failure: "source_kind is missing or forbidden",
    failures: validateShotContract(forbidden)
  });
  const missing = clone(model);
  delete missing.shots[0].source_kind;
  cases.push({
    id: "reject-missing-primary-source-kind",
    expected_failure: "source_kind is missing or forbidden",
    failures: validateShotContract(missing)
  });
  const rasterized = clone(model);
  rasterized.shots[0].source_lineage.rasterized_forbidden_vector = true;
  cases.push({
    id: "reject-rasterized-forbidden-vector",
    expected_failure: "rasterized forbidden-vector lineage",
    failures: validateShotContract(rasterized)
  });
  const promoted = clone(manifest);
  promoted.successor_candidate_artifact_id = REJECTED_ID;
  promoted.private_materialized_motion_previs.successor_candidate = true;
  cases.push({
    id: "reject-archived-candidate-promotion",
    expected_failure: "rejected candidate was promoted",
    failures: validateManifestRegistration(promoted, quarantine)
  });
  const activeForbidden = clone(manifest);
  activeForbidden.active_default_artifact_id = ARTIFACT_ID;
  activeForbidden.high_fidelity_raster_pilot.active_default = true;
  activeForbidden.high_fidelity_raster_pilot.default_active = true;
  activeForbidden.primary_imagery_medium_gate.new_visual_candidates[0].active_default = true;
  activeForbidden.primary_imagery_medium_gate.new_visual_candidates[0].primary_frames[0].source_kind = "svg_primary";
  cases.push({
    id: "reject-active-default-forbidden-primary",
    expected_failure: "active/default frame uses forbidden primary source",
    failures: validateManifestRegistration(activeForbidden, quarantine)
  });
  const activeMissing = clone(manifest);
  activeMissing.active_default_artifact_id = ARTIFACT_ID;
  activeMissing.high_fidelity_raster_pilot.active_default = true;
  activeMissing.high_fidelity_raster_pilot.default_active = true;
  activeMissing.primary_imagery_medium_gate.new_visual_candidates[0].active_default = true;
  delete activeMissing.primary_imagery_medium_gate.new_visual_candidates[0].primary_frames[0].source_kind;
  cases.push({
    id: "reject-active-default-missing-primary-kind",
    expected_failure: "active/default frame has missing or forbidden source_kind",
    failures: validateManifestRegistration(activeMissing, quarantine)
  });
  const missingQuarantine = clone(quarantine);
  missingQuarantine.status = "MISSING";
  cases.push({
    id: "reject-missing-active-quarantine",
    expected_failure: "quarantine must be ACTIVE",
    failures: validateQuarantine(missingQuarantine)
  });
  return cases.map((probe) => ({
    id: probe.id,
    expected_failure: probe.expected_failure,
    passed: probe.failures.some((failure) => failure.includes(probe.expected_failure)),
    observed_failures: probe.failures
  }));
}

async function captureBrowserEvidence() {
  const { chromium } = await loadPlaywright();
  await mkdir(path.dirname(SCREENSHOTS.desktop), { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const consoleErrors = [];
  const pageErrors = [];
  const externalRequests = [];
  const inspect = async (name, width, height, screenshotPath) => {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(`${name}: ${message.text()}`);
    });
    page.on("pageerror", (error) => pageErrors.push(`${name}: ${error.message}`));
    page.on("request", (request) => {
      const url = request.url();
      if (!url.startsWith("file:") && url !== "about:blank") externalRequests.push(url);
    });
    await page.goto(pathToFileURL(HTML_PATH).href, { waitUntil: "load" });
    await page.screenshot({ path: screenshotPath, fullPage: true });
    const metrics = await page.evaluate(() => {
      const nested = [...document.querySelectorAll("*")].filter((element) => {
        if (element === document.documentElement || element === document.body) return false;
        const style = getComputedStyle(element);
        return /(auto|scroll)/.test(style.overflowY) && element.scrollHeight > element.clientHeight + 1;
      });
      const firstImage = document.querySelector(".shot img");
      const antiImage = document.querySelector(".anti img");
      return {
        viewport_width: innerWidth,
        viewport_height: innerHeight,
        document_width: document.documentElement.scrollWidth,
        horizontal_overflow_px: Math.max(0, document.documentElement.scrollWidth - innerWidth),
        nested_vertical_scroll_count: nested.length,
        pilot_image_rendered_width: Math.round(firstImage?.getBoundingClientRect().width || 0),
        anti_reference_rendered_width: Math.round(antiImage?.getBoundingClientRect().width || 0),
        theme_control_count: document.querySelectorAll('.theme input[name="theme"]').length,
        shot_count: document.querySelectorAll(".shot").length,
        anti_reference_count: document.querySelectorAll(".anti-grid figure").length
      };
    });
    await page.close();
    const bytes = await readFile(screenshotPath);
    return { path: repoPath(screenshotPath), byte_size: bytes.length, sha256: sha256(bytes), ...metrics };
  };
  try {
    const desktop = await inspect("desktop", 1440, 1000, SCREENSHOTS.desktop);
    const narrow = await inspect("narrow", 390, 844, SCREENSHOTS.narrow);
    const failures = [];
    for (const view of [desktop, narrow]) {
      if (view.horizontal_overflow_px !== 0) failures.push(`${view.path} has horizontal overflow`);
      if (view.nested_vertical_scroll_count !== 0) failures.push(`${view.path} has nested vertical scroll`);
      if (view.theme_control_count !== 3) failures.push(`${view.path} is missing Light/Dark/Auto controls`);
      if (view.shot_count !== 3 || view.anti_reference_count !== 3) failures.push(`${view.path} has incorrect shot/anti-reference count`);
      if (view.pilot_image_rendered_width <= view.anti_reference_rendered_width) failures.push(`${view.path} does not let new pilot imagery dominate`);
    }
    failures.push(...consoleErrors, ...pageErrors);
    if (externalRequests.length) failures.push(`external browser requests: ${unique(externalRequests).join(", ")}`);
    return {
      passed: failures.length === 0,
      engine: "playwright chromium",
      headless: true,
      console_errors: consoleErrors,
      page_errors: pageErrors,
      external_requests: unique(externalRequests),
      failures,
      desktop,
      narrow
    };
  } finally {
    await browser.close();
  }
}

async function buildPackage() {
  await mkdir(PACKAGE_ROOT, { recursive: true });
  const [model, quarantine, artifactManifest] = await Promise.all([
    readJson(MODEL_PATH),
    readJson(QUARANTINE_PATH),
    readJson(ARTIFACT_MANIFEST_PATH)
  ]);
  const preflightFailures = [
    ...validateQuarantine(quarantine),
    ...validateManifestRegistration(artifactManifest, quarantine),
    ...validateShotContract(model),
    ...await inspectPrimaryImages(model)
  ];
  if (preflightFailures.length) throw new Error(`pilot preflight failed: ${preflightFailures.join("; ")}`);

  await Promise.all([
    writeFile(CSV_PATH, provenanceCsv(model), "utf8"),
    writeFile(RECIPES_PATH, recipesMarkdown(model), "utf8"),
    writeFile(HTML_PATH, renderHtml(model), "utf8")
  ]);
  await renderContactSheet(model);
  await writeFile(MANIFEST_PATH, `${JSON.stringify(await fileManifest(), null, 2)}\n`, "utf8");

  const probes = negativeProbeCases(model, quarantine, artifactManifest);
  const browserEvidence = await captureBrowserEvidence();
  const failures = [];
  if (probes.some((probe) => !probe.passed)) failures.push("one or more Primary Imagery Medium Gate probes did not fail closed");
  failures.push(...browserEvidence.failures);
  const manifest = await readJson(MANIFEST_PATH);
  const result = {
    schemaVersion: "fff.highFidelityRasterPilotResult.v1",
    artifact_id: ARTIFACT_ID,
    quarantine_id: QUARANTINE_ID,
    passed: failures.length === 0,
    failures,
    shot_count: 3,
    primary_raster_image_count: 3,
    primary_svg_scene_count: 0,
    rasterized_svg_primary_count: 0,
    css_shape_primary_count: 0,
    canvas_primitive_primary_count: 0,
    generic_symbolic_primary_count: 0,
    blank_abstract_primary_count: 0,
    generated_raster_count: 3,
    selected_for_production_count: 0,
    rights_cleared_claim_count: 0,
    default_active_count: 0,
    taste_used: false,
    taste_availability: "unavailable_no_taste_skill_present",
    image_generation: {
      used: true,
      facility: "built-in image_gen",
      observed_model: null,
      observed_seed_count: 0,
      paid_call_or_new_credentials: false
    },
    active_default_artifact_id: DEFAULT_ID,
    rejected_candidate: { artifact_id: REJECTED_ID, ...EXPECTED_REJECTED_STATE },
    release_path_reachable: false,
    targeted_tests: {
      total: probes.length + 1,
      passed: probes.filter((probe) => probe.passed).length + 1,
      all_passed: probes.every((probe) => probe.passed),
      cases: [
        { id: "accept-three-generated-raster-primaries", passed: true, observed_failures: [] },
        ...probes
      ]
    },
    browser_evidence: browserEvidence,
    package_manifest: {
      path: repoPath(MANIFEST_PATH),
      file_count: manifest.file_count,
      package_fingerprint_sha256: manifest.package_fingerprint_sha256
    },
    primary_images: model.shots.map((shot) => ({
      shot_id: shot.shot_id,
      path: shot.image_path,
      width: shot.width,
      height: shot.height,
      sha256: shot.sha256,
      source_kind: shot.source_kind
    })),
    boundaries: {
      default_off: true,
      archive_rejected_candidate_only: true,
      production_selection: false,
      rights_clearance: false,
      public_deployment: false,
      publication: false,
      voice_audio_video_generation: false,
      final_canon: false
    }
  };
  await writeFile(RESULT_PATH, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  const validation = await validatePackage({ includeResult: true });
  if (validation.failures.length) throw new Error(`post-build validation failed: ${validation.failures.join("; ")}`);
  return result;
}

async function ingestSources(args) {
  const mappings = {
    "shot-b04-01": args["shot-b04-01"],
    "shot-b05-02": args["shot-b05-02"],
    "shot-b02-03": args["shot-b02-03"]
  };
  if (Object.values(mappings).some((value) => !value)) throw new Error("ingest requires --shot-b04-01, --shot-b05-02, and --shot-b02-03");
  const sharp = await loadSharp();
  await mkdir(IMAGE_ROOT, { recursive: true });
  const records = [];
  for (const shotId of EXACT_SHOT_IDS) {
    const sourcePath = path.resolve(mappings[shotId]);
    const sourceBytes = await readFile(sourcePath);
    const sourceMetadata = await sharp(sourceBytes).metadata();
    const outputPath = path.join(IMAGE_ROOT, `${shotId}.jpg`);
    await sharp(sourceBytes)
      .resize(1600, 900, { fit: "cover", position: "centre" })
      .jpeg({ quality: 94, chromaSubsampling: "4:4:4", mozjpeg: true })
      .toFile(outputPath);
    const outputBytes = await readFile(outputPath);
    const outputMetadata = await sharp(outputBytes).metadata();
    records.push({
      shot_id: shotId,
      generated_original_path: sourcePath,
      generated_original_format: sourceMetadata.format,
      generated_original_width: sourceMetadata.width,
      generated_original_height: sourceMetadata.height,
      generated_original_sha256: sha256(sourceBytes),
      final_path: repoPath(outputPath),
      final_width: outputMetadata.width,
      final_height: outputMetadata.height,
      final_sha256: sha256(outputBytes)
    });
  }
  process.stdout.write(`${JSON.stringify({ ingested: records }, null, 2)}\n`);
}

function parseFlags(tokens) {
  const result = {};
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token.startsWith("--")) continue;
    result[token.slice(2)] = tokens[index + 1];
    index += 1;
  }
  return result;
}

export async function runPrimaryImageryRasterPilotCommand({ command, inputPath }) {
  if (command === "smoke-primary-imagery-raster-pilot") {
    const target = path.resolve(REPO_ROOT, inputPath || repoPath(RESULT_PATH));
    if (target !== RESULT_PATH) throw new Error(`smoke may write only ${repoPath(RESULT_PATH)} and the new pilot-owned outputs`);
    const result = await buildPackage();
    process.stdout.write(`${JSON.stringify({ ok: true, artifact_id: ARTIFACT_ID, result: repoPath(RESULT_PATH), targeted_tests: result.targeted_tests }, null, 2)}\n`);
    return;
  }
  if (command === "validate-primary-imagery-raster-pilot") {
    const target = path.resolve(REPO_ROOT, inputPath || repoPath(RESULT_PATH));
    if (target !== RESULT_PATH) throw new Error(`validate expects ${repoPath(RESULT_PATH)}`);
    const validation = await validatePackage({ includeResult: true });
    if (validation.failures.length) throw new Error(validation.failures.join("; "));
    const result = await readJson(RESULT_PATH);
    process.stdout.write(`${JSON.stringify({
      ok: true,
      artifact_id: ARTIFACT_ID,
      active_default_artifact_id: DEFAULT_ID,
      rejected_candidate_visual_verdict: EXPECTED_REJECTED_STATE.visual_verdict,
      shot_count: result.shot_count,
      primary_raster_image_count: result.primary_raster_image_count,
      targeted_tests: result.targeted_tests,
      browser_evidence_passed: result.browser_evidence.passed
    }, null, 2)}\n`);
    return;
  }
  throw new Error(`unsupported Primary Imagery Raster Pilot command: ${command}`);
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const command = process.argv[2];
  try {
    if (command === "ingest") {
      await ingestSources(parseFlags(process.argv.slice(3)));
    } else if (command === "build") {
      await buildPackage();
      process.stdout.write(`${JSON.stringify({ ok: true, result: repoPath(RESULT_PATH) }, null, 2)}\n`);
    } else if (command === "validate") {
      await runPrimaryImageryRasterPilotCommand({ command: "validate-primary-imagery-raster-pilot", inputPath: repoPath(RESULT_PATH) });
    } else {
      process.stderr.write("Usage:\n  node tools/fff-primary-imagery-raster-pilot.mjs ingest --shot-b04-01 <png> --shot-b05-02 <png> --shot-b02-03 <png>\n  node tools/fff-primary-imagery-raster-pilot.mjs build\n  node tools/fff-primary-imagery-raster-pilot.mjs validate\n");
      process.exitCode = 1;
    }
  } catch (error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}
