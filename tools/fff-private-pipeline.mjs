#!/usr/bin/env node

import { createHash, randomUUID } from "node:crypto";
import { execFile as execFileCallback } from "node:child_process";
import {
  access,
  copyFile,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile
} from "node:fs/promises";
import { constants as fsConstants, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFile = promisify(execFileCallback);

export const PIPELINE_ARTIFACT_ID = "fff-resumable-private-pipeline-001";
export const PIPELINE_SCHEMA_VERSION = "fff.resumablePrivatePipeline.v1";
export const RUN_MANIFEST_SCHEMA_VERSION = "fff.privatePipelineRunManifest.v1";
export const STAGE_RECEIPT_SCHEMA_VERSION = "fff.privatePipelineStageReceipt.v1";
export const RUN_RECEIPT_SCHEMA_VERSION = "fff.privatePipelineRunReceipt.v1";
export const DURABLE_RESULT_SCHEMA_VERSION = "fff.resumablePrivatePipelineResult.v1";
export const WATERMARK_TEXT = "PREVIS / REFERENCE-ONLY / NOT FOR PUBLICATION";

const TOOL_PATH = fileURLToPath(import.meta.url);
export const DEFAULT_SOURCE_ROOT = path.resolve(path.dirname(TOOL_PATH), "..");
const CONTRACT_PATH = "artifacts/resumable-private-pipeline/pipeline-contract.json";
const DURABLE_RESULT_PATH = "artifacts/resumable-private-pipeline-result.json";

export const STAGES = Object.freeze([
  Object.freeze({ index: 1, name: "validate-canonical-sources" }),
  Object.freeze({ index: 2, name: "resolve-canonical-frames" }),
  Object.freeze({ index: 3, name: "resolve-canonical-timeline" }),
  Object.freeze({ index: 4, name: "materialize-run-workspace" }),
  Object.freeze({ index: 5, name: "encode-silent-private-mp4" }),
  Object.freeze({ index: 6, name: "verify-private-candidate" }),
  Object.freeze({ index: 7, name: "write-atomic-run-receipt" })
]);

const SOURCE_PATHS = Object.freeze({
  root_manifest: "artifacts/artifact-manifest.json",
  preview_model: "artifacts/private-previsualization-timeline/private-previsualization-timeline.json",
  preview_manifest: "artifacts/private-previsualization-timeline/private-previsualization-manifest.json",
  preview_result: "artifacts/private-previsualization-timeline-result.json",
  preview_renderer: "tools/fff-private-previsualization-timeline.mjs",
  integrated_model: "artifacts/integrated-visual-production-package/integrated-visual-production-package.json",
  integrated_manifest: "artifacts/integrated-visual-production-package/integrated-visual-production-package-manifest.json",
  integrated_result: "artifacts/integrated-visual-production-package-result.json",
  execution_model: "artifacts/production-execution-pack/production-execution-pack.json",
  execution_manifest: "artifacts/production-execution-pack/production-execution-manifest.json",
  execution_result: "artifacts/production-execution-pack-result.json",
  readiness_model: "artifacts/asset-rights-readiness-packet/asset-rights-readiness.json",
  readiness_manifest: "artifacts/asset-rights-readiness-packet/asset-rights-readiness-manifest.json",
  readiness_result: "artifacts/asset-rights-readiness-packet-result.json"
});

const EXPECTED = Object.freeze({
  preview_artifact_id: "fff-private-previsualization-timeline-001",
  integrated_artifact_id: "fff-integrated-visual-production-package-001",
  execution_artifact_id: "fff-production-execution-pack-001",
  readiness_artifact_id: "fff-asset-rights-readiness-packet-001",
  duration_seconds: 180,
  beat_count: 6,
  shot_count: 19,
  narration_segment_count: 6,
  subtitle_cue_count: 20,
  frame_width: 1280,
  frame_height: 720,
  output_width: 960,
  output_height: 540,
  output_fps: "30/1",
  duration_tolerance_seconds: 0.05
});

function nowIso() {
  return new Date().toISOString();
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function sha256File(filePath) {
  return sha256(await readFile(filePath));
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, stableValue(value[key])])
    );
  }
  return value;
}

function stableJson(value) {
  return JSON.stringify(stableValue(value));
}

function jsonHash(value) {
  return sha256(Buffer.from(stableJson(value), "utf8"));
}

function toRepoPath(filePath) {
  return filePath.replaceAll("\\", "/");
}

function absoluteFrom(root, relativePath) {
  return path.resolve(root, relativePath);
}

