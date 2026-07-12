# Editorial Derivative Preview

## Outcome

`fff-editorial-derivative-preview-001` turns the accepted safe-only revision patch into one complete local derivative package. The source Handoff package remains byte-identical. The derivative is a reversible `derived_revision_preview`; it is not canonical, approved, rights-cleared, production-ready, or applied back to the source.

Primary route: `public/review/index.html?mode=derivative`

Source routes:

- Revision: `public/review/index.html?mode=revision`
- Handoff: `public/review/index.html?mode=handoff`
- Brief: `public/review/index.html?mode=brief`

## Immutable Inputs

The generator accepts the known `fff.editorialRevisionPatch.v1` patch only after validating its raw SHA256, source identity, source fingerprints, candidate/channel IDs, three exact safe target tuples, before values, guard classes, unchanged flags, and closed boundaries.

| Input | Identity / SHA256 |
| --- | --- |
| Source artifact | `fff-bridge-editorial-handoff-pack-001` |
| `editorial-handoff.json` | `c818d81a0d87796a8d61e7d16ff0448a9feb5422b6ee3e0d2989cebd907b3080` |
| `package-manifest.json` | `ffad571ed4abeb46e7d2b5f61f33f3fa4703173b3f8da2318e5d1c7248772971` |
| Patch ID | `revision-patch-example-001` |
| Accepted patch | `ded0174232dabf9d78d645836e24455152bd418eff2e49b6f4f2509066478885` |

All files under `artifacts/editorial-handoff/` and the existing content files under `artifacts/editorial-revision/` are protected inputs. Validation must compare their pre/post byte sizes and SHA256 values.

## Eight-file Portable Package

Package root: `artifacts/editorial-derivative/`

| File | Role |
| --- | --- |
| `README_DERIVATIVE.md` | Japanese-first delivery, review, non-canonical, and discard instructions |
| `narration-script.derived.md` | Complete six-segment narration with the accepted narration wording in context |
| `subtitle-cues.derived.csv` | Complete 20-row subtitle cue table with one accepted text cell |
| `shot-list.derived.csv` | Complete 19-row shot cue table with one accepted visual-direction cell |
| `editorial-handoff.derived.json` | Canonical `fff.editorialDerivativePreview.v1` derived model |
| `applied-revision-patch.json` | Byte-identical copy of the accepted input patch; its own `apply_status` remains `not_applied` because the source was not changed |
| `derivative-provenance.json` | `fff.editorialDerivativeProvenance.v1` source, patch, delta, fingerprint, and derived-location evidence |
| `derivative-package-manifest.json` | `fff.editorialDerivativePackageManifest.v1` byte-size/SHA256 inventory of the other seven files; never self-hashed |

The package uses UTF-8 without BOM, LF endings, stable JSON indentation, deterministic file ordering, and quoted CSV fields. The manifest contains exactly seven unique entries and excludes itself.

## Exact Delta Contract

Only the following three authored content fields may differ from the immutable source.

| Change | Target | Before | Derived value |
| --- | --- | --- | --- |
| `rev-change-b01-narration-wording` | `narration-b01.text` | ある記録では、正午、ノース・ベル駅の上に立つ古い天文台から鐘の音が響きます。けれど、塔の枠は空です。鐘は冬の外出禁止令のころに外されたとされています。ならば今、何が鳴っているのでしょう。 | ある記録によれば、正午、ノース・ベル駅の上に立つ古い天文台から鐘の音が響きます。けれど、塔の枠は空です。鐘は冬の外出禁止令のころに外されたとされています。では今、何が鳴っているのでしょう。 |
| `rev-change-b02-subtitle-wording` | `sub-b02-03.text_ja` | その機能は、まだ未決定。 | その働きは、まだ分からない。 |
| `rev-change-b03-shot-direction-wording` | `shot-b03-03.visual_direction` | インクや名前が薄れる抽象的なmotion graphicを想定する。 | インクや名前の輪郭がゆっくり薄れる、抽象的なモーショングラフィックを想定する。 |

The first narration segment's deterministic character estimate changes from 93 to 94, and the package narration total changes from 777 to 778. These are derived metadata, not a fourth authored change. Its reading window remains 20 seconds. The subtitle `line_break_hint` remains the source value because the accepted patch changes only `text_ja`; changing the hint in this slice would be a hidden fourth content edit.

## Deterministic Application

1. Snapshot the complete source and Revision package file sets, byte sizes, and SHA256 values.
2. Validate the patch schema and raw fingerprint, source fingerprints, IDs, `apply_status=not_applied`, safe target/type/field tuples, source-matching before values, three unique accepted changes, unchanged flags, and closed boundaries.
3. Deep-clone `editorial-handoff.json`; never write through a source object or source path.
4. Apply the three patch values in their declared order to the exact cloned targets.
5. Recalculate only `narration-b01.character_count_estimate` and the rendered narration total. Preserve all IDs, order, timing, truth, ending, canon, rights, asset, and per-item status fields.
6. Render Markdown, CSV, and JSON from the single derived model. Parse the renderings back and cross-match them with that model.
7. Copy the accepted patch bytes unchanged, then build provenance with exact before/after values and hashes plus derived file locations.
8. Calculate a non-circular derived content fingerprint over the explicitly documented core payload/model set. Provenance and the manifest may record that fingerprint; neither may claim a self-referential manifest hash.
9. Build the manifest last from the final bytes of the other seven files. Re-read every entry and compare bytes and SHA256.
10. Re-snapshot source and Revision inputs and require exact pre/post equality.

