import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const DEFAULT_RESULT = "docs/review/current-basis-review-burden-receipt.json";

function fail(message) {
  throw new Error(`CURRENT_BASIS_INVALID: ${message}`);
}

function requireCondition(condition, message) {
  if (!condition) fail(message);
}

async function readBytes(repoRelativePath) {
  return readFile(path.isAbsolute(repoRelativePath) ? repoRelativePath : path.join(REPO_ROOT, repoRelativePath));
}

async function readJson(repoRelativePath) {
  return JSON.parse((await readBytes(repoRelativePath)).toString("utf8"));
}

async function sha256(repoRelativePath) {
  return createHash("sha256").update(await readBytes(repoRelativePath)).digest("hex");
}

function assertAncestor(commit) {
  try {
    execFileSync("git", ["merge-base", "--is-ancestor", commit, "HEAD"], {
      cwd: REPO_ROOT,
      stdio: "ignore"
    });
  } catch {
    fail(`commit is not an ancestor of HEAD: ${commit}`);
  }
}

async function assertHash(repoRelativePath, expected) {
  const actual = await sha256(repoRelativePath);
  requireCondition(actual === expected, `hash mismatch ${repoRelativePath}: ${actual}`);
}

export async function validateCurrentBasis(resultPath = DEFAULT_RESULT) {
  const result = await readJson(resultPath);

  requireCondition(result.schemaVersion === "fff.currentBasisReviewBurdenResult.v2", "schemaVersion");
  requireCondition(result.mission_id === "FFF-CURRENT-BASIS-REVIEW-BURDEN-20260825-001", "mission identity");
  requireCondition(result.artifact_id === "fff-current-basis-review-burden-001", "artifact identity");
  requireCondition(result.passed === true, "result must be passed");
  requireCondition(result.source.remote_seal_performed === false, "remote seal boundary");
  requireCondition(result.source.push_count === 0, "push boundary");
  requireCondition(result.exact_review_artifact.artifact_id === "fff-private-previsualization-timeline-001", "exact review artifact identity");
  requireCondition(result.exact_review_artifact.role === "accepted_default_private_preview", "accepted default role");
  requireCondition(result.successor_candidate.artifact_id === "fff-private-materialized-motion-previs-001", "successor identity");
  requireCondition(result.successor_candidate.accepted_default_replacement === false, "successor must remain isolated");

  const accepted = result.accepted_authority;
  requireCondition(accepted.private_preview_experience === "accept", "accepted preview authority");
  requireCondition(accepted.preview_material_defect === false, "preview material defect authority");
  requireCondition(accepted.existing_preview_repair_required === false, "preview repair authority");
  requireCondition(accepted.recommended_asset_plan === "A", "asset plan authority");
  requireCondition(Array.isArray(accepted.exception_requirement_ids) && accepted.exception_requirement_ids.length === 0, "asset-plan exceptions");
  requireCondition(accepted.new_human_gate_required_inside_mission === false, "human gate authority");

  requireCondition(result.current_human_question.required_now === true, "project goal choice must remain visible");
  requireCondition(result.current_human_question.question === "Which project goal should FastFictionFactory adopt next?", "project goal question");
  requireCondition(result.current_human_question.board_issue_status === "not_issued", "Board issue boundary");
  requireCondition(result.review_burden.stale_questions_removed === 2, "stale review count");
  requireCondition(result.review_burden.critical_path_decision_steps_removed === 2, "critical-path reduction count");
  requireCondition(result.review_burden.current_human_questions === 1, "current human decision count");
  requireCondition(result.review_burden.board_cards_issued === 0, "Board card count");
  requireCondition(JSON.stringify(result.current_routing.closed_decisions_skipped) === JSON.stringify(["private_preview_accept_revise", "owner_asset_plan_decision"]), "closed decision routing");
  requireCondition(result.current_routing.next_reachable_stage === "PROJECT_GOAL_RESET", "next reachable stage");
  requireCondition(result.current_routing.next_decision === "project_goal_reset", "next decision routing");
  requireCondition(result.current_routing.cockpit_entry_path === "public/cockpit/d3-production-input.html", "D3 cockpit entry path");
  requireCondition(result.current_routing.state_after_cockpit_entry === "REFERENCE_ONLY_NO_HUMAN_ACTION", "D3 cockpit state");
  requireCondition(result.current_routing.playback_required === false, "unchanged preview playback must remain optional");
  requireCondition(result.current_routing.pass_fail_required === false, "D3 must not request pass or fail");
  requireCondition(result.current_routing.owner_scope_input_required_now === false, "owner and scope input must wait for goal reset");
  requireCondition(result.current_routing.root_manifest_routing_superseded === true, "root routing supersession receipt");
  requireCondition(result.current_routing.root_manifest_historical_next_decision === "production_input_contract_authorization", "root historical routing receipt");
  requireCondition(result.current_routing.historical_handoff_pending_text_is_current === false, "historical handoff boundary");
  requireCondition(result.retired_or_non_applicable_contracts.some((item) => item.id === "clippipegen_decision_card_or_subtitle_owner_schema" && item.state === "not_applicable_to_fff"), "FFF route isolation");
  requireCondition(Object.values(result.boundaries).every((value) => value === false), "closed mutation boundaries");

  assertAncestor(result.source.fresh_read_head);
  assertAncestor(result.source.accepted_authority_commit);

  await assertHash(result.validation_inputs.root_manifest_path, result.validation_inputs.root_manifest_sha256);
  await assertHash(result.validation_inputs.preview_result_path, result.validation_inputs.preview_result_sha256);
  await assertHash(result.validation_inputs.readiness_result_path, result.validation_inputs.readiness_result_sha256);
  await assertHash(result.validation_inputs.integrated_result_path, result.validation_inputs.integrated_result_sha256);
  await assertHash(result.exact_review_artifact.html_path, result.exact_review_artifact.html_sha256);
  await assertHash(result.exact_review_artifact.mp4_path, result.exact_review_artifact.mp4_sha256);
  await assertHash(result.accepted_authority.container_path, result.accepted_authority.container_sha256);
  await assertHash(result.successor_candidate.result_path, result.successor_candidate.result_sha256);
  await assertHash(result.successor_candidate.mp4_path, result.successor_candidate.mp4_sha256);
  await assertHash(result.protected_dirty_state.path, result.protected_dirty_state.sha256);

  const rootManifest = await readJson(result.validation_inputs.root_manifest_path);
  const previewResult = await readJson(result.validation_inputs.preview_result_path);
  const readinessResult = await readJson(result.validation_inputs.readiness_result_path);
  const integratedResult = await readJson(result.validation_inputs.integrated_result_path);
  const acceptedContainer = await readJson(result.accepted_authority.container_path);
  const successorResult = await readJson(result.successor_candidate.result_path);
  const rootInstructions = (await readBytes("AGENTS.md")).toString("utf8");
  const currentHandoff = (await readBytes("docs/review/current-basis-review-burden.md")).toString("utf8");

  requireCondition(rootManifest.artifact_id === result.exact_review_artifact.artifact_id, "root manifest default identity");
  requireCondition(rootManifest.successor_candidate_artifact_id === result.successor_candidate.artifact_id, "root manifest successor identity");
  requireCondition(rootManifest.asset_rights_readiness_packet_owner_asset_plan_decision === accepted.recommended_asset_plan, "root manifest accepted asset-plan decision");
  requireCondition(JSON.stringify(rootManifest.asset_rights_readiness_packet_owner_asset_plan_exception_requirement_ids) === JSON.stringify(accepted.exception_requirement_ids), "root manifest accepted asset-plan exceptions");
  requireCondition(rootManifest.asset_rights_readiness_packet_owner_asset_plan_authority_path === result.accepted_authority.container_path, "root manifest accepted authority path");
  requireCondition(rootManifest.asset_rights_readiness_packet_next_decision === result.current_routing.root_manifest_historical_next_decision, "protected root manifest historical route");
  requireCondition(rootManifest.asset_rights_readiness_packet_next_decision !== "owner_asset_plan_decision", "root manifest must not reopen asset-plan decision");
  requireCondition(rootManifest.d3_cockpit_path === result.current_routing.cockpit_entry_path, "root manifest D3 cockpit path");
  requireCondition(rootManifest.d3_cockpit_validation_command === "node tools/fff-d3-cockpit.mjs", "root manifest D3 validation command");
  requireCondition(rootInstructions.includes("is the current handoff authority") && rootInstructions.includes("must not reopen either decision"), "root instruction routing");
  requireCondition(currentHandoff.includes("現行root / handoff authority") && currentHandoff.includes("プロジェクト目標の再設定") && currentHandoff.includes("project_goal_reset"), "current handoff routing");
  requireCondition(previewResult.passed === true && previewResult.failures.length === 0, "preview result health");
  requireCondition(previewResult.mp4.sha256 === result.exact_review_artifact.mp4_sha256, "preview result MP4 identity");
  requireCondition(previewResult.duration_seconds === 180 && previewResult.beat_count === 6 && previewResult.shot_count === 19 && previewResult.subtitle_cue_count === 20, "preview chronology");
  requireCondition(readinessResult.passed === true && readinessResult.next_human_decision === "owner_asset_plan_decision", "readiness source contract");
  requireCondition(integratedResult.passed === true, "integrated source health");
  requireCondition(successorResult.passed === true && successorResult.source_artifact_id === result.exact_review_artifact.artifact_id, "successor source and health");

  const actualAccepted = acceptedContainer.accepted_human_decisions;
  requireCondition(actualAccepted.private_preview_experience === accepted.private_preview_experience, "accepted preview readback drift");
  requireCondition(actualAccepted.preview_material_defect === accepted.preview_material_defect, "accepted defect readback drift");
  requireCondition(actualAccepted.existing_preview_repair_required === accepted.existing_preview_repair_required, "accepted repair readback drift");
  requireCondition(actualAccepted.recommended_asset_plan === accepted.recommended_asset_plan, "accepted plan readback drift");
  requireCondition(JSON.stringify(actualAccepted.exception_requirement_ids) === JSON.stringify(accepted.exception_requirement_ids), "accepted exception readback drift");
  requireCondition(actualAccepted.new_human_gate_required_inside_mission === accepted.new_human_gate_required_inside_mission, "accepted human-gate readback drift");

  return {
    passed: true,
    mission_id: result.mission_id,
    artifact_id: result.artifact_id,
    exact_review_artifact_id: result.exact_review_artifact.artifact_id,
    accepted_authority_reused: true,
    critical_path_decision_steps_removed: result.review_burden.critical_path_decision_steps_removed,
    stale_questions_removed: result.review_burden.stale_questions_removed,
    current_human_questions: result.review_burden.current_human_questions,
    next_reachable_stage: result.current_routing.next_reachable_stage,
    next_decision: result.current_routing.next_decision,
    board_cards_issued: result.review_burden.board_cards_issued,
    protected_dirty_state_preserved: true
  };
}

async function main() {
  const resultPath = process.argv[2] || DEFAULT_RESULT;
  const summary = await validateCurrentBasis(resultPath);
  process.stdout.write(`${JSON.stringify(summary)}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
