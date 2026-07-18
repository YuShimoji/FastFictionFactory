# Beat 4 Composition Counterexample

## Outcome

`fff-beat4-composition-counterexample-001` は、Beat 4「評議会の影」`01:20–01:45` の正確な3ショットだけを対象にした H0 構図反例です。Beat 2 Composition Board で有効だった具体化手順を、制度空間、二説の等価比較、環境と文書の緊張という異質な3画面へ移したとき、構造的に検査できる状態を作ります。

この成果物は全編19ショットへの一般化を証明しません。H1 blind review、素材選定、権利処理完了、最終モーション、レンダー、公開、production approval、canon decisionは実施していません。

## Exact slice

| Shot | Window | Duration | Scale / motion / transition | Composition class |
| --- | --- | ---: | --- | --- |
| `shot-b04-01` | 01:20–01:28 | 8s | `wide / slow_push / hard_cut` | `anonymous_institutional_depth` |
| `shot-b04-02` | 01:28–01:36 | 8s | `graphic_fullframe / locked / graphic_match` | `equal_weight_abstract_comparison` |
| `shot-b04-03` | 01:36–01:45 | 9s | `medium / slow_pull / held_fade` | `environment_plus_document_tension` |

## Composition evidence

### Shot 1 — anonymous institutional depth

半透明の仕切り、顔を読めない背面シルエット2名、窓と無人空間を foreground / midground / background に分離します。最初の焦点は二つの影、次の焦点は右奥の空間です。実在会議写真は人物の物語上の身份を借りず、背面の量感と窓の反復だけを参照します。`identifiable_face=false`、`identifiable_official=false`、`guilt_cue=false`、`villain_coding=false` を機械検査します。

### Shot 2 — equal-weight abstract comparison

「時間販売の告発？」と「偽の記録？」は左右 `50 / 50`、見出し `22px / 22px`、差 `0%`、同一色トークン、同一フィルターです。winner icon、片側だけの色・glow・shadow・saturationはありません。中央の等分線から左右へ同距離で往復し、どちらも事実または優勢な説明へ昇格させません。

### Shot 3 — environment-plus-document tension

閉じた会議室を環境層、Shot 2と同一IDの台帳を文書影として別層に置きます。視線は左下の台帳から机の直線を経て右奥の閉じた壁面へ進みます。`MOTIVE UNKNOWN` は小さな中立ラベルで、動機、責任、台帳の真正はいずれも未決です。

## Reference and license audit

6点はすべてローカルJPEGで、各ショットに1 main + 1点以上の supporting を割り当てています。作者、source page、original media URL、取得URL、ライセンス名・URL、取得日、元・取得・ローカル寸法、ローカルパス、SHA-256、ショット利用、役割を正規JSONと `reference-sources.csv` に記録します。

- Wikimedia Commons: Manuel Schneider / `CC BY-SA 3.0`
- Flickr: Timo Newton-Syms / `CC BY-SA 2.0`
- Flickr: Carolina Prysyazhnyuk / `CC BY-SA 2.0`
- Flickr: Loozrboy / `CC BY-SA 2.0`
- Library of Congress: Plantijnse Drukkerij / no known copyright or other restrictions
- Flickr Commons: Het Nieuwe Instituut - Architecture Collection; photographer unknown / no known copyright restrictions

全素材は `reference_only=true`、`selected_for_production=false`、`rights_cleared_claim=false` です。明示ライセンスまたは公開機関の再利用表明を記録したことは、個別制作への採用や権利処理完了の主張ではありません。

## H1 boundary

`H1_TRANSFER_REVIEW.md` は未記入です。Phase AではHTMLだけを見て principal subject、crop、3層、焦点、視線、借用部分、motion class、前後関係、blocking questionを自由記述します。Phase Bはその記入後だけ正規JSON、Execution source rows、旧symbolic frameと比較し、`improved_and_executable / improved_but_blocked / not_improved` のいずれかを付けます。このWorkerは分類も合否も記入していません。automatic full-story expansionは `false` です。

## Machine gate

Read-only validation:

```powershell
node tools/fff-state.mjs validate-beat4-composition-counterexample artifacts/beat4-composition-counterexample-result.json
```

Intentional Beat 4 derivative regeneration:

```powershell
node tools/fff-state.mjs smoke-beat4-composition-counterexample artifacts/beat4-composition-counterexample-result.json
```

検証対象は、3ショットのidentity/timing、6点の出典・寸法・hash、参照割当、3構図クラス、Shot 2の等価性、Shot 1の匿名性、Shot 3の未決性、H1空欄、package manifest、30/30 fail-closed probes、2 viewport、Light/Dark/Auto、focus、print、predecessor fingerprint、root registrationです。normal validationはartifactを書き換えません。

