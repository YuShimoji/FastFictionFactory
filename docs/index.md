# Fast Fiction Factory Docs

ここは repository 内の Markdown 正本を読むための local site です。現在地を知るだけなら、次の3ページで足ります。

1. [Current Status](review/current-status.md) — いま動くもの、検証、未決、次の選択。
2. [Workflow](workflow.md) — 監修AI・実装AI・人間の進め方。
3. [Project Context](project-context.md) — 製品の目的、authority、architecture。

## 起動

```powershell
npm run docs:serve
```

`http://127.0.0.1:8000/` を開きます。strict build は次で確認できます。

```powershell
npm run docs:check
```

## 情報の置き場所

| 種類 | 正本 |
| --- | --- |
| GitHub から見える概要 | root `README.md` |
| Live status | [review/current-status.md](review/current-status.md) |
| Stable product contract | [project-context.md](project-context.md) |
| Development contract | [workflow.md](workflow.md) |
| Active choices | [idea-ledger.md](idea-ledger.md) |
| Durable decisions | [decision-log.md](decision-log.md) |
| Historical evidence | [Artifact Inventory](local-view/artifacts.md) |

individual review notes は過去 checkpoint の evidence です。通常の再開時に全件読む必要はありません。

## 一時翻訳

原文の source-of-truth を変更せずに読む場合は、browser のページ翻訳を利用します。翻訳された表示や inline gloss を、元 memo の source span や story authority として保存しません。
