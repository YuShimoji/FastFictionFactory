#!/usr/bin/env node

import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { access, mkdir, mkdtemp, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const artifactId = "fff-private-raster-case-digest-audio-continuation-20260812-001";
const parentArtifactId = "fff-private-raster-case-digest-001";
const workOrderId = "FFF-PROJECT-WIDE-NONDENSOU-FRONTIER-CONTINUATION-20260812-005";
const parentRoot = path.join(repoRoot, "artifacts", "private-raster-case-digest");
const parentMedia = path.join(parentRoot, "private-raster-case-digest.mp4");
const captionCsv = path.join(parentRoot, "case-digest-review-captions.csv");
const parentManifest = path.join(parentRoot, "private-raster-case-digest-manifest.json");
const sapiTool = path.join(repoRoot, "tools", "fff-local-sapi-tts.ps1");
const outputRoot = path.join(repoRoot, "artifacts", "private-raster-case-digest-audio-continuation-20260812-001");
const mediaName = "private-raster-case-digest-audio-continuation.mp4";
const expected = Object.freeze({
  parent_media_sha256: "0fb679b5d13d56b726a505d060bf9678daa49a1c138e10657954cd7053765df1",
  caption_csv_sha256: "447512097ba63c63685e2fd5e8549c714fd853de8978cfd93b04322ec35c6f7d",
  parent_manifest_sha256: "2cb21aa909999fe1369a6ae4eefbdacb4e7714ffcfb2e04ef2fcfa753bcf7a88",
  accepted_source_commit: "2e96bd380d47869024587eeb19b3f054064390af",
  accepted_source_tree: "accfb3fc5474f4ecb2e39b5c4d69fd8de6a7e841",
  accepted_package_fingerprint: "0f701e7cfa106dee19cf6e378eec1082920cd7f119f37be0f09696ac8020fbf2"
});
const policy = Object.freeze({
  duration_seconds: 180,
  cue_count: 11,
  voice_name: "Microsoft Haruka Desktop",
  culture: "ja-JP",
  rate: 0,
  volume: 100,
  lead_in_seconds: 0.35,
  minimum_tail_seconds: 0.5,
  maximum_atempo_ratio: 1.25,
  trim_threshold_db: -50,
  cue_audibility_threshold_db: -35
});

function fail(code, detail) {
  throw new Error(`${code}: ${detail}`);
}

function requireCondition(condition, code, detail) {
  if (!condition) fail(code, detail);
}

function round(value, digits = 6) {
  const scale = 10 ** digits;
  return Math.round(Number(value) * scale) / scale;
}

function portable(relativePath) {
  return relativePath.replaceAll("\\", "/");
}

async function hashFile(filePath) {
  const hash = createHash("sha256");
  const bytes = await readFile(filePath);
  hash.update(bytes);
  return hash.digest("hex");
}

async function fileIdentity(filePath, relativeTo = repoRoot) {
  const info = await stat(filePath);
  return {
    path: portable(path.relative(relativeTo, filePath)),
    bytes: info.size,
    sha256: await hashFile(filePath)
  };
}

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function run(executable, args, options = {}) {
  return await new Promise((resolve, reject) => {
    const child = spawn(executable, args, {
      cwd: options.cwd ?? repoRoot,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0 || options.allowFailure) resolve({ code, stdout, stderr });
      else reject(new Error(`PROCESS_FAILED: ${executable} ${args.join(" ")}\n${stderr || stdout}`));
    });
  });
}

function parseCsv(text) {
  const records = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field.replace(/\r$/, ""));
      if (row.some((value) => value !== "")) records.push(row);
      row = [];
      field = "";
    } else field += char;
  }
  if (field !== "" || row.length > 0) {
    row.push(field.replace(/\r$/, ""));
    records.push(row);
  }
  const [headers, ...rows] = records;
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

