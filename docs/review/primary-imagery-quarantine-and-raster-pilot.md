# Primary Imagery Quarantine and High-Fidelity Raster Pilot

## Review status

This slice records Product Owner authority `user-primary-imagery-direction-reset-2026-07-25`.

- Quarantine `FFF-Q-PRIMARY-IMAGERY-SVG-2026-07-25`: ACTIVE and append-only.
- Rejected candidate `fff-private-materialized-motion-previs-001`: `REJECTED_VISUAL_DIRECTION`, archive-only, default-off, excluded from successor selection, release-unreachable, unavailable as a shared generator, and closed to further variants.
- Preserved default `fff-private-previsualization-timeline-001`: still active/default and byte-preserved.
- New pilot `fff-high-fidelity-raster-pilot-001`: exactly three shots, default-off, release-unreachable, unselected, and not rights-cleared.
- Human state: ready for one bounded Product Owner image-medium review. No final-art acceptance is recorded.

## Before → after

Before, the rejected materialized-motion package was registered as the successor candidate and its SVG/vector-primary generator could be reused despite the Product Owner rejecting that visual direction. The current preview remained useful, but there was no materially different three-shot primary-image demonstration and no source-kind gate.

After, the historical package and MP4 remain intact while their visual direction is quarantined. The root artifact manifest keeps the old accepted private preview as active/default, registers the pilot as default-off, and binds both to an ACTIVE quarantine. The Primary Imagery Medium Gate accepts declared raster source kinds and fails closed on forbidden or missing kinds, rasterized forbidden-vector lineage, promotion of the archived candidate, and missing quarantine metadata.

## Git/worktree boundary

- Exact start base: `origin/master` at `cfd645ff2928b06e474aae5aefb9019d771d0ce9`.
- Branch: `codex/fff-primary-imagery-quarantine-raster-pilot-v1`.
- Repository-external worktree: `C:\Users\thank\Storage\Media Contents Projects\FastFictionFactory-isolated\fff-primary-imagery-quarantine-raster-pilot-v1`.
- The original checkout and its user-owned dirty files are outside this write set.

## Three-shot pilot

| Shot | Timing | Primary | Dimensions | SHA256 | Source kind |
| --- | --- | --- | ---: | --- | --- |
| `shot-b04-01` | `01:20–01:28` | anonymous institutional interior behind frosted glass | 1600×900 | `ec774118a012db4f70ee138ba0e4f8107e8abfdd98f8fb006a95c7e409b4c8d1` | `generated_raster` |
| `shot-b05-02` | `01:58–02:11` | inert, materially convincing brass moth mechanism | 1600×900 | `4ebf56180c1bf6ebfbcbff1ffd4a141a07e5c045645a2670ec5a776bee3374ac` | `generated_raster` |
| `shot-b02-03` | `00:40–00:50` | antique clock face reading approximately 9:17 with brass moth object | 1600×900 | `5a2b371948dfeed3e15cbdcd81ec4de48e2d4f4db429bbea3ee021c9f74f1c31` | `generated_raster` |

All three images were created through the built-in `image_gen` facility. The facility exposed neither a model name nor a seed, so the package records both as `null`. No account, credential, subscription, or paid API setup was introduced. Taste was unavailable because no Taste skill was present; no Taste-use claim is made. No licensed third-party asset was used.

The observed built-in output paths, original PNG SHA256 values, exact prompts, and final Sharp crop/resize recipe are in `source-provenance.csv` and `prompt-or-composite-recipes.md`. Each final primary is candidate-only with `selected_for_production=false`, `rights_cleared_claim=false`, and `default_active=false`.

## Truth-boundary retention

- `shot-b04-01`: avoids guilt performance, identifiable officials, and simple villain framing.
- `shot-b05-02`: does not show flight, glow, opening, keyhole, surveillance lens, memory projection, or a correct function.
- `shot-b02-03`: keeps 9:17 as a recurring motif and does not establish a stopped clock or clock–moth causality.

