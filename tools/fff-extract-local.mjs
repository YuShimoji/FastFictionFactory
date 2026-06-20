#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

const DEFAULT_INPUT = "artifacts/sample-raw-memo.md";
const DEFAULT_OUTPUT = "artifacts/local-extraction-adapter-output.json";
const DEFAULT_SMOKE = "artifacts/local-extraction-adapter-smoke-result.json";
const FIXTURE_DIR = "artifacts/extraction-negative-fixtures";

const SOURCE_REF = {
  id: "src-local-adapter-raw-memo-001",
  label: "Sample raw memo",
  source_type: "memo",
  locator: "artifacts/sample-raw-memo.md",
  trust: "author_memo"
};

const DERIVED_REF = {
  id: "src-local-adapter-deterministic-001",
  label: "Deterministic local extraction adapter",
  source_type: "derived_candidate",
  locator: "tools/fff-extract-local.mjs",
  trust: "derived_candidate"
};

const HUMAN_REVIEW_REF = {
  id: "src-local-adapter-freeform-review-001",
  label: "Freeform human review boundary",
  source_type: "human_review",
  locator: "docs/review/freeform-review-intake.md",
  trust: "human_review"
};

const ELEMENT_SPECS = [
  {
    id: "local-x-person-mira",
    displayText: "Mira Vale",
    elementType: "person",
    phrase: "Mira Vale repairs clocks",
    aliases: ["Mira", "the clock repairer"],
    confidence: 0.95,
    canonRisk: "low",
    spoilerLevel: "low",
    targetDestinations: ["profile", "claim"],
    targetProfileIds: ["local-profile-mira"],
    targetClaimIds: ["local-claim-mira-repairs-clocks"],
    notes: "Adapter can identify the protagonist candidate, but generated output remains review-held."
  },
  {
    id: "local-x-person-toma",
    displayText: "Toma",
    elementType: "person",
    phrase: "missing brother Toma",
    aliases: ["Toma Vale", "missing brother"],
    confidence: 0.9,
    canonRisk: "high",
    spoilerLevel: "high",
    unresolvedDependencies: ["Toma fate"],
    targetDestinations: ["profile", "claim", "timeline", "unresolved_decision"],
    targetProfileIds: ["local-profile-toma"],
    targetClaimIds: ["local-claim-toma-left-moth"],
    targetTimelineEntryIds: ["local-timeline-toma-note"],
    notes: "Name extraction is allowed, but Toma fate stays human-owned and held."
  },
  {
    id: "local-x-place-north-bell",
    displayText: "North Bell Station",
    elementType: "place",
    phrase: "North Bell Station",
    aliases: ["North Bell"],
    confidence: 0.91,
    canonRisk: "medium",
    spoilerLevel: "medium",
    targetDestinations: ["profile", "timeline"],
    targetProfileIds: ["local-profile-north-bell"],
    targetTimelineEntryIds: ["local-timeline-noon-bell"],
    notes: "Place routing can support timeline review without explaining the bell paradox."
  },
  {
    id: "local-x-organization-council",
    displayText: "city council",
    elementType: "organization",
    phrase: "city council has been selling minutes",
    aliases: ["council"],
    confidence: 0.9,
    canonRisk: "high",
    spoilerLevel: "high",
    unresolvedDependencies: ["Council motive"],
    targetDestinations: ["profile", "claim", "unresolved_decision"],
    targetProfileIds: ["local-profile-council"],
    targetClaimIds: ["local-claim-council-selling-minutes"],
    notes: "The adapter preserves the institution as a candidate while keeping motive undecided."
  },
  {
    id: "local-x-event-917",
    displayText: "arcade closes at 9:17",
    elementType: "event",
    phrase: "closes every night at 9:17",
    aliases: ["9:17 closing", "nightly arcade closing"],
    confidence: 0.96,
    canonRisk: "low",
    spoilerLevel: "low",
    targetDestinations: ["claim", "timeline"],
    targetClaimIds: ["local-claim-arcade-closes-917"],
    targetTimelineEntryIds: ["local-timeline-917"],
    notes: "A repeatable time cue can be routed as a held event candidate."
  },
  {
    id: "local-x-object-brass-moth",
    displayText: "brass moth",
    elementType: "object",
    phrase: "brass moth in the workshop drawer",
    aliases: ["moth", "workshop moth"],
    confidence: 0.95,
    canonRisk: "high",
    spoilerLevel: "high",
    unresolvedDependencies: ["brass moth truth"],
    targetDestinations: ["profile", "claim", "timeline", "unresolved_decision"],
    targetProfileIds: ["local-profile-brass-moth"],
    targetClaimIds: ["local-claim-brass-moth-found"],
    targetTimelineEntryIds: ["local-timeline-brass-moth"],
    notes: "The adapter may extract the object, but must not decide whether it is proof, key, spy, or memory."
  },
  {
    id: "local-x-concept-stolen-minutes",
    displayText: "selling minutes from abandoned lives",
    elementType: "concept",
    phrase: "selling minutes from abandoned lives",
    aliases: ["stolen minutes", "abandoned lives"],
    confidence: 0.88,
    canonRisk: "high",
    spoilerLevel: "medium",
    unresolvedDependencies: ["Council motive"],
    targetDestinations: ["profile", "claim"],
    targetProfileIds: ["local-profile-stolen-minutes"],
    targetClaimIds: ["local-claim-council-selling-minutes"],
    notes: "Premise concept is extracted as a review candidate, not as final canon motive."
  },
  {
    id: "local-x-document-ledger",
    displayText: "ledger of minutes",
    elementType: "document",
    phrase: "ledger of minutes",
    aliases: ["ledger", "locked cabinet record"],
    confidence: 0.84,
    canonRisk: "medium",
    spoilerLevel: "medium",
    targetDestinations: ["profile", "claim"],
    targetProfileIds: ["local-profile-ledger"],
    targetClaimIds: ["local-claim-ledger-exists"],
    notes: "Document-like evidence remains a candidate until reviewed."
  },
  {
    id: "local-x-visual-observatory",
    displayText: "observatory rings without a bell",
    elementType: "visual_asset",
    phrase: "still rings at noon even though its bell was removed",
    aliases: ["empty bell tower", "noon bell paradox"],
    confidence: 0.78,
    canonRisk: "medium",
    spoilerLevel: "medium",
    targetDestinations: ["profile", "claim", "timeline"],
    targetProfileIds: ["local-profile-observatory-visual"],
    targetClaimIds: ["local-claim-bell-rings"],
    targetTimelineEntryIds: ["local-timeline-noon-bell"],
    notes: "Visual asset routing keeps profile-side review and does not create a release asset."
  },
  {
    id: "local-x-placeholder-magic",
    displayText: "magic explanation placeholder",
    elementType: "placeholder",
    phrase: "Do not explain the magic too early",
    aliases: ["magic timing", "rule gap"],
    confidence: 0.7,
    canonRisk: "high",
    spoilerLevel: "high",
    unresolvedDependencies: ["brass moth truth", "Council motive"],
    targetDestinations: ["profile", "unresolved_decision"],
    targetProfileIds: ["local-profile-magic-placeholder"],
    notes: "The adapter surfaces a gap instead of inventing the magic rule."
  },
  {
    id: "local-x-source-raw-memo",
    displayText: "sample raw memo",
    elementType: "source_reference",
    phrase: "Working title: The Clockmaker Under Glass",
    aliases: ["sample memo", "raw memo file"],
    confidence: 1,
    canonRisk: "low",
    spoilerLevel: "low",
    targetDestinations: ["source_reference"],
    notes: "Every adapter candidate must remain traceable to this source memo."
  },
  {
    id: "local-x-unresolved-council-motive",
    displayText: "Council motive",
    elementType: "unresolved_decision",
    phrase: "Council motive is unresolved",
    aliases: ["villainous or desperate", "motive route"],
    confidence: 0.86,
    canonRisk: "high",
    spoilerLevel: "high",
    unresolvedDependencies: ["Council motive"],
    targetDestinations: ["unresolved_decision", "claim", "timeline"],
    targetClaimIds: ["local-claim-council-motive-open"],
    targetTimelineEntryIds: ["local-timeline-council-motive"],
    sourceRefIds: [SOURCE_REF.id, HUMAN_REVIEW_REF.id],
    notes: "Freeform human review remains the source of truth for the motive route."
  }
];

