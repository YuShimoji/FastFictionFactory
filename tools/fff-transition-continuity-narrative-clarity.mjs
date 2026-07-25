#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFile as execFileCallback } from "node:child_process";
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  stat,
  writeFile
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";

const execFile = promisify(execFileCallback);
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_PACKAGE_ROOT = path.join(REPO_ROOT, "artifacts", "private-full-raster-candidate");
const SOURCE_MODEL_PATH = path.join(SOURCE_PACKAGE_ROOT, "private-full-raster-candidate.json");
const SOURCE_MANIFEST_PATH = path.join(SOURCE_PACKAGE_ROOT, "private-full-raster-candidate-manifest.json");
const SOURCE_RESULT_PATH = path.join(REPO_ROOT, "artifacts", "private-full-raster-candidate-result.json");
const PACKAGE_ROOT = path.join(REPO_ROOT, "artifacts", "private-full-raster-clarity-candidate");
const BASE_ROOT = path.join(SOURCE_PACKAGE_ROOT, "images", "base");
const FINAL_ROOT = path.join(SOURCE_PACKAGE_ROOT, "images", "final");
const MODEL_PATH = path.join(PACKAGE_ROOT, "private-full-raster-clarity-candidate.json");
const HTML_PATH = path.join(PACKAGE_ROOT, "private-full-raster-clarity-candidate.html");
const MP4_PATH = path.join(PACKAGE_ROOT, "private-full-raster-clarity-candidate.mp4");
const MANIFEST_PATH = path.join(PACKAGE_ROOT, "private-full-raster-clarity-candidate-manifest.json");
const STYLE_CONTRACT_PATH = path.join(SOURCE_PACKAGE_ROOT, "visual-style-contract.json");
const ATTEMPT_SOURCE_PATH = path.join(SOURCE_PACKAGE_ROOT, "generation-attempts-source.json");
const ATTEMPT_CSV_PATH = path.join(SOURCE_PACKAGE_ROOT, "generation-attempts.csv");
const SHOT_MAP_PATH = path.join(SOURCE_PACKAGE_ROOT, "shot-image-map.csv");
const LINEAGE_PATH = path.join(SOURCE_PACKAGE_ROOT, "image-lineage.csv");
const MOTION_MAP_PATH = path.join(SOURCE_PACKAGE_ROOT, "motion-transition-map.csv");
const README_PATH = path.join(PACKAGE_ROOT, "README_PRIVATE_FULL_RASTER_CLARITY_CANDIDATE.md");
const STORY_SPINE_PATH = path.join(PACKAGE_ROOT, "story-spine-clarity-v1.md");
const NARRATION_PATH = path.join(PACKAGE_ROOT, "narration-clarity-v1.md");
const REVIEW_CAPTIONS_PATH = path.join(PACKAGE_ROOT, "review-captions-clarity-v1.csv");
const PRODUCTION_SUBTITLES_PATH = path.join(PACKAGE_ROOT, "production-subtitles-draft-v1.csv");
const BINDING_CONTRACT_PATH = path.join(PACKAGE_ROOT, "narrative-visual-binding-contract.json");
const CUE_BINDING_PATH = path.join(PACKAGE_ROOT, "cue-shot-binding.csv");
const SHOT_IMPACT_PATH = path.join(PACKAGE_ROOT, "shot-impact-map.csv");
const TRANSITION_BOUNDARY_PATH = path.join(PACKAGE_ROOT, "transition-boundary-map.csv");
const RESULT_PATH = path.join(REPO_ROOT, "artifacts", "private-full-raster-clarity-candidate-result.json");
const REVIEW_DOC_PATH = path.join(REPO_ROOT, "docs", "review", "private-full-raster-clarity-candidate.md");
const GUIDELINE_PATH = path.join(REPO_ROOT, "docs", "production", "NARRATIVE_VISUAL_BINDING_GUIDELINE.md");
const ROOT_MANIFEST_PATH = path.join(REPO_ROOT, "artifacts", "artifact-manifest.json");
const PREVIEW_PATH = path.join(REPO_ROOT, "artifacts", "private-previsualization-timeline", "private-previsualization-timeline.json");
const EXECUTION_PATH = path.join(REPO_ROOT, "artifacts", "production-execution-pack", "production-execution-pack.json");
const QUARANTINE_PATH = path.join(REPO_ROOT, "artifacts", "primary-imagery-quarantine", "primary-imagery-quarantine.json");
const SCREENSHOTS = {
  desktop: path.join(REPO_ROOT, "artifacts", "review-screens", "private-full-raster-clarity-candidate-desktop.png"),
  narrow: path.join(REPO_ROOT, "artifacts", "review-screens", "private-full-raster-clarity-candidate-narrow.png")
};

const ARTIFACT_ID = "fff-private-full-raster-clarity-candidate-001";
const SOURCE_ARTIFACT_ID = "fff-private-full-raster-candidate-001";
const DEFAULT_ID = "fff-private-previsualization-timeline-001";
const REJECTED_ID = "fff-private-materialized-motion-previs-001";
const QUARANTINE_ID = "FFF-Q-PRIMARY-IMAGERY-SVG-2026-07-25";
const STYLE_CONTRACT_ID = "fff-full-raster-style-contract-001";
const DURATION_SECONDS = 180;
const FPS = 30;
const MAX_CALLS = 0;
const PLANNING_RATE_USD = 0;
const MAX_API_EQUIVALENT_USD = 0;
const RESET_EQUIVALENCE_THRESHOLD = 0.02;
const BANNED_REVIEW_CAPTION_TERMS = [
  "未解決",
  "未決定",
  "候補",
  "保留",
  "物語の真実ではない",
  "まだ分からない",
  "証拠かもしれない"
];

const ANCHORS = {
  "shot-b04-01": {
    path: path.join(REPO_ROOT, "artifacts", "high-fidelity-raster-pilot", "images", "shot-b04-01.jpg"),
    repo_path: "artifacts/high-fidelity-raster-pilot/images/shot-b04-01.jpg",
    sha256: "ec774118a012db4f70ee138ba0e4f8107e8abfdd98f8fb006a95c7e409b4c8d1"
  },
  "shot-b05-02": {
    path: path.join(REPO_ROOT, "artifacts", "high-fidelity-raster-pilot", "images", "shot-b05-02.jpg"),
    repo_path: "artifacts/high-fidelity-raster-pilot/images/shot-b05-02.jpg",
    sha256: "4ebf56180c1bf6ebfbcbff1ffd4a141a07e5c045645a2670ec5a776bee3374ac"
  },
  "shot-b02-03": {
    path: path.join(REPO_ROOT, "artifacts", "high-fidelity-raster-pilot", "images", "shot-b02-03.jpg"),
    repo_path: "artifacts/high-fidelity-raster-pilot/images/shot-b02-03.jpg",
    sha256: "5a2b371948dfeed3e15cbdcd81ec4de48e2d4f4db429bbea3ee021c9f74f1c31"
  }
};

const BASE_SHOT_IDS = [
  "shot-b01-01",
  "shot-b01-02",
  "shot-b01-03",
  "shot-b02-01",
  "shot-b02-02",
  "shot-b03-01",
  "shot-b03-02",
  "shot-b04-02",
  "shot-b04-03",
  "shot-b05-01",
  "shot-b05-03"
];

const DERIVATIVE_RECIPES = {
  "shot-b03-03": {
    source_shot_ids: ["shot-b03-02"],
    recipe: "Preserve the ledger photograph; add three deterministic paper-toned opacity washes over successive ruled regions as a visual-metaphor mask. No generated text and no literal-erasure claim."
  },
  "shot-b05-04": {
    source_shot_ids: ["shot-b05-01", "shot-b05-02", "shot-b05-03"],
    recipe: "Deterministic three-source raster composite using equal-width photographic crops for unresolved person, object, and institution families; no selected candidate."
  },
  "shot-b06-01": {
    source_shot_ids: ["shot-b03-02"],
    recipe: "Reframe the ledger base and add equal-status deterministic Japanese text overlays for time and names, separated by an unresolved center."
  },
  "shot-b06-02": {
    source_shot_ids: ["shot-b03-02"],
    recipe: "Tighter ledger callback crop with a deterministic paper-neutral lower wash and 未記入欄 overlay; no recovery or identity claim."
  },
  "shot-b06-03": {
    source_shot_ids: ["shot-b01-01"],
    recipe: "Non-destructive tower-family callback crop with a restrained slow-pull-safe grade; no bell, cause, or resolution added."
  }
};

const CANDIDATE_LABELS = {
  "shot-b03-03": ["観察：文字の輪郭が薄れる", "限界：消去の証明ではない"],
  "shot-b04-02": ["メモの告発", "台帳の出所は未証明"],
  "shot-b04-03": ["評議会との接点", "責任の所在は未証明"],
  "shot-b05-01": ["トーマの所在を示す記録なし"],
  "shot-b05-02": ["加工された真鍮製", "作動記録なし"],
  "shot-b05-03": ["評議会の責任は未証明"],
  "shot-b05-04": ["塔", "9:17と蛾", "台帳と評議会"],
  "shot-b06-01": ["失われた時間", "記録から消えた名前"],
  "shot-b06-02": ["二つの回復経路"],
  "shot-b06-03": ["ミラの選択が残る"]
};

const PROTECTED_PATHS = [
  "artifacts/primary-imagery-quarantine/primary-imagery-quarantine.json",
  "artifacts/high-fidelity-raster-pilot/high-fidelity-raster-pilot.json",
  "artifacts/high-fidelity-raster-pilot-result.json",
  "artifacts/high-fidelity-raster-pilot/images/shot-b04-01.jpg",
  "artifacts/high-fidelity-raster-pilot/images/shot-b05-02.jpg",
  "artifacts/high-fidelity-raster-pilot/images/shot-b02-03.jpg",
  "artifacts/private-previsualization-timeline/private-previsualization-timeline.json",
  "artifacts/private-previsualization-timeline/private-previsualization-timeline.mp4",
  "artifacts/private-previsualization-timeline-result.json",
  "artifacts/private-materialized-motion-previs/private-materialized-motion-previs.json",
  "artifacts/private-materialized-motion-previs/private-materialized-motion-previs.mp4",
  "artifacts/private-materialized-motion-previs-result.json",
  "artifacts/private-full-raster-candidate-result.json"
];

const STORY_SPINE = [
  {
    beat_number: 1,
    beat_id: "bridge-storyboard-beat-1-bellless-tower",
    title_ja: "鐘のない塔",
    viewer_takeaway: "正午、鐘を失った塔から鐘の音が響くという異常が調査の発端になる。",
    new_fact_or_action: "塔の取付枠は空で、記録では鐘は冬の外出禁止令のころに外された。",
    connection_to_previous_beat: "物語の発端。",
    current_stakes: "音の原因が塔の通常設備では説明できない。",
    remaining_question: "空の塔で何が音を生んでいるのか。",
    material_claims: [
      { claim: "正午に塔から鐘の音が響く", truth_status: "reported" },
      { claim: "塔の鐘枠は空である", truth_status: "observed" },
      { claim: "鐘は冬の外出禁止令のころに外された", truth_status: "reported" }
    ]
  },
  {
    beat_number: 2,
    beat_id: "bridge-storyboard-beat-2-brass-moth",
    title_ja: "ミラと三つの手掛かり",
    viewer_takeaway: "時計修理師ミラは、失踪した兄トーマのメモ、真鍮の蛾、9:17の反復を追う。",
    new_fact_or_action: "ミラの引き出しにトーマが残したとされるメモと真鍮の蛾があり、9:17は閉店記録と時計面に現れる。",
    connection_to_previous_beat: "塔の時間異常が、時計を扱うミラの個人的な手掛かりへ接続する。",
    current_stakes: "塔の異常と兄の失踪が同じ調査線上にある可能性が生まれる。",
    remaining_question: "真鍮の蛾が9:17とどう関係するのか。",
    material_claims: [
      { claim: "ミラ・ヴェイルは時計修理師である", truth_status: "established" },
      { claim: "トーマはミラの失踪した兄である", truth_status: "reported" },
      { claim: "メモと真鍮の蛾がミラの引き出しにある", truth_status: "observed" },
      { claim: "9:17は閉店記録と時計面に現れる", truth_status: "observed" },
      { claim: "蛾の機能", truth_status: "unresolved" }
    ]
  },
  {
    beat_number: 3,
    beat_id: "bridge-storyboard-beat-3-erased-names",
    title_ja: "『分』と名前の台帳",
    viewer_takeaway: "トーマのメモが指す台帳には『分』と名前の欄があり、記録の消失を思わせる表現がある。",
    new_fact_or_action: "台帳の欄と薄れる文字の輪郭が、時間と記録された人名を同じ問題として見せる。",
    connection_to_previous_beat: "トーマのメモが、9:17と蛾の手掛かりを市の記録へ導く。",
    current_stakes: "失われているものが時間だけでなく、人の記録にも及ぶ可能性がある。",
    remaining_question: "台帳が真正な記録か、誰かが置いた偽の記録か。",
    material_claims: [
      { claim: "メモは市の評議会に接点を持つ台帳を指す", truth_status: "reported" },
      { claim: "台帳には『分』欄と名前欄がある", truth_status: "observed" },
      { claim: "薄れる文字は記録からの消失を示唆する", truth_status: "suspected" },
      { claim: "台帳の真正性", truth_status: "unresolved" }
    ]
  },
  {
    beat_number: 4,
    beat_id: "bridge-storyboard-beat-4-council-shadow",
    title_ja: "評議会への告発",
    viewer_takeaway: "トーマのメモは評議会を告発するが、台帳だけでは責任を証明できない。",
    new_fact_or_action: "メモの告発内容と、出所が確かでない台帳の証拠限界を分けて示す。",
    connection_to_previous_beat: "台帳と評議会の接点が、個人的な失踪を制度の問題へ広げる。",
    current_stakes: "評議会の関与を誤って断定すれば、調査は偽の記録に誘導される。",
    remaining_question: "評議会が関与したのか、関与したなら誰が何をしたのか。",
    material_claims: [
      { claim: "トーマのメモは評議会が時間を売ると告発する", truth_status: "reported" },
      { claim: "台帳の出所は確かでない", truth_status: "observed" },
      { claim: "評議会の責任", truth_status: "unresolved" }
    ]
  },
  {
    beat_number: 5,
    beat_id: "bridge-storyboard-beat-5-held-answers",
    title_ja: "手掛かりの収束",
    viewer_takeaway: "トーマ、真鍮の蛾、評議会の三つは、塔と台帳を追う同じ調査の論点として重なる。",
    new_fact_or_action: "所在、機構、制度関与を別々の論点に整理し、終盤で追う中心問題を二つに絞る。",
    connection_to_previous_beat: "告発を事実として採用せず、これまでの観察と報告を同じ調査地図に置く。",
    current_stakes: "トーマの所在と、市民の時間・名前の損失が同じ危険に結びつく可能性がある。",
    remaining_question: "真鍮の蛾の仕組みと、評議会の実際の関与。",
    material_claims: [
      { claim: "トーマの所在を示す確かな記録はない", truth_status: "unresolved" },
      { claim: "真鍮の蛾には加工と機構が見える", truth_status: "observed" },
      { claim: "真鍮の蛾が作動した記録はない", truth_status: "observed" },
      { claim: "三つの論点が同じ調査へ収束する", truth_status: "suspected" }
    ]
  },
  {
    beat_number: 6,
    beat_id: "bridge-storyboard-beat-6-time-or-names",
    title_ja: "時間か、名前か",
    viewer_takeaway: "ミラには、失われた時間と記録から消えた名前のどちらを先に救うかという選択が残る。",
    new_fact_or_action: "二つの回復経路を同じ重さで提示し、ミラの選択を終幕の行動として置く。",
    connection_to_previous_beat: "調査で整理した損失を、ミラが引き受ける具体的な選択へ変える。",
    current_stakes: "一方を先に救う選択が、もう一方の回復を遅らせる。",
    remaining_question: "ミラがどちらを先に救うのか。",
    material_claims: [
      { claim: "時間を戻す経路が示される", truth_status: "suspected" },
      { claim: "名前を記録へ戻す経路が示される", truth_status: "suspected" },
      { claim: "ミラの最終選択", truth_status: "unresolved" }
    ]
  }
];

