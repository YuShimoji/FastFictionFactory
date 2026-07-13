# Idea Ledger

## Residual Work

### Content Production Blueprint

- Purpose: Convert the provisional editorial derivative into a quantitative, operator-readable planning contract before any asset, image, audio, video, render, or publication work.
- Effect: Adds `fff-content-production-blueprint-001`, `public/review/index.html?mode=blueprint`, an eight-file package under `artifacts/production-blueprint/`, exact beat/shot/subtitle metrics, controlled production vocabularies, LOCKED / BOUNDED / FREE constraints, a provisional 1920x1080 / 30fps profile, a machine-readable acceptance matrix, and stable secondary utility drawers.
- Requirements: Preserve every Handoff, Revision, and Derivative package byte; keep the three wording edits provisional; keep six-beat order, exact 180-second timing, truth, rights, assets, provider, credentials, generation, render, upload, publication, database, and canon boundaries closed; normal validation must remain read-only.
- State: Implemented in the active bounded slice. The Blueprint is a local planning specification and does not authorize production, asset selection, rights clearance, or canon promotion.
- Owner: Product implementer for deterministic package and UI maintenance; human reviewer for the H1 production-readiness judgment; a separate creator only after later explicit authorization.
- Next move: Open `public/review/index.html?mode=blueprint` and provide freeform review of scope, shot grammar, visual constraints, and Definition of Done. Asset briefs, shot boards, generation, and H1 implementation remain blocked until that review and separate authorization.

### Editorial Derivative Preview

- Purpose: Show the accepted safe-only revision patch as a complete, portable editorial package without mutating its Handoff source.
- Effect: Adds `fff-editorial-derivative-preview-001`, `public/review/index.html?mode=derivative`, an eight-file package under `artifacts/editorial-derivative/`, exactly three derived wording deltas, cross-consistent Markdown/CSV/JSON outputs, source/patch/derived provenance, integrity metadata, local patch import, per-file downloads, and discard-based rollback.
- Requirements: Preserve every byte under `artifacts/editorial-handoff/` and every existing file under `artifacts/editorial-revision/`; keep six beats, 180 seconds, 6 narration segments, 20 subtitle cues, 19 shot cues, 3 thumbnail directions, order, timing, truth, canon, rights, and asset state unchanged; keep normal validation read-only and all external/production gates closed.
- State: Implemented as `derived_revision_preview`; the source patch remains `not_applied`, exactly three safe changes are `applied_to_derived_copy`, the output is not canonical or human-accepted, and rollback is `discard_derived_package`.
- Owner: Product implementer for deterministic generation, UI, integrity, and readback; human editor for later real request content and derived-package acceptance; human author for any canonical, timing, order, truth, ending, or canon decision.
- Next move: Open `mode=derivative` for local review. A real Human Revision Pilot and any canonical application require separate input and authorization; ZIP bundling remains optional while individual files and the manifest are usable.

### Editorial Revision Roundtrip

- Purpose: Let a writer or editor return structured changes without reconstructing the Handoff package or silently mutating its source.
- Effect: Adds `fff-editorial-revision-roundtrip-001`, `public/review/index.html?mode=revision`, a six-file package under `artifacts/editorial-revision/`, local request import, fail-closed guard classification, one before/after diff, accept/hold/reject/return decisions, and safe-only decision/patch downloads.
- Requirements: Preserve source Handoff bytes/hashes, six-beat order, 180-second timing, provisional truth, unselected assets, rights state, themes, keyboard behavior, and all provider/API/credential/generation/render/upload/database/canon gates. Apply no patch in this slice.
- State: Implemented for guarded local readback. The deterministic example is 3 safe / 1 human / 2 blocked, decisions are 3 accept / 1 hold / 2 reject, and the three-change patch remains `not_applied`.
- Owner: Product implementer for schema, UI, validation, and portability; human editor for request/decision content; human author for timing, order, truth, ending, and canon.
- Next move: Treat this as the preserved request/decision/patch source for `fff-editorial-derivative-preview-001`. Real request content, canonical patch application, timing/order approval, story truth, assets, rights, provider, production, and canon require separate authority.

### Bridge Editorial Handoff Pack

