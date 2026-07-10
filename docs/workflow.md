# Fast Fiction Factory Workflow

この文書は、製品内の story workflow と、監修AI・実装AI・人間オーナーが開発を進める development workflow の正本です。Prompt は作業指示書の断片ではなく、ひとまとまりの成果と判断を委譲する契約として扱います。

## 1. Product flow

1. **Memo intake** — 生の物語メモをローカルへ取り込む。
2. **Candidate extraction** — 根拠箇所を保持した構造化候補を作る。現行は deterministic local adapter で、実 provider は未実装。
3. **Human review** — 候補を `adopt` / `provisional` / `hold` / `reject` に分ける。
4. **Story shaping** — Profile、Claim、Timeline、outline、narration、visual cue を相互参照しながら制作仮説を作る。
5. **Package review** — 1分 / 3分 / 10分 / series、または別媒体向けの構成を比較する。
6. **Production gate** — source、canon、rights、feasibility、typography、provider、publishing の条件を確認する。

警告や未決事項はローカル探索を止めません。production release、外部送信、final canon の確定だけを止めます。

## 2. Development operating model

### 基本原則

- 一つの work package は「一つのユーザー判断または一つの端から端までの workflow」を完成させます。ファイル一個、result JSON 一個、警告一個を package にしません。
- 実装AIは、依頼された成果に必要な隣接修正、整理、検証、現在地更新まで継続します。
- 監修AIは repo の現状を読み、作業の目的・判断価値・境界を渡します。変更ファイルや細かな手順を先回りして固定しません。
- 人間オーナーへの確認は、方向が分かれる高コスト判断を一度にまとめて行います。可逆な細部は仮置きして前進します。
- 同じ画面への微修正が2回続いたら、3回目は追加調整ではなく `Explore` / `Audit` / `Excise` のいずれかへ切り替えます。

### 一回の開発ループ

1. **Sync** — `git fetch --prune` と `git pull --ff-only` を行い、ユーザー変更と remote parity を確認する。
2. **Orient** — まず `README.md`、`docs/review/current-status.md`、この文書で現在地を掴む。product behavior または review claim を変更する前には repo rule に従い、`docs/project-context.md`、`docs/qa-gates.md`、`docs/decision-log.md`、`docs/idea-ledger.md` も確認する。individual review archive は今回触る契約だけ読む。
3. **Frame** — 作業を `Advance`、`Audit`、`Excise`、`Explore`、`Verify` のどれかとして宣言し、今回減らす摩擦を一文にする。
4. **Direction check** — 高コストな方向差がある場合だけ、低 fidelity の2〜4案を比較して一度だけ方向確認する。方向差がなければ推奨案を仮置きして実装へ進む。
5. **Build the bundle** — 実装、関連 cleanup、回帰修正、検証、現在地更新を同じ package で完了させる。
6. **Verify** — 影響範囲に応じた QA を実行し、失敗を直す。検証だけの別 Prompt は作らない。
7. **Publish the state** — behavior と同じ変更単位で `current-status` と、必要なら `README` / decision / ledger を更新する。handoff 専用の重複転記を作らない。
8. **Acceptance** — 人間が判断できる成果、比較、残る不確実性、次の2〜4入口をまとめて返す。

## 3. 自律範囲と停止条件

| 状況 | 実装AIの動き | 人間への確認 |
| --- | --- | --- |
| 可逆な UI、copy、docs、test、fixture、内部 refactor | 関連修正と検証まで続行 | 不要 |
| 仕様が曖昧だが安全に仮置きできる | 仮定を明示し、`provisional` として続行 | 完了時に選択肢を提示 |
| layout、brand、言語方針、情報設計など、後戻りコストが大きい方向差 | 2〜4の低コスト案、推奨、比較軸を先に作る | 一度の方向確認に集約 |
| 破壊的変更、依存追加、DB migration、認証、外部 API 契約、秘密情報、課金 | 作業を止め、影響と代替案を示す | 必須 |
| 公開、権利保証、production upload、final canon、不可逆な story authority | 実行しない | 明示承認が必須 |
| 既存仕様同士が衝突し、どちらを選ぶかで製品が変わる | 証拠と2〜3案を示す | 必須 |

安全境界は「探索禁止リスト」ではありません。provider/API、database、video generation、publishing、final canon が閉じていても、local research、prototype、copy、layout、fixture、mock、screenshot、cleanup、documentation は前進できます。

## 4. 監修AIから実装AIへ渡す Outcome Packet

監修AIは一つの coherent milestone につき一つの **Outcome Packet** を渡します。実装AIは repo の正本を読み、下記を満たす範囲で手段とファイル構成を選びます。

```text
Outcome
  ユーザーが終点で何を見たり、行えたり、判断できたりするか。

Decision unlocked
  この成果により次にどの意思決定が可能になるか。

Evidence
  受け入れ時に確認できる画面、操作、計測、test、比較。

Hard boundaries
  本当に越えてはいけない契約・権限・外部作用だけ。

Freedom
  実装AIが統合、削除、仮置き、隣接修正してよい範囲。

Direction gate
  事前選択が必要なら、比較すべき軸と回答期限。不要なら none。

Stale assumptions
  Prompt 作成時点から変化している可能性がある前提。
```

### Prompt に入れないもの

