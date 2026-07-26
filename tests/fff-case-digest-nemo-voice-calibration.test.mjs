import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageRoot = path.join(repoRoot, "artifacts", "case-digest-nemo-voice-calibration");
const sourceScriptPath = path.join(
  repoRoot,
  "artifacts",
  "private-raster-case-digest",
  "case-digest-script.md"
);

async function readJson(name) {
  return JSON.parse(await readFile(path.join(packageRoot, name), "utf8"));
}

function collectStrings(value, output = []) {
  if (typeof value === "string") {
    output.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, output);
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectStrings(item, output);
  }
  return output;
}

test("official Nemo VVPP acquisition and extracted engine identities are exact", async () => {
  const [acquisition, engine] = await Promise.all([
    readJson("nemo-vvpp-acquisition-record.json"),
    readJson("nemo-engine-identity.json")
  ]);
  assert.equal(acquisition.authority_id, "AUTH-FFF-VOICEVOX-NEMO-VVPP-ACQUIRE-CALIBRATE-20260727");
  assert.equal(acquisition.repository, "VOICEVOX/voicevox_nemo_engine");
  assert.equal(acquisition.release.tag, "0.24.0");
  assert.equal(acquisition.release.release_id, 228845145);
  assert.equal(acquisition.release.draft, false);
  assert.equal(acquisition.release.prerelease, false);
  assert.equal(acquisition.asset.asset_id, 268697767);
  assert.equal(acquisition.asset.name, "voicevox_engine-windows-cpu-0.24.0.vvpp");
  assert.equal(acquisition.asset.bytes, 140522153);
  assert.equal(acquisition.asset.sha256, "418c515ce567c1426b425bd2fe05eb0a62196bcec223829725e9ed4ff345b437");
  assert.equal(acquisition.download.attempt_count, 1);
  assert.equal(acquisition.download.digest_verified, true);
  assert.equal(acquisition.extraction.file_count, 223);
  assert.equal(acquisition.extraction.reparse_point_count, 0);
  assert.equal(acquisition.wrong_package_quarantine.preserved, true);
  assert.equal(acquisition.wrong_package_quarantine.used_for_nemo_synthesis, false);

  assert.equal(engine.name, "VOICEVOX Nemo Engine");
  assert.equal(engine.uuid, "208cf94d-43d2-4cf5-abc0-9783cac36d29");
  assert.equal(engine.version, "0.24.0");
  assert.equal(engine.uuid_differs_from_regular_engine, true);
  assert.equal(engine.loopback_host, "127.0.0.1");
  assert.equal(engine.cpu_thread_limit, 4);
  assert.equal(engine.short_synthesis.success, true);
  assert.equal(engine.offline_observation.external_connection_observation_count, 0);
});

test("all nine engine-reported Nemo styles are callable and only three are calibrated", async () => {
  const inventory = await readJson("voice-inventory.json");
  assert.equal(inventory.speaker_count, 9);
  assert.equal(inventory.style_count, 9);
  assert.deepEqual(
    inventory.styles.map((style) => [style.speaker_name, style.style_id]),
    [
      ["女声1", 10005],
      ["女声2", 10007],
      ["女声3", 10004],
      ["女声4", 10003],
      ["女声5", 10008],
      ["女声6", 10006],
      ["男声1", 10001],
      ["男声2", 10000],
      ["男声3", 10002]
    ]
  );
  assert.equal(inventory.styles.every((style) =>
    style.callable
    && style.synthesis_success
    && style.sample_rate === 24000
    && style.channels === 1
    && style.calibration_eligible
  ), true);
  assert.deepEqual(
    inventory.styles.filter((style) => style.selected_for_calibration).map((style) => style.style_id).sort(),
    [10000, 10001, 10007]
  );
});

test("the exact five accepted narration sections are preserved behind a reading-only layer", async () => {
  const [plan, sourceScript] = await Promise.all([
    readJson("voice-calibration-plan.json"),
    readFile(sourceScriptPath, "utf8")
  ]);
  assert.equal(plan.source.execution_base, "2e96bd380d47869024587eeb19b3f054064390af");
  assert.equal(plan.source.package_fingerprint_sha256, "0f701e7cfa106dee19cf6e378eec1082920cd7f119f37be0f09696ac8020fbf2");
  assert.equal(plan.source.mp4_sha256, "0fb679b5d13d56b726a505d060bf9678daa49a1c138e10657954cd7053765df1");
  assert.deepEqual(plan.sections.map((section) => [section.start_seconds, section.end_seconds]), [
    [0, 24],
    [24, 65],
    [65, 97],
    [97, 136],
    [136, 180]
  ]);
  assert.equal(plan.sections.every((section) =>
    sourceScript.includes(section.source_text_ja)
    && section.semantic_equivalence
  ), true);
  assert.equal(plan.boundaries.source_rewritten, false);
  assert.equal(plan.boundaries.visible_caption_changed, false);
  assert.equal(plan.boundaries.subtitle_changed, false);
  assert.equal(plan.boundaries.case_digest_spoken, false);
});

