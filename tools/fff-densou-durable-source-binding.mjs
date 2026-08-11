import { constants as fsConstants } from "node:fs";
import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  stat,
  writeFile
} from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import process from "node:process";
import { TextDecoder } from "node:util";
import { fileURLToPath } from "node:url";

const toolPath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(toolPath), "..");
const contractPath = path.join(repoRoot, "artifacts", "densou-durable-source-binding", "binding-contract.json");
const legacyAuthorityPath = path.join(repoRoot, "artifacts", "densou-series-intake", "densou-authority-input.json");
const recoveryBoundaryPath = path.join(repoRoot, "artifacts", "densou-source-recovery-20260811-001", "source-recovery-boundary.json");
const actualSourcePreflightPath = path.join(repoRoot, "artifacts", "densou-actual-source-production-preflight-20260811-002", "actual-bind-production-preflight.json");
const sourceIndependentPackageRoot = path.join(repoRoot, "artifacts", "densou-source-independent-package-continuation-20260811-003");
const defaultVaultRoot = path.join(repoRoot, ".local", "densou-source-vault", "v1");
const semanticRole = "actual_densou_original";
const states = ["UNBOUND", "BOUND", "VERIFIED", "INGEST_READY", "MATERIALIZED"];
const actualSourcePreflightSha256 = "4d79576605f6e9f72ced3082e8d1b05de5ae0897613e41d30568d304f5ed31d6";
const sourceIndependentPackageId = "fff-densou-source-independent-package-continuation-20260811-003";
const downstreamContractId = "fff-densou-first-bind-downstream-package-v1";

class BindingError extends Error {
  constructor(stateCode, message, exitCode = 1, details = {}) {
    super(message);
    this.stateCode = stateCode;
    this.exitCode = exitCode;
    this.details = details;
  }
}

function requireCondition(condition, stateCode, message, exitCode = 1, details = {}) {
  if (!condition) throw new BindingError(stateCode, message, exitCode, details);
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function now() {
  return new Date().toISOString();
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    throw new BindingError("RECORD_INVALID", `cannot read JSON ${filePath}: ${error.message}`, 2);
  }
}

async function readJsonIfPresent(filePath) {
  if (!(await exists(filePath))) return null;
  return readJson(filePath);
}

async function writeMutableJson(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function writeBytesOnceExact(filePath, bytes) {
  await mkdir(path.dirname(filePath), { recursive: true });
  try {
    await writeFile(filePath, bytes, { flag: "wx" });
    return "created";
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    const existing = await readFile(filePath);
    requireCondition(existing.equals(Buffer.from(bytes)), "NON_OVERWRITE_CONFLICT", `existing file differs: ${filePath}`, 5);
    return "reused_exact";
  }
}

async function writeJsonOnceExact(filePath, value) {
  return writeBytesOnceExact(filePath, Buffer.from(`${JSON.stringify(value, null, 2)}\n`, "utf8"));
}

function parseArgs(argv) {
  const [command = "help", ...rest] = argv;
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    requireCondition(token.startsWith("--"), "INVALID_ARGUMENT", `unexpected argument: ${token}`, 2);
    const key = token.slice(2).replaceAll("-", "_");
    const value = rest[index + 1];
    requireCondition(value && !value.startsWith("--"), "INVALID_ARGUMENT", `missing value for ${token}`, 2);
    options[key] = value;
    index += 1;
  }
  return { command, options };
}

function requireAllowedOptions(options, allowed) {
  const unknown = Object.keys(options).filter((key) => !allowed.includes(key));
  requireCondition(unknown.length === 0, "INVALID_ARGUMENT", `unsupported option(s): ${unknown.join(", ")}`, 2);
}

function normalizeScope(value = "production") {
  requireCondition(/^[a-z0-9][a-z0-9._-]*$/.test(value), "INVALID_ARGUMENT", "scope must be portable lowercase identifier", 2);
  return value;
}

function vaultContext(options = {}) {
  const vaultRoot = path.resolve(process.env.FFF_DENSOU_VAULT_ROOT ?? defaultVaultRoot);
  const scope = normalizeScope(options.scope);
  const scopeRoot = path.join(vaultRoot, "scopes", scope);
  return {
    vaultRoot,
    scope,
    scopeRoot,
    activeIndexPath: path.join(scopeRoot, "active-bindings.json")
  };
}

function portable(...parts) {
  return parts.join("/").replaceAll("\\", "/");
}

function bindingRecordPath(context, bindingId) {
  return path.join(context.scopeRoot, "bindings", bindingId, "binding.json");
}

function objectRelativePath(sourceHash) {
  return portable("objects", "sha256", sourceHash.slice(0, 2), sourceHash, "original.bin");
}

function packageRelativeRoot(bindingId) {
  return portable("packages", bindingId);
}

async function loadContract() {
  const [contract, legacyAuthority, recovery] = await Promise.all([
    readJson(contractPath),
    readJson(legacyAuthorityPath),
    readJson(recoveryBoundaryPath)
  ]);
  requireCondition(contract.schema_version === "fff.densou.durableSourceBindingContract.v1", "CONTRACT_INVALID", "durable binding contract version mismatch", 2);
  requireCondition(contract.semantic_role === semanticRole, "CONTRACT_INVALID", "semantic role mismatch", 2);
  requireCondition(contract.authority_model?.sole_authoritative_record === "ignored_local_vault_binding_record", "CONTRACT_INVALID", "sole authority is not the local binding record", 2);
  requireCondition(contract.authority_model?.tracked_unbound_authority_allowed === false, "CONTRACT_INVALID", "tracked unbound authority cannot be authoritative", 2);
  requireCondition(legacyAuthority.authority_role === contract.authority_model.legacy_authority_role, "AUTHORITY_CONFLICT", "legacy authority is not explicitly non-authoritative", 5);
  requireCondition(legacyAuthority.must_not_be_used_as_active_binding === true, "AUTHORITY_CONFLICT", "legacy authority active-binding guard missing", 5);
  requireCondition(legacyAuthority.source_binding?.status === "unbound" && legacyAuthority.source_binding?.authoritative === false, "AUTHORITY_CONFLICT", "tracked unbound template conflicts with durable authority", 5);
  requireCondition(recovery.wrong_source_lineage?.reuse_allowed === false, "CONTRACT_INVALID", "wrong-source quarantine is not active", 2);
  return {
    contract,
    rejectedSourceSha256: recovery.wrong_source_lineage.source.sha256
  };
}

function strictUtf8(bytes) {
  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new BindingError("SOURCE_INVALID", "source is not strict UTF-8", 2);
  }
  requireCondition(bytes.length > 0 && text.trim().length > 0 && !text.includes("\u0000"), "SOURCE_INVALID", "source must contain non-empty UTF-8 text without NUL", 2);
  return text;
}

async function inspectExternalSource(sourcePath) {
  const resolved = path.resolve(sourcePath);
  const sourceStat = await stat(resolved).catch(() => null);
  requireCondition(sourceStat?.isFile(), "SOURCE_PATH_MISSING", `one-time source path does not identify a file: ${resolved}`, 3);
  const extension = path.extname(resolved).toLowerCase();
  requireCondition([".txt", ".md", ".markdown"].includes(extension), "SOURCE_INVALID", "source must be .txt, .md, or .markdown", 2);
  const bytes = await readFile(resolved);
  const text = strictUtf8(bytes);
  const originalHash = sha256(bytes);
  return {
    resolved,
    bytes,
    text,
    byteSize: bytes.length,
    originalHash,
    canonicalUtf8Hash: originalHash,
    canonicalization: "strict_utf8_identity_no_normalization"
  };
}

function identityFor(source, options) {
  for (const key of ["revision", "canon_label", "provenance_assertion", "rights_assertion"]) {
    requireCondition(typeof options[key] === "string" && options[key].trim().length > 0, "BINDING_ASSERTION_REQUIRED", `--${key.replaceAll("_", "-")} must be supplied explicitly`, 3);
  }
  const identity = {
    semantic_role: semanticRole,
    original_bytes_sha256: source.originalHash,
    byte_size: source.byteSize,
    canonical_utf8_sha256: source.canonicalUtf8Hash,
    revision_label: options.revision,
    canon_label: options.canon_label,
    provenance_assertion: options.provenance_assertion,
    rights_assertion: options.rights_assertion
  };
  return {
    ...identity,
    binding_id: `densou-binding-${sha256(Buffer.from(stableStringify(identity), "utf8")).slice(0, 20)}`
  };
}

async function ensureObject(context, source) {
  const relative = objectRelativePath(source.originalHash);
  const target = path.join(context.scopeRoot, ...relative.split("/"));
  await mkdir(path.dirname(target), { recursive: true });
  try {
    await copyFile(source.resolved, target, fsConstants.COPYFILE_EXCL);
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  }
  const stored = await readFile(target);
  requireCondition(stored.length === source.byteSize && sha256(stored) === source.originalHash, "VAULT_HASH_MISMATCH", "hash-addressed vault object conflicts with source identity", 6);
  return { relative, target };
}

async function loadIndex(context) {
  return (await readJsonIfPresent(context.activeIndexPath)) ?? {
    schema_version: "fff.densou.activeBindingIndex.v1",
    scope: context.scope,
    active_by_semantic_role: {}
  };
}

