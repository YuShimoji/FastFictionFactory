# Fast Fiction Factory

Fast Fiction Factory は、断片的な物語メモを、人間が採用・保留・却下できる構造化候補と制作案へ変える local-first のフィクション制作ワークベンチです。現時点では公開サービスではなく、静的なローカル Review UI と検証用 JSON / Node.js ツールで構成された開発プロトタイプです。

## 現在の入口

- Review UI: `public/review/index.html`
- 実装形態: dependency-free の静的 HTML、ローカル JSON、Node.js 検証ツール
- Maturity: local prototype。実 provider/API、DB、公開、動画生成はまだありません
- Live status: [Current Status](docs/review/current-status.md)

active checkpoint、検証結果、UI の既知問題、次の推奨判断は Current Status だけを更新します。

## ローカルで開く

Windows PowerShell:

```powershell
npm run review
```

直接開く場合:

```powershell
Invoke-Item .\public\review\index.html
```

ローカル文書サイト:

```powershell
npm run docs:serve
```

## 開発チェック

依存パッケージのインストールは不要です。Node.js 20 以上と Git があれば、文書 control plane、tool syntax、state / extraction、現行 Workbench と中核 guard を短時間で確認できます。

```powershell
npm run check
```

release / checkpoint 前に31件の保存契約をすべて read-only で確認:

```powershell
npm run check:manifest
```

保存済み result artifact を意図的に再生成する場合だけ、次を使います。これは tracked JSON を更新し得る release/refresh 操作で、通常の確認には使いません。

```powershell
npm run artifact:refresh
```

MkDocs の strict build:

```powershell
npm run docs:check
```

## 正本の使い分け

| 知りたいこと | 正本 |
| --- | --- |
| いま何が動き、何が未決か | [docs/review/current-status.md](docs/review/current-status.md) |
| 監修AIと実装AIをどう連携させるか | [docs/workflow.md](docs/workflow.md) |
| 製品の変わりにくい目的と境界 | [docs/project-context.md](docs/project-context.md) |
| 次に選べる開発入口 | [docs/idea-ledger.md](docs/idea-ledger.md) |
| なぜその判断をしたか | [docs/decision-log.md](docs/decision-log.md) |
| 過去 artifact と検証証拠 | [artifacts/ARTIFACTS.md](artifacts/ARTIFACTS.md) |

この README を GitHub 上の外部向け現在地とし、別リポジトリになる GitHub Wiki へ同じ状態を手作業で二重転記しません。将来 Wiki や Pages を公開する場合も、上記の正本から生成する運用に限定します。

## 人間が保持する権限

ローカルの `adopt` / `provisional` / `hold` / `reject` はレビュー状態です。Toma の運命、brass moth の真相、Council の動機、矛盾する主張の真偽を含む final canon は、人間の明示判断なしに確定しません。

開発の停止条件、方向確認の粒度、Prompt の標準形、進捗・現在地の同期規則は [Development Workflow](docs/workflow.md) を参照してください。
