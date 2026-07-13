# Operator Production Brief

## 読む人が一巡で分かる状態

`fff-operator-production-brief-001` は、機械監査向けの
`fff-content-production-blueprint-001` を、非専門家が同じ
`public/review/index.html?mode=blueprint` で読める制作指示へ変換する。
Blueprint の数値、6幕・180秒の順序、19ショット、20字幕、3件の採用済み文言、
truth / rights 境界は変更しない。技術 Blueprint は `Audit & Files` に残し、
本文では何を作るか、規模、六幕の進行、画面の大きさと動き、完成条件を一つの
document scroll で説明する。

この Brief は provisional なローカル制作仮説である。production-approved、
canonical、rights-cleared、asset-selected、generated、rendered、uploaded、
published、database-persisted ではない。

## 4つの本文節

| 読む順番 | 答える問い | 人が得る判断 |
| --- | --- | --- |
| 制作するもの | 何を、どの規模で作るか | 3分、6幕、19ショット、20字幕と中心の問いを最初の画面で把握する |
| 六幕の流れ | 物語がどう進むか | 六幕を一続きで読み、選んだ一幕だけのショット詳細を通常ページフローで開く |
| 画面の文法 | どう見せ、どう動かすか | 5つの画面サイズと6つのカメラ動作を日本語・図・用途で理解する |
| 完成とみなす条件 | どこで終えるか | 観客が確認できる5条件で制作を止め、未解決の真実を守る |

機械 audit は第5節にしない。Focus Shell の `Audit & Files` は既定で閉じ、
技術 JSON、acceptance matrix、result、package、handoff への入口を一度だけ持つ。

## 人が確認する5条件

1. 3分間を通して中心の問いが理解できる。
2. 各幕が一つの主な考えを前へ進める。
3. 各ショットで最初に見る対象が一つに絞られている。
4. 字幕が主役の映像と競合しない。
5. 未解決の真実を未解決のまま保つ。

幕1・3・4・6の narration は後日の読み上げ確認対象で、現在の content failure
ではない。この slice では文言、尺、順序を変えない。

## Visual Grammar

画面サイズは全景 `wide`、中景 `medium`、寄り `close`、極端な寄り
`extreme_close`、図版全画面 `graphic_fullframe` の5つ。カメラ動作は固定
`locked`、ゆっくり寄る `slow_push`、ゆっくり引く `slow_pull`、横へ振る
`slow_pan`、奥行き差を動かす `controlled_parallax`、図版を溶かしてつなぐ
`graphic_dissolve` の6つ。英語 enum は secondary metadata で、日本語の意味、
用途、inline SVG diagram を制作上の入口にする。

## Package と検証

Human-facing package:

- `artifacts/operator-production-brief/README_OPERATOR_BRIEF.md`
- `artifacts/operator-production-brief/operator-production-brief.json`
- `artifacts/operator-production-brief/beat-story-map.csv`
- `artifacts/operator-production-brief/visual-grammar-guide.md`
- `artifacts/operator-production-brief/operator-completion-checklist.md`
- `artifacts/operator-production-brief/operator-brief-manifest.json`

Read-only validation:

```powershell
node tools/fff-state.mjs validate-operator-production-brief artifacts/operator-production-brief-result.json
```

Intentional regeneration:

```powershell
node tools/fff-state.mjs smoke-operator-production-brief artifacts/operator-production-brief-result.json artifacts/operator-production-brief-result.json
```

Smoke が書けるのは上記6ファイルと result JSON だけである。Handoff、Revision、
Derivative、Production Blueprint の28ファイルは pre/post byte と SHA256 で保護する。
通常 validation は package、source、result を書き換えない。

## Browser evidence

| Viewport | Document scroll | Primary child scroll | Horizontal overflow | Global counters / broad nav | First-view contract | Audit initial |
| --- | --- | ---: | --- | --- | --- | --- |
| 900x1200 | 6309 px | 0 | なし | 非表示 | 5条件＋後で読む（bottom 1080px） | closed |
| 1280x900 | 6189 px | 0 | なし | 非表示 | 5条件＋後で読む（bottom 809px） | closed |

Screenshots:

- `artifacts/review-screens/operator-production-brief-900x1200.png`
- `artifacts/review-screens/operator-production-brief-1280x900.png`

両 viewport で primary section 4、shot-scale diagram 5、camera-motion diagram 6、
SVG 11、selected beat 1、detail panel 1、visible raw machine key 0、console error / warning 0
を観測した。Light / Dark / Auto と keyboard focus は既存 contract を維持する。

## 保留する仕事

| 残す仕事 | 目的 | 必要条件 | 状態 | owner | 次の動き |
| --- | --- | --- | --- | --- | --- |
| Human comprehension review | 一巡後に5つの制作質問へ答えられるか確かめる | この H0 と freeform review | H1 ready / 未実施 | 人間 reviewer | `mode=blueprint` を一巡して言葉で回答する |
| Narration read-aloud | 幕1・3・4・6の読み上げ負荷を実測する | voice rehearsal | Deferred | 編集担当 | H1後に別 lane として実施する |
| Asset / Shot Brief | 実素材候補へ進める | H1受理と権利・asset境界の承認 | H2 blocked | 人間 owner | この slice では開始しない |
| Separate creator test | 別担当が一貫した提案を作れるか試す | H2 output | H3 external hypothesis | 制作 owner | 外部 gate として後で比較する |
| Production / rights / canon | 生成、render、公開、権利、最終真実へ進める | 個別の明示承認 | Closed | 人間 owner | 開かない |
