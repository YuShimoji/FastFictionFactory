# Composition Expansion Wave 1 Review

## Scope and outcome

- Artifact: `fff-composition-expansion-wave1-001`
- Thread: `fff-composition-expansion-wave1-001`
- Lane: `COMPOSITION_EXPANSION`
- Epoch: `FFF-2026-07-18-03`
- Worker base: `a2f61c72680b2a7d9220f4a2d8f05c2e79ac5189`
- Outcome: Beat 1 and Beat 3の6 source shotsを具体化し、既存Beat 2/4と合わせて12/19 shotsを具体化
- Primary access: `artifacts/composition-expansion-wave1/composition-expansion-wave1.html`

This is a local/reference-only H0 package. It does not select assets, clear rights, generate images, approve production, make final art, render, publish, persist database state, decide canon, touch Beats 5/6, or build the final 19-shot package.

## Owner Review policy

| Field | Recorded value |
| --- | --- |
| Beat 4 review | `OWNER_REVIEW_PASS` |
| Observation | 「大きな破綻はなさそう」 |
| Disposition | composition expansion authorized |
| Evidence boundary | product-owner directional acceptance; not independent transfer proof |
| Per-Beat external reviewer required | false |
| Per-Beat blind review | discontinued |
| Wave 1 human review | none |
| Next human review | after complete integrated 19-shot visual package |
| External reproducibility claimed | false |
| Beat 4 repair required | false |

Historical review evidence is preserved. Only current authority and forward-plan language adopts this policy.

## Request Fidelity Matrix

| ID | Requirement | Evidence | State |
| --- | --- | --- | --- |
| RF-01 | Exactly Beats 1/3 and six source shots | canonical JSON `beats`, `shots`; source-row validator | passed |
| RF-02 | Preserve IDs, timing, order, wording/truth/rights/asset/canon states | exact Execution/Storyboard row comparison; closed boundary flags; predecessor hashes | passed |
| RF-03 | Real local raster primary material | 12 local JPEGs; HTML has no remote image source | passed |
| RF-04 | Unique main image per shot | six main IDs and hashes are unique | passed |
| RF-05 | 9–14 references and at least 12 assignments | 12 references / 12 assignments | passed |
| RF-06 | 1 main + at least 1 support, max 3 unless documented | every shot has exactly 2 references | passed |
| RF-07 | Complete metadata | JSON and `reference-sources.csv` include every required field | passed |
| RF-08 | Explicit reusable license or public domain only | CC0, CC BY, CC BY-SA, author-dedicated public domain | passed |
| RF-09 | Reject screenshots/hotlinks/ambiguous/watermark/gated/personal/wrongdoer/upscale | local audit, rejected-reference ledger, negative probes | passed |
| RF-10 | Complete composition-transfer fields | six canonical shot records and six HTML strips | passed |
| RF-11 | Six materially distinct compositions | six unique composition classes and main images | passed |
| RF-12 | Factual headings and concise production language | primary HTML inspection; process/audit material remains secondary/outside page | passed |
| RF-13 | Light/Dark/Auto, Auto default | browser evidence and theme controls | passed |
| RF-14 | Document-only vertical scroll, no horizontal overflow | 900/1280 metrics: nested owners 0; horizontal overflow false | passed |
| RF-15 | Source/license details secondary | source section is final and visually compact | passed |
| RF-16 | Owner policy, no new per-Beat human gate | model and current authority docs | passed |
| RF-17 | Normal validation read-only | pre/post status and hash proof | passed |
| RF-18 | Avoid Beats 5/6, final integration, post-Wave review, selection, rights, AI/API/credentials/render/upload/database/canon | write-set audit and closed flags | passed |

## Acceptance and Evidence Matrix