- Purpose: Turn the accepted six-beat Bridge implementation checkpoint into one portable local package that a writer, subtitle editor, or video editor can use without reconstructing the plan from review shelves.
- Effect: Adds `fff-bridge-editorial-handoff-pack-001`, `public/review/index.html?mode=handoff`, one compact Bridge action, `artifacts/editorial-handoff/` with six delivery files, 6 complete provisional narration segments, 20 subtitle cues, 19 generic shot cues, 3 thumbnail directions, truth/rights guards, integrity metadata, `docs/review/bridge-editorial-handoff-pack.md`, and `artifacts/bridge-editorial-handoff-pack-result.json`.
- Requirements: Preserve the exact six-beat order and 180-second allocation, keep all prose `provisional_editorial_draft`, keep every asset `unselected`, keep Toma fate, brass moth truth/function, Council motive, and ending truth `unresolved_human_owned`, keep manifest validation read-only, and keep provider/API/credential/generation/render/upload/database/rights/final-canon gates closed.
- State: Implemented for local manual delivery and readback. The package is portable and hash-verifiable but is not final narration, canon, rights clearance, production approval, or public delivery.
- Owner: Product implementer for package integrity and local UI; human writer/subtitle editor/video editor for later manual refinement; human author for story truth and canon.
- Next move: Use `public/review/index.html?mode=handoff` and `artifacts/editorial-handoff/` for manual editorial work. Any timing change, asset selection, rights claim, final narration, or canon decision requires an explicit later slice.

### Bridge Storyboard Flow

- Purpose: Turn the accepted Workbench route choice into a story-shaped Bridge readback that is faster to scan than the preserved long decision/refinement page.
- Effect: Adds `fff-bridge-storyboard-flow-001` at `public/review/index.html?mode=bridge`, exactly six Japanese-first beats, a compact rail, one active canvas, Previous / Next and keyboard navigation, one return to Brief, collapsed supporting Bridge evidence, `docs/review/bridge-storyboard-flow.md`, `artifacts/bridge-storyboard-flow-result.json`, and local screenshot evidence when capture succeeds.
- Requirements: Preserve `fff-review-workbench-component-contract-001`, the selected candidate/channel, draft/bridge/guard source readbacks, dark mode, keyboard focus, all held truths, and all provider/API/credential/video/render/upload/database/rights/final-canon boundaries.
- State: Implemented and preserved as the source baseline for `fff-bridge-editorial-handoff-pack-001`; `OPERATOR_FIRST` is closed from the accepted human observation. The Flow is planning-only and does not approve story truth, timing, assets, rights, or production.
- Owner: Product implementer for the local Flow and validation; human reviewer for accept/revise/return of beat order and approximate timing.
- Next move: Use the focused Handoff route for manual editorial transfer. Reopen the source Flow only when a later explicit decision changes order or timing.

### Review Workbench Component Contract

- Purpose: Fix the first-screen component architecture failure where the applied shell still felt card-like and each component repeated a version of the whole system.
- Effect: Adds `fff-review-workbench-component-contract-001`, a role-contracted Workbench Canvas for `public/review/index.html?mode=brief`, `componentRoleContracts`, single framing source marker, compact route nav, operator utility drawer, Context Dock limits, duplication budget smoke, `docs/review/review-workbench-component-contract.md`, `artifacts/review-workbench-component-contract-result.json`, and `artifacts/review-screens/brief-component-contract-workbench.png`.
- Requirements: Preserve `fff-apply-decision-shell-guard-diet-001`, `layout-lab`, `bridge`, `designer`, `draft`, `source`, `project`, `artifacts`, dark mode, candidate `designer-content-moth-investigation-3m`, channel route `designer-channel-mystery-lore`, existing readbacks, and all provider/API/video/render/upload/final-canon/database/rights boundaries.
- State: Implemented and preserved in `fff-review-workbench-component-contract-001`; the supplied human observation accepts the top Workbench and closes `OPERATOR_FIRST` while noting lower-page density debt.
- Owner: Product implementer for local UI/readback; human reviewer for judging whether the first screen now feels like one coordinated Workbench.
- Next move: Keep the Workbench as the preserved Brief prelude; use the active Bridge Storyboard Flow for the next product readback.

### Operator-first Workbench Visual Review

