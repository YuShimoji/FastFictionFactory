# Artifacts

## fff-draft-review-pack-stabilization-001

- Title: Fast Fiction Factory Draft Review Pack Stabilization
- Purpose: Stabilize the already-implemented Designer Dashboard and One-story Draft Review Pack with durable static access/readback evidence and git-ready product state, without adding provider/API/video/publishing/final-canon behavior.
- Repo relative path: `public/review/index.html`
- Mode routes: `public/review/index.html?mode=designer`, `public/review/index.html?mode=draft`
- Review doc: `docs/review/draft-review-pack-stabilization.md`
- Readback result: `artifacts/draft-review-pack-stabilization-result.json`
- Source artifacts: `fff-designer-candidate-dashboard-001`, `fff-one-story-draft-review-pack-001`
- Access state: `verified_present`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Stabilization checkpoint only; preserves Designer Dashboard, Draft Review Pack, and `fff-contradictory-claim-guard-001`; browser file URL capture was blocked by browser URL policy, so static access/readback evidence is the durable visual/access proof.

## fff-one-story-draft-review-pack-001

- Title: Fast Fiction Factory One-story Draft Review Pack
- Purpose: Add a local one-story draft review surface for one provisional story/video candidate, including source cue, logline, channel route, draft beats, non-final opening/narration, visual cues, subtitle/on-screen text cues, human-owned questions, risk cards, and reviewer decisions without external calls, provider setup, public upload, AI video generation, production render, or final canon decisions.
- Repo relative path: `public/review/index.html`
- Mode route: `public/review/index.html?mode=draft`
- Source dashboard: `fff-designer-candidate-dashboard-001`
- Review doc: `docs/review/one-story-draft-review-pack.md`
- Readback result: `artifacts/one-story-draft-review-pack-result.json`
- State validator: `tools/fff-state.mjs`
- Validation command: `node tools/fff-state.mjs smoke-one-story-draft-review-pack artifacts/one-story-draft-review-pack-result.json artifacts/one-story-draft-review-pack-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Active review surface; selection is `provisional_default`, preserves `fff-designer-candidate-dashboard-001` and `fff-contradictory-claim-guard-001`, no provider/API/credential/publishing/production/canon boundary is opened.

## fff-designer-candidate-dashboard-001

- Title: Fast Fiction Factory Designer Candidate Dashboard
- Purpose: Add a local Designer Dashboard for one-story content candidates, channel strategy proposals, draft spine beats, and review risks without external calls, provider setup, public upload, AI video generation, production render, or final canon decisions.
- Repo relative path: `public/review/index.html`
- Mode route: `public/review/index.html?mode=designer`
- Review doc: `docs/review/designer-candidate-dashboard.md`
- Readback result: `artifacts/designer-candidate-dashboard-result.json`
- State validator: `tools/fff-state.mjs`
- Validation command: `node tools/fff-state.mjs smoke-designer-candidate-dashboard artifacts/designer-candidate-dashboard-result.json artifacts/designer-candidate-dashboard-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Active review surface; preserves `fff-contradictory-claim-guard-001`, no provider/API/credential/publishing/production/canon boundary is opened.

## fff-route-lock-clean-state-readback-001

- Title: Fast Fiction Factory Route Lock Clean State Readback
- Purpose: Record the 2026-06-29 cleanup that removed untracked ClipPipeGen-derived prompt residue from this repo and verified no tracked Fast Fiction Factory contamination.
- Repo relative path: `docs/review/route-lock-clean-state-readback.md`
- Current status: `docs/review/current-status.md`
- Next-terminal handoff: `docs/review/next-terminal-handoff.md`
- Review status: `route_clean`

## fff-translation-provenance-source-span-readback-001

- Title: Fast Fiction Factory Translation Provenance Source-Span Readback
- Purpose: Record selected multilingual source-span to held derived-claim provenance before any translated fixture, translation policy, provider/API behavior, downstream adoption, or canon decision exists.
- Repo relative path: `docs/review/translation-provenance-source-span-readback.md`
- Readback result: `artifacts/translation-provenance-source-span-readback-result.json`
- Source fixture: `artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md`
- Source output: `artifacts/extraction-adapter-outputs/multilingual-memo-notes.json`
- Validation command: `node tools/fff-state.mjs smoke-translation-provenance-source-span-readback artifacts/extraction-adapter-outputs/multilingual-memo-notes.json artifacts/translation-provenance-source-span-readback-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary readback under `fff-contradictory-claim-guard-001`; no translated fixture or provider/API boundary is added.

## fff-translation-policy-source-of-truth-boundary-001

- Title: Fast Fiction Factory Translation Policy Source-of-Truth Boundary
- Purpose: Define source-of-truth language, original span ownership, derivative translation ownership, inline gloss boundary, claim promotion rule, contradiction expectation, translated fixture allowance, and provider-adapter block before translated fixture or provider work.
- Repo relative path: `docs/review/translation-policy-source-of-truth-boundary.md`
- Readback result: `artifacts/translation-policy-source-of-truth-boundary-result.json`
- Input readback: `artifacts/translation-provenance-source-span-readback-result.json`
- Validation command: `node tools/fff-state.mjs smoke-translation-policy-source-of-truth-boundary artifacts/translation-provenance-source-span-readback-result.json artifacts/translation-policy-source-of-truth-boundary-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary boundary under `fff-contradictory-claim-guard-001`; no translated fixture, provider/API call, credential, downstream adoption, or canon promotion is added.

## fff-translated-memo-fixture-minimum-001

- Title: Fast Fiction Factory Minimal Translated Memo Fixture
- Purpose: Add the smallest translated memo fixture that follows the source-of-truth boundary: original multilingual memo spans remain evidence owners, translated rows are derivative/provenance-bound, one linked derived claim stays held, and the inline gloss row creates no claim.
- Repo relative path: `docs/review/translated-memo-fixture-minimum.md`
- Fixture: `artifacts/translated-memo-fixture-minimum.json`
- Readback result: `artifacts/translated-memo-fixture-minimum-result.json`
- Source fixture: `artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md`
- Source output: `artifacts/extraction-adapter-outputs/multilingual-memo-notes.json`
- Validation command: `node tools/fff-state.mjs smoke-translated-memo-fixture-minimum artifacts/translated-memo-fixture-minimum.json artifacts/translated-memo-fixture-minimum-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary fixture under `fff-contradictory-claim-guard-001`; 2 translated rows, 0 original span mismatches, 0 translation-to-claim leaks, 1 held linked claim, 0 auto-promotions, 0 inline gloss claim leaks, and no provider/API call, credential, downstream adoption, or canon promotion.

## fff-held-claim-adoption-preflight-001

- Title: Fast Fiction Factory Held Claim Adoption Preflight
- Purpose: Inspect the held linked claim from the minimal translated memo fixture as a source-backed preflight candidate before any downstream Profile / Claim / Timeline adoption behavior, canon promotion, provider/API call, credential, or production route exists.
- Repo relative path: `docs/review/held-claim-adoption-preflight.md`
- Readback result: `artifacts/held-claim-adoption-preflight-result.json`
- Input readback: `artifacts/translated-memo-fixture-minimum-result.json`
- Source output: `artifacts/extraction-adapter-outputs/multilingual-memo-notes.json`
- Validation command: `node tools/fff-state.mjs smoke-held-claim-adoption-preflight artifacts/translated-memo-fixture-minimum-result.json artifacts/held-claim-adoption-preflight-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary preflight under `fff-contradictory-claim-guard-001`; 1 held claim inspected, 1 source-backed claim, 1 preflight-only eligible candidate, 0 adopted claims, 0 canonized claims, 0 translation/gloss leaks, and no provider/API call, credential, downstream adoption, or canon promotion.

## fff-downstream-adoption-semantics-design-001

