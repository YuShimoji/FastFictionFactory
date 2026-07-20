# Asset / Rights Readiness Packet

## 2026-07-21 thumbnail-semantic correction

The material strategy, counts, rights states, and Owner decisions are unchanged. The page now uses fourteen annotated derivatives of the private previsualization canonical frames instead of selecting the first mapped source reference as a representative image. All fourteen paths and semantic labels are explicit and unique. `AR-PROP-02` shows a brass moth, `AR-PROP-03` a written memo, `AR-ABS-01` three fading name/letter contours, and `AR-ABS-02` an equal time-versus-name split. Accidental duplicate requirement thumbnails are zero; production selection and rights-cleared claims remain zero.

更新日: 2026-07-20 JST

## Outcome

`fff-asset-rights-readiness-packet-001` は、Product Ownerが全19 shotsの構図方向を受け入れた後の、素材準備計画専用H0です。`fff-integrated-visual-production-package-001` のfingerprint `78438f153257b5559a06d1b2cc638aa152adf432c1d0a414febf83296e4eb5eb` と、Production Execution Packの14 requirement rowsを結び、19 shots、28 canonical references、36 aliases、42 assignmentsを一つのreadiness modelへcross-mapしました。

Primary accessは `artifacts/asset-rights-readiness-packet/asset-rights-readiness.html` です。既存Review Hubは変更していません。package内の9 files、result、2 screenshotsがこのsliceの成果物です。predecessor rasterのcopy、変更、download、hotlinkはありません。

## Owner Review Record

- Classification: `OWNER_WHOLE_STORY_COMPOSITION_PASS`
- Observation:
  - 「全編で大きな破綻はありません。」
  - 「素材準備と次工程へ進めてよいです。」
- Interpretation: composition direction accepted; asset-preparation planning authorized
- Composition repair required: false
- Asset preparation planning authorized: true
- Production asset selection authorized: false
- Rights clearance authorized: false
- Media generation authorized: false
- Offline assembly authorized: false
- Per-Beat review: discontinued
- Next human decision: `owner_asset_plan_decision`
- External reproducibility claimed: false
- Not authorized by this record: production asset selection, rights decision, media generation, render, publication, database persistence, or final story authority

## Exact Mapping Audit

| Axis | Result |
| --- | --- |
| Shots | 19/19; every shot maps to one or more exact requirement IDs |
| Requirements | 14/14; every requirement maps to one or more exact shot IDs |
| Asset classes | 7; environment 2, character_silhouette 3, prop 3, document_graphic 2, abstract_graphic 2, typography 1, audio_cue 1 |
| Canonical references | 28/28 with canonical ID, aliases, owner artifact, path, SHA256, used shots, creator, source/original URLs, license record, dimensions, retrieval date, risk, and boundary flags |
| Aliases / assignments | 36 / 42 |
| Minimum local-assembly set | 14 requirement rows; 19/19 shot coverage; `future_audio_lane` and `future_voice_lane` remain separate and unauthorized |
| Default plan | 14/14 requirements; 19/19 shots |
| Owner selections | 0; all requirement and minimum-set decisions remain `unselected` |
| Publication compatibility | 0 reviewed; all 14 remain `unreviewed` |

Creative fitは `strong_reference=7`, `usable_reference=6`, `no_reference=1` です。これは構図参照としての有用性だけを示し、provenance、license evidence、live readback、将来のproduction suitability、Owner decisionとは別fieldです。

## Recommended Default Plan

- `create_deterministic_original=9`: `AR-CHAR-02`, `AR-CHAR-03`, `AR-PROP-01`, `AR-PROP-03`, `AR-DOC-01`, `AR-DOC-02`, `AR-ABS-01`, `AR-ABS-02`, `AR-TYPE-01`
- `source_replacement_candidate=3`: `AR-ENV-01`, `AR-ENV-02`, `AR-CHAR-01`
- `owner_may_consider_local_proxy=1`: `AR-PROP-02`
- `retain_reference_only=1`: `AR-AUDIO-01`
- Explicit exception requirement: `AR-PROP-02`

Disposition別shot coverageは、deterministic original 17/19、replacement candidate 9/19、Owner-may-consider local proxy 3/19、reference-only future audio 19/19です。同じshotが複数のrequirement familyを持つためcoverageは重複します。未到達の8 reference IDsは下記のevidence listに明示し、recurring motifは同じrequirement familyを全再登場shotで再利用する方針です。

初回の非公開組立てでは、架空文書、比較図、抽象図、文字、匿名シルエットを決定的に作成し、実在施設、人物、実記録に依存する参照は置換候補へ回します。真鍮の蛾だけをOwner検討用local proxy候補とし、audio cueとvoice calibrationは相互にも別の、separately authorized future laneに残します。次の人手判断は、A=推奨計画採用、B=例外requirement IDだけ指定、C=material strategy再構成の一つです。28 source pagesの個別質問票は作成していません。

## Reference Evidence and Live Readback

28 referencesすべての保存済みmetadataはcompleteです。source pageのbounded HTTPS readbackは20 confirmed、8 unavailable、記録済みlicense/rights-statement URLのreadbackは28 confirmedです。unavailable IDsは次です。

- `ref-b02-s01-watch-repair-workbench`
- `ref-b04-s01-conference-backs`
- `ref-b04-s01-frosted-partition`
- `ref-b04-s02-card-catalogue`
- `ref-b04-s02-time-recorder`
- `ref-b04-s03-closed-meeting-room`
- `ref-w1-b01-s03-belfry-interior-art`
- `ref-w1-b01-s03-noon-mark`

