# Private raster CASE_DIGEST review

`fff-private-raster-case-digest-001` は、旧clarity narrativeを継続せず、Product Owner指定のCASE_DIGESTへ提示形式を置き換えたprivate successor candidateです。既存19枚のaccepted primary imageは不変で、選択した11枚を180秒・5区分に再配置しました。

## 今回成立した機械的事実

| 検証対象 | 結果 | 効果 |
|---|---:|---|
| 尺 / frame | 180秒 / 5400 frame | 指定の180秒・5400 frameに固定 |
| shot / section | 11 / 5 | 指定順の11 shotを5 CASE_DIGEST sectionへ結合 |
| accepted image identity | 19一致 / 変更0 / 生成0 | 受容済みvisual bytesを保持 |
| transition boundary | 10件 / reset 0 / flash 0 | terminal-frame方式を選択timelineで再検証 |
| subtitle actual-width | 44測定 / failure 0 | 4表示条件で禁則・孤立行・固有名詞分断を防止 |
| continuity | 7 entry | 将来生成時の同一性条件を固定 |
| browser | desktop 1440px / narrow 390px | file HTML、shot境界、overflow、2行上限を検証 |
| targeted negative | 24/24 | scope・権限・字幕・transitionの逸脱を拒否 |

## 旧形式の扱い

旧six-beat narrative、20 review caption、20 production subtitle draft cue、forced-choice closureは `FFF-Q-3MIN-LINEAR-LORE-EXPOSITION-2026-07-26` へ隔離しました。旧package自体は歴史証跡として変更していません。19 accepted images、3 anchor、terminal-frame transition methodは保持対象です。

## 限定的な人間受入れ

- verdict: `FFF-SUP-CASE-DIGEST-C2-ACCEPT-20260726`
- observation: 「事件ダイジェストとして理解できます。字幕改行にも問題ありません。次へ進めてよいです。」
- accepted: CASE_DIGEST comprehension / review-caption wording and line-break/readability / unchanged existing image sequence and visual essence
- inherited from: human-review context `f817003ea2156817220225a1b25f39cbcd7b09f3` and exact C2 `2e96bd380d47869024587eeb19b3f054064390af` (tree `accfb3fc5474f4ecb2e39b5c4d69fd8de6a7e841`)
- unchanged proof: review-caption CSV、shot order/timings、subtitle-layout evidence、source-image identities、MP4 bytesはexact C2。HTMLのvisible markup/style/playback/captions/layoutはembedded state/decision metadataを除きexact C2です。
- integration candidate: `fff-case-digest-accepted-forward-integration-v1` at `refs/heads/codex/fff-case-digest-accepted-forward-integration-v1`, parent M2 `701869936943f9babd7d4d5287008b646106188b`

accepted creative contentの変更はfalseです。この受入れはproduction subtitle selection、production acceptance、rights clearance、publication、product/public release、voice/audio、final canon、master integrationへ拡張されません。

## 開く

- `start "" "artifacts/private-raster-case-digest/private-raster-case-digest.html"`
- `start "" "artifacts/recurring-element-continuity/recurring-element-continuity.html"`
- `start "" "artifacts/recurring-element-continuity/recurring-element-contact-sheet.jpg"`