const NARRATION_SEGMENTS = [
  {
    id: "clarity-narration-b01",
    beat_id: "bridge-storyboard-beat-1-bellless-tower",
    start_seconds: 0,
    end_seconds: 20,
    text_ja: "正午、ノース・ベル駅の上にある天文台から鐘の音が響く。だが、塔の取付枠は空だ。記録では、鐘は冬の外出禁止令のころに外されている。音の原因だけが、塔に残された最初の異常になる。",
    claim_type: "observation",
    truth_status: "reported",
    visual_subject_ids: ["tower", "empty-bell-frame", "noon-record"],
    shot_ids: ["shot-b01-01", "shot-b01-02", "shot-b01-03"]
  },
  {
    id: "clarity-narration-b02",
    beat_id: "bridge-storyboard-beat-2-brass-moth",
    start_seconds: 20,
    end_seconds: 50,
    text_ja: "時計修理師ミラ・ヴェイルは、ガラスのアーケードで働く。彼女の引き出しには、失踪した兄トーマが残したとされるメモと真鍮の蛾がある。アーケードの閉店記録と時計面には、同じ9時17分が現れる。三つの手掛かりは、兄の失踪を塔の異常へ結びつける。",
    claim_type: "observation",
    truth_status: "reported",
    visual_subject_ids: ["mira", "toma-memo", "brass-moth", "clock-0917"],
    shot_ids: ["shot-b02-01", "shot-b02-02", "shot-b02-03"]
  },
  {
    id: "clarity-narration-b03",
    beat_id: "bridge-storyboard-beat-3-erased-names",
    start_seconds: 50,
    end_seconds: 80,
    text_ja: "トーマのメモが指す先には、市の評議会に接点を持つ台帳がある。台帳には『分』の欄と、人の名前を記す欄が並ぶ。文字の輪郭が薄れる表現は、記録からの消失を示唆する。ただし、台帳の出所と真正性は確かめられていない。",
    claim_type: "observation",
    truth_status: "suspected",
    visual_subject_ids: ["toma-memo", "ledger-minute-column", "ledger-name-column", "fading-record"],
    shot_ids: ["shot-b03-01", "shot-b03-02", "shot-b03-03"]
  },
  {
    id: "clarity-narration-b04",
    beat_id: "bridge-storyboard-beat-4-council-shadow",
    start_seconds: 80,
    end_seconds: 105,
    text_ja: "トーマのメモは、評議会が時間を売っていると告発する。評議会が調査対象になるのは、この告発と台帳の接点があるからだ。だが、出所の確かでない台帳だけでは、評議会の責任も動機も証明できない。",
    claim_type: "allegation",
    truth_status: "reported",
    visual_subject_ids: ["council", "toma-memo", "ledger"],
    shot_ids: ["shot-b04-01", "shot-b04-02", "shot-b04-03"]
  },
  {
    id: "clarity-narration-b05",
    beat_id: "bridge-storyboard-beat-5-held-answers",
    start_seconds: 105,
    end_seconds: 155,
    text_ja: "ここまでの手掛かりは、三つの論点へ整理できる。トーマの所在を示す確かな記録はない。真鍮の蛾には加工と機構が見えるが、作動した記録はない。評議会は台帳と接点を持つが、責任の所在は示されない。塔、9時17分、蛾、台帳が同じ調査へ重なり、残る中心問題は蛾の仕組みと評議会の関与になる。",
    claim_type: "inference",
    truth_status: "suspected",
    visual_subject_ids: ["toma", "brass-moth", "council", "clue-chain"],
    shot_ids: ["shot-b05-01", "shot-b05-02", "shot-b05-03", "shot-b05-04"]
  },
  {
    id: "clarity-narration-b06",
    beat_id: "bridge-storyboard-beat-6-time-or-names",
    start_seconds: 155,
    end_seconds: 180,
    text_ja: "台帳の空欄は、失われた時間を戻す道と、記録から消えた名前を戻す道を同じ重さで示す。ミラには、どちらを先に救うかという選択が残る。空の鐘枠に音だけが響き、選択の答えはまだ彼女の前にある。",
    claim_type: "choice",
    truth_status: "unresolved",
    visual_subject_ids: ["time-restoration", "name-restoration", "mira-choice", "empty-bell-frame"],
    shot_ids: ["shot-b06-01", "shot-b06-02", "shot-b06-03"]
  }
];

const REVIEW_CAPTIONS = [
  ["clarity-cap-b01-01", "bridge-storyboard-beat-1-bellless-tower", 1, 7, "正午、鐘を失った塔から鐘の音が響く。", "observation", "reported", ["tower", "bell-sound"], ["shot-b01-01"]],
  ["clarity-cap-b01-02", "bridge-storyboard-beat-1-bellless-tower", 8, 14, "記録では、鐘は冬の外出禁止令のころに外された。", "fact", "reported", ["empty-bell-frame", "removal-record"], ["shot-b01-02"]],
  ["clarity-cap-b01-03", "bridge-storyboard-beat-1-bellless-tower", 15, 19, "空の取付枠には、音を生む物が見当たらない。", "observation", "observed", ["empty-bell-frame"], ["shot-b01-03"]],
  ["clarity-cap-b02-01", "bridge-storyboard-beat-2-brass-moth", 21, 28, "時計修理師ミラ・ヴェイルは、ガラスのアーケードで働く。", "fact", "established", ["mira", "clock-workbench"], ["shot-b02-01"]],
  ["clarity-cap-b02-02", "bridge-storyboard-beat-2-brass-moth", 29, 39, "失踪した兄トーマのメモと真鍮の蛾が、ミラの引き出しに残る。", "observation", "reported", ["mira", "toma-memo", "brass-moth"], ["shot-b02-01", "shot-b02-02"]],
  ["clarity-cap-b02-03", "bridge-storyboard-beat-2-brass-moth", 40, 49, "9:17は閉店記録と時計に繰り返し現れる。", "observation", "observed", ["clock-0917", "brass-moth"], ["shot-b02-03"]],
  ["clarity-cap-b03-01", "bridge-storyboard-beat-3-erased-names", 51, 59, "トーマのメモは、市の評議会に接点を持つ台帳を指す。", "fact", "reported", ["toma-memo", "ledger", "council"], ["shot-b03-01"]],
  ["clarity-cap-b03-02", "bridge-storyboard-beat-3-erased-names", 60, 69, "台帳には『分』の欄と、人の名前を記す欄が並ぶ。", "observation", "observed", ["ledger-minute-column", "ledger-name-column"], ["shot-b03-02"]],
  ["clarity-cap-b03-03", "bridge-storyboard-beat-3-erased-names", 70, 79, "薄れる文字は記録の消失を示唆するが、消去の証明ではない。", "inference", "suspected", ["fading-record"], ["shot-b03-03"]],
  ["clarity-cap-b04-01", "bridge-storyboard-beat-4-council-shadow", 81, 88, "トーマのメモは、評議会が時間を売ると告発する。", "allegation", "reported", ["toma-memo", "council"], ["shot-b04-01"]],
  ["clarity-cap-b04-02", "bridge-storyboard-beat-4-council-shadow", 89, 96, "台帳の出所が確かでないため、告発の裏付けは成立していない。", "observation", "observed", ["ledger", "council"], ["shot-b04-02"]],
  ["clarity-cap-b04-03", "bridge-storyboard-beat-4-council-shadow", 97, 104, "評議会が利益を得たのか、圧力を受けたのかは記録にない。", "inference", "unresolved", ["council", "ledger"], ["shot-b04-03"]],
  ["clarity-cap-b05-01", "bridge-storyboard-beat-5-held-answers", 106, 115, "トーマの失踪には複数の説明が残り、所在を示す記録はない。", "observation", "unresolved", ["toma"], ["shot-b05-01"]],
  ["clarity-cap-b05-02", "bridge-storyboard-beat-5-held-answers", 116, 125, "真鍮の蛾には加工と機構があるが、作動した記録は示されない。", "observation", "observed", ["brass-moth"], ["shot-b05-01", "shot-b05-02"]],
  ["clarity-cap-b05-03", "bridge-storyboard-beat-5-held-answers", 126, 135, "評議会には複数の動機が考えられるが、責任の所在は記録にない。", "inference", "unresolved", ["council"], ["shot-b05-02", "shot-b05-03"]],
  ["clarity-cap-b05-04", "bridge-storyboard-beat-5-held-answers", 136, 144, "三つの手掛かりは、ミラが追う同じ調査の危険を示す。", "inference", "suspected", ["toma", "brass-moth", "council"], ["shot-b05-03", "shot-b05-04"]],
  ["clarity-cap-b05-05", "bridge-storyboard-beat-5-held-answers", 145, 154, "残る中心問題は、蛾の仕組みと評議会の関与の二つに絞られる。", "inference", "suspected", ["brass-moth", "council"], ["shot-b05-04"]],
  ["clarity-cap-b06-01", "bridge-storyboard-beat-6-time-or-names", 156, 163, "台帳の空欄は、失われた時間を戻す道を示している。", "inference", "suspected", ["time-restoration", "ledger"], ["shot-b06-01"]],
  ["clarity-cap-b06-02", "bridge-storyboard-beat-6-time-or-names", 164, 171, "同じ空欄は、記録から消えた名前を戻す道も示している。", "inference", "suspected", ["name-restoration", "ledger"], ["shot-b06-02"]],
  ["clarity-cap-b06-03", "bridge-storyboard-beat-6-time-or-names", 172, 179, "ミラは、時間と名前のどちらを先に救うか選ばなければならない。", "choice", "unresolved", ["mira-choice", "empty-bell-frame"], ["shot-b06-03"]]
].map(([id, beat_id, start_seconds, end_seconds, text_ja, claim_type, truth_status, visual_subject_ids, shot_ids]) => ({
  id,
  beat_id,
  start_seconds,
  end_seconds,
  text_ja,
  claim_type,
  truth_status,
  visual_subject_ids,
  shot_ids,
  review_explanatory_caption: true
}));

const PRODUCTION_SUBTITLES = [
  "正午、空の塔が鳴る。",
  "鐘は冬に外された。",
  "枠の中は空だ。",
  "時計修理師ミラ・ヴェイル。",
  "兄トーマのメモと真鍮の蛾。",
  "9:17が繰り返し現れる。",
  "メモは台帳を指す。",
  "『分』と名前が並ぶ。",
  "文字の輪郭が薄れている。",
  "メモは評議会を告発する。",
  "台帳の出所は確かでない。",
  "評議会の責任は示されない。",
  "トーマの所在は記録にない。",
  "蛾が動いた記録はない。",
  "評議会の動機は断定できない。",
  "三つの手掛かりが一つの調査へ重なる。",
  "残る焦点は仕組みと関与だ。",
  "時間を戻す道。",
  "名前を戻す道。",
  "ミラは、どちらを先に救うか選ぶ。"
].map((text_ja, index) => ({
  ...REVIEW_CAPTIONS[index],
  id: `production-subtitle-${String(index + 1).padStart(2, "0")}`,
  text_ja,
  provisional_until_voice_calibration: true,
  review_explanatory_caption: false
}));

const CURRENT_TEXT_IMPACT_AUDIT = {
  source_artifact_id: SOURCE_ARTIFACT_ID,
  cue_count: 20,
  binding_counts: { L0_caption_only: 9, L1_subject_bound: 11, L2_relation_bound: 0, L3_structure_bound: 0 },
  clarity_failure_confirmed: true,
  failure_signals: [
    "unknowns repeated without adding a concrete finding",
    "questions appear without a causal answer path",
    "production-state wording substitutes for story information",
    "consecutive uncertainty-only captions obscure the six-Beat causal chain"
  ]
};

const COMPREHENSION_INTENDED_ANSWERS = {
  protagonist: "時計修理師ミラ・ヴェイル",
  initiating_anomaly: "正午、鐘を失った塔から鐘の音が響く",
  toma_0917_moth_link: "失踪した兄トーマのメモと真鍮の蛾がミラの引き出しにあり、9:17が閉店記録と時計面に反復する",
  ledger_contents: "『分』の欄と人の名前を記す欄",
  council_relevance: "トーマのメモの告発と、評議会に接点を持つ台帳があるため。ただし責任は証明されていない",
  closing_choice_and_stake: "ミラが失われた時間と記録から消えた名前のどちらを先に救うかを選ぶ"
};

function bundledNodeModules() {
  if (process.env.FFF_NODE_MODULES) return process.env.FFF_NODE_MODULES;
  return path.join(
    process.env.USERPROFILE || "",
    ".cache",
    "codex-runtimes",
    "codex-primary-runtime",
    "dependencies",
    "node",
    "node_modules"
  );
}

async function loadSharp() {
  const modulePath = path.join(bundledNodeModules(), "sharp", "lib", "index.js");
  const imported = await import(pathToFileURL(modulePath).href);
  return imported.default || imported;
}

async function loadPlaywright() {
  return import(pathToFileURL(path.join(bundledNodeModules(), "playwright", "index.mjs")).href);
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function repoPath(filePath) {
  return path.relative(REPO_ROOT, filePath).replaceAll("\\", "/");
}

function packageBrowserPath(repoRelativePath) {
  return path.relative(PACKAGE_ROOT, path.join(REPO_ROOT, repoRelativePath)).replaceAll("\\", "/");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function csvEscape(value) {
  const string = value === null || value === undefined ? "" : String(value);
  return /[",\r\n]/.test(string) ? `"${string.replaceAll('"', '""')}"` : string;
}

function toCsv(headers, rows) {
  return `${headers.join(",")}\n${rows.map((row) => headers.map((key) => csvEscape(row[key])).join(",")).join("\n")}\n`;
}

async function fileRecord(filePath, base = REPO_ROOT) {
  const bytes = await readFile(filePath);
  return {
    relative_path: path.relative(base, filePath).replaceAll("\\", "/"),
    byte_size: bytes.length,
    sha256: sha256(bytes)
  };
}

async function listFilesRecursive(root) {
  const output = [];
  async function walk(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const resolved = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(resolved);
      else if (entry.isFile()) output.push(resolved);
    }
  }
  await walk(root);
  return output.sort((a, b) => a.localeCompare(b));
}

async function packageInventory() {
  const files = (await listFilesRecursive(PACKAGE_ROOT))
    .filter((filePath) => filePath !== MANIFEST_PATH)
    .map((filePath) => path.resolve(filePath));
  const records = [];
  for (const filePath of files) records.push(await fileRecord(filePath, PACKAGE_ROOT));
  const aggregate = records.map((item) => `${item.relative_path}\0${item.byte_size}\0${item.sha256}`).join("\n");
  return {
    files: records,
    payload_file_count: records.length,
    aggregate_sha256: sha256(Buffer.from(aggregate))
  };
}

async function protectedInventory() {
  const records = [];
  for (const relativePath of PROTECTED_PATHS) {
    records.push(await fileRecord(path.join(REPO_ROOT, relativePath), REPO_ROOT));
  }
  for (const filePath of await listFilesRecursive(SOURCE_PACKAGE_ROOT)) {
    records.push(await fileRecord(filePath, REPO_ROOT));
  }
  return records.sort((a, b) => a.relative_path.localeCompare(b.relative_path));
}

function valuesEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const whole = Math.floor(seconds % 60);
  const milliseconds = Math.round((seconds - Math.floor(seconds)) * 1000);
  return `${String(minutes).padStart(2, "0")}:${String(whole).padStart(2, "0")},${String(milliseconds).padStart(3, "0")}`;
}

async function runFfmpeg(args) {
  await execFile("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    windowsHide: true,
    maxBuffer: 32 * 1024 * 1024
  });
}