- Purpose: Convert the Supervisor `pass / OPERATOR_FIRST` judgment into a durable next-step instruction instead of spawning another micro-adjustment Worker.
- Effect: Preserved `fff-review-workbench-component-contract-001` until the human observation selected Bridge Storyboard Flow; `fff-bridge-storyboard-flow-001` is now active.
- Requirements: Use `.\scripts\operator\open_review.ps1`, inspect `public/review/index.html?mode=brief`, compare against `artifacts/review-screens/brief-component-contract-workbench.png`, and keep provider/API/video/render/upload/final-canon/database/rights boundaries closed.
- State: Completed. The human observation accepts the top Workbench, records that the lower page remains long and dense, and selects `BRIDGE_STORYBOARD_FLOW` for forward product movement.
- Owner: Human reviewer supplied the deciding observation; product implementation moved to the selected lane.
- Next move: Preserve the observation as the closed gate source; do not reopen it unless the Workbench itself materially changes.

### Apply Decision Shell Guard Diet

- Purpose: Make the default `brief` route use the accepted split-pane Decision Shell instead of a card-wall-first review surface.
- Effect: Applies the Shell to `public/review/index.html?mode=brief`, renders the current route decision from `decisionFlowModel`, caps dock rows through Dock Governor, moves long gate evidence into the Guard drawer, and records `docs/review/apply-decision-shell-guard-diet.md` plus `artifacts/apply-decision-shell-guard-diet-result.json`.
- Requirements: Preserve `layout-lab`, `bridge`, Guided Flow, Latest Overview, Home Cockpit, Evidence Vault, selected candidate `designer-content-moth-investigation-3m`, channel route `designer-channel-mystery-lore`, dark mode, and all provider/API/video/render/upload/final-canon/database/rights boundaries.
- State: Implemented in `fff-apply-decision-shell-guard-diet-001`.
- Owner: Product implementer for the preserved source-shell UI/readback; human reviewer only if a later change regresses it.
- Next move: Treat this as preserved source-shell and regression evidence. `OPERATOR_FIRST` is closed; use the active Bridge Storyboard Flow while keeping provider/API, credential, upload, render, video, database, rights, and canon work closed until explicitly authorized.

### Layout Lab Visual Audit

- Purpose: Give the reviewer browser-based visual evidence for the Layout Research Lab before applying the split-pane Decision Shell to the default `brief` route.
- Effect: Adds four local screenshots plus a contact sheet for `layout-lab`, the recommended Decision Shell alternative, preserved `brief`, and preserved `bridge`; adds `docs/review/layout-lab-visual-audit.md` and `artifacts/layout-lab-visual-audit-result.json`.
- Requirements: Preserve `fff-layout-research-decision-shell-001`, `brief`, `bridge`, dark mode, Evidence Vault optionality, and all provider/API/video/render/upload/final-canon/database/rights boundaries.
- State: Implemented in `fff-layout-lab-visual-audit-001`.
- Owner: Product implementer for visual audit packaging; human reviewer for comparing the source evidence if the applied Shell needs another layout pass.
- Next move: Keep `artifacts/layout-lab-visual-audit-contact-sheet.png` and `public/review/index.html?mode=layout-lab` as source evidence; do not re-open layout research unless the applied brief Shell fails review.

### Repo Sync / Next Terminal Handoff

- Purpose: Keep the latest Content Production Blueprint context durable in repository files so another terminal can resume from `master` without chat history.
- Effect: Updates the handoff/current-status/project-context docs with the current active artifact, protected Handoff / Revision / Derivative chain, baseline commit, clean remote parity, first review route, preserved routes, validation readback, and local boundary gates.
- Requirements: Do not change product UI behavior; preserve the Serena-generated configuration update only as restart infrastructure; keep provider/API/video/render/upload/final-canon/database/rights boundaries closed.
- State: The handoff refresh starts from synced published product commit `4b9b22e Add content production blueprint`, with `master...origin/master` at `0 0` before edits. The Blueprint manifest validation chain remains read-only, and the local `.serena/project.yml` schema refresh is included so another checkout receives the same project configuration.
- Owner: Agent for repo-local context durability; next worker for pulling latest remote and continuing from the handoff packet.
- Next move: Pull latest `master`, confirm `HEAD...@{u}` is `0 0`, run the read-only manifest validation, read `docs/review/next-terminal-handoff.md`, then open `public/review/index.html?mode=blueprint` and `artifacts/production-blueprint/README_BLUEPRINT.md` for local production-readiness review.

### Layout Research Decision Shell

