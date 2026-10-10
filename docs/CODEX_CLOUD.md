# FastFictionFactory の Cloud 開発

CloudではNode.js tool、HTML/CSS、fixture、reviewのreadbackを編集し、Gitに含まれるexact素材と既存validatorで検証する。新しい作品目標の採用、canon、asset/right、voice/provider、production、publicationは `docs/review/current-basis-review-burden.md` の判断経路を使う。

## 環境を準備する

ChatGPTの「設定 → Codex Cloud → 環境」で `Media Contents Projects` を作成し、今回指定された `YuShimoji/NLMYTGen`、`YuShimoji/ClipPipeGen`、`YuShimoji/FastFictionFactory` だけを選ぶ。各タスクの作業対象は明示する。FFF固有の契約は他プロジェクトのschemaへ置換しない。

Cloud準備の版は `codex/cloud-development-20261011`。既定の `master` とは別なので、セットアップ会話でこのブランチを指定し、`git branch --show-current` と `git rev-parse HEAD` を確認してから実行する。

| 項目 | FastFictionFactory の設定 |
| --- | --- |
| ランタイム | Node.js 24 |
| Install script | このリポジトリで `bash scripts/codex/setup.sh` |
| Start skill | `AGENTS.md` のread orderを読み、`bash scripts/codex/check.sh` を実行。常駐サービスは不要 |
| ネットワーク | 基本検証はofflineで実行可能 |
| 秘密情報 | 基本開発では不要 |
| 共有 | Only me |

基本検証はNode.js built-insで動き、npm dependencyは不要。準備と検証後に「Publish」で環境を保存する。MkDocs、private pipelineの再生成、FFmpeg、providerは基本セットアップに含めない。

## 実装後の検証

```bash
bash scripts/codex/check.sh
node --test tests/<対象のテスト>.test.mjs
```

checkはD3 cockpit validatorとその回帰テスト、current-basis validatorのsyntaxと独立した拒否系を実行する。accepted previewとauthorityのhash、旧質問の再発行防止、optional-reference cockpitの契約を確認する。旧MP4は再生しない。実画面、全編実聴、創作上の採否はこの検証の確認対象に含めない。

`node tools/fff-current-basis-review-burden.mjs` とその正常系テストは、過去のPC固有 `.serena/project.yml` のhashを要求する。clean checkoutのtracked bytesとは一致しないため、Cloud checkではその正常系を実行しない。元validator、receipt、expected hashは変更しない。元PCでの保護状態の検証が必要な作業では、同じvalidatorを実行して状態の差を確認する。

Windowsの隔離checkoutでは `C:\Program Files\Git\bin\bash.exe` から同じ `scripts/codex/check.sh` を実行できる。

## 素材とレビュー

Git管理のexact MP4、HTML、authorityは変更せず使う。PC内の `.serena/`、未保存browser state、追加のreview素材はCloudへ自動転送されない。exact入力がない操作だけ保留し、同梱fixtureで可能な開発を続ける。既存のpreview acceptとasset plan Aを再質問しない。

修正前にユーザー現象と期待結果、原因根拠または判別できる仮説を示す。原因不明の数値調整を反復しない。Cloudで確認した動作と、Windowsに残る実画面・実音声確認を報告する。

ローカル個人skillはCloudへ自動同期されない。`AGENTS.md` と正本文書を使い、dirty、untracked、ignored素材を保持する。下流から親チャットへの通知・ACK・callbackは追加せず、結果を担当リポジトリへ保存する。

現在のCloud環境作成・Publish手順: [OpenAI公式ガイド](https://learn.chatgpt.com/docs/environments/cloud-environments)。
