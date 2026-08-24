import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { validateD3Cockpit } from "../tools/fff-d3-cockpit.mjs";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_HTML = path.join(REPO_ROOT, "public/cockpit/d3-production-input.html");

async function withMutatedCockpit(mutator, run) {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "fff-d3-cockpit-"));
  try {
    const html = mutator(await readFile(SOURCE_HTML, "utf8"));
    const target = path.join(tempRoot, "d3.html");
    await writeFile(target, html, "utf8");
    await run(target);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

test("validates the actual-artifact to D3 cockpit route", async () => {
  const result = await validateD3Cockpit();
  assert.equal(result.passed, true);
  assert.equal(result.accepted_decisions_reasked, 0);
  assert.equal(result.critical_steps_removed, 2);
  assert.equal(result.next_stage, "D3_PRODUCTION_INPUT_CONTRACT");
  assert.equal(result.state_after_entry, "OWNER_SCOPE_REQUIRED");
});

test("fails if preview acceptance is reintroduced as a form input", async () => {
  await withMutatedCockpit(
    (html) => html.replace("</form>", '<input name="preview_decision"></form>'),
    async (cockpitPath) => assert.rejects(validateD3Cockpit({ cockpitPath }), /closed decision was reintroduced/)
  );
});

test("fails if owner asset-plan is reintroduced as a form input", async () => {
  await withMutatedCockpit(
    (html) => html.replace("</form>", '<input name="owner_asset_plan_decision"></form>'),
    async (cockpitPath) => assert.rejects(validateD3Cockpit({ cockpitPath }), /closed decision was reintroduced/)
  );
});

test("fails if playback no longer unlocks D3", async () => {
  await withMutatedCockpit(
    (html) => html.replace("video.currentTime > 0.05", "video.currentTime > 999"),
    async (cockpitPath) => assert.rejects(validateD3Cockpit({ cockpitPath }), /actual playback must unlock D3/)
  );
});
