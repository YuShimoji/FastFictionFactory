# Writer Source Adaptation v0 architecture

## Purpose and boundary

Writer Source Adaptation v0 moves format risk ahead of narration, shot, image, and video work. Its job is to preserve supplied authority, expose missing story structure, and either select a repository-supported format or return an author decision. It is deliberately local, deterministic, and provider-neutral.

The executable accepts only `prose_markdown_v0`, `fragment_bundle_v0`, and `writer_proposal_v0`. These are annotated input envelopes around exact repository files; they are not a claim that arbitrary prose can be understood without author-supplied structure.

The output candidates are fixed to `CASE_DIGEST`, `SHORT_DRAMA`, `SCENE_EXCERPT`, `PLOT_SUMMARY`, `LORE_EXPLAINER`, and `TRAILER_PV`.

## Evidence flow

The pipeline has six distinct records:

1. Writer Source Packet freezes input identity, UTF-8 hashes, exact spans, byte and UTF-16 character ranges, writer constraints, explicit unknowns, and normalization semantics.
2. Story Authority Ledger assigns source-backed statements to one or more of the eleven authority classes. It keeps reported claims, allegations, inference, unresolved facts, and forbidden inference visibly separate from established or observed material.
3. Format Selection measures the information envelope and ranks every supported format. Selection occurs only when the explicit contract passes; the selector never invents a bridge or rewrites source material to force acceptance.
4. Narrative IR carries the chosen or unresolved format state, semantic units, missing causal edges, evidence status, reveal order, narration/caption extraction, and closed production/canon flags.
5. Editorial Handoff Input maps only source-supported sections, timing, extracted units, visual-intent placeholders, truth boundaries, and continuity identifiers into current downstream field families.
6. Writer Proposal Impact records proposed operations and their downstream level without mutating the base IR or handoff.

Material story statements resolve to exact source spans. Explicitly writer-authored proposal text receives its own `writer_authored_proposal` span and remains non-canon. Adapter-created process labels are allowed only as `adapter_generated_non_factual`; they cannot carry story facts.

## Format and capacity decision

The v0 capacity contract is evidence-bound to two repository artifacts:

| Local evidence | 180-second envelope | Architectural use |
| --- | ---: | --- |
| Accepted CASE_DIGEST | 515 source characters, 5 sections, 11 subtitle units, 11 shots, 2 explained human-facing proper names | Positive calibration for a bounded case digest |
| Quarantined linear-lore | 631 source characters, 6 Beats, 19 shot hints, 5 names with 3 unexplained, no enacted action or causal step | Negative evidence against treating exposition and a forced choice as SHORT_DRAMA |

The values define a local comparison, not a universal literary threshold. `SHORT_DRAMA` additionally requires a bounded objective, enacted obstacle, consequential action, observable result, and enacted causality. Capacity alone can never repair missing dramatic structure.

Each candidate returns contract checks, acceptance/rejection reasons, and capacity fit. If none is safe, `selected_format` remains `null`, Handoff compilation stops, and the IR carries `AUTHOR_DECISION_REQUIRED`.

## Missing information stays missing

Fragment bundles use exact source statements while preserving undeclared order as `null`. They emit structural missing-causal-edge markers and author questions, not connective prose. This makes incompleteness machine-visible without laundering an adapter inference into the story.

Similarly, factual events, identities, relationships, motives, world rules, outcomes, guilt, authenticity, and final choices cannot enter the IR without source authority. `unsupported_factual_claim_count` is a closed acceptance measure and is zero for every fixture.

## Proposal roundtrip

The proposal surface supports add, remove, replace, reorder, clarify, mark undecided, and attach writer-authored text. Each change records affected source spans, new-text origin, editorial-versus-canon intent, downstream impact, human ownership, and one of:

- `L0 wording only`
- `L1 subject explanation`
- `L2 relation or section impact`
- `L3 format or structure impact`
- `AUTHOR_DECISION_REQUIRED`
- `FORBIDDEN_UNSUPPORTED_INFERENCE`

Every change has `auto_accept=false`. Canon proposals remain author-owned, and an unsupported guilt assertion is classified as forbidden rather than applied.

## Downstream compatibility

`downstream-contract-map.json` audits the actual current Editorial Handoff, Revision, Derivative, Production Blueprint, and accepted CASE_DIGEST objects by path, schema version, byte hash, and only the fields read for upstream compatibility. It does not copy every downstream field or redesign those products.

The selected CASE_DIGEST maps:

| Adapter field family | Existing consumer family |
| --- | --- |
| section/beat identity, order, label, timing | `beats[]` |
| narration units | `narration_segments[]` |
| caption units | `subtitle_cues[]` |
| visual-intent placeholders | `shot_cues[]` |
| unresolved truth/canon boundaries | `truth_guards[]` |
| closed effect flags | `boundaries` |

Visual intent is a source-bound placeholder only; it is not asset selection or image generation. Production, rights, provider, media, render, publication, and final-canon flags remain false.

## Determinism and effects

The implementation uses only Node standard-library modules. Stable object-key serialization, exact local file hashes, and absent timestamps or persisted absolute paths make structured generation reproducible. Validation performs no write. Generation writes only below its explicit `--output-dir`.

The package makes no external request and touches no model, provider, credential, payment, media generator, renderer, publication surface, or public state.

## Bounded limitations

The adapter depends on explicit fixture-side structural and authority annotations. It does not infer full story semantics from arbitrary prose, judge literary quality, or produce a production-ready screenplay. Capacity calibration is specific to the current 180-second evidence, and the repository has no accepted SHORT_DRAMA fixture from which to generalize a positive dramatic-capacity contract.
