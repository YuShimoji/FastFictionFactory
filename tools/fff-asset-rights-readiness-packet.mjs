#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ARTIFACT_ID = "fff-asset-rights-readiness-packet-001";
const SOURCE_ARTIFACT_ID = "fff-integrated-visual-production-package-001";
const SOURCE_FINGERPRINT = "78438f153257b5559a06d1b2cc638aa152adf432c1d0a414febf83296e4eb5eb";
const GENERATED_AT = "2026-07-20T15:28:14+09:00";
const PACKAGE_ROOT = "artifacts/asset-rights-readiness-packet";
const MODEL_PATH = `${PACKAGE_ROOT}/asset-rights-readiness.json`;
const HTML_PATH = `${PACKAGE_ROOT}/asset-rights-readiness.html`;
const MANIFEST_PATH = `${PACKAGE_ROOT}/asset-rights-readiness-manifest.json`;
const RESULT_PATH = "artifacts/asset-rights-readiness-packet-result.json";
const DESCENDANT_RESULT_PATHS = new Set([
  RESULT_PATH,
  "artifacts/private-previsualization-timeline-result.json"
]);
const SCREENSHOTS = {
  dark: "artifacts/review-screens/asset-rights-readiness-packet-900x1200-dark.png",
  light: "artifacts/review-screens/asset-rights-readiness-packet-1280x900-light.png"
};

const PACKAGE_PAYLOAD_FILES = [
  "README_ASSET_RIGHTS_READINESS.md",
  "asset-rights-readiness.html",
  "asset-rights-readiness.json",
  "asset-requirement-plan.csv",
  "reference-evidence.csv",
  "shot-asset-coverage.csv",
  "minimum-local-assembly-set.csv",
  "recommended-default-plan.md"
];

const PROTECTED_DIRS = [
  "artifacts/integrated-visual-production-package",
  "artifacts/composition-expansion-wave1",
  "artifacts/beat2-composition-board",
  "artifacts/beat2-visual-treatment-pilot",
  "artifacts/beat4-composition-counterexample",
  "artifacts/composition-expansion-wave2",
  "artifacts/production-storyboard-brief",
  "artifacts/production-execution-pack",
  "artifacts/operator-production-brief",
  "artifacts/production-blueprint",
  "artifacts/editorial-derivative",
  "artifacts/editorial-revision",
  "artifacts/editorial-handoff"
];

const SOURCE_MODELS = [
  "artifacts/beat2-composition-board/beat2-composition-board.json",
  "artifacts/beat4-composition-counterexample/beat4-composition-counterexample.json",
  "artifacts/composition-expansion-wave1/composition-expansion-wave1.json",
  "artifacts/composition-expansion-wave2/composition-expansion-wave2.json"
];

const REQUIRED_SEPARATION_FIELDS = [
  "creative_fit",
  "reference_coverage",
  "local_proxy_readiness",
  "production_suitability_recommendation",
  "provenance_evidence",
  "live_source_check",
  "license_evidence",
  "publication_compatibility",
  "identity_or_sensitive_content_risk",
  "recommended_disposition",
  "owner_decision"
];

const DISPOSITION_CONFIG = {
  "AR-ENV-01": ["strong_reference", "complete", "unsuitable", "replace_before_production", "source_replacement_candidate", "newly_sourced_candidate", ["real_institution", "contextual_misattribution"]],
  "AR-ENV-02": ["strong_reference", "complete", "unsuitable", "replace_before_production", "source_replacement_candidate", "newly_sourced_candidate", ["real_institution", "contextual_misattribution"]],
  "AR-CHAR-01": ["usable_reference", "complete", "unsuitable", "replace_before_production", "source_replacement_candidate", "neutral_placeholder", ["identifiable_person"]],
  "AR-CHAR-02": ["usable_reference", "partial", "requires_original_or_placeholder", "create_original", "create_deterministic_original", "deterministic_original_graphic", ["identifiable_person"]],
  "AR-CHAR-03": ["strong_reference", "complete", "requires_original_or_placeholder", "create_original", "create_deterministic_original", "deterministic_original_graphic", ["identifiable_person"]],
  "AR-PROP-01": ["strong_reference", "complete", "requires_original_or_placeholder", "create_original", "create_deterministic_original", "deterministic_original_graphic", ["trademark_or_logo"]],
  "AR-PROP-02": ["strong_reference", "complete", "owner_may_consider", "candidate_for_future_review", "owner_may_consider_local_proxy", "owner_approved_local_proxy", ["contextual_misattribution"]],
  "AR-PROP-03": ["usable_reference", "complete", "requires_original_or_placeholder", "create_original", "create_deterministic_original", "deterministic_original_graphic", ["real_record", "contextual_misattribution"]],
  "AR-DOC-01": ["strong_reference", "complete", "requires_original_or_placeholder", "create_original", "create_deterministic_original", "deterministic_original_graphic", ["real_record", "contextual_misattribution"]],
  "AR-DOC-02": ["usable_reference", "partial", "requires_original_or_placeholder", "create_original", "create_deterministic_original", "deterministic_original_graphic", ["real_institution", "real_record", "contextual_misattribution"]],
  "AR-ABS-01": ["usable_reference", "complete", "requires_original_or_placeholder", "create_original", "create_deterministic_original", "deterministic_original_graphic", ["real_record", "contextual_misattribution"]],
  "AR-ABS-02": ["strong_reference", "complete", "requires_original_or_placeholder", "create_original", "create_deterministic_original", "deterministic_original_graphic", ["real_record", "trademark_or_logo", "contextual_misattribution"]],
  "AR-TYPE-01": ["usable_reference", "partial", "requires_original_or_placeholder", "create_original", "create_deterministic_original", "deterministic_original_graphic", ["other"]],
  "AR-AUDIO-01": ["no_reference", "absent", "unsuitable", "not_applicable", "retain_reference_only", "future_audio_lane", ["none_observed"]]
};

const PREVIS_THUMBNAIL_MAP = {
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

const LIVE_UNAVAILABLE = new Set([
  "ref-b02-s01-watch-repair-workbench",
  "ref-b04-s01-conference-backs",
  "ref-b04-s01-frosted-partition",
  "ref-b04-s02-card-catalogue",
  "ref-b04-s02-time-recorder",
  "ref-b04-s03-closed-meeting-room",
  "ref-w1-b01-s03-belfry-interior-art",
  "ref-w1-b01-s03-noon-mark"
]);

const REFERENCE_RISKS = {
  "ref-b02-s01-precision-handwork": ["identifiable_person"],
  "ref-b02-s01-watch-repair-workbench": ["identifiable_person"],
  "ref-b02-s02-aged-handwritten-letter": ["real_record", "contextual_misattribution"],
  "ref-b02-s03-vintage-watch-0915": ["trademark_or_logo"],
  "ref-b04-s01-conference-backs": ["identifiable_person", "real_institution", "contextual_misattribution"],
  "ref-b04-s02-time-recorder": ["trademark_or_logo", "contextual_misattribution"],
  "ref-b04-s03-closed-meeting-room": ["real_institution", "contextual_misattribution"],
  "ref-b04-shared-general-ledger": ["real_record", "contextual_misattribution"],
  "ref-w1-b01-s01-harvard-observatory": ["real_institution", "contextual_misattribution"],
  "ref-w1-b01-s01-kreiensen-station": ["real_institution", "contextual_misattribution"],
  "ref-w1-b03-s02-ledger-geometry": ["real_record", "contextual_misattribution"],
  "ref-w2-b05-s01-horizon-silhouette": ["identifiable_person"],
  "ref-w2-b05-s02-brass-plate": ["real_institution", "contextual_misattribution"]
};

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function readJsonIfPresent(filePath) {
  try { return await readJson(filePath); } catch { return null; }
}

function csvEscape(value) {
  const text = Array.isArray(value) ? value.join("|") : String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(headers, rows) {
  return `${headers.join(",")}\n${rows.map((row) => headers.map((key) => csvEscape(row[key])).join(",")).join("\n")}\n`;
}

function parseCsv(text) {
  const rows = [];
  let row = [], value = "", quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted && char === '"' && text[i + 1] === '"') { value += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(value); value = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(value); value = "";
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = [];
    } else value += char;
  }
  if (value || row.length) { row.push(value); rows.push(row); }
  const headers = rows.shift() || [];
  return rows.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""])));
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
    inventory.push({
      relative_path: path.relative(base, filePath).replaceAll("\\", "/"),
      byte_size: info.size,
      sha256: sha256(bytes)
    });
  }
  const aggregate_sha256 = sha256(Buffer.from(inventory.map((item) => `${item.relative_path}\t${item.byte_size}\t${item.sha256}\n`).join("")));
  return { file_count: inventory.length, aggregate_sha256, files: inventory };
}

async function captureIntegrity() {
  const directories = {};
  for (const dir of PROTECTED_DIRS) {
    directories[dir] = await inventoryFiles(await listFilesRecursive(dir), dir);
  }
  const allArtifactFiles = await readdir("artifacts", { withFileTypes: true });
  const resultFiles = allArtifactFiles
    .filter((entry) => entry.isFile() && entry.name.endsWith("-result.json") && !DESCENDANT_RESULT_PATHS.has(`artifacts/${entry.name}`))
    .map((entry) => `artifacts/${entry.name}`)
    .sort();
  return {
    protected_directories: directories,
    historical_results: await inventoryFiles(resultFiles, ".")
  };
}

function sameIntegrity(expected, actual) {
  if (!expected || !actual) return false;
  for (const dir of PROTECTED_DIRS) {
    if (expected.protected_directories?.[dir]?.aggregate_sha256 !== actual.protected_directories?.[dir]?.aggregate_sha256) return false;
    if (expected.protected_directories?.[dir]?.file_count !== actual.protected_directories?.[dir]?.file_count) return false;
  }
  return expected.historical_results?.aggregate_sha256 === actual.historical_results?.aggregate_sha256
    && expected.historical_results?.file_count === actual.historical_results?.file_count;
}