async function probeMedia(filePath) {
  const result = await run("ffprobe", [
    "-v", "error", "-count_frames",
    "-show_entries", "format=duration,size,format_name:stream=index,codec_type,codec_name,profile,width,height,avg_frame_rate,nb_read_frames,sample_rate,channels,channel_layout:stream_tags=language,title",
    "-of", "json", filePath
  ]);
  const raw = JSON.parse(result.stdout);
  const video = raw.streams.find((stream) => stream.codec_type === "video");
  const audio = raw.streams.find((stream) => stream.codec_type === "audio");
  const subtitles = raw.streams.filter((stream) => stream.codec_type === "subtitle");
  return {
    duration_seconds: Number(raw.format.duration),
    bytes: Number(raw.format.size),
    format_name: raw.format.format_name,
    video: video ? {
      codec: video.codec_name,
      profile: video.profile,
      width: video.width,
      height: video.height,
      avg_frame_rate: video.avg_frame_rate,
      frame_count: Number(video.nb_read_frames)
    } : null,
    audio: audio ? {
      codec: audio.codec_name,
      sample_rate_hz: Number(audio.sample_rate),
      channels: audio.channels,
      channel_layout: audio.channel_layout,
      language: audio.tags?.language ?? null,
      title: audio.tags?.title ?? null
    } : null,
    video_stream_count: raw.streams.filter((stream) => stream.codec_type === "video").length,
    audio_stream_count: raw.streams.filter((stream) => stream.codec_type === "audio").length,
    subtitle_stream_count: subtitles.length,
    subtitle_codecs: subtitles.map((stream) => stream.codec_name)
  };
}

async function probeDuration(filePath) {
  const result = await run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nk=1:nw=1", filePath]);
  return Number(result.stdout.trim());
}

function parseMaxVolume(stderr) {
  const match = stderr.match(/max_volume:\s*(-?(?:\d+(?:\.\d+)?|inf))\s*dB/i);
  if (!match) return null;
  return match[1].toLowerCase() === "-inf" ? -Infinity : Number(match[1]);
}

async function extractVideoEssence(filePath, outputPath) {
  await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", filePath, "-map", "0:v:0", "-c", "copy", "-f", "h264", outputPath]);
  return await hashFile(outputPath);
}

async function extractSubtitleText(filePath, outputPath) {
  await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", filePath, "-map", "0:s:0", "-c:s", "srt", outputPath]);
  return await hashFile(outputPath);
}

async function validateInputs() {
  await Promise.all([access(parentMedia), access(captionCsv), access(parentManifest), access(sapiTool)]);
  const identities = {
    parent_media: await fileIdentity(parentMedia),
    caption_csv: await fileIdentity(captionCsv),
    parent_manifest: await fileIdentity(parentManifest),
    sapi_tool: await fileIdentity(sapiTool)
  };
  requireCondition(identities.parent_media.sha256 === expected.parent_media_sha256, "PARENT_CHANGED", "accepted CASE_DIGEST MP4 identity mismatch");
  requireCondition(identities.caption_csv.sha256 === expected.caption_csv_sha256, "PARENT_CHANGED", "accepted caption CSV identity mismatch");
  requireCondition(identities.parent_manifest.sha256 === expected.parent_manifest_sha256, "PARENT_CHANGED", "accepted package manifest identity mismatch");
  const manifest = JSON.parse(await readFile(parentManifest, "utf8"));
  requireCondition(manifest.artifact_id === parentArtifactId, "PARENT_INVALID", "parent artifact ID mismatch");
  requireCondition(manifest.human_acceptance?.verdict === "ACCEPTED_SCOPED", "PARENT_INVALID", "scoped human acceptance is absent");
  requireCondition(manifest.human_acceptance?.source_binding?.accepted_source_commit === expected.accepted_source_commit, "PARENT_INVALID", "accepted source commit mismatch");
  requireCondition(manifest.human_acceptance?.source_binding?.accepted_source_tree === expected.accepted_source_tree, "PARENT_INVALID", "accepted source tree mismatch");
  requireCondition(manifest.human_acceptance?.source_binding?.accepted_source_package_fingerprint === expected.accepted_package_fingerprint, "PARENT_INVALID", "accepted package fingerprint mismatch");
  const captions = parseCsv(await readFile(captionCsv, "utf8")).map((row) => ({
    cue_id: row.cue_id,
    shot_id: row.shot_id,
    start_seconds: Number(row.start_seconds),
    end_seconds: Number(row.end_seconds),
    text_ja: row.text_ja
  }));
  requireCondition(captions.length === policy.cue_count, "PARENT_INVALID", `expected ${policy.cue_count} accepted cues`);
  for (let index = 0; index < captions.length; index += 1) {
    const cue = captions[index];
    requireCondition(cue.cue_id && cue.shot_id && cue.text_ja, "PARENT_INVALID", `incomplete cue at row ${index + 1}`);
    requireCondition(cue.start_seconds >= 0 && cue.end_seconds > cue.start_seconds, "PARENT_INVALID", `invalid timing for ${cue.cue_id}`);
    if (index > 0) requireCondition(captions[index - 1].end_seconds === cue.start_seconds, "PARENT_INVALID", `non-contiguous cue boundary at ${cue.cue_id}`);
  }
  requireCondition(captions.at(-1).end_seconds === policy.duration_seconds, "PARENT_INVALID", "caption timeline does not end at 180 seconds");
  const media = await probeMedia(parentMedia);
  requireCondition(media.video?.codec === "h264" && media.video.width === 960 && media.video.height === 540, "PARENT_INVALID", "parent video format mismatch");
  requireCondition(media.video.frame_count === 5400 && media.video.avg_frame_rate === "30/1", "PARENT_INVALID", "parent frame identity mismatch");
  requireCondition(media.audio_stream_count === 0 && media.subtitle_stream_count === 1, "PARENT_INVALID", "parent must be silent with one subtitle stream");
  return { identities, manifest, captions, media };
}