async function saveIndex(context, index) {
  requireCondition(index.scope === context.scope, "AUTHORITY_CONFLICT", "active index scope mismatch", 5);
  await writeMutableJson(context.activeIndexPath, index);
}

async function saveBinding(context, record) {
  await writeMutableJson(bindingRecordPath(context, record.binding_id), record);
}

function assertRecordIdentity(record, identity) {
  for (const key of ["binding_id", "semantic_role", "original_bytes_sha256", "byte_size", "canonical_utf8_sha256", "revision_label", "canon_label", "provenance_assertion", "rights_assertion"]) {
    requireCondition(record[key] === identity[key], "BINDING_IDENTITY_CONFLICT", `binding field differs: ${key}`, 5);
  }
}

async function recordBlocker(context, bindingId, condition, resumeCommand, question) {
  const fingerprint = `${bindingId}|${semanticRole}|${condition}`;
  const fingerprintSha256 = sha256(Buffer.from(fingerprint, "utf8"));
  const blockerPath = path.join(context.scopeRoot, "blockers", `${fingerprintSha256}.json`);
  const existing = await readJsonIfPresent(blockerPath);
  const observedAt = now();
  const record = existing ?? {
    schema_version: "fff.densou.sourceBlockerFingerprint.v1",
    fingerprint,
    fingerprint_sha256: fingerprintSha256,
    binding_id: bindingId,
    expected_semantic_role: semanticRole,
    condition,
    first_observed_at: observedAt,
    question_emitted: true,
    occurrences: 0
  };
  record.last_observed_at = observedAt;
  record.occurrences += 1;
  record.resume_command = resumeCommand;
  await writeMutableJson(blockerPath, record);
  return {
    fingerprint,
    fingerprint_sha256: fingerprintSha256,
    question_suppressed: existing !== null,
    question: existing ? null : question,
    occurrences: record.occurrences,
    resume_command: resumeCommand
  };
}

async function throwDifferential(context, bindingId, condition, message) {
  const resumeCommand = `node tools/fff-densou-durable-source-binding.mjs status --scope ${context.scope} --binding-id ${bindingId}`;
  const blocker = await recordBlocker(context, bindingId, condition, resumeCommand, message);
  throw new BindingError(condition, message, 6, {
    source_binding_closed: false,
    expected_semantic_role: semanticRole,
    blocker
  });
}

async function resolveBinding(options = {}, { requireObject = true } = {}) {
  await loadContract();
  const context = vaultContext(options);
  const index = await loadIndex(context);
  const bindingId = options.binding_id ?? index.active_by_semantic_role[semanticRole];
  if (!bindingId) {
    const resumeCommand = "node tools/fff-densou-durable-source-binding.mjs bind-source --path <one-time-path> --revision <explicit> --canon-label <explicit> --provenance-assertion <explicit> --rights-assertion <explicit>";
    const blocker = await recordBlocker(context, "UNBOUND", "UNBOUND", resumeCommand, "One explicit source binding is required for this scope.");
    throw new BindingError("UNBOUND", "no durable source binding exists for this scope", 3, { blocker });
  }
  const record = await readJsonIfPresent(bindingRecordPath(context, bindingId));
  requireCondition(record, "BINDING_RECORD_MISSING", `binding record is missing: ${bindingId}`, 6);
  requireCondition(record.schema_version === "fff.densou.durableSourceBinding.v1" && record.binding_id === bindingId, "BINDING_RECORD_INVALID", "binding record identity mismatch", 5);
  requireCondition(record.semantic_role === semanticRole && record.status === "BOUND", "BINDING_RECORD_INVALID", "binding is not active for actual_densou_original", 5);
  requireCondition(record.scope === context.scope, "BINDING_RECORD_INVALID", "binding scope mismatch", 5);
  if (options.revision && options.revision !== record.revision_label) {
    await throwDifferential(context, bindingId, "EXPLICIT_REVISION_CHANGE", `requested revision differs from bound revision ${record.revision_label}`);
  }
  if (options.canon_label && options.canon_label !== record.canon_label) {
    await throwDifferential(context, bindingId, "EXPLICIT_CANON_CHANGE", `requested canon label differs from bound label ${record.canon_label}`);
  }
  const objectPath = path.join(context.scopeRoot, ...record.portable_vault_locator.split("/"));
  if (requireObject) {
    if (!(await exists(objectPath))) await throwDifferential(context, bindingId, "VAULT_OBJECT_MISSING", "bound vault object is missing");
    const bytes = await readFile(objectPath);
    if (bytes.length !== record.byte_size || sha256(bytes) !== record.original_bytes_sha256) {
      await throwDifferential(context, bindingId, "VAULT_HASH_MISMATCH", "bound vault bytes do not match the binding record");
    }
    strictUtf8(bytes);
  }
  return { context, index, record, objectPath };
}

function stateAtLeast(record, wanted) {
  return states.indexOf(record.state) >= states.indexOf(wanted);
}

function addHistory(record, state, at) {
  record.state = state;
  record.state_history ??= [];
  if (!record.state_history.some((entry) => entry.state === state)) record.state_history.push({ state, at });
}

async function bindSource(options) {
  requireAllowedOptions(options, ["path", "revision", "canon_label", "provenance_assertion", "rights_assertion", "scope", "synthetic_fixture", "fixture_output", "interrupt_after"]);
  requireCondition(options.path, "SOURCE_PATH_MISSING", "--path is required exactly once for bind-source", 3);
  const { rejectedSourceSha256 } = await loadContract();
  const context = vaultContext(options);
  const source = await inspectExternalSource(options.path);
  if (source.originalHash === rejectedSourceSha256) {
    throw new BindingError("REJECTED", "known wrong-source sample remains quarantined", 4, {
      status: "REJECTED",
      semantic_role: semanticRole,
      original_bytes_sha256: source.originalHash,
      source_path_retained: false
    });
  }
  const identity = identityFor(source, options);
  const syntheticFixture = options.synthetic_fixture === "true";
  if (options.synthetic_fixture !== undefined) requireCondition(["true", "false"].includes(options.synthetic_fixture), "INVALID_ARGUMENT", "--synthetic-fixture must be true or false", 2);
  if (syntheticFixture) {
    requireCondition(options.canon_label.startsWith("NONCANON_SYNTHETIC"), "FIXTURE_BOUNDARY_INVALID", "synthetic fixture canon label must start NONCANON_SYNTHETIC", 2);
    requireCondition(/synthetic/i.test(options.provenance_assertion), "FIXTURE_BOUNDARY_INVALID", "synthetic fixture provenance must explicitly say synthetic", 2);
  } else {
    requireCondition(!options.fixture_output, "FIXTURE_BOUNDARY_INVALID", "fixture output is allowed only for an explicit synthetic fixture", 2);
  }
  let fixtureOutputLocator = null;
  if (options.fixture_output) {
    const normalized = options.fixture_output.replaceAll("\\", "/");
    requireCondition(normalized.startsWith("artifacts/") && !normalized.includes("..") && !path.isAbsolute(normalized), "FIXTURE_BOUNDARY_INVALID", "fixture output must be a portable repo-relative artifacts path", 2);
    fixtureOutputLocator = normalized;
  }
  const index = await loadIndex(context);
  const active = index.active_by_semantic_role[semanticRole];
  requireCondition(!active || active === identity.binding_id, "EXPLICIT_BINDING_CHANGE_REQUIRED", `scope already has a different active binding: ${active}`, 6);
  const object = await ensureObject(context, source);
  const recordPath = bindingRecordPath(context, identity.binding_id);
  let record = await readJsonIfPresent(recordPath);
  const idempotent = record !== null;
  if (record) {
    assertRecordIdentity(record, identity);
    requireCondition(record.portable_vault_locator === object.relative, "BINDING_IDENTITY_CONFLICT", "vault locator differs", 5);
    requireCondition(record.synthetic_fixture === syntheticFixture && record.fixture_output_locator === fixtureOutputLocator, "BINDING_IDENTITY_CONFLICT", "fixture binding options differ", 5);
  } else {
    const boundAt = now();
    record = {
      schema_version: "fff.densou.durableSourceBinding.v1",
      contract_id: "fff-densou-durable-source-binding-v1",
      binding_id: identity.binding_id,
      semantic_role: semanticRole,
      original_bytes_sha256: source.originalHash,
      byte_size: source.byteSize,
      canonical_utf8_sha256: source.canonicalUtf8Hash,
      canonicalization: source.canonicalization,
      revision_label: options.revision,
      canon_label: options.canon_label,
      provenance_assertion: options.provenance_assertion,
      rights_assertion: options.rights_assertion,
      portable_vault_locator: object.relative,
      scope: context.scope,
      status: "BOUND",
      state: "BOUND",
      bound_at: boundAt,
      verified_at: null,
      ingest_ready_at: null,
      materialized_at: null,
      state_history: [{ state: "BOUND", at: boundAt }],
      checkpoints: {},
      synthetic_fixture: syntheticFixture,
      fixture_output_locator: fixtureOutputLocator,
      source_path_retained: false,
      legacy_authority_accepted: false,
      absolute_locator_recorded: false
    };
    await saveBinding(context, record);
  }
  index.active_by_semantic_role[semanticRole] = identity.binding_id;
  index.updated_at = now();
  await saveIndex(context, index);
  if (options.interrupt_after === "BOUND") {
    console.log(JSON.stringify({ result: "INTERRUPTED_AT_CHECKPOINT", binding_id: record.binding_id, state: record.state, resume_command: `node tools/fff-densou-durable-source-binding.mjs resume --scope ${context.scope} --binding-id ${record.binding_id}` }, null, 2));
    process.exitCode = 75;
    return;
  }
  const continued = await continueBinding({ ...options, binding_id: record.binding_id }, record);
  if (continued === null) return;
  console.log(JSON.stringify({ result: "PASS", idempotent, ...continued }, null, 2));
}

