# Fast Fiction Factory Translation Policy Source-of-Truth Boundary

Artifact id: `fff-translation-policy-source-of-truth-boundary-001`

This readback defines the narrow translation policy boundary needed before any
translated memo fixture or provider adapter work. It builds on
`fff-translation-provenance-source-span-readback-001` and keeps the active
Review Hub artifact as `fff-contradictory-claim-guard-001`.

## Policy Boundary

| Boundary | Current Rule | Effect |
| --- | --- | --- |
| Source-of-truth language | The original author memo text, including mixed-language phrases exactly as written, owns source-span authority. | Extracted source spans keep pointing at raw memo char offsets, not translated prose. |
| Original span ownership | Original sourceSpan locators remain the evidence owner for extracted elements and generated claims. | Claims can be traced back to the memo even when labels or phrases are multilingual. |
| Translation span ownership | A translated span is derivative-only and must declare translator/provenance plus its original source-span link. | A future translated fixture can be useful without replacing author-memo evidence. |
| Inline gloss boundary | Inline gloss counts only as author memo text when the gloss already appears in the memo. | Gloss text cannot create an unowned claim or silently become a translation policy. |
| Derived claim promotion | Translation or gloss-derived claims start held and source-backed. | Auto-adopt, provisional promotion, and canon promotion remain blocked until human review. |
| Contradiction expectation | Conflicting translation/gloss claims must stay source-backed, uncertain, reciprocal where applicable, and held. | The contradictory claim guard remains the claim-safety gate. |
| Translated fixture allowance | A translated fixture is allowed only as a separate narrow slice after it preserves original spans and declares translation provenance. | Fixture work can move next without guessing ownership. |
| Provider adapter boundary | Provider work remains blocked until provider choice, credentials, endpoint, transport, external call permission, timeout, retry policy, and local gates are explicit. | This policy does not open API or credential work. |

## What This Proves

- The multilingual memo's original text is the current source-of-truth language
  surface for source spans.
- The previous provenance readback already traces 3 selected source spans into
  held derived claims and 1 inline gloss boundary row.
- Inline gloss is bounded as existing author memo text, not as an external
  translation or claim authority.
- A future translated fixture now has concrete ownership requirements before it
  can be useful.

## What This Does Not Prove

- It does not create or approve a translated fixture.
- It does not verify translation quality or choose a translation provider.
- It does not call an API, configure credentials, implement provider transport,
  import provider output, or persist provider data.
- It does not adopt Profile, Claim, or Timeline candidates.
- It does not decide Toma fate, brass moth truth, Council motive, or which
  contradictory claim is true.

## Validation Contract

This readback is complete when:

- `node tools/fff-state.mjs smoke-translation-policy-source-of-truth-boundary artifacts/translation-provenance-source-span-readback-result.json artifacts/translation-policy-source-of-truth-boundary-result.json` passes.
- The active manifest validation command includes the policy boundary smoke.
- Existing translated memo audit, translation provenance readback, contradictory
  claim guard, downstream adoption gate, malformed/missing span guard,
  provider-envelope no-call, provider authorization readiness, state,
  extraction, fixture, MkDocs, and whitespace checks remain passing.

## Next Use

Use this policy as the entry condition for a future translated memo fixture. The
fixture should keep original memo spans as source-of-truth evidence, store
translation text only as derivative/provenance-bound evidence, and keep any
translation-derived claims held until human review.
