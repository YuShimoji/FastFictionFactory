# Next Terminal Handoff

This packet preserves the current working context inside the repository so another terminal can continue without relying on prior chat history.

Latest handoff refresh: 2026-06-30 JST. At refresh time, the active artifact is
still `fff-contradictory-claim-guard-001`; `fff-route-lock-clean-state-readback-001`
records that ClipPipeGen prompt residue was removed from this repo, and
`fff-provider-envelope-readiness-no-call-001`,
`fff-provider-adapter-authorization-readiness-001`,
`fff-remaining-fixture-coverage-one-class-001`,
`fff-downstream-adoption-gate-scope-lock-001`,
`fff-translated-memo-fixture-audit-001`,
`fff-translation-provenance-source-span-readback-001`,
`fff-translation-policy-source-of-truth-boundary-001`,
`fff-translated-memo-fixture-minimum-001`,
`fff-held-claim-adoption-preflight-001`,
`fff-downstream-adoption-semantics-design-001`,
`fff-adoption-candidate-ledger-dry-run-001`,
`fff-sandbox-adoption-mutation-one-claim-001`,
`fff-sandbox-adoption-rollback-rehearsal-001`, and
`fff-very-broad-source-span-shape-audit-001` are preserved auxiliary readbacks.
Run `git log -1 --oneline --decorate` after pulling for the exact remote head.

## Start Here

1. Pull the latest remote state:

```powershell
git pull --ff-only
```

2. Confirm Git parity:

```powershell
git status --short --branch
git rev-list --left-right --count "HEAD...@{u}"
git log -5 --oneline --decorate
```

Expected after this handoff is published: `master` is clean and synced with `origin/master`, with `HEAD...@{u}` reporting `0 0`.

3. Read these files in this order:

```text
AGENTS.md
docs/project-context.md
docs/review/current-status.md
docs/review/next-terminal-handoff.md
artifacts/artifact-manifest.json
docs/review/route-lock-clean-state-readback.md
docs/review/contradictory-claim-guard.md
artifacts/contradictory-claim-guard-result.json
artifacts/extraction-negative-fixtures/contradictory-claim-hold.json
docs/review/downstream-source-span-adoption-gate.md
artifacts/downstream-source-span-adoption-gate-result.json
docs/review/provider-envelope-readiness-no-call.md
artifacts/provider-envelope-readiness-no-call.example.json
artifacts/provider-envelope-readiness-no-call-result.json
docs/review/provider-adapter-authorization-readiness.md
artifacts/provider-adapter-authorization-readiness-result.json
docs/review/remaining-fixture-coverage-one-class.md
artifacts/remaining-fixture-coverage-one-class-result.json
artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md
artifacts/extraction-adapter-outputs/multilingual-memo-notes.json
docs/review/translated-memo-fixture-audit.md
artifacts/translated-memo-fixture-audit-result.json
docs/review/translation-provenance-source-span-readback.md
artifacts/translation-provenance-source-span-readback-result.json
docs/review/translation-policy-source-of-truth-boundary.md
artifacts/translation-policy-source-of-truth-boundary-result.json
docs/review/translated-memo-fixture-minimum.md
artifacts/translated-memo-fixture-minimum.json
artifacts/translated-memo-fixture-minimum-result.json
docs/review/held-claim-adoption-preflight.md
artifacts/held-claim-adoption-preflight-result.json
docs/review/downstream-adoption-semantics-design.md
artifacts/downstream-adoption-semantics-design-result.json
docs/review/adoption-candidate-ledger-dry-run.md
artifacts/adoption-candidate-ledger-dry-run-result.json
docs/review/sandbox-adoption-mutation-one-claim.md
artifacts/sandbox-adoption-mutation-one-claim-result.json
docs/review/sandbox-adoption-rollback-rehearsal.md
artifacts/sandbox-adoption-rollback-rehearsal-result.json
docs/review/very-broad-source-span-shape-audit.md
artifacts/very-broad-source-span-shape-audit-result.json
docs/review/malformed-missing-span-guard.md
artifacts/malformed-missing-span-guard-result.json
docs/review/missing-fixture-class-probe.md
artifacts/missing-fixture-class-probe-result.json
docs/review/weak-span-repair.md
artifacts/weak-span-repair-result.json
docs/review/broad-span-split.md
artifacts/broad-span-split-result.json
docs/review/routing-policy-regression-hardening.md
artifacts/routing-policy-regression-hardening-result.json
docs/review/review-memory-dedup.md
docs/review/model-api-boundary-spec.md
docs/idea-ledger.md
docs/decision-log.md
```

