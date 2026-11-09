# Fast Fiction Factory Local Docs View

This page is a local viewing entry point for reading, auditing, and browser-assisted translation checks across the repository Markdown files.

It does not replace the source Markdown documents, and it does not contain translated or summarized versions of the specifications. Use the navigation tree to open the original Markdown-rendered pages, then use Chrome, Edge, or a DeepL browser extension as a temporary reading aid.

For a project-wide scan, start with [`Project Overview Map`](project-overview.md).

## Open Locally

From Windows PowerShell at the repository root:

```powershell
python -m pip install mkdocs-material
python -m mkdocs serve -a 127.0.0.1:8000
```

Then open:

```text
http://127.0.0.1:8000/
```

If the `mkdocs` command is already on your PATH, this is equivalent:

```powershell
mkdocs serve -a 127.0.0.1:8000
```

If port `8000` is already in use, choose a neighboring local port:

```powershell
python -m mkdocs serve -a 127.0.0.1:8001
```

## Translation Check Flow

1. Start the local MkDocs server.
2. Open `http://127.0.0.1:8000/` in Chrome or Edge, or the alternate port you selected.
3. Select a document from the left navigation tree.
4. Use the browser page-translation feature, or a DeepL browser extension, for temporary reading support.
5. Treat the original Markdown files in this repository as the source of truth.

## Navigation Policy

The tree uses practical audit categories only. These labels are not canon, status decisions, or content summaries.

| Area | Intended use |
| --- | --- |
| Overview | Entry points and repo-local orientation documents. |
| Specs | Product, workflow, data model, and QA gate documents that appear specification-like. |
| Runtime State | Current status, decision records, and residual work ledgers that describe the present review state. |
| Development Notes | Review notes for implemented local slices. |
| Artifacts | Artifact inventory and sample memo material. |
| Misc | Markdown files that do not fit the above categories with enough confidence. |

## Regenerating A Nav Candidate

The checked-in navigation is hand-reviewed. To inspect a fresh candidate from the current Markdown layout without changing files:

```powershell
node .\tools\generate-doc-nav.mjs
```

To write the candidate to a separate review file:

```powershell
node .\tools\generate-doc-nav.mjs --out .\build\doc-nav-candidate.yml
```

## 成果一覧 (Deliverables)

タスクの成果は、ここに載る画像/動画で示す。載らず進展が確かめられないタスクは完了にしない。状態の正本は [`review/current-status.md`](review/current-status.md)、各版の詳細は [`../artifacts/ARTIFACTS.md`](../artifacts/ARTIFACTS.md)。

| 成果 | 種別 | 開く |
| --- | --- | --- |
| Private Raster CASE_DIGEST (受理済み・既定オフの後継) | 動画 | [mp4](../artifacts/private-raster-case-digest/private-raster-case-digest.mp4) |
| Private Previsualization Timeline (現行の既定) | 動画 / 一覧 | [mp4](../artifacts/private-previsualization-timeline/private-previsualization-timeline.mp4), [contact sheet](../artifacts/private-previsualization-timeline/private-previsualization-contact-sheet.jpg) |
| Private Full Raster Candidate | 動画 / 一覧 | [mp4](../artifacts/private-full-raster-candidate/private-full-raster-candidate.mp4), [contact sheet](../artifacts/private-full-raster-candidate/private-full-raster-candidate-contact-sheet.jpg) |
| Private Full Raster Clarity Candidate | 動画 | [mp4](../artifacts/private-full-raster-clarity-candidate/private-full-raster-clarity-candidate.mp4) |
| Private Materialized Motion Previs (却下・archive専用) | 動画 / 一覧 | [mp4](../artifacts/private-materialized-motion-previs/private-materialized-motion-previs.mp4), [contact sheet](../artifacts/private-materialized-motion-previs/private-materialized-motion-previs-contact-sheet.jpg) |
| High-Fidelity Raster Pilot | 画像一覧 | [contact sheet](../artifacts/high-fidelity-raster-pilot/high-fidelity-raster-pilot-contact-sheet.jpg) |
| Integrated Visual Production Package | 画像一覧 | [contact sheet](../artifacts/integrated-visual-production-package/integrated-visual-production-package-contact-sheet.jpg) |
| Composition Board / Pilot / Counterexample / Expansion | 画像一覧 | [beat2 board](../artifacts/beat2-composition-board/beat2-composition-board-contact-sheet.jpg), [beat2 treatment](../artifacts/beat2-visual-treatment-pilot/beat2-visual-treatment-contact-sheet.jpg), [beat4](../artifacts/beat4-composition-counterexample/beat4-composition-counterexample-contact-sheet.jpg), [wave1](../artifacts/composition-expansion-wave1/composition-expansion-wave1-contact-sheet.jpg), [wave2](../artifacts/composition-expansion-wave2/composition-expansion-wave2-contact-sheet.jpg) |
| Review workbench (画面) | 画像 | [current](../artifacts/fff-current-review-screenshot.png), [contact sheet](../artifacts/fff-review-contact-sheet.png), [layout audit](../artifacts/layout-lab-visual-audit-contact-sheet.png) |
