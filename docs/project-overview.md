# Project Overview

Fast Fiction Factory の現在地へ最短で到達するための map です。live status、安定仕様、履歴を混ぜません。

## Start here

| 質問 | 見る場所 | そこで分かること |
| --- | --- | --- |
| いま何が動き、次に何を決めるか | [review/current-status.md](review/current-status.md) | remote、active artifact、UI観測、検証、未決、次の入口 |
| 監修AIと実装AIをどう回すか | [workflow.md](workflow.md) | Outcome Packet、自律範囲、方向確認、QA、status同期 |
| 何を作る製品か | [project-context.md](project-context.md) | product thesis、利用者、authority、architecture、境界 |
| いま選べる案は何か | [idea-ledger.md](idea-ledger.md) | 未完了の Explore / Advance / Audit / Excise / Verify |
| なぜ方針が決まったか | [decision-log.md](decision-log.md) | 日付付き decision history |
| 過去の証拠を探したい | [Artifact Inventory](local-view/artifacts.md) | artifact、screenshot、result、smoke |

## Product map

```text
Raw memo
  └─ source spans / provenance
       └─ extracted candidates
            ├─ Profile
            ├─ Claim Ledger
            ├─ Timeline
            └─ held decisions / contradictions
                 └─ story and content candidates
                      ├─ outline / beats
                      ├─ narration / subtitles
                      ├─ visual / sound / thumbnail
                      └─ rights and production risks
                           └─ human-approved production handoff
```

現在は最後の production handoff より前にいます。local planning と review は存在しますが、provider-backed extraction、database、render、upload、release は存在しません。

## Current surfaces

| Surface | Route / file | 主な役割 |
| --- | --- | --- |
| Review Workbench | `public/review/index.html?mode=brief` | 制作判断の選択肢を確認する。interaction は未完成 |
| Draft-to-Video Bridge | `?mode=bridge` | 3分 content package の制作仮説 |
| Draft Review Pack | `?mode=draft` | story、beats、sample narration、risks |
| Designer Dashboard | `?mode=designer` | content / channel candidates |
| Story Review | `?mode=story` | structured story elements |
| Layout Lab | `?mode=layout-lab` | 過去の shell comparison evidence |
| Evidence views | `?mode=source`, `project`, `artifacts` | source、project state、artifact audit |

## Code and evidence

| Area | Main paths | 注意点 |
| --- | --- | --- |
| Review UI | `public/review/index.html` | 単一静的ファイルが大きく、分割候補 |
| State validation | `tools/fff-state.mjs` | 多数の contract smoke が累積 |
| Local extraction | `tools/fff-extract-local.mjs` | deterministic、external call なし |
| Source review pack | `tools/fff-source-span-review-pack.mjs` | source locator と route を監査 |
| Current/sample state | `artifacts/*project-state.json` | local review state、final canon ではない |
| Fixtures | `artifacts/extraction-*-fixtures/` | positive / negative contract coverage |
| Review evidence | `docs/review/`, `artifacts/*-result.json` | archive。通常 orientation では読まない |

## Local commands

```powershell
npm run review
npm run check
npm run docs:serve
```

## Documentation roles

- root `README.md` は GitHub から見える入口。
- [Current Status](review/current-status.md) は live status の唯一の正本。
- [Project Context](project-context.md) は安定した契約。
- [Workflow](workflow.md) は開発と製品 flow。
- [Idea Ledger](idea-ledger.md) は active choices のみ。
- [Decision Log](decision-log.md) は durable history。
- individual review docs / result JSON は historical evidence。

同じ active artifact、検証列、next move を複数ページへコピーしません。

現在の選択肢と推奨順は [Active Idea Ledger](idea-ledger.md) だけを参照してください。
