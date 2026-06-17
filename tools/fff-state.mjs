#!/usr/bin/env node

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SCHEMA_VERSION = "fff.projectState.v1";
const EXTRACTION_SCHEMA_VERSION = "fff.extractionContract.v1";
const DEFAULT_OUTPUT = "artifacts/current-project-state.json";

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

const REVIEW_STATUSES = ["adopt", "provisional", "hold", "reject"];

const EXTRACTION_TARGET_DESTINATIONS = [
  "profile",
  "claim",
  "timeline",
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
      "reviewSafeDefaults missing unknownSourceHandling",
      "reviewSafeDefaults.defaultReviewStatus must not be adopt",
      "reviewSafeDefaults.autoCanonPromotion must be false"
    ]
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

  if (command === "validate-extraction-fixtures") {
    const matrix = await validateExtractionFixtures(inputPath);
    console.log(JSON.stringify(matrix, null, 2));
    if (!matrix.passed) {
      fail(`Extraction fixture matrix failed: ${matrix.failures.join("; ")}`);
    }
    return;
  }

  const state = await readState(inputPath);

  if (command === "validate-extraction") {
    const validation = validateExtractionPayload(state);
    if (!validation.ok) {
      fail(`Invalid extraction payload: ${validation.errors.join("; ")}`);
    }
    console.log(`valid extraction ${inputPath}`);
    printWarnings(validation.warnings);
    return;
  }

  if (command === "summarize-extraction") {
    const validation = validateExtractionPayload(state);
    if (!validation.ok) {
      fail(`Invalid extraction payload: ${validation.errors.join("; ")}`);
    }
    console.log(JSON.stringify(validation.summary, null, 2));
    printWarnings(validation.warnings);
    return;
  }

  const validation = validateState(state);

  if (command === "validate") {
    if (!validation.ok) {
      fail(`Invalid state: ${validation.errors.join("; ")}`);
    }
    console.log(`valid ${inputPath}`);
    return;
  }

  if (command === "summarize") {
    if (!validation.ok) {
      fail(`Invalid state: ${validation.errors.join("; ")}`);
    }
    console.log(JSON.stringify(summarizeState(state), null, 2));
    return;
  }

  if (command === "normalize") {
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

async function readState(inputPath) {
  let text;
  try {
    text = await readFile(inputPath, "utf8");
  } catch (error) {
    fail(`Cannot read ${inputPath}: ${error.message}`);
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    fail(`Invalid JSON in ${inputPath}: ${error.message}`);
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
    const payload = await readState(filePath);
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
      fixtureCount: files.length,
      expectedFixtureCount: expectedFiles.length,
      expectedValid: results.filter((result) => result.expected === "valid").length,
      expectedInvalid: results.filter((result) => result.expected === "invalid").length,
      builtInGuardCount: builtInGuardResults.length,
      unknownFieldsPreservationCovered: results.some((result) =>
        result.warnings.some((warning) => warning.includes("unknown top-level field"))
      ),
      missingReviewSafeDefaultsCovered: results.some((result) =>
        result.errors.some((error) => error.includes("reviewSafeDefaults missing"))
      )
    },
    results,
    builtInGuardResults
  };
}

async function validateExtractionBuiltInGuards(validMinimalPath) {
  const basePayload = await readState(validMinimalPath);
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

Default normalize output:
  ${DEFAULT_OUTPUT}
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
