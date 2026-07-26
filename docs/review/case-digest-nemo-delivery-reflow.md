# CASE_DIGEST Nemo style-10000 delivery reflow

`fff-case-digest-nemo-delivery-reflow-001` は、Product Owner が exact
attempt-3 candidate を聴取して示した delivery 所見を反映する private local
candidate です。受容済み CASE_DIGEST の事実・5 section・11 shot・visible
caption・subtitle・Raster image・motion・transition は変更していません。

## Before / after

Before は style `10007` の5 section-blockを各 section 冒頭へ置いた
180秒 candidateでした。00:48–01:00 は全12秒が無音で、01:58.416–02:16.350
には17.933秒の連続無音がありました。`真鍮の蛾` は
`しんちゅうのが` と読み、聴取時に識別しにくい状態でした。

After は style `10000` の22 utteranceをzero-based/end-exclusive source spanで
管理し、11 shotすべてへ配置しています。内部最大 gap は `5.000` 秒、中央値は
`4.926` 秒、overlapと重複発話は0です。00:48–01:00 内の最大連続無音は
`4.250` 秒、01:50–02:20 内は `5.000` 秒です。

## Product Owner listening evidence

所見は
`artifacts/case-digest-nemo-delivery-reflow/owner-listening-observation.json`
に、attempt `3`、commit
`63fb60c505952377455536d9dd84cb164d3b3a0c`、style-10007 full candidate
SHA256、style-10000の5 section sample/query SHA256と結び付けて記録しました。

- 次候補のpreferred styleは`10000`
- exact current deliveryにおけるnot-preferred styleは`10007`と`10001`
- section-block placementはrejected
- final voice selectionとproduction voice approvalは未成立

この所見は、各styleの将来の全用途を一般化して棄却する判断ではありません。

## Synthesis and source spans

主音声の全イベントは Nemo `0.24.0` / UUID
`208cf94d-43d2-4cf5-abc0-9783cac36d29` / style `10000` を使用しました。
全queryは `speedScale=1.0`、`pitchScale=0.0`、
`intonationScale=1.0`、`volumeScale=1.0` です。time-stretch、music、
ambience、SFXは0です。

exact 22-row mappingは
`artifacts/case-digest-nemo-delivery-reflow/narration-utterance-map.csv` にあります。
各section内で `source_text_ja` を連結すると、受容済みのsection本文へ
byte-for-byteで戻ります。固有名、`9:17`、`真鍮の蛾`、number/unit、
noun/required-particleを途中分割していません。

## Silence contract

| Section | Window | Utterances | Head gap | Tail gap |
|---|---:|---:|---:|---:|
| 1 事件 | 0–24 | 3 | 0.250 s | 3.398 s |
| 2 調査者と手掛かり | 24–65 | 6 | 0.250 s | 4.500 s |
| 3 記録 | 65–97 | 4 | 0.426 s | 4.500 s |
| 4 疑いと証拠限界 | 97–136 | 5 | 0.250 s | 4.500 s |
| 5 現在の事件状況 | 136–180 | 4 | 0.250 s | 5.500 s |

`silence-gap-audit.csv` はleading、21 internal、final-tail gapを記録します。
内部 gapは全て`0.943–5.000`秒で、10秒以上のgap、overlap、duplicated speechは
ありません。配置探索で不成立だった2つのpartial runは再生候補にせず、
repository-external rejected siblingとして保持しています。

## Brass-moth reading

visible sourceは `真鍮の蛾` のままです。local TTS queryだけで
`しんちゅうでできた、ガ` を使用し、現行読み、改訂読み、40秒付近の全文を
まとめた11.068秒のcomparison WAVを作成しました。

- comparison SHA256:
  `fd2796bb15492ba4d73211b775b2201b2fb0a4a97a1fd07978521e12331d56e5`
- signal: 48 kHz mono / `-19.05` LUFS / `-1.20` dBTP / clipping 0
- perceptual acceptance: 未実施

## External review artifacts

- Run root:
  `D:\AI-Runs\FastFictionFactory\fff-case-digest-nemo-delivery-reflow-001`
- Narration WAV:
  `recommended\case-digest-narration-style-10000.wav`
- Audio-inclusive MP4:
  `recommended\case-digest-nemo-delivery-reflow.mp4`
- Review HTML:
  `recommended\case-digest-nemo-delivery-reflow.html`

Narration WAVは180.000秒 / PCM / 48 kHz / mono / `-19.15` LUFS /
`-1.20` dBTP / clipping 0 / SHA256
`e3db719f4f5aed766ca18b7c77af35f64693cf4a479298325f3f8fa017bd266c`
です。

MP4は180.000秒 / 5400 frame / H.264 960×540 30 fps / AAC audio 1 /
subtitle 1 / cue 11 / chapter 0 / SHA256
`cd245bec74df93bb8af98db966cb6835bc0ef9c504bf0a24e5cb692ee858ac4c`
です。source/output video elementary stream SHA256はともに
`7ba966a1c201ec4d6ec335f28aa1f1e3604e8bf2dd1d05e5e9f8d63c181a8f13`、
subtitle stream SHA256はともに
`cd9de24747d6a6c0a759d32589fd762d75fd22cdfd38689584dea4d56781c733`
です。

## Browser and offline evidence

HTMLはnative video/audio controlsを持ち、networkとserverを恒常的に必要とせず、
autoplayしません。自動検査は一時loopback HTTP上で全mediaをpausedのまま実行し、
終了後にserverを停止しました。

| Viewport | Overflow | Nested vertical scroll | Seek/readout | Errors |
|---|---:|---:|---|---:|
| 1440×1000 | 0 px | 0 | 38.000 s / section 2 / shot-b02-02 | 0 |
| 390×844 | 0 px | 0 | 110.000 s / section 4 / shot-b04-01 | 0 |

keyboard focusは3 px solid outlineを確認しました。console error、
page error、autoplay attributeは0です。Nemo engine、一時server、port
50121/41737 listenerは終了済みです。合成時のexternal network request、
credential、payment、installは全て0です。

## Immutability and gates

source script、source JSON、visible caption CSV、subtitle draft CSV、shot CSV、
transition map、選択11 image、source MP4は開始時identityと一致します。
tracked WAV/AAC/MP4/VVPP/ZIP/executable/modelは0です。

| Purpose | Effect | Requirements | State | Owner | Next move |
|---|---|---|---|---|---|
| Human voice-quality review | style-10000 deliveryと発音の聴感を判定 | full candidateとbrass-moth sampleを聴取し、findingをutterance/shot/timestampへ結ぶ | OPEN | Product Owner / human reviewer | accept、revision、rejectの所見をexact artifact hashへ記録 |
| Final voice selection | 採用voice identityを固定 | human voice-quality reviewと明示的selection decision | CLOSED | Product Owner | 本candidateの技術greenだけでは選択しない |
| Production approval | voice付きmediaをproduction入力へ昇格 | final voice selection、production判断、必要な権利確認 | CLOSED | Production owner | 別authorityで判断 |
| Rights clearance | production/release用途を許可 | 利用条件と全media rightsのowner/legal確認 | CLOSED | Rights owner | production用途が定まった後に審査 |
| Release / publication | 外部配布・公開を許可 | production、rights、releaseの全承認 | CLOSED | Release owner | 本private runから実行しない |
| Final canon | voice付き版をcanonへ昇格 | human acceptanceとowner canon decision | CLOSED | Product Owner | 別の明示判断までfalseを維持 |
