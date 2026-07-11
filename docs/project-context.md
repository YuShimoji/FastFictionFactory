# Project Context

## Current Axis

Fast Fiction Factory is a local-first fiction production workbench. The current checkpoint is `fff-editorial-revision-roundtrip-001`, served at `public/review/index.html?mode=revision` with a portable six-file package under `artifacts/editorial-revision/`. It adds a guarded request, before/after comparison, decision, and unapplied-patch return path over the immutable `fff-bridge-editorial-handoff-pack-001` source. The deterministic example contains six changes classified `3 safe_local_edit / 1 human_author_required / 2 blocked_boundary`, resolves them as `3 accept / 1 hold / 2 reject`, and exports only three accepted safe wording changes with `apply_status=not_applied`. The exact six-beat/180-second Handoff source, Bridge Storyboard Flow, Brief Workbench, themes, truth/rights boundaries, and package hashes remain preserved.

## Current Lane

Keep the MVP repeatedly editable without silently mutating its source package. The current lane is `EDITORIAL_REVISION_ROUNDTRIP`: import local request JSON, fail closed on invalid identity or boundary changes, allow only wording edits to be accepted, and export decisions plus an unapplied safe patch. Timing/order, story truth, canon, rights, assets, provider/API, credentials, external calls, generation, render, upload, and database persistence remain closed.

## Current Slice

The active slice is complete enough for guarded local revision readback:

- Editorial Revision Roundtrip doc/result/screenshot target: `docs/review/editorial-revision-roundtrip.md`, `artifacts/editorial-revision-roundtrip-result.json`, `artifacts/review-screens/editorial-revision-roundtrip.png`
- Portable revision package: `artifacts/editorial-revision/README_REVISION.md`, `revision-request-template.json`, `revision-request.example.json`, `revision-decision.example.json`, `revision-patch.example.json`, `revision-roundtrip-manifest.json`
- Focused Revision mode: `public/review/index.html?mode=revision`
- Mode-aware launchers: `scripts/operator/open_review.ps1 -Mode revision`, `scripts/operator/open_review.sh --mode revision`; no argument remains Brief and print-only URI checks are available
- Editorial Handoff Pack doc/result/screenshot target: `docs/review/bridge-editorial-handoff-pack.md`, `artifacts/bridge-editorial-handoff-pack-result.json`, `artifacts/review-screens/bridge-editorial-handoff-pack.png`
- Portable package: `artifacts/editorial-handoff/README_DELIVERY.md`, `narration-script.md`, `subtitle-cues.csv`, `shot-list.csv`, `editorial-handoff.json`, `package-manifest.json`
- Focused Handoff mode: `public/review/index.html?mode=handoff`
- Bridge Storyboard Flow doc/result/screenshot: `docs/review/bridge-storyboard-flow.md`, `artifacts/bridge-storyboard-flow-result.json`, `artifacts/review-screens/bridge-storyboard-flow.png`
- Review UI: `public/review/index.html`
- Review Brief mode with role-contracted Review Workbench: `public/review/index.html?mode=brief`
- Layout Research Lab mode preserved: `public/review/index.html?mode=layout-lab`
- Review Home compatibility alias: `public/review/index.html?mode=home`
- Draft-to-Video Bridge mode: `public/review/index.html?mode=bridge`
- Draft Review Pack mode: `public/review/index.html?mode=draft`
- Designer Dashboard mode: `public/review/index.html?mode=designer`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Review Workbench Component Contract doc/result/screenshot: `docs/review/review-workbench-component-contract.md`, `artifacts/review-workbench-component-contract-result.json`, `artifacts/review-screens/brief-component-contract-workbench.png`
- Apply Decision Shell Guard Diet doc/result/screenshot: `docs/review/apply-decision-shell-guard-diet.md`, `artifacts/apply-decision-shell-guard-diet-result.json`, `artifacts/review-screens/brief-decision-shell-applied.png`
- Layout Lab Visual Audit doc/result/contact sheet: `docs/review/layout-lab-visual-audit.md`, `artifacts/layout-lab-visual-audit-result.json`, `artifacts/layout-lab-visual-audit-contact-sheet.png`
- Layout Lab Visual Audit screenshots: `artifacts/review-screens/layout-lab.png`, `artifacts/review-screens/layout-lab-decision-shell.png`, `artifacts/review-screens/brief-preserved.png`, `artifacts/review-screens/bridge-preserved.png`
- Layout Research Decision Shell doc/result: `docs/review/layout-research-decision-shell.md`, `artifacts/layout-research-decision-shell-result.json`
- Low-text Decision Console doc/result: `docs/review/low-text-decision-console.md`, `artifacts/low-text-decision-console-result.json`
- Guided Review Flow Workspace doc/result: `docs/review/guided-review-flow-workspace.md`, `artifacts/guided-review-flow-workspace-result.json`
- Bridge Refinement Overview Ribbon doc/result: `docs/review/bridge-refinement-overview-ribbon.md`, `artifacts/bridge-refinement-overview-ribbon-result.json`
- Home Cockpit Metric Linking doc/result: `docs/review/home-cockpit-metric-linking.md`, `artifacts/home-cockpit-metric-linking-result.json`
- Review Home Map Meters doc/result: `docs/review/review-home-map-meters.md`, `artifacts/review-home-map-meters-result.json`
- Draft-to-Video Planning Bridge doc/result: `docs/review/draft-to-video-planning-bridge.md`, `artifacts/draft-to-video-planning-bridge-result.json`
- Review Brief Dark Mode UX doc/result: `docs/review/review-brief-dark-mode-ux.md`, `artifacts/review-brief-dark-mode-ux-result.json`
- Stabilization doc/result: `docs/review/draft-review-pack-stabilization.md`, `artifacts/draft-review-pack-stabilization-result.json`
- Draft Review Pack doc/result: `docs/review/one-story-draft-review-pack.md`, `artifacts/one-story-draft-review-pack-result.json`
- Designer Dashboard doc/result: `docs/review/designer-candidate-dashboard.md`, `artifacts/designer-candidate-dashboard-result.json`
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

