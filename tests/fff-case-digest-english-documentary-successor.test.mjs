import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");
const runRoot = process.env.FFF_DOCUMENTARY_RUN_ROOT
  || "C:\\Users\\thank\\Storage\\Media Contents Projects\\FastFictionFactory-runs\\fff-case-digest-english-documentary-successor-001-thank-r2";
const sourceRunRoot = "D:\\AI-Runs\\FastFictionFactory\\fff-case-digest-english-verbatim-bilingual-001";
const artifactRoot = path.join(repoRoot, "artifacts", "case-digest-english-documentary-successor");
const verificationRoot = path.join(runRoot, "verification");
const picturePath = path.join(runRoot, "picture", "case-digest-documentary-picture-lock.mp4");
const audiencePath = path.join(runRoot, "audience", "case-digest-documentary-english-burned.mp4");
const debugPath = path.join(runRoot, "debug", "case-digest-documentary-bilingual-debug.mp4");
const reviewPath = path.join(runRoot, "review", "case-digest-documentary-successor.html");
const sourceCleanPath = path.join(sourceRunRoot, "clean", "case-digest-english-clean.mp4");
const nodeModules = process.env.FFF_NODE_MODULES
  || path.join(process.env.USERPROFILE || "", ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules");

const json = async (filePath) => JSON.parse(await readFile(filePath, "utf8"));
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const normalizeText = (value) => value.replace(/\r\n?/gu, "\n").replace(/\s+/gu, " ").trim();
const ffprobe = (filePath) => JSON.parse(execFileSync("ffprobe", [
  "-v", "error", "-show_streams", "-show_format", "-count_frames", "-of", "json", filePath
], { encoding: "utf8", windowsHide: true }));

function parseTime(value) {
  const match = value.match(/^(\d{2}):(\d{2}):(\d{2})[,.](\d{3})$/u);
  assert.ok(match, `invalid caption time ${value}`);
  return ((Number(match[1]) * 60 + Number(match[2])) * 60 + Number(match[3])) * 1000 + Number(match[4]);
}

function parseCaptionFile(text) {
  const normalized = text.replace(/^\uFEFF/u, "").replace(/\r\n?/gu, "\n").trim();
  const isVtt = normalized.startsWith("WEBVTT");
  const body = isVtt ? normalized.slice("WEBVTT".length).trim() : normalized;
  return body.split(/\n{2,}/u).map((block) => {
    const lines = block.split("\n");
    const timingIndex = lines.findIndex((line) => line.includes("-->"));
    assert.ok(timingIndex >= 0, `missing cue timing in ${block}`);
    const [start, end] = lines[timingIndex].split("-->").map((value) => value.trim());
    return {
      id: isVtt ? lines[0] : null,
      start_milliseconds: parseTime(start),
      end_milliseconds: parseTime(end),
      text: normalizeText(lines.slice(timingIndex + 1).join(" ")),
      compactText: lines.slice(timingIndex + 1).join("").trim()
    };
  });
}

test("documentary script, format decision, comprehension coverage, and fact boundaries pass", async () => {
  const authority = await json(path.join(artifactRoot, "utterance-authority.json"));
  const facts = await json(path.join(artifactRoot, "source-fact-audit.json"));
  const format = await json(path.join(artifactRoot, "format-audit.json"));
  const comprehension = await json(path.join(artifactRoot, "audio-only-comprehension-audit.json"));

  assert.equal(authority.artifact_id, "fff-case-digest-english-documentary-successor-001");
  assert.equal(authority.source_tip, "2a2cb5ddc3ca7cdcbf9934a75023325d4bdbf155");
  assert.equal(authority.product_checkpoint, "dbd3ec00d7f31ba84bebb032f78057780215c338");
  assert.equal(authority.format, "CASE_DIGEST");
  assert.equal(authority.section_count, 5);
  assert.equal(authority.shot_count, 11);
  assert.equal(authority.duration_seconds, 180);
  assert.equal(authority.exact_frame_count, 5400);
  assert.ok(authority.utterance_count >= 20 && authority.utterance_count <= 24);
  assert.ok(authority.word_count >= 260 && authority.word_count <= 330);
  assert.equal(authority.utterances.length, authority.utterance_count);
  assert.equal(new Set(authority.utterances.map((row) => row.section_id)).size, 5);
  assert.equal(new Set(authority.utterances.map((row) => row.shot_id)).size, 11);
  assert.equal(facts.unsupported_fact_count, 0);
  assert.equal(facts.hidden_causal_bridge_count, 0);
  assert.equal(facts.unauthorized_canon_count, 0);
  assert.equal(facts.altered_evidence_boundary_count, 0);
  assert.equal(format.selected_format, "CASE_DIGEST");
  assert.deepEqual(format.rejected_formats, [
    "SHORT_DRAMA", "TRAILER_PV", "EXHAUSTIVE_LINEAR_LORE", "FORCED_CHOICE_CLOSURE"
  ]);
  assert.equal(format.materially_reduced, true);
  assert.ok(format.reduction_percent >= 30);
  assert.equal(format.forced_choice_count, 0);
  assert.equal(comprehension.coverage_percent, 100);
  assert.equal(comprehension.covered_topic_count, 7);
  assert.equal(comprehension.human_comprehension_verified, false);
  assert.ok(comprehension.topics.every((row) => row.covered && row.utterance_ids.length > 0));

  const script = authority.utterances.map((row) => row.spoken_text_en).join(" ");
  for (const expression of [
    /witnesses reported a bell/iu,
    /Clock repairer Mira Vale/iu,
    /brother is missing/iu,
    /brass moth/iu,
    /nine seventeen/iu,
    /ledger divided into two/iu,
    /city council/iu,
    /open case/iu
  ]) {
    assert.match(script, expression);
  }
  for (const row of authority.utterances) {
    assert.equal(row.tts_text_en, row.spoken_text_en);
    assert.ok(row.source_fact_ids.length > 0);
    assert.equal(row.unsupported_fact_count, 0);
    assert.ok(row.text_ja.length > 0);
    assert.ok(row.layout_en.length >= 1 && row.layout_en.length <= 2);
    assert.ok(row.layout_ja.length >= 1 && row.layout_ja.length <= 2);
  }
});

test("TTS input, SRT, VTT, burned-caption sources, HTML captions, and Japanese debug share one authority", async () => {
  const authority = await json(path.join(artifactRoot, "utterance-authority.json"));
  const lock = await json(path.join(artifactRoot, "spoken-caption-lock.json"));
  const slot = await json(path.join(artifactRoot, "voice-slot-contract.json"));
  const captionFiles = {
    enSrt: parseCaptionFile(await readFile(path.join(artifactRoot, "case-digest-documentary.en.srt"), "utf8")),
    enVtt: parseCaptionFile(await readFile(path.join(artifactRoot, "case-digest-documentary.en.vtt"), "utf8")),
    jaSrt: parseCaptionFile(await readFile(path.join(artifactRoot, "case-digest-documentary.ja.srt"), "utf8")),
    jaVtt: parseCaptionFile(await readFile(path.join(artifactRoot, "case-digest-documentary.ja.vtt"), "utf8"))
  };
  for (const cues of Object.values(captionFiles)) assert.equal(cues.length, authority.utterance_count);

  for (const [index, row] of authority.utterances.entries()) {
    const expectedStart = Math.round(row.caption_start_seconds * 1000);
    const expectedEnd = Math.round(row.caption_end_seconds * 1000);
    assert.equal(slot.slots[index].tts_text_en, row.spoken_text_en);
    assert.equal(captionFiles.enSrt[index].text, row.spoken_text_en);
    assert.equal(captionFiles.enVtt[index].text, row.spoken_text_en);
    assert.equal(captionFiles.jaSrt[index].compactText, row.text_ja);
    assert.equal(captionFiles.jaVtt[index].compactText, row.text_ja);
    assert.equal(captionFiles.enVtt[index].id, row.utterance_id);
    assert.equal(captionFiles.jaVtt[index].id, row.utterance_id);
    for (const cues of Object.values(captionFiles)) {
      assert.equal(cues[index].start_milliseconds, expectedStart);
      assert.equal(cues[index].end_milliseconds, expectedEnd);
    }
  }

  const audienceAss = await readFile(path.join(runRoot, "verification", "audience.ass"), "utf8");
  const debugAss = await readFile(path.join(runRoot, "verification", "debug.ass"), "utf8");
  assert.doesNotMatch(audienceAss, /[\u3040-\u30ff\u3400-\u9fff]/u);
  for (const row of authority.utterances) {
    assert.match(audienceAss, new RegExp(row.layout_en[0].replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"), "u"));
    assert.ok(debugAss.includes(row.layout_ja[0]));
  }
  assert.equal(lock.english_tts_input_coverage_percent, 100);
  assert.equal(lock.english_spoken_caption_coverage_percent, 100);
  assert.equal(lock.japanese_debug_coverage_percent, 100);
  assert.equal(lock.spoken_caption_text_mismatch_count, 0);
  assert.equal(lock.timing_mismatch_count, 0);
  assert.equal(lock.japanese_burned_audience_text_count, 0);
});

test("voice-pending slot is complete and the planned narration timing stays bounded", async () => {
  const authority = await json(path.join(artifactRoot, "utterance-authority.json"));
  const inventory = await json(path.join(artifactRoot, "voice-inventory.json"));
  const slot = await json(path.join(artifactRoot, "voice-slot-contract.json"));
  assert.equal(inventory.eligible_english_male_voice_count, 0);
  assert.equal(inventory.selected_voice, null);
  assert.equal(inventory.voice_slot_state, "voice_pending_natural_male");
  assert.equal(inventory.zira_status, "rejected_not_accepted_not_recommended_not_final");
  assert.equal(inventory.zira_used_for_successor, false);
  assert.ok(inventory.candidates_examined.length <= 3);
  assert.equal(slot.state, "voice_pending_natural_male");
  assert.equal(slot.replaceable, true);
  assert.deepEqual(slot.accepted_modes, ["per_utterance_pcm_wav", "full_programme_pcm_wav"]);
  assert.equal(slot.slots.length, authority.utterance_count);
  assert.ok(slot.required_provenance.includes("rights_provenance"));
  assert.equal(slot.required_audio.channels, 1);
  assert.equal(slot.required_audio.sample_rate, 48000);
  assert.equal(slot.required_audio.music_sfx_allowed, false);
  assert.ok(slot.first_slot_start_seconds <= 2);
  assert.ok(slot.maximum_internal_gap_seconds <= 4.5);
  assert.ok(slot.final_tail_seconds <= 6);
  assert.equal(slot.narration_caption_overlap_count, 0);

  for (const [index, row] of authority.utterances.entries()) {
    assert.equal(row.voice_slot_start_seconds, row.caption_start_seconds);
    assert.equal(row.voice_slot_end_seconds, row.caption_end_seconds);
    assert.ok(row.voice_slot_end_seconds > row.voice_slot_start_seconds);
    if (index > 0) {
      const previous = authority.utterances[index - 1];
      assert.ok(row.voice_slot_start_seconds >= previous.voice_slot_end_seconds);
      assert.ok(row.voice_slot_start_seconds - previous.voice_slot_end_seconds <= 4.5);
    }
  }
});

test("sidecar and output identities are exact, video-only, and source-bound", async () => {
  const result = await json(path.join(artifactRoot, "result.json"));
  const manifest = await json(path.join(runRoot, "run-manifest.json"));
  assert.deepEqual(manifest, result);
  assert.equal(result.status, "PASS_VOICE_PENDING_NATURAL_MALE");
  assert.equal(result.source.source_tip, "2a2cb5ddc3ca7cdcbf9934a75023325d4bdbf155");
  assert.equal(result.source.product_checkpoint, "dbd3ec00d7f31ba84bebb032f78057780215c338");
  assert.equal(result.source.planner007_used, false);

  for (const [key, filePath] of Object.entries({
    picture_lock: picturePath,
    audience_burned: audiencePath,
    bilingual_debug: debugPath
  })) {
    const probe = ffprobe(filePath);
    const video = probe.streams.filter((stream) => stream.codec_type === "video");
    const audio = probe.streams.filter((stream) => stream.codec_type === "audio");
    const subtitles = probe.streams.filter((stream) => stream.codec_type === "subtitle");
    assert.equal(video.length, 1, `${key} video stream`);
    assert.equal(video[0].width, 1280);
    assert.equal(video[0].height, 720);
    assert.equal(video[0].avg_frame_rate, "30/1");
    assert.equal(Number(video[0].nb_read_frames), 5400);
    assert.ok(Math.abs(Number(probe.format.duration) - 180) <= 0.001);
    assert.equal(audio.length, 0, `${key} audio stream`);
    assert.equal(subtitles.length, 0, `${key} subtitle stream`);
    const bytes = await readFile(filePath);
    assert.equal(sha256(bytes), result.outputs[key].sha256);
    assert.equal(bytes.length, result.outputs[key].bytes);
  }

  for (const [key, fileName] of Object.entries({
    english_srt: "case-digest-documentary.en.srt",
    english_vtt: "case-digest-documentary.en.vtt",
    japanese_srt: "case-digest-documentary.ja.srt",
    japanese_vtt: "case-digest-documentary.ja.vtt"
  })) {
    const bytes = await readFile(path.join(runRoot, "youtube", fileName));
    assert.equal(sha256(bytes), result.outputs[key].sha256);
  }
});

test("accepted visuals and transition lineage are decoded-frame identical in the picture lock", async () => {
  const frameMd5 = (filePath) => execFileSync("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-i", filePath,
    "-map", "0:v:0", "-an", "-f", "framemd5", "-"
  ], { encoding: "utf8", windowsHide: true, maxBuffer: 20 * 1024 * 1024 });
  const source = frameMd5(sourceCleanPath);
  const output = frameMd5(picturePath);
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
    image_generation_count: 0,
    svg_primitive_primary_count: 0
  };
  await mkdir(verificationRoot, { recursive: true });
  await writeFile(path.join(verificationRoot, "visual-preservation.json"), `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
});

test("wide and narrow review remain offline, non-autoplay, caption-exact, and overflow-free", async () => {
  const { chromium } = await import(pathToFileURL(path.join(nodeModules, "playwright", "index.mjs")).href);
  const authority = await json(path.join(artifactRoot, "utterance-authority.json"));
  const browser = await chromium.launch({ headless: true });
  const consoleErrors = [];
  const pageErrors = [];
  const externalRequests = [];
  const viewports = {};
  try {
    for (const [name, viewport] of Object.entries({
      wide: { width: 1440, height: 1000 },
      narrow: { width: 390, height: 844 }
    })) {
      const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
      page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
      page.on("pageerror", (error) => pageErrors.push(error.message));
      page.on("request", (request) => { if (/^https?:/iu.test(request.url())) externalRequests.push(request.url()); });
      await page.goto(pathToFileURL(reviewPath).href, { waitUntil: "load" });
      await page.waitForFunction(() => window.__FFF_DOCUMENTARY__?.video.readyState >= 1);
      const checks = name === "wide" ? authority.utterances : [authority.utterances[18]];
      for (const row of checks) {
        await page.evaluate((seconds) => window.__FFF_DOCUMENTARY__.seek(seconds), row.caption_start_seconds + 0.05);
        const state = await page.evaluate(() => window.__FFF_DOCUMENTARY__.getState());
        assert.equal(state.english, row.spoken_text_en);
        assert.equal(normalizeText(state.english_rendered), row.spoken_text_en);
        assert.equal(state.english_visible, true);
        assert.equal(state.japanese_visible, false);
        assert.equal(state.paused, true);
        assert.equal(state.autoplay, false);
        const lines = await page.locator("#english").evaluate((element) => ({
          rendered: Math.round(element.getBoundingClientRect().height / Number.parseFloat(getComputedStyle(element).lineHeight)),
          explicit: element.textContent.split("\n").filter(Boolean).length
        }));
        assert.ok(lines.rendered <= 2 && lines.explicit <= 2, `${row.utterance_id} line count`);
      }
      await page.locator("#debugToggle").click();
      const debugRow = authority.utterances[7];
      await page.evaluate((seconds) => window.__FFF_DOCUMENTARY__.seek(seconds), debugRow.caption_start_seconds + 0.05);
      const debugState = await page.evaluate(() => window.__FFF_DOCUMENTARY__.getState());
      assert.equal(debugState.english, debugRow.spoken_text_en);
      assert.equal(debugState.japanese, debugRow.text_ja);
      assert.equal(debugState.japanese_visible, true);
      assert.equal(debugState.debug_mark_visible, true);
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
        caption_count: window.__FFF_DOCUMENTARY__.data.utterances.length
      }));
      assert.equal(metrics.horizontal_overflow_px, 0);
      assert.equal(metrics.native_controls, true);
      assert.equal(metrics.autoplay, false);
      assert.equal(metrics.paused, true);
      assert.equal(metrics.caption_count, authority.utterance_count);
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
  const evidence = {
    passed: true,
    targeted_test_count: 7,
    default_mode: "English audience / voice pending",
    japanese_default_absent: true,
    debug_toggle_preserves_english: true,
    debug_toggle_enables_japanese: true,
    external_request_count: externalRequests.length,
    console_error_count: consoleErrors.length,
    page_error_count: pageErrors.length,
    autoplay: false,
    native_controls: true,
    viewports
  };
  await writeFile(path.join(verificationRoot, "browser-validation.json"), `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
});

test("tracked scope is text-only, uncommitted, and every external-effect attempt remains zero", async () => {
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
  assert.ok(files.length >= 14);
  for (const filePath of files) assert.ok(allowedExtensions.has(path.extname(filePath)), `non-text artifact ${filePath}`);

  const result = await json(path.join(artifactRoot, "result.json"));
  for (const [key, value] of Object.entries(result.effects)) assert.equal(value, 0, `${key} effect`);
  for (const key of [
    "committed", "pushed", "human_accepted", "rights_cleared", "production_approved",
    "published", "final_voice_selected", "final_canon"
  ]) {
    assert.equal(result.boundaries[key], false, `${key} boundary`);
  }
  assert.equal(execFileSync("git", ["rev-parse", "HEAD"], { cwd: repoRoot, encoding: "utf8" }).trim(), "2a2cb5ddc3ca7cdcbf9934a75023325d4bdbf155");
  assert.equal(execFileSync("git", ["rev-parse", "refs/remotes/origin/codex/fff-case-digest-english-verbatim-bilingual-v1"], { cwd: repoRoot, encoding: "utf8" }).trim(), "2a2cb5ddc3ca7cdcbf9934a75023325d4bdbf155");
  const changed = execFileSync("git", ["status", "--porcelain=v1"], { cwd: repoRoot, encoding: "utf8" })
    .trim().split(/\r?\n/u).filter(Boolean).map((row) => row.slice(3).replaceAll("\\", "/"));
  const allowed = [
    "artifacts/case-digest-english-documentary-successor/",
    "docs/review/case-digest-english-documentary-successor.md",
    "docs/production/ENGLISH_DOCUMENTARY_NARRATION_GUIDELINE.md",
    "tools/fff-case-digest-english-documentary-successor.ps1",
    "tests/fff-case-digest-english-documentary-successor.test.mjs"
  ];
  for (const relative of changed) {
    assert.ok(allowed.some((prefix) => relative === prefix || relative.startsWith(prefix)), `unexpected changed path ${relative}`);
  }
});
