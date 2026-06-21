# Review Hub IA Mode Split

Artifact: `fff-review-hub-ia-mode-split-001`

## Purpose

Make the local Visual Review Hub easier to use for daily review without changing schemas, source-span artifacts, model/API boundaries, or canon authority.

## What Changed

- Added top-level review modes:
  - `Story Review` / `ストーリーレビュー`
  - `Source Audit` / `抽出根拠レビュー`
  - `Project Cockpit` / `プロジェクト状態`
  - `Artifacts` / `成果物・検証`
- Kept stable IDs, artifact IDs, JSON keys, and file paths in English.
- Added Japanese-facing display labels to major review headings.
- Removed the sticky Raw Story Memo behavior. The memo panel is now a normal inline panel in the story review layout.
- Collapsed source-span fixture tables by default so the source audit stays available without dominating first load.
- Preserved `fff-source-span-routing-review-pack-001`, `fff-model-api-boundary-spec-001`, source-span Review Debt, human-owned guards, and freeform review.

## Layer Map

| Mode | Japanese label | Main review layer |
| --- | --- | --- |
| `Story Review` | `ストーリーレビュー` | Raw memo, extraction contract, profile/ghost flow, claims, timeline, candidates, QA, and decision log. |
| `Source Audit` | `抽出根拠レビュー` | Source-span routing review pack, cross-fixture summary, Review Debt, human-owned guards, and fixture tables. |
| `Project Cockpit` | `プロジェクト状態` | Progress map, completed/pending/not-implemented status, v1.3 operating boundary. |
| `Artifacts` | `成果物・検証` | Artifact table, validation paths, smoke checklist, and local review access. |

## Preservation Checks

- Source-span pack remains reachable at `artifacts/source-span-routing-review-pack.json`.
- Source-span pack artifact id remains `fff-source-span-routing-review-pack-001`.
- Model/API boundary remains `fff-model-api-boundary-spec-001` with no external call.
- Toma fate, brass moth truth, and Council motive remain human-owned unresolved decisions.
- Review input mode remains `freeform`.

## Review Card

- Target: `fff-review-hub-ia-mode-split-001`
- Input mode: freeform
- Look for:
  - Whether Story Review / Source Audit / Project Cockpit / Artifacts are clearly separated.
  - Whether Japanese labels reduce daily review friction.
  - Whether the page feels less vertically overwhelming.
  - Whether the Raw Story Memo panel no longer feels awkward.
  - Whether source-span review remains reachable.
- Completion signal: any concrete impression, concern, approval, or request for further IA changes.

## Boundaries

This slice does not add model/API calls, credentials, provider endpoints, database persistence, publishing, AI video generation, production sync, or final canon decisions.
