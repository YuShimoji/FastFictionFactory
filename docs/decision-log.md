# Decision Log

## 2026-06-15

- Decision: Keep Fast Fiction Factory local-first for the current MVP.
  - Reason: The current artifact is a review workbench, not a production pipeline.
  - Effect: Static HTML, JSON state files, and local smoke evidence are the source of review truth.

- Decision: Treat Claim Ledger adoption as local review state, not final human canon.
  - Reason: Toma fate, brass moth truth, and Council motive remain human-owned unresolved decisions.
  - Effect: Claims can be grouped, filtered, and marked, but canon authority stays outside the prototype.

- Decision: Align exported state JSON with `fff-claim-ledger-001`.
  - Reason: The UI and docs had advanced to the Claim Ledger slice while exported JSON still contained the older 3-claim shape.
  - Effect: `artifacts/sample-project-state.json` and `artifacts/current-project-state.json` now carry 9 Claim Ledger claims and pass `tools/fff-state.mjs validate`.

- Decision: Preserve a thin repo-local agent entry point.
  - Reason: Future work should read the repo context without turning `AGENTS.md` into a status document.
  - Effect: `AGENTS.md` points to current docs and keeps project instructions separate from history.

- Decision: Add a local Markdown docs view for audit and browser-assisted translation checks.
  - Reason: Project context was spread across multiple Markdown files, and another terminal needed a single restartable map without rewriting source specifications.
  - Effect: `mkdocs.yml`, `docs/index.md`, `docs/project-overview.md`, `docs/local-view/`, and `tools/generate-doc-nav.mjs` provide a local tree view, original-source wrappers, a project overview map, screenshot locations, and a turn-count-based development plan.

## 2026-06-18

- Decision: Treat Extraction Contract validator hardening as the active artifact before adapter work.
  - Reason: A future adapter needs a local pass/fail gate before generated candidates can affect Profile/Ghost Flow, Claim Ledger, or Timeline View.
  - Effect: `fff-extraction-validator-hardening-001` adds standalone extraction validation commands, negative fixtures, fixture matrix smoke evidence, updated Visual Review Hub evidence, and active manifest/status handoff context.

- Decision: Keep validator failures review-safe rather than canon-producing.
  - Reason: Missing source refs, overconfident human-owned decisions, direct visual-asset-to-claim routing, and auto-canon defaults are adapter risks, not story truths.
  - Effect: Toma fate, brass moth truth, and Council motive remain unresolved human-owned decisions; generated confidence and fixture coverage do not imply final canon.

## 2026-06-20

- Decision: Expand the local deterministic adapter through a fixture matrix before model/API extraction work.
  - Reason: The single-sample adapter proved the contract path, but source-span usefulness, routing safety, and review-held defaults need multi-memo regression coverage before generated candidates can safely grow.
  - Effect: `fff-local-extraction-adapter-expansion-001` adds local fixture memos, per-fixture adapter outputs, aggregate source/routing smoke evidence, and Review Hub/manifest/status updates while preserving no model/API behavior and no final canon decisions for Toma fate, brass moth truth, or Council motive.

- Decision: Keep model/API extraction behind a spec-only boundary before provider implementation.
  - Reason: Future provider output needs an envelope, validation gates, failure policy, fallback behavior, and forbidden-action list before any external call or credential flow is allowed.
  - Effect: `fff-model-api-boundary-spec-001` records the boundary doc, envelope example, and smoke result while preserving no model/API call, no credentials, no database persistence, no publishing, and no final canon decisions.

- Decision: Add a source-span routing review pack before freeform review and before model/API adapter work.
  - Reason: Reviewing the three fixture outputs as a span/routing supervision pack is more efficient than asking for unstructured review against raw JSON and smoke output.
  - Effect: `fff-source-span-routing-review-pack-001` adds a generated pack artifact, Review Hub section, review doc, manifest/status/handoff updates, and Review Debt categories while preserving `fff-model-api-boundary-spec-001`, held defaults, source refs, human-owned decision guards, and no model/API behavior.

## 2026-06-22

- Decision: Split the Review Hub into review modes before continuing adapter work.
  - Reason: Freeform UI review found the one-page hub too vertically long, English-first, conceptually layered between story review and project governance, and awkward because the Raw Story Memo panel used sticky behavior.
  - Effect: `fff-review-hub-ia-mode-split-001` adds Story Review, Source Audit, Project Cockpit, and Artifacts modes, Japanese-facing display labels, non-sticky Raw Story Memo behavior, collapsed source audit details, updated visual evidence, and smoke evidence while preserving `fff-source-span-routing-review-pack-001`, `fff-model-api-boundary-spec-001`, freeform review, and human-owned canon boundaries.

