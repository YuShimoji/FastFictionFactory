# Bridge Editorial Handoff Pack

## Outcome

`fff-bridge-editorial-handoff-pack-001` turns the accepted six-beat Bridge Storyboard Flow into a local manual-delivery package and a focused review route at `public/review/index.html?mode=handoff`.

The package contains a complete provisional narration draft, timed Japanese subtitle cues, timed generic shot directions, a canonical JSON model, delivery instructions, and byte-size/SHA256 integrity metadata. It is suitable for manual transfer to a writer, subtitle editor, or video editor. It is not final narration, final canon, a rights-cleared package, production approval, generation, render, upload, or public release.

## Source Contract

- Source storyboard: `fff-bridge-storyboard-flow-001`
- Preserved Workbench: `fff-review-workbench-component-contract-001`
- Preserved planning bridge: `fff-draft-to-video-planning-bridge-001`
- Preserved overview/refinement: `fff-bridge-refinement-overview-ribbon-001`
- Preserved draft pack: `fff-one-story-draft-review-pack-001`
- Preserved designer selection: `fff-designer-candidate-dashboard-001`
- Preserved guard: `fff-contradictory-claim-guard-001`
- Candidate: `designer-content-moth-investigation-3m`
- Channel: `designer-channel-mystery-lore`
- Editorial status: `provisional_editorial_draft`

## Access

- Handoff route: `public/review/index.html?mode=handoff`
- Source Bridge route: `public/review/index.html?mode=bridge`
- Brief route: `public/review/index.html?mode=brief`
- Package directory: `artifacts/editorial-handoff/`

The Bridge Storyboard Flow remains the first substantive Bridge surface. It adds one compact `編集パックを開く` action; the full package is not duplicated on Bridge.

## Package Inventory

| File | Purpose |
| --- | --- |
| `artifacts/editorial-handoff/README_DELIVERY.md` | Manual transfer order and boundary guide |
| `artifacts/editorial-handoff/narration-script.md` | Six complete non-final narration segments |
| `artifacts/editorial-handoff/subtitle-cues.csv` | 20 timed Japanese subtitle cues |
| `artifacts/editorial-handoff/shot-list.csv` | 19 timed generic shot directions |
| `artifacts/editorial-handoff/editorial-handoff.json` | Canonical machine-readable package |
| `artifacts/editorial-handoff/package-manifest.json` | Integrity metadata for the other five files |

## Editorial Contract

- Beat count: exactly `6`
- Duration: exactly `180 seconds`
- Exact windows: `00:00-00:20`, `00:20-00:50`, `00:50-01:20`, `01:20-01:45`, `01:45-02:35`, `02:35-03:00`
- Narration segments: `6`, one per beat
- Approximate narration volume: `777 Japanese characters`
- Subtitle cues: `20`, at least three per beat
- Shot cues: `19`, at least three per beat
- Thumbnail directions: `3`
- Sound/music/mood brief: `1`, generic and unselected
- All subtitle and shot ranges: monotonic, non-overlapping, and contained by the owning beat
- Every shot: `asset_status=unselected`

The Handoff route uses a six-beat editing runway and one active canvas. Narration, subtitle cues, and shot cues stay aligned by the selected beat. The package inventory, provisional state, candidate, channel, duration, compact truth/rights guards, and return paths are visible without exposing historical Bridge shelves on this route.

## Truth Guard Audit

All four held subjects remain explicitly `unresolved_human_owned`:

- Toma fate
- Brass moth truth/function
- Council motive and responsibility
- Ending truth and Mira's final choice

The narration attributes the Council accusation to Toma's memo. The ledger may remain evidence, bait, or false record. No competing explanation is promoted to fact, and the possible one-hour restoration remains an ending candidate only.

## Rights Guard Audit

- No asset is selected.
- No image, footage, performer, voice, music, SFX, font, texture, logo, document scan, or third-party design is claimed as usable.
- Every shot and thumbnail carries an unselected/uncleared note.
- The package manifest proves file integrity only; it does not prove provenance or clearance.
- `rights_cleared_claim=false` remains closed.

## Validation and Regeneration

Read-only validation:

```powershell
node tools/fff-state.mjs validate-bridge-editorial-handoff-pack artifacts/bridge-editorial-handoff-pack-result.json
```

Intentional regeneration of only the new package metadata and result:

```powershell
node tools/fff-state.mjs smoke-bridge-editorial-handoff-pack artifacts/bridge-editorial-handoff-pack-result.json artifacts/bridge-editorial-handoff-pack-result.json
```

The smoke command may write `artifacts/editorial-handoff/package-manifest.json` and `artifacts/bridge-editorial-handoff-pack-result.json`. It must not rewrite the five package content files or historical result artifacts. The published manifest health command uses only `validate-*` commands.

Read-only behavior was probed explicitly:

- The normal manifest validation left 11 hashed package/result/source files unchanged.
- Supplying an output path to `validate-bridge-editorial-handoff-pack` returned exit code 1 and created no file.
- Temporarily withholding `subtitle-cues.csv` returned exit code 1; all remaining hashes stayed unchanged, the file was restored in `finally`, and the complete 11-file hash set matched the original afterward.

Targeted source checks:

```powershell
node tools/fff-state.mjs validate-bridge-storyboard-flow artifacts/bridge-storyboard-flow-result.json
node tools/fff-state.mjs validate-review-workbench-component-contract artifacts/review-workbench-component-contract-result.json
node tools/fff-state.mjs validate-draft-to-video-planning-bridge artifacts/draft-to-video-planning-bridge-result.json
```

## Visual and Information Architecture

The Handoff route is a focused editing surface rather than another archive page. At approximately 900 CSS pixels, it keeps one active beat, one six-beat runway, package links, and compact guards readable without horizontal page scrolling. Light, Dark, Auto, focus-visible, Arrow-key, Home, End, Previous, and Next behavior remain part of the local shell.

Visual evidence: `artifacts/review-screens/bridge-editorial-handoff-pack.png` (`900x1200`, 141616 bytes, SHA256 `CB72EB10A02EB0E4E6BE21D19B7A0D515D3C92756915C5F5446ACE6387ECE7E2`). Browser readback confirmed no horizontal overflow, six package links, six runway tabs, one active beat canvas, hidden Bridge history, Light/Dark readability, Arrow/Home/End navigation, visible keyboard focus, and no console errors.

## Boundary Gates

- local only: open
- external calls: closed
- provider/API configuration: closed
- credentials: untouched
- AI image/audio/video generation: closed
- production render/export: closed
- upload/public release: closed
- database persistence: closed
- rights clearance claim: closed
- final canon: closed

## Review Debt

- Overall Brief page length
- Lower-page density
- Minor Workbench readability
- Context Dock minimalism
- Stale Shelf Excision
- Final narration performance
- Subtitle typography and animation
- Actual visual/audio asset selection
- Provider/API integration
- Production render, upload, rights clearance, and final canon

These items are recorded rather than implemented in this slice.
