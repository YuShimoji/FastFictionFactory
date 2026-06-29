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
