import assert from "node:assert/strict";
import { execFile as execFileCallback } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const execFile = promisify(execFileCallback);
const repoRoot = path.resolve(import.meta.dirname, "..");
const readinessModelPath = path.join(
  repoRoot,
  "artifacts",
  "asset-rights-readiness-packet",
  "asset-rights-readiness.json"
);

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function identity(filePath) {
  const [bytes, info] = await Promise.all([readFile(filePath), stat(filePath)]);
  return {
    byte_size: info.size,
    sha256: createHash("sha256").update(bytes).digest("hex")
  };
}

test("readiness predecessor integrity remains exact when successor results exist", async () => {
  const model = await readJson(readinessModelPath);
  const baselineFiles = model.integrity?.historical_results?.files;
  assert.ok(Array.isArray(baselineFiles));
  assert.equal(baselineFiles.length, 76);

  for (const expected of baselineFiles) {
    const actual = await identity(path.join(repoRoot, expected.relative_path));
    assert.deepEqual(actual, {
      byte_size: expected.byte_size,
      sha256: expected.sha256
    }, expected.relative_path);
  }

  const baselinePaths = new Set(baselineFiles.map((file) => file.relative_path));
  const currentResultPaths = (await readdir(path.join(repoRoot, "artifacts"), { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith("-result.json"))
    .map((entry) => `artifacts/${entry.name}`);
  const successorResults = currentResultPaths.filter((filePath) => !baselinePaths.has(filePath));
  assert.ok(
    successorResults.includes("artifacts/densou-s01e01-benchmark-video-slice-result.json"),
    "expected a legitimate successor result outside the stored predecessor baseline"
  );

  const validation = await execFile(
    process.execPath,
    [
      "tools/fff-state.mjs",
      "validate-integrated-visual-production-package",
      "artifacts/integrated-visual-production-package-result.json"
    ],
    { cwd: repoRoot, windowsHide: true }
  );
  assert.match(validation.stdout, /preserved validation passed/);
});
