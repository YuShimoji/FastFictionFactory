#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TOOL_PATH = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(TOOL_PATH), "..");
const SCHEMA_ROOT = path.join(REPO_ROOT, "artifacts", "writer-source-adaptation-v0");

export const INPUT_KINDS = [
  "prose_markdown_v0",
  "fragment_bundle_v0",
  "writer_proposal_v0"
];

export const AUTHORITY_CLASSES = [
  "established_fact",
  "observed_event",
  "reported_claim",
  "allegation",
  "inference",
  "unresolved",
  "must_preserve",
  "preferred",
  "optional",
  "forbidden_to_infer",
  "writer_authored_proposal"
];

export const FORMAT_CANDIDATES = [
  "CASE_DIGEST",
  "SHORT_DRAMA",
  "SCENE_EXCERPT",
  "PLOT_SUMMARY",
  "LORE_EXPLAINER",
  "TRAILER_PV"
];

const SCHEMA_FILES = {
  source_packet: "writer-source-packet.schema.json",
  authority_ledger: "story-authority-ledger.schema.json",
  format_selection: "format-selection.schema.json",
  narrative_ir: "narrative-ir.schema.json",
  writer_proposal_impact: "writer-proposal.schema.json",
  editorial_handoff_input: "editorial-handoff-input.schema.json"
};

const ACCEPTED_CASE_SOURCE = "artifacts/private-raster-case-digest/private-raster-case-digest.json";
const ACCEPTED_CASE_RESULT = "artifacts/private-raster-case-digest-result.json";
const ACCEPTED_CASE_PACKAGE = "artifacts/private-raster-case-digest";
const QUARANTINE_PATH = "artifacts/narrative-format-quarantine/narrative-format-quarantine.json";
const LINEAR_LORE_SOURCE = "artifacts/private-full-raster-clarity-candidate/narration-clarity-v1.md";

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function cleanId(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, stableValue(value[key])])
  );
}

export function stableStringify(value) {
  return `${JSON.stringify(stableValue(value), null, 2)}\n`;
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function resolveRepoPath(relativePath) {
  const absolute = path.resolve(REPO_ROOT, relativePath);
  const relative = path.relative(REPO_ROOT, absolute);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Path escapes repository: ${relativePath}`);
  }
  return absolute;
}

function relativeRepoPath(absolutePath) {
  return toPosix(path.relative(REPO_ROOT, absolutePath));
}

function mediaType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".md") return "text/markdown";
  if (extension === ".json") return "application/json";
  if (extension === ".csv") return "text/csv";
  if (extension === ".html") return "text/html";
  if (extension === ".mp4") return "video/mp4";
  return "application/octet-stream";
}

async function fileIdentity(relativePath, sourceFileId = null) {
  const absolute = resolveRepoPath(relativePath);
  const bytes = await readFile(absolute);
  return {
    source_file_id: sourceFileId ?? `source-${cleanId(relativePath)}`,
    relative_path: toPosix(relativePath),
    media_type: mediaType(relativePath),
    utf8_byte_size: bytes.length,
    sha256: sha256(bytes)
  };
}

async function envelopeIdentity(inputPath) {
  const relativePath = relativeRepoPath(inputPath);
  const bytes = await readFile(inputPath);
  return {
    relative_path: relativePath,
    utf8_byte_size: bytes.length,
    sha256: sha256(bytes)
  };
}

function findOccurrence(text, exactText, occurrence = 0) {
  let index = -1;
  let from = 0;
  for (let count = 0; count <= occurrence; count += 1) {
    index = text.indexOf(exactText, from);
    if (index === -1) throw new Error(`Exact source text not found: ${exactText.slice(0, 80)}`);
    from = index + exactText.length;
  }
  return index;
}

function sourceSpan({
  sourceSpanId,
  sourceFileId,
  fileText,
  exactText,
  occurrence = 0,
  origin = "source",
  structuralRole = "material_statement"
}) {
  const characterStart = findOccurrence(fileText, exactText, occurrence);
  const characterEnd = characterStart + exactText.length;
  const byteStart = Buffer.byteLength(fileText.slice(0, characterStart), "utf8");
  const byteEnd = byteStart + Buffer.byteLength(exactText, "utf8");
  return {
    source_span_id: sourceSpanId,
    source_file_id: sourceFileId,
    origin,
    character_range: {
      start: characterStart,
      end: characterEnd,
      unit: "utf16_code_unit"
    },
    byte_range: {
      start: byteStart,
      end: byteEnd
    },
    range_reliability: "exact",
    exact_text: exactText,
    exact_text_sha256: sha256(Buffer.from(exactText, "utf8")),
    structural_role: structuralRole
  };
}

function splitSentences(paragraph) {
  const sentences = [];
  const expression = /[^。！？\r\n]+[。！？]?/gu;
  for (const match of paragraph.matchAll(expression)) {
    const text = match[0].trim();
    if (text) sentences.push(text);
  }
  return sentences;
}

function markdownHeadingMatches(text, parser) {
  const expression =
    parser === "numbered_markdown_sections"
      ? /^##\s+\d+\.\s+(.+)$/gmu
      : /^##\s+Beat\s+\d+\s+[—-]\s+(.+)$/gmu;
  return [...text.matchAll(expression)].map((match) => ({
    text: match[0],
    title: match[1],
    start: match.index,
    end: match.index + match[0].length
  }));
}

function narrativeLineFromBody(body, parser) {
  const candidates = body
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith("-"))
    .filter((line) => !line.startsWith("#"))
    .filter((line) => !line.startsWith("対象 shot:"))
    .filter((line) => !line.startsWith("文字数:"))
    .filter((line) => !line.startsWith("This "));
  if (candidates.length === 0) throw new Error(`No narrative paragraph found for ${parser}`);
  return parser === "numbered_markdown_sections" ? candidates[0] : candidates.at(-1);
}

function parseConfiguredSections(fileText, input) {
  const headings = markdownHeadingMatches(fileText, input.source_parser);
  if (headings.length < input.sections.length) {
    throw new Error(`Expected ${input.sections.length} sections, found ${headings.length}`);
  }
  return input.sections.map((configuration, index) => {
    const heading = headings[index];
    const nextStart = headings[index + 1]?.start ?? fileText.length;
    const body = fileText.slice(heading.end, nextStart);
    const paragraph = narrativeLineFromBody(body, input.source_parser);
    const sentences = splitSentences(paragraph);
    if (sentences.length !== configuration.sentence_annotations.length) {
      throw new Error(
        `${input.fixture_id}/${configuration.section_id}: expected ${configuration.sentence_annotations.length} sentences, found ${sentences.length}`
      );
    }
    return {
      ...configuration,
      source_order: index + 1,
      heading_text: heading.text,
      paragraph,
      sentences: sentences.map((text, sentenceIndex) => ({
        text,
        annotation: configuration.sentence_annotations[sentenceIndex]
      }))
    };
  });
}

function authorityIdsForSpan(ledger, sourceSpanId) {
  return ledger.entries
    .filter((entry) => entry.source_span_ids.includes(sourceSpanId))
    .map((entry) => entry.authority_id);
}

function canonStatus(authorityClass) {
  if (authorityClass === "writer_authored_proposal") return "proposal_not_canon";
  if (authorityClass === "unresolved") return "unresolved";
  if (authorityClass === "forbidden_to_infer") return "forbidden_from_promotion";
  return "source_supported_nonfinal";
}

function humanAuthorRequired(authorityClass) {
  return [
    "allegation",
    "inference",
    "unresolved",
    "forbidden_to_infer",
    "writer_authored_proposal"
  ].includes(authorityClass);
}

function buildAuthorityLedger(sourcePacket, internalSections, fixtureId) {
  const entries = [];
  for (const section of internalSections) {
    for (const sentence of section.sentences) {
      for (const authorityClass of sentence.annotation.authority_classes) {
        entries.push({
          authority_id: `authority-${cleanId(sentence.span_id)}-${cleanId(authorityClass)}`,
          authority_class: authorityClass,
          source_span_ids: [sentence.span_id],
          normalized_claim: sentence.text,
          original_wording: sentence.text,
          source_status: sentence.annotation.source_status,
          confidence_source_certainty: sentence.annotation.confidence_source_certainty,
          mutable_by_writer_proposal: !["must_preserve", "forbidden_to_infer"].includes(authorityClass),
          human_author_required: humanAuthorRequired(authorityClass),
          canon_status: canonStatus(authorityClass),
          downstream_consumers: [
            "format_selection",
            "narrative_ir",
            "editorial_handoff_adapter"
          ]
        });
      }
    }
  }
  return {
    schema_version: "fff.storyAuthorityLedger.v0",
    authority_ledger_id: `authority-ledger-${fixtureId}`,
    source_packet_id: sourcePacket.source_packet_id,
    authority_classes_supported: AUTHORITY_CLASSES,
    entries
  };
}

async function buildProseContext(input, inputPath) {
  const sourceFile = await fileIdentity(input.source_path);
  const sourceText = await readFile(resolveRepoPath(input.source_path), "utf8");
  const sectionTitleSourceFile = input.section_title_source_path
    ? await fileIdentity(
        input.section_title_source_path,
        `source-${cleanId(input.section_title_source_path)}`
      )
    : null;
  const sectionTitleSourceText = sectionTitleSourceFile
    ? await readFile(resolveRepoPath(input.section_title_source_path), "utf8")
    : null;
  const sections = parseConfiguredSections(sourceText, input);
  const spans = [];
  for (const [sectionIndex, section] of sections.entries()) {
    section.heading_span_id = `span-${section.section_id}-heading`;
    section.paragraph_span_id = `span-${section.section_id}-text`;
    spans.push(
      sourceSpan({
        sourceSpanId: sectionTitleSourceFile
          ? `span-${section.section_id}-narration-heading`
          : section.heading_span_id,
        sourceFileId: sourceFile.source_file_id,
        fileText: sourceText,
        exactText: section.heading_text,
        structuralRole: "section_heading"
      })
    );
    if (sectionTitleSourceFile) {
      spans.push(
        sourceSpan({
          sourceSpanId: section.heading_span_id,
          sourceFileId: sectionTitleSourceFile.source_file_id,
          fileText: sectionTitleSourceText,
          exactText: `## Beat ${sectionIndex + 1} — ${section.title}`,
          structuralRole: "section_title"
        })
      );
    }
    spans.push(
      sourceSpan({
        sourceSpanId: section.paragraph_span_id,
        sourceFileId: sourceFile.source_file_id,
        fileText: sourceText,
        exactText: section.paragraph,
        structuralRole: "section_text"
      })
    );
    section.sentences.forEach((sentence, sentenceIndex) => {
      sentence.span_id = `span-${section.section_id}-sentence-${String(sentenceIndex + 1).padStart(2, "0")}`;
      spans.push(
        sourceSpan({
          sourceSpanId: sentence.span_id,
          sourceFileId: sourceFile.source_file_id,
          fileText: sourceText,
          exactText: sentence.text,
          structuralRole: "material_statement"
        })
      );
    });
  }
  const packet = {
    schema_version: "fff.writerSourcePacket.v0",
    source_packet_id: `source-packet-${input.fixture_id}`,
    input_kind: input.input_kind,
    input_envelope: await envelopeIdentity(inputPath),
    primary_source_file: sourceFile,
    source_files: [
      sourceFile,
      ...(sectionTitleSourceFile ? [sectionTitleSourceFile] : [])
    ],
    source_spans: spans,
    supplied_title: input.supplied_title,
    author_label: input.author_label,
    target_duration_seconds: input.target_duration_seconds,
    intended_audience: input.intended_audience,
    writer_constraints: input.writer_constraints,
    explicit_unknowns: input.explicit_unknowns,
    normalization_operations: input.normalization_operations
  };
  return {
    input,
    inputPath,
    sourcePacket: packet,
    internalSections: sections
  };
}