- Title: Fast Fiction Factory Downstream Adoption Semantics Design
- Purpose: Define status transitions, accepted-status meaning, rollback conditions, mutation-forbidden boundaries, and candidate holding rules for the held preflight claim without implementing adoption.
- Repo relative path: `docs/review/downstream-adoption-semantics-design.md`
- Readback result: `artifacts/downstream-adoption-semantics-design-result.json`
- Input readback: `artifacts/held-claim-adoption-preflight-result.json`
- Validation command: `node tools/fff-state.mjs smoke-downstream-adoption-semantics-design artifacts/held-claim-adoption-preflight-result.json artifacts/downstream-adoption-semantics-design-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary design under `fff-contradictory-claim-guard-001`; 1 preflight candidate has design-only semantics, accepted status is defined but unreachable now, 10 rollback conditions are documented, 4 mutation targets are blocked, and no Profile / Claim / Timeline / Story Seed mutation, provider/API call, credential, adoption, or canon promotion is added.

## fff-adoption-candidate-ledger-dry-run-001

- Title: Fast Fiction Factory Adoption Candidate Ledger Dry-Run
- Purpose: Record the held preflight claim as a non-mutating adoption-candidate ledger dry-run row before any real downstream adoption, canonization, or Profile / Claim / Timeline / Story Seed mutation exists.
- Repo relative path: `docs/review/adoption-candidate-ledger-dry-run.md`
- Readback result: `artifacts/adoption-candidate-ledger-dry-run-result.json`
- Input readback: `artifacts/downstream-adoption-semantics-design-result.json`
- Validation command: `node tools/fff-state.mjs smoke-adoption-candidate-ledger-dry-run artifacts/downstream-adoption-semantics-design-result.json artifacts/adoption-candidate-ledger-dry-run-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary dry-run under `fff-contradictory-claim-guard-001`; 1 source-backed held candidate is recorded as `adoption_candidate_dry_run`, with 0 adopted claims, 0 canonized claims, 0 Profile / Claim / Timeline / Story Seed mutations, and no provider/API call, credential, publishing, or production generation.

## fff-sandbox-adoption-mutation-one-claim-001

- Title: Fast Fiction Factory Sandbox Adoption Mutation One Claim
- Purpose: Record the user-authorized sandbox / fixture adoption of exactly `multi-claim-moth-key-label` without production adoption, canonization, provider/API work, publishing, or production generation.
- Repo relative path: `docs/review/sandbox-adoption-mutation-one-claim.md`
- Readback result: `artifacts/sandbox-adoption-mutation-one-claim-result.json`
- Input readback: `artifacts/adoption-candidate-ledger-dry-run-result.json`
- Validation command: `node tools/fff-state.mjs smoke-sandbox-adoption-mutation-one-claim artifacts/adoption-candidate-ledger-dry-run-result.json artifacts/sandbox-adoption-mutation-one-claim-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary sandbox fixture mutation under `fff-contradictory-claim-guard-001`; 1 sandbox row moves from `adoption_candidate_dry_run` to `sandbox_adopted_fixture`, rollback token is recorded, and production adopted claims, canonized claims, Profile / Claim / Timeline / Story Seed production mutations, provider/API calls, credentials, publishing, and production generation remain zero or false.

## fff-sandbox-adoption-rollback-rehearsal-001

- Title: Fast Fiction Factory Sandbox Adoption Rollback Rehearsal
- Purpose: Rehearse rollback of the previously sandbox-adopted fixture row for exactly `multi-claim-moth-key-label` without production rollback, production adoption, canonization, provider/API work, publishing, or production generation.
- Repo relative path: `docs/review/sandbox-adoption-rollback-rehearsal.md`
- Readback result: `artifacts/sandbox-adoption-rollback-rehearsal-result.json`
- Input readback: `artifacts/sandbox-adoption-mutation-one-claim-result.json`
- Validation command: `node tools/fff-state.mjs smoke-sandbox-adoption-rollback-rehearsal artifacts/sandbox-adoption-mutation-one-claim-result.json artifacts/sandbox-adoption-rollback-rehearsal-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary sandbox rollback rehearsal under `fff-contradictory-claim-guard-001`; 1 sandbox-adopted row is inspected, the expected rollback token is verified, 1 rehearsal row records `sandbox_adopted_fixture -> adoption_candidate_dry_run`, and production adopted claims, canonized claims, Profile / Claim / Timeline / Story Seed production mutations, provider/API calls, credentials, publishing, and production generation remain zero or false.

## fff-production-adoption-authorization-packet-001

- Title: Fast Fiction Factory Production Adoption Authorization Packet
- Purpose: Prepare a freeform authorization packet for possible future production adoption of exactly `multi-claim-moth-key-label` without approving or performing production adoption, production rollback, canonization, provider/API work, publishing, or production generation.
- Repo relative path: `docs/review/production-adoption-authorization-packet.md`
- Readback result: `artifacts/production-adoption-authorization-packet-result.json`
- Input readback: `artifacts/sandbox-adoption-rollback-rehearsal-result.json`
- Validation command: `node tools/fff-state.mjs smoke-production-adoption-authorization-packet artifacts/sandbox-adoption-rollback-rehearsal-result.json artifacts/production-adoption-authorization-packet-result.json`
- Review status: `ready_for_user_authorization`
- Review input mode: `freeform`
- State: Preserved auxiliary authorization packet under `fff-contradictory-claim-guard-001`; 1 rollback-rehearsed candidate is presented, Profile / Claim Ledger / Timeline / Story Seed target classes are proposed, Claim Ledger is recommended as the first target, user authorization remains required, production mutations remain 0, canonized claims remain 0, and provider/API calls, credentials, publishing, and production generation remain false.

## fff-production-claim-ledger-adoption-one-claim-001

- Title: Fast Fiction Factory Production Claim Ledger Adoption One Claim
- Purpose: Record the user-authorized production adoption of exactly `multi-claim-moth-key-label` into the Claim Ledger while keeping canon, Profile, Timeline, Story Seed, provider/API, credential, publishing, and production generation boundaries closed.
- Repo relative path: `docs/review/production-claim-ledger-adoption-one-claim.md`
- Readback result: `artifacts/production-claim-ledger-adoption-one-claim-result.json`
- Input readback: `artifacts/production-adoption-authorization-packet-result.json`
- Validation command: `node tools/fff-state.mjs smoke-production-claim-ledger-adoption-one-claim artifacts/production-adoption-authorization-packet-result.json artifacts/production-claim-ledger-adoption-one-claim-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary Claim Ledger adoption readback under `fff-contradictory-claim-guard-001`; 1 Claim Ledger production adoption row is recorded, `multi-claim-moth-key-label` moves from `adoption_candidate_dry_run` to `production_claim_ledger_adopted`, rollback descriptor is recorded, Profile / Timeline / Story Seed mutations remain 0, canonized claims remain 0, and provider/API calls, credentials, publishing, and production generation remain false.

## fff-production-claim-ledger-rollback-rehearsal-001

- Title: Fast Fiction Factory Production Claim Ledger Rollback Rehearsal
- Purpose: Rehearse the rollback descriptor for the existing production Claim Ledger adoption row for exactly `multi-claim-moth-key-label` without performing rollback or removing the row.
- Repo relative path: `docs/review/production-claim-ledger-rollback-rehearsal.md`
- Readback result: `artifacts/production-claim-ledger-rollback-rehearsal-result.json`
- Input readback: `artifacts/production-claim-ledger-adoption-one-claim-result.json`
- Validation command: `node tools/fff-state.mjs smoke-production-claim-ledger-rollback-rehearsal artifacts/production-claim-ledger-adoption-one-claim-result.json artifacts/production-claim-ledger-rollback-rehearsal-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary rollback rehearsal under `fff-contradictory-claim-guard-001`; 1 production Claim Ledger adoption row is inspected, the expected rollback descriptor is verified, 1 non-destructive rehearsal row is recorded, actual rollback operations remain 0, the production Claim Ledger row remains retained, Profile / Timeline / Story Seed mutations remain 0, canonized claims remain 0, and provider/API calls, credentials, publishing, and production generation remain false.

## fff-downstream-target-authorization-packet-001

- Title: Fast Fiction Factory Downstream Target Authorization Packet
- Purpose: Prepare the next downstream target-class authorization choice after production Claim Ledger adoption and rollback rehearsal for exactly `multi-claim-moth-key-label`, without mutating Profile, Timeline, Story Seed, Canon decision, provider, credential, publishing, or production generation surfaces.
- Repo relative path: `docs/review/downstream-target-authorization-packet.md`
- Readback result: `artifacts/downstream-target-authorization-packet-result.json`
- Input readback: `artifacts/production-claim-ledger-rollback-rehearsal-result.json`
- Validation command: `node tools/fff-state.mjs smoke-downstream-target-authorization-packet artifacts/production-claim-ledger-rollback-rehearsal-result.json artifacts/downstream-target-authorization-packet-result.json`
- Review status: `ready_for_user_authorization`
- Review input mode: `freeform`
- State: Preserved auxiliary downstream target authorization packet under `fff-contradictory-claim-guard-001`; 1 retained production Claim Ledger row is inspected, 4 downstream target classes are proposed, Profile is the only recommended next target, user authorization remains required, downstream mutations remain 0, Profile / Timeline / Story Seed mutation counts remain 0, canonized claims remain 0, and provider/API calls, credentials, publishing, and production generation remain false.

## fff-profile-adoption-mutation-one-claim-001

