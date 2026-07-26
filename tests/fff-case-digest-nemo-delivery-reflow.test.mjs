import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageRoot = path.join(
  repoRoot,
  "artifacts",
  "case-digest-nemo-delivery-reflow",
);
const sourceRoot = path.join(
  repoRoot,
  "artifacts",
  "private-raster-case-digest",
);

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function parseCsv(text) {
  const records = [];
  let record = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      record.push(field);
      field = "";
    } else if (char === "\n") {
      record.push(field.replace(/\r$/, ""));
      records.push(record);
      record = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field.length > 0 || record.length > 0) {
    record.push(field);
    records.push(record);
  }
  const [headers, ...rows] = records.filter((row) => row.some(Boolean));
  return rows.map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])),
  );
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

test("Product Owner listening evidence is bound to exact attempt-3 identities", async () => {
  const observation = await readJson(
    path.join(packageRoot, "owner-listening-observation.json"),
  );
  assert.equal(observation.source_calibration.attempt_id, 3);
  assert.equal(
    observation.source_calibration.commit,
    "63fb60c505952377455536d9dd84cb164d3b3a0c",
  );
  assert.equal(
    observation.source_calibration.style_10007_full_candidate_sha256,
    "a68c39e7abb3de3548d04656c9a5a9907926451c03d8595db85ee815a50b84a1",
  );
  assert.equal(observation.source_calibration.style_10000_section_samples.length, 5);
  assert.equal(observation.normalized_state.preferred_style_for_next_candidate, 10000);
  assert.deepEqual(
    observation.normalized_state.rejected_current_delivery_styles,
    [10007, 10001],
  );
  assert.equal(observation.normalized_state.final_voice_selected, false);
  assert.equal(observation.normalized_state.production_voice_approved, false);
  assert.match(observation.scope_boundary, /do not reject every future use/i);
});

test("22 zero-based end-exclusive spans reproduce the exact five-section source", async () => {
  const source = await readJson(
    path.join(sourceRoot, "private-raster-case-digest.json"),
  );
  const rows = parseCsv(
    await readFile(path.join(packageRoot, "narration-utterance-map.csv"), "utf8"),
  );
  assert.equal(rows.length, 22);

  for (let sectionId = 1; sectionId <= 5; sectionId += 1) {
    const sectionRows = rows.filter(
      (row) => Number(row.source_section_id) === sectionId,
    );
    const sourceText = source.sections[sectionId - 1].text_ja;
    assert.equal(sectionRows.map((row) => row.source_text_ja).join(""), sourceText);
    let cursor = 0;
    for (const row of sectionRows) {
      assert.equal(Number(row.source_character_start), cursor);
      assert.equal(
        sourceText.slice(
          Number(row.source_character_start),
          Number(row.source_character_end),
        ),
        row.source_text_ja,
      );
      cursor = Number(row.source_character_end);
      assert.equal(row.semantic_equivalence, "True");
      assert.equal(Number(row.style_id), 10000);
      assert.match(row.source_text_sha256, /^[0-9a-f]{64}$/);
      assert.match(row.wav_sha256, /^[0-9a-f]{64}$/);
    }
    assert.equal(cursor, sourceText.length);
  }

  const textUnits = rows.map((row) => row.source_text_ja);
  assert.ok(textUnits.some((text) => text.includes("ミラ・ヴェイル")));
  assert.ok(textUnits.filter((text) => text.includes("9:17")).every((text) => text.includes("9:17")));
  assert.ok(
    textUnits
      .filter((text) => text.includes("真鍮"))
      .every((text) => text.includes("真鍮の蛾")),
  );
  assert.ok(
    textUnits
      .filter((text) => text.includes("ミラ"))
      .every((text) => text.includes("ミラ・ヴェイルは、")),
  );
});

