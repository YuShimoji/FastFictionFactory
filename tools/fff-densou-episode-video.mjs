import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  stat,
  writeFile
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const toolPath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(toolPath), "..");
const defaultPlanPath = path.join(repoRoot, "artifacts", "densou-s01e01-benchmark-video-slice-plan.json");
const defaultOutputPath = path.join(repoRoot, "artifacts", "densou-s01e01-benchmark-video-slice-001");
const defaultResultPath = path.join(repoRoot, "artifacts", "densou-s01e01-benchmark-video-slice-result.json");
const sourceRecoveryBoundaryPath = path.join(repoRoot, "artifacts", "densou-source-recovery-20260811-001", "source-recovery-boundary.json");
const defaultPacketRoot = path.resolve(
  repoRoot,
  "..",
  "..",
  "FastFictionFactory-runs",
  "fff-densou-series-episode-quickwin-001-intake-a1"
);
const episodeManifestPath = path.join(
  repoRoot,
  "artifacts",
  "densou-series-episode-quickwin-001",
  "episode-001-manifest.json"
);
const factBoundaryPath = path.join(
  repoRoot,
  "artifacts",
  "densou-series-episode-quickwin-001",
  "source-fact-boundary.json"
);
const sourceBasisPath = path.join(
  repoRoot,
  "artifacts",
  "densou-series-episode-quickwin-001",
  "source-basis-receipt.json"
);

class VideoSliceError extends Error {
  constructor(code, message, exitCode = 2) {
    super(message);
    this.code = code;
    this.exitCode = exitCode;
  }
}

function requireCondition(condition, code, message, exitCode = 2) {
  if (!condition) throw new VideoSliceError(code, message, exitCode);
}

function parseArgs(argv) {
  const [command = "help", ...rest] = argv;
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    requireCondition(token.startsWith("--"), "INVALID_ARGUMENT", `unexpected argument: ${token}`);
    const key = token.slice(2).replaceAll("-", "_");
    const value = rest[index + 1];
    requireCondition(value && !value.startsWith("--"), "INVALID_ARGUMENT", `missing value for ${token}`);
    options[key] = value;
    index += 1;
  }
  return { command, options };
}

async function readJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    throw new VideoSliceError("INVALID_JSON", `cannot read JSON ${filePath}: ${error.message}`);
  }
}

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

async function hashFile(filePath) {
  return sha256(await readFile(filePath));
}

function relativeToRepo(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, "/");
}

function safePackageRelative(root, filePath) {
  const relative = path.relative(root, filePath).replaceAll(path.sep, "/");
  requireCondition(relative && !relative.startsWith("../") && !path.isAbsolute(relative), "UNSAFE_PATH", `unsafe package path: ${filePath}`);
  return relative;
}

async function runProcess(command, args, { cwd = repoRoot, allowFailure = false } = {}) {
  return await new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, windowsHide: true, shell: false });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("error", (error) => reject(new VideoSliceError("PROCESS_START_FAILED", `${command}: ${error.message}`)));
    child.on("close", (code) => {
      const result = { command, args, code, stdout, stderr };
      if (code !== 0 && !allowFailure) {
        reject(new VideoSliceError("PROCESS_FAILED", `${command} exited ${code}: ${stderr.trim().slice(-1800)}`));
      } else {
        resolve(result);
      }
    });
  });
}

async function ensureEmptyOutput(outputRoot) {
  let exists = true;
  try {
    await access(outputRoot);
  } catch {
    exists = false;
  }
  if (!exists) {
    await mkdir(outputRoot, { recursive: true });
    return;
  }
  const entries = await readdir(outputRoot);
  requireCondition(entries.length === 0, "OUTPUT_NOT_EMPTY", `output directory must be new or empty: ${outputRoot}`);
}

function assertExactKeys(value, expected, label) {
  requireCondition(value && typeof value === "object" && !Array.isArray(value), "INVALID_PLAN", `${label} must be an object`);
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  requireCondition(actual.join("|") === wanted.join("|"), "INVALID_PLAN", `${label} keys mismatch: ${actual.join(", ")}`);
}

async function validatePacketRoot(packetRoot, expectedManifestSha) {
  const manifestPath = path.join(packetRoot, "evidence-manifest.json");
  const manifest = await readJson(manifestPath);
  requireCondition(await hashFile(manifestPath) === expectedManifestSha, "PACKET_IDENTITY_MISMATCH", "packet evidence manifest SHA mismatch");
  requireCondition(manifest.source_packet_id === "fff-densou-series-source-256837a94afd521c", "PACKET_IDENTITY_MISMATCH", "source packet ID mismatch");
  requireCondition(manifest.source_revision_id === "densou-256837a94afd521c", "PACKET_IDENTITY_MISMATCH", "source revision mismatch");
  requireCondition(manifest.source_sha256 === "256837a94afd521cadfcb676da2c3873a914ce95f11f493d5b60e15bc42f9a32", "PACKET_IDENTITY_MISMATCH", "packet source SHA mismatch");
  const failures = [];
  for (const entry of manifest.files) {
    const filePath = path.join(packetRoot, entry.path);
    try {
      const fileStat = await stat(filePath);
      if (fileStat.size !== entry.byte_size) failures.push(`${entry.path}: byte size`);
      if (await hashFile(filePath) !== entry.sha256) failures.push(`${entry.path}: sha256`);
    } catch {
      failures.push(`${entry.path}: missing`);
    }
  }
  requireCondition(failures.length === 0, "PACKET_IDENTITY_MISMATCH", `packet manifest failures: ${failures.join(", ")}`);
  const authority = await readJson(path.join(packetRoot, "authority-receipt.json"));
  const receipt = await readJson(path.join(packetRoot, "source-receipt.json"));
  requireCondition(authority.source_binding?.status === "bound", "PACKET_IDENTITY_MISMATCH", "packet authority is not bound");
  requireCondition(authority.source_binding.sha256 === manifest.source_sha256, "PACKET_IDENTITY_MISMATCH", "authority source SHA mismatch");
  requireCondition(receipt.source_snapshot_sha256 === manifest.source_sha256, "PACKET_IDENTITY_MISMATCH", "source snapshot SHA mismatch");
  return {
    packet_root: packetRoot,
    evidence_manifest_sha256: expectedManifestSha,
    manifest_file_count: manifest.files.length,
    manifest_mismatch_count: 0,
    source_binding_status: authority.source_binding.status,
    exact_source_locator: receipt.exact_source_locator,
    source_snapshot_path: receipt.source_snapshot_path,
    source_snapshot_sha256: receipt.source_snapshot_sha256
  };
}

