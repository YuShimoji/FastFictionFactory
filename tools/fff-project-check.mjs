#!/usr/bin/env node

import { readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(repoRoot);
const fullManifestCheck = process.argv.includes("--manifest");

const failures = [];
const checkedFiles = [];

function checkFile(path, { maxBytes, includes = [], maxLines } = {}) {
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch (error) {
    failures.push(`${path}: missing or unreadable (${error.message})`);
    return "";
  }

  checkedFiles.push(path);
  const size = statSync(path).size;
  const lines = text.split(/\r?\n/).length;
  if (maxBytes && size > maxBytes) {
    failures.push(`${path}: ${size} bytes exceeds the ${maxBytes}-byte control-plane budget`);
  }
  if (maxLines && lines > maxLines) {
    failures.push(`${path}: ${lines} lines exceeds the ${maxLines}-line control-plane budget`);
  }
  for (const marker of includes) {
    if (!text.includes(marker)) failures.push(`${path}: missing required marker ${JSON.stringify(marker)}`);
  }
  return text;
}

function run(label, command, args) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
    shell: false,
  });
  if (result.error || result.status !== 0) {
    failures.push(label + ": failed" + (result.error ? " (" + result.error.message + ")" : " with exit " + result.status));
    if (result.stdout) process.stderr.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
  } else {
    console.log("PASS " + label);
  }
}

function capture(command, args) {
  return spawnSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
    shell: false,
  });
}

const initialTrackedDiff = capture("git", ["diff", "--binary", "--no-ext-diff", "HEAD"]);
const initialStatus = capture("git", ["status", "--porcelain=v1", "--untracked-files=all"]);

const manifestText = checkFile("artifacts/artifact-manifest.json");
let manifest = {};
try {
  manifest = JSON.parse(manifestText);
} catch (error) {
  failures.push(`artifacts/artifact-manifest.json: invalid JSON (${error.message})`);
}

const readme = checkFile("README.md", {
  maxBytes: 12000,
  includes: ["docs/review/current-status.md", "docs/workflow.md", "public/review/index.html"],
});
const context = checkFile("docs/project-context.md", { maxBytes: 12000, maxLines: 180 });
const workflow = checkFile("docs/workflow.md", {
  maxBytes: 20000,
  maxLines: 320,
  includes: ["Outcome Packet", "方向確認", "停止条件", "README.md"],
});
const status = checkFile("docs/review/current-status.md", {
  maxBytes: 20000,
  maxLines: 260,
  includes: ["Last updated", "Remote baseline", "branch parity", "npm run check"],
});
const ledger = checkFile("docs/idea-ledger.md", { maxBytes: 16000, maxLines: 220 });
checkFile("docs/review/next-terminal-handoff.md", {
  maxBytes: 10000,
  maxLines: 100,
  includes: ["current-status.md", "../workflow.md", "npm run check"],
});
checkFile("docs/project-overview.md", { maxBytes: 16000, maxLines: 220 });
checkFile("docs/decision-log.md");
checkFile("docs/qa-gates.md");

if (manifest.artifact_id) {
  for (const [path, text] of [["docs/review/current-status.md", status]]) {
    if (!text.includes(manifest.artifact_id)) {
      failures.push(`${path}: active artifact does not match manifest (${manifest.artifact_id})`);
    }
  }
}
if (/Implemented in|State: Implemented/.test(ledger)) {
  failures.push("docs/idea-ledger.md: completed history belongs in docs/decision-log.md, not the active ledger");
}
if (!context.includes("final canon") || !workflow.includes("final canon")) {
  failures.push("project context/workflow: human canon authority boundary is missing");
}

