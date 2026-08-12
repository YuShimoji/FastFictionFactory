# Densou Source-Unbound Hardening Review

This review delta is based on `origin/codex/densou-series-intake-v1@acf7898` and remains isolated from `master`. It does not decide whether the three candidate commits should be adopted, and it does not bind or select actual Densou source material.

## What changed

| Area | Before | Hardened behavior |
| --- | --- | --- |
| Source readiness | Separate static validators; `status` created a blocker on first unbound lookup | `audit-source-readiness` combines the contract, preflight, source-independent package, live scope index, and quarantine checks without writes or questions |
| CLI identity | Duplicate options used the last value; binding IDs were accepted as path segments | Duplicates fail, IDs use the exact `densou-binding-<20 lowercase hex>` form, and traversal-like values fail before lookup |
| Vault record | Mutable record fields and portable locator were trusted after basic schema checks | Identity fields recompute the binding ID and the locator must equal the hash-addressed object path before bytes are read |
| Legacy intake | Documentation said forensic-only while source-bearing `status` and `init` still operated | Source inspection and packet creation return `LEGACY_MUTATION_DISABLED`; historical verification remains available |
| Wrong-source quick-win | Tracked payload could be rebuilt and reported `WAITING_USER_DECISION` | Build is disabled; structural verification reports `WRONG_SOURCE_EVIDENCE_QUARANTINED`, reuse=false, product progress=false |
| Wrong-source video/audio | Validation depended on a machine-local packet path and could enter decode or synthesis routes | Quarantine is checked first; plan, build, verify, decode, synthesis, and resubmission routes stop with the explicit quarantine code |

## Read-only re-entry

```powershell
node tools/fff-densou-durable-source-binding.mjs audit-source-readiness
node --test tests/fff-densou-series-intake.test.mjs tests/fff-densou-series-episode-quickwin.test.mjs tests/fff-densou-durable-source-binding.test.mjs tests/fff-densou-episode-video.test.mjs tests/fff-densou-episode-audio-repair.test.mjs
```

The focused suite passes 42/42. Repository-wide execution passes 64/72; the eight failures are the inherited CASE_DIGEST successor/readiness-baseline drift already present outside this Densou delta. The hardened video/audio tests assert that quarantine occurs before packet lookup, decode, SAPI synthesis, or output creation. Existing media bytes are not regenerated or changed.

## Still human-owned

- adoption, rejection, or splitting of commits `5637c9d`, `a98717a`, and `acf7898`;
- actual source identity and file selection;
- revision, canon label, provenance assertion, and rights assertion values;
- whether historical wrong-source artifacts should remain in Git, move to a dedicated evidence archive, or be excised in a separately reviewed change;
- creative acceptance, production approval, publication, distribution, or release.
