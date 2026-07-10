#!/usr/bin/env node

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

const ARTIFACT_ID = "fff-source-span-routing-review-pack-001";
const PRESERVED_MODEL_API_BOUNDARY_ARTIFACT_ID = "fff-model-api-boundary-spec-001";
const PRESERVED_EXPANSION_ARTIFACT_ID = "fff-local-extraction-adapter-expansion-001";
const PRESERVED_ADAPTER_ARTIFACT_ID = "fff-local-extraction-adapter-spike-001";
const PRESERVED_VALIDATOR_ARTIFACT_ID = "fff-extraction-validator-hardening-001";
const PRESERVED_CONTRACT_ARTIFACT_ID = "fff-extraction-contract-001";

const DEFAULT_FIXTURE_DIR = "artifacts/extraction-adapter-fixtures";
const DEFAULT_OUTPUT_DIR = "artifacts/extraction-adapter-outputs";
const DEFAULT_EXPANSION_SMOKE = "artifacts/local-extraction-adapter-expansion-smoke-result.json";
const DEFAULT_PACK_PATH = "artifacts/source-span-routing-review-pack.json";
const VALIDATOR_FIXTURE_DIR = "artifacts/extraction-negative-fixtures";
const HUMAN_OWNED_DEPENDENCIES = ["Toma fate", "brass moth truth", "Council motive"];

async function main() {
  if (["--help", "-h", "help"].includes(process.argv[2])) {
    console.log("Usage: node tools/fff-source-span-review-pack.mjs [fixture-dir] [output-dir] [expansion-smoke.json] [pack.json]");
    return;
  }

  const [
    fixtureDir = DEFAULT_FIXTURE_DIR,
    outputDir = DEFAULT_OUTPUT_DIR,
    smokePath = DEFAULT_EXPANSION_SMOKE,
    packPath = DEFAULT_PACK_PATH
  ] = process.argv.slice(2);

  const smoke = await readJson(smokePath);
  const outputFiles = (await readdir(outputDir))
    .filter((file) => file.toLowerCase().endsWith(".json"))
    .sort((a, b) => a.localeCompare(b));

  if (outputFiles.length === 0) {
    fail(`No extraction adapter outputs found in ${outputDir}`);
  }

  const fixtures = [];
  for (const file of outputFiles) {
    const outputPath = toRepoPath(path.join(outputDir, file));
    const payload = await readJson(outputPath);
    const sourceMemoPath = toRepoPath(payload.sourceMemoRef || path.join(fixtureDir, `${path.basename(file, ".json")}.md`));
    const rawMemo = normalizeSourceText(await readFile(sourceMemoPath, "utf8"));
    const validation = runNode(["tools/fff-state.mjs", "validate-extraction", outputPath]);
    const audit = auditPayload(rawMemo, payload);
    const elements = payload.extractedElements.map((element) => reviewElement(element, payload, sourceMemoPath, rawMemo));

    fixtures.push({
      fixture_id: path.basename(file, ".json"),
      memo_title: extractTitle(rawMemo),
      source_memo_path: sourceMemoPath,
      output_path: outputPath,
      extraction_run_id: payload.extractionRunId,
      counts: {
        extracted_elements: payload.extractedElements.length,
        profile_candidates: payload.profileCandidates.length,
        claim_candidates: payload.claimCandidates.length,
        timeline_candidates: payload.timelineEntryCandidates.length,
        visual_assets: payload.extractedElements.filter((element) => element.elementType === "visual_asset").length,
        human_owned_guarded_elements: elements.filter((element) => element.human_owned_guard !== "none").length
      },
      source_refs: payload.sourceRefs.map((sourceRef) => ({
        id: sourceRef.id,
        label: sourceRef.label || sourceRef.locator || sourceRef.id,
        locator: sourceRef.locator || "not set",
        trust: sourceRef.trust || "not set"
      })),
      validation: commandResult(validation),
      audit,
      review_safe_defaults: {
        default_review_status: payload.reviewSafeDefaults?.defaultReviewStatus || "not set",
        auto_canon_promotion: payload.reviewSafeDefaults?.autoCanonPromotion,
        auto_chronology_promotion: payload.reviewSafeDefaults?.autoChronologyPromotion,
        freeform_review_allowed: payload.decisionLogSafeMetadata?.freeformReviewAllowed === true
      },
      representative_elements: pickRepresentativeElements(elements),
      elements
    });
  }

  const summary = summarizePack(fixtures, smoke);
  const reviewDebt = buildReviewDebt(summary);
  const pack = {
    artifact_id: ARTIFACT_ID,
    title: "Fast Fiction Factory Source-Span Routing Review Pack",
    purpose: "Focused local review pack for checking source spans, source references, routing targets, held defaults, and human-owned guardrails across deterministic adapter fixture outputs before freeform review or any model/API behavior.",
    generatedAt: "2026-06-20T00:00:00+09:00",
    review_status: "ready_for_local_review",
    review_input_mode: "freeform",
    repo_relative_path: "public/review/index.html",
    open_command: "Invoke-Item .\\public\\review\\index.html",
    pack_path: toRepoPath(packPath),
    preserved_artifacts: [
      PRESERVED_MODEL_API_BOUNDARY_ARTIFACT_ID,
      PRESERVED_EXPANSION_ARTIFACT_ID,
      PRESERVED_ADAPTER_ARTIFACT_ID,
      PRESERVED_VALIDATOR_ARTIFACT_ID,
      PRESERVED_CONTRACT_ARTIFACT_ID
    ],
    source_inputs: {
      fixture_dir: toRepoPath(fixtureDir),
      output_dir: toRepoPath(outputDir),
      expansion_smoke: toRepoPath(smokePath),
      validator_fixture_dir: VALIDATOR_FIXTURE_DIR
    },
    cross_fixture_summary: summary,
    review_debt: reviewDebt,
    human_owned_boundaries: HUMAN_OWNED_DEPENDENCIES.map((dependency) => ({
      dependency,
      guard: "remain held until human author chooses a route"
    })),
    fixtures,
    next_human_review_prompt: "Review whether each representative source span is narrow enough, whether extracted values preserve the memo wording, whether routing targets are safe, and whether any fixture class is missing before freeform review moves to adapter changes.",
    passed: fixtures.every((fixture) => fixture.validation.ok && fixture.audit.passed) && summary.non_held_review_defaults === 0 && summary.human_owned_decision_adopt_suggestions === 0
  };

  await mkdir(path.dirname(packPath), { recursive: true });
  await writeFile(packPath, `${JSON.stringify(pack, null, 2)}\n`, "utf8");

  if (!pack.passed) {
    fail(`Source-span routing review pack failed: ${packPath}`);
  }

  console.log(`source-span routing review pack passed ${packPath}`);
}

