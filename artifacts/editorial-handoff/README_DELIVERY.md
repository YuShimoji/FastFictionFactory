# Editorial Handoff Pack

## Purpose

This directory is a local, manual-delivery-ready editing package for the six-beat Bridge Storyboard Flow. It lets a writer, subtitle editor, or video editor continue from one aligned 180-second plan without reconstructing narration, subtitle timing, shot intent, truth boundaries, or rights notes from the review UI.

This package is `provisional_editorial_draft`. It is not final narration, final canon, a production approval, a rights-cleared asset package, or a public release.

## Package Identity

- Artifact: `fff-bridge-editorial-handoff-pack-001`
- Source storyboard: `fff-bridge-storyboard-flow-001`
- Candidate: `designer-content-moth-investigation-3m`
- Channel: `designer-channel-mystery-lore`
- Review route: `public/review/index.html?mode=handoff`
- Source route: `public/review/index.html?mode=bridge`
- Total planning duration: `180 seconds`
- Editorial status: `provisional_editorial_draft`

## Six-beat Timing

| Beat | Title | Exact window |
| --- | --- | --- |
| 1 | 鐘のない塔 | `00:00-00:20` |
| 2 | 真鍮の蛾 | `00:20-00:50` |
| 3 | 消された名前 | `00:50-01:20` |
| 4 | 評議会の影 | `01:20-01:45` |
| 5 | 答えを保留 | `01:45-02:35` |
| 6 | 時間か、名前か | `02:35-03:00` |

Do not silently reorder these beats or change their 180-second allocation in this package. Any later timing change should be an explicit editorial revision.

## File Inventory

| File | Use |
| --- | --- |
| `README_DELIVERY.md` | Package purpose, boundaries, editing order, and inventory |
| `narration-script.md` | Six complete, non-final narration segments with held-truth notes |
| `subtitle-cues.csv` | 20 monotonic Japanese subtitle cues for spreadsheet/editor import |
| `shot-list.csv` | 19 monotonic generic shot directions with rights and truth notes |
| `editorial-handoff.json` | Canonical machine-readable package for all beats and cues |
| `package-manifest.json` | Byte size and SHA256 metadata for the other five package files |

## Recommended Manual Editing Order

1. Read this file and keep the status and boundary gates visible.
2. Read `narration-script.md` from Beat 1 through Beat 6 for continuity and speaking pace.
3. Import `subtitle-cues.csv`; preserve cue IDs and exact beat windows while adjusting line wrapping or typography outside this package.
4. Import `shot-list.csv`; keep `asset_status=unselected` until a separate provenance and rights review proves an asset usable.
5. Use `editorial-handoff.json` when a machine-readable handoff or cross-check is needed. It is the canonical package model.
6. Verify `package-manifest.json` before transfer. Every listed byte size and SHA256 must match.

## Truth Boundaries

The narration may describe records, allegations, missing evidence, competing explanations, and open questions. It must not turn any of these held subjects into fact:

- Toma fate: unresolved and human-owned.
- Brass moth truth or function: unresolved and human-owned.
- Council motive and responsibility: unresolved and human-owned.
- Ending truth and Mira's final choice: unresolved and human-owned.

The Council allegation and the false-record possibility remain competing held explanations. The ledger may be evidence, bait, or a fabricated record. Returning one hour to each erased person remains a possible ending only.

## Rights Boundaries

- Every shot and thumbnail direction remains `asset_status=unselected`.
- No image, footage, font, texture, voice, performer, music, sound effect, logo, document scan, or third-party design has been selected or cleared.
- Visual and audio rows are generic text directions, not release assets or provenance evidence.
- The author memo establishes narrative provenance only; it is not proof of commercial or distribution clearance.
- `rights_cleared_claim=false` remains closed throughout the package.

## Deliberately Not Included

- Provider or API configuration
- Credentials, secrets, endpoints, or external model calls
- Generated images, audio, voices, or video
- Selected third-party or paid assets
- Subtitle typography, animation, or final line breaking
- Final voice performance or audio mix
- Production render or export
- Upload, publication, or public release metadata
- Database persistence
- Rights clearance
- Final canon or a final ending decision

The package is ready for local manual editorial transfer only.