Editorial Handoff Pack checkpoint, 2026-07-11 JST:

- `fff-bridge-editorial-handoff-pack-001` preserves the exact six-beat order and windows for 180 seconds, adds 6 complete provisional narration segments, 20 subtitle cues, 19 generic shot cues, 3 thumbnail directions, 4 held truth guards, 4 rights guards, and a five-file SHA256 package manifest.
- `public/review/index.html?mode=handoff` is a separate focused editing route; Bridge gains one compact Handoff action and does not duplicate the package.
- The active manifest health path uses `validate-bridge-editorial-handoff-pack` and preserved read-only validators. The `smoke-*` command is reserved for intentional regeneration of only the new package metadata and result artifact.
- Provider/API, credentials, external calls, asset generation/selection, render, upload, database persistence, rights clearance, and final canon remain closed.

Route hygiene checkpoint, 2026-06-29 JST:

- `fff-route-lock-clean-state-readback-001` records that four untracked
  ClipPipeGen-derived residue files under `docs/style_intent/` were deleted
  from this repo.
- Tracked and workspace searches for the foreign-route terms returned no hits
  after cleanup and before this readback was added. Future hits should be
  confined to `fff-route-lock-clean-state-readback-001` evidence and its
  cockpit summaries.
- `docs/style_intent/` was removed because it was empty and residue-only.
- The active Fast Fiction Factory review package is now
  `fff-bridge-storyboard-flow-001`; it places a six-beat planning Flow first on
  `bridge` while preserving `fff-review-workbench-component-contract-001` and the applied `brief`
  Shell into a role-contracted Workbench, keeps `activeDecisionCanvas` as the
  single framing source, makes route navigation compact, caps the Context Dock
  at 4 context chips / 3 pins / 2 notices / 1 lock summary, and moves launch
  commands behind the Operator utility drawer. The source applied Shell remains
  `fff-apply-decision-shell-guard-diet-001`; it still renders route choices from
  `decisionFlowModel`, keeps Dock Governor overflow, and keeps full production
  boundary detail in the Guard drawer. The source visual audit still records
  verified local screenshots for `layout-lab`, the Split-pane Decision Shell
  detail, preserved `brief`, and preserved `bridge`, plus a contact sheet for
  human visual review. The source layout research still records four
  low-fidelity wireframe alternatives, a heuristic layout score matrix, a
  split-pane Decision Shell recommendation, and a local `decisionFlowModel`
  while preserving the no-query `brief` entry, Bridge Decision Console, and
  closed production gates through
  `fff-low-text-decision-console-001`,
  `fff-guided-review-flow-workspace-001`,
  `fff-bridge-refinement-overview-ribbon-001`,
  `fff-home-cockpit-metric-linking-001`,
  `fff-review-home-map-meters-001`,
  `fff-draft-to-video-planning-bridge-001`,
  `fff-review-brief-dark-mode-ux-001`,
  `fff-one-story-draft-review-pack-001`,
  `fff-draft-review-pack-stabilization-001`,
  `fff-designer-candidate-dashboard-001`, and
  `fff-contradictory-claim-guard-001` as readbacks.

