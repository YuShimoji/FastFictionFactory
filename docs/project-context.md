# Project Context

この文書は Fast Fiction Factory の変わりにくい製品前提を保持します。現在の commit、active artifact、検証結果、次作業は [review/current-status.md](review/current-status.md) に置き、ここへ履歴を転記しません。

## Product thesis

Fast Fiction Factory は、創作者が持つ断片的な fiction memo を、根拠と不確実性を失わずに、人物・場所・物・主張・時系列・構成・映像案へ育てる local-first production workbench です。

中心価値は「AIが物語を決めること」ではありません。

- 散らばった創作メモを、見失わずに扱える。
- 推測、矛盾、未決、外部情報を区別できる。
- story bible と短尺・長尺コンテンツ制作を同じ根拠から派生できる。
- 人間が採用・保留・却下し、いつでも判断を戻せる。
- 制作へ進む前に、権利、source、canon、feasibility を確認できる。

## Primary user and jobs

主利用者は、世界観やエピソードの断片を蓄えながら、物語・動画・シリーズへ展開したい個人創作者または小規模チームです。

主な job:

1. メモを失わずに取り込む。
2. story element と claim candidate を抽出する。
3. 不確実な箇所を人間判断として保持する。
4. Profile、Claim Ledger、Timeline を横断して整合性を見る。
5. 1分 / 3分 / 10分 / series などの制作案を比較する。
6. narration、subtitle、visual、thumbnail、rights risk を一つの package として判断する。
7. 採用した内容だけを次工程へ渡す。

## Authority model

ローカルの review state と story authority は別です。

| 状態 | 意味 |
| --- | --- |
| `adopt` | 現在の制作・レビューで使う候補。自動的な final canon ではない |
| `provisional` | 仮説として使えるが、後で見直す |
| `hold` | 根拠不足、矛盾、好み、権利、設定判断を人間へ保持する |
| `reject` | 現在の経路では使わない。根拠履歴は残せる |

final canon、矛盾する主張の真偽、登場人物の運命、世界設定の確定は人間オーナーだけが決めます。モデル confidence、validator pass、Profile annotation、Claim Ledger row はその権限を代替しません。

## Stable product layers

| Layer | 責務 | 越えてはいけない境界 |
| --- | --- | --- |
| Source | raw memo、source span、translation provenance | 派生文を原文の根拠に置き換えない |
| Extraction | structured candidate と route suggestion | human-owned decision を自動採用しない |
| Review | status、contradiction、risk、freeform feedback | review pass を canon や release approval と呼ばない |
| Story model | Profile、Claim、Timeline、outline | source と unresolved dependency を失わない |
| Production planning | narration、subtitle、visual、sound、thumbnail | asset generation や公開を暗黙実行しない |
| Production / publishing | provider、render、upload、release | 明示承認、credentials、rights、rollback が必要 |

## Current technical shape

本プロジェクトは、まだ productized application ではなく local prototype です。

- `public/review/index.html`: dependency-free の単一静的 Review UI。
- `artifacts/*.json`: state、fixture、result readback。
- `tools/fff-state.mjs`: state / extraction / artifact validation と smoke。
- `tools/fff-extract-local.mjs`: deterministic local extraction adapter。
- `tools/fff-source-span-review-pack.mjs`: source-span review pack generator。
- `docs/`: product contract、current status、decision history、review archive。
- `mkdocs.yml`: Markdown をローカルで閲覧するための site。

現状に server、database、authentication、real provider adapter、secret management、video renderer、public uploader はありません。これらは「閉じた機能」であり、local UI research や prototype の停止理由ではありません。

## Product invariants

- Local-first: 外部送信を明示しない限り、入力と review はローカルに留める。
- Evidence before authority: 候補は source ref / span と provenance を持つ。
- Reversible review: 人間判断は戻せ、変更理由を追える。
- Generated is not canon: AI・mock・adapter 出力を自動で canon にしない。
- Contradictions stay visible: 片側を自動消去せず、人間へ hold する。
- Language provenance: 原文が source-of-truth。翻訳や inline gloss は derivative。
- Production is a separate gate: planning と generation / publishing を分離する。
- Review UI is a product surface: 内部 artifact 証明より、創作者の判断と制作を前面に置く。

## Success criteria

短期:

- 初見の創作者が、説明を読まずに「現在の物語」「未決」「次に作るもの」を理解できる。
- 一つの memo から一つの content package まで、同じ UI flow で辿れる。
- 日本語の primary UI と multilingual source を無理なく扱える。
- UI change が screenshot、interaction、responsive、dark mode で検証される。

中期:

- 複数 project を安全に保存・移行・export できる。
- provider-backed extraction を local guard の内側で選択可能にする。
- story bible と video / audio / article package を同じ reviewed source から派生する。

長期:

- 小規模 creative team が、企画、canon、制作、公開前 gate を一つの workbench で共有できる。
- provider や媒体を交換しても、source provenance と人間 authority が保持される。

## What requires explicit authorization

次は通常の実装裁量を越えるため、開始前に人間の明示承認が必要です。

- 依存追加または runtime / framework の変更。
- destructive migration、database schema、authentication、API contract。
- credentials、paid service、external provider call。
- public upload、release、rights-clearance claim。
- irreversible production mutation と rollback 実行。
- final canon または人間所有の story truth の確定。

可逆な local prototype、layout / copy / interaction research、fixture、test、documentation、内部 cleanup は [workflow.md](workflow.md) の自律範囲で進めます。

## Source-of-truth map

| Topic | Source |
| --- | --- |
| Live implementation and next decision | [review/current-status.md](review/current-status.md) |
| Development and product workflow | [workflow.md](workflow.md) |
| Product scope | [product-brief.md](product-brief.md) |
| Data contracts | [data-model.md](data-model.md) |
| QA semantics | [qa-gates.md](qa-gates.md) |
| Active opportunities | [idea-ledger.md](idea-ledger.md) |
| Durable decisions | [decision-log.md](decision-log.md) |
| Historical review evidence | [Artifact Inventory](local-view/artifacts.md) |
