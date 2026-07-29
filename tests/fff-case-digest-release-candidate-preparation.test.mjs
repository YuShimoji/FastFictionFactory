import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");
const runRoot = process.env.FFF_RELEASE_PREP_RUN_ROOT
  || "D:\\AI-Runs\\FastFictionFactory\\fff-case-digest-release-candidate-preparation-001";
const sourceRunRoot = "D:\\AI-Runs\\FastFictionFactory\\fff-case-digest-english-editorial-naturalness-001";
const artifactRoot = path.join(repoRoot, "artifacts", "case-digest-release-candidate-preparation");
const authorityRoot = path.join(repoRoot, "artifacts", "case-digest-english-editorial-naturalness");
const verificationRoot = path.join(runRoot, "verification");
const picturePath = path.join(runRoot, "picture", "case-digest-picture-lock.mp4");
const sourceCleanPath = path.join(sourceRunRoot, "clean", "case-digest-english-clean.mp4");
const htmlPath = path.join(runRoot, "review", "case-digest-release-candidate-preparation.html");
const scriptPath = path.join(repoRoot, "tools", "fff-case-digest-release-candidate-preparation.ps1");
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
      if (character === "\"" && text[index + 1] === "\"") { field += "\""; index += 1; }
      else if (character === "\"") quoted = false;
      else field += character;
    } else if (character === "\"") quoted = true;
    else if (character === ",") { row.push(field); field = ""; }
    else if (character === "\n") { row.push(field.replace(/\r$/u, "")); rows.push(row); row = []; field = ""; }
    else field += character;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const [headers, ...body] = rows.filter((candidate) => candidate.some((value) => value.length));
  return body.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function makeWav({ duration = 0.1, clipped = false } = {}) {
  const sampleRate = 48000;
  const sampleCount = Math.round(duration * sampleRate);
  const data = Buffer.alloc(sampleCount * 2);
  for (let index = 0; index < sampleCount; index += 1) {
    const sample = clipped && index === 0 ? 32767 : 0;
    data.writeInt16LE(sample, index * 2);
  }
  const buffer = Buffer.alloc(44 + data.length);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + data.length, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(data.length, 40);
  data.copy(buffer, 44);
  return buffer;
}

function invokeVoiceValidator(root) {
  return spawnSync("pwsh", [
    "-NoProfile", "-File", scriptPath, "-Mode", "ValidateVoiceTake", "-RunRoot", runRoot, "-VoiceTakeRoot", root
  ], { encoding: "utf8", windowsHide: true });
}

test("tracked preparation package has the exact 18-file contract", async () => {
  const expected = [
    "README_CASE_DIGEST_RELEASE_CANDIDATE_PREPARATION.md",
    "asset-use-provenance-matrix.csv",
    "audience-voice-direction-quarantine.json",
    "credits.md",
    "external-run-manifest.schema.json",
    "local-male-voice-inventory.json",
    "picture-lock-manifest.json",
    "release-candidate-preparation-result.json",
    "release-metadata.json",
    "release-qc-contract.json",
    "thumbnail-direction.json",
    "utterance-delivery-map.csv",
    "voice-intake-validation-contract.json",
    "voice-take-contract.schema.json",
    "voice-take-template.json",
    "youtube-chapters.txt",
    "youtube-description.md",
    "youtube-title.txt"
  ];
  assert.deepEqual((await readdir(artifactRoot)).sort(), expected.sort());
});