| ID | Signal | Evidence | State |
| --- | --- | --- | --- |
| AS-01 | Exactly Beats 1 and 3 | model + validator | passed |
| AS-02 | Six correct source shots, IDs, timing, order | model + exact source authority rows | passed |
| AS-03 | 9–14 distinct licensed local rasters | 12 rows/assets, unique hashes/media URLs | passed |
| AS-04 | At least 12 assignments | shot map = 12 | passed |
| AS-05 | Unique main + support per shot | six unique mains; two refs each | passed |
| AS-06 | Complete provenance/dimensions/hashes | JSON/CSV/local-byte audit | passed |
| AS-07 | `reference_only=true`, `selected=false`, `rights=false` | 12/12 reference records | passed |
| AS-08 | Six materially distinct strips | HTML/model class inventory | passed |
| AS-09 | All composition-transfer fields | model/HTML field validators | passed |
| AS-10 | Beat 1 continuity | location → absence → unresolved noon hold | passed |
| AS-11 | Beat 3 continuity | ledger encountered → relationship inspected → absence visualized | passed |
| AS-12 | No unresolved truth resolved | cause/authenticity/literal-erasure guards | passed |
| AS-13 | No symbolic pseudo-storyboard primary | local raster-only primaries | passed |
| AS-14 | Theme/focus/print/scroll/overflow | captured browser evidence | passed |
| AS-15 | Owner policy/no Wave 1 human gate | model and current authority docs | passed |
| AS-16 | Predecessor bytes unchanged | ten pre/post directory inventories | passed |
| AS-17 | Normal validation read-only | pre/post Git status and tracked hashes | passed |
| AS-18 | Commit/push/parity `0 0` | post-push AGENT_REPORT; cannot be pre-recorded in its own commit | post-push condition |

## Reference Acquisition Audit

| Ref | Creator | License | Original px | Normalized px | Used by |
| --- | --- | --- | --- | --- | --- |
| Kreiensen station | Michael Gäbler | CC BY 3.0 | 1969×1194 | 1600×970 | b01-01 main |
| Harvard Observatory | Daderot | Public domain (author dedication) | 2448×3264 | 1200×1600 | b01-01 support |
| Wood joints | Shyamal | CC0 | 3000×3000 | 1600×1600 | b01-02 main |
| Beam junction | shankar s. | CC BY 2.0 | 4288×2848 | 1600×1062 | b01-02 support |
| Belfry interior art | William Henry Hunt | CC0 | 1394×1920 | 1162×1600 | b01-03 main |
| Noon mark | Poulpy | CC BY-SA 3.0 | 3013×4547 | 1060×1600 | b01-03 support |
| Antique book page turning | Pics_Pd | CC0 | 4681×3100 | 1600×1060 | b03-01 main |
| Book in hand | AgustinaCC | CC0 | 2619×1964 | 1600×1200 | b03-01 support |
| Blank book | Trey Jones | CC0 | 1200×1200 | 1200×1200 | b03-02 main |
| Ledger geometry | RaphaelQS | CC0 | 1706×896 | 1600×840 | b03-02 support |
| Old paper | Smartscrutiny | CC BY-SA 4.0 | 3840×2169 | 1600×904 | b03-03 main |
| Ink stains | Menetekel | Public domain (author dedication) | 997×1323 | 996×1322 | b03-03 support |

The full source page URLs, original media URLs, license URLs, retrieval date, exact local paths, complete SHA256 values, and role metadata are authoritative in `reference-sources.csv` and the canonical JSON.

Rejected candidates include actual visible bells, bell mechanism/weights, an RGB filter mislabeled as ink, an AI-generated paper texture, an actual project ledger, and an exterior belfry with visible bells. They were rejected for truth conflict, semantic mismatch, AI-source boundary, actual-record risk, or composition mismatch.

## Six-Shot Composition Audit

| Shot | Class | Primary → secondary focus | Borrowed material | Continuity |
| --- | --- | --- | --- | --- |
| b01-01 | station_tower_establishing_depth | empty frame → station/tower distance | station depth + observatory silhouette | cuts inward to mount detail |
| b01-02 | empty_mount_architectural_detail | empty joint → surrounding beam | joinery void + beam junction | dissolves from absent mount to held empty frame |
| b01-03 | unresolved_frame_noon_hold | empty frame → noon mark | belfry-like frame + exterior noon marker | held fade preserves unanswered absence |
| b03-01 | anonymous_ledger_opening_insert | turning page → anonymous hand | page motion + hand scale | hard cut from tower sequence into investigation |
| b03-02 | fictional_ledger_relation_graphic | fictional blank columns → relation gap | blank paper + blurred column geometry | graphic match converts object to explicit production insert |
| b03-03 | staged_record_fade_metaphor | intact contour → missing contour | paper material + ink diffusion | dissolve leaves structured columns for staged metaphor |