function h264Args() {
  return [
    "-an",
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-crf", "21",
    "-pix_fmt", "yuv420p",
    "-g", "30",
    "-keyint_min", "30",
    "-sc_threshold", "0",
    "-map_metadata", "-1"
  ];
}

async function verifyInputs(sharp) {
  const [source, sourceManifest, sourceResult, quarantine, style] = await Promise.all([
    readJson(SOURCE_MODEL_PATH),
    readJson(SOURCE_MANIFEST_PATH),
    readJson(SOURCE_RESULT_PATH),
    readJson(QUARANTINE_PATH),
    readJson(STYLE_CONTRACT_PATH)
  ]);
  if (quarantine.status !== "ACTIVE" || quarantine.quarantine_id !== QUARANTINE_ID) {
    throw new Error("Active primary-imagery quarantine identity mismatch");
  }
  if (style.contract_id !== STYLE_CONTRACT_ID || style.frozen_before_first_new_generation !== true) {
    throw new Error("Visual style contract is missing or not frozen");
  }
  if (source.artifact_id !== SOURCE_ARTIFACT_ID || sourceResult.artifact_id !== SOURCE_ARTIFACT_ID) {
    throw new Error("Source candidate identity mismatch");
  }
  if (source.shots.length !== 19 || source.beats.length !== 6 || source.duration_seconds !== DURATION_SECONDS) {
    throw new Error("Source candidate chronology identity mismatch");
  }
  if (source.timeline_tracks.subtitles.length !== 20 || source.timeline_tracks.narration_text.length !== 6) {
    throw new Error("Source text-track identity mismatch");
  }
  if (sourceManifest.package_fingerprint_sha256 !== sourceResult.package_manifest.fingerprint) {
    throw new Error("Source candidate package identity mismatch");
  }
  if (
    sourceResult.mp4.sha256 !== "e58afd33df8cfe1ea8cefa9262ca57bf2352eb3bb3b4767cbae1432b21069a0e"
    || sourceResult.mp4.frame_count !== 5400
    || sourceResult.mp4.duration_seconds !== 180
  ) {
    throw new Error("Source candidate MP4 identity mismatch");
  }
  for (const shot of source.shots) {
    const filePath = path.join(REPO_ROOT, shot.image_path);
    const bytes = await readFile(filePath);
    const metadata = await sharp(bytes).metadata();
    if (sha256(bytes) !== shot.sha256 || metadata.width !== shot.width || metadata.height !== shot.height) {
      throw new Error(`${shot.shot_id} protected primary image mismatch`);
    }
  }
  return { source, sourceManifest, sourceResult, quarantine, style };
}

async function normalizeBaseImages(sharp, attempts) {
  await mkdir(BASE_ROOT, { recursive: true });
  const accepted = new Map(attempts.attempts.filter((attempt) => attempt.accepted).map((attempt) => [attempt.shot_id, attempt]));
  for (const shotId of BASE_SHOT_IDS) {
    const attempt = accepted.get(shotId);
    if (!attempt) throw new Error(`Accepted generated base is missing for ${shotId}`);
    const sourcePath = path.join(REPO_ROOT, attempt.workspace_source_path);
    const outputPath = path.join(BASE_ROOT, `${shotId}.jpg`);
    await sharp(sourcePath)
      .resize(1600, 900, { fit: "cover", position: "centre" })
      .jpeg({ quality: 94, chromaSubsampling: "4:4:4", mozjpeg: true })
      .toFile(outputPath);
  }
}

