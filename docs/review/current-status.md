# Current Status

_Last updated: 2026-07-10 JST_

この文書だけが live な実装状態、検証状態、未決事項、次の入口を持ちます。過去の checkpoint は [Artifact Inventory](../local-view/artifacts.md) と [Decision Log](../decision-log.md) を参照してください。

## 一目で分かる現在地

| 項目 | 状態 | 意味 |
| --- | --- | --- |
| Branch | `codex/workflow-control-plane-reset` | workflow reset と validation repair の公開・引き継ぎ branch |
| Remote baseline | fast-forward-only pull 完了 | 2026-07-10 の作業開始時に `HEAD...origin/master = 0 0` |
| Publish acceptance | branch parity `0 0` | push 後に `HEAD...origin/codex/workflow-control-plane-reset` で確認する |
| Last Review UI behavior | Review Workbench Component Contract | 今回の branch は workflow / validation tooling を変更し、Review UI 自体は変更しない |
| Active artifact | `fff-review-workbench-component-contract-001` | manifest と現行 Review UI が指す checkpoint |
| Product maturity | local prototype | 公開 service や production pipeline ではない |
| Primary route | `public/review/index.html?mode=brief` | 現在の first screen |
| Next content route | `public/review/index.html?mode=bridge` | 3分 mystery-lore 制作仮説の review |
| Selected candidate | `designer-content-moth-investigation-3m` | provisional default |
| Selected channel | `designer-channel-mystery-lore` | provisional route |
| Runtime | Node.js `v22.19.0`, npm `10.9.3`, Python `3.11.0`, uvx `0.10.0` | ローカル検証を実行可能 |

## いま動くもの

- dependency-free の静的 Review UI。
- memo、structured candidates、Profile、Claim Ledger、Timeline、task、outline の local review surface。
- `adopt` / `provisional` / `hold` / `reject` の review state。
- Draft Review Pack、Designer Dashboard、Draft-to-Video Bridge、Layout Lab。
- Light / Dark / Auto theme。
- deterministic local extraction adapter と source-span fixture matrix。
- contradiction、malformed source span、human-owned decision、translation provenance の guard。
- JSON state validation、export/import、local file persistence の readback。
- MkDocs local documentation view。

Review routes:

| Route | 用途 | 現在の扱い |
| --- | --- | --- |
| `?mode=brief` | 次の制作判断の選択肢を確認する Workbench | first screen。選択保存は未完成 |
| `?mode=bridge` | narration、subtitle、visual、thumbnail、rights risk の制作仮説 | 次の content review |
| `?mode=layout-lab` | 過去の layout 比較 | design evidence |
| `?mode=draft` | 一つの story draft package | source package |
| `?mode=designer` | content / channel candidates | source dashboard |
| `?mode=story` | story review | supporting route |
| `?mode=source` / `project` / `artifacts` | 根拠、状態、artifact 監査 | optional evidence |

### 既知の interaction gap

source readback では次が未完成です。現行 UI は静的な比較・review evidence として開けますが、decision workbench として end-to-end に完了しているわけではありません。

| Gap | 現在の挙動 | 必要な contract |
| --- | --- | --- |
| Decision choices | 5つの選択肢は描画されるが、選択を記録・step更新する click behavior がない | local Decision Receipt、選択状態、undo |
| Mode navigation | tab click は body の mode を変えるが URL / history を更新しない | reload、deep link、共有可能な route |
| Document language | `<html lang="en">` のまま、日本語操作と英語 metadata が混在 | page / segment ごとの正しい language ownership |
| Narrow layout | mobile rule より詳細度の高い固定3列 / 4列 rule が勝つ可能性があり、横 overflow を hidden にしている | 360 px interaction / screenshot test |
| Smoke coverage | marker、count、result existence が中心 | click、persistence、history、keyboard、responsive の behavioral check |

## 現在の画面を見た判断

`artifacts/review-screens/brief-component-contract-workbench.png` の visual readback:

| 観測 | ユーザーへの影響 | 次の扱い |
| --- | --- | --- |
| Process / Active Decision / Context Dock の役割は分かれた | 以前より構造は追いやすい | component contract は保持 |
| first screen に active artifact、source shell、candidate/channel の内部 ID が露出 | 創作ツールより開発監査画面に見える | 製品表示から運用 metadata を退避 |
| 日本語の主要操作と英語の navigation / labels / internal copy が混在 | language hierarchy が不明確 | Japanese-first と bilingual policy を方向比較 |
| Active Decision の中央に大きな空白があり、下部に Guided Review が再登場 | 一つの workbench というより新旧 layer の積層に見える | 追加カードではなく stale layer の削除を優先 |
| `112 HOLD` が上部の最も強い metric | 未決の多さは分かるが、次の創作行動を促さない | story progress / decision value の metric を検討 |
| color、type、motion は system として未決 | 機能は読めても固有の創作体験になっていない | 高 fidelity 実装前に visual direction gate |

静的 evidence としては review 可能ですが、interaction と product direction は未確定です。現在の shell を微調整し続けるのではなく、次は異なる使い方を low-fi で比較し、共通の Decision Receipt を先に定義する段階です。

## 検証状態

標準入口:

```powershell
npm run check
npm run check:manifest
npm run docs:check
```

通常の `npm run check` で確認する内容:

- control-plane 文書の size / role / active-artifact consistency。
- Node.js tool syntax。
- current / sample state と extraction fixture。
- Review UI inline script compile。
- active Workbench と contradictory claim guard の read-only validation。
- 実行前後の worktree が一致すること。
- `git diff --check`。

`npm run check:manifest` は manifest の31件 read-only registryをすべて実行し、provider、translation、adoption、Profile を含む保存契約を checkpoint 前に確認します。`npm run docs:check` は MkDocs strict build を行います。

`npm run artifact:refresh` は保存済み result を意図的に再生成するときだけ使用します。旧 manifest の書込み型 smoke はこの明示コマンドに隔離し、通常 check からは呼びません。

2026-07-10 JST の結果:

| Check | 結果 |
| --- | --- |
| `npm run check` | PASS — fast active checks、HTML script compile、control-plane budget、worktree non-mutation |
| `npm run check:manifest` | PASS — 31 / 31 read-only registry、worktree non-mutation |
| LF / CRLF source-span probe | PASS — multilingual 12 / 12、sparse 12 / 12 が canonical LF offset と一致 |
| `npm run docs:check` | PASS — MkDocs strict build |
| 3 Node tools `node --check` | PASS |
| `git diff --check` | PASS |

開始時に再計算した旧チェーンは 14 PASS / 16 FAIL でした。修復後は active artifact 固定、manifest 自己登録、改行依存 offset の3群が解消され、read-only registry は 31 / 31 PASS です。

## 開発速度を落としていた構造

監査時点の量:

| 指標 | 値 | 読み取り |
| --- | ---: | --- |
| 全 commit | 77 | まだ初期 prototype |
| `current-status.md` を更新した commit | 64 | status がほぼ毎作業の履歴置き場になっていた |
| `project-context.md` を更新した commit | 59 | stable context と live status が混在 |
| `next-terminal-handoff.md` を更新した commit | 57 | handoff が第三の status 正本化 |
| 旧必読6資料 | 1,175 lines / 187,727 bytes | orientation 自体が大きな作業 |
| review docs | 66 | 一成果が多数の micro-artifact に分割 |
| `*-result.json` | 61 | safety proof が user outcome より細かい単位で増加 |
| `public/review/index.html` | 9,773 lines / 約508 KB | UI が単一ファイルへ累積 |
| `tools/fff-state.mjs` | 13,181 lines / 約688 KB | smoke と契約が単一 validator へ累積 |

根因は capacity 不足ではなく、`1 Prompt = 1 micro-artifact` と、完了履歴を複数の現行文書へ毎回転記する設計です。この package では、現在地の責務を README / current status / stable context / active ledger / decision history に分け、重複を削除します。

## 外部からの可視性

GitHub repository は public で Wiki は enabled ですが、監査時点では repository description、homepage、Pages、root README がなく、Wiki repository も初期化されていませんでした。つまり「更新を忘れた」だけでなく、外部向け正本と publish trigger が存在していませんでした。

今回 root `README.md` を外部向け入口として追加します。Wiki を手動の第二正本にはせず、将来 Pages / Wiki が必要なら current status から一方向に自動生成します。README は commit / push されるまで GitHub には反映されません。

## まだ存在しないもの

- real model/provider extraction adapter、endpoint、credentials、retry / timeout policy。
- durable multi-project database と migration / backup。
- authentication、multi-user collaboration。
- production asset generation、video render、YouTube upload。
- rights-clearance workflow と release approval。
- final canon automation。
- componentized frontend build、unit test framework、CI。

## 人間が保持している story decision

- Toma の運命。
- brass moth の真相と first-use function。
- Council の動機。
- reciprocal contradictory claim のどちらが真か。

既存の `multi-claim-moth-key-label` は Claim Ledger と non-canon Profile annotation に採用された readback を持ちますが、Timeline、Story Seed、final canon には進んでいません。

## 次の意思決定

今必要なのは「どのボタンを微修正するか」ではなく、製品の主役を選ぶことです。方向仕様、language / visual / motion、隣接 content、最小試作は [Active Idea Ledger](../idea-ledger.md) を正本とします。現在の推奨入口は Product Direction Board です。

| 入口 | 減らす摩擦 | 選ぶと可能になること | 現在状態 |
| --- | --- | --- | --- |
| **Explore — Product Direction Board** | 完成後の大幅差し戻し | 3方向を layout、language、visual、motion、content expansion で比較できる | 最優先 |
| **Excise — Legacy Layer Cleanup** | 新旧 UI の積層、内部 ID、説明重複 | 選んだ方向を載せる小さな first screen と component boundary を作れる | direction と並行可能 |
| **Advance — One complete creation loop** | review のための review | memo から一つの 3分 package を編集・判断する端から端までの体験を検証できる | 方向選択後 |
| **Verify — Responsive / language / accessibility** | desktop screenshot だけの確信 | narrow width、日本語、keyboard、contrast の product quality を判断できる | shell cleanup 後 |

推奨は最初の2つを一つの package にすることです。low-fi の方向比較で人間の意向を得てから、明らかな legacy layer だけを削除し、選択された一案を本実装します。