- Decision: Lock the review procedure before model/API implementation.
  - Reason: Future review checkpoints need stable identity, access, screenshot, contact-sheet, mode-purpose, optional-review, required-review, and Review Debt guidance that does not depend on prior chat context.
  - Effect: `fff-review-procedure-lock-001` adds `docs/review/review-procedure.md`, updates the Review Hub Artifacts mode, refreshes manifest/status/artifact inventory access paths, adds a shell launcher, expects mode-specific screenshots, and keeps model/API calls, credentials, database persistence, publishing, production sync, AI video generation, and final canon decisions out of scope.

- Decision: Add review memory and a dedup gate before asking for more review.
  - Reason: Positive diagnostic signals should not be re-requested as the same target/evidence/axis, and they should not silently expand into production acceptance, source-span quality acceptance, model/API approval, or canon approval.
  - Effect: `fff-review-memory-dedup-001` adds `docs/review/review-memory-dedup.md`, manifest-level `review_memory`, Acceptance Ladder, Review Dedup Gate, Non-Redundant Review Card requirements, and smoke evidence while preserving freeform review and no model/API behavior.

- Decision: Audit source-span usefulness and routing quality before revising adapter or model/API behavior.
  - Reason: The source-span routing review pack was valid, but validity alone did not show whether spans were useful, overly broad, weak, missing source refs, ambiguously routed, or safely held around human-owned decisions.
  - Effect: `fff-source-span-quality-audit-001` classifies all 36 review-pack rows, records 28 useful spans, 6 weak spans, 2 overly broad spans, 0 missing source refs, 7 ambiguous routing rows, 3 guarded visual/source-sensitive rows, and 17 human-owned boundary rows without asking for a repeated general Review Hub review.

- Decision: Resolve ambiguous source-span routing into explicit primary routes and held defaults.
  - Reason: The 7 ambiguous routing rows needed a local route policy before any further fixture, validator, or future model/API adapter work could safely use the pack.
  - Effect: `fff-ambiguous-routing-resolution-001` resolves the 7 rows into 3 Profile-primary routes, 1 Visual-primary route, and 3 Human Review holds; Claim and Timeline remain secondary evidence where needed, `local-x-visual-observatory` no longer carries Claim target ids, and no model/API behavior or final canon decision is added.

- Decision: Promote ambiguous-routing policy into a reusable regression smoke command.
  - Reason: The prior manifest checked the current route policy, but future adapter edits needed a named validator command that fails when Visual, Claim, Timeline, Source Reference, or Human Review routing drifts.
  - Effect: `fff-routing-policy-regression-hardening-001` adds `node tools/fff-state.mjs smoke-routing-policy ...`, records `artifacts/routing-policy-regression-hardening-result.json`, checks the resolution artifact, source-span pack, single adapter output, and three adapter matrix outputs, and preserves no model/API behavior or final canon decision.

- Decision: Resolve the two broad source-span rows as readback debt before moving to weak spans or fixtures.
  - Reason: `fff-source-span-quality-audit-001` found two valid but broad spans, and the next non-redundant source-span quality move was to split, shrink, or explicitly justify them without reopening general review.
  - Effect: `fff-broad-span-split-001` records one narrower split for `local-x-visual-observatory`, one explicit keep reason for `minutes-x-placeholder-proof-bait`, `artifacts/broad-span-split-result.json`, and `node tools/fff-state.mjs smoke-broad-span-split ...` while preserving routing regression, source locators, model/API boundaries, and human-owned canon decisions.

## 2026-06-23

- Decision: Add a downstream source-span adoption readiness gate after malformed/missing span validation.
  - Reason: The malformed/missing guard proved invalid source evidence is rejected, but future Profile / Claim / Timeline adoption paths also need a deterministic check that only source-tracked, valid-span, safe-routed, review-held elements can be considered.
  - Effect: `fff-downstream-source-span-adoption-gate-001` adds `node tools/fff-state.mjs smoke-downstream-source-span-adoption-gate ...`, records `artifacts/downstream-source-span-adoption-gate-result.json`, exposes the gate in Review Hub/docs/manifest, preserves 0 adopted downstream candidates, and keeps model/API, database, publishing, production sync, AI video, and final canon decisions out of scope.