The exact source shot IDs, timing, motion classes, transition classes, subtitle associations in the preserved source, and truth-boundary wording were not changed.

## Non-match evidence

### Council

- Anatomically plausible seated and standing adults have varied posture, clothing, hair, and body shape.
- Foreground glass, midground people, and background architecture provide spatial depth.
- Glass, wood, stone, fabric, skin, and hair read photographically.
- No rounded bottle/pawn bodies, generic geometric people, identifiable official, or villain-lighting cue appears.

### Brass moth

- Engraved metal thickness, screws, joints, scratches, patina, and assembly seams establish a physical object.
- Paper, cloth, glass, and tools provide a photographic workbench context.
- The composition has no enlarged line-art icon, central symbolic circle, repeated dashboard cards, or diagram UI.
- Three optional function candidates are separate HTML labels and do not resolve the object’s purpose.

### 9:17 clock

- Worn enamel, scratched glass, engraved brass, dust, real hands, and a secondary-seconds dial establish a plausible antique mechanism.
- The long hand sits slightly past three while the short hand points at nine, reading approximately 9:17.
- The moth is a separate brass object beside the bezel.
- No flat vector dial, diagram ring, arrow, UI panel, magical glow, or causality cue appears.

Across the pilot: `primary_svg_scene_count=0`, `rasterized_svg_primary_count=0`, `css_shape_primary_count=0`, `canvas_primitive_primary_count=0`, `generic_symbolic_primary_count=0`, and `blank_abstract_primary_count=0`.

## Primary Imagery Medium Gate

Read-only validation:

```powershell
node tools/fff-state.mjs validate-primary-imagery-raster-pilot artifacts/high-fidelity-raster-pilot-result.json
```

Intentional regeneration of pilot-owned derived files:

```powershell
node tools/fff-state.mjs smoke-primary-imagery-raster-pilot artifacts/high-fidelity-raster-pilot-result.json
```

Targeted tests:

1. Accept exactly three declared generated-raster primaries.
2. Reject a forbidden `svg_primary`.
3. Reject a missing primary `source_kind`.
4. Reject rasterized forbidden-vector lineage.
5. Reject promotion of the archived materialized-motion candidate.
6. Reject an active/default candidate with a forbidden primary source.
7. Reject an active/default candidate with a missing primary source kind.
8. Reject missing/inactive quarantine metadata.

The gate also checks exact JPEG signatures, 1600×900 dimensions, unique and matching SHA256 values, the exact three-shot order, the active/default preview identity, default-off pilot state, manifest byte integrity, provenance files, and browser evidence.

## Review surface and runtime evidence

- Standalone page: `artifacts/high-fidelity-raster-pilot/high-fidelity-raster-pilot.html`.
- New pilot imagery is full-width and visually dominant; three rejected frames appear only as reduced, desaturated anti-reference thumbnails.
- Light, Dark, and Auto controls are present.
- Desktop evidence: 1440×1000.
- Narrow evidence: 390×844.
- Both measured views have zero horizontal overflow, zero nested vertical scroll, three pilot shots, three anti-references, no console/page errors, and no external requests.
- No motion or new 180-second MP4 was created.

## Residual work

- Purpose: obtain one bounded human judgment of whether the three raster primaries demonstrate the required medium shift.
- Effect: a review can accept the medium for later planning or identify one shot-bounded image-direction defect without scaling to nineteen shots.
- Requirements: review the exact three image SHA identities above; keep the pilot default-off; keep production selection, rights clearance, motion, release, and canon closed.
- State: machine validation green; human Product Owner review not yet performed.
- Owner: Product Owner for visual-direction judgment; future production/rights owners remain separate.
- Next move: review only these three primaries and return accept/revise/reject findings by shot ID. Nineteen-shot expansion requires a separate decision after this review.
