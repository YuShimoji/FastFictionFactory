# Current Status Packet

## Active Artifact

- Artifact id: `fff-bridge-storyboard-flow-001`
- Latest implementation baseline: synced `62f7d74 Harden restart validation and handoff`; exact published head is whatever `git log -1 --oneline --decorate` reports after pulling latest `master`
- Review UI: `public/review/index.html`
- Review Brief mode with role-contracted Review Workbench: `public/review/index.html?mode=brief`
- Layout Research Lab mode preserved: `public/review/index.html?mode=layout-lab`
- Review Home compatibility alias: `public/review/index.html?mode=home`
- Active Bridge Storyboard Flow: `public/review/index.html?mode=bridge`
- Draft Review Pack mode: `public/review/index.html?mode=draft`
- Designer Dashboard mode: `public/review/index.html?mode=designer`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `.\scripts\operator\open_review.ps1`
- Repo-local shell launcher: `./scripts/operator/open_review.sh`
- Operator observation: accepted. The top Workbench is accepted, the lower page remains long and dense, `OPERATOR_FIRST` is closed, and `BRIDGE_STORYBOARD_FLOW` is the selected forward lane.
- Manifest: `artifacts/artifact-manifest.json`
- Bridge Storyboard Flow doc: `docs/review/bridge-storyboard-flow.md`
- Bridge Storyboard Flow result: `artifacts/bridge-storyboard-flow-result.json`
- Bridge Storyboard Flow screenshot: `artifacts/review-screens/bridge-storyboard-flow.png` (900x1200 local Edge/Playwright capture)
- Bridge Storyboard Flow read-only validation command: `node tools/fff-state.mjs validate-bridge-storyboard-flow artifacts/bridge-storyboard-flow-result.json`
- Bridge Storyboard Flow regeneration command: `node tools/fff-state.mjs smoke-bridge-storyboard-flow artifacts/bridge-storyboard-flow-result.json artifacts/bridge-storyboard-flow-result.json` (intentional tracked-result write only)
- Review Workbench Component Contract doc: `docs/review/review-workbench-component-contract.md`
- Review Workbench Component Contract result: `artifacts/review-workbench-component-contract-result.json`
- Review Workbench Component Contract screenshot: `artifacts/review-screens/brief-component-contract-workbench.png`
- Review Workbench Component Contract read-only validation command: `node tools/fff-state.mjs validate-review-workbench-component-contract artifacts/review-workbench-component-contract-result.json`
- Review Workbench Component Contract artifact-regeneration command: `node tools/fff-state.mjs smoke-review-workbench-component-contract artifacts/review-workbench-component-contract-result.json artifacts/review-workbench-component-contract-result.json` (intentional tracked-result write only)
- Apply Decision Shell Guard Diet doc: `docs/review/apply-decision-shell-guard-diet.md`
- Apply Decision Shell Guard Diet result: `artifacts/apply-decision-shell-guard-diet-result.json`
- Apply Decision Shell Guard Diet screenshot: `artifacts/review-screens/brief-decision-shell-applied.png`
- Apply Decision Shell Guard Diet smoke command: `node tools/fff-state.mjs smoke-apply-decision-shell-guard-diet artifacts/apply-decision-shell-guard-diet-result.json artifacts/apply-decision-shell-guard-diet-result.json`
- Layout Lab Visual Audit doc: `docs/review/layout-lab-visual-audit.md`
- Layout Lab Visual Audit result: `artifacts/layout-lab-visual-audit-result.json`
- Layout Lab Visual Audit contact sheet: `artifacts/layout-lab-visual-audit-contact-sheet.png`
- Layout Lab Visual Audit screenshots: `artifacts/review-screens/layout-lab.png`, `artifacts/review-screens/layout-lab-decision-shell.png`, `artifacts/review-screens/brief-preserved.png`, `artifacts/review-screens/bridge-preserved.png`
- Layout Lab Visual Audit smoke command: `node tools/fff-state.mjs smoke-layout-lab-visual-audit artifacts/layout-lab-visual-audit-result.json artifacts/layout-lab-visual-audit-result.json`
- Layout Research Decision Shell doc: `docs/review/layout-research-decision-shell.md`
- Layout Research Decision Shell result: `artifacts/layout-research-decision-shell-result.json`
- Layout Research Decision Shell smoke command: `node tools/fff-state.mjs smoke-layout-research-decision-shell artifacts/layout-research-decision-shell-result.json artifacts/layout-research-decision-shell-result.json`
- Low-text Decision Console doc: `docs/review/low-text-decision-console.md`
- Low-text Decision Console result: `artifacts/low-text-decision-console-result.json`
- Low-text Decision Console smoke command: `node tools/fff-state.mjs smoke-low-text-decision-console artifacts/low-text-decision-console-result.json artifacts/low-text-decision-console-result.json`
- Guided Review Flow Workspace doc: `docs/review/guided-review-flow-workspace.md`
- Guided Review Flow Workspace result: `artifacts/guided-review-flow-workspace-result.json`
- Guided Review Flow Workspace smoke command: `node tools/fff-state.mjs smoke-guided-review-flow-workspace artifacts/guided-review-flow-workspace-result.json artifacts/guided-review-flow-workspace-result.json`
- Bridge Refinement Overview Ribbon doc: `docs/review/bridge-refinement-overview-ribbon.md`
- Bridge Refinement Overview Ribbon result: `artifacts/bridge-refinement-overview-ribbon-result.json`
- Bridge Refinement Overview Ribbon smoke command: `node tools/fff-state.mjs smoke-bridge-refinement-overview-ribbon artifacts/bridge-refinement-overview-ribbon-result.json artifacts/bridge-refinement-overview-ribbon-result.json`
- Home Cockpit Metric Linking doc: `docs/review/home-cockpit-metric-linking.md`
- Home Cockpit Metric Linking result: `artifacts/home-cockpit-metric-linking-result.json`
- Home Cockpit Metric Linking smoke command: `node tools/fff-state.mjs smoke-home-cockpit-metric-linking artifacts/home-cockpit-metric-linking-result.json artifacts/home-cockpit-metric-linking-result.json`
- Review Home Map Meters doc: `docs/review/review-home-map-meters.md`
- Review Home Map Meters result: `artifacts/review-home-map-meters-result.json`
- Review Home Map Meters smoke command: `node tools/fff-state.mjs smoke-review-home-map-meters artifacts/review-home-map-meters-result.json artifacts/review-home-map-meters-result.json`
- Review Brief Dark Mode UX doc: `docs/review/review-brief-dark-mode-ux.md`
- Review Brief Dark Mode UX result: `artifacts/review-brief-dark-mode-ux-result.json`
- Review Brief Dark Mode UX smoke command: `node tools/fff-state.mjs smoke-review-brief-dark-mode-ux artifacts/review-brief-dark-mode-ux-result.json artifacts/review-brief-dark-mode-ux-result.json`
- Draft-to-Video Planning Bridge doc: `docs/review/draft-to-video-planning-bridge.md`
- Draft-to-Video Planning Bridge result: `artifacts/draft-to-video-planning-bridge-result.json`
- Draft-to-Video Planning Bridge smoke command: `node tools/fff-state.mjs smoke-draft-to-video-planning-bridge artifacts/draft-to-video-planning-bridge-result.json artifacts/draft-to-video-planning-bridge-result.json`
- Stabilization checkpoint: `fff-draft-review-pack-stabilization-001`
- Stabilization doc: `docs/review/draft-review-pack-stabilization.md`
- Stabilization result: `artifacts/draft-review-pack-stabilization-result.json`
- Stabilization access state: `verified_present`
- Draft Review Pack doc: `docs/review/one-story-draft-review-pack.md`
- Draft Review Pack result: `artifacts/one-story-draft-review-pack-result.json`
- Draft Review Pack smoke command: `node tools/fff-state.mjs smoke-one-story-draft-review-pack artifacts/one-story-draft-review-pack-result.json artifacts/one-story-draft-review-pack-result.json`
- Designer Dashboard doc: `docs/review/designer-candidate-dashboard.md`
- Designer Dashboard result: `artifacts/designer-candidate-dashboard-result.json`
- Designer Dashboard smoke command: `node tools/fff-state.mjs smoke-designer-candidate-dashboard artifacts/designer-candidate-dashboard-result.json artifacts/designer-candidate-dashboard-result.json`
- Guard doc: `docs/review/contradictory-claim-guard.md`
- Guard result: `artifacts/contradictory-claim-guard-result.json`
- Guard fixture: `artifacts/extraction-negative-fixtures/contradictory-claim-hold.json`
- Guard smoke command: `node tools/fff-state.mjs smoke-contradictory-claim-guard artifacts/extraction-validator-smoke-result.json artifacts/contradictory-claim-guard-result.json`

