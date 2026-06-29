# Translation Provenance Source-Span Readback

Artifact: `fff-translation-provenance-source-span-readback-001`

Current status: preserved auxiliary readback under the active
`fff-contradictory-claim-guard-001` surface. This slice records how selected
multilingual source spans connect to held derived claims before any translated
fixture, translation policy, provider adapter, or downstream adoption path
exists.

## Purpose

`fff-translated-memo-fixture-audit-001` correctly left translated memo text as a
policy-dependent gap. This readback adds the missing inspection layer: it shows
which existing multilingual memo source spans are used, what local
translation-or-normalization step is claimed, which derived claim is produced,
and which guard keeps that claim out of canon.

The machine-readable result lives at
`artifacts/translation-provenance-source-span-readback-result.json`.

## Readback Rows

| Source item | Source span | Derived claim | Provenance / guard |
| --- | --- | --- | --- |
| `multi-x-object-brass-moth-key` | `brass moth key is called "真鍮の蛾の鍵"` | `multi-claim-moth-key-label` | Inline multilingual label is preserved from author memo text; claim stays `hold`, `uncertain`, high risk, and source-backed. |
| `multi-x-organization-archivists` | `Council archivists の記録 says Toma's route is a clerical error` | `multi-claim-clerical-error` | Mixed-language record phrase is preserved; Council motive and Toma fate stay human-owned. |
| `multi-x-event-noon-ring` | `observatory rings at noon even though bell is missing` | `multi-claim-noon-ring` | Inline English gloss already present in the memo is used as author memo text; no external translation is inferred. |
| `multi-x-placeholder-translation-boundary` | `English gloss is in-line only` | none | Boundary row prevents an inline gloss from becoming an unowned translation policy or generated claim. |

## What This Proves

- 3 selected source-span to derived-claim relations are readable from the raw
  multilingual memo to held claim candidates.
- 4 checked source spans match the raw memo and source-span pack rows.
- Claim provenance keeps source refs, generator identity, held status, and
  no-provider/no-credential state visible.
- The contradictory claim guard, malformed/missing span guard, and downstream
  source-span adoption gate remain preserved.

## What This Does Not Prove

- It does not approve translated memo fixtures or translation policy.
- It does not choose source-of-truth language or original-vs-translation span
  ownership.
- It does not call a provider, configure credentials, add model/API behavior,
  adopt downstream candidates, or promote canon.
- It does not decide Toma fate, brass moth truth, Council motive, or which
  contradictory claim is true.

## Boundary

No translated fixture, translation API, provider choice, endpoint, credential,
database persistence, publishing, production sync, AI video generation,
downstream adoption implementation, or final canon decision is added here.

## Validation Contract

This readback is complete when:

- `node tools/fff-state.mjs smoke-translation-provenance-source-span-readback artifacts/extraction-adapter-outputs/multilingual-memo-notes.json artifacts/translation-provenance-source-span-readback-result.json` passes.
- The active manifest validation command includes the translation provenance
  source-span smoke.
- Existing translated memo audit, very broad source-span audit, contradictory
  claim guard, downstream adoption gate, malformed/missing span guard,
  provider-envelope no-call, state, extraction, fixture, MkDocs, and whitespace
  checks remain passing.
