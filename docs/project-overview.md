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
| Editorial Revision Roundtrip | Active; ready for guarded local revision review | [`review/editorial-revision-roundtrip.md`](review/editorial-revision-roundtrip.md) | `artifacts/editorial-revision-roundtrip-result.json`, `artifacts/editorial-revision/`, `public/review/index.html?mode=revision` |
| Bridge Editorial Handoff Pack | Preserved immutable source; ready for local manual delivery | [`review/bridge-editorial-handoff-pack.md`](review/bridge-editorial-handoff-pack.md) | `artifacts/bridge-editorial-handoff-pack-result.json`, `artifacts/editorial-handoff/`, `public/review/index.html?mode=handoff` |
| Bridge Storyboard Flow | Preserved source baseline | [`review/bridge-storyboard-flow.md`](review/bridge-storyboard-flow.md) | `artifacts/bridge-storyboard-flow-result.json`, `artifacts/review-screens/bridge-storyboard-flow.png`, `public/review/index.html?mode=bridge` |
| MVP skeleton review workbench | Ready for local review | [`review/first-mvp-review.md`](review/first-mvp-review.md) | `artifacts/fff-mvp-skeleton-review.png` |
| JSON export/import | Ready for local review | [`review/json-export-import-review.md`](review/json-export-import-review.md) | Current visual evidence moved to the shared review screenshot. |
| Visual Review Hub | Ready for local review | [`review/visual-review-hub-review.md`](review/visual-review-hub-review.md) | `artifacts/fff-current-review-screenshot.png`, `artifacts/fff-review-contact-sheet.png` |
| Local file persistence and review ergonomics | Ready for local review | [`review/file-persistence-review.md`](review/file-persistence-review.md), [`review/review-ergonomics-review.md`](review/review-ergonomics-review.md) | `artifacts/fff-current-review-screenshot.png`, `artifacts/fff-review-contact-sheet.png` |
| Claim Ledger | Ready for local review | [`review/claim-ledger-review.md`](review/claim-ledger-review.md) | `artifacts/fff-current-review-screenshot.png`, `artifacts/fff-review-contact-sheet.png` |
| Timeline View and v1.3 contract | Ready for local review | [`review/timeline-view-review.md`](review/timeline-view-review.md), [`review/v1-3-compliance-review.md`](review/v1-3-compliance-review.md) | `artifacts/fff-current-review-screenshot.png`, `artifacts/fff-review-contact-sheet.png` |
| Profile/Ghost Flow | Ready for local review | [`review/profile-ghost-flow-review.md`](review/profile-ghost-flow-review.md), [`review/checkpoint-readback.md`](review/checkpoint-readback.md) | `artifacts/fff-current-review-screenshot.png`, `artifacts/fff-review-contact-sheet.png` |
| Extraction Contract and freeform review intake | Ready for local review | [`review/extraction-contract-review.md`](review/extraction-contract-review.md), [`review/freeform-review-intake.md`](review/freeform-review-intake.md) | `artifacts/fff-current-review-screenshot.png`, `artifacts/fff-review-contact-sheet.png` |
| Local extraction adapter expansion | Ready for local review | [`review/local-extraction-adapter-expansion-review.md`](review/local-extraction-adapter-expansion-review.md) | `artifacts/fff-current-review-screenshot.png`, `artifacts/fff-review-contact-sheet.png` |
| Model/API boundary spec | Ready for local review | [`review/model-api-boundary-spec.md`](review/model-api-boundary-spec.md) | `artifacts/model-api-boundary-envelope.example.json`, `artifacts/model-api-boundary-smoke-result.json` |
| Provider envelope readiness no-call | Ready for local readback | [`review/provider-envelope-readiness-no-call.md`](review/provider-envelope-readiness-no-call.md) | `artifacts/provider-envelope-readiness-no-call.example.json`, `artifacts/provider-envelope-readiness-no-call-result.json` |
| Review Workbench Component Contract | Ready for local readback | [`review/review-workbench-component-contract.md`](review/review-workbench-component-contract.md) | `artifacts/review-workbench-component-contract-result.json`, `artifacts/review-screens/brief-component-contract-workbench.png`, `public/review/index.html?mode=brief` |
| Apply Decision Shell Guard Diet | Ready for local readback | [`review/apply-decision-shell-guard-diet.md`](review/apply-decision-shell-guard-diet.md) | `artifacts/apply-decision-shell-guard-diet-result.json`, `artifacts/review-screens/brief-decision-shell-applied.png`, `public/review/index.html?mode=brief` |
| Layout Lab Visual Audit | Ready for visual review | [`review/layout-lab-visual-audit.md`](review/layout-lab-visual-audit.md) | `artifacts/layout-lab-visual-audit-contact-sheet.png`, `artifacts/review-screens/layout-lab.png`, `artifacts/review-screens/layout-lab-decision-shell.png` |
| Layout Research Decision Shell | Ready for local wireframe review | [`review/layout-research-decision-shell.md`](review/layout-research-decision-shell.md) | `artifacts/layout-research-decision-shell-result.json`, `public/review/index.html?mode=layout-lab` |
| Low-text Decision Console | Ready for local readback | [`review/low-text-decision-console.md`](review/low-text-decision-console.md) | `artifacts/low-text-decision-console-result.json`, `public/review/index.html?mode=brief`, `public/review/index.html?mode=bridge` |
| Guided Review Flow Workspace | Ready for local readback | [`review/guided-review-flow-workspace.md`](review/guided-review-flow-workspace.md) | `artifacts/guided-review-flow-workspace-result.json`, `public/review/index.html?mode=brief`, `public/review/index.html?mode=bridge` |
| Bridge Refinement Overview Ribbon | Ready for local readback | [`review/bridge-refinement-overview-ribbon.md`](review/bridge-refinement-overview-ribbon.md) | `artifacts/bridge-refinement-overview-ribbon-result.json`, `public/review/index.html?mode=brief`, `public/review/index.html?mode=bridge` |
| Home Cockpit Metric Linking | Ready for local readback | [`review/home-cockpit-metric-linking.md`](review/home-cockpit-metric-linking.md) | `artifacts/home-cockpit-metric-linking-result.json`, `public/review/index.html?mode=brief` |
| Review Home Map Meters | Ready for local readback | [`review/review-home-map-meters.md`](review/review-home-map-meters.md) | `artifacts/review-home-map-meters-result.json`, `public/review/index.html?mode=home` |
| Draft-to-Video Planning Bridge | Ready for local readback | [`review/draft-to-video-planning-bridge.md`](review/draft-to-video-planning-bridge.md) | `artifacts/draft-to-video-planning-bridge-result.json`, `public/review/index.html?mode=bridge` |
| Review Brief Dark Mode UX | Ready for local readback | [`review/review-brief-dark-mode-ux.md`](review/review-brief-dark-mode-ux.md) | `artifacts/review-brief-dark-mode-ux-result.json`, `public/review/index.html?mode=brief` |
| Draft Review Pack Stabilization | Ready for local readback | [`review/draft-review-pack-stabilization.md`](review/draft-review-pack-stabilization.md) | `artifacts/draft-review-pack-stabilization-result.json`, `public/review/index.html?mode=draft`, `public/review/index.html?mode=designer` |
| One-story Draft Review Pack | Ready for local readback | [`review/one-story-draft-review-pack.md`](review/one-story-draft-review-pack.md) | `artifacts/one-story-draft-review-pack-result.json`, `public/review/index.html?mode=draft` |
| Designer Candidate Dashboard | Ready for local readback | [`review/designer-candidate-dashboard.md`](review/designer-candidate-dashboard.md) | `artifacts/designer-candidate-dashboard-result.json`, `public/review/index.html?mode=designer` |
| Source-span routing review pack | Ready for local review | [`review/source-span-routing-review-pack.md`](review/source-span-routing-review-pack.md) | `artifacts/source-span-routing-review-pack.json`, `artifacts/fff-current-review-screenshot.png` |
| Review procedure lock | Ready for local review | [`review/review-procedure.md`](review/review-procedure.md) | `artifacts/fff-current-review-screenshot.png`, `artifacts/fff-review-contact-sheet.png`, `artifacts/review-screens/` |
| Review memory dedup | Ready for local review | [`review/review-memory-dedup.md`](review/review-memory-dedup.md) | `artifacts/review-memory-dedup-smoke-result.json`, `artifacts/artifact-manifest.json` |

