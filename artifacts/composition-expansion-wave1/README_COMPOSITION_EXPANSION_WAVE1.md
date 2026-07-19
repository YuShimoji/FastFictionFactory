# Composition Expansion Wave 1

`fff-composition-expansion-wave1-001` は、Beat 1「鐘のない塔」と Beat 3「消された名前」の6ショットを、実在する再利用可能ライセンスのローカル参照画像で具体化する H0 参照構図パッケージです。

## 開き方

PowerShell でリポジトリルートから次を実行します。

```powershell
Invoke-Item .\artifacts\composition-expansion-wave1\composition-expansion-wave1.html
```

ページは単体HTMLです。Auto（既定）、Light、Darkを切り替えられ、狭い画面では画像が説明文より先に並びます。

## パッケージ内容

- `composition-expansion-wave1.html`: 6ショットの主レビュー面
- `composition-expansion-wave1.json`: 正準のショット、構図、参照、境界データ
- `reference-sources.csv`: 12件の出典・ライセンス・寸法・ハッシュ
- `shot-composition-map.csv`: ショットから主画像・補助画像への対応
- `composition-expansion-wave1-contact-sheet.jpg`: 参照画像一覧
- `composition-assets/`: 正規化・メタデータ除去済みのローカルJPEG 12点
- `composition-expansion-wave1-manifest.json`: ペイロードの固定インベントリとSHA256

## 検証

通常検証は読み取り専用です。

```powershell
node tools/fff-state.mjs validate-composition-expansion-wave1 artifacts/composition-expansion-wave1-result.json
```

スモークは新規Wave 1のmanifestとresultだけを再生成し、取得済み参照画像は書き換えません。

```powershell
node tools/fff-state.mjs smoke-composition-expansion-wave1 artifacts/composition-expansion-wave1-result.json
```

## 証拠境界

本パッケージはローカル限定・参照限定です。参照画像の制作採用、権利処理完了、画像生成、制作承認、レンダー準備、内容・尺・canon変更、外部再現性を主張しません。Beat 4のOwner Reviewは構図展開の方向承認であり、独立した転移証明ではありません。Wave 1直後の人手レビューは置かず、次の人手レビューは19ショット統合ビジュアルパッケージ完成後です。
