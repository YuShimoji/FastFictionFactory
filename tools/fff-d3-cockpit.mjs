import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const COCKPIT_PATH = "public/cockpit/d3-production-input.html";
const PREVIEW_HTML = "artifacts/private-previsualization-timeline/private-previsualization-timeline.html";
const PREVIEW_MP4 = "artifacts/private-previsualization-timeline/private-previsualization-timeline.mp4";
const ACCEPTED_AUTHORITY = "artifacts/private-materialized-motion-previs/private-materialized-motion-previs.json";
const ROOT_MANIFEST = "artifacts/artifact-manifest.json";
const CURRENT_BASIS = "docs/review/current-basis-review-burden-receipt.json";
const EXPECTED = {
  previewHtml: "f152ecfe35650eca87d5e56bcde8bc19d05f2a477773ea66d8ba14ab15dbe256",
  previewMp4: "78c1b45498c25b873a757e04816257c42d31d4a53fd0c9905b50ae37a6022978",
  acceptedAuthority: "816ee1996e48f1db6ebbe4774ebf40f76eecd50259a95488fd89ae75f892edda"
};

function absolute(repoRelativePath) {
  return path.isAbsolute(repoRelativePath) ? repoRelativePath : path.join(REPO_ROOT, repoRelativePath);
}

async function bytes(repoRelativePath) {
  return readFile(absolute(repoRelativePath));
}

async function text(repoRelativePath) {
  return (await bytes(repoRelativePath)).toString("utf8");
}

async function json(repoRelativePath) {
  return JSON.parse(await text(repoRelativePath));
}

async function sha256(repoRelativePath) {
  return createHash("sha256").update(await bytes(repoRelativePath)).digest("hex");
}

function requireCondition(value, message) {
  if (!value) throw new Error(`D3_COCKPIT_INVALID: ${message}`);
}

