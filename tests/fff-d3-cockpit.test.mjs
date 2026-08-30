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

test("validates the optional-reference to project-goal-reset route", async () => {
  const result = await validateD3Cockpit();
  assert.equal(result.passed, true);
  assert.equal(result.accepted_decisions_reasked, 0);
  assert.equal(result.critical_steps_removed, 2);
  assert.equal(result.next_stage, "PROJECT_GOAL_RESET");
  assert.equal(result.state_after_entry, "REFERENCE_ONLY_NO_HUMAN_ACTION");
  assert.equal(result.human_facing_copy, "FACT_STATE_ACTION");
  assert.equal(result.playback_required, false);
  assert.equal(result.pass_fail_required, false);
  assert.equal(result.d3_owner_scope_input_required_now, false);
  assert.deepEqual(result.media_qa, {
    muted_before_play_or_seek: true,
    volume: 0,
    hidden_playback: false,
    pause_on_exit: true
  });
});

test("fails if the imperative slogan returns as the primary heading", async () => {
  await withMutatedCockpit(
    (html) => html.replace("Production-input contract（保留中）</h1>", "見る。確かめる。D3へ進む。</h1>"),
    async (cockpitPath) => assert.rejects(validateD3Cockpit({ cockpitPath }), /slop UI copy returned/)
  );
});

test("fails if the primary heading returns to the oversized display scale", async () => {
  await withMutatedCockpit(
    (html) => html.replace("clamp(32px, 4vw, 48px)", "clamp(42px, 6vw, 76px)"),
    async (cockpitPath) => assert.rejects(validateD3Cockpit({ cockpitPath }), /heading scale must remain bounded/)
  );
});

test("fails if preview acceptance is reintroduced as a form input", async () => {
  await withMutatedCockpit(
    (html) => html.replace("</main>", '<input name="preview_decision"></main>'),
    async (cockpitPath) => assert.rejects(validateD3Cockpit({ cockpitPath }), /closed decision was reintroduced/)
  );
});

test("fails if owner asset-plan is reintroduced as a form input", async () => {
  await withMutatedCockpit(
    (html) => html.replace("</main>", '<input name="owner_asset_plan_decision"></main>'),
    async (cockpitPath) => assert.rejects(validateD3Cockpit({ cockpitPath }), /closed decision was reintroduced/)
  );
});

test("fails if owner or scope input returns before goal reset", async () => {
  await withMutatedCockpit(
    (html) => html.replace("</main>", '<input name="material_write_owner"></main>'),
    async (cockpitPath) => assert.rejects(validateD3Cockpit({ cockpitPath }), /owner or scope input returned/)
  );
});

test("fails if playback becomes a gate again", async () => {
  await withMutatedCockpit(
    (html) => html.replace("</main>", '<button id="enterD3" disabled>continue</button></main>'),
    async (cockpitPath) => assert.rejects(validateD3Cockpit({ cockpitPath }), /playback gate returned/)
  );
});

test("fails if the archived preview is open or preloaded by default", async () => {
  await withMutatedCockpit(
    (html) => html.replace('id="archivedPreview" class="archived-preview"', 'id="archivedPreview" class="archived-preview" open'),
    async (cockpitPath) => assert.rejects(validateD3Cockpit({ cockpitPath }), /closed by default/)
  );
  await withMutatedCockpit(
    (html) => html.replace('preload="none"', 'preload="metadata"'),
    async (cockpitPath) => assert.rejects(validateD3Cockpit({ cockpitPath }), /must not preload/)
  );
});

test("fails if the preview loses its muted markup default", async () => {
  await withMutatedCockpit(
    (html) => html.replace(" controls muted playsinline", " controls playsinline"),
    async (cockpitPath) => assert.rejects(validateD3Cockpit({ cockpitPath }), /muted in markup/)
  );
});

test("fails if zero volume is not enforced", async () => {
  await withMutatedCockpit(
    (html) => html.replace("video.volume = 0", "video.volume = 1"),
    async (cockpitPath) => assert.rejects(validateD3Cockpit({ cockpitPath }), /zero-volume/)
  );
});

test("fails if hidden playback is not paused", async () => {
  await withMutatedCockpit(
    (html) => html.replaceAll("if (document.hidden) video.pause();", "if (document.hidden) refreshEntry();"),
    async (cockpitPath) => assert.rejects(validateD3Cockpit({ cockpitPath }), /background playback must pause/)
  );
});

test("fails if exit no longer pauses media", async () => {
  await withMutatedCockpit(
    (html) => html.replace('window.addEventListener("pagehide", pauseSilentMedia);', 'window.addEventListener("pagehide", enforceSilentMedia);'),
    async (cockpitPath) => assert.rejects(validateD3Cockpit({ cockpitPath }), /pause when the QA page ends/)
  );
});
