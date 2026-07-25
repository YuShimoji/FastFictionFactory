# Private Full Raster Clarity Candidate Review

## Current state

`fff-private-full-raster-clarity-candidate-001` is technically ready for a silent, whole-story clarity review. The Product Owner's acceptance of all nineteen primary images is preserved. `fff-private-previsualization-timeline-001` remains active/default. This successor remains private and default-off.

## Fixed transition defect

The source encoder reopened `previousShot.image_path` during a transition, which discarded the outgoing motion crop and exposed a neutral frame before the next shot. The clarity encoder extracts the terminal frame from the actual rendered outgoing final clip and starts each non-hard transition from that state. Evidence covers all eighteen boundaries at -2, -1, at, +1, and transition midpoint.

- Position resets: 0
- Raw-source flashes: 0
- Gap / overlap frames: 0 / 0

## Text and binding evidence

- Source impact audit: L0 9 / L1 11 / L2 0 / L3 0
- Revised semantic units: 46; all L1; L2 shot repairs 0; L3 Beat repairs 0
- Review explanatory captions: 20 / 20; declarative floor 20/20
- Narration segments: 6 / 6
- Production subtitle draft: 20 cues; provisional until voice calibration
- Full 19-shot reassembly: avoided

## Runtime evidence

- MP4: 180.000 s, h264, 960x540, 5400 frames, 0 audio streams, SHA256 `9c646075c522c15599b2a6d42ad35e5fe89bb622ea6aaa6843c487656edc75cd`
- Browser: PASS at 1440x1000 and 390x844
- Targeted tests: 9/9

## Human comprehension review

Ask the reviewer to identify the protagonist, initiating anomaly, Toma/9:17/moth link, ledger contents, Council relevance, and closing choice/stake. Intended answers live in `private-full-raster-clarity-candidate.json`. No human comprehension result is recorded by this implementation.

Production approval, rights clearance, public release, voice selection, final acceptance, and final canon remain separate decisions.