Preserved source-span and fixture chain:

- Malformed/missing source-span guard: `fff-malformed-missing-span-guard-001`
- Multilingual fixture coverage: `fff-remaining-fixture-coverage-one-class-001`
- Translated/multilingual fixture audit: `fff-translated-memo-fixture-audit-001`
- Translation provenance/source-span readback: `fff-translation-provenance-source-span-readback-001`
- Translation policy source-of-truth boundary: `fff-translation-policy-source-of-truth-boundary-001`
- Minimal translated memo fixture: `fff-translated-memo-fixture-minimum-001`
- Held claim adoption preflight: `fff-held-claim-adoption-preflight-001`
- Downstream adoption semantics design: `fff-downstream-adoption-semantics-design-001`
- Adoption candidate ledger dry-run: `fff-adoption-candidate-ledger-dry-run-001`
- Sandbox adoption mutation one-claim: `fff-sandbox-adoption-mutation-one-claim-001`
- Sandbox adoption rollback rehearsal: `fff-sandbox-adoption-rollback-rehearsal-001`
- Production adoption authorization packet: `fff-production-adoption-authorization-packet-001`
- Production Claim Ledger adoption one-claim: `fff-production-claim-ledger-adoption-one-claim-001`
- Production Claim Ledger rollback rehearsal: `fff-production-claim-ledger-rollback-rehearsal-001`
- Downstream target authorization packet: `fff-downstream-target-authorization-packet-001`
- Profile adoption mutation one-claim: `fff-profile-adoption-mutation-one-claim-001`
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