- Purpose: Resolve the remaining first-screen limitation where the low-text console is clearer but still feels constrained by card-format layout, equal-weight information, and hardcoded choices.
- Effect: Adds `public/review/index.html?mode=layout-lab` with low-fidelity Card-first, Briefing Inbox, Split-pane Decision Shell, and Storyboard Flow wireframes; adds a five-family heuristic score matrix; recommends the split-pane Decision Shell; and renders a local `decisionFlowModel` choice slot.
- Requirements: Preserve `public/review/index.html?mode=brief`, `public/review/index.html?mode=bridge`, `fff-low-text-decision-console-001`, `fff-guided-review-flow-workspace-001`, `fff-bridge-refinement-overview-ribbon-001`, `fff-home-cockpit-metric-linking-001`, selected candidate `designer-content-moth-investigation-3m`, channel route `designer-channel-mystery-lore`, Evidence Vault optionality, dark mode, and all provider/API/video/render/upload/final-canon/database/rights boundaries.
- State: Implemented in `fff-layout-research-decision-shell-001`.
- Owner: Product implementer for UI/readback; human reviewer only if the applied Shell needs another layout comparison.
- Next move: Keep `public/review/index.html?mode=layout-lab` as source evidence; use the applied brief Shell for current route decisions before any script, subtitle, thumbnail, provider/API, video, rights, upload, database, or final-canon work.

### Low-text Decision Console

- Purpose: Fix the first-screen review failure where the guided flow still read like mass notes or lecture notes.
- Effect: Adds one route question, five short choices, one `Bridgeで確認` action, context chips, a six-step rail, closed detail/notes shelves, and a matching Bridge Decision Console to `public/review/index.html`.
- Requirements: Preserve `fff-guided-review-flow-workspace-001`, `fff-bridge-refinement-overview-ribbon-001`, `fff-home-cockpit-metric-linking-001`, candidate `designer-content-moth-investigation-3m`, channel route `designer-channel-mystery-lore`, Evidence Vault optionality, dark mode, stable IDs, and all provider/API/video/render/upload/final-canon/database/rights boundaries.
- State: Implemented in `fff-low-text-decision-console-001`.
- Owner: Product implementer for UI/readback; human reviewer for whether the route decision is now readable enough to proceed.
- Next move: Review `public/review/index.html?mode=brief`, answer the route question, then open `public/review/index.html?mode=bridge` and name the weakest area: narration, subtitle rhythm, screen order, thumbnail direction, or held-truth policy.

### Guided Review Flow Workspace

- Purpose: Make the active `brief` route guide the user through one review path before showing comprehensive Home Cockpit shelves.
- Effect: Adds Guided Review Flow, a six-step Decision Queue, one primary Bridge action, Pinned Tray, Operations Notice, Important Folders, and an Inspiration Workspace to `public/review/index.html?mode=brief`; adds a matching Bridge Guided Flow to `public/review/index.html?mode=bridge`; demotes legacy card grids without deleting their evidence markers.
- Requirements: Preserve `fff-bridge-refinement-overview-ribbon-001`, `fff-home-cockpit-metric-linking-001`, candidate `designer-content-moth-investigation-3m`, channel route `designer-channel-mystery-lore`, Evidence Vault optionality, dark mode, and all provider/API/video/render/upload/final-canon/database/rights boundaries.
- State: Implemented in `fff-guided-review-flow-workspace-001`.
- Owner: Product implementer for UI/readback; human reviewer for whether the guided order makes the next decision obvious.
- Next move: Review `public/review/index.html?mode=brief`, use the one Bridge action, then review `public/review/index.html?mode=bridge` against route confirmation, narration direction, subtitle rhythm, visual order, thumbnail direction, and held-truth policy.

### Bridge Refinement Overview Ribbon

- Purpose: Give the reviewer a latest overview before comprehensive lists, then make the Draft-to-Video Bridge detailed enough to judge without starting production.
- Effect: Adds a 5-item Latest Overview Report to `public/review/index.html?mode=brief`, folds the older Review Brief into a preserved detail shelf, adds Bridge back-to-overview reference, and adds non-final narration, subtitle rhythm, visual ordering, thumbnail, held-truth, and rights/asset cues to `public/review/index.html?mode=bridge`.
- Requirements: Preserve `fff-home-cockpit-metric-linking-001`, `fff-draft-to-video-planning-bridge-001`, candidate `designer-content-moth-investigation-3m`, channel route `designer-channel-mystery-lore`, Evidence Vault optionality, dark mode, and all provider/API/video/render/upload/final-canon/rights boundaries.
- State: Implemented in `fff-bridge-refinement-overview-ribbon-001`.
- Owner: Product implementer for UI/readback; human reviewer for whether the latest overview and Bridge refinement are enough to accept, revise, or reject the production hypothesis.
- Next move: Review `public/review/index.html?mode=brief`, then `public/review/index.html?mode=bridge`; if accepted, move to a narrow script/subtitle/shot/thumbnail refinement slice without opening provider/API or generation.

