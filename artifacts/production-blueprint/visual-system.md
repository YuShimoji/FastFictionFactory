# Provisional Visual System

These are project-local planning constraints, not industry standards. No licensed font, release asset, platform export profile, or rights state is selected.

## Canvas and Safe Areas

- 1920x1080, 16:9, 30fps planning timebase
- title safe: top/right/bottom/left = 5% / 5% / 5% / 5%
- subtitle safe: top/right/bottom/left = 5% / 7% / 8% / 7%
- vertical export: not authorized

## Palette and Contrast Roles

| token | value | role |
|---|---:|---|
| midnight_base | #111827 | primary_dark_background |
| brass_accent | #C79A42 | evidence_and_motif_accent |
| paper_neutral | #E8E1D3 | document_surface |
| warning_rust | #B4533C | warning_only |
| uncertainty_cool | #5B8DB8 | held_or_unresolved_information |
| text_high_contrast | #F8FAFC | text_on_midnight_base |

- default text pair: text_high_contrast on midnight_base
- document text pair: midnight_base on paper_neutral
- project-local minimum contrast ratio: 4.5
- warning_rust must be paired with text or an icon; color is never the only warning signal

## Typography at 1080p

Font selection status: unselected. The ranges constrain role and scale without choosing a licensed font.

| role | project-local size range |
|---|---:|
| display | 64-76px |
| heading | 42-52px |
| body | 30-38px |
| subtitle | 44-52px |
| label | 24-30px |

## Composition, Motion, and Motifs

- subject occupancy: 15-80%, with a narrower min/max per shot
- maximum simultaneous focal elements: 2
- maximum camera-motion classes per shot: 1
- recurring motif budget: 1 per beat
- minor easing within the approved motion class is FREE low-risk micro-detail

Transition limits:

- hard_cut: maximum 3 consecutive
- short_dissolve: maximum 1 per beat
- match_cut: maximum 2 total
- graphic_match: maximum 1 per beat
- held_fade: maximum 1 per beat

## Overlay Text

- maximum 2 lines
- maximum 18 Unicode code points per line, punctuation included
- allowed modes: none, subtitle_only, single_label, subtitle_plus_single_label

## Forbidden Combinations

- more_than_two_simultaneous_focal_elements
- more_than_one_camera_motion_class_per_shot
- warning_rust_as_sole_warning_signal
- declarative_truth_label_on_unresolved_information
- selected_or_rights_cleared_asset_in_this_blueprint
- overlay_text_above_two_lines_or_eighteen_characters_per_line
