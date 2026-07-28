# Writer Source Adaptation v0

`fff-writer-source-adaptation-v0-001` is a deterministic, provider-neutral upstream adapter for the current Fast Fiction Factory repository. It turns explicitly annotated local source material into source packets, authority records, a bounded format decision, Narrative IR, and—only after a safe format selection—an Editorial Handoff input.

It supports exactly three input envelopes:

- `prose_markdown_v0`
- `fragment_bundle_v0`
- `writer_proposal_v0`

It evaluates exactly six output formats:

- `CASE_DIGEST`
- `SHORT_DRAMA`
- `SCENE_EXCERPT`
- `PLOT_SUMMARY`
- `LORE_EXPLAINER`
- `TRAILER_PV`

This is not arbitrary-novel ingestion, automatic literary adaptation, a screenplay-standard converter, or production-ready script generation. The fixture envelope supplies explicit structural and authority annotations; source wording and hashes remain the evidence.

## What the package proves

The accepted CASE_DIGEST source selects `CASE_DIGEST`, preserves five sections, resolves every material statement to a source span, reports zero unsupported factual claims, and produces an input compatible with the current `fff.editorialHandoff.v1` field families.

The quarantined six-Beat linear-lore source does not select `SHORT_DRAMA` at 180 seconds. Its missing enacted objective, obstacle, consequential action, observable result, and causal links remain failures; the adapter does not rewrite the source to force a pass.

The fragment fixture retains `null` reveal order and explicit missing-causality markers. The writer-proposal fixture records add, remove, replace, reorder, clarify, mark-undecided, and writer-authored attachment operations, but applies none of them and never auto-accepts canon.

## Command surface

Validation is read-only:

```text
node tools/fff-writer-source-adaptation.mjs validate-source --input fixtures/writer-source-adaptation/case-digest.prose.json
```

Every generation command requires an explicit output directory:

```text
node tools/fff-writer-source-adaptation.mjs build-source-packet --input <fixture.json> --output-dir <directory>
node tools/fff-writer-source-adaptation.mjs build-authority-ledger --input <fixture.json> --output-dir <directory>
node tools/fff-writer-source-adaptation.mjs select-format --input <fixture.json> --output-dir <directory>
node tools/fff-writer-source-adaptation.mjs build-narrative-ir --input <fixture.json> --output-dir <directory>
node tools/fff-writer-source-adaptation.mjs build-handoff-input --input <fixture.json> --output-dir <directory>
node tools/fff-writer-source-adaptation.mjs apply-writer-proposal --input <fixture.json> --output-dir <directory>
node tools/fff-writer-source-adaptation.mjs build-all --input <fixture.json> --output-dir <directory>
node tools/fff-writer-source-adaptation.mjs build-all --fixture-set fixtures/writer-source-adaptation/fixture-set.json --output-dir <directory>
```

Despite its command name, `apply-writer-proposal` compiles a proposal impact result; it does not mutate the base story, handoff, canon, or any product package.

## Reading the evidence

- `writer-source-packet.schema.json` defines file identity, hashes, source spans, writer constraints, unknowns, and normalization records.
- `story-authority-ledger.schema.json` defines the eleven supported authority classes and their human/canon boundaries.
- `format-selection.schema.json` defines ranked format decisions, local capacity metrics, and material disposition.
- `narrative-ir.schema.json` defines the source-bound intermediate representation.
- `writer-proposal.schema.json` defines proposal operations and impact classifications.
- `editorial-handoff-input.schema.json` defines the upstream-to-editorial boundary.
- `format-capacity-contract.json` records the accepted and quarantined calibration evidence and its limitations.
- `downstream-contract-map.json` records only the current consumer fields read for compatibility.
- The four `*-fixture-output.json` files contain complete compiled examples.
- `writer-source-adaptation-result.json` is the machine-readable acceptance summary.
- `writer-source-adaptation-readback.html` is the standalone human readback; it uses no scripts or external resources.

## Closed boundaries

The adapter makes no network, provider, credential, model, image, audio, video, render, publication, or public request. It does not confer production approval, rights clearance, final canon, or publication status. Capacity values are local 180-second reference evidence—not general thresholds—and no accepted SHORT_DRAMA calibration fixture exists yet.
