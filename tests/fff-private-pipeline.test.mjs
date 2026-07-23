import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { execFile as execFileCallback } from "node:child_process";
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  writeFile
} from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import test, { after } from "node:test";
import {
  DEFAULT_SOURCE_ROOT,
  STAGES,
  WATERMARK_TEXT,
  buildRun,
  dryRun,
  resumeRun,
  statusRun,
  verifyRunDirectory
} from "../tools/fff-private-pipeline.mjs";

const execFile = promisify(execFileCallback);
const explicitRoot = process.env.FFF_PRIVATE_PIPELINE_TEST_ROOT;
const testRoot = explicitRoot
  ? path.resolve(explicitRoot)
  : await mkdtemp(path.join(tmpdir(), "fff-private-pipeline-tests-"));
const preserveTestRoot = Boolean(explicitRoot);
const freshRunDir = path.join(testRoot, "fresh-run");
const resumeRunDir = path.join(testRoot, "resume-run");

async function sha256File(filePath) {
  return createHash("sha256").update(await readFile(filePath)).digest("hex");
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function cloneFreshRun(name) {
  const target = path.join(testRoot, "corruptions", name);
  await cp(freshRunDir, target, { recursive: true, force: false });
  return target;
}

async function expectFailure(name, mutate, expectedText) {
  const runDir = await cloneFreshRun(name);
  await mutate(runDir);
  const verification = await verifyRunDirectory({
    runDir,
    sourceRoot: DEFAULT_SOURCE_ROOT
  });
  assert.equal(verification.passed, false, `${name} should fail closed`);
  assert.match(
    verification.failures.join("\n"),
    expectedText,
    `${name} should report its named failure`
  );
  return {
    fixture: name,
    passed: true,
    detected_failures: verification.failures
  };
}

test(
  "resumable private pipeline acceptance",
  { timeout: 20 * 60 * 1000 },
  async (suite) => {
    await mkdir(testRoot, { recursive: true });

    await suite.test("CLI syntax and read-only dry-run", async () => {
      await execFile(process.execPath, ["--check", "tools/fff-private-pipeline.mjs"], {
        cwd: DEFAULT_SOURCE_ROOT,
        windowsHide: true
      });
      const help = await execFile(
        process.execPath,
        ["tools/fff-private-pipeline.mjs", "--help"],
        { cwd: DEFAULT_SOURCE_ROOT, windowsHide: true }
      );
      assert.match(help.stdout, /dry-run/);
      assert.match(help.stdout, /resume/);
      const proposed = path.join(testRoot, "dry-run-proposed");
      const plan = await dryRun({
        runDir: proposed,
        sourceRoot: DEFAULT_SOURCE_ROOT,
        runNearestValidators: true
      });
      assert.equal(plan.read_only, true);
      assert.equal(plan.exact_contract.beats, 6);
      assert.equal(plan.exact_contract.shots, 19);
      assert.equal(plan.exact_contract.duration_seconds, 180);
      assert.equal(plan.exact_contract.watermark, WATERMARK_TEXT);
      assert.equal(existsSync(proposed), false, "dry-run must not create its proposed run directory");
    });

    let freshVerification;
    await suite.test("fresh build and complete status", async () => {
      const built = await buildRun({
        runDir: freshRunDir,
        sourceRoot: DEFAULT_SOURCE_ROOT,
        runId: "fff-test-fresh",
        runNearestValidators: true
      });
      assert.equal(built.state, "complete");
      const readOnlyPaths = [
        "run-manifest.json",
        "run-receipt.json",
        "executed-commands.json",
        "output/private-previsualization-timeline.mp4"
      ];
      const beforeReadOnly = Object.fromEntries(
        await Promise.all(
          readOnlyPaths.map(async (relativePath) => [
            relativePath,
            await sha256File(path.join(freshRunDir, relativePath))
          ])
        )
      );
      const status = await statusRun({
        runDir: freshRunDir,
        sourceRoot: DEFAULT_SOURCE_ROOT
      });
      assert.equal(status.state, "complete");
      freshVerification = await verifyRunDirectory({
        runDir: freshRunDir,
        sourceRoot: DEFAULT_SOURCE_ROOT
      });
      assert.equal(freshVerification.passed, true, freshVerification.failures.join("\n"));
      assert.equal(freshVerification.output.audio_stream_count, 0);
      assert.ok(Math.abs(freshVerification.output.duration_seconds - 180) < 0.05);
      assert.equal(freshVerification.output.width, 960);
      assert.equal(freshVerification.output.height, 540);
      const afterReadOnly = Object.fromEntries(
        await Promise.all(
          readOnlyPaths.map(async (relativePath) => [
            relativePath,
            await sha256File(path.join(freshRunDir, relativePath))
          ])
        )
      );
      assert.deepEqual(
        afterReadOnly,
        beforeReadOnly,
        "status and verify must not mutate the completed run"
      );
    });

    let resumeEvidence;
    await suite.test("deterministic interruption and receipt-preserving resume", async () => {
      const partial = await buildRun({
        runDir: resumeRunDir,
        sourceRoot: DEFAULT_SOURCE_ROOT,
        runId: "fff-test-resume",
        stopAfter: "materialize-run-workspace",
        runNearestValidators: true
      });
      assert.equal(partial.state, "incomplete");
      const partialStatus = await statusRun({
        runDir: resumeRunDir,
        sourceRoot: DEFAULT_SOURCE_ROOT
      });
      assert.equal(partialStatus.state, "incomplete");
      assert.equal(partialStatus.next_stage, "encode-silent-private-mp4");

      const reusedStages = STAGES.slice(0, 4);
      const before = {};
      for (const stage of reusedStages) {
        const receiptPath = path.join(
          resumeRunDir,
          "receipts",
          `${String(stage.index).padStart(2, "0")}-${stage.name}.json`
        );
        before[stage.name] = await sha256File(receiptPath);
      }

      const resumed = await resumeRun({
        runDir: resumeRunDir,
        sourceRoot: DEFAULT_SOURCE_ROOT,
        runNearestValidators: true
      });
      assert.equal(resumed.state, "complete");
      const after = {};
      for (const stage of reusedStages) {
        const receiptPath = path.join(
          resumeRunDir,
          "receipts",
          `${String(stage.index).padStart(2, "0")}-${stage.name}.json`
        );
        after[stage.name] = await sha256File(receiptPath);
      }
      assert.deepEqual(after, before, "valid completed stage receipts must not be re-executed");

      const verification = await verifyRunDirectory({
        runDir: resumeRunDir,
        sourceRoot: DEFAULT_SOURCE_ROOT
      });
      assert.equal(verification.passed, true, verification.failures.join("\n"));
      const receipt = await readJson(path.join(resumeRunDir, "run-receipt.json"));
      assert.deepEqual(
        receipt.resume_events.at(-1).reused_stages,
        reusedStages.map((stage) => stage.name)
      );
      resumeEvidence = {
        stopped_after: "materialize-run-workspace",
        first_resumed_stage: "encode-silent-private-mp4",
        reused_stages: receipt.resume_events.at(-1).reused_stages,
        receipt_hashes_before: before,
        receipt_hashes_after: after,
        output_sha256: verification.output.sha256
      };
    });

    const failClosedEvidence = [];
    await suite.test("temporary copied corruption fixtures fail closed", async () => {
      failClosedEvidence.push(
        await expectFailure(
          "corrupted-source-fingerprint",
          async (runDir) => {
            const target = path.join(runDir, "source-fingerprints.json");
            const payload = await readJson(target);
            payload.source_identity_sha256 = "0".repeat(64);
            await writeJson(target, payload);
          },
          /CORRUPTED_SOURCE_FINGERPRINT/
        )
      );

      failClosedEvidence.push(
        await expectFailure(
          "missing-frame",
          async (runDir) => {
            await rm(path.join(runDir, "workspace", "frames", "shot-b03-02.jpg"));
          },
          /MISSING_FRAME|missing run-local frame/
        )
      );

      failClosedEvidence.push(
        await expectFailure(
          "altered-shot-timing",
          async (runDir) => {
            const target = path.join(runDir, "workspace", "timeline.json");
            const payload = await readJson(target);
            payload.shots[8].end_seconds += 1;
            payload.shots[8].duration_seconds += 1;
            await writeJson(target, payload);
          },
          /ALTERED_SHOT_TIMING|shot timing/
        )
      );

      failClosedEvidence.push(
        await expectFailure(
          "short-output",
          async (runDir) => {
            const output = path.join(
              runDir,
              "output",
              "private-previsualization-timeline.mp4"
            );
            await execFile(
              "ffmpeg",
              [
                "-hide_banner",
                "-loglevel",
                "error",
                "-y",
                "-f",
                "lavfi",
                "-i",
                "color=c=black:s=960x540:r=30",
                "-t",
                "179",
                "-an",
                "-c:v",
                "libx264",
                "-preset",
                "ultrafast",
                "-pix_fmt",
                "yuv420p",
                output
              ],
              { windowsHide: true, maxBuffer: 10 * 1024 * 1024 }
            );
          },
          /OUTPUT_DURATION_MISMATCH/
        )
      );

      failClosedEvidence.push(
        await expectFailure(
          "unexpected-audio",
          async (runDir) => {
            const output = path.join(
              runDir,
              "output",
              "private-previsualization-timeline.mp4"
            );
            const replacement = `${output}.${randomUUID()}.mp4`;
            await execFile(
              "ffmpeg",
              [
                "-hide_banner",
                "-loglevel",
                "error",
                "-y",
                "-i",
                output,
                "-f",
                "lavfi",
                "-i",
                "anullsrc=r=48000:cl=mono",
                "-map",
                "0:v:0",
                "-map",
                "1:a:0",
                "-t",
                "180",
                "-c:v",
                "copy",
                "-c:a",
                "aac",
                "-shortest",
                replacement
              ],
              { windowsHide: true, maxBuffer: 10 * 1024 * 1024 }
            );
            await rm(output);
            await rename(replacement, output);
          },
          /UNEXPECTED_AUDIO_STREAM/
        )
      );

      failClosedEvidence.push(
        await expectFailure(
          "missing-watermark",
          async (runDir) => {
            const target = path.join(runDir, "run-receipt.json");
            const payload = await readJson(target);
            payload.watermark.text = "";
            payload.watermark.renderer_marker_present = false;
            await writeJson(target, payload);
          },
          /MISSING_WATERMARK/
        )
      );

      failClosedEvidence.push(
        await expectFailure(
          "stale-stage-receipt",
          async (runDir) => {
            const target = path.join(
              runDir,
              "receipts",
              "03-resolve-canonical-timeline.json"
            );
            const payload = await readJson(target);
            payload.source_identity_sha256 = "f".repeat(64);
            await writeJson(target, payload);
          },
          /STALE_STAGE_RECEIPT/
        )
      );

      failClosedEvidence.push(
        await expectFailure(
          "output-hash-media-mismatch",
          async (runDir) => {
            const target = path.join(runDir, "run-receipt.json");
            const payload = await readJson(target);
            payload.output.sha256 = "1".repeat(64);
            await writeJson(target, payload);
          },
          /OUTPUT_HASH_MEDIA_MISMATCH/
        )
      );
    });

    await suite.test("status distinguishes stale and failed runs", async () => {
      const staleRun = await cloneFreshRun("status-stale");
      const staleReceiptPath = path.join(
        staleRun,
        "receipts",
        "03-resolve-canonical-timeline.json"
      );
      const staleReceipt = await readJson(staleReceiptPath);
      staleReceipt.source_identity_sha256 = "e".repeat(64);
      await writeJson(staleReceiptPath, staleReceipt);
      const staleStatus = await statusRun({
        runDir: staleRun,
        sourceRoot: DEFAULT_SOURCE_ROOT
      });
      assert.equal(staleStatus.state, "stale");
      assert.equal(staleStatus.stale_stage, "resolve-canonical-timeline");

      const failedRun = await cloneFreshRun("status-failed");
      const failedManifestPath = path.join(failedRun, "run-manifest.json");
      const failedManifest = await readJson(failedManifestPath);
      failedManifest.state = "failed";
      failedManifest.failure = {
        code: "TEST_FAILURE",
        message: "temporary copied status fixture"
      };
      await writeJson(failedManifestPath, failedManifest);
      const failedStatus = await statusRun({
        runDir: failedRun,
        sourceRoot: DEFAULT_SOURCE_ROOT
      });
      assert.equal(failedStatus.state, "failed");
      assert.equal(failedStatus.failure.code, "TEST_FAILURE");
    });

    const acceptedMp4 = path.join(
      DEFAULT_SOURCE_ROOT,
      "artifacts",
      "private-previsualization-timeline",
      "private-previsualization-timeline.mp4"
    );
    const acceptedMp4Sha256 = await sha256File(acceptedMp4);
    const evidence = {
      schemaVersion: "fff.privatePipelineAcceptanceEvidence.v1",
      test_root: testRoot,
      fresh_run_directory: freshRunDir,
      resume_run_directory: resumeRunDir,
      fresh_run: {
        passed: freshVerification.passed,
        output: freshVerification.output,
        accepted_preview_mp4_sha256: acceptedMp4Sha256,
        mp4_bytes_match_existing:
          freshVerification.output.sha256 === acceptedMp4Sha256
      },
      interruption_resume: resumeEvidence,
      fail_closed: {
        required_fixture_count: 8,
        passed_fixture_count: failClosedEvidence.length,
        fixtures: failClosedEvidence
      }
    };
    await writeJson(path.join(testRoot, "acceptance-evidence.json"), evidence);
    assert.equal(evidence.fail_closed.passed_fixture_count, 8);
    console.log(`FFF_PIPELINE_ACCEPTANCE_ROOT=${testRoot}`);
    console.log(`FFF_PIPELINE_FRESH_RUN=${freshRunDir}`);
    console.log(`FFF_PIPELINE_RESUME_RUN=${resumeRunDir}`);
  }
);

after(async () => {
  if (!preserveTestRoot) {
    await rm(testRoot, { recursive: true, force: true });
  }
});