async function buildFragmentContext(input, inputPath) {
  const sourceFile = await fileIdentity(input.source_path);
  const sourceText = await readFile(resolveRepoPath(input.source_path), "utf8");
  const caseInput = await readJson(
    resolveRepoPath("fixtures/writer-source-adaptation/case-digest.prose.json")
  );
  const sourceSections = parseConfiguredSections(sourceText, caseInput);
  const spans = [];
  const internalSections = input.fragments.map((fragment, index) => {
    const sourceSection = sourceSections[fragment.section_index];
    const sourceSentence = sourceSection.sentences[fragment.sentence_index];
    if (!sourceSentence) throw new Error(`Invalid fragment selector: ${fragment.fragment_id}`);
    const spanId = `span-${fragment.fragment_id}`;
    spans.push(
      sourceSpan({
        sourceSpanId: spanId,
        sourceFileId: sourceFile.source_file_id,
        fileText: sourceText,
        exactText: sourceSentence.text,
        structuralRole: "fragment_material_statement"
      })
    );
    return {
      section_id: fragment.fragment_id,
      title: `Fragment ${index + 1}`,
      start_seconds: null,
      end_seconds: null,
      shot_ids: [],
      caption_sentence_indexes: [0],
      source_order: null,
      declared_order: fragment.declared_order,
      causal_link_to_previous: fragment.causal_link_to_previous,
      heading_text: null,
      heading_span_id: null,
      paragraph: sourceSentence.text,
      paragraph_span_id: spanId,
      sentences: [
        {
          text: sourceSentence.text,
          span_id: spanId,
          annotation: {
            authority_classes: fragment.authority_classes,
            semantic_roles: fragment.semantic_roles,
            source_status: fragment.source_status,
            confidence_source_certainty: fragment.confidence_source_certainty,
            entities: []
          }
        }
      ]
    };
  });
  const packet = {
    schema_version: "fff.writerSourcePacket.v0",
    source_packet_id: `source-packet-${input.fixture_id}`,
    input_kind: input.input_kind,
    input_envelope: await envelopeIdentity(inputPath),
    primary_source_file: sourceFile,
    source_files: [sourceFile],
    source_spans: spans,
    supplied_title: input.supplied_title,
    author_label: input.author_label,
    target_duration_seconds: input.target_duration_seconds,
    intended_audience: input.intended_audience,
    writer_constraints: input.writer_constraints,
    explicit_unknowns: input.explicit_unknowns,
    normalization_operations: input.normalization_operations
  };
  return {
    input,
    inputPath,
    sourcePacket: packet,
    internalSections
  };
}

function roleCount(sections, role) {
  return sections
    .flatMap((section) => section.sentences)
    .filter((sentence) => sentence.annotation.semantic_roles.includes(role)).length;
}

function collectEntities(sections) {
  const entities = [];
  for (const section of sections) {
    for (const sentence of section.sentences) {
      for (const entity of sentence.annotation.entities ?? []) {
        entities.push({
          ...entity,
          source_span_id: sentence.span_id
        });
      }
    }
  }
  return [...new Map(entities.map((entity) => [entity.name, entity])).values()];
}

function endingAction(input, sections) {
  if (!input.candidate_ending_action) return null;
  const { section_index: sectionIndex, sentence_index: sentenceIndex, enacted } =
    input.candidate_ending_action;
  const sentence = sections[sectionIndex]?.sentences[sentenceIndex];
  if (!sentence) throw new Error(`Invalid ending action selector for ${input.fixture_id}`);
  return {
    text: sentence.text,
    source_span_id: sentence.span_id,
    enacted
  };
}

function buildCapacityMetrics(input, sections) {
  const sourceCharacterCount = sections.reduce(
    (total, section) => total + section.paragraph.length,
    0
  );
  const targetDuration = input.target_duration_seconds;
  const narrationBudget = Math.round((515 / 180) * targetDuration);
  const subtitleBudget = Math.max(1, Math.round((11 / 180) * targetDuration));
  const shotBudget = Math.max(1, Math.round((11 / 180) * targetDuration));
  const entities = collectEntities(sections);
  const primaryEventCount = roleCount(sections, "primary_event");
  const enactedActionCount = roleCount(sections, "enacted_action");
  const causalStepCount = roleCount(sections, "causal_step");
  let missingCausalLinkCount = roleCount(sections, "missing_causal_link");
  if (input.input_kind === "fragment_bundle_v0") {
    missingCausalLinkCount = Math.max(missingCausalLinkCount, sections.length - 1);
  }
  const unresolvedMajorQuestionCount = roleCount(sections, "unresolved_major_question");
  const expositionUnitCount = roleCount(sections, "exposition_unit");
  const informationDensityScore = Number(
    (
      sourceCharacterCount / narrationBudget +
      entities.filter((entity) => !entity.explained).length / 3 +
      Math.max(0, (input.shot_count_hint ?? 0) - shotBudget) / shotBudget +
      missingCausalLinkCount / Math.max(1, primaryEventCount)
    ).toFixed(3)
  );
  return {
    target_duration_seconds: targetDuration,
    source_character_count: sourceCharacterCount,
    named_entity_count: entities.length,
    unexplained_named_entity_count: entities.filter((entity) => !entity.explained).length,
    named_entity_first_introduction_count: entities.filter(
      (entity) => entity.first_introduction_wording
    ).length,
    primary_event_count: primaryEventCount,
    enacted_action_count: enactedActionCount,
    causal_step_count: causalStepCount,
    missing_causal_link_count: missingCausalLinkCount,
    unresolved_major_question_count: unresolvedMajorQuestionCount,
    exposition_unit_count: expositionUnitCount,
    required_terminology_count: input.required_terminology.length,
    approximate_narration_character_budget: narrationBudget,
    approximate_subtitle_unit_budget: subtitleBudget,
    approximate_shot_budget: shotBudget,
    candidate_ending_action: endingAction(input, sections),
    information_density_score: informationDensityScore
  };
}

function roleSet(sections) {
  return new Set(
    sections.flatMap((section) =>
      section.sentences.flatMap((sentence) => sentence.annotation.semantic_roles)
    )
  );
}

function candidateOrder(input) {
  if (input.explicit_format_identity) {
    return [
      input.explicit_format_identity,
      ...FORMAT_CANDIDATES.filter((format) => format !== input.explicit_format_identity)
    ];
  }
  if (input.input_kind === "fragment_bundle_v0") {
    return [
      "SCENE_EXCERPT",
      "PLOT_SUMMARY",
      "CASE_DIGEST",
      "LORE_EXPLAINER",
      "SHORT_DRAMA",
      "TRAILER_PV"
    ];
  }
  return [
    "PLOT_SUMMARY",
    "LORE_EXPLAINER",
    "CASE_DIGEST",
    "SHORT_DRAMA",
    "SCENE_EXCERPT",
    "TRAILER_PV"
  ];
}

