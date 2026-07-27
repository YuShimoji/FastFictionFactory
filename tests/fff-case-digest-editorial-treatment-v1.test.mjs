import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");
const runRoot = process.env.FFF_EDITORIAL_RUN_ROOT || "D:\\AI-Runs\\FastFictionFactory\\fff-case-digest-editorial-treatment-001";
const artifactRoot = path.join(repoRoot, "artifacts", "case-digest-editorial-treatment-v1");
const verificationRoot = path.join(runRoot, "verification");
const htmlPath = path.join(runRoot, "review", "case-digest-editorial-treatment.html");
const cleanPath = path.join(runRoot, "clean", "case-digest-editorial-treatment-clean.mp4");
const burnedPath = path.join(runRoot, "review", "case-digest-editorial-treatment-review-burned.mp4");

const nodeModules = process.env.FFF_NODE_MODULES
  || path.join(process.env.USERPROFILE || "", ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules");

const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const json = async (filePath) => JSON.parse(await readFile(filePath, "utf8"));
const ffprobe = (filePath) => JSON.parse(execFileSync("ffprobe", [
  "-v", "error", "-show_streams", "-show_format", "-count_frames", "-of", "json", filePath
], { encoding: "utf8", windowsHide: true }));

function parseTime(value) {
  const match = value.match(/^(\d{2}):(\d{2}):(\d{2})[,.](\d{3})$/);
  assert.ok(match, `invalid caption time ${value}`);
  return ((Number(match[1]) * 60 + Number(match[2])) * 60 + Number(match[3])) * 1000 + Number(match[4]);
}

function parseCaptionFile(text) {
  const normalized = text.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim();
  const body = normalized.startsWith("WEBVTT") ? normalized.slice("WEBVTT".length).trim() : normalized;
  return body.split(/\n{2,}/).map((block) => {
    const lines = block.split("\n");
    const timingIndex = lines.findIndex((line) => line.includes("-->"));
    assert.ok(timingIndex >= 0, `missing cue timing in ${block}`);
    const [start, end] = lines[timingIndex].split("-->").map((value) => value.trim());
    return {
      start_milliseconds: parseTime(start),
      end_milliseconds: parseTime(end),
      text_ja: lines.slice(timingIndex + 1).join("")
    };
  });
}

test("canonical captions drive matching SRT and VTT identities", async () => {
  const authority = await json(path.join(artifactRoot, "caption-authority.json"));
  const srtText = await readFile(path.join(artifactRoot, "case-digest-ja.srt"), "utf8");
  const srt = parseCaptionFile(srtText);
  const vtt = parseCaptionFile(await readFile(path.join(artifactRoot, "case-digest-ja.vtt"), "utf8"));
  assert.equal(authority.cue_count, 11);
  assert.equal(authority.authored_forced_line_break_count, 0);
  assert.equal(srt.length, 11);
  assert.deepEqual(srt, vtt);
  assert.deepEqual(srt, authority.cues.map(({ start_milliseconds, end_milliseconds, text_ja }) => ({
    start_milliseconds, end_milliseconds, text_ja
  })));
  const identity = sha256(JSON.stringify(authority.cues));
  assert.equal(identity, authority.timing_text_identity_sha256);
  const forbiddenLineStart = /^[、。，．？！）」』】〕〉》]/u;
  const forbiddenLineEnd = /[（「『【〔〈《]$/u;
  for (const block of srtText.replace(/\r\n?/g, "\n").trim().split(/\n{2,}/)) {
    const lines = block.split("\n");
    const timingIndex = lines.findIndex((line) => line.includes("-->"));
    const renderedLines = lines.slice(timingIndex + 1);
    assert.ok(renderedLines.length >= 1 && renderedLines.length <= 2, "SRT render must use one or two lines");
    for (const line of renderedLines) {
      assert.doesNotMatch(line, forbiddenLineStart, `kinsoku line start: ${line}`);
      assert.doesNotMatch(line, forbiddenLineEnd, `kinsoku line end: ${line}`);
    }
  }
});

test("clean and burned outputs satisfy exact media contracts", () => {
  for (const [label, filePath] of [["clean", cleanPath], ["burned", burnedPath]]) {
    const probe = ffprobe(filePath);
    const videos = probe.streams.filter((stream) => stream.codec_type === "video");
    const audios = probe.streams.filter((stream) => stream.codec_type === "audio");
    const subtitles = probe.streams.filter((stream) => stream.codec_type === "subtitle");
    assert.equal(videos.length, 1, `${label} video streams`);
    assert.equal(videos[0].width, 1280);
    assert.equal(videos[0].height, 720);
    assert.equal(videos[0].avg_frame_rate, "30/1");
    assert.equal(Number(videos[0].nb_read_frames), 5400);
    assert.ok(Math.abs(Number(probe.format.duration) - 180) <= 0.001);
    assert.equal(audios.length, 1, `${label} narration streams`);
    assert.equal(subtitles.length, 0, `${label} subtitle streams`);
  }
});

test("tracked scope is text-only and declares all section and shot treatments", async () => {
  const contract = await json(path.join(artifactRoot, "visual-treatment-contract.json"));
  const sectionMap = await readFile(path.join(artifactRoot, "section-treatment-map.csv"), "utf8");
  const shotMap = await readFile(path.join(artifactRoot, "shot-effect-map.csv"), "utf8");
  assert.equal(contract.visual_direction_signature, "archival_case_digest_editorial_treatment_v1");
  assert.equal((sectionMap.match(/case-digest-section-/g) || []).length, 5);
  assert.equal((shotMap.match(/shot-b/g) || []).length, 11);
  assert.equal(contract.quarantines.svg_vector_geometric_primary_imagery, "active");
  assert.equal(contract.quarantines.three_minute_linear_lore_narrative, "active");
  assert.equal(contract.font.copied_or_committed, false);
});

test("actual final frames show no transition reset or single-frame luminance flash", async () => {
  const sharpImport = await import(pathToFileURL(path.join(nodeModules, "sharp", "lib", "index.js")).href);
  const sharp = sharpImport.default || sharpImport;
  const boundaries = [
    { seconds: 12, type: "short_dissolve" },
    { seconds: 24, type: "hard_cut" },
    { seconds: 38, type: "match_cut" },
    { seconds: 52, type: "graphic_match" },
    { seconds: 65, type: "hard_cut" },
    { seconds: 81, type: "graphic_match" },
    { seconds: 97, type: "hard_cut" },
    { seconds: 116, type: "graphic_match" },
    { seconds: 136, type: "hard_cut" },
    { seconds: 158, type: "held_fade" }
  ];
  const pixelDifference = async (leftPath, rightPath) => {
    const left = await sharp(leftPath).removeAlpha().raw().toBuffer();
    const right = await sharp(rightPath).removeAlpha().raw().toBuffer();
    assert.equal(left.length, right.length);
    let total = 0;
    for (let index = 0; index < left.length; index += 1) total += Math.abs(left[index] - right[index]);
    return total / left.length / 255;
  };
  const meanLuma = async (filePath) => {
    const stats = await sharp(filePath).greyscale().stats();
    return stats.channels[0].mean;
  };
  const audit = [];
  for (let index = 0; index < boundaries.length; index += 1) {
    const boundary = boundaries[index];
    const paths = {};
    for (const [label, offset] of [["before", -1 / 30], ["at", 0], ["after", 1 / 30]]) {
      const filePath = path.join(verificationRoot, `transition-${String(index + 1).padStart(2, "0")}-${label}.png`);
      execFileSync("ffmpeg", [
        "-hide_banner", "-loglevel", "error", "-y",
        "-ss", (boundary.seconds + offset).toFixed(6), "-i", cleanPath,
        "-frames:v", "1", "-vf", "scale=320:180:flags=lanczos", filePath
      ], { windowsHide: true });
      paths[label] = filePath;
    }
    const beforeAtDifference = await pixelDifference(paths.before, paths.at);
    const atAfterDifference = await pixelDifference(paths.at, paths.after);
    const luma = {
      before: await meanLuma(paths.before),
      at: await meanLuma(paths.at),
      after: await meanLuma(paths.after)
    };
    assert.ok(atAfterDifference < 0.08, `single-frame discontinuity at ${boundary.seconds}s`);
    if (boundary.type !== "hard_cut") {
      assert.ok(beforeAtDifference < 0.08, `transition-position reset at ${boundary.seconds}s`);
    }
    assert.ok(luma.at <= Math.max(luma.before, luma.after) + 18, `positive luminance flash at ${boundary.seconds}s`);
    assert.ok(luma.at >= Math.min(luma.before, luma.after) - 18, `negative luminance flash at ${boundary.seconds}s`);
    audit.push({
      ...boundary,
      before_at_normalized_pixel_difference: Number(beforeAtDifference.toFixed(6)),
      at_after_normalized_pixel_difference: Number(atAfterDifference.toFixed(6)),
      luma,
      position_reset_detected: false,
      raw_source_flash_detected: false
    });
  }
  await writeFile(path.join(verificationRoot, "transition-frame-audit.json"), `${JSON.stringify({
    passed: true,
    boundary_count: audit.length,
    position_reset_count: 0,
    raw_source_flash_count: 0,
    boundaries: audit
  }, null, 2)}\n`, "utf8");
});

test("standalone review renders default-on DOM captions and remains offline at both viewports", async () => {
  const { chromium } = await import(pathToFileURL(path.join(nodeModules, "playwright", "index.mjs")).href);
  const authority = await json(path.join(artifactRoot, "caption-authority.json"));
  const browser = await chromium.launch({ headless: true });
  const consoleErrors = [];
  const pageErrors = [];
  const externalRequests = [];
  const viewportEvidence = {};
  const captionStarts = [];
  try {
    for (const [name, viewport] of Object.entries({
      desktop: { width: 1440, height: 1000 },
      narrow: { width: 390, height: 844 }
    })) {
      const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
      page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
      page.on("pageerror", (error) => pageErrors.push(error.message));
      page.on("request", (request) => { if (/^https?:/i.test(request.url())) externalRequests.push(request.url()); });
      await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });
      await page.waitForFunction(() => window.__FFF_EDITORIAL__ && window.__FFF_EDITORIAL__.video.readyState >= 1);
      await page.evaluate(() => { window.__FFF_EDITORIAL__.video.muted = true; });
      if (name === "desktop") {
        for (const cue of authority.cues) {
          await page.evaluate((seconds) => window.__FFF_EDITORIAL__.seek(seconds), cue.start_milliseconds / 1000);
          await page.waitForTimeout(100);
          const state = await page.evaluate(() => window.__FFF_EDITORIAL__.getState());
          assert.equal(state.caption, cue.text_ja, cue.cue_id);
          assert.equal(state.caption_visible, true, cue.cue_id);
          assert.equal(state.paused, true, "inspection must not start playback");
          assert.equal(state.muted, true, "inspection must remain muted");
          captionStarts.push({ cue_id: cue.cue_id, visible: true, text_ja: state.caption });
        }
        await page.locator("#captionToggle").click();
        assert.equal((await page.evaluate(() => window.__FFF_EDITORIAL__.getState())).caption_visible, false);
        await page.locator("#captionToggle").click();
      }
      await page.locator("#captionToggle").focus();
      const metrics = await page.evaluate(() => ({
        document_width: document.documentElement.scrollWidth,
        viewport_width: innerWidth,
        horizontal_overflow_px: Math.max(0, document.documentElement.scrollWidth - innerWidth),
        nested_vertical_scroll_count: [...document.querySelectorAll("main *")].filter((element) =>
          element.scrollHeight > element.clientHeight + 2 && getComputedStyle(element).overflowY !== "visible"
        ).length,
        focus_outline_style: getComputedStyle(document.activeElement).outlineStyle,
        focus_outline_width: getComputedStyle(document.activeElement).outlineWidth,
        native_controls: document.getElementById("candidate").controls,
        autoplay: document.getElementById("candidate").autoplay,
        caption_toggle_count: document.querySelectorAll("#captionToggle").length,
        track_count: document.querySelectorAll("video track[kind='subtitles']").length,
        runtime_caption_count: window.__FFF_EDITORIAL__.data.captions.length,
        paused: document.getElementById("candidate").paused,
        muted: document.getElementById("candidate").muted
      }));
      await page.waitForTimeout(250);
      const screenshotPath = path.join(verificationRoot, `review-${name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false, animations: "disabled" });
      viewportEvidence[name] = { ...metrics, screenshot_path: screenshotPath };
      await page.close();
    }
  } finally {
    await browser.close();
  }
  const passed = consoleErrors.length === 0
    && pageErrors.length === 0
    && externalRequests.length === 0
    && viewportEvidence.desktop.horizontal_overflow_px === 0
    && viewportEvidence.narrow.horizontal_overflow_px === 0
    && viewportEvidence.desktop.nested_vertical_scroll_count === 0
    && viewportEvidence.narrow.nested_vertical_scroll_count === 0
    && viewportEvidence.desktop.native_controls
    && viewportEvidence.narrow.native_controls
    && !viewportEvidence.desktop.autoplay
    && !viewportEvidence.narrow.autoplay
    && viewportEvidence.desktop.paused
    && viewportEvidence.narrow.paused
    && viewportEvidence.desktop.muted
    && viewportEvidence.narrow.muted
    && viewportEvidence.desktop.focus_outline_style !== "none"
    && viewportEvidence.narrow.focus_outline_style !== "none"
    && captionStarts.length === 11;
  const evidence = {
    passed,
    engine: "playwright chromium",
    headless: true,
    muted_inspection: true,
    playback_started: false,
    system_volume_changed: false,
    console_errors: consoleErrors,
    page_errors: pageErrors,
    external_requests: [...new Set(externalRequests)],
    caption_start_checks: captionStarts,
    viewports: viewportEvidence
  };
  await mkdir(verificationRoot, { recursive: true });
  await writeFile(path.join(verificationRoot, "browser-validation.json"), `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
  assert.equal(passed, true);
});