### Home Cockpit Metric Linking

- Purpose: Make the default Review Brief behave as a Home Cockpit so the reviewer can see the current route, action meters, optional shelves, and locked lanes before opening Bridge.
- Effect: Sets `public/review/index.html?mode=brief` as the no-query Home Cockpit, keeps `public/review/index.html?mode=home` as an alias, adds Operator Track / Workbench / Evidence Vault / Locked Lanes, and links nine readiness meters to concrete next actions.
- Requirements: Preserve Review Home Map, Draft-to-Video Bridge, Review Brief Dark Mode UX, Designer Dashboard, One-story Draft Review Pack, Stabilization, and Contradictory Claim Guard readbacks; keep provider/API calls, credentials, publishing, AI video generation, production render, final canon, and rights-clearance claims closed.
- State: Implemented in `fff-home-cockpit-metric-linking-001`.
- Owner: Product implementer for UI/readback; human reviewer for whether the cockpit makes the Bridge package judgeable without opening evidence shelves.
- Next move: Use `public/review/index.html?mode=brief` first, then `public/review/index.html?mode=bridge`; revise only the meter/action wording if the reviewer still cannot tell what to read, skip, or audit.

### Review Home Map Meters

- Purpose: Make the first review screen explain the folded shelves instead of hiding them behind tabs.
- Effect: Adds `public/review/index.html?mode=home` with a three-step read path, grouped Primary / Story / Evidence navigation, seven shelf cards, seven status meters, open triggers, do-not-open conditions, and one-click Bridge access.
- Requirements: Preserve Draft-to-Video Bridge, Review Brief, Designer Dashboard, One-story Draft Review Pack, Stabilization, and Contradictory Claim Guard readbacks; keep provider/API calls, credentials, publishing, AI video generation, production render, final canon, and rights-clearance claims closed.
- State: Implemented in `fff-review-home-map-meters-001`; preserved under the Home Cockpit surface.
- Owner: Product implementer for UI/readback; human reviewer for whether the map fixes the closet-like organization problem.
- Next move: Treat as historical shelf-map readback unless `fff-home-cockpit-metric-linking-001` needs a regression comparison.

### Draft-to-Video Planning Bridge

- Purpose: Let the reviewer inspect the selected 3-minute mystery-lore route as a production hypothesis before any video generation, provider/API work, upload, rights claim, or final canon decision.
- Effect: Adds `public/review/index.html?mode=bridge` with route summary, non-final narration outline, subtitle/on-screen text cues, shot/visual cues, thumbnail brief, sound/music/mood cue, rights/asset risks, held truths, production non-goals, and reviewer decisions.
- Requirements: Preserve selected candidate `designer-content-moth-investigation-3m`, selected channel `designer-channel-mystery-lore`, Review Brief route contract, Designer Dashboard, One-story Draft Review Pack, stabilization readback, and contradictory claim guard; keep provider/API calls, credentials, publishing, AI video generation, production render, final canon, and rights-clearance claims closed.
- State: Implemented in `fff-draft-to-video-planning-bridge-001`.
- Owner: Product implementer for UI/readback; human reviewer for route, narration shape, visual direction, rights posture, and held-truth decisions.
- Next move: Review `public/review/index.html?mode=bridge` and accept, revise, or reject the production hypothesis before any narrower package refinement or production work.

### Review Brief Dark Mode UX

- Purpose: Make the local review entry shorter, more discoverable, Japanese-first, and usable in dark mode before and during bridge review.
- Effect: Adds a default Review Brief mode, visible selected candidate/channel route, immediate reviewer decisions, advanced demotion for source/project/artifact panels, and Light / Dark / Auto theme compatibility.
- Requirements: Preserve Designer Dashboard, One-story Draft Review Pack, Draft Review Pack Stabilization, and the Draft-to-Video Planning Bridge readback; keep work local-only; do not add provider/API calls, credentials, publishing, AI video generation, production render, rights-clearance claims, or final canon decisions.
- State: Implemented in `fff-review-brief-dark-mode-ux-001`.
- Owner: Product implementer for UI/readback; human reviewer for candidate, channel, and held-truth decisions.
- Next move: Keep `public/review/index.html?mode=brief` as the Home Cockpit route; `public/review/index.html?mode=home` is now a compatibility alias.