The implementation details are itemized inside the review documents under headings such as `What Was Implemented`, `What Exists Now`, `Validation`, `Known Limitations`, and `Next Recommended Slice`.

## Visual Progress Check

The current quick visual review files are stored under `artifacts/`:

| File | Use |
| --- | --- |
| `artifacts/review-screens/editorial-revision-roundtrip.png` | 900x1200 browser evidence for the focused Editorial Revision route. |
| `artifacts/review-screens/bridge-editorial-handoff-pack.png` | 900x1200 browser evidence for the focused Editorial Handoff route. |
| `artifacts/review-screens/bridge-storyboard-flow.png` | 900x1200 evidence for the active six-beat Bridge Storyboard Flow. |
| `artifacts/fff-current-review-screenshot.png` | Current single-screen review evidence for the active local UI. |
| `artifacts/fff-review-contact-sheet.png` | Four-mode contact sheet for fast visual scanning of the current review UI. |
| `artifacts/review-screens/brief-component-contract-workbench.png` | Current role-contracted Review Workbench screenshot for the default `brief` route. |
| `artifacts/review-screens/brief-decision-shell-applied.png` | Current applied Decision Shell screenshot for the default `brief` route. |
| `artifacts/layout-lab-visual-audit-contact-sheet.png` | Current Layout Lab visual audit contact sheet comparing Lab, Decision Shell, preserved Brief, and preserved Bridge. |
| `artifacts/review-screens/layout-lab.png` | Layout Lab first-screen screenshot. |
| `artifacts/review-screens/layout-lab-decision-shell.png` | Split-pane Decision Shell screenshot. |
| `artifacts/review-screens/brief-preserved.png` | Preserved `brief` route screenshot. |
| `artifacts/review-screens/bridge-preserved.png` | Preserved `bridge` route screenshot. |
| `artifacts/review-screens/story-review.png` | Mode-specific Story Review screenshot. |
| `artifacts/review-screens/source-audit.png` | Mode-specific Source Audit screenshot. |
| `artifacts/review-screens/project-cockpit.png` | Mode-specific Project Cockpit screenshot. |
| `artifacts/review-screens/artifacts-validation.png` | Mode-specific Artifacts and validation screenshot. |
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
| Actual Model/API extraction adapter | Not started | [`idea-ledger.md`](idea-ledger.md), [`review/model-api-boundary-spec.md`](review/model-api-boundary-spec.md), [`review/provider-envelope-readiness-no-call.md`](review/provider-envelope-readiness-no-call.md), [`review/source-span-routing-review-pack.md`](review/source-span-routing-review-pack.md), [`review/local-extraction-adapter-expansion-review.md`](review/local-extraction-adapter-expansion-review.md) | Keep model/API work behind explicit authorization, the no-call envelope, local validator, source-span, routing, and review-safe default gates. |
| Durable project database | Not started | [`idea-ledger.md`](idea-ledger.md) | Decide storage and migration policy before persistence work. |
| Publishing and video generation | Out of scope for the current MVP | [`product-brief.md`](product-brief.md), [`idea-ledger.md`](idea-ledger.md) | No upload, credentials, public release, or AI video generation in the current review lane. |