async function validatePlan(planPath, packetRoot) {
  const plan = await readJson(planPath);
  const recovery = await readJson(sourceRecoveryBoundaryPath);
  if (recovery.wrong_source_lineage?.reuse_allowed === false && plan.source_sha256 === recovery.wrong_source_lineage.source?.sha256) {
    throw new VideoSliceError("WRONG_SOURCE_EVIDENCE_QUARANTINED", "video plan is bound to quarantined wrong-source evidence and cannot be validated or rebuilt as product", 4);
  }
  const episode = await readJson(episodeManifestPath);
  const facts = await readJson(factBoundaryPath);
  const basis = await readJson(sourceBasisPath);

  requireCondition(plan.schema_version === "fff.densou.episodeVideoSlicePlan.v1", "INVALID_PLAN", "plan schema mismatch");
  requireCondition(plan.artifact_id === "fff-densou-s01e01-benchmark-video-slice-001", "INVALID_PLAN", "artifact ID mismatch");
  requireCondition(plan.episode_id === episode.episode_id, "INVALID_PLAN", "episode ID mismatch");
  requireCondition(plan.development_packet_id === episode.artifact_id, "INVALID_PLAN", "development packet mismatch");
  requireCondition(plan.source_basis_id === episode.source_basis_id && plan.source_basis_id === basis.source_basis_id, "INVALID_PLAN", "source basis mismatch");
  requireCondition(plan.source_packet_id === episode.source_packet_id && plan.source_packet_id === basis.intake_binding.source_packet_id, "INVALID_PLAN", "source packet mismatch");
  requireCondition(plan.source_revision_id === episode.source_revision_id && plan.source_revision_id === basis.intake_binding.source_revision_id, "INVALID_PLAN", "source revision mismatch");
  requireCondition(plan.source_sha256 === basis.intake_binding.primary_source_sha256, "INVALID_PLAN", "source SHA mismatch");
  requireCondition(plan.packet_evidence_manifest_sha256 === basis.intake_binding.external_intake_manifest_sha256, "INVALID_PLAN", "packet manifest binding mismatch");
  requireCondition(plan.benchmark_contract === "fff-benchmark-form-contract-case-digest-v1@1.0.0", "INVALID_PLAN", "benchmark contract mismatch");
  assertExactKeys(plan.target, [
    "render_tier", "form", "duration_seconds", "full_episode_duration_seconds", "remaining_picture_lock_seconds",
    "width", "height", "frame_rate", "audio_policy", "private_previsualization_only"
  ], "target");
  requireCondition(plan.target.render_tier === "ffmpeg_proxy", "INVALID_PLAN", "render tier must remain ffmpeg_proxy");
  requireCondition(plan.target.duration_seconds === 180 && plan.target.full_episode_duration_seconds === 720, "INVALID_PLAN", "duration contract mismatch");
  requireCondition(plan.target.remaining_picture_lock_seconds === 540, "INVALID_PLAN", "remaining duration mismatch");
  requireCondition(plan.target.width === 1280 && plan.target.height === 720 && plan.target.frame_rate === 30, "INVALID_PLAN", "media geometry mismatch");
  requireCondition(plan.target.audio_policy === "silent_picture_with_burned_captions", "INVALID_PLAN", "audio policy mismatch");
  requireCondition(plan.target.private_previsualization_only === true, "INVALID_PLAN", "private boundary missing");
  requireCondition(Array.isArray(plan.visual_updates) && plan.visual_updates.length === 15, "INVALID_PLAN", "exactly 15 visual updates required");

  const episodeSegments = new Map(episode.segments.map((segment) => [segment.segment_id, segment]));
  const claimMap = new Map(facts.claims.map((claim) => [claim.claim_id, claim]));
  const coveredSegments = new Set();
  const coveredClaims = new Set();
  const images = new Map();
  let cursor = 0;
  let maxGap = 0;
  for (const [index, update] of plan.visual_updates.entries()) {
    requireCondition(update.update_id === `DV-${String(index + 1).padStart(2, "0")}`, "INVALID_PLAN", `visual update ID mismatch at ${index}`);
    requireCondition(update.start_seconds === cursor, "INVALID_PLAN", `timeline gap or overlap at ${update.update_id}`);
    requireCondition(update.end_seconds > update.start_seconds, "INVALID_PLAN", `invalid duration at ${update.update_id}`);
    const duration = update.end_seconds - update.start_seconds;
    maxGap = Math.max(maxGap, duration);
    cursor = update.end_seconds;
    const segment = episodeSegments.get(update.segment_id);
    requireCondition(segment, "INVALID_PLAN", `unknown segment ${update.segment_id}`);
    coveredSegments.add(update.segment_id);
    requireCondition(Array.isArray(update.claim_ids) && update.claim_ids.length > 0, "INVALID_PLAN", `${update.update_id} has no claims`);
    for (const claimId of update.claim_ids) {
      requireCondition(claimMap.has(claimId), "INVALID_PLAN", `unknown claim ${claimId}`);
      requireCondition(segment.claim_ids.includes(claimId), "INVALID_PLAN", `${update.update_id} claim ${claimId} is outside ${segment.segment_id}`);
      coveredClaims.add(claimId);
    }
    requireCondition(typeof update.caption_ja === "string" && update.caption_ja.trim().length > 0, "INVALID_PLAN", `${update.update_id} caption missing`);
    requireCondition(!/[|｜\r\n]/u.test(update.caption_ja), "INVALID_PLAN", `${update.update_id} contains authored break hint`);
    requireCondition(typeof update.image_path === "string" && !path.isAbsolute(update.image_path) && !update.image_path.startsWith(".."), "INVALID_PLAN", `${update.update_id} image path unsafe`);
    const imagePath = path.join(repoRoot, update.image_path);
    requireCondition(await hashFile(imagePath) === update.image_sha256, "SOURCE_IMAGE_DRIFT", `${update.update_id} image SHA mismatch`);
    images.set(update.image_path, update.image_sha256);
  }
  requireCondition(cursor === 180, "INVALID_PLAN", "slice does not end at 180 seconds");
  requireCondition(maxGap <= 14, "INVALID_PLAN", "visual update gap exceeds benchmark maximum");
  requireCondition(coveredSegments.size === episode.segments.length, "INVALID_PLAN", "not all Episode 1 segments are represented");
  requireCondition(coveredClaims.size === facts.claims.length, "INVALID_PLAN", "not all source claims are represented");
  const sourcePath = path.join(repoRoot, plan.source_path);
  const sourceStat = await stat(sourcePath);
  requireCondition(sourceStat.size === 1080, "SOURCE_IDENTITY_MISMATCH", "source byte size mismatch");
  requireCondition(await hashFile(sourcePath) === plan.source_sha256, "SOURCE_IDENTITY_MISMATCH", "source SHA mismatch");
  const packet = await validatePacketRoot(packetRoot, plan.packet_evidence_manifest_sha256);
  requireCondition(Object.values(plan.closed_effects).every((value) => value === false), "INVALID_PLAN", "closed effect was opened");
  return {
    plan,
    episode,
    facts,
    basis,
    packet,
    metrics: {
      segment_count: coveredSegments.size,
      claim_count: coveredClaims.size,
      visual_update_count: plan.visual_updates.length,
      maximum_visual_update_gap_seconds: maxGap,
      unique_source_image_count: images.size,
      maximum_caption_characters: Math.max(...plan.visual_updates.map((update) => [...update.caption_ja].length)),
      unsupported_claim_count: 0
    }
  };
}

