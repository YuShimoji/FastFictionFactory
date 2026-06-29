# Minimal Translated Memo Fixture

Artifact id: `fff-translated-memo-fixture-minimum-001`

This readback adds the smallest translated memo fixture that has decision value after `fff-translation-policy-source-of-truth-boundary-001`. It keeps the active Review Hub identity on `fff-contradictory-claim-guard-001` and uses the existing multilingual memo output as the only source surface.

## Fixture Boundary

- Fixture: `artifacts/translated-memo-fixture-minimum.json`
- Result: `artifacts/translated-memo-fixture-minimum-result.json`
- Source memo: `artifacts/extraction-adapter-fixtures/multilingual-memo-notes.md`
- Source output: `artifacts/extraction-adapter-outputs/multilingual-memo-notes.json`
- Policy precondition: `artifacts/translation-policy-source-of-truth-boundary-result.json`
- Smoke command: `node tools/fff-state.mjs smoke-translated-memo-fixture-minimum artifacts/translated-memo-fixture-minimum.json artifacts/translated-memo-fixture-minimum-result.json`

The fixture has two rows:

| Row | Original span owner | Translation owner | Claim effect |
| --- | --- | --- | --- |
| `translated-min-row-moth-key-label` | `multi-x-object-brass-moth-key` in the original author memo | `declared_derivative_translation_only` | Points at existing `multi-claim-moth-key-label`, which remains `hold` |
| `translated-min-row-inline-gloss-boundary` | `multi-x-placeholder-translation-boundary` in the original author memo | `declared_derivative_translation_only` | Creates no claim and tests that inline gloss stays bounded |

## What It Proves

The translated rows preserve original sourceSpan locators and raw memo text as the source of truth. The translated text is only a derivative fixture layer with explicit provenance back to the original memo span. It does not replace the original span, create a new claim from translation text, or promote an existing claim.

The expected readback is:

- translated fixture rows checked: `2`
- original span mismatches: `0`
- translation-to-claim leakage count: `0`
- held claim count: `1`
- auto-promotion count: `0`
- inline gloss claim leakage count: `0`
- provider configured / external call attempted / credentials touched: `false / false / false`

## What It Does Not Prove

This fixture does not validate translation quality, select a provider, configure credentials, call an external API, import provider output, adopt downstream Profile / Claim / Timeline candidates, or decide Toma fate, brass moth truth, Council motive, moth-key function, or contradictory claim truth.

## Next Use

Use this fixture as the minimum regression target before adding broader translated memo coverage. If a future slice adds more translated rows, each row should keep the same ownership rule: original multilingual memo text owns source truth; translated text is derivative and provenance-bound; claims stay held unless a human explicitly decides otherwise.
