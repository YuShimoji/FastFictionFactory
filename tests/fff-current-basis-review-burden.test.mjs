import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { validateCurrentBasis } from "../tools/fff-current-basis-review-burden.mjs";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_RESULT = path.join(REPO_ROOT, "docs/review/current-basis-review-burden-receipt.json");

async function withMutatedResult(mutator, run) {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "fff-current-basis-"));
  try {
    const result = JSON.parse(await readFile(SOURCE_RESULT, "utf8"));
    mutator(result);
    const resultPath = path.join(tempRoot, "result.json");
    await writeFile(resultPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    await run(resultPath);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

test("validates the exact current FFF review basis", async () => {
  const summary = await validateCurrentBasis();
  assert.equal(summary.passed, true);
  assert.equal(summary.current_human_questions, 1);
  assert.equal(summary.stale_questions_removed, 2);
  assert.equal(summary.critical_path_decision_steps_removed, 2);
  assert.equal(summary.next_reachable_stage, "PROJECT_GOAL_RESET");
  assert.equal(summary.next_decision, "project_goal_reset");
});

test("fails closed if the project-goal choice is replaced by a stale preview question", async () => {
  await withMutatedResult(
    (result) => {
      result.current_human_question.required_now = true;
      result.current_human_question.question = "accept or revise?";
    },
    async (resultPath) => {
      await assert.rejects(validateCurrentBasis(resultPath), /project goal question/);
    }
  );
});

test("fails closed if accepted asset-plan authority is rewritten", async () => {
  await withMutatedResult(
    (result) => {
      result.accepted_authority.recommended_asset_plan = "B";
    },
    async (resultPath) => {
      await assert.rejects(validateCurrentBasis(resultPath), /asset plan authority/);
    }
  );
});

test("fails closed if current routing reopens the asset-plan decision", async () => {
  await withMutatedResult(
    (result) => {
      result.current_routing.next_decision = "owner_asset_plan_decision";
    },
    async (resultPath) => {
      await assert.rejects(validateCurrentBasis(resultPath), /next decision routing/);
    }
  );
});

test("fails closed if unchanged preview playback becomes required again", async () => {
  await withMutatedResult(
    (result) => {
      result.current_routing.playback_required = true;
    },
    async (resultPath) => {
      await assert.rejects(validateCurrentBasis(resultPath), /playback must remain optional/);
    }
  );
});

test("fails closed if the exact review artifact hash drifts", async () => {
  await withMutatedResult(
    (result) => {
      result.exact_review_artifact.mp4_sha256 = "0".repeat(64);
    },
    async (resultPath) => {
      await assert.rejects(validateCurrentBasis(resultPath), /hash mismatch/);
    }
  );
});
