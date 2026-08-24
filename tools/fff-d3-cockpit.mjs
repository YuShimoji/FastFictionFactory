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

  requireCondition(await sha256(PREVIEW_HTML) === EXPECTED.previewHtml, "exact preview HTML hash");
  requireCondition(await sha256(PREVIEW_MP4) === EXPECTED.previewMp4, "exact preview MP4 hash");
  requireCondition(await sha256(ACCEPTED_AUTHORITY) === EXPECTED.acceptedAuthority, "accepted authority hash");
  requireCondition(authority.accepted_human_decisions?.private_preview_experience === "accept", "accepted preview decision");
  requireCondition(authority.accepted_human_decisions?.existing_preview_repair_required === false, "accepted repair decision");
  requireCondition(authority.accepted_human_decisions?.recommended_asset_plan === "A", "accepted asset plan");
  requireCondition(authority.accepted_human_decisions?.exception_requirement_ids?.length === 0, "accepted exceptions");
  requireCondition(root.asset_rights_readiness_packet_owner_asset_plan_decision === "A", "root plan routing");
  requireCondition(root.asset_rights_readiness_packet_next_decision === "production_input_contract_authorization", "root D3 routing");

  const requiredMarkup = [
    'data-fff-cockpit="d3-production-input"',
    'id="previewVideo"',
    "private-previsualization-timeline.mp4",
    EXPECTED.previewMp4,
    'data-accepted-decision="preview"',
    'data-accepted-decision="asset-plan"',
    'id="enterD3"',
    'id="d3-preflight"',
    'data-testid="d3-state"',
    'name="material_write_owner"',
    'name="acquisition_owner"',
    'name="voice_provider_owner"',
    'name="production_input_scope"',
    "OWNER_SCOPE_REQUIRED",
    "Production-input contract"
  ];
  for (const marker of requiredMarkup) requireCondition(cockpit.includes(marker), `missing marker ${marker}`);
  requireCondition(!/name=["'](?:preview_decision|owner_asset_plan_decision)["']/i.test(cockpit), "closed decision was reintroduced as input");
  requireCondition(/video\.currentTime > 0\.05/.test(cockpit) && /enterButton\.disabled = false/.test(cockpit), "actual playback must unlock D3");

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
    next_stage: "D3_PRODUCTION_INPUT_CONTRACT",
    state_after_entry: "OWNER_SCOPE_REQUIRED",
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
