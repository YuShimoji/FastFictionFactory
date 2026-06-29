# Current Status Packet

## Active Artifact

- Artifact id: `fff-contradictory-claim-guard-001`
- Review UI: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `.\scripts\operator\open_review.ps1`
- Repo-local shell launcher: `./scripts/operator/open_review.sh`
- Manifest: `artifacts/artifact-manifest.json`
- Guard doc: `docs/review/contradictory-claim-guard.md`
- Guard result: `artifacts/contradictory-claim-guard-result.json`
- Guard fixture: `artifacts/extraction-negative-fixtures/contradictory-claim-hold.json`
- Guard smoke command: `node tools/fff-state.mjs smoke-contradictory-claim-guard artifacts/extraction-validator-smoke-result.json artifacts/contradictory-claim-guard-result.json`

Preserved source-span and fixture chain:

- Malformed/missing source-span guard: `fff-malformed-missing-span-guard-001`
- Multilingual fixture coverage: `fff-remaining-fixture-coverage-one-class-001`
- Translated/multilingual fixture audit: `fff-translated-memo-fixture-audit-001`
- Translation provenance/source-span readback: `fff-translation-provenance-source-span-readback-001`
- Very broad source-span shape audit: `fff-very-broad-source-span-shape-audit-001`
- Sparse fixture probe: `fff-missing-fixture-class-probe-001`
- Weak-span repair: `fff-weak-span-repair-001`
- Broad-span split: `fff-broad-span-split-001`
- Routing policy regression: `fff-routing-policy-regression-hardening-001`
- Ambiguous routing resolution: `fff-ambiguous-routing-resolution-001`
- Source-span quality audit: `fff-source-span-quality-audit-001`
- Source-span review pack: `fff-source-span-routing-review-pack-001`

Preserved platform boundary:

- Review memory / dedup: `fff-review-memory-dedup-001`
- Review procedure: `fff-review-procedure-lock-001`
- Review Hub IA: `fff-review-hub-ia-mode-split-001`
- Route-lock cleanup: `fff-route-lock-clean-state-readback-001`
- Model/API boundary: `fff-model-api-boundary-spec-001`
- Provider envelope readiness no-call: `fff-provider-envelope-readiness-no-call-001`
- Provider adapter authorization readiness: `fff-provider-adapter-authorization-readiness-001`
- Local adapter expansion: `fff-local-extraction-adapter-expansion-001`
- Local adapter spike: `fff-local-extraction-adapter-spike-001`
- Extraction validator: `fff-extraction-validator-hardening-001`
- Extraction Contract: `fff-extraction-contract-001`

## What Exists Now