4. Open the active local review artifact:

```powershell
.\scripts\operator\open_review.ps1
```

or:

```sh
./scripts/operator/open_review.sh
```

5. Re-run local checks before changing behavior:

```powershell
$manifest = Get-Content .\artifacts\artifact-manifest.json -Raw | ConvertFrom-Json
Invoke-Expression $manifest.validation_command
uvx --with mkdocs-material mkdocs build --strict --site-dir "$env:TEMP\fff-mkdocs-build"
git diff --check
```

Use the `uvx` form if the default Windows Python launcher is unavailable or points at the WindowsApps stub.

## Current Project State

- Active artifact: `fff-contradictory-claim-guard-001`
- Active UI: `public/review/index.html`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Contradictory claim guard doc/result/fixture: `docs/review/contradictory-claim-guard.md`, `artifacts/contradictory-claim-guard-result.json`, `artifacts/extraction-negative-fixtures/contradictory-claim-hold.json`
- Downstream source-span adoption gate doc/result: `docs/review/downstream-source-span-adoption-gate.md`, `artifacts/downstream-source-span-adoption-gate-result.json`
- Provider envelope readiness no-call doc/example/result: `docs/review/provider-envelope-readiness-no-call.md`, `artifacts/provider-envelope-readiness-no-call.example.json`, `artifacts/provider-envelope-readiness-no-call-result.json`
- Provider adapter authorization readiness doc/result: `docs/review/provider-adapter-authorization-readiness.md`, `artifacts/provider-adapter-authorization-readiness-result.json`
- Route-lock cleanup readback: `docs/review/route-lock-clean-state-readback.md`
- Remaining fixture coverage doc/result/fixture/output: `docs/review/remaining-fixture-coverage-one-class.md`, `artifacts/remaining-fixture-coverage-one-class-result.json`, `artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md`, `artifacts/extraction-adapter-outputs/multilingual-memo-notes.json`
- Translated/multilingual fixture audit doc/result: `docs/review/translated-memo-fixture-audit.md`, `artifacts/translated-memo-fixture-audit-result.json`
- Translation provenance/source-span readback doc/result: `docs/review/translation-provenance-source-span-readback.md`, `artifacts/translation-provenance-source-span-readback-result.json`
- Translation policy source-of-truth boundary doc/result: `docs/review/translation-policy-source-of-truth-boundary.md`, `artifacts/translation-policy-source-of-truth-boundary-result.json`
- Minimal translated memo fixture doc/fixture/result: `docs/review/translated-memo-fixture-minimum.md`, `artifacts/translated-memo-fixture-minimum.json`, `artifacts/translated-memo-fixture-minimum-result.json`
- Held claim adoption preflight doc/result: `docs/review/held-claim-adoption-preflight.md`, `artifacts/held-claim-adoption-preflight-result.json`
- Downstream adoption semantics design doc/result: `docs/review/downstream-adoption-semantics-design.md`, `artifacts/downstream-adoption-semantics-design-result.json`
- Adoption candidate ledger dry-run doc/result: `docs/review/adoption-candidate-ledger-dry-run.md`, `artifacts/adoption-candidate-ledger-dry-run-result.json`
- Sandbox adoption mutation one-claim doc/result: `docs/review/sandbox-adoption-mutation-one-claim.md`, `artifacts/sandbox-adoption-mutation-one-claim-result.json`
- Sandbox adoption rollback rehearsal doc/result: `docs/review/sandbox-adoption-rollback-rehearsal.md`, `artifacts/sandbox-adoption-rollback-rehearsal-result.json`
- Very broad source-span shape audit doc/result: `docs/review/very-broad-source-span-shape-audit.md`, `artifacts/very-broad-source-span-shape-audit-result.json`
- Malformed/missing source-span guard doc/result/fixture: `docs/review/malformed-missing-span-guard.md`, `artifacts/malformed-missing-span-guard-result.json`, `artifacts/extraction-negative-fixtures/malformed-missing-source-span.json`
- Validator fixtures and smoke: `artifacts/extraction-negative-fixtures/`, `artifacts/extraction-validator-smoke-result.json`
- Source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Local extraction adapter and outputs: `tools/fff-extract-local.mjs`, `artifacts/extraction-adapter-fixtures/`, `artifacts/extraction-adapter-outputs/`
- State adapter: `tools/fff-state.mjs`
- Model/API boundary spec: `docs/review/model-api-boundary-spec.md`

