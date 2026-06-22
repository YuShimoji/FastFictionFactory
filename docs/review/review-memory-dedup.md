# Review Memory And Dedup Gate

Artifact: `fff-review-memory-dedup-001`

## Purpose

This document adds a repo-visible review memory convention so future review requests do not repeat the same target, evidence, and validation axis. It does not ask for user review now, and it does not change extraction behavior, schemas, model/API boundaries, persistence, publishing, or canon authority.

The current rule is simple: past positive feedback can accept a bounded diagnostic scope, but it cannot silently become production approval, source-span quality approval, model/API approval, or canon approval.

## Review Memory Fields

Each reviewable artifact can carry this memory shape in `artifacts/artifact-manifest.json` or an artifact inventory entry:

| Field | Meaning |
| --- | --- |
| `artifact_id` | Stable artifact identity. |
| `subject` | Plain-language review target. |
| `current_scope` | What the artifact currently proves. |
| `prior_review_count` | Number of user-facing review passes recorded for this target. |
| `latest_user_signal` | Latest review signal such as `positive_signal`, `diagnostic_accept`, or `none_recorded`. |
| `latest_user_signal_summary` | Short natural-language summary of the latest signal. |
| `accepted_scope` | What the prior signal actually accepts. |
| `not_accepted_scope` | What the prior signal must not be stretched to accept. |
| `next_nonredundant_axis` | The next useful review axis that is not a repeat. |
| `repeated_review_allowed` | Whether the same target and axis may be asked again without changed evidence. |
| `review_reset_trigger` | What makes a repeated review legitimate, such as changed evidence, changed target, or changed decision value. |

## Current Review Memory

| Artifact | Prior signal | Accepted scope | Not accepted scope | Next non-redundant axis |
| --- | --- | --- | --- | --- |
| `fff-review-procedure-lock-001` | `diagnostic_representative_accept` | Local access procedure, screenshot map, and optional-vs-required review boundary are good enough to continue without immediate review | Production release, source-span quality, model/API work, durable persistence, publishing, or canon decisions | Check whether future Review Cards avoid repeating the same target/evidence/axis |
| `fff-review-hub-ia-mode-split-001` | `positive_signal` | Four-mode split is accepted as a provisional baseline for local review navigation | Production acceptance, final IA perfection, or source-span quality acceptance | Review only if mode evidence or navigation changes |
| `fff-source-span-routing-review-pack-001` | `candidate_seen` | Pack exists and automated guards pass | Human quality acceptance of span usefulness, extraction wording, routing judgment, or fixture coverage | Source-span usefulness and routing quality, only with concrete changed evidence or a new axis |

## Acceptance Ladder

| Stage | What it means | What it does not mean |
| --- | --- | --- |
| `candidate_seen` | The artifact is visible and reachable | It is not approved for quality or production |
| `positive_signal` | The user gave a favorable signal on the stated target | The signal does not transfer to other targets or axes |
| `diagnostic_representative_accept` | A representative sample is good enough to continue local work | It is not a full coverage or production acceptance |
| `provisional_baseline` | The current shape can serve as the baseline for the next reversible slice | It is not final design authority |
| `stress_test_required` | The next meaningful review should test edge cases or changed evidence | It is not a request to repeat the same review |
| `bounded_adjustment` | A narrow change can be made without reopening the whole target | It does not authorize broad refactors |
| `production_candidate` | A candidate may be considered for production planning after stronger gates | It is not production acceptance |
| `production_acceptance` | Explicit human approval for release scope | It is never implied by earlier local review signals |

## Review Dedup Gate

Run these checks before emitting a Review Card:

| Check | Pass condition | If it fails |
| --- | --- | --- |
| `same_target_check` | The target is new, or the same target has changed materially | Record Review Debt instead of asking again |
| `same_axis_check` | The requested review axis is new | Move to `next_nonredundant_axis` |
| `evidence_changed_check` | Evidence, screenshots, fixture output, or validation result changed | Do not ask for the same visual/readback confirmation |
| `decision_value_check` | The review would unlock a concrete next decision | Continue reversible work or document debt |
| `prior_signal_check` | Prior signal does not already cover the requested scope | Reuse the prior signal within its accepted scope |
| `user_fatigue_check` | The ask is smaller than the value it unlocks | Avoid repeated cards and preserve optional review |

Repeated review is allowed only when target, axis, evidence, or decision value changed, or when the user explicitly asks to re-review.

## Non-Redundant Review Card Template

Use this shape only when review is required or clearly valuable. Keep input freeform.

```text
status: optional|required
target:
axis:
prior_review_count:
prior_signal_summary:
what_changed:
what_this_review_decides:
input_mode: freeform
not_asking:
completion_signal:
```

Required Review Card fields:

- `target`
- `axis`
- `prior_review_count`
- `prior_signal_summary`
- `what_changed`
- `what_this_review_decides`
- `input_mode: freeform`
- `not_asking`
- `completion_signal`

## Reporting Guardrails

Future reports should keep route targets human-readable and avoid copying mojibake target strings into user-facing summaries. Use stable names such as `User/Supervisor` when a relay label is corrupted.

Do not include pseudo git tags in user-facing operation reports. Git state should be reported in natural language as staged, committed, pushed, branch, and commit id.

## Completion Signal

This slice is complete when:

- `docs/review/review-memory-dedup.md` exists.
- `artifacts/artifact-manifest.json` records `review_memory` for `fff-review-procedure-lock-001`, `fff-review-hub-ia-mode-split-001`, and `fff-source-span-routing-review-pack-001`.
- Acceptance Ladder, Review Dedup Gate, and Non-Redundant Review Card requirements are documented.
- A smoke/readback artifact confirms the required fields.
- Manifest validation, MkDocs strict build, and `git diff --check` pass.

## Boundaries

This artifact preserves `fff-review-procedure-lock-001`, `fff-review-hub-ia-mode-split-001`, `fff-source-span-routing-review-pack-001`, `fff-model-api-boundary-spec-001`, `fff-local-extraction-adapter-expansion-001`, `fff-extraction-validator-hardening-001`, `fff-extraction-contract-001`, Claim Ledger, Timeline View, Profile/Ghost Flow, local persistence, JSON import/export, freeform review intake, and human-owned canon boundaries.

No model/API call, credential, database persistence, publishing, production sync, AI video generation, repeated review requirement, or final canon decision is added by this slice.
