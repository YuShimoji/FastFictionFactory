# デンソウ Season 1 Episode 1 Quick-win

## 現在状態

`fff-densou-series-episode-quickwin-001`は、既存repository素材を現在のユーザーoverrideでprivate development inputとして選定し、Season 1の調査mapとEpisode 1「鐘のない塔」の12分review treatmentを一つの検証可能なpacketへ固定したものです。

Primary sourceは`artifacts/sample-raw-memo.md`、SHA-256は`256837a94afd521cadfcb676da2c3873a914ce95f11f493d5b60e15bc42f9a32`、revisionは`densou-256837a94afd521c`です。このファイルは自らを「Sample Raw Memo」と表示するrepository fixtureであり、別送されたデンソウ原典全文とは表現しません。

## Source basis

| Role | Path | SHA-256 | Evidence class |
| --- | --- | --- | --- |
| Primary selected source | `artifacts/sample-raw-memo.md` | `256837a94afd521cadfcb676da2c3873a914ce95f11f493d5b60e15bc42f9a32` | current user overrideで選定したrepository author-memo fixture |
| Supporting story structure | `artifacts/private-full-raster-clarity-candidate/story-spine-clarity-v1.md` | `509f96b88ca8e9ffcc5f6218372d41010f6b7cb2db9dc23c5079746d48f5497d` | 派生story spine |
| Supporting fact boundary | `artifacts/private-raster-case-digest/case-digest-script.md` | `4673e50999ff68cb0b56ce6ca51ca6f0dd62c002a393dab24b967846f8b1dabe` | 人間comprehension receiptを持つ派生CASE_DIGEST |
| Supporting serial form | `artifacts/one-story-draft-review-pack-result.json` | `48c06c96f347dd4e8cd88449d3f38b3f942ac5061376814ac444296431ec1b79` | provisional mystery-lore serial route |

`artifacts/sample-story-memo.md`は追加人物名とより確定的なending候補を含む別memoなので、primaryへ無断結合していません。

## Season／Episode identity

- Source basis: `fff-densou-source-basis-b2cab3adb7c270d8`
- Series: `densou-series`
- Season: `densou-season-01` / working title「失われた分と名前」
- Episode: `densou-s01e01-bellless-tower` / working title「鐘のない塔」
- Form: `long_form_episode_development_treatment`
- Editorial window: 720 seconds / 8 continuous segments
- Season map: Episode 1を完整packetとして記録し、Episode 2–6はsource-backed investigation questionだけを置いた未執筆slot

## Review入口

`artifacts/densou-series-episode-quickwin-001/densou-episode-001-review.html`

Reviewでは次だけを判断します。

1. 第1話として事件、調査者、個人的手掛かり、台帳、告発、証拠限界、現在地が連続して理解できるか。
2. 原メモの記述と派生証拠の記述を混同していないか。
3. 後続episodeの問いが、未証明の因果や回答を作らずにseries経路を開いているか。

## 再現と検証

```powershell
node tools/fff-densou-series-intake.mjs init `
  --authority artifacts/densou-series-intake/densou-authority-input.json `
  --source artifacts/sample-raw-memo.md `
  --out 'C:\path\to\new-empty-intake-packet'

node tools/fff-densou-series-episode-quickwin.mjs build `
  --out 'C:\path\to\new-empty-episode-packet'

node tools/fff-densou-series-episode-quickwin.mjs verify `
  --root artifacts/densou-series-episode-quickwin-001

node --test tests/fff-densou-series-episode-quickwin.test.mjs
```

## 閉じたままのgate

このpacketはfinal script、picture/audio lock、完成動画、human acceptance、final canon、rights clearance、production approval、provider／credentials、publication、upload、releaseを成立させません。次の製品判断は、exact review HTMLに対するEpisode 1の方向性判断です。