const changedResult = capture("git", ["diff", "--name-only", "HEAD"]);
const untrackedResult = capture("git", ["ls-files", "--others", "--exclude-standard"]);
if (changedResult.error || changedResult.status !== 0 || untrackedResult.error || untrackedResult.status !== 0) {
  failures.push("git diff inventory: could not inspect changed paths");
} else {
  let changedPaths = [
    ...changedResult.stdout.split(/\r?\n/),
    ...untrackedResult.stdout.split(/\r?\n/),
  ].filter(Boolean);
  if (changedPaths.length === 0) {
    const baseRef = process.env.FFF_BASE_REF || "HEAD^";
    const committedChangeResult = capture("git", ["diff", "--name-only", baseRef + "..HEAD"]);
    if (!committedChangeResult.error && committedChangeResult.status === 0) {
      changedPaths = committedChangeResult.stdout.split(/\r?\n/).filter(Boolean);
    }
  }
  const productChanged = changedPaths.some((path) =>
    path === "artifacts/artifact-manifest.json" ||
    path === "artifacts/current-project-state.json" ||
    path === "docs/data-model.md" ||
    path === "docs/product-brief.md" ||
    path === "docs/project-context.md" ||
    path === "docs/qa-gates.md" ||
    path === "package.json" ||
    path.startsWith("public/") ||
    path.startsWith("scripts/") ||
    path.startsWith("tools/")
  );
  if (productChanged && !changedPaths.includes("docs/review/current-status.md")) {
    failures.push("live status freshness: product/tooling changed without docs/review/current-status.md");
  }
}

const html = checkFile("public/review/index.html");
const inlineScripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)];
if (inlineScripts.length === 0) {
  failures.push("public/review/index.html: no inline script found");
} else {
  for (const [index, match] of inlineScripts.entries()) {
    try {
      Function(match[1]);
    } catch (error) {
      failures.push(`public/review/index.html: inline script ${index + 1} does not compile (${error.message})`);
    }
  }
}

run("state tool syntax", process.execPath, ["--check", "tools/fff-state.mjs"]);
run("local extractor syntax", process.execPath, ["--check", "tools/fff-extract-local.mjs"]);
run("source-span pack tool syntax", process.execPath, ["--check", "tools/fff-source-span-review-pack.mjs"]);
run("current state validation", process.execPath, ["tools/fff-state.mjs", "validate", "artifacts/current-project-state.json"]);
run("sample state validation", process.execPath, ["tools/fff-state.mjs", "validate", "artifacts/sample-project-state.json"]);
run("sample extraction validation", process.execPath, ["tools/fff-state.mjs", "validate-extraction", "artifacts/sample-extraction-payload.json"]);
run("extraction fixture validation", process.execPath, ["tools/fff-state.mjs", "validate-extraction-fixtures", "artifacts/extraction-negative-fixtures"]);

if (!Array.isArray(manifest.read_only_validation_registry) || manifest.read_only_validation_registry.length < 30) {
  failures.push("artifact manifest: read_only_validation_registry must contain the full validation chain");
} else {
  const selectedRegistry = fullManifestCheck
    ? manifest.read_only_validation_registry
    : manifest.read_only_validation_registry.filter((entry) =>
        ["validate-review-workbench-component-contract", "validate-contradictory-claim-guard"].includes(entry?.command)
      );
  for (const entry of selectedRegistry) {
    if (!entry?.command || !entry?.input_path) {
      failures.push("artifact manifest: invalid read-only validation registry entry");
      continue;
    }
    run("registry " + entry.command, process.execPath, [
      "tools/fff-state.mjs",
      entry.command,
      entry.input_path,
    ]);
  }
}

run("whitespace check", "git", ["diff", "--check"]);

const finalTrackedDiff = capture("git", ["diff", "--binary", "--no-ext-diff", "HEAD"]);
const finalStatus = capture("git", ["status", "--porcelain=v1", "--untracked-files=all"]);
if (
  initialTrackedDiff.error ||
  finalTrackedDiff.error ||
  initialStatus.error ||
  finalStatus.error ||
  initialTrackedDiff.status !== 0 ||
  finalTrackedDiff.status !== 0 ||
  initialStatus.status !== 0 ||
  finalStatus.status !== 0
) {
  failures.push("non-destructive check: could not compare the worktree before and after validation");
} else if (initialTrackedDiff.stdout !== finalTrackedDiff.stdout || initialStatus.stdout !== finalStatus.stdout) {
  failures.push("non-destructive check: validation changed the worktree; use an explicit artifact refresh command instead");
}

if (failures.length) {
  console.error("\nFast Fiction Factory project check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  "\nFast Fiction Factory " +
    (fullManifestCheck ? "full manifest" : "fast") +
    " check passed (" +
    checkedFiles.length +
    " files, " +
    inlineScripts.length +
    " inline script block)."
);
