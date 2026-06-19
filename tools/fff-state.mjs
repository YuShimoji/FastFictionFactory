#!/usr/bin/env node

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SCHEMA_VERSION = "fff.projectState.v1";
const EXTRACTION_SCHEMA_VERSION = "fff.extractionContract.v1";
const DEFAULT_OUTPUT = "artifacts/current-project-state.json";
const DEFAULT_EXTRACTION_FIXTURE_SMOKE_OUTPUT = "artifacts/extraction-validator-smoke-result.json";

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

async function main() {
  const [command, inputPath, outputPath] = process.argv.slice(2);

  if (!command || command === "help" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (!inputPath) {
    fail("Missing input JSON path.");
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

  if (command === "validate-extraction") {
    const contract = await readJson(inputPath);
    const validation = validateExtractionContract(contract);
    if (!validation.ok) {
      fail(`Invalid extraction contract: ${validation.errors.join("; ")}`);
    }
    console.log(`valid extraction ${inputPath}`);
    return;
  }

  if (command === "smoke-extraction-fixtures") {
    const target = outputPath || DEFAULT_EXTRACTION_FIXTURE_SMOKE_OUTPUT;
    const result = await smokeExtractionFixtures(inputPath);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    if (!result.passed) {
      fail(`Extraction fixture smoke failed: ${result.summary.mismatched} mismatched fixture(s)`);
    }
    console.log(`extraction fixture smoke passed ${inputPath} -> ${target}`);
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
    const label = `extraction contract ${contract?.extractionRunId || contractIndex}`;
    const validation = validateExtractionContract(contract, { label });
    errors.push(...validation.errors);
  });

  return { ok: errors.length === 0, errors };
}

function validateExtractionContract(contract, options = {}) {
  const errors = [];
  const label = options.label || `extraction contract ${contract?.extractionRunId || "payload"}`;

  if (!contract || typeof contract !== "object" || Array.isArray(contract)) {
    return { ok: false, errors: [`${label} must be an object`] };
  }

  if (contract.schemaVersion !== EXTRACTION_SCHEMA_VERSION) {
    errors.push(`${label} schemaVersion must be ${EXTRACTION_SCHEMA_VERSION}`);
  }

  for (const field of EXTRACTION_CONTRACT_REQUIRED_FIELDS) {
    if (!(field in contract)) {
      errors.push(`${label} missing ${field}`);
    }
  }

  for (const arrayField of ["sourceRefs", "extractedElements", "profileCandidates", "claimCandidates", "timelineEntryCandidates", "unresolvedDependencies", "warnings", "humanAuthorityBoundaries"]) {
    if (arrayField in contract && !Array.isArray(contract[arrayField])) {
      errors.push(`${label} ${arrayField} must be an array`);
    }
  }

  const sourceRefIds = new Set();
  if (Array.isArray(contract.sourceRefs)) {
    contract.sourceRefs.forEach((sourceRef, sourceIndex) => {
      if (!sourceRef || typeof sourceRef !== "object" || Array.isArray(sourceRef)) {
        errors.push(`${label} sourceRef ${sourceIndex} must be an object`);
        return;
      }
      if (typeof sourceRef.id !== "string" || sourceRef.id.trim() === "") {
        errors.push(`${label} sourceRef ${sourceIndex} missing id`);
      } else if (sourceRefIds.has(sourceRef.id)) {
        errors.push(`${label} duplicate sourceRef id ${sourceRef.id}`);
      } else {
        sourceRefIds.add(sourceRef.id);
      }
      for (const field of ["label", "source_type", "locator", "trust"]) {
        if (typeof sourceRef[field] !== "string" || sourceRef[field].trim() === "") {
          errors.push(`${label} sourceRef ${sourceRef.id || sourceIndex} missing ${field}`);
        }
      }
    });
  }

  validateConfidencePolicy(contract.confidencePolicy, label, errors);
  validateReviewSafeDefaults(contract.reviewSafeDefaults, label, errors);
  validateDecisionLogSafeMetadata(contract.decisionLogSafeMetadata, label, errors);
  validateHumanAuthority(contract, label, errors);
  validateExtractionElements(contract, sourceRefIds, label, errors);

  return { ok: errors.length === 0, errors };
}

function validateConfidencePolicy(policy, label, errors) {
  if (!policy || typeof policy !== "object" || Array.isArray(policy)) {
    errors.push(`${label} confidencePolicy must be an object`);
    return;
  }
  if (!isNumberInRange(policy.defaultConfidence, 0, 1)) {
    errors.push(`${label} confidencePolicy.defaultConfidence must be a number from 0 to 1`);
  }
  if (policy.lowConfidenceAction !== "hold") {
    errors.push(`${label} confidencePolicy.lowConfidenceAction must be hold`);
  }
  if (!String(policy.highCanonRiskAction || "").toLowerCase().includes("hold")) {
    errors.push(`${label} confidencePolicy.highCanonRiskAction must hold high-canon-risk candidates`);
  }
  if (!String(policy.freeformReviewAuthority || "").toLowerCase().includes("human")) {
    errors.push(`${label} confidencePolicy.freeformReviewAuthority must name human review authority`);
  }
}

function validateReviewSafeDefaults(defaults, label, errors) {
  if (!defaults || typeof defaults !== "object" || Array.isArray(defaults)) {
    errors.push(`${label} reviewSafeDefaults must be an object`);
    return;
  }
  if (defaults.defaultReviewStatus !== "hold") {
    errors.push(`${label} reviewSafeDefaults.defaultReviewStatus must be hold`);
  }
  for (const field of ["allowAdopt", "allowProvisional", "allowReject"]) {
    if (typeof defaults[field] !== "boolean") {
      errors.push(`${label} reviewSafeDefaults.${field} must be a boolean`);
    }
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
}

function validateDecisionLogSafeMetadata(metadata, label, errors) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    errors.push(`${label} decisionLogSafeMetadata must be an object`);
    return;
  }
  if (metadata.owner !== "human_author") {
    errors.push(`${label} decisionLogSafeMetadata.owner must be human_author`);
  }
  if (!Array.isArray(metadata.statusVocabulary)) {
    errors.push(`${label} decisionLogSafeMetadata.statusVocabulary must be an array`);
  } else {
    for (const status of REVIEW_STATUSES) {
      if (!metadata.statusVocabulary.includes(status)) {
        errors.push(`${label} decisionLogSafeMetadata.statusVocabulary missing ${status}`);
      }
    }
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

function validateHumanAuthority(contract, label, errors) {
  const unresolvedDependencies = Array.isArray(contract.unresolvedDependencies) ? contract.unresolvedDependencies : [];
  const boundaries = Array.isArray(contract.humanAuthorityBoundaries) ? contract.humanAuthorityBoundaries.join(" ").toLowerCase() : "";
  for (const dependency of HUMAN_OWNED_DEPENDENCIES) {
    if (!unresolvedDependencies.includes(dependency)) {
      errors.push(`${label} unresolvedDependencies missing human-owned dependency ${dependency}`);
    }
    if (!boundaries.includes(dependency.toLowerCase())) {
      errors.push(`${label} humanAuthorityBoundaries missing ${dependency}`);
    }
  }
}

function validateExtractionElements(contract, sourceRefIds, label, errors) {
  const elementTypes = new Set();
  if (!Array.isArray(contract.extractedElements)) {
    return;
  }

  contract.extractedElements.forEach((element, elementIndex) => {
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
    for (const optionalArrayField of ["targetProfileIds", "targetClaimIds", "targetTimelineEntryIds"]) {
      if (optionalArrayField in element && !Array.isArray(element[optionalArrayField])) {
        errors.push(`${elementLabel} ${optionalArrayField} must be an array`);
      }
    }

    if (!REQUIRED_EXTRACTION_ELEMENT_TYPES.includes(element.elementType)) {
      errors.push(`${elementLabel} elementType must be one of ${REQUIRED_EXTRACTION_ELEMENT_TYPES.join(", ")}`);
    } else {
      elementTypes.add(element.elementType);
    }

    validateElementSourceRefs(element, sourceRefIds, elementLabel, errors);
    validateElementSourceSpan(element, elementLabel, errors);
    validateElementReviewSafety(element, elementLabel, errors);
    validateElementRouting(element, elementLabel, errors);
  });

  for (const elementType of REQUIRED_EXTRACTION_ELEMENT_TYPES) {
    if (!elementTypes.has(elementType)) {
      errors.push(`${label} missing elementType ${elementType}`);
    }
  }
}

function validateElementSourceRefs(element, sourceRefIds, elementLabel, errors) {
  if (!Array.isArray(element.sourceRefIds)) {
    return;
  }
  if (element.sourceRefIds.length === 0) {
    errors.push(`${elementLabel} sourceRefIds must not be empty`);
  }
  for (const sourceRefId of element.sourceRefIds) {
    if (!sourceRefIds.has(sourceRefId)) {
      errors.push(`${elementLabel} unknown sourceRefId ${sourceRefId}`);
    }
  }
}

function validateElementSourceSpan(element, elementLabel, errors) {
  const span = element.sourceSpan;
  if (!span || typeof span !== "object" || Array.isArray(span)) {
    errors.push(`${elementLabel} sourceSpan must be an object`);
    return;
  }
  if (typeof span.text !== "string" || span.text.trim() === "") {
    errors.push(`${elementLabel} sourceSpan.text must be a non-empty string`);
  }
  for (const field of ["start", "end"]) {
    if (!(typeof span[field] === "number" || span[field] === null)) {
      errors.push(`${elementLabel} sourceSpan.${field} must be a number or null`);
    }
  }
  if (typeof span.start === "number" && typeof span.end === "number" && span.start > span.end) {
    errors.push(`${elementLabel} sourceSpan.start must be less than or equal to sourceSpan.end`);
  }
}

function validateElementReviewSafety(element, elementLabel, errors) {
  if (!isNumberInRange(element.confidence, 0, 1)) {
    errors.push(`${elementLabel} confidence must be a number from 0 to 1`);
  }
  for (const field of ["suggestedReviewStatus", "reviewStatus"]) {
    if (!REVIEW_STATUSES.includes(element[field])) {
      errors.push(`${elementLabel} ${field} must be one of ${REVIEW_STATUSES.join(", ")}`);
    }
  }
  if (!RISK_LEVELS.includes(element.canonRisk)) {
    errors.push(`${elementLabel} canonRisk must be one of ${RISK_LEVELS.join(", ")}`);
  }
  if (!RISK_LEVELS.includes(element.spoilerLevel)) {
    errors.push(`${elementLabel} spoilerLevel must be one of ${RISK_LEVELS.join(", ")}`);
  }

  const unresolvedDependencies = Array.isArray(element.unresolvedDependencies) ? element.unresolvedDependencies : [];
  const touchesHumanOwnedDependency = unresolvedDependencies.some((dependency) => HUMAN_OWNED_DEPENDENCIES.includes(dependency));
  const isHumanOwnedDecision = touchesHumanOwnedDependency || element.elementType === "unresolved_decision";
  if (element.elementType === "unresolved_decision" && element.canonRisk !== "high") {
    errors.push(`${elementLabel} unresolved_decision candidates must keep canonRisk high`);
  }
  if ((isHumanOwnedDecision || element.canonRisk === "high") && (element.suggestedReviewStatus === "adopt" || element.reviewStatus === "adopt")) {
    errors.push(`${elementLabel} high-risk or human-owned dependency candidates must not be adopt`);
  }
}

function validateElementRouting(element, elementLabel, errors) {
  if (!Array.isArray(element.targetDestinations)) {
    return;
  }
  if (element.targetDestinations.length === 0) {
    errors.push(`${elementLabel} targetDestinations must not be empty`);
  }
  for (const destination of element.targetDestinations) {
    if (!EXTRACTION_TARGET_DESTINATIONS.includes(destination)) {
      errors.push(`${elementLabel} unknown target destination ${destination}`);
    }
  }
  if (element.targetDestinations.includes("profile") && (!Array.isArray(element.targetProfileIds) || element.targetProfileIds.length === 0)) {
    errors.push(`${elementLabel} routes to profile but targetProfileIds is empty`);
  }
  if (element.targetDestinations.includes("claim") && (!Array.isArray(element.targetClaimIds) || element.targetClaimIds.length === 0)) {
    errors.push(`${elementLabel} routes to claim but targetClaimIds is empty`);
  }
  if (element.targetDestinations.includes("timeline") && (!Array.isArray(element.targetTimelineEntryIds) || element.targetTimelineEntryIds.length === 0)) {
    errors.push(`${elementLabel} routes to timeline but targetTimelineEntryIds is empty`);
  }
  if (element.elementType === "source_reference" && !element.targetDestinations.includes("source_reference")) {
    errors.push(`${elementLabel} source_reference elements must route to source_reference`);
  }
  if (element.elementType === "unresolved_decision" && !element.targetDestinations.includes("unresolved_decision")) {
    errors.push(`${elementLabel} unresolved_decision elements must route to unresolved_decision`);
  }
  if (element.elementType === "visual_asset" && element.targetDestinations.includes("claim")) {
    const hasReviewBuffer = element.targetDestinations.includes("profile") || element.targetDestinations.includes("timeline");
    if (!hasReviewBuffer) {
      errors.push(`${elementLabel} visual_asset claim routing must include profile or timeline review buffer`);
    }
  }
}

async function smokeExtractionFixtures(fixtureDir) {
  const requiredFixtures = [
    "valid-minimal.json",
    "missing-source-refs.json",
    "overconfident-human-owned-decision.json",
    "invalid-routing-visual-asset-to-claim.json",
    "auto-canon-leak.json",
    "missing-review-safe-defaults.json",
    "unknown-fields-preservation.json"
  ];
  const expectedByFile = {
    "valid-minimal.json": { valid: true, reason: "minimal valid contract covers required element types and review-safe defaults" },
    "missing-source-refs.json": { valid: false, reason: "sourceRefIds must exist and point at sourceRefs", includes: ["sourceRefIds must not be empty", "unknown sourceRefId"] },
    "overconfident-human-owned-decision.json": { valid: false, reason: "human-owned decisions cannot be adopted by extraction", includes: ["must not be adopt", "canonRisk high"] },
    "invalid-routing-visual-asset-to-claim.json": { valid: false, reason: "visual assets cannot route directly into claims without review buffer", includes: ["visual_asset claim routing must include profile or timeline review buffer"] },
    "auto-canon-leak.json": { valid: false, reason: "review-safe defaults must prevent automatic canon or chronology promotion", includes: ["autoCanonPromotion must be false", "autoChronologyPromotion must be false"] },
    "missing-review-safe-defaults.json": { valid: false, reason: "reviewSafeDefaults is required", includes: ["reviewSafeDefaults must be an object", "missing reviewSafeDefaults"] },
    "unknown-fields-preservation.json": { valid: true, reason: "unknown fields are accepted so they can be preserved for JSON review" }
  };

  const entries = await readdir(fixtureDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort();
  const seen = new Set(files);
  const matrix = [];

  for (const requiredFixture of requiredFixtures) {
    if (!seen.has(requiredFixture)) {
      matrix.push({
        file: requiredFixture,
        expectedValid: expectedByFile[requiredFixture].valid,
        actualValid: false,
        matchedExpectation: false,
        intendedReason: expectedByFile[requiredFixture].reason,
        errors: [`missing fixture file ${requiredFixture}`]
      });
    }
  }

  for (const file of files) {
    const fixturePath = path.join(fixtureDir, file);
    let payload;
    let parseError = null;
    try {
      payload = await readJson(fixturePath);
    } catch (error) {
      parseError = error;
    }

    const expectation = expectedByFile[file] || { valid: false, reason: "unregistered fixture should be classified before use", includes: [] };
    const validation = parseError ? { ok: false, errors: [parseError.message] } : validateExtractionContract(payload);
    const includes = expectation.includes || [];
    const foundIntendedReason = expectation.valid || includes.length === 0 || includes.some((part) => validation.errors.some((error) => error.includes(part)));
    const matchedExpectation = validation.ok === expectation.valid && foundIntendedReason;

    matrix.push({
      file,
      expectedValid: expectation.valid,
      actualValid: validation.ok,
      matchedExpectation,
      intendedReason: expectation.reason,
      errors: validation.errors
    });
  }

  const mismatched = matrix.filter((row) => !row.matchedExpectation).length;
  const expectedValid = matrix.filter((row) => row.expectedValid).length;
  const expectedInvalid = matrix.filter((row) => !row.expectedValid).length;
  const passed = mismatched === 0;

  return {
    artifact_id: "fff-extraction-validator-hardening-001",
    generated_at: new Date().toISOString(),
    validator: "tools/fff-state.mjs smoke-extraction-fixtures",
    fixture_dir: fixtureDir.replaceAll("\\", "/"),
    required_fixtures: requiredFixtures,
    summary: {
      total: matrix.length,
      expectedValid,
      expectedInvalid,
      matched: matrix.length - mismatched,
      mismatched,
      passed
    },
    matrix,
    rules: [
      "Extraction contract schema version is required.",
      "Every extraction element keeps sourceRefIds that point to sourceRefs.",
      "Every required extraction element type is represented.",
      "High-risk and human-owned dependency candidates cannot be adopt.",
      "Review-safe defaults disable automatic canon and chronology promotion.",
      "Visual asset claim routing needs a profile or timeline review buffer.",
      "Unknown fields are accepted for preservation rather than rejected."
    ],
    passed
  };
}

function isNumberInRange(value, min, max) {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
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
  node tools/fff-state.mjs validate-extraction <extraction-contract.json>
  node tools/fff-state.mjs smoke-extraction-fixtures <fixture-dir> [output.json]

Default normalize output:
  ${DEFAULT_OUTPUT}

Default extraction fixture smoke output:
  ${DEFAULT_EXTRACTION_FIXTURE_SMOKE_OUTPUT}
`);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

main().catch((error) => fail(error.message));
