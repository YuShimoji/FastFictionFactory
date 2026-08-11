import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import {
  access,
  copyFile,
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
const defaultPlanPath = path.join(repoRoot, "artifacts", "densou-s01e01-benchmark-video-slice-audio-repair-plan.json");
const defaultOutputPath = path.join(repoRoot, "artifacts", "densou-s01e01-benchmark-video-slice-audio-repair-001");
const defaultResultPath = path.join(repoRoot, "artifacts", "densou-s01e01-benchmark-video-slice-audio-repair-result.json");
const sapiToolPath = path.join(repoRoot, "tools", "fff-local-sapi-tts.ps1");
const expectedArtifactId = "fff-densou-s01e01-benchmark-video-slice-audio-repair-001";
const expectedParentArtifactId = "fff-densou-s01e01-benchmark-video-slice-001";
const expectedSourceSha = "256837a94afd521cadfcb676da2c3873a914ce95f11f493d5b60e15bc42f9a32";

class AudioRepairError extends Error {
  constructor(code, message, exitCode = 2) {
    super(message);
    this.code = code;
    this.exitCode = exitCode;
  }
}

function requireCondition(condition, code, message, exitCode = 2) {
  if (!condition) throw new AudioRepairError(code, message, exitCode);
}

function parseArgs(argv) {
  const [command = "help", ...rest] = argv;
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    requireCondition(token.startsWith("--"), "INVALID_ARGUMENT", `unexpected argument: ${token}`);
    const value = rest[index + 1];
    requireCondition(value && !value.startsWith("--"), "INVALID_ARGUMENT", `missing value for ${token}`);
    options[token.slice(2).replaceAll("-", "_")] = value;
    index += 1;
  }
  return { command, options };
}

async function readJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    throw new AudioRepairError("INVALID_JSON", `cannot read JSON ${filePath}: ${error.message}`);
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

function round(value, digits = 6) {
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}