### Draft Review Pack Stabilization

- Purpose: Make the Designer Dashboard and One-story Draft Review Pack durable, reviewable, and reproducible as source surfaces for later draft-to-video planning.
- Effect: Adds a static access/readback artifact that verifies both mode routes, result artifacts, review docs, renderer markers, and contradictory-claim guard preservation.
- Requirements: Keep the work local-only; do not add provider/API calls, credentials, publishing, AI video generation, production render, draft-to-video bridge behavior, or final canon decisions; keep `.serena/project.yml` out of product staging.
- State: Implemented in `fff-draft-review-pack-stabilization-001`.
- Owner: Product implementer for evidence/git durability; human reviewer for draft route and held-truth decisions.
- Next move: Use `public/review/index.html?mode=draft` for freeform review, with `public/review/index.html?mode=designer` preserved as source context.

### One-story Draft Review Pack

- Purpose: Let a reviewer inspect one provisional story/video candidate end-to-end before any provider, video, publishing, or final canon work.
- Effect: Converts the Designer Dashboard into a concrete draft review packet with beats, non-final sample narration, visual cues, text cues, unresolved questions, risk cards, and reviewer decisions.
- Requirements: Keep the surface local-only; keep selection marked `provisional_default`; preserve human-owned unknowns; avoid provider/API calls, credentials, publishing, AI video generation, production render, and final canon claims.
- State: Implemented in `fff-one-story-draft-review-pack-001`.
- Owner: Product implementer for UI/readback; human reviewer for candidate, channel, and held-truth decisions.
- Next move: Keep `public/review/index.html?mode=draft` and `docs/review/one-story-draft-review-pack.md` as the source draft pack for the active bridge; reopen only if the selected route changes.

### Designer Candidate Dashboard

- Purpose: Let a reviewer inspect one story end-to-end as content candidates, draft spine, channel strategy proposals, and review risks.
- Effect: Reduces designer review friction before a one-story draft pack or production-planning slice.
- Requirements: Keep the surface local-only; preserve unknowns and human-owned decisions; avoid provider/API calls, credentials, publishing, AI video generation, production render, and final canon claims.
- State: Implemented in `fff-designer-candidate-dashboard-001`.
- Owner: Product implementer for UI/readback; human reviewer for story, channel, and canon decisions.
- Next move: Keep `public/review/index.html?mode=designer` and `docs/review/designer-candidate-dashboard.md` as the preserved source dashboard for the active Draft Review Pack; reopen only if the provisional candidate or channel route changes.

### Timeline View

- Purpose: Separate story order, calendar time, historical references, and production order.
- Effect: Makes sequence claims reviewable before outline or video packaging decisions.
- Requirements: Keep it local-only, use existing review states, and avoid database or publishing work.
- State: Implemented in `fff-timeline-view-001`.
- Owner: Product implementer, with human author review for canon-sensitive sequence decisions.
- Next move: Keep Timeline entries linked into Profile/Ghost and future extraction-contract checks.

### Profile Page And Ghost Node Flow

- Purpose: Make characters, objects, and uncertain entities easier to inspect across claims and timelines.
- Effect: Improves review ergonomics for unresolved identity, fate, and source relationships.
- Requirements: Must not finalize Toma fate, brass moth truth, or Council motive.
- State: Implemented in `fff-profile-ghost-flow-001`.
- Owner: Product implementer for UI; human author for final story authority.
- Next move: Use profile/ghost records as source-tracked extraction contract fixtures before adding any model/API behavior.

### Real Extraction Engine