- Title: Fast Fiction Factory Profile Adoption Mutation One Claim
- Purpose: Record the user-authorized Profile-only production mutation for exactly `multi-claim-moth-key-label` as one non-canon Profile annotation while preserving the retained Claim Ledger row and all non-Profile boundaries.
- Repo relative path: `docs/review/profile-adoption-mutation-one-claim.md`
- Readback result: `artifacts/profile-adoption-mutation-one-claim-result.json`
- Input readback: `artifacts/downstream-target-authorization-packet-result.json`
- Validation command: `node tools/fff-state.mjs smoke-profile-adoption-mutation-one-claim artifacts/downstream-target-authorization-packet-result.json artifacts/profile-adoption-mutation-one-claim-result.json`
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary Profile adoption readback under `fff-contradictory-claim-guard-001`; 1 Profile mutation row records `claim_ledger_adopted -> profile_adopted_noncanon`, rollback descriptor is recorded, Claim Ledger additional adoption count remains 0, Timeline / Story Seed mutation counts remain 0, canonized claims remain 0, and provider/API calls, credentials, publishing, and production generation remain false.

## fff-mvp-skeleton-001

- Title: Fast Fiction Factory MVP Skeleton Review Workbench
- Purpose: Local review of memo intake, structured candidates, review states, task cards, outlines, and QA gates.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Screenshot: `artifacts/fff-mvp-skeleton-review.png`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`

## fff-mvp-export-import-001

- Title: Fast Fiction Factory JSON Export Import Review Workbench
- Purpose: Portable local review of memo, candidates, review statuses, unresolved creative decisions, QA gates, generated outlines, and decision log.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Sample state: `artifacts/sample-project-state.json`
- Smoke result: `artifacts/export-import-smoke-result.json`
- Review doc: `docs/review/json-export-import-review.md`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`

## fff-visual-review-hub-001

- Title: Fast Fiction Factory Visual Review Hub
- Purpose: One local review entry point for current MVP status, artifact inventory, local inspection steps, export/import testing, unresolved creative decisions, QA gates, missing features, and next slice.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Current status: `docs/review/current-status.md`
- Review doc: `docs/review/visual-review-hub-review.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Smoke result: `artifacts/visual-review-smoke-result.json`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`

## fff-local-persistence-ergonomics-001

- Title: Fast Fiction Factory Local Persistence And Review Ergonomics Workbench
- Purpose: Extend the Visual Review Hub with explicit local file save/load, JSON fallback import/export, repo-local state validation commands, candidate status filters, search, collapse/expand controls, updated state artifacts, smoke evidence, and refreshed visual review images.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Current state: `artifacts/current-project-state.json`
- State adapter: `tools/fff-state.mjs`
- File persistence smoke result: `artifacts/file-persistence-smoke-result.json`
- Review ergonomics smoke result: `artifacts/review-ergonomics-smoke-result.json`
- Current status: `docs/review/current-status.md`
- Persistence review doc: `docs/review/file-persistence-review.md`
- Ergonomics review doc: `docs/review/review-ergonomics-review.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`

## fff-claim-ledger-001

- Title: Fast Fiction Factory Claim Ledger Workbench
- Purpose: Extend the Visual Review Hub with a reviewable Claim Ledger for source, truth status, reality/reference status, canon risk, unresolved dependencies, viewer disclosure, spoiler protection, and claim review decisions.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Current state: `artifacts/current-project-state.json`
- State adapter: `tools/fff-state.mjs`
- Claim Ledger smoke result: `artifacts/claim-ledger-smoke-result.json`
- Current status: `docs/review/current-status.md`
- Claim Ledger review doc: `docs/review/claim-ledger-review.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`

## fff-local-docs-view-001

- Title: Fast Fiction Factory Local Markdown Docs View
- Purpose: Provide a local MkDocs Material tree view for reading, auditing, browser-assisted translation checks, project overview, screenshot locations, and turn-count-based development planning without translating or rewriting source specifications.
- Repo relative path: `mkdocs.yml`
- Entry page: `docs/index.md`
- Project overview map: `docs/project-overview.md`
- External Markdown wrappers: `docs/local-view/`
- Nav candidate generator: `tools/generate-doc-nav.mjs`
- Open command: `python -m mkdocs serve -a 127.0.0.1:8000`
- Alternate open command when port 8000 is busy: `python -m mkdocs serve -a 127.0.0.1:8001`
- Review status: `ready_for_local_review`

## fff-timeline-view-001

- Title: Fast Fiction Factory Timeline View Workbench
- Purpose: Extend the Visual Review Hub with v1.3 operating contract visibility and a reviewable multi-axis Timeline View for story order, calendar time, viewer disclosure order, production order, historical/reference order, Claim Ledger linkage, unresolved dependencies, spoiler protection, and timeline review decisions.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Current state: `artifacts/current-project-state.json`
- State adapter: `tools/fff-state.mjs`
- Timeline smoke result: `artifacts/timeline-smoke-result.json`
- v1.3 compliance smoke result: `artifacts/v1-3-compliance-smoke-result.json`
- Current status: `docs/review/current-status.md`
- Timeline review doc: `docs/review/timeline-view-review.md`
- v1.3 compliance review doc: `docs/review/v1-3-compliance-review.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`

## fff-profile-ghost-flow-001

- Title: Fast Fiction Factory Profile/Ghost Flow Workbench
- Purpose: Extend the Visual Review Hub with profile pages and ghost node flow for people, places, organizations, events, objects, concepts, documents, visual assets, and placeholders while preserving Claim Ledger, Timeline View, local persistence, import/export, and human-owned canon boundaries.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Current state: `artifacts/current-project-state.json`
- State adapter: `tools/fff-state.mjs`
- Checkpoint readback: `artifacts/checkpoint-readback-result.json`
- Profile/Ghost smoke result: `artifacts/profile-ghost-smoke-result.json`
- Current status: `docs/review/current-status.md`
- Profile/Ghost review doc: `docs/review/profile-ghost-flow-review.md`
- Checkpoint readback doc: `docs/review/checkpoint-readback.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`

## fff-extraction-contract-001

- Title: Fast Fiction Factory Extraction Contract Workbench
- Purpose: Extend the Visual Review Hub with a local-first extraction contract for source refs, extracted elements, profile/claim/timeline candidate routing, unresolved dependencies, review-safe defaults, warnings, freeform review intake, and human authority boundaries before any model/API extractor exists.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local launcher: `scripts/operator/open_review.ps1`
- Current state: `artifacts/current-project-state.json`
- Sample state: `artifacts/sample-project-state.json`
- Sample extraction payload: `artifacts/sample-extraction-payload.json`
- State adapter: `tools/fff-state.mjs`
- Extraction Contract smoke result: `artifacts/extraction-contract-smoke-result.json`
- Freeform review intake smoke result: `artifacts/freeform-review-intake-smoke-result.json`
- Current status: `docs/review/current-status.md`
- Extraction Contract review doc: `docs/review/extraction-contract-review.md`
- Freeform Review Intake doc: `docs/review/freeform-review-intake.md`
- Next-terminal handoff: `docs/review/next-terminal-handoff.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Review status: `ready_for_local_review`
- Review input mode: `freeform`

## fff-extraction-validator-hardening-001

- Title: Fast Fiction Factory Extraction Validator Hardening
- Purpose: Harden the local Extraction Contract with seven valid/invalid fixture payloads, built-in guard checks, and stricter zero-dependency validation before any adapter, model/API behavior, database persistence, publishing adapter, AI video generation, production sync, or final canon decision exists.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local launcher: `scripts/operator/open_review.ps1`
- Preserved contract artifact: `fff-extraction-contract-001`
- Fixture directory: `artifacts/extraction-negative-fixtures/`
- Fixture files: `valid-minimal.json`, `missing-source-refs.json`, `overconfident-human-owned-decision.json`, `invalid-routing-visual-asset-to-claim.json`, `auto-canon-leak.json`, `missing-review-safe-defaults.json`, `unknown-fields-preservation.json`
- Validator smoke result: `artifacts/extraction-validator-smoke-result.json`
- State adapter: `tools/fff-state.mjs`
- Review doc: `docs/review/extraction-validator-hardening-review.md`
- Current status: `docs/review/current-status.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Validation command: `node tools/fff-state.mjs smoke-extraction-fixtures artifacts/extraction-negative-fixtures artifacts/extraction-validator-smoke-result.json`
- Validation result: expected-valid fixtures passed, expected-invalid fixtures failed for intended reasons, including the malformed/missing source-span guard fixture and the contradictory-claim hold fixture; built-in guard checks passed for missing identity fields, invalid element type, missing human authority boundaries, and missing high-risk warnings; unknown-field preservation warnings were reported. Current validator matrix contains 9 fixtures: 3 expected valid and 6 expected invalid.
- Review status: `ready_for_local_review`
- Review input mode: `freeform`
- Next action: Preserve this validator matrix as the gate for adapter expansion and any future model/API adapter.

