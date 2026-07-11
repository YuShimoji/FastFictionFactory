# Editorial Revision Roundtrip

## Outcome

`fff-editorial-revision-roundtrip-001` adds a guarded local revision-request, comparison, decision, and unapplied-patch workflow for the immutable `fff-bridge-editorial-handoff-pack-001` source package.

The focused route is `public/review/index.html?mode=revision`. It can load a local JSON request with `FileReader`, classify every requested change, show one active before/after diff, record accept/hold/reject/return decisions, and download decision and patch JSON with `Blob`. It makes no network request and writes nothing back to the repository or source package.

## Source Contract

- Source artifact: `fff-bridge-editorial-handoff-pack-001`
- Source package: `artifacts/editorial-handoff/`
- Source `editorial-handoff.json` SHA256: `c818d81a0d87796a8d61e7d16ff0448a9feb5422b6ee3e0d2989cebd907b3080`
- Source `package-manifest.json` SHA256: `ffad571ed4abeb46e7d2b5f61f33f3fa4703173b3f8da2318e5d1c7248772971`
- Candidate: `designer-content-moth-investigation-3m`
- Channel: `designer-channel-mystery-lore`
- Source bytes and hashes are immutable in this slice.

## Access

- Revision route: `public/review/index.html?mode=revision`
- Handoff route: `public/review/index.html?mode=handoff`
- Bridge route: `public/review/index.html?mode=bridge`
- Brief route: `public/review/index.html?mode=brief`
- PowerShell: `.\scripts\operator\open_review.ps1 -Mode revision`
- PowerShell URI test: `.\scripts\operator\open_review.ps1 -Mode revision -PrintUri`
- Shell: `./scripts/operator/open_review.sh --mode revision`
- Shell URI test: `./scripts/operator/open_review.sh --mode revision --print-uri`
- No-argument launcher behavior remains `brief`.

## Portable Revision Package

| File | Purpose |
| --- | --- |
| `artifacts/editorial-revision/README_REVISION.md` | Local use order and immutable-source boundary |
| `artifacts/editorial-revision/revision-request-template.json` | Request schema template |
| `artifacts/editorial-revision/revision-request.example.json` | Deterministic six-change mixed-risk example |
| `artifacts/editorial-revision/revision-decision.example.json` | Deterministic 3 accept / 1 hold / 2 reject decisions |
| `artifacts/editorial-revision/revision-patch.example.json` | Three accepted safe edits, explicitly not applied |
| `artifacts/editorial-revision/revision-roundtrip-manifest.json` | Byte-size and SHA256 metadata for the other five files |

`.gitattributes` pins revision Markdown and JSON plus the POSIX launcher to LF so package hashes and shell execution remain stable on Windows checkouts.

## Guard Classification

Classification uses explicit `change_type` and protected target fields first. A narrow text check catches obvious canon, clearance, selected-asset, provider, render, upload, or publication promotions. Unknown identities, hashes, target types, or change types fail closed.

| Guard class | Allowed types | Decision boundary |
| --- | --- | --- |
| `safe_local_edit` | `narration_wording`, `subtitle_wording`, `shot_direction_wording` | May be accepted |
| `human_author_required` | `beat_order`, `beat_timing`, `story_truth`, `ending_choice` | Hold or return only |
| `blocked_boundary` | canon, rights, asset, provider, credential, external-call, generation, render, publication, database, or unknown change | Reject or return only |

The deterministic example contains exactly six changes: `3 safe_local_edit`, `1 human_author_required`, and `2 blocked_boundary`. Its decisions are exactly `3 accept`, `1 hold`, and `2 reject`. The exported example patch contains only the three accepted safe wording changes.

## Import and Export Safety

- Local imports use a size-limited file input and `FileReader`.
- JSON is parsed without `eval`.
- Imported strings are rendered with safe DOM text APIs.
- `before` values are compared with the immutable inline source target; `before_hash` uses Web Crypto SHA256 and materializes the verified canonical value before classification.
- Unknown target/type, target-beat mismatch, source fingerprint mismatch, and open boundary flags reject the import without replacing the last valid request.
- Invalid input presents a concise failure and does not replace the last valid state.
- Downloads use local `Blob` URLs for `revision-decision.json` and `revision-patch.json`.
- Every patch records `apply_status=not_applied`, source fingerprints, unchanged timing/order/canon/rights/assets, and closed production gates.

## Validation and Regeneration

Read-only validation:

```powershell
node tools/fff-state.mjs validate-editorial-revision-roundtrip artifacts/editorial-revision-roundtrip-result.json
```

Intentional regeneration of only the new package manifest and result:

```powershell
node tools/fff-state.mjs smoke-editorial-revision-roundtrip artifacts/editorial-revision-roundtrip-result.json artifacts/editorial-revision-roundtrip-result.json
```

The smoke command must not rewrite the five revision content files, any file under `artifacts/editorial-handoff/`, or historical result artifacts. Normal health checks use only read-only `validate-*` commands.

## Visual and Information Architecture

The Revision route uses one source/import header, compact guard/decision counts, one six-change rail, and one active diff canvas. Browser readback with a 900x1200 viewport override confirmed an 885x1180 content capture, no horizontal overflow, six rail tabs, one active diff, six package links, visible SAMPLE state, exact 3/1/2 classification and decision counts, Light/Dark readability, Arrow/Home/End navigation, visible keyboard focus, class-constrained decisions, one concise Handoff action, and zero console warnings/errors.

Visual evidence: `artifacts/review-screens/editorial-revision-roundtrip.png` (155441 bytes, SHA256 `19C109123FA811B64DF7D6F417AD2ADF9B338491252ACD554191E307F90C82F9`). The in-app browser did not surface a download event for the Blob-backed patch during automation; static compilation, source inspection, and validator checks confirm the local Blob export path, while no filesystem or network write is performed by the page.

## Boundary Gates

- source Handoff package mutation: closed
- revision application: closed
- timing or beat-order approval: closed
- story truth, ending, and final canon: closed
- asset selection and rights clearance: closed
- provider/API and credentials: closed
- external model calls and generation: closed
- production render, upload, and publication: closed
- database persistence: closed

## Review Debt

Actual human revision content, application of an accepted patch, timing/order approval, story truth, ending choice, Stale Shelf Excision, Workbench density cleanup, subtitle typography/animation, asset selection, provider/API, generation, render, upload, database, rights clearance, and final canon remain deferred.
