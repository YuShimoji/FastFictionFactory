# Held Claim Adoption Preflight

Artifact id: `fff-held-claim-adoption-preflight-001`

This readback checks whether the held claim exposed by the minimal translated memo fixture is safe to carry forward as a future local adoption candidate. It does not adopt the claim, canonize the claim, mutate Profile / Claim / Timeline state, call a provider, or open production work.

## Preflight Boundary

- Input readback: `artifacts/translated-memo-fixture-minimum-result.json`
- Result: `artifacts/held-claim-adoption-preflight-result.json`
- Source output: `artifacts/extraction-adapter-outputs/multilingual-memo-notes.json`
- Policy precondition: `artifacts/translation-policy-source-of-truth-boundary-result.json`
- Smoke command: `node tools/fff-state.mjs smoke-held-claim-adoption-preflight artifacts/translated-memo-fixture-minimum-result.json artifacts/held-claim-adoption-preflight-result.json`

## Inspected Claim

| Field | Value |
| --- | --- |
| Source span id | `multi-x-object-brass-moth-key` |
| Translated fixture row | `translated-min-row-moth-key-label` |
| Held claim id | `multi-claim-moth-key-label` |
| Claim status before preflight | `hold` |
| Downstream target classes | `profile`, `claim`, `timeline` |
| Adoption decision | `not_adopted` |
| Canon status | `false` |

## Expected Readback

- held claims inspected: `1`
- source-backed claims: `1`
- eligible adoption candidates: `1`
- actually adopted claims: `0`
- canonized claims: `0`
- translation/gloss leak count: `0`
- provider configured / external call attempted / credentials touched: `false / false / false`

## What It Proves

The claim can be recognized as a future local adoption candidate because it is source-backed by the author memo, still held, linked to a translated fixture row that has no translation leakage, and protected by the contradiction and downstream gates. This makes the next workflow step concrete: a future adoption path can consume this preflight row without reinterpreting translated text as authority.

## What It Does Not Prove

This preflight does not accept the claim, write canon, update Profile / Claim / Timeline state, choose the brass moth key function, resolve Toma fate, resolve brass moth truth, choose a provider, use credentials, call an external API, publish, sync production state, or prepare release output.