async function ensureVerified(resolved) {
  const { context, record, objectPath } = resolved;
  const bytes = await readFile(objectPath);
  requireCondition(bytes.length === record.byte_size && sha256(bytes) === record.original_bytes_sha256, "VAULT_HASH_MISMATCH", "vault verification failed", 6);
  requireCondition(record.canonical_utf8_sha256 === record.original_bytes_sha256 && record.canonicalization === "strict_utf8_identity_no_normalization", "BINDING_RECORD_INVALID", "canonical/original identity contract mismatch", 5);
  strictUtf8(bytes);
  if (!stateAtLeast(record, "VERIFIED")) {
    const verifiedAt = now();
    record.verified_at = verifiedAt;
    addHistory(record, "VERIFIED", verifiedAt);
    await saveBinding(context, record);
  }
  return resolved;
}

function packetDocument(record) {
  return {
    schema_version: "fff.densou.durableSourceIngestPacket.v1",
    packet_id: `fff-densou-durable-source-${record.binding_id.slice(-20)}`,
    binding_id: record.binding_id,
    semantic_role: record.semantic_role,
    original_bytes_sha256: record.original_bytes_sha256,
    byte_size: record.byte_size,
    canonical_utf8_sha256: record.canonical_utf8_sha256,
    revision_label: record.revision_label,
    canon_label: record.canon_label,
    provenance_assertion: record.provenance_assertion,
    rights_assertion: record.rights_assertion,
    portable_vault_locator: record.portable_vault_locator,
    source_spans: [{ span_id: "source-whole", byte_start: 0, byte_end: record.byte_size, status: "raw_source_uninterpreted" }],
    source_path_required_after_binding: false,
    legacy_receipts_authoritative: false,
    state: "INGEST_READY",
    created_at: record.checkpoints.ingest_started_at
  };
}

async function ensureIngestReady(resolved) {
  const { context, record } = await ensureVerified(resolved);
  if (!record.checkpoints.ingest_started_at) {
    record.checkpoints.ingest_started_at = now();
    await saveBinding(context, record);
  }
  const packageRoot = path.join(context.scopeRoot, ...packageRelativeRoot(record.binding_id).split("/"));
  const packetPath = path.join(packageRoot, "source-bound-ingest-packet.json");
  const packet = packetDocument(record);
  await writeJsonOnceExact(packetPath, packet);
  if (!stateAtLeast(record, "INGEST_READY")) {
    record.ingest_ready_at = record.checkpoints.ingest_started_at;
    addHistory(record, "INGEST_READY", record.ingest_ready_at);
    await saveBinding(context, record);
  }
  return { ...resolved, packageRoot, packetPath, packet };
}

function materialDocument(record, text) {
  const lines = text.split(/\r\n|\r|\n/).map((line) => line.trim()).filter(Boolean);
  const substantiveMaterial = {
    source_line_count: lines.length,
    source_lines: lines,
    episode_seed_lines: lines.filter((line) => /^(SEED TITLE|SCENE SEED):/i.test(line)),
    voice_input_lines: lines.filter((line) => /^VOICE INPUT:/i.test(line))
  };
  const substantiveKey = record.synthetic_fixture
    ? "substantive_fixture_derived_material"
    : "substantive_source_derived_material";
  return {
    schema_version: "fff.densou.bindingDerivedMaterial.v1",
    artifact_id: `fff-densou-binding-material-${record.binding_id.slice(-20)}`,
    classification: record.synthetic_fixture ? "NONCANON_SYNTHETIC_FIXTURE_MATERIAL" : "NONCANON_PRIVATE_SOURCE_INGEST_MATERIAL",
    binding_id: record.binding_id,
    semantic_role: record.semantic_role,
    source_packet_id: `fff-densou-durable-source-${record.binding_id.slice(-20)}`,
    source_sha256: record.original_bytes_sha256,
    revision_label: record.revision_label,
    canon_label: record.canon_label,
    [substantiveKey]: substantiveMaterial,
    boundaries: {
      actual_densou_claimed: false,
      canon_claimed: false,
      rights_clearance_claimed: false,
      human_acceptance_claimed: false,
      production_approval_claimed: false,
      publication_authorized: false
    },
    state: "MATERIALIZED",
    created_at: record.checkpoints.materialize_started_at
  };
}

async function verifyPackage(resolved, packageRoot) {
  const { record } = resolved;
  const packetPath = path.join(packageRoot, "source-bound-ingest-packet.json");
  const materialPath = path.join(packageRoot, "noncanon-material.json");
  const [packet, material] = await Promise.all([readJson(packetPath), readJson(materialPath)]);
  requireCondition(packet.binding_id === record.binding_id && material.binding_id === record.binding_id, "PACKAGE_BINDING_MISMATCH", "downstream package conflicts with durable binding", 5);
  requireCondition(packet.original_bytes_sha256 === record.original_bytes_sha256 && material.source_sha256 === record.original_bytes_sha256, "PACKAGE_BINDING_MISMATCH", "downstream source hash conflicts with binding", 5);
  requireCondition(packet.portable_vault_locator === record.portable_vault_locator && !path.isAbsolute(packet.portable_vault_locator), "PACKAGE_BINDING_MISMATCH", "packet vault locator is not portable", 5);
  const substantiveMaterial = material.substantive_fixture_derived_material ?? material.substantive_source_derived_material;
  requireCondition(substantiveMaterial?.source_lines.length > 0, "MATERIAL_INVALID", "material contains no source-derived content", 5);
  return { packetPath, materialPath, packet, material };
}

async function exportSyntheticFixture(record, packageInfo) {
  if (!record.fixture_output_locator) return null;
  requireCondition(record.synthetic_fixture === true, "FIXTURE_BOUNDARY_INVALID", "only synthetic bindings may export fixture evidence", 5);
  const outputRoot = path.join(repoRoot, ...record.fixture_output_locator.split("/"));
  const summary = {
    schema_version: "fff.densou.syntheticBindingSummary.v1",
    artifact_id: "fff-densou-durable-source-binding-synthetic-e2e-001",
    payload_identity: "fff-densou-durable-source-binding-v1",
    binding_id: record.binding_id,
    semantic_role: record.semantic_role,
    original_bytes_sha256: record.original_bytes_sha256,
    canonical_utf8_sha256: record.canonical_utf8_sha256,
    byte_size: record.byte_size,
    revision_label: record.revision_label,
    canon_label: record.canon_label,
    state: record.state,
    synthetic_noncanon: true,
    actual_densou_claimed: false,
    source_path_retained: false,
    portable_vault_locator: record.portable_vault_locator,
    generated_at: record.materialized_at
  };
  const summaryPath = path.join(outputRoot, "binding-summary.json");
  const packetPath = path.join(outputRoot, "source-bound-ingest-packet.json");
  const materialPath = path.join(outputRoot, "noncanon-episode-seed.json");
  const readmePath = path.join(outputRoot, "README.md");
  await writeJsonOnceExact(summaryPath, summary);
  await writeJsonOnceExact(packetPath, packageInfo.packet);
  await writeJsonOnceExact(materialPath, packageInfo.material);
  await writeBytesOnceExact(readmePath, Buffer.from(`# Synthetic noncanon durable-binding proof\n\nThis package is generated only from the explicit synthetic fixture. It is not actual Densou, canon, rights clearance, human acceptance, production approval, or publication authority.\n\nBinding: \`${record.binding_id}\`\nState: \`${record.state}\`\n`, "utf8"));
  const files = [];
  for (const filePath of [summaryPath, packetPath, materialPath, readmePath]) {
    const bytes = await readFile(filePath);
    files.push({ path: path.basename(filePath), byte_size: bytes.length, sha256: sha256(bytes) });
  }
  files.sort((a, b) => a.path.localeCompare(b.path));
  const manifest = {
    schema_version: "fff.densou.syntheticBindingEvidenceManifest.v1",
    artifact_id: summary.artifact_id,
    binding_id: record.binding_id,
    generated_at: record.materialized_at,
    files
  };
  const manifestPath = path.join(outputRoot, "evidence-manifest.json");
  await writeJsonOnceExact(manifestPath, manifest);
  return {
    artifact_id: summary.artifact_id,
    portable_path: record.fixture_output_locator,
    evidence_manifest_sha256: sha256(await readFile(manifestPath)),
    files: [...files, { path: "evidence-manifest.json", byte_size: (await stat(manifestPath)).size, sha256: sha256(await readFile(manifestPath)) }]
  };
}