- Decision: Add a contradictory claim guard before any direct Claim Ledger acceptance path.
  - Reason: Future extraction can surface two source-backed claims that conflict, but local automation must preserve both as review-held evidence instead of choosing which statement is true or promoting either to canon.
  - Effect: `fff-contradictory-claim-guard-001` adds `artifacts/extraction-negative-fixtures/contradictory-claim-hold.json`, `node tools/fff-state.mjs smoke-contradictory-claim-guard ...`, `artifacts/contradictory-claim-guard-result.json`, and Review Hub/status/manifest readback showing 2 conflicting claims held, 1 reciprocal conflict pair preserved, 0 adopted/provisional conflicting claims, and 0 direct accepted claim-routed elements.

- Decision: Add a provider-envelope readiness gate without calling or configuring a provider.
  - Reason: The model/API boundary spec needed one concrete pre-adapter envelope shape so future provider output has to declare run metadata, carry candidate Extraction Contract output, and bind to existing validator, source-span, contradictory-claim, downstream, and human-owned decision guards before credentials or real calls exist.
  - Effect: `fff-provider-envelope-readiness-no-call-001` adds `docs/review/provider-envelope-readiness-no-call.md`, `artifacts/provider-envelope-readiness-no-call.example.json`, `node tools/fff-state.mjs smoke-provider-envelope-readiness-no-call ...`, `artifacts/provider-envelope-readiness-no-call-result.json`, and Review Hub/status/manifest readback showing no provider configured, no provider/model name, no endpoint, no external call attempted, no credentials touched, 4 source-tracked carried elements, 2 held human-owned elements, and 0 adopted/provisional elements or claims.

- Decision: Add one remaining positive adapter fixture class for multilingual memo text before provider implementation.
  - Reason: The adapter matrix was English-only, while multilingual memo text can be source-span tested locally without choosing a translation policy, provider, endpoint, credentials, or story truth.
  - Effect: `fff-remaining-fixture-coverage-one-class-001` adds `artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md`, `artifacts/extraction-adapter-outputs/multilingual-memo-notes.json`, `docs/review/remaining-fixture-coverage-one-class.md`, `artifacts/remaining-fixture-coverage-one-class-result.json`, and `node tools/fff-state.mjs smoke-remaining-fixture-coverage-one-class ...`; the adapter matrix now covers 5 fixture outputs and 60 elements while provider-envelope readiness remains no-call.

## 2026-06-24

- Decision: Preserve translated memo fixture work as an audit instead of adding a fixture.
  - Reason: Multilingual memo text is already covered locally, but translated memo text needs source-of-truth language, translation provenance, and original-versus-translation source-span ownership policy before a fixture would be meaningful.
  - Effect: `fff-translated-memo-fixture-audit-001` adds `docs/review/translated-memo-fixture-audit.md`, `artifacts/translated-memo-fixture-audit-result.json`, and `node tools/fff-state.mjs smoke-translated-memo-fixture-audit ...`; it records the post-scope-lock manifest validation closure and preserves no translated fixture, translation API, translation policy, provider/model/API behavior, credentials, downstream adoption behavior, or canon promotion.

- Decision: Preserve very broad source-span shape work as an audit instead of adding a fixture.
  - Reason: The current two broad source-span rows are already resolved by `fff-broad-span-split-001`, and the source-pack/downstream/provider no-call chain has no source mismatch, missing source ref, unsafe route, non-held default, downstream adopted candidate, provider call, or credential use that a new fixture would clarify.
  - Effect: `fff-very-broad-source-span-shape-audit-001` adds `docs/review/very-broad-source-span-shape-audit.md`, `artifacts/very-broad-source-span-shape-audit-result.json`, and `node tools/fff-state.mjs smoke-very-broad-source-span-shape-audit ...`; it keeps broad fixture work deferred until source output changes or coverage becomes the concrete bottleneck.

## 2026-06-29

- Decision: Record route-lock cleanup after ClipPipeGen prompt residue appeared in the Fast Fiction Factory workspace.
  - Reason: Four untracked `docs/style_intent/subtitle-owner-*` files contained `clippipegen` / `clip-ed10` identifiers and did not belong to the active Fast Fiction Factory route.
  - Effect: `fff-route-lock-clean-state-readback-001` records that the untracked residue files and empty `docs/style_intent/` directory were deleted, tracked/workspace contamination searches returned no hits for ClipPipeGen / ED-10 terms, and the active artifact remains `fff-contradictory-claim-guard-001`.

