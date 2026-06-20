# Project Overview Map

This page is a navigation map for quickly understanding the current Fast Fiction Factory project from the Markdown set. It points to existing source documents instead of replacing them.

## Where To Look First

| Question | Primary document | What it answers |
| --- | --- | --- |
| What is the current artifact and review state? | [`review/current-status.md`](review/current-status.md) | Active artifact, implemented features, verified behavior, missing work, and next recommended slice. |
| What has been implemented by slice? | [`local-view/artifacts.md`](local-view/artifacts.md) | Artifact-by-artifact inventory with purpose, paths, screenshots, smoke evidence, and review status. |
| What does each implementation slice contain? | [`review/*.md`](review/current-status.md) | Per-slice review notes with implemented items, preserved product truth, validation notes, known limitations, and next slice. |
| What is the product supposed to be? | [`product-brief.md`](product-brief.md) | MVP purpose, user path, scope, out-of-scope boundaries, and review standard. |
| What is the local workflow? | [`workflow.md`](workflow.md) | Memo intake, mock extraction, candidate review, task planning, outline packaging, and QA review flow. |
| What data shape is expected later? | [`data-model.md`](data-model.md) | Portable state envelope and entity shapes for later persistence. |
| What remains to build? | [`idea-ledger.md`](idea-ledger.md) | Residual work, intended effect, requirements, current state, owner, and next move. |

## Implemented Slices

| Slice | Current state | Main review location | Quick visual evidence |
| --- | --- | --- | --- |
| MVP skeleton review workbench | Ready for local review | [`review/first-mvp-review.md`](review/first-mvp-review.md) | `artifacts/fff-mvp-skeleton-review.png` |
| JSON export/import | Ready for local review | [`review/json-export-import-review.md`](review/json-export-import-review.md) | Current visual evidence moved to the shared review screenshot. |
| Visual Review Hub | Ready for local review | [`review/visual-review-hub-review.md`](review/visual-review-hub-review.md) | `artifacts/fff-current-review-screenshot.png`, `artifacts/fff-review-contact-sheet.png` |
| Local file persistence and review ergonomics | Ready for local review | [`review/file-persistence-review.md`](review/file-persistence-review.md), [`review/review-ergonomics-review.md`](review/review-ergonomics-review.md) | `artifacts/fff-current-review-screenshot.png`, `artifacts/fff-review-contact-sheet.png` |
| Claim Ledger | Ready for local review | [`review/claim-ledger-review.md`](review/claim-ledger-review.md) | `artifacts/fff-current-review-screenshot.png`, `artifacts/fff-review-contact-sheet.png` |
| Timeline View and v1.3 contract | Ready for local review | [`review/timeline-view-review.md`](review/timeline-view-review.md), [`review/v1-3-compliance-review.md`](review/v1-3-compliance-review.md) | `artifacts/fff-current-review-screenshot.png`, `artifacts/fff-review-contact-sheet.png` |
| Profile/Ghost Flow | Ready for local review | [`review/profile-ghost-flow-review.md`](review/profile-ghost-flow-review.md), [`review/checkpoint-readback.md`](review/checkpoint-readback.md) | `artifacts/fff-current-review-screenshot.png`, `artifacts/fff-review-contact-sheet.png` |
| Extraction Contract and freeform review intake | Ready for local review | [`review/extraction-contract-review.md`](review/extraction-contract-review.md), [`review/freeform-review-intake.md`](review/freeform-review-intake.md) | `artifacts/fff-current-review-screenshot.png`, `artifacts/fff-review-contact-sheet.png` |
| Local extraction adapter expansion | Ready for local review | [`review/local-extraction-adapter-expansion-review.md`](review/local-extraction-adapter-expansion-review.md) | `artifacts/fff-current-review-screenshot.png`, `artifacts/fff-review-contact-sheet.png` |

The implementation details are itemized inside the review documents under headings such as `What Was Implemented`, `What Exists Now`, `Validation`, `Known Limitations`, and `Next Recommended Slice`.

## Visual Progress Check

The current quick visual review files are stored under `artifacts/`:

| File | Use |
| --- | --- |
| `artifacts/fff-current-review-screenshot.png` | Current single-screen review evidence for the active local UI. |
| `artifacts/fff-review-contact-sheet.png` | Multi-scroll contact sheet for fast visual scanning of the current review UI. |
| `artifacts/fff-mvp-skeleton-review.png` | Earlier MVP skeleton screenshot. |

From Windows PowerShell at the repository root:

```powershell
Invoke-Item .\artifacts\fff-current-review-screenshot.png
Invoke-Item .\artifacts\fff-review-contact-sheet.png
```

## Not Started Or Held Work

| Work | Current state | Where it is tracked | Boundary to keep |
| --- | --- | --- | --- |
| Profile page and ghost node flow | Ready for local review | [`idea-ledger.md`](idea-ledger.md), [`review/current-status.md`](review/current-status.md), [`review/profile-ghost-flow-review.md`](review/profile-ghost-flow-review.md) | Do not finalize Toma fate, brass moth truth, or Council motive. |
| Model/API extraction adapter | Not started | [`idea-ledger.md`](idea-ledger.md), [`review/local-extraction-adapter-expansion-review.md`](review/local-extraction-adapter-expansion-review.md) | Keep model/API work behind the local validator, source-span, routing, and review-safe default boundary. |
| Durable project database | Not started | [`idea-ledger.md`](idea-ledger.md) | Decide storage and migration policy before persistence work. |
| Publishing and video generation | Out of scope for the current MVP | [`product-brief.md`](product-brief.md), [`idea-ledger.md`](idea-ledger.md) | No upload, credentials, public release, or AI video generation in the current review lane. |

## Turn-Based Development Plan

This plan is turn-count based, not date based. One turn means one bounded implementation and verification pass.

| Turn window | Focus | Expected result | Opens the door to |
| --- | --- | --- | --- |
| Next 1 turn | Adapter source-span/routing review | More local edge fixtures or a boundary spec for model/API extraction behind the current validator. | Model/API integration can be evaluated without changing canon or persistence authority. |
| Following 1 turn | Contract QA hardening | Edge-case payloads for unknown fields, low confidence, rejected source refs, source-span mismatch, and freeform review override handling. | Later extractor work gets stricter safety rails. |
| Following 1-2 turns | Durable storage decision spike | A scoped choice between file-backed, SQLite, or browser-storage expansion. | Persistence implementation with migration and backup expectations visible. |
| Held until review gates are accepted | Publishing and video generation | No implementation in the current lane. | Future production planning only after rights, credentials, and human release decisions are explicit. |

## Current Local Review Entry

The active UI remains:

```powershell
Invoke-Item .\public\review\index.html
```

The local docs view remains:

```powershell
python -m mkdocs serve -a 127.0.0.1:8000
```

## Resume From Another Terminal

For an existing clone:

```powershell
git pull origin master
python -m pip install mkdocs-material
python -m mkdocs serve -a 127.0.0.1:8000
```

For a fresh clone:

```powershell
git clone https://github.com/YuShimoji/FastFictionFactory.git
cd .\FastFictionFactory
python -m pip install mkdocs-material
python -m mkdocs serve -a 127.0.0.1:8000
```

Then open `http://127.0.0.1:8000/`, start from this page, and open the active review UI with:

```powershell
Invoke-Item .\public\review\index.html
```

The next recommended implementation slice is adapter source-span/routing review or a model/API boundary design behind the existing local validator.
