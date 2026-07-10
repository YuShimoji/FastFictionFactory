# Active Idea Ledger

この ledger は未完了の選択肢だけを持ちます。完了した作業は [decision-log.md](decision-log.md) と [Artifact Inventory](local-view/artifacts.md) に残し、ここへ保存し続けません。

## いま選べる入口

| 入口 | 狙い | 期待する変化 | 始める条件 | 現在 | 担う人 | 次の一手 |
| --- | --- | --- | --- | --- | --- | --- |
| **Explore — Product Direction Board** | 製品の主役を先に決め、完成後の修正沼を止める | Creator Desk / Storyboard Studio / World Archive の3方向を、layout、language、content、color/type、motion で比較できる | 既存 screenshot と UI を evidence にする。provider や DB は不要 | Ready / 最優先 | 監修AIが選択肢、実装AIが low-fi prototype、人間が一度だけ方向選択 | 3方向の同一内容 wireframe と token sample を一枚の review board にする |
| **Excise — Legacy Layer Cleanup** | first screen の新旧 layer、内部 ID、重複説明を減らす | story と次の制作判断が最初に見え、運用 metadata は drawer / dev docs へ下がる | active markers と必要な route を壊さない regression plan | Ready / direction board と併走可能 | 実装AI、削除判断は screenshot で人間確認 | stale shelf inventory を作り、keep / merge / remove を一度に決める |
| **Advance — One complete creation loop** | review 管理から実際の創作 workflow へ重心を戻す | memo → candidate → selected story → narration/subtitle/visual → package review を一続きで操作できる | Product direction の選択、既存 local guard の維持 | Waiting for direction | 実装AI、story truth は人間 | 選んだ shell 上で一つの3分 routeだけを end-to-end に通す |
| **Explore — Japanese-first multilingual system** | 日本語操作と multilingual source の混在を設計に変える | UI language、source language、translation、gloss、export language の役割が明確になる | original text を source-of-truth とする既存 policy | Ready as direction axis | 監修AIと実装AI、人間が primary language を選択 | Japanese-first / bilingual studio / source-language adaptive の3案を比較 |
| **Explore — Visual and motion identity** | 汎用 admin UI から fiction production 固有の体験へ移す | color、type scale、density、focus transition、story beat motion が一つの system になる | prefers-reduced-motion と contrast を守る。高 fidelity 前に方向選択 | Ready as direction axis | design exploration は実装AI、人間が mood を選択 | archival noir / editorial studio / cinematic timeline の token strip を作る |
| **Extend — Adjacent content formats** | 現在の story assets を別の出力へ無理なく伸ばす | 3分 video 以外に short、audio drama、character dossier、lore carousel を比較できる | 同じ source / canon / rights state を再利用する | Explore after core loop | 監修AIが機会比較、人間が audience と媒体を選択 | 一つの story から4 format の effort / reuse / risk matrix を作る |
| **Audit — Frontend and validator decomposition** | 9,773行 HTML と13,181行 validator の変更摩擦を下げる | route、component、fixture smoke を独立して変更・検証しやすくする | dependency / framework 追加なしの段階的 split。behavior parity が必要 | Ready after stale excision | 実装AI | 静的 module 分割案と characterization checks を作る |
| **Verify — Responsive, accessibility, performance** | desktop screenshot と marker smoke だけの確信を減らす | narrow viewport、keyboard、focus、contrast、reduced motion、load cost が測れる | 選択された first screen が存在する | Waiting for selected shell | 実装AI | 360 / 768 / 1440 px と Light / Dark の visual / interaction matrix を回す |

## 明示承認まで保留する入口

| 候補 | 価値 | 先に必要な判断 | 保留理由 | 再開条件 |
| --- | --- | --- | --- | --- |
| Real provider extraction | memo から実候補を生成する | provider、model、credential、endpoint、transport、timeout、retry、cost | external call と secret を伴う | 人間が provider package を明示承認 |
| Durable project storage | 複数 session / project を保持する | file-backed / SQLite / browser、schema、migration、backup | data contract と rollback に影響 | storage decision packet を承認 |
| Timeline / Story Seed / canon adoption | reviewed claim を物語構造へ進める | target、mutation、rollback、unresolved dependency | story authority に影響 | 対象ごとの人間承認 |
| Video generation / publishing | reviewed package を成果物へする | provider、asset rights、render、upload、release owner | external side effect、rights、cost | production authorization と release gate |

## 選択の推奨順

1. Product Direction Board で一度だけ意向を確認する。
2. 選択結果と同時に Legacy Layer Cleanup を行う。
3. One complete creation loop を一つの story / format で完成させる。
4. その画面を Responsive / accessibility / performance で検証する。

この順序なら「大きな成果物を一案で作る → 意向違い → 微修正連鎖」ではなく、「安価な方向比較 → 一度の選択 → end-to-end 実装 → acceptance」の一巡になります。