async function main() {
  const [inputPath = DEFAULT_INPUT, outputPath = DEFAULT_OUTPUT, smokePath = DEFAULT_SMOKE] = process.argv.slice(2);
  const rawMemo = await readFile(inputPath, "utf8");
  const payload = buildExtractionPayload(rawMemo, inputPath);

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  const validation = runNode(["tools/fff-state.mjs", "validate-extraction", outputPath]);
  const fixtureMatrix = runNode(["tools/fff-state.mjs", "validate-extraction-fixtures", FIXTURE_DIR]);
  const smoke = buildSmokeResult(inputPath, outputPath, rawMemo, payload, validation, fixtureMatrix);

  await mkdir(path.dirname(smokePath), { recursive: true });
  await writeFile(smokePath, `${JSON.stringify(smoke, null, 2)}\n`, "utf8");

  if (!validation.ok || !fixtureMatrix.ok) {
    console.error(`local extraction adapter smoke failed ${inputPath} -> ${outputPath}`);
    process.exit(1);
  }

  console.log(`local extraction adapter smoke passed ${inputPath} -> ${outputPath}`);
}

function buildExtractionPayload(rawMemo, inputPath) {
  const sourceRef = {
    ...SOURCE_REF,
    locator: inputPath
  };
  const sourceRefs = [sourceRef, DERIVED_REF, HUMAN_REVIEW_REF];
  const extractedElements = ELEMENT_SPECS.map((spec) => buildElement(spec, rawMemo));

  return {
    extractionRunId: "local-extract-clockmaker-adapter-001",
    schemaVersion: "fff.extractionContract.v1",
    sourceDraftId: "draft-clockmaker-local-adapter-001",
    sourceMemoRef: inputPath,
    sourceRefs,
    generatedAt: "2026-06-20T00:00:00+09:00",
    generatorType: "local_deterministic_adapter",
    generatorLabel: "Zero-dependency deterministic local adapter; no model/API call",
    extractionMode: "local_rule_based_no_model_api",
    confidencePolicy: {
      defaultConfidence: 0.72,
      lowConfidenceAction: "hold",
      highCanonRiskAction: "hold_until_human_review",
      freeformReviewAuthority: "freeform human review text is the source of truth"
    },
    extractedElements,
    profileCandidates: buildProfileCandidates(),
    claimCandidates: buildClaimCandidates(),
    timelineEntryCandidates: buildTimelineCandidates(),
    unresolvedDependencies: ["Toma fate", "brass moth truth", "Council motive"],
    reviewSafeDefaults: {
      defaultReviewStatus: "hold",
      allowAdopt: true,
      allowProvisional: true,
      allowReject: true,
      autoCanonPromotion: false,
      autoChronologyPromotion: false,
      unknownSourceHandling: "preserve_unknown_fields_and_hold_candidates"
    },
    decisionLogSafeMetadata: {
      owner: "human_author",
      statusVocabulary: ["adopt", "provisional", "hold", "reject"],
      fixedPhraseRequired: false,
      freeformReviewAllowed: true,
      reversibleActionsOnly: true
    },
    warnings: [
      "This payload was generated by a deterministic local adapter, not a model/API extractor.",
      "Toma fate remains human-owned and unresolved.",
      "Brass moth truth remains human-owned and unresolved.",
      "Council motive remains human-owned and unresolved.",
      "Candidate routing is review-held and must not auto-promote canon, chronology, visual assets, or production decisions."
    ],
    unknownFieldsPolicy: "Preserve unknown adapter fields for JSON review and keep candidates held until freeform human review.",
    humanAuthorityBoundaries: [
      "Freeform user review is the source of truth.",
      "Toma fate remains human-owned.",
      "Brass moth truth remains human-owned.",
      "Council motive remains human-owned.",
      "No model/API call, database persistence, production sync, publishing, upload, or AI video generation is introduced by this local adapter."
    ],
    notes: "Local deterministic extraction adapter spike connecting sample raw memo input to a validator-backed Extraction Contract payload while preserving human-owned canon boundaries.",
    adapterTrace: {
      inputPath,
      toolPath: "tools/fff-extract-local.mjs",
      deterministicRules: ["literal phrase lookup", "static routing map", "review-held defaults"],
      noModelApi: true
    }
  };
}