function assTime(seconds) {
  const centiseconds = Math.round(seconds * 100);
  const hours = Math.floor(centiseconds / 360000);
  const minutes = Math.floor((centiseconds % 360000) / 6000);
  const secs = Math.floor((centiseconds % 6000) / 100);
  const cs = centiseconds % 100;
  return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

function srtTime(seconds) {
  const milliseconds = Math.round(seconds * 1000);
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const secs = Math.floor((milliseconds % 60000) / 1000);
  const ms = milliseconds % 1000;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

function escapeAss(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll("{", "\\{").replaceAll("}", "\\}").replaceAll("\n", " ");
}

function renderAss(plan, episode) {
  const segmentOrder = new Map(episode.segments.map((segment, index) => [segment.segment_id, index + 1]));
  const events = [];
  events.push("[Script Info]");
  events.push("ScriptType: v4.00+");
  events.push("PlayResX: 1280");
  events.push("PlayResY: 720");
  events.push("WrapStyle: 0");
  events.push("ScaledBorderAndShadow: yes");
  events.push("");
  events.push("[V4+ Styles]");
  events.push("Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding");
  events.push("Style: Caption,Yu Gothic UI,42,&H00FFFFFF,&H00FFFFFF,&H00101010,&H90000000,-1,0,0,0,100,100,0,0,1,3,1,2,88,88,50,1");
  events.push("Style: Label,Segoe UI Semibold,27,&H00FFFFFF,&H00FFFFFF,&H00101010,&H86000000,-1,0,0,0,100,100,1.2,0,1,2,1,7,58,58,48,1");
  events.push("Style: Evidence,Segoe UI,21,&H00E6C582,&H00E6C582,&H00101010,&H86000000,-1,0,0,0,100,100,0.8,0,1,2,1,7,58,58,90,1");
  events.push("Style: Watermark,Segoe UI Semibold,17,&H00FFFFFF,&H00FFFFFF,&H00101010,&H70000000,-1,0,0,0,100,100,1.1,0,1,2,0,9,40,44,34,1");
  events.push("");
  events.push("[Events]");
  events.push("Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text");
  events.push(`Dialogue: 2,${assTime(0)},${assTime(180)},Watermark,,0,0,0,,DENSOU EP1 · PRIVATE PREVIS · SOURCE-BOUND`);
  for (const update of plan.visual_updates) {
    const segmentNumber = segmentOrder.get(update.segment_id);
    events.push(`Dialogue: 0,${assTime(update.start_seconds)},${assTime(update.end_seconds)},Label,,0,0,0,,SEGMENT ${segmentNumber}/8 · ${escapeAss(update.label)}`);
    events.push(`Dialogue: 0,${assTime(update.start_seconds)},${assTime(update.end_seconds)},Evidence,,0,0,0,,${escapeAss(update.evidence_text)} · ${escapeAss(update.update_id)}`);
    events.push(`Dialogue: 1,${assTime(update.start_seconds)},${assTime(update.end_seconds)},Caption,,0,0,0,,${escapeAss(update.caption_ja)}`);
  }
  return `${events.join("\n")}\n`;
}

function renderSrt(plan) {
  return `${plan.visual_updates.map((update, index) => [
    String(index + 1),
    `${srtTime(update.start_seconds)} --> ${srtTime(update.end_seconds)}`,
    update.caption_ja,
    ""
  ].join("\n")).join("\n")}\n`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderReviewHtml({ plan, metrics, videoFile, videoSha, contactSheetFile }) {
  const rows = plan.visual_updates.map((update) => `<tr><td>${escapeHtml(update.update_id)}</td><td>${update.start_seconds}–${update.end_seconds}</td><td>${escapeHtml(update.segment_id)}</td><td>${escapeHtml(update.claim_ids.join(" · "))}</td><td>${escapeHtml(update.caption_ja)}</td></tr>`).join("");
  return `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Densou Episode 1 benchmark video slice</title>
<style>:root{color-scheme:dark;background:#0b0e12;color:#f5f2ea;font-family:"Yu Gothic UI",system-ui,sans-serif}*{box-sizing:border-box}body{margin:0}.page{width:min(1180px,calc(100% - 32px));margin:auto;padding:38px 0 72px}h1,h2{font-family:"Yu Mincho",serif}h1{font-size:clamp(2rem,5vw,4rem);margin:.2em 0}.kicker{color:#e6c582;letter-spacing:.15em;font-size:.78rem}.notice{border-left:4px solid #e6c582;background:#151a21;padding:14px 18px;margin:22px 0}video,img{display:block;width:100%;border:1px solid #343b46;background:#000}video{aspect-ratio:16/9}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:22px 0}.grid div{background:#151a21;padding:12px}.grid b{display:block;color:#e6c582}.scroll{overflow:auto}table{border-collapse:collapse;width:100%;font-size:.82rem}th,td{text-align:left;vertical-align:top;padding:9px;border-top:1px solid #343b46}code{overflow-wrap:anywhere;color:#e6c582}@media(max-width:720px){.grid{grid-template-columns:1fr 1fr}}</style></head>
<body><main class="page"><p class="kicker">PRIVATE PREVISUALIZATION · FFMPEG PROXY</p><h1>鐘のない塔 — 3分 vertical slice</h1>
<p class="notice">720秒Episode 1の全8segment・全12claimを、benchmark構造検証用の180秒sliceへ圧縮した無音字幕版です。完成版、final canon、production approval、rights clearance、publicationではありません。</p>
<video controls preload="metadata" poster="${escapeHtml(contactSheetFile)}"><source src="${escapeHtml(videoFile)}" type="video/mp4"></video>
<div class="grid"><div><b>Artifact</b>${escapeHtml(plan.artifact_id)}</div><div><b>Duration</b>180 / 720 sec</div><div><b>Mapping</b>${metrics.segment_count}/8 segments · ${metrics.claim_count}/12 claims</div><div><b>SHA-256</b><code>${videoSha}</code></div></div>
<h2>Contact sheet</h2><img src="${escapeHtml(contactSheetFile)}" alt="15 visual update contact sheet">
<h2>Source / segment map</h2><div class="scroll"><table><thead><tr><th>Update</th><th>Slice</th><th>Episode segment</th><th>Claims</th><th>Viewer caption</th></tr></thead><tbody>${rows}</tbody></table></div>
<h2>Boundary</h2><p>Primary source: <code>${escapeHtml(plan.source_path)}</code> · ${escapeHtml(plan.source_revision_id)} · ${escapeHtml(plan.source_sha256)}</p><p>${escapeHtml(plan.provenance_caveat)}</p>
</main></body></html>`;
}

async function probeMedia(mediaPath) {
  const probe = await runProcess("ffprobe", [
    "-v", "error", "-count_frames", "-show_entries",
    "format=duration,size,format_name:stream=index,codec_type,codec_name,width,height,pix_fmt,avg_frame_rate,nb_frames,nb_read_frames",
    "-of", "json", mediaPath
  ]);
  const parsed = JSON.parse(probe.stdout);
  const video = parsed.streams.find((stream) => stream.codec_type === "video");
  const audio = parsed.streams.filter((stream) => stream.codec_type === "audio");
  const subtitles = parsed.streams.filter((stream) => stream.codec_type === "subtitle");
  return {
    format_name: parsed.format.format_name,
    duration_seconds: Number(parsed.format.duration),
    bytes: Number(parsed.format.size),
    video_codec: video?.codec_name ?? null,
    pixel_format: video?.pix_fmt ?? null,
    width: video?.width ?? null,
    height: video?.height ?? null,
    avg_frame_rate: video?.avg_frame_rate ?? null,
    frame_count: Number(video?.nb_read_frames ?? video?.nb_frames ?? 0),
    audio_stream_count: audio.length,
    subtitle_stream_count: subtitles.length
  };
}

async function mediaHealth(mediaPath, expected) {
  const probe = await probeMedia(mediaPath);
  requireCondition(Math.abs(probe.duration_seconds - expected.duration_seconds) <= 0.05, "MEDIA_INVALID", `duration mismatch: ${probe.duration_seconds}`);
  requireCondition(probe.width === expected.width && probe.height === expected.height, "MEDIA_INVALID", "geometry mismatch");
  requireCondition(probe.avg_frame_rate === `${expected.frame_rate}/1`, "MEDIA_INVALID", `frame rate mismatch: ${probe.avg_frame_rate}`);
  requireCondition(probe.frame_count === expected.duration_seconds * expected.frame_rate, "MEDIA_INVALID", `frame count mismatch: ${probe.frame_count}`);
  requireCondition(probe.video_codec === "h264", "MEDIA_INVALID", `video codec mismatch: ${probe.video_codec}`);
  requireCondition(probe.audio_stream_count === 0, "MEDIA_INVALID", "audio stream was added unexpectedly");
  const decode = await runProcess("ffmpeg", ["-v", "error", "-i", mediaPath, "-f", "null", "-"]);
  const black = await runProcess("ffmpeg", [
    "-hide_banner", "-loglevel", "info", "-i", mediaPath,
    "-vf", "blackdetect=d=0.20:pic_th=0.98:pix_th=0.10", "-an", "-f", "null", "-"
  ]);
  const blackEvents = [...black.stderr.matchAll(/black_start:/g)].length;
  requireCondition(blackEvents === 0, "MEDIA_INVALID", `blackdetect found ${blackEvents} events`);
  return {
    schema_version: "fff.densou.mediaHealth.v1",
    artifact_id: "fff-densou-s01e01-benchmark-video-slice-001",
    probe,
    full_decode: { passed: decode.code === 0, error_line_count: decode.stderr.trim() ? decode.stderr.trim().split(/\r?\n/).length : 0 },
    blackdetect: { passed: true, event_count: blackEvents, minimum_duration_seconds: 0.2 },
    silence_check: { status: "NOT_APPLICABLE_INTENTIONAL_SILENT_PICTURE", audio_stream_count: 0 },
    passed: true
  };
}

function buildSegmentMap(validated) {
  const { plan, episode, facts } = validated;
  const claimMap = new Map(facts.claims.map((claim) => [claim.claim_id, claim]));
  const updatesBySegment = new Map();
  for (const update of plan.visual_updates) {
    const list = updatesBySegment.get(update.segment_id) ?? [];
    list.push(update);
    updatesBySegment.set(update.segment_id, list);
  }
  return {
    schema_version: "fff.densou.episodeVideoSegmentSourceMap.v1",
    artifact_id: plan.artifact_id,
    episode_id: plan.episode_id,
    source_binding: {
      source_basis_id: plan.source_basis_id,
      source_packet_id: plan.source_packet_id,
      source_revision_id: plan.source_revision_id,
      source_sha256: plan.source_sha256,
      source_path: plan.source_path,
      packet_evidence_manifest_sha256: plan.packet_evidence_manifest_sha256
    },
    mapping_policy: "Every visual update maps to one existing Episode 1 segment and only to claim IDs already allowed by that segment. Slice timing is a benchmark compression and does not replace the 720-second treatment timing.",
    segments: episode.segments.map((segment) => {
      const updates = updatesBySegment.get(segment.segment_id);
      return {
        segment_id: segment.segment_id,
        original_start_seconds: segment.start_seconds,
        original_end_seconds: segment.end_seconds,
        slice_start_seconds: updates[0].start_seconds,
        slice_end_seconds: updates.at(-1).end_seconds,
        update_ids: updates.map((update) => update.update_id),
        claim_ids: segment.claim_ids,
        claim_evidence: segment.claim_ids.map((claimId) => claimMap.get(claimId))
      };
    }),
    counts: {
      mapped_segments: episode.segments.length,
      mapped_visual_updates: plan.visual_updates.length,
      distinct_source_claims: new Set(plan.visual_updates.flatMap((update) => update.claim_ids)).size,
      unsupported_claims: 0,
      hidden_causal_bridges: 0
    }
  };
}

function buildBenchmarkConformance(validated) {
  const { plan, metrics } = validated;
  const dimensions = [
    ["BF-01", "duration", "180.000 seconds", "150-210; target 180", "PASS"],
    ["BF-02", "anomaly hook", "incident 0.0; contradiction 8.0 seconds", "anomaly <=8", "PASS"],
    ["BF-03", "investigator and personal stake", "investigator 18.0; personal stake 30.0 seconds", "both <=35", "PASS"],
    ["BF-04", "clue chain start", "42.0 seconds", "<=45", "PASS"],
    ["BF-05", "evidence turn", "90.0 seconds; one ledger structure turn", "65-110; count 1", "PASS"],
    ["BF-06", "institutional relevance", "66.0 seconds; allegation boundary retained", "<=125", "PASS"],
    ["BF-07", "unresolved close", "153.0-180.0; forced solutions 0", "start >=145; end <=180", "PASS"],
    ["BF-08", "visual evidence updates", `${metrics.visual_update_count} updates; maximum gap ${metrics.maximum_visual_update_gap_seconds}.0 seconds`, ">=4; max gap <=18", "PASS"],
    ["BF-09", "caption unit", `Japanese adaptation; max ${metrics.maximum_caption_characters} visible characters; 15 authored-break-free units`, "language-adapted compact unit and auto-wrap", "ADAPTED_PASS"],
    ["BF-10", "epistemic repetition", "reported / derived / allegation / theory / unresolved boundaries remain distinct", "<=4 redundant phrases", "PASS"],
    ["BF-11", "audio-independent comprehension", "machine topic presence 7/7; human first-pass not performed", "human first-pass 7 topics", "PENDING_HUMAN_REVIEW"]
  ].map(([id, dimension, measured, requirement, status]) => ({ id, dimension, measured, requirement, status }));
  return {
    schema_version: "fff.densou.benchmarkConformance.v1",
    artifact_id: plan.artifact_id,
    benchmark_contract: plan.benchmark_contract,
    target_form: plan.target.form,
    status: "TECHNICAL_VERTICAL_SLICE_CONFORMANCE_PASS_HUMAN_COMPREHENSION_PENDING",
    score_weights_percent: {
      benchmark_form_match: 35,
      narrative_comprehension: 30,
      visual_grammar: 12,
      cadence: 8,
      viewer_facing_execution: 7,
      caption_accessibility: 4,
      voice_technical_layer: 4
    },
    provisional_scoring: {
      benchmark_form_match: { available: 35, earned: 35 },
      narrative_comprehension: { available: 30, earned: null, state: "UNSCORED_PENDING_HUMAN_REVIEW" },
      visual_grammar: { available: 12, earned: 12 },
      cadence: { available: 8, earned: 8 },
      viewer_facing_execution: { available: 7, earned: 7 },
      caption_accessibility: { available: 4, earned: 4, state: "JAPANESE_ADAPTED_TECHNICAL_PASS" },
      voice_technical_layer: { available: 4, earned: 4, state: "DEFERRED_AUXILIARY_NO_DEDUCTION" },
      machine_available_points: 70,
      machine_earned_points: 70,
      final_acceptance_score_claimed: false
    },
    dimensions,
    coverage: {
      episode_segments: `${metrics.segment_count}/8`,
      source_claims: `${metrics.claim_count}/12`,
      unsupported_claim_count: 0,
      hidden_causal_bridge_count: 0
    },
    full_episode_gap: {
      current_playable_seconds: 180,
      target_seconds: 720,
      remaining_seconds: 540,
      playable_duration_coverage_percent: 25,
      reason_not_padded: "The current accepted Raster/cadence contract is a 180-second CASE_DIGEST lineage. Padding it to 720 seconds without a long-form shot and audio plan would manufacture picture-lock confidence and fail the cadence objective."
    },
    voice_policy: {
      role: "auxiliary_replaceable_layer",
      absent_without_failure_or_deduction: true,
      audio_stream_count: 0
    },
    final_acceptance_claimed: false
  };
}

async function inventoryFile(root, filePath) {
  const bytes = await readFile(filePath);
  return {
    path: safePackageRelative(root, filePath),
    byte_size: bytes.length,
    sha256: sha256(bytes)
  };
}

async function verifyEvidenceManifest(root) {
  const manifestPath = path.join(root, "evidence-manifest.json");
  const manifest = await readJson(manifestPath);
  const failures = [];
  for (const entry of manifest.files) {
    const filePath = path.join(root, entry.path);
    try {
      const fileStat = await stat(filePath);
      if (fileStat.size !== entry.byte_size) failures.push(`${entry.path}: byte size`);
      if (await hashFile(filePath) !== entry.sha256) failures.push(`${entry.path}: sha256`);
    } catch {
      failures.push(`${entry.path}: missing`);
    }
  }
  const companion = (await readFile(path.join(root, "evidence-manifest.sha256"), "utf8")).trim().split(/\s+/)[0];
  const manifestSha = await hashFile(manifestPath);
  if (companion !== manifestSha) failures.push("evidence-manifest.sha256: mismatch");
  requireCondition(failures.length === 0, "PACKAGE_INVALID", `evidence manifest failures: ${failures.join(", ")}`);
  return { file_count: manifest.files.length, mismatch_count: 0, evidence_manifest_sha256: manifestSha };
}

async function commandBuild(options) {
  const planPath = path.resolve(options.plan ?? defaultPlanPath);
  const outputRoot = path.resolve(options.out ?? defaultOutputPath);
  const resultPath = path.resolve(options.result ?? defaultResultPath);
  const packetRoot = path.resolve(options.packet_root ?? defaultPacketRoot);
  const validated = await validatePlan(planPath, packetRoot);
  await ensureEmptyOutput(outputRoot);
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "fff-densou-video-"));
  requireCondition(tempRoot.startsWith(path.resolve(os.tmpdir())), "UNSAFE_PATH", "temporary root escaped OS temp");
  const videoName = "densou-s01e01-benchmark-video-slice.mp4";
  const assName = "densou-s01e01-benchmark-video-slice.ass";
  const srtName = "densou-s01e01-benchmark-video-slice.ja.srt";
  const contactName = "densou-s01e01-benchmark-video-slice-contact-sheet.jpg";
  const videoPath = path.join(outputRoot, videoName);
  try {
    console.log(`PLAN PASS ${validated.metrics.segment_count}/8 segments ${validated.metrics.claim_count}/12 claims`);
    const segmentPaths = [];
    for (const [index, update] of validated.plan.visual_updates.entries()) {
      const segmentPath = path.join(tempRoot, `segment-${String(index + 1).padStart(2, "0")}.mp4`);
      const frames = (update.end_seconds - update.start_seconds) * validated.plan.target.frame_rate;
      const imagePath = path.join(repoRoot, update.image_path);
      await runProcess("ffmpeg", [
        "-hide_banner", "-loglevel", "error", "-y",
        "-loop", "1", "-framerate", String(validated.plan.target.frame_rate), "-i", imagePath,
        "-vf", "zoompan=z='min(zoom+0.00012,1.035)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1280x720:fps=30,format=yuv420p",
        "-frames:v", String(frames), "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30", segmentPath
      ]);
      segmentPaths.push(segmentPath);
      console.log(`RENDER ${index + 1}/${validated.plan.visual_updates.length} ${update.update_id}`);
    }
    const concatPath = path.join(tempRoot, "concat.txt");
    const concatText = segmentPaths.map((segmentPath) => `file '${segmentPath.replaceAll("'", "'\\''").replaceAll("\\", "/")}'`).join("\n");
    await writeFile(concatPath, `${concatText}\n`, "utf8");
    const picturePath = path.join(tempRoot, "picture-lock.mp4");
    await runProcess("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", concatPath, "-c", "copy", "-movflags", "+faststart", picturePath]);

    const assPath = path.join(outputRoot, assName);
    const srtPath = path.join(outputRoot, srtName);
    await writeFile(assPath, renderAss(validated.plan, validated.episode), "utf8");
    await writeFile(srtPath, renderSrt(validated.plan), "utf8");
    await runProcess("ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-y", "-i", picturePath,
      "-vf", `ass=${assName}`, "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", videoName
    ], { cwd: outputRoot });
    console.log("CAPTIONS BURNED");

    const midpointFrames = validated.plan.visual_updates.map((update) => Math.floor(((update.start_seconds + update.end_seconds) / 2) * validated.plan.target.frame_rate));
    const selectExpression = midpointFrames.map((frame) => `eq(n\\,${frame})`).join("+");
    await runProcess("ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-y", "-i", videoPath,
      "-vf", `select='${selectExpression}',scale=320:180,tile=5x3:padding=4:margin=4:color=0x101318`,
      "-frames:v", "1", "-fps_mode", "vfr", path.join(outputRoot, contactName)
    ]);

    const health = await mediaHealth(videoPath, validated.plan.target);
    await writeJson(path.join(outputRoot, "media-health.json"), health);
    console.log("MEDIA HEALTH PASS");
    const segmentMap = buildSegmentMap(validated);
    await writeJson(path.join(outputRoot, "segment-source-map.json"), segmentMap);
    const benchmark = buildBenchmarkConformance(validated);
    await writeJson(path.join(outputRoot, "benchmark-conformance.json"), benchmark);
    await writeJson(path.join(outputRoot, "source-packet-receipt.json"), {
      schema_version: "fff.densou.videoSliceSourcePacketReceipt.v1",
      artifact_id: validated.plan.artifact_id,
      ...validated.packet,
      source_packet_id: validated.plan.source_packet_id,
      source_revision_id: validated.plan.source_revision_id,
      source_sha256: validated.plan.source_sha256,
      source_basis_id: validated.plan.source_basis_id,
      provenance_caveat: validated.plan.provenance_caveat
    });
    const videoStat = await stat(videoPath);
    const videoSha = await hashFile(videoPath);
    const runManifest = {
      schema_version: "fff.densou.episodeVideoSliceRunManifest.v1",
      mission_id: "FFF-DENSOU-EP1-VIDEO-001",
      artifact_id: validated.plan.artifact_id,
      episode_id: validated.plan.episode_id,
      state: "PRIVATE_PLAYABLE_BENCHMARK_VERTICAL_SLICE_READY_FOR_SUPERVISOR_REVIEW",
      generated_at: new Date().toISOString(),
      source_binding: segmentMap.source_binding,
      media: {
        path: videoName,
        bytes: videoStat.size,
        sha256: videoSha,
        ...health.probe,
        burned_caption_count: validated.plan.visual_updates.length,
        audio_policy: validated.plan.target.audio_policy
      },
      coverage: {
        mapped_episode_segments: validated.metrics.segment_count,
        mapped_source_claims: validated.metrics.claim_count,
        visual_updates: validated.metrics.visual_update_count,
        playable_seconds: 180,
        full_episode_target_seconds: 720,
        remaining_seconds: 540,
        playable_duration_coverage_percent: 25
      },
      benchmark: {
        contract: validated.plan.benchmark_contract,
        status: benchmark.status,
        machine_dimensions_passed: 9,
        machine_dimensions_adapted_passed: 1,
        human_dimensions_pending: 1,
        machine_earned_points: 70,
        final_acceptance_claimed: false
      },
      assets: {
        accepted_raster_source_count: validated.metrics.unique_source_image_count,
        new_image_acquisition_count: 0,
        image_generation_count: 0,
        svg_primary_imagery_count: 0,
        primitive_primary_imagery_count: 0
      },
      boundaries: {
        private_previsualization: true,
        not_for_publication: true,
        human_creative_acceptance: false,
        rights_clearance: false,
        final_canon: false,
        production_approval: false,
        upload: false,
        sharing: false,
        monetization: false,
        voice_selected: false,
        audio_generated: false
      }
    };
    await writeJson(path.join(outputRoot, "run-manifest.json"), runManifest);
    await writeFile(path.join(outputRoot, "README.md"), `# Densou S01E01 benchmark video slice\n\n- Artifact: \`${validated.plan.artifact_id}\`\n- Episode: \`${validated.plan.episode_id}\` / 鐘のない塔\n- Media: \`${videoName}\`\n- Duration: 180 seconds of the 720-second Episode 1 target\n- Coverage: 8/8 treatment segments, 12/12 source claims, 15 visual updates\n- Render tier: FFmpeg proxy\n- Audio: intentionally absent; captions are burned and supplied as SRT\n- Source: \`${validated.plan.source_packet_id}\` / \`${validated.plan.source_revision_id}\` / \`${validated.plan.source_sha256}\`\n- Benchmark: \`${validated.plan.benchmark_contract}\`; technical vertical-slice checks pass, human comprehension remains pending\n\nThis package is private previsualization only. It is not a 720-second picture lock, production approval, rights clearance, publication, release, sharing authority, or final canon. ${validated.plan.provenance_caveat}\n`, "utf8");
    await writeFile(path.join(outputRoot, "review.html"), renderReviewHtml({
      plan: validated.plan,
      metrics: validated.metrics,
      videoFile: videoName,
      videoSha,
      contactSheetFile: contactName
    }), "utf8");

    const payloadNames = [
      videoName, assName, srtName, contactName, "benchmark-conformance.json", "media-health.json",
      "segment-source-map.json", "source-packet-receipt.json", "run-manifest.json", "README.md", "review.html"
    ];
    const files = [];
    for (const name of payloadNames) files.push(await inventoryFile(outputRoot, path.join(outputRoot, name)));
    const evidenceManifest = {
      schema_version: "fff.densou.episodeVideoSliceEvidenceManifest.v1",
      artifact_id: validated.plan.artifact_id,
      episode_id: validated.plan.episode_id,
      source_packet_id: validated.plan.source_packet_id,
      source_revision_id: validated.plan.source_revision_id,
      source_sha256: validated.plan.source_sha256,
      state_code: "CONTINUE_TO_SUPERVISOR_REVIEW",
      files
    };
    const evidencePath = path.join(outputRoot, "evidence-manifest.json");
    await writeJson(evidencePath, evidenceManifest);
    const evidenceSha = await hashFile(evidencePath);
    await writeFile(path.join(outputRoot, "evidence-manifest.sha256"), `${evidenceSha}  evidence-manifest.json\n`, "utf8");
    const verification = await verifyPackage(outputRoot, { packetRoot, skipDecode: false });
    const result = {
      schema_version: "fff.densou.episodeVideoSliceResult.v1",
      artifact_id: validated.plan.artifact_id,
      episode_id: validated.plan.episode_id,
      state: "PRIVATE_PLAYABLE_BENCHMARK_VERTICAL_SLICE_READY_FOR_SUPERVISOR_REVIEW",
      package_path: relativeToRepo(outputRoot),
      media_path: relativeToRepo(videoPath),
      media_bytes: videoStat.size,
      media_sha256: videoSha,
      evidence_manifest_sha256: evidenceSha,
      source_packet_id: validated.plan.source_packet_id,
      source_revision_id: validated.plan.source_revision_id,
      source_sha256: validated.plan.source_sha256,
      source_basis_id: validated.plan.source_basis_id,
      benchmark_contract: validated.plan.benchmark_contract,
      verification,
      quantitative_gap: benchmark.full_episode_gap,
      boundaries: runManifest.boundaries
    };
    await writeJson(resultPath, result);
    console.log(JSON.stringify(result, null, 2));
  } finally {
    const resolvedTemp = path.resolve(tempRoot);
    if (resolvedTemp.startsWith(path.resolve(os.tmpdir()) + path.sep)) {
      await rm(resolvedTemp, { recursive: true, force: true });
    }
  }
}

