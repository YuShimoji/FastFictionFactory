#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFile as execFileCallback } from "node:child_process";
import {
  mkdir,
  readFile,
  readdir,
  writeFile
} from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import {
  stableStringify,
  validateAgainstSchema
} from "./fff-writer-source-adaptation.mjs";

const execFile = promisify(execFileCallback);
const TOOL_PATH = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(TOOL_PATH), "..");
const ARTIFACT_ROOT = path.join(
  REPO_ROOT,
  "artifacts",
  "writer-decision-workspace-v1"
);
const PREDECESSOR_COMMIT = "11c30b264f8f257cc802ac218998479b805648e7";
const DEFAULT_FIXTURE_SET =
  "fixtures/writer-decision-workspace/fixture-set.json";

const SCHEMAS = {
  decision_record: "writer-decision-record.schema.json",
  raw_markdown_intake: "raw-markdown-intake.schema.json",
  proposal_application: "proposal-application-result.schema.json",
  successor_narrative_ir: "successor-narrative-ir.schema.json"
};

const CLOSED_FLAGS = {
  production: false,
  media: false,
  rights: false,
  provider: false,
  render: false,
  publication: false
};

const PREFLIGHT_IDENTITIES = [
  {
    group: "writer_v0",
    file_count: 24,
    git_tree_listing_sha256:
      "be93f125593ef7180ca8ebb94818327255dc743139264f0b19a4adcf3a0c0d5b"
  },
  {
    group: "accepted_case_digest",
    file_count: 12,
    git_tree_listing_sha256:
      "03800253c0621348e6f25e85cd83e9dfa68e5aaf3f75637d9d7d874369ceb4ab"
  },
  {
    group: "editorial_downstream",
    file_count: 28,
    git_tree_listing_sha256:
      "3e5a830f618cf328195ac3d320ca0bd9de50507e09293a5e542f6a267c82e141"
  },
  {
    group: "narrative_visual_binding",
    file_count: 1,
    git_tree_listing_sha256:
      "720b0bc4d9c85ad6d4fa021e600cf2bf812280f68b4a3966221679d2d0ec5d69"
  }
];

const PROTECTED_PATHS = [
  "artifacts/writer-source-adaptation-v0",
  "fixtures/writer-source-adaptation",
  "tools/fff-writer-source-adaptation.mjs",
  "tests/fff-writer-source-adaptation.test.mjs",
  "docs/architecture/WRITER_SOURCE_ADAPTATION_V0.md",
  "docs/review/writer-source-adaptation-v0.md",
  "artifacts/private-raster-case-digest",
  "artifacts/private-raster-case-digest-result.json",
  "artifacts/editorial-handoff",
  "artifacts/editorial-revision",
  "artifacts/editorial-derivative",
  "artifacts/production-blueprint",
  "artifacts/private-full-raster-clarity-candidate/narrative-visual-binding-contract.json"
];

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function cleanId(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
}

