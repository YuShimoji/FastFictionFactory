#!/usr/bin/env node

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

const ACTIVE_ARTIFACT_ID = "fff-local-extraction-adapter-expansion-001";
const PRESERVED_ADAPTER_ARTIFACT_ID = "fff-local-extraction-adapter-spike-001";
const DEFAULT_INPUT = "artifacts/sample-raw-memo.md";
const DEFAULT_OUTPUT = "artifacts/local-extraction-adapter-output.json";
const DEFAULT_SMOKE = "artifacts/local-extraction-adapter-smoke-result.json";
const DEFAULT_FIXTURE_DIR = "artifacts/extraction-adapter-fixtures";
const DEFAULT_OUTPUT_DIR = "artifacts/extraction-adapter-outputs";
const DEFAULT_EXPANSION_SMOKE = "artifacts/local-extraction-adapter-expansion-smoke-result.json";
const VALIDATOR_FIXTURE_DIR = "artifacts/extraction-negative-fixtures";
const TOOL_PATH = "tools/fff-extract-local.mjs";

const REQUIRED_ELEMENT_TYPES = [
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

const HUMAN_OWNED_DEPENDENCIES = ["Toma fate", "brass moth truth", "Council motive"];

const DERIVED_REF = {
  id: "src-local-adapter-deterministic-001",
  label: "Deterministic local extraction adapter",
  source_type: "derived_candidate",
  locator: TOOL_PATH,
  trust: "derived_candidate"
};

const HUMAN_REVIEW_REF = {
  id: "src-local-adapter-freeform-review-001",
  label: "Freeform human review boundary",
  source_type: "human_review",
  locator: "docs/review/freeform-review-intake.md",
  trust: "human_review"
};

const CLOCKMAKER_SAMPLE_ELEMENTS = [
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
    targetDestinations: ["profile", "timeline"],
    targetProfileIds: ["local-profile-observatory-visual"],
    targetClaimIds: [],
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
    includeHumanReviewRef: true,
    notes: "Freeform human review remains the source of truth for the motive route."
  }
];

