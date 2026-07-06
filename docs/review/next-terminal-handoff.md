# Next Terminal Handoff

This packet preserves the current working context inside the repository so another terminal can continue without relying on prior chat history.

Latest handoff refresh: 2026-07-06 JST for `fff-bridge-refinement-overview-ribbon-001`.
This restart/readback refresh started from synced `master`; before product
edits, `git status --short --branch --untracked-files=all` showed tracked
`master` parity with `origin/master`. At refresh time, the active review
checkpoint is `fff-bridge-refinement-overview-ribbon-001`;
it preserves `fff-home-cockpit-metric-linking-001`,
`fff-review-home-map-meters-001`,
`fff-draft-to-video-planning-bridge-001`,
`fff-review-brief-dark-mode-ux-001`,
`fff-one-story-draft-review-pack-001`,
`fff-designer-candidate-dashboard-001`, and
`fff-draft-review-pack-stabilization-001`;
`fff-route-lock-clean-state-readback-001` records that ClipPipeGen prompt residue
was removed from this repo, and
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
`fff-sandbox-adoption-rollback-rehearsal-001`,
`fff-production-adoption-authorization-packet-001`,
`fff-production-claim-ledger-adoption-one-claim-001`,
`fff-production-claim-ledger-rollback-rehearsal-001`,
`fff-downstream-target-authorization-packet-001`,
`fff-profile-adoption-mutation-one-claim-001`, and
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

Expected after this handoff is published: `master` is synced with `origin/master`, with `HEAD...@{u}` reporting `0 0`. The exact pushed handoff commit is whatever `git log -1 --oneline --decorate` reports after pulling; the functional baseline before this overview ribbon refresh was the synced remote head reported by `git log -1 --oneline --decorate` before edits. Local transport-residue files outside this product scope should not be treated as product work.

3. Read these files in this order:

