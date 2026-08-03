import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultOutputRoot = path.join(repoRoot, "artifacts", "densou-series-episode-quickwin-001");
const artifactId = "fff-densou-series-episode-quickwin-001";
const sourceRevisionId = "densou-256837a94afd521c";
const sourcePacketId = "fff-densou-series-source-256837a94afd521c";

const basisFiles = [
  {
    role: "primary_selected_source",
    path: "artifacts/sample-raw-memo.md",
    sha256: "256837a94afd521cadfcb676da2c3873a914ce95f11f493d5b60e15bc42f9a32",
    git_blob: "70ec0c8be41c25ed053670e885ad44ea44b13558",
    last_commit: "e329e8e2ae41ffdb7bcee5e1b862b4bc35fe24a6",
    evidence_class: "repository_author_memo_fixture_selected_by_current_user_override"
  },
  {
    role: "supporting_story_structure",
    path: "artifacts/private-full-raster-clarity-candidate/story-spine-clarity-v1.md",
    sha256: "509f96b88ca8e9ffcc5f6218372d41010f6b7cb2db9dc23c5079746d48f5497d",
    git_blob: "09e1224ebed09eb54a750debb14252b19317766e",
    last_commit: "c4ebaf91abfd0dc4441c604142975201dd76c365",
    evidence_class: "derived_story_spine_not_original_prose"
  },
  {
    role: "supporting_fact_boundary",
    path: "artifacts/private-raster-case-digest/case-digest-script.md",
    sha256: "4673e50999ff68cb0b56ce6ca51ca6f0dd62c002a393dab24b967846f8b1dabe",
    git_blob: "e9ebccdb48216ba9d8bff901b9f398f4f506ec1a",
    last_commit: "5ca536f3ef5f00da53b847b5537324a696aca1ef",
    evidence_class: "derived_case_digest_with_human_comprehension_receipt"
  },
  {
    role: "supporting_serial_form",
    path: "artifacts/one-story-draft-review-pack-result.json",
    sha256: "48c06c96f347dd4e8cd88449d3f38b3f942ac5061376814ac444296431ec1b79",
    git_blob: "e156db778c3c46c4c3b66925bf93d96da8f36c49",
    last_commit: "cfcb176393da916cc1e8c54fc7375fc14538ec23",
    evidence_class: "derived_provisional_mystery_lore_serial_route"
  }
];

const claims = [
  {
    claim_id: "claim-bell-reported-at-noon",
    statement_ja: "正午、ノース・ベル駅上の古い天文台から鐘の音が響く。",
    status: "reported",
    source_refs: ["artifacts/sample-raw-memo.md#L7", "artifacts/private-raster-case-digest/case-digest-script.md#L10-L14"]
  },
  {
    claim_id: "claim-bell-removed",
    statement_ja: "天文台の鐘は冬の外出禁止令のころに撤去された。",
    status: "source_statement",
    source_refs: ["artifacts/sample-raw-memo.md#L7"]
  },
  {
    claim_id: "claim-empty-bell-frame",
    statement_ja: "既存の派生証拠では塔の鐘枠が空として扱われている。",
    status: "derived_observation",
    source_refs: ["artifacts/private-full-raster-clarity-candidate/story-spine-clarity-v1.md#L8-L18", "artifacts/private-raster-case-digest/case-digest-script.md#L10-L14"]
  },
  {
    claim_id: "claim-mira-clockmaker",
    statement_ja: "ミラ・ヴェイルはガラスのアーケードで時計を修理している。",
    status: "source_statement",
    source_refs: ["artifacts/sample-raw-memo.md#L5"]
  },
  {
    claim_id: "claim-arcade-917",
    statement_ja: "ガラスのアーケードは毎晩9:17に閉まる。",
    status: "source_statement",
    source_refs: ["artifacts/sample-raw-memo.md#L5"]
  },
  {
    claim_id: "claim-toma-missing",
    statement_ja: "トーマはミラの失踪した兄として記録されている。",
    status: "source_statement",
    source_refs: ["artifacts/sample-raw-memo.md#L5", "artifacts/private-raster-case-digest/case-digest-script.md#L18-L22"]
  },
  {
    claim_id: "claim-note-and-moth",
    statement_ja: "トーマが残したとされるメモと真鍮の蛾が作業場の引き出しにある。",
    status: "reported",
    source_refs: ["artifacts/sample-raw-memo.md#L5", "artifacts/private-full-raster-clarity-candidate/story-spine-clarity-v1.md#L20-L33"]
  },
  {
    claim_id: "claim-council-allegation",
    statement_ja: "メモは、市の評議会が放棄された人生から『分』を売っていると告発する。",
    status: "allegation_not_proof",
    source_refs: ["artifacts/sample-raw-memo.md#L5", "artifacts/private-raster-case-digest/case-digest-script.md#L34-L38"]
  },
  {
    claim_id: "claim-ledger-location",
    statement_ja: "原メモは、評議会がアーケード下の施錠された棚に『分』の台帳を保管すると記す。",
    status: "source_statement_not_independently_verified",
    source_refs: ["artifacts/sample-raw-memo.md#L9"]
  },
  {
    claim_id: "claim-ledger-columns",
    statement_ja: "派生CASE_DIGESTでは、台帳に『分』欄と人名欄があると整理されている。",
    status: "derived_observation",
    source_refs: ["artifacts/private-raster-case-digest/case-digest-script.md#L26-L30"]
  },
  {
    claim_id: "claim-ledger-alternatives",
    statement_ja: "台帳は証拠、囮、偽記録のいずれでもあり得る。",
    status: "explicit_unresolved_alternatives",
    source_refs: ["artifacts/sample-raw-memo.md#L9"]
  },
  {
    claim_id: "claim-memory-leak-theory",
    statement_ja: "鐘の音を『歯車から漏れる記憶』とみるのはミラの考えであり、確定事実ではない。",
    status: "character_theory_unresolved",
    source_refs: ["artifacts/sample-raw-memo.md#L7"]
  }
];

