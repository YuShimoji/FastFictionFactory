import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const defaultStatePath = "artifacts/case-digest-production-state.json";
const exactPackageDir = "artifacts/private-raster-case-digest-ichiro-successor-20260813-001";
const exactPackage = {
  "private-raster-case-digest-ichiro-provisional.mp4": {
    bytes: 18300218,
    sha256: "1499cd6e753888e29db6cfc269db75cef312c049776ffe30b021dd13e5f2bc10"
  },
  "audio-sync-receipt.json": { sha256: "bc8a594992f8cbd354ee3ce8fb0e32bb33f5d4ca7ecf187175e36b6ee687d4c1" },
  "audio-waveform.jpg": { sha256: "684fe5e5651f84e616e53fea8963f163560fd2468de6c7114109c8d8c2e0e350" },
  "package-manifest.json": { sha256: "1c692ac41c6c6226fae2b290de73f325f0a81689860582639dea338ab8365586" },
  "README.md": { sha256: "3a1da6f4cab0f54b5d87c0f3aac62926645847287ab0fb148ff2c3baacbf699f" },
  "review.html": { sha256: "e1ccf25fb183c45d35417a92dfcfeb7efd0a1b6d4c975150f44288ffb7ee050e" }
};

function absolute(relativePath) {
  return resolve(repoRoot, relativePath);
}

function hashFile(relativePath) {
  return createHash("sha256").update(readFileSync(absolute(relativePath))).digest("hex");
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(absolute(relativePath), "utf8"));
}

function parseCsv(relativePath) {
  const lines = readFileSync(absolute(relativePath), "utf8").trim().split(/\r?\n/);
  const parseLine = (line) => {
    const values = [];
    let value = "";
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
      const character = line[index];
      if (character === '"') {
        if (quoted && line[index + 1] === '"') {
          value += '"';
          index += 1;
        } else {
          quoted = !quoted;
        }
      } else if (character === "," && !quoted) {
        values.push(value);
        value = "";
      } else {
        value += character;
      }
    }
    values.push(value);
    return values;
  };
  const headers = parseLine(lines.shift());
  return lines.map((line) => Object.fromEntries(parseLine(line).map((value, index) => [headers[index], value])));
}

function issue(issues, condition, code, detail = null) {
  if (!condition) issues.push({ code, detail });
}

function sorted(values) {
  return [...values].sort();
}

function sameMembers(left, right) {
  return JSON.stringify(sorted(left)) === JSON.stringify(sorted(right));
}

function normalizeSource(value) {
  return String(value).replaceAll(" ", "_");
}

function uniqueRelationshipEdges(profiles) {
  const edges = new Set();
  for (const profile of profiles) {
    for (const relatedId of profile.related_profile_ids || []) {
      edges.add([profile.id, relatedId].sort().join("|"));
    }
  }
  return sorted(edges);
}

