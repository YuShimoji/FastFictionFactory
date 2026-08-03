import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { TextDecoder } from "node:util";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const artifactRoot = path.join(repoRoot, "artifacts", "densou-series-intake");
const defaultAuthorityPath = path.join(artifactRoot, "densou-authority-input.json");
const defaultResultPath = path.join(repoRoot, "artifacts", "densou-series-intake-result.json");
const requiredClosedEffects = [
  "source invention or completion",
  "silent source revision selection",
  "external provider activation",
  "credentials use",
  "publication",
  "release",
  "production approval",
  "rights clearance for third-party elements",
  "human acceptance",
  "final canon"
];

class IntakeError extends Error {
  constructor(stateCode, message, exitCode = 1) {
    super(message);
    this.stateCode = stateCode;
    this.exitCode = exitCode;
  }
}

function requireCondition(condition, stateCode, message, exitCode = 1) {
  if (!condition) throw new IntakeError(stateCode, message, exitCode);
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

async function readJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    throw new IntakeError("SOURCE_INVALID", `cannot read JSON ${filePath}: ${error.message}`, 2);
  }
}

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function parseArgs(argv) {
  const [command = "help", ...rest] = argv;
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    requireCondition(token.startsWith("--"), "SOURCE_INVALID", `unexpected argument: ${token}`, 2);
    const key = token.slice(2);
    const value = rest[index + 1];
    requireCondition(value && !value.startsWith("--"), "SOURCE_INVALID", `missing value for --${key}`, 2);
    options[key] = value;
    index += 1;
  }
  return { command, options };
}

function validateAuthority(authority, { requireUnbound = true } = {}) {
  const expectedSchema = requireUnbound ? "fff.densou.authorityInput.v1" : "fff.densou.boundAuthorityReceipt.v1";
  requireCondition(authority?.schema_version === expectedSchema, "AUTHORITY_REQUIRED", "unsupported authority schema");
  requireCondition(authority.material_label === "デンソウ", "AUTHORITY_REQUIRED", "authority material label mismatch");
  requireCondition(authority.claimant === "user", "AUTHORITY_REQUIRED", "authority claimant must be user");
  requireCondition(Array.isArray(authority.claimant_roles) && authority.claimant_roles.includes("author") && authority.claimant_roles.includes("rights_holder"), "AUTHORITY_REQUIRED", "author and rights-holder claims are required");
  requireCondition(authority.allowed_scope?.fastfictionfactory_internal_private_development === true, "AUTHORITY_REQUIRED", "internal private development permission missing");
  requireCondition(authority.allowed_scope?.full_adaptation_and_modification === true, "AUTHORITY_REQUIRED", "full adaptation permission missing");
  requireCondition(authority.allowed_scope?.series_and_episode_development === true, "AUTHORITY_REQUIRED", "series development permission missing");
  requireCondition(authority.ai_third_party_mixture === "unknown", "AUTHORITY_REQUIRED", "AI or third-party mixture must remain unknown");
  for (const effect of requiredClosedEffects) {
    requireCondition(authority.does_not_authorize?.includes(effect), "AUTHORITY_REQUIRED", `closed authority effect missing: ${effect}`);
  }
  if (requireUnbound) {
    requireCondition(authority.source_binding?.status === "unbound", "AUTHORITY_REQUIRED", "tracked authority template must remain unbound");
    requireCondition(authority.source_binding.locator === null && authority.source_binding.sha256 === null && authority.source_binding.revision_id === null, "AUTHORITY_REQUIRED", "unbound authority must not guess source identity");
  }
  return true;
}