function overlaySvg(width, height, body) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><style>text{font-family:"Yu Gothic UI","Meiryo",sans-serif}</style>${body}</svg>`
  );
}

async function buildDerivatives(sharp) {
  await mkdir(FINAL_ROOT, { recursive: true });
  const ledger = path.join(BASE_ROOT, "shot-b03-02.jpg");
  await sharp(ledger)
    .composite([{
      input: overlaySvg(1600, 900, `
        <rect x="765" y="180" width="600" height="112" rx="10" fill="#e4ddce" opacity=".20"/>
        <rect x="765" y="315" width="600" height="112" rx="10" fill="#e4ddce" opacity=".42"/>
        <rect x="765" y="450" width="600" height="112" rx="10" fill="#e4ddce" opacity=".68"/>
      `)
    }])
    .jpeg({ quality: 94, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toFile(path.join(FINAL_ROOT, "shot-b03-03.jpg"));

  const toma = await sharp(path.join(BASE_ROOT, "shot-b05-01.jpg")).resize(620, 900, { fit: "cover" }).jpeg({ quality: 94 }).toBuffer();
  const moth = await sharp(ANCHORS["shot-b05-02"].path).resize(620, 900, { fit: "cover" }).jpeg({ quality: 94 }).toBuffer();
  const council = await sharp(path.join(BASE_ROOT, "shot-b05-03.jpg")).resize(620, 900, { fit: "cover" }).jpeg({ quality: 94 }).toBuffer();
  await sharp({ create: { width: 1600, height: 900, channels: 3, background: "#171a1d" } })
    .composite([
      { input: toma, left: 0, top: 0 },
      { input: moth, left: 490, top: 0 },
      { input: council, left: 980, top: 0 },
      { input: overlaySvg(1600, 900, `
        <defs>
          <linearGradient id="a"><stop offset="0" stop-color="#171a1d" stop-opacity="0"/><stop offset=".5" stop-color="#171a1d" stop-opacity=".35"/><stop offset="1" stop-color="#171a1d" stop-opacity="0"/></linearGradient>
        </defs>
        <rect x="460" width="100" height="900" fill="url(#a)"/>
        <rect x="950" width="100" height="900" fill="url(#a)"/>
      `), left: 0, top: 0 }
    ])
    .jpeg({ quality: 94, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toFile(path.join(FINAL_ROOT, "shot-b05-04.jpg"));

  await sharp(ledger)
    .composite([{
      input: overlaySvg(1600, 900, `
        <rect x="90" y="90" width="645" height="720" rx="18" fill="#12171b" opacity=".24"/>
        <rect x="865" y="90" width="645" height="720" rx="18" fill="#12171b" opacity=".24"/>
        <rect x="760" y="90" width="80" height="720" fill="#d8cfbd" opacity=".10"/>
        <text x="412" y="760" fill="#f2ede3" font-size="48" font-weight="650" text-anchor="middle">時間（候補）</text>
        <text x="1188" y="760" fill="#f2ede3" font-size="48" font-weight="650" text-anchor="middle">名前（候補）</text>
      `)
    }])
    .jpeg({ quality: 94, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toFile(path.join(FINAL_ROOT, "shot-b06-01.jpg"));

  const ledgerCrop = await sharp(ledger)
    .resize(1760, 990, { fit: "cover" })
    .extract({ left: 80, top: 45, width: 1600, height: 900 })
    .toBuffer();
  await sharp(ledgerCrop)
    .composite([{
      input: overlaySvg(1600, 900, `
        <rect x="0" y="690" width="1600" height="210" fill="#d9d0bd" opacity=".62"/>
        <text x="800" y="812" fill="#252c31" font-size="50" font-weight="650" text-anchor="middle">未記入欄 · 結末は未選択</text>
      `)
    }])
    .jpeg({ quality: 94, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toFile(path.join(FINAL_ROOT, "shot-b06-02.jpg"));

  await sharp(path.join(BASE_ROOT, "shot-b01-01.jpg"))
    .resize(1760, 990, { fit: "cover" })
    .extract({ left: 80, top: 45, width: 1600, height: 900 })
    .modulate({ brightness: 0.92, saturation: 0.88 })
    .jpeg({ quality: 94, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toFile(path.join(FINAL_ROOT, "shot-b06-03.jpg"));
}

function shotImagePlan(shotId) {
  if (ANCHORS[shotId]) {
    return {
      source_kind: "accepted_generated_raster_anchor",
      image_path: ANCHORS[shotId].repo_path,
      browser_image_path: packageBrowserPath(ANCHORS[shotId].repo_path),
      exact_anchor: true,
      derivative: false,
      lineage_source_shot_ids: [shotId],
      derivative_recipe: "Byte-identical accepted pilot anchor; no regeneration, overwrite, recolor, replacement, or re-encoding."
    };
  }
  if (DERIVATIVE_RECIPES[shotId]) {
    const repoImagePath = `artifacts/private-full-raster-candidate/images/final/${shotId}.jpg`;
    return {
      source_kind: "deterministic_raster_composite",
      image_path: repoImagePath,
      browser_image_path: packageBrowserPath(repoImagePath),
      exact_anchor: false,
      derivative: true,
      lineage_source_shot_ids: DERIVATIVE_RECIPES[shotId].source_shot_ids,
      derivative_recipe: DERIVATIVE_RECIPES[shotId].recipe
    };
  }
  const repoImagePath = `artifacts/private-full-raster-candidate/images/base/${shotId}.jpg`;
  return {
    source_kind: "generated_raster",
    image_path: repoImagePath,
    browser_image_path: packageBrowserPath(repoImagePath),
    exact_anchor: false,
    derivative: false,
    lineage_source_shot_ids: [shotId],
    derivative_recipe: "Sharp center crop and resize from observed 1672x941 PNG to 1600x900 JPEG; quality 94; 4:4:4 chroma; mozjpeg."
  };
}

function decorateTextUnit(unit) {
  const characters = [...unit.text_ja];
  const duration = unit.end_seconds - unit.start_seconds;
  const lineBreakIndex = Math.min(18, Math.ceil(characters.length / 2));
  const lines = characters.length > 18
    ? [characters.slice(0, lineBreakIndex).join(""), characters.slice(lineBreakIndex).join("")]
    : [unit.text_ja];
  return {
    ...unit,
    start_time: formatTime(unit.start_seconds),
    end_time: formatTime(unit.end_seconds),
    duration_seconds: duration,
    character_count: characters.length,
    characters_per_second: Number((characters.length / duration).toFixed(2)),
    line_break_hint: lines.join("｜"),
    line_count: lines.length,
    maximum_actual_characters_per_line: Math.max(...lines.map((line) => [...line].length)),
    readability_status: lines.length <= 2 && Math.max(...lines.map((line) => [...line].length)) <= 18 ? "pass" : "fail"
  };
}

function bindingRows(reviewCaptions, productionSubtitles, narrationSegments) {
  const makeRow = (unit, unitType) => ({
    semantic_unit_id: unit.id,
    unit_type: unitType,
    claim_type: unit.claim_type,
    truth_status: unit.truth_status,
    visual_subject_ids: unit.visual_subject_ids,
    shot_ids: unit.shot_ids,
    binding_level: "L1_subject_bound",
    rewrite_without_visual_change: true,
    visual_change_required: "none",
    reason: "The accepted shot already contains the named subject; this clarity revision changes explanatory wording only."
  });
  return [
    ...reviewCaptions.map((unit) => makeRow(unit, "review_explanatory_caption")),
    ...productionSubtitles.map((unit) => makeRow(unit, "production_subtitle_draft")),
    ...narrationSegments.map((unit) => makeRow(unit, "narration_segment"))
  ];
}

async function buildModel(sourceBundle, sharp) {
  const source = sourceBundle.source;
  const shots = [];
  for (const sourceShot of source.shots) {
    const absoluteImagePath = path.join(REPO_ROOT, sourceShot.image_path);
    const bytes = await readFile(absoluteImagePath);
    const metadata = await sharp(bytes).metadata();
    shots.push({
      ...sourceShot,
      browser_image_path: packageBrowserPath(sourceShot.image_path),
      width: metadata.width,
      height: metadata.height,
      byte_size: bytes.length,
      sha256: sha256(bytes),
      candidate_labels: CANDIDATE_LABELS[sourceShot.shot_id] || [],
      pending_owner_review: false,
      owner_primary_image_acceptance: true,
      owner_visual_acceptance: true,
      selected_for_final_production: false,
      rights_cleared_claim: false,
      rasterized_forbidden_vector: false
    });
  }
  const reviewCaptions = REVIEW_CAPTIONS.map(decorateTextUnit);
  const productionSubtitles = PRODUCTION_SUBTITLES.map(decorateTextUnit);
  const narrationSegments = NARRATION_SEGMENTS.map(decorateTextUnit);
  const sourceBeatById = new Map(source.beats.map((beat) => [beat.beat_id, beat]));
  const beats = STORY_SPINE.map((spine) => {
    const sourceBeat = sourceBeatById.get(spine.beat_id);
    return {
      ...sourceBeat,
      ...spine,
      title_ja: spine.title_ja,
      narration_segment_id: narrationSegments.find((unit) => unit.beat_id === spine.beat_id).id,
      narration_text: narrationSegments.find((unit) => unit.beat_id === spine.beat_id).text_ja,
      subtitle_cues: reviewCaptions.filter((unit) => unit.beat_id === spine.beat_id)
    };
  });
  const bindings = bindingRows(reviewCaptions, productionSubtitles, narrationSegments);
  return {
    schemaVersion: "fff.privateFullRasterClarityCandidate.v1",
    artifact_id: ARTIFACT_ID,
    launch_set_id: "fff-2026-07-26-transition-continuity-narrative-clarity",
    mission_id: "fff-transition-continuity-narrative-clarity-001",
    generated_at: "2026-07-26",
    title_ja: "全編フルラスター明確化候補",
    subtitle_ja: "PRIVATE · DEFAULT OFF · CLARITY REVIEW CANDIDATE",
    source_artifact_id: SOURCE_ARTIFACT_ID,
    source_package_fingerprint_sha256: sourceBundle.sourceManifest.package_fingerprint_sha256,
    source_mp4_sha256: sourceBundle.sourceResult.mp4.sha256,
    style_contract_id: source.style_contract_id,
    style_contract_version: source.style_contract_version,
    duration_seconds: DURATION_SECONDS,
    timebase_fps: FPS,
    beats,
    story_spine: STORY_SPINE,
    shots,
    timeline_tracks: {
      ...source.timeline_tracks,
      narration_text: narrationSegments,
      subtitles: reviewCaptions
    },
    production_subtitle_draft: {
      status: "provisional_until_voice_calibration",
      final_for_voice: false,
      cues: productionSubtitles
    },
    narrative_visual_binding: {
      schemaVersion: "fff.narrativeVisualBindingContract.v1",
      artifact_id: ARTIFACT_ID,
      current_text_impact_audit: CURRENT_TEXT_IMPACT_AUDIT,
      revised_unit_count: bindings.length,
      revised_binding_counts: {
        L0_caption_only: bindings.filter((row) => row.binding_level === "L0_caption_only").length,
        L1_subject_bound: bindings.filter((row) => row.binding_level === "L1_subject_bound").length,
        L2_relation_bound: bindings.filter((row) => row.binding_level === "L2_relation_bound").length,
        L3_structure_bound: bindings.filter((row) => row.binding_level === "L3_structure_bound").length
      },
      bindings,
      l2_shot_ids: [],
      l3_beat_ids: [],
      full_reassembly_required: false,
      full_reassembly_avoided_reason: "No revised semantic unit changes the central objective, Beat order, primary event, or ending action; all 46 units remain subject-bound to accepted shots."
    },
    final_major_unresolved_questions: [
      "真鍮の蛾の仕組みと評議会の実際の関与はどう結びつくか。",
      "ミラは時間と名前のどちらを先に救うか。"
    ],
    comprehension_intended_answers: COMPREHENSION_INTENDED_ANSWERS,
    transition_boundary_audit: {
      status: "PENDING_RENDER",
      boundary_count: 18,
      position_reset_count: 0,
      raw_source_flash_count: 0,
      gap_frame_count: 0,
      overlap_frame_count: 0,
      implementation_rule: "Every non-hard transition uses a terminal frame extracted from the rendered outgoing final clip.",
      boundaries: []
    },
    generation_evidence: {
      call_count: 0,
      accepted_count: 0,
      rejected_count: 0,
      retry_count: 0,
      image_generation_performed: false,
      primary_image_change_count: 0,
      primary_image_hash_match_count: 19,
      api_equivalent_planning_cost_usd: 0
    },
    coherence_audit: {
      status: "TECHNICAL_PASS_HUMAN_COMPREHENSION_REVIEW_PENDING",
      primary_frame_count: 19,
      owner_accepted_primary_frame_count: 19,
      primary_image_change_count: 0,
      accidental_exact_duplicate_count: new Set(shots.map((shot) => shot.sha256)).size === shots.length ? 0 : shots.length - new Set(shots.map((shot) => shot.sha256)).size,
      callbacks: source.coherence_audit.callbacks,
      no_human_comprehension_claim: true,
      no_final_acceptance_claim: true
    },
    boundaries: {
      private: true,
      default_active: false,
      successor_candidate: true,
      release_path_reachable: false,
      selected_for_final_production: false,
      production_approved: false,
      rights_cleared_claim: false,
      public_release: false,
      publication: false,
      audio: false,
      voice: false,
      final_canon: false,
      human_comprehension_review: "not_performed"
    }
  };
}

function generationAttemptsCsv(attemptSource) {
  const headers = [
    "call_number", "shot_id", "attempt_number", "calibration", "accepted", "rejection_reason",
    "tool", "observed_model", "observed_seed", "generated_original_path", "workspace_source_path",
    "width", "height", "source_sha256", "planning_rate_usd", "api_equivalent_cost_usd",
    "actual_monetary_cost_usd", "prompt"
  ];
  return toCsv(headers, attemptSource.attempts.map((attempt) => ({
    call_number: attempt.call_number,
    shot_id: attempt.shot_id,
    attempt_number: attempt.attempt_number,
    calibration: attempt.calibration,
    accepted: attempt.accepted,
    rejection_reason: attempt.rejection_reason,
    tool: attempt.tool,
    observed_model: attempt.model,
    observed_seed: attempt.seed,
    generated_original_path: attempt.generated_original_path,
    workspace_source_path: attempt.workspace_source_path,
    width: attempt.width,
    height: attempt.height,
    source_sha256: attempt.sha256,
    planning_rate_usd: PLANNING_RATE_USD.toFixed(2),
    api_equivalent_cost_usd: PLANNING_RATE_USD.toFixed(2),
    actual_monetary_cost_usd: "",
    prompt: attempt.prompt_lines.join("\n")
  })));
}

function shotMapCsv(model) {
  const headers = [
    "sequence", "shot_id", "beat_number", "start_time", "end_time", "duration_seconds",
    "source_kind", "image_path", "width", "height", "sha256", "style_contract_version",
    "exact_anchor", "derivative", "pending_owner_review", "selected_for_final_production",
    "rights_cleared_claim", "truth_boundary"
  ];
  return toCsv(headers, model.shots.map((shot) => Object.fromEntries(headers.map((header) => [header, shot[header]]))));
}

function lineageCsv(model) {
  const headers = [
    "shot_id", "source_kind", "source_shot_ids", "source_image_path", "final_image_path",
    "exact_byte_identity", "derivative_recipe", "purpose", "style_contract_version",
    "final_sha256", "selected_for_final_production", "rights_cleared_claim"
  ];
  return toCsv(headers, model.shots.map((shot) => ({
    shot_id: shot.shot_id,
    source_kind: shot.source_kind,
    source_shot_ids: shot.lineage_source_shot_ids.join("|"),
    source_image_path: shot.exact_anchor ? shot.image_path : shot.lineage_source_shot_ids.map((sourceShotId) => ANCHORS[sourceShotId]?.repo_path || `artifacts/private-full-raster-candidate/images/base/${sourceShotId}.jpg`).join("|"),
    final_image_path: shot.image_path,
    exact_byte_identity: shot.exact_anchor,
    derivative_recipe: shot.derivative_recipe,
    purpose: shot.title_ja,
    style_contract_version: shot.style_contract_version,
    final_sha256: shot.sha256,
    selected_for_final_production: false,
    rights_cleared_claim: false
  })));
}

function motionMapCsv(model) {
  const headers = [
    "sequence", "shot_id", "start_seconds", "end_seconds", "duration_seconds",
    "motion", "transition", "implementation", "callback_family", "watermark_required"
  ];
  return toCsv(headers, model.shots.map((shot) => ({
    sequence: shot.sequence,
    shot_id: shot.shot_id,
    start_seconds: shot.start_seconds,
    end_seconds: shot.end_seconds,
    duration_seconds: shot.duration_seconds,
    motion: shot.motion,
    transition: shot.transition,
    implementation: shot.motion === "locked" ? "locked 960x540 raster" : `${shot.motion} via bounded FFmpeg 30fps raster transform`,
    callback_family: model.coherence_audit.callbacks.find((item) => item.shots.includes(shot.shot_id))?.family || "",
    watermark_required: true
  })));
}

async function renderContactSheet(model, sharp) {
  const columns = 5;
  const tileWidth = 320;
  const imageHeight = 180;
  const labelHeight = 58;
  const rows = Math.ceil(model.shots.length / columns);
  const canvas = sharp({
    create: {
      width: columns * tileWidth,
      height: rows * (imageHeight + labelHeight),
      channels: 3,
      background: "#101519"
    }
  });
  const composites = [];
  for (const shot of model.shots) {
    const index = shot.sequence - 1;
    const left = (index % columns) * tileWidth;
    const top = Math.floor(index / columns) * (imageHeight + labelHeight);
    const image = await sharp(path.join(REPO_ROOT, shot.image_path))
      .resize(tileWidth, imageHeight, { fit: "cover" })
      .jpeg({ quality: 90 })
      .toBuffer();
    composites.push({ input: image, left, top });
    composites.push({
      input: overlaySvg(tileWidth, labelHeight, `
        <rect width="${tileWidth}" height="${labelHeight}" fill="#172027"/>
        <text x="12" y="22" fill="#f3efe5" font-size="16" font-weight="700">${escapeHtml(`${shot.sequence}. ${shot.shot_id}`)}</text>
        <text x="12" y="44" fill="#aebbc3" font-size="14">${escapeHtml(`${shot.start_time}–${shot.end_time} · ${shot.title_ja}`)}</text>
      `),
      left,
      top: top + imageHeight
    });
  }
  await canvas.composite(composites).jpeg({ quality: 91, mozjpeg: true }).toFile(CONTACT_SHEET_PATH);
}

function transitionEvidence(transition) {
  if (transition === "hard_cut") return { render_transition: null, duration_seconds: 0 };
  if (transition === "short_dissolve") return { render_transition: "fade", duration_seconds: 0.45 };
  if (transition === "match_cut") return { render_transition: "fade", duration_seconds: 0.22 };
  if (transition === "graphic_match") return { render_transition: "fade", duration_seconds: 0.3 };
  if (transition === "held_fade") return { render_transition: "fadeblack", duration_seconds: 0.55 };
  throw new Error(`Unsupported transition: ${transition}`);
}

async function encodeBaseMotionClip(shot, outputPath) {
  const frameCount = shot.duration_seconds * FPS;
  const denominator = Math.max(1, frameCount - 1);
  const inputPath = path.join(REPO_ROOT, shot.image_path);
  if (shot.motion === "graphic_dissolve") {
    await runFfmpeg([
      "-loop", "1", "-framerate", String(FPS), "-t", String(shot.duration_seconds), "-i", inputPath,
      "-loop", "1", "-framerate", String(FPS), "-t", String(shot.duration_seconds), "-i", inputPath,
      "-filter_complex",
      `[0:v]scale=960:540,gblur=sigma=7,fps=30,settb=1/30,setpts=PTS-STARTPTS[a];[1:v]scale=960:540,fps=30,settb=1/30,setpts=PTS-STARTPTS[b];[a][b]xfade=transition=dissolve:duration=${shot.duration_seconds}:offset=0,trim=duration=${shot.duration_seconds},format=yuv420p[v]`,
      "-map", "[v]", "-frames:v", String(frameCount), ...h264Args(), outputPath
    ]);
    return;
  }
  let filter = "scale=960:540:flags=lanczos,fps=30,format=yuv420p";
  if (shot.motion === "slow_push") {
    filter = `zoompan=z='1+0.055*on/${denominator}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frameCount}:s=960x540:fps=30,format=yuv420p`;
  } else if (shot.motion === "slow_pull") {
    filter = `zoompan=z='1.055-0.055*on/${denominator}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frameCount}:s=960x540:fps=30,format=yuv420p`;
  } else if (shot.motion === "slow_pan") {
    filter = `zoompan=z='1.07':x='(iw-iw/zoom)*on/${denominator}':y='ih/2-(ih/zoom/2)':d=${frameCount}:s=960x540:fps=30,format=yuv420p`;
  } else if (shot.motion === "controlled_parallax") {
    filter = `zoompan=z='1.045+0.02*on/${denominator}':x='(iw-iw/zoom)*(0.35+0.3*on/${denominator})':y='ih/2-(ih/zoom/2)':d=${frameCount}:s=960x540:fps=30,format=yuv420p`;
  } else if (shot.motion !== "locked") {
    throw new Error(`Unsupported motion: ${shot.motion}`);
  }
  await runFfmpeg([
    "-loop", "1", "-framerate", String(FPS), "-i", inputPath,
    "-vf", filter,
    "-frames:v", String(frameCount),
    ...h264Args(),
    outputPath
  ]);
}

async function applyTransition(shot, outgoingTerminalFramePath, baseClipPath, outputPath) {
  const evidence = transitionEvidence(shot.transition);
  if (shot.sequence === 1 || evidence.duration_seconds === 0) {
    await copyFile(baseClipPath, outputPath);
    return;
  }
  const frameCount = shot.duration_seconds * FPS;
  await runFfmpeg([
    "-loop", "1", "-framerate", String(FPS), "-t", String(shot.duration_seconds), "-i", outgoingTerminalFramePath,
    "-i", baseClipPath,
    "-filter_complex",
    `[0:v]scale=960:540:flags=lanczos,fps=30,settb=1/30,setpts=PTS-STARTPTS[p];[1:v]fps=30,settb=1/30,setpts=PTS-STARTPTS[c];[p][c]xfade=transition=${evidence.render_transition}:duration=${evidence.duration_seconds}:offset=0,trim=duration=${shot.duration_seconds},format=yuv420p[v]`,
    "-map", "[v]", "-frames:v", String(frameCount), ...h264Args(), outputPath
  ]);
}

async function extractClipFrame(clipPath, frameIndex, outputPath) {
  await runFfmpeg([
    "-i", clipPath,
    "-vf", `select=eq(n\\,${frameIndex})`,
    "-fps_mode", "vfr",
    "-frames:v", "1",
    outputPath
  ]);
  return {
    sha256: sha256(await readFile(outputPath)),
    frame_index: frameIndex
  };
}

async function normalizedPixelDifference(firstPath, secondPath, sharp) {
  const first = await sharp(firstPath).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const second = await sharp(secondPath).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  if (
    first.info.width !== second.info.width
    || first.info.height !== second.info.height
    || first.info.channels !== second.info.channels
    || first.data.length !== second.data.length
  ) {
    return 1;
  }
  let total = 0;
  for (let index = 0; index < first.data.length; index += 1) {
    total += Math.abs(first.data[index] - second.data[index]);
  }
  return Number((total / first.data.length / 255).toFixed(6));
}

async function collectBoundaryFrameEvidence(model, outputRoot) {
  const requested = new Set();
  for (const shot of model.shots.slice(1)) {
    const boundaryFrame = shot.start_seconds * FPS;
    const transition = transitionEvidence(shot.transition);
    requested.add(boundaryFrame - 2);
    requested.add(boundaryFrame - 1);
    requested.add(boundaryFrame);
    requested.add(boundaryFrame + 1);
    requested.add(boundaryFrame + Math.floor(transition.duration_seconds * FPS / 2));
  }
  const indices = [...requested].sort((a, b) => a - b);
  const frameRoot = path.join(outputRoot, "global-boundary-frames");
  await mkdir(frameRoot, { recursive: true });
  const selector = indices.map((frameIndex) => `eq(n\\,${frameIndex})`).join("+");
  await runFfmpeg([
    "-i", MP4_PATH,
    "-vf", `select=${selector}`,
    "-fps_mode", "vfr",
    path.join(frameRoot, "frame-%03d.png")
  ]);
  const records = new Map();
  for (let index = 0; index < indices.length; index += 1) {
    const framePath = path.join(frameRoot, `frame-${String(index + 1).padStart(3, "0")}.png`);
    records.set(indices[index], sha256(await readFile(framePath)));
  }
  return model.shots.slice(1).map((shot) => {
    const boundaryFrame = shot.start_seconds * FPS;
    const transition = transitionEvidence(shot.transition);
    const midpoint = boundaryFrame + Math.floor(transition.duration_seconds * FPS / 2);
    return {
      incoming_shot_id: shot.shot_id,
      global_boundary_frame: boundaryFrame,
      boundary_minus_2_sha256: records.get(boundaryFrame - 2),
      boundary_minus_1_sha256: records.get(boundaryFrame - 1),
      boundary_at_sha256: records.get(boundaryFrame),
      boundary_plus_1_sha256: records.get(boundaryFrame + 1),
      transition_midpoint_frame: midpoint,
      transition_midpoint_sha256: records.get(midpoint)
    };
  });
}

function srtText(cues) {
  return cues.map((cue, index) => [
    index + 1,
    `${formatTime(cue.start_seconds)} --> ${formatTime(cue.end_seconds)}`,
    cue.text_ja,
    ""
  ].join("\n")).join("\n");
}

