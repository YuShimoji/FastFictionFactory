#!/usr/bin/env node

import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DECODE_RATE = 48_000;
const FFT_SIZE = 2_048;
const FFT_HOP = 1_024;
const ACTIVE_RMS_DBFS = -45;

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) throw new Error(`Unexpected argument: ${token}`);
    const key = token.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for --${key}`);
    args[key] = value;
    index += 1;
  }
  if (!args.input) throw new Error("--input is required");
  return {
    input: path.resolve(args.input),
    output: args.output ? path.resolve(args.output) : null,
    startSeconds: args.start === undefined ? null : Number(args.start),
    durationSeconds: args.duration === undefined ? null : Number(args.duration),
    label: args.label ?? path.basename(args.input)
  };
}

function requireFiniteNonNegative(value, name) {
  if (value !== null && (!Number.isFinite(value) || value < 0)) {
    throw new Error(`${name} must be a finite non-negative number`);
  }
}

async function run(command, args, { binary = false } = {}) {
  return await new Promise((resolve, reject) => {
    const child = spawn(command, args, { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
    const stdout = [];
    const stderr = [];
    child.stdout.on("data", (chunk) => stdout.push(chunk));
    child.stderr.on("data", (chunk) => stderr.push(chunk));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`${command} failed (${code}): ${Buffer.concat(stderr).toString("utf8")}`));
        return;
      }
      const output = Buffer.concat(stdout);
      resolve(binary ? output : output.toString("utf8"));
    });
  });
}

async function sha256(filePath) {
  const bytes = await readFile(filePath);
  return createHash("sha256").update(bytes).digest("hex");
}

function dbfs(value) {
  return value > 0 ? 20 * Math.log10(value) : null;
}

function round(value, digits = 9) {
  return value === null || !Number.isFinite(value) ? value : Number(value.toFixed(digits));
}

function percentileFromHistogram(histogram, sampleCount, bucketWidth, percentile) {
  if (sampleCount === 0) return 0;
  const target = Math.ceil(sampleCount * percentile);
  let seen = 0;
  for (let index = 0; index < histogram.length; index += 1) {
    seen += histogram[index];
    if (seen >= target) return (index + 1) * bucketWidth;
  }
  return histogram.length * bucketWidth;
}

function fft(real, imaginary) {
  const length = real.length;
  for (let index = 1, reverse = 0; index < length; index += 1) {
    let bit = length >> 1;
    for (; reverse & bit; bit >>= 1) reverse ^= bit;
    reverse ^= bit;
    if (index < reverse) {
      [real[index], real[reverse]] = [real[reverse], real[index]];
      [imaginary[index], imaginary[reverse]] = [imaginary[reverse], imaginary[index]];
    }
  }
  for (let size = 2; size <= length; size <<= 1) {
    const angle = -2 * Math.PI / size;
    const stepReal = Math.cos(angle);
    const stepImaginary = Math.sin(angle);
    for (let start = 0; start < length; start += size) {
      let twiddleReal = 1;
      let twiddleImaginary = 0;
      for (let offset = 0; offset < size / 2; offset += 1) {
        const even = start + offset;
        const odd = even + size / 2;
        const oddReal = real[odd] * twiddleReal - imaginary[odd] * twiddleImaginary;
        const oddImaginary = real[odd] * twiddleImaginary + imaginary[odd] * twiddleReal;
        real[odd] = real[even] - oddReal;
        imaginary[odd] = imaginary[even] - oddImaginary;
        real[even] += oddReal;
        imaginary[even] += oddImaginary;
        const nextReal = twiddleReal * stepReal - twiddleImaginary * stepImaginary;
        twiddleImaginary = twiddleReal * stepImaginary + twiddleImaginary * stepReal;
        twiddleReal = nextReal;
      }
    }
  }
}

function spectralMetrics(samples) {
  const activeThreshold = 10 ** (ACTIVE_RMS_DBFS / 20);
  let activeFrames = 0;
  let inactiveFrames = 0;
  let inactiveSquaredSum = 0;
  let lowEnergy = 0;
  let speechEnergy = 0;
  let highEnergy = 0;
  let totalEnergy = 0;
  let flatnessSum = 0;
  const real = new Float64Array(FFT_SIZE);
  const imaginary = new Float64Array(FFT_SIZE);
  for (let start = 0; start + FFT_SIZE <= samples.length; start += FFT_HOP) {
    let frameSquared = 0;
    for (let index = 0; index < FFT_SIZE; index += 1) {
      const sample = samples[start + index];
      frameSquared += sample * sample;
    }
    const frameRms = Math.sqrt(frameSquared / FFT_SIZE);
    if (frameRms < activeThreshold) {
      inactiveFrames += 1;
      inactiveSquaredSum += frameRms * frameRms;
      continue;
    }
    activeFrames += 1;
    real.fill(0);
    imaginary.fill(0);
    for (let index = 0; index < FFT_SIZE; index += 1) {
      const hann = 0.5 - 0.5 * Math.cos((2 * Math.PI * index) / (FFT_SIZE - 1));
      real[index] = samples[start + index] * hann;
    }
    fft(real, imaginary);
    let frameEnergy = 0;
    let frameLogSum = 0;
    let frameBinCount = 0;
    for (let bin = 1; bin <= FFT_SIZE / 2; bin += 1) {
      const frequency = bin * DECODE_RATE / FFT_SIZE;
      const energy = real[bin] * real[bin] + imaginary[bin] * imaginary[bin];
      if (frequency < 20 || frequency > 20_000) continue;
      frameEnergy += energy;
      frameLogSum += Math.log(Math.max(energy, Number.EPSILON));
      frameBinCount += 1;
      if (frequency < 300) lowEnergy += energy;
      else if (frequency < 8_000) speechEnergy += energy;
      else highEnergy += energy;
    }
    totalEnergy += frameEnergy;
    if (frameEnergy > 0 && frameBinCount > 0) {
      const geometricMean = Math.exp(frameLogSum / frameBinCount);
      const arithmeticMean = frameEnergy / frameBinCount;
      flatnessSum += geometricMean / arithmeticMean;
    }
  }
  return {
    fft_size: FFT_SIZE,
    hop_size: FFT_HOP,
    active_rms_threshold_dbfs: ACTIVE_RMS_DBFS,
    active_frame_count: activeFrames,
    inactive_frame_count: inactiveFrames,
    inactive_frame_rms_dbfs: round(dbfs(Math.sqrt(inactiveSquaredSum / Math.max(1, inactiveFrames))), 6),
    low_band_20_300_ratio: round(totalEnergy > 0 ? lowEnergy / totalEnergy : 0),
    speech_band_300_8000_ratio: round(totalEnergy > 0 ? speechEnergy / totalEnergy : 0),
    high_band_8000_20000_ratio: round(totalEnergy > 0 ? highEnergy / totalEnergy : 0),
    mean_active_spectral_flatness: round(activeFrames > 0 ? flatnessSum / activeFrames : 0)
  };
}

export async function analyzeAudio({ input, startSeconds = null, durationSeconds = null, label = path.basename(input) }) {
  requireFiniteNonNegative(startSeconds, "start");
  requireFiniteNonNegative(durationSeconds, "duration");
  const probe = JSON.parse(await run("ffprobe", [
    "-v", "error", "-show_entries", "format=duration,format_name:stream=codec_name,sample_rate,channels,channel_layout",
    "-of", "json", input
  ]));
  const ffmpegArgs = ["-hide_banner", "-loglevel", "error"];
  if (startSeconds !== null) ffmpegArgs.push("-ss", String(startSeconds));
  ffmpegArgs.push("-i", input);
  if (durationSeconds !== null) ffmpegArgs.push("-t", String(durationSeconds));
  ffmpegArgs.push("-map", "0:a:0", "-vn", "-ac", "1", "-ar", String(DECODE_RATE), "-f", "f32le", "-");
  const pcm = await run("ffmpeg", ffmpegArgs, { binary: true });
  const samples = new Float32Array(pcm.buffer, pcm.byteOffset, Math.floor(pcm.byteLength / 4));
  const histogram = new Uint32Array(2_000);
  const bucketWidth = 0.001;
  let sum = 0;
  let squaredSum = 0;
  let peak = 0;
  let clipped = 0;
  let maxAdjacentDelta = 0;
  let deltaSquaredSum = 0;
  let deltaOver025 = 0;
  let deltaOver05 = 0;
  let deltaOver075 = 0;
  let zeroCrossings = 0;
  for (let index = 0; index < samples.length; index += 1) {
    const sample = samples[index];
    const absolute = Math.abs(sample);
    sum += sample;
    squaredSum += sample * sample;
    peak = Math.max(peak, absolute);
    if (absolute >= 1) clipped += 1;
    if (index === 0) continue;
    const previous = samples[index - 1];
    if ((sample >= 0 && previous < 0) || (sample < 0 && previous >= 0)) zeroCrossings += 1;
    const delta = Math.abs(sample - previous);
    maxAdjacentDelta = Math.max(maxAdjacentDelta, delta);
    deltaSquaredSum += delta * delta;
    if (delta > 0.25) deltaOver025 += 1;
    if (delta > 0.5) deltaOver05 += 1;
    if (delta > 0.75) deltaOver075 += 1;
    histogram[Math.min(histogram.length - 1, Math.floor(delta / bucketWidth))] += 1;
  }
  const adjacentCount = Math.max(0, samples.length - 1);
  const rms = Math.sqrt(squaredSum / Math.max(1, samples.length));
  const dcOffset = sum / Math.max(1, samples.length);
  const p999 = percentileFromHistogram(histogram, adjacentCount, bucketWidth, 0.999);
  const p9999 = percentileFromHistogram(histogram, adjacentCount, bucketWidth, 0.9999);
  const spectral = spectralMetrics(samples);
  const gates = {
    clipping_free: clipped === 0 && peak < 1,
    dc_offset_within_0_005: Math.abs(dcOffset) <= 0.005,
    no_extreme_adjacent_discontinuity: deltaOver075 === 0,
    high_band_ratio_within_0_10: spectral.high_band_8000_20000_ratio <= 0.1
  };
  return {
    schema_version: "fff.audioSignalAudit.v1",
    label,
    input: {
      path: input,
      bytes: (await stat(input)).size,
      sha256: await sha256(input),
      format_name: probe.format?.format_name ?? null,
      duration_seconds: Number(probe.format?.duration ?? 0),
      source_stream: probe.streams?.[0] ?? null
    },
    analyzed_region: {
      start_seconds: startSeconds ?? 0,
      requested_duration_seconds: durationSeconds,
      decoded_duration_seconds: round(samples.length / DECODE_RATE, 6),
      decoded_sample_rate_hz: DECODE_RATE,
      decoded_channels: 1,
      sample_count: samples.length
    },
    amplitude: {
      peak_absolute: round(peak),
      peak_dbfs: round(dbfs(peak), 6),
      rms: round(rms),
      rms_dbfs: round(dbfs(rms), 6),
      dc_offset: round(dcOffset),
      clipped_sample_count: clipped
    },
    continuity: {
      maximum_adjacent_delta: round(maxAdjacentDelta),
      adjacent_delta_rms: round(Math.sqrt(deltaSquaredSum / Math.max(1, adjacentCount))),
      adjacent_delta_p99_9: round(p999, 6),
      adjacent_delta_p99_99: round(p9999, 6),
      adjacent_delta_over_0_25_count: deltaOver025,
      adjacent_delta_over_0_50_count: deltaOver05,
      adjacent_delta_over_0_75_count: deltaOver075,
      zero_crossing_rate: round(zeroCrossings / Math.max(1, adjacentCount))
    },
    spectral,
    objective_noise_gates: gates,
    objective_noise_gate_pass: Object.values(gates).every(Boolean),
    perceptual_acceptance_claimed: false
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = await analyzeAudio(args);
  const json = `${JSON.stringify(result, null, 2)}\n`;
  if (args.output) await writeFile(args.output, json, { encoding: "utf8", flag: "wx" });
  process.stdout.write(json);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`${error.stack ?? error.message}\n`);
    process.exitCode = 1;
  });
}