The current artifact adds a deterministic guard for contradictory claim candidates. It keeps two conflicting, source-backed claims in held review, preserves their reciprocal contradiction links and source refs, and proves there are 0 adopted/provisional conflicting claims and 0 direct accepted claim-routed elements. It does not decide which claim is true.

## What Finished

- `fff-contradictory-claim-guard-001` adds `node tools/fff-state.mjs smoke-contradictory-claim-guard ...`.
- The extraction fixture matrix now has 9 fixtures: 3 expected valid and 6 expected invalid.
- `contradictory-claim-hold.json` is expected valid and carries 2 held claim candidates with reciprocal `contradictsClaimIds`.
- `artifacts/contradictory-claim-guard-result.json` reports 2 conflicting claims checked, 1 reciprocal conflict pair, 2 held conflicting claims, 0 adopted/provisional conflicting claims, 0 direct accepted claim elements, 2 source-ref-preserved conflicting claims, and 0 failures.
- `fff-remaining-fixture-coverage-one-class-001` adds one multilingual memo text fixture. The adapter matrix now has 5 fixture outputs and 60 elements; the selected fixture has 12 elements, 4 non-ASCII source-span elements, 0 source-span mismatches, 0 missing source refs, 0 unsafe visual routes, and 0 non-held defaults.
- `fff-downstream-source-span-adoption-gate-001` is preserved as the auxiliary downstream-readiness gate: 55 downstream candidates remain source-tracked, 28 human-owned candidates remain held, and 0 Profile / Claim / Timeline candidates are adopted.
- `fff-provider-envelope-readiness-no-call-001` is preserved as the auxiliary provider-readiness gate: the no-call envelope carries a valid candidate Extraction Contract with 4 source-tracked elements, 2 held human-owned elements, 0 visual direct Claim routes, 0 adopted/provisional elements or claims, no provider configured, no endpoint, no external call attempted, and no credentials touched.
- `fff-provider-adapter-authorization-readiness-001` is preserved as the auxiliary authorization gate: it records that provider choice, credentials/secrets, endpoint, transport, external call permission, and persistence/publication remain unauthorized, while local no-call envelopes and validation gates are allowed.
- `fff-route-lock-clean-state-readback-001` records that four untracked
  ClipPipeGen-derived files under `docs/style_intent/` were deleted from this
  repo, `docs/style_intent/` was removed after it became empty, and tracked plus
  workspace searches returned no foreign-route hits after cleanup and before
  the route-lock evidence was added. Future hits should be confined to the
  route-lock evidence and cockpit summaries.