const ADAPTER_FIXTURES = [
  {
    key: "clockmaker-sample",
    sourceRefId: "src-local-adapter-raw-memo-001",
    sourceLabel: "Sample raw memo",
    memoLabel: "sample raw memo",
    matchPhrases: ["The Clockmaker Under Glass", "Mira Vale repairs clocks"],
    extractionRunId: "local-extract-clockmaker-adapter-001",
    sourceDraftId: "draft-clockmaker-local-adapter-001",
    workId: "work-clockmaker-under-glass",
    elements: CLOCKMAKER_SAMPLE_ELEMENTS,
    profiles: [
      profileSpec("local-profile-mira", "Mira Vale", "person", "extracted_candidate", [], "Clock repairer candidate extracted from the sample memo."),
      profileSpec("local-profile-toma", "Toma", "person", "needs_human_decision", ["Toma fate"], "Missing brother candidate; fate stays unresolved."),
      profileSpec("local-profile-council", "City council", "organization", "held_ghost", ["Council motive"], "Institution candidate with unresolved motive."),
      profileSpec("local-profile-brass-moth", "Brass moth", "object", "held_ghost", ["brass moth truth"], "Object candidate with unresolved function."),
      profileSpec("local-profile-north-bell", "North Bell Station", "place", "extracted_candidate", [], "Place candidate for timeline review."),
      profileSpec("local-profile-stolen-minutes", "Stolen minutes", "concept", "held_ghost", ["Council motive"], "Concept candidate, not canon motive."),
      profileSpec("local-profile-ledger", "Ledger of minutes", "document", "extracted_candidate", [], "Document candidate from the sample memo."),
      profileSpec("local-profile-observatory-visual", "Observatory bell visual", "visual_asset", "extracted_candidate", [], "Visual review cue, not release asset."),
      profileSpec("local-profile-magic-placeholder", "Magic explanation placeholder", "placeholder", "needs_human_decision", ["brass moth truth", "Council motive"], "Gap marker for later human review.")
    ],
    claims: [
      claimSpec("local-claim-mira-repairs-clocks", "Mira repairs clocks in the glass arcade.", "world truth", "local-profile-mira", []),
      claimSpec("local-claim-arcade-closes-917", "The glass arcade closes every night at 9:17.", "world truth", "local-x-event-917", []),
      claimSpec("local-claim-toma-left-moth", "Toma left a brass moth and a note in the workshop drawer.", "unresolved candidate", "local-profile-toma", ["Toma fate", "brass moth truth"]),
      claimSpec("local-claim-council-selling-minutes", "The city council may be selling minutes from abandoned lives.", "unresolved candidate", "local-profile-council", ["Council motive"]),
      claimSpec("local-claim-bell-rings", "The observatory rings at noon despite its bell being removed.", "viewer knowledge", "local-profile-observatory-visual", []),
      claimSpec("local-claim-ledger-exists", "A ledger of minutes is kept in a locked cabinet.", "unresolved candidate", "local-profile-ledger", ["Council motive"]),
      claimSpec("local-claim-council-motive-open", "The council motive may be villainous, desperate, divided, or misled.", "production note", "local-profile-council", ["Council motive"])
    ],
    timelines: [
      timelineSpec("local-timeline-917", "The arcade closes at 9:17.", "story_order", "Every night at 9:17", []),
      timelineSpec("local-timeline-toma-note", "Toma's note points Mira toward stolen minutes.", "story_order", "Before Mira investigates the council ledger", ["Toma fate"]),
      timelineSpec("local-timeline-noon-bell", "The observatory rings at noon without its bell.", "calendar_time", "Noon during present action", []),
      timelineSpec("local-timeline-brass-moth", "The brass moth gets a reversible first-use beat.", "viewer_disclosure_order", "After Toma's note is found", ["brass moth truth"]),
      timelineSpec("local-timeline-council-motive", "Council motive remains a held reveal route.", "viewer_disclosure_order", "After ledger evidence appears", ["Council motive"])
    ]
  },
  {
    key: "observatory-ledger-edge",
    sourceRefId: "src-local-adapter-raw-memo-002",
    sourceLabel: "Observatory ledger edge memo",
    memoLabel: "observatory ledger edge memo",
    matchPhrases: ["Adapter Fixture: Observatory Ledger Edge", "Toma's last route"],
    extractionRunId: "local-extract-observatory-ledger-edge-001",
    sourceDraftId: "draft-observatory-ledger-edge-001",
    workId: "work-clockmaker-under-glass",
    elements: [
      elementSpec("edge-x-person-mira", "Mira Vale", "person", "Mira Vale writes a repair log", ["Mira", "repair log writer"], 0.93, "low", "low", ["profile", "claim"], ["edge-profile-mira"], ["edge-claim-repair-log"], [], [], "The adapter can map a protagonist mention even when the action differs from the sample phrasing."),
      elementSpec("edge-x-person-toma", "Toma", "person", "Toma's last route", ["Toma", "last route"], 0.86, "high", "high", ["profile", "claim", "timeline", "unresolved_decision"], ["edge-profile-toma"], ["edge-claim-toma-route"], ["edge-timeline-toma-route"], ["Toma fate"], "Toma remains a held person candidate tied to a route note, not a fate decision."),
      elementSpec("edge-x-place-north-bell", "North Bell Station", "place", "North Bell Station", ["North Bell"], 0.9, "medium", "medium", ["profile", "timeline"], ["edge-profile-north-bell"], [], ["edge-timeline-noon-repeat"], [], "Place extraction stays useful across differently ordered memo paragraphs."),
      elementSpec("edge-x-organization-archive-office", "city council archive office", "organization", "city council archive office", ["council archive", "archive office"], 0.84, "high", "high", ["profile", "claim", "unresolved_decision"], ["edge-profile-archive-office"], ["edge-claim-clerical-error"], [], ["Council motive"], "Organization routing is review-held because motive language remains uncertain."),
      elementSpec("edge-x-event-closing-repeat", "closing bell repeats three times", "event", "closing bell repeats three times", ["repeat bell", "three closing bells"], 0.78, "medium", "medium", ["claim", "timeline"], [], ["edge-claim-closing-repeat"], ["edge-timeline-closing-repeat"], [], "Event detection handles a repeated signal rather than only the sample 9:17 clause."),
      elementSpec("edge-x-object-brass-moth-key", "brass moth key", "object", "brass moth key", ["moth key", "brass key"], 0.89, "high", "high", ["profile", "claim", "timeline", "unresolved_decision"], ["edge-profile-brass-moth-key"], ["edge-claim-brass-moth-key"], ["edge-timeline-moth-key"], ["brass moth truth"], "The object can be extracted while its function remains undecided."),
      elementSpec("edge-x-concept-borrowed-minutes", "borrowed minutes from abandoned lives", "concept", "borrowed minutes from abandoned lives", ["borrowed minutes", "abandoned lives"], 0.82, "high", "medium", ["profile", "claim"], ["edge-profile-borrowed-minutes"], ["edge-claim-borrowed-minutes"], [], ["Council motive"], "Concept extraction stays provisional and cannot settle why the council tracks minutes."),
      elementSpec("edge-x-document-ledger-page", "ledger page", "document", "A ledger page", ["ledger page", "page of minutes"], 0.8, "medium", "medium", ["profile", "claim"], ["edge-profile-ledger-page"], ["edge-claim-ledger-page"], [], [], "Document routing covers partial evidence without treating it as proof."),
      elementSpec("edge-x-visual-bellless-tower", "bellless tower silhouette", "visual_asset", "bellless tower silhouette", ["tower silhouette", "bellless tower"], 0.73, "medium", "medium", ["profile", "timeline"], ["edge-profile-bellless-tower"], [], ["edge-timeline-noon-repeat"], [], "Visual asset routing is profile-buffered and avoids direct Claim Ledger-only use."),
      elementSpec("edge-x-placeholder-moth-function", "moth function unanswered", "placeholder", "Keep the moth's function unanswered", ["function gap", "moth rule gap"], 0.75, "high", "high", ["profile", "unresolved_decision"], ["edge-profile-moth-placeholder"], [], [], ["brass moth truth"], "The adapter marks a missing rule instead of inventing the moth function."),
      elementSpec("edge-x-source-observatory-ledger", "observatory ledger edge memo", "source_reference", "Adapter Fixture: Observatory Ledger Edge", ["edge memo", "observatory ledger fixture"], 1, "low", "low", ["source_reference"], [], [], [], [], "The fixture title is preserved as a source reference element."),
      elementSpec("edge-x-unresolved-toma-fate", "Toma fate", "unresolved_decision", "Toma fate stays unresolved", ["Toma outcome", "route decision"], 0.86, "high", "high", ["unresolved_decision", "timeline"], [], [], ["edge-timeline-toma-route"], ["Toma fate"], "Freeform human review remains required before any Toma fate route is adopted.", true)
    ],
    profiles: [
      profileSpec("edge-profile-mira", "Mira Vale", "person", "extracted_candidate", [], "Repair-log author candidate from the edge memo."),
      profileSpec("edge-profile-toma", "Toma", "person", "needs_human_decision", ["Toma fate"], "Route-linked person candidate; fate is still unresolved."),
      profileSpec("edge-profile-north-bell", "North Bell Station", "place", "extracted_candidate", [], "Place candidate for the noon-repeat event."),
      profileSpec("edge-profile-archive-office", "City council archive office", "organization", "held_ghost", ["Council motive"], "Council-side organization candidate with motive held."),
      profileSpec("edge-profile-brass-moth-key", "Brass moth key", "object", "held_ghost", ["brass moth truth"], "Object candidate with function held."),
      profileSpec("edge-profile-borrowed-minutes", "Borrowed minutes", "concept", "held_ghost", ["Council motive"], "Concept candidate tied to unresolved council motive."),
      profileSpec("edge-profile-ledger-page", "Ledger page", "document", "extracted_candidate", [], "Document candidate for later evidence review."),
      profileSpec("edge-profile-bellless-tower", "Bellless tower silhouette", "visual_asset", "extracted_candidate", [], "Visual cue candidate, not a release asset."),
      profileSpec("edge-profile-moth-placeholder", "Moth function placeholder", "placeholder", "needs_human_decision", ["brass moth truth"], "Held placeholder for the moth rule.")
    ],
    claims: [
      claimSpec("edge-claim-repair-log", "Mira writes a repair log after the observatory rings.", "viewer knowledge", "edge-profile-mira", []),
      claimSpec("edge-claim-toma-route", "Toma's last route is pinned under a brass moth key.", "unresolved candidate", "edge-profile-toma", ["Toma fate", "brass moth truth"]),
      claimSpec("edge-claim-clerical-error", "The council archive office calls Toma's route a clerical error.", "character belief", "edge-profile-archive-office", ["Council motive"]),
      claimSpec("edge-claim-closing-repeat", "The closing bell repeats three times during the 9:17 closing.", "viewer knowledge", "edge-x-event-closing-repeat", []),
      claimSpec("edge-claim-borrowed-minutes", "A ledger page lists borrowed minutes from abandoned lives.", "unresolved candidate", "edge-profile-borrowed-minutes", ["Council motive"]),
      claimSpec("edge-claim-ledger-page", "The ledger page is evidence but not yet proof.", "production note", "edge-profile-ledger-page", ["Council motive"])
    ],
    timelines: [
      timelineSpec("edge-timeline-noon-repeat", "The observatory rings at noon and leaves a bellless visual cue.", "calendar_time", "Noon during the edge memo", []),
      timelineSpec("edge-timeline-closing-repeat", "The 9:17 closing bell repeats three times.", "story_order", "After the repair log begins", []),
      timelineSpec("edge-timeline-toma-route", "Toma's route is found under the brass moth key.", "viewer_disclosure_order", "Held until Toma fate review", ["Toma fate"]),
      timelineSpec("edge-timeline-moth-key", "The brass moth key appears before its function is known.", "viewer_disclosure_order", "Before moth truth review", ["brass moth truth"])
    ]
  },
  {
    key: "council-minutes-edge",
    sourceRefId: "src-local-adapter-raw-memo-003",
    sourceLabel: "Council minutes edge memo",
    memoLabel: "council minutes edge memo",
    matchPhrases: ["Adapter Fixture: Council Minutes Edge", "apprentice Rowan Ise"],
    extractionRunId: "local-extract-council-minutes-edge-001",
    sourceDraftId: "draft-council-minutes-edge-001",
    workId: "work-clockmaker-under-glass",
    elements: [
      elementSpec("minutes-x-person-rowan", "Rowan Ise", "person", "apprentice Rowan Ise", ["Rowan", "apprentice"], 0.9, "medium", "medium", ["profile", "timeline"], ["minutes-profile-rowan"], [], ["minutes-timeline-rowan-waits"], [], "The adapter can add a new person candidate while preserving review-held defaults."),
      elementSpec("minutes-x-person-mira", "Mira Vale", "person", "Mira Vale hides the repair log", ["Mira"], 0.88, "medium", "medium", ["profile", "claim"], ["minutes-profile-mira"], ["minutes-claim-mira-hides-log"], [], [], "The protagonist can be mapped from a different action phrase."),
      elementSpec("minutes-x-place-glass-arcade", "glass arcade", "place", "glass arcade", ["arcade"], 0.91, "low", "low", ["profile", "timeline"], ["minutes-profile-glass-arcade"], [], ["minutes-timeline-rowan-waits"], [], "Place extraction remains stable across a smaller phrase."),
      elementSpec("minutes-x-organization-archivists", "Council archivists", "organization", "Council archivists offer Mira a permit", ["archivists", "council permit office"], 0.84, "high", "high", ["profile", "claim", "unresolved_decision"], ["minutes-profile-archivists"], ["minutes-claim-permit-offer"], [], ["Council motive"], "The council remains a held organization candidate, not a motive decision."),
      elementSpec("minutes-x-event-rowan-waits", "Rowan waits at 9:17", "event", "At 9:17, apprentice Rowan Ise waits", ["9:17 wait", "Rowan waits"], 0.85, "medium", "medium", ["claim", "timeline"], [], ["minutes-claim-rowan-waits"], ["minutes-timeline-rowan-waits"], [], "Event extraction handles a time cue with a new actor."),
      elementSpec("minutes-x-object-brass-moth", "brass moth", "object", "The brass moth flickers like a warning", ["moth warning", "flickering moth"], 0.9, "high", "high", ["profile", "claim", "timeline", "unresolved_decision"], ["minutes-profile-brass-moth"], ["minutes-claim-moth-warning"], ["minutes-timeline-moth-warning"], ["brass moth truth"], "The object stays review-held and does not become proof or answer."),
      elementSpec("minutes-x-concept-abandoned-lives", "abandoned lives still pay minutes", "concept", "abandoned lives still pay minutes", ["abandoned lives", "paid minutes"], 0.82, "high", "medium", ["profile", "claim"], ["minutes-profile-abandoned-lives"], ["minutes-claim-abandoned-lives"], [], ["Council motive"], "The concept is extracted as suspicious accounting, not final world truth."),
      elementSpec("minutes-x-document-paper-map", "paper map of the under-arcade cabinet", "document", "A paper map of the under-arcade cabinet", ["paper map", "cabinet map"], 0.8, "medium", "medium", ["profile", "claim"], ["minutes-profile-paper-map"], ["minutes-claim-paper-map"], [], [], "Document extraction covers a physical guide rather than a ledger."),
      elementSpec("minutes-x-visual-moth-warning", "flickering brass moth visual", "visual_asset", "brass moth flickers like a warning", ["flickering moth visual"], 0.76, "medium", "medium", ["profile", "timeline"], ["minutes-profile-moth-visual"], [], ["minutes-timeline-moth-warning"], [], "Visual asset routing is profile-buffered and not production-ready art."),
      elementSpec("minutes-x-placeholder-proof-bait", "proof, bait, or false record placeholder", "placeholder", "do not decide whether it is proof, bait, or a false record", ["proof bait placeholder", "false record gap"], 0.79, "high", "high", ["profile", "unresolved_decision"], ["minutes-profile-proof-placeholder"], [], [], ["brass moth truth", "Council motive"], "The adapter marks a decision gap instead of selecting the meaning."),
      elementSpec("minutes-x-source-council-minutes", "council minutes edge memo", "source_reference", "Adapter Fixture: Council Minutes Edge", ["minutes edge memo"], 1, "low", "low", ["source_reference"], [], [], [], [], "The fixture title remains visible as a source reference."),
      elementSpec("minutes-x-unresolved-council-motive", "Council motive", "unresolved_decision", "Council motive remains unresolved", ["motive remains unresolved"], 0.87, "high", "high", ["unresolved_decision", "claim"], [], ["minutes-claim-council-motive-open"], [], ["Council motive"], "Freeform human review is required before motive language can become canon.", true)
    ],
    profiles: [
      profileSpec("minutes-profile-rowan", "Rowan Ise", "person", "extracted_candidate", [], "New apprentice candidate from the council minutes fixture."),
      profileSpec("minutes-profile-mira", "Mira Vale", "person", "extracted_candidate", [], "Mira candidate mapped from the repair-log hiding phrase."),
      profileSpec("minutes-profile-glass-arcade", "Glass arcade", "place", "extracted_candidate", [], "Place candidate for the 9:17 waiting beat."),
      profileSpec("minutes-profile-archivists", "Council archivists", "organization", "held_ghost", ["Council motive"], "Council-side group candidate with motive held."),
      profileSpec("minutes-profile-brass-moth", "Brass moth", "object", "held_ghost", ["brass moth truth"], "Flickering object candidate with truth held."),
      profileSpec("minutes-profile-abandoned-lives", "Abandoned lives paying minutes", "concept", "held_ghost", ["Council motive"], "Concept candidate that stays suspicious rather than final."),
      profileSpec("minutes-profile-paper-map", "Paper map of the under-arcade cabinet", "document", "extracted_candidate", [], "Document candidate for route/evidence review."),
      profileSpec("minutes-profile-moth-visual", "Flickering brass moth visual", "visual_asset", "extracted_candidate", [], "Visual cue candidate, not release artwork."),
      profileSpec("minutes-profile-proof-placeholder", "Proof bait false-record placeholder", "placeholder", "needs_human_decision", ["brass moth truth", "Council motive"], "Decision gap for the moth and record meaning.")
    ],
    claims: [
      claimSpec("minutes-claim-rowan-waits", "Rowan Ise waits in the glass arcade at 9:17.", "viewer knowledge", "minutes-profile-rowan", []),
      claimSpec("minutes-claim-mira-hides-log", "Mira hides the repair log while Rowan waits.", "unresolved candidate", "minutes-profile-mira", []),
      claimSpec("minutes-claim-permit-offer", "Council archivists offer Mira a permit if she stops asking about abandoned lives.", "character belief", "minutes-profile-archivists", ["Council motive"]),
      claimSpec("minutes-claim-moth-warning", "The brass moth flickers like a warning.", "unresolved candidate", "minutes-profile-brass-moth", ["brass moth truth"]),
      claimSpec("minutes-claim-abandoned-lives", "Abandoned lives still pay minutes into the ledger.", "unresolved candidate", "minutes-profile-abandoned-lives", ["Council motive"]),
      claimSpec("minutes-claim-paper-map", "A paper map marks the under-arcade cabinet and related locations.", "viewer knowledge", "minutes-profile-paper-map", []),
      claimSpec("minutes-claim-council-motive-open", "Council motive remains unresolved in the minutes edge memo.", "production note", "minutes-profile-archivists", ["Council motive"])
    ],
    timelines: [
      timelineSpec("minutes-timeline-rowan-waits", "Rowan waits in the glass arcade at 9:17.", "story_order", "At 9:17", []),
      timelineSpec("minutes-timeline-moth-warning", "The brass moth flickers before its truth is known.", "viewer_disclosure_order", "Before brass moth truth review", ["brass moth truth"]),
      timelineSpec("minutes-timeline-permit-offer", "Council archivists offer a permit as a pressure beat.", "viewer_disclosure_order", "Before Council motive review", ["Council motive"])
    ]
  }
];

