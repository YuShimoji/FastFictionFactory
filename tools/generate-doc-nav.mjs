#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const excludedDirs = new Set([
  ".git",
  ".serena",
  "node_modules",
  "dist",
  "build",
  ".venv",
  "venv",
  "__pycache__",
]);
const excludedSourcePrefixes = ["docs/local-view/"];

const categories = [
  "Overview",
  "Specs",
  "Runtime State",
  "Development Notes",
  "Artifacts",
  "Misc",
];
const preferredOrder = new Map([
  ["index.md", 10],
  ["project-overview.md", 20],
  ["local-view/agents.md", 30],
  ["project-context.md", 40],
  ["product-brief.md", 110],
  ["workflow.md", 120],
  ["data-model.md", 130],
  ["qa-gates.md", 140],
  ["review/current-status.md", 210],
  ["decision-log.md", 220],
  ["idea-ledger.md", 230],
  ["local-view/artifacts.md", 410],
  ["local-view/sample-story-memo.md", 420],
]);

const titleOverrides = new Map([
  ["docs/index.md", "Local Docs View"],
  ["docs/project-overview.md", "Project Overview Map"],
  ["AGENTS.md", "Repo Instructions"],
  ["docs/review/current-status.md", "Current Status Packet"],
  ["artifacts/ARTIFACTS.md", "Artifact Inventory"],
]);

function toPosixPath(filePath) {
  return filePath.split(path.sep).join("/");
}

function titleFromPath(relativePath, heading) {
  if (titleOverrides.has(relativePath)) {
    return titleOverrides.get(relativePath);
  }

  if (heading) {
    return heading.replace(/^#+\s+/, "").trim();
  }

  const baseName = path.basename(relativePath, ".md");
  return baseName
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function classify(relativePath) {
  if (
    relativePath === "docs/index.md" ||
    relativePath === "docs/project-overview.md" ||
    relativePath === "AGENTS.md" ||
    relativePath === "docs/project-context.md"
  ) {
    return "Overview";
  }

  if (relativePath.startsWith("artifacts/")) {
    return "Artifacts";
  }

  if (
    relativePath === "docs/product-brief.md" ||
    relativePath === "docs/workflow.md" ||
    relativePath === "docs/data-model.md" ||
    relativePath === "docs/qa-gates.md"
  ) {
    return "Specs";
  }

  if (
    relativePath === "docs/review/current-status.md" ||
    relativePath === "docs/decision-log.md" ||
    relativePath === "docs/idea-ledger.md"
  ) {
    return "Runtime State";
  }

  if (relativePath.startsWith("docs/review/")) {
    return "Development Notes";
  }

  return "Misc";
}

function navPathFor(relativePath) {
  if (relativePath === "AGENTS.md") {
    return "local-view/agents.md";
  }

  if (relativePath === "artifacts/ARTIFACTS.md") {
    return "local-view/artifacts.md";
  }

  if (relativePath === "artifacts/sample-story-memo.md") {
    return "local-view/sample-story-memo.md";
  }

  if (relativePath.startsWith("docs/")) {
    return relativePath.slice("docs/".length);
  }

  return relativePath;
}

async function collectMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (excludedDirs.has(entry.name)) {
        continue;
      }
      files.push(...(await collectMarkdownFiles(path.join(dir, entry.name))));
      continue;
    }

    if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== ".md") {
      continue;
    }

    files.push(path.join(dir, entry.name));
  }

  return files;
}

async function firstHeading(filePath) {
  const text = await fs.readFile(filePath, "utf8");
  const lines = text.split(/\r?\n/).slice(0, 40);
  return lines.find((line) => /^#\s+/.test(line)) ?? "";
}

function renderNav(grouped) {
  const lines = [
    "# Generated MkDocs nav candidate.",
    "# Review before copying into mkdocs.yml; classifications are heuristic.",
    "# Paths are valid for mkdocs.yml with docs_dir: docs.",
    "# Root and artifact Markdown files use local-view wrapper pages.",
    "nav:",
  ];

  for (const category of categories) {
    const docs = grouped.get(category) ?? [];
    if (docs.length === 0) {
      continue;
    }

    lines.push(`  - ${category}:`);

    for (const doc of docs) {
      lines.push(`      - ${doc.title}: ${doc.path}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

function parseOutputPath(argv) {
  const outIndex = argv.indexOf("--out");
  if (outIndex === -1) {
    return "";
  }

  const outputPath = argv[outIndex + 1];
  if (!outputPath) {
    throw new Error("Missing path after --out.");
  }

  return path.resolve(repoRoot, outputPath);
}

async function main() {
  const files = await collectMarkdownFiles(repoRoot);
  const grouped = new Map(categories.map((category) => [category, []]));

  for (const file of files) {
    const relativePath = toPosixPath(path.relative(repoRoot, file));
    if (excludedSourcePrefixes.some((prefix) => relativePath.startsWith(prefix))) {
      continue;
    }

    const heading = await firstHeading(file);
    const category = classify(relativePath);
    grouped.get(category).push({
      path: navPathFor(relativePath),
      title: titleFromPath(relativePath, heading),
    });
  }

  for (const docs of grouped.values()) {
    docs.sort((a, b) => {
      const orderDelta = (preferredOrder.get(a.path) ?? 1000) - (preferredOrder.get(b.path) ?? 1000);
      if (orderDelta !== 0) {
        return orderDelta;
      }
      return a.path.localeCompare(b.path, "en");
    });
  }

  const output = renderNav(grouped);
  const outputPath = parseOutputPath(process.argv.slice(2));

  if (!outputPath) {
    process.stdout.write(output);
    return;
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, output, "utf8");
  console.log(`Wrote nav candidate to ${path.relative(repoRoot, outputPath)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