- repo から読める全ファイル一覧や過去 artifact の再掲。
- 「まず調査だけ」「次に result JSON だけ」「次に status だけ」という分割。
- すべての未実装領域を毎回繰り返す安全文。
- 実装AIが通常判断できる rename、copy、fixture、関連 test の個別許可。
- 完了後に別 Prompt を要求するだけの handoff 更新。

Prompt が細かすぎる場合、実装AIは同じ user outcome に属する項目を一つの bundle にまとめます。Prompt が古い場合、remote と current status を優先し、目的を保ったまま手段を更新します。

## 5. 方向確認と創造提案

成果物を高 fidelity で一案だけ作ってから意向を聞く運用を避けます。次のいずれかに当たるときは、実装前または最初の薄い prototype で方向比較を作ります。

- 画面全体の layout、navigation、information architecture が変わる。
- 日本語中心、bilingual、翻訳 provenance など言語体験が変わる。
- 新しい content format、channel、audience、制作媒体へ伸ばす。
- color、type、illustration、motion の system を決める。
- 30分を超えるやり直し、または複数画面の作り直しが予想される。

比較案は最低3方向を基本とします。

1. **Core** — 現在の価値を最も明確にする堅実案。
2. **Adjacent** — 現方針から隣接市場・媒体・利用者へ伸ばす案。
3. **Wild card** — 前提を一つ外し、新しい見え方を試す案。

各案は layout / language / content / color-type / motion のうち関連する2軸以上を変え、同じ見た目の微差にしません。推奨案、捨てるもの、実装コスト、次に可能になることを併記します。

一つの work package で許す人間 gate は原則として「方向確認 1回」と「受け入れ確認 1回」です。細部の質問は decision board にまとめます。

## 6. 進捗と完了報告

### 作業中

- 開始時に、今回の成果、主要仮定、hard boundary を短く伝える。
- 60秒を超える作業では、何が確定し、何を検証中かを簡潔に更新する。
- 軽微な成功ごとに停止しない。blocker でなければ実装を続ける。

### 完了時

ファイルを開かなくても意味が分かる自然文で、変更が workflow や decision にどう効くか、残る不確実性を説明します。複数項目は実際の比較軸を持つ表にし、最後に異なる bottleneck を解く2〜4の入口を示します。

## 7. 現在地 control plane

同じ情報を複数文書へコピーしません。

| リソース | 一つだけ持つ責務 | 更新する条件 |
| --- | --- | --- |
| `README.md` | GitHub から見える製品概要、開き方、現在の一行判断 | 外部から見た現在地・入口が変わる |
| `docs/review/current-status.md` | live な実装、検証、未決、直近選択肢 | behavior、検証状態、優先判断が変わる |
| `docs/project-context.md` | 変わりにくい目的、authority、architecture、境界 | 製品定義や契約が変わる |
| `docs/idea-ledger.md` | 未完了の選択肢だけ | 選択肢が発生・完了・破棄される |
| `docs/decision-log.md` | 日付付きの非自明な決定履歴 | 方針・契約・scope を決めた |
| `docs/review/next-terminal-handoff.md` | 次 terminal が正本へ到達する最短手順 | 通常は更新不要 |
| `artifacts/ARTIFACTS.md` と result JSON | 過去の検証証拠 | 対象 artifact を実際に変えた |

GitHub Wiki は別リポジトリになり、手動同期漏れを再発させるため live status の正本にしません。外部閲覧はまず `README.md`、必要なら将来 `current-status` から GitHub Pages / Wiki を自動生成します。

## 8. QA の強さを変更リスクに合わせる

| 変更 | 必須確認 |
| --- | --- |
| すべて | `npm run check`、`git diff --check`、意図しない user change がないこと |
| UI / layout / copy | 対象 route の操作、desktop と narrow width、Light / Dark、screenshot 比較 |
| extraction / state / routing | 関連 validator、fixture matrix、source-span、contradiction guard |
| docs / navigation | `npm run docs:check`、link と正本の役割重複 |
| provider / DB / auth / publishing | 実装前の明示承認、秘密情報・rollback・契約確認 |

通常は `npm run check` と変更契約に近い validator だけを使います。release / checkpoint 前は `npm run check:manifest` で31件の read-only registryを通します。どちらも過去 artifact を再生成しません。保存済み result 自体を更新する checkpoint だけ `npm run artifact:refresh` を明示実行し、生成差分を review します。

## 9. Workflow health

次の兆候が出たら成果を追加する前に運用を直します。

| 兆候 | 閾値 | 対応 |
| --- | --- | --- |
| 同一画面の連続微修正 | 2 package | 3回目は `Explore` / `Audit` / `Excise` |
| 一成果への監修 Prompt 数 | 2を超える | 残りを一つの Outcome Packet に再統合 |
| behavior と status のずれ | 1 commit でも発生 | 次作業より先に同じ package で同期 |
| handoff-only commit | 原則0 | current status を実装 commit に含める |
| 高 fidelity 後の方向差し戻し | 1回 | 次回は low-fi direction gate を必須化 |
| 創造案が一案のみ | 方向変更 package で発生 | Core / Adjacent / Wild card を追加 |

この workflow 自体が重くなった場合、規則を増やすのではなく、重複を削除して短く保ちます。