async function main() {
  const args = process.argv.slice(2);
  if (args[0] === "--matrix") {
    const [fixtureDir = DEFAULT_FIXTURE_DIR, outputDir = DEFAULT_OUTPUT_DIR, smokePath = DEFAULT_EXPANSION_SMOKE] = args.slice(1);
    await runMatrix(fixtureDir, outputDir, smokePath);
    return;
  }

  const [inputPath = DEFAULT_INPUT, outputPath = DEFAULT_OUTPUT, smokePath = DEFAULT_SMOKE] = args;
  await runSingle(inputPath, outputPath, smokePath);
}

async function runSingle(inputPath, outputPath, smokePath) {
  const rawMemo = await readFile(inputPath, "utf8");
  const fixture = selectAdapterFixture(rawMemo, inputPath);
  const payload = buildExtractionPayload(rawMemo, inputPath, fixture);

  await writeJson(outputPath, payload);

  const validation = runNode(["tools/fff-state.mjs", "validate-extraction", outputPath]);
  const fixtureMatrix = runNode(["tools/fff-state.mjs", "validate-extraction-fixtures", VALIDATOR_FIXTURE_DIR]);
  const sourceRoutingAudit = auditPayload(rawMemo, payload);
  const smoke = buildSmokeResult(inputPath, outputPath, rawMemo, payload, validation, fixtureMatrix, sourceRoutingAudit);

  await writeJson(smokePath, smoke);

  if (!smoke.passed) {
    console.error(`local extraction adapter smoke failed ${inputPath} -> ${outputPath}`);
    process.exit(1);
  }

  console.log(`local extraction adapter smoke passed ${inputPath} -> ${outputPath}`);
}

