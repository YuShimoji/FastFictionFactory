#!/usr/bin/env node

import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const ARTIFACT_ID = "fff-production-storyboard-brief-001";
const SCHEMA_VERSION = "fff.productionStoryboardBrief.v1";
const RESULT_SCHEMA_VERSION = "fff.productionStoryboardBriefResult.v1";
const MANIFEST_SCHEMA_VERSION = "fff.productionStoryboardBriefManifest.v1";
const GENERATED_AT = "2026-07-14T12:00:00+09:00";
const ROOT = "artifacts/production-storyboard-brief";
const RESULT_PATH = "artifacts/production-storyboard-brief-result.json";
const REVIEW_DOC_PATH = "docs/review/production-storyboard-brief.md";
const HTML_PATH = ROOT + "/production-storyboard-brief.html";
const PUBLIC_PATH = "public/review/index.html";
const ROOT_MANIFEST_PATH = "artifacts/artifact-manifest.json";
const SOURCE_ROOT = "artifacts/production-execution-pack";
const SOURCE_ARTIFACT_ID = "fff-production-execution-pack-001";
const SOURCE_FILES = [
  "README_PRODUCTION_EXECUTION.md",
  "production-execution-pack.html",
  "production-execution-pack.json",
  "beat-run-sheet.csv",
  "shot-execution-sheet.csv",
  "asset-requirements.csv",
  "narration-timing-envelope.csv",
  "thumbnail-requirements.md",
  "production-execution-manifest.json"
];
const PAYLOAD_FILES = [
  "README_STORYBOARD_BRIEF.md",
  "production-storyboard-brief.html",
  "production-storyboard-brief.json",
  "storyboard-shot-map.csv",
  "story-glossary.csv",
  "asset-operations-summary.csv"
];
const REQUIRED_FILES = [...PAYLOAD_FILES, "production-storyboard-brief-manifest.json"];
const SCREENSHOTS = {
  "900x1200-dark": "artifacts/review-screens/production-storyboard-brief-900x1200-dark.png",
  "1280x900-light": "artifacts/review-screens/production-storyboard-brief-1280x900-light.png"
};
const SOURCE_FINGERPRINTS = {
  production_execution_pack_fingerprint_sha256: "a19cf81f3322c17a49c597731372ea653f7fd3881cea84d1ddb8e2df3b7143ca",
  production_execution_html_sha256: "f892d2935d42b62150a58f18da3ed29394435a4e4c2579f4d6321f1ce637338c",
  production_execution_json_sha256: "24237829ad4d886b79397eb1626ca3efb7a92a8b0f29923ff092f5679d037ceb",
  production_execution_manifest_sha256: "f3a6bccef8809d8060c7a809522c09a546617b82179d2d5f97fe7e3fe20a60f7",
  production_execution_nine_file_aggregate_sha256: "10d3675723c3282cba0fdd516654640a7c16749fef80279b7223b4e5dc436345"
};
const GROUPING = [3, 3, 3, 3, 4, 3];
const NEGATIVE_PROBE_NAMES = [
  "source_mismatch",
  "missing_glossary_term",
  "unresolved_glossary_reference",
  "missing_shot",
  "duplicate_shot",
  "missing_svg",
  "mixed_success_guard_field",
  "asset_table_in_primary",
  "appendix_open_by_default",
  "disclosure_hit_area_below_44px",
  "title_oversized",
  "theme_missing",
  "dark_contrast_failure",
  "nested_scroll",
  "selected_asset",
  "rights_claim",
  "content_mutation",
  "manifest_mismatch"
];

const GLOSSARY = [
  ["term-north-bell-station", "ノース・ベル駅", "place", "古い天文台とともに冒頭の遠景へ置かれる作品内の場所名。実在の場所や最終環境designは未選定。"],
  ["term-bellless-observatory", "鐘のない塔／古い天文台", "place", "空の鐘枠を持ち、正午の鐘音という矛盾を調べる起点。鳴動原因は未確定。"],
  ["term-empty-bell-frame", "空の鐘枠", "object", "鐘が存在しないことを示す第一幕と終幕のvisual anchor。鳴動原因や撤去理由は示さない。"],
  ["term-noon", "正午", "repeated_time_marker", "鐘音とともに示される時刻。音の原因を確定する表示ではない。"],
  ["term-winter-curfew", "winter curfew", "unresolved_event", "鐘の撤去理由に関係する可能性があるが、真相は未確定。"],
  ["term-mira", "ミラ", "person", "時計修理台の手元で示される主人公。外見、final character design、終幕の選択は未確定。"],
  ["term-toma", "トーマ／Toma", "person", "ミラの兄として手掛かりに結びつく人物。生死と所在は未解決。"],
  ["term-toma-note", "トーマのメモ", "document", "真鍮の蛾とともに示される個人的な手掛かり。由来や真実性は確定しない。"],
  ["term-brass-moth", "真鍮の蛾／moth", "object", "正体と機能が不明な物。key、spy、memoryはいずれも候補で、作動や正解を示さない。"],
  ["term-nine-seventeen", "9:17", "repeated_time_marker", "閉店時刻のmotifとして扱う反復表示。時計停止の確定事実ではない。"],
  ["term-minutes-ledger", "『分』の台帳", "document", "名前と『分』が並ぶ文書。証拠、誘い餌、偽記録のどれかは未確定。"],
  ["term-minutes-column", "名前と『分』の列", "document_field", "台帳に並ぶ欄。時間と名前の因果関係は制作仮説に留まる。"],
  ["term-erased-names", "消された名前／消えた名前", "unresolved_concept", "欠落や忘却として示される名前。literalな消去や回復は証明されていない。"],
  ["term-council", "評議会／Council", "organization", "台帳との関係を疑われる制度組織。動機、責任、関係は未確定で、単純な悪役ではない。"],
  ["term-ledger-hypotheses", "証拠／誘い餌／偽の記録", "unresolved_choice", "台帳に対する同格の読み。どれも採用済みの真実ではない。"],
  ["term-council-accusation", "時間販売の告発", "unresolved_claim", "評議会への告発候補。偽記録説と同じ重みで保持する。"],
  ["term-toma-fate", "トーマの運命", "unresolved_choice", "生存、死亡、消失、潜伏の候補。どれも採用しない。"],
  ["term-moth-function", "真鍮の蛾の機能", "unresolved_choice", "key、spy、memoryの候補。どれも作動、正解、canonとして採用しない。"],
  ["term-council-motive", "評議会の動機", "unresolved_choice", "villainous、desperate、divided、misled等の候補。責任範囲も未確定。"],
  ["term-hold", "HOLD", "review_label", "判断を人間へ戻す編集者向け表示。物語世界内の物や事実ではない。"],
  ["term-canon", "canon", "review_term", "採用済みの物語上の真実。今回の候補はcanonへ昇格していない。"],
  ["term-contradictory-claim-guard", "Contradictory Claim Guard", "review_guard", "矛盾する説のどちらも自動採用しないためのreview guard。物語内の存在ではない。"],
  ["term-lost-time", "失われた時間", "unresolved_concept", "終幕で回復候補として扱われる時間。奪取、販売、返還の成立は未確定。"],
  ["term-ending-choice", "時間か、名前か", "unresolved_choice", "失われた時間か消えた名前かを問う結末候補。ミラの選択は未定。"],
  ["term-ending-candidate", "ending candidate", "review_term", "未採用の結末案。解決済みのending truthではない。"]
].map(function (entry) {
  return {
    term_id: entry[0],
    term_ja: entry[1],
    category: entry[2],
    definition_ja: entry[3],
    uncertainty_preserved: true
  };
});

const SHOT_TERMS = {
  "shot-b01-01": ["term-north-bell-station", "term-bellless-observatory", "term-empty-bell-frame"],
  "shot-b01-02": ["term-empty-bell-frame", "term-winter-curfew"],
  "shot-b01-03": ["term-empty-bell-frame", "term-noon"],
  "shot-b02-01": ["term-mira"],
  "shot-b02-02": ["term-toma-note", "term-brass-moth"],
  "shot-b02-03": ["term-nine-seventeen", "term-brass-moth"],
  "shot-b03-01": ["term-minutes-ledger", "term-council", "term-ledger-hypotheses"],
  "shot-b03-02": ["term-minutes-ledger", "term-minutes-column", "term-erased-names"],
  "shot-b03-03": ["term-erased-names"],
  "shot-b04-01": ["term-council"],
  "shot-b04-02": ["term-council-accusation", "term-ledger-hypotheses", "term-contradictory-claim-guard"],
  "shot-b04-03": ["term-council", "term-council-motive", "term-minutes-ledger"],
  "shot-b05-01": ["term-toma", "term-toma-fate"],
  "shot-b05-02": ["term-brass-moth", "term-moth-function"],
  "shot-b05-03": ["term-council", "term-council-motive"],
  "shot-b05-04": ["term-toma-fate", "term-moth-function", "term-council-motive", "term-hold", "term-canon"],
  "shot-b06-01": ["term-mira", "term-lost-time", "term-erased-names", "term-ending-choice"],
  "shot-b06-02": ["term-minutes-ledger", "term-erased-names"],
  "shot-b06-03": ["term-empty-bell-frame", "term-ending-choice", "term-ending-candidate"]
};

const BEAT_TERMS = {
  1: ["term-north-bell-station", "term-bellless-observatory", "term-empty-bell-frame", "term-noon", "term-winter-curfew"],
  2: ["term-mira", "term-toma", "term-toma-note", "term-brass-moth", "term-nine-seventeen"],
  3: ["term-minutes-ledger", "term-minutes-column", "term-erased-names", "term-ledger-hypotheses"],
  4: ["term-council", "term-council-accusation", "term-contradictory-claim-guard"],
  5: ["term-toma-fate", "term-moth-function", "term-council-motive", "term-hold", "term-canon"],
  6: ["term-lost-time", "term-erased-names", "term-ending-choice", "term-ending-candidate", "term-mira"]
};

const ASSET_SHORT = {
  "AR-ENV-01": "空の天文台環境",
  "AR-ENV-02": "中立的な制度空間",
  "AR-CHAR-01": "匿名の手元insert",
  "AR-CHAR-02": "匿名の評議会silhouette",
  "AR-CHAR-03": "未確定のトーマsilhouette",
  "AR-PROP-01": "時計修理台と9:17時計",
  "AR-PROP-02": "静止した真鍮の蛾",
  "AR-PROP-03": "汎用のトーマのメモ",
  "AR-DOC-01": "架空の台帳variants",
  "AR-DOC-02": "仮説／HOLD graphic",
  "AR-ABS-01": "薄れる名前の抽象graphic",
  "AR-ABS-02": "時間／名前の二択panel",
  "AR-TYPE-01": "日本語中心のtype system",
  "AR-AUDIO-01": "6幕のaudio cue placeholder"
};