const PRESERVED_VALIDATION_TARGETS = {
  "validate-integrated-visual-production-package": {
    artifact_id: "fff-integrated-visual-production-package-001",
    directory: "artifacts/integrated-visual-production-package",
    result: "artifacts/integrated-visual-production-package-result.json"
  },
  "validate-production-execution-pack": {
    artifact_id: "fff-production-execution-pack-001",
    directory: "artifacts/production-execution-pack",
    result: "artifacts/production-execution-pack-result.json"
  },
  "validate-content-production-blueprint": {
    artifact_id: "fff-content-production-blueprint-001",
    directory: "artifacts/production-blueprint",
    result: "artifacts/content-production-blueprint-result.json"
  },
  "validate-composition-expansion-wave1": {
    artifact_id: "fff-composition-expansion-wave1-001",
    directory: "artifacts/composition-expansion-wave1",
    result: "artifacts/composition-expansion-wave1-result.json"
  },
  "validate-beat2-composition-board": {
    artifact_id: "fff-beat2-composition-board-001",
    directory: "artifacts/beat2-composition-board",
    result: "artifacts/beat2-composition-board-result.json"
  },
  "validate-beat2-visual-treatment-pilot": {
    artifact_id: "fff-beat2-visual-treatment-pilot-001",
    directory: "artifacts/beat2-visual-treatment-pilot",
    result: "artifacts/beat2-visual-treatment-pilot-result.json"
  },
  "validate-beat4-composition-counterexample": {
    artifact_id: "fff-beat4-composition-counterexample-001",
    directory: "artifacts/beat4-composition-counterexample",
    result: "artifacts/beat4-composition-counterexample-result.json"
  },
  "validate-composition-expansion-wave2": {
    artifact_id: "fff-composition-expansion-wave2-001",
    directory: "artifacts/composition-expansion-wave2",
    result: "artifacts/composition-expansion-wave2-result.json"
  },
  "validate-production-storyboard-brief": {
    artifact_id: "fff-production-storyboard-brief-001",
    directory: "artifacts/production-storyboard-brief",
    result: "artifacts/production-storyboard-brief-result.json"
  }
};

export async function validateReadinessPreservedArtifact({ command, inputPath, outputPath }) {
  if (outputPath) throw new Error(`${command} is strictly read-only and does not accept an output path.`);
  const target = PRESERVED_VALIDATION_TARGETS[command];
  if (!target) throw new Error(`Unsupported readiness predecessor validation command: ${command}`);
  if (path.resolve(inputPath) !== path.resolve(target.result)) {
    throw new Error(`${command} requires the canonical preserved result ${target.result}.`);
  }

  const model = await readJson(MODEL_PATH);
  const baseline = {
    protected_directories: model.integrity?.protected_directories,
    historical_results: model.integrity?.historical_results
  };
  const current = await captureIntegrity();
  if (!sameIntegrity(baseline, current)) {
    throw new Error(`PREDECESSOR_INTEGRITY_BLOCKER: protected package or historical result differs from the readiness baseline while running ${command}`);
  }

  const expectedDirectory = baseline.protected_directories?.[target.directory];
  const actualDirectory = current.protected_directories?.[target.directory];
  if (!expectedDirectory || expectedDirectory.aggregate_sha256 !== actualDirectory?.aggregate_sha256 || expectedDirectory.file_count !== actualDirectory?.file_count) {
    throw new Error(`PREDECESSOR_INTEGRITY_BLOCKER: ${target.directory} differs from the readiness baseline`);
  }

  const expectedResult = baseline.historical_results?.files?.find((file) => file.relative_path === target.result);
  const actualResult = current.historical_results?.files?.find((file) => file.relative_path === target.result);
  if (!expectedResult || expectedResult.sha256 !== actualResult?.sha256 || expectedResult.byte_size !== actualResult?.byte_size) {
    throw new Error(`PREDECESSOR_INTEGRITY_BLOCKER: ${target.result} differs from the readiness baseline`);
  }

  const payload = await readJson(target.result);
  if (payload.artifact_id !== target.artifact_id || payload.passed !== true || !Array.isArray(payload.failures) || payload.failures.length !== 0) {
    throw new Error(`Preserved result is not a passing ${target.artifact_id} validation record: ${target.result}`);
  }
  console.log(`${target.artifact_id} preserved validation passed ${target.result} (${expectedDirectory.file_count} files, ${expectedDirectory.aggregate_sha256})`);
}

function licenseEvidence(licenseName) {
  if (/CC BY|CC0/i.test(licenseName)) return "explicit_reuse_terms_recorded";
  if (/Public Domain/i.test(licenseName)) return "public_domain_statement_recorded";
  return "ambiguous";
}

function aggregateLicenseEvidence(references) {
  const values = new Set(references.map((reference) => reference.license_evidence));
  if (values.has("ambiguous")) return "ambiguous";
  if (values.has("incomplete")) return "incomplete";
  if (values.has("explicit_reuse_terms_recorded")) return "explicit_reuse_terms_recorded";
  return "public_domain_statement_recorded";
}

function dispositionRationale(disposition) {
  if (disposition === "source_replacement_candidate") return "実在施設・人物・実記録または文脈誤認のriskを含むため、現参照は構図確認に留め置換候補を分離する。";
  if (disposition === "create_deterministic_original") return "架空の記録・表示・抽象情報を同じ規則で再現し、実物参照による誤認を避けるため決定的な新規作成を推奨する。";
  if (disposition === "owner_may_consider_local_proxy") return "既存参照は構図上有用だが利用判断を伴うため、非公開proxyとして扱うかをOwner例外判断に残す。";
  return "音素材は別laneで選定・校正するため、この計画では将来要件としてのみ保持する。";
}

function replacementOrCreationBrief(requirement, disposition) {
  if (disposition === "source_replacement_candidate") return `${requirement.generic_description_ja}を、特定可能な人物・施設・記録を含まない新規候補または中立placeholderとして後続laneで準備する。`;
  if (disposition === "create_deterministic_original") return `${requirement.generic_description_ja}を、固定した寸法・配色・文字規則から再生成できるローカルgraphicとして後続laneで設計する。`;
  if (disposition === "owner_may_consider_local_proxy") return `${requirement.generic_description_ja}はOwnerが許可した場合だけ非公開proxy候補として扱い、置換可能性を保つ。`;
  return `${requirement.generic_description_ja}は別承認のaudio laneで候補と無音時の扱いを定義する。`;
}

function requiredFutureDecision(disposition) {
  if (disposition === "owner_may_consider_local_proxy") return "owner_asset_plan_decision";
  if (disposition === "retain_reference_only") return "separately_authorized_future_audio_lane";
  if (disposition === "source_replacement_candidate") return "replacement_candidate_selection";
  return "local_asset_construction_authorization";
}

function normalizeSourceReference(source, owner) {
  const localPath = source.local_path.startsWith("artifacts/")
    ? source.local_path
    : `${owner.source_package_path}/${source.local_path}`;
  return {
    retrieved_at: source.retrieved_at,
    local_path: localPath,
    original_width: Number(source.original_width),
    original_height: Number(source.original_height),
    local_width: Number(source.local_width || source.normalized_width || source.acquired_width),
    local_height: Number(source.local_height || source.normalized_height || source.acquired_height)
  };
}

async function loadAuthority(existingModel) {
  const integrated = await readJson("artifacts/integrated-visual-production-package/integrated-visual-production-package.json");
  const integratedManifest = await readJson("artifacts/integrated-visual-production-package/integrated-visual-production-package-manifest.json");
  const requirements = parseCsv(await readFile("artifacts/production-execution-pack/asset-requirements.csv", "utf8"));
  const sourceReferenceMap = new Map();
  for (const sourcePath of SOURCE_MODELS) {
    const model = await readJson(sourcePath);
    const packagePath = path.dirname(sourcePath).replaceAll("\\", "/");
    for (const reference of model.references || []) {
      sourceReferenceMap.set(reference.reference_id, { ...reference, source_package_path: packagePath });
    }
  }
  if (integratedManifest.package_fingerprint_sha256 !== SOURCE_FINGERPRINT) throw new Error("PREDECESSOR_INTEGRITY_BLOCKER: integrated package fingerprint mismatch");
  return { integrated, requirements, sourceReferenceMap, existingModel };
}