function reviewElement(element, payload, sourceMemoPath, rawMemo) {
  const sourceSpan = element.sourceSpan || {};
  const matched = typeof sourceSpan.start === "number" &&
    typeof sourceSpan.end === "number" &&
    rawMemo.slice(sourceSpan.start, sourceSpan.end) === sourceSpan.text;

  return {
    id: element.id,
    element_type: element.elementType,
    extracted_value: element.displayText || element.title || element.id,
    raw_source_snippet: sourceSpan.text || "not set",
    source_span_locator: typeof sourceSpan.start === "number" && typeof sourceSpan.end === "number"
      ? `${sourceMemoPath}#char=${sourceSpan.start}-${sourceSpan.end}`
      : `${sourceMemoPath}#char=not-set`,
    source_ref_ids: element.sourceRefIds || [],
    source_span_matches_raw_memo: matched,
    routing_targets: routingTargets(element),
    confidence: element.confidence,
    suggested_review_status: element.suggestedReviewStatus || "hold",
    review_status: element.reviewStatus || "hold",
    human_owned_guard: humanOwnedGuard(element),
    risk_flags: riskFlags(element, payload, matched),
    review_notes: element.notes || "Review source span and routing before adoption."
  };
}

function routingTargets(element) {
  const targets = new Set();
  for (const destination of element.targetDestinations || []) {
    if (destination === "profile") targets.add("Profile");
    if (destination === "claim") targets.add("Claim");
    if (destination === "timeline") targets.add("Timeline");
    if (destination === "unresolved_decision") targets.add("Human Review");
    if (destination === "source_reference") targets.add("Source Reference");
  }
  if (element.elementType === "visual_asset") {
    targets.add("Visual");
  }
  return [...targets];
}

function humanOwnedGuard(element) {
  const dependencies = element.unresolvedDependencies || [];
  const touchesDependency = dependencies.some((dependency) => HUMAN_OWNED_DEPENDENCIES.includes(dependency));
  const routedToHumanReview = (element.targetDestinations || []).includes("unresolved_decision") || element.elementType === "unresolved_decision";
  if (touchesDependency || routedToHumanReview) {
    return "held_human_review_required";
  }
  return "none";
}

