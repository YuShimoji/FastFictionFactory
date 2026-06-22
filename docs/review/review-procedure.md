# Review Procedure Lock

Artifact: `fff-review-procedure-lock-001`

## Purpose

This document fixes the local review procedure for the Visual Review Hub. It does not ask for user review now, and it does not change extraction behavior, schemas, model/API boundaries, persistence, publishing, or canon authority.

The procedure keeps `public/review/index.html` as the single local review entry point while making identity, access, screenshot evidence, optional review, required review, and Review Debt explicit enough for future terminals and threads.

## What To Open

| Review target | Identity | Access |
| --- | --- | --- |
| Visual Review Hub | `artifact_id: fff-review-procedure-lock-001`; `repo_relative_path: public/review/index.html`; source of truth: `artifacts/artifact-manifest.json` | PowerShell: `.\scripts\operator\open_review.ps1`; direct open: `Invoke-Item .\public\review\index.html`; sh: `./scripts/operator/open_review.sh` |
| Story Review mode | Same Review Hub artifact; mode selected by `?mode=story` or the Story Review tab | Open `public/review/index.html?mode=story` or click `Story Review` |
| Source Audit mode | Same Review Hub artifact; preserves `fff-source-span-routing-review-pack-001` | Open `public/review/index.html?mode=source` or click `Source Audit` |
| Project Cockpit mode | Same Review Hub artifact; preserves current status, boundaries, and implementation map | Open `public/review/index.html?mode=project` or click `Project Cockpit` |
| Artifacts mode | Same Review Hub artifact; manifest and validation access surface | Open `public/review/index.html?mode=artifacts` or click `Artifacts` |
| Source-span review pack | `artifact_id: fff-source-span-routing-review-pack-001`; `repo_relative_path: artifacts/source-span-routing-review-pack.json`; manifest: `artifacts/artifact-manifest.json` | Use Source Audit mode for representative rows; open the JSON for all 36 rows |
| Model/API boundary spec | `artifact_id: fff-model-api-boundary-spec-001`; `repo_relative_path: docs/review/model-api-boundary-spec.md`; manifest: `artifacts/artifact-manifest.json` | Read the spec doc; no external call is allowed by this artifact |

## What The Screenshots Represent

| Evidence file | Represents | Use |
| --- | --- | --- |
| `artifacts/fff-current-review-screenshot.png` | First-screen Story Review evidence for the active Review Hub | Quick proof that the local hub renders and shows the active artifact identity |
| `artifacts/fff-review-contact-sheet.png` | Four-mode contact sheet for Story Review, Source Audit, Project Cockpit, and Artifacts | Fast visual scan before opening the full local UI |
| `artifacts/review-screens/story-review.png` | Story Review mode | Checks raw memo, candidate, extraction, profile, claim, timeline, QA, and decision review access |
| `artifacts/review-screens/source-audit.png` | Source Audit mode | Checks source-span review pack access, representative fixture rows, Review Debt, and human-owned guards |
| `artifacts/review-screens/project-cockpit.png` | Project Cockpit mode | Checks progress state, not-implemented boundaries, and no model/API or publishing work |
| `artifacts/review-screens/artifacts-validation.png` | Artifacts mode | Checks artifact inventory, procedure path, screenshot map, open commands, and validation paths |

The screenshots are evidence of local access and layout reachability. They are not release approval, canon approval, or proof that the source spans are artistically final.

## What Each Mode Is For

| Mode | Purpose | Review friction it reduces |
| --- | --- | --- |
| Story Review | Review the raw story memo, generated candidates, Extraction Contract, Profile/Ghost Flow, Claim Ledger, Timeline View, QA gates, outlines, and decision log | Keeps story and candidate review out of project-governance scanning |
| Source Audit | Review source-span/routing quality, fixture summaries, held defaults, human-owned guards, and source-span Review Debt | Lets source evidence be reviewed without hunting through JSON first |
| Project Cockpit | Review implementation state, completed and not-implemented areas, and human-owned boundaries | Separates progress supervision from story review |
| Artifacts | Review files, manifest, screenshots, smoke evidence, launch commands, and validation commands | Makes cross-terminal access and proof paths explicit |

## Optional Vs Required Review

Review is optional for this slice when the work only improves documentation, screenshot evidence, local access paths, or reversible review guidance. Future user feedback can be freeform and can arrive later.

Review becomes required before any change that would:

- Add model/API calls, provider credentials, hidden transport, or external service behavior.
- Add database persistence, remote sync, publishing, upload, AI video generation, or production release behavior.
- Change schema keys, artifact IDs, artifact authority, or state import/export contracts in a breaking way.
- Hide or remove source-span review evidence.
- Promote generated candidates to durable canon.
- Decide Toma fate, brass moth truth, Council motive, or another protected human-owned story decision.
- Require destructive git or filesystem operations.

## Freeform Review Intake

Future review can be natural language. Useful feedback can name:

- Which mode was confusing or hard to find.
- Which screenshot or contact-sheet panel did not prove enough.
- Which source span, routing target, held default, or guard looks weak.
- Which Review Debt item should become the next concrete task.

No fixed labels are required. If feedback is clear enough, the next agent can make a narrow reversible change, refresh evidence, and re-run validation.

Before emitting a Review Card, check `docs/review/review-memory-dedup.md` and `artifacts/artifact-manifest.json`. If the target, axis, evidence, and decision value are the same as a prior positive signal, do not ask again. Record Review Debt and move to the next non-redundant axis instead.

Required non-redundant Review Card fields are: `target`, `axis`, `prior_review_count`, `prior_signal_summary`, `what_changed`, `what_this_review_decides`, `input_mode: freeform`, `not_asking`, and `completion_signal`.

## Review Debt

| Review Debt | Why it remains | Next move |
| --- | --- | --- |
| IA usefulness review | The mode split and procedure are visible, but daily-use friction still needs human judgment | Use freeform feedback after opening the four modes |
| Source-span quality | Automated span matching passes, but usefulness, narrowness, and wording quality are qualitative | Review Source Audit and the JSON pack before changing spans |
| Missing fixture classes | Contradictory claims, broad spans, malformed spans, multilingual text, sparse notes, and provider envelope cases are not yet covered | Add one local fixture class only when review names the need |
| Model/API adapter | Boundary spec exists, but implementation is intentionally blocked | Start only after review gates are accepted and credentials/external calls are explicitly authorized |
| Durable database and publishing | Out of scope for the current local review lane | Keep held until review workflow, source/canon gates, and release authority are accepted |

## Completion Signal

This procedure-lock slice is complete when:

- The Review Hub identifies `fff-review-procedure-lock-001`.
- `docs/review/review-procedure.md` is listed in the Review Hub, manifest, artifact inventory, and local docs navigation.
- Screenshot/contact-sheet evidence exists and is non-empty.
- Mode-specific screenshots exist for Story Review, Source Audit, Project Cockpit, and Artifacts.
- The manifest validation command, static smoke checks, MkDocs strict build, screenshot existence checks, and `git diff --check` pass.

## Boundaries

This artifact preserves `fff-review-hub-ia-mode-split-001`, `fff-source-span-routing-review-pack-001`, `fff-model-api-boundary-spec-001`, `fff-local-extraction-adapter-expansion-001`, `fff-extraction-validator-hardening-001`, `fff-extraction-contract-001`, Claim Ledger, Timeline View, Profile/Ghost Flow, local persistence, JSON import/export, freeform review intake, and human-owned canon boundaries.

No model/API call, credential, database persistence, publishing, production sync, AI video generation, or final canon decision is added by this slice.