async function runProcess(command, args, { cwd = repoRoot, allowFailure = false } = {}) {
  return await new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, windowsHide: true, shell: false });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("error", (error) => reject(new AudioRepairError("PROCESS_START_FAILED", `${command}: ${error.message}`)));
    child.on("close", (code) => {
      const result = { command, args, code, stdout, stderr };
      if (code !== 0 && !allowFailure) {
        reject(new AudioRepairError("PROCESS_FAILED", `${command} exited ${code}: ${(stderr || stdout).trim().slice(-2400)}`));
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

async function probeMedia(mediaPath) {
  const result = await runProcess("ffprobe", [
    "-v", "error", "-count_frames", "-show_entries",
    "format=duration,size,format_name:stream=index,codec_type,codec_name,width,height,pix_fmt,avg_frame_rate,nb_frames,nb_read_frames,sample_rate,channels,channel_layout,bit_rate,duration",
    "-of", "json", mediaPath
  ]);
  const parsed = JSON.parse(result.stdout);
  const video = parsed.streams.find((stream) => stream.codec_type === "video");
  const audio = parsed.streams.filter((stream) => stream.codec_type === "audio");
  const subtitles = parsed.streams.filter((stream) => stream.codec_type === "subtitle");
  return {
    format_name: parsed.format?.format_name ?? null,
    duration_seconds: Number(parsed.format?.duration ?? 0),
    bytes: Number(parsed.format?.size ?? 0),
    video_codec: video?.codec_name ?? null,
    pixel_format: video?.pix_fmt ?? null,
    width: video?.width ?? null,
    height: video?.height ?? null,
    avg_frame_rate: video?.avg_frame_rate ?? null,
    frame_count: Number(video?.nb_read_frames ?? video?.nb_frames ?? 0),
    audio_stream_count: audio.length,
    audio_codec: audio[0]?.codec_name ?? null,
    audio_sample_rate_hz: Number(audio[0]?.sample_rate ?? 0),
    audio_channels: audio[0]?.channels ?? 0,
    audio_channel_layout: audio[0]?.channel_layout ?? null,
    audio_bit_rate: Number(audio[0]?.bit_rate ?? 0),
    subtitle_stream_count: subtitles.length
  };
}

async function probeAudioDuration(audioPath) {
  const result = await runProcess("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", audioPath]);
  const duration = Number(result.stdout.trim());
  requireCondition(Number.isFinite(duration) && duration > 0, "AUDIO_INVALID", `invalid audio duration: ${audioPath}`);
  return duration;
}

function parseVolume(stderr) {
  const mean = stderr.match(/mean_volume:\s*(-?[0-9.]+) dB/);
  const max = stderr.match(/max_volume:\s*(-?[0-9.]+) dB/);
  return {
    mean_volume_db: mean ? Number(mean[1]) : null,
    max_volume_db: max ? Number(max[1]) : null
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
  const recordedSha = (await readFile(path.join(root, "evidence-manifest.sha256"), "utf8")).trim().split(/\s+/)[0];
  const actualSha = await hashFile(manifestPath);
  if (recordedSha !== actualSha) failures.push("evidence-manifest.sha256: mismatch");
  requireCondition(failures.length === 0, "PACKAGE_INVALID", `evidence manifest failures: ${failures.join(", ")}`);
  return { file_count: manifest.files.length, mismatch_count: 0, evidence_manifest_sha256: actualSha };
}

async function validateParentEvidence(parentRoot) {
  const evidence = await verifyEvidenceManifest(parentRoot);
  const segmentMap = await readJson(path.join(parentRoot, "segment-source-map.json"));
  const receipt = await readJson(path.join(parentRoot, "source-packet-receipt.json"));
  requireCondition(segmentMap.artifact_id === expectedParentArtifactId, "PARENT_INVALID", "parent segment map artifact mismatch");
  requireCondition(segmentMap.counts.mapped_segments === 8, "PARENT_INVALID", "parent segment count mismatch");
  requireCondition(segmentMap.counts.distinct_source_claims === 12, "PARENT_INVALID", "parent source claim count mismatch");
  requireCondition(segmentMap.counts.unsupported_claims === 0 && segmentMap.counts.hidden_causal_bridges === 0, "PARENT_INVALID", "parent fact boundary mismatch");
  requireCondition(receipt.source_sha256 === expectedSourceSha, "PARENT_INVALID", "parent source receipt mismatch");
  return { evidence, segmentMap, receipt };
}

async function validatePlan(planPath) {
  const plan = await readJson(planPath);
  requireCondition(plan.schema_version === "fff.densou.episodeAudioRepairPlan.v1", "INVALID_PLAN", "plan schema mismatch");
  requireCondition(plan.work_order_id === "FFF-DENSOU-180-AUDIO-REPAIR-001", "INVALID_PLAN", "work order mismatch");
  requireCondition(plan.artifact_id === expectedArtifactId, "INVALID_PLAN", "artifact identity mismatch");
  requireCondition(plan.parent_artifact_id === expectedParentArtifactId, "INVALID_PLAN", "parent artifact identity mismatch");
  requireCondition(plan.episode_id === "densou-s01e01-bellless-tower", "INVALID_PLAN", "episode identity mismatch");
  requireCondition(plan.classification === "PARTIAL_PRODUCTION_SLICE" && plan.episode_completion === false, "INVALID_PLAN", "completion classification changed");
  requireCondition(plan.source_packet_id === "fff-densou-series-source-256837a94afd521c", "INVALID_PLAN", "source packet mismatch");
  requireCondition(plan.source_revision_id === "densou-256837a94afd521c", "INVALID_PLAN", "source revision mismatch");
  requireCondition(plan.source_sha256 === expectedSourceSha, "INVALID_PLAN", "source SHA mismatch");
  requireCondition(plan.source_basis_id === "fff-densou-source-basis-b2cab3adb7c270d8", "INVALID_PLAN", "source basis mismatch");
  requireCondition(plan.target.duration_seconds === 180 && plan.target.full_episode_duration_seconds === 720 && plan.target.remaining_seconds === 540, "INVALID_PLAN", "duration scope changed");
  requireCondition(plan.target.video_policy === "copy_exact_parent_h264_essence", "INVALID_PLAN", "video policy changed");
  requireCondition(plan.target.subtitle_policy === "preserve_exact_burned_captions_and_companion_ass_srt", "INVALID_PLAN", "subtitle policy changed");
  requireCondition(plan.voice.engine_id === "windows-system-speech-sapi-local" && plan.voice.culture === "ja-JP", "INVALID_PLAN", "voice engine/culture mismatch");
  requireCondition(plan.voice.external_call === false && plan.voice.credentials_required === false && plan.voice.new_software_install === false, "INVALID_PLAN", "external voice effect opened");
  requireCondition(plan.voice.dialogue_authored === false, "INVALID_PLAN", "dialogue invention is not allowed");
  requireCondition(Array.isArray(plan.cues) && plan.cues.length === 15, "INVALID_PLAN", "exactly fifteen cues required");
  requireCondition(Object.values(plan.closed_effects).every((value) => value === false), "INVALID_PLAN", "closed effect was opened");

  const sourcePath = path.join(repoRoot, plan.source_path);
  requireCondition(await hashFile(sourcePath) === expectedSourceSha, "SOURCE_IDENTITY_MISMATCH", "live source SHA drift");
  const parentPlanPath = path.join(repoRoot, plan.parent_plan_path);
  const parentPlan = await readJson(parentPlanPath);
  requireCondition(parentPlan.artifact_id === expectedParentArtifactId, "PARENT_INVALID", "parent plan artifact mismatch");
  requireCondition(parentPlan.source_sha256 === expectedSourceSha, "PARENT_INVALID", "parent plan source mismatch");
  requireCondition(parentPlan.visual_updates.length === 15, "PARENT_INVALID", "parent visual update count mismatch");

  for (const [index, cue] of plan.cues.entries()) {
    const update = parentPlan.visual_updates[index];
    requireCondition(cue.cue_id === `DA-${String(index + 1).padStart(2, "0")}`, "INVALID_PLAN", `cue sequence mismatch at ${index}`);
    requireCondition(cue.update_id === update.update_id, "INVALID_PLAN", `update mismatch for ${cue.cue_id}`);
    requireCondition(cue.start_seconds === update.start_seconds && cue.end_seconds === update.end_seconds, "INVALID_PLAN", `timing mismatch for ${cue.cue_id}`);
    requireCondition(cue.subtitle_text_ja === update.caption_ja, "INVALID_PLAN", `subtitle text drift for ${cue.cue_id}`);
    let normalized = cue.subtitle_text_ja;
    for (const rule of cue.pronunciation_normalizations) {
      requireCondition(normalized.includes(rule.from), "INVALID_PLAN", `normalization source missing for ${cue.cue_id}: ${rule.from}`);
      normalized = normalized.replace(rule.from, rule.to);
    }
    requireCondition(normalized === cue.spoken_text_ja, "INVALID_PLAN", `spoken text exceeds declared normalization for ${cue.cue_id}`);
  }

  const originalPath = path.join(repoRoot, plan.original_media.path);
  const originalStat = await stat(originalPath);
  requireCondition(originalStat.size === plan.original_media.bytes, "ORIGINAL_IDENTITY_MISMATCH", "original MP4 byte size drift");
  requireCondition(await hashFile(originalPath) === plan.original_media.sha256, "ORIGINAL_IDENTITY_MISMATCH", "original MP4 SHA drift");
  const originalProbe = await probeMedia(originalPath);
  requireCondition(Math.abs(originalProbe.duration_seconds - 180) <= 0.05, "ORIGINAL_IDENTITY_MISMATCH", "original duration drift");
  requireCondition(originalProbe.video_codec === "h264" && originalProbe.width === 1280 && originalProbe.height === 720, "ORIGINAL_IDENTITY_MISMATCH", "original video format drift");
  requireCondition(originalProbe.audio_stream_count === 0, "ORIGINAL_IDENTITY_MISMATCH", "original audio stream count drift");

  const parentRoot = path.join(repoRoot, plan.parent_package_path);
  const parent = await validateParentEvidence(parentRoot);
  return {
    plan,
    planPath,
    sourcePath,
    parentPlan,
    parentRoot,
    parent,
    originalPath,
    originalStat,
    originalProbe,
    metrics: {
      cue_count: plan.cues.length,
      segment_count: parent.segmentMap.counts.mapped_segments,
      source_claim_count: parent.segmentMap.counts.distinct_source_claims,
      pronunciation_normalization_count: plan.cues.reduce((sum, cue) => sum + cue.pronunciation_normalizations.length, 0),
      dialogue_authored_count: 0
    }
  };
}

async function inventoryFile(root, filePath) {
  const bytes = await readFile(filePath);
  return { path: safePackageRelative(root, filePath), byte_size: bytes.length, sha256: sha256(bytes) };
}

async function videoEssenceHash(mediaPath, outputPath) {
  await runProcess("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", mediaPath, "-map", "0:v:0", "-c", "copy", "-f", "h264", outputPath]);
  return await hashFile(outputPath);
}

async function buildOriginalPreservationReceipt(validated, revisedPath, tempRoot, before) {
  const afterStat = await stat(validated.originalPath);
  const afterSha = await hashFile(validated.originalPath);
  const originalEssence = await videoEssenceHash(validated.originalPath, path.join(tempRoot, "original-video.h264"));
  const revisedEssence = await videoEssenceHash(revisedPath, path.join(tempRoot, "revised-video.h264"));
  requireCondition(afterStat.size === before.bytes && afterSha === before.sha256, "ORIGINAL_MUTATED", "original MP4 changed during audio repair");
  requireCondition(originalEssence === revisedEssence, "VIDEO_ESSENCE_CHANGED", "revised video essence differs from original");
  return {
    schema_version: "fff.densou.originalMediaPreservationReceipt.v1",
    artifact_id: validated.plan.artifact_id,
    parent_artifact_id: validated.plan.parent_artifact_id,
    original_media: {
      path: validated.plan.original_media.path,
      bytes_before: before.bytes,
      bytes_after: afterStat.size,
      sha256_before: before.sha256,
      sha256_after: afterSha,
      mtime_utc_before: before.mtime_utc,
      mtime_utc_after: afterStat.mtime.toISOString(),
      unchanged: before.bytes === afterStat.size && before.sha256 === afterSha && before.mtime_utc === afterStat.mtime.toISOString()
    },
    video_essence: {
      extraction: "ffmpeg stream-copy Annex B H.264",
      original_sha256: originalEssence,
      revised_sha256: revisedEssence,
      exact_match: originalEssence === revisedEssence
    }
  };
}

async function createCueAudio(validated, tempRoot) {
  const rawRoot = path.join(tempRoot, "raw-cues");
  const processedRoot = path.join(tempRoot, "processed-cues");
  await mkdir(rawRoot, { recursive: true });
  await mkdir(processedRoot, { recursive: true });
  const sapiConfigPath = path.join(tempRoot, "sapi-config.json");
  await writeJson(sapiConfigPath, {
    voice_name: validated.plan.voice.voice_name,
    culture: validated.plan.voice.culture,
    rate: validated.plan.voice.rate,
    volume: validated.plan.voice.volume,
    cues: validated.plan.cues.map(({ cue_id, spoken_text_ja }) => ({ cue_id, spoken_text_ja }))
  });
  const systemRoot = process.env.SystemRoot ?? "C:\\Windows";
  const powershellPath = path.join(systemRoot, "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
  await access(powershellPath);
  const synthesis = await runProcess(powershellPath, [
    "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", sapiToolPath,
    "-ConfigPath", sapiConfigPath, "-OutputDirectory", rawRoot
  ]);
  const synthesisReceipt = JSON.parse(synthesis.stdout.trim().split(/\r?\n/).at(-1));
  requireCondition(synthesisReceipt.result === "PASS", "TTS_FAILED", "SAPI synthesis did not pass");
  requireCondition(synthesisReceipt.voice_name === validated.plan.voice.voice_name && synthesisReceipt.culture === "ja-JP", "TTS_FAILED", "SAPI selected the wrong voice");
  requireCondition(synthesisReceipt.generated_cues.length === 15, "TTS_FAILED", "SAPI cue count mismatch");

  const rows = [];
  for (const cue of validated.plan.cues) {
    const rawPath = path.join(rawRoot, `${cue.cue_id}.raw.wav`);
    const trimmedPath = path.join(tempRoot, `${cue.cue_id}.trimmed.wav`);
    const processedPath = path.join(processedRoot, `${cue.cue_id}.wav`);
    const rawDuration = await probeAudioDuration(rawPath);
    const threshold = validated.plan.timing_policy.trim_silence_threshold_db;
    await runProcess("ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-y", "-i", rawPath,
      "-af", `silenceremove=start_periods=1:start_duration=0.04:start_threshold=${threshold}dB,areverse,silenceremove=start_periods=1:start_duration=0.04:start_threshold=${threshold}dB,areverse`,
      "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", trimmedPath
    ]);
    const trimmedDuration = await probeAudioDuration(trimmedPath);
    const cueDuration = cue.end_seconds - cue.start_seconds;
    const available = cueDuration - validated.plan.timing_policy.speech_lead_in_seconds - validated.plan.timing_policy.minimum_tail_seconds;
    const atempo = trimmedDuration > available ? trimmedDuration / available : 1;
    requireCondition(atempo <= validated.plan.timing_policy.maximum_atempo_ratio, "PACING_DEPENDENCY", `${cue.cue_id} requires atempo ${atempo.toFixed(4)} above allowed maximum`);
    const predictedDuration = trimmedDuration / atempo;
    const fadeOutStart = Math.max(0, predictedDuration - 0.06);
    await runProcess("ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-y", "-i", trimmedPath,
      "-af", `atempo=${atempo.toFixed(8)},afade=t=in:st=0:d=0.03,afade=t=out:st=${fadeOutStart.toFixed(6)}:d=0.06,alimiter=limit=0.90`,
      "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", processedPath
    ]);
    const processedDuration = await probeAudioDuration(processedPath);
    const speechStart = cue.start_seconds + validated.plan.timing_policy.speech_lead_in_seconds;
    const speechEnd = speechStart + processedDuration;
    const tail = cue.end_seconds - speechEnd;
    requireCondition(tail + 0.01 >= validated.plan.timing_policy.minimum_tail_seconds, "PACING_DEPENDENCY", `${cue.cue_id} exceeds subtitle window`);
    rows.push({
      cue_id: cue.cue_id,
      update_id: cue.update_id,
      subtitle_start_seconds: cue.start_seconds,
      subtitle_end_seconds: cue.end_seconds,
      subtitle_text_ja: cue.subtitle_text_ja,
      spoken_text_ja: cue.spoken_text_ja,
      pronunciation_normalizations: cue.pronunciation_normalizations,
      raw_duration_seconds: round(rawDuration),
      trimmed_duration_seconds: round(trimmedDuration),
      atempo_ratio: round(atempo),
      audio_start_seconds: round(speechStart),
      audio_end_seconds: round(speechEnd),
      subtitle_lead_in_seconds: round(speechStart - cue.start_seconds),
      subtitle_tail_seconds: round(tail),
      within_subtitle_window: speechStart >= cue.start_seconds && speechEnd <= cue.end_seconds + 0.01,
      processed_path: processedPath
    });
  }
  return { synthesisReceipt, rows };
}

async function muxAudio(validated, cueRows, revisedPath) {
  const args = ["-hide_banner", "-loglevel", "error", "-y", "-i", validated.originalPath];
  for (const row of cueRows) args.push("-i", row.processed_path);
  const delayed = cueRows.map((row, index) => {
    const delayMs = Math.round(row.audio_start_seconds * 1000);
    return `[${index + 1}:a]adelay=${delayMs}:all=1[a${index + 1}]`;
  });
  const labels = cueRows.map((_, index) => `[a${index + 1}]`).join("");
  const filter = `${delayed.join(";")};${labels}amix=inputs=${cueRows.length}:normalize=0:duration=longest,apad=whole_dur=180,atrim=0:180,aresample=48000,aformat=channel_layouts=stereo[aout]`;
  args.push(
    "-filter_complex", filter,
    "-map", "0:v:0", "-map", "[aout]",
    "-c:v", "copy", "-c:a", validated.plan.target.audio_codec,
    "-b:a", validated.plan.target.audio_bitrate,
    "-ar", String(validated.plan.target.audio_sample_rate_hz),
    "-ac", String(validated.plan.target.audio_channels),
    "-metadata:s:a:0", "language=jpn",
    "-metadata:s:a:0", "title=Synthetic Japanese narration - private review",
    "-t", "180", "-movflags", "+faststart", revisedPath
  );
  await runProcess("ffmpeg", args);
}

async function analyzeMedia(mediaPath, cueRows, plan) {
  const probe = await probeMedia(mediaPath);
  requireCondition(Math.abs(probe.duration_seconds - 180) <= 0.05, "MEDIA_INVALID", `duration mismatch: ${probe.duration_seconds}`);
  requireCondition(probe.video_codec === "h264" && probe.width === 1280 && probe.height === 720 && probe.avg_frame_rate === "30/1" && probe.frame_count === 5400, "MEDIA_INVALID", "video format mismatch");
  requireCondition(probe.audio_stream_count === 1, "MEDIA_INVALID", `expected one audio stream, got ${probe.audio_stream_count}`);
  requireCondition(probe.audio_codec === "aac", "MEDIA_INVALID", `audio codec mismatch: ${probe.audio_codec}`);
  requireCondition(probe.audio_sample_rate_hz === 48000 && probe.audio_channels === 2, "MEDIA_INVALID", "audio sample rate/channel mismatch");
  const decode = await runProcess("ffmpeg", ["-v", "error", "-i", mediaPath, "-map", "0:v:0", "-map", "0:a:0", "-f", "null", "-"]);
  const black = await runProcess("ffmpeg", [
    "-hide_banner", "-loglevel", "info", "-i", mediaPath,
    "-vf", "blackdetect=d=0.20:pic_th=0.98:pix_th=0.10", "-an", "-f", "null", "-"
  ]);
  const blackEvents = [...black.stderr.matchAll(/black_start:/g)].length;
  requireCondition(blackEvents === 0, "MEDIA_INVALID", `blackdetect found ${blackEvents} events`);
  const silence = await runProcess("ffmpeg", [
    "-hide_banner", "-nostats", "-i", mediaPath, "-map", "0:a:0", "-vn",
    "-af", `silencedetect=noise=${plan.timing_policy.final_silence_detection_threshold_db}dB:d=${plan.timing_policy.final_silence_minimum_duration_seconds}`,
    "-f", "null", "-"
  ]);
  const silenceStarts = [...silence.stderr.matchAll(/silence_start:\s*([0-9.]+)/g)].map((match) => Number(match[1]));
  const silenceEnds = [...silence.stderr.matchAll(/silence_end:\s*([0-9.]+)\s*\|\s*silence_duration:\s*([0-9.]+)/g)].map((match) => ({ end_seconds: Number(match[1]), duration_seconds: Number(match[2]) }));
  const totalVolumeResult = await runProcess("ffmpeg", ["-hide_banner", "-nostats", "-i", mediaPath, "-map", "0:a:0", "-vn", "-af", "volumedetect", "-f", "null", "-"]);
  const totalVolume = parseVolume(totalVolumeResult.stderr);
  requireCondition(totalVolume.max_volume_db !== null && totalVolume.max_volume_db > -12, "MEDIA_INVALID", "final audio is effectively silent");
  requireCondition(totalVolume.max_volume_db <= 0, "MEDIA_INVALID", "final audio clips above 0 dBFS");

  const cueActivity = [];
  for (const row of cueRows) {
    const activity = await runProcess("ffmpeg", [
      "-hide_banner", "-nostats", "-ss", String(row.audio_start_seconds), "-to", String(row.audio_end_seconds),
      "-i", mediaPath, "-map", "0:a:0", "-vn", "-af", "volumedetect", "-f", "null", "-"
    ]);
    const volume = parseVolume(activity.stderr);
    const audible = volume.max_volume_db !== null && volume.max_volume_db >= plan.timing_policy.cue_audibility_max_volume_threshold_db;
    requireCondition(audible, "MEDIA_INVALID", `${row.cue_id} is not audible in its subtitle window`);
    cueActivity.push({ cue_id: row.cue_id, ...volume, threshold_db: plan.timing_policy.cue_audibility_max_volume_threshold_db, audible });
  }
  return {
    schema_version: "fff.densou.episodeAudioRepairMediaHealth.v1",
    artifact_id: plan.artifact_id,
    probe,
    full_av_decode: { passed: decode.code === 0, error_line_count: decode.stderr.trim() ? decode.stderr.trim().split(/\r?\n/).length : 0 },
    blackdetect: { passed: true, event_count: blackEvents, minimum_duration_seconds: 0.2 },
    silence_check: {
      status: "PASS_EXPECTED_GAPS_OUTSIDE_SPEECH_WINDOWS",
      threshold_db: plan.timing_policy.final_silence_detection_threshold_db,
      minimum_duration_seconds: plan.timing_policy.final_silence_minimum_duration_seconds,
      event_count: silenceStarts.length,
      events: silenceStarts.map((start, index) => ({ start_seconds: start, ...(silenceEnds[index] ?? {}) })),
      policy: "Silence between scheduled narration cues is intentional. Every scheduled speech window must independently pass audibility."
    },
    final_volume: totalVolume,
    cue_activity: cueActivity,
    audible_cue_count: cueActivity.filter((cue) => cue.audible).length,
    passed: true
  };
}

function buildSyncReceipt(validated, cueRows, health) {
  const activity = new Map(health.cue_activity.map((row) => [row.cue_id, row]));
  return {
    schema_version: "fff.densou.audioSubtitleSync.v1",
    artifact_id: validated.plan.artifact_id,
    parent_artifact_id: validated.plan.parent_artifact_id,
    timing_policy: validated.plan.timing_policy,
    content_policy: {
      subtitle_units_preserved: true,
      spoken_content_source: "existing burned-caption units only",
      dialogue_authored: false,
      pronunciation_only_normalizations: validated.metrics.pronunciation_normalization_count,
      new_canon_claims: 0
    },
    cues: cueRows.map(({ processed_path: _processedPath, ...row }) => ({ ...row, activity: activity.get(row.cue_id) })),
    counts: {
      subtitle_cues: cueRows.length,
      audio_cues: cueRows.length,
      within_subtitle_window: cueRows.filter((row) => row.within_subtitle_window).length,
      audible_cues: health.audible_cue_count,
      dialogue_units: 0,
      pronunciation_normalizations: validated.metrics.pronunciation_normalization_count
    },
    passed: cueRows.every((row) => row.within_subtitle_window) && health.audible_cue_count === cueRows.length
  };
}

function buildSReviewPacket(validated, media, health, sync, preservation, mediaPath) {
  return {
    schema_version: "fff.densou.supervisorAudioRepairReviewPacket.v1",
    work_order_id: validated.plan.work_order_id,
    artifact_id: validated.plan.artifact_id,
    parent_artifact_id: validated.plan.parent_artifact_id,
    classification: "PARTIAL_PRODUCTION_SLICE",
    episode_completion: false,
    state: "AUDIO_REPAIRED_180S_CANDIDATE_READY_FOR_S_REVIEW",
    review_media_path: relativeToRepo(mediaPath),
    source_binding: {
      source_packet_id: validated.plan.source_packet_id,
      source_revision_id: validated.plan.source_revision_id,
      source_sha256: validated.plan.source_sha256,
      source_basis_id: validated.plan.source_basis_id,
      provenance_caveat: validated.plan.provenance_caveat
    },
    review_axes: {
      visual_grammar: {
        technical_evidence: `H.264 essence exact match ${preservation.video_essence.original_sha256}`,
        human_question: "Does the retained raster grammar remain legible when heard with narration?"
      },
      character_scene_readability: {
        technical_evidence: "15/15 existing visual updates and burned captions retained; no picture or source-map change",
        human_question: "Are Mira, Toma, Council, ledger, moth, and tower roles readable without adding unsupported causality?"
      },
      dialogue_pacing: {
        technical_evidence: `${sync.counts.audio_cues}/15 narration cues fit and are audible inside subtitle windows; dialogue units intentionally 0`,
        human_question: "Is the neutral narration pacing natural, and is the absence of invented dialogue appropriate?"
      },
      subtitles: {
        technical_evidence: `${sync.counts.within_subtitle_window}/15 cue-window matches; burned subtitle picture essence unchanged; pronunciation-only normalizations ${sync.counts.pronunciation_normalizations}`,
        human_question: "Do spoken phrases and burned Japanese captions feel synchronized and readable?"
      },
      audio: {
        technical_evidence: `${media.audio_codec} ${media.audio_sample_rate_hz} Hz ${media.audio_channels}ch; full A/V decode PASS; audible cues ${health.audible_cue_count}/15; max ${health.final_volume.max_volume_db} dBFS`,
        human_question: "Are pronunciation, synthetic voice character, level, and silence gaps acceptable for this private repair candidate?"
      },
      source_fidelity: {
        technical_evidence: "8/8 Episode segments, 12/12 source claims, unsupported/hidden bridges 0/0, new canon claims 0",
        human_question: "Does the audible delivery preserve allegation, theory, derived evidence, and unresolved boundaries?"
      },
      expandability: {
        technical_evidence: "180/720 seconds; remaining 540 seconds; Episode completion=false",
        human_question: "Does this repaired 180-second form justify later long-form planning without treating it as Episode completion?"
      }
    },
    limitations: [
      "Local Microsoft Haruka synthetic narration is a private technical review layer, not a final voice selection or publication-rights clearance.",
      "No dialogue was authored because the accepted 15-unit script contains evidence narration rather than character dialogue.",
      "Human pronunciation, pacing, comprehension, visual, rights, canon, production, and publication acceptance remain pending.",
      "The artifact remains 180/720 seconds; extension is prohibited until this exact repair passes S."
    ],
    exact_next_s_event: "S opens review.html and the exact revised MP4, reviews the seven axes, then returns ACCEPT_REPAIR or REPAIR_REQUIRED with cue IDs/timestamps. No 720-second extension occurs before ACCEPT_REPAIR.",
    final_acceptance_claimed: false
  };
}

function renderSReviewMarkdown(packet, mediaSha) {
  const rows = Object.entries(packet.review_axes).map(([axis, value]) => `| ${axis} | ${value.technical_evidence} | ${value.human_question} |`).join("\n");
  return `# S Review Packet — Densou 180-second audio repair\n\n- Artifact: \`${packet.artifact_id}\`\n- Parent: \`${packet.parent_artifact_id}\`\n- Classification: \`PARTIAL_PRODUCTION_SLICE\` / Episode completion=false\n- Revised MP4 SHA-256: \`${mediaSha}\`\n- Source: \`${packet.source_binding.source_packet_id}\` / \`${packet.source_binding.source_revision_id}\` / \`${packet.source_binding.source_sha256}\`\n\n| Axis | Technical evidence | S question |\n| --- | --- | --- |\n${rows}\n\n## Limitations\n\n${packet.limitations.map((value) => `- ${value}`).join("\n")}\n\n## Exact next event\n\n${packet.exact_next_s_event}\n`;
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function renderReviewHtml({ plan, mediaName, mediaSha, contactName, waveformName, sync, reviewPacket }) {
  const cueRows = sync.cues.map((cue) => `<tr><td>${escapeHtml(cue.cue_id)}</td><td>${cue.subtitle_start_seconds.toFixed(2)}–${cue.subtitle_end_seconds.toFixed(2)}</td><td>${cue.audio_start_seconds.toFixed(2)}–${cue.audio_end_seconds.toFixed(2)}</td><td>${escapeHtml(cue.subtitle_text_ja)}</td><td>${escapeHtml(cue.spoken_text_ja)}</td><td>${cue.activity.max_volume_db} dBFS</td></tr>`).join("");
  const axes = Object.entries(reviewPacket.review_axes).map(([axis, value]) => `<article><h3>${escapeHtml(axis)}</h3><p>${escapeHtml(value.technical_evidence)}</p><p class="question">${escapeHtml(value.human_question)}</p></article>`).join("");
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Densou Episode 1 audio repair review</title><style>:root{color-scheme:dark;background:#0b0e12;color:#f5f2ea;font-family:"Yu Gothic UI",system-ui,sans-serif}*{box-sizing:border-box}body{margin:0}.page{width:min(1180px,calc(100% - 32px));margin:auto;padding:38px 0 72px}h1,h2{font-family:"Yu Mincho",serif}h1{font-size:clamp(2rem,5vw,4rem);margin:.2em 0}.kicker{color:#e6c582;letter-spacing:.15em;font-size:.78rem}.notice{border-left:4px solid #e6c582;background:#151a21;padding:14px 18px;margin:22px 0}video,img{display:block;width:100%;border:1px solid #343b46;background:#000}video{aspect-ratio:16/9}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:22px 0}.grid div,article{background:#151a21;padding:12px}.grid b{display:block;color:#e6c582}.axes{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.question{color:#e6c582}.scroll{overflow:auto}table{border-collapse:collapse;width:100%;font-size:.78rem}th,td{text-align:left;vertical-align:top;padding:8px;border-top:1px solid #343b46}code{overflow-wrap:anywhere;color:#e6c582}@media(max-width:720px){.grid,.axes{grid-template-columns:1fr}}</style></head><body><main class="page"><p class="kicker">PRIVATE PREVISUALIZATION · AUDIO REPAIR · S REVIEW</p><h1>鐘のない塔 — 180秒 A/V revision</h1><p class="notice">既存180秒pictureとburned subtitleを保持し、既存15字幕文だけを日本語synthetic narration化した修復候補です。\`PARTIAL_PRODUCTION_SLICE\` 180/720であり、Episode 1完成・final voice・rights・canon・production・publicationではありません。</p><video controls preload="metadata" poster="${escapeHtml(contactName)}"><source src="${escapeHtml(mediaName)}" type="video/mp4"></video><div class="grid"><div><b>Artifact</b>${escapeHtml(plan.artifact_id)}</div><div><b>Scope</b>180 / 720 sec</div><div><b>Audio sync</b>${sync.counts.audible_cues}/15 audible cues</div><div><b>SHA-256</b><code>${mediaSha}</code></div></div><h2>Audio waveform</h2><img src="${escapeHtml(waveformName)}" alt="Narration waveform evidence"><h2>Representative frames</h2><img src="${escapeHtml(contactName)}" alt="15 visual update contact sheet"><h2>S review axes</h2><section class="axes">${axes}</section><h2>Subtitle / audio timing</h2><div class="scroll"><table><thead><tr><th>Cue</th><th>Subtitle</th><th>Audio</th><th>Burned text</th><th>Spoken text</th><th>Peak</th></tr></thead><tbody>${cueRows}</tbody></table></div><h2>Source and boundary</h2><p><code>${escapeHtml(plan.source_packet_id)}</code> · <code>${escapeHtml(plan.source_revision_id)}</code> · <code>${escapeHtml(plan.source_sha256)}</code></p><p>${escapeHtml(plan.provenance_caveat)}</p><p>${escapeHtml(reviewPacket.exact_next_s_event)}</p></main></body></html>`;
}

async function commandBuild(options) {
  const planPath = path.resolve(options.plan ?? defaultPlanPath);
  const outputRoot = path.resolve(options.out ?? defaultOutputPath);
  const resultPath = path.resolve(options.result ?? defaultResultPath);
  const validated = await validatePlan(planPath);
  await ensureEmptyOutput(outputRoot);
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "fff-densou-audio-repair-"));
  requireCondition(tempRoot.startsWith(path.resolve(os.tmpdir()) + path.sep), "UNSAFE_PATH", "temporary root escaped OS temp");
  const mediaName = "densou-s01e01-benchmark-video-slice-audio-repair.mp4";
  const audioName = "densou-s01e01-benchmark-video-slice-audio-repair-narration.m4a";
  const srtName = "densou-s01e01-benchmark-video-slice-audio-repair.ja.srt";
  const assName = "densou-s01e01-benchmark-video-slice-audio-repair.ass";
  const contactName = "densou-s01e01-benchmark-video-slice-audio-repair-contact-sheet.jpg";
  const waveformName = "densou-s01e01-benchmark-video-slice-audio-repair-waveform.png";
  const mediaPath = path.join(outputRoot, mediaName);
  const originalBefore = {
    bytes: validated.originalStat.size,
    sha256: await hashFile(validated.originalPath),
    mtime_utc: validated.originalStat.mtime.toISOString()
  };
  try {
    console.log(`INPUT PASS ${validated.metrics.segment_count}/8 segments ${validated.metrics.source_claim_count}/12 claims original=${originalBefore.sha256}`);
    const cueAudio = await createCueAudio(validated, tempRoot);
    console.log(`SAPI PASS ${cueAudio.rows.length}/15 cues voice=${cueAudio.synthesisReceipt.voice_name}`);
    await muxAudio(validated, cueAudio.rows, mediaPath);
    const mediaStat = await stat(mediaPath);
    const mediaSha = await hashFile(mediaPath);
    const health = await analyzeMedia(mediaPath, cueAudio.rows, validated.plan);
    console.log(`A/V HEALTH PASS audio=${health.probe.audio_codec}/${health.probe.audio_sample_rate_hz}/${health.probe.audio_channels} cues=${health.audible_cue_count}/15`);
    const sync = buildSyncReceipt(validated, cueAudio.rows, health);
    const preservation = await buildOriginalPreservationReceipt(validated, mediaPath, tempRoot, originalBefore);
    console.log(`ORIGINAL PRESERVED video_essence=${preservation.video_essence.exact_match}`);

    const parentSrt = path.join(validated.parentRoot, "densou-s01e01-benchmark-video-slice.ja.srt");
    const parentAss = path.join(validated.parentRoot, "densou-s01e01-benchmark-video-slice.ass");
    const parentContact = path.join(validated.parentRoot, "densou-s01e01-benchmark-video-slice-contact-sheet.jpg");
    await copyFile(parentSrt, path.join(outputRoot, srtName));
    await copyFile(parentAss, path.join(outputRoot, assName));
    await copyFile(parentContact, path.join(outputRoot, contactName));
    await runProcess("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", mediaPath, "-map", "0:a:0", "-c", "copy", path.join(outputRoot, audioName)]);
    await runProcess("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", mediaPath, "-filter_complex", "aformat=channel_layouts=mono,showwavespic=s=1280x240:colors=0xe6c582", "-frames:v", "1", path.join(outputRoot, waveformName)]);

    await writeJson(path.join(outputRoot, "audio-subtitle-sync.json"), sync);
    await writeJson(path.join(outputRoot, "media-health.json"), health);
    await writeJson(path.join(outputRoot, "original-preservation-receipt.json"), preservation);
    const segmentMap = {
      ...validated.parent.segmentMap,
      schema_version: "fff.densou.episodeAudioRepairSegmentSourceMap.v1",
      artifact_id: validated.plan.artifact_id,
      parent_artifact_id: validated.plan.parent_artifact_id,
      mapping_policy: `${validated.parent.segmentMap.mapping_policy} Audio repair preserves every mapping and adds no claims.`
    };
    await writeJson(path.join(outputRoot, "segment-source-map.json"), segmentMap);
    await writeJson(path.join(outputRoot, "source-packet-receipt.json"), {
      ...validated.parent.receipt,
      schema_version: "fff.densou.episodeAudioRepairSourcePacketReceipt.v1",
      artifact_id: validated.plan.artifact_id,
      parent_artifact_id: validated.plan.parent_artifact_id,
      provenance_caveat: validated.plan.provenance_caveat,
      source_gate_state: "ACCEPT_UNLOCK",
      wait_user: false
    });
    const parentBenchmark = await readJson(path.join(validated.parentRoot, "benchmark-conformance.json"));
    const benchmark = {
      ...parentBenchmark,
      schema_version: "fff.densou.episodeAudioRepairBenchmarkConformance.v1",
      artifact_id: validated.plan.artifact_id,
      parent_artifact_id: validated.plan.parent_artifact_id,
      status: "TECHNICAL_AV_REPAIR_PASS_SUPERVISOR_REVIEW_PENDING",
      provisional_scoring: {
        ...parentBenchmark.provisional_scoring,
        narrative_comprehension: { available: 30, earned: null, state: "UNSCORED_PENDING_S_HUMAN_REVIEW" },
        voice_technical_layer: { available: 4, earned: 4, state: "LOCAL_SYNTHETIC_AUDIO_TIMING_PASS_RIGHTS_AND_HUMAN_REVIEW_PENDING" }
      },
      audio_repair: {
        stream_count: health.probe.audio_stream_count,
        codec: health.probe.audio_codec,
        sample_rate_hz: health.probe.audio_sample_rate_hz,
        channels: health.probe.audio_channels,
        subtitle_audio_cues_passed: sync.counts.audible_cues,
        subtitle_audio_cues_total: sync.counts.audio_cues,
        dialogue_authored: false,
        final_voice_selected: false,
        rights_cleared: false
      },
      final_acceptance_claimed: false
    };
    await writeJson(path.join(outputRoot, "benchmark-conformance.json"), benchmark);
    const reviewPacket = buildSReviewPacket(validated, health.probe, health, sync, preservation, mediaPath);
    await writeJson(path.join(outputRoot, "s-review-packet.json"), reviewPacket);
    const sReviewMarkdown = renderSReviewMarkdown(reviewPacket, mediaSha);
    await writeFile(path.join(outputRoot, "s-review-packet.md"), sReviewMarkdown, "utf8");
    const runManifest = {
      schema_version: "fff.densou.episodeAudioRepairRunManifest.v1",
      work_order_id: validated.plan.work_order_id,
      artifact_id: validated.plan.artifact_id,
      parent_artifact_id: validated.plan.parent_artifact_id,
      episode_id: validated.plan.episode_id,
      classification: "PARTIAL_PRODUCTION_SLICE",
      episode_completion: false,
      state: "AUDIO_REPAIRED_180S_CANDIDATE_READY_FOR_S_REVIEW",
      generated_at: new Date().toISOString(),
      source_binding: segmentMap.source_binding,
      original_media: preservation.original_media,
      revised_media: {
        path: mediaName,
        bytes: mediaStat.size,
        sha256: mediaSha,
        ...health.probe,
        burned_caption_count: 15,
        audio_cue_count: 15,
        video_essence_sha256: preservation.video_essence.revised_sha256
      },
      audio: {
        engine_id: validated.plan.voice.engine_id,
        voice_name: cueAudio.synthesisReceipt.voice_name,
        culture: cueAudio.synthesisReceipt.culture,
        gender: cueAudio.synthesisReceipt.gender,
        rate: cueAudio.synthesisReceipt.rate,
        process_environment_fix: cueAudio.synthesisReceipt.environment_fix_applied ? "windir set from existing SystemRoot for process-local registry expansion" : "not_required",
        external_call: false,
        credentials_touched: false,
        new_software_install: false,
        dialogue_authored: false,
        pronunciation_normalizations: validated.metrics.pronunciation_normalization_count,
        final_voice_selected: false,
        rights_clearance: false
      },
      coverage: {
        mapped_episode_segments: 8,
        mapped_source_claims: 12,
        unsupported_claims: 0,
        hidden_causal_bridges: 0,
        playable_seconds: 180,
        full_episode_target_seconds: 720,
        remaining_seconds: 540,
        playable_duration_coverage_percent: 25
      },
      boundaries: {
        private_previsualization: true,
        partial_production_slice: true,
        episode_completion: false,
        not_for_publication: true,
        human_creative_acceptance: false,
        final_voice_selection: false,
        rights_clearance: false,
        final_canon: false,
        production_approval: false,
        upload: false,
        sharing: false,
        monetization: false,
        extension_to_720_authorized: false
      }
    };
    await writeJson(path.join(outputRoot, "run-manifest.json"), runManifest);
    await writeFile(path.join(outputRoot, "README.md"), `# Densou S01E01 180-second audio repair\n\n- Artifact: \`${validated.plan.artifact_id}\`\n- Parent: \`${validated.plan.parent_artifact_id}\`\n- Classification: \`PARTIAL_PRODUCTION_SLICE\`; Episode completion=false\n- Media: \`${mediaName}\`\n- Media SHA-256: \`${mediaSha}\`\n- Audio: local Microsoft Haruka synthetic Japanese narration, AAC 48 kHz stereo, 15/15 existing subtitle cues\n- Source: \`${validated.plan.source_packet_id}\` / \`${validated.plan.source_revision_id}\` / \`${validated.plan.source_sha256}\`\n- Original preserved: \`${originalBefore.sha256}\`; exact H.264 essence retained\n\nThis is a private technical repair candidate. The voice is not a final selection and its publication rights are not cleared. The artifact remains 180/720 seconds and cannot expand until S accepts this exact revision. Human creative acceptance, canon, rights, production, publication, upload, sharing, monetization, and release remain unapproved. ${validated.plan.provenance_caveat}\n`, "utf8");
    await writeFile(path.join(outputRoot, "review.html"), renderReviewHtml({
      plan: validated.plan,
      mediaName,
      mediaSha,
      contactName,
      waveformName,
      sync,
      reviewPacket
    }), "utf8");

    const payloadNames = [
      mediaName, audioName, srtName, assName, contactName, waveformName,
      "audio-subtitle-sync.json", "media-health.json", "original-preservation-receipt.json",
      "segment-source-map.json", "source-packet-receipt.json", "benchmark-conformance.json",
      "s-review-packet.json", "s-review-packet.md", "run-manifest.json", "README.md", "review.html"
    ];
    const files = [];
    for (const name of payloadNames) files.push(await inventoryFile(outputRoot, path.join(outputRoot, name)));
    const evidenceManifest = {
      schema_version: "fff.densou.episodeAudioRepairEvidenceManifest.v1",
      artifact_id: validated.plan.artifact_id,
      parent_artifact_id: validated.plan.parent_artifact_id,
      episode_id: validated.plan.episode_id,
      classification: "PARTIAL_PRODUCTION_SLICE",
      episode_completion: false,
      source_packet_id: validated.plan.source_packet_id,
      source_revision_id: validated.plan.source_revision_id,
      source_sha256: validated.plan.source_sha256,
      state_code: "CONTINUE_TO_S_REVIEW_ONLY",
      files
    };
    const evidencePath = path.join(outputRoot, "evidence-manifest.json");
    await writeJson(evidencePath, evidenceManifest);
    const evidenceSha = await hashFile(evidencePath);
    await writeFile(path.join(outputRoot, "evidence-manifest.sha256"), `${evidenceSha}  evidence-manifest.json\n`, "utf8");
    const sPacketPath = path.join(outputRoot, "s-review-packet.json");
    const sPacketSha = await hashFile(sPacketPath);
    const verification = await verifyPackage(outputRoot, { skipDecode: false });
    const result = {
      schema_version: "fff.densou.episodeAudioRepairResult.v1",
      work_order_id: validated.plan.work_order_id,
      artifact_id: validated.plan.artifact_id,
      parent_artifact_id: validated.plan.parent_artifact_id,
      episode_id: validated.plan.episode_id,
      classification: "PARTIAL_PRODUCTION_SLICE",
      episode_completion: false,
      state: "AUDIO_REPAIRED_180S_CANDIDATE_READY_FOR_S_REVIEW",
      package_path: relativeToRepo(outputRoot),
      media_path: relativeToRepo(mediaPath),
      media_bytes: mediaStat.size,
      media_sha256: mediaSha,
      original_media_path: validated.plan.original_media.path,
      original_media_bytes: originalBefore.bytes,
      original_media_sha256: originalBefore.sha256,
      original_media_unchanged: preservation.original_media.unchanged,
      video_essence_exact_match: preservation.video_essence.exact_match,
      s_review_packet_path: relativeToRepo(sPacketPath),
      s_review_packet_sha256: sPacketSha,
      evidence_manifest_sha256: evidenceSha,
      source_packet_id: validated.plan.source_packet_id,
      source_revision_id: validated.plan.source_revision_id,
      source_sha256: validated.plan.source_sha256,
      source_basis_id: validated.plan.source_basis_id,
      verification,
      quantitative_gap: { current_playable_seconds: 180, target_seconds: 720, remaining_seconds: 540, playable_duration_coverage_percent: 25 },
      boundaries: runManifest.boundaries
    };
    await writeJson(resultPath, result);
    console.log(JSON.stringify(result, null, 2));
  } finally {
    const resolvedTemp = path.resolve(tempRoot);
    if (resolvedTemp.startsWith(path.resolve(os.tmpdir()) + path.sep)) await rm(resolvedTemp, { recursive: true, force: true });
  }
}