async function inspectSource(sourcePath) {
  const resolved = path.resolve(sourcePath);
  let sourceStat;
  try {
    sourceStat = await stat(resolved);
  } catch {
    throw new IntakeError("DEPENDENCY_MISSING", `source file does not exist: ${resolved}`, 3);
  }
  requireCondition(sourceStat.isFile(), "SOURCE_INVALID", "source locator must identify one file", 2);
  const extension = path.extname(resolved).toLowerCase();
  requireCondition([".txt", ".md", ".markdown"].includes(extension), "SOURCE_INVALID", "source must be a UTF-8 .txt, .md, or .markdown file", 2);
  const bytes = await readFile(resolved);
  requireCondition(bytes.length > 0, "SOURCE_INVALID", "source file is empty", 2);
  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new IntakeError("SOURCE_INVALID", "source is not valid UTF-8", 2);
  }
  requireCondition(text.trim().length > 0, "SOURCE_INVALID", "source contains no readable text", 2);
  requireCondition(!text.includes("\u0000"), "SOURCE_INVALID", "source contains NUL bytes", 2);
  return {
    resolved,
    sourceStat,
    bytes,
    text,
    extension: extension === ".markdown" ? ".md" : extension,
    mediaType: extension === ".txt" ? "text/plain" : "text/markdown",
    sourceSha256: sha256(bytes)
  };
}

function dependencyStatus(authorityPath, sourcePath = null) {
  return {
    state_code: "DEPENDENCY_MISSING",
    material_label: "デンソウ",
    authority_path: path.resolve(authorityPath),
    source_locator: sourcePath ? path.resolve(sourcePath) : null,
    required_input: {
      count: 1,
      description: "今回の正本となる一つのUTF-8 .txt/.md原文または断片ファイル",
      multiple_revision_rule: "複数版がある場合は今回使用する一版を明示する"
    },
    prohibited_substitutions: [
      "原文の創作または補完",
      "類似素材の選択",
      "複数revisionの無断結合"
    ]
  };
}

async function commandStatus(options) {
  const authorityPath = path.resolve(options.authority ?? defaultAuthorityPath);
  const authority = await readJson(authorityPath);
  validateAuthority(authority);
  if (!options.source) {
    console.log(JSON.stringify(dependencyStatus(authorityPath), null, 2));
    process.exitCode = 3;
    return;
  }
  const source = await inspectSource(options.source);
  console.log(JSON.stringify({
    state_code: "CONTINUE",
    material_label: "デンソウ",
    exact_source_locator: source.resolved,
    source_sha256: source.sourceSha256,
    byte_size: source.bytes.length,
    revision_id: `densou-${source.sourceSha256.slice(0, 16)}`,
    next_command: "init"
  }, null, 2));
}