- Purpose: Replace deterministic mock extraction with an actual extraction workflow.
- Effect: Turns raw memo intake into generated candidates instead of static seed data.
- Requirements: Needs source tracking, schema validation, review controls, and clear generated-vs-human authority boundaries.
- State: Extraction Contract implemented in `fff-extraction-contract-001`; validator hardening implemented in `fff-extraction-validator-hardening-001`; deterministic local adapter spike implemented in `fff-local-extraction-adapter-spike-001`; deterministic adapter expansion implemented in `fff-local-extraction-adapter-expansion-001`; source-span routing review pack implemented in `fff-source-span-routing-review-pack-001`; source-span quality audit implemented in `fff-source-span-quality-audit-001`; ambiguous routing resolution implemented in `fff-ambiguous-routing-resolution-001`; routing policy regression hardening implemented in `fff-routing-policy-regression-hardening-001`; broad source-span split implemented in `fff-broad-span-split-001`; weak-span repair implemented in `fff-weak-span-repair-001`; sparse bullet fixture probe implemented in `fff-missing-fixture-class-probe-001`; multilingual memo fixture coverage implemented in `fff-remaining-fixture-coverage-one-class-001`; translated memo fixture audit implemented in `fff-translated-memo-fixture-audit-001`; translation provenance/source-span readback implemented in `fff-translation-provenance-source-span-readback-001`; translation policy source-of-truth boundary implemented in `fff-translation-policy-source-of-truth-boundary-001`; minimal translated memo fixture implemented in `fff-translated-memo-fixture-minimum-001`; held claim adoption preflight implemented in `fff-held-claim-adoption-preflight-001`; downstream adoption semantics design implemented in `fff-downstream-adoption-semantics-design-001`; adoption candidate ledger dry-run implemented in `fff-adoption-candidate-ledger-dry-run-001`; sandbox adoption mutation one-claim implemented in `fff-sandbox-adoption-mutation-one-claim-001`; sandbox adoption rollback rehearsal implemented in `fff-sandbox-adoption-rollback-rehearsal-001`; production adoption authorization packet implemented in `fff-production-adoption-authorization-packet-001`; production Claim Ledger adoption one-claim implemented in `fff-production-claim-ledger-adoption-one-claim-001`; production Claim Ledger rollback rehearsal implemented in `fff-production-claim-ledger-rollback-rehearsal-001`; downstream target authorization packet implemented in `fff-downstream-target-authorization-packet-001`; Profile adoption mutation one-claim implemented in `fff-profile-adoption-mutation-one-claim-001`; very broad source-span shape audit implemented in `fff-very-broad-source-span-shape-audit-001`; malformed/missing source-span guard implemented in `fff-malformed-missing-span-guard-001`; downstream source-span adoption gate implemented in `fff-downstream-source-span-adoption-gate-001`; downstream adoption gate scope lock implemented in `fff-downstream-adoption-gate-scope-lock-001`; contradictory claim guard implemented in `fff-contradictory-claim-guard-001`; provider-envelope readiness no-call implemented in `fff-provider-envelope-readiness-no-call-001`; Review Hub IA mode split implemented in `fff-review-hub-ia-mode-split-001`; Review Procedure Lock implemented in `fff-review-procedure-lock-001`; Review Memory Dedup implemented in `fff-review-memory-dedup-001`; model/API extraction adapter not started.
- Owner: Product/AI implementer.
- Next move: Keep the contradictory claim guard, downstream source-span adoption gate, downstream scope lock, provider-envelope readiness no-call gate, multilingual fixture readback, translated memo audit, translation provenance/source-span readback, translation policy source-of-truth boundary, minimal translated memo fixture, held claim adoption preflight, downstream adoption semantics design, adoption candidate ledger dry-run, sandbox adoption mutation one-claim, sandbox adoption rollback rehearsal, production adoption authorization packet, production Claim Ledger adoption one-claim, production Claim Ledger rollback rehearsal, downstream target authorization packet, Profile adoption mutation one-claim, and very broad source-span shape audit passing before any future provider-backed adapter or further downstream adoption. Move only to Timeline / Story Seed / canon adoption, actual production rollback for `multi-claim-moth-key-label`, or additional claim adoption after separate explicit freeform authorization for target class, mutation behavior, rollback owner, rollback descriptor, and unresolved dependency handling; broader translated memo coverage when it adds meaningful rows beyond the two-row minimum; explicit provider adapter implementation after authorization for provider choice, credentials, endpoint, and transport behavior; or broad-shape fixture work only after adapter/source output changes create a concrete coverage gap. Keep any model/API adapter behind `node .\tools\fff-state.mjs validate-extraction`, the fixture matrix, the adapter expansion smoke guards, `node .\tools\fff-state.mjs smoke-routing-policy`, `node .\tools\fff-state.mjs smoke-malformed-missing-span-guard`, `node .\tools\fff-state.mjs smoke-downstream-source-span-adoption-gate`, `node .\tools\fff-state.mjs smoke-contradictory-claim-guard`, `node .\tools\fff-state.mjs smoke-provider-envelope-readiness-no-call`, `node .\tools\fff-state.mjs smoke-remaining-fixture-coverage-one-class`, `node .\tools\fff-state.mjs smoke-translated-memo-fixture-audit`, `node .\tools\fff-state.mjs smoke-translation-provenance-source-span-readback`, `node .\tools\fff-state.mjs smoke-translation-policy-source-of-truth-boundary`, `node .\tools\fff-state.mjs smoke-translated-memo-fixture-minimum`, `node .\tools\fff-state.mjs smoke-held-claim-adoption-preflight`, `node .\tools\fff-state.mjs smoke-downstream-adoption-semantics-design`, `node .\tools\fff-state.mjs smoke-adoption-candidate-ledger-dry-run`, `node .\tools\fff-state.mjs smoke-sandbox-adoption-mutation-one-claim`, `node .\tools\fff-state.mjs smoke-sandbox-adoption-rollback-rehearsal`, `node .\tools\fff-state.mjs smoke-production-adoption-authorization-packet`, `node .\tools\fff-state.mjs smoke-production-claim-ledger-adoption-one-claim`, `node .\tools\fff-state.mjs smoke-production-claim-ledger-rollback-rehearsal`, `node .\tools\fff-state.mjs smoke-downstream-target-authorization-packet`, `node .\tools\fff-state.mjs smoke-profile-adoption-mutation-one-claim`, `node .\tools\fff-state.mjs smoke-very-broad-source-span-shape-audit`, and explicit user authorization.

