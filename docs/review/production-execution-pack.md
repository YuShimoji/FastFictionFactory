# Production Execution Pack

`fff-production-execution-pack-001` は、受け入れ済みの 180 秒・6 ビート・19 ショットを、別の制作者が複数の監査ファイルを再構成せずに準備と組み立てへ移せる形へまとめるローカル実行資料です。既存の Operator Brief、Content Production Blueprint、Editorial Derivative、Revision、Handoff は情報源として保護し、このパックから原文、順序、時間、物語上の真偽、権利、canon を変更しません。

## 今回つながった作業

| 制作時の問い | パックで読めるもの | 判断を越えない境界 |
| --- | --- | --- |
| 180 秒をどう進めるか | 6 ビートの時間枠、目的、ナレーション状態、字幕数、ショット数、完了条件 | 既存の時間枠と順序を変更しない |
| 19 ショットを何で成立させるか | 各ショットの時間、画面目的、スケール、動き、遷移、文字許容量、汎用アセット要件 ID、真偽境界、done-when | 実在素材、ベンダー、ファイル、URL を選ばない |
| 何を共通準備できるか | 14 件の再利用可能な環境・人物・小道具・文書・抽象表現・書体・音声キュー要件 | 全件 `asset_status=unselected`、`rights_status=not_reviewed`、`provenance_required=true` |
| 合成音声へ進める余裕があるか | 4 ビートの人間読み上げによるテキスト密度の代理証拠と、2 ビートの未計測状態 | エンジン、声、発音、prosody、音声実時間を選択・生成・検証したとは扱わない |

## 九つの持ち運びファイル

正本ディレクトリは `artifacts/production-execution-pack/` です。manifest 自身は循環参照を避け、残る 8 ファイルのサイズと SHA256 を記録します。各ハッシュの最新値は `production-execution-manifest.json` と `artifacts/production-execution-pack-result.json` を参照してください。

| ファイル | 使いどころ |
| --- | --- |
| `README_PRODUCTION_EXECUTION.md` | 最短の入口、実行順、閉じた境界、検証方法 |
| `production-execution-pack.html` | 日本語優先・単一文書スクロール・印刷対応の人向け引き渡し面 |
| `production-execution-pack.json` | 6 ビート、19 ショット、14 要件、音声状態を束ねる機械可読正本 |
| `beat-run-sheet.csv` | ビートごとの時間枠、目的、字幕・ショット数、完了条件 |
| `shot-execution-sheet.csv` | 19 ショットの画面要件とアセット参照 |
| `asset-requirements.csv` | 再利用可能な 14 件の汎用要件と使用ショット |
| `narration-timing-envelope.csv` | 合成音声向けのエンジン中立な timing envelope |
| `thumbnail-requirements.md` | 既存 3 thumbnail directions の制作要件 |
| `production-execution-manifest.json` | パッケージ順序、ファイル完全性、由来、閉じた境界 |

## ナレーション証拠の読み方

意図する配信モードは `voice_mode=synthetic` です。ただし `engine_selected=false`、`voice_selected=false`、`audio_generated=false`、`engine_calibration_pending=true` であり、人の舌や発音しやすさを合否に使わないため `human_articulation_check_required=false` です。文面は書き換えず、SSML や特定エンジン向け指定も追加しません。

| ビート | パック上の状態 | 観測された余白 | 代理的な発話長レンジ | 証拠の限界 |
| --- | --- | --- | --- | --- |
| B1 | `proxy_headroom_confirmed` | 3–5 秒 | 15–17 秒 | 人の読み上げによる text-density proxy。TTS 実測ではない |
| B2 | `existing_pass_unmeasured` | 未計測 | 未計測 | 既存 pass を保持し、代理値を捏造しない |
| B3 | `proxy_headroom_confirmed` | 3–5 秒 | 25–27 秒 | 人の読み上げによる text-density proxy。TTS 実測ではない |
| B4 | `proxy_headroom_confirmed` | 3–5 秒 | 20–22 秒 | 人の読み上げによる text-density proxy。TTS 実測ではない |
| B5 | `existing_pass_unmeasured` | 未計測 | 未計測 | 既存 pass を保持し、代理値を捏造しない |
| B6 | `proxy_headroom_confirmed` | 3–5 秒 | 20–22 秒 | 人の読み上げによる text-density proxy。TTS 実測ではない |

これにより以前の B1 / B3 / B4 / B6 の密度警告は「文面を変更せず、合成音声の実エンジン較正へ進めるだけの代理的余白がある」として閉じます。エンジン選択後の実時間、固有名詞の発音辞書、句読点の pause 解釈、prosody は H2 の別ゲートです。

## 19 ショットと 14 要件の接続

各ショットは少なくとも一つの有効な汎用要件を参照し、共通セットや小道具をショットごとに複製しません。音声キューは実ファイルではなく、6 ビート分の配置要件です。