async function ensureEmptyOutput(outputPath) {
  const resolved = path.resolve(outputPath);
  try {
    const existing = await stat(resolved);
    requireCondition(existing.isDirectory(), "SOURCE_INVALID", "output path exists and is not a directory", 2);
    const entries = await readdir(resolved);
    requireCondition(entries.length === 0, "SOURCE_INVALID", "output directory must be new or empty", 2);
  } catch (error) {
    if (error instanceof IntakeError) throw error;
    await mkdir(resolved, { recursive: true });
  }
  return resolved;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderPacketReview({ packet, receipt, series, season, episode }) {
  return `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>デンソウ Source Packet Readback</title>
<style>:root{color-scheme:light dark;font-family:system-ui,sans-serif}body{max-width:64rem;margin:0 auto;padding:2rem 1rem 4rem;line-height:1.65}code{overflow-wrap:anywhere}table{width:100%;border-collapse:collapse}th,td{text-align:left;vertical-align:top;padding:.5rem;border-bottom:1px solid #8886}.ok{border-left:.4rem solid #27803c;padding:.8rem 1rem;background:color-mix(in srgb,#27803c 12%,transparent)}</style>
</head><body><main>
<h1>デンソウ Source Packet Readback</h1>
<p class="ok"><strong>CONTINUE</strong><br>原文bytesはhash-boundです。物語adaptationとepisode mediaはまだ生成されていません。</p>
<table><tbody>
<tr><th>Source packet</th><td><code>${escapeHtml(packet.source_packet_id)}</code></td></tr>
<tr><th>Revision</th><td><code>${escapeHtml(packet.revision_id)}</code></td></tr>
<tr><th>SHA-256</th><td><code>${escapeHtml(packet.source_sha256)}</code></td></tr>
<tr><th>Original locator receipt</th><td><code>${escapeHtml(receipt.exact_source_locator)}</code></td></tr>
<tr><th>Series</th><td>${escapeHtml(series.series_id)} / ${escapeHtml(series.state)}</td></tr>
<tr><th>Season</th><td>${escapeHtml(season.season_id)} / ${escapeHtml(season.state)}</td></tr>
<tr><th>Episode</th><td>${escapeHtml(episode.episode_id)} / ${escapeHtml(episode.state)}</td></tr>
</tbody></table>
<h2>Boundary</h2><p>原文内容はこのreadbackへ転載していません。source span選択、脚色、長尺構成、映像生成、外部provider、credentials、公開、release、production approval、final canonは別sliceです。</p>
</main></body></html>\n`;
}

function safeRelative(root, filePath) {
  const relative = path.relative(root, filePath).replaceAll("\\", "/");
  requireCondition(relative && !relative.startsWith("../") && !path.isAbsolute(relative), "SOURCE_INVALID", `unsafe packet path: ${filePath}`, 2);
  return relative;
}

async function inventoryFile(root, filePath) {
  const bytes = await readFile(filePath);
  return { path: safeRelative(root, filePath), byte_size: bytes.length, sha256: sha256(bytes) };
}

async function commandInit(options) {
  requireCondition(options.source, "DEPENDENCY_MISSING", "--source is required", 3);
  requireCondition(options.out, "SOURCE_INVALID", "--out is required", 2);
  const authorityPath = path.resolve(options.authority ?? defaultAuthorityPath);
  const authority = await readJson(authorityPath);
  validateAuthority(authority);
  const source = await inspectSource(options.source);
  const outputRoot = await ensureEmptyOutput(options.out);
  const sourceDir = path.join(outputRoot, "source");
  await mkdir(sourceDir, { recursive: true });
  const snapshotPath = path.join(sourceDir, `densou-source-original${source.extension}`);
  await copyFile(source.resolved, snapshotPath);
  const snapshotBytes = await readFile(snapshotPath);
  requireCondition(sha256(snapshotBytes) === source.sourceSha256, "SOURCE_INVALID", "source snapshot copy mismatch", 2);

  const revisionId = `densou-${source.sourceSha256.slice(0, 16)}`;
  const sourcePacketId = `fff-densou-series-source-${source.sourceSha256.slice(0, 16)}`;
  const createdAt = new Date().toISOString();
  const lineCount = source.text.split(/\r\n|\r|\n/).length;
  const snapshotRelative = safeRelative(outputRoot, snapshotPath);

  const authorityReceipt = {
    ...authority,
    schema_version: "fff.densou.boundAuthorityReceipt.v1",
    source_binding: {
      status: "bound",
      locator: source.resolved,
      sha256: source.sourceSha256,
      revision_id: revisionId
    },
    bound_at: createdAt
  };
  const sourceReceipt = {
    schema_version: "fff.densou.sourceReceipt.v1",
    material_label: "デンソウ",
    exact_source_locator: source.resolved,
    observed_byte_size: source.bytes.length,
    observed_last_write_utc: source.sourceStat.mtime.toISOString(),
    source_sha256: source.sourceSha256,
    revision_id: revisionId,
    source_snapshot_path: snapshotRelative,
    source_snapshot_sha256: source.sourceSha256,
    receipt_created_at: createdAt
  };
  const packet = {
    schema_version: "fff.densou.seriesSourcePacket.v1",
    source_packet_id: sourcePacketId,
    material_label: "デンソウ",
    revision_id: revisionId,
    source_sha256: source.sourceSha256,
    source_receipt_path: "source-receipt.json",
    authority_receipt_path: "authority-receipt.json",
    source_snapshot: {
      path: snapshotRelative,
      byte_size: source.bytes.length,
      sha256: source.sourceSha256,
      media_type: source.mediaType,
      encoding: "utf-8"
    },
    source_spans: [{
      span_id: "source-whole",
      byte_start: 0,
      byte_end: source.bytes.length,
      line_start: 1,
      line_end: lineCount,
      status: "raw_source_uninterpreted"
    }],
    canon_intake_state: "hash_bound_not_adapted"
  };
  const series = {
    schema_version: "fff.densou.seriesManifest.v1",
    series_id: "densou-series",
    material_label: "デンソウ",
    source_packet_id: sourcePacketId,
    source_revision_id: revisionId,
    state: "source_bound_not_adapted",
    seasons: [{ season_id: "season-001", manifest_path: "season-001.json", state: "source_bound_planning_pending" }],
    boundaries: { publication: false, external_provider: false, credentials: false, release: false, final_canon: false }
  };
  const season = {
    schema_version: "fff.densou.seasonManifest.v1",
    series_id: "densou-series",
    season_id: "season-001",
    source_packet_id: sourcePacketId,
    source_revision_id: revisionId,
    state: "source_bound_planning_pending",
    episodes: [{ episode_id: "episode-001", manifest_path: "episode-001.json", state: "source_bound_adaptation_pending" }]
  };
  const episode = {
    schema_version: "fff.densou.episodeManifest.v1",
    series_id: "densou-series",
    season_id: "season-001",
    episode_id: "episode-001",
    working_title: null,
    source_packet_id: sourcePacketId,
    source_revision_id: revisionId,
    source_spans: [],
    target_form: { format: "long_form_episode", target_duration_minutes: null },
    state: "source_bound_adaptation_pending",
    adaptation: null,
    viewer_artifact: null
  };

  const paths = {
    authority: path.join(outputRoot, "authority-receipt.json"),
    receipt: path.join(outputRoot, "source-receipt.json"),
    packet: path.join(outputRoot, "densou-source-packet.json"),
    series: path.join(outputRoot, "series-manifest.json"),
    season: path.join(outputRoot, "season-001.json"),
    episode: path.join(outputRoot, "episode-001.json"),
    review: path.join(outputRoot, "densou-source-readback.html")
  };
  await Promise.all([
    writeJson(paths.authority, authorityReceipt),
    writeJson(paths.receipt, sourceReceipt),
    writeJson(paths.packet, packet),
    writeJson(paths.series, series),
    writeJson(paths.season, season),
    writeJson(paths.episode, episode),
    writeFile(paths.review, renderPacketReview({ packet, receipt: sourceReceipt, series, season, episode }), "utf8")
  ]);

  const manifestFiles = await Promise.all([
    snapshotPath,
    paths.authority,
    paths.receipt,
    paths.packet,
    paths.series,
    paths.season,
    paths.episode,
    paths.review
  ].map((filePath) => inventoryFile(outputRoot, filePath)));
  manifestFiles.sort((left, right) => left.path.localeCompare(right.path));
  const evidenceManifest = {
    schema_version: "fff.densou.packetEvidenceManifest.v1",
    source_packet_id: sourcePacketId,
    source_revision_id: revisionId,
    source_sha256: source.sourceSha256,
    state_code: "CONTINUE",
    generated_at: createdAt,
    files: manifestFiles
  };
  const evidenceManifestPath = path.join(outputRoot, "evidence-manifest.json");
  await writeJson(evidenceManifestPath, evidenceManifest);
  const manifestHash = sha256(await readFile(evidenceManifestPath));
  await writeFile(path.join(outputRoot, "evidence-manifest.sha256"), `${manifestHash}  evidence-manifest.json\n`, "utf8");

  const verification = await verifyPacket(outputRoot);
  console.log(JSON.stringify({
    state_code: "CONTINUE",
    output_root: outputRoot,
    source_packet_id: sourcePacketId,
    revision_id: revisionId,
    source_sha256: source.sourceSha256,
    evidence_manifest_sha256: manifestHash,
    verification
  }, null, 2));
}

function assertLocalReview(html) {
  requireCondition(!/https?:\/\//i.test(html), "SOURCE_INVALID", "review readback contains an external URL", 2);
  requireCondition(!/<(?:script|form|input|textarea|button)\b/i.test(html), "SOURCE_INVALID", "review readback contains an active input or script surface", 2);
  requireCondition(!/autoplay/i.test(html), "SOURCE_INVALID", "review readback contains autoplay", 2);
}

async function verifyPacket(packetRoot) {
  const root = path.resolve(packetRoot);
  const manifestPath = path.join(root, "evidence-manifest.json");
  const manifest = await readJson(manifestPath);
  requireCondition(manifest.schema_version === "fff.densou.packetEvidenceManifest.v1", "SOURCE_INVALID", "evidence manifest schema mismatch", 2);
  requireCondition(Array.isArray(manifest.files) && manifest.files.length === 8, "SOURCE_INVALID", "evidence manifest must identify eight payload files", 2);
  for (const entry of manifest.files) {
    requireCondition(typeof entry.path === "string" && !entry.path.startsWith("../") && !path.isAbsolute(entry.path), "SOURCE_INVALID", "unsafe evidence path", 2);
    const filePath = path.join(root, entry.path);
    const bytes = await readFile(filePath);
    requireCondition(bytes.length === entry.byte_size, "SOURCE_INVALID", `byte-size mismatch: ${entry.path}`, 2);
    requireCondition(sha256(bytes) === entry.sha256, "SOURCE_INVALID", `SHA-256 mismatch: ${entry.path}`, 2);
  }
  const companion = (await readFile(path.join(root, "evidence-manifest.sha256"), "utf8")).trim().split(/\s+/)[0];
  requireCondition(companion === sha256(await readFile(manifestPath)), "SOURCE_INVALID", "evidence-manifest companion hash mismatch", 2);

  const [authority, receipt, packet, series, season, episode, review] = await Promise.all([
    readJson(path.join(root, "authority-receipt.json")),
    readJson(path.join(root, "source-receipt.json")),
    readJson(path.join(root, "densou-source-packet.json")),
    readJson(path.join(root, "series-manifest.json")),
    readJson(path.join(root, "season-001.json")),
    readJson(path.join(root, "episode-001.json")),
    readFile(path.join(root, "densou-source-readback.html"), "utf8")
  ]);
  validateAuthority(authority, { requireUnbound: false });
  requireCondition(authority.source_binding?.status === "bound", "AUTHORITY_REQUIRED", "bound authority receipt missing");
  requireCondition(path.isAbsolute(receipt.exact_source_locator) && authority.source_binding.locator === receipt.exact_source_locator, "AUTHORITY_REQUIRED", "authority/source locator mismatch");
  requireCondition(authority.source_binding.sha256 === receipt.source_sha256, "AUTHORITY_REQUIRED", "authority/source receipt hash mismatch");
  requireCondition(receipt.source_snapshot_sha256 === receipt.source_sha256, "SOURCE_INVALID", "source receipt snapshot mismatch", 2);
  requireCondition(packet.schema_version === "fff.densou.seriesSourcePacket.v1", "SOURCE_INVALID", "source packet schema mismatch", 2);
  requireCondition(packet.source_sha256 === receipt.source_sha256 && packet.source_snapshot.sha256 === receipt.source_sha256, "SOURCE_INVALID", "source packet hash mismatch", 2);
  requireCondition(packet.source_spans.length === 1 && packet.source_spans[0].byte_start === 0 && packet.source_spans[0].byte_end === packet.source_snapshot.byte_size, "SOURCE_INVALID", "whole-source span mismatch", 2);
  requireCondition(series.schema_version === "fff.densou.seriesManifest.v1" && series.source_packet_id === packet.source_packet_id, "SOURCE_INVALID", "series/source packet mismatch", 2);
  requireCondition(season.schema_version === "fff.densou.seasonManifest.v1" && season.source_packet_id === packet.source_packet_id, "SOURCE_INVALID", "season/source packet mismatch", 2);
  requireCondition(episode.schema_version === "fff.densou.episodeManifest.v1" && episode.source_packet_id === packet.source_packet_id, "SOURCE_INVALID", "episode/source packet mismatch", 2);
  requireCondition(episode.state === "source_bound_adaptation_pending" && episode.source_spans.length === 0 && episode.adaptation === null && episode.viewer_artifact === null, "SOURCE_INVALID", "episode stub invented or adopted content", 2);
  requireCondition(Object.values(series.boundaries).every((value) => value === false), "SOURCE_INVALID", "series boundary opened unexpectedly", 2);
  assertLocalReview(review);
  return {
    result: "PASS",
    checks_passed: 13,
    checks_total: 13,
    source_packet_id: packet.source_packet_id,
    source_sha256: packet.source_sha256,
    state_code: "CONTINUE"
  };
}

async function commandVerify(options) {
  requireCondition(options.packet, "SOURCE_INVALID", "--packet is required", 2);
  console.log(JSON.stringify(await verifyPacket(options.packet), null, 2));
}

async function commandValidateContract(options) {
  const resultPath = path.resolve(options.result ?? defaultResultPath);
  const result = await readJson(resultPath);
  requireCondition(result.schema_version === "fff.densou.seriesIntakeResult.v1", "SOURCE_INVALID", "result schema mismatch", 2);
  requireCondition(result.artifact_id === "fff-densou-series-intake-v1", "SOURCE_INVALID", "artifact identity mismatch", 2);
  requireCondition(result.state_code === "DEPENDENCY_MISSING" && result.source_resolution?.source_material_matches === 0, "SOURCE_INVALID", "missing-source state is not exact", 2);
  const authority = await readJson(path.join(repoRoot, result.authority_path));
  validateAuthority(authority);
  const schemaIds = [
    "fff.densou.seriesSourcePacket.v1",
    "fff.densou.seriesManifest.v1",
    "fff.densou.seasonManifest.v1",
    "fff.densou.episodeManifest.v1"
  ];
  requireCondition(result.schemas.length === schemaIds.length, "SOURCE_INVALID", "schema inventory mismatch", 2);
  for (let index = 0; index < result.schemas.length; index += 1) {
    const schema = await readJson(path.join(repoRoot, result.schemas[index]));
    requireCondition(schema.$schema === "https://json-schema.org/draft/2020-12/schema", "SOURCE_INVALID", "schema dialect mismatch", 2);
    requireCondition(schema.$id === schemaIds[index], "SOURCE_INVALID", `schema id mismatch: ${result.schemas[index]}`, 2);
  }
  const review = await readFile(path.join(repoRoot, result.review_path), "utf8");
  assertLocalReview(review);
  requireCondition(review.includes("DEPENDENCY_MISSING") && review.includes("CONTINUE"), "SOURCE_INVALID", "review does not expose both current and arrival states", 2);
  requireCondition(result.boundaries && Object.values(result.boundaries).every((value) => value === false), "SOURCE_INVALID", "result boundary opened unexpectedly", 2);
  requireCondition(Object.keys(result.commands).sort().join(",") === ["init_when_source_arrives", "status_without_source", "tests", "validate_contract", "verify_packet"].sort().join(","), "SOURCE_INVALID", "command surface mismatch", 2);
  console.log(JSON.stringify({
    result: "PASS",
    artifact_id: result.artifact_id,
    checks_passed: 12,
    checks_total: 12,
    state_code: result.state_code
  }, null, 2));
}

function printHelp() {
  console.log(`Densou series source intake v1

Commands:
  validate-contract [--result <result.json>]
  status --authority <authority.json> [--source <source.txt>]
  init --authority <authority.json> --source <source.txt> --out <new-empty-directory>
  verify --packet <packet-directory>`);
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));
  if (command === "status") return commandStatus(options);
  if (command === "init") return commandInit(options);
  if (command === "verify") return commandVerify(options);
  if (command === "validate-contract") return commandValidateContract(options);
  if (command === "help" || command === "--help") return printHelp();
  throw new IntakeError("SOURCE_INVALID", `unknown command: ${command}`, 2);
}

await main().catch((error) => {
  const stateCode = error instanceof IntakeError ? error.stateCode : "SOURCE_INVALID";
  const exitCode = error instanceof IntakeError ? error.exitCode : 1;
  console.error(JSON.stringify({ result: "FAIL", state_code: stateCode, error: error.message }, null, 2));
  process.exitCode = exitCode;
});