const unresolved = [
  "鐘の音源と機構",
  "トーマの所在と生死",
  "真鍮の蛾の機能",
  "台帳の真正性と由来",
  "評議会の実際の関与と動機",
  "鐘、9:17、蛾、台帳の因果的接続",
  "失われた時間または名前を回復できるか"
];

const forbiddenInference = [
  "評議会の有罪または単純な悪役化",
  "台帳が時間を奪う機構であるとの断定",
  "真鍮の蛾が鍵、スパイ、記憶容器のいずれかであるとの確定",
  "トーマの生死、意思、居場所の決定",
  "鐘の音が超自然現象または記憶漏出であるとの確定",
  "9:17と各手掛かりの未証明な因果接続",
  "候補endingのfinal canon化"
];

const episodeSegments = [
  {
    segment_id: "ep01-seg01-incident",
    start_seconds: 0,
    end_seconds: 70,
    title_ja: "事件――鐘のない塔",
    treatment_ja: "正午、ノース・ベル駅の上にある古い天文台から鐘の音が響く。ところが、原メモでは鐘は冬の外出禁止令のころに撤去され、既存の派生証拠では取付枠も空として扱われている。このepisodeは音の正体を決めず、報告された音、撤去記録、空の枠を最初の調査対象として並べる。",
    claim_ids: ["claim-bell-reported-at-noon", "claim-bell-removed", "claim-empty-bell-frame"]
  },
  {
    segment_id: "ep01-seg02-investigator",
    start_seconds: 70,
    end_seconds: 155,
    title_ja: "調査者――時計修理師ミラ",
    treatment_ja: "ミラ・ヴェイルはガラスのアーケードで時計を修理している。アーケードが毎晩9:17に閉まること、時計を扱う彼女の仕事、失踪した兄トーマの存在を、別々の確認事項として提示する。9:17が鐘や失踪を引き起こすとは言わず、同じ調査で見直す時刻として保留する。",
    claim_ids: ["claim-mira-clockmaker", "claim-arcade-917", "claim-toma-missing"]
  },
  {
    segment_id: "ep01-seg03-personal-clues",
    start_seconds: 155,
    end_seconds: 245,
    title_ja: "個人的な手掛かり――メモと真鍮の蛾",
    treatment_ja: "作業場の引き出しには、トーマが残したとされるメモと真鍮の蛾がある。これはミラが調査を続ける個人的な理由になるが、トーマの所在を示す直接証拠ではない。蛾の機能も作動記録も決めず、まずメモの文面が何を告発しているかへ進む。",
    claim_ids: ["claim-toma-missing", "claim-note-and-moth"]
  },
  {
    segment_id: "ep01-seg04-allegation",
    start_seconds: 245,
    end_seconds: 335,
    title_ja: "告発――売られる『分』",
    treatment_ja: "メモは、市の評議会が放棄された人生から『分』を売っていると主張する。ここで重要なのは告発の強さではなく、その証拠区分である。メモは調査方向を示すが、評議会の関与、責任、動機を証明しない。episodeは告発を事実として採用せず、次の確認対象である台帳へ接続する。",
    claim_ids: ["claim-council-allegation"]
  },
  {
    segment_id: "ep01-seg05-ledger",
    start_seconds: 335,
    end_seconds: 430,
    title_ja: "記録――『分』と名前の台帳",
    treatment_ja: "原メモは、アーケード下の施錠された棚に評議会の『分』の台帳があると記す。派生CASE_DIGESTは、その台帳を『分』欄と人名欄を持つ記録として整理している。ただし、後者は原メモ全文そのものではない。二つの出典層を混同せず、台帳が何を記録し、誰が作ったのかを未解決のまま残す。",
    claim_ids: ["claim-ledger-location", "claim-ledger-columns"]
  },
  {
    segment_id: "ep01-seg06-alternatives",
    start_seconds: 430,
    end_seconds: 525,
    title_ja: "証拠限界――三つの可能性",
    treatment_ja: "原メモ自身が、台帳は証拠、囮、偽記録のいずれでもあり得ると境界を置く。鐘の音を『歯車から漏れる記憶』とみる考えも、ミラの仮説にとどまる。このepisodeでは複数の説明を競わせるだけで、一つを真実として選ばない。確認済み、報告、派生観察、仮説を明確に分ける。",
    claim_ids: ["claim-ledger-alternatives", "claim-memory-leak-theory"]
  },
  {
    segment_id: "ep01-seg07-current-status",
    start_seconds: 525,
    end_seconds: 630,
    title_ja: "現在地――結ばれていない手掛かり",
    treatment_ja: "現時点で同じ調査表に置けるのは、正午の鐘、撤去された鐘、9:17、トーマのメモ、真鍮の蛾、台帳、評議会への告発である。だが、同じ表にあることは因果関係の証明ではない。トーマの所在、蛾の機能、台帳の真正性、評議会の関与はすべて開いたままである。",
    claim_ids: ["claim-bell-reported-at-noon", "claim-arcade-917", "claim-note-and-moth", "claim-council-allegation", "claim-ledger-alternatives"]
  },
  {
    segment_id: "ep01-seg08-series-hook",
    start_seconds: 630,
    end_seconds: 720,
    title_ja: "シリーズへの入口――次に確かめること",
    treatment_ja: "第1話は解決ではなく、調査可能な問いを固定して終える。9:17は何の記録なのか。真鍮の蛾は何をするのか。台帳は真正か。評議会は関与したのか。トーマはどこにいるのか。これらを後続episodeの調査slotとして分離し、答えを先取りせず長尺シリーズの経路を開く。",
    claim_ids: ["claim-arcade-917", "claim-note-and-moth", "claim-ledger-alternatives", "claim-council-allegation", "claim-toma-missing"]
  }
];

