#!/usr/bin/env node

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SCHEMA_VERSION = "fff.projectState.v1";
const EXTRACTION_SCHEMA_VERSION = "fff.extractionContract.v1";
const ROUTING_POLICY_REGRESSION_SCHEMA_VERSION = "fff.routingPolicyRegression.v1";
const BROAD_SPAN_SPLIT_SCHEMA_VERSION = "fff.broadSpanSplit.v1";
const WEAK_SPAN_REPAIR_SCHEMA_VERSION = "fff.weakSpanRepair.v1";
const MISSING_FIXTURE_CLASS_PROBE_SCHEMA_VERSION = "fff.missingFixtureClassProbe.v1";
const MALFORMED_MISSING_SPAN_GUARD_SCHEMA_VERSION = "fff.malformedMissingSpanGuard.v1";
const CONTRADICTORY_CLAIM_GUARD_SCHEMA_VERSION = "fff.contradictoryClaimGuard.v1";
const DOWNSTREAM_SOURCE_SPAN_ADOPTION_GATE_SCHEMA_VERSION = "fff.downstreamSourceSpanAdoptionGate.v1";
const PROVIDER_ENVELOPE_READINESS_NO_CALL_SCHEMA_VERSION = "fff.providerEnvelopeReadinessNoCall.v1";
const DEFAULT_OUTPUT = "artifacts/current-project-state.json";
const DEFAULT_EXTRACTION_FIXTURE_SMOKE_OUTPUT = "artifacts/extraction-validator-smoke-result.json";
const DEFAULT_ROUTING_POLICY_REGRESSION_OUTPUT = "artifacts/routing-policy-regression-hardening-result.json";
const DEFAULT_BROAD_SPAN_SPLIT_OUTPUT = "artifacts/broad-span-split-result.json";
const DEFAULT_WEAK_SPAN_REPAIR_OUTPUT = "artifacts/weak-span-repair-result.json";
const DEFAULT_MISSING_FIXTURE_CLASS_PROBE_OUTPUT = "artifacts/missing-fixture-class-probe-result.json";
const DEFAULT_MALFORMED_MISSING_SPAN_GUARD_OUTPUT = "artifacts/malformed-missing-span-guard-result.json";
const DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT = "artifacts/contradictory-claim-guard-result.json";
const DEFAULT_DOWNSTREAM_SOURCE_SPAN_ADOPTION_GATE_OUTPUT = "artifacts/downstream-source-span-adoption-gate-result.json";
const DEFAULT_PROVIDER_ENVELOPE_READINESS_NO_CALL_OUTPUT = "artifacts/provider-envelope-readiness-no-call-result.json";

const REVIEW_STATUSES = ["adopt", "provisional", "hold", "reject"];
const RISK_LEVELS = ["low", "medium", "high"];
const EXTRACTION_TARGET_DESTINATIONS = ["profile", "claim", "timeline", "source_reference", "unresolved_decision"];
const HUMAN_OWNED_DEPENDENCIES = ["Toma fate", "brass moth truth", "Council motive"];

const REQUIRED_FIELDS = [
  "schemaVersion",
  "project",
  "work",
  "rawMemo",
  "extractedCandidates",
  "reviewStatuses",
  "unresolvedCreativeDecisions",
  "taskCards",
  "qaGateResults",
  "generatedOutlines",
  "decisionLog"
];

const CLAIM_REQUIRED_FIELDS = [
  "id",
  "claimText",
  "claimScope",
  "worldTruthStatus",
  "realityStatus",
  "sourceRefs",
  "subjectRefs",
  "speakerOrNarratorRef",
  "viewerDisclosureStatus",
  "spoilerLevel",
  "canonRisk",
  "unresolvedDependencies",
  "supportsClaimIds",
  "contradictsClaimIds",
  "reviewStatus",
  "notes"
];

const TIMELINE_REQUIRED_FIELDS = [
  "id",
  "title",
  "summary",
  "timelineAxis",
  "storyOrder",
  "calendarTime",
  "calendarPrecision",
  "viewerDisclosureOrder",
  "viewerDisclosureStatus",
  "productionOrder",
  "historicalReferenceTime",
  "linkedClaimIds",
  "linkedProfileIds",
  "linkedWorkIds",
  "unresolvedDependencies",
  "spoilerLevel",
  "canonRisk",
  "reviewStatus",
  "sourceRefs",
  "notes"
];

const PROFILE_REQUIRED_FIELDS = [
  "id",
  "displayName",
  "aliases",
  "profileType",
  "profileStatus",
  "ghostNodeStatus",
  "worldStatus",
  "realityStatus",
  "firstAppearanceWorkId",
  "linkedClaimIds",
  "linkedTimelineEntryIds",
  "relatedProfileIds",
  "unresolvedDependencies",
  "knownBy",
  "unknownBy",
  "believedBy",
  "misunderstoodBy",
  "ownedItems",
  "sourceRefs",
  "assetRefs",
  "canonRisk",
  "spoilerLevel",
  "reviewStatus",
  "notes"
];

const REQUIRED_PROFILE_TYPES = [
  "person",
  "place",
  "organization",
  "event",
  "object",
  "concept",
  "document",
  "visual_asset",
  "placeholder"
];

const REQUIRED_GHOST_NODE_STATUSES = [
  "extracted_candidate",
  "provisional_profile",
  "adopted_profile",
  "held_ghost",
  "rejected_candidate",
  "needs_human_decision"
];

const EXTRACTION_CONTRACT_REQUIRED_FIELDS = [
  "extractionRunId",
  "schemaVersion",
  "sourceDraftId",
  "sourceMemoRef",
  "sourceRefs",
  "generatedAt",
  "generatorType",
  "generatorLabel",
  "extractionMode",
  "confidencePolicy",
  "extractedElements",
  "profileCandidates",
  "claimCandidates",
  "timelineEntryCandidates",
  "unresolvedDependencies",
  "reviewSafeDefaults",
  "decisionLogSafeMetadata",
  "warnings",
  "unknownFieldsPolicy",
  "humanAuthorityBoundaries",
  "notes"
];

const EXTRACTION_ELEMENT_REQUIRED_FIELDS = [
  "id",
  "displayText",
  "elementType",
  "aliases",
  "sourceSpan",
  "sourceRefIds",
  "confidence",
  "suggestedReviewStatus",
  "reviewStatus",
  "unresolvedDependencies",
  "canonRisk",
  "spoilerLevel",
  "targetDestinations",
  "notes"
];

const REQUIRED_EXTRACTION_ELEMENT_TYPES = [
  "person",
  "place",
  "organization",
  "event",
  "object",
  "concept",
  "document",
  "visual_asset",
  "placeholder",
  "source_reference",
  "unresolved_decision"
];


const REVIEW_SAFE_DEFAULT_FIELDS = [
  "defaultReviewStatus",
  "allowAdopt",
  "allowProvisional",
  "allowReject",
  "autoCanonPromotion",
  "autoChronologyPromotion",
  "unknownSourceHandling"
];

const DECISION_LOG_SAFE_FIELDS = [
  "owner",
  "statusVocabulary",
  "fixedPhraseRequired",
  "freeformReviewAllowed",
  "reversibleActionsOnly"
];

const HUMAN_OWNED_DECISIONS = ["Toma fate", "brass moth truth", "Council motive"];

const EXTRACTION_FIXTURE_EXPECTATIONS = {
  "valid-minimal.json": {
    expectedValid: true,
    expectedWarnings: ["unknown top-level field"]
  },
  "missing-source-refs.json": {
    expectedValid: false,
    expectedErrors: ["sourceRefIds must reference at least one source ref"]
  },
  "malformed-missing-source-span.json": {
    expectedValid: false,
    expectedErrors: [
      "missing sourceSpan",
      "sourceSpan.start must be a non-negative integer",
      "sourceSpan.text must be a non-empty string",
      "sourceSpan.end must be greater than sourceSpan.start"
    ]
  },
  "contradictory-claim-hold.json": {
    expectedValid: true
  },
  "overconfident-human-owned-decision.json": {
    expectedValid: false,
    expectedErrors: ["human-owned decision", "must not suggest adopt"]
  },
  "invalid-routing-visual-asset-to-claim.json": {
    expectedValid: false,
    expectedErrors: ["visual_asset must not route directly to Claim Ledger"]
  },
  "auto-canon-leak.json": {
    expectedValid: false,
    expectedErrors: [
      "reviewSafeDefaults.defaultReviewStatus must not be adopt",
      "reviewSafeDefaults.autoCanonPromotion must be false",
      "reviewSafeDefaults.unknownSourceHandling must preserve unknown fields and hold candidates"
    ]
  },
  "missing-review-safe-defaults.json": {
    expectedValid: false,
    expectedErrors: ["reviewSafeDefaults must be an object"]
  },
  "unknown-fields-preservation.json": {
    expectedValid: true,
    expectedWarnings: ["unknown top-level field"]
  }
};