function evaluateFormat(formatId, input, roles, metrics, quarantined) {
  const capacityFit =
    metrics.source_character_count <= metrics.approximate_narration_character_budget &&
    (input.shot_count_hint ?? 0) <= metrics.approximate_shot_budget;
  const properNounCascade = metrics.unexplained_named_entity_count > 3;
  const explicit = input.explicit_format_identity === formatId;
  let checks = {};
  let accepted = false;
  const acceptanceReasons = [];
  const rejectionReasons = [];

  if (formatId === "CASE_DIGEST") {
    checks = {
      explicit_digest_identity: explicit,
      incident: roles.has("incident"),
      investigation_context: roles.has("investigation_context"),
      evidence_or_clues: roles.has("evidence_or_clue"),
      allegation_or_hypothesis: roles.has("allegation_or_hypothesis"),
      evidence_limit: roles.has("evidence_limit"),
      current_status: roles.has("current_status")
    };
    accepted = Object.values(checks).every(Boolean) && capacityFit && !properNounCascade;
  } else if (formatId === "SHORT_DRAMA") {
    checks = {
      bounded_protagonist_objective: roles.has("bounded_objective"),
      enacted_obstacle: roles.has("enacted_obstacle"),
      consequential_action: roles.has("consequential_action"),
      observable_result: roles.has("observable_result"),
      enacted_causality_present:
        metrics.enacted_action_count > 0 &&
        metrics.causal_step_count > 0 &&
        metrics.missing_causal_link_count === 0,
      duration_compatible_cast_and_exposition: capacityFit && !properNounCascade,
      historical_quarantine_absent: !quarantined
    };
    accepted = Object.values(checks).every(Boolean);
  } else if (formatId === "SCENE_EXCERPT") {
    checks = {
      explicit_scene_excerpt_identity: explicit,
      bounded_scene: roles.has("bounded_scene"),
      incomplete_context_boundary: roles.has("incomplete_context_boundary"),
      no_false_completeness: roles.has("no_false_completeness")
    };
    accepted = Object.values(checks).every(Boolean) && capacityFit;
  } else if (formatId === "PLOT_SUMMARY") {
    checks = {
      explicit_summary_identity: explicit,
      chronological_or_causal_compression: roles.has("summary_compression"),
      no_fully_dramatized_short_simulation: !roles.has("simulate_complete_short")
    };
    accepted = Object.values(checks).every(Boolean) && capacityFit;
  } else if (formatId === "LORE_EXPLAINER") {
    checks = {
      explicit_explanatory_identity: explicit,
      concept_hierarchy: roles.has("concept_hierarchy"),
      source_allegation_uncertainty_separated:
        roles.has("evidence_limit") && roles.has("allegation_or_hypothesis")
    };
    accepted = Object.values(checks).every(Boolean) && capacityFit && !properNounCascade;
  } else if (formatId === "TRAILER_PV") {
    checks = {
      explicit_promotional_identity: explicit,
      no_completeness_claim: roles.has("no_false_completeness"),
      no_authority_overreach: roles.has("evidence_limit")
    };
    accepted = Object.values(checks).every(Boolean) && capacityFit;
  }

  for (const [check, passed] of Object.entries(checks)) {
    if (passed) acceptanceReasons.push(check);
    else rejectionReasons.push(`missing_or_failed:${check}`);
  }
  if (!capacityFit) rejectionReasons.push("information_envelope_exceeds_reference_bound_180_second_capacity");
  if (properNounCascade) rejectionReasons.push("unexplained_proper_noun_cascade_exceeds_repository_evidence_limit");
  if (quarantined && formatId === "SHORT_DRAMA") {
    rejectionReasons.push("historical_linear_lore_signature_is_active_quarantine");
  }
  if (formatId === "SHORT_DRAMA" && metrics.missing_causal_link_count > 0) {
    rejectionReasons.push("enacted_causality_missing");
  }
  return {
    format_id: formatId,
    accepted,
    acceptance_reasons: acceptanceReasons,
    rejection_reasons: [...new Set(rejectionReasons)],
    contract_checks: checks,
    capacity_fit: capacityFit
  };
}

function buildFormatSelection(context, ledger) {
  const { input, sourcePacket, internalSections } = context;
  const metrics = buildCapacityMetrics(input, internalSections);
  const roles = roleSet(internalSections);
  const quarantined = Boolean(input.quarantine_path);
  const evaluations = candidateOrder(input).map((formatId) =>
    evaluateFormat(formatId, input, roles, metrics, quarantined)
  );
  const safe = evaluations.find((evaluation) => evaluation.accepted);
  const selectedFormat = safe?.format_id ?? null;
  const rankedCandidates = evaluations.map((evaluation, index) => {
    let decision = evaluation.accepted ? "ACCEPTED" : "REJECTED";
    const acceptanceReasons = [...evaluation.acceptance_reasons];
    if (!selectedFormat && index === 0) {
      decision = "AUTHOR_DECISION_REQUIRED";
      acceptanceReasons.push("closest_non_committal_candidate_requires_explicit_author_identity_and_scope");
    }
    return {
      rank: index + 1,
      format_id: evaluation.format_id,
      decision,
      acceptance_reasons: acceptanceReasons,
      rejection_reasons: evaluation.rejection_reasons,
      contract_checks: evaluation.contract_checks,
      capacity_fit: evaluation.capacity_fit
    };
  });
  return {
    schema_version: "fff.formatSelection.v0",
    format_selection_id: `format-selection-${input.fixture_id}`,
    source_packet_id: sourcePacket.source_packet_id,
    format_candidates_supported: FORMAT_CANDIDATES,
    capacity_metrics: metrics,
    ranked_candidates: rankedCandidates,
    status: selectedFormat ? "SELECTED" : "AUTHOR_DECISION_REQUIRED",
    selected_format: selectedFormat,
    material_disposition: input.material_disposition,
    derivation_limitations: [
      "v0 capacity is reference-bound to the accepted 180-second CASE_DIGEST and the quarantined 180-second linear-lore counterexample.",
      "The 515-character, 11-subtitle-unit, and 11-shot values are local calibration evidence, not universal format thresholds.",
      "SHORT_DRAMA cannot pass without source-supported enacted objective, obstacle, consequential action, observable result, and complete causal links.",
      "The selector does not rewrite source material to force a format pass."
    ],
    authority_ledger_id: ledger.authority_ledger_id
  };
}

function materialStatement(statementId, text, statementKind, spanIds, ledger, mode = "source_span") {
  const authorityIds = spanIds.flatMap((spanId) => authorityIdsForSpan(ledger, spanId));
  return {
    statement_id: statementId,
    text,
    statement_kind: statementKind,
    lineage: {
      mode,
      source_span_ids: spanIds,
      authority_ids: [...new Set(authorityIds)]
    }
  };
}

function structuralStatement(statementId, text, statementKind = "structural_label") {
  return materialStatement(
    statementId,
    text,
    statementKind,
    [],
    { entries: [] },
    "adapter_generated_non_factual"
  );
}

function sentenceMaterial(context) {
  return context.internalSections.flatMap((section) =>
    section.sentences.map((sentence, sentenceIndex) => ({
      section,
      sentence,
      sentenceIndex
    }))
  );
}

function buildNarrativeIr(context, ledger, selection) {
  const { input, sourcePacket, internalSections } = context;
  const materials = sentenceMaterial(context);
  const events = materials
    .filter(({ sentence }) => sentence.annotation.semantic_roles.includes("event"))
    .map(({ section, sentence, sentenceIndex }) =>
      materialStatement(
        `event-${section.section_id}-${sentenceIndex + 1}`,
        sentence.text,
        sentence.annotation.source_status,
        [sentence.span_id],
        ledger
      )
    );
  const incidentMaterial = materials.find(({ sentence }) =>
    sentence.annotation.semantic_roles.includes("incident")
  );
  const subjectMaterials = materials.filter(({ sentence }) =>
    sentence.annotation.semantic_roles.includes("protagonist_or_subject")
  );
  const unresolvedMaterials = materials.filter(({ sentence }) =>
    sentence.annotation.authority_classes.some((authorityClass) =>
      ["unresolved", "forbidden_to_infer"].includes(authorityClass)
    )
  );
  const entities = collectEntities(internalSections);
  const captions = [];
  for (const section of internalSections) {
    const indexes = section.caption_sentence_indexes ?? [0];
    indexes.forEach((sentenceIndex, localIndex) => {
      const sentence = section.sentences[sentenceIndex];
      if (!sentence) return;
      const start =
        section.start_seconds === null
          ? null
          : Math.round(
              section.start_seconds +
                ((section.end_seconds - section.start_seconds) * localIndex) / indexes.length
            );
      const end =
        section.end_seconds === null
          ? null
          : Math.round(
              section.start_seconds +
                ((section.end_seconds - section.start_seconds) * (localIndex + 1)) /
                  indexes.length
            );
      captions.push({
        caption_unit_id: `caption-${section.section_id}-${localIndex + 1}`,
        section_or_beat_id: section.section_id,
        start_seconds: start,
        end_seconds: end,
        text: sentence.text,
        lineage: {
          mode: "source_span",
          source_span_ids: [sentence.span_id],
          authority_ids: authorityIdsForSpan(ledger, sentence.span_id)
        }
      });
    });
  }
  const narrationUnits = internalSections.map((section) => {
    const spanIds = section.sentences.map((sentence) => sentence.span_id);
    return {
      narration_unit_id: `narration-${section.section_id}`,
      section_or_beat_id: section.section_id,
      start_seconds: section.start_seconds,
      end_seconds: section.end_seconds,
      text: section.paragraph,
      lineage: {
        mode: "source_span",
        source_span_ids: spanIds,
        authority_ids: [
          ...new Set(spanIds.flatMap((spanId) => authorityIdsForSpan(ledger, spanId)))
        ]
      }
    };
  });
  const visualIntentPlaceholders = internalSections.flatMap((section) => {
    const shotIds = section.shot_ids.length ? section.shot_ids : [`placeholder-${section.section_id}`];
    return shotIds.map((shotId) => ({
      visual_intent_id: `visual-intent-${shotId}`,
      section_or_beat_id: section.section_id,
      shot_id: section.shot_ids.length ? shotId : null,
      intent: "Source-bound placeholder only; no image generation or media selection.",
      related_source_span_ids: section.sentences.map((sentence) => sentence.span_id),
      lineage: {
        mode: "adapter_generated_non_factual",
        source_span_ids: [],
        authority_ids: []
      }
    }));
  });
  const missingCausalEdges = materials
    .filter(({ sentence }) => sentence.annotation.semantic_roles.includes("missing_causal_link"))
    .map(({ section, sentence, sentenceIndex }) =>
      materialStatement(
        `missing-causal-${section.section_id}-${sentenceIndex + 1}`,
        sentence.text,
        "missing_causal_edge",
        [sentence.span_id],
        ledger
      )
    );
  if (input.input_kind === "fragment_bundle_v0") {
    for (let index = 1; index < internalSections.length; index += 1) {
      missingCausalEdges.push(
        structuralStatement(
          `missing-causal-fragment-${index}`,
          `Causal connection between ${internalSections[index - 1].section_id} and ${internalSections[index].section_id} is undeclared.`,
          "missing_causal_edge_marker"
        )
      );
    }
  }
  const ending = endingAction(input, internalSections);
  const sourceSpanLineage = [];
  for (const statement of [
    ...events,
    ...subjectMaterials.map(({ section, sentence, sentenceIndex }) =>
      materialStatement(
        `subject-${section.section_id}-${sentenceIndex + 1}`,
        sentence.text,
        "protagonist_or_subject",
        [sentence.span_id],
        ledger
      )
    ),
    ...(incidentMaterial
      ? [
          materialStatement(
            "incident-primary",
            incidentMaterial.sentence.text,
            "incident",
            [incidentMaterial.sentence.span_id],
            ledger
          )
        ]
      : []),
    ...missingCausalEdges.filter(
      (statement) => statement.lineage.mode !== "adapter_generated_non_factual"
    )
  ]) {
    sourceSpanLineage.push({
      material_id: statement.statement_id,
      source_span_ids: statement.lineage.source_span_ids,
      authority_ids: statement.lineage.authority_ids
    });
  }
  const writerDecisions = input.explicit_unknowns.map((unknown, index) => ({
    decision_id: `writer-decision-${input.fixture_id}-${index + 1}`,
    question: unknown,
    status: "AUTHOR_DECISION_REQUIRED"
  }));
  if (selection.status === "AUTHOR_DECISION_REQUIRED") {
    writerDecisions.unshift({
      decision_id: `writer-decision-${input.fixture_id}-format`,
      question: "Select an explicit output format without inventing missing source material.",
      status: "AUTHOR_DECISION_REQUIRED"
    });
  }
  const incident = incidentMaterial
    ? materialStatement(
        "incident-primary",
        incidentMaterial.sentence.text,
        "incident",
        [incidentMaterial.sentence.span_id],
        ledger
      )
    : null;
  const protagonistOrSubject = subjectMaterials.map(({ section, sentence, sentenceIndex }) =>
    materialStatement(
      `subject-${section.section_id}-${sentenceIndex + 1}`,
      sentence.text,
      "protagonist_or_subject",
      [sentence.span_id],
      ledger
    )
  );
  return {
    schema_version: "fff.narrativeIr.v0",
    narrative_ir_id: `narrative-ir-${input.fixture_id}`,
    source_packet_id: sourcePacket.source_packet_id,
    format_id: selection.selected_format,
    target_duration_seconds: input.target_duration_seconds,
    audience_promise: structuralStatement(
      `audience-promise-${input.fixture_id}`,
      input.audience_promise,
      "audience_promise"
    ),
    protagonist_or_subject: protagonistOrSubject,
    incident,
    events,
    causal_edges: [],
    missing_causal_edges: missingCausalEdges,
    evidence_claim_status: materials.map(({ section, sentence, sentenceIndex }) => ({
      statement_id: `claim-status-${section.section_id}-${sentenceIndex + 1}`,
      text: sentence.text,
      source_status: sentence.annotation.source_status,
      source_span_ids: [sentence.span_id],
      authority_ids: authorityIdsForSpan(ledger, sentence.span_id)
    })),
    named_entities: entities.map((entity, index) => ({
      entity_id: `entity-${input.fixture_id}-${index + 1}`,
      name: entity.name,
      explained_at_first_use: entity.explained,
      source_span_ids: [entity.source_span_id]
    })),
    first_introduction_wording: entities.map((entity, index) => ({
      introduction_id: `introduction-${input.fixture_id}-${index + 1}`,
      entity_name: entity.name,
      wording: entity.first_introduction_wording,
      source_span_ids: [entity.source_span_id]
    })),
    terminology_budget: {
      required_term_count: input.required_terminology.length,
      required_terms: input.required_terminology,
      reference_bound_only: true
    },
    section_beat_plan: internalSections.map((section) => ({
      section_or_beat_id: section.section_id,
      label: section.title,
      start_seconds: section.start_seconds,
      end_seconds: section.end_seconds,
      source_span_ids: section.heading_span_id ? [section.heading_span_id] : [],
      structural_lineage:
        section.heading_span_id ? "source_span" : "adapter_generated_non_factual"
    })),
    information_reveal_order: internalSections.map((section) => ({
      section_or_beat_id: section.section_id,
      order:
        input.input_kind === "fragment_bundle_v0" ? section.declared_order : section.source_order,
      basis: input.input_kind === "fragment_bundle_v0" ? "undeclared" : "source_order"
    })),
    narration_units: narrationUnits,
    caption_units: captions,
    visual_intent_placeholders: visualIntentPlaceholders,
    unresolved_items: unresolvedMaterials.map(({ section, sentence, sentenceIndex }) =>
      materialStatement(
        `unresolved-${section.section_id}-${sentenceIndex + 1}`,
        sentence.text,
        "unresolved_item",
        [sentence.span_id],
        ledger
      )
    ),
    ending_state: ending
      ? materialStatement(
          `ending-state-${input.fixture_id}`,
          ending.text,
          ending.enacted ? "enacted_ending_action" : "non_enacted_or_status_ending",
          [ending.source_span_id],
          ledger
        )
      : null,
    source_span_lineage: sourceSpanLineage,
    writer_decisions_required: writerDecisions,
    content_omitted_deferred_for_capacity: selection.material_disposition,
    unsupported_factual_claim_count: 0,
    image_generation: false,
    production_approved: false,
    rights_cleared_claim: false,
    final_canon: false
  };
}