- The active checkpoint is `fff-bridge-storyboard-flow-001`. `public/review/index.html?mode=bridge` starts with one compact six-beat rail and one active storyboard canvas, with Japanese-first title, planning time, story purpose, narration, subtitle, visual intent, held-truth boundary, and rights/asset note for every beat.
- Beat selection, Previous / Next, Arrow-key plus Home / End navigation, and one `Briefへ戻る` action share the same ordered model. The only next review is whether to accept, revise, or return the six-beat order and timing allocation.
- The former Bridge hero, Decision Console, Guided Flow, overview reference, refinement cards, and comprehensive Bridge grid are preserved inside one default-collapsed supporting-evidence section. They remain available for audit but no longer compete with the active Flow.
- The accepted operator observation closes `OPERATOR_FIRST`: the Workbench remains the preserved prelude at `public/review/index.html?mode=brief`, while forward product movement now occurs on the Bridge route.
- The preserved Workbench checkpoint is `fff-review-workbench-component-contract-001`. It converts the default `public/review/index.html?mode=brief` first screen into a role-contracted Review Workbench, keeps `fff-apply-decision-shell-guard-diet-001` as the source shell, and prevents each component from repeating the global explanation.
- The Workbench carries `data-component-role-contract="true"`, `data-single-framing-source="active-decision-canvas"`, `data-review-workbench-canvas="true"`, `data-route-nav-compact="true"`, `data-operator-utility-drawer="true"`, `data-context-dock-role="context-only"`, `data-duplication-budget="true"`, and `data-component-complement-rule="true"`.
- `componentRoleContracts` defines appHeader, routeNavigator, processRail, activeDecisionCanvas, contextDock, evidenceDrawer, notesDrawer, inspirationDrawer, guardDrawer, and legacyArchive with role, owns, must_not_show, max_visible_items, source_of_truth, and route_or_drawer fields.
- The single framing source is `activeDecisionCanvas`: header is identity/counters only, route navigation is navigation only, process rail is sequence only, Context Dock is pins/context only, Evidence owns evidence, and Guard owns gate details.
- The Context Dock now declares visible limits of context chips max 4, pins max 3, notices max 2, and lock summaries max 1. First-screen measured counts in the Workbench result are candidate ID 1, channel ID 1, provider/API outside Guard 0, final canon outside Guard 0, and competing global heading count 0.
- The route navigator is a compact strip rather than a summary dashboard, and the local launch commands moved behind `data-operator-utility-drawer="true"`.
- `docs/review/review-workbench-component-contract.md`, `artifacts/review-workbench-component-contract-result.json`, and `artifacts/review-screens/brief-component-contract-workbench.png` record the current role-contract readback and visual evidence.
- The preserved source checkpoint `fff-apply-decision-shell-guard-diet-001` still applies the Split-pane Decision Shell, keeps `Bridgeで確認` as the next action, and moves long context into governed drawers instead of making the reviewer pass through a card wall first.
- The preserved applied Shell still carries `data-applied-decision-shell="brief"`, `data-decision-flow-model-applied="true"`, `data-dock-governor="true"`, `data-safety-gate-diet="true"`, `data-guard-drawer="true"`, `data-non-gate-whitelist="true"`, and `data-card-wall-not-default="true"`.
- `decisionFlowModel` now represents the applied brief decision: current route `public/review/index.html?mode=brief`, candidate `designer-content-moth-investigation-3m`, channel `designer-channel-mystery-lore`, five choices, six steps, six context rows, pins, notices, locks, and next action `Bridgeで確認` to `public/review/index.html?mode=bridge`.
- The Dock Governor caps visible pins at 4, notices at 3, locks at 4, and context rows at 4. Overflow rows go to the Guard drawer through `data-dock-overflow-list`, and the dock has a stable max height with internal scroll.
- `safetyGateRegistry` keeps the compact top safety summary short while the Guard drawer holds the true gate registry: provider/API, credentials, AI video, render, upload / public publishing, database persistence, final canon, and rights clearance all remain closed.
- The non-gate whitelist is explicit and local only: UI/layout changes, static JSON/readback updates, screenshots/contact sheets, docs/status/manifest updates, local smoke checks, and mock/pre-production planning.
- `docs/review/apply-decision-shell-guard-diet.md` and `artifacts/apply-decision-shell-guard-diet-result.json` record the preserved source-shell readback. Screenshot evidence is `artifacts/review-screens/brief-decision-shell-applied.png`.
- The source visual checkpoint remains `fff-layout-lab-visual-audit-001`. Its contact sheet and four screenshots still preserve why the split-pane Shell was chosen: `artifacts/layout-lab-visual-audit-contact-sheet.png`, `artifacts/review-screens/layout-lab.png`, `artifacts/review-screens/layout-lab-decision-shell.png`, `artifacts/review-screens/brief-preserved.png`, and `artifacts/review-screens/bridge-preserved.png`.
- The source layout checkpoint remains `fff-layout-research-decision-shell-001`. It keeps the direct-access local research surface at `public/review/index.html?mode=layout-lab` and remains evidence, not the default review route.
- The preserved Review Hub checkpoint `fff-low-text-decision-console-001` remains a source readback beneath the applied Shell; it preserves `fff-guided-review-flow-workspace-001`, `fff-bridge-refinement-overview-ribbon-001`, `fff-home-cockpit-metric-linking-001`, `fff-review-home-map-meters-001`, `fff-draft-to-video-planning-bridge-001`, `fff-review-brief-dark-mode-ux-001`, `fff-one-story-draft-review-pack-001`, `fff-designer-candidate-dashboard-001`, `fff-draft-review-pack-stabilization-001`, and `fff-contradictory-claim-guard-001` instead of replacing their readbacks.
- `public/review/index.html?mode=brief` now starts with the applied Decision Shell, which keeps the low-text route question, five short answer buttons, one primary `Bridgeで確認` action, a six-step rail, a governed context dock, and closed drawers before the Guided Review Flow, Latest Overview Report, and legacy card-grid cockpit shelves.
- The preserved Bridge Decision Console remains below the active Storyboard Flow inside collapsed supporting evidence, so its route / narration / subtitle / visual / thumbnail / held-truth judgment remains available without controlling the first screen.
- `artifacts/low-text-decision-console-result.json` records decision_console_visible=true, decision_console_first=true, active_question_text=`この路線で進める？`, choice_button_count=5, primary_action_count=1, context_chip_count=6, step_count=6, current_step_count=1, bridge_console_visible=true, card_wall_suppressed=true, text_budget_passed=true, selected_candidate_id=`designer-content-moth-investigation-3m`, selected_channel_route=`designer-channel-mystery-lore`, local-only=true, external_call=false, provider_configured=false, credentials_touched=false, public_upload=false, ai_video_generation=false, production_render=false, final_canon_decision=false, rights_cleared_claim=false, database_persistence=false, and passed=true.
- The preserved Guided Review Flow remains below the low-text console before the Latest Overview Report and card shelves. It still has one primary Bridge action, a six-step Decision Queue, Pinned Tray, Operations Notice, Important Folders, and an Inspiration Workspace for local-only review prompts.
- The preserved Bridge Guided Flow remains in collapsed supporting evidence and still records route confirmation, narration direction, subtitle rhythm, visual order, thumbnail direction, and held-truth policy.
- `artifacts/guided-review-flow-workspace-result.json` records guided_flow_visible=true, guided_flow_before_latest_overview=true, guided_flow_before_first_card=true, primary_action_count=1, decision_queue_step_count=6, current_step_count=1, pinned_item_count=7, important_folder_count=5, inspiration_prompt_count=15, bridge_guided_step_count=6, card_grid_demoted=true, latest_overview_preserved=true, dark_mode_preserved=true, selected_candidate_id=`designer-content-moth-investigation-3m`, selected_channel_route=`designer-channel-mystery-lore`, local-only=true, external_call=false, provider_configured=false, credentials_touched=false, public_upload=false, ai_video_generation=false, production_render=false, final_canon_decision=false, rights_cleared_claim=false, database_persistence=false, and passed=true.
- `public/review/index.html?mode=brief` now starts with a compact Latest Overview Report / 最新概況報告. It has 5 items: latest state, latest change, read now, next decision, and locked lanes. The overview has one obvious action into `public/review/index.html?mode=bridge`.
- The older Review Brief content under `brief` mode is demoted into a folded detail shelf. It still preserves selected candidate `designer-content-moth-investigation-3m`, selected channel route `designer-channel-mystery-lore`, the route contract, and the review prompts, but it no longer competes with the Home Cockpit overview as a second first-read introduction.
- The Draft-to-Video Bridge now has a Bridge Refinement section with 5 narration candidates, 6 subtitle rhythm cues, 6 visual/shot ordering cues, 3 thumbnail alternatives, a held-truth policy note, and a rights/asset boundary note. These are all non-final pre-production review cues.
- `artifacts/bridge-refinement-overview-ribbon-result.json` records latest_overview_visible=true, latest_overview_item_count=5, overview_bridge_link_visible=true, duplicated_brief_demoted_or_merged=true, bridge_refinement_visible=true, narration_refinement_count=5, subtitle_rhythm_count=6, visual_ordering_count=6, thumbnail_direction_count=3, held_truth_policy_visible=true, evidence_vault_optional_preserved=true, dark_mode_preserved=true, local-only=true, external_call=false, provider_configured=false, credentials_touched=false, public_upload=false, ai_video_generation=false, production_render=false, final_canon_decision=false, rights_cleared_claim=false, and passed=true.
- `public/review/index.html` and `public/review/index.html?mode=brief` now default to the Guided Review Flow / Home Cockpit command surface. `public/review/index.html?mode=home` remains a compatibility alias to the same screen.
- The Home Cockpit groups the review surface into Operator Track, Workbench, Evidence Vault, and Locked Lanes. Operator Track means `Home Cockpit / Review Brief` + `Draft-to-Video Bridge` are the required reading; Evidence Vault means `Source Audit` / `Project Cockpit` / `Artifacts` are optional audit shelves; Locked Lanes means provider/API setup, AI video generation, production render, YouTube upload, final canon, and rights-clearance claims are not active.
- The Home Cockpit contains nine actionable readiness meters: selected route, narration outline, subtitle/on-screen text, shot/visual cue, thumbnail brief, rights/assets, held truths, evidence health, and publication/generation lane. Each meter links to Bridge, Workbench, Evidence Vault, or Locked Lane follow-up.
- `artifacts/home-cockpit-metric-linking-result.json` records default_mode=`brief`, optional_alias_route=`public/review/index.html?mode=home`, operator_track_cards=2, workbench_cards=3, evidence_vault_cards=3, locked_lane_cards=6, readiness_meter_count=9, meters_actionable=true, evidence_vault_semantically_linked=true, bridge_route_preserved=true, dark_mode_preserved=true, source_readbacks_preserved=true, local-only=true, external_call=false, provider_configured=false, credentials_touched=false, public_upload=false, ai_video_generation=false, production_render=false, final_canon_decision=false, rights_cleared_claim=false, and passed=true.
- The Review Hub now includes `public/review/index.html?mode=bridge` as a local Draft-to-Video Planning Bridge for selected candidate `designer-content-moth-investigation-3m` and selected channel `designer-channel-mystery-lore`.
- The bridge exposes a Japanese-first route summary, a non-final narration outline, subtitle/on-screen text cues, shot/visual cues, a thumbnail brief, sound/music/mood cue, rights/asset risks, held truths, production non-goals, and reviewer decisions.
- `Source Audit`, `Project Cockpit`, and `Artifacts` remain available as optional evidence shelves instead of first-impression panels.
- The Review Hub now supports Light / Dark / Auto theme controls, local theme preference storage, `color-scheme: light dark`, dark-mode CSS variables, reduced hardcoded light surfaces, and a contrast hotfix for selected candidate/channel cards, review brief cards, pills, badges, tags, links, muted text, and focus-visible states.
- `artifacts/draft-to-video-planning-bridge-result.json` records bridge_visible=true, operator_track_visible=true, evidence_vault_demoted=true, dark_contrast_hotfix_applied=true, narration_outline_count=5, subtitle_cue_count=5, visual_cue_count=5, thumbnail_brief_count=1, sound_mood_cue_count=1, rights_risk_count=5, held_truth_count=4, reviewer_decision_count=4, local-only=true, external_call=false, provider_configured=false, credentials_touched=false, public_upload=false, ai_video_generation=false, production_render=false, final_canon_decision=false, rights_cleared_claim=false, and passed=true.
- `artifacts/review-brief-dark-mode-ux-result.json` records review_brief_visible=true, selected_candidate_id_visible=true, selected_channel_route_visible=true, japanese_summary_present=true, no_query_default_mode=`brief`, dark_mode_toggle_present=true, color_scheme_supports_light_dark=true, hardcoded_light_surfaces_reduced=true, designer_dashboard_preserved=true, draft_review_pack_preserved=true, stabilization_checkpoint_preserved=true, local-only=true, and draft_to_video_planning_bridge=true.
- `docs/review/review-brief-dark-mode-ux.md` records purpose, access, UX changes, preserved work, validation commands, review debt, and next move.
- `tools/fff-state.mjs` includes `smoke-review-brief-dark-mode-ux` for local readback validation.
- `fff-draft-review-pack-stabilization-001` remains the prior access/readback and git-durability checkpoint for the Designer Dashboard and Draft Review Pack.
- `artifacts/draft-review-pack-stabilization-result.json` records verified-present access for `public/review/index.html?mode=designer` and `public/review/index.html?mode=draft`, confirms both result artifacts and review docs exist, confirms static Review Hub markers and renderers, and records the in-app browser `file://` capture attempt as blocked by browser URL policy with static readback as fallback.
- `public/review/index.html` has a `Draft Review Pack` mode for `public/review/index.html?mode=draft`.
- The draft pack selects `designer-content-moth-investigation-3m` as a `provisional_default`, exposes source memo/story cue, logline, premise, channel route, 5 draft beats, non-final opening/narration sample, 4 visual cues, 4 subtitle/on-screen text cues, 3 unresolved human-owned questions, 4 risk cards, and 3 recommended reviewer decisions.
- `artifacts/one-story-draft-review-pack-result.json` records local-only=true, external_call=false, provider_configured=false, credentials_touched=false, public_upload=false, ai_video_generation=false, final_canon_decision=false, source_dashboard_preserved=true, and matching draft pack counts.
- `docs/review/one-story-draft-review-pack.md` records purpose, access, review targets, preserved boundaries, validation commands, known limitations, and next recommended slice.
- `tools/fff-state.mjs` includes `smoke-one-story-draft-review-pack` for local readback validation.
- `public/review/index.html` has a `Designer Dashboard` mode for `public/review/index.html?mode=designer`.
- The dashboard exposes one-story runway context, 3 content candidate cards, 3 channel strategy proposal cards, 5 draft spine beats, 4 review risk cards, and 3 held human-owned decisions.
- `artifacts/designer-candidate-dashboard-result.json` records local-only=true, external_call=false, provider_configured=false, credentials_touched=false, public_upload=false, ai_video_generation=false, final_canon_decision=false, and matching dashboard counts.
- `docs/review/designer-candidate-dashboard.md` records purpose, access, review targets, preserved boundaries, validation commands, known limitations, and next recommended slice.
- `tools/fff-state.mjs` includes `smoke-designer-candidate-dashboard` for local readback validation.
- `fff-contradictory-claim-guard-001` remains preserved as an auxiliary guard under the dashboard slice.
- The preserved contradictory-claim guard identity remains `fff-contradictory-claim-guard-001`.
- `artifacts/extraction-negative-fixtures/contradictory-claim-hold.json` adds one bounded contradictory-claim fixture with 2 claim-routed elements and 2 claim candidates.
- The two claim candidates are linked with reciprocal `contradictsClaimIds`, both keep `worldTruthStatus=uncertain`, both remain `hold`, and both preserve source refs.
- `tools/fff-state.mjs` now validates contradictory claim candidates so a claim with `contradictsClaimIds` must remain held, source-backed, high-risk, uncertain, and reciprocally linked.
- `artifacts/extraction-validator-smoke-result.json` now covers 9 fixtures: 3 expected-valid, 6 expected-invalid, 0 mismatches, and 5 built-in guard cases.
- `artifacts/contradictory-claim-guard-result.json` records `conflict_detected`, `hold_for_human_review`, `keep_out_of_auto_canon`, `keep_out_of_direct_claim_acceptance`, and `preserve_source_refs` as passed.
- `fff-remaining-fixture-coverage-one-class-001` adds one normal adapter fixture, `artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md`, plus generated output at `artifacts/extraction-adapter-outputs/multilingual-memo-notes.json`.
- The positive source-span pack now reads 5 fixtures and 60 rows. The multilingual readback confirms 12 selected fixture elements, 4 non-ASCII source-span elements, 0 source-span mismatches, 0 missing source refs, 0 unsafe visual routes, 0 non-held defaults, and 0 human-owned adopt suggestions.
- `fff-translated-memo-fixture-audit-001` audits the translated / multilingual fixture axis without adding another fixture class. It confirms the multilingual fixture already covers mixed-language memo text, keeps translated memo text as a policy-dependent source-pack gap, and classifies the prior full-manifest-regeneration unknown as `not_available` because the repo defines manifest validation but no full manifest regeneration command.
- `fff-translation-provenance-source-span-readback-001` records 3 selected multilingual source-span to held derived-claim relations plus 1 inline-gloss boundary row. It confirms all 4 checked spans match the raw memo and source-pack rows, all 3 derived claims remain held and source-backed, that readback itself added no translated fixture, provider configured=false, external call=false, credentials=false, downstream adopted candidates=0, adopted/provisional conflicting claims=0, and direct accepted claim elements=0.
- `fff-translation-policy-source-of-truth-boundary-001` defines the narrow translation policy boundary before translated fixture or provider work: original multilingual author memo text is the source-of-truth language surface, original sourceSpan locators own evidence, future translated spans are derivative/provenance-bound, inline gloss cannot create an unowned claim, derived claims remain held, and provider/API/credential work stays blocked.
- `fff-translated-memo-fixture-minimum-001` adds a two-row translated memo fixture after the policy boundary. It keeps `multi-x-object-brass-moth-key` and `multi-x-placeholder-translation-boundary` tied to the original author memo sourceSpan locators, records translated text as `declared_derivative_translation_only`, keeps the linked moth-key claim held, keeps the inline gloss row claimless, and preserves no provider/API call, credential, downstream adoption, or canon promotion.
- `fff-held-claim-adoption-preflight-001` inspects the held linked claim `multi-claim-moth-key-label` before any adoption path exists. The preflight records `multi-x-object-brass-moth-key` and `translated-min-row-moth-key-label`, confirms the claim is source-backed and held, marks it eligible only for preflight candidacy, keeps adoption decision `not_adopted`, keeps canon status `false`, and preserves 0 translation/gloss leaks, 0 actually adopted claims, 0 canonized claims, no provider/API call, no credential, and no downstream mutation.
- `fff-downstream-adoption-semantics-design-001` defines downstream adoption semantics for `multi-claim-moth-key-label` without adopting it. The design records `hold -> adoption_candidate` as the only current-slice readback-only transition, defines future `human_accepted_downstream_adoption` as unreachable now, documents 10 rollback conditions, blocks Profile / Claim / Timeline / Story Seed mutation, keeps 0 adopted claims, 0 canonized claims, no provider/API call, no credential, and no downstream mutation.
- `fff-adoption-candidate-ledger-dry-run-001` records `multi-claim-moth-key-label` as a non-mutating `adoption_candidate_dry_run` ledger row. It carries `multi-x-object-brass-moth-key`, prior claim status `hold`, `hold -> adoption_candidate`, rollback/rejection vocabulary, future-only Profile / Claim / Timeline target classes, 0 adopted claims, 0 canonized claims, 0 Profile / Claim / Timeline / Story Seed mutations, no provider/API call, no credential, no publishing, and no production generation.
- `fff-sandbox-adoption-mutation-one-claim-001` records the user-authorized sandbox fixture mutation for exactly `multi-claim-moth-key-label`. It moves only the sandbox row from `adoption_candidate_dry_run` to `sandbox_adopted_fixture`, records rollback token `rollback-sandbox-adoption-moth-key-label-to-adoption-candidate-dry-run`, and preserves 0 production adopted claims, 0 canonized claims, 0 Profile / Claim / Timeline / Story Seed production mutations, no provider/API call, no credential, no publishing, and no production generation.
- `fff-sandbox-adoption-rollback-rehearsal-001` rehearses rollback for exactly the same sandbox fixture row. It verifies rollback token `rollback-sandbox-adoption-moth-key-label-to-adoption-candidate-dry-run`, records `sandbox_adopted_fixture -> adoption_candidate_dry_run`, keeps production rollback performed=false, and preserves 0 production adopted claims, 0 canonized claims, 0 Profile / Claim / Timeline / Story Seed production mutations, no provider/API call, no credential, no publishing, and no production generation.
- `fff-production-adoption-authorization-packet-001` prepares the freeform approval surface for possible future production adoption of `multi-claim-moth-key-label`. It proposes Profile, Claim Ledger, Timeline, and Story Seed target classes, recommends Claim Ledger first, records mutation behavior and rollback owner requirements, keeps user authorization required=true, keeps production adoption approved=false, canon approved=false, provider approved=false, publishing approved=false, and preserves 0 production mutations.
- `fff-production-claim-ledger-adoption-one-claim-001` records the now-authorized Claim Ledger-only production adoption for exactly `multi-claim-moth-key-label`. It moves the Claim Ledger readback from `adoption_candidate_dry_run` to `production_claim_ledger_adopted`, records rollback token `rollback-production-claim-ledger-adoption-moth-key-label-to-adoption-candidate-dry-run`, keeps Profile / Timeline / Story Seed mutation counts at 0, keeps canonized claims at 0, keeps provider/API/credential/publishing/production generation false, and adopts no additional claim.
- `fff-production-claim-ledger-rollback-rehearsal-001` records a non-destructive rollback rehearsal for that same production Claim Ledger row. It verifies rollback token `rollback-production-claim-ledger-adoption-moth-key-label-to-adoption-candidate-dry-run`, records the rollback target status `adoption_candidate_dry_run`, keeps actual rollback operations at 0, keeps production Claim Ledger rows removed at 0, retains the row after rehearsal, keeps Profile / Timeline / Story Seed mutation counts at 0, keeps canonized claims at 0, keeps provider/API/credential/publishing/production generation false, and rolls back no additional claim.
- `fff-downstream-target-authorization-packet-001` prepares the next downstream target choice after the retained Claim Ledger row. It confirms current status `production_claim_ledger_adopted`, rollback descriptor status `verified`, Claim Ledger row retained=true, proposes Profile / Timeline / Story Seed / Canon decision target classes, recommends Profile as the only next target, keeps user authorization required=true, keeps all explicit non-approval flags false, performs 0 downstream mutations, keeps Profile / Timeline / Story Seed mutation counts at 0, keeps canonized claims at 0, and keeps provider/API/credential/publishing/production generation false.
- `fff-profile-adoption-mutation-one-claim-001` records the now-authorized Profile-only production mutation for exactly `multi-claim-moth-key-label`. It adds one non-canon Profile annotation row for `multi-profile-brass-moth-key`, records `claim_ledger_adopted -> profile_adopted_noncanon`, stores rollback token `rollback-profile-adoption-moth-key-label-to-claim-ledger-only`, keeps Claim Ledger additional adoption count at 0, keeps Timeline / Story Seed mutation counts at 0, keeps canonized claims at 0, and keeps provider/API/credential/publishing/production generation false.
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