- `fff-malformed-missing-span-guard-001` remains closed after the fixture count expanded to 9; malformed/missing span cases still produce 0 accepted routed candidates.
- `fff-translated-memo-fixture-audit-001` audits existing multilingual fixture coverage without adding a translated fixture. It closes the previous full-manifest-regeneration unknown as `not_available` because no repo command is defined, records translated memo text as a policy-dependent gap, and preserves 0 source-span mismatches, 0 missing source refs, 0 unsafe routes, 0 downstream adopted candidates, no provider configured, no external call, and no credentials touched.
- `fff-translation-provenance-source-span-readback-001` records 3 selected multilingual source-span to held derived-claim relations plus 1 inline-gloss boundary row. All 4 checked source spans match the raw memo and source-pack rows, all 3 derived claims remain held and source-backed, that readback itself added no translated fixture, provider configured=false, external call=false, credentials=false, downstream adopted candidates=0, adopted/provisional conflicting claims=0, and direct accepted claim elements=0.
- `fff-translation-policy-source-of-truth-boundary-001` records the pre-fixture translation policy boundary: original multilingual author memo text is the source-of-truth surface, original sourceSpan locators own evidence, translated spans are derivative/provenance-bound, inline gloss cannot create unowned claims, derived claims remain held, and provider/API/credential work stays blocked.
- `fff-translated-memo-fixture-minimum-001` records the first translated memo fixture after that policy boundary. It checks 2 translated rows, 2 original span matches, 0 original span mismatches, 0 translation-to-claim leaks, 1 held linked claim, 0 auto-promotions, 0 inline gloss claim leaks, provider configured=false, external call=false, credentials=false, and downstream adopted candidates=0.
- `fff-held-claim-adoption-preflight-001` inspects `multi-claim-moth-key-label` from the translated fixture as a preflight-only downstream candidate. It records 1 held claim inspected, 1 source-backed claim, 1 eligible preflight candidate, 0 adopted claims, 0 canonized claims, 0 translation/gloss leaks, provider configured=false, external call=false, credentials=false, and downstream adopted candidates=0.
- `fff-downstream-adoption-semantics-design-001` defines the design-only adoption contract for `multi-claim-moth-key-label`. It records 1 preflight candidate, `hold -> adoption_candidate` as the only current readback-only transition, future `human_accepted_downstream_adoption` as unreachable now, 10 rollback conditions, 4 blocked mutation targets, 0 adopted claims, 0 canonized claims, provider configured=false, external call=false, credentials=false, and downstream adopted candidates=0.
- `fff-adoption-candidate-ledger-dry-run-001` records `multi-claim-moth-key-label` as a non-mutating `adoption_candidate_dry_run` row. It carries source span `multi-x-object-brass-moth-key`, prior claim status `hold`, rollback/rejection vocabulary, future-only Profile / Claim / Timeline targets, 0 adopted claims, 0 canonized claims, 0 Profile / Claim / Timeline / Story Seed mutations, provider configured=false, external call=false, credentials=false, publishing=false, and production generation=false.
- `fff-sandbox-adoption-mutation-one-claim-001` records one authorized sandbox fixture row for `multi-claim-moth-key-label`, transitioning `adoption_candidate_dry_run -> sandbox_adopted_fixture`. It records rollback token `rollback-sandbox-adoption-moth-key-label-to-adoption-candidate-dry-run`, production adopted claims=0, canonized claims=0, Profile / Claim / Timeline / Story Seed production mutations=0, provider configured=false, external call=false, credentials=false, publishing=false, and production generation=false.
- `fff-sandbox-adoption-rollback-rehearsal-001` rehearses rollback for that sandbox fixture row only. It verifies rollback token `rollback-sandbox-adoption-moth-key-label-to-adoption-candidate-dry-run`, records `sandbox_adopted_fixture -> adoption_candidate_dry_run`, keeps production rollback performed=false, production adopted claims=0, canonized claims=0, Profile / Claim / Timeline / Story Seed production mutations=0, provider configured=false, external call=false, credentials=false, publishing=false, and production generation=false.
- `fff-very-broad-source-span-shape-audit-001` audits the broad fixture candidate without adding another fixture. It confirms the current 2 broad rows are already resolved by the broad-span split/keep readback, leaves broad fixture work deferred until source output changes or coverage is the bottleneck, and preserves 0 source-span mismatches, 0 missing refs, 0 unsafe routes, 0 non-held defaults, 0 downstream adopted candidates, no provider configured, no external call, and no credentials touched.
- No Review Card, Operator Observation Card, repeated general Review Hub request, model/API call, credential, database persistence, publishing, production sync, AI video generation, production downstream adoption behavior, provider route, production rollback, or final canon decision was added. The only adoption mutation is the sandbox fixture row recorded by `fff-sandbox-adoption-mutation-one-claim-001`; the rollback rehearsal is sandbox readback only.

## Validation Readback