function buildElement(spec, rawMemo) {
  const start = rawMemo.indexOf(spec.phrase);
  const end = start >= 0 ? start + spec.phrase.length : null;
  return {
    id: spec.id,
    displayText: spec.displayText,
    elementType: spec.elementType,
    aliases: spec.aliases,
    sourceSpan: {
      text: spec.phrase,
      start: start >= 0 ? start : null,
      end
    },
    sourceRefIds: spec.sourceRefIds || [SOURCE_REF.id],
    confidence: spec.confidence,
    suggestedReviewStatus: "hold",
    reviewStatus: "hold",
    unresolvedDependencies: spec.unresolvedDependencies || [],
    canonRisk: spec.canonRisk,
    spoilerLevel: spec.spoilerLevel,
    targetDestinations: spec.targetDestinations,
    targetProfileIds: spec.targetProfileIds || [],
    targetClaimIds: spec.targetClaimIds || [],
    targetTimelineEntryIds: spec.targetTimelineEntryIds || [],
    notes: spec.notes
  };
}

function buildProfileCandidates() {
  return [
    profile("local-profile-mira", "Mira Vale", "person", "extracted_candidate", [], "Clock repairer candidate extracted from the sample memo."),
    profile("local-profile-toma", "Toma", "person", "needs_human_decision", ["Toma fate"], "Missing brother candidate; fate stays unresolved."),
    profile("local-profile-council", "City council", "organization", "held_ghost", ["Council motive"], "Institution candidate with unresolved motive."),
    profile("local-profile-brass-moth", "Brass moth", "object", "held_ghost", ["brass moth truth"], "Object candidate with unresolved function."),
    profile("local-profile-north-bell", "North Bell Station", "place", "extracted_candidate", [], "Place candidate for timeline review."),
    profile("local-profile-stolen-minutes", "Stolen minutes", "concept", "held_ghost", ["Council motive"], "Concept candidate, not canon motive."),
    profile("local-profile-ledger", "Ledger of minutes", "document", "extracted_candidate", [], "Document candidate from the sample memo."),
    profile("local-profile-observatory-visual", "Observatory bell visual", "visual_asset", "extracted_candidate", [], "Visual review cue, not release asset."),
    profile("local-profile-magic-placeholder", "Magic explanation placeholder", "placeholder", "needs_human_decision", ["brass moth truth", "Council motive"], "Gap marker for later human review.")
  ];
}

