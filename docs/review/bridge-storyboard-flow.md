# Bridge Storyboard Flow

## Outcome

`fff-bridge-storyboard-flow-001` makes a six-beat, Japanese-first Storyboard Flow the first substantive surface at `public/review/index.html?mode=bridge`. The human operator observation that the Workbench is accepted but the page below remains long and dense closes the `OPERATOR_FIRST` gate and selects `BRIDGE_STORYBOARD_FLOW` as the forward product lane.

This is a local planning and review surface. It is not a final script, production storyboard, generated asset set, render, upload, rights clearance, or canon decision.

## Source Contract

- Preserved Workbench: `fff-review-workbench-component-contract-001`
- Preserved planning bridge: `fff-draft-to-video-planning-bridge-001`
- Preserved overview/refinement: `fff-bridge-refinement-overview-ribbon-001`
- Preserved draft pack: `fff-one-story-draft-review-pack-001`
- Preserved designer selection: `fff-designer-candidate-dashboard-001`
- Preserved guard: `fff-contradictory-claim-guard-001`
- Candidate: `designer-content-moth-investigation-3m`
- Channel: `designer-channel-mystery-lore`

## Storyboard Contract

The active Flow has exactly six planning beats. The time windows are editorial hypotheses for a roughly three-minute package, not locked production timing.

| # | 日本語タイトル | Time | Story purpose | Held truth / uncertainty |
| --- | --- | --- | --- | --- |
| 1 | 鐘のない塔 | 00:00-00:20 | 鐘がないのに鳴る矛盾だけを置くフック | 鳴る理由とwinter curfewの真相は未確定 |
| 2 | 真鍮の蛾 | 00:20-00:50 | Miraの欠落をTomaのメモと物の手がかりへ結ぶ | Tomaの生死と蛾の機能は保留 |
| 3 | 消された名前 | 00:50-01:20 | ledger、失われた時間、忘れられた人々を調査線で結ぶ | ledgerの関係は制作仮説 |
| 4 | 評議会の影 | 01:20-01:45 | 制度側の圧力を強めつつ単純な悪役証明を避ける | Councilの動機と責任範囲は保留 |
| 5 | 答えを保留 | 01:45-02:35 | Toma / moth / Councilの複数解釈を並べる | 三つの答えをhuman-ownedのまま保留 |
| 6 | 時間か、名前か | 02:35-03:00 | 結末ではなく次の判断を促す問いで閉じる | ending candidateでありfinal canonではない |

Each beat exposes its number, Japanese title, time window, story purpose, narration cue, subtitle cue, visual intent, held-truth boundary, and rights/asset note in one active canvas.

## Interaction Contract

- The compact six-beat rail keeps the whole order visible.
- Selecting a beat updates one active canvas instead of adding six parallel cards.
- Previous and next controls traverse the same ordered model.
- Arrow Left / Right and Arrow Up / Down move one beat; Home / End move to the first / last beat.
- One `Briefへ戻る` control returns to `public/review/index.html?mode=brief`.
- The next review action is singular: accept, revise, or return this six-beat order and timing allocation.
- The former Bridge Decision Console, Guided Flow, overview reference, refinement cards, and comprehensive bridge grid remain available inside one collapsed supporting-evidence section.

## Visual and Information Architecture

The route identity, candidate, channel, and planning-only status stay compact above the Flow. At approximately 900 CSS pixels, the rail and active canvas remain on a shared responsive surface with no horizontal scrolling; smaller widths stack the rail before the canvas. Dark mode and visible keyboard focus remain part of the preserved review shell.

## Boundary Gates

- local only: open
- external calls / provider configuration / credentials: closed
- AI video generation / production render / upload: closed
- database persistence: closed
- final canon: closed
- rights-cleared claim: closed
- actual image, audio, font, footage, and final visual selection: not performed

Rights notes are planning warnings. Their presence does not imply asset provenance or clearance.

## Validation and Regeneration

Read-only validation:

```powershell
node tools/fff-state.mjs validate-bridge-storyboard-flow artifacts/bridge-storyboard-flow-result.json
```

Intentional tracked-result regeneration only:

```powershell
node tools/fff-state.mjs smoke-bridge-storyboard-flow artifacts/bridge-storyboard-flow-result.json artifacts/bridge-storyboard-flow-result.json
```

The manifest validation chain uses only the read-only command. Screenshot evidence is stored at `artifacts/review-screens/bridge-storyboard-flow.png` (900x1200, 185233 bytes, SHA256 `64626FD09CE077AEFBE9D0A42212197247CE464CEC9925E2D337BF1C481614AC`) and records layout/readability only.

## Review Debt

- Overall page length and lower-page density remain acknowledged, non-blocking Review Debt. The active Flow fixes the Bridge first screen without reopening a whole-page redesign.
- Human review still owns whether the six-beat order and timing should be accepted, revised, or returned.
- Toma fate, brass moth truth/function, Council motive, and the ending route remain unresolved.
- Final narration performance, subtitle typography, imagery, audio, fonts, motion, and asset rights are outside this slice.