For identical source bytes and patch bytes, generation must produce identical content bytes. Do not introduce wall-clock-only values into generated content; use stable input-derived identity/timestamps where metadata requires them.

## Application and Rollback State

The derived model and provenance must expose:

- `status=derived_revision_preview`
- `canonical=false`
- `source_apply_status=not_applied`
- `derived_apply_status=applied_to_derived_copy`
- `application_scope=derived_copy_only`
- `rollback_action=discard_derived_package`
- `applied_change_count=3`

Rollback does not edit the source: discard `artifacts/editorial-derivative/` or the in-memory Blob outputs and regenerate from the same verified source and patch.

## Structural Invariants

The derivative preserves:

- 6 beats and 180 seconds;
- 6 narration segments, 20 subtitle cues, 19 shot cues, and 3 thumbnail directions;
- every beat/cue/shot/direction ID, order, beat association, start time, end time, and numeric beat boundary;
- all unaffected authored fields;
- all truth guards, rights guards, unresolved truth states, asset classes, `asset_status=unselected`, rights notes, and boundaries;
- `local_only=true`; and
- closed provider, credential, external-call, generation, render, upload/publication, database, final-canon, and rights-clearance flags.

CSV parsing must prove every row and field agrees with `editorial-handoff.derived.json`. The narration parser must prove all six segment IDs, windows, texts, estimates, statuses, and held-truth notes agree with the derived model. A source-vs-derived projection must allow only the three authored paths, deterministic derivative identity/provenance metadata, and the one narration character estimate.

## Local Access

PowerShell:

```powershell
.\scripts\operator\open_review.ps1 -Mode derivative
.\scripts\operator\open_review.ps1 -Mode derivative -PrintUri
```

Git-provided shell:

```sh
./scripts/operator/open_review.sh --mode derivative
./scripts/operator/open_review.sh --mode derivative --print-uri
```

No argument remains the Brief route. Unknown or unsafe modes must return nonzero rather than interpolating the mode into an open command.

The committed static files are the package authority. The browser generator uses the same ordered model, renderers, provenance, core-fingerprint, and manifest contract, and enables Blob downloads only after all eight generated SHA256 values and the core fingerprint match the committed package. Any mismatch fails closed before replacing the last valid package.

## Validation and Regeneration

Normal health validation is strictly read-only:

```powershell
node .\tools\fff-state.mjs validate-editorial-derivative-preview .\artifacts\editorial-derivative-preview-result.json
```

Intentional package/result regeneration is explicit:

```powershell
node .\tools\fff-state.mjs smoke-editorial-derivative-preview .\artifacts\editorial-derivative-preview-result.json .\artifacts\editorial-derivative-preview-result.json
```

The smoke command may write only the eight files under `artifacts/editorial-derivative/` and `artifacts/editorial-derivative-preview-result.json`. It must refuse every other output target. Wrong source or patch fingerprints, before mismatch, unknown target, a fourth change, timing/order edits, canon/truth promotion, asset/rights promotion, source marked applied, derivative marked canonical, a missing package file, or a manifest mismatch must fail closed. Negative probes run in memory and must not mutate source, Revision, or derivative evidence.

The completion result is `artifacts/editorial-derivative-preview-result.json`; it is the authority for the structured pass/fail readback, package hashes, and source/Revision pre/post immutability proof. The screenshot plus the current-status and handoff packets record browser evidence.

## Residual Work

| Purpose | Effect | Requirements | State | Owner | Next move |
| --- | --- | --- | --- | --- | --- |
| Real human revision pilot | Tests the same path with non-example editorial input | Human-authored request, guarded decision, accepted safe patch | Blocked by human input | Human editor | Import one real request in a separate Human Revision Pilot slice |
| Human acceptance | Establishes whether the derivative is editorially useful | Human review of the complete package | Open for review, not implied by validation | Human editor | Open the Derivative route and review the three edits in context |
| Canonical application | Applies accepted text to a new authorized source state | Explicit source-mutation and canon authority | Closed | Human author plus future worker | Start a separate Canonical Patch Application slice only after approval |
| Subtitle line-break refinement | Aligns the hint with the revised subtitle wording | A separately accepted change to `line_break_hint` | Deferred; source hint intentionally preserved | Human editor | Include an explicit hint change in a later revision request if needed |
| Timing, order, truth, ending, and canon | Changes story authority rather than wording | Human-author decision | Closed | Human author | Keep unchanged unless a new authorized request names the boundary |
| Asset and rights review | Selects actual assets and proves usage rights | Asset selection plus rights evidence | Closed | Asset / rights owner | Use a separate Asset / Rights Review lane |
| Provider and production work | Generates, renders, uploads, publishes, or persists media/state | Provider, credentials, transport, production, publication, and database authorization | Closed | Authorized production operator | Do not start from this package |
| Bundled ZIP | Reduces delivery clicks | Stable eight-file package and explicit packaging need | Deferred; individual files plus manifest are usable | Future operator tooling owner | Add only after real delivery friction is observed |
| Blob-download automation | Adds end-to-end browser evidence for generated downloads | Browser harness support for download events | Acceptable evidence debt | Future QA owner | Preserve static/validator proof and add an E2E probe when harness support exists |