The active manifest validation command passed for `fff-contradictory-claim-guard-001` while also refreshing `fff-provider-envelope-readiness-no-call-001`, `fff-provider-adapter-authorization-readiness-001`, `fff-remaining-fixture-coverage-one-class-001`, `fff-translated-memo-fixture-audit-001`, `fff-translation-provenance-source-span-readback-001`, `fff-translation-policy-source-of-truth-boundary-001`, `fff-translated-memo-fixture-minimum-001`, `fff-held-claim-adoption-preflight-001`, `fff-downstream-adoption-semantics-design-001`, `fff-adoption-candidate-ledger-dry-run-001`, `fff-sandbox-adoption-mutation-one-claim-001`, `fff-sandbox-adoption-rollback-rehearsal-001`, and `fff-very-broad-source-span-shape-audit-001`. It regenerated adapter smoke/matrix outputs, regenerated the source-span review pack, re-ran routing, broad-span, weak-span, missing-fixture, multilingual-fixture, translated/multilingual audit, translation provenance/source-span readback, translation policy boundary, minimal translated memo fixture, held claim adoption preflight, downstream adoption semantics design, adoption candidate ledger dry-run, sandbox adoption mutation one-claim, sandbox adoption rollback rehearsal, very-broad-shape audit, malformed/missing-span, contradictory-claim, downstream gate, provider-envelope, and provider-authorization smokes, validated current/sample project state, validated the sample extraction payload, and checked the Review Hub text for the active artifact plus provider readiness evidence.

Additional checks passed during this handoff refresh:

- `node --check tools/fff-state.mjs`
- `node --check tools/fff-extract-local.mjs`
- `node --check tools/fff-source-span-review-pack.mjs`
- `node tools/fff-state.mjs smoke-provider-adapter-authorization-readiness artifacts/provider-envelope-readiness-no-call-result.json artifacts/provider-adapter-authorization-readiness-result.json`
- `node tools/fff-state.mjs smoke-translation-provenance-source-span-readback artifacts/extraction-adapter-outputs/multilingual-memo-notes.json artifacts/translation-provenance-source-span-readback-result.json`
- `node tools/fff-state.mjs smoke-translation-policy-source-of-truth-boundary artifacts/translation-provenance-source-span-readback-result.json artifacts/translation-policy-source-of-truth-boundary-result.json`
- `node tools/fff-state.mjs smoke-translated-memo-fixture-minimum artifacts/translated-memo-fixture-minimum.json artifacts/translated-memo-fixture-minimum-result.json`
- `node tools/fff-state.mjs smoke-held-claim-adoption-preflight artifacts/translated-memo-fixture-minimum-result.json artifacts/held-claim-adoption-preflight-result.json`
- `node tools/fff-state.mjs smoke-downstream-adoption-semantics-design artifacts/held-claim-adoption-preflight-result.json artifacts/downstream-adoption-semantics-design-result.json`
- `node tools/fff-state.mjs smoke-adoption-candidate-ledger-dry-run artifacts/downstream-adoption-semantics-design-result.json artifacts/adoption-candidate-ledger-dry-run-result.json`
- `node tools/fff-state.mjs smoke-sandbox-adoption-mutation-one-claim artifacts/adoption-candidate-ledger-dry-run-result.json artifacts/sandbox-adoption-mutation-one-claim-result.json`
- `node tools/fff-state.mjs smoke-sandbox-adoption-rollback-rehearsal artifacts/sandbox-adoption-mutation-one-claim-result.json artifacts/sandbox-adoption-rollback-rehearsal-result.json`
- HTML inline script syntax check for `public/review/index.html`
- `uvx --with mkdocs-material mkdocs build --strict --site-dir "$env:TEMP\fff-mkdocs-build"`
- `git diff --check`
- `git rev-list --left-right --count "HEAD...origin/master"` reported `0 0` before staging.
- `git grep` and `rg` route-contamination searches returned no hits after
  cleanup and before the route-lock evidence was added. After this handoff,
  expected hits are limited to the route-lock evidence and summaries.

## Preserved Boundaries

Do not add model/API extraction behavior, provider credentials, database persistence, publishing, production sync, upload credentials, AI video generation, actual downstream adoption, or final canon decisions unless the user explicitly asks for that scope.

These remain human-owned unresolved decisions:

- Toma fate
- brass moth truth
- Council motive
- which contradictory claim is true