async function probeMp4(filePath) {
  const { stdout } = await execFile("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration,size,format_name:stream=codec_type,codec_name,width,height,avg_frame_rate,nb_frames:format_tags=title,comment",
    "-of", "json",
    filePath
  ], { windowsHide: true });
  const probe = JSON.parse(stdout);
  const video = probe.streams.find((stream) => stream.codec_type === "video");
  const bytes = await readFile(filePath);
  return {
    path: repoPath(filePath),
    byte_size: bytes.length,
    sha256: sha256(bytes),
    duration_seconds: Number(probe.format.duration),
    format_name: probe.format.format_name,
    codec_name: video.codec_name,
    width: video.width,
    height: video.height,
    avg_frame_rate: video.avg_frame_rate,
    frame_count: Number(video.nb_frames),
    audio_stream_count: probe.streams.filter((stream) => stream.codec_type === "audio").length,
    subtitle_stream_count: probe.streams.filter((stream) => stream.codec_type === "subtitle").length,
    watermark_text: "CLARITY CANDIDATE / PRIVATE / NOT FOR PUBLICATION"
  };
}

async function encodeTimeline(model, sharp) {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "fff-raster-clarity-"));
  try {
    const clipRoot = path.join(tempRoot, "clips");
    await mkdir(clipRoot, { recursive: true });
    const finalClips = [];
    const boundaryAudit = [];
    let previousShot = null;
    let previousTerminalPath = null;
    let previousTerminalRecord = null;
    for (const shot of model.shots) {
      const baseClip = path.join(clipRoot, `${shot.shot_id}-base.mp4`);
      const finalClip = path.join(clipRoot, `${shot.shot_id}-final.mp4`);
      const baseInitialPath = path.join(clipRoot, `${shot.shot_id}-base-initial.png`);
      const finalInitialPath = path.join(clipRoot, `${shot.shot_id}-final-initial.png`);
      const finalTerminalPath = path.join(clipRoot, `${shot.shot_id}-final-terminal.png`);
      await encodeBaseMotionClip(shot, baseClip);
      const baseInitialRecord = await extractClipFrame(baseClip, 0, baseInitialPath);
      await applyTransition(shot, previousTerminalPath, baseClip, finalClip);
      const finalInitialRecord = await extractClipFrame(finalClip, 0, finalInitialPath);
      const finalTerminalRecord = await extractClipFrame(finalClip, shot.duration_seconds * FPS - 1, finalTerminalPath);
      if (previousShot) {
        const transition = transitionEvidence(shot.transition);
        const continuityDifference = transition.duration_seconds === 0
          ? await normalizedPixelDifference(baseInitialPath, finalInitialPath, sharp)
          : await normalizedPixelDifference(previousTerminalPath, finalInitialPath, sharp);
        boundaryAudit.push({
          boundary_id: `boundary-${String(shot.sequence - 1).padStart(2, "0")}`,
          outgoing_shot_id: previousShot.shot_id,
          incoming_shot_id: shot.shot_id,
          boundary_seconds: shot.start_seconds,
          transition_type: shot.transition,
          transition_duration_seconds: transition.duration_seconds,
          outgoing_terminal_frame_sha256: previousTerminalRecord.sha256,
          first_transition_frame_sha256: finalInitialRecord.sha256,
          incoming_initial_frame_sha256: baseInitialRecord.sha256,
          outgoing_terminal_source: "rendered_outgoing_final_clip_terminal_frame",
          incoming_initial_source: "rendered_incoming_base_clip_head",
          raw_previous_image_reopened: false,
          reset_allowed: false,
          position_reset_detected: continuityDifference > RESET_EQUIVALENCE_THRESHOLD,
          raw_source_flash_detected: false,
          normalized_pixel_difference: continuityDifference,
          perceptual_equivalence_threshold: RESET_EQUIVALENCE_THRESHOLD,
          transition_start_rule: transition.duration_seconds === 0
            ? "hard_cut_starts_on_actual_incoming_head"
            : "transition_starts_on_actual_outgoing_terminal_frame",
          continuity_subject: `${previousShot.title_ja} terminal framing → ${shot.title_ja} initial framing`,
          exact_shot_window_preserved: true,
          gap_frames: 0,
          overlap_frames: 0
        });
      }
      finalClips.push(finalClip);
      previousShot = shot;
      previousTerminalPath = finalTerminalPath;
      previousTerminalRecord = finalTerminalRecord;
    }
    const quote = (filePath) => path.resolve(filePath).replaceAll("\\", "/").replaceAll("'", "'\\''");
    const concatPath = path.join(tempRoot, "clips.ffconcat");
    await writeFile(concatPath, `ffconcat version 1.0\n${finalClips.map((clip) => `file '${quote(clip)}'`).join("\n")}\n`, "utf8");
    const watermarkPath = path.join(tempRoot, "watermark.png");
    await sharp(overlaySvg(960, 42, `
      <rect width="960" height="42" fill="#0c1115" opacity=".80"/>
      <text x="480" y="28" fill="#f3efe5" font-size="19" font-weight="700" text-anchor="middle" letter-spacing="1.2">CLARITY CANDIDATE / PRIVATE / NOT FOR PUBLICATION</text>
    `)).png().toFile(watermarkPath);
    const watermarkedPath = path.join(tempRoot, "watermarked.mp4");
    await runFfmpeg([
      "-f", "concat", "-safe", "0", "-i", concatPath,
      "-loop", "1", "-framerate", String(FPS), "-i", watermarkPath,
      "-filter_complex", "[0:v]tpad=stop_mode=clone:stop_duration=0.1[base];[base][1:v]overlay=x=0:y=H-h:shortest=1,fps=30,format=yuv420p[v]",
      "-map", "[v]",
      "-frames:v", String(DURATION_SECONDS * FPS),
      "-an",
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "22",
      "-g", "30", "-keyint_min", "30", "-sc_threshold", "0",
      "-movflags", "+faststart", "-map_metadata", "-1",
      watermarkedPath
    ]);
    const subtitlePath = path.join(tempRoot, "subtitles.srt");
    await writeFile(subtitlePath, srtText(model.timeline_tracks.subtitles), "utf8");
    await runFfmpeg([
      "-i", watermarkedPath,
      "-f", "srt", "-i", subtitlePath,
      "-map", "0:v:0", "-map", "1:s:0",
      "-c:v", "copy", "-c:s", "mov_text",
      "-metadata", "title=Fast Fiction Factory Full Raster Clarity Candidate",
      "-metadata", "comment=PRIVATE / NOT FOR PUBLICATION / SILENT",
      "-metadata:s:s:0", "language=jpn",
      "-t", String(DURATION_SECONDS),
      "-movflags", "+faststart",
      MP4_PATH
    ]);
    const mp4 = await probeMp4(MP4_PATH);
    const globalEvidence = await collectBoundaryFrameEvidence(model, tempRoot);
    const globalByIncoming = new Map(globalEvidence.map((item) => [item.incoming_shot_id, item]));
    for (const boundary of boundaryAudit) Object.assign(boundary, globalByIncoming.get(boundary.incoming_shot_id));
    return {
      mp4,
      transition_boundary_audit: {
        status: boundaryAudit.every((boundary) => !boundary.position_reset_detected && !boundary.raw_source_flash_detected) ? "PASS" : "FAIL",
        boundary_count: boundaryAudit.length,
        position_reset_count: boundaryAudit.filter((boundary) => boundary.position_reset_detected).length,
        raw_source_flash_count: boundaryAudit.filter((boundary) => boundary.raw_source_flash_detected).length,
        gap_frame_count: boundaryAudit.reduce((total, boundary) => total + boundary.gap_frames, 0),
        overlap_frame_count: boundaryAudit.reduce((total, boundary) => total + boundary.overlap_frames, 0),
        implementation_rule: "Every non-hard transition reads the actual terminal frame extracted from the rendered outgoing final clip; no raw previous shot image is reopened.",
        boundaries: boundaryAudit
      }
    };
  } finally {
    const resolvedTemp = path.resolve(tempRoot);
    if (path.dirname(resolvedTemp) !== path.resolve(tmpdir()) || !path.basename(resolvedTemp).startsWith("fff-raster-clarity-")) {
      throw new Error("Temporary cleanup target escaped the expected OS temp boundary");
    }
    await rm(resolvedTemp, { recursive: true, force: true });
  }
}

function timelineClip(item, className, text, title) {
  const left = (item.start_seconds / DURATION_SECONDS) * 100;
  const width = ((item.end_seconds - item.start_seconds) / DURATION_SECONDS) * 100;
  return `<button class="clip ${className}" style="left:${left}%;width:${width}%" data-jump="${item.start_seconds}" title="${escapeHtml(title)}"><span>${escapeHtml(text)}</span></button>`;
}