- The active Review Hub identity is now `fff-contradictory-claim-guard-001`.
- `artifacts/extraction-negative-fixtures/contradictory-claim-hold.json` adds one bounded contradictory-claim fixture with 2 claim-routed elements and 2 claim candidates.
- The two claim candidates are linked with reciprocal `contradictsClaimIds`, both keep `worldTruthStatus=uncertain`, both remain `hold`, and both preserve source refs.
- `tools/fff-state.mjs` now validates contradictory claim candidates so a claim with `contradictsClaimIds` must remain held, source-backed, high-risk, uncertain, and reciprocally linked.
- `artifacts/extraction-validator-smoke-result.json` now covers 9 fixtures: 3 expected-valid, 6 expected-invalid, 0 mismatches, and 5 built-in guard cases.
- `artifacts/contradictory-claim-guard-result.json` records `conflict_detected`, `hold_for_human_review`, `keep_out_of_auto_canon`, `keep_out_of_direct_claim_acceptance`, and `preserve_source_refs` as passed.
- `fff-remaining-fixture-coverage-one-class-001` adds one normal adapter fixture, `artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md`, plus generated output at `artifacts/extraction-adapter-outputs/multilingual-memo-notes.json`.
- The positive source-span pack now reads 5 fixtures and 60 rows. The multilingual readback confirms 12 selected fixture elements, 4 non-ASCII source-span elements, 0 source-span mismatches, 0 missing source refs, 0 unsafe visual routes, 0 non-held defaults, and 0 human-owned adopt suggestions.
- `fff-translated-memo-fixture-audit-001` audits the translated / multilingual fixture axis without adding another fixture class. It confirms the multilingual fixture already covers mixed-language memo text, keeps translated memo text as a policy-dependent source-pack gap, and classifies the prior full-manifest-regeneration unknown as `not_available` because the repo defines manifest validation but no full manifest regeneration command.
- `fff-translation-provenance-source-span-readback-001` records 3 selected multilingual source-span to held derived-claim relations plus 1 inline-gloss boundary row. It confirms all 4 checked spans match the raw memo and source-pack rows, all 3 derived claims remain held and source-backed, translated fixture count remains 0, provider configured=false, external call=false, credentials=false, downstream adopted candidates=0, adopted/provisional conflicting claims=0, and direct accepted claim elements=0.
- `fff-very-broad-source-span-shape-audit-001` audits the broad-shape fixture axis without adding another fixture class. It confirms the current two broad rows are already resolved by `fff-broad-span-split-001`, keeps broad fixture work deferred until source output changes or coverage becomes the concrete bottleneck, and preserves 0 source-span mismatches, 0 missing refs, 0 unsafe routes, 0 non-held defaults, 0 downstream adopted candidates, no provider, no external call, and no credentials.
- A pre-existing local downstream source-span adoption gate readback is present in `tools/fff-state.mjs` and `artifacts/downstream-source-span-adoption-gate-result.json`; it remains a non-active auxiliary readback and is not a model/API, DB, production, or canon-adoption implementation.
- `fff-provider-envelope-readiness-no-call-001` is now present as a non-active auxiliary readiness gate. It defines a no-provider/no-credential envelope, carries a candidate `fff.extractionContract.v1` payload, validates that payload locally, and binds it to the malformed/missing span guard, contradictory claim guard, downstream adoption gate, source-span pack, validator matrix, and model/API no-call boundary.
- `artifacts/provider-envelope-readiness-no-call-result.json` reports 4 carried extraction elements, 4 source-tracked elements, 2 human-owned elements held, 0 non-held human-owned elements, 0 visual direct Claim routes, 0 adopted/provisional elements, 0 adopted/provisional claims, no provider configured, no provider/model name, no endpoint, no external call attempted, and no credentials touched.
- `fff-provider-adapter-authorization-readiness-001` is now present as a non-active auxiliary authorization boundary. It lists 6 unauthorized items before real provider work: provider choice, credentials/secrets, endpoint, transport, external call permission, and persistence/publication; it also records 7 allowed no-call states and 3 Decision Packet options without asking for a fixed form.
- `fff-route-lock-clean-state-readback-001` records the 2026-06-29 cleanup of
  four untracked ClipPipeGen-derived files from `docs/style_intent/`. The
  cleanup found no tracked Fast Fiction Factory contamination before the
  route-lock evidence was recorded; future term hits should be confined to that
  evidence and cockpit summaries.
- Review Memory / Dedup remains in place. The guard uses axis `contradictory_claim_guard`, prior review count `0`, no Review Card, no Operator Observation Card, and no repeated general Review Hub request.
- Toma fate, brass moth truth, Council motive, and moth-key function remain unresolved and human-owned.

## What Was Verified

- Git parity before this slice: `git rev-list --left-right --count HEAD...origin/master` reported `0 0`.
- Route hygiene before this handoff: `git rev-list --left-right --count
  "HEAD...origin/master"` reported `0 0`; the workspace was clean after the
  four untracked ClipPipeGen residue files were deleted; tracked contamination
  grep returned no hits before `fff-route-lock-clean-state-readback-001` was
  added as the durable evidence record.