## fff-local-extraction-adapter-spike-001

- Title: Fast Fiction Factory Local Extraction Adapter Spike
- Purpose: Convert a sample raw memo into a local Extraction Contract payload with deterministic zero-dependency rules, then validate the payload through the existing Extraction Contract validator and fixture matrix before any model/API extraction behavior exists.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local launcher: `scripts/operator/open_review.ps1`
- Preserved validator artifact: `fff-extraction-validator-hardening-001`
- Preserved contract artifact: `fff-extraction-contract-001`
- Sample raw memo: `artifacts/sample-raw-memo.md`
- Adapter tool: `tools/fff-extract-local.mjs`
- Adapter output: `artifacts/local-extraction-adapter-output.json`
- Adapter smoke result: `artifacts/local-extraction-adapter-smoke-result.json`
- Validator fixtures: `artifacts/extraction-negative-fixtures/`
- State adapter: `tools/fff-state.mjs`
- Review doc: `docs/review/local-extraction-adapter-review.md`
- Current status: `docs/review/current-status.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Validation command: `node tools/fff-extract-local.mjs artifacts/sample-raw-memo.md artifacts/local-extraction-adapter-output.json artifacts/local-extraction-adapter-smoke-result.json`
- Validation result: deterministic adapter output validated as `fff.extractionContract.v1`; output contains 12 extracted elements covering all required element types, 9 profile candidates, 7 claim candidates, 5 timeline candidates, 3 unresolved human-owned dependencies, review-safe defaults, and source refs; fixture matrix remained passing.
- Review status: `ready_for_local_review`
- Review input mode: `freeform`
- State: Preserved by `fff-local-extraction-adapter-expansion-001`.
- Next action: Use the expansion artifact for current adapter review.

## fff-local-extraction-adapter-expansion-001

- Title: Fast Fiction Factory Local Extraction Adapter Expansion
- Purpose: Expand deterministic local raw memo extraction across multiple fixtures, generate one Extraction Contract payload per fixture, validate every output, and audit source spans, source refs, review-safe defaults, visual-asset routing, freeform review, and human-owned decision guards before any model/API extraction behavior exists.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local launcher: `scripts/operator/open_review.ps1`
- Preserved adapter artifact: `fff-local-extraction-adapter-spike-001`
- Preserved validator artifact: `fff-extraction-validator-hardening-001`
- Preserved contract artifact: `fff-extraction-contract-001`
- Sample raw memo: `artifacts/sample-raw-memo.md`
- Adapter fixture memos: `artifacts/extraction-adapter-fixtures/`
- Adapter fixture outputs: `artifacts/extraction-adapter-outputs/`
- Adapter tool: `tools/fff-extract-local.mjs`
- Adapter output: `artifacts/local-extraction-adapter-output.json`
- Adapter smoke result: `artifacts/local-extraction-adapter-smoke-result.json`
- Adapter expansion smoke result: `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Validator fixtures: `artifacts/extraction-negative-fixtures/`
- State adapter: `tools/fff-state.mjs`
- Review doc: `docs/review/local-extraction-adapter-expansion-review.md`
- Current status: `docs/review/current-status.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Validation command: `node tools/fff-extract-local.mjs --matrix artifacts/extraction-adapter-fixtures artifacts/extraction-adapter-outputs artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Validation result: deterministic adapter output now validates as `fff.extractionContract.v1` for five fixture memos after `fff-remaining-fixture-coverage-one-class-001`; output matrix contains 60 extracted elements, complete required element-type coverage, 44 profile candidates, 34 claim candidates, 20 timeline candidates, 0 source-span mismatches, 0 missing source refs, 0 unsafe visual-asset routing cases, 0 non-held review defaults, and 0 human-owned decision adopt suggestions; fixture matrix remains passing.
- Review status: `ready_for_local_review`
- Review input mode: `freeform`
- State: Preserved by `fff-source-span-routing-review-pack-001`.
- Next action: Use the source-span routing review pack before revising fixture spans/routing or placing any model/API adapter behind the same validator boundary.

## fff-model-api-boundary-spec-001

- Title: Fast Fiction Factory Model/API Boundary Specification
- Purpose: Define a local-first boundary for future model/API extraction output before any external provider call, credential setup, adapter implementation, database persistence, publishing adapter, AI video generation, production sync, or final canon decision exists.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local launcher: `scripts/operator/open_review.ps1`
- Preserved local adapter expansion artifact: `fff-local-extraction-adapter-expansion-001`
- Preserved adapter artifact: `fff-local-extraction-adapter-spike-001`
- Preserved validator artifact: `fff-extraction-validator-hardening-001`
- Preserved contract artifact: `fff-extraction-contract-001`
- Boundary spec doc: `docs/review/model-api-boundary-spec.md`
- Boundary envelope example: `artifacts/model-api-boundary-envelope.example.json`
- Boundary smoke result: `artifacts/model-api-boundary-smoke-result.json`
- Adapter fixture memos: `artifacts/extraction-adapter-fixtures/`
- Adapter fixture outputs: `artifacts/extraction-adapter-outputs/`
- Adapter expansion smoke result: `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Validator fixtures: `artifacts/extraction-negative-fixtures/`
- State adapter: `tools/fff-state.mjs`
- Review doc: `docs/review/model-api-boundary-spec.md`
- Current status: `docs/review/current-status.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Validation command: parse `artifacts/model-api-boundary-envelope.example.json`, parse `artifacts/model-api-boundary-smoke-result.json`, run current/sample state validation, validate sample and generated Extraction Contract payloads, run validator fixture matrix, run deterministic adapter matrix, and check Review Hub text plus screenshot/contact-sheet existence.
- Validation result: boundary envelope parsed; boundary smoke passed; no model/API call, credentials, provider endpoint, direct state mutation, database persistence, publishing, production sync, AI video generation, or final canon decision added; adapter expansion and validator gates remained passing.
- Review status: `ready_for_local_review`
- Review input mode: `freeform`
- State: Preserved by `fff-source-span-routing-review-pack-001`.
- Next action: Use the source-span routing review pack before choosing a no-network mock provider or explicitly configured provider adapter behind the same validation gates.

## fff-source-span-routing-review-pack-001

- Title: Fast Fiction Factory Source-Span Routing Review Pack
- Purpose: Turn the deterministic adapter fixture outputs into a compact human supervision pack for source spans, source refs, routing targets, held defaults, confidence/default status, human-owned guards, risk flags, review notes, and review debt before freeform review or model/API behavior.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local launcher: `scripts/operator/open_review.ps1`
- Pack artifact: `artifacts/source-span-routing-review-pack.json`
- Pack generator: `tools/fff-source-span-review-pack.mjs`
- Review doc: `docs/review/source-span-routing-review-pack.md`
- Dirty-work triage result: `artifacts/source-span-routing-triage-result.json`
- Dirty-work triage doc: `docs/review/source-span-routing-triage.md`
- Preserved adapter expansion artifact: `fff-local-extraction-adapter-expansion-001`
- Preserved adapter artifact: `fff-local-extraction-adapter-spike-001`
- Preserved validator artifact: `fff-extraction-validator-hardening-001`
- Preserved contract artifact: `fff-extraction-contract-001`
- Adapter fixture memos: `artifacts/extraction-adapter-fixtures/`
- Adapter fixture outputs: `artifacts/extraction-adapter-outputs/`
- Adapter expansion smoke result: `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Validator fixtures: `artifacts/extraction-negative-fixtures/`
- State adapter: `tools/fff-state.mjs`
- Current status: `docs/review/current-status.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Validation command: `node tools/fff-source-span-review-pack.mjs artifacts/extraction-adapter-fixtures artifacts/extraction-adapter-outputs artifacts/local-extraction-adapter-expansion-smoke-result.json artifacts/source-span-routing-review-pack.json`
- Validation result: source-span review pack generated from five fixture outputs after `fff-remaining-fixture-coverage-one-class-001`; pack records 60 extracted elements, 44 profile candidates, 34 claim candidates, 20 timeline candidates, 0 source-span mismatches, 0 missing source refs, 0 unsafe visual routing cases, 0 non-held review defaults, 0 human-owned decision adopt suggestions, 28 human-owned guarded elements, and remaining fixture-class gaps excluding sparse bullet-only notes and multilingual memo text.
- Review status: `ready_for_local_review`
- Review input mode: `freeform`
- Next action: Review the pack in the Visual Review Hub or `artifacts/source-span-routing-review-pack.json`, then decide whether to revise deterministic spans/routing or add new edge fixtures before model/API adapter work.