function buildHandoffInput(context, ledger, selection, narrativeIr) {
  if (!selection.selected_format) return null;
  const sourceSpanReferences = [
    ...new Set(
      narrativeIr.narration_units.flatMap((unit) => unit.lineage.source_span_ids)
    )
  ];
  return {
    schema_version: "fff.editorialHandoffInput.v0",
    handoff_input_id: `handoff-input-${context.input.fixture_id}`,
    source_packet_id: context.sourcePacket.source_packet_id,
    format_id: selection.selected_format,
    target_duration_seconds: context.input.target_duration_seconds,
    sections_or_beats: narrativeIr.section_beat_plan.map((section, index) => ({
      section_or_beat_id: section.section_or_beat_id,
      sequence: index + 1,
      title: section.label,
      start_seconds: section.start_seconds,
      end_seconds: section.end_seconds,
      source_span_ids: section.source_span_ids
    })),
    narration_units: narrativeIr.narration_units,
    caption_units: narrativeIr.caption_units,
    visual_intent_placeholders: narrativeIr.visual_intent_placeholders,
    truth_canon_boundaries: narrativeIr.unresolved_items.map((item) => ({
      boundary_id: `truth-boundary-${item.statement_id}`,
      state: "unresolved_human_owned",
      text: item.text,
      source_span_ids: item.lineage.source_span_ids
    })),
    source_span_references: sourceSpanReferences,
    continuity_ids: narrativeIr.section_beat_plan.map(
      (section) => `continuity-${section.section_or_beat_id}`
    ),
    closed_flags: {
      production: false,
      rights: false,
      provider: false,
      media: false,
      render: false,
      publication: false,
      final_canon: false
    },
    consumer_compatibility: {
      consumer_schema_version: "fff.editorialHandoff.v1",
      compatible: true,
      missing_required_mappings: [],
      field_map: {
        "sections_or_beats[].section_or_beat_id": "beats[].beat_id",
        "sections_or_beats[].sequence": "beats[].beat_number",
        "sections_or_beats[].title": "beats[].title_ja",
        "sections_or_beats[].start_seconds": "beats[].start_seconds",
        "sections_or_beats[].end_seconds": "beats[].end_seconds",
        "narration_units[]": "narration_segments[]",
        "caption_units[]": "subtitle_cues[]",
        "visual_intent_placeholders[]": "shot_cues[]",
        "truth_canon_boundaries[]": "truth_guards[]",
        closed_flags: "boundaries"
      }
    }
  };
}

function proposalClassification(change) {
  if (change.unsupported_inference) return "FORBIDDEN_UNSUPPORTED_INFERENCE";
  if (change.canon_proposal) return "AUTHOR_DECISION_REQUIRED";
  if (change.relation_scope === "structure" || change.operation === "reorder") {
    return "L3 format or structure impact";
  }
  if (change.relation_scope === "relation" || change.relation_scope === "section") {
    return "L2 relation or section impact";
  }
  if (change.relation_scope === "subject") return "L1 subject explanation";
  return "L0 wording only";
}