class QuickwinError extends Error {}

function requireCondition(condition, message) {
  if (!condition) throw new QuickwinError(message);
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function canonicalBasisHash() {
  const canonical = basisFiles.map(({ role, path: filePath, sha256: hash }) => ({ role, path: filePath, sha256: hash }));
  return sha256(Buffer.from(JSON.stringify(canonical), "utf8"));
}

function parseArgs(argv) {
  const [command = "help", ...rest] = argv;
  const options = {};
  for (let index = 0; index < rest.length; index += 2) {
    requireCondition(rest[index]?.startsWith("--"), `unexpected argument: ${rest[index]}`);
    requireCondition(rest[index + 1] && !rest[index + 1].startsWith("--"), `missing value for ${rest[index]}`);
    options[rest[index].slice(2)] = rest[index + 1];
  }
  return { command, options };
}

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function ensureEmpty(outputRoot) {
  try {
    const info = await stat(outputRoot);
    requireCondition(info.isDirectory(), "output path exists and is not a directory");
    requireCondition((await readdir(outputRoot)).length === 0, "output directory must be new or empty");
  } catch (error) {
    if (error instanceof QuickwinError) throw error;
    await mkdir(outputRoot, { recursive: true });
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderScriptMarkdown({ basisId }) {
  const sections = episodeSegments.map((segment) => `## ${segment.title_ja}（${formatTime(segment.start_seconds)}–${formatTime(segment.end_seconds)}）\n\n${segment.treatment_ja}\n\n- claim refs: ${segment.claim_ids.map((id) => `\`${id}\``).join(" / ")}\n`).join("\n");
  return `# デンソウ Season 1 Episode 1 Review Treatment\n\n- artifact: \`${artifactId}\`\n- episode: \`densou-s01e01-bellless-tower\`\n- working title: 鐘のない塔\n- source basis: \`${basisId}\`\n- target editorial window: 12:00\n- language: Japanese review treatment\n- status: private development / not final script / not final canon\n\nこのtreatmentは既存repository素材を現在のユーザーoverrideによりデンソウのprivate開発入力として選定したものです。別送の原典全文ではなく、派生証拠を含む複合basisです。各段落はclaim refへ戻り、未証明の因果を確定しません。\n\n${sections}\n## 未解決のまま保持する項目\n\n${unresolved.map((item) => `- ${item}`).join("\n")}\n\n## このpacketが開かないgate\n\n- final canon\n- rights clearance\n- production approval\n- voice / audio / video generation\n- external provider / credentials\n- publication / upload / release\n`;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = String(seconds % 60).padStart(2, "0");
  return `${String(minutes).padStart(2, "0")}:${remainder}`;
}

function renderTimelineCsv() {
  const quote = (value) => `"${String(value).replaceAll('"', '""')}"`;
  const rows = [["segment_id", "start_seconds", "end_seconds", "duration_seconds", "title_ja", "claim_ids"]];
  for (const segment of episodeSegments) {
    rows.push([segment.segment_id, segment.start_seconds, segment.end_seconds, segment.end_seconds - segment.start_seconds, segment.title_ja, segment.claim_ids.join("|")]);
  }
  return `${rows.map((row) => row.map(quote).join(",")).join("\n")}\n`;
}

function renderReview({ basisReceipt, series, season, episode }) {
  const seasonItems = season.episodes.map((item) => `<li><strong>${escapeHtml(item.episode_id)}</strong> — ${escapeHtml(item.working_title)} <span class="state">${escapeHtml(item.state)}</span><br>${escapeHtml(item.investigation_question)}</li>`).join("\n");
  const segmentCards = episode.segments.map((segment) => `<section id="${escapeHtml(segment.segment_id)}"><p class="time">${formatTime(segment.start_seconds)}–${formatTime(segment.end_seconds)}</p><h3>${escapeHtml(segment.title_ja)}</h3><p>${escapeHtml(segment.treatment_ja)}</p><p class="refs">Claims: ${segment.claim_ids.map(escapeHtml).join(" / ")}</p></section>`).join("\n");
  const claimRows = claims.map((claim) => `<tr><td><code>${escapeHtml(claim.claim_id)}</code></td><td>${escapeHtml(claim.statement_ja)}</td><td>${escapeHtml(claim.status)}</td></tr>`).join("\n");
  return `<!doctype html>\n<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n<title>デンソウ S1E1 鐘のない塔 — Local Review</title>\n<style>:root{color-scheme:dark;--bg:#101318;--panel:#191f27;--ink:#eef2f7;--muted:#aeb9c8;--line:#334050;--accent:#e2b45b;--ok:#62c58a}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.7}main{width:min(76rem,100%);margin:auto;padding:clamp(1rem,4vw,3rem)}h1{font-size:clamp(2rem,6vw,4.5rem);line-height:1.05;margin:.35rem 0 1rem}.eyebrow,.time,.refs,.state{color:var(--muted);font-size:.88rem;letter-spacing:.04em}.badge{display:inline-block;border:1px solid var(--ok);color:var(--ok);padding:.2rem .55rem;border-radius:99rem}.notice{border-left:.35rem solid var(--accent);background:#241f17;padding:1rem 1.2rem;margin:1.5rem 0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(19rem,100%),1fr));gap:1rem}section,.panel{background:var(--panel);border:1px solid var(--line);border-radius:.8rem;padding:1.1rem}section h3{margin:.15rem 0 .6rem}table{width:100%;border-collapse:collapse;display:block;overflow-x:auto}th,td{text-align:left;vertical-align:top;border-bottom:1px solid var(--line);padding:.65rem}code{overflow-wrap:anywhere;color:#f4d9a4}a{color:#9ecbff}ul{padding-left:1.3rem}.gates{columns:2;column-width:18rem}@media(max-width:34rem){main{padding:1rem}th,td{min-width:10rem}.gates{columns:1}}</style>\n</head><body><main>\n<p class="eyebrow"><span class="badge">PRIVATE LOCAL REVIEW</span>　${escapeHtml(artifactId)}</p>\n<h1>デンソウ<br>Season 1 Episode 1<br>「鐘のない塔」</h1>\n<p>${escapeHtml(series.series_promise_ja)}</p>\n<div class="notice"><strong>Source-basis boundary</strong><br>これは別送されたデンソウ原典全文ではありません。repository内の「Sample Raw Memo」を現在のユーザーoverrideでprimaryに選び、既存のstory spine、CASE_DIGEST、draft review packを派生supporting evidenceとして使用しています。曖昧さと未解決事項は保持され、final canon・rights clearance・production approval・publicationは成立しません。</div>\n<div class="grid"><div class="panel"><h2>Identity</h2><dl><dt>Source basis</dt><dd><code>${escapeHtml(basisReceipt.source_basis_id)}</code></dd><dt>Source revision</dt><dd><code>${escapeHtml(sourceRevisionId)}</code></dd><dt>Primary SHA-256</dt><dd><code>${escapeHtml(basisFiles[0].sha256)}</code></dd><dt>Editorial window</dt><dd>12:00 / 8 segments</dd></dl></div><div class="panel"><h2>Review focus</h2><ul><li>第1話として事件・調査者・手掛かり・証拠限界が連続して理解できるか</li><li>原メモと派生証拠の区別が見えるか</li><li>後続episodeの問いが因果の捏造なしに開いているか</li></ul></div></div>\n<h2>Season 1 investigation map</h2><ol>${seasonItems}</ol>\n<h2>Episode 1 treatment</h2><div class="grid">${segmentCards}</div>\n<h2>Source-backed claim boundary</h2><table><thead><tr><th>Claim</th><th>Review statement</th><th>Status</th></tr></thead><tbody>${claimRows}</tbody></table>\n<h2>Open questions</h2><ul>${unresolved.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>\n<h2>Closed gates</h2><ul class="gates"><li>final canon</li><li>rights clearance</li><li>production approval</li><li>voice/audio/video generation</li><li>external provider/credentials</li><li>publication/upload/release</li></ul>\n</main></body></html>\n`;
}

async function inventoryFile(root, filePath) {
  const bytes = await readFile(filePath);
  return { path: path.relative(root, filePath).replaceAll("\\", "/"), byte_size: bytes.length, sha256: sha256(bytes) };
}

async function validateBasisFiles() {
  for (const entry of basisFiles) {
    const bytes = await readFile(path.join(repoRoot, entry.path));
    requireCondition(sha256(bytes) === entry.sha256, `source basis hash mismatch: ${entry.path}`);
  }
}

function buildDocuments() {
  const basisHash = canonicalBasisHash();
  const basisId = `fff-densou-source-basis-${basisHash.slice(0, 16)}`;
  const commonBoundaries = {
    final_canon: false,
    rights_clearance: false,
    production_approval: false,
    publication: false,
    upload: false,
    release: false,
    external_provider: false,
    credentials: false,
    voice_audio_video_generation: false
  };
  const basisReceipt = {
    schema_version: "fff.densou.sourceBasisReceipt.v1",
    source_basis_id: basisId,
    material_label: "デンソウ",
    selection_authority: {
      authority_type: "current_user_coordinator_priority_override",
      authority_date_jst: "2026-08-04",
      decision: "existing_repository_densou_canon_reference_material_is_sufficient_and_may_be_selected_without_another_locator",
      use_scope: "Fast Fiction Factory private long-form series and episode development"
    },
    intake_binding: {
      source_packet_id: sourcePacketId,
      source_revision_id: sourceRevisionId,
      primary_source_sha256: basisFiles[0].sha256,
      external_intake_manifest_sha256: "f91ebbc602e4058dcfb84c14fc9dff1f1e39337265552e47ee4001419fc84736"
    },
    basis_hash_sha256: basisHash,
    files: basisFiles,
    ambiguity_receipt: {
      exact_separately_delivered_densou_original_present: false,
      primary_file_self_labels_as_sample_raw_memo: true,
      supporting_files_are_derived_artifacts: true,
      selected_as_private_development_input_under_current_user_authority: true,
      claims_may_not_be_promoted_beyond_recorded_evidence_status: true,
      final_canon_asserted: false
    },
    excluded_candidate: {
      path: "artifacts/sample-story-memo.md",
      reason: "less conservative alternate memo contains additional names and a more committed possible ending; not silently merged into the selected primary"
    },
    boundaries: commonBoundaries
  };
  const factBoundary = {
    schema_version: "fff.densou.sourceFactBoundary.v1",
    source_basis_id: basisId,
    claims,
    unresolved,
    forbidden_inference: forbiddenInference,
    support_rule: "Every episode treatment segment must cite only claim_ids from this record; unresolved items remain open."
  };
  const series = {
    schema_version: "fff.densou.seriesManifest.v1.1",
    schema_lineage: "fff.densou.seriesManifest.v1",
    artifact_id: artifactId,
    series_id: "densou-series",
    material_label: "デンソウ",
    source_basis_id: basisId,
    source_packet_id: sourcePacketId,
    source_revision_id: sourceRevisionId,
    series_form: "long_form_evidence_led_mystery_serial",
    audience_language: "ja-JP-review-treatment",
    series_promise_ja: "鐘、時刻、記録、失踪を一つずつ検証し、未証明の因果を確定せずに追う長尺ミステリーシリーズ。",
    state: "season_01_episode_01_quickwin_ready_for_local_review",
    seasons: [{ season_id: "densou-season-01", manifest_path: "season-01-manifest.json", state: "episode_01_ready_later_slots_question_bound" }],
    boundaries: commonBoundaries
  };
  const season = {
    schema_version: "fff.densou.seasonManifest.v1.1",
    schema_lineage: "fff.densou.seasonManifest.v1",
    series_id: series.series_id,
    season_id: "densou-season-01",
    source_basis_id: basisId,
    working_title: "失われた分と名前",
    state: "episode_01_quickwin_ready_later_slots_not_written",
    episodes: [
      { episode_id: "densou-s01e01-bellless-tower", working_title: "鐘のない塔", state: "complete_development_packet_ready_for_local_review", investigation_question: "鐘のない塔、9:17、トーマの手掛かりは何を確認でき、何が未証明か。" },
      { episode_id: "densou-s01e02-0917", working_title: "9:17", state: "source_backed_investigation_slot_not_written", investigation_question: "9:17は何の記録なのか。" },
      { episode_id: "densou-s01e03-brass-moth", working_title: "真鍮の蛾", state: "source_backed_investigation_slot_not_written", investigation_question: "真鍮の蛾の機能は何か。" },
      { episode_id: "densou-s01e04-ledger", working_title: "『分』と名前の台帳", state: "source_backed_investigation_slot_not_written", investigation_question: "台帳は真正か、何を記録しているのか。" },
      { episode_id: "densou-s01e05-council", working_title: "評議会への告発", state: "source_backed_investigation_slot_not_written", investigation_question: "評議会は関与したのか。" },
      { episode_id: "densou-s01e06-toma", working_title: "トーマの所在", state: "source_backed_investigation_slot_not_written", investigation_question: "トーマはどこにいるのか。" }
    ],
    slot_rule: "Episodes 2-6 are question-bound slots only; no event, answer, mechanism, motive, or ending is authored."
  };
  const episode = {
    schema_version: "fff.densou.episodeManifest.v1.1",
    schema_lineage: "fff.densou.episodeManifest.v1",
    artifact_id: artifactId,
    series_id: series.series_id,
    season_id: season.season_id,
    episode_id: "densou-s01e01-bellless-tower",
    working_title: "鐘のない塔",
    source_basis_id: basisId,
    source_packet_id: sourcePacketId,
    source_revision_id: sourceRevisionId,
    target_form: {
      format: "long_form_episode_development_treatment",
      editorial_window_seconds: 720,
      timing_status: "review_timing_not_audio_or_picture_lock"
    },
    state: "complete_development_packet_ready_for_local_review",
    segments: episodeSegments,
    viewer_artifact: "densou-episode-001-review.html",
    script_artifact: "episode-001-review-treatment.md",
    unsupported_fact_count: 0,
    hidden_causal_bridge_count: 0,
    boundaries: commonBoundaries
  };
  const closedBoundarySchema = {
    type: "object",
    additionalProperties: false,
    required: Object.keys(commonBoundaries),
    properties: Object.fromEntries(Object.keys(commonBoundaries).map((key) => [key, { const: false }]))
  };
  const seriesSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "fff.densou.seriesManifest.v1.1",
    title: "Densou Developed Series Manifest",
    type: "object",
    additionalProperties: false,
    required: ["schema_version", "schema_lineage", "artifact_id", "series_id", "material_label", "source_basis_id", "source_packet_id", "source_revision_id", "series_form", "audience_language", "series_promise_ja", "state", "seasons", "boundaries"],
    properties: {
      schema_version: { const: "fff.densou.seriesManifest.v1.1" },
      schema_lineage: { const: "fff.densou.seriesManifest.v1" },
      artifact_id: { const: artifactId },
      series_id: { const: "densou-series" },
      material_label: { const: "デンソウ" },
      source_basis_id: { type: "string", pattern: "^fff-densou-source-basis-[0-9a-f]{16}$" },
      source_packet_id: { type: "string", minLength: 1 },
      source_revision_id: { type: "string", pattern: "^densou-[0-9a-f]{16}$" },
      series_form: { const: "long_form_evidence_led_mystery_serial" },
      audience_language: { type: "string", minLength: 1 },
      series_promise_ja: { type: "string", minLength: 1 },
      state: { const: "season_01_episode_01_quickwin_ready_for_local_review" },
      seasons: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["season_id", "manifest_path", "state"],
          properties: {
            season_id: { const: "densou-season-01" },
            manifest_path: { const: "season-01-manifest.json" },
            state: { const: "episode_01_ready_later_slots_question_bound" }
          }
        }
      },
      boundaries: closedBoundarySchema
    }
  };
  const seasonSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "fff.densou.seasonManifest.v1.1",
    title: "Densou Developed Season Manifest",
    type: "object",
    additionalProperties: false,
    required: ["schema_version", "schema_lineage", "series_id", "season_id", "source_basis_id", "working_title", "state", "episodes", "slot_rule"],
    properties: {
      schema_version: { const: "fff.densou.seasonManifest.v1.1" },
      schema_lineage: { const: "fff.densou.seasonManifest.v1" },
      series_id: { const: "densou-series" },
      season_id: { const: "densou-season-01" },
      source_basis_id: { type: "string", pattern: "^fff-densou-source-basis-[0-9a-f]{16}$" },
      working_title: { type: "string", minLength: 1 },
      state: { const: "episode_01_quickwin_ready_later_slots_not_written" },
      episodes: {
        type: "array",
        minItems: 6,
        maxItems: 6,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["episode_id", "working_title", "state", "investigation_question"],
          properties: {
            episode_id: { type: "string", pattern: "^densou-s01e0[1-6]-" },
            working_title: { type: "string", minLength: 1 },
            state: { enum: ["complete_development_packet_ready_for_local_review", "source_backed_investigation_slot_not_written"] },
            investigation_question: { type: "string", minLength: 1 }
          }
        }
      },
      slot_rule: { type: "string", minLength: 1 }
    }
  };
  const episodeSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "fff.densou.episodeManifest.v1.1",
    title: "Densou Developed Long-form Episode Manifest",
    type: "object",
    additionalProperties: false,
    required: ["schema_version", "schema_lineage", "artifact_id", "series_id", "season_id", "episode_id", "working_title", "source_basis_id", "source_packet_id", "source_revision_id", "target_form", "state", "segments", "viewer_artifact", "script_artifact", "unsupported_fact_count", "hidden_causal_bridge_count", "boundaries"],
    properties: {
      schema_version: { const: "fff.densou.episodeManifest.v1.1" },
      schema_lineage: { const: "fff.densou.episodeManifest.v1" },
      artifact_id: { const: artifactId },
      series_id: { const: "densou-series" },
      season_id: { const: "densou-season-01" },
      episode_id: { const: "densou-s01e01-bellless-tower" },
      working_title: { type: "string", minLength: 1 },
      source_basis_id: { type: "string", pattern: "^fff-densou-source-basis-[0-9a-f]{16}$" },
      source_packet_id: { type: "string", minLength: 1 },
      source_revision_id: { type: "string", pattern: "^densou-[0-9a-f]{16}$" },
      target_form: {
        type: "object",
        additionalProperties: false,
        required: ["format", "editorial_window_seconds", "timing_status"],
        properties: {
          format: { const: "long_form_episode_development_treatment" },
          editorial_window_seconds: { const: 720 },
          timing_status: { const: "review_timing_not_audio_or_picture_lock" }
        }
      },
      state: { const: "complete_development_packet_ready_for_local_review" },
      segments: {
        type: "array",
        minItems: 8,
        maxItems: 8,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["segment_id", "start_seconds", "end_seconds", "title_ja", "treatment_ja", "claim_ids"],
          properties: {
            segment_id: { type: "string", pattern: "^ep01-seg0[1-8]-" },
            start_seconds: { type: "integer", minimum: 0 },
            end_seconds: { type: "integer", maximum: 720 },
            title_ja: { type: "string", minLength: 1 },
            treatment_ja: { type: "string", minLength: 1 },
            claim_ids: { type: "array", minItems: 1, items: { type: "string", pattern: "^claim-" } }
          }
        }
      },
      viewer_artifact: { const: "densou-episode-001-review.html" },
      script_artifact: { const: "episode-001-review-treatment.md" },
      unsupported_fact_count: { const: 0 },
      hidden_causal_bridge_count: { const: 0 },
      boundaries: closedBoundarySchema
    }
  };
  return { basisReceipt, factBoundary, series, season, episode, seriesSchema, seasonSchema, episodeSchema };
}

