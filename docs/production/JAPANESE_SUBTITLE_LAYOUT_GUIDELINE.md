# Japanese subtitle layout guideline

字幕本文は意味のあるsource textとして保持し、改行文字、`|`、`｜`などのauthored hintを埋め込まない。表示時の改行は選択fontの実測幅から導く。

## 現行測定契約

- font: Yu Gothic UI
- engine: Sharp/libvips/Pango text raster metadata
- profiles: 960x540、1280x720、desktop 1440x1000、narrow 390x844
- one-line preference: full measured widthがsafe widthの82%以下
- two-line maximum
- 両行がsafe width以下
- 下行は6文字以上かつfull measured widthの35%以上
- 行頭禁則、行末禁則、固有名詞 `ミラ・ヴェイル` / `9時17分` / `市の評議会` の途中分断を禁止
- 数字と年月日時分秒個本枚人の分断を禁止

測定証跡は `artifacts/private-raster-case-digest/subtitle-layout-evidence.csv` に1 cue x 4 profiles = 44 rowsで保存する。font、viewport、safe width、全幅、各行幅、break index、各rule結果を記録する。新しい字幕またはfont変更は新しい測定identityとして全profileを再生成する。
