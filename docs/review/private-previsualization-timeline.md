# Private Previsualization Timeline

## Outcome

The exact accepted 180-second chronology is now playable as a local, silent previsualization. One canonical frame per source shot drives playback, the picture lane, the shot inspector, the contact sheet, and MP4 export. Requirement thumbnails are deterministic annotated derivatives of those frames.

## Exact contract

- 6 Beats / 19 shots / 180 seconds
- start 00:00 / end 03:00
- gap count 0 / overlap count 0
- narration segments 6 / subtitle cues 20
- all transition and camera-motion markers retained from the integrated source
- watermark: PREVIS / REFERENCE-ONLY / NOT FOR PUBLICATION

## Requirement thumbnail audit

| Requirement | Canonical source frame | Visible semantics |
| --- | --- | --- |
| AR-ENV-01 | shot-b01-01 | 鐘のない天文台と空の鐘枠 |
| AR-ENV-02 | shot-b04-03 | 半透明仕切りを含む中立的な制度空間 |
| AR-CHAR-01 | shot-b03-01 | 顔を特定しない台帳を開く手元 |
| AR-CHAR-02 | shot-b04-01 | 匿名の評議会シルエット |
| AR-CHAR-03 | shot-b05-01 | トーマの未確定シルエットと四候補 |
| AR-PROP-01 | shot-b02-03 | 時計面と9:17の時刻motif |
| AR-PROP-02 | shot-b05-02 | 静止した真鍮の蛾 |
| AR-PROP-03 | shot-b02-02 | 手書きのメモ／written note |
| AR-DOC-01 | shot-b03-02 | 架空台帳の名前欄と『分』欄 |
| AR-DOC-02 | shot-b05-03 | 同じ重みの候補図版システム |
| AR-ABS-01 | shot-b03-03 | 名前／文字輪郭が三段階で薄れる |
| AR-ABS-02 | shot-b06-01 | 時間と名前を46:8:46で等分 |
| AR-TYPE-01 | shot-b05-04 | 日本語firstの短いlabelとHOLD表示 |
| AR-AUDIO-01 | shot-b01-03 | 六幕のsilent cue位置。音声素材は含まない |

The four explicit repairs are AR-PROP-02 = visible brass moth, AR-PROP-03 = written memo, AR-ABS-01 = three fading name/letter contours, and AR-ABS-02 = equal time-versus-name split with an 8% undecided center. All 14 derived thumbnails have distinct hashes, so accidental duplicates are zero. Story motif returns remain labeled inside the source-frame metadata as callback or shared motif.

## MP4

- path: `artifacts/private-previsualization-timeline/private-previsualization-timeline.mp4`
- 960x540, h264, silent
- duration: 180s
- size: 1668241 bytes
- SHA256: `78c1b45498c25b873a757e04816257c42d31d4a53fd0c9905b50ae37a6022978`

## Runtime evidence

- 18/18 adjacent shot boundaries resolve to the expected before/at shot IDs.
- Arbitrary scrub at 93.2 seconds resolves to `shot-b04-02`.
- Home, End, ArrowRight, Space, previous/next shot, Beat jumps, and clip jumps operate against the same 180-second state.
- Desktop 1440×1000 and narrow 390×844 both keep the required working controls in the first viewport.
- Horizontal overflow is false and nested vertical scroll count is zero at both measured viewports.
- Visible focus and reduced-motion behavior pass; console/page errors are zero.
- Headless is true, muted is true, and audio/video element counts are zero.
- Screenshots: `artifacts/review-screens/private-previsualization-timeline-1440x1000-desktop.png`, `artifacts/review-screens/private-previsualization-timeline-390x844-narrow.png`.
- Read-only validation: `node tools/fff-state.mjs validate-private-previsualization-timeline artifacts/private-previsualization-timeline-result.json`.

## Boundaries

This is private reference-only previs. Production selection count and rights-cleared claim count remain zero. Ambiguous-license references `ref-b04-s03-closed-meeting-room`, `ref-b04-shared-general-ledger` are excluded from every rendered frame and the MP4. No media was downloaded, and all 28 predecessor source files remain hash-checked and unchanged.