## fff-source-span-routing-triage-001

- Title: Fast Fiction Factory Source-Span Routing Dirty-Work Triage
- Purpose: Classify every dirty or untracked source-span routing file after `fff-model-api-boundary-spec-001` and decide whether a separate source-span checkpoint is safe.
- Triage result: `artifacts/source-span-routing-triage-result.json`
- Triage doc: `docs/review/source-span-routing-triage.md`
- Related active artifact: `fff-source-span-routing-review-pack-001`
- Preserved model/API boundary artifact: `fff-model-api-boundary-spec-001`
- Validation result: all dirty/untracked files classified as `source_span_routing_intentional`; model boundary residue, generated temp, unrelated dirty work, and unknown-needs-decision buckets are empty; manifest validation, MkDocs strict, Playwright browser smoke, and git diff whitespace checks passed.
- Review status: `ready_for_local_review`
- Review input mode: `freeform`
- Next action: Use the source-span review pack for human freeform review, then revise only concrete span/routing issues or fixture classes identified by review.

## fff-review-hub-ia-mode-split-001

- Title: Fast Fiction Factory Review Hub IA Mode Split
- Purpose: Split the local Review Hub into Story Review, Source Audit, Project Cockpit, and Artifacts modes; add Japanese-facing display labels; remove awkward sticky Raw Story Memo behavior; and reduce first-load vertical overload while preserving source-span and model/API boundary evidence.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local launcher: `scripts/operator/open_review.ps1`
- Review doc: `docs/review/review-hub-ia-mode-split.md`
- Smoke result: `artifacts/review-hub-ia-mode-split-smoke-result.json`
- Preserved source-span artifact: `fff-source-span-routing-review-pack-001`
- Preserved source-span pack: `artifacts/source-span-routing-review-pack.json`
- Preserved model/API boundary artifact: `fff-model-api-boundary-spec-001`
- Preserved model/API boundary spec: `docs/review/model-api-boundary-spec.md`
- Current status: `docs/review/current-status.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Manifest: `artifacts/artifact-manifest.json`
- Validation command: run the active manifest validation command, Review Hub static smoke, MkDocs strict build, and `git diff --check`.
- Validation result: manifest validation command passed; Review Hub IA static smoke passed; Story Review, Source Audit, Project Cockpit, and Artifacts labels are visible with Japanese display labels; Raw Story Memo sticky positioning was removed; source-span fixture details are collapsed by default; source-span pack remains reachable and passed with 0 guard failures; model/API boundary text remains present with `externalCallAllowed: false`; state, extraction payload, and extraction fixture validation passed.
- Review status: `ready_for_local_review`
- Review input mode: `freeform`
- Next action: Review whether the four modes, Japanese labels, collapsed source audit details, and non-sticky Raw Story Memo panel reduce daily review friction while keeping source-span evidence reachable.

## fff-review-procedure-lock-001

- Title: Fast Fiction Factory Review Procedure Lock
- Purpose: Lock the local review procedure, screenshot/contact-sheet evidence map, mode-specific screenshot paths, optional-vs-required review boundary, freeform review intake guidance, and identity/access split before model/API implementation work.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review procedure: `docs/review/review-procedure.md`
- Smoke result: `artifacts/review-procedure-lock-smoke-result.json`
- Preserved Review Hub IA artifact: `fff-review-hub-ia-mode-split-001`
- Preserved source-span artifact: `fff-source-span-routing-review-pack-001`
- Preserved source-span pack: `artifacts/source-span-routing-review-pack.json`
- Preserved model/API boundary artifact: `fff-model-api-boundary-spec-001`
- Preserved model/API boundary spec: `docs/review/model-api-boundary-spec.md`
- Current status: `docs/review/current-status.md`
- Screenshot: `artifacts/fff-current-review-screenshot.png`
- Contact sheet: `artifacts/fff-review-contact-sheet.png`
- Mode screenshots:
  - `artifacts/review-screens/story-review.png`
  - `artifacts/review-screens/source-audit.png`
  - `artifacts/review-screens/project-cockpit.png`
  - `artifacts/review-screens/artifacts-validation.png`
- Manifest: `artifacts/artifact-manifest.json`
- Validation command: run the active manifest validation command, Review Hub procedure static smoke, screenshot non-empty checks, MkDocs strict build, and `git diff --check`.
- Validation result: passed 2026-06-22T13:26:45+09:00; manifest validation command passed; Review Procedure Lock smoke passed; screenshot, contact sheet, and four mode screenshots were refreshed and non-empty; MkDocs strict build passed; `git diff --check` passed. Bundled Playwright Chromium was unavailable, so screenshot refresh used the local Microsoft Edge channel without downloading browsers.
- Review status: `ready_for_optional_local_review`
- Review input mode: `freeform`
- Next action: Use optional freeform review to decide whether the fixed procedure, screenshot map, and access paths reduce future review friction; then make only one narrow procedure, IA, fixture, span, or routing change if review identifies a concrete gap.

## fff-review-memory-dedup-001

- Title: Fast Fiction Factory Review Memory Dedup
- Purpose: Add v1.14-style review memory, Acceptance Ladder, Review Dedup Gate, and Non-Redundant Review Card conventions so future review requests do not repeat the same target, evidence, and axis.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review memory / dedup doc: `docs/review/review-memory-dedup.md`
- Smoke result: `artifacts/review-memory-dedup-smoke-result.json`
- Manifest review memory source of truth: `artifacts/artifact-manifest.json`
- Preserved review procedure artifact: `fff-review-procedure-lock-001`
- Preserved Review Hub IA artifact: `fff-review-hub-ia-mode-split-001`
- Preserved source-span artifact: `fff-source-span-routing-review-pack-001`
- Preserved source-span pack: `artifacts/source-span-routing-review-pack.json`
- Preserved model/API boundary artifact: `fff-model-api-boundary-spec-001`
- Preserved model/API boundary spec: `docs/review/model-api-boundary-spec.md`
- Current status: `docs/review/current-status.md`
- Manifest review memory entries:
  - `fff-review-procedure-lock-001`
  - `fff-review-hub-ia-mode-split-001`
  - `fff-source-span-routing-review-pack-001`
- Validation command: run the active manifest validation command, Review Memory Dedup smoke/readback, Review Hub static smoke, MkDocs strict build, and `git diff --check`.
- Validation result: passed 2026-06-22T13:45:00+09:00; manifest validation command passed; `review_memory` contains required fields for `fff-review-procedure-lock-001`, `fff-review-hub-ia-mode-split-001`, and `fff-source-span-routing-review-pack-001`; Acceptance Ladder, Review Dedup Gate, and Non-Redundant Review Card template are present; Review Hub static smoke text is present; source-span pack and extraction validators remained passing; MkDocs strict build passed; `git diff --check` passed.
- Review status: `ready_for_optional_local_review`
- Review input mode: `freeform`
- Next action: Use the Review Dedup Gate before asking for review. The next non-redundant axis is source-span usefulness and routing quality only when target, evidence, axis, or decision value changes enough to justify asking.

## fff-source-span-quality-audit-001

- Title: Fast Fiction Factory Source-Span Quality Audit
- Purpose: Classify source-span usefulness and routing quality across the existing 36-row source-span review pack without asking for a repeated general Review Hub review or starting model/API work.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/source-span-quality-audit.md`
- Audit result: `artifacts/source-span-quality-audit-result.json`
- Source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Review memory / dedup doc: `docs/review/review-memory-dedup.md`
- Manifest: `artifacts/artifact-manifest.json`
- Preserved review memory artifact: `fff-review-memory-dedup-001`
- Preserved review procedure artifact: `fff-review-procedure-lock-001`
- Preserved Review Hub IA artifact: `fff-review-hub-ia-mode-split-001`
- Preserved source-span artifact: `fff-source-span-routing-review-pack-001`
- Preserved model/API boundary artifact: `fff-model-api-boundary-spec-001`
- Classification counts: 28 useful spans, 6 weak spans, 2 overly broad spans, 0 missing source refs, 7 ambiguous routing rows, 3 guarded visual/source-sensitive rows, and 17 human-owned boundary rows.
- Review Dedup result: review memory checked, axis set to `source_span_quality`, prior review count `0`, no Review Card emitted, and no repeated general Review Hub request emitted.
- Validation command: run the active manifest validation command, parse `artifacts/source-span-quality-audit-result.json`, regenerate the source-span review pack, validate adapter outputs, validate current/sample state, validate sample extraction payload, run extraction fixture validation, run MkDocs strict build, and run `git diff --check`.
- Validation result: passed; active manifest validation parsed the audit JSON, confirmed 36 classified rows, regenerated the source-span review pack, validated adapter outputs, validated current/sample state, validated the sample extraction payload, ran extraction fixture validation, and preserved no model/API behavior.
- Review status: `ready_for_optional_local_review`
- Review input mode: `freeform`
- Next action: Choose one bounded weak-span, broad-span, ambiguous-routing, or missing-fixture improvement before any model/API adapter work.