async function commandBuild(options) {
  await validateBasisFiles();
  const outputRoot = path.resolve(options.out ?? defaultOutputRoot);
  await ensureEmpty(outputRoot);
  const docs = buildDocuments();
  const paths = {
    basis: path.join(outputRoot, "source-basis-receipt.json"),
    facts: path.join(outputRoot, "source-fact-boundary.json"),
    series: path.join(outputRoot, "series-manifest.json"),
    season: path.join(outputRoot, "season-01-manifest.json"),
    episode: path.join(outputRoot, "episode-001-manifest.json"),
    seriesSchema: path.join(outputRoot, "series-manifest.schema.json"),
    seasonSchema: path.join(outputRoot, "season-manifest.schema.json"),
    episodeSchema: path.join(outputRoot, "episode-manifest.schema.json"),
    treatment: path.join(outputRoot, "episode-001-review-treatment.md"),
    timeline: path.join(outputRoot, "episode-001-timeline.csv"),
    review: path.join(outputRoot, "densou-episode-001-review.html")
  };
  await Promise.all([
    writeJson(paths.basis, docs.basisReceipt),
    writeJson(paths.facts, docs.factBoundary),
    writeJson(paths.series, docs.series),
    writeJson(paths.season, docs.season),
    writeJson(paths.episode, docs.episode),
    writeJson(paths.seriesSchema, docs.seriesSchema),
    writeJson(paths.seasonSchema, docs.seasonSchema),
    writeJson(paths.episodeSchema, docs.episodeSchema),
    writeFile(paths.treatment, renderScriptMarkdown({ basisId: docs.basisReceipt.source_basis_id }), "utf8"),
    writeFile(paths.timeline, renderTimelineCsv(), "utf8"),
    writeFile(paths.review, renderReview(docs), "utf8")
  ]);
  const files = await Promise.all(Object.values(paths).map((filePath) => inventoryFile(outputRoot, filePath)));
  files.sort((left, right) => left.path.localeCompare(right.path));
  const evidenceManifest = {
    schema_version: "fff.densou.seriesEpisodeEvidenceManifest.v1",
    artifact_id: artifactId,
    source_basis_id: docs.basisReceipt.source_basis_id,
    episode_id: docs.episode.episode_id,
    state: docs.episode.state,
    files
  };
  await writeJson(path.join(outputRoot, "evidence-manifest.json"), evidenceManifest);
  const verification = await verify(outputRoot);
  console.log(JSON.stringify({ result: "PASS", output_root: outputRoot, artifact_id: artifactId, source_basis_id: docs.basisReceipt.source_basis_id, episode_id: docs.episode.episode_id, verification }, null, 2));
}

