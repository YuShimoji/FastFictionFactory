import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");
const runRoot = process.env.FFF_EDITORIAL_NATURALNESS_RUN_ROOT
  || "D:\\AI-Runs\\FastFictionFactory\\fff-case-digest-english-editorial-naturalness-001";
const artifactRoot = path.join(repoRoot, "artifacts", "case-digest-english-editorial-naturalness");
const predecessorRoot = path.join(repoRoot, "artifacts", "case-digest-english-verbatim-bilingual");
const verificationRoot = path.join(runRoot, "verification");
const htmlPath = path.join(runRoot, "review", "case-digest-english-editorial-naturalness.html");
const sourceCleanPath = "D:\\AI-Runs\\FastFictionFactory\\fff-case-digest-english-verbatim-bilingual-001\\clean\\case-digest-english-clean.mp4";
const cleanPath = path.join(runRoot, "clean", "case-digest-english-clean.mp4");
const audiencePath = path.join(runRoot, "audience", "case-digest-english-burned.mp4");
const debugPath = path.join(runRoot, "debug", "case-digest-english-japanese-debug.mp4");
const narrationPath = path.join(runRoot, "audio", "case-digest-english-narration.wav");
const nodeModules = process.env.FFF_NODE_MODULES
  || path.join(process.env.USERPROFILE || "", ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules");

const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const json = async (filePath) => JSON.parse(await readFile(filePath, "utf8"));
const normalizeText = (value) => value.replace(/\r\n?/gu, "\n").replace(/\s+/gu, " ").trim();
const ffprobe = (filePath) => JSON.parse(execFileSync("ffprobe", [
  "-v", "error", "-show_streams", "-show_format", "-count_frames", "-of", "json", filePath
], { encoding: "utf8", windowsHide: true }));

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === "\"" && text[index + 1] === "\"") {
        field += "\"";
        index += 1;
      } else if (character === "\"") {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === "\"") {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/u, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [headers, ...body] = rows.filter((candidate) => candidate.some((value) => value.length));
  return body.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function parseTime(value) {
  const match = value.match(/^(\d{2}):(\d{2}):(\d{2})[,.](\d{3})$/u);
  assert.ok(match, `invalid caption time ${value}`);
  return ((Number(match[1]) * 60 + Number(match[2])) * 60 + Number(match[3])) * 1000 + Number(match[4]);
}

function parseCaptionFile(text) {
  const normalized = text.replace(/^\uFEFF/u, "").replace(/\r\n?/gu, "\n").trim();
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

test("revised script is natural, complete, and evidence-bounded", async () => {
  const authority = await json(path.join(artifactRoot, "revised-bilingual-utterance-authority.json"));
  const predecessor = await json(path.join(predecessorRoot, "utterance-authority.json"));
  const audit = await json(path.join(artifactRoot, "revised-source-fact-audit.json"));
  const result = await json(path.join(artifactRoot, "case-digest-english-editorial-naturalness-result.json"));
  assert.equal(authority.section_count, 5);
  assert.equal(authority.shot_count, 11);
  assert.equal(authority.duration_seconds, 180);
  assert.equal(authority.utterance_count, 24);
  assert.ok(authority.word_count >= 270 && authority.word_count <= 320);
  assert.equal(authority.utterances.length, 24);
  assert.deepEqual(authority.utterances.map((item) => item.utterance_id), predecessor.utterances.map((item) => item.utterance_id));
  assert.deepEqual(authority.utterances.map((item) => item.shot_id), predecessor.utterances.map((item) => item.shot_id));
  for (const item of authority.utterances) {
    assert.equal(item.tts_text_en, item.spoken_text_en, `${item.utterance_id} TTS identity`);
    assert.ok(item.word_count >= 5 && item.word_count <= 22, `${item.utterance_id} sentence length`);
    assert.ok(item.source_fact_ids.length >= 1, `${item.utterance_id} lineage`);
    assert.equal(item.unsupported_fact_count, 0);
    assert.match(item.spoken_text_en, /[.!?]$/u);
    assert.ok(item.text_ja.length > 0);
  }
  const requiredRepairs = new Set(["cd-en-003", "cd-en-012", "cd-en-015", "cd-en-017", "cd-en-019", "cd-en-020", "cd-en-021"]);
  for (let index = 0; index < authority.utterances.length; index += 1) {
    if (requiredRepairs.has(authority.utterances[index].utterance_id)) {
      assert.notEqual(authority.utterances[index].spoken_text_en, predecessor.utterances[index].spoken_text_en);
    }
  }
  const joined = authority.utterances.map((item) => item.spoken_text_en).join("\n");
  assert.doesNotMatch(joined, /\b(causal action|records an allegation|no available material establishes|available material)\b/iu);
  assert.ok((joined.match(/\breported\b/giu) || []).length <= 1);
  assert.equal((joined.match(/\bestablished\b/giu) || []).length, 0);
  assert.equal((joined.match(/\bconfirmed\b/giu) || []).length, 0);
  assert.equal((joined.match(/\bunverified\b/giu) || []).length, 0);
  assert.match(joined, /tower that has no bell/iu);
  assert.match(joined, /Clock repairer Mira/iu);
  assert.match(joined, /note said to have come from him/iu);
  assert.match(joined, /brass moth/iu);
  assert.match(joined, /nine seventeen/iu);
  assert.match(joined, /minutes/iu);
  assert.match(joined, /people's names/iu);
  assert.match(joined, /city council/iu);
  const finalText = authority.utterances.slice(18).map((item) => item.spoken_text_en).join(" ");
  assert.doesNotMatch(finalText, /minutes.+names|names.+minutes|two separate categories|records a real loss/iu);
  assert.match(authority.utterances.at(-1).spoken_text_en, /tower remains under investigation/iu);
  for (const key of [
    "unsupported_fact_count",
    "hidden_causal_bridge_count",
    "unauthorized_canon_count",
    "allegation_promoted_to_fact_count",
    "unknown_promoted_to_fact_count"
  ]) assert.equal(audit[key], 0, key);
  assert.equal(result.naturalness.grammatical_fragment_count, 0);
  assert.equal(result.naturalness.adjacent_redundant_caveat_count, 0);
  assert.equal(result.naturalness.final_section_ledger_duplication_count, 0);
});

test("predecessor, naturalness, and caption audits cover all 24 stable utterances", async () => {
  const predecessorAudit = parseCsv(await readFile(path.join(artifactRoot, "predecessor-utterance-audit.csv"), "utf8"));
  const naturalnessAudit = parseCsv(await readFile(path.join(artifactRoot, "english-naturalness-audit.csv"), "utf8"));
  const captionAudit = parseCsv(await readFile(path.join(artifactRoot, "revised-caption-sync-audit.csv"), "utf8"));
  assert.equal(predecessorAudit.length, 24);
  assert.equal(naturalnessAudit.length, 24);
  assert.equal(captionAudit.length, 24);
  assert.equal(predecessorAudit.filter((row) => row.finding_class === "required_repair").length, 7);
  assert.ok(predecessorAudit.every((row) => row.materially_rewritten === "True"));
  assert.ok(naturalnessAudit.every((row) => row.passed === "True"));
  assert.ok(captionAudit.every((row) => row.tts_equals_spoken === "True"));
  assert.ok(captionAudit.every((row) => row.japanese_debug_present === "True"));
});

test("English and Japanese SRT/VTT cues preserve exact text, IDs, and timings", async () => {
  const authority = await json(path.join(artifactRoot, "revised-bilingual-utterance-authority.json"));
  const enSrt = parseCaptionFile(await readFile(path.join(runRoot, "youtube", "case-digest.en.srt"), "utf8"));
  const enVtt = parseCaptionFile(await readFile(path.join(runRoot, "youtube", "case-digest.en.vtt"), "utf8"));
  const jaSrt = parseCaptionFile(await readFile(path.join(runRoot, "youtube", "case-digest.ja.srt"), "utf8"));
  const jaVtt = parseCaptionFile(await readFile(path.join(runRoot, "youtube", "case-digest.ja.vtt"), "utf8"));
  for (const rows of [enSrt, enVtt, jaSrt, jaVtt]) assert.equal(rows.length, 24);
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
  const lock = await json(path.join(artifactRoot, "revised-spoken-caption-lock.json"));
  assert.equal(lock.spoken_caption_text_mismatch_count, 0);
  assert.equal(lock.audio_only_semantic_unit_count, 0);
  assert.equal(lock.caption_only_semantic_unit_count, 0);
  assert.equal(lock.non_verbatim_editorial_text_during_speech_count, 0);
  assert.equal(lock.japanese_debug_coverage_percent, 100);
});

test("timing authority keeps narration and captions aligned", async () => {
  const authority = await json(path.join(artifactRoot, "revised-bilingual-utterance-authority.json"));
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

test("WAV and all three MP4 outputs satisfy exact media contracts", () => {
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
    if (label === "clean") assert.deepEqual(subtitles.map((stream) => stream.tags.language), ["eng", "jpn"]);
  }
});

test("accepted 5400-frame visual treatment remains bit-identical", async () => {
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

test("standalone review is English-default and Japanese remains debug-only", async () => {
  const { chromium } = await import(pathToFileURL(path.join(nodeModules, "playwright", "index.mjs")).href);
  const authority = await json(path.join(artifactRoot, "revised-bilingual-utterance-authority.json"));
  const audienceAss = await readFile(path.join(verificationRoot, "audience.ass"), "utf8");
  const debugAss = await readFile(path.join(verificationRoot, "debug.ass"), "utf8");
  assert.doesNotMatch(audienceAss, /[\u3040-\u30ff\u3400-\u9fff]/u);
  assert.match(debugAss, /[\u3040-\u30ff\u3400-\u9fff]/u);
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
      const candidates = name === "wide" ? authority.utterances : [authority.utterances[18]];
      for (const item of candidates) {
        await page.evaluate((seconds) => window.__FFF_BILINGUAL__.seek(seconds), item.caption_start_seconds + 0.05);
        const state = await page.evaluate(() => window.__FFF_BILINGUAL__.getState());
        assert.equal(state.english, item.spoken_text_en);
        assert.equal(normalizeText(state.english_rendered), item.spoken_text_en);
        assert.equal(state.english_visible, true);
        assert.equal(state.japanese_visible, false);
        assert.equal(state.autoplay, false);
        const metrics = await page.locator("#english").evaluate((element) => ({
          renderedLines: Math.round(element.getBoundingClientRect().height / Number.parseFloat(getComputedStyle(element).lineHeight)),
          explicitLines: element.textContent.split("\n").length
        }));
        assert.ok(metrics.renderedLines <= 2 && metrics.explicitLines <= 2, `${item.utterance_id} HTML lines`);
        if (name === "wide") captionChecks.push({ utterance_id: item.utterance_id, english_exact: true, japanese_default_absent: true });
      }
      if (name === "wide") {
        await page.locator("#debugToggle").click();
        await page.evaluate((seconds) => window.__FFF_BILINGUAL__.seek(seconds), authority.utterances[7].caption_start_seconds + 0.05);
        const state = await page.evaluate(() => window.__FFF_BILINGUAL__.getState());
        assert.equal(state.english_visible, true);
        assert.equal(state.japanese_visible, true);
        assert.equal(state.debug_mark_visible, true);
      }
      await page.locator("#debugToggle").focus();
      const metrics = await page.evaluate(() => ({
        document_width: document.documentElement.scrollWidth,
        viewport_width: innerWidth,
        horizontal_overflow_px: Math.max(0, document.documentElement.scrollWidth - innerWidth),
        native_controls: document.getElementById("candidate").controls,
        autoplay: document.getElementById("candidate").autoplay,
        paused: document.getElementById("candidate").paused,
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

test("tracked successor is text-only and all external/public boundaries remain closed", async () => {
  const allowedExtensions = new Set([".json", ".md", ".csv", ".srt", ".vtt"]);
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
  assert.equal(files.length, 16);
  for (const filePath of files) assert.ok(allowedExtensions.has(path.extname(filePath)), `non-text tracked artifact ${filePath}`);
  const result = await json(path.join(artifactRoot, "case-digest-english-editorial-naturalness-result.json"));
  const schema = await json(path.join(artifactRoot, "external-run-manifest.schema.json"));
  assert.equal(schema.properties.utterance_count.const, 24);
  assert.equal(result.effects.network_request_count, 0);
  assert.equal(result.effects.credential_touch_count, 0);
  assert.equal(result.effects.package_install_count, 0);
  assert.equal(result.effects.tracked_media_count, 0);
  assert.equal(result.effects.upload_count, 0);
  assert.equal(result.effects.public_effect_count, 0);
  assert.equal(result.boundaries.rights_cleared, false);
  assert.equal(result.boundaries.production_approved, false);
  assert.equal(result.boundaries.published, false);
  assert.equal(result.boundaries.final_voice_selected, false);
  assert.equal(result.boundaries.final_canon, false);
});