function riskFlags(element, payload, sourceSpanMatched) {
  const flags = [];
  const sourceRefIds = new Set((payload.sourceRefs || []).map((sourceRef) => sourceRef.id));
  if (!sourceSpanMatched) flags.push("source_span_mismatch");
  if (!Array.isArray(element.sourceRefIds) || element.sourceRefIds.length === 0 || element.sourceRefIds.some((sourceRefId) => !sourceRefIds.has(sourceRefId))) {
    flags.push("missing_or_unknown_source_ref");
  }
  if (element.elementType === "visual_asset" && (element.targetDestinations || []).includes("claim") && !(element.targetDestinations || []).includes("profile")) {
    flags.push("unsafe_visual_routing");
  }
  if ((element.reviewStatus || "hold") !== "hold" || (element.suggestedReviewStatus || "hold") !== "hold") {
    flags.push("non_held_default");
  }
  if (humanOwnedGuard(element) !== "none" && element.suggestedReviewStatus === "adopt") {
    flags.push("human_owned_adopt_suggestion");
  }
  if (element.canonRisk === "high") flags.push("high_canon_risk");
  if ((element.unresolvedDependencies || []).length > 0) flags.push("unresolved_dependency");
  if (element.elementType === "visual_asset") flags.push("visual_review_only");
  return flags.length ? flags : ["no_automated_issue"];
}

function auditPayload(rawMemo, payload) {
  const elements = payload.extractedElements || [];
  const sourceRefIds = new Set((payload.sourceRefs || []).map((sourceRef) => sourceRef.id));
  const sourceSpanMismatches = [];
  const missingSourceRefs = [];
  const unsafeVisualAssetRouting = [];
  const nonHeldReviewDefaults = [];
  const humanOwnedDecisionAdopts = [];

  for (const element of elements) {
    const { sourceSpan } = element;
    if (
      typeof sourceSpan?.start !== "number" ||
      typeof sourceSpan?.end !== "number" ||
      rawMemo.slice(sourceSpan.start, sourceSpan.end) !== sourceSpan.text
    ) {
      sourceSpanMismatches.push(element.id);
    }

    if (!Array.isArray(element.sourceRefIds) || element.sourceRefIds.length === 0 || element.sourceRefIds.some((sourceRefId) => !sourceRefIds.has(sourceRefId))) {
      missingSourceRefs.push(element.id);
    }

    if (element.elementType === "visual_asset" && element.targetDestinations.includes("claim") && !element.targetDestinations.includes("profile")) {
      unsafeVisualAssetRouting.push(element.id);
    }

    if (element.reviewStatus !== "hold" || element.suggestedReviewStatus !== "hold") {
      nonHeldReviewDefaults.push(element.id);
    }

    if (humanOwnedGuard(element) !== "none" && element.suggestedReviewStatus === "adopt") {
      humanOwnedDecisionAdopts.push(element.id);
    }
  }

  return {
    element_count: elements.length,
    source_span_matched_count: elements.length - sourceSpanMismatches.length,
    source_span_mismatch_count: sourceSpanMismatches.length,
    source_span_mismatches: sourceSpanMismatches,
    missing_source_ref_count: missingSourceRefs.length,
    missing_source_refs: missingSourceRefs,
    unsafe_visual_routing_count: unsafeVisualAssetRouting.length,
    unsafe_visual_routing: unsafeVisualAssetRouting,
    non_held_review_default_count: nonHeldReviewDefaults.length,
    non_held_review_defaults: nonHeldReviewDefaults,
    human_owned_decision_adopt_count: humanOwnedDecisionAdopts.length,
    human_owned_decision_adopts: humanOwnedDecisionAdopts,
    passed: sourceSpanMismatches.length === 0 &&
      missingSourceRefs.length === 0 &&
      unsafeVisualAssetRouting.length === 0 &&
      nonHeldReviewDefaults.length === 0 &&
      humanOwnedDecisionAdopts.length === 0
  };
}

function pickRepresentativeElements(elements) {
  const wanted = ["person", "object", "visual_asset", "placeholder", "unresolved_decision", "source_reference"];
  const picked = [];
  for (const type of wanted) {
    const match = elements.find((element) => element.element_type === type && !picked.some((candidate) => candidate.id === element.id));
    if (match) picked.push(match);
  }
  for (const element of elements) {
    if (picked.length >= 6) break;
    if (!picked.some((candidate) => candidate.id === element.id)) picked.push(element);
  }
  return picked;
}

