# Narrative format quarantine

`FFF-Q-3MIN-LINEAR-LORE-EXPOSITION-2026-07-26` records the Product Owner decision that the previous clarity narrative format is rejected for continued use.

隔離対象はsix-beat narrative、20本のreview caption、20本のproduction subtitle draft、失われた時間と消えた名前の一方を選ばせるclosureです。19枚のaccepted primary-image bytes、3つのimmutable anchor、rendered outgoing terminal frameを使うtransition methodは隔離対象ではありません。

旧packageは歴史的証跡として変更せず保持します。隔離済みの文章・構成を新しいactive trackへ戻す場合は、新しいProduct Owner判断と別identityが必要です。

## Canonical isolation boundary

Repository visibility is `public`, Git-history distribution is `authorized`, and the prior local-only interpretation is `superseded`. “Private” in retained artifact identifiers means an unreleased product candidate; it does not mean repository confidentiality.

The corrected coherent CASE_DIGEST successor candidate is external to the current master tree:

- artifact: `fff-private-raster-case-digest-001`
- ref: `refs/heads/codex/fff-case-digest-format-reset-continuity-v1`
- commit: `2e96bd380d47869024587eeb19b3f054064390af`
- MP4 SHA256: `0fb679b5d13d56b726a505d060bf9678daa49a1c138e10657954cd7053765df1`
- package fingerprint: `0f701e7cfa106dee19cf6e378eec1082920cd7f119f37be0f09696ac8020fbf2`

The candidate is default-off, not integrated, human-review-pending, unreleased, and without rights approval. The current master successor is `null`; `fff-private-previsualization-timeline-001` remains active/default. Historical misintegration commit `f817003ea2156817220225a1b25f39cbcd7b09f3` remains publicly obtainable without history rewrite.

| Prior state | Current state | Affected consumers | Migration | Rollback boundary |
| --- | --- | --- | --- | --- |
| Local-only interpretation | Public Git storage; product unreleased | Repository readers and candidate reviewers | Use the public candidate ref and exact commit identity | Keep Git history; no rewrite or force-push |
| f817003e master misintegration | Coherent candidate on the dedicated branch | Master consumers and successor tooling | Resolve the external ref at exact C2 | Any reintegration requires a new forward commit and authority |
| Stale historical MP4 | Coherent eleven-cue candidate MP4 | Human review and media verification | Bind review to artifact + commit + MP4 SHA + package fingerprint | Historical MP4 is history, not current review evidence |
| Live successor/shared routes | Successor `null`; candidate-local routes | Manifest, MkDocs, dispatcher, tests, and links | Remove master consumers and use the external locator | No merge, cherry-pick, default promotion, or shared dispatcher without new authority |