Pairwise non-collapse checks cover b01-01 vs b01-03, b01-02 vs b03-01, b03-02 vs b03-03, and Wave 1 vs preserved Beat 2/4 main classes.

## Truth-Boundary Audit

- Beat 1 does not visualize a cause for the bell sound.
- Beat 3 Shot 1 does not claim ledger ownership, authenticity, or guilt.
- Beat 3 Shot 2 is labeled as a created fictional insert; the actual ledger reference contributes blurred column geometry only.
- Beat 3 Shot 3 is labeled as a created metaphor; it is not literal erasure proof and shows no disappearing person or supernatural agent.
- All reference and package boundary flags remain closed.

## Source Immutability Audit

Ten protected directories are inventoried recursively as `path|byte_size|sha256`, sorted by repo path, joined with LF, then SHA256 aggregated. Expected file counts/aggregates are fixed in the Wave 1 model and validator. The green result records full per-file inventories in both `pre` and `post` and requires equality.

Normal validation never writes. Smoke may regenerate only `composition-expansion-wave1-manifest.json` and `artifacts/composition-expansion-wave1-result.json`; it does not rewrite the twelve acquired JPEGs or contact sheet.

## Browser / Theme / Print Evidence

- 900×1200 Dark: six shots, Auto initial, Dark resolved, horizontal overflow false, nested scroll owners 0, first visual precedes copy.
- 1280×900 Light: six shots, Auto initial, Light resolved, horizontal overflow false, nested scroll owners 0.
- Keyboard focus: `:focus-visible` resolves to a visible 3px outline.
- Print: white background, theme controls hidden, shot `break-inside: avoid`.
- Screenshot hashes and byte sizes are recorded in the result and root manifest.

## Negative Probes

The validator implements all 40 contract probes. Every result record contains `passed=true`, `fail_closed=true`, and `artifact_mutation=false`. The probes cover source fingerprint, Beat/shot inventory, timing/order, reference count/assignment/uniqueness/metadata/license/hotlink/resolution, composition fields, unresolved truths, selection/rights/generation, predecessor mutation, review policy, theme/scroll/overflow, and manifest mismatch.

## Validation commands

```powershell
node --check tools/fff-state.mjs
node --check tools/fff-composition-expansion-wave1.mjs
node tools/fff-state.mjs validate-composition-expansion-wave1 artifacts/composition-expansion-wave1-result.json
node tools/fff-state.mjs validate-beat2-composition-board artifacts/beat2-composition-board-result.json
node tools/fff-state.mjs validate-beat4-composition-counterexample artifacts/beat4-composition-counterexample-result.json
node tools/fff-state.mjs validate-beat2-visual-treatment-pilot artifacts/beat2-visual-treatment-pilot-result.json
node tools/fff-state.mjs validate-production-storyboard-brief artifacts/production-storyboard-brief-result.json
node tools/fff-state.mjs validate-production-execution-pack artifacts/production-execution-pack-result.json
uvx --with mkdocs-material mkdocs build --strict
git diff --check
```

The full historical suite is intentionally out of scope.

## Residual Work

| Work | Purpose | Effect | Requirements | State | Owner | Next move |
| --- | --- | --- | --- | --- | --- | --- |
| Wave 2 contract | Bound the remaining seven Beat 5/6 shots | Defines a safe path to 19/19 | explicit owner authorization, exact source rows, reference/continuity budget | proposed / data only | supervisor + product owner | authorize or revise contract only |
| Wave 2 H0 | Make Beats 5/6 concrete | Completes integration inputs | accepted Wave 2 contract | not authorized | future worker | start only after authorization |
| 19-shot integration | Join all concrete composition packages | Enables full-sequence review | Wave 2 H0 pass and predecessor immutability | future | future worker | implement after Wave 2 |
| Integrated review | Judge whole-story composition/continuity | Creates evidence for later production gate | exact integrated artifact/hash | owner gate | human owner / supervising AI | perform once after integration |
| Production/rights | Select actual production assets and clear use | May move beyond reference-only | explicit selection and rights authority | closed | human/rights owner | separate authorization after integrated review |