## Turn-Based Development Plan

This plan is turn-count based, not date based. One turn means one bounded implementation and verification pass.

| Turn window | Focus | Expected result | Opens the door to |
| --- | --- | --- | --- |
| Next 1 turn | Manual Editorial Handoff use | A writer, subtitle editor, or video editor opens the focused Handoff route and uses the portable six-file package while the 180-second baseline, truth guards, and unselected assets remain explicit. | Human editing feedback can refine narration cadence, subtitle wrapping, and shot language without reconstructing the plan or opening production gates. |
| Following 1 turn | Contract QA hardening | Edge-case payloads for unknown fields, low confidence, rejected source refs, source-span mismatch, timeout/failure readback, and freeform review override handling. | Later extractor work gets stricter safety rails. |
| Following 1-2 turns | Durable storage decision spike | A scoped choice between file-backed, SQLite, or browser-storage expansion. | Persistence implementation with migration and backup expectations visible. |
| Held until review gates are accepted | Publishing and video generation | No implementation in the current lane. | Future production planning only after rights, credentials, and human release decisions are explicit. |

## Current Local Review Entry

The active UI remains:

```powershell
Invoke-Item .\public\review\index.html
```

No-query access still defaults to the preserved role-contracted Review Workbench / Review Brief. The active product readback is the focused Editorial Handoff route at `public/review/index.html?mode=handoff`; its source six-beat Storyboard Flow remains at `public/review/index.html?mode=bridge`, with former Bridge consoles and detail shelves collapsed as supporting evidence.

Mode-specific Editorial Handoff route:

```text
public/review/index.html?mode=handoff
```

Mode-specific Decision Shell route:

```text
public/review/index.html?mode=brief
```

Current layout research route preserved as source evidence:

```text
public/review/index.html?mode=layout-lab
```

Compatibility alias for the preserved Review Home route:

```text
public/review/index.html?mode=home
```

Mode-specific Draft-to-Video Bridge route:

```text
public/review/index.html?mode=bridge
```

Mode-specific Designer Dashboard route:

```text
public/review/index.html?mode=designer
```

Mode-specific Draft Review Pack route:

```text
public/review/index.html?mode=draft
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
uvx --with mkdocs-material mkdocs serve -a 127.0.0.1:8000
```

Then open `http://127.0.0.1:8000/`, start from this page, and open the active review UI with:

```powershell
Invoke-Item .\public\review\index.html
```

The accepted six-beat Bridge checkpoint now feeds `fff-bridge-editorial-handoff-pack-001`. The next move is to open `public/review/index.html?mode=handoff` and use `artifacts/editorial-handoff/` for manual editorial transfer. Final narration performance, subtitle typography, asset selection, provider work, generation, render, upload, database persistence, rights clearance, and canon work remain blocked until separate authorization.