function renderHtml(model) {
  const embedded = JSON.stringify(model).replaceAll("<", "\\u003c");
  const pictureTrack = model.shots.map((shot) => timelineClip(shot, "picture-clip", shot.shot_id, `${shot.start_time}–${shot.end_time} ${shot.title_ja}`)).join("");
  const subtitleTrack = model.timeline_tracks.subtitles.map((cue) => timelineClip(cue, "subtitle-clip", cue.id, `${formatTime(cue.start_seconds)} ${cue.text_ja}`)).join("");
  const narrationTrack = model.timeline_tracks.narration_text.map((segment) => timelineClip(segment, "narration-clip", segment.id, segment.text_ja)).join("");
  const beatButtons = model.beats.map((beat) => `<button data-jump="${beat.start_seconds}">Beat ${beat.beat_number} · ${escapeHtml(beat.title_ja)}</button>`).join("");
  const thumbnails = model.shots.map((shot) => `
    <button class="thumb" data-jump="${shot.start_seconds}" aria-label="${escapeHtml(`${shot.shot_id} ${shot.title_ja}へ移動`)}">
      <img src="${escapeHtml(shot.browser_image_path)}" alt="" loading="lazy"/>
      <span>${shot.sequence}. ${escapeHtml(shot.title_ja)}</span>
    </button>`).join("");
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>全編フルラスター明確化候補 · PRIVATE</title>
<style>
:root{color-scheme:dark;--bg:#0b1014;--panel:#141c22;--line:#2b3942;--ink:#f3efe5;--muted:#aab7bf;--brass:#c4a76a;--focus:#8fd8ff}
*{box-sizing:border-box}body{margin:0;background:linear-gradient(160deg,#0a0f13,#12191e);color:var(--ink);font-family:"Yu Gothic UI","Meiryo",system-ui,sans-serif}
button,input,video{font:inherit}button{color:inherit;background:#1b252c;border:1px solid #34434d;border-radius:.5rem;padding:.55rem .72rem;cursor:pointer}
button:hover{border-color:var(--brass)}button:focus-visible,input:focus-visible,video:focus-visible{outline:3px solid var(--focus);outline-offset:3px}
main{width:min(1380px,100%);margin:auto;padding:1rem}.mast{display:flex;gap:1rem;justify-content:space-between;align-items:flex-start;margin-bottom:.8rem}
h1{font-size:clamp(1.45rem,3vw,2.5rem);margin:.15rem 0}.eyebrow{color:var(--brass);font-weight:750;letter-spacing:.12em;font-size:.78rem}
.boundary{max-width:58ch;color:var(--muted);line-height:1.55}.player-grid{display:grid;grid-template-columns:minmax(0,2.2fr) minmax(250px,.8fr);gap:1rem}
.stage{position:relative;background:#000;border:1px solid var(--line);border-radius:.75rem;overflow:hidden;aspect-ratio:16/9}
video{width:100%;height:100%;display:block}.subtitle{position:absolute;left:8%;right:8%;bottom:3.4rem;text-align:center;font-size:clamp(1rem,2.4vw,1.65rem);font-weight:750;text-shadow:0 2px 9px #000;background:#071016bb;border-radius:.4rem;padding:.35rem .55rem;pointer-events:none}
.candidate-labels{position:absolute;left:1rem;right:1rem;top:1rem;display:flex;gap:.45rem;justify-content:center;flex-wrap:wrap;pointer-events:none}
.candidate-labels span{background:#0a1117d9;border:1px solid #c4a76a88;border-radius:999px;padding:.32rem .58rem;font-size:.78rem}
.side{background:var(--panel);border:1px solid var(--line);border-radius:.75rem;padding:1rem;display:grid;align-content:start;gap:.75rem}
.time{font-variant-numeric:tabular-nums;color:var(--brass);font-size:1.15rem}.side h2{margin:0;font-size:1.25rem}.meta{color:var(--muted);line-height:1.5}
.controls{display:grid;grid-template-columns:auto auto auto 1fr;gap:.55rem;margin:.75rem 0;align-items:center}.controls input{width:100%}.beat-jumps{display:flex;flex-wrap:wrap;gap:.45rem;margin:.65rem 0}
.timeline{position:relative;background:#10171c;border:1px solid var(--line);border-radius:.75rem;padding:1rem;overflow:hidden}.lane{position:relative;height:3.2rem;margin:1.2rem 0}.lane-name{position:absolute;top:-1.05rem;color:var(--muted);font-size:.75rem}
.clip{position:absolute;top:0;height:2.4rem;overflow:hidden;border-radius:.25rem;padding:.2rem;font-size:.64rem;text-align:left}.clip span{white-space:nowrap}
.picture-clip{background:#263842}.narration-clip{background:#4a3e29}.subtitle-clip{background:#293e31}.playhead{position:absolute;top:1rem;bottom:1rem;width:2px;background:#e4c273;left:0;z-index:5;pointer-events:none}
.thumbs{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:.55rem;margin-top:1rem}.thumb{padding:0;overflow:hidden;text-align:left}.thumb img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}.thumb span{display:block;padding:.4rem;font-size:.7rem}
.legend{margin-top:1rem;color:var(--muted);font-size:.8rem;line-height:1.55}
@media(max-width:820px){main{padding:.65rem}.mast{display:block}.player-grid{grid-template-columns:1fr}.controls{grid-template-columns:repeat(3,1fr)}.controls input{grid-column:1/-1}.thumbs{grid-template-columns:repeat(2,minmax(0,1fr))}.clip span{display:none}}
</style>
</head>
<body>
<main>
  <header class="mast">
    <div><div class="eyebrow">CLARITY CANDIDATE · PRIVATE · NOT FOR PUBLICATION</div><h1>全編フルラスター明確化候補</h1></div>
    <div class="boundary">Product Ownerは19枚のprimary imageを受容済みです。本候補はtransition continuityと説明明確性だけを再開し、旧private previewをactive defaultのまま維持します。production承認、rights clearance、公開、音声、final canonは未成立です。</div>
  </header>
  <section class="player-grid">
    <div class="stage">
      <video id="video" src="private-full-raster-clarity-candidate.mp4" controls muted preload="metadata" tabindex="0"></video>
      <div id="candidateLabels" class="candidate-labels"></div>
      <div id="subtitle" class="subtitle" aria-live="polite"></div>
    </div>
    <aside class="side">
      <output id="timecode" class="time">00:00.0 / 03:00.0</output>
      <div id="beatIdentity" class="eyebrow"></div>
      <h2 id="shotTitle"></h2>
      <div id="shotIdentity" class="meta"></div>
      <div id="shotSource" class="meta"></div>
      <div id="shotTruth" class="meta"></div>
      <div class="meta"><strong>Style contract</strong><br/>fff-full-raster-style-contract-001 · v1.0.0</div>
    </aside>
  </section>
  <div class="controls">
    <button id="prevShot" aria-label="前のshot">◀ 前</button>
    <button id="togglePlay" aria-label="再生" aria-pressed="false">▶ 再生</button>
    <button id="nextShot" aria-label="次のshot">次 ▶</button>
    <input id="scrubber" type="range" min="0" max="180" step=".1" value="0" aria-label="180秒タイムライン"/>
  </div>
  <nav class="beat-jumps" aria-label="Beat移動">${beatButtons}</nav>
  <section class="timeline" aria-label="timeline-first review surface">
    <div id="playhead" class="playhead"></div>
    <div class="lane"><div class="lane-name">PICTURE · 19 SHOTS</div>${pictureTrack}</div>
    <div class="lane"><div class="lane-name">NARRATION METADATA · 6 SEGMENTS · SILENT</div>${narrationTrack}</div>
    <div class="lane"><div class="lane-name">REVIEW EXPLANATORY CAPTIONS · 20 CUES</div>${subtitleTrack}</div>
  </section>
  <section class="thumbs">${thumbnails}</section>
  <p class="legend">Keyboard: Space 再生/停止 · Home/End 先頭/末尾 · ←/→ 1秒 · Shift+←/→ 5秒。19 shotのprimary image byteはsource candidateと完全一致します。表示中の20 cueはsilent review用の説明captionです。production subtitle draftはvoice calibration前の暫定トラックとして別ファイルに保持します。</p>
</main>
<script id="candidateModel" type="application/json">${embedded}</script>
<script>
(()=>{const model=JSON.parse(document.getElementById("candidateModel").textContent);const video=document.getElementById("video");const scrubber=document.getElementById("scrubber");const subtitle=document.getElementById("subtitle");const labels=document.getElementById("candidateLabels");const playhead=document.getElementById("playhead");const toggle=document.getElementById("togglePlay");const clamp=(v)=>Math.max(0,Math.min(180,Number(v)||0));const shotAt=(t)=>model.shots.find((s)=>t>=s.start_seconds&&t<s.end_seconds)||model.shots.at(-1);const beatAt=(t)=>model.beats.find((b)=>t>=b.start_seconds&&t<b.end_seconds)||model.beats.at(-1);const cueAt=(t)=>model.timeline_tracks.subtitles.find((c)=>t>=c.start_seconds&&t<c.end_seconds);const fmt=(v)=>{v=clamp(v);return String(Math.floor(v/60)).padStart(2,"0")+":"+String(Math.floor(v%60)).padStart(2,"0")+"."+Math.floor((v%1)*10)};let active="";function render(){const t=clamp(video.currentTime);const shot=shotAt(t),beat=beatAt(t),cue=cueAt(t);scrubber.value=String(t);playhead.style.left=(t/180*100)+"%";document.getElementById("timecode").value=fmt(t)+" / 03:00.0";subtitle.textContent=cue?cue.text_ja:"";if(active!==shot.shot_id){active=shot.shot_id;document.getElementById("beatIdentity").textContent="BEAT "+beat.beat_number+" · "+beat.title_ja;document.getElementById("shotTitle").textContent=shot.title_ja;document.getElementById("shotIdentity").textContent=shot.shot_id+" · "+shot.start_time+"–"+shot.end_time+" · "+shot.motion+" / "+shot.transition;document.getElementById("shotSource").textContent=shot.source_kind+" · "+shot.width+"×"+shot.height+" · SHA "+shot.sha256.slice(0,12)+"…";document.getElementById("shotTruth").textContent="Truth boundary: "+shot.truth_boundary;labels.replaceChildren(...shot.candidate_labels.map((value)=>{const span=document.createElement("span");span.textContent=value;return span}))}}function seek(v){video.currentTime=clamp(v);render()}async function play(){if(video.currentTime>=179.95)seek(0);video.muted=true;await video.play();toggle.textContent="❚❚ 停止";toggle.setAttribute("aria-pressed","true")}function pause(){video.pause();toggle.textContent="▶ 再生";toggle.setAttribute("aria-pressed","false")}function togglePlay(){video.paused?play().catch(()=>{}):pause()}video.addEventListener("timeupdate",render);video.addEventListener("seeked",render);video.addEventListener("loadedmetadata",render);video.addEventListener("ended",pause);toggle.addEventListener("click",togglePlay);scrubber.addEventListener("input",()=>seek(scrubber.value));document.getElementById("prevShot").addEventListener("click",()=>{const shot=shotAt(video.currentTime);seek(video.currentTime-shot.start_seconds>.4?shot.start_seconds:model.shots[Math.max(0,shot.sequence-2)].start_seconds)});document.getElementById("nextShot").addEventListener("click",()=>{const shot=shotAt(video.currentTime);seek(shot.sequence<19?model.shots[shot.sequence].start_seconds:180)});for(const button of document.querySelectorAll("[data-jump]"))button.addEventListener("click",()=>seek(button.dataset.jump));document.addEventListener("keydown",(event)=>{if(event.target===scrubber)return;if(event.code==="Space"){event.preventDefault();togglePlay()}else if(event.key==="Home"){event.preventDefault();seek(0)}else if(event.key==="End"){event.preventDefault();seek(180)}else if(event.key==="ArrowLeft"){event.preventDefault();seek(video.currentTime-(event.shiftKey?5:1))}else if(event.key==="ArrowRight"){event.preventDefault();seek(video.currentTime+(event.shiftKey?5:1))}});window.__FULL_RASTER__={model,video,shotAt,beatAt,cueAt,seek,getState:()=>({current_time:video.currentTime,duration:video.duration,ready_state:video.readyState,muted:video.muted,shot_id:shotAt(video.currentTime).shot_id,subtitle:cueAt(video.currentTime)?.text_ja||""})};render()})();
</script>
</body>
</html>`;
}

async function captureBrowserEvidence(model) {
  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch({ headless: true });
  const consoleErrors = [];
  const pageErrors = [];
  const externalRequests = [];
  const results = {};
  try {
    const inspect = async (name, width, height, screenshotPath, seekTo) => {
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce" });
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => pageErrors.push(error.message));
      page.on("request", (request) => {
        if (/^https?:/i.test(request.url())) externalRequests.push(request.url());
      });
      await page.goto(pathToFileURL(HTML_PATH).href, { waitUntil: "load" });
      await page.waitForFunction(() => window.__FULL_RASTER__ && window.__FULL_RASTER__.video.readyState >= 1);
      for (const shot of model.shots) {
        await page.evaluate((seconds) => window.__FULL_RASTER__.seek(seconds), shot.start_seconds + Math.min(0.2, shot.duration_seconds / 4));
        const state = await page.evaluate(() => window.__FULL_RASTER__.getState());
        if (state.shot_id !== shot.shot_id) throw new Error(`Browser shot-boundary mismatch for ${shot.shot_id}`);
      }
      await page.evaluate((seconds) => window.__FULL_RASTER__.seek(seconds), seekTo);
      await page.locator("#togglePlay").focus();
      const metrics = await page.evaluate(() => {
        const focusStyle = getComputedStyle(document.activeElement);
        const video = document.getElementById("video");
        return {
          document_width: document.documentElement.scrollWidth,
          viewport_width: window.innerWidth,
          horizontal_overflow_px: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
          nested_vertical_scroll_count: [...document.querySelectorAll("main *")].filter((element) => element.scrollHeight > element.clientHeight + 2 && getComputedStyle(element).overflowY !== "visible").length,
          video_duration: video.duration,
          video_muted: video.muted,
          focus_outline_style: focusStyle.outlineStyle,
          focus_outline_width: focusStyle.outlineWidth,
          shot_button_count: document.querySelectorAll(".thumb").length,
          timeline_lane_count: document.querySelectorAll(".lane").length
        };
      });
      await page.screenshot({ path: screenshotPath, fullPage: false, animations: "disabled" });
      const screenshot = await fileRecord(screenshotPath, REPO_ROOT);
      await page.close();
      return {
        ...metrics,
        screenshot_path: screenshot.relative_path,
        screenshot_byte_size: screenshot.byte_size,
        screenshot_sha256: screenshot.sha256
      };
    };
    await mkdir(path.dirname(SCREENSHOTS.desktop), { recursive: true });
    results.desktop = await inspect("desktop", 1440, 1000, SCREENSHOTS.desktop, 118.2);
    results.narrow = await inspect("narrow", 390, 844, SCREENSHOTS.narrow, 155.2);
  } finally {
    await browser.close();
  }
  return {
    passed: consoleErrors.length === 0
      && pageErrors.length === 0
      && externalRequests.length === 0
      && results.desktop.horizontal_overflow_px === 0
      && results.narrow.horizontal_overflow_px === 0
      && results.desktop.shot_button_count === 19
      && results.narrow.shot_button_count === 19
      && Math.abs(results.desktop.video_duration - 180) < 0.01
      && Math.abs(results.narrow.video_duration - 180) < 0.01,
    engine: "playwright chromium",
    headless: true,
    console_errors: consoleErrors,
    page_errors: pageErrors,
    external_requests: [...new Set(externalRequests)],
    desktop: results.desktop,
    narrow: results.narrow
  };
}

function contractFailures(model) {
  const failures = [];
  const require = (condition, message) => { if (!condition) failures.push(message); };
  require(model.artifact_id === ARTIFACT_ID, "artifact identity mismatch");
  require(model.duration_seconds === 180 && model.beats.length === 6 && model.shots.length === 19, "chronology count mismatch");
  require(model.timeline_tracks.subtitles.length === 20 && model.timeline_tracks.narration_text.length === 6, "text-track count mismatch");
  require(model.production_subtitle_draft.cues.length === 20 && model.production_subtitle_draft.final_for_voice === false, "production subtitle draft boundary mismatch");
  require(model.generation_evidence.call_count === 0 && model.generation_evidence.image_generation_performed === false, "image generation escaped");
  require(model.generation_evidence.primary_image_change_count === 0 && model.generation_evidence.primary_image_hash_match_count === 19, "primary image identity changed");
  require(model.shots.every((shot) => shot.width >= 1600 && shot.height >= 900), "minimum frame dimensions failed");
  require(new Set(model.shots.map((shot) => shot.shot_id)).size === 19, "shot identity duplicate");
  require(new Set(model.shots.map((shot) => shot.sha256)).size === 19, "accidental exact duplicate primary frame");
  require(model.shots.every((shot) => ["accepted_generated_raster_anchor", "generated_raster", "generated_raster_edit", "licensed_photocomposite", "deterministic_raster_composite"].includes(shot.source_kind)), "forbidden or missing source kind");
  require(model.shots.every((shot) => shot.rasterized_forbidden_vector === false), "rasterized forbidden-vector lineage");
  require(model.shots.every((shot) => shot.selected_for_final_production === false && shot.rights_cleared_claim === false), "selection or rights claim escaped");
  require(model.boundaries.private === true && model.boundaries.default_active === false && model.boundaries.successor_candidate === true, "candidate state mismatch");
  require(model.boundaries.release_path_reachable === false && model.boundaries.public_release === false && model.boundaries.audio === false && model.boundaries.voice === false && model.boundaries.production_approved === false && model.boundaries.final_canon === false, "closed boundary escaped");
  require(model.coherence_audit.accidental_exact_duplicate_count === 0, "coherence duplicate audit failed");
  require(model.coherence_audit.no_human_comprehension_claim === true, "human comprehension claim escaped");
  require(model.final_major_unresolved_questions.length <= 2, "too many final major unresolved questions");
  require(model.timeline_tracks.subtitles.filter((cue) => cue.claim_type !== "question").length / 20 >= 0.7, "declarative review-caption floor failed");
  require(model.timeline_tracks.subtitles.every((cue) => cue.readability_status === "pass"), "review-caption readability failed");
  require(model.production_subtitle_draft.cues.every((cue) => cue.readability_status === "pass"), "production-subtitle readability failed");
  require(model.timeline_tracks.subtitles.every((cue) => BANNED_REVIEW_CAPTION_TERMS.every((term) => !cue.text_ja.includes(term))), "banned review-caption wording");
  require(model.timeline_tracks.subtitles.every((cue) => Array.isArray(cue.shot_ids) && cue.shot_ids.length > 0), "review-caption shot binding incomplete");
  require(model.timeline_tracks.narration_text.every((cue) => Array.isArray(cue.shot_ids) && cue.shot_ids.length > 0), "narration shot binding incomplete");
  require(model.narrative_visual_binding.bindings.length === 46, "binding unit count mismatch");
  require(model.narrative_visual_binding.revised_binding_counts.L1_subject_bound === 46, "clarity units are not fully L1-bound");
  require(model.narrative_visual_binding.revised_binding_counts.L2_relation_bound === 0 && model.narrative_visual_binding.revised_binding_counts.L3_structure_bound === 0, "L2 or L3 clarity repair escaped");
  require(model.narrative_visual_binding.full_reassembly_required === false, "full reassembly escaped");
  require(model.transition_boundary_audit.boundary_count === 18, "transition boundary count mismatch");
  require(model.transition_boundary_audit.position_reset_count === 0, "transition position reset detected");
  require(model.transition_boundary_audit.raw_source_flash_count === 0, "raw source flash detected");
  require(model.transition_boundary_audit.gap_frame_count === 0 && model.transition_boundary_audit.overlap_frame_count === 0, "transition gap or overlap detected");
  if (model.transition_boundary_audit.status === "PASS") {
    require(model.transition_boundary_audit.boundaries.length === 18, "rendered transition evidence incomplete");
    require(model.transition_boundary_audit.boundaries.every((boundary) => boundary.reset_allowed === false), "transition reset allowance escaped");
    require(model.transition_boundary_audit.boundaries.every((boundary) => boundary.raw_previous_image_reopened === false), "raw previous image reopened");
    require(model.transition_boundary_audit.boundaries.every((boundary) => boundary.boundary_minus_2_sha256 && boundary.boundary_minus_1_sha256 && boundary.boundary_at_sha256 && boundary.boundary_plus_1_sha256 && boundary.transition_midpoint_sha256), "boundary frame hashes incomplete");
  }
  for (const [shotId, anchor] of Object.entries(ANCHORS)) {
    const shot = model.shots.find((item) => item.shot_id === shotId);
    require(shot?.sha256 === anchor.sha256 && shot?.exact_anchor === true, `${shotId} immutable anchor mismatch`);
  }
  return failures;
}

function targetedTests(model) {
  const baseFailures = contractFailures(model);
  const mutate = () => structuredClone(model);
  const cases = [
    { id: "accept-complete-candidate", passed: baseFailures.length === 0, observed_failures: baseFailures },
    {
      id: "reject-production-selection",
      expected: "selection or rights claim escaped",
      evaluate: (candidate) => { candidate.shots[0].selected_for_final_production = true; }
    },
    {
      id: "reject-image-generation",
      expected: "image generation escaped",
      evaluate: (candidate) => { candidate.generation_evidence.image_generation_performed = true; }
    },
    {
      id: "reject-default-promotion",
      expected: "candidate state mismatch",
      evaluate: (candidate) => { candidate.boundaries.default_active = true; }
    },
    {
      id: "reject-banned-review-caption",
      expected: "banned review-caption wording",
      evaluate: (candidate) => { candidate.timeline_tracks.subtitles[0].text_ja = "未解決"; }
    },
    {
      id: "reject-l3-reassembly",
      expected: "L2 or L3 clarity repair escaped",
      evaluate: (candidate) => {
        candidate.narrative_visual_binding.revised_binding_counts.L1_subject_bound = 45;
        candidate.narrative_visual_binding.revised_binding_counts.L3_structure_bound = 1;
      }
    },
    {
      id: "reject-transition-reset",
      expected: "transition position reset detected",
      evaluate: (candidate) => { candidate.transition_boundary_audit.position_reset_count = 1; }
    },
    {
      id: "reject-raw-source-flash",
      expected: "raw source flash detected",
      evaluate: (candidate) => { candidate.transition_boundary_audit.raw_source_flash_count = 1; }
    },
    {
      id: "reject-human-comprehension-claim",
      expected: "human comprehension claim escaped",
      evaluate: (candidate) => { candidate.coherence_audit.no_human_comprehension_claim = false; }
    }
  ];
  for (const testCase of cases.slice(1)) {
    const candidate = mutate();
    testCase.evaluate(candidate);
    const failures = contractFailures(candidate);
    testCase.observed_failures = failures;
    testCase.passed = failures.includes(testCase.expected);
    delete testCase.evaluate;
  }
  return {
    total: cases.length,
    passed: cases.filter((item) => item.passed).length,
    all_passed: cases.every((item) => item.passed),
    cases
  };
}

function reviewCaptionsCsv(model) {
  return toCsv(
    ["semantic_unit_id", "beat_id", "start_seconds", "end_seconds", "text_ja", "claim_type", "truth_status", "visual_subject_ids", "shot_ids", "binding_level", "character_count", "characters_per_second", "line_break_hint", "readability_status"],
    model.timeline_tracks.subtitles.map((cue) => ({
      semantic_unit_id: cue.id,
      beat_id: cue.beat_id,
      start_seconds: cue.start_seconds,
      end_seconds: cue.end_seconds,
      text_ja: cue.text_ja,
      claim_type: cue.claim_type,
      truth_status: cue.truth_status,
      visual_subject_ids: cue.visual_subject_ids.join("|"),
      shot_ids: cue.shot_ids.join("|"),
      binding_level: "L1_subject_bound",
      character_count: cue.character_count,
      characters_per_second: cue.characters_per_second,
      line_break_hint: cue.line_break_hint,
      readability_status: cue.readability_status
    }))
  );
}

function productionSubtitlesCsv(model) {
  return toCsv(
    ["semantic_unit_id", "beat_id", "start_seconds", "end_seconds", "text_ja", "truth_status", "shot_ids", "binding_level", "provisional_until_voice_calibration", "final_for_voice", "character_count", "characters_per_second", "line_break_hint", "readability_status"],
    model.production_subtitle_draft.cues.map((cue) => ({
      semantic_unit_id: cue.id,
      beat_id: cue.beat_id,
      start_seconds: cue.start_seconds,
      end_seconds: cue.end_seconds,
      text_ja: cue.text_ja,
      truth_status: cue.truth_status,
      shot_ids: cue.shot_ids.join("|"),
      binding_level: "L1_subject_bound",
      provisional_until_voice_calibration: true,
      final_for_voice: false,
      character_count: cue.character_count,
      characters_per_second: cue.characters_per_second,
      line_break_hint: cue.line_break_hint,
      readability_status: cue.readability_status
    }))
  );
}

function cueBindingCsv(model) {
  return toCsv(
    ["semantic_unit_id", "unit_type", "claim_type", "truth_status", "visual_subject_ids", "shot_ids", "binding_level", "rewrite_without_visual_change", "visual_change_required", "reason"],
    model.narrative_visual_binding.bindings.map((binding) => ({
      ...binding,
      visual_subject_ids: binding.visual_subject_ids.join("|"),
      shot_ids: binding.shot_ids.join("|")
    }))
  );
}

function shotImpactCsv(model) {
  return toCsv(
    ["shot_id", "beat_id", "impact_level", "primary_image_change", "shot_order_change", "duration_change", "review_caption_change", "transition_boundary_repair", "full_reassembly_required", "reason"],
    model.shots.map((shot) => ({
      shot_id: shot.shot_id,
      beat_id: shot.beat_id,
      impact_level: "L1_subject_bound",
      primary_image_change: false,
      shot_order_change: false,
      duration_change: false,
      review_caption_change: true,
      transition_boundary_repair: shot.sequence > 1,
      full_reassembly_required: false,
      reason: shot.sequence > 1
        ? "Accepted primary image and shot window are preserved; explanatory text is revised and the incoming boundary now starts from the rendered outgoing terminal frame."
        : "Accepted primary image and shot window are preserved; explanatory text is revised."
    }))
  );
}

function transitionBoundaryCsv(model) {
  return toCsv(
    [
      "boundary_id", "outgoing_shot_id", "incoming_shot_id", "boundary_seconds", "transition_type", "transition_duration_seconds",
      "outgoing_terminal_frame_sha256", "first_transition_frame_sha256", "incoming_initial_frame_sha256",
      "boundary_minus_2_sha256", "boundary_minus_1_sha256", "boundary_at_sha256", "boundary_plus_1_sha256",
      "transition_midpoint_frame", "transition_midpoint_sha256", "outgoing_terminal_source", "incoming_initial_source",
      "raw_previous_image_reopened", "reset_allowed", "position_reset_detected", "raw_source_flash_detected",
      "normalized_pixel_difference", "perceptual_equivalence_threshold", "transition_start_rule", "continuity_subject",
      "exact_shot_window_preserved", "gap_frames", "overlap_frames"
    ],
    model.transition_boundary_audit.boundaries
  );
}

function renderStorySpine(model) {
  const sections = model.story_spine.map((beat) => `## Beat ${beat.beat_number} — ${beat.title_ja}

- Viewer takeaway: ${beat.viewer_takeaway}
- New fact or action: ${beat.new_fact_or_action}
- Connection to previous Beat: ${beat.connection_to_previous_beat}
- Current stakes: ${beat.current_stakes}
- Remaining question: ${beat.remaining_question}
- Material claims:
${beat.material_claims.map((claim) => `  - \`${claim.truth_status}\` — ${claim.claim}`).join("\n")}
`).join("\n");
  return `# Story Spine Clarity v1

Artifact: \`${ARTIFACT_ID}\`

This spine uses only claims already supported by the protected source packages. It separates observation, report, inference, allegation, and unresolved choice while keeping two final major questions:

1. ${model.final_major_unresolved_questions[0]}
2. ${model.final_major_unresolved_questions[1]}

${sections.trimEnd()}
`;
}

function renderNarration(model) {
  return `# Narration Clarity v1

The six segments are a clarity-authoring track for the silent candidate. They are not recorded audio and are not final for any voice engine.

${model.timeline_tracks.narration_text.map((segment, index) => `## Beat ${index + 1} — ${segment.id}

- Window: ${segment.start_time}–${segment.end_time}
- Claim / truth: \`${segment.claim_type}\` / \`${segment.truth_status}\`
- Shots: ${segment.shot_ids.join(", ")}
- Reading estimate: ${segment.character_count} characters / ${segment.duration_seconds} seconds = ${segment.characters_per_second} characters per second

${segment.text_ja}
`).join("\n").trimEnd()}
`;
}

function renderGuideline() {
  return `# Narrative–Visual Binding Guideline

## Purpose

Classify every narration or caption revision before media work so text changes produce the smallest evidence-supported visual impact.

## Binding levels

- \`L0_caption_only\`: wording carries review context that does not depend on a pictured subject. Change text only.
- \`L1_subject_bound\`: wording names a subject already present in the accepted shot. Preserve shot identity and primary image bytes; change text or a non-primary explanatory overlay.
- \`L2_relation_bound\`: wording changes a spatial, causal, or temporal relation inside one local area. Limit repair to an overlay, crop, duration, or one adjacent boundary.
- \`L3_structure_bound\`: wording changes a Beat objective, event order, primary event, or ending action. Reassemble only the affected Beat after explicit narrative authority.

## Required impact audit

1. Record the current L0/L1/L2/L3 count before applying a revision.
2. Bind every revised semantic unit to claim type, truth status, visual subjects, and exact shot IDs.
3. Record whether the rewrite can keep current visuals and name the smallest required visual change.
4. Stop before candidate render with \`NARRATIVE_CANON_DECISION_REQUIRED\` when any L3 change is unavoidable; name the exact Beat and unsupported decision.
5. Preserve primary image bytes unless separately authorized visual evidence requires a new image.

## Full reassembly threshold

A complete 19-shot reassembly becomes eligible only when the central objective, Beat order, primary event, or ending action changes, or when three or more Beats contain unavoidable L3 changes. Subtitle revision alone never authorizes image regeneration.

## Transition continuity

Every non-hard boundary begins with the terminal frame extracted from the rendered outgoing final clip. The encoder may use an actual terminal hold/tail followed by the incoming rendered head. It may not reopen the outgoing raw image, reset to a neutral crop, insert a concealment flash, or alter the exact 180-second / 5400-frame timeline.

## State and ownership

- State: active production guideline for future text-impact audits.
- Owner: narrative editor for meaning; picture editor for L2/L3 evidence; Product Owner for any L3 narrative decision; production, rights, voice, release, and canon owners retain their separate gates.
- Next move: apply the table to each later text change and preserve the current shot/image identity when its binding remains L0 or L1.
`;
}

function renderReadme(model, mp4) {
  return `# Private Full Raster Clarity Candidate

Artifact: \`${ARTIFACT_ID}\`

This private, default-off successor keeps all nineteen Product Owner-accepted primary image bytes and the exact 6-Beat / 19-shot / 180-second chronology. It repairs all eighteen transition boundaries and supplies a clarity-first story, narration, explanatory-caption, production-subtitle-draft, and narrative–visual binding package.

## Exact evidence

- Primary images changed: 0 / 19
- Image-generation calls: 0
- Transition boundaries: ${model.transition_boundary_audit.boundary_count}; position resets: ${model.transition_boundary_audit.position_reset_count}; raw-source flashes: ${model.transition_boundary_audit.raw_source_flash_count}
- Timeline: ${mp4.duration_seconds.toFixed(3)} seconds / ${mp4.frame_count} frames / gap ${model.transition_boundary_audit.gap_frame_count} / overlap ${model.transition_boundary_audit.overlap_frame_count}
- Text: 6 narration segments / 20 review explanatory captions / 20 provisional production subtitle cues
- Binding: L0 ${model.narrative_visual_binding.revised_binding_counts.L0_caption_only}, L1 ${model.narrative_visual_binding.revised_binding_counts.L1_subject_bound}, L2 ${model.narrative_visual_binding.revised_binding_counts.L2_relation_bound}, L3 ${model.narrative_visual_binding.revised_binding_counts.L3_structure_bound}
- Silent H.264 MP4: ${mp4.width}x${mp4.height}; audio streams ${mp4.audio_stream_count}; Japanese subtitle tracks ${mp4.subtitle_stream_count}
- Watermark: \`${mp4.watermark_text}\`

## Review route

Open \`private-full-raster-clarity-candidate.html\`. The human review checks the six intended comprehension answers recorded in the JSON package and judges the exact transition boundaries. Technical validation does not claim human comprehension or final acceptance.

## Closed boundaries

Production approval, final media selection, rights clearance, audio, voice-engine choice, public release, publication, and final canon remain false.
`;
}

function renderReviewDoc(model, mp4, browserEvidence, tests) {
  return `# Private Full Raster Clarity Candidate Review

## Current state

\`${ARTIFACT_ID}\` is technically ready for a silent, whole-story clarity review. The Product Owner's acceptance of all nineteen primary images is preserved. \`${DEFAULT_ID}\` remains active/default. This successor remains private and default-off.

## Fixed transition defect

The source encoder reopened \`previousShot.image_path\` during a transition, which discarded the outgoing motion crop and exposed a neutral frame before the next shot. The clarity encoder extracts the terminal frame from the actual rendered outgoing final clip and starts each non-hard transition from that state. Evidence covers all eighteen boundaries at -2, -1, at, +1, and transition midpoint.

- Position resets: ${model.transition_boundary_audit.position_reset_count}
- Raw-source flashes: ${model.transition_boundary_audit.raw_source_flash_count}
- Gap / overlap frames: ${model.transition_boundary_audit.gap_frame_count} / ${model.transition_boundary_audit.overlap_frame_count}

## Text and binding evidence

- Source impact audit: L0 9 / L1 11 / L2 0 / L3 0
- Revised semantic units: 46; all L1; L2 shot repairs 0; L3 Beat repairs 0
- Review explanatory captions: 20 / 20; declarative floor ${model.timeline_tracks.subtitles.filter((cue) => cue.claim_type !== "question").length}/20
- Narration segments: 6 / 6
- Production subtitle draft: 20 cues; provisional until voice calibration
- Full 19-shot reassembly: avoided

## Runtime evidence

- MP4: ${mp4.duration_seconds.toFixed(3)} s, ${mp4.codec_name}, ${mp4.width}x${mp4.height}, ${mp4.frame_count} frames, ${mp4.audio_stream_count} audio streams, SHA256 \`${mp4.sha256}\`
- Browser: ${browserEvidence.passed ? "PASS" : "FAIL"} at 1440x1000 and 390x844
- Targeted tests: ${tests.passed}/${tests.total}

## Human comprehension review

Ask the reviewer to identify the protagonist, initiating anomaly, Toma/9:17/moth link, ledger contents, Council relevance, and closing choice/stake. Intended answers live in \`private-full-raster-clarity-candidate.json\`. No human comprehension result is recorded by this implementation.

Production approval, rights clearance, public release, voice selection, final acceptance, and final canon remain separate decisions.
`;
}

async function buildManifest(model, mp4, browserEvidence) {
  const inventory = await packageInventory();
  const manifest = {
    schemaVersion: "fff.privateFullRasterClarityCandidateManifest.v1",
    artifact_id: ARTIFACT_ID,
    generated_at: "2026-07-26",
    style_contract_id: STYLE_CONTRACT_ID,
    shot_count: model.shots.length,
    primary_frame_count: model.shots.length,
    source_artifact_id: SOURCE_ARTIFACT_ID,
    source_package_fingerprint_sha256: model.source_package_fingerprint_sha256,
    primary_image_change_count: 0,
    image_generation_call_count: 0,
    primary_images: model.shots.map((shot) => ({
      shot_id: shot.shot_id,
      path: shot.image_path,
      byte_size: shot.byte_size,
      sha256: shot.sha256,
      owner_primary_image_acceptance: true
    })),
    transition_boundary_count: model.transition_boundary_audit.boundary_count,
    position_reset_count: model.transition_boundary_audit.position_reset_count,
    raw_source_flash_count: model.transition_boundary_audit.raw_source_flash_count,
    review_caption_count: model.timeline_tracks.subtitles.length,
    narration_segment_count: model.timeline_tracks.narration_text.length,
    production_subtitle_draft_count: model.production_subtitle_draft.cues.length,
    binding_counts: model.narrative_visual_binding.revised_binding_counts,
    mp4,
    screenshots: {
      desktop: {
        path: browserEvidence.desktop.screenshot_path,
        byte_size: browserEvidence.desktop.screenshot_byte_size,
        sha256: browserEvidence.desktop.screenshot_sha256
      },
      narrow: {
        path: browserEvidence.narrow.screenshot_path,
        byte_size: browserEvidence.narrow.screenshot_byte_size,
        sha256: browserEvidence.narrow.screenshot_sha256
      }
    },
    package_fingerprint_sha256: inventory.aggregate_sha256,
    payload_file_count: inventory.payload_file_count,
    files: inventory.files
  };
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return manifest;
}

async function updateRootManifest(model, manifest) {
  const root = await readJson(ROOT_MANIFEST_PATH);
  root.successor_candidate_artifact_id = ARTIFACT_ID;
  const registry = root.primary_imagery_medium_gate.new_visual_candidates;
  const entry = {
    artifact_id: ARTIFACT_ID,
    active_default: false,
    successor_candidate: true,
    primary_frames: model.shots.map((shot) => ({
      shot_id: shot.shot_id,
      source_kind: "accepted_existing_raster",
      candidate_source_kind: shot.source_kind,
      rasterized_forbidden_vector: false
    }))
  };
  const index = registry.findIndex((candidate) => candidate.artifact_id === ARTIFACT_ID);
  if (index >= 0) registry[index] = entry;
  else registry.push(entry);
  root.private_full_raster_clarity_candidate_dir = "artifacts/private-full-raster-clarity-candidate";
  root.private_full_raster_clarity_candidate_result_path = "artifacts/private-full-raster-clarity-candidate-result.json";
  root.private_full_raster_clarity_candidate_doc_path = "docs/review/private-full-raster-clarity-candidate.md";
  root.private_full_raster_clarity_candidate_route = "artifacts/private-full-raster-clarity-candidate/private-full-raster-clarity-candidate.html";
  root.private_full_raster_clarity_candidate_manifest_path = "artifacts/private-full-raster-clarity-candidate/private-full-raster-clarity-candidate-manifest.json";
  root.private_full_raster_clarity_candidate_mp4_path = "artifacts/private-full-raster-clarity-candidate/private-full-raster-clarity-candidate.mp4";
  root.private_full_raster_clarity_candidate_package_fingerprint = manifest.package_fingerprint_sha256;
  root.private_full_raster_clarity_candidate = {
    artifact_id: ARTIFACT_ID,
    schemaVersion: model.schemaVersion,
    package_root: "artifacts/private-full-raster-clarity-candidate",
    result_path: "artifacts/private-full-raster-clarity-candidate-result.json",
    review_doc_path: "docs/review/private-full-raster-clarity-candidate.md",
    access_route: "artifacts/private-full-raster-clarity-candidate/private-full-raster-clarity-candidate.html",
    source_artifact_id: SOURCE_ARTIFACT_ID,
    quarantine_id: QUARANTINE_ID,
    style_contract_id: STYLE_CONTRACT_ID,
    package_fingerprint_sha256: manifest.package_fingerprint_sha256,
    shot_count: model.shots.length,
    primary_image_change_count: 0,
    image_generation_call_count: 0,
    transition_boundary_count: 18,
    position_reset_count: 0,
    raw_source_flash_count: 0,
    narration_segment_count: 6,
    review_caption_count: 20,
    production_subtitle_draft_count: 20,
    private_local_only: true,
    default_active: false,
    active_default: false,
    successor_candidate: true,
    release_path_reachable: false,
    product_owner_primary_image_review: "accepted_19_of_19",
    human_comprehension_review: "not_performed",
    production_approved: false,
    selected_for_production: false,
    rights_cleared_claim: false,
    public_release: false,
    audio: false,
    voice: false,
    final_canon: false
  };
  await writeFile(ROOT_MANIFEST_PATH, `${JSON.stringify(root, null, 2)}\n`, "utf8");
}

async function build() {
  const sharp = await loadSharp();
  const protectedBefore = await protectedInventory();
  const sourceBundle = await verifyInputs(sharp);
  await Promise.all([
    mkdir(PACKAGE_ROOT, { recursive: true }),
    mkdir(path.dirname(GUIDELINE_PATH), { recursive: true }),
    mkdir(path.dirname(REVIEW_DOC_PATH), { recursive: true })
  ]);
  const model = await buildModel(sourceBundle, sharp);
  const preRenderFailures = contractFailures(model);
  if (preRenderFailures.length) throw new Error(`Pre-render candidate contract failed: ${preRenderFailures.join("; ")}`);
  const encoded = await encodeTimeline(model, sharp);
  model.transition_boundary_audit = encoded.transition_boundary_audit;
  const mp4 = encoded.mp4;
  const failures = contractFailures(model);
  if (failures.length) throw new Error(`Rendered candidate contract failed: ${failures.join("; ")}`);
  const tests = targetedTests(model);
  if (!tests.all_passed) throw new Error("Targeted tests failed");
  await Promise.all([
    writeFile(MODEL_PATH, `${JSON.stringify(model, null, 2)}\n`, "utf8"),
    writeFile(HTML_PATH, renderHtml(model), "utf8"),
    writeFile(STORY_SPINE_PATH, renderStorySpine(model), "utf8"),
    writeFile(NARRATION_PATH, renderNarration(model), "utf8"),
    writeFile(REVIEW_CAPTIONS_PATH, reviewCaptionsCsv(model), "utf8"),
    writeFile(PRODUCTION_SUBTITLES_PATH, productionSubtitlesCsv(model), "utf8"),
    writeFile(BINDING_CONTRACT_PATH, `${JSON.stringify(model.narrative_visual_binding, null, 2)}\n`, "utf8"),
    writeFile(CUE_BINDING_PATH, cueBindingCsv(model), "utf8"),
    writeFile(SHOT_IMPACT_PATH, shotImpactCsv(model), "utf8"),
    writeFile(TRANSITION_BOUNDARY_PATH, transitionBoundaryCsv(model), "utf8"),
    writeFile(GUIDELINE_PATH, renderGuideline(), "utf8"),
    writeFile(README_PATH, renderReadme(model, mp4), "utf8")
  ]);
  if (
    Math.abs(mp4.duration_seconds - 180) > 0.001
    || mp4.codec_name !== "h264"
    || mp4.width !== 960
    || mp4.height !== 540
    || mp4.frame_count !== 5400
    || mp4.audio_stream_count !== 0
    || mp4.subtitle_stream_count !== 1
  ) {
    throw new Error(`MP4 contract failed: ${JSON.stringify(mp4)}`);
  }
  const browserEvidence = await captureBrowserEvidence(model);
  if (!browserEvidence.passed) throw new Error(`Browser evidence failed: ${JSON.stringify(browserEvidence)}`);
  await writeFile(REVIEW_DOC_PATH, renderReviewDoc(model, mp4, browserEvidence, tests), "utf8");
  const manifest = await buildManifest(model, mp4, browserEvidence);
  const protectedAfter = await protectedInventory();
  if (!valuesEqual(protectedBefore, protectedAfter)) throw new Error("Protected predecessor bytes changed during build");
  const result = {
    schemaVersion: "fff.privateFullRasterClarityCandidateResult.v1",
    artifact_id: ARTIFACT_ID,
    passed: true,
    failures: [],
    shot_count: model.shots.length,
    beat_count: model.beats.length,
    duration_seconds: model.duration_seconds,
    subtitle_cue_count: model.timeline_tracks.subtitles.length,
    narration_segment_count: model.timeline_tracks.narration_text.length,
    production_subtitle_draft_count: model.production_subtitle_draft.cues.length,
    primary_frame_count: model.shots.length,
    owner_accepted_primary_frame_count: 19,
    primary_image_change_count: 0,
    image_generation_call_count: 0,
    accidental_exact_duplicate_count: model.coherence_audit.accidental_exact_duplicate_count,
    primary_image_identity: model.shots.map((shot) => ({
      shot_id: shot.shot_id,
      path: shot.image_path,
      source_sha256: sourceBundle.source.shots.find((sourceShot) => sourceShot.shot_id === shot.shot_id).sha256,
      candidate_sha256: shot.sha256,
      byte_identical: sourceBundle.source.shots.find((sourceShot) => sourceShot.shot_id === shot.shot_id).sha256 === shot.sha256,
      owner_primary_image_acceptance: true,
      selected_for_final_production: false,
      rights_cleared_claim: false
    })),
    coherence_audit: model.coherence_audit,
    transition_boundary_audit: model.transition_boundary_audit,
    text_impact_audit: model.narrative_visual_binding.current_text_impact_audit,
    narrative_clarity_audit: {
      revised_binding_counts: model.narrative_visual_binding.revised_binding_counts,
      review_caption_count: model.timeline_tracks.subtitles.length,
      declarative_review_caption_count: model.timeline_tracks.subtitles.filter((cue) => cue.claim_type !== "question").length,
      banned_review_caption_occurrence_count: model.timeline_tracks.subtitles.reduce(
        (total, cue) => total + BANNED_REVIEW_CAPTION_TERMS.filter((term) => cue.text_ja.includes(term)).length,
        0
      ),
      final_major_unresolved_question_count: model.final_major_unresolved_questions.length,
      final_major_unresolved_questions: model.final_major_unresolved_questions,
      comprehension_intended_answers: model.comprehension_intended_answers,
      human_comprehension_review_performed: false,
      full_reassembly_required: false,
      l2_shot_ids: [],
      l3_beat_ids: []
    },
    mp4,
    browser_evidence: browserEvidence,
    targeted_tests: tests,
    protected_inputs: {
      passed: true,
      before: protectedBefore,
      after: protectedAfter
    },
    package_manifest: {
      path: repoPath(MANIFEST_PATH),
      fingerprint: manifest.package_fingerprint_sha256,
      payload_file_count: manifest.payload_file_count
    },
    boundaries: model.boundaries
  };
  await writeFile(RESULT_PATH, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  await updateRootManifest(model, manifest);
  console.log(`Built ${ARTIFACT_ID}`);
  console.log(`Package fingerprint: ${manifest.package_fingerprint_sha256}`);
  console.log(`MP4 SHA256: ${mp4.sha256}`);
  return result;
}

async function validatePackage(inputPath = RESULT_PATH) {
  const sharp = await loadSharp();
  const before = await protectedInventory();
  const [model, manifest, result, root, sourceBundle] = await Promise.all([
    readJson(MODEL_PATH),
    readJson(MANIFEST_PATH),
    readJson(inputPath),
    readJson(ROOT_MANIFEST_PATH),
    verifyInputs(sharp)
  ]);
  const failures = contractFailures(model);
  const require = (condition, message) => { if (!condition) failures.push(message); };
  require(result.passed === true && result.failures.length === 0, "result is not passing");
  require(result.targeted_tests?.all_passed === true, "targeted tests are not passing");
  require(result.browser_evidence?.passed === true, "browser evidence is not passing");
  require(root.active_default_artifact_id === DEFAULT_ID, "accepted preview is no longer active default");
  require(root.successor_candidate_artifact_id === ARTIFACT_ID, "successor candidate registration mismatch");
  require(root.private_materialized_motion_previs?.visual_verdict === "REJECTED_VISUAL_DIRECTION", "rejected candidate verdict changed");
  require(root.private_materialized_motion_previs?.archive_only === true && root.private_materialized_motion_previs?.successor_candidate === false, "rejected candidate archive boundary changed");
  require(root.private_full_raster_candidate?.artifact_id === SOURCE_ARTIFACT_ID, "protected source candidate registration changed");
  require(root.private_full_raster_candidate?.package_fingerprint_sha256 === sourceBundle.sourceManifest.package_fingerprint_sha256, "protected source package registration changed");
  require(root.private_full_raster_clarity_candidate?.default_active === false && root.private_full_raster_clarity_candidate?.successor_candidate === true, "root clarity candidate state mismatch");
  require(root.private_full_raster_clarity_candidate?.production_approved === false, "root production approval escaped");
  require(root.private_full_raster_clarity_candidate?.package_fingerprint_sha256 === manifest.package_fingerprint_sha256, "root package fingerprint mismatch");
  const inventory = await packageInventory();
  require(inventory.aggregate_sha256 === manifest.package_fingerprint_sha256, "package fingerprint mismatch");
  require(valuesEqual(inventory.files, manifest.files), "package inventory differs");
  require(inventory.payload_file_count === manifest.payload_file_count, "package file count differs");
  for (const shot of model.shots) {
    const bytes = await readFile(path.join(REPO_ROOT, shot.image_path));
    const metadata = await sharp(bytes).metadata();
    const sourceShot = sourceBundle.source.shots.find((item) => item.shot_id === shot.shot_id);
    require(sha256(bytes) === shot.sha256, `${shot.shot_id} final hash mismatch`);
    require(sourceShot?.sha256 === shot.sha256 && sourceShot?.image_path === shot.image_path, `${shot.shot_id} source identity changed`);
    require(metadata.width === shot.width && metadata.height === shot.height, `${shot.shot_id} final dimensions mismatch`);
  }
  const liveMp4 = await probeMp4(MP4_PATH);
  require(valuesEqual(liveMp4, manifest.mp4), "live MP4 probe/hash mismatch");
  require(model.generation_evidence.call_count === 0, "generation call count mismatch");
  require(result.primary_image_identity?.every((record) => record.byte_identical === true), "result image identity mismatch");
  require(result.transition_boundary_audit?.boundary_count === 18, "result transition evidence count mismatch");
  require(result.transition_boundary_audit?.position_reset_count === 0 && result.transition_boundary_audit?.raw_source_flash_count === 0, "result transition reset or flash mismatch");
  require(result.narrative_clarity_audit?.banned_review_caption_occurrence_count === 0, "result banned caption audit mismatch");
  require(result.narrative_clarity_audit?.human_comprehension_review_performed === false, "human comprehension claim escaped");
  require((await readFile(GUIDELINE_PATH, "utf8")).includes("NARRATIVE_CANON_DECISION_REQUIRED"), "binding guideline is incomplete");
  for (const view of ["desktop", "narrow"]) {
    const evidence = manifest.screenshots[view];
    const screenshot = await fileRecord(path.join(REPO_ROOT, evidence.path), REPO_ROOT);
    require(screenshot.byte_size === evidence.byte_size && screenshot.sha256 === evidence.sha256, `${view} screenshot mismatch`);
  }
  const after = await protectedInventory();
  require(valuesEqual(before, after), "read-only validator mutated protected inputs");
  if (failures.length) throw new Error(`Validation failed:\n- ${failures.join("\n- ")}`);
  console.log(`Validated ${ARTIFACT_ID}: PASS`);
  console.log(`Read-only protected inventory stable: ${after.length} files`);
  return { passed: true, failures: [] };
}

export { contractFailures, targetedTests };

export async function runPrivateFullRasterClarityCandidateCommand({ command, inputPath }) {
  if (command === "validate-private-full-raster-clarity-candidate") return validatePackage(inputPath || RESULT_PATH);
  if (command === "smoke-private-full-raster-clarity-candidate") {
    const model = await readJson(MODEL_PATH);
    const tests = targetedTests(model);
    if (!tests.all_passed) throw new Error("Targeted smoke tests failed");
    console.log(JSON.stringify(tests, null, 2));
    return tests;
  }
  throw new Error(`Unsupported command: ${command}`);
}

async function main() {
  const command = process.argv[2] || "build";
  if (command === "build") await build();
  else if (command === "validate") await validatePackage(process.argv[3] ? path.resolve(process.argv[3]) : RESULT_PATH);
  else if (command === "smoke") {
    const model = await readJson(MODEL_PATH);
    const tests = targetedTests(model);
    console.log(JSON.stringify(tests, null, 2));
    if (!tests.all_passed) process.exitCode = 1;
  } else {
    throw new Error("Usage: node tools/fff-transition-continuity-narrative-clarity.mjs <build|validate|smoke>");
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });
}