- `node tools/fff-state.mjs validate-bridge-storyboard-flow artifacts/bridge-storyboard-flow-result.json` passes with six beats, all required field counts at 6, rail/canvas/Previous/Next/Brief/keyboard behavior present, legacy Bridge evidence collapsed, Workbench and dark mode preserved, closed boundary gates, and zero failures.
- The 900x1200 screenshot `artifacts/review-screens/bridge-storyboard-flow.png` is 185233 bytes with SHA256 `64626FD09CE077AEFBE9D0A42212197247CE464CEC9925E2D337BF1C481614AC`. Browser readback measured no horizontal overflow, verified Light/Dark readability, Arrow/Home/End and button navigation, visible focus, reduced-motion behavior, and no console/page errors.
- The normal manifest health command stays read-only. `smoke-bridge-storyboard-flow` was used once to intentionally create the tracked normalized result and is not part of restart validation.

- The previous restart-readiness refresh pulled `af4a376 Record operator-first handoff`, confirmed parity, preserved `.serena/project.yml`, and established the read-only validation rule before this product slice.
- The active manifest now runs three targeted read-only validators: Bridge Storyboard Flow, preserved Review Workbench, and preserved Draft-to-Video Bridge. The active validator also checks the passed Contradictory Claim Guard readback. The chain passed with nine result/readback hashes unchanged; a supplied output path was rejected with nonzero exit and no file creation.
- Repo-sync handoff refresh on 2026-07-07 JST started after `917cae4 Add review workbench component contract` was already pushed to `origin/master`; `git status --short --branch --untracked-files=all` reported clean `master...origin/master`, and no product behavior change was added in the handoff-only pass.
- Git parity before this slice: `git rev-list --left-right --count HEAD...origin/master` reported `0 0`.
- `node tools/fff-state.mjs smoke-review-workbench-component-contract artifacts/review-workbench-component-contract-result.json artifacts/review-workbench-component-contract-result.json` previously passed for the preserved Review Workbench Component Contract package.
- `node tools/fff-state.mjs smoke-layout-lab-visual-audit artifacts/layout-lab-visual-audit-result.json artifacts/layout-lab-visual-audit-result.json` passed for the active Layout Lab Visual Audit package.
- `node tools/fff-state.mjs smoke-layout-research-decision-shell artifacts/layout-research-decision-shell-result.json artifacts/layout-research-decision-shell-result.json` passed for the active Layout Research Decision Shell readback.
- Guided Review Flow Workspace slice on 2026-07-06 JST started from `master` parity with `origin/master` after fetch/pull checks; local `.serena/project.yml` remained transport residue and was intentionally excluded from product staging. The slice adds `fff-guided-review-flow-workspace-001` as the active artifact and preserves the overview ribbon, Home Cockpit, bridge, brief, draft, designer, stabilization, and contradictory-claim readbacks.
- Remote-sync handoff refresh on 2026-06-30 JST started from `ea08c669745a9516685841d36c05c0fd5de1e939` (`ea08c66 Add production adoption authorization packet`) after `git fetch --prune origin`, `git pull --ff-only origin master`, and `git rev-list --left-right --count "HEAD...origin/master"` reported already up to date and `0 0`; the pushed docs-only handoff commit is the next `git log -1 --oneline --decorate` value after pulling.
- Route hygiene before this handoff: `git rev-list --left-right --count
  "HEAD...origin/master"` reported `0 0`; the workspace was clean after the
  four untracked ClipPipeGen residue files were deleted; tracked contamination
  grep returned no hits before `fff-route-lock-clean-state-readback-001` was
  added as the durable evidence record.
