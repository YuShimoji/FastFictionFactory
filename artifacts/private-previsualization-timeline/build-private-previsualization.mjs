#!/usr/bin/env node

import { runPrivatePrevisualizationTimelineCommand } from "../../tools/fff-private-previsualization-timeline.mjs";

const command = process.argv[2] || "build";
const mapped = command === "validate"
  ? "validate-private-previsualization-timeline"
  : "smoke-private-previsualization-timeline";

await runPrivatePrevisualizationTimelineCommand({
  command: mapped,
  inputPath: process.argv[3],
  outputPath: null
});