- This provider authorization readiness slice started clean on `master` at `6695ced Audit very broad source-span shape`; the contradictory-claim guard was already the tracked active surface, so the downstream gate, downstream scope-lock, provider-envelope readiness, provider authorization readiness, multilingual fixture coverage, translated audit, and very broad audit remain preserved auxiliary readbacks instead of active-status rewinds.
- Project-local instructions and required context docs were read before changing review claims.
- `node --check tools/fff-state.mjs` passed.
- `node tools/fff-state.mjs smoke-extraction-fixtures artifacts/extraction-negative-fixtures artifacts/extraction-validator-smoke-result.json` passed.
- `node tools/fff-state.mjs smoke-contradictory-claim-guard artifacts/extraction-validator-smoke-result.json artifacts/contradictory-claim-guard-result.json` passed.
- `node tools/fff-state.mjs smoke-malformed-missing-span-guard artifacts/extraction-validator-smoke-result.json artifacts/malformed-missing-span-guard-result.json` passed after the validator matrix grew to 9 fixtures.
- `node tools/fff-state.mjs smoke-downstream-source-span-adoption-gate artifacts/source-span-routing-review-pack.json artifacts/downstream-source-span-adoption-gate-result.json` passed for the preserved auxiliary readback.
- `node tools/fff-state.mjs smoke-provider-envelope-readiness-no-call artifacts/provider-envelope-readiness-no-call.example.json artifacts/provider-envelope-readiness-no-call-result.json` passed for the preserved auxiliary provider-envelope readback.
- `node tools/fff-state.mjs smoke-provider-adapter-authorization-readiness artifacts/provider-envelope-readiness-no-call-result.json artifacts/provider-adapter-authorization-readiness-result.json` passed for the provider authorization boundary readback.
- `node tools/fff-state.mjs smoke-remaining-fixture-coverage-one-class artifacts/local-extraction-adapter-expansion-smoke-result.json artifacts/remaining-fixture-coverage-one-class-result.json` passed for the multilingual fixture readback.
- `node tools/fff-state.mjs smoke-translated-memo-fixture-audit artifacts/local-extraction-adapter-expansion-smoke-result.json artifacts/translated-memo-fixture-audit-result.json` passed for the translated / multilingual fixture audit.
- `node tools/fff-state.mjs smoke-translation-provenance-source-span-readback artifacts/extraction-adapter-outputs/multilingual-memo-notes.json artifacts/translation-provenance-source-span-readback-result.json` passed for the translation provenance / source-span readback.
- `node tools/fff-state.mjs smoke-very-broad-source-span-shape-audit artifacts/local-extraction-adapter-expansion-smoke-result.json artifacts/very-broad-source-span-shape-audit-result.json` passed for the broad-shape audit.

## Guard Snapshot

| Guard area | Purpose | Current readback |
| --- | --- | --- |
| Conflict detection | Make contradiction explicit without deciding truth | 2 claim candidates; 1 reciprocal `contradictsClaimIds` pair |
| Human review hold | Keep both sides reversible and author-owned | 2 held conflicting claims; 0 adopted/provisional conflicting claims |
| Auto-canon block | Prevent generated conflict from becoming canon | `autoCanonPromotion=false`; `autoChronologyPromotion=false`; `worldTruthStatus=uncertain` |
| Direct claim acceptance block | Keep claim-routed source elements from becoming accepted output | 0 direct accepted claim elements |
| Source preservation | Keep evidence auditable | 2 conflicting claims preserve source refs; 60 positive source-pack rows preserved |
| Provider envelope readiness | Fix future provider output preconditions without integration | 4 provider-shaped fixture elements validate locally; no provider call, credential, endpoint, project-state mutation, or adopted canon output |
| Provider authorization readiness | Separate no-call readiness from real provider execution | 6 unauthorized items listed; 7 allowed no-call states; 3 Decision Packet options; provider configured=false; external call=false; credentials=false |
| Multilingual fixture coverage | Prove mixed-language memo spans remain local and held | 5 adapter fixtures; 60 matrix rows; 12 multilingual elements; 4 non-ASCII source-span elements; 0 mismatches |
| Translated/multilingual audit | Close the resume validation unknown and avoid duplicate fixture work | Full manifest regeneration command classified as `not_available`; translated fixture count 0; translated gap remains policy-dependent |
| Translation provenance/source-span readback | Make the source span / local normalization / held derived claim relation readable before translated fixture work | 3 source-claim rows and 1 boundary row checked; 4 spans match raw memo/source pack; 0 provider calls, credentials, translated fixtures, downstream adoption, or canon promotion |
| Very broad source-span shape audit | Decide whether the remaining broad-shape fixture candidate is needed now | Broad fixture count 0; 2 current broad rows resolved by split/keep; source-pack and downstream readbacks remain clean |

## What Remains Missing

- Human freeform review of final contradictory-claim truth remains optional and is not requested by this slice.
- Remaining fixture classes are translated memo text and very broad source-span fixture shape. Translated memo text has been audited and now has a source-span/claim provenance readback, but it is not implemented as a fixture because it still needs source-of-truth language and original-vs-translation span ownership policy before adding decision value; very broad source-span shape has been audited but not implemented because current broad rows are already resolved and no concrete source-output gap requires another fixture.
- Actual model/API extraction adapter, provider choice, credential flow, provider endpoint, transport behavior, external call permission, timeout value, and retry count remain blocked until explicit authorization.
- Durable project database, YouTube publishing, automated upload, AI video generation, complete world chronology, and final canon decisions remain out of scope.