async function verifyPackage(root, { skipDecode = false } = {}) {
  const outputRoot = path.resolve(root);
  const runManifest = await readJson(path.join(outputRoot, "run-manifest.json"));
  const sync = await readJson(path.join(outputRoot, "audio-subtitle-sync.json"));
  const healthRecorded = await readJson(path.join(outputRoot, "media-health.json"));
  const preservation = await readJson(path.join(outputRoot, "original-preservation-receipt.json"));
  const segmentMap = await readJson(path.join(outputRoot, "segment-source-map.json"));
  const sPacket = await readJson(path.join(outputRoot, "s-review-packet.json"));
  requireCondition(runManifest.artifact_id === expectedArtifactId && runManifest.parent_artifact_id === expectedParentArtifactId, "PACKAGE_INVALID", "run manifest identity mismatch");
  requireCondition(runManifest.classification === "PARTIAL_PRODUCTION_SLICE" && runManifest.episode_completion === false, "PACKAGE_INVALID", "completion classification mismatch");
  requireCondition(runManifest.coverage.playable_seconds === 180 && runManifest.coverage.full_episode_target_seconds === 720 && runManifest.coverage.remaining_seconds === 540, "PACKAGE_INVALID", "duration scope mismatch");
  requireCondition(runManifest.source_binding.source_sha256 === expectedSourceSha, "PACKAGE_INVALID", "source binding mismatch");
  requireCondition(sync.passed === true && sync.counts.audio_cues === 15 && sync.counts.audible_cues === 15 && sync.counts.within_subtitle_window === 15, "PACKAGE_INVALID", "audio/subtitle sync mismatch");
  requireCondition(sync.content_policy.new_canon_claims === 0 && sync.content_policy.dialogue_authored === false, "PACKAGE_INVALID", "audio content boundary mismatch");
  requireCondition(segmentMap.counts.mapped_segments === 8 && segmentMap.counts.distinct_source_claims === 12, "PACKAGE_INVALID", "source coverage mismatch");
  requireCondition(segmentMap.counts.unsupported_claims === 0 && segmentMap.counts.hidden_causal_bridges === 0, "PACKAGE_INVALID", "source fact boundary mismatch");
  requireCondition(preservation.original_media.unchanged === true && preservation.video_essence.exact_match === true, "PACKAGE_INVALID", "original preservation mismatch");
  requireCondition(sPacket.state === "AUDIO_REPAIRED_180S_CANDIDATE_READY_FOR_S_REVIEW" && sPacket.final_acceptance_claimed === false, "PACKAGE_INVALID", "S review packet state mismatch");
  const mediaPath = path.join(outputRoot, runManifest.revised_media.path);
  requireCondition(await hashFile(mediaPath) === runManifest.revised_media.sha256, "PACKAGE_INVALID", "revised media SHA mismatch");
  const originalPath = path.join(repoRoot, runManifest.original_media.path);
  requireCondition(await hashFile(originalPath) === runManifest.original_media.sha256_after, "ORIGINAL_IDENTITY_MISMATCH", "live original MP4 drift");
  requireCondition(await hashFile(path.join(repoRoot, runManifest.source_binding.source_path)) === expectedSourceSha, "SOURCE_IDENTITY_MISMATCH", "live source SHA drift");
  const cueRows = sync.cues.map((cue) => ({ ...cue, processed_path: null }));
  let health = healthRecorded;
  if (!skipDecode) health = await analyzeMedia(mediaPath, cueRows, {
    ...await readJson(defaultPlanPath),
    artifact_id: expectedArtifactId
  });
  requireCondition(health.passed === true && health.probe.audio_stream_count === 1 && health.audible_cue_count === 15, "PACKAGE_INVALID", "live media health mismatch");
  const evidence = await verifyEvidenceManifest(outputRoot);
  const parent = await validateParentEvidence(path.join(repoRoot, "artifacts", "densou-s01e01-benchmark-video-slice-001"));
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "fff-densou-audio-verify-"));
  let essenceMatch = false;
  try {
    const originalEssence = await videoEssenceHash(originalPath, path.join(tempRoot, "original.h264"));
    const revisedEssence = await videoEssenceHash(mediaPath, path.join(tempRoot, "revised.h264"));
    essenceMatch = originalEssence === revisedEssence;
  } finally {
    const resolvedTemp = path.resolve(tempRoot);
    if (resolvedTemp.startsWith(path.resolve(os.tmpdir()) + path.sep)) await rm(resolvedTemp, { recursive: true, force: true });
  }
  requireCondition(essenceMatch, "VIDEO_ESSENCE_CHANGED", "live video essence mismatch");
  return {
    result: "PASS",
    checks_total: 52,
    evidence_manifest_files: evidence.file_count,
    evidence_manifest_mismatches: evidence.mismatch_count,
    parent_evidence_manifest_files: parent.evidence.file_count,
    parent_evidence_manifest_mismatches: parent.evidence.mismatch_count,
    original_media_unchanged: true,
    video_essence_exact_match: true,
    duration_seconds: health.probe.duration_seconds,
    audio_stream_count: health.probe.audio_stream_count,
    audio_codec: health.probe.audio_codec,
    audio_sample_rate_hz: health.probe.audio_sample_rate_hz,
    audio_channels: health.probe.audio_channels,
    full_av_decode: health.full_av_decode.passed,
    blackdetect_events: health.blackdetect.event_count,
    silence_events: health.silence_check.event_count,
    audible_cues: health.audible_cue_count,
    subtitle_audio_cues: sync.counts.audio_cues,
    within_subtitle_window: sync.counts.within_subtitle_window,
    segment_count: segmentMap.counts.mapped_segments,
    source_claim_count: segmentMap.counts.distinct_source_claims,
    unsupported_claims: segmentMap.counts.unsupported_claims,
    hidden_causal_bridges: segmentMap.counts.hidden_causal_bridges,
    episode_completion: false
  };
}