async function createCueAudio(inputs, tempRoot) {
  const rawRoot = path.join(tempRoot, "raw-cues");
  const processedRoot = path.join(tempRoot, "processed-cues");
  await mkdir(rawRoot, { recursive: true });
  await mkdir(processedRoot, { recursive: true });
  const configPath = path.join(tempRoot, "sapi-config.json");
  await writeJson(configPath, {
    voice_name: policy.voice_name,
    culture: policy.culture,
    rate: policy.rate,
    volume: policy.volume,
    cues: inputs.captions.map((cue) => ({ cue_id: cue.cue_id, spoken_text_ja: cue.text_ja }))
  });
  const systemRoot = process.env.SystemRoot ?? "C:\\Windows";
  const powershell = path.join(systemRoot, "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
  const synthesis = await run(powershell, [
    "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", sapiTool,
    "-ConfigPath", configPath, "-OutputDirectory", rawRoot
  ]);
  const synthesisReceipt = JSON.parse(synthesis.stdout.trim().split(/\r?\n/).at(-1));
  requireCondition(synthesisReceipt.result === "PASS", "TTS_FAILED", "local SAPI synthesis did not pass");
  requireCondition(synthesisReceipt.voice_name === policy.voice_name && synthesisReceipt.culture === policy.culture, "TTS_FAILED", "unexpected local voice identity");
  requireCondition(synthesisReceipt.generated_cues.length === policy.cue_count, "TTS_FAILED", "generated cue count mismatch");
  const cues = [];
  for (const cue of inputs.captions) {
    const rawPath = path.join(rawRoot, `${cue.cue_id}.raw.wav`);
    const trimmedPath = path.join(tempRoot, `${cue.cue_id}.trimmed.wav`);
    const processedPath = path.join(processedRoot, `${cue.cue_id}.wav`);
    const rawDuration = await probeDuration(rawPath);
    await run("ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-y", "-i", rawPath,
      "-af", `silenceremove=start_periods=1:start_duration=0.04:start_threshold=${policy.trim_threshold_db}dB,areverse,silenceremove=start_periods=1:start_duration=0.04:start_threshold=${policy.trim_threshold_db}dB,areverse`,
      "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", trimmedPath
    ]);
    const trimmedDuration = await probeDuration(trimmedPath);
    const available = cue.end_seconds - cue.start_seconds - policy.lead_in_seconds - policy.minimum_tail_seconds;
    const atempo = trimmedDuration > available ? trimmedDuration / available : 1;
    requireCondition(atempo <= policy.maximum_atempo_ratio, "PACING_DEPENDENCY", `${cue.cue_id} requires atempo ${atempo.toFixed(4)}`);
    const predictedDuration = trimmedDuration / atempo;
    const fadeOutStart = Math.max(0, predictedDuration - 0.06);
    await run("ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-y", "-i", trimmedPath,
      "-af", `atempo=${atempo.toFixed(8)},afade=t=in:st=0:d=0.03,afade=t=out:st=${fadeOutStart.toFixed(6)}:d=0.06,alimiter=limit=0.90`,
      "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", processedPath
    ]);
    const processedDuration = await probeDuration(processedPath);
    const audioStart = cue.start_seconds + policy.lead_in_seconds;
    const audioEnd = audioStart + processedDuration;
    const tail = cue.end_seconds - audioEnd;
    requireCondition(tail + 0.01 >= policy.minimum_tail_seconds, "PACING_DEPENDENCY", `${cue.cue_id} exceeds its accepted caption window`);
    cues.push({
      ...cue,
      spoken_text_ja: cue.text_ja,
      raw_duration_seconds: round(rawDuration),
      trimmed_duration_seconds: round(trimmedDuration),
      atempo_ratio: round(atempo),
      audio_start_seconds: round(audioStart),
      audio_end_seconds: round(audioEnd),
      subtitle_lead_in_seconds: round(audioStart - cue.start_seconds),
      subtitle_tail_seconds: round(tail),
      within_accepted_caption_window: audioStart >= cue.start_seconds && audioEnd <= cue.end_seconds + 0.01,
      processed_path: processedPath
    });
  }
  return { synthesisReceipt, cues };
}

