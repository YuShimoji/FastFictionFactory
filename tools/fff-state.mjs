#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SCHEMA_VERSION = "fff.projectState.v1";
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

async function main() {
  const [command, inputPath, outputPath] = process.argv.slice(2);

  if (!command || command === "help" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (!inputPath) {
    fail("Missing input JSON path.");
  }

  const state = await readState(inputPath);
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
    claims: Array.isArray(state.extractedCandidates?.claims) ? state.extractedCandidates.claims.length : 0,
    claimSummary: summarizeClaims(state),
    timelineCandidates: Array.isArray(state.extractedCandidates?.timelineCandidates) ? state.extractedCandidates.timelineCandidates.length : 0,
    unresolvedCreativeDecisions: state.unresolvedCreativeDecisions.length,
    taskCards: state.taskCards.length,
    qaGateResults: state.qaGateResults.length,
    generatedOutlines: state.generatedOutlines.length,
    decisionLogEntries: state.decisionLog.length
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

Default normalize output:
  ${DEFAULT_OUTPUT}
`);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

main().catch((error) => fail(error.message));
