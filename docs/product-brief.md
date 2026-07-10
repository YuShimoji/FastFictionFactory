# Fast Fiction Factory Product Brief

## Purpose

Fast Fiction Factory is a local-first fiction production workbench. It turns raw story memos into source-tracked candidates that a human creator can review, connect, and shape into story and content packages without surrendering canon authority.

The product should feel like a creator's working surface, not an artifact audit console. Technical evidence remains available, but the first screen should prioritize the current story, unresolved decisions, and the next creative action.

## Primary user path

1. Paste, import, or edit a raw story memo.
2. Extract source-tracked people, places, objects, events, claims, uncertainties, and visual cues.
3. Review candidates as `adopt`, `provisional`, `hold`, or `reject`.
4. Connect reviewed candidates through Profile, Claim Ledger, and Timeline views.
5. Compare story or content directions before committing to a high-fidelity package.
6. Shape one selected route into beats, narration, subtitles, visuals, sound, thumbnail, and risk notes.
7. Pass explicit canon, rights, provider, and release gates before production.

## Current review entry

- Review UI: `public/review/index.html`
- Default route: `public/review/index.html?mode=brief`
- Current implementation and active artifact: [review/current-status.md](review/current-status.md)
- Historical artifact inventory: [Artifact Inventory](local-view/artifacts.md)

The current implementation is a local static prototype. This brief does not declare a particular checkpoint active; the live status page owns that state.

## In scope for the local prototype

- Local memo intake and browser/local-file continuity.
- Deterministic local extraction for contract and interaction development.
- Source span and translation provenance.
- Structured candidates for story elements, claims, timelines, ambiguity, contradictions, foreshadowing, and production cues.
- Human-controlled review states.
- Profile, Claim Ledger, Timeline, task, outline, and draft package surfaces.
- 1-minute, 3-minute, 10-minute, series, and adjacent content hypotheses.
- Review of narration, subtitle, visual, sound, thumbnail, rights, and held-truth decisions.
- Light/dark and Japanese-first interaction research.
- Local validation, fixtures, screenshots, and documentation.

## Outside the current implementation

- Real provider-backed extraction.
- Production credentials or paid-service calls.
- Durable multi-user database and authentication.
- Full asset or AI video generation.
- Automated YouTube or public upload.
- Rights-clearance claims.
- Irreversible production mutations.
- Automatic final canon decisions.

These boundaries prevent external or authoritative side effects. They do not block reversible local design, prototyping, content exploration, cleanup, or testing.

## Review standard

A slice is reviewable when:

- the user-visible outcome works end to end;
- unresolved authority and provenance remain visible;
- the UI can be judged without reading implementation metadata;
- meaningful direction choices were compared before expensive polish;
- the affected state and contract checks pass;
- current status is updated in the same work package, and README is updated only when the external entry or product summary changes;
- the result makes the next human decision clearer.