The local review state is not final canon. Claims, profiles, timeline entries, extraction elements, adapter confidence, validator results, source-span pack summaries, and contradictory-claim links may guide review, but durable story authority remains with the human author.

## Review Intake Contract

When review is needed, accept natural freeform review text instead of fixed phrases.

Before emitting a Review Card, check the review memory. Do not ask the same target/evidence/axis again unless target, axis, evidence, decision value, or an explicit user request changed.

No general Review Hub review is needed for the current state. Future review should be bounded to one concrete target such as provider adapter authorization, a remaining fixture class, or a specific source-span quality repair.

## Next Useful Entrances

| Entrance | Why it helps | What becomes possible |
| --- | --- | --- |
| Advance: provider adapter authorization | Uses the authorization readiness Decision Packet only after provider choice, credentials, endpoint, transport scope, external call permission, timeout, and retry policy are explicitly approved | A real adapter can be implemented without silently crossing the boundary |
| Verify: contradictory claim guard | Re-runs the held-conflict fixture and result after adapter edits | Future Claim Ledger acceptance paths can fail before they auto-promote conflicts |
| Advance: actual downstream adoption implementation | Uses the held claim preflight row and downstream adoption semantics design before any Profile / Claim / Timeline / Story Seed mutation exists | A future implementation can wire accepted status, rollback, and target mutation only after explicit authorization |
| Verify: sandbox rollback rehearsal | Re-runs the sandbox rollback token and transition readback before production adoption work | Future adoption work can start from a known reversible fixture row without implying production rollback |
| Advance: broader translated memo coverage | Uses the two-row minimum fixture as the regression baseline | More translated rows can be added without reopening provider work or replacing original source spans |
| Audit: translation provenance policy | Re-runs the source-span/claim and policy readbacks if fixture wording changes | Translation-derived claims can stay held and source-backed while the fixture is added |
| Audit: remaining fixture class | Adds translated or very broad fixture coverage only after policy or source-output evidence creates a concrete gap | Adapter/model regression coverage becomes less brittle without duplicate fixtures |
| Excise: weak source-span debt | Improves a concrete source-span class while preserving the broad-span and malformed-span guards | Review can focus on source usefulness instead of source validity |

## Residual Work

| Work | Purpose | Current state | Next move |
| --- | --- | --- | --- |
| Contradictory claim handling | Prevent conflicting claims from entering canon automatically | Guarded by a valid fixture and smoke result; truth choice remains human-owned | Keep the guard required for any future Claim Ledger acceptance path |
| Downstream adoption readiness | Ensure Profile / Claim / Timeline candidates stay source-tracked and held | Readback gate passes with 0 adopted candidates; held claim preflight identifies 1 source-backed preflight-only candidate; downstream adoption semantics design defines accepted status, rollback, and mutation boundaries while still adopting 0; sandbox adoption rollback rehearsal verifies the fixture rollback token and transition without production rollback | Keep blocked until explicit adoption implementation and mutation behavior are requested |
| Provider envelope and authorization readiness | Fix future provider output shape and approval boundary before transport exists | No-call readback passes, and authorization readiness lists 6 blocked items plus 3 options; no provider, endpoint, credential, project-state mutation, or adopted canon output exists | Use as required preconditions, not as provider integration |
| Route lock / project hygiene | Keep Fast Fiction Factory separate from ClipPipeGen prompt residue | `fff-route-lock-clean-state-readback-001` records cleanup of untracked ClipPipeGen files and no tracked contamination | Start new terminals from this handoff and keep future `clip-ed10` / `ED-10` work out of this repo |
| Fixture coverage | Cover unrepresented memo shapes | 9 validator fixtures and 5 adapter fixture outputs now pass; multilingual memo text is covered; translated memo text now has a two-row minimum fixture plus provenance, source-of-truth policy, and held-claim preflight; very broad source-span shape is audited and deferred because current broad rows are already resolved | Add more translated rows or another fixture class only when it has concrete decision value and preserves the relevant boundary |
| Model/API adapter | Replace deterministic extraction with provider-backed extraction | Explicitly not started | Keep blocked until user authorizes provider, credential, endpoint, API transport scope, external call permission, timeout, and retry policy |