test("picture lock is video-only and decoded-frame identical for all 5400 frames", async () => {
  const probe = ffprobe(picturePath);
  const video = probe.streams.filter((stream) => stream.codec_type === "video");
  assert.equal(video.length, 1);
  assert.equal(probe.streams.filter((stream) => stream.codec_type === "audio").length, 0);
  assert.equal(probe.streams.filter((stream) => stream.codec_type === "subtitle").length, 0);
  assert.equal(video[0].width, 1280);
  assert.equal(video[0].height, 720);
  assert.equal(video[0].avg_frame_rate, "30/1");
  assert.equal(Number(video[0].nb_read_frames), 5400);
  assert.ok(Math.abs(Number(probe.format.duration) - 180) <= 0.001);
  const frameMd5 = (filePath) => execFileSync("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-i", filePath, "-map", "0:v:0", "-an", "-f", "framemd5", "-"
  ], { encoding: "utf8", windowsHide: true, maxBuffer: 16 * 1024 * 1024 });
  const source = frameMd5(sourceCleanPath);
  const output = frameMd5(picturePath);
  assert.equal(output, source);
  const evidence = {
    passed: true,
    source_frame_md5_sha256: sha256(source),
    picture_lock_frame_md5_sha256: sha256(output),
    decoded_frame_identity: true,
    frame_count: 5400,
    accepted_image_change_count: 0,
    image_generation_count: 0,
    burned_caption_count: 0
  };
  await writeFile(path.join(verificationRoot, "decoded-frame-identity.json"), `${JSON.stringify(evidence, null, 2)}\n`);
});

test("all locked bilingual captions retain source bytes and 24 cues", async () => {
  const cases = [
    ["case-digest.en.srt", "0c0be8ede8faf4b2baaedc2b852fa9b0fbea151a35bcb8bd6e1f99c5724ac2e0"],
    ["case-digest.en.vtt", "05dc4dde708b576f778a2dfa0f766edf9b45ddc8d86ee56822ab9636e86c8cbc"],
    ["case-digest.ja.srt", "01bb9501f3ddb1a54108014fcf4115413bf71aae6ea5e055f3afe320f737496d"],
    ["case-digest.ja.vtt", "e0dcdc17ad367f433d7ac620b88d391629044c87c9d2e8c1ab61697883f6ee80"]
  ];
  for (const [name, expected] of cases) {
    const bytes = await readFile(path.join(runRoot, "captions", name));
    assert.equal(sha256(bytes), expected, name);
    const text = bytes.toString("utf8").replace(/\r\n?/gu, "\n");
    assert.equal((text.match(/-->/gu) || []).length, 24, name);
  }
});

test("voice quarantine and local inventory fail closed without a male English voice", async () => {
  const quarantine = await json(path.join(artifactRoot, "audience-voice-direction-quarantine.json"));
  const inventory = await json(path.join(artifactRoot, "local-male-voice-inventory.json"));
  const result = await json(path.join(artifactRoot, "release-candidate-preparation-result.json"));
  assert.equal(quarantine.quarantine_id, "FFF-Q-MECHANICAL-ENGLISH-TTS-CASE-DIGEST-20260730");
  assert.equal(quarantine.rejected_voice.name, "Microsoft Zira Desktop");
  assert.equal(quarantine.universal_female_voice_ban, false);
  assert.equal(quarantine.standalone_voice_review_prohibited, true);
  assert.equal(inventory.eligible_english_male_voice_count, 0);
  assert.equal(inventory.voice_input_state, "natural_male_voice_input_required");
  assert.equal(inventory.zira_synthesis_performed, false);
  assert.equal(result.voice_input_state, "natural_male_voice_input_required");
  assert.equal(result.provisional_av_generated, false);
  assert.equal(result.final_voice_selected, false);
});

test("voice contract and delivery map cover both supported modes and exact 24 utterances", async () => {
  const authority = await json(path.join(authorityRoot, "revised-bilingual-utterance-authority.json"));
  const schema = await json(path.join(artifactRoot, "voice-take-contract.schema.json"));
  const template = await json(path.join(artifactRoot, "voice-take-template.json"));
  const validation = await json(path.join(artifactRoot, "voice-intake-validation-contract.json"));
  const delivery = parseCsv(await readFile(path.join(artifactRoot, "utterance-delivery-map.csv"), "utf8"));
  assert.deepEqual(schema.properties.input_mode.enum, ["per_utterance_wav_v1", "full_programme_wav_v1"]);
  assert.equal(template.entries.length, 24);
  assert.equal(delivery.length, 24);
  assert.deepEqual(delivery.map((row) => row.utterance_id), authority.utterances.map((item) => item.utterance_id));
  assert.ok(delivery.every((row) => row.transcript.length && row.delivery === "calm_documentary"));
  assert.equal(validation.fail_closed, true);
  assert.equal(validation.negative_probes.length, 8);
  assert.equal(validation.naturalness_verified_by_validator, false);
});

