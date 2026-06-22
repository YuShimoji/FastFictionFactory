# Source-Span Quality Audit

Artifact: `fff-source-span-quality-audit-001`

## Purpose

This slice audits the existing source-span routing review pack for review usefulness. It does not ask for a general Review Hub review, does not change extraction behavior, and does not start model/API work.

The prior `fff-source-span-routing-review-pack-001` proved reachability and automated guard health. This audit moves the next non-redundant axis to source-span usefulness and routing quality by classifying the 36 existing rows into concrete review categories.

## Review Memory Readback

The Review Dedup Gate was checked before this slice:

| Item | Result |
| --- | --- |
| Target | `fff-source-span-routing-review-pack-001` |
| Axis | `source_span_quality` |
| Prior review count | `0` |
| Prior signal | The pack was seen and automated guards passed, but human quality acceptance was not recorded. |
| What changed | Existing rows are now classified by usefulness, weak span, broad span, missing evidence, ambiguous routing, guarded unsafe-route risk, and human-owned boundary preservation. |
| Not asking | No general Review Hub review, no repeated procedure/IA review, no model/API approval, no production approval, no canon decision. |
| Next non-redundant axis | One bounded weak-span, broad-span, ambiguous-routing, or missing-fixture fix. |

No Review Card is emitted by this slice. Review Debt is recorded because the work can continue locally without user input.

## Audit Result

Machine-readable readback lives at `artifacts/source-span-quality-audit-result.json`.

| Classification | Count | What it means |
| --- | ---: | --- |
| `useful_span` | 28 | The span resolves to the raw memo, carries source refs, and is compact enough for the current route. |
| `weak_span` | 6 | The span is valid but too thin to justify all routing usefulness without surrounding context. |
| `overly_broad_span` | 2 | The span is valid but carries too much clause-level or alternative-decision context. |
| `missing_source_ref` | 0 | No current row is missing source refs. |
| `ambiguous_routing` | 7 | The route is guarded but crosses enough review surfaces that a future split or primary-route decision may help. |
| `unsafe_routing_guarded` | 3 | Visual/source-sensitive rows remain review-held and covered by existing guards; no unsafe failure is present. |
| `human_owned_boundary_preserved` | 17 | Toma fate, brass moth truth, Council motive, or equivalent high-risk rows remain held for human review. |

The source pack still reports 0 source-span mismatches, 0 missing source refs, 0 unsafe visual routing failures, 0 non-held review defaults, and 0 human-owned decision adopt suggestions.

## Useful Span Examples

| Row | Why it is useful |
| --- | --- |
| `local-x-person-mira` | `Mira Vale repairs clocks` gives a compact person/action phrase and supports Profile plus Claim routing. |
| `minutes-x-person-mira` | `Mira Vale hides the repair log` preserves a different action phrase without losing the protagonist mapping. |
| `edge-x-concept-borrowed-minutes` | `borrowed minutes from abandoned lives` carries enough concept wording for Profile plus Claim review while staying held. |

These rows can remain as current examples of useful deterministic spans.

## Weak Span Examples

| Row | Why it is weak | Next move |
| --- | --- | --- |
| `local-x-place-north-bell` | `North Bell Station` resolves, but the bare place name does not prove why Timeline routing is useful. | Add a little surrounding action or a fixture row that shows the station event. |
| `minutes-x-place-glass-arcade` | `glass arcade` is a valid location phrase, but it is thin evidence for both Profile and Timeline review. | Widen only enough to include the waiting or permit context. |
| `edge-x-document-ledger-page` | `A ledger page` identifies a document but not why it should route to Claim review. | Add a claim-bearing source span or split document identity from claim evidence. |

Weak spans are not validator failures. They are review-usefulness gaps.

## Broad Span Examples

| Row | Why it is broad | Next move |
| --- | --- | --- |
| `local-x-visual-observatory` | `still rings at noon even though its bell was removed` combines visual image, claim, and timeline implication in one source window. | Keep it held, but consider splitting visual evidence from claim/timeline evidence. |
| `minutes-x-placeholder-proof-bait` | `do not decide whether it is proof, bait, or a false record` carries multiple unresolved alternatives in one placeholder span. | Keep the human-owned boundary, then split the alternatives only if a later fixture needs them. |

Broad spans are useful for surfacing risk, but they are not ideal compact review evidence.

## Routing Quality

The audit identifies 7 guarded ambiguous-routing rows. These are not unsafe validator failures; they are candidates for future bounded cleanup if they slow review.

| Row | Current route | Reason to revisit |
| --- | --- | --- |
| `local-x-visual-observatory` | Profile, Claim, Timeline, Visual | Visual evidence is doing claim and timeline work at the same time. |
| `local-x-object-brass-moth` | Profile, Claim, Timeline, Human Review | The object is story-critical and touches unresolved truth. |
| `minutes-x-object-brass-moth` | Profile, Claim, Timeline, Human Review | The moth warning image may need separate object, visual, and unresolved-decision rows. |
| `edge-x-object-brass-moth-key` | Profile, Claim, Timeline, Human Review | The span is short and the route is broad, so it is both weak and ambiguous. |
| `local-x-unresolved-council-motive` | Human Review, Claim, Timeline | The unresolved motive can stay visible, but a later row may separate claim evidence from timeline placement. |
| `minutes-x-unresolved-council-motive` | Human Review, Claim | The row is safe but should remain human-owned until motive framing changes. |
| `edge-x-unresolved-toma-fate` | Human Review, Timeline | Timeline placement depends on a protected fate decision. |

## Human-Owned Boundaries

17 rows are preserved with `held_human_review_required`. They keep Toma fate, brass moth truth, Council motive, and related high-canon-risk decisions out of automated adoption. This is the right state for the current slice.

The audit does not resolve:

- Toma fate.
- Brass moth truth.
- Council motive.
- Whether the current spans are final artistic wording.
- Whether fixture coverage is complete enough for model/API work.

## Review Debt

| Debt | Current state | Next move |
| --- | --- | --- |
| Weak spans | 6 valid spans need more context for review usefulness. | Pick one row and widen or split it in a later bounded slice. |
| Broad spans | 2 valid spans pack too much decision context into one row. | Split only if a future fixture or review needs clearer evidence. |
| Ambiguous routing | 7 rows are guarded but route across multiple review surfaces. | Choose a primary route or split row only after selecting one concrete case. |
| Missing fixture classes | Contradictory claims, broad spans, malformed spans, multilingual text, sparse bullets, and provider envelope cases remain uncovered. | Add one fixture class at a time. |

## Validation Contract

This audit is complete when:

- `artifacts/source-span-quality-audit-result.json` parses.
- The audit row count equals the source pack row count.
- Missing source refs remain 0 and match the source pack.
- Human-owned guarded rows remain 17 and match the source pack.
- The Review Hub exposes a compact source-span quality summary.
- The active manifest validation command passes.
- MkDocs strict build and `git diff --check` pass.

## Boundaries

This artifact preserves `fff-review-memory-dedup-001`, `fff-review-procedure-lock-001`, `fff-review-hub-ia-mode-split-001`, `fff-source-span-routing-review-pack-001`, `fff-model-api-boundary-spec-001`, `fff-local-extraction-adapter-expansion-001`, `fff-local-extraction-adapter-spike-001`, `fff-extraction-validator-hardening-001`, `fff-extraction-contract-001`, Claim Ledger, Timeline View, Profile/Ghost Flow, local persistence, JSON import/export, freeform review intake, and human-owned canon boundaries.

No model/API call, credential, database persistence, publishing, production sync, AI video generation, repeated general review request, or final canon decision is added by this slice.