## fff-ambiguous-routing-resolution-001

- Title: Fast Fiction Factory Ambiguous Routing Resolution
- Purpose: Resolve the seven ambiguous routing rows from `fff-source-span-quality-audit-001` into explicit primary destinations, secondary evidence roles, held defaults, and regression checks without asking for a repeated general review or starting model/API work.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/ambiguous-routing-resolution.md`
- Resolution result: `artifacts/ambiguous-routing-resolution-result.json`
- Preserved source-span quality audit artifact: `fff-source-span-quality-audit-001`
- Preserved review memory artifact: `fff-review-memory-dedup-001`
- Preserved source-span artifact: `fff-source-span-routing-review-pack-001`
- Preserved model/API boundary artifact: `fff-model-api-boundary-spec-001`
- Updated deterministic adapter: `tools/fff-extract-local.mjs`
- Updated adapter output: `artifacts/local-extraction-adapter-output.json`
- Updated adapter matrix outputs: `artifacts/extraction-adapter-outputs/`
- Updated adapter smoke evidence: `artifacts/local-extraction-adapter-smoke-result.json`, `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Updated source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Resolution counts: 7 ambiguous rows resolved; 3 primary Profile routes, 1 primary Visual route, 3 Human Review holds, 5 Claim secondary evidence rows, and 6 Timeline secondary evidence rows.
- Adapter rule applied: `local-x-visual-observatory` no longer routes to Claim Ledger target ids; all visual asset rows keep `targetClaimIds: []`.
- Review Dedup result: review memory checked, axis set to `ambiguous_routing_resolution`, prior review count `0`, no Review Card emitted, and no repeated general Review Hub request emitted.
- Validation command: run the active manifest validation command, parse the resolution result, regenerate adapter matrix and source-span pack, validate adapter outputs and state files, run extraction fixture validation, run MkDocs strict build, and run `git diff --check`.
- Validation result: passed 2026-06-22T15:49:25+09:00; active manifest validation parsed the resolution JSON, confirmed all 7 ambiguous rows resolved, regenerated adapter smoke/matrix output and source-span review pack, verified every visual asset keeps `targetClaimIds: []` and avoids direct Claim routing, validated adapter outputs/current state/sample state/sample extraction/extraction fixtures, preserved model/API boundary text, passed MkDocs strict build, and passed `git diff --check`.
- Review status: `ready_for_optional_local_review`
- Review input mode: `freeform`
- Next action: Add one missing fixture class or validator-hardening case only if route policy drift appears again.

## fff-routing-policy-regression-hardening-001

- Title: Fast Fiction Factory Routing Policy Regression Hardening
- Purpose: Promote the ambiguous-routing policy into a reusable validator smoke command so future adapter changes cannot silently drift across Visual, Profile/Ghost, Claim, Timeline, Source Reference, and Human Review boundaries.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/routing-policy-regression-hardening.md`
- Regression result: `artifacts/routing-policy-regression-hardening-result.json`
- Routing policy validator: `tools/fff-state.mjs`
- Source resolution artifact: `fff-ambiguous-routing-resolution-001`
- Source resolution result: `artifacts/ambiguous-routing-resolution-result.json`
- Source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Adapter output: `artifacts/local-extraction-adapter-output.json`
- Adapter matrix outputs: `artifacts/extraction-adapter-outputs/`
- Validation command: `node tools/fff-state.mjs smoke-routing-policy artifacts/ambiguous-routing-resolution-result.json artifacts/routing-policy-regression-hardening-result.json`
- Validation result: passed 2026-06-23 and refreshed during `fff-remaining-fixture-coverage-one-class-001`; routing policy regression smoke parsed `fff-routing-policy-regression-hardening-001`, checked 7 resolved rows, 60 source-pack rows, 6 adapter payloads, 72 adapter elements, and 0 failures; visual direct-Claim guard, human-review hold guard, Claim secondary-evidence rule, Timeline secondary-evidence rule, source_reference preservation, unsafe/unclear hold rule, and adapter drift readback passed.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- Next action: Add one missing fixture class only if route-policy hardening later exposes drift.

## fff-broad-span-split-001

- Title: Fast Fiction Factory Broad Source-Span Split
- Purpose: Resolve the two broad source-span rows from `fff-source-span-quality-audit-001` by recording one narrower split and one explicit keep reason while preserving routing regression, source refs, review memory, model/API boundaries, and human-owned canon boundaries.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/broad-span-split.md`
- Split result: `artifacts/broad-span-split-result.json`
- Broad-span validator: `tools/fff-state.mjs`
- Source audit artifact: `fff-source-span-quality-audit-001`
- Source audit result: `artifacts/source-span-quality-audit-result.json`
- Routing policy regression artifact: `fff-routing-policy-regression-hardening-001`
- Routing policy regression result: `artifacts/routing-policy-regression-hardening-result.json`
- Validation command: `node tools/fff-state.mjs smoke-broad-span-split artifacts/source-span-quality-audit-result.json artifacts/broad-span-split-result.json`
- Validation result: passed 2026-06-23T11:05:58+09:00; manifest validation command passed after remote fast-forward; broad-span split parsed `fff-source-span-quality-audit-001`, loaded 2 broad rows, split `local-x-visual-observatory` into narrower visual/profile and timeline snippets, kept `minutes-x-placeholder-proof-bait` with an explicit human-owned reason, preserved both source locators, preserved routing regression and model/API boundary evidence, adapter/source-span smoke remained passing, MkDocs strict build passed, and `git diff --check` passed.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- Next action: Pick one weak span repair or one missing fixture class only after explicit need; do not reopen broad-span debt unless source output changes.

## fff-weak-span-repair-001