- Decision: Add translation provenance/source-span readback before translated fixture work.
  - Reason: The translated memo audit identified a real policy gap, but adding a translated fixture before source-of-truth language and original-vs-translation span ownership policy would create unclear authority. A smaller readback can prove the current multilingual source spans already trace to held derived claims.
  - Effect: `fff-translation-provenance-source-span-readback-001` records 3 source-span to derived-claim relations and 1 inline-gloss boundary row, keeps all derived claims held and source-backed, keeps translated fixture count at 0, and preserves no provider/API call, credential, downstream adoption, or canon promotion.

- Decision: Define the translation source-of-truth boundary before translated fixture or provider work.
  - Reason: The provenance readback made source-span to held-claim tracing visible, but future translated fixtures still needed a durable rule for which language surface owns evidence, how derivative translated spans are allowed, and why inline gloss cannot become unowned claim authority.
  - Effect: `fff-translation-policy-source-of-truth-boundary-001` records original multilingual author memo text as the source-of-truth language surface, keeps original sourceSpan locators as evidence owners, requires future translated spans to be derivative/provenance-bound, blocks inline gloss from creating unowned claims, keeps derived claims held, and preserves no translated fixture, provider/API call, credential, downstream adoption, or canon promotion.

- Decision: Add the minimum translated memo fixture after the source-of-truth boundary.
  - Reason: The policy boundary was useful only if the first translated fixture could prove original sourceSpan ownership, derivative translation provenance, claim hold behavior, and inline gloss limits without opening provider/API or credential work.
  - Effect: `fff-translated-memo-fixture-minimum-001` adds `artifacts/translated-memo-fixture-minimum.json`, `docs/review/translated-memo-fixture-minimum.md`, `artifacts/translated-memo-fixture-minimum-result.json`, and `node tools/fff-state.mjs smoke-translated-memo-fixture-minimum ...`; it records 2 translated rows, 2 original span matches, 0 span mismatches, 0 translation-to-claim leaks, 1 held linked claim, 0 auto-promotions, 0 inline gloss claim leaks, and no provider/API call, credential, downstream adoption, or canon promotion.

- Decision: Add held claim adoption preflight without adopting the claim.
  - Reason: The minimal translated fixture produced one held, source-backed linked claim, but the next workflow needed to know whether that claim can be named as an adoption candidate before any Profile / Claim / Timeline mutation or canon behavior exists.
  - Effect: `fff-held-claim-adoption-preflight-001` adds `docs/review/held-claim-adoption-preflight.md`, `artifacts/held-claim-adoption-preflight-result.json`, and `node tools/fff-state.mjs smoke-held-claim-adoption-preflight ...`; it records 1 held claim inspected, 1 source-backed claim, 1 preflight-only eligible candidate, 0 adopted claims, 0 canonized claims, 0 translation/gloss leaks, and no provider/API call, credential, downstream adoption, or canon promotion.

- Decision: Define downstream adoption semantics without implementing adoption.
  - Reason: The held claim preflight named `multi-claim-moth-key-label` as a source-backed candidate, but actual downstream writes still need explicit vocabulary, accepted-status meaning, rollback conditions, and mutation boundaries before any Profile / Claim / Timeline / Story Seed state can change.
  - Effect: `fff-downstream-adoption-semantics-design-001` adds `docs/review/downstream-adoption-semantics-design.md`, `artifacts/downstream-adoption-semantics-design-result.json`, and `node tools/fff-state.mjs smoke-downstream-adoption-semantics-design ...`; it records 1 design-only candidate, 1 readback-only `hold -> adoption_candidate` transition, future `human_accepted_downstream_adoption` as unreachable now, 10 rollback conditions, 4 blocked mutation targets, 0 adopted claims, 0 canonized claims, and no provider/API call, credential, downstream mutation, or canon promotion.

- Decision: Add an adoption candidate ledger dry-run without implementing adoption.
  - Reason: The downstream adoption semantics design named the readback-only `hold -> adoption_candidate` transition, but the workflow needed one concrete ledger row to prove the candidate can be recorded without becoming real adoption, canon, or downstream state mutation.
  - Effect: `fff-adoption-candidate-ledger-dry-run-001` adds `docs/review/adoption-candidate-ledger-dry-run.md`, `artifacts/adoption-candidate-ledger-dry-run-result.json`, and `node tools/fff-state.mjs smoke-adoption-candidate-ledger-dry-run ...`; it records `multi-claim-moth-key-label` as `adoption_candidate_dry_run` with source span, prior hold status, rollback/rejection vocabulary, future-only Profile / Claim / Timeline targets, 0 adopted claims, 0 canonized claims, 0 Profile / Claim / Timeline / Story Seed mutations, and no provider/API call, credential, publishing, or production generation.

