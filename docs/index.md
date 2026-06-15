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