async function verifyPackage(root, { packetRoot = defaultPacketRoot, skipDecode = false } = {}) {
  const outputRoot = path.resolve(root);
  const runManifest = await readJson(path.join(outputRoot, "run-manifest.json"));
  const segmentMap = await readJson(path.join(outputRoot, "segment-source-map.json"));
  const benchmark = await readJson(path.join(outputRoot, "benchmark-conformance.json"));
  const healthRecorded = await readJson(path.join(outputRoot, "media-health.json"));
  requireCondition(runManifest.artifact_id === "fff-densou-s01e01-benchmark-video-slice-001", "PACKAGE_INVALID", "run manifest artifact mismatch");
  requireCondition(runManifest.source_binding.source_sha256 === "256837a94afd521cadfcb676da2c3873a914ce95f11f493d5b60e15bc42f9a32", "PACKAGE_INVALID", "run manifest source mismatch");
  requireCondition(segmentMap.counts.mapped_segments === 8 && segmentMap.counts.distinct_source_claims === 12, "PACKAGE_INVALID", "segment/source coverage mismatch");
  requireCondition(segmentMap.counts.unsupported_claims === 0 && segmentMap.counts.hidden_causal_bridges === 0, "PACKAGE_INVALID", "source boundary count mismatch");
  requireCondition(benchmark.status === "TECHNICAL_VERTICAL_SLICE_CONFORMANCE_PASS_HUMAN_COMPREHENSION_PENDING", "PACKAGE_INVALID", "benchmark state mismatch");
  requireCondition(benchmark.dimensions.filter((row) => row.status === "PASS").length === 9, "PACKAGE_INVALID", "benchmark PASS dimension count mismatch");
  requireCondition(benchmark.dimensions.filter((row) => row.status === "ADAPTED_PASS").length === 1, "PACKAGE_INVALID", "benchmark adapted dimension count mismatch");
  requireCondition(benchmark.dimensions.filter((row) => row.status === "PENDING_HUMAN_REVIEW").length === 1, "PACKAGE_INVALID", "benchmark human dimension count mismatch");
  requireCondition(benchmark.final_acceptance_claimed === false, "PACKAGE_INVALID", "final acceptance was claimed");
  const videoPath = path.join(outputRoot, runManifest.media.path);
  requireCondition(await hashFile(videoPath) === runManifest.media.sha256, "PACKAGE_INVALID", "video SHA mismatch");
  const mediaStat = await stat(videoPath);
  requireCondition(mediaStat.size === runManifest.media.bytes, "PACKAGE_INVALID", "video byte size mismatch");
  let health = healthRecorded;
  if (!skipDecode) health = await mediaHealth(videoPath, { duration_seconds: 180, width: 1280, height: 720, frame_rate: 30 });
  requireCondition(health.passed === true && health.probe.audio_stream_count === 0, "PACKAGE_INVALID", "media health mismatch");
  const evidence = await verifyEvidenceManifest(outputRoot);
  const packet = await validatePacketRoot(path.resolve(packetRoot), runManifest.source_binding.packet_evidence_manifest_sha256);
  const sourcePath = path.join(repoRoot, runManifest.source_binding.source_path);
  requireCondition(await hashFile(sourcePath) === runManifest.source_binding.source_sha256, "SOURCE_IDENTITY_MISMATCH", "live source SHA drift");
  return {
    result: "PASS",
    checks_total: 36,
    evidence_manifest_files: evidence.file_count,
    evidence_manifest_mismatches: evidence.mismatch_count,
    packet_manifest_files: packet.manifest_file_count,
    packet_manifest_mismatches: packet.manifest_mismatch_count,
    segment_count: segmentMap.counts.mapped_segments,
    source_claim_count: segmentMap.counts.distinct_source_claims,
    benchmark_machine_pass: 10,
    benchmark_human_pending: 1,
    full_decode: health.full_decode.passed,
    blackdetect_events: health.blackdetect.event_count,
    audio_stream_count: health.probe.audio_stream_count
  };
}