- Title: Fast Fiction Factory Weak Source-Span Repair
- Purpose: Resolve the six weak source-span rows from `fff-source-span-quality-audit-001` by recording stronger same-fixture source refs while preserving original locators, broad-span split results, routing policy regression, review memory, model/API boundaries, and human-owned canon boundaries.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/weak-span-repair.md`
- Repair result: `artifacts/weak-span-repair-result.json`
- Weak-span validator: `tools/fff-state.mjs`
- Source audit artifact: `fff-source-span-quality-audit-001`
- Source audit result: `artifacts/source-span-quality-audit-result.json`
- Broad-span split artifact: `fff-broad-span-split-001`
- Broad-span split result: `artifacts/broad-span-split-result.json`
- Routing policy regression artifact: `fff-routing-policy-regression-hardening-001`
- Routing policy regression result: `artifacts/routing-policy-regression-hardening-result.json`
- Validation command: `node tools/fff-state.mjs smoke-weak-span-repair artifacts/source-span-quality-audit-result.json artifacts/weak-span-repair-result.json`
- Validation result: passed 2026-06-23T13:10:13+09:00; manifest validation command passed; weak-span repair smoke parsed `fff-source-span-quality-audit-001`, loaded 6 weak rows, repaired all 6 with stronger same-fixture source refs, preserved 6 original locators, preserved broad-span split and routing regression evidence, adapter/source-span smoke remained passing, MkDocs strict build passed, HTML script syntax check passed, and `git diff --check` passed.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- Next action: Add one missing fixture class only after a concrete coverage need is named; do not reopen weak-span, broad-span, or ambiguous-routing debt unless source output changes.

## fff-missing-fixture-class-probe-001

- Title: Fast Fiction Factory Missing Fixture Class Probe
- Purpose: Add exactly one concrete missing fixture class, sparse bullet-only notes, after weak-span cleanup while preserving routing, source-span, model/API, review-memory, and human-owned canon boundaries.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/missing-fixture-class-probe.md`
- Probe result: `artifacts/missing-fixture-class-probe-result.json`
- Fixture memo: `artifacts/extraction-adapter-fixtures/sparse-bullet-notes.md`
- Fixture output: `artifacts/extraction-adapter-outputs/sparse-bullet-notes.json`
- Updated deterministic adapter: `tools/fff-extract-local.mjs`
- Updated state smoke: `tools/fff-state.mjs`
- Source-span review pack generator: `tools/fff-source-span-review-pack.mjs`
- Adapter matrix smoke: `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Routing policy regression result: `artifacts/routing-policy-regression-hardening-result.json`
- Weak-span repair result: `artifacts/weak-span-repair-result.json`
- Broad-span split result: `artifacts/broad-span-split-result.json`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Validation command: `node tools/fff-state.mjs smoke-missing-fixture-class-probe artifacts/local-extraction-adapter-expansion-smoke-result.json artifacts/missing-fixture-class-probe-result.json`
- Validation result: passed 2026-06-23 and refreshed during `fff-remaining-fixture-coverage-one-class-001`; sparse fixture probe read at least 4 fixture outputs and now sees 5 fixture outputs, 60 matrix elements, 60 source-pack rows, 6 adapter payloads, 72 adapter elements, 12 sparse fixture elements, 11 sparse bullet lines, 0 source-span mismatches, 0 missing source refs, 0 unsafe visual routes, 0 non-held review defaults, 0 human-owned adopt suggestions, 0 Review Cards, 0 Operator Observation Cards, and 0 failures.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- Next action: Choose another remaining fixture class only after a concrete coverage need is named; do not reopen sparse notes, weak spans, broad spans, or ambiguous routing unless source output changes.

## fff-malformed-missing-span-guard-001

- Title: Fast Fiction Factory Malformed/Missing Source-Span Guard
- Purpose: Add exactly one negative validator guard class for missing, malformed, or unusable source-span evidence so invalid payloads cannot silently become accepted Profile, Claim, or Timeline routed candidates.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/malformed-missing-span-guard.md`
- Guard result: `artifacts/malformed-missing-span-guard-result.json`
- Negative fixture: `artifacts/extraction-negative-fixtures/malformed-missing-source-span.json`
- Validator smoke: `artifacts/extraction-validator-smoke-result.json`
- Updated state validator: `tools/fff-state.mjs`
- Preserved missing fixture probe result: `artifacts/missing-fixture-class-probe-result.json`
- Preserved source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Preserved routing policy regression result: `artifacts/routing-policy-regression-hardening-result.json`
- Preserved weak-span repair result: `artifacts/weak-span-repair-result.json`
- Preserved broad-span split result: `artifacts/broad-span-split-result.json`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Validation command: `node tools/fff-state.mjs smoke-malformed-missing-span-guard artifacts/extraction-validator-smoke-result.json artifacts/malformed-missing-span-guard-result.json`
- Validation result: passed 2026-06-23 and refreshed during `fff-remaining-fixture-coverage-one-class-001`; malformed/missing source-span guard read 9 validator fixtures, 6 expected-invalid fixtures, 3 invalid guard elements, 5 source-span validation errors, 1 missing source-ref error, 0 accepted routed candidates, 0 non-held defaults, 60 preserved source-pack rows, 6 preserved adapter payloads, 72 preserved adapter elements, 0 Review Cards, 0 Operator Observation Cards, and 0 failures.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- Next action: Choose a different remaining fixture class only after a concrete coverage need is named; do not reopen malformed/missing spans, sparse notes, weak spans, broad spans, or ambiguous routing unless source output changes.

## fff-contradictory-claim-guard-001

- Title: Fast Fiction Factory Contradictory Claim Guard
- Purpose: Add exactly one local guard fixture for contradictory memo claims so reciprocal contradictory claim candidates are detected, source-backed, held for human review, and kept out of auto-canon or direct Claim Ledger acceptance.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/contradictory-claim-guard.md`
- Guard result: `artifacts/contradictory-claim-guard-result.json`
- Guard fixture: `artifacts/extraction-negative-fixtures/contradictory-claim-hold.json`
- Validator smoke: `artifacts/extraction-validator-smoke-result.json`
- Updated state validator: `tools/fff-state.mjs`
- Preserved malformed/missing source-span guard result: `artifacts/malformed-missing-span-guard-result.json`
- Preserved missing fixture probe result: `artifacts/missing-fixture-class-probe-result.json`
- Preserved source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Preserved routing policy regression result: `artifacts/routing-policy-regression-hardening-result.json`
- Preserved weak-span repair result: `artifacts/weak-span-repair-result.json`
- Preserved broad-span split result: `artifacts/broad-span-split-result.json`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Validation command: `node tools/fff-state.mjs smoke-contradictory-claim-guard artifacts/extraction-validator-smoke-result.json artifacts/contradictory-claim-guard-result.json`
- Validation result: passed 2026-06-23 and refreshed during `fff-remaining-fixture-coverage-one-class-001`; contradictory claim guard read 9 validator fixtures, 3 expected-valid fixtures, 6 expected-invalid fixtures, 2 linked conflicting claims, 1 reciprocal conflict pair, 2 held conflicting claims, 0 adopted/provisional conflicting claims, 0 direct accepted claim elements, 2 source-ref-preserved conflicting claims, 60 preserved source-pack rows, 6 preserved adapter payloads, 72 preserved adapter elements, 0 Review Cards, 0 Operator Observation Cards, and 0 failures.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- Next action: Preserve this as the active Review Hub identity while using provider-envelope readiness as auxiliary no-call evidence; do not reopen contradictory claims, malformed/missing spans, sparse notes, weak spans, broad spans, or ambiguous routing unless source output changes.

## fff-downstream-source-span-adoption-gate-001

- Title: Fast Fiction Factory Downstream Source-Span Adoption Gate
- Purpose: Add a deterministic readiness gate after malformed/missing span validation so only source-tracked, valid-span, safe-routed, review-held elements can be considered for future Profile, Claim, or Timeline adoption paths.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/downstream-source-span-adoption-gate.md`
- Gate result: `artifacts/downstream-source-span-adoption-gate-result.json`
- State validator: `tools/fff-state.mjs`
- Source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Malformed/missing span guard: `artifacts/malformed-missing-span-guard-result.json`
- Routing policy regression result: `artifacts/routing-policy-regression-hardening-result.json`
- Validator smoke: `artifacts/extraction-validator-smoke-result.json`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Validation command: `node tools/fff-state.mjs smoke-downstream-source-span-adoption-gate artifacts/source-span-routing-review-pack.json artifacts/downstream-source-span-adoption-gate-result.json`
- Validation result: passed 2026-06-23 and refreshed during `fff-remaining-fixture-coverage-one-class-001`; downstream gate read 60 source-pack rows, reported 55 downstream Profile / Claim / Timeline review candidates, confirmed 55 source-tracked candidates, 0 malformed or missing-span candidates, 0 unsafe routing candidates, 28 held human-owned candidates, 0 non-held human-owned candidates, 0 accepted routed malformed-span candidates, 0 adopted downstream candidates, 6 adapter payloads, 72 adapter elements, and 0 failures.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary readback under `fff-contradictory-claim-guard-001`.
- Next action: Keep this gate passing before any future adoption path or provider-backed adapter; use `fff-provider-envelope-readiness-no-call-001` as the no-call provider-envelope precondition before any provider implementation.

## fff-provider-envelope-readiness-no-call-001