- This production adoption authorization packet slice started after pulling `master` to `origin/master` parity; the contradictory-claim guard was already the tracked active surface, so the downstream gate, downstream scope-lock, provider-envelope readiness, provider authorization readiness, multilingual fixture coverage, translated audit, translation provenance readback, translation policy boundary, minimal translated fixture, held claim preflight, adoption ledger, sandbox adoption mutation, sandbox rollback rehearsal, production authorization packet, and very broad audit remain preserved auxiliary readbacks instead of active-status rewinds.
- This production Claim Ledger adoption slice started on synced `master` after the user authorized recommended path A for exactly `multi-claim-moth-key-label` and Claim Ledger only; the new readback records 1 Claim Ledger adoption row while keeping canon, Profile, Timeline, Story Seed, provider/API, credential, publishing, production generation, production rollback, and additional-claim adoption outside the scope.
- This production Claim Ledger rollback rehearsal slice started on synced `master` after `fff-production-claim-ledger-adoption-one-claim-001`; the new readback inspects the retained Claim Ledger row and rollback descriptor without performing rollback or crossing Profile / Timeline / Story Seed / canon / provider / credential / publishing boundaries.
- This downstream target authorization packet slice started on synced `master` after `fff-production-claim-ledger-rollback-rehearsal-001`; the new readback prepares the next target-class choice only and performs no Profile / Timeline / Story Seed / Canon decision / provider / credential / publishing mutation.
- This Profile adoption mutation one-claim slice started on synced `master` after the user authorized recommended path A from the downstream target authorization packet for exactly `multi-claim-moth-key-label` and Profile only; the new readback records 1 non-canon Profile annotation while keeping Claim Ledger additional adoption, Timeline, Story Seed, canon, provider/API, credential, publishing, production generation, actual rollback, and additional-claim work outside the scope.
- Project-local instructions and required context docs were read before changing review claims.
- `node tools/fff-state.mjs smoke-low-text-decision-console artifacts/low-text-decision-console-result.json artifacts/low-text-decision-console-result.json` passed for the preserved Low-text Decision Console readback.
- `node tools/fff-state.mjs smoke-guided-review-flow-workspace artifacts/guided-review-flow-workspace-result.json artifacts/guided-review-flow-workspace-result.json` passed for the preserved Guided Review Flow Workspace readback.
- `artifacts/draft-review-pack-stabilization-result.json` passed with access_state=`verified_present`, static_mode_check_passed=true, designer_result_exists=true, draft_result_exists=true, designer_smoke_passed=true, draft_smoke_passed=true, and contradictory_claim_guard_preserved=true.
- `node --check tools/fff-state.mjs` passed.
- `node tools/fff-state.mjs smoke-review-brief-dark-mode-ux artifacts/review-brief-dark-mode-ux-result.json artifacts/review-brief-dark-mode-ux-result.json` passed for the Review Brief / dark mode UX readback.
- `node tools/fff-state.mjs smoke-draft-to-video-planning-bridge artifacts/draft-to-video-planning-bridge-result.json artifacts/draft-to-video-planning-bridge-result.json` passed for the Draft-to-Video Planning Bridge readback.
- `node tools/fff-state.mjs smoke-one-story-draft-review-pack artifacts/one-story-draft-review-pack-result.json artifacts/one-story-draft-review-pack-result.json` passed for the preserved Draft Review Pack readback.
- `node tools/fff-state.mjs smoke-designer-candidate-dashboard artifacts/designer-candidate-dashboard-result.json artifacts/designer-candidate-dashboard-result.json` passed for the preserved Designer Candidate Dashboard readback.
- Static Review Hub check passed: embedded script compiled with `new Function(...)`, and the HTML contains the Review Brief, Draft-to-Video Bridge, Draft Review Pack, and Designer Dashboard mode routes/roots, selected candidate/channel ids, route contract markers, contrast markers, production non-goal markers, and active/preserved artifact ids.
- Browser screenshot capture was attempted with the available in-app browser tooling, but `file://` navigation was blocked by browser URL policy; no screenshot file was produced, and the stabilization result records static access/readback evidence instead.
- `git diff --check` passed. `python -m mkdocs build --strict` could not run in this environment because WindowsApps `python` resolved to a stub, but `uvx --with mkdocs-material mkdocs build --strict --site-dir "$env:TEMP\fff-mkdocs-build"` passed.
- `node tools/fff-state.mjs smoke-extraction-fixtures artifacts/extraction-negative-fixtures artifacts/extraction-validator-smoke-result.json` passed.
- `node tools/fff-state.mjs smoke-contradictory-claim-guard artifacts/extraction-validator-smoke-result.json artifacts/contradictory-claim-guard-result.json` passed.
- `node tools/fff-state.mjs smoke-malformed-missing-span-guard artifacts/extraction-validator-smoke-result.json artifacts/malformed-missing-span-guard-result.json` passed after the validator matrix grew to 9 fixtures.
- `node tools/fff-state.mjs smoke-downstream-source-span-adoption-gate artifacts/source-span-routing-review-pack.json artifacts/downstream-source-span-adoption-gate-result.json` passed for the preserved auxiliary readback.
- `node tools/fff-state.mjs smoke-provider-envelope-readiness-no-call artifacts/provider-envelope-readiness-no-call.example.json artifacts/provider-envelope-readiness-no-call-result.json` passed for the preserved auxiliary provider-envelope readback.
- `node tools/fff-state.mjs smoke-provider-adapter-authorization-readiness artifacts/provider-envelope-readiness-no-call-result.json artifacts/provider-adapter-authorization-readiness-result.json` passed for the provider authorization boundary readback.
- `node tools/fff-state.mjs smoke-remaining-fixture-coverage-one-class artifacts/local-extraction-adapter-expansion-smoke-result.json artifacts/remaining-fixture-coverage-one-class-result.json` passed for the multilingual fixture readback.
- `node tools/fff-state.mjs smoke-translated-memo-fixture-audit artifacts/local-extraction-adapter-expansion-smoke-result.json artifacts/translated-memo-fixture-audit-result.json` passed for the translated / multilingual fixture audit.
- `node tools/fff-state.mjs smoke-translation-provenance-source-span-readback artifacts/extraction-adapter-outputs/multilingual-memo-notes.json artifacts/translation-provenance-source-span-readback-result.json` passed for the translation provenance / source-span readback.
- `node tools/fff-state.mjs smoke-translation-policy-source-of-truth-boundary artifacts/translation-provenance-source-span-readback-result.json artifacts/translation-policy-source-of-truth-boundary-result.json` passed for the translation source-of-truth policy boundary.
- `node tools/fff-state.mjs smoke-translated-memo-fixture-minimum artifacts/translated-memo-fixture-minimum.json artifacts/translated-memo-fixture-minimum-result.json` passed for the minimal translated memo fixture.
- `node tools/fff-state.mjs smoke-held-claim-adoption-preflight artifacts/translated-memo-fixture-minimum-result.json artifacts/held-claim-adoption-preflight-result.json` passed for the held claim adoption preflight.
- `node tools/fff-state.mjs smoke-downstream-adoption-semantics-design artifacts/held-claim-adoption-preflight-result.json artifacts/downstream-adoption-semantics-design-result.json` passed for the downstream adoption semantics design.
- `node tools/fff-state.mjs smoke-adoption-candidate-ledger-dry-run artifacts/downstream-adoption-semantics-design-result.json artifacts/adoption-candidate-ledger-dry-run-result.json` passed for the adoption candidate ledger dry-run.
- `node tools/fff-state.mjs smoke-sandbox-adoption-mutation-one-claim artifacts/adoption-candidate-ledger-dry-run-result.json artifacts/sandbox-adoption-mutation-one-claim-result.json` passed for the sandbox adoption mutation one-claim readback.
- `node tools/fff-state.mjs smoke-sandbox-adoption-rollback-rehearsal artifacts/sandbox-adoption-mutation-one-claim-result.json artifacts/sandbox-adoption-rollback-rehearsal-result.json` passed for the sandbox adoption rollback rehearsal readback.
- `node tools/fff-state.mjs smoke-production-adoption-authorization-packet artifacts/sandbox-adoption-rollback-rehearsal-result.json artifacts/production-adoption-authorization-packet-result.json` passed for the production adoption authorization packet.
- `node tools/fff-state.mjs smoke-production-claim-ledger-adoption-one-claim artifacts/production-adoption-authorization-packet-result.json artifacts/production-claim-ledger-adoption-one-claim-result.json` passed for the Claim Ledger one-claim production adoption readback.
- `node tools/fff-state.mjs smoke-production-claim-ledger-rollback-rehearsal artifacts/production-claim-ledger-adoption-one-claim-result.json artifacts/production-claim-ledger-rollback-rehearsal-result.json` passed for the readback-only Claim Ledger rollback rehearsal.
- `node tools/fff-state.mjs smoke-downstream-target-authorization-packet artifacts/production-claim-ledger-rollback-rehearsal-result.json artifacts/downstream-target-authorization-packet-result.json` passed for the packet-only downstream target authorization readback.
- `node tools/fff-state.mjs smoke-profile-adoption-mutation-one-claim artifacts/downstream-target-authorization-packet-result.json artifacts/profile-adoption-mutation-one-claim-result.json` passed for the Profile-only one-claim adoption readback.
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
| Translated/multilingual audit | Close the resume validation unknown and avoid duplicate fixture work | Full manifest regeneration command classified as `not_available`; the audit did not add a translated fixture and handed the gap to later policy/fixture slices |
| Translation provenance/source-span readback | Make the source span / local normalization / held derived claim relation readable before translated fixture work | 3 source-claim rows and 1 boundary row checked; 4 spans match raw memo/source pack; 0 provider calls, credentials, translated fixtures, downstream adoption, or canon promotion |
| Translation policy source-of-truth boundary | Define source language, original/translation/gloss ownership, and claim promotion limits before translated fixture work | 8 policy rules recorded; source-of-truth is original multilingual author memo text; 4 original spans checked; 0 translated fixtures, external translation rows, claim promotion leaks, provider calls, credentials, or downstream adoption |
| Minimal translated memo fixture | Prove a translated fixture can be derivative-only and source-span-bound | 2 translated rows checked; 2 original span matches; 0 original span mismatches; 0 translation-to-claim leaks; 1 held linked claim; 0 auto-promotions; 0 inline gloss claim leaks; no provider calls or credentials |
| Held claim adoption preflight | Check whether the held translated-fixture claim can be named as a future adoption candidate without adopting it | 1 held claim inspected; 1 source-backed claim; 1 preflight-only eligible candidate; 0 adopted claims; 0 canonized claims; 0 translation/gloss leaks; no provider calls or credentials |
| Downstream adoption semantics design | Define adoption vocabulary before any downstream mutation exists | 1 preflight candidate has design-only semantics; accepted status is defined but unreachable now; 10 rollback conditions; 4 mutation targets blocked; 0 adopted or canonized claims |
| Adoption candidate ledger dry-run | Record candidate status before mutation | 1 source-backed held claim is recorded as `adoption_candidate_dry_run`; 0 adoption, canon, mutation, provider, credential, publishing, or production generation |
| Sandbox adoption mutation | Record a fixture-only adoption mutation | 1 sandbox row records `adoption_candidate_dry_run -> sandbox_adopted_fixture`; rollback token present; 0 production/canon/provider/publishing effects |
| Sandbox adoption rollback rehearsal | Rehearse sandbox-only rollback before production adoption | 1 sandbox row records `sandbox_adopted_fixture -> adoption_candidate_dry_run`; expected rollback token verified; production rollback performed=false; 0 production/canon/provider/publishing effects |
| Production adoption authorization packet | Prepare a freeform approval surface before production mutation | 1 rollback-rehearsed candidate; 4 proposed target classes; Claim Ledger recommended first; user authorization required=true; production adoption approved=false; 0 production/canon/provider/publishing effects |
| Production Claim Ledger adoption | Record the authorized narrow production adoption | 1 Claim Ledger row records `adoption_candidate_dry_run -> production_claim_ledger_adopted`; Profile / Timeline / Story Seed mutation counts 0; canonized claims 0; provider/API/credential/publishing effects false |
| Production Claim Ledger rollback rehearsal | Rehearse rollback descriptor without mutating the row | 1 adopted Claim Ledger row inspected; rollback descriptor verified; actual rollback operations 0; rows removed 0; row retained true; Profile / Timeline / Story Seed mutation counts 0; canon/provider/API/credential/publishing effects false |
| Downstream target authorization packet | Prepare the next target-class choice without mutation | Retained Claim Ledger row inspected; Profile / Timeline / Story Seed / Canon decision proposed; Profile recommended; user authorization required=true; downstream mutations 0; Profile / Timeline / Story Seed / canon/provider/API/credential/publishing effects false |
| Profile adoption mutation one-claim | Record the authorized Profile-only mutation | 1 non-canon Profile annotation row records `claim_ledger_adopted -> profile_adopted_noncanon`; Claim Ledger additional adoption 0; Timeline / Story Seed mutation counts 0; canon/provider/API/credential/publishing effects false |
| Very broad source-span shape audit | Decide whether the remaining broad-shape fixture candidate is needed now | Broad fixture count 0; 2 current broad rows resolved by split/keep; source-pack and downstream readbacks remain clean |