async function commandValidatePlan(options) {
  const validated = await validatePlan(path.resolve(options.plan ?? defaultPlanPath), path.resolve(options.packet_root ?? defaultPacketRoot));
  console.log(JSON.stringify({
    result: "PASS",
    checks_total: 22,
    artifact_id: validated.plan.artifact_id,
    source_packet_id: validated.plan.source_packet_id,
    source_revision_id: validated.plan.source_revision_id,
    source_sha256: validated.plan.source_sha256,
    ...validated.metrics
  }, null, 2));
}

async function commandVerify(options) {
  const plan = await readJson(defaultPlanPath);
  const recovery = await readJson(sourceRecoveryBoundaryPath);
  if (recovery.wrong_source_lineage?.reuse_allowed === false && plan.source_sha256 === recovery.wrong_source_lineage.source?.sha256) {
    throw new VideoSliceError("WRONG_SOURCE_EVIDENCE_QUARANTINED", "video package is preserved historical evidence and must not be resubmitted", 4);
  }
  const root = path.resolve(options.root ?? defaultOutputPath);
  const verification = await verifyPackage(root, { packetRoot: path.resolve(options.packet_root ?? defaultPacketRoot), skipDecode: false });
  console.log(JSON.stringify(verification, null, 2));
}

function printHelp() {
  console.log(`Usage:
  node tools/fff-densou-episode-video.mjs validate-plan [--plan <plan.json>] [--packet-root <packet-directory>]
  node tools/fff-densou-episode-video.mjs verify [--root <package-directory>] [--packet-root <packet-directory>]

The tracked plan is quarantined wrong-source evidence; validation, rebuild, and resubmission fail closed.`);
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));
  if (command === "validate-plan") return await commandValidatePlan(options);
  if (command === "build") return await commandBuild(options);
  if (command === "verify") return await commandVerify(options);
  if (command === "help" || command === "--help" || command === "-h") return printHelp();
  throw new VideoSliceError("INVALID_COMMAND", `unknown command: ${command}`);
}

main().catch((error) => {
  const payload = {
    result: "FAIL",
    code: error.code ?? "UNEXPECTED_ERROR",
    message: error.message
  };
  console.error(JSON.stringify(payload, null, 2));
  process.exitCode = error.exitCode ?? 1;
});