- Decision: Record one-claim sandbox adoption as a fixture-only mutation.
  - Reason: The user authorized Decision Packet option A for `multi-claim-moth-key-label`, but only as sandbox / fixture adoption with rollback readback and no production adoption, canon, provider, publishing, or production generation.
  - Effect: `fff-sandbox-adoption-mutation-one-claim-001` adds `docs/review/sandbox-adoption-mutation-one-claim.md`, `artifacts/sandbox-adoption-mutation-one-claim-result.json`, and `node tools/fff-state.mjs smoke-sandbox-adoption-mutation-one-claim ...`; it records one sandbox row moving from `adoption_candidate_dry_run` to `sandbox_adopted_fixture`, stores rollback token `rollback-sandbox-adoption-moth-key-label-to-adoption-candidate-dry-run`, and keeps production adopted claims, canonized claims, Profile / Claim / Timeline / Story Seed production mutations, provider/API calls, credentials, publishing, and production generation at zero or false.

- Decision: Rehearse sandbox adoption rollback without production rollback.
  - Reason: Before any production adoption can be considered, the previously sandbox-adopted fixture row needs a deterministic rollback readback proving the expected token and transition remain available without touching production state.
  - Effect: `fff-sandbox-adoption-rollback-rehearsal-001` adds `docs/review/sandbox-adoption-rollback-rehearsal.md`, `artifacts/sandbox-adoption-rollback-rehearsal-result.json`, and `node tools/fff-state.mjs smoke-sandbox-adoption-rollback-rehearsal ...`; it records one sandbox rollback rehearsal row for `multi-claim-moth-key-label`, verifies token `rollback-sandbox-adoption-moth-key-label-to-adoption-candidate-dry-run`, records `sandbox_adopted_fixture -> adoption_candidate_dry_run`, keeps production rollback performed=false, and keeps production adopted claims, canonized claims, Profile / Claim / Timeline / Story Seed production mutations, provider/API calls, credentials, publishing, and production generation at zero or false.

- Decision: Prepare a production adoption authorization packet without approving adoption.
  - Reason: The rollback-rehearsed candidate can now be reviewed for possible production adoption, but actual production mutation still needs explicit freeform user approval for target class, mutation behavior, rollback owner, and rollback descriptor.
  - Effect: `fff-production-adoption-authorization-packet-001` adds `docs/review/production-adoption-authorization-packet.md`, `artifacts/production-adoption-authorization-packet-result.json`, and `node tools/fff-state.mjs smoke-production-adoption-authorization-packet ...`; it proposes Profile, Claim Ledger, Timeline, and Story Seed target classes, recommends Claim Ledger first, records missing user authorization fields, keeps production adoption approved=false, canon approved=false, provider approved=false, publishing approved=false, external API approved=false, and performs 0 production mutations.

## 2026-06-30

- Decision: Adopt exactly one claim into the production Claim Ledger readback.
  - Reason: The user authorized recommended path A for `multi-claim-moth-key-label`, limited to Claim Ledger only, with before/after readback and rollback descriptor required while canon, Profile, Timeline, Story Seed, provider/API, credential, publishing, and production generation remain unauthorized.
  - Effect: `fff-production-claim-ledger-adoption-one-claim-001` adds `docs/review/production-claim-ledger-adoption-one-claim.md`, `artifacts/production-claim-ledger-adoption-one-claim-result.json`, and `node tools/fff-state.mjs smoke-production-claim-ledger-adoption-one-claim ...`; it records one Claim Ledger row moving `adoption_candidate_dry_run -> production_claim_ledger_adopted`, stores rollback token `rollback-production-claim-ledger-adoption-moth-key-label-to-adoption-candidate-dry-run`, keeps Profile / Timeline / Story Seed mutation counts at 0, keeps canonized claims at 0, keeps provider/API/credential/publishing/production generation false, and adopts no additional claim.