test("shot-aligned placement covers all eleven shots and passes every silence limit", async () => {
  const result = await readJson(
    path.join(packageRoot, "voice-delivery-result.json"),
  );
  const source = await readJson(
    path.join(sourceRoot, "private-raster-case-digest.json"),
  );
  const shotById = new Map(source.shots.map((shot) => [shot.shot_id, shot]));
  const coverage = new Map(source.shots.map((shot) => [shot.shot_id, 0]));

  assert.equal(result.utterance_count, 22);
  for (const [index, event] of result.utterances.entries()) {
    const shot = shotById.get(event.shot_id);
    assert.ok(shot, `unknown shot for ${event.utterance_id}`);
    coverage.set(event.shot_id, coverage.get(event.shot_id) + 1);
    assert.equal(event.style_id, 10000);
    assert.equal(event.speedScale, 1);
    assert.equal(event.pitchScale, 0);
    assert.equal(event.intonationScale, 1);
    assert.equal(event.volumeScale, 1);
    assert.ok(event.target_start_seconds >= shot.start_seconds + 0.25);
    assert.ok(event.actual_end_seconds <= shot.end_seconds - 0.35 + 0.000001);
    if (index > 0) {
      const previous = result.utterances[index - 1];
      const gap = event.target_start_seconds - previous.actual_end_seconds;
      assert.ok(gap >= -0.000001);
      assert.ok(gap <= 5.000001);
    }
  }
  assert.deepEqual([...coverage.values()].every((count) => count > 0), true);
  assert.equal(result.silence.every_shot_covered, true);
  assert.equal(result.silence.maximum_internal_gap_seconds, 5);
  assert.equal(result.silence.median_internal_gap_seconds, 4.926);
  assert.equal(result.silence.no_ten_second_gap, true);
  assert.equal(result.silence.overlap_count, 0);
  assert.equal(result.silence.duplicated_speech_count, 0);
  assert.equal(result.silence.contract_pass, true);
  for (const section of result.silence.section_gaps) {
    assert.ok(section.head_gap_seconds <= 1);
    assert.ok(section.tail_gap_seconds <= section.tail_limit_seconds);
  }

  const [firstRegion, secondRegion] = result.silence.region_evidence;
  assert.equal(firstRegion.before.previous_speechless_overlap_seconds, 12);
  assert.ok(firstRegion.after.maximum_contiguous_speechless_seconds <= 5);
  assert.equal(secondRegion.before.previous_speechless_overlap_seconds, 17.933333);
  assert.ok(secondRegion.after.maximum_contiguous_speechless_seconds <= 5);
});

test("the brass-moth substitution is TTS-only and has exact comparison evidence", async () => {
  const pronunciation = await readJson(
    path.join(packageRoot, "tts-pronunciation-map-v2.json"),
  );
  const result = await readJson(
    path.join(packageRoot, "voice-delivery-result.json"),
  );
  const substitution = pronunciation.substitutions.find(
    (item) => item.source === "真鍮の蛾",
  );
  assert.equal(substitution.tts_reading, "しんちゅうでできた、ガ");
  assert.equal(pronunciation.global_dictionary_mutated, false);
  assert.equal(pronunciation.visible_text_mutated, false);
  assert.equal(result.diagnostics.brass_moth_visible_source, "真鍮の蛾");
  assert.equal(
    result.diagnostics.brass_moth_tts_reading,
    "しんちゅうでできた、ガ",
  );
  assert.equal(result.diagnostics.perceptual_acceptance_claimed, false);
  assert.equal(result.diagnostics.comparison_metrics.clipping_count, 0);
  assert.match(result.diagnostics.comparison_metrics.sha256, /^[0-9a-f]{64}$/);
  assert.equal(
    result.utterances.filter((event) => event.source_text_ja.includes("真鍮の蛾"))
      .every((event) => event.tts_reading_text_ja.includes("しんちゅうでできた、ガ")),
    true,
  );
});

test("tracked media result proves exact mux, unchanged streams, and browser runtime", async () => {
  const result = await readJson(
    path.join(packageRoot, "voice-delivery-result.json"),
  );
  assert.equal(result.passed, true);
  assert.equal(result.validation_status, "passed");
  assert.equal(result.narration.metrics.duration_seconds, 180);
  assert.equal(result.narration.metrics.sample_rate, 48000);
  assert.equal(result.narration.metrics.channels, 1);
  assert.equal(result.narration.metrics.clipping_count, 0);
  assert.ok(result.narration.metrics.true_peak_dbtp <= -1);
  assert.equal(result.muxed_mp4.duration_seconds, 180);
  assert.equal(result.muxed_mp4.frame_count, 5400);
  assert.equal(result.muxed_mp4.audio_stream_count, 1);
  assert.equal(result.muxed_mp4.subtitle_stream_count, 1);
  assert.equal(result.muxed_mp4.subtitle_cue_count, 11);
  assert.equal(result.video_stream_identity.match, true);
  assert.equal(result.subtitle_stream_identity.match, true);
  assert.equal(result.review_html.runtime.runtime_pass, true);
  assert.equal(result.review_html.runtime.desktop.horizontal_overflow_px, 0);
  assert.equal(result.review_html.runtime.desktop.nested_vertical_scroll_count, 0);
  assert.equal(result.review_html.runtime.narrow.horizontal_overflow_px, 0);
  assert.equal(result.review_html.runtime.narrow.nested_vertical_scroll_count, 0);
  assert.equal(result.review_html.runtime.console_error_count, 0);
  assert.equal(result.review_html.runtime.page_error_count, 0);
  assert.equal(result.review_html.runtime.autoplay_attribute_count, 0);
  assert.equal(result.review_html.runtime.all_media_paused, true);
  assert.equal(result.review_html.runtime.keyboard_focus.pass, true);
});

