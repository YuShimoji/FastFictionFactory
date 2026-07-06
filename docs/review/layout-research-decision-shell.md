# Layout Research Decision Shell

Artifact: `fff-layout-research-decision-shell-001`

## Purpose

This slice responds to the user-side review that the low-text console is cleaner but still trapped by a card-format limitation: too many items feel equally valuable, the route choices are hardcoded, and the next decision needs a stronger layout shell before script/subtitle/thumbnail refinement continues.

Primary research route:

- `public/review/index.html?mode=layout-lab`

Preserved routes:

- `public/review/index.html?mode=brief`
- `public/review/index.html?mode=bridge`

This is local-only layout research. It does not replace the default `brief` or `bridge` surfaces yet.

## Research Sources

The comparison uses public UX references as heuristic inputs, not as proof that FFF users have been tested:

- NN/g, [Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/): keep the first display focused and move advanced material behind clear secondary access.
- NN/g, [Cards: UI-Component Definition](https://www.nngroup.com/articles/cards-component/): cards group related information well, but are weaker for scanning, ranking, and comparing many similar options.
- NN/g, [Wizards: Definition and Design Recommendations](https://www.nngroup.com/articles/wizards/): step flows reduce page complexity but can restrict review when users need back-and-forth comparison.
- NN/g, [Information Scent](https://www.nngroup.com/articles/information-scent/): labels and surrounding context shape whether users can tell where to go next.
- GOV.UK Design System, [Step by step navigation](https://design-system.service.gov.uk/patterns/step-by-step-navigation/): ordered journeys help when a process has a logical sequence and users need to complete tasks in order.

## Evaluation Axes

Each layout family is evaluated against these dimensions:

- Latest information grasp
- Important foldering
- Temporary pinning
- Operations notifications
- Inspiration workspace
- Decision-order guidance
- Dynamic choice extensibility
- Text-density control
- Evidence Vault compatibility
- Suitability for FFF now

## Layout Score Matrix

Scores are heuristic / hypothesis only: 3 = strong fit now, 2 = useful but incomplete, 1 = weak default fit.

| Layout family | Latest information grasp | Important foldering | Temporary pinning | Operations notifications | Inspiration workspace | Decision-order guidance | Dynamic choice extensibility | Text-density control | Evidence Vault compatibility | Suitability for FFF now |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Card grid / dashboard cards | 2 | 2 | 1 | 2 | 2 | 1 | 1 | 1 | 3 | Preserve below the shell as detail shelves, not as the first screen. |
| Stepper / wizard | 2 | 1 | 1 | 1 | 1 | 3 | 2 | 3 | 1 | Good for fixed order, but too linear for a review that may jump between route, narration, subtitles, thumbnail, and held truths. |
| Inbox / briefing feed | 3 | 3 | 2 | 3 | 2 | 2 | 2 | 2 | 2 | Useful for latest-first briefing and notices, but the active decision can still feel like another feed item. |
| Split-pane Decision Shell | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | Recommended default for FFF now. It separates decision order, active choice, context, and optional drawers. |
| Storyboard timeline / flow lane | 2 | 1 | 1 | 1 | 2 | 3 | 2 | 2 | 1 | Better as a Bridge subview after the route has been accepted. |

## Compared Layout Families

### Card grid / dashboard cards

Strength: card grids preserve many topics and make separate shelves easy to scan at a high level.

Failure for this moment: the reviewer sees Latest Overview, Bridge action, pins, folders, notices, inspiration, and locked lanes as a set of similarly weighted objects. That repeats the "everything is parallel" issue. Cards should remain for preserved details and Evidence Vault shelves, but they should not be the first visible decision surface.

### Stepper / wizard

Strength: a stepper makes the intended order clear and lowers visible text per step.

Failure for this moment: FFF review is not a pure form completion path. Route, narration, subtitles, visual order, thumbnail, and held-truth policy influence each other, so the reviewer may need to compare and jump back. A strict wizard can hide too much context.

### Inbox / briefing feed

Strength: an inbox is good for latest information grasp, operations notifications, important folders, and triage. It can make "what changed" easier to read than a card wall.

Failure for this moment: a feed still needs a stronger active decision object. Without a rail and context dock, the route question can become one row among many.

### Split-pane Decision Shell

Strength: this layout places one active decision in the center, decision order on the left, current pins/notices/locks on the right, and optional drawers at the bottom. It supports low text while keeping context visible.

This is the best current match because it:

- makes the current question visually dominant without deleting the rest of the review state
- keeps `designer-content-moth-investigation-3m` and `designer-channel-mystery-lore` pinned
- keeps provider/API, credentials, upload, AI video, production render, rights clearance, database persistence, and final canon locks visible
- moves Evidence Vault and old notes into drawers instead of competing panels
- lets future choices can be data-driven through `decisionFlowModel.choices` rather than hardcoded buttons

### Storyboard timeline / flow lane

Strength: a flow lane is strong for Bridge review once the route has been accepted, because narration, subtitle rhythm, shot order, and thumbnail can be judged as production sequence.

Failure for this moment: as the first shell, it risks making the work look like production planning before the route decision is approved.

## Recommended Layout: Split-pane Decision Shell

Recommendation confidence: medium-high.

The next product slice should apply the split-pane Decision Shell to `public/review/index.html?mode=brief`, while preserving `public/review/index.html?mode=bridge` as the next review action. If the shell reads better on `brief`, mirror the shell at the top of `bridge` for narration, subtitle rhythm, screen order, thumbnail direction, and held-truth policy.

Recommended structure:

- Left rail: route, narration, subtitle, visual order, thumbnail, held-truth policy.
- Center panel: one active decision question, data-driven choice slot, primary next action.
- Right dock: current pins, operations notices, locked lanes, route identifiers.
- Bottom drawers: Evidence Vault, preserved notes, inspiration workspace.

## Why Card-first Is Not The Default

Card-first failed as the default because it groups material but does not declare priority strongly enough. The current review question is not "which shelf should I browse"; it is "which decision should I answer next." A card grid makes each shelf look equally available, so the user must infer importance from copy and position.

Card surfaces remain useful for:

- Evidence Vault details
- historical artifacts
- optional Workbench panels
- Bridge sub-sections once a decision shell has chosen the active area

They should not control the first visible review route.

## Data-driven Choice Model

The local Layout Lab adds `decisionFlowModel` in `public/review/index.html`. It defines:

- `currentQuestion`
- `candidateRoute`
- `channelRoute`
- `nextAction`
- `choices`
- `steps`
- `pins`
- `locks`

The Decision Shell wireframe renders its choice list, step list, pins, and locks from that model. This proves the future shell can add, remove, or reroute choices without rewriting the visible button markup. No API, provider, model call, database persistence, or generated asset is introduced.

## Text-density guideline

For the future applied shell:

- one active question per center panel
- no more than six top-level choices
- each choice label under 18 Japanese display characters where possible
- context dock rows should be short pins, notices, or locks, not paragraphs
- drawers may hold longer notes, but should stay closed by default
- Evidence Vault should be a drawer or secondary route, not a peer of the active decision

## Evidence Vault Compatibility

Evidence Vault remains compatible if it is treated as a bottom drawer or secondary dock section:

- Source Audit opens only when evidence is questioned.
- Project Cockpit opens when boundary or gate state is questioned.
- Artifacts opens when readback files or validation logs are questioned.
- These shelves remain searchable and preserved but do not compete with the active route question.

## Future Apply Slice

Recommended next slice:

- `fff-apply-decision-shell-review-route-001`

Purpose:

- Apply the recommended Decision Shell to `public/review/index.html?mode=brief`.

Effect:

- Replace the first visible low-text console structure with left rail / center decision / right context dock / bottom drawers, while keeping the same route question and Bridge action.

Requirements:

- Preserve `fff-low-text-decision-console-001`, `fff-guided-review-flow-workspace-001`, `fff-bridge-refinement-overview-ribbon-001`, `fff-home-cockpit-metric-linking-001`, `fff-draft-to-video-planning-bridge-001`, `fff-review-brief-dark-mode-ux-001`, `fff-one-story-draft-review-pack-001`, `fff-designer-candidate-dashboard-001`, and `fff-contradictory-claim-guard-001`.
- Keep provider/API, credentials, upload, AI video, production render, rights clearance, database persistence, and final canon closed.

State:

- Proposed only; not implemented in this slice.

Owner:

- Product implementer for the shell; human reviewer for whether the shell is easier to use than the current low-text console.

Next move:

- Review `public/review/index.html?mode=layout-lab`, compare alternatives A-D, then approve or reject applying the split-pane Decision Shell to `brief`.

## Boundaries

This slice does not add or authorize:

- provider/API setup
- credentials
- AI video generation
- production render
- upload or publishing
- rights clearance
- final canon
- database persistence
- script, subtitle, thumbnail, video, or release asset generation

Toma fate, brass moth truth, Council motive, and moth-key function remain unresolved and human-owned.

## Readback

Machine readback is stored at:

```text
artifacts/layout-research-decision-shell-result.json
```

Smoke command:

```powershell
node tools/fff-state.mjs smoke-layout-research-decision-shell artifacts/layout-research-decision-shell-result.json artifacts/layout-research-decision-shell-result.json
```