function summarizePack(fixtures, smoke) {
  const audits = fixtures.map((fixture) => fixture.audit);
  const allElements = fixtures.flatMap((fixture) => fixture.elements);
  const smokeAggregate = smoke.aggregate || {};
  const fixtureIds = new Set(fixtures.map((fixture) => fixture.fixture_id));
  const fixtureClassGaps = [
    { label: "contradictory memo claims" },
    { label: "very broad source spans" },
    { label: "missing or malformed source span payloads" },
    { label: "multilingual memo text", coveredBy: "multilingual-memo-notes" },
    { label: "translated memo text" },
    { label: "sparse bullet-only notes", coveredBy: "sparse-bullet-notes" },
    { label: "model/API provider envelope output" }
  ]
    .filter((gap) => !gap.coveredBy || !fixtureIds.has(gap.coveredBy))
    .map((gap) => gap.label);

  return {
    fixture_count: fixtures.length,
    total_elements: allElements.length,
    profile_candidates: sum(fixtures, (fixture) => fixture.counts.profile_candidates),
    claim_candidates: sum(fixtures, (fixture) => fixture.counts.claim_candidates),
    timeline_candidates: sum(fixtures, (fixture) => fixture.counts.timeline_candidates),
    source_span_mismatches: sum(audits, (audit) => audit.source_span_mismatch_count),
    missing_source_refs: sum(audits, (audit) => audit.missing_source_ref_count),
    unsafe_visual_routing: sum(audits, (audit) => audit.unsafe_visual_routing_count),
    non_held_review_defaults: sum(audits, (audit) => audit.non_held_review_default_count),
    human_owned_decision_adopt_suggestions: sum(audits, (audit) => audit.human_owned_decision_adopt_count),
    human_owned_guarded_elements: allElements.filter((element) => element.human_owned_guard !== "none").length,
    visual_asset_elements: allElements.filter((element) => element.element_type === "visual_asset").length,
    review_held_elements: allElements.filter((element) => element.review_status === "hold" && element.suggested_review_status === "hold").length,
    fixture_class_gaps: fixtureClassGaps,
    smoke_crosscheck: {
      fixture_count: smokeAggregate.fixtureCount,
      output_count: smokeAggregate.outputCount,
      element_count: smokeAggregate.elementCount,
      profile_candidate_count: smokeAggregate.profileCandidateCount,
      claim_candidate_count: smokeAggregate.claimCandidateCount,
      timeline_candidate_count: smokeAggregate.timelineEntryCandidateCount
    }
  };
}

function buildReviewDebt(summary) {
  return [
    {
      category: "weak_span",
      automated_findings: summary.source_span_mismatches,
      review_state: summary.source_span_mismatches === 0 ? "needs_human_quality_review" : "must_fix"
    },
    {
      category: "over_broad_span",
      automated_findings: 0,
      review_state: "needs_human_quality_review"
    },
    {
      category: "vague_extraction",
      automated_findings: 0,
      review_state: "needs_human_quality_review"
    },
    {
      category: "routing_ambiguous",
      automated_findings: summary.unsafe_visual_routing,
      review_state: summary.unsafe_visual_routing === 0 ? "needs_human_quality_review" : "must_fix"
    },
    {
      category: "default_too_confident",
      automated_findings: summary.non_held_review_defaults + summary.human_owned_decision_adopt_suggestions,
      review_state: summary.non_held_review_defaults === 0 && summary.human_owned_decision_adopt_suggestions === 0 ? "clear_in_automated_audit" : "must_fix"
    },
    {
      category: "fixture_class_missing",
      automated_findings: summary.fixture_class_gaps.length,
      review_state: "intentional_next_fixture_candidates"
    }
  ];
}

function extractTitle(rawMemo) {
  const titleLine = rawMemo.split(/\r?\n/).find((line) => line.startsWith("# "));
  return titleLine ? titleLine.replace(/^#\s+/, "").trim() : "Untitled fixture memo";
}

function commandResult(result) {
  return {
    ok: result.status === 0,
    status: result.status,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim()
  };
}

function runNode(args) {
  return spawnSync(process.execPath, args, { encoding: "utf8" });
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function sum(items, callback) {
  return items.reduce((total, item) => total + callback(item), 0);
}

function toRepoPath(filePath) {
  const relativePath = path.isAbsolute(filePath) ? path.relative(process.cwd(), filePath) : filePath;
  return relativePath.split(path.sep).join("/");
}

function normalizeSourceText(text) {
  return String(text).replace(/\r\n?/g, "\n");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

main().catch((error) => {
  fail(error.stack || error.message);
});