function profile(id, displayName, profileType, ghostNodeStatus, unresolvedDependencies, summary) {
  return {
    id,
    displayName,
    aliases: [],
    profileType,
    profileStatus: "local_adapter_candidate",
    ghostNodeStatus,
    worldStatus: "review candidate",
    realityStatus: "pure fiction",
    firstAppearanceWorkId: "work-clockmaker-under-glass",
    linkedClaimIds: [],
    linkedTimelineEntryIds: [],
    relatedProfileIds: [],
    unresolvedDependencies,
    knownBy: ["sample raw memo"],
    unknownBy: [],
    believedBy: [],
    misunderstoodBy: [],
    ownedItems: [],
    sourceRefs: [SOURCE_REF],
    assetRefs: [],
    canonRisk: unresolvedDependencies.length ? "high" : "medium",
    spoilerLevel: unresolvedDependencies.length ? "high" : "medium",
    reviewStatus: "hold",
    notes: "Generated by deterministic local adapter; remains review-held.",
    summary,
    open_questions: unresolvedDependencies.map((dependency) => `Resolve ${dependency} before canon adoption.`)
  };
}

function buildClaimCandidates() {
  return [
    claim("local-claim-mira-repairs-clocks", "Mira repairs clocks in the glass arcade.", "world truth", "local-profile-mira", []),
    claim("local-claim-arcade-closes-917", "The glass arcade closes every night at 9:17.", "world truth", "local-x-event-917", []),
    claim("local-claim-toma-left-moth", "Toma left a brass moth and a note in the workshop drawer.", "unresolved candidate", "local-profile-toma", ["Toma fate", "brass moth truth"]),
    claim("local-claim-council-selling-minutes", "The city council may be selling minutes from abandoned lives.", "unresolved candidate", "local-profile-council", ["Council motive"]),
    claim("local-claim-bell-rings", "The observatory rings at noon despite its bell being removed.", "viewer knowledge", "local-profile-observatory-visual", []),
    claim("local-claim-ledger-exists", "A ledger of minutes is kept in a locked cabinet.", "unresolved candidate", "local-profile-ledger", ["Council motive"]),
    claim("local-claim-council-motive-open", "The council motive may be villainous, desperate, divided, or misled.", "production note", "local-profile-council", ["Council motive"])
  ];
}

function claim(id, claimText, claimScope, subjectRef, unresolvedDependencies) {
  return {
    id,
    work_id: "work-clockmaker-under-glass",
    claimText,
    claimScope,
    worldTruthStatus: unresolvedDependencies.length ? "uncertain" : "planned reversal",
    realityStatus: "pure fiction",
    sourceRefs: [SOURCE_REF],
    subjectRefs: [subjectRef],
    speakerOrNarratorRef: "sample raw memo",
    viewerDisclosureStatus: unresolvedDependencies.length ? "hidden from viewer" : "viewer-facing now",
    spoilerLevel: unresolvedDependencies.length ? "high" : "medium",
    canonRisk: unresolvedDependencies.length ? "high" : "medium",
    unresolvedDependencies,
    supportsClaimIds: [],
    contradictsClaimIds: [],
    reviewStatus: "hold",
    notes: "Generated by deterministic local adapter; review-held by default."
  };
}