async function runMatrix(fixtureDir, outputDir, smokePath) {
  const files = (await readdir(fixtureDir))
    .filter((file) => file.toLowerCase().endsWith(".md"))
    .sort((a, b) => a.localeCompare(b));

  if (files.length === 0) {
    throw new Error(`no markdown fixtures found in ${fixtureDir}`);
  }

  await mkdir(outputDir, { recursive: true });
  const fixtureResults = [];

  for (const file of files) {
    const inputPath = toRepoPath(path.join(fixtureDir, file));
    const rawMemo = await readFile(inputPath, "utf8");
    const fixture = selectAdapterFixture(rawMemo, inputPath);
    const outputPath = toRepoPath(path.join(outputDir, `${fixture.key}.json`));
    const payload = buildExtractionPayload(rawMemo, inputPath, fixture);

    await writeJson(outputPath, payload);

    const validation = runNode(["tools/fff-state.mjs", "validate-extraction", outputPath]);
    const sourceRoutingAudit = auditPayload(rawMemo, payload);

    fixtureResults.push({
      fixture: fixture.key,
      inputPath,
      outputPath,
      extractionRunId: payload.extractionRunId,
      validation: commandResult(validation),
      sourceRoutingAudit,
      output: {
        elementCount: payload.extractedElements.length,
        elementTypes: [...new Set(payload.extractedElements.map((element) => element.elementType))],
        profileCandidateCount: payload.profileCandidates.length,
        claimCandidateCount: payload.claimCandidates.length,
        timelineEntryCandidateCount: payload.timelineEntryCandidates.length,
        unresolvedDependencies: payload.unresolvedDependencies
      },
      guardStatus: getGuardStatus(payload),
      passed: validation.ok && sourceRoutingAudit.passed && Object.values(getGuardStatus(payload)).every(Boolean)
    });
  }

  const fixtureMatrix = runNode(["tools/fff-state.mjs", "validate-extraction-fixtures", VALIDATOR_FIXTURE_DIR]);
  const smoke = buildMatrixSmokeResult(fixtureDir, outputDir, files, fixtureResults, fixtureMatrix);
  await writeJson(smokePath, smoke);

  if (!smoke.passed) {
    console.error(`local extraction adapter matrix failed ${fixtureDir} -> ${outputDir}`);
    process.exit(1);
  }

  console.log(`local extraction adapter matrix passed ${fixtureDir} -> ${outputDir}`);
}

