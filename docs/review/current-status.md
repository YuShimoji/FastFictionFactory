# Current Status Packet

## Active Artifact

- Artifact id: `fff-claim-ledger-001`
- Review UI: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Manifest: `artifacts/artifact-manifest.json`

## What Exists Now

- Local static review UI.
- Visual Review Hub at the top of the review UI.
- Raw memo intake.
- Mock generated candidates for extracted elements, profiles, claims, timelines, task cards, QA gates, and outline packages.
- Candidate review controls for `adopt`, `provisional`, `hold`, and `reject`.
- JSON export/import with `schemaVersion: "fff.projectState.v1"`.
- Explicit local file save/load controls where the browser supports the File System Access API.
- Download/upload JSON fallback controls where direct file save/load is unavailable.
- Status filters, search, and collapse/expand controls for candidate review groups.
- Claim Ledger view with grouping by claim scope, world truth status, reality/reference status, canon risk, unresolved dependency, review status, and source.
- Claim-specific filters for unresolved dependencies, high canon risk, unverified reality status, hidden viewer disclosure, and review status.
- Sample exported project state at `artifacts/sample-project-state.json`.
- Normalized current project state at `artifacts/current-project-state.json`.
- Export/import smoke evidence at `artifacts/export-import-smoke-result.json`.
- File persistence smoke evidence at `artifacts/file-persistence-smoke-result.json`.
- Review ergonomics smoke evidence at `artifacts/review-ergonomics-smoke-result.json`.
- Claim Ledger smoke evidence at `artifacts/claim-ledger-smoke-result.json`.
- Repo-local zero-dependency state adapter at `tools/fff-state.mjs`.
- MkDocs Material local docs view at `mkdocs.yml`.
- Project-wide Markdown overview map at `docs/project-overview.md`.
- Root and artifact Markdown viewing wrappers under `docs/local-view/`.
- Turn-count-based development plan in `docs/project-overview.md`.

## What Was Verified

- The artifact manifest parses.
- The sample project state parses and uses `fff.projectState.v1`.
- The current project state parses and uses `fff.projectState.v1`.
- The previous export/import smoke result has `passed: true`.
- The Visual Review Hub renders through a local preview.
- The page visibly includes the active artifact id, artifact list, local review instructions, completed and pending features, Claim Ledger, unresolved creative decisions, QA gates, generated outline types, local file persistence controls, fallback export/import controls, filters, collapse/expand controls, and decision log area.
- The state adapter validates, summarizes, normalizes the project state JSON, and reports Claim Ledger summary counts.
- Browser smoke confirmed export/import fallback round trip, invalid JSON safety, unresolved decision survival, decision log survival, unknown field preservation, status filters, and collapse/expand behavior.
- Browser smoke confirmed Claim Ledger grouping, filtering, search, claim review controls, decision log update, export/import claim persistence, and invalid JSON safety.
- Screenshot and contact sheet output were generated at `artifacts/fff-current-review-screenshot.png` and `artifacts/fff-review-contact-sheet.png`.
- `mkdocs build --strict` passed for the local docs view using MkDocs Material in a temporary verification environment.
- Local docs view pages were checked over HTTP on `127.0.0.1:8001` because port `8000` was already in use during verification.

## What Remains Missing

- Timeline view.
- Profile page and ghost node flow.
- Real extraction engine.
- Durable project database.
- YouTube publishing, automated upload, and AI video generation.
- Final canon decisions for Toma, the brass moth, or the Council.

## How To Open The Review UI

From the repo root, run:

```powershell
Invoke-Item .\public\review\index.html
```

Primary review path:

```text
public/review/index.html
```

State persistence review path:

```text
1. Use Save state to local file if the browser supports direct file save.
2. Use Load state from local file if the browser supports direct file load.
3. Use Download JSON fallback and Upload JSON fallback when direct file access is unsupported.
4. Use Import pasted JSON to test invalid JSON handling or unknown-field preservation.
```

## How To Open The Local Docs View

From the repo root, run:

```powershell
python -m pip install mkdocs-material
python -m mkdocs serve -a 127.0.0.1:8000
```

Then open:

```text
http://127.0.0.1:8000/
```

If port `8000` is already in use, run:

```powershell
python -m mkdocs serve -a 127.0.0.1:8001
```

Start with `docs/project-overview.md` for the project map, implemented-slice index, screenshot paths, and turn-count-based development plan.

## Human-Owned Decision Packet

- Toma fate remains unresolved. Next move: choose provisional fate.
- Brass moth truth remains unresolved. Next move: choose first-use function or keep held.
- Council motive remains unresolved. Next move: choose villainous, desperate, divided, misled, or hold.

## Next Recommended Slice

Add the Timeline view as the next reviewable slice. Keep it explicit, local-only, and separate from database persistence, publishing, or final canon decisions.