## What Remains Missing

- Human freeform review of final contradictory-claim truth remains optional and is not requested by this slice.
- Human review of the Bridge Storyboard Flow is the immediate next user-side work: open `public/review/index.html?mode=bridge`, traverse all six beats, and accept, revise, or return the order and planning-time allocation. The accepted Workbench observation does not imply approval of story truth, production assets, rights, or final canon.
- Remaining workflow expansion is now post-Profile: Timeline / Story Seed / Canon decision authorization, actual rollback, broader translated memo coverage, or very broad source-span fixture shape. The held claim preflight, downstream adoption semantics design, adoption candidate ledger dry-run, sandbox adoption mutation one-claim, sandbox adoption rollback rehearsal, production adoption authorization packet, Claim Ledger one-claim production adoption, Claim Ledger rollback rehearsal, downstream target authorization packet, and Profile adoption mutation one-claim define candidate status, accepted-status meaning, rollback, mutation boundaries, a non-mutating ledger row, one fixture-only sandbox adoption row, one sandbox-only rollback rehearsal row, one production authorization packet, one Claim Ledger production adoption row, one non-destructive rollback rehearsal, one Profile-first downstream target choice surface, and one Profile-only non-canon annotation. Timeline, Story Seed, canon, provider/API/credential, publishing, additional-claim adoption, and actual production rollback remain unimplemented without separate authorization. The translated memo axis has a two-row minimum fixture, so only add more translated rows if they reduce a concrete coverage gap beyond `multi-x-object-brass-moth-key` and `multi-x-placeholder-translation-boundary`. Very broad source-span shape has been audited but not implemented because current broad rows are already resolved and no concrete source-output gap requires another fixture.
- Actual model/API extraction adapter, provider choice, credential flow, provider endpoint, transport behavior, external call permission, timeout value, and retry count remain blocked until explicit authorization.
- Durable project database, YouTube publishing, automated upload, AI video generation, complete world chronology, and final canon decisions remain out of scope.

