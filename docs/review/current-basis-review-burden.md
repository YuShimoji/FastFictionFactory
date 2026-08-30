# Current Root / Handoff Review Basis

Artifact: `fff-current-basis-review-burden-001`
Mission: `FFF-CURRENT-BASIS-REVIEW-BURDEN-20260825-001`

Machine-readable receipt: `docs/review/current-basis-review-burden-receipt.json`

## 結論

現行FFF production pathでは、`fff-private-previsualization-timeline-001` がaccepted defaultで、`fff-private-materialized-motion-previs-001` はdefaultを置換していないisolated successor candidateです。後者のexact machine-readable authorityには、既存previewの `accept`、repair不要、recommended asset plan `A`、例外requirementなし、新たなhuman gate不要が記録されています。

したがって、後から重ねられたhandoff文書に残る同一previewへのaccept/revise再質問と `owner_asset_plan_decision` A/B/C再質問は、未回答gateではありません。accepted authorityを再利用して閉じます。これは判断の代理回答ではなく、commit `cfd645f…` に固定済みのhuman decisionをfresh readbackした結果です。

この文書が現行root / handoff authorityです。`docs/project-context.md`、`docs/review/current-status.md`、`docs/review/next-terminal-handoff.md`、`docs/review/supervisor-current-report.md` の2026-07-25以前のhandoff節は削除せずhistorical evidenceとして保持しますが、そこに残る二つのpending表記はcurrent queueへ投影しません。2026-08-30のユーザー指示により、旧動画の必須再生とD3 owner/scope入力もcurrent queueから外しました。current-basis receiptの次の判断は `project_goal_reset` です。保護対象のroot manifestは以前のrouteをhistorical値として保持し、このreceiptが現行routeを上書きします。新しい目標はまだ選択していません。

## 何を機械的に閉じ、何を人間に残すか

| 判断面 | 根拠 | 現在状態 | workflowへの効果 |
| --- | --- | --- | --- |
| exact HTML/MP4 identity、180秒、6 Beats、19 shots、20 cues、gap/overlap、closed flags | Evidence + validator rule | closed | hash一致中は再視聴確認を要求しない |
| 既存private previewのaccept / repair不要 | accepted authority | closed | stale accept/reviseを再発行しない |
| requirement-level asset plan A / exceptionなし | accepted authority | planningだけclosed | 14 requirementへの再回答を省く。ただしproduction asset選択・rights判断には転用しない |
| predecessorのBeat/Storyboard/Execution/integration review | accepted authority + review dedup rule | replay不要 | target/axis/evidence/decision valueが変わらない限り履歴reviewを再演しない |
| materialized-motion successorをdefaultへ昇格するcreative judgment | human authority | future only | 昇格要求が来た時だけexact successorに対して問う |
| asset candidate、proxy replacement、rights/legal compatibility | human authority | closed future gate | plan Aから利用許諾やasset選択を推定しない |
| voice/provider、production render、full-view quality acceptance、publication/release | human authority | closed future gates | 各ownerとexact candidateが揃うまで開始しない |
| story truth / canon | human authority | closed future gate | Toma、真鍮の蛾、Council、endingを決めない |

現在のhuman questionは、FastFictionFactoryの次のプロジェクト目標をどの方向に再設定するかの1件です。旧previewの再視聴、Pass / Fail、D3 owner/scope入力はこの質問に含めません。Board card、Snapshot、daily DBは作成していません。

material write/acquisition、voice/provider、asset選定、rights clearance、生成、render、publicationの各判断は、選択された新目標が必要とする場合だけ後続工程として再構成します。

## 旧D3 Cockpitの現在の扱い

`scripts/operator/open_review.ps1 -Mode d3` は、確定済みの判断と旧previewを参照するローカル画面として残します。MP4再生は任意で、再生時刻、Pass / Fail、owner/scope入力のいずれも現在の工程を進める条件ではありません。目標再設定前にproduction-input値を集めません。

Project-native validationは `node tools/fff-d3-cockpit.mjs`、focused regressionは `node --test tests/fff-d3-cockpit.test.mjs` です。任意再生を使った場合の `muted=true` / `volume=0`、hidden/background pause、終了時pauseは維持します。validatorは `PROJECT_GOAL_RESET`、`REFERENCE_ONLY_NO_HUMAN_ACTION`、playback/Pass-Fail/owner-scope inputの3項目がrequiredではないことを確認します。

## 旧様式から外す契約

- 同一hash・同一axisへのpreview accept/revise再質問。
- 同一hashの旧preview再生を、D3へ進む条件またはPass / Fail判定として扱うこと。
- プロジェクト目標の再設定前にmaterial/voice ownerとscopeを入力させること。
- accepted plan Aを無視した `owner_asset_plan_decision` の再質問。
- root manifestがmaterialized successorを登録する前の「5 validator restart chain」を現行gateとして扱うこと。現在のroot commandはaccepted defaultとsuccessor candidateを直接検証します。resumable pipeline golden resultはroot-manifest identity変更前のhistorical evidenceです。
- ClipPipeGenのsubtitle-owner、ED-10、decision-card schema、固定formをFFFへ移植すること。FFFはartifact identity、generation recipe、review axis、accepted authorityを独自に維持し、共通化するのはdecision/receiptの原則だけです。
- Boardの日次mutationをrepo-local closureの前提にすること。

## Exact receipt

- Accepted default: `fff-private-previsualization-timeline-001`
- HTML SHA256: `f152ecfe35650eca87d5e56bcde8bc19d05f2a477773ea66d8ba14ab15dbe256`
- MP4 SHA256: `78c1b45498c25b873a757e04816257c42d31d4a53fd0c9905b50ae37a6022978`
- Successor candidate: `fff-private-materialized-motion-previs-001`
- Successor MP4 SHA256: `a543e14ed081296162b6209e56b01418e8ff4293f29ea8cdf00952f0eeaa2fb1`
- Accepted-authority container SHA256: `816ee1996e48f1db6ebbe4774ebf40f76eecd50259a95488fd89ae75f892edda`
- Protected dirty `.serena/project.yml` SHA256: `98337e11cbcd1fde6a0850cd26a2cb27d4b728e4b2ae85874d38f703e342872c`

Read-only validation:

```powershell
node tools/fff-current-basis-review-burden.mjs
node --test tests/fff-current-basis-review-burden.test.mjs
```

このreceiptは、保護対象のroot manifest bytesを変更せず、そのhistorical routeを `project_goal_reset` で上書きします。accepted artifact bytesと旧handoff本文も変更しません。historical evidenceを残したまま、project-native readbackが旧preview再生とD3入力をHuman Gateへ戻さないことをfail-closedで固定します。