Current Bridge Storyboard Flow readiness was verified on 2026-07-11 from synced
`62f7d74`: the targeted read-only manifest command passed, nine result/readback
hashes remained unchanged, the validate-output-path rejection returned nonzero
without creating a file, and the 900x1200 browser capture showed no horizontal
overflow or interaction errors.

The previous Workbench restart readiness was reverified from synced `af4a376`: the
read-only manifest validation chain, inline HTML script compilation, strict
MkDocs build through `uvx`, `git diff --check`, and `HEAD...origin/master` parity
all passed. The broader preserved safety chain below was last fully verified on
2026-07-07 and was not re-run merely for this handoff refresh:

```powershell
$manifest = Get-Content .\artifacts\artifact-manifest.json -Raw | ConvertFrom-Json
Invoke-Expression $manifest.validation_command
node .\tools\fff-state.mjs smoke-layout-lab-visual-audit .\artifacts\layout-lab-visual-audit-result.json .\artifacts\layout-lab-visual-audit-result.json
node .\tools\fff-state.mjs smoke-apply-decision-shell-guard-diet .\artifacts\apply-decision-shell-guard-diet-result.json .\artifacts\apply-decision-shell-guard-diet-result.json
node .\tools\fff-state.mjs smoke-layout-research-decision-shell .\artifacts\layout-research-decision-shell-result.json .\artifacts\layout-research-decision-shell-result.json
node .\tools\fff-state.mjs smoke-low-text-decision-console .\artifacts\low-text-decision-console-result.json .\artifacts\low-text-decision-console-result.json
node .\tools\fff-state.mjs smoke-guided-review-flow-workspace .\artifacts\guided-review-flow-workspace-result.json .\artifacts\guided-review-flow-workspace-result.json
node .\tools\fff-state.mjs smoke-review-brief-dark-mode-ux .\artifacts\review-brief-dark-mode-ux-result.json .\artifacts\review-brief-dark-mode-ux-result.json
node .\tools\fff-state.mjs smoke-review-home-map-meters .\artifacts\review-home-map-meters-result.json .\artifacts\review-home-map-meters-result.json
node .\tools\fff-state.mjs smoke-draft-to-video-planning-bridge .\artifacts\draft-to-video-planning-bridge-result.json .\artifacts\draft-to-video-planning-bridge-result.json
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
node .\tools\fff-state.mjs smoke-translation-policy-source-of-truth-boundary .\artifacts\translation-provenance-source-span-readback-result.json .\artifacts\translation-policy-source-of-truth-boundary-result.json
node .\tools\fff-state.mjs smoke-translated-memo-fixture-minimum .\artifacts\translated-memo-fixture-minimum.json .\artifacts\translated-memo-fixture-minimum-result.json
node .\tools\fff-state.mjs smoke-held-claim-adoption-preflight .\artifacts\translated-memo-fixture-minimum-result.json .\artifacts\held-claim-adoption-preflight-result.json
node .\tools\fff-state.mjs smoke-downstream-adoption-semantics-design .\artifacts\held-claim-adoption-preflight-result.json .\artifacts\downstream-adoption-semantics-design-result.json
node .\tools\fff-state.mjs smoke-adoption-candidate-ledger-dry-run .\artifacts\downstream-adoption-semantics-design-result.json .\artifacts\adoption-candidate-ledger-dry-run-result.json
node .\tools\fff-state.mjs smoke-sandbox-adoption-mutation-one-claim .\artifacts\adoption-candidate-ledger-dry-run-result.json .\artifacts\sandbox-adoption-mutation-one-claim-result.json
node .\tools\fff-state.mjs smoke-sandbox-adoption-rollback-rehearsal .\artifacts\sandbox-adoption-mutation-one-claim-result.json .\artifacts\sandbox-adoption-rollback-rehearsal-result.json
node .\tools\fff-state.mjs smoke-production-adoption-authorization-packet .\artifacts\sandbox-adoption-rollback-rehearsal-result.json .\artifacts\production-adoption-authorization-packet-result.json
node .\tools\fff-state.mjs smoke-production-claim-ledger-adoption-one-claim .\artifacts\production-adoption-authorization-packet-result.json .\artifacts\production-claim-ledger-adoption-one-claim-result.json
node .\tools\fff-state.mjs smoke-production-claim-ledger-rollback-rehearsal .\artifacts\production-claim-ledger-adoption-one-claim-result.json .\artifacts\production-claim-ledger-rollback-rehearsal-result.json
node .\tools\fff-state.mjs smoke-downstream-target-authorization-packet .\artifacts\production-claim-ledger-rollback-rehearsal-result.json .\artifacts\downstream-target-authorization-packet-result.json
node .\tools\fff-state.mjs smoke-profile-adoption-mutation-one-claim .\artifacts\downstream-target-authorization-packet-result.json .\artifacts\profile-adoption-mutation-one-claim-result.json
node .\tools\fff-state.mjs smoke-very-broad-source-span-shape-audit .\artifacts\local-extraction-adapter-expansion-smoke-result.json .\artifacts\very-broad-source-span-shape-audit-result.json
```