- Decision: Rehearse production Claim Ledger rollback descriptor without performing rollback.
  - Reason: The existing production Claim Ledger adoption row now needs a rollback-readiness proof, but the user explicitly limited this slice to non-destructive readback; actual rollback, row removal, canon, non-Claim-Ledger mutation, provider/API, credential, publishing, and production generation remain unauthorized.
  - Effect: `fff-production-claim-ledger-rollback-rehearsal-001` adds `docs/review/production-claim-ledger-rollback-rehearsal.md`, `artifacts/production-claim-ledger-rollback-rehearsal-result.json`, and `node tools/fff-state.mjs smoke-production-claim-ledger-rollback-rehearsal ...`; it inspects one adopted Claim Ledger row, verifies rollback token `rollback-production-claim-ledger-adoption-moth-key-label-to-adoption-candidate-dry-run`, records rollback target status `adoption_candidate_dry_run`, keeps actual rollback operations at 0, keeps production Claim Ledger rows removed at 0, keeps the row retained, keeps Profile / Timeline / Story Seed mutation counts at 0, keeps canonized claims at 0, and keeps provider/API/credential/publishing/production generation false.

## 2026-07-01

- Decision: Prepare downstream target authorization after Claim Ledger adoption without mutating downstream targets.
  - Reason: The retained production Claim Ledger row and verified rollback descriptor are enough to present the next target-class choice, but Profile, Timeline, Story Seed, Canon decision, provider/API, credential, publishing, production generation, additional-claim adoption, and actual rollback still need separate explicit freeform authorization.
  - Effect: `fff-downstream-target-authorization-packet-001` adds `docs/review/downstream-target-authorization-packet.md`, `artifacts/downstream-target-authorization-packet-result.json`, and `node tools/fff-state.mjs smoke-downstream-target-authorization-packet ...`; it confirms `multi-claim-moth-key-label` remains `production_claim_ledger_adopted`, rollback descriptor status is `verified`, the Claim Ledger row is retained, Profile / Timeline / Story Seed / Canon decision target classes are listed, Profile is recommended as the next target, user authorization remains required, downstream mutations stay 0, Profile / Timeline / Story Seed mutation counts stay 0, canonized claims stay 0, and provider/API/credential/publishing/production generation stay false.

- Decision: Adopt exactly one retained Claim Ledger row into a non-canon Profile annotation.
  - Reason: The user authorized recommended path A from the downstream target authorization packet for `multi-claim-moth-key-label`, limited to Profile only, with before/after readback and rollback descriptor required while Timeline, Story Seed, canon, provider/API, credential, publishing, production generation, actual rollback, and additional-claim work remain unauthorized.
  - Effect: `fff-profile-adoption-mutation-one-claim-001` adds `docs/review/profile-adoption-mutation-one-claim.md`, `artifacts/profile-adoption-mutation-one-claim-result.json`, and `node tools/fff-state.mjs smoke-profile-adoption-mutation-one-claim ...`; it records one Profile annotation row for `multi-profile-brass-moth-key`, records `claim_ledger_adopted -> profile_adopted_noncanon`, stores rollback token `rollback-profile-adoption-moth-key-label-to-claim-ledger-only`, keeps Claim Ledger additional adoption count 0, keeps Timeline / Story Seed mutation counts 0, keeps canonized claims 0, and keeps provider/API/credential/publishing/production generation false.

## 2026-07-06

- Decision: Create a One-story Draft Review Pack from the Designer Dashboard without waiting for human candidate selection.
  - Reason: The dashboard already exposes viable content and channel candidates, and the next reviewable product step is an end-to-end draft packet; blocking on selection would stall a reversible local review slice.
  - Effect: `fff-one-story-draft-review-pack-001` adds `public/review/index.html?mode=draft`, `docs/review/one-story-draft-review-pack.md`, `artifacts/one-story-draft-review-pack-result.json`, and `node tools/fff-state.mjs smoke-one-story-draft-review-pack ...`; it selects `designer-content-moth-investigation-3m` as `provisional_default`, keeps sample prose non-final and non-canon, preserves `fff-designer-candidate-dashboard-001`, and keeps provider/API/credential/publishing/video/final-canon boundaries closed.

- Decision: Add a stabilization checkpoint for the Designer Dashboard and One-story Draft Review Pack.
  - Reason: Both review surfaces existed locally but still needed durable access/readback evidence and product-only git separation before the next worker or reviewer used them.
  - Effect: `fff-draft-review-pack-stabilization-001` adds `docs/review/draft-review-pack-stabilization.md` and `artifacts/draft-review-pack-stabilization-result.json`; it records verified-present static access for `public/review/index.html?mode=designer` and `public/review/index.html?mode=draft`, preserves `fff-designer-candidate-dashboard-001`, `fff-one-story-draft-review-pack-001`, and `fff-contradictory-claim-guard-001`, classifies `.serena/project.yml` as unstaged transport residue, and keeps draft-to-video, provider/API, credential, publishing, video generation, production render, and final canon boundaries closed.