async function main() {
  const [command, inputPath, outputPath] = process.argv.slice(2);

  if (!command || command === "help" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (!inputPath) {
    fail("Missing input JSON path or fixture directory.");
  }

  if (command === "validate-extraction-fixtures" || command === "smoke-extraction-fixtures") {
    const matrix = await validateExtractionFixtures(inputPath);
    const target = outputPath || DEFAULT_EXTRACTION_FIXTURE_SMOKE_OUTPUT;
    if (command === "smoke-extraction-fixtures" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(matrix, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(matrix, null, 2));
    }
    if (!matrix.passed) {
      fail(`Extraction fixture matrix failed: ${matrix.failures.join("; ")}`);
    }
    if (command === "smoke-extraction-fixtures" || outputPath) {
      console.log(`extraction fixture smoke passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-extraction") {
    const payload = await readJson(inputPath);
    const validation = validateExtractionPayload(payload);
    if (!validation.ok) {
      fail(`Invalid extraction payload: ${validation.errors.join("; ")}`);
    }
    console.log(`valid extraction ${inputPath}`);
    printWarnings(validation.warnings);
    return;
  }

  if (command === "validate-routing-policy" || command === "smoke-routing-policy") {
    const resolution = await readJson(inputPath);
    const regression = await validateRoutingPolicyRegression(resolution, inputPath);
    const target = outputPath || DEFAULT_ROUTING_POLICY_REGRESSION_OUTPUT;
    if (command === "smoke-routing-policy" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(regression, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(regression, null, 2));
    }
    if (!regression.passed) {
      fail(`Routing policy regression failed: ${regression.failures.join("; ")}`);
    }
    if (command === "smoke-routing-policy" || outputPath) {
      console.log(`routing policy regression passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-broad-span-split" || command === "smoke-broad-span-split") {
    const audit = await readJson(inputPath);
    const result = await validateBroadSpanSplit(audit, inputPath);
    const target = outputPath || DEFAULT_BROAD_SPAN_SPLIT_OUTPUT;
    if (command === "smoke-broad-span-split" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Broad-span split failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-broad-span-split" || outputPath) {
      console.log(`broad-span split passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-weak-span-repair" || command === "smoke-weak-span-repair") {
    const audit = await readJson(inputPath);
    const result = await validateWeakSpanRepair(audit, inputPath);
    const target = outputPath || DEFAULT_WEAK_SPAN_REPAIR_OUTPUT;
    if (command === "smoke-weak-span-repair" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Weak-span repair failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-weak-span-repair" || outputPath) {
      console.log(`weak-span repair passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-missing-fixture-class-probe" || command === "smoke-missing-fixture-class-probe") {
    const smoke = await readJson(inputPath);
    const result = await validateMissingFixtureClassProbe(smoke, inputPath);
    const target = outputPath || DEFAULT_MISSING_FIXTURE_CLASS_PROBE_OUTPUT;
    if (command === "smoke-missing-fixture-class-probe" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Missing fixture class probe failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-missing-fixture-class-probe" || outputPath) {
      console.log(`missing fixture class probe passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-malformed-missing-span-guard" || command === "smoke-malformed-missing-span-guard") {
    const smoke = await readJson(inputPath);
    const result = await validateMalformedMissingSpanGuard(smoke, inputPath);
    const target = outputPath || DEFAULT_MALFORMED_MISSING_SPAN_GUARD_OUTPUT;
    if (command === "smoke-malformed-missing-span-guard" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Malformed/missing source-span guard failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-malformed-missing-span-guard" || outputPath) {
      console.log(`malformed/missing source-span guard passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-contradictory-claim-guard" || command === "smoke-contradictory-claim-guard") {
    const smoke = await readJson(inputPath);
    const result = await validateContradictoryClaimGuard(smoke, inputPath);
    const target = outputPath || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT;
    if (command === "smoke-contradictory-claim-guard" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Contradictory claim guard failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-contradictory-claim-guard" || outputPath) {
      console.log(`contradictory claim guard passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-downstream-source-span-adoption-gate" || command === "smoke-downstream-source-span-adoption-gate") {
    const sourcePack = await readJson(inputPath);
    const result = await validateDownstreamSourceSpanAdoptionGate(sourcePack, inputPath);
    const target = outputPath || DEFAULT_DOWNSTREAM_SOURCE_SPAN_ADOPTION_GATE_OUTPUT;
    if (command === "smoke-downstream-source-span-adoption-gate" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Downstream source-span adoption gate failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-downstream-source-span-adoption-gate" || outputPath) {
      console.log(`downstream source-span adoption gate passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-provider-envelope-readiness-no-call" || command === "smoke-provider-envelope-readiness-no-call") {
    const envelope = await readJson(inputPath);
    const result = await validateProviderEnvelopeReadinessNoCall(envelope, inputPath);
    const target = outputPath || DEFAULT_PROVIDER_ENVELOPE_READINESS_NO_CALL_OUTPUT;
    if (command === "smoke-provider-envelope-readiness-no-call" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Provider envelope readiness no-call gate failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-provider-envelope-readiness-no-call" || outputPath) {
      console.log(`provider envelope readiness no-call gate passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "summarize-extraction") {
    const payload = await readJson(inputPath);
    const validation = validateExtractionPayload(payload);
    if (!validation.ok) {
      fail(`Invalid extraction payload: ${validation.errors.join("; ")}`);
    }
    console.log(JSON.stringify(validation.summary, null, 2));
    printWarnings(validation.warnings);
    return;
  }

  if (command === "validate") {
    const state = await readJson(inputPath);
    const validation = validateState(state);
    if (!validation.ok) {
      fail(`Invalid state: ${validation.errors.join("; ")}`);
    }
    console.log(`valid ${inputPath}`);
    return;
  }

  if (command === "summarize") {
    const state = await readJson(inputPath);
    const validation = validateState(state);
    if (!validation.ok) {
      fail(`Invalid state: ${validation.errors.join("; ")}`);
    }
    console.log(JSON.stringify(summarizeState(state), null, 2));
    return;
  }

  if (command === "normalize") {
    const state = await readJson(inputPath);
    const validation = validateState(state);
    if (!validation.ok) {
      fail(`Invalid state: ${validation.errors.join("; ")}`);
    }
    const target = outputPath || DEFAULT_OUTPUT;
    const normalized = normalizeState(state);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
    console.log(`normalized ${inputPath} -> ${target}`);
    return;
  }

  fail(`Unknown command: ${command}`);
}

async function readJson(inputPath) {
  let text;
  try {
    text = await readFile(inputPath, "utf8");
  } catch (error) {
    throw new Error(`Cannot read ${inputPath}: ${error.message}`);
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid JSON in ${inputPath}: ${error.message}`);
  }
}

async function validateExtractionFixtures(fixtureDir) {
  let entries;
  try {
    entries = await readdir(fixtureDir, { withFileTypes: true });
  } catch (error) {
    fail(`Cannot read fixture directory ${fixtureDir}: ${error.message}`);
  }

  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort();
  const expectedFiles = Object.keys(EXTRACTION_FIXTURE_EXPECTATIONS).sort();
  const missingExpectedFiles = expectedFiles.filter((name) => !files.includes(name));
  const unexpectedFiles = files.filter((name) => !(name in EXTRACTION_FIXTURE_EXPECTATIONS));
  const results = [];

  for (const fileName of files) {
    const filePath = path.join(fixtureDir, fileName);
    const payload = await readJson(filePath);
    const validation = validateExtractionPayload(payload);
    const expectation = EXTRACTION_FIXTURE_EXPECTATIONS[fileName] || { expectedValid: true };
    const errorMatches = (expectation.expectedErrors || []).map((text) => ({
      text,
      matched: validation.errors.some((error) => error.includes(text))
    }));
    const warningMatches = (expectation.expectedWarnings || []).map((text) => ({
      text,
      matched: validation.warnings.some((warning) => warning.includes(text))
    }));
    const passed =
      validation.ok === expectation.expectedValid &&
      errorMatches.every((match) => match.matched) &&
      warningMatches.every((match) => match.matched);

    results.push({
      fixture: fileName,
      expected: expectation.expectedValid ? "valid" : "invalid",
      actual: validation.ok ? "valid" : "invalid",
      passed,
      expectedErrorMatches: errorMatches,
      expectedWarningMatches: warningMatches,
      errors: validation.errors,
      warnings: validation.warnings,
      summary: validation.summary
    });
  }

  const validMinimalPath = path.join(fixtureDir, "valid-minimal.json");
  const builtInGuardResults = files.includes("valid-minimal.json")
    ? await validateExtractionBuiltInGuards(validMinimalPath)
    : [];

  const failures = [];
  for (const missing of missingExpectedFiles) {
    failures.push(`missing expected fixture ${missing}`);
  }
  for (const unexpected of unexpectedFiles) {
    failures.push(`unexpected fixture ${unexpected}`);
  }
  for (const result of results) {
    if (!result.passed) {
      failures.push(`${result.fixture} expected ${result.expected} but validator reported ${result.actual}`);
    }
  }
  for (const result of builtInGuardResults) {
    if (!result.passed) {
      failures.push(`${result.guard} did not trigger expected validator error`);
    }
  }

  return {
    artifact_id: "fff-extraction-validator-hardening-001",
    fixtureDirectory: fixtureDir,
    generatedAt: new Date().toISOString(),
    passed: failures.length === 0,
    failures,
    summary: {
      total: results.length,
      matched: results.filter((result) => result.passed).length,
      mismatched: results.filter((result) => !result.passed).length + failures.length,
      fixtureCount: files.length,
      expectedFixtureCount: expectedFiles.length,
      expectedValid: results.filter((result) => result.expected === "valid").length,
      expectedInvalid: results.filter((result) => result.expected === "invalid").length,
      builtInGuardCount: builtInGuardResults.length,
      unknownFieldsPreservationCovered: results.some((result) =>
        result.warnings.some((warning) => warning.includes("unknown top-level field"))
      ),
      missingReviewSafeDefaultsCovered: results.some((result) =>
        result.errors.some((error) => error.includes("reviewSafeDefaults"))
      )
    },
    results,
    builtInGuardResults
  };
}

async function validateExtractionBuiltInGuards(validMinimalPath) {
  const basePayload = await readJson(validMinimalPath);
  const guardCases = [
    {
      guard: "missing extractionRunId",
      expectedError: "missing extractionRunId",
      mutate: (payload) => {
        delete payload.extractionRunId;
      }
    },
    {
      guard: "missing schemaVersion",
      expectedError: "missing schemaVersion",
      mutate: (payload) => {
        delete payload.schemaVersion;
      }
    },
    {
      guard: "invalid element type",
      expectedError: "invalid elementType",
      mutate: (payload) => {
        payload.extractedElements[0].elementType = "unsupported_signal";
      }
    },
    {
      guard: "missing humanAuthorityBoundaries",
      expectedError: "missing humanAuthorityBoundaries",
      mutate: (payload) => {
        delete payload.humanAuthorityBoundaries;
      }
    },
    {
      guard: "warnings missing when risk is high",
      expectedError: "warnings array must be present and non-empty when canon risk is high",
      mutate: (payload) => {
        payload.extractedElements[0].canonRisk = "high";
        payload.warnings = [];
      }
    }
  ];

  return guardCases.map((guardCase) => {
    const payload = JSON.parse(JSON.stringify(basePayload));
    guardCase.mutate(payload);
    const validation = validateExtractionPayload(payload);
    return {
      guard: guardCase.guard,
      expected: "invalid",
      actual: validation.ok ? "valid" : "invalid",
      passed: !validation.ok && validation.errors.some((error) => error.includes(guardCase.expectedError)),
      expectedError: guardCase.expectedError,
      errors: validation.errors,
      warnings: validation.warnings
    };
  });
}

function validateExtractionPayload(payload) {
  const contracts = getExtractionContracts(payload);
  const errors = [];
  const warnings = [];

  if (contracts.length === 0) {
    errors.push("extraction payload must contain an extraction contract");
  }

  contracts.forEach((contract, index) => {
    const validation = validateExtractionContract(contract, {
      label: `extraction contract ${contract?.extractionRunId || index}`,
      requireCompleteElementTypeCoverage: false
    });
    errors.push(...validation.errors);
    warnings.push(...validation.warnings);
  });

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    summary: summarizeExtractionContractList(contracts)
  };
}

function getExtractionContracts(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return [];
  }
  if (Array.isArray(payload.extractionContracts)) {
    return payload.extractionContracts;
  }
  if (payload.extractionContract && typeof payload.extractionContract === "object") {
    return [payload.extractionContract];
  }
  return [payload];
}

async function validateRoutingPolicyRegression(resolution, resolutionPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const sourcePackPath = resolution?.source_pack_path || manifest.source_span_review_pack_path || "artifacts/source-span-routing-review-pack.json";
  const sourcePack = await readJson(sourcePackPath);
  const boundarySmoke = await readJson(manifest.model_api_boundary_smoke_path || "artifacts/model-api-boundary-smoke-result.json");
  const boundaryEnvelope = await readJson(manifest.model_api_boundary_envelope_path || "artifacts/model-api-boundary-envelope.example.json");
  const adapterPayloads = await readAdapterPayloads();
  const decisions = Array.isArray(resolution?.decisions) ? resolution.decisions : [];
  const packElements = flattenSourcePackElements(sourcePack);
  const adapterElements = adapterPayloads.flatMap((payload) => Array.isArray(payload.extractedElements) ? payload.extractedElements : []);
  const packById = new Map(packElements.map((element) => [element.id, element]));
  const adapterById = new Map(adapterElements.map((element) => [element.id, element]));
  const visualDecisions = decisions.filter((decision) => decision.element_type === "visual_asset");
  const unresolvedDecisionRows = decisions.filter((decision) => decision.element_type === "unresolved_decision");
  const humanOwnedObjectRows = decisions.filter((decision) => {
    const value = String(decision.extracted_value || "").toLowerCase();
    return decision.element_type === "object" && (value.includes("brass moth") || hasHumanOwnedDependency(decision));
  });
  const sourceReferencePackRows = packElements.filter((element) => element.element_type === "source_reference");
  const sourceReferenceAdapterRows = adapterElements.filter((element) => element.elementType === "source_reference");

  check(
    "resolution_artifact_loaded",
    resolution?.artifact_id === "fff-ambiguous-routing-resolution-001" && resolution?.passed === true,
    `loaded ${resolutionPath}`
  );
  check(
    "review_memory_checked",
    manifest.review_memory?.some((entry) => entry.artifact_id === "fff-ambiguous-routing-resolution-001") &&
      resolution.review_memory_checked?.checked === true,
    "manifest and resolution both expose review memory for ambiguous routing"
  );
  check(
    "route_policy_checks_defined",
    decisions.length === 7 &&
      resolution.regression_checks?.visual_asset_no_claim_route === true &&
      resolution.regression_checks?.unresolved_decision_human_review_hold === true &&
      resolution.regression_checks?.object_human_owned_profile_primary_hold === true,
    `decision rows=${decisions.length}`
  );
  check(
    "visual_direct_claim_guard",
    visualDecisions.length > 0 &&
      visualDecisions.every((decision) => !arrayIncludesIgnoreCase(decision.current_target_destinations, "claim") && !arrayIncludesIgnoreCase(decision.current_review_pack_routes, "Claim") && arrayLength(decision.target_claim_ids) === 0) &&
      packElements.filter((element) => element.element_type === "visual_asset").every((element) => !arrayIncludesIgnoreCase(element.routing_targets, "Claim")) &&
      adapterElements.filter((element) => element.elementType === "visual_asset").every((element) => !arrayIncludesIgnoreCase(element.targetDestinations, "claim") && arrayLength(element.targetClaimIds) === 0),
    "visual rows must not target Claim directly in resolution, pack, or adapter outputs"
  );
  check(
    "human_review_hold_guard",
    unresolvedDecisionRows.length === 3 &&
      unresolvedDecisionRows.every((decision) => decision.primary_resolution === "hold_for_human_decision" && decision.review_status === "hold" && decision.suggested_review_status === "hold" && arrayIncludesIgnoreCase(decision.current_target_destinations, "unresolved_decision") && arrayIncludesSubstring(decision.source_ref_ids, "freeform-review")) &&
      adapterElements.filter((element) => element.elementType === "unresolved_decision").every((element) => element.reviewStatus === "hold" && element.suggestedReviewStatus === "hold" && arrayIncludesIgnoreCase(element.targetDestinations, "unresolved_decision")),
    "unresolved/human-owned decision rows must stay held with human review routing"
  );
  check(
    "claim_secondary_evidence_rule",
    resolution.summary?.rows_with_claim_as_secondary_evidence === 5 &&
      decisions.every((decision) => decision.primary_resolution !== "route_to_claim_candidate") &&
      decisions.filter((decision) => arrayIncludesIgnoreCase(decision.secondary_routes, "route_to_claim_candidate")).every((decision) => decision.review_status === "hold"),
    "Claim routes in resolved rows must remain secondary evidence and held"
  );
  check(
    "timeline_secondary_evidence_rule",
    resolution.summary?.rows_with_timeline_as_secondary_evidence === 6 &&
      decisions.every((decision) => decision.primary_resolution !== "route_to_timeline_candidate") &&
      decisions.filter((decision) => arrayIncludesIgnoreCase(decision.secondary_routes, "route_to_timeline_candidate")).every((decision) => decision.review_status === "hold"),
    "Timeline routes in resolved rows must remain secondary evidence and held"
  );
  check(
    "source_reference_preservation",
    sourceReferencePackRows.length > 0 &&
      sourceReferencePackRows.every((element) => arrayEqualsIgnoreCase(element.routing_targets, ["Source Reference"])) &&
      sourceReferenceAdapterRows.length > 0 &&
      sourceReferenceAdapterRows.every((element) => arrayEqualsIgnoreCase(element.targetDestinations, ["source_reference"]) && arrayLength(element.targetClaimIds) === 0),
    "source_reference rows must remain source references, not claims"
  );
  check(
    "unsafe_unclear_hold_rule",
    decisions.every((decision) => decision.review_status === "hold" && decision.suggested_review_status === "hold") &&
      sourcePack.cross_fixture_summary?.non_held_review_defaults === 0 &&
      sourcePack.cross_fixture_summary?.human_owned_decision_adopt_suggestions === 0,
    "unsafe or unclear routing must stay held and must not suggest adopt"
  );
  check(
    "adapter_drift_readback",
    decisions.every((decision) => packById.has(decision.id) && adapterById.has(decision.id)) &&
      adapterPayloads.length >= 4 &&
      sourcePack.passed === true,
    "resolved rows must be visible in source pack and adapter outputs"
  );
  check(
    "human_owned_object_profile_primary_hold",
    humanOwnedObjectRows.length === 3 &&
      humanOwnedObjectRows.every((decision) => decision.primary_resolution === "route_to_profile_candidate" && decision.review_status === "hold" && arrayIncludesIgnoreCase(decision.current_target_destinations, "profile") && arrayIncludesIgnoreCase(decision.current_target_destinations, "unresolved_decision")),
    "human-owned object rows must route first to Profile/Ghost and remain held"
  );
  check(
    "no_model_api_behavior_added",
    manifest.preserved_model_api_boundary_artifact_id === "fff-model-api-boundary-spec-001" &&
      boundarySmoke?.passed === true &&
      boundarySmoke?.checks?.noExternalCall === true &&
      boundaryEnvelope?.providerBoundary?.externalCallAllowed === false,
    "model/API boundary remains preserved by structured no-call evidence"
  );

  return {
    schemaVersion: ROUTING_POLICY_REGRESSION_SCHEMA_VERSION,
    artifact_id: "fff-routing-policy-regression-hardening-001",
    title: "Fast Fiction Factory Routing Policy Regression Hardening",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    source_resolution_artifact_id: resolution?.artifact_id,
    source_resolution_path: toRepoPath(resolutionPath),
    source_pack_path: sourcePackPath,
    adapter_output_paths: adapterPayloads.map((payload) => toRepoPath(payload.__path)),
    review_memory_checked: {
      checked: true,
      target: "fff-ambiguous-routing-resolution-001",
      prior_review_count: manifest.review_memory?.find((entry) => entry.artifact_id === "fff-ambiguous-routing-resolution-001")?.prior_review_count ?? 0,
      prior_signal_summary: manifest.review_memory?.find((entry) => entry.artifact_id === "fff-ambiguous-routing-resolution-001")?.latest_user_signal_summary || "No user review was requested for the prior routing-resolution slice.",
      axis: "routing_policy_regression_hardening",
      what_changed: "Resolved routing policy is now rechecked against the resolution artifact, source-span pack, and current adapter outputs.",
      what_this_review_decides: "No user review is needed; this readback decides whether route policy drift is visible before future adapter changes proceed.",
      not_asking: [
        "general Review Hub review",
        "repeat ambiguous routing review",
        "model/API approval",
        "production approval",
        "canon decisions for Toma fate, brass moth truth, or Council motive"
      ],
      next_nonredundant_axis: "one missing fixture class if regression hardening later exposes drift"
    },
    summary: {
      resolved_rows_checked: decisions.length,
      source_pack_rows_checked: packElements.length,
      adapter_payloads_checked: adapterPayloads.length,
      adapter_elements_checked: adapterElements.length,
      visual_rows_checked: visualDecisions.length,
      unresolved_decision_rows_checked: unresolvedDecisionRows.length,
      source_reference_pack_rows_checked: sourceReferencePackRows.length,
      source_reference_adapter_rows_checked: sourceReferenceAdapterRows.length,
      failures: failures.length
    },
    routing_policy_checks: checks,
    route_policy: {
      visual_evidence: "visual_asset rows must not create direct Claim targets",
      human_review_hold: "unresolved and human-owned decision rows must remain hold with Human Review routing",
      claim_secondary_evidence: "Claim routing in resolved rows is secondary evidence unless a later safe policy explicitly changes it",
      timeline_secondary_evidence: "Timeline routing in resolved rows is secondary evidence unless a later safe policy explicitly changes it",
      source_reference_preservation: "source_reference rows remain source references and never become claims",
      unsafe_unclear_hold: "unsafe or unclear routing remains held, not adopted",
      adapter_drift_readback: "resolution, source pack, and adapter output ids must agree so drift is visible"
    },
    failures,
    passed: failures.length === 0
  };
}

async function validateBroadSpanSplit(audit, auditPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const routingRegression = await readJson(manifest.routing_policy_regression_result_path || DEFAULT_ROUTING_POLICY_REGRESSION_OUTPUT);
  const boundarySmoke = await readJson(manifest.model_api_boundary_smoke_path || "artifacts/model-api-boundary-smoke-result.json");
  const boundaryEnvelope = await readJson(manifest.model_api_boundary_envelope_path || "artifacts/model-api-boundary-envelope.example.json");
  const broadRows = getBroadSpanRows(audit);
  const decisions = broadRows.map(resolveBroadSpanRow);
  const allowedActions = ["split_into_narrower_spans", "shrink_to_more_precise_span", "keep_with_reason", "hold_for_human_review"];
  const decisionIds = decisions.map((decision) => decision.id).sort();
  const expectedIds = ["local-x-visual-observatory", "minutes-x-placeholder-proof-bait"];
  const sourceQualityMemory = manifest.review_memory?.find((entry) => entry.artifact_id === "fff-source-span-quality-audit-001");
  const routingMemory = manifest.review_memory?.find((entry) => entry.artifact_id === "fff-routing-policy-regression-hardening-001");
  const splitDecision = decisions.find((decision) => decision.id === "local-x-visual-observatory");
  const keptDecision = decisions.find((decision) => decision.id === "minutes-x-placeholder-proof-bait");

  check(
    "source_quality_audit_loaded",
    audit?.artifact_id === "fff-source-span-quality-audit-001" && audit?.passed === true,
    `loaded ${auditPath}`
  );
  check(
    "broad_span_rows_loaded",
    broadRows.length === 2 && expectedIds.every((id) => decisionIds.includes(id)),
    `broad rows=${broadRows.length}; ids=${decisionIds.join(", ")}`
  );
  check(
    "all_broad_spans_resolved",
    decisions.length === 2 && decisions.every((decision) => allowedActions.includes(decision.action)) && decisions.every((decision) => decision.action !== "hold_for_human_review"),
    "each current broad span has a split, shrink, or explicit keep reason without adding a new hold-only outcome"
  );
  check(
    "observatory_split_is_narrower",
    splitDecision?.action === "split_into_narrower_spans" &&
      splitDecision.proposed_spans?.length === 2 &&
      splitDecision.proposed_spans.every((span) => splitDecision.raw_source_snippet.includes(span.source_text)) &&
      splitDecision.proposed_spans.every((span) => span.source_text.length < splitDecision.raw_source_snippet.length),
    "observatory row is split into narrower visual and timeline evidence snippets"
  );
  check(
    "placeholder_keep_reason_preserves_alternatives",
    keptDecision?.action === "keep_with_reason" &&
      keptDecision.review_status === "hold" &&
      keptDecision.human_owned_guard === "held_human_review_required" &&
      ["proof", "bait", "false record"].every((term) => keptDecision.preserved_alternatives?.includes(term)),
    "proof/bait/false-record row remains a single held human-owned instruction"
  );
  check(
    "source_refs_preserved",
    decisions.every((decision) => typeof decision.source_span_locator === "string" && decision.source_span_locator.includes("#char=") && decision.source_ref_preserved === true),
    "each decision preserves the original source span locator"
  );
  check(
    "routing_policy_regression_preserved",
    routingRegression?.artifact_id === "fff-routing-policy-regression-hardening-001" && routingRegression?.passed === true && routingRegression?.summary?.failures === 0,
    "current routing policy regression result still passes"
  );
  check(
    "review_memory_checked",
    Boolean(sourceQualityMemory) && Boolean(routingMemory),
    "manifest review memory includes source-span quality audit and routing policy regression hardening"
  );
  check(
    "canon_boundaries_preserved",
    decisions.every((decision) => decision.review_status === "hold") &&
      decisions.every((decision) => decision.canon_boundary === "no_final_canon_decision") &&
      keptDecision?.keep_reason?.includes("would imply separate canon choices"),
    "Toma fate, brass moth truth, Council motive, and placeholder alternatives remain human-owned"
  );
  check(
    "no_model_api_behavior_added",
    manifest.preserved_model_api_boundary_artifact_id === "fff-model-api-boundary-spec-001" &&
      boundarySmoke?.passed === true &&
      boundarySmoke?.checks?.noExternalCall === true &&
      boundaryEnvelope?.providerBoundary?.externalCallAllowed === false,
    "model/API boundary remains preserved by structured no-call evidence"
  );

  return {
    schemaVersion: BROAD_SPAN_SPLIT_SCHEMA_VERSION,
    artifact_id: "fff-broad-span-split-001",
    title: "Fast Fiction Factory Broad Source-Span Split",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    source_audit_artifact_id: audit?.artifact_id,
    source_audit_path: toRepoPath(auditPath),
    routing_policy_regression_artifact_id: routingRegression?.artifact_id,
    routing_policy_regression_path: manifest.routing_policy_regression_result_path || DEFAULT_ROUTING_POLICY_REGRESSION_OUTPUT,
    review_memory_checked: {
      checked: true,
      target: "fff-source-span-quality-audit-001",
      prior_review_count: sourceQualityMemory?.prior_review_count ?? 0,
      prior_signal_summary: sourceQualityMemory?.latest_user_signal_summary || "No user review was requested for the source-span quality audit slice.",
      axis: "broad_span_split",
      what_changed: "The two broad source-span rows now have deterministic split/keep decisions with source locators preserved.",
      what_this_review_decides: "No user review is needed; this readback decides whether broad-span debt is resolved enough to move to weak-span or fixture-class work later.",
      not_asking: [
        "general Review Hub review",
        "repeat source-span quality review",
        "model/API approval",
        "production approval",
        "canon decisions for Toma fate, brass moth truth, or Council motive"
      ],
      next_nonredundant_axis: "one bounded weak-span repair or one missing fixture class after explicit need"
    },
    summary: {
      broad_span_rows_loaded: broadRows.length,
      split_into_narrower_spans: decisions.filter((decision) => decision.action === "split_into_narrower_spans").length,
      shrink_to_more_precise_span: decisions.filter((decision) => decision.action === "shrink_to_more_precise_span").length,
      keep_with_reason: decisions.filter((decision) => decision.action === "keep_with_reason").length,
      hold_for_human_review: decisions.filter((decision) => decision.action === "hold_for_human_review").length,
      source_refs_preserved: decisions.filter((decision) => decision.source_ref_preserved === true).length,
      routing_policy_regression_preserved: routingRegression?.passed === true,
      review_card_emitted: false,
      repeated_general_review_request_emitted: false,
      failures: failures.length
    },
    decisions,
    broad_span_checks: checks,
    failures,
    passed: failures.length === 0
  };
}

function getBroadSpanRows(audit) {
  const rows = Array.isArray(audit?.row_classifications) ? audit.row_classifications : [];
  const taggedRows = rows.filter((row) => arrayIncludesIgnoreCase(row.quality_tags, "overly_broad_span"));
  if (taggedRows.length > 0) {
    return taggedRows;
  }
  return Array.isArray(audit?.categories?.overly_broad_span) ? audit.categories.overly_broad_span : [];
}

function resolveBroadSpanRow(row) {
  const base = {
    fixture_id: row.fixture_id,
    id: row.id,
    element_type: row.element_type,
    extracted_value: row.extracted_value,
    source_span_locator: row.source_span_locator,
    raw_source_snippet: row.raw_source_snippet,
    previous_routing_targets: row.routing_targets || [],
    confidence: row.confidence,
    review_status: row.review_status || "hold",
    human_owned_guard: row.human_owned_guard || "none",
    source_ref_preserved: true,
    canon_boundary: "no_final_canon_decision"
  };

  if (row.id === "local-x-visual-observatory") {
    return {
      ...base,
      action: "split_into_narrower_spans",
      reason: "The original span combines visual evidence and timeline evidence in one clause; splitting the evidence makes review intent clearer without changing adapter output or restoring a direct Claim route.",
      proposed_spans: [
        {
          span_id: "local-x-visual-observatory.visual-evidence",
          source_text: "its bell was removed",
          route_role: "visual_profile_evidence",
          recommended_primary_route: "Visual",
          secondary_evidence: ["Profile"],
          review_status: "hold",
          routing_boundary: "visual/profile evidence only; no direct Claim target",
          reason: "This snippet carries the visible missing-bell image."
        },
        {
          span_id: "local-x-visual-observatory.timeline-evidence",
          source_text: "still rings at noon",
          route_role: "timeline_secondary_evidence",
          recommended_primary_route: "Timeline context",
          secondary_evidence: ["Profile"],
          review_status: "hold",
          routing_boundary: "timeline context remains secondary and held",
          reason: "This snippet carries the noon event without bundling the removed-bell image."
        }
      ],
      routing_policy_effect: "Preserves fff-routing-policy-regression-hardening-001: visual rows remain out of direct Claim targets."
    };
  }

  if (row.id === "minutes-x-placeholder-proof-bait") {
    return {
      ...base,
      action: "keep_with_reason",
      keep_reason: "The whole negated instruction is the evidence; splitting proof, bait, and false record would imply separate canon choices before the human-owned decision exists.",
      preserved_alternatives: ["proof", "bait", "false record"],
      routing_policy_effect: "Preserves one held placeholder routed to Profile/Human Review until a future fixture explicitly needs separate alternatives."
    };
  }

  return {
    ...base,
    action: "hold_for_human_review",
    reason: "Unexpected broad span id. Holding is safer than inventing a split rule."
  };
}

async function validateWeakSpanRepair(audit, auditPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const routingRegression = await readJson(manifest.routing_policy_regression_result_path || DEFAULT_ROUTING_POLICY_REGRESSION_OUTPUT);
  const broadSpanSplit = await readJson(manifest.broad_span_split_result_path || DEFAULT_BROAD_SPAN_SPLIT_OUTPUT);
  const boundarySmoke = await readJson(manifest.model_api_boundary_smoke_path || "artifacts/model-api-boundary-smoke-result.json");
  const boundaryEnvelope = await readJson(manifest.model_api_boundary_envelope_path || "artifacts/model-api-boundary-envelope.example.json");
  const weakRows = getWeakSpanRows(audit);
  const decisions = weakRows.map(resolveWeakSpanRow);
  const allowedActions = ["repair_with_more_precise_source_ref", "shrink_to_stronger_span", "keep_with_reason", "hold_for_human_review"];
  const decisionIds = decisions.map((decision) => decision.id).sort();
  const expectedIds = [
    "edge-x-document-ledger-page",
    "edge-x-object-brass-moth-key",
    "edge-x-place-north-bell",
    "local-x-document-ledger",
    "local-x-place-north-bell",
    "minutes-x-place-glass-arcade"
  ];
  const sourceQualityMemory = manifest.review_memory?.find((entry) => entry.artifact_id === "fff-source-span-quality-audit-001");
  const broadMemory = manifest.review_memory?.find((entry) => entry.artifact_id === "fff-broad-span-split-001");
  const routingMemory = manifest.review_memory?.find((entry) => entry.artifact_id === "fff-routing-policy-regression-hardening-001");
  const sourceTextChecks = await Promise.all(decisions.map(checkDecisionSourceText));
  const keyDecision = decisions.find((decision) => decision.id === "edge-x-object-brass-moth-key");

  check(
    "source_quality_audit_loaded",
    audit?.artifact_id === "fff-source-span-quality-audit-001" && audit?.passed === true,
    `loaded ${auditPath}`
  );
  check(
    "weak_span_rows_loaded",
    weakRows.length === 6 && expectedIds.every((id) => decisionIds.includes(id)),
    `weak rows=${weakRows.length}; ids=${decisionIds.join(", ")}`
  );
  check(
    "all_weak_spans_classified",
    decisions.length === 6 && decisions.every((decision) => allowedActions.includes(decision.action)),
    "each current weak span has a repair, shrink, keep, or hold decision"
  );
  check(
    "repair_decisions_are_source_backed",
    sourceTextChecks.every((result) => result.passed),
    sourceTextChecks.map((result) => `${result.id}:${result.passed ? "source-backed" : result.detail}`).join("; ")
  );
  check(
    "repaired_spans_strengthen_context",
    decisions.filter((decision) => decision.action === "repair_with_more_precise_source_ref").length === 6 &&
      decisions.every((decision) => decision.proposed_source_refs?.some((sourceRef) => sourceRef.source_text.length > String(decision.raw_source_snippet || "").length)),
    "all 6 weak spans are repaired with longer source text from the same fixture"
  );
  check(
    "source_refs_preserved",
    decisions.every((decision) => typeof decision.source_span_locator === "string" && decision.source_span_locator.includes("#char=") && decision.source_ref_preserved === true),
    "each decision preserves the original source span locator"
  );
  check(
    "routing_policy_regression_preserved",
    routingRegression?.artifact_id === "fff-routing-policy-regression-hardening-001" && routingRegression?.passed === true && routingRegression?.summary?.failures === 0,
    "current routing policy regression result still passes"
  );
  check(
    "broad_span_split_preserved",
    broadSpanSplit?.artifact_id === "fff-broad-span-split-001" && broadSpanSplit?.passed === true && broadSpanSplit?.summary?.failures === 0,
    "broad-span split result remains valid and is not reopened"
  );
  check(
    "review_memory_checked",
    Boolean(sourceQualityMemory) && Boolean(broadMemory) && Boolean(routingMemory),
    "manifest review memory includes source-span quality audit, broad-span split, and routing policy regression hardening"
  );
  check(
    "human_owned_key_boundary_preserved",
    keyDecision?.review_status === "hold" &&
      keyDecision?.human_owned_guard === "held_human_review_required" &&
      keyDecision?.canon_boundary === "no_final_canon_decision" &&
      keyDecision?.repair_boundary?.includes("does not decide the key function"),
    "brass moth key row gains context without deciding brass moth truth"
  );
  check(
    "no_model_api_behavior_added",
    manifest.preserved_model_api_boundary_artifact_id === "fff-model-api-boundary-spec-001" &&
      boundarySmoke?.passed === true &&
      boundarySmoke?.checks?.noExternalCall === true &&
      boundaryEnvelope?.providerBoundary?.externalCallAllowed === false,
    "model/API boundary remains preserved by structured no-call evidence"
  );

  return {
    schemaVersion: WEAK_SPAN_REPAIR_SCHEMA_VERSION,
    artifact_id: "fff-weak-span-repair-001",
    title: "Fast Fiction Factory Weak Source-Span Repair",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    source_audit_artifact_id: audit?.artifact_id,
    source_audit_path: toRepoPath(auditPath),
    broad_span_split_artifact_id: broadSpanSplit?.artifact_id,
    broad_span_split_path: manifest.broad_span_split_result_path || DEFAULT_BROAD_SPAN_SPLIT_OUTPUT,
    routing_policy_regression_artifact_id: routingRegression?.artifact_id,
    routing_policy_regression_path: manifest.routing_policy_regression_result_path || DEFAULT_ROUTING_POLICY_REGRESSION_OUTPUT,
    review_memory_checked: {
      checked: true,
      target: "fff-source-span-quality-audit-001",
      prior_review_count: sourceQualityMemory?.prior_review_count ?? 0,
      prior_signal_summary: sourceQualityMemory?.latest_user_signal_summary || "No user review was requested for the source-span quality audit slice.",
      axis: "weak_span_repair",
      what_changed: "The 6 weak source-span rows now have deterministic repair decisions that point to stronger same-fixture source context while preserving original locators.",
      what_this_review_decides: "No user review is needed; this readback decides whether current weak-span debt is repaired enough to move toward one missing fixture class later.",
      not_asking: [
        "general Review Hub review",
        "repeat source-span quality review",
        "repeat broad-span review",
        "model/API approval",
        "production approval",
        "canon decisions for Toma fate, brass moth truth, or Council motive"
      ],
      next_nonredundant_axis: "one missing fixture class only after a concrete coverage need is named"
    },
    summary: {
      weak_span_rows_loaded: weakRows.length,
      repair_with_more_precise_source_ref: decisions.filter((decision) => decision.action === "repair_with_more_precise_source_ref").length,
      shrink_to_stronger_span: decisions.filter((decision) => decision.action === "shrink_to_stronger_span").length,
      keep_with_reason: decisions.filter((decision) => decision.action === "keep_with_reason").length,
      hold_for_human_review: decisions.filter((decision) => decision.action === "hold_for_human_review").length,
      source_refs_preserved: decisions.filter((decision) => decision.source_ref_preserved === true).length,
      routing_policy_regression_preserved: routingRegression?.passed === true,
      broad_span_split_preserved: broadSpanSplit?.passed === true,
      review_card_emitted: false,
      repeated_general_review_request_emitted: false,
      failures: failures.length
    },
    decisions,
    weak_span_checks: checks,
    failures,
    passed: failures.length === 0
  };
}

function getWeakSpanRows(audit) {
  const rows = Array.isArray(audit?.row_classifications) ? audit.row_classifications : [];
  const taggedRows = rows.filter((row) => arrayIncludesIgnoreCase(row.quality_tags, "weak_span"));
  if (taggedRows.length > 0) {
    return taggedRows;
  }
  return Array.isArray(audit?.categories?.weak_span) ? audit.categories.weak_span : [];
}

function resolveWeakSpanRow(row) {
  const base = {
    fixture_id: row.fixture_id,
    id: row.id,
    element_type: row.element_type,
    extracted_value: row.extracted_value,
    source_span_locator: row.source_span_locator,
    raw_source_snippet: row.raw_source_snippet,
    previous_routing_targets: row.routing_targets || [],
    confidence: row.confidence,
    review_status: row.review_status || "hold",
    human_owned_guard: row.human_owned_guard || "none",
    risk_flags: row.risk_flags || [],
    source_ref_preserved: true,
    canon_boundary: "no_final_canon_decision"
  };

  const repair = (sourceText, routeRole, primaryRoute, secondaryEvidence, reason, repairBoundary = "readback-only repair; adapter output is not rewritten in this slice") => ({
    ...base,
    action: "repair_with_more_precise_source_ref",
    reason,
    proposed_source_refs: [
      {
        source_text: sourceText,
        route_role: routeRole,
        recommended_primary_route: primaryRoute,
        secondary_evidence: secondaryEvidence,
        review_status: "hold",
        repair_boundary: repairBoundary
      }
    ],
    repair_boundary: repairBoundary
  });

  if (row.id === "local-x-place-north-bell") {
    return repair(
      "old observatory above North Bell Station still rings at noon",
      "place_plus_timeline_event",
      "Timeline context",
      ["Profile"],
      "The bare station name resolves, but the widened source text also carries the noon-ring event that explains why Timeline review is useful."
    );
  }

  if (row.id === "local-x-document-ledger") {
    return repair(
      "council keeps a ledger of minutes in a locked cabinet",
      "document_plus_claim_context",
      "Claim evidence",
      ["Profile"],
      "The bare document title resolves, but the widened source text shows the council action and locked-cabinet context behind the Claim route."
    );
  }

  if (row.id === "minutes-x-place-glass-arcade") {
    return repair(
      "At 9:17, apprentice Rowan Ise waits in the glass arcade",
      "place_plus_waiting_event",
      "Timeline context",
      ["Profile"],
      "The bare location resolves, but the widened source text includes the 9:17 waiting event that justifies Timeline review."
    );
  }

  if (row.id === "edge-x-place-north-bell") {
    return repair(
      "old observatory above North Bell Station rings at noon",
      "place_plus_noon_event",
      "Timeline context",
      ["Profile"],
      "The bare station name resolves, but the widened source text connects the place to the noon-repeat event without deciding its cause."
    );
  }

  if (row.id === "edge-x-object-brass-moth-key") {
    return repair(
      "Toma's last route is pinned under a brass moth key",
      "object_plus_human_owned_route_context",
      "Profile",
      ["Claim", "Timeline", "Human Review"],
      "The key phrase resolves, but the widened source text shows why the object touches Toma route evidence while still remaining held.",
      "readback-only repair; does not decide the key function, brass moth truth, or Toma fate"
    );
  }

  if (row.id === "edge-x-document-ledger-page") {
    return repair(
      "ledger page lists borrowed minutes from abandoned lives",
      "document_plus_claim_context",
      "Claim evidence",
      ["Profile"],
      "The document phrase resolves, but the widened source text carries the borrowed-minutes claim that makes Claim review useful."
    );
  }

  return {
    ...base,
    action: "hold_for_human_review",
    reason: "Unexpected weak span id. Holding is safer than inventing a repair rule."
  };
}

async function checkDecisionSourceText(decision) {
  const sourcePath = String(decision.source_span_locator || "").split("#")[0];
  if (!sourcePath) {
    return { id: decision.id, passed: false, detail: "missing source path" };
  }
  let rawMemo;
  try {
    rawMemo = await readFile(sourcePath, "utf8");
  } catch (error) {
    return { id: decision.id, passed: false, detail: `cannot read ${sourcePath}: ${error.message}` };
  }
  const refs = Array.isArray(decision.proposed_source_refs) ? decision.proposed_source_refs : [];
  const missing = refs.filter((sourceRef) => !rawMemo.includes(sourceRef.source_text)).map((sourceRef) => sourceRef.source_text);
  return {
    id: decision.id,
    passed: refs.length > 0 && missing.length === 0,
    detail: missing.length === 0 ? "all proposed source text found" : `missing proposed text: ${missing.join(" | ")}`
  };
}

async function validateMissingFixtureClassProbe(smoke, smokePath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const selectedFixture = {
    class_id: "sparse_bullet_only_notes",
    label: "sparse bullet-only notes",
    fixture_key: "sparse-bullet-notes",
    fixture_path: "artifacts/extraction-adapter-fixtures/sparse-bullet-notes.md",
    output_path: "artifacts/extraction-adapter-outputs/sparse-bullet-notes.json"
  };
  const knownMissingBeforeProbe = [
    "contradictory memo claims",
    "very broad source spans",
    "missing or malformed source span payloads",
    "multilingual or translated memo text",
    "sparse bullet-only notes",
    "model/API provider envelope output"
  ];
  const remainingFixtureCandidates = knownMissingBeforeProbe.filter((candidate) => candidate !== selectedFixture.label);

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const sourcePackPath = manifest.source_span_review_pack_path || "artifacts/source-span-routing-review-pack.json";
  const sourcePack = await readJson(sourcePackPath);
  const routingRegression = await readJson(manifest.routing_policy_regression_result_path || DEFAULT_ROUTING_POLICY_REGRESSION_OUTPUT);
  const weakSpanRepair = await readJson(manifest.weak_span_repair_result_path || DEFAULT_WEAK_SPAN_REPAIR_OUTPUT);
  const broadSpanSplit = await readJson(manifest.broad_span_split_result_path || DEFAULT_BROAD_SPAN_SPLIT_OUTPUT);
  const boundarySmoke = await readJson(manifest.model_api_boundary_smoke_path || "artifacts/model-api-boundary-smoke-result.json");
  const boundaryEnvelope = await readJson(manifest.model_api_boundary_envelope_path || "artifacts/model-api-boundary-envelope.example.json");
  const rawMemo = await readFile(selectedFixture.fixture_path, "utf8");
  const output = await readJson(selectedFixture.output_path);
  const adapterPayloads = await readAdapterPayloads();
  const adapterElements = adapterPayloads.flatMap((payload) => Array.isArray(payload.extractedElements) ? payload.extractedElements : []);
  const packElements = flattenSourcePackElements(sourcePack);
  const sparsePackFixture = Array.isArray(sourcePack.fixtures)
    ? sourcePack.fixtures.find((fixture) => fixture.fixture_id === selectedFixture.fixture_key)
    : null;
  const sparseSmokeResult = Array.isArray(smoke.fixtureResults)
    ? smoke.fixtureResults.find((result) => result.fixture === selectedFixture.fixture_key)
    : null;
  const sourceRefIds = new Set((output.sourceRefs || []).map((sourceRef) => sourceRef.id));
  const sparseElements = Array.isArray(output.extractedElements) ? output.extractedElements : [];
  const sparseElementTypes = [...new Set(sparseElements.map((element) => element.elementType))].sort();
  const requiredElementTypeCoverage = Object.fromEntries(
    REQUIRED_EXTRACTION_ELEMENT_TYPES.map((elementType) => [elementType, sparseElementTypes.includes(elementType)])
  );
  const sourceSpanMismatches = sparseElements.filter((element) => {
    const sourceSpan = element.sourceSpan || {};
    return typeof sourceSpan.start !== "number" ||
      typeof sourceSpan.end !== "number" ||
      rawMemo.slice(sourceSpan.start, sourceSpan.end) !== sourceSpan.text;
  }).map((element) => element.id);
  const missingSourceRefs = sparseElements.filter((element) =>
    !Array.isArray(element.sourceRefIds) ||
    element.sourceRefIds.length === 0 ||
    element.sourceRefIds.some((sourceRefId) => !sourceRefIds.has(sourceRefId))
  ).map((element) => element.id);
  const unsafeVisualRoutes = sparseElements.filter((element) =>
    element.elementType === "visual_asset" &&
    Array.isArray(element.targetDestinations) &&
    element.targetDestinations.includes("claim") &&
    !element.targetDestinations.includes("profile")
  ).map((element) => element.id);
  const nonHeldDefaults = sparseElements.filter((element) =>
    element.reviewStatus !== "hold" || element.suggestedReviewStatus !== "hold"
  ).map((element) => element.id);
  const humanOwnedAdoptSuggestions = sparseElements.filter((element) =>
    touchesHumanOwnedDecision(element) && element.suggestedReviewStatus === "adopt"
  ).map((element) => element.id);
  const bulletLines = rawMemo.split(/\r?\n/).filter((line) => line.trim().startsWith("- "));
  const nonBulletBodyLines = rawMemo.split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("# ") && !line.startsWith("- "));
  const sourcePackLegacyGaps = Array.isArray(sourcePack.cross_fixture_summary?.fixture_class_gaps)
    ? sourcePack.cross_fixture_summary.fixture_class_gaps
    : [];
  const weakMemory = manifest.review_memory?.find((entry) => entry.artifact_id === "fff-weak-span-repair-001");
  const humanBoundaryText = (output.humanAuthorityBoundaries || []).join(" ").toLowerCase();

  check(
    "prior_cleanup_sequence_confirmed",
    weakSpanRepair?.artifact_id === "fff-weak-span-repair-001" &&
      weakSpanRepair?.passed === true &&
      weakSpanRepair?.summary?.weak_span_rows_loaded === 6 &&
      weakSpanRepair?.summary?.repair_with_more_precise_source_ref === 6 &&
      broadSpanSplit?.artifact_id === "fff-broad-span-split-001" &&
      broadSpanSplit?.passed === true &&
      routingRegression?.artifact_id === "fff-routing-policy-regression-hardening-001" &&
      routingRegression?.passed === true,
    "weak-span repair, broad-span split, and routing regression must already be preserved"
  );
  check(
    "concrete_fixture_gap_named",
    knownMissingBeforeProbe.includes(selectedFixture.label) &&
      (sourcePackLegacyGaps.includes(selectedFixture.label) ||
        manifest.next_action?.toLowerCase().includes("fixture class") ||
        Boolean(sparsePackFixture)),
    "selected sparse bullet-only notes class must be named by existing fixture coverage debt or already preserved in the source pack"
  );
  check(
    "exactly_one_fixture_class_added",
    selectedFixture.class_id === "sparse_bullet_only_notes" &&
      Array.isArray(smoke.fixtureFiles) &&
      smoke.fixtureFiles.filter((file) => file === `${selectedFixture.fixture_key}.md`).length === 1,
    "this probe is bounded to sparse-bullet-notes.md"
  );
  check(
    "sparse_bullet_shape_confirmed",
    rawMemo.includes("Adapter Fixture: Sparse Bullet Notes") &&
      bulletLines.length >= 8 &&
      nonBulletBodyLines.length === 0,
    `bullet lines=${bulletLines.length}; non-bullet body lines=${nonBulletBodyLines.length}`
  );
  check(
    "adapter_matrix_extended",
    smoke?.passed === true &&
      smoke.aggregate?.fixtureCount === 4 &&
      smoke.aggregate?.outputCount === 4 &&
      smoke.aggregate?.elementCount === 48 &&
      Boolean(sparseSmokeResult?.passed),
    `matrix fixtures=${smoke.aggregate?.fixtureCount}; elements=${smoke.aggregate?.elementCount}`
  );
  check(
    "sparse_output_readback",
    output?.adapterTrace?.fixtureKey === selectedFixture.fixture_key &&
      output?.schemaVersion === EXTRACTION_SCHEMA_VERSION &&
      sparseElements.length === 12 &&
      sparsePackFixture?.counts?.extracted_elements === 12 &&
      Object.values(requiredElementTypeCoverage).every(Boolean),
    `fixture=${output?.adapterTrace?.fixtureKey}; elements=${sparseElements.length}; types=${sparseElementTypes.join(", ")}`
  );
  check(
    "source_span_integrity",
    sourceSpanMismatches.length === 0 &&
      missingSourceRefs.length === 0 &&
      sparseSmokeResult?.sourceRoutingAudit?.sourceSpanMismatchCount === 0,
    `source mismatches=${sourceSpanMismatches.join(", ") || "none"}; missing refs=${missingSourceRefs.join(", ") || "none"}`
  );
  check(
    "review_held_defaults",
    nonHeldDefaults.length === 0 &&
      output.reviewSafeDefaults?.defaultReviewStatus === "hold" &&
      output.reviewSafeDefaults?.autoCanonPromotion === false &&
      output.reviewSafeDefaults?.autoChronologyPromotion === false,
    `non-held elements=${nonHeldDefaults.join(", ") || "none"}`
  );
  check(
    "routing_and_visual_guards",
    unsafeVisualRoutes.length === 0 &&
      sparseElements.filter((element) => element.elementType === "source_reference").every((element) => arrayEqualsIgnoreCase(element.targetDestinations, ["source_reference"])),
    `unsafe visual routes=${unsafeVisualRoutes.join(", ") || "none"}`
  );
  check(
    "human_owned_boundaries_preserved",
    humanOwnedAdoptSuggestions.length === 0 &&
      sparseElements.some((element) => element.id === "sparse-x-unresolved-council-motive" && element.sourceRefIds.includes("src-local-adapter-freeform-review-001")) &&
      ["Toma fate", "brass moth truth", "Council motive"].every((dependency) => humanBoundaryText.includes(dependency.toLowerCase())),
    `human-owned adopt suggestions=${humanOwnedAdoptSuggestions.join(", ") || "none"}`
  );
  check(
    "source_pack_and_routing_readback_extended",
    sourcePack?.passed === true &&
      sourcePack.cross_fixture_summary?.fixture_count === 4 &&
      sourcePack.cross_fixture_summary?.total_elements === 48 &&
      packElements.length === 48 &&
      routingRegression.summary?.source_pack_rows_checked === 48 &&
      routingRegression.summary?.adapter_payloads_checked === adapterPayloads.length &&
      routingRegression.summary?.adapter_elements_checked === adapterElements.length &&
      adapterPayloads.length === 5 &&
      adapterElements.length === 60,
    `pack rows=${packElements.length}; adapter payloads=${adapterPayloads.length}; adapter elements=${adapterElements.length}`
  );
  check(
    "no_model_api_behavior_added",
    manifest.preserved_model_api_boundary_artifact_id === "fff-model-api-boundary-spec-001" &&
      boundarySmoke?.passed === true &&
      boundarySmoke?.checks?.noExternalCall === true &&
      boundaryEnvelope?.providerBoundary?.externalCallAllowed === false,
    "model/API boundary remains preserved by structured no-call evidence"
  );
  check(
    "human_burden_hygiene",
    weakMemory?.prior_review_count === 0 &&
      manifest.review_input_mode === "freeform" &&
      !String(manifest.review_prompt_hint || "").toLowerCase().includes("fixed form"),
    "freeform review remains available, and no operator observation card or repeated general review request is emitted"
  );

  return {
    schemaVersion: MISSING_FIXTURE_CLASS_PROBE_SCHEMA_VERSION,
    artifact_id: "fff-missing-fixture-class-probe-001",
    title: "Fast Fiction Factory Missing Fixture Class Probe",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    selected_fixture_class: selectedFixture.class_id,
    selected_fixture_label: selectedFixture.label,
    selected_fixture_path: selectedFixture.fixture_path,
    selected_output_path: selectedFixture.output_path,
    source_pack_path: sourcePackPath,
    adapter_matrix_smoke_path: toRepoPath(smokePath),
    routing_policy_regression_path: manifest.routing_policy_regression_result_path || DEFAULT_ROUTING_POLICY_REGRESSION_OUTPUT,
    weak_span_repair_path: manifest.weak_span_repair_result_path || DEFAULT_WEAK_SPAN_REPAIR_OUTPUT,
    review_memory_checked: {
      checked: true,
      target: "fff-weak-span-repair-001",
      prior_review_count: weakMemory?.prior_review_count ?? 0,
      prior_signal_summary: weakMemory?.latest_user_signal_summary || "No user review was requested for the weak-span repair slice.",
      axis: "missing_fixture_class_probe",
      what_changed: "A single sparse bullet-only memo fixture and deterministic readback output were added to the local adapter matrix.",
      what_this_review_decides: "No user review is needed; this readback decides whether sparse bullet-only notes are covered without reopening weak-span, broad-span, or ambiguous-routing debt.",
      not_asking: [
        "general Review Hub review",
        "fixed-form review",
        "repeat weak-span review",
        "repeat broad-span review",
        "repeat ambiguous-routing review",
        "model/API approval",
        "provider credentials",
        "database or publishing contract changes",
        "production sync",
        "AI video generation",
        "final canon decisions for Toma fate, brass moth truth, or Council motive"
      ],
      next_nonredundant_axis: "choose another missing fixture class only after a new concrete coverage need is named"
    },
    coverage_decision: {
      known_missing_classes_before_probe: knownMissingBeforeProbe,
      selected_class_reason: "Existing artifacts named sparse bullet-only notes as missing, and the three prior memos were paragraph-style fixtures; this class can be covered locally without model/API calls, provider envelopes, multilingual policy, or canon-choice decisions.",
      covered_by_this_probe: [selectedFixture.label],
      remaining_fixture_class_candidates: remainingFixtureCandidates,
      source_pack_legacy_gap_list_still_present: sourcePackLegacyGaps
    },
    summary: {
      previous_fixture_count: 3,
      current_fixture_count: smoke.aggregate?.fixtureCount,
      current_output_count: smoke.aggregate?.outputCount,
      current_matrix_element_count: smoke.aggregate?.elementCount,
      source_pack_rows_checked: packElements.length,
      adapter_payloads_checked: adapterPayloads.length,
      adapter_elements_checked: adapterElements.length,
      selected_fixture_elements_checked: sparseElements.length,
      selected_fixture_bullet_lines: bulletLines.length,
      source_span_mismatches: sourceSpanMismatches.length,
      missing_source_refs: missingSourceRefs.length,
      unsafe_visual_routes: unsafeVisualRoutes.length,
      non_held_review_defaults: nonHeldDefaults.length,
      human_owned_decision_adopt_suggestions: humanOwnedAdoptSuggestions.length,
      review_card_emitted: false,
      repeated_general_review_request_emitted: false,
      operator_observation_card_emitted: false,
      failures: failures.length
    },
    fixture_probe_checks: checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateMalformedMissingSpanGuard(smoke, smokePath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const selectedFixture = {
    class_id: "malformed_missing_source_span_payload",
    label: "missing or malformed source span payloads",
    fixture_path: "artifacts/extraction-negative-fixtures/malformed-missing-source-span.json"
  };
  const expectedErrorSnippets = EXTRACTION_FIXTURE_EXPECTATIONS["malformed-missing-source-span.json"].expectedErrors;
  const manifest = await readJson("artifacts/artifact-manifest.json");
  const sourcePack = await readJson(manifest.source_span_review_pack_path || "artifacts/source-span-routing-review-pack.json");
  const missingFixtureProbe = await readJson(manifest.missing_fixture_class_probe_result_path || DEFAULT_MISSING_FIXTURE_CLASS_PROBE_OUTPUT);
  const routingRegression = await readJson(manifest.routing_policy_regression_result_path || DEFAULT_ROUTING_POLICY_REGRESSION_OUTPUT);
  const weakSpanRepair = await readJson(manifest.weak_span_repair_result_path || DEFAULT_WEAK_SPAN_REPAIR_OUTPUT);
  const broadSpanSplit = await readJson(manifest.broad_span_split_result_path || DEFAULT_BROAD_SPAN_SPLIT_OUTPUT);
  const boundarySmoke = await readJson(manifest.model_api_boundary_smoke_path || "artifacts/model-api-boundary-smoke-result.json");
  const boundaryEnvelope = await readJson(manifest.model_api_boundary_envelope_path || "artifacts/model-api-boundary-envelope.example.json");
  const fixture = await readJson(selectedFixture.fixture_path);
  const validation = validateExtractionPayload(fixture);
  const fixtureResult = Array.isArray(smoke.results)
    ? smoke.results.find((result) => result.fixture === "malformed-missing-source-span.json")
    : null;
  const fixtureElements = Array.isArray(fixture.extractedElements) ? fixture.extractedElements : [];
  const routedSurfaces = ["profile", "claim", "timeline"];
  const candidateSurfaceElements = fixtureElements.filter((element) =>
    Array.isArray(element.targetDestinations) &&
    element.targetDestinations.some((destination) => routedSurfaces.includes(destination))
  );
  const nonHeldElements = fixtureElements.filter((element) =>
    element.reviewStatus !== "hold" || element.suggestedReviewStatus !== "hold"
  );
  const acceptedRoutedCandidates = validation.ok ? candidateSurfaceElements.map((element) => element.id) : [];
  const sourceSpanErrors = validation.errors.filter((error) => error.includes("sourceSpan"));
  const missingSourceRefErrors = validation.errors.filter((error) => error.includes("sourceRefIds"));
  const expectedErrorMatches = expectedErrorSnippets.map((text) => ({
    text,
    matched: validation.errors.some((error) => error.includes(text)) ||
      Boolean(fixtureResult?.expectedErrorMatches?.some((match) => match.text === text && match.matched))
  }));
  const priorMemory = manifest.review_memory?.find((entry) => entry.artifact_id === "fff-missing-fixture-class-probe-001");
  const sourcePackLegacyGaps = Array.isArray(sourcePack.cross_fixture_summary?.fixture_class_gaps)
    ? sourcePack.cross_fixture_summary.fixture_class_gaps
    : [];

  check(
    "prior_fixture_probe_preserved",
    missingFixtureProbe?.artifact_id === "fff-missing-fixture-class-probe-001" &&
      missingFixtureProbe?.passed === true &&
      weakSpanRepair?.passed === true &&
      broadSpanSplit?.passed === true &&
      routingRegression?.passed === true,
    "sparse fixture probe, weak-span repair, broad-span split, and routing regression must remain closed"
  );
  check(
    "concrete_guard_gap_named",
    sourcePackLegacyGaps.includes(selectedFixture.label) ||
      missingFixtureProbe?.coverage_decision?.remaining_fixture_class_candidates?.includes(selectedFixture.label),
    "missing or malformed source span payloads must be named by existing fixture debt"
  );
  check(
    "exactly_one_negative_fixture_added",
    smoke?.passed === true &&
      smoke.summary?.fixtureCount >= 8 &&
      smoke.summary?.expectedInvalid === 6 &&
      fixtureResult?.fixture === "malformed-missing-source-span.json" &&
      fixtureResult?.expected === "invalid" &&
      fixtureResult?.actual === "invalid" &&
      fixtureResult?.passed === true,
    `validator fixtures=${smoke.summary?.fixtureCount}; malformed fixture actual=${fixtureResult?.actual || "missing"}`
  );
  check(
    "source_span_contract_rejects_unusable_payload",
    validation.ok === false &&
      expectedErrorMatches.every((match) => match.matched) &&
      sourceSpanErrors.length >= 4,
    `source-span errors=${sourceSpanErrors.length}; expected matches=${expectedErrorMatches.filter((match) => match.matched).length}/${expectedErrorMatches.length}`
  );
  check(
    "missing_source_ref_marked",
    missingSourceRefErrors.length >= 1,
    `missing source-ref errors=${missingSourceRefErrors.length}`
  );
  check(
    "hold_as_unreviewable",
    fixtureElements.length === 3 &&
      nonHeldElements.length === 0 &&
      fixture.reviewSafeDefaults?.defaultReviewStatus === "hold" &&
      fixture.reviewSafeDefaults?.autoCanonPromotion === false &&
      fixture.reviewSafeDefaults?.autoChronologyPromotion === false,
    `fixture elements=${fixtureElements.length}; non-held=${nonHeldElements.join(", ") || "none"}`
  );
  check(
    "keep_out_of_routed_adoption",
    candidateSurfaceElements.length >= 2 &&
      acceptedRoutedCandidates.length === 0 &&
      fixtureElements.every((element) => element.targetProfileIds?.length === 0 && element.targetClaimIds?.length === 0 && element.targetTimelineEntryIds?.length === 0),
    `candidate-surface elements=${candidateSurfaceElements.length}; accepted routed candidates=${acceptedRoutedCandidates.join(", ") || "none"}`
  );
  check(
    "source_pack_counts_preserved",
    sourcePack?.passed === true &&
      sourcePack.cross_fixture_summary?.fixture_count === 4 &&
      sourcePack.cross_fixture_summary?.total_elements === 48 &&
      routingRegression.summary?.source_pack_rows_checked === 48 &&
      routingRegression.summary?.adapter_payloads_checked === 5 &&
      routingRegression.summary?.adapter_elements_checked === 60,
    `source-pack fixtures=${sourcePack.cross_fixture_summary?.fixture_count}; rows=${sourcePack.cross_fixture_summary?.total_elements}`
  );
  check(
    "no_review_card_or_model_api",
    priorMemory?.prior_review_count === 0 &&
      manifest.review_input_mode === "freeform" &&
      boundarySmoke?.passed === true &&
      boundarySmoke?.checks?.noExternalCall === true &&
      boundaryEnvelope?.providerBoundary?.externalCallAllowed === false,
    "Review stays freeform/local and model/API boundary remains no-call"
  );

  const remainingFixtureCandidates = [
    "contradictory memo claims",
    "very broad source span fixture shape",
    "multilingual or translated memo text",
    "model/API provider envelope output"
  ];

  return {
    schemaVersion: MALFORMED_MISSING_SPAN_GUARD_SCHEMA_VERSION,
    artifact_id: "fff-malformed-missing-span-guard-001",
    title: "Fast Fiction Factory Malformed/Missing Source-Span Guard",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    selected_guard_class: selectedFixture.class_id,
    selected_guard_label: selectedFixture.label,
    selected_fixture_path: selectedFixture.fixture_path,
    validator_smoke_path: toRepoPath(smokePath),
    source_pack_path: manifest.source_span_review_pack_path || "artifacts/source-span-routing-review-pack.json",
    preserved_missing_fixture_probe_path: manifest.missing_fixture_class_probe_result_path || DEFAULT_MISSING_FIXTURE_CLASS_PROBE_OUTPUT,
    review_memory_checked: {
      checked: true,
      target: "fff-missing-fixture-class-probe-001",
      prior_review_count: priorMemory?.prior_review_count ?? 0,
      prior_signal_summary: priorMemory?.latest_user_signal_summary || "No user review was requested for the sparse fixture probe slice.",
      axis: "malformed_missing_span_guard",
      what_changed: "A single negative extraction fixture now proves malformed, missing, or unusable source-span payloads are rejected by the local contract validator instead of entering routed candidates.",
      what_this_review_decides: "No user review is needed; this readback decides whether invalid source-span evidence is blocked before Profile, Claim, or Timeline adoption surfaces.",
      not_asking: [
        "general Review Hub review",
        "fixed-form review",
        "repeat sparse fixture review",
        "repeat weak-span review",
        "repeat broad-span review",
        "repeat ambiguous-routing review",
        "model/API approval",
        "provider credentials",
        "database or publishing contract changes",
        "production sync",
        "AI video generation",
        "final canon decisions for Toma fate, brass moth truth, or Council motive"
      ],
      next_nonredundant_axis: "choose a different remaining fixture class only after a new concrete coverage need is named"
    },
    guard_behavior: {
      reject_as_invalid: validation.ok === false,
      hold_as_unreviewable: nonHeldElements.length === 0,
      mark_missing_source_ref: missingSourceRefErrors.length >= 1,
      keep_out_of_claim_timeline_profile_adoption: acceptedRoutedCandidates.length === 0
    },
    coverage_decision: {
      known_missing_classes_before_guard: missingFixtureProbe?.coverage_decision?.remaining_fixture_class_candidates || [],
      selected_class_reason: "The prior sparse fixture probe left malformed or missing source-span payloads as a named remaining fixture class, and this can be covered locally as a negative validator fixture without model/API work or canon judgment.",
      covered_by_this_guard: [selectedFixture.label],
      remaining_fixture_class_candidates: remainingFixtureCandidates,
      source_pack_legacy_gap_list_still_present: sourcePackLegacyGaps
    },
    summary: {
      validator_fixture_count: smoke.summary?.fixtureCount,
      expected_invalid_fixture_count: smoke.summary?.expectedInvalid,
      selected_fixture_elements_checked: fixtureElements.length,
      candidate_surface_elements_checked: candidateSurfaceElements.length,
      source_span_errors: sourceSpanErrors.length,
      missing_source_ref_errors: missingSourceRefErrors.length,
      accepted_routed_candidates: acceptedRoutedCandidates.length,
      non_held_review_defaults: nonHeldElements.length,
      source_pack_rows_preserved: sourcePack.cross_fixture_summary?.total_elements,
      adapter_payloads_preserved: routingRegression.summary?.adapter_payloads_checked,
      adapter_elements_preserved: routingRegression.summary?.adapter_elements_checked,
      review_card_emitted: false,
      repeated_general_review_request_emitted: false,
      operator_observation_card_emitted: false,
      failures: failures.length
    },
    fixture_guard_checks: checks,
    expected_error_matches: expectedErrorMatches,
    failures,
    passed: failures.length === 0
  };
}

async function validateContradictoryClaimGuard(smoke, smokePath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const selectedFixture = {
    class_id: "contradictory_claim_hold",
    label: "contradictory memo claims",
    fixture_path: "artifacts/extraction-negative-fixtures/contradictory-claim-hold.json"
  };
  const manifest = await readJson("artifacts/artifact-manifest.json");
  const sourcePack = await readJson(manifest.source_span_review_pack_path || "artifacts/source-span-routing-review-pack.json");
  const malformedGuard = await readJson(manifest.malformed_missing_span_guard_result_path || DEFAULT_MALFORMED_MISSING_SPAN_GUARD_OUTPUT);
  const missingFixtureProbe = await readJson(manifest.missing_fixture_class_probe_result_path || DEFAULT_MISSING_FIXTURE_CLASS_PROBE_OUTPUT);
  const routingRegression = await readJson(manifest.routing_policy_regression_result_path || DEFAULT_ROUTING_POLICY_REGRESSION_OUTPUT);
  const weakSpanRepair = await readJson(manifest.weak_span_repair_result_path || DEFAULT_WEAK_SPAN_REPAIR_OUTPUT);
  const broadSpanSplit = await readJson(manifest.broad_span_split_result_path || DEFAULT_BROAD_SPAN_SPLIT_OUTPUT);
  const boundarySmoke = await readJson(manifest.model_api_boundary_smoke_path || "artifacts/model-api-boundary-smoke-result.json");
  const boundaryEnvelope = await readJson(manifest.model_api_boundary_envelope_path || "artifacts/model-api-boundary-envelope.example.json");
  const fixture = await readJson(selectedFixture.fixture_path);
  const validation = validateExtractionPayload(fixture);
  const fixtureResult = Array.isArray(smoke.results)
    ? smoke.results.find((result) => result.fixture === "contradictory-claim-hold.json")
    : null;
  const fixtureElements = Array.isArray(fixture.extractedElements) ? fixture.extractedElements : [];
  const claims = Array.isArray(fixture.claimCandidates) ? fixture.claimCandidates : [];
  const claimById = new Map(claims.map((claim) => [claim.id, claim]));
  const conflictingClaims = claims.filter((claim) => arrayLength(claim.contradictsClaimIds) > 0);
  const reciprocalConflictLinks = conflictingClaims.flatMap((claim) =>
    claim.contradictsClaimIds
      .filter((targetId) => claimById.get(targetId)?.contradictsClaimIds?.includes(claim.id))
      .map((targetId) => [claim.id, targetId].sort().join("<->"))
  );
  const reciprocalConflictPairCount = new Set(reciprocalConflictLinks).size;
  const nonHeldConflictClaims = conflictingClaims.filter((claim) => claim.reviewStatus !== "hold");
  const adoptedOrProvisionalConflictClaims = conflictingClaims.filter((claim) =>
    ["adopt", "provisional"].includes(claim.reviewStatus)
  );
  const nonUncertainConflictClaims = conflictingClaims.filter((claim) =>
    String(claim.worldTruthStatus || "").toLowerCase() !== "uncertain"
  );
  const conflictClaimsMissingSourceRefs = conflictingClaims.filter((claim) => !claimHasValidSourceRefs(claim, fixture.sourceRefs));
  const claimSurfaceElements = fixtureElements.filter((element) =>
    Array.isArray(element.targetDestinations) && element.targetDestinations.includes("claim")
  );
  const nonHeldClaimSurfaceElements = claimSurfaceElements.filter((element) =>
    element.reviewStatus !== "hold" || element.suggestedReviewStatus !== "hold"
  );
  const directAcceptedClaimElements = claimSurfaceElements.filter((element) =>
    ["adopt", "provisional"].includes(element.reviewStatus) ||
    ["adopt", "provisional"].includes(element.suggestedReviewStatus)
  );
  const priorMemory = manifest.review_memory?.find((entry) => entry.artifact_id === "fff-malformed-missing-span-guard-001");
  const sourcePackLegacyGaps = Array.isArray(sourcePack.cross_fixture_summary?.fixture_class_gaps)
    ? sourcePack.cross_fixture_summary.fixture_class_gaps
    : [];

  check(
    "prior_guard_sequence_preserved",
    malformedGuard?.passed === true &&
      missingFixtureProbe?.passed === true &&
      weakSpanRepair?.passed === true &&
      broadSpanSplit?.passed === true &&
      routingRegression?.passed === true,
    "malformed guard, sparse fixture probe, weak-span repair, broad-span split, and routing regression must remain closed"
  );
  check(
    "concrete_conflict_gap_named",
    sourcePackLegacyGaps.includes(selectedFixture.label) ||
      malformedGuard?.coverage_decision?.remaining_fixture_class_candidates?.includes(selectedFixture.label),
    "contradictory memo claims must be named by existing fixture debt"
  );
  check(
    "bounded_contradictory_fixture_added",
    smoke?.passed === true &&
      smoke.summary?.fixtureCount === 9 &&
      smoke.summary?.expectedValid === 3 &&
      smoke.summary?.expectedInvalid === 6 &&
      fixtureResult?.fixture === "contradictory-claim-hold.json" &&
      fixtureResult?.expected === "valid" &&
      fixtureResult?.actual === "valid" &&
      fixtureResult?.passed === true,
    `validator fixtures=${smoke.summary?.fixtureCount}; contradictory fixture actual=${fixtureResult?.actual || "missing"}`
  );
  check(
    "conflict_detected",
    validation.ok === true &&
      conflictingClaims.length === 2 &&
      reciprocalConflictPairCount === 1,
    `conflicting claims=${conflictingClaims.map((claim) => claim.id).join(", ") || "none"}; reciprocal pairs=${reciprocalConflictPairCount}`
  );
  check(
    "hold_for_human_review",
    nonHeldConflictClaims.length === 0 &&
      claimSurfaceElements.length >= 2 &&
      nonHeldClaimSurfaceElements.length === 0 &&
      fixture.reviewSafeDefaults?.defaultReviewStatus === "hold",
    `non-held conflict claims=${nonHeldConflictClaims.map((claim) => claim.id).join(", ") || "none"}; non-held claim elements=${nonHeldClaimSurfaceElements.map((element) => element.id).join(", ") || "none"}`
  );
  check(
    "keep_out_of_auto_canon",
    fixture.reviewSafeDefaults?.autoCanonPromotion === false &&
      fixture.reviewSafeDefaults?.autoChronologyPromotion === false &&
      adoptedOrProvisionalConflictClaims.length === 0 &&
      nonUncertainConflictClaims.length === 0,
    `adopted/provisional conflicts=${adoptedOrProvisionalConflictClaims.map((claim) => claim.id).join(", ") || "none"}; non-uncertain conflicts=${nonUncertainConflictClaims.map((claim) => claim.id).join(", ") || "none"}`
  );
  check(
    "keep_out_of_direct_claim_acceptance",
    directAcceptedClaimElements.length === 0 &&
      fixtureElements.every((element) => element.reviewStatus === "hold" && element.suggestedReviewStatus === "hold"),
    `direct accepted claim elements=${directAcceptedClaimElements.map((element) => element.id).join(", ") || "none"}`
  );
  check(
    "preserve_source_refs",
    conflictClaimsMissingSourceRefs.length === 0 &&
      claimSurfaceElements.every((element) => arrayLength(element.sourceRefIds) > 0),
    `claims missing source refs=${conflictClaimsMissingSourceRefs.map((claim) => claim.id).join(", ") || "none"}`
  );
  check(
    "existing_source_span_and_routing_counts_preserved",
    sourcePack?.passed === true &&
      sourcePack.cross_fixture_summary?.fixture_count === 4 &&
      sourcePack.cross_fixture_summary?.total_elements === 48 &&
      routingRegression.summary?.source_pack_rows_checked === 48 &&
      routingRegression.summary?.adapter_payloads_checked === 5 &&
      routingRegression.summary?.adapter_elements_checked === 60 &&
      malformedGuard.summary?.accepted_routed_candidates === 0,
    `source-pack rows=${sourcePack.cross_fixture_summary?.total_elements}; adapter elements=${routingRegression.summary?.adapter_elements_checked}; malformed accepted=${malformedGuard.summary?.accepted_routed_candidates}`
  );
  check(
    "no_review_card_or_model_api",
    priorMemory?.prior_review_count === 0 &&
      manifest.review_input_mode === "freeform" &&
      boundarySmoke?.passed === true &&
      boundarySmoke?.checks?.noExternalCall === true &&
      boundaryEnvelope?.providerBoundary?.externalCallAllowed === false,
    "Review stays freeform/local and model/API boundary remains no-call"
  );

  return {
    schemaVersion: CONTRADICTORY_CLAIM_GUARD_SCHEMA_VERSION,
    artifact_id: "fff-contradictory-claim-guard-001",
    title: "Fast Fiction Factory Contradictory Claim Guard",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    selected_guard_class: selectedFixture.class_id,
    selected_guard_label: selectedFixture.label,
    selected_fixture_path: selectedFixture.fixture_path,
    validator_smoke_path: toRepoPath(smokePath),
    source_pack_path: manifest.source_span_review_pack_path || "artifacts/source-span-routing-review-pack.json",
    preserved_malformed_missing_span_guard_path: manifest.malformed_missing_span_guard_result_path || DEFAULT_MALFORMED_MISSING_SPAN_GUARD_OUTPUT,
    review_memory_checked: {
      checked: true,
      target: "fff-malformed-missing-span-guard-001",
      prior_review_count: priorMemory?.prior_review_count ?? 0,
      prior_signal_summary: priorMemory?.latest_user_signal_summary || "No user review was requested for the malformed/missing source-span guard slice.",
      axis: "contradictory_claim_guard",
      what_changed: "A single Extraction Contract fixture now carries two source-backed, reciprocally linked contradictory claim candidates and proves they remain held instead of becoming canon or accepted Claim Ledger candidates.",
      what_this_review_decides: "No user review is needed; this readback decides whether explicit contradictory claims are detected, held, source-traced, and kept out of auto-canon/direct adoption.",
      not_asking: [
        "general Review Hub review",
        "fixed-form review",
        "repeat malformed/missing span review",
        "repeat sparse fixture review",
        "repeat weak-span review",
        "repeat broad-span review",
        "repeat ambiguous-routing review",
        "model/API approval",
        "provider credentials",
        "database or publishing contract changes",
        "production sync",
        "AI video generation",
        "final canon decisions for Toma fate, brass moth truth, Council motive, or which contradictory claim is true"
      ],
      next_nonredundant_axis: "very broad source-span fixture shape, multilingual memo text, or provider-envelope readiness only after a concrete coverage need is named"
    },
    guard_behavior: {
      conflict_detected: conflictingClaims.length === 2 && reciprocalConflictPairCount === 1,
      hold_for_human_review: nonHeldConflictClaims.length === 0 && nonHeldClaimSurfaceElements.length === 0,
      keep_out_of_auto_canon: adoptedOrProvisionalConflictClaims.length === 0 && fixture.reviewSafeDefaults?.autoCanonPromotion === false,
      keep_out_of_direct_claim_acceptance: directAcceptedClaimElements.length === 0,
      preserve_source_refs: conflictClaimsMissingSourceRefs.length === 0
    },
    coverage_decision: {
      known_missing_classes_before_guard: malformedGuard?.coverage_decision?.remaining_fixture_class_candidates || [],
      selected_class_reason: "Contradictory memo claims remained a named fixture class after sparse notes and malformed/missing source spans; a local hold-only fixture can cover the axis without deciding truth.",
      covered_by_this_guard: [selectedFixture.label],
      remaining_fixture_class_candidates: [
        "very broad source span fixture shape",
        "multilingual or translated memo text",
        "model/API provider envelope output"
      ],
      source_pack_legacy_gap_list_still_present: sourcePackLegacyGaps
    },
    summary: {
      validator_fixture_count: smoke.summary?.fixtureCount,
      expected_valid_fixture_count: smoke.summary?.expectedValid,
      expected_invalid_fixture_count: smoke.summary?.expectedInvalid,
      selected_fixture_elements_checked: fixtureElements.length,
      conflicting_claims_checked: conflictingClaims.length,
      reciprocal_conflict_pairs: reciprocalConflictPairCount,
      held_conflicting_claims: conflictingClaims.length - nonHeldConflictClaims.length,
      adopted_or_provisional_conflicting_claims: adoptedOrProvisionalConflictClaims.length,
      direct_accepted_claim_elements: directAcceptedClaimElements.length,
      source_ref_preserved_conflicting_claims: conflictingClaims.length - conflictClaimsMissingSourceRefs.length,
      source_pack_rows_preserved: sourcePack.cross_fixture_summary?.total_elements,
      adapter_payloads_preserved: routingRegression.summary?.adapter_payloads_checked,
      adapter_elements_preserved: routingRegression.summary?.adapter_elements_checked,
      malformed_guard_accepted_routed_candidates: malformedGuard.summary?.accepted_routed_candidates,
      review_card_emitted: false,
      repeated_general_review_request_emitted: false,
      operator_observation_card_emitted: false,
      failures: failures.length
    },
    fixture_guard_checks: checks,
    blocked_examples: {
      non_held_conflict_claims: nonHeldConflictClaims.map((claim) => claim.id),
      adopted_or_provisional_conflict_claims: adoptedOrProvisionalConflictClaims.map((claim) => claim.id),
      direct_accepted_claim_elements: directAcceptedClaimElements.map((element) => element.id),
      conflict_claims_missing_source_refs: conflictClaimsMissingSourceRefs.map((claim) => claim.id)
    },
    failures,
    passed: failures.length === 0
  };
}

async function validateDownstreamSourceSpanAdoptionGate(sourcePack, sourcePackPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const malformedGuard = await readJson(manifest.malformed_missing_span_guard_result_path || DEFAULT_MALFORMED_MISSING_SPAN_GUARD_OUTPUT);
  const routingRegression = await readJson(manifest.routing_policy_regression_result_path || DEFAULT_ROUTING_POLICY_REGRESSION_OUTPUT);
  const validatorSmoke = await readJson(manifest.validator_smoke_path || DEFAULT_EXTRACTION_FIXTURE_SMOKE_OUTPUT);
  const boundarySmoke = await readJson(manifest.model_api_boundary_smoke_path || "artifacts/model-api-boundary-smoke-result.json");
  const boundaryEnvelope = await readJson(manifest.model_api_boundary_envelope_path || "artifacts/model-api-boundary-envelope.example.json");
  const adapterPayloads = await readAdapterPayloads();
  const packElements = flattenSourcePackElements(sourcePack);
  const adapterElements = adapterPayloads.flatMap((payload) => Array.isArray(payload.extractedElements) ? payload.extractedElements : []);
  const adapterById = new Map(adapterElements.map((element) => [element.id, element]));
  const downstreamSurfaceNames = ["Claim", "Profile", "Timeline"];
  const downstreamDestinationNames = ["claim", "profile", "timeline"];
  const packDownstreamCandidates = packElements.filter((element) =>
    Array.isArray(element.routing_targets) &&
    element.routing_targets.some((target) => downstreamSurfaceNames.includes(target))
  );
  const sourceTrackedCandidates = packDownstreamCandidates.filter((element) => {
    const adapterElement = adapterById.get(element.id);
    return Boolean(adapterElement) &&
      element.source_span_matches_raw_memo === true &&
      arrayLength(element.source_ref_ids) > 0 &&
      hasValidSourceSpan(adapterElement) &&
      arrayLength(adapterElement.sourceRefIds) > 0;
  });
  const malformedOrMissingSpanCandidates = packDownstreamCandidates.filter((element) => {
    const adapterElement = adapterById.get(element.id);
    return !adapterElement || element.source_span_matches_raw_memo !== true || arrayLength(element.source_ref_ids) === 0 || !hasValidSourceSpan(adapterElement);
  });
  const unsafeRoutingCandidates = packDownstreamCandidates.filter((element) => isUnsafeDownstreamRoute(element, adapterById.get(element.id)));
  const humanOwnedCandidates = packDownstreamCandidates.filter((element) => element.human_owned_guard !== "none");
  const nonHeldHumanOwnedCandidates = humanOwnedCandidates.filter((element) =>
    element.review_status !== "hold" || element.suggested_review_status !== "hold"
  );
  const adoptedCandidates = packDownstreamCandidates.filter((element) =>
    element.review_status === "adopt" || element.suggested_review_status === "adopt"
  );
  const adapterAdoptDestinations = adapterElements.filter((element) =>
    Array.isArray(element.targetDestinations) &&
    element.targetDestinations.some((destination) => downstreamDestinationNames.includes(destination)) &&
    (element.reviewStatus === "adopt" || element.suggestedReviewStatus === "adopt")
  );
  const missingAdapterRows = packDownstreamCandidates.filter((element) => !adapterById.has(element.id));
  const priorMemory = manifest.review_memory?.find((entry) => entry.artifact_id === "fff-malformed-missing-span-guard-001");

  check(
    "source_pack_loaded",
    sourcePack?.artifact_id === "fff-source-span-routing-review-pack-001" &&
      sourcePack?.passed === true &&
      sourcePack.cross_fixture_summary?.total_elements === 48 &&
      packElements.length === 48,
    `loaded ${sourcePackPath}; rows=${packElements.length}`
  );
  check(
    "source_refs_and_spans_required_for_downstream_candidates",
    sourceTrackedCandidates.length === packDownstreamCandidates.length &&
      malformedOrMissingSpanCandidates.length === 0 &&
      sourcePack.cross_fixture_summary?.source_span_mismatches === 0 &&
      sourcePack.cross_fixture_summary?.missing_source_refs === 0,
    `downstream candidates=${packDownstreamCandidates.length}; missing-or-malformed=${malformedOrMissingSpanCandidates.map((element) => element.id).join(", ") || "none"}`
  );
  check(
    "routing_targets_safe_for_downstream_consideration",
    unsafeRoutingCandidates.length === 0 &&
      routingRegression?.passed === true &&
      routingRegression.summary?.source_pack_rows_checked === 48 &&
      routingRegression.summary?.adapter_payloads_checked === adapterPayloads.length &&
      routingRegression.routing_policy_checks?.visual_direct_claim_guard?.passed === true &&
      routingRegression.routing_policy_checks?.source_reference_preservation?.passed === true,
    `unsafe downstream routes=${unsafeRoutingCandidates.map((element) => element.id).join(", ") || "none"}`
  );
  check(
    "malformed_missing_span_guard_blocks_adoption",
    malformedGuard?.passed === true &&
      malformedGuard.guard_behavior?.reject_as_invalid === true &&
      malformedGuard.guard_behavior?.keep_out_of_claim_timeline_profile_adoption === true &&
      malformedGuard.summary?.accepted_routed_candidates === 0 &&
      validatorSmoke?.passed === true &&
      validatorSmoke.summary?.fixtureCount >= 8 &&
      validatorSmoke.summary?.expectedInvalid === 6,
    "malformed/missing span fixture remains invalid with zero accepted routed candidates"
  );
  check(
    "human_owned_decisions_remain_held",
    humanOwnedCandidates.length > 0 &&
      nonHeldHumanOwnedCandidates.length === 0 &&
      ["Toma fate", "brass moth truth", "Council motive"].every((dependency) =>
        sourcePack.human_owned_boundaries?.some((boundary) => boundary.dependency === dependency)
      ),
    `human-owned candidates=${humanOwnedCandidates.length}; non-held=${nonHeldHumanOwnedCandidates.map((element) => element.id).join(", ") || "none"}`
  );
  check(
    "no_actual_adoption_or_model_api_behavior",
    adoptedCandidates.length === 0 &&
      adapterAdoptDestinations.length === 0 &&
      boundarySmoke?.passed === true &&
      boundarySmoke?.checks?.noExternalCall === true &&
      boundaryEnvelope?.providerBoundary?.externalCallAllowed === false,
    `adopted downstream candidates=${adoptedCandidates.map((element) => element.id).join(", ") || "none"}`
  );
  check(
    "adapter_drift_visible_before_adoption",
    missingAdapterRows.length === 0 &&
      adapterPayloads.length === 5 &&
      adapterElements.length === 60,
    `missing adapter rows=${missingAdapterRows.map((element) => element.id).join(", ") || "none"}; adapter elements=${adapterElements.length}`
  );
  check(
    "review_memory_keeps_user_work_optional",
    priorMemory?.prior_review_count === 0 &&
      manifest.review_input_mode === "freeform" &&
      !String(manifest.review_prompt_hint || "").toLowerCase().includes("fixed form"),
    "freeform review remains optional and no fixed operator form is introduced"
  );

  return {
    schemaVersion: DOWNSTREAM_SOURCE_SPAN_ADOPTION_GATE_SCHEMA_VERSION,
    artifact_id: "fff-downstream-source-span-adoption-gate-001",
    title: "Fast Fiction Factory Downstream Source-Span Adoption Gate",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    source_artifact_id: sourcePack?.artifact_id,
    source_pack_path: toRepoPath(sourcePackPath),
    malformed_missing_span_guard_path: manifest.malformed_missing_span_guard_result_path || DEFAULT_MALFORMED_MISSING_SPAN_GUARD_OUTPUT,
    routing_policy_regression_path: manifest.routing_policy_regression_result_path || DEFAULT_ROUTING_POLICY_REGRESSION_OUTPUT,
    validator_smoke_path: manifest.validator_smoke_path || DEFAULT_EXTRACTION_FIXTURE_SMOKE_OUTPUT,
    review_memory_checked: {
      checked: true,
      target: "fff-malformed-missing-span-guard-001",
      prior_review_count: priorMemory?.prior_review_count ?? 0,
      prior_signal_summary: priorMemory?.latest_user_signal_summary || "Malformed/missing source-span guard completed without user review and kept invalid evidence out of routed candidates.",
      axis: "downstream_source_span_adoption_gate",
      what_changed: "A deterministic readback now checks whether only source-tracked, valid-span, safe-routed, review-held elements can be considered for downstream Profile, Claim, or Timeline adoption paths.",
      what_this_review_decides: "No user review is needed; this gate decides whether downstream adoption remains blocked unless source refs, source spans, routing, and human-owned holds are all intact.",
      not_asking: [
        "general Review Hub review",
        "fixed-form review",
        "repeat malformed/missing span review",
        "model/API approval",
        "provider credentials",
        "database persistence",
        "publishing or production sync",
        "AI video generation",
        "final canon decisions for Toma fate, brass moth truth, or Council motive"
      ],
      next_nonredundant_axis: "provider-envelope readiness or one concrete fixture class only after a new coverage need is named"
    },
    gate_policy: {
      downstream_candidate_means: "eligible for local review/readback only, not adopted canon or project-state mutation",
      required_preconditions: [
        "source refs exist",
        "sourceSpan text/start/end are valid and match the local memo",
        "routing target is not unsafe",
        "human-owned unresolved decisions remain held",
        "malformed or missing source-span cases remain invalid",
        "model/API boundary remains no-call"
      ],
      actual_downstream_adoption_implemented: false,
      ready_for_final_canon_or_production: false
    },
    summary: {
      source_pack_rows_checked: packElements.length,
      downstream_candidates_reported_for_review: packDownstreamCandidates.length,
      source_tracked_downstream_candidates: sourceTrackedCandidates.length,
      malformed_or_missing_span_candidates: malformedOrMissingSpanCandidates.length,
      unsafe_routing_candidates: unsafeRoutingCandidates.length,
      human_owned_candidates_held: humanOwnedCandidates.length - nonHeldHumanOwnedCandidates.length,
      human_owned_candidates_non_held: nonHeldHumanOwnedCandidates.length,
      malformed_guard_accepted_routed_candidates: malformedGuard.summary?.accepted_routed_candidates,
      adopted_profile_claim_timeline_candidates: adoptedCandidates.length + adapterAdoptDestinations.length,
      adapter_payloads_checked: adapterPayloads.length,
      adapter_elements_checked: adapterElements.length,
      review_card_emitted: false,
      repeated_general_review_request_emitted: false,
      operator_observation_card_emitted: false,
      failures: failures.length
    },
    downstream_gate_checks: checks,
    blocked_examples: {
      malformed_or_missing_span_candidates: malformedOrMissingSpanCandidates.map((element) => element.id),
      unsafe_routing_candidates: unsafeRoutingCandidates.map((element) => element.id),
      non_held_human_owned_candidates: nonHeldHumanOwnedCandidates.map((element) => element.id),
      adopted_candidates: adoptedCandidates.map((element) => element.id).concat(adapterAdoptDestinations.map((element) => element.id))
    },
    failures,
    passed: failures.length === 0
  };
}

async function validateProviderEnvelopeReadinessNoCall(envelope, envelopePath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const validatorSmoke = await readJson(manifest.validator_smoke_path || DEFAULT_EXTRACTION_FIXTURE_SMOKE_OUTPUT);
  const sourcePack = await readJson(manifest.source_span_review_pack_path || "artifacts/source-span-routing-review-pack.json");
  const malformedGuard = await readJson(manifest.malformed_missing_span_guard_result_path || DEFAULT_MALFORMED_MISSING_SPAN_GUARD_OUTPUT);
  const contradictoryGuard = await readJson(manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT);
  const downstreamGate = await readJson(manifest.downstream_source_span_adoption_gate_result_path || DEFAULT_DOWNSTREAM_SOURCE_SPAN_ADOPTION_GATE_OUTPUT);
  const boundarySmoke = await readJson(manifest.model_api_boundary_smoke_path || "artifacts/model-api-boundary-smoke-result.json");
  const boundaryEnvelope = await readJson(manifest.model_api_boundary_envelope_path || "artifacts/model-api-boundary-envelope.example.json");

  const provider = envelope?.providerRunMetadata || {};
  const output = envelope?.extractionOutput || {};
  const candidateContract = output.candidateExtractionContract;
  const validation = validateExtractionPayload(candidateContract);
  const elements = Array.isArray(candidateContract?.extractedElements) ? candidateContract.extractedElements : [];
  const claims = Array.isArray(candidateContract?.claimCandidates) ? candidateContract.claimCandidates : [];
  const sourceRefs = Array.isArray(candidateContract?.sourceRefs) ? candidateContract.sourceRefs : [];
  const sourceRefIds = new Set(sourceRefs.map((sourceRef) => sourceRef?.id).filter(Boolean));
  const sourceTrackedElements = elements.filter((element) =>
    hasValidSourceSpan(element) &&
      Array.isArray(element.sourceRefIds) &&
      element.sourceRefIds.length > 0 &&
      element.sourceRefIds.every((sourceRefId) => sourceRefIds.has(sourceRefId))
  );
  const humanOwnedElements = elements.filter((element) => touchesHumanOwnedDecision(element));
  const nonHeldHumanOwnedElements = humanOwnedElements.filter((element) =>
    element.reviewStatus !== "hold" || element.suggestedReviewStatus !== "hold"
  );
  const visualDirectClaimElements = elements.filter((element) =>
    element.elementType === "visual_asset" &&
      Array.isArray(element.targetDestinations) &&
      element.targetDestinations.includes("claim") &&
      !element.targetDestinations.includes("profile")
  );
  const adoptedOrProvisionalElements = elements.filter((element) =>
    ["adopt", "provisional"].includes(element.reviewStatus) ||
      ["adopt", "provisional"].includes(element.suggestedReviewStatus)
  );
  const adoptedOrProvisionalClaims = claims.filter((claim) =>
    ["adopt", "provisional"].includes(claim.reviewStatus)
  );
  const conflictingClaims = claims.filter((claim) => arrayLength(claim.contradictsClaimIds) > 0);
  const nonHeldConflictingClaims = conflictingClaims.filter((claim) => claim.reviewStatus !== "hold");
  const secretMaterialFindings = collectCredentialMaterial(envelope);
  const gateBindings = envelope?.gateBindings || {};
  const humanBoundaryText = Array.isArray(candidateContract?.humanAuthorityBoundaries)
    ? candidateContract.humanAuthorityBoundaries.join(" ").toLowerCase()
    : "";

  check(
    "provider_envelope_identity",
    envelope?.schemaVersion === PROVIDER_ENVELOPE_READINESS_NO_CALL_SCHEMA_VERSION &&
      envelope?.artifact_id === "fff-provider-envelope-readiness-no-call-001" &&
      String(envelope?.boundaryMode || "").includes("no_call"),
    `schemaVersion=${envelope?.schemaVersion}; artifact_id=${envelope?.artifact_id}; boundaryMode=${envelope?.boundaryMode}`
  );
  check(
    "no_provider_call_or_credentials",
    provider.providerConfigured === false &&
      provider.externalCallAttempted === false &&
      provider.credentialsRequired === false &&
      provider.credentialsTouched === false &&
      provider.endpoint === null &&
      provider.providerName === null &&
      provider.modelName === null &&
      Array.isArray(provider.credentialNames) &&
      provider.credentialNames.length === 0 &&
      secretMaterialFindings.length === 0,
    `providerConfigured=${provider.providerConfigured}; externalCallAttempted=${provider.externalCallAttempted}; credential findings=${secretMaterialFindings.join(", ") || "none"}`
  );
  check(
    "candidate_extraction_contract_validates",
    output.targetSchemaVersion === EXTRACTION_SCHEMA_VERSION &&
      output.outputIsProjectState === false &&
      output.directStateMutationAllowed === false &&
      validation.ok === true,
    `targetSchemaVersion=${output.targetSchemaVersion}; validation errors=${validation.errors.join("; ") || "none"}`
  );
  check(
    "source_refs_and_spans_present_before_downstream",
    elements.length > 0 &&
      sourceTrackedElements.length === elements.length &&
      sourceRefs.length > 0,
    `elements=${elements.length}; source-tracked=${sourceTrackedElements.length}; sourceRefs=${sourceRefs.length}`
  );
  check(
    "existing_guard_chain_is_bound",
    validatorSmoke?.passed === true &&
      malformedGuard?.passed === true &&
      contradictoryGuard?.passed === true &&
      downstreamGate?.passed === true &&
      sourcePack?.passed === true &&
      gateBindings.malformedMissingSpanGuard?.resultPath === (manifest.malformed_missing_span_guard_result_path || DEFAULT_MALFORMED_MISSING_SPAN_GUARD_OUTPUT) &&
      gateBindings.contradictoryClaimGuard?.resultPath === (manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT) &&
      gateBindings.downstreamSourceSpanAdoptionGate?.resultPath === (manifest.downstream_source_span_adoption_gate_result_path || DEFAULT_DOWNSTREAM_SOURCE_SPAN_ADOPTION_GATE_OUTPUT),
    "validator, malformed/missing, contradictory, downstream, and source-pack gates must remain referenced and passing"
  );
  check(
    "routing_and_contradiction_guards_not_bypassed",
    visualDirectClaimElements.length === 0 &&
      nonHeldConflictingClaims.length === 0 &&
      contradictoryGuard.summary?.adopted_or_provisional_conflicting_claims === 0 &&
      downstreamGate.summary?.adopted_profile_claim_timeline_candidates === 0,
    `visual direct Claim routes=${visualDirectClaimElements.map((element) => element.id).join(", ") || "none"}; non-held conflicts=${nonHeldConflictingClaims.map((claim) => claim.id).join(", ") || "none"}`
  );
  check(
    "human_owned_decisions_remain_held",
    ["toma fate", "brass moth truth", "council motive"].every((decision) => humanBoundaryText.includes(decision)) &&
      nonHeldHumanOwnedElements.length === 0 &&
      candidateContract?.reviewSafeDefaults?.defaultReviewStatus === "hold" &&
      candidateContract?.reviewSafeDefaults?.autoCanonPromotion === false &&
      candidateContract?.reviewSafeDefaults?.autoChronologyPromotion === false,
    `human-owned elements=${humanOwnedElements.length}; non-held=${nonHeldHumanOwnedElements.map((element) => element.id).join(", ") || "none"}`
  );
  check(
    "no_adopted_canon_or_project_state_output",
    adoptedOrProvisionalElements.length === 0 &&
      adoptedOrProvisionalClaims.length === 0 &&
      output.adoptedCanonOutputCreated === false &&
      envelope?.reviewSurface?.createsAdoptedCanon === false,
    `adopted/provisional elements=${adoptedOrProvisionalElements.map((element) => element.id).join(", ") || "none"}; adopted/provisional claims=${adoptedOrProvisionalClaims.map((claim) => claim.id).join(", ") || "none"}`
  );
  check(
    "model_api_boundary_remains_no_call",
    boundarySmoke?.passed === true &&
      boundarySmoke?.checks?.noExternalCall === true &&
      boundarySmoke?.checks?.noCredentials === true &&
      boundaryEnvelope?.providerBoundary?.externalCallAllowed === false &&
      boundaryEnvelope?.providerBoundary?.providerConfigured === false,
    "preserved model/API boundary must remain spec-only, no-call, and no-credential"
  );
  check(
    "review_hub_gate_is_readiness_only",
    manifest.artifact_id === "fff-contradictory-claim-guard-001" &&
      manifest.review_input_mode === "freeform" &&
      envelope?.reviewSurface?.reviewCardRequired === false &&
      envelope?.reviewSurface?.operatorObservationCardRequired === false,
    "active Review Hub identity stays contradictory-claim guard and user-side work remains optional"
  );

  return {
    schemaVersion: PROVIDER_ENVELOPE_READINESS_NO_CALL_SCHEMA_VERSION,
    artifact_id: "fff-provider-envelope-readiness-no-call-001",
    title: "Fast Fiction Factory Provider Envelope Readiness No-Call Gate",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    boundaryMode: envelope?.boundaryMode,
    envelope_path: toRepoPath(envelopePath),
    preserved_active_artifact_id: manifest.artifact_id,
    preserved_model_api_boundary_artifact_id: manifest.preserved_model_api_boundary_artifact_id || "fff-model-api-boundary-spec-001",
    provider_metadata: {
      runId: provider.runId || null,
      providerConfigured: provider.providerConfigured === true,
      providerName: provider.providerName || null,
      modelName: provider.modelName || null,
      externalCallAttempted: provider.externalCallAttempted === true,
      credentialsTouched: provider.credentialsTouched === true
    },
    gate_bindings: {
      validator_smoke_path: manifest.validator_smoke_path || DEFAULT_EXTRACTION_FIXTURE_SMOKE_OUTPUT,
      malformed_missing_span_guard_path: manifest.malformed_missing_span_guard_result_path || DEFAULT_MALFORMED_MISSING_SPAN_GUARD_OUTPUT,
      contradictory_claim_guard_path: manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT,
      downstream_source_span_adoption_gate_path: manifest.downstream_source_span_adoption_gate_result_path || DEFAULT_DOWNSTREAM_SOURCE_SPAN_ADOPTION_GATE_OUTPUT,
      source_pack_path: manifest.source_span_review_pack_path || "artifacts/source-span-routing-review-pack.json",
      model_api_boundary_envelope_path: manifest.model_api_boundary_envelope_path || "artifacts/model-api-boundary-envelope.example.json"
    },
    review_memory_checked: {
      checked: true,
      target: "fff-contradictory-claim-guard-001",
      prior_review_count: manifest.review_memory?.find((entry) => entry.artifact_id === "fff-contradictory-claim-guard-001")?.prior_review_count ?? 0,
      axis: "provider_envelope_readiness_no_call",
      what_changed: "A no-provider fixture now proves a future provider envelope can declare run metadata, carry Extraction Contract output, and bind to existing source-span, routing, contradictory-claim, downstream, and human-owned decision gates without making any provider call.",
      what_this_review_decides: "No user review is needed; this readback decides whether a future provider adapter has a local envelope shape to satisfy before credentials or real calls exist.",
      not_asking: [
        "provider choice",
        "credentials",
        "model/API call approval",
        "production sync",
        "database persistence",
        "publishing",
        "AI video generation",
        "final canon decisions"
      ],
      next_nonredundant_axis: "provider adapter implementation only after explicit authorization, or one remaining fixture class if coverage rather than provider work is chosen"
    },
    readiness_policy: {
      provider_call_allowed: false,
      credentials_allowed: false,
      provider_endpoint_allowed: false,
      output_is_project_state: false,
      direct_state_mutation_allowed: false,
      adopted_canon_output_created: false,
      production_sync_allowed: false
    },
    summary: {
      candidate_extraction_contract_valid: validation.ok,
      candidate_elements_checked: elements.length,
      source_tracked_elements: sourceTrackedElements.length,
      human_owned_elements_held: humanOwnedElements.length - nonHeldHumanOwnedElements.length,
      non_held_human_owned_elements: nonHeldHumanOwnedElements.length,
      visual_direct_claim_routes: visualDirectClaimElements.length,
      conflicting_claims_in_candidate: conflictingClaims.length,
      non_held_conflicting_claims: nonHeldConflictingClaims.length,
      adopted_or_provisional_elements: adoptedOrProvisionalElements.length,
      adopted_or_provisional_claims: adoptedOrProvisionalClaims.length,
      validator_fixture_count: validatorSmoke.summary?.fixtureCount,
      malformed_guard_failures: malformedGuard.summary?.failures,
      contradictory_guard_failures: contradictoryGuard.summary?.failures,
      downstream_gate_failures: downstreamGate.summary?.failures,
      review_card_emitted: false,
      repeated_general_review_request_emitted: false,
      operator_observation_card_emitted: false,
      failures: failures.length
    },
    provider_envelope_checks: checks,
    blocked_examples: {
      credential_material_findings: secretMaterialFindings,
      non_held_human_owned_elements: nonHeldHumanOwnedElements.map((element) => element.id),
      visual_direct_claim_routes: visualDirectClaimElements.map((element) => element.id),
      non_held_conflicting_claims: nonHeldConflictingClaims.map((claim) => claim.id),
      adopted_or_provisional_elements: adoptedOrProvisionalElements.map((element) => element.id),
      adopted_or_provisional_claims: adoptedOrProvisionalClaims.map((claim) => claim.id)
    },
    failures,
    passed: failures.length === 0
  };
}

async function readAdapterPayloads() {
  const payloads = [];
  for (const filePath of ["artifacts/local-extraction-adapter-output.json"]) {
    const payload = await readJson(filePath);
    payload.__path = toRepoPath(filePath);
    payloads.push(payload);
  }

  const outputDir = "artifacts/extraction-adapter-outputs";
  const entries = await readdir(outputDir, { withFileTypes: true });
  for (const entry of entries.filter((item) => item.isFile() && item.name.endsWith(".json")).sort((a, b) => a.name.localeCompare(b.name))) {
    const filePath = toRepoPath(path.join(outputDir, entry.name));
    const payload = await readJson(filePath);
    payload.__path = filePath;
    payloads.push(payload);
  }
  return payloads;
}

function flattenSourcePackElements(sourcePack) {
  if (!Array.isArray(sourcePack?.fixtures)) {
    return [];
  }
  return sourcePack.fixtures.flatMap((fixture) => Array.isArray(fixture.elements) ? fixture.elements : []);
}

function claimHasValidSourceRefs(claim, contractSourceRefs) {
  const sourceIds = new Set(
    Array.isArray(contractSourceRefs)
      ? contractSourceRefs.map((sourceRef) => sourceRef?.id).filter(Boolean)
      : []
  );
  return Array.isArray(claim?.sourceRefs) &&
    claim.sourceRefs.length > 0 &&
    claim.sourceRefs.every((sourceRef) => {
      const sourceRefId = typeof sourceRef === "string" ? sourceRef : sourceRef?.id;
      return typeof sourceRefId === "string" && sourceIds.has(sourceRefId);
    });
}

function hasValidSourceSpan(element) {
  const span = element?.sourceSpan;
  return Boolean(span) &&
    typeof span === "object" &&
    typeof span.text === "string" &&
    span.text.trim().length > 0 &&
    Number.isInteger(span.start) &&
    Number.isInteger(span.end) &&
    span.start >= 0 &&
    span.end > span.start;
}

function isUnsafeDownstreamRoute(packElement, adapterElement) {
  const packRoutes = Array.isArray(packElement?.routing_targets) ? packElement.routing_targets : [];
  const adapterDestinations = Array.isArray(adapterElement?.targetDestinations) ? adapterElement.targetDestinations : [];
  if (packElement?.element_type === "visual_asset" && packRoutes.includes("Claim")) {
    return true;
  }
  if (adapterElement?.elementType === "visual_asset" && adapterDestinations.includes("claim")) {
    return true;
  }
  if (packElement?.element_type === "source_reference" && packRoutes.some((target) => ["Claim", "Profile", "Timeline"].includes(target))) {
    return true;
  }
  if (adapterElement?.elementType === "source_reference" && adapterDestinations.some((target) => ["claim", "profile", "timeline"].includes(target))) {
    return true;
  }
  if (packElement?.element_type === "unresolved_decision" && !packRoutes.includes("Human Review")) {
    return true;
  }
  if (adapterElement?.elementType === "unresolved_decision" && !adapterDestinations.includes("unresolved_decision")) {
    return true;
  }
  return false;
}

function arrayLength(value) {
  return Array.isArray(value) ? value.length : 0;
}

function arrayIncludesIgnoreCase(value, expected) {
  if (!Array.isArray(value)) {
    return false;
  }
  const target = String(expected).toLowerCase();
  return value.some((item) => String(item).toLowerCase() === target);
}

function arrayIncludesSubstring(value, expected) {
  if (!Array.isArray(value)) {
    return false;
  }
  const target = String(expected).toLowerCase();
  return value.some((item) => String(item).toLowerCase().includes(target));
}

function arrayEqualsIgnoreCase(value, expected) {
  if (!Array.isArray(value) || value.length !== expected.length) {
    return false;
  }
  return value.every((item, index) => String(item).toLowerCase() === String(expected[index]).toLowerCase());
}

function hasHumanOwnedDependency(decision) {
  const searchable = [
    decision.extracted_value,
    decision.hold_reason,
    decision.guard_condition,
    ...(Array.isArray(decision.unresolvedDependencies) ? decision.unresolvedDependencies : [])
  ].filter(Boolean).join(" ").toLowerCase();
  return HUMAN_OWNED_DECISIONS.some((item) => searchable.includes(item.toLowerCase()));
}

function toRepoPath(filePath) {
  const relativePath = path.isAbsolute(filePath) ? path.relative(process.cwd(), filePath) : filePath;
  return relativePath.replace(/\\/g, "/");
}

function validateExtractionContract(contract, options = {}) {
  const label = options.label || "extraction contract";
  const errors = [];
  const warnings = [];

  if (!contract || typeof contract !== "object" || Array.isArray(contract)) {
    return { ok: false, errors: [`${label} must be an object`], warnings };
  }

  const knownContractFields = new Set(EXTRACTION_CONTRACT_REQUIRED_FIELDS);
  for (const field of Object.keys(contract)) {
    if (!knownContractFields.has(field)) {
      warnings.push(`${label} unknown top-level field ${field} will be preserved for JSON review`);
    }
  }

  for (const field of EXTRACTION_CONTRACT_REQUIRED_FIELDS) {
    if (!(field in contract)) {
      errors.push(`${label} missing ${field}`);
    }
  }

  if (contract.schemaVersion !== undefined && contract.schemaVersion !== EXTRACTION_SCHEMA_VERSION) {
    errors.push(`${label} schemaVersion must be ${EXTRACTION_SCHEMA_VERSION}`);
  }

  for (const arrayField of ["sourceRefs", "extractedElements", "profileCandidates", "claimCandidates", "timelineEntryCandidates", "unresolvedDependencies", "warnings", "humanAuthorityBoundaries"]) {
    if (arrayField in contract && !Array.isArray(contract[arrayField])) {
      errors.push(`${label} ${arrayField} must be an array`);
    }
  }

  const sourceRefIds = validateExtractionSources(contract, label, errors);
  validateReviewSafeDefaults(contract, label, errors);
  validateDecisionLogSafety(contract, label, errors);
  validateHumanAuthorityBoundaries(contract, label, errors);
  validateExtractionElements(contract, label, sourceRefIds, options, errors);
  validateExtractionClaimCandidates(contract, label, sourceRefIds, errors);

  return { ok: errors.length === 0, errors, warnings };
}

function validateExtractionSources(contract, label, errors) {
  const sourceRefIds = new Set();
  if (!Array.isArray(contract.sourceRefs)) {
    return sourceRefIds;
  }

  contract.sourceRefs.forEach((sourceRef, index) => {
    if (!sourceRef || typeof sourceRef !== "object" || Array.isArray(sourceRef)) {
      errors.push(`${label} sourceRef ${index} must be an object`);
      return;
    }
    if (!sourceRef.id || typeof sourceRef.id !== "string") {
      errors.push(`${label} sourceRef ${index} missing id`);
      return;
    }
    if (sourceRefIds.has(sourceRef.id)) {
      errors.push(`${label} duplicate sourceRef id ${sourceRef.id}`);
    }
    sourceRefIds.add(sourceRef.id);
  });

  return sourceRefIds;
}

function validateReviewSafeDefaults(contract, label, errors) {
  const defaults = contract.reviewSafeDefaults;
  if (!defaults || typeof defaults !== "object" || Array.isArray(defaults)) {
    errors.push(`${label} reviewSafeDefaults must be an object`);
    return;
  }

  for (const field of REVIEW_SAFE_DEFAULT_FIELDS) {
    if (!(field in defaults)) {
      errors.push(`${label} reviewSafeDefaults missing ${field}`);
    }
  }

  if (defaults.defaultReviewStatus === "adopt") {
    errors.push(`${label} reviewSafeDefaults.defaultReviewStatus must not be adopt`);
  }
  if (defaults.autoCanonPromotion !== false) {
    errors.push(`${label} reviewSafeDefaults.autoCanonPromotion must be false`);
  }
  if (defaults.autoChronologyPromotion !== false) {
    errors.push(`${label} reviewSafeDefaults.autoChronologyPromotion must be false`);
  }
  const unknownSourceHandling = String(defaults.unknownSourceHandling || "").toLowerCase();
  if (!unknownSourceHandling.includes("preserve") || !unknownSourceHandling.includes("hold")) {
    errors.push(`${label} reviewSafeDefaults.unknownSourceHandling must preserve unknown fields and hold candidates`);
  }
  if (defaults.defaultReviewStatus && !REVIEW_STATUSES.includes(defaults.defaultReviewStatus)) {
    errors.push(`${label} reviewSafeDefaults.defaultReviewStatus must be one of ${REVIEW_STATUSES.join(", ")}`);
  }
}

function validateDecisionLogSafety(contract, label, errors) {
  const metadata = contract.decisionLogSafeMetadata;
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    errors.push(`${label} decisionLogSafeMetadata must be an object`);
    return;
  }

  for (const field of DECISION_LOG_SAFE_FIELDS) {
    if (!(field in metadata)) {
      errors.push(`${label} decisionLogSafeMetadata missing ${field}`);
    }
  }

  if (metadata.owner !== "human_author") {
    errors.push(`${label} decisionLogSafeMetadata.owner must be human_author`);
  }
  if (metadata.fixedPhraseRequired !== false) {
    errors.push(`${label} decisionLogSafeMetadata.fixedPhraseRequired must be false`);
  }
  if (metadata.freeformReviewAllowed !== true) {
    errors.push(`${label} decisionLogSafeMetadata.freeformReviewAllowed must be true`);
  }
  if (metadata.reversibleActionsOnly !== true) {
    errors.push(`${label} decisionLogSafeMetadata.reversibleActionsOnly must be true`);
  }
}

function validateHumanAuthorityBoundaries(contract, label, errors) {
  if (!("humanAuthorityBoundaries" in contract)) {
    return;
  }
  if (!Array.isArray(contract.humanAuthorityBoundaries) || contract.humanAuthorityBoundaries.length === 0) {
    errors.push(`${label} missing humanAuthorityBoundaries`);
    return;
  }

  const boundaryText = contract.humanAuthorityBoundaries.join(" ").toLowerCase();
  if (!boundaryText.includes("freeform") || !boundaryText.includes("source of truth")) {
    errors.push(`${label} humanAuthorityBoundaries must preserve freeform user review as source of truth`);
  }
  for (const decision of HUMAN_OWNED_DECISIONS) {
    if (!boundaryText.includes(decision.toLowerCase())) {
      errors.push(`${label} humanAuthorityBoundaries missing ${decision}`);
    }
  }
}

function validateExtractionElements(contract, label, sourceRefIds, options, errors) {
  const elements = Array.isArray(contract.extractedElements) ? contract.extractedElements : [];
  const elementTypes = new Set();
  const hasHighRisk = elements.some((element) => element?.canonRisk === "high" || touchesHumanOwnedDecision(element));

  if (hasHighRisk && (!Array.isArray(contract.warnings) || contract.warnings.length === 0)) {
    errors.push(`${label} warnings array must be present and non-empty when canon risk is high`);
  }

  elements.forEach((element, elementIndex) => {
    const elementLabel = `extraction element ${element?.id || elementIndex}`;
    if (!element || typeof element !== "object" || Array.isArray(element)) {
      errors.push(`${elementLabel} must be an object`);
      return;
    }

    for (const field of EXTRACTION_ELEMENT_REQUIRED_FIELDS) {
      if (!(field in element)) {
        errors.push(`${elementLabel} missing ${field}`);
      }
    }
    for (const arrayField of ["aliases", "sourceRefIds", "unresolvedDependencies", "targetDestinations"]) {
      if (arrayField in element && !Array.isArray(element[arrayField])) {
        errors.push(`${elementLabel} ${arrayField} must be an array`);
      }
    }
    validateElementSourceSpan(element, elementLabel, errors);

    if (element.elementType) {
      elementTypes.add(element.elementType);
      if (!REQUIRED_EXTRACTION_ELEMENT_TYPES.includes(element.elementType)) {
        errors.push(`${elementLabel} invalid elementType ${element.elementType}`);
      }
    }

    if (Array.isArray(element.sourceRefIds)) {
      if (element.sourceRefIds.length === 0) {
        errors.push(`${elementLabel} sourceRefIds must reference at least one source ref`);
      }
      for (const sourceRefId of element.sourceRefIds) {
        if (!sourceRefIds.has(sourceRefId)) {
          errors.push(`${elementLabel} sourceRefIds contains unknown source ref ${sourceRefId}`);
        }
      }
    }

    if (typeof element.confidence === "number" && (element.confidence < 0 || element.confidence > 1)) {
      errors.push(`${elementLabel} confidence must be between 0 and 1`);
    }
    if (element.suggestedReviewStatus && !REVIEW_STATUSES.includes(element.suggestedReviewStatus)) {
      errors.push(`${elementLabel} suggestedReviewStatus must be one of ${REVIEW_STATUSES.join(", ")}`);
    }

    if (Array.isArray(element.targetDestinations)) {
      if (element.targetDestinations.length === 0) {
        errors.push(`${elementLabel} targetDestinations must not be empty`);
      }
      for (const destination of element.targetDestinations) {
        if (!EXTRACTION_TARGET_DESTINATIONS.includes(destination)) {
          errors.push(`${elementLabel} invalid targetDestination ${destination}`);
        }
      }
      if (element.elementType === "visual_asset" && element.targetDestinations.includes("claim") && !element.targetDestinations.includes("profile")) {
        errors.push(`${elementLabel} visual_asset must not route directly to Claim Ledger`);
      }
    }

    if (touchesHumanOwnedDecision(element) && element.suggestedReviewStatus === "adopt") {
      errors.push(`${elementLabel} touches a human-owned decision and must not suggest adopt`);
    }
    if (touchesHumanOwnedDecision(element) && typeof element.confidence === "number" && element.confidence >= 0.9 && element.suggestedReviewStatus !== "hold") {
      errors.push(`${elementLabel} is overconfident on a human-owned decision; suggestedReviewStatus must remain hold`);
    }
  });

  if (options.requireCompleteElementTypeCoverage) {
    for (const elementType of REQUIRED_EXTRACTION_ELEMENT_TYPES) {
      if (!elementTypes.has(elementType)) {
        errors.push(`${label} missing elementType ${elementType}`);
      }
    }
  }
}

function validateElementSourceSpan(element, elementLabel, errors) {
  const sourceSpan = element.sourceSpan;
  if (!sourceSpan || typeof sourceSpan !== "object" || Array.isArray(sourceSpan)) {
    errors.push(`${elementLabel} sourceSpan must be an object`);
    return;
  }

  if (typeof sourceSpan.text !== "string" || sourceSpan.text.trim().length === 0) {
    errors.push(`${elementLabel} sourceSpan.text must be a non-empty string`);
  }
  if (!Number.isInteger(sourceSpan.start) || sourceSpan.start < 0) {
    errors.push(`${elementLabel} sourceSpan.start must be a non-negative integer`);
  }
  if (!Number.isInteger(sourceSpan.end) || sourceSpan.end < 0) {
    errors.push(`${elementLabel} sourceSpan.end must be a non-negative integer`);
  }
  if (Number.isInteger(sourceSpan.start) && Number.isInteger(sourceSpan.end) && sourceSpan.end <= sourceSpan.start) {
    errors.push(`${elementLabel} sourceSpan.end must be greater than sourceSpan.start`);
  }
}

function touchesHumanOwnedDecision(element) {
  if (!element || typeof element !== "object") {
    return false;
  }
  if (element.elementType === "unresolved_decision") {
    return true;
  }
  const dependencies = Array.isArray(element.unresolvedDependencies) ? element.unresolvedDependencies : [];
  const searchable = [
    element.displayText,
    element.notes,
    ...dependencies
  ].filter(Boolean).join(" ").toLowerCase();
  return HUMAN_OWNED_DECISIONS.some((decision) => searchable.includes(decision.toLowerCase()));
}

function validateExtractionClaimCandidates(contract, label, sourceRefIds, errors) {
  const claims = Array.isArray(contract.claimCandidates) ? contract.claimCandidates : [];
  const claimById = new Map();

  claims.forEach((claim, index) => {
    const claimLabel = `claim candidate ${claim?.id || index}`;
    if (!claim || typeof claim !== "object" || Array.isArray(claim)) {
      errors.push(`${claimLabel} must be an object`);
      return;
    }
    if (!claim.id || typeof claim.id !== "string") {
      errors.push(`${claimLabel} missing id`);
      return;
    }
    if (claimById.has(claim.id)) {
      errors.push(`${label} duplicate claim candidate id ${claim.id}`);
    }
    claimById.set(claim.id, claim);
  });

  claims.forEach((claim, index) => {
    const claimLabel = `claim candidate ${claim?.id || index}`;
    if (!claim || typeof claim !== "object" || Array.isArray(claim)) {
      return;
    }

    for (const arrayField of ["sourceRefs", "subjectRefs", "unresolvedDependencies", "supportsClaimIds", "contradictsClaimIds"]) {
      if (arrayField in claim && !Array.isArray(claim[arrayField])) {
        errors.push(`${claimLabel} ${arrayField} must be an array`);
      }
    }
    if (claim.reviewStatus && !REVIEW_STATUSES.includes(claim.reviewStatus)) {
      errors.push(`${claimLabel} reviewStatus must be one of ${REVIEW_STATUSES.join(", ")}`);
    }

    if (Array.isArray(claim.sourceRefs)) {
      if (claim.sourceRefs.length === 0) {
        errors.push(`${claimLabel} sourceRefs must preserve at least one source ref`);
      }
      for (const sourceRef of claim.sourceRefs) {
        const sourceRefId = typeof sourceRef === "string" ? sourceRef : sourceRef?.id;
        if (!sourceRefId || typeof sourceRefId !== "string") {
          errors.push(`${claimLabel} sourceRefs must include ids or source ref objects with id`);
        }
      }
    }

    const contradicts = Array.isArray(claim.contradictsClaimIds) ? claim.contradictsClaimIds : [];
    if (contradicts.length === 0) {
      return;
    }

    if (claim.reviewStatus !== "hold") {
      errors.push(`${claimLabel} contradictory claim candidate must remain hold for human review`);
    }

    for (const contradictedId of contradicts) {
      const target = claimById.get(contradictedId);
      if (!target) {
        errors.push(`${claimLabel} contradicts unknown claim candidate ${contradictedId}`);
        continue;
      }
      const reciprocal = Array.isArray(target.contradictsClaimIds) && target.contradictsClaimIds.includes(claim.id);
      if (!reciprocal) {
        errors.push(`${claimLabel} contradictory claim link to ${contradictedId} must be reciprocal`);
      }
    }
  });
}

function validateState(state) {
  const errors = [];
  if (!state || typeof state !== "object" || Array.isArray(state)) {
    return { ok: false, errors: ["state must be an object"] };
  }

  if (state.schemaVersion !== SCHEMA_VERSION) {
    errors.push(`schemaVersion must be ${SCHEMA_VERSION}`);
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in state)) {
      errors.push(`missing ${field}`);
    }
  }

  if (typeof state.rawMemo !== "string") {
    errors.push("rawMemo must be a string");
  }

  for (const arrayField of ["unresolvedCreativeDecisions", "taskCards", "qaGateResults", "generatedOutlines", "decisionLog"]) {
    if (!Array.isArray(state[arrayField])) {
      errors.push(`${arrayField} must be an array`);
    }
  }

  if (!state.extractedCandidates || typeof state.extractedCandidates !== "object" || Array.isArray(state.extractedCandidates)) {
    errors.push("extractedCandidates must be an object");
  }

  if (!state.reviewStatuses || typeof state.reviewStatuses !== "object" || Array.isArray(state.reviewStatuses)) {
    errors.push("reviewStatuses must be an object");
  }

  const profiles = state.extractedCandidates?.profiles;
  if (profiles !== undefined) {
    if (!Array.isArray(profiles)) {
      errors.push("extractedCandidates.profiles must be an array");
    } else {
      const profileTypes = new Set();
      const ghostStatuses = new Set();
      profiles.forEach((profile, index) => {
        if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
          errors.push(`profile ${index} must be an object`);
          return;
        }
        for (const field of PROFILE_REQUIRED_FIELDS) {
          if (!(field in profile)) {
            errors.push(`profile ${profile.id || index} missing ${field}`);
          }
        }
        for (const arrayField of ["aliases", "linkedClaimIds", "linkedTimelineEntryIds", "relatedProfileIds", "unresolvedDependencies", "knownBy", "unknownBy", "believedBy", "misunderstoodBy", "ownedItems", "sourceRefs", "assetRefs"]) {
          if (arrayField in profile && !Array.isArray(profile[arrayField])) {
            errors.push(`profile ${profile.id || index} ${arrayField} must be an array`);
          }
        }
        if (profile.profileType) {
          profileTypes.add(profile.profileType);
        }
        if (profile.ghostNodeStatus) {
          ghostStatuses.add(profile.ghostNodeStatus);
        }
      });

      for (const profileType of REQUIRED_PROFILE_TYPES) {
        if (!profileTypes.has(profileType)) {
          errors.push(`profiles missing required profileType ${profileType}`);
        }
      }
      for (const ghostStatus of REQUIRED_GHOST_NODE_STATUSES) {
        if (!ghostStatuses.has(ghostStatus)) {
          errors.push(`profiles missing required ghostNodeStatus ${ghostStatus}`);
        }
      }
    }
  }

  const claims = state.extractedCandidates?.claims;
  if (claims !== undefined) {
    if (!Array.isArray(claims)) {
      errors.push("extractedCandidates.claims must be an array");
    } else {
      claims.forEach((claim, index) => {
        if (!claim || typeof claim !== "object" || Array.isArray(claim)) {
          errors.push(`claim ${index} must be an object`);
          return;
        }
        for (const field of CLAIM_REQUIRED_FIELDS) {
          if (!(field in claim)) {
            errors.push(`claim ${claim.id || index} missing ${field}`);
          }
        }
        for (const arrayField of ["sourceRefs", "subjectRefs", "unresolvedDependencies", "supportsClaimIds", "contradictsClaimIds"]) {
          if (arrayField in claim && !Array.isArray(claim[arrayField])) {
            errors.push(`claim ${claim.id || index} ${arrayField} must be an array`);
          }
        }
      });
    }
  }

  const timelineEntries = state.extractedCandidates?.timelineCandidates;
  if (timelineEntries !== undefined) {
    if (!Array.isArray(timelineEntries)) {
      errors.push("extractedCandidates.timelineCandidates must be an array");
    } else {
      timelineEntries.forEach((entry, index) => {
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
          errors.push(`timeline entry ${index} must be an object`);
          return;
        }
        for (const field of TIMELINE_REQUIRED_FIELDS) {
          if (!(field in entry)) {
            errors.push(`timeline entry ${entry.id || index} missing ${field}`);
          }
        }
        for (const arrayField of ["linkedClaimIds", "linkedProfileIds", "linkedWorkIds", "unresolvedDependencies", "sourceRefs"]) {
          if (arrayField in entry && !Array.isArray(entry[arrayField])) {
            errors.push(`timeline entry ${entry.id || index} ${arrayField} must be an array`);
          }
        }
      });
    }
  }

  const extractionContracts = Array.isArray(state.extractionContracts) ? state.extractionContracts : state.extractionContract ? [state.extractionContract] : [];
  extractionContracts.forEach((contract, contractIndex) => {
    const validation = validateExtractionContract(contract, {
      label: `extraction contract ${contract?.extractionRunId || contractIndex}`,
      requireCompleteElementTypeCoverage: true
    });
    errors.push(...validation.errors);
  });

  return { ok: errors.length === 0, errors };
}

function normalizeState(state) {
  return {
    ...state,
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    metadata: {
      ...(state.metadata && typeof state.metadata === "object" ? state.metadata : {}),
      normalizedBy: "tools/fff-state.mjs"
    }
  };
}

function summarizeState(state) {
  return {
    schemaVersion: state.schemaVersion,
    projectTitle: state.project?.title || null,
    workTitle: state.work?.title || null,
    memoCharacters: state.rawMemo.length,
    reviewStatusCounts: countStatuses(state.reviewStatuses),
    extractedCategories: Array.isArray(state.extractedCandidates?.elements) ? state.extractedCandidates.elements.length : 0,
    profiles: Array.isArray(state.extractedCandidates?.profiles) ? state.extractedCandidates.profiles.length : 0,
    profileSummary: summarizeProfiles(state),
    claims: Array.isArray(state.extractedCandidates?.claims) ? state.extractedCandidates.claims.length : 0,
    claimSummary: summarizeClaims(state),
    timelineCandidates: Array.isArray(state.extractedCandidates?.timelineCandidates) ? state.extractedCandidates.timelineCandidates.length : 0,
    timelineSummary: summarizeTimeline(state),
    extractionContractSummary: summarizeExtractionContracts(state),
    unresolvedCreativeDecisions: state.unresolvedCreativeDecisions.length,
    taskCards: state.taskCards.length,
    qaGateResults: state.qaGateResults.length,
    generatedOutlines: state.generatedOutlines.length,
    decisionLogEntries: state.decisionLog.length
  };
}

function summarizeExtractionContracts(state) {
  const contracts = Array.isArray(state.extractionContracts) ? state.extractionContracts : state.extractionContract ? [state.extractionContract] : [];
  return summarizeExtractionContractList(contracts);
}

function summarizeExtractionContractList(contracts) {
  const byElementType = {};
  let extractedElementCount = 0;
  let profileCandidateCount = 0;
  let claimCandidateCount = 0;
  let timelineCandidateCount = 0;
  let unresolvedDependencyCount = 0;
  let highCanonRiskCount = 0;
  let warningsCount = 0;

  for (const contract of contracts) {
    const elements = Array.isArray(contract.extractedElements) ? contract.extractedElements : [];
    extractedElementCount += elements.length;
    profileCandidateCount += Array.isArray(contract.profileCandidates) ? contract.profileCandidates.length : 0;
    claimCandidateCount += Array.isArray(contract.claimCandidates) ? contract.claimCandidates.length : 0;
    timelineCandidateCount += Array.isArray(contract.timelineEntryCandidates) ? contract.timelineEntryCandidates.length : 0;
    unresolvedDependencyCount += Array.isArray(contract.unresolvedDependencies) ? contract.unresolvedDependencies.length : 0;
    warningsCount += Array.isArray(contract.warnings) ? contract.warnings.length : 0;

    for (const element of elements) {
      const elementType = element.elementType || "not set";
      byElementType[elementType] = (byElementType[elementType] || 0) + 1;
      if (element.canonRisk === "high") {
        highCanonRiskCount += 1;
      }
    }
  }

  return {
    extractionRunCount: contracts.length,
    extractedElementCount,
    byElementType,
    profileCandidateCount,
    claimCandidateCount,
    timelineCandidateCount,
    unresolvedDependencyCount,
    highCanonRiskCount,
    warningsCount
  };
}

function summarizeProfiles(state) {
  const profiles = Array.isArray(state.extractedCandidates?.profiles) ? state.extractedCandidates.profiles : [];
  const byProfileType = {};
  const byGhostNodeStatus = {};
  const byReviewStatus = { adopt: 0, provisional: 0, hold: 0, reject: 0, other: 0 };
  let withUnresolvedDependencies = 0;
  let highCanonRisk = 0;
  let spoilerProtected = 0;
  let linkedToClaims = 0;
  let linkedToTimeline = 0;
  let placeholderProfiles = 0;

  for (const profile of profiles) {
    const profileType = profile.profileType || profile.profile_type || "not set";
    const ghostNodeStatus = profile.ghostNodeStatus || profile.ghost_node_status || "not set";
    byProfileType[profileType] = (byProfileType[profileType] || 0) + 1;
    byGhostNodeStatus[ghostNodeStatus] = (byGhostNodeStatus[ghostNodeStatus] || 0) + 1;

    const status = state.reviewStatuses?.[profile.id] || profile.reviewStatus || profile.review_status || "hold";
    if (status in byReviewStatus) {
      byReviewStatus[status] += 1;
    } else {
      byReviewStatus.other += 1;
    }
    if (Array.isArray(profile.unresolvedDependencies) && profile.unresolvedDependencies.length > 0) {
      withUnresolvedDependencies += 1;
    }
    if (profile.canonRisk === "high") {
      highCanonRisk += 1;
    }
    if (profile.spoilerLevel === "high") {
      spoilerProtected += 1;
    }
    if (Array.isArray(profile.linkedClaimIds) && profile.linkedClaimIds.length > 0) {
      linkedToClaims += 1;
    }
    if (Array.isArray(profile.linkedTimelineEntryIds) && profile.linkedTimelineEntryIds.length > 0) {
      linkedToTimeline += 1;
    }
    if (profileType === "placeholder") {
      placeholderProfiles += 1;
    }
  }

  return {
    totalProfiles: profiles.length,
    byProfileType,
    byGhostNodeStatus,
    byReviewStatus,
    withUnresolvedDependencies,
    highCanonRisk,
    spoilerProtected,
    linkedToClaims,
    linkedToTimeline,
    placeholderProfiles
  };
}

function summarizeTimeline(state) {
  const entries = Array.isArray(state.extractedCandidates?.timelineCandidates) ? state.extractedCandidates.timelineCandidates : [];
  const byTimelineAxis = {};
  const byReviewStatus = { adopt: 0, provisional: 0, hold: 0, reject: 0, other: 0 };
  let withUnresolvedDependencies = 0;
  let hiddenOrSpoilerProtected = 0;
  let highCanonRisk = 0;
  let linkedToClaims = 0;

  for (const entry of entries) {
    const axis = entry.timelineAxis || entry.sequence_scope || "not set";
    byTimelineAxis[axis] = (byTimelineAxis[axis] || 0) + 1;
    const status = state.reviewStatuses?.[entry.id] || entry.reviewStatus || entry.review_status || "hold";
    if (status in byReviewStatus) {
      byReviewStatus[status] += 1;
    } else {
      byReviewStatus.other += 1;
    }
    if (Array.isArray(entry.unresolvedDependencies) && entry.unresolvedDependencies.length > 0) {
      withUnresolvedDependencies += 1;
    }
    if (entry.spoilerLevel === "high" || String(entry.viewerDisclosureStatus || "").includes("hidden") || String(entry.viewerDisclosureStatus || "").includes("not yet")) {
      hiddenOrSpoilerProtected += 1;
    }
    if (entry.canonRisk === "high") {
      highCanonRisk += 1;
    }
    if (Array.isArray(entry.linkedClaimIds) && entry.linkedClaimIds.length > 0) {
      linkedToClaims += 1;
    }
  }

  return {
    totalTimelineEntries: entries.length,
    byTimelineAxis,
    byReviewStatus,
    withUnresolvedDependencies,
    hiddenOrSpoilerProtected,
    highCanonRisk,
    linkedToClaims
  };
}

function summarizeClaims(state) {
  const claims = Array.isArray(state.extractedCandidates?.claims) ? state.extractedCandidates.claims : [];
  const byReviewStatus = { adopt: 0, provisional: 0, hold: 0, reject: 0, other: 0 };
  let withUnresolvedDependencies = 0;
  let highCanonRisk = 0;
  let unverifiedRealityStatus = 0;
  let hiddenOrSpoilerProtected = 0;

  for (const claim of claims) {
    const status = state.reviewStatuses?.[claim.id] || claim.reviewStatus || claim.review_status || "hold";
    if (status in byReviewStatus) {
      byReviewStatus[status] += 1;
    } else {
      byReviewStatus.other += 1;
    }
    if (Array.isArray(claim.unresolvedDependencies) && claim.unresolvedDependencies.length > 0) {
      withUnresolvedDependencies += 1;
    }
    if (claim.canonRisk === "high") {
      highCanonRisk += 1;
    }
    if (claim.realityStatus === "unverified") {
      unverifiedRealityStatus += 1;
    }
    if (claim.spoilerLevel === "high" || String(claim.viewerDisclosureStatus || "").includes("hidden") || String(claim.viewerDisclosureStatus || "").includes("not yet")) {
      hiddenOrSpoilerProtected += 1;
    }
  }

  return {
    totalClaims: claims.length,
    byReviewStatus,
    withUnresolvedDependencies,
    highCanonRisk,
    unverifiedRealityStatus,
    hiddenOrSpoilerProtected
  };
}

function countStatuses(reviewStatuses) {
  const counts = { adopt: 0, provisional: 0, hold: 0, reject: 0, other: 0 };
  for (const status of Object.values(reviewStatuses || {})) {
    if (status in counts) {
      counts[status] += 1;
    } else {
      counts.other += 1;
    }
  }
  return counts;
}

function printHelp() {
  console.log(`Fast Fiction Factory state tool

Usage:
  node tools/fff-state.mjs validate <state.json>
  node tools/fff-state.mjs summarize <state.json>
  node tools/fff-state.mjs normalize <state.json> [output.json]
  node tools/fff-state.mjs validate-extraction <payload.json>
  node tools/fff-state.mjs summarize-extraction <payload.json>
  node tools/fff-state.mjs validate-extraction-fixtures <fixture-directory>
  node tools/fff-state.mjs smoke-extraction-fixtures <fixture-directory> [output.json]
  node tools/fff-state.mjs validate-routing-policy <ambiguous-routing-resolution.json>
  node tools/fff-state.mjs smoke-routing-policy <ambiguous-routing-resolution.json> [output.json]
  node tools/fff-state.mjs validate-broad-span-split <source-span-quality-audit.json>
  node tools/fff-state.mjs smoke-broad-span-split <source-span-quality-audit.json> [output.json]
  node tools/fff-state.mjs validate-weak-span-repair <source-span-quality-audit.json>
  node tools/fff-state.mjs smoke-weak-span-repair <source-span-quality-audit.json> [output.json]
  node tools/fff-state.mjs validate-missing-fixture-class-probe <adapter-matrix-smoke.json>
  node tools/fff-state.mjs smoke-missing-fixture-class-probe <adapter-matrix-smoke.json> [output.json]
  node tools/fff-state.mjs validate-malformed-missing-span-guard <extraction-validator-smoke.json>
  node tools/fff-state.mjs smoke-malformed-missing-span-guard <extraction-validator-smoke.json> [output.json]
  node tools/fff-state.mjs validate-contradictory-claim-guard <extraction-validator-smoke.json>
  node tools/fff-state.mjs smoke-contradictory-claim-guard <extraction-validator-smoke.json> [output.json]
  node tools/fff-state.mjs validate-downstream-source-span-adoption-gate <source-span-review-pack.json>
  node tools/fff-state.mjs smoke-downstream-source-span-adoption-gate <source-span-review-pack.json> [output.json]
  node tools/fff-state.mjs validate-provider-envelope-readiness-no-call <provider-envelope.json>
  node tools/fff-state.mjs smoke-provider-envelope-readiness-no-call <provider-envelope.json> [output.json]

Default normalize output:
  ${DEFAULT_OUTPUT}

Default extraction fixture smoke output:
  ${DEFAULT_EXTRACTION_FIXTURE_SMOKE_OUTPUT}

Default routing policy regression output:
  ${DEFAULT_ROUTING_POLICY_REGRESSION_OUTPUT}

Default broad-span split output:
  ${DEFAULT_BROAD_SPAN_SPLIT_OUTPUT}

Default weak-span repair output:
  ${DEFAULT_WEAK_SPAN_REPAIR_OUTPUT}

Default missing fixture class probe output:
  ${DEFAULT_MISSING_FIXTURE_CLASS_PROBE_OUTPUT}

Default malformed/missing source-span guard output:
  ${DEFAULT_MALFORMED_MISSING_SPAN_GUARD_OUTPUT}

Default contradictory claim guard output:
  ${DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT}

Default downstream source-span adoption gate output:
  ${DEFAULT_DOWNSTREAM_SOURCE_SPAN_ADOPTION_GATE_OUTPUT}

Default provider envelope readiness no-call output:
  ${DEFAULT_PROVIDER_ENVELOPE_READINESS_NO_CALL_OUTPUT}
`);
}

function collectCredentialMaterial(value, trail = []) {
  if (!value || typeof value !== "object") {
    return [];
  }

  const findings = [];
  const sensitiveKeys = new Set([
    "apiKey",
    "api_key",
    "secret",
    "secretName",
    "secretNames",
    "token",
    "accessToken",
    "authorization",
    "password",
    "credential",
    "credentials",
    "credentialNames",
    "credentialValue"
  ]);

  for (const [key, child] of Object.entries(value)) {
    const nextTrail = trail.concat(key);
    if (sensitiveKeys.has(key) && hasCredentialLikeValue(child)) {
      findings.push(nextTrail.join("."));
    }
    if (child && typeof child === "object") {
      findings.push(...collectCredentialMaterial(child, nextTrail));
    }
  }

  return findings;
}

function hasCredentialLikeValue(value) {
  if (value === null || value === false) {
    return false;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === "object") {
    return Object.keys(value).length > 0;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized.length > 0 &&
      !["none", "not_defined_in_this_slice", "not_applicable", "no_credentials"].includes(normalized);
  }
  return Boolean(value);
}

function printWarnings(warnings) {
  if (!warnings || warnings.length === 0) {
    return;
  }
  for (const warning of warnings) {
    console.warn(`warning: ${warning}`);
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

main().catch((error) => fail(error.message));
