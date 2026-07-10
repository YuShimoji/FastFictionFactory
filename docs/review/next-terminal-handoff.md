# Next Terminal Handoff

このファイルは状態の複製ではなく、次の terminal を正本へ案内するだけです。

## Fresh clone から再開

```powershell
git clone https://github.com/YuShimoji/FastFictionFactory.git
Set-Location .\FastFictionFactory
git fetch --prune origin
git switch --track origin/codex/workflow-control-plane-reset
git status --short --branch
npm run check
```

## 既存 clone から再開

```powershell
git fetch --prune origin
git switch codex/workflow-control-plane-reset
git pull --ff-only origin codex/workflow-control-plane-reset
git status --short --branch
npm run check
```

local branch がまだ無い場合は、`git switch --track origin/codex/workflow-control-plane-reset` を使ってください。

次に読む順序:

1. [Current Status](current-status.md) — live な実装、検証、未決、次の入口。
2. [Development Workflow](../workflow.md) — Outcome Packet、自律範囲、方向確認、停止条件。
3. [Project Context](../project-context.md) — 変わりにくい製品目的と authority。
4. 今回変更する feature の review doc / code だけ。

最新状態は [current-status.md](current-status.md) のみ更新してください。この handoff に artifact history、validation log、next-work list を転記しません。