- Title: Fast Fiction Factory Provider Envelope Readiness No-Call Gate
- Purpose: Define and validate the envelope shape a future provider adapter must satisfy before any model/API provider call, credential flow, provider endpoint, database persistence, publishing adapter, production sync, AI video generation, downstream adoption implementation, or final canon decision exists.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/provider-envelope-readiness-no-call.md`
- Envelope example: `artifacts/provider-envelope-readiness-no-call.example.json`
- Readback result: `artifacts/provider-envelope-readiness-no-call-result.json`
- State validator: `tools/fff-state.mjs`
- Preserved active artifact: `fff-contradictory-claim-guard-001`
- Preserved model/API boundary: `fff-model-api-boundary-spec-001`
- Preserved malformed/missing source-span guard: `artifacts/malformed-missing-span-guard-result.json`
- Preserved contradictory claim guard: `artifacts/contradictory-claim-guard-result.json`
- Preserved downstream source-span adoption gate: `artifacts/downstream-source-span-adoption-gate-result.json`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Validation command: `node tools/fff-state.mjs smoke-provider-envelope-readiness-no-call artifacts/provider-envelope-readiness-no-call.example.json artifacts/provider-envelope-readiness-no-call-result.json`
- Validation result: passed 2026-06-23; provider envelope readiness parsed the no-call fixture, confirmed no provider configured, no provider/model name, no endpoint, no external call attempted, no credentials touched, 4 carried Extraction Contract elements, 4 source-tracked elements, 2 human-owned elements held, 0 non-held human-owned elements, 0 visual direct Claim routes, 0 adopted/provisional elements, 0 adopted/provisional claims, and preserved the validator, malformed/missing, contradictory, downstream, source-pack, and model/API no-call gates.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary readback under `fff-contradictory-claim-guard-001`; no Review Card or Operator Observation Card is emitted.
- Next action: Choose explicit provider adapter implementation only after authorization for provider choice, credentials, and transport behavior, or choose remaining broad/multilingual fixture coverage if coverage remains the bottleneck.

## fff-provider-adapter-authorization-readiness-001

- Title: Fast Fiction Factory Provider Adapter Authorization Readiness
- Purpose: Record the authorization boundary before any real provider adapter work starts, separating local no-call readiness from provider choice, credentials, endpoint, transport, external call permission, persistence/publication, and production behavior.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/provider-adapter-authorization-readiness.md`
- Readback result: `artifacts/provider-adapter-authorization-readiness-result.json`
- Preserved provider envelope readiness: `artifacts/provider-envelope-readiness-no-call-result.json`
- Preserved model/API boundary: `artifacts/model-api-boundary-smoke-result.json`
- Preserved downstream scope lock: `artifacts/downstream-adoption-gate-scope-lock-result.json`
- Preserved contradictory claim guard: `artifacts/contradictory-claim-guard-result.json`
- Preserved malformed/missing source-span guard: `artifacts/malformed-missing-span-guard-result.json`
- Preserved routing regression: `artifacts/routing-policy-regression-hardening-result.json`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Validation command: `node tools/fff-state.mjs smoke-provider-adapter-authorization-readiness artifacts/provider-envelope-readiness-no-call-result.json artifacts/provider-adapter-authorization-readiness-result.json`
- Validation result: provider adapter authorization readiness records 6 unauthorized items, 7 allowed no-call states, 6 future authorization triggers, 3 Decision Packet options, provider configured=false, external call=false, credentials touched=false, downstream adopted=0, held conflicting claims=2, malformed accepted=0, 0 Review Cards, 0 Operator Observation Cards, and 0 failures.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- Render gate: `L0 No Render`
- State: Preserved auxiliary readback under `fff-contradictory-claim-guard-001`; no provider adapter, provider authorization implementation, credentials, endpoint, transport, model/API call, DB persistence, publishing, production sync, downstream adoption, or canon promotion is added.
- Next action: Real provider adapter implementation only after explicit authorization for provider choice, credentials, endpoint, transport behavior, external call permission, timeout, and retry policy.

## fff-remaining-fixture-coverage-one-class-001

- Title: Fast Fiction Factory Remaining Fixture Coverage One Class
- Purpose: Add exactly one remaining deterministic adapter fixture class, multilingual memo text, while keeping provider-envelope readiness no-call and preserving existing source-span, routing, malformed/missing-span, contradictory-claim, downstream, and human-owned decision gates.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/remaining-fixture-coverage-one-class.md`
- Readback result: `artifacts/remaining-fixture-coverage-one-class-result.json`
- Fixture memo: `artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md`
- Fixture output: `artifacts/extraction-adapter-outputs/multilingual-memo-notes.json`
- Updated deterministic adapter: `tools/fff-extract-local.mjs`
- Updated state smoke: `tools/fff-state.mjs`
- Source-span review pack generator: `tools/fff-source-span-review-pack.mjs`
- Adapter matrix smoke: `artifacts/local-extraction-adapter-expansion-smoke-result.json`
- Source-span review pack: `artifacts/source-span-routing-review-pack.json`
- Routing policy regression result: `artifacts/routing-policy-regression-hardening-result.json`
- Downstream gate result: `artifacts/downstream-source-span-adoption-gate-result.json`
- Provider envelope readiness result: `artifacts/provider-envelope-readiness-no-call-result.json`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Validation command: `node tools/fff-state.mjs smoke-remaining-fixture-coverage-one-class artifacts/local-extraction-adapter-expansion-smoke-result.json artifacts/remaining-fixture-coverage-one-class-result.json`
- Validation result: passed 2026-06-23; multilingual fixture readback selected multilingual memo text over translated memo text and very broad source-span shape, raised the positive adapter matrix to 5 fixtures and 60 elements, confirmed 12 multilingual fixture elements with 4 non-ASCII source-span elements, 0 source-span mismatches, 0 missing source refs, 0 unsafe visual routes, 0 non-held defaults, 0 human-owned adopt suggestions, 0 Review Cards, 0 Operator Observation Cards, and 0 failures.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary readback under `fff-contradictory-claim-guard-001`; provider-envelope readiness remains no-call and no-credential.
- Next action: Choose explicit provider adapter implementation only after authorization, or choose translated memo text / very broad source-span shape only if coverage remains the bottleneck.

## fff-translated-memo-fixture-audit-001

- Title: Fast Fiction Factory Translated / Multilingual Memo Fixture Audit
- Purpose: Audit the existing multilingual memo fixture coverage and classify translated memo text as a policy-dependent gap without adding another fixture class, provider/API behavior, or canon decision.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/translated-memo-fixture-audit.md`
- Readback result: `artifacts/translated-memo-fixture-audit-result.json`
- Preserved multilingual fixture doc/result: `docs/review/remaining-fixture-coverage-one-class.md`, `artifacts/remaining-fixture-coverage-one-class-result.json`
- Preserved multilingual fixture memo/output: `artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md`, `artifacts/extraction-adapter-outputs/multilingual-memo-notes.json`
- Downstream scope-lock result: `artifacts/downstream-adoption-gate-scope-lock-result.json`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Validation command: `node tools/fff-state.mjs smoke-translated-memo-fixture-audit artifacts/local-extraction-adapter-expansion-smoke-result.json artifacts/translated-memo-fixture-audit-result.json`
- Validation result: translated memo fixture audit reads the downstream scope-lock, existing multilingual fixture coverage, source-span review pack, downstream gate, contradictory guard, malformed/missing guard, and provider no-call envelope; it records 0 translated fixtures added, translated memo text still present as a gap, 4 multilingual source-span elements preserved, 0 source-span mismatches, 0 missing source refs, 0 unsafe routes, 0 non-held defaults, 0 downstream adopted candidates, no provider configured, no external call attempted, no credentials touched, 0 Review Cards, 0 Operator Observation Cards, and 0 failures.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary readback under `fff-contradictory-claim-guard-001`; no translated fixture, provider/API behavior, downstream adoption implementation, or canon promotion is added.
- Next action: Use `fff-very-broad-source-span-shape-audit-001` for the broad-shape readback; otherwise move to provider adapter implementation only after explicit authorization.

## fff-very-broad-source-span-shape-audit-001

- Title: Fast Fiction Factory Very Broad Source-Span Shape Audit
- Purpose: Audit the remaining very broad source-span shape fixture candidate without adding another fixture class, because current broad rows are already resolved by `fff-broad-span-split-001`.
- Repo relative path: `public/review/index.html`
- Open command: `Invoke-Item .\public\review\index.html`
- Repo-local PowerShell launcher: `scripts/operator/open_review.ps1`
- Repo-local shell launcher: `scripts/operator/open_review.sh`
- Review doc: `docs/review/very-broad-source-span-shape-audit.md`
- Readback result: `artifacts/very-broad-source-span-shape-audit-result.json`
- Preserved translated memo audit: `artifacts/translated-memo-fixture-audit-result.json`
- Preserved broad-span split: `artifacts/broad-span-split-result.json`
- Preserved source-span quality audit: `artifacts/source-span-quality-audit-result.json`
- State validator: `tools/fff-state.mjs`
- Manifest: `artifacts/artifact-manifest.json`
- Current status: `docs/review/current-status.md`
- Validation command: `node tools/fff-state.mjs smoke-very-broad-source-span-shape-audit artifacts/local-extraction-adapter-expansion-smoke-result.json artifacts/very-broad-source-span-shape-audit-result.json`
- Validation result: very broad source-span shape audit reads the translated memo audit, source-span quality audit, broad-span split, source-span pack, routing regression, downstream gate, contradictory guard, malformed/missing guard, remaining fixture coverage, and provider no-call envelope; it records 0 broad fixtures added, 2 current broad rows resolved by split/keep, 0 source-span mismatches, 0 missing source refs, 0 unsafe routes, 0 non-held defaults, 0 downstream adopted candidates, no provider configured, no external call, no credentials touched, 0 Review Cards, 0 Operator Observation Cards, and 0 failures.
- Review status: `ready_for_local_readback`
- Review input mode: `freeform`
- State: Preserved auxiliary readback under `fff-contradictory-claim-guard-001`; no broad fixture, translated fixture, provider/API behavior, downstream adoption implementation, or canon promotion is added.
- Next action: Move to provider adapter implementation only after explicit authorization, or add a translated/broad fixture only after policy or source-output evidence creates concrete decision value.