async function muxMedia(cues, outputPath) {
  const args = ["-hide_banner", "-loglevel", "error", "-y", "-i", parentMedia];
  for (const cue of cues) args.push("-i", cue.processed_path);
  const delayed = cues.map((cue, index) => `[${index + 1}:a]adelay=${Math.round(cue.audio_start_seconds * 1000)}:all=1[a${index + 1}]`);
  const labels = cues.map((_, index) => `[a${index + 1}]`).join("");
  const filter = `${delayed.join(";")};${labels}amix=inputs=${cues.length}:normalize=0:duration=longest,apad=whole_dur=${policy.duration_seconds},atrim=0:${policy.duration_seconds},aresample=48000,aformat=channel_layouts=stereo[aout]`;
  args.push(
    "-filter_complex", filter,
    "-map", "0:v:0", "-map", "[aout]", "-map", "0:s:0?",
    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", "-c:s", "copy",
    "-metadata:s:a:0", "language=jpn", "-metadata:s:a:0", "title=Provisional local Japanese narration - private review",
    "-metadata:s:s:0", "language=jpn", "-metadata:s:s:0", "title=Accepted CASE_DIGEST review captions",
    "-t", String(policy.duration_seconds), "-movflags", "+faststart", outputPath
  );
  await run("ffmpeg", args);
}