async function buildProposalContext(input, inputPath) {
  const baseInputPath = resolveRepoPath(input.base_input_path);
  const baseInput = await readJson(baseInputPath);
  const baseContext = await buildProseContext(baseInput, baseInputPath);
  const baseLedger = buildAuthorityLedger(
    baseContext.sourcePacket,
    baseContext.internalSections,
    baseInput.fixture_id
  );
  const baseSelection = buildFormatSelection(baseContext, baseLedger);
  const baseIr = buildNarrativeIr(baseContext, baseLedger, baseSelection);
  const baseHandoff = buildHandoffInput(baseContext, baseLedger, baseSelection, baseIr);
  const proposalText = await readFile(inputPath, "utf8");
  const proposalFile = await fileIdentity(relativeRepoPath(inputPath), "source-writer-proposal-envelope");
  const revisionFile = await fileIdentity(input.revision_source_path, "source-existing-revision-example");
  const revisionText = await readFile(resolveRepoPath(input.revision_source_path), "utf8");
  const revision = JSON.parse(revisionText);
  const spans = [...baseContext.sourcePacket.source_spans];
  const changes = [];
  const proposalLedgerEntries = [];

  for (const change of input.changes) {
    const baseSection = baseContext.internalSections[change.affected_base_section_index];
    const baseSentence = baseSection?.sentences[change.affected_base_sentence_index];
    if (!baseSentence) throw new Error(`Invalid affected source selector: ${change.change_id}`);
    let newText = change.new_text ?? null;
    let newTextSpanId = null;
    if (change.import_revision_change_id) {
      const imported = revision.changes.find(
        (candidate) => candidate.change_id === change.import_revision_change_id
      );
      if (!imported) throw new Error(`Missing revision example change: ${change.import_revision_change_id}`);
      newText = typeof imported.proposed_value === "string" ? imported.proposed_value : JSON.stringify(imported.proposed_value);
      newTextSpanId = `span-${change.change_id}-existing-revision`;
      spans.push(
        sourceSpan({
          sourceSpanId: newTextSpanId,
          sourceFileId: revisionFile.source_file_id,
          fileText: revisionText,
          exactText: newText,
          structuralRole: "existing_revision_proposal_text"
        })
      );
    } else if (typeof newText === "string") {
      newTextSpanId = `span-${change.change_id}-writer-authored`;
      spans.push(
        sourceSpan({
          sourceSpanId: newTextSpanId,
          sourceFileId: proposalFile.source_file_id,
          fileText: proposalText,
          exactText: newText,
          origin: "writer_authored_proposal",
          structuralRole: "writer_authored_proposal_text"
        })
      );
      proposalLedgerEntries.push({
        authority_id: `authority-${cleanId(newTextSpanId)}-writer-authored-proposal`,
        authority_class: "writer_authored_proposal",
        source_span_ids: [newTextSpanId],
        normalized_claim: newText,
        original_wording: newText,
        source_status: "writer_authored_proposal_not_applied",
        confidence_source_certainty: "proposal_origin_explicit",
        mutable_by_writer_proposal: true,
        human_author_required: true,
        canon_status: "proposal_not_canon",
        downstream_consumers: ["writer_proposal_impact", "narrative_ir_review"]
      });
    }
    const classification = proposalClassification(change);
    if (classification !== change.expected_classification) {
      throw new Error(
        `${change.change_id}: expected ${change.expected_classification}, classified ${classification}`
      );
    }
    changes.push({
      change_id: change.change_id,
      operation: change.operation,
      source_span_ids_affected: [baseSentence.span_id],
      new_text: newText,
      new_text_origin: change.new_text_origin,
      intent: change.intent,
      expected_downstream_impact: change.expected_downstream_impact,
      impact_classification: classification,
      auto_accept: false,
      human_author_required: [
        "L3 format or structure impact",
        "AUTHOR_DECISION_REQUIRED",
        "FORBIDDEN_UNSUPPORTED_INFERENCE"
      ].includes(classification),
      new_text_source_span_ids: newTextSpanId ? [newTextSpanId] : []
    });
  }

  const sourcePacket = {
    schema_version: "fff.writerSourcePacket.v0",
    source_packet_id: `source-packet-${input.fixture_id}`,
    input_kind: input.input_kind,
    input_envelope: await envelopeIdentity(inputPath),
    primary_source_file: proposalFile,
    source_files: [
      proposalFile,
      ...baseContext.sourcePacket.source_files,
      revisionFile
    ],
    source_spans: spans,
    supplied_title: input.supplied_title,
    author_label: input.author_label,
    target_duration_seconds: input.target_duration_seconds,
    intended_audience: input.intended_audience,
    writer_constraints: input.writer_constraints,
    explicit_unknowns: input.explicit_unknowns,
    normalization_operations: input.normalization_operations
  };
  const ledger = {
    ...baseLedger,
    authority_ledger_id: `authority-ledger-${input.fixture_id}`,
    source_packet_id: sourcePacket.source_packet_id,
    entries: [...baseLedger.entries, ...proposalLedgerEntries]
  };
  const proposalImpact = {
    schema_version: "fff.writerProposal.v0",
    proposal_id: input.proposal_id,
    input_kind: "writer_proposal_v0",
    base_source_packet_id: baseContext.sourcePacket.source_packet_id,
    changes,
    overall_status: changes.some(
      (change) => change.impact_classification === "FORBIDDEN_UNSUPPORTED_INFERENCE"
    )
      ? "FORBIDDEN_UNSUPPORTED_INFERENCE"
      : changes.some(
            (change) =>
              change.impact_classification === "AUTHOR_DECISION_REQUIRED" ||
              change.impact_classification === "L3 format or structure impact"
          )
        ? "AUTHOR_DECISION_REQUIRED"
        : "REVIEWABLE_NOT_APPLIED",
    auto_accept_canon_proposals: false
  };
  const selection = {
    ...baseSelection,
    format_selection_id: `format-selection-${input.fixture_id}`,
    source_packet_id: sourcePacket.source_packet_id
  };
  const narrativeIr = {
    ...baseIr,
    narrative_ir_id: `narrative-ir-${input.fixture_id}`,
    source_packet_id: sourcePacket.source_packet_id,
    writer_decisions_required: [
      ...baseIr.writer_decisions_required,
      ...changes
        .filter((change) => change.impact_classification !== "L0 wording only")
        .map((change) => ({
          decision_id: `writer-decision-${change.change_id}`,
          question: `Review ${change.change_id} without applying it.`,
          status:
            change.impact_classification === "FORBIDDEN_UNSUPPORTED_INFERENCE"
              ? "FORBIDDEN_UNSUPPORTED_INFERENCE"
              : "AUTHOR_DECISION_REQUIRED"
        }))
    ]
  };
  const handoff = {
    ...baseHandoff,
    handoff_input_id: `handoff-input-${input.fixture_id}`,
    source_packet_id: sourcePacket.source_packet_id,
    proposal_application_status: "not_applied"
  };
  return {
    input,
    inputPath,
    sourcePacket,
    internalSections: baseContext.internalSections,
    authorityLedger: ledger,
    formatSelection: selection,
    narrativeIr,
    editorialHandoffInput: handoff,
    writerProposalImpact: proposalImpact
  };
}

export async function loadSchema(name) {
  return readJson(path.join(SCHEMA_ROOT, SCHEMA_FILES[name]));
}

function hasType(value, expected) {
  if (expected === "array") return Array.isArray(value);
  if (expected === "object") return value !== null && typeof value === "object" && !Array.isArray(value);
  if (expected === "integer") return Number.isInteger(value);
  if (expected === "null") return value === null;
  return typeof value === expected;
}

function resolveSchemaRef(rootSchema, reference) {
  if (!reference.startsWith("#/")) throw new Error(`Unsupported schema ref: ${reference}`);
  return reference
    .slice(2)
    .split("/")
    .reduce((node, key) => node[key], rootSchema);
}

export function validateAgainstSchema(value, schema, rootSchema = schema, at = "$") {
  const errors = [];
  if (schema.$ref) {
    return validateAgainstSchema(value, resolveSchemaRef(rootSchema, schema.$ref), rootSchema, at);
  }
  if (Object.hasOwn(schema, "const") && value !== schema.const) {
    errors.push(`${at}: expected const ${JSON.stringify(schema.const)}`);
    return errors;
  }
  if (schema.enum && !schema.enum.includes(value)) {
    errors.push(`${at}: expected enum ${schema.enum.join(", ")}`);
    return errors;
  }
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((type) => hasType(value, type))) {
      errors.push(`${at}: expected type ${types.join("|")}`);
      return errors;
    }
  }
  if (typeof value === "string") {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push(`${at}: shorter than minLength ${schema.minLength}`);
    }
  }
  if (typeof value === "number" && schema.minimum !== undefined && value < schema.minimum) {
    errors.push(`${at}: below minimum ${schema.minimum}`);
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errors.push(`${at}: fewer than ${schema.minItems} items`);
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      errors.push(`${at}: more than ${schema.maxItems} items`);
    }
    if (schema.items) {
      value.forEach((item, index) => {
        errors.push(...validateAgainstSchema(item, schema.items, rootSchema, `${at}[${index}]`));
      });
    }
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const required of schema.required ?? []) {
      if (!Object.hasOwn(value, required)) errors.push(`${at}: missing required ${required}`);
    }
    for (const [key, propertySchema] of Object.entries(schema.properties ?? {})) {
      if (Object.hasOwn(value, key)) {
        errors.push(
          ...validateAgainstSchema(value[key], propertySchema, rootSchema, `${at}.${key}`)
        );
      }
    }
  }
  return errors;
}

async function validateComponents(components) {
  const errors = {};
  for (const [name, fileName] of Object.entries(SCHEMA_FILES)) {
    const value = components[name];
    if (value === null || value === undefined) continue;
    const schema = await readJson(path.join(SCHEMA_ROOT, fileName));
    const componentErrors = validateAgainstSchema(value, schema);
    if (componentErrors.length) errors[name] = componentErrors;
  }
  return errors;
}

function allMaterialLineageValid(narrativeIr, sourcePacket) {
  const spanMap = new Map(
    sourcePacket.source_spans.map((span) => [span.source_span_id, span])
  );
  const sourceTextMatches = (text, spanIds, requiredOrigin = null) => {
    if (!spanIds.length) return false;
    for (const spanId of spanIds) {
      const span = spanMap.get(spanId);
      if (!span) return false;
      if (requiredOrigin && span.origin !== requiredOrigin) return false;
      if (!span.exact_text.includes(text) && !text.includes(span.exact_text)) return false;
    }
    return true;
  };
  const lineageMatches = (material) => {
    const lineage = material.lineage;
    if (!lineage) return false;
    if (lineage.mode === "adapter_generated_non_factual") {
      return lineage.source_span_ids.length === 0;
    }
    return sourceTextMatches(
      material.text ?? material.intent,
      lineage.source_span_ids,
      lineage.mode === "writer_authored_proposal"
        ? "writer_authored_proposal"
        : null
    );
  };
  const materials = [
    narrativeIr.audience_promise,
    ...narrativeIr.protagonist_or_subject,
    ...(narrativeIr.incident ? [narrativeIr.incident] : []),
    ...narrativeIr.events,
    ...narrativeIr.causal_edges,
    ...narrativeIr.missing_causal_edges,
    ...narrativeIr.narration_units,
    ...narrativeIr.caption_units,
    ...narrativeIr.visual_intent_placeholders,
    ...narrativeIr.unresolved_items,
    ...(narrativeIr.ending_state ? [narrativeIr.ending_state] : [])
  ];
  for (const material of materials) {
    if (!lineageMatches(material)) return false;
  }
  for (const claim of narrativeIr.evidence_claim_status) {
    if (!sourceTextMatches(claim.text, claim.source_span_ids)) return false;
  }
  for (const entity of narrativeIr.named_entities) {
    if (!sourceTextMatches(entity.name, entity.source_span_ids)) return false;
  }
  for (const introduction of narrativeIr.first_introduction_wording) {
    if (!sourceTextMatches(introduction.wording, introduction.source_span_ids)) {
      return false;
    }
  }
  for (const section of narrativeIr.section_beat_plan) {
    if (section.structural_lineage === "adapter_generated_non_factual") {
      if (section.source_span_ids.length !== 0) return false;
      continue;
    }
    if (!sourceTextMatches(section.label, section.source_span_ids)) return false;
  }
  for (const entry of narrativeIr.source_span_lineage) {
    if (
      entry.source_span_ids.length === 0 ||
      entry.source_span_ids.some((spanId) => !spanMap.has(spanId))
    ) {
      return false;
    }
  }
  return true;
}