Result summary:

- Apply Decision Shell Guard Diet passes for `fff-apply-decision-shell-guard-diet-001`: the default `brief` route starts with the applied Split-pane Decision Shell, `decisionFlowModel` drives choices/steps/context/pins/notices/locks/next action, Dock Governor caps visible rows with drawer overflow, Safety Gate Diet keeps true gates compact plus detailed in the Guard drawer, the non-gate whitelist is explicit, and provider/API, credential, upload, AI video, render, database, rights, and final-canon boundaries remain closed.
- Layout Lab Visual Audit remains preserved for `fff-layout-lab-visual-audit-001`: the local package contains four Playwright/Edge screenshots, one contact sheet, verified `layout-lab` access, the recommended Split-pane Decision Shell visual detail, preserved `brief` and `bridge` routes, dark mode, and closed provider/API, credential, upload, AI video, render, database, rights, and final-canon boundaries.
- Low-text Decision Console readback passes for `fff-low-text-decision-console-001`: the first visible `brief` content is one route question before the Guided Review Flow, Latest Overview Report, and legacy card grids; five short choices, one primary Bridge action, six step labels, one current step, context chips, closed detail/notes shelves, Bridge Decision Console, text-budget checks, and provider/API, AI video, render, upload, final canon, database persistence, and rights-clearance boundaries remain closed.
- Guided Review Flow Workspace readback remains preserved for `fff-guided-review-flow-workspace-001`: the Guided Flow remains below the low-text console, one primary Bridge action is present, the Decision Queue has six steps and one current step, Pinned Tray / Operations Notice / Important Folders / Inspiration Workspace are visible, the Bridge route has a matching guided sequence, and provider/API, AI video, render, upload, final canon, database persistence, and rights-clearance boundaries remain closed.
- Stabilization readback passes for `fff-draft-review-pack-stabilization-001`: Designer Dashboard and Draft Review Pack routes are statically verified, both result artifacts and docs exist, the contradictory claim guard is preserved, access state is `verified_present`, and browser file URL capture is recorded as blocked by browser URL policy with static readback used as fallback.
- Home Cockpit Metric Linking readback passes for `fff-home-cockpit-metric-linking-001`: no-query access defaults to `brief`, `mode=home` aliases to the same surface, Operator Track / Workbench / Evidence Vault / Locked Lanes are visible, nine readiness meters link to concrete actions, Bridge remains linked from the first screen, Dark / Light / Auto theme controls remain present, and provider/API, AI video, render, upload, final canon, and rights-clearance boundaries remain closed.
- Bridge Refinement Overview Ribbon readback passes for `fff-bridge-refinement-overview-ribbon-001`: the Home Cockpit has a compact 5-item Latest Overview Report, the overview links directly to Bridge, legacy Review Brief content is folded while preserving candidate/channel IDs and review prompts, Bridge has a back-to-overview reference, refinement cues are visible for 5 narration candidates, 6 subtitle rhythm cues, 6 visual ordering cues, 3 thumbnail directions, held-truth policy, and rights/asset boundaries, and provider/API, AI video, render, upload, final canon, and rights-clearance boundaries remain closed.
- Review Brief / dark mode UX readback passes for `fff-review-brief-dark-mode-ux-001`: `public/review/index.html?mode=brief` remains available as a preserved prelude route, selected candidate `designer-content-moth-investigation-3m` and channel route `designer-channel-mystery-lore` are visible, Japanese review labels are present, Source Audit / Project Cockpit / Artifacts are demoted into Evidence Vault style tabs, Light / Dark / Auto controls are present, hardcoded light surfaces are reduced, and Designer Dashboard / Draft Review Pack / Stabilization readbacks remain preserved.
- Draft-to-Video Planning Bridge readback passes for `fff-draft-to-video-planning-bridge-001`: `public/review/index.html?mode=bridge` is reachable from the Review Home and Review Brief, selected candidate `designer-content-moth-investigation-3m` and channel route `designer-channel-mystery-lore` are preserved, Operator Track / Evidence Vault / Not Active are visible, narration outline count is 5, subtitle cue count is 5, visual cue count is 5, rights risk count is 5, held truth count is 4, reviewer decision count is 4, and provider/API, AI video, render, upload, final canon, and rights-clearance boundaries remain closed.
- Preserved Draft Review Pack manifest validation passes for `fff-one-story-draft-review-pack-001`.
- One-story Draft Review Pack readback passes with provisional_default selection `designer-content-moth-investigation-3m`, 3 source dashboard content candidates, 3 channel strategy proposals, 5 draft beats, non-final sample opening present, 4 visual cues, 4 subtitle/on-screen text cues, 3 unresolved human-owned questions, 4 risk cards, local-only=true, external_call=false, provider_configured=false, credentials_touched=false, public_upload=false, ai_video_generation=false, and final_canon_decision=false.
- Designer Dashboard readback passes with 3 content candidate cards, 3 channel strategy proposals, 5 draft spine beats, 4 unresolved risks, 3 human-owned decisions held, local-only=true, external_call=false, provider_configured=false, credentials_touched=false, public_upload=false, ai_video_generation=false, and final_canon_decision=false.
- `fff-contradictory-claim-guard-001` remains preserved as an auxiliary guard.
- The manifest validation command was rerun after `fff-downstream-adoption-gate-scope-lock-001`, closing the prior missing full-regeneration readback; dedicated translated memo and very broad source-span shape audit smokes now run from `tools/fff-state.mjs`.
- Contradictory claim guard parses 9 validator fixtures, keeps 2 conflicting claims in held review, preserves 1 reciprocal conflict pair and source refs, reports 0 adopted/provisional conflicting claims, and reports 0 direct accepted claim-routed elements.
- Multilingual fixture coverage passes with 5 adapter fixture outputs, 60 matrix elements, 12 selected multilingual fixture elements, 4 non-ASCII source-span elements, 0 source-span mismatches, 0 missing source refs, 0 unsafe visual routes, 0 non-held review defaults, and 0 human-owned adopt suggestions.
- Translated memo fixture audit passes as historical audit-only context: existing multilingual coverage is preserved, and the audit identified translated memo text as policy-dependent before the policy and minimum fixture slices. It added no translated fixture, translation API, provider behavior, downstream adoption, or canon promotion.
- Translation provenance/source-span readback passes as readback-only context: 3 selected multilingual source-span to derived-claim relations and 1 inline-gloss boundary row are recorded, all 4 source spans match the raw memo and source-pack rows, all 3 derived claims remain held and source-backed, that readback itself added no translated fixture, and no provider/API call, credential, downstream adoption, or canon promotion is added.
- Translation policy source-of-truth boundary passes as boundary-only context: original multilingual author memo text is the source-of-truth language surface, original sourceSpan locators own evidence, future translated spans must be derivative/provenance-bound, inline gloss cannot create an unowned claim, all 3 derived claims remain held, and the policy itself adds no translated fixture, provider/API call, credential, downstream adoption, or canon promotion.
- Minimal translated memo fixture passes as fixture context: 2 translated rows preserve original multilingual sourceSpan locators, 2 original spans match, 0 original span mismatches, 0 translation-to-claim leaks, 1 linked claim remains held, 0 auto-promotions, 0 inline gloss claim leaks, and no provider/API call, credential, downstream adoption, or canon promotion is added.
- Held claim adoption preflight passes as pre-adoption context: 1 held linked claim from the translated fixture is source-backed and eligible for preflight-only downstream candidacy, while 0 claims are actually adopted, 0 claims are canonized, translation/gloss leak count remains 0, and provider/API/credential/downstream adoption boundaries remain closed.
- Downstream adoption semantics design passes as design-only context: 1 preflight candidate receives explicit status semantics, `human_accepted_downstream_adoption` is defined but unreachable now, 10 rollback conditions are documented, 4 mutation targets are blocked, and Profile / Claim / Timeline / Story Seed mutations remain 0.
- Adoption candidate ledger dry-run passes as non-mutating context: 1 source-backed held candidate is recorded as `adoption_candidate_dry_run`, with source span, held claim, prior status, rollback/rejection vocabulary, future-only downstream targets, 0 adopted claims, 0 canonized claims, 0 Profile / Claim / Timeline / Story Seed mutations, and no provider/API call or credential.
- Sandbox adoption mutation one-claim passes as fixture-only context: 1 authorized sandbox row records `multi-claim-moth-key-label` moving to `sandbox_adopted_fixture`, rollback token is present, production adopted claims remain 0, canonized claims remain 0, Profile / Claim / Timeline / Story Seed production mutations remain 0, and provider/API/credential/publishing/production generation remain closed.
- Sandbox adoption rollback rehearsal passes as fixture-only rollback context: 1 sandbox-adopted row for `multi-claim-moth-key-label` is inspected, the expected rollback token is verified, 1 rehearsal row records `sandbox_adopted_fixture -> adoption_candidate_dry_run`, production rollback performed remains false, production adopted claims remain 0, canonized claims remain 0, Profile / Claim / Timeline / Story Seed production mutations remain 0, and provider/API/credential/publishing/production generation remain closed.
- Production adoption authorization packet passes as packet-only context: 1 rollback-rehearsed candidate is presented for future freeform approval, 4 target classes are proposed, Claim Ledger is recommended first, user authorization remains required, production mutations performed remain 0, canonized claims remain 0, and provider/API/credential/publishing/production generation remain closed.
- Production Claim Ledger adoption one-claim passes as the authorized narrow production adoption context: 1 Claim Ledger row records `multi-claim-moth-key-label` moving from `adoption_candidate_dry_run` to `production_claim_ledger_adopted`, rollback descriptor is present, Profile / Timeline / Story Seed mutation counts remain 0, canonized claims remain 0, and provider/API/credential/publishing/production generation remain closed.
- Production Claim Ledger rollback rehearsal passes as readback-only context: 1 existing production Claim Ledger row is inspected, the rollback descriptor is verified, 1 non-destructive rehearsal row is recorded, actual rollback operations remain 0, the Claim Ledger row remains retained, Profile / Timeline / Story Seed mutation counts remain 0, canonized claims remain 0, and provider/API/credential/publishing/production generation remain closed.
- Downstream target authorization packet passes as packet-only context: the retained production Claim Ledger row for `multi-claim-moth-key-label` is used to propose Profile, Timeline, Story Seed, and Canon decision target classes; Profile is the only recommended next target, user authorization remains required, downstream mutations performed remain 0, Profile / Timeline / Story Seed mutation counts remain 0, canonized claims remain 0, and provider/API/credential/publishing/production generation remain closed.
- Profile adoption mutation one-claim passes as the authorized Profile-only context: 1 non-canon Profile annotation row links `multi-claim-moth-key-label` to `multi-profile-brass-moth-key`, records `claim_ledger_adopted -> profile_adopted_noncanon`, keeps Claim Ledger additional adoption count 0, Timeline / Story Seed mutation counts 0, canonized claims 0, and provider/API/credential/publishing/production generation closed.
- Very broad source-span shape audit passes as audit-only context: the 2 current broad rows remain resolved by `fff-broad-span-split-001`, 0 broad fixture files are added, and the source-pack / downstream / provider no-call chain remains clean.
- Downstream adoption gate parses 60 source-pack rows and reports 55 downstream Profile / Claim / Timeline review candidates, all 55 source-tracked, with 0 malformed/missing span candidates, 0 unsafe routing candidates, 28 human-owned candidates held, 0 non-held human-owned candidates, and 0 adopted Profile / Claim / Timeline candidates.
- Malformed/missing source-span guard remains closed with 3 invalid elements rejected, 0 accepted routed candidates, and 9 validator fixtures in the smoke matrix.
- Provider envelope readiness no-call gate passes with 4 carried Extraction Contract elements, 4 source-tracked elements, 2 human-owned elements held, 0 visual direct Claim routes, 0 adopted/provisional elements or claims, no provider configured, no endpoint, no external call attempted, and no credentials touched.
- Routing policy regression remains passing across 6 adapter payloads and 72 adapter elements.
- Source-span review pack remains passing with 5 fixture outputs, 60 elements, 0 source-span mismatches, 0 missing source refs, 0 unsafe visual routing cases, 0 non-held review defaults, and 0 human-owned decision adopt suggestions.
- Model/API boundary spec remains preserved as a spec-only, no-external-call boundary for future provider work.
- Toma fate, brass moth truth, Council motive, and moth-key function remain unresolved and human-owned.

