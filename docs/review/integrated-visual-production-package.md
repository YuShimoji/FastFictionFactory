# Integrated Visual Production Package

## Artifact

- ID: `fff-integrated-visual-production-package-001`
- Thread: `fff-integrated-visual-production-package-001`
- Lane: `VISUAL_INTEGRATION`
- Epoch: `FFF-2026-07-19-05`
- Base: `b2ef9e214799e973e63543fbdf7118542bd583bf`
- Standalone entry: `artifacts/integrated-visual-production-package/integrated-visual-production-package.html`
- Canonical model: `artifacts/integrated-visual-production-package/integrated-visual-production-package.json`
- Result: `artifacts/integrated-visual-production-package-result.json`

## Outcome

The four accepted composition packages are integrated into one chronological, local, reference-only whole-story object. The package contains exactly six Beats, nineteen source shots, 180 seconds, grouping `3 / 3 / 3 / 3 / 4 / 3`, nineteen sequence thumbnails, nineteen full shot strips, twenty-eight unique SHA256 reference identities, forty-two assignments, and five cross-Beat lineages. It copies no predecessor raster and changes no predecessor composition, timing, narration, subtitle, truth boundary, candidate balance, asset state, rights state, or canon state.

This is H0 integration evidence. It is not production selection, rights clearance, generated media, render readiness, production approval, public delivery, final canon, or external reproducibility evidence.

## Source Mapping

| Beat | Owning composition artifact | Package fingerprint |
|---|---|---|
| 1 | `fff-composition-expansion-wave1-001` | `403202568e99060937ed3ce36d16117b8564292f21baa3d72e8b290acd38ccb9` |
| 2 | `fff-beat2-composition-board-001` | `4c44089a140626d56fd67f8341a4765e60f310ff65555c8ff8a0eef3eff7f3b0` |
| 3 | `fff-composition-expansion-wave1-001` | `403202568e99060937ed3ce36d16117b8564292f21baa3d72e8b290acd38ccb9` |
| 4 | `fff-beat4-composition-counterexample-001` | `2f0e0032b30725dc678d27e31169f6fda1a7bf8c4586735a8d0fc6f73b6d6805` |
| 5 | `fff-composition-expansion-wave2-001` | `62d5379f6bf36495230a60e7fbd1de540a82aa4d5aaefae400ee1e0f773dc432` |
| 6 | `fff-composition-expansion-wave2-001` | `62d5379f6bf36495230a60e7fbd1de540a82aa4d5aaefae400ee1e0f773dc432` |

The Production Execution Pack owns exact shot chronology. The Production Blueprint supplies secondary palette, scale, motion, transition, narration, and subtitle metadata. The concrete owning composition package supplies every main image, supporting image, crop, focal order, depth, staging condition, and truth guard.

## Chronology

- Start: `00:00`
- End: `03:00`
- Gap count: `0`
- Overlap count: `0`
- Duplicate shot ID count: `0`
- Missing shot count: `0`
- Extra shot count: `0`
- Beat boundaries: `00:00 / 00:20 / 00:50 / 01:20 / 01:45 / 02:35 / 03:00`
- Shot durations: exact source values, range `6–13` seconds

The page, canonical JSON, `shot-sequence.csv`, and nineteen-cell contact sheet use the same order.

## Reference Union

- Unique SHA256 identities: `28`
- Source aliases retained: `36`
- Shot/reference assignments: `42`
- Missing local files: `0`
- Hash mismatches: `0`
- HTTP hotlinks used as image sources: `0`
- Source rasters copied into the integration directory: `0`
- Selected production assets: `0`
- Rights-cleared claims: `0`

`source-dependency-index.csv` records canonical IDs, aliases, owning artifact, creator, source page, original media URL, license, dimensions, local path, hash, use sites, and closed selection/rights flags. `reference-lineage.csv` records the five exact recurrence paths.

## Cross-Beat Lineage

| Lineage | Source shots | Successor shots | Shared reference identity |
|---|---|---|---|
| Bellless tower | `shot-b01-01`, `shot-b01-03` | `shot-b06-03` | Wave 1 tower and station references |
| Brass moth | `shot-b02-02`, `shot-b02-03` | `shot-b05-02`, `shot-b05-04` | `ref-b02-s02-metal-butterfly-brooch` |
| Council | `shot-b04-01`, `shot-b04-02`, `shot-b04-03` | `shot-b05-03`, `shot-b05-04` | card catalogue and closed meeting room |
| Ledger | `shot-b03-01`, `shot-b03-02`, `shot-b03-03` | `shot-b06-01`, `shot-b06-02` | blank book and ledger geometry |
| Time | `shot-b02-03` | `shot-b06-01` | `ref-b02-s03-vintage-watch-0915` |

Every lineage retains `truth_boundary_preserved=true`; the integration presents recurrence without resolving story truth.

## Candidate Balance

Wave 2 equal-candidate structures are transcribed byte-for-structure from their source shot snapshots:

- Toma fates: `4 × 25%`, no selected candidate
- Moth functions: `3 × 33.33%`, no selected candidate
- Council motives: `4 × 25%`, no selected candidate
- Three unresolved subjects: `3 × 33.33%`, no selected candidate
- Time versus name: `2 × 50%`, no selected candidate
- Winner cue count: `0`

Beat 4's two-hypothesis split also remains `50 / 50`, with no privileged color, glow, shadow, saturation, or winner icon.

## Browser Evidence

| View | Theme | Title | Lines | Height ratio | Horizontal overflow | Nested scroll |
|---|---|---:|---:|---:|---:|---:|
| `900 × 1200` | Dark | `34px` | 1 | `0.03229` | 0 | 0 |
| `1280 × 900` | Light | `38px` | 1 | `0.04813` | 0 | 0 |
| `720 × 900` | Auto | `34px` | 1 | `0.04306` | 0 | 0 |

Auto is the default theme, explicit Light and Dark resolve correctly, keyboard focus is visible, print forces a light surface, theme controls are hidden in print, and shot strips avoid print breaks. The two tracked viewport captures are:

- `artifacts/review-screens/integrated-visual-production-package-900x1200-dark.png`
- `artifacts/review-screens/integrated-visual-production-package-1280x900-light.png`

## Integrity and Negative Probes

The result records all fifty-six named fail-closed probes from fingerprint mismatch through normal-validation mutation. Every probe detected its invalid state, failed closed, and recorded `artifact_mutation=false`. Normal validation snapshots the integration directory before and after inspection and fails if its aggregate changes.

Twelve protected directories are recorded with sorted path, byte size, per-file SHA256, total bytes, file count, and aggregate SHA256 in both the canonical model and result. Before and after values are identical.

## Validation

Read-only validation:

```powershell
node tools/fff-state.mjs validate-integrated-visual-production-package artifacts/integrated-visual-production-package-result.json
```

Intentional deterministic regeneration of integration-owned files only:

```powershell
node tools/fff-state.mjs smoke-integrated-visual-production-package artifacts/integrated-visual-production-package-result.json
```

The root manifest's validation command runs the integration validator first, then the preserved Wave 2, Wave 1, Beat 2 Board, Beat 4 Counterexample, Beat 2 Visual Treatment, Storyboard Brief, Production Execution Pack, and Production Blueprint checks. No smoke command appears in the root read-only chain.

## Human Boundary

- `integration_human_review=none`
- `next_human_review=owner_whole_story_composition_review`
- `per_beat_review=discontinued`
- `external_reproducibility_claimed=false`

The Product Owner is the formal reviewer. The next human action is one whole-story composition review of this exact integrated artifact. This implementation slice does not perform or simulate that review.