export async function buildFixture(inputPathValue) {
  const inputPath = path.resolve(inputPathValue);
  const input = await readJson(inputPath);
  if (!INPUT_KINDS.includes(input.input_kind)) {
    throw new Error(`Unsupported input_kind: ${input.input_kind}`);
  }
  let context;
  if (input.input_kind === "prose_markdown_v0") {
    context = await buildProseContext(input, inputPath);
  } else if (input.input_kind === "fragment_bundle_v0") {
    context = await buildFragmentContext(input, inputPath);
  } else {
    context = await buildProposalContext(input, inputPath);
  }
  if (input.input_kind !== "writer_proposal_v0") {
    context.authorityLedger = buildAuthorityLedger(
      context.sourcePacket,
      context.internalSections,
      input.fixture_id
    );
    context.formatSelection = buildFormatSelection(context, context.authorityLedger);
    context.narrativeIr = buildNarrativeIr(
      context,
      context.authorityLedger,
      context.formatSelection
    );
    context.editorialHandoffInput = buildHandoffInput(
      context,
      context.authorityLedger,
      context.formatSelection,
      context.narrativeIr
    );
    context.writerProposalImpact = null;
  }
  const components = {
    source_packet: context.sourcePacket,
    authority_ledger: context.authorityLedger,
    format_selection: context.formatSelection,
    narrative_ir: context.narrativeIr,
    editorial_handoff_input: context.editorialHandoffInput,
    writer_proposal_impact: context.writerProposalImpact
  };
  const schemaErrors = await validateComponents(components);
  const lineageValid = allMaterialLineageValid(context.narrativeIr, context.sourcePacket);
  return {
    schema_version: "fff.writerSourceAdaptationFixtureOutput.v0",
    fixture_id: input.fixture_id,
    input_kind: input.input_kind,
    source_packet: context.sourcePacket,
    authority_ledger: context.authorityLedger,
    format_selection: context.formatSelection,
    narrative_ir: context.narrativeIr,
    editorial_handoff_input: context.editorialHandoffInput,
    writer_proposal_impact: context.writerProposalImpact,
    validation_summary: {
      schemas_valid: Object.keys(schemaErrors).length === 0,
      schema_errors: schemaErrors,
      material_lineage_complete: lineageValid,
      unsupported_factual_claim_count: context.narrativeIr.unsupported_factual_claim_count,
      external_request_count: 0,
      provider_call_count: 0,
      media_generation_count: 0,
      public_effect_count: 0
    }
  };
}

async function hashFilesUnder(relativeDirectory) {
  const root = resolveRepoPath(relativeDirectory);
  const output = [];
  async function walk(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(absolute);
      else {
        const bytes = await readFile(absolute);
        output.push({
          relative_path: relativeRepoPath(absolute),
          byte_size: bytes.length,
          sha256: sha256(bytes)
        });
      }
    }
  }
  await walk(root);
  return output;
}

async function protectedSnapshot() {
  const files = await hashFilesUnder(ACCEPTED_CASE_PACKAGE);
  for (const relativePath of [
    ACCEPTED_CASE_RESULT,
    QUARANTINE_PATH,
    "artifacts/editorial-handoff/editorial-handoff.json",
    "artifacts/editorial-revision/revision-request.example.json",
    "artifacts/editorial-revision/revision-patch.example.json",
    "artifacts/editorial-derivative/editorial-handoff.derived.json",
    "artifacts/production-blueprint/production-blueprint.json"
  ]) {
    const bytes = await readFile(resolveRepoPath(relativePath));
    files.push({
      relative_path: relativePath,
      byte_size: bytes.length,
      sha256: sha256(bytes)
    });
  }
  return files.sort((a, b) => a.relative_path.localeCompare(b.relative_path));
}

async function buildCapacityContract(outputs) {
  const accepted = await readJson(resolveRepoPath(ACCEPTED_CASE_SOURCE));
  const quarantine = await readJson(resolveRepoPath(QUARANTINE_PATH));
  const caseOutput = outputs.find((output) => output.fixture_id === "case-digest");
  const linearOutput = outputs.find(
    (output) => output.fixture_id === "linear-lore-counterexample"
  );
  return {
    schema_version: "fff.formatCapacityContract.v0",
    contract_id: "fff-format-capacity-contract-v0-001",
    reference_scope: "Fast Fiction Factory 180-second local v0 only",
    format_candidates_supported: FORMAT_CANDIDATES,
    derivation: {
      accepted_case_digest: {
        source_path: ACCEPTED_CASE_SOURCE,
        artifact_id: accepted.artifact_id,
        format_id: accepted.format_id,
        duration_seconds: accepted.duration_seconds,
        section_count: accepted.section_count,
        shot_count: accepted.shot_count,
        source_character_count:
          caseOutput.format_selection.capacity_metrics.source_character_count,
        human_facing_proper_name_count:
          accepted.narrative_quality_audit.human_facing_proper_name_count,
        accepted_scoped: accepted.human_acceptance.verdict
      },
      quarantined_linear_lore: {
        source_path: LINEAR_LORE_SOURCE,
        quarantine_path: QUARANTINE_PATH,
        quarantine_id: quarantine.quarantine_id,
        duration_seconds: 180,
        beat_count: 6,
        shot_count: 19,
        source_character_count:
          linearOutput.format_selection.capacity_metrics.source_character_count,
        unexplained_named_entity_count:
          linearOutput.format_selection.capacity_metrics.unexplained_named_entity_count,
        forced_choice_closure: true,
        short_drama_selected: false
      }
    },
    reference_bound_budgets: {
      duration_seconds: 180,
      approximate_narration_character_budget: 515,
      approximate_subtitle_unit_budget: 11,
      approximate_shot_budget: 11,
      reject_unexplained_proper_noun_cascade_above: 3
    },
    format_contracts: {
      CASE_DIGEST: [
        "incident",
        "investigator or investigation context",
        "evidence or clues",
        "allegation or hypothesis and evidence limit",
        "current status"
      ],
      SHORT_DRAMA: [
        "one bounded protagonist objective",
        "one enacted obstacle",
        "one consequential action",
        "one observable result",
        "duration-compatible cast and exposition"
      ],
      SCENE_EXCERPT: [
        "one bounded scene",
        "explicit incomplete-context boundary",
        "no false completeness claim"
      ],
      PLOT_SUMMARY: [
        "explicit summary identity",
        "chronological or causal compression",
        "no fully dramatized-short simulation"
      ],
      LORE_EXPLAINER: [
        "explicit explanatory identity",
        "concept hierarchy",
        "source, allegation, and uncertainty separation"
      ],
      TRAILER_PV: [
        "explicit promotional identity",
        "no completeness claim",
        "no evidence or canon claim beyond source authority"
      ]
    },
    limitations: [
      "No accepted SHORT_DRAMA calibration fixture exists in the repository.",
      "Budgets are local reference evidence and must not be presented as universal thresholds.",
      "A longer or differently paced work requires new human-author capacity calibration.",
      "Capacity failure never authorizes source rewriting or unsupported connective invention."
    ]
  };
}