## Source immutability

| Protected source | Expected fingerprint |
| --- | --- |
| Beat 2 Composition Board package | `4c44089a140626d56fd67f8341a4765e60f310ff65555c8ff8a0eef3eff7f3b0` |
| Beat 2 Visual Treatment package | `8867f6265099f4dffbfc090d7a988c195644949acbca0c104a0f7c6911205c63` |
| Visual Treatment 13-file aggregate | `bea1514a2a497ac38f475b640e00c0ed1bb2657f62ac4d81c806d362e50d532b` |
| Storyboard 7-file aggregate | `bb9d4fce3ed5ac328b49f0ac691e0ab9b6ca671d0318ef4e60522dca7a6fabb8` |
| Execution 9-file aggregate | `10d3675723c3282cba0fdd516654640a7c16749fef80279b7223b4e5dc436345` |

## H0 acceptance evidence

- Result: `passed=true`, `failures=[]`, fail-closed probes `30/30`
- Package: 13 payload files + manifest; fingerprint `2f0e0032b30725dc678d27e31169f6fda1a7bf8c4586735a8d0fc6f73b6d6805`
- Read-only proof: normal validationの前後でBeat 4対象集約署名 `17b63c9dfee4269dfdee3fcf41a3c36f1080eef301cfca02b8fb9ecc86b8860a` が一致し、Git statusも一致
- 900×1200 Dark: document width 900px、horizontal overflow false、nested scroll 0、main share最小 `0.7292`、列高差最大 `0px`
- 1280×900 Light: document width 1280px、horizontal overflow false、nested scroll 0、main share最小 `0.75`、列高差最大 `0px`
- Shot 2 measured: panel幅 `349.70px / 349.70px`、差 `0px`、headline `22px / 22px`、同色、同filter、測定contrast ratio `10.79`
- Theme/focus/print: Auto initial、Dark/Light explicit resolution、focus outline `3px` + offset `4px`、print body white、utility hidden、shot break avoid
- Screenshot hashes: 900 Dark `78b50e471e23c5f57a32ce0c4602df4569ea2f0eb8ee55b9a2ad4cbf03f509c3`; 1280 Light `350999e70c01792c3b5f17e96da4cc6af4b30018fcdbd5f121ee4b6d54bee960`
- Root chain: Beat 4 → Beat 2 Board → Visual Treatment → Storyboard Brief → Execution Pack のread-only validationが順にpassし、実行前後のGit statusが一致
- Documentation: `uvx --from mkdocs-material mkdocs build --strict` が成功

## Autonomous repairs and rejected references

- Flickr取得画像の申告幅と実byte幅が1px異なる素材は、実測幅に合わせて偶数cropへ修正した。
- Shot 1は背面2名だけへcropし、grayscale・暗部強調・軽いblurで顔、名札、会議名を除外した。
- Shot 2の補助gridがintrinsic画像幅と高さを持ち込んだ問題は、`min-width: 0`、明示main幅、figure margin resetで修正し、overflow false・列高差0pxを再測定した。
- Browser証跡はdocument自身をnested scrollへ数えず、実overflowの真偽、keyboard focus、print mediaを直接測るよう修正した。
- Reject: `Woman behind frosted glass` は姿勢が劇的で中立な制度影に不適合。宗教的な会議室は不要な制度意味を持つため不採用。実在official/politician/scandal画像は誤帰属リスク、低解像度素材は寸法不足、曖昧ライセンス素材は出典境界不足で不採用。

## Residual work

| Purpose | Effect | Requirements | State | Owner | Next move |
| --- | --- | --- | --- | --- | --- |
| H1 blind transfer review | Beat 4で構図判断が他者へ転送できるかを人間判断する | 別レビュアー、Phase A先行、3ショット分類、critical misread確認 | Not started | Supervising AI / human reviewer | H0受領後に別スライスとして実施 |
| One bounded repair, if needed | 弱い1ショットだけを局所修正する | H1でweak shotがちょうど1件、修正1回、同じ境界 | Conditional | Future worker | H1結果が条件を満たす場合だけ提案 |
| Generalization decision | 残りBeatへ進むか停止する | 異質Beat 2件のH1証拠、2 weakならblocker | Deferred | Supervisor | H1完了後に判断。自動開始しない |
| Production/rights/canon | 実制作に必要な所有者判断を行う | 素材選定、個別権利確認、制作・正史承認 | Closed | Human owners | 本成果物からは開始しない |