async function analyzeCandidate(mediaPath, cues, tempRoot) {
  const probe = await probeMedia(mediaPath);
  requireCondition(Math.abs(probe.duration_seconds - policy.duration_seconds) <= 0.05, "MEDIA_INVALID", "duration mismatch");
  requireCondition(probe.video?.codec === "h264" && probe.video.width === 960 && probe.video.height === 540, "MEDIA_INVALID", "video format mismatch");
  requireCondition(probe.video.frame_count === 5400 && probe.video.avg_frame_rate === "30/1", "MEDIA_INVALID", "video frame identity mismatch");
  requireCondition(probe.audio_stream_count === 1 && probe.audio?.codec === "aac", "MEDIA_INVALID", "one AAC audio stream is required");
  requireCondition(probe.audio.sample_rate_hz === 48000 && probe.audio.channels === 2, "MEDIA_INVALID", "audio sample rate/channel mismatch");
  requireCondition(probe.subtitle_stream_count === 1 && probe.subtitle_codecs[0] === "mov_text", "MEDIA_INVALID", "accepted subtitle stream was not preserved");
  await run("ffmpeg", ["-v", "error", "-i", mediaPath, "-map", "0:v:0", "-map", "0:a:0", "-f", "null", "-"]);
  const originalVideoHash = await extractVideoEssence(parentMedia, path.join(tempRoot, "parent-video.h264"));
  const revisedVideoHash = await extractVideoEssence(mediaPath, path.join(tempRoot, "revised-video.h264"));
  const originalSubtitleHash = await extractSubtitleText(parentMedia, path.join(tempRoot, "parent-subtitle.srt"));
  const revisedSubtitleHash = await extractSubtitleText(mediaPath, path.join(tempRoot, "revised-subtitle.srt"));
  requireCondition(originalVideoHash === revisedVideoHash, "MEDIA_INVALID", "parent H.264 essence changed");
  requireCondition(originalSubtitleHash === revisedSubtitleHash, "MEDIA_INVALID", "accepted subtitle content/timing changed");
  const cueActivity = [];
  for (const cue of cues) {
    const activity = await run("ffmpeg", [
      "-hide_banner", "-nostats", "-ss", String(cue.start_seconds), "-t", String(cue.end_seconds - cue.start_seconds),
      "-i", mediaPath, "-map", "0:a:0", "-vn", "-af", "volumedetect", "-f", "null", "-"
    ], { allowFailure: true });
    const maxVolumeDb = parseMaxVolume(activity.stderr);
    const audible = maxVolumeDb !== null && maxVolumeDb >= policy.cue_audibility_threshold_db;
    cueActivity.push({ cue_id: cue.cue_id, max_volume_db: maxVolumeDb, threshold_db: policy.cue_audibility_threshold_db, audible });
  }
  requireCondition(cueActivity.every((cue) => cue.audible), "MEDIA_INVALID", "one or more scheduled cue windows is silent");
  const totalVolume = await run("ffmpeg", ["-hide_banner", "-nostats", "-i", mediaPath, "-map", "0:a:0", "-vn", "-af", "volumedetect", "-f", "null", "-"], { allowFailure: true });
  const silence = await run("ffmpeg", ["-hide_banner", "-nostats", "-i", mediaPath, "-map", "0:a:0", "-vn", "-af", "silencedetect=noise=-45dB:d=0.75", "-f", "null", "-"], { allowFailure: true });
  const black = await run("ffmpeg", ["-hide_banner", "-nostats", "-i", mediaPath, "-map", "0:v:0", "-an", "-vf", "blackdetect=d=1:pix_th=0.02", "-f", "null", "-"], { allowFailure: true });
  return {
    probe,
    full_av_decode: "PASS",
    parent_video_essence_sha256: originalVideoHash,
    revised_video_essence_sha256: revisedVideoHash,
    exact_parent_video_essence_match: originalVideoHash === revisedVideoHash,
    parent_subtitle_srt_sha256: originalSubtitleHash,
    revised_subtitle_srt_sha256: revisedSubtitleHash,
    exact_parent_subtitle_text_timing_match: originalSubtitleHash === revisedSubtitleHash,
    cue_activity: cueActivity,
    audible_cue_count: cueActivity.filter((cue) => cue.audible).length,
    total_max_volume_db: parseMaxVolume(totalVolume.stderr),
    silence_event_count: (silence.stderr.match(/silence_start:/g) ?? []).length,
    silence_policy: { noise_db: -45, minimum_duration_seconds: 0.75, interpretation: "expected pauses between discrete narration cues; scheduled cue audibility is evaluated separately" },
    black_event_count: (black.stderr.match(/black_start:/g) ?? []).length,
    black_policy: { minimum_duration_seconds: 1, pixel_threshold: 0.02 }
  };
}

