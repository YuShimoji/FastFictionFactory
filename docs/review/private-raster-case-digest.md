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
| targeted negative | 21/21 | scope・権限・字幕・transitionの逸脱を拒否 |

## 旧形式の扱い

旧six-beat narrative、20 review caption、20 production subtitle draft cue、forced-choice closureは `FFF-Q-3MIN-LINEAR-LORE-EXPOSITION-2026-07-26` へ隔離しました。旧package自体は歴史証跡として変更していません。19 accepted images、3 anchor、terminal-frame transition methodは保持対象です。

## 人が判断する場合のpacket

HTMLを開き、5 sectionの事実と未確認事項の区別、11 shotとの対応、狭幅字幕の読みやすさを確認できます。この確認が行われるまでhuman comprehension reviewは未実施です。確認を行ってもproduction selection、rights clearance、publication、voice、final canonは別gateです。

## 開く

- `start "" "artifacts/private-raster-case-digest/private-raster-case-digest.html"`
- `start "" "artifacts/recurring-element-continuity/recurring-element-continuity.html"`
- `start "" "artifacts/recurring-element-continuity/recurring-element-contact-sheet.jpg"`