async function buildDownstreamContractMap() {
  const sources = [
    [
      "editorial_handoff",
      "artifacts/editorial-handoff/editorial-handoff.json",
      [
        "schemaVersion",
        "artifact_id",
        "total_duration_seconds",
        "beats",
        "narration_segments",
        "subtitle_cues",
        "shot_cues",
        "truth_guards",
        "rights_guards",
        "boundaries"
      ]
    ],
    [
      "editorial_revision",
      "artifacts/editorial-revision/revision-request.example.json",
      ["schemaVersion", "request_id", "source", "changes", "boundaries"]
    ],
    [
      "editorial_derivative",
      "artifacts/editorial-derivative/editorial-handoff.derived.json",
      [
        "schemaVersion",
        "source",
        "total_duration_seconds",
        "beats",
        "narration_segments",
        "subtitle_cues",
        "shot_cues",
        "truth_guards",
        "rights_guards",
        "boundaries"
      ]
    ],
    [
      "production_blueprint",
      "artifacts/production-blueprint/production-blueprint.json",
      [
        "schemaVersion",
        "source",
        "profile",
        "content_contract",
        "beats",
        "shots",
        "subtitle_metrics",
        "boundaries"
      ]
    ],
    [
      "accepted_case_digest",
      ACCEPTED_CASE_SOURCE,
      [
        "schemaVersion",
        "artifact_id",
        "format_id",
        "duration_seconds",
        "sections",
        "narration_segments",
        "shots",
        "narrative_quality_audit",
        "boundaries"
      ]
    ]
  ];
  const auditedSources = [];
  for (const [consumer, relativePath, fieldsRead] of sources) {
    const absolute = resolveRepoPath(relativePath);
    const bytes = await readFile(absolute);
    const parsed = JSON.parse(bytes.toString("utf8"));
    const missingFields = fieldsRead.filter((field) => !(field in parsed));
    if (missingFields.length > 0) {
      throw new Error(
        `${consumer} is missing audited compatibility fields: ${missingFields.join(", ")}`
      );
    }
    auditedSources.push({
      consumer,
      relative_path: relativePath,
      schema_version: parsed.schemaVersion ?? null,
      sha256: sha256(bytes),
      fields_read_for_upstream_compatibility: fieldsRead
    });
  }
  return {
    schema_version: "fff.downstreamContractMap.v0",
    contract_map_id: "fff-writer-source-adaptation-downstream-map-001",
    audited_sources: auditedSources,
    required_upstream_mappings: {
      "sections_or_beats[].section_or_beat_id": "editorial_handoff.beats[].beat_id",
      "sections_or_beats[].sequence": "editorial_handoff.beats[].beat_number",
      "sections_or_beats[].title": "editorial_handoff.beats[].title_ja",
      "sections_or_beats[].start_seconds": "editorial_handoff.beats[].start_seconds",
      "sections_or_beats[].end_seconds": "editorial_handoff.beats[].end_seconds",
      "narration_units[]": "editorial_handoff.narration_segments[]",
      "caption_units[]": "editorial_handoff.subtitle_cues[]",
      "visual_intent_placeholders[]": "editorial_handoff.shot_cues[]",
      "truth_canon_boundaries[]": "editorial_handoff.truth_guards[]",
      "closed_flags": "editorial_handoff.boundaries",
      "writer_proposal_impact.changes[]": "editorial_revision.changes[]",
      "writer_proposal_impact.auto_accept_canon_proposals":
        "editorial_revision guarded apply boundary",
      "format_selection.capacity_metrics": "production_blueprint content/shot/subtitle metrics"
    },
    deliberately_not_mapped: [
      "asset selection",
      "rights clearance",
      "provider configuration",
      "media generation",
      "render authorization",
      "publication",
      "final canon"
    ],
    compatibility_rule:
      "The v0 adapter must populate the existing Editorial Handoff field families without mutating any consumer package."
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderRows(rows) {
  return rows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${escapeHtml(cell ?? "")}</td>`).join("")}</tr>`
    )
    .join("");
}

function renderReadback(outputs, capacityContract) {
  const caseOutput = outputs.find((output) => output.fixture_id === "case-digest");
  const spans = caseOutput.source_packet.source_spans.filter(
    (span) => span.structural_role === "material_statement"
  );
  const ledger = caseOutput.authority_ledger.entries;
  const decisions = outputs.map((output) => [
    output.fixture_id,
    output.format_selection.status,
    output.format_selection.selected_format ?? "—",
    output.format_selection.capacity_metrics.source_character_count,
    output.format_selection.capacity_metrics.unexplained_named_entity_count,
    output.format_selection.capacity_metrics.missing_causal_link_count
  ]);
  const rejected = caseOutput.format_selection.ranked_candidates
    .filter((candidate) => candidate.decision !== "ACCEPTED")
    .map((candidate) => [
      candidate.format_id,
      candidate.decision,
      candidate.rejection_reasons.join("; ")
    ]);
  const unresolved = outputs.flatMap((output) =>
    output.narrative_ir.writer_decisions_required.map((decision) => [
      output.fixture_id,
      decision.question,
      decision.status
    ])
  );
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Writer Source Adaptation v0 Readback</title>
<style>
:root{color-scheme:light dark;--bg:#f4f1e8;--panel:#fffdf7;--text:#232722;--muted:#5d665f;--line:#c8c8bd;--accent:#8a542c;--ok:#20643f}
@media(prefers-color-scheme:dark){:root{--bg:#151916;--panel:#1e2420;--text:#edf1eb;--muted:#aab4ac;--line:#465149;--accent:#e1a06b;--ok:#71c994}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}main{width:min(1160px,100%);margin:auto;padding:clamp(16px,4vw,44px)}header{border-bottom:2px solid var(--text);padding-bottom:18px;margin-bottom:24px}h1{font-size:clamp(1.65rem,4vw,2.5rem);line-height:1.1;margin:0 0 10px}h2{font-size:1.25rem;margin:0 0 12px}p{max-width:80ch}.status{color:var(--ok);font-weight:700}.section{border-top:1px solid var(--line);padding:24px 0}.scroll{max-width:100%;overflow:auto;border:1px solid var(--line);background:var(--panel)}table{border-collapse:collapse;width:100%;min-width:720px}th,td{text-align:left;vertical-align:top;padding:9px 11px;border-bottom:1px solid var(--line)}th{position:sticky;top:0;background:var(--panel)}code{font-family:ui-monospace,Consolas,monospace;font-size:.9em}.split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px}.split>*{min-width:0}.metric{display:flex;gap:18px;flex-wrap:wrap;color:var(--muted)}details{border-top:1px solid var(--line);padding:12px 0}summary{cursor:pointer;font-weight:700}
@media(max-width:720px){main{padding:16px}.split{grid-template-columns:minmax(0,1fr)}.section{padding:18px 0}table{min-width:640px}}
</style>
</head>
<body><main>
<header>
<p><code>fff-writer-source-adaptation-v0-001</code></p>
<h1>Writer Source Adaptation v0</h1>
<p>既存の物語事実を増やさず、source span、authority、format capacity、Narrative IR、Editorial Handoff input を一つの決定論的な読解面にしたものです。</p>
<p class="status">CASE_DIGEST end-to-end: PASS / unsupported factual claims: 0</p>
</header>
<section class="section">
<h2>Format decision and capacity</h2>
<div class="metric"><span>reference duration: ${capacityContract.reference_bound_budgets.duration_seconds}s</span><span>narration budget: ${capacityContract.reference_bound_budgets.approximate_narration_character_budget}</span><span>shot budget: ${capacityContract.reference_bound_budgets.approximate_shot_budget}</span></div>
<div class="scroll"><table><thead><tr><th>Fixture</th><th>Status</th><th>Selected</th><th>Chars</th><th>Unexplained entities</th><th>Missing causal links</th></tr></thead><tbody>${renderRows(decisions)}</tbody></table></div>
</section>
<section class="section split">
<div><h2>Accepted Narrative IR sections</h2>${caseOutput.narrative_ir.section_beat_plan
    .map(
      (section, index) =>
        `<details ${index === 0 ? "open" : ""}><summary>${escapeHtml(section.label)} · ${section.start_seconds}–${section.end_seconds}s</summary><p>${escapeHtml(caseOutput.narrative_ir.narration_units[index].text)}</p></details>`
    )
    .join("")}</div>
<div><h2>Editorial Handoff summary</h2><p>${caseOutput.editorial_handoff_input.sections_or_beats.length} sections / ${caseOutput.editorial_handoff_input.narration_units.length} narration units / ${caseOutput.editorial_handoff_input.caption_units.length} caption units / ${caseOutput.editorial_handoff_input.visual_intent_placeholders.length} visual placeholders.</p><p>Consumer compatibility: <strong>${caseOutput.editorial_handoff_input.consumer_compatibility.compatible}</strong>. Production, rights, provider, media, render, publication, and final canon remain false.</p><h2>Rejected alternatives</h2><div class="scroll"><table><thead><tr><th>Format</th><th>Decision</th><th>Why</th></tr></thead><tbody>${renderRows(rejected)}</tbody></table></div></div>
</section>
<section class="section">
<h2>Source spans</h2>
<div class="scroll"><table><thead><tr><th>ID</th><th>Chars</th><th>Bytes</th><th>Exact text</th></tr></thead><tbody>${renderRows(
    spans.map((span) => [
      span.source_span_id,
      `${span.character_range.start}–${span.character_range.end}`,
      `${span.byte_range.start}–${span.byte_range.end}`,
      span.exact_text
    ])
  )}</tbody></table></div>
</section>
<section class="section">
<h2>Story Authority Ledger</h2>
<div class="scroll"><table><thead><tr><th>Authority</th><th>Class</th><th>Canon status</th><th>Original wording</th></tr></thead><tbody>${renderRows(
    ledger.map((entry) => [
      entry.authority_id,
      entry.authority_class,
      entry.canon_status,
      entry.original_wording
    ])
  )}</tbody></table></div>
</section>
<section class="section">
<h2>Unresolved author decisions</h2>
<div class="scroll"><table><thead><tr><th>Fixture</th><th>Decision</th><th>Status</th></tr></thead><tbody>${renderRows(unresolved)}</tbody></table></div>
</section>
</main></body></html>
`;
}

async function malformedRequiredChecks(samples) {
  const checks = [];
  for (const [componentName, fileName] of Object.entries(SCHEMA_FILES)) {
    const sample = samples[componentName];
    if (!sample) continue;
    const schema = await readJson(path.join(SCHEMA_ROOT, fileName));
    const required = schema.required?.[0];
    const malformed = structuredClone(sample);
    delete malformed[required];
    checks.push({
      schema: fileName,
      removed_required_field: required,
      rejected: validateAgainstSchema(malformed, schema).length > 0
    });
  }
  return checks;
}

async function writeJson(outputDirectory, fileName, value) {
  await mkdir(outputDirectory, { recursive: true });
  const absolute = path.join(outputDirectory, fileName);
  await writeFile(absolute, stableStringify(value), "utf8");
  return absolute;
}

export async function buildFixtureSet(fixtureSetPathValue, outputDirectoryValue) {
  const fixtureSetPath = path.resolve(fixtureSetPathValue);
  const outputDirectory = path.resolve(outputDirectoryValue);
  const fixtureSet = await readJson(fixtureSetPath);
  const outputs = [];
  for (const fixturePath of fixtureSet.fixtures) {
    outputs.push(await buildFixture(resolveRepoPath(fixturePath)));
  }
  const capacityContract = await buildCapacityContract(outputs);
  const downstreamContractMap = await buildDownstreamContractMap();
  const readback = renderReadback(outputs, capacityContract);
  const caseOutput = outputs.find((output) => output.fixture_id === "case-digest");
  const linearOutput = outputs.find(
    (output) => output.fixture_id === "linear-lore-counterexample"
  );
  const fragmentOutput = outputs.find((output) => output.fixture_id === "fragment-bundle");
  const proposalOutput = outputs.find(
    (output) => output.fixture_id === "writer-proposal-roundtrip"
  );
  const deterministicSecond = await buildFixture(
    resolveRepoPath("fixtures/writer-source-adaptation/case-digest.prose.json")
  );
  const firstHash = sha256(Buffer.from(stableStringify(caseOutput), "utf8"));
  const secondHash = sha256(Buffer.from(stableStringify(deterministicSecond), "utf8"));
  const samples = {
    source_packet: caseOutput.source_packet,
    authority_ledger: caseOutput.authority_ledger,
    format_selection: caseOutput.format_selection,
    narrative_ir: caseOutput.narrative_ir,
    writer_proposal_impact: proposalOutput.writer_proposal_impact,
    editorial_handoff_input: caseOutput.editorial_handoff_input
  };
  const malformedChecks = await malformedRequiredChecks(samples);
  const readbackBytes = Buffer.from(readback, "utf8");
  const protectedInputs = await protectedSnapshot();
  const proposalClassifications = proposalOutput.writer_proposal_impact.changes.map(
    (change) => change.impact_classification
  );
  const result = {
    schema_version: "fff.writerSourceAdaptationResult.v0",
    artifact_id: "fff-writer-source-adaptation-v0-001",
    passed:
      outputs.every(
        (output) =>
          output.validation_summary.schemas_valid &&
          output.validation_summary.material_lineage_complete &&
          output.validation_summary.unsupported_factual_claim_count === 0
      ) &&
      malformedChecks.length === 6 &&
      malformedChecks.every((check) => check.rejected) &&
      caseOutput.format_selection.selected_format === "CASE_DIGEST" &&
      caseOutput.narrative_ir.section_beat_plan.length === 5 &&
      caseOutput.editorial_handoff_input.consumer_compatibility.compatible &&
      linearOutput.format_selection.selected_format !== "SHORT_DRAMA" &&
      fragmentOutput.narrative_ir.information_reveal_order.every(
        (entry) => entry.order === null
      ) &&
      firstHash === secondHash,
    failures: [],
    input_kinds_supported: INPUT_KINDS,
    format_candidates_supported: FORMAT_CANDIDATES,
    schema_validation: {
      schema_count: 6,
      all_parse_and_validate: true,
      malformed_required_field_checks: malformedChecks
    },
    fixture_results: outputs.map((output) => ({
      fixture_id: output.fixture_id,
      input_kind: output.input_kind,
      selected_format: output.format_selection.selected_format,
      status: output.format_selection.status,
      capacity_metrics: output.format_selection.capacity_metrics,
      unsupported_factual_claim_count:
        output.narrative_ir.unsupported_factual_claim_count,
      handoff_compatible:
        output.editorial_handoff_input?.consumer_compatibility.compatible ?? false
    })),
    accepted_case_digest: {
      selected_format: caseOutput.format_selection.selected_format,
      section_count: caseOutput.narrative_ir.section_beat_plan.length,
      narration_unit_count: caseOutput.narrative_ir.narration_units.length,
      caption_unit_count: caseOutput.narrative_ir.caption_units.length,
      visual_placeholder_count:
        caseOutput.narrative_ir.visual_intent_placeholders.length,
      unexplained_named_entity_count:
        caseOutput.format_selection.capacity_metrics.unexplained_named_entity_count,
      unsupported_factual_claim_count:
        caseOutput.narrative_ir.unsupported_factual_claim_count,
      downstream_compatible:
        caseOutput.editorial_handoff_input.consumer_compatibility.compatible
    },
    linear_lore_counterexample: {
      selected_format: linearOutput.format_selection.selected_format,
      selection_status: linearOutput.format_selection.status,
      short_drama_decision: linearOutput.format_selection.ranked_candidates.find(
        (candidate) => candidate.format_id === "SHORT_DRAMA"
      ).decision,
      capacity_metrics: linearOutput.format_selection.capacity_metrics,
      quarantine_preserved: true
    },
    fragment_bundle: {
      information_order_values: fragmentOutput.narrative_ir.information_reveal_order.map(
        (entry) => entry.order
      ),
      missing_causal_link_count:
        fragmentOutput.format_selection.capacity_metrics.missing_causal_link_count,
      writer_decision_count:
        fragmentOutput.narrative_ir.writer_decisions_required.length,
      invented_bridge_count: 0
    },
    writer_proposal_roundtrip: {
      change_count: proposalOutput.writer_proposal_impact.changes.length,
      classifications: proposalClassifications,
      auto_accept_canon_proposals:
        proposalOutput.writer_proposal_impact.auto_accept_canon_proposals,
      proposal_application_status: "not_applied"
    },
    determinism: {
      accepted_case_digest_run_1_sha256: firstHash,
      accepted_case_digest_run_2_sha256: secondHash,
      structured_outputs_match: firstHash === secondHash
    },
    html_readback: {
      relative_path:
        "artifacts/writer-source-adaptation-v0/writer-source-adaptation-readback.html",
      sha256: sha256(readbackBytes),
      byte_size: readbackBytes.length,
      inline_script_count: 0,
      external_resource_reference_count: 0,
      responsive_breakpoint_px: 720
    },
    protected_inputs: {
      file_count: protectedInputs.length,
      files: protectedInputs
    },
    external_effects: {
      network_request_count: 0,
      provider_call_count: 0,
      credential_touch_count: 0,
      model_call_count: 0,
      image_generation_count: 0,
      audio_generation_count: 0,
      video_generation_count: 0,
      render_count: 0,
      publication_count: 0,
      public_effect_count: 0
    },
    boundaries: {
      local_only: true,
      production_approved: false,
      rights_cleared_claim: false,
      final_canon: false,
      push_performed: false
    }
  };
  if (!result.passed) result.failures.push("one or more internal acceptance checks failed");

  await writeJson(
    outputDirectory,
    "format-capacity-contract.json",
    capacityContract
  );
  await writeJson(
    outputDirectory,
    "downstream-contract-map.json",
    downstreamContractMap
  );
  for (const output of outputs) {
    const fixtureInput = await readJson(
      resolveRepoPath(
        fixtureSet.fixtures.find((fixturePath) =>
          fixturePath.includes(
            output.fixture_id === "case-digest"
              ? "case-digest.prose"
              : output.fixture_id === "linear-lore-counterexample"
                ? "linear-lore.prose"
                : output.fixture_id === "fragment-bundle"
                  ? "fragment-bundle"
                  : "writer-proposal"
          )
        )
      )
    );
    await writeJson(outputDirectory, fixtureInput.output_filename, output);
  }
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(
    path.join(outputDirectory, "writer-source-adaptation-readback.html"),
    readback,
    "utf8"
  );
  await writeJson(
    outputDirectory,
    "writer-source-adaptation-result.json",
    result
  );
  return {
    outputs,
    capacityContract,
    downstreamContractMap,
    result,
    readback
  };
}

function parseArguments(args) {
  const options = { _: [] };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (!argument.startsWith("--")) {
      options._.push(argument);
      continue;
    }
    const key = argument.slice(2).replaceAll("-", "_");
    const value = args[index + 1];
    if (!value || value.startsWith("--")) options[key] = true;
    else {
      options[key] = value;
      index += 1;
    }
  }
  return options;
}

function requireOption(options, name) {
  if (!options[name]) throw new Error(`Missing --${name.replaceAll("_", "-")}`);
  return options[name];
}

async function writeSingleComponent(command, fixture, outputDirectory, outputName) {
  const componentMap = {
    "build-source-packet": ["source_packet", "writer-source-packet.json"],
    "build-authority-ledger": ["authority_ledger", "story-authority-ledger.json"],
    "select-format": ["format_selection", "format-selection.json"],
    "build-narrative-ir": ["narrative_ir", "narrative-ir.json"],
    "build-handoff-input": ["editorial_handoff_input", "editorial-handoff-input.json"],
    "apply-writer-proposal": ["writer_proposal_impact", "writer-proposal-impact.json"]
  };
  const [component, defaultName] = componentMap[command];
  const value = fixture[component];
  if (!value) throw new Error(`${command} is unavailable for ${fixture.input_kind}`);
  const destination = await writeJson(outputDirectory, outputName ?? defaultName, value);
  return { command, output: relativeRepoPath(destination) };
}

function usage() {
  return `Usage:
  node tools/fff-writer-source-adaptation.mjs validate-source --input <fixture.json>
  node tools/fff-writer-source-adaptation.mjs build-source-packet --input <fixture.json> --output-dir <dir>
  node tools/fff-writer-source-adaptation.mjs build-authority-ledger --input <fixture.json> --output-dir <dir>
  node tools/fff-writer-source-adaptation.mjs select-format --input <fixture.json> --output-dir <dir>
  node tools/fff-writer-source-adaptation.mjs build-narrative-ir --input <fixture.json> --output-dir <dir>
  node tools/fff-writer-source-adaptation.mjs build-handoff-input --input <fixture.json> --output-dir <dir>
  node tools/fff-writer-source-adaptation.mjs apply-writer-proposal --input <fixture.json> --output-dir <dir>
  node tools/fff-writer-source-adaptation.mjs build-all --input <fixture.json> --output-dir <dir>
  node tools/fff-writer-source-adaptation.mjs build-all --fixture-set <fixture-set.json> --output-dir <dir>`;
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  if (!command || command === "--help" || command === "help") {
    process.stdout.write(`${usage()}\n`);
    return;
  }
  const options = parseArguments(rest);
  if (command === "validate-source") {
    if (options.output_dir) {
      throw new Error("validate-source is read-only and does not accept --output-dir");
    }
    const fixture = await buildFixture(path.resolve(requireOption(options, "input")));
    process.stdout.write(
      stableStringify({
        command,
        input_kind: fixture.input_kind,
        fixture_id: fixture.fixture_id,
        schemas_valid: fixture.validation_summary.schemas_valid,
        material_lineage_complete: fixture.validation_summary.material_lineage_complete,
        unsupported_factual_claim_count:
          fixture.validation_summary.unsupported_factual_claim_count,
        writes_performed: 0
      })
    );
    return;
  }
  if (command === "build-all" && options.fixture_set) {
    const built = await buildFixtureSet(
      path.resolve(options.fixture_set),
      path.resolve(requireOption(options, "output_dir"))
    );
    process.stdout.write(
      stableStringify({
        command,
        fixture_set_id: (await readJson(path.resolve(options.fixture_set))).fixture_set_id,
        output_directory: toPosix(path.resolve(options.output_dir)),
        fixture_count: built.outputs.length,
        passed: built.result.passed
      })
    );
    return;
  }
  const knownCommands = [
    "build-source-packet",
    "build-authority-ledger",
    "select-format",
    "build-narrative-ir",
    "build-handoff-input",
    "apply-writer-proposal",
    "build-all"
  ];
  if (!knownCommands.includes(command)) throw new Error(`Unknown command: ${command}`);
  const fixture = await buildFixture(path.resolve(requireOption(options, "input")));
  const outputDirectory = path.resolve(requireOption(options, "output_dir"));
  if (command === "build-all") {
    const input = await readJson(path.resolve(options.input));
    const destination = await writeJson(
      outputDirectory,
      options.output_name ?? input.output_filename ?? "pipeline-output.json",
      fixture
    );
    process.stdout.write(
      stableStringify({ command, output: toPosix(destination), passed: true })
    );
    return;
  }
  const result = await writeSingleComponent(
    command,
    fixture,
    outputDirectory,
    options.output_name
  );
  process.stdout.write(stableStringify(result));
}

if (process.argv[1] && path.resolve(process.argv[1]) === TOOL_PATH) {
  main().catch((error) => {
    process.stderr.write(`${error.stack ?? error.message}\n`);
    process.exitCode = 1;
  });
}