export async function validateD3Cockpit({ cockpitPath = COCKPIT_PATH } = {}) {
  const cockpit = await text(cockpitPath);
  const authority = await json(ACCEPTED_AUTHORITY);
  const root = await json(ROOT_MANIFEST);
  const currentBasis = await json(CURRENT_BASIS);

  requireCondition(await sha256(PREVIEW_HTML) === EXPECTED.previewHtml, "exact preview HTML hash");
  requireCondition(await sha256(PREVIEW_MP4) === EXPECTED.previewMp4, "exact preview MP4 hash");
  requireCondition(await sha256(ACCEPTED_AUTHORITY) === EXPECTED.acceptedAuthority, "accepted authority hash");
  requireCondition(authority.accepted_human_decisions?.private_preview_experience === "accept", "accepted preview decision");
  requireCondition(authority.accepted_human_decisions?.existing_preview_repair_required === false, "accepted repair decision");
  requireCondition(authority.accepted_human_decisions?.recommended_asset_plan === "A", "accepted asset plan");
  requireCondition(authority.accepted_human_decisions?.exception_requirement_ids?.length === 0, "accepted exceptions");
  requireCondition(root.asset_rights_readiness_packet_owner_asset_plan_decision === "A", "root plan routing");
  requireCondition(root.asset_rights_readiness_packet_next_decision === "production_input_contract_authorization", "protected root historical routing");
  requireCondition(currentBasis.current_routing?.next_decision === "project_goal_reset", "current-basis goal-reset routing");
  requireCondition(currentBasis.current_routing?.root_manifest_routing_superseded === true, "current-basis root supersession");

  const requiredMarkup = [
    'data-fff-cockpit="d3-production-input"',
    'id="previewVideo"',
    "private-previsualization-timeline.mp4",
    EXPECTED.previewMp4,
    'data-accepted-decision="preview"',
    'data-accepted-decision="asset-plan"',
    'data-current-stage="goal-reset-pending"',
    'data-review-requirement="none"',
    'id="archivedPreview"',
    '<summary>過去の動画を表示</summary>',
    "Production-input contract",
    "以前の <code>fff-private-previsualization-timeline-001</code>",
    "再生は任意",
    "この画面でPass / Failを求めません",
    "プロジェクト目標の再設定",
    "旧D3の担当者・対象範囲フォームは現在の確認項目から外しました",
    "確定済みの判断"
  ];
  for (const marker of requiredMarkup) requireCondition(cockpit.includes(marker), `missing marker ${marker}`);
  const forbiddenUiCopy = [
    "見る。確かめる。D3へ進む。",
    "Critical path / accepted basis",
    'aria-label="critical path gain"',
    "<strong>−2</strong>"
  ];
  for (const marker of forbiddenUiCopy) requireCondition(!cockpit.includes(marker), `slop UI copy returned: ${marker}`);
  requireCondition(
    /h1\s*\{[^}]*font:\s*600\s+clamp\(32px,\s*4vw,\s*48px\)/.test(cockpit),
    "primary heading scale must remain bounded"
  );
  requireCondition(!/name=["'](?:preview_decision|owner_asset_plan_decision)["']/i.test(cockpit), "closed decision was reintroduced as input");
  requireCondition(!/name=["'](?:material_write_owner|acquisition_owner|voice_provider_owner|production_input_scope)["']/i.test(cockpit), "owner or scope input returned before goal reset");
  requireCondition(!/video\.currentTime\s*>\s*0\.05|enterButton|id=["']enterD3["']/i.test(cockpit), "playback gate returned");
  const archivedPreviewTag = cockpit.match(/<details\b[^>]*\bid=["']archivedPreview["'][^>]*>/i)?.[0] ?? "";
  requireCondition(archivedPreviewTag && !/\bopen\b/i.test(archivedPreviewTag), "archived preview must be closed by default");
  requireCondition(/<video\b[^>]*\bpreload=["']none["']/i.test(cockpit), "archived preview must not preload before the user opens it");
  requireCondition(/<video\b[^>]*\bmuted\b/i.test(cockpit), "preview must be muted in markup before playback");
  requireCondition(/video\.muted = true/.test(cockpit) && /video\.volume = 0/.test(cockpit), "preview must enforce muted zero-volume playback");
  requireCondition(/playButton\.addEventListener\("click", async \(\) => \{\s*enforceSilentMedia\(\);\s*try \{ await video\.play\(\)/.test(cockpit), "silence must be enforced before play");
  requireCondition(/video\.addEventListener\("seeking", enforceSilentMedia\)/.test(cockpit), "silence must be enforced before or during seek");
  requireCondition(/document\.addEventListener\("visibilitychange"[\s\S]*?document\.hidden\) video\.pause\(\)/.test(cockpit), "hidden or background playback must pause");
  requireCondition(/window\.addEventListener\("pagehide", pauseSilentMedia\)/.test(cockpit), "media must pause when the QA page ends");
  requireCondition(/archiveDetails\.addEventListener\("toggle"[\s\S]*?!archiveDetails\.open\) pauseSilentMedia\(\)/.test(cockpit), "closing the archived preview must pause media");

  const psLauncher = await text("scripts/operator/open_review.ps1");
  const shLauncher = await text("scripts/operator/open_review.sh");
  requireCondition(psLauncher.includes('"d3"') && psLauncher.includes("public\\cockpit\\d3-production-input.html"), "PowerShell D3 launcher");
  requireCondition(shLauncher.includes("public/cockpit/d3-production-input.html") && /artifacts\|d3/.test(shLauncher), "shell D3 launcher");

  return {
    passed: true,
    mission_id: "FFF-COCKPIT-D3-ENTRY-20260825-001",
    cockpit_path: COCKPIT_PATH,
    exact_artifact_id: "fff-private-previsualization-timeline-001",
    exact_mp4_sha256: EXPECTED.previewMp4,
    accepted_decisions_reasked: 0,
    critical_steps_removed: 2,
    next_stage: "PROJECT_GOAL_RESET",
    state_after_entry: "REFERENCE_ONLY_NO_HUMAN_ACTION",
    human_facing_copy: "FACT_STATE_ACTION",
    playback_required: false,
    pass_fail_required: false,
    d3_owner_scope_input_required_now: false,
    media_qa: {
      muted_before_play_or_seek: true,
      volume: 0,
      hidden_playback: false,
      pause_on_exit: true
    },
    board_write: false,
    generation: false
  };
}

async function main() {
  process.stdout.write(`${JSON.stringify(await validateD3Cockpit())}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
