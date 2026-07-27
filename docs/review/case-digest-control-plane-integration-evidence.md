# CASE_DIGEST control-plane integration evidence

`fff-case-digest-control-plane-integration-evidence-001` closes a support-evidence gap without changing product state. It freezes the 85 result artifacts visible at control-plane commit `dab9810961b64f1e31420f18797e897e1ef05819`, records their exact paths, byte sizes, SHA256 identities, and one-and-only-one inventory class, then leaves the new evidence result as an explicit 86th support result.

## Inventory decision

The prior `76 baseline + 5 additive = 81` summary omitted four real results from its prose; it did not expose missing files or nine descendants. The corrected classification is:

| Class | Predecessor | Final worktree | Why it is distinct |
| --- | ---: | ---: | --- |
| Protected baseline | 76 | 76 | Readiness owns exact historical path/size/hash identities |
| Accepted additive descendant | 5 | 5 | Valid post-baseline, passing, non-authority results |
| Current control-plane result | 1 | 1 | The bounded CASE_DIGEST control-plane result |
| Baseline/current authority, nonbaseline | 3 | 3 | Readiness packet, active preview, and resumable pipeline define or carry current authority but are not members of the 76-file baseline |
| Integration evidence result | 0 | 1 | This support-only reconciliation and path-audit record |
| Archived/superseded nonbaseline | 0 | 0 | Available forward class, unused here |
| Excluded nonresult | 0 | 0 | No result-named artifact is excluded |
| Total | 85 | 86 | Both arithmetic totals are exact |

The predecessor inventory SHA256 is `361e16663e2da86e18c5c30c853fc23c8a598460c06e673de1d9a6ca20c06b73`. The final aggregate is emitted by the read-only root validator rather than embedded in a result that would have to hash itself.

## Forward behavior

Every `artifacts/**/*-result.json` file is enumerated recursively. The registry provides explicit authority and support classes; the validator derives protected-baseline membership from the 76-file Readiness authority and accepts a new result only when it is a well-formed passing non-authority result with a noncolliding artifact identity. An unclassified result, duplicate membership, missing or changed baseline file, incorrect total, baseline identity collision, or unregistered current-authority claim blocks safety. Inventory growth alone does not.

## Writer compatibility and integration boundary

Target base is `bcdf84e4d89f26bf41d288f8282d7ae50911cc1e`. Git reports 13 changed paths for control-plane commit `dab9810961b64f1e31420f18797e897e1ef05819` and 24 for Writer commit `11c30b264f8f257cc802ac218998479b805648e7`; their exact path intersection is empty. The declared eight support paths in this follow-up also have no Writer overlap, while five intentionally overlap the control predecessor they refine.

The semantic intersection is limited to the accepted/default-off CASE_DIGEST identity, missing-causality and quarantined linear-lore boundaries, and read-only protected-product behavior. Both sides read the accepted CASE_DIGEST result/package and narrative quarantine; neither needs to overwrite the other’s paths.

Recommended integration order is the control-plane predecessor, this evidence follow-up, then Writer. After integration, run Node syntax, the root control-plane validator, both control-plane focused tests, CASE_DIGEST 14/14, Writer focused tests, and `git diff --check`. Integration and push status remain `pending` / `not_authorized`; no cherry-pick, merge, push, default promotion, production action, rights action, release, publication, or canon effect is performed here.

## Evidence location

The machine-readable record is `artifacts/case-digest-control-plane-integration-evidence-result.json`. It contains the complete frozen 85-path/hash inventory, exact changed-path lists and intersections, shared read dependencies, excluded stale inputs, targeted post-integration checks, and unchanged product/default/acceptance boundaries.