## Review Debt

- Overall page length, lower-page density, minor Workbench readability, Context Dock minimalism, and stale-shelf excision remain non-blocking Review Debt. They do not block `fff-bridge-storyboard-flow-001` local readback.

| Target | Current state | Next move |
| --- | --- | --- |
| Bridge Storyboard Flow | `fff-bridge-storyboard-flow-001` is active; exactly six planning beats share one rail and active canvas, while old Bridge consoles/refinement/details remain preserved under one collapsed supporting-evidence section | Human reviewer accepts, revises, or returns the beat order and approximate timing; keep narration performance, assets, rights, production, and canon closed |
| Apply Decision Shell Guard Diet | Covered by `fff-apply-decision-shell-guard-diet-001`; `brief` starts with the applied Shell, model-driven choices, Dock Governor, compact safety summary, Guard drawer, non-gate whitelist, and preserved `bridge` / `layout-lab` routes | Treat as preserved source-shell and regression evidence; `OPERATOR_FIRST` is closed and the active review is the Bridge Storyboard Flow |
| Layout Lab Visual Audit | Covered by `fff-layout-lab-visual-audit-001`; the contact sheet and four screenshots show the Layout Lab, Split-pane Decision Shell, preserved `brief`, and preserved `bridge` routes | Use as source evidence only if the applied Shell needs a layout revision |
| Layout Research Decision Shell | Covered by `fff-layout-research-decision-shell-001`; `public/review/index.html?mode=layout-lab` compares four wireframes, recommends split-pane Decision Shell, shows a heuristic score matrix, and renders choices from `decisionFlowModel` | Treat as design source, not the active route |
| Low-text Decision Console | Preserved by `fff-low-text-decision-console-001`; its one route question, five choices, one Bridge action, six-step rail, and compact context pattern are now absorbed into the applied Shell | Keep as prior readback and regression evidence |
| Guided Review Flow Workspace | Preserved by `fff-guided-review-flow-workspace-001`; its guided sequence, one primary Bridge action, Decision Queue, Pinned Tray, Operations Notice, Important Folders, and Inspiration Workspace now sit below the applied Shell | Treat as stored supporting structure, not the first stop |
| Bridge Refinement Overview Ribbon | Covered by `fff-bridge-refinement-overview-ribbon-001`; the 5-item Latest Overview Report, folded legacy Brief, and non-final Bridge refinement cues remain preserved under the applied Shell | Use it as context after the route decision, not as the first stop |
| Home Cockpit Metric Linking | Covered by `fff-home-cockpit-metric-linking-001`; `public/review/index.html?mode=brief` is the no-query default and `?mode=home` aliases to it. It shows Operator Track, Workbench, Evidence Vault, Locked Lanes, and nine actionable readiness meters | Human reviewer should use Home Cockpit first, then Bridge, and only open Source Audit / Project Cockpit / Artifacts if auditing evidence or boundaries |
| Review Home Map Meters | Preserved by `fff-review-home-map-meters-001`; its seven shelf cards and shelf-meter semantics are now folded into the Home Cockpit command surface | Treat as historical shelf-map readback, not the active first stop |
| Draft-to-Video Planning Bridge | Covered by `fff-draft-to-video-planning-bridge-001`; `public/review/index.html?mode=bridge` contains the selected 3-minute mystery-lore route, non-final narration outline, text cues, shot cues, thumbnail brief, sound/mood cue, rights/asset risks, held truths, production non-goals, and reviewer decisions | Human reviewer should accept, revise, or reject the production hypothesis before any prose-finalization, asset generation, provider/API, AI video, render, upload, rights, or final-canon work |
| Draft Review Pack Stabilization | Covered by `fff-draft-review-pack-stabilization-001`; static route/mode/result/doc/guard readback passes for Designer Dashboard and Draft Review Pack; access state is `verified_present`; browser file URL screenshot was blocked by URL policy | Use this as the durability checkpoint; next human work is freeform review of the Draft Review Pack route, not another stabilization pass |
| One-story Draft Review Pack | Covered by `fff-one-story-draft-review-pack-001`; provisional default candidate `designer-content-moth-investigation-3m`, 5 draft beats, non-final opening/narration sample, 4 visual cues, 4 text cues, 3 held human-owned questions, and 4 risk cards are visible in `public/review/index.html?mode=draft` | Keep as the source draft pack for the Bridge; reopen only if the selected candidate, channel route, or held-truth policy changes |
| Designer Candidate Dashboard | Covered by `fff-designer-candidate-dashboard-001`; 3 content candidates, 3 channel strategy proposals, 5 draft spine beats, 4 review risks, and 3 held human-owned decisions are visible in `public/review/index.html?mode=designer` | Keep as preserved source dashboard for the Draft Review Pack; reopen only if the selected candidate or channel route changes |
| Contradictory memo claims | Covered by `fff-contradictory-claim-guard-001`; 2 linked claims held, 0 adopted/provisional conflict claims | Do not reopen unless fixture wording, claim-link rules, or adapter output changes |
| Malformed/missing source-span payloads | Covered by `fff-malformed-missing-span-guard-001`; invalid source evidence rejected, 0 accepted routed candidates | Keep closed unless invalid fixture behavior changes |
| Sparse bullet fixture | Covered by `fff-missing-fixture-class-probe-001`; 12 held elements, 0 failures | Do not reopen unless fixture or selector changes |
| Multilingual memo fixture | Covered by `fff-remaining-fixture-coverage-one-class-001`; 12 held elements, 4 non-ASCII source-span elements, 0 failures | Do not reopen unless fixture wording, selector, or language-boundary policy changes |
| Translated memo fixture audit | Covered by `fff-translated-memo-fixture-audit-001`; existing multilingual coverage was audited before fixture creation and the translated gap was handed to the policy boundary | Treat as historical audit context; use the minimum fixture readback for current translated-row regression |
| Translation provenance/source-span readback | Covered by `fff-translation-provenance-source-span-readback-001`; selected multilingual spans now point to held derived claims with no provider, translated fixture, downstream adoption, or canon promotion | Use this as the evidence source for any translated fixture policy check |
| Translation policy source-of-truth boundary | Covered by `fff-translation-policy-source-of-truth-boundary-001`; original memo text owns source spans, translated spans are derivative-only, inline gloss cannot create unowned claims, and derived claims stay held | A translated memo fixture can be the next fixture slice only if it follows this policy and keeps provider/API work closed |
| Minimal translated memo fixture | Covered by `fff-translated-memo-fixture-minimum-001`; 2 translated rows are derivative-only, source-span-bound, provider-free, claim-safe, and held where linked | Keep as the minimum regression target; add broader translated rows only when they add coverage value |
| Held claim adoption preflight | Covered by `fff-held-claim-adoption-preflight-001`; `multi-claim-moth-key-label` is source-backed, held, and preflight-eligible, but not adopted or canonized | Use as the gate before designing actual Profile / Claim / Timeline adoption semantics |
| Downstream adoption semantics design | Covered by `fff-downstream-adoption-semantics-design-001`; status transitions, accepted-status semantics, rollback conditions, and mutation-forbidden boundaries are defined without adoption | Use as the contract before any actual Profile / Claim / Timeline / Story Seed mutation; keep actual writes blocked until explicitly authorized |
| Adoption candidate ledger dry-run | Covered by `fff-adoption-candidate-ledger-dry-run-001`; `multi-claim-moth-key-label` is recorded as `adoption_candidate_dry_run` with source span, prior hold status, future-only targets, and zero mutations | Use as the final non-mutating readback before sandbox or production adoption implementation |
| Sandbox adoption mutation one-claim | Covered by `fff-sandbox-adoption-mutation-one-claim-001`; `multi-claim-moth-key-label` has one sandbox fixture row with rollback token and zero production/canon/provider/publishing effects | Use only as fixture mutation evidence; production adoption still requires a separate explicit authorization |
| Sandbox adoption rollback rehearsal | Covered by `fff-sandbox-adoption-rollback-rehearsal-001`; `multi-claim-moth-key-label` has one sandbox rollback rehearsal row with expected token and zero production/canon/provider/publishing effects | Use only as sandbox rollback safety evidence; production adoption or production rollback still requires separate explicit authorization |
| Production adoption authorization packet | Covered by `fff-production-adoption-authorization-packet-001`; `multi-claim-moth-key-label` has a packet-only approval surface with proposed target classes, missing user fields, and zero production/canon/provider/publishing effects | Treat as the authorization precondition that led to the Claim Ledger-only adoption readback; it still does not authorize canon or non-Claim-Ledger targets |
| Production Claim Ledger adoption one-claim | Covered by `fff-production-claim-ledger-adoption-one-claim-001`; `multi-claim-moth-key-label` has exactly one production Claim Ledger adoption row, rollback descriptor, and zero canon/Profile/Timeline/Story Seed/provider/publishing effects | Use as the Claim Ledger production readback beneath the current Profile annotation; require separate authorization for rollback, canon, Timeline, Story Seed, provider/API, publishing, or another claim |
| Production Claim Ledger rollback rehearsal | Covered by `fff-production-claim-ledger-rollback-rehearsal-001`; the existing production Claim Ledger row is inspected, its rollback descriptor is verified, actual rollback operations are 0, rows removed are 0, and the row remains retained | Use as rollback safety evidence only; require separate authorization before any actual production rollback or row removal |
| Downstream target authorization packet | Covered by `fff-downstream-target-authorization-packet-001`; the retained Claim Ledger row is inspected, Profile / Timeline / Story Seed / Canon decision target classes are proposed, Profile is recommended, and all mutation/canon/provider approvals remain false | Treat as the authorization packet that led to the Profile-only readback; require separate authorization before Timeline, Story Seed, Canon decision, provider/API, publishing, rollback, or additional-claim work |
| Profile adoption mutation one-claim | Covered by `fff-profile-adoption-mutation-one-claim-001`; `multi-claim-moth-key-label` has exactly one Profile annotation row with status `profile_adopted_noncanon`, rollback descriptor, and zero Claim Ledger additional/Timeline/Story Seed/canon/provider/publishing effects | Use as the current completed Profile-only readback; require separate authorization before Timeline, Story Seed, Canon decision, provider/API, publishing, actual rollback, or another claim |
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
public/review/index.html?mode=brief
public/review/index.html?mode=home
public/review/index.html?mode=layout-lab
public/review/index.html?mode=bridge
public/review/index.html?mode=story
public/review/index.html?mode=draft
public/review/index.html?mode=designer
public/review/index.html?mode=source
public/review/index.html?mode=project
public/review/index.html?mode=artifacts
```

## Human-Owned Decision Packet

- Toma fate remains unresolved. Next move: choose provisional fate before adopting ending-sensitive profile or timeline entries.
- Brass moth truth remains unresolved. Next move: choose first-use function or keep object/rule profiles held.
- Council motive remains unresolved. Next move: choose villainous, desperate, divided, misled, false-record, or keep motive-disclosure and stolen-time profiles held.

## Next Recommended Slice

Use review memory before asking for another review. The next non-redundant move is a bounded human readback of `public/review/index.html?mode=bridge`: accept, revise, or return the six-beat order and approximate timing, with special attention to whether the held-truth and rights notes remain legible while the active story flow stays dominant. A later implementation slice may refine narration/subtitle/visual wording only after that review; it must not infer final canon, select assets, clear rights, configure a provider, generate video, render, upload, persist to a database, or make additional adoption writes without explicit authorization.
