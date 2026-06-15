# v1.3 Compliance Review

## Active Artifact

- Artifact id: `fff-profile-ghost-flow-001`
- Review UI: `public/review/index.html`
- Smoke result: `artifacts/v1-3-compliance-smoke-result.json`
- Manifest: `artifacts/artifact-manifest.json`

## Observable Contract Checks

- Self-contained autonomous loop is represented by a local static UI, state JSON files, smoke results, docs, and a next-slice prompt.
- Reviewable artifacts are listed in `artifacts/ARTIFACTS.md`.
- The active artifact is declared in `artifacts/artifact-manifest.json`.
- Artifact paths in manifests and docs use repo-relative paths.
- Visual work references `artifacts/fff-current-review-screenshot.png` and `artifacts/fff-review-contact-sheet.png`.
- Human-owned decisions are visible for Toma fate, brass moth truth, and Council motive.
- Report-facing docs avoid non-user-facing execution settings, interface labels from tooling, and full local paths as artifact authority.
- Stop conditions remain limited to destructive operations, external publishing, credentials, irreversible migrations, legal or public-release judgement, final canon decisions, authority conflicts, repeated blockers, server/database architecture, or framework migration.

## Validation Notes

- Manifest JSON parses.
- Current status doc names `fff-profile-ghost-flow-001`.
- Review UI contains the v1.3 operating contract section.
- Review UI contains repo-relative artifact paths.
- The local preview used temporary localhost only for validation.
- Screenshot and contact sheet are non-empty and reflect the Profile/Ghost Flow UI.

## Remaining Convention Work

- Keep future reports concise and repo-relative.
- Do not add non-user-facing execution settings, interface labels from tooling, or full-path artifact authority to docs or prompts.
- Add a checkpoint commit only after explicit local commit approval.