function hashText(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function resolveJsonPointer(document, pointer) {
  if (pointer === "") return document;
  if (typeof pointer !== "string" || !pointer.startsWith("/")) return undefined;
  return pointer
    .slice(1)
    .split("/")
    .map((token) => token.replaceAll("~1", "/").replaceAll("~0", "~"))
    .reduce((value, token) => value?.[token], document);
}

const sharedLanes = new Set([
  "A_REPLACEABLE_ASSETS_AND_METADATA",
  "B_EVIDENCE_AND_REFERENCE",
  "C_AUTHORED_CONTENT_AND_STRUCTURE",
  "D_PRESENTATION_AND_REALIZATION",
  "E_INTEGRATION_EXPERIENCE_AND_RELEASE"
]);

const requirementOwners = new Set(["agent_owned", "human_owned", "external_evidence_owned"]);
const requirementStatuses = new Set(["SATISFIED", "UNSATISFIED", "BLOCKED_BY_DEPENDENCY", "N/A"]);

const requirementContracts = new Map([
  ["B.FACT_RECORDS", { order: 1, lane: "B_EVIDENCE_AND_REFERENCE", project_lane: "B_STORY_REFERENCE_MODEL", owner: "agent_owned", depends_on: [], evidence: "artifacts/current-project-state.json#/extractedCandidates/elements", authority_effect: "may_change=reference_fact_record_state;may_not_change=authored_selection_or_acceptance" }],
  ["B.FACT_SOURCE_STATUS", { order: 2, lane: "B_EVIDENCE_AND_REFERENCE", project_lane: "B_STORY_REFERENCE_MODEL", owner: "agent_owned", depends_on: ["B.FACT_RECORDS"], evidence: "artifacts/case-digest-production-state.json#/lanes/B_STORY_REFERENCE_MODEL/fact_table", authority_effect: "may_change=reference_source_classification;may_not_change=source_truth_or_authored_selection" }],
  ["B.LITERAL_FACT_SUPPORT_CONTRACTS", { order: 3, lane: "B_EVIDENCE_AND_REFERENCE", project_lane: "B_STORY_REFERENCE_MODEL", owner: "agent_owned", depends_on: ["B.FACT_RECORDS", "B.FACT_SOURCE_STATUS"], evidence: "artifacts/case-digest-literal-fact-support-registry.json#/fact_support_contracts", authority_effect: "may_change=fact_support_contract_coverage;may_not_change=fact_meaning_or_plot" }],
  ["B.LITERAL_AUTHOR_MEMO_LOCATORS", { order: 4, lane: "B_EVIDENCE_AND_REFERENCE", project_lane: "B_STORY_REFERENCE_MODEL", owner: "agent_owned", depends_on: ["B.LITERAL_FACT_SUPPORT_CONTRACTS"], evidence: "artifacts/case-digest-production-state.json#/lanes/B_STORY_REFERENCE_MODEL/fact_table", authority_effect: "may_change=literal_evidence_binding;may_not_change=fact_meaning_or_plot" }],
  ["B.LITERAL_LOCATOR_SPAN_AUDIT", { order: 5, lane: "B_EVIDENCE_AND_REFERENCE", project_lane: "B_STORY_REFERENCE_MODEL", owner: "agent_owned", depends_on: ["B.LITERAL_AUTHOR_MEMO_LOCATORS"], evidence: "artifacts/case-digest-production-state.json#/lanes/B_STORY_REFERENCE_MODEL/literal_locator_audit", authority_effect: "may_change=locator_audit_state;may_not_change=source_or_creative_authority" }],
  ["B.NONLITERAL_SOURCE_CLASSIFICATIONS", { order: 6, lane: "B_EVIDENCE_AND_REFERENCE", project_lane: "B_STORY_REFERENCE_MODEL", owner: "agent_owned", depends_on: ["B.FACT_RECORDS", "B.FACT_SOURCE_STATUS"], evidence: "artifacts/case-digest-production-state.json#/lanes/B_STORY_REFERENCE_MODEL/fact_table", authority_effect: "may_change=nonliteral_evidence_classification;may_not_change=fact_truth_or_plot" }],
  ["B.PROFILES", { order: 7, lane: "B_EVIDENCE_AND_REFERENCE", project_lane: "B_STORY_REFERENCE_MODEL", owner: "agent_owned", depends_on: ["B.FACT_RECORDS"], evidence: "artifacts/current-project-state.json#/extractedCandidates/profiles", authority_effect: "may_change=reference_profile_records;may_not_change=authored_selection" }],
  ["B.RELATIONSHIP_EDGES", { order: 8, lane: "B_EVIDENCE_AND_REFERENCE", project_lane: "B_STORY_REFERENCE_MODEL", owner: "agent_owned", depends_on: ["B.PROFILES"], evidence: "artifacts/case-digest-production-state.json#/lanes/B_STORY_REFERENCE_MODEL/relationship_edges", authority_effect: "may_change=reference_relationship_records;may_not_change=plot_or_ending" }],
  ["B.CLAIMS", { order: 9, lane: "B_EVIDENCE_AND_REFERENCE", project_lane: "B_STORY_REFERENCE_MODEL", owner: "agent_owned", depends_on: ["B.FACT_RECORDS"], evidence: "artifacts/current-project-state.json#/claimCandidates", authority_effect: "may_change=reference_claim_records;may_not_change=claim_acceptance_or_plot" }],
  ["B.EVENTS", { order: 10, lane: "B_EVIDENCE_AND_REFERENCE", project_lane: "B_STORY_REFERENCE_MODEL", owner: "agent_owned", depends_on: ["B.FACT_RECORDS"], evidence: "artifacts/current-project-state.json#/timelineCandidates", authority_effect: "may_change=reference_event_records;may_not_change=authored_order_or_ending" }],
  ["C.EXPLICIT_BEATS", { order: 11, lane: "C_AUTHORED_CONTENT_AND_STRUCTURE", project_lane: "C_AUTHORED_PLOT_SPINE", owner: "agent_owned", depends_on: ["B.FACT_RECORDS", "B.LITERAL_AUTHOR_MEMO_LOCATORS", "B.NONLITERAL_SOURCE_CLASSIFICATIONS"], evidence: "artifacts/case-digest-production-state.json#/lanes/C_AUTHORED_PLOT_SPINE/beats", authority_effect: "may_change=explicit_beat_record_coverage;may_not_change=production_selection_or_rights" }],
  ["C.ORDERED_BEATS", { order: 12, lane: "C_AUTHORED_CONTENT_AND_STRUCTURE", project_lane: "C_AUTHORED_PLOT_SPINE", owner: "agent_owned", depends_on: ["C.EXPLICIT_BEATS"], evidence: "artifacts/case-digest-production-state.json#/lanes/C_AUTHORED_PLOT_SPINE/beats", authority_effect: "may_change=authored_order_record;may_not_change=production_selection_or_presentation" }],
  ["C.TYPED_REFERENCE_ROLES", { order: 13, lane: "C_AUTHORED_CONTENT_AND_STRUCTURE", project_lane: "C_AUTHORED_PLOT_SPINE", owner: "agent_owned", depends_on: ["C.EXPLICIT_BEATS", "B.FACT_RECORDS", "B.PROFILES", "B.CLAIMS", "B.EVENTS"], evidence: "artifacts/case-digest-production-state.json#/lanes/C_AUTHORED_PLOT_SPINE/beats", authority_effect: "may_change=beat_reference_role_integrity;may_not_change=reference_truth_or_ending_selection" }],
  ["C.ENTRY_EXIT_FUNCTIONS", { order: 14, lane: "C_AUTHORED_CONTENT_AND_STRUCTURE", project_lane: "C_AUTHORED_PLOT_SPINE", owner: "agent_owned", depends_on: ["C.EXPLICIT_BEATS"], evidence: "artifacts/case-digest-production-state.json#/lanes/C_AUTHORED_PLOT_SPINE/beats", authority_effect: "may_change=beat_function_record_coverage;may_not_change=creative_acceptance" }],
  ["C.TARGET_DURATION_AND_WEIGHT", { order: 15, lane: "C_AUTHORED_CONTENT_AND_STRUCTURE", project_lane: "C_AUTHORED_PLOT_SPINE", owner: "agent_owned", depends_on: ["C.ORDERED_BEATS"], evidence: "artifacts/case-digest-production-state.json#/lanes/C_AUTHORED_PLOT_SPINE/beats", authority_effect: "may_change=authored_duration_weight_records;may_not_change=replaceable_asset_or_production_selection" }],
  ["C.PRODUCTION_SELECTED_BEATS", { order: 16, lane: "C_AUTHORED_CONTENT_AND_STRUCTURE", project_lane: "C_AUTHORED_PLOT_SPINE", owner: "human_owned", depends_on: ["C.ORDERED_BEATS", "C.TYPED_REFERENCE_ROLES", "C.ENTRY_EXIT_FUNCTIONS", "C.TARGET_DURATION_AND_WEIGHT"], evidence: "typed-absence:NO_EXPLICIT_PRODUCTION_BEAT_SELECTION", authority_effect: "may_change=production_selected_plot_spine;may_not_change=presentation_rights_voice_or_release" }],
  ["D.PRESENTATION_SEGMENTS", { order: 17, lane: "D_PRESENTATION_AND_REALIZATION", project_lane: "D_STORY_PRESENTATION", owner: "agent_owned", depends_on: ["C.EXPLICIT_BEATS"], evidence: "artifacts/case-digest-production-state.json#/lanes/D_STORY_PRESENTATION/segments", authority_effect: "may_change=provisional_spine_to_presentation_mapping;may_not_change=plot_selection_or_facts" }],
  ["D.SHOTS_MAPPED", { order: 18, lane: "D_PRESENTATION_AND_REALIZATION", project_lane: "D_STORY_PRESENTATION", owner: "agent_owned", depends_on: ["D.PRESENTATION_SEGMENTS"], evidence: "artifacts/private-raster-case-digest/selected-shot-sequence.csv", authority_effect: "may_change=shot_mapping_record_state;may_not_change=plot_or_rights" }],
  ["D.CAPTIONS_MAPPED", { order: 19, lane: "D_PRESENTATION_AND_REALIZATION", project_lane: "D_STORY_PRESENTATION", owner: "agent_owned", depends_on: ["D.SHOTS_MAPPED"], evidence: "artifacts/private-raster-case-digest/case-digest-review-captions.csv", authority_effect: "may_change=caption_mapping_record_state;may_not_change=plot_or_final_subtitle_acceptance" }],
  ["D.MOTION_RECORDS", { order: 20, lane: "D_PRESENTATION_AND_REALIZATION", project_lane: "D_STORY_PRESENTATION", owner: "agent_owned", depends_on: ["D.SHOTS_MAPPED"], evidence: "artifacts/private-raster-case-digest/selected-shot-sequence.csv", authority_effect: "may_change=motion_record_coverage;may_not_change=major_visual_method_or_acceptance" }],
  ["D.TRANSITION_RECORDS", { order: 21, lane: "D_PRESENTATION_AND_REALIZATION", project_lane: "D_STORY_PRESENTATION", owner: "agent_owned", depends_on: ["D.SHOTS_MAPPED"], evidence: "artifacts/private-raster-case-digest/selected-shot-sequence.csv", authority_effect: "may_change=transition_record_coverage;may_not_change=editorial_winner_or_acceptance" }],
  ["D.ALLOWED_PRIMARY_IMAGERY_KINDS", { order: 22, lane: "D_PRESENTATION_AND_REALIZATION", project_lane: "D_STORY_PRESENTATION", owner: "agent_owned", depends_on: ["D.SHOTS_MAPPED"], evidence: "artifacts/primary-imagery-quarantine/primary-imagery-quarantine.json", authority_effect: "may_change=quarantine_compatibility_record;may_not_change=imagery_selection_or_rights" }],
  ["D.SOURCE_KIND_INVENTORY_RECORDS", { order: 23, lane: "B_EVIDENCE_AND_REFERENCE", project_lane: "D_STORY_PRESENTATION", owner: "agent_owned", depends_on: ["D.SHOTS_MAPPED"], evidence: "artifacts/case-digest-presentation-provenance-rights-inventory.json#/records", authority_effect: "may_change=presentation_source_kind_classification;may_not_change=imagery_selection_or_rights" }],
  ["D.TECHNICAL_USABILITY_INVENTORY_RECORDS", { order: 24, lane: "E_INTEGRATION_EXPERIENCE_AND_RELEASE", project_lane: "D_STORY_PRESENTATION", owner: "agent_owned", depends_on: ["D.SOURCE_KIND_INVENTORY_RECORDS"], evidence: "artifacts/case-digest-presentation-provenance-rights-inventory.json#/records", authority_effect: "may_change=technical_usability_classification;may_not_change=creative_or_rights_acceptance" }],
  ["D.OWNER_ACCEPTANCE_INVENTORY_RECORDS", { order: 25, lane: "B_EVIDENCE_AND_REFERENCE", project_lane: "D_STORY_PRESENTATION", owner: "agent_owned", depends_on: ["D.SOURCE_KIND_INVENTORY_RECORDS"], evidence: "artifacts/case-digest-presentation-provenance-rights-inventory.json#/records", authority_effect: "may_change=historical_owner_acceptance_classification;may_not_change=production_or_rights_acceptance" }],
  ["D.PROVENANCE_STATUS_INVENTORY_RECORDS", { order: 26, lane: "B_EVIDENCE_AND_REFERENCE", project_lane: "D_STORY_PRESENTATION", owner: "agent_owned", depends_on: ["D.SOURCE_KIND_INVENTORY_RECORDS"], evidence: "artifacts/case-digest-presentation-provenance-rights-inventory.json#/records", authority_effect: "may_change=presentation_provenance_classification;may_not_change=rights_clearance" }],
  ["D.RIGHTS_STATUS_INVENTORY_RECORDS", { order: 27, lane: "E_INTEGRATION_EXPERIENCE_AND_RELEASE", project_lane: "D_STORY_PRESENTATION", owner: "agent_owned", depends_on: ["D.PROVENANCE_STATUS_INVENTORY_RECORDS"], evidence: "artifacts/case-digest-presentation-provenance-rights-inventory.json#/records", authority_effect: "may_change=rights_evidence_status_classification;may_not_change=rights_clearance_or_release" }],
  ["D.SCREEN_EFFECT_BEAT_RECORDS", { order: 28, lane: "D_PRESENTATION_AND_REALIZATION", project_lane: "D_STORY_PRESENTATION", owner: "human_owned", depends_on: ["C.PRODUCTION_SELECTED_BEATS", "D.PRESENTATION_SEGMENTS"], evidence: "typed-absence:NO_EXPLICIT_SCREEN_EFFECT_BEAT_RECORDS", authority_effect: "may_change=screen_effect_beat_plan;may_not_change=plot_facts_rights_or_release" }],
  ["D.RIGHTS_CLEARED_PRIMARY_CHOICES", { order: 29, lane: "E_INTEGRATION_EXPERIENCE_AND_RELEASE", project_lane: "D_STORY_PRESENTATION", owner: "external_evidence_owned", depends_on: ["C.PRODUCTION_SELECTED_BEATS", "D.ALLOWED_PRIMARY_IMAGERY_KINDS", "D.RIGHTS_STATUS_INVENTORY_RECORDS"], evidence: "typed-absence:NO_BOUND_LICENSE_TERMS_OR_RIGHTS_CLEARANCE", authority_effect: "may_change=rights_cleared_primary_choice_count;may_not_change=creative_production_or_publication_approval" }],
  ["A.EXACT_MEDIA_AVAILABLE", { order: 30, lane: "A_REPLACEABLE_ASSETS_AND_METADATA", project_lane: "A_REPLACEABLE_ASSETS_AND_METADATA", owner: "agent_owned", depends_on: [], evidence: "artifacts/private-raster-case-digest-ichiro-successor-20260813-001/private-raster-case-digest-ichiro-provisional.mp4#sha256=1499cd6e753888e29db6cfc269db75cef312c049776ffe30b021dd13e5f2bc10", authority_effect: "may_change=exact_media_availability_state;may_not_change=content_or_acceptance" }],
  ["A.DURATION_ENVELOPE_SATISFIED", { order: 31, lane: "A_REPLACEABLE_ASSETS_AND_METADATA", project_lane: "A_REPLACEABLE_ASSETS_AND_METADATA", owner: "agent_owned", depends_on: [], evidence: "artifacts/case-digest-production-state.json#/lanes/A_REPLACEABLE_ASSETS_AND_METADATA/duration_envelope", authority_effect: "may_change=working_duration_compatibility;may_not_change=story_or_final_duration_acceptance" }],
  ["A.AUDIO_CUE_WINDOWS", { order: 32, lane: "A_REPLACEABLE_ASSETS_AND_METADATA", project_lane: "A_REPLACEABLE_ASSETS_AND_METADATA", owner: "agent_owned", depends_on: ["A.DURATION_ENVELOPE_SATISFIED"], evidence: "artifacts/private-raster-case-digest-ichiro-successor-20260813-001/audio-sync-receipt.json#/cues", authority_effect: "may_change=development_audio_cue_compatibility;may_not_change=final_voice_or_content" }],
  ["A.CURRENT_ASSEMBLY_ADOPTED", { order: 33, lane: "E_INTEGRATION_EXPERIENCE_AND_RELEASE", project_lane: "E_INTEGRATION_CHECK", owner: "human_owned", depends_on: ["C.PRODUCTION_SELECTED_BEATS", "D.ALLOWED_PRIMARY_IMAGERY_KINDS", "D.SCREEN_EFFECT_BEAT_RECORDS", "A.EXACT_MEDIA_AVAILABLE", "A.DURATION_ENVELOPE_SATISFIED", "A.AUDIO_CUE_WINDOWS"], evidence: "typed-absence:NO_EXPLICIT_CURRENT_ASSEMBLY_ADOPTION", authority_effect: "may_change=current_provisional_assembly_adoption;may_not_change=rights_production_or_publication_approval" }],
  ["INTEGRATED_REVIEW.CURRENT_ACCEPTANCE", { order: 34, lane: "E_INTEGRATION_EXPERIENCE_AND_RELEASE", project_lane: "E_INTEGRATION_CHECK", owner: "human_owned", depends_on: ["A.CURRENT_ASSEMBLY_ADOPTED"], evidence: "typed-absence:NO_CURRENT_INTEGRATED_REVIEW_ACCEPTANCE", authority_effect: "may_change=integrated_experience_acceptance;may_not_change=creative_winner_rights_or_release" }],
  ["FINAL.SOURCE_SELECTED", { order: 35, lane: "C_AUTHORED_CONTENT_AND_STRUCTURE", project_lane: "C_AUTHORED_PLOT_SPINE", owner: "human_owned", depends_on: [], evidence: "typed-absence:NO_EXPLICIT_CURRENT_SOURCE_SELECTION", authority_effect: "may_change=source_selection;may_not_change=canon_topic_rights_or_release" }],
  ["FINAL.CANON_SELECTED", { order: 36, lane: "C_AUTHORED_CONTENT_AND_STRUCTURE", project_lane: "C_AUTHORED_PLOT_SPINE", owner: "human_owned", depends_on: ["FINAL.SOURCE_SELECTED"], evidence: "typed-absence:NO_EXPLICIT_CURRENT_CANON_SELECTION", authority_effect: "may_change=canon_selection;may_not_change=topic_presentation_rights_or_release" }],
  ["FINAL.TOPIC_SELECTED", { order: 37, lane: "C_AUTHORED_CONTENT_AND_STRUCTURE", project_lane: "C_AUTHORED_PLOT_SPINE", owner: "human_owned", depends_on: ["FINAL.CANON_SELECTED"], evidence: "typed-absence:NO_EXPLICIT_CURRENT_TOPIC_SELECTION", authority_effect: "may_change=topic_selection;may_not_change=presentation_rights_or_release" }],
  ["FINAL.VOICE_SELECTED", { order: 38, lane: "D_PRESENTATION_AND_REALIZATION", project_lane: "A_REPLACEABLE_ASSETS_AND_METADATA", owner: "human_owned", depends_on: ["A.AUDIO_CUE_WINDOWS"], evidence: "typed-absence:NO_EXPLICIT_FINAL_VOICE_SELECTION", authority_effect: "may_change=final_voice_selection;may_not_change=source_canon_rights_or_publication" }],
  ["FINAL.MAJOR_VISUAL_AND_EDITORIAL_SELECTED", { order: 39, lane: "D_PRESENTATION_AND_REALIZATION", project_lane: "D_STORY_PRESENTATION", owner: "human_owned", depends_on: ["C.PRODUCTION_SELECTED_BEATS", "D.PRESENTATION_SEGMENTS"], evidence: "typed-absence:NO_EXPLICIT_MAJOR_VISUAL_OR_EDITORIAL_SELECTION", authority_effect: "may_change=major_visual_method_and_editorial_winner;may_not_change=facts_rights_or_release" }],
  ["FINAL.RIGHTS_APPROVED", { order: 40, lane: "E_INTEGRATION_EXPERIENCE_AND_RELEASE", project_lane: "E_INTEGRATION_CHECK", owner: "human_owned", depends_on: ["D.RIGHTS_CLEARED_PRIMARY_CHOICES"], evidence: "typed-absence:NO_EXPLICIT_RIGHTS_APPROVAL", authority_effect: "may_change=rights_approval;may_not_change=creative_production_or_publication_approval" }],
  ["FINAL.PRODUCTION_APPROVED", { order: 41, lane: "E_INTEGRATION_EXPERIENCE_AND_RELEASE", project_lane: "E_INTEGRATION_CHECK", owner: "human_owned", depends_on: ["INTEGRATED_REVIEW.CURRENT_ACCEPTANCE", "FINAL.VOICE_SELECTED", "FINAL.MAJOR_VISUAL_AND_EDITORIAL_SELECTED", "FINAL.RIGHTS_APPROVED"], evidence: "typed-absence:NO_EXPLICIT_PRODUCTION_APPROVAL", authority_effect: "may_change=production_approval;may_not_change=publication_approval" }],
  ["FINAL.PUBLICATION_APPROVED", { order: 42, lane: "E_INTEGRATION_EXPERIENCE_AND_RELEASE", project_lane: "E_INTEGRATION_CHECK", owner: "human_owned", depends_on: ["FINAL.PRODUCTION_APPROVED"], evidence: "typed-absence:NO_EXPLICIT_PUBLICATION_APPROVAL", authority_effect: "may_change=publication_approval;may_not_change=source_canon_or_creative_history" }]
]);

function vector(requirementId, observed, required, unit) {
  const contract = requirementContracts.get(requirementId);
  if (!contract) throw new Error(`Missing requirement contract: ${requirementId}`);
  return {
    requirement_id: requirementId,
    order: contract.order,
    lane: contract.lane,
    project_lane: contract.project_lane,
    unit,
    required,
    observed,
    owner: contract.owner,
    depends_on: [...contract.depends_on],
    evidence: contract.evidence,
    authority_effect: contract.authority_effect,
    status: null,
    na_reason: null,
    na_dependency_effect: null
  };
}

function finalizeRequirementStatuses(stages) {
  const requirements = stages.flatMap((stage) => stage.requirement_vectors);
  const byId = new Map(requirements.map((entry) => [entry.requirement_id, entry]));
  const visiting = new Set();
  function resolveStatus(entry) {
    if (entry.status) return entry.status;
    if (visiting.has(entry.requirement_id)) throw new Error(`Requirement dependency cycle: ${entry.requirement_id}`);
    visiting.add(entry.requirement_id);
    const dependenciesSatisfied = entry.depends_on.every((dependencyId) => {
      const dependency = byId.get(dependencyId);
      return dependency && ["SATISFIED", "N/A"].includes(resolveStatus(dependency));
    });
    entry.status = dependenciesSatisfied
      ? (entry.observed >= entry.required ? "SATISFIED" : "UNSATISFIED")
      : "BLOCKED_BY_DEPENDENCY";
    visiting.delete(entry.requirement_id);
    return entry.status;
  }
  requirements.forEach(resolveStatus);
  return stages;
}

function firstFailedRequirement(stages) {
  return stages
    .flatMap((stage) => stage.requirement_vectors)
    .filter((entry) => entry.status === "UNSATISFIED")
    .sort((left, right) => left.order - right.order)[0]?.requirement_id || null;
}

function firstBlockedRequirement(stage) {
  return [...stage.requirement_vectors]
    .filter((entry) => entry.status === "BLOCKED_BY_DEPENDENCY")
    .sort((left, right) => left.order - right.order)[0]?.requirement_id || null;
}

function stageStatus(stage) {
  if (stage.requirement_vectors.some((entry) => entry.status === "UNSATISFIED")) return "UNSATISFIED";
  if (stage.requirement_vectors.some((entry) => entry.status === "BLOCKED_BY_DEPENDENCY")) return "BLOCKED_BY_DEPENDENCY";
  if (stage.requirement_vectors.every((entry) => entry.status === "N/A")) return "N/A";
  return "SATISFIED";
}

function requirementOwner(requirementVector) {
  return requirementVector?.owner || null;
}

function verifyCoverageVectors(issues, prefix, recorded, expected, interpretation) {
  issue(issues, recorded?.interpretation === interpretation, prefix + "_COVERAGE_INTERPRETATION", recorded?.interpretation);
  for (const [name, expectedVector] of Object.entries(expected)) {
    const observedVector = recorded?.[name];
    issue(issues, Boolean(observedVector), prefix + "_COVERAGE_VECTOR_MISSING_" + name, null);
    if (observedVector) {
      issue(issues, observedVector.observed === expectedVector.observed, prefix + "_COVERAGE_OBSERVED_" + name, { expected: expectedVector.observed, observed: observedVector.observed });
      issue(issues, observedVector.required === expectedVector.required, prefix + "_COVERAGE_REQUIRED_" + name, { expected: expectedVector.required, observed: observedVector.required });
      issue(issues, observedVector.unit === expectedVector.unit, prefix + "_COVERAGE_UNIT_" + name, { expected: expectedVector.unit, observed: observedVector.unit });
    }
  }
}

function verify(statePathArgument, inventoryPathArgument) {
  const stateAbsolute = statePathArgument
    ? (isAbsolute(statePathArgument) ? statePathArgument : absolute(statePathArgument))
    : absolute(defaultStatePath);
  const state = JSON.parse(readFileSync(stateAbsolute, "utf8"));
  const projectState = readJson("artifacts/current-project-state.json");
  const captions = parseCsv("artifacts/private-raster-case-digest/case-digest-review-captions.csv");
  const subtitles = parseCsv("artifacts/private-raster-case-digest/case-digest-production-subtitles-draft.csv");
  const shots = parseCsv("artifacts/private-raster-case-digest/selected-shot-sequence.csv");
  const presentationModel = readJson("artifacts/private-raster-case-digest/private-raster-case-digest.json");
  const imageLineage = parseCsv("artifacts/private-full-raster-candidate/image-lineage.csv");
  const generatedOriginalRecords = readJson("artifacts/private-full-raster-candidate/generation-attempts-source.json");
  const anchorGenerationRecords = parseCsv("artifacts/high-fidelity-raster-pilot/source-provenance.csv");
  const quarantine = readJson("artifacts/primary-imagery-quarantine/primary-imagery-quarantine.json");
  const acceptance = readJson("artifacts/nondensou-voice-convergence-20260813-001/development-timing-voice-acceptance.json");
  const syncReceipt = readJson(exactPackageDir + "/audio-sync-receipt.json");
  const issues = [];

  const presentationInventoryBinding = state.source_bindings?.find((binding) => binding.role === "presentation_provenance_rights_inventory");
  const inventoryAbsolute = inventoryPathArgument
    ? (isAbsolute(inventoryPathArgument) ? inventoryPathArgument : absolute(inventoryPathArgument))
    : absolute(presentationInventoryBinding?.path || "artifacts/case-digest-presentation-provenance-rights-inventory.json");
  let presentationInventory = null;
  try {
    presentationInventory = JSON.parse(readFileSync(inventoryAbsolute, "utf8"));
  } catch (error) {
    issue(issues, false, "D_PRESENTATION_INVENTORY_JSON", error.message);
  }

  issue(issues, state.schema_version === "fff.caseDigestProductionState.v2", "STATE_SCHEMA", state.schema_version);
  issue(issues, state.authority?.owner === "docs/production-lanes.md", "AUTHORITY_OWNER", state.authority?.owner);
  issue(issues, state.authority?.progress_rule === "computed_from_explicit_records_and_metrics_only", "PROGRESS_RULE", state.authority?.progress_rule);
  issue(issues, state.authority?.declared_axis_counts_as_progress === false, "DECLARED_AXIS_PROGRESS_LEAK", state.authority?.declared_axis_counts_as_progress);
  issue(issues, state.authority?.review_question_count_counts_as_progress === false, "REVIEW_QUESTION_PROGRESS_LEAK", state.authority?.review_question_count_counts_as_progress);
  issue(issues, state.authority?.prose_labels_count_as_authority === false, "PROSE_LABEL_AUTHORITY_LEAK", state.authority?.prose_labels_count_as_authority);
  issue(issues, state.authority?.coverage_vectors_are_structural_not_quality_or_creative_progress === true, "COVERAGE_VECTOR_INTERPRETATION", state.authority?.coverage_vectors_are_structural_not_quality_or_creative_progress);
  const sharedAlignment = state.authority?.shared_control_alignment;
  issue(issues, sharedAlignment?.model_id === "content-production-lanes/v1", "SHARED_MODEL_ID", sharedAlignment);
  issue(issues, sharedAlignment?.portable_coordinator_locator === "docs/content-production-lanes-v1.md", "SHARED_MODEL_LOCATOR", sharedAlignment);
  issue(issues, sharedAlignment?.sha256 === "ba2042aea1e0c9fd07718ecb0dc3d26f119114db60ee6e7d374a6d8ee8df2968", "SHARED_MODEL_HASH", sharedAlignment);
  issue(issues, sharedAlignment?.alignment_scope === "CONTROL_ONLY", "SHARED_MODEL_SCOPE", sharedAlignment);
  issue(issues, sharedAlignment?.project_authority_owner === "docs/production-lanes.md", "SHARED_PROJECT_AUTHORITY_OWNER", sharedAlignment);
  issue(issues, sharedAlignment?.project_authority_replaced === false, "SHARED_PROJECT_AUTHORITY_REPLACED", sharedAlignment);
  issue(issues, sharedAlignment?.array_or_file_order_authoritative === false, "SHARED_ARRAY_ORDER_AUTHORITY", sharedAlignment);
  issue(issues, sharedAlignment?.first_failed_rule === "lowest_unique_integer_order_unsatisfied_with_satisfied_dependencies", "SHARED_FIRST_FAILED_RULE", sharedAlignment);
  issue(issues, sharedAlignment?.na_requires_reason_and_dependency_effect === true, "SHARED_NA_POLICY", sharedAlignment);
  issue(issues, sharedAlignment?.missing_gate_may_be_na === false, "SHARED_MISSING_GATE_NA_LEAK", sharedAlignment);
  issue(issues, state.authority?.legacy_content_process_surface?.state === "PARKED_PRESENTATION_EVIDENCE", "LEGACY_SURFACE_NOT_PARKED", state.authority?.legacy_content_process_surface);
  issue(issues, state.authority?.legacy_content_process_surface?.current_project_gate === false, "LEGACY_SURFACE_CURRENT_GATE", state.authority?.legacy_content_process_surface);
  issue(issues, state.authority?.legacy_content_process_surface?.current_human_action === false, "LEGACY_SURFACE_HUMAN_ACTION", state.authority?.legacy_content_process_surface);

  issue(issues, state.identity?.content_lane === "NON_DENSOU_CASE_DIGEST", "CONTENT_LANE", state.identity?.content_lane);
  issue(issues, state.identity?.densou_identity === "OUT_OF_LANE", "DENSOU_IDENTITY_LEAK", state.identity?.densou_identity);
  issue(issues, state.identity?.densou_may_satisfy_dependencies === false, "DENSOU_DEPENDENCY_LEAK", state.identity?.densou_may_satisfy_dependencies);
  issue(issues, state.identity?.development_media_sha256 === exactPackage["private-raster-case-digest-ichiro-provisional.mp4"].sha256, "MEDIA_IDENTITY", state.identity?.development_media_sha256);

  for (const binding of state.source_bindings || []) {
    issue(issues, existsSync(absolute(binding.path)), "SOURCE_BINDING_MISSING_" + binding.role, binding.path);
    if (existsSync(absolute(binding.path))) {
      issue(issues, hashFile(binding.path) === binding.sha256, "SOURCE_BINDING_HASH_" + binding.role, hashFile(binding.path));
    }
  }

  for (const [fileName, expected] of Object.entries(exactPackage)) {
    const relativePath = exactPackageDir + "/" + fileName;
    issue(issues, existsSync(absolute(relativePath)), "EXACT_PACKAGE_MISSING_" + fileName, relativePath);
    if (existsSync(absolute(relativePath))) {
      issue(issues, hashFile(relativePath) === expected.sha256, "EXACT_PACKAGE_HASH_" + fileName, hashFile(relativePath));
      if (expected.bytes !== undefined) {
        issue(issues, statSync(absolute(relativePath)).size === expected.bytes, "EXACT_PACKAGE_BYTES_" + fileName, statSync(absolute(relativePath)).size);
      }
    }
  }

  const dag = state.dependency_dag;
  const requiredNodes = [
    "A_REPLACEABLE_ASSETS_AND_METADATA",
    "B_STORY_REFERENCE_MODEL",
    "C_AUTHORED_PLOT_SPINE",
    "D_STORY_PRESENTATION",
    "E_INTEGRATION_CHECK"
  ];
  issue(issues, sameMembers(dag?.nodes || [], requiredNodes), "DAG_NODES", dag?.nodes);
  const actualEdgeKeys = new Set((dag?.edges || []).map((edge) => edge.from + "->" + edge.to));
  for (const forbidden of dag?.forbidden_edges || []) {
    issue(issues, !actualEdgeKeys.has(forbidden), "DAG_FORBIDDEN_EDGE_" + forbidden, forbidden);
  }
  issue(issues, !actualEdgeKeys.has("A_REPLACEABLE_ASSETS_AND_METADATA->B_STORY_REFERENCE_MODEL"), "REPLACEABLE_TO_REFERENCE_EDGE", null);
  issue(issues, !actualEdgeKeys.has("A_REPLACEABLE_ASSETS_AND_METADATA->C_AUTHORED_PLOT_SPINE"), "REPLACEABLE_TO_PLOT_EDGE", null);

  const laneA = state.lanes?.A_REPLACEABLE_ASSETS_AND_METADATA;
  issue(issues, laneA?.may_block_story_reference === false, "A_BLOCKS_REFERENCE", laneA?.may_block_story_reference);
  issue(issues, laneA?.may_block_plot_when_envelope_satisfied === false, "A_BLOCKS_PLOT", laneA?.may_block_plot_when_envelope_satisfied);
  issue(issues, laneA?.may_block_presentation_when_envelope_satisfied === false, "A_BLOCKS_PRESENTATION", laneA?.may_block_presentation_when_envelope_satisfied);
  issue(issues, laneA?.may_overwrite_plot_or_presentation_authority === false, "A_AUTHORITY_OVERWRITE", laneA?.may_overwrite_plot_or_presentation_authority);
  issue(issues, laneA?.duration_envelope?.minimum_seconds <= 180 && laneA?.duration_envelope?.maximum_seconds >= 180, "A_DURATION_ENVELOPE", laneA?.duration_envelope);
  issue(issues, laneA?.duration_envelope?.whole_video_uniform_retime_allowed === true, "A_RETIME_NOT_ALLOWED", laneA?.duration_envelope);
  issue(issues, laneA?.duration_envelope?.retime_requires_story_reauthoring === false, "A_RETIME_REAUTHORS_STORY", laneA?.duration_envelope);
  issue(issues, acceptance.scope === "DEVELOPMENT_TIMING_VOICE_ONLY", "A_VOICE_SCOPE", acceptance.scope);
  issue(issues, acceptance.binding?.media_sha256 === state.identity?.development_media_sha256, "A_VOICE_MEDIA_BINDING", acceptance.binding?.media_sha256);
  issue(issues, syncReceipt.cues?.length === 11, "A_AUDIO_CUE_COUNT", syncReceipt.cues?.length);
  issue(issues, syncReceipt.cues?.every((cue) => cue.within_accepted_caption_window === true), "A_AUDIO_WINDOW_COVERAGE", null);
  issue(issues, syncReceipt.cues?.every((cue) => cue.processed_signal_audit?.objective_noise_gate_pass === true), "A_AUDIO_OBJECTIVE_GATE", null);
  issue(issues, syncReceipt.cues?.reduce((sum, cue) => sum + cue.processed_signal_audit.clipped_sample_count, 0) === 0, "A_AUDIO_CLIPPING", null);
  issue(issues, syncReceipt.media?.full_av_decode === "PASS", "A_AV_DECODE", syncReceipt.media?.full_av_decode);
  issue(issues, syncReceipt.media?.exact_parent_video_essence_match === true, "A_PICTURE_ESSENCE", null);
  issue(issues, syncReceipt.media?.exact_parent_subtitle_text_timing_match === true, "A_SUBTITLE_BINDING", null);
  issue(issues, subtitles.length === 11 && subtitles.every((row) => row.selected_for_production === "false"), "A_SUBTITLE_PRODUCTION_SELECTION", subtitles.map((row) => row.selected_for_production));
  issue(issues, subtitles.every((row) => row.voice_calibrated === "false"), "A_SUBTITLE_VOICE_CALIBRATION", subtitles.map((row) => row.voice_calibrated));

  const laneB = state.lanes?.B_STORY_REFERENCE_MODEL;
  for (const key of ["auto_create_plot_beats", "auto_reorder_plot_beats", "auto_accept_plot_beats", "auto_reject_plot_beats", "auto_choose_ending"]) {
    issue(issues, laneB?.[key] === false, "B_PLOT_AUTHORITY_" + key, laneB?.[key]);
  }
  const sourceFacts = projectState.extractedCandidates.elements.flatMap((category) =>
    category.items.map((item) => ({ ...item, category: category.category }))
  );
  const locatorContract = laneB?.source_locator_contract;
  const literalSourceStatus = locatorContract?.literal_source_status;
  const literalLocatorClass = locatorContract?.literal_locator_class;
  const allowedNonliteralClasses = new Set(locatorContract?.nonliteral_locator_classes || []);
  const literalFactIds = sourceFacts
    .filter((fact) => normalizeSource(fact.source) === literalSourceStatus)
    .map((fact) => fact.id);
  const supportRule = "quote_contains_all_required_anchors_exact_case";
  const supportRegistryIssueCountBefore = issues.length;
  issue(issues, literalSourceStatus === "author_memo", "B_LITERAL_SOURCE_STATUS_CONTRACT", literalSourceStatus);
  issue(issues, literalLocatorClass === "literal_author_memo_span", "B_LITERAL_LOCATOR_CLASS_CONTRACT", literalLocatorClass);
  issue(issues, locatorContract?.source_binding_role === "project_state", "B_LITERAL_BINDING_ROLE_CONTRACT", locatorContract?.source_binding_role);
  issue(issues, locatorContract?.json_pointer === "/rawMemo", "B_LITERAL_JSON_POINTER_CONTRACT", locatorContract?.json_pointer);
  issue(issues, locatorContract?.offset_unit === "utf16_code_unit", "B_LITERAL_OFFSET_UNIT_CONTRACT", locatorContract?.offset_unit);
  issue(issues, locatorContract?.quote_hash_algorithm === "sha256_utf8", "B_LITERAL_HASH_CONTRACT", locatorContract?.quote_hash_algorithm);
  issue(issues, locatorContract?.support_registry_role === "literal_fact_support_registry", "B_LITERAL_SUPPORT_REGISTRY_ROLE_CONTRACT", locatorContract?.support_registry_role);
  issue(issues, locatorContract?.support_registry_schema === "fff.caseDigestLiteralFactSupportRegistry.v1", "B_LITERAL_SUPPORT_REGISTRY_SCHEMA_CONTRACT", locatorContract?.support_registry_schema);
  issue(issues, locatorContract?.support_rule === supportRule, "B_LITERAL_SUPPORT_RULE_CONTRACT", locatorContract?.support_rule);
  const literalSourceBinding = state.source_bindings?.find((binding) => binding.role === locatorContract?.source_binding_role);
  issue(issues, literalSourceBinding?.path === "artifacts/current-project-state.json", "B_LITERAL_SOURCE_BINDING_PATH", literalSourceBinding);
  const supportRegistryBinding = state.source_bindings?.find((binding) => binding.role === locatorContract?.support_registry_role);
  issue(issues, supportRegistryBinding?.path === "artifacts/case-digest-literal-fact-support-registry.json", "B_LITERAL_SUPPORT_REGISTRY_BINDING_PATH", supportRegistryBinding);
  let supportRegistry = null;
  if (supportRegistryBinding?.path && existsSync(absolute(supportRegistryBinding.path))) {
    try {
      supportRegistry = readJson(supportRegistryBinding.path);
    } catch (error) {
      issue(issues, false, "B_LITERAL_SUPPORT_REGISTRY_JSON", error.message);
    }
  }
  issue(issues, supportRegistry?.schema_version === locatorContract?.support_registry_schema, "B_LITERAL_SUPPORT_REGISTRY_SCHEMA", supportRegistry?.schema_version);
  issue(issues, supportRegistry?.registry_id === "fff-nondensou-case-digest-literal-fact-support-v1", "B_LITERAL_SUPPORT_REGISTRY_ID", supportRegistry?.registry_id);
  issue(issues, supportRegistry?.source_contract?.source_binding_role === locatorContract?.source_binding_role, "B_LITERAL_SUPPORT_SOURCE_ROLE", supportRegistry?.source_contract?.source_binding_role);
  issue(issues, supportRegistry?.source_contract?.source_path === literalSourceBinding?.path, "B_LITERAL_SUPPORT_SOURCE_PATH", supportRegistry?.source_contract?.source_path);
  issue(issues, supportRegistry?.source_contract?.source_sha256 === literalSourceBinding?.sha256, "B_LITERAL_SUPPORT_SOURCE_HASH", supportRegistry?.source_contract?.source_sha256);
  issue(issues, supportRegistry?.source_contract?.json_pointer === locatorContract?.json_pointer, "B_LITERAL_SUPPORT_JSON_POINTER", supportRegistry?.source_contract?.json_pointer);
  const rawMemo = resolveJsonPointer(projectState, locatorContract?.json_pointer);
  const rawMemoHash = typeof rawMemo === "string" ? hashText(rawMemo) : null;
  issue(issues, supportRegistry?.source_contract?.raw_memo_sha256_utf8 === rawMemoHash, "B_LITERAL_SUPPORT_RAW_MEMO_HASH", supportRegistry?.source_contract?.raw_memo_sha256_utf8);
  issue(issues, supportRegistry?.source_contract?.raw_memo_utf16_code_units === rawMemo?.length, "B_LITERAL_SUPPORT_RAW_MEMO_LENGTH", supportRegistry?.source_contract?.raw_memo_utf16_code_units);
  issue(issues, supportRegistry?.source_contract?.support_rule === supportRule, "B_LITERAL_SUPPORT_REGISTRY_RULE", supportRegistry?.source_contract?.support_rule);
  issue(issues, supportRegistry?.source_contract?.candidate_locator_may_define_expected_support === false, "B_LITERAL_SUPPORT_CANDIDATE_AUTHORITY", supportRegistry?.source_contract?.candidate_locator_may_define_expected_support);
  issue(issues, supportRegistry?.source_contract?.runtime_title_derivation_allowed === false, "B_LITERAL_SUPPORT_TITLE_DERIVATION", supportRegistry?.source_contract?.runtime_title_derivation_allowed);
  issue(issues, supportRegistry?.source_contract?.fuzzy_matching_allowed === false, "B_LITERAL_SUPPORT_FUZZY_MATCH", supportRegistry?.source_contract?.fuzzy_matching_allowed);
  issue(issues, supportRegistry?.source_contract?.llm_judgment_allowed === false, "B_LITERAL_SUPPORT_LLM_JUDGMENT", supportRegistry?.source_contract?.llm_judgment_allowed);

  const supportContractsByFact = new Map();
  for (const contract of supportRegistry?.fact_support_contracts || []) {
    const contractIsRecord = contract !== null && typeof contract === "object" && !Array.isArray(contract);
    issue(issues, contractIsRecord, "B_LITERAL_SUPPORT_CONTRACT_RECORD", contract);
    if (!contractIsRecord) continue;
    const factIdValid = typeof contract.fact_id === "string" && literalFactIds.includes(contract.fact_id);
    issue(issues, factIdValid, "B_LITERAL_SUPPORT_CONTRACT_FACT_ID", contract.fact_id);
    issue(issues, !supportContractsByFact.has(contract.fact_id), "B_LITERAL_SUPPORT_CONTRACT_DUPLICATE_" + contract.fact_id, contract.fact_id);
    issue(issues, contract.support_rule === supportRule, "B_LITERAL_SUPPORT_CONTRACT_RULE_" + contract.fact_id, contract.support_rule);
    const anchorsValid = Array.isArray(contract.required_anchors)
      && contract.required_anchors.length > 0
      && contract.required_anchors.every((anchor) => typeof anchor === "string" && anchor.length > 0)
      && new Set(contract.required_anchors).size === contract.required_anchors.length;
    issue(issues, anchorsValid, "B_LITERAL_SUPPORT_ANCHORS_" + contract.fact_id, contract.required_anchors);
    if (anchorsValid) {
      issue(issues, contract.required_anchors.every((anchor) => rawMemo.includes(anchor)), "B_LITERAL_SUPPORT_ANCHOR_NOT_IN_SOURCE_" + contract.fact_id, contract.required_anchors);
    }
    if (!supportContractsByFact.has(contract.fact_id)) supportContractsByFact.set(contract.fact_id, contract);
  }
  issue(issues, sameMembers([...supportContractsByFact.keys()], literalFactIds), "B_LITERAL_SUPPORT_CONTRACT_COVERAGE", {
    expected: literalFactIds,
    observed: [...supportContractsByFact.keys()]
  });
  issue(issues, supportRegistry?.authority_boundaries?.registry_supplies_evidence_binding_only === true, "B_LITERAL_SUPPORT_EVIDENCE_ONLY", supportRegistry?.authority_boundaries);
  issue(issues, supportRegistry?.authority_boundaries?.registry_may_select_or_reject_plot === false, "B_LITERAL_SUPPORT_PLOT_AUTHORITY", supportRegistry?.authority_boundaries);
  issue(issues, supportRegistry?.authority_boundaries?.registry_may_choose_ending === false, "B_LITERAL_SUPPORT_ENDING_AUTHORITY", supportRegistry?.authority_boundaries);
  issue(issues, supportRegistry?.authority_boundaries?.missing_or_unsafe_binding_counts_as_literal_locator === false, "B_LITERAL_SUPPORT_UNSAFE_COUNT", supportRegistry?.authority_boundaries);
  issue(issues, supportRegistry?.authority_boundaries?.nonliteral_classifications_remain_separate === true, "B_LITERAL_SUPPORT_NONLITERAL_SEPARATION", supportRegistry?.authority_boundaries);
  const supportRegistryValid = issues.length === supportRegistryIssueCountBefore;
  const validSupportContractCount = supportRegistryValid ? supportContractsByFact.size : 0;
  issue(issues, laneB?.fact_table?.length === sourceFacts.length, "B_FACT_COUNT", laneB?.fact_table?.length);
  let validLiteralLocatorCount = 0;
  const validLiteralLocators = [];
  let validNonliteralClassificationCount = 0;
  const validNonliteralByClass = new Map([...allowedNonliteralClasses].map((locatorClass) => [locatorClass, 0]));
  for (const fact of sourceFacts) {
    const observed = laneB?.fact_table?.find((entry) => entry.id === fact.id);
    issue(issues, Boolean(observed), "B_FACT_MISSING_" + fact.id, null);
    if (observed) {
      issue(issues, observed.category === fact.category, "B_FACT_CATEGORY_" + fact.id, observed.category);
      issue(issues, observed.title === fact.title, "B_FACT_TITLE_" + fact.id, observed.title);
      issue(issues, observed.source_status === normalizeSource(fact.source), "B_FACT_SOURCE_" + fact.id, observed.source_status);
      issue(issues, observed.review_status === fact.review_status, "B_FACT_STATUS_" + fact.id, observed.review_status);
      issue(issues, typeof observed.current_case_digest_usage === "string", "B_FACT_USAGE_" + fact.id, observed.current_case_digest_usage);

      const expectedSourceStatus = normalizeSource(fact.source);
      const locator = observed.source_locator;
      if (expectedSourceStatus === literalSourceStatus) {
        if (locator !== null && locator !== undefined) {
          const issueCountBefore = issues.length;
          const locatorIsRecord = typeof locator === "object" && !Array.isArray(locator);
          issue(issues, locatorIsRecord, "B_LITERAL_LOCATOR_RECORD_TYPE_" + fact.id, locator);
          if (locatorIsRecord) {
            issue(issues, locator.locator_class === literalLocatorClass, "B_LITERAL_LOCATOR_CLASS_" + fact.id, locator.locator_class);
            issue(issues, locator.source_binding_role === locatorContract.source_binding_role, "B_LITERAL_BINDING_ROLE_" + fact.id, locator.source_binding_role);
            issue(issues, locator.json_pointer === locatorContract.json_pointer, "B_LITERAL_JSON_POINTER_" + fact.id, locator.json_pointer);
            issue(issues, locator.offset_range?.unit === locatorContract.offset_unit, "B_LITERAL_OFFSET_UNIT_" + fact.id, locator.offset_range);

            const start = locator.offset_range?.start;
            const end = locator.offset_range?.end;
            const locatorSource = resolveJsonPointer(projectState, locator.json_pointer);
            const offsetsValid = Number.isInteger(start) && Number.isInteger(end) && start >= 0 && end > start && typeof locatorSource === "string" && end <= locatorSource.length;
            issue(issues, offsetsValid, "B_LITERAL_OFFSET_RANGE_" + fact.id, locator.offset_range);
            issue(issues, typeof locator.exact_quote === "string" && locator.exact_quote.length > 0, "B_LITERAL_EXACT_QUOTE_" + fact.id, locator.exact_quote);
            if (offsetsValid && typeof locator.exact_quote === "string") {
              issue(issues, locatorSource.slice(start, end) === locator.exact_quote, "B_LITERAL_QUOTE_SLICE_" + fact.id, {
                expected: locatorSource.slice(start, end),
                observed: locator.exact_quote
              });
            }
            issue(issues, typeof locator.quote_sha256 === "string" && /^[0-9a-f]{64}$/.test(locator.quote_sha256), "B_LITERAL_QUOTE_HASH_FORMAT_" + fact.id, locator.quote_sha256);
            if (typeof locator.exact_quote === "string" && typeof locator.quote_sha256 === "string") {
              issue(issues, hashText(locator.exact_quote) === locator.quote_sha256, "B_LITERAL_QUOTE_HASH_" + fact.id, locator.quote_sha256);
            }
            const supportContract = supportContractsByFact.get(fact.id);
            issue(issues, Boolean(supportContract), "B_LITERAL_SUPPORT_CONTRACT_MISSING_" + fact.id, fact.id);
            if (supportContract && typeof locator.exact_quote === "string") {
              const missingAnchors = supportContract.required_anchors.filter((anchor) => !locator.exact_quote.includes(anchor));
              issue(issues, missingAnchors.length === 0, "B_LITERAL_WRONG_FACT_SUPPORT_" + fact.id, {
                fact_id: fact.id,
                support_rule: supportContract.support_rule,
                missing_required_anchors: missingAnchors,
                observed_quote_sha256: hashText(locator.exact_quote)
              });
            }
          }
          if (supportRegistryValid && issues.length === issueCountBefore) {
            validLiteralLocatorCount += 1;
            validLiteralLocators.push({ fact_id: fact.id, locator });
          }
        }
      } else {
        const issueCountBefore = issues.length;
        const locatorIsRecord = typeof locator === "object" && locator !== null && !Array.isArray(locator);
        issue(issues, locatorIsRecord, "B_NONLITERAL_CLASSIFICATION_RECORD_" + fact.id, locator);
        if (locatorIsRecord) {
          issue(issues, allowedNonliteralClasses.has(locator.locator_class), "B_NONLITERAL_CLASS_NOT_ALLOWED_" + fact.id, locator.locator_class);
          issue(issues, locator.locator_class === expectedSourceStatus, "B_NONLITERAL_CLASS_SOURCE_MISMATCH_" + fact.id, locator.locator_class);
          issue(issues, locator.classification_basis === "current_project_state_source_status", "B_NONLITERAL_CLASSIFICATION_BASIS_" + fact.id, locator.classification_basis);
          const literalFields = ["source_binding_role", "json_pointer", "offset_range", "exact_quote", "quote_sha256"];
          issue(issues, literalFields.every((key) => locator[key] === undefined || locator[key] === null), "B_NONLITERAL_MASQUERADES_AS_LITERAL_" + fact.id, locator);
        }
        if (issues.length === issueCountBefore) {
          validNonliteralClassificationCount += 1;
          validNonliteralByClass.set(expectedSourceStatus, (validNonliteralByClass.get(expectedSourceStatus) || 0) + 1);
        }
      }
    }
  }
  const locatorAuditIssueCountBefore = issues.length;
  const locatorAudit = laneB?.literal_locator_audit;
  const locatorAuditSchema = "fff.caseDigestLiteralLocatorAudit.v1";
  const locatorAuditSelectionRule = "smallest_natural_contiguous_rawMemo_span_containing_all_required_anchors";
  const overbroadThreshold = locatorAudit?.overbroad_threshold_utf16_code_units;
  issue(issues, locatorAudit?.schema_version === locatorAuditSchema, "B_LITERAL_LOCATOR_AUDIT_SCHEMA", locatorAudit?.schema_version);
  issue(issues, locatorAudit?.selection_rule === locatorAuditSelectionRule, "B_LITERAL_LOCATOR_AUDIT_SELECTION_RULE", locatorAudit?.selection_rule);
  issue(issues, Number.isInteger(overbroadThreshold) && overbroadThreshold > 0, "B_LITERAL_LOCATOR_AUDIT_OVERBROAD_THRESHOLD", overbroadThreshold);
  issue(issues, locatorAudit?.whole_raw_memo_spans_allowed === false, "B_LITERAL_LOCATOR_AUDIT_WHOLE_MEMO_POLICY", locatorAudit?.whole_raw_memo_spans_allowed);
  issue(issues, locatorAudit?.duplicate_exact_spans_allowed_only_when_explicitly_audited === true, "B_LITERAL_LOCATOR_AUDIT_DUPLICATE_POLICY", locatorAudit?.duplicate_exact_spans_allowed_only_when_explicitly_audited);

  const spanGroups = new Map();
  for (const entry of validLiteralLocators) {
    const locator = entry.locator;
    const spanKey = locator.json_pointer + "#" + locator.offset_range.start + ":" + locator.offset_range.end + "@" + locator.quote_sha256;
    if (!spanGroups.has(spanKey)) spanGroups.set(spanKey, []);
    spanGroups.get(spanKey).push(entry.fact_id);
  }
  const computedSharedSpanGroups = [...spanGroups.entries()]
    .filter(([, factIds]) => factIds.length > 1)
    .map(([spanKey, factIds]) => ({ span_key: spanKey, fact_ids: sorted(factIds) }))
    .sort((left, right) => left.span_key.localeCompare(right.span_key));
  const recordedSharedSpanGroups = (locatorAudit?.shared_span_groups || [])
    .map((group) => ({ span_key: group.span_key, fact_ids: sorted(group.fact_ids || []) }))
    .sort((left, right) => String(left.span_key).localeCompare(String(right.span_key)));
  for (const group of locatorAudit?.shared_span_groups || []) {
    issue(issues, group.reason_code === "DISTINCT_FACT_CONTRACTS_SHARE_EXACT_SUPPORTING_SPAN", "B_LITERAL_SHARED_SPAN_REASON_" + group.span_key, group);
    issue(issues, Array.isArray(group.fact_ids) && group.fact_ids.length > 1 && group.fact_ids.every((factId) => literalFactIds.includes(factId)), "B_LITERAL_SHARED_SPAN_FACTS_" + group.span_key, group);
  }
  issue(issues, JSON.stringify(recordedSharedSpanGroups) === JSON.stringify(computedSharedSpanGroups), "B_LITERAL_DUPLICATE_SPAN_AUDIT_MISMATCH", {
    expected: computedSharedSpanGroups,
    observed: recordedSharedSpanGroups
  });

  const wholeRawMemoSpans = validLiteralLocators.filter((entry) =>
    entry.locator.json_pointer === locatorContract?.json_pointer
    && entry.locator.offset_range.start === 0
    && entry.locator.offset_range.end === rawMemo.length
  );
  const computedOverbroadSpans = validLiteralLocators
    .filter((entry) => Number.isInteger(overbroadThreshold) && entry.locator.exact_quote.length > overbroadThreshold)
    .map((entry) => ({ fact_id: entry.fact_id, span_utf16_code_units: entry.locator.exact_quote.length }))
    .sort((left, right) => left.fact_id.localeCompare(right.fact_id));
  const recordedOverbroadSpans = (locatorAudit?.overbroad_span_records || [])
    .map((entry) => ({ fact_id: entry.fact_id, span_utf16_code_units: entry.span_utf16_code_units }))
    .sort((left, right) => String(left.fact_id).localeCompare(String(right.fact_id)));
  for (const record of locatorAudit?.overbroad_span_records || []) {
    issue(issues, record.reason_code === "ACCEPTED_MULTI_ANCHOR_CONTRACT_SPANS_SEPARATE_SOURCE_SECTIONS", "B_LITERAL_OVERBROAD_REASON_" + record.fact_id, record);
    issue(issues, record.authority_effect === "evidence_binding_only", "B_LITERAL_OVERBROAD_AUTHORITY_" + record.fact_id, record);
  }
  issue(issues, JSON.stringify(recordedOverbroadSpans) === JSON.stringify(computedOverbroadSpans), "B_LITERAL_OVERBROAD_SPAN_AUDIT_MISMATCH", {
    expected: computedOverbroadSpans,
    observed: recordedOverbroadSpans
  });
  issue(issues, wholeRawMemoSpans.length === 0, "B_LITERAL_WHOLE_MEMO_SPAN_FORBIDDEN", wholeRawMemoSpans.map((entry) => entry.fact_id));
  issue(issues, locatorAudit?.materialized_locator_count === validLiteralLocatorCount, "B_LITERAL_LOCATOR_AUDIT_MATERIALIZED_COUNT", {
    expected: validLiteralLocatorCount,
    observed: locatorAudit?.materialized_locator_count
  });
  issue(issues, locatorAudit?.unique_exact_span_count === spanGroups.size, "B_LITERAL_LOCATOR_AUDIT_UNIQUE_COUNT", {
    expected: spanGroups.size,
    observed: locatorAudit?.unique_exact_span_count
  });
  issue(issues, locatorAudit?.whole_raw_memo_span_count === wholeRawMemoSpans.length, "B_LITERAL_LOCATOR_AUDIT_WHOLE_MEMO_COUNT", {
    expected: wholeRawMemoSpans.length,
    observed: locatorAudit?.whole_raw_memo_span_count
  });
  const literalLocatorAuditValid = issues.length === locatorAuditIssueCountBefore;
  const auditedLiteralLocatorCount = literalLocatorAuditValid ? validLiteralLocatorCount : 0;
  const sourceProfiles = projectState.extractedCandidates.profiles;
  issue(issues, laneB?.profiles?.length === sourceProfiles.length, "B_PROFILE_COUNT", laneB?.profiles?.length);
  for (const profile of sourceProfiles) {
    const observed = laneB?.profiles?.find((entry) => entry.id === profile.id);
    issue(issues, Boolean(observed), "B_PROFILE_MISSING_" + profile.id, null);
    if (observed) {
      issue(issues, observed.type === profile.profile_type, "B_PROFILE_TYPE_" + profile.id, observed.type);
      issue(issues, observed.review_status === profile.review_status, "B_PROFILE_STATUS_" + profile.id, observed.review_status);
      issue(issues, sameMembers(observed.related_ids || [], profile.related_profile_ids || []), "B_PROFILE_RELATIONS_" + profile.id, observed.related_ids);
      issue(issues, JSON.stringify(observed.open_questions || []) === JSON.stringify(profile.open_questions || []), "B_PROFILE_QUESTIONS_" + profile.id, observed.open_questions);
      issue(issues, sameMembers(observed.unresolved_dependencies || [], profile.unresolved_dependencies || []), "B_PROFILE_UNRESOLVED_" + profile.id, observed.unresolved_dependencies);
    }
  }
  const expectedEdges = uniqueRelationshipEdges(sourceProfiles);
  issue(issues, sameMembers(laneB?.relationship_edges || [], expectedEdges), "B_RELATIONSHIP_EDGES", laneB?.relationship_edges);
  const sourceClaims = projectState.extractedCandidates.claims;
  issue(issues, laneB?.claims?.length === sourceClaims.length, "B_CLAIM_COUNT", laneB?.claims?.length);
  for (const claim of sourceClaims) {
    const observed = laneB?.claims?.find((entry) => entry.id === claim.id);
    issue(issues, Boolean(observed), "B_CLAIM_MISSING_" + claim.id, null);
    if (observed) {
      issue(issues, observed.truth_status === claim.worldTruthStatus, "B_CLAIM_TRUTH_" + claim.id, observed.truth_status);
      issue(issues, observed.review_status === claim.review_status, "B_CLAIM_STATUS_" + claim.id, observed.review_status);
      issue(issues, sameMembers(observed.source_ref_ids || [], (claim.sourceRefs || []).map((ref) => ref.id)), "B_CLAIM_SOURCES_" + claim.id, observed.source_ref_ids);
      issue(issues, sameMembers(observed.contradicts || [], claim.contradictsClaimIds || []), "B_CLAIM_CONTRADICTIONS_" + claim.id, observed.contradicts);
    }
  }
  const sourceEvents = projectState.extractedCandidates.timelineCandidates;
  issue(issues, laneB?.events?.length === sourceEvents.length, "B_EVENT_COUNT", laneB?.events?.length);
  for (const event of sourceEvents) {
    const observed = laneB?.events?.find((entry) => entry.id === event.id);
    issue(issues, Boolean(observed), "B_EVENT_MISSING_" + event.id, null);
    if (observed) {
      issue(issues, observed.axis === event.sequence_scope, "B_EVENT_AXIS_" + event.id, observed.axis);
      issue(issues, observed.review_status === event.review_status, "B_EVENT_STATUS_" + event.id, observed.review_status);
      issue(issues, sameMembers(observed.source_ref_ids || [], (event.sourceRefs || []).map((ref) => ref.id)), "B_EVENT_SOURCES_" + event.id, observed.source_ref_ids);
      issue(issues, sameMembers(observed.unresolved_dependencies || [], event.unresolvedDependencies || []), "B_EVENT_UNRESOLVED_" + event.id, observed.unresolved_dependencies);
    }
  }
  issue(issues, laneB?.contradictions_and_unsupported_claims?.length >= 4, "B_CONTRADICTION_REPRESENTATION", laneB?.contradictions_and_unsupported_claims?.length);

  const laneC = state.lanes?.C_AUTHORED_PLOT_SPINE;
  issue(issues, laneC?.generated_from_reference_coverage === false, "C_GENERATED_FROM_REFERENCE", laneC?.generated_from_reference_coverage);
  issue(issues, laneC?.reference_model_may_force_beat_coverage === false, "C_REFERENCE_FORCES_BEATS", laneC?.reference_model_may_force_beat_coverage);
  const beats = laneC?.beats || [];
  issue(issues, beats.length === 5, "C_BEAT_COUNT", beats.length);
  const referenceRecords = new Map([
    ...(laneB?.fact_table || []).map((entry) => [entry.id, { ...entry, record_kind: "fact" }]),
    ...(laneB?.profiles || []).map((entry) => [entry.id, { ...entry, record_kind: "profile" }]),
    ...(laneB?.claims || []).map((entry) => [entry.id, { ...entry, record_kind: "claim" }]),
    ...(laneB?.events || []).map((entry) => [entry.id, { ...entry, record_kind: "event" }])
  ]);
  const candidateEndingRefs = new Set(
    (laneB?.contradictions_and_unsupported_claims || [])
      .filter((entry) => entry.kind === "candidate_ending_only")
      .flatMap((entry) => entry.refs || [])
  );
  const humanOwnedUnresolvedRefs = new Set([
    ...(laneB?.contradictions_and_unsupported_claims || [])
      .filter((entry) => entry.resolution_status === "human_owned")
      .flatMap((entry) => entry.refs || []),
    ...(laneB?.fact_table || [])
      .filter((entry) => String(entry.current_case_digest_usage).includes("unresolved"))
      .map((entry) => entry.id),
    ...(laneB?.profiles || [])
      .filter((entry) => (entry.unresolved_dependencies || []).length > 0)
      .map((entry) => entry.id),
    ...(laneB?.events || [])
      .filter((entry) => (entry.unresolved_dependencies || []).length > 0)
      .map((entry) => entry.id)
  ]);
  const referenceRoleKeys = [
    "affirmative_support_refs",
    "constraint_boundary_refs",
    "unresolved_candidate_refs",
    "rejected_reference_refs"
  ];
  let cursor = 0;
  let typedReferenceBeatCount = 0;
  for (const [index, beat] of beats.entries()) {
    issue(issues, beat.order === index + 1, "C_BEAT_ORDER_" + beat.beat_id, beat.order);
    issue(issues, beat.start_seconds === cursor, "C_BEAT_GAP_OR_OVERLAP_" + beat.beat_id, { expected: cursor, observed: beat.start_seconds });
    issue(issues, beat.end_seconds > beat.start_seconds, "C_BEAT_DURATION_" + beat.beat_id, beat);
    issue(issues, beat.target_duration_seconds === beat.end_seconds - beat.start_seconds, "C_BEAT_TARGET_DURATION_" + beat.beat_id, beat.target_duration_seconds);
    issue(issues, beat.target_weight > 0, "C_BEAT_WEIGHT_" + beat.beat_id, beat.target_weight);
    issue(issues, Boolean(beat.entry_function) && Boolean(beat.exit_function), "C_BEAT_FUNCTION_" + beat.beat_id, beat);
    issue(issues, beat.supporting_refs === undefined, "C_UNTYPED_SUPPORTING_REFS_" + beat.beat_id, beat.supporting_refs);
    const rolesPresent = referenceRoleKeys.every((key) => Array.isArray(beat[key]));
    issue(issues, rolesPresent, "C_TYPED_REFERENCE_ROLES_MISSING_" + beat.beat_id, referenceRoleKeys.filter((key) => !Array.isArray(beat[key])));
    const allRoleRefs = referenceRoleKeys.flatMap((key) => Array.isArray(beat[key]) ? beat[key] : []);
    issue(issues, allRoleRefs.length > 0, "C_TYPED_REFERENCE_ROLES_EMPTY_" + beat.beat_id, null);
    issue(issues, new Set(allRoleRefs).size === allRoleRefs.length, "C_REFERENCE_ROLE_DUPLICATION_" + beat.beat_id, allRoleRefs);
    for (const role of referenceRoleKeys) {
      for (const ref of Array.isArray(beat[role]) ? beat[role] : []) {
        issue(issues, referenceRecords.has(ref), "C_BEAT_UNKNOWN_REF_" + beat.beat_id + "_" + role, ref);
      }
    }
    for (const ref of beat.affirmative_support_refs || []) {
      const record = referenceRecords.get(ref);
      issue(issues, record?.review_status !== "reject", "C_AFFIRMATIVE_REF_REJECTED_" + beat.beat_id, ref);
      issue(issues, !candidateEndingRefs.has(ref), "C_AFFIRMATIVE_REF_CANDIDATE_ENDING_" + beat.beat_id, ref);
      issue(issues, !humanOwnedUnresolvedRefs.has(ref), "C_AFFIRMATIVE_REF_HUMAN_UNRESOLVED_" + beat.beat_id, ref);
    }
    for (const ref of beat.rejected_reference_refs || []) {
      issue(issues, referenceRecords.get(ref)?.review_status === "reject", "C_REJECTED_ROLE_NOT_REJECTED_" + beat.beat_id, ref);
    }
    if (rolesPresent && allRoleRefs.length > 0) typedReferenceBeatCount += 1;
    issue(issues, beat.production_selected === false, "C_BEAT_SILENT_SELECTION_" + beat.beat_id, beat.production_selected);
    cursor = beat.end_seconds;
  }
  issue(issues, cursor === 180, "C_DURATION_COVERAGE", cursor);
  issue(issues, Math.abs(beats.reduce((sum, beat) => sum + beat.target_weight, 0) - 1) < 0.00001, "C_WEIGHT_TOTAL", beats.reduce((sum, beat) => sum + beat.target_weight, 0));

  const laneD = state.lanes?.D_STORY_PRESENTATION;
  issue(issues, laneD?.nested_under === "STORY", "D_NOT_NESTED_UNDER_STORY", laneD?.nested_under);
  issue(issues, laneD?.replaceable_assets_lane_is_owner === false, "D_REPLACEABLE_OWNER_LEAK", laneD?.replaceable_assets_lane_is_owner);
  const segmentBeatIds = (laneD?.segments || []).map((segment) => segment.beat_id);
  issue(issues, sameMembers(segmentBeatIds, beats.map((beat) => beat.beat_id)), "D_BEAT_COVERAGE", segmentBeatIds);
  issue(issues, sameMembers((laneD?.segments || []).flatMap((segment) => segment.shot_ids), shots.map((shot) => shot.shot_id)), "D_SHOT_COVERAGE", laneD?.segments);
  issue(issues, sameMembers((laneD?.segments || []).flatMap((segment) => segment.cue_ids), captions.map((caption) => caption.cue_id)), "D_CAPTION_COVERAGE", laneD?.segments);
  issue(issues, captions.length === shots.length && captions.length === subtitles.length, "D_CUE_SHOT_SUBTITLE_COUNT", { captions: captions.length, shots: shots.length, subtitles: subtitles.length });
  captions.forEach((caption, index) => {
    issue(issues, caption.shot_id === shots[index].shot_id, "D_CUE_SHOT_BINDING_" + caption.cue_id, shots[index].shot_id);
    issue(issues, Number(caption.start_seconds) === Number(shots[index].start_seconds) && Number(caption.end_seconds) === Number(shots[index].end_seconds), "D_CUE_SHOT_TIMING_" + caption.cue_id, shots[index]);
    issue(issues, Number(subtitles[index].start_seconds) === Number(shots[index].start_seconds) && Number(subtitles[index].end_seconds) === Number(shots[index].end_seconds), "D_SUBTITLE_SHOT_TIMING_" + subtitles[index].cue_id, shots[index]);
  });
  const allowedKinds = new Set(quarantine.allowed_primary_source_kinds || []);
  const forbiddenKinds = new Set(quarantine.forbidden_primary_source_kinds || []);
  const compatibleDerivedRasterKinds = new Set([
    "accepted_generated_raster_anchor",
    "deterministic_raster_composite"
  ]);
  const quarantineCompatible = (shot) =>
    (allowedKinds.has(shot.source_kind) || compatibleDerivedRasterKinds.has(shot.source_kind)) &&
    !forbiddenKinds.has(shot.source_kind) &&
    /\.(?:jpe?g|png|webp)$/i.test(shot.image_path);
  issue(issues, quarantine.status === "ACTIVE", "D_QUARANTINE_INACTIVE", quarantine.status);
  issue(issues, shots.every(quarantineCompatible), "D_PRIMARY_SOURCE_KIND_NOT_ALLOWED", shots.map((shot) => shot.source_kind));
  issue(issues, shots.every((shot) => !forbiddenKinds.has(shot.source_kind)), "D_FORBIDDEN_PRIMARY_SOURCE_KIND", shots.map((shot) => shot.source_kind));
  issue(issues, laneD?.backgrounds_and_primary_imagery?.production_selected === false, "D_PRIMARY_PRODUCTION_SELECTION", laneD?.backgrounds_and_primary_imagery);

  const inventorySchema = "fff.caseDigestPresentationProvenanceRightsInventory.v1";
  const inventoryPurpose = "READ_ONLY_EVIDENCE_CLASSIFICATION";
  const technicalStatus = "PRESENT_HASH_AND_DIMENSION_BOUND_RASTER";
  const acceptanceScope = "PRESENTATION_EVIDENCE_ONLY";
  const compatibilityStatus = "COMPATIBLE_SOURCE_KIND_NOT_RIGHTS_AUTHORITY";
  const rightsEvidencePresent = "PRESENT_BOUND_RECORD";
  const rightsEvidenceAbsent = "ABSENT_NO_LICENSE_OR_TERMS_RECORD";
  const rightsEvidenceUnresolved = "UNRESOLVED_EVIDENCE_IDENTITY";
  const rightsDecisionUnresolved = "UNRESOLVED_HUMAN_OWNED";
  const rightsNotCleared = "NOT_CLEARED";
  const repositoryChainStatus = "OBSERVED_REPOSITORY_CHAIN";
  const recordedExternalChainStatus = "OBSERVED_RECORDED_CHAIN_SOURCE_BYTES_NOT_REPOSITORY_BOUND";
  issue(issues, presentationInventoryBinding?.path === "artifacts/case-digest-presentation-provenance-rights-inventory.json", "D_PRESENTATION_INVENTORY_BINDING", presentationInventoryBinding);
  issue(issues, presentationInventory?.schema_version === inventorySchema, "D_PRESENTATION_INVENTORY_SCHEMA", presentationInventory?.schema_version);
  issue(issues, presentationInventory?.identity?.content_lane === "NON_DENSOU_CASE_DIGEST", "D_PRESENTATION_INVENTORY_LANE", presentationInventory?.identity);
  issue(issues, presentationInventory?.identity?.densou_identity === "OUT_OF_LANE", "D_PRESENTATION_INVENTORY_DENSOU", presentationInventory?.identity);
  issue(issues, presentationInventory?.authority?.purpose === inventoryPurpose, "D_PRESENTATION_INVENTORY_PURPOSE", presentationInventory?.authority);
  for (const key of [
    "may_select_or_replace_imagery",
    "may_grant_rights_clearance",
    "technical_usability_may_imply_rights_clearance",
    "owner_acceptance_may_imply_rights_clearance",
    "generated_or_derived_raster_compatibility_may_imply_rights_clearance",
    "missing_or_unknown_provenance_may_imply_rights_clearance"
  ]) {
    issue(issues, presentationInventory?.authority?.[key] === false, "D_PRESENTATION_INVENTORY_AUTHORITY_LEAK_" + key, presentationInventory?.authority?.[key]);
  }
  issue(issues, presentationInventory?.authority?.rights_clearance_requires_explicit_current_authority === true, "D_RIGHTS_EXPLICIT_AUTHORITY_NOT_REQUIRED", presentationInventory?.authority);
  issue(issues, presentationInventory?.classification_contract?.technical_usability_status === technicalStatus, "D_TECHNICAL_STATUS_CONTRACT", presentationInventory?.classification_contract);
  issue(issues, presentationInventory?.classification_contract?.owner_acceptance_scope === acceptanceScope, "D_ACCEPTANCE_SCOPE_CONTRACT", presentationInventory?.classification_contract);
  issue(issues, presentationInventory?.classification_contract?.quarantine_compatibility_status === compatibilityStatus, "D_COMPATIBILITY_STATUS_CONTRACT", presentationInventory?.classification_contract);
  issue(issues, sameMembers(presentationInventory?.classification_contract?.rights_evidence_status_values || [], [rightsEvidencePresent, rightsEvidenceAbsent, rightsEvidenceUnresolved]), "D_RIGHTS_EVIDENCE_STATUS_VALUES_CONTRACT", presentationInventory?.classification_contract);
  issue(issues, presentationInventory?.classification_contract?.rights_evidence_status === rightsEvidenceAbsent, "D_RIGHTS_EVIDENCE_STATUS_CONTRACT", presentationInventory?.classification_contract);
  issue(issues, presentationInventory?.classification_contract?.rights_decision_status === rightsDecisionUnresolved, "D_RIGHTS_DECISION_STATUS_CONTRACT", presentationInventory?.classification_contract);
  issue(issues, presentationInventory?.classification_contract?.rights_clearance_status === rightsNotCleared, "D_RIGHTS_CLEARANCE_STATUS_CONTRACT", presentationInventory?.classification_contract);

  const expectedInventoryEvidence = new Map([
    ["shot_sequence", "artifacts/private-raster-case-digest/selected-shot-sequence.csv"],
    ["presentation_model", "artifacts/private-raster-case-digest/private-raster-case-digest.json"],
    ["image_lineage", "artifacts/private-full-raster-candidate/image-lineage.csv"],
    ["generated_original_records", "artifacts/private-full-raster-candidate/generation-attempts-source.json"],
    ["anchor_generation_records", "artifacts/high-fidelity-raster-pilot/source-provenance.csv"],
    ["primary_imagery_quarantine", "artifacts/primary-imagery-quarantine/primary-imagery-quarantine.json"]
  ]);
  const inventoryEvidenceByRole = new Map();
  for (const binding of presentationInventory?.evidence_bindings || []) {
    issue(issues, expectedInventoryEvidence.has(binding.role), "D_PRESENTATION_EVIDENCE_ROLE_" + binding.role, binding);
    issue(issues, !inventoryEvidenceByRole.has(binding.role), "D_PRESENTATION_EVIDENCE_DUPLICATE_" + binding.role, binding);
    inventoryEvidenceByRole.set(binding.role, binding);
  }
  for (const [role, expectedPath] of expectedInventoryEvidence) {
    const binding = inventoryEvidenceByRole.get(role);
    issue(issues, binding?.path === expectedPath, "D_PRESENTATION_EVIDENCE_PATH_" + role, binding);
    if (binding?.path && existsSync(absolute(binding.path))) {
      issue(issues, binding.sha256 === hashFile(binding.path), "D_PRESENTATION_EVIDENCE_HASH_" + role, binding.sha256);
    } else {
      issue(issues, false, "D_PRESENTATION_EVIDENCE_MISSING_" + role, binding?.path);
    }
  }

  const inventoryRecords = presentationInventory?.records || [];
  issue(issues, inventoryRecords.length === shots.length, "D_PRESENTATION_INVENTORY_RECORD_COUNT", inventoryRecords.length);
  issue(issues, new Set(inventoryRecords.map((record) => record.shot_id)).size === shots.length, "D_PRESENTATION_INVENTORY_SHOT_UNIQUENESS", inventoryRecords.map((record) => record.shot_id));
  let sourceKindInventoryCount = 0;
  let technicalUsabilityInventoryCount = 0;
  let ownerAcceptanceInventoryCount = 0;
  let provenanceStatusInventoryCount = 0;
  let rightsStatusInventoryCount = 0;
  let repositoryChainObservedCount = 0;
  let recordedExternalChainCount = 0;
  let rightsEvidencePresentCount = 0;
  let rightsEvidenceAbsentCount = 0;
  let rightsEvidenceUnresolvedCount = 0;
  let rightsDecisionUnresolvedCount = 0;
  let inventoryRightsClearedCount = 0;
  let inventoryProductionSelectedCount = 0;
  const observedSourceKindCounts = new Map();

  for (const [index, shot] of shots.entries()) {
    const shotId = shot.shot_id;
    const record = inventoryRecords.find((entry) => entry.shot_id === shotId);
    const presentationShot = presentationModel.shots?.find((entry) => entry.shot_id === shotId);
    const lineage = imageLineage.find((entry) => entry.shot_id === shotId);
    issue(issues, Boolean(record), "D_PRESENTATION_INVENTORY_RECORD_MISSING_" + shotId, null);
    if (!record) continue;
    issue(issues, record.sequence === index + 1, "D_PRESENTATION_INVENTORY_SEQUENCE_" + shotId, record.sequence);
    issue(issues, record.cue_id === captions[index]?.cue_id, "D_PRESENTATION_INVENTORY_CUE_" + shotId, record.cue_id);
    const sourceKindValid = record.source_kind === shot.source_kind && record.source_kind === presentationShot?.source_kind;
    issue(issues, sourceKindValid, "D_PRESENTATION_SOURCE_KIND_" + shotId, { sequence: shot.source_kind, model: presentationShot?.source_kind, inventory: record.source_kind });
    if (sourceKindValid) sourceKindInventoryCount += 1;
    observedSourceKindCounts.set(record.source_kind, (observedSourceKindCounts.get(record.source_kind) || 0) + 1);

    const imageIdentityMatches = record.image?.path === shot.image_path
      && record.image?.path === presentationShot?.image_path
      && record.image?.sha256 === shot.sha256
      && record.image?.sha256 === presentationShot?.sha256
      && record.image?.width === presentationShot?.width
      && record.image?.height === presentationShot?.height;
    issue(issues, imageIdentityMatches, "D_PRESENTATION_IMAGE_IDENTITY_" + shotId, record.image);
    const imageBytesMatch = Boolean(record.image?.path)
      && existsSync(absolute(record.image.path))
      && hashFile(record.image.path) === record.image.sha256;
    const technicalValid = imageIdentityMatches
      && imageBytesMatch
      && record.image.width === 1600
      && record.image.height === 900
      && record.technical_usability_status === technicalStatus;
    issue(issues, technicalValid, "D_PRESENTATION_TECHNICAL_USABILITY_" + shotId, record.technical_usability_status);
    if (technicalValid) technicalUsabilityInventoryCount += 1;

    const ownerAcceptanceValid = presentationShot?.owner_accepted_primary_image === true
      && record.owner_accepted_primary_image === true
      && record.owner_acceptance_scope === acceptanceScope;
    issue(issues, ownerAcceptanceValid, "D_PRESENTATION_OWNER_ACCEPTANCE_" + shotId, record.owner_accepted_primary_image);
    if (ownerAcceptanceValid) ownerAcceptanceInventoryCount += 1;
    issue(issues, record.quarantine_compatibility_status === compatibilityStatus, "D_PRESENTATION_COMPATIBILITY_STATUS_" + shotId, record.quarantine_compatibility_status);

    const lineageCommonValid = Boolean(lineage)
      && lineage.source_kind === record.source_kind
      && lineage.final_image_path === record.image.path
      && lineage.final_sha256 === record.image.sha256
      && lineage.selected_for_final_production === "false"
      && lineage.rights_cleared_claim === "false";
    issue(issues, lineageCommonValid, "D_PRESENTATION_LINEAGE_RECORD_" + shotId, lineage);
    const chain = record.provenance?.chain_steps || [];
    let provenanceValid = false;
    if (record.source_kind === "generated_raster") {
      const generation = generatedOriginalRecords.attempts?.find((entry) => entry.shot_id === shotId && entry.accepted === true);
      const generatedStep = chain[0];
      const finalStep = chain[1];
      const generatedBytesMatch = Boolean(generation?.workspace_source_path)
        && existsSync(absolute(generation.workspace_source_path))
        && hashFile(generation.workspace_source_path) === generation.sha256;
      provenanceValid = record.provenance?.status === repositoryChainStatus
        && record.provenance?.observed === true
        && chain.length === 2
        && generatedStep?.relation === "GENERATED_ORIGINAL"
        && generatedStep?.path === generation?.workspace_source_path
        && generatedStep?.sha256 === generation?.sha256
        && generatedStep?.repository_bytes_observed === true
        && generatedBytesMatch
        && finalStep?.relation === "DETERMINISTIC_CROP_RESIZE"
        && finalStep?.input_shot_id === shotId
        && finalStep?.output_path === record.image.path
        && finalStep?.output_sha256 === record.image.sha256
        && finalStep?.evidence_role === "image_lineage"
        && lineageCommonValid;
    } else if (record.source_kind === "accepted_generated_raster_anchor") {
      const anchor = anchorGenerationRecords.find((entry) => entry.shot_id === shotId);
      const generatedStep = chain[0];
      const finalStep = chain[1];
      provenanceValid = record.provenance?.status === recordedExternalChainStatus
        && record.provenance?.observed === true
        && chain.length === 2
        && generatedStep?.relation === "GENERATED_ORIGINAL_RECORD"
        && generatedStep?.path === null
        && generatedStep?.sha256 === anchor?.generated_original_sha256
        && generatedStep?.repository_bytes_observed === false
        && generatedStep?.evidence_role === "anchor_generation_records"
        && finalStep?.relation === "DETERMINISTIC_CROP_RESIZE"
        && finalStep?.input_shot_id === shotId
        && finalStep?.output_path === anchor?.image_path
        && finalStep?.output_sha256 === anchor?.sha256
        && finalStep?.evidence_role === "anchor_generation_records"
        && anchor?.selected_for_production === "false"
        && anchor?.rights_cleared_claim === "false"
        && lineageCommonValid;
    } else if (record.source_kind === "deterministic_raster_composite") {
      const sourceShotId = lineage?.source_shot_ids;
      const sourceLineage = imageLineage.find((entry) => entry.shot_id === sourceShotId);
      const generation = generatedOriginalRecords.attempts?.find((entry) => entry.shot_id === sourceShotId && entry.accepted === true);
      const generatedStep = chain[0];
      const baseStep = chain[1];
      const compositeStep = chain[2];
      const generatedBytesMatch = Boolean(generation?.workspace_source_path)
        && existsSync(absolute(generation.workspace_source_path))
        && hashFile(generation.workspace_source_path) === generation.sha256;
      provenanceValid = record.provenance?.status === repositoryChainStatus
        && record.provenance?.observed === true
        && chain.length === 3
        && generatedStep?.relation === "GENERATED_ORIGINAL"
        && generatedStep?.path === generation?.workspace_source_path
        && generatedStep?.sha256 === generation?.sha256
        && generatedStep?.repository_bytes_observed === true
        && generatedBytesMatch
        && baseStep?.relation === "DETERMINISTIC_CROP_RESIZE"
        && baseStep?.input_shot_id === sourceShotId
        && baseStep?.output_path === sourceLineage?.final_image_path
        && baseStep?.output_sha256 === sourceLineage?.final_sha256
        && baseStep?.evidence_role === "image_lineage"
        && compositeStep?.relation === "DETERMINISTIC_RASTER_COMPOSITE"
        && compositeStep?.input_shot_id === sourceShotId
        && compositeStep?.input_path === lineage?.source_image_path
        && compositeStep?.input_sha256 === sourceLineage?.final_sha256
        && compositeStep?.output_path === record.image.path
        && compositeStep?.output_sha256 === record.image.sha256
        && compositeStep?.evidence_role === "image_lineage"
        && lineageCommonValid;
    }
    issue(issues, provenanceValid, "D_PRESENTATION_PROVENANCE_CHAIN_" + shotId, record.provenance);
    if (provenanceValid) {
      provenanceStatusInventoryCount += 1;
      if (record.provenance.status === repositoryChainStatus) repositoryChainObservedCount += 1;
      if (record.provenance.status === recordedExternalChainStatus) recordedExternalChainCount += 1;
    }

    const rightsStatusValid = record.rights_evidence_status === rightsEvidenceAbsent
      && record.rights_decision_status === rightsDecisionUnresolved
      && record.rights_clearance_status === rightsNotCleared
      && record.rights_cleared === false
      && record.production_selected === false
      && presentationShot?.rights_cleared_claim === false
      && presentationShot?.selected_for_final_production === false;
    issue(issues, rightsStatusValid, "D_PRESENTATION_RIGHTS_STATUS_" + shotId, {
      rights_evidence_status: record.rights_evidence_status,
      rights_decision_status: record.rights_decision_status,
      rights_clearance_status: record.rights_clearance_status,
      rights_cleared: record.rights_cleared,
      production_selected: record.production_selected
    });
    if (rightsStatusValid) rightsStatusInventoryCount += 1;
    if (record.rights_evidence_status === rightsEvidenceAbsent) rightsEvidenceAbsentCount += 1;
    else if (record.rights_evidence_status === rightsEvidenceUnresolved) rightsEvidenceUnresolvedCount += 1;
    else rightsEvidencePresentCount += 1;
    if (record.rights_decision_status === rightsDecisionUnresolved) rightsDecisionUnresolvedCount += 1;
    if (record.rights_cleared === true) inventoryRightsClearedCount += 1;
    if (record.production_selected === true) inventoryProductionSelectedCount += 1;
    issue(issues, !(record.rights_evidence_status === rightsEvidenceAbsent && record.rights_cleared === true), "D_RIGHTS_EVIDENCE_ABSENT_CANNOT_CLEAR_" + shotId, record.rights_evidence_status);
    issue(issues, !(quarantineCompatible(shot) && record.rights_cleared === true), "D_RASTER_COMPATIBILITY_SELF_GRANTED_RIGHTS_" + shotId, record.source_kind);
    issue(issues, !(!provenanceValid && record.rights_cleared === true), "D_UNKNOWN_PROVENANCE_CANNOT_CLEAR_" + shotId, record.provenance);
    issue(issues, record.rights_cleared !== true, "D_RIGHTS_CLEARANCE_WITHOUT_EXPLICIT_AUTHORITY_" + shotId, record.rights_cleared);
  }

  const observedStatusCounts = presentationInventory?.observed_status_counts;
  const sourceKindCountsObject = Object.fromEntries([...observedSourceKindCounts.entries()].sort(([left], [right]) => left.localeCompare(right)));
  const expectedSourceKindCountsObject = {
    accepted_generated_raster_anchor: 2,
    deterministic_raster_composite: 2,
    generated_raster: 7
  };
  issue(issues, JSON.stringify(sourceKindCountsObject) === JSON.stringify(expectedSourceKindCountsObject), "D_PRESENTATION_SOURCE_KIND_COUNTS_COMPUTED", sourceKindCountsObject);
  issue(issues, JSON.stringify(Object.fromEntries(Object.entries(observedStatusCounts?.source_kinds || {}).sort(([left], [right]) => left.localeCompare(right)))) === JSON.stringify(expectedSourceKindCountsObject), "D_PRESENTATION_SOURCE_KIND_COUNTS_RECORDED", observedStatusCounts?.source_kinds);
  const computedStatusCounts = {
    technically_usable: technicalUsabilityInventoryCount,
    owner_accepted_primary_image: ownerAcceptanceInventoryCount,
    provenance_observed: provenanceStatusInventoryCount,
    repository_chain_observed: repositoryChainObservedCount,
    recorded_chain_source_bytes_not_repository_bound: recordedExternalChainCount,
    rights_evidence_present: rightsEvidencePresentCount,
    rights_evidence_absent: rightsEvidenceAbsentCount,
    rights_evidence_unresolved: rightsEvidenceUnresolvedCount,
    rights_decision_unresolved: rightsDecisionUnresolvedCount,
    rights_cleared: inventoryRightsClearedCount,
    production_selected: inventoryProductionSelectedCount
  };
  for (const [name, expected] of Object.entries(computedStatusCounts)) {
    issue(issues, observedStatusCounts?.[name] === expected, "D_PRESENTATION_STATUS_COUNT_" + name, { expected, observed: observedStatusCounts?.[name] });
  }
  const laneDInventory = laneD?.backgrounds_and_primary_imagery?.provenance_rights_inventory;
  issue(issues, laneDInventory?.binding_role === "presentation_provenance_rights_inventory", "D_PRESENTATION_STATE_INVENTORY_BINDING", laneDInventory);
  issue(issues, laneDInventory?.schema_version === inventorySchema, "D_PRESENTATION_STATE_INVENTORY_SCHEMA", laneDInventory);
  issue(issues, laneDInventory?.purpose === inventoryPurpose, "D_PRESENTATION_STATE_INVENTORY_PURPOSE", laneDInventory);
  issue(issues, laneDInventory?.may_select_or_replace_imagery === false, "D_PRESENTATION_STATE_INVENTORY_SELECTION_LEAK", laneDInventory);
  issue(issues, laneDInventory?.may_grant_rights_clearance === false, "D_PRESENTATION_STATE_INVENTORY_RIGHTS_LEAK", laneDInventory);
  const stateInventoryCounts = {
    record_count: inventoryRecords.length,
    technically_usable_count: technicalUsabilityInventoryCount,
    owner_accepted_primary_image_count: ownerAcceptanceInventoryCount,
    provenance_observed_count: provenanceStatusInventoryCount,
    repository_chain_observed_count: repositoryChainObservedCount,
    recorded_chain_source_bytes_not_repository_bound_count: recordedExternalChainCount,
    rights_evidence_present_count: rightsEvidencePresentCount,
    rights_evidence_absent_count: rightsEvidenceAbsentCount,
    rights_evidence_unresolved_count: rightsEvidenceUnresolvedCount,
    rights_decision_unresolved_count: rightsDecisionUnresolvedCount,
    rights_cleared_count: inventoryRightsClearedCount
  };
  for (const [name, expected] of Object.entries(stateInventoryCounts)) {
    issue(issues, laneDInventory?.[name] === expected, "D_PRESENTATION_STATE_INVENTORY_COUNT_" + name, { expected, observed: laneDInventory?.[name] });
  }
  issue(issues, laneD?.backgrounds_and_primary_imagery?.rights_cleared_count === inventoryRightsClearedCount, "D_RIGHTS_COUNT_INVENTORY_MISMATCH", laneD?.backgrounds_and_primary_imagery);
  issue(issues, inventoryRightsClearedCount === 0, "D_RIGHTS_SILENT_PROMOTION", inventoryRightsClearedCount);

  const laneE = state.lanes?.E_INTEGRATION_CHECK;
  for (const key of ["creative_authority", "may_choose_content", "may_select_plot", "may_select_presentation", "may_promote_evidence_to_acceptance"]) {
    issue(issues, laneE?.[key] === false, "E_AUTHORITY_LEAK_" + key, laneE?.[key]);
  }
  issue(issues, laneE?.checks?.includes("presentation_provenance_rights_inventory") === true, "E_PRESENTATION_INVENTORY_CHECK_MISSING", laneE?.checks);

  const literalFactCount = sourceFacts.filter((fact) => normalizeSource(fact.source) === literalSourceStatus).length;
  const nonliteralFactCount = sourceFacts.length - literalFactCount;
  const factRecordCount = sourceFacts.filter((fact) => laneB?.fact_table?.some((entry) => entry.id === fact.id)).length;
  const factSourceStatusCount = sourceFacts.filter((fact) =>
    laneB?.fact_table?.some((entry) => entry.id === fact.id && entry.source_status === normalizeSource(fact.source))
  ).length;
  const explicitBeatCount = beats.length;
  const orderedBeatCount = beats.filter((beat, index) => beat.order === index + 1).length;
  const entryExitCount = beats.filter((beat) => beat.entry_function && beat.exit_function).length;
  const weightedCount = beats.filter((beat) => beat.target_duration_seconds > 0 && beat.target_weight > 0).length;
  const productionSelectedBeatCount = beats.filter((beat) => beat.production_selected === true).length;
  const allowedShotCount = shots.filter(quarantineCompatible).length;
  const effectBeatCount = laneD?.screen_effects?.itemized_beat_count || 0;
  const rightsClearedCount = inventoryRightsClearedCount;
  const exactMediaReady = existsSync(absolute(exactPackageDir + "/private-raster-case-digest-ichiro-provisional.mp4")) ? 1 : 0;
  const envelopeReady = laneA?.duration_envelope?.minimum_seconds <= 180 && laneA?.duration_envelope?.maximum_seconds >= 180 ? 1 : 0;
  const assemblyAdopted = state.authority?.legacy_content_process_surface?.current_project_gate === true ? 1 : 0;
  const currentIntegratedReviewAccepted = state.authority?.legacy_content_process_surface?.current_human_action === true ? 1 : 0;
  const structuralInterpretation = "STRUCTURAL_RECORD_COVERAGE_NOT_QUALITY_OR_CREATIVE_PROGRESS";
  const computedLadder = finalizeRequirementStatuses([
    {
      stage: "REFERENCE_MODEL",
      requirement_vectors: [
        vector("B.FACT_RECORDS", factRecordCount, sourceFacts.length, "records"),
        vector("B.FACT_SOURCE_STATUS", factSourceStatusCount, sourceFacts.length, "records"),
        vector("B.LITERAL_FACT_SUPPORT_CONTRACTS", validSupportContractCount, literalFactCount, "versioned_fact_contracts"),
        vector("B.LITERAL_AUTHOR_MEMO_LOCATORS", validLiteralLocatorCount, literalFactCount, "typed_verified_locators"),
        vector("B.LITERAL_LOCATOR_SPAN_AUDIT", auditedLiteralLocatorCount, literalFactCount, "audited_locators"),
        vector("B.NONLITERAL_SOURCE_CLASSIFICATIONS", validNonliteralClassificationCount, nonliteralFactCount, "typed_classifications"),
        vector("B.PROFILES", laneB?.profiles?.length || 0, sourceProfiles.length, "records"),
        vector("B.RELATIONSHIP_EDGES", laneB?.relationship_edges?.length || 0, expectedEdges.length, "edges"),
        vector("B.CLAIMS", laneB?.claims?.length || 0, sourceClaims.length, "records"),
        vector("B.EVENTS", laneB?.events?.length || 0, sourceEvents.length, "records")
      ]
    },
    {
      stage: "AUTHORED_PLOT_SPINE",
      requirement_vectors: [
        vector("C.EXPLICIT_BEATS", explicitBeatCount, 5, "beats"),
        vector("C.ORDERED_BEATS", orderedBeatCount, beats.length, "beats"),
        vector("C.TYPED_REFERENCE_ROLES", typedReferenceBeatCount, beats.length, "beats"),
        vector("C.ENTRY_EXIT_FUNCTIONS", entryExitCount, beats.length, "beats"),
        vector("C.TARGET_DURATION_AND_WEIGHT", weightedCount, beats.length, "beats"),
        vector("C.PRODUCTION_SELECTED_BEATS", productionSelectedBeatCount, beats.length, "human_selected_beats")
      ]
    },
    {
      stage: "PRESENTATION_PLAN",
      requirement_vectors: [
        vector("D.PRESENTATION_SEGMENTS", laneD?.segments?.length || 0, beats.length, "beats"),
        vector("D.SHOTS_MAPPED", (laneD?.segments || []).flatMap((segment) => segment.shot_ids).length, shots.length, "shots"),
        vector("D.CAPTIONS_MAPPED", (laneD?.segments || []).flatMap((segment) => segment.cue_ids).length, captions.length, "cues"),
        vector("D.MOTION_RECORDS", shots.filter((shot) => Boolean(shot.motion)).length, shots.length, "shots"),
        vector("D.TRANSITION_RECORDS", shots.filter((shot) => Boolean(shot.transition)).length, shots.length, "shots"),
        vector("D.ALLOWED_PRIMARY_IMAGERY_KINDS", allowedShotCount, shots.length, "shots"),
        vector("D.SOURCE_KIND_INVENTORY_RECORDS", sourceKindInventoryCount, shots.length, "classified_shots"),
        vector("D.TECHNICAL_USABILITY_INVENTORY_RECORDS", technicalUsabilityInventoryCount, shots.length, "classified_shots"),
        vector("D.OWNER_ACCEPTANCE_INVENTORY_RECORDS", ownerAcceptanceInventoryCount, shots.length, "classified_shots"),
        vector("D.PROVENANCE_STATUS_INVENTORY_RECORDS", provenanceStatusInventoryCount, shots.length, "classified_shots"),
        vector("D.RIGHTS_STATUS_INVENTORY_RECORDS", rightsStatusInventoryCount, shots.length, "classified_shots"),
        vector("D.SCREEN_EFFECT_BEAT_RECORDS", effectBeatCount, beats.length, "beats"),
        vector("D.RIGHTS_CLEARED_PRIMARY_CHOICES", rightsClearedCount, shots.length, "shots")
      ]
    },
    {
      stage: "PROVISIONAL_ASSEMBLY",
      requirement_vectors: [
        vector("A.EXACT_MEDIA_AVAILABLE", exactMediaReady, 1, "identity"),
        vector("A.DURATION_ENVELOPE_SATISFIED", envelopeReady, 1, "envelope"),
        vector("A.AUDIO_CUE_WINDOWS", syncReceipt.cues?.filter((cue) => cue.within_accepted_caption_window === true).length || 0, captions.length, "cues"),
        vector("A.CURRENT_ASSEMBLY_ADOPTED", assemblyAdopted, 1, "explicit_adoption")
      ]
    },
    {
      stage: "INTEGRATED_REVIEW",
      requirement_vectors: [
        vector("INTEGRATED_REVIEW.CURRENT_ACCEPTANCE", currentIntegratedReviewAccepted, 1, "explicit_human_acceptance")
      ]
    },
    {
      stage: "FINAL_AND_PRODUCTION_GATES",
      requirement_vectors: [
        vector("FINAL.SOURCE_SELECTED", Number(state.current_position?.source_selected === true), 1, "human_decision"),
        vector("FINAL.CANON_SELECTED", Number(state.current_position?.canon_selected === true), 1, "human_decision"),
        vector("FINAL.TOPIC_SELECTED", Number(state.current_position?.topic_selected === true), 1, "human_decision"),
        vector("FINAL.VOICE_SELECTED", Number(state.current_position?.final_voice_selected === true), 1, "human_decision"),
        vector("FINAL.MAJOR_VISUAL_AND_EDITORIAL_SELECTED", Number(state.current_position?.major_visual_method_selected === true && state.current_position?.editorial_winner_selected === true), 1, "human_decision"),
        vector("FINAL.RIGHTS_APPROVED", Number(state.current_position?.rights_approved === true), 1, "human_decision"),
        vector("FINAL.PRODUCTION_APPROVED", Number(state.current_position?.production_approved === true), 1, "human_decision"),
        vector("FINAL.PUBLICATION_APPROVED", Number(state.current_position?.publication_approved === true), 1, "human_decision")
      ]
    }
  ]);
  verifyCoverageVectors(issues, "B", laneB?.coverage_vectors, {
    fact_records: { observed: factRecordCount, required: sourceFacts.length, unit: "records" },
    fact_source_status: { observed: factSourceStatusCount, required: sourceFacts.length, unit: "records" },
    literal_fact_support_contracts: { observed: validSupportContractCount, required: literalFactCount, unit: "versioned_fact_contracts" },
    literal_author_memo_locators: { observed: validLiteralLocatorCount, required: literalFactCount, unit: "typed_verified_locators" },
    literal_locator_span_audit: { observed: auditedLiteralLocatorCount, required: literalFactCount, unit: "audited_locators" },
    nonliteral_source_classifications: { observed: validNonliteralClassificationCount, required: nonliteralFactCount, unit: "typed_classifications" },
    derived_candidate_classifications: { observed: validNonliteralByClass.get("derived_candidate") || 0, required: sourceFacts.filter((fact) => normalizeSource(fact.source) === "derived_candidate").length, unit: "typed_classifications" },
    inferred_candidate_classifications: { observed: validNonliteralByClass.get("inferred_candidate") || 0, required: sourceFacts.filter((fact) => normalizeSource(fact.source) === "inferred_candidate").length, unit: "typed_classifications" },
    missing_decision_classifications: { observed: validNonliteralByClass.get("missing_decision") || 0, required: sourceFacts.filter((fact) => normalizeSource(fact.source) === "missing_decision").length, unit: "typed_classifications" },
    profiles: { observed: laneB?.profiles?.length || 0, required: sourceProfiles.length, unit: "records" },
    relationship_edges: { observed: laneB?.relationship_edges?.length || 0, required: expectedEdges.length, unit: "edges" },
    claims: { observed: laneB?.claims?.length || 0, required: sourceClaims.length, unit: "records" },
    events: { observed: laneB?.events?.length || 0, required: sourceEvents.length, unit: "records" }
  }, structuralInterpretation);
  verifyCoverageVectors(issues, "C", laneC?.coverage_vectors, {
    explicit_beat_records: { observed: explicitBeatCount, required: 5, unit: "beats" },
    ordered_beats: { observed: orderedBeatCount, required: beats.length, unit: "beats" },
    beats_with_typed_reference_roles: { observed: typedReferenceBeatCount, required: beats.length, unit: "beats" },
    beats_with_entry_exit_function: { observed: entryExitCount, required: beats.length, unit: "beats" },
    beats_with_target_duration_and_weight: { observed: weightedCount, required: beats.length, unit: "beats" },
    production_selected_beats: { observed: productionSelectedBeatCount, required: beats.length, unit: "human_selected_beats" },
    duration_coverage_seconds: { observed: cursor, required: 180, unit: "seconds" }
  }, structuralInterpretation);
  verifyCoverageVectors(issues, "D", laneD?.coverage_vectors, {
    beats_with_presentation_segments: { observed: laneD?.segments?.length || 0, required: beats.length, unit: "beats" },
    shots_mapped: { observed: (laneD?.segments || []).flatMap((segment) => segment.shot_ids).length, required: shots.length, unit: "shots" },
    captions_mapped: { observed: (laneD?.segments || []).flatMap((segment) => segment.cue_ids).length, required: captions.length, unit: "cues" },
    motion_records: { observed: shots.filter((shot) => Boolean(shot.motion)).length, required: shots.length, unit: "shots" },
    transition_records: { observed: shots.filter((shot) => Boolean(shot.transition)).length, required: shots.length, unit: "shots" },
    source_kind_inventory_records: { observed: sourceKindInventoryCount, required: shots.length, unit: "classified_shots" },
    technical_usability_inventory_records: { observed: technicalUsabilityInventoryCount, required: shots.length, unit: "classified_shots" },
    owner_acceptance_inventory_records: { observed: ownerAcceptanceInventoryCount, required: shots.length, unit: "classified_shots" },
    provenance_status_inventory_records: { observed: provenanceStatusInventoryCount, required: shots.length, unit: "classified_shots" },
    rights_status_inventory_records: { observed: rightsStatusInventoryCount, required: shots.length, unit: "classified_shots" },
    screen_effect_beat_records: { observed: effectBeatCount, required: beats.length, unit: "beats" },
    rights_cleared_primary_choices: { observed: rightsClearedCount, required: shots.length, unit: "shots" }
  }, structuralInterpretation);
  issue(issues, state.production_ladder?.length === computedLadder.length, "LADDER_STAGE_COUNT", state.production_ladder?.length);
  const recordedRequirements = (state.production_ladder || []).flatMap((stage) => stage.requirement_vectors || []);
  const recordedRequirementIds = new Set(recordedRequirements.map((entry) => entry.requirement_id));
  const recordedIntegerOrders = recordedRequirements.filter((entry) => Number.isInteger(entry.order)).map((entry) => entry.order);
  for (const recordedRequirement of recordedRequirements) {
    issue(issues, recordedRequirement.order !== undefined, "REQUIREMENT_ORDER_MISSING_" + recordedRequirement.requirement_id, recordedRequirement.order);
    if (recordedRequirement.order !== undefined) {
      issue(issues, Number.isInteger(recordedRequirement.order), "REQUIREMENT_ORDER_NON_INTEGER_" + recordedRequirement.requirement_id, recordedRequirement.order);
    }
    issue(issues, sharedLanes.has(recordedRequirement.lane), "REQUIREMENT_LANE_INVALID_" + recordedRequirement.requirement_id, recordedRequirement.lane);
    issue(issues, requirementOwners.has(recordedRequirement.owner), "REQUIREMENT_OWNER_INVALID_" + recordedRequirement.requirement_id, recordedRequirement.owner);
    issue(issues, requirementStatuses.has(recordedRequirement.status), "REQUIREMENT_STATUS_INVALID_" + recordedRequirement.requirement_id, recordedRequirement.status);
    issue(issues, Array.isArray(recordedRequirement.depends_on), "REQUIREMENT_DEPENDENCIES_NOT_ARRAY_" + recordedRequirement.requirement_id, recordedRequirement.depends_on);
    for (const dependencyId of recordedRequirement.depends_on || []) {
      issue(issues, recordedRequirementIds.has(dependencyId), "REQUIREMENT_DEPENDENCY_UNKNOWN_" + recordedRequirement.requirement_id, dependencyId);
    }
    issue(issues, typeof recordedRequirement.evidence === "string" && recordedRequirement.evidence.length > 0, "REQUIREMENT_EVIDENCE_MISSING_" + recordedRequirement.requirement_id, recordedRequirement.evidence);
    issue(issues, typeof recordedRequirement.authority_effect === "string" && recordedRequirement.authority_effect.includes("may_change=") && recordedRequirement.authority_effect.includes("may_not_change="), "REQUIREMENT_AUTHORITY_EFFECT_INVALID_" + recordedRequirement.requirement_id, recordedRequirement.authority_effect);
    if (recordedRequirement.status === "N/A") {
      issue(issues, typeof recordedRequirement.na_reason === "string" && recordedRequirement.na_reason.length > 0, "REQUIREMENT_NA_REASON_MISSING_" + recordedRequirement.requirement_id, recordedRequirement.na_reason);
      issue(issues, typeof recordedRequirement.na_dependency_effect === "string" && recordedRequirement.na_dependency_effect.length > 0, "REQUIREMENT_NA_DEPENDENCY_EFFECT_MISSING_" + recordedRequirement.requirement_id, recordedRequirement.na_dependency_effect);
    } else {
      issue(issues, recordedRequirement.na_reason === null, "REQUIREMENT_NA_REASON_ON_ACTIVE_" + recordedRequirement.requirement_id, recordedRequirement.na_reason);
      issue(issues, recordedRequirement.na_dependency_effect === null, "REQUIREMENT_NA_DEPENDENCY_EFFECT_ON_ACTIVE_" + recordedRequirement.requirement_id, recordedRequirement.na_dependency_effect);
    }
  }
  const duplicateOrders = sorted([...new Set(recordedIntegerOrders.filter((order, index) => recordedIntegerOrders.indexOf(order) !== index))]);
  issue(issues, duplicateOrders.length === 0, "REQUIREMENT_ORDER_DUPLICATE", duplicateOrders);
  issue(issues, new Set(recordedIntegerOrders).size === requirementContracts.size, "REQUIREMENT_ORDER_UNIQUE_COVERAGE", {
    unique_integer_orders: new Set(recordedIntegerOrders).size,
    required: requirementContracts.size
  });
  issue(issues, recordedRequirements.length === requirementContracts.size, "REQUIREMENT_RECORD_COUNT", recordedRequirements.length);
  for (const computed of computedLadder) {
    const recorded = state.production_ladder?.find((stage) => stage.stage === computed.stage);
    issue(issues, Boolean(recorded), "LADDER_STAGE_MISSING_" + computed.stage, null);
    if (recorded) {
      issue(issues, recorded.coverage_interpretation === structuralInterpretation, "LADDER_INTERPRETATION_" + computed.stage, recorded.coverage_interpretation);
      issue(issues, recorded.progress === undefined && recorded.percent === undefined && recorded.numerator === undefined && recorded.denominator === undefined, "LADDER_SCALAR_PROGRESS_FORBIDDEN_" + computed.stage, recorded);
      issue(issues, recorded.status === stageStatus(computed), "LADDER_STATUS_" + computed.stage, { expected: stageStatus(computed), observed: recorded.status });
      issue(issues, recorded.requirement_vectors?.length === computed.requirement_vectors.length, "LADDER_VECTOR_COUNT_" + computed.stage, recorded.requirement_vectors?.length);
      for (const expectedVector of computed.requirement_vectors) {
        const recordedVector = recorded.requirement_vectors?.find((entry) => entry.requirement_id === expectedVector.requirement_id);
        issue(issues, Boolean(recordedVector), "LADDER_VECTOR_MISSING_" + expectedVector.requirement_id, null);
        if (recordedVector) {
          for (const field of ["order", "lane", "project_lane", "unit", "required", "observed", "owner", "evidence", "authority_effect", "status", "na_reason", "na_dependency_effect"]) {
            issue(issues, recordedVector[field] === expectedVector[field], "REQUIREMENT_FIELD_" + field + "_" + expectedVector.requirement_id, { expected: expectedVector[field], observed: recordedVector[field] });
          }
          issue(issues, JSON.stringify(recordedVector.depends_on) === JSON.stringify(expectedVector.depends_on), "REQUIREMENT_FIELD_depends_on_" + expectedVector.requirement_id, { expected: expectedVector.depends_on, observed: recordedVector.depends_on });
          if (recordedVector.status === "N/A" && expectedVector.status !== "N/A") {
            issue(issues, false, "REQUIREMENT_MISSING_GATE_MISCLASSIFIED_NA_" + expectedVector.requirement_id, recordedVector);
          }
        }
      }
      const computedStageFailure = firstFailedRequirement([computed]);
      issue(issues, recorded.first_failed_requirement === computedStageFailure, "LADDER_FIRST_FAILURE_" + computed.stage, { expected: computedStageFailure, observed: recorded.first_failed_requirement });
      const computedStageBlock = firstBlockedRequirement(computed);
      issue(issues, recorded.first_blocked_requirement === computedStageBlock, "LADDER_FIRST_BLOCKED_" + computed.stage, { expected: computedStageBlock, observed: recorded.first_blocked_requirement });
    }
  }
  const computedFirstFailedRequirement = firstFailedRequirement(computedLadder);
  issue(issues, state.current_position?.first_failed_requirement === computedFirstFailedRequirement, "CURRENT_FIRST_FAILED_REQUIREMENT", { expected: computedFirstFailedRequirement, observed: state.current_position?.first_failed_requirement });
  const computedFirstFailedVector = computedLadder.flatMap((stage) => stage.requirement_vectors).find((entry) => entry.requirement_id === computedFirstFailedRequirement);
  const computedFirstFailedRequirementOwner = requirementOwner(computedFirstFailedVector);
  issue(issues, JSON.stringify(state.current_position?.decisive_vector) === JSON.stringify(computedFirstFailedVector && { order: computedFirstFailedVector.order, observed: computedFirstFailedVector.observed, required: computedFirstFailedVector.required, unit: computedFirstFailedVector.unit, status: computedFirstFailedVector.status }), "CURRENT_DECISIVE_VECTOR", state.current_position?.decisive_vector);
  issue(issues, state.current_position?.first_failed_requirement_owner === computedFirstFailedRequirementOwner, "CURRENT_FIRST_FAILED_REQUIREMENT_OWNER", {
    expected: computedFirstFailedRequirementOwner,
    observed: state.current_position?.first_failed_requirement_owner
  });
  issue(issues, state.current_position?.agent_owned_requirement_available === (computedFirstFailedRequirementOwner === "agent_owned"), "CURRENT_AGENT_OWNED_REQUIREMENT_AVAILABILITY", {
    expected: computedFirstFailedRequirementOwner === "agent_owned",
    observed: state.current_position?.agent_owned_requirement_available
  });
  issue(issues, state.current_position?.first_failed_dependency_state === "DEPENDENCIES_SATISFIED", "CURRENT_FIRST_FAILED_DEPENDENCY_STATE", state.current_position?.first_failed_dependency_state);
  issue(issues, state.current_position?.shared_model_id === "content-production-lanes/v1", "CURRENT_SHARED_MODEL_ID", state.current_position?.shared_model_id);
  issue(issues, state.current_position?.human_review_requested === false, "CURRENT_PHANTOM_REVIEW", state.current_position?.human_review_requested);

  for (const relativePath of [defaultStatePath, "artifacts/case-digest-literal-fact-support-registry.json", "artifacts/case-digest-presentation-provenance-rights-inventory.json", "docs/production-lanes.md"]) {
    const content = readFileSync(absolute(relativePath), "utf8");
    issue(issues, !/019ff[0-9a-f-]+/i.test(content), "PORTABLE_THREAD_ID_" + relativePath, null);
    issue(issues, !/WO-\d{8}-[A-Z0-9-]+/.test(content), "PORTABLE_WORK_ORDER_ID_" + relativePath, null);
    issue(issues, !/[A-Z]:\\Users\\/i.test(content), "PORTABLE_ABSOLUTE_USER_PATH_" + relativePath, null);
  }

  const result = {
    schema_version: "fff.caseDigestProductionStateVerification.v2",
    status: issues.length === 0 ? "PASS" : "FAIL",
    state_id: state.state_id,
    identity: {
      content_lane: state.identity?.content_lane,
      media_sha256: state.identity?.development_media_sha256,
      densou_identity: state.identity?.densou_identity
    },
    control_alignment: {
      model_id: sharedAlignment?.model_id,
      portable_coordinator_locator: sharedAlignment?.portable_coordinator_locator,
      sha256: sharedAlignment?.sha256,
      scope: sharedAlignment?.alignment_scope,
      project_authority_owner: sharedAlignment?.project_authority_owner,
      project_authority_replaced: sharedAlignment?.project_authority_replaced
    },
    lane_status: Object.fromEntries(Object.entries(state.lanes || {}).map(([key, value]) => [key, value.stage_status])),
    metrics: {
      facts: sourceFacts.length,
      profiles: sourceProfiles.length,
      relationship_edges: expectedEdges.length,
      claims: sourceClaims.length,
      events: sourceEvents.length,
      literal_fact_support_contracts: validSupportContractCount,
      literal_author_memo_locators: validLiteralLocatorCount,
      literal_author_memo_locator_requirement: literalFactCount,
      audited_literal_author_memo_locators: auditedLiteralLocatorCount,
      unique_literal_locator_spans: spanGroups.size,
      shared_literal_locator_span_groups: computedSharedSpanGroups.length,
      overbroad_literal_locator_spans: computedOverbroadSpans.length,
      whole_raw_memo_locator_spans: wholeRawMemoSpans.length,
      invalid_literal_author_memo_locators: literalFactCount - validLiteralLocatorCount,
      nonliteral_source_classifications: validNonliteralClassificationCount,
      nonliteral_source_classification_requirement: nonliteralFactCount,
      unclassified_source_records: sourceFacts.length - validLiteralLocatorCount - validNonliteralClassificationCount,
      authored_beats: beats.length,
      production_selected_beats: productionSelectedBeatCount,
      presentation_beats: (laneD?.segments || []).length,
      shots: shots.length,
      captions: captions.length,
      provisional_subtitles: subtitles.length,
      objective_audio_cues: syncReceipt.cues?.length,
      presentation_source_kind_inventory_records: sourceKindInventoryCount,
      presentation_technical_usability_inventory_records: technicalUsabilityInventoryCount,
      presentation_owner_acceptance_inventory_records: ownerAcceptanceInventoryCount,
      presentation_provenance_status_inventory_records: provenanceStatusInventoryCount,
      presentation_repository_chains_observed: repositoryChainObservedCount,
      presentation_recorded_chains_source_bytes_not_repository_bound: recordedExternalChainCount,
      presentation_rights_evidence_present: rightsEvidencePresentCount,
      presentation_rights_evidence_absent: rightsEvidenceAbsentCount,
      presentation_rights_evidence_unresolved: rightsEvidenceUnresolvedCount,
      presentation_rights_decisions_unresolved: rightsDecisionUnresolvedCount,
      rights_cleared_primary_choices: rightsClearedCount,
      active_requirement_records: recordedRequirements.length,
      unique_integer_requirement_orders: new Set(recordedIntegerOrders).size,
      satisfied_requirements: recordedRequirements.filter((entry) => entry.status === "SATISFIED").length,
      unsatisfied_requirements: recordedRequirements.filter((entry) => entry.status === "UNSATISFIED").length,
      blocked_by_dependency_requirements: recordedRequirements.filter((entry) => entry.status === "BLOCKED_BY_DEPENDENCY").length,
      not_applicable_requirements: recordedRequirements.filter((entry) => entry.status === "N/A").length
    },
    requirement_vectors: computedLadder,
    first_failed_requirement: computedFirstFailedRequirement,
    first_failed_requirement_owner: computedFirstFailedRequirementOwner,
    wrong_fact_support_issue_count: issues.filter((entry) => entry.code.startsWith("B_LITERAL_WRONG_FACT_SUPPORT_")).length,
    legacy_review_surface: state.authority?.legacy_content_process_surface?.state,
    exact_package_file_count: Object.keys(exactPackage).length,
    side_effects: {
      playback_performed: false,
      media_written: false,
      external_call: false,
      dependency_install: false
    },
    issues
  };
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  if (issues.length > 0) process.exitCode = 1;
}

if (process.argv[2] !== "verify" || process.argv.length > 5) {
  process.stderr.write("Usage: node tools/fff-case-digest-production-state.mjs verify [state-json] [presentation-inventory-json]\n");
  process.exitCode = 64;
} else {
  verify(process.argv[3], process.argv[4]);
}
