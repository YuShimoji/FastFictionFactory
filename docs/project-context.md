# Project Context

## Current Axis

Fast Fiction Factory is a local-first fiction production workbench. The current artifact is `fff-contradictory-claim-guard-001`, served through the static local Visual Review Hub at `public/review/index.html`.

## Current Lane

Keep the MVP reviewable without production commitments. The current lane is review-memory-aware source-span and claim governance: source evidence, routing, contradictory claim holds, review-held defaults, artifact governance, local access paths, and non-redundant review requests must remain distinct before any model/API extractor or downstream adoption path exists.

## Current Slice

The active slice is complete enough for local readback:

- Review UI: `public/review/index.html`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Contradictory claim guard doc: `docs/review/contradictory-claim-guard.md`
- Contradictory claim guard result: `artifacts/contradictory-claim-guard-result.json`
- Contradictory claim guard fixture: `artifacts/extraction-negative-fixtures/contradictory-claim-hold.json`
- Downstream source-span adoption gate doc/result: `docs/review/downstream-source-span-adoption-gate.md`, `artifacts/downstream-source-span-adoption-gate-result.json`
- Malformed/missing source-span guard doc: `docs/review/malformed-missing-span-guard.md`
- Malformed/missing source-span guard result: `artifacts/malformed-missing-span-guard-result.json`
- Malformed/missing source-span fixture: `artifacts/extraction-negative-fixtures/malformed-missing-source-span.json`
- Provider envelope readiness no-call doc/envelope/result: `docs/review/provider-envelope-readiness-no-call.md`, `artifacts/provider-envelope-readiness-no-call.example.json`, `artifacts/provider-envelope-readiness-no-call-result.json`
- Remaining fixture coverage doc/result: `docs/review/remaining-fixture-coverage-one-class.md`, `artifacts/remaining-fixture-coverage-one-class-result.json`
- Multilingual adapter fixture/output: `artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md`, `artifacts/extraction-adapter-outputs/multilingual-memo-notes.json`
- Downstream scope lock doc/result: `docs/review/downstream-adoption-gate-scope-lock.md`, `artifacts/downstream-adoption-gate-scope-lock-result.json`
- Translated memo fixture audit doc/result: `docs/review/translated-memo-fixture-audit.md`, `artifacts/translated-memo-fixture-audit-result.json`
- Translation provenance/source-span readback doc/result: `docs/review/translation-provenance-source-span-readback.md`, `artifacts/translation-provenance-source-span-readback-result.json`
- Very broad source-span shape audit doc/result: `docs/review/very-broad-source-span-shape-audit.md`, `artifacts/very-broad-source-span-shape-audit-result.json`
- Missing fixture probe doc/result: `docs/review/missing-fixture-class-probe.md`, `artifacts/missing-fixture-class-probe-result.json`
- Weak-span repair doc/result: `docs/review/weak-span-repair.md`, `artifacts/weak-span-repair-result.json`
- Broad source-span split doc/result: `docs/review/broad-span-split.md`, `artifacts/broad-span-split-result.json`
- Routing policy regression doc/result: `docs/review/routing-policy-regression-hardening.md`, `artifacts/routing-policy-regression-hardening-result.json`
- Ambiguous routing resolution doc/result: `docs/review/ambiguous-routing-resolution.md`, `artifacts/ambiguous-routing-resolution-result.json`
- Source-span quality audit doc/result: `docs/review/source-span-quality-audit.md`, `artifacts/source-span-quality-audit-result.json`
- Source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Source-span pack generator: `tools/fff-source-span-review-pack.mjs`
- Model/API boundary spec: `docs/review/model-api-boundary-spec.md`
- Model/API boundary envelope/smoke: `artifacts/model-api-boundary-envelope.example.json`, `artifacts/model-api-boundary-smoke-result.json`
- State adapter: `tools/fff-state.mjs`
- Local extraction adapter: `tools/fff-extract-local.mjs`
- Adapter fixture memos/outputs: `artifacts/extraction-adapter-fixtures/`, `artifacts/extraction-adapter-outputs/`
- Adapter expansion smoke: `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Validator fixtures/smoke: `artifacts/extraction-negative-fixtures/`, `artifacts/extraction-validator-smoke-result.json`
- Current/sample state: `artifacts/current-project-state.json`, `artifacts/sample-project-state.json`
- Local docs view: `mkdocs.yml`
- Project overview map: `docs/project-overview.md`
- Route-lock cleanup readback: `docs/review/route-lock-clean-state-readback.md`
- Next-terminal handoff: `docs/review/next-terminal-handoff.md`

## Verification Snapshot

Route hygiene checkpoint, 2026-06-29 JST:

- `fff-route-lock-clean-state-readback-001` records that four untracked
  ClipPipeGen-derived residue files under `docs/style_intent/` were deleted
  from this repo.
- Tracked and workspace searches for the foreign-route terms returned no hits
  after cleanup and before this readback was added. Future hits should be
  confined to `fff-route-lock-clean-state-readback-001` evidence and its
  cockpit summaries.
- `docs/style_intent/` was removed because it was empty and residue-only.
- The active Fast Fiction Factory artifact remains
  `fff-contradictory-claim-guard-001`.

Last verified on 2026-06-24:

```powershell
$manifest = Get-Content .\artifacts\artifact-manifest.json -Raw | ConvertFrom-Json
Invoke-Expression $manifest.validation_command
node .\tools\fff-state.mjs smoke-extraction-fixtures .\artifacts\extraction-negative-fixtures .\artifacts\extraction-validator-smoke-result.json
node .\tools\fff-state.mjs smoke-contradictory-claim-guard .\artifacts\extraction-validator-smoke-result.json .\artifacts\contradictory-claim-guard-result.json
node .\tools\fff-state.mjs smoke-downstream-source-span-adoption-gate .\artifacts\source-span-routing-review-pack.json .\artifacts\downstream-source-span-adoption-gate-result.json
node .\tools\fff-state.mjs validate .\artifacts\sample-project-state.json
node .\tools\fff-state.mjs validate .\artifacts\current-project-state.json
node .\tools\fff-state.mjs validate-extraction .\artifacts\sample-extraction-payload.json
node .\tools\fff-state.mjs validate-extraction-fixtures .\artifacts\extraction-negative-fixtures
node .\tools\fff-extract-local.mjs --matrix .\artifacts\extraction-adapter-fixtures .\artifacts\extraction-adapter-outputs .\artifacts\local-extraction-adapter-expansion-smoke-result.json
node .\tools\fff-source-span-review-pack.mjs .\artifacts\extraction-adapter-fixtures .\artifacts\extraction-adapter-outputs .\artifacts\local-extraction-adapter-expansion-smoke-result.json .\artifacts\source-span-routing-review-pack.json
node .\tools\fff-state.mjs smoke-routing-policy .\artifacts\ambiguous-routing-resolution-result.json .\artifacts\routing-policy-regression-hardening-result.json
node .\tools\fff-state.mjs smoke-malformed-missing-span-guard .\artifacts\extraction-validator-smoke-result.json .\artifacts\malformed-missing-span-guard-result.json
node .\tools\fff-state.mjs smoke-provider-envelope-readiness-no-call .\artifacts\provider-envelope-readiness-no-call.example.json .\artifacts\provider-envelope-readiness-no-call-result.json
node .\tools\fff-state.mjs smoke-remaining-fixture-coverage-one-class .\artifacts\local-extraction-adapter-expansion-smoke-result.json .\artifacts\remaining-fixture-coverage-one-class-result.json
node .\tools\fff-state.mjs smoke-translated-memo-fixture-audit .\artifacts\local-extraction-adapter-expansion-smoke-result.json .\artifacts\translated-memo-fixture-audit-result.json
node .\tools\fff-state.mjs smoke-translation-provenance-source-span-readback .\artifacts\extraction-adapter-outputs\multilingual-memo-notes.json .\artifacts\translation-provenance-source-span-readback-result.json
node .\tools\fff-state.mjs smoke-very-broad-source-span-shape-audit .\artifacts\local-extraction-adapter-expansion-smoke-result.json .\artifacts\very-broad-source-span-shape-audit-result.json
```

Result summary:

- Active manifest validation passes for `fff-contradictory-claim-guard-001`.
- The manifest validation command was rerun after `fff-downstream-adoption-gate-scope-lock-001`, closing the prior missing full-regeneration readback; dedicated translated memo and very broad source-span shape audit smokes now run from `tools/fff-state.mjs`.
- Contradictory claim guard parses 9 validator fixtures, keeps 2 conflicting claims in held review, preserves 1 reciprocal conflict pair and source refs, reports 0 adopted/provisional conflicting claims, and reports 0 direct accepted claim-routed elements.
- Multilingual fixture coverage passes with 5 adapter fixture outputs, 60 matrix elements, 12 selected multilingual fixture elements, 4 non-ASCII source-span elements, 0 source-span mismatches, 0 missing source refs, 0 unsafe visual routes, 0 non-held review defaults, and 0 human-owned adopt suggestions.
- Translated memo fixture audit passes as audit-only context: existing multilingual coverage is preserved, translated memo text remains blocked on source-of-truth language, translation provenance, and source-span ownership policy, and no translated fixture, translation API, translation policy, provider behavior, downstream adoption, or canon promotion is added.
- Translation provenance/source-span readback passes as readback-only context: 3 selected multilingual source-span to derived-claim relations and 1 inline-gloss boundary row are recorded, all 4 source spans match the raw memo and source-pack rows, all 3 derived claims remain held and source-backed, translated fixture count remains 0, and no provider/API call, credential, downstream adoption, or canon promotion is added.
- Very broad source-span shape audit passes as audit-only context: the 2 current broad rows remain resolved by `fff-broad-span-split-001`, 0 broad fixture files are added, and the source-pack / downstream / provider no-call chain remains clean.
- Downstream adoption gate parses 60 source-pack rows and reports 55 downstream Profile / Claim / Timeline review candidates, all 55 source-tracked, with 0 malformed/missing span candidates, 0 unsafe routing candidates, 28 human-owned candidates held, 0 non-held human-owned candidates, and 0 adopted Profile / Claim / Timeline candidates.
- Malformed/missing source-span guard remains closed with 3 invalid elements rejected, 0 accepted routed candidates, and 9 validator fixtures in the smoke matrix.
- Provider envelope readiness no-call gate passes with 4 carried Extraction Contract elements, 4 source-tracked elements, 2 human-owned elements held, 0 visual direct Claim routes, 0 adopted/provisional elements or claims, no provider configured, no endpoint, no external call attempted, and no credentials touched.
- Routing policy regression remains passing across 6 adapter payloads and 72 adapter elements.
- Source-span review pack remains passing with 5 fixture outputs, 60 elements, 0 source-span mismatches, 0 missing source refs, 0 unsafe visual routing cases, 0 non-held review defaults, and 0 human-owned decision adopt suggestions.
- Model/API boundary spec remains preserved as a spec-only, no-external-call boundary for future provider work.
- Toma fate, brass moth truth, Council motive, and moth-key function remain unresolved and human-owned.

## Boundaries

Do not treat local review state as final canon. Do not add model/API behavior, provider credentials, publishing, upload credentials, AI video generation, production sync, database persistence, downstream adoption behavior, contradictory claim truth decisions, or final decisions for Toma, the brass moth, or the Council unless explicitly requested.

## Restart Path

Open the review UI from the repo root:

```powershell
Invoke-Item .\public\review\index.html
```

Or use the dependency-free launchers:

```powershell
.\scripts\operator\open_review.ps1
```

```sh
./scripts/operator/open_review.sh
```

Open the local Markdown docs view from the repo root:

```powershell
python -m mkdocs serve -a 127.0.0.1:8000
```

If port `8000` is already in use, use a neighboring local port such as `8001`.

First next move: keep the contradictory claim guard as the active Review Hub identity while preserving downstream source-span adoption, downstream scope lock, provider-envelope readiness, multilingual fixture coverage, translated memo audit, translation provenance/source-span readback, and very broad source-span shape audit as auxiliary safety readbacks. Move next only to explicit provider adapter implementation after authorization for provider choice, credentials, endpoint, and transport behavior; source-of-truth language and original-vs-translation span ownership policy before any translated memo fixture; or broad fixture work only after new source-output evidence makes broad shape the bottleneck.

## Handoff Path

For another terminal, start with `docs/review/next-terminal-handoff.md` after pulling latest remote state. `docs/review/current-status.md` is the authoritative current packet for the active artifact and validation commands.