async function ensureMaterialized(resolved) {
  const ingested = await ensureIngestReady(resolved);
  const { context, record, objectPath, packageRoot } = ingested;
  if (!record.checkpoints.materialize_started_at) {
    record.checkpoints.materialize_started_at = now();
    await saveBinding(context, record);
  }
  const text = strictUtf8(await readFile(objectPath));
  const material = materialDocument(record, text);
  await writeJsonOnceExact(path.join(packageRoot, "noncanon-material.json"), material);
  if (!stateAtLeast(record, "MATERIALIZED")) {
    record.materialized_at = record.checkpoints.materialize_started_at;
    addHistory(record, "MATERIALIZED", record.materialized_at);
    await saveBinding(context, record);
  }
  const packageInfo = await verifyPackage(resolved, packageRoot);
  const fixture = await exportSyntheticFixture(record, packageInfo);
  return { ...ingested, material: packageInfo.material, fixture };
}

async function continueBinding(options, existingRecord = null) {
  requireAllowedOptions(options, ["binding_id", "scope", "interrupt_after", "require_resource", "path", "revision", "canon_label", "provenance_assertion", "rights_assertion", "synthetic_fixture", "fixture_output"]);
  let resolved = existingRecord
    ? { context: vaultContext(options), record: existingRecord, objectPath: path.join(vaultContext(options).scopeRoot, ...existingRecord.portable_vault_locator.split("/")) }
    : await resolveBinding(options);
  resolved = await ensureVerified(resolved);
  if (options.interrupt_after === "VERIFIED") {
    console.log(JSON.stringify({ result: "INTERRUPTED_AT_CHECKPOINT", binding_id: resolved.record.binding_id, state: resolved.record.state, resume_command: `node tools/fff-densou-durable-source-binding.mjs resume --scope ${resolved.context.scope} --binding-id ${resolved.record.binding_id}` }, null, 2));
    process.exitCode = 75;
    return null;
  }
  const ingested = await ensureIngestReady(resolved);
  if (options.interrupt_after === "INGEST_READY") {
    console.log(JSON.stringify({ result: "INTERRUPTED_AT_CHECKPOINT", binding_id: ingested.record.binding_id, state: ingested.record.state, resume_command: `node tools/fff-densou-durable-source-binding.mjs resume --scope ${ingested.context.scope} --binding-id ${ingested.record.binding_id}` }, null, 2));
    process.exitCode = 75;
    return null;
  }
  if (options.require_resource) {
    const resourcePath = path.resolve(options.require_resource);
    if (!(await exists(resourcePath))) {
      throw new BindingError("RESOURCE_DEPENDENCY_MISSING", `non-source resource is missing: ${resourcePath}`, 7, {
        source_binding_closed: true,
        binding_id: ingested.record.binding_id,
        source_state: ingested.record.state,
        source_question_reopened: false
      });
    }
  }
  const materialized = await ensureMaterialized(ingested);
  const substantiveMaterial = materialized.material.substantive_fixture_derived_material
    ?? materialized.material.substantive_source_derived_material;
  return {
    binding_id: materialized.record.binding_id,
    semantic_role: materialized.record.semantic_role,
    status: materialized.record.status,
    state: materialized.record.state,
    scope: materialized.context.scope,
    original_bytes_sha256: materialized.record.original_bytes_sha256,
    canonical_utf8_sha256: materialized.record.canonical_utf8_sha256,
    byte_size: materialized.record.byte_size,
    revision_label: materialized.record.revision_label,
    canon_label: materialized.record.canon_label,
    portable_vault_locator: materialized.record.portable_vault_locator,
    source_path_required: false,
    state_history: materialized.record.state_history,
    material: {
      artifact_id: materialized.material.artifact_id,
      portable_locator: portable(packageRelativeRoot(materialized.record.binding_id), "noncanon-material.json"),
      source_line_count: substantiveMaterial.source_line_count
    },
    fixture: materialized.fixture
  };
}

async function commandStatus(options) {
  requireAllowedOptions(options, ["binding_id", "scope", "revision", "canon_label"]);
  const { context, record } = await resolveBinding(options);
  console.log(JSON.stringify({
    result: "PASS",
    binding_id: record.binding_id,
    semantic_role: record.semantic_role,
    status: record.status,
    state: record.state,
    scope: context.scope,
    original_bytes_sha256: record.original_bytes_sha256,
    canonical_utf8_sha256: record.canonical_utf8_sha256,
    byte_size: record.byte_size,
    revision_label: record.revision_label,
    canon_label: record.canon_label,
    portable_vault_locator: record.portable_vault_locator,
    source_path_required: false,
    source_question: null,
    source_locator_missing_emitted: false
  }, null, 2));
}

async function commandVerify(options) {
  requireAllowedOptions(options, ["binding_id", "scope"]);
  const resolved = await ensureVerified(await resolveBinding(options));
  if (stateAtLeast(resolved.record, "INGEST_READY")) {
    const packageRoot = path.join(resolved.context.scopeRoot, ...packageRelativeRoot(resolved.record.binding_id).split("/"));
    if (stateAtLeast(resolved.record, "MATERIALIZED")) await verifyPackage(resolved, packageRoot);
  }
  console.log(JSON.stringify({ result: "PASS", binding_id: resolved.record.binding_id, status: resolved.record.status, state: resolved.record.state, verified_at: resolved.record.verified_at, source_path_required: false }, null, 2));
}

async function commandInit(options) {
  requireAllowedOptions(options, ["binding_id", "scope"]);
  const ingested = await ensureIngestReady(await resolveBinding(options));
  console.log(JSON.stringify({ result: "PASS", binding_id: ingested.record.binding_id, status: ingested.record.status, state: ingested.record.state, packet_id: ingested.packet.packet_id, portable_packet_locator: portable(packageRelativeRoot(ingested.record.binding_id), "source-bound-ingest-packet.json"), source_path_required: false }, null, 2));
}

async function commandResume(options) {
  requireAllowedOptions(options, ["binding_id", "scope", "require_resource"]);
  requireCondition(options.binding_id, "INVALID_ARGUMENT", "--binding-id is required for resume", 2);
  const result = await continueBinding(options);
  console.log(JSON.stringify({ result: "PASS", resumed_without_source_path: true, ...result }, null, 2));
}

async function commandMaterialize(options) {
  requireAllowedOptions(options, ["binding_id", "scope", "require_resource"]);
  const result = await continueBinding(options);
  console.log(JSON.stringify({ result: "PASS", ...result }, null, 2));
}

function portableArtifactOutput(value, optionName) {
  requireCondition(typeof value === "string" && value.length > 0, "INVALID_ARGUMENT", `${optionName} is required`, 2);
  const portablePath = value.replaceAll("\\", "/");
  const segments = portablePath.split("/");
  requireCondition(
    portablePath.startsWith("artifacts/")
      && portablePath.endsWith(".json")
      && !path.isAbsolute(value)
      && !segments.includes("..")
      && !segments.includes("."),
    "INVALID_ARGUMENT",
    `${optionName} must be a portable repo-relative JSON path under artifacts/`,
    2
  );
  return {
    portablePath,
    absolutePath: path.join(repoRoot, ...segments)
  };
}

function oneShotBindArgv() {
  return [
    "node",
    "tools/fff-densou-durable-source-binding.mjs",
    "bind-source",
    "--path",
    "<one-time-path>",
    "--revision",
    "<explicit-revision>",
    "--canon-label",
    "<explicit-canon-label>",
    "--provenance-assertion",
    "<explicit-provenance>",
    "--rights-assertion",
    "<explicit-rights-assertion>"
  ];
}

function checkpointResumeArgv() {
  return [
    "node",
    "tools/fff-densou-durable-source-binding.mjs",
    "resume",
    "--binding-id",
    "<binding_id>"
  ];
}

