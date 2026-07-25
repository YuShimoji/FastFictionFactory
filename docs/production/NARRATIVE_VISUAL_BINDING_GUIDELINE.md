# Narrative–Visual Binding Guideline

## Purpose

Classify every narration or caption revision before media work so text changes produce the smallest evidence-supported visual impact.

## Binding levels

- `L0_caption_only`: wording carries review context that does not depend on a pictured subject. Change text only.
- `L1_subject_bound`: wording names a subject already present in the accepted shot. Preserve shot identity and primary image bytes; change text or a non-primary explanatory overlay.
- `L2_relation_bound`: wording changes a spatial, causal, or temporal relation inside one local area. Limit repair to an overlay, crop, duration, or one adjacent boundary.
- `L3_structure_bound`: wording changes a Beat objective, event order, primary event, or ending action. Reassemble only the affected Beat after explicit narrative authority.

## Required impact audit

1. Record the current L0/L1/L2/L3 count before applying a revision.
2. Bind every revised semantic unit to claim type, truth status, visual subjects, and exact shot IDs.
3. Record whether the rewrite can keep current visuals and name the smallest required visual change.
4. Stop before candidate render with `NARRATIVE_CANON_DECISION_REQUIRED` when any L3 change is unavoidable; name the exact Beat and unsupported decision.
5. Preserve primary image bytes unless separately authorized visual evidence requires a new image.

## Full reassembly threshold

A complete 19-shot reassembly becomes eligible only when the central objective, Beat order, primary event, or ending action changes, or when three or more Beats contain unavoidable L3 changes. Subtitle revision alone never authorizes image regeneration.

## Transition continuity

Every non-hard boundary begins with the terminal frame extracted from the rendered outgoing final clip. The encoder may use an actual terminal hold/tail followed by the incoming rendered head. It may not reopen the outgoing raw image, reset to a neutral crop, insert a concealment flash, or alter the exact 180-second / 5400-frame timeline.

## State and ownership

- State: active production guideline for future text-impact audits.
- Owner: narrative editor for meaning; picture editor for L2/L3 evidence; Product Owner for any L3 narrative decision; production, rights, voice, release, and canon owners retain their separate gates.
- Next move: apply the table to each later text change and preserve the current shot/image identity when its binding remains L0 or L1.