## Review Debt

| Target | Current state | Next move |
| --- | --- | --- |
| Contradictory memo claims | Covered by `fff-contradictory-claim-guard-001`; 2 linked claims held, 0 adopted/provisional conflict claims | Do not reopen unless fixture wording, claim-link rules, or adapter output changes |
| Malformed/missing source-span payloads | Covered by `fff-malformed-missing-span-guard-001`; invalid source evidence rejected, 0 accepted routed candidates | Keep closed unless invalid fixture behavior changes |
| Sparse bullet fixture | Covered by `fff-missing-fixture-class-probe-001`; 12 held elements, 0 failures | Do not reopen unless fixture or selector changes |
| Multilingual memo fixture | Covered by `fff-remaining-fixture-coverage-one-class-001`; 12 held elements, 4 non-ASCII source-span elements, 0 failures | Do not reopen unless fixture wording, selector, or language-boundary policy changes |
| Translated memo fixture audit | Covered by `fff-translated-memo-fixture-audit-001`; existing multilingual coverage audited, translated fixture count 0, translated memo text remains a policy-dependent gap | Do not add a translated fixture until translation provenance and source-span ownership policy have concrete decision value |
| Translation provenance/source-span readback | Covered by `fff-translation-provenance-source-span-readback-001`; selected multilingual spans now point to held derived claims with no provider, translated fixture, downstream adoption, or canon promotion | Use this as the precondition evidence before any translated fixture; still require source-of-truth language and original-vs-translation span ownership policy |
| Very broad source-span shape audit | Covered by `fff-very-broad-source-span-shape-audit-001`; current broad rows stay resolved by split/keep, broad fixture count 0 | Do not add a broad fixture until adapter/source output changes or broad shape is proven to be the bottleneck |
| Weak and broad source spans | Weak spans repaired; broad spans split/kept with reason | Do not reopen unless source output or user review changes a row |
| Downstream source-span adoption gate | Auxiliary readback exists locally; 55 current downstream candidates are source-tracked, safe-routed, and held where human-owned | Do not make it active unless adoption semantics change |
| Provider envelope readiness | Auxiliary no-call readback exists; candidate envelope validates, binds existing gates, and keeps provider/call/credential fields empty | Do not treat as provider integration; use it only as the precondition for any future adapter |
| Provider adapter authorization readiness | Covered by `fff-provider-adapter-authorization-readiness-001`; authorization boundary is repo-visible, but real provider work remains blocked | Use the Decision Packet only when the next request explicitly authorizes provider choice, credentials, endpoint, transport, and external call permission |
| Remaining fixture classes | Translated memo text remains policy-dependent; very broad source-span shape is audited and deferred until source output changes | Add one class at a time only when it has concrete decision value |
| Model/API adapter | Not started | Keep blocked until explicit authorization for provider choice, credentials, endpoint, transport behavior, and all local guards remain passing |

## How To Open The Review UI

From the repo root, run:

```powershell
Invoke-Item .\public\review\index.html
```

Or use the repo-local launchers:

```powershell
.\scripts\operator\open_review.ps1
```

```sh
./scripts/operator/open_review.sh
```

Mode-specific local paths:

```text
public/review/index.html?mode=story
public/review/index.html?mode=source
public/review/index.html?mode=project
public/review/index.html?mode=artifacts
```

## Human-Owned Decision Packet

- Toma fate remains unresolved. Next move: choose provisional fate before adopting ending-sensitive profile or timeline entries.
- Brass moth truth remains unresolved. Next move: choose first-use function or keep object/rule profiles held.
- Council motive remains unresolved. Next move: choose villainous, desperate, divided, misled, false-record, or keep motive-disclosure and stolen-time profiles held.

## Next Recommended Slice

Use review memory before asking for another review. The provider authorization boundary is documented, and the translation provenance/source-span readback now exists, so the next non-redundant move is real provider adapter implementation only after explicit authorization for provider choice, credentials, endpoint, transport behavior, external call permission, timeout, and retry policy. Do not add translated memo text until source-of-truth language and original-vs-translation span ownership policy have concrete decision value. Do not add a broad source-span fixture until source output changes or broad shape is proven to be the coverage bottleneck. Do not start model/API behavior, database persistence, publishing, AI video generation, production sync, credentials, or final canon decisions unless explicitly requested.
