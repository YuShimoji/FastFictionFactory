import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test, { after, before } from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const toolPath = path.join(repoRoot, "tools", "fff-densou-series-episode-quickwin.mjs");
let packetRoot;

function run(args, expectedStatus = 0) {
  const result = spawnSync(process.execPath, [toolPath, ...args], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  assert.equal(result.status, expectedStatus, `command failed\nstdout=${result.stdout}\nstderr=${result.stderr}`);
  return result;
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

before(async () => {
  packetRoot = await mkdtemp(path.join(os.tmpdir(), "fff-densou-episode-quickwin-"));
  const result = run(["build", "--out", packetRoot]);
  assert.equal(JSON.parse(result.stdout).result, "PASS");
});

after(async () => {
  await rm(packetRoot, { recursive: true, force: true });
});

test("quick-win packet verifies all twenty-one invariants", () => {
  const result = JSON.parse(run(["verify", "--root", packetRoot]).stdout);
  assert.equal(result.result, "PASS");
  assert.equal(result.checks_passed, 21);
  assert.equal(result.checks_total, 21);
  assert.equal(result.state_code, "WAITING_USER_DECISION");
});

test("source-basis receipt binds exact repository bytes and preserves ambiguity", async () => {
  const receipt = JSON.parse(await readFile(path.join(packetRoot, "source-basis-receipt.json"), "utf8"));
  assert.equal(receipt.files.length, 4);
  assert.equal(receipt.files[0].path, "artifacts/sample-raw-memo.md");
  assert.equal(receipt.files[0].sha256, "256837a94afd521cadfcb676da2c3873a914ce95f11f493d5b60e15bc42f9a32");
  assert.equal(receipt.ambiguity_receipt.exact_separately_delivered_densou_original_present, false);
  assert.equal(receipt.ambiguity_receipt.primary_file_self_labels_as_sample_raw_memo, true);
  assert.equal(receipt.ambiguity_receipt.selected_as_private_development_input_under_current_user_authority, true);
  assert.equal(Object.values(receipt.boundaries).every((value) => value === false), true);
});

test("episode treatment is coherent, continuous, and claim-bound", async () => {
  const [episode, facts, treatment] = await Promise.all([
    readFile(path.join(packetRoot, "episode-001-manifest.json"), "utf8").then(JSON.parse),
    readFile(path.join(packetRoot, "source-fact-boundary.json"), "utf8").then(JSON.parse),
    readFile(path.join(packetRoot, "episode-001-review-treatment.md"), "utf8")
  ]);
  const knownClaims = new Set(facts.claims.map((claim) => claim.claim_id));
  assert.equal(episode.segments.length, 8);
  assert.equal(episode.segments[0].start_seconds, 0);
  assert.equal(episode.segments.at(-1).end_seconds, 720);
  for (let index = 0; index < episode.segments.length; index += 1) {
    const segment = episode.segments[index];
    if (index > 0) assert.equal(segment.start_seconds, episode.segments[index - 1].end_seconds);
    assert.equal(segment.claim_ids.every((id) => knownClaims.has(id)), true);
    assert.equal(treatment.includes(segment.treatment_ja), true);
  }
  assert.equal(episode.unsupported_fact_count, 0);
  assert.equal(episode.hidden_causal_bridge_count, 0);
});

test("season map writes only episode one and keeps five future slots question-bound", async () => {
  const season = JSON.parse(await readFile(path.join(packetRoot, "season-01-manifest.json"), "utf8"));
  assert.equal(season.episodes.length, 6);
  assert.equal(season.episodes[0].state, "complete_development_packet_ready_for_local_review");
  assert.equal(season.episodes.slice(1).every((episode) => episode.state === "source_backed_investigation_slot_not_written"), true);
  assert.match(season.slot_rule, /no event, answer, mechanism, motive, or ending is authored/);
});

test("local review has no network, form, persistence, autoplay, or media surface", async () => {
  const html = await readFile(path.join(packetRoot, "densou-episode-001-review.html"), "utf8");
  assert.doesNotMatch(html, /https?:\/\//i);
  assert.doesNotMatch(html, /<(?:script|form|input|textarea|button|audio|video)\b/i);
  assert.doesNotMatch(html, /autoplay|localStorage|fetch\s*\(/i);
  assert.match(html, /別送されたデンソウ原典全文ではありません/);
  assert.match(html, /fff-densou-series-episode-quickwin-001/);
});

test("evidence manifest binds all eleven payload identities including developed-state schemas", async () => {
  const manifest = JSON.parse(await readFile(path.join(packetRoot, "evidence-manifest.json"), "utf8"));
  assert.equal(manifest.files.length, 11);
  for (const entry of manifest.files) {
    const bytes = await readFile(path.join(packetRoot, entry.path));
    assert.equal(bytes.length, entry.byte_size);
    assert.equal(sha256(bytes), entry.sha256);
  }
});

test("developed manifests extend the intake contract through exact v1.1 schemas", async () => {
  const pairs = [
    ["series-manifest.json", "series-manifest.schema.json", "fff.densou.seriesManifest.v1"],
    ["season-01-manifest.json", "season-manifest.schema.json", "fff.densou.seasonManifest.v1"],
    ["episode-001-manifest.json", "episode-manifest.schema.json", "fff.densou.episodeManifest.v1"]
  ];
  for (const [manifestName, schemaName, lineage] of pairs) {
    const manifest = JSON.parse(await readFile(path.join(packetRoot, manifestName), "utf8"));
    const schema = JSON.parse(await readFile(path.join(packetRoot, schemaName), "utf8"));
    assert.equal(schema.$id, manifest.schema_version);
    assert.equal(manifest.schema_lineage, lineage);
    assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  }
});

test("tracked result binds exact review, episode, season, and evidence identities", async () => {
  const result = JSON.parse(await readFile(path.join(repoRoot, "artifacts", "densou-series-episode-quickwin-001-result.json"), "utf8"));
  const checks = [
    ["review_sha256", "densou-episode-001-review.html"],
    ["episode_manifest_sha256", "episode-001-manifest.json"],
    ["season_manifest_sha256", "season-01-manifest.json"],
    ["evidence_manifest_sha256", "evidence-manifest.json"]
  ];
  const trackedRoot = path.join(repoRoot, "artifacts", "densou-series-episode-quickwin-001");
  for (const [identityKey, fileName] of checks) {
    assert.equal(result.identities[identityKey], sha256(await readFile(path.join(trackedRoot, fileName))));
  }
  assert.equal(result.state_code, "WAITING_USER_DECISION");
  assert.equal(Object.values(result.boundaries).every((value) => value === false), true);
});

test("verification rejects treatment tampering", async () => {
  const tamperedRoot = await mkdtemp(path.join(os.tmpdir(), "fff-densou-episode-tamper-"));
  try {
    run(["build", "--out", tamperedRoot]);
    const filePath = path.join(tamperedRoot, "episode-001-review-treatment.md");
    await writeFile(filePath, `${await readFile(filePath, "utf8")}\nunsupported answer\n`, "utf8");
    const result = run(["verify", "--root", tamperedRoot], 2);
    assert.match(result.stderr, /evidence identity mismatch/);
  } finally {
    await rm(tamperedRoot, { recursive: true, force: true });
  }
});

test("tracked packet is reproducibly verifiable", () => {
  const trackedRoot = path.join(repoRoot, "artifacts", "densou-series-episode-quickwin-001");
  const result = JSON.parse(run(["verify", "--root", trackedRoot]).stdout);
  assert.equal(result.artifact_id, "fff-densou-series-episode-quickwin-001");
  assert.equal(result.episode_id, "densou-s01e01-bellless-tower");
});