## Boundaries

Do not treat local review state as final canon. Do not add model/API behavior, provider credentials, publishing, upload credentials, AI video generation, production sync, database persistence, Timeline / Story Seed adoption behavior, additional Claim Ledger adoption, Canon decision mutation, actual production rollback, contradictory claim truth decisions, or final decisions for Toma, the brass moth, or the Council unless explicitly requested. The current production adoption readbacks are the single Claim Ledger row for `multi-claim-moth-key-label` and one Profile-only non-canon annotation for that same claim. The only current rollback work is a non-destructive Claim Ledger rehearsal plus a Profile annotation rollback descriptor; Timeline, Story Seed, Canon decision, provider/API, credential, publishing, production generation, actual rollback, and additional-claim work remain unauthorized.

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
uvx --with mkdocs-material mkdocs serve -a 127.0.0.1:8000
```

If port `8000` is already in use, use a neighboring local port such as `8001`.

First next move: open `public/review/index.html?mode=revision`, inspect the deterministic sample or import a matching local request, and export decision/patch JSON if useful. The patch remains unapplied; source timing, truth, asset, rights, and canon state remain unchanged. `public/review/index.html?mode=handoff`, `?mode=bridge`, `?mode=brief`, and `?mode=layout-lab` remain preserved context. Patch application, final narration performance, subtitle typography, asset selection, rights clearance, provider work, generation, render, upload, and database persistence remain blocked until separately authorized.

## Handoff Path

For another terminal, start with `docs/review/next-terminal-handoff.md` after pulling latest remote state. `docs/review/current-status.md` is the authoritative current packet for the active artifact and validation commands.

The current implementation starts from synced `4889970f045eb7c557057a367e502f8b4b2036fb Preserve editorial package hashes` on 2026-07-12 JST. It preserves `.serena/project.yml` as unstaged local transport residue outside product scope and advances from immutable `fff-bridge-editorial-handoff-pack-001` to `fff-editorial-revision-roundtrip-001`. After pulling, `git log -1 --oneline --decorate` shows the exact published head; run the manifest's read-only validation command before opening the Revision route.