test("voice intake validator passes a structural fixture and rejects eight required negative probes", async () => {
  const authority = await json(path.join(authorityRoot, "revised-bilingual-utterance-authority.json"));
  const root = path.join(verificationRoot, "voice-probes");
  const baseRoot = path.join(root, "base");
  await mkdir(path.join(baseRoot, "utterances"), { recursive: true });
  const entries = authority.utterances.map((item) => ({
    utterance_id: item.utterance_id,
    file: `utterances/${item.utterance_id}.wav`,
    transcript: item.spoken_text_en
  }));
  const baseManifest = {
    schemaVersion: 1,
    input_mode: "per_utterance_wav_v1",
    speaker_identity: "technical-fixture-speaker",
    voice_name: "technical-fixture-male",
    voice_origin: "human_recording",
    voice_character: { gender_presentation: "male", delivery: "calm", register: "lower_mid" },
    clone_authorized: false,
    contains_music_or_sfx: false,
    extra_or_omitted_words_declared: false,
    rights_provenance: { status: "documented", source: "test-fixture", private_release_candidate_use_authorized: true },
    naturalness_human_judgment: "pending_whole_release_candidate",
    technical_fixture_only: true,
    entries
  };
  for (const entry of entries) await writeFile(path.join(baseRoot, ...entry.file.split("/")), makeWav());
  await writeFile(path.join(baseRoot, "voice-take.json"), `${JSON.stringify(baseManifest, null, 2)}\n`);
  const valid = invokeVoiceValidator(baseRoot);
  assert.equal(valid.status, 0, valid.stderr);
  const validResult = JSON.parse(valid.stdout);
  assert.equal(validResult.machine_valid, true);
  assert.equal(validResult.naturalness_verified, false);

  const probes = [
    ["missing_file", (manifest) => { manifest.entries[0].file = "utterances/missing.wav"; }],
    ["duplicate_utterance", (manifest) => { manifest.entries[1].utterance_id = manifest.entries[0].utterance_id; }],
    ["wrong_transcript", (manifest) => { manifest.entries[0].transcript += " Added words."; }],
    ["clipping", () => {}],
    ["music_or_sfx", (manifest) => { manifest.contains_music_or_sfx = true; }],
    ["timing_mismatch", () => {}],
    ["unknown_identity", (manifest) => { manifest.speaker_identity = "unknown"; }],
    ["absent_rights_provenance", (manifest) => { manifest.rights_provenance.status = "unknown"; }]
  ];
  const outcomes = [];
  for (const [name, mutate] of probes) {
    const probeRoot = path.join(root, name);
    await mkdir(path.join(probeRoot, "utterances"), { recursive: true });
    const manifest = structuredClone(baseManifest);
    mutate(manifest);
    for (const entry of baseManifest.entries) {
      const options = name === "clipping" && entry.utterance_id === "cd-en-001"
        ? { clipped: true }
        : name === "timing_mismatch" && entry.utterance_id === "cd-en-001"
          ? { duration: 8 }
          : {};
      await writeFile(path.join(probeRoot, ...entry.file.split("/")), makeWav(options));
    }
    await writeFile(path.join(probeRoot, "voice-take.json"), `${JSON.stringify(manifest, null, 2)}\n`);
    const result = invokeVoiceValidator(probeRoot);
    assert.notEqual(result.status, 0, `${name} unexpectedly passed`);
    outcomes.push({ probe: name, rejected: true, error: normalizeText(result.stderr) });
  }
  await writeFile(path.join(verificationRoot, "voice-negative-probes.json"), `${JSON.stringify({
    passed: true,
    baseline_machine_valid: true,
    naturalness_claimed: false,
    probes: outcomes
  }, null, 2)}\n`);
});