test("source hashes remain exact and all approval/publication gates stay closed", async () => {
  const result = await readJson(
    path.join(packageRoot, "voice-delivery-result.json"),
  );
  const sourcePaths = {
    source_script: path.join(sourceRoot, "case-digest-script.md"),
    source_package: path.join(sourceRoot, "private-raster-case-digest.json"),
    visible_captions: path.join(sourceRoot, "case-digest-review-captions.csv"),
    visible_subtitles: path.join(
      sourceRoot,
      "case-digest-production-subtitles-draft.csv",
    ),
    shot_sequence: path.join(sourceRoot, "selected-shot-sequence.csv"),
    transition_map: path.join(sourceRoot, "transition-boundary-map.csv"),
  };
  for (const [name, filePath] of Object.entries(sourcePaths)) {
    assert.equal(
      sha256(await readFile(filePath)),
      result.source_immutability.tracked_source_hashes[name],
    );
  }
  assert.equal(result.source_immutability.changed_image_count, 0);
  assert.equal(result.source_immutability.selected_image_count, 11);
  assert.equal(
    result.source_immutability.selected_images.every((image) => image.unchanged),
    true,
  );
  assert.equal(result.boundaries.final_voice_selected, false);
  assert.equal(result.boundaries.production_voice_approved, false);
  assert.equal(result.boundaries.production_approved, false);
  assert.equal(result.boundaries.rights_cleared_claim, false);
  assert.equal(result.boundaries.public_release, false);
  assert.equal(result.boundaries.publication, false);
  assert.equal(result.boundaries.final_canon, false);
});

test("canonical JSON has no terminal-specific paths and tracked package has no media", async () => {
  const jsonFiles = (
    await readdir(packageRoot, { withFileTypes: true, recursive: true })
  )
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(entry.parentPath, entry.name));
  for (const filePath of jsonFiles) {
    const strings = collectStrings(await readJson(filePath));
    assert.equal(
      strings.some((value) => /^[A-Za-z]:[\\/]/.test(value)),
      false,
      `absolute path found in ${filePath}`,
    );
  }
  const packageFiles = (
    await readdir(packageRoot, { withFileTypes: true, recursive: true })
  ).filter((entry) => entry.isFile());
  assert.equal(
    packageFiles.some((entry) =>
      [".wav", ".aac", ".mp4", ".vvpp", ".zip", ".exe", ".onnx"].includes(
        path.extname(entry.name).toLowerCase(),
      ),
    ),
    false,
  );
});

test("artifact registration points to the tracked package without opening release gates", async () => {
  const manifest = await readJson(
    path.join(repoRoot, "artifacts", "artifact-manifest.json"),
  );
  const entry = manifest.case_digest_nemo_delivery_reflow;
  assert.equal(entry.artifact_id, "fff-case-digest-nemo-delivery-reflow-001");
  assert.equal(entry.delivery_style_id, 10000);
  assert.equal(entry.utterance_count, 22);
  assert.equal(entry.shot_count, 11);
  assert.equal(entry.runtime_pass, true);
  assert.equal(entry.tracked_audio_count, 0);
  assert.equal(entry.tracked_binary_count, 0);
  assert.equal(entry.final_voice_selected, false);
  assert.equal(entry.production_voice_approved, false);
  assert.equal(entry.rights_cleared_claim, false);
  assert.equal(entry.public_release, false);
  assert.equal(entry.publication, false);
  assert.equal(entry.final_canon, false);
});
