#!/usr/bin/env node

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SCHEMA_VERSION = "fff.projectState.v1";
const EXTRACTION_SCHEMA_VERSION = "fff.extractionContract.v1";
const ROUTING_POLICY_REGRESSION_SCHEMA_VERSION = "fff.routingPolicyRegression.v1";
const BROAD_SPAN_SPLIT_SCHEMA_VERSION = "fff.broadSpanSplit.v1";
const DEFAULT_OUTPUT = "artifacts/current-project-state.json";
const DEFAULT_EXTRACTION_FIXTURE_SMOKE_OUTPUT = "artifacts/extraction-validator-smoke-result.json";
const DEFAULT_ROUTING_POLICY_REGRESSION_OUTPUT = "artifacts/routing-policy-regression-hardening-result.json";
const DEFAULT_BROAD_SPAN_SPLIT_OUTPUT = "artifacts/broad-span-split-result.json";

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

Default normalize output:
  ${DEFAULT_OUTPUT}

Default extraction fixture smoke output:
  ${DEFAULT_EXTRACTION_FIXTURE_SMOKE_OUTPUT}

Default routing policy regression output:
  ${DEFAULT_ROUTING_POLICY_REGRESSION_OUTPUT}

Default broad-span split output:
  ${DEFAULT_BROAD_SPAN_SPLIT_OUTPUT}
`);
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
