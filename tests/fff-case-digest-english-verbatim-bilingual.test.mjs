import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");
const runRoot = process.env.FFF_BILINGUAL_RUN_ROOT
  || "D:\\AI-Runs\\FastFictionFactory\\fff-case-digest-english-verbatim-bilingual-001";
const artifactRoot = path.join(repoRoot, "artifacts", "case-digest-english-verbatim-bilingual");
const verificationRoot = path.join(runRoot, "verification");
const htmlPath = path.join(runRoot, "review", "case-digest-english-verbatim.html");
const sourceCleanPath = "D:\\AI-Runs\\FastFictionFactory\\fff-case-digest-editorial-treatment-001\\clean\\case-digest-editorial-treatment-clean.mp4";
const cleanPath = path.join(runRoot, "clean", "case-digest-english-clean.mp4");
const audiencePath = path.join(runRoot, "audience", "case-digest-english-burned.mp4");
const debugPath = path.join(runRoot, "debug", "case-digest-english-japanese-debug.mp4");
const narrationPath = path.join(runRoot, "audio", "case-digest-english-narration.wav");
const nodeModules = process.env.FFF_NODE_MODULES
  || path.join(process.env.USERPROFILE || "", ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules");

const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const json = async (filePath) => JSON.parse(await readFile(filePath, "utf8"));
const normalizeText = (value) => value.replace(/\r\n?/g, "\n").replace(/\s+/gu, " ").trim();
const ffprobe = (filePath) => JSON.parse(execFileSync("ffprobe", [
  "-v", "error", "-show_streams", "-show_format", "-count_frames", "-of", "json", filePath
], { encoding: "utf8", windowsHide: true }));

function parseTime(value) {
  const match = value.match(/^(\d{2}):(\d{2}):(\d{2})[,.](\d{3})$/u);
  assert.ok(match, `invalid caption time ${value}`);
  return ((Number(match[1]) * 60 + Number(match[2])) * 60 + Number(match[3])) * 1000 + Number(match[4]);
}

function parseCaptionFile(text) {
  const normalized = text.replace(/^\uFEFF/u, "").replace(/\r\n?/g, "\n").trim();
  const body = normalized.startsWith("WEBVTT") ? normalized.slice("WEBVTT".length).trim() : normalized;
  return body.split(/\n{2,}/u).map((block) => {
    const lines = block.split("\n");
    const timingIndex = lines.findIndex((line) => line.includes("-->"));
    assert.ok(timingIndex >= 0, `missing cue timing in ${block}`);
    const [start, end] = lines[timingIndex].split("-->").map((value) => value.trim());
    return {
      id: normalized.startsWith("WEBVTT") ? lines[0] : null,
      start_milliseconds: parseTime(start),
      end_milliseconds: parseTime(end),
      lines: lines.slice(timingIndex + 1),
      text: normalizeText(lines.slice(timingIndex + 1).join(" "))
    };
  });
}

test("English script and source-fact audit satisfy the bounded CASE_DIGEST contract", async () => {
  const authority = await json(path.join(artifactRoot, "utterance-authority.json"));
  const audit = await json(path.join(artifactRoot, "source-fact-audit.json"));
  assert.equal(authority.section_count, 5);
  assert.equal(authority.shot_count, 11);
  assert.equal(authority.duration_seconds, 180);
  assert.ok(authority.utterance_count >= 18 && authority.utterance_count <= 24);
  assert.ok(authority.word_count >= 280 && authority.word_count <= 360);
  assert.equal(authority.utterances.length, authority.utterance_count);
  assert.equal(audit.utterance_count, authority.utterance_count);
  assert.equal(audit.unsupported_fact_count, 0);
  assert.equal(new Set(authority.utterances.map((item) => item.section_id)).size, 5);
  assert.equal(new Set(authority.utterances.map((item) => item.shot_id)).size, 11);
  for (const item of authority.utterances) {
    assert.equal(item.tts_text_en, item.spoken_text_en, `${item.utterance_id} TTS identity`);
    assert.ok(item.word_count >= 6 && item.word_count <= 24, `${item.utterance_id} sentence length`);
    assert.ok(item.source_fact_ids.length >= 1, `${item.utterance_id} lineage`);
    assert.equal(item.unsupported_fact_count, 0);
    assert.ok(item.text_ja.length > 0);
  }
  const joined = authority.utterances.map((item) => item.spoken_text_en).join("\n");
  assert.match(joined, /tower that has no bell/iu);
  assert.match(joined, /Clock repairer Mira/iu);
  assert.match(joined, /missing brother/iu);
  assert.match(joined, /note/iu);
  assert.match(joined, /brass moth/iu);
  assert.match(joined, /nine seventeen/iu);
  assert.match(joined, /minutes/iu);
  assert.match(joined, /names/iu);
  assert.match(joined, /city council/iu);
  assert.match(joined, /not evidence confirming/iu);
  assert.equal((joined.match(/\bMira\b/gu) || []).length, 1);
});

test("English and Japanese SRT/VTT cues preserve exact text, IDs, and timings", async () => {
  const authority = await json(path.join(artifactRoot, "utterance-authority.json"));
  const enSrt = parseCaptionFile(await readFile(path.join(runRoot, "youtube", "case-digest.en.srt"), "utf8"));
  const enVtt = parseCaptionFile(await readFile(path.join(runRoot, "youtube", "case-digest.en.vtt"), "utf8"));
  const jaSrt = parseCaptionFile(await readFile(path.join(runRoot, "youtube", "case-digest.ja.srt"), "utf8"));
  const jaVtt = parseCaptionFile(await readFile(path.join(runRoot, "youtube", "case-digest.ja.vtt"), "utf8"));
  for (const rows of [enSrt, enVtt, jaSrt, jaVtt]) assert.equal(rows.length, authority.utterance_count);
  for (let index = 0; index < authority.utterances.length; index += 1) {
    const item = authority.utterances[index];
    const expectedStart = Math.round(item.caption_start_seconds * 1000);
    const expectedEnd = Math.round(item.caption_end_seconds * 1000);
    assert.equal(enSrt[index].text, item.spoken_text_en);
    assert.equal(enVtt[index].text, item.spoken_text_en);
    assert.equal(normalizeText(jaSrt[index].lines.join("")), normalizeText(item.text_ja));
    assert.equal(normalizeText(jaVtt[index].lines.join("")), normalizeText(item.text_ja));
    assert.equal(enVtt[index].id, item.utterance_id);
    assert.equal(jaVtt[index].id, item.utterance_id);
    for (const cue of [enSrt[index], enVtt[index], jaSrt[index], jaVtt[index]]) {
      assert.equal(cue.start_milliseconds, expectedStart);
      assert.equal(cue.end_milliseconds, expectedEnd);
      assert.ok(cue.lines.length >= 1 && cue.lines.length <= 2);
    }
  }
  const lock = await json(path.join(artifactRoot, "spoken-caption-lock.json"));
  assert.equal(lock.spoken_caption_text_mismatch_count, 0);
  assert.equal(lock.audio_only_semantic_unit_count, 0);
  assert.equal(lock.caption_only_semantic_unit_count, 0);
  assert.equal(lock.non_verbatim_editorial_text_during_speech_count, 0);
  assert.equal(lock.english_spoken_caption_coverage_percent, 100);
  assert.equal(lock.japanese_debug_coverage_percent, 100);
});

test("timing authority keeps narration and captions aligned without gaps or overlaps", async () => {
  const authority = await json(path.join(artifactRoot, "utterance-authority.json"));
  const rows = authority.utterances;
  assert.ok(rows[0].audio_start_seconds <= 2);
  assert.ok(180 - rows.at(-1).audio_end_seconds <= 6);
  for (let index = 0; index < rows.length; index += 1) {
    const item = rows[index];
    assert.equal(item.caption_start_seconds, item.audio_start_seconds);
    const endDelta = Math.round((item.caption_end_seconds - item.audio_end_seconds) * 1000);
    assert.ok(endDelta >= 100 && endDelta <= 350, `${item.utterance_id} caption tail`);
    assert.ok(item.audible_onset_offset_milliseconds <= 100);
    if (index > 0) {
      const previous = rows[index - 1];
      assert.ok(item.audio_start_seconds >= previous.audio_end_seconds, `${item.utterance_id} narration overlap`);
      assert.ok(item.caption_start_seconds >= previous.caption_end_seconds, `${item.utterance_id} caption overlap`);
      assert.ok(item.audio_start_seconds - previous.audio_end_seconds <= 4.5, `${item.utterance_id} narration gap`);
    }
  }
});

test("narration WAV and all three MP4 outputs satisfy exact media contracts", () => {
  const wav = ffprobe(narrationPath);
  const wavAudio = wav.streams.filter((stream) => stream.codec_type === "audio");
  assert.equal(wavAudio.length, 1);
  assert.equal(wavAudio[0].codec_name, "pcm_s16le");
  assert.equal(Number(wavAudio[0].sample_rate), 48000);
  assert.equal(wavAudio[0].channels, 1);
  assert.ok(Math.abs(Number(wav.format.duration) - 180) <= 0.000001);
  for (const [label, filePath] of [["clean", cleanPath], ["audience", audiencePath], ["debug", debugPath]]) {
    const probe = ffprobe(filePath);
    const video = probe.streams.filter((stream) => stream.codec_type === "video");
    const audio = probe.streams.filter((stream) => stream.codec_type === "audio");
    const subtitles = probe.streams.filter((stream) => stream.codec_type === "subtitle");
    assert.equal(video.length, 1, `${label} video stream`);
    assert.equal(video[0].width, 1280);
    assert.equal(video[0].height, 720);
    assert.equal(video[0].avg_frame_rate, "30/1");
    assert.equal(Number(video[0].nb_read_frames), 5400);
    assert.ok(Math.abs(Number(probe.format.duration) - 180) <= 0.001);
    assert.equal(audio.length, 1, `${label} audio stream`);
    assert.equal(audio[0].channels, 1);
    assert.equal(subtitles.length, label === "clean" ? 2 : 0);
    if (label === "clean") {
      assert.deepEqual(subtitles.map((stream) => stream.tags.language), ["eng", "jpn"]);
    }
  }
});

test("accepted visual treatment and transition frames are bit-identical in the clean master", async () => {
  const frameMd5 = (filePath) => execFileSync("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-i", filePath,
    "-map", "0:v:0", "-an", "-f", "framemd5", "-"
  ], { encoding: "utf8", windowsHide: true, maxBuffer: 16 * 1024 * 1024 });
  const source = frameMd5(sourceCleanPath);
  const output = frameMd5(cleanPath);
  assert.equal(output, source);
  const evidence = {
    passed: true,
    source_frame_md5_sha256: sha256(source),
    output_frame_md5_sha256: sha256(output),
    decoded_frame_identity: true,
    frame_count: 5400,
    section_count: 5,
    shot_count: 11,
    transition_boundary_count: 10,
    transition_reset_count: 0,
    raw_source_flash_count: 0,
    accepted_image_change_count: 0,
    image_generation_count: 0
  };
  await mkdir(verificationRoot, { recursive: true });
  await writeFile(path.join(verificationRoot, "transition-preservation.json"), `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
});

test("caption layout stays within two lines and preserves English phrases and Japanese kinsoku", async () => {
  const layout = await json(path.join(artifactRoot, "caption-layout-evidence.json"));
  assert.equal(layout.english_orphan_count, 0);
  assert.equal(layout.english_split_name_count, 0);
  assert.equal(layout.english_split_number_phrase_count, 0);
  assert.equal(layout.japanese_kinsoku_violation_count, 0);
  const forbiddenStart = /^[、。，．？！）」』】〕〉》]/u;
  const forbiddenEnd = /[（「『【〔〈《]$/u;
  for (const row of layout.rows) {
    assert.ok(row.english_line_count >= 1 && row.english_line_count <= 2);
    assert.ok(row.japanese_line_count >= 1 && row.japanese_line_count <= 2);
    assert.ok(row.english_lines.every((line) => line.trim().split(/\s+/u).length >= 2));
    for (const line of row.japanese_lines) {
      assert.doesNotMatch(line, forbiddenStart);
      assert.doesNotMatch(line, forbiddenEnd);
    }
  }
});

test("standalone review defaults to English and toggles Japanese only in visible debug mode", async () => {
  const { chromium } = await import(pathToFileURL(path.join(nodeModules, "playwright", "index.mjs")).href);
  const authority = await json(path.join(artifactRoot, "utterance-authority.json"));
  const browser = await chromium.launch({ headless: true });
  const consoleErrors = [];
  const pageErrors = [];
  const externalRequests = [];
  const viewports = {};
  const captionChecks = [];
  try {
    for (const [name, viewport] of Object.entries({
      wide: { width: 1440, height: 1000 },
      narrow: { width: 390, height: 844 }
    })) {
      const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
      page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
      page.on("pageerror", (error) => pageErrors.push(error.message));
      page.on("request", (request) => { if (/^https?:/iu.test(request.url())) externalRequests.push(request.url()); });
      await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });
      await page.waitForFunction(() => window.__FFF_BILINGUAL__ && window.__FFF_BILINGUAL__.video.readyState >= 1);
      if (name === "wide") {
        for (const item of authority.utterances) {
          await page.evaluate((seconds) => window.__FFF_BILINGUAL__.seek(seconds), item.caption_start_seconds + 0.05);
          const state = await page.evaluate(() => window.__FFF_BILINGUAL__.getState());
          assert.equal(state.english, item.spoken_text_en);
          assert.equal(normalizeText(state.english_rendered), item.spoken_text_en);
          const lineMetrics = await page.locator("#english").evaluate((element) => ({
            renderedLines: Math.round(element.getBoundingClientRect().height / Number.parseFloat(getComputedStyle(element).lineHeight)),
            explicitLines: element.textContent.split("\n").length
          }));
          assert.ok(lineMetrics.renderedLines <= 2 && lineMetrics.explicitLines <= 2, `${item.utterance_id} HTML English lines`);
          assert.equal(state.english_visible, true);
          assert.equal(state.japanese_visible, false);
          assert.equal(state.debug, false);
          assert.equal(state.paused, true);
          assert.equal(state.autoplay, false);
          captionChecks.push({ utterance_id: item.utterance_id, english_exact: true, japanese_default_absent: true });
        }
        await page.locator("#debugToggle").click();
        await page.evaluate((seconds) => window.__FFF_BILINGUAL__.seek(seconds), authority.utterances[7].caption_start_seconds + 0.05);
        const debugState = await page.evaluate(() => window.__FFF_BILINGUAL__.getState());
        assert.equal(debugState.english, authority.utterances[7].spoken_text_en);
        assert.equal(debugState.japanese, authority.utterances[7].text_ja);
        assert.equal(debugState.english_visible, true);
        assert.equal(debugState.japanese_visible, true);
        assert.equal(debugState.debug_mark_visible, true);
        const debugGeometry = await page.evaluate(() => {
          const stage = document.getElementById("stage").getBoundingClientRect();
          const japanese = document.getElementById("japanese").getBoundingClientRect();
          return { japanese_control_clearance_px: stage.bottom - japanese.bottom };
        });
        assert.ok(debugGeometry.japanese_control_clearance_px >= 55);
      } else {
        const item = authority.utterances[18];
        await page.evaluate((seconds) => window.__FFF_BILINGUAL__.seek(seconds), item.caption_start_seconds + 0.05);
        const state = await page.evaluate(() => window.__FFF_BILINGUAL__.getState());
        assert.equal(state.english, item.spoken_text_en);
        assert.equal(normalizeText(state.english_rendered), item.spoken_text_en);
        assert.equal(state.japanese_visible, false);
        const narrowLineMetrics = await page.locator("#english").evaluate((element) => ({
          renderedLines: Math.round(element.getBoundingClientRect().height / Number.parseFloat(getComputedStyle(element).lineHeight)),
          explicitLines: element.textContent.split("\n").length
        }));
        assert.ok(narrowLineMetrics.renderedLines <= 2 && narrowLineMetrics.explicitLines <= 2, `${item.utterance_id} narrow HTML English lines`);
      }
      await page.locator("#debugToggle").focus();
      const metrics = await page.evaluate(() => ({
        document_width: document.documentElement.scrollWidth,
        viewport_width: innerWidth,
        horizontal_overflow_px: Math.max(0, document.documentElement.scrollWidth - innerWidth),
        native_controls: document.getElementById("candidate").controls,
        autoplay: document.getElementById("candidate").autoplay,
        paused: document.getElementById("candidate").paused,
        focus_outline_style: getComputedStyle(document.activeElement).outlineStyle,
        focus_outline_width: getComputedStyle(document.activeElement).outlineWidth,
        english_caption_count: window.__FFF_BILINGUAL__.data.utterances.length
      }));
      const screenshotPath = path.join(verificationRoot, `review-${name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false, animations: "disabled" });
      viewports[name] = { ...metrics, screenshot_path: screenshotPath };
      await page.close();
    }
  } finally {
    await browser.close();
  }
  assert.equal(consoleErrors.length, 0);
  assert.equal(pageErrors.length, 0);
  assert.equal(externalRequests.length, 0);
  assert.equal(viewports.wide.horizontal_overflow_px, 0);
  assert.equal(viewports.narrow.horizontal_overflow_px, 0);
  assert.equal(viewports.wide.native_controls, true);
  assert.equal(viewports.narrow.native_controls, true);
  assert.equal(viewports.wide.autoplay, false);
  assert.equal(viewports.narrow.autoplay, false);
  assert.equal(viewports.wide.paused, true);
  assert.equal(viewports.narrow.paused, true);
  const evidence = {
    passed: true,
    default_mode: "English audience",
    english_captions_visible: true,
    japanese_default_absent: true,
    debug_toggle_preserves_english: true,
    debug_toggle_enables_japanese: true,
    debug_marker_visible: true,
    external_request_count: externalRequests.length,
    console_error_count: consoleErrors.length,
    page_error_count: pageErrors.length,
    autoplay: false,
    native_controls: true,
    caption_checks: captionChecks,
    viewports
  };
  await writeFile(path.join(verificationRoot, "browser-validation.json"), `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
});

test("tracked candidate package is text-only and effect boundaries remain closed", async () => {
  const allowedExtensions = new Set([".json", ".md", ".srt", ".vtt"]);
  const walk = async (directory) => {
    const rows = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const filePath = path.join(directory, entry.name);
      if (entry.isDirectory()) rows.push(...await walk(filePath));
      else rows.push(filePath);
    }
    return rows;
  };
  const files = await walk(artifactRoot);
  assert.ok(files.length >= 10);
  for (const filePath of files) assert.ok(allowedExtensions.has(path.extname(filePath)), `non-text tracked artifact ${filePath}`);
  const result = await json(path.join(artifactRoot, "result.json"));
  assert.equal(result.effects.network_request_count, 0);
  assert.equal(result.effects.credential_touch_count, 0);
  assert.equal(result.effects.package_install_count, 0);
  assert.equal(result.effects.upload_count, 0);
  assert.equal(result.effects.public_effect_count, 0);
  assert.equal(result.effects.music_sfx_count, 0);
  assert.equal(result.boundaries.rights_cleared, false);
  assert.equal(result.boundaries.production_approved, false);
  assert.equal(result.boundaries.published, false);
  assert.equal(result.boundaries.final_voice_selected, false);
  assert.equal(result.boundaries.final_canon, false);
  const rejection = await json(path.join(artifactRoot, "rejected-format-record.json"));
  assert.equal(rejection.status, "active");
  assert.equal(rejection.rejected.length, 4);
  assert.ok(rejection.preserved.includes("accepted Raster images"));
});