function reviewHtml(receipt, mediaSha) {
  const rows = receipt.cues.map((cue) => `<tr><td>${cue.cue_id}</td><td>${cue.shot_id}</td><td>${cue.start_seconds.toFixed(2)}–${cue.end_seconds.toFixed(2)}</td><td>${cue.audio_start_seconds.toFixed(2)}–${cue.audio_end_seconds.toFixed(2)}</td><td>${cue.text_ja}</td><td>${cue.atempo_ratio.toFixed(3)}</td></tr>`).join("");
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CASE_DIGEST provisional audio review</title><style>:root{color-scheme:dark;background:#0b1015;color:#f4f0e7;font-family:"Yu Gothic UI",system-ui,sans-serif}*{box-sizing:border-box}body{margin:0}.page{width:min(1120px,calc(100% - 32px));margin:auto;padding:36px 0 64px}h1,h2{font-family:"Yu Mincho",serif}.kicker{color:#d7b875;letter-spacing:.14em}.notice{border-left:4px solid #d7b875;background:#151c24;padding:14px 18px}video,img{display:block;width:100%;background:#000;border:1px solid #35414e}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:18px 0}.grid div{background:#151c24;padding:12px}.grid b{display:block;color:#d7b875}.scroll{overflow:auto}table{width:100%;border-collapse:collapse;font-size:.78rem}th,td{padding:8px;border-top:1px solid #35414e;text-align:left;vertical-align:top}code{color:#d7b875;overflow-wrap:anywhere}@media(max-width:720px){.grid{grid-template-columns:1fr}}</style></head><body><main class="page"><p class="kicker">NON-DENSOU · PRIVATE REVIEW · PROVISIONAL AUDIO</p><h1>3分事件ダイジェスト — A/V continuation</h1><p class="notice">限定受入れ済みの既存 CASE_DIGEST picture・11 review caption・subtitle timing を変更せず、同じ11文を local SAPI で仮ナレーション化した技術review候補です。voice/audio の人間受入れ、rights、production、publication、final canon は未成立です。</p><video controls preload="metadata"><source src="${mediaName}" type="video/mp4"></video><div class="grid"><div><b>Artifact</b>${artifactId}</div><div><b>Duration</b>${receipt.media.probe.duration_seconds.toFixed(3)}s</div><div><b>Audible cues</b>${receipt.media.audible_cue_count}/${policy.cue_count}</div><div><b>MP4 SHA-256</b><code>${mediaSha}</code></div></div><h2>Audio waveform</h2><img src="audio-waveform.jpg" alt="Provisional narration waveform"><h2>Cue sync</h2><div class="scroll"><table><thead><tr><th>Cue</th><th>Shot</th><th>Accepted caption</th><th>Audio</th><th>Exact accepted text</th><th>Atempo</th></tr></thead><tbody>${rows}</tbody></table></div><h2>Review boundary</h2><p>Picture essence exact match: <code>${receipt.media.exact_parent_video_essence_match}</code>. Subtitle text/timing exact match: <code>${receipt.media.exact_parent_subtitle_text_timing_match}</code>. The local voice is provisional and not selected for production.</p></main></body></html>`;
}

async function build() {
  try {
    await access(outputRoot);
    fail("NON_OVERWRITE", `output already exists: ${portable(path.relative(repoRoot, outputRoot))}`);
  } catch (error) {
    if (!String(error.message).includes("ENOENT") && !String(error.message).includes("NON_OVERWRITE")) throw error;
    if (String(error.message).includes("NON_OVERWRITE")) throw error;
  }
  const inputs = await validateInputs();
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "fff-case-digest-audio-"));
  const packageRoot = path.join(tempRoot, artifactId);
  await mkdir(packageRoot, { recursive: true });
  try {
    const originalBefore = await fileIdentity(parentMedia);
    const generated = await createCueAudio(inputs, tempRoot);
    const mediaPath = path.join(packageRoot, mediaName);
    await muxMedia(generated.cues, mediaPath);
    const media = await analyzeCandidate(mediaPath, generated.cues, tempRoot);
    const originalAfter = await fileIdentity(parentMedia);
    requireCondition(originalBefore.bytes === originalAfter.bytes && originalBefore.sha256 === originalAfter.sha256, "PARENT_CHANGED", "accepted parent MP4 changed during build");
    await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", mediaPath, "-filter_complex", "[0:a:0]aformat=channel_layouts=mono,showwavespic=s=1280x240:colors=0xd7b875[wave]", "-map", "[wave]", "-an", "-frames:v", "1", "-c:v", "mjpeg", "-q:v", "3", path.join(packageRoot, "audio-waveform.jpg")]);
    const receipt = {
      schema_version: "fff.privateRasterCaseDigestAudioContinuationReceipt.v1",
      work_order_id: workOrderId,
      artifact_id: artifactId,
      parent_artifact_id: parentArtifactId,
      classification: "PRIVATE_TECHNICAL_AV_REVIEW_CANDIDATE",
      content_lane: "NON_DENSOU_CASE_DIGEST",
      material_result: true,
      parent_binding: {
        accepted_source_ref: "refs/heads/codex/fff-case-digest-format-reset-continuity-v1",
        accepted_source_commit: expected.accepted_source_commit,
        accepted_source_tree: expected.accepted_source_tree,
        accepted_package_fingerprint: expected.accepted_package_fingerprint,
        accepted_parent_mp4_sha256: expected.parent_media_sha256,
        human_decision_id: "FFF-SUP-CASE-DIGEST-C2-ACCEPT-20260726",
        human_verdict: "ACCEPTED_SCOPED",
        accepted_dimensions: ["CASE_DIGEST comprehension and format fitness", "review-caption wording and line-break/readability", "unchanged existing image sequence and visual essence"]
      },
      input_identities: inputs.identities,
      voice: {
        engine_id: generated.synthesisReceipt.engine_id,
        voice_name: generated.synthesisReceipt.voice_name,
        culture: generated.synthesisReceipt.culture,
        gender: generated.synthesisReceipt.gender,
        rate: generated.synthesisReceipt.rate,
        volume: generated.synthesisReceipt.volume,
        external_call: generated.synthesisReceipt.external_call,
        credentials_touched: generated.synthesisReceipt.credentials_touched,
        provisional: true,
        production_selected: false,
        rights_cleared: false
      },
      timing_policy: policy,
      cues: generated.cues.map(({ processed_path, ...cue }) => cue),
      media,
      preservation: {
        parent_before: originalBefore,
        parent_after: originalAfter,
        parent_unchanged: originalBefore.bytes === originalAfter.bytes && originalBefore.sha256 === originalAfter.sha256
      },
      boundaries: {
        actual_densou_source_used: false,
        densou_source_gate_polled_or_reopened: false,
        accepted_creative_content_changed: false,
        picture_changed: false,
        accepted_caption_text_or_timing_changed: false,
        audio_human_accepted: false,
        voice_final: false,
        rights_approved: false,
        production_approved: false,
        publication_approved: false,
        final_canon: false
      }
    };
    await writeJson(path.join(packageRoot, "audio-sync-receipt.json"), receipt);
    const mediaSha = await hashFile(mediaPath);
    await writeFile(path.join(packageRoot, "review.html"), reviewHtml(receipt, mediaSha), "utf8");
    await writeFile(path.join(packageRoot, "README.md"), `# CASE_DIGEST provisional A/V continuation\n\n- Artifact: \`${artifactId}\`\n- Parent: \`${parentArtifactId}\`\n- Media: \`${mediaName}\`\n- Media SHA-256: \`${mediaSha}\`\n- Scope: non-Densou, private technical A/V review candidate\n- Audio: ${policy.cue_count}/${policy.cue_count} accepted review-caption texts, local ${policy.voice_name}, provisional only\n- Picture/subtitle: exact parent essence and extracted subtitle timing/text match\n\nOpen \`review.html\` locally. This package does not establish voice/audio acceptance, rights clearance, production approval, publication, or final canon.\n`, "utf8");
    const payloadNames = [mediaName, "audio-waveform.jpg", "audio-sync-receipt.json", "review.html", "README.md"];
    const payloads = [];
    for (const name of payloadNames) payloads.push(await fileIdentity(path.join(packageRoot, name), packageRoot));
    const manifest = {
      schema_version: "fff.privateRasterCaseDigestAudioContinuationManifest.v1",
      artifact_id: artifactId,
      parent_artifact_id: parentArtifactId,
      classification: "PRIVATE_TECHNICAL_AV_REVIEW_CANDIDATE",
      content_lane: "NON_DENSOU_CASE_DIGEST",
      payload_count: payloads.length,
      payloads,
      portable: payloads.every((item) => !path.isAbsolute(item.path)),
      review_entrypoint: "review.html",
      media_entrypoint: mediaName
    };
    await writeJson(path.join(packageRoot, "package-manifest.json"), manifest);
    await mkdir(path.dirname(outputRoot), { recursive: true });
    await rename(packageRoot, outputRoot);
    const finalMedia = await fileIdentity(path.join(outputRoot, mediaName));
    const finalManifest = await fileIdentity(path.join(outputRoot, "package-manifest.json"));
    console.log(JSON.stringify({ result: "MATERIALIZED", artifact_id: artifactId, media: finalMedia, manifest: finalManifest, output_root: portable(path.relative(repoRoot, outputRoot)) }));
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

async function verify() {
  const inputs = await validateInputs();
  const manifestPath = path.join(outputRoot, "package-manifest.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  requireCondition(manifest.artifact_id === artifactId && manifest.parent_artifact_id === parentArtifactId, "PACKAGE_INVALID", "package identity mismatch");
  requireCondition(manifest.content_lane === "NON_DENSOU_CASE_DIGEST" && manifest.portable === true, "PACKAGE_INVALID", "package boundary mismatch");
  requireCondition(manifest.payload_count === 5 && manifest.payloads.length === 5, "PACKAGE_INVALID", "package closure mismatch");
  for (const payload of manifest.payloads) {
    requireCondition(!path.isAbsolute(payload.path) && !payload.path.includes(".."), "PACKAGE_INVALID", `non-portable payload path: ${payload.path}`);
    const filePath = path.join(outputRoot, payload.path);
    const identity = await fileIdentity(filePath, outputRoot);
    requireCondition(identity.bytes === payload.bytes && identity.sha256 === payload.sha256, "PACKAGE_INVALID", `payload identity mismatch: ${payload.path}`);
  }
  const receipt = JSON.parse(await readFile(path.join(outputRoot, "audio-sync-receipt.json"), "utf8"));
  requireCondition(receipt.artifact_id === artifactId && receipt.cues.length === policy.cue_count, "PACKAGE_INVALID", "receipt identity/count mismatch");
  requireCondition(receipt.cues.every((cue) => cue.spoken_text_ja === cue.text_ja && cue.within_accepted_caption_window), "PACKAGE_INVALID", "cue text/timing drift");
  requireCondition(receipt.media.audible_cue_count === policy.cue_count && receipt.media.full_av_decode === "PASS", "PACKAGE_INVALID", "media health receipt mismatch");
  requireCondition(receipt.media.exact_parent_video_essence_match && receipt.media.exact_parent_subtitle_text_timing_match, "PACKAGE_INVALID", "parent essence preservation mismatch");
  requireCondition(receipt.boundaries.actual_densou_source_used === false && receipt.boundaries.densou_source_gate_polled_or_reopened === false, "PACKAGE_INVALID", "Densou boundary mismatch");
  requireCondition(Object.entries(receipt.boundaries).filter(([key]) => ["audio_human_accepted", "voice_final", "rights_approved", "production_approved", "publication_approved", "final_canon"].includes(key)).every(([, value]) => value === false), "PACKAGE_INVALID", "closed human/rights/production boundary was opened");
  const liveProbe = await probeMedia(path.join(outputRoot, mediaName));
  requireCondition(liveProbe.audio_stream_count === 1 && liveProbe.subtitle_stream_count === 1 && liveProbe.video.frame_count === 5400, "PACKAGE_INVALID", "live media stream mismatch");
  await run("ffmpeg", ["-v", "error", "-i", path.join(outputRoot, mediaName), "-map", "0:v:0", "-map", "0:a:0", "-f", "null", "-"]);
  const textBlob = await readFile(path.join(outputRoot, "audio-sync-receipt.json"), "utf8") + await readFile(manifestPath, "utf8") + await readFile(path.join(outputRoot, "review.html"), "utf8");
  requireCondition(!/[A-Za-z]:[\\/]/.test(textBlob), "PACKAGE_INVALID", "absolute Windows path leaked into portable package");
  const media = await fileIdentity(path.join(outputRoot, mediaName));
  const packageManifest = await fileIdentity(manifestPath);
  console.log(JSON.stringify({ result: "PASS", checks: 18, artifact_id: artifactId, media, package_manifest: packageManifest, parent_media_sha256: inputs.identities.parent_media.sha256, cues: policy.cue_count }));
}

function usage() {
  console.log(`Usage:\n  node tools/fff-private-raster-case-digest-audio-continuation.mjs build\n  node tools/fff-private-raster-case-digest-audio-continuation.mjs verify`);
}

const command = process.argv[2];
try {
  if (command === "build") await build();
  else if (command === "verify") await verify();
  else usage();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