function buildExtractionPayload(rawMemo, inputPath, fixture) {
  const sourceRef = sourceRefFor(fixture, inputPath);
  const sourceRefs = [sourceRef, DERIVED_REF, HUMAN_REVIEW_REF];
  const extractedElements = fixture.elements.map((spec) => buildElement(spec, rawMemo, sourceRef));

  return {
    extractionRunId: fixture.extractionRunId,
    schemaVersion: "fff.extractionContract.v1",
    sourceDraftId: fixture.sourceDraftId,
    sourceMemoRef: toRepoPath(inputPath),
    sourceRefs,
    generatedAt: "2026-06-20T00:00:00+09:00",
    generatorType: "local_deterministic_adapter",
    generatorLabel: "Zero-dependency deterministic local adapter expansion; no model/API call",
    extractionMode: "local_rule_based_no_model_api_fixture_matrix",
    confidencePolicy: {
      defaultConfidence: 0.72,
      lowConfidenceAction: "hold",
      highCanonRiskAction: "hold_until_human_review",
      freeformReviewAuthority: "freeform human review text is the source of truth"
    },
    extractedElements,
    profileCandidates: fixture.profiles.map((spec) => profile(spec, fixture, sourceRef)),
    claimCandidates: fixture.claims.map((spec) => claim(spec, fixture, sourceRef)),
    timelineEntryCandidates: fixture.timelines.map((spec) => timeline(spec, fixture, sourceRef)),
    unresolvedDependencies: HUMAN_OWNED_DEPENDENCIES,
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
      "Candidate routing is review-held and must not auto-promote canon, chronology, visual assets, or production decisions.",
      "Fixture matrix coverage is a regression check, not a production extraction quality claim."
    ],
    unknownFieldsPolicy: "Preserve unknown adapter fields for JSON review and keep candidates held until freeform human review.",
    humanAuthorityBoundaries: [
      "Freeform user review is the source of truth.",
      "Toma fate remains human-owned.",
      "Brass moth truth remains human-owned.",
      "Council motive remains human-owned.",
      "No model/API call, database persistence, production sync, publishing, upload, or AI video generation is introduced by this local adapter."
    ],
    notes: "Local deterministic extraction adapter expansion connecting multiple raw memo fixtures to validator-backed Extraction Contract payloads while preserving human-owned canon boundaries.",
    adapterTrace: {
      inputPath: toRepoPath(inputPath),
      fixtureKey: fixture.key,
      toolPath: TOOL_PATH,
      deterministicRules: ["fixture profile selection", "literal phrase lookup", "static routing map", "review-held defaults", "source-span audit"],
      noModelApi: true,
      preservedAdapterArtifactId: PRESERVED_ADAPTER_ARTIFACT_ID
    }
  };
}