test("pronunciation substitutions stay local and cover the required readings", async () => {
  const pronunciation = await readJson("tts-pronunciation-map.json");
  const readings = new Map(pronunciation.entries.map((entry) => [entry.source, entry.reading]));
  assert.equal(readings.get("ミラ・ヴェイル"), "ミラ・ヴェイル");
  assert.equal(readings.get("9:17"), "9時17分");
  assert.equal(readings.get("真鍮の蛾"), "しんちゅうのが");
  assert.equal(readings.get("市の評議会"), "しのひょうぎかい");
  assert.equal(readings.get("「分」の欄"), "「ふん」の欄");
  assert.equal(pronunciation.global_dictionary_mutated, false);
  assert.equal(pronunciation.case_digest_spoken, false);
});

test("calibration result proves section fit, zero clipping, exact media, and closed approval gates", async () => {
  const result = await readJson("voice-calibration-result.json");
  assert.equal(result.passed, true);
  assert.equal(result.candidate_count, 3);
  assert.equal(result.section_sample_count, 15);
  assert.equal(result.pronunciation_sample_count, 3);
  assert.equal(result.candidates.every((candidate) =>
    candidate.all_sections_fit
    && candidate.clipping_count === 0
    && candidate.speed_adjustment_count === 0
    && candidate.pronunciation_map_compatible
  ), true);
  assert.equal(result.section_metrics.every((sample) =>
    sample.head_margin_seconds >= 0.35
    && sample.tail_margin_seconds >= 0.5
    && sample.clipping_count === 0
    && sample.integrated_lufs >= -20
    && sample.integrated_lufs <= -18
    && sample.true_peak_dbtp <= -1
  ), true);
  assert.equal(result.calibration_recommended_style_id, 10007);
  assert.equal(result.narration.duration_seconds, 180);
  assert.equal(result.narration.clipping_count, 0);
  assert.equal(result.narration.sample_exact_placement, true);
  assert.deepEqual(result.narration.placement_sample_offsets, [
    16800,
    1168800,
    3136800,
    4672800,
    6544800
  ]);
  assert.equal(result.muxed_mp4.duration_seconds, 180);
  assert.equal(result.muxed_mp4.frame_count, 5400);
  assert.equal(result.muxed_mp4.audio_stream_count, 1);
  assert.equal(result.muxed_mp4.subtitle_stream_count, 1);
  assert.equal(result.muxed_mp4.subtitle_cue_count, 11);
  assert.equal(result.video_stream_identity.match, true);
  assert.equal(result.offline_synthesis_external_request_count, 0);
  assert.equal(result.review_html.runtime_pass, true);
  assert.equal(result.review_html.desktop.horizontal_overflow_px, 0);
  assert.equal(result.review_html.narrow.horizontal_overflow_px, 0);
  for (const field of [
    "final_voice_selected",
    "production_voice_approved",
    "production_approved",
    "rights_cleared_claim",
    "product_release",
    "public_release",
    "final_canon"
  ]) {
    assert.equal(result.boundaries[field], false);
  }
});

test("timing map has one row per candidate and section", async () => {
  const csv = await readFile(path.join(packageRoot, "section-timing-map.csv"), "utf8");
  const lines = csv.trim().split(/\r?\n/);
  assert.equal(lines.length, 16);
  const rows = lines.slice(1).map((line) => line.split(","));
  assert.deepEqual([...new Set(rows.map((row) => Number(row[0])))].sort(), [10000, 10001, 10007]);
  assert.deepEqual([...new Set(rows.map((row) => Number(row[2])))].sort(), [1, 2, 3, 4, 5]);
});

test("canonical metadata has no terminal-specific absolute paths or tracked media", async () => {
  const names = await readdir(packageRoot);
  const allowedExtensions = new Set([".json", ".csv", ".md"]);
  assert.equal(names.every((name) => allowedExtensions.has(path.extname(name).toLowerCase())), true);
  for (const name of names.filter((name) => name.endsWith(".json"))) {
    const value = await readJson(name);
    const absolutePaths = collectStrings(value).filter((text) => /^[A-Za-z]:[\\/]/.test(text));
    assert.deepEqual(absolutePaths, [], `${name} must not contain terminal-specific absolute paths`);
  }
  const tool = await readFile(
    path.join(repoRoot, "tools", "fff-case-digest-nemo-voice-calibration.ps1"),
    "utf8"
  );
  assert.match(tool, /EngineBaseUri must be an http:\/\/127\.0\.0\.1 loopback URI/);
  assert.match(tool, /adelay=\$\(\$delaySamples\)S/);
  assert.doesNotMatch(tool, /https:\/\/api\.openai\.com|edge-tts|Web Speech/);
});

test("terms record preserves credit and legal/publication boundaries", async () => {
  const terms = await readJson("nemo-terms-record.json");
  assert.equal(terms.terms_url, "https://voicevox.hiroshiba.jp/nemo/term/");
  assert.equal(terms.content_sha256, "f448c18efa38891613606a9a29d9bdd0346fd8ade4f09678ccad56c2f5008e6a");
  assert.match(terms.credit_requirement, /VOICEVOX Nemo/);
  assert.match(terms.machine_learning_use_restriction, /prohibited/);
  assert.equal(terms.private_calibration_only, true);
  assert.equal(terms.publication_performed, false);
  assert.equal(terms.legal_interpretation_claimed, false);
  assert.equal(terms.rights_cleared_claim, false);
});
