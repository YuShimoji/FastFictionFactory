# Resumable Private Pipeline

## Outcome

`fff-resumable-private-pipeline-001` turns the accepted private preview into one resumable local build path. It reconstructs the same nineteen canonical frames and exact 180-second chronology in an external run directory, encodes a silent private MP4, and writes machine-verifiable stage and final receipts.

The named consumer is a solo creator resuming on another terminal. This is not a new renderer, dashboard, asset decision, rights decision, voice pipeline, production render, or publication path.

## One-command build

Use a new or empty directory outside the repository:

```powershell
node .\tools\fff-private-pipeline.mjs build `
  --run-dir 'C:\path\outside\FastFictionFactory\fff-private-run-001'
```

The command validates the current canonical packages, resolves the accepted nineteen frame identities and exact timeline, copies them into the run-local workspace, encodes the silent MP4, verifies it, and atomically writes `run-receipt.json`.

## Inspect, stop, and resume

```powershell
node .\tools\fff-private-pipeline.mjs dry-run `
  --run-dir 'C:\path\outside\FastFictionFactory\fff-private-run-001'

node .\tools\fff-private-pipeline.mjs status `
  --run-dir 'C:\path\outside\FastFictionFactory\fff-private-run-001'

node .\tools\fff-private-pipeline.mjs resume `
  --run-dir 'C:\path\outside\FastFictionFactory\fff-private-run-001'

node .\tools\fff-private-pipeline.mjs verify `
  --run-dir 'C:\path\outside\FastFictionFactory\fff-private-run-001'
```

For a deterministic interruption rehearsal:

```powershell
node .\tools\fff-private-pipeline.mjs build `
  --run-dir 'C:\path\outside\FastFictionFactory\fff-private-run-interrupted' `
  --stop-after materialize-run-workspace

node .\tools\fff-private-pipeline.mjs status `
  --run-dir 'C:\path\outside\FastFictionFactory\fff-private-run-interrupted'

node .\tools\fff-private-pipeline.mjs resume `
  --run-dir 'C:\path\outside\FastFictionFactory\fff-private-run-interrupted'
```

`resume` reuses the longest valid receipt prefix. It starts again at the first missing or stale stage. If canonical repository input identity changed, it refuses the resume and requires an explicit new run directory.

## Run-directory contract

Every versioned run is outside the repository and contains:

- `run-manifest.json` for current state and resume history;
- `source-fingerprints.json` for canonical package, frame, source-image, timeline, and guard identities;
- `toolchain-versions.json` for Node, FFmpeg, ffprobe, platform, and pipeline-tool identity;
- `executed-commands.json`;
- `receipts/` with one immutable receipt per completed stage;
- `workspace/` with frame map, timeline, exact frame copies, concat input, media probe, and verification;
- `output/private-previsualization-timeline.mp4`;
- atomic final `run-receipt.json`.

A new `build` never overwrites a completed or non-empty run. `dry-run`, `status`, and normal `verify` are read-only.

## Exact claim boundary

Acceptance is exact canonical frame identity, exact timeline identity, 6 Beats, 19 shots, 180.000 seconds within encoder tolerance, 6 narration metadata segments, 20 subtitle cues, gap 0, overlap 0, silent H.264 output, and the baked `PREVIS / REFERENCE-ONLY / NOT FOR PUBLICATION` watermark.

MP4 bytes are recorded but are not required to remain identical across FFmpeg versions. The actual output SHA256 and FFmpeg version are stored for every run.

Negative story guards remain source metadata. They are fingerprinted and preserved, but are not rewritten or promoted into a dominant CLI or review surface.

## Recovery procedure

1. Run `status`.
2. If state is `incomplete`, run `resume`.
3. If state is `stale` because a stage receipt or owned run output changed, retain the run for audit and resume from the first stale stage.
4. If canonical input identity changed, do not resume; choose a new external run directory.
5. If state is `failed`, read `failure.json`, keep the run inspectable, and fix only the named local/toolchain cause.
6. Run `verify` before using the private candidate.

## Remaining closed gates

No material polish, new reference, replacement sourcing, source-image edit, asset-plan A/B/C choice, voice, TTS, music, SFX, image generation, video generation, rights clearance, legal-safety claim, production selection, publication, database persistence, production approval, release acceptance, or canon decision is opened by this pipeline.