- Decision: Add a Review Brief default mode and dark-mode compatibility without starting draft-to-video planning.
  - Reason: The existing Draft Review Pack and Designer Dashboard were reviewable but too detail-heavy as the first impression; the next useful work was to make the selected candidate, selected channel route, Japanese review brief, and next human decisions immediately discoverable while preserving the detailed panels.
  - Effect: `fff-review-brief-dark-mode-ux-001` adds `public/review/index.html?mode=brief`, `docs/review/review-brief-dark-mode-ux.md`, `artifacts/review-brief-dark-mode-ux-result.json`, and `node tools/fff-state.mjs smoke-review-brief-dark-mode-ux ...`; it keeps `fff-designer-candidate-dashboard-001`, `fff-one-story-draft-review-pack-001`, and `fff-draft-review-pack-stabilization-001` preserved, adds Light / Dark / Auto theme controls, and keeps draft-to-video, provider/API, credential, publishing, video generation, production render, and final canon boundaries closed.

- Decision: Add a local Draft-to-Video Planning Bridge with a mandatory Review Brief prelude.
  - Reason: The reviewer needs a production-planning surface for the selected 3-minute mystery-lore route, but the project still must not imply provider/API setup, AI video generation, render, upload, rights clearance, or final canon acceptance.
  - Effect: `fff-draft-to-video-planning-bridge-001` adds `public/review/index.html?mode=bridge`, `docs/review/draft-to-video-planning-bridge.md`, `artifacts/draft-to-video-planning-bridge-result.json`, and `node tools/fff-state.mjs smoke-draft-to-video-planning-bridge ...`; it preserves `designer-content-moth-investigation-3m` and `designer-channel-mystery-lore`, adds the Review Brief route contract, applies dark contrast hotfixes, exposes narration/text/visual/thumbnail/sound/rights/held-truth/reviewer-decision planning content, and keeps provider/API, credential, publishing, AI video generation, production render, rights-clearance, and final canon boundaries closed.

- Decision: Refresh repo-local restart handoff and readback validation after the Draft-to-Video Planning Bridge.
  - Reason: Another terminal must be able to resume from repository files and remote `master` without relying on chat history, while the local `.serena/project.yml` transport residue remains outside product scope and auxiliary readbacks must validate under the current active artifact.
  - Effect: The refresh starts from synced head `ffc3c5c`, updates `docs/review/next-terminal-handoff.md`, `docs/project-context.md`, and `docs/review/current-status.md` with the current active artifact, parity check, restart path, and `.serena/project.yml` exclusion; it also updates `tools/fff-state.mjs`, `artifacts/artifact-manifest.json`, `public/review/index.html`, and generated result readbacks so preserved guard/provider/translation/adoption evidence validates while `fff-draft-to-video-planning-bridge-001` remains active. No provider/API, credential, upload, AI video, render, rights-clearance, or final canon decision changes are added.

- Decision: Add a Review Home Map with shelf meters before asking for Bridge review.
  - Reason: The Bridge and Review Brief were present, but the folded Source Audit / Project Cockpit / Artifacts shelves still felt like information pushed into a closet; the first screen needed to explain what each shelf is for, when to open it, and which route matters now.
  - Effect: `fff-review-home-map-meters-001` adds `public/review/index.html?mode=home`, `docs/review/review-home-map-meters.md`, `artifacts/review-home-map-meters-result.json`, grouped Primary / Story / Evidence navigation, seven shelf cards, seven meters, measured-vs-hypothesis meter semantics, and `node tools/fff-state.mjs smoke-review-home-map-meters ...`; it keeps `public/review/index.html?mode=bridge` as the production-hypothesis surface, preserves Review Brief, Designer Dashboard, Draft Review Pack, Stabilization, and Contradictory Claim Guard readbacks, and keeps provider/API, credential, upload, AI video, render, rights-clearance, and final canon boundaries closed.