function buildTimelineCandidates() {
  return [
    timeline("local-timeline-917", "The arcade closes at 9:17.", "story_order", "Every night at 9:17", []),
    timeline("local-timeline-toma-note", "Toma's note points Mira toward stolen minutes.", "story_order", "Before Mira investigates the council ledger", ["Toma fate"]),
    timeline("local-timeline-noon-bell", "The observatory rings at noon without its bell.", "calendar_time", "Noon during present action", []),
    timeline("local-timeline-brass-moth", "The brass moth gets a reversible first-use beat.", "viewer_disclosure_order", "After Toma's note is found", ["brass moth truth"]),
    timeline("local-timeline-council-motive", "Council motive remains a held reveal route.", "viewer_disclosure_order", "After ledger evidence appears", ["Council motive"])
  ];
}

function timeline(id, title, timelineAxis, calendarTime, unresolvedDependencies) {
  return {
    id,
    work_id: "work-clockmaker-under-glass",
    title,
    summary: "Generated by deterministic local adapter for review-held timeline routing.",
    timelineAxis,
    storyOrder: "local adapter candidate",
    calendarTime,
    calendarPrecision: timelineAxis === "calendar_time" ? "clock_time" : "relative_sequence",
    viewerDisclosureOrder: unresolvedDependencies.length ? "held for human review" : "viewer-facing candidate",
    viewerDisclosureStatus: unresolvedDependencies.length ? "hidden from viewer" : "viewer-facing now",
    productionOrder: "Do not storyboard as final from adapter output.",
    historicalReferenceTime: "not set",
    linkedClaimIds: [],
    linkedProfileIds: [],
    linkedWorkIds: ["work-clockmaker-under-glass"],
    unresolvedDependencies,
    spoilerLevel: unresolvedDependencies.length ? "high" : "medium",
    canonRisk: unresolvedDependencies.length ? "high" : "medium",
    reviewStatus: "hold",
    sourceRefs: [SOURCE_REF],
    notes: "Timeline candidate remains review-held and cannot auto-promote chronology."
  };
}

function buildSmokeResult(inputPath, outputPath, rawMemo, payload, validation, fixtureMatrix) {
  const elements = payload.extractedElements;
  const boundaryText = payload.humanAuthorityBoundaries.join(" ").toLowerCase();
  const guardStatus = {
    noModelApi: payload.generatorType === "local_deterministic_adapter",
    sourceRefsPresent: payload.sourceRefs.length >= 1 && elements.every((element) => element.sourceRefIds.length > 0),
    reviewSafeDefaults: payload.reviewSafeDefaults.defaultReviewStatus === "hold" && payload.reviewSafeDefaults.autoCanonPromotion === false && payload.reviewSafeDefaults.autoChronologyPromotion === false,
    humanAuthorityBoundaries: boundaryText.includes("toma fate") && boundaryText.includes("brass moth truth") && boundaryText.includes("council motive"),
    visualAssetBufferedThroughProfile: elements.filter((element) => element.elementType === "visual_asset").every((element) => element.targetDestinations.includes("profile")),
    freeformReviewAllowed: payload.decisionLogSafeMetadata.freeformReviewAllowed === true
  };
  return {
    artifact_id: "fff-local-extraction-adapter-spike-001",
    generatedAt: "2026-06-20T00:00:00+09:00",
    input: {
      path: inputPath,
      characters: rawMemo.length,
      sourceRefIds: payload.sourceRefs.map((sourceRef) => sourceRef.id)
    },
    output: {
      path: outputPath,
      extractionRunId: payload.extractionRunId,
      elementCount: elements.length,
      elementTypes: [...new Set(elements.map((element) => element.elementType))],
      profileCandidateCount: payload.profileCandidates.length,
      claimCandidateCount: payload.claimCandidates.length,
      timelineEntryCandidateCount: payload.timelineEntryCandidates.length,
      unresolvedDependencies: payload.unresolvedDependencies
    },
    validation: {
      validateExtraction: commandResult(validation),
      fixtureMatrix: commandResult(fixtureMatrix)
    },
    guardStatus,
    passed: validation.ok && fixtureMatrix.ok && Object.values(guardStatus).every(Boolean)
  };
}

function commandResult(result) {
  return {
    ok: result.ok,
    command: result.command,
    exitCode: result.status,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim()
  };
}

function runNode(args) {
  const result = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8"
  });
  return {
    ok: result.status === 0,
    command: `node ${args.join(" ")}`,
    status: result.status,
    stdout: result.stdout || "",
    stderr: result.stderr || ""
  };
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
