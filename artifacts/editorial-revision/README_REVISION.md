# Editorial Revision Roundtrip

Artifact `fff-editorial-revision-roundtrip-001` は、`fff-bridge-editorial-handoff-pack-001` に対する修正提案を、元の Handoff package を書き換えずに受け渡すためのローカル編集パッケージです。

## 不変のソース

- source artifact: `fff-bridge-editorial-handoff-pack-001`
- candidate: `designer-content-moth-investigation-3m`
- channel: `designer-channel-mystery-lore`
- `editorial-handoff.json` SHA-256: `c818d81a0d87796a8d61e7d16ff0448a9feb5422b6ee3e0d2989cebd907b3080`
- `package-manifest.json` SHA-256: `ffad571ed4abeb46e7d2b5f61f33f3fa4703173b3f8da2318e5d1c7248772971`

この roundtrip は `artifacts/editorial-handoff/` 以下のファイルを変更しません。accept された変更も自動適用せず、`apply_status=not_applied` の patch として書き出します。

## ファイル

| ファイル | 用途 |
| --- | --- |
| `README_REVISION.md` | このローカル運用手順とsource不変境界 |
| `revision-request-template.json` | 新しい revision request の空テンプレート |
| `revision-request.example.json` | 六幕に一件ずつ割り当てた決定的な混合リスク例 |
| `revision-decision.example.json` | 例に対する accept / hold / reject の判断 |
| `revision-patch.example.json` | accept 済み safe edit だけを含む未適用 patch |
| `revision-roundtrip-manifest.json` | 上記5ファイルの byte size と SHA-256（self-hash なし） |

## ローカル利用手順

1. `revision-request-template.json` を複製し、`request_id`、`requested_by`、`created_at` と `changes` を入力します。
2. source identity と2つの SHA-256 は変更しません。fingerprint が異なる request は fail closed です。
3. Review UI の `public/review/index.html?mode=revision` でローカル JSON を選びます。読み込みは FileReader だけで行われ、network request や filesystem write はありません。
4. 各変更を before / proposed diff と guard explanation で確認し、accept / hold / reject / return を選びます。
5. decision JSON と、accept 済みの safe edit だけを含む patch JSON を Blob download で保存します。
6. patch は自動適用されません。別の human-approved revision slice が必要です。

## Guard 分類

分類は `change_type` と保護対象フィールドを主に再計算します。`derived_guard_class` は例の期待 readback であり、信頼入力ではありません。obvious canon、clearance、selected asset、provider、render、upload、publication claim には補助的な narrow text safety check をかけます。未知の target/type/identity/hash は fail closed です。

UI import は既知 target の `before` をimmutable sourceと比較します。`before_hash` はWeb Crypto SHA256で照合してからcanonical valueをmaterializeします。unknown target/type、target-beat mismatch、source fingerprint mismatch、open boundary flagを含むrequestは表示状態を置き換えません。

### `safe_local_edit`

- `narration_wording`
- `subtitle_wording`
- `shot_direction_wording`

この class だけが accept できます。

### `human_author_required`

- `beat_order`
- `beat_timing`
- `story_truth`
- `ending_choice`

human author の判断が必要なため、hold または return のままにします。

### `blocked_boundary`

- `final_canon_promotion`
- `rights_clearance`
- `asset_selection`
- `provider_api`
- `credentials`
- `external_model_call`
- `generation`
- `production_render`
- `upload_publication`
- `database_persistence`
- unknown target/type
- source identity/hash mismatch

reject または return のままにします。

## 決定的な六変更例

| Beat | Change | Guard | Example decision |
| ---: | --- | --- | --- |
| 1 | narration wording | `safe_local_edit` | `accept` |
| 2 | subtitle wording | `safe_local_edit` | `accept` |
| 3 | generic shot-direction wording | `safe_local_edit` | `accept` |
| 4 | beat timing | `human_author_required` | `hold` |
| 5 | final-canon promotion | `blocked_boundary` | `reject` |
| 6 | asset selection | `blocked_boundary` | `reject` |

Expected totals:

- guard classes: `3 safe / 1 human-author-required / 2 blocked`
- decisions: `3 accept / 1 hold / 2 reject`
- patch: exactly `3` accepted safe changes

## Patch の不変条件

`revision-patch.example.json` は次を明示します。

- `apply_status=not_applied`
- source package unchanged
- beat order unchanged
- timing unchanged
- canon unchanged
- rights state unchanged
- asset state unchanged
- production gates closed

## 閉じた境界

この package は provider/API を設定せず、credentials に触れず、external model call、画像・音声・動画生成、production render、upload/publication、database persistence、rights clearance、asset selection、timing approval、story truth、ending、final canon のいずれも実行・承認しません。