### Extraction Validator Hardening

- Purpose: Prevent unsafe extraction payloads from entering review surfaces before adapter work.
- Effect: Catches missing source refs, missing extraction identity fields, invalid element types, unsafe human-owned decision adoption, direct visual-asset-to-claim routing, auto-canon leaks, missing review-safe defaults, missing human authority boundaries, and missing high-risk warnings.
- Requirements: Keep validation zero-dependency, local-first, fixture-backed, and non-canon-producing.
- State: Implemented in `fff-extraction-validator-hardening-001` with fixtures under `artifacts/extraction-negative-fixtures/` and smoke evidence at `artifacts/extraction-validator-smoke-result.json`.
- Owner: Product/AI implementer for validator and adapter shape; human author for final story authority.
- Next move: Keep the validator fixture matrix as a required gate for adapter expansion and any future model/API adapter.

### Freeform Review Intake

- Purpose: Let user review arrive as natural feedback instead of fixed accept/reject phrases.
- Effect: Keeps human review expressive while still allowing the agent to continue reversible scoped work when interpretation confidence is medium or high.
- Requirements: Use Review Cards when review is required, record Review Debt when review is useful but non-blocking, and treat freeform user review as source of truth.
- State: Documented in `docs/review/freeform-review-intake.md` and reflected in `fff-extraction-contract-001`.
- Owner: Agent for parsing and reversible updates; human reviewer for review truth.
- Next move: Exercise the intake rule against extraction contract review feedback before building model/API behavior.

### Durable Project Database

- Purpose: Persist projects beyond local browser state and JSON files.
- Effect: Enables multi-session project continuity without manual import/export.
- Requirements: Needs schema decisions, migration policy, backup/export path, and no silent canon promotion.
- State: Not started.
- Owner: Product implementer.
- Next move: Decide whether the first durable store is file-backed, SQLite, or browser storage expansion.

### Publishing And Video Generation

- Purpose: Eventually package reviewed fiction outputs for YouTube or AI-video workflows.
- Effect: Connects reviewed outlines to production surfaces.
- Requirements: Requires final rights review, credential isolation, production approval gates, and explicit human release decisions.
- State: Review Home Map implemented in `fff-review-home-map-meters-001` and Draft-to-Video Planning Bridge implemented in `fff-draft-to-video-planning-bridge-001`; actual publishing, upload, AI video generation, production render, rights clearance, and final canon remain out of scope for the current MVP.
- Owner: Human product owner plus production implementer.
- Next move: Do not start until review workflow and source/canon gates are accepted.