| 要件 ID | 汎用クラス | 数量 | 使用ショット |
| --- | --- | ---: | --- |
| `AR-ENV-01` | 鐘のない観測所の再利用セット | 1 | b01-01, b01-02, b01-03, b06-03 |
| `AR-ENV-02` | 中立的な施設・間仕切り | 1 | b04-01, b04-03, b05-03 |
| `AR-CHAR-01` | 個人を特定しない手元 | 1 | b02-01, b03-01 |
| `AR-CHAR-02` | 匿名の評議会シルエット | 3 | b04-01 |
| `AR-CHAR-03` | 未解決の Toma シルエット | 1 | b05-01 |
| `AR-PROP-01` | 時計修理台・文字盤モジュール | 1 | b02-01, b02-03 |
| `AR-PROP-02` | 静止した真鍮の蛾 | 1 | b02-02, b02-03, b05-02 |
| `AR-PROP-03` | 汎用の Toma メモ | 1 | b02-02 |
| `AR-DOC-01` | 架空の台帳・人名・議事録バリエーション | 1 | b03-01, b03-02, b04-03, b06-02 |
| `AR-DOC-02` | 仮説・運命・機能・動機・HOLD の同格表示 | 1 | b04-02, b05-01, b05-02, b05-03, b05-04 |
| `AR-ABS-01` | 名前が薄れる比喩表現 | 1 | b03-03 |
| `AR-ABS-02` | 時間と名前の分割表現 | 2 | b06-01 |
| `AR-TYPE-01` | 字幕・短ラベル用書体システム | 1 | b01-03, b03-02, b04-02, b04-03, b05-04, b06-01, b06-03 |
| `AR-AUDIO-01` | 6 ビートの音声キュー placeholder | 6 | b01-01〜b06-03 の全 19 ショット |

要件数と各ショットの既存 `required_asset_count` は別の指標です。前者は再利用単位、後者は当該ショットが要求する制作要素の規模なので、配列長や合計を無理に一致させません。

## 読みやすさと印刷の契約

`production-execution-pack.html` はスクリプト不要の静的 HTML です。最初の表示で artifact 状態、180 秒、6 ビート、19 ショット、14 asset requirements、合成音声の未較正状態を確認でき、以降は identity / boundaries、beat run、narration、shots、assets、thumbnails、checklist / transfer の順に一つの文書を縦に読みます。内部スクロール領域を持たず、印刷時は hash と navigation utilities を非表示にします。

ブラウザ証拠は次の 2 ファイルへ保存します。寸法、overflow、scroll owner、表示件数、印刷 media の実測値は生成後の `artifacts/production-execution-pack-result.json` を正本とし、この文書だけで成功を先取りしません。

- `artifacts/review-screens/production-execution-pack-900x1200.png`
- `artifacts/review-screens/production-execution-pack-1280x900.png`

## 検証と再生成

通常検証は読み取り専用です。

```powershell
node tools/fff-state.mjs validate-production-execution-pack artifacts/production-execution-pack-result.json
```

意図的に 9 ファイルと result を再構成する場合だけ smoke を使います。既存ソース package と historical result は書き換えません。

```powershell
node tools/fff-state.mjs smoke-production-execution-pack artifacts/production-execution-pack-result.json artifacts/production-execution-pack-result.json
```

root manifest の `validation_command` は Execution Pack を先頭に、Typography Balance、Operator Brief、Content Production Blueprint、Editorial Derivative、Revision、Handoff の読み取り専用 chain を呼びます。最終成否、20 個の fail-closed probe、package hash、viewport / print evidence、protected-source 不変性は validator result の `passed` と `failures` を正本に判断します。

保護ソースの主要 fingerprint は次のとおりです。

| 情報源 | SHA256 |
| --- | --- |
| `artifacts/operator-production-brief/operator-production-brief.json` | `25d4cb98e988bc5faffee6f3f422103aa410806e057079153d3b434799e268e6` |
| `artifacts/production-blueprint/production-blueprint.json` | `ca7a5b00e2a9abb0d3dd0abff2d4ca04a11c50438e89081d920a19e82220679d` |
| `artifacts/production-blueprint/shot-specs.csv` | `f36b413da40a4bf53d7a96a5408df41f77381310f089ae3e1784a8899d427914` |
| `artifacts/editorial-derivative/editorial-handoff.derived.json` | `15a695b7336ce55f520878cb9a26a35d47994fa176ef57ac55bf231a9cc0b51c` |
| `artifacts/editorial-derivative/narration-script.derived.md` | `c33b43fd83dd05a4437256076a3054e52a35bfcd514506c4be75376c224840b6` |
| 34 protected package files aggregate | `396736ea631f1964edd317b922ce985cbe6cde80240d98801eaab96d464d7b95` |

## このパックで開かないもの

| 残る作業 | 現在の状態 | 開始条件 | 次に可能になること |
| --- | --- | --- | --- |
| H1 実行準備レビュー | H0 validator、両 viewport、print 証拠は green。human review は未実施 | 制作者が technical audit を開かず、準備物と組立順を説明できるか自由文で確認 | 実際の制作前に、曖昧な要件や transfer 摩擦を発見できる |
| H2 合成音声較正 | pending。エンジン、voice、audio は未選択・未生成 | ローカル engine 選択と音声生成を別途明示承認 | 文面を変えずに実エンジンの時間、発音、pause、prosody を測れる |
| 実素材の選定と権利確認 | 全 14 要件が unselected / not_reviewed | 素材候補、出所、license、provenance の人による審査 | 汎用要件を release 可能な具体素材へ置換できる |
| 外部制作者による visual proposal | 未開始 | H1 の説明可能性を通し、media-production gate を別途開く | パックから bounded な視覚案を作り、要件の移植性を検証できる |

provider、credential、外部 API、画像・動画・音声生成、render、upload、publication、database persistence、final canon はすべて閉じたままです。
