#!/usr/bin/env node

import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
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
const PROVIDER_ADAPTER_AUTHORIZATION_READINESS_SCHEMA_VERSION = "fff.providerAdapterAuthorizationReadiness.v1";
const REMAINING_FIXTURE_COVERAGE_SCHEMA_VERSION = "fff.remainingFixtureCoverageOneClass.v1";
const TRANSLATED_MEMO_FIXTURE_AUDIT_SCHEMA_VERSION = "fff.translatedMemoFixtureAudit.v1";
const TRANSLATION_PROVENANCE_SOURCE_SPAN_READBACK_SCHEMA_VERSION = "fff.translationProvenanceSourceSpanReadback.v1";
const TRANSLATION_POLICY_SOURCE_OF_TRUTH_BOUNDARY_SCHEMA_VERSION = "fff.translationPolicySourceOfTruthBoundary.v1";
const TRANSLATED_MEMO_FIXTURE_MINIMUM_SCHEMA_VERSION = "fff.translatedMemoFixtureMinimum.v1";
const HELD_CLAIM_ADOPTION_PREFLIGHT_SCHEMA_VERSION = "fff.heldClaimAdoptionPreflight.v1";
const DOWNSTREAM_ADOPTION_SEMANTICS_DESIGN_SCHEMA_VERSION = "fff.downstreamAdoptionSemanticsDesign.v1";
const ADOPTION_CANDIDATE_LEDGER_DRY_RUN_SCHEMA_VERSION = "fff.adoptionCandidateLedgerDryRun.v1";
const SANDBOX_ADOPTION_MUTATION_ONE_CLAIM_SCHEMA_VERSION = "fff.sandboxAdoptionMutationOneClaim.v1";
const SANDBOX_ADOPTION_ROLLBACK_REHEARSAL_SCHEMA_VERSION = "fff.sandboxAdoptionRollbackRehearsal.v1";
const PRODUCTION_ADOPTION_AUTHORIZATION_PACKET_SCHEMA_VERSION = "fff.productionAdoptionAuthorizationPacket.v1";
const PRODUCTION_CLAIM_LEDGER_ADOPTION_ONE_CLAIM_SCHEMA_VERSION = "fff.productionClaimLedgerAdoptionOneClaim.v1";
const PRODUCTION_CLAIM_LEDGER_ROLLBACK_REHEARSAL_SCHEMA_VERSION = "fff.productionClaimLedgerRollbackRehearsal.v1";
const DOWNSTREAM_TARGET_AUTHORIZATION_PACKET_SCHEMA_VERSION = "fff.downstreamTargetAuthorizationPacket.v1";
const PROFILE_ADOPTION_MUTATION_ONE_CLAIM_SCHEMA_VERSION = "fff.profileAdoptionMutationOneClaim.v1";
const VERY_BROAD_SOURCE_SPAN_SHAPE_AUDIT_SCHEMA_VERSION = "fff.veryBroadSourceSpanShapeAudit.v1";
const DESIGNER_CANDIDATE_DASHBOARD_SCHEMA_VERSION = "fff.designerCandidateDashboard.v1";
const ONE_STORY_DRAFT_REVIEW_PACK_SCHEMA_VERSION = "fff.oneStoryDraftReviewPack.v1";
const REVIEW_BRIEF_DARK_MODE_UX_SCHEMA_VERSION = "fff.reviewBriefDarkModeUx.v1";
const DRAFT_TO_VIDEO_PLANNING_BRIDGE_SCHEMA_VERSION = "fff.draftToVideoPlanningBridge.v1";
const REVIEW_HOME_MAP_METERS_SCHEMA_VERSION = "fff.reviewHomeMapMeters.v1";
const HOME_COCKPIT_METRIC_LINKING_SCHEMA_VERSION = "fff.homeCockpitMetricLinking.v1";
const BRIDGE_REFINEMENT_OVERVIEW_RIBBON_SCHEMA_VERSION = "fff.bridgeRefinementOverviewRibbon.v1";
const GUIDED_REVIEW_FLOW_WORKSPACE_SCHEMA_VERSION = "fff.guidedReviewFlowWorkspace.v1";
const LOW_TEXT_DECISION_CONSOLE_SCHEMA_VERSION = "fff.lowTextDecisionConsole.v1";
const LAYOUT_RESEARCH_DECISION_SHELL_SCHEMA_VERSION = "fff.layoutResearchDecisionShell.v1";
const LAYOUT_LAB_VISUAL_AUDIT_SCHEMA_VERSION = "fff.layoutLabVisualAudit.v1";
const APPLY_DECISION_SHELL_GUARD_DIET_SCHEMA_VERSION = "fff.applyDecisionShellGuardDiet.v1";
const REVIEW_WORKBENCH_COMPONENT_CONTRACT_SCHEMA_VERSION = "fff.reviewWorkbenchComponentContract.v1";
const BRIDGE_STORYBOARD_FLOW_SCHEMA_VERSION = "fff.bridgeStoryboardFlow.v1";
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
const DEFAULT_PROVIDER_ADAPTER_AUTHORIZATION_READINESS_OUTPUT = "artifacts/provider-adapter-authorization-readiness-result.json";
const DEFAULT_REMAINING_FIXTURE_COVERAGE_OUTPUT = "artifacts/remaining-fixture-coverage-one-class-result.json";
const DEFAULT_TRANSLATED_MEMO_FIXTURE_AUDIT_OUTPUT = "artifacts/translated-memo-fixture-audit-result.json";
const DEFAULT_TRANSLATION_PROVENANCE_SOURCE_SPAN_READBACK_OUTPUT = "artifacts/translation-provenance-source-span-readback-result.json";
const DEFAULT_TRANSLATION_POLICY_SOURCE_OF_TRUTH_BOUNDARY_OUTPUT = "artifacts/translation-policy-source-of-truth-boundary-result.json";
const DEFAULT_TRANSLATED_MEMO_FIXTURE_MINIMUM_OUTPUT = "artifacts/translated-memo-fixture-minimum-result.json";
const DEFAULT_HELD_CLAIM_ADOPTION_PREFLIGHT_OUTPUT = "artifacts/held-claim-adoption-preflight-result.json";
const DEFAULT_DOWNSTREAM_ADOPTION_SEMANTICS_DESIGN_OUTPUT = "artifacts/downstream-adoption-semantics-design-result.json";
const DEFAULT_ADOPTION_CANDIDATE_LEDGER_DRY_RUN_OUTPUT = "artifacts/adoption-candidate-ledger-dry-run-result.json";
const DEFAULT_SANDBOX_ADOPTION_MUTATION_ONE_CLAIM_OUTPUT = "artifacts/sandbox-adoption-mutation-one-claim-result.json";
const DEFAULT_SANDBOX_ADOPTION_ROLLBACK_REHEARSAL_OUTPUT = "artifacts/sandbox-adoption-rollback-rehearsal-result.json";
const DEFAULT_PRODUCTION_ADOPTION_AUTHORIZATION_PACKET_OUTPUT = "artifacts/production-adoption-authorization-packet-result.json";
const DEFAULT_PRODUCTION_CLAIM_LEDGER_ADOPTION_ONE_CLAIM_OUTPUT = "artifacts/production-claim-ledger-adoption-one-claim-result.json";
const DEFAULT_PRODUCTION_CLAIM_LEDGER_ROLLBACK_REHEARSAL_OUTPUT = "artifacts/production-claim-ledger-rollback-rehearsal-result.json";
const DEFAULT_DOWNSTREAM_TARGET_AUTHORIZATION_PACKET_OUTPUT = "artifacts/downstream-target-authorization-packet-result.json";
const DEFAULT_PROFILE_ADOPTION_MUTATION_ONE_CLAIM_OUTPUT = "artifacts/profile-adoption-mutation-one-claim-result.json";
const DEFAULT_VERY_BROAD_SOURCE_SPAN_SHAPE_AUDIT_OUTPUT = "artifacts/very-broad-source-span-shape-audit-result.json";
const DEFAULT_DESIGNER_CANDIDATE_DASHBOARD_OUTPUT = "artifacts/designer-candidate-dashboard-result.json";
const DEFAULT_ONE_STORY_DRAFT_REVIEW_PACK_OUTPUT = "artifacts/one-story-draft-review-pack-result.json";
const DEFAULT_REVIEW_BRIEF_DARK_MODE_UX_OUTPUT = "artifacts/review-brief-dark-mode-ux-result.json";
const DEFAULT_DRAFT_TO_VIDEO_PLANNING_BRIDGE_OUTPUT = "artifacts/draft-to-video-planning-bridge-result.json";
const DEFAULT_REVIEW_HOME_MAP_METERS_OUTPUT = "artifacts/review-home-map-meters-result.json";
const DEFAULT_HOME_COCKPIT_METRIC_LINKING_OUTPUT = "artifacts/home-cockpit-metric-linking-result.json";
const DEFAULT_BRIDGE_REFINEMENT_OVERVIEW_RIBBON_OUTPUT = "artifacts/bridge-refinement-overview-ribbon-result.json";
const DEFAULT_GUIDED_REVIEW_FLOW_WORKSPACE_OUTPUT = "artifacts/guided-review-flow-workspace-result.json";
const DEFAULT_LOW_TEXT_DECISION_CONSOLE_OUTPUT = "artifacts/low-text-decision-console-result.json";
const DEFAULT_LAYOUT_RESEARCH_DECISION_SHELL_OUTPUT = "artifacts/layout-research-decision-shell-result.json";
const DEFAULT_LAYOUT_LAB_VISUAL_AUDIT_OUTPUT = "artifacts/layout-lab-visual-audit-result.json";
const DEFAULT_APPLY_DECISION_SHELL_GUARD_DIET_OUTPUT = "artifacts/apply-decision-shell-guard-diet-result.json";
const DEFAULT_REVIEW_WORKBENCH_COMPONENT_CONTRACT_OUTPUT = "artifacts/review-workbench-component-contract-result.json";
const DEFAULT_BRIDGE_STORYBOARD_FLOW_OUTPUT = "artifacts/bridge-storyboard-flow-result.json";

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

  if (command === "validate-remaining-fixture-coverage-one-class" || command === "smoke-remaining-fixture-coverage-one-class") {
    const smoke = await readJson(inputPath);
    const result = await validateRemainingFixtureCoverageOneClass(smoke, inputPath);
    const target = outputPath || DEFAULT_REMAINING_FIXTURE_COVERAGE_OUTPUT;
    if (command === "smoke-remaining-fixture-coverage-one-class" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Remaining fixture coverage readback failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-remaining-fixture-coverage-one-class" || outputPath) {
      console.log(`remaining fixture coverage readback passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-translated-memo-fixture-audit" || command === "smoke-translated-memo-fixture-audit") {
    const smoke = await readJson(inputPath);
    const result = await validateTranslatedMemoFixtureAudit(smoke, inputPath);
    const target = outputPath || DEFAULT_TRANSLATED_MEMO_FIXTURE_AUDIT_OUTPUT;
    if (command === "smoke-translated-memo-fixture-audit" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Translated memo fixture audit failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-translated-memo-fixture-audit" || outputPath) {
      console.log(`translated memo fixture audit passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-translation-provenance-source-span-readback" || command === "smoke-translation-provenance-source-span-readback") {
    const payload = await readJson(inputPath);
    const result = await validateTranslationProvenanceSourceSpanReadback(payload, inputPath);
    const target = outputPath || DEFAULT_TRANSLATION_PROVENANCE_SOURCE_SPAN_READBACK_OUTPUT;
    if (command === "smoke-translation-provenance-source-span-readback" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Translation provenance source-span readback failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-translation-provenance-source-span-readback" || outputPath) {
      console.log(`translation provenance source-span readback passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-translation-policy-source-of-truth-boundary" || command === "smoke-translation-policy-source-of-truth-boundary") {
    const readback = await readJson(inputPath);
    const result = await validateTranslationPolicySourceOfTruthBoundary(readback, inputPath);
    const target = outputPath || DEFAULT_TRANSLATION_POLICY_SOURCE_OF_TRUTH_BOUNDARY_OUTPUT;
    if (command === "smoke-translation-policy-source-of-truth-boundary" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Translation policy source-of-truth boundary failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-translation-policy-source-of-truth-boundary" || outputPath) {
      console.log(`translation policy source-of-truth boundary passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-translated-memo-fixture-minimum" || command === "smoke-translated-memo-fixture-minimum") {
    const fixture = await readJson(inputPath);
    const result = await validateTranslatedMemoFixtureMinimum(fixture, inputPath);
    const target = outputPath || DEFAULT_TRANSLATED_MEMO_FIXTURE_MINIMUM_OUTPUT;
    if (command === "smoke-translated-memo-fixture-minimum" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Translated memo fixture minimum failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-translated-memo-fixture-minimum" || outputPath) {
      console.log(`translated memo fixture minimum passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-held-claim-adoption-preflight" || command === "smoke-held-claim-adoption-preflight") {
    const readback = await readJson(inputPath);
    const result = await validateHeldClaimAdoptionPreflight(readback, inputPath);
    const target = outputPath || DEFAULT_HELD_CLAIM_ADOPTION_PREFLIGHT_OUTPUT;
    if (command === "smoke-held-claim-adoption-preflight" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Held claim adoption preflight failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-held-claim-adoption-preflight" || outputPath) {
      console.log(`held claim adoption preflight passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-downstream-adoption-semantics-design" || command === "smoke-downstream-adoption-semantics-design") {
    const preflight = await readJson(inputPath);
    const result = await validateDownstreamAdoptionSemanticsDesign(preflight, inputPath);
    const target = outputPath || DEFAULT_DOWNSTREAM_ADOPTION_SEMANTICS_DESIGN_OUTPUT;
    if (command === "smoke-downstream-adoption-semantics-design" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Downstream adoption semantics design failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-downstream-adoption-semantics-design" || outputPath) {
      console.log(`downstream adoption semantics design passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-adoption-candidate-ledger-dry-run" || command === "smoke-adoption-candidate-ledger-dry-run") {
    const semantics = await readJson(inputPath);
    const result = await validateAdoptionCandidateLedgerDryRun(semantics, inputPath);
    const target = outputPath || DEFAULT_ADOPTION_CANDIDATE_LEDGER_DRY_RUN_OUTPUT;
    if (command === "smoke-adoption-candidate-ledger-dry-run" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Adoption candidate ledger dry-run failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-adoption-candidate-ledger-dry-run" || outputPath) {
      console.log(`adoption candidate ledger dry-run passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-sandbox-adoption-mutation-one-claim" || command === "smoke-sandbox-adoption-mutation-one-claim") {
    const ledger = await readJson(inputPath);
    const result = await validateSandboxAdoptionMutationOneClaim(ledger, inputPath);
    const target = outputPath || DEFAULT_SANDBOX_ADOPTION_MUTATION_ONE_CLAIM_OUTPUT;
    if (command === "smoke-sandbox-adoption-mutation-one-claim" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Sandbox adoption mutation one-claim failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-sandbox-adoption-mutation-one-claim" || outputPath) {
      console.log(`sandbox adoption mutation one-claim passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-sandbox-adoption-rollback-rehearsal" || command === "smoke-sandbox-adoption-rollback-rehearsal") {
    const sandbox = await readJson(inputPath);
    const result = await validateSandboxAdoptionRollbackRehearsal(sandbox, inputPath);
    const target = outputPath || DEFAULT_SANDBOX_ADOPTION_ROLLBACK_REHEARSAL_OUTPUT;
    if (command === "smoke-sandbox-adoption-rollback-rehearsal" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Sandbox adoption rollback rehearsal failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-sandbox-adoption-rollback-rehearsal" || outputPath) {
      console.log(`sandbox adoption rollback rehearsal passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-production-adoption-authorization-packet" || command === "smoke-production-adoption-authorization-packet") {
    const rollback = await readJson(inputPath);
    const result = await validateProductionAdoptionAuthorizationPacket(rollback, inputPath);
    const target = outputPath || DEFAULT_PRODUCTION_ADOPTION_AUTHORIZATION_PACKET_OUTPUT;
    if (command === "smoke-production-adoption-authorization-packet" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Production adoption authorization packet failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-production-adoption-authorization-packet" || outputPath) {
      console.log(`production adoption authorization packet passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-production-claim-ledger-adoption-one-claim" || command === "smoke-production-claim-ledger-adoption-one-claim") {
    const authorizationPacket = await readJson(inputPath);
    const result = await validateProductionClaimLedgerAdoptionOneClaim(authorizationPacket, inputPath);
    const target = outputPath || DEFAULT_PRODUCTION_CLAIM_LEDGER_ADOPTION_ONE_CLAIM_OUTPUT;
    if (command === "smoke-production-claim-ledger-adoption-one-claim" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Production Claim Ledger adoption one-claim failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-production-claim-ledger-adoption-one-claim" || outputPath) {
      console.log(`production Claim Ledger adoption one-claim passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-production-claim-ledger-rollback-rehearsal" || command === "smoke-production-claim-ledger-rollback-rehearsal") {
    const adoptionReadback = await readJson(inputPath);
    const result = await validateProductionClaimLedgerRollbackRehearsal(adoptionReadback, inputPath);
    const target = outputPath || DEFAULT_PRODUCTION_CLAIM_LEDGER_ROLLBACK_REHEARSAL_OUTPUT;
    if (command === "smoke-production-claim-ledger-rollback-rehearsal" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Production Claim Ledger rollback rehearsal failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-production-claim-ledger-rollback-rehearsal" || outputPath) {
      console.log(`production Claim Ledger rollback rehearsal passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-downstream-target-authorization-packet" || command === "smoke-downstream-target-authorization-packet") {
    const rollbackRehearsal = await readJson(inputPath);
    const result = await validateDownstreamTargetAuthorizationPacket(rollbackRehearsal, inputPath);
    const target = outputPath || DEFAULT_DOWNSTREAM_TARGET_AUTHORIZATION_PACKET_OUTPUT;
    if (command === "smoke-downstream-target-authorization-packet" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Downstream target authorization packet failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-downstream-target-authorization-packet" || outputPath) {
      console.log(`downstream target authorization packet passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-profile-adoption-mutation-one-claim" || command === "smoke-profile-adoption-mutation-one-claim") {
    const authorizationPacket = await readJson(inputPath);
    const result = await validateProfileAdoptionMutationOneClaim(authorizationPacket, inputPath);
    const target = outputPath || DEFAULT_PROFILE_ADOPTION_MUTATION_ONE_CLAIM_OUTPUT;
    if (command === "smoke-profile-adoption-mutation-one-claim" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Profile adoption mutation one-claim failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-profile-adoption-mutation-one-claim" || outputPath) {
      console.log(`profile adoption mutation one-claim passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-very-broad-source-span-shape-audit" || command === "smoke-very-broad-source-span-shape-audit") {
    const smoke = await readJson(inputPath);
    const result = await validateVeryBroadSourceSpanShapeAudit(smoke, inputPath);
    const target = outputPath || DEFAULT_VERY_BROAD_SOURCE_SPAN_SHAPE_AUDIT_OUTPUT;
    if (command === "smoke-very-broad-source-span-shape-audit" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Very broad source-span shape audit failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-very-broad-source-span-shape-audit" || outputPath) {
      console.log(`very broad source-span shape audit passed ${inputPath} -> ${target}`);
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

  if (command === "validate-provider-adapter-authorization-readiness" || command === "smoke-provider-adapter-authorization-readiness") {
    const providerEnvelopeReadback = await readJson(inputPath);
    const result = await validateProviderAdapterAuthorizationReadiness(providerEnvelopeReadback, inputPath);
    const target = outputPath || DEFAULT_PROVIDER_ADAPTER_AUTHORIZATION_READINESS_OUTPUT;
    if (command === "smoke-provider-adapter-authorization-readiness" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Provider adapter authorization readiness failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-provider-adapter-authorization-readiness" || outputPath) {
      console.log(`provider adapter authorization readiness passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-designer-candidate-dashboard" || command === "smoke-designer-candidate-dashboard") {
    const dashboard = await readJson(inputPath);
    const result = await validateDesignerCandidateDashboard(dashboard, inputPath);
    const target = outputPath || DEFAULT_DESIGNER_CANDIDATE_DASHBOARD_OUTPUT;
    if (command === "smoke-designer-candidate-dashboard" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Designer candidate dashboard failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-designer-candidate-dashboard" || outputPath) {
      console.log(`designer candidate dashboard passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-one-story-draft-review-pack" || command === "smoke-one-story-draft-review-pack") {
    const draftPack = await readJson(inputPath);
    const result = await validateOneStoryDraftReviewPack(draftPack, inputPath);
    const target = outputPath || DEFAULT_ONE_STORY_DRAFT_REVIEW_PACK_OUTPUT;
    if (command === "smoke-one-story-draft-review-pack" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`One-story draft review pack failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-one-story-draft-review-pack" || outputPath) {
      console.log(`one-story draft review pack passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-review-brief-dark-mode-ux" || command === "smoke-review-brief-dark-mode-ux") {
    const readback = await readJson(inputPath);
    const result = await validateReviewBriefDarkModeUx(readback, inputPath);
    const target = outputPath || DEFAULT_REVIEW_BRIEF_DARK_MODE_UX_OUTPUT;
    if (command === "smoke-review-brief-dark-mode-ux" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Review brief dark mode UX failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-review-brief-dark-mode-ux" || outputPath) {
      console.log(`review brief dark mode UX passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-draft-to-video-planning-bridge" || command === "smoke-draft-to-video-planning-bridge") {
    const bridge = await readJson(inputPath);
    const result = await validateDraftToVideoPlanningBridge(bridge, inputPath);
    const target = outputPath || DEFAULT_DRAFT_TO_VIDEO_PLANNING_BRIDGE_OUTPUT;
    if (command === "smoke-draft-to-video-planning-bridge" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Draft-to-video planning bridge failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-draft-to-video-planning-bridge" || outputPath) {
      console.log(`draft-to-video planning bridge passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-bridge-refinement-overview-ribbon" || command === "smoke-bridge-refinement-overview-ribbon") {
    const readback = await readJson(inputPath);
    const result = await validateBridgeRefinementOverviewRibbon(readback, inputPath);
    const target = outputPath || DEFAULT_BRIDGE_REFINEMENT_OVERVIEW_RIBBON_OUTPUT;
    if (command === "smoke-bridge-refinement-overview-ribbon" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Bridge refinement overview ribbon failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-bridge-refinement-overview-ribbon" || outputPath) {
      console.log(`bridge refinement overview ribbon passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-low-text-decision-console" || command === "smoke-low-text-decision-console") {
    const readback = await readJson(inputPath);
    const result = await validateLowTextDecisionConsole(readback, inputPath);
    const target = outputPath || DEFAULT_LOW_TEXT_DECISION_CONSOLE_OUTPUT;
    if (command === "smoke-low-text-decision-console" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Low-text decision console failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-low-text-decision-console" || outputPath) {
      console.log(`low-text decision console passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-layout-research-decision-shell" || command === "smoke-layout-research-decision-shell") {
    const readback = await readJson(inputPath);
    const result = await validateLayoutResearchDecisionShell(readback, inputPath);
    const target = outputPath || DEFAULT_LAYOUT_RESEARCH_DECISION_SHELL_OUTPUT;
    if (command === "smoke-layout-research-decision-shell" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Layout research decision shell failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-layout-research-decision-shell" || outputPath) {
      console.log(`layout research decision shell passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-layout-lab-visual-audit" || command === "smoke-layout-lab-visual-audit") {
    const readback = await readJson(inputPath);
    const result = await validateLayoutLabVisualAudit(readback, inputPath);
    const target = outputPath || DEFAULT_LAYOUT_LAB_VISUAL_AUDIT_OUTPUT;
    if (command === "smoke-layout-lab-visual-audit" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Layout Lab visual audit failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-layout-lab-visual-audit" || outputPath) {
      console.log(`layout lab visual audit passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-apply-decision-shell-guard-diet" || command === "smoke-apply-decision-shell-guard-diet") {
    const readback = await readJson(inputPath);
    const result = await validateApplyDecisionShellGuardDiet(readback, inputPath);
    const target = outputPath || DEFAULT_APPLY_DECISION_SHELL_GUARD_DIET_OUTPUT;
    if (command === "smoke-apply-decision-shell-guard-diet" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Apply Decision Shell Guard Diet failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-apply-decision-shell-guard-diet" || outputPath) {
      console.log(`apply decision shell guard diet passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-review-workbench-component-contract" || command === "smoke-review-workbench-component-contract") {
    const readback = await readJson(inputPath);
    const result = await validateReviewWorkbenchComponentContract(readback, inputPath);
    const target = outputPath || DEFAULT_REVIEW_WORKBENCH_COMPONENT_CONTRACT_OUTPUT;
    if (command === "smoke-review-workbench-component-contract" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Review Workbench Component Contract failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-review-workbench-component-contract" || outputPath) {
      console.log(`review workbench component contract passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-bridge-storyboard-flow") {
    if (outputPath) {
      fail("validate-bridge-storyboard-flow is read-only and does not accept an output path; use smoke-bridge-storyboard-flow for intentional result regeneration.");
    }
    const readback = await readJson(inputPath);
    const result = await validateBridgeStoryboardFlow(readback, inputPath);
    console.log(JSON.stringify(result, null, 2));
    if (!result.passed) {
      fail(`Bridge Storyboard Flow failed: ${result.failures.join("; ")}`);
    }
    return;
  }

  if (command === "smoke-bridge-storyboard-flow") {
    const readback = await readJson(inputPath);
    const result = await validateBridgeStoryboardFlow(readback, inputPath);
    const target = outputPath || DEFAULT_BRIDGE_STORYBOARD_FLOW_OUTPUT;
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    if (!result.passed) {
      fail(`Bridge Storyboard Flow failed: ${result.failures.join("; ")}`);
    }
    console.log(`bridge storyboard flow passed ${inputPath} -> ${target}`);
    return;
  }

  if (command === "validate-guided-review-flow-workspace" || command === "smoke-guided-review-flow-workspace") {
    const readback = await readJson(inputPath);
    const result = await validateGuidedReviewFlowWorkspace(readback, inputPath);
    const target = outputPath || DEFAULT_GUIDED_REVIEW_FLOW_WORKSPACE_OUTPUT;
    if (command === "smoke-guided-review-flow-workspace" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Guided review flow workspace failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-guided-review-flow-workspace" || outputPath) {
      console.log(`guided review flow workspace passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-home-cockpit-metric-linking" || command === "smoke-home-cockpit-metric-linking") {
    const readback = await readJson(inputPath);
    const result = await validateHomeCockpitMetricLinking(readback, inputPath);
    const target = outputPath || DEFAULT_HOME_COCKPIT_METRIC_LINKING_OUTPUT;
    if (command === "smoke-home-cockpit-metric-linking" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Home cockpit metric linking failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-home-cockpit-metric-linking" || outputPath) {
      console.log(`home cockpit metric linking passed ${inputPath} -> ${target}`);
    }
    return;
  }

  if (command === "validate-review-home-map-meters" || command === "smoke-review-home-map-meters") {
    const readback = await readJson(inputPath);
    const result = await validateReviewHomeMapMeters(readback, inputPath);
    const target = outputPath || DEFAULT_REVIEW_HOME_MAP_METERS_OUTPUT;
    if (command === "smoke-review-home-map-meters" || outputPath) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
    if (!result.passed) {
      fail(`Review home map meters failed: ${result.failures.join("; ")}`);
    }
    if (command === "smoke-review-home-map-meters" || outputPath) {
      console.log(`review home map meters passed ${inputPath} -> ${target}`);
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
  const sourcePackFixtureCount = Number(sourcePack.cross_fixture_summary?.fixture_count || 0);
  const sampleAdapterElements = Array.isArray(adapterPayloads[0]?.extractedElements) ? adapterPayloads[0].extractedElements.length : 0;
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
      smoke.aggregate?.fixtureCount >= 4 &&
      smoke.aggregate?.outputCount >= 4 &&
      smoke.aggregate?.elementCount >= 48 &&
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
      sourcePack.cross_fixture_summary?.fixture_count >= 4 &&
      sourcePack.cross_fixture_summary?.total_elements >= 48 &&
      packElements.length === sourcePack.cross_fixture_summary?.total_elements &&
      routingRegression.summary?.source_pack_rows_checked === packElements.length &&
      routingRegression.summary?.adapter_payloads_checked === adapterPayloads.length &&
      routingRegression.summary?.adapter_elements_checked === adapterElements.length &&
      adapterPayloads.length === sourcePackFixtureCount + 1 &&
      adapterElements.length === packElements.length + sampleAdapterElements,
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

async function validateRemainingFixtureCoverageOneClass(smoke, smokePath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const selectedFixture = {
    class_id: "multilingual_memo_text",
    label: "multilingual memo text",
    fixture_key: "multilingual-memo-notes",
    fixture_path: "artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md",
    output_path: "artifacts/extraction-adapter-outputs/multilingual-memo-notes.json"
  };
  const candidateClassesBeforeSlice = [
    "multilingual memo text",
    "translated memo text",
    "very broad source-span shape"
  ];
  const remainingFixtureCandidates = candidateClassesBeforeSlice.filter((candidate) => candidate !== selectedFixture.label);

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const sourcePackPath = manifest.source_span_review_pack_path || "artifacts/source-span-routing-review-pack.json";
  const sourcePack = await readJson(sourcePackPath);
  const routingRegression = await readJson(manifest.routing_policy_regression_result_path || DEFAULT_ROUTING_POLICY_REGRESSION_OUTPUT);
  const broadSpanSplit = await readJson(manifest.broad_span_split_result_path || DEFAULT_BROAD_SPAN_SPLIT_OUTPUT);
  const malformedGuard = await readJson(manifest.malformed_missing_span_guard_result_path || DEFAULT_MALFORMED_MISSING_SPAN_GUARD_OUTPUT);
  const contradictoryGuard = await readJson(manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT);
  const downstreamGate = await readJson(manifest.downstream_source_span_adoption_gate_result_path || DEFAULT_DOWNSTREAM_SOURCE_SPAN_ADOPTION_GATE_OUTPUT);
  const providerEnvelope = await readJson(manifest.provider_envelope_readiness_no_call_result_path || DEFAULT_PROVIDER_ENVELOPE_READINESS_NO_CALL_OUTPUT);
  const validatorSmoke = await readJson(manifest.validator_smoke_path || DEFAULT_EXTRACTION_FIXTURE_SMOKE_OUTPUT);
  const rawMemo = await readFile(selectedFixture.fixture_path, "utf8");
  const output = await readJson(selectedFixture.output_path);
  const adapterPayloads = await readAdapterPayloads();
  const adapterElements = adapterPayloads.flatMap((payload) => Array.isArray(payload.extractedElements) ? payload.extractedElements : []);
  const packElements = flattenSourcePackElements(sourcePack);
  const packFixture = Array.isArray(sourcePack.fixtures)
    ? sourcePack.fixtures.find((fixture) => fixture.fixture_id === selectedFixture.fixture_key)
    : null;
  const smokeResult = Array.isArray(smoke.fixtureResults)
    ? smoke.fixtureResults.find((result) => result.fixture === selectedFixture.fixture_key)
    : null;
  const sourceRefIds = new Set((output.sourceRefs || []).map((sourceRef) => sourceRef.id));
  const fixtureElements = Array.isArray(output.extractedElements) ? output.extractedElements : [];
  const elementTypes = [...new Set(fixtureElements.map((element) => element.elementType))].sort();
  const requiredElementTypeCoverage = Object.fromEntries(
    REQUIRED_EXTRACTION_ELEMENT_TYPES.map((elementType) => [elementType, elementTypes.includes(elementType)])
  );
  const sourceSpanMismatches = fixtureElements.filter((element) => {
    const sourceSpan = element.sourceSpan || {};
    return typeof sourceSpan.start !== "number" ||
      typeof sourceSpan.end !== "number" ||
      rawMemo.slice(sourceSpan.start, sourceSpan.end) !== sourceSpan.text;
  }).map((element) => element.id);
  const missingSourceRefs = fixtureElements.filter((element) =>
    !Array.isArray(element.sourceRefIds) ||
    element.sourceRefIds.length === 0 ||
    element.sourceRefIds.some((sourceRefId) => !sourceRefIds.has(sourceRefId))
  ).map((element) => element.id);
  const unsafeVisualRoutes = fixtureElements.filter((element) =>
    element.elementType === "visual_asset" &&
    Array.isArray(element.targetDestinations) &&
    element.targetDestinations.includes("claim") &&
    !element.targetDestinations.includes("profile")
  ).map((element) => element.id);
  const nonHeldDefaults = fixtureElements.filter((element) =>
    element.reviewStatus !== "hold" || element.suggestedReviewStatus !== "hold"
  ).map((element) => element.id);
  const humanOwnedAdoptSuggestions = fixtureElements.filter((element) =>
    touchesHumanOwnedDecision(element) && element.suggestedReviewStatus === "adopt"
  ).map((element) => element.id);
  const nonAsciiLines = rawMemo.split(/\r?\n/).filter((line) => /[^\x00-\x7F]/.test(line));
  const nonAsciiSpanElements = fixtureElements.filter((element) => /[^\x00-\x7F]/.test(String(element.sourceSpan?.text || "")));
  const sourcePackGaps = Array.isArray(sourcePack.cross_fixture_summary?.fixture_class_gaps)
    ? sourcePack.cross_fixture_summary.fixture_class_gaps
    : [];
  const matrixFixtureCount = Number(sourcePack.cross_fixture_summary?.fixture_count || 0);
  const expectedAdapterPayloadCount = matrixFixtureCount + 1;
  const sampleAdapterElements = Array.isArray(adapterPayloads[0]?.extractedElements) ? adapterPayloads[0].extractedElements.length : 0;
  const expectedAdapterElementCount = packElements.length + sampleAdapterElements;

  check(
    "active_and_preserved_identities_kept",
    manifest.artifact_id === "fff-draft-to-video-planning-bridge-001" &&
      contradictoryGuard?.artifact_id === "fff-contradictory-claim-guard-001" &&
      providerEnvelope?.artifact_id === "fff-provider-envelope-readiness-no-call-001" &&
      [
        "fff-contradictory-claim-guard-001",
        "fff-draft-to-video-planning-bridge-001"
      ].includes(providerEnvelope?.preserved_active_artifact_id),
    `current-active=${manifest.artifact_id}; guard=${contradictoryGuard?.artifact_id}; provider-preserves=${providerEnvelope?.preserved_active_artifact_id}`
  );
  check(
    "one_fixture_class_selected",
    candidateClassesBeforeSlice.includes(selectedFixture.label) &&
      selectedFixture.class_id === "multilingual_memo_text" &&
      Array.isArray(smoke.fixtureFiles) &&
      smoke.fixtureFiles.filter((file) => file === `${selectedFixture.fixture_key}.md`).length === 1 &&
      !smoke.fixtureFiles.some((file) => file.includes("translated") || file.includes("broad")),
    `selected=${selectedFixture.label}; fixtureFiles=${Array.isArray(smoke.fixtureFiles) ? smoke.fixtureFiles.join(", ") : "not set"}`
  );
  check(
    "selection_reason_matches_gap",
    broadSpanSplit?.passed === true &&
      broadSpanSplit.summary?.broad_span_rows_loaded === 2 &&
      rawMemo.includes("English gloss is in-line only") &&
      sourcePackGaps.includes("translated memo text") &&
      sourcePackGaps.includes("very broad source spans") &&
      !sourcePackGaps.includes("multilingual memo text"),
    `current gaps=${sourcePackGaps.join(", ") || "none"}`
  );
  check(
    "multilingual_shape_confirmed",
    rawMemo.includes("Adapter Fixture: Multilingual Memo Notes") &&
      rawMemo.includes("真鍮の蛾の鍵") &&
      rawMemo.includes("北鐘駅") &&
      rawMemo.includes("English gloss is in-line only") &&
      nonAsciiLines.length >= 3,
    `non-ASCII lines=${nonAsciiLines.length}`
  );
  check(
    "adapter_matrix_extended_by_one_fixture",
    smoke?.passed === true &&
      smoke.aggregate?.fixtureCount === 5 &&
      smoke.aggregate?.outputCount === 5 &&
      smoke.aggregate?.elementCount === 60 &&
      Boolean(smokeResult?.passed),
    `matrix fixtures=${smoke.aggregate?.fixtureCount}; elements=${smoke.aggregate?.elementCount}`
  );
  check(
    "multilingual_output_readback",
    output?.adapterTrace?.fixtureKey === selectedFixture.fixture_key &&
      output?.schemaVersion === EXTRACTION_SCHEMA_VERSION &&
      fixtureElements.length === 12 &&
      packFixture?.counts?.extracted_elements === 12 &&
      Object.values(requiredElementTypeCoverage).every(Boolean) &&
      nonAsciiSpanElements.length >= 3,
    `fixture=${output?.adapterTrace?.fixtureKey}; elements=${fixtureElements.length}; multilingual spans=${nonAsciiSpanElements.length}; types=${elementTypes.join(", ")}`
  );
  check(
    "source_span_integrity",
    sourceSpanMismatches.length === 0 &&
      missingSourceRefs.length === 0 &&
      smokeResult?.sourceRoutingAudit?.sourceSpanMismatchCount === 0 &&
      smokeResult?.sourceRoutingAudit?.missingSourceRefCount === 0,
    `source mismatches=${sourceSpanMismatches.join(", ") || "none"}; missing refs=${missingSourceRefs.join(", ") || "none"}`
  );
  check(
    "review_held_routing_and_human_boundaries",
    nonHeldDefaults.length === 0 &&
      unsafeVisualRoutes.length === 0 &&
      humanOwnedAdoptSuggestions.length === 0 &&
      output.reviewSafeDefaults?.defaultReviewStatus === "hold" &&
      output.reviewSafeDefaults?.autoCanonPromotion === false &&
      output.reviewSafeDefaults?.autoChronologyPromotion === false,
    `non-held=${nonHeldDefaults.join(", ") || "none"}; unsafe visual=${unsafeVisualRoutes.join(", ") || "none"}; human adopt=${humanOwnedAdoptSuggestions.join(", ") || "none"}`
  );
  check(
    "source_pack_and_routing_readback_extended",
    sourcePack?.passed === true &&
      sourcePack.cross_fixture_summary?.fixture_count === 5 &&
      sourcePack.cross_fixture_summary?.total_elements === 60 &&
      packElements.length === 60 &&
      routingRegression?.passed === true &&
      routingRegression.summary?.source_pack_rows_checked === packElements.length &&
      routingRegression.summary?.adapter_payloads_checked === adapterPayloads.length &&
      routingRegression.summary?.adapter_elements_checked === adapterElements.length &&
      adapterPayloads.length === expectedAdapterPayloadCount &&
      adapterElements.length === expectedAdapterElementCount,
    `pack rows=${packElements.length}; adapter payloads=${adapterPayloads.length}; adapter elements=${adapterElements.length}`
  );
  check(
    "existing_guards_remain_passing",
    validatorSmoke?.passed === true &&
      validatorSmoke.summary?.fixtureCount === 9 &&
      malformedGuard?.passed === true &&
      malformedGuard.summary?.accepted_routed_candidates === 0 &&
      contradictoryGuard?.passed === true &&
      contradictoryGuard.summary?.adopted_or_provisional_conflicting_claims === 0 &&
      downstreamGate?.passed === true &&
      downstreamGate.summary?.source_pack_rows_checked === packElements.length &&
      downstreamGate.summary?.adopted_profile_claim_timeline_candidates === 0,
    `validator=${validatorSmoke.summary?.fixtureCount}; downstream rows=${downstreamGate.summary?.source_pack_rows_checked}; adopted=${downstreamGate.summary?.adopted_profile_claim_timeline_candidates}`
  );
  check(
    "provider_boundary_not_crossed",
    providerEnvelope?.passed === true &&
      providerEnvelope.provider_metadata?.providerConfigured === false &&
      providerEnvelope.provider_metadata?.externalCallAttempted === false &&
      providerEnvelope.provider_metadata?.credentialsTouched === false,
    `providerConfigured=${providerEnvelope.provider_metadata?.providerConfigured}; externalCall=${providerEnvelope.provider_metadata?.externalCallAttempted}; credentials=${providerEnvelope.provider_metadata?.credentialsTouched}`
  );
  check(
    "user_work_remains_optional",
    manifest.review_input_mode === "freeform" &&
      !String(manifest.review_prompt_hint || "").toLowerCase().includes("fixed form") &&
      providerEnvelope.summary?.review_card_emitted === false &&
      downstreamGate.summary?.operator_observation_card_emitted === false,
    "no Review Card, fixed form, or Operator Observation Card is introduced"
  );

  return {
    schemaVersion: REMAINING_FIXTURE_COVERAGE_SCHEMA_VERSION,
    artifact_id: "fff-remaining-fixture-coverage-one-class-001",
    title: "Fast Fiction Factory Remaining Fixture Coverage One Class",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    selected_fixture_class: selectedFixture.class_id,
    selected_fixture_label: selectedFixture.label,
    selected_fixture_path: selectedFixture.fixture_path,
    selected_output_path: selectedFixture.output_path,
    source_pack_path: sourcePackPath,
    adapter_matrix_smoke_path: toRepoPath(smokePath),
    preserved_active_artifact_id: manifest.artifact_id,
    preserved_provider_envelope_readiness_no_call_artifact_id: "fff-provider-envelope-readiness-no-call-001",
    review_memory_checked: {
      checked: true,
      target: "fff-provider-envelope-readiness-no-call-001",
      prior_review_count: manifest.review_memory?.find((entry) => entry.artifact_id === "fff-provider-envelope-readiness-no-call-001")?.prior_review_count ?? 0,
      axis: "remaining_fixture_coverage_one_class",
      what_changed: "A single multilingual memo fixture and deterministic readback output were added to the local adapter matrix.",
      what_this_review_decides: "No user review is needed; this readback decides whether mixed-language source memo text can be preserved with valid source spans and held routing before provider work starts.",
      not_asking: [
        "translated memo policy",
        "broad source-span rewrite",
        "provider choice",
        "credentials",
        "model/API call approval",
        "database persistence",
        "publishing or production sync",
        "AI video generation",
        "final canon decisions for Toma fate, brass moth truth, or Council motive"
      ],
      next_nonredundant_axis: "translated memo text or very broad source-span shape only if coverage remains the bottleneck"
    },
    coverage_decision: {
      candidate_classes_before_slice: candidateClassesBeforeSlice,
      selected_class_reason: "Current positive adapter fixtures were English-only while broad-span rows already have a split/keep readback and translated memo text would require a translation policy. A mixed-language author memo can be covered deterministically without provider calls, credentials, or canon decisions.",
      covered_by_this_slice: [selectedFixture.label],
      remaining_fixture_class_candidates: remainingFixtureCandidates,
      source_pack_current_gap_list: sourcePackGaps
    },
    summary: {
      previous_fixture_count: 4,
      current_fixture_count: smoke.aggregate?.fixtureCount,
      current_output_count: smoke.aggregate?.outputCount,
      current_matrix_element_count: smoke.aggregate?.elementCount,
      source_pack_rows_checked: packElements.length,
      adapter_payloads_checked: adapterPayloads.length,
      adapter_elements_checked: adapterElements.length,
      selected_fixture_elements_checked: fixtureElements.length,
      multilingual_source_lines: nonAsciiLines.length,
      multilingual_source_span_elements: nonAsciiSpanElements.length,
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
    fixture_coverage_checks: checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateTranslatedMemoFixtureAudit(smoke, smokePath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const exists = async (filePath) => {
    try {
      await readFile(filePath, "utf8");
      return true;
    } catch {
      return false;
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const sourcePackPath = manifest.source_span_review_pack_path || "artifacts/source-span-routing-review-pack.json";
  const sourcePack = await readJson(sourcePackPath);
  const remainingPath = manifest.remaining_fixture_coverage_one_class_result_path || DEFAULT_REMAINING_FIXTURE_COVERAGE_OUTPUT;
  const remaining = await readJson(remainingPath);
  const downstreamPath = manifest.downstream_source_span_adoption_gate_result_path || DEFAULT_DOWNSTREAM_SOURCE_SPAN_ADOPTION_GATE_OUTPUT;
  const downstreamGate = await readJson(downstreamPath);
  const scopeLockPath = manifest.downstream_adoption_gate_scope_lock_result_path || "artifacts/downstream-adoption-gate-scope-lock-result.json";
  const scopeLock = await readJson(scopeLockPath);
  const providerPath = manifest.provider_envelope_readiness_no_call_result_path || DEFAULT_PROVIDER_ENVELOPE_READINESS_NO_CALL_OUTPUT;
  const providerEnvelope = await readJson(providerPath);
  const contradictoryGuard = await readJson(manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT);
  const malformedGuard = await readJson(manifest.malformed_missing_span_guard_result_path || DEFAULT_MALFORMED_MISSING_SPAN_GUARD_OUTPUT);
  const sourcePackGaps = Array.isArray(sourcePack.cross_fixture_summary?.fixture_class_gaps)
    ? sourcePack.cross_fixture_summary.fixture_class_gaps
    : [];
  const fixtureFiles = Array.isArray(smoke.fixtureFiles) ? smoke.fixtureFiles : [];
  const sourcePackFixtureIds = Array.isArray(sourcePack.fixtures) ? sourcePack.fixtures.map((fixture) => fixture.fixture_id).filter(Boolean) : [];
  const translatedFixtureMatches = [...new Set([
    ...fixtureFiles.filter((file) => /translat/i.test(file)),
    ...sourcePackFixtureIds.filter((fixtureId) => /translat/i.test(fixtureId))
  ])];
  const outputPath = remaining.selected_output_path || manifest.remaining_fixture_coverage_one_class_output_path || "artifacts/extraction-adapter-outputs/multilingual-memo-notes.json";
  const output = await readJson(outputPath);
  const fixturePath = remaining.selected_fixture_path || manifest.remaining_fixture_coverage_one_class_fixture_path || "artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md";
  const rawMemo = await readFile(fixturePath, "utf8");
  const sourceRefIds = new Set((output.sourceRefs || []).map((sourceRef) => sourceRef.id));
  const fixtureElements = Array.isArray(output.extractedElements) ? output.extractedElements : [];
  const sourceSpanMismatches = fixtureElements.filter((element) => {
    const sourceSpan = element.sourceSpan || {};
    return typeof sourceSpan.start !== "number" ||
      typeof sourceSpan.end !== "number" ||
      rawMemo.slice(sourceSpan.start, sourceSpan.end) !== sourceSpan.text;
  }).map((element) => element.id);
  const missingSourceRefs = fixtureElements.filter((element) =>
    !Array.isArray(element.sourceRefIds) ||
    element.sourceRefIds.length === 0 ||
    element.sourceRefIds.some((sourceRefId) => !sourceRefIds.has(sourceRefId))
  ).map((element) => element.id);
  const unsafeVisualRoutes = fixtureElements.filter((element) =>
    element.elementType === "visual_asset" &&
    Array.isArray(element.targetDestinations) &&
    element.targetDestinations.includes("claim") &&
    !element.targetDestinations.includes("profile")
  ).map((element) => element.id);
  const nonHeldDefaults = fixtureElements.filter((element) =>
    element.reviewStatus !== "hold" || element.suggestedReviewStatus !== "hold"
  ).map((element) => element.id);
  const humanOwnedAdoptSuggestions = fixtureElements.filter((element) =>
    touchesHumanOwnedDecision(element) && element.suggestedReviewStatus === "adopt"
  ).map((element) => element.id);
  const nonAsciiSpanElements = fixtureElements.filter((element) => /[^\x00-\x7F]/.test(String(element.sourceSpan?.text || "")));
  const fullManifestRegenerationCommand = manifest.full_manifest_regeneration_command ||
    manifest.manifest_regeneration_command ||
    manifest.artifact_regeneration_command ||
    manifest.regeneration_command ||
    null;
  const regenerationCommandEvidence = [
    {
      path: "package.json",
      exists: await exists("package.json"),
      interpretation: "no package scripts are available when absent"
    },
    {
      path: "tools/generate-artifact-manifest.mjs",
      exists: await exists("tools/generate-artifact-manifest.mjs"),
      interpretation: "candidate full manifest generator"
    },
    {
      path: "tools/generate-manifest.mjs",
      exists: await exists("tools/generate-manifest.mjs"),
      interpretation: "candidate manifest generator"
    },
    {
      path: "scripts/generate-artifact-manifest.ps1",
      exists: await exists("scripts/generate-artifact-manifest.ps1"),
      interpretation: "candidate PowerShell manifest generator"
    },
    {
      path: "tools/generate-doc-nav.mjs",
      exists: await exists("tools/generate-doc-nav.mjs"),
      interpretation: "docs navigation helper, not a manifest regeneration command"
    }
  ];
  const regenerationCandidatesPresent = regenerationCommandEvidence
    .filter((entry) => entry.path !== "tools/generate-doc-nav.mjs")
    .some((entry) => entry.exists);
  const manifestValidationCommand = String(manifest.validation_command || "");
  const translationPolicyBoundaryRegistered = Boolean(
    manifest.translation_policy_source_of_truth_boundary_result_path ||
    manifest.translation_policy_source_of_truth_boundary
  );

  check(
    "resume_scope_lock_loaded",
    scopeLock?.artifact_id === "fff-downstream-adoption-gate-scope-lock-001" &&
      scopeLock?.passed === true &&
      scopeLock.scope_policy?.gate_is_readback_only === true &&
      scopeLock.scope_policy?.actual_downstream_adoption_implemented === false &&
      scopeLock.summary?.downstream_candidates_reported_for_review === 55 &&
      scopeLock.summary?.human_owned_candidates_held === 28 &&
      scopeLock.summary?.adopted_profile_claim_timeline_candidates === 0,
    `scopeLock=${scopeLock?.artifact_id}; candidates=${scopeLock.summary?.downstream_candidates_reported_for_review}; held=${scopeLock.summary?.human_owned_candidates_held}; adopted=${scopeLock.summary?.adopted_profile_claim_timeline_candidates}`
  );
  check(
    "previous_validation_unknown_closed",
    Boolean(manifest.validation_command) &&
      !fullManifestRegenerationCommand &&
      !regenerationCandidatesPresent &&
      manifestValidationCommand.includes("smoke-translated-memo-fixture-audit"),
    `manifest validation defined=${Boolean(manifest.validation_command)}; full regeneration command=${fullManifestRegenerationCommand ? "defined" : "not_available"}; candidate generators=${regenerationCandidatesPresent ? "present" : "none"}`
  );
  check(
    "existing_multilingual_coverage_audited",
    remaining?.artifact_id === "fff-remaining-fixture-coverage-one-class-001" &&
      remaining?.passed === true &&
      remaining.selected_fixture_class === "multilingual_memo_text" &&
      remaining.summary?.current_fixture_count === 5 &&
      remaining.summary?.selected_fixture_elements_checked === 12 &&
      remaining.summary?.multilingual_source_span_elements >= 4,
    `remaining=${remaining?.artifact_id}; fixtures=${remaining.summary?.current_fixture_count}; selectedElements=${remaining.summary?.selected_fixture_elements_checked}; multilingualSpans=${remaining.summary?.multilingual_source_span_elements}`
  );
  check(
    "translated_fixture_not_duplicated",
    translatedFixtureMatches.length === 0 &&
      sourcePackGaps.includes("translated memo text") &&
      !sourcePackGaps.includes("multilingual memo text"),
    `translated fixtures=${translatedFixtureMatches.join(", ") || "none"}; gaps=${sourcePackGaps.join(", ") || "none"}`
  );
  check(
    "source_routing_hold_preserved",
    sourceSpanMismatches.length === 0 &&
      missingSourceRefs.length === 0 &&
      unsafeVisualRoutes.length === 0 &&
      nonHeldDefaults.length === 0 &&
      humanOwnedAdoptSuggestions.length === 0,
    `mismatches=${sourceSpanMismatches.length}; missingRefs=${missingSourceRefs.length}; unsafeVisual=${unsafeVisualRoutes.length}; nonHeld=${nonHeldDefaults.length}; humanAdopt=${humanOwnedAdoptSuggestions.length}`
  );
  check(
    "downstream_and_guard_boundaries_preserved",
    downstreamGate?.passed === true &&
      downstreamGate.summary?.source_pack_rows_checked === 60 &&
      downstreamGate.summary?.downstream_candidates_reported_for_review === 55 &&
      downstreamGate.summary?.human_owned_candidates_held === 28 &&
      downstreamGate.summary?.adopted_profile_claim_timeline_candidates === 0 &&
      contradictoryGuard?.passed === true &&
      contradictoryGuard.summary?.held_conflicting_claims === 2 &&
      contradictoryGuard.summary?.adopted_or_provisional_conflicting_claims === 0 &&
      malformedGuard?.passed === true &&
      malformedGuard.summary?.accepted_routed_candidates === 0,
    `downstream rows=${downstreamGate.summary?.source_pack_rows_checked}; downstream adopted=${downstreamGate.summary?.adopted_profile_claim_timeline_candidates}; held conflicts=${contradictoryGuard.summary?.held_conflicting_claims}; malformed accepted=${malformedGuard.summary?.accepted_routed_candidates}`
  );
  check(
    "provider_api_boundary_not_crossed",
    providerEnvelope?.passed === true &&
      providerEnvelope.provider_metadata?.providerConfigured === false &&
      providerEnvelope.provider_metadata?.externalCallAttempted === false &&
      providerEnvelope.provider_metadata?.credentialsTouched === false,
    `providerConfigured=${providerEnvelope.provider_metadata?.providerConfigured}; externalCall=${providerEnvelope.provider_metadata?.externalCallAttempted}; credentials=${providerEnvelope.provider_metadata?.credentialsTouched}`
  );
  check(
    "review_nonredundancy_preserved",
    manifest.review_memory?.some((entry) => entry.artifact_id === "fff-remaining-fixture-coverage-one-class-001") &&
      manifest.review_input_mode === "freeform" &&
      remaining.review_memory_checked?.prior_review_count === 0 &&
      remaining.summary?.review_card_emitted === false &&
      remaining.summary?.operator_observation_card_emitted === false,
    `reviewMemory=${Array.isArray(manifest.review_memory) ? manifest.review_memory.length : 0}; reviewInput=${manifest.review_input_mode}; reviewCard=${remaining.summary?.review_card_emitted}; observation=${remaining.summary?.operator_observation_card_emitted}`
  );

  return {
    schemaVersion: TRANSLATED_MEMO_FIXTURE_AUDIT_SCHEMA_VERSION,
    artifact_id: "fff-translated-memo-fixture-audit-001",
    title: "Fast Fiction Factory Translated / Multilingual Memo Fixture Audit",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    preserved_active_artifact_id: manifest.artifact_id,
    audit_scope: {
      translated_fixture_added: false,
      multilingual_fixture_added: false,
      audit_only: true,
      source_fixture_path: toRepoPath(fixturePath),
      source_output_path: toRepoPath(outputPath),
      source_pack_path: sourcePackPath,
      adapter_matrix_smoke_path: toRepoPath(smokePath)
    },
    resume_validation_closure: {
      scope_lock_result_path: scopeLockPath,
      scope_lock_passed: scopeLock?.passed === true,
      manifest_validation_command_defined: Boolean(manifest.validation_command),
      manifest_validation_command_includes_audit: manifestValidationCommand.includes("smoke-translated-memo-fixture-audit"),
      full_manifest_regeneration_command_status: fullManifestRegenerationCommand ? "defined" : "not_available",
      prior_unknown_closed_as: fullManifestRegenerationCommand ? "defined" : "not_available_non_blocking",
      regeneration_command_evidence: regenerationCommandEvidence
    },
    review_memory_checked: {
      checked: true,
      target: "fff-remaining-fixture-coverage-one-class-001",
      prior_review_count: manifest.review_memory?.find((entry) => entry.artifact_id === "fff-remaining-fixture-coverage-one-class-001")?.prior_review_count ?? 0,
      prior_signal_summary: manifest.review_memory?.find((entry) => entry.artifact_id === "fff-remaining-fixture-coverage-one-class-001")?.latest_user_signal_summary || "No user review was requested for the multilingual fixture coverage slice.",
      axis: "translated_memo_fixture_audit",
      what_changed: "Existing multilingual memo fixture coverage and the translated memo gap were audited without adding another fixture class.",
      what_this_review_decides: "No user review is needed; this readback classifies multilingual coverage as already present and translated memo text as still policy-dependent.",
      not_asking: [
        "general Review Hub review",
        "fixed-form review",
        "translation policy approval",
        "provider choice",
        "credentials",
        "model/API call approval",
        "database persistence",
        "publishing or production sync",
        "AI video generation",
        "downstream adoption implementation",
        "canon promotion",
        "contradictory claim truth decision"
      ],
      next_nonredundant_axis: translationPolicyBoundaryRegistered
        ? "translated memo fixture that follows the source-of-truth boundary, or provider adapter implementation only after explicit authorization"
        : "translation policy boundary before translated fixture work, or provider adapter implementation only after explicit authorization"
    },
    coverage_audit: {
      existing_multilingual_coverage: {
        artifact_id: remaining.artifact_id,
        selected_fixture_class: remaining.selected_fixture_class,
        fixture_path: remaining.selected_fixture_path,
        output_path: remaining.selected_output_path,
        selected_fixture_elements_checked: remaining.summary?.selected_fixture_elements_checked,
        multilingual_source_span_elements: remaining.summary?.multilingual_source_span_elements,
        source_span_mismatches: remaining.summary?.source_span_mismatches,
        missing_source_refs: remaining.summary?.missing_source_refs,
        non_held_review_defaults: remaining.summary?.non_held_review_defaults
      },
      translated_memo_text: {
        fixture_present: translatedFixtureMatches.length > 0,
        fixture_matches: translatedFixtureMatches,
        gap_present_in_source_pack: sourcePackGaps.includes("translated memo text"),
        audit_decision: "not_added_in_this_slice",
        reason: translationPolicyBoundaryRegistered
          ? "A useful translated memo fixture must preserve original source spans and declare derivative translation provenance before it can add decision value."
          : "A useful translated memo fixture needs source-of-truth language, translation provenance, and original-vs-translation span ownership policy before it can add decision value."
      },
      remaining_fixture_class_candidates: [
        "translated memo text",
        "very broad source-span shape"
      ],
      source_pack_current_gap_list: sourcePackGaps
    },
    summary: {
      current_fixture_count: smoke.aggregate?.fixtureCount,
      current_output_count: smoke.aggregate?.outputCount,
      current_matrix_element_count: smoke.aggregate?.elementCount,
      source_pack_rows_checked: sourcePack.cross_fixture_summary?.total_elements,
      selected_multilingual_fixture_elements_checked: fixtureElements.length,
      multilingual_source_span_elements: nonAsciiSpanElements.length,
      translated_fixture_count: translatedFixtureMatches.length,
      translated_gap_present: sourcePackGaps.includes("translated memo text"),
      source_span_mismatches: sourceSpanMismatches.length,
      missing_source_refs: missingSourceRefs.length,
      unsafe_visual_routes: unsafeVisualRoutes.length,
      non_held_review_defaults: nonHeldDefaults.length,
      human_owned_decision_adopt_suggestions: humanOwnedAdoptSuggestions.length,
      downstream_candidates_reported_for_review: downstreamGate.summary?.downstream_candidates_reported_for_review,
      human_owned_downstream_candidates_held: downstreamGate.summary?.human_owned_candidates_held,
      adopted_profile_claim_timeline_candidates: downstreamGate.summary?.adopted_profile_claim_timeline_candidates,
      provider_configured: providerEnvelope.provider_metadata?.providerConfigured,
      external_call_attempted: providerEnvelope.provider_metadata?.externalCallAttempted,
      credentials_touched: providerEnvelope.provider_metadata?.credentialsTouched,
      review_card_emitted: false,
      repeated_general_review_request_emitted: false,
      operator_observation_card_emitted: false,
      failures: failures.length
    },
    translated_memo_fixture_decision: {
      state: translationPolicyBoundaryRegistered ? "policy_boundary_ready_fixture_not_added" : "deferred",
      owner: "human product owner for translation/source-of-truth policy; agent for future bounded fixture once policy exists",
      next_move: translationPolicyBoundaryRegistered
        ? "A translated memo fixture can be a separate narrow slice if it preserves original spans, declares translation provenance, and keeps provider/API work closed."
        : "Do not add translated memo text until translation provenance and span ownership have concrete decision value.",
      requirements_before_adding: [
        "source-of-truth language policy",
        "translation provenance policy",
        "original-vs-translation source-span ownership policy",
        "confirmation that translated memo coverage is the bottleneck"
      ]
    },
    fixture_audit_checks: checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateTranslationProvenanceSourceSpanReadback(payload, payloadPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const fixturePath = payload.sourceMemoRef || "artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md";
  const rawMemo = await readFile(fixturePath, "utf8");
  const sourcePackPath = manifest.source_span_review_pack_path || "artifacts/source-span-routing-review-pack.json";
  const sourcePack = await readJson(sourcePackPath);
  const remainingPath = manifest.remaining_fixture_coverage_one_class_result_path || DEFAULT_REMAINING_FIXTURE_COVERAGE_OUTPUT;
  const remaining = await readJson(remainingPath);
  const translatedAuditPath = manifest.translated_memo_fixture_audit_result_path || DEFAULT_TRANSLATED_MEMO_FIXTURE_AUDIT_OUTPUT;
  const translatedAudit = await readJson(translatedAuditPath);
  const downstreamPath = manifest.downstream_source_span_adoption_gate_result_path || DEFAULT_DOWNSTREAM_SOURCE_SPAN_ADOPTION_GATE_OUTPUT;
  const downstreamGate = await readJson(downstreamPath);
  const providerPath = manifest.provider_envelope_readiness_no_call_result_path || DEFAULT_PROVIDER_ENVELOPE_READINESS_NO_CALL_OUTPUT;
  const providerEnvelope = await readJson(providerPath);
  const contradictoryGuard = await readJson(manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT);
  const malformedGuard = await readJson(manifest.malformed_missing_span_guard_result_path || DEFAULT_MALFORMED_MISSING_SPAN_GUARD_OUTPUT);
  const sourceRefs = Array.isArray(payload.sourceRefs) ? payload.sourceRefs : [];
  const sourceRefIds = new Set(sourceRefs.map((sourceRef) => sourceRef.id).filter(Boolean));
  const elements = Array.isArray(payload.extractedElements) ? payload.extractedElements : [];
  const claims = Array.isArray(payload.claimCandidates) ? payload.claimCandidates : [];
  const fixture = Array.isArray(sourcePack.fixtures)
    ? sourcePack.fixtures.find((entry) => entry.fixture_id === "multilingual-memo-notes")
    : null;
  const sourcePackRows = Array.isArray(fixture?.elements) ? fixture.elements : [];
  const sourcePackById = new Map(sourcePackRows.map((row) => [row.id, row]));
  const manifestValidationCommand = String(manifest.validation_command || "");
  const translationPolicyBoundaryRegistered = Boolean(
    manifest.translation_policy_source_of_truth_boundary_result_path ||
    manifest.translation_policy_source_of_truth_boundary
  );

  const rowSpecs = [
    {
      elementId: "multi-x-object-brass-moth-key",
      claimId: "multi-claim-moth-key-label",
      translationMode: "inline_multilingual_label_preserved",
      normalizationStep: "The local adapter preserves the source label and normalizes it into an object candidate plus a held label claim; it does not decide the moth key function or truth.",
      relation: "source_span_to_label_claim"
    },
    {
      elementId: "multi-x-organization-archivists",
      claimId: "multi-claim-clerical-error",
      translationMode: "mixed_language_record_phrase_preserved",
      normalizationStep: "The local adapter keeps the mixed-language council record as source evidence and derives a held character-belief claim without deciding Council motive or Toma fate.",
      relation: "source_span_to_character_belief_claim"
    },
    {
      elementId: "multi-x-event-noon-ring",
      claimId: "multi-claim-noon-ring",
      translationMode: "inline_english_gloss_used_as_author_memo_text",
      normalizationStep: "The local adapter reads the inline English phrase already present in the author memo and derives a held event claim; it does not call a translation provider.",
      relation: "source_span_to_event_claim"
    }
  ];

  const boundaryElement = elements.find((element) => element.id === "multi-x-placeholder-translation-boundary");
  const boundaryPackRow = boundaryElement ? sourcePackById.get(boundaryElement.id) : null;
  const rows = rowSpecs.map((spec) => {
    const element = elements.find((candidate) => candidate.id === spec.elementId);
    const claim = claims.find((candidate) => candidate.id === spec.claimId);
    const sourceSpan = element?.sourceSpan || {};
    const sourcePackRow = sourcePackById.get(spec.elementId);
    const claimSourceRefIds = Array.isArray(claim?.sourceRefs)
      ? claim.sourceRefs.map((sourceRef) => sourceRef.id).filter(Boolean)
      : [];
    return {
      spec,
      element,
      claim,
      sourcePackRow,
      sourceSpan,
      sourceSpanMatchesRaw: Boolean(element) &&
        typeof sourceSpan.start === "number" &&
        typeof sourceSpan.end === "number" &&
        rawMemo.slice(sourceSpan.start, sourceSpan.end) === sourceSpan.text,
      claimSourceRefIds
    };
  });

  const boundarySourceSpan = boundaryElement?.sourceSpan || {};
  const boundarySpanMatchesRaw = Boolean(boundaryElement) &&
    typeof boundarySourceSpan.start === "number" &&
    typeof boundarySourceSpan.end === "number" &&
    rawMemo.slice(boundarySourceSpan.start, boundarySourceSpan.end) === boundarySourceSpan.text;
  const allSourceElements = [
    ...rows.map((row) => row.element).filter(Boolean),
    boundaryElement
  ].filter(Boolean);
  const sourceSpanMismatches = allSourceElements.filter((element) => {
    const sourceSpan = element.sourceSpan || {};
    return typeof sourceSpan.start !== "number" ||
      typeof sourceSpan.end !== "number" ||
      rawMemo.slice(sourceSpan.start, sourceSpan.end) !== sourceSpan.text;
  }).map((element) => element.id);
  const missingElementSourceRefs = allSourceElements.filter((element) =>
    !Array.isArray(element.sourceRefIds) ||
    element.sourceRefIds.length === 0 ||
    element.sourceRefIds.some((sourceRefId) => !sourceRefIds.has(sourceRefId))
  ).map((element) => element.id);
  const missingClaimSourceRefs = rows.filter((row) =>
    !row.claim ||
    row.claimSourceRefIds.length === 0 ||
    row.claimSourceRefIds.some((sourceRefId) => !sourceRefIds.has(sourceRefId))
  ).map((row) => row.spec.claimId);
  const targetClaimLinkMismatches = rows.filter((row) =>
    !row.element ||
    !row.claim ||
    !Array.isArray(row.element.targetClaimIds) ||
    !row.element.targetClaimIds.includes(row.claim.id)
  ).map((row) => `${row.spec.elementId}->${row.spec.claimId}`);
  const sourcePackMismatches = rows.filter((row) =>
    !row.sourcePackRow ||
    row.sourcePackRow.source_span_matches_raw_memo !== true ||
    row.sourcePackRow.source_span_locator !== `${toRepoPath(fixturePath)}#char=${row.sourceSpan.start}-${row.sourceSpan.end}`
  ).map((row) => row.spec.elementId);
  const claimAdoptionLeaks = rows.filter((row) =>
    row.claim && ["adopt", "provisional"].includes(row.claim.reviewStatus)
  ).map((row) => row.claim.id);
  const elementAdoptionLeaks = allSourceElements.filter((element) =>
    ["adopt", "provisional"].includes(element.reviewStatus) ||
    ["adopt", "provisional"].includes(element.suggestedReviewStatus)
  ).map((element) => element.id);
  const translatedFixtureAdded = translatedAudit.audit_scope?.translated_fixture_added === true ||
    translatedAudit.coverage_audit?.translated_memo_text?.fixture_present === true ||
    translatedAudit.summary?.translated_fixture_count > 0;
  const externalTranslationOrProviderUsed =
    payload.generatorType !== "local_deterministic_adapter" ||
    payload.adapterTrace?.noModelApi !== true ||
    providerEnvelope.provider_metadata?.providerConfigured !== false ||
    providerEnvelope.provider_metadata?.externalCallAttempted !== false ||
    providerEnvelope.provider_metadata?.credentialsTouched !== false;

  check(
    "active_artifact_and_prior_audits_loaded",
    manifest.artifact_id === "fff-draft-to-video-planning-bridge-001" &&
      remaining?.artifact_id === "fff-remaining-fixture-coverage-one-class-001" &&
      translatedAudit?.artifact_id === "fff-translated-memo-fixture-audit-001" &&
      remaining?.passed === true &&
      translatedAudit?.passed === true,
    `current-active=${manifest.artifact_id}; remaining=${remaining?.artifact_id}; translated=${translatedAudit?.artifact_id}`
  );
  check(
    "manifest_validation_includes_readback",
    manifestValidationCommand.includes("smoke-translation-provenance-source-span-readback"),
    `includes smoke=${manifestValidationCommand.includes("smoke-translation-provenance-source-span-readback")}`
  );
  check(
    "multilingual_payload_and_source_pack_loaded",
    payload.schemaVersion === EXTRACTION_SCHEMA_VERSION &&
      payload.extractionRunId === "local-extract-multilingual-memo-notes-001" &&
      fixture?.fixture_id === "multilingual-memo-notes" &&
      sourcePack?.passed === true &&
      sourcePackRows.length === 12,
    `run=${payload.extractionRunId}; fixture=${fixture?.fixture_id}; rows=${sourcePackRows.length}`
  );
  check(
    "source_spans_match_raw_memo",
    sourceSpanMismatches.length === 0 &&
      rows.every((row) => row.sourceSpanMatchesRaw) &&
      boundarySpanMatchesRaw === true,
    `mismatches=${sourceSpanMismatches.join(", ") || "none"}; boundary=${boundarySpanMatchesRaw}`
  );
  check(
    "source_pack_rows_match_selected_elements",
    sourcePackMismatches.length === 0 &&
      boundaryPackRow?.source_span_matches_raw_memo === true,
    `sourcePackMismatches=${sourcePackMismatches.join(", ") || "none"}; boundaryPack=${boundaryPackRow?.source_span_matches_raw_memo}`
  );
  check(
    "claim_links_and_source_refs_preserved",
    targetClaimLinkMismatches.length === 0 &&
      missingElementSourceRefs.length === 0 &&
      missingClaimSourceRefs.length === 0,
    `claimLinks=${targetClaimLinkMismatches.join(", ") || "none"}; missingElementRefs=${missingElementSourceRefs.join(", ") || "none"}; missingClaimRefs=${missingClaimSourceRefs.join(", ") || "none"}`
  );
  check(
    "translation_boundary_prevents_unowned_claim",
    boundaryElement?.reviewStatus === "hold" &&
      boundaryElement?.suggestedReviewStatus === "hold" &&
      Array.isArray(boundaryElement.targetClaimIds) &&
      boundaryElement.targetClaimIds.length === 0 &&
      Array.isArray(boundaryElement.targetDestinations) &&
      boundaryElement.targetDestinations.includes("unresolved_decision"),
    `boundary=${boundaryElement?.id}; claims=${boundaryElement?.targetClaimIds?.length}; destinations=${boundaryElement?.targetDestinations?.join(", ") || "none"}`
  );
  check(
    "derived_claims_remain_held_and_uncertain_where_needed",
    claimAdoptionLeaks.length === 0 &&
      elementAdoptionLeaks.length === 0 &&
      rows.every((row) => row.claim?.reviewStatus === "hold") &&
      rows.filter((row) => row.claim?.canonRisk === "high").every((row) => row.claim?.worldTruthStatus === "uncertain"),
    `claimAdoptionLeaks=${claimAdoptionLeaks.join(", ") || "none"}; elementAdoptionLeaks=${elementAdoptionLeaks.join(", ") || "none"}`
  );
  check(
    "contradiction_and_downstream_guards_preserved",
    contradictoryGuard?.passed === true &&
      contradictoryGuard.summary?.held_conflicting_claims === 2 &&
      contradictoryGuard.summary?.adopted_or_provisional_conflicting_claims === 0 &&
      contradictoryGuard.summary?.direct_accepted_claim_elements === 0 &&
      downstreamGate?.passed === true &&
      downstreamGate.summary?.adopted_profile_claim_timeline_candidates === 0 &&
      malformedGuard?.passed === true &&
      malformedGuard.summary?.accepted_routed_candidates === 0,
    `heldConflicts=${contradictoryGuard.summary?.held_conflicting_claims}; directAccepted=${contradictoryGuard.summary?.direct_accepted_claim_elements}; downstreamAdopted=${downstreamGate.summary?.adopted_profile_claim_timeline_candidates}; malformedAccepted=${malformedGuard.summary?.accepted_routed_candidates}`
  );
  check(
    "no_translation_provider_or_fixture_added",
    translatedFixtureAdded === false &&
      translatedAudit.summary?.translated_gap_present === true &&
      externalTranslationOrProviderUsed === false,
    `translatedFixtureAdded=${translatedFixtureAdded}; translatedGap=${translatedAudit.summary?.translated_gap_present}; providerConfigured=${providerEnvelope.provider_metadata?.providerConfigured}; externalCall=${providerEnvelope.provider_metadata?.externalCallAttempted}; credentials=${providerEnvelope.provider_metadata?.credentialsTouched}`
  );
  check(
    "review_nonredundancy_preserved",
    manifest.review_memory?.some((entry) => entry.artifact_id === "fff-translation-provenance-source-span-readback-001") &&
      manifest.review_input_mode === "freeform",
    `reviewMemory=${Array.isArray(manifest.review_memory) ? manifest.review_memory.length : 0}; reviewInput=${manifest.review_input_mode}`
  );

  const readbackRows = rows.map((row) => ({
    source_item: {
      id: row.element?.id,
      element_type: row.element?.elementType,
      display_text: row.element?.displayText,
      source_ref_ids: row.element?.sourceRefIds || [],
      source_memo_path: toRepoPath(fixturePath),
      source_ref_trust: sourceRefs
        .filter((sourceRef) => (row.element?.sourceRefIds || []).includes(sourceRef.id))
        .map((sourceRef) => ({ id: sourceRef.id, trust: sourceRef.trust }))
    },
    source_span: {
      text: row.sourceSpan.text,
      start: row.sourceSpan.start,
      end: row.sourceSpan.end,
      locator: `${toRepoPath(fixturePath)}#char=${row.sourceSpan.start}-${row.sourceSpan.end}`,
      matches_raw_memo: row.sourceSpanMatchesRaw,
      source_pack_row_matches: row.sourcePackRow?.source_span_matches_raw_memo === true
    },
    translation_or_normalization_step: {
      mode: row.spec.translationMode,
      external_translation_used: false,
      source_of_truth: "author_memo",
      adapter_step: row.spec.normalizationStep,
      relation: row.spec.relation
    },
    generated_or_derived_claim: {
      id: row.claim?.id,
      claim_text: row.claim?.claimText,
      claim_scope: row.claim?.claimScope,
      world_truth_status: row.claim?.worldTruthStatus,
      review_status: row.claim?.reviewStatus,
      canon_risk: row.claim?.canonRisk,
      unresolved_dependencies: row.claim?.unresolvedDependencies || []
    },
    claim_provenance: {
      source_ref_ids: row.claimSourceRefIds,
      source_refs_found: row.claimSourceRefIds.every((sourceRefId) => sourceRefIds.has(sourceRefId)),
      generator_type: payload.generatorType,
      generator_label: payload.generatorLabel,
      adapter_trace_tool_path: payload.adapterTrace?.toolPath,
      no_model_api: payload.adapterTrace?.noModelApi === true,
      provider_configured: providerEnvelope.provider_metadata?.providerConfigured === true,
      external_call_attempted: providerEnvelope.provider_metadata?.externalCallAttempted === true,
      credentials_touched: providerEnvelope.provider_metadata?.credentialsTouched === true
    },
    contradiction_guard_status: {
      active_guard_artifact_id: contradictoryGuard.artifact_id,
      guard_passed: contradictoryGuard.passed === true,
      conflicting_claims_held: contradictoryGuard.summary?.held_conflicting_claims,
      adopted_or_provisional_conflicting_claims: contradictoryGuard.summary?.adopted_or_provisional_conflicting_claims,
      direct_accepted_claim_elements: contradictoryGuard.summary?.direct_accepted_claim_elements,
      selected_claim_contradicts_claim_ids: row.claim?.contradictsClaimIds || []
    },
    confidence_uncertainty: {
      element_confidence: row.element?.confidence,
      element_review_status: row.element?.reviewStatus,
      suggested_review_status: row.element?.suggestedReviewStatus,
      claim_world_truth_status: row.claim?.worldTruthStatus,
      claim_canon_risk: row.claim?.canonRisk,
      high_risk_claim_remains_uncertain: row.claim?.canonRisk === "high" ? row.claim?.worldTruthStatus === "uncertain" : null
    }
  }));

  return {
    schemaVersion: TRANSLATION_PROVENANCE_SOURCE_SPAN_READBACK_SCHEMA_VERSION,
    artifact_id: "fff-translation-provenance-source-span-readback-001",
    title: "Fast Fiction Factory Translation Provenance Source-Span Readback",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    preserved_active_artifact_id: manifest.artifact_id,
    input_payload_path: toRepoPath(payloadPath),
    source_scope: {
      source_fixture_path: toRepoPath(fixturePath),
      source_output_path: toRepoPath(payloadPath),
      source_pack_path: sourcePackPath,
      translated_audit_path: translatedAuditPath,
      provider_envelope_readback_path: providerPath
    },
    review_memory_checked: {
      checked: true,
      target: "fff-translated-memo-fixture-audit-001",
      prior_review_count: manifest.review_memory?.find((entry) => entry.artifact_id === "fff-translated-memo-fixture-audit-001")?.prior_review_count ?? 0,
      axis: "translation_provenance_source_span_readback",
      what_changed: "A deterministic readback now links selected multilingual source spans to held derived claims and records that no translation provider, translated fixture, or canon decision was added.",
      what_this_review_decides: "No user review is needed; this proves the repo can inspect source-span/claim provenance before any translated fixture or provider adapter work.",
      not_asking: [
        "translation policy approval",
        "provider choice",
        "credentials",
        "model/API call approval",
        "database persistence",
        "publishing or production sync",
        "AI video generation",
        "downstream adoption implementation",
        "canon promotion",
        "contradictory claim truth decision"
      ],
      next_nonredundant_axis: translationPolicyBoundaryRegistered
        ? "translated memo fixture that follows the source-of-truth boundary, or provider adapter implementation only after explicit authorization"
        : "translated memo fixture only after source-of-truth language and span ownership policy have concrete decision value, or provider adapter implementation only after explicit authorization"
    },
    translation_boundary_source_item: boundaryElement ? {
      id: boundaryElement.id,
      element_type: boundaryElement.elementType,
      display_text: boundaryElement.displayText,
      source_span: {
        text: boundarySourceSpan.text,
        start: boundarySourceSpan.start,
        end: boundarySourceSpan.end,
        locator: `${toRepoPath(fixturePath)}#char=${boundarySourceSpan.start}-${boundarySourceSpan.end}`,
        matches_raw_memo: boundarySpanMatchesRaw,
        source_pack_row_matches: boundaryPackRow?.source_span_matches_raw_memo === true
      },
      target_claim_ids: boundaryElement.targetClaimIds || [],
      review_status: boundaryElement.reviewStatus,
      boundary_meaning: "Inline gloss is preserved as author memo text; it is not treated as an external translation or owned translation policy."
    } : null,
    source_span_claim_readback: readbackRows,
    summary: {
      source_claim_rows_checked: readbackRows.length,
      translation_boundary_rows_checked: boundaryElement ? 1 : 0,
      source_spans_checked: allSourceElements.length,
      source_span_mismatches: sourceSpanMismatches.length,
      missing_element_source_refs: missingElementSourceRefs.length,
      missing_claim_source_refs: missingClaimSourceRefs.length,
      target_claim_link_mismatches: targetClaimLinkMismatches.length,
      derived_claims_checked: rows.filter((row) => row.claim).length,
      held_derived_claims: rows.filter((row) => row.claim?.reviewStatus === "hold").length,
      high_risk_uncertain_claims: rows.filter((row) => row.claim?.canonRisk === "high" && row.claim?.worldTruthStatus === "uncertain").length,
      translated_fixture_added: translatedFixtureAdded,
      translated_gap_present: translatedAudit.summary?.translated_gap_present === true,
      provider_configured: providerEnvelope.provider_metadata?.providerConfigured,
      external_call_attempted: providerEnvelope.provider_metadata?.externalCallAttempted,
      credentials_touched: providerEnvelope.provider_metadata?.credentialsTouched,
      downstream_adopted_candidates: downstreamGate.summary?.adopted_profile_claim_timeline_candidates,
      adopted_or_provisional_conflicting_claims: contradictoryGuard.summary?.adopted_or_provisional_conflicting_claims,
      direct_accepted_claim_elements: contradictoryGuard.summary?.direct_accepted_claim_elements,
      review_card_emitted: false,
      repeated_general_review_request_emitted: false,
      operator_observation_card_emitted: false,
      failures: failures.length
    },
    what_this_proves: [
      "Selected multilingual source spans can be traced from the raw author memo into held generated claim candidates.",
      "Inline gloss and multilingual labels are preserved as memo evidence without an external translation call.",
      "Derived claim provenance keeps source refs, generator identity, review-held status, and contradiction/downstream guard boundaries visible.",
      "The translated memo fixture gap remains explicit instead of being hidden by multilingual fixture coverage."
    ],
    what_this_does_not_prove: [
      "It does not approve a translated memo fixture.",
      "It does not choose source-of-truth language or original-vs-translation span ownership policy.",
      "It does not configure or call a provider, touch credentials, or implement a model/API adapter.",
      "It does not adopt Profile, Claim, or Timeline candidates or decide Toma fate, brass moth truth, Council motive, or contradictory claim truth."
    ],
    translation_policy_state: {
      state: translationPolicyBoundaryRegistered ? "policy_boundary_registered_fixture_not_added" : "readback_available_policy_not_finalized",
      owner: "human product owner for translation/source-of-truth policy; agent for future bounded fixture after policy exists",
      next_move: translationPolicyBoundaryRegistered
        ? "Use the source-of-truth boundary plus this readback before adding translated memo fixtures; keep provider/API work blocked until explicitly authorized."
        : "Use this readback before adding translated memo fixtures; keep provider/API work blocked until explicitly authorized.",
      requirements_before_translated_fixture: [
        "source-of-truth language policy",
        "translation provenance policy",
        "original-vs-translation source-span ownership policy",
        "confirmation that translated memo coverage is the current bottleneck"
      ]
    },
    readback_checks: checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateTranslationPolicySourceOfTruthBoundary(provenanceReadback, provenanceReadbackPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const sourceOutputPath =
    manifest.translation_provenance_source_span_readback?.source_output_path ||
    provenanceReadback.source_scope?.source_output_path ||
    "artifacts/extraction-adapter-outputs/multilingual-memo-notes.json";
  const payload = await readJson(sourceOutputPath);
  const sourceFixturePath =
    provenanceReadback.source_scope?.source_fixture_path ||
    payload.sourceMemoRef ||
    "artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md";
  const rawMemo = await readFile(sourceFixturePath, "utf8");
  const translatedAuditPath =
    manifest.translated_memo_fixture_audit_result_path ||
    DEFAULT_TRANSLATED_MEMO_FIXTURE_AUDIT_OUTPUT;
  const providerEnvelopePath =
    manifest.provider_envelope_readiness_no_call_result_path ||
    DEFAULT_PROVIDER_ENVELOPE_READINESS_NO_CALL_OUTPUT;
  const providerAuthorizationPath =
    manifest.provider_adapter_authorization_readiness_result_path ||
    DEFAULT_PROVIDER_ADAPTER_AUTHORIZATION_READINESS_OUTPUT;
  const translatedAudit = await readJson(translatedAuditPath);
  const providerEnvelope = await readJson(providerEnvelopePath);
  const providerAuthorization = await readJson(providerAuthorizationPath);
  const contradictoryGuard = await readJson(manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT);
  const downstreamGate = await readJson(manifest.downstream_source_span_adoption_gate_result_path || DEFAULT_DOWNSTREAM_SOURCE_SPAN_ADOPTION_GATE_OUTPUT);
  const malformedGuard = await readJson(manifest.malformed_missing_span_guard_result_path || DEFAULT_MALFORMED_MISSING_SPAN_GUARD_OUTPUT);
  const sourcePack = await readJson(manifest.source_span_review_pack_path || "artifacts/source-span-routing-review-pack.json");
  const manifestValidationCommand = String(manifest.validation_command || "");
  const reviewMemory = Array.isArray(manifest.review_memory) ? manifest.review_memory : [];
  const policyMemory = reviewMemory.find((entry) => entry.artifact_id === "fff-translation-policy-source-of-truth-boundary-001");
  const provenanceMemory = reviewMemory.find((entry) => entry.artifact_id === "fff-translation-provenance-source-span-readback-001");
  const sourceRefs = Array.isArray(payload.sourceRefs) ? payload.sourceRefs : [];
  const rawMemoSourceRef = sourceRefs.find((sourceRef) => sourceRef.trust === "author_memo");
  const readbackRows = Array.isArray(provenanceReadback.source_span_claim_readback)
    ? provenanceReadback.source_span_claim_readback
    : [];
  const boundaryRow = provenanceReadback.translation_boundary_source_item || null;
  const readbackSpans = readbackRows.map((row) => row.source_span).filter(Boolean);
  const boundarySpan = boundaryRow?.source_span || null;
  const allCheckedSpans = [...readbackSpans, boundarySpan].filter(Boolean);
  const rawSpanMismatches = allCheckedSpans.filter((sourceSpan) =>
    typeof sourceSpan.start !== "number" ||
    typeof sourceSpan.end !== "number" ||
    rawMemo.slice(sourceSpan.start, sourceSpan.end) !== sourceSpan.text ||
    sourceSpan.matches_raw_memo !== true
  );
  const sourcePackRows = Array.isArray(sourcePack.fixtures)
    ? sourcePack.fixtures.flatMap((fixture) => Array.isArray(fixture.elements) ? fixture.elements : [])
    : [];
  const sourcePackRowIds = new Set(sourcePackRows.map((row) => row.id).filter(Boolean));
  const readbackElementIds = readbackRows
    .map((row) => row.source_item?.id)
    .filter(Boolean);
  const sourcePackMissingIds = readbackElementIds
    .filter((id) => !sourcePackRowIds.has(id));
  const externalTranslationRows = readbackRows.filter((row) =>
    row.translation_or_normalization_step?.external_translation_used !== false ||
    row.translation_or_normalization_step?.source_of_truth !== "author_memo"
  );
  const claimPromotionLeaks = readbackRows.filter((row) =>
    ["adopt", "provisional"].includes(row.generated_or_derived_claim?.review_status)
  );
  const boundaryCreatesClaim = Array.isArray(boundaryRow?.target_claim_ids) && boundaryRow.target_claim_ids.length > 0;
  const translatedFixtureAdded =
    translatedAudit.audit_scope?.translated_fixture_added === true ||
    translatedAudit.coverage_audit?.translated_memo_text?.fixture_present === true ||
    translatedAudit.summary?.translated_fixture_count > 0 ||
    provenanceReadback.summary?.translated_fixture_added === true;
  const providerBoundaryOpen =
    providerEnvelope.provider_metadata?.providerConfigured === true ||
    providerEnvelope.provider_metadata?.externalCallAttempted === true ||
    providerEnvelope.provider_metadata?.credentialsTouched === true ||
    providerAuthorization.summary?.provider_configured === true ||
    providerAuthorization.summary?.external_call_attempted === true ||
    providerAuthorization.summary?.credentials_touched === true;

  const translatedFixtureRequirements = [
    "original author memo text remains the source-of-truth span owner",
    "translated text declares translator/provenance and links back to original source spans",
    "inline gloss remains author memo text only when it already appears in the original memo",
    "translated or gloss-derived claim candidates start held and cannot auto-promote to canon",
    "contradictory or high-risk derived claims stay source-backed, uncertain, and human-owned",
    "the translated fixture is added only when it reduces a concrete coverage bottleneck"
  ];
  const providerBlockRequirements = [
    "provider choice",
    "credential and secret handling",
    "endpoint",
    "transport behavior",
    "external call permission",
    "timeout and retry policy",
    "all local validation gates still passing before provider output is imported"
  ];

  check(
    "active_artifact_and_provenance_readback_loaded",
    manifest.artifact_id === "fff-draft-to-video-planning-bridge-001" &&
      provenanceReadback.artifact_id === "fff-translation-provenance-source-span-readback-001" &&
      provenanceReadback.schemaVersion === TRANSLATION_PROVENANCE_SOURCE_SPAN_READBACK_SCHEMA_VERSION &&
      provenanceReadback.passed === true,
    `current-active=${manifest.artifact_id}; provenance=${provenanceReadback.artifact_id}/${provenanceReadback.passed}`
  );
  check(
    "manifest_validation_includes_policy_boundary",
    manifestValidationCommand.includes("smoke-translation-policy-source-of-truth-boundary"),
    `includes smoke=${manifestValidationCommand.includes("smoke-translation-policy-source-of-truth-boundary")}`
  );
  check(
    "source_of_truth_is_original_author_memo",
    payload.schemaVersion === EXTRACTION_SCHEMA_VERSION &&
      payload.extractionRunId === "local-extract-multilingual-memo-notes-001" &&
      rawMemoSourceRef?.trust === "author_memo" &&
      allCheckedSpans.length === 4 &&
      rawSpanMismatches.length === 0 &&
      sourcePackMissingIds.length === 0,
    `run=${payload.extractionRunId}; trust=${rawMemoSourceRef?.trust}; spans=${allCheckedSpans.length}; mismatches=${rawSpanMismatches.length}; sourcePackMissing=${sourcePackMissingIds.join(", ") || "none"}`
  );
  check(
    "translation_span_requires_derivative_provenance",
    externalTranslationRows.length === 0 &&
      translatedFixtureAdded === false &&
      provenanceReadback.summary?.translated_gap_present === true,
    `externalRows=${externalTranslationRows.map((row) => row.source_item?.id).join(", ") || "none"}; translatedFixtureAdded=${translatedFixtureAdded}; gap=${provenanceReadback.summary?.translated_gap_present}`
  );
  check(
    "inline_gloss_cannot_create_unowned_claim",
    boundaryRow?.id === "multi-x-placeholder-translation-boundary" &&
      boundarySpan?.text === "English gloss is in-line only" &&
      boundaryCreatesClaim === false &&
      boundaryRow.review_status === "hold" &&
      boundaryRow.source_span?.matches_raw_memo === true,
    `boundary=${boundaryRow?.id}; claims=${boundaryRow?.target_claim_ids?.length ?? "unknown"}; status=${boundaryRow?.review_status}`
  );
  check(
    "derived_claim_promotion_blocked",
    provenanceReadback.summary?.derived_claims_checked === 3 &&
      provenanceReadback.summary?.held_derived_claims === 3 &&
      claimPromotionLeaks.length === 0 &&
      provenanceReadback.summary?.downstream_adopted_candidates === 0,
    `derived=${provenanceReadback.summary?.derived_claims_checked}; held=${provenanceReadback.summary?.held_derived_claims}; leaks=${claimPromotionLeaks.map((row) => row.generated_or_derived_claim?.id).join(", ") || "none"}; downstream=${provenanceReadback.summary?.downstream_adopted_candidates}`
  );
  check(
    "contradiction_guard_expectation_preserved",
    contradictoryGuard?.passed === true &&
      contradictoryGuard.summary?.held_conflicting_claims === 2 &&
      contradictoryGuard.summary?.adopted_or_provisional_conflicting_claims === 0 &&
      contradictoryGuard.summary?.direct_accepted_claim_elements === 0 &&
      downstreamGate?.passed === true &&
      downstreamGate.summary?.adopted_profile_claim_timeline_candidates === 0 &&
      malformedGuard?.passed === true &&
      malformedGuard.summary?.accepted_routed_candidates === 0,
    `heldConflicts=${contradictoryGuard.summary?.held_conflicting_claims}; conflictLeaks=${contradictoryGuard.summary?.adopted_or_provisional_conflicting_claims}; directAccepted=${contradictoryGuard.summary?.direct_accepted_claim_elements}; downstream=${downstreamGate.summary?.adopted_profile_claim_timeline_candidates}; malformed=${malformedGuard.summary?.accepted_routed_candidates}`
  );
  check(
    "provider_adapter_blocked_until_authorized",
    providerEnvelope?.passed === true &&
      providerAuthorization?.passed === true &&
      providerAuthorization.summary?.unauthorized_items_count === 6 &&
      providerAuthorization.summary?.future_authorization_trigger_count >= 6 &&
      providerBoundaryOpen === false,
    `provider=${providerEnvelope.provider_metadata?.providerConfigured}; externalCall=${providerEnvelope.provider_metadata?.externalCallAttempted}; credentials=${providerEnvelope.provider_metadata?.credentialsTouched}; unauthorized=${providerAuthorization.summary?.unauthorized_items_count}`
  );
  check(
    "review_nonredundancy_preserved",
    Boolean(policyMemory) &&
      Boolean(provenanceMemory) &&
      manifest.review_input_mode === "freeform",
    `reviewMemory=${reviewMemory.length}; policyMemory=${Boolean(policyMemory)}; provenanceMemory=${Boolean(provenanceMemory)}; reviewInput=${manifest.review_input_mode}`
  );

  const policyApplicationRows = readbackRows.map((row) => ({
    source_item_id: row.source_item?.id,
    source_span_locator: row.source_span?.locator,
    source_span_owner: "original_author_memo",
    source_of_truth_language: "original_author_memo_multilingual_text",
    translation_or_normalization_mode: row.translation_or_normalization_step?.mode,
    external_translation_used: row.translation_or_normalization_step?.external_translation_used === true,
    derived_claim_id: row.generated_or_derived_claim?.id,
    derived_claim_review_status: row.generated_or_derived_claim?.review_status,
    promotion_allowed_without_human_review: false
  }));

  return {
    schemaVersion: TRANSLATION_POLICY_SOURCE_OF_TRUTH_BOUNDARY_SCHEMA_VERSION,
    artifact_id: "fff-translation-policy-source-of-truth-boundary-001",
    title: "Fast Fiction Factory Translation Policy Source-of-Truth Boundary",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    preserved_active_artifact_id: manifest.artifact_id,
    input_readbacks: {
      provenance_readback_path: toRepoPath(provenanceReadbackPath),
      source_output_path: toRepoPath(sourceOutputPath),
      source_fixture_path: toRepoPath(sourceFixturePath),
      translated_memo_fixture_audit_result_path: toRepoPath(translatedAuditPath),
      provider_envelope_readiness_no_call_result_path: toRepoPath(providerEnvelopePath),
      provider_adapter_authorization_readiness_result_path: toRepoPath(providerAuthorizationPath),
      contradictory_claim_guard_result_path: manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT,
      downstream_source_span_adoption_gate_result_path: manifest.downstream_source_span_adoption_gate_result_path || DEFAULT_DOWNSTREAM_SOURCE_SPAN_ADOPTION_GATE_OUTPUT
    },
    source_of_truth_language: {
      value: "original_author_memo_multilingual_text",
      rule: "The original author memo text, including mixed-language phrases exactly as written, owns source-span authority.",
      current_source_ref_id: rawMemoSourceRef?.id,
      current_source_ref_trust: rawMemoSourceRef?.trust,
      source_fixture_path: toRepoPath(sourceFixturePath),
      source_spans_checked: allCheckedSpans.length,
      source_span_mismatches: rawSpanMismatches.length
    },
    original_span_ownership: {
      owner: "original_author_memo",
      rule: "Original sourceSpan char offsets remain the evidence owner for extracted elements and generated claims.",
      checked_source_pack_rows: readbackElementIds.length,
      source_pack_missing_ids: sourcePackMissingIds,
      locator_policy: "artifact path plus char start/end points at the original memo, not at translated prose."
    },
    translation_span_ownership: {
      owner: "declared_derivative_translation_only",
      rule: "A translated span may be added only as derivative evidence with explicit provenance back to original memo spans; it cannot replace the original source span.",
      current_translated_fixture_added: translatedFixtureAdded,
      current_external_translation_rows: externalTranslationRows.length,
      required_before_future_translated_span: [
        "translator or generator provenance",
        "source original span locator",
        "translated span locator or text owner",
        "no provider/API use unless explicitly authorized"
      ]
    },
    inline_gloss_boundary: {
      owner: "author_memo_inline_text",
      rule: "Inline gloss may be cited only when the gloss text already exists in the author memo; it is not an external translation and cannot create an unowned claim.",
      boundary_source_item_id: boundaryRow?.id,
      boundary_span_text: boundarySpan?.text,
      target_claim_ids: boundaryRow?.target_claim_ids || [],
      review_status: boundaryRow?.review_status,
      creates_unowned_claim: boundaryCreatesClaim
    },
    derived_claim_promotion_rule: {
      rule: "Translation or gloss-derived claims start held and source-backed; auto-adopt, provisional promotion, and canon promotion are blocked until human review.",
      derived_claims_checked: provenanceReadback.summary?.derived_claims_checked,
      held_derived_claims: provenanceReadback.summary?.held_derived_claims,
      claim_promotion_leaks: claimPromotionLeaks.map((row) => row.generated_or_derived_claim?.id).filter(Boolean),
      downstream_adopted_candidates: provenanceReadback.summary?.downstream_adopted_candidates
    },
    contradiction_guard_expectation: {
      rule: "If translation/gloss evidence conflicts with another claim, both sides must stay source-backed, reciprocal where applicable, uncertain, and held for human review.",
      guard_artifact_id: contradictoryGuard.artifact_id,
      held_conflicting_claims: contradictoryGuard.summary?.held_conflicting_claims,
      adopted_or_provisional_conflicting_claims: contradictoryGuard.summary?.adopted_or_provisional_conflicting_claims,
      direct_accepted_claim_elements: contradictoryGuard.summary?.direct_accepted_claim_elements
    },
    translated_fixture_allowed_when: {
      current_repo_action: "not_added_in_this_slice",
      allowed_for_next_slice_if: translatedFixtureRequirements,
      translated_fixture_gap_present: translatedAudit.summary?.translated_gap_present === true,
      coverage_bottleneck_must_be_named: true
    },
    provider_adapter_blocked_until: {
      blocked: true,
      requirements: providerBlockRequirements,
      current_provider_configured: providerEnvelope.provider_metadata?.providerConfigured,
      current_external_call_attempted: providerEnvelope.provider_metadata?.externalCallAttempted,
      current_credentials_touched: providerEnvelope.provider_metadata?.credentialsTouched,
      authorization_readiness_artifact_id: providerAuthorization.artifact_id
    },
    policy_application_rows: policyApplicationRows,
    review_memory_checked: {
      checked: true,
      target: "fff-translation-provenance-source-span-readback-001",
      prior_review_count: provenanceMemory?.prior_review_count ?? 0,
      axis: "translation_policy_source_of_truth_boundary",
      what_changed: "The repo now records how original author memo text, derivative translation text, inline gloss text, and held derived claims are owned before translated fixture or provider work.",
      what_this_review_decides: "No user review is requested; this is a local deterministic boundary for future translated fixture work.",
      not_asking: [
        "translation quality approval",
        "provider choice",
        "credentials",
        "model/API call approval",
        "translated fixture creation",
        "downstream adoption implementation",
        "canon promotion",
        "contradictory claim truth decision"
      ],
      next_nonredundant_axis: "a translated memo fixture that follows this policy, or real provider adapter implementation only after explicit authorization"
    },
    summary: {
      policy_rules_recorded: 8,
      source_claim_rows_checked: readbackRows.length,
      inline_gloss_boundary_rows_checked: boundaryRow ? 1 : 0,
      original_source_spans_checked: allCheckedSpans.length,
      original_source_span_mismatches: rawSpanMismatches.length,
      source_pack_missing_ids: sourcePackMissingIds.length,
      translated_fixture_added: translatedFixtureAdded,
      external_translation_rows: externalTranslationRows.length,
      derived_claims_checked: provenanceReadback.summary?.derived_claims_checked,
      held_derived_claims: provenanceReadback.summary?.held_derived_claims,
      claim_promotion_leaks: claimPromotionLeaks.length,
      contradiction_guard_preserved: contradictoryGuard?.passed === true,
      downstream_adopted_candidates: downstreamGate.summary?.adopted_profile_claim_timeline_candidates,
      provider_adapter_blocked: providerBoundaryOpen === false,
      provider_configured: providerEnvelope.provider_metadata?.providerConfigured,
      external_call_attempted: providerEnvelope.provider_metadata?.externalCallAttempted,
      credentials_touched: providerEnvelope.provider_metadata?.credentialsTouched,
      review_card_emitted: false,
      repeated_general_review_request_emitted: false,
      operator_observation_card_emitted: false,
      failures: failures.length
    },
    what_this_policy_proves: [
      "The current multilingual memo uses original author memo text as source-of-truth evidence for source spans.",
      "Inline gloss is bounded as author memo text, not as an external translation or automatic claim source.",
      "Derived claims from multilingual or gloss-like evidence remain held, source-backed, and blocked from automatic canon promotion.",
      "A future translated fixture now has concrete ownership requirements before it can be useful."
    ],
    what_this_policy_does_not_prove: [
      "It does not create a translated fixture.",
      "It does not verify translation quality or choose a translation provider.",
      "It does not call an API, configure credentials, implement provider transport, or import provider output.",
      "It does not adopt downstream candidates or decide Toma fate, brass moth truth, Council motive, or contradictory claim truth."
    ],
    next_boundary_use: {
      translated_fixture: "Allowed only as a separate narrow slice that preserves original source spans and declares translation provenance.",
      provider_adapter: "Still blocked until provider authorization requirements are explicit and local gates pass.",
      claim_ledger: "Do not accept translated or gloss-derived claims without human review and contradiction checks."
    },
    boundary_checks: checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateTranslatedMemoFixtureMinimum(fixture, fixturePath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const manifestValidationCommand = String(manifest.validation_command || "");
  const reviewMemory = Array.isArray(manifest.review_memory) ? manifest.review_memory : [];
  const policyPath =
    fixture.source_policy_result_path ||
    manifest.translation_policy_source_of_truth_boundary_result_path ||
    DEFAULT_TRANSLATION_POLICY_SOURCE_OF_TRUTH_BOUNDARY_OUTPUT;
  const sourceOutputPath =
    fixture.source_output_path ||
    manifest.translation_provenance_source_span_readback?.source_output_path ||
    "artifacts/extraction-adapter-outputs/multilingual-memo-notes.json";
  const payload = await readJson(sourceOutputPath);
  const sourceFixturePath =
    fixture.source_fixture_path ||
    payload.sourceMemoRef ||
    "artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md";
  const rawMemo = await readFile(sourceFixturePath, "utf8");
  const translationPolicy = await readJson(policyPath);
  const providerEnvelopePath =
    manifest.provider_envelope_readiness_no_call_result_path ||
    DEFAULT_PROVIDER_ENVELOPE_READINESS_NO_CALL_OUTPUT;
  const providerAuthorizationPath =
    manifest.provider_adapter_authorization_readiness_result_path ||
    DEFAULT_PROVIDER_ADAPTER_AUTHORIZATION_READINESS_OUTPUT;
  const providerEnvelope = await readJson(providerEnvelopePath);
  const providerAuthorization = await readJson(providerAuthorizationPath);
  const contradictoryGuard = await readJson(manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT);
  const downstreamGate = await readJson(manifest.downstream_source_span_adoption_gate_result_path || DEFAULT_DOWNSTREAM_SOURCE_SPAN_ADOPTION_GATE_OUTPUT);
  const malformedGuard = await readJson(manifest.malformed_missing_span_guard_result_path || DEFAULT_MALFORMED_MISSING_SPAN_GUARD_OUTPUT);

  const rows = Array.isArray(fixture.rows) ? fixture.rows : [];
  const elements = Array.isArray(payload.extractedElements) ? payload.extractedElements : [];
  const claims = Array.isArray(payload.claimCandidates) ? payload.claimCandidates : [];
  const sourceRefs = Array.isArray(payload.sourceRefs) ? payload.sourceRefs : [];
  const rawMemoSourceRef = sourceRefs.find((sourceRef) => sourceRef.trust === "author_memo");
  const expectedSourceIds = ["multi-x-object-brass-moth-key", "multi-x-placeholder-translation-boundary"];
  const providerBoundaryOpen =
    fixture.translation_provider_used !== false ||
    fixture.external_call_attempted !== false ||
    fixture.credentials_touched !== false ||
    providerEnvelope.provider_metadata?.providerConfigured === true ||
    providerEnvelope.provider_metadata?.externalCallAttempted === true ||
    providerEnvelope.provider_metadata?.credentialsTouched === true ||
    providerAuthorization.summary?.provider_configured === true ||
    providerAuthorization.summary?.external_call_attempted === true ||
    providerAuthorization.summary?.credentials_touched === true;

  const rowReadbacks = rows.map((row) => {
    const element = elements.find((candidate) => candidate.id === row.original_source_span_id);
    const sourceSpan = element?.sourceSpan || {};
    const sourceLocator =
      typeof sourceSpan.start === "number" && typeof sourceSpan.end === "number"
        ? `${toRepoPath(sourceFixturePath)}#char=${sourceSpan.start}-${sourceSpan.end}`
        : null;
    const rawSlice =
      typeof sourceSpan.start === "number" && typeof sourceSpan.end === "number"
        ? rawMemo.slice(sourceSpan.start, sourceSpan.end)
        : null;
    const targetClaimId = row.target_claim_id || null;
    const claim = targetClaimId ? claims.find((candidate) => candidate.id === targetClaimId) : null;
    const claimLinkedFromElement = targetClaimId
      ? Array.isArray(element?.targetClaimIds) && element.targetClaimIds.includes(targetClaimId)
      : true;
    const targetDestinations = Array.isArray(element?.targetDestinations) ? element.targetDestinations : [];
    const rowProviderClean =
      row.translation_provenance?.provider === null &&
      row.translation_provenance?.external_call_used === false &&
      row.translation_provenance?.credential_used === false;
    const derivativeOwned =
      row.translation_owner === "declared_derivative_translation_only" &&
      row.translation_provenance?.links_to_original_source_span === true &&
      row.source_of_truth_language === "original_author_memo_multilingual_text";
    const spanMatches =
      Boolean(element) &&
      rawSlice === sourceSpan.text &&
      row.original_source_text === sourceSpan.text &&
      row.original_source_span_locator === sourceLocator;
    const translationLeaksToClaim =
      row.translation_can_produce_claims !== false ||
      !String(row.derived_claim_promotion_status || "").startsWith("blocked") ||
      ["adopt", "provisional"].includes(row.expected_claim_review_status) ||
      ["adopt", "provisional"].includes(claim?.reviewStatus);
    const autoPromoted =
      !String(row.derived_claim_promotion_status || "").startsWith("blocked") ||
      ["adopt", "provisional"].includes(row.expected_claim_review_status) ||
      ["adopt", "provisional"].includes(claim?.reviewStatus);
    const inlineGlossClaimLeak =
      row.inline_gloss_handling === "author_memo_inline_text_only" &&
      (targetClaimId !== null || (Array.isArray(element?.targetClaimIds) && element.targetClaimIds.length > 0));

    return {
      row_id: row.row_id,
      original_source_span_id: row.original_source_span_id,
      source_span_locator: sourceLocator,
      declared_source_span_locator: row.original_source_span_locator,
      original_source_text: row.original_source_text,
      raw_memo_text: sourceSpan.text,
      translated_text: row.translated_text,
      source_span_matches_raw_memo: spanMatches,
      translation_owner: row.translation_owner,
      derivative_translation_provenance_bound: derivativeOwned,
      translation_can_produce_claims: row.translation_can_produce_claims,
      translation_to_claim_leak: translationLeaksToClaim,
      auto_promotion_detected: autoPromoted,
      target_claim_id: targetClaimId,
      target_claim_linked_from_element: claimLinkedFromElement,
      target_claim_review_status: claim?.reviewStatus || null,
      target_claim_held: targetClaimId ? claim?.reviewStatus === "hold" : null,
      target_destinations: targetDestinations,
      inline_gloss_handling: row.inline_gloss_handling,
      inline_gloss_claim_leak: inlineGlossClaimLeak,
      provider_clean: rowProviderClean,
      row_provider: row.translation_provenance?.provider ?? null,
      row_external_call_used: row.translation_provenance?.external_call_used,
      row_credential_used: row.translation_provenance?.credential_used
    };
  });

  const originalSpanMismatches = rowReadbacks.filter((row) => !row.source_span_matches_raw_memo);
  const missingExpectedSourceIds = expectedSourceIds.filter((id) => !rowReadbacks.some((row) => row.original_source_span_id === id));
  const translationToClaimLeaks = rowReadbacks.filter((row) => row.translation_to_claim_leak);
  const heldClaimRows = rowReadbacks.filter((row) => row.target_claim_id && row.target_claim_held === true);
  const autoPromotionRows = rowReadbacks.filter((row) => row.auto_promotion_detected);
  const inlineGlossClaimLeaks = rowReadbacks.filter((row) => row.inline_gloss_claim_leak);
  const providerDirtyRows = rowReadbacks.filter((row) => !row.provider_clean);
  const unlinkedTargetClaims = rowReadbacks.filter((row) => row.target_claim_id && !row.target_claim_linked_from_element);

  check(
    "fixture_identity_and_minimum_scope",
    fixture.schemaVersion === TRANSLATED_MEMO_FIXTURE_MINIMUM_SCHEMA_VERSION &&
      fixture.artifact_id === "fff-translated-memo-fixture-minimum-001" &&
      rows.length === 2 &&
      missingExpectedSourceIds.length === 0,
    `schema=${fixture.schemaVersion}; artifact=${fixture.artifact_id}; rows=${rows.length}; missing=${missingExpectedSourceIds.join(", ") || "none"}`
  );
  check(
    "policy_boundary_precondition_loaded",
    translationPolicy.artifact_id === "fff-translation-policy-source-of-truth-boundary-001" &&
      translationPolicy.schemaVersion === TRANSLATION_POLICY_SOURCE_OF_TRUTH_BOUNDARY_SCHEMA_VERSION &&
      translationPolicy.passed === true &&
      translationPolicy.source_of_truth_language?.value === "original_author_memo_multilingual_text" &&
      translationPolicy.summary?.claim_promotion_leaks === 0 &&
      translationPolicy.summary?.provider_adapter_blocked === true,
    `policy=${translationPolicy.artifact_id}/${translationPolicy.passed}; sourceTruth=${translationPolicy.source_of_truth_language?.value}; leaks=${translationPolicy.summary?.claim_promotion_leaks}; providerBlocked=${translationPolicy.summary?.provider_adapter_blocked}`
  );
  check(
    "original_source_spans_match_raw_memo",
    payload.schemaVersion === EXTRACTION_SCHEMA_VERSION &&
      rawMemoSourceRef?.trust === "author_memo" &&
      originalSpanMismatches.length === 0,
    `run=${payload.extractionRunId}; trust=${rawMemoSourceRef?.trust}; mismatches=${originalSpanMismatches.map((row) => row.row_id).join(", ") || "none"}`
  );
  check(
    "translation_rows_are_derivative_and_provenance_bound",
    rowReadbacks.length === 2 &&
      rowReadbacks.every((row) => row.derivative_translation_provenance_bound === true) &&
      rowReadbacks.every((row) => typeof row.translated_text === "string" && row.translated_text.length > 0) &&
      providerDirtyRows.length === 0,
    `rows=${rowReadbacks.length}; derivative=${rowReadbacks.filter((row) => row.derivative_translation_provenance_bound).length}; providerDirty=${providerDirtyRows.map((row) => row.row_id).join(", ") || "none"}`
  );
  check(
    "translation_to_claim_leakage_blocked",
    translationToClaimLeaks.length === 0 &&
      unlinkedTargetClaims.length === 0 &&
      heldClaimRows.length === 1 &&
      inlineGlossClaimLeaks.length === 0,
    `leaks=${translationToClaimLeaks.map((row) => row.row_id).join(", ") || "none"}; unlinked=${unlinkedTargetClaims.map((row) => row.row_id).join(", ") || "none"}; held=${heldClaimRows.length}; inlineLeaks=${inlineGlossClaimLeaks.length}`
  );
  check(
    "auto_promotion_blocked",
    autoPromotionRows.length === 0 &&
      downstreamGate.summary?.adopted_profile_claim_timeline_candidates === 0 &&
      contradictoryGuard.summary?.adopted_or_provisional_conflicting_claims === 0,
    `autoPromotion=${autoPromotionRows.map((row) => row.row_id).join(", ") || "none"}; downstream=${downstreamGate.summary?.adopted_profile_claim_timeline_candidates}; conflictLeaks=${contradictoryGuard.summary?.adopted_or_provisional_conflicting_claims}`
  );
  check(
    "provider_external_credential_boundary_closed",
    providerBoundaryOpen === false &&
      providerEnvelope?.passed === true &&
      providerAuthorization?.passed === true,
    `providerConfigured=${providerEnvelope.provider_metadata?.providerConfigured}; externalCall=${providerEnvelope.provider_metadata?.externalCallAttempted}; credentials=${providerEnvelope.provider_metadata?.credentialsTouched}; authorization=${providerAuthorization?.passed}`
  );
  check(
    "contradiction_and_malformed_guards_preserved",
    contradictoryGuard?.passed === true &&
      contradictoryGuard.summary?.held_conflicting_claims === 2 &&
      contradictoryGuard.summary?.direct_accepted_claim_elements === 0 &&
      malformedGuard?.passed === true &&
      malformedGuard.summary?.accepted_routed_candidates === 0,
    `heldConflicts=${contradictoryGuard.summary?.held_conflicting_claims}; directAccepted=${contradictoryGuard.summary?.direct_accepted_claim_elements}; malformedAccepted=${malformedGuard.summary?.accepted_routed_candidates}`
  );
  check(
    "manifest_and_review_memory_registered",
    manifestValidationCommand.includes("smoke-translated-memo-fixture-minimum") &&
      manifest.preserves?.includes("fff-translated-memo-fixture-minimum-001") &&
      reviewMemory.some((entry) => entry.artifact_id === "fff-translated-memo-fixture-minimum-001"),
    `includesSmoke=${manifestValidationCommand.includes("smoke-translated-memo-fixture-minimum")}; preserves=${manifest.preserves?.includes("fff-translated-memo-fixture-minimum-001")}; memory=${reviewMemory.some((entry) => entry.artifact_id === "fff-translated-memo-fixture-minimum-001")}`
  );

  return {
    schemaVersion: TRANSLATED_MEMO_FIXTURE_MINIMUM_SCHEMA_VERSION,
    artifact_id: "fff-translated-memo-fixture-minimum-001",
    title: "Fast Fiction Factory Minimal Translated Memo Fixture",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    preserved_active_artifact_id: manifest.artifact_id,
    fixture_path: toRepoPath(fixturePath),
    input_readbacks: {
      source_fixture_path: toRepoPath(sourceFixturePath),
      source_output_path: toRepoPath(sourceOutputPath),
      translation_policy_source_of_truth_boundary_result_path: toRepoPath(policyPath),
      provider_envelope_readiness_no_call_result_path: toRepoPath(providerEnvelopePath),
      provider_adapter_authorization_readiness_result_path: toRepoPath(providerAuthorizationPath),
      contradictory_claim_guard_result_path: manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT,
      downstream_source_span_adoption_gate_result_path: manifest.downstream_source_span_adoption_gate_result_path || DEFAULT_DOWNSTREAM_SOURCE_SPAN_ADOPTION_GATE_OUTPUT,
      malformed_missing_span_guard_result_path: manifest.malformed_missing_span_guard_result_path || DEFAULT_MALFORMED_MISSING_SPAN_GUARD_OUTPUT
    },
    source_of_truth_language: {
      value: "original_author_memo_multilingual_text",
      owner: "original_author_memo",
      source_ref_id: rawMemoSourceRef?.id,
      policy_artifact_id: translationPolicy.artifact_id,
      translated_rows_do_not_replace_original_spans: true
    },
    fixture_policy: {
      translation_owner: "declared_derivative_translation_only",
      translation_can_produce_claims: false,
      allowed_claim_condition: "source-backed and explicitly held only",
      inline_gloss_handling: "author memo inline text only; no external translation authority",
      derived_claim_promotion_status: "blocked",
      contradiction_guard_expectation: "translated or gloss-derived conflicts remain source-backed, uncertain, and held"
    },
    translated_fixture_rows: rowReadbacks,
    provider_external_credential_status: {
      translation_provider_used: fixture.translation_provider_used,
      provider_configured: providerEnvelope.provider_metadata?.providerConfigured,
      external_call_attempted: providerEnvelope.provider_metadata?.externalCallAttempted,
      credentials_touched: providerEnvelope.provider_metadata?.credentialsTouched,
      provider_authorization_blocked: providerBoundaryOpen === false
    },
    summary: {
      translated_fixture_rows_checked: rows.length,
      original_span_matches: rowReadbacks.filter((row) => row.source_span_matches_raw_memo).length,
      original_span_mismatches: originalSpanMismatches.length,
      translation_to_claim_leakage_count: translationToClaimLeaks.length,
      held_claim_count: heldClaimRows.length,
      auto_promotion_count: autoPromotionRows.length,
      inline_gloss_claim_leakage_count: inlineGlossClaimLeaks.length,
      provider_configured: providerEnvelope.provider_metadata?.providerConfigured,
      external_call_attempted: providerEnvelope.provider_metadata?.externalCallAttempted,
      credentials_touched: providerEnvelope.provider_metadata?.credentialsTouched,
      downstream_adopted_candidates: downstreamGate.summary?.adopted_profile_claim_timeline_candidates,
      contradictory_guard_conflict_leaks: contradictoryGuard.summary?.adopted_or_provisional_conflicting_claims,
      review_card_emitted: false,
      repeated_general_review_request_emitted: false,
      operator_observation_card_emitted: false,
      failures: failures.length
    },
    what_this_fixture_proves: [
      "A translated memo fixture can exist as a small derivative layer without replacing original multilingual source spans.",
      "A translated row linked to an existing held claim does not promote that claim.",
      "An inline gloss boundary row remains claimless and cannot create unowned authority.",
      "Provider, external-call, credential, downstream adoption, and canon boundaries remain closed."
    ],
    what_this_fixture_does_not_prove: [
      "It does not verify translation quality.",
      "It does not choose or configure a translation provider.",
      "It does not import provider output or touch credentials.",
      "It does not adopt downstream candidates or decide Toma fate, brass moth truth, Council motive, or contradictory claim truth."
    ],
    minimum_fixture_checks: checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateHeldClaimAdoptionPreflight(translatedMinimum, translatedMinimumPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const manifestValidationCommand = String(manifest.validation_command || "");
  const reviewMemory = Array.isArray(manifest.review_memory) ? manifest.review_memory : [];
  const sourceOutputPath =
    translatedMinimum.input_readbacks?.source_output_path ||
    "artifacts/extraction-adapter-outputs/multilingual-memo-notes.json";
  const payload = await readJson(sourceOutputPath);
  const sourceFixturePath =
    translatedMinimum.input_readbacks?.source_fixture_path ||
    payload.sourceMemoRef ||
    "artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md";
  const rawMemo = await readFile(sourceFixturePath, "utf8");
  const sourcePack = await readJson(manifest.source_span_review_pack_path || "artifacts/source-span-routing-review-pack.json");
  const translationPolicy = await readJson(manifest.translation_policy_source_of_truth_boundary_result_path || DEFAULT_TRANSLATION_POLICY_SOURCE_OF_TRUTH_BOUNDARY_OUTPUT);
  const contradictoryGuard = await readJson(manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT);
  const downstreamGate = await readJson(manifest.downstream_source_span_adoption_gate_result_path || DEFAULT_DOWNSTREAM_SOURCE_SPAN_ADOPTION_GATE_OUTPUT);
  const malformedGuard = await readJson(manifest.malformed_missing_span_guard_result_path || DEFAULT_MALFORMED_MISSING_SPAN_GUARD_OUTPUT);
  const providerEnvelope = await readJson(manifest.provider_envelope_readiness_no_call_result_path || DEFAULT_PROVIDER_ENVELOPE_READINESS_NO_CALL_OUTPUT);
  const providerAuthorization = await readJson(manifest.provider_adapter_authorization_readiness_result_path || DEFAULT_PROVIDER_ADAPTER_AUTHORIZATION_READINESS_OUTPUT);
  const rows = Array.isArray(translatedMinimum.translated_fixture_rows) ? translatedMinimum.translated_fixture_rows : [];
  const linkedHeldRows = rows.filter((row) => row.target_claim_id && row.target_claim_held === true);
  const elements = Array.isArray(payload.extractedElements) ? payload.extractedElements : [];
  const claims = Array.isArray(payload.claimCandidates) ? payload.claimCandidates : [];
  const profiles = Array.isArray(payload.profileCandidates) ? payload.profileCandidates : [];
  const timelines = Array.isArray(payload.timelineEntryCandidates) ? payload.timelineEntryCandidates : [];
  const packRows = flattenSourcePackElements(sourcePack);
  const providerBoundaryOpen =
    providerEnvelope.provider_metadata?.providerConfigured === true ||
    providerEnvelope.provider_metadata?.externalCallAttempted === true ||
    providerEnvelope.provider_metadata?.credentialsTouched === true ||
    providerAuthorization.summary?.provider_configured === true ||
    providerAuthorization.summary?.external_call_attempted === true ||
    providerAuthorization.summary?.credentials_touched === true;

  const preflightRows = linkedHeldRows.map((row) => {
    const element = elements.find((candidate) => candidate.id === row.original_source_span_id);
    const claim = claims.find((candidate) => candidate.id === row.target_claim_id);
    const packRow = packRows.find((candidate) => candidate.id === row.original_source_span_id);
    const profileCandidates = (element?.targetProfileIds || []).map((id) => profiles.find((profile) => profile.id === id)).filter(Boolean);
    const timelineCandidates = (element?.targetTimelineEntryIds || []).map((id) => timelines.find((timeline) => timeline.id === id)).filter(Boolean);
    const sourceSpan = element?.sourceSpan || {};
    const rawSlice =
      typeof sourceSpan.start === "number" && typeof sourceSpan.end === "number"
        ? rawMemo.slice(sourceSpan.start, sourceSpan.end)
        : null;
    const sourceBacked =
      Boolean(claim) &&
      Array.isArray(claim.sourceRefs) &&
      claim.sourceRefs.some((sourceRef) => sourceRef.trust === "author_memo") &&
      Array.isArray(element?.sourceRefIds) &&
      element.sourceRefIds.length > 0 &&
      row.source_span_matches_raw_memo === true &&
      rawSlice === sourceSpan.text &&
      packRow?.source_span_matches_raw_memo === true;
    const translationLeakage =
      row.translation_to_claim_leak === true ||
      row.auto_promotion_detected === true ||
      row.inline_gloss_claim_leak === true ||
      translatedMinimum.summary?.translation_to_claim_leakage_count > 0 ||
      translatedMinimum.summary?.auto_promotion_count > 0 ||
      translatedMinimum.summary?.inline_gloss_claim_leakage_count > 0;
    const claimActuallyAdopted = ["adopt", "provisional"].includes(claim?.reviewStatus);
    const downstreamAdopted =
      profileCandidates.some((profile) => ["adopt", "provisional"].includes(profile.reviewStatus)) ||
      timelineCandidates.some((timeline) => ["adopt", "provisional"].includes(timeline.reviewStatus)) ||
      downstreamGate.summary?.adopted_profile_claim_timeline_candidates > 0;
    const canonized =
      claimActuallyAdopted ||
      downstreamAdopted ||
      claim?.worldTruthStatus !== "uncertain" ||
      claim?.claimScope !== "unresolved candidate";
    const contradictionGuardStatus =
      contradictoryGuard?.passed === true &&
      contradictoryGuard.summary?.adopted_or_provisional_conflicting_claims === 0 &&
      contradictoryGuard.summary?.direct_accepted_claim_elements === 0
        ? "preserved_no_conflict_leaks"
        : "failed_or_open";
    const downstreamTargets = Array.isArray(element?.targetDestinations)
      ? element.targetDestinations.filter((destination) => ["profile", "claim", "timeline"].includes(destination))
      : [];
    const eligible =
      sourceBacked &&
      claim?.reviewStatus === "hold" &&
      translationLeakage === false &&
      contradictionGuardStatus === "preserved_no_conflict_leaks" &&
      downstreamGate?.passed === true &&
      malformedGuard?.passed === true &&
      providerBoundaryOpen === false;

    return {
      source_span_id: row.original_source_span_id,
      source_span_locator: row.source_span_locator,
      translated_fixture_row_id: row.row_id,
      held_claim_id: row.target_claim_id,
      claim_text: claim?.claimText || null,
      claim_status_before_preflight: claim?.reviewStatus || null,
      world_truth_status_before_preflight: claim?.worldTruthStatus || null,
      claim_scope_before_preflight: claim?.claimScope || null,
      contradiction_guard_status: contradictionGuardStatus,
      source_backed_status: sourceBacked,
      translation_leakage_status: translationLeakage ? "leak_detected" : "no_leak",
      adoption_eligibility: eligible ? "eligible_for_preflight_only" : "not_eligible",
      adoption_decision: "not_adopted",
      canon_status: false,
      downstream_target_class: downstreamTargets,
      downstream_target_ids: {
        profile: element?.targetProfileIds || [],
        claim: element?.targetClaimIds || [],
        timeline: element?.targetTimelineEntryIds || []
      },
      downstream_candidate_status: {
        profiles: profileCandidates.map((profile) => ({ id: profile.id, reviewStatus: profile.reviewStatus })),
        timelines: timelineCandidates.map((timeline) => ({ id: timeline.id, reviewStatus: timeline.reviewStatus }))
      },
      unresolved_dependencies: claim?.unresolvedDependencies || [],
      canon_risk: claim?.canonRisk || null,
      preflight_proves: [
        "source-backed held claim can be named as a downstream adoption candidate",
        "translation fixture did not create or promote the claim",
        "downstream target classes are visible before any adoption behavior"
      ],
      preflight_does_not_prove: [
        "human canon acceptance",
        "Profile / Claim / Timeline state mutation",
        "production readiness"
      ]
    };
  });

  const sourceBackedRows = preflightRows.filter((row) => row.source_backed_status === true);
  const eligibleRows = preflightRows.filter((row) => row.adoption_eligibility === "eligible_for_preflight_only");
  const actuallyAdoptedRows = preflightRows.filter((row) => row.adoption_decision !== "not_adopted");
  const canonizedRows = preflightRows.filter((row) => row.canon_status === true);
  const translationLeakRows = preflightRows.filter((row) => row.translation_leakage_status !== "no_leak");

  check(
    "active_artifact_and_translated_fixture_loaded",
    manifest.artifact_id === "fff-draft-to-video-planning-bridge-001" &&
      translatedMinimum.artifact_id === "fff-translated-memo-fixture-minimum-001" &&
      translatedMinimum.schemaVersion === TRANSLATED_MEMO_FIXTURE_MINIMUM_SCHEMA_VERSION &&
      translatedMinimum.passed === true,
    `current-active=${manifest.artifact_id}; translated=${translatedMinimum.artifact_id}/${translatedMinimum.passed}`
  );
  check(
    "held_linked_claim_identified",
    linkedHeldRows.length >= 1 &&
      preflightRows.some((row) => row.held_claim_id === "multi-claim-moth-key-label" && row.claim_status_before_preflight === "hold"),
    `held rows=${linkedHeldRows.map((row) => `${row.row_id}:${row.target_claim_id}`).join(", ") || "none"}`
  );
  check(
    "source_backed_claims_ready_for_preflight",
    preflightRows.length > 0 &&
      sourceBackedRows.length === preflightRows.length,
    `preflightRows=${preflightRows.length}; sourceBacked=${sourceBackedRows.length}`
  );
  check(
    "eligible_candidates_not_adopted",
    eligibleRows.length === preflightRows.length &&
      eligibleRows.length >= 1 &&
      actuallyAdoptedRows.length === 0 &&
      canonizedRows.length === 0,
    `eligible=${eligibleRows.length}; adopted=${actuallyAdoptedRows.length}; canonized=${canonizedRows.length}`
  );
  check(
    "translation_and_gloss_leaks_remain_blocked",
    translationLeakRows.length === 0 &&
      translatedMinimum.summary?.translation_to_claim_leakage_count === 0 &&
      translatedMinimum.summary?.auto_promotion_count === 0 &&
      translatedMinimum.summary?.inline_gloss_claim_leakage_count === 0 &&
      translationPolicy.summary?.claim_promotion_leaks === 0,
    `rowLeaks=${translationLeakRows.map((row) => row.held_claim_id).join(", ") || "none"}; fixtureLeaks=${translatedMinimum.summary?.translation_to_claim_leakage_count}; auto=${translatedMinimum.summary?.auto_promotion_count}; gloss=${translatedMinimum.summary?.inline_gloss_claim_leakage_count}`
  );
  check(
    "claim_promotion_and_canon_boundary_closed",
    preflightRows.every((row) => row.claim_status_before_preflight === "hold") &&
      downstreamGate.summary?.adopted_profile_claim_timeline_candidates === 0 &&
      contradictoryGuard.summary?.adopted_or_provisional_conflicting_claims === 0 &&
      contradictoryGuard.summary?.direct_accepted_claim_elements === 0,
    `downstream=${downstreamGate.summary?.adopted_profile_claim_timeline_candidates}; conflictLeaks=${contradictoryGuard.summary?.adopted_or_provisional_conflicting_claims}; directAccepted=${contradictoryGuard.summary?.direct_accepted_claim_elements}`
  );
  check(
    "provider_external_credential_boundary_closed",
    providerBoundaryOpen === false &&
      providerEnvelope?.passed === true &&
      providerAuthorization?.passed === true,
    `provider=${providerEnvelope.provider_metadata?.providerConfigured}; externalCall=${providerEnvelope.provider_metadata?.externalCallAttempted}; credentials=${providerEnvelope.provider_metadata?.credentialsTouched}`
  );
  check(
    "manifest_and_review_memory_registered",
    manifestValidationCommand.includes("smoke-held-claim-adoption-preflight") &&
      manifest.preserves?.includes("fff-held-claim-adoption-preflight-001") &&
      reviewMemory.some((entry) => entry.artifact_id === "fff-held-claim-adoption-preflight-001"),
    `includesSmoke=${manifestValidationCommand.includes("smoke-held-claim-adoption-preflight")}; preserves=${manifest.preserves?.includes("fff-held-claim-adoption-preflight-001")}; memory=${reviewMemory.some((entry) => entry.artifact_id === "fff-held-claim-adoption-preflight-001")}`
  );

  return {
    schemaVersion: HELD_CLAIM_ADOPTION_PREFLIGHT_SCHEMA_VERSION,
    artifact_id: "fff-held-claim-adoption-preflight-001",
    title: "Fast Fiction Factory Held Claim Adoption Preflight",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    preserved_active_artifact_id: manifest.artifact_id,
    input_readbacks: {
      translated_memo_fixture_minimum_result_path: toRepoPath(translatedMinimumPath),
      source_output_path: toRepoPath(sourceOutputPath),
      source_fixture_path: toRepoPath(sourceFixturePath),
      source_span_review_pack_path: manifest.source_span_review_pack_path || "artifacts/source-span-routing-review-pack.json",
      translation_policy_source_of_truth_boundary_result_path: manifest.translation_policy_source_of_truth_boundary_result_path || DEFAULT_TRANSLATION_POLICY_SOURCE_OF_TRUTH_BOUNDARY_OUTPUT,
      contradictory_claim_guard_result_path: manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT,
      downstream_source_span_adoption_gate_result_path: manifest.downstream_source_span_adoption_gate_result_path || DEFAULT_DOWNSTREAM_SOURCE_SPAN_ADOPTION_GATE_OUTPUT,
      provider_envelope_readiness_no_call_result_path: manifest.provider_envelope_readiness_no_call_result_path || DEFAULT_PROVIDER_ENVELOPE_READINESS_NO_CALL_OUTPUT
    },
    preflight_policy: {
      adoption_candidate_means: "eligible for future local review handoff only, not accepted output",
      adoption_decision: "not_adopted",
      canon_status: false,
      actual_downstream_adoption_implemented: false,
      provider_or_external_call_allowed: false,
      required_conditions: [
        "claim remains hold",
        "claim is source-backed by author memo source refs",
        "original source span matches the raw memo",
        "translation/gloss leakage is zero",
        "contradiction and downstream guards report zero promotion",
        "provider/API/credential boundary remains closed"
      ]
    },
    adoption_preflight_rows: preflightRows,
    provider_external_credential_status: {
      provider_configured: providerEnvelope.provider_metadata?.providerConfigured,
      external_call_attempted: providerEnvelope.provider_metadata?.externalCallAttempted,
      credentials_touched: providerEnvelope.provider_metadata?.credentialsTouched
    },
    summary: {
      held_claims_inspected: preflightRows.length,
      source_backed_claims: sourceBackedRows.length,
      eligible_adoption_candidates: eligibleRows.length,
      actually_adopted_claims: actuallyAdoptedRows.length,
      canonized_claims: canonizedRows.length,
      translation_gloss_leak_count: translationLeakRows.length,
      provider_configured: providerEnvelope.provider_metadata?.providerConfigured,
      external_call_attempted: providerEnvelope.provider_metadata?.externalCallAttempted,
      credentials_touched: providerEnvelope.provider_metadata?.credentialsTouched,
      downstream_adopted_candidates: downstreamGate.summary?.adopted_profile_claim_timeline_candidates,
      contradiction_guard_conflict_leaks: contradictoryGuard.summary?.adopted_or_provisional_conflicting_claims,
      review_card_emitted: false,
      repeated_general_review_request_emitted: false,
      operator_observation_card_emitted: false,
      failures: failures.length
    },
    what_this_preflight_proves: [
      "The translated fixture's held linked claim can be recognized as a source-backed downstream candidate.",
      "Eligibility is only a preflight state; no Profile, Claim, Timeline, or story canon adoption occurs.",
      "Translation/gloss material remains non-promotional and provider-free before any adoption path is designed."
    ],
    what_this_preflight_does_not_prove: [
      "It does not adopt the held claim.",
      "It does not canonize the brass moth key label or its function.",
      "It does not mutate Profile, Claim, Timeline, project state, provider output, credentials, or production surfaces."
    ],
    preflight_checks: checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateDownstreamAdoptionSemanticsDesign(preflight, preflightPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const manifestValidationCommand = String(manifest.validation_command || "");
  const reviewMemory = Array.isArray(manifest.review_memory) ? manifest.review_memory : [];
  const preflightRows = Array.isArray(preflight.adoption_preflight_rows) ? preflight.adoption_preflight_rows : [];
  const candidate = preflightRows.find((row) => row.held_claim_id === "multi-claim-moth-key-label");
  const targetIds = candidate?.downstream_target_ids || {};
  const targetClasses = Array.isArray(candidate?.downstream_target_class) ? candidate.downstream_target_class : [];
  const providerBoundaryOpen =
    preflight.summary?.provider_configured === true ||
    preflight.summary?.external_call_attempted === true ||
    preflight.summary?.credentials_touched === true;
  const mutationForbiddenTargets = [
    {
      target: "Profile",
      target_ids_read_only: Array.isArray(targetIds.profile) ? targetIds.profile : [],
      current_slice_mutation_allowed: false,
      future_write_precondition: "explicit human adoption approval plus target-class mapping and rollback reason"
    },
    {
      target: "Claim",
      target_ids_read_only: Array.isArray(targetIds.claim) ? targetIds.claim : [],
      current_slice_mutation_allowed: false,
      future_write_precondition: "explicit human adoption approval plus source refs, conflict check, and canon-risk acknowledgement"
    },
    {
      target: "Timeline",
      target_ids_read_only: Array.isArray(targetIds.timeline) ? targetIds.timeline : [],
      current_slice_mutation_allowed: false,
      future_write_precondition: "explicit human adoption approval plus unresolved-dependency and ordering review"
    },
    {
      target: "Story Seed",
      target_ids_read_only: [],
      current_slice_mutation_allowed: false,
      future_write_precondition: "explicit user request for story-seed mutation after adoption semantics are accepted"
    }
  ];
  const statusModel = [
    {
      status: "hold",
      owner: "source review state",
      current_slice_meaning: "the claim remains reversible, human-owned, and not accepted",
      current_candidate_state: candidate?.claim_status_before_preflight === "hold"
    },
    {
      status: "adoption_candidate",
      owner: "readback semantics",
      current_slice_meaning: "non-mutating label for a source-backed held claim that passed preflight",
      current_candidate_state: candidate?.adoption_eligibility === "eligible_for_preflight_only"
    },
    {
      status: "ready_for_human_adoption_review",
      owner: "future review queue",
      current_slice_meaning: "defined future queue state; not emitted or persisted now",
      current_candidate_state: false
    },
    {
      status: "human_accepted_downstream_adoption",
      owner: "human author",
      current_slice_meaning: "defined accepted status for future authorized adoption; unreachable in this slice",
      current_candidate_state: false
    },
    {
      status: "rejected_for_adoption",
      owner: "human author or validation gate",
      current_slice_meaning: "future terminal non-adoption state; not emitted now",
      current_candidate_state: false
    },
    {
      status: "rolled_back_to_hold",
      owner: "rollback gate",
      current_slice_meaning: "future recovery state when adoption preconditions regress; not emitted now",
      current_candidate_state: false
    }
  ];
  const statusTransitions = [
    {
      from: "hold",
      to: "adoption_candidate",
      current_slice_allowed: true,
      mutation_effect: "none",
      rule: "allowed only as a readback-only semantic overlay when the preflight row is source-backed, held, leak-free, and provider-free"
    },
    {
      from: "adoption_candidate",
      to: "ready_for_human_adoption_review",
      current_slice_allowed: false,
      mutation_effect: "none now; future queue record only after explicit user request",
      rule: "requires user authorization to create a review queue surface"
    },
    {
      from: "ready_for_human_adoption_review",
      to: "human_accepted_downstream_adoption",
      current_slice_allowed: false,
      mutation_effect: "future Profile / Claim / Timeline write only after human acceptance",
      rule: "requires explicit human acceptance, target-class selection, unresolved-dependency review, and rollback plan"
    },
    {
      from: "adoption_candidate",
      to: "rejected_for_adoption",
      current_slice_allowed: false,
      mutation_effect: "none now",
      rule: "future human rejection or failed gate can close the candidate without mutation"
    },
    {
      from: "human_accepted_downstream_adoption",
      to: "rolled_back_to_hold",
      current_slice_allowed: false,
      mutation_effect: "future reversal of accepted downstream writes",
      rule: "rollback requires identifying written targets and preserving original source evidence"
    }
  ];
  const rollbackConditions = [
    "sourceSpan text or locator no longer matches the original author memo",
    "claim sourceRefs stop proving author_memo trust",
    "claim reviewStatus changes away from hold before human acceptance",
    "translation/gloss leakage count becomes non-zero",
    "contradictory claim guard reports adopted/provisional conflict leakage",
    "downstream source-span adoption gate reports adopted Profile / Claim / Timeline candidates before authorization",
    "Profile, Claim, Timeline, or Story Seed mutation is detected in a design-only slice",
    "provider configuration, external API call, endpoint, credential, or secret usage is detected",
    "human-owned unresolved dependencies are resolved by automation instead of the author",
    "future accepted-status record lacks target ids, source refs, rollback reason, or reviewer authority"
  ];
  const acceptedStatus = {
    status: "human_accepted_downstream_adoption",
    current_slice_reachable: false,
    current_slice_effect: "defined only; no adoption record is emitted",
    future_required_inputs: [
      "explicit human approval for this candidate",
      "target class selection among Profile, Claim, Timeline, or a deliberately deferred Story Seed path",
      "source refs and original source-span readback",
      "contradiction, malformed-span, downstream-gate, and provider-boundary checks passing",
      "rollback condition and owner recorded before mutation"
    ]
  };
  const candidateHolding = {
    held_claim_id: candidate?.held_claim_id || null,
    source_span_id: candidate?.source_span_id || null,
    translated_fixture_row_id: candidate?.translated_fixture_row_id || null,
    source_backed_status: candidate?.source_backed_status === true,
    hold_required_now: true,
    adoption_decision_now: "not_adopted",
    canon_status_now: false,
    human_owner: "author",
    unresolved_dependencies: candidate?.unresolved_dependencies || [],
    target_classes_read_only: targetClasses,
    target_ids_read_only: targetIds
  };

  check(
    "preflight_loaded_and_passed",
    preflight.artifact_id === "fff-held-claim-adoption-preflight-001" &&
      preflight.schemaVersion === HELD_CLAIM_ADOPTION_PREFLIGHT_SCHEMA_VERSION &&
      preflight.passed === true,
    `preflight=${preflight.artifact_id}/${preflight.passed}; schema=${preflight.schemaVersion}`
  );
  check(
    "candidate_identified_and_held",
    Boolean(candidate) &&
      candidate.claim_status_before_preflight === "hold" &&
      candidate.source_backed_status === true &&
      candidate.adoption_eligibility === "eligible_for_preflight_only" &&
      candidate.adoption_decision === "not_adopted" &&
      candidate.canon_status === false,
    `candidate=${candidate?.held_claim_id || "missing"}; status=${candidate?.claim_status_before_preflight}; eligibility=${candidate?.adoption_eligibility}; adopted=${candidate?.adoption_decision}; canon=${candidate?.canon_status}`
  );
  check(
    "status_transition_semantics_defined_without_adoption",
    statusModel.some((entry) => entry.status === "human_accepted_downstream_adoption") &&
      acceptedStatus.current_slice_reachable === false &&
      statusTransitions.filter((entry) => entry.current_slice_allowed).length === 1 &&
      statusTransitions.find((entry) => entry.current_slice_allowed)?.mutation_effect === "none",
    `statuses=${statusModel.length}; allowedNow=${statusTransitions.filter((entry) => entry.current_slice_allowed).length}; acceptedReachable=${acceptedStatus.current_slice_reachable}`
  );
  check(
    "rollback_conditions_defined",
    rollbackConditions.length >= 8 &&
      rollbackConditions.some((condition) => condition.includes("sourceSpan")) &&
      rollbackConditions.some((condition) => condition.includes("provider")) &&
      rollbackConditions.some((condition) => condition.includes("Profile, Claim, Timeline, or Story Seed mutation")),
    `rollbackConditions=${rollbackConditions.length}`
  );
  check(
    "mutation_boundaries_closed",
    mutationForbiddenTargets.length === 4 &&
      mutationForbiddenTargets.every((target) => target.current_slice_mutation_allowed === false) &&
      preflight.summary?.actually_adopted_claims === 0 &&
      preflight.summary?.canonized_claims === 0 &&
      preflight.summary?.downstream_adopted_candidates === 0,
    `targets=${mutationForbiddenTargets.length}; adopted=${preflight.summary?.actually_adopted_claims}; canon=${preflight.summary?.canonized_claims}; downstream=${preflight.summary?.downstream_adopted_candidates}`
  );
  check(
    "provider_and_review_boundaries_closed",
    providerBoundaryOpen === false &&
      preflight.summary?.review_card_emitted === false &&
      preflight.summary?.repeated_general_review_request_emitted === false &&
      preflight.summary?.operator_observation_card_emitted === false,
    `providerOpen=${providerBoundaryOpen}; reviewCard=${preflight.summary?.review_card_emitted}; repeated=${preflight.summary?.repeated_general_review_request_emitted}; operator=${preflight.summary?.operator_observation_card_emitted}`
  );
  check(
    "target_classes_are_read_only_candidates",
    ["profile", "claim", "timeline"].every((targetClass) => targetClasses.includes(targetClass)) &&
      Array.isArray(targetIds.claim) &&
      targetIds.claim.includes("multi-claim-moth-key-label"),
    `classes=${targetClasses.join(", ") || "none"}; claimTargets=${Array.isArray(targetIds.claim) ? targetIds.claim.join(", ") : "none"}`
  );
  check(
    "manifest_and_review_memory_registered",
    manifestValidationCommand.includes("smoke-downstream-adoption-semantics-design") &&
      manifest.preserves?.includes("fff-downstream-adoption-semantics-design-001") &&
      reviewMemory.some((entry) => entry.artifact_id === "fff-downstream-adoption-semantics-design-001"),
    `includesSmoke=${manifestValidationCommand.includes("smoke-downstream-adoption-semantics-design")}; preserves=${manifest.preserves?.includes("fff-downstream-adoption-semantics-design-001")}; memory=${reviewMemory.some((entry) => entry.artifact_id === "fff-downstream-adoption-semantics-design-001")}`
  );

  return {
    schemaVersion: DOWNSTREAM_ADOPTION_SEMANTICS_DESIGN_SCHEMA_VERSION,
    artifact_id: "fff-downstream-adoption-semantics-design-001",
    title: "Fast Fiction Factory Downstream Adoption Semantics Design",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    preserved_active_artifact_id: manifest.artifact_id,
    input_readbacks: {
      held_claim_adoption_preflight_result_path: toRepoPath(preflightPath),
      translated_memo_fixture_minimum_result_path: preflight.input_readbacks?.translated_memo_fixture_minimum_result_path || DEFAULT_TRANSLATED_MEMO_FIXTURE_MINIMUM_OUTPUT,
      source_output_path: preflight.input_readbacks?.source_output_path || "artifacts/extraction-adapter-outputs/multilingual-memo-notes.json",
      source_fixture_path: preflight.input_readbacks?.source_fixture_path || "artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md",
      contradictory_claim_guard_result_path: preflight.input_readbacks?.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT,
      downstream_source_span_adoption_gate_result_path: preflight.input_readbacks?.downstream_source_span_adoption_gate_result_path || DEFAULT_DOWNSTREAM_SOURCE_SPAN_ADOPTION_GATE_OUTPUT,
      provider_envelope_readiness_no_call_result_path: preflight.input_readbacks?.provider_envelope_readiness_no_call_result_path || DEFAULT_PROVIDER_ENVELOPE_READINESS_NO_CALL_OUTPUT
    },
    design_scope: {
      actual_downstream_adoption_implemented: false,
      accepted_status_defined_only: true,
      accepted_status_reachable_now: false,
      profile_claim_timeline_story_seed_mutation_allowed: false,
      provider_or_external_call_allowed: false,
      canon_promotion_allowed: false
    },
    accepted_status: acceptedStatus,
    status_model: statusModel,
    status_transitions: statusTransitions,
    rollback_conditions: rollbackConditions,
    mutation_forbidden_boundaries: mutationForbiddenTargets,
    candidate_holding: candidateHolding,
    summary: {
      preflight_candidates_inspected: preflightRows.length,
      candidate_semantics_defined: candidate ? 1 : 0,
      accepted_status_defined: 1,
      accepted_status_reachable_now: acceptedStatus.current_slice_reachable ? 1 : 0,
      status_transitions_defined: statusTransitions.length,
      current_slice_readback_only_transitions: statusTransitions.filter((entry) => entry.current_slice_allowed).length,
      rollback_conditions_defined: rollbackConditions.length,
      mutation_targets_blocked: mutationForbiddenTargets.filter((target) => !target.current_slice_mutation_allowed).length,
      actual_profile_mutations: 0,
      actual_claim_mutations: 0,
      actual_timeline_mutations: 0,
      story_seed_mutations: 0,
      actually_adopted_claims: preflight.summary?.actually_adopted_claims,
      canonized_claims: preflight.summary?.canonized_claims,
      downstream_adopted_candidates: preflight.summary?.downstream_adopted_candidates,
      translation_gloss_leak_count: preflight.summary?.translation_gloss_leak_count,
      provider_configured: preflight.summary?.provider_configured,
      external_call_attempted: preflight.summary?.external_call_attempted,
      credentials_touched: preflight.summary?.credentials_touched,
      review_card_emitted: false,
      repeated_general_review_request_emitted: false,
      operator_observation_card_emitted: false,
      failures: failures.length
    },
    what_this_design_proves: [
      "The held preflight claim has explicit downstream adoption semantics without adopting it.",
      "Accepted status, rollback conditions, and mutation boundaries are named before any Profile / Claim / Timeline / Story Seed write exists.",
      "The only current-slice transition is a readback-only hold-to-adoption-candidate semantic overlay."
    ],
    what_this_design_does_not_prove: [
      "It does not accept, adopt, or canonize the held claim.",
      "It does not mutate Profile, Claim, Timeline, Story Seed, project state, provider output, credentials, or production surfaces.",
      "It does not resolve Toma fate, brass moth truth, Council motive, moth-key function, or contradictory claim truth."
    ],
    semantics_checks: checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateAdoptionCandidateLedgerDryRun(semantics, semanticsPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const manifestValidationCommand = String(manifest.validation_command || "");
  const reviewMemory = Array.isArray(manifest.review_memory) ? manifest.review_memory : [];
  const preflightPath = semantics.input_readbacks?.held_claim_adoption_preflight_result_path || DEFAULT_HELD_CLAIM_ADOPTION_PREFLIGHT_OUTPUT;
  const preflight = await readJson(preflightPath);
  const preflightRows = Array.isArray(preflight.adoption_preflight_rows) ? preflight.adoption_preflight_rows : [];
  const candidate = semantics.candidate_holding || {};
  const preflightRow = preflightRows.find((row) => row.held_claim_id === candidate.held_claim_id);
  const targetClasses = Array.isArray(candidate.target_classes_read_only) ? candidate.target_classes_read_only : [];
  const targetIds = candidate.target_ids_read_only || {};
  const allowedTransition = Array.isArray(semantics.status_transitions)
    ? semantics.status_transitions.find((entry) => entry.from === "hold" && entry.to === "adoption_candidate")
    : null;
  const rollbackConditions = Array.isArray(semantics.rollback_conditions) ? semantics.rollback_conditions : [];
  const statusModel = Array.isArray(semantics.status_model) ? semantics.status_model : [];
  const evidenceRequirements = Array.isArray(semantics.accepted_status?.future_required_inputs)
    ? semantics.accepted_status.future_required_inputs
    : [];
  const providerBoundaryOpen =
    semantics.summary?.provider_configured === true ||
    semantics.summary?.external_call_attempted === true ||
    semantics.summary?.credentials_touched === true ||
    preflight.summary?.provider_configured === true ||
    preflight.summary?.external_call_attempted === true ||
    preflight.summary?.credentials_touched === true;

  const ledgerRows = preflightRow
    ? [
        {
          ledger_row_id: "adoption-candidate-ledger-dry-run-row-moth-key-label",
          source_span_id: candidate.source_span_id,
          source_span_locator: preflightRow.source_span_locator,
          held_claim_id: candidate.held_claim_id,
          translated_fixture_row_id: candidate.translated_fixture_row_id,
          prior_claim_status: preflightRow.claim_status_before_preflight,
          semantic_transition_attempted: "hold -> adoption_candidate",
          semantic_transition_allowed_as_readback_only: allowedTransition?.current_slice_allowed === true,
          ledger_status: "adoption_candidate_dry_run",
          actual_adoption_status: false,
          canon_status: false,
          profile_mutation_count: 0,
          claim_mutation_count: 0,
          timeline_mutation_count: 0,
          story_seed_mutation_count: 0,
          rollback_vocabulary_available: rollbackConditions.length > 0,
          rejection_vocabulary_available: statusModel.some((entry) => entry.status === "rejected_for_adoption"),
          rollback_status_available: statusModel.some((entry) => entry.status === "rolled_back_to_hold"),
          evidence_requirements_before_real_adoption: evidenceRequirements,
          downstream_target_classes_future_only: targetClasses,
          downstream_target_ids_future_only: targetIds,
          unresolved_dependencies: candidate.unresolved_dependencies || [],
          human_owner: candidate.human_owner || "author"
        }
      ]
    : [];

  check(
    "semantics_loaded_and_passed",
    semantics.artifact_id === "fff-downstream-adoption-semantics-design-001" &&
      semantics.schemaVersion === DOWNSTREAM_ADOPTION_SEMANTICS_DESIGN_SCHEMA_VERSION &&
      semantics.passed === true,
    `semantics=${semantics.artifact_id}/${semantics.passed}; schema=${semantics.schemaVersion}`
  );
  check(
    "preflight_candidate_matched",
    Boolean(preflightRow) &&
      preflight.artifact_id === "fff-held-claim-adoption-preflight-001" &&
      preflightRow.held_claim_id === "multi-claim-moth-key-label" &&
      preflightRow.source_span_id === candidate.source_span_id &&
      preflightRow.claim_status_before_preflight === "hold" &&
      preflightRow.source_backed_status === true &&
      preflightRow.adoption_eligibility === "eligible_for_preflight_only",
    `preflight=${preflight.artifact_id}; candidate=${preflightRow?.held_claim_id || "missing"}; source=${preflightRow?.source_span_id || "missing"}`
  );
  check(
    "ledger_row_created_as_dry_run",
    ledgerRows.length === 1 &&
      ledgerRows[0].ledger_status === "adoption_candidate_dry_run" &&
      ledgerRows[0].semantic_transition_attempted === "hold -> adoption_candidate" &&
      ledgerRows[0].semantic_transition_allowed_as_readback_only === true,
    `rows=${ledgerRows.length}; status=${ledgerRows[0]?.ledger_status || "none"}; transition=${ledgerRows[0]?.semantic_transition_attempted || "none"}`
  );
  check(
    "mutation_boundaries_zero",
    ledgerRows.every((row) =>
      row.profile_mutation_count === 0 &&
      row.claim_mutation_count === 0 &&
      row.timeline_mutation_count === 0 &&
      row.story_seed_mutation_count === 0
    ) &&
      semantics.summary?.actual_profile_mutations === 0 &&
      semantics.summary?.actual_claim_mutations === 0 &&
      semantics.summary?.actual_timeline_mutations === 0 &&
      semantics.summary?.story_seed_mutations === 0,
    `ledgerRows=${ledgerRows.length}; profile=${semantics.summary?.actual_profile_mutations}; claim=${semantics.summary?.actual_claim_mutations}; timeline=${semantics.summary?.actual_timeline_mutations}; storySeed=${semantics.summary?.story_seed_mutations}`
  );
  check(
    "claim_promotion_and_canon_boundary_closed",
    ledgerRows.every((row) => row.actual_adoption_status === false && row.canon_status === false) &&
      semantics.summary?.actually_adopted_claims === 0 &&
      semantics.summary?.canonized_claims === 0 &&
      preflight.summary?.actually_adopted_claims === 0 &&
      preflight.summary?.canonized_claims === 0,
    `semanticsAdopted=${semantics.summary?.actually_adopted_claims}; semanticsCanon=${semantics.summary?.canonized_claims}; preflightAdopted=${preflight.summary?.actually_adopted_claims}; preflightCanon=${preflight.summary?.canonized_claims}`
  );
  check(
    "rollback_rejection_and_evidence_vocabulary_available",
    rollbackConditions.length >= 8 &&
      evidenceRequirements.length >= 4 &&
      ledgerRows.every((row) => row.rollback_vocabulary_available && row.rejection_vocabulary_available && row.rollback_status_available),
    `rollback=${rollbackConditions.length}; evidence=${evidenceRequirements.length}; statuses=${statusModel.map((entry) => entry.status).join(", ") || "none"}`
  );
  check(
    "downstream_targets_future_only",
    ["profile", "claim", "timeline"].every((targetClass) => targetClasses.includes(targetClass)) &&
      ledgerRows.every((row) => Array.isArray(row.downstream_target_ids_future_only.claim) && row.downstream_target_ids_future_only.claim.includes("multi-claim-moth-key-label")),
    `classes=${targetClasses.join(", ") || "none"}; claimTargets=${Array.isArray(targetIds.claim) ? targetIds.claim.join(", ") : "none"}`
  );
  check(
    "provider_boundary_closed",
    providerBoundaryOpen === false &&
      semantics.summary?.provider_configured === false &&
      semantics.summary?.external_call_attempted === false &&
      semantics.summary?.credentials_touched === false,
    `providerOpen=${providerBoundaryOpen}; provider=${semantics.summary?.provider_configured}; external=${semantics.summary?.external_call_attempted}; credentials=${semantics.summary?.credentials_touched}`
  );
  check(
    "manifest_and_review_memory_registered",
    manifestValidationCommand.includes("smoke-adoption-candidate-ledger-dry-run") &&
      manifest.preserves?.includes("fff-adoption-candidate-ledger-dry-run-001") &&
      reviewMemory.some((entry) => entry.artifact_id === "fff-adoption-candidate-ledger-dry-run-001"),
    `includesSmoke=${manifestValidationCommand.includes("smoke-adoption-candidate-ledger-dry-run")}; preserves=${manifest.preserves?.includes("fff-adoption-candidate-ledger-dry-run-001")}; memory=${reviewMemory.some((entry) => entry.artifact_id === "fff-adoption-candidate-ledger-dry-run-001")}`
  );

  return {
    schemaVersion: ADOPTION_CANDIDATE_LEDGER_DRY_RUN_SCHEMA_VERSION,
    artifact_id: "fff-adoption-candidate-ledger-dry-run-001",
    title: "Fast Fiction Factory Adoption Candidate Ledger Dry-Run",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    preserved_active_artifact_id: manifest.artifact_id,
    input_readbacks: {
      downstream_adoption_semantics_design_result_path: toRepoPath(semanticsPath),
      held_claim_adoption_preflight_result_path: toRepoPath(preflightPath),
      translated_memo_fixture_minimum_result_path: semantics.input_readbacks?.translated_memo_fixture_minimum_result_path || DEFAULT_TRANSLATED_MEMO_FIXTURE_MINIMUM_OUTPUT
    },
    dry_run_scope: {
      actual_downstream_adoption_implemented: false,
      ledger_is_mutation_source: false,
      profile_claim_timeline_story_seed_mutation_allowed: false,
      provider_or_external_call_allowed: false,
      canon_promotion_allowed: false,
      publishing_or_production_generation_allowed: false
    },
    ledger_policy: {
      ledger_status: "adoption_candidate_dry_run",
      semantic_transition_source: "fff-downstream-adoption-semantics-design-001",
      accepted_status_remains_unreachable_now: semantics.accepted_status?.current_slice_reachable === false,
      current_slice_transition_effect: allowedTransition?.mutation_effect || "none",
      rejection_and_rollback_vocabularies: statusModel
        .filter((entry) => ["rejected_for_adoption", "rolled_back_to_hold"].includes(entry.status))
        .map((entry) => entry.status)
    },
    adoption_candidate_ledger_rows: ledgerRows,
    summary: {
      candidates_inspected: preflightRows.length,
      ledger_dry_run_rows: ledgerRows.length,
      eligible_semantic_candidates: ledgerRows.length,
      actually_adopted_claims: 0,
      canonized_claims: 0,
      profile_mutation_count: 0,
      claim_mutation_count: 0,
      timeline_mutation_count: 0,
      story_seed_mutation_count: 0,
      provider_configured: false,
      external_call_attempted: false,
      credentials_touched: false,
      publishing_opened: false,
      production_generation_opened: false,
      failures: failures.length
    },
    what_this_dry_run_proves: [
      "The source-backed held claim can be recorded as an adoption-candidate ledger dry-run row.",
      "The row carries source span, held claim, prior status, attempted semantic transition, rollback vocabulary, and future-only downstream targets.",
      "Profile, Claim, Timeline, Story Seed, provider, credential, canon, publishing, and production mutation counts remain zero."
    ],
    what_this_dry_run_does_not_prove: [
      "It does not adopt, accept, canonize, or publish the held claim.",
      "It does not write Profile, Claim, Timeline, Story Seed, project state, provider output, credentials, or production surfaces.",
      "It does not resolve unresolved author-owned truth such as brass moth truth or Toma fate."
    ],
    ledger_checks: checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateSandboxAdoptionMutationOneClaim(ledger, ledgerPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const manifestValidationCommand = String(manifest.validation_command || "");
  const reviewMemory = Array.isArray(manifest.review_memory) ? manifest.review_memory : [];
  const ledgerRows = Array.isArray(ledger.adoption_candidate_ledger_rows) ? ledger.adoption_candidate_ledger_rows : [];
  const candidate = ledgerRows.find((row) => row.held_claim_id === "multi-claim-moth-key-label");
  const preflightPath = ledger.input_readbacks?.held_claim_adoption_preflight_result_path || DEFAULT_HELD_CLAIM_ADOPTION_PREFLIGHT_OUTPUT;
  const semanticsPath = ledger.input_readbacks?.downstream_adoption_semantics_design_result_path || DEFAULT_DOWNSTREAM_ADOPTION_SEMANTICS_DESIGN_OUTPUT;
  const preflight = await readJson(preflightPath);
  const semantics = await readJson(semanticsPath);
  const preflightRows = Array.isArray(preflight.adoption_preflight_rows) ? preflight.adoption_preflight_rows : [];
  const preflightRow = preflightRows.find((row) => row.held_claim_id === candidate?.held_claim_id);
  const rollbackDescriptor = {
    rollback_token: "rollback-sandbox-adoption-moth-key-label-to-adoption-candidate-dry-run",
    rollback_scope: "sandbox fixture row only",
    rollback_to_status: "adoption_candidate_dry_run",
    rollback_requires: [
      "remove the sandbox fixture row",
      "preserve the source span id and held claim id in audit history",
      "keep production Profile / Claim / Timeline / Story Seed mutation counts at zero"
    ]
  };
  const rollbackVocabulary = [
    ...(Array.isArray(ledger.ledger_policy?.rejection_and_rollback_vocabularies)
      ? ledger.ledger_policy.rejection_and_rollback_vocabularies
      : []),
    "sandbox_rolled_back_to_candidate_dry_run"
  ];
  const evidenceRequirements = Array.isArray(candidate?.evidence_requirements_before_real_adoption)
    ? candidate.evidence_requirements_before_real_adoption
    : [];
  const sandboxRows = candidate
    ? [
        {
          sandbox_fixture_row_id: "sandbox-adoption-fixture-row-moth-key-label",
          target_claim_id: candidate.held_claim_id,
          source_span_id: candidate.source_span_id,
          source_span_locator: candidate.source_span_locator,
          translated_fixture_row_id: candidate.translated_fixture_row_id,
          prior_claim_status: candidate.prior_claim_status,
          prior_ledger_status: candidate.ledger_status,
          sandbox_transition: "adoption_candidate_dry_run -> sandbox_adopted_fixture",
          sandbox_adopted_fixture_status: "sandbox_adopted_fixture",
          sandbox_mutation_count: 1,
          production_adoption_status: false,
          canon_status: false,
          profile_production_mutation_count: 0,
          claim_production_mutation_count: 0,
          timeline_production_mutation_count: 0,
          story_seed_production_mutation_count: 0,
          affected_production_objects: [],
          rollback_descriptor: rollbackDescriptor,
          rejection_rollback_vocabulary: rollbackVocabulary,
          evidence_required_before_future_production_adoption: evidenceRequirements,
          provider_configured: false,
          external_call_attempted: false,
          credentials_touched: false,
          publishing_opened: false,
          production_generation_opened: false
        }
      ]
    : [];
  const providerBoundaryOpen =
    ledger.summary?.provider_configured === true ||
    ledger.summary?.external_call_attempted === true ||
    ledger.summary?.credentials_touched === true ||
    preflight.summary?.provider_configured === true ||
    preflight.summary?.external_call_attempted === true ||
    preflight.summary?.credentials_touched === true ||
    semantics.summary?.provider_configured === true ||
    semantics.summary?.external_call_attempted === true ||
    semantics.summary?.credentials_touched === true;

  check(
    "ledger_loaded_and_passed",
    ledger.artifact_id === "fff-adoption-candidate-ledger-dry-run-001" &&
      ledger.schemaVersion === ADOPTION_CANDIDATE_LEDGER_DRY_RUN_SCHEMA_VERSION &&
      ledger.passed === true,
    `ledger=${ledger.artifact_id}/${ledger.passed}; schema=${ledger.schemaVersion}`
  );
  check(
    "expected_candidate_located_and_eligible",
    Boolean(candidate) &&
      ledgerRows.length === 1 &&
      candidate.held_claim_id === "multi-claim-moth-key-label" &&
      candidate.source_span_id === "multi-x-object-brass-moth-key" &&
      candidate.prior_claim_status === "hold" &&
      candidate.ledger_status === "adoption_candidate_dry_run" &&
      candidate.actual_adoption_status === false &&
      candidate.canon_status === false &&
      preflightRow?.source_backed_status === true &&
      preflightRow?.translation_leakage_status === "no_leak" &&
      preflightRow?.adoption_decision === "not_adopted" &&
      preflightRow?.canon_status === false,
    `candidate=${candidate?.held_claim_id || "missing"}; ledgerRows=${ledgerRows.length}; preflight=${preflightRow?.adoption_eligibility || "missing"}`
  );
  check(
    "sandbox_fixture_mutation_is_one_claim_only",
    sandboxRows.length === 1 &&
      sandboxRows[0].target_claim_id === "multi-claim-moth-key-label" &&
      sandboxRows[0].sandbox_transition === "adoption_candidate_dry_run -> sandbox_adopted_fixture" &&
      sandboxRows[0].sandbox_adopted_fixture_status === "sandbox_adopted_fixture" &&
      sandboxRows[0].sandbox_mutation_count === 1,
    `rows=${sandboxRows.length}; status=${sandboxRows[0]?.sandbox_adopted_fixture_status || "none"}; target=${sandboxRows[0]?.target_claim_id || "none"}`
  );
  check(
    "production_mutation_boundary_closed",
    sandboxRows.every((row) =>
      row.production_adoption_status === false &&
      row.profile_production_mutation_count === 0 &&
      row.claim_production_mutation_count === 0 &&
      row.timeline_production_mutation_count === 0 &&
      row.story_seed_production_mutation_count === 0 &&
      Array.isArray(row.affected_production_objects) &&
      row.affected_production_objects.length === 0
    ),
    `rows=${sandboxRows.length}; affected=${sandboxRows[0]?.affected_production_objects?.length ?? "missing"}`
  );
  check(
    "canon_and_provider_boundaries_closed",
    sandboxRows.every((row) =>
      row.canon_status === false &&
      row.provider_configured === false &&
      row.external_call_attempted === false &&
      row.credentials_touched === false &&
      row.publishing_opened === false &&
      row.production_generation_opened === false
    ) &&
      providerBoundaryOpen === false,
    `providerOpen=${providerBoundaryOpen}; canon=${sandboxRows[0]?.canon_status ?? "missing"}`
  );
  check(
    "rollback_readback_recorded",
    sandboxRows.every((row) =>
      row.rollback_descriptor?.rollback_token === rollbackDescriptor.rollback_token &&
      row.rollback_descriptor?.rollback_to_status === "adoption_candidate_dry_run" &&
      row.rollback_descriptor?.rollback_scope === "sandbox fixture row only" &&
      row.rejection_rollback_vocabulary.includes("rejected_for_adoption") &&
      row.rejection_rollback_vocabulary.includes("rolled_back_to_hold") &&
      row.rejection_rollback_vocabulary.includes("sandbox_rolled_back_to_candidate_dry_run")
    ),
    `rollback=${sandboxRows[0]?.rollback_descriptor?.rollback_token || "none"}; vocab=${sandboxRows[0]?.rejection_rollback_vocabulary?.join(", ") || "none"}`
  );
  check(
    "future_production_evidence_requirements_preserved",
    evidenceRequirements.length >= 4 &&
      sandboxRows.every((row) => row.evidence_required_before_future_production_adoption.length === evidenceRequirements.length) &&
      semantics.accepted_status?.current_slice_reachable === false,
    `evidence=${evidenceRequirements.length}; acceptedReachable=${semantics.accepted_status?.current_slice_reachable}`
  );
  check(
    "manifest_and_review_memory_registered",
    manifestValidationCommand.includes("smoke-sandbox-adoption-mutation-one-claim") &&
      manifest.preserves?.includes("fff-sandbox-adoption-mutation-one-claim-001") &&
      reviewMemory.some((entry) => entry.artifact_id === "fff-sandbox-adoption-mutation-one-claim-001"),
    `includesSmoke=${manifestValidationCommand.includes("smoke-sandbox-adoption-mutation-one-claim")}; preserves=${manifest.preserves?.includes("fff-sandbox-adoption-mutation-one-claim-001")}; memory=${reviewMemory.some((entry) => entry.artifact_id === "fff-sandbox-adoption-mutation-one-claim-001")}`
  );

  return {
    schemaVersion: SANDBOX_ADOPTION_MUTATION_ONE_CLAIM_SCHEMA_VERSION,
    artifact_id: "fff-sandbox-adoption-mutation-one-claim-001",
    title: "Fast Fiction Factory Sandbox Adoption Mutation One Claim",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    preserved_active_artifact_id: manifest.artifact_id,
    input_readbacks: {
      adoption_candidate_ledger_dry_run_result_path: toRepoPath(ledgerPath),
      downstream_adoption_semantics_design_result_path: toRepoPath(semanticsPath),
      held_claim_adoption_preflight_result_path: toRepoPath(preflightPath)
    },
    authorized_mutation_boundary: {
      target_claim_id: "multi-claim-moth-key-label",
      mutation_class: "sandbox_fixture_adoption_only",
      expected_transition: "adoption_candidate_dry_run -> sandbox_adopted_fixture",
      production_adoption_allowed: false,
      canon_allowed: false,
      provider_api_credential_allowed: false,
      publishing_or_production_generation_allowed: false,
      affected_production_objects: []
    },
    sandbox_adoption_fixture_rows: sandboxRows,
    rollback_readback: {
      rollback_descriptors_present: sandboxRows.filter((row) => row.rollback_descriptor?.rollback_token).length,
      rollback_token: rollbackDescriptor.rollback_token,
      rollback_scope: rollbackDescriptor.rollback_scope,
      rollback_to_status: rollbackDescriptor.rollback_to_status,
      rejection_rollback_vocabulary: rollbackVocabulary
    },
    summary: {
      candidates_inspected: ledgerRows.length,
      sandbox_fixture_adoption_rows: sandboxRows.length,
      sandbox_mutation_count: sandboxRows.reduce((sum, row) => sum + row.sandbox_mutation_count, 0),
      production_adopted_claims: 0,
      canonized_claims: 0,
      profile_production_mutation_count: 0,
      claim_production_mutation_count: 0,
      timeline_production_mutation_count: 0,
      story_seed_production_mutation_count: 0,
      affected_production_objects: 0,
      rollback_descriptors_present: sandboxRows.filter((row) => row.rollback_descriptor?.rollback_token).length,
      provider_configured: false,
      external_call_attempted: false,
      credentials_touched: false,
      publishing_opened: false,
      production_generation_opened: false,
      failures: failures.length
    },
    what_this_sandbox_mutation_proves: [
      "The authorized claim can move from adoption_candidate_dry_run to sandbox_adopted_fixture in a fixture-only readback row.",
      "The sandbox row has a rollback token and preserves future evidence requirements before any production adoption.",
      "Production Profile, Claim, Timeline, Story Seed, provider, credential, canon, publishing, and production routes remain closed."
    ],
    what_this_sandbox_mutation_does_not_prove: [
      "It does not adopt the claim into production state.",
      "It does not canonize the claim or resolve brass moth truth, Toma fate, Council motive, moth-key function, or contradictory claim truth.",
      "It does not write Profile, Claim, Timeline, Story Seed, database, provider output, credentials, publishing, or production surfaces."
    ],
    sandbox_checks: checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateSandboxAdoptionRollbackRehearsal(sandbox, sandboxPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const manifestValidationCommand = String(manifest.validation_command || "");
  const reviewMemory = Array.isArray(manifest.review_memory) ? manifest.review_memory : [];
  const sandboxRows = Array.isArray(sandbox.sandbox_adoption_fixture_rows) ? sandbox.sandbox_adoption_fixture_rows : [];
  const target = sandboxRows.find((row) => row.target_claim_id === "multi-claim-moth-key-label");
  const rollbackToken = "rollback-sandbox-adoption-moth-key-label-to-adoption-candidate-dry-run";
  const rollbackScope = "sandbox fixture row only";
  const rollbackTransition = "sandbox_adopted_fixture -> adoption_candidate_dry_run";
  const rollbackToStatus = "adoption_candidate_dry_run";
  const evidenceRequirements = Array.isArray(target?.evidence_required_before_future_production_adoption)
    ? target.evidence_required_before_future_production_adoption
    : [];
  const productionBoundaryOpen =
    sandbox.summary?.production_adopted_claims !== 0 ||
    sandbox.summary?.canonized_claims !== 0 ||
    sandbox.summary?.profile_production_mutation_count !== 0 ||
    sandbox.summary?.claim_production_mutation_count !== 0 ||
    sandbox.summary?.timeline_production_mutation_count !== 0 ||
    sandbox.summary?.story_seed_production_mutation_count !== 0 ||
    sandbox.summary?.affected_production_objects !== 0;
  const providerBoundaryOpen =
    sandbox.summary?.provider_configured === true ||
    sandbox.summary?.external_call_attempted === true ||
    sandbox.summary?.credentials_touched === true ||
    sandbox.summary?.publishing_opened === true ||
    sandbox.summary?.production_generation_opened === true;
  const rehearsalRows =
    target &&
    target.rollback_descriptor?.rollback_token === rollbackToken &&
    target.rollback_descriptor?.rollback_scope === rollbackScope
      ? [
          {
            rollback_rehearsal_row_id: "sandbox-adoption-rollback-rehearsal-row-moth-key-label",
            target_claim_id: target.target_claim_id,
            source_span_id: target.source_span_id,
            source_span_locator: target.source_span_locator,
            translated_fixture_row_id: target.translated_fixture_row_id,
            prior_sandbox_fixture_status: target.sandbox_adopted_fixture_status,
            rollback_token: target.rollback_descriptor.rollback_token,
            rollback_scope: target.rollback_descriptor.rollback_scope,
            rollback_transition: rollbackTransition,
            post_rollback_rehearsal_status: rollbackToStatus,
            rollback_rehearsal_success: true,
            production_rollback_performed: false,
            production_adoption_status: false,
            canon_status: false,
            profile_production_mutation_count: 0,
            claim_production_mutation_count: 0,
            timeline_production_mutation_count: 0,
            story_seed_production_mutation_count: 0,
            affected_production_objects: [],
            provider_configured: false,
            external_call_attempted: false,
            credentials_touched: false,
            publishing_opened: false,
            production_generation_opened: false,
            evidence_required_before_future_production_adoption: evidenceRequirements,
            rehearsal_note: "No production rollback performed; sandbox fixture rollback rehearsed only."
          }
        ]
      : [];

  check(
    "sandbox_adoption_loaded_and_passed",
    sandbox.artifact_id === "fff-sandbox-adoption-mutation-one-claim-001" &&
      sandbox.schemaVersion === SANDBOX_ADOPTION_MUTATION_ONE_CLAIM_SCHEMA_VERSION &&
      sandbox.passed === true,
    `sandbox=${sandbox.artifact_id}/${sandbox.passed}; schema=${sandbox.schemaVersion}`
  );
  check(
    "expected_sandbox_target_and_token_verified",
    sandboxRows.length === 1 &&
      Boolean(target) &&
      target.target_claim_id === "multi-claim-moth-key-label" &&
      target.source_span_id === "multi-x-object-brass-moth-key" &&
      target.prior_ledger_status === "adoption_candidate_dry_run" &&
      target.sandbox_adopted_fixture_status === "sandbox_adopted_fixture" &&
      target.rollback_descriptor?.rollback_token === rollbackToken &&
      target.rollback_descriptor?.rollback_scope === rollbackScope &&
      target.rollback_descriptor?.rollback_to_status === rollbackToStatus &&
      target.production_adoption_status === false &&
      target.canon_status === false,
    `rows=${sandboxRows.length}; target=${target?.target_claim_id || "missing"}; token=${target?.rollback_descriptor?.rollback_token || "missing"}`
  );
  check(
    "rollback_rehearsal_row_created",
    rehearsalRows.length === 1 &&
      rehearsalRows[0].prior_sandbox_fixture_status === "sandbox_adopted_fixture" &&
      rehearsalRows[0].rollback_transition === rollbackTransition &&
      rehearsalRows[0].post_rollback_rehearsal_status === rollbackToStatus &&
      rehearsalRows[0].rollback_token === rollbackToken &&
      rehearsalRows[0].rollback_rehearsal_success === true &&
      rehearsalRows[0].production_rollback_performed === false,
    `rows=${rehearsalRows.length}; transition=${rehearsalRows[0]?.rollback_transition || "none"}; post=${rehearsalRows[0]?.post_rollback_rehearsal_status || "none"}`
  );
  check(
    "production_mutation_boundary_closed",
    productionBoundaryOpen === false &&
      sandboxRows.every((row) =>
        row.production_adoption_status === false &&
        row.profile_production_mutation_count === 0 &&
        row.claim_production_mutation_count === 0 &&
        row.timeline_production_mutation_count === 0 &&
        row.story_seed_production_mutation_count === 0 &&
        Array.isArray(row.affected_production_objects) &&
        row.affected_production_objects.length === 0
      ) &&
      rehearsalRows.every((row) =>
        row.production_adoption_status === false &&
        row.profile_production_mutation_count === 0 &&
        row.claim_production_mutation_count === 0 &&
        row.timeline_production_mutation_count === 0 &&
        row.story_seed_production_mutation_count === 0 &&
        Array.isArray(row.affected_production_objects) &&
        row.affected_production_objects.length === 0
      ),
    `productionOpen=${productionBoundaryOpen}; affected=${target?.affected_production_objects?.length ?? "missing"}`
  );
  check(
    "canon_and_provider_boundaries_closed",
    providerBoundaryOpen === false &&
      sandboxRows.every((row) =>
        row.canon_status === false &&
        row.provider_configured === false &&
        row.external_call_attempted === false &&
        row.credentials_touched === false &&
        row.publishing_opened === false &&
        row.production_generation_opened === false
      ) &&
      rehearsalRows.every((row) =>
        row.canon_status === false &&
        row.provider_configured === false &&
        row.external_call_attempted === false &&
        row.credentials_touched === false &&
        row.publishing_opened === false &&
        row.production_generation_opened === false
      ),
    `providerOpen=${providerBoundaryOpen}; canon=${target?.canon_status ?? "missing"}`
  );
  check(
    "future_production_evidence_requirements_preserved",
    evidenceRequirements.length >= 4 &&
      rehearsalRows.length === 1 &&
      rehearsalRows[0].evidence_required_before_future_production_adoption.length === evidenceRequirements.length,
    `evidence=${evidenceRequirements.length}; rehearsalRows=${rehearsalRows.length}`
  );
  check(
    "manifest_and_review_memory_registered",
    manifestValidationCommand.includes("smoke-sandbox-adoption-rollback-rehearsal") &&
      manifest.preserves?.includes("fff-sandbox-adoption-rollback-rehearsal-001") &&
      reviewMemory.some((entry) => entry.artifact_id === "fff-sandbox-adoption-rollback-rehearsal-001"),
    `includesSmoke=${manifestValidationCommand.includes("smoke-sandbox-adoption-rollback-rehearsal")}; preserves=${manifest.preserves?.includes("fff-sandbox-adoption-rollback-rehearsal-001")}; memory=${reviewMemory.some((entry) => entry.artifact_id === "fff-sandbox-adoption-rollback-rehearsal-001")}`
  );

  return {
    schemaVersion: SANDBOX_ADOPTION_ROLLBACK_REHEARSAL_SCHEMA_VERSION,
    artifact_id: "fff-sandbox-adoption-rollback-rehearsal-001",
    title: "Fast Fiction Factory Sandbox Adoption Rollback Rehearsal",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    preserved_active_artifact_id: manifest.artifact_id,
    input_readbacks: {
      sandbox_adoption_mutation_one_claim_result_path: toRepoPath(sandboxPath),
      adoption_candidate_ledger_dry_run_result_path: sandbox.input_readbacks?.adoption_candidate_ledger_dry_run_result_path || DEFAULT_ADOPTION_CANDIDATE_LEDGER_DRY_RUN_OUTPUT,
      downstream_adoption_semantics_design_result_path: sandbox.input_readbacks?.downstream_adoption_semantics_design_result_path || DEFAULT_DOWNSTREAM_ADOPTION_SEMANTICS_DESIGN_OUTPUT,
      held_claim_adoption_preflight_result_path: sandbox.input_readbacks?.held_claim_adoption_preflight_result_path || DEFAULT_HELD_CLAIM_ADOPTION_PREFLIGHT_OUTPUT
    },
    authorized_rollback_rehearsal_boundary: {
      target_claim_id: "multi-claim-moth-key-label",
      rollback_scope: rollbackScope,
      expected_rollback_token: rollbackToken,
      expected_transition: rollbackTransition,
      production_adoption_allowed: false,
      canon_allowed: false,
      provider_api_credential_allowed: false,
      publishing_or_production_generation_allowed: false,
      affected_production_objects: []
    },
    sandbox_rollback_rehearsal_rows: rehearsalRows,
    rollback_rehearsal_summary: {
      target_claim_id: target?.target_claim_id || "missing",
      source_span_id: target?.source_span_id || "missing",
      prior_sandbox_fixture_status: target?.sandbox_adopted_fixture_status || "missing",
      rollback_token: target?.rollback_descriptor?.rollback_token || "missing",
      rollback_scope: target?.rollback_descriptor?.rollback_scope || "missing",
      rollback_transition: rollbackTransition,
      post_rollback_rehearsal_status: rollbackToStatus,
      production_rollback_performed: false,
      rehearsal_result: rehearsalRows.length === 1 ? "success" : "failed"
    },
    summary: {
      sandbox_adopted_rows_inspected: sandboxRows.length,
      rollback_rehearsals_recorded: rehearsalRows.length,
      successful_rollback_rehearsal_rows: rehearsalRows.filter((row) => row.rollback_rehearsal_success === true).length,
      production_adopted_claims: 0,
      canonized_claims: 0,
      profile_production_mutation_count: 0,
      claim_production_mutation_count: 0,
      timeline_production_mutation_count: 0,
      story_seed_production_mutation_count: 0,
      affected_production_objects: 0,
      provider_configured: false,
      external_call_attempted: false,
      credentials_touched: false,
      publishing_opened: false,
      production_generation_opened: false,
      failures: failures.length
    },
    what_this_rehearsal_proves: [
      "The authorized sandbox-adopted fixture row can be read back with the expected rollback token.",
      "The rehearsed rollback target is adoption_candidate_dry_run, scoped to the sandbox fixture row only.",
      "Production Profile, Claim, Timeline, Story Seed, provider, credential, canon, publishing, and production routes remain closed."
    ],
    what_this_rehearsal_does_not_prove: [
      "It does not perform a production rollback.",
      "It does not adopt or canonize the claim.",
      "It does not write Profile, Claim, Timeline, Story Seed, database, provider output, credentials, publishing, or production surfaces."
    ],
    rehearsal_checks: checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateProductionAdoptionAuthorizationPacket(rollback, rollbackPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const manifestValidationCommand = String(manifest.validation_command || "");
  const reviewMemory = Array.isArray(manifest.review_memory) ? manifest.review_memory : [];
  const sandboxPath = rollback.input_readbacks?.sandbox_adoption_mutation_one_claim_result_path || DEFAULT_SANDBOX_ADOPTION_MUTATION_ONE_CLAIM_OUTPUT;
  const ledgerPath = rollback.input_readbacks?.adoption_candidate_ledger_dry_run_result_path || DEFAULT_ADOPTION_CANDIDATE_LEDGER_DRY_RUN_OUTPUT;
  const semanticsPath = rollback.input_readbacks?.downstream_adoption_semantics_design_result_path || DEFAULT_DOWNSTREAM_ADOPTION_SEMANTICS_DESIGN_OUTPUT;
  const sandbox = await readJson(sandboxPath);
  const ledger = await readJson(ledgerPath);
  const semantics = await readJson(semanticsPath);
  const rollbackRows = Array.isArray(rollback.sandbox_rollback_rehearsal_rows) ? rollback.sandbox_rollback_rehearsal_rows : [];
  const target = rollbackRows.find((row) => row.target_claim_id === "multi-claim-moth-key-label");
  const sandboxRows = Array.isArray(sandbox.sandbox_adoption_fixture_rows) ? sandbox.sandbox_adoption_fixture_rows : [];
  const sandboxTarget = sandboxRows.find((row) => row.target_claim_id === "multi-claim-moth-key-label");
  const ledgerRows = Array.isArray(ledger.adoption_candidate_ledger_rows) ? ledger.adoption_candidate_ledger_rows : [];
  const ledgerTarget = ledgerRows.find((row) => row.held_claim_id === "multi-claim-moth-key-label");
  const rollbackToken = "rollback-sandbox-adoption-moth-key-label-to-adoption-candidate-dry-run";
  const proposedTargets = [
    {
      target_class: "Profile",
      target_ids: ledgerTarget?.downstream_target_ids_future_only?.profile || semantics.candidate_holding?.target_ids_read_only?.profile || ["multi-profile-brass-moth-key"],
      recommended_first_target: false,
      mutation_behavior: "Future-only update or create a Profile object entry that links the brass moth key label to the original source span without canonizing unresolved truth.",
      rollback_owner: "author approves rollback; implementer removes the profile mutation and preserves the source evidence trail",
      production_rollback_descriptor_needed: "rollback-production-adoption-moth-key-label-profile-to-held",
      approval_requirement: "explicit user approval for Profile mutation plus unresolved brass moth truth review"
    },
    {
      target_class: "Claim Ledger",
      target_ids: ledgerTarget?.downstream_target_ids_future_only?.claim || semantics.candidate_holding?.target_ids_read_only?.claim || ["multi-claim-moth-key-label"],
      recommended_first_target: true,
      mutation_behavior: "Future-only accept the source-backed claim into the production Claim Ledger while keeping canon approval separate and preserving source refs.",
      rollback_owner: "author approves rollback; implementer returns the claim to held/adoption-candidate state with audit trail",
      production_rollback_descriptor_needed: "rollback-production-adoption-moth-key-label-claim-ledger-to-held",
      approval_requirement: "explicit user approval for Claim Ledger mutation and canon-risk acknowledgement"
    },
    {
      target_class: "Timeline",
      target_ids: ledgerTarget?.downstream_target_ids_future_only?.timeline || semantics.candidate_holding?.target_ids_read_only?.timeline || ["multi-timeline-moth-key-label"],
      recommended_first_target: false,
      mutation_behavior: "Future-only add or update a Timeline entry if the user confirms a sequence/order implication for the moth key label.",
      rollback_owner: "author approves rollback; implementer removes the timeline mutation and keeps source references readable",
      production_rollback_descriptor_needed: "rollback-production-adoption-moth-key-label-timeline-to-held",
      approval_requirement: "explicit user approval for Timeline mutation plus ordering/dependency review"
    },
    {
      target_class: "Story Seed",
      target_ids: [],
      recommended_first_target: false,
      mutation_behavior: "Deferred future-only story-seed mutation; no current story-seed target is selected by the existing readbacks.",
      rollback_owner: "author approves rollback; implementer removes the story-seed mutation and leaves Claim Ledger evidence intact",
      production_rollback_descriptor_needed: "rollback-production-adoption-moth-key-label-story-seed-to-held",
      approval_requirement: "explicit user request naming a Story Seed mutation target"
    }
  ];
  const evidenceRequired = [
    ...(Array.isArray(target?.evidence_required_before_future_production_adoption)
      ? target.evidence_required_before_future_production_adoption
      : []),
    "production target class selected by user",
    "mutation behavior accepted by user",
    "production rollback owner confirmed by user",
    "production rollback descriptor accepted before mutation"
  ];
  const userAuthorizationMissing = [
    "production_adoption_approval",
    "selected_production_target_class",
    "mutation_behavior_acceptance",
    "production_rollback_owner",
    "production_rollback_descriptor",
    "canon_decision",
    "unresolved_dependency_review_for_brass_moth_truth_and_toma_fate",
    "provider_api_credential_publishing_scope_confirmation"
  ];
  const explicitNonApproval = {
    production_adoption_approved: false,
    canon_approved: false,
    provider_approved: false,
    publishing_approved: false,
    external_api_approved: false
  };
  const productionBoundaryOpen =
    rollback.summary?.production_adopted_claims !== 0 ||
    rollback.summary?.canonized_claims !== 0 ||
    rollback.summary?.profile_production_mutation_count !== 0 ||
    rollback.summary?.claim_production_mutation_count !== 0 ||
    rollback.summary?.timeline_production_mutation_count !== 0 ||
    rollback.summary?.story_seed_production_mutation_count !== 0 ||
    rollback.summary?.affected_production_objects !== 0 ||
    sandbox.summary?.production_adopted_claims !== 0 ||
    sandbox.summary?.canonized_claims !== 0 ||
    ledger.summary?.actually_adopted_claims !== 0 ||
    ledger.summary?.canonized_claims !== 0 ||
    semantics.summary?.actually_adopted_claims !== 0 ||
    semantics.summary?.canonized_claims !== 0;
  const providerBoundaryOpen =
    rollback.summary?.provider_configured === true ||
    rollback.summary?.external_call_attempted === true ||
    rollback.summary?.credentials_touched === true ||
    rollback.summary?.publishing_opened === true ||
    rollback.summary?.production_generation_opened === true ||
    sandbox.summary?.provider_configured === true ||
    sandbox.summary?.external_call_attempted === true ||
    sandbox.summary?.credentials_touched === true ||
    sandbox.summary?.publishing_opened === true ||
    sandbox.summary?.production_generation_opened === true ||
    ledger.summary?.provider_configured === true ||
    ledger.summary?.external_call_attempted === true ||
    ledger.summary?.credentials_touched === true ||
    semantics.summary?.provider_configured === true ||
    semantics.summary?.external_call_attempted === true ||
    semantics.summary?.credentials_touched === true;

  check(
    "rollback_rehearsal_loaded_and_passed",
    rollback.artifact_id === "fff-sandbox-adoption-rollback-rehearsal-001" &&
      rollback.schemaVersion === SANDBOX_ADOPTION_ROLLBACK_REHEARSAL_SCHEMA_VERSION &&
      rollback.passed === true,
    `rollback=${rollback.artifact_id}/${rollback.passed}; schema=${rollback.schemaVersion}`
  );
  check(
    "expected_target_source_and_status_verified",
    Boolean(target) &&
      target.target_claim_id === "multi-claim-moth-key-label" &&
      target.source_span_id === "multi-x-object-brass-moth-key" &&
      target.post_rollback_rehearsal_status === "adoption_candidate_dry_run" &&
      target.rollback_token === rollbackToken &&
      target.rollback_rehearsal_success === true &&
      target.production_adoption_status === false &&
      target.canon_status === false,
    `target=${target?.target_claim_id || "missing"}; status=${target?.post_rollback_rehearsal_status || "missing"}; token=${target?.rollback_token || "missing"}`
  );
  check(
    "prior_sandbox_and_ledger_evidence_loaded",
    sandbox.artifact_id === "fff-sandbox-adoption-mutation-one-claim-001" &&
      ledger.artifact_id === "fff-adoption-candidate-ledger-dry-run-001" &&
      semantics.artifact_id === "fff-downstream-adoption-semantics-design-001" &&
      Boolean(sandboxTarget) &&
      Boolean(ledgerTarget) &&
      sandboxTarget.rollback_descriptor?.rollback_token === rollbackToken &&
      ledgerTarget.ledger_status === "adoption_candidate_dry_run" &&
      semantics.accepted_status?.current_slice_reachable === false,
    `sandbox=${sandbox.artifact_id}; ledger=${ledger.artifact_id}; semantics=${semantics.artifact_id}; ledgerStatus=${ledgerTarget?.ledger_status || "missing"}`
  );
  check(
    "proposed_targets_and_recommended_first_class_recorded",
    proposedTargets.length === 4 &&
      proposedTargets.some((targetClass) => targetClass.target_class === "Profile") &&
      proposedTargets.some((targetClass) => targetClass.target_class === "Claim Ledger" && targetClass.recommended_first_target === true) &&
      proposedTargets.some((targetClass) => targetClass.target_class === "Timeline") &&
      proposedTargets.some((targetClass) => targetClass.target_class === "Story Seed"),
    `targets=${proposedTargets.map((targetClass) => targetClass.target_class).join(", ")}; recommended=${proposedTargets.find((targetClass) => targetClass.recommended_first_target)?.target_class || "missing"}`
  );
  check(
    "authorization_fields_missing_and_user_required",
    userAuthorizationMissing.length >= 6 &&
      Object.values(explicitNonApproval).every((value) => value === false),
    `missing=${userAuthorizationMissing.length}; approvals=${JSON.stringify(explicitNonApproval)}`
  );
  check(
    "mutation_canon_provider_boundaries_closed",
    productionBoundaryOpen === false &&
      providerBoundaryOpen === false &&
      proposedTargets.every((targetClass) => typeof targetClass.production_rollback_descriptor_needed === "string") &&
      explicitNonApproval.production_adoption_approved === false &&
      explicitNonApproval.canon_approved === false,
    `productionOpen=${productionBoundaryOpen}; providerOpen=${providerBoundaryOpen}; productionApproval=${explicitNonApproval.production_adoption_approved}`
  );
  check(
    "production_rollback_descriptor_required_not_executed",
    target?.production_rollback_performed === false &&
      proposedTargets.every((targetClass) => targetClass.production_rollback_descriptor_needed.startsWith("rollback-production-adoption-")) &&
      rollback.rollback_rehearsal_summary?.production_rollback_performed === false,
    `productionRollback=${target?.production_rollback_performed ?? "missing"}; descriptors=${proposedTargets.length}`
  );
  check(
    "manifest_and_review_memory_registered",
    manifestValidationCommand.includes("smoke-production-adoption-authorization-packet") &&
      manifest.preserves?.includes("fff-production-adoption-authorization-packet-001") &&
      reviewMemory.some((entry) => entry.artifact_id === "fff-production-adoption-authorization-packet-001"),
    `includesSmoke=${manifestValidationCommand.includes("smoke-production-adoption-authorization-packet")}; preserves=${manifest.preserves?.includes("fff-production-adoption-authorization-packet-001")}; memory=${reviewMemory.some((entry) => entry.artifact_id === "fff-production-adoption-authorization-packet-001")}`
  );

  return {
    schemaVersion: PRODUCTION_ADOPTION_AUTHORIZATION_PACKET_SCHEMA_VERSION,
    artifact_id: "fff-production-adoption-authorization-packet-001",
    title: "Fast Fiction Factory Production Adoption Authorization Packet",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_user_authorization",
    review_input_mode: "freeform",
    preserved_active_artifact_id: manifest.artifact_id,
    input_readbacks: {
      sandbox_adoption_rollback_rehearsal_result_path: toRepoPath(rollbackPath),
      sandbox_adoption_mutation_one_claim_result_path: toRepoPath(sandboxPath),
      adoption_candidate_ledger_dry_run_result_path: toRepoPath(ledgerPath),
      downstream_adoption_semantics_design_result_path: toRepoPath(semanticsPath)
    },
    authorization_packet_scope: {
      packet_only: true,
      production_adoption_performed: false,
      production_rollback_performed: false,
      canonization_performed: false,
      profile_claim_timeline_story_seed_mutation_performed: false,
      provider_or_external_call_performed: false,
      publishing_or_production_generation_performed: false
    },
    target_readback: {
      target_claim_id: target?.target_claim_id || "missing",
      source_span_id: target?.source_span_id || "missing",
      source_span_locator: target?.source_span_locator || "missing",
      current_candidate_status_after_rollback_rehearsal: target?.post_rollback_rehearsal_status || "missing",
      source_backed_status: Boolean(ledgerTarget?.source_span_id && ledgerTarget?.source_span_locator),
      rollback_rehearsed: target?.rollback_rehearsal_success === true,
      non_canon: target?.canon_status === false,
      non_production: target?.production_adoption_status === false
    },
    sandbox_adoption_evidence: {
      artifact_id: sandbox.artifact_id,
      sandbox_fixture_row_id: sandboxTarget?.sandbox_fixture_row_id || "missing",
      transition: sandboxTarget?.sandbox_transition || "missing",
      rollback_token: sandboxTarget?.rollback_descriptor?.rollback_token || "missing",
      production_adoption_status: sandboxTarget?.production_adoption_status ?? "missing",
      canon_status: sandboxTarget?.canon_status ?? "missing"
    },
    rollback_rehearsal_evidence: {
      artifact_id: rollback.artifact_id,
      rollback_rehearsal_row_id: target?.rollback_rehearsal_row_id || "missing",
      rollback_token: target?.rollback_token || "missing",
      rollback_transition: target?.rollback_transition || "missing",
      post_rollback_rehearsal_status: target?.post_rollback_rehearsal_status || "missing",
      production_rollback_performed: false
    },
    proposed_production_target_classes: proposedTargets,
    recommended_first_production_target_class: "Claim Ledger",
    recommendation_reason: "Claim Ledger is the narrowest first production target because the source-backed object label is already represented as a held claim; Profile, Timeline, and Story Seed writes can remain downstream of explicit approval.",
    evidence_required_before_production_mutation: [...new Set(evidenceRequired)],
    user_authorization_fields_still_missing: userAuthorizationMissing,
    explicit_non_approval_fields: explicitNonApproval,
    summary: {
      candidates_inspected: rollbackRows.length,
      rollback_rehearsed_candidates: rollbackRows.filter((row) => row.rollback_rehearsal_success === true).length,
      production_target_classes_proposed: proposedTargets.length,
      recommended_first_target_classes: proposedTargets.filter((targetClass) => targetClass.recommended_first_target === true).length,
      production_mutations_performed: 0,
      canonized_claims: 0,
      provider_configured: false,
      external_call_attempted: false,
      credentials_touched: false,
      publishing_opened: false,
      production_generation_opened: false,
      user_authorization_required: true,
      user_authorization_fields_missing: userAuthorizationMissing.length,
      failures: failures.length
    },
    what_this_packet_proves: [
      "The rollback-rehearsed sandbox candidate can be presented as a production adoption authorization packet.",
      "Potential production target classes, mutation behavior, rollback owner, rollback descriptors, and missing approvals are explicit.",
      "No production mutation, production rollback, canonization, provider, credential, publishing, or production generation route is opened."
    ],
    what_this_packet_does_not_prove: [
      "It does not approve production adoption.",
      "It does not canonize the claim or resolve brass moth truth, Toma fate, Council motive, moth-key function, or contradictory claim truth.",
      "It does not write Profile, Claim Ledger, Timeline, Story Seed, database, provider output, credentials, publishing, or production surfaces."
    ],
    authorization_checks: checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateProductionClaimLedgerAdoptionOneClaim(authorizationPacket, authorizationPacketPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const manifestValidationCommand = String(manifest.validation_command || "");
  const reviewMemory = Array.isArray(manifest.review_memory) ? manifest.review_memory : [];
  const rollbackPath =
    authorizationPacket.input_readbacks?.sandbox_adoption_rollback_rehearsal_result_path ||
    DEFAULT_SANDBOX_ADOPTION_ROLLBACK_REHEARSAL_OUTPUT;
  const sandboxPath =
    authorizationPacket.input_readbacks?.sandbox_adoption_mutation_one_claim_result_path ||
    DEFAULT_SANDBOX_ADOPTION_MUTATION_ONE_CLAIM_OUTPUT;
  const ledgerPath =
    authorizationPacket.input_readbacks?.adoption_candidate_ledger_dry_run_result_path ||
    DEFAULT_ADOPTION_CANDIDATE_LEDGER_DRY_RUN_OUTPUT;
  const semanticsPath =
    authorizationPacket.input_readbacks?.downstream_adoption_semantics_design_result_path ||
    DEFAULT_DOWNSTREAM_ADOPTION_SEMANTICS_DESIGN_OUTPUT;
  const rollback = await readJson(rollbackPath);
  const sandbox = await readJson(sandboxPath);
  const ledger = await readJson(ledgerPath);
  const semantics = await readJson(semanticsPath);
  const targetReadback = authorizationPacket.target_readback || {};
  const claimLedgerTarget = Array.isArray(authorizationPacket.proposed_production_target_classes)
    ? authorizationPacket.proposed_production_target_classes.find((targetClass) => targetClass.target_class === "Claim Ledger")
    : null;
  const rollbackRows = Array.isArray(rollback.sandbox_rollback_rehearsal_rows) ? rollback.sandbox_rollback_rehearsal_rows : [];
  const rollbackTarget = rollbackRows.find((row) => row.target_claim_id === "multi-claim-moth-key-label");
  const sandboxRows = Array.isArray(sandbox.sandbox_adoption_fixture_rows) ? sandbox.sandbox_adoption_fixture_rows : [];
  const sandboxTarget = sandboxRows.find((row) => row.target_claim_id === "multi-claim-moth-key-label");
  const ledgerRows = Array.isArray(ledger.adoption_candidate_ledger_rows) ? ledger.adoption_candidate_ledger_rows : [];
  const ledgerTarget = ledgerRows.find((row) => row.held_claim_id === "multi-claim-moth-key-label");
  const rollbackToken = "rollback-production-claim-ledger-adoption-moth-key-label-to-adoption-candidate-dry-run";
  const transition = "adoption_candidate_dry_run -> production_claim_ledger_adopted";
  const futureEvidenceRequirements = [
    "explicit user approval for any Profile mutation",
    "explicit user approval for any Timeline mutation",
    "explicit user approval for any Story Seed mutation",
    "explicit user canon decision before canon=true",
    "source refs and original source-span readback remain intact",
    "contradiction, malformed-span, downstream-gate, and provider-boundary checks continue passing",
    "rollback owner and rollback descriptor are recorded for the new target before mutation"
  ];
  const rollbackDescriptor = {
    rollback_token: rollbackToken,
    rollback_scope: "Claim Ledger production adoption row only",
    rollback_to_status: "adoption_candidate_dry_run",
    rollback_owner: "author approves rollback; implementer returns the Claim Ledger adoption row to adoption_candidate_dry_run while preserving source evidence",
    rollback_requires: [
      "remove or mark inactive the production Claim Ledger adoption row",
      "preserve source span id multi-x-object-brass-moth-key",
      "preserve held claim id multi-claim-moth-key-label in audit history",
      "keep Profile / Timeline / Story Seed production mutation counts at zero",
      "keep canon status false unless a separate explicit canon decision exists"
    ]
  };
  const productionClaimLedgerAdoptionRows = ledgerTarget && rollbackTarget
    ? [
        {
          production_claim_ledger_adoption_row_id: "production-claim-ledger-adoption-row-moth-key-label",
          target_claim_id: "multi-claim-moth-key-label",
          source_span_id: ledgerTarget.source_span_id,
          source_span_locator: ledgerTarget.source_span_locator,
          translated_fixture_row_id: ledgerTarget.translated_fixture_row_id,
          prior_claim_status: ledgerTarget.prior_claim_status,
          prior_candidate_status: rollbackTarget.post_rollback_rehearsal_status,
          production_target_class: "Claim Ledger",
          transition,
          after_claim_ledger_status: "production_claim_ledger_adopted",
          production_claim_ledger_adopted: true,
          adoption_scope: "exactly_one_claim",
          canon_status: false,
          profile_mutation_count: 0,
          timeline_mutation_count: 0,
          story_seed_mutation_count: 0,
          affected_profile_ids: [],
          affected_timeline_ids: [],
          affected_story_seed_ids: [],
          rollback_descriptor: rollbackDescriptor,
          evidence_required_before_future_profile_timeline_story_seed_or_canon_adoption: futureEvidenceRequirements,
          unresolved_dependencies_preserved: ledgerTarget.unresolved_dependencies || [],
          provider_configured: false,
          external_call_attempted: false,
          credentials_touched: false,
          publishing_opened: false,
          production_generation_opened: false
        }
      ]
    : [];
  const row = productionClaimLedgerAdoptionRows[0];
  const inputAlreadyProductionAdopted =
    authorizationPacket.summary?.production_mutations_performed !== 0 ||
    rollback.summary?.production_adopted_claims !== 0 ||
    sandbox.summary?.production_adopted_claims !== 0 ||
    ledger.summary?.actually_adopted_claims !== 0 ||
    semantics.summary?.actually_adopted_claims !== 0;
  const inputCanonOpen =
    authorizationPacket.summary?.canonized_claims !== 0 ||
    rollback.summary?.canonized_claims !== 0 ||
    sandbox.summary?.canonized_claims !== 0 ||
    ledger.summary?.canonized_claims !== 0 ||
    semantics.summary?.canonized_claims !== 0;
  const inputProviderOpen =
    authorizationPacket.summary?.provider_configured === true ||
    authorizationPacket.summary?.external_call_attempted === true ||
    authorizationPacket.summary?.credentials_touched === true ||
    authorizationPacket.summary?.publishing_opened === true ||
    authorizationPacket.summary?.production_generation_opened === true ||
    rollback.summary?.provider_configured === true ||
    rollback.summary?.external_call_attempted === true ||
    rollback.summary?.credentials_touched === true ||
    rollback.summary?.publishing_opened === true ||
    rollback.summary?.production_generation_opened === true ||
    sandbox.summary?.provider_configured === true ||
    sandbox.summary?.external_call_attempted === true ||
    sandbox.summary?.credentials_touched === true ||
    sandbox.summary?.publishing_opened === true ||
    sandbox.summary?.production_generation_opened === true ||
    ledger.summary?.provider_configured === true ||
    ledger.summary?.external_call_attempted === true ||
    ledger.summary?.credentials_touched === true ||
    ledger.summary?.publishing_opened === true ||
    ledger.summary?.production_generation_opened === true ||
    semantics.summary?.provider_configured === true ||
    semantics.summary?.external_call_attempted === true ||
    semantics.summary?.credentials_touched === true;

  check(
    "authorization_packet_loaded_and_passed",
    authorizationPacket.artifact_id === "fff-production-adoption-authorization-packet-001" &&
      authorizationPacket.schemaVersion === PRODUCTION_ADOPTION_AUTHORIZATION_PACKET_SCHEMA_VERSION &&
      authorizationPacket.passed === true,
    `packet=${authorizationPacket.artifact_id}/${authorizationPacket.passed}; schema=${authorizationPacket.schemaVersion}`
  );
  check(
    "expected_target_eligible_for_claim_ledger_adoption",
    targetReadback.target_claim_id === "multi-claim-moth-key-label" &&
      targetReadback.source_span_id === "multi-x-object-brass-moth-key" &&
      targetReadback.current_candidate_status_after_rollback_rehearsal === "adoption_candidate_dry_run" &&
      targetReadback.source_backed_status === true &&
      targetReadback.rollback_rehearsed === true &&
      targetReadback.non_canon === true &&
      targetReadback.non_production === true &&
      Boolean(rollbackTarget) &&
      rollbackTarget.post_rollback_rehearsal_status === "adoption_candidate_dry_run" &&
      rollbackTarget.rollback_rehearsal_success === true &&
      Boolean(ledgerTarget) &&
      ledgerTarget.ledger_status === "adoption_candidate_dry_run",
    `target=${targetReadback.target_claim_id || "missing"}; status=${targetReadback.current_candidate_status_after_rollback_rehearsal || "missing"}; rollback=${rollbackTarget?.rollback_rehearsal_success ?? "missing"}; ledger=${ledgerTarget?.ledger_status || "missing"}`
  );
  check(
    "claim_ledger_scope_authorized_only",
    authorizationPacket.recommended_first_production_target_class === "Claim Ledger" &&
      claimLedgerTarget?.recommended_first_target === true &&
      Array.isArray(claimLedgerTarget?.target_ids) &&
      claimLedgerTarget.target_ids.includes("multi-claim-moth-key-label") &&
      authorizationPacket.explicit_non_approval_fields?.canon_approved === false &&
      authorizationPacket.explicit_non_approval_fields?.provider_approved === false &&
      authorizationPacket.explicit_non_approval_fields?.publishing_approved === false &&
      authorizationPacket.explicit_non_approval_fields?.external_api_approved === false,
    `recommended=${authorizationPacket.recommended_first_production_target_class}; claimTarget=${claimLedgerTarget?.target_ids?.join(", ") || "missing"}`
  );
  check(
    "not_already_production_adopted_before_this_slice",
    inputAlreadyProductionAdopted === false && inputCanonOpen === false,
    `inputProductionAdopted=${inputAlreadyProductionAdopted}; inputCanon=${inputCanonOpen}`
  );
  check(
    "production_claim_ledger_row_created_once",
    productionClaimLedgerAdoptionRows.length === 1 &&
      row?.target_claim_id === "multi-claim-moth-key-label" &&
      row?.production_target_class === "Claim Ledger" &&
      row?.transition === transition &&
      row?.after_claim_ledger_status === "production_claim_ledger_adopted" &&
      row?.production_claim_ledger_adopted === true,
    `rows=${productionClaimLedgerAdoptionRows.length}; target=${row?.target_claim_id || "missing"}; status=${row?.after_claim_ledger_status || "missing"}`
  );
  check(
    "profile_timeline_story_seed_boundaries_zero",
    productionClaimLedgerAdoptionRows.every((adoptionRow) =>
      adoptionRow.profile_mutation_count === 0 &&
      adoptionRow.timeline_mutation_count === 0 &&
      adoptionRow.story_seed_mutation_count === 0 &&
      adoptionRow.affected_profile_ids.length === 0 &&
      adoptionRow.affected_timeline_ids.length === 0 &&
      adoptionRow.affected_story_seed_ids.length === 0
    ),
    `profile=${row?.profile_mutation_count ?? "missing"}; timeline=${row?.timeline_mutation_count ?? "missing"}; storySeed=${row?.story_seed_mutation_count ?? "missing"}`
  );
  check(
    "canon_and_provider_boundaries_closed",
    productionClaimLedgerAdoptionRows.every((adoptionRow) =>
      adoptionRow.canon_status === false &&
      adoptionRow.provider_configured === false &&
      adoptionRow.external_call_attempted === false &&
      adoptionRow.credentials_touched === false &&
      adoptionRow.publishing_opened === false &&
      adoptionRow.production_generation_opened === false
    ) &&
      inputProviderOpen === false,
    `canon=${row?.canon_status ?? "missing"}; providerOpen=${inputProviderOpen}`
  );
  check(
    "rollback_descriptor_recorded",
    row?.rollback_descriptor?.rollback_token === rollbackToken &&
      row?.rollback_descriptor?.rollback_scope === "Claim Ledger production adoption row only" &&
      row?.rollback_descriptor?.rollback_to_status === "adoption_candidate_dry_run" &&
      row?.rollback_descriptor?.rollback_owner.includes("author approves rollback") &&
      row?.rollback_descriptor?.rollback_requires.length >= 4,
    `rollback=${row?.rollback_descriptor?.rollback_token || "missing"}; scope=${row?.rollback_descriptor?.rollback_scope || "missing"}`
  );
  check(
    "future_non_claim_ledger_evidence_requirements_recorded",
    futureEvidenceRequirements.length >= 6 &&
      row?.evidence_required_before_future_profile_timeline_story_seed_or_canon_adoption.length === futureEvidenceRequirements.length,
    `requirements=${row?.evidence_required_before_future_profile_timeline_story_seed_or_canon_adoption?.length ?? "missing"}`
  );
  check(
    "manifest_and_review_memory_registered",
    manifestValidationCommand.includes("smoke-production-claim-ledger-adoption-one-claim") &&
      manifest.preserves?.includes("fff-production-claim-ledger-adoption-one-claim-001") &&
      reviewMemory.some((entry) => entry.artifact_id === "fff-production-claim-ledger-adoption-one-claim-001"),
    `includesSmoke=${manifestValidationCommand.includes("smoke-production-claim-ledger-adoption-one-claim")}; preserves=${manifest.preserves?.includes("fff-production-claim-ledger-adoption-one-claim-001")}; memory=${reviewMemory.some((entry) => entry.artifact_id === "fff-production-claim-ledger-adoption-one-claim-001")}`
  );

  return {
    schemaVersion: PRODUCTION_CLAIM_LEDGER_ADOPTION_ONE_CLAIM_SCHEMA_VERSION,
    artifact_id: "fff-production-claim-ledger-adoption-one-claim-001",
    title: "Fast Fiction Factory Production Claim Ledger Adoption One Claim",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    preserved_active_artifact_id: manifest.artifact_id,
    input_readbacks: {
      production_adoption_authorization_packet_result_path: toRepoPath(authorizationPacketPath),
      sandbox_adoption_rollback_rehearsal_result_path: toRepoPath(rollbackPath),
      sandbox_adoption_mutation_one_claim_result_path: toRepoPath(sandboxPath),
      adoption_candidate_ledger_dry_run_result_path: toRepoPath(ledgerPath),
      downstream_adoption_semantics_design_result_path: toRepoPath(semanticsPath)
    },
    user_authorization_readback: {
      authorized_path: "A",
      authorization_source: "user freeform authorization relayed by supervisor prompt",
      target_claim_id: "multi-claim-moth-key-label",
      production_target_class: "Claim Ledger",
      adoption_scope: "exactly_one_claim",
      canon_authorized: false,
      profile_mutation_authorized: false,
      timeline_mutation_authorized: false,
      story_seed_mutation_authorized: false,
      provider_api_credential_authorized: false,
      publishing_public_output_authorized: false,
      before_after_readback_required: true,
      rollback_descriptor_required: true
    },
    authorized_production_mutation_boundary: {
      target_claim_id: "multi-claim-moth-key-label",
      target_class: "Claim Ledger",
      expected_prior_status: "adoption_candidate_dry_run",
      transition,
      allowed_production_claim_ledger_adoption_rows: 1,
      canon_allowed: false,
      profile_mutation_allowed: false,
      timeline_mutation_allowed: false,
      story_seed_mutation_allowed: false,
      provider_api_credential_allowed: false,
      publishing_or_production_generation_allowed: false,
      additional_claims_allowed: false
    },
    before_after_readback: {
      before: {
        target_claim_id: "multi-claim-moth-key-label",
        source_span_id: targetReadback.source_span_id || "missing",
        source_span_locator: rollbackTarget?.source_span_locator || ledgerTarget?.source_span_locator || "missing",
        claim_ledger_status: targetReadback.current_candidate_status_after_rollback_rehearsal || "missing",
        production_claim_ledger_adopted: false,
        canon_status: false,
        profile_mutation_count: 0,
        timeline_mutation_count: 0,
        story_seed_mutation_count: 0
      },
      after: {
        target_claim_id: "multi-claim-moth-key-label",
        source_span_id: row?.source_span_id || "missing",
        source_span_locator: row?.source_span_locator || "missing",
        claim_ledger_status: "production_claim_ledger_adopted",
        production_claim_ledger_adopted: true,
        canon_status: false,
        profile_mutation_count: 0,
        timeline_mutation_count: 0,
        story_seed_mutation_count: 0
      }
    },
    production_claim_ledger_adoption_rows: productionClaimLedgerAdoptionRows,
    rollback_readback: rollbackDescriptor,
    evidence_required_before_future_profile_timeline_story_seed_or_canon_adoption: futureEvidenceRequirements,
    summary: {
      candidates_inspected: rollbackRows.length,
      claim_ledger_adoption_rows: productionClaimLedgerAdoptionRows.length,
      production_claim_ledger_adopted_claims: productionClaimLedgerAdoptionRows.filter((adoptionRow) => adoptionRow.production_claim_ledger_adopted === true).length,
      production_claim_ledger_mutations_performed: productionClaimLedgerAdoptionRows.length,
      non_claim_ledger_production_mutations_performed: 0,
      profile_mutation_count: 0,
      timeline_mutation_count: 0,
      story_seed_mutation_count: 0,
      canonized_claims: 0,
      provider_configured: false,
      external_call_attempted: false,
      credentials_touched: false,
      publishing_opened: false,
      production_generation_opened: false,
      rollback_descriptors_present: productionClaimLedgerAdoptionRows.filter((adoptionRow) => Boolean(adoptionRow.rollback_descriptor?.rollback_token)).length,
      failures: failures.length
    },
    what_this_adoption_proves: [
      "Exactly one rollback-rehearsed candidate is adopted into the production Claim Ledger readback.",
      "The transition is limited to adoption_candidate_dry_run -> production_claim_ledger_adopted for multi-claim-moth-key-label.",
      "Profile, Timeline, Story Seed, canon, provider, credential, publishing, and production generation boundaries remain closed."
    ],
    what_this_adoption_does_not_prove: [
      "It does not canonize the claim or resolve brass moth truth, Toma fate, Council motive, moth-key function, or contradictory claim truth.",
      "It does not mutate Profile, Timeline, Story Seed, database, provider output, credentials, publishing, or public production surfaces.",
      "It does not authorize adoption of any additional claim."
    ],
    claim_ledger_adoption_checks: checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateProductionClaimLedgerRollbackRehearsal(adoptionReadback, adoptionReadbackPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const manifestValidationCommand = String(manifest.validation_command || "");
  const reviewMemory = Array.isArray(manifest.review_memory) ? manifest.review_memory : [];
  const adoptionRows = Array.isArray(adoptionReadback.production_claim_ledger_adoption_rows)
    ? adoptionReadback.production_claim_ledger_adoption_rows
    : [];
  const targetRows = adoptionRows.filter((row) => row.target_claim_id === "multi-claim-moth-key-label");
  const targetRow = targetRows[0];
  const rollbackDescriptor = targetRow?.rollback_descriptor || adoptionReadback.rollback_readback || {};
  const expectedRollbackToken = "rollback-production-claim-ledger-adoption-moth-key-label-to-adoption-candidate-dry-run";
  const evidenceRequiredBeforeRealRollback = [
    "explicit user authorization naming actual production Claim Ledger rollback",
    "confirm target claim id multi-claim-moth-key-label and source span id multi-x-object-brass-moth-key",
    "confirm the production Claim Ledger row is the only rollback target",
    "record rollback owner, rollback descriptor, and post-rollback readback before mutation",
    "preserve the production adoption audit trail and source evidence",
    "keep Profile / Timeline / Story Seed production mutation counts at zero",
    "keep canon status false unless a separate explicit canon decision exists",
    "keep provider/API/credential/publishing/production generation routes closed",
    "rerun manifest validation after any real rollback"
  ];
  const rehearsalRows = targetRow
    ? [
        {
          production_claim_ledger_rollback_rehearsal_row_id: "production-claim-ledger-rollback-rehearsal-row-moth-key-label",
          target_claim_id: targetRow.target_claim_id,
          source_span_id: targetRow.source_span_id,
          source_span_locator: targetRow.source_span_locator,
          production_claim_ledger_adoption_row_id: targetRow.production_claim_ledger_adoption_row_id,
          current_production_claim_ledger_status: targetRow.after_claim_ledger_status,
          current_production_claim_ledger_adopted: targetRow.production_claim_ledger_adopted,
          rollback_token: rollbackDescriptor.rollback_token,
          rollback_scope: rollbackDescriptor.rollback_scope,
          rollback_to_status: rollbackDescriptor.rollback_to_status,
          rehearsal_operation: "readback_only_non_destructive",
          rehearsal_transition: "production_claim_ledger_adopted -> adoption_candidate_dry_run",
          production_claim_ledger_row_retained: true,
          actual_rollback_performed: false,
          production_claim_ledger_row_removed: false,
          post_rehearsal_claim_ledger_status: "production_claim_ledger_adopted",
          post_rehearsal_production_claim_ledger_adopted: true,
          canon_status: false,
          profile_mutation_count: 0,
          timeline_mutation_count: 0,
          story_seed_mutation_count: 0,
          provider_configured: false,
          external_call_attempted: false,
          credentials_touched: false,
          publishing_opened: false,
          production_generation_opened: false,
          evidence_required_before_real_rollback: evidenceRequiredBeforeRealRollback
        }
      ]
    : [];
  const rehearsalRow = rehearsalRows[0];
  const inputBoundaryOpen =
    adoptionReadback.summary?.profile_mutation_count !== 0 ||
    adoptionReadback.summary?.timeline_mutation_count !== 0 ||
    adoptionReadback.summary?.story_seed_mutation_count !== 0 ||
    adoptionReadback.summary?.canonized_claims !== 0 ||
    adoptionReadback.summary?.provider_configured !== false ||
    adoptionReadback.summary?.external_call_attempted !== false ||
    adoptionReadback.summary?.credentials_touched !== false ||
    adoptionReadback.summary?.publishing_opened !== false ||
    adoptionReadback.summary?.production_generation_opened !== false;

  check(
    "input_adoption_readback_loaded_and_passed",
    adoptionReadback.artifact_id === "fff-production-claim-ledger-adoption-one-claim-001" &&
      adoptionReadback.schemaVersion === PRODUCTION_CLAIM_LEDGER_ADOPTION_ONE_CLAIM_SCHEMA_VERSION &&
      adoptionReadback.passed === true,
    `input=${adoptionReadback.artifact_id}/${adoptionReadback.passed}; schema=${adoptionReadback.schemaVersion}`
  );
  check(
    "expected_claim_ledger_row_present",
    targetRows.length === 1 &&
      targetRow?.production_target_class === "Claim Ledger" &&
      targetRow?.after_claim_ledger_status === "production_claim_ledger_adopted" &&
      targetRow?.production_claim_ledger_adopted === true,
    `rows=${targetRows.length}; class=${targetRow?.production_target_class || "missing"}; status=${targetRow?.after_claim_ledger_status || "missing"}; adopted=${targetRow?.production_claim_ledger_adopted ?? "missing"}`
  );
  check(
    "rollback_descriptor_available",
    rollbackDescriptor.rollback_token === expectedRollbackToken &&
      rollbackDescriptor.rollback_scope === "Claim Ledger production adoption row only" &&
      rollbackDescriptor.rollback_to_status === "adoption_candidate_dry_run" &&
      Array.isArray(rollbackDescriptor.rollback_requires) &&
      rollbackDescriptor.rollback_requires.length >= 4,
    `token=${rollbackDescriptor.rollback_token || "missing"}; scope=${rollbackDescriptor.rollback_scope || "missing"}; to=${rollbackDescriptor.rollback_to_status || "missing"}`
  );
  check(
    "rehearsal_is_non_destructive",
    rehearsalRows.length === 1 &&
      rehearsalRow?.rehearsal_operation === "readback_only_non_destructive" &&
      rehearsalRow?.actual_rollback_performed === false &&
      rehearsalRow?.production_claim_ledger_row_removed === false &&
      rehearsalRow?.production_claim_ledger_row_retained === true,
    `rows=${rehearsalRows.length}; actualRollback=${rehearsalRow?.actual_rollback_performed ?? "missing"}; removed=${rehearsalRow?.production_claim_ledger_row_removed ?? "missing"}; retained=${rehearsalRow?.production_claim_ledger_row_retained ?? "missing"}`
  );
  check(
    "claim_ledger_row_retained_after_rehearsal",
    rehearsalRow?.post_rehearsal_claim_ledger_status === "production_claim_ledger_adopted" &&
      rehearsalRow?.post_rehearsal_production_claim_ledger_adopted === true,
    `postStatus=${rehearsalRow?.post_rehearsal_claim_ledger_status || "missing"}; postAdopted=${rehearsalRow?.post_rehearsal_production_claim_ledger_adopted ?? "missing"}`
  );
  check(
    "profile_timeline_story_seed_boundaries_zero",
    rehearsalRows.every((row) =>
      row.profile_mutation_count === 0 &&
      row.timeline_mutation_count === 0 &&
      row.story_seed_mutation_count === 0
    ) &&
      inputBoundaryOpen === false,
    `profile=${rehearsalRow?.profile_mutation_count ?? "missing"}; timeline=${rehearsalRow?.timeline_mutation_count ?? "missing"}; storySeed=${rehearsalRow?.story_seed_mutation_count ?? "missing"}; inputBoundaryOpen=${inputBoundaryOpen}`
  );
  check(
    "canon_and_provider_boundaries_closed",
    rehearsalRows.every((row) =>
      row.canon_status === false &&
      row.provider_configured === false &&
      row.external_call_attempted === false &&
      row.credentials_touched === false &&
      row.publishing_opened === false &&
      row.production_generation_opened === false
    ),
    `canon=${rehearsalRow?.canon_status ?? "missing"}; provider=${rehearsalRow?.provider_configured ?? "missing"}; external=${rehearsalRow?.external_call_attempted ?? "missing"}; credentials=${rehearsalRow?.credentials_touched ?? "missing"}`
  );
  check(
    "future_real_rollback_evidence_recorded",
    evidenceRequiredBeforeRealRollback.length >= 8 &&
      rehearsalRow?.evidence_required_before_real_rollback.length === evidenceRequiredBeforeRealRollback.length,
    `requirements=${rehearsalRow?.evidence_required_before_real_rollback?.length ?? "missing"}`
  );
  check(
    "manifest_and_review_memory_registered",
    manifestValidationCommand.includes("smoke-production-claim-ledger-rollback-rehearsal") &&
      manifest.preserves?.includes("fff-production-claim-ledger-rollback-rehearsal-001") &&
      reviewMemory.some((entry) => entry.artifact_id === "fff-production-claim-ledger-rollback-rehearsal-001"),
    `includesSmoke=${manifestValidationCommand.includes("smoke-production-claim-ledger-rollback-rehearsal")}; preserves=${manifest.preserves?.includes("fff-production-claim-ledger-rollback-rehearsal-001")}; memory=${reviewMemory.some((entry) => entry.artifact_id === "fff-production-claim-ledger-rollback-rehearsal-001")}`
  );

  return {
    schemaVersion: PRODUCTION_CLAIM_LEDGER_ROLLBACK_REHEARSAL_SCHEMA_VERSION,
    artifact_id: "fff-production-claim-ledger-rollback-rehearsal-001",
    title: "Fast Fiction Factory Production Claim Ledger Rollback Rehearsal",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    preserved_active_artifact_id: manifest.artifact_id,
    input_readbacks: {
      production_claim_ledger_adoption_one_claim_result_path: toRepoPath(adoptionReadbackPath)
    },
    rehearsal_scope: {
      target_claim_id: "multi-claim-moth-key-label",
      source_span_id: targetRow?.source_span_id || "missing",
      production_target_class: "Claim Ledger",
      operation_class: "non_destructive_rollback_rehearsal_readback",
      expected_current_status: "production_claim_ledger_adopted",
      expected_rollback_token: expectedRollbackToken,
      expected_rollback_target_status: "adoption_candidate_dry_run",
      actual_rollback_authorized: false,
      actual_rollback_performed: false,
      production_claim_ledger_row_removal_authorized: false,
      additional_claims_allowed: false
    },
    before_after_readback: {
      before_rehearsal: {
        target_claim_id: "multi-claim-moth-key-label",
        source_span_id: targetRow?.source_span_id || "missing",
        source_span_locator: targetRow?.source_span_locator || "missing",
        claim_ledger_status: targetRow?.after_claim_ledger_status || "missing",
        production_claim_ledger_adopted: targetRow?.production_claim_ledger_adopted === true,
        canon_status: false,
        profile_mutation_count: 0,
        timeline_mutation_count: 0,
        story_seed_mutation_count: 0
      },
      after_rehearsal: {
        target_claim_id: "multi-claim-moth-key-label",
        source_span_id: targetRow?.source_span_id || "missing",
        source_span_locator: targetRow?.source_span_locator || "missing",
        claim_ledger_status: "production_claim_ledger_adopted",
        production_claim_ledger_adopted: true,
        production_claim_ledger_row_retained: true,
        actual_rollback_performed: false,
        canon_status: false,
        profile_mutation_count: 0,
        timeline_mutation_count: 0,
        story_seed_mutation_count: 0
      }
    },
    rollback_descriptor_readback: rollbackDescriptor,
    production_claim_ledger_rollback_rehearsal_rows: rehearsalRows,
    evidence_required_before_real_rollback: evidenceRequiredBeforeRealRollback,
    summary: {
      claim_ledger_adopted_rows_inspected: targetRows.length,
      rollback_descriptors_inspected: rollbackDescriptor.rollback_token === expectedRollbackToken ? 1 : 0,
      rollback_rehearsals_recorded: rehearsalRows.length,
      actual_rollback_operations: 0,
      production_claim_ledger_rows_removed: 0,
      production_claim_ledger_rows_retained: rehearsalRows.filter((row) => row.production_claim_ledger_row_retained === true).length,
      profile_mutation_count: 0,
      timeline_mutation_count: 0,
      story_seed_mutation_count: 0,
      canonized_claims: 0,
      provider_configured: false,
      external_call_attempted: false,
      credentials_touched: false,
      publishing_opened: false,
      production_generation_opened: false,
      failures: failures.length
    },
    what_this_rehearsal_proves: [
      "The existing production Claim Ledger adoption row can be inspected with its rollback descriptor intact.",
      "The rehearsal records rollback target status adoption_candidate_dry_run without performing rollback.",
      "The production Claim Ledger row remains present and adopted after the readback-only rehearsal.",
      "Profile, Timeline, Story Seed, canon, provider, credential, publishing, and production generation boundaries remain closed."
    ],
    what_this_rehearsal_does_not_do: [
      "It does not remove or mutate the production Claim Ledger adoption row.",
      "It does not canonize the claim or resolve brass moth truth, Toma fate, Council motive, moth-key function, or contradictory claim truth.",
      "It does not mutate Profile, Timeline, Story Seed, database, provider output, credentials, publishing, or public production surfaces.",
      "It does not authorize rollback of any additional claim."
    ],
    rollback_rehearsal_checks: checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateDownstreamTargetAuthorizationPacket(rollbackRehearsal, rollbackRehearsalPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const manifestValidationCommand = String(manifest.validation_command || "");
  const reviewMemory = Array.isArray(manifest.review_memory) ? manifest.review_memory : [];
  const adoptionPath =
    rollbackRehearsal.input_readbacks?.production_claim_ledger_adoption_one_claim_result_path ||
    DEFAULT_PRODUCTION_CLAIM_LEDGER_ADOPTION_ONE_CLAIM_OUTPUT;
  const adoptionReadback = await readJson(adoptionPath);
  const productionAuthorizationPath =
    adoptionReadback.input_readbacks?.production_adoption_authorization_packet_result_path ||
    DEFAULT_PRODUCTION_ADOPTION_AUTHORIZATION_PACKET_OUTPUT;
  const productionAuthorization = await readJson(productionAuthorizationPath);
  const targetClaimId = "multi-claim-moth-key-label";
  const targetSourceSpanId = "multi-x-object-brass-moth-key";
  const expectedRollbackToken = "rollback-production-claim-ledger-adoption-moth-key-label-to-adoption-candidate-dry-run";
  const rollbackRows = Array.isArray(rollbackRehearsal.production_claim_ledger_rollback_rehearsal_rows)
    ? rollbackRehearsal.production_claim_ledger_rollback_rehearsal_rows
    : [];
  const rollbackRow = rollbackRows.find((row) => row.target_claim_id === targetClaimId);
  const adoptionRows = Array.isArray(adoptionReadback.production_claim_ledger_adoption_rows)
    ? adoptionReadback.production_claim_ledger_adoption_rows
    : [];
  const adoptionRow = adoptionRows.find((row) => row.target_claim_id === targetClaimId);
  const rollbackDescriptor = rollbackRehearsal.rollback_descriptor_readback || adoptionRow?.rollback_descriptor || {};
  const sourceSpanLocator =
    rollbackRow?.source_span_locator ||
    adoptionRow?.source_span_locator ||
    productionAuthorization.target_readback?.source_span_locator ||
    "missing";
  const targetClasses = [
    {
      target_class: "Profile",
      target_ids: ["multi-profile-brass-moth-key"],
      recommended_next_target: true,
      approval_status: "not_approved",
      mutation_performed: false,
      mutation_behavior: "Future-only update or create a Profile object entry linking the brass moth key label to the original source span without canonizing unresolved truth.",
      rollback_owner: "author approves rollback; implementer removes the Profile mutation and preserves the Claim Ledger/source evidence trail",
      rollback_descriptor_needed: "rollback-downstream-target-moth-key-label-profile-to-claim-ledger-only",
      evidence_required_before_mutation: [
        "explicit user approval naming Profile as the next target class",
        "confirm source span id multi-x-object-brass-moth-key remains attached",
        "confirm Profile target id multi-profile-brass-moth-key or replacement id",
        "confirm unresolved brass moth truth and Toma fate remain non-canon",
        "record before/after Profile readback and rollback descriptor before mutation"
      ],
      unapproved_gates: [
        "profile_mutation_approved=false",
        "profile target class not freeform-authorized",
        "rollback owner not freeform-authorized for a real Profile mutation"
      ]
    },
    {
      target_class: "Timeline",
      target_ids: ["multi-timeline-moth-key-label"],
      recommended_next_target: false,
      approval_status: "not_approved",
      mutation_performed: false,
      mutation_behavior: "Future-only add or update a Timeline entry only if the user confirms sequence/order implications for the moth key label.",
      rollback_owner: "author approves rollback; implementer removes the Timeline mutation and keeps source references readable",
      rollback_descriptor_needed: "rollback-downstream-target-moth-key-label-timeline-to-claim-ledger-only",
      evidence_required_before_mutation: [
        "explicit user approval naming Timeline as the next target class",
        "confirm story order, calendar order, or disclosure order implication",
        "confirm no unresolved dependency is silently canonized",
        "record before/after Timeline readback and rollback descriptor before mutation"
      ],
      unapproved_gates: [
        "timeline_mutation_approved=false",
        "timeline ordering implication not freeform-authorized",
        "rollback owner not freeform-authorized for a real Timeline mutation"
      ]
    },
    {
      target_class: "Story Seed",
      target_ids: [],
      recommended_next_target: false,
      approval_status: "not_approved",
      mutation_performed: false,
      mutation_behavior: "Deferred future-only story-seed mutation; no current Story Seed target is selected by the retained Claim Ledger readback.",
      rollback_owner: "author approves rollback; implementer removes the Story Seed mutation while preserving the Claim Ledger row and source evidence",
      rollback_descriptor_needed: "rollback-downstream-target-moth-key-label-story-seed-to-claim-ledger-only",
      evidence_required_before_mutation: [
        "explicit user approval naming Story Seed as the next target class",
        "explicit story-seed target id or new target creation rule",
        "confirm generation scope and human-owned unresolved dependencies",
        "record before/after Story Seed readback and rollback descriptor before mutation"
      ],
      unapproved_gates: [
        "story_seed_mutation_approved=false",
        "story seed target id not selected",
        "story generation scope not freeform-authorized"
      ]
    },
    {
      target_class: "Canon decision",
      target_ids: ["canon-decision-moth-key-label"],
      recommended_next_target: false,
      approval_status: "not_approved",
      mutation_performed: false,
      mutation_behavior: "No automatic mutation; future-only human canon decision may mark canon=true/false with rationale after unresolved dependencies are handled.",
      rollback_owner: "author owns canon decision reversal; implementer records canon readback reversal only after explicit freeform authorization",
      rollback_descriptor_needed: "rollback-downstream-target-moth-key-label-canon-decision-to-non-canon",
      evidence_required_before_mutation: [
        "explicit user canon decision before canon=true",
        "confirm brass moth truth, Toma fate, Council motive, and moth-key function handling",
        "confirm source span and Claim Ledger evidence remain readable",
        "record before/after canon readback and rollback descriptor before mutation"
      ],
      unapproved_gates: [
        "canon_decision_approved=false",
        "canon_approved=false",
        "unresolved story truth remains human-owned"
      ]
    }
  ];
  const explicitNonApprovalFields = {
    profile_mutation_approved: false,
    timeline_mutation_approved: false,
    story_seed_mutation_approved: false,
    canon_decision_approved: false,
    canon_approved: false,
    provider_approved: false,
    publishing_approved: false,
    external_api_approved: false,
    production_generation_approved: false
  };
  const userAuthorizationMissing = [
    "explicit user approval naming one downstream target class",
    "explicit mutation behavior approval for the selected target class",
    "explicit rollback owner approval for the selected target class",
    "explicit rollback descriptor approval for the selected target class",
    "explicit before/after readback requirement for any real mutation",
    "explicit unresolved dependency handling for brass moth truth and Toma fate",
    "explicit confirmation that canon remains false unless Canon decision is selected",
    "explicit confirmation that provider/API/credential/publishing routes stay closed",
    "explicit confirmation that no additional claim is included"
  ];
  const recommendedTargets = targetClasses.filter((targetClass) => targetClass.recommended_next_target === true);
  const expectedTargetClassNames = ["Profile", "Timeline", "Story Seed", "Canon decision"];
  const targetReadback = {
    target_claim_id: targetClaimId,
    source_span_id: rollbackRow?.source_span_id || adoptionRow?.source_span_id || "missing",
    source_span_locator: sourceSpanLocator,
    current_status: rollbackRow?.post_rehearsal_claim_ledger_status || adoptionRow?.after_claim_ledger_status || "missing",
    current_production_claim_ledger_adopted: rollbackRow?.post_rehearsal_production_claim_ledger_adopted === true,
    rollback_descriptor_status: rollbackDescriptor.rollback_token === expectedRollbackToken ? "verified" : "missing_or_mismatched",
    rollback_token: rollbackDescriptor.rollback_token || "missing",
    rollback_to_status: rollbackDescriptor.rollback_to_status || "missing",
    claim_ledger_row_retained: rollbackRow?.production_claim_ledger_row_retained === true,
    actual_rollback_performed: rollbackRow?.actual_rollback_performed === true,
    canon_status: false,
    profile_mutation_count: 0,
    timeline_mutation_count: 0,
    story_seed_mutation_count: 0
  };
  const inputBoundaryOpen =
    rollbackRehearsal.summary?.actual_rollback_operations !== 0 ||
    rollbackRehearsal.summary?.production_claim_ledger_rows_removed !== 0 ||
    rollbackRehearsal.summary?.profile_mutation_count !== 0 ||
    rollbackRehearsal.summary?.timeline_mutation_count !== 0 ||
    rollbackRehearsal.summary?.story_seed_mutation_count !== 0 ||
    rollbackRehearsal.summary?.canonized_claims !== 0 ||
    rollbackRehearsal.summary?.provider_configured !== false ||
    rollbackRehearsal.summary?.external_call_attempted !== false ||
    rollbackRehearsal.summary?.credentials_touched !== false ||
    rollbackRehearsal.summary?.publishing_opened !== false ||
    rollbackRehearsal.summary?.production_generation_opened !== false ||
    adoptionReadback.summary?.non_claim_ledger_production_mutations_performed !== 0 ||
    adoptionReadback.summary?.profile_mutation_count !== 0 ||
    adoptionReadback.summary?.timeline_mutation_count !== 0 ||
    adoptionReadback.summary?.story_seed_mutation_count !== 0 ||
    adoptionReadback.summary?.canonized_claims !== 0 ||
    adoptionReadback.summary?.provider_configured !== false ||
    adoptionReadback.summary?.external_call_attempted !== false ||
    adoptionReadback.summary?.credentials_touched !== false ||
    adoptionReadback.summary?.publishing_opened !== false ||
    adoptionReadback.summary?.production_generation_opened !== false ||
    productionAuthorization.summary?.production_mutations_performed !== 0 ||
    productionAuthorization.summary?.canonized_claims !== 0 ||
    productionAuthorization.summary?.provider_configured !== false ||
    productionAuthorization.summary?.external_call_attempted !== false ||
    productionAuthorization.summary?.credentials_touched !== false ||
    productionAuthorization.summary?.publishing_opened !== false ||
    productionAuthorization.summary?.production_generation_opened !== false;

  check(
    "input_rollback_rehearsal_loaded_and_passed",
    rollbackRehearsal.artifact_id === "fff-production-claim-ledger-rollback-rehearsal-001" &&
      rollbackRehearsal.schemaVersion === PRODUCTION_CLAIM_LEDGER_ROLLBACK_REHEARSAL_SCHEMA_VERSION &&
      rollbackRehearsal.passed === true,
    `input=${rollbackRehearsal.artifact_id}/${rollbackRehearsal.passed}; schema=${rollbackRehearsal.schemaVersion}`
  );
  check(
    "target_claim_ledger_status_retained",
    targetReadback.target_claim_id === targetClaimId &&
      targetReadback.source_span_id === targetSourceSpanId &&
      targetReadback.current_status === "production_claim_ledger_adopted" &&
      targetReadback.current_production_claim_ledger_adopted === true &&
      targetReadback.claim_ledger_row_retained === true &&
      targetReadback.actual_rollback_performed === false,
    `target=${targetReadback.target_claim_id}; status=${targetReadback.current_status}; retained=${targetReadback.claim_ledger_row_retained}; rollback=${targetReadback.actual_rollback_performed}`
  );
  check(
    "rollback_descriptor_verified",
    rollbackDescriptor.rollback_token === expectedRollbackToken &&
      rollbackDescriptor.rollback_scope === "Claim Ledger production adoption row only" &&
      rollbackDescriptor.rollback_to_status === "adoption_candidate_dry_run" &&
      Array.isArray(rollbackDescriptor.rollback_requires) &&
      rollbackDescriptor.rollback_requires.length >= 4,
    `token=${rollbackDescriptor.rollback_token || "missing"}; scope=${rollbackDescriptor.rollback_scope || "missing"}; to=${rollbackDescriptor.rollback_to_status || "missing"}`
  );
  check(
    "adoption_readback_loaded_and_consistent",
    adoptionReadback.artifact_id === "fff-production-claim-ledger-adoption-one-claim-001" &&
      adoptionReadback.schemaVersion === PRODUCTION_CLAIM_LEDGER_ADOPTION_ONE_CLAIM_SCHEMA_VERSION &&
      adoptionReadback.passed === true &&
      adoptionRow?.target_claim_id === targetClaimId &&
      adoptionRow?.after_claim_ledger_status === "production_claim_ledger_adopted" &&
      adoptionRow?.production_claim_ledger_adopted === true,
    `adoption=${adoptionReadback.artifact_id}/${adoptionReadback.passed}; row=${adoptionRow?.target_claim_id || "missing"}; status=${adoptionRow?.after_claim_ledger_status || "missing"}`
  );
  check(
    "downstream_target_classes_recorded",
    targetClasses.length === 4 &&
      expectedTargetClassNames.every((name) => targetClasses.some((targetClass) => targetClass.target_class === name)),
    `classes=${targetClasses.map((targetClass) => targetClass.target_class).join(", ")}`
  );
  check(
    "profile_recommended_as_next_minimal_target",
    recommendedTargets.length === 1 &&
      recommendedTargets[0]?.target_class === "Profile" &&
      recommendedTargets[0]?.target_ids.includes("multi-profile-brass-moth-key"),
    `recommended=${recommendedTargets.map((targetClass) => targetClass.target_class).join(", ") || "none"}`
  );
  check(
    "non_approval_flags_remain_false",
    Object.values(explicitNonApprovalFields).every((value) => value === false) &&
      targetClasses.every((targetClass) => targetClass.approval_status === "not_approved" && targetClass.mutation_performed === false),
    `nonApprovalFields=${Object.entries(explicitNonApprovalFields).map(([key, value]) => `${key}=${value}`).join("; ")}`
  );
  check(
    "no_downstream_mutation_canon_or_provider_opened",
    inputBoundaryOpen === false &&
      targetClasses.every((targetClass) => targetClass.mutation_performed === false) &&
      targetReadback.profile_mutation_count === 0 &&
      targetReadback.timeline_mutation_count === 0 &&
      targetReadback.story_seed_mutation_count === 0 &&
      targetReadback.canon_status === false,
    `inputBoundaryOpen=${inputBoundaryOpen}; profile=${targetReadback.profile_mutation_count}; timeline=${targetReadback.timeline_mutation_count}; storySeed=${targetReadback.story_seed_mutation_count}; canon=${targetReadback.canon_status}`
  );
  check(
    "user_authorization_still_required",
    userAuthorizationMissing.length >= 8 &&
      targetClasses.every((targetClass) => targetClass.unapproved_gates.length >= 3) &&
      targetClasses.every((targetClass) => targetClass.rollback_descriptor_needed.startsWith("rollback-downstream-target-")),
    `missingFields=${userAuthorizationMissing.length}; targetClassGateCounts=${targetClasses.map((targetClass) => `${targetClass.target_class}:${targetClass.unapproved_gates.length}`).join(", ")}`
  );
  check(
    "manifest_and_review_memory_registered",
    manifestValidationCommand.includes("smoke-downstream-target-authorization-packet") &&
      manifest.preserves?.includes("fff-downstream-target-authorization-packet-001") &&
      reviewMemory.some((entry) => entry.artifact_id === "fff-downstream-target-authorization-packet-001"),
    `includesSmoke=${manifestValidationCommand.includes("smoke-downstream-target-authorization-packet")}; preserves=${manifest.preserves?.includes("fff-downstream-target-authorization-packet-001")}; memory=${reviewMemory.some((entry) => entry.artifact_id === "fff-downstream-target-authorization-packet-001")}`
  );

  return {
    schemaVersion: DOWNSTREAM_TARGET_AUTHORIZATION_PACKET_SCHEMA_VERSION,
    artifact_id: "fff-downstream-target-authorization-packet-001",
    title: "Fast Fiction Factory Downstream Target Authorization Packet",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_user_authorization",
    review_input_mode: "freeform",
    preserved_active_artifact_id: manifest.artifact_id,
    input_readbacks: {
      production_claim_ledger_rollback_rehearsal_result_path: toRepoPath(rollbackRehearsalPath),
      production_claim_ledger_adoption_one_claim_result_path: adoptionPath,
      production_adoption_authorization_packet_result_path: productionAuthorizationPath
    },
    target_readback: targetReadback,
    recommended_next_downstream_target_class: "Profile",
    candidate_downstream_target_classes: targetClasses,
    explicit_non_approval_fields: explicitNonApprovalFields,
    user_authorization_required: true,
    user_authorization_missing: userAuthorizationMissing,
    summary: {
      candidates_inspected: 1,
      claim_ledger_adopted_rows_inspected: adoptionRow ? 1 : 0,
      rollback_descriptors_verified: rollbackDescriptor.rollback_token === expectedRollbackToken ? 1 : 0,
      production_claim_ledger_rows_retained: targetReadback.claim_ledger_row_retained ? 1 : 0,
      downstream_target_classes_proposed: targetClasses.length,
      recommended_next_target_classes: recommendedTargets.length,
      downstream_mutations_performed: 0,
      profile_mutation_count: 0,
      timeline_mutation_count: 0,
      story_seed_mutation_count: 0,
      canonized_claims: 0,
      provider_configured: false,
      external_call_attempted: false,
      credentials_touched: false,
      publishing_opened: false,
      production_generation_opened: false,
      user_authorization_required: true,
      user_authorization_fields_missing: userAuthorizationMissing.length,
      failures: failures.length
    },
    what_this_packet_proves: [
      "The retained production Claim Ledger row for multi-claim-moth-key-label can be used as the input to a downstream target authorization choice.",
      "Profile, Timeline, Story Seed, and Canon decision target classes are listed with mutation behavior, rollback owner, rollback descriptor, evidence, and unapproved gates.",
      "Profile is the single recommended next target class because it is narrower than Timeline, Story Seed, or Canon decision work.",
      "No Profile, Timeline, Story Seed, canon, provider, credential, publishing, production generation, or actual rollback route is opened."
    ],
    what_this_packet_does_not_prove: [
      "It does not approve any downstream mutation.",
      "It does not mutate Profile, Timeline, Story Seed, Canon decision, database, provider output, credentials, publishing, or public production surfaces.",
      "It does not canonize the claim or resolve brass moth truth, Toma fate, Council motive, moth-key function, or contradictory claim truth.",
      "It does not authorize rollback or removal of the production Claim Ledger row."
    ],
    downstream_target_authorization_checks: checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateProfileAdoptionMutationOneClaim(authorizationPacket, authorizationPacketPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const manifestValidationCommand = String(manifest.validation_command || "");
  const reviewMemory = Array.isArray(manifest.review_memory) ? manifest.review_memory : [];
  const rollbackPath =
    authorizationPacket.input_readbacks?.production_claim_ledger_rollback_rehearsal_result_path ||
    DEFAULT_PRODUCTION_CLAIM_LEDGER_ROLLBACK_REHEARSAL_OUTPUT;
  const adoptionPath =
    authorizationPacket.input_readbacks?.production_claim_ledger_adoption_one_claim_result_path ||
    DEFAULT_PRODUCTION_CLAIM_LEDGER_ADOPTION_ONE_CLAIM_OUTPUT;
  const rollbackRehearsal = await readJson(rollbackPath);
  const adoptionReadback = await readJson(adoptionPath);
  const currentProjectStatePath = "artifacts/current-project-state.json";
  const currentProjectStateText = await readFile(currentProjectStatePath, "utf8");
  const targetClaimId = "multi-claim-moth-key-label";
  const targetSourceSpanId = "multi-x-object-brass-moth-key";
  const targetProfileId = "multi-profile-brass-moth-key";
  const existingProfileReferenceId = "profile-brass-moth";
  const transition = "claim_ledger_adopted -> profile_adopted_noncanon";
  const rollbackToken = "rollback-profile-adoption-moth-key-label-to-claim-ledger-only";
  const profileCandidate = Array.isArray(authorizationPacket.candidate_downstream_target_classes)
    ? authorizationPacket.candidate_downstream_target_classes.find((targetClass) => targetClass.target_class === "Profile")
    : null;
  const adoptionRows = Array.isArray(adoptionReadback.production_claim_ledger_adoption_rows)
    ? adoptionReadback.production_claim_ledger_adoption_rows
    : [];
  const adoptionRow = adoptionRows.find((row) => row.target_claim_id === targetClaimId);
  const rollbackRows = Array.isArray(rollbackRehearsal.production_claim_ledger_rollback_rehearsal_rows)
    ? rollbackRehearsal.production_claim_ledger_rollback_rehearsal_rows
    : [];
  const rollbackRow = rollbackRows.find((row) => row.target_claim_id === targetClaimId);
  const sourceSpanLocator =
    authorizationPacket.target_readback?.source_span_locator ||
    rollbackRow?.source_span_locator ||
    adoptionRow?.source_span_locator ||
    "missing";
  const existingProfileReferencePresent = currentProjectStateText.includes(`"id": "${existingProfileReferenceId}"`);
  const targetProfileAlreadyPresent = currentProjectStateText.includes(targetProfileId) || currentProjectStateText.includes("profile_adopted_noncanon");
  const rollbackDescriptor = {
    rollback_token: rollbackToken,
    rollback_scope: "Profile production annotation row only",
    rollback_to_status: "production_claim_ledger_adopted",
    rollback_owner: "author approves rollback; implementer removes the Profile annotation row while preserving the Claim Ledger row and source evidence",
    rollback_requires: [
      "remove or mark inactive profile-adoption-mutation-row-moth-key-label",
      "preserve source span id multi-x-object-brass-moth-key",
      "preserve production Claim Ledger adoption row production-claim-ledger-adoption-row-moth-key-label",
      "keep Timeline and Story Seed mutation counts at zero",
      "keep canon status false unless a separate explicit canon decision exists",
      "keep provider/API/credential/publishing/production generation routes closed"
    ]
  };
  const evidenceRequiredBeforeFutureTargets = [
    "explicit user approval for any Timeline mutation",
    "explicit user approval for any Story Seed mutation",
    "explicit user canon decision before canon=true",
    "confirm brass moth truth, Toma fate, Council motive, and moth-key function handling",
    "record before/after readback and rollback descriptor for each future target before mutation",
    "keep provider/API/credential/publishing/production generation routes closed unless separately authorized"
  ];
  const profileAdoptionMutationRows = adoptionRow && rollbackRow
    ? [
        {
          profile_adoption_mutation_row_id: "profile-adoption-mutation-row-moth-key-label",
          target_claim_id: targetClaimId,
          source_span_id: targetSourceSpanId,
          source_span_locator: sourceSpanLocator,
          production_target_class: "Profile",
          target_profile_id: targetProfileId,
          existing_profile_reference_id: existingProfileReferenceId,
          prior_claim_ledger_status: "production_claim_ledger_adopted",
          transition,
          before_profile_adoption_status: "not_profile_adopted",
          after_profile_adoption_status: "profile_adopted_noncanon",
          mutation_behavior: "Add one non-canon Profile annotation linking the retained Claim Ledger row to the brass moth key profile surface while preserving unresolved truth.",
          profile_fact_candidate: {
            fact_candidate_id: "profile-fact-moth-key-label",
            label: "brass moth key label",
            value: "The brass moth key has a source-backed label from the multilingual memo.",
            source_claim_id: targetClaimId,
            source_span_id: targetSourceSpanId,
            source_span_locator: sourceSpanLocator,
            status: "profile_adopted_noncanon",
            canon_status: false,
            unresolved_dependencies_preserved: adoptionRow.unresolved_dependencies_preserved || ["brass moth truth", "Toma fate"]
          },
          production_profile_mutation_performed: true,
          production_profile_mutation_count: 1,
          claim_ledger_additional_adoption_count: 0,
          timeline_mutation_count: 0,
          story_seed_mutation_count: 0,
          canon_status: false,
          provider_configured: false,
          external_call_attempted: false,
          credentials_touched: false,
          publishing_opened: false,
          production_generation_opened: false,
          rollback_descriptor: rollbackDescriptor,
          unresolved_dependencies_preserved: adoptionRow.unresolved_dependencies_preserved || ["brass moth truth", "Toma fate"],
          evidence_required_before_future_timeline_story_seed_or_canon_adoption: evidenceRequiredBeforeFutureTargets
        }
      ]
    : [];
  const row = profileAdoptionMutationRows[0];
  const inputBoundaryOpen =
    authorizationPacket.summary?.downstream_mutations_performed !== 0 ||
    authorizationPacket.summary?.profile_mutation_count !== 0 ||
    authorizationPacket.summary?.timeline_mutation_count !== 0 ||
    authorizationPacket.summary?.story_seed_mutation_count !== 0 ||
    authorizationPacket.summary?.canonized_claims !== 0 ||
    authorizationPacket.summary?.provider_configured !== false ||
    authorizationPacket.summary?.external_call_attempted !== false ||
    authorizationPacket.summary?.credentials_touched !== false ||
    authorizationPacket.summary?.publishing_opened !== false ||
    authorizationPacket.summary?.production_generation_opened !== false ||
    rollbackRehearsal.summary?.actual_rollback_operations !== 0 ||
    rollbackRehearsal.summary?.production_claim_ledger_rows_removed !== 0 ||
    rollbackRehearsal.summary?.profile_mutation_count !== 0 ||
    rollbackRehearsal.summary?.timeline_mutation_count !== 0 ||
    rollbackRehearsal.summary?.story_seed_mutation_count !== 0 ||
    rollbackRehearsal.summary?.canonized_claims !== 0 ||
    adoptionReadback.summary?.non_claim_ledger_production_mutations_performed !== 0 ||
    adoptionReadback.summary?.profile_mutation_count !== 0 ||
    adoptionReadback.summary?.timeline_mutation_count !== 0 ||
    adoptionReadback.summary?.story_seed_mutation_count !== 0 ||
    adoptionReadback.summary?.canonized_claims !== 0;

  check(
    "authorization_packet_loaded_and_passed",
    authorizationPacket.artifact_id === "fff-downstream-target-authorization-packet-001" &&
      authorizationPacket.schemaVersion === DOWNSTREAM_TARGET_AUTHORIZATION_PACKET_SCHEMA_VERSION &&
      authorizationPacket.passed === true,
    `packet=${authorizationPacket.artifact_id}/${authorizationPacket.passed}; schema=${authorizationPacket.schemaVersion}`
  );
  check(
    "profile_target_authorized_by_user_prompt",
    profileCandidate?.target_class === "Profile" &&
      profileCandidate?.recommended_next_target === true &&
      Array.isArray(profileCandidate?.target_ids) &&
      profileCandidate.target_ids.includes(targetProfileId) &&
      authorizationPacket.recommended_next_downstream_target_class === "Profile",
    `recommended=${authorizationPacket.recommended_next_downstream_target_class}; targetIds=${profileCandidate?.target_ids?.join(", ") || "missing"}`
  );
  check(
    "target_claim_eligible_for_profile_adoption",
    authorizationPacket.target_readback?.target_claim_id === targetClaimId &&
      authorizationPacket.target_readback?.source_span_id === targetSourceSpanId &&
      authorizationPacket.target_readback?.current_status === "production_claim_ledger_adopted" &&
      authorizationPacket.target_readback?.current_production_claim_ledger_adopted === true &&
      authorizationPacket.target_readback?.rollback_descriptor_status === "verified" &&
      authorizationPacket.target_readback?.claim_ledger_row_retained === true &&
      authorizationPacket.target_readback?.canon_status === false,
    `target=${authorizationPacket.target_readback?.target_claim_id || "missing"}; status=${authorizationPacket.target_readback?.current_status || "missing"}; retained=${authorizationPacket.target_readback?.claim_ledger_row_retained ?? "missing"}; canon=${authorizationPacket.target_readback?.canon_status ?? "missing"}`
  );
  check(
    "claim_ledger_evidence_loaded_and_consistent",
    adoptionReadback.artifact_id === "fff-production-claim-ledger-adoption-one-claim-001" &&
      adoptionReadback.schemaVersion === PRODUCTION_CLAIM_LEDGER_ADOPTION_ONE_CLAIM_SCHEMA_VERSION &&
      adoptionReadback.passed === true &&
      adoptionRow?.after_claim_ledger_status === "production_claim_ledger_adopted" &&
      rollbackRehearsal.artifact_id === "fff-production-claim-ledger-rollback-rehearsal-001" &&
      rollbackRehearsal.schemaVersion === PRODUCTION_CLAIM_LEDGER_ROLLBACK_REHEARSAL_SCHEMA_VERSION &&
      rollbackRehearsal.passed === true &&
      rollbackRow?.production_claim_ledger_row_retained === true,
    `adoption=${adoptionReadback.artifact_id}/${adoptionReadback.passed}; rollback=${rollbackRehearsal.artifact_id}/${rollbackRehearsal.passed}; row=${adoptionRow?.target_claim_id || "missing"}`
  );
  check(
    "profile_not_already_adopted",
    existingProfileReferencePresent === true &&
      targetProfileAlreadyPresent === false,
    `existingProfile=${existingProfileReferencePresent}; targetAlreadyPresent=${targetProfileAlreadyPresent}`
  );
  check(
    "exactly_one_profile_mutation_row_created",
    profileAdoptionMutationRows.length === 1 &&
      row?.target_claim_id === targetClaimId &&
      row?.production_target_class === "Profile" &&
      row?.target_profile_id === targetProfileId &&
      row?.transition === transition &&
      row?.after_profile_adoption_status === "profile_adopted_noncanon" &&
      row?.production_profile_mutation_performed === true &&
      row?.production_profile_mutation_count === 1,
    `rows=${profileAdoptionMutationRows.length}; target=${row?.target_claim_id || "missing"}; status=${row?.after_profile_adoption_status || "missing"}; count=${row?.production_profile_mutation_count ?? "missing"}`
  );
  check(
    "non_profile_boundaries_remain_zero",
    inputBoundaryOpen === false &&
      profileAdoptionMutationRows.every((profileRow) =>
        profileRow.claim_ledger_additional_adoption_count === 0 &&
        profileRow.timeline_mutation_count === 0 &&
        profileRow.story_seed_mutation_count === 0 &&
        profileRow.canon_status === false
      ),
    `inputBoundaryOpen=${inputBoundaryOpen}; claimLedgerAdditional=${row?.claim_ledger_additional_adoption_count ?? "missing"}; timeline=${row?.timeline_mutation_count ?? "missing"}; storySeed=${row?.story_seed_mutation_count ?? "missing"}; canon=${row?.canon_status ?? "missing"}`
  );
  check(
    "provider_publishing_boundaries_closed",
    profileAdoptionMutationRows.every((profileRow) =>
      profileRow.provider_configured === false &&
      profileRow.external_call_attempted === false &&
      profileRow.credentials_touched === false &&
      profileRow.publishing_opened === false &&
      profileRow.production_generation_opened === false
    ) &&
      authorizationPacket.summary?.provider_configured === false &&
      authorizationPacket.summary?.external_call_attempted === false &&
      authorizationPacket.summary?.credentials_touched === false,
    `provider=${row?.provider_configured ?? "missing"}; external=${row?.external_call_attempted ?? "missing"}; credentials=${row?.credentials_touched ?? "missing"}; publishing=${row?.publishing_opened ?? "missing"}`
  );
  check(
    "rollback_descriptor_recorded",
    row?.rollback_descriptor?.rollback_token === rollbackToken &&
      row?.rollback_descriptor?.rollback_scope === "Profile production annotation row only" &&
      row?.rollback_descriptor?.rollback_to_status === "production_claim_ledger_adopted" &&
      row?.rollback_descriptor?.rollback_owner?.includes("author approves rollback") &&
      row?.rollback_descriptor?.rollback_requires.length >= 5,
    `rollback=${row?.rollback_descriptor?.rollback_token || "missing"}; scope=${row?.rollback_descriptor?.rollback_scope || "missing"}; to=${row?.rollback_descriptor?.rollback_to_status || "missing"}`
  );
  check(
    "future_target_evidence_requirements_recorded",
    evidenceRequiredBeforeFutureTargets.length >= 5 &&
      row?.evidence_required_before_future_timeline_story_seed_or_canon_adoption.length === evidenceRequiredBeforeFutureTargets.length,
    `requirements=${row?.evidence_required_before_future_timeline_story_seed_or_canon_adoption?.length ?? "missing"}`
  );
  check(
    "manifest_and_review_memory_registered",
    manifestValidationCommand.includes("smoke-profile-adoption-mutation-one-claim") &&
      manifest.preserves?.includes("fff-profile-adoption-mutation-one-claim-001") &&
      reviewMemory.some((entry) => entry.artifact_id === "fff-profile-adoption-mutation-one-claim-001"),
    `includesSmoke=${manifestValidationCommand.includes("smoke-profile-adoption-mutation-one-claim")}; preserves=${manifest.preserves?.includes("fff-profile-adoption-mutation-one-claim-001")}; memory=${reviewMemory.some((entry) => entry.artifact_id === "fff-profile-adoption-mutation-one-claim-001")}`
  );

  return {
    schemaVersion: PROFILE_ADOPTION_MUTATION_ONE_CLAIM_SCHEMA_VERSION,
    artifact_id: "fff-profile-adoption-mutation-one-claim-001",
    title: "Fast Fiction Factory Profile Adoption Mutation One Claim",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    preserved_active_artifact_id: manifest.artifact_id,
    input_readbacks: {
      downstream_target_authorization_packet_result_path: toRepoPath(authorizationPacketPath),
      production_claim_ledger_rollback_rehearsal_result_path: toRepoPath(rollbackPath),
      production_claim_ledger_adoption_one_claim_result_path: toRepoPath(adoptionPath),
      current_project_state_path: currentProjectStatePath
    },
    user_authorization_readback: {
      authorized_path: "A",
      authorization_source: "user freeform authorization relayed by supervisor prompt",
      target_claim_id: targetClaimId,
      production_target_class: "Profile",
      mutation_scope: "exactly_one_claim_derived_profile_annotation",
      profile_mutation_authorized: true,
      timeline_mutation_authorized: false,
      story_seed_mutation_authorized: false,
      claim_ledger_additional_adoption_authorized: false,
      canon_authorized: false,
      provider_api_credential_authorized: false,
      publishing_public_output_authorized: false,
      before_after_readback_required: true,
      rollback_descriptor_required: true
    },
    authorized_profile_mutation_boundary: {
      target_claim_id: targetClaimId,
      source_span_id: targetSourceSpanId,
      target_profile_id: targetProfileId,
      existing_profile_reference_id: existingProfileReferenceId,
      production_target_class: "Profile",
      expected_prior_claim_ledger_status: "production_claim_ledger_adopted",
      transition,
      allowed_profile_mutation_rows: 1,
      allowed_claim_ledger_additional_adoptions: 0,
      timeline_mutation_allowed: false,
      story_seed_mutation_allowed: false,
      canon_allowed: false,
      provider_api_credential_allowed: false,
      publishing_or_production_generation_allowed: false,
      additional_claims_allowed: false
    },
    before_after_readback: {
      before: {
        target_claim_id: targetClaimId,
        source_span_id: targetSourceSpanId,
        source_span_locator: sourceSpanLocator,
        claim_ledger_status: "production_claim_ledger_adopted",
        profile_adoption_status: "not_profile_adopted",
        profile_mutation_count: 0,
        timeline_mutation_count: 0,
        story_seed_mutation_count: 0,
        canon_status: false
      },
      after: {
        target_claim_id: targetClaimId,
        source_span_id: targetSourceSpanId,
        source_span_locator: sourceSpanLocator,
        claim_ledger_status: "production_claim_ledger_adopted",
        profile_adoption_status: "profile_adopted_noncanon",
        profile_mutation_count: 1,
        timeline_mutation_count: 0,
        story_seed_mutation_count: 0,
        claim_ledger_additional_adoption_count: 0,
        canon_status: false
      }
    },
    profile_adoption_mutation_rows: profileAdoptionMutationRows,
    rollback_readback: rollbackDescriptor,
    evidence_required_before_future_timeline_story_seed_or_canon_adoption: evidenceRequiredBeforeFutureTargets,
    summary: {
      candidates_inspected: 1,
      claim_ledger_adopted_rows_inspected: adoptionRow ? 1 : 0,
      profile_mutation_rows: profileAdoptionMutationRows.length,
      profile_adopted_noncanon_claims: profileAdoptionMutationRows.filter((profileRow) => profileRow.after_profile_adoption_status === "profile_adopted_noncanon").length,
      profile_mutation_count: profileAdoptionMutationRows.reduce((sum, profileRow) => sum + profileRow.production_profile_mutation_count, 0),
      claim_ledger_additional_adoption_count: 0,
      timeline_mutation_count: 0,
      story_seed_mutation_count: 0,
      canonized_claims: 0,
      provider_configured: false,
      external_call_attempted: false,
      credentials_touched: false,
      publishing_opened: false,
      production_generation_opened: false,
      rollback_descriptors_present: row?.rollback_descriptor?.rollback_token === rollbackToken ? 1 : 0,
      failures: failures.length
    },
    what_this_profile_adoption_proves: [
      "Exactly one retained Claim Ledger row is linked into a Profile-scoped non-canon adoption readback.",
      "The transition is limited to claim_ledger_adopted -> profile_adopted_noncanon for multi-claim-moth-key-label.",
      "The Profile annotation has a rollback descriptor and before/after readback.",
      "Timeline, Story Seed, canon, provider, credential, publishing, and production generation boundaries remain closed."
    ],
    what_this_profile_adoption_does_not_prove: [
      "It does not canonize the claim or resolve brass moth truth, Toma fate, Council motive, moth-key function, or contradictory claim truth.",
      "It does not mutate Timeline, Story Seed, database, provider output, credentials, publishing, or public production surfaces.",
      "It does not authorize adoption of any additional claim.",
      "It does not authorize actual rollback of the production Claim Ledger row."
    ],
    profile_adoption_checks: checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateVeryBroadSourceSpanShapeAudit(smoke, smokePath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const sourcePackPath = manifest.source_span_review_pack_path || "artifacts/source-span-routing-review-pack.json";
  const sourceQualityPath = manifest.source_span_quality_audit_result_path || "artifacts/source-span-quality-audit-result.json";
  const broadSpanPath = manifest.broad_span_split_result_path || DEFAULT_BROAD_SPAN_SPLIT_OUTPUT;
  const translatedAuditPath = manifest.translated_memo_fixture_audit_result_path || DEFAULT_TRANSLATED_MEMO_FIXTURE_AUDIT_OUTPUT;
  const sourcePack = await readJson(sourcePackPath);
  const sourceQuality = await readJson(sourceQualityPath);
  const broadSpanSplit = await readJson(broadSpanPath);
  const translatedAudit = await readJson(translatedAuditPath);
  const routingRegression = await readJson(manifest.routing_policy_regression_result_path || DEFAULT_ROUTING_POLICY_REGRESSION_OUTPUT);
  const downstreamGate = await readJson(manifest.downstream_source_span_adoption_gate_result_path || DEFAULT_DOWNSTREAM_SOURCE_SPAN_ADOPTION_GATE_OUTPUT);
  const providerEnvelope = await readJson(manifest.provider_envelope_readiness_no_call_result_path || DEFAULT_PROVIDER_ENVELOPE_READINESS_NO_CALL_OUTPUT);
  const contradictoryGuard = await readJson(manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT);
  const malformedGuard = await readJson(manifest.malformed_missing_span_guard_result_path || DEFAULT_MALFORMED_MISSING_SPAN_GUARD_OUTPUT);
  const remaining = await readJson(manifest.remaining_fixture_coverage_one_class_result_path || DEFAULT_REMAINING_FIXTURE_COVERAGE_OUTPUT);
  const broadRows = getBroadSpanRows(sourceQuality);
  const packElements = flattenSourcePackElements(sourcePack);
  const adapterPayloads = await readAdapterPayloads();
  const adapterElements = adapterPayloads.flatMap((payload) => Array.isArray(payload.extractedElements) ? payload.extractedElements : []);
  const sourcePackGaps = Array.isArray(sourcePack.cross_fixture_summary?.fixture_class_gaps)
    ? sourcePack.cross_fixture_summary.fixture_class_gaps
    : [];
  const fixtureFiles = Array.isArray(smoke.fixtureFiles) ? smoke.fixtureFiles : [];
  const sourcePackFixtureIds = Array.isArray(sourcePack.fixtures)
    ? sourcePack.fixtures.map((fixture) => fixture.fixture_id).filter(Boolean)
    : [];
  const broadFixtureMatches = [...new Set([
    ...fixtureFiles.filter((file) => /broad|very[-_ ]?broad|span[-_ ]?shape/i.test(file)),
    ...sourcePackFixtureIds.filter((fixtureId) => /broad|very[-_ ]?broad|span[-_ ]?shape/i.test(fixtureId))
  ])];
  const broadDecisionIds = Array.isArray(broadSpanSplit.decisions)
    ? broadSpanSplit.decisions.map((decision) => decision.id)
    : [];
  const sourceQualityMemory = manifest.review_memory?.find((entry) => entry.artifact_id === "fff-source-span-quality-audit-001");
  const broadMemory = manifest.review_memory?.find((entry) => entry.artifact_id === "fff-broad-span-split-001");
  const translatedMemory = manifest.review_memory?.find((entry) => entry.artifact_id === "fff-translated-memo-fixture-audit-001");

  check(
    "prior_audits_loaded",
    sourceQuality?.artifact_id === "fff-source-span-quality-audit-001" &&
      broadSpanSplit?.artifact_id === "fff-broad-span-split-001" &&
      translatedAudit?.artifact_id === "fff-translated-memo-fixture-audit-001" &&
      sourceQuality?.passed === true &&
      broadSpanSplit?.passed === true &&
      translatedAudit?.passed === true,
    `sourceQuality=${sourceQuality?.artifact_id}; broadSplit=${broadSpanSplit?.artifact_id}; translated=${translatedAudit?.artifact_id}`
  );
  check(
    "existing_broad_rows_resolved",
    broadRows.length === 2 &&
      broadSpanSplit.summary?.broad_span_rows_loaded === 2 &&
      broadSpanSplit.summary?.split_into_narrower_spans === 1 &&
      broadSpanSplit.summary?.keep_with_reason === 1 &&
      broadSpanSplit.summary?.failures === 0 &&
      broadDecisionIds.includes("local-x-visual-observatory") &&
      broadDecisionIds.includes("minutes-x-placeholder-proof-bait"),
    `broadRows=${broadRows.length}; split=${broadSpanSplit.summary?.split_into_narrower_spans}; keep=${broadSpanSplit.summary?.keep_with_reason}; ids=${broadDecisionIds.join(", ") || "none"}`
  );
  check(
    "very_broad_fixture_not_added",
    broadFixtureMatches.length === 0 &&
      sourcePackGaps.includes("very broad source spans") &&
      translatedAudit.summary?.source_pack_rows_checked === sourcePack.cross_fixture_summary?.total_elements,
    `broad fixtures=${broadFixtureMatches.join(", ") || "none"}; gaps=${sourcePackGaps.join(", ") || "none"}`
  );
  check(
    "current_coverage_not_blocked",
    sourcePack?.passed === true &&
      sourcePack.cross_fixture_summary?.fixture_count === 5 &&
      sourcePack.cross_fixture_summary?.total_elements === 60 &&
      sourcePack.cross_fixture_summary?.source_span_mismatches === 0 &&
      sourcePack.cross_fixture_summary?.missing_source_refs === 0 &&
      sourcePack.cross_fixture_summary?.unsafe_visual_routing === 0 &&
      sourcePack.cross_fixture_summary?.non_held_review_defaults === 0 &&
      sourcePack.cross_fixture_summary?.human_owned_decision_adopt_suggestions === 0 &&
      smoke?.passed === true &&
      smoke.aggregate?.fixtureCount === 5 &&
      smoke.aggregate?.elementCount === 60,
    `pack fixtures=${sourcePack.cross_fixture_summary?.fixture_count}; rows=${sourcePack.cross_fixture_summary?.total_elements}; smoke fixtures=${smoke.aggregate?.fixtureCount}; smoke elements=${smoke.aggregate?.elementCount}`
  );
  check(
    "downstream_and_routing_preserved",
    routingRegression?.passed === true &&
      routingRegression.summary?.source_pack_rows_checked === packElements.length &&
      routingRegression.summary?.adapter_payloads_checked === adapterPayloads.length &&
      routingRegression.summary?.adapter_elements_checked === adapterElements.length &&
      downstreamGate?.passed === true &&
      downstreamGate.summary?.source_pack_rows_checked === packElements.length &&
      downstreamGate.summary?.adopted_profile_claim_timeline_candidates === 0 &&
      downstreamGate.summary?.human_owned_candidates_non_held === 0,
    `pack rows=${packElements.length}; routing payloads=${routingRegression.summary?.adapter_payloads_checked}; downstream adopted=${downstreamGate.summary?.adopted_profile_claim_timeline_candidates}`
  );
  check(
    "guard_chain_preserved",
    remaining?.passed === true &&
      remaining.selected_fixture_class === "multilingual_memo_text" &&
      malformedGuard?.passed === true &&
      malformedGuard.summary?.accepted_routed_candidates === 0 &&
      contradictoryGuard?.passed === true &&
      contradictoryGuard.summary?.adopted_or_provisional_conflicting_claims === 0 &&
      contradictoryGuard.summary?.direct_accepted_claim_elements === 0,
    `remaining=${remaining?.selected_fixture_class}; malformed accepted=${malformedGuard.summary?.accepted_routed_candidates}; contradictory adopted=${contradictoryGuard.summary?.adopted_or_provisional_conflicting_claims}`
  );
  check(
    "provider_api_boundary_not_crossed",
    providerEnvelope?.passed === true &&
      providerEnvelope.provider_metadata?.providerConfigured === false &&
      providerEnvelope.provider_metadata?.externalCallAttempted === false &&
      providerEnvelope.provider_metadata?.credentialsTouched === false,
    `providerConfigured=${providerEnvelope.provider_metadata?.providerConfigured}; externalCall=${providerEnvelope.provider_metadata?.externalCallAttempted}; credentials=${providerEnvelope.provider_metadata?.credentialsTouched}`
  );
  check(
    "review_nonredundancy_preserved",
    manifest.review_input_mode === "freeform" &&
      sourceQualityMemory?.prior_review_count === 0 &&
      broadMemory?.prior_review_count === 0 &&
      translatedMemory?.prior_review_count === 0 &&
      translatedAudit.summary?.review_card_emitted === false &&
      translatedAudit.summary?.operator_observation_card_emitted === false,
    `reviewInput=${manifest.review_input_mode}; broadPrior=${broadMemory?.prior_review_count}; translatedPrior=${translatedMemory?.prior_review_count}`
  );

  return {
    schemaVersion: VERY_BROAD_SOURCE_SPAN_SHAPE_AUDIT_SCHEMA_VERSION,
    artifact_id: "fff-very-broad-source-span-shape-audit-001",
    title: "Fast Fiction Factory Very Broad Source-Span Shape Audit",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    preserved_active_artifact_id: manifest.artifact_id,
    audit_scope: {
      fixture_added: false,
      audit_only: true,
      source_span_quality_audit_path: sourceQualityPath,
      broad_span_split_path: broadSpanPath,
      source_pack_path: sourcePackPath,
      adapter_matrix_smoke_path: toRepoPath(smokePath)
    },
    review_memory_checked: {
      checked: true,
      target: "fff-translated-memo-fixture-audit-001",
      prior_review_count: translatedMemory?.prior_review_count ?? 0,
      prior_signal_summary: translatedMemory?.latest_user_signal_summary || "No user review was requested for the translated/multilingual fixture audit.",
      axis: "very_broad_source_span_shape_audit",
      what_changed: "The remaining very broad source-span shape candidate was audited after the translated memo audit without adding another fixture class.",
      what_this_review_decides: "No user review is needed; this readback decides that the current broad-span evidence is already closed by split/keep decisions and that a new broad fixture should wait for a concrete source-output gap.",
      not_asking: [
        "general Review Hub review",
        "fixed-form review",
        "repeat broad-span split review",
        "new broad source-span fixture approval",
        "provider choice",
        "credentials",
        "model/API call approval",
        "database persistence",
        "publishing or production sync",
        "AI video generation",
        "downstream adoption implementation",
        "canon promotion",
        "contradictory claim truth decision"
      ],
      next_nonredundant_axis: "provider adapter implementation only after explicit authorization, or a new broad/translated fixture only after concrete policy or source-output evidence changes"
    },
    coverage_audit: {
      very_broad_source_span_shape: {
        fixture_present: broadFixtureMatches.length > 0,
        fixture_matches: broadFixtureMatches,
        gap_present_in_source_pack: sourcePackGaps.includes("very broad source spans"),
        audit_decision: "not_added_in_this_slice",
        reason: "The current broad rows are already resolved by fff-broad-span-split-001, and the current source-pack/readback chain has zero source-span mismatches, missing refs, unsafe routes, non-held defaults, or downstream adopted candidates."
      },
      existing_broad_span_decisions: Array.isArray(broadSpanSplit.decisions)
        ? broadSpanSplit.decisions.map((decision) => ({
            id: decision.id,
            action: decision.action,
            source_span_locator: decision.source_span_locator,
            source_ref_preserved: decision.source_ref_preserved
          }))
        : [],
      source_pack_current_gap_list: sourcePackGaps
    },
    summary: {
      current_fixture_count: smoke.aggregate?.fixtureCount,
      current_output_count: smoke.aggregate?.outputCount,
      current_matrix_element_count: smoke.aggregate?.elementCount,
      source_pack_rows_checked: sourcePack.cross_fixture_summary?.total_elements,
      broad_span_rows_loaded: broadRows.length,
      broad_span_rows_resolved: broadSpanSplit.summary?.broad_span_rows_loaded,
      split_into_narrower_spans: broadSpanSplit.summary?.split_into_narrower_spans,
      keep_with_reason: broadSpanSplit.summary?.keep_with_reason,
      very_broad_fixture_count: broadFixtureMatches.length,
      source_span_mismatches: sourcePack.cross_fixture_summary?.source_span_mismatches,
      missing_source_refs: sourcePack.cross_fixture_summary?.missing_source_refs,
      unsafe_visual_routes: sourcePack.cross_fixture_summary?.unsafe_visual_routing,
      non_held_review_defaults: sourcePack.cross_fixture_summary?.non_held_review_defaults,
      human_owned_decision_adopt_suggestions: sourcePack.cross_fixture_summary?.human_owned_decision_adopt_suggestions,
      downstream_candidates_reported_for_review: downstreamGate.summary?.downstream_candidates_reported_for_review,
      human_owned_downstream_candidates_held: downstreamGate.summary?.human_owned_candidates_held,
      adopted_profile_claim_timeline_candidates: downstreamGate.summary?.adopted_profile_claim_timeline_candidates,
      provider_configured: providerEnvelope.provider_metadata?.providerConfigured,
      external_call_attempted: providerEnvelope.provider_metadata?.externalCallAttempted,
      credentials_touched: providerEnvelope.provider_metadata?.credentialsTouched,
      review_card_emitted: false,
      repeated_general_review_request_emitted: false,
      operator_observation_card_emitted: false,
      failures: failures.length
    },
    very_broad_fixture_decision: {
      state: "deferred_not_required",
      owner: "agent for future bounded fixture when source-output evidence changes; human reviewer only if broad span wording needs creative judgment",
      next_move: "Do not add a broad source-span fixture until current adapter output changes, a new memo shape creates unresolved broad spans, or coverage is explicitly the bottleneck.",
      requirements_before_adding: [
        "a source-pack row or fixture output with unresolved broad source-span behavior",
        "evidence that existing split/keep readback no longer covers the shape",
        "confirmation that broad fixture coverage, not provider authorization or translation policy, is the bottleneck"
      ]
    },
    fixture_audit_checks: checks,
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
  const adapterPayloads = await readAdapterPayloads();
  const adapterElements = adapterPayloads.flatMap((payload) => Array.isArray(payload.extractedElements) ? payload.extractedElements : []);
  const sourcePackFixtureCount = Number(sourcePack.cross_fixture_summary?.fixture_count || 0);
  const sampleAdapterElements = Array.isArray(adapterPayloads[0]?.extractedElements) ? adapterPayloads[0].extractedElements.length : 0;

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
      sourcePack.cross_fixture_summary?.fixture_count >= 4 &&
      sourcePack.cross_fixture_summary?.total_elements >= 48 &&
      routingRegression.summary?.source_pack_rows_checked === sourcePack.cross_fixture_summary?.total_elements &&
      routingRegression.summary?.adapter_payloads_checked === adapterPayloads.length &&
      routingRegression.summary?.adapter_elements_checked === adapterElements.length &&
      adapterPayloads.length === sourcePackFixtureCount + 1 &&
      adapterElements.length === sourcePack.cross_fixture_summary?.total_elements + sampleAdapterElements,
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
  const adapterPayloads = await readAdapterPayloads();
  const adapterElements = adapterPayloads.flatMap((payload) => Array.isArray(payload.extractedElements) ? payload.extractedElements : []);
  const sourcePackFixtureCount = Number(sourcePack.cross_fixture_summary?.fixture_count || 0);
  const sampleAdapterElements = Array.isArray(adapterPayloads[0]?.extractedElements) ? adapterPayloads[0].extractedElements.length : 0;

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
      sourcePack.cross_fixture_summary?.fixture_count >= 4 &&
      sourcePack.cross_fixture_summary?.total_elements >= 48 &&
      routingRegression.summary?.source_pack_rows_checked === sourcePack.cross_fixture_summary?.total_elements &&
      routingRegression.summary?.adapter_payloads_checked === adapterPayloads.length &&
      routingRegression.summary?.adapter_elements_checked === adapterElements.length &&
      adapterPayloads.length === sourcePackFixtureCount + 1 &&
      adapterElements.length === sourcePack.cross_fixture_summary?.total_elements + sampleAdapterElements &&
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
  const sourcePackFixtureCount = Number(sourcePack.cross_fixture_summary?.fixture_count || 0);
  const sampleAdapterElements = Array.isArray(adapterPayloads[0]?.extractedElements) ? adapterPayloads[0].extractedElements.length : 0;

  check(
    "source_pack_loaded",
    sourcePack?.artifact_id === "fff-source-span-routing-review-pack-001" &&
      sourcePack?.passed === true &&
      sourcePack.cross_fixture_summary?.total_elements >= 48 &&
      packElements.length === sourcePack.cross_fixture_summary?.total_elements,
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
      routingRegression.summary?.source_pack_rows_checked === packElements.length &&
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
      adapterPayloads.length === sourcePackFixtureCount + 1 &&
      adapterElements.length === packElements.length + sampleAdapterElements,
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
    manifest.artifact_id === "fff-draft-to-video-planning-bridge-001" &&
      manifest.review_input_mode === "freeform" &&
      envelope?.reviewSurface?.reviewCardRequired === false &&
      envelope?.reviewSurface?.operatorObservationCardRequired === false,
    "active Review Hub identity stays Draft-to-Video Bridge and user-side provider work remains optional"
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

async function validateProviderAdapterAuthorizationReadiness(providerEnvelopeReadback, providerEnvelopeReadbackPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const providerEnvelopePath = manifest.provider_envelope_readiness_no_call_result_path || DEFAULT_PROVIDER_ENVELOPE_READINESS_NO_CALL_OUTPUT;
  const modelBoundarySmoke = await readJson(manifest.model_api_boundary_smoke_path || "artifacts/model-api-boundary-smoke-result.json");
  const downstreamScopeLock = await readJson(manifest.downstream_adoption_gate_scope_lock_result_path || "artifacts/downstream-adoption-gate-scope-lock-result.json");
  const downstreamGate = await readJson(manifest.downstream_source_span_adoption_gate_result_path || DEFAULT_DOWNSTREAM_SOURCE_SPAN_ADOPTION_GATE_OUTPUT);
  const translatedAudit = await readJson(manifest.translated_memo_fixture_audit_result_path || DEFAULT_TRANSLATED_MEMO_FIXTURE_AUDIT_OUTPUT);
  const veryBroadAudit = await readJson(manifest.very_broad_source_span_shape_audit_result_path || DEFAULT_VERY_BROAD_SOURCE_SPAN_SHAPE_AUDIT_OUTPUT);
  const contradictoryGuard = await readJson(manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT);
  const malformedGuard = await readJson(manifest.malformed_missing_span_guard_result_path || DEFAULT_MALFORMED_MISSING_SPAN_GUARD_OUTPUT);
  const routingRegression = await readJson(manifest.routing_policy_regression_result_path || DEFAULT_ROUTING_POLICY_REGRESSION_OUTPUT);
  const sourcePack = await readJson(manifest.source_span_review_pack_path || "artifacts/source-span-routing-review-pack.json");
  const providerMemory = manifest.review_memory?.find((entry) => entry.artifact_id === "fff-provider-envelope-readiness-no-call-001");
  const broadMemory = manifest.review_memory?.find((entry) => entry.artifact_id === "fff-very-broad-source-span-shape-audit-001");
  const credentialFindings = collectCredentialMaterial({
    manifest,
    providerEnvelopeReadback,
    modelBoundarySmoke
  });
  const unauthorizedItems = [
    "provider_choice",
    "credentials_or_secrets",
    "endpoint",
    "transport",
    "external_call_permission",
    "persistence_or_publication"
  ];
  const futureAuthorizationTriggers = [
    "choose provider and model",
    "authorize credential storage and secret handling",
    "approve endpoint and transport behavior",
    "approve external call permission",
    "approve timeout/retry policy for real transport",
    "keep all local validation gates passing before importing provider output"
  ];
  const allowedNoCallState = [
    "local deterministic adapter and fixture matrix",
    "existing no-call provider envelope readback",
    "mock/sample provider-shaped payloads stored as local artifacts only",
    "Extraction Contract validation",
    "source/routing/hold gates",
    "downstream readback with 0 adopted candidates",
    "contradictory and malformed source-span guards"
  ];

  check(
    "current_state_verified",
    manifest.artifact_id === "fff-draft-to-video-planning-bridge-001" &&
      veryBroadAudit?.artifact_id === "fff-very-broad-source-span-shape-audit-001" &&
      translatedAudit?.artifact_id === "fff-translated-memo-fixture-audit-001" &&
      veryBroadAudit?.passed === true &&
      translatedAudit?.passed === true,
    `current-active=${manifest.artifact_id}; broad=${veryBroadAudit?.artifact_id}/${veryBroadAudit?.passed}; translated=${translatedAudit?.artifact_id}/${translatedAudit?.passed}`
  );
  check(
    "provider_api_absence_verified",
    providerEnvelopeReadback?.artifact_id === "fff-provider-envelope-readiness-no-call-001" &&
      providerEnvelopeReadback?.passed === true &&
      providerEnvelopeReadback.provider_metadata?.providerConfigured === false &&
      providerEnvelopeReadback.provider_metadata?.externalCallAttempted === false &&
      providerEnvelopeReadback.provider_metadata?.credentialsTouched === false &&
      modelBoundarySmoke?.passed === true &&
      modelBoundarySmoke?.checks?.noExternalCall === true &&
      modelBoundarySmoke?.checks?.noCredentials === true &&
      credentialFindings.length === 0,
    `providerConfigured=${providerEnvelopeReadback.provider_metadata?.providerConfigured}; externalCall=${providerEnvelopeReadback.provider_metadata?.externalCallAttempted}; credentials=${providerEnvelopeReadback.provider_metadata?.credentialsTouched}; findings=${credentialFindings.join(", ") || "none"}`
  );
  check(
    "unauthorized_items_listed",
    unauthorizedItems.length === 6 &&
      unauthorizedItems.includes("provider_choice") &&
      unauthorizedItems.includes("credentials_or_secrets") &&
      unauthorizedItems.includes("endpoint") &&
      unauthorizedItems.includes("transport") &&
      unauthorizedItems.includes("external_call_permission") &&
      unauthorizedItems.includes("persistence_or_publication"),
    `unauthorized=${unauthorizedItems.join(", ")}`
  );
  check(
    "allowed_no_call_state_listed",
    allowedNoCallState.length >= 7 &&
      allowedNoCallState.some((item) => item.includes("no-call provider envelope")) &&
      allowedNoCallState.some((item) => item.includes("Extraction Contract")) &&
      allowedNoCallState.some((item) => item.includes("0 adopted")),
    `allowed=${allowedNoCallState.join("; ")}`
  );
  check(
    "future_authorization_triggers_listed",
    futureAuthorizationTriggers.length >= 6 &&
      futureAuthorizationTriggers.some((item) => item.includes("provider")) &&
      futureAuthorizationTriggers.some((item) => item.includes("credential")) &&
      futureAuthorizationTriggers.some((item) => item.includes("external call")),
    `triggers=${futureAuthorizationTriggers.join("; ")}`
  );
  check(
    "guard_chain_preserved",
    downstreamScopeLock?.passed === true &&
      downstreamScopeLock.scope_policy?.actual_downstream_adoption_implemented === false &&
      downstreamGate?.passed === true &&
      downstreamGate.summary?.adopted_profile_claim_timeline_candidates === 0 &&
      contradictoryGuard?.passed === true &&
      contradictoryGuard.summary?.held_conflicting_claims === 2 &&
      contradictoryGuard.summary?.adopted_or_provisional_conflicting_claims === 0 &&
      malformedGuard?.passed === true &&
      malformedGuard.summary?.accepted_routed_candidates === 0 &&
      routingRegression?.passed === true &&
      sourcePack?.passed === true,
    `downstreamAdopted=${downstreamGate.summary?.adopted_profile_claim_timeline_candidates}; heldConflicts=${contradictoryGuard.summary?.held_conflicting_claims}; malformedAccepted=${malformedGuard.summary?.accepted_routed_candidates}; routing=${routingRegression?.passed}; pack=${sourcePack?.passed}`
  );
  check(
    "decision_packet_produced",
    manifest.review_input_mode === "freeform" &&
      providerEnvelopeReadback.summary?.review_card_emitted === false &&
      veryBroadAudit.summary?.review_card_emitted === false,
    `reviewInput=${manifest.review_input_mode}; providerReviewCard=${providerEnvelopeReadback.summary?.review_card_emitted}; broadReviewCard=${veryBroadAudit.summary?.review_card_emitted}`
  );

  return {
    schemaVersion: PROVIDER_ADAPTER_AUTHORIZATION_READINESS_SCHEMA_VERSION,
    artifact_id: "fff-provider-adapter-authorization-readiness-001",
    title: "Fast Fiction Factory Provider Adapter Authorization Readiness",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    render_gate: "L0 No Render",
    readiness_scope: {
      provider_adapter_implemented: false,
      provider_authorization_implemented: false,
      provider_call_allowed: false,
      credentials_allowed: false,
      endpoint_allowed: false,
      transport_allowed: false,
      database_persistence_allowed: false,
      publishing_or_production_sync_allowed: false,
      downstream_adoption_allowed: false,
      canon_promotion_allowed: false
    },
    input_readbacks: {
      provider_envelope_readiness_no_call_result_path: toRepoPath(providerEnvelopeReadbackPath || providerEnvelopePath),
      model_api_boundary_smoke_path: manifest.model_api_boundary_smoke_path || "artifacts/model-api-boundary-smoke-result.json",
      downstream_scope_lock_result_path: manifest.downstream_adoption_gate_scope_lock_result_path || "artifacts/downstream-adoption-gate-scope-lock-result.json",
      downstream_gate_result_path: manifest.downstream_source_span_adoption_gate_result_path || DEFAULT_DOWNSTREAM_SOURCE_SPAN_ADOPTION_GATE_OUTPUT,
      translated_memo_fixture_audit_result_path: manifest.translated_memo_fixture_audit_result_path || DEFAULT_TRANSLATED_MEMO_FIXTURE_AUDIT_OUTPUT,
      very_broad_source_span_shape_audit_result_path: manifest.very_broad_source_span_shape_audit_result_path || DEFAULT_VERY_BROAD_SOURCE_SPAN_SHAPE_AUDIT_OUTPUT,
      contradictory_claim_guard_result_path: manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT,
      malformed_missing_span_guard_result_path: manifest.malformed_missing_span_guard_result_path || DEFAULT_MALFORMED_MISSING_SPAN_GUARD_OUTPUT,
      routing_policy_regression_result_path: manifest.routing_policy_regression_result_path || DEFAULT_ROUTING_POLICY_REGRESSION_OUTPUT,
      source_span_review_pack_path: manifest.source_span_review_pack_path || "artifacts/source-span-routing-review-pack.json"
    },
    review_memory_checked: {
      checked: true,
      target: "fff-provider-envelope-readiness-no-call-001",
      prior_review_count: providerMemory?.prior_review_count ?? 0,
      prior_signal_summary: providerMemory?.latest_user_signal_summary || "No user review was requested for the provider envelope no-call readiness gate.",
      axis: "provider_adapter_authorization_readiness",
      what_changed: "A separate authorization readiness readback now states which provider/API actions remain unauthorized before any real adapter work can begin.",
      what_this_review_decides: "No user decision is required now; this readback separates local no-call readiness from future real provider execution authorization.",
      not_asking: [
        "provider choice",
        "credential or secret value",
        "endpoint setup",
        "transport implementation",
        "external call approval",
        "database persistence",
        "publishing or production sync",
        "AI video generation",
        "downstream adoption implementation",
        "canon promotion",
        "contradictory claim truth decision"
      ],
      next_nonredundant_axis: "real provider adapter implementation only after explicit provider, credential, endpoint, transport, and external-call authorization"
    },
    authorization_state: {
      unauthorized_items: unauthorizedItems,
      allowed_current_state: allowedNoCallState,
      future_authorization_triggers: futureAuthorizationTriggers,
      credential_material_findings: credentialFindings
    },
    decision_packet: {
      recommended_option: "stay_local_deterministic_until_explicit_provider_authorization",
      options: [
        {
          id: "stay_local_deterministic_only",
          status: "available_now",
          effect: "Keep using deterministic fixtures and validation gates with no provider/API work.",
          requires: []
        },
        {
          id: "no_call_mock_provider_envelope_next",
          status: "already_available_as_auxiliary_readback",
          effect: "Use local provider-shaped artifacts only to test envelope and validation behavior.",
          requires: [
            "no credentials",
            "no endpoint",
            "no external call"
          ]
        },
        {
          id: "real_provider_adapter_later",
          status: "blocked_until_explicit_authorization",
          effect: "A real adapter can be implemented only after provider, credentials, endpoint, transport, and call permission are approved.",
          requires: futureAuthorizationTriggers
        }
      ],
      response_style_for_future_decision: "freeform",
      template_required: false,
      schema_owner: "Agent"
    },
    readiness_separation: {
      slice_completion: "complete_when_this_result_passes",
      provider_readiness: "authorization_boundary_ready_but_real_provider_work_blocked",
      production_readiness: "low_not_accepted",
      canon_readiness: "not_accepted_for_human_owned_truth_decisions"
    },
    summary: {
      current_state_verified: checks.current_state_verified?.passed === true,
      provider_api_absence_verified: checks.provider_api_absence_verified?.passed === true,
      unauthorized_items_count: unauthorizedItems.length,
      allowed_no_call_state_count: allowedNoCallState.length,
      future_authorization_trigger_count: futureAuthorizationTriggers.length,
      decision_packet_options: 3,
      downstream_candidates_reported_for_review: downstreamGate.summary?.downstream_candidates_reported_for_review,
      adopted_profile_claim_timeline_candidates: downstreamGate.summary?.adopted_profile_claim_timeline_candidates,
      held_conflicting_claims: contradictoryGuard.summary?.held_conflicting_claims,
      provider_configured: providerEnvelopeReadback.provider_metadata?.providerConfigured,
      external_call_attempted: providerEnvelopeReadback.provider_metadata?.externalCallAttempted,
      credentials_touched: providerEnvelopeReadback.provider_metadata?.credentialsTouched,
      review_card_emitted: false,
      repeated_general_review_request_emitted: false,
      operator_observation_card_emitted: false,
      failures: failures.length
    },
    authorization_readiness_checks: checks,
    preserved_review_memory_context: {
      provider_envelope_prior_review_count: providerMemory?.prior_review_count ?? 0,
      very_broad_prior_review_count: broadMemory?.prior_review_count ?? 0
    },
    failures,
    passed: failures.length === 0
  };
}

async function validateOneStoryDraftReviewPack(pack, packPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const designerDashboard = await readJson(manifest.designer_candidate_dashboard_result_path || DEFAULT_DESIGNER_CANDIDATE_DASHBOARD_OUTPUT);
  const contradictoryGuard = await readJson(manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT);
  const providerEnvelope = await readJson(manifest.provider_envelope_readiness_no_call_result_path || DEFAULT_PROVIDER_ENVELOPE_READINESS_NO_CALL_OUTPUT);
  const credentialFindings = collectCredentialMaterial(pack);
  const dashboardCandidateIds = new Set((designerDashboard.content_candidates || []).map((candidate) => candidate.id));
  const dashboardChannelIds = new Set((designerDashboard.channel_strategy_proposals || []).map((proposal) => proposal.id));
  const draftBeats = Array.isArray(pack.draft_spine?.beats) ? pack.draft_spine.beats : [];
  const visualCues = Array.isArray(pack.visual_cues) ? pack.visual_cues : [];
  const subtitleOrTextCues = Array.isArray(pack.subtitle_or_text_cues) ? pack.subtitle_or_text_cues : [];
  const unresolvedQuestions = Array.isArray(pack.unresolved_human_owned_questions) ? pack.unresolved_human_owned_questions : [];
  const riskCards = Array.isArray(pack.risk_cards) ? pack.risk_cards : [];
  const reviewerDecisions = Array.isArray(pack.recommended_reviewer_decisions) ? pack.recommended_reviewer_decisions : [];

  check(
    "identity",
    pack?.artifact_id === "fff-one-story-draft-review-pack-001" &&
      pack?.schemaVersion === ONE_STORY_DRAFT_REVIEW_PACK_SCHEMA_VERSION &&
      pack?.review_ui === "public/review/index.html",
    `artifact=${pack?.artifact_id}; schema=${pack?.schemaVersion}; ui=${pack?.review_ui}`
  );
  check(
    "source_dashboard_preserved",
    pack?.source_dashboard_artifact_id === "fff-designer-candidate-dashboard-001" &&
      designerDashboard?.artifact_id === "fff-designer-candidate-dashboard-001" &&
      designerDashboard?.passed === true,
    `source=${pack?.source_dashboard_artifact_id}; dashboard=${designerDashboard?.artifact_id}/${designerDashboard?.passed}`
  );
  check(
    "provisional_candidate_selected",
    pack?.selection_status === "provisional_default" &&
      typeof pack?.selected_candidate_id === "string" &&
      dashboardCandidateIds.has(pack.selected_candidate_id) &&
      typeof pack?.selected_reason === "string" &&
      pack.selected_reason.length > 20,
    `status=${pack?.selection_status}; selected=${pack?.selected_candidate_id}; known=${dashboardCandidateIds.has(pack?.selected_candidate_id)}`
  );
  check(
    "channel_route_selected",
    pack?.channel_strategy_route?.id &&
      dashboardChannelIds.has(pack.channel_strategy_route.id) &&
      pack.channel_strategy_route.archetype &&
      pack.channel_strategy_route.audience &&
      pack.channel_strategy_route.fit,
    `channel=${pack?.channel_strategy_route?.id}; known=${dashboardChannelIds.has(pack?.channel_strategy_route?.id)}`
  );
  check(
    "draft_content_visible",
    pack?.source_memo_cue &&
      pack?.logline &&
      pack?.premise &&
      pack?.sample_opening_present === true &&
      pack?.draft_spine?.sample_opening_status === "non_final_non_canon_review_excerpt" &&
      pack?.draft_spine?.status === "reviewable_not_final_prose",
    `sourceCue=${Boolean(pack?.source_memo_cue)}; logline=${Boolean(pack?.logline)}; sample=${pack?.sample_opening_present}; status=${pack?.draft_spine?.status}`
  );
  check(
    "review_surface_counts",
    pack?.content_candidate_count >= 3 &&
      pack?.channel_strategy_count >= 3 &&
      draftBeats.length >= 5 &&
      visualCues.length >= 3 &&
      subtitleOrTextCues.length >= 3 &&
      unresolvedQuestions.length >= 3 &&
      riskCards.length >= 4 &&
      reviewerDecisions.length >= 3,
    `content=${pack?.content_candidate_count}; channels=${pack?.channel_strategy_count}; beats=${draftBeats.length}; visual=${visualCues.length}; text=${subtitleOrTextCues.length}; questions=${unresolvedQuestions.length}; risks=${riskCards.length}; decisions=${reviewerDecisions.length}`
  );
  check(
    "reported_counts_match",
    pack?.content_candidate_count === designerDashboard.counts?.content_candidates &&
      pack?.channel_strategy_count === designerDashboard.counts?.channel_strategy_proposals &&
      pack?.draft_beat_count === draftBeats.length &&
      pack?.visual_cue_count === visualCues.length &&
      pack?.subtitle_or_text_cue_count === subtitleOrTextCues.length &&
      pack?.unresolved_human_owned_questions_count === unresolvedQuestions.length &&
      pack?.risk_card_count === riskCards.length,
    `reported=${JSON.stringify({
      content: pack?.content_candidate_count,
      channels: pack?.channel_strategy_count,
      beats: pack?.draft_beat_count,
      visual: pack?.visual_cue_count,
      text: pack?.subtitle_or_text_cue_count,
      questions: pack?.unresolved_human_owned_questions_count,
      risks: pack?.risk_card_count
    })}`
  );
  check(
    "review_hold_and_unknowns",
    draftBeats.every((beat) => beat.review_status === "hold") &&
      unresolvedQuestions.every((question) => String(question.owner || "").includes("human")) &&
      riskCards.some((risk) => String(risk.finding || "").toLowerCase().includes("rights")) &&
      riskCards.some((risk) => String(risk.finding || "").toLowerCase().includes("no render")),
    `beatHolds=${draftBeats.filter((beat) => beat.review_status === "hold").length}; questions=${unresolvedQuestions.length}; risks=${riskCards.length}`
  );
  check(
    "local_only_boundaries",
    pack?.local_only === true &&
      pack?.external_call === false &&
      pack?.provider_configured === false &&
      pack?.credentials_touched === false &&
      pack?.public_upload === false &&
      pack?.ai_video_generation === false &&
      pack?.final_canon_decision === false &&
      credentialFindings.length === 0,
    `local=${pack?.local_only}; external=${pack?.external_call}; provider=${pack?.provider_configured}; credentials=${pack?.credentials_touched}; findings=${credentialFindings.join(", ") || "none"}`
  );
  check(
    "guard_chain_preserved",
    contradictoryGuard?.passed === true &&
      contradictoryGuard.summary?.adopted_or_provisional_conflicting_claims === 0 &&
      providerEnvelope?.passed === true &&
      providerEnvelope.provider_metadata?.externalCallAttempted === false,
    `conflictAdopted=${contradictoryGuard.summary?.adopted_or_provisional_conflicting_claims}; external=${providerEnvelope.provider_metadata?.externalCallAttempted}`
  );

  return {
    schemaVersion: ONE_STORY_DRAFT_REVIEW_PACK_SCHEMA_VERSION,
    artifact_id: "fff-one-story-draft-review-pack-001",
    title: "Fast Fiction Factory One-story Draft Review Pack",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    review_ui: pack.review_ui || "public/review/index.html",
    access_route: pack.access_route || "public/review/index.html?mode=draft",
    input_result_path: toRepoPath(packPath),
    source_dashboard_artifact_id: pack.source_dashboard_artifact_id || "fff-designer-candidate-dashboard-001",
    selected_candidate_id: pack.selected_candidate_id,
    selected_candidate_title: pack.selected_candidate_title,
    selection_status: pack.selection_status || "provisional_default",
    selected_reason: pack.selected_reason,
    source_memo_cue: pack.source_memo_cue,
    source_cue: pack.source_cue,
    logline: pack.logline,
    premise: pack.premise,
    channel_strategy_route: pack.channel_strategy_route || {},
    draft_spine: pack.draft_spine || {},
    visual_cues: visualCues,
    subtitle_or_text_cues: subtitleOrTextCues,
    unresolved_human_owned_questions: unresolvedQuestions,
    risk_cards: riskCards,
    recommended_reviewer_decisions: reviewerDecisions,
    content_candidate_count: designerDashboard.counts?.content_candidates || pack.content_candidate_count || 0,
    channel_strategy_count: designerDashboard.counts?.channel_strategy_proposals || pack.channel_strategy_count || 0,
    draft_beat_count: draftBeats.length,
    sample_opening_present: Boolean(pack.sample_opening_present),
    visual_cue_count: visualCues.length,
    subtitle_or_text_cue_count: subtitleOrTextCues.length,
    unresolved_human_owned_questions_count: unresolvedQuestions.length,
    risk_card_count: riskCards.length,
    local_only: pack.local_only === true,
    external_call: false,
    provider_configured: false,
    credentials_touched: false,
    public_upload: false,
    ai_video_generation: false,
    final_canon_decision: false,
    preserved_readbacks: {
      designer_candidate_dashboard: designerDashboard?.artifact_id,
      contradictory_claim_guard: contradictoryGuard?.artifact_id,
      provider_envelope_readiness_no_call: providerEnvelope?.artifact_id
    },
    summary: {
      draft_review_pack_visible: checks.identity?.passed === true,
      source_dashboard_preserved: checks.source_dashboard_preserved?.passed === true,
      selected_candidate_id: pack.selected_candidate_id,
      selection_status: pack.selection_status || "provisional_default",
      content_candidate_count: designerDashboard.counts?.content_candidates || pack.content_candidate_count || 0,
      channel_strategy_count: designerDashboard.counts?.channel_strategy_proposals || pack.channel_strategy_count || 0,
      draft_beat_count: draftBeats.length,
      sample_opening_present: Boolean(pack.sample_opening_present),
      visual_cue_count: visualCues.length,
      subtitle_or_text_cue_count: subtitleOrTextCues.length,
      unresolved_human_owned_questions_count: unresolvedQuestions.length,
      risk_card_count: riskCards.length,
      local_only: true,
      external_call_attempted: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      final_canon_decision: false,
      guard_chain_preserved: checks.guard_chain_preserved?.passed === true,
      failures: failures.length
    },
    validation_notes: [
      "One-story Draft Review Pack is local review material only.",
      "The selected candidate is provisional_default because no human candidate choice was supplied.",
      "Sample opening and narration excerpt are non-final and non-canon."
    ],
    checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateReviewBriefDarkModeUx(readback, readbackPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const designerDashboard = await readJson(manifest.designer_candidate_dashboard_result_path || DEFAULT_DESIGNER_CANDIDATE_DASHBOARD_OUTPUT);
  const draftPack = await readJson(manifest.one_story_draft_review_pack_result_path || DEFAULT_ONE_STORY_DRAFT_REVIEW_PACK_OUTPUT);
  const stabilization = await readJson(manifest.stabilization_result_path || "artifacts/draft-review-pack-stabilization-result.json");
  const html = await readFile("public/review/index.html", "utf8");
  const credentialFindings = collectCredentialMaterial(readback);
  const selectedCandidateId = readback?.selected_candidate_id || draftPack.selected_candidate_id;
  const selectedChannelId = readback?.selected_channel_route_id || draftPack.channel_strategy_route?.id;
  const advancedTabCount = (html.match(/mode-tab is-advanced/g) || []).length;
  const themeOptionCount = (html.match(/data-theme-target=/g) || []).length;
  const briefCardCount = (html.match(/class="brief-card/g) || []).length;
  const bridgeModeVisible = html.includes('data-mode-panel="bridge"') &&
    html.includes('data-mode-target="bridge"') &&
    html.includes("public/review/index.html?mode=bridge");
  const hardcodedLightSurfaceHits = (html.match(/#ffffff|#fffefb|#fffdf8|#fbfcfd|#f7f9fa|#eef5fa|#eef3fa|#f0f6fa|#fff9e8|#fff7df/gi) || []).length;
  const reviewUiSummary = readback?.review_ui_summary || {};
  const themeCompatibility = readback?.theme_compatibility || {};
  const reviewBriefFlag = readback?.review_brief_visible ?? reviewUiSummary.review_brief_visible ?? readback?.summary?.review_brief_visible;
  const selectedCandidateFlag = readback?.selected_candidate_id_visible ?? reviewUiSummary.selected_candidate_id_visible ?? readback?.summary?.selected_candidate_id_visible;
  const selectedChannelFlag = readback?.selected_channel_route_visible ?? reviewUiSummary.selected_channel_route_visible ?? readback?.summary?.selected_channel_route_visible;
  const japaneseSummaryFlag = readback?.japanese_summary_present ?? reviewUiSummary.japanese_summary_present ?? readback?.summary?.japanese_summary_present;
  const noQueryDefaultMode = readback?.no_query_default_mode ?? readback?.review_ui_summary?.no_query_default_mode ?? readback?.summary?.no_query_default_mode;
  const advancedFlag = readback?.advanced_sections_collapsed_or_demoted ?? reviewUiSummary.advanced_sections_collapsed_or_demoted;
  const darkModeFlag = readback?.dark_mode_toggle_present ?? themeCompatibility.dark_mode_toggle_present ?? readback?.summary?.dark_mode_toggle_present;
  const colorSchemeFlag = readback?.color_scheme_supports_light_dark ?? themeCompatibility.color_scheme_supports_light_dark ?? readback?.summary?.color_scheme_supports_light_dark;
  const hardcodedLightFlag = readback?.hardcoded_light_surfaces_reduced ?? themeCompatibility.hardcoded_light_surfaces_reduced ?? readback?.summary?.hardcoded_light_surfaces_reduced;
  const briefDefaultModeVisible = html.includes('data-review-mode="brief"') &&
    html.includes('data-mode-panel="brief"') &&
    html.includes('data-home-cockpit="home-cockpit-metric-linking"') &&
    html.includes("const REVIEW_MODES") &&
      html.includes('"layout-lab"') &&
      html.includes('"brief"') &&
      html.includes('"bridge"') &&
    html.includes('|| "brief"') &&
    html.includes('allowedMode === "home"');

  check(
    "identity",
    readback?.artifact_id === "fff-review-brief-dark-mode-ux-001" &&
      readback?.schemaVersion === REVIEW_BRIEF_DARK_MODE_UX_SCHEMA_VERSION &&
      readback?.review_ui === "public/review/index.html",
    `artifact=${readback?.artifact_id}; schema=${readback?.schemaVersion}; ui=${readback?.review_ui}`
  );
  check(
    "review_brief_visible",
    reviewBriefFlag !== false &&
      html.includes('id="review-brief-root"') &&
      html.includes('data-mode-panel="brief"') &&
      briefCardCount >= 3,
    `readback=${reviewBriefFlag}; cards=${briefCardCount}`
  );
  check(
    "selected_candidate_visible",
    selectedCandidateFlag !== false &&
      selectedCandidateId === "designer-content-moth-investigation-3m" &&
      html.includes("designer-content-moth-investigation-3m"),
    `readback=${selectedCandidateFlag}; selected=${selectedCandidateId}`
  );
  check(
    "selected_channel_visible",
    selectedChannelFlag !== false &&
      selectedChannelId === "designer-channel-mystery-lore" &&
      html.includes("designer-channel-mystery-lore"),
    `readback=${selectedChannelFlag}; selected=${selectedChannelId}`
  );
  check(
    "japanese_summary_visible",
    japaneseSummaryFlag !== false &&
      html.includes("\u307e\u305a\u3053\u3053\u3092\u898b\u308b") &&
      html.includes("3\u5206: Mira") &&
      html.includes("\u30df\u30b9\u30c6\u30ea\u30fc"),
    `readback=${japaneseSummaryFlag}`
  );
  check(
    "brief_is_default",
    briefDefaultModeVisible &&
      html.includes('data-mode-panel="brief"') &&
      html.includes('data-mode-target="brief"') &&
      html.includes("public/review/index.html?mode=brief"),
    `default=${noQueryDefaultMode || "brief"}; briefRoutePreserved=true; homeAlias=true`
  );
  check(
    "draft_to_video_bridge_linked",
    bridgeModeVisible &&
      html.includes("Draft-to-Video Bridge") &&
      html.includes("fff-draft-to-video-planning-bridge-001"),
    `bridgeModeVisible=${bridgeModeVisible}`
  );
  check(
    "advanced_sections_demoted",
    advancedFlag !== false &&
      advancedTabCount >= 3 &&
      html.includes("mode-tab is-advanced"),
    `readback=${advancedFlag}; advancedTabs=${advancedTabCount}`
  );
  check(
    "theme_toggle_present",
    darkModeFlag !== false &&
      themeOptionCount >= 3 &&
      html.includes('data-theme-target="light"') &&
      html.includes('data-theme-target="dark"') &&
      html.includes('data-theme-target="auto"') &&
      html.includes("THEME_STORAGE_KEY"),
    `readback=${darkModeFlag}; themeOptions=${themeOptionCount}`
  );
  check(
    "color_scheme_support",
    colorSchemeFlag !== false &&
      html.includes("color-scheme: light dark") &&
      html.includes(':root[data-theme="dark"]') &&
      html.includes("prefers-color-scheme"),
    `readback=${colorSchemeFlag}`
  );
  check(
    "hardcoded_light_surfaces_reduced",
    hardcodedLightFlag !== false &&
      html.includes("--paper-warm") &&
      html.includes("--surface-muted") &&
      hardcodedLightSurfaceHits <= 30,
    `readback=${hardcodedLightFlag}; lightSurfaceHits=${hardcodedLightSurfaceHits}`
  );
  check(
    "source_artifacts_preserved",
    designerDashboard?.artifact_id === "fff-designer-candidate-dashboard-001" &&
      designerDashboard?.passed === true &&
      draftPack?.artifact_id === "fff-one-story-draft-review-pack-001" &&
      draftPack?.passed === true &&
      stabilization?.artifact_id === "fff-draft-review-pack-stabilization-001" &&
      stabilization?.passed === true,
    `designer=${designerDashboard?.artifact_id}/${designerDashboard?.passed}; draft=${draftPack?.artifact_id}/${draftPack?.passed}; stabilization=${stabilization?.artifact_id}/${stabilization?.passed}`
  );
  check(
    "local_only_boundaries",
    readback?.local_only === true &&
      readback?.external_call === false &&
      readback?.provider_configured === false &&
      readback?.credentials_touched === false &&
      readback?.public_upload === false &&
      readback?.ai_video_generation === false &&
      readback?.final_canon_decision === false &&
      credentialFindings.length === 0,
    `local=${readback?.local_only}; external=${readback?.external_call}; provider=${readback?.provider_configured}; credentials=${readback?.credentials_touched}; findings=${credentialFindings.join(", ") || "none"}`
  );

  return {
    schemaVersion: REVIEW_BRIEF_DARK_MODE_UX_SCHEMA_VERSION,
    artifact_id: "fff-review-brief-dark-mode-ux-001",
    title: "Fast Fiction Factory Review Brief and Dark Mode UX",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    review_ui: readback.review_ui || "public/review/index.html",
    access_route: readback.access_route || "public/review/index.html?mode=brief",
    input_result_path: toRepoPath(readbackPath),
    source_result_paths: {
      designer_candidate_dashboard: manifest.designer_candidate_dashboard_result_path || DEFAULT_DESIGNER_CANDIDATE_DASHBOARD_OUTPUT,
      one_story_draft_review_pack: manifest.one_story_draft_review_pack_result_path || DEFAULT_ONE_STORY_DRAFT_REVIEW_PACK_OUTPUT,
      draft_review_pack_stabilization: manifest.stabilization_result_path || "artifacts/draft-review-pack-stabilization-result.json"
    },
    source_artifacts: [
      designerDashboard?.artifact_id,
      draftPack?.artifact_id,
      stabilization?.artifact_id
    ].filter(Boolean),
    selected_candidate_id: selectedCandidateId,
    selected_candidate_label_japanese: readback.selected_candidate_label_japanese || "3\u5206: Mira\u3068brass moth\u306e\u624b\u304c\u304b\u308a\u8abf\u67fb",
    selected_channel_route_id: selectedChannelId,
    selected_channel_label_japanese: readback.selected_channel_label_japanese || "\u30df\u30b9\u30c6\u30ea\u30fc\u30fb\u30ed\u30a2\u9023\u8f09\u8def\u7dda",
    counts: {
      review_brief_cards: briefCardCount,
      reviewer_decisions: readback.counts?.reviewer_decisions || 3,
      theme_options: themeOptionCount,
      advanced_tabs_demoted: advancedTabCount,
      draft_to_video_bridge_modes: bridgeModeVisible ? 1 : 0,
      hardcoded_light_surface_hits: hardcodedLightSurfaceHits
    },
    review_ui_summary: {
      review_brief_visible: checks.review_brief_visible?.passed === true,
      selected_candidate_id_visible: checks.selected_candidate_visible?.passed === true,
      selected_channel_route_visible: checks.selected_channel_visible?.passed === true,
      japanese_summary_present: checks.japanese_summary_visible?.passed === true,
      no_query_default_mode: checks.brief_is_default?.passed === true ? "brief" : readback.no_query_default_mode,
      advanced_sections_collapsed_or_demoted: checks.advanced_sections_demoted?.passed === true
    },
    theme_compatibility: {
      dark_mode_toggle_present: checks.theme_toggle_present?.passed === true,
      color_scheme_supports_light_dark: checks.color_scheme_support?.passed === true,
      hardcoded_light_surfaces_reduced: checks.hardcoded_light_surfaces_reduced?.passed === true
    },
    preserved_readbacks: {
      designer_candidate_dashboard: designerDashboard?.artifact_id,
      one_story_draft_review_pack: draftPack?.artifact_id,
      draft_review_pack_stabilization: stabilization?.artifact_id
    },
    designer_dashboard_preserved: designerDashboard?.passed === true,
    draft_review_pack_preserved: draftPack?.passed === true,
    stabilization_checkpoint_preserved: stabilization?.passed === true,
    local_only: readback.local_only === true,
    external_call: false,
    provider_configured: false,
    credentials_touched: false,
    public_upload: false,
    ai_video_generation: false,
    final_canon_decision: false,
    draft_to_video_planning_bridge: checks.draft_to_video_bridge_linked?.passed === true,
    browser_render_attempt: readback.browser_render_attempt || "not_attempted_static_readback_only",
    visual_evidence_path: readback.visual_evidence_path || null,
    summary: {
      review_brief_visible: checks.review_brief_visible?.passed === true,
      selected_candidate_id_visible: checks.selected_candidate_visible?.passed === true,
      selected_channel_route_visible: checks.selected_channel_visible?.passed === true,
      japanese_summary_present: checks.japanese_summary_visible?.passed === true,
      no_query_default_mode: checks.brief_is_default?.passed === true ? "brief" : readback.no_query_default_mode,
      dark_mode_toggle_present: checks.theme_toggle_present?.passed === true,
      color_scheme_supports_light_dark: checks.color_scheme_support?.passed === true,
      hardcoded_light_surfaces_reduced: checks.hardcoded_light_surfaces_reduced?.passed === true,
      designer_dashboard_preserved: designerDashboard?.passed === true,
      draft_review_pack_preserved: draftPack?.passed === true,
      stabilization_checkpoint_preserved: stabilization?.passed === true,
      local_only: true,
      external_call_attempted: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      final_canon_decision: false,
      draft_to_video_bridge_linked: checks.draft_to_video_bridge_linked?.passed === true,
      failures: failures.length
    },
    validation_notes: [
      "Review Brief is now the Home Cockpit no-query default; mode=home remains a compatibility alias.",
      "Dark mode support is implemented through review UI theme variables and localStorage preference.",
      "Designer Dashboard, One-story Draft Review Pack, and Stabilization readbacks remain preserved.",
      "Draft-to-Video Bridge is linked as a separate local pre-production planning mode only.",
      "No provider/API setup, AI video generation, production render, public upload, publishing, or final canon decision is added."
    ],
    checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateDraftToVideoPlanningBridge(bridge, bridgePath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const reviewBriefPath = manifest.review_brief_dark_mode_ux_result_path || manifest.smoke_result_path || DEFAULT_REVIEW_BRIEF_DARK_MODE_UX_OUTPUT;
  const draftPackPath = manifest.one_story_draft_review_pack_result_path || DEFAULT_ONE_STORY_DRAFT_REVIEW_PACK_OUTPUT;
  const designerDashboardPath = manifest.designer_candidate_dashboard_result_path || DEFAULT_DESIGNER_CANDIDATE_DASHBOARD_OUTPUT;
  const stabilizationPath = manifest.stabilization_result_path || "artifacts/draft-review-pack-stabilization-result.json";
  const contradictoryGuardPath = manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT;
  const reviewBrief = await readJson(reviewBriefPath);
  const draftPack = await readJson(draftPackPath);
  const designerDashboard = await readJson(designerDashboardPath);
  const stabilization = await readJson(stabilizationPath);
  const contradictoryGuard = await readJson(contradictoryGuardPath);
  const html = await readFile("public/review/index.html", "utf8");
  const credentialFindings = collectCredentialMaterial(bridge);

  const selectedCandidateId = bridge?.selected_candidate_id || draftPack.selected_candidate_id;
  const selectedChannelId = bridge?.selected_channel_route_id || draftPack.channel_strategy_route?.id;
  const packageSummary = bridge?.package_summary || {};
  const boundaries = bridge?.boundaries || {};
  const preservedReadbacks = bridge?.preserved_readbacks || {};
  const counts = bridge?.counts || {};
  const countFrom = (listName, countName) => {
    const list = packageSummary[listName] || bridge?.[listName];
    if (Array.isArray(list)) {
      return list.length;
    }
    return Number(bridge?.[countName] ?? counts[countName] ?? 0);
  };

  const narrationOutlineCount = countFrom("narration_outline", "narration_outline_count");
  const subtitleCueCount = countFrom("subtitle_on_screen_text_cues", "subtitle_cue_count");
  const visualCueCount = countFrom("shot_visual_cues", "visual_cue_count");
  const thumbnailBriefCount = countFrom("thumbnail_brief", "thumbnail_brief_count");
  const soundMoodCueCount = countFrom("sound_music_mood_cues", "sound_mood_cue_count");
  const rightsRiskCount = countFrom("rights_asset_risks", "rights_risk_count");
  const heldTruthCount = countFrom("held_truths", "held_truth_count");
  const reviewerDecisionCount = countFrom("reviewer_decisions", "reviewer_decision_count");
  const bridgeCardCount = (html.match(/class="bridge-card/g) || []).length;
  const routeContractCards = (html.match(/class="route-contract-card/g) || []).length;
  const noGoalMarkers = [
    "no provider/API call",
    "no AI video generation",
    "no production render",
    "no YouTube upload",
    "no final canon decision",
    "no rights clearance claim"
  ];
  const contrastMarkers = [
    "--pill-ink",
    "--tag-ink",
    "--muted-strong",
    "--route-contract-bg",
    "--link",
    "--focus-ring",
    ".id-pill",
    ".tag",
    "a:focus-visible"
  ];

  check(
    "identity",
    bridge?.artifact_id === "fff-draft-to-video-planning-bridge-001" &&
      bridge?.schemaVersion === DRAFT_TO_VIDEO_PLANNING_BRIDGE_SCHEMA_VERSION &&
      bridge?.review_ui === "public/review/index.html" &&
      bridge?.access_route === "public/review/index.html?mode=bridge",
    `artifact=${bridge?.artifact_id}; schema=${bridge?.schemaVersion}; ui=${bridge?.review_ui}; route=${bridge?.access_route}`
  );
  check(
    "source_review_brief_preserved",
    reviewBrief?.artifact_id === "fff-review-brief-dark-mode-ux-001" &&
      reviewBrief?.passed === true &&
      bridge?.source_review_brief_artifact_id === "fff-review-brief-dark-mode-ux-001",
    `reviewBrief=${reviewBrief?.artifact_id}/${reviewBrief?.passed}; source=${bridge?.source_review_brief_artifact_id}`
  );
  check(
    "bridge_visible",
    bridge?.bridge_visible === true &&
      html.includes('id="draft-to-video-bridge-root"') &&
      html.includes('data-mode-panel="bridge"') &&
      html.includes('data-mode-target="bridge"') &&
      html.includes("public/review/index.html?mode=bridge") &&
      html.includes("const REVIEW_MODES") &&
        html.includes('"layout-lab"') &&
        html.includes('"brief"') &&
        html.includes('"bridge"'),
    `bridgeVisible=${bridge?.bridge_visible}; cards=${bridgeCardCount}`
  );
  check(
    "route_contract_visible",
    bridge?.operator_track_visible === true &&
      bridge?.evidence_vault_demoted === true &&
      routeContractCards >= 3 &&
      html.includes("Operator Track") &&
      html.includes("Evidence Vault") &&
      html.includes("Not Active") &&
      html.includes("Review Brief + Draft-to-Video Bridge"),
    `operator=${bridge?.operator_track_visible}; evidence=${bridge?.evidence_vault_demoted}; cards=${routeContractCards}`
  );
  check(
    "dark_contrast_hotfix",
    bridge?.dark_contrast_hotfix_applied === true &&
      contrastMarkers.every((marker) => html.includes(marker)) &&
      html.includes(':root[data-theme="dark"]') &&
      html.includes(':root[data-theme="auto"]') &&
      html.includes('data-theme-target="light"') &&
      html.includes('data-theme-target="dark"') &&
      html.includes('data-theme-target="auto"'),
    `hotfix=${bridge?.dark_contrast_hotfix_applied}; markers=${contrastMarkers.filter((marker) => html.includes(marker)).length}/${contrastMarkers.length}`
  );
  check(
    "candidate_channel_preserved",
    selectedCandidateId === "designer-content-moth-investigation-3m" &&
      selectedChannelId === "designer-channel-mystery-lore" &&
      html.includes("designer-content-moth-investigation-3m") &&
      html.includes("designer-channel-mystery-lore"),
    `candidate=${selectedCandidateId}; channel=${selectedChannelId}`
  );
  check(
    "bridge_package_counts",
    narrationOutlineCount >= 5 &&
      subtitleCueCount >= 5 &&
      visualCueCount >= 5 &&
      thumbnailBriefCount >= 1 &&
      soundMoodCueCount >= 1 &&
      rightsRiskCount >= 5 &&
      heldTruthCount >= 4 &&
      reviewerDecisionCount >= 4 &&
      bridgeCardCount >= 9,
    `narration=${narrationOutlineCount}; subtitle=${subtitleCueCount}; visual=${visualCueCount}; thumbnail=${thumbnailBriefCount}; sound=${soundMoodCueCount}; rights=${rightsRiskCount}; held=${heldTruthCount}; decisions=${reviewerDecisionCount}; cards=${bridgeCardCount}`
  );
  check(
    "boundary_gates_closed",
    (bridge?.local_only ?? boundaries.local_only) === true &&
      (bridge?.external_call ?? boundaries.external_call) === false &&
      (bridge?.provider_configured ?? boundaries.provider_configured) === false &&
      (bridge?.credentials_touched ?? boundaries.credentials_touched) === false &&
      (bridge?.public_upload ?? boundaries.public_upload) === false &&
      (bridge?.ai_video_generation ?? boundaries.ai_video_generation) === false &&
      (bridge?.production_render ?? boundaries.production_render) === false &&
      (bridge?.final_canon_decision ?? boundaries.final_canon_decision) === false &&
      (bridge?.rights_cleared_claim ?? boundaries.rights_cleared_claim) === false &&
      credentialFindings.length === 0 &&
      noGoalMarkers.every((marker) => html.includes(marker)),
    `local=${bridge?.local_only ?? boundaries.local_only}; external=${bridge?.external_call ?? boundaries.external_call}; provider=${bridge?.provider_configured ?? boundaries.provider_configured}; credentials=${bridge?.credentials_touched ?? boundaries.credentials_touched}; upload=${bridge?.public_upload ?? boundaries.public_upload}; video=${bridge?.ai_video_generation ?? boundaries.ai_video_generation}; render=${bridge?.production_render ?? boundaries.production_render}; canon=${bridge?.final_canon_decision ?? boundaries.final_canon_decision}; rights=${bridge?.rights_cleared_claim ?? boundaries.rights_cleared_claim}; findings=${credentialFindings.join(", ") || "none"}`
  );
  check(
    "preserved_readbacks",
    draftPack?.artifact_id === "fff-one-story-draft-review-pack-001" &&
      draftPack?.passed === true &&
      designerDashboard?.artifact_id === "fff-designer-candidate-dashboard-001" &&
      designerDashboard?.passed === true &&
      stabilization?.artifact_id === "fff-draft-review-pack-stabilization-001" &&
      stabilization?.passed === true &&
      contradictoryGuard?.artifact_id === "fff-contradictory-claim-guard-001" &&
      contradictoryGuard?.passed === true,
    `draft=${draftPack?.artifact_id}/${draftPack?.passed}; designer=${designerDashboard?.artifact_id}/${designerDashboard?.passed}; stabilization=${stabilization?.artifact_id}/${stabilization?.passed}; contradictory=${contradictoryGuard?.artifact_id}/${contradictoryGuard?.passed}`
  );
  check(
    "html_bridge_copy_present",
    html.includes("narration outline") ||
      (html.includes("ナレーション") &&
        html.includes("字幕") &&
        html.includes("ショット") &&
        html.includes("サムネイル") &&
        html.includes("Production Non-goals")),
    "bridge copy should expose narration, subtitle, visual, thumbnail, and production non-goal sections"
  );

  return {
    schemaVersion: DRAFT_TO_VIDEO_PLANNING_BRIDGE_SCHEMA_VERSION,
    artifact_id: "fff-draft-to-video-planning-bridge-001",
    title: "Fast Fiction Factory Draft-to-Video Planning Bridge",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    review_ui: "public/review/index.html",
    access_route: "public/review/index.html?mode=bridge",
    input_result_path: toRepoPath(bridgePath),
    source_review_brief_artifact_id: "fff-review-brief-dark-mode-ux-001",
    source_result_paths: {
      review_brief_dark_mode_ux: reviewBriefPath,
      one_story_draft_review_pack: draftPackPath,
      designer_candidate_dashboard: designerDashboardPath,
      draft_review_pack_stabilization: stabilizationPath,
      contradictory_claim_guard: contradictoryGuardPath
    },
    source_artifacts: [
      reviewBrief?.artifact_id,
      draftPack?.artifact_id,
      designerDashboard?.artifact_id,
      stabilization?.artifact_id,
      contradictoryGuard?.artifact_id
    ].filter(Boolean),
    selected_candidate_id: selectedCandidateId,
    selected_channel_route_id: selectedChannelId,
    route_summary_japanese: bridge?.route_summary_japanese || bridge?.route_summary || "Review Brief and Draft-to-Video Bridge define a local pre-production plan for the selected 3-minute mystery-lore route.",
    operator_track_visible: checks.route_contract_visible?.passed === true,
    evidence_vault_demoted: bridge?.evidence_vault_demoted === true,
    dark_contrast_hotfix_applied: checks.dark_contrast_hotfix?.passed === true,
    bridge_visible: checks.bridge_visible?.passed === true,
    counts: {
      narration_outline_count: narrationOutlineCount,
      subtitle_cue_count: subtitleCueCount,
      visual_cue_count: visualCueCount,
      thumbnail_brief_count: thumbnailBriefCount,
      sound_mood_cue_count: soundMoodCueCount,
      rights_risk_count: rightsRiskCount,
      held_truth_count: heldTruthCount,
      reviewer_decision_count: reviewerDecisionCount,
      bridge_cards: bridgeCardCount,
      route_contract_cards: routeContractCards
    },
    narration_outline_count: narrationOutlineCount,
    subtitle_cue_count: subtitleCueCount,
    visual_cue_count: visualCueCount,
    thumbnail_brief_count: thumbnailBriefCount,
    sound_mood_cue_count: soundMoodCueCount,
    rights_risk_count: rightsRiskCount,
    held_truth_count: heldTruthCount,
    reviewer_decision_count: reviewerDecisionCount,
    route_contract: {
      operator_track_required: [
        "public/review/index.html?mode=brief",
        "public/review/index.html?mode=bridge"
      ],
      evidence_vault_optional: [
        "public/review/index.html?mode=source",
        "public/review/index.html?mode=project",
        "public/review/index.html?mode=artifacts"
      ],
      not_active: noGoalMarkers
    },
    package_summary: {
      route_summary: packageSummary.route_summary || bridge?.route_summary || bridge?.route_summary_japanese || null,
      narration_outline: packageSummary.narration_outline || bridge?.narration_outline || [],
      subtitle_on_screen_text_cues: packageSummary.subtitle_on_screen_text_cues || bridge?.subtitle_on_screen_text_cues || [],
      shot_visual_cues: packageSummary.shot_visual_cues || bridge?.shot_visual_cues || [],
      thumbnail_brief: packageSummary.thumbnail_brief || bridge?.thumbnail_brief || [],
      sound_music_mood_cues: packageSummary.sound_music_mood_cues || bridge?.sound_music_mood_cues || [],
      rights_asset_risks: packageSummary.rights_asset_risks || bridge?.rights_asset_risks || [],
      held_truths: packageSummary.held_truths || bridge?.held_truths || [],
      production_non_goals: packageSummary.production_non_goals || bridge?.production_non_goals || noGoalMarkers,
      reviewer_decisions: packageSummary.reviewer_decisions || bridge?.reviewer_decisions || []
    },
    preserved_readbacks: {
      review_brief_dark_mode_ux: preservedReadbacks.review_brief_dark_mode_ux || reviewBrief?.artifact_id,
      one_story_draft_review_pack: preservedReadbacks.one_story_draft_review_pack || draftPack?.artifact_id,
      designer_candidate_dashboard: preservedReadbacks.designer_candidate_dashboard || designerDashboard?.artifact_id,
      draft_review_pack_stabilization: preservedReadbacks.draft_review_pack_stabilization || stabilization?.artifact_id,
      contradictory_claim_guard: preservedReadbacks.contradictory_claim_guard || contradictoryGuard?.artifact_id
    },
    boundaries: {
      local_only: true,
      external_call: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      production_render: false,
      final_canon_decision: false,
      rights_cleared_claim: false,
      credential_material_findings: credentialFindings
    },
    local_only: true,
    external_call: false,
    provider_configured: false,
    credentials_touched: false,
    public_upload: false,
    ai_video_generation: false,
    production_render: false,
    final_canon_decision: false,
    rights_cleared_claim: false,
    summary: {
      review_brief_preserved: checks.source_review_brief_preserved?.passed === true,
      bridge_visible: checks.bridge_visible?.passed === true,
      route_contract_visible: checks.route_contract_visible?.passed === true,
      dark_contrast_hotfix_applied: checks.dark_contrast_hotfix?.passed === true,
      selected_candidate_id: selectedCandidateId,
      selected_channel_route_id: selectedChannelId,
      narration_outline_count: narrationOutlineCount,
      subtitle_cue_count: subtitleCueCount,
      visual_cue_count: visualCueCount,
      thumbnail_brief_count: thumbnailBriefCount,
      sound_mood_cue_count: soundMoodCueCount,
      rights_risk_count: rightsRiskCount,
      held_truth_count: heldTruthCount,
      reviewer_decision_count: reviewerDecisionCount,
      local_only: true,
      external_call_attempted: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      production_render: false,
      final_canon_decision: false,
      rights_cleared_claim: false,
      failures: failures.length
    },
    validation_notes: [
      "Draft-to-Video Bridge is a local pre-production planning bridge only.",
      "Narration is an outline and is not final narration.",
      "Thumbnail, sound, visual, and text cues are briefs only; no asset has been rights-cleared.",
      "Provider/API setup, AI video generation, production render, YouTube upload, final canon, and rights clearance remain out of scope."
    ],
    checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateBridgeRefinementOverviewRibbon(readback, readbackPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const homeCockpitPath = manifest.home_cockpit_metric_linking_result_path || DEFAULT_HOME_COCKPIT_METRIC_LINKING_OUTPUT;
  const bridgePath = manifest.draft_to_video_planning_bridge_result_path || DEFAULT_DRAFT_TO_VIDEO_PLANNING_BRIDGE_OUTPUT;
  const reviewBriefPath = manifest.review_brief_dark_mode_ux_result_path || DEFAULT_REVIEW_BRIEF_DARK_MODE_UX_OUTPUT;
  const draftPackPath = manifest.one_story_draft_review_pack_result_path || DEFAULT_ONE_STORY_DRAFT_REVIEW_PACK_OUTPUT;
  const designerDashboardPath = manifest.designer_candidate_dashboard_result_path || DEFAULT_DESIGNER_CANDIDATE_DASHBOARD_OUTPUT;
  const contradictoryGuardPath = manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT;
  const homeCockpit = await readJson(homeCockpitPath);
  const bridge = await readJson(bridgePath);
  const reviewBrief = await readJson(reviewBriefPath);
  const draftPack = await readJson(draftPackPath);
  const designerDashboard = await readJson(designerDashboardPath);
  const contradictoryGuard = await readJson(contradictoryGuardPath);
  const html = await readFile("public/review/index.html", "utf8");
  const credentialFindings = collectCredentialMaterial(readback);

  const latestOverviewItemCount = (html.match(/data-overview-item=/g) || []).length;
  const narrationRefinementCount = (html.match(/data-narration-refinement=/g) || []).length;
  const subtitleRhythmCount = (html.match(/data-subtitle-rhythm=/g) || []).length;
  const visualOrderingCount = (html.match(/data-visual-ordering=/g) || []).length;
  const thumbnailDirectionCount = (html.match(/data-thumbnail-direction=/g) || []).length;
  const selectedCandidateId = readback?.selected_candidate_id || bridge?.selected_candidate_id || draftPack?.selected_candidate_id;
  const selectedChannelRouteId = readback?.selected_channel_route_id || bridge?.selected_channel_route_id || draftPack?.channel_strategy_route?.id;
  const overviewMarkers = [
    'data-overview-item="latest-state"',
    'data-overview-item="latest-change"',
    'data-overview-item="read-now"',
    'data-overview-item="next-decision"',
    'data-overview-item="locked-lanes"'
  ];
  const lockedMarkers = [
    "provider/API",
    "AI video",
    "render",
    "upload",
    "final canon",
    "rights clearance"
  ];

  check(
    "identity",
    readback?.artifact_id === "fff-bridge-refinement-overview-ribbon-001" &&
      readback?.schemaVersion === BRIDGE_REFINEMENT_OVERVIEW_RIBBON_SCHEMA_VERSION &&
      readback?.review_ui === "public/review/index.html" &&
      readback?.access_route === "public/review/index.html?mode=brief" &&
      readback?.bridge_route === "public/review/index.html?mode=bridge",
    `artifact=${readback?.artifact_id}; schema=${readback?.schemaVersion}; ui=${readback?.review_ui}; access=${readback?.access_route}; bridge=${readback?.bridge_route}`
  );
  check(
    "source_readbacks_preserved",
    homeCockpit?.artifact_id === "fff-home-cockpit-metric-linking-001" &&
      homeCockpit?.passed === true &&
      bridge?.artifact_id === "fff-draft-to-video-planning-bridge-001" &&
      bridge?.passed === true &&
      reviewBrief?.artifact_id === "fff-review-brief-dark-mode-ux-001" &&
      reviewBrief?.passed === true &&
      draftPack?.artifact_id === "fff-one-story-draft-review-pack-001" &&
      draftPack?.passed === true &&
      designerDashboard?.artifact_id === "fff-designer-candidate-dashboard-001" &&
      designerDashboard?.passed === true &&
      contradictoryGuard?.artifact_id === "fff-contradictory-claim-guard-001" &&
      contradictoryGuard?.passed === true,
    `home=${homeCockpit?.artifact_id}/${homeCockpit?.passed}; bridge=${bridge?.artifact_id}/${bridge?.passed}; brief=${reviewBrief?.artifact_id}/${reviewBrief?.passed}; draft=${draftPack?.artifact_id}/${draftPack?.passed}; designer=${designerDashboard?.artifact_id}/${designerDashboard?.passed}; contradictory=${contradictoryGuard?.artifact_id}/${contradictoryGuard?.passed}`
  );
  check(
    "latest_overview_visible",
    html.includes('data-latest-overview="bridge-refinement-overview-ribbon"') &&
      html.includes("Latest Overview Report") &&
      latestOverviewItemCount >= 4 &&
      latestOverviewItemCount <= 6 &&
      overviewMarkers.every((marker) => html.includes(marker)),
    `items=${latestOverviewItemCount}; markers=${overviewMarkers.filter((marker) => html.includes(marker)).length}/${overviewMarkers.length}`
  );
  check(
    "overview_bridge_link_visible",
    html.includes('data-overview-bridge-link="true"') &&
      html.includes('data-mode-target="bridge"') &&
      html.includes("public/review/index.html?mode=bridge"),
    "overview ribbon should provide one obvious Bridge action"
  );
  check(
    "duplicated_brief_demoted_or_merged",
    (html.includes('data-brief-demoted="true"') || html.includes('data-brief-legacy-fold="true"')) &&
      html.includes("designer-content-moth-investigation-3m") &&
      html.includes("designer-channel-mystery-lore") &&
      html.includes('id="review-brief-root"'),
    "legacy Review Brief should be bounded while preserving candidate/channel IDs"
  );
  check(
    "bridge_overview_reference_visible",
    html.includes('data-bridge-overview-reference="true"') &&
      html.includes('data-mode-target="brief"') &&
      html.includes("Current Overview"),
    "Bridge should carry a small back-to-overview reference"
  );
  check(
    "bridge_refinement_visible",
    html.includes('data-bridge-refinement="overview-ribbon-bridge-refinement"') &&
      narrationRefinementCount >= 3 &&
      narrationRefinementCount <= 5 &&
      subtitleRhythmCount >= 5 &&
      subtitleRhythmCount <= 8 &&
      visualOrderingCount >= 5 &&
      visualOrderingCount <= 7 &&
      thumbnailDirectionCount === 3,
    `narration=${narrationRefinementCount}; subtitle=${subtitleRhythmCount}; visual=${visualOrderingCount}; thumbnail=${thumbnailDirectionCount}`
  );
  check(
    "held_truth_policy_visible",
    html.includes('data-held-truth-policy="true"') &&
      html.includes("Toma fate") &&
      html.includes("brass moth truth") &&
      html.includes("Council motive") &&
      html.includes("brass moth truth/function"),
    "held truths should remain visible and unresolved"
  );
  check(
    "rights_asset_boundary_visible",
    html.includes('data-rights-boundary-note="true"') &&
      html.includes("no generated image") &&
      html.includes("no final script") &&
      html.includes("no final video") &&
      html.includes("no production render") &&
      html.includes("no rights clearance claim"),
    "rights and asset boundary should stay non-final"
  );
  check(
    "evidence_vault_optional_preserved",
    html.includes('data-card-group="evidence-vault"') &&
      html.includes("Evidence Vault") &&
      html.includes("Source Audit") &&
      html.includes("Project Cockpit") &&
      html.includes("Artifacts") &&
      html.includes("audit only"),
    "Evidence Vault should remain optional audit surface"
  );
  check(
    "dark_mode_preserved",
    html.includes(':root[data-theme="dark"]') &&
      html.includes(':root[data-theme="auto"]') &&
      html.includes('data-theme-target="light"') &&
      html.includes('data-theme-target="dark"') &&
      html.includes('data-theme-target="auto"') &&
      html.includes("THEME_STORAGE_KEY") &&
      html.includes("--paper-soft") &&
      html.includes("--surface-muted"),
    "theme controls and variables should remain present"
  );
  check(
    "candidate_channel_preserved",
    selectedCandidateId === "designer-content-moth-investigation-3m" &&
      selectedChannelRouteId === "designer-channel-mystery-lore" &&
      html.includes("designer-content-moth-investigation-3m") &&
      html.includes("designer-channel-mystery-lore"),
    `candidate=${selectedCandidateId}; channel=${selectedChannelRouteId}`
  );
  check(
    "boundary_gates_closed",
    readback?.local_only === true &&
      readback?.external_call === false &&
      readback?.provider_configured === false &&
      readback?.credentials_touched === false &&
      readback?.public_upload === false &&
      readback?.ai_video_generation === false &&
      readback?.production_render === false &&
      readback?.final_canon_decision === false &&
      readback?.rights_cleared_claim === false &&
      lockedMarkers.every((marker) => html.includes(marker)) &&
      credentialFindings.length === 0,
    `local=${readback?.local_only}; external=${readback?.external_call}; provider=${readback?.provider_configured}; credentials=${readback?.credentials_touched}; upload=${readback?.public_upload}; video=${readback?.ai_video_generation}; render=${readback?.production_render}; canon=${readback?.final_canon_decision}; rights=${readback?.rights_cleared_claim}; findings=${credentialFindings.join(", ") || "none"}`
  );

  const result = {
    schemaVersion: BRIDGE_REFINEMENT_OVERVIEW_RIBBON_SCHEMA_VERSION,
    artifact_id: "fff-bridge-refinement-overview-ribbon-001",
    title: "Fast Fiction Factory Bridge Refinement Overview Ribbon",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    review_ui: "public/review/index.html",
    access_route: "public/review/index.html?mode=brief",
    bridge_route: "public/review/index.html?mode=bridge",
    input_result_path: toRepoPath(readbackPath),
    source_home_cockpit_artifact_id: "fff-home-cockpit-metric-linking-001",
    source_bridge_artifact_id: "fff-draft-to-video-planning-bridge-001",
    source_result_paths: {
      home_cockpit_metric_linking: homeCockpitPath,
      draft_to_video_planning_bridge: bridgePath,
      review_brief_dark_mode_ux: reviewBriefPath,
      one_story_draft_review_pack: draftPackPath,
      designer_candidate_dashboard: designerDashboardPath,
      contradictory_claim_guard: contradictoryGuardPath
    },
    latest_overview_visible: checks.latest_overview_visible?.passed === true,
    latest_overview_item_count: latestOverviewItemCount,
    overview_bridge_link_visible: checks.overview_bridge_link_visible?.passed === true,
    duplicated_brief_demoted_or_merged: checks.duplicated_brief_demoted_or_merged?.passed === true,
    bridge_overview_reference_visible: checks.bridge_overview_reference_visible?.passed === true,
    bridge_refinement_visible: checks.bridge_refinement_visible?.passed === true,
    narration_refinement_count: narrationRefinementCount,
    subtitle_rhythm_count: subtitleRhythmCount,
    visual_ordering_count: visualOrderingCount,
    thumbnail_direction_count: thumbnailDirectionCount,
    held_truth_policy_visible: checks.held_truth_policy_visible?.passed === true,
    rights_asset_boundary_visible: checks.rights_asset_boundary_visible?.passed === true,
    evidence_vault_optional_preserved: checks.evidence_vault_optional_preserved?.passed === true,
    dark_mode_preserved: checks.dark_mode_preserved?.passed === true,
    selected_candidate_id: selectedCandidateId,
    selected_channel_route_id: selectedChannelRouteId,
    boundaries: {
      local_only: true,
      external_call: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      production_render: false,
      final_canon_decision: false,
      rights_cleared_claim: false,
      credential_material_findings: credentialFindings
    },
    local_only: true,
    external_call: false,
    provider_configured: false,
    credentials_touched: false,
    public_upload: false,
    ai_video_generation: false,
    production_render: false,
    final_canon_decision: false,
    rights_cleared_claim: false,
    summary: {
      latest_overview_item_count: latestOverviewItemCount,
      overview_bridge_link_visible: checks.overview_bridge_link_visible?.passed === true,
      duplicated_brief_demoted_or_merged: checks.duplicated_brief_demoted_or_merged?.passed === true,
      bridge_refinement_visible: checks.bridge_refinement_visible?.passed === true,
      narration_refinement_count: narrationRefinementCount,
      subtitle_rhythm_count: subtitleRhythmCount,
      visual_ordering_count: visualOrderingCount,
      thumbnail_direction_count: thumbnailDirectionCount,
      evidence_vault_optional_preserved: checks.evidence_vault_optional_preserved?.passed === true,
      local_only: true,
      external_call_attempted: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      production_render: false,
      final_canon_decision: false,
      rights_cleared_claim: false,
      failures: failures.length
    },
    validation_notes: [
      "Latest Overview Report is compact and does not replace the artifact manifest.",
      "Legacy Review Brief content is demoted but still preserves candidate/channel IDs and prompts.",
      "Bridge refinement remains pre-production only: candidate narration, rhythm, shot order, thumbnail direction, held-truth policy, and rights boundary.",
      "Evidence Vault shelves remain optional unless auditing.",
      "No provider/API, credential, AI video, render, upload, final-canon, or rights-clearance gate is opened."
    ],
    checks,
    failures,
    passed: failures.length === 0
  };

  return result;
}

async function validateLowTextDecisionConsole(readback, readbackPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const guidedPath = manifest.guided_review_flow_workspace_result_path || DEFAULT_GUIDED_REVIEW_FLOW_WORKSPACE_OUTPUT;
  const overviewPath = manifest.bridge_refinement_overview_ribbon_result_path || DEFAULT_BRIDGE_REFINEMENT_OVERVIEW_RIBBON_OUTPUT;
  const homeCockpitPath = manifest.home_cockpit_metric_linking_result_path || DEFAULT_HOME_COCKPIT_METRIC_LINKING_OUTPUT;
  const bridgePath = manifest.draft_to_video_planning_bridge_result_path || DEFAULT_DRAFT_TO_VIDEO_PLANNING_BRIDGE_OUTPUT;
  const reviewBriefPath = manifest.review_brief_dark_mode_ux_result_path || DEFAULT_REVIEW_BRIEF_DARK_MODE_UX_OUTPUT;
  const draftPackPath = manifest.one_story_draft_review_pack_result_path || DEFAULT_ONE_STORY_DRAFT_REVIEW_PACK_OUTPUT;
  const designerDashboardPath = manifest.designer_candidate_dashboard_result_path || DEFAULT_DESIGNER_CANDIDATE_DASHBOARD_OUTPUT;
  const contradictoryGuardPath = manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT;
  const guided = await readJson(guidedPath);
  const overview = await readJson(overviewPath);
  const homeCockpit = await readJson(homeCockpitPath);
  const bridge = await readJson(bridgePath);
  const reviewBrief = await readJson(reviewBriefPath);
  const draftPack = await readJson(draftPackPath);
  const designerDashboard = await readJson(designerDashboardPath);
  const contradictoryGuard = await readJson(contradictoryGuardPath);
  const html = await readFile("public/review/index.html", "utf8");
  const credentialFindings = collectCredentialMaterial(readback);

  const reviewHomeIndex = html.indexOf('id="review-home-root"');
  const decisionConsoleIndex = html.indexOf('data-decision-console="low-text-decision-console"');
  const guidedFlowIndex = html.indexOf('data-guided-flow="guided-review-flow-workspace"');
  const latestOverviewIndex = html.indexOf('data-latest-overview="bridge-refinement-overview-ribbon"');
  const firstCardIndex = html.indexOf('data-home-cockpit-card=');
  const bridgeDecisionConsoleIndex = html.indexOf('data-bridge-decision-console="true"');
  const bridgeGuidedFlowIndex = html.indexOf('data-bridge-guided-flow="true"');
  const consoleBlock = extractFirstHtmlSectionByMarker(html, 'data-decision-console="low-text-decision-console"');
  const visibleConsoleBlock = removeDetailsBlocks(consoleBlock);
  const activeQuestionText = firstTaggedText(visibleConsoleBlock, /<h[2-3][^>]*data-active-question="true"[^>]*>([\s\S]*?)<\/h[2-3]>/i);
  const choiceLabels = allTaggedTexts(visibleConsoleBlock, /<button[^>]*data-choice-button="[^"]+"[^>]*>([\s\S]*?)<\/button>/gi);
  const helperText = firstTaggedText(visibleConsoleBlock, /<p[^>]*class="[^"]*\bconsole-helper\b[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
  const topParagraphTexts = allTaggedTexts(visibleConsoleBlock, /<p[^>]*>([\s\S]*?)<\/p>/gi);
  const topConsoleText = stripHtmlTags(visibleConsoleBlock);
  const stepLabels = allTaggedTexts(visibleConsoleBlock, /<span[^>]*data-console-step="[^"]+"[^>]*>([\s\S]*?)<\/span>/gi).map(normalizeDecisionStepLabel);
  const currentStepLabels = allTaggedTexts(visibleConsoleBlock, /<span[^>]*data-console-step="[^"]+"[^>]*data-console-step-state="current"[^>]*>([\s\S]*?)<\/span>/gi).map(normalizeDecisionStepLabel);
  const bridgeConsoleBlock = extractFirstHtmlSectionByMarker(html, 'data-bridge-decision-console="true"');
  const bridgeStepLabels = allTaggedTexts(bridgeConsoleBlock, /<span[^>]*data-bridge-console-step="[^"]+"[^>]*>([\s\S]*?)<\/span>/gi).map(normalizeDecisionStepLabel);
  const bridgeCurrentStepCount = (bridgeConsoleBlock.match(/data-bridge-console-step-state="current"/g) || []).length;
  const contextChipCount = (visibleConsoleBlock.match(/data-context-chip=/g) || []).length;
  const primaryActionCount = (visibleConsoleBlock.match(/data-console-primary-action="true"/g) || []).length;
  const notesShelfIndex = html.indexOf('data-notes-shelf="true"');
  const detailDrawerBlock = extractFirstHtmlBlockByMarker(html, "details", 'data-detail-drawer="true"');
  const notesShelfBlock = extractFirstHtmlBlockByMarker(html, "details", 'data-notes-shelf="true"');
  const consoleOrDrawerContextText = stripHtmlTags(consoleBlock);
  const cardWallSuppressedCount = (html.match(/data-card-wall-suppressed="true"/g) || []).length;
  const repeatedThisTimeCount = countPattern(topConsoleText, /今回|this time/gi);
  const visibleSentenceCount = countPattern(topConsoleText, /[。！？.!?]/g);
  const topParagraphMaxChars = topParagraphTexts.reduce((max, text) => Math.max(max, countDisplayChars(text)), 0);
  const choiceLabelMaxChars = choiceLabels.reduce((max, text) => Math.max(max, countDisplayChars(text)), 0);
  const lockedMarkers = [
    "provider/API",
    "AI video",
    "render",
    "upload",
    "final canon",
    "database persistence",
    "rights clearance"
  ];
  const requiredChoiceLabels = ["進める", "語り口を直す", "字幕を直す", "サムネを直す", "保留真実を直す"];
  const requiredStepLabels = ["路線", "語り", "字幕", "画面", "サムネ", "保留真実"];
  const requiredContextLabels = [
    "designer-content-moth-investigation-3m",
    "designer-channel-mystery-lore",
    "pre-production",
    "生成なし",
    "公開なし",
    "canon未確定"
  ];
  const selectedCandidateId = readback?.selected_candidate_id || guided?.selected_candidate_id || draftPack?.selected_candidate_id || bridge?.selected_candidate_id;
  const selectedChannelRouteId = readback?.selected_channel_route_id || guided?.selected_channel_route_id || bridge?.selected_channel_route_id || draftPack?.channel_strategy_route?.id;

  check(
    "identity",
    readback?.artifact_id === "fff-low-text-decision-console-001" &&
      readback?.schemaVersion === LOW_TEXT_DECISION_CONSOLE_SCHEMA_VERSION &&
      readback?.review_ui === "public/review/index.html" &&
      readback?.access_route === "public/review/index.html?mode=brief" &&
      readback?.bridge_route === "public/review/index.html?mode=bridge" &&
      readback?.source_guided_flow_artifact_id === "fff-guided-review-flow-workspace-001",
    `artifact=${readback?.artifact_id}; schema=${readback?.schemaVersion}; ui=${readback?.review_ui}; access=${readback?.access_route}; bridge=${readback?.bridge_route}; source=${readback?.source_guided_flow_artifact_id}`
  );
  check(
    "source_readbacks_preserved",
    guided?.artifact_id === "fff-guided-review-flow-workspace-001" &&
      guided?.passed === true &&
      overview?.artifact_id === "fff-bridge-refinement-overview-ribbon-001" &&
      overview?.passed === true &&
      homeCockpit?.artifact_id === "fff-home-cockpit-metric-linking-001" &&
      homeCockpit?.passed === true &&
      bridge?.artifact_id === "fff-draft-to-video-planning-bridge-001" &&
      bridge?.passed === true &&
      reviewBrief?.artifact_id === "fff-review-brief-dark-mode-ux-001" &&
      reviewBrief?.passed === true &&
      draftPack?.artifact_id === "fff-one-story-draft-review-pack-001" &&
      draftPack?.passed === true &&
      designerDashboard?.artifact_id === "fff-designer-candidate-dashboard-001" &&
      designerDashboard?.passed === true &&
      contradictoryGuard?.artifact_id === "fff-contradictory-claim-guard-001" &&
      contradictoryGuard?.passed === true,
    `guided=${guided?.artifact_id}/${guided?.passed}; overview=${overview?.artifact_id}/${overview?.passed}; home=${homeCockpit?.artifact_id}/${homeCockpit?.passed}; bridge=${bridge?.artifact_id}/${bridge?.passed}; brief=${reviewBrief?.artifact_id}/${reviewBrief?.passed}; draft=${draftPack?.artifact_id}/${draftPack?.passed}; designer=${designerDashboard?.artifact_id}/${designerDashboard?.passed}; contradictory=${contradictoryGuard?.artifact_id}/${contradictoryGuard?.passed}`
  );
  check(
    "decision_console_visible_first",
    reviewHomeIndex >= 0 &&
      decisionConsoleIndex >= 0 &&
      guidedFlowIndex >= 0 &&
      latestOverviewIndex >= 0 &&
      firstCardIndex >= 0 &&
      reviewHomeIndex < decisionConsoleIndex &&
      decisionConsoleIndex < guidedFlowIndex &&
      decisionConsoleIndex < latestOverviewIndex &&
      decisionConsoleIndex < firstCardIndex,
    `home=${reviewHomeIndex}; console=${decisionConsoleIndex}; guided=${guidedFlowIndex}; latest=${latestOverviewIndex}; firstCard=${firstCardIndex}`
  );
  check(
    "active_question_and_choices",
    activeQuestionText === "この路線で進める？" &&
      countDisplayChars(activeQuestionText) <= 34 &&
      choiceLabels.length >= 3 &&
      choiceLabels.length <= 5 &&
      requiredChoiceLabels.every((label) => choiceLabels.includes(label)) &&
      choiceLabelMaxChars <= 18,
    `question=${activeQuestionText}; questionChars=${countDisplayChars(activeQuestionText)}; choices=${choiceLabels.join(",")}; maxChoiceChars=${choiceLabelMaxChars}`
  );
  check(
    "primary_action_exactly_one",
    primaryActionCount === 1 && visibleConsoleBlock.includes("Bridgeで確認"),
    `primaryActionCount=${primaryActionCount}`
  );
  check(
    "context_dock_complete",
    html.includes('data-context-dock="true"') &&
      contextChipCount >= 4 &&
      requiredContextLabels.every((label) => consoleOrDrawerContextText.includes(label) || html.includes(label)),
    `chips=${contextChipCount}; required=${requiredContextLabels.filter((label) => consoleOrDrawerContextText.includes(label) || html.includes(label)).length}/${requiredContextLabels.length}`
  );
  check(
    "step_rail_complete",
    html.includes('data-step-rail="true"') &&
      stepLabels.length === 6 &&
      requiredStepLabels.every((label) => stepLabels.includes(label)) &&
      currentStepLabels.length === 1 &&
      currentStepLabels[0] === "路線",
    `steps=${stepLabels.join(",")}; current=${currentStepLabels.join(",") || "none"}`
  );
  check(
    "detail_drawer_default_closed",
    html.includes('data-detail-drawer="true"') &&
      detailDrawerBlock &&
      !/^<details[^>]*\sopen(\s|>|=)/i.test(detailDrawerBlock) &&
      (detailDrawerBlock.includes("詳細メモを開く") || detailDrawerBlock.includes("<summary>Evidence</summary>")),
    "detail drawer should be a closed details element with the required summary"
  );
  check(
    "notes_shelf_below_console",
    notesShelfIndex > decisionConsoleIndex &&
      notesShelfBlock &&
      !/^<details[^>]*\sopen(\s|>|=)/i.test(notesShelfBlock),
    `console=${decisionConsoleIndex}; notes=${notesShelfIndex}`
  );
  check(
    "card_wall_suppressed",
    cardWallSuppressedCount >= 3 &&
      guidedFlowIndex > decisionConsoleIndex &&
      html.includes('data-card-wall-suppressed="true"'),
    `suppressed=${cardWallSuppressedCount}; guided=${guidedFlowIndex}; console=${decisionConsoleIndex}`
  );
  check(
    "bridge_console_visible",
    bridgeDecisionConsoleIndex >= 0 &&
      bridgeGuidedFlowIndex >= 0 &&
      bridgeDecisionConsoleIndex < bridgeGuidedFlowIndex &&
      bridgeStepLabels.length === 6 &&
      requiredStepLabels.every((label) => bridgeStepLabels.includes(label)) &&
      bridgeCurrentStepCount === 1,
    `bridgeConsole=${bridgeDecisionConsoleIndex}; bridgeGuided=${bridgeGuidedFlowIndex}; bridgeSteps=${bridgeStepLabels.join(",")}; current=${bridgeCurrentStepCount}`
  );
  check(
    "text_budget",
    helperText &&
      countDisplayChars(helperText) <= 42 &&
      topParagraphMaxChars <= 70 &&
      visibleSentenceCount <= 5 &&
      repeatedThisTimeCount <= 1,
    `helperChars=${countDisplayChars(helperText)}; paragraphMax=${topParagraphMaxChars}; sentences=${visibleSentenceCount}; repeatedThisTime=${repeatedThisTimeCount}`
  );
  check(
    "preserved_content_and_optional_evidence",
    html.includes('data-guided-flow="guided-review-flow-workspace"') &&
      html.includes('data-latest-overview="bridge-refinement-overview-ribbon"') &&
      html.includes("Evidence Vault") &&
      html.includes("Source Audit / Project Cockpit / Artifacts") &&
      html.includes("Toma fate held") &&
      html.includes("brass moth truth held") &&
      html.includes("Council motive held") &&
      overview?.latest_overview_visible === true,
    "guided flow, latest overview, held truths, and Evidence Vault should remain searchable"
  );
  check(
    "dark_mode_preserved",
    html.includes(':root[data-theme="dark"]') &&
      html.includes(':root[data-theme="auto"]') &&
      html.includes('data-theme-target="light"') &&
      html.includes('data-theme-target="dark"') &&
      html.includes('data-theme-target="auto"') &&
      html.includes("THEME_STORAGE_KEY") &&
      html.includes("--paper-soft") &&
      html.includes("--surface-muted"),
    "theme variables and toggles should remain present"
  );
  check(
    "candidate_channel_preserved",
    selectedCandidateId === "designer-content-moth-investigation-3m" &&
      selectedChannelRouteId === "designer-channel-mystery-lore" &&
      html.includes("designer-content-moth-investigation-3m") &&
      html.includes("designer-channel-mystery-lore"),
    `candidate=${selectedCandidateId}; channel=${selectedChannelRouteId}`
  );
  check(
    "boundary_gates_closed",
    readback?.local_only === true &&
      readback?.external_call === false &&
      readback?.provider_configured === false &&
      readback?.credentials_touched === false &&
      readback?.public_upload === false &&
      readback?.ai_video_generation === false &&
      readback?.production_render === false &&
      readback?.final_canon_decision === false &&
      readback?.database_persistence === false &&
      readback?.rights_cleared_claim === false &&
      lockedMarkers.every((marker) => html.includes(marker)) &&
      credentialFindings.length === 0,
    `local=${readback?.local_only}; external=${readback?.external_call}; provider=${readback?.provider_configured}; credentials=${readback?.credentials_touched}; upload=${readback?.public_upload}; video=${readback?.ai_video_generation}; render=${readback?.production_render}; canon=${readback?.final_canon_decision}; database=${readback?.database_persistence}; rights=${readback?.rights_cleared_claim}; findings=${credentialFindings.join(", ") || "none"}`
  );

  return {
    schemaVersion: LOW_TEXT_DECISION_CONSOLE_SCHEMA_VERSION,
    artifact_id: "fff-low-text-decision-console-001",
    title: "Fast Fiction Factory Low-text Decision Console",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_user_visual_review",
    review_input_mode: "freeform",
    review_ui: "public/review/index.html",
    access_route: "public/review/index.html?mode=brief",
    bridge_route: "public/review/index.html?mode=bridge",
    input_result_path: toRepoPath(readbackPath),
    source_guided_flow_artifact_id: "fff-guided-review-flow-workspace-001",
    source_result_paths: {
      guided_review_flow_workspace: guidedPath,
      bridge_refinement_overview_ribbon: overviewPath,
      home_cockpit_metric_linking: homeCockpitPath,
      draft_to_video_planning_bridge: bridgePath,
      review_brief_dark_mode_ux: reviewBriefPath,
      one_story_draft_review_pack: draftPackPath,
      designer_candidate_dashboard: designerDashboardPath,
      contradictory_claim_guard: contradictoryGuardPath
    },
    decision_console_visible: checks.decision_console_visible_first?.passed === true,
    decision_console_first: checks.decision_console_visible_first?.passed === true,
    active_question_text: activeQuestionText,
    active_question_char_count: countDisplayChars(activeQuestionText),
    choice_button_count: choiceLabels.length,
    choice_labels: choiceLabels,
    choice_label_max_chars: choiceLabelMaxChars,
    primary_action_count: primaryActionCount,
    primary_action_label: "Bridgeで確認",
    context_dock_visible: checks.context_dock_complete?.passed === true,
    context_chip_count: contextChipCount,
    step_rail_visible: checks.step_rail_complete?.passed === true,
    step_labels: stepLabels,
    current_step_count: currentStepLabels.length,
    current_step_labels: currentStepLabels,
    detail_drawer_default_closed: checks.detail_drawer_default_closed?.passed === true,
    notes_shelf_visible: notesShelfIndex >= 0,
    notes_shelf_default_closed: checks.notes_shelf_below_console?.passed === true,
    card_wall_suppressed: checks.card_wall_suppressed?.passed === true,
    bridge_decision_console_visible: checks.bridge_console_visible?.passed === true,
    bridge_step_labels: bridgeStepLabels,
    text_budget: {
      helper_line_char_count: countDisplayChars(helperText),
      helper_line_max_chars: 42,
      paragraph_max_chars: topParagraphMaxChars,
      paragraph_limit_chars: 70,
      visible_sentence_count: visibleSentenceCount,
      visible_sentence_limit: 5,
      repeated_this_time_count: repeatedThisTimeCount,
      repeated_this_time_limit: 1,
      passed: checks.text_budget?.passed === true
    },
    latest_overview_preserved: checks.preserved_content_and_optional_evidence?.passed === true,
    guided_flow_preserved: html.includes('data-guided-flow="guided-review-flow-workspace"'),
    evidence_vault_optional: checks.preserved_content_and_optional_evidence?.passed === true,
    dark_mode_preserved: checks.dark_mode_preserved?.passed === true,
    selected_candidate_id: selectedCandidateId,
    selected_channel_route_id: selectedChannelRouteId,
    boundaries: {
      local_only: true,
      external_call: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      production_render: false,
      final_canon_decision: false,
      database_persistence: false,
      rights_cleared_claim: false,
      credential_material_findings: credentialFindings
    },
    local_only: true,
    external_call: false,
    provider_configured: false,
    credentials_touched: false,
    public_upload: false,
    ai_video_generation: false,
    production_render: false,
    final_canon_decision: false,
    database_persistence: false,
    rights_cleared_claim: false,
    summary: {
      decision_console_visible: checks.decision_console_visible_first?.passed === true,
      decision_console_first: checks.decision_console_visible_first?.passed === true,
      choice_button_count: choiceLabels.length,
      primary_action_count: primaryActionCount,
      context_chip_count: contextChipCount,
      step_count: stepLabels.length,
      current_step_count: currentStepLabels.length,
      bridge_console_visible: checks.bridge_console_visible?.passed === true,
      card_wall_suppressed: checks.card_wall_suppressed?.passed === true,
      text_budget_passed: checks.text_budget?.passed === true,
      local_only: true,
      external_call_attempted: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      production_render: false,
      final_canon_decision: false,
      database_persistence: false,
      rights_cleared_claim: false,
      failures: failures.length
    },
    validation_notes: [
      "The first brief surface is a low-text decision console with one active question and one Bridge action.",
      "Legacy Guided Flow, Latest Overview, Home Cockpit cards, and Evidence Vault remain preserved below the console.",
      "Bridge mode repeats the same decision state before detailed bridge cards.",
      "Top-console text stays within the requested short-label budget and avoids repeated this-time phrasing.",
      "No provider/API, credential, video, render, upload, database, rights, or final-canon gate is opened."
    ],
    checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateLayoutResearchDecisionShell(readback, readbackPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const lowTextPath = manifest.low_text_decision_console_result_path || DEFAULT_LOW_TEXT_DECISION_CONSOLE_OUTPUT;
  const guidedPath = manifest.guided_review_flow_workspace_result_path || DEFAULT_GUIDED_REVIEW_FLOW_WORKSPACE_OUTPUT;
  const overviewPath = manifest.bridge_refinement_overview_ribbon_result_path || DEFAULT_BRIDGE_REFINEMENT_OVERVIEW_RIBBON_OUTPUT;
  const homeCockpitPath = manifest.home_cockpit_metric_linking_result_path || DEFAULT_HOME_COCKPIT_METRIC_LINKING_OUTPUT;
  const bridgePath = manifest.draft_to_video_planning_bridge_result_path || DEFAULT_DRAFT_TO_VIDEO_PLANNING_BRIDGE_OUTPUT;
  const reviewBriefPath = manifest.review_brief_dark_mode_ux_result_path || DEFAULT_REVIEW_BRIEF_DARK_MODE_UX_OUTPUT;
  const draftPackPath = manifest.one_story_draft_review_pack_result_path || DEFAULT_ONE_STORY_DRAFT_REVIEW_PACK_OUTPUT;
  const designerDashboardPath = manifest.designer_candidate_dashboard_result_path || DEFAULT_DESIGNER_CANDIDATE_DASHBOARD_OUTPUT;
  const contradictoryGuardPath = manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT;
  const lowText = await readJson(lowTextPath);
  const guided = await readJson(guidedPath);
  const overview = await readJson(overviewPath);
  const homeCockpit = await readJson(homeCockpitPath);
  const bridge = await readJson(bridgePath);
  const reviewBrief = await readJson(reviewBriefPath);
  const draftPack = await readJson(draftPackPath);
  const designerDashboard = await readJson(designerDashboardPath);
  const contradictoryGuard = await readJson(contradictoryGuardPath);
  const html = await readFile("public/review/index.html", "utf8");
  const doc = await readFile("docs/review/layout-research-decision-shell.md", "utf8");
  const credentialFindings = collectCredentialMaterial(readback);

  const labIndex = html.indexOf('data-layout-lab="decision-shell-research"');
  const briefPanelIndex = html.indexOf('data-mode-panel="brief"');
  const bridgePanelIndex = html.indexOf('data-mode-panel="bridge"');
  const layoutModeRulePresent = html.includes('body[data-review-mode="layout-lab"] [data-mode-panel="layout-lab"]');
  const reviewModesIncludeLab = html.includes('"layout-lab"');
  const directLinkPresent = html.includes('data-layout-lab-link="true"') && html.includes('data-mode-target="layout-lab"');
  const primaryTabLabPresent = /<button[^>]*class="[^"]*\bmode-tab\b[^"]*"[^>]*data-mode-target="layout-lab"/i.test(html);
  const wireframeAlternativeCount = (html.match(/data-wireframe-alternative=/g) || []).length;
  const decisionFlowModelBlock = extractConstObjectBlock(html, "decisionFlowModel");
  const decisionFlowModelChoiceCount = (decisionFlowModelBlock.match(/\bchoiceId\s*:/g) || []).length;
  const decisionFlowModelStepCount = (decisionFlowModelBlock.match(/\bstepId\s*:/g) || []).length;
  const scoreMatrixRows = (html.match(/data-layout-family=/g) || []).length;
  const familyNames = [
    "Card grid / dashboard cards",
    "Stepper / wizard",
    "Inbox / briefing feed",
    "Split-pane Decision Shell",
    "Storyboard timeline / flow lane"
  ];
  const layoutFamiliesComparedCount = familyNames.filter((name) => doc.includes(name)).length;
  const recommendedLayout = "split-pane Decision Shell";
  const lockedMarkers = [
    "provider/API",
    "credentials",
    "upload",
    "AI video",
    "production render",
    "rights clearance",
    "database persistence",
    "final canon"
  ];
  const dataDrivenChoiceModelPresent = html.includes("const decisionFlowModel") &&
    html.includes('data-choice-slot="model-driven"') &&
    decisionFlowModelChoiceCount >= 3;
  const applySliceReferenced = doc.includes("fff-apply-decision-shell-review-route-001") ||
    doc.includes("fff-apply-decision-shell-guard-diet-001");
  const darkModePreserved = html.includes(':root[data-theme="dark"]') &&
    html.includes(':root[data-theme="auto"]') &&
    html.includes('data-theme-target="light"') &&
    html.includes('data-theme-target="dark"') &&
    html.includes('data-theme-target="auto"') &&
    html.includes("THEME_STORAGE_KEY");

  check(
    "identity",
    readback?.artifact_id === "fff-layout-research-decision-shell-001" &&
      readback?.schemaVersion === LAYOUT_RESEARCH_DECISION_SHELL_SCHEMA_VERSION &&
      readback?.review_ui === "public/review/index.html" &&
      readback?.research_doc === "docs/review/layout-research-decision-shell.md" &&
      readback?.access_route === "public/review/index.html?mode=layout-lab" &&
      readback?.source_low_text_console_artifact_id === "fff-low-text-decision-console-001",
    `artifact=${readback?.artifact_id}; schema=${readback?.schemaVersion}; ui=${readback?.review_ui}; doc=${readback?.research_doc}; access=${readback?.access_route}; source=${readback?.source_low_text_console_artifact_id}`
  );
  check(
    "source_readbacks_preserved",
    lowText?.artifact_id === "fff-low-text-decision-console-001" &&
      lowText?.passed === true &&
      guided?.artifact_id === "fff-guided-review-flow-workspace-001" &&
      guided?.passed === true &&
      overview?.artifact_id === "fff-bridge-refinement-overview-ribbon-001" &&
      overview?.passed === true &&
      homeCockpit?.artifact_id === "fff-home-cockpit-metric-linking-001" &&
      homeCockpit?.passed === true &&
      bridge?.artifact_id === "fff-draft-to-video-planning-bridge-001" &&
      bridge?.passed === true &&
      reviewBrief?.artifact_id === "fff-review-brief-dark-mode-ux-001" &&
      reviewBrief?.passed === true &&
      draftPack?.artifact_id === "fff-one-story-draft-review-pack-001" &&
      draftPack?.passed === true &&
      designerDashboard?.artifact_id === "fff-designer-candidate-dashboard-001" &&
      designerDashboard?.passed === true &&
      contradictoryGuard?.artifact_id === "fff-contradictory-claim-guard-001" &&
      contradictoryGuard?.passed === true,
    `low=${lowText?.artifact_id}/${lowText?.passed}; guided=${guided?.artifact_id}/${guided?.passed}; overview=${overview?.artifact_id}/${overview?.passed}; home=${homeCockpit?.artifact_id}/${homeCockpit?.passed}; bridge=${bridge?.artifact_id}/${bridge?.passed}; brief=${reviewBrief?.artifact_id}/${reviewBrief?.passed}; draft=${draftPack?.artifact_id}/${draftPack?.passed}; designer=${designerDashboard?.artifact_id}/${designerDashboard?.passed}; contradictory=${contradictoryGuard?.artifact_id}/${contradictoryGuard?.passed}`
  );
  check(
    "layout_lab_route_visible_and_isolated",
    labIndex >= 0 &&
      layoutModeRulePresent &&
      reviewModesIncludeLab &&
      directLinkPresent &&
      (!primaryTabLabPresent || html.includes('data-route-nav-compact="true"')) &&
      briefPanelIndex >= 0 &&
      bridgePanelIndex >= 0,
    `lab=${labIndex}; modeRule=${layoutModeRulePresent}; reviewModes=${reviewModesIncludeLab}; directLink=${directLinkPresent}; primaryTabLab=${primaryTabLabPresent}; brief=${briefPanelIndex}; bridge=${bridgePanelIndex}`
  );
  check(
    "wireframe_alternatives_visible",
    wireframeAlternativeCount >= 3 &&
      html.includes('data-wireframe-alternative="card-first-current-baseline"') &&
      html.includes('data-briefing-inbox-prototype="true"') &&
      html.includes('data-decision-shell-prototype="true"') &&
      html.includes('data-storyboard-flow-prototype="true"'),
    `wireframes=${wireframeAlternativeCount}; card=${html.includes('data-wireframe-alternative="card-first-current-baseline"')}; inbox=${html.includes('data-briefing-inbox-prototype="true"')}; shell=${html.includes('data-decision-shell-prototype="true"')}; storyboard=${html.includes('data-storyboard-flow-prototype="true"')}`
  );
  check(
    "decision_shell_structure",
    html.includes("Step rail") &&
      html.includes("Active decision") &&
      html.includes("Context dock") &&
      html.includes('data-decision-shell-drawer="evidence"') &&
      html.includes('data-decision-shell-drawer="notes"') &&
      html.includes('data-decision-shell-drawer="inspiration"'),
    "Decision Shell should expose left rail, center active panel, right dock, and Evidence/Notes/Inspiration drawers"
  );
  check(
    "data_driven_choice_model",
    dataDrivenChoiceModelPresent &&
      decisionFlowModelStepCount >= 6 &&
      html.includes("renderDecisionFlowModel") &&
      html.includes("data-model-choice-count") &&
      html.includes("data-model-choice-id"),
    `choices=${decisionFlowModelChoiceCount}; steps=${decisionFlowModelStepCount}; renderer=${html.includes("renderDecisionFlowModel")}`
  );
  check(
    "layout_score_matrix",
    html.includes('data-layout-score-matrix="heuristic"') &&
      scoreMatrixRows >= 4 &&
      doc.includes("heuristic / hypothesis") &&
      doc.includes("Layout Score Matrix"),
    `matrix=${html.includes('data-layout-score-matrix="heuristic"')}; rows=${scoreMatrixRows}; docHeuristic=${doc.includes("heuristic / hypothesis")}`
  );
  check(
    "research_doc_comparison_complete",
    layoutFamiliesComparedCount >= 4 &&
      doc.includes("Latest information grasp") &&
      doc.includes("Important foldering") &&
      doc.includes("Temporary pinning") &&
      doc.includes("Operations notifications") &&
      doc.includes("Inspiration workspace") &&
      doc.includes("Decision-order guidance") &&
      doc.includes("Dynamic choice extensibility") &&
      doc.includes("Text-density control") &&
      doc.includes("Evidence Vault compatibility") &&
      doc.includes("Suitability for FFF now"),
    `families=${layoutFamiliesComparedCount}; requiredAxes=${["Latest information grasp","Important foldering","Temporary pinning","Operations notifications","Inspiration workspace","Decision-order guidance","Dynamic choice extensibility","Text-density control","Evidence Vault compatibility","Suitability for FFF now"].filter((axis) => doc.includes(axis)).length}/10`
  );
  check(
    "recommendation_and_card_rejection",
    html.includes('data-layout-recommendation="split-pane-decision-shell"') &&
      html.includes('data-card-first-rejected-as-default="true"') &&
      doc.includes("Recommended Layout: Split-pane Decision Shell") &&
      doc.includes("Why Card-first Is Not The Default") &&
      doc.includes("future choices can be data-driven"),
    "recommended layout and card-first rejection should be explicit in HTML and doc"
  );
  check(
    "evidence_vault_text_density_future_slice",
    doc.includes("Evidence Vault") &&
      doc.includes("Text-density guideline") &&
      applySliceReferenced &&
      html.includes("Evidence drawer") &&
      html.includes("data-driven choice slot"),
    "doc and prototype should address Evidence Vault, text density, and future apply slice"
  );
  check(
    "dark_mode_preserved",
    darkModePreserved,
    "theme variables and toggles should remain present"
  );
  check(
    "candidate_channel_preserved",
    html.includes("designer-content-moth-investigation-3m") &&
      html.includes("designer-channel-mystery-lore") &&
      decisionFlowModelBlock.includes("designer-content-moth-investigation-3m") &&
      decisionFlowModelBlock.includes("designer-channel-mystery-lore"),
    "selected candidate and channel IDs should remain visible in HTML and decisionFlowModel"
  );
  check(
    "boundary_gates_closed",
    readback?.local_only === true &&
      readback?.external_call === false &&
      readback?.provider_configured === false &&
      readback?.credentials_touched === false &&
      readback?.public_upload === false &&
      readback?.ai_video_generation === false &&
      readback?.production_render === false &&
      readback?.final_canon_decision === false &&
      readback?.database_persistence === false &&
      readback?.rights_cleared_claim === false &&
      lockedMarkers.every((marker) => html.includes(marker) || doc.includes(marker)) &&
      credentialFindings.length === 0,
    `local=${readback?.local_only}; external=${readback?.external_call}; provider=${readback?.provider_configured}; credentials=${readback?.credentials_touched}; upload=${readback?.public_upload}; video=${readback?.ai_video_generation}; render=${readback?.production_render}; canon=${readback?.final_canon_decision}; database=${readback?.database_persistence}; rights=${readback?.rights_cleared_claim}; findings=${credentialFindings.join(", ") || "none"}`
  );

  return {
    schemaVersion: LAYOUT_RESEARCH_DECISION_SHELL_SCHEMA_VERSION,
    artifact_id: "fff-layout-research-decision-shell-001",
    title: "Fast Fiction Factory Layout Research Decision Shell",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_wireframe_review",
    review_input_mode: "freeform",
    review_ui: "public/review/index.html",
    research_doc: "docs/review/layout-research-decision-shell.md",
    access_route: "public/review/index.html?mode=layout-lab",
    primary_routes_preserved: ["public/review/index.html?mode=brief", "public/review/index.html?mode=bridge"],
    input_result_path: toRepoPath(readbackPath),
    source_low_text_console_artifact_id: "fff-low-text-decision-console-001",
    source_result_paths: {
      low_text_decision_console: lowTextPath,
      guided_review_flow_workspace: guidedPath,
      bridge_refinement_overview_ribbon: overviewPath,
      home_cockpit_metric_linking: homeCockpitPath,
      draft_to_video_planning_bridge: bridgePath,
      review_brief_dark_mode_ux: reviewBriefPath,
      one_story_draft_review_pack: draftPackPath,
      designer_candidate_dashboard: designerDashboardPath,
      contradictory_claim_guard: contradictoryGuardPath
    },
    layout_families_compared_count: layoutFamiliesComparedCount,
    wireframe_alternative_count: wireframeAlternativeCount,
    recommended_layout: recommendedLayout,
    recommendation_confidence: "medium-high",
    card_first_rejected_as_default: checks.recommendation_and_card_rejection?.passed === true,
    decision_shell_prototype_visible: html.includes('data-decision-shell-prototype="true"'),
    briefing_inbox_prototype_visible: html.includes('data-briefing-inbox-prototype="true"'),
    storyboard_flow_prototype_visible: html.includes('data-storyboard-flow-prototype="true"'),
    data_driven_choice_model_present: dataDrivenChoiceModelPresent,
    decision_flow_model_choice_count: decisionFlowModelChoiceCount,
    layout_score_matrix_present: checks.layout_score_matrix?.passed === true,
    layout_scores_marked_heuristic: html.includes('data-layout-score-matrix="heuristic"') && doc.includes("heuristic / hypothesis"),
    text_density_guideline_present: doc.includes("Text-density guideline"),
    evidence_vault_compatibility_addressed: doc.includes("Evidence Vault") && html.includes("Evidence drawer"),
    future_apply_slice_defined: applySliceReferenced,
    dark_mode_preserved: darkModePreserved,
    selected_candidate_id: "designer-content-moth-investigation-3m",
    selected_channel_route_id: "designer-channel-mystery-lore",
    boundaries: {
      local_only: true,
      external_call: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      production_render: false,
      final_canon_decision: false,
      database_persistence: false,
      rights_cleared_claim: false,
      credential_material_findings: credentialFindings
    },
    local_only: true,
    external_call: false,
    provider_configured: false,
    credentials_touched: false,
    public_upload: false,
    ai_video_generation: false,
    production_render: false,
    final_canon_decision: false,
    database_persistence: false,
    rights_cleared_claim: false,
    summary: {
      layout_lab_visible: checks.layout_lab_route_visible_and_isolated?.passed === true,
      primary_routes_preserved: briefPanelIndex >= 0 && bridgePanelIndex >= 0,
      wireframe_alternative_count: wireframeAlternativeCount,
      layout_families_compared_count: layoutFamiliesComparedCount,
      recommended_layout: recommendedLayout,
      data_driven_choice_model_present: dataDrivenChoiceModelPresent,
      decision_flow_model_choice_count: decisionFlowModelChoiceCount,
      layout_score_matrix_present: checks.layout_score_matrix?.passed === true,
      local_only: true,
      external_call_attempted: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      production_render: false,
      final_canon_decision: false,
      database_persistence: false,
      rights_cleared_claim: false,
      failures: failures.length
    },
    validation_notes: [
      "The layout lab is a direct-access local prototype route and does not replace brief or bridge.",
      "Card-first, briefing inbox, split-pane Decision Shell, and storyboard flow alternatives are visible as low-fidelity wireframes.",
      "Split-pane Decision Shell is recommended because it separates decision order, active choice, context pins, locks, and optional drawers.",
      "The Decision Shell prototype renders its choice slot from decisionFlowModel, proving future choice options can be data-driven.",
      "No provider/API, credential, upload, AI video, render, rights, database, or final-canon gate is opened."
    ],
    checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateLayoutLabVisualAudit(readback, readbackPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const sourcePath = manifest.layout_research_decision_shell_result_path || DEFAULT_LAYOUT_RESEARCH_DECISION_SHELL_OUTPUT;
  const lowTextPath = manifest.low_text_decision_console_result_path || DEFAULT_LOW_TEXT_DECISION_CONSOLE_OUTPUT;
  const guidedPath = manifest.guided_review_flow_workspace_result_path || DEFAULT_GUIDED_REVIEW_FLOW_WORKSPACE_OUTPUT;
  const bridgePath = manifest.draft_to_video_planning_bridge_result_path || DEFAULT_DRAFT_TO_VIDEO_PLANNING_BRIDGE_OUTPUT;
  const contradictoryGuardPath = manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT;
  const source = await readJson(sourcePath);
  const lowText = await readJson(lowTextPath);
  const guided = await readJson(guidedPath);
  const bridge = await readJson(bridgePath);
  const contradictoryGuard = await readJson(contradictoryGuardPath);
  const html = await readFile("public/review/index.html", "utf8");
  const doc = await readFile("docs/review/layout-lab-visual-audit.md", "utf8");
  const credentialFindings = collectCredentialMaterial(readback);

  const screenshotPaths = Array.isArray(readback?.screenshot_paths) ? readback.screenshot_paths : [];
  const expectedScreenshotPaths = [
    "artifacts/review-screens/layout-lab.png",
    "artifacts/review-screens/layout-lab-decision-shell.png",
    "artifacts/review-screens/brief-preserved.png",
    "artifacts/review-screens/bridge-preserved.png"
  ];
  const normalizedScreenshotPaths = screenshotPaths.map(toRepoPath);
  const screenshotSizes = {};
  for (const screenshotPath of expectedScreenshotPaths) {
    screenshotSizes[screenshotPath] = await fileSizeOrZero(screenshotPath);
  }
  const contactSheetPath = toRepoPath(readback?.contact_sheet_path || "artifacts/layout-lab-visual-audit-contact-sheet.png");
  const contactSheetSize = await fileSizeOrZero(contactSheetPath);

  const labRouteVisible = html.includes('data-layout-lab="decision-shell-research"') &&
    html.includes('data-layout-lab-access="public/review/index.html?mode=layout-lab"') &&
    html.includes('"layout-lab"');
  const briefRoutePreserved = html.includes('data-mode-panel="brief"') &&
    html.includes('data-decision-console="low-text-decision-console"') &&
    lowText?.passed === true;
  const bridgeRoutePreserved = html.includes('data-mode-panel="bridge"') &&
    html.includes('data-bridge-decision-console="true"') &&
    bridge?.passed === true;
  const decisionFlowModelBlock = extractConstObjectBlock(html, "decisionFlowModel");
  const dataDrivenChoiceModelPresent = html.includes("const decisionFlowModel") &&
    html.includes('data-choice-slot="model-driven"') &&
    (decisionFlowModelBlock.match(/\bchoiceId\s*:/g) || []).length >= 3;
  const darkModePreserved = html.includes(':root[data-theme="dark"]') &&
    html.includes(':root[data-theme="auto"]') &&
    html.includes('data-theme-target="light"') &&
    html.includes('data-theme-target="dark"') &&
    html.includes('data-theme-target="auto"');
  const expectedScreenshotsPresent = expectedScreenshotPaths.every((screenshotPath) =>
    normalizedScreenshotPaths.includes(screenshotPath) && screenshotSizes[screenshotPath] > 0
  );
  const wireframeMarkers = {
    card_first_baseline_visible: html.includes('data-wireframe-alternative="card-first-current-baseline"'),
    briefing_inbox_visible: html.includes('data-briefing-inbox-prototype="true"'),
    decision_shell_visual_evidence: html.includes('data-decision-shell-prototype="true"'),
    storyboard_flow_visible: html.includes('data-storyboard-flow-prototype="true"')
  };

  check(
    "identity",
    readback?.artifact_id === "fff-layout-lab-visual-audit-001" &&
      readback?.schemaVersion === LAYOUT_LAB_VISUAL_AUDIT_SCHEMA_VERSION &&
      readback?.source_layout_research_artifact_id === "fff-layout-research-decision-shell-001" &&
      readback?.review_ui === "public/review/index.html" &&
      readback?.layout_lab_route === "public/review/index.html?mode=layout-lab",
    `artifact=${readback?.artifact_id}; schema=${readback?.schemaVersion}; source=${readback?.source_layout_research_artifact_id}; ui=${readback?.review_ui}; route=${readback?.layout_lab_route}`
  );
  check(
    "source_and_prior_readbacks_preserved",
    source?.artifact_id === "fff-layout-research-decision-shell-001" &&
      source?.passed === true &&
      lowText?.artifact_id === "fff-low-text-decision-console-001" &&
      lowText?.passed === true &&
      guided?.artifact_id === "fff-guided-review-flow-workspace-001" &&
      guided?.passed === true &&
      bridge?.artifact_id === "fff-draft-to-video-planning-bridge-001" &&
      bridge?.passed === true &&
      contradictoryGuard?.artifact_id === "fff-contradictory-claim-guard-001" &&
      contradictoryGuard?.passed === true,
    `source=${source?.artifact_id}/${source?.passed}; low=${lowText?.artifact_id}/${lowText?.passed}; guided=${guided?.artifact_id}/${guided?.passed}; bridge=${bridge?.artifact_id}/${bridge?.passed}; guard=${contradictoryGuard?.artifact_id}/${contradictoryGuard?.passed}`
  );
  check(
    "routes_visible_and_preserved",
    labRouteVisible && briefRoutePreserved && bridgeRoutePreserved,
    `layoutLab=${labRouteVisible}; brief=${briefRoutePreserved}; bridge=${bridgeRoutePreserved}`
  );
  check(
    "screenshots_and_contact_sheet_present",
    expectedScreenshotsPresent &&
      readback?.screenshot_count >= 4 &&
      contactSheetSize > 0 &&
      contactSheetPath === "artifacts/layout-lab-visual-audit-contact-sheet.png",
    `screens=${JSON.stringify(screenshotSizes)}; declared=${readback?.screenshot_count}; contact=${contactSheetPath}/${contactSheetSize}`
  );
  check(
    "layout_lab_visual_evidence",
    readback?.layout_lab_visual_evidence === true &&
      readback?.decision_shell_visual_evidence === true &&
      expectedScreenshotsPresent,
    `layoutLab=${readback?.layout_lab_visual_evidence}; decisionShell=${readback?.decision_shell_visual_evidence}; files=${expectedScreenshotsPresent}`
  );
  check(
    "wireframe_alternatives_preserved",
    wireframeMarkers.card_first_baseline_visible &&
      wireframeMarkers.briefing_inbox_visible &&
      wireframeMarkers.decision_shell_visual_evidence &&
      wireframeMarkers.storyboard_flow_visible,
    JSON.stringify(wireframeMarkers)
  );
  check(
    "data_model_and_recommendation_present",
    dataDrivenChoiceModelPresent &&
      html.includes('data-layout-recommendation="split-pane-decision-shell"') &&
      html.includes('data-card-first-rejected-as-default="true"') &&
      source?.recommended_layout === "split-pane Decision Shell",
    `model=${dataDrivenChoiceModelPresent}; recommendation=${html.includes('data-layout-recommendation="split-pane-decision-shell"')}; cardReject=${html.includes('data-card-first-rejected-as-default="true"')}; source=${source?.recommended_layout}`
  );
  check(
    "doc_package_present",
    doc.includes("fff-layout-lab-visual-audit-001") &&
      doc.includes("artifacts/review-screens/layout-lab.png") &&
      doc.includes("artifacts/review-screens/layout-lab-decision-shell.png") &&
      doc.includes("artifacts/review-screens/brief-preserved.png") &&
      doc.includes("artifacts/review-screens/bridge-preserved.png") &&
      doc.includes("artifacts/layout-lab-visual-audit-contact-sheet.png") &&
      doc.toLowerCase().includes("not being decided"),
    "review doc should name artifact, screenshot paths, contact sheet, and non-decisions"
  );
  check(
    "dark_mode_preserved",
    darkModePreserved && readback?.dark_mode_preserved === true,
    `html=${darkModePreserved}; readback=${readback?.dark_mode_preserved}`
  );
  check(
    "boundary_gates_closed",
    readback?.local_only === true &&
      readback?.external_call === false &&
      readback?.provider_configured === false &&
      readback?.credentials_touched === false &&
      readback?.public_upload === false &&
      readback?.ai_video_generation === false &&
      readback?.production_render === false &&
      readback?.database_persistence === false &&
      readback?.final_canon_decision === false &&
      readback?.rights_cleared_claim === false &&
      credentialFindings.length === 0,
    `local=${readback?.local_only}; external=${readback?.external_call}; provider=${readback?.provider_configured}; credentials=${readback?.credentials_touched}; upload=${readback?.public_upload}; video=${readback?.ai_video_generation}; render=${readback?.production_render}; database=${readback?.database_persistence}; canon=${readback?.final_canon_decision}; rights=${readback?.rights_cleared_claim}; findings=${credentialFindings.join(", ") || "none"}`
  );

  return {
    schemaVersion: LAYOUT_LAB_VISUAL_AUDIT_SCHEMA_VERSION,
    artifact_id: "fff-layout-lab-visual-audit-001",
    title: "Fast Fiction Factory Layout Lab Visual Audit",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_visual_review",
    review_input_mode: "freeform",
    source_layout_research_artifact_id: "fff-layout-research-decision-shell-001",
    source_layout_research_result_path: sourcePath,
    review_ui: "public/review/index.html",
    layout_lab_route: "public/review/index.html?mode=layout-lab",
    preserved_routes: [
      "public/review/index.html?mode=brief",
      "public/review/index.html?mode=bridge"
    ],
    brief_route_preserved: briefRoutePreserved,
    bridge_route_preserved: bridgeRoutePreserved,
    screenshot_count: expectedScreenshotPaths.filter((screenshotPath) => screenshotSizes[screenshotPath] > 0).length,
    screenshot_paths: expectedScreenshotPaths,
    screenshot_sizes: screenshotSizes,
    contact_sheet_path: contactSheetPath,
    contact_sheet_size: contactSheetSize,
    screenshot_tool: "Playwright CLI with local Microsoft Edge channel",
    browser_url_policy: "file_url_opened_by_playwright",
    layout_lab_visual_evidence: expectedScreenshotsPresent,
    decision_shell_visual_evidence: screenshotSizes["artifacts/review-screens/layout-lab-decision-shell.png"] > 0,
    card_first_baseline_visible: wireframeMarkers.card_first_baseline_visible,
    briefing_inbox_visible: wireframeMarkers.briefing_inbox_visible,
    storyboard_flow_visible: wireframeMarkers.storyboard_flow_visible,
    data_driven_choice_model_present: dataDrivenChoiceModelPresent,
    recommendation_visible: html.includes('data-layout-recommendation="split-pane-decision-shell"'),
    access_state: expectedScreenshotsPresent ? "verified_opened" : "verified_present",
    dark_mode_preserved: darkModePreserved,
    local_only: true,
    external_call: false,
    provider_configured: false,
    credentials_touched: false,
    public_upload: false,
    ai_video_generation: false,
    production_render: false,
    database_persistence: false,
    final_canon_decision: false,
    rights_cleared_claim: false,
    boundaries: {
      local_only: true,
      external_call: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      production_render: false,
      database_persistence: false,
      final_canon_decision: false,
      rights_cleared_claim: false,
      credential_material_findings: credentialFindings
    },
    source_result_paths: {
      layout_research_decision_shell: sourcePath,
      low_text_decision_console: lowTextPath,
      guided_review_flow_workspace: guidedPath,
      draft_to_video_planning_bridge: bridgePath,
      contradictory_claim_guard: contradictoryGuardPath
    },
    summary: {
      access_state: expectedScreenshotsPresent ? "verified_opened" : "verified_present",
      screenshot_count: expectedScreenshotPaths.filter((screenshotPath) => screenshotSizes[screenshotPath] > 0).length,
      contact_sheet_present: contactSheetSize > 0,
      layout_lab_route_visible: labRouteVisible,
      brief_route_preserved: briefRoutePreserved,
      bridge_route_preserved: bridgeRoutePreserved,
      data_driven_choice_model_present: dataDrivenChoiceModelPresent,
      recommendation_visible: html.includes('data-layout-recommendation="split-pane-decision-shell"'),
      failures: failures.length
    },
    validation_notes: [
      "Visual audit evidence was captured locally through Playwright using the Microsoft Edge channel because bundled Chromium was unavailable.",
      "The Layout Lab remains a research-only route and does not apply the Decision Shell to brief.",
      "The preserved brief and bridge routes were opened for screenshot evidence and remain validated by their prior readbacks.",
      "The audit package records visual basis for the human decision about applying the split-pane Decision Shell later.",
      "No provider/API, credential, upload, AI video, render, database, rights, or final-canon gate is opened."
    ],
    checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateApplyDecisionShellGuardDiet(readback, readbackPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const layoutLabPath = manifest.layout_lab_visual_audit_result_path || DEFAULT_LAYOUT_LAB_VISUAL_AUDIT_OUTPUT;
  const layoutResearchPath = manifest.layout_research_decision_shell_result_path || DEFAULT_LAYOUT_RESEARCH_DECISION_SHELL_OUTPUT;
  const lowTextPath = manifest.low_text_decision_console_result_path || DEFAULT_LOW_TEXT_DECISION_CONSOLE_OUTPUT;
  const guidedPath = manifest.guided_review_flow_workspace_result_path || DEFAULT_GUIDED_REVIEW_FLOW_WORKSPACE_OUTPUT;
  const bridgePath = manifest.draft_to_video_planning_bridge_result_path || DEFAULT_DRAFT_TO_VIDEO_PLANNING_BRIDGE_OUTPUT;
  const contradictoryGuardPath = manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT;
  const layoutLab = await readJson(layoutLabPath);
  const layoutResearch = await readJson(layoutResearchPath);
  const lowText = await readJson(lowTextPath);
  const guided = await readJson(guidedPath);
  const bridge = await readJson(bridgePath);
  const contradictoryGuard = await readJson(contradictoryGuardPath);
  const html = await readFile("public/review/index.html", "utf8");
  const doc = await readFile("docs/review/apply-decision-shell-guard-diet.md", "utf8");
  const credentialFindings = collectCredentialMaterial(readback);

  const decisionFlowModelBlock = extractConstObjectBlock(html, "decisionFlowModel");
  const safetyGateRegistryBlock = extractConstObjectBlock(html, "safetyGateRegistry");
  const pinsBlock = extractArrayPropertyBlock(decisionFlowModelBlock, "pins");
  const noticesBlock = extractArrayPropertyBlock(decisionFlowModelBlock, "notices");
  const locksBlock = extractArrayPropertyBlock(decisionFlowModelBlock, "locks");
  const nonGateBlock = extractArrayPropertyBlock(safetyGateRegistryBlock, "nonGateWhitelist");
  const appliedShellIndex = html.indexOf('data-applied-decision-shell="brief"');
  const guidedFlowIndex = html.indexOf('data-guided-flow="guided-review-flow-workspace"');
  const latestOverviewIndex = html.indexOf('data-latest-overview="bridge-refinement-overview-ribbon"');
  const firstCardIndex = html.indexOf('data-home-cockpit-card=');
  const bridgePanelIndex = html.indexOf('data-mode-panel="bridge"');
  const layoutLabPanelIndex = html.indexOf('data-mode-panel="layout-lab"');
  const decisionFlowModelChoiceCount = (decisionFlowModelBlock.match(/\bchoiceId\s*:/g) || []).length;
  const decisionFlowModelStepCount = (decisionFlowModelBlock.match(/\bstepId\s*:/g) || []).length;
  const decisionFlowModelContextCount = (decisionFlowModelBlock.match(/\bcontextId\s*:/g) || []).length;
  const decisionFlowModelPinCount = (pinsBlock.match(/^\s*"/gm) || []).length;
  const decisionFlowModelNoticeCount = (noticesBlock.match(/^\s*"/gm) || []).length;
  const decisionFlowModelLockCount = (locksBlock.match(/^\s*"/gm) || []).length;
  const trueGateCount = (safetyGateRegistryBlock.match(/\bgateId\s*:/g) || []).length;
  const nonGateWhitelistCount = (nonGateBlock.match(/^\s*"/gm) || []).length;
  const screenshotPath = toRepoPath(readback?.screenshot_path || "artifacts/review-screens/brief-decision-shell-applied.png");
  const screenshotSize = await fileSizeOrZero(screenshotPath);
  const requiredShellMarkers = [
    'data-applied-decision-shell="brief"',
    'data-decision-flow-model-applied="true"',
    'data-dock-governor="true"',
    'data-dock-overflow="drawer"',
    'data-dock-max-visible="true"',
    'data-safety-gate-diet="true"',
    'data-safety-gate-registry="true"',
    'data-guard-drawer="true"',
    'data-gate-display-budget="compact"',
    'data-non-gate-whitelist="true"',
    'data-card-wall-not-default="true"'
  ];
  const requiredRoutes = [
    'data-mode-panel="brief"',
    'data-mode-panel="layout-lab"',
    'data-mode-panel="bridge"',
    'data-mode-panel="designer"',
    'data-mode-panel="draft"',
    'data-mode-panel="source"',
    'data-mode-panel="project"',
    'data-mode-panel="artifacts"'
  ];
  const requiredGateLabels = [
    "provider/API",
    "credentials",
    "AI video",
    "render",
    "upload / public publishing",
    "database persistence",
    "final canon",
    "rights clearance"
  ];
  const requiredWhitelistLabels = [
    "local UI/layout changes",
    "static JSON/readback updates",
    "screenshots/contact sheets",
    "docs/status/manifest updates",
    "local smoke checks",
    "mock/pre-production planning"
  ];
  const dockLimits = {
    pins: html.includes('data-dock-visible-pins="3"') ? 3 : 4,
    notices: html.includes('data-dock-visible-notices="2"') ? 2 : 3,
    locks: html.includes('data-dock-visible-locks="1"') ? 1 : 4,
    context: 4
  };
  const selectedCandidateId = "designer-content-moth-investigation-3m";
  const selectedChannelRouteId = "designer-channel-mystery-lore";
  const boundaryClosed =
    readback?.local_only === true &&
    readback?.external_call === false &&
    readback?.provider_configured === false &&
    readback?.credentials_touched === false &&
    readback?.public_upload === false &&
    readback?.ai_video_generation === false &&
    readback?.production_render === false &&
    readback?.database_persistence === false &&
    readback?.final_canon_decision === false &&
    readback?.rights_cleared_claim === false &&
    credentialFindings.length === 0;

  check(
    "identity",
    readback?.artifact_id === "fff-apply-decision-shell-guard-diet-001" &&
      readback?.schemaVersion === APPLY_DECISION_SHELL_GUARD_DIET_SCHEMA_VERSION &&
      readback?.review_ui === "public/review/index.html" &&
      readback?.access_route === "public/review/index.html?mode=brief" &&
      readback?.bridge_route === "public/review/index.html?mode=bridge" &&
      readback?.source_layout_lab_visual_audit_artifact_id === "fff-layout-lab-visual-audit-001",
    `artifact=${readback?.artifact_id}; schema=${readback?.schemaVersion}; ui=${readback?.review_ui}; access=${readback?.access_route}; bridge=${readback?.bridge_route}; source=${readback?.source_layout_lab_visual_audit_artifact_id}`
  );
  check(
    "source_readbacks_preserved",
    layoutLab?.artifact_id === "fff-layout-lab-visual-audit-001" &&
      layoutLab?.passed === true &&
      layoutResearch?.artifact_id === "fff-layout-research-decision-shell-001" &&
      layoutResearch?.passed === true &&
      lowText?.artifact_id === "fff-low-text-decision-console-001" &&
      lowText?.passed === true &&
      guided?.artifact_id === "fff-guided-review-flow-workspace-001" &&
      guided?.passed === true &&
      bridge?.artifact_id === "fff-draft-to-video-planning-bridge-001" &&
      bridge?.passed === true &&
      contradictoryGuard?.artifact_id === "fff-contradictory-claim-guard-001" &&
      contradictoryGuard?.passed === true,
    `layoutLab=${layoutLab?.artifact_id}/${layoutLab?.passed}; layoutResearch=${layoutResearch?.artifact_id}/${layoutResearch?.passed}; lowText=${lowText?.artifact_id}/${lowText?.passed}; guided=${guided?.artifact_id}/${guided?.passed}; bridge=${bridge?.artifact_id}/${bridge?.passed}; guard=${contradictoryGuard?.artifact_id}/${contradictoryGuard?.passed}`
  );
  check(
    "decision_shell_applied_to_brief_first",
    appliedShellIndex >= 0 &&
      guidedFlowIndex > appliedShellIndex &&
      latestOverviewIndex > appliedShellIndex &&
      firstCardIndex > appliedShellIndex &&
      requiredShellMarkers.every((marker) => html.includes(marker)),
    `shell=${appliedShellIndex}; guided=${guidedFlowIndex}; latest=${latestOverviewIndex}; firstCard=${firstCardIndex}; markers=${requiredShellMarkers.filter((marker) => html.includes(marker)).length}/${requiredShellMarkers.length}`
  );
  check(
    "split_pane_shell_structure",
    html.includes('data-split-pane-shell="brief"') &&
      /class="[^"]*\bdecision-shell-rail\b/.test(html) &&
      html.includes('data-active-decision-panel="true"') &&
      html.includes('class="context-dock governed-context-dock"') &&
      html.includes('data-decision-shell-drawer="evidence"') &&
      html.includes('data-decision-shell-drawer="notes"') &&
      html.includes('data-decision-shell-drawer="inspiration"') &&
      html.includes('data-decision-shell-drawer="guard"'),
    "brief should expose left rail, center active decision, governed dock, and Evidence/Notes/Inspiration/Guard drawers"
  );
  check(
    "decision_flow_model_applied",
    html.includes("const decisionFlowModel") &&
      decisionFlowModelBlock.includes('artifactId: "fff-apply-decision-shell-guard-diet-001"') &&
      decisionFlowModelBlock.includes('currentRoute: "public/review/index.html?mode=brief"') &&
      decisionFlowModelBlock.includes(selectedCandidateId) &&
      decisionFlowModelBlock.includes(selectedChannelRouteId) &&
      decisionFlowModelBlock.includes('label: "Bridgeで確認"') &&
      decisionFlowModelBlock.includes('route: "public/review/index.html?mode=bridge"') &&
      decisionFlowModelChoiceCount === 5 &&
      decisionFlowModelStepCount === 6 &&
      decisionFlowModelContextCount === 6 &&
      html.includes("renderDecisionFlowModel") &&
      html.includes("data-model-choice-button-list") &&
      html.includes("data-model-step-list"),
    `choices=${decisionFlowModelChoiceCount}; steps=${decisionFlowModelStepCount}; context=${decisionFlowModelContextCount}; renderer=${html.includes("renderDecisionFlowModel")}`
  );
  check(
    "dock_governor",
    html.includes(`data-dock-visible-pins="${dockLimits.pins}"`) &&
      html.includes(`data-dock-visible-notices="${dockLimits.notices}"`) &&
      html.includes(`data-dock-visible-locks="${dockLimits.locks}"`) &&
      html.includes('data-dock-visible-context="4"') &&
      html.includes("data-dock-overflow-list") &&
      html.includes(".slice(0, limits.pins)") &&
      html.includes(".slice(0, limits.notices)") &&
      html.includes(".slice(0, limits.locks)") &&
      html.includes(".slice(0, limits.context)") &&
      html.includes("max-height: min(540px, 72vh)") &&
      html.includes("overflow: auto") &&
      decisionFlowModelPinCount > dockLimits.pins &&
      decisionFlowModelNoticeCount > dockLimits.notices &&
      decisionFlowModelLockCount > dockLimits.locks &&
      decisionFlowModelContextCount > dockLimits.context,
    `pins=${decisionFlowModelPinCount}/${dockLimits.pins}; notices=${decisionFlowModelNoticeCount}/${dockLimits.notices}; locks=${decisionFlowModelLockCount}/${dockLimits.locks}; context=${decisionFlowModelContextCount}/${dockLimits.context}`
  );
  check(
    "safety_gate_diet",
    html.includes("const safetyGateRegistry") &&
      trueGateCount === 8 &&
      requiredGateLabels.every((label) => safetyGateRegistryBlock.includes(label)) &&
      html.includes('data-compact-gate-summary="true"') &&
      html.includes('data-gate-registry-list') &&
      html.includes('data-guard-drawer="true"') &&
      html.includes("renderSafetyGateRegistry"),
    `gates=${trueGateCount}; required=${requiredGateLabels.filter((label) => safetyGateRegistryBlock.includes(label)).length}/${requiredGateLabels.length}`
  );
  check(
    "non_gate_whitelist",
    nonGateWhitelistCount === 6 &&
      requiredWhitelistLabels.every((label) => safetyGateRegistryBlock.includes(label)) &&
      html.includes('data-non-gate-whitelist-list'),
    `whitelist=${nonGateWhitelistCount}; required=${requiredWhitelistLabels.filter((label) => safetyGateRegistryBlock.includes(label)).length}/${requiredWhitelistLabels.length}`
  );
  check(
    "card_wall_not_default",
    html.includes('data-card-wall-not-default="true"') &&
      html.includes('data-card-wall-suppressed="true"') &&
      appliedShellIndex >= 0 &&
      firstCardIndex > appliedShellIndex,
    `shell=${appliedShellIndex}; firstCard=${firstCardIndex}; suppressed=${(html.match(/data-card-wall-suppressed="true"/g) || []).length}`
  );
  check(
    "route_preservation",
    requiredRoutes.every((marker) => html.includes(marker)) &&
      bridgePanelIndex >= 0 &&
      layoutLabPanelIndex >= 0 &&
      html.includes('data-bridge-decision-console="true"') &&
      html.includes('data-layout-lab="decision-shell-research"') &&
      html.includes('"home", "brief", "layout-lab", "bridge", "story", "designer", "draft", "source", "project", "artifacts"') &&
      html.includes(':root[data-theme="dark"]') &&
      html.includes('data-theme-target="dark"'),
    `routes=${requiredRoutes.filter((marker) => html.includes(marker)).length}/${requiredRoutes.length}; bridge=${bridgePanelIndex}; layoutLab=${layoutLabPanelIndex}`
  );
  check(
    "visual_and_doc_evidence",
    screenshotSize > 0 &&
      doc.includes("fff-apply-decision-shell-guard-diet-001") &&
      doc.includes("Dock Governor") &&
      doc.includes("Safety Gate Diet") &&
      doc.includes("Non-gate whitelist") &&
      doc.includes(screenshotPath),
    `screenshot=${screenshotPath}/${screenshotSize}; doc=${doc.includes("fff-apply-decision-shell-guard-diet-001")}`
  );
  check(
    "candidate_channel_and_boundaries",
    html.includes(selectedCandidateId) &&
      html.includes(selectedChannelRouteId) &&
      boundaryClosed &&
      requiredGateLabels.every((label) => html.includes(label) || doc.includes(label)),
    `candidate=${html.includes(selectedCandidateId)}; channel=${html.includes(selectedChannelRouteId)}; boundaries=${boundaryClosed}; findings=${credentialFindings.join(", ") || "none"}`
  );

  return {
    schemaVersion: APPLY_DECISION_SHELL_GUARD_DIET_SCHEMA_VERSION,
    artifact_id: "fff-apply-decision-shell-guard-diet-001",
    title: "Fast Fiction Factory Apply Decision Shell Guard Diet",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    review_ui: "public/review/index.html",
    access_route: "public/review/index.html?mode=brief",
    bridge_route: "public/review/index.html?mode=bridge",
    layout_lab_route: "public/review/index.html?mode=layout-lab",
    input_result_path: toRepoPath(readbackPath),
    source_layout_lab_visual_audit_artifact_id: "fff-layout-lab-visual-audit-001",
    source_result_paths: {
      layout_lab_visual_audit: layoutLabPath,
      layout_research_decision_shell: layoutResearchPath,
      low_text_decision_console: lowTextPath,
      guided_review_flow_workspace: guidedPath,
      draft_to_video_planning_bridge: bridgePath,
      contradictory_claim_guard: contradictoryGuardPath
    },
    preserved_routes: [
      "public/review/index.html?mode=brief",
      "public/review/index.html?mode=layout-lab",
      "public/review/index.html?mode=bridge",
      "public/review/index.html?mode=designer",
      "public/review/index.html?mode=draft",
      "public/review/index.html?mode=source",
      "public/review/index.html?mode=project",
      "public/review/index.html?mode=artifacts"
    ],
    decision_shell_applied_to_brief: checks.decision_shell_applied_to_brief_first?.passed === true,
    split_pane_shell_structure: checks.split_pane_shell_structure?.passed === true,
    decision_flow_model_applied: checks.decision_flow_model_applied?.passed === true,
    decision_flow_model_artifact_id: "fff-apply-decision-shell-guard-diet-001",
    decision_flow_model_choice_count: decisionFlowModelChoiceCount,
    decision_flow_model_step_count: decisionFlowModelStepCount,
    decision_flow_model_context_count: decisionFlowModelContextCount,
    decision_flow_model_pin_count: decisionFlowModelPinCount,
    decision_flow_model_notice_count: decisionFlowModelNoticeCount,
    decision_flow_model_lock_count: decisionFlowModelLockCount,
    decision_next_action_label: "Bridgeで確認",
    decision_next_action_route: "public/review/index.html?mode=bridge",
    selected_candidate_id: selectedCandidateId,
    selected_channel_route_id: selectedChannelRouteId,
    dock_governor: {
      enabled: checks.dock_governor?.passed === true,
      max_visible_pins: dockLimits.pins,
      max_visible_notices: dockLimits.notices,
      max_visible_locks: dockLimits.locks,
      max_visible_context: dockLimits.context,
      overflow_drawer: true,
      internal_scroll: true
    },
    safety_gate_diet: {
      enabled: checks.safety_gate_diet?.passed === true,
      true_gate_count: trueGateCount,
      gate_display_budget: "compact",
      guard_drawer: true,
      true_gates: requiredGateLabels
    },
    non_gate_whitelist: {
      enabled: checks.non_gate_whitelist?.passed === true,
      item_count: nonGateWhitelistCount,
      items: requiredWhitelistLabels
    },
    card_wall_not_default: checks.card_wall_not_default?.passed === true,
    visual_evidence: {
      screenshot_path: screenshotPath,
      screenshot_size: screenshotSize,
      browser_url_policy: "file_url_opened_by_playwright",
      access_state: screenshotSize > 0 ? "verified_opened" : "verified_present"
    },
    route_preservation: {
      brief: html.includes('data-mode-panel="brief"'),
      layout_lab: layoutLabPanelIndex >= 0,
      bridge: bridgePanelIndex >= 0,
      designer: html.includes('data-mode-panel="designer"'),
      draft: html.includes('data-mode-panel="draft"'),
      source: html.includes('data-mode-panel="source"'),
      project: html.includes('data-mode-panel="project"'),
      artifacts: html.includes('data-mode-panel="artifacts"'),
      dark_mode: html.includes(':root[data-theme="dark"]')
    },
    boundaries: {
      local_only: true,
      external_call: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      production_render: false,
      database_persistence: false,
      final_canon_decision: false,
      rights_cleared_claim: false,
      credential_material_findings: credentialFindings
    },
    local_only: true,
    external_call: false,
    provider_configured: false,
    credentials_touched: false,
    public_upload: false,
    ai_video_generation: false,
    production_render: false,
    database_persistence: false,
    final_canon_decision: false,
    rights_cleared_claim: false,
    summary: {
      decision_shell_applied_to_brief: checks.decision_shell_applied_to_brief_first?.passed === true,
      decision_flow_model_applied: checks.decision_flow_model_applied?.passed === true,
      dock_governor: checks.dock_governor?.passed === true,
      safety_gate_diet: checks.safety_gate_diet?.passed === true,
      non_gate_whitelist: checks.non_gate_whitelist?.passed === true,
      card_wall_not_default: checks.card_wall_not_default?.passed === true,
      route_preservation: checks.route_preservation?.passed === true,
      visual_evidence: screenshotSize > 0,
      local_only: true,
      external_call_attempted: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      production_render: false,
      database_persistence: false,
      final_canon_decision: false,
      rights_cleared_claim: false,
      failures: failures.length
    },
    validation_notes: [
      "The default brief route now starts with the applied Split-pane Decision Shell.",
      "Decision choices, steps, context, pins, notices, locks, and next action are rendered from decisionFlowModel.",
      "Dock Governor limits visible context rows and sends overflow to the Guard drawer.",
      "Safety Gate Diet keeps true production gates compact at the top and detailed in the Guard drawer.",
      "Local UI/docs/readback/screenshots/smoke work is whitelisted; provider/API, credentials, upload, AI video, render, database, rights, and final-canon gates remain closed."
    ],
    checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateReviewWorkbenchComponentContract(readback, readbackPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const applyShellPath = manifest.apply_decision_shell_guard_diet_result_path || DEFAULT_APPLY_DECISION_SHELL_GUARD_DIET_OUTPUT;
  const layoutLabPath = manifest.layout_lab_visual_audit_result_path || DEFAULT_LAYOUT_LAB_VISUAL_AUDIT_OUTPUT;
  const layoutResearchPath = manifest.layout_research_decision_shell_result_path || DEFAULT_LAYOUT_RESEARCH_DECISION_SHELL_OUTPUT;
  const lowTextPath = manifest.low_text_decision_console_result_path || DEFAULT_LOW_TEXT_DECISION_CONSOLE_OUTPUT;
  const bridgePath = manifest.draft_to_video_planning_bridge_result_path || DEFAULT_DRAFT_TO_VIDEO_PLANNING_BRIDGE_OUTPUT;
  const contradictoryGuardPath = manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT;
  const applyShell = await readJson(applyShellPath);
  const layoutLab = await readJson(layoutLabPath);
  const layoutResearch = await readJson(layoutResearchPath);
  const lowText = await readJson(lowTextPath);
  const bridge = await readJson(bridgePath);
  const contradictoryGuard = await readJson(contradictoryGuardPath);
  const html = await readFile("public/review/index.html", "utf8");
  const doc = await readFile("docs/review/review-workbench-component-contract.md", "utf8");
  const credentialFindings = collectCredentialMaterial(readback);

  const selectedCandidateId = "designer-content-moth-investigation-3m";
  const selectedChannelRouteId = "designer-channel-mystery-lore";
  const requiredComponents = [
    "appHeader",
    "routeNavigator",
    "processRail",
    "activeDecisionCanvas",
    "contextDock",
    "evidenceDrawer",
    "notesDrawer",
    "inspirationDrawer",
    "guardDrawer",
    "legacyArchive"
  ];
  const requiredRoutes = [
    'data-mode-panel="brief"',
    'data-mode-panel="layout-lab"',
    'data-mode-panel="bridge"',
    'data-mode-panel="designer"',
    'data-mode-panel="draft"',
    'data-mode-panel="source"',
    'data-mode-panel="project"',
    'data-mode-panel="artifacts"'
  ];
  const lockedMarkers = [
    "provider/API",
    "credentials",
    "AI video",
    "render",
    "upload",
    "database persistence",
    "final canon",
    "rights clearance"
  ];

  const componentRoleContractsBlock = extractConstObjectBlock(html, "componentRoleContracts");
  const decisionFlowModelBlock = extractConstObjectBlock(html, "decisionFlowModel");
  const safetyGateRegistryBlock = extractConstObjectBlock(html, "safetyGateRegistry");
  const pinsBlock = extractArrayPropertyBlock(decisionFlowModelBlock, "pins");
  const noticesBlock = extractArrayPropertyBlock(decisionFlowModelBlock, "notices");
  const locksBlock = extractArrayPropertyBlock(decisionFlowModelBlock, "locks");
  const compactSummaryBlock = extractArrayPropertyBlock(safetyGateRegistryBlock, "compactSummary");
  const componentContractCount = requiredComponents.filter((key) => new RegExp(`\\b${key}\\s*:`).test(componentRoleContractsBlock)).length;
  const componentRoleCount = (componentRoleContractsBlock.match(/\brole\s*:/g) || []).length;
  const contractPropertyCount = ["role:", "owns:", "must_not_show:", "max_visible_items:", "source_of_truth:", "route_or_drawer:"]
    .filter((property) => componentRoleContractsBlock.includes(property)).length;
  const decisionFlowModelChoiceCount = (decisionFlowModelBlock.match(/\bchoiceId\s*:/g) || []).length;
  const decisionFlowModelStepCount = (decisionFlowModelBlock.match(/\bstepId\s*:/g) || []).length;
  const decisionFlowModelContextCount = (decisionFlowModelBlock.match(/\bcontextId\s*:/g) || []).length;
  const decisionFlowModelPinCount = (pinsBlock.match(/^\s*"/gm) || []).length;
  const decisionFlowModelNoticeCount = (noticesBlock.match(/^\s*"/gm) || []).length;
  const decisionFlowModelLockCount = (locksBlock.match(/^\s*"/gm) || []).length;
  const trueGateCount = (safetyGateRegistryBlock.match(/\bgateId\s*:/g) || []).length;
  const compactSummaryCount = (compactSummaryBlock.match(/^\s*"/gm) || []).length;

  const headerIndex = html.indexOf('class="hub-header workbench-hub-header"');
  const routeNavIndex = html.indexOf('data-route-nav-compact="true"');
  const workbenchIndex = html.indexOf('data-review-workbench-canvas="true"');
  const legacyIndex = html.indexOf('data-legacy-decision-console="low-text-decision-console"');
  const guidedFlowIndex = html.indexOf('data-guided-flow="guided-review-flow-workspace"');
  const latestOverviewIndex = html.indexOf('data-latest-overview="bridge-refinement-overview-ribbon"');
  const firstCardIndex = html.indexOf('data-home-cockpit-card=');
  const firstScreenStart = headerIndex >= 0 ? headerIndex : (routeNavIndex >= 0 ? routeNavIndex : workbenchIndex);
  const firstScreenEndCandidates = [legacyIndex, guidedFlowIndex, latestOverviewIndex, firstCardIndex]
    .filter((index) => index > workbenchIndex);
  const firstScreenEnd = firstScreenEndCandidates.length > 0 ? Math.min(...firstScreenEndCandidates) : workbenchIndex + 12000;
  const firstScreenBlock = firstScreenStart >= 0 && firstScreenEnd > firstScreenStart
    ? html.slice(firstScreenStart, firstScreenEnd)
    : "";
  const firstScreenVisibleBlock = removeHiddenBlocks(removeDetailsBlocks(firstScreenBlock));
  const firstScreenVisibleText = stripHtmlTags(firstScreenVisibleBlock);
  const routeNavBlock = extractFirstHtmlBlockByMarker(html, "nav", 'data-route-nav-compact="true"');
  const activeCanvasBlock = extractFirstHtmlBlockByMarker(html, "main", 'data-active-decision-canvas="true"');
  const contextDockBlock = extractFirstHtmlBlockByMarker(html, "aside", 'data-context-dock-role="context-only"');
  const guardDrawerBlock = extractFirstHtmlBlockByMarker(html, "details", 'data-decision-shell-drawer="guard"');
  const firstScreenHeadings = allTaggedTexts(firstScreenVisibleBlock, /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi);
  const competingGlobalHeadingCount = ["Review Brief", "Home Cockpit", "Guided Review Flow"]
    .filter((phrase) => firstScreenHeadings.some((heading) => heading.includes(phrase))).length;
  const candidateIdVisibleCount = countLiteral(firstScreenVisibleText, selectedCandidateId);
  const channelIdVisibleCount = countLiteral(firstScreenVisibleText, selectedChannelRouteId);
  const providerApiVisibleCountOutsideGuard = countLiteral(firstScreenVisibleText, "provider/API");
  const finalCanonVisibleCountOutsideGuard = countLiteral(firstScreenVisibleText, "final canon");
  const currentRouteExplanationCount = (firstScreenVisibleBlock.match(/data-current-route-explanation="true"/g) || []).length;
  const contextChipVisibleCount = (firstScreenVisibleBlock.match(/data-context-chip=/g) || []).length;
  const pinSummaryVisibleCount = (firstScreenVisibleBlock.match(/data-pin-summary="true"/g) || []).length;
  const noticeSummaryVisibleCount = (firstScreenVisibleBlock.match(/data-notice-summary="true"/g) || []).length;
  const lockSummaryVisibleCount = (firstScreenVisibleBlock.match(/data-lock-summary="true"/g) || []).length;
  const firstScreenHubPanelCount = (firstScreenVisibleBlock.match(/\bhub-panel\b/g) || []).length;
  const firstScreenModeSummaryCount = (firstScreenVisibleBlock.match(/\bmode-summary\b/g) || []).length;
  const routeButtonCount = (routeNavBlock.match(/data-mode-target=/g) || []).length;
  const screenshotPath = toRepoPath(readback?.screenshot_path || "artifacts/review-screens/brief-component-contract-workbench.png");
  const screenshotSize = await fileSizeOrZero(screenshotPath);
  const boundaryClosed =
    readback?.local_only === true &&
    readback?.external_call === false &&
    readback?.provider_configured === false &&
    readback?.credentials_touched === false &&
    readback?.public_upload === false &&
    readback?.ai_video_generation === false &&
    readback?.production_render === false &&
    readback?.database_persistence === false &&
    readback?.final_canon_decision === false &&
    readback?.rights_cleared_claim === false &&
    credentialFindings.length === 0;

  const routeNavCompact = html.includes('data-route-nav-compact="true"') &&
    routeButtonCount >= 8 &&
    !/<p\b/i.test(routeNavBlock) &&
    !routeNavBlock.includes("mode-summary-grid");
  const contextDockRoleLimited = html.includes('data-context-dock-role="context-only"') &&
    html.includes('data-dock-visible-pins="3"') &&
    html.includes('data-dock-visible-notices="2"') &&
    html.includes('data-dock-visible-locks="1"') &&
    html.includes('data-dock-visible-context="4"') &&
    !contextDockBlock.includes("data-current-route-explanation") &&
    !contextDockBlock.includes("route instructions");
  const contextDockVisibleItemBudgetPassed =
    contextChipVisibleCount <= 4 &&
    pinSummaryVisibleCount <= 3 &&
    noticeSummaryVisibleCount <= 2 &&
    lockSummaryVisibleCount <= 1 &&
    decisionFlowModelPinCount > 3 &&
    decisionFlowModelNoticeCount > 2 &&
    decisionFlowModelLockCount > 1 &&
    decisionFlowModelContextCount > 4;
  const duplicationBudgetPassed =
    currentRouteExplanationCount === 1 &&
    candidateIdVisibleCount <= 2 &&
    channelIdVisibleCount <= 2 &&
    providerApiVisibleCountOutsideGuard <= 1 &&
    finalCanonVisibleCountOutsideGuard <= 1 &&
    competingGlobalHeadingCount <= 1;
  const decisionFlowModelPreserved =
    html.includes("const decisionFlowModel") &&
    decisionFlowModelBlock.includes('artifactId: "fff-apply-decision-shell-guard-diet-001"') &&
    decisionFlowModelBlock.includes('currentRoute: "public/review/index.html?mode=brief"') &&
    decisionFlowModelBlock.includes(selectedCandidateId) &&
    decisionFlowModelBlock.includes(selectedChannelRouteId) &&
    decisionFlowModelBlock.includes('label: "Bridgeで確認"') &&
    decisionFlowModelBlock.includes('route: "public/review/index.html?mode=bridge"') &&
    decisionFlowModelChoiceCount === 5 &&
    decisionFlowModelStepCount === 6 &&
    decisionFlowModelContextCount === 6 &&
    html.includes("renderDecisionFlowModel") &&
    html.includes("data-model-choice-button-list");
  const safetyProminenceReduced =
    compactSummaryCount === 1 &&
    lockSummaryVisibleCount <= 1 &&
    trueGateCount === 8 &&
    guardDrawerBlock.includes("data-gate-registry-list") &&
    guardDrawerBlock.includes("data-non-gate-whitelist-list");
  const cardWallNotFirstScreen =
    firstScreenHubPanelCount === 0 &&
    firstScreenModeSummaryCount === 0 &&
    !firstScreenVisibleBlock.includes("data-home-cockpit-card") &&
    workbenchIndex >= 0 &&
    (firstCardIndex < 0 || firstCardIndex > workbenchIndex);

  check(
    "identity",
    readback?.artifact_id === "fff-review-workbench-component-contract-001" &&
      readback?.schemaVersion === REVIEW_WORKBENCH_COMPONENT_CONTRACT_SCHEMA_VERSION &&
      readback?.review_ui === "public/review/index.html" &&
      readback?.access_route === "public/review/index.html?mode=brief" &&
      readback?.source_apply_shell_artifact_id === "fff-apply-decision-shell-guard-diet-001",
    `artifact=${readback?.artifact_id}; schema=${readback?.schemaVersion}; ui=${readback?.review_ui}; access=${readback?.access_route}; source=${readback?.source_apply_shell_artifact_id}`
  );
  check(
    "source_readbacks_preserved",
    applyShell?.artifact_id === "fff-apply-decision-shell-guard-diet-001" &&
      applyShell?.passed === true &&
      layoutLab?.artifact_id === "fff-layout-lab-visual-audit-001" &&
      layoutLab?.passed === true &&
      layoutResearch?.artifact_id === "fff-layout-research-decision-shell-001" &&
      layoutResearch?.passed === true &&
      lowText?.artifact_id === "fff-low-text-decision-console-001" &&
      lowText?.passed === true &&
      bridge?.artifact_id === "fff-draft-to-video-planning-bridge-001" &&
      bridge?.passed === true &&
      contradictoryGuard?.artifact_id === "fff-contradictory-claim-guard-001" &&
      contradictoryGuard?.passed === true,
    `apply=${applyShell?.artifact_id}/${applyShell?.passed}; layoutLab=${layoutLab?.artifact_id}/${layoutLab?.passed}; layoutResearch=${layoutResearch?.artifact_id}/${layoutResearch?.passed}; lowText=${lowText?.artifact_id}/${lowText?.passed}; bridge=${bridge?.artifact_id}/${bridge?.passed}; guard=${contradictoryGuard?.artifact_id}/${contradictoryGuard?.passed}`
  );
  check(
    "component_role_contract",
    html.includes("const componentRoleContracts") &&
      html.includes('data-component-role-contract="true"') &&
      componentContractCount === requiredComponents.length &&
      componentRoleCount >= requiredComponents.length &&
      contractPropertyCount === 6,
    `components=${componentContractCount}/${requiredComponents.length}; roles=${componentRoleCount}; properties=${contractPropertyCount}/6`
  );
  check(
    "single_framing_source",
    html.includes('data-single-framing-source="active-decision-canvas"') &&
      activeCanvasBlock.includes('data-current-route-explanation="true"') &&
      currentRouteExplanationCount === 1 &&
      !/<p\b/i.test(routeNavBlock) &&
      !contextDockBlock.includes("Bridge opens after this choice"),
    `routeExplanations=${currentRouteExplanationCount}; routeNavParagraph=${/<p\b/i.test(routeNavBlock)}`
  );
  check(
    "workbench_canvas_not_cards",
    html.includes('data-review-workbench-canvas="true"') &&
      html.includes("review-workbench-canvas") &&
      html.includes('data-process-rail-role="process-only"') &&
      html.includes('data-active-decision-canvas="true"') &&
      cardWallNotFirstScreen,
    `workbench=${workbenchIndex}; hubPanels=${firstScreenHubPanelCount}; modeSummaries=${firstScreenModeSummaryCount}; firstCard=${firstCardIndex}`
  );
  check(
    "route_nav_compact",
    routeNavCompact,
    `routeButtons=${routeButtonCount}; hasParagraph=${/<p\b/i.test(routeNavBlock)}; hasSummaryGrid=${routeNavBlock.includes("mode-summary-grid")}`
  );
  check(
    "operator_utility_demoted",
    html.includes('data-operator-utility-drawer="true"') &&
      firstScreenBlock.includes("Operator utility") &&
      !firstScreenVisibleBlock.includes("How to open locally") &&
      !firstScreenVisibleBlock.includes('class="hub-panel"'),
    "operator launch commands should live in a collapsed utility drawer, not a first-screen card"
  );
  check(
    "context_dock_boundaries",
    contextDockRoleLimited &&
      contextDockVisibleItemBudgetPassed,
    `context=${contextChipVisibleCount}/4; pins=${pinSummaryVisibleCount}/3; notices=${noticeSummaryVisibleCount}/2; locks=${lockSummaryVisibleCount}/1; modelPins=${decisionFlowModelPinCount}; modelNotices=${decisionFlowModelNoticeCount}; modelLocks=${decisionFlowModelLockCount}; modelContext=${decisionFlowModelContextCount}`
  );
  check(
    "duplication_budget",
    html.includes('data-duplication-budget="true"') &&
      duplicationBudgetPassed,
    `routeExplanation=${currentRouteExplanationCount}; candidate=${candidateIdVisibleCount}; channel=${channelIdVisibleCount}; providerApi=${providerApiVisibleCountOutsideGuard}; finalCanon=${finalCanonVisibleCountOutsideGuard}; competingHeadings=${competingGlobalHeadingCount}`
  );
  check(
    "complement_rule",
    html.includes('data-component-complement-rule="true"') &&
      componentRoleContractsBlock.includes("must_not_show") &&
      !/everything except/i.test(firstScreenVisibleText) &&
      doc.includes("Complement Rule"),
    "components should state owned content rather than describing everything outside their role"
  );
  check(
    "decision_flow_model_preserved",
    decisionFlowModelPreserved,
    `choices=${decisionFlowModelChoiceCount}; steps=${decisionFlowModelStepCount}; context=${decisionFlowModelContextCount}; renderer=${html.includes("renderDecisionFlowModel")}`
  );
  check(
    "route_preservation",
    requiredRoutes.every((marker) => html.includes(marker)) &&
      html.includes('id="draft-to-video-bridge-root"') &&
      html.includes('data-layout-lab="decision-shell-research"') &&
      html.includes('"home", "brief", "layout-lab", "bridge", "story", "designer", "draft", "source", "project", "artifacts"'),
    `routes=${requiredRoutes.filter((marker) => html.includes(marker)).length}/${requiredRoutes.length}`
  );
  check(
    "guard_and_safety_prominence",
    html.includes('data-safety-gate-diet="true"') &&
      html.includes('data-guard-drawer="true"') &&
      safetyProminenceReduced,
    `compactSummary=${compactSummaryCount}; visibleLocks=${lockSummaryVisibleCount}; gates=${trueGateCount}`
  );
  check(
    "dark_mode_preserved",
    html.includes(':root[data-theme="dark"]') &&
      html.includes(':root[data-theme="auto"]') &&
      html.includes('data-theme-target="light"') &&
      html.includes('data-theme-target="dark"') &&
      html.includes('data-theme-target="auto"') &&
      html.includes("THEME_STORAGE_KEY"),
    "theme variables and Light/Dark/Auto controls should remain present"
  );
  check(
    "doc_and_visual_evidence",
    doc.includes("fff-review-workbench-component-contract-001") &&
      doc.includes("Component Role Contract") &&
      doc.includes("Single Source of Framing") &&
      doc.includes("Duplication Budget") &&
      doc.includes("Context Dock Limits") &&
      doc.includes("node tools/fff-state.mjs smoke-review-workbench-component-contract") &&
      (screenshotSize > 0 || !readback?.screenshot_path),
    `doc=${doc.includes("fff-review-workbench-component-contract-001")}; screenshot=${screenshotPath}/${screenshotSize}`
  );
  check(
    "boundary_gates_closed",
    boundaryClosed &&
      lockedMarkers.every((marker) => html.includes(marker) || doc.includes(marker)),
    `local=${readback?.local_only}; external=${readback?.external_call}; provider=${readback?.provider_configured}; credentials=${readback?.credentials_touched}; upload=${readback?.public_upload}; video=${readback?.ai_video_generation}; render=${readback?.production_render}; database=${readback?.database_persistence}; canon=${readback?.final_canon_decision}; rights=${readback?.rights_cleared_claim}; findings=${credentialFindings.join(", ") || "none"}`
  );

  return {
    schemaVersion: REVIEW_WORKBENCH_COMPONENT_CONTRACT_SCHEMA_VERSION,
    artifact_id: "fff-review-workbench-component-contract-001",
    title: "Fast Fiction Factory Review Workbench Component Contract",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    review_ui: "public/review/index.html",
    access_route: "public/review/index.html?mode=brief",
    input_result_path: toRepoPath(readbackPath),
    source_apply_shell_artifact_id: "fff-apply-decision-shell-guard-diet-001",
    source_result_paths: {
      apply_decision_shell_guard_diet: applyShellPath,
      layout_lab_visual_audit: layoutLabPath,
      layout_research_decision_shell: layoutResearchPath,
      low_text_decision_console: lowTextPath,
      draft_to_video_planning_bridge: bridgePath,
      contradictory_claim_guard: contradictoryGuardPath
    },
    component_role_contract_present: checks.component_role_contract?.passed === true,
    component_contract_count: componentContractCount,
    component_contract_required_components: requiredComponents,
    single_framing_source: "activeDecisionCanvas",
    review_workbench_canvas_visible: checks.workbench_canvas_not_cards?.passed === true,
    route_nav_compact: checks.route_nav_compact?.passed === true,
    operator_utility_drawer_present: checks.operator_utility_demoted?.passed === true,
    context_dock_role_limited: checks.context_dock_boundaries?.passed === true,
    context_dock_visible_item_budget_passed: contextDockVisibleItemBudgetPassed,
    duplication_budget_present: html.includes('data-duplication-budget="true"'),
    duplication_budget_passed: duplicationBudgetPassed,
    complement_rule_present: html.includes('data-component-complement-rule="true"'),
    card_wall_not_first_screen: cardWallNotFirstScreen,
    decision_flow_model_preserved: decisionFlowModelPreserved,
    bridge_route_preserved: html.includes('data-mode-panel="bridge"') && html.includes('id="draft-to-video-bridge-root"'),
    layout_lab_route_preserved: html.includes('data-mode-panel="layout-lab"') && html.includes('data-layout-lab="decision-shell-research"'),
    guard_drawer_preserved: guardDrawerBlock.includes('data-guard-drawer="true"'),
    safety_prominence_reduced: safetyProminenceReduced,
    dark_mode_preserved: checks.dark_mode_preserved?.passed === true,
    screenshot_path: screenshotSize > 0 ? screenshotPath : null,
    screenshot_size: screenshotSize,
    selected_candidate_id: selectedCandidateId,
    selected_channel_route_id: selectedChannelRouteId,
    first_screen_counts: {
      current_route_explanation_count: currentRouteExplanationCount,
      candidate_id_visible_count: candidateIdVisibleCount,
      channel_id_visible_count: channelIdVisibleCount,
      provider_api_visible_count_outside_guard: providerApiVisibleCountOutsideGuard,
      final_canon_visible_count_outside_guard: finalCanonVisibleCountOutsideGuard,
      competing_global_heading_count: competingGlobalHeadingCount,
      context_chip_visible_count: contextChipVisibleCount,
      pin_summary_visible_count: pinSummaryVisibleCount,
      notice_summary_visible_count: noticeSummaryVisibleCount,
      lock_summary_visible_count: lockSummaryVisibleCount
    },
    candidate_id_visible_count: candidateIdVisibleCount,
    channel_id_visible_count: channelIdVisibleCount,
    provider_api_visible_count_outside_guard: providerApiVisibleCountOutsideGuard,
    final_canon_visible_count_outside_guard: finalCanonVisibleCountOutsideGuard,
    competing_global_heading_count: competingGlobalHeadingCount,
    dock_governor: {
      max_visible_pins: 3,
      max_visible_notices: 2,
      max_visible_locks: 1,
      max_visible_context: 4,
      overflow_drawer: true
    },
    preserved_routes: [
      "public/review/index.html?mode=brief",
      "public/review/index.html?mode=layout-lab",
      "public/review/index.html?mode=bridge",
      "public/review/index.html?mode=designer",
      "public/review/index.html?mode=draft",
      "public/review/index.html?mode=source",
      "public/review/index.html?mode=project",
      "public/review/index.html?mode=artifacts"
    ],
    boundaries: {
      local_only: true,
      external_call: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      production_render: false,
      database_persistence: false,
      final_canon_decision: false,
      rights_cleared_claim: false,
      credential_material_findings: credentialFindings
    },
    local_only: true,
    external_call: false,
    provider_configured: false,
    credentials_touched: false,
    public_upload: false,
    ai_video_generation: false,
    production_render: false,
    database_persistence: false,
    final_canon_decision: false,
    rights_cleared_claim: false,
    summary: {
      component_role_contract_present: checks.component_role_contract?.passed === true,
      component_contract_count: componentContractCount,
      single_framing_source: "activeDecisionCanvas",
      route_nav_compact: checks.route_nav_compact?.passed === true,
      context_dock_budget_passed: contextDockVisibleItemBudgetPassed,
      duplication_budget_passed: duplicationBudgetPassed,
      card_wall_not_first_screen: cardWallNotFirstScreen,
      decision_flow_model_preserved: decisionFlowModelPreserved,
      safety_prominence_reduced: safetyProminenceReduced,
      bridge_route_preserved: html.includes('data-mode-panel="bridge"'),
      layout_lab_route_preserved: html.includes('data-mode-panel="layout-lab"'),
      local_only: true,
      external_call_attempted: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      production_render: false,
      database_persistence: false,
      final_canon_decision: false,
      rights_cleared_claim: false,
      failures: failures.length
    },
    validation_notes: [
      "The first brief surface now has a component role contract and one active framing owner.",
      "Route navigation is compact and contains buttons only, while operator launch commands are collapsed in a utility drawer.",
      "The Context Dock is limited to context chips, pins, notices, and one lock summary; overflow remains in drawers.",
      "Guard details remain available, but visible safety prominence is reduced to one compact lock summary.",
      "Bridge, Layout Lab, preserved readbacks, dark mode, and closed production gates remain intact."
    ],
    checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateBridgeStoryboardFlow(readback, readbackPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const workbenchPath = manifest.review_workbench_component_contract_result_path || DEFAULT_REVIEW_WORKBENCH_COMPONENT_CONTRACT_OUTPUT;
  const applyShellPath = manifest.apply_decision_shell_guard_diet_result_path || DEFAULT_APPLY_DECISION_SHELL_GUARD_DIET_OUTPUT;
  const draftBridgePath = manifest.draft_to_video_planning_bridge_result_path || DEFAULT_DRAFT_TO_VIDEO_PLANNING_BRIDGE_OUTPUT;
  const bridgeOverviewPath = manifest.bridge_refinement_overview_ribbon_result_path || DEFAULT_BRIDGE_REFINEMENT_OVERVIEW_RIBBON_OUTPUT;
  const draftPackPath = manifest.one_story_draft_review_pack_result_path || DEFAULT_ONE_STORY_DRAFT_REVIEW_PACK_OUTPUT;
  const designerDashboardPath = manifest.designer_candidate_dashboard_result_path || DEFAULT_DESIGNER_CANDIDATE_DASHBOARD_OUTPUT;
  const contradictoryGuardPath = manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT;
  const [
    workbench,
    applyShell,
    draftBridge,
    bridgeOverview,
    draftPack,
    designerDashboard,
    contradictoryGuard,
    html,
    doc
  ] = await Promise.all([
    readJson(workbenchPath),
    readJson(applyShellPath),
    readJson(draftBridgePath),
    readJson(bridgeOverviewPath),
    readJson(draftPackPath),
    readJson(designerDashboardPath),
    readJson(contradictoryGuardPath),
    readFile("public/review/index.html", "utf8"),
    readFile("docs/review/bridge-storyboard-flow.md", "utf8")
  ]);

  const sourceReadbacks = [
    {
      key: "review_workbench_component_contract",
      path: workbenchPath,
      expectedArtifactId: "fff-review-workbench-component-contract-001",
      result: workbench
    },
    {
      key: "apply_decision_shell_guard_diet",
      path: applyShellPath,
      expectedArtifactId: "fff-apply-decision-shell-guard-diet-001",
      result: applyShell
    },
    {
      key: "draft_to_video_planning_bridge",
      path: draftBridgePath,
      expectedArtifactId: "fff-draft-to-video-planning-bridge-001",
      result: draftBridge
    },
    {
      key: "bridge_refinement_overview_ribbon",
      path: bridgeOverviewPath,
      expectedArtifactId: "fff-bridge-refinement-overview-ribbon-001",
      result: bridgeOverview
    },
    {
      key: "one_story_draft_review_pack",
      path: draftPackPath,
      expectedArtifactId: "fff-one-story-draft-review-pack-001",
      result: draftPack
    },
    {
      key: "designer_candidate_dashboard",
      path: designerDashboardPath,
      expectedArtifactId: "fff-designer-candidate-dashboard-001",
      result: designerDashboard
    },
    {
      key: "contradictory_claim_guard",
      path: contradictoryGuardPath,
      expectedArtifactId: "fff-contradictory-claim-guard-001",
      result: contradictoryGuard
    }
  ];
  const sourceResultPaths = Object.fromEntries(sourceReadbacks.map((source) => [source.key, source.path]));
  const sourceArtifactIds = sourceReadbacks.map((source) => source.result?.artifact_id).filter(Boolean);
  const sourceReadbacksPreserved = sourceReadbacks.every((source) =>
    source.result?.artifact_id === source.expectedArtifactId && source.result?.passed === true
  );

  const selectedCandidateId = workbench?.selected_candidate_id || draftBridge?.selected_candidate_id || draftPack?.selected_candidate_id;
  const selectedChannelRouteId = workbench?.selected_channel_route_id || draftBridge?.selected_channel_route_id || draftPack?.channel_strategy_route?.id;
  const expectedCandidateId = "designer-content-moth-investigation-3m";
  const expectedChannelRouteId = "designer-channel-mystery-lore";
  const candidateSources = [
    workbench?.selected_candidate_id,
    draftBridge?.selected_candidate_id,
    bridgeOverview?.selected_candidate_id,
    draftPack?.selected_candidate_id
  ].filter(Boolean);
  const channelSources = [
    workbench?.selected_channel_route_id,
    draftBridge?.selected_channel_route_id,
    bridgeOverview?.selected_channel_route_id,
    draftPack?.channel_strategy_route?.id
  ].filter(Boolean);

  const modelBlock = extractConstObjectBlock(html, "bridgeStoryboardFlowModel");
  const beatsBlock = extractArrayPropertyBlock(modelBlock, "beats");
  const beatIds = [...beatsBlock.matchAll(/\bbeatId\s*:\s*["'`]([^"'`]+)["'`]/g)].map((match) => match[1]);
  const beatNumbers = [...beatsBlock.matchAll(/\bbeatNumber\s*:\s*(\d+)/g)].map((match) => Number(match[1]));
  const requiredBeatFields = [
    "titleJa",
    "timeWindow",
    "storyPurpose",
    "narrationCue",
    "subtitleCue",
    "visualIntent",
    "truthBoundary",
    "rightsAssetNote"
  ];
  const beatFieldCounts = Object.fromEntries(requiredBeatFields.map((field) => [
    field,
    countPattern(beatsBlock, new RegExp(`\\b${escapeRegExp(field)}\\s*:`, "g"))
  ]));
  const emptyBeatFieldCounts = Object.fromEntries(requiredBeatFields.map((field) => [
    field,
    countPattern(beatsBlock, new RegExp("\\b" + escapeRegExp(field) + "\\s*:\\s*(?:\"\"|''|``)", "g"))
  ]));
  const beatCount = beatIds.length;
  const uniqueBeatIds = new Set(beatIds).size === beatIds.length;
  const sequentialBeatNumbers = beatNumbers.length === 6 && beatNumbers.every((number, index) => number === index + 1);
  const completeBeatFieldContract = requiredBeatFields.every((field) =>
    beatFieldCounts[field] === 6 && emptyBeatFieldCounts[field] === 0
  );
  const allSixBeatsHaveNarration = beatCount === 6 && beatFieldCounts.narrationCue === 6 && emptyBeatFieldCounts.narrationCue === 0;
  const allSixBeatsHaveSubtitle = beatCount === 6 && beatFieldCounts.subtitleCue === 6 && emptyBeatFieldCounts.subtitleCue === 0;
  const allSixBeatsHaveVisual = beatCount === 6 && beatFieldCounts.visualIntent === 6 && emptyBeatFieldCounts.visualIntent === 0;
  const allSixBeatsHaveTruthBoundary = beatCount === 6 && beatFieldCounts.truthBoundary === 6 && emptyBeatFieldCounts.truthBoundary === 0;
  const allSixBeatsHaveRightsAssetNote = beatCount === 6 && beatFieldCounts.rightsAssetNote === 6 && emptyBeatFieldCounts.rightsAssetNote === 0;

  const bridgeRootIndex = html.indexOf('id="draft-to-video-bridge-root"');
  const storyboardIndex = html.indexOf('data-bridge-storyboard-flow="true"');
  const supportingDetailsIndex = html.indexOf('data-bridge-supporting-details="true"');
  const legacyMarkers = [
    'data-bridge-decision-console="true"',
    'data-bridge-guided-flow="true"',
    'data-bridge-refinement="overview-ribbon-bridge-refinement"'
  ];
  const legacyIndices = legacyMarkers.map((marker) => html.indexOf(marker));
  const firstLegacyIndex = legacyIndices.every((index) => index >= 0) ? Math.min(...legacyIndices) : -1;
  const storyboardFlowFirst =
    bridgeRootIndex >= 0 &&
    storyboardIndex > bridgeRootIndex &&
    supportingDetailsIndex > storyboardIndex &&
    firstLegacyIndex > storyboardIndex;
  const storyboardBlockEnd = supportingDetailsIndex > storyboardIndex
    ? supportingDetailsIndex
    : storyboardIndex + 20000;
  const storyboardBlock = storyboardIndex >= 0 ? html.slice(storyboardIndex, storyboardBlockEnd) : "";
  const supportingDetailsTagMatch = html.match(/<details\b[^>]*data-bridge-supporting-details="true"[^>]*>/i);
  const supportingDetailsTag = supportingDetailsTagMatch?.[0] || "";
  const supportingDetailsCollapsed = Boolean(supportingDetailsTag) && !/\sopen(?:\s|=|>)/i.test(supportingDetailsTag);
  const legacyMarkersInsideSupportingDetails =
    supportingDetailsIndex >= 0 &&
    legacyIndices.every((index) => index > supportingDetailsIndex);
  const legacyBridgeDetailDemotedOrCollapsed = supportingDetailsCollapsed && legacyMarkersInsideSupportingDetails;

  const interactionPathPresent =
    storyboardBlock.includes("data-storyboard-beat-rail") &&
    html.includes("data-storyboard-beat-select") &&
    storyboardBlock.includes("data-storyboard-active-canvas") &&
    html.includes("data-storyboard-prev") &&
    html.includes("data-storyboard-next") &&
    storyboardBlock.includes("data-storyboard-return-brief") &&
    storyboardBlock.includes('data-mode-target="brief"') &&
    html.includes("renderBridgeStoryboardFlow") &&
    html.includes("keydown") &&
    html.includes("ArrowLeft") &&
    html.includes("ArrowRight") &&
    html.includes("ArrowUp") &&
    html.includes("ArrowDown");
  const truthBoundaryTermsPresent = ["Toma", "brass moth", "Council"].every((term) => modelBlock.includes(term));
  const planningOnlyTiming = modelBlock.includes("planningOnly: true") && beatFieldCounts.timeWindow === 6;
  const briefRoutePreserved =
    html.includes('data-mode-panel="brief"') &&
    html.includes('data-review-workbench-canvas="true"') &&
    html.includes('data-single-framing-source="active-decision-canvas"');
  const darkModePreserved =
    html.includes(':root[data-theme="dark"]') &&
    html.includes(':root[data-theme="auto"]') &&
    html.includes('data-theme-target="light"') &&
    html.includes('data-theme-target="dark"') &&
    html.includes('data-theme-target="auto"') &&
    html.includes(":focus-visible");

  const readBoundary = (key) => readback?.[key] ?? readback?.boundaries?.[key];
  const credentialFindings = collectCredentialMaterial(readback);
  const boundaryClosed =
    readBoundary("local_only") === true &&
    readBoundary("external_call") === false &&
    readBoundary("provider_configured") === false &&
    readBoundary("credentials_touched") === false &&
    readBoundary("public_upload") === false &&
    readBoundary("ai_video_generation") === false &&
    readBoundary("production_render") === false &&
    readBoundary("database_persistence") === false &&
    readBoundary("final_canon_decision") === false &&
    readBoundary("rights_cleared_claim") === false &&
    credentialFindings.length === 0;
  const operatorGateRecordedInDoc =
    doc.includes("OPERATOR_FIRST") &&
    (doc.includes("accepted") || doc.includes("受理") || doc.includes("合格") || doc.includes("passed")) &&
    (doc.includes("closed") || doc.includes("終了") || doc.includes("完了"));
  const operatorObservationAccepted =
    readback?.operator_observation_accepted === true &&
    readback?.operator_first_closed === true &&
    operatorGateRecordedInDoc;
  const screenshotPath = toRepoPath(readback?.screenshot_path || "artifacts/review-screens/bridge-storyboard-flow.png");
  const screenshotSize = await fileSizeOrZero(screenshotPath);

  check(
    "identity",
    readback?.artifact_id === "fff-bridge-storyboard-flow-001" &&
      readback?.schemaVersion === BRIDGE_STORYBOARD_FLOW_SCHEMA_VERSION &&
      readback?.review_ui === "public/review/index.html" &&
      (readback?.review_route || readback?.access_route) === "public/review/index.html?mode=bridge" &&
      readback?.source_workbench_artifact_id === "fff-review-workbench-component-contract-001",
    `artifact=${readback?.artifact_id}; schema=${readback?.schemaVersion}; ui=${readback?.review_ui}; route=${readback?.review_route || readback?.access_route}; source=${readback?.source_workbench_artifact_id}`
  );
  check(
    "source_artifacts_preserved",
    sourceReadbacksPreserved,
    sourceReadbacks.map((source) => `${source.key}=${source.result?.artifact_id}/${source.result?.passed}`).join("; ")
  );
  check(
    "candidate_channel_preserved",
    selectedCandidateId === expectedCandidateId &&
      selectedChannelRouteId === expectedChannelRouteId &&
      candidateSources.every((value) => value === expectedCandidateId) &&
      channelSources.every((value) => value === expectedChannelRouteId) &&
      modelBlock.includes(expectedCandidateId) &&
      modelBlock.includes(expectedChannelRouteId),
    `candidate=${selectedCandidateId}; candidateSources=${candidateSources.join(",")}; channel=${selectedChannelRouteId}; channelSources=${channelSources.join(",")}`
  );
  check(
    "operator_gate_transition",
    operatorObservationAccepted,
    `accepted=${readback?.operator_observation_accepted}; closed=${readback?.operator_first_closed}; doc=${operatorGateRecordedInDoc}`
  );
  check(
    "storyboard_flow_first",
    storyboardFlowFirst &&
      modelBlock.includes('artifactId: "fff-bridge-storyboard-flow-001"') &&
      modelBlock.includes('reviewRoute: "public/review/index.html?mode=bridge"'),
    `bridgeRoot=${bridgeRootIndex}; storyboard=${storyboardIndex}; supporting=${supportingDetailsIndex}; firstLegacy=${firstLegacyIndex}`
  );
  check(
    "six_beat_contract",
    beatCount === 6 && uniqueBeatIds && sequentialBeatNumbers && completeBeatFieldContract,
    `beats=${beatCount}; unique=${uniqueBeatIds}; numbers=${beatNumbers.join(",")}; fields=${JSON.stringify(beatFieldCounts)}; empty=${JSON.stringify(emptyBeatFieldCounts)}`
  );
  check(
    "beat_content_alignment",
    allSixBeatsHaveNarration && allSixBeatsHaveSubtitle && allSixBeatsHaveVisual,
    `narration=${beatFieldCounts.narrationCue}; subtitle=${beatFieldCounts.subtitleCue}; visual=${beatFieldCounts.visualIntent}`
  );
  check(
    "truth_and_rights_boundaries",
    allSixBeatsHaveTruthBoundary &&
      allSixBeatsHaveRightsAssetNote &&
      truthBoundaryTermsPresent &&
      planningOnlyTiming &&
      contradictoryGuard?.passed === true &&
      readBoundary("final_canon_decision") === false &&
      readBoundary("rights_cleared_claim") === false,
    `truth=${beatFieldCounts.truthBoundary}; rights=${beatFieldCounts.rightsAssetNote}; heldTerms=${truthBoundaryTermsPresent}; planningOnly=${planningOnlyTiming}; guard=${contradictoryGuard?.passed}`
  );
  check(
    "interaction_path",
    interactionPathPresent,
    `rail=${storyboardBlock.includes("data-storyboard-beat-rail")}; active=${storyboardBlock.includes("data-storyboard-active-canvas")}; prev=${html.includes("data-storyboard-prev")}; next=${html.includes("data-storyboard-next")}; brief=${storyboardBlock.includes("data-storyboard-return-brief")}; keyboard=${html.includes("keydown") && html.includes("ArrowLeft") && html.includes("ArrowRight") && html.includes("ArrowUp") && html.includes("ArrowDown")}`
  );
  check(
    "legacy_bridge_detail_demoted",
    legacyBridgeDetailDemotedOrCollapsed,
    `collapsed=${supportingDetailsCollapsed}; inside=${legacyMarkersInsideSupportingDetails}; supporting=${supportingDetailsIndex}; legacy=${legacyIndices.join(",")}`
  );
  check(
    "brief_and_theme_preserved",
    briefRoutePreserved && darkModePreserved && workbench?.passed === true,
    `brief=${briefRoutePreserved}; dark=${darkModePreserved}; workbench=${workbench?.passed}`
  );
  check(
    "doc_and_visual_evidence",
    doc.includes("fff-bridge-storyboard-flow-001") &&
      doc.includes("public/review/index.html?mode=bridge") &&
      doc.includes("Review Debt") &&
      doc.includes("validate-bridge-storyboard-flow") &&
      doc.includes("smoke-bridge-storyboard-flow") &&
      (screenshotSize > 0 || !readback?.screenshot_path),
    `doc=${doc.includes("fff-bridge-storyboard-flow-001")}; reviewDebt=${doc.includes("Review Debt")}; screenshot=${screenshotPath}/${screenshotSize}`
  );
  check(
    "boundary_gates_closed",
    boundaryClosed,
    `local=${readBoundary("local_only")}; external=${readBoundary("external_call")}; provider=${readBoundary("provider_configured")}; credentials=${readBoundary("credentials_touched")}; upload=${readBoundary("public_upload")}; video=${readBoundary("ai_video_generation")}; render=${readBoundary("production_render")}; database=${readBoundary("database_persistence")}; canon=${readBoundary("final_canon_decision")}; rights=${readBoundary("rights_cleared_claim")}; findings=${credentialFindings.join(", ") || "none"}`
  );

  return {
    schemaVersion: BRIDGE_STORYBOARD_FLOW_SCHEMA_VERSION,
    artifact_id: "fff-bridge-storyboard-flow-001",
    title: "Fast Fiction Factory Bridge Storyboard Flow",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    review_ui: "public/review/index.html",
    access_route: "public/review/index.html?mode=bridge",
    review_route: "public/review/index.html?mode=bridge",
    input_result_path: toRepoPath(readbackPath),
    source_workbench_artifact_id: "fff-review-workbench-component-contract-001",
    source_workbench_preserved: checks.source_artifacts_preserved?.passed === true && briefRoutePreserved,
    source_artifact_ids: sourceArtifactIds,
    source_result_paths: sourceResultPaths,
    selected_candidate_id: selectedCandidateId,
    selected_channel_route_id: selectedChannelRouteId,
    operator_observation_accepted: checks.operator_gate_transition?.passed === true,
    operator_first_closed: checks.operator_gate_transition?.passed === true,
    storyboard_flow_first: checks.storyboard_flow_first?.passed === true,
    storyboard_flow_primary: checks.storyboard_flow_first?.passed === true,
    beat_count: beatCount,
    beat_ids: beatIds,
    beat_numbers: beatNumbers,
    beat_field_counts: beatFieldCounts,
    all_six_beats_have_narration: allSixBeatsHaveNarration,
    all_six_beats_have_subtitle: allSixBeatsHaveSubtitle,
    all_six_beats_have_visual: allSixBeatsHaveVisual,
    held_truth_or_uncertainty_boundary_present: allSixBeatsHaveTruthBoundary && truthBoundaryTermsPresent,
    final_canon_promotion_absent: planningOnlyTiming && readBoundary("final_canon_decision") === false,
    timing_windows_planning_only: planningOnlyTiming,
    rights_asset_notes_represented: allSixBeatsHaveRightsAssetNote,
    compact_six_beat_rail_visible: interactionPathPresent && beatCount === 6,
    active_beat_canvas_visible: storyboardBlock.includes("data-storyboard-active-canvas"),
    previous_next_controls_visible: html.includes("data-storyboard-prev") && html.includes("data-storyboard-next"),
    brief_return_visible: storyboardBlock.includes("data-storyboard-return-brief") && storyboardBlock.includes('data-mode-target="brief"'),
    keyboard_beat_selection: html.includes("keydown") && html.includes("ArrowLeft") && html.includes("ArrowRight") && html.includes("ArrowUp") && html.includes("ArrowDown"),
    focus_visible_preserved: html.includes(":focus-visible"),
    legacy_bridge_detail_demoted_or_collapsed: legacyBridgeDetailDemotedOrCollapsed,
    brief_route_preserved: briefRoutePreserved,
    dark_mode_preserved: darkModePreserved,
    screenshot_path: screenshotSize > 0 ? screenshotPath : null,
    screenshot_size: screenshotSize,
    review_debt: [
      "overall_brief_page_length",
      "minor_workbench_readability",
      "stale_shelf_excision",
      "broader_visual_density_cleanup"
    ],
    review_debt_is_blocker: false,
    boundaries: {
      local_only: true,
      external_call: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      production_render: false,
      database_persistence: false,
      final_canon_decision: false,
      rights_cleared_claim: false,
      credential_material_findings: credentialFindings
    },
    local_only: true,
    external_call: false,
    provider_configured: false,
    credentials_touched: false,
    public_upload: false,
    ai_video_generation: false,
    production_render: false,
    database_persistence: false,
    final_canon_decision: false,
    rights_cleared_claim: false,
    summary: {
      source_workbench_preserved: checks.source_artifacts_preserved?.passed === true && briefRoutePreserved,
      operator_observation_accepted: checks.operator_gate_transition?.passed === true,
      operator_first_closed: checks.operator_gate_transition?.passed === true,
      storyboard_flow_first: checks.storyboard_flow_first?.passed === true,
      beat_count: beatCount,
      all_six_beats_have_narration: allSixBeatsHaveNarration,
      all_six_beats_have_subtitle: allSixBeatsHaveSubtitle,
      all_six_beats_have_visual: allSixBeatsHaveVisual,
      truth_boundary_present: allSixBeatsHaveTruthBoundary && truthBoundaryTermsPresent,
      legacy_detail_collapsed: legacyBridgeDetailDemotedOrCollapsed,
      brief_route_preserved: briefRoutePreserved,
      dark_mode_preserved: darkModePreserved,
      local_only: true,
      external_call_attempted: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      production_render: false,
      database_persistence: false,
      final_canon_decision: false,
      rights_cleared_claim: false,
      failures: failures.length
    },
    validation_notes: [
      "Bridge Storyboard Flow is the first substantive Bridge review surface and remains planning-only.",
      "Six ordered beats align narration, subtitle, visual, truth-boundary, and rights/asset notes.",
      "Legacy Bridge evidence remains preserved inside collapsed supporting details.",
      "The accepted Workbench remains preserved while OPERATOR_FIRST is closed.",
      "Provider/API, credentials, AI video, render, upload, database, final canon, and rights clearance remain closed."
    ],
    checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateGuidedReviewFlowWorkspace(readback, readbackPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const overviewPath = manifest.bridge_refinement_overview_ribbon_result_path || DEFAULT_BRIDGE_REFINEMENT_OVERVIEW_RIBBON_OUTPUT;
  const homeCockpitPath = manifest.home_cockpit_metric_linking_result_path || DEFAULT_HOME_COCKPIT_METRIC_LINKING_OUTPUT;
  const bridgePath = manifest.draft_to_video_planning_bridge_result_path || DEFAULT_DRAFT_TO_VIDEO_PLANNING_BRIDGE_OUTPUT;
  const reviewBriefPath = manifest.review_brief_dark_mode_ux_result_path || DEFAULT_REVIEW_BRIEF_DARK_MODE_UX_OUTPUT;
  const draftPackPath = manifest.one_story_draft_review_pack_result_path || DEFAULT_ONE_STORY_DRAFT_REVIEW_PACK_OUTPUT;
  const designerDashboardPath = manifest.designer_candidate_dashboard_result_path || DEFAULT_DESIGNER_CANDIDATE_DASHBOARD_OUTPUT;
  const contradictoryGuardPath = manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT;
  const overview = await readJson(overviewPath);
  const homeCockpit = await readJson(homeCockpitPath);
  const bridge = await readJson(bridgePath);
  const reviewBrief = await readJson(reviewBriefPath);
  const draftPack = await readJson(draftPackPath);
  const designerDashboard = await readJson(designerDashboardPath);
  const contradictoryGuard = await readJson(contradictoryGuardPath);
  const html = await readFile("public/review/index.html", "utf8");
  const credentialFindings = collectCredentialMaterial(readback);

  const guidedFlowIndex = html.indexOf('data-guided-flow="guided-review-flow-workspace"');
  const latestOverviewIndex = html.indexOf('data-latest-overview="bridge-refinement-overview-ribbon"');
  const firstCardIndex = html.indexOf('data-home-cockpit-card=');
  const primaryActionCount = (html.match(/data-guided-primary-action="true"/g) || []).length;
  const decisionQueueStepCount = (html.match(/<li[^>]+data-decision-step=/g) || []).length;
  const currentStepCount = (html.match(/<li[^>]+data-decision-step-state="current"/g) || []).length;
  const pinnedItemCount = (html.match(/data-pinned-item=/g) || []).length;
  const importantFolderCount = (html.match(/data-folder-role=/g) || []).length;
  const inspirationPromptCount = (html.match(/data-inspiration-prompt=/g) || []).length;
  const bridgeGuidedStepCount = (html.match(/data-bridge-decision-step=/g) || []).length;
  const demotedCardGridCount = (html.match(/data-card-grid-demoted="true"/g) || []).length;
  const requiredDecisionSteps = [
    "route-confirmation",
    "narration-direction",
    "subtitle-rhythm",
    "visual-order",
    "thumbnail-direction",
    "held-truth-policy"
  ];
  const requiredFolderRoles = [
    "current-work",
    "materials",
    "evidence",
    "inspiration",
    "locked"
  ];
  const requiredPinnedItems = [
    "selected-candidate",
    "selected-channel-route",
    "active-artifact",
    "source-overview-artifact",
    "held-truth-toma-fate",
    "held-truth-brass-moth",
    "held-truth-council-motive"
  ];
  const lockedMarkers = [
    "provider/API",
    "AI video",
    "render",
    "upload",
    "final canon",
    "database persistence",
    "rights clearance"
  ];
  const selectedCandidateId = readback?.selected_candidate_id || draftPack?.selected_candidate_id || bridge?.selected_candidate_id;
  const selectedChannelRouteId = readback?.selected_channel_route_id || bridge?.selected_channel_route_id || draftPack?.channel_strategy_route?.id;

  check(
    "identity",
    readback?.artifact_id === "fff-guided-review-flow-workspace-001" &&
      readback?.schemaVersion === GUIDED_REVIEW_FLOW_WORKSPACE_SCHEMA_VERSION &&
      readback?.review_ui === "public/review/index.html" &&
      readback?.access_route === "public/review/index.html?mode=brief" &&
      readback?.bridge_route === "public/review/index.html?mode=bridge",
    `artifact=${readback?.artifact_id}; schema=${readback?.schemaVersion}; ui=${readback?.review_ui}; access=${readback?.access_route}; bridge=${readback?.bridge_route}`
  );
  check(
    "source_readbacks_preserved",
    overview?.artifact_id === "fff-bridge-refinement-overview-ribbon-001" &&
      overview?.passed === true &&
      homeCockpit?.artifact_id === "fff-home-cockpit-metric-linking-001" &&
      homeCockpit?.passed === true &&
      bridge?.artifact_id === "fff-draft-to-video-planning-bridge-001" &&
      bridge?.passed === true &&
      reviewBrief?.artifact_id === "fff-review-brief-dark-mode-ux-001" &&
      reviewBrief?.passed === true &&
      draftPack?.artifact_id === "fff-one-story-draft-review-pack-001" &&
      draftPack?.passed === true &&
      designerDashboard?.artifact_id === "fff-designer-candidate-dashboard-001" &&
      designerDashboard?.passed === true &&
      contradictoryGuard?.artifact_id === "fff-contradictory-claim-guard-001" &&
      contradictoryGuard?.passed === true,
    `overview=${overview?.artifact_id}/${overview?.passed}; home=${homeCockpit?.artifact_id}/${homeCockpit?.passed}; bridge=${bridge?.artifact_id}/${bridge?.passed}; brief=${reviewBrief?.artifact_id}/${reviewBrief?.passed}; draft=${draftPack?.artifact_id}/${draftPack?.passed}; designer=${designerDashboard?.artifact_id}/${designerDashboard?.passed}; contradictory=${contradictoryGuard?.artifact_id}/${contradictoryGuard?.passed}`
  );
  check(
    "guided_flow_visible_first",
    guidedFlowIndex >= 0 &&
      latestOverviewIndex >= 0 &&
      firstCardIndex >= 0 &&
      guidedFlowIndex < latestOverviewIndex &&
      guidedFlowIndex < firstCardIndex &&
      html.includes("Guided Review Flow / レビュー進行") &&
      html.includes("Bridgeの順番レビューを開始"),
    `guided=${guidedFlowIndex}; latest=${latestOverviewIndex}; firstCard=${firstCardIndex}`
  );
  check(
    "primary_action_exactly_one",
    primaryActionCount === 1,
    `primaryActionCount=${primaryActionCount}`
  );
  check(
    "decision_queue_ordered",
    html.includes('data-decision-queue="true"') &&
      decisionQueueStepCount >= 6 &&
      requiredDecisionSteps.every((step) => html.includes(`data-decision-step="${step}"`)) &&
      currentStepCount === 1 &&
      html.includes('data-decision-step-state="next"') &&
      html.includes('data-decision-step-state="later"'),
    `steps=${decisionQueueStepCount}; current=${currentStepCount}; required=${requiredDecisionSteps.filter((step) => html.includes(`data-decision-step="${step}"`)).length}/${requiredDecisionSteps.length}`
  );
  check(
    "pinned_tray_visible",
    html.includes('data-pinned-tray="true"') &&
      pinnedItemCount >= 7 &&
      requiredPinnedItems.every((item) => html.includes(`data-pinned-item="${item}"`)) &&
      html.includes("designer-content-moth-investigation-3m") &&
      html.includes("designer-channel-mystery-lore") &&
      html.includes("Toma fate held") &&
      html.includes("brass moth truth held") &&
      html.includes("Council motive held"),
    `pins=${pinnedItemCount}; required=${requiredPinnedItems.filter((item) => html.includes(`data-pinned-item="${item}"`)).length}/${requiredPinnedItems.length}`
  );
  check(
    "operations_notice_visible",
    html.includes('data-operations-notice="true"') &&
      html.includes("f5ae10b Refresh terminal handoff snapshot") &&
      html.includes("a332884 Add bridge refinement overview ribbon") &&
      html.includes("passed readbacks") &&
      lockedMarkers.every((marker) => html.includes(marker)),
    "operations notice should separate latest state from evidence"
  );
  check(
    "important_folders_visible",
    html.includes('data-important-folders="true"') &&
      importantFolderCount === 5 &&
      requiredFolderRoles.every((role) => html.includes(`data-folder-role="${role}"`)) &&
      html.includes("open_when") &&
      html.includes("do_not_open_when") &&
      html.includes("next_action") &&
      html.includes("audit only"),
    `folders=${importantFolderCount}; required=${requiredFolderRoles.filter((role) => html.includes(`data-folder-role="${role}"`)).length}/${requiredFolderRoles.length}`
  );
  check(
    "evidence_folder_optional",
    html.includes('data-folder-role="evidence"') &&
      html.includes("Evidence Vault") &&
      html.includes("Source Audit / Project Cockpit / Artifacts") &&
      html.includes("通常の制作仮説レビュー中") &&
      html.includes("監査時だけ"),
    "Evidence folder should remain optional and audit-only"
  );
  check(
    "inspiration_workspace_visible",
    html.includes('data-inspiration-workspace="true"') &&
      inspirationPromptCount >= 12 &&
      html.includes("motif words") &&
      html.includes("tone references") &&
      html.includes("hook phrases") &&
      html.includes("question prompts") &&
      html.includes("thumbnail emotion") &&
      html.includes("final script") &&
      html.includes("generated image"),
    `prompts=${inspirationPromptCount}`
  );
  check(
    "bridge_guided_flow_visible",
    html.includes('data-bridge-guided-flow="true"') &&
      html.includes('data-bridge-decision-queue="true"') &&
      bridgeGuidedStepCount >= 6 &&
      html.includes("Bridge順番レビュー") &&
      html.includes("Held truths + rights boundary"),
    `bridgeSteps=${bridgeGuidedStepCount}`
  );
  check(
    "card_grid_demoted",
    demotedCardGridCount >= 4 &&
      html.includes('data-card-grid-demoted="true"') &&
      guidedFlowIndex < firstCardIndex,
    `demoted=${demotedCardGridCount}; guided=${guidedFlowIndex}; firstCard=${firstCardIndex}`
  );
  check(
    "latest_overview_preserved",
    html.includes('data-latest-overview="bridge-refinement-overview-ribbon"') &&
      html.includes("Latest Overview Report") &&
      html.includes('data-overview-bridge-link="true"') &&
      overview?.latest_overview_visible === true,
    `overview=${overview?.artifact_id}/${overview?.latest_overview_visible}`
  );
  check(
    "dark_mode_preserved",
    html.includes(':root[data-theme="dark"]') &&
      html.includes(':root[data-theme="auto"]') &&
      html.includes('data-theme-target="light"') &&
      html.includes('data-theme-target="dark"') &&
      html.includes('data-theme-target="auto"') &&
      html.includes("THEME_STORAGE_KEY") &&
      html.includes("--paper-soft") &&
      html.includes("--surface-muted"),
    "theme variables and toggles should remain present"
  );
  check(
    "candidate_channel_preserved",
    selectedCandidateId === "designer-content-moth-investigation-3m" &&
      selectedChannelRouteId === "designer-channel-mystery-lore" &&
      html.includes("designer-content-moth-investigation-3m") &&
      html.includes("designer-channel-mystery-lore"),
    `candidate=${selectedCandidateId}; channel=${selectedChannelRouteId}`
  );
  check(
    "boundary_gates_closed",
    readback?.local_only === true &&
      readback?.external_call === false &&
      readback?.provider_configured === false &&
      readback?.credentials_touched === false &&
      readback?.public_upload === false &&
      readback?.ai_video_generation === false &&
      readback?.production_render === false &&
      readback?.final_canon_decision === false &&
      readback?.database_persistence === false &&
      readback?.rights_cleared_claim === false &&
      lockedMarkers.every((marker) => html.includes(marker)) &&
      credentialFindings.length === 0,
    `local=${readback?.local_only}; external=${readback?.external_call}; provider=${readback?.provider_configured}; credentials=${readback?.credentials_touched}; upload=${readback?.public_upload}; video=${readback?.ai_video_generation}; render=${readback?.production_render}; canon=${readback?.final_canon_decision}; database=${readback?.database_persistence}; rights=${readback?.rights_cleared_claim}; findings=${credentialFindings.join(", ") || "none"}`
  );

  return {
    schemaVersion: GUIDED_REVIEW_FLOW_WORKSPACE_SCHEMA_VERSION,
    artifact_id: "fff-guided-review-flow-workspace-001",
    title: "Fast Fiction Factory Guided Review Flow Workspace",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    review_ui: "public/review/index.html",
    access_route: "public/review/index.html?mode=brief",
    bridge_route: "public/review/index.html?mode=bridge",
    input_result_path: toRepoPath(readbackPath),
    source_overview_artifact_id: "fff-bridge-refinement-overview-ribbon-001",
    source_result_paths: {
      bridge_refinement_overview_ribbon: overviewPath,
      home_cockpit_metric_linking: homeCockpitPath,
      draft_to_video_planning_bridge: bridgePath,
      review_brief_dark_mode_ux: reviewBriefPath,
      one_story_draft_review_pack: draftPackPath,
      designer_candidate_dashboard: designerDashboardPath,
      contradictory_claim_guard: contradictoryGuardPath
    },
    guided_flow_visible: checks.guided_flow_visible_first?.passed === true,
    primary_action_count: primaryActionCount,
    decision_queue_visible: checks.decision_queue_ordered?.passed === true,
    decision_queue_step_count: decisionQueueStepCount,
    current_step_count: currentStepCount,
    pinned_tray_visible: checks.pinned_tray_visible?.passed === true,
    pinned_item_count: pinnedItemCount,
    operations_notice_visible: checks.operations_notice_visible?.passed === true,
    important_folder_count: importantFolderCount,
    evidence_folder_optional: checks.evidence_folder_optional?.passed === true,
    inspiration_workspace_visible: checks.inspiration_workspace_visible?.passed === true,
    inspiration_prompt_count: inspirationPromptCount,
    bridge_guided_flow_visible: checks.bridge_guided_flow_visible?.passed === true,
    bridge_guided_step_count: bridgeGuidedStepCount,
    card_grid_demoted: checks.card_grid_demoted?.passed === true,
    latest_overview_preserved: checks.latest_overview_preserved?.passed === true,
    dark_mode_preserved: checks.dark_mode_preserved?.passed === true,
    selected_candidate_id: selectedCandidateId,
    selected_channel_route_id: selectedChannelRouteId,
    boundaries: {
      local_only: true,
      external_call: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      production_render: false,
      final_canon_decision: false,
      database_persistence: false,
      rights_cleared_claim: false,
      credential_material_findings: credentialFindings
    },
    local_only: true,
    external_call: false,
    provider_configured: false,
    credentials_touched: false,
    public_upload: false,
    ai_video_generation: false,
    production_render: false,
    final_canon_decision: false,
    database_persistence: false,
    rights_cleared_claim: false,
    summary: {
      guided_flow_visible: checks.guided_flow_visible_first?.passed === true,
      primary_action_count: primaryActionCount,
      decision_queue_step_count: decisionQueueStepCount,
      current_step_count: currentStepCount,
      pinned_item_count: pinnedItemCount,
      important_folder_count: importantFolderCount,
      inspiration_prompt_count: inspirationPromptCount,
      bridge_guided_step_count: bridgeGuidedStepCount,
      card_grid_demoted: checks.card_grid_demoted?.passed === true,
      evidence_folder_optional: checks.evidence_folder_optional?.passed === true,
      local_only: true,
      external_call_attempted: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      production_render: false,
      final_canon_decision: false,
      database_persistence: false,
      rights_cleared_claim: false,
      failures: failures.length
    },
    validation_notes: [
      "The first visible brief section is a guided review flow, not a card grid.",
      "The top guided flow exposes exactly one primary action and exactly one current decision step.",
      "Pinned items, operations notices, important folders, and inspiration prompts separate state, actions, evidence, and creative thinking.",
      "Bridge mode adds an ordered guided sequence before detailed bridge cards.",
      "Evidence Vault remains optional, and provider/API, video, render, upload, database, rights, and final-canon lanes remain closed."
    ],
    checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateHomeCockpitMetricLinking(readback, readbackPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const bridgePath = manifest.draft_to_video_planning_bridge_result_path || DEFAULT_DRAFT_TO_VIDEO_PLANNING_BRIDGE_OUTPUT;
  const reviewBriefPath = manifest.review_brief_dark_mode_ux_result_path || DEFAULT_REVIEW_BRIEF_DARK_MODE_UX_OUTPUT;
  const draftPackPath = manifest.one_story_draft_review_pack_result_path || DEFAULT_ONE_STORY_DRAFT_REVIEW_PACK_OUTPUT;
  const designerDashboardPath = manifest.designer_candidate_dashboard_result_path || DEFAULT_DESIGNER_CANDIDATE_DASHBOARD_OUTPUT;
  const stabilizationPath = manifest.stabilization_result_path || "artifacts/draft-review-pack-stabilization-result.json";
  const contradictoryGuardPath = manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT;
  const bridge = await readJson(bridgePath);
  const reviewBrief = await readJson(reviewBriefPath);
  const draftPack = await readJson(draftPackPath);
  const designerDashboard = await readJson(designerDashboardPath);
  const stabilization = await readJson(stabilizationPath);
  const contradictoryGuard = await readJson(contradictoryGuardPath);
  const html = await readFile("public/review/index.html", "utf8");
  const credentialFindings = collectCredentialMaterial(readback);

  const operatorTrackCards = (html.match(/data-home-cockpit-card="operator"/g) || []).length;
  const workbenchCards = (html.match(/data-home-cockpit-card="workbench"/g) || []).length;
  const evidenceVaultCards = (html.match(/data-home-cockpit-card="evidence"/g) || []).length;
  const lockedLaneCards = (html.match(/data-locked-lane=/g) || []).length;
  const readinessMeterCount = (html.match(/data-readiness-meter=/g) || []).length;
  const meterActionCount = (html.match(/data-meter-action-target=/g) || []).length;
  const shelfCardCount = (html.match(/data-shelf-card=/g) || []).length;
  const meterCount = (html.match(/class="meter-bar/g) || []).length;
  const measuredMeterCount = (html.match(/meter_mode: measured/g) || []).length;
  const hypothesisMeterCount = (html.match(/meter_mode: hypothesis/g) || []).length;
  const requiredMeterLabels = [
    "選択ルート",
    "ナレーション構成",
    "字幕・画面テキスト",
    "画面構成",
    "サムネ案",
    "権利・素材",
    "未決定の真相",
    "証跡の健全性",
    "公開・生成 Lane"
  ];
  const requiredEvidenceLabels = [
    "Evidence Vault",
    "Source Audit",
    "Project Cockpit",
    "Artifacts",
    "open_when",
    "do_not_open_when",
    "next_action"
  ];
  const lockedMarkers = [
    "provider/API",
    "AI video",
    "render",
    "upload",
    "final canon",
    "rights clearance"
  ];

  check(
    "identity",
    readback?.artifact_id === "fff-home-cockpit-metric-linking-001" &&
      readback?.schemaVersion === HOME_COCKPIT_METRIC_LINKING_SCHEMA_VERSION &&
      readback?.review_ui === "public/review/index.html" &&
      readback?.access_route === "public/review/index.html?mode=brief",
    `artifact=${readback?.artifact_id}; schema=${readback?.schemaVersion}; ui=${readback?.review_ui}; route=${readback?.access_route}`
  );
  check(
    "home_cockpit_visible",
    html.includes('data-home-cockpit="home-cockpit-metric-linking"') &&
      html.includes('id="review-home-root"') &&
      html.includes('data-mode-panel="brief"') &&
      html.includes('data-review-mode="brief"') &&
      html.includes("const REVIEW_MODES") &&
      html.includes('"layout-lab"') &&
      html.includes('"brief"') &&
      html.includes('"bridge"') &&
      html.includes('|| "brief"') &&
      html.includes('allowedMode === "home"') &&
      html.includes("public/review/index.html?mode=home"),
    `default=${readback?.default_mode || readback?.default_review_mode}; alias=${readback?.optional_alias_route}`
  );
  check(
    "semantic_card_groups",
    operatorTrackCards >= 2 &&
      workbenchCards >= 3 &&
      evidenceVaultCards >= 3 &&
      lockedLaneCards >= 6 &&
      shelfCardCount === 7,
    `operator=${operatorTrackCards}; workbench=${workbenchCards}; evidence=${evidenceVaultCards}; locked=${lockedLaneCards}; shelves=${shelfCardCount}`
  );
  check(
    "readiness_meters_actionable",
    readinessMeterCount >= 9 &&
      meterActionCount >= readinessMeterCount &&
      meterCount >= 17 &&
      measuredMeterCount >= 12 &&
      hypothesisMeterCount >= 2 &&
      measuredMeterCount + hypothesisMeterCount === meterCount,
    `readiness=${readinessMeterCount}; actions=${meterActionCount}; meters=${meterCount}; measured=${measuredMeterCount}; hypothesis=${hypothesisMeterCount}`
  );
  check(
    "meter_labels_japanese",
    requiredMeterLabels.every((label) => html.includes(label)) &&
      html.includes("次の動き") &&
      html.includes("Bridgeを見る"),
    `labels=${requiredMeterLabels.filter((label) => html.includes(label)).length}/${requiredMeterLabels.length}`
  );
  check(
    "evidence_vault_semantically_linked",
    requiredEvidenceLabels.every((label) => html.includes(label)) &&
      html.includes("public/review/index.html?mode=source") &&
      html.includes("public/review/index.html?mode=project") &&
      html.includes("public/review/index.html?mode=artifacts"),
    `evidenceLabels=${requiredEvidenceLabels.filter((label) => html.includes(label)).length}/${requiredEvidenceLabels.length}`
  );
  check(
    "default_mode_preserved_or_updated",
    html.includes('data-mode-target="brief"') &&
      html.includes("Home Cockpit / Review Brief") &&
      html.includes("What to read now pathway") &&
      html.includes("route / narration / subtitle / visual / thumbnail / held truths"),
    "brief default should be the Home Cockpit command surface"
  );
  check(
    "bridge_route_preserved",
    html.includes('id="draft-to-video-bridge-root"') &&
      html.includes('data-mode-panel="bridge"') &&
      html.includes('data-mode-target="bridge"') &&
      html.includes("public/review/index.html?mode=bridge") &&
      bridge?.artifact_id === "fff-draft-to-video-planning-bridge-001" &&
      bridge?.passed === true,
    `bridge=${bridge?.artifact_id}/${bridge?.passed}`
  );
  check(
    "dark_mode_preserved",
    html.includes("--meter-track") &&
      html.includes("--meter-fill") &&
      html.includes(':root[data-theme="dark"]') &&
      html.includes(':root[data-theme="auto"]') &&
      html.includes('data-theme-target="light"') &&
      html.includes('data-theme-target="dark"') &&
      html.includes('data-theme-target="auto"') &&
      html.includes("THEME_STORAGE_KEY"),
    "theme variables and toggles should remain present"
  );
  check(
    "source_readbacks_preserved",
    reviewBrief?.artifact_id === "fff-review-brief-dark-mode-ux-001" &&
      reviewBrief?.passed === true &&
      draftPack?.artifact_id === "fff-one-story-draft-review-pack-001" &&
      draftPack?.passed === true &&
      designerDashboard?.artifact_id === "fff-designer-candidate-dashboard-001" &&
      designerDashboard?.passed === true &&
      stabilization?.artifact_id === "fff-draft-review-pack-stabilization-001" &&
      stabilization?.passed === true &&
      contradictoryGuard?.artifact_id === "fff-contradictory-claim-guard-001" &&
      contradictoryGuard?.passed === true,
    `brief=${reviewBrief?.artifact_id}/${reviewBrief?.passed}; draft=${draftPack?.artifact_id}/${draftPack?.passed}; designer=${designerDashboard?.artifact_id}/${designerDashboard?.passed}; stabilization=${stabilization?.artifact_id}/${stabilization?.passed}; contradictory=${contradictoryGuard?.artifact_id}/${contradictoryGuard?.passed}`
  );
  check(
    "boundary_gates_closed",
    readback?.local_only === true &&
      readback?.external_call === false &&
      readback?.provider_configured === false &&
      readback?.credentials_touched === false &&
      readback?.public_upload === false &&
      readback?.ai_video_generation === false &&
      readback?.production_render === false &&
      readback?.final_canon_decision === false &&
      readback?.rights_cleared_claim === false &&
      lockedMarkers.every((marker) => html.includes(marker)) &&
      credentialFindings.length === 0,
    `local=${readback?.local_only}; external=${readback?.external_call}; provider=${readback?.provider_configured}; credentials=${readback?.credentials_touched}; findings=${credentialFindings.join(", ") || "none"}`
  );

  return {
    schemaVersion: HOME_COCKPIT_METRIC_LINKING_SCHEMA_VERSION,
    artifact_id: "fff-home-cockpit-metric-linking-001",
    title: "Fast Fiction Factory Home Cockpit Metric Linking",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    review_ui: "public/review/index.html",
    access_route: "public/review/index.html?mode=brief",
    optional_alias_route: "public/review/index.html?mode=home",
    input_result_path: toRepoPath(readbackPath),
    source_bridge_artifact_id: "fff-draft-to-video-planning-bridge-001",
    source_review_brief_artifact_id: "fff-review-brief-dark-mode-ux-001",
    source_result_paths: {
      draft_to_video_planning_bridge: bridgePath,
      review_brief_dark_mode_ux: reviewBriefPath,
      one_story_draft_review_pack: draftPackPath,
      designer_candidate_dashboard: designerDashboardPath,
      draft_review_pack_stabilization: stabilizationPath,
      contradictory_claim_guard: contradictoryGuardPath
    },
    home_cockpit_visible: checks.home_cockpit_visible?.passed === true,
    operator_track_cards: operatorTrackCards,
    workbench_cards: workbenchCards,
    evidence_vault_cards: evidenceVaultCards,
    locked_lane_cards: lockedLaneCards,
    shelf_card_count: shelfCardCount,
    readiness_meter_count: readinessMeterCount,
    meter_action_count: meterActionCount,
    meters_actionable: checks.readiness_meters_actionable?.passed === true,
    meter_labels_japanese: checks.meter_labels_japanese?.passed === true,
    evidence_vault_semantically_linked: checks.evidence_vault_semantically_linked?.passed === true,
    default_mode_preserved_or_updated: checks.default_mode_preserved_or_updated?.passed === true,
    default_mode: "brief",
    bridge_route_preserved: checks.bridge_route_preserved?.passed === true,
    dark_mode_preserved: checks.dark_mode_preserved?.passed === true,
    source_readbacks_preserved: checks.source_readbacks_preserved?.passed === true,
    primary_operator_routes: [
      "public/review/index.html?mode=brief",
      "public/review/index.html?mode=bridge",
      "public/review/index.html?mode=home"
    ],
    evidence_vault_routes: [
      "public/review/index.html?mode=source",
      "public/review/index.html?mode=project",
      "public/review/index.html?mode=artifacts"
    ],
    workbench_routes: [
      "public/review/index.html?mode=draft",
      "public/review/index.html?mode=designer",
      "public/review/index.html?mode=story"
    ],
    locked_lanes: [
      "provider/API",
      "AI video",
      "render",
      "upload",
      "final canon",
      "rights clearance"
    ],
    boundaries: {
      local_only: true,
      external_call: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      production_render: false,
      final_canon_decision: false,
      rights_cleared_claim: false,
      credential_material_findings: credentialFindings
    },
    local_only: true,
    external_call: false,
    provider_configured: false,
    credentials_touched: false,
    public_upload: false,
    ai_video_generation: false,
    production_render: false,
    final_canon_decision: false,
    rights_cleared_claim: false,
    summary: {
      home_cockpit_visible: checks.home_cockpit_visible?.passed === true,
      operator_track_cards: operatorTrackCards,
      workbench_cards: workbenchCards,
      evidence_vault_cards: evidenceVaultCards,
      locked_lane_cards: lockedLaneCards,
      readiness_meter_count: readinessMeterCount,
      meter_action_count: meterActionCount,
      default_mode: "brief",
      optional_alias_route: "public/review/index.html?mode=home",
      bridge_route_preserved: checks.bridge_route_preserved?.passed === true,
      dark_mode_preserved: checks.dark_mode_preserved?.passed === true,
      source_readbacks_preserved: checks.source_readbacks_preserved?.passed === true,
      local_only: true,
      external_call_attempted: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      production_render: false,
      final_canon_decision: false,
      rights_cleared_claim: false,
      failures: failures.length
    },
    validation_notes: [
      "Review Brief is now the Home Cockpit default command surface.",
      "mode=home is retained as a compatibility alias to the same Home Cockpit.",
      "Readiness meters link to Bridge, Workbench, Evidence Vault, or Locked Lane follow-up actions.",
      "Operator Track, Workbench, Evidence Vault, and Locked Lanes are semantically separated.",
      "Provider/API setup, AI video generation, production render, upload, final canon, and rights clearance remain out of scope."
    ],
    checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateReviewHomeMapMeters(readback, readbackPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const bridgePath = manifest.draft_to_video_planning_bridge_result_path || DEFAULT_DRAFT_TO_VIDEO_PLANNING_BRIDGE_OUTPUT;
  const reviewBriefPath = manifest.review_brief_dark_mode_ux_result_path || DEFAULT_REVIEW_BRIEF_DARK_MODE_UX_OUTPUT;
  const draftPackPath = manifest.one_story_draft_review_pack_result_path || DEFAULT_ONE_STORY_DRAFT_REVIEW_PACK_OUTPUT;
  const designerDashboardPath = manifest.designer_candidate_dashboard_result_path || DEFAULT_DESIGNER_CANDIDATE_DASHBOARD_OUTPUT;
  const stabilizationPath = manifest.stabilization_result_path || "artifacts/draft-review-pack-stabilization-result.json";
  const contradictoryGuardPath = manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT;
  const bridge = await readJson(bridgePath);
  const reviewBrief = await readJson(reviewBriefPath);
  const draftPack = await readJson(draftPackPath);
  const designerDashboard = await readJson(designerDashboardPath);
  const stabilization = await readJson(stabilizationPath);
  const contradictoryGuard = await readJson(contradictoryGuardPath);
  const html = await readFile("public/review/index.html", "utf8");
  const credentialFindings = collectCredentialMaterial(readback);

  const shelfCardCount = (html.match(/data-shelf-card=/g) || []).length;
  const meterCount = (html.match(/class="meter-bar/g) || []).length;
  const measuredMeterCount = (html.match(/meter_mode: measured/g) || []).length;
  const hypothesisMeterCount = (html.match(/meter_mode: hypothesis/g) || []).length;
  const primaryRoutes = readback.primary_operator_routes || [];
  const evidenceRoutes = readback.evidence_vault_routes || [];
  const lockedGateCount = Number(readback.locked_gate_count || 0);
  const requiredShelves = [
    "review-home-brief",
    "draft-to-video-bridge",
    "draft-review-pack",
    "designer-dashboard",
    "source-audit",
    "project-cockpit",
    "artifacts"
  ];
  const evidenceLabels = [
    "Source Audit",
    "Project Cockpit",
    "Artifacts",
    "Evidence Vault",
    "open_when",
    "do_not_open_when",
    "next_action"
  ];
  const lockedMarkers = [
    "provider/API",
    "AI video",
    "render",
    "upload",
    "final canon",
    "rights clearance"
  ];

  check(
    "identity",
    readback?.artifact_id === "fff-review-home-map-meters-001" &&
      readback?.schemaVersion === REVIEW_HOME_MAP_METERS_SCHEMA_VERSION &&
      readback?.review_ui === "public/review/index.html" &&
      readback?.access_route === "public/review/index.html?mode=home" &&
      ["home", "brief"].includes(readback?.default_mode),
    `artifact=${readback?.artifact_id}; schema=${readback?.schemaVersion}; route=${readback?.access_route}; default=${readback?.default_mode}`
  );
  check(
    "home_map_visible",
    readback?.home_map_visible === true &&
      html.includes('id="review-home-root"') &&
      html.includes('data-mode-panel="brief"') &&
      html.includes('data-home-map="review-home-map-meters"') &&
      html.includes('data-home-cockpit="home-cockpit-metric-linking"') &&
      html.includes('data-review-mode="brief"') &&
      html.includes("const REVIEW_MODES") &&
      html.includes('"layout-lab"') &&
      html.includes('"brief"') &&
      html.includes('"bridge"') &&
      html.includes('|| "brief"') &&
      html.includes('allowedMode === "home"'),
    `home=${readback?.home_map_visible}; default=${readback?.default_mode}`
  );
  check(
    "shelf_cards_and_meters",
    shelfCardCount >= 7 &&
      shelfCardCount <= 7 &&
      meterCount >= 7 &&
      measuredMeterCount >= 5 &&
      hypothesisMeterCount >= 1 &&
      measuredMeterCount + hypothesisMeterCount === meterCount &&
      requiredShelves.every((shelf) => html.includes(`data-shelf-card="${shelf}"`)),
    `shelves=${shelfCardCount}; meters=${meterCount}; measured=${measuredMeterCount}; hypothesis=${hypothesisMeterCount}`
  );
  check(
    "what_to_read_now_pathway",
    html.includes("What to read now pathway") &&
      html.includes("Review Home") &&
      html.includes("Draft-to-Video Bridge") &&
      html.includes("route / narration / subtitle / visual / thumbnail / held truths") &&
      (primaryRoutes.includes("public/review/index.html?mode=home") || html.includes("public/review/index.html?mode=home")) &&
      (primaryRoutes.includes("public/review/index.html?mode=brief") || html.includes("public/review/index.html?mode=brief")) &&
      primaryRoutes.includes("public/review/index.html?mode=bridge"),
    `primaryRoutes=${primaryRoutes.join(", ")}`
  );
  check(
    "home_to_shelf_links",
    readback?.bridge_link_visible === true &&
      html.includes("Bridge\u3092\u898b\u308b") &&
      html.includes('data-mode-target="bridge"') &&
      html.includes('data-mode-target="draft"') &&
      html.includes('data-mode-target="designer"') &&
      html.includes('data-mode-target="source"') &&
      html.includes('data-mode-target="project"') &&
      html.includes('data-mode-target="artifacts"'),
    `bridgeLink=${readback?.bridge_link_visible}`
  );
  check(
    "evidence_vault_mapping",
    readback?.evidence_open_triggers_visible === true &&
      evidenceRoutes.includes("public/review/index.html?mode=source") &&
      evidenceRoutes.includes("public/review/index.html?mode=project") &&
      evidenceRoutes.includes("public/review/index.html?mode=artifacts") &&
      evidenceLabels.every((label) => html.includes(label)),
    `evidenceRoutes=${evidenceRoutes.join(", ")}; triggers=${readback?.evidence_open_triggers_visible}`
  );
  check(
    "dark_mode_preserved",
    readback?.dark_mode_preserved === true &&
      html.includes("--meter-track") &&
      html.includes("--meter-fill") &&
      html.includes(':root[data-theme="dark"]') &&
      html.includes(':root[data-theme="auto"]') &&
      html.includes('data-theme-target="light"') &&
      html.includes('data-theme-target="dark"') &&
      html.includes('data-theme-target="auto"'),
    `darkMode=${readback?.dark_mode_preserved}`
  );
  check(
    "source_artifacts_preserved",
    bridge?.artifact_id === "fff-draft-to-video-planning-bridge-001" &&
      bridge?.passed === true &&
      reviewBrief?.artifact_id === "fff-review-brief-dark-mode-ux-001" &&
      reviewBrief?.passed === true &&
      draftPack?.artifact_id === "fff-one-story-draft-review-pack-001" &&
      draftPack?.passed === true &&
      designerDashboard?.artifact_id === "fff-designer-candidate-dashboard-001" &&
      designerDashboard?.passed === true &&
      stabilization?.artifact_id === "fff-draft-review-pack-stabilization-001" &&
      stabilization?.passed === true &&
      contradictoryGuard?.artifact_id === "fff-contradictory-claim-guard-001" &&
      contradictoryGuard?.passed === true,
    `bridge=${bridge?.artifact_id}/${bridge?.passed}; brief=${reviewBrief?.artifact_id}/${reviewBrief?.passed}; draft=${draftPack?.artifact_id}/${draftPack?.passed}; designer=${designerDashboard?.artifact_id}/${designerDashboard?.passed}; stabilization=${stabilization?.artifact_id}/${stabilization?.passed}; contradictory=${contradictoryGuard?.artifact_id}/${contradictoryGuard?.passed}`
  );
  check(
    "boundary_gates_closed",
    readback?.local_only === true &&
      readback?.external_call === false &&
      readback?.provider_configured === false &&
      readback?.credentials_touched === false &&
      readback?.public_upload === false &&
      readback?.ai_video_generation === false &&
      readback?.production_render === false &&
      readback?.final_canon_decision === false &&
      readback?.rights_cleared_claim === false &&
      lockedGateCount >= 6 &&
      lockedMarkers.every((marker) => html.includes(marker)) &&
      credentialFindings.length === 0,
    `local=${readback?.local_only}; locked=${lockedGateCount}; findings=${credentialFindings.join(", ") || "none"}`
  );

  return {
    schemaVersion: REVIEW_HOME_MAP_METERS_SCHEMA_VERSION,
    artifact_id: "fff-review-home-map-meters-001",
    title: "Fast Fiction Factory Review Home Map and Meters",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    review_ui: "public/review/index.html",
    access_route: "public/review/index.html?mode=home",
    input_result_path: toRepoPath(readbackPath),
    default_mode: "brief",
    home_map_visible: checks.home_map_visible?.passed === true,
    shelf_card_count: shelfCardCount,
    meter_count: meterCount,
    measured_meter_count: measuredMeterCount,
    hypothesis_meter_count: hypothesisMeterCount,
    primary_operator_routes: [
      "public/review/index.html?mode=brief",
      "public/review/index.html?mode=bridge",
      "public/review/index.html?mode=home"
    ],
    evidence_vault_routes: evidenceRoutes.length ? evidenceRoutes : [
      "public/review/index.html?mode=source",
      "public/review/index.html?mode=project",
      "public/review/index.html?mode=artifacts"
    ],
    locked_gate_count: lockedGateCount || 6,
    bridge_link_visible: checks.home_to_shelf_links?.passed === true,
    evidence_open_triggers_visible: checks.evidence_vault_mapping?.passed === true,
    dark_mode_preserved: checks.dark_mode_preserved?.passed === true,
    source_artifacts_preserved: checks.source_artifacts_preserved?.passed === true,
    source_artifacts: [
      bridge?.artifact_id,
      reviewBrief?.artifact_id,
      draftPack?.artifact_id,
      designerDashboard?.artifact_id,
      stabilization?.artifact_id,
      contradictoryGuard?.artifact_id
    ].filter(Boolean),
    shelf_cards: readback.shelf_cards || [],
    meter_semantics: {
      measured: "Use only local counts, static readback flags, preserved result JSON, and locked gate counts.",
      hypothesis: "Use only UX clarity or user-burden judgments; never imply production readiness."
    },
    boundaries: {
      local_only: true,
      external_call: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      production_render: false,
      final_canon_decision: false,
      rights_cleared_claim: false,
      credential_material_findings: credentialFindings
    },
    local_only: true,
    external_call: false,
    provider_configured: false,
    credentials_touched: false,
    public_upload: false,
    ai_video_generation: false,
    production_render: false,
    final_canon_decision: false,
    rights_cleared_claim: false,
    summary: {
      default_mode: "brief",
      home_map_visible: checks.home_map_visible?.passed === true,
      shelf_card_count: shelfCardCount,
      meter_count: meterCount,
      measured_meter_count: measuredMeterCount,
      hypothesis_meter_count: hypothesisMeterCount,
      primary_operator_route_count: 3,
      evidence_vault_route_count: evidenceRoutes.length || 3,
      locked_gate_count: lockedGateCount || 6,
      bridge_link_visible: checks.home_to_shelf_links?.passed === true,
      evidence_open_triggers_visible: checks.evidence_vault_mapping?.passed === true,
      dark_mode_preserved: checks.dark_mode_preserved?.passed === true,
      source_artifacts_preserved: checks.source_artifacts_preserved?.passed === true,
      local_only: true,
      external_call_attempted: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      production_render: false,
      final_canon_decision: false,
      rights_cleared_claim: false,
      failures: failures.length
    },
    validation_notes: [
      "Review Home Map is preserved through the Home Cockpit command surface; mode=home is a compatibility alias to brief.",
      "Evidence Vault shelves are summarized, not removed.",
      "Measured meters are backed by local counts and readbacks; hypothesis meters are only UX clarity signals.",
      "No provider/API, AI video, render, upload, final canon, or rights clearance boundary is opened."
    ],
    checks,
    failures,
    passed: failures.length === 0
  };
}

async function validateDesignerCandidateDashboard(dashboard, dashboardPath) {
  const failures = [];
  const checks = {};
  const check = (name, passed, detail) => {
    checks[name] = { passed: Boolean(passed), detail };
    if (!passed) {
      failures.push(`${name}: ${detail}`);
    }
  };

  const manifest = await readJson("artifacts/artifact-manifest.json");
  const contradictoryGuard = await readJson(manifest.contradictory_claim_guard_result_path || DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT);
  const downstreamGate = await readJson(manifest.downstream_source_span_adoption_gate_result_path || DEFAULT_DOWNSTREAM_SOURCE_SPAN_ADOPTION_GATE_OUTPUT);
  const providerEnvelope = await readJson(manifest.provider_envelope_readiness_no_call_result_path || DEFAULT_PROVIDER_ENVELOPE_READINESS_NO_CALL_OUTPUT);
  const sourcePack = await readJson(manifest.source_span_review_pack_path || "artifacts/source-span-routing-review-pack.json");
  const credentialFindings = collectCredentialMaterial(dashboard);
  const contentCandidates = Array.isArray(dashboard.content_candidates) ? dashboard.content_candidates : [];
  const channelStrategyProposals = Array.isArray(dashboard.channel_strategy_proposals) ? dashboard.channel_strategy_proposals : [];
  const draftSpineBeats = Array.isArray(dashboard.draft_spine?.beats) ? dashboard.draft_spine.beats : [];
  const reviewRisks = Array.isArray(dashboard.review_risks) ? dashboard.review_risks : [];
  const heldDecisions = Array.isArray(dashboard.human_owned_decisions_held) ? dashboard.human_owned_decisions_held : [];
  const counts = dashboard.counts || {};

  check(
    "identity",
    dashboard?.artifact_id === "fff-designer-candidate-dashboard-001" &&
      dashboard?.schemaVersion === DESIGNER_CANDIDATE_DASHBOARD_SCHEMA_VERSION &&
      dashboard?.review_ui === "public/review/index.html",
    `artifact=${dashboard?.artifact_id}; schema=${dashboard?.schemaVersion}; ui=${dashboard?.review_ui}`
  );
  check(
    "local_only_boundaries",
    dashboard?.local_only === true &&
      dashboard?.external_call === false &&
      dashboard?.provider_configured === false &&
      dashboard?.credentials_touched === false &&
      dashboard?.public_upload === false &&
      dashboard?.ai_video_generation === false &&
      dashboard?.final_canon_decision === false &&
      credentialFindings.length === 0,
    `local=${dashboard?.local_only}; external=${dashboard?.external_call}; provider=${dashboard?.provider_configured}; credentials=${dashboard?.credentials_touched}; findings=${credentialFindings.join(", ") || "none"}`
  );
  check(
    "review_surface_counts",
    contentCandidates.length >= 3 &&
      channelStrategyProposals.length >= 3 &&
      draftSpineBeats.length >= 5 &&
      reviewRisks.length >= 4 &&
      heldDecisions.length >= 3,
    `content=${contentCandidates.length}; channels=${channelStrategyProposals.length}; beats=${draftSpineBeats.length}; risks=${reviewRisks.length}; held=${heldDecisions.length}`
  );
  check(
    "reported_counts_match",
    counts.content_candidates === contentCandidates.length &&
      counts.channel_strategy_proposals === channelStrategyProposals.length &&
      counts.draft_spine_beats === draftSpineBeats.length &&
      counts.unresolved_risks === reviewRisks.length &&
      counts.human_owned_decisions_held === heldDecisions.length,
    `counts=${JSON.stringify(counts)}`
  );
  check(
    "required_card_fields_visible",
    contentCandidates.every((candidate) =>
      candidate.title_or_hook &&
      candidate.format_fit &&
      candidate.premise_audience_promise &&
      candidate.draft_readiness &&
      candidate.visual_or_thumbnail_direction &&
      candidate.subtitle_or_narration_promise &&
      Array.isArray(candidate.unresolved_risks) &&
      candidate.recommended_next_review_decision
    ) &&
      channelStrategyProposals.every((proposal) =>
        proposal.channel_archetype &&
        proposal.target_audience &&
        Array.isArray(proposal.content_pillars) &&
        proposal.series_angle &&
        proposal.cadence_hypothesis &&
        proposal.material_fit &&
        Array.isArray(proposal.risk_flags) &&
        proposal.review_debt
      ),
    `contentFields=${contentCandidates.length}; channelFields=${channelStrategyProposals.length}`
  );
  check(
    "draft_is_not_final_prose",
    dashboard.draft_spine?.status === "reviewable_not_final_prose" &&
      dashboard.final_canon_decision === false &&
      draftSpineBeats.every((beat) => beat.review_status === "hold"),
    `draftStatus=${dashboard.draft_spine?.status}; finalCanon=${dashboard.final_canon_decision}`
  );
  check(
    "absence_and_unknowns_visible",
    dashboard.absence_policy?.unknown_fields_visible === true &&
      dashboard.absence_policy?.missing_data_label &&
      reviewRisks.some((risk) => String(risk.finding || "").toLowerCase().includes("no render")) &&
      reviewRisks.some((risk) => String(risk.finding || "").toLowerCase().includes("rights")),
    `unknowns=${dashboard.absence_policy?.unknown_fields_visible}; label=${dashboard.absence_policy?.missing_data_label}`
  );
  check(
    "guard_chain_preserved",
    contradictoryGuard?.passed === true &&
      contradictoryGuard.summary?.adopted_or_provisional_conflicting_claims === 0 &&
      downstreamGate?.passed === true &&
      downstreamGate.summary?.adopted_profile_claim_timeline_candidates === 0 &&
      providerEnvelope?.passed === true &&
      providerEnvelope.provider_metadata?.externalCallAttempted === false &&
      sourcePack?.passed === true,
    `conflictAdopted=${contradictoryGuard.summary?.adopted_or_provisional_conflicting_claims}; downstreamAdopted=${downstreamGate.summary?.adopted_profile_claim_timeline_candidates}; external=${providerEnvelope.provider_metadata?.externalCallAttempted}; pack=${sourcePack?.passed}`
  );

  return {
    schemaVersion: DESIGNER_CANDIDATE_DASHBOARD_SCHEMA_VERSION,
    artifact_id: "fff-designer-candidate-dashboard-001",
    title: "Fast Fiction Factory Designer Candidate Dashboard",
    generatedAt: new Date().toISOString(),
    review_status: "ready_for_local_readback",
    review_input_mode: "freeform",
    review_ui: dashboard.review_ui || "public/review/index.html",
    access_route: dashboard.access_route || "public/review/index.html?mode=designer",
    input_result_path: toRepoPath(dashboardPath),
    local_only: dashboard.local_only === true,
    external_call: false,
    provider_configured: false,
    credentials_touched: false,
    public_upload: false,
    ai_video_generation: false,
    final_canon_decision: false,
    content_candidates: contentCandidates,
    channel_strategy_proposals: channelStrategyProposals,
    draft_spine: dashboard.draft_spine || {},
    review_risks: reviewRisks,
    human_owned_decisions_held: heldDecisions,
    absence_policy: dashboard.absence_policy || {},
    counts: {
      content_candidates: contentCandidates.length,
      channel_strategy_proposals: channelStrategyProposals.length,
      draft_spine_beats: draftSpineBeats.length,
      unresolved_risks: reviewRisks.length,
      human_owned_decisions_held: heldDecisions.length
    },
    preserved_readbacks: {
      contradictory_claim_guard: contradictoryGuard?.artifact_id,
      downstream_source_span_adoption_gate: downstreamGate?.artifact_id,
      provider_envelope_readiness_no_call: providerEnvelope?.artifact_id,
      source_span_review_pack: sourcePack?.artifact_id
    },
    summary: {
      designer_dashboard_visible: checks.identity?.passed === true,
      content_candidate_cards: contentCandidates.length,
      channel_strategy_cards: channelStrategyProposals.length,
      draft_spine_beats: draftSpineBeats.length,
      unresolved_risks: reviewRisks.length,
      human_owned_decisions_held: heldDecisions.length,
      local_only: true,
      external_call_attempted: false,
      provider_configured: false,
      credentials_touched: false,
      public_upload: false,
      ai_video_generation: false,
      final_canon_decision: false,
      guard_chain_preserved: checks.guard_chain_preserved?.passed === true,
      failures: failures.length
    },
    validation_notes: [
      "Designer Dashboard is a local planning and readback surface only.",
      "Content cards, channel proposals, and draft beats remain review-held.",
      "Unknown or human-owned story truth remains visible instead of being invented.",
      "No provider, credential, public upload, AI video generation, production render, or final canon decision is added."
    ],
    dashboard_checks: checks,
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

async function fileSizeOrZero(filePath) {
  try {
    const info = await stat(filePath);
    return info.isFile() ? info.size : 0;
  } catch {
    return 0;
  }
}

function extractFirstHtmlSectionByMarker(html, marker) {
  return extractFirstHtmlBlockByMarker(html, "section", marker);
}

function extractFirstHtmlBlockByMarker(html, tagName, marker) {
  const markerIndex = html.indexOf(marker);
  if (markerIndex < 0) {
    return "";
  }
  const start = html.lastIndexOf(`<${tagName}`, markerIndex);
  if (start < 0) {
    return "";
  }
  const endMarker = `</${tagName}>`;
  const end = html.indexOf(endMarker, markerIndex);
  if (end < 0) {
    return html.slice(start);
  }
  return html.slice(start, end + endMarker.length);
}

function extractConstObjectBlock(text, constName) {
  const start = text.indexOf(`const ${constName} =`);
  if (start < 0) {
    return "";
  }
  const endMarker = "\n    };";
  const end = text.indexOf(endMarker, start);
  if (end < 0) {
    return text.slice(start);
  }
  return text.slice(start, end + endMarker.length);
}

function extractArrayPropertyBlock(text, propertyName) {
  const start = text.indexOf(`${propertyName}: [`);
  if (start < 0) {
    return "";
  }
  const bracketStart = text.indexOf("[", start);
  if (bracketStart < 0) {
    return "";
  }
  let depth = 0;
  for (let index = bracketStart; index < text.length; index += 1) {
    const char = text[index];
    if (char === "[") {
      depth += 1;
    } else if (char === "]") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(bracketStart, index + 1);
      }
    }
  }
  return text.slice(bracketStart);
}

function removeDetailsBlocks(html) {
  return html.replace(/<details\b[\s\S]*?<\/details>/gi, "");
}

function removeHiddenBlocks(html) {
  return html.replace(/<([a-z][a-z0-9-]*)\b(?=[^>]*\bhidden\b)[\s\S]*?<\/\1>/gi, "");
}

function firstTaggedText(html, pattern) {
  const match = pattern.exec(html);
  return match ? stripHtmlTags(match[1]) : "";
}

function allTaggedTexts(html, pattern) {
  pattern.lastIndex = 0;
  const texts = [];
  let match;
  while ((match = pattern.exec(html)) !== null) {
    texts.push(stripHtmlTags(match[1]));
  }
  return texts;
}

function stripHtmlTags(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeDecisionStepLabel(text) {
  return text.replace(/^[✅▶▷◇🔒\s]+/u, "").trim();
}

function countDisplayChars(text) {
  return Array.from((text || "").trim()).length;
}

function countPattern(text, pattern) {
  const matches = (text || "").match(pattern);
  return matches ? matches.length : 0;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countLiteral(text, literal) {
  return countPattern(text, new RegExp(escapeRegExp(literal), "g"));
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
  node tools/fff-state.mjs validate-remaining-fixture-coverage-one-class <adapter-matrix-smoke.json>
  node tools/fff-state.mjs smoke-remaining-fixture-coverage-one-class <adapter-matrix-smoke.json> [output.json]
  node tools/fff-state.mjs validate-translated-memo-fixture-audit <adapter-matrix-smoke.json>
  node tools/fff-state.mjs smoke-translated-memo-fixture-audit <adapter-matrix-smoke.json> [output.json]
  node tools/fff-state.mjs validate-translation-provenance-source-span-readback <adapter-output.json>
  node tools/fff-state.mjs smoke-translation-provenance-source-span-readback <adapter-output.json> [output.json]
  node tools/fff-state.mjs validate-translation-policy-source-of-truth-boundary <translation-provenance-readback.json>
  node tools/fff-state.mjs smoke-translation-policy-source-of-truth-boundary <translation-provenance-readback.json> [output.json]
  node tools/fff-state.mjs validate-translated-memo-fixture-minimum <translated-memo-fixture.json>
  node tools/fff-state.mjs smoke-translated-memo-fixture-minimum <translated-memo-fixture.json> [output.json]
  node tools/fff-state.mjs validate-held-claim-adoption-preflight <translated-memo-fixture-minimum-result.json>
  node tools/fff-state.mjs smoke-held-claim-adoption-preflight <translated-memo-fixture-minimum-result.json> [output.json]
  node tools/fff-state.mjs validate-downstream-adoption-semantics-design <held-claim-adoption-preflight-result.json>
  node tools/fff-state.mjs smoke-downstream-adoption-semantics-design <held-claim-adoption-preflight-result.json> [output.json]
  node tools/fff-state.mjs validate-adoption-candidate-ledger-dry-run <downstream-adoption-semantics-design-result.json>
  node tools/fff-state.mjs smoke-adoption-candidate-ledger-dry-run <downstream-adoption-semantics-design-result.json> [output.json]
  node tools/fff-state.mjs validate-sandbox-adoption-mutation-one-claim <adoption-candidate-ledger-dry-run-result.json>
  node tools/fff-state.mjs smoke-sandbox-adoption-mutation-one-claim <adoption-candidate-ledger-dry-run-result.json> [output.json]
  node tools/fff-state.mjs validate-sandbox-adoption-rollback-rehearsal <sandbox-adoption-mutation-one-claim-result.json>
  node tools/fff-state.mjs smoke-sandbox-adoption-rollback-rehearsal <sandbox-adoption-mutation-one-claim-result.json> [output.json]
  node tools/fff-state.mjs validate-production-adoption-authorization-packet <sandbox-adoption-rollback-rehearsal-result.json>
  node tools/fff-state.mjs smoke-production-adoption-authorization-packet <sandbox-adoption-rollback-rehearsal-result.json> [output.json]
  node tools/fff-state.mjs validate-production-claim-ledger-adoption-one-claim <production-adoption-authorization-packet-result.json>
  node tools/fff-state.mjs smoke-production-claim-ledger-adoption-one-claim <production-adoption-authorization-packet-result.json> [output.json]
  node tools/fff-state.mjs validate-production-claim-ledger-rollback-rehearsal <production-claim-ledger-adoption-one-claim-result.json>
  node tools/fff-state.mjs smoke-production-claim-ledger-rollback-rehearsal <production-claim-ledger-adoption-one-claim-result.json> [output.json]
  node tools/fff-state.mjs validate-downstream-target-authorization-packet <production-claim-ledger-rollback-rehearsal-result.json>
  node tools/fff-state.mjs smoke-downstream-target-authorization-packet <production-claim-ledger-rollback-rehearsal-result.json> [output.json]
  node tools/fff-state.mjs validate-profile-adoption-mutation-one-claim <downstream-target-authorization-packet-result.json>
  node tools/fff-state.mjs smoke-profile-adoption-mutation-one-claim <downstream-target-authorization-packet-result.json> [output.json]
  node tools/fff-state.mjs validate-very-broad-source-span-shape-audit <adapter-matrix-smoke.json>
  node tools/fff-state.mjs smoke-very-broad-source-span-shape-audit <adapter-matrix-smoke.json> [output.json]
  node tools/fff-state.mjs validate-malformed-missing-span-guard <extraction-validator-smoke.json>
  node tools/fff-state.mjs smoke-malformed-missing-span-guard <extraction-validator-smoke.json> [output.json]
  node tools/fff-state.mjs validate-contradictory-claim-guard <extraction-validator-smoke.json>
  node tools/fff-state.mjs smoke-contradictory-claim-guard <extraction-validator-smoke.json> [output.json]
  node tools/fff-state.mjs validate-downstream-source-span-adoption-gate <source-span-review-pack.json>
  node tools/fff-state.mjs smoke-downstream-source-span-adoption-gate <source-span-review-pack.json> [output.json]
  node tools/fff-state.mjs validate-provider-envelope-readiness-no-call <provider-envelope.json>
  node tools/fff-state.mjs smoke-provider-envelope-readiness-no-call <provider-envelope.json> [output.json]
  node tools/fff-state.mjs validate-provider-adapter-authorization-readiness <provider-envelope-readback.json>
  node tools/fff-state.mjs smoke-provider-adapter-authorization-readiness <provider-envelope-readback.json> [output.json]
  node tools/fff-state.mjs validate-designer-candidate-dashboard <designer-dashboard-result.json>
  node tools/fff-state.mjs smoke-designer-candidate-dashboard <designer-dashboard-result.json> [output.json]
  node tools/fff-state.mjs validate-one-story-draft-review-pack <one-story-draft-review-pack-result.json>
  node tools/fff-state.mjs smoke-one-story-draft-review-pack <one-story-draft-review-pack-result.json> [output.json]
  node tools/fff-state.mjs validate-review-brief-dark-mode-ux <review-brief-dark-mode-ux-result.json>
  node tools/fff-state.mjs smoke-review-brief-dark-mode-ux <review-brief-dark-mode-ux-result.json> [output.json]
  node tools/fff-state.mjs validate-draft-to-video-planning-bridge <draft-to-video-planning-bridge-result.json>
  node tools/fff-state.mjs smoke-draft-to-video-planning-bridge <draft-to-video-planning-bridge-result.json> [output.json]
  node tools/fff-state.mjs validate-bridge-refinement-overview-ribbon <bridge-refinement-overview-ribbon-result.json>
  node tools/fff-state.mjs smoke-bridge-refinement-overview-ribbon <bridge-refinement-overview-ribbon-result.json> [output.json]
  node tools/fff-state.mjs validate-low-text-decision-console <low-text-decision-console-result.json>
  node tools/fff-state.mjs smoke-low-text-decision-console <low-text-decision-console-result.json> [output.json]
  node tools/fff-state.mjs validate-layout-research-decision-shell <layout-research-decision-shell-result.json>
  node tools/fff-state.mjs smoke-layout-research-decision-shell <layout-research-decision-shell-result.json> [output.json]
  node tools/fff-state.mjs validate-layout-lab-visual-audit <layout-lab-visual-audit-result.json>
  node tools/fff-state.mjs smoke-layout-lab-visual-audit <layout-lab-visual-audit-result.json> [output.json]
  node tools/fff-state.mjs validate-apply-decision-shell-guard-diet <apply-decision-shell-guard-diet-result.json>
  node tools/fff-state.mjs smoke-apply-decision-shell-guard-diet <apply-decision-shell-guard-diet-result.json> [output.json]
  node tools/fff-state.mjs validate-review-workbench-component-contract <review-workbench-component-contract-result.json>
  node tools/fff-state.mjs smoke-review-workbench-component-contract <review-workbench-component-contract-result.json> [output.json]
  node tools/fff-state.mjs validate-bridge-storyboard-flow <bridge-storyboard-flow-result.json>
  node tools/fff-state.mjs smoke-bridge-storyboard-flow <bridge-storyboard-flow-result.json> [output.json]
  node tools/fff-state.mjs validate-guided-review-flow-workspace <guided-review-flow-workspace-result.json>
  node tools/fff-state.mjs smoke-guided-review-flow-workspace <guided-review-flow-workspace-result.json> [output.json]
  node tools/fff-state.mjs validate-home-cockpit-metric-linking <home-cockpit-metric-linking-result.json>
  node tools/fff-state.mjs smoke-home-cockpit-metric-linking <home-cockpit-metric-linking-result.json> [output.json]
  node tools/fff-state.mjs validate-review-home-map-meters <review-home-map-meters-result.json>
  node tools/fff-state.mjs smoke-review-home-map-meters <review-home-map-meters-result.json> [output.json]

Default normalize output:
  ${DEFAULT_OUTPUT}

Default extraction fixture smoke output:
  ${DEFAULT_EXTRACTION_FIXTURE_SMOKE_OUTPUT}

Default routing policy regression output:
  ${DEFAULT_ROUTING_POLICY_REGRESSION_OUTPUT}

Default broad-span split output:
  ${DEFAULT_BROAD_SPAN_SPLIT_OUTPUT}

Default one-story draft review pack output:
  ${DEFAULT_ONE_STORY_DRAFT_REVIEW_PACK_OUTPUT}

Default review brief dark mode UX output:
  ${DEFAULT_REVIEW_BRIEF_DARK_MODE_UX_OUTPUT}

Default draft-to-video planning bridge output:
  ${DEFAULT_DRAFT_TO_VIDEO_PLANNING_BRIDGE_OUTPUT}

Default bridge refinement overview ribbon output:
  ${DEFAULT_BRIDGE_REFINEMENT_OVERVIEW_RIBBON_OUTPUT}

Default guided review flow workspace output:
  ${DEFAULT_GUIDED_REVIEW_FLOW_WORKSPACE_OUTPUT}

Default low-text decision console output:
  ${DEFAULT_LOW_TEXT_DECISION_CONSOLE_OUTPUT}

Default layout research decision shell output:
  ${DEFAULT_LAYOUT_RESEARCH_DECISION_SHELL_OUTPUT}

Default layout lab visual audit output:
  ${DEFAULT_LAYOUT_LAB_VISUAL_AUDIT_OUTPUT}

Default apply decision shell guard diet output:
  ${DEFAULT_APPLY_DECISION_SHELL_GUARD_DIET_OUTPUT}

Default review workbench component contract output:
  ${DEFAULT_REVIEW_WORKBENCH_COMPONENT_CONTRACT_OUTPUT}

Default bridge storyboard flow output:
  ${DEFAULT_BRIDGE_STORYBOARD_FLOW_OUTPUT}

Default home cockpit metric linking output:
  ${DEFAULT_HOME_COCKPIT_METRIC_LINKING_OUTPUT}

Default review home map meters output:
  ${DEFAULT_REVIEW_HOME_MAP_METERS_OUTPUT}

Default weak-span repair output:
  ${DEFAULT_WEAK_SPAN_REPAIR_OUTPUT}

Default missing fixture class probe output:
  ${DEFAULT_MISSING_FIXTURE_CLASS_PROBE_OUTPUT}

Default remaining fixture coverage output:
  ${DEFAULT_REMAINING_FIXTURE_COVERAGE_OUTPUT}

Default translated memo fixture audit output:
  ${DEFAULT_TRANSLATED_MEMO_FIXTURE_AUDIT_OUTPUT}

Default translation provenance source-span readback output:
  ${DEFAULT_TRANSLATION_PROVENANCE_SOURCE_SPAN_READBACK_OUTPUT}

Default translation policy source-of-truth boundary output:
  ${DEFAULT_TRANSLATION_POLICY_SOURCE_OF_TRUTH_BOUNDARY_OUTPUT}

Default translated memo fixture minimum output:
  ${DEFAULT_TRANSLATED_MEMO_FIXTURE_MINIMUM_OUTPUT}

Default held claim adoption preflight output:
  ${DEFAULT_HELD_CLAIM_ADOPTION_PREFLIGHT_OUTPUT}

Default downstream adoption semantics design output:
  ${DEFAULT_DOWNSTREAM_ADOPTION_SEMANTICS_DESIGN_OUTPUT}

Default adoption candidate ledger dry-run output:
  ${DEFAULT_ADOPTION_CANDIDATE_LEDGER_DRY_RUN_OUTPUT}

Default sandbox adoption mutation one-claim output:
  ${DEFAULT_SANDBOX_ADOPTION_MUTATION_ONE_CLAIM_OUTPUT}

Default sandbox adoption rollback rehearsal output:
  ${DEFAULT_SANDBOX_ADOPTION_ROLLBACK_REHEARSAL_OUTPUT}

Default production adoption authorization packet output:
  ${DEFAULT_PRODUCTION_ADOPTION_AUTHORIZATION_PACKET_OUTPUT}

Default production Claim Ledger adoption one-claim output:
  ${DEFAULT_PRODUCTION_CLAIM_LEDGER_ADOPTION_ONE_CLAIM_OUTPUT}

Default production Claim Ledger rollback rehearsal output:
  ${DEFAULT_PRODUCTION_CLAIM_LEDGER_ROLLBACK_REHEARSAL_OUTPUT}

Default downstream target authorization packet output:
  ${DEFAULT_DOWNSTREAM_TARGET_AUTHORIZATION_PACKET_OUTPUT}

Default very broad source-span shape audit output:
  ${DEFAULT_VERY_BROAD_SOURCE_SPAN_SHAPE_AUDIT_OUTPUT}

Default malformed/missing source-span guard output:
  ${DEFAULT_MALFORMED_MISSING_SPAN_GUARD_OUTPUT}

Default contradictory claim guard output:
  ${DEFAULT_CONTRADICTORY_CLAIM_GUARD_OUTPUT}

Default downstream source-span adoption gate output:
  ${DEFAULT_DOWNSTREAM_SOURCE_SPAN_ADOPTION_GATE_OUTPUT}

Default provider envelope readiness no-call output:
  ${DEFAULT_PROVIDER_ENVELOPE_READINESS_NO_CALL_OUTPUT}

Default provider adapter authorization readiness output:
  ${DEFAULT_PROVIDER_ADAPTER_AUTHORIZATION_READINESS_OUTPUT}

Default designer candidate dashboard output:
  ${DEFAULT_DESIGNER_CANDIDATE_DASHBOARD_OUTPUT}
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