- Decision: Promote the default Review Brief route into a Home Cockpit with actionable readiness meters.
  - Reason: After the shelf map, the next bottleneck is still user-side orientation: the reviewer should not need to choose between Home, Brief, and Bridge as separate first stops. The default route should show the operator path, optional workbench/evidence shelves, and locked production lanes in one place.
  - Effect: `fff-home-cockpit-metric-linking-001` makes `public/review/index.html?mode=brief` and no-query access open the Home Cockpit, keeps `public/review/index.html?mode=home` as a compatibility alias, adds Operator Track / Workbench / Evidence Vault / Locked Lanes groups, links nine readiness meters to Bridge, Workbench, Evidence Vault, or Locked Lane actions, adds `docs/review/home-cockpit-metric-linking.md`, `artifacts/home-cockpit-metric-linking-result.json`, and `node tools/fff-state.mjs smoke-home-cockpit-metric-linking ...`, while preserving Bridge, Review Brief, Review Home Map, Draft Review Pack, Designer Dashboard, Stabilization, and Contradictory Claim Guard readbacks and keeping provider/API, credentials, upload, AI video, render, rights-clearance, and final canon boundaries closed.

- Decision: Add a lightweight Latest Overview Report and Bridge refinement without rebuilding the Review Hub.
  - Reason: User review said the organization improved but still made many surfaces feel parallel; the reviewer needs the latest state before comprehensive lists, while the user explicitly asked not to over-invest in a full information-architecture pass.
  - Effect: `fff-bridge-refinement-overview-ribbon-001` adds a 5-item Latest Overview Report to `public/review/index.html?mode=brief`, demotes the old Review Brief into a folded preserved shelf, adds a Bridge back-to-overview reference, refines Bridge with non-final narration, subtitle rhythm, visual order, thumbnail alternatives, held-truth policy, and rights/asset boundary cues, adds `docs/review/bridge-refinement-overview-ribbon.md`, `artifacts/bridge-refinement-overview-ribbon-result.json`, and `node tools/fff-state.mjs smoke-bridge-refinement-overview-ribbon ...`, while keeping provider/API, credentials, upload, AI video, render, rights-clearance, and final canon boundaries closed.

- Decision: Add a Guided Review Flow Workspace before the Home Cockpit card shelves.
  - Reason: Supervisor review marked the latest overview and Bridge refinement as pass, but the next user-side task still needed a more directed workspace so the reviewer sees one sequence instead of another set of parallel panels.
  - Effect: `fff-guided-review-flow-workspace-001` adds a first-visible Guided Review Flow, six-step Decision Queue, one Bridge action, Pinned Tray, Operations Notice, Important Folders, Inspiration Workspace, Bridge Guided Flow, `docs/review/guided-review-flow-workspace.md`, `artifacts/guided-review-flow-workspace-result.json`, and `node tools/fff-state.mjs smoke-guided-review-flow-workspace ...`, while preserving the Latest Overview Report, Bridge refinement, dark mode, candidate/channel IDs, Evidence Vault optionality, and all provider/API, credentials, upload, AI video, render, database, rights-clearance, and final-canon boundaries.

## 2026-07-07

- Decision: Replace the first visible `brief` surface with a Low-text Decision Console.
  - Reason: User-side feedback said the guided workspace still felt like mass notes or lecture notes, and repeated "this time" phrasing made the review path feel heavy instead of decision-first.
  - Effect: `fff-low-text-decision-console-001` adds one route question, five short choice buttons, one `Bridgeで確認` action, context chips, a six-step rail, closed detail/notes shelves, Bridge Decision Console, `docs/review/low-text-decision-console.md`, `artifacts/low-text-decision-console-result.json`, and `node tools/fff-state.mjs smoke-low-text-decision-console ...`, while preserving the Guided Review Flow, Latest Overview Report, Bridge refinement, Home Cockpit, dark mode, candidate/channel IDs, Evidence Vault optionality, and all provider/API, credentials, upload, AI video, render, database, rights-clearance, and final-canon boundaries.

- Decision: Add a Layout Research Lab before applying another review UI shell.
  - Reason: User-side feedback said the low-text console was cleaner but still constrained by card-format thinking, parallel information weight, and hardcoded route choices; the next step needed layout comparison and a stronger decision shell before script/subtitle/thumbnail refinement.
  - Effect: `fff-layout-research-decision-shell-001` adds `public/review/index.html?mode=layout-lab`, compares Card-first, Briefing Inbox, Split-pane Decision Shell, and Storyboard Flow wireframes, records a five-family heuristic score matrix, recommends the split-pane Decision Shell, renders a local `decisionFlowModel` choice slot, adds `docs/review/layout-research-decision-shell.md`, `artifacts/layout-research-decision-shell-result.json`, and `node tools/fff-state.mjs smoke-layout-research-decision-shell ...`, while preserving `brief`, `bridge`, all prior review artifacts, dark mode, Evidence Vault optionality, and all provider/API, credentials, upload, AI video, render, database, rights-clearance, and final-canon boundaries.