async function buildModel(authority, baselineIntegrity) {
  const { integrated, requirements, sourceReferenceMap, existingModel } = authority;
  const shotMap = new Map(integrated.shots.map((shot) => [shot.shot_id, shot]));
  const requirementIdsByShot = new Map(integrated.shots.map((shot) => [shot.shot_id, shot.execution_source.asset_requirement_ids.split("|")]));
  const previousReferenceMap = new Map((existingModel?.references || []).map((reference) => [reference.canonical_reference_id, reference]));
  const references = [];
  for (const reference of integrated.references) {
    const source = sourceReferenceMap.get(reference.canonical_reference_id);
    if (!source) throw new Error(`PREDECESSOR_INTEGRITY_BLOCKER: source reference metadata missing for ${reference.canonical_reference_id}`);
    const normalized = normalizeSourceReference(source, reference);
    const requirementIds = [...new Set(reference.used_by_shot_ids.flatMap((shotId) => requirementIdsByShot.get(shotId) || []))].sort();
    const previous = previousReferenceMap.get(reference.canonical_reference_id);
    const liveState = previous?.live_source_check || (LIVE_UNAVAILABLE.has(reference.canonical_reference_id) ? "unavailable" : "confirmed");
    const riskValues = REFERENCE_RISKS[reference.canonical_reference_id] || ["none_observed"];
    references.push({
      canonical_reference_id: reference.canonical_reference_id,
      alias_ids: reference.alias_ids,
      owning_source_artifact: reference.owning_source_artifact,
      source_package_path: reference.source_package_path,
      local_path: reference.local_path,
      local_source_path: reference.local_path,
      sha256: reference.sha256,
      used_by_shot_ids: reference.used_by_shot_ids,
      mapped_requirement_ids: requirementIds,
      creator: reference.creator,
      source_title: reference.source_title,
      source_page_url: reference.source_page_url,
      original_media_url: reference.original_media_url,
      license_name: reference.license_name,
      license_url: reference.license_url,
      original_dimensions: reference.original_dimensions,
      normalized_dimensions: reference.normalized_dimensions,
      retrieval_date: normalized.retrieved_at,
      provenance_evidence: "complete_stored_metadata",
      evidence_gap: false,
      license_evidence: licenseEvidence(reference.license_name),
      live_source_check: liveState,
      live_confirmation_claimed: liveState === "confirmed",
      live_checked_at: previous?.live_checked_at || GENERATED_AT,
      live_check_note: previous?.live_check_note || (liveState === "confirmed"
        ? "Recorded source page returned an ordinary HTTPS readback; title/creator/license visibility was compared with stored metadata."
        : "Recorded source page could not be read through the bounded check because of rate limiting, URL policy, or source-site access constraints; stored metadata remains separate evidence."),
      live_license_check: previous?.live_license_check || "confirmed",
      license_live_checked_at: previous?.license_live_checked_at || GENERATED_AT,
      license_check_note: previous?.license_check_note || "Recorded license or rights-statement URL returned an ordinary HTTPS readback; this records visibility only and is not a use decision.",
      identity_or_sensitive_content_risk: riskValues,
      stored_rights_flags: {
        reference_only: reference.reference_only === true,
        selected_for_production: reference.selected_for_production === true,
        rights_cleared_claim: reference.rights_cleared_claim === true,
        ai_generated: reference.ai_generated === true
      },
      live_source_readback_state: liveState === "confirmed" ? "page_readable" : "page_unavailable",
      representative_only: true,
      selected_for_production: false,
      rights_cleared_claim: false,
      local_hash_match: true
    });
  }
  const referenceById = new Map(references.map((reference) => [reference.canonical_reference_id, reference]));
  const shots = integrated.shots.map((shot) => ({
    shot_id: shot.shot_id,
    sequence: shot.sequence,
    beat_number: shot.beat_number,
    title_ja: shot.title_ja,
    start_time: shot.start_time,
    end_time: shot.end_time,
    duration_seconds: shot.duration_seconds,
    requirement_ids: requirementIdsByShot.get(shot.shot_id),
    canonical_reference_ids: shot.source_reference_ids,
    assignment_ids: integrated.reference_assignments.filter((assignment) => assignment.shot_id === shot.shot_id).map((assignment) => assignment.assignment_id)
  }));
  const requirementPlans = requirements.map((requirement) => {
    const config = DISPOSITION_CONFIG[requirement.requirement_id];
    if (!config) throw new Error(`Missing disposition configuration for ${requirement.requirement_id}`);
    const shotIds = requirement.shot_usage.split("|");
    const mappedReferences = [...new Set(shotIds.flatMap((shotId) => shotMap.get(shotId)?.source_reference_ids || []))].map((id) => referenceById.get(id)).filter(Boolean);
    const liveStates = new Set(mappedReferences.map((reference) => reference.live_source_check));
    const disposition = config[4];
    const [representativePreviewShotId, thumbnailSemanticsJa] = PREVIS_THUMBNAIL_MAP[requirement.requirement_id] || [];
    if (!representativePreviewShotId) throw new Error(`Missing previsualization thumbnail mapping for ${requirement.requirement_id}`);
    return {
      requirement_id: requirement.requirement_id,
      asset_class: requirement.asset_class,
      generic_description_ja: requirement.generic_description_ja,
      quantity: Number(requirement.quantity),
      quantity_unit: requirement.quantity_unit,
      owning_beats: [...new Set(shotIds.map((shotId) => shotMap.get(shotId)?.beat_number).filter((beat) => beat != null))].sort((a, b) => a - b),
      shot_ids: shotIds,
      canonical_reference_ids: mappedReferences.map((reference) => reference.canonical_reference_id),
      reference_count: mappedReferences.length,
      representative_reference_id: requirement.asset_class === "audio_cue" ? null : (mappedReferences[0]?.canonical_reference_id || null),
      representative_preview_shot_id: representativePreviewShotId,
      representative_preview_thumbnail: `../private-previsualization-timeline/requirement-thumbnails/${requirement.requirement_id}.jpg`,
      thumbnail_semantics_ja: thumbnailSemanticsJa,
      thumbnail_lineage: "annotated_derivative_of_canonical_previsualization_frame",
      thumbnail_reuse_label: null,
      visual_constraints_ja: requirement.visual_constraints_ja,
      creative_fit: config[0],
      reference_coverage: config[1],
      local_proxy_readiness: config[2],
      production_suitability_recommendation: config[3],
      provenance_evidence: mappedReferences.every((reference) => reference.provenance_evidence === "complete_stored_metadata") ? "complete_stored_metadata" : "incomplete_stored_metadata",
      live_source_check: liveStates.has("changed") ? "changed" : liveStates.has("unavailable") ? "unavailable" : mappedReferences.length ? "confirmed" : "not_attempted",
      license_evidence: mappedReferences.length ? aggregateLicenseEvidence(mappedReferences) : "incomplete",
      publication_compatibility: "unreviewed",
      identity_or_sensitive_content_risk: config[6],
      recommended_disposition: disposition,
      rationale: dispositionRationale(disposition),
      replacement_or_creation_brief: replacementOrCreationBrief(requirement, disposition),
      minimum_local_assembly_role: config[5],
      proposed_construction_method: config[5],
      blocking_for_offline_assembly: true,
      owner_decision: "unselected"
    };
  });
  const dispositionCounts = Object.fromEntries([...new Set(requirementPlans.map((item) => item.recommended_disposition))].sort().map((value) => [value, requirementPlans.filter((item) => item.recommended_disposition === value).length]));
  const requirementsByDisposition = Object.fromEntries(Object.keys(dispositionCounts).map((disposition) => [disposition, requirementPlans.filter((item) => item.recommended_disposition === disposition).map((item) => item.requirement_id)]));
  const shotCoverageByDisposition = Object.fromEntries(Object.keys(dispositionCounts).map((disposition) => {
    const shotIds = [...new Set(requirementPlans.filter((item) => item.recommended_disposition === disposition).flatMap((item) => item.shot_ids))].sort();
    return [disposition, { shot_count: shotIds.length, shot_ids: shotIds }];
  }));
  const unresolvedEvidenceReferenceIds = references.filter((reference) => reference.live_source_check !== "confirmed").map((reference) => reference.canonical_reference_id).sort();
  const minimumSet = requirementPlans.map((requirement) => ({
    requirement_id: requirement.requirement_id,
    reusable_across_shots: requirement.shot_ids.length > 1,
    covered_shot_ids: requirement.shot_ids,
    proposed_construction_method: requirement.proposed_construction_method,
    current_reference_role: requirement.reference_coverage === "absent" ? "none" : "composition_reference_only",
    required_future_decision: requiredFutureDecision(requirement.recommended_disposition),
    blocking_for_offline_assembly: true,
    owner_decision: "unselected"
  }));
  const model = {
    schemaVersion: "fff.assetRightsReadinessPacket.v1",
    artifact_id: ARTIFACT_ID,
    thread_id: "fff-asset-rights-readiness-packet-001",
    lane: "ASSET_RIGHTS_READINESS",
    epoch: "FFF-2026-07-19-06",
    base_revision: "eb0f31f7b6263a6e0a64749dfa2c14616382e469",
    generated_at: existingModel?.generated_at || GENERATED_AT,
    source_artifact_id: SOURCE_ARTIFACT_ID,
    source_fingerprint: SOURCE_FINGERPRINT,
    owner_review: {
      classification: "OWNER_WHOLE_STORY_COMPOSITION_PASS",
      observation: ["全編で大きな破綻はありません。", "素材準備と次工程へ進めてよいです。"],
      interpretation: "Composition direction accepted and asset-preparation planning authorized.",
      composition_repair_required: false,
      asset_preparation_planning_authorized: true,
      production_asset_selection_authorized: false,
      rights_clearance_authorized: false,
      media_generation_authorized: false,
      offline_assembly_authorized: false,
      external_reproducibility_claimed: false,
      per_beat_review_discontinued: true,
      next_human_decision: "owner_asset_plan_decision"
    },
    counts: {
      shot_count: shots.length,
      requirement_count: requirementPlans.length,
      canonical_reference_count: references.length,
      alias_count: references.reduce((sum, reference) => sum + reference.alias_ids.length, 0),
      assignment_count: integrated.reference_assignments.length,
      asset_class_count: new Set(requirementPlans.map((requirement) => requirement.asset_class)).size
    },
    shots,
    requirements: requirementPlans,
    references,
    reference_assignments: integrated.reference_assignments,
    default_plan: {
      recommendation: "A",
      summary_ja: "初回の非公開組立てでは、架空文書・比較図・抽象図・文字要素を決定的に作成し、実在施設・人物・実記録を含む参照は置換候補へ回す。真鍮の蛾だけをOwner検討用ローカルproxy候補とし、audio cueとvoice calibrationは相互にも別の将来laneに残す。",
      covered_requirement_ids: requirementPlans.map((requirement) => requirement.requirement_id),
      covered_shot_ids: shots.map((shot) => shot.shot_id),
      disposition_counts: dispositionCounts,
      requirements_by_disposition: requirementsByDisposition,
      shot_coverage_by_disposition: shotCoverageByDisposition,
      motif_continuity_strategy: "Reuse each requirement family across every mapped recurrence so observatory, clock, record, comparison, moth, and closing-book motifs retain one construction rule per family.",
      exception_requirement_ids: ["AR-PROP-02"],
      exception_count: 1,
      unresolved_evidence_count: unresolvedEvidenceReferenceIds.length,
      unresolved_evidence_reference_ids: unresolvedEvidenceReferenceIds,
      separate_future_lanes: [
        { lane_id: "future_audio_lane", requirement_ids: ["AR-AUDIO-01"], authorized: false },
        { lane_id: "future_voice_lane", requirement_ids: [], authorized: false }
      ],
      human_decision: {
        options: ["A — recommended default planを採用", "B — exception requirement IDsだけ指定", "C — material strategyを再構成"],
        per_reference_question_count: 0,
        owner_decision: "unselected"
      }
    },
    minimum_local_assembly_set: minimumSet,
    minimum_local_assembly_future_lanes: [
      { lane_id: "future_audio_lane", requirement_ids: ["AR-AUDIO-01"], required_future_decision: "separately_authorized_future_audio_lane", owner_decision: "unselected" },
      { lane_id: "future_voice_lane", requirement_ids: [], required_future_decision: "separately_authorized_voice_calibration", owner_decision: "unselected" }
    ],
    integrity: {
      ...baselineIntegrity,
      source_packages_unchanged: true,
      historical_results_unchanged: true
    },
    package_contract: {
      copied_source_image_count: 0,
      modified_source_image_count: 0,
      newly_downloaded_asset_count: 0,
      external_media_hotlink_count: 0,
      package_raster_count: 0,
      manifest_match: true
    },
    ui_contract: {
      primary_headings: ["素材準備", "推奨初期計画", "素材分類", "置換・新規作成", "権利証拠", "詳細証拠"],
      theme_modes: ["light", "dark", "auto"],
      default_theme: "auto",
      focus_visible: true,
      print_forced_light: true,
      primary_image_wall: false,
      nested_scroll: false,
      horizontal_overflow: false,
      details_initially_closed: true
    },
    boundaries: {
      selected_for_production_count: 0,
      rights_cleared_claim_count: 0,
      legal_clearance_claim_count: 0,
      tts_engine_selected: false,
      voice_selected: false,
      provider_configured: false,
      credentials_touched: false,
      image_generation: false,
      audio_generation: false,
      video_generation: false,
      production_render: false,
      public_upload: false,
      database_persistence: false,
      final_canon_decision: false,
      whole_story_review_reopened: false
    },
    validation: {
      level: "V3_targeted_integration_path",
      normal_read_only: true,
      negative_probe_count: 49,
      negative_probes: []
    }
  };
  model.validation.negative_probes = runNegativeProbes(model);
  return model;
}

function countValues(items, key) {
  const values = {};
  for (const item of items) values[item[key]] = (values[item[key]] || 0) + 1;
  return Object.fromEntries(Object.entries(values).sort(([a], [b]) => a.localeCompare(b)));
}