async function actualSourcePreflightDocument(portablePath) {
  const { contract, rejectedSourceSha256 } = await loadContract();
  const [contractBytes, recoveryBytes] = await Promise.all([
    readFile(contractPath),
    readFile(recoveryBoundaryPath)
  ]);
  const humanOnlyField = (cliOption) => ({
    status: "UNBOUND",
    value: null,
    owner: "human_caller",
    cli_option: cliOption,
    inference_allowed: false
  });
  const resolverField = () => ({
    status: "RESOLVER_FILLED_AFTER_BIND",
    value: null,
    owner: "durable_binding_resolver"
  });
  return {
    schema_version: "fff.densou.actualSourceProductionPreflight.v1",
    artifact_id: "fff-densou-actual-source-production-preflight-20260811-002",
    work_order_id: "FFF-DENSOU-ACTUAL-SOURCE-LOCATOR-AND-PREFLIGHT-20260811-002",
    classification: "PRODUCTION_SHAPED_INPUT_TEMPLATE_NOT_SOURCE_MATERIAL",
    semantic_role: semanticRole,
    current_actual_source: {
      status: "UNBOUND",
      content: null,
      locator: null,
      canon: null,
      rights: null,
      source_question_emitted_by_this_artifact: false
    },
    human_only_fields: {
      revision_label: humanOnlyField("--revision"),
      canon_label: humanOnlyField("--canon-label"),
      provenance_assertion: humanOnlyField("--provenance-assertion"),
      rights_assertion: humanOnlyField("--rights-assertion")
    },
    resolver_filled_fields: {
      binding_id: resolverField(),
      original_bytes_sha256: resolverField(),
      byte_size: resolverField(),
      canonical_utf8_sha256: resolverField(),
      portable_vault_locator: resolverField(),
      bound_at: resolverField(),
      verified_at: resolverField()
    },
    one_shot_bind: {
      command_argv: oneShotBindArgv(),
      command: oneShotBindArgv().join(" "),
      external_path_consumed_once: true,
      external_path_retained: false,
      automatic_continuation: ["BOUND", "VERIFIED", "INGEST_READY", "MATERIALIZED"]
    },
    checkpoint_resume: {
      command_argv: checkpointResumeArgv(),
      command: checkpointResumeArgv().join(" "),
      original_path_required: false
    },
    wrong_source_guard: {
      recovery_boundary_path: portable(path.relative(repoRoot, recoveryBoundaryPath)),
      recovery_boundary_sha256: sha256(recoveryBytes),
      rejected_original_bytes_sha256: rejectedSourceSha256,
      expected_result: "REJECTED",
      reuse_allowed: false
    },
    source_gate_contract: {
      blocker_fingerprint: contract.blocker_fingerprint,
      source_gate_reissued_after_bound_matching_vault: false,
      legitimate_reopen_conditions: contract.source_reopen_conditions,
      densou_source_locator_missing_after_bound: false
    },
    first_downstream_material: {
      automatically_materialized_by_bind_source: true,
      schema_version: "fff.densou.bindingDerivedMaterial.v1",
      artifact_id_template: "fff-densou-binding-material-<binding_id_suffix>",
      portable_target_template: "packages/<binding_id>/noncanon-material.json",
      resolver_command_argv: [
        "node",
        "tools/fff-densou-durable-source-binding.mjs",
        "materialize",
        "--binding-id",
        "<binding_id>"
      ],
      source_content_policy: "exact_bound_source_derived_only",
      canon_status: "NONCANON_PRIVATE_SOURCE_INGEST_MATERIAL"
    },
    consumer_contract: {
      ready_for_direct_consumption: true,
      preflight_portable_path: portablePath,
      required_binding_status: "BOUND",
      required_minimum_state: "VERIFIED",
      reject_legacy_receipt_reinterpretation: true,
      reject_synthetic_binding_as_actual: true
    },
    authority_guard: {
      durable_contract_path: portable(path.relative(repoRoot, contractPath)),
      durable_contract_sha256: sha256(contractBytes),
      sole_authoritative_record: contract.authority_model.sole_authoritative_record,
      legacy_packets_authoritative: false
    },
    boundaries: {
      actual_source_found_by_this_preflight: false,
      synthetic_as_actual_or_canon: false,
      canon_inferred: false,
      rights_inferred: false,
      source_content_invented: false,
      human_acceptance_claimed: false,
      production_approval_claimed: false,
      publication_authorized: false
    }
  };
}

async function validateActualSourcePreflight(preflightPath) {
  const { contract, rejectedSourceSha256 } = await loadContract();
  const [document, contractBytes, recoveryBytes, preflightBytes] = await Promise.all([
    readJson(preflightPath),
    readFile(contractPath),
    readFile(recoveryBoundaryPath),
    readFile(preflightPath)
  ]);
  let checks = 0;
  const check = (condition, message) => {
    checks += 1;
    requireCondition(condition, "PREFLIGHT_INVALID", message, 5);
  };
  check(document.schema_version === "fff.densou.actualSourceProductionPreflight.v1", "preflight schema version mismatch");
  check(document.artifact_id === "fff-densou-actual-source-production-preflight-20260811-002", "preflight artifact identity mismatch");
  check(document.semantic_role === semanticRole, "preflight semantic role mismatch");
  check(document.current_actual_source?.status === "UNBOUND", "actual source must remain explicitly unbound");
  check(["content", "locator", "canon", "rights"].every((key) => document.current_actual_source[key] === null), "unbound actual source values must be null");
  check(document.current_actual_source.source_question_emitted_by_this_artifact === false, "preflight may not ask a source question");
  check(Object.values(document.human_only_fields ?? {}).length === 4, "human-only field set mismatch");
  check(Object.values(document.human_only_fields ?? {}).every((field) => field.status === "UNBOUND" && field.value === null && field.owner === "human_caller" && field.inference_allowed === false), "human-only fields must remain uninferred and unbound");
  check(Object.keys(document.resolver_filled_fields ?? {}).length === 7, "resolver field set mismatch");
  check(Object.values(document.resolver_filled_fields ?? {}).every((field) => field.status === "RESOLVER_FILLED_AFTER_BIND" && field.value === null && field.owner === "durable_binding_resolver"), "resolver fields must be empty until binding");
  check(stableStringify(document.one_shot_bind?.command_argv) === stableStringify(oneShotBindArgv()), "one-shot bind argv mismatch");
  check(stableStringify(document.checkpoint_resume?.command_argv) === stableStringify(checkpointResumeArgv()), "checkpoint resume argv mismatch");
  check(document.one_shot_bind.external_path_retained === false && document.checkpoint_resume.original_path_required === false, "source path retention contract mismatch");
  check(document.wrong_source_guard?.rejected_original_bytes_sha256 === rejectedSourceSha256 && document.wrong_source_guard?.reuse_allowed === false, "wrong-source guard mismatch");
  check(document.wrong_source_guard?.recovery_boundary_sha256 === sha256(recoveryBytes), "wrong-source recovery boundary hash mismatch");
  check(document.source_gate_contract?.blocker_fingerprint === contract.blocker_fingerprint, "blocker fingerprint contract mismatch");
  check(stableStringify(document.source_gate_contract?.legitimate_reopen_conditions) === stableStringify(contract.source_reopen_conditions), "source reopen conditions mismatch");
  check(document.source_gate_contract?.source_gate_reissued_after_bound_matching_vault === false && document.source_gate_contract?.densou_source_locator_missing_after_bound === false, "bound source gate closure mismatch");
  check(document.first_downstream_material?.portable_target_template === "packages/<binding_id>/noncanon-material.json" && document.first_downstream_material?.automatically_materialized_by_bind_source === true, "first downstream target mismatch");
  check(document.consumer_contract?.ready_for_direct_consumption === true && document.consumer_contract?.reject_legacy_receipt_reinterpretation === true && document.consumer_contract?.reject_synthetic_binding_as_actual === true, "consumer guard mismatch");
  check(document.authority_guard?.durable_contract_sha256 === sha256(contractBytes) && document.authority_guard?.sole_authoritative_record === "ignored_local_vault_binding_record", "durable authority guard mismatch");
  check(document.boundaries?.actual_source_found_by_this_preflight === false && document.boundaries?.synthetic_as_actual_or_canon === false && document.boundaries?.canon_inferred === false && document.boundaries?.rights_inferred === false && document.boundaries?.source_content_invented === false, "preflight boundary mismatch");
  check(!/[A-Za-z]:[\\/]/.test(preflightBytes.toString("utf8")), "preflight contains an absolute path");
  return {
    result: "PASS",
    artifact_id: document.artifact_id,
    semantic_role: document.semantic_role,
    actual_source_status: document.current_actual_source.status,
    check_count: checks,
    byte_size: preflightBytes.length,
    sha256: sha256(preflightBytes),
    source_question_emitted: false,
    first_downstream_target: document.first_downstream_material.portable_target_template
  };
}

async function commandMaterializeActualPreflight(options) {
  requireAllowedOptions(options, ["out"]);
  const output = portableArtifactOutput(options.out, "--out");
  const document = await actualSourcePreflightDocument(output.portablePath);
  const writeResult = await writeJsonOnceExact(output.absolutePath, document);
  const validation = await validateActualSourcePreflight(output.absolutePath);
  console.log(JSON.stringify({ ...validation, write_result: writeResult, portable_path: output.portablePath }, null, 2));
}