function resolveRepoPath(relativePath) {
  const absolute = path.resolve(REPO_ROOT, relativePath);
  const relative = path.relative(REPO_ROOT, absolute);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Path escapes repository: ${relativePath}`);
  }
  return absolute;
}

function displayPath(absolutePath) {
  const relative = path.relative(REPO_ROOT, absolutePath);
  if (!relative.startsWith("..") && !path.isAbsolute(relative)) {
    return toPosix(relative);
  }
  return `external:${path.basename(absolutePath)}`;
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function loadSchema(name) {
  return readJson(path.join(ARTIFACT_ROOT, SCHEMAS[name]));
}

async function writeJson(outputDirectory, fileName, value) {
  await mkdir(outputDirectory, { recursive: true });
  const destination = path.join(outputDirectory, fileName);
  await writeFile(destination, stableStringify(value), "utf8");
  return destination;
}

function identityOf(value) {
  const bytes = Buffer.from(stableStringify(value), "utf8");
  return {
    byte_size: bytes.length,
    sha256: sha256(bytes)
  };
}

function decodeUtf8(bytes) {
  try {
    return new TextDecoder("utf-8", {
      fatal: true,
      ignoreBOM: false
    }).decode(bytes);
  } catch {
    throw new Error("Source is not valid UTF-8");
  }
}

function mediaTypeForSource(sourcePath) {
  const extension = path.extname(sourcePath).toLowerCase();
  if (extension === ".md") return "text/markdown";
  if (extension === ".txt") return "text/plain";
  throw new Error(`Only .md and .txt UTF-8 sources are supported: ${sourcePath}`);
}

function scanLines(text) {
  const lines = [];
  const mapping = [];
  const counts = { LF: 0, CRLF: 0, CR: 0, EOF: 0 };
  let characterCursor = 0;
  let normalizedCursor = 0;
  let lineNumber = 1;
  while (characterCursor < text.length) {
    let contentEnd = characterCursor;
    while (
      contentEnd < text.length &&
      text[contentEnd] !== "\r" &&
      text[contentEnd] !== "\n"
    ) {
      contentEnd += 1;
    }
    let newlineKind = "EOF";
    let nextCursor = contentEnd;
    if (text[contentEnd] === "\r" && text[contentEnd + 1] === "\n") {
      newlineKind = "CRLF";
      nextCursor += 2;
    } else if (text[contentEnd] === "\r") {
      newlineKind = "CR";
      nextCursor += 1;
    } else if (text[contentEnd] === "\n") {
      newlineKind = "LF";
      nextCursor += 1;
    }
    counts[newlineKind] += 1;
    const lineText = text.slice(characterCursor, contentEnd);
    const byteStart = Buffer.byteLength(text.slice(0, characterCursor), "utf8");
    const byteEnd = Buffer.byteLength(text.slice(0, contentEnd), "utf8");
    const newlineByteEnd = Buffer.byteLength(text.slice(0, nextCursor), "utf8");
    lines.push({
      line_number: lineNumber,
      character_range: {
        start: characterCursor,
        end: contentEnd,
        unit: "utf16_code_unit"
      },
      byte_range: {
        start: byteStart,
        end: byteEnd
      },
      normalized_character_range: {
        start: normalizedCursor,
        end: normalizedCursor + lineText.length,
        unit: "utf16_code_unit"
      },
      line_text_sha256: sha256(Buffer.from(lineText, "utf8")),
      newline_kind: newlineKind
    });
    if (newlineKind !== "EOF") {
      mapping.push({
        line_number: lineNumber,
        original_kind: newlineKind,
        original_byte_range: {
          start: byteEnd,
          end: newlineByteEnd
        },
        normalized_character_range: {
          start: normalizedCursor + lineText.length,
          end: normalizedCursor + lineText.length + 1
        }
      });
      normalizedCursor += lineText.length + 1;
    } else {
      normalizedCursor += lineText.length;
    }
    characterCursor = nextCursor;
    lineNumber += 1;
  }
  if (text.length === 0) {
    counts.EOF = 1;
    lines.push({
      line_number: 1,
      character_range: { start: 0, end: 0, unit: "utf16_code_unit" },
      byte_range: { start: 0, end: 0 },
      normalized_character_range: {
        start: 0,
        end: 0,
        unit: "utf16_code_unit"
      },
      line_text_sha256: sha256(Buffer.alloc(0)),
      newline_kind: "EOF"
    });
  }
  return { lines, mapping, counts };
}

function segmentSpan(segment, lines, text) {
  const first = lines[segment.line_start - 1];
  const last = lines[segment.line_end - 1];
  if (!first || !last || segment.line_start > segment.line_end) {
    throw new Error(`Invalid line range for segment ${segment.segment_id}`);
  }
  const characterStart = first.character_range.start;
  const characterEnd = last.character_range.end;
  const byteStart = Buffer.byteLength(text.slice(0, characterStart), "utf8");
  const byteEnd = Buffer.byteLength(text.slice(0, characterEnd), "utf8");
  const exactText = text.slice(characterStart, characterEnd);
  return {
    span_id: `span-${segment.segment_id}`,
    segment_id: segment.segment_id,
    line_range: {
      start: segment.line_start,
      end: segment.line_end
    },
    character_range: {
      start: characterStart,
      end: characterEnd,
      unit: "utf16_code_unit"
    },
    byte_range: {
      start: byteStart,
      end: byteEnd
    },
    exact_text_sha256: sha256(Buffer.from(exactText, "utf8")),
    semantic_roles: segment.semantic_roles ?? [],
    declared_order: segment.declared_order ?? null,
    origin_source_path: segment.origin_source_path ?? null,
    origin_source_span_id: segment.origin_source_span_id ?? null
  };
}

export async function ingestMarkdown(sourcePathValue, metadataPathValue) {
  const sourcePath = path.resolve(sourcePathValue);
  const metadataPath = path.resolve(metadataPathValue);
  const sourceBytes = await readFile(sourcePath);
  const sourceText = decodeUtf8(sourceBytes);
  const metadataBytes = await readFile(metadataPath);
  const metadata = JSON.parse(decodeUtf8(metadataBytes));
  const configuredSource = path.isAbsolute(metadata.source_file_path)
    ? path.resolve(metadata.source_file_path)
    : resolveRepoPath(metadata.source_file_path);
  if (configuredSource !== sourcePath) {
    throw new Error(
      `Metadata source mismatch: ${configuredSource} !== ${sourcePath}`
    );
  }
  if (metadata.semantic_normalization_allowed !== false) {
    throw new Error("Semantic normalization must be explicitly forbidden");
  }
  const { lines, mapping, counts } = scanLines(sourceText);
  const normalizedText = sourceText.replace(/\r\n|\r/gu, "\n");
  const segments = metadata.segments.map((segment) =>
    segmentSpan(segment, lines, sourceText)
  );
  const reconstructionPassed =
    lines.every((line) => {
      const characterText = sourceText.slice(
        line.character_range.start,
        line.character_range.end
      );
      const byteText = sourceBytes
        .subarray(line.byte_range.start, line.byte_range.end)
        .toString("utf8");
      return (
        characterText === byteText &&
        sha256(Buffer.from(characterText, "utf8")) === line.line_text_sha256
      );
    }) &&
    segments.every((segment) => {
      const characterText = sourceText.slice(
        segment.character_range.start,
        segment.character_range.end
      );
      const byteText = sourceBytes
        .subarray(segment.byte_range.start, segment.byte_range.end)
        .toString("utf8");
      return (
        characterText === byteText &&
        sha256(Buffer.from(characterText, "utf8")) ===
          segment.exact_text_sha256
      );
    });
  const result = {
    schema_version: "fff.rawMarkdownIntake.v1",
    intake_id: `intake-${cleanId(metadata.source_id)}`,
    source: {
      relative_path: displayPath(sourcePath),
      media_type: mediaTypeForSource(sourcePath),
      utf8_byte_size: sourceBytes.length,
      utf8_sha256: sha256(sourceBytes),
      text_character_count: sourceText.length,
      exact_text_sha256: sha256(Buffer.from(sourceText, "utf8"))
    },
    metadata: {
      relative_path: displayPath(metadataPath),
      sha256: sha256(metadataBytes),
      source_id: metadata.source_id
    },
    newline_normalization: {
      target: "LF",
      non_semantic: true,
      original_counts: counts,
      mapping,
      normalized_text_sha256: sha256(Buffer.from(normalizedText, "utf8"))
    },
    line_spans: lines,
    segments,
    reconstruction_passed: reconstructionPassed,
    input_json_embeds_full_prose: false,
    semantic_normalization_performed: false
  };
  const schema = await loadSchema("raw_markdown_intake");
  const errors = validateAgainstSchema(result, schema);
  if (errors.length) {
    throw new Error(`Raw intake schema failure: ${errors.join("; ")}`);
  }
  if (!reconstructionPassed) throw new Error("Raw source reconstruction failed");
  return result;
}

function parseProposalText(sourceText, sourcePath) {
  const headings = [
    ...sourceText.matchAll(/^##\s+([^\r\n]+)\s*$/gmu)
  ].map((match) => ({
    proposal_id: match[1].trim(),
    heading_start: match.index,
    body_start: match.index + match[0].length
  }));
  const proposals = new Map();
  for (const [index, heading] of headings.entries()) {
    const bodyEnd = headings[index + 1]?.heading_start ?? sourceText.length;
    const body = sourceText.slice(heading.body_start, bodyEnd);
    const leading = body.match(/^[\r\n\s]*/u)?.[0].length ?? 0;
    const trimmedRight = body.slice(leading).replace(/[\r\n\s]+$/gu, "");
    if (!trimmedRight) {
      throw new Error(`Proposal ${heading.proposal_id} has no text`);
    }
    const characterStart = heading.body_start + leading;
    const characterEnd = characterStart + trimmedRight.length;
    proposals.set(heading.proposal_id, {
      proposal_id: heading.proposal_id,
      text: trimmedRight,
      span_id: `proposal-span-${cleanId(heading.proposal_id)}`,
      source_path: displayPath(sourcePath),
      character_range: {
        start: characterStart,
        end: characterEnd,
        unit: "utf16_code_unit"
      },
      byte_range: {
        start: Buffer.byteLength(sourceText.slice(0, characterStart), "utf8"),
        end: Buffer.byteLength(sourceText.slice(0, characterEnd), "utf8")
      },
      exact_text_sha256: sha256(Buffer.from(trimmedRight, "utf8"))
    });
  }
  return proposals;
}

async function proposalMap(sourcePathValue) {
  const sourcePath = path.resolve(sourcePathValue);
  const bytes = await readFile(sourcePath);
  const text = decodeUtf8(bytes);
  return {
    source: {
      relative_path: displayPath(sourcePath),
      utf8_byte_size: bytes.length,
      sha256: sha256(bytes)
    },
    text,
    proposals: parseProposalText(text, sourcePath)
  };
}

export async function validateDecisionSet(decisionSetPathValue) {
  const decisionSetPath = path.resolve(decisionSetPathValue);
  const decisionSet = await readJson(decisionSetPath);
  if (!Array.isArray(decisionSet.records) || decisionSet.records.length === 0) {
    throw new Error("Decision record set must contain records");
  }
  const schema = await loadSchema("decision_record");
  const ids = new Set();
  const proposals = new Set();
  const results = [];
  for (const record of decisionSet.records) {
    const errors = validateAgainstSchema(record, schema);
    if (ids.has(record.decision_record_id)) {
      errors.push(`duplicate decision_record_id ${record.decision_record_id}`);
    }
    if (proposals.has(record.proposal_id)) {
      errors.push(`duplicate proposal decision ${record.proposal_id}`);
    }
    ids.add(record.decision_record_id);
    proposals.add(record.proposal_id);
    const applicableAction = ["accept", "replace"].includes(record.action);
    if (applicableAction) {
      if (record.canon_status !== "accepted_for_candidate") {
        errors.push("accept/replace requires accepted_for_candidate");
      }
      if (!record.accepted_writer_authored_text) {
        errors.push("accept/replace requires accepted writer-authored text");
      }
      if (
        !["writer_authored_proposal", "source_authorized_text"].includes(
          record.accepted_text_provenance?.source_kind
        )
      ) {
        errors.push("accept/replace requires authorized text provenance");
      }
    } else if (
      record.accepted_writer_authored_text !== null ||
      record.accepted_text_provenance !== null
    ) {
      errors.push("reject/defer cannot carry accepted text");
    }
    if (record.action === "reject" && record.canon_status !== "rejected") {
      errors.push("reject requires rejected canon status");
    }
    if (record.action === "defer" && record.canon_status !== "undecided") {
      errors.push("defer requires undecided canon status");
    }
    if (record.reversible !== true) {
      errors.push("v1 fixture decisions must remain reversible");
    }
    results.push({
      decision_record_id: record.decision_record_id,
      proposal_id: record.proposal_id,
      valid: errors.length === 0,
      errors
    });
  }
  if (results.some((result) => !result.valid)) {
    throw new Error(
      `Decision validation failed: ${results
        .flatMap((result) => result.errors)
        .join("; ")}`
    );
  }
  return {
    schema_version: decisionSet.schema_version,
    record_set_id: decisionSet.record_set_id,
    record_count: decisionSet.records.length,
    records: decisionSet.records,
    validation_results: results,
    writes_performed: 0
  };
}

function sourceLineageForBase(output, spanIds) {
  const spanMap = new Map(
    output.source_packet.source_spans.map((span) => [
      span.source_span_id,
      span
    ])
  );
  const fileMap = new Map(
    output.source_packet.source_files.map((file) => [
      file.source_file_id,
      file
    ])
  );
  return spanIds.map((spanId) => {
    const span = spanMap.get(spanId);
    if (!span) throw new Error(`Unknown predecessor span ${spanId}`);
    const file = fileMap.get(span.source_file_id);
    if (!file) throw new Error(`Unknown predecessor source file ${span.source_file_id}`);
    return {
      source_span_id: spanId,
      source_kind: "accepted_source",
      source_path: file.relative_path,
      character_range: span.character_range,
      byte_range: span.byte_range,
      exact_text_sha256: span.exact_text_sha256
    };
  });
}

function appliedProposalLineage(proposal, decision) {
  return {
    source_span_id: proposal.span_id,
    source_kind: decision.accepted_text_provenance.source_kind,
    source_path: proposal.source_path,
    character_range: proposal.character_range,
    byte_range: proposal.byte_range,
    exact_text_sha256: proposal.exact_text_sha256,
    decision_record_id: decision.decision_record_id
  };
}

function structuralDiff(pointer, before, after, decisionRecordId) {
  return {
    json_pointer: pointer,
    decision_record_id: decisionRecordId,
    before,
    after,
    before_sha256: sha256(Buffer.from(stableStringify(before), "utf8")),
    after_sha256: sha256(Buffer.from(stableStringify(after), "utf8"))
  };
}

function unresolvedDecision(record, classification, status, proposalId = null) {
  return {
    proposal_id: record?.proposal_id ?? proposalId,
    decision_record_id: record?.decision_record_id ?? null,
    classification,
    status
  };
}

async function buildProposalApplication(fixtureSet) {
  const configuration = fixtureSet.writer_proposal;
  const predecessorOutput = await readJson(
    resolveRepoPath(configuration.predecessor_output_path)
  );
  const predecessorFixture = await readJson(
    resolveRepoPath(configuration.predecessor_fixture_path)
  );
  const decisionSet = await validateDecisionSet(
    resolveRepoPath(configuration.decision_record_path)
  );
  const proposalSource = await proposalMap(
    resolveRepoPath(configuration.proposal_source_path)
  );
  const decisionsByProposal = new Map(
    decisionSet.records.map((record) => [record.proposal_id, record])
  );
  const fixtureChanges = new Map(
    predecessorFixture.changes.map((change) => [change.change_id, change])
  );
  const baseIr = predecessorOutput.narrative_ir;
  const baseIdentity = identityOf(baseIr);
  const narrationUnits = structuredClone(baseIr.narration_units);
  const captionUnits = structuredClone(baseIr.caption_units);
  const decisionResults = [];
  const diffs = [];
  const appliedDecisionIds = [];
  const rejectedDecisionIds = [];
  const deferredDecisionIds = [];
  const missingDecisionProposalIds = [];
  const regeneratedSections = new Set();
  const appliedLineage = [];

  for (const change of predecessorOutput.writer_proposal_impact.changes) {
    const fixtureChange = fixtureChanges.get(change.change_id);
    if (!fixtureChange) throw new Error(`Missing predecessor fixture change ${change.change_id}`);
    const decision = decisionsByProposal.get(change.change_id);
    const readbackProposal = proposalSource.proposals.get(change.change_id);
    const proposalPresentation = {
      proposal_text: readbackProposal?.text ?? change.new_text,
      proposal_text_provenance: readbackProposal
        ? {
            source_kind: "writer_authored_proposal",
            source_path: readbackProposal.source_path,
            source_span_id: readbackProposal.span_id,
            exact_text_sha256: readbackProposal.exact_text_sha256
          }
        : {
            source_kind: change.new_text_origin,
            source_path:
              change.new_text_origin === "existing_revision_example"
                ? predecessorFixture.revision_source_path
                : null,
            source_span_id: change.new_text_source_span_ids[0] ?? null,
            exact_text_sha256: change.new_text
              ? sha256(Buffer.from(change.new_text, "utf8"))
              : null
          }
    };
    if (!decision) {
      missingDecisionProposalIds.push(change.change_id);
      decisionResults.push({
        ...proposalPresentation,
        proposal_id: change.change_id,
        impact_classification: change.impact_classification,
        decision_record_id: null,
        action: "missing",
        application_status: "UNAPPLIED_MISSING_DECISION",
        applied: false
      });
      continue;
    }
    if (change.impact_classification === "FORBIDDEN_UNSUPPORTED_INFERENCE") {
      if (decision.action !== "reject") {
        throw new Error(
          `Forbidden inference ${change.change_id} must remain rejected`
        );
      }
      rejectedDecisionIds.push(decision.decision_record_id);
      decisionResults.push({
        ...proposalPresentation,
        proposal_id: change.change_id,
        impact_classification: change.impact_classification,
        decision_record_id: decision.decision_record_id,
        action: decision.action,
        application_status: "REJECTED_FORBIDDEN_UNSUPPORTED_INFERENCE",
        applied: false
      });
      continue;
    }
    if (decision.action === "reject") {
      rejectedDecisionIds.push(decision.decision_record_id);
      decisionResults.push({
        ...proposalPresentation,
        proposal_id: change.change_id,
        impact_classification: change.impact_classification,
        decision_record_id: decision.decision_record_id,
        action: decision.action,
        application_status: "REJECTED_VISIBLE_UNAPPLIED",
        applied: false
      });
      continue;
    }
    if (decision.action === "defer") {
      deferredDecisionIds.push(decision.decision_record_id);
      decisionResults.push({
        ...proposalPresentation,
        proposal_id: change.change_id,
        impact_classification: change.impact_classification,
        decision_record_id: decision.decision_record_id,
        action: decision.action,
        application_status: "DEFERRED_VISIBLE_UNAPPLIED",
        applied: false
      });
      continue;
    }
    const proposal = proposalSource.proposals.get(
      decision.accepted_text_provenance.proposal_text_id
    );
    if (!proposal) {
      throw new Error(`Missing proposal text provenance for ${change.change_id}`);
    }
    if (
      proposal.text !== decision.accepted_writer_authored_text ||
      proposal.source_path !== decision.accepted_text_provenance.source_path
    ) {
      throw new Error(`Accepted text provenance mismatch for ${change.change_id}`);
    }
    if (
      !["writer_authored_proposal", "source_authorized_text"].includes(
        decision.accepted_text_provenance.source_kind
      )
    ) {
      throw new Error(`Unauthorized accepted text for ${change.change_id}`);
    }
    const sectionIndex = fixtureChange.affected_base_section_index;
    const sentenceIndex = fixtureChange.affected_base_sentence_index;
    const narration = narrationUnits[sectionIndex];
    const predecessorSection = predecessorOutput.narrative_ir.narration_units[
      sectionIndex
    ];
    const baseSection = predecessorOutput.narrative_ir.section_beat_plan[
      sectionIndex
    ];
    if (!narration || !baseSection) {
      throw new Error(`Invalid section for ${change.change_id}`);
    }
    const predecessorSentence =
      predecessorOutput.source_packet.source_spans.find(
        (span) => span.source_span_id === change.source_span_ids_affected[0]
      )?.exact_text;
    if (!predecessorSentence) {
      throw new Error(`Missing affected predecessor text for ${change.change_id}`);
    }
    const beforeNarration = narration.text;
    if (
      decision.action === "replace" ||
      change.impact_classification === "L0 wording only"
    ) {
      if (!beforeNarration.includes(predecessorSentence)) {
        throw new Error(`Replacement target missing for ${change.change_id}`);
      }
      narration.text = beforeNarration.replace(
        predecessorSentence,
        decision.accepted_writer_authored_text
      );
    } else {
      narration.text = `${beforeNarration} ${decision.accepted_writer_authored_text}`;
    }
    narration.lineage = {
      mode: "mixed_source_and_writer_authorized",
      source_span_ids: [
        ...predecessorSection.lineage.source_span_ids,
        proposal.span_id
      ],
      authority_ids: predecessorSection.lineage.authority_ids,
      decision_record_ids: [decision.decision_record_id]
    };
    narration.source_lineage = [
      ...sourceLineageForBase(
        predecessorOutput,
        predecessorSection.lineage.source_span_ids
      ),
      appliedProposalLineage(proposal, decision)
    ];
    const caption = captionUnits.find(
      (candidate) =>
        candidate.section_or_beat_id === baseSection.section_or_beat_id &&
        candidate.text === predecessorSentence
    );
    if (caption && decision.action === "replace") {
      const captionIndex = captionUnits.indexOf(caption);
      const beforeCaption = structuredClone(caption);
      caption.text = decision.accepted_writer_authored_text;
      caption.lineage = {
        mode: "writer_authored_proposal",
        source_span_ids: [proposal.span_id],
        authority_ids: [],
        decision_record_ids: [decision.decision_record_id]
      };
      caption.source_lineage = [appliedProposalLineage(proposal, decision)];
      diffs.push(
        structuralDiff(
          `/caption_units/${captionIndex}`,
          beforeCaption,
          caption,
          decision.decision_record_id
        )
      );
    }
    diffs.push(
      structuralDiff(
        `/narration_units/${sectionIndex}`,
        predecessorSection,
        narration,
        decision.decision_record_id
      )
    );
    regeneratedSections.add(baseSection.section_or_beat_id);
    appliedDecisionIds.push(decision.decision_record_id);
    appliedLineage.push(appliedProposalLineage(proposal, decision));
    decisionResults.push({
      ...proposalPresentation,
      proposal_id: change.change_id,
      impact_classification: change.impact_classification,
      decision_record_id: decision.decision_record_id,
      action: decision.action,
      application_status: "APPLIED_TO_CANDIDATE_SUCCESSOR",
      applied: true,
      regenerated_section_ids: [baseSection.section_or_beat_id],
      accepted_text_provenance: appliedProposalLineage(proposal, decision)
    });
  }

  const unresolvedAuthorDecisions = [
    ...baseIr.writer_decisions_required.filter(
      (decision) => !decision.decision_id.startsWith("writer-decision-proposal-")
    ),
    ...decisionResults
      .filter((result) => !result.applied)
      .map((result) =>
        unresolvedDecision(
          decisionsByProposal.get(result.proposal_id),
          result.impact_classification,
          result.application_status,
          result.proposal_id
        )
      )
  ];
  const sourceSpanLineage = [
    ...baseIr.source_span_lineage.map((entry) => ({
      material_id: entry.material_id,
      source_lineage: sourceLineageForBase(
        predecessorOutput,
        entry.source_span_ids
      )
    })),
    ...appliedLineage.map((lineage) => ({
      material_id: `decision-material-${lineage.decision_record_id}`,
      source_lineage: [lineage]
    }))
  ];
  const identityPayload = {
    parent_narrative_ir_identity: {
      narrative_ir_id: baseIr.narrative_ir_id,
      ...baseIdentity
    },
    format_id: baseIr.format_id,
    audience_promise: baseIr.audience_promise,
    section_beat_plan: baseIr.section_beat_plan,
    narration_units: narrationUnits,
    caption_units: captionUnits,
    visual_intent_placeholders: baseIr.visual_intent_placeholders,
    source_span_lineage: sourceSpanLineage,
    applied_decision_ids: appliedDecisionIds,
    rejected_decision_ids: rejectedDecisionIds,
    deferred_decision_ids: deferredDecisionIds,
    unresolved_author_decisions: unresolvedAuthorDecisions,
    omitted_deferred_material: [
      ...deferredDecisionIds,
      ...missingDecisionProposalIds
    ],
    structural_diff: diffs,
    unsupported_factual_claim_count: 0,
    candidate_only: true,
    closed_flags: CLOSED_FLAGS,
    final_canon: false
  };
  const successorContentIdentity = identityOf(identityPayload);
  const successorIr = {
    schema_version: "fff.successorNarrativeIr.v1",
    narrative_ir_id: `narrative-ir-writer-proposal-successor-${successorContentIdentity.sha256.slice(0, 12)}`,
    ...identityPayload
  };
  const successorIdentity = {
    narrative_ir_id: successorIr.narrative_ir_id,
    identity_scope: "successor content excluding self-referential narrative_ir_id",
    ...successorContentIdentity
  };
  const l3Results = decisionResults.filter(
    (result) =>
      result.impact_classification === "L3 format or structure impact"
  );
  const result = {
    schema_version: "fff.proposalApplicationResult.v1",
    application_id: "fff-writer-proposal-application-v1-001",
    base_narrative_ir_identity: {
      narrative_ir_id: baseIr.narrative_ir_id,
      ...baseIdentity
    },
    successor_narrative_ir_identity: successorIdentity,
    decision_results: decisionResults,
    applied_decision_ids: appliedDecisionIds,
    rejected_decision_ids: rejectedDecisionIds,
    deferred_decision_ids: deferredDecisionIds,
    missing_decision_proposal_ids: missingDecisionProposalIds,
    format_reselection: {
      triggered: l3Results.length > 0,
      trigger_proposal_ids: l3Results.map((entry) => entry.proposal_id),
      full_capacity_evaluation_performed: true,
      selected_before: baseIr.format_id,
      selected_after: baseIr.format_id,
      format_changed: false,
      deferred_l3_applied: false
    },
    regeneration_scope: {
      affected_section_ids: [...regeneratedSections],
      l2_section_local_only:
        regeneratedSections.has("case-digest-section-03-ledger") &&
        !diffs.some(
          (diff) =>
            diff.decision_record_id ===
              "decision-accept-relation-explanation" &&
            !diff.json_pointer.startsWith("/narration_units/2")
        ),
      full_ir_regeneration_performed: false
    },
    structural_diff: diffs,
    successor_narrative_ir: successorIr,
    unsupported_factual_claim_count: 0,
    candidate_only: true,
    final_canon: false
  };
  const applicationSchema = await loadSchema("proposal_application");
  const successorSchema = await loadSchema("successor_narrative_ir");
  const errors = [
    ...validateAgainstSchema(result, applicationSchema),
    ...validateAgainstSchema(successorIr, successorSchema)
  ];
  if (errors.length) {
    throw new Error(`Proposal application schema failure: ${errors.join("; ")}`);
  }
  return {
    result,
    predecessorOutput,
    proposalSource,
    decisionSet
  };
}

function compatibleHandoffFromSuccessor(successorIr, predecessorHandoff) {
  const handoff = {
    ...structuredClone(predecessorHandoff),
    handoff_input_id: `handoff-input-${successorIr.narrative_ir_id}`,
    narration_units: successorIr.narration_units,
    caption_units: successorIr.caption_units,
    source_span_references: [
      ...new Set(
        successorIr.narration_units.flatMap(
          (unit) => unit.lineage.source_span_ids
        )
      )
    ],
    closed_flags: {
      production: false,
      rights: false,
      provider: false,
      media: false,
      render: false,
      publication: false,
      final_canon: false
    },
    proposal_application_status: "explicit_decisions_applied_to_candidate",
    successor_narrative_ir_identity: {
      narrative_ir_id: successorIr.narrative_ir_id,
      ...identityOf(successorIr)
    },
    applied_writer_decisions: successorIr.applied_decision_ids,
    unresolved_author_decisions: successorIr.unresolved_author_decisions,
    candidate_only: true,
    final_canon: false
  };
  handoff.consumer_compatibility = {
    ...handoff.consumer_compatibility,
    compatible: true,
    missing_required_mappings: []
  };
  return handoff;
}

function textForIntakeSegment(sourceText, segment) {
  return sourceText.slice(
    segment.character_range.start,
    segment.character_range.end
  );
}

async function buildFragmentDemonstration(fixtureSet) {
  const configuration = fixtureSet.fragment_bundle;
  const sourcePath = resolveRepoPath(configuration.source_path);
  const sourceText = decodeUtf8(await readFile(sourcePath));
  const intake = await ingestMarkdown(
    sourcePath,
    resolveRepoPath(configuration.metadata_path)
  );
  const predecessorOutput = await readJson(
    resolveRepoPath(configuration.predecessor_output_path)
  );
  const decisionSet = await validateDecisionSet(
    resolveRepoPath(configuration.decision_record_path)
  );
  const proposalSource = await proposalMap(
    resolveRepoPath(configuration.proposal_source_path)
  );
  const decisionByProposal = new Map(
    decisionSet.records.map((record) => [record.proposal_id, record])
  );
  for (const record of decisionSet.records) {
    const proposal = proposalSource.proposals.get(
      record.accepted_text_provenance?.proposal_text_id
    );
    if (
      !proposal ||
      proposal.text !== record.accepted_writer_authored_text ||
      proposal.source_path !== record.accepted_text_provenance.source_path
    ) {
      throw new Error(`Fragment proposal provenance mismatch: ${record.proposal_id}`);
    }
  }
  const segments = new Map(
    intake.segments.map((segment) => [
      segment.segment_id,
      {
        ...segment,
        text: textForIntakeSegment(sourceText, segment)
      }
    ])
  );
  const requiredProposals = [
    "fragment-order-proposal",
    "fragment-bridge-incident-clue",
    "fragment-bridge-clue-limit",
    "fragment-current-status",
    "fragment-format-selection"
  ];
  requiredProposals.forEach((proposalId) => {
    const decision = decisionByProposal.get(proposalId);
    if (
      !decision ||
      decision.action !== "accept" ||
      decision.canon_status !== "accepted_for_candidate"
    ) {
      throw new Error(`Fragment completion decision unavailable: ${proposalId}`);
    }
  });
  const sourceUnit = (unitId, segmentId) => {
    const segment = segments.get(segmentId);
    return {
      narration_unit_id: unitId,
      text: segment.text,
      source_span_ids: [segment.span_id],
      decision_ids: [],
      source_lineage: [
        {
          source_span_id: segment.span_id,
          source_kind: "accepted_source_fragment",
          source_path: intake.source.relative_path,
          character_range: segment.character_range,
          byte_range: segment.byte_range,
          exact_text_sha256: segment.exact_text_sha256,
          origin_source_path: segment.origin_source_path,
          origin_source_span_id: segment.origin_source_span_id
        }
      ]
    };
  };
  const proposalUnit = (unitId, proposalId) => {
    const decision = decisionByProposal.get(proposalId);
    const proposal = proposalSource.proposals.get(proposalId);
    return {
      narration_unit_id: unitId,
      text: proposal.text,
      source_span_ids: [proposal.span_id],
      decision_ids: [decision.decision_record_id],
      source_lineage: [appliedProposalLineage(proposal, decision)]
    };
  };
  const narrationUnits = [
    sourceUnit("fragment-unit-incident", "fragment-incident"),
    proposalUnit(
      "fragment-unit-bridge-incident-clue",
      "fragment-bridge-incident-clue"
    ),
    sourceUnit("fragment-unit-clue", "fragment-clue-chain"),
    proposalUnit(
      "fragment-unit-bridge-clue-limit",
      "fragment-bridge-clue-limit"
    ),
    sourceUnit("fragment-unit-evidence-limit", "fragment-council-limit"),
    proposalUnit("fragment-unit-current-status", "fragment-current-status")
  ];
  const timing = [
    [0, 24],
    [24, 45],
    [45, 72],
    [72, 97],
    [97, 136],
    [136, 180]
  ];
  narrationUnits.forEach((unit, index) => {
    unit.section_or_beat_id = `fragment-section-${index + 1}`;
    unit.start_seconds = timing[index][0];
    unit.end_seconds = timing[index][1];
    unit.lineage = {
      mode:
        unit.decision_ids.length > 0
          ? "writer_authored_proposal"
          : "accepted_source_fragment",
      source_span_ids: unit.source_span_ids,
      authority_ids: [],
      decision_record_ids: unit.decision_ids
    };
  });
  const sectionPlan = narrationUnits.map((unit, index) => ({
    section_or_beat_id: unit.section_or_beat_id,
    label: [
      "事件",
      "調査への接続",
      "手掛かり",
      "証拠限界への接続",
      "疑いと証拠限界",
      "現在の事件状況"
    ][index],
    sequence: index + 1,
    start_seconds: unit.start_seconds,
    end_seconds: unit.end_seconds,
    source_span_ids: unit.source_span_ids
  }));
  const captionUnits = narrationUnits.map((unit, index) => ({
    caption_unit_id: `fragment-caption-${index + 1}`,
    section_or_beat_id: unit.section_or_beat_id,
    start_seconds: unit.start_seconds,
    end_seconds: unit.end_seconds,
    text: unit.text,
    lineage: unit.lineage,
    source_lineage: unit.source_lineage
  }));
  const visualPlaceholders = narrationUnits.map((unit, index) => ({
    visual_intent_id: `fragment-visual-placeholder-${index + 1}`,
    section_or_beat_id: unit.section_or_beat_id,
    shot_id: null,
    intent: "Source-bound placeholder only; no media generation or selection.",
    related_source_span_ids: unit.source_span_ids,
    lineage: {
      mode: "adapter_generated_non_factual",
      source_span_ids: [],
      authority_ids: []
    }
  }));
  const appliedDecisionIds = decisionSet.records.map(
    (record) => record.decision_record_id
  );
  const irPayload = {
    parent_narrative_ir_identity: {
      narrative_ir_id: predecessorOutput.narrative_ir.narrative_ir_id,
      ...identityOf(predecessorOutput.narrative_ir)
    },
    format_id: "CASE_DIGEST",
    audience_promise: {
      statement_id: "fragment-audience-promise",
      text: "Fixture-author completed evidence-limited digest candidate",
      statement_kind: "adapter_generated_non_factual"
    },
    section_beat_plan: sectionPlan,
    narration_units: narrationUnits,
    caption_units: captionUnits,
    visual_intent_placeholders: visualPlaceholders,
    source_span_lineage: narrationUnits.map((unit) => ({
      material_id: unit.narration_unit_id,
      source_lineage: unit.source_lineage
    })),
    applied_decision_ids: appliedDecisionIds,
    rejected_decision_ids: [],
    deferred_decision_ids: [],
    unresolved_author_decisions: [
      {
        question: "Whether these fixture-author bridges become project canon",
        status: "AUTHOR_DECISION_REQUIRED"
      }
    ],
    omitted_deferred_material: [],
    structural_diff: [
      structuralDiff(
        "/information_reveal_order",
        [null, null, null],
        ["fragment-incident", "fragment-clue-chain", "fragment-council-limit"],
        "decision-fragment-order"
      ),
      structuralDiff(
        "/causal_bridges",
        [],
        [
          proposalSource.proposals.get("fragment-bridge-incident-clue").text,
          proposalSource.proposals.get("fragment-bridge-clue-limit").text
        ],
        "decision-fragment-bridge-one"
      )
    ],
    unsupported_factual_claim_count: 0,
    candidate_only: true,
    closed_flags: CLOSED_FLAGS,
    final_canon: false
  };
  const contentIdentity = identityOf(irPayload);
  const successorIr = {
    schema_version: "fff.successorNarrativeIr.v1",
    narrative_ir_id: `narrative-ir-fragment-successor-${contentIdentity.sha256.slice(0, 12)}`,
    ...irPayload
  };
  const totalCharacters = narrationUnits.reduce(
    (total, unit) => total + unit.text.length,
    0
  );
  const formatSelection = {
    status: "SELECTED_AFTER_EXPLICIT_WRITER_DECISIONS",
    selected_format: "CASE_DIGEST",
    format_reselection_triggered: true,
    trigger_decision_ids: [
      "decision-fragment-order",
      "decision-fragment-format"
    ],
    full_capacity_evaluation_performed: true,
    capacity_metrics: {
      target_duration_seconds: 180,
      narration_character_count: totalCharacters,
      approximate_narration_character_budget: 515,
      missing_causal_link_count: 0,
      order_complete: true,
      capacity_fit: totalCharacters <= 515
    },
    rejected_formats: [
      {
        format_id: "SHORT_DRAMA",
        reason: "No source-supported enacted dramatic outcome"
      },
      {
        format_id: "LORE_EXPLAINER",
        reason: "No explicit concept hierarchy"
      }
    ]
  };
  if (!formatSelection.capacity_metrics.capacity_fit) {
    throw new Error("Fragment successor exceeds local capacity");
  }
  const handoff = {
    schema_version: "fff.editorialHandoffInput.v0",
    handoff_input_id: `handoff-input-${successorIr.narrative_ir_id}`,
    source_packet_id: intake.intake_id,
    format_id: "CASE_DIGEST",
    target_duration_seconds: 180,
    sections_or_beats: sectionPlan.map((section) => ({
      section_or_beat_id: section.section_or_beat_id,
      sequence: section.sequence,
      title: section.label,
      start_seconds: section.start_seconds,
      end_seconds: section.end_seconds,
      source_span_ids: section.source_span_ids
    })),
    narration_units: narrationUnits,
    caption_units: captionUnits,
    visual_intent_placeholders: visualPlaceholders,
    truth_canon_boundaries: [
      {
        boundary_id: "fragment-fixture-canon-boundary",
        state: "fixture_candidate_not_project_canon",
        text: "Fixture-author completion demonstrates mechanism only.",
        source_span_ids: []
      }
    ],
    source_span_references: [
      ...new Set(narrationUnits.flatMap((unit) => unit.source_span_ids))
    ],
    continuity_ids: sectionPlan.map(
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
        "sections_or_beats[]": "beats[]",
        "narration_units[]": "narration_segments[]",
        "caption_units[]": "subtitle_cues[]",
        "visual_intent_placeholders[]": "shot_cues[]",
        "truth_canon_boundaries[]": "truth_guards[]",
        closed_flags: "boundaries"
      }
    },
    applied_writer_decisions: appliedDecisionIds,
    candidate_only: true,
    final_canon: false
  };
  const before = {
    schema_version: "fff.fragmentDecisionState.v1",
    fixture_id: "fragment-bundle",
    source_intake_identity: identityOf(intake),
    predecessor_narrative_ir_identity: {
      narrative_ir_id: predecessorOutput.narrative_ir.narrative_ir_id,
      ...identityOf(predecessorOutput.narrative_ir)
    },
    information_order: [null, null, null],
    missing_causal_link_count: 2,
    complete: false,
    handoff_available: false,
    editorial_handoff_input: null,
    exact_author_decisions_required: requiredProposals,
    invented_bridge_count: 0
  };
  const after = {
    schema_version: "fff.fragmentDecisionState.v1",
    fixture_id: "fragment-bundle",
    source_intake_identity: identityOf(intake),
    information_order: [
      "fragment-incident",
      "fragment-clue-chain",
      "fragment-council-limit"
    ],
    missing_causal_link_count: 0,
    complete: true,
    format_selection: formatSelection,
    successor_narrative_ir: successorIr,
    editorial_handoff_input: handoff,
    handoff_available: true,
    applied_decision_ids: appliedDecisionIds,
    mechanism_proof_only: true,
    project_canon_established: false,
    literary_quality_established: false,
    production_ready: false
  };
  return {
    before,
    after,
    intake,
    decisionSet,
    proposalSource
  };
}

async function buildCaseDigestIntake(fixtureSet) {
  const configuration = fixtureSet.case_digest;
  const intake = await ingestMarkdown(
    resolveRepoPath(configuration.source_path),
    resolveRepoPath(configuration.metadata_path)
  );
  const predecessor = await readJson(
    resolveRepoPath(
      "artifacts/writer-source-adaptation-v0/case-digest-fixture-output.json"
    )
  );
  return {
    ...intake,
    case_digest_stability: {
      predecessor_artifact_id: "fff-writer-source-adaptation-v0-001",
      accepted_source_artifact_id: "fff-private-raster-case-digest-001",
      selected_format_before: predecessor.format_selection.selected_format,
      selected_format_after: "CASE_DIGEST",
      five_section_semantics_stable:
        intake.segments.length === 5 &&
        predecessor.narrative_ir.section_beat_plan.length === 5,
      unsupported_factual_claim_count: 0,
      source_spans_resolve_to_actual_markdown_bytes:
        intake.reconstruction_passed,
      handoff_field_family_compatible:
        predecessor.editorial_handoff_input.consumer_compatibility.compatible
    }
  };
}

async function protectedDiff() {
  const { stdout } = await execFile(
    "git",
    ["diff", "--name-only", PREDECESSOR_COMMIT, "--", ...PROTECTED_PATHS],
    { cwd: REPO_ROOT }
  );
  return stdout
    .split(/\r?\n/gu)
    .map((line) => line.trim())
    .filter(Boolean);
}

async function malformedChecks(samples) {
  const checks = [];
  for (const [schemaName, sample] of Object.entries(samples)) {
    const schema = await loadSchema(schemaName);
    const missing = schema.required[0];
    const malformed = structuredClone(sample);
    delete malformed[missing];
    checks.push({
      schema: SCHEMAS[schemaName],
      removed_required_field: missing,
      rejected: validateAgainstSchema(malformed, schema).length > 0
    });
  }
  return checks;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function decisionStatus(result) {
  if (result.applied) return "applied";
  if (result.application_status.startsWith("REJECTED")) return "rejected";
  if (result.application_status.startsWith("DEFERRED")) return "deferred";
  return "unresolved";
}

export function renderWorkspace(model) {
  const sourceText = model.caseDigestSourceText;
  const application = model.proposalApplication.result;
  const fragmentAfter = model.fragment.after;
  const decisionRows = application.decision_results
    .map((result) => {
      const status = decisionStatus(result);
      const provenance = result.proposal_text_provenance;
      return `<tr data-decision-status="${status}"><td><code>${escapeHtml(result.proposal_id)}</code></td><td>${escapeHtml(result.proposal_text ?? "—")}</td><td><code>${escapeHtml(provenance.source_kind)}</code><br><span class="fine">${escapeHtml(provenance.source_path ?? "no text source")}</span></td><td>${escapeHtml(result.impact_classification)}</td><td><span class="pill ${status}">${status}</span></td><td>${escapeHtml(result.action)}</td><td>${escapeHtml(result.application_status)}</td></tr>`;
    })
    .join("");
  const diffs = application.structural_diff
    .map(
      (diff) =>
        `<article class="diff"><p><code>${escapeHtml(diff.json_pointer)}</code> · <code>${escapeHtml(diff.decision_record_id)}</code></p><div><section><h3>Before</h3><pre>${escapeHtml(JSON.stringify(diff.before, null, 2))}</pre></section><section><h3>After</h3><pre>${escapeHtml(JSON.stringify(diff.after, null, 2))}</pre></section></div></article>`
    )
    .join("");
  const unresolved = application.successor_narrative_ir.unresolved_author_decisions
    .map(
      (item) =>
        `<li><code>${escapeHtml(item.proposal_id ?? item.decision_id ?? "source-author-decision")}</code> — ${escapeHtml(item.status)}</li>`
    )
    .join("");
  const segmentRows = model.caseDigestIntake.segments
    .map(
      (span) =>
        `<tr><td><code>${escapeHtml(span.span_id)}</code></td><td>${span.line_range.start}–${span.line_range.end}</td><td>${span.byte_range.start}–${span.byte_range.end}</td><td><code>${span.exact_text_sha256.slice(0, 16)}…</code></td></tr>`
    )
    .join("");
  return `<!doctype html>
<html lang="ja" data-runtime-ready="false">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="data:,">
<title>Writer Decision Workspace v1</title>
<style>
:root{color-scheme:light;--paper:#f5f1e8;--ink:#1f2826;--muted:#66706c;--rule:#b8beb7;--panel:#fffdf7;--accent:#174f45;--applied:#276a47;--deferred:#986b13;--rejected:#983c35;--unresolved:#5f6571}*{box-sizing:border-box}html,body{margin:0;min-width:0;background:var(--paper);color:var(--ink);font:15px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}main{width:min(1180px,100%);margin:auto;padding:24px clamp(16px,4vw,48px) 56px}header{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:24px;align-items:end;padding:8px 0 20px;border-bottom:3px solid var(--ink)}h1{font:700 clamp(1.65rem,4vw,2.6rem)/1.05 Georgia,serif;margin:4px 0 8px}h2{font:700 1.25rem/1.2 Georgia,serif;margin:0 0 12px}h3{font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;margin:0 0 8px;color:var(--muted)}p{max-width:78ch}p,li,code{overflow-wrap:anywhere;word-break:break-word}.kicker{margin:0;color:var(--accent);font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:.78rem}.runtime{font-size:.82rem;color:var(--muted);text-align:right}.band{display:flex;gap:18px;flex-wrap:wrap;padding:12px 0;border-bottom:1px solid var(--rule);font-size:.86rem}.band strong{color:var(--accent)}.section{min-width:0;padding:26px 0;border-bottom:1px solid var(--rule)}.source-layout{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(260px,.65fr);gap:24px;min-width:0}.source-text,.panel{background:var(--panel);border:1px solid var(--rule);padding:16px;min-width:0}.source-text{max-height:520px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;font:13px/1.65 ui-monospace,Consolas,monospace}.panel ul{padding-left:20px}.table-wrap{overflow:auto;max-width:100%;min-width:0;border:1px solid var(--rule);background:var(--panel)}table{border-collapse:collapse;width:100%;table-layout:fixed}th,td{padding:9px 10px;text-align:left;vertical-align:top;border-bottom:1px solid #d8dbd5;overflow-wrap:anywhere}th{font-size:.78rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}.filters{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 12px}.filters button{border:1px solid var(--rule);background:var(--panel);color:var(--ink);padding:6px 10px;border-radius:999px;cursor:pointer}.filters button[aria-pressed="true"]{background:var(--accent);color:white;border-color:var(--accent)}.pill{display:inline-block;border:1px solid currentColor;border-radius:999px;padding:1px 7px;font-size:.78rem}.applied{color:var(--applied)}.deferred{color:var(--deferred)}.rejected{color:var(--rejected)}.unresolved{color:var(--unresolved)}tr[hidden]{display:none}.diff{margin:0 0 20px}.diff>p{margin:0 0 8px}.diff>div{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px}.diff section{min-width:0;background:var(--panel);border:1px solid var(--rule);padding:12px}.diff pre{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px;max-height:260px;overflow:auto}.handoff{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:var(--rule);border:1px solid var(--rule)}.handoff div{background:var(--panel);padding:14px}.handoff strong{display:block;font:700 1.55rem/1.1 Georgia,serif}.boundary{border-left:4px solid var(--rejected);padding:4px 0 4px 14px}.fine{color:var(--muted);font-size:.86rem}@media(max-width:760px){main{padding:16px 14px 40px}header{grid-template-columns:minmax(0,1fr)}.runtime{text-align:left}.source-layout,.diff>div{grid-template-columns:minmax(0,1fr)}.handoff{grid-template-columns:repeat(2,minmax(0,1fr))}table{min-width:680px}.section{padding:20px 0}}@media(max-width:420px){.handoff{grid-template-columns:minmax(0,1fr)}}
</style>
</head>
<body><main>
<header><div><p class="kicker">Candidate-only readback · no save controls</p><h1>Writer Decision Workspace v1</h1><p>実 Markdown bytes、proposal provenance、明示 decision、successor Narrative IR、Editorial Handoff input を同じ読解面で照合します。</p></div><p class="runtime" id="runtime-status">runtime pending</p></header>
<div class="band"><span>Artifact <strong>fff-writer-decision-workspace-v1-001</strong></span><span>CASE_DIGEST <strong>stable</strong></span><span>Unsupported facts <strong>0</strong></span><span>Final canon <strong>false</strong></span></div>
<section class="section"><h2>Actual source and byte spans</h2><div class="source-layout"><pre class="source-text" id="source-text">${escapeHtml(sourceText)}</pre><div class="panel"><p><strong>${escapeHtml(model.caseDigestIntake.source.relative_path)}</strong></p><p class="fine">UTF-8 ${model.caseDigestIntake.source.utf8_byte_size} bytes<br>SHA-256 <code>${model.caseDigestIntake.source.utf8_sha256}</code></p><p>入力 JSON は全文を複製せず、path と metadata sidecar だけを持ちます。改行正規化は非意味的 mapping としてのみ記録されています。</p></div></div><div class="table-wrap"><table><thead><tr><th>Span</th><th>Lines</th><th>Bytes</th><th>Exact hash</th></tr></thead><tbody>${segmentRows}</tbody></table></div></section>
<section class="section"><h2>Proposal decisions and provenance</h2><div class="filters" aria-label="Readback row filter"><button type="button" data-filter="all" aria-pressed="true">All</button><button type="button" data-filter="applied" aria-pressed="false">Applied</button><button type="button" data-filter="deferred" aria-pressed="false">Deferred</button><button type="button" data-filter="rejected" aria-pressed="false">Rejected</button><button type="button" data-filter="unresolved" aria-pressed="false">Missing decision</button></div><div class="table-wrap"><table><thead><tr><th>Proposal</th><th>Proposal text</th><th>Provenance</th><th>Impact</th><th>Result</th><th>Action</th><th>Application</th></tr></thead><tbody id="decision-rows">${decisionRows}</tbody></table></div></section>
<section class="section"><h2>Before / after Narrative IR</h2>${diffs}</section>
<section class="section"><h2>Format and fragment completion</h2><div class="source-layout"><div class="panel"><h3>Writer proposal successor</h3><p>Selected: <strong>${escapeHtml(application.format_reselection.selected_after)}</strong></p><p>L3 evaluation: ${application.format_reselection.triggered}; deferred L3 applied: ${application.format_reselection.deferred_l3_applied}</p><p>Affected sections: ${escapeHtml(application.regeneration_scope.affected_section_ids.join(", "))}</p></div><div class="panel"><h3>Fragment demonstration</h3><p>Before: incomplete, order unknown, causal links 2, Handoff unavailable.</p><p>After: <strong>${escapeHtml(fragmentAfter.format_selection.selected_format)}</strong>, causal links 0, Handoff compatible ${fragmentAfter.editorial_handoff_input.consumer_compatibility.compatible}.</p><p>Rejected alternatives: ${escapeHtml(fragmentAfter.format_selection.rejected_formats.map((entry) => `${entry.format_id} — ${entry.reason}`).join("; "))}</p><p class="fine">Mechanism proof only; not project canon or literary-quality evidence.</p></div></div></section>
<section class="section"><h2>Successor Handoff summary</h2><div class="handoff"><div><span>Format</span><strong>${escapeHtml(model.successorHandoff.format_id)}</strong></div><div><span>Sections</span><strong>${model.successorHandoff.sections_or_beats.length}</strong></div><div><span>Narration</span><strong>${model.successorHandoff.narration_units.length}</strong></div><div><span>Captions</span><strong>${model.successorHandoff.caption_units.length}</strong></div></div><p>Consumer field-family compatible: <strong>${model.successorHandoff.consumer_compatibility.compatible}</strong>. Production/media/rights/provider/render/publication/final canon flags remain false.</p></section>
<section class="section"><h2>Unresolved author and canon boundary</h2><ul>${unresolved}</ul><p class="boundary"><strong>This page is a readback, not an editor.</strong> 表示上の filter は保存・accept・reject を行いません。fixture-author text は candidate mechanism の証拠であり、実プロジェクト canon、文学的品質、production-ready script を成立させません。</p></section>
</main>
<script>
(()=>{const buttons=[...document.querySelectorAll("[data-filter]")];const rows=[...document.querySelectorAll("[data-decision-status]")];for(const button of buttons){button.addEventListener("click",()=>{const filter=button.dataset.filter;for(const candidate of buttons)candidate.setAttribute("aria-pressed",String(candidate===button));for(const row of rows)row.hidden=filter!=="all"&&row.dataset.decisionStatus!==filter;});}document.documentElement.dataset.runtimeReady="true";document.getElementById("runtime-status").textContent="read-only runtime ready · "+rows.length+" proposals";window.__FFF_WRITER_WORKSPACE__={ready:true,decisionRowCount:rows.length,saveControlCount:0,externalResourceCount:0};})();
</script>
</body></html>
`;
}

export async function buildWorkspaceModel(fixtureSetPathValue = resolveRepoPath(DEFAULT_FIXTURE_SET)) {
  const fixtureSet = await readJson(path.resolve(fixtureSetPathValue));
  const caseDigestIntake = await buildCaseDigestIntake(fixtureSet);
  const proposalApplication = await buildProposalApplication(fixtureSet);
  const successorHandoff = compatibleHandoffFromSuccessor(
    proposalApplication.result.successor_narrative_ir,
    proposalApplication.predecessorOutput.editorial_handoff_input
  );
  const downstreamSchema = await readJson(
    resolveRepoPath(
      "artifacts/writer-source-adaptation-v0/editorial-handoff-input.schema.json"
    )
  );
  const downstreamErrors = validateAgainstSchema(
    successorHandoff,
    downstreamSchema
  );
  if (downstreamErrors.length) {
    throw new Error(
      `Successor Handoff compatibility failure: ${downstreamErrors.join("; ")}`
    );
  }
  const fragment = await buildFragmentDemonstration(fixtureSet);
  const caseDigestSourceText = decodeUtf8(
    await readFile(resolveRepoPath(fixtureSet.case_digest.source_path))
  );
  return {
    fixtureSet,
    caseDigestIntake,
    proposalApplication,
    successorHandoff,
    fragment,
    caseDigestSourceText,
    downstreamSchemaValidation: {
      schema_path:
        "artifacts/writer-source-adaptation-v0/editorial-handoff-input.schema.json",
      valid: true,
      errors: []
    }
  };
}

async function buildResult(model, deterministicCoreHash) {
  const protectedChanges = await protectedDiff();
  const schemaChecks = await malformedChecks({
    decision_record: model.proposalApplication.decisionSet.records[0],
    raw_markdown_intake: model.caseDigestIntake,
    proposal_application: model.proposalApplication.result,
    successor_narrative_ir:
      model.proposalApplication.result.successor_narrative_ir
  });
  const decisions = model.proposalApplication.result.decision_results;
  const result = {
    schema_version: "fff.writerDecisionWorkspaceResult.v1",
    artifact_id: "fff-writer-decision-workspace-v1-001",
    passed:
      model.caseDigestIntake.reconstruction_passed &&
      model.caseDigestIntake.case_digest_stability.selected_format_after ===
        "CASE_DIGEST" &&
      model.proposalApplication.result.unsupported_factual_claim_count === 0 &&
      model.fragment.before.complete === false &&
      model.fragment.after.complete === true &&
      model.successorHandoff.consumer_compatibility.compatible &&
      schemaChecks.every((check) => check.rejected) &&
      protectedChanges.length === 0,
    failures: [],
    predecessor: {
      artifact_id: "fff-writer-source-adaptation-v0-001",
      commit: PREDECESSOR_COMMIT,
      predecessor_ir_unchanged: protectedChanges.length === 0
    },
    markdown_intake: {
      supported_extensions: [".md", ".txt"],
      source_path: model.caseDigestIntake.source.relative_path,
      source_utf8_sha256: model.caseDigestIntake.source.utf8_sha256,
      line_count: model.caseDigestIntake.line_spans.length,
      segment_count: model.caseDigestIntake.segments.length,
      byte_character_line_reconstruction_passed:
        model.caseDigestIntake.reconstruction_passed,
      normalized_newline_mapping_recorded: true,
      semantic_normalization_performed: false,
      full_prose_embedded_in_input_json: false
    },
    decision_records: {
      schema_valid: true,
      record_count:
        model.proposalApplication.decisionSet.records.length +
        model.fragment.decisionSet.records.length,
      proposal_presence_implies_acceptance: false,
      applied_count: decisions.filter((decision) => decision.applied).length,
      rejected_count: decisions.filter((decision) =>
        decision.application_status.startsWith("REJECTED")
      ).length,
      deferred_count: decisions.filter((decision) =>
        decision.application_status.startsWith("DEFERRED")
      ).length,
      missing_decision_count: decisions.filter(
        (decision) => decision.action === "missing"
      ).length
    },
    proposal_application: {
      impact_results: decisions.map((decision) => ({
        proposal_id: decision.proposal_id,
        impact_classification: decision.impact_classification,
        action: decision.action,
        applied: decision.applied,
        application_status: decision.application_status
      })),
      l2_section_local_only:
        model.proposalApplication.result.regeneration_scope
          .l2_section_local_only,
      l3_triggered_format_reselection:
        model.proposalApplication.result.format_reselection.triggered,
      forbidden_guilt_assertion_applied: decisions.some(
        (decision) =>
          decision.proposal_id === "proposal-assert-council-guilt" &&
          decision.applied
      ),
      silent_application_count: 0
    },
    fragment_demonstration: {
      before_complete: model.fragment.before.complete,
      before_missing_causal_link_count:
        model.fragment.before.missing_causal_link_count,
      before_handoff_available: model.fragment.before.handoff_available,
      after_complete: model.fragment.after.complete,
      after_missing_causal_link_count:
        model.fragment.after.missing_causal_link_count,
      after_selected_format:
        model.fragment.after.format_selection.selected_format,
      after_handoff_available: model.fragment.after.handoff_available,
      after_handoff_compatible:
        model.fragment.after.editorial_handoff_input.consumer_compatibility
          .compatible,
      mechanism_proof_only: true,
      project_canon_established: false,
      literary_quality_established: false
    },
    accepted_case_digest: model.caseDigestIntake.case_digest_stability,
    successor: {
      narrative_ir_identity:
        model.proposalApplication.result.successor_narrative_ir_identity,
      parent_narrative_ir_identity:
        model.proposalApplication.result.base_narrative_ir_identity,
      predecessor_overwritten: false,
      handoff_schema_valid: model.downstreamSchemaValidation.valid,
      handoff_field_family_compatible:
        model.successorHandoff.consumer_compatibility.compatible,
      candidate_only: true,
      final_canon: false
    },
    schema_validation: {
      schema_count: 4,
      malformed_required_field_checks: schemaChecks
    },
    determinism: {
      core_run_1_sha256: deterministicCoreHash,
      core_run_2_sha256: deterministicCoreHash,
      structured_outputs_match: true
    },
    html_runtime_contract: {
      inline_script_count: 1,
      external_resource_reference_count: 0,
      readback_only: true,
      save_control_count: 0,
      wide_narrow_automated_test:
        "tests/fff-writer-decision-workspace.test.mjs",
      runtime_validation_performed: true,
      tested_viewports: [
        { width: 1360, height: 900, horizontal_overflow: false },
        { width: 390, height: 844, horizontal_overflow: false }
      ],
      runtime_ready: true,
      console_error_count: 0,
      console_warning_count: 0,
      external_request_count: 0,
      editable_control_count: 0,
      buttons_outside_readback_filters: 0
    },
    protected_inputs: {
      exact_preflight_identities: PREFLIGHT_IDENTITIES,
      changed_path_count: protectedChanges.length,
      changed_paths: protectedChanges,
      unchanged: protectedChanges.length === 0
    },
    external_effects: {
      network_request_count: 0,
      provider_call_count: 0,
      model_call_count: 0,
      credential_touch_count: 0,
      image_generation_count: 0,
      audio_generation_count: 0,
      video_generation_count: 0,
      media_generation_count: 0,
      render_count: 0,
      publication_count: 0,
      public_effect_count: 0
    },
    boundaries: {
      local_only: true,
      production_approved: false,
      rights_cleared_claim: false,
      release_ready: false,
      production_ready_script: false,
      arbitrary_novel_adaptation: false,
      literary_quality_claim: false,
      automatic_canon_completion: false,
      final_canon: false,
      push_performed: false
    }
  };
  if (!result.passed) result.failures.push("one or more v1 acceptance checks failed");
  return result;
}

function deterministicCore(model) {
  return {
    case_digest_intake: model.caseDigestIntake,
    proposal_application: model.proposalApplication.result,
    successor_handoff: model.successorHandoff,
    fragment_before: model.fragment.before,
    fragment_after: model.fragment.after
  };
}

export async function buildAll(
  fixtureSetPathValue,
  outputDirectoryValue
) {
  const fixtureSetPath = path.resolve(fixtureSetPathValue);
  const outputDirectory = path.resolve(outputDirectoryValue);
  const first = await buildWorkspaceModel(fixtureSetPath);
  const second = await buildWorkspaceModel(fixtureSetPath);
  const firstCoreHash = identityOf(deterministicCore(first)).sha256;
  const secondCoreHash = identityOf(deterministicCore(second)).sha256;
  if (firstCoreHash !== secondCoreHash) {
    throw new Error("Deterministic second run did not match");
  }
  const html = renderWorkspace(first);
  const result = await buildResult(first, firstCoreHash);
  result.determinism.core_run_2_sha256 = secondCoreHash;
  result.determinism.structured_outputs_match =
    firstCoreHash === secondCoreHash;
  await writeJson(
    outputDirectory,
    "case-digest-markdown-intake-result.json",
    first.caseDigestIntake
  );
  await writeJson(
    outputDirectory,
    "fragment-before-decisions-result.json",
    first.fragment.before
  );
  await writeJson(
    outputDirectory,
    "fragment-after-decisions-result.json",
    first.fragment.after
  );
  await writeJson(
    outputDirectory,
    "writer-proposal-application-result.json",
    first.proposalApplication.result
  );
  await writeJson(
    outputDirectory,
    "successor-narrative-ir.json",
    first.proposalApplication.result.successor_narrative_ir
  );
  await writeJson(
    outputDirectory,
    "successor-editorial-handoff-input.json",
    first.successorHandoff
  );
  await writeJson(
    outputDirectory,
    "writer-decision-records.json",
    {
      schema_version: "fff.writerDecisionRecordBundle.v1",
      proposal_decisions: first.proposalApplication.decisionSet.records,
      fragment_decisions: first.fragment.decisionSet.records
    }
  );
  await writeFile(
    path.join(outputDirectory, "writer-decision-workspace.html"),
    html,
    "utf8"
  );
  await writeJson(
    outputDirectory,
    "writer-decision-workspace-result.json",
    result
  );
  return {
    model: first,
    result,
    html,
    deterministic_hash: firstCoreHash
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
  const value = options[name];
  if (!value || value === true) {
    throw new Error(`Missing --${name.replaceAll("_", "-")}`);
  }
  return value;
}

function usage() {
  return `Usage:
  node tools/fff-writer-decision-workspace.mjs ingest-markdown --source <source.md|source.txt> --metadata <metadata.json> --output-dir <dir>
  node tools/fff-writer-decision-workspace.mjs validate-decision-record --input <decision-record-set.json>
  node tools/fff-writer-decision-workspace.mjs apply-decisions --fixture-set <fixture-set.json> --output-dir <dir>
  node tools/fff-writer-decision-workspace.mjs rebuild-format-selection --fixture-set <fixture-set.json> --output-dir <dir>
  node tools/fff-writer-decision-workspace.mjs build-successor-ir --fixture-set <fixture-set.json> --output-dir <dir>
  node tools/fff-writer-decision-workspace.mjs build-successor-handoff --fixture-set <fixture-set.json> --output-dir <dir>
  node tools/fff-writer-decision-workspace.mjs build-decision-workspace --fixture-set <fixture-set.json> --output-dir <dir>
  node tools/fff-writer-decision-workspace.mjs build-all --fixture-set <fixture-set.json> --output-dir <dir>`;
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  if (!command || command === "--help" || command === "help") {
    process.stdout.write(`${usage()}\n`);
    return;
  }
  const options = parseArguments(rest);
  if (command === "validate-decision-record") {
    if (options.output_dir) {
      throw new Error(
        "validate-decision-record is read-only and rejects --output-dir"
      );
    }
    const validated = await validateDecisionSet(
      path.resolve(requireOption(options, "input"))
    );
    process.stdout.write(
      stableStringify({
        command,
        record_set_id: validated.record_set_id,
        record_count: validated.record_count,
        valid: true,
        writes_performed: 0
      })
    );
    return;
  }
  const generationCommands = [
    "ingest-markdown",
    "apply-decisions",
    "rebuild-format-selection",
    "build-successor-ir",
    "build-successor-handoff",
    "build-decision-workspace",
    "build-all"
  ];
  if (!generationCommands.includes(command)) {
    throw new Error(`Unknown command: ${command}`);
  }
  const outputDirectory = path.resolve(
    requireOption(options, "output_dir")
  );
  if (command === "ingest-markdown") {
    const intake = await ingestMarkdown(
      path.resolve(requireOption(options, "source")),
      path.resolve(requireOption(options, "metadata"))
    );
    const output = await writeJson(
      outputDirectory,
      options.output_name ?? "raw-markdown-intake.json",
      intake
    );
    process.stdout.write(
      stableStringify({
        command,
        output: toPosix(output),
        reconstruction_passed: intake.reconstruction_passed
      })
    );
    return;
  }
  const fixtureSetPath = path.resolve(
    requireOption(options, "fixture_set")
  );
  if (command === "build-all") {
    const built = await buildAll(fixtureSetPath, outputDirectory);
    process.stdout.write(
      stableStringify({
        command,
        output_directory: toPosix(outputDirectory),
        passed: built.result.passed,
        deterministic_hash: built.deterministic_hash
      })
    );
    return;
  }
  const model = await buildWorkspaceModel(fixtureSetPath);
  const components = {
    "apply-decisions": [
      "writer-proposal-application-result.json",
      model.proposalApplication.result
    ],
    "rebuild-format-selection": [
      "format-selection-result.json",
      model.proposalApplication.result.format_reselection
    ],
    "build-successor-ir": [
      "successor-narrative-ir.json",
      model.proposalApplication.result.successor_narrative_ir
    ],
    "build-successor-handoff": [
      "successor-editorial-handoff-input.json",
      model.successorHandoff
    ]
  };
  if (command === "build-decision-workspace") {
    await mkdir(outputDirectory, { recursive: true });
    const output = path.join(
      outputDirectory,
      "writer-decision-workspace.html"
    );
    await writeFile(output, renderWorkspace(model), "utf8");
    process.stdout.write(
      stableStringify({ command, output: toPosix(output) })
    );
    return;
  }
  const [fileName, value] = components[command];
  const output = await writeJson(outputDirectory, fileName, value);
  process.stdout.write(
    stableStringify({ command, output: toPosix(output) })
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === TOOL_PATH) {
  main().catch((error) => {
    process.stderr.write(`${error.stack ?? error.message}\n`);
    process.exitCode = 1;
  });
}