test("full-programme mode accepts an exact 180-second structural fixture without a naturalness claim", async () => {
  const authority = await json(path.join(authorityRoot, "revised-bilingual-utterance-authority.json"));
  const root = path.join(verificationRoot, "voice-probes", "full-programme");
  await mkdir(root, { recursive: true });
  const transcript = normalizeText(authority.utterances.map((item) => item.spoken_text_en).join(" "));
  const manifest = {
    schemaVersion: 1,
    input_mode: "full_programme_wav_v1",
    speaker_identity: "technical-fixture-speaker",
    voice_name: "technical-fixture-male",
    voice_origin: "human_recording",
    voice_character: { gender_presentation: "male", delivery: "calm", register: "lower_mid" },
    clone_authorized: false,
    contains_music_or_sfx: false,
    extra_or_omitted_words_declared: false,
    rights_provenance: { status: "documented", source: "test-fixture", private_release_candidate_use_authorized: true },
    naturalness_human_judgment: "pending_whole_release_candidate",
    technical_fixture_only: true,
    file: "programme.wav",
    transcript,
    transcript_sha256: sha256(transcript),
    alignment: authority.utterances.map((item) => ({
      utterance_id: item.utterance_id,
      transcript: item.spoken_text_en,
      start_seconds: item.audio_start_seconds,
      end_seconds: item.audio_end_seconds
    }))
  };
  await writeFile(path.join(root, "programme.wav"), makeWav({ duration: 180 }));
  await writeFile(path.join(root, "voice-take.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  const result = invokeVoiceValidator(root);
  assert.equal(result.status, 0, result.stderr);
  const validation = JSON.parse(result.stdout);
  assert.equal(validation.input_mode, "full_programme_wav_v1");
  assert.equal(validation.machine_valid, true);
  assert.equal(validation.naturalness_verified, false);
});

test("metadata, provenance, thumbnail, and release boundaries are complete", async () => {
  const metadata = await json(path.join(artifactRoot, "release-metadata.json"));
  const thumbnail = await json(path.join(artifactRoot, "thumbnail-direction.json"));
  const result = await json(path.join(artifactRoot, "release-candidate-preparation-result.json"));
  const chapters = (await readFile(path.join(artifactRoot, "youtube-chapters.txt"), "utf8")).trim().split(/\r?\n/gu);
  const description = await readFile(path.join(artifactRoot, "youtube-description.md"), "utf8");
  const provenance = parseCsv(await readFile(path.join(artifactRoot, "asset-use-provenance-matrix.csv"), "utf8"));
  assert.equal(chapters.length, 5);
  assert.ok(chapters.every((row) => /^\d{2}:\d{2} /u.test(row)));
  assert.doesNotMatch(description, /\b(?:shocking|you won't believe|solved|guilty)\b/iu);
  assert.equal(metadata.publication_approved, false);
  assert.equal(thumbnail.visual_direction_signature, "archival_case_file_thumbnail_v1");
  assert.equal(thumbnail.new_imagery_created, false);
  assert.equal(thumbnail.fake_evidence_added, false);
  const thumbProbe = ffprobe(path.join(runRoot, "thumbnail", "case-digest-thumbnail.jpg"));
  assert.equal(thumbProbe.streams[0].width, 1280);
  assert.equal(thumbProbe.streams[0].height, 720);
  for (const shotId of ["shot-b01-01","shot-b01-02","shot-b02-01","shot-b02-02","shot-b02-03","shot-b03-01","shot-b03-02","shot-b04-01","shot-b04-02","shot-b06-01","shot-b06-03"]) {
    assert.equal(provenance.filter((row) => row.asset_id === shotId).length, 1, shotId);
  }
  for (const id of ["canonical_english_script","caption_en","caption_ja","thumbnail","voice_input","font_arial_bold"]) {
    assert.equal(provenance.filter((row) => row.asset_id === id).length, 1, id);
  }
  assert.ok(provenance.every((row) => row.legal_conclusion === "none"));
  for (const gate of ["final_voice_selected","production_voice_approved","production_approved","rights_cleared","publication_approved","final_canon"]) {
    assert.equal(result[gate], false, gate);
  }
});

test("local review surface is offline, responsive, non-autoplay, and does not request voice-only review", async () => {
  const { chromium } = await import(pathToFileURL(path.join(nodeModules, "playwright", "index.mjs")).href);
  const browser = await chromium.launch({ headless: true });
  const evidence = { passed: true, external_request_count: 0, console_error_count: 0, page_error_count: 0, viewports: {} };
  try {
    for (const [name, viewport] of Object.entries({ wide: { width: 1440, height: 1000 }, narrow: { width: 390, height: 844 } })) {
      const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
      const external = [];
      const consoleErrors = [];
      const pageErrors = [];
      page.on("request", (request) => { if (/^https?:/iu.test(request.url())) external.push(request.url()); });
      page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
      page.on("pageerror", (error) => pageErrors.push(error.message));
      await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });
      await page.waitForFunction(() => Boolean(window.__FFF_RELEASE_PREP__));
      const state = await page.evaluate(() => window.__FFF_RELEASE_PREP__.getState());
      assert.equal(state.voice_input_state, "natural_male_voice_input_required");
      assert.equal(state.chapter_count, 5);
      assert.equal(state.autoplay, false);
      assert.equal(state.controls, true);
      assert.equal(state.review_scope, "whole_release_candidate_only");
      assert.equal(state.review_requested, false);
      const dimensions = await page.evaluate(() => ({
        viewport_width: window.innerWidth,
        document_width: document.documentElement.scrollWidth
      }));
      assert.ok(dimensions.document_width <= dimensions.viewport_width);
      assert.equal(external.length, 0);
      assert.equal(consoleErrors.length, 0);
      assert.equal(pageErrors.length, 0);
      const screenshot = path.join(verificationRoot, `review-${name}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      evidence.viewports[name] = { ...dimensions, screenshot: `verification/review-${name}.png`, state };
      evidence.external_request_count += external.length;
      evidence.console_error_count += consoleErrors.length;
      evidence.page_error_count += pageErrors.length;
      await page.close();
    }
  } finally {
    await browser.close();
  }
  await writeFile(path.join(verificationRoot, "browser-validation.json"), `${JSON.stringify(evidence, null, 2)}\n`);
});

test("run manifest and tracked boundary remain private preparation only", async () => {
  const manifest = await json(path.join(runRoot, "run-manifest.json"));
  assert.equal(manifest.status, "BUILDING");
  assert.equal(manifest.git.source_commit, "58b8cc437bb0f8e0f796490bdfd213e8b211834f");
  assert.equal(manifest.git.pushed, false);
  assert.equal(manifest.voice.current_zira_audience_voice_status, "rejected");
  assert.equal(manifest.voice.provisional_av_generated, false);
  assert.equal(manifest.effects.network_request_count, 0);
  assert.equal(manifest.effects.image_generation_count, 0);
  assert.equal(manifest.effects.public_effect_count, 0);
  const trackedInPackage = execFileSync("git", ["-C", repoRoot, "ls-files", "artifacts/case-digest-release-candidate-preparation"], { encoding: "utf8" })
    .trim().split(/\r?\n/gu).filter(Boolean);
  assert.ok(trackedInPackage.every((file) => !/\.(?:mp4|wav|jpg|png)$/iu.test(file)));
  const status = execFileSync("git", ["-C", repoRoot, "status", "--porcelain"], { encoding: "utf8" }).split(/\r?\n/gu).filter(Boolean);
  const allowed = [
    "artifacts/case-digest-release-candidate-preparation/",
    "artifacts/ARTIFACTS.md",
    "artifacts/artifact-manifest.json",
    "docs/",
    "mkdocs.yml",
    "tests/fff-case-digest-release-candidate-preparation.test.mjs",
    "tools/fff-case-digest-release-candidate-preparation.ps1"
  ];
  for (const row of status) {
    const relative = row.slice(3).replaceAll("\\", "/");
    assert.ok(allowed.some((prefix) => relative.startsWith(prefix)), `unexpected dirty path ${relative}`);
  }
});