到達不能理由はrate limit、source-site access、URL policyのいずれかです。到達不能をrights failure、metadata invalidity、または利用不可へ変換していません。通常のvalidate/smokeはnetwork checkを行わず、acquisition-timeのstatusを保持します。

Identity / sensitive riskを一つ以上持つreference identityは13件です。分類は `identifiable_person`, `real_institution`, `real_record`, `trademark_or_logo`, `contextual_misattribution` です。riskは置換または将来判断の優先度であり、利用可否の結論ではありません。

## Validation and Browser Evidence

- Read-only validator: `node tools/fff-state.mjs validate-asset-rights-readiness-packet artifacts/asset-rights-readiness-packet-result.json`
- Intentional packet-only regeneration: `node tools/fff-state.mjs smoke-asset-rights-readiness-packet artifacts/asset-rights-readiness-packet-result.json`
- Negative probes: 49/49 detected, failed closed, artifact mutation 0
- 900×1200 Dark: title 36px / 1 line / viewport share 0.03359; overflow false; nested scroll 0; disclosure 54.39px
- 1280×900 Light: title 40px / 1 line / viewport share 0.04977; overflow false; nested scroll 0; disclosure 54.39px
- 720×900 Auto: overflow false; nested scroll 0; disclosure 54.39px
- Theme/focus/print: Auto default, Light/Dark switch, visible 3px focus, print forced light, controls hidden, detailed evidence printable

## Immutability Evidence

The result stores sorted per-file inventories, byte sizes, SHA256 values, and directory aggregates for all 13 protected packages. Aggregate SHA256 values are:

| Protected directory | Files | Aggregate SHA256 |
| --- | ---: | --- |
| integrated-visual-production-package | 9 | `c18712f1d6b425419fcd0c5efd1c709136d70910fb97804656ac09e22cad583c` |
| composition-expansion-wave1 | 19 | `3324276ca229532b4b72e37d2325b0ae488159ca452f4f2cd73356cd26eefa83` |
| beat2-composition-board | 13 | `f85dd6f8cadd9ec7889ed59b4e448d71e9b92975c5d1fbd194d9b915717e6b82` |
| beat2-visual-treatment-pilot | 13 | `c383860310c2fb1c70be08b6bc9357870f1b7c20d9a7e5ffeeda8d0622dbbf8b` |
| beat4-composition-counterexample | 14 | `8c69854e9b71372628a98704aa2b64abadaebfd75d57376b8aadfa70217ac955` |
| composition-expansion-wave2 | 11 | `f5bdb713a310be6b9d315649d215e1d049da2583b3c3a7744044ff697e05698b` |
| production-storyboard-brief | 7 | `3dfa9ca917606f4dbb447de44395d69752fdcdb857ff94acb38ec96cf54eb1b0` |
| production-execution-pack | 9 | `a82b9f6bc9ef30c8b4c688f08c4ba90505f199a86239250d2746218b7e4e8979` |
| operator-production-brief | 6 | `ab584cf33a362a535073fb8365b240e2eb78d8cc1b8a0a39e9652208c16dff6e` |
| production-blueprint | 8 | `cde7a36bae97756ca602f39ade2082019511f41819f10af252847160648c16e6` |
| editorial-derivative | 8 | `d5a7edf7016e4ca1187c565301e5e781ef4039c452b9752611758f1c5205ef0d` |
| editorial-revision | 6 | `e63f76f042b30cacd2602ada8269512036b08a2ed86df3164a536be9d8f97160` |
| editorial-handoff | 6 | `da905374902cb09fc4a519d7104814f86bbb96f4395de6f30d7de778aded5605` |

The 76 predecessor result files have aggregate SHA256 `8e3ce42614396449bd608d4a49b5b9bf4778b90b6f6b3fd9e3d9d11042628495`. Validation recomputes these values and fails before accepting drift.

## Residual Work

| Work | Purpose | Effect | Requirements | State | Owner | Next move |
| --- | --- | --- | --- | --- | --- | --- |
| Owner asset-plan decision | 推奨初期計画を一つの低負担判断へ圧縮 | 次のconstruction contractで対象strategyを固定できる | exact packet/fingerprint、A/B/C、例外はrequirement IDのみ | pending | Product Owner | A採用、Bで例外ID指定、またはC再構成を一つ返す |
| Material construction | accepted planをprivate local assetsへ変換 | no-publish assemblyの素材入力を作れる | accepted plan、別execution contract、new-source/identity handling、no render | deferred / unauthorized | future worker + Owner | Owner asset-plan decision後も別承認で開始 |
| Voice calibration | 180秒枠のsynthetic voice条件を計測 | audio laneの実測根拠を作れる | engine/voice/provider/credential authority、separate calibration contract | deferred / unauthorized | voice owner | material planとは独立に別承認 |
| Offline assembly | 180秒の非公開組立てを作る | timing/asset/voiceの統合確認が可能 | accepted material plan、constructed assets、voice calibration、render authorization | H3 / closed | production owner | 前提4 gate完了後だけ提案 |
| Publication / final story authority | 公開物と物語上の最終判断を確定 | external deliveryを開く | rights review、production acceptance、explicit release decision | closed | Product Owner / rights owner | current packetからは進めない |