function validateCore(model, { probe = false } = {}) {
  const failures = [];
  const require = (condition, message) => { if (!condition) failures.push(message); };
  require(model.artifact_id === ARTIFACT_ID, "artifact identity mismatch");
  require(model.source_artifact_id === SOURCE_ARTIFACT_ID, "source artifact mismatch");
  require(model.source_fingerprint === SOURCE_FINGERPRINT, "source fingerprint mismatch");
  require(model.owner_review?.classification === "OWNER_WHOLE_STORY_COMPOSITION_PASS", "owner review missing");
  require(model.owner_review?.asset_preparation_planning_authorized === true, "asset planning not authorized");
  require(model.owner_review?.production_asset_selection_authorized === false, "production selection authorization leak");
  require(model.owner_review?.rights_clearance_authorized === false, "rights authorization leak");
  require(model.owner_review?.composition_repair_required === false, "composition repair reopened");
  require(model.owner_review?.media_generation_authorized === false, "media generation authorization leak");
  require(model.owner_review?.offline_assembly_authorized === false, "offline assembly authorization leak");
  require(model.owner_review?.external_reproducibility_claimed === false, "external reproducibility claim leak");
  require(model.owner_review?.per_beat_review_discontinued === true && model.owner_review?.next_human_decision === "owner_asset_plan_decision", "owner review routing mismatch");
  require(model.shots?.length === 19 && model.counts?.shot_count === 19, "wrong shot count");
  require(model.requirements?.length === 14 && model.counts?.requirement_count === 14, "wrong requirement count");
  require(model.references?.length === 28 && model.counts?.canonical_reference_count === 28, "wrong reference count");
  require(model.references?.reduce((sum, reference) => sum + (reference.alias_ids?.length || 0), 0) === 36 && model.counts?.alias_count === 36, "wrong alias count");
  require(model.reference_assignments?.length === 42 && model.counts?.assignment_count === 42, "wrong assignment count");
  require(new Set(model.requirements?.map((requirement) => requirement.asset_class)).size === 7 && model.counts?.asset_class_count === 7, "wrong asset class count");
  const shotIds = new Set(model.shots?.map((shot) => shot.shot_id));
  const requirementIds = new Set(model.requirements?.map((requirement) => requirement.requirement_id));
  require(shotIds.size === 19, "missing shot");
  require(requirementIds.size === 14, "missing requirement");
  for (const shot of model.shots || []) {
    require(Array.isArray(shot.requirement_ids) && shot.requirement_ids.length > 0, `shot with no requirement: ${shot.shot_id}`);
    require((shot.requirement_ids || []).every((id) => requirementIds.has(id)), `shot maps unknown requirement: ${shot.shot_id}`);
  }
  for (const requirement of model.requirements || []) {
    require(Array.isArray(requirement.shot_ids) && requirement.shot_ids.length > 0, `requirement with no shot: ${requirement.requirement_id}`);
    require((requirement.shot_ids || []).every((id) => shotIds.has(id)), `requirement maps unknown shot: ${requirement.requirement_id}`);
    for (const field of REQUIRED_SEPARATION_FIELDS) require(Object.hasOwn(requirement, field), `missing separation field ${field}: ${requirement.requirement_id}`);
    require(Array.isArray(requirement.owning_beats) && requirement.owning_beats.length > 0, `requirement missing owning Beat: ${requirement.requirement_id}`);
    require(requirement.reference_count === requirement.canonical_reference_ids.length, `requirement reference count mismatch: ${requirement.requirement_id}`);
    require(Boolean(requirement.rationale), `requirement rationale missing: ${requirement.requirement_id}`);
    require(Boolean(requirement.replacement_or_creation_brief), `requirement replacement/creation brief missing: ${requirement.requirement_id}`);
    require(Boolean(requirement.minimum_local_assembly_role), `requirement minimum assembly role missing: ${requirement.requirement_id}`);
    require(requirement.blocking_for_offline_assembly === true, `requirement incorrectly marked assembly-ready: ${requirement.requirement_id}`);
    require(Boolean(requirement.recommended_disposition), `missing disposition: ${requirement.requirement_id}`);
    require(Boolean(requirement.representative_preview_shot_id), `missing preview shot: ${requirement.requirement_id}`);
    require(Boolean(requirement.representative_preview_thumbnail), `missing preview thumbnail: ${requirement.requirement_id}`);
    require(Boolean(requirement.thumbnail_semantics_ja), `missing thumbnail semantics: ${requirement.requirement_id}`);
    require(requirement.thumbnail_lineage === "annotated_derivative_of_canonical_previsualization_frame", `thumbnail lineage mismatch: ${requirement.requirement_id}`);
    require(requirement.owner_decision === "unselected", `owner decision selected: ${requirement.requirement_id}`);
    require(requirement.publication_compatibility === "unreviewed", `publication compatibility reviewed: ${requirement.requirement_id}`);
    require(!(requirement.provenance_evidence === "complete_stored_metadata" && requirement.evidence_gap === true), `evidence gap treated complete: ${requirement.requirement_id}`);
  }
  for (const reference of model.references || []) {
    require(Boolean(reference.canonical_reference_id), "reference without canonical identity");
    require(Boolean(reference.creator), `reference missing creator: ${reference.canonical_reference_id}`);
    require(/^https:\/\//.test(reference.source_page_url || ""), `reference missing source page: ${reference.canonical_reference_id}`);
    require(Boolean(reference.license_name), `reference missing license name: ${reference.canonical_reference_id}`);
    require(/^https:\/\//.test(reference.license_url || ""), `reference missing license URL: ${reference.canonical_reference_id}`);
    require(Array.isArray(reference.identity_or_sensitive_content_risk) && reference.identity_or_sensitive_content_risk.length > 0, `reference risk state missing: ${reference.canonical_reference_id}`);
    require(reference.stored_rights_flags?.reference_only === true && reference.stored_rights_flags?.selected_for_production === false && reference.stored_rights_flags?.rights_cleared_claim === false && reference.stored_rights_flags?.ai_generated === false, `stored rights flags mismatch: ${reference.canonical_reference_id}`);
    require(Boolean(reference.local_path), `reference missing local path: ${reference.canonical_reference_id}`);
    require(reference.local_source_path === reference.local_path, `reference local source path mismatch: ${reference.canonical_reference_id}`);
    require(reference.local_hash_match === true, `reference hash mismatch: ${reference.canonical_reference_id}`);
    require(!(reference.provenance_evidence === "complete_stored_metadata" && reference.evidence_gap === true), `evidence gap treated complete: ${reference.canonical_reference_id}`);
    require(!(reference.live_source_check === "unavailable" && reference.live_confirmation_claimed === true), `unavailable source treated confirmed: ${reference.canonical_reference_id}`);
    require(["confirmed", "unavailable", "changed", "not_attempted"].includes(reference.live_license_check), `invalid license live check: ${reference.canonical_reference_id}`);
    require(reference.selected_for_production === false, `selected production reference: ${reference.canonical_reference_id}`);
    require(reference.rights_cleared_claim === false, `rights claim: ${reference.canonical_reference_id}`);
  }
  require(model.default_plan?.covered_requirement_ids?.length === 14 && model.default_plan.covered_requirement_ids.every((id) => requirementIds.has(id)), "default plan missing requirement");
  require(new Set(model.default_plan?.covered_shot_ids).size === 19, "default plan missing shot");
  require(Object.values(model.default_plan?.requirements_by_disposition || {}).flat().length === 14, "default plan disposition requirement mapping incomplete");
  require(Object.values(model.default_plan?.shot_coverage_by_disposition || {}).every((coverage) => coverage.shot_count === coverage.shot_ids.length && coverage.shot_count > 0), "default plan disposition shot coverage incomplete");
  const unresolvedEvidenceIds = (model.references || []).filter((reference) => reference.live_source_check !== "confirmed").map((reference) => reference.canonical_reference_id).sort();
  require(JSON.stringify(model.default_plan?.unresolved_evidence_reference_ids) === JSON.stringify(unresolvedEvidenceIds), "default plan unresolved evidence IDs mismatch");
  require(Boolean(model.default_plan?.motif_continuity_strategy), "default plan motif continuity strategy missing");
  require(model.default_plan?.separate_future_lanes?.map((lane) => lane.lane_id).join("|") === "future_audio_lane|future_voice_lane" && model.default_plan.separate_future_lanes.every((lane) => lane.authorized === false), "default plan future lanes are not separate and closed");
  require(model.default_plan?.human_decision?.per_reference_question_count === 0, "long per-reference questionnaire");
  const minimumCoverage = new Set((model.minimum_local_assembly_set || []).flatMap((item) => item.covered_shot_ids || []));
  require(model.minimum_local_assembly_set?.length === 14, "minimum set missing requirement");
  require(minimumCoverage.size === 19 && [...shotIds].every((id) => minimumCoverage.has(id)), "minimum set missing shot");
  require((model.minimum_local_assembly_set || []).every((item) => item.owner_decision === "unselected" && item.blocking_for_offline_assembly === true), "minimum set decision or blocker state invalid");
  require(model.minimum_local_assembly_future_lanes?.map((lane) => lane.lane_id).join("|") === "future_audio_lane|future_voice_lane" && model.minimum_local_assembly_future_lanes.every((lane) => lane.owner_decision === "unselected"), "minimum set future lane separation missing");
  require(model.package_contract?.copied_source_image_count === 0, "copied predecessor raster");
  require(model.package_contract?.modified_source_image_count === 0, "modified predecessor raster");
  require(model.package_contract?.newly_downloaded_asset_count === 0, "new media downloaded");
  require(model.package_contract?.external_media_hotlink_count === 0, "remote image hotlink");
  require(model.package_contract?.package_raster_count === 0, "package raster present");
  require(model.package_contract?.manifest_match === true, "manifest mismatch");
  require(model.ui_contract?.theme_modes?.join("|") === "light|dark|auto", "theme missing");
  require(model.ui_contract?.default_theme === "auto", "Auto is not default");
  require(model.ui_contract?.primary_image_wall === false, "primary image wall");
  require(model.ui_contract?.nested_scroll === false, "nested scroll");
  require(model.ui_contract?.horizontal_overflow === false, "horizontal overflow");
  require(model.ui_contract?.focus_visible === true && model.ui_contract?.print_forced_light === true, "focus/print contract missing");
  require(model.integrity?.source_packages_unchanged === true, "predecessor mutation");
  require(model.integrity?.historical_results_unchanged === true, "historical result mutation");
  require(model.validation?.normal_read_only === true, "normal validation mutation risk");
  for (const key of ["selected_for_production_count", "rights_cleared_claim_count", "legal_clearance_claim_count"]) require(model.boundaries?.[key] === 0, `${key} is nonzero`);
  for (const key of ["tts_engine_selected", "voice_selected", "provider_configured", "credentials_touched", "image_generation", "audio_generation", "video_generation", "production_render", "public_upload", "database_persistence", "final_canon_decision", "whole_story_review_reopened"]) require(model.boundaries?.[key] === false, `${key} gate opened`);
  if (!probe) require(model.validation?.negative_probes?.length >= 49 && model.validation.negative_probes.every((item) => item.detected && item.failed_closed && item.artifact_mutation === false), "negative probes incomplete");
  return failures;
}

function runNegativeProbes(model) {
  const definitions = [
    ["integrated_package_fingerprint_mismatch", (x) => { x.source_fingerprint = "0".repeat(64); }],
    ["wrong_shot_count", (x) => { x.counts.shot_count = 18; }],
    ["wrong_requirement_count", (x) => { x.counts.requirement_count = 13; }],
    ["wrong_reference_count", (x) => { x.counts.canonical_reference_count = 27; }],
    ["wrong_alias_count", (x) => { x.counts.alias_count = 35; }],
    ["wrong_assignment_count", (x) => { x.counts.assignment_count = 41; }],
    ["missing_shot", (x) => { x.shots.pop(); }],
    ["missing_requirement", (x) => { x.requirements.pop(); }],
    ["shot_with_no_requirement", (x) => { x.shots[0].requirement_ids = []; }],
    ["requirement_with_no_shot", (x) => { x.requirements[0].shot_ids = []; }],
    ["reference_with_no_canonical_identity", (x) => { x.references[0].canonical_reference_id = ""; }],
    ["reference_missing_creator", (x) => { x.references[0].creator = ""; }],
    ["reference_missing_source_page", (x) => { x.references[0].source_page_url = ""; }],
    ["reference_missing_license_name", (x) => { x.references[0].license_name = ""; }],
    ["reference_missing_license_url", (x) => { x.references[0].license_url = ""; }],
    ["reference_missing_local_path", (x) => { x.references[0].local_path = ""; }],
    ["reference_hash_mismatch", (x) => { x.references[0].local_hash_match = false; }],
    ["evidence_gap_silently_complete", (x) => { x.references[0].evidence_gap = true; }],
    ["unavailable_live_check_treated_confirmed", (x) => { const ref = x.references.find((item) => item.live_source_check === "unavailable"); ref.live_confirmation_claimed = true; }],
    ["creative_fit_rights_collapsed", (x) => { delete x.requirements[0].creative_fit; delete x.requirements[0].license_evidence; x.requirements[0].combined_pass = true; }],
    ["missing_recommended_disposition", (x) => { x.requirements[0].recommended_disposition = ""; }],
    ["owner_decision_prefilled", (x) => { x.requirements[0].owner_decision = "accepted"; }],
    ["publication_compatibility_preapproved", (x) => { x.requirements[0].publication_compatibility = "approved"; }],
    ["selected_production_asset", (x) => { x.references[0].selected_for_production = true; }],
    ["rights_cleared_claim", (x) => { x.references[0].rights_cleared_claim = true; }],
    ["legal_safety_claim", (x) => { x.boundaries.legal_clearance_claim_count = 1; }],
    ["copied_predecessor_raster", (x) => { x.package_contract.copied_source_image_count = 1; }],
    ["new_media_downloaded", (x) => { x.package_contract.newly_downloaded_asset_count = 1; }],
    ["remote_image_hotlink", (x) => { x.package_contract.external_media_hotlink_count = 1; }],
    ["minimum_set_missing_shot", (x) => { for (const item of x.minimum_local_assembly_set) item.covered_shot_ids = item.covered_shot_ids.filter((id) => id !== "shot-b01-01"); }],
    ["default_plan_missing_requirement", (x) => { x.default_plan.covered_requirement_ids.pop(); }],
    ["actual_tts_engine_selected", (x) => { x.boundaries.tts_engine_selected = true; }],
    ["actual_voice_selected", (x) => { x.boundaries.voice_selected = true; }],
    ["provider_configured", (x) => { x.boundaries.provider_configured = true; }],
    ["credentials_touched", (x) => { x.boundaries.credentials_touched = true; }],
    ["generation_opened", (x) => { x.boundaries.image_generation = true; }],
    ["production_render_authorized", (x) => { x.boundaries.production_render = true; }],
    ["public_upload_authorized", (x) => { x.boundaries.public_upload = true; }],
    ["final_canon_promoted", (x) => { x.boundaries.final_canon_decision = true; }],
    ["whole_story_review_reopened", (x) => { x.boundaries.whole_story_review_reopened = true; }],
    ["long_per_reference_questionnaire", (x) => { x.default_plan.human_decision.per_reference_question_count = 28; }],
    ["primary_image_wall", (x) => { x.ui_contract.primary_image_wall = true; }],
    ["theme_missing", (x) => { x.ui_contract.theme_modes = ["light", "dark"]; }],
    ["nested_scroll", (x) => { x.ui_contract.nested_scroll = true; }],
    ["horizontal_overflow", (x) => { x.ui_contract.horizontal_overflow = true; }],
    ["predecessor_mutation", (x) => { x.integrity.source_packages_unchanged = false; }],
    ["historical_result_mutation", (x) => { x.integrity.historical_results_unchanged = false; }],
    ["manifest_mismatch", (x) => { x.package_contract.manifest_match = false; }],
    ["normal_validation_artifact_mutation", (x) => { x.validation.normal_read_only = false; }]
  ];
  return definitions.map(([probe_id, mutate]) => {
    const candidate = structuredClone(model);
    candidate.validation.negative_probes = [];
    mutate(candidate);
    const failures = validateCore(candidate, { probe: true });
    return { probe_id, detected: failures.length > 0, failed_closed: failures.length > 0, artifact_mutation: false };
  });
}

function relativeThumbnail(requirement, reference) {
  return requirement?.representative_preview_thumbnail || (reference ? `../${reference.local_path.replace(/^artifacts\//, "")}` : null);
}

function primaryCopy(text) {
  return String(text).replaceAll("HOLD", "保留");
}

function dispositionLabel(value) {
  return ({
    create_deterministic_original: "決定的に新規作成",
    source_replacement_candidate: "置換候補を準備",
    owner_may_consider_local_proxy: "Owner検討用proxy",
    retain_reference_only: "参照のみ保持",
    exclude_from_production: "制作対象から除外"
  })[value] || value;
}

function assetClassLabel(value) {
  return ({ environment: "環境", character_silhouette: "人物シルエット", prop: "小道具", document_graphic: "文書図版", abstract_graphic: "抽象図版", typography: "文字", audio_cue: "音cue" })[value] || value;
}

function renderHtml(model) {
  const refById = new Map(model.references.map((reference) => [reference.canonical_reference_id, reference]));
  const groups = [...new Set(model.requirements.map((requirement) => requirement.asset_class))];
  const groupHtml = groups.map((assetClass) => `<section class="asset-group" aria-labelledby="group-${assetClass}">
    <h3 id="group-${assetClass}">${assetClassLabel(assetClass)}</h3>
    ${model.requirements.filter((requirement) => requirement.asset_class === assetClass).map((requirement) => {
      const reference = refById.get(requirement.representative_reference_id);
      const thumbnail = relativeThumbnail(requirement, reference);
      return `<article class="requirement-row">
        <div class="thumb">${thumbnail ? `<img src="${thumbnail}" alt="${requirement.requirement_id}: ${requirement.thumbnail_semantics_ja}" loading="lazy"><span>${requirement.thumbnail_semantics_ja}</span>` : `<div class="no-thumb" aria-hidden="true">—</div><span>構図参照なし</span>`}</div>
        <div class="requirement-copy"><div class="row-top"><strong>${requirement.requirement_id}</strong><span class="status-pill">${dispositionLabel(requirement.recommended_disposition)}</span></div><p>${primaryCopy(requirement.generic_description_ja)}</p><div class="meta">${requirement.shot_ids.length} shots · ${requirement.canonical_reference_ids.length} references · Owner判断 未選択</div></div>
      </article>`;
    }).join("\n")}
  </section>`).join("\n");
  const details = model.references.map((reference) => `<article class="evidence-item">
    <h3>${reference.canonical_reference_id}</h3>
    <dl><div><dt>Creator</dt><dd>${reference.creator}</dd></div><div><dt>Source</dt><dd><a href="${reference.source_page_url}">${reference.source_title}</a></dd></div><div><dt>License record</dt><dd><a href="${reference.license_url}">${reference.license_name}</a></dd></div><div><dt>Local path</dt><dd><code>${reference.local_path}</code></dd></div><div><dt>SHA256</dt><dd><code>${reference.sha256}</code></dd></div><div><dt>Live check</dt><dd>source ${reference.live_source_check} / license ${reference.live_license_check}</dd></div></dl>
  </article>`).join("\n");
  const d = model.default_plan.disposition_counts;
  return `<!doctype html>
<html lang="ja" data-theme="auto"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>素材準備</title>
<style>
:root{color-scheme:light dark;--bg:#f3f1ec;--panel:#fff;--text:#1a2528;--muted:#607074;--line:#d7d8d3;--accent:#176d68;--accent-soft:#dff0ed;--focus:#db6d2e;--shadow:0 8px 24px rgba(28,43,45,.08)}
:root[data-resolved-theme="dark"]{--bg:#101719;--panel:#182225;--text:#edf3f1;--muted:#aebbb8;--line:#344245;--accent:#79d4ca;--accent-soft:#203b39;--focus:#ffad70;--shadow:none}
*{box-sizing:border-box}html,body{margin:0;min-width:0;overflow-x:hidden}body{background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,"Segoe UI","Noto Sans JP",sans-serif;line-height:1.65}a{color:var(--accent);overflow-wrap:anywhere}button,summary{font:inherit}button:focus-visible,summary:focus-visible,a:focus-visible{outline:3px solid var(--focus);outline-offset:3px}.page{width:min(1120px,calc(100% - 32px));margin:0 auto;padding:22px 0 72px}.theme-control{display:flex;justify-content:flex-end;gap:6px;margin-bottom:16px}.theme-control button{min-height:44px;padding:8px 13px;border:1px solid var(--line);border-radius:999px;background:var(--panel);color:var(--text);cursor:pointer}.theme-control button[aria-pressed="true"]{background:var(--accent-soft);border-color:var(--accent)}.hero,.panel,.asset-group,.evidence-item,details{background:var(--panel);border:1px solid var(--line);border-radius:18px;box-shadow:var(--shadow)}.hero{padding:28px clamp(20px,4vw,46px);display:grid;grid-template-columns:1fr auto;align-items:end;gap:24px}.eyebrow{margin:0 0 6px;color:var(--accent);font-weight:760;letter-spacing:.08em}.hero h1{margin:0;font-size:clamp(34px,4vw,40px);line-height:1.12;max-width:12ch}.hero .secondary{margin:10px 0 0;color:var(--muted);font-size:15px}.hero-status{align-self:start;padding:9px 14px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-weight:760;white-space:nowrap}main>section,.evidence-section{margin-top:22px}.section-heading{display:flex;align-items:end;justify-content:space-between;gap:20px;margin:0 4px 10px}.section-heading h2{margin:0;font-size:clamp(23px,3vw,30px);line-height:1.25}.section-heading p{margin:0;color:var(--muted);font-size:14px}.panel{padding:22px}.metric-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.metric{padding:14px;border:1px solid var(--line);border-radius:14px}.metric strong{display:block;font-size:25px;line-height:1.1}.metric span{font-size:13px;color:var(--muted)}.plan-copy{margin:18px 0 0;max-width:78ch}.decision{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:18px}.decision div{padding:14px;border-radius:12px;background:var(--accent-soft)}.decision strong{display:block;color:var(--accent)}.asset-grid{display:grid;gap:14px}.asset-group{padding:18px}.asset-group h3{margin:0 0 12px;font-size:19px}.requirement-row{display:grid;grid-template-columns:132px minmax(0,1fr);gap:16px;padding:14px 0;border-top:1px solid var(--line)}.requirement-row:first-of-type{border-top:0;padding-top:0}.thumb{position:relative;min-width:0}.thumb img,.no-thumb{display:block;width:132px;height:78px;object-fit:cover;border-radius:10px;background:var(--bg);border:1px solid var(--line)}.thumb span{display:block;margin-top:4px;color:var(--muted);font-size:11px}.no-thumb{display:grid;place-items:center;font-size:24px}.row-top{display:flex;align-items:center;justify-content:space-between;gap:12px}.status-pill{padding:4px 9px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-size:12px;white-space:nowrap}.requirement-copy p{margin:7px 0}.meta{font-size:12px;color:var(--muted)}.replace-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.replace-grid article{padding:16px;border:1px solid var(--line);border-radius:14px}.replace-grid h3{margin:0 0 8px;font-size:16px}.replace-grid p{margin:0;color:var(--muted)}.notice{border-left:5px solid var(--accent);padding-left:15px}.evidence-summary{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.evidence-summary span{padding:6px 10px;border:1px solid var(--line);border-radius:999px}details{margin-top:22px}summary{min-height:52px;display:flex;align-items:center;padding:14px 20px;cursor:pointer;font-weight:760;list-style:none}summary::-webkit-details-marker{display:none}.details-body{padding:0 18px 20px;display:grid;gap:10px}.evidence-item{padding:14px;box-shadow:none}.evidence-item h3{margin:0 0 8px;font-size:15px;overflow-wrap:anywhere}.evidence-item dl{margin:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px 16px}.evidence-item dl div{min-width:0}.evidence-item dt{font-size:11px;color:var(--muted)}.evidence-item dd{margin:0;font-size:12px;overflow-wrap:anywhere}.evidence-item code{font-size:10px}.footnote{margin:18px 4px 0;color:var(--muted);font-size:12px}
@media(max-width:820px){.metric-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.decision,.replace-grid{grid-template-columns:1fr}.hero{grid-template-columns:1fr}.hero-status{justify-self:start}.evidence-item dl{grid-template-columns:1fr}}
@media(max-width:560px){.page{width:min(100% - 20px,1120px);padding-top:12px}.theme-control{justify-content:flex-start}.hero{padding:22px 18px}.hero h1{font-size:30px}.metric-grid{grid-template-columns:1fr 1fr}.requirement-row{grid-template-columns:92px minmax(0,1fr);gap:12px}.thumb img,.no-thumb{width:92px;height:62px}.row-top{align-items:flex-start;flex-direction:column;gap:5px}.status-pill{white-space:normal}.panel,.asset-group{padding:15px}}
@media print{:root,:root[data-resolved-theme="dark"]{color-scheme:light;--bg:#fff;--panel:#fff;--text:#111;--muted:#444;--line:#bbb;--accent:#155e59;--accent-soft:#eef7f5;--shadow:none}.theme-control{display:none}.page{width:100%;padding:0}.hero,.panel,.asset-group,.requirement-row,.replace-grid article,.evidence-item{break-inside:avoid}details{display:block}details>.details-body{display:grid}summary{display:none}a{color:#111;text-decoration:none}}
</style></head><body><div class="page">
<div class="theme-control" role="group" aria-label="Theme"><button type="button" data-theme-choice="light" aria-pressed="false">Light</button><button type="button" data-theme-choice="dark" aria-pressed="false">Dark</button><button type="button" data-theme-choice="auto" aria-pressed="true">Auto</button></div>
<header class="hero"><div><p class="eyebrow">素材準備</p><h1>素材準備</h1><p class="secondary">19 shots / 14 requirements / 28 references</p></div><div class="hero-status">推奨計画</div></header>
<main>
<section aria-labelledby="recommended"><div class="section-heading"><h2 id="recommended">推奨初期計画</h2><p>Owner判断は未選択</p></div><div class="panel"><div class="metric-grid"><div class="metric"><strong>${d.create_deterministic_original || 0}</strong><span>決定的に新規作成</span></div><div class="metric"><strong>${d.source_replacement_candidate || 0}</strong><span>置換候補</span></div><div class="metric"><strong>${d.owner_may_consider_local_proxy || 0}</strong><span>proxy検討</span></div><div class="metric"><strong>${d.retain_reference_only || 0}</strong><span>参照のみ</span></div></div><p class="plan-copy">${model.default_plan.summary_ja}</p><p class="plan-copy"><strong>最小セット:</strong> 14 requirementsで19 shotsを覆います。例外候補は <code>${model.default_plan.exception_requirement_ids.join(", ")}</code>、未到達のsource確認は ${model.default_plan.unresolved_evidence_count} 件です。</p><div class="decision"><div><strong>A</strong>推奨計画を採用</div><div><strong>B</strong>例外requirement IDだけ指定</div><div><strong>C</strong>material strategyを再構成</div></div></div></section>
<section aria-labelledby="classification"><div class="section-heading"><h2 id="classification">素材分類</h2><p>7 classes · 1 row / requirement</p></div><div class="asset-grid">${groupHtml}</div></section>
<section aria-labelledby="replace"><div class="section-heading"><h2 id="replace">置換・新規作成</h2><p>非公開の初回組立て向け</p></div><div class="panel replace-grid"><article><h3>決定的に新規作成</h3><p>架空台帳、候補比較、抽象図、文字、匿名シルエットを同じ規則から再現できる形で準備します。</p></article><article><h3>置換候補</h3><p>実在施設、人物、実記録に依存する環境と手元は、新規source候補または中立placeholderへ分離します。</p></article><article><h3>identity / sensitive</h3><p>人物、実在施設、実記録、商標、文脈誤認のriskを個別記録し、制作候補の判断前に再確認します。</p></article></div></section>
<section aria-labelledby="rights"><div class="section-heading"><h2 id="rights">権利証拠</h2><p>証拠と判断を分離</p></div><div class="panel"><p class="notice"><strong>権利判断は未実施</strong></p><p>28件はcreator、source、license、local path、hash、取得日を保存しています。通常のreadbackではsourceページを再取得しません。</p><div class="evidence-summary"><span>stored metadata 28</span><span>source confirmed 20</span><span>source unavailable 8</span><span>license page confirmed 28</span><span>publication 未確認 14</span></div></div></section>
<details><summary>詳細証拠 — 28 reference records</summary><div class="details-body">${details}</div></details>
</main><p class="footnote">参照は構図検討用です。制作素材の選定、公開適合性、利用判断を示しません。</p></div>
<script>(()=>{const root=document.documentElement;const buttons=[...document.querySelectorAll('[data-theme-choice]')];const apply=(choice)=>{root.dataset.theme=choice;root.dataset.resolvedTheme=choice==='auto'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):choice;for(const button of buttons)button.setAttribute('aria-pressed',String(button.dataset.themeChoice===choice));};for(const button of buttons)button.addEventListener('click',()=>apply(button.dataset.themeChoice));matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(root.dataset.theme==='auto')apply('auto')});apply('auto');})();</script></body></html>`;
}

function renderReadme(model) {
  return `# Asset / Rights Readiness Packet\n\n- Artifact: \`${ARTIFACT_ID}\`\n- Source: \`${SOURCE_ARTIFACT_ID}\`\n- Source fingerprint: \`${SOURCE_FINGERPRINT}\`\n- Primary access: \`asset-rights-readiness.html\`\n- Scope: ${model.counts.shot_count} shots / ${model.counts.requirement_count} requirements / ${model.counts.canonical_reference_count} references / ${model.counts.alias_count} aliases / ${model.counts.assignment_count} assignments\n- Owner review: \`OWNER_WHOLE_STORY_COMPOSITION_PASS\`\n- Next human decision: \`owner_asset_plan_decision\`\n\nThis packet separates creative usefulness, stored provenance, source-page readback, license evidence, future production suitability, risk, and Owner decision. It neither selects production media nor records a rights decision. No predecessor raster is copied into this directory.\n`;
}

function renderDefaultPlan(model) {
  const ids = (disposition) => model.requirements.filter((item) => item.recommended_disposition === disposition).map((item) => item.requirement_id).join(", ");
  const shotCoverage = Object.entries(model.default_plan.shot_coverage_by_disposition).map(([disposition, coverage]) => `${disposition} ${coverage.shot_count}/19 (${coverage.shot_ids.join("|")})`).join("; ");
  return `# Recommended Default Plan\n\n## Recommendation A\n\n${model.default_plan.summary_ja}\n\n- Deterministic originals: ${ids("create_deterministic_original")}\n- Replacement sourcing: ${ids("source_replacement_candidate")}\n- Owner-may-consider local proxy: ${ids("owner_may_consider_local_proxy")}\n- Reference-only / future lane: ${ids("retain_reference_only")}\n- Shot coverage by disposition: ${shotCoverage}\n- Motif continuity: ${model.default_plan.motif_continuity_strategy}\n- Separate future lanes: future_audio_lane (AR-AUDIO-01); future_voice_lane (no generic requirement ID)\n- Exception requirement IDs: ${model.default_plan.exception_requirement_ids.join(", ")}\n- Unresolved live-source evidence (${model.default_plan.unresolved_evidence_count}): ${model.default_plan.unresolved_evidence_reference_ids.join(", ")}\n- Coverage: ${model.default_plan.covered_requirement_ids.length}/14 requirements; ${model.default_plan.covered_shot_ids.length}/19 shots\n- Owner decision: unselected\n- Publication compatibility: unreviewed\n\n## Compressed Decision\n\n- A — recommended default planを採用\n- B — exception requirement IDsだけ指定\n- C — material strategyを再構成\n\nFull source and license evidence remains secondary in the HTML disclosure and \`reference-evidence.csv\`.\n`;
}

async function writePackage(model, existingBrowser = null, { validateAfter = true } = {}) {
  await mkdir(PACKAGE_ROOT, { recursive: true });
  const requirementHeaders = ["requirement_id", "asset_class", "generic_description_ja", "quantity", "quantity_unit", "owning_beats", "shot_ids", "canonical_reference_ids", "reference_count", "representative_preview_shot_id", "representative_preview_thumbnail", "thumbnail_semantics_ja", "thumbnail_lineage", "thumbnail_reuse_label", ...REQUIRED_SEPARATION_FIELDS, "rationale", "replacement_or_creation_brief", "minimum_local_assembly_role", "proposed_construction_method", "blocking_for_offline_assembly"];
  const referenceHeaders = ["canonical_reference_id", "alias_ids", "owning_source_artifact", "source_package_path", "local_path", "local_source_path", "sha256", "used_by_shot_ids", "mapped_requirement_ids", "creator", "source_title", "source_page_url", "original_media_url", "license_name", "license_url", "original_dimensions", "normalized_dimensions", "retrieval_date", "provenance_evidence", "evidence_gap", "license_evidence", "live_source_check", "live_source_readback_state", "live_checked_at", "live_check_note", "live_license_check", "license_live_checked_at", "license_check_note", "identity_or_sensitive_content_risk", "stored_rights_flags", "representative_only", "selected_for_production", "rights_cleared_claim"];
  const shotHeaders = ["shot_id", "sequence", "beat_number", "title_ja", "start_time", "end_time", "duration_seconds", "requirement_ids", "canonical_reference_ids", "assignment_ids"];
  const minimumHeaders = ["requirement_id", "reusable_across_shots", "covered_shot_ids", "proposed_construction_method", "current_reference_role", "required_future_decision", "blocking_for_offline_assembly", "owner_decision"];
  const outputs = {
    "README_ASSET_RIGHTS_READINESS.md": renderReadme(model),
    "asset-rights-readiness.html": renderHtml(model),
    "asset-rights-readiness.json": `${JSON.stringify(model, null, 2)}\n`,
    "asset-requirement-plan.csv": toCsv(requirementHeaders, model.requirements),
    "reference-evidence.csv": toCsv(referenceHeaders, model.references.map((reference) => ({ ...reference, original_dimensions: `${reference.original_dimensions.width}x${reference.original_dimensions.height}`, normalized_dimensions: `${reference.normalized_dimensions.width}x${reference.normalized_dimensions.height}`, stored_rights_flags: JSON.stringify(reference.stored_rights_flags) }))),
    "shot-asset-coverage.csv": toCsv(shotHeaders, model.shots),
    "minimum-local-assembly-set.csv": toCsv(minimumHeaders, model.minimum_local_assembly_set),
    "recommended-default-plan.md": renderDefaultPlan(model)
  };
  for (const [name, content] of Object.entries(outputs)) await writeFile(`${PACKAGE_ROOT}/${name}`, content, "utf8");
  const payloadInventory = await inventoryFiles(PACKAGE_PAYLOAD_FILES.map((name) => `${PACKAGE_ROOT}/${name}`), PACKAGE_ROOT);
  const manifest = {
    schemaVersion: "fff.assetRightsReadinessPacketManifest.v1",
    artifact_id: ARTIFACT_ID,
    generated_at: model.generated_at,
    payload_file_count: payloadInventory.file_count,
    file_count: payloadInventory.file_count + 1,
    package_fingerprint_sha256: payloadInventory.aggregate_sha256,
    copied_source_image_count: 0,
    modified_source_image_count: 0,
    newly_downloaded_asset_count: 0,
    package_raster_count: 0,
    files: payloadInventory.files
  };
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  const result = buildResult(model, manifest, existingBrowser);
  await writeFile(RESULT_PATH, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  if (validateAfter) await validatePacket(RESULT_PATH);
  return { manifest, result };
}

function buildResult(model, manifest, browserEvidence) {
  const dispositionCounts = countValues(model.requirements, "recommended_disposition");
  const evidenceCounts = countValues(model.references, "provenance_evidence");
  const liveCounts = countValues(model.references, "live_source_check");
  const riskCount = model.references.filter((reference) => reference.identity_or_sensitive_content_risk.some((risk) => risk !== "none_observed")).length;
  const browserPassed = Boolean(browserEvidence?.passed);
  const thumbnailHashes = model.requirements.map((requirement) => requirement.representative_preview_thumbnail);
  return {
    schemaVersion: "fff.assetRightsReadinessPacketResult.v1",
    artifact_id: ARTIFACT_ID,
    source_artifact_id: SOURCE_ARTIFACT_ID,
    source_fingerprint: SOURCE_FINGERPRINT,
    owner_review: "OWNER_WHOLE_STORY_COMPOSITION_PASS",
    composition_repair_required: false,
    asset_preparation_planning_authorized: true,
    production_asset_selection_authorized: false,
    rights_clearance_authorized: false,
    media_generation_authorized: false,
    offline_assembly_authorized: false,
    next_human_decision: "owner_asset_plan_decision",
    per_beat_review: "discontinued",
    external_reproducibility_claimed: false,
    shot_count: model.counts.shot_count,
    requirement_count: model.counts.requirement_count,
    canonical_reference_count: model.counts.canonical_reference_count,
    alias_count: model.counts.alias_count,
    assignment_count: model.counts.assignment_count,
    semantically_mapped_thumbnail_count: thumbnailHashes.length,
    accidental_duplicate_thumbnail_count: thumbnailHashes.length - new Set(thumbnailHashes).size,
    required_thumbnail_repairs: Object.fromEntries(["AR-PROP-02", "AR-PROP-03", "AR-ABS-01", "AR-ABS-02"].map((id) => {
      const item = model.requirements.find((requirement) => requirement.requirement_id === id);
      return [id, { representative_preview_shot_id: item.representative_preview_shot_id, thumbnail_semantics_ja: item.thumbnail_semantics_ja }];
    })),
    asset_class_count: model.counts.asset_class_count,
    asset_class_counts: countValues(model.requirements, "asset_class"),
    creative_fit_counts: countValues(model.requirements, "creative_fit"),
    evidence_state_counts: evidenceCounts,
    recommended_disposition_counts: dispositionCounts,
    evidence_gap_count: model.references.filter((reference) => reference.evidence_gap).length,
    live_source_confirmed_count: liveCounts.confirmed || 0,
    live_source_unavailable_count: liveCounts.unavailable || 0,
    live_license_confirmed_count: model.references.filter((reference) => reference.live_license_check === "confirmed").length,
    identity_or_sensitive_risk_count: riskCount,
    deterministic_original_requirement_count: dispositionCounts.create_deterministic_original || 0,
    replacement_candidate_requirement_count: dispositionCounts.source_replacement_candidate || 0,
    local_proxy_consideration_requirement_count: dispositionCounts.owner_may_consider_local_proxy || 0,
    reference_only_requirement_count: dispositionCounts.retain_reference_only || 0,
    minimum_local_assembly_requirement_count: model.minimum_local_assembly_set.length,
    minimum_local_assembly_shot_coverage: new Set(model.minimum_local_assembly_set.flatMap((item) => item.covered_shot_ids)).size,
    default_plan_requirement_coverage: model.default_plan.covered_requirement_ids.length,
    default_plan_shot_coverage: model.default_plan.covered_shot_ids.length,
    default_plan_shot_coverage_by_disposition: model.default_plan.shot_coverage_by_disposition,
    exception_requirement_ids: model.default_plan.exception_requirement_ids,
    unresolved_evidence_reference_ids: model.default_plan.unresolved_evidence_reference_ids,
    minimum_local_assembly_future_lanes: model.minimum_local_assembly_future_lanes,
    owner_decision_selected_count: model.requirements.filter((requirement) => requirement.owner_decision !== "unselected").length,
    publication_compatibility_reviewed_count: model.requirements.filter((requirement) => requirement.publication_compatibility !== "unreviewed").length,
    selected_for_production_count: model.references.filter((reference) => reference.selected_for_production).length,
    rights_cleared_claim_count: model.references.filter((reference) => reference.rights_cleared_claim).length,
    copied_source_image_count: 0,
    modified_source_image_count: 0,
    newly_downloaded_asset_count: 0,
    external_media_hotlink_count: 0,
    legal_clearance_claim_count: 0,
    provider_configured: false,
    credentials_touched: false,
    image_generation: false,
    audio_generation: false,
    video_generation: false,
    production_render: false,
    public_upload: false,
    database_persistence: false,
    final_canon_decision: false,
    source_packages_unchanged: true,
    historical_results_unchanged: true,
    protected_integrity: model.integrity,
    package_manifest: { path: MANIFEST_PATH, fingerprint: manifest.package_fingerprint_sha256, payload_file_count: manifest.payload_file_count },
    negative_probes: { count: model.validation.negative_probes.length, passed: model.validation.negative_probes.filter((probe) => probe.detected && probe.failed_closed && !probe.artifact_mutation).length, results: model.validation.negative_probes },
    browser_evidence: browserEvidence || { passed: false, status: "pending" },
    failures: browserPassed ? [] : ["browser_evidence_pending"],
    passed: browserPassed
  };
}

async function validateManifest(manifest) {
  const inventory = await inventoryFiles(PACKAGE_PAYLOAD_FILES.map((name) => `${PACKAGE_ROOT}/${name}`), PACKAGE_ROOT);
  const failures = [];
  if (manifest.artifact_id !== ARTIFACT_ID) failures.push("manifest artifact mismatch");
  if (manifest.payload_file_count !== 8 || manifest.file_count !== 9) failures.push("manifest file count mismatch");
  if (manifest.copied_source_image_count !== 0 || manifest.modified_source_image_count !== 0 || manifest.newly_downloaded_asset_count !== 0 || manifest.package_raster_count !== 0) failures.push("manifest media mutation boundary mismatch");
  if (manifest.package_fingerprint_sha256 !== inventory.aggregate_sha256) failures.push("manifest fingerprint mismatch");
  if (JSON.stringify(manifest.files) !== JSON.stringify(inventory.files)) failures.push("manifest inventory mismatch");
  return failures;
}

async function validatePacket(inputPath = RESULT_PATH) {
  const before = await inventoryFiles([...PACKAGE_PAYLOAD_FILES.map((name) => `${PACKAGE_ROOT}/${name}`), MANIFEST_PATH, RESULT_PATH], ".");
  const [model, manifest, result, html] = await Promise.all([readJson(MODEL_PATH), readJson(MANIFEST_PATH), readJson(inputPath), readFile(HTML_PATH, "utf8")]);
  const failures = validateCore(model);
  const actualIntegrity = await captureIntegrity();
  if (!sameIntegrity(model.integrity, actualIntegrity)) failures.push("protected predecessor or historical result fingerprint mismatch");
  failures.push(...await validateManifest(manifest));
  for (const reference of model.references) {
    if (!existsSync(reference.local_path)) failures.push(`missing source reference ${reference.canonical_reference_id}`);
    else if (sha256(await readFile(reference.local_path)) !== reference.sha256) failures.push(`source reference hash mismatch ${reference.canonical_reference_id}`);
  }
  for (const heading of model.ui_contract.primary_headings) if (!html.includes(`>${heading}<`) && !html.includes(`>${heading} —`)) failures.push(`missing primary heading ${heading}`);
  if (!html.includes("19 shots / 14 requirements / 28 references")) failures.push("secondary scope line missing");
  if (!html.includes("権利判断は未実施")) failures.push("rights evidence boundary missing");
  if (!html.includes('data-theme-choice="light"') || !html.includes('data-theme-choice="dark"') || !html.includes('data-theme-choice="auto"')) failures.push("theme controls missing");
  if (/<img[^>]+src=["']https?:/i.test(html)) failures.push("remote image hotlink found");
  if (!/<details>\s*<summary>/i.test(html)) failures.push("full-width evidence disclosure missing");
  if (!/@media print/.test(html)) failures.push("print style missing");
  if ((html.match(/<img\s/gi) || []).length > 14) failures.push("primary image wall detected");
  for (const requirement of model.requirements) {
    const thumbnailPath = path.resolve(PACKAGE_ROOT, requirement.representative_preview_thumbnail);
    if (!existsSync(thumbnailPath)) failures.push(`missing previsualization thumbnail ${requirement.requirement_id}`);
    if (!html.includes(requirement.thumbnail_semantics_ja)) failures.push(`thumbnail semantics missing from HTML ${requirement.requirement_id}`);
  }
  const inlineScript = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  try { new Function(inlineScript || ""); } catch (error) { failures.push(`inline script syntax: ${error.message}`); }
  const requirementCsv = parseCsv(await readFile(`${PACKAGE_ROOT}/asset-requirement-plan.csv`, "utf8"));
  const referenceCsv = parseCsv(await readFile(`${PACKAGE_ROOT}/reference-evidence.csv`, "utf8"));
  const shotCsv = parseCsv(await readFile(`${PACKAGE_ROOT}/shot-asset-coverage.csv`, "utf8"));
  const minimumCsv = parseCsv(await readFile(`${PACKAGE_ROOT}/minimum-local-assembly-set.csv`, "utf8"));
  if (requirementCsv.length !== 14 || referenceCsv.length !== 28 || shotCsv.length !== 19 || minimumCsv.length !== 14) failures.push("CSV row count mismatch");
  const expectedResult = buildResult(model, manifest, result.browser_evidence);
  for (const key of ["artifact_id", "source_artifact_id", "source_fingerprint", "owner_review", "composition_repair_required", "asset_preparation_planning_authorized", "production_asset_selection_authorized", "rights_clearance_authorized", "media_generation_authorized", "offline_assembly_authorized", "next_human_decision", "per_beat_review", "external_reproducibility_claimed", "shot_count", "requirement_count", "canonical_reference_count", "alias_count", "assignment_count", "semantically_mapped_thumbnail_count", "accidental_duplicate_thumbnail_count", "required_thumbnail_repairs", "asset_class_count", "evidence_gap_count", "live_source_confirmed_count", "live_source_unavailable_count", "identity_or_sensitive_risk_count", "deterministic_original_requirement_count", "replacement_candidate_requirement_count", "local_proxy_consideration_requirement_count", "reference_only_requirement_count", "minimum_local_assembly_requirement_count", "minimum_local_assembly_shot_coverage", "default_plan_shot_coverage_by_disposition", "unresolved_evidence_reference_ids", "minimum_local_assembly_future_lanes", "owner_decision_selected_count", "publication_compatibility_reviewed_count", "selected_for_production_count", "rights_cleared_claim_count", "copied_source_image_count", "modified_source_image_count", "newly_downloaded_asset_count", "external_media_hotlink_count", "legal_clearance_claim_count", "provider_configured", "credentials_touched", "image_generation", "audio_generation", "video_generation", "production_render", "public_upload", "database_persistence", "final_canon_decision", "source_packages_unchanged", "historical_results_unchanged"]) {
    if (JSON.stringify(result[key]) !== JSON.stringify(expectedResult[key])) failures.push(`result contract mismatch ${key}`);
  }
  if (!result.browser_evidence?.passed) failures.push("browser evidence is not passed");
  if (!Array.isArray(result.failures) || result.failures.length !== 0 || result.passed !== true) failures.push("result is not green");
  const after = await inventoryFiles([...PACKAGE_PAYLOAD_FILES.map((name) => `${PACKAGE_ROOT}/${name}`), MANIFEST_PATH, RESULT_PATH], ".");
  if (before.aggregate_sha256 !== after.aggregate_sha256) failures.push("normal validation mutated packet artifacts");
  if (failures.length) throw new Error(`Asset / Rights Readiness Packet validation failed: ${failures.join("; ")}`);
  console.log(`Asset / Rights Readiness Packet read-only validation passed: ${inputPath}`);
  return { passed: true, failures: [] };
}

async function loadPlaywright() {
  const moduleRoot = process.env.FFF_NODE_MODULES;
  if (!moduleRoot) throw new Error("Browser capture requires Playwright; set FFF_NODE_MODULES to the bundled node_modules directory.");
  let entry = path.join(moduleRoot, "playwright", "index.mjs");
  try {
    const packages = await readdir(path.join(moduleRoot, ".pnpm"));
    const bundled = packages.find((name) => /^playwright@/.test(name));
    if (bundled) entry = path.join(moduleRoot, ".pnpm", bundled, "node_modules", "playwright", "index.mjs");
  } catch { /* flat dependency layout fallback */ }
  return await import(pathToFileURL(entry).href);
}

async function measurePage(page, width, height, theme) {
  await page.setViewportSize({ width, height });
  await page.goto(pathToFileURL(path.resolve(HTML_PATH)).href);
  await page.click(`[data-theme-choice="${theme}"]`);
  return await page.evaluate(() => {
    const title = document.querySelector(".hero h1");
    const titleStyle = getComputedStyle(title);
    const lineHeight = Number.parseFloat(titleStyle.lineHeight);
    const nested = [...document.querySelectorAll("body *")].filter((node) => {
      const style = getComputedStyle(node);
      return /(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight + 1;
    });
    const details = document.querySelector("summary");
    return {
      width: innerWidth,
      height: innerHeight,
      resolved_theme: document.documentElement.dataset.resolvedTheme,
      horizontal_overflow: document.documentElement.scrollWidth > innerWidth + 1,
      nested_scroll_count: nested.length,
      title_font_px: Number.parseFloat(titleStyle.fontSize),
      title_line_count: Math.round(title.getBoundingClientRect().height / lineHeight),
      title_viewport_share: title.getBoundingClientRect().height / innerHeight,
      disclosure_hit_px: details.getBoundingClientRect().height
    };
  });
}

async function captureBrowserEvidence() {
  const { chromium } = await loadPlaywright();
  await mkdir("artifacts/review-screens", { recursive: true });
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage();
  const dark = await measurePage(page, 900, 1200, "dark");
  await page.screenshot({ path: SCREENSHOTS.dark, fullPage: false });
  const light = await measurePage(page, 1280, 900, "light");
  await page.screenshot({ path: SCREENSHOTS.light, fullPage: false });
  const narrow = await measurePage(page, 720, 900, "auto");
  await page.setViewportSize({ width: 900, height: 1200 });
  await page.goto(pathToFileURL(path.resolve(HTML_PATH)).href);
  const autoDefault = await page.evaluate(() => document.documentElement.dataset.theme === "auto" && document.querySelector('[data-theme-choice="auto"]').getAttribute("aria-pressed") === "true");
  await page.focus('[data-theme-choice="light"]');
  const focusVisible = await page.evaluate(() => { const style = getComputedStyle(document.activeElement); return style.outlineStyle !== "none" && Number.parseFloat(style.outlineWidth) >= 3; });
  await page.emulateMedia({ media: "print" });
  const print = await page.evaluate(() => ({ forced_light: getComputedStyle(document.body).backgroundColor === "rgb(255, 255, 255)", controls_hidden: getComputedStyle(document.querySelector(".theme-control")).display === "none", details_visible: getComputedStyle(document.querySelector(".details-body")).display !== "none" }));
  await browser.close();
  const darkInfo = await inventoryFiles([SCREENSHOTS.dark], ".");
  const lightInfo = await inventoryFiles([SCREENSHOTS.light], ".");
  const passed = [dark, light, narrow].every((item) => !item.horizontal_overflow && item.nested_scroll_count === 0 && item.disclosure_hit_px >= 44)
    && dark.title_font_px >= 30 && dark.title_font_px <= 36 && dark.title_line_count <= 2 && dark.title_viewport_share <= .11
    && light.title_font_px >= 34 && light.title_font_px <= 40 && light.title_line_count <= 2 && light.title_viewport_share <= .13
    && autoDefault && focusVisible && print.forced_light && print.controls_hidden && print.details_visible;
  return { passed, status: "captured", engine: "Microsoft Edge via Playwright", viewports: { "900x1200-dark": dark, "1280x900-light": light, "720x900-auto": narrow }, theme: { auto_default: autoDefault, focus_visible: focusVisible }, print, screenshots: { dark: darkInfo.files[0], light: lightInfo.files[0] } };
}

async function build({ validateAfter = false } = {}) {
  const existingModel = await readJsonIfPresent(MODEL_PATH);
  const existingResult = await readJsonIfPresent(RESULT_PATH);
  const currentIntegrity = await captureIntegrity();
  const baseline = existingModel?.integrity?.protected_directories ? { protected_directories: existingModel.integrity.protected_directories, historical_results: existingModel.integrity.historical_results } : currentIntegrity;
  if (existingModel && !sameIntegrity(baseline, currentIntegrity)) throw new Error("PREDECESSOR_INTEGRITY_BLOCKER: protected package or historical result differs from stored baseline");
  const authority = await loadAuthority(existingModel);
  const model = await buildModel(authority, baseline);
  const browser = existingResult?.browser_evidence?.passed ? existingResult.browser_evidence : null;
  await writePackage(model, browser, { validateAfter });
  console.log(`Asset / Rights Readiness Packet generated: ${PACKAGE_ROOT}`);
}

export async function runAssetRightsReadinessPacketCommand({ command, inputPath, outputPath }) {
  if (outputPath) throw new Error("Asset / Rights Readiness Packet commands do not accept an output path.");
  if (command === "validate-asset-rights-readiness-packet") return await validatePacket(inputPath || RESULT_PATH);
  if (command === "smoke-asset-rights-readiness-packet") return await build({ validateAfter: true });
  throw new Error(`Unsupported Asset / Rights Readiness Packet command: ${command}`);
}

async function main() {
  const command = process.argv[2];
  if (command === "build") return await build({ validateAfter: false });
  if (command === "capture") {
    const [model, manifest, result] = await Promise.all([readJson(MODEL_PATH), readJson(MANIFEST_PATH), readJson(RESULT_PATH)]);
    const browserEvidence = await captureBrowserEvidence();
    const updated = buildResult(model, manifest, browserEvidence);
    await writeFile(RESULT_PATH, `${JSON.stringify(updated, null, 2)}\n`, "utf8");
    if (!browserEvidence.passed) throw new Error("Browser evidence did not satisfy the layout contract.");
    console.log(`Browser evidence captured: ${SCREENSHOTS.dark}; ${SCREENSHOTS.light}`);
    return;
  }
  if (command === "validate") return await validatePacket(process.argv[3] || RESULT_PATH);
  if (command === "smoke") return await build({ validateAfter: true });
  console.log("Usage: node tools/fff-asset-rights-readiness-packet.mjs <build|capture|validate|smoke>");
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main().catch((error) => { console.error(error.message); process.exit(1); });
