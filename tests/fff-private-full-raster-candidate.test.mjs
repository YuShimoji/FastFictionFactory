import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  contractFailures,
  runPrivateFullRasterCandidateCommand,
  targetedTests
} from "../tools/fff-private-full-raster-candidate.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const modelPath = path.join(repoRoot, "artifacts", "private-full-raster-candidate", "private-full-raster-candidate.json");
const resultPath = path.join(repoRoot, "artifacts", "private-full-raster-candidate-result.json");

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

test("complete candidate satisfies the focused contract", async () => {
  const model = await readJson(modelPath);
  assert.deepEqual(contractFailures(model), []);
  assert.equal(model.shots.length, 19);
  assert.equal(model.timeline_tracks.subtitles.length, 20);
  assert.equal(model.timeline_tracks.narration_text.length, 6);
});

test("negative mutation matrix passes all eight cases", async () => {
  const model = await readJson(modelPath);
  const result = targetedTests(model);
  assert.equal(result.total, 8);
  assert.equal(result.passed, 8);
  assert.equal(result.all_passed, true);
});

test("generation budget and calibration evidence remain bounded", async () => {
  const result = await readJson(resultPath);
  assert.equal(result.generation_evidence.call_count, 11);
  assert.equal(result.generation_evidence.accepted_count, 11);
  assert.equal(result.generation_evidence.rejected_count, 0);
  assert.equal(result.calibration.passed_count, 4);
  assert.equal(result.generation_evidence.api_equivalent_planning_cost_usd, 2.75);
  assert.equal(result.generation_evidence.actual_monetary_cost_usd, null);
});

test("read-only package validator passes", async () => {
  const outcome = await runPrivateFullRasterCandidateCommand({
    command: "validate-private-full-raster-candidate",
    inputPath: resultPath
  });
  assert.equal(outcome.passed, true);
});
