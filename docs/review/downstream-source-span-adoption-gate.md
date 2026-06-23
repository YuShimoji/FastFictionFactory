# Downstream Source-Span Adoption Gate

Artifact: `fff-downstream-source-span-adoption-gate-001`

Current status: preserved auxiliary readback under the active `fff-contradictory-claim-guard-001` surface. This document describes the downstream gate artifact without making it the active Review Hub identity.

## Purpose

This slice adds the next thin gate after `fff-malformed-missing-span-guard-001`. The previous guard proves that missing, malformed, or unusable source-span payloads are rejected. This gate checks the next risk: whether anything shown as a future Profile / Claim / Timeline adoption candidate still carries valid source refs, valid source spans, safe routing, and held human-owned decisions.

The machine-readable readback lives at `artifacts/downstream-source-span-adoption-gate-result.json`.

## Gate-Only Boundary

`fff-downstream-source-span-adoption-gate-001` is a pre-adoption gate. It can report whether local review candidates have the source refs, valid source spans, safe routing, and held human-owned decisions a future adoption path would need. It cannot adopt those candidates, mutate Profile / Claim / Timeline state, promote canon, persist to a database, call or configure a provider, publish externally, or production-sync anything.

## What This Gate Does

| Check | Local meaning | Current result |
| --- | --- | --- |
| Source refs and spans required | Downstream Profile / Claim / Timeline candidates must be traceable to local memo text. | 55 downstream candidates reported for review; 55 source-tracked; 0 malformed or missing-span candidates. |
| Routing must stay safe | Visual, Source Reference, Human Review, Profile, Claim, and Timeline routes must not drift into unsafe direct adoption. | 0 unsafe routing candidates. |
| Malformed guard remains closed | Invalid source-span fixtures must stay rejected and outside routed adoption. | 0 accepted routed candidates from malformed/missing source-span cases. |
| Human-owned truth remains held | Toma fate, brass moth truth, Council motive, and similar unresolved decisions cannot become final canon. | 28 human-owned candidates remain held; 0 non-held human-owned candidates. |
| Adoption stays unimplemented | This is a readiness/readback gate, not product adoption behavior. | 0 adopted Profile / Claim / Timeline candidates; no model/API call. |

## Review Memory Readback

The Review Dedup Gate was checked before this slice:

| Item | Result |
| --- | --- |
| Target | `fff-malformed-missing-span-guard-001` |
| Axis | `downstream_source_span_adoption_gate` |
| Prior review count | `0` |
| Prior signal | The malformed/missing span guard completed without user review and kept invalid source evidence out of routed candidates. |
| What changed | A deterministic readback now checks downstream preconditions across source-pack rows, adapter outputs, routing regression, malformed-span guard evidence, and model/API boundary evidence. |
| What this review decides | No user review is needed; this decides whether downstream adoption remains blocked unless source refs, source spans, routing, and human-owned holds are all intact. |
| Not asking | No general Review Hub review, fixed-form review, model/API approval, provider credentials, database persistence, publishing, production sync, AI video generation, or final canon decision. |
| Next non-redundant axis | Provider-envelope readiness or one concrete remaining fixture class only after a new coverage need is named. |

No Review Card or Operator Observation Card is emitted. User-side work defaults to none.

## Gate Policy

`downstream candidate` means a local review/readback candidate only. It does not mean adopted canon, project-state mutation, production readiness, or public release. A future adoption path must still pass these preconditions:

- Source refs exist.
- `sourceSpan.text`, `sourceSpan.start`, and `sourceSpan.end` are valid and match the local memo.
- Routing target is not unsafe.
- Human-owned unresolved decisions remain held.
- Malformed or missing source-span cases remain invalid.
- Model/API boundary remains no-call unless explicitly authorized later.

## Validation Contract

This slice is complete when:

- `node tools/fff-state.mjs smoke-downstream-source-span-adoption-gate artifacts/source-span-routing-review-pack.json artifacts/downstream-source-span-adoption-gate-result.json` passes.
- Active manifest validation includes the new gate.
- Review Hub, manifest, current status, and artifact inventory include `fff-downstream-source-span-adoption-gate-001` as preserved downstream-readiness evidence.
- Existing adapter, source-span pack, routing regression, malformed-span guard, state, extraction, fixture, MkDocs, and whitespace checks remain passing.

## Boundaries

This artifact preserves `fff-malformed-missing-span-guard-001`, `fff-missing-fixture-class-probe-001`, `fff-weak-span-repair-001`, `fff-broad-span-split-001`, `fff-routing-policy-regression-hardening-001`, `fff-ambiguous-routing-resolution-001`, `fff-source-span-quality-audit-001`, `fff-review-memory-dedup-001`, `fff-review-procedure-lock-001`, `fff-review-hub-ia-mode-split-001`, `fff-source-span-routing-review-pack-001`, `fff-model-api-boundary-spec-001`, local extraction adapter artifacts, Extraction Contract, Claim Ledger, Timeline View, Profile/Ghost Flow, local persistence, JSON import/export, freeform review intake, and human-owned canon boundaries.

No model/API call, credential, database persistence, publishing, production sync, AI video generation, fixed-form review, broad manual review request, actual downstream adoption, or final canon decision is added by this slice.