function isWithin(parentPath, childPath) {
  const relative = path.relative(path.resolve(parentPath), path.resolve(childPath));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function requireCondition(condition, message, code = "PIPELINE_CONTRACT_FAILURE") {
  if (!condition) {
    const error = new Error(`${code}: ${message}`);
    error.code = code;
    throw error;
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function writeJsonAtomic(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  try {
    await rename(temporaryPath, filePath);
  } catch (error) {
    if (!["EEXIST", "EPERM"].includes(error.code)) throw error;
    await rm(filePath, { force: true });
    await rename(temporaryPath, filePath);
  }
}

async function fileRecord(filePath, rootPath) {
  const info = await stat(filePath);
  return {
    path: toRepoPath(path.relative(rootPath, filePath)),
    byte_size: info.size,
    sha256: await sha256File(filePath)
  };
}

async function assertRecordedFile(rootPath, record, label = "recorded file") {
  const filePath = absoluteFrom(rootPath, record.path);
  try {
    await access(filePath, fsConstants.R_OK);
  } catch {
    requireCondition(false, `${label} missing: ${record.path}`, "MISSING_RECORDED_FILE");
  }
  const current = await fileRecord(filePath, rootPath);
  requireCondition(
    current.byte_size === record.byte_size && current.sha256 === record.sha256,
    `${label} hash/size mismatch: ${record.path}`,
    "RECORDED_FILE_MISMATCH"
  );
  return current;
}

function parseTime(value) {
  const pieces = String(value).split(":").map(Number);
  requireCondition(pieces.length === 2 && pieces.every(Number.isFinite), `invalid time ${value}`);
  return pieces[0] * 60 + pieces[1];
}

function canonicalTimeline(model) {
  return {
    duration_seconds: model.duration_seconds,
    beats: model.beats.map((beat) => ({
      beat_id: beat.beat_id,
      beat_number: beat.beat_number,
      start_seconds: beat.start_seconds,
      end_seconds: beat.end_seconds,
      duration_seconds: beat.duration_seconds,
      narration_segment_id: beat.narration_segment_id,
      subtitle_cue_ids: beat.subtitle_cues.map((cue) => cue.cue_id)
    })),
    shots: model.shots.map((shot) => ({
      shot_id: shot.shot_id,
      sequence: shot.sequence,
      beat_id: shot.beat_id,
      beat_number: shot.beat_number,
      start_seconds: shot.start_seconds,
      end_seconds: shot.end_seconds,
      duration_seconds: shot.duration_seconds,
      transition: shot.transition,
      motion: shot.motion,
      canonical_frame_sha256: shot.canonical_frame_sha256
    })),
    narration: model.timeline_tracks.narration_text.map((segment) => ({
      id: segment.id,
      beat_id: segment.beat_id,
      start_seconds: segment.start_seconds,
      end_seconds: segment.end_seconds,
      text_ja: segment.text_ja
    })),
    subtitles: model.timeline_tracks.subtitles.map((cue) => ({
      id: cue.id,
      beat_id: cue.beat_id,
      start_seconds: cue.start_seconds,
      end_seconds: cue.end_seconds,
      text_ja: cue.text_ja
    }))
  };
}

function assertTimelineContract(timeline, integrated, execution) {
  requireCondition(timeline.duration_seconds === EXPECTED.duration_seconds, "timeline duration must be 180 seconds");
  requireCondition(timeline.beats.length === EXPECTED.beat_count, "timeline must contain six Beats");
  requireCondition(timeline.shots.length === EXPECTED.shot_count, "timeline must contain nineteen shots");
  requireCondition(timeline.narration.length === EXPECTED.narration_segment_count, "timeline must contain six narration metadata segments");
  requireCondition(timeline.subtitles.length === EXPECTED.subtitle_cue_count, "timeline must contain twenty subtitle cues");
  requireCondition(timeline.shots[0].start_seconds === 0, "first shot must start at 0");
  requireCondition(timeline.shots.at(-1).end_seconds === EXPECTED.duration_seconds, "last shot must end at 180");

  for (let index = 0; index < timeline.shots.length; index += 1) {
    const shot = timeline.shots[index];
    requireCondition(
      shot.end_seconds - shot.start_seconds === shot.duration_seconds,
      `shot duration mismatch ${shot.shot_id}`,
      "ALTERED_SHOT_TIMING"
    );
    if (index > 0) {
      requireCondition(
        timeline.shots[index - 1].end_seconds === shot.start_seconds,
        `gap or overlap before ${shot.shot_id}`,
        "ALTERED_SHOT_TIMING"
      );
    }
    const integratedShot = integrated.shots[index];
    const executionShot = execution.shots[index];
    requireCondition(
      integratedShot?.shot_id === shot.shot_id &&
        integratedShot.start_time === formatWholeSeconds(shot.start_seconds) &&
        integratedShot.end_time === formatWholeSeconds(shot.end_seconds) &&
        integratedShot.duration_seconds === shot.duration_seconds,
      `integrated chronology mismatch ${shot.shot_id}`,
      "ALTERED_SHOT_TIMING"
    );
    requireCondition(
      executionShot?.shot_id === shot.shot_id &&
        parseTime(executionShot.start_time) === shot.start_seconds &&
        parseTime(executionShot.end_time) === shot.end_seconds &&
        executionShot.duration_seconds === shot.duration_seconds,
      `execution chronology mismatch ${shot.shot_id}`,
      "ALTERED_SHOT_TIMING"
    );
  }
}

function formatWholeSeconds(value) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

async function verifyManifestPayload(sourceRoot, packageRoot, manifest, label) {
  const records = [];
  for (const expectedFile of manifest.files || []) {
    const filePath = absoluteFrom(sourceRoot, path.join(packageRoot, expectedFile.relative_path));
    const current = await fileRecord(filePath, absoluteFrom(sourceRoot, packageRoot));
    requireCondition(
      current.path === toRepoPath(expectedFile.relative_path) &&
        current.byte_size === expectedFile.byte_size &&
        current.sha256 === expectedFile.sha256,
      `${label} payload mismatch ${expectedFile.relative_path}`,
      "PROTECTED_SOURCE_MISMATCH"
    );
    records.push(current);
  }
  requireCondition(
    typeof manifest.package_fingerprint_sha256 === "string" &&
      /^[0-9a-f]{64}$/.test(manifest.package_fingerprint_sha256),
    `${label} package fingerprint missing`,
    "PROTECTED_SOURCE_MISMATCH"
  );
  return {
    package_fingerprint_sha256: manifest.package_fingerprint_sha256,
    verified_payload_file_count: records.length,
    files: records
  };
}

async function executeRecorded(context, executable, args, options = {}) {
  const startedAt = nowIso();
  const command = [executable, ...args].join(" ");
  try {
    const result = await execFile(executable, args, {
      cwd: options.cwd || context.sourceRoot,
      windowsHide: true,
      maxBuffer: options.maxBuffer || 20 * 1024 * 1024
    });
    const entry = {
      sequence: context.commandLog.length + 1,
      command,
      cwd: options.cwd || context.sourceRoot,
      started_at: startedAt,
      completed_at: nowIso(),
      exit_code: 0,
      stdout: result.stdout?.trim() || "",
      stderr: result.stderr?.trim() || ""
    };
    context.commandLog.push(entry);
    if (context.runDir) {
      await writeJsonAtomic(path.join(context.runDir, "executed-commands.json"), {
        schemaVersion: "fff.privatePipelineExecutedCommands.v1",
        commands: context.commandLog
      });
    }
    return result;
  } catch (error) {
    context.commandLog.push({
      sequence: context.commandLog.length + 1,
      command,
      cwd: options.cwd || context.sourceRoot,
      started_at: startedAt,
      completed_at: nowIso(),
      exit_code: Number.isInteger(error.code) ? error.code : 1,
      stdout: error.stdout?.trim() || "",
      stderr: error.stderr?.trim() || error.message
    });
    if (context.runDir) {
      await writeJsonAtomic(path.join(context.runDir, "executed-commands.json"), {
        schemaVersion: "fff.privatePipelineExecutedCommands.v1",
        commands: context.commandLog
      });
    }
    throw error;
  }
}

async function recordLogicalCommand(context, stageName) {
  context.commandLog.push({
    sequence: context.commandLog.length + 1,
    command: `internal-stage ${stageName}`,
    cwd: context.sourceRoot,
    started_at: nowIso(),
    completed_at: nowIso(),
    exit_code: 0,
    stdout: "",
    stderr: ""
  });
  if (context.runDir) {
    await writeJsonAtomic(path.join(context.runDir, "executed-commands.json"), {
      schemaVersion: "fff.privatePipelineExecutedCommands.v1",
      commands: context.commandLog
    });
  }
}

async function nearestValidatorEvidence(context) {
  const commands = [
    ["validate-private-previsualization-timeline", SOURCE_PATHS.preview_result],
    ["validate-integrated-visual-production-package", SOURCE_PATHS.integrated_result],
    ["validate-production-execution-pack", SOURCE_PATHS.execution_result]
  ];
  const evidence = [];
  for (const [command, input] of commands) {
    const result = await executeRecorded(
      context,
      process.execPath,
      ["tools/fff-state.mjs", command, input],
      { cwd: context.sourceRoot }
    );
    evidence.push({ command, input, output: result.stdout.trim(), passed: true });
  }
  return evidence;
}

export async function inspectCanonicalSources(
  sourceRoot = DEFAULT_SOURCE_ROOT,
  { runNearestValidators = false, context = null } = {}
) {
  sourceRoot = path.resolve(sourceRoot);
  const load = async (key) => readJson(absoluteFrom(sourceRoot, SOURCE_PATHS[key]));
  const [
    rootManifest,
    previewModel,
    previewManifest,
    previewResult,
    integratedModel,
    integratedManifest,
    integratedResult,
    executionModel,
    executionManifest,
    executionResult,
    readinessModel,
    readinessManifest,
    readinessResult,
    rendererSource
  ] = await Promise.all([
    load("root_manifest"),
    load("preview_model"),
    load("preview_manifest"),
    load("preview_result"),
    load("integrated_model"),
    load("integrated_manifest"),
    load("integrated_result"),
    load("execution_model"),
    load("execution_manifest"),
    load("execution_result"),
    load("readiness_model"),
    load("readiness_manifest"),
    load("readiness_result"),
    readFile(absoluteFrom(sourceRoot, SOURCE_PATHS.preview_renderer), "utf8")
  ]);

  requireCondition(rootManifest.private_previsualization_timeline?.artifact_id === EXPECTED.preview_artifact_id, "preview root registration missing");
  requireCondition(previewModel.artifact_id === EXPECTED.preview_artifact_id, "preview model identity mismatch");
  requireCondition(previewResult.artifact_id === EXPECTED.preview_artifact_id && previewResult.passed === true, "preview result is not passing");
  requireCondition(integratedModel.artifact_id === EXPECTED.integrated_artifact_id, "integrated model identity mismatch");
  requireCondition(integratedResult.artifact_id === EXPECTED.integrated_artifact_id && integratedResult.passed === true, "integrated result is not passing");
  requireCondition(executionModel.artifact_id === EXPECTED.execution_artifact_id, "execution model identity mismatch");
  requireCondition(executionResult.artifact_id === EXPECTED.execution_artifact_id && executionResult.passed === true, "execution result is not passing");
  requireCondition(readinessModel.artifact_id === EXPECTED.readiness_artifact_id, "readiness model identity mismatch");
  requireCondition(readinessResult.artifact_id === EXPECTED.readiness_artifact_id && readinessResult.passed === true, "readiness result is not passing");
  requireCondition(rendererSource.includes(WATERMARK_TEXT), "accepted renderer watermark marker missing", "MISSING_WATERMARK");
  requireCondition(
    previewModel.source_fingerprint === integratedManifest.package_fingerprint_sha256,
    "preview/integrated source fingerprint mismatch",
    "CORRUPTED_SOURCE_FINGERPRINT"
  );
  requireCondition(
    previewModel.readiness_current_fingerprint === readinessManifest.package_fingerprint_sha256,
    "preview/readiness source fingerprint mismatch",
    "CORRUPTED_SOURCE_FINGERPRINT"
  );

  const timeline = canonicalTimeline(previewModel);
  assertTimelineContract(timeline, integratedModel, executionModel);

  const frameRecords = [];
  for (const shot of previewModel.shots) {
    const framePath = absoluteFrom(sourceRoot, shot.canonical_frame_path);
    requireCondition(existsSync(framePath), `missing canonical frame ${shot.shot_id}`, "MISSING_FRAME");
    const record = await fileRecord(framePath, sourceRoot);
    requireCondition(
      record.sha256 === shot.canonical_frame_sha256 &&
        record.byte_size === shot.canonical_frame_byte_size,
      `canonical frame identity mismatch ${shot.shot_id}`,
      "CORRUPTED_SOURCE_FINGERPRINT"
    );
    frameRecords.push({
      shot_id: shot.shot_id,
      sequence: shot.sequence,
      source_path: toRepoPath(shot.canonical_frame_path),
      byte_size: record.byte_size,
      sha256: record.sha256
    });
  }
  requireCondition(
    frameRecords.length === EXPECTED.shot_count &&
      new Set(frameRecords.map((item) => item.sha256)).size === EXPECTED.shot_count,
    "canonical frame set must contain nineteen unique identities"
  );

  const sourceImageRecords = [];
  requireCondition(integratedModel.references.length === 28, "integrated source reference count must remain 28");
  for (const reference of integratedModel.references) {
    const imagePath = absoluteFrom(sourceRoot, reference.local_path);
    requireCondition(existsSync(imagePath), `missing source image ${reference.canonical_reference_id}`, "MISSING_SOURCE_IMAGE");
    const record = await fileRecord(imagePath, sourceRoot);
    requireCondition(
      record.sha256 === reference.sha256,
      `source image hash mismatch ${reference.canonical_reference_id}`,
      "PROTECTED_SOURCE_MISMATCH"
    );
    sourceImageRecords.push({
      canonical_reference_id: reference.canonical_reference_id,
      path: toRepoPath(reference.local_path),
      byte_size: record.byte_size,
      sha256: record.sha256
    });
  }

  const privatePackage = await verifyManifestPayload(
    sourceRoot,
    "artifacts/private-previsualization-timeline",
    previewManifest,
    "private preview"
  );
  const integratedPackage = await verifyManifestPayload(
    sourceRoot,
    "artifacts/integrated-visual-production-package",
    integratedManifest,
    "integrated visual"
  );
  const executionPackage = await verifyManifestPayload(
    sourceRoot,
    "artifacts/production-execution-pack",
    executionManifest,
    "production execution"
  );
  const readinessPackage = await verifyManifestPayload(
    sourceRoot,
    "artifacts/asset-rights-readiness-packet",
    readinessManifest,
    "asset rights readiness"
  );

  const identityFiles = [];
  for (const [name, relativePath] of Object.entries(SOURCE_PATHS)) {
    identityFiles.push({
      name,
      ...(await fileRecord(absoluteFrom(sourceRoot, relativePath), sourceRoot))
    });
  }
  identityFiles.sort((left, right) => left.name.localeCompare(right.name));

  const negativeGuardMetadata = previewModel.shots.map((shot) => ({
    shot_id: shot.shot_id,
    source_truth_boundary: shot.source_truth_boundary
  }));
  requireCondition(
    negativeGuardMetadata.length === EXPECTED.shot_count &&
      negativeGuardMetadata.every((item) => typeof item.source_truth_boundary === "string" && item.source_truth_boundary.length > 0),
    "negative story guard metadata changed"
  );

  const sourceIdentity = {
    schemaVersion: "fff.privatePipelineSourceIdentity.v1",
    artifact_ids: {
      preview: previewModel.artifact_id,
      integrated: integratedModel.artifact_id,
      execution: executionModel.artifact_id,
      readiness: readinessModel.artifact_id
    },
    canonical_files: identityFiles,
    protected_package_fingerprints: {
      private_preview: privatePackage.package_fingerprint_sha256,
      integrated_visual: integratedPackage.package_fingerprint_sha256,
      production_execution: executionPackage.package_fingerprint_sha256,
      asset_rights_readiness: readinessPackage.package_fingerprint_sha256
    },
    timeline_sha256: jsonHash(timeline),
    frame_identity_sha256: jsonHash(frameRecords),
    source_image_identity_sha256: jsonHash(sourceImageRecords),
    negative_guard_metadata_sha256: jsonHash(negativeGuardMetadata),
    watermark_renderer_marker: true,
    watermark_text: WATERMARK_TEXT
  };
  const sourceIdentitySha256 = jsonHash(sourceIdentity);

  let nearestValidators = [];
  if (runNearestValidators) {
    requireCondition(context, "validator execution requires a command context");
    nearestValidators = await nearestValidatorEvidence(context);
  }

  return {
    source_root: sourceRoot,
    source_identity: sourceIdentity,
    source_identity_sha256: sourceIdentitySha256,
    timeline,
    frame_records: frameRecords,
    source_image_records: sourceImageRecords,
    negative_guard_metadata: negativeGuardMetadata,
    nearest_validators: nearestValidators,
    boundaries: {
      private_local_only: true,
      reference_only: true,
      silent: true,
      asset_selection: false,
      rights_clearance: false,
      voice_generation: false,
      media_generation: false,
      public_release: false,
      production_approval: false,
      final_canon_decision: false
    }
  };
}

async function getToolchainVersions(context) {
  const ffmpeg = await executeRecorded(context, "ffmpeg", ["-version"]);
  const ffprobe = await executeRecorded(context, "ffprobe", ["-version"]);
  return {
    node: process.version,
    platform: `${process.platform}-${process.arch}`,
    ffmpeg: ffmpeg.stdout.split(/\r?\n/)[0],
    ffprobe: ffprobe.stdout.split(/\r?\n/)[0],
    pipeline_tool_sha256: await sha256File(TOOL_PATH)
  };
}

function stageReceiptPath(runDir, stage) {
  return path.join(
    runDir,
    "receipts",
    `${String(stage.index).padStart(2, "0")}-${stage.name}.json`
  );
}

async function writeStageReceipt(context, stage, outputs, details = {}) {
  const records = [];
  for (const output of outputs) {
    records.push(await fileRecord(output, context.runDir));
  }
  const receipt = {
    schemaVersion: STAGE_RECEIPT_SCHEMA_VERSION,
    artifact_id: PIPELINE_ARTIFACT_ID,
    run_id: context.manifest.run_id,
    stage_index: stage.index,
    stage_name: stage.name,
    status: "complete",
    source_identity_sha256: context.snapshot.source_identity_sha256,
    completed_at: nowIso(),
    outputs: records,
    details
  };
  await writeJsonAtomic(stageReceiptPath(context.runDir, stage), receipt);
  context.manifest.completed_stages = [
    ...new Set([...(context.manifest.completed_stages || []), stage.name])
  ];
  context.manifest.current_stage = stage.name;
  context.manifest.updated_at = nowIso();
  context.manifest.stage_history = [
    ...(context.manifest.stage_history || []),
    { stage: stage.name, event: "completed", at: receipt.completed_at }
  ];
  await writeJsonAtomic(path.join(context.runDir, "run-manifest.json"), context.manifest);
  return receipt;
}

async function stageValidateSources(context, stage) {
  await recordLogicalCommand(context, stage.name);
  context.snapshot = await inspectCanonicalSources(context.sourceRoot, {
    runNearestValidators: context.runNearestValidators,
    context
  });
  context.manifest.source_identity_sha256 = context.snapshot.source_identity_sha256;
  const sourcePath = path.join(context.runDir, "source-fingerprints.json");
  const toolchainPath = path.join(context.runDir, "toolchain-versions.json");
  await writeJsonAtomic(sourcePath, {
    schemaVersion: "fff.privatePipelineSourceFingerprints.v1",
    source_identity_sha256: context.snapshot.source_identity_sha256,
    source_identity: context.snapshot.source_identity,
    canonical_frames: context.snapshot.frame_records,
    source_images: context.snapshot.source_image_records,
    nearest_validators: context.snapshot.nearest_validators,
    negative_guard_metadata_preserved: true
  });
  const toolchain = await getToolchainVersions(context);
  await writeJsonAtomic(toolchainPath, {
    schemaVersion: "fff.privatePipelineToolchainVersions.v1",
    ...toolchain
  });
  return writeStageReceipt(context, stage, [sourcePath, toolchainPath], {
    source_identity_sha256: context.snapshot.source_identity_sha256,
    protected_source_images: context.snapshot.source_image_records.length,
    nearest_validator_count: context.snapshot.nearest_validators.length
  });
}

async function stageResolveFrames(context, stage) {
  await recordLogicalCommand(context, stage.name);
  const frameMapPath = path.join(context.runDir, "workspace", "frame-map.json");
  await writeJsonAtomic(frameMapPath, {
    schemaVersion: "fff.privatePipelineFrameMap.v1",
    source_identity_sha256: context.snapshot.source_identity_sha256,
    frame_count: context.snapshot.frame_records.length,
    frames: context.snapshot.frame_records
  });
  return writeStageReceipt(context, stage, [frameMapPath], {
    exact_frame_count: context.snapshot.frame_records.length,
    frame_identity_sha256: context.snapshot.source_identity.frame_identity_sha256
  });
}

async function stageResolveTimeline(context, stage) {
  await recordLogicalCommand(context, stage.name);
  const timelinePath = path.join(context.runDir, "workspace", "timeline.json");
  await writeJsonAtomic(timelinePath, {
    schemaVersion: "fff.privatePipelineTimeline.v1",
    source_identity_sha256: context.snapshot.source_identity_sha256,
    timeline_sha256: context.snapshot.source_identity.timeline_sha256,
    ...context.snapshot.timeline
  });
  return writeStageReceipt(context, stage, [timelinePath], {
    beat_count: context.snapshot.timeline.beats.length,
    shot_count: context.snapshot.timeline.shots.length,
    duration_seconds: context.snapshot.timeline.duration_seconds,
    narration_segment_count: context.snapshot.timeline.narration.length,
    subtitle_cue_count: context.snapshot.timeline.subtitles.length
  });
}

function ffconcatQuote(filePath) {
  return path.resolve(filePath).replaceAll("\\", "/").replaceAll("'", "'\\''");
}

async function stageMaterializeWorkspace(context, stage) {
  await recordLogicalCommand(context, stage.name);
  const frameRoot = path.join(context.runDir, "workspace", "frames");
  await mkdir(frameRoot, { recursive: true });
  const copiedFrames = [];
  for (const frame of context.snapshot.frame_records) {
    const sourcePath = absoluteFrom(context.sourceRoot, frame.source_path);
    const targetPath = path.join(frameRoot, `${frame.shot_id}.jpg`);
    await copyFile(sourcePath, targetPath);
    const copied = await fileRecord(targetPath, context.runDir);
    requireCondition(
      copied.sha256 === frame.sha256 && copied.byte_size === frame.byte_size,
      `run-local frame copy mismatch ${frame.shot_id}`,
      "MATERIALIZED_FRAME_MISMATCH"
    );
    copiedFrames.push(targetPath);
  }

  const concatPath = path.join(context.runDir, "workspace", "frames.ffconcat");
  const lines = ["ffconcat version 1.0"];
  for (const shot of context.snapshot.timeline.shots) {
    const framePath = path.join(frameRoot, `${shot.shot_id}.jpg`);
    lines.push(`file '${ffconcatQuote(framePath)}'`, `duration ${shot.duration_seconds}`);
  }
  lines.push(
    `file '${ffconcatQuote(
      path.join(frameRoot, `${context.snapshot.timeline.shots.at(-1).shot_id}.jpg`)
    )}'`
  );
  await writeFile(concatPath, `${lines.join("\n")}\n`, "utf8");
  return writeStageReceipt(context, stage, [...copiedFrames, concatPath], {
    copied_frame_count: copiedFrames.length,
    frames_are_exact_canonical_copies: true
  });
}

async function stageEncodeMp4(context, stage) {
  await recordLogicalCommand(context, stage.name);
  const outputRoot = path.join(context.runDir, "output");
  await mkdir(outputRoot, { recursive: true });
  const outputPath = path.join(outputRoot, "private-previsualization-timeline.mp4");
  requireCondition(!existsSync(outputPath), "encode stage refuses to overwrite an existing MP4", "RUN_OUTPUT_EXISTS");
  const concatPath = path.join(context.runDir, "workspace", "frames.ffconcat");
  const args = [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    concatPath,
    "-an",
    "-vf",
    "fps=30,scale=960:540:flags=lanczos,format=yuv420p",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-tune",
    "stillimage",
    "-crf",
    "25",
    "-movflags",
    "+faststart",
    "-map_metadata",
    "-1",
    "-t",
    "180",
    outputPath
  ];
  await executeRecorded(context, "ffmpeg", args, { cwd: context.sourceRoot });
  return writeStageReceipt(context, stage, [outputPath], {
    output_profile: {
      codec: "libx264",
      width: EXPECTED.output_width,
      height: EXPECTED.output_height,
      fps: 30,
      silent: true,
      duration_seconds: EXPECTED.duration_seconds
    }
  });
}

async function probeMedia(context, mediaPath, { record = true } = {}) {
  const args = [
    "-v",
    "error",
    "-show_entries",
    "format=duration,size,format_name:stream=index,codec_type,codec_name,width,height,avg_frame_rate",
    "-of",
    "json",
    mediaPath
  ];
  const result = record
    ? await executeRecorded(context, "ffprobe", args, { cwd: context.sourceRoot })
    : await execFile("ffprobe", args, {
        cwd: context.sourceRoot,
        windowsHide: true,
        maxBuffer: 10 * 1024 * 1024
      });
  const raw = JSON.parse(result.stdout);
  const videoStreams = raw.streams.filter((stream) => stream.codec_type === "video");
  const audioStreams = raw.streams.filter((stream) => stream.codec_type === "audio");
  const mediaRecord = await fileRecord(mediaPath, context.runDir);
  return {
    path: mediaRecord.path,
    byte_size: mediaRecord.byte_size,
    sha256: mediaRecord.sha256,
    duration_seconds: Number(raw.format.duration),
    format_name: raw.format.format_name,
    video_stream_count: videoStreams.length,
    audio_stream_count: audioStreams.length,
    codec_name: videoStreams[0]?.codec_name || null,
    width: videoStreams[0]?.width || null,
    height: videoStreams[0]?.height || null,
    avg_frame_rate: videoStreams[0]?.avg_frame_rate || null
  };
}

function mediaFailures(media) {
  const failures = [];
  if (Math.abs(media.duration_seconds - EXPECTED.duration_seconds) >= EXPECTED.duration_tolerance_seconds) {
    failures.push(`OUTPUT_DURATION_MISMATCH: expected 180.000 seconds, got ${media.duration_seconds}`);
  }
  if (media.video_stream_count !== 1) failures.push(`OUTPUT_VIDEO_STREAM_MISMATCH: ${media.video_stream_count}`);
  if (media.audio_stream_count !== 0) failures.push(`UNEXPECTED_AUDIO_STREAM: ${media.audio_stream_count}`);
  if (media.codec_name !== "h264") failures.push(`OUTPUT_CODEC_MISMATCH: ${media.codec_name}`);
  if (media.width !== EXPECTED.output_width || media.height !== EXPECTED.output_height) {
    failures.push(`OUTPUT_DIMENSION_MISMATCH: ${media.width}x${media.height}`);
  }
  if (media.avg_frame_rate !== EXPECTED.output_fps) failures.push(`OUTPUT_FPS_MISMATCH: ${media.avg_frame_rate}`);
  return failures;
}

async function assertWorkspaceMatchesSnapshot(context) {
  const frameMap = await readJson(path.join(context.runDir, "workspace", "frame-map.json"));
  const timelinePayload = await readJson(path.join(context.runDir, "workspace", "timeline.json"));
  requireCondition(
    frameMap.source_identity_sha256 === context.snapshot.source_identity_sha256,
    "frame map source fingerprint changed",
    "CORRUPTED_SOURCE_FINGERPRINT"
  );
  requireCondition(
    frameMap.frame_count === EXPECTED.shot_count &&
      jsonHash(frameMap.frames) === jsonHash(context.snapshot.frame_records),
    "frame map identity mismatch",
    "CORRUPTED_SOURCE_FINGERPRINT"
  );
  for (const frame of frameMap.frames) {
    const runFramePath = path.join(context.runDir, "workspace", "frames", `${frame.shot_id}.jpg`);
    requireCondition(existsSync(runFramePath), `missing run-local frame ${frame.shot_id}`, "MISSING_FRAME");
    const current = await fileRecord(runFramePath, context.runDir);
    requireCondition(
      current.sha256 === frame.sha256 && current.byte_size === frame.byte_size,
      `run-local frame mismatch ${frame.shot_id}`,
      "CORRUPTED_SOURCE_FINGERPRINT"
    );
  }
  const timeline = {
    duration_seconds: timelinePayload.duration_seconds,
    beats: timelinePayload.beats,
    shots: timelinePayload.shots,
    narration: timelinePayload.narration,
    subtitles: timelinePayload.subtitles
  };
  requireCondition(
    timelinePayload.timeline_sha256 === context.snapshot.source_identity.timeline_sha256 &&
      jsonHash(timeline) === context.snapshot.source_identity.timeline_sha256,
    "run-local shot timing or metadata changed",
    "ALTERED_SHOT_TIMING"
  );
  assertTimelineContract(
    timeline,
    await readJson(absoluteFrom(context.sourceRoot, SOURCE_PATHS.integrated_model)),
    await readJson(absoluteFrom(context.sourceRoot, SOURCE_PATHS.execution_model))
  );
  return { frameMap, timelinePayload };
}

async function stageVerifyOutput(context, stage) {
  await recordLogicalCommand(context, stage.name);
  await assertWorkspaceMatchesSnapshot(context);
  const outputPath = path.join(context.runDir, "output", "private-previsualization-timeline.mp4");
  const media = await probeMedia(context, outputPath);
  const failures = mediaFailures(media);
  requireCondition(failures.length === 0, failures.join("; "), "MEDIA_VERIFICATION_FAILURE");
  requireCondition(
    context.snapshot.source_identity.watermark_renderer_marker === true &&
      context.snapshot.source_identity.watermark_text === WATERMARK_TEXT,
    "watermark contract missing",
    "MISSING_WATERMARK"
  );

  const probePath = path.join(context.runDir, "workspace", "media-probe.json");
  const verificationPath = path.join(context.runDir, "workspace", "verification.json");
  await writeJsonAtomic(probePath, {
    schemaVersion: "fff.privatePipelineMediaProbe.v1",
    ...media
  });
  await writeJsonAtomic(verificationPath, {
    schemaVersion: "fff.privatePipelineVerification.v1",
    passed: true,
    failures: [],
    exact_frame_identity: true,
    exact_timeline_identity: true,
    watermark: {
      text: WATERMARK_TEXT,
      renderer_marker_present: true,
      baked_frame_identity_preserved: true
    },
    counts: {
      beats: EXPECTED.beat_count,
      shots: EXPECTED.shot_count,
      narration_segments: EXPECTED.narration_segment_count,
      subtitle_cues: EXPECTED.subtitle_cue_count,
      gaps: 0,
      overlaps: 0
    },
    media,
    boundaries: context.snapshot.boundaries
  });
  return writeStageReceipt(context, stage, [probePath, verificationPath], {
    output_sha256: media.sha256,
    output_duration_seconds: media.duration_seconds,
    audio_stream_count: media.audio_stream_count,
    watermark_verified_by: "accepted-renderer-marker-and-exact-canonical-frame-identity"
  });
}

async function stageWriteFinalReceipt(context, stage) {
  await recordLogicalCommand(context, stage.name);
  const sourceFingerprints = await readJson(path.join(context.runDir, "source-fingerprints.json"));
  const toolchain = await readJson(path.join(context.runDir, "toolchain-versions.json"));
  const verification = await readJson(path.join(context.runDir, "workspace", "verification.json"));
  const commands = await readJson(path.join(context.runDir, "executed-commands.json"));
  const previousReceipts = [];
  for (const previousStage of STAGES.slice(0, -1)) {
    const receiptPath = stageReceiptPath(context.runDir, previousStage);
    previousReceipts.push({
      stage: previousStage.name,
      ...(await fileRecord(receiptPath, context.runDir))
    });
  }
  const commandsRecord = await fileRecord(
    path.join(context.runDir, "executed-commands.json"),
    context.runDir
  );
  const finalReceipt = {
    schemaVersion: RUN_RECEIPT_SCHEMA_VERSION,
    artifact_id: PIPELINE_ARTIFACT_ID,
    run_id: context.manifest.run_id,
    pipeline_version: 1,
    state: "complete",
    completed_at: nowIso(),
    source_identity_sha256: context.snapshot.source_identity_sha256,
    source_fingerprints: {
      path: "source-fingerprints.json",
      protected_package_fingerprints:
        sourceFingerprints.source_identity.protected_package_fingerprints,
      timeline_sha256: sourceFingerprints.source_identity.timeline_sha256,
      frame_identity_sha256: sourceFingerprints.source_identity.frame_identity_sha256,
      source_image_identity_sha256:
        sourceFingerprints.source_identity.source_image_identity_sha256,
      negative_guard_metadata_sha256:
        sourceFingerprints.source_identity.negative_guard_metadata_sha256
    },
    toolchain,
    stage_receipts: previousReceipts,
    executed_commands: {
      ...commandsRecord,
      command_count: commands.commands.length
    },
    output: verification.media,
    exact_contract: verification.counts,
    watermark: verification.watermark,
    boundaries: verification.boundaries,
    resume_events: context.manifest.resume_events || [],
    mp4_byte_identity_policy:
      "MP4 bytes may differ across FFmpeg versions; canonical frame identity, timeline identity, media properties, watermark, and closed gates are authoritative."
  };
  const receiptPath = path.join(context.runDir, "run-receipt.json");
  await writeJsonAtomic(receiptPath, finalReceipt);
  await writeStageReceipt(context, stage, [receiptPath], {
    final_state: "complete",
    atomic_write: true
  });
  context.manifest.state = "complete";
  context.manifest.current_stage = null;
  context.manifest.completed_at = finalReceipt.completed_at;
  context.manifest.updated_at = nowIso();
  await writeJsonAtomic(path.join(context.runDir, "run-manifest.json"), context.manifest);
  return finalReceipt;
}

const STAGE_RUNNERS = new Map([
  ["validate-canonical-sources", stageValidateSources],
  ["resolve-canonical-frames", stageResolveFrames],
  ["resolve-canonical-timeline", stageResolveTimeline],
  ["materialize-run-workspace", stageMaterializeWorkspace],
  ["encode-silent-private-mp4", stageEncodeMp4],
  ["verify-private-candidate", stageVerifyOutput],
  ["write-atomic-run-receipt", stageWriteFinalReceipt]
]);

async function runStages(context, startIndex = 0, stopAfter = null) {
  try {
    for (const stage of STAGES.slice(startIndex)) {
      const runner = STAGE_RUNNERS.get(stage.name);
      await runner(context, stage);
      if (stopAfter === stage.name) {
        context.manifest.state = "incomplete";
        context.manifest.stop_reason = `stopped_after:${stage.name}`;
        context.manifest.current_stage = null;
        context.manifest.updated_at = nowIso();
        await writeJsonAtomic(path.join(context.runDir, "run-manifest.json"), context.manifest);
        return { state: "incomplete", stopped_after: stage.name, run_id: context.manifest.run_id };
      }
    }
    return {
      state: "complete",
      run_id: context.manifest.run_id,
      receipt: await readJson(path.join(context.runDir, "run-receipt.json"))
    };
  } catch (error) {
    context.manifest.state = "failed";
    context.manifest.current_stage = null;
    context.manifest.failure = {
      at: nowIso(),
      code: error.code || "PIPELINE_FAILURE",
      message: error.message
    };
    context.manifest.updated_at = nowIso();
    await writeJsonAtomic(path.join(context.runDir, "run-manifest.json"), context.manifest);
    await writeJsonAtomic(path.join(context.runDir, "failure.json"), {
      schemaVersion: "fff.privatePipelineFailure.v1",
      run_id: context.manifest.run_id,
      ...context.manifest.failure
    });
    throw error;
  }
}

function validateRunDirectoryLocation(runDir, sourceRoot) {
  requireCondition(runDir, "--run-dir is required", "RUN_DIR_REQUIRED");
  const resolved = path.resolve(runDir);
  requireCondition(
    !isWithin(sourceRoot, resolved),
    `run directory must be outside the source repository: ${resolved}`,
    "RUN_DIR_INSIDE_REPOSITORY"
  );
  return resolved;
}

async function ensureNewRunDirectory(runDir) {
  if (!existsSync(runDir)) {
    await mkdir(runDir, { recursive: true });
    return;
  }
  const entries = await readdir(runDir);
  requireCondition(
    entries.length === 0,
    `build requires a new empty run directory; use resume for a partial run: ${runDir}`,
    "RUN_DIR_NOT_EMPTY"
  );
}

function createInitialManifest(runDir, sourceRoot, runId) {
  const createdAt = nowIso();
  return {
    schemaVersion: RUN_MANIFEST_SCHEMA_VERSION,
    artifact_id: PIPELINE_ARTIFACT_ID,
    pipeline_version: 1,
    run_id: runId,
    run_directory: path.resolve(runDir),
    source_root: path.resolve(sourceRoot),
    state: "incomplete",
    current_stage: null,
    completed_stages: [],
    stage_history: [],
    resume_events: [],
    created_at: createdAt,
    updated_at: createdAt,
    source_identity_sha256: null,
    boundaries: {
      local_only: true,
      reference_only: true,
      silent: true,
      public_release: false
    }
  };
}

export async function buildRun({
  runDir,
  sourceRoot = DEFAULT_SOURCE_ROOT,
  runId = null,
  stopAfter = null,
  runNearestValidators = true
}) {
  sourceRoot = path.resolve(sourceRoot);
  runDir = validateRunDirectoryLocation(runDir, sourceRoot);
  if (stopAfter) {
    requireCondition(
      STAGES.some((stage) => stage.name === stopAfter),
      `unknown --stop-after stage: ${stopAfter}`,
      "UNKNOWN_STAGE"
    );
  }
  await ensureNewRunDirectory(runDir);
  const manifest = createInitialManifest(
    runDir,
    sourceRoot,
    runId || path.basename(runDir)
  );
  await writeJsonAtomic(path.join(runDir, "run-manifest.json"), manifest);
  const context = {
    runDir,
    sourceRoot,
    manifest,
    snapshot: null,
    commandLog: [],
    runNearestValidators
  };
  return runStages(context, 0, stopAfter);
}

async function receiptValidation(runDir, stage, sourceIdentitySha256) {
  const receiptPath = stageReceiptPath(runDir, stage);
  if (!existsSync(receiptPath)) return { valid: false, missing: true, failures: [] };
  const failures = [];
  let receipt;
  try {
    receipt = await readJson(receiptPath);
  } catch (error) {
    return { valid: false, missing: false, failures: [`invalid receipt JSON: ${error.message}`] };
  }
  if (
    receipt.schemaVersion !== STAGE_RECEIPT_SCHEMA_VERSION ||
    receipt.stage_index !== stage.index ||
    receipt.stage_name !== stage.name ||
    receipt.status !== "complete"
  ) {
    failures.push("stage receipt contract mismatch");
  }
  if (receipt.source_identity_sha256 !== sourceIdentitySha256) {
    failures.push("stage receipt source identity is stale");
  }
  for (const record of receipt.outputs || []) {
    try {
      await assertRecordedFile(runDir, record, `${stage.name} output`);
    } catch (error) {
      failures.push(error.message);
    }
  }
  return { valid: failures.length === 0, missing: false, failures, receipt };
}

export async function statusRun({
  runDir,
  sourceRoot = DEFAULT_SOURCE_ROOT
}) {
  sourceRoot = path.resolve(sourceRoot);
  runDir = validateRunDirectoryLocation(runDir, sourceRoot);
  if (!existsSync(path.join(runDir, "run-manifest.json"))) {
    return { state: "incomplete", run_directory: runDir, reason: "run-manifest.json missing" };
  }
  let manifest;
  try {
    manifest = await readJson(path.join(runDir, "run-manifest.json"));
  } catch (error) {
    return { state: "failed", run_directory: runDir, reason: `invalid run manifest: ${error.message}` };
  }
  if (manifest.state === "failed") {
    return {
      state: "failed",
      run_directory: runDir,
      run_id: manifest.run_id,
      failure: manifest.failure || null
    };
  }

  let snapshot;
  try {
    snapshot = await inspectCanonicalSources(sourceRoot);
  } catch (error) {
    return {
      state: "stale",
      run_directory: runDir,
      run_id: manifest.run_id,
      reason: `canonical sources are no longer valid: ${error.message}`
    };
  }
  if (manifest.source_identity_sha256 && manifest.source_identity_sha256 !== snapshot.source_identity_sha256) {
    return {
      state: "stale",
      run_directory: runDir,
      run_id: manifest.run_id,
      reason: "canonical input identity changed; start an explicit new run",
      recorded_source_identity_sha256: manifest.source_identity_sha256,
      current_source_identity_sha256: snapshot.source_identity_sha256
    };
  }

  const completed = [];
  for (const stage of STAGES) {
    const validation = await receiptValidation(
      runDir,
      stage,
      snapshot.source_identity_sha256
    );
    if (validation.missing) {
      return {
        state: "incomplete",
        run_directory: runDir,
        run_id: manifest.run_id,
        completed_stages: completed,
        next_stage: stage.name
      };
    }
    if (!validation.valid) {
      return {
        state: "stale",
        run_directory: runDir,
        run_id: manifest.run_id,
        completed_stages: completed,
        stale_stage: stage.name,
        failures: validation.failures
      };
    }
    completed.push(stage.name);
  }

  if (manifest.state !== "complete") {
    return {
      state: "incomplete",
      run_directory: runDir,
      run_id: manifest.run_id,
      completed_stages: completed,
      reason: `all receipts exist but manifest state is ${manifest.state}`
    };
  }
  const verification = await verifyRunDirectory({ runDir, sourceRoot });
  if (!verification.passed) {
    return {
      state: "stale",
      run_directory: runDir,
      run_id: manifest.run_id,
      completed_stages: completed,
      failures: verification.failures
    };
  }
  return {
    state: "complete",
    run_directory: runDir,
    run_id: manifest.run_id,
    completed_stages: completed,
    output: verification.output
  };
}

async function removeOwnedPath(runDir, relativePath) {
  const target = absoluteFrom(runDir, relativePath);
  requireCondition(isWithin(runDir, target), `refusing to remove path outside run directory: ${target}`);
  await rm(target, { recursive: true, force: true });
}

async function cleanupFromStage(runDir, stageIndex) {
  const owned = {
    1: ["source-fingerprints.json", "toolchain-versions.json"],
    2: ["workspace/frame-map.json"],
    3: ["workspace/timeline.json"],
    4: ["workspace/frames", "workspace/frames.ffconcat"],
    5: ["output/private-previsualization-timeline.mp4"],
    6: ["workspace/media-probe.json", "workspace/verification.json"],
    7: ["run-receipt.json"]
  };
  for (const stage of STAGES.slice(stageIndex)) {
    for (const relativePath of owned[stage.index] || []) {
      await removeOwnedPath(runDir, relativePath);
    }
    await rm(stageReceiptPath(runDir, stage), { force: true });
  }
  await rm(path.join(runDir, "failure.json"), { force: true });
}

export async function resumeRun({
  runDir,
  sourceRoot = DEFAULT_SOURCE_ROOT,
  stopAfter = null,
  runNearestValidators = true
}) {
  sourceRoot = path.resolve(sourceRoot);
  runDir = validateRunDirectoryLocation(runDir, sourceRoot);
  const manifestPath = path.join(runDir, "run-manifest.json");
  requireCondition(existsSync(manifestPath), "resume requires run-manifest.json", "RUN_MANIFEST_MISSING");
  const manifest = await readJson(manifestPath);
  requireCondition(manifest.state !== "complete", "completed runs cannot be overwritten; start a new run", "RUN_ALREADY_COMPLETE");
  const snapshot = await inspectCanonicalSources(sourceRoot);
  requireCondition(
    !manifest.source_identity_sha256 ||
      manifest.source_identity_sha256 === snapshot.source_identity_sha256,
    "canonical input identity changed; resume refused, start an explicit new run",
    "CANONICAL_INPUT_CHANGED"
  );

  let startIndex = 0;
  const reusedStages = [];
  for (const stage of STAGES) {
    const validation = await receiptValidation(
      runDir,
      stage,
      snapshot.source_identity_sha256
    );
    if (!validation.valid) {
      startIndex = stage.index - 1;
      break;
    }
    reusedStages.push(stage.name);
    startIndex = stage.index;
  }
  if (startIndex >= STAGES.length) {
    requireCondition(false, "all stage receipts exist but run is not complete", "RUN_STATE_MISMATCH");
  }

  await cleanupFromStage(runDir, startIndex);
  manifest.state = "incomplete";
  manifest.failure = null;
  manifest.stop_reason = null;
  manifest.current_stage = STAGES[startIndex].name;
  manifest.completed_stages = reusedStages;
  manifest.updated_at = nowIso();
  manifest.resume_events = [
    ...(manifest.resume_events || []),
    {
      at: nowIso(),
      first_stage: STAGES[startIndex].name,
      reused_stages: reusedStages
    }
  ];
  await writeJsonAtomic(manifestPath, manifest);

  let commandLog = [];
  const commandsPath = path.join(runDir, "executed-commands.json");
  if (existsSync(commandsPath)) {
    commandLog = (await readJson(commandsPath)).commands || [];
  }
  const context = {
    runDir,
    sourceRoot,
    manifest,
    snapshot,
    commandLog,
    runNearestValidators
  };
  if (startIndex === 0) context.snapshot = null;
  return runStages(context, startIndex, stopAfter);
}

async function collectReceiptFailures(runDir, snapshot) {
  const failures = [];
  for (const stage of STAGES) {
    const validation = await receiptValidation(
      runDir,
      stage,
      snapshot.source_identity_sha256
    );
    if (validation.missing) failures.push(`MISSING_STAGE_RECEIPT: ${stage.name}`);
    else if (!validation.valid) {
      failures.push(
        ...validation.failures.map((failure) => `STALE_STAGE_RECEIPT ${stage.name}: ${failure}`)
      );
    }
  }
  return failures;
}

export async function verifyRunDirectory({
  runDir,
  sourceRoot = DEFAULT_SOURCE_ROOT
}) {
  sourceRoot = path.resolve(sourceRoot);
  runDir = validateRunDirectoryLocation(runDir, sourceRoot);
  const failures = [];
  let manifest;
  let snapshot;
  try {
    manifest = await readJson(path.join(runDir, "run-manifest.json"));
  } catch (error) {
    return { passed: false, failures: [`RUN_MANIFEST_FAILURE: ${error.message}`] };
  }
  try {
    snapshot = await inspectCanonicalSources(sourceRoot);
  } catch (error) {
    return { passed: false, failures: [`CANONICAL_SOURCE_FAILURE: ${error.message}`] };
  }
  if (manifest.source_identity_sha256 !== snapshot.source_identity_sha256) {
    failures.push("CORRUPTED_SOURCE_FINGERPRINT: run manifest does not match canonical inputs");
  }
  try {
    const sourceFingerprints = await readJson(
      path.join(runDir, "source-fingerprints.json")
    );
    if (
      sourceFingerprints.source_identity_sha256 !== snapshot.source_identity_sha256 ||
      jsonHash(sourceFingerprints.source_identity) !== snapshot.source_identity_sha256
    ) {
      failures.push(
        "CORRUPTED_SOURCE_FINGERPRINT: source-fingerprints.json does not match canonical inputs"
      );
    }
  } catch (error) {
    failures.push(`CORRUPTED_SOURCE_FINGERPRINT: ${error.message}`);
  }
  failures.push(...(await collectReceiptFailures(runDir, snapshot)));

  const context = {
    runDir,
    sourceRoot,
    manifest,
    snapshot,
    commandLog: [],
    runNearestValidators: false
  };
  try {
    await assertWorkspaceMatchesSnapshot(context);
  } catch (error) {
    failures.push(error.message);
  }

  const outputPath = path.join(runDir, "output", "private-previsualization-timeline.mp4");
  let media = null;
  if (!existsSync(outputPath)) {
    failures.push("OUTPUT_MISSING: private-previsualization-timeline.mp4");
  } else {
    try {
      media = await probeMedia(context, outputPath, { record: false });
      failures.push(...mediaFailures(media));
    } catch (error) {
      failures.push(`OUTPUT_PROBE_FAILURE: ${error.message}`);
    }
  }

  let finalReceipt = null;
  try {
    finalReceipt = await readJson(path.join(runDir, "run-receipt.json"));
    if (
      finalReceipt.schemaVersion !== RUN_RECEIPT_SCHEMA_VERSION ||
      finalReceipt.artifact_id !== PIPELINE_ARTIFACT_ID ||
      finalReceipt.state !== "complete"
    ) {
      failures.push("FINAL_RECEIPT_CONTRACT_MISMATCH");
    }
    if (finalReceipt.source_identity_sha256 !== snapshot.source_identity_sha256) {
      failures.push("CORRUPTED_SOURCE_FINGERPRINT: final receipt source identity changed");
    }
    if (
      finalReceipt.watermark?.text !== WATERMARK_TEXT ||
      finalReceipt.watermark?.renderer_marker_present !== true ||
      finalReceipt.watermark?.baked_frame_identity_preserved !== true
    ) {
      failures.push("MISSING_WATERMARK: final receipt watermark proof missing");
    }
    if (media && finalReceipt.output?.sha256 !== media.sha256) {
      failures.push("OUTPUT_HASH_MEDIA_MISMATCH: final receipt SHA256 differs from current output");
    }
    if (
      media &&
      (finalReceipt.output?.duration_seconds !== media.duration_seconds ||
        finalReceipt.output?.audio_stream_count !== media.audio_stream_count ||
        finalReceipt.output?.width !== media.width ||
        finalReceipt.output?.height !== media.height)
    ) {
      failures.push("OUTPUT_HASH_MEDIA_MISMATCH: final receipt media metadata differs");
    }
  } catch (error) {
    failures.push(`FINAL_RECEIPT_FAILURE: ${error.message}`);
  }

  return {
    passed: failures.length === 0,
    failures,
    run_id: manifest.run_id,
    source_identity_sha256: snapshot.source_identity_sha256,
    output: media,
    watermark: finalReceipt?.watermark || null,
    boundaries: finalReceipt?.boundaries || null
  };
}

export async function dryRun({
  runDir = null,
  sourceRoot = DEFAULT_SOURCE_ROOT,
  runNearestValidators = true
} = {}) {
  sourceRoot = path.resolve(sourceRoot);
  if (runDir) validateRunDirectoryLocation(runDir, sourceRoot);
  const context = {
    runDir: null,
    sourceRoot,
    manifest: null,
    snapshot: null,
    commandLog: [],
    runNearestValidators
  };
  const snapshot = await inspectCanonicalSources(sourceRoot, {
    runNearestValidators,
    context
  });
  return {
    schemaVersion: "fff.privatePipelineDryRun.v1",
    artifact_id: PIPELINE_ARTIFACT_ID,
    read_only: true,
    source_root: sourceRoot,
    proposed_run_directory: runDir ? path.resolve(runDir) : null,
    source_identity_sha256: snapshot.source_identity_sha256,
    stages: STAGES.map((stage) => stage.name),
    exact_contract: {
      beats: snapshot.timeline.beats.length,
      shots: snapshot.timeline.shots.length,
      duration_seconds: snapshot.timeline.duration_seconds,
      narration_segments: snapshot.timeline.narration.length,
      subtitle_cues: snapshot.timeline.subtitles.length,
      canonical_frames: snapshot.frame_records.length,
      source_images: snapshot.source_image_records.length,
      watermark: WATERMARK_TEXT,
      silent: true
    },
    nearest_validators: snapshot.nearest_validators,
    boundaries: snapshot.boundaries
  };
}

export async function validateDurablePipelineResult(
  resultPath = DURABLE_RESULT_PATH,
  sourceRoot = DEFAULT_SOURCE_ROOT
) {
  sourceRoot = path.resolve(sourceRoot);
  const before = await fileRecord(absoluteFrom(sourceRoot, resultPath), sourceRoot);
  const [result, contract, snapshot] = await Promise.all([
    readJson(absoluteFrom(sourceRoot, resultPath)),
    readJson(absoluteFrom(sourceRoot, CONTRACT_PATH)),
    inspectCanonicalSources(sourceRoot)
  ]);
  const failures = [];
  const check = (condition, message) => {
    if (!condition) failures.push(message);
  };
  check(result.schemaVersion === DURABLE_RESULT_SCHEMA_VERSION, "durable result schema mismatch");
  check(result.artifact_id === PIPELINE_ARTIFACT_ID, "durable result artifact mismatch");
  check(result.passed === true && Array.isArray(result.failures) && result.failures.length === 0, "durable result not passing");
  check(contract.schemaVersion === PIPELINE_SCHEMA_VERSION, "pipeline contract schema mismatch");
  check(contract.artifact_id === PIPELINE_ARTIFACT_ID, "pipeline contract artifact mismatch");
  check(
    stableJson(contract.stages) === stableJson(STAGES.map((stage) => stage.name)),
    "pipeline stage contract mismatch"
  );
  check(result.golden_run?.source_identity_sha256 === snapshot.source_identity_sha256, "golden source identity stale");
  check(result.golden_run?.output?.duration_seconds >= 179.95 && result.golden_run?.output?.duration_seconds <= 180.05, "golden duration mismatch");
  check(result.golden_run?.output?.audio_stream_count === 0, "golden output is not silent");
  check(result.golden_run?.output?.codec_name === "h264", "golden output codec mismatch");
  check(result.golden_run?.output?.width === 960 && result.golden_run?.output?.height === 540, "golden output size mismatch");
  check(result.golden_run?.watermark?.text === WATERMARK_TEXT, "golden watermark mismatch");
  check(result.golden_run?.exact_contract?.beats === 6, "golden Beat count mismatch");
  check(result.golden_run?.exact_contract?.shots === 19, "golden shot count mismatch");
  check(result.golden_run?.exact_contract?.narration_segments === 6, "golden narration count mismatch");
  check(result.golden_run?.exact_contract?.subtitle_cues === 20, "golden subtitle count mismatch");
  check(result.interruption_resume?.passed === true, "interruption/resume evidence missing");
  check(
    Array.isArray(result.interruption_resume?.reused_stages) &&
      result.interruption_resume.reused_stages.length >= 4,
    "resume reuse evidence incomplete"
  );
  check(result.fail_closed?.required_fixture_count === 8 && result.fail_closed?.passed_fixture_count === 8, "fail-closed fixture evidence incomplete");
  check(result.boundaries?.public_release === false, "public release boundary changed");
  check(result.boundaries?.rights_clearance === false, "rights boundary changed");
  const after = await fileRecord(absoluteFrom(sourceRoot, resultPath), sourceRoot);
  check(before.sha256 === after.sha256 && before.byte_size === after.byte_size, "read-only durable validation mutated result");
  if (failures.length > 0) {
    throw new Error(`Resumable private pipeline validation failed: ${failures.join("; ")}`);
  }
  console.log(`Resumable private pipeline read-only validation passed: ${resultPath}`);
  return { passed: true, failures: [] };
}

export async function createDurableResultFromRuns({
  goldenRunDir,
  resumeRunDir,
  sourceRoot = DEFAULT_SOURCE_ROOT,
  failClosedEvidence
}) {
  const goldenVerification = await verifyRunDirectory({
    runDir: goldenRunDir,
    sourceRoot
  });
  const resumeVerification = await verifyRunDirectory({
    runDir: resumeRunDir,
    sourceRoot
  });
  requireCondition(goldenVerification.passed, goldenVerification.failures.join("; "));
  requireCondition(resumeVerification.passed, resumeVerification.failures.join("; "));
  const goldenReceipt = await readJson(path.join(goldenRunDir, "run-receipt.json"));
  const resumeReceipt = await readJson(path.join(resumeRunDir, "run-receipt.json"));
  const latestResume = resumeReceipt.resume_events.at(-1);
  return {
    schemaVersion: DURABLE_RESULT_SCHEMA_VERSION,
    artifact_id: PIPELINE_ARTIFACT_ID,
    generated_at: nowIso(),
    passed: true,
    failures: [],
    golden_run: {
      run_id: goldenReceipt.run_id,
      source_identity_sha256: goldenReceipt.source_identity_sha256,
      protected_package_fingerprints:
        goldenReceipt.source_fingerprints.protected_package_fingerprints,
      exact_contract: goldenReceipt.exact_contract,
      output: goldenReceipt.output,
      watermark: goldenReceipt.watermark,
      toolchain: goldenReceipt.toolchain,
      stage_count: STAGES.length,
      command_count: goldenReceipt.executed_commands.command_count,
      mp4_byte_identity_policy: goldenReceipt.mp4_byte_identity_policy
    },
    interruption_resume: {
      passed: true,
      run_id: resumeReceipt.run_id,
      first_resumed_stage: latestResume?.first_stage || null,
      reused_stages: latestResume?.reused_stages || [],
      completed_output_sha256: resumeReceipt.output.sha256
    },
    fail_closed: failClosedEvidence,
    negative_guard_handling: {
      preserved_as_source_metadata: true,
      rewritten: false,
      promoted_to_primary_cli_output: false,
      metadata_sha256:
        goldenReceipt.source_fingerprints.negative_guard_metadata_sha256
    },
    boundaries: {
      local_only: true,
      reference_only: true,
      silent: true,
      material_refinement: false,
      source_acquisition: false,
      voice_generation: false,
      media_generation: false,
      asset_selection: false,
      rights_clearance: false,
      production_approval: false,
      public_release: false,
      final_canon_decision: false
    }
  };
}

export async function runDurablePipelineValidatorCommand({
  command,
  inputPath,
  outputPath
}) {
  requireCondition(
    command === "validate-resumable-private-pipeline",
    `unsupported durable pipeline command ${command}`
  );
  requireCondition(!outputPath, "durable pipeline validation is read-only and does not accept outputPath");
  return validateDurablePipelineResult(inputPath || DURABLE_RESULT_PATH);
}

function parseCli(argv) {
  const command = argv[0];
  const options = {
    runDir: null,
    sourceRoot: DEFAULT_SOURCE_ROOT,
    stopAfter: null,
    runId: null,
    json: false
  };
  for (let index = 1; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--json") {
      options.json = true;
      continue;
    }
    const keyMap = {
      "--run-dir": "runDir",
      "--source-root": "sourceRoot",
      "--stop-after": "stopAfter",
      "--run-id": "runId"
    };
    const key = keyMap[token];
    requireCondition(key, `unknown option ${token}`, "CLI_USAGE");
    index += 1;
    requireCondition(index < argv.length, `missing value for ${token}`, "CLI_USAGE");
    options[key] = argv[index];
  }
  return { command, options };
}

function printHelp() {
  console.log(`Fast Fiction Factory resumable private pipeline

Usage:
  node tools/fff-private-pipeline.mjs dry-run [--run-dir <external-path>] [--source-root <repo>]
  node tools/fff-private-pipeline.mjs build --run-dir <external-path> [--run-id <id>] [--stop-after <stage>]
  node tools/fff-private-pipeline.mjs status --run-dir <external-path>
  node tools/fff-private-pipeline.mjs resume --run-dir <external-path> [--stop-after <stage>]
  node tools/fff-private-pipeline.mjs verify --run-dir <external-path>

Stages:
${STAGES.map((stage) => `  ${stage.index}. ${stage.name}`).join("\n")}

All run directories must be outside the repository. dry-run, status, and verify are read-only.`);
}

async function main() {
  const { command, options } = parseCli(process.argv.slice(2));
  if (!command || ["help", "--help", "-h"].includes(command)) {
    printHelp();
    return;
  }
  let result;
  if (command === "dry-run") {
    result = await dryRun(options);
  } else if (command === "build") {
    result = await buildRun(options);
  } else if (command === "status") {
    result = await statusRun(options);
  } else if (command === "resume") {
    result = await resumeRun(options);
  } else if (command === "verify") {
    result = await verifyRunDirectory(options);
    if (!result.passed) {
      console.error(JSON.stringify(result, null, 2));
      process.exitCode = 1;
      return;
    }
  } else {
    requireCondition(false, `unknown command ${command}`, "CLI_USAGE");
  }
  console.log(JSON.stringify(result, null, 2));
}

if (path.resolve(process.argv[1] || "") === path.resolve(TOOL_PATH)) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });
}
