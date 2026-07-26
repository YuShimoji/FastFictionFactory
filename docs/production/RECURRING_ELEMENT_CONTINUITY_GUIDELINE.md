# Recurring-element continuity guideline

新規生成または編集の前に `artifacts/recurring-element-continuity/recurring-element-continuity.json` の7 entryを読む。各entryについて、first appearance、appearance list、invariant、allowed variation、forbidden drift、future generation gateを満たす。

## 必須運用

1. 新しいshotに登場する反復要素のelement_idを列挙する。
2. protected anchorがある場合はexact anchor imageを参照し、既存byteは変更しない。
3. invariantとforbidden driftをpromptまたはedit specificationへ明記する。
4. 生成後にappearance mapへ新しい候補を追加し、既存entryを上書きしない。
5. 人物・制度の責任、rights、production、canonをvisual similarityから推論しない。

3 anchorは `shot-b02-03`、`shot-b04-01`、`shot-b05-02` です。今回のCASE_DIGESTにshot-b05-02は含まれませんが、accepted source inventoryのimmutable anchorとして保持します。