async function commandValidatePlan(options) {
  const validated = await validatePlan(path.resolve(options.plan ?? defaultPlanPath));
  console.log(JSON.stringify({
    result: "PASS",
    checks_total: 30,
    artifact_id: validated.plan.artifact_id,
    parent_artifact_id: validated.plan.parent_artifact_id,
    classification: validated.plan.classification,
    episode_completion: validated.plan.episode_completion,
    source_packet_id: validated.plan.source_packet_id,
    source_revision_id: validated.plan.source_revision_id,
    source_sha256: validated.plan.source_sha256,
    original_media_sha256: validated.plan.original_media.sha256,
    ...validated.metrics
  }, null, 2));
}

async function commandVerify(options) {
  const verification = await verifyPackage(path.resolve(options.root ?? defaultOutputPath), { skipDecode: false });
  console.log(JSON.stringify(verification, null, 2));
}

function printHelp() {
  console.log(`Usage:
  node tools/fff-densou-episode-audio-repair.mjs validate-plan [--plan <plan.json>]
  node tools/fff-densou-episode-audio-repair.mjs build [--plan <plan.json>] [--out <new-empty-directory>] [--result <result.json>]
  node tools/fff-densou-episode-audio-repair.mjs verify [--root <package-directory>]`);
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));
  if (command === "validate-plan") return await commandValidatePlan(options);
  if (command === "build") return await commandBuild(options);
  if (command === "verify") return await commandVerify(options);
  if (command === "help" || command === "--help" || command === "-h") return printHelp();
  throw new AudioRepairError("INVALID_COMMAND", `unknown command: ${command}`);
}

main().catch((error) => {
  console.error(JSON.stringify({ result: "FAIL", code: error.code ?? "UNEXPECTED_ERROR", message: error.message }, null, 2));
  process.exitCode = error.exitCode ?? 1;
});