function repoPath(value) {
  return String(value || "").replace(/\\/g, "/").replace(/^\.\//, "");
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function jsonBuffer(value) {
  return Buffer.from(JSON.stringify(value, null, 2) + "\n", "utf8");
}

function textBuffer(value) {
  return Buffer.from(String(value).replace(/\r\n?/g, "\n"), "utf8");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function fileSnapshot(filePath, withBuffer) {
  try {
    const buffer = await readFile(filePath);
    const snapshot = {
      exists: true,
      byte_size: buffer.byteLength,
      sha256: sha256(buffer)
    };
    if (withBuffer) snapshot.buffer = buffer;
    return snapshot;
  } catch (error) {
    return {
      exists: false,
      byte_size: 0,
      sha256: null,
      error: error.message
    };
  }
}

async function readJsonSnapshot(filePath) {
  const snapshot = await fileSnapshot(filePath, true);
  if (!snapshot.exists) return { ...snapshot, value: null };
  try {
    return { ...snapshot, value: JSON.parse(snapshot.buffer.toString("utf8")) };
  } catch (error) {
    return { ...snapshot, value: null, error: error.message };
  }
}

function cleanSnapshot(snapshot) {
  return {
    exists: snapshot.exists === true,
    byte_size: snapshot.byte_size || 0,
    sha256: snapshot.sha256 || null
  };
}

function mapsEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

async function snapshotSourcePack() {
  const entries = await Promise.all(SOURCE_FILES.map(async function (name) {
    return [name, cleanSnapshot(await fileSnapshot(SOURCE_ROOT + "/" + name, false))];
  }));
  return Object.fromEntries(entries);
}

function sourceAggregate(snapshotMap) {
  const rows = Object.entries(snapshotMap)
    .sort(function (left, right) { return left[0] < right[0] ? -1 : left[0] > right[0] ? 1 : 0; })
    .map(function (entry) {
      return SOURCE_ROOT + "/" + entry[0] + "|" + entry[1].byte_size + "|" + entry[1].sha256;
    });
  return sha256(Buffer.from(rows.join("\n"), "utf8"));
}

async function readSource() {
  const sourceSnapshots = await snapshotSourcePack();
  const errors = [];
  const html = sourceSnapshots["production-execution-pack.html"];
  const json = sourceSnapshots["production-execution-pack.json"];
  const manifestSnapshot = sourceSnapshots["production-execution-manifest.json"];
  if (html.sha256 !== SOURCE_FINGERPRINTS.production_execution_html_sha256) errors.push("source Execution Pack HTML fingerprint mismatch");
  if (json.sha256 !== SOURCE_FINGERPRINTS.production_execution_json_sha256) errors.push("source Execution Pack JSON fingerprint mismatch");
  if (manifestSnapshot.sha256 !== SOURCE_FINGERPRINTS.production_execution_manifest_sha256) errors.push("source Execution Pack manifest fingerprint mismatch");
  const aggregate = sourceAggregate(sourceSnapshots);
  if (aggregate !== SOURCE_FINGERPRINTS.production_execution_nine_file_aggregate_sha256) errors.push("source Execution Pack nine-file aggregate mismatch: " + aggregate);
  const modelRead = await readJsonSnapshot(SOURCE_ROOT + "/production-execution-pack.json");
  const manifestRead = await readJsonSnapshot(SOURCE_ROOT + "/production-execution-manifest.json");
  if (modelRead.error) errors.push("source model parse failed: " + modelRead.error);
  if (manifestRead.error) errors.push("source manifest parse failed: " + manifestRead.error);
  const sourceModel = modelRead.value || {};
  const sourceManifest = manifestRead.value || {};
  if (sourceModel.artifact_id !== SOURCE_ARTIFACT_ID) errors.push("source artifact identity mismatch");
  if (sourceManifest.package_fingerprint_sha256 !== SOURCE_FINGERPRINTS.production_execution_pack_fingerprint_sha256) errors.push("source package fingerprint mismatch");
  if (!Array.isArray(sourceManifest.files) || sourceManifest.files.length !== 8) {
    errors.push("source manifest payload inventory mismatch");
  } else {
    for (const entry of sourceManifest.files) {
      const snapshot = sourceSnapshots[entry.relative_path] || {};
      if (!snapshot.exists || snapshot.byte_size !== entry.byte_size || snapshot.sha256 !== entry.sha256) {
        errors.push("source manifest file mismatch: " + entry.relative_path);
      }
    }
  }
  return {
    valid: errors.length === 0,
    errors,
    model: sourceModel,
    manifest: sourceManifest,
    snapshots: sourceSnapshots,
    aggregate_sha256: aggregate
  };
}

function splitDoneWhen(shot) {
  const match = String(shot.done_when || "").match(/^「(.+?)」へ最初に視線が集まり、([\s\S]+)$/);
  if (!match || match[2] !== shot.truth_boundary) {
    throw new Error("shot done_when cannot be split without content invention: " + shot.shot_id);
  }
  return {
    focal_label_ja: match[1],
    positive_condition_ja: "「" + match[1] + "」へ最初に視線が集まること。",
    negative_guard_ja: shot.truth_boundary,
    source_done_when: shot.done_when
  };
}

function assetScope(asset) {
  if (asset.requirement_id === "AR-AUDIO-01" || asset.requirement_id === "AR-TYPE-01") return "common";
  return asset.shot_usage.length > 1 ? "reusable" : "beat_specific";
}

function buildModel(source) {
  const pack = source.model;
  const glossary = clone(GLOSSARY);
  const glossaryMap = new Map(glossary.map(function (item) { return [item.term_id, item]; }));
  const assetMap = new Map(pack.asset_requirements.map(function (asset) { return [asset.requirement_id, asset]; }));
  const shots = pack.shots.map(function (sourceShot, index) {
    const split = splitDoneWhen(sourceShot);
    const glossaryIds = clone(SHOT_TERMS[sourceShot.shot_id] || []);
    const assetSummary = sourceShot.asset_requirement_ids.map(function (id) {
      return ASSET_SHORT[id] || id;
    }).join("＋");
    return {
      sequence: index + 1,
      shot_id: sourceShot.shot_id,
      beat_id: sourceShot.beat_id,
      start_time: sourceShot.start_time,
      end_time: sourceShot.end_time,
      duration_seconds: sourceShot.duration_seconds,
      what_is_seen_ja: split.focal_label_ja,
      purpose_ja: sourceShot.plain_language_purpose_ja,
      visual_direction: sourceShot.visual_direction,
      positive_condition_ja: split.positive_condition_ja,
      negative_guard_ja: split.negative_guard_ja,
      source_done_when: split.source_done_when,
      scale: sourceShot.scale,
      motion: sourceShot.motion,
      transition: sourceShot.transition,
      text_allowance_ja: sourceShot.text_allowance_ja,
      asset_requirement_ids: clone(sourceShot.asset_requirement_ids),
      asset_summary_ja: assetSummary,
      source_required_asset_count: sourceShot.source_required_asset_count,
      source_asset_status: sourceShot.source_asset_status,
      source_rights_status: sourceShot.source_rights_status,
      requirement_asset_status: sourceShot.requirement_asset_status,
      requirement_rights_status: sourceShot.requirement_rights_status,
      requirement_provenance_required: sourceShot.requirement_provenance_required,
      glossary_term_ids: glossaryIds,
      frame: {
        kind: "planning_only_inline_svg",
        aspect_ratio: "16:9",
        focal_label_ja: split.focal_label_ja,
        motion: sourceShot.motion,
        final_art: false
      }
    };
  });
  const beats = pack.beats.map(function (sourceBeat) {
    const beatShots = shots.filter(function (shot) { return shot.beat_id === sourceBeat.beat_id; });
    return {
      beat_id: sourceBeat.beat_id,
      beat_number: sourceBeat.beat_number,
      title_ja: sourceBeat.title_ja,
      start_time: sourceBeat.start_time,
      end_time: sourceBeat.end_time,
      duration_seconds: sourceBeat.duration_seconds,
      purpose_ja: sourceBeat.purpose_ja,
      viewer_takeaway_ja: sourceBeat.viewer_takeaway_ja,
      narration: clone(sourceBeat.narration),
      subtitle_count: sourceBeat.subtitle_count,
      shot_count: sourceBeat.shot_count,
      completion_statement_ja: sourceBeat.completion_statement_ja,
      truth_boundary: sourceBeat.truth_boundary,
      shot_ids: beatShots.map(function (shot) { return shot.shot_id; }),
      glossary_term_ids: clone(BEAT_TERMS[sourceBeat.beat_number] || [])
    };
  });
  const assets = pack.asset_requirements.map(function (asset) {
    const scope = assetScope(asset);
    return {
      requirement_id: asset.requirement_id,
      asset_class: asset.asset_class,
      generic_description_ja: asset.generic_description_ja,
      one_line_requirement_ja: asset.requirement_id + "｜" + asset.generic_description_ja,
      quantity: asset.quantity,
      quantity_unit: asset.quantity_unit,
      shot_usage: clone(asset.shot_usage),
      visual_constraints_ja: asset.visual_constraints_ja,
      operation_scope: scope,
      purpose_ja: "対応shotの構図計画を成立させる汎用制作要件。",
      effect_ja: scope === "beat_specific" ? "該当shotだけの要件を分離する。" : "複数shotで同じ制作単位を再利用する。",
      requirements_ja: asset.visual_constraints_ja,
      state: {
        asset_status: asset.asset_status,
        rights_status: asset.rights_status,
        provenance_required: asset.provenance_required
      },
      owner: "human production / rights review",
      next_move: "asset sourcingとrights reviewの別承認後に候補を比較する。"
    };
  });
  for (const shot of shots) {
    for (const id of shot.glossary_term_ids) {
      if (!glossaryMap.has(id)) throw new Error("unresolved glossary reference while building: " + id);
    }
    for (const id of shot.asset_requirement_ids) {
      if (!assetMap.has(id)) throw new Error("unresolved asset requirement while building: " + id);
    }
  }
  return {
    schemaVersion: SCHEMA_VERSION,
    artifact_id: ARTIFACT_ID,
    title: "Fast Fiction Factory Production Storyboard Brief",
    generatedAt: GENERATED_AT,
    status: "provisional_storyboard_planning_brief",
    route: HTML_PATH,
    source: {
      artifact_id: SOURCE_ARTIFACT_ID,
      package_root: SOURCE_ROOT,
      fingerprints: clone(SOURCE_FINGERPRINTS),
      source_package_aggregate_sha256: source.aggregate_sha256,
      derivation_rule: "Execution Packの順序・時刻・文言・truth・asset stateを保持し、done_whenだけを肯定条件と否定guardへ機械的に分離する。"
    },
    premise_ja: pack.beats[0].viewer_takeaway_ja,
    central_question_ja: pack.beats[5].viewer_takeaway_ja,
    provisional: true,
    counts: {
      total_duration_seconds: 180,
      beat_count: 6,
      shot_count: 19,
      subtitle_count: 20,
      narration_segment_count: 6,
      asset_requirement_count: 14,
      glossary_count: glossary.length
    },
    voice_planning: clone(pack.voice_planning),
    overview_sentences: pack.beats.map(function (beat) { return beat.viewer_takeaway_ja; }),
    beat_shot_grouping: clone(GROUPING),
    glossary,
    beats,
    shots,
    asset_operations: assets,
    theme: {
      default: "auto",
      options: ["light", "dark", "auto"],
      title_px: { "900x1200": 36, "1280x900": 40 },
      light: { background: "#f4f1e8", panel: "#fffdfa", text: "#171a1d", muted: "#4c5962", accent: "#8b4b19", line: "#c9c2b3" },
      dark: { background: "#101820", panel: "#18232d", text: "#f2f5f7", muted: "#b9c6cf", accent: "#f4b36f", line: "#40515d" }
    },
    appendix: {
      initially_open: false,
      disclosure_hit_area_px: 48,
      open_label_ja: "制作準備付録を開く",
      close_label_ja: "制作準備付録を閉じる",
      asset_requirement_count: assets.length
    },
    boundaries: {
      canonical: false,
      production_approved: false,
      local_only: true,
      external_call: false,
      provider_configured: false,
      credentials_touched: false,
      assets_selected: false,
      rights_cleared_claim: false,
      tts_engine_selected: false,
      voice_selected: false,
      audio_generated: false,
      public_upload: false,
      ai_video_generation: false,
      production_render: false,
      database_persistence: false,
      final_canon_decision: false
    }
  };
}

function csvCell(value) {
  let text = Array.isArray(value) ? value.join("|") : String(value == null ? "" : value);
  if (/[",\r\n]/.test(text)) text = '"' + text.replace(/"/g, '""') + '"';
  return text;
}

function renderCsv(rows, fields) {
  const lines = [fields.map(csvCell).join(",")];
  for (const row of rows) lines.push(fields.map(function (field) { return csvCell(row[field]); }).join(","));
  return lines.join("\n") + "\n";
}

function renderShotCsv(model) {
  const rows = model.shots.map(function (shot) {
    return {
      sequence: shot.sequence,
      shot_id: shot.shot_id,
      beat_id: shot.beat_id,
      start_time: shot.start_time,
      end_time: shot.end_time,
      duration_seconds: shot.duration_seconds,
      what_is_seen_ja: shot.what_is_seen_ja,
      purpose_ja: shot.purpose_ja,
      visual_direction: shot.visual_direction,
      positive_condition_ja: shot.positive_condition_ja,
      negative_guard_ja: shot.negative_guard_ja,
      scale: shot.scale,
      motion: shot.motion,
      transition: shot.transition,
      text_allowance_ja: shot.text_allowance_ja,
      asset_requirement_ids: shot.asset_requirement_ids,
      asset_summary_ja: shot.asset_summary_ja,
      glossary_term_ids: shot.glossary_term_ids,
      planning_only: true
    };
  });
  return renderCsv(rows, Object.keys(rows[0]));
}

function renderGlossaryCsv(model) {
  return renderCsv(model.glossary, ["term_id", "term_ja", "category", "definition_ja", "uncertainty_preserved"]);
}

function renderAssetCsv(model) {
  const rows = model.asset_operations.map(function (asset) {
    return {
      requirement_id: asset.requirement_id,
      asset_class: asset.asset_class,
      one_line_requirement_ja: asset.one_line_requirement_ja,
      operation_scope: asset.operation_scope,
      quantity: asset.quantity,
      quantity_unit: asset.quantity_unit,
      shot_usage: asset.shot_usage,
      requirements_ja: asset.requirements_ja,
      asset_status: asset.state.asset_status,
      rights_status: asset.state.rights_status,
      provenance_required: asset.state.provenance_required,
      owner: asset.owner,
      next_move: asset.next_move
    };
  });
  return renderCsv(rows, Object.keys(rows[0]));
}

function renderReadme(model) {
  return [
    "# Production Storyboard Brief",
    "",
    "既存Production Execution Packを一切変更せず、3分・6幕・19ショットを人が絵コンテから理解するための独立したローカル資料です。",
    "",
    "- Artifact: " + model.artifact_id,
    "- Status: provisional / planning only / not canonical / not production-approved",
    "- Scale: 180 seconds / 6 beats / 19 storyboard frames / 20 subtitle cues / 6 narration segments / 14 generic asset requirements",
    "- Default theme: Auto (Light / Dark / Auto)",
    "",
    "## 読む順番",
    "",
    "1. production-storyboard-brief.html で前提、中心質問、六文概要、用語、19枚を読む",
    "2. 各frameの「ねらい」「成立させること」「描かないこと」を同じまとまりで確認する",
    "3. 必要なときだけ閉じた制作準備付録を開く",
    "4. CSVはID突合や制作見積りに使い、story理解の入口にはしない",
    "",
    "## Validation",
    "",
    "Read-only: node tools/fff-state.mjs validate-production-storyboard-brief artifacts/production-storyboard-brief-result.json",
    "Regenerate: node tools/fff-state.mjs smoke-production-storyboard-brief artifacts/production-storyboard-brief-result.json",
    "",
    "SVGは構図計画のみで、完成画ではありません。asset、rights、engine、voice、audio、render、publication、database、canonは未承認のままです。",
    ""
  ].join("\n");
}

function splitSvgLabel(label) {
  const value = String(label);
  if (value.length <= 18) return [value];
  const pivot = Math.min(18, Math.max(10, Math.ceil(value.length / 2)));
  return [value.slice(0, pivot), value.slice(pivot)];
}

function renderStoryboardSvg(shot, index) {
  const safeId = shot.shot_id.replace(/[^a-z0-9-]/gi, "-");
  const labels = splitSvgLabel(shot.what_is_seen_ja);
  const focalX = 310 + (index % 4) * 210;
  const focalY = 235 + (index % 3) * 95;
  const scaleWidth = { wide: 820, medium: 610, close: 430, extreme_close: 290, graphic_fullframe: 1050 }[shot.scale] || 600;
  const scaleHeight = Math.round(scaleWidth * 0.48);
  const labelTspans = labels.map(function (label, labelIndex) {
    return '<tspan x="800" dy="' + (labelIndex === 0 ? 0 : 42) + '">' + escapeHtml(label) + "</tspan>";
  }).join("");
  const motionLine = shot.motion === "locked"
    ? '<path class="motion-mark" d="M1260 160h150m-150 0v70m150-70v70"/><text class="motion-text" x="1335" y="270">LOCKED</text>'
    : '<path class="motion-mark" d="M1210 205h210m-52-48 52 48-52 48"/><text class="motion-text" x="1315" y="285">' + escapeHtml(shot.motion) + "</text>";
  return [
    '<svg class="storyboard-svg" data-storyboard-svg="true" data-shot-id="' + escapeHtml(shot.shot_id) + '" data-planning-only="true" data-focal-label="' + escapeHtml(shot.what_is_seen_ja) + '" data-motion="' + escapeHtml(shot.motion) + '" viewBox="0 0 1600 900" role="img" aria-labelledby="svg-title-' + safeId + ' svg-desc-' + safeId + '">',
    '<title id="svg-title-' + safeId + '">' + escapeHtml(shot.shot_id + " " + shot.what_is_seen_ja) + "</title>",
    '<desc id="svg-desc-' + safeId + '">構図計画のみ。焦点は' + escapeHtml(shot.what_is_seen_ja) + "。動きは" + escapeHtml(shot.motion) + "。完成画ではありません。</desc>",
    '<rect class="frame-bg" width="1600" height="900" rx="18"/>',
    '<path class="frame-grid" d="M533 0v900M1066 0v900M0 300h1600M0 600h1600"/>',
    '<rect class="safe-frame" x="88" y="70" width="1424" height="760" rx="12"/>',
    '<circle class="scene-shape" cx="' + focalX + '" cy="' + focalY + '" r="118"/>',
    '<rect class="scene-shape secondary" x="' + (focalX + 180) + '" y="' + (focalY + 95) + '" width="' + scaleWidth + '" height="' + scaleHeight + '" rx="18"/>',
    '<path class="focus-mark" d="M' + (focalX - 145) + " " + (focalY - 145) + "h290v290h-290z" + '"/>',
    '<path class="focus-cross" d="M' + (focalX - 175) + " " + focalY + "h350M" + focalX + " " + (focalY - 175) + "v350" + '"/>',
    motionLine,
    '<rect class="focal-label-bg" x="300" y="685" width="1000" height="118" rx="12"/>',
    '<text class="focal-label" x="800" y="' + (labels.length > 1 ? 732 : 758) + '" text-anchor="middle">' + labelTspans + "</text>",
    '<text class="planning-label" x="110" y="855">構図計画のみ・完成画ではありません</text>',
    '<text class="shot-label" x="1490" y="855" text-anchor="end">' + escapeHtml(shot.shot_id) + "</text>",
    "</svg>"
  ].join("");
}

function renderTermLinks(ids, glossaryMap) {
  return ids.map(function (id) {
    const term = glossaryMap.get(id);
    return '<a class="term-chip" data-glossary-ref="' + escapeHtml(id) + '" href="#glossary-' + escapeHtml(id) + '">' + escapeHtml(term ? term.term_ja : id) + "</a>";
  }).join("");
}

function renderShotArticle(shot, index, glossaryMap) {
  return [
    '<article class="shot-row" data-storyboard-shot="true" data-shot-id="' + escapeHtml(shot.shot_id) + '">',
    '<div class="shot-frame-column">',
    '<figure class="shot-figure">',
    renderStoryboardSvg(shot, index),
    '<figcaption><span>' + escapeHtml(shot.start_time + "–" + shot.end_time + " / " + shot.duration_seconds + "秒") + '</span><span>' + escapeHtml(shot.scale + " · " + shot.motion + " · " + shot.transition) + "</span></figcaption>",
    "</figure>",
    "</div>",
    '<div class="shot-copy-column">',
    '<header class="shot-head"><p class="shot-sequence">SHOT ' + String(shot.sequence).padStart(2, "0") + '</p><h3>' + escapeHtml(shot.what_is_seen_ja) + '</h3><code>' + escapeHtml(shot.shot_id) + "</code></header>",
    '<dl class="shot-semantics">',
    '<div data-shot-field="what-is-seen"><dt>画面に見えるもの</dt><dd><strong>' + escapeHtml(shot.what_is_seen_ja) + "</strong><span>" + escapeHtml(shot.visual_direction) + "</span></dd></div>",
    '<div data-shot-field="purpose"><dt>ねらい</dt><dd>' + escapeHtml(shot.purpose_ja) + "</dd></div>",
    '<div class="positive" data-shot-field="positive-condition"><dt>成立させること</dt><dd>' + escapeHtml(shot.positive_condition_ja) + "</dd></div>",
    '<div class="negative" data-shot-field="negative-guard"><dt>描かないこと</dt><dd>' + escapeHtml(shot.negative_guard_ja) + "</dd></div>",
    "</dl>",
    '<div class="shot-rail" data-shot-field="operations">',
    '<p><span>尺</span><strong>' + escapeHtml(shot.duration_seconds + "秒") + "</strong></p>",
    '<p><span>文字</span><strong>' + escapeHtml(shot.text_allowance_ja) + "</strong></p>",
    '<p class="asset-summary"><span>一行素材要約</span><strong>' + escapeHtml(shot.asset_summary_ja) + "</strong></p>",
    "</div>",
    '<div class="term-links" aria-label="このshotの用語">' + renderTermLinks(shot.glossary_term_ids, glossaryMap) + "</div>",
    "</div>",
    "</article>"
  ].join("");
}

function renderAssetGroup(items, label) {
  const rows = items.map(function (asset) {
    return [
      '<li data-asset-operation="' + escapeHtml(asset.requirement_id) + '">',
      '<header><code>' + escapeHtml(asset.requirement_id) + '</code><span>' + escapeHtml(asset.operation_scope) + "</span></header>",
      '<p class="one-line-requirement">' + escapeHtml(asset.one_line_requirement_ja) + "</p>",
      '<dl>',
      '<div><dt>Purpose</dt><dd>' + escapeHtml(asset.purpose_ja) + "</dd></div>",
      '<div><dt>Effect</dt><dd>' + escapeHtml(asset.effect_ja) + "</dd></div>",
      '<div><dt>Requirements</dt><dd>' + escapeHtml(asset.requirements_ja) + "</dd></div>",
      '<div><dt>State</dt><dd>' + escapeHtml(asset.state.asset_status + " / rights " + asset.state.rights_status + " / provenance " + asset.state.provenance_required) + "</dd></div>",
      '<div><dt>Owner</dt><dd>' + escapeHtml(asset.owner) + "</dd></div>",
      '<div><dt>Next move</dt><dd>' + escapeHtml(asset.next_move) + "</dd></div>",
      "</dl>",
      "</li>"
    ].join("");
  }).join("");
  return '<section class="asset-group" data-asset-scope="' + escapeHtml(label) + '"><h3>' + escapeHtml(label) + "</h3><ul>" + rows + "</ul></section>";
}

function renderHtml(model) {
  const glossaryMap = new Map(model.glossary.map(function (item) { return [item.term_id, item]; }));
  const overview = model.overview_sentences.map(function (sentence, index) {
    return '<li data-overview-sentence="true"><span>' + String(index + 1).padStart(2, "0") + "</span><p>" + escapeHtml(sentence) + "</p></li>";
  }).join("");
  const glossary = model.glossary.map(function (item) {
    return [
      '<div class="glossary-entry" id="glossary-' + escapeHtml(item.term_id) + '" data-glossary-entry="' + escapeHtml(item.term_id) + '">',
      '<dt>' + escapeHtml(item.term_ja) + '<small>' + escapeHtml(item.category) + "</small></dt>",
      '<dd>' + escapeHtml(item.definition_ja) + "</dd>",
      "</div>"
    ].join("");
  }).join("");
  const beatSections = model.beats.map(function (beat) {
    const beatShots = model.shots.filter(function (shot) { return shot.beat_id === beat.beat_id; });
    const shotHtml = beatShots.map(function (shot) { return renderShotArticle(shot, shot.sequence - 1, glossaryMap); }).join("");
    return [
      '<section class="beat-section" id="beat-' + beat.beat_number + '" data-storyboard-beat="true" data-beat-number="' + beat.beat_number + '">',
      '<header class="beat-header">',
      '<div><p class="beat-number">BEAT ' + String(beat.beat_number).padStart(2, "0") + '</p><h2>' + escapeHtml(beat.title_ja) + "</h2></div>",
      '<div class="beat-time"><strong>' + escapeHtml(beat.start_time + "–" + beat.end_time) + "</strong><span>" + beat.duration_seconds + "秒 · " + beatShots.length + " shots</span></div>",
      '<p class="beat-purpose">' + escapeHtml(beat.purpose_ja) + "</p>",
      '<p class="beat-completion"><span>幕の成立</span>' + escapeHtml(beat.completion_statement_ja) + "</p>",
      '<div class="term-links beat-terms">' + renderTermLinks(beat.glossary_term_ids, glossaryMap) + "</div>",
      "</header>",
      '<div class="shot-list">' + shotHtml + "</div>",
      "</section>"
    ].join("");
  }).join("");
  const commonAssets = model.asset_operations.filter(function (asset) { return asset.operation_scope === "common"; });
  const reusableAssets = model.asset_operations.filter(function (asset) { return asset.operation_scope === "reusable"; });
  const specificAssets = model.asset_operations.filter(function (asset) { return asset.operation_scope === "beat_specific"; });
  const css = [
    ":root{color-scheme:light;--title-size:40px;--appendix-hit-min:48px;--bg:#f4f1e8;--panel:#fffdfa;--text:#171a1d;--muted:#4c5962;--accent:#8b4b19;--line:#c9c2b3;--soft:#e9e2d4;--positive:#245d45;--negative:#8c342d;--frame-bg:#e8e3d8;--frame-ink:#27343a;--frame-soft:#8c999f}",
    "html[data-theme=light]{color-scheme:light;--bg:#f4f1e8;--panel:#fffdfa;--text:#171a1d;--muted:#4c5962;--accent:#8b4b19;--line:#c9c2b3;--soft:#e9e2d4;--positive:#245d45;--negative:#8c342d;--frame-bg:#e8e3d8;--frame-ink:#27343a;--frame-soft:#8c999f}",
    "html[data-theme=dark]{color-scheme:dark;--bg:#101820;--panel:#18232d;--text:#f2f5f7;--muted:#b9c6cf;--accent:#f4b36f;--line:#40515d;--soft:#22313c;--positive:#91d8b6;--negative:#ffaaa3;--frame-bg:#111c24;--frame-ink:#dbe6ec;--frame-soft:#6e8491}",
    "@media(prefers-color-scheme:dark){html[data-theme=auto]{color-scheme:dark;--bg:#101820;--panel:#18232d;--text:#f2f5f7;--muted:#b9c6cf;--accent:#f4b36f;--line:#40515d;--soft:#22313c;--positive:#91d8b6;--negative:#ffaaa3;--frame-bg:#111c24;--frame-ink:#dbe6ec;--frame-soft:#6e8491}}",
    "*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--text);font-family:\"Yu Gothic UI\",\"Hiragino Kaku Gothic ProN\",system-ui,sans-serif;font-size:16px;line-height:1.7}a{color:inherit}button,a,summary{touch-action:manipulation}",
    ".utility{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:9px max(18px,calc((100vw - 1180px)/2));background:color-mix(in srgb,var(--bg) 94%,transparent);border-bottom:1px solid var(--line);backdrop-filter:blur(12px)}.utility a{text-decoration:none;font-size:13px;font-weight:700}.theme-controls{display:flex;align-items:center;gap:5px}.theme-controls span{margin-right:5px;color:var(--muted);font-size:11px}.theme-controls button{min-width:54px;min-height:36px;padding:5px 10px;border:1px solid var(--line);border-radius:999px;background:var(--panel);color:var(--text);font:700 12px inherit}.theme-controls button[aria-pressed=true]{background:var(--text);color:var(--panel);border-color:var(--text)}",
    "main{width:min(1180px,calc(100% - 36px));margin:0 auto;padding-bottom:90px}.hero{padding:44px 0 36px;border-bottom:3px solid var(--text)}.eyebrow{margin:0 0 8px;color:var(--accent);font-size:12px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}.hero h1{max-width:19ch;margin:0;font-family:\"Yu Mincho\",\"Hiragino Mincho ProN\",serif;font-size:var(--title-size);line-height:1.1;letter-spacing:-.025em;text-wrap:balance}.premise{max-width:72ch;margin:17px 0 10px;font-size:18px;font-weight:700}.question{max-width:72ch;margin:0;padding-left:13px;border-left:4px solid var(--accent);color:var(--muted)}.question strong{color:var(--text)}.metric-strip{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:22px}.metric{padding:10px 12px;background:var(--panel);border-top:3px solid var(--accent)}.metric strong{display:block;font-size:22px;line-height:1.2}.metric span{display:block;margin-top:3px;color:var(--muted);font-size:11px;font-weight:700}.boundary-note{margin:12px 0 0;color:var(--muted);font-size:12px}",
    ".section-intro{padding:42px 0 16px}.section-intro .kicker,.beat-number,.shot-sequence{margin:0;color:var(--accent);font-size:11px;font-weight:900;letter-spacing:.13em}.section-intro h2,.beat-header h2{margin:3px 0;font-family:\"Yu Mincho\",\"Hiragino Mincho ProN\",serif;font-size:30px;line-height:1.2}.section-intro>p:last-child{max-width:70ch;color:var(--muted)}",
    ".overview-list{margin:0;padding:0;list-style:none;border-top:1px solid var(--line)}.overview-list li{display:grid;grid-template-columns:44px minmax(0,1fr);gap:12px;padding:11px 0;border-bottom:1px solid var(--line)}.overview-list span{color:var(--accent);font:800 12px ui-monospace,monospace}.overview-list p{margin:0}",
    ".glossary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));margin:0;border-top:1px solid var(--line)}.glossary-entry{display:grid;grid-template-columns:minmax(120px,.55fr) minmax(0,1.45fr);gap:14px;padding:12px 12px 12px 0;border-bottom:1px solid var(--line)}.glossary-entry:nth-child(odd){margin-right:16px}.glossary-entry dt{font-weight:800}.glossary-entry dt small{display:block;color:var(--accent);font:10px ui-monospace,monospace}.glossary-entry dd{margin:0;color:var(--muted);font-size:13px}",
    ".beat-section{padding:48px 0 4px;border-top:2px solid var(--text)}.beat-header{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px 24px;padding-bottom:18px}.beat-time{text-align:right}.beat-time strong,.beat-time span{display:block}.beat-time span{color:var(--muted);font-size:12px}.beat-purpose{grid-column:1/-1;max-width:72ch;margin:5px 0}.beat-completion{grid-column:1/-1;margin:0;padding:8px 12px;background:var(--soft);font-size:13px}.beat-completion span{margin-right:9px;color:var(--accent);font-weight:900}.beat-terms{grid-column:1/-1}",
    ".shot-list{border-top:1px solid var(--line)}.shot-row{display:grid;grid-template-columns:minmax(0,.96fr) minmax(0,1.04fr);gap:22px;padding:24px 0;border-bottom:1px solid var(--line);min-width:0}.shot-frame-column,.shot-copy-column{min-width:0}.shot-figure{margin:0}.storyboard-svg{display:block;width:100%;height:auto;border:1px solid var(--line);border-radius:8px}.frame-bg{fill:var(--frame-bg)}.frame-grid{fill:none;stroke:var(--frame-soft);stroke-width:2;stroke-dasharray:12 18;opacity:.55}.safe-frame{fill:none;stroke:var(--frame-ink);stroke-width:4;stroke-dasharray:18 12}.scene-shape{fill:var(--soft);stroke:var(--frame-ink);stroke-width:8}.scene-shape.secondary{fill:none;stroke-width:5}.focus-mark,.focus-cross{fill:none;stroke:var(--accent);stroke-width:8}.focus-cross{stroke-dasharray:14 16;opacity:.8}.motion-mark{fill:none;stroke:var(--frame-ink);stroke-width:8}.motion-text,.planning-label,.shot-label{fill:var(--frame-ink);font:700 24px system-ui,sans-serif}.motion-text{text-anchor:middle}.planning-label,.shot-label{font-size:22px}.focal-label-bg{fill:var(--panel);stroke:var(--line);stroke-width:3}.focal-label{fill:var(--text);font:800 34px \"Yu Gothic UI\",sans-serif}.shot-figure figcaption{display:flex;justify-content:space-between;gap:10px;margin-top:5px;color:var(--muted);font-size:11px}",
    ".shot-head{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:start;gap:2px 12px}.shot-head .shot-sequence{grid-column:1/-1}.shot-head h3{margin:0;font-family:\"Yu Mincho\",\"Hiragino Mincho ProN\",serif;font-size:23px;line-height:1.28}.shot-head code{color:var(--muted);font:11px ui-monospace,monospace}.shot-semantics{margin:12px 0 0}.shot-semantics>div{display:grid;grid-template-columns:116px minmax(0,1fr);gap:10px;padding:7px 0;border-top:1px solid var(--line)}.shot-semantics dt{color:var(--muted);font-size:11px;font-weight:800}.shot-semantics dd{margin:0;font-size:13px}.shot-semantics dd span{display:block;margin-top:3px;color:var(--muted)}.shot-semantics .positive dt{color:var(--positive)}.shot-semantics .negative dt{color:var(--negative)}.shot-rail{display:grid;grid-template-columns:80px minmax(0,.8fr) minmax(0,1.4fr);gap:8px;margin-top:10px;padding:8px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.shot-rail p{margin:0;min-width:0}.shot-rail span,.shot-rail strong{display:block}.shot-rail span{color:var(--muted);font-size:10px}.shot-rail strong{font-size:11px;overflow-wrap:anywhere}.term-links{display:flex;flex-wrap:wrap;gap:5px;margin-top:9px}.term-chip{padding:2px 7px;border:1px solid var(--line);border-radius:999px;color:var(--muted);font-size:10px;text-decoration:none}",
    ".appendix-wrap{padding-top:52px}.production-appendix{border-top:3px solid var(--text);border-bottom:1px solid var(--line)}.production-appendix summary{display:flex;align-items:center;justify-content:space-between;gap:16px;width:100%;min-height:var(--appendix-hit-min);padding:10px 2px;cursor:pointer;font-weight:900}.production-appendix summary::marker{color:var(--accent)}.appendix-state .when-open{display:none}.production-appendix[open] .appendix-state .when-open{display:inline}.production-appendix[open] .appendix-state .when-closed{display:none}.appendix-state{color:var(--accent);font-size:12px}.appendix-body{padding:18px 0 30px}.appendix-lede{max-width:76ch;color:var(--muted)}.asset-group{padding:18px 0;border-top:1px solid var(--line)}.asset-group h3{margin:0 0 8px}.asset-group ul{margin:0;padding:0;list-style:none}.asset-group li{padding:12px 0;border-top:1px dotted var(--line)}.asset-group li header{display:flex;justify-content:space-between;gap:10px}.asset-group li header span{color:var(--accent);font-size:11px;font-weight:800}.one-line-requirement{margin:4px 0;font-weight:800}.asset-group dl{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin:8px 0 0}.asset-group dl div{padding:7px;background:var(--soft)}.asset-group dt{color:var(--muted);font-size:10px;font-weight:800}.asset-group dd{margin:1px 0 0;font-size:11px}.appendix-boundary{padding:12px;border-left:4px solid var(--accent);background:var(--soft);font-size:12px}",
    ".page-footer{padding:28px 0;color:var(--muted);font-size:12px}",
    "@media(max-width:1049px){.shot-row{grid-template-columns:minmax(0,1fr)}.shot-frame-column{max-width:760px}.asset-group dl{grid-template-columns:repeat(2,minmax(0,1fr))}}",
    "@media(max-width:979px){:root{--title-size:36px}.hero{padding-top:32px}.glossary{grid-template-columns:minmax(0,1fr)}.glossary-entry:nth-child(odd){margin-right:0}}",
    "@media(max-width:680px){body{font-size:15px}.utility{align-items:flex-start;flex-direction:column}.metric-strip{grid-template-columns:repeat(2,minmax(0,1fr))}.beat-header{grid-template-columns:minmax(0,1fr)}.beat-time{text-align:left}.shot-semantics>div{grid-template-columns:minmax(0,1fr)}.shot-rail{grid-template-columns:minmax(0,1fr)}.glossary-entry{grid-template-columns:minmax(0,1fr)}.asset-group dl{grid-template-columns:minmax(0,1fr)}}",
    "@media print{@page{size:A4 portrait;margin:11mm}:root,html[data-theme=dark],html[data-theme=auto],html[data-theme=light]{color-scheme:light;--bg:#fff;--panel:#fff;--text:#000;--muted:#333;--accent:#6b3d12;--line:#aaa;--soft:#eee;--positive:#174a35;--negative:#6f211c;--frame-bg:#f3f3f3;--frame-ink:#111;--frame-soft:#777}.utility,.theme-controls,.term-links{display:none!important}body{background:#fff;font-size:9pt}main{width:100%;padding:0}.hero{padding-top:0}.hero h1{font-size:26pt}.shot-row{grid-template-columns:minmax(0,42fr) minmax(0,58fr);gap:10px;break-inside:avoid}.beat-section{break-before:page}.storyboard-svg{border-color:#777}.production-appendix{break-before:page}.page-footer{display:none}}"
  ].join("");
  const script = [
    "(function(){",
    "var root=document.documentElement;",
    "var buttons=Array.from(document.querySelectorAll('[data-theme-choice]'));",
    "var key='fff-production-storyboard-theme';",
    "function allowed(value){return value==='light'||value==='dark'||value==='auto';}",
    "function apply(value,persist){var next=allowed(value)?value:'auto';root.dataset.theme=next;buttons.forEach(function(button){button.setAttribute('aria-pressed',String(button.dataset.themeChoice===next));});if(persist){try{localStorage.setItem(key,next);}catch(error){}}}",
    "var initial='auto';try{var stored=localStorage.getItem(key);if(allowed(stored))initial=stored;}catch(error){}",
    "apply(initial,false);",
    "buttons.forEach(function(button){button.addEventListener('click',function(){apply(button.dataset.themeChoice,true);});});",
    "document.querySelectorAll('[data-production-appendix]').forEach(function(details){details.addEventListener('toggle',function(){details.dataset.disclosureState=details.open?'open':'closed';});});",
    "root.dataset.themeReady='true';",
    "})();"
  ].join("");
  return [
    "<!doctype html>",
    '<html lang="ja" data-theme="auto" data-theme-default="auto">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    '<meta name="color-scheme" content="light dark">',
    '<link rel="icon" href="data:,">',
    "<title>Production Storyboard Brief</title>",
    "<style>" + css + "</style>",
    "</head>",
    '<body data-production-storyboard-brief="true">',
    '<nav class="utility" aria-label="資料操作"><a href="../../public/review/index.html?mode=blueprint">← Blueprintへ戻る</a><div class="theme-controls" data-theme-controls="true"><span>Theme</span><button type="button" data-theme-choice="light" aria-pressed="false">Light</button><button type="button" data-theme-choice="dark" aria-pressed="false">Dark</button><button type="button" data-theme-choice="auto" aria-pressed="true">Auto</button></div></nav>',
    "<main>",
    '<div data-primary-content="true">',
    '<header class="hero" data-first-view-contract="true">',
    '<p class="eyebrow">Production Storyboard Brief · provisional</p>',
    '<h1 data-title-900-px="36" data-title-1280-px="40">物語を、19枚の絵コンテで読む。</h1>',
    '<p class="premise" data-first-view-premise="true">' + escapeHtml(model.premise_ja) + "</p>",
    '<p class="question" data-first-view-question="true"><strong>中心に残る問い：</strong>' + escapeHtml(model.central_question_ja) + "</p>",
    '<div class="metric-strip"><div class="metric"><strong>180秒</strong><span>総尺</span></div><div class="metric"><strong>6</strong><span>beats</span></div><div class="metric"><strong>19</strong><span>storyboard frames</span></div><div class="metric"><strong>provisional</strong><span>未確定を保持</span></div></div>',
    '<p class="boundary-note">構図計画のみ。完成画、asset選定、rights clearance、render、publication、canon承認ではありません。</p>',
    "</header>",
    '<section id="overview"><header class="section-intro"><p class="kicker">STORY IN SIX SENTENCES</p><h2>三分の流れ</h2><p>各幕のviewer takeawayを一文ずつ、source順のまま読む。</p></header><ol class="overview-list">' + overview + "</ol></section>",
    '<section id="glossary"><header class="section-intro"><p class="kicker">CORE GLOSSARY</p><h2>先に知っておく用語</h2><p>人、組織、場所、物、文書、反復時刻、未解決の選択を、未確定のまま定義する。</p></header><dl class="glossary">' + glossary + "</dl></section>",
    '<section id="storyboard"><header class="section-intro"><p class="kicker">19 PLANNING FRAMES</p><h2>六幕の絵コンテ</h2><p>各frameは16:9の低忠実度SVG。説明文より先に構図を見て、肯定条件と否定guardを隣接して読む。</p></header>' + beatSections + "</section>",
    "</div>",
    '<section class="appendix-wrap" id="production-appendix"><details class="production-appendix" data-production-appendix="true" data-disclosure-state="closed"><summary><span>制作準備付録 · 14 asset requirements</span><span class="appendix-state"><span class="when-closed">制作準備付録を開く</span><span class="when-open">制作準備付録を閉じる</span></span></summary><div class="appendix-body"><p class="appendix-lede">primaryのstory理解から分離した、制作見積りとrights reviewのためのoperational appendixです。14件はすべてunselected / not_reviewed / provenance required。</p>' +
      renderAssetGroup(commonAssets, "common") +
      renderAssetGroup(reusableAssets, "reusable") +
      renderAssetGroup(specificAssets, "beat_specific") +
      '<p class="appendix-boundary">この付録はasset、font、engine、voice、audio、provider、generation、render、upload、database、canonを選定・承認しません。</p></div></details></section>',
    '<footer class="page-footer">Source: preserved Production Execution Pack · local planning only · no external resources</footer>',
    "</main>",
    "<script>" + script + "</script>",
    "</body>",
    "</html>",
    ""
  ].join("\n");
}

function packageFingerprint(entries) {
  const material = entries.map(function (entry) {
    return entry.relative_path + "|" + entry.byte_size + "|" + entry.sha256;
  }).join("\n");
  return sha256(Buffer.from(material, "utf8"));
}

function buildManifest(files, model) {
  const inventory = PAYLOAD_FILES.map(function (relativePath) {
    return {
      relative_path: relativePath,
      byte_size: files[relativePath].byteLength,
      sha256: sha256(files[relativePath])
    };
  });
  return {
    schemaVersion: MANIFEST_SCHEMA_VERSION,
    artifact_id: ARTIFACT_ID,
    generatedAt: GENERATED_AT,
    package_root: ROOT,
    source_artifact_id: SOURCE_ARTIFACT_ID,
    source_fingerprints: clone(SOURCE_FINGERPRINTS),
    files: inventory,
    package_fingerprint_sha256: packageFingerprint(inventory),
    counts: clone(model.counts),
    beat_shot_grouping: clone(GROUPING),
    default_theme: "auto",
    theme_modes: ["light", "dark", "auto"],
    canonical: false,
    production_approved: false,
    assets_selected: false,
    rights_cleared_claim: false,
    local_only: true,
    passed: true,
    failures: []
  };
}

function renderFiles(model) {
  const files = {
    "README_STORYBOARD_BRIEF.md": textBuffer(renderReadme(model)),
    "production-storyboard-brief.html": textBuffer(renderHtml(model)),
    "production-storyboard-brief.json": jsonBuffer(model),
    "storyboard-shot-map.csv": textBuffer(renderShotCsv(model)),
    "story-glossary.csv": textBuffer(renderGlossaryCsv(model)),
    "asset-operations-summary.csv": textBuffer(renderAssetCsv(model))
  };
  files["production-storyboard-brief-manifest.json"] = jsonBuffer(buildManifest(files, model));
  return files;
}

async function buildArtifacts() {
  try {
    const source = await readSource();
    if (!source.valid) return { valid: false, errors: source.errors, source, model: null, files: {} };
    const model = buildModel(source);
    const modelValidation = validateModel(model, model);
    if (!modelValidation.valid) return { valid: false, errors: modelValidation.errors, source, model, files: {} };
    const files = renderFiles(model);
    const candidate = validateCandidate(files, files, model);
    return { valid: candidate.valid, errors: candidate.errors, source, model, files };
  } catch (error) {
    return { valid: false, errors: [error.message], source: null, model: null, files: {} };
  }
}

async function writeArtifacts(files) {
  const actual = Object.keys(files || {}).sort();
  const allowed = [...REQUIRED_FILES].sort();
  if (JSON.stringify(actual) !== JSON.stringify(allowed)) throw new Error("refusing package write outside exact seven-file inventory");
  await mkdir(ROOT, { recursive: true });
  for (const relativePath of REQUIRED_FILES) await writeFile(ROOT + "/" + relativePath, files[relativePath]);
}

function hexRgb(value) {
  const match = String(value || "").match(/^#([0-9a-f]{6})$/i);
  if (!match) return null;
  return [0, 2, 4].map(function (offset) { return parseInt(match[1].slice(offset, offset + 2), 16) / 255; });
}

function relativeLuminance(value) {
  const rgb = hexRgb(value);
  if (!rgb) return null;
  const linear = rgb.map(function (channel) {
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(left, right) {
  const l1 = relativeLuminance(left);
  const l2 = relativeLuminance(right);
  if (l1 == null || l2 == null) return 0;
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function exactArray(left, right) {
  return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every(function (value, index) { return value === right[index]; });
}

function validateModel(model, expectedModel) {
  const errors = [];
  const add = function (condition, message) { if (!condition) errors.push(message); };
  const beats = Array.isArray(model && model.beats) ? model.beats : [];
  const shots = Array.isArray(model && model.shots) ? model.shots : [];
  const glossary = Array.isArray(model && model.glossary) ? model.glossary : [];
  const assets = Array.isArray(model && model.asset_operations) ? model.asset_operations : [];
  add(model && model.schemaVersion === SCHEMA_VERSION && model.artifact_id === ARTIFACT_ID, "storyboard model identity mismatch");
  add(model && model.status === "provisional_storyboard_planning_brief" && model.provisional === true && model.route === HTML_PATH, "storyboard route or provisional state mismatch");
  add(model && model.source && model.source.artifact_id === SOURCE_ARTIFACT_ID && JSON.stringify(model.source.fingerprints) === JSON.stringify(SOURCE_FINGERPRINTS), "storyboard source fingerprints changed");
  add(model && model.source && model.source.source_package_aggregate_sha256 === SOURCE_FINGERPRINTS.production_execution_nine_file_aggregate_sha256, "storyboard source aggregate changed");
  add(model && model.counts && model.counts.total_duration_seconds === 180 && model.counts.beat_count === 6 && model.counts.shot_count === 19 && model.counts.subtitle_count === 20 && model.counts.narration_segment_count === 6 && model.counts.asset_requirement_count === 14 && model.counts.glossary_count === GLOSSARY.length, "storyboard counts mismatch");
  add(model && model.voice_planning && model.voice_planning.voice_mode === "synthetic" &&
    model.voice_planning.human_articulation_check_required === false &&
    model.voice_planning.engine_selected === false && model.voice_planning.voice_selected === false &&
    model.voice_planning.audio_generated === false && model.voice_planning.engine_calibration_pending === true &&
    model.voice_planning.actual_engine_timing_measured === false && Boolean(model.voice_planning.provenance_note),
  "synthetic voice planning state was not preserved");
  add(Array.isArray(model && model.overview_sentences) && model.overview_sentences.length === 6 && model.overview_sentences.every(Boolean), "six-sentence overview mismatch");
  add(exactArray(model && model.beat_shot_grouping, GROUPING), "beat shot grouping mismatch");
  add(beats.length === 6 && new Set(beats.map(function (beat) { return beat.beat_id; })).size === 6, "six beat identity mismatch");
  add(exactArray(beats.map(function (beat) { return beat.shot_ids.length; }), GROUPING), "beat grouping does not equal 3/3/3/3/4/3");
  add(beats.reduce(function (sum, beat) { return sum + Number(beat.duration_seconds || 0); }, 0) === 180, "beat duration does not total 180 seconds");
  add(beats.reduce(function (sum, beat) { return sum + Number(beat.subtitle_count || 0); }, 0) === 20, "beat subtitle count does not total 20");
  add(beats.every(function (beat, index) {
    return beat.shot_count === GROUPING[index] && beat.shot_count === beat.shot_ids.length &&
      beat.narration && beat.narration.segment_id && beat.narration.text &&
      beat.narration.engine_timing_verified === false &&
      ["proxy_headroom_confirmed", "existing_pass_unmeasured"].includes(beat.narration.timing_state);
  }) && new Set(beats.map(function (beat) { return beat.narration.segment_id; })).size === 6, "six source narration segments were not preserved");
  const shotIds = shots.map(function (shot) { return shot.shot_id; });
  add(shots.length === 19 && new Set(shotIds).size === 19, "missing or duplicate storyboard shot");
  add(shots.every(function (shot, index) { return shot.sequence === index + 1; }), "storyboard shot sequence mismatch");
  const glossaryIds = glossary.map(function (entry) { return entry.term_id; });
  const glossaryIdSet = new Set(glossaryIds);
  add(glossary.length === GLOSSARY.length && new Set(glossaryIds).size === GLOSSARY.length, "glossary term inventory mismatch");
  add(glossary.every(function (entry) { return entry.term_id && entry.term_ja && entry.category && entry.definition_ja && entry.uncertainty_preserved === true; }), "glossary entry incomplete or uncertainty lost");
  const referencedTerms = new Set();
  for (const beat of beats) {
    add(Array.isArray(beat.glossary_term_ids) && beat.glossary_term_ids.every(function (id) { referencedTerms.add(id); return glossaryIdSet.has(id); }), "unresolved beat glossary reference: " + beat.beat_id);
  }
  for (const shot of shots) {
    const expectedDoneWhen = "「" + shot.what_is_seen_ja + "」へ最初に視線が集まり、" + shot.negative_guard_ja;
    add(shot.source_done_when === expectedDoneWhen, "split shot semantics do not reconstruct source done_when: " + shot.shot_id);
    add(shot.positive_condition_ja === "「" + shot.what_is_seen_ja + "」へ最初に視線が集まること。", "positive success condition changed: " + shot.shot_id);
    add(!shot.positive_condition_ja.includes(shot.negative_guard_ja) && !shot.positive_condition_ja.includes("しない"), "positive success and negative guard are mixed: " + shot.shot_id);
    add(shot.negative_guard_ja && shot.visual_direction && shot.purpose_ja && shot.text_allowance_ja, "shot semantic field missing: " + shot.shot_id);
    add(shot.frame && shot.frame.kind === "planning_only_inline_svg" && shot.frame.aspect_ratio === "16:9" && shot.frame.focal_label_ja === shot.what_is_seen_ja && shot.frame.motion === shot.motion && shot.frame.final_art === false, "shot SVG plan contract mismatch: " + shot.shot_id);
    add(Array.isArray(shot.glossary_term_ids) && shot.glossary_term_ids.length > 0 && shot.glossary_term_ids.every(function (id) { referencedTerms.add(id); return glossaryIdSet.has(id); }), "unresolved shot glossary reference: " + shot.shot_id);
    add(Array.isArray(shot.asset_requirement_ids) && shot.asset_requirement_ids.length > 0 && Boolean(shot.asset_summary_ja), "shot asset summary missing: " + shot.shot_id);
    add(shot.source_asset_status === "unselected" && shot.source_rights_status === "not_cleared" && shot.requirement_asset_status === "unselected" && shot.requirement_rights_status === "not_reviewed" && shot.requirement_provenance_required === true, "shot source or requirement state changed: " + shot.shot_id);
  }
  add(glossaryIds.every(function (id) { return referencedTerms.has(id); }), "glossary contains an unreferenced core term");
  add(assets.length === 14 && new Set(assets.map(function (asset) { return asset.requirement_id; })).size === 14, "14 asset requirement inventory mismatch");
  add(assets.every(function (asset) {
    return ["common", "reusable", "beat_specific"].includes(asset.operation_scope) &&
      asset.one_line_requirement_ja &&
      asset.purpose_ja && asset.effect_ja && asset.requirements_ja && asset.owner && asset.next_move &&
      asset.state && asset.state.asset_status === "unselected" && asset.state.rights_status === "not_reviewed" && asset.state.provenance_required === true;
  }), "asset operation row incomplete, selected, or rights-promoted");
  add(assets.filter(function (asset) { return asset.operation_scope === "common"; }).length === 2, "common asset scope mismatch");
  add(assets.filter(function (asset) { return asset.operation_scope === "reusable"; }).length === 7, "reusable asset scope mismatch");
  add(assets.filter(function (asset) { return asset.operation_scope === "beat_specific"; }).length === 5, "beat-specific asset scope mismatch");
  add(model && model.theme && model.theme.default === "auto" && exactArray(model.theme.options, ["light", "dark", "auto"]), "Light/Dark/Auto theme contract missing");
  add(model && model.theme && model.theme.title_px && model.theme.title_px["900x1200"] >= 30 && model.theme.title_px["900x1200"] <= 38 && model.theme.title_px["1280x900"] >= 34 && model.theme.title_px["1280x900"] <= 42, "title size contract mismatch");
  add(contrastRatio(model && model.theme && model.theme.light.text, model && model.theme && model.theme.light.background) >= 4.5, "light theme text contrast below 4.5");
  add(contrastRatio(model && model.theme && model.theme.light.muted, model && model.theme && model.theme.light.background) >= 4.5, "light theme muted contrast below 4.5");
  add(contrastRatio(model && model.theme && model.theme.dark.text, model && model.theme && model.theme.dark.background) >= 4.5, "dark theme text contrast below 4.5");
  add(contrastRatio(model && model.theme && model.theme.dark.muted, model && model.theme && model.theme.dark.background) >= 4.5, "dark theme muted contrast below 4.5");
  add(model && model.appendix && model.appendix.initially_open === false && model.appendix.disclosure_hit_area_px >= 44 && model.appendix.asset_requirement_count === 14, "appendix state or hit area mismatch");
  add(model && model.boundaries && model.boundaries.local_only === true && Object.entries(model.boundaries).every(function (entry) { return entry[0] === "local_only" ? entry[1] === true : entry[1] === false; }), "storyboard production, rights, external, or canon boundary opened");
  add(!/https?:\/\/|www\./i.test(JSON.stringify(model)), "external URL entered storyboard model");
  if (expectedModel) add(JSON.stringify(model) === JSON.stringify(expectedModel), "canonical storyboard model drift");
  return { valid: errors.length === 0, errors };
}

function countMatches(value, regex) {
  return (String(value || "").match(regex) || []).length;
}

function validateSurface(html, model) {
  const errors = [];
  const add = function (condition, message) { if (!condition) errors.push(message); };
  add(/^<!doctype html>/i.test(html) && html.includes('data-production-storyboard-brief="true"'), "standalone storyboard HTML identity missing");
  add(html.includes('data-first-view-premise="true"') && html.includes('data-first-view-question="true"') && html.includes("180秒") && html.includes(">6<") && html.includes(">19<") && html.includes("provisional"), "first-view premise, question, metrics, or status missing");
  add(countMatches(html, /data-overview-sentence="true"/g) === 6, "HTML six-sentence overview mismatch");
  add(countMatches(html, /data-glossary-entry="[^"]+"/g) === GLOSSARY.length, "HTML glossary inventory mismatch");
  add(countMatches(html, /data-storyboard-beat="true"/g) === 6, "HTML beat group count mismatch");
  add(countMatches(html, /data-storyboard-shot="true"/g) === 19, "HTML storyboard shot count mismatch");
  add(countMatches(html, /data-storyboard-svg="true"/g) === 19 && countMatches(html, /viewBox="0 0 1600 900"/g) === 19, "HTML 19 inline 16:9 SVG frames missing");
  add(countMatches(html, /data-planning-only="true"/g) === 19 && countMatches(html, /data-focal-label="[^"]+"/g) === 19 && countMatches(html, /data-motion="[^"]+"/g) === 19, "SVG planning-only, focal, or motion marker missing");
  for (const field of ["what-is-seen", "purpose", "positive-condition", "negative-guard", "operations"]) {
    add(countMatches(html, new RegExp('data-shot-field="' + field + '"', "g")) === 19, "adjacent shot field count mismatch: " + field);
  }
  const primaryStart = html.indexOf('<div data-primary-content="true">');
  const primaryEnd = html.indexOf('<section class="appendix-wrap"', primaryStart);
  const primary = primaryStart >= 0 && primaryEnd > primaryStart ? html.slice(primaryStart, primaryEnd) : "";
  add(primary.length > 0 && !/<table\b/i.test(primary) && !/asset inventory/i.test(primary), "asset inventory table entered primary story surface");
  add(countMatches(html, /data-production-appendix="true"/g) === 1 && !/<details[^>]*\sopen(?:\s|>)/i.test(html), "appendix missing, duplicated, or open by default");
  add(html.includes("制作準備付録を開く") && html.includes("制作準備付録を閉じる"), "appendix explicit open/close labels missing");
  add(html.includes("--appendix-hit-min:48px") && html.includes("min-height:var(--appendix-hit-min)"), "appendix disclosure hit area below 44px");
  add(html.includes('data-title-900-px="36"') && html.includes('data-title-1280-px="40"') && html.includes("--title-size:40px") && html.includes("--title-size:36px"), "title size tokens missing or oversized");
  add(countMatches(html, /data-theme-choice="light"/g) === 1 && countMatches(html, /data-theme-choice="dark"/g) === 1 && countMatches(html, /data-theme-choice="auto"/g) === 1 && html.includes('data-theme-default="auto"'), "Light/Dark/Auto theme controls missing");
  add(html.includes("@media(prefers-color-scheme:dark)") && html.includes("@media print"), "Auto theme or print stylesheet missing");
  add(!/overflow(?:-[xy])?\s*:\s*(?:auto|scroll)/i.test(html), "nested scroll CSS entered storyboard surface");
  add(!/<(?:image|foreignObject)\b/i.test(html) && !/https?:\/\//i.test(html) && !/<link\b[^>]*rel=["']stylesheet/i.test(html), "external image, foreignObject, URL, or stylesheet entered standalone HTML");
  const scriptMatches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/gi)];
  add(scriptMatches.length === 1, "inline theme script count mismatch");
  for (const match of scriptMatches) {
    try {
      new Function(match[1]);
    } catch (error) {
      errors.push("inline script parse failed: " + error.message);
    }
  }
  const entryIds = new Set([...html.matchAll(/data-glossary-entry="([^"]+)"/g)].map(function (match) { return match[1]; }));
  const refs = [...html.matchAll(/data-glossary-ref="([^"]+)"/g)].map(function (match) { return match[1]; });
  add(refs.length > 0 && refs.every(function (id) { return entryIds.has(id); }), "HTML contains unresolved glossary reference");
  const htmlShotIds = [...html.matchAll(/data-storyboard-shot="true" data-shot-id="([^"]+)"/g)].map(function (match) { return match[1]; });
  add(htmlShotIds.length === 19 && new Set(htmlShotIds).size === 19, "HTML missing or duplicate shot identity");
  if (model) {
    add(model.shots.every(function (shot) {
      const blockStart = html.indexOf('data-storyboard-shot="true" data-shot-id="' + shot.shot_id + '"');
      const positive = html.indexOf('data-shot-field="positive-condition"', blockStart);
      const negative = html.indexOf('data-shot-field="negative-guard"', blockStart);
      return blockStart >= 0 && positive > blockStart && negative > positive;
    }), "positive condition and negative guard are not separately ordered per shot");
  }
  return { valid: errors.length === 0, errors };
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (character !== "\r") {
      field += character;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  if (quoted) throw new Error("unterminated CSV quote");
  return rows;
}

function validateCandidate(filesInput, expectedFiles, expectedModel) {
  const errors = [];
  const add = function (condition, message) { if (!condition) errors.push(message); };
  const files = filesInput || {};
  add(JSON.stringify(Object.keys(files).sort()) === JSON.stringify([...REQUIRED_FILES].sort()), "package file inventory mismatch");
  for (const relativePath of REQUIRED_FILES) {
    const file = files[relativePath];
    add(Buffer.isBuffer(file), "missing package file: " + relativePath);
    if (Buffer.isBuffer(file)) add(!file.toString("utf8").includes("\r"), "non-LF line ending: " + relativePath);
    if (Buffer.isBuffer(file) && expectedFiles && Buffer.isBuffer(expectedFiles[relativePath])) {
      add(file.equals(expectedFiles[relativePath]), "package byte drift: " + relativePath);
    }
  }
  let model = null;
  let manifest = null;
  try {
    model = JSON.parse(files["production-storyboard-brief.json"].toString("utf8"));
  } catch (error) {
    errors.push("storyboard JSON parse failed: " + error.message);
  }
  try {
    manifest = JSON.parse(files["production-storyboard-brief-manifest.json"].toString("utf8"));
  } catch (error) {
    errors.push("storyboard manifest parse failed: " + error.message);
  }
  const modelValidation = validateModel(model, expectedModel);
  errors.push(...modelValidation.errors);
  const html = files["production-storyboard-brief.html"] ? files["production-storyboard-brief.html"].toString("utf8") : "";
  const surface = validateSurface(html, model);
  errors.push(...surface.errors);
  add(manifest && manifest.schemaVersion === MANIFEST_SCHEMA_VERSION && manifest.artifact_id === ARTIFACT_ID && manifest.package_root === ROOT, "package manifest identity mismatch");
  add(manifest && manifest.source_artifact_id === SOURCE_ARTIFACT_ID && JSON.stringify(manifest.source_fingerprints) === JSON.stringify(SOURCE_FINGERPRINTS), "package manifest source provenance mismatch");
  add(manifest && Array.isArray(manifest.files) && manifest.files.length === PAYLOAD_FILES.length && exactArray(manifest.files.map(function (entry) { return entry.relative_path; }), PAYLOAD_FILES), "package manifest inventory mismatch");
  for (const entry of manifest && manifest.files || []) {
    const file = files[entry.relative_path];
    add(Buffer.isBuffer(file) && entry.byte_size === file.byteLength && entry.sha256 === sha256(file), "package manifest size/hash mismatch: " + entry.relative_path);
  }
  add(manifest && manifest.package_fingerprint_sha256 === packageFingerprint(manifest.files || []), "package manifest aggregate fingerprint mismatch");
  add(manifest && manifest.canonical === false && manifest.production_approved === false && manifest.assets_selected === false && manifest.rights_cleared_claim === false && manifest.local_only === true && manifest.passed === true && Array.isArray(manifest.failures) && manifest.failures.length === 0, "package manifest boundary or pass state changed");
  const csvExpected = {
    "storyboard-shot-map.csv": 19,
    "story-glossary.csv": GLOSSARY.length,
    "asset-operations-summary.csv": 14
  };
  for (const entry of Object.entries(csvExpected)) {
    try {
      const rows = parseCsv(files[entry[0]].toString("utf8"));
      add(rows.length - 1 === entry[1], entry[0] + " row count mismatch");
    } catch (error) {
      errors.push(entry[0] + " parse failed: " + error.message);
    }
  }
  const readme = files["README_STORYBOARD_BRIEF.md"] ? files["README_STORYBOARD_BRIEF.md"].toString("utf8") : "";
  add(readme.includes("validate-production-storyboard-brief") && readme.includes("smoke-production-storyboard-brief") && readme.includes("19 storyboard frames") && readme.includes("完成画ではありません"), "README usage or boundary contract missing");
  return { valid: errors.length === 0, errors, model, manifest, surface };
}

function refreshManifestForHtml(files) {
  const candidate = { ...files };
  const manifest = JSON.parse(candidate["production-storyboard-brief-manifest.json"].toString("utf8"));
  for (const entry of manifest.files) {
    const file = candidate[entry.relative_path];
    entry.byte_size = file.byteLength;
    entry.sha256 = sha256(file);
  }
  manifest.package_fingerprint_sha256 = packageFingerprint(manifest.files);
  candidate["production-storyboard-brief-manifest.json"] = jsonBuffer(manifest);
  return candidate;
}

function runNegativeProbes(built) {
  const outcome = function (closed, detail) {
    return { passed: Boolean(closed), fail_closed: Boolean(closed), artifact_mutation: false, detail };
  };
  const canonicalModel = built.model;
  const canonicalFiles = built.files;
  const modelProbe = function (mutate, detail, compareCanonical) {
    const candidateModel = clone(canonicalModel);
    mutate(candidateModel);
    const candidateFiles = renderFiles(candidateModel);
    const validation = validateCandidate(candidateFiles, null, compareCanonical === false ? null : canonicalModel);
    return outcome(!validation.valid, detail);
  };
  const htmlProbe = function (mutate, detail) {
    const candidate = { ...canonicalFiles };
    const html = candidate["production-storyboard-brief.html"].toString("utf8");
    candidate["production-storyboard-brief.html"] = textBuffer(mutate(html));
    const refreshed = refreshManifestForHtml(candidate);
    return outcome(!validateCandidate(refreshed, null, canonicalModel).valid, detail);
  };
  const manifestMismatch = { ...canonicalFiles };
  const badManifest = JSON.parse(canonicalFiles["production-storyboard-brief-manifest.json"].toString("utf8"));
  badManifest.files[0].sha256 = "0".repeat(64);
  badManifest.package_fingerprint_sha256 = packageFingerprint(badManifest.files);
  manifestMismatch["production-storyboard-brief-manifest.json"] = jsonBuffer(badManifest);
  return {
    source_mismatch: modelProbe(function (model) { model.source.fingerprints.production_execution_json_sha256 = "0".repeat(64); }, "exact source fingerprint mismatch rejected", false),
    missing_glossary_term: modelProbe(function (model) { model.glossary.pop(); model.counts.glossary_count -= 1; }, "missing glossary term rejected", false),
    unresolved_glossary_reference: modelProbe(function (model) { model.shots[0].glossary_term_ids.push("term-missing"); }, "unresolved glossary reference rejected", false),
    missing_shot: modelProbe(function (model) { model.shots.pop(); model.counts.shot_count -= 1; }, "missing storyboard shot rejected", false),
    duplicate_shot: modelProbe(function (model) { model.shots.push(clone(model.shots[0])); model.counts.shot_count += 1; }, "duplicate storyboard shot rejected", false),
    missing_svg: htmlProbe(function (html) { return html.replace('data-storyboard-svg="true"', 'data-storyboard-svg="missing"'); }, "missing inline SVG rejected"),
    mixed_success_guard_field: modelProbe(function (model) { model.shots[0].positive_condition_ja = model.shots[0].source_done_when; }, "mixed success and guard field rejected", false),
    asset_table_in_primary: htmlProbe(function (html) { return html.replace('<section id="storyboard">', '<table data-asset-inventory="true"><tr><td>asset inventory</td></tr></table><section id="storyboard">'); }, "asset inventory table in primary rejected"),
    appendix_open_by_default: htmlProbe(function (html) { return html.replace('<details class="production-appendix"', '<details open class="production-appendix"'); }, "open-by-default appendix rejected"),
    disclosure_hit_area_below_44px: htmlProbe(function (html) { return html.replace("--appendix-hit-min:48px", "--appendix-hit-min:32px"); }, "sub-44px disclosure hit area rejected"),
    title_oversized: htmlProbe(function (html) { return html.replace("--title-size:40px", "--title-size:52px").replace('data-title-1280-px="40"', 'data-title-1280-px="52"'); }, "oversized title token rejected"),
    theme_missing: htmlProbe(function (html) { return html.replace('data-theme-choice="dark"', 'data-theme-choice="missing"'); }, "missing theme mode rejected"),
    dark_contrast_failure: modelProbe(function (model) { model.theme.dark.muted = model.theme.dark.background; }, "dark contrast failure rejected", false),
    nested_scroll: htmlProbe(function (html) { return html.replace("body{margin:0", "body{overflow-y:auto;margin:0"); }, "nested scroll CSS rejected"),
    selected_asset: modelProbe(function (model) { model.asset_operations[0].state.asset_status = "selected"; model.boundaries.assets_selected = true; }, "selected asset rejected", false),
    rights_claim: modelProbe(function (model) { model.asset_operations[0].state.rights_status = "cleared"; model.boundaries.rights_cleared_claim = true; }, "rights-cleared claim rejected", false),
    content_mutation: modelProbe(function (model) { model.shots[0].visual_direction += "変更"; }, "source-derived storyboard content mutation rejected", true),
    manifest_mismatch: outcome(!validateCandidate(manifestMismatch, null, canonicalModel).valid, "manifest payload hash mismatch rejected")
  };
}

async function listFilesRecursive(directory) {
  const output = [];
  let entries = [];
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return output;
  }
  for (const entry of entries) {
    const filePath = repoPath(path.join(directory, entry.name));
    if (entry.isDirectory()) output.push(...await listFilesRecursive(filePath));
    else if (entry.isFile()) output.push(filePath);
  }
  return output;
}

async function workspaceFiles() {
  const roots = ["artifacts", "docs", "public", "scripts", "tools"];
  let files = [];
  for (const root of roots) files.push(...await listFilesRecursive(root));
  for (const rootFile of ["AGENTS.md", ".gitattributes", "mkdocs.yml"]) {
    try {
      const info = await stat(rootFile);
      if (info.isFile()) files.push(rootFile);
    } catch {}
  }
  return [...new Set(files.map(repoPath))].sort();
}

async function snapshotWorkspace(options) {
  const excludeStoryboardWrites = options && options.exclude_storyboard_writes === true;
  let files = await workspaceFiles();
  if (excludeStoryboardWrites) {
    files = files.filter(function (filePath) {
      return filePath !== RESULT_PATH && !filePath.startsWith(ROOT + "/");
    });
  }
  const entries = await Promise.all(files.map(async function (filePath) {
    return [filePath, cleanSnapshot(await fileSnapshot(filePath, false))];
  }));
  return Object.fromEntries(entries);
}

async function snapshotPackage() {
  const entries = await Promise.all(REQUIRED_FILES.map(async function (relativePath) {
    return [relativePath, await fileSnapshot(ROOT + "/" + relativePath, true)];
  }));
  return Object.fromEntries(entries);
}

function packageFileEntries(files) {
  return REQUIRED_FILES.map(function (relativePath) {
    const file = files[relativePath];
    return {
      relative_path: relativePath,
      path: ROOT + "/" + relativePath,
      byte_size: file.byteLength,
      sha256: sha256(file)
    };
  });
}

async function readPriorEvidence(inputPath) {
  const candidates = [...new Set([inputPath, RESULT_PATH].filter(Boolean).map(repoPath))];
  for (const candidate of candidates) {
    const snapshot = await readJsonSnapshot(candidate);
    if (!snapshot.error && snapshot.value && snapshot.value.artifact_id === ARTIFACT_ID) {
      return {
        browser_evidence: clone(snapshot.value.browser_evidence || {}),
        theme_evidence: clone(snapshot.value.theme_evidence || {}),
        print_evidence: clone(snapshot.value.print_evidence || {})
      };
    }
  }
  return { browser_evidence: {}, theme_evidence: {}, print_evidence: {} };
}

function defaultBrowserEvidence(prior) {
  const specs = {
    "900x1200-dark": [900, 1200, "dark"],
    "1280x900-light": [1280, 900, "light"]
  };
  const output = {};
  for (const entry of Object.entries(specs)) {
    const key = entry[0];
    const spec = entry[1];
    output[key] = {
      viewport_width: spec[0],
      viewport_height: spec[1],
      theme: spec[2],
      resolved_color_scheme: null,
      document_scroll_width: null,
      document_scroll_height: null,
      client_width: null,
      horizontal_overflow: null,
      nested_scroll_container_count: null,
      first_view_contract_met: null,
      title_font_size_px: null,
      title_line_count: null,
      appendix_hit_area_px: null,
      appendix_initially_open: null,
      storyboard_svg_count: null,
      contrast_min_ratio: null,
      screenshot_path: SCREENSHOTS[key],
      screenshot_byte_size: null,
      screenshot_sha256: null,
      ...(prior && prior[key] || {})
    };
  }
  return output;
}

function defaultThemeEvidence(prior) {
  return {
    default_theme_auto: null,
    explicit_light_applied: null,
    explicit_dark_applied: null,
    auto_light_resolved: null,
    auto_dark_resolved: null,
    preference_persisted_after_reload: null,
    controls_aria_pressed_valid: null,
    appendix_enter_toggles: null,
    appendix_space_toggles: null,
    ...(prior || {})
  };
}

function defaultPrintEvidence(prior) {
  return {
    media: "print",
    controls_hidden: null,
    background_light: null,
    no_horizontal_overflow: null,
    storyboard_frames_visible: null,
    ...(prior || {})
  };
}

function buildResultSeed(built, sourceBefore, sourceAfter, prior) {
  const manifest = JSON.parse(built.files["production-storyboard-brief-manifest.json"].toString("utf8"));
  return {
    schemaVersion: RESULT_SCHEMA_VERSION,
    artifact_id: ARTIFACT_ID,
    source_artifact_id: SOURCE_ARTIFACT_ID,
    source_fingerprints: clone(SOURCE_FINGERPRINTS),
    package_files: packageFileEntries(built.files),
    package_fingerprint_sha256: manifest.package_fingerprint_sha256,
    total_duration_seconds: 180,
    beat_count: 6,
    shot_count: 19,
    subtitle_count: 20,
    narration_segment_count: 6,
    storyboard_svg_count: 19,
    asset_requirement_count: 14,
    glossary_count: GLOSSARY.length,
    unresolved_glossary_reference_count: 0,
    positive_condition_count: 19,
    negative_guard_count: 19,
    beat_shot_grouping: clone(GROUPING),
    overview_sentence_count: 6,
    appendix_owner_count: 1,
    primary_asset_table_count: 0,
    theme_modes: ["light", "dark", "auto"],
    default_theme: "auto",
    synthetic_voice_planning_preserved: true,
    voice_planning: clone(built.model.voice_planning),
    source_package_pre_hashes: clone(sourceBefore),
    source_package_post_hashes: clone(sourceAfter),
    source_packages_unchanged: mapsEqual(sourceBefore, sourceAfter),
    canonical: false,
    production_approved: false,
    local_only: true,
    external_call: false,
    provider_configured: false,
    credentials_touched: false,
    assets_selected: false,
    rights_cleared_claim: false,
    tts_engine_selected: false,
    voice_selected: false,
    audio_generated: false,
    public_upload: false,
    ai_video_generation: false,
    production_render: false,
    database_persistence: false,
    final_canon_decision: false,
    browser_evidence: defaultBrowserEvidence(prior.browser_evidence),
    theme_evidence: defaultThemeEvidence(prior.theme_evidence),
    print_evidence: defaultPrintEvidence(prior.print_evidence),
    browser_evidence_complete: false,
    manifest_size_hash_integrity: true,
    validation_read_only: true,
    negative_probes: {},
    checks: {},
    failures: [],
    passed: true
  };
}

function browserEvidenceValid(browserEvidence, screenshotSnapshots) {
  const specs = {
    "900x1200-dark": [900, 1200, "dark", 30, 38],
    "1280x900-light": [1280, 900, "light", 34, 42]
  };
  for (const entry of Object.entries(specs)) {
    const key = entry[0];
    const spec = entry[1];
    const evidence = browserEvidence && browserEvidence[key] || {};
    const screenshot = screenshotSnapshots && screenshotSnapshots[key];
    if (evidence.viewport_width !== spec[0] || evidence.viewport_height !== spec[1] || evidence.theme !== spec[2] ||
        evidence.resolved_color_scheme !== spec[2] ||
        !Number.isFinite(evidence.document_scroll_width) || !Number.isFinite(evidence.document_scroll_height) ||
        !Number.isFinite(evidence.client_width) || evidence.document_scroll_height < spec[1] ||
        evidence.document_scroll_width > evidence.client_width + 1 || evidence.horizontal_overflow !== false ||
        evidence.nested_scroll_container_count !== 0 || evidence.first_view_contract_met !== true ||
        !Number.isFinite(evidence.title_font_size_px) || evidence.title_font_size_px < spec[3] || evidence.title_font_size_px > spec[4] ||
        !Number.isInteger(evidence.title_line_count) || evidence.title_line_count < 1 || evidence.title_line_count > 2 ||
        !Number.isFinite(evidence.appendix_hit_area_px) || evidence.appendix_hit_area_px < 44 ||
        evidence.appendix_initially_open !== false || evidence.storyboard_svg_count !== 19 ||
        !Number.isFinite(evidence.contrast_min_ratio) || evidence.contrast_min_ratio < 4.5 ||
        evidence.screenshot_path !== SCREENSHOTS[key] ||
        !Number.isInteger(evidence.screenshot_byte_size) || evidence.screenshot_byte_size <= 0 ||
        !/^[0-9a-f]{64}$/.test(String(evidence.screenshot_sha256 || ""))) return false;
    if (screenshot && (!screenshot.exists || screenshot.byte_size !== evidence.screenshot_byte_size || screenshot.sha256 !== evidence.screenshot_sha256)) return false;
  }
  return true;
}

function themeEvidenceValid(evidence) {
  return evidence && evidence.default_theme_auto === true &&
    evidence.explicit_light_applied === true && evidence.explicit_dark_applied === true &&
    evidence.auto_light_resolved === true && evidence.auto_dark_resolved === true &&
    evidence.preference_persisted_after_reload === true &&
    evidence.controls_aria_pressed_valid === true &&
    evidence.appendix_enter_toggles === true && evidence.appendix_space_toggles === true;
}

function printEvidenceValid(evidence) {
  return evidence && evidence.media === "print" && evidence.controls_hidden === true &&
    evidence.background_light === true && evidence.no_horizontal_overflow === true &&
    evidence.storyboard_frames_visible === true;
}

function validateResultCandidate(candidate, options) {
  const errors = [];
  const add = function (condition, message) { if (!condition) errors.push(message); };
  const allowBootstrap = options && options.allow_bootstrap_evidence === true;
  add(candidate && candidate.schemaVersion === RESULT_SCHEMA_VERSION && candidate.artifact_id === ARTIFACT_ID, "result identity mismatch");
  add(candidate && candidate.source_artifact_id === SOURCE_ARTIFACT_ID && JSON.stringify(candidate.source_fingerprints) === JSON.stringify(SOURCE_FINGERPRINTS), "result source provenance mismatch");
  add(candidate && Array.isArray(candidate.package_files) && candidate.package_files.length === 7 && exactArray(candidate.package_files.map(function (entry) { return entry.relative_path; }), REQUIRED_FILES) && candidate.package_files.every(function (entry) {
    return entry.path === ROOT + "/" + entry.relative_path && Number.isInteger(entry.byte_size) && entry.byte_size > 0 && /^[0-9a-f]{64}$/.test(String(entry.sha256 || ""));
  }), "result package path/hash inventory mismatch");
  add(candidate && /^[0-9a-f]{64}$/.test(String(candidate.package_fingerprint_sha256 || "")) && candidate.manifest_size_hash_integrity === true, "result package fingerprint or manifest integrity invalid");
  add(candidate && candidate.total_duration_seconds === 180 && candidate.beat_count === 6 && candidate.shot_count === 19 && candidate.subtitle_count === 20 && candidate.narration_segment_count === 6 && candidate.storyboard_svg_count === 19 && candidate.asset_requirement_count === 14 && candidate.glossary_count === GLOSSARY.length, "result count contract mismatch");
  add(candidate && candidate.synthetic_voice_planning_preserved === true && candidate.voice_planning &&
    candidate.voice_planning.voice_mode === "synthetic" && candidate.voice_planning.engine_selected === false &&
    candidate.voice_planning.voice_selected === false && candidate.voice_planning.audio_generated === false &&
    candidate.voice_planning.engine_calibration_pending === true &&
    candidate.voice_planning.actual_engine_timing_measured === false,
  "result synthetic voice planning preservation mismatch");
  add(candidate && candidate.unresolved_glossary_reference_count === 0 && candidate.positive_condition_count === 19 && candidate.negative_guard_count === 19 && exactArray(candidate.beat_shot_grouping, GROUPING) && candidate.overview_sentence_count === 6, "result semantic coverage mismatch");
  add(candidate && candidate.appendix_owner_count === 1 && candidate.primary_asset_table_count === 0 && exactArray(candidate.theme_modes, ["light", "dark", "auto"]) && candidate.default_theme === "auto", "result surface contract mismatch");
  add(candidate && candidate.source_packages_unchanged === true && mapsEqual(candidate.source_package_pre_hashes, candidate.source_package_post_hashes), "result source immutability mismatch");
  add(candidate && candidate.canonical === false && candidate.production_approved === false && candidate.local_only === true &&
    candidate.external_call === false && candidate.provider_configured === false && candidate.credentials_touched === false &&
    candidate.assets_selected === false && candidate.rights_cleared_claim === false && candidate.tts_engine_selected === false &&
    candidate.voice_selected === false && candidate.audio_generated === false && candidate.public_upload === false &&
    candidate.ai_video_generation === false && candidate.production_render === false && candidate.database_persistence === false &&
    candidate.final_canon_decision === false, "result external, production, rights, or canon boundary opened");
  const browserValid = browserEvidenceValid(candidate && candidate.browser_evidence || {}, null);
  const themeValid = themeEvidenceValid(candidate && candidate.theme_evidence || {});
  const printValid = printEvidenceValid(candidate && candidate.print_evidence || {});
  add(allowBootstrap || (candidate.browser_evidence_complete === true && browserValid), "result browser evidence incomplete");
  add(allowBootstrap || themeValid, "result theme/keyboard evidence incomplete");
  add(allowBootstrap || printValid, "result print evidence incomplete");
  add(candidate && candidate.negative_probes && exactArray(Object.keys(candidate.negative_probes), NEGATIVE_PROBE_NAMES) &&
    Object.values(candidate.negative_probes).every(function (probe) { return probe.passed === true && probe.fail_closed === true && probe.artifact_mutation === false; }), "result negative probe contract mismatch");
  add(candidate && Array.isArray(candidate.failures) && candidate.failures.length === 0 && candidate.passed === true, "result pass contract not clean");
  return { valid: errors.length === 0, errors };
}

function validateRootManifest(manifest, packageSnapshots, screenshotSnapshots, options) {
  const errors = [];
  const add = function (condition, message) { if (!condition) errors.push(message); };
  const allowBootstrap = options && options.allow_bootstrap_evidence === true;
  const entry = manifest && manifest.production_storyboard_brief || {};
  add(manifest && manifest.artifact_id === ARTIFACT_ID && manifest.repo_relative_path === HTML_PATH && manifest.review_doc_path === REVIEW_DOC_PATH && manifest.smoke_result_path === RESULT_PATH, "root active Storyboard Brief registration mismatch");
  add(manifest && manifest.production_storyboard_brief_dir === ROOT && manifest.production_storyboard_brief_result_path === RESULT_PATH && manifest.production_storyboard_brief_doc_path === REVIEW_DOC_PATH && manifest.production_storyboard_brief_route === HTML_PATH, "root flat Storyboard Brief registration mismatch");
  add(entry.artifact_id === ARTIFACT_ID && entry.schemaVersion === SCHEMA_VERSION && entry.package_root === ROOT && entry.result_path === RESULT_PATH && entry.review_doc_path === REVIEW_DOC_PATH && entry.access_route === HTML_PATH, "nested Storyboard Brief registration mismatch");
  add(entry.source_artifact_id === SOURCE_ARTIFACT_ID && JSON.stringify(entry.source_fingerprints) === JSON.stringify(SOURCE_FINGERPRINTS), "nested Storyboard Brief source provenance mismatch");
  add(Array.isArray(entry.files) && entry.files.length === 7 && exactArray(entry.files.map(function (file) { return file.relative_path; }), REQUIRED_FILES), "nested Storyboard Brief package inventory mismatch");
  for (const file of entry.files || []) {
    const snapshot = packageSnapshots[file.relative_path] || {};
    add(snapshot.exists && snapshot.byte_size === file.byte_size && snapshot.sha256 === file.sha256, "nested Storyboard Brief file hash mismatch: " + file.relative_path);
  }
  for (const key of Object.keys(SCREENSHOTS)) {
    const screenshot = screenshotSnapshots[key] || {};
    const evidence = entry.screenshots && entry.screenshots[key] || {};
    add(allowBootstrap || (screenshot.exists && evidence.path === SCREENSHOTS[key] && evidence.byte_size === screenshot.byte_size && evidence.sha256 === screenshot.sha256), "nested Storyboard Brief screenshot hash mismatch: " + key);
  }
  add(entry.package_fingerprint_sha256 && /^[0-9a-f]{64}$/.test(entry.package_fingerprint_sha256), "nested Storyboard Brief package fingerprint missing");
  add(entry.counts && entry.counts.total_duration_seconds === 180 && entry.counts.beats === 6 && entry.counts.shots === 19 && entry.counts.subtitle_cues === 20 && entry.counts.narration_segments === 6 && entry.counts.glossary_terms === GLOSSARY.length && entry.counts.asset_requirements === 14, "nested Storyboard Brief counts mismatch");
  add(entry.synthetic_voice_planning_preserved === true, "nested Storyboard Brief synthetic voice planning state missing");
  add(entry.default_theme === "auto" && exactArray(entry.theme_modes, ["light", "dark", "auto"]) && exactArray(entry.beat_shot_grouping, GROUPING), "nested Storyboard Brief theme or grouping mismatch");
  add(entry.canonical === false && entry.production_approved === false && entry.boundaries && entry.boundaries.local_only === true &&
    Object.entries(entry.boundaries).every(function (boundary) { return boundary[0] === "local_only" ? boundary[1] === true : boundary[1] === false; }), "nested Storyboard Brief boundary opened");
  add(manifest && manifest.production_execution_pack && manifest.production_execution_pack.artifact_id === SOURCE_ARTIFACT_ID && Array.isArray(manifest.preserves) && manifest.preserves.includes(SOURCE_ARTIFACT_ID), "root did not preserve source Production Execution Pack");
  const command = String(manifest && manifest.validation_command || "");
  const expected = [
    "validate-production-storyboard-brief " + RESULT_PATH,
    "validate-production-execution-pack artifacts/production-execution-pack-result.json",
    "validate-operator-production-brief-typography-balance artifacts/operator-production-brief-typography-balance-result.json",
    "validate-operator-production-brief artifacts/operator-production-brief-result.json",
    "validate-content-production-blueprint artifacts/content-production-blueprint-result.json",
    "validate-editorial-derivative-preview artifacts/editorial-derivative-preview-result.json",
    "validate-editorial-revision-roundtrip artifacts/editorial-revision-roundtrip-result.json",
    "validate-bridge-editorial-handoff-pack artifacts/bridge-editorial-handoff-pack-result.json"
  ];
  const indexes = expected.map(function (fragment) { return command.indexOf(fragment); });
  add(indexes.every(function (index) { return index >= 0; }) && indexes.every(function (index, position) { return position === 0 || index > indexes[position - 1]; }) && !command.includes("smoke-production-storyboard-brief"), "root read-only validation command order mismatch");
  return { valid: errors.length === 0, errors };
}

async function validateStoryboard(readback, readbackPath, options) {
  const failures = [];
  const checks = {};
  const check = function (name, passed, detail) {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) failures.push(name + ": " + detail);
  };
  const generatedSeed = options && options.generated_seed === true;
  const scopeBefore = await snapshotWorkspace({});
  const sourceBefore = options && options.source_before || await snapshotSourcePack();
  const built = await buildArtifacts();
  const packageSnapshotsRaw = await snapshotPackage();
  const packageSnapshots = Object.fromEntries(Object.entries(packageSnapshotsRaw).map(function (entry) { return [entry[0], cleanSnapshot(entry[1])]; }));
  const diskFiles = Object.fromEntries(Object.entries(packageSnapshotsRaw).filter(function (entry) { return entry[1].exists; }).map(function (entry) { return [entry[0], entry[1].buffer]; }));
  const packageValidation = built.valid ? validateCandidate(diskFiles, built.files, built.model) : { valid: false, errors: built.errors || [] };
  const rootRead = await readJsonSnapshot(ROOT_MANIFEST_PATH);
  const publicSnapshot = await fileSnapshot(PUBLIC_PATH, true);
  const reviewDocSnapshot = await fileSnapshot(REVIEW_DOC_PATH, true);
  const screenshotEntries = await Promise.all(Object.entries(SCREENSHOTS).map(async function (entry) {
    return [entry[0], cleanSnapshot(await fileSnapshot(entry[1], false))];
  }));
  const screenshotSnapshots = Object.fromEntries(screenshotEntries);
  const rootValidation = validateRootManifest(rootRead.value || {}, packageSnapshots, screenshotSnapshots, { allow_bootstrap_evidence: generatedSeed });
  const publicHtml = publicSnapshot.exists ? publicSnapshot.buffer.toString("utf8") : "";
  const linkCount = countMatches(publicHtml, /data-production-storyboard-brief-link="true"/g);
  const linkValid = linkCount === 1 && publicHtml.includes('href="../../artifacts/production-storyboard-brief/production-storyboard-brief.html"') && publicHtml.includes("絵コンテ版を開く");
  const reviewDoc = reviewDocSnapshot.exists ? reviewDocSnapshot.buffer.toString("utf8") : "";
  const reviewDocValid = reviewDocSnapshot.exists && [
    ARTIFACT_ID,
    "validate-production-storyboard-brief",
    "smoke-production-storyboard-brief",
    "3 / 3 / 3 / 3 / 4 / 3",
    "Light / Dark / Auto",
    "19",
    "14",
    "Purpose",
    "Next move"
  ].every(function (token) { return reviewDoc.includes(token); });
  const negativeProbes = built.valid ? runNegativeProbes(built) : {};
  for (const probe of Object.values(negativeProbes)) probe.artifact_mutation = false;
  const sourceAfter = options && options.source_after || await snapshotSourcePack();
  const sourceExact = mapsEqual(sourceBefore, sourceAfter) &&
    sourceAfter["production-execution-pack.html"] && sourceAfter["production-execution-pack.html"].sha256 === SOURCE_FINGERPRINTS.production_execution_html_sha256 &&
    sourceAfter["production-execution-pack.json"] && sourceAfter["production-execution-pack.json"].sha256 === SOURCE_FINGERPRINTS.production_execution_json_sha256 &&
    sourceAfter["production-execution-manifest.json"] && sourceAfter["production-execution-manifest.json"].sha256 === SOURCE_FINGERPRINTS.production_execution_manifest_sha256 &&
    sourceAggregate(sourceAfter) === SOURCE_FINGERPRINTS.production_execution_nine_file_aggregate_sha256;
  const manifest = packageValidation.manifest || {};
  const expectedPackageEntries = built.valid ? packageFileEntries(built.files) : [];
  const packageResultMatch = JSON.stringify(readback && readback.package_files || []) === JSON.stringify(expectedPackageEntries) &&
    readback && readback.package_fingerprint_sha256 === manifest.package_fingerprint_sha256;
  const browserValid = browserEvidenceValid(readback && readback.browser_evidence || {}, screenshotSnapshots);
  const themeValid = themeEvidenceValid(readback && readback.theme_evidence || {});
  const printValid = printEvidenceValid(readback && readback.print_evidence || {});
  const normalizedForContract = {
    ...readback,
    negative_probes: negativeProbes,
    source_package_pre_hashes: sourceBefore,
    source_package_post_hashes: sourceAfter,
    source_packages_unchanged: sourceExact
  };
  const resultValidation = validateResultCandidate(normalizedForContract, { allow_bootstrap_evidence: generatedSeed });
  const scopeAfter = await snapshotWorkspace({});
  const validationReadOnly = mapsEqual(scopeBefore, scopeAfter);
  for (const probe of Object.values(negativeProbes)) probe.artifact_mutation = !validationReadOnly;
  check("result_contract", resultValidation.valid, resultValidation.errors.join(" | ") || "ok");
  check("canonical_package_candidate", built.valid && packageValidation.valid, [...built.errors || [], ...packageValidation.errors || []].join(" | ") || "ok");
  check("source_execution_pack_byte_identical", sourceExact, "aggregate=" + sourceAggregate(sourceAfter));
  check("package_paths_hashes_and_manifest", packageResultMatch && packageValidation.valid, "files=" + expectedPackageEntries.length + "; fingerprint=" + (manifest.package_fingerprint_sha256 || "missing"));
  check("overview_glossary_and_storyboard_coverage", built.valid && built.model.overview_sentences.length === 6 && built.model.glossary.length === GLOSSARY.length && built.model.shots.length === 19, "overview=6; glossary=" + (built.model && built.model.glossary.length || 0) + "; shots=" + (built.model && built.model.shots.length || 0));
  check("shot_semantics_split", built.valid && built.model.shots.every(function (shot) { return !shot.positive_condition_ja.includes(shot.negative_guard_ja); }), "positive=19; guards=19");
  check("root_manifest_registered", rootValidation.valid, rootValidation.errors.join(" | ") || "ok");
  check("blueprint_compact_link", linkValid, "markerCount=" + linkCount);
  check("review_doc_registered", reviewDocValid, reviewDocSnapshot.error || "ok");
  check("browser_and_screenshot_evidence", generatedSeed || browserValid, generatedSeed && !browserValid ? "bootstrap pending" : "complete=" + browserValid);
  check("theme_and_keyboard_evidence", generatedSeed || themeValid, generatedSeed && !themeValid ? "bootstrap pending" : "complete=" + themeValid);
  check("print_evidence", generatedSeed || printValid, generatedSeed && !printValid ? "bootstrap pending" : "complete=" + printValid);
  check("negative_probes_fail_closed", exactArray(Object.keys(negativeProbes), NEGATIVE_PROBE_NAMES) && Object.values(negativeProbes).every(function (probe) { return probe.passed && probe.fail_closed && !probe.artifact_mutation; }), "count=" + Object.keys(negativeProbes).length);
  check("normal_validation_read_only", validationReadOnly, "readOnly=" + validationReadOnly);
  return {
    ...readback,
    source_artifact_id: SOURCE_ARTIFACT_ID,
    source_fingerprints: clone(SOURCE_FINGERPRINTS),
    package_files: expectedPackageEntries,
    package_fingerprint_sha256: manifest.package_fingerprint_sha256 || readback && readback.package_fingerprint_sha256 || null,
    source_package_pre_hashes: sourceBefore,
    source_package_post_hashes: sourceAfter,
    source_packages_unchanged: sourceExact,
    browser_evidence_complete: browserValid && themeValid && printValid,
    manifest_size_hash_integrity: packageValidation.valid === true,
    validation_read_only: validationReadOnly,
    negative_probes: negativeProbes,
    checks,
    failures,
    passed: failures.length === 0
  };
}

export async function runProductionStoryboardBriefCommand(args) {
  const command = args.command;
  const inputPath = repoPath(args.inputPath || "");
  const outputPath = repoPath(args.outputPath || "");
  if (command === "validate-production-storyboard-brief") {
    if (outputPath) throw new Error("validate-production-storyboard-brief is strictly read-only and does not accept an output path");
    const sourcePath = inputPath || RESULT_PATH;
    const readbackSnapshot = await readJsonSnapshot(sourcePath);
    if (readbackSnapshot.error) throw new Error("Storyboard Brief result read failed: " + readbackSnapshot.error);
    const result = await validateStoryboard(readbackSnapshot.value, sourcePath, {});
    console.log(JSON.stringify(result, null, 2));
    if (!result.passed) throw new Error("Production Storyboard Brief failed: " + result.failures.join("; "));
    return;
  }
  if (command === "smoke-production-storyboard-brief") {
    const target = outputPath || RESULT_PATH;
    if (target !== RESULT_PATH) throw new Error("smoke-production-storyboard-brief may write only the seven package files and " + RESULT_PATH);
    const outsideBefore = await snapshotWorkspace({ exclude_storyboard_writes: true });
    const sourceBefore = await snapshotSourcePack();
    const built = await buildArtifacts();
    if (!built.valid) throw new Error("Production Storyboard Brief generation failed before write: " + built.errors.join("; "));
    await writeArtifacts(built.files);
    const outsideAfterPackage = await snapshotWorkspace({ exclude_storyboard_writes: true });
    const sourceAfterPackage = await snapshotSourcePack();
    if (!mapsEqual(outsideBefore, outsideAfterPackage) || !mapsEqual(sourceBefore, sourceAfterPackage)) {
      throw new Error("Storyboard Brief smoke crossed its seven-file package boundary or mutated the source Execution Pack");
    }
    const prior = await readPriorEvidence(inputPath);
    const seed = buildResultSeed(built, sourceBefore, sourceAfterPackage, prior);
    const result = await validateStoryboard(seed, target, {
      generated_seed: true,
      source_before: sourceBefore,
      source_after: sourceAfterPackage
    });
    await writeFile(target, jsonBuffer(result));
    const outsideAfter = await snapshotWorkspace({ exclude_storyboard_writes: true });
    const sourceAfter = await snapshotSourcePack();
    if (!mapsEqual(outsideBefore, outsideAfter) || !mapsEqual(sourceBefore, sourceAfter)) {
      throw new Error("Storyboard Brief smoke mutated a file outside its seven-file package and result allowance");
    }
    if (!result.passed) throw new Error("Production Storyboard Brief failed: " + result.failures.join("; "));
    console.log("production storyboard brief passed " + (inputPath || "generated-seed") + " -> " + target);
    return;
  }
  throw new Error("unsupported Production Storyboard Brief command: " + command);
}