async function commandValidateActualPreflight(options) {
  requireAllowedOptions(options, ["preflight"]);
  const input = portableArtifactOutput(options.preflight, "--preflight");
  const validation = await validateActualSourcePreflight(input.absolutePath);
  console.log(JSON.stringify({ ...validation, portable_path: input.portablePath }, null, 2));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function firstBindGeneratorArgv() {
  return [
    "node",
    "tools/fff-densou-durable-source-binding.mjs",
    "generate-first-bind-downstream",
    "--binding-id",
    "<binding_id>"
  ];
}

function sourceIndependentFileNames() {
  return [
    "package-contract.json",
    "voice-input-template.json",
    "episode-seed-template.json",
    "render-handoff-template.json",
    "review.html"
  ];
}

function downstreamFileNames() {
  return [
    "binding-input.json",
    "voice-input.json",
    "episode-seed.json",
    "render-handoff.json",
    "review.html"
  ];
}

async function fileDescriptor(root, fileName) {
  const bytes = await readFile(path.join(root, fileName));
  return { path: fileName, byte_size: bytes.length, sha256: sha256(bytes) };
}

async function evidenceManifest(root, artifactId, fileNames, generatedAt) {
  const files = [];
  for (const fileName of fileNames) files.push(await fileDescriptor(root, fileName));
  files.sort((left, right) => left.path.localeCompare(right.path));
  return {
    schema_version: "fff.densou.closedPackageEvidenceManifest.v1",
    artifact_id: artifactId,
    generated_at: generatedAt,
    files
  };
}

async function verifyManifestClosure(root, artifactId, expectedFileNames) {
  const manifestPath = path.join(root, "evidence-manifest.json");
  const manifest = await readJson(manifestPath);
  requireCondition(manifest.schema_version === "fff.densou.closedPackageEvidenceManifest.v1", "PACKAGE_INVALID", "package manifest version mismatch", 5);
  requireCondition(manifest.artifact_id === artifactId, "PACKAGE_INVALID", "package manifest identity mismatch", 5);
  const expected = [...expectedFileNames, "evidence-manifest.json"].sort();
  const entries = await readdir(root, { withFileTypes: true });
  requireCondition(entries.every((entry) => entry.isFile()), "PACKAGE_INVALID", "closed package contains a nested directory", 5);
  const actual = entries.map((entry) => entry.name).sort();
  requireCondition(stableStringify(actual) === stableStringify(expected), "PACKAGE_INVALID", "package manifest closure mismatch", 5, { expected, actual });
  const recorded = [...manifest.files].sort((left, right) => left.path.localeCompare(right.path));
  requireCondition(stableStringify(recorded.map((entry) => entry.path)) === stableStringify([...expectedFileNames].sort()), "PACKAGE_INVALID", "manifest file list mismatch", 5);
  for (const entry of recorded) {
    const descriptor = await fileDescriptor(root, entry.path);
    requireCondition(descriptor.byte_size === entry.byte_size && descriptor.sha256 === entry.sha256, "PACKAGE_INVALID", `manifest hash mismatch: ${entry.path}`, 5);
  }
  const manifestBytes = await readFile(manifestPath);
  return {
    manifest,
    manifest_path: manifestPath,
    manifest_byte_size: manifestBytes.length,
    manifest_sha256: sha256(manifestBytes),
    closure_count: actual.length
  };
}

async function sourceIndependentDocuments() {
  const [preflight, preflightBytes, recoveryBytes] = await Promise.all([
    readJson(actualSourcePreflightPath),
    readFile(actualSourcePreflightPath),
    readFile(recoveryBoundaryPath)
  ]);
  requireCondition(sha256(preflightBytes) === actualSourcePreflightSha256, "PREDECESSOR_MISMATCH", "actual-source preflight predecessor hash mismatch", 5);
  await validateActualSourcePreflight(actualSourcePreflightPath);
  const rootPortable = portable(path.relative(repoRoot, sourceIndependentPackageRoot));
  const resumeArgv = firstBindGeneratorArgv();
  const packageContract = {
    schema_version: "fff.densou.firstBindDownstreamPackageContract.v1",
    artifact_id: sourceIndependentPackageId,
    contract_id: downstreamContractId,
    work_order_id: "FFF-DENSOU-SOURCE-INDEPENDENT-PACKAGE-CONTINUATION-20260811-003",
    classification: "EXECUTABLE_SOURCE_INDEPENDENT_DOWNSTREAM_PACKAGE",
    state: "PENDING_ACTUAL_SOURCE",
    semantic_role: semanticRole,
    predecessor: {
      path: portable(path.relative(repoRoot, actualSourcePreflightPath)),
      byte_size: preflightBytes.length,
      sha256: actualSourcePreflightSha256,
      artifact_id: preflight.artifact_id
    },
    binding_input_contract: {
      authority: "durable_binding_resolver_only",
      required_status: "BOUND",
      required_state: "MATERIALIZED",
      fields: ["binding_id", "original_bytes_sha256", "canonical_utf8_sha256", "byte_size", "revision_label", "canon_label", "portable_vault_locator"],
      absolute_source_path_allowed: false,
      legacy_receipt_reinterpretation_allowed: false
    },
    generator: {
      cli: "tools/fff-densou-durable-source-binding.mjs",
      command: "generate-first-bind-downstream",
      resume_command_argv: resumeArgv,
      resume_command: resumeArgv.join(" "),
      source_path_required_after_bind: false,
      output_root_template: ".local/densou-source-vault/v1/scopes/<scope>/downstream-packages/<artifact_id>"
    },
    output_shape: {
      files: downstreamFileNames().concat("evidence-manifest.json"),
      binding_input: "binding-input.json",
      voice_input: "voice-input.json",
      episode_seed: "episode-seed.json",
      render_handoff: "render-handoff.json",
      local_review: "review.html",
      evidence_manifest: "evidence-manifest.json"
    },
    guards: {
      wrong_source_recovery_path: portable(path.relative(repoRoot, recoveryBoundaryPath)),
      wrong_source_recovery_sha256: sha256(recoveryBytes),
      rejected_source_sha256: preflight.wrong_source_guard.rejected_original_bytes_sha256,
      synthetic_binding_allowed_as_actual: false,
      explicit_synthetic_consumer_proof_requires_flag: true,
      final_canon_allowed: false,
      source_question_emitted_when_pending: false,
      source_gate_reissued_after_bound_matching_vault: false,
      blocker_fingerprint: preflight.source_gate_contract.blocker_fingerprint,
      legitimate_reopen_conditions: preflight.source_gate_contract.legitimate_reopen_conditions
    },
    materialization: {
      package_root: rootPortable,
      voice_template: "voice-input-template.json",
      episode_template: "episode-seed-template.json",
      render_template: "render-handoff-template.json",
      review_surface: "review.html",
      direct_consumer_ready: true
    },
    boundaries: {
      actual_source_content_present: false,
      actual_revision_present: false,
      actual_canon_present: false,
      actual_rights_present: false,
      dummy_content_presented_as_product: false,
      synthetic_promoted_to_actual_or_canon: false,
      render_performed: false,
      publication_authorized: false
    }
  };
  const voiceTemplate = {
    schema_version: "fff.densou.firstBindVoiceInput.v1",
    artifact_id: "fff-densou-first-bind-voice-input-<binding_id_suffix>",
    state: "PENDING_ACTUAL_SOURCE",
    classification: "NONCANON_PENDING_ACTUAL_SOURCE",
    binding_id: null,
    source_sha256: null,
    units: [],
    ready_for_voice_generation: false,
    filled_only_by: "generate-first-bind-downstream",
    content_inference_allowed: false
  };
  const episodeTemplate = {
    schema_version: "fff.densou.firstBindEpisodeSeed.v1",
    artifact_id: "fff-densou-first-bind-episode-seed-<binding_id_suffix>",
    state: "PENDING_ACTUAL_SOURCE",
    classification: "NONCANON_PENDING_ACTUAL_SOURCE",
    binding_id: null,
    source_sha256: null,
    episode_id: null,
    title: null,
    source_units: [],
    authored_events: [],
    final_canon: false,
    filled_only_by: "generate-first-bind-downstream"
  };
  const renderTemplate = {
    schema_version: "fff.densou.firstBindRenderHandoff.v1",
    artifact_id: "fff-densou-first-bind-render-handoff-<binding_id_suffix>",
    state: "PENDING_ACTUAL_SOURCE",
    binding_id: null,
    render_ready: false,
    required_inputs: ["binding-input.json", "voice-input.json", "episode-seed.json"],
    human_gates: ["canon_selection", "voice_selection", "visual_direction", "production_approval"],
    source_question_required: false,
    publication_authorized: false
  };
  const reviewHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Densou first-bind downstream package</title><style>body{font-family:system-ui,sans-serif;max-width:900px;margin:40px auto;padding:0 20px;background:#10151d;color:#e9f0f7}code{background:#1d2632;padding:.15rem .35rem;border-radius:.25rem}.card{border:1px solid #405067;border-radius:12px;padding:18px;margin:16px 0}a{color:#8bc5ff}</style></head>
<body><h1>First-bind downstream package</h1><p><strong>State:</strong> PENDING_ACTUAL_SOURCE · NONCANON</p>
<div class="card"><h2>Executable continuation</h2><p>This package contains a real generator contract. It does not contain or imitate Densou source content.</p><p><code>${escapeHtml(resumeArgv.join(" "))}</code></p></div>
<div class="card"><h2>Closed inputs</h2><ul><li><a href="voice-input-template.json">voice input template</a></li><li><a href="episode-seed-template.json">episode seed template</a></li><li><a href="render-handoff-template.json">render handoff template</a></li><li><a href="evidence-manifest.json">evidence manifest</a></li></ul></div>
<div class="card"><h2>Guards</h2><p>Durable resolver only. No absolute source path. Wrong-source hash rejected. Synthetic material cannot become actual or canon. Render, production, rights clearance, publication, and human acceptance remain false.</p></div></body></html>
`;
  return { packageContract, voiceTemplate, episodeTemplate, renderTemplate, reviewHtml };
}

async function materializeSourceIndependentPackage() {
  const documents = await sourceIndependentDocuments();
  await writeJsonOnceExact(path.join(sourceIndependentPackageRoot, "package-contract.json"), documents.packageContract);
  await writeJsonOnceExact(path.join(sourceIndependentPackageRoot, "voice-input-template.json"), documents.voiceTemplate);
  await writeJsonOnceExact(path.join(sourceIndependentPackageRoot, "episode-seed-template.json"), documents.episodeTemplate);
  await writeJsonOnceExact(path.join(sourceIndependentPackageRoot, "render-handoff-template.json"), documents.renderTemplate);
  await writeBytesOnceExact(path.join(sourceIndependentPackageRoot, "review.html"), Buffer.from(documents.reviewHtml, "utf8"));
  const manifest = await evidenceManifest(sourceIndependentPackageRoot, sourceIndependentPackageId, sourceIndependentFileNames(), "2026-08-11");
  await writeJsonOnceExact(path.join(sourceIndependentPackageRoot, "evidence-manifest.json"), manifest);
  return validateSourceIndependentPackage();
}

async function validateSourceIndependentPackage() {
  const [preflightBytes, contract, voice, episode, render] = await Promise.all([
    readFile(actualSourcePreflightPath),
    readJson(path.join(sourceIndependentPackageRoot, "package-contract.json")),
    readJson(path.join(sourceIndependentPackageRoot, "voice-input-template.json")),
    readJson(path.join(sourceIndependentPackageRoot, "episode-seed-template.json")),
    readJson(path.join(sourceIndependentPackageRoot, "render-handoff-template.json"))
  ]);
  let checks = 0;
  const check = (condition, message) => {
    checks += 1;
    requireCondition(condition, "PACKAGE_INVALID", message, 5);
  };
  check(sha256(preflightBytes) === actualSourcePreflightSha256, "predecessor hash mismatch");
  check(contract.artifact_id === sourceIndependentPackageId && contract.contract_id === downstreamContractId, "package identity mismatch");
  check(contract.state === "PENDING_ACTUAL_SOURCE" && contract.semantic_role === semanticRole, "pending source state mismatch");
  check(contract.binding_input_contract?.authority === "durable_binding_resolver_only" && contract.binding_input_contract?.absolute_source_path_allowed === false, "resolver input contract mismatch");
  check(stableStringify(contract.generator?.resume_command_argv) === stableStringify(firstBindGeneratorArgv()), "resume command mismatch");
  check(contract.generator?.source_path_required_after_bind === false, "resume may not require source path");
  check(contract.guards?.rejected_source_sha256 === "256837a94afd521cadfcb676da2c3873a914ce95f11f493d5b60e15bc42f9a32", "wrong-source guard mismatch");
  check(contract.guards?.synthetic_binding_allowed_as_actual === false && contract.guards?.source_question_emitted_when_pending === false, "synthetic or source-question guard mismatch");
  check(contract.guards?.source_gate_reissued_after_bound_matching_vault === false && contract.guards?.blocker_fingerprint === "<binding_id>|actual_densou_original|<condition>", "source gate closure mismatch");
  check(voice.state === "PENDING_ACTUAL_SOURCE" && voice.classification === "NONCANON_PENDING_ACTUAL_SOURCE" && voice.units.length === 0 && voice.ready_for_voice_generation === false, "voice template state mismatch");
  check(episode.state === "PENDING_ACTUAL_SOURCE" && episode.classification === "NONCANON_PENDING_ACTUAL_SOURCE" && episode.source_units.length === 0 && episode.authored_events.length === 0 && episode.final_canon === false, "episode template state mismatch");
  check(render.state === "PENDING_ACTUAL_SOURCE" && render.render_ready === false && render.source_question_required === false && render.publication_authorized === false, "render template state mismatch");
  check(contract.boundaries?.dummy_content_presented_as_product === false && contract.boundaries?.synthetic_promoted_to_actual_or_canon === false && contract.boundaries?.render_performed === false, "package boundary mismatch");
  const closure = await verifyManifestClosure(sourceIndependentPackageRoot, sourceIndependentPackageId, sourceIndependentFileNames());
  check(closure.closure_count === 6, "package closure count mismatch");
  let combined = "";
  for (const fileName of sourceIndependentFileNames().concat("evidence-manifest.json")) combined += await readFile(path.join(sourceIndependentPackageRoot, fileName), "utf8");
  check(!/[A-Za-z]:[\\/]/.test(combined), "closed package contains an absolute path");
  check(!/https?:\/\//i.test(await readFile(path.join(sourceIndependentPackageRoot, "review.html"), "utf8")), "review surface contains an external URL");
  return {
    result: "PASS",
    artifact_id: sourceIndependentPackageId,
    state: contract.state,
    check_count: checks,
    package_root: portable(path.relative(repoRoot, sourceIndependentPackageRoot)),
    manifest_sha256: closure.manifest_sha256,
    manifest_byte_size: closure.manifest_byte_size,
    closure_count: closure.closure_count,
    source_question_emitted: false,
    resume_command: contract.generator.resume_command
  };
}

function sourceLineUnits(lines, bindingId, sourceHash) {
  return lines.map((text, index) => ({
    unit_id: `source-line-${String(index + 1).padStart(4, "0")}`,
    text,
    text_sha256: sha256(Buffer.from(text, "utf8")),
    source_ref: {
      binding_id: bindingId,
      original_bytes_sha256: sourceHash,
      source_line_index: index + 1
    },
    status: "NONCANON_SOURCE_DERIVED_INPUT"
  }));
}

function downstreamIdentity(record) {
  const suffix = record.binding_id.slice(-20);
  return record.synthetic_fixture
    ? `fff-densou-first-bind-downstream-consumer-proof-${suffix}`
    : `fff-densou-first-bind-downstream-${suffix}`;
}

async function downstreamContext(options) {
  requireCondition(options.binding_id, "INVALID_ARGUMENT", "--binding-id is required", 2);
  const contractValidation = await validateSourceIndependentPackage();
  const resolved = await resolveBinding({ binding_id: options.binding_id, scope: options.scope });
  requireCondition(stateAtLeast(resolved.record, "MATERIALIZED"), "BINDING_NOT_MATERIALIZED", "binding must reach MATERIALIZED before downstream generation", 6);
  const sourcePackageRoot = path.join(resolved.context.scopeRoot, ...packageRelativeRoot(resolved.record.binding_id).split("/"));
  const sourcePackage = await verifyPackage(resolved, sourcePackageRoot);
  const substantive = sourcePackage.material.substantive_fixture_derived_material ?? sourcePackage.material.substantive_source_derived_material;
  requireCondition(substantive?.source_lines?.length > 0, "MATERIAL_INVALID", "source-bound material has no exact source lines", 5);
  const allowSynthetic = options.allow_synthetic_example === "true";
  if (options.allow_synthetic_example !== undefined) requireCondition(["true", "false"].includes(options.allow_synthetic_example), "INVALID_ARGUMENT", "--allow-synthetic-example must be true or false", 2);
  if (resolved.record.synthetic_fixture) requireCondition(allowSynthetic, "SYNTHETIC_BINDING_REJECTED", "synthetic binding requires explicit consumer-proof flag and cannot be actual", 6);
  requireCondition(resolved.record.original_bytes_sha256 !== "256837a94afd521cadfcb676da2c3873a914ce95f11f493d5b60e15bc42f9a32", "REJECTED", "wrong-source hash remains quarantined", 4);
  const artifactId = downstreamIdentity(resolved.record);
  const outputRoot = path.join(resolved.context.scopeRoot, "downstream-packages", artifactId);
  return { ...resolved, sourcePackage, substantive, allowSynthetic, artifactId, outputRoot, contractValidation };
}

async function downstreamDocuments(context) {
  const { record, substantive, artifactId } = context;
  const classification = record.synthetic_fixture ? "NONCANON_SYNTHETIC_CONSUMER_PROOF" : "NONCANON_PENDING_HUMAN_CANON";
  const units = sourceLineUnits(substantive.source_lines, record.binding_id, record.original_bytes_sha256);
  const bindingInput = {
    schema_version: "fff.densou.firstBindResolvedInput.v1",
    artifact_id: `${artifactId}-binding-input`,
    classification,
    binding_id: record.binding_id,
    semantic_role: record.semantic_role,
    status: record.status,
    state: record.state,
    original_bytes_sha256: record.original_bytes_sha256,
    canonical_utf8_sha256: record.canonical_utf8_sha256,
    byte_size: record.byte_size,
    revision_label: record.revision_label,
    canon_label: record.canon_label,
    provenance_assertion: record.provenance_assertion,
    rights_assertion: record.rights_assertion,
    portable_vault_locator: record.portable_vault_locator,
    absolute_source_path_present: false,
    source_question_reopened: false,
    synthetic_fixture: record.synthetic_fixture
  };
  const voiceInput = {
    schema_version: "fff.densou.firstBindVoiceInput.v1",
    artifact_id: `${artifactId}-voice-input`,
    state: classification,
    classification,
    binding_id: record.binding_id,
    source_sha256: record.original_bytes_sha256,
    units,
    ready_for_voice_generation: false,
    exact_source_text_only: true,
    dialogue_or_narration_inferred: false,
    final_voice_selected: false
  };
  const episodeSeed = {
    schema_version: "fff.densou.firstBindEpisodeSeed.v1",
    artifact_id: `${artifactId}-episode-seed`,
    state: classification,
    classification,
    binding_id: record.binding_id,
    source_sha256: record.original_bytes_sha256,
    episode_id: null,
    title: null,
    source_units: units,
    authored_events: [],
    inferred_canon_claims: [],
    final_canon: false
  };
  const renderHandoff = {
    schema_version: "fff.densou.firstBindRenderHandoff.v1",
    artifact_id: `${artifactId}-render-handoff`,
    state: classification,
    binding_id: record.binding_id,
    render_ready: false,
    materialized_inputs: ["binding-input.json", "voice-input.json", "episode-seed.json"],
    blocked_on_human_only: ["episode_structure", "canon_selection", "voice_selection", "visual_direction", "production_approval"],
    source_binding_closed: true,
    source_question_reopened: false,
    publication_authorized: false
  };
  const lineItems = units.map((unit) => `<li><code>${escapeHtml(unit.unit_id)}</code> ${escapeHtml(unit.text)}</li>`).join("");
  const reviewHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(artifactId)}</title><style>body{font-family:system-ui,sans-serif;max-width:960px;margin:36px auto;padding:0 20px;background:#111722;color:#edf3fa}.badge{display:inline-block;padding:.25rem .55rem;border-radius:999px;background:#5b2648}.card{border:1px solid #435168;border-radius:12px;padding:18px;margin:16px 0}code{color:#9bd1ff}li{margin:.55rem 0}</style></head><body>
<h1>First-bind downstream consumer proof</h1><p class="badge">${escapeHtml(classification)}</p>
<div class="card"><h2>Binding</h2><p><code>${escapeHtml(record.binding_id)}</code></p><p>SHA-256 <code>${escapeHtml(record.original_bytes_sha256)}</code></p><p>Source locator gate reopened: <strong>no</strong></p></div>
<div class="card"><h2>Exact source-derived input units</h2><ol>${lineItems}</ol></div>
<div class="card"><h2>Closed gates</h2><p>Episode structure, canon, voice, visual direction, render, production, rights clearance, publication, and human acceptance remain unresolved. This local package is not actual Densou when labeled synthetic.</p></div>
</body></html>
`;
  return { bindingInput, voiceInput, episodeSeed, renderHandoff, reviewHtml, classification, units };
}

async function generateFirstBindDownstream(options) {
  requireAllowedOptions(options, ["binding_id", "scope", "allow_synthetic_example"]);
  const context = await downstreamContext(options);
  const documents = await downstreamDocuments(context);
  await writeJsonOnceExact(path.join(context.outputRoot, "binding-input.json"), documents.bindingInput);
  await writeJsonOnceExact(path.join(context.outputRoot, "voice-input.json"), documents.voiceInput);
  await writeJsonOnceExact(path.join(context.outputRoot, "episode-seed.json"), documents.episodeSeed);
  await writeJsonOnceExact(path.join(context.outputRoot, "render-handoff.json"), documents.renderHandoff);
  await writeBytesOnceExact(path.join(context.outputRoot, "review.html"), Buffer.from(documents.reviewHtml, "utf8"));
  const manifest = await evidenceManifest(context.outputRoot, context.artifactId, downstreamFileNames(), context.record.materialized_at);
  await writeJsonOnceExact(path.join(context.outputRoot, "evidence-manifest.json"), manifest);
  return validateFirstBindDownstream(options);
}

async function validateFirstBindDownstream(options) {
  requireAllowedOptions(options, ["binding_id", "scope", "allow_synthetic_example"]);
  const context = await downstreamContext(options);
  const [bindingInput, voiceInput, episodeSeed, renderHandoff] = await Promise.all([
    readJson(path.join(context.outputRoot, "binding-input.json")),
    readJson(path.join(context.outputRoot, "voice-input.json")),
    readJson(path.join(context.outputRoot, "episode-seed.json")),
    readJson(path.join(context.outputRoot, "render-handoff.json"))
  ]);
  let checks = 0;
  const check = (condition, message) => {
    checks += 1;
    requireCondition(condition, "DOWNSTREAM_PACKAGE_INVALID", message, 5);
  };
  check(bindingInput.binding_id === context.record.binding_id && bindingInput.original_bytes_sha256 === context.record.original_bytes_sha256, "binding input identity mismatch");
  check(bindingInput.absolute_source_path_present === false && bindingInput.source_question_reopened === false, "binding input path or question guard mismatch");
  check(voiceInput.binding_id === context.record.binding_id && voiceInput.source_sha256 === context.record.original_bytes_sha256, "voice input binding mismatch");
  check(episodeSeed.binding_id === context.record.binding_id && episodeSeed.source_sha256 === context.record.original_bytes_sha256, "episode seed binding mismatch");
  check(stableStringify(voiceInput.units) === stableStringify(episodeSeed.source_units), "voice and episode source units differ");
  check(stableStringify(voiceInput.units.map((unit) => unit.text)) === stableStringify(context.substantive.source_lines), "consumer output does not exactly match bound source lines");
  check(voiceInput.dialogue_or_narration_inferred === false && voiceInput.ready_for_voice_generation === false, "voice inference or readiness boundary mismatch");
  check(episodeSeed.episode_id === null && episodeSeed.title === null && episodeSeed.authored_events.length === 0 && episodeSeed.inferred_canon_claims.length === 0 && episodeSeed.final_canon === false, "episode noncanon guard mismatch");
  check(renderHandoff.render_ready === false && renderHandoff.source_binding_closed === true && renderHandoff.source_question_reopened === false && renderHandoff.publication_authorized === false, "render handoff guard mismatch");
  check(context.record.synthetic_fixture ? bindingInput.classification === "NONCANON_SYNTHETIC_CONSUMER_PROOF" : bindingInput.classification === "NONCANON_PENDING_HUMAN_CANON", "synthetic/canon classification mismatch");
  const closure = await verifyManifestClosure(context.outputRoot, context.artifactId, downstreamFileNames());
  check(closure.closure_count === 6, "downstream package closure count mismatch");
  let combined = "";
  for (const fileName of downstreamFileNames().concat("evidence-manifest.json")) combined += await readFile(path.join(context.outputRoot, fileName), "utf8");
  check(!/[A-Za-z]:[\\/]/.test(combined), "downstream package contains an absolute path");
  check(!/https?:\/\//i.test(await readFile(path.join(context.outputRoot, "review.html"), "utf8")), "downstream review contains an external URL");
  return {
    result: "PASS",
    artifact_id: context.artifactId,
    classification: bindingInput.classification,
    binding_id: context.record.binding_id,
    source_sha256: context.record.original_bytes_sha256,
    source_unit_count: voiceInput.units.length,
    check_count: checks,
    package_root: portable(path.relative(context.context.scopeRoot, context.outputRoot)),
    manifest_sha256: closure.manifest_sha256,
    manifest_byte_size: closure.manifest_byte_size,
    closure_count: closure.closure_count,
    local_review: portable(path.relative(context.context.scopeRoot, path.join(context.outputRoot, "review.html"))),
    source_question_reopened: false,
    render_ready: false
  };
}

async function commandMaterializeSourceIndependentPackage(options) {
  requireAllowedOptions(options, []);
  console.log(JSON.stringify(await materializeSourceIndependentPackage(), null, 2));
}

async function commandValidateSourceIndependentPackage(options) {
  requireAllowedOptions(options, []);
  console.log(JSON.stringify(await validateSourceIndependentPackage(), null, 2));
}

async function commandGenerateFirstBindDownstream(options) {
  console.log(JSON.stringify(await generateFirstBindDownstream(options), null, 2));
}

async function commandValidateFirstBindDownstream(options) {
  console.log(JSON.stringify(await validateFirstBindDownstream(options), null, 2));
}

function printHelp() {
  console.log(`Densou durable source binding v1

Commands:
  bind-source --path <one-time-path> --revision <explicit> --canon-label <explicit> --provenance-assertion <explicit> --rights-assertion <explicit> [--scope <portable-scope>]
  status [--scope <portable-scope>] [--binding-id <binding-id>] [--revision <explicit>] [--canon-label <explicit>]
  verify --binding-id <binding-id> [--scope <portable-scope>]
  init --binding-id <binding-id> [--scope <portable-scope>]
  resume --binding-id <binding-id> [--scope <portable-scope>]
  materialize --binding-id <binding-id> [--scope <portable-scope>] [--require-resource <path>]
  materialize-actual-preflight --out <artifacts/.../preflight.json>
  validate-actual-preflight --preflight <artifacts/.../preflight.json>
  materialize-source-independent-package
  validate-source-independent-package
  generate-first-bind-downstream --binding-id <binding-id> [--scope <portable-scope>] [--allow-synthetic-example true]
  validate-first-bind-downstream --binding-id <binding-id> [--scope <portable-scope>] [--allow-synthetic-example true]

The external source path is accepted only by bind-source and is never stored.`);
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));
  if (command === "bind-source") return bindSource(options);
  if (command === "status") return commandStatus(options);
  if (command === "verify") return commandVerify(options);
  if (command === "init") return commandInit(options);
  if (command === "resume") return commandResume(options);
  if (command === "materialize") return commandMaterialize(options);
  if (command === "materialize-actual-preflight") return commandMaterializeActualPreflight(options);
  if (command === "validate-actual-preflight") return commandValidateActualPreflight(options);
  if (command === "materialize-source-independent-package") return commandMaterializeSourceIndependentPackage(options);
  if (command === "validate-source-independent-package") return commandValidateSourceIndependentPackage(options);
  if (command === "generate-first-bind-downstream") return commandGenerateFirstBindDownstream(options);
  if (command === "validate-first-bind-downstream") return commandValidateFirstBindDownstream(options);
  if (command === "help" || command === "--help" || command === "-h") return printHelp();
  throw new BindingError("INVALID_COMMAND", `unknown command: ${command}`, 2);
}

await main().catch((error) => {
  const stateCode = error instanceof BindingError ? error.stateCode : "UNEXPECTED_FAILURE";
  const exitCode = error instanceof BindingError ? error.exitCode : 1;
  const details = error instanceof BindingError ? error.details : {};
  console.error(JSON.stringify({ result: "FAIL", state_code: stateCode, error: error.message, ...details }, null, 2));
  process.exitCode = exitCode;
});