```text
AGENTS.md
docs/project-context.md
docs/review/current-status.md
docs/review/next-terminal-handoff.md
artifacts/artifact-manifest.json
docs/review/bridge-refinement-overview-ribbon.md
artifacts/bridge-refinement-overview-ribbon-result.json
docs/review/home-cockpit-metric-linking.md
artifacts/home-cockpit-metric-linking-result.json
docs/review/review-home-map-meters.md
artifacts/review-home-map-meters-result.json
docs/review/review-brief-dark-mode-ux.md
artifacts/review-brief-dark-mode-ux-result.json
docs/review/draft-to-video-planning-bridge.md
artifacts/draft-to-video-planning-bridge-result.json
docs/review/one-story-draft-review-pack.md
artifacts/one-story-draft-review-pack-result.json
docs/review/designer-candidate-dashboard.md
artifacts/designer-candidate-dashboard-result.json
docs/review/draft-review-pack-stabilization.md
artifacts/draft-review-pack-stabilization-result.json
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
docs/review/production-adoption-authorization-packet.md
artifacts/production-adoption-authorization-packet-result.json
docs/review/production-claim-ledger-adoption-one-claim.md
artifacts/production-claim-ledger-adoption-one-claim-result.json
docs/review/production-claim-ledger-rollback-rehearsal.md
artifacts/production-claim-ledger-rollback-rehearsal-result.json
docs/review/downstream-target-authorization-packet.md
artifacts/downstream-target-authorization-packet-result.json
docs/review/profile-adoption-mutation-one-claim.md
artifacts/profile-adoption-mutation-one-claim-result.json
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

No-query access now defaults to Home Cockpit / Review Brief. The current read route is
`public/review/index.html?mode=brief`, then
`public/review/index.html?mode=bridge`; the preserved compatibility and detail routes
are `public/review/index.html?mode=home`,
`public/review/index.html?mode=draft`, and
`public/review/index.html?mode=designer`.

5. Re-run local checks before changing behavior:

```powershell
$manifest = Get-Content .\artifacts\artifact-manifest.json -Raw | ConvertFrom-Json
Invoke-Expression $manifest.validation_command
uvx --with mkdocs-material mkdocs build --strict --site-dir "$env:TEMP\fff-mkdocs-build"
git diff --check
```

Use the `uvx` form if the default Windows Python launcher is unavailable or points at the WindowsApps stub.

## Current Project State

- Active artifact: `fff-bridge-refinement-overview-ribbon-001`
- Active UI: `public/review/index.html`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Bridge Refinement Overview Ribbon doc/result: `docs/review/bridge-refinement-overview-ribbon.md`, `artifacts/bridge-refinement-overview-ribbon-result.json`
- Home Cockpit Metric Linking doc/result: `docs/review/home-cockpit-metric-linking.md`, `artifacts/home-cockpit-metric-linking-result.json`
- Review Home Map Meters doc/result: `docs/review/review-home-map-meters.md`, `artifacts/review-home-map-meters-result.json`
- Draft-to-Video Planning Bridge doc/result: `docs/review/draft-to-video-planning-bridge.md`, `artifacts/draft-to-video-planning-bridge-result.json`
- Review Brief Dark Mode UX doc/result: `docs/review/review-brief-dark-mode-ux.md`, `artifacts/review-brief-dark-mode-ux-result.json`
- One-story Draft Review Pack doc/result: `docs/review/one-story-draft-review-pack.md`, `artifacts/one-story-draft-review-pack-result.json`
- Designer Candidate Dashboard doc/result: `docs/review/designer-candidate-dashboard.md`, `artifacts/designer-candidate-dashboard-result.json`
- Draft Review Pack Stabilization doc/result: `docs/review/draft-review-pack-stabilization.md`, `artifacts/draft-review-pack-stabilization-result.json`
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
- Production adoption authorization packet doc/result: `docs/review/production-adoption-authorization-packet.md`, `artifacts/production-adoption-authorization-packet-result.json`
- Production Claim Ledger adoption one-claim doc/result: `docs/review/production-claim-ledger-adoption-one-claim.md`, `artifacts/production-claim-ledger-adoption-one-claim-result.json`
- Production Claim Ledger rollback rehearsal doc/result: `docs/review/production-claim-ledger-rollback-rehearsal.md`, `artifacts/production-claim-ledger-rollback-rehearsal-result.json`
- Downstream target authorization packet doc/result: `docs/review/downstream-target-authorization-packet.md`, `artifacts/downstream-target-authorization-packet-result.json`
- Profile adoption mutation one-claim doc/result: `docs/review/profile-adoption-mutation-one-claim.md`, `artifacts/profile-adoption-mutation-one-claim-result.json`
- Very broad source-span shape audit doc/result: `docs/review/very-broad-source-span-shape-audit.md`, `artifacts/very-broad-source-span-shape-audit-result.json`
- Malformed/missing source-span guard doc/result/fixture: `docs/review/malformed-missing-span-guard.md`, `artifacts/malformed-missing-span-guard-result.json`, `artifacts/extraction-negative-fixtures/malformed-missing-source-span.json`
- Validator fixtures and smoke: `artifacts/extraction-negative-fixtures/`, `artifacts/extraction-validator-smoke-result.json`
- Source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Local extraction adapter and outputs: `tools/fff-extract-local.mjs`, `artifacts/extraction-adapter-fixtures/`, `artifacts/extraction-adapter-outputs/`
- State adapter: `tools/fff-state.mjs`
- Model/API boundary spec: `docs/review/model-api-boundary-spec.md`

The current artifact adds a Latest Overview Report before the Home Cockpit detail shelves and refines the local Draft-to-Video Planning Bridge. It keeps `designer-content-moth-investigation-3m` and `designer-channel-mystery-lore`, exposes latest state / latest change / read-now path / next decision / locked lanes, folds the legacy Brief into a preserved detail shelf, keeps `mode=home` as an alias, and keeps provider/API, credentials, AI video generation, production render, YouTube upload, rights-clearance claims, and final canon decisions closed.

## What Finished

- `fff-bridge-refinement-overview-ribbon-001` adds `public/review/index.html?mode=brief` latest overview behavior, `docs/review/bridge-refinement-overview-ribbon.md`, `artifacts/bridge-refinement-overview-ribbon-result.json`, and `node tools/fff-state.mjs smoke-bridge-refinement-overview-ribbon ...`.
- Home Cockpit now starts with a compact Latest Overview Report: latest state, latest change, read now, next decision, and locked lanes. The overview links directly to `public/review/index.html?mode=bridge`.
- The legacy Review Brief remains in the DOM as a folded detail shelf, preserving selected candidate `designer-content-moth-investigation-3m`, selected channel route `designer-channel-mystery-lore`, route contract copy, and review prompts without competing as a second first-read introduction.
- Draft-to-Video Bridge now includes non-final refinement cues: 5 narration candidates, 6 subtitle rhythm cues, 6 visual/shot ordering cues, 3 thumbnail directions, held-truth policy, and rights/asset boundary note.
- Source Audit / Project Cockpit / Artifacts remain optional Evidence Vault shelves, and provider/API, credential, publishing, AI video generation, production render, rights-clearance, and final canon boundaries remain closed.

- `fff-home-cockpit-metric-linking-001` adds `public/review/index.html?mode=brief`, keeps `public/review/index.html?mode=home` as an alias, adds `docs/review/home-cockpit-metric-linking.md`, `artifacts/home-cockpit-metric-linking-result.json`, and `node tools/fff-state.mjs smoke-home-cockpit-metric-linking ...`.
- No-query access now lands on Home Cockpit / Review Brief, and Bridge remains the primary production-hypothesis surface at `public/review/index.html?mode=bridge`.
- The Home Cockpit adds Operator Track / Workbench / Evidence Vault / Locked Lanes grouping, a three-step "what to read now" path, nine readiness meters, shelf cards, measured-vs-hypothesis semantics, Bridge access, and Evidence Vault open triggers.
- `fff-review-home-map-meters-001` remains preserved as the prior shelf-map readback and compatibility baseline.
- Provider/API, credential, publishing, AI video generation, production render, rights-clearance, and final canon boundaries remain closed.

- `fff-draft-to-video-planning-bridge-001` adds `public/review/index.html?mode=bridge`, `docs/review/draft-to-video-planning-bridge.md`, `artifacts/draft-to-video-planning-bridge-result.json`, and `node tools/fff-state.mjs smoke-draft-to-video-planning-bridge ...`.
- The preserved Review Brief states the route contract; Review Home now explains when to open Brief, Bridge, story shelves, and Evidence Vault shelves.
- The bridge preserves selected candidate `designer-content-moth-investigation-3m` and selected channel `designer-channel-mystery-lore`, includes 5 narration outline beats, 5 subtitle/text cues, 5 shot/visual cues, 1 thumbnail brief, 1 sound/mood cue, 5 rights/asset risks, 4 held truths, and 4 reviewer decisions.
- Dark contrast was tightened for selected candidate/channel cards, review brief cards, pills, badges, tags, links, muted text, and focus-visible states.
- Provider/API, credential, publishing, AI video generation, production render, rights-clearance, and final canon boundaries remain closed.

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
- `fff-production-adoption-authorization-packet-001` prepares a freeform approval packet for possible future production adoption. It inspects 1 rollback-rehearsed candidate, proposes Profile / Claim Ledger / Timeline / Story Seed target classes, recommends Claim Ledger first, records missing user authorization fields, keeps production adoption approved=false, canon approved=false, provider approved=false, publishing approved=false, external API approved=false, and performs 0 production mutations.
- `fff-production-claim-ledger-adoption-one-claim-001` records the user-authorized production Claim Ledger adoption for exactly `multi-claim-moth-key-label`. It inspects 1 rollback-rehearsed candidate, records 1 Claim Ledger adoption row, moves `adoption_candidate_dry_run -> production_claim_ledger_adopted`, records rollback token `rollback-production-claim-ledger-adoption-moth-key-label-to-adoption-candidate-dry-run`, keeps Profile / Timeline / Story Seed mutation counts=0, canonized claims=0, provider configured=false, external call=false, credentials=false, publishing=false, and production generation=false.
- `fff-production-claim-ledger-rollback-rehearsal-001` records a readback-only rollback rehearsal for that existing production Claim Ledger row. It inspects 1 adopted Claim Ledger row, verifies rollback token `rollback-production-claim-ledger-adoption-moth-key-label-to-adoption-candidate-dry-run`, records rollback target status `adoption_candidate_dry_run`, keeps actual rollback operations=0, production Claim Ledger rows removed=0, production Claim Ledger rows retained=1, Profile / Timeline / Story Seed mutation counts=0, canonized claims=0, provider configured=false, external call=false, credentials=false, publishing=false, and production generation=false.
- `fff-downstream-target-authorization-packet-001` prepares the next downstream target authorization packet for that retained production Claim Ledger row. It confirms target status `production_claim_ledger_adopted`, rollback descriptor status `verified`, production Claim Ledger row retained=true, proposes Profile / Timeline / Story Seed / Canon decision target classes, recommends Profile as the only next target, keeps user authorization required=true, keeps downstream mutations=0, Profile / Timeline / Story Seed mutation counts=0, canonized claims=0, provider configured=false, external call=false, credentials=false, publishing=false, and production generation=false.
- `fff-profile-adoption-mutation-one-claim-001` records the user-authorized Profile-only production mutation for exactly that retained Claim Ledger row. It adds 1 non-canon Profile annotation row for `multi-profile-brass-moth-key`, records `claim_ledger_adopted -> profile_adopted_noncanon`, records rollback token `rollback-profile-adoption-moth-key-label-to-claim-ledger-only`, keeps Claim Ledger additional adoption count=0, Timeline / Story Seed mutation counts=0, canonized claims=0, provider configured=false, external call=false, credentials=false, publishing=false, and production generation=false.
- `fff-very-broad-source-span-shape-audit-001` audits the broad fixture candidate without adding another fixture. It confirms the current 2 broad rows are already resolved by the broad-span split/keep readback, leaves broad fixture work deferred until source output changes or coverage is the bottleneck, and preserves 0 source-span mismatches, 0 missing refs, 0 unsafe routes, 0 non-held defaults, 0 downstream adopted candidates, no provider configured, no external call, and no credentials touched.
- No Review Card, Operator Observation Card, repeated general Review Hub request, model/API call, credential, database persistence, publishing, production sync, AI video generation, Timeline mutation, Story Seed mutation, provider route, production rollback, additional-claim adoption, or final canon decision was added. The production adoption readbacks now consist of one Claim Ledger row and one Profile-only non-canon annotation for `multi-claim-moth-key-label`.

## Validation Readback

The active Bridge Refinement Overview Ribbon smoke validates `fff-bridge-refinement-overview-ribbon-001` while preserving the Home Cockpit, Home Map, bridge, brief, draft, designer, stabilization, and contradictory-claim readbacks. The prior broader auxiliary safety chain for `fff-contradictory-claim-guard-001`, provider-readiness, translation, adoption, rollback, and broad source-span readbacks should be run when touching those underlying contracts, not merely to review the overview ribbon.

Additional checks passed during this handoff refresh:

- `git fetch --prune origin`
- `git pull --ff-only origin master`
- `git status --short --branch --untracked-files=all`
- `git rev-list --left-right --count "HEAD...origin/master"` reported `0 0` on synced baseline `6c9c748`.
- `git status --short --branch --untracked-files=all` showed only the local `.serena/project.yml` transport-residue modification before this restart/readback update; it remained unstaged and was excluded from the handoff commit.
- `node --check tools/fff-state.mjs`
- `node tools/fff-state.mjs smoke-bridge-refinement-overview-ribbon artifacts/bridge-refinement-overview-ribbon-result.json artifacts/bridge-refinement-overview-ribbon-result.json`
- `node tools/fff-state.mjs smoke-home-cockpit-metric-linking artifacts/home-cockpit-metric-linking-result.json artifacts/home-cockpit-metric-linking-result.json`
- `node tools/fff-state.mjs smoke-draft-to-video-planning-bridge artifacts/draft-to-video-planning-bridge-result.json artifacts/draft-to-video-planning-bridge-result.json`
- `node tools/fff-state.mjs smoke-review-brief-dark-mode-ux artifacts/review-brief-dark-mode-ux-result.json artifacts/review-brief-dark-mode-ux-result.json`
- `node tools/fff-state.mjs smoke-one-story-draft-review-pack artifacts/one-story-draft-review-pack-result.json artifacts/one-story-draft-review-pack-result.json`
- `node tools/fff-state.mjs smoke-designer-candidate-dashboard artifacts/designer-candidate-dashboard-result.json artifacts/designer-candidate-dashboard-result.json`
- `node tools/fff-state.mjs smoke-contradictory-claim-guard artifacts/extraction-validator-smoke-result.json artifacts/contradictory-claim-guard-result.json`
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
- `node tools/fff-state.mjs smoke-production-adoption-authorization-packet artifacts/sandbox-adoption-rollback-rehearsal-result.json artifacts/production-adoption-authorization-packet-result.json`
- `node tools/fff-state.mjs smoke-production-claim-ledger-adoption-one-claim artifacts/production-adoption-authorization-packet-result.json artifacts/production-claim-ledger-adoption-one-claim-result.json`
- `node tools/fff-state.mjs smoke-production-claim-ledger-rollback-rehearsal artifacts/production-claim-ledger-adoption-one-claim-result.json artifacts/production-claim-ledger-rollback-rehearsal-result.json`
- `node tools/fff-state.mjs smoke-downstream-target-authorization-packet artifacts/production-claim-ledger-rollback-rehearsal-result.json artifacts/downstream-target-authorization-packet-result.json`
- `node tools/fff-state.mjs smoke-profile-adoption-mutation-one-claim artifacts/downstream-target-authorization-packet-result.json artifacts/profile-adoption-mutation-one-claim-result.json`
- HTML inline script syntax check for `public/review/index.html`
- `uvx --with mkdocs-material mkdocs build --strict --site-dir "$env:TEMP\fff-mkdocs-build"`
- `git diff --check`
- `git rev-list --left-right --count "HEAD...origin/master"` reported `0 0` before staging.
- `git grep` and `rg` route-contamination searches returned no hits after
  cleanup and before the route-lock evidence was added. After this handoff,
  expected hits are limited to the route-lock evidence and summaries.

## Preserved Boundaries

Do not add model/API extraction behavior, provider credentials, database persistence, publishing, production sync, upload credentials, AI video generation, Timeline mutation, Story Seed mutation, additional Claim Ledger adoption, actual production rollback, or final canon decisions unless the user explicitly asks for that scope. The current production adoption readbacks for `multi-claim-moth-key-label` are the Claim Ledger row and one Profile-only non-canon annotation; the Claim Ledger rollback rehearsal is non-destructive and leaves that row retained.

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
| Verify: Latest Overview then Bridge review | Starts from the 5-item Latest Overview Report, then checks the Draft-to-Video Bridge refinement | Human reviewer can accept, revise, or reject the route, narration, subtitle rhythm, visual order, thumbnail direction, and held-truth policy without reopening Source Audit / Project Cockpit / Artifacts by default |
| Advance: script/subtitle/shot refinement | Uses an accepted overview and Bridge route to narrow one narration path, subtitle rhythm, screen beats, and thumbnail comparison | One video package can become clearer while provider/API, video generation, upload, rights clearance, and final canon remain locked |
| Advance: provider adapter authorization | Uses the authorization readiness Decision Packet only after provider choice, credentials, endpoint, transport scope, external call permission, timeout, and retry policy are explicitly approved | A real adapter can be implemented without silently crossing the boundary |
| Verify: contradictory claim guard | Re-runs the held-conflict fixture and result after adapter edits | Future Claim Ledger acceptance paths can fail before they auto-promote conflicts |
| Advance: post-Profile adoption target | Uses the completed Profile adoption readback while keeping Timeline / Story Seed / Canon decision closed | A future implementation can target Timeline, Story Seed, Canon decision, or actual rollback only after separate explicit authorization |
| Verify: production Claim Ledger rollback rehearsal | Re-runs the retained-row rollback descriptor readback without mutation | A later actual rollback decision can start from known rollback evidence without implying row removal |
| Verify: sandbox rollback rehearsal | Re-runs the sandbox rollback token and transition readback before production adoption work | Future adoption work can start from a known reversible fixture row without implying production rollback |
| Verify: Claim Ledger adoption readback | Re-runs the one-claim production Claim Ledger row, before/after state, and rollback descriptor | Future work can distinguish the completed Claim Ledger adoption from still-blocked canon or non-Claim-Ledger targets |
| Advance: broader translated memo coverage | Uses the two-row minimum fixture as the regression baseline | More translated rows can be added without reopening provider work or replacing original source spans |
| Audit: translation provenance policy | Re-runs the source-span/claim and policy readbacks if fixture wording changes | Translation-derived claims can stay held and source-backed while the fixture is added |
| Audit: remaining fixture class | Adds translated or very broad fixture coverage only after policy or source-output evidence creates a concrete gap | Adapter/model regression coverage becomes less brittle without duplicate fixtures |
| Excise: weak source-span debt | Improves a concrete source-span class while preserving the broad-span and malformed-span guards | Review can focus on source usefulness instead of source validity |

## Residual Work

| Work | Purpose | Current state | Next move |
| --- | --- | --- | --- |
| Bridge Refinement Overview Ribbon | Put latest status before comprehensive shelves and make Bridge judgement-ready | `fff-bridge-refinement-overview-ribbon-001` is active; no-query access opens Home Cockpit with a Latest Overview Report, folded legacy Brief, Bridge refinement cues, and closed production lanes | Human reviewer should open overview, then Bridge, and respond freeform with accept / revise / reject |
| Home Cockpit Metric Linking | Make folded shelves legible before Bridge review | `fff-home-cockpit-metric-linking-001` is active; no-query access opens Home Cockpit with Operator Track, Workbench, Evidence Vault, Locked Lanes, and nine readiness meters | Human reviewer should open Home Cockpit, then Bridge, and only open Evidence Vault shelves when auditing |
| Review Home Map Meters | Preserve prior shelf-map readback | `fff-review-home-map-meters-001` remains available through the `mode=home` alias and its result JSON | Use only for regression comparison if the Home Cockpit wording drifts |
| Contradictory claim handling | Prevent conflicting claims from entering canon automatically | Guarded by a valid fixture and smoke result; truth choice remains human-owned | Keep the guard required for any future Claim Ledger acceptance path |
| Downstream adoption readiness | Ensure Claim Ledger / Profile / Timeline / Story Seed / Canon decision choices stay source-tracked and unauthorized until selected | Readback gate passes with 0 adopted Profile / Timeline candidates; held claim preflight, semantics design, ledger dry-run, sandbox rollback, production authorization, Claim Ledger adoption, Claim Ledger rollback rehearsal, downstream target authorization, and Profile adoption now prove exactly 1 retained Claim Ledger production adoption row plus 1 Profile-only non-canon annotation with rollback descriptors and 0 actual rollback/canon/Timeline/Story Seed/provider effects | Keep further adoption, actual rollback, canon, provider/API, and additional-claim work blocked until explicitly requested |
| Provider envelope and authorization readiness | Fix future provider output shape and approval boundary before transport exists | No-call readback passes, and authorization readiness lists 6 blocked items plus 3 options; no provider, endpoint, credential, project-state mutation, or adopted canon output exists | Use as required preconditions, not as provider integration |
| Route lock / project hygiene | Keep Fast Fiction Factory separate from ClipPipeGen prompt residue | `fff-route-lock-clean-state-readback-001` records cleanup of untracked ClipPipeGen files and no tracked contamination | Start new terminals from this handoff and keep future `clip-ed10` / `ED-10` work out of this repo |
| Fixture coverage | Cover unrepresented memo shapes | 9 validator fixtures and 5 adapter fixture outputs now pass; multilingual memo text is covered; translated memo text now has a two-row minimum fixture plus provenance, source-of-truth policy, and held-claim preflight; very broad source-span shape is audited and deferred because current broad rows are already resolved | Add more translated rows or another fixture class only when it has concrete decision value and preserves the relevant boundary |
| Model/API adapter | Replace deterministic extraction with provider-backed extraction | Explicitly not started | Keep blocked until user authorizes provider, credential, endpoint, API transport scope, external call permission, timeout, and retry policy |