function assertLocalReview(html) {
  requireCondition(!/https?:\/\//i.test(html), "review contains external URL");
  requireCondition(!/<(?:script|form|input|textarea|button|audio|video)\b/i.test(html), "review contains active, input, or media surface");
  requireCondition(!/autoplay|localStorage|fetch\s*\(/i.test(html), "review contains autoplay, persistence, or network behavior");
}

async function verify(outputRoot) {
  await validateBasisFiles();
  const root = path.resolve(outputRoot);
  const [basis, facts, series, season, episode, seriesSchema, seasonSchema, episodeSchema, treatment, timeline, review, manifest] = await Promise.all([
    readJson(path.join(root, "source-basis-receipt.json")),
    readJson(path.join(root, "source-fact-boundary.json")),
    readJson(path.join(root, "series-manifest.json")),
    readJson(path.join(root, "season-01-manifest.json")),
    readJson(path.join(root, "episode-001-manifest.json")),
    readJson(path.join(root, "series-manifest.schema.json")),
    readJson(path.join(root, "season-manifest.schema.json")),
    readJson(path.join(root, "episode-manifest.schema.json")),
    readFile(path.join(root, "episode-001-review-treatment.md"), "utf8"),
    readFile(path.join(root, "episode-001-timeline.csv"), "utf8"),
    readFile(path.join(root, "densou-episode-001-review.html"), "utf8"),
    readJson(path.join(root, "evidence-manifest.json"))
  ]);
  const expectedBasisId = `fff-densou-source-basis-${canonicalBasisHash().slice(0, 16)}`;
  requireCondition(basis.source_basis_id === expectedBasisId, "source basis identity mismatch");
  requireCondition(basis.files.length === 4 && basis.files[0].role === "primary_selected_source", "source basis roles mismatch");
  requireCondition(basis.ambiguity_receipt.exact_separately_delivered_densou_original_present === false && basis.ambiguity_receipt.primary_file_self_labels_as_sample_raw_memo === true, "source ambiguity receipt missing");
  requireCondition(basis.ambiguity_receipt.selected_as_private_development_input_under_current_user_authority === true, "current selection authority missing");
  requireCondition(Object.values(basis.boundaries).every((value) => value === false), "source basis opened a closed gate");
  const claimIds = new Set(facts.claims.map((claim) => claim.claim_id));
  requireCondition(facts.claims.length === 12 && facts.claims.every((claim) => claim.source_refs.length > 0), "fact boundary source refs incomplete");
  requireCondition(facts.unresolved.length === 7 && facts.forbidden_inference.length === 7, "uncertainty boundary count mismatch");
  requireCondition(series.source_basis_id === expectedBasisId && series.state === "season_01_episode_01_quickwin_ready_for_local_review", "series state mismatch");
  requireCondition(series.schema_lineage === "fff.densou.seriesManifest.v1" && seriesSchema.$id === series.schema_version, "series schema lineage mismatch");
  requireCondition(season.source_basis_id === expectedBasisId && season.episodes.length === 6, "season map mismatch");
  requireCondition(season.schema_lineage === "fff.densou.seasonManifest.v1" && seasonSchema.$id === season.schema_version, "season schema lineage mismatch");
  requireCondition(season.episodes[0].state === "complete_development_packet_ready_for_local_review" && season.episodes.slice(1).every((item) => item.state === "source_backed_investigation_slot_not_written"), "season authored an unsupported later episode");
  requireCondition(episode.source_basis_id === expectedBasisId && episode.segments.length === 8, "episode identity or segment count mismatch");
  requireCondition(episode.schema_lineage === "fff.densou.episodeManifest.v1" && episodeSchema.$id === episode.schema_version, "episode schema lineage mismatch");
  let cursor = 0;
  for (const segment of episode.segments) {
    requireCondition(segment.start_seconds === cursor && segment.end_seconds > segment.start_seconds, `episode timing gap or overlap: ${segment.segment_id}`);
    requireCondition(segment.claim_ids.length > 0 && segment.claim_ids.every((id) => claimIds.has(id)), `episode claim ref mismatch: ${segment.segment_id}`);
    requireCondition(treatment.includes(segment.title_ja) && treatment.includes(segment.treatment_ja), `treatment mismatch: ${segment.segment_id}`);
    requireCondition(review.includes(segment.segment_id) && review.includes(segment.treatment_ja), `review mismatch: ${segment.segment_id}`);
    cursor = segment.end_seconds;
  }
  requireCondition(cursor === 720 && episode.target_form.editorial_window_seconds === 720, "episode editorial window mismatch");
  requireCondition(episode.unsupported_fact_count === 0 && episode.hidden_causal_bridge_count === 0, "episode reports unsupported content");
  requireCondition(Object.values(episode.boundaries).every((value) => value === false), "episode opened a closed gate");
  requireCondition(timeline.trim().split(/\r?\n/).length === 9, "timeline row count mismatch");
  assertLocalReview(review);
  requireCondition(review.includes(artifactId) && review.includes(expectedBasisId) && review.includes("別送されたデンソウ原典全文ではありません"), "review identity or ambiguity warning missing");
  requireCondition(manifest.schema_version === "fff.densou.seriesEpisodeEvidenceManifest.v1" && manifest.files.length === 11, "evidence manifest shape mismatch");
  for (const entry of manifest.files) {
    requireCondition(!entry.path.startsWith("../") && !path.isAbsolute(entry.path), `unsafe evidence path: ${entry.path}`);
    const bytes = await readFile(path.join(root, entry.path));
    requireCondition(bytes.length === entry.byte_size && sha256(bytes) === entry.sha256, `evidence identity mismatch: ${entry.path}`);
  }
  return { result: "PASS", checks_passed: 21, checks_total: 21, artifact_id: artifactId, source_basis_id: expectedBasisId, episode_id: episode.episode_id, editorial_window_seconds: 720, state_code: "WAITING_USER_DECISION" };
}

async function commandVerify(options) {
  const outputRoot = path.resolve(options.root ?? defaultOutputRoot);
  console.log(JSON.stringify(await verify(outputRoot), null, 2));
}

function printHelp() {
  console.log(`Densou series episode quick-win\n\nCommands:\n  build [--out <new-empty-directory>]\n  verify [--root <packet-directory>]`);
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));
  if (command === "build") return commandBuild(options);
  if (command === "verify") return commandVerify(options);
  if (command === "help" || command === "--help") return printHelp();
  throw new QuickwinError(`unknown command: ${command}`);
}

await main().catch((error) => {
  console.error(JSON.stringify({ result: "FAIL", state_code: "SOURCE_OR_PACKET_INVALID", error: error.message }, null, 2));
  process.exitCode = 2;
});
