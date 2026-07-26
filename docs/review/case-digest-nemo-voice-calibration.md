# CASE_DIGEST VOICEVOX Nemo voice calibration

`fff-case-digest-nemo-voice-calibration-001` は、受容済みの無音
`fff-private-raster-case-digest-001` に対するprivate local voice calibrationです。
試行2で判明した通常版VOICEVOXのidentity mismatchを、公式
[VOICEVOX Nemo engine 0.24.0 release](https://github.com/VOICEVOX/voicevox_nemo_engine/releases/tag/0.24.0)
のWindows CPU VVPPで解消しました。再開した判断軸はNemo音声とdeliveryだけです。

## 成立した技術結果

| 対象 | 結果 | 意味 |
|---|---:|---|
| Nemo engine | 0.24.0 / UUID `208cf94d-43d2-4cf5-abc0-9783cac36d29` | 通常版engineとは異なるNemo identityを直接確認 |
| inventory | 9 speaker / 9 style | engineが返した全styleで日本語短文合成に成功 |
| calibration | 3 style × 5 section + pronunciation 3 | rawと-19 LUFS目安のreview copyをrepo外へ保存 |
| window fit | 15/15、overlap 0、speed adjustment 0 | 既存の5 section windowと本文を変更せず収容 |
| signal | clipping 0、true peak ≤ -1.2 dBTP | 15 review sampleが追跡した信号条件を満たす |
| provisional recommendation | style `10007` | 適格3候補のうちaggregate unused timing budgetが最小 |
| narration | 180.000秒 / 48 kHz mono | 5 sectionを指定位置に置き、残余は無音 |
| muxed MP4 | 180.000秒 / 5400 frame / audio 1 / subtitle 1 | source videoを再符号化せずAAC narrationを1本追加 |
| video identity | source/output elementary SHA256一致 | 映像stream bytesを保持 |
| review HTML | desktop 1440×1000 / narrow 390×844 | overflow 0、console warning/error 0、時刻・section・shot連動 |
| offline observation | 120 sample / external request 0 | download完了後のengine起動・合成はloopbackのみ |

style `10001`、`10000`、`10007` は、9 style共通短文の所要時間における
shortest、median、longestとして選びました。声質、年齢、性格、法的適合性は
engine metadataから推定していません。style `10007` の推薦も聴感受容ではなく、
全section fit、clipping 0、合成安定、pronunciation map互換、速度調整0、
aggregate timing deviation `64.176666` 秒という機械的根拠だけに基づきます。

## 読みとsource保護

原文は5 section、0–24、24–65、65–97、97–136、136–180秒のままです。
TTS requestだけで `9:17→9時17分`、`真鍮の蛾→しんちゅうのが`、
`市の評議会→しのひょうぎかい`、minutesの `「分」→「ふん」` を適用しました。
`ミラ・ヴェイル` は明示的に保持し、`CASE_DIGEST` は発話していません。
global dictionary、visible caption、subtitle、shot、Raster image、transitionは変更していません。

## 外部レビュー成果物

外部run rootは
`D:\AI-Runs\FastFictionFactory\fff-case-digest-nemo-voice-calibration-001`
です。WAV、audio-inclusive MP4、HTML、candidate sample、query、測定manifest、
browser screenshotはGit管理外です。HTMLはfileとして完結し、serverもnetworkも
必要としません。自動検証時はbrowser policyのため一時loopback配信を用い、
playerを終始停止したままscrubして配信processを終了しました。

## 利用条件と境界

[VOICEVOX Nemo](https://voicevox.hiroshiba.jp/nemo/) と
[VOICEVOX Nemo利用規約](https://voicevox.hiroshiba.jp/nemo/term/) の取得時内容を
hash付きで記録しました。利用時のクレジットには `VOICEVOX Nemo` が必要です。
機械学習用途の制限を記録しており、この作業はprivate calibrationに限定しています。
本記録は法的解釈やrights clearanceを表しません。

`final_voice_selected=false`、`production_voice_approved=false`、
`production_approved=false`、`rights_cleared_claim=false`、
`product_release=false`、`public_release=false`、`final_canon=false` です。

## 残るgate

| Purpose | Effect | Requirements | State | Owner | Next move |
|---|---|---|---|---|---|
| Human voice-quality review | voiceの聴感・固有名詞・間の良否を判断 | 3候補と5 section、pronunciation sampleの聴取 | OPEN | Product Owner / human reviewer | repo外HTMLで比較し、voiceを選ぶか差戻す |
| Production approval | 採用voiceをproductionへ入れる | human voice selectionとproduction判断 | CLOSED | Product Owner | voice selection後に別決定 |
| Rights clearance | 利用条件と素材権利をproduction用途へ確定 | terms再確認とowner/legal判断 | CLOSED | Rights owner | production用途が定まった後に別審査 |
| Release / publication | 外部配布・公開を許可 | production、rights、releaseの全承認 | CLOSED | Release owner | 本private packetからは実行しない |
| Final canon | voice付き版をcanonへ昇格 | human acceptanceとowner canon decision | CLOSED | Product Owner | 別の明示決定までfalseを維持 |