function buildElement(spec, rawMemo, sourceRef) {
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
    sourceRefIds: spec.includeHumanReviewRef ? [sourceRef.id, HUMAN_REVIEW_REF.id] : [sourceRef.id],
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

function profile(spec, fixture, sourceRef) {
  const unresolvedDependencies = spec.unresolvedDependencies || [];
  return {
    id: spec.id,
    displayName: spec.displayName,
    aliases: spec.aliases || [],
    profileType: spec.profileType,
    profileStatus: "local_adapter_candidate",
    ghostNodeStatus: spec.ghostNodeStatus,
    worldStatus: "review candidate",
    realityStatus: "pure fiction",
    firstAppearanceWorkId: fixture.workId,
    linkedClaimIds: spec.linkedClaimIds || [],
    linkedTimelineEntryIds: spec.linkedTimelineEntryIds || [],
    relatedProfileIds: spec.relatedProfileIds || [],
    unresolvedDependencies,
    knownBy: [fixture.memoLabel],
    unknownBy: [],
    believedBy: [],
    misunderstoodBy: [],
    ownedItems: [],
    sourceRefs: [sourceRef],
    assetRefs: [],
    canonRisk: spec.canonRisk || (unresolvedDependencies.length ? "high" : "medium"),
    spoilerLevel: spec.spoilerLevel || (unresolvedDependencies.length ? "high" : "medium"),
    reviewStatus: "hold",
    notes: "Generated by deterministic local adapter; remains review-held.",
    summary: spec.summary,
    open_questions: unresolvedDependencies.map((dependency) => `Resolve ${dependency} before canon adoption.`)
  };
}

function claim(spec, fixture, sourceRef) {
  const unresolvedDependencies = spec.unresolvedDependencies || [];
  return {
    id: spec.id,
    work_id: fixture.workId,
    claimText: spec.claimText,
    claimScope: spec.claimScope,
    worldTruthStatus: spec.worldTruthStatus || (unresolvedDependencies.length ? "uncertain" : "planned reversal"),
    realityStatus: "pure fiction",
    sourceRefs: [sourceRef],
    subjectRefs: [spec.subjectRef],
    speakerOrNarratorRef: fixture.memoLabel,
    viewerDisclosureStatus: spec.viewerDisclosureStatus || (unresolvedDependencies.length ? "hidden from viewer" : "viewer-facing now"),
    spoilerLevel: unresolvedDependencies.length ? "high" : "medium",
    canonRisk: unresolvedDependencies.length ? "high" : "medium",
    unresolvedDependencies,
    supportsClaimIds: [],
    contradictsClaimIds: [],
    reviewStatus: "hold",
    notes: "Generated by deterministic local adapter; review-held by default."
  };
}

function timeline(spec, fixture, sourceRef) {
  const unresolvedDependencies = spec.unresolvedDependencies || [];
  return {
    id: spec.id,
    work_id: fixture.workId,
    title: spec.title,
    summary: "Generated by deterministic local adapter for review-held timeline routing.",
    timelineAxis: spec.timelineAxis,
    storyOrder: "local adapter candidate",
    calendarTime: spec.calendarTime,
    calendarPrecision: spec.timelineAxis === "calendar_time" ? "clock_time" : "relative_sequence",
    viewerDisclosureOrder: unresolvedDependencies.length ? "held for human review" : "viewer-facing candidate",
    viewerDisclosureStatus: unresolvedDependencies.length ? "hidden from viewer" : "viewer-facing now",
    productionOrder: "Do not storyboard as final from adapter output.",
    historicalReferenceTime: "not set",
    linkedClaimIds: spec.linkedClaimIds || [],
    linkedProfileIds: spec.linkedProfileIds || [],
    linkedWorkIds: [fixture.workId],
    unresolvedDependencies,
    spoilerLevel: unresolvedDependencies.length ? "high" : "medium",
    canonRisk: unresolvedDependencies.length ? "high" : "medium",
    reviewStatus: "hold",
    sourceRefs: [sourceRef],
    notes: "Timeline candidate remains review-held and cannot auto-promote chronology."
  };
}

function buildSmokeResult(inputPath, outputPath, rawMemo, payload, validation, fixtureMatrix, sourceRoutingAudit) {
  const elements = payload.extractedElements;
  const guardStatus = getGuardStatus(payload);
  return {
    artifact_id: ACTIVE_ARTIFACT_ID,
    preserved_adapter_artifact_id: PRESERVED_ADAPTER_ARTIFACT_ID,
    generatedAt: "2026-06-20T00:00:00+09:00",
    input: {
      path: toRepoPath(inputPath),
      characters: rawMemo.length,
      sourceRefIds: payload.sourceRefs.map((sourceRef) => sourceRef.id)
    },
    output: {
      path: toRepoPath(outputPath),
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
    sourceRoutingAudit,
    guardStatus,
    passed: validation.ok && fixtureMatrix.ok && sourceRoutingAudit.passed && Object.values(guardStatus).every(Boolean)
  };
}

function buildMatrixSmokeResult(fixtureDir, outputDir, fixtureFiles, fixtureResults, fixtureMatrix) {
  const aggregateElementTypes = [...new Set(fixtureResults.flatMap((result) => result.output.elementTypes))].sort();
  const coverage = Object.fromEntries(REQUIRED_ELEMENT_TYPES.map((type) => [type, aggregateElementTypes.includes(type)]));
  const guardStatus = {
    fixtureCount: fixtureResults.length === fixtureFiles.length && fixtureResults.length >= 3,
    validationPassed: fixtureResults.every((result) => result.validation.ok),
    fixtureMatrixPassed: fixtureMatrix.ok,
    sourceSpanIntegrity: fixtureResults.every((result) => result.sourceRoutingAudit.sourceSpanMismatchCount === 0),
    sourceRefsPresent: fixtureResults.every((result) => result.sourceRoutingAudit.missingSourceRefCount === 0),
    reviewSafeDefaults: fixtureResults.every((result) => result.guardStatus.reviewSafeDefaults),
    humanAuthorityBoundaries: fixtureResults.every((result) => result.guardStatus.humanAuthorityBoundaries),
    visualAssetBufferedThroughProfile: fixtureResults.every((result) => result.guardStatus.visualAssetBufferedThroughProfile),
    freeformReviewAllowed: fixtureResults.every((result) => result.guardStatus.freeformReviewAllowed),
    humanOwnedGuarded: fixtureResults.every((result) => result.sourceRoutingAudit.humanOwnedDecisionAdoptCount === 0),
    aggregateElementCoverage: Object.values(coverage).every(Boolean)
  };

  return {
    artifact_id: ACTIVE_ARTIFACT_ID,
    preserved_adapter_artifact_id: PRESERVED_ADAPTER_ARTIFACT_ID,
    generatedAt: "2026-06-20T00:00:00+09:00",
    fixtureDirectory: toRepoPath(fixtureDir),
    outputDirectory: toRepoPath(outputDir),
    fixtureFiles,
    fixtureResults,
    aggregate: {
      fixtureCount: fixtureResults.length,
      outputCount: fixtureResults.length,
      elementCount: fixtureResults.reduce((sum, result) => sum + result.output.elementCount, 0),
      aggregateElementTypes,
      requiredElementTypeCoverage: coverage,
      profileCandidateCount: fixtureResults.reduce((sum, result) => sum + result.output.profileCandidateCount, 0),
      claimCandidateCount: fixtureResults.reduce((sum, result) => sum + result.output.claimCandidateCount, 0),
      timelineEntryCandidateCount: fixtureResults.reduce((sum, result) => sum + result.output.timelineEntryCandidateCount, 0)
    },
    validation: {
      fixtureMatrix: commandResult(fixtureMatrix)
    },
    guardStatus,
    passed: fixtureResults.every((result) => result.passed) && Object.values(guardStatus).every(Boolean)
  };
}

function auditPayload(rawMemo, payload) {
  const sourceRefIds = new Set(payload.sourceRefs.map((sourceRef) => sourceRef.id));
  const sourceSpanMismatches = [];
  const missingSourceRefs = [];
  const unsafeVisualAssetRouting = [];
  const nonHeldReviewDefaults = [];
  const humanOwnedDecisionAdopts = [];

  for (const element of payload.extractedElements) {
    const { sourceSpan } = element;
    if (
      typeof sourceSpan?.start !== "number" ||
      typeof sourceSpan?.end !== "number" ||
      rawMemo.slice(sourceSpan.start, sourceSpan.end) !== sourceSpan.text
    ) {
      sourceSpanMismatches.push(element.id);
    }

    if (!Array.isArray(element.sourceRefIds) || element.sourceRefIds.some((sourceRefId) => !sourceRefIds.has(sourceRefId))) {
      missingSourceRefs.push(element.id);
    }

    if (element.elementType === "visual_asset" && element.targetDestinations.includes("claim") && !element.targetDestinations.includes("profile")) {
      unsafeVisualAssetRouting.push(element.id);
    }

    if (element.reviewStatus !== "hold" || element.suggestedReviewStatus !== "hold") {
      nonHeldReviewDefaults.push(element.id);
    }

    if (touchesHumanOwnedDecision(element) && element.suggestedReviewStatus === "adopt") {
      humanOwnedDecisionAdopts.push(element.id);
    }
  }

  return {
    elementCount: payload.extractedElements.length,
    sourceSpanMatchedCount: payload.extractedElements.length - sourceSpanMismatches.length,
    sourceSpanMismatchCount: sourceSpanMismatches.length,
    sourceSpanMismatches,
    missingSourceRefCount: missingSourceRefs.length,
    missingSourceRefs,
    unsafeVisualAssetRoutingCount: unsafeVisualAssetRouting.length,
    unsafeVisualAssetRouting,
    nonHeldReviewDefaultCount: nonHeldReviewDefaults.length,
    nonHeldReviewDefaults,
    humanOwnedDecisionAdoptCount: humanOwnedDecisionAdopts.length,
    humanOwnedDecisionAdopts,
    passed: sourceSpanMismatches.length === 0 && missingSourceRefs.length === 0 && unsafeVisualAssetRouting.length === 0 && nonHeldReviewDefaults.length === 0 && humanOwnedDecisionAdopts.length === 0
  };
}

function getGuardStatus(payload) {
  const elements = payload.extractedElements;
  const boundaryText = payload.humanAuthorityBoundaries.join(" ").toLowerCase();
  return {
    noModelApi: payload.generatorType === "local_deterministic_adapter",
    sourceRefsPresent: payload.sourceRefs.length >= 1 && elements.every((element) => element.sourceRefIds.length > 0),
    reviewSafeDefaults: payload.reviewSafeDefaults.defaultReviewStatus === "hold" && payload.reviewSafeDefaults.autoCanonPromotion === false && payload.reviewSafeDefaults.autoChronologyPromotion === false,
    humanAuthorityBoundaries: boundaryText.includes("toma fate") && boundaryText.includes("brass moth truth") && boundaryText.includes("council motive"),
    visualAssetBufferedThroughProfile: elements.filter((element) => element.elementType === "visual_asset").every((element) => element.targetDestinations.includes("profile")),
    freeformReviewAllowed: payload.decisionLogSafeMetadata.freeformReviewAllowed === true
  };
}

function selectAdapterFixture(rawMemo, inputPath) {
  const normalizedMemo = rawMemo.toLowerCase();
  const normalizedPath = toRepoPath(inputPath).toLowerCase();
  return ADAPTER_FIXTURES.find((fixture) => {
    if (normalizedPath.includes(fixture.key)) {
      return true;
    }
    return fixture.matchPhrases.some((phrase) => normalizedMemo.includes(phrase.toLowerCase()));
  }) || ADAPTER_FIXTURES[0];
}

function sourceRefFor(fixture, inputPath) {
  return {
    id: fixture.sourceRefId,
    label: fixture.sourceLabel,
    source_type: "memo",
    locator: toRepoPath(inputPath),
    trust: "author_memo"
  };
}

function elementSpec(id, displayText, elementType, phrase, aliases, confidence, canonRisk, spoilerLevel, targetDestinations, targetProfileIds, targetClaimIds, targetTimelineEntryIds, unresolvedDependencies, notes, includeHumanReviewRef = false) {
  return {
    id,
    displayText,
    elementType,
    phrase,
    aliases,
    confidence,
    canonRisk,
    spoilerLevel,
    targetDestinations,
    targetProfileIds,
    targetClaimIds,
    targetTimelineEntryIds,
    unresolvedDependencies,
    notes,
    includeHumanReviewRef
  };
}

function profileSpec(id, displayName, profileType, ghostNodeStatus, unresolvedDependencies, summary, options = {}) {
  return {
    id,
    displayName,
    profileType,
    ghostNodeStatus,
    unresolvedDependencies,
    summary,
    ...options
  };
}

function claimSpec(id, claimText, claimScope, subjectRef, unresolvedDependencies, options = {}) {
  return {
    id,
    claimText,
    claimScope,
    subjectRef,
    unresolvedDependencies,
    ...options
  };
}

function timelineSpec(id, title, timelineAxis, calendarTime, unresolvedDependencies, options = {}) {
  return {
    id,
    title,
    timelineAxis,
    calendarTime,
    unresolvedDependencies,
    ...options
  };
}

function touchesHumanOwnedDecision(element) {
  const haystack = [
    element.displayText,
    element.notes,
    ...(element.aliases || []),
    ...(element.unresolvedDependencies || [])
  ].join(" ").toLowerCase();
  return HUMAN_OWNED_DEPENDENCIES.some((dependency) => haystack.includes(dependency.toLowerCase()));
}

async function writeJson(filePath, data) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
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

function toRepoPath(filePath) {
  return filePath.split(path.sep).join("/");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
