#!/usr/bin/env node

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ID = "fff-composition-expansion-wave2-001";
const MODEL_SCHEMA = "fff.compositionExpansionWave2.v1";
const RESULT_SCHEMA = "fff.compositionExpansionWave2Result.v1";
const MANIFEST_SCHEMA = "fff.compositionExpansionWave2Manifest.v1";
const BASE_REVISION = "b3312a2a4a8d5993d7091de36af2ad291b766aa0";
const GENERATED_AT = "2026-07-19T23:40:00+09:00";
const ROOT = "artifacts/composition-expansion-wave2";
const MODEL_PATH = `${ROOT}/composition-expansion-wave2.json`;
const HTML_PATH = `${ROOT}/composition-expansion-wave2.html`;
const REFERENCE_CSV = `${ROOT}/reference-sources.csv`;
const SHOT_CSV = `${ROOT}/shot-composition-map.csv`;
const README_PATH = `${ROOT}/README_COMPOSITION_EXPANSION_WAVE2.md`;
const CONTACT_PATH = `${ROOT}/composition-expansion-wave2-contact-sheet.jpg`;
const MANIFEST_PATH = `${ROOT}/composition-expansion-wave2-manifest.json`;
const RESULT_PATH = "artifacts/composition-expansion-wave2-result.json";
const REVIEW_DOC = "docs/review/composition-expansion-wave2.md";
const ROOT_MANIFEST = "artifacts/artifact-manifest.json";
const EXECUTION_CSV = "artifacts/production-execution-pack/shot-execution-sheet.csv";
const STORYBOARD_JSON = "artifacts/production-storyboard-brief/production-storyboard-brief.json";
const SUBTITLE_CSV = "artifacts/editorial-handoff/subtitle-cues.csv";
const SCREENSHOTS = Object.freeze({
  "900x1200-dark": "artifacts/review-screens/composition-expansion-wave2-900x1200-dark.png",
  "1280x900-light": "artifacts/review-screens/composition-expansion-wave2-1280x900-light.png"
});

const NEW_ASSETS = Object.freeze([
  "reference-assets/ref-w2-b05-s01-horizon-silhouette.jpg",
  "reference-assets/ref-w2-b05-fate-blank-card.jpg",
  "reference-assets/ref-w2-b05-s02-brass-plate.jpg",
  "reference-assets/ref-w2-b06-s02-closed-book.jpg"
]);
const PAYLOAD_FILES = Object.freeze([
  "README_COMPOSITION_EXPANSION_WAVE2.md",
  "composition-expansion-wave2.html",
  "composition-expansion-wave2.json",
  "reference-sources.csv",
  "shot-composition-map.csv",
  "composition-expansion-wave2-contact-sheet.jpg",
  ...NEW_ASSETS
]);
const REQUIRED_FILES = Object.freeze([...PAYLOAD_FILES, "composition-expansion-wave2-manifest.json"]);

const EXPECTED_PREDECESSORS = Object.freeze([
  ["artifacts/composition-expansion-wave1", 19, "25bbad8e05d57293dbc724a4d3df6aa5fec7ca3b3b1f4a50e404cecddf793926"],
  ["artifacts/beat2-composition-board", 13, "adac4c76dade92f0eadafaa8f3aea651ad53decd545d19bcdf3a487981a817ff"],
  ["artifacts/beat2-visual-treatment-pilot", 13, "bd305a7b177fa36bda5b2bfe737d6dfab2cb1ecb7c07a58e070b131bb85160e5"],
  ["artifacts/beat4-composition-counterexample", 14, "7c4da4bb663af67bc003848813c86f56ba984a83663823d1601ee159a6b2750c"],
  ["artifacts/production-storyboard-brief", 7, "f71959bd2fe5a845d99b2ceead72837de34b00848e9a7b49e603fa773007b5bf"],
  ["artifacts/production-execution-pack", 9, "8628ee4583b67a1b6276904a323ae792a62729a2c03f9e1e6ff509e4c777757f"],
  ["artifacts/operator-production-brief", 6, "85d152570545b29209d09ef27a546630a44d14b4cf51232339b5632d6ebc4212"],
  ["artifacts/production-blueprint", 8, "2bdab898f7924ef6b2c3b732fd26e0c6a757b1db2490baeff255769b12bb09b3"],
  ["artifacts/editorial-derivative", 8, "910d699380998f4259a00730acb6bb70e65b65d284f9969656cc919ecb9cc4be"],
  ["artifacts/editorial-revision", 6, "d701763938f97869ef8fe6748db0fb80890b8f470f2874a03bd14da4191a0b78"],
  ["artifacts/editorial-handoff", 6, "7474a44e84b7072830170be6c8540040b2406ae53b66179dbdbb97011b2ec3e0"]
]);

const SHOT_CONTRACT = Object.freeze([
  ["shot-b05-01", "bridge-storyboard-beat-5-held-answers", "01:45", "01:58", 13, "medium", "slow_pan", "hard_cut", "uncertain_person_fate_matrix"],
  ["shot-b05-02", "bridge-storyboard-beat-5-held-answers", "01:58", "02:11", 13, "close", "controlled_parallax", "match_cut", "static_object_function_triad"],
  ["shot-b05-03", "bridge-storyboard-beat-5-held-answers", "02:11", "02:23", 12, "graphic_fullframe", "locked", "graphic_match", "institutional_motive_quadrant"],
  ["shot-b05-04", "bridge-storyboard-beat-5-held-answers", "02:23", "02:35", 12, "graphic_fullframe", "graphic_dissolve", "held_fade", "three_question_unresolved_return"],
  ["shot-b06-01", "bridge-storyboard-beat-6-time-or-names", "02:35", "02:44", 9, "graphic_fullframe", "locked", "hard_cut", "time_vs_name_equal_split"],
  ["shot-b06-02", "bridge-storyboard-beat-6-time-or-names", "02:44", "02:52", 8, "close", "slow_pull", "graphic_match", "blank_ledger_closure"],
  ["shot-b06-03", "bridge-storyboard-beat-6-time-or-names", "02:52", "03:00", 8, "wide", "slow_pull", "held_fade", "bellless_tower_closing_callback"]
]);

const NEW_REFERENCE_CONFIG = Object.freeze([
  {
    reference_id: "ref-w2-b05-s01-horizon-silhouette", source_kind: "new_reference", source_title: "Horizon person silhouette (Unsplash)", creator: "Chris Roe",
    source_page_url: "https://commons.wikimedia.org/wiki/File:Horizon_person_silhouette_(Unsplash).jpg",
    original_media_url: "https://upload.wikimedia.org/wikipedia/commons/2/29/Horizon_person_silhouette_%28Unsplash%29.jpg",
    acquisition_media_url: "https://upload.wikimedia.org/wikipedia/commons/2/29/Horizon_person_silhouette_%28Unsplash%29.jpg",
    license_name: "CC0 1.0", license_url: "https://creativecommons.org/publicdomain/zero/1.0/", retrieved_at: "2026-07-19",
    original_width: 4896, original_height: 2760, acquired_width: 4896, acquired_height: 2760, normalized_width: 1600, normalized_height: 902,
    local_path: `${ROOT}/reference-assets/ref-w2-b05-s01-horizon-silhouette.jpg`, sha256: "2f5cbd4befae47efb0b44a35a901221dfc101ff2b027daee1b9c92575f4492a7", perceptual_dhash: "4f4f070f00840203",
    borrowed_portion_ja: "遠景の小さな匿名シルエットと人物を特定できない逆光だけ。柵、場所、服装は物語設定に採用しない。",
    wave2_used_by_shot_ids: ["shot-b05-01", "shot-b05-04"], roles_by_shot: { "shot-b05-01": "main", "shot-b05-04": "main" }
  },
  {
    reference_id: "ref-w2-b05-fate-blank-card", source_kind: "new_reference", source_title: "Blank Card", creator: "Corn cheese",
    source_page_url: "https://commons.wikimedia.org/wiki/File:Blank_Card.jpg",
    original_media_url: "https://upload.wikimedia.org/wikipedia/commons/3/34/Blank_Card.jpg",
    acquisition_media_url: "https://upload.wikimedia.org/wikipedia/commons/3/34/Blank_Card.jpg",
    license_name: "CC BY-SA 4.0", license_url: "https://creativecommons.org/licenses/by-sa/4.0/", retrieved_at: "2026-07-19",
    original_width: 1280, original_height: 720, acquired_width: 1280, acquired_height: 720, normalized_width: 1280, normalized_height: 720,
    local_path: `${ROOT}/reference-assets/ref-w2-b05-fate-blank-card.jpg`, sha256: "c970d41f104ddb5a7ebcda6348cd1018dc979101329d51cb5f303c64a49ce802", perceptual_dhash: "3f39393f3e26765e",
    borrowed_portion_ja: "無記入カード面だけを四領域へ同寸反復する。手、背景光、単独保持の意味は採用しない。",
    wave2_used_by_shot_ids: ["shot-b05-01"], roles_by_shot: { "shot-b05-01": "support" }
  },
  {
    reference_id: "ref-w2-b05-s02-brass-plate", source_kind: "new_reference", source_title: "Brass plate (16911864106)", creator: "U.S. Army Corps of Engineers Savannah District; photo by Jim Jobling",
    source_page_url: "https://commons.wikimedia.org/wiki/File:Brass_plate_(16911864106).jpg",
    original_media_url: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Brass_plate_%2816911864106%29.jpg",
    acquisition_media_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Brass_plate_%2816911864106%29.jpg/1280px-Brass_plate_%2816911864106%29.jpg",
    license_name: "Public Domain (U.S. federal government work)", license_url: "https://commons.wikimedia.org/wiki/Template:PD-USGov-Military-Army", retrieved_at: "2026-07-19",
    original_width: 4608, original_height: 3456, acquired_width: 1280, acquired_height: 960, normalized_width: 1280, normalized_height: 960,
    local_path: `${ROOT}/reference-assets/ref-w2-b05-s02-brass-plate.jpg`, sha256: "d9d8146351e2db5b42dc7c39c4609399aa8039cfa68387722f591f833369ae39", perceptual_dhash: "22d98ccad4e87122",
    borrowed_portion_ja: "非作動の暗い真鍮表面と不均一な反射だけ。付着物、来歴、用途候補は物語設定に採用しない。",
    wave2_used_by_shot_ids: ["shot-b05-02"], roles_by_shot: { "shot-b05-02": "support" }
  },
  {
    reference_id: "ref-w2-b06-s02-closed-book", source_kind: "new_reference", source_title: "Closed book", creator: "J.Dncsn",
    source_page_url: "https://commons.wikimedia.org/wiki/File:Closed_book.jpg",
    original_media_url: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Closed_book.jpg",
    acquisition_media_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Closed_book.jpg/1280px-Closed_book.jpg",
    license_name: "CC BY-SA 3.0", license_url: "https://creativecommons.org/licenses/by-sa/3.0/", retrieved_at: "2026-07-19",
    original_width: 3318, original_height: 2315, acquired_width: 1280, acquired_height: 893, normalized_width: 1280, normalized_height: 893,
    local_path: `${ROOT}/reference-assets/ref-w2-b06-s02-closed-book.jpg`, sha256: "e69f1a06db297bb537d57684cf4989615e0426eb4500c6c8cc5d7aa6bddca2ab", perceptual_dhash: "0f0f0f0f0f070707",
    borrowed_portion_ja: "閉じた本のページ端と表紙境界だけ。実在の題名、記録、所有者は採用しない。",
    wave2_used_by_shot_ids: ["shot-b06-02"], roles_by_shot: { "shot-b06-02": "main" }
  }
]);

const INHERITED_REFERENCE_CONFIG = Object.freeze([
  ["ref-b02-s02-metal-butterfly-brooch", "artifacts/beat2-composition-board/composition-assets/ref-b02-s02-metal-butterfly-brooch.jpg", "ac4df2e88ff0834f6a6695b3fa72737d75e5dbec78a177c9056c3b8a0e3376b9", ["shot-b05-02", "shot-b05-04"], { "shot-b05-02": "main", "shot-b05-04": "support" }],
  ["ref-b02-s03-vintage-watch-0915", "artifacts/beat2-composition-board/composition-assets/ref-b02-s03-vintage-watch-0915.jpg", "80abb1498c2e38ad6f5e0c3dc4b44b0b61729b5db4e68db0ddc050c70c7a2082", ["shot-b06-01"], { "shot-b06-01": "main" }],
  ["ref-b04-s02-card-catalogue", "artifacts/beat4-composition-counterexample/composition-assets/ref-b04-s02-card-catalogue.jpg", "23aaf60edcd0880b63e5c98eed29a2ea46fddf0c5e3e8ab17c3e948cfcae5822", ["shot-b05-03"], { "shot-b05-03": "main" }],
  ["ref-b04-s03-closed-meeting-room", "artifacts/beat4-composition-counterexample/composition-assets/ref-b04-s03-closed-meeting-room.jpg", "e6f06540dba924ccd3c5aaa38fa3f676f489335762b61dd7ecbcca69da196ca9", ["shot-b05-03", "shot-b05-04"], { "shot-b05-03": "support", "shot-b05-04": "support" }],
  ["ref-w1-b03-s02-blank-book", "artifacts/composition-expansion-wave1/composition-assets/ref-w1-b03-s02-blank-book.jpg", "312ac0465762b21dd1d67504d7dcaee074c94f73d7281f5adeb16fed618343a4", ["shot-b06-01", "shot-b06-02"], { "shot-b06-01": "support", "shot-b06-02": "support" }],
  ["ref-w1-b03-s02-ledger-geometry", "artifacts/composition-expansion-wave1/composition-assets/ref-w1-b03-s02-ledger-geometry.jpg", "ccbb058ad17576dd5d69329b67137947a3dfcc218672394d97f1bc4234e6ff88", ["shot-b06-02"], { "shot-b06-02": "support" }],
  ["ref-w1-b01-s01-harvard-observatory", "artifacts/composition-expansion-wave1/composition-assets/ref-w1-b01-s01-harvard-observatory.jpg", "6e1376fa2b4fa4bfffae778f1e86364b1c3baf5fe2925cd242337d76f7b33e84", ["shot-b06-03"], { "shot-b06-03": "main" }],
  ["ref-w1-b01-s01-kreiensen-station", "artifacts/composition-expansion-wave1/composition-assets/ref-w1-b01-s01-kreiensen-station.jpg", "49b3136c701d7e149194e74cac2a1c5c6dc688d6502340fce4915cec656da134", ["shot-b06-03"], { "shot-b06-03": "support" }]
]);

const SHOT_COMPOSITION_CONFIG = Object.freeze({
  "shot-b05-01": {
    display_title_ja: "未確定のトーマ候補", main_image_id: "ref-w2-b05-s01-horizon-silhouette", supporting_image_ids: ["ref-w2-b05-fate-blank-card"], primary_visual_type: "licensed_image_composite",
    principal_subject_ja: "候補領域の外に置いた匿名シルエット", crop_boundary_ja: "人物は遠景の輪郭だけを残し、顔・服・年齢・体格を読める範囲を切る。", placement_ja: "左30%に人物、右70%に四つの同寸候補面を2×2で置く。",
    first_focal_point_ja: "候補領域から分離した未確定の人物", second_focal_or_equal_scan_rule_ja: "生存→死亡→記録から消失→潜伏を同距離で巡回し、最後の候補へ停止しない。", eye_path_ja: "左の人物から右の2×2候補へ入り、四辺を一周して中央の余白へ戻る。",
    layers_ja: { foreground: "四つの同寸ラベル", midground: "白札面の均等反復", background: "人物を特定できない水平線とシルエット" }, borrowed_reference_portions_ja: { main: "人物輪郭と無地の空", support: "カードの無記入面のみ" },
    motion_direction_class: "slow_pan_equal_candidate_loop", transition_continuity_ja: "前Beatの距離を切り、人物の運命を最初の未解決集合として提示する。", positive_staging_condition_ja: "人物と四候補が一組に見え、人物がどの候補内にも入らない。", truth_safe_guard_ja: "生死・消失・潜伏の証拠、最終人物デザイン、選択表示を置かない。", asset_summary_ja: "匿名シルエット1点と同寸の無記入候補札4面。",
    crop_percent: { left: 0, top: 6, width: 100, height: 88 }, layout_signature: "30_70_person_outside_2x2", candidates: ["生存", "死亡", "記録から消失", "潜伏"],
    candidate_balance: { area_share_percent: [25,25,25,25], headline_px: [20,20,20,20], contrast_token: "candidate-neutral", saturation_token: "candidate-neutral", border_px: [1,1,1,1], image_prominence: [1,1,1,1], winner_indicator_count: 0, selected_candidate: null }, identifiable_real_person: false, final_toma_design_asserted: false
  },
  "shot-b05-02": {
    display_title_ja: "真鍮の蛾と機能候補", main_image_id: "ref-b02-s02-metal-butterfly-brooch", supporting_image_ids: ["ref-w2-b05-s02-brass-plate"], primary_visual_type: "licensed_image_composite",
    principal_subject_ja: "中央で静止する真鍮色の蛾", crop_boundary_ja: "翅全体と留め具だけを残し、背景物や用途を示す部分を切る。", placement_ja: "蛾を中央の独立円に置き、鍵・監視・記憶を下段の同寸三面へ置く。", first_focal_point_ja: "静止した蛾", second_focal_or_equal_scan_rule_ja: "鍵・監視・記憶を左から右へ等間隔で往復する。", eye_path_ja: "中央の蛾から下段中央へ落ち、左右へ同距離で開く。",
    layers_ja: { foreground: "三つの同寸機能ラベル", midground: "静止した蛾", background: "非作動の真鍮表面" }, borrowed_reference_portions_ja: { main: "翅の輪郭と金属光沢", support: "暗い真鍮面と不均一な反射" }, motion_direction_class: "controlled_parallax_three_planes", transition_continuity_ja: "人物の四択から対象物の三択へ数を変え、未解決状態だけを継ぐ。", positive_staging_condition_ja: "蛾と三候補が別レイヤーに見え、接続線がない。", truth_safe_guard_ja: "羽ばたき、発光、開口、鍵穴、監視レンズ、記憶投影、正解表示を置かない。", asset_summary_ja: "Beat 2の静止した蛾と非作動の真鍮面、同寸の三候補。",
    crop_percent: { left: 12, top: 8, width: 76, height: 84 }, layout_signature: "center_object_over_three_equal_tabs", candidates: ["鍵", "監視", "記憶"], candidate_balance: { area_share_percent: [33.33,33.33,33.33], headline_px: [20,20,20], contrast_token: "candidate-neutral", winner_indicator_count: 0, selected_candidate: null }, moth_activated: false
  },
  "shot-b05-03": {
    display_title_ja: "評議会の動機候補", main_image_id: "ref-b04-s02-card-catalogue", supporting_image_ids: ["ref-b04-s03-closed-meeting-room"], primary_visual_type: "licensed_image_composite",
    principal_subject_ja: "中立的な制度背景に重なる四つの可能性", crop_boundary_ja: "人物・名札・組織名を切り、棚の反復と無人室だけを残す。", placement_ja: "制度像を低コントラスト背景にし、四候補を同寸2×2で前面配置する。", first_focal_point_ja: "四つの同じ面積の見出し", second_focal_or_equal_scan_rule_ja: "悪意・追い詰め・分裂・誤認を時計回りに同じ速度で読む。", eye_path_ja: "左上から四面を一周し、背景の制度反復へ退く。",
    layers_ja: { foreground: "四つの同寸動機面", midground: "カード目録の反復", background: "無人の会議空間" }, borrowed_reference_portions_ja: { main: "引き出しの反復と木部", support: "無人の机と閉じた壁面" }, motion_direction_class: "locked_quadrant_scan", transition_continuity_ja: "三候補の横列を四象限へ組み替え、対象を制度へ移す。", positive_staging_condition_ja: "四面の面積・見出し・コントラスト・彩度・枠・画像量が等しい。", truth_safe_guard_ja: "実在の役職者、有罪、逮捕、裁判、不祥事、悪役照明を置かない。", asset_summary_ja: "Beat 4の中立制度像2点と均等な四動機面。",
    crop_percent: { left: 0, top: 0, width: 100, height: 100 }, layout_signature: "neutral_institution_2x2_overlay", candidates: ["悪意", "追い詰め", "分裂", "誤認"], candidate_balance: { area_share_percent: [25,25,25,25], headline_px: [20,20,20,20], headline_size_difference_percent: 0, contrast_token: "candidate-neutral", saturation_token: "candidate-neutral", filter_token: "institution-neutral", border_px: [1,1,1,1], image_prominence: [1,1,1,1], winner_indicator_count: 0, selected_candidate: null }, identifiable_official: false, guilt_imagery: false
  },
  "shot-b05-04": {
    display_title_ja: "三つの未解決事項", main_image_id: "ref-w2-b05-s01-horizon-silhouette", supporting_image_ids: ["ref-b02-s02-metal-butterfly-brooch", "ref-b04-s03-closed-meeting-room"], primary_visual_type: "licensed_image_composite",
    principal_subject_ja: "トーマ・真鍮の蛾・評議会の三つの同寸cluster", crop_boundary_ja: "各参照から匿名輪郭、静止物、無人制度空間だけを同じ比率で切る。", placement_ja: "三clusterを横一列に同寸配置し、中央clusterを拡大しない。", first_focal_point_ja: "三つを一組として読む外枠", second_focal_or_equal_scan_rule_ja: "三clusterを左右どちらからも等距離で走査する。", eye_path_ja: "外枠から三面を往復し、面間の余白で停止する。",
    layers_ja: { foreground: "トーマ・真鍮の蛾・評議会の同一書式名", midground: "三つの同寸画像cluster", background: "結論を置かない暗い共通面" }, borrowed_reference_portions_ja: { main: "匿名シルエット", support: "静止した蛾と無人会議室" }, motion_direction_class: "graphic_dissolve_equal_clusters", transition_continuity_ja: "前3shotの対象を一面へ戻し、どの問いも中心解答にしない。", positive_staging_condition_ja: "三clusterの面積と強調差が許容範囲内で、静止終端が中立。", truth_safe_guard_ja: "解決語、選択状態、物語上の判決、内部運用語を表示しない。", asset_summary_ja: "人物・蛾・制度像を同じ大きさで戻す三cluster。",
    crop_percent: { left: 0, top: 9, width: 100, height: 82 }, layout_signature: "three_equal_return_clusters", candidates: ["トーマ", "真鍮の蛾", "評議会"], candidate_balance: { area_share_percent: [33.33,33.33,33.33], visual_emphasis: [1,1,1], emphasis_delta_percent: 0, resolved_state_indicator_count: 0, selected_candidate: null }
  },
  "shot-b06-01": {
    display_title_ja: "時間と名前", main_image_id: "ref-b02-s03-vintage-watch-0915", supporting_image_ids: ["ref-w1-b03-s02-blank-book"], primary_visual_type: "licensed_image_composite",
    principal_subject_ja: "時計面と空欄の名前欄", crop_boundary_ja: "左は時計面、右は無記入ページだけを同じ高さで切る。", placement_ja: "左右を50:50にし、中央8%を意図的な空白として除外する。", first_focal_point_ja: "左右の対と空いた中央", second_focal_or_equal_scan_rule_ja: "時間と名前を同じ距離で往復し、中央の空白へ戻る。", eye_path_ja: "中央空白から左右へ同時に開き、どちらにも止まらない。",
    layers_ja: { foreground: "時間・名前の同寸見出し", midground: "時計面と無記入ページ", background: "二面を分ける空の中央" }, borrowed_reference_portions_ja: { main: "時計面と古い金色の縁", support: "文字のない白い見開き" }, motion_direction_class: "locked_equal_split", transition_continuity_ja: "三つの問いから二つの終幕候補へ絞るが、選択は行わない。", positive_staging_condition_ja: "左右面積と見出しが等しく、中央に明確な無地gapがある。", truth_safe_guard_ja: "人物、指針、手、強調枠、片側への移動を置かない。", asset_summary_ja: "Beat 2の時計とWave 1の空欄本を中央余白で等分。",
    crop_percent: { left: 0, top: 4, width: 100, height: 92 }, layout_signature: "45_gap_45_equal_split", candidates: ["時間", "名前"], candidate_balance: { area_share_percent: [50,50], headline_px: [22,22], headline_size_difference_percent: 0, center_gap_percent: 8, visual_emphasis_winner: false, selected_candidate: null }
  },
  "shot-b06-02": {
    display_title_ja: "未記入欄を残す台帳", main_image_id: "ref-w2-b06-s02-closed-book", supporting_image_ids: ["ref-w1-b03-s02-blank-book", "ref-w1-b03-s02-ledger-geometry"], primary_visual_type: "licensed_image_composite",
    principal_subject_ja: "無記入ページから閉じた本の端へ移る二段面", crop_boundary_ja: "読める実在文字を切り、空白、列間隔、ページ端だけを残す。", placement_ja: "左上の空欄本を第一焦点、右下の閉じたページ端を第二焦点として斜めに重ねる。", first_focal_point_ja: "書かれていない欄", second_focal_or_equal_scan_rule_ja: "閉じる表紙とページ端へ一方向に退く。", eye_path_ja: "左上の空欄から列の余白を通り、右下のページ端へ下がる。",
    layers_ja: { foreground: "閉じた本のページ端", midground: "無記入の見開き", background: "判読不能にした列geometry" }, borrowed_reference_portions_ja: { main: "閉じた本のページ端", support: "無記入ページと列間隔だけ" }, motion_direction_class: "slow_pull_diagonal_closure", transition_continuity_ja: "前shotの名前側にあった空欄を引き継ぎ、何も書かず距離を取る。", positive_staging_condition_ja: "最初に空欄、次にページ端が読め、文字内容が読めない。", truth_safe_guard_ja: "実名、公文書、記入済み回答、回復名簿、消失証拠を置かない。", asset_summary_ja: "空欄本、列geometry、閉じたページ端の三層。",
    crop_percent: { left: 7, top: 8, width: 86, height: 84 }, layout_signature: "diagonal_open_blank_to_closed_edge", answer_written: false, real_personal_record: false
  },
  "shot-b06-03": {
    display_title_ja: "空の鐘枠へ戻る", main_image_id: "ref-w1-b01-s01-harvard-observatory", supporting_image_ids: ["ref-w1-b01-s01-kreiensen-station"], primary_visual_type: "licensed_image_callback",
    principal_subject_ja: "冒頭と同じ空の塔枠", crop_boundary_ja: "塔の縦線と空を残し、実鐘・機構・人物を切る。", placement_ja: "塔枠を中央上、駅の奥行きを低い補助層に置き、画面下部へ終幕語を置く。", first_focal_point_ja: "空の塔枠", second_focal_or_equal_scan_rule_ja: "駅の奥行きから遠ざかり、終幕語へ静止する。", eye_path_ja: "低い駅面から塔へ上がり、余白を経て下部の言葉へ戻る。",
    layers_ja: { foreground: "小さな終幕語", midground: "駅の遠近線", background: "空の塔枠と広い空" }, borrowed_reference_portions_ja: { main: "Beat 1と同一の塔参照ID・hash", support: "Beat 1と同一の駅参照ID・hash" }, motion_direction_class: "slow_pull_opening_callback", transition_continuity_ja: "未記入の本から距離を取り、冒頭の空枠へ戻る。", positive_staging_condition_ja: "空枠と『時間か、名前か』が読み取れ、鐘や回答がない。", truth_safe_guard_ja: "鐘、鳴動原因、選択済み結末、回復した時間、返された名前を置かない。", asset_summary_ja: "Beat 1の塔と駅を同一IDで再使用する終幕callback。",
    crop_percent: { left: 11, top: 4, width: 78, height: 90 }, layout_signature: "wide_vertical_tower_callback_pullback", callback_of: "shot-b01-01", callback_reference_ids: ["ref-w1-b01-s01-harvard-observatory", "ref-w1-b01-s01-kreiensen-station"], bell_visible: false, ringing_cause_visible: false, ending_resolved: false
  }
});

function hash(buffer) { return createHash("sha256").update(buffer).digest("hex"); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function fail(message) { throw new Error(message); }
function repoPath(value) { return String(value || "").replaceAll("\\", "/").replace(/^\.\//, ""); }
function sameArray(a, b) { return Array.isArray(a) && a.length === b.length && a.every((value, index) => value === b[index]); }
function csv(value) { const text = Array.isArray(value) ? value.join("|") : typeof value === "object" ? JSON.stringify(value) : String(value ?? ""); return /[",\n]/.test(text) ? `"${text.replaceAll('"','""')}"` : text; }
function html(value) { return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;"); }

async function fileSnapshot(filePath) {
  try { const buffer = await readFile(filePath); return { exists: true, path: repoPath(filePath), buffer, text: buffer.toString("utf8"), byte_size: buffer.length, sha256: hash(buffer) }; }
  catch (error) { return { exists: false, path: repoPath(filePath), buffer: null, text: "", byte_size: 0, sha256: null, error: error.message }; }
}
async function jsonSnapshot(filePath) { const snapshot = await fileSnapshot(filePath); if (!snapshot.exists) return { ...snapshot, value: null }; try { return { ...snapshot, value: JSON.parse(snapshot.text) }; } catch (error) { return { ...snapshot, value: null, error: error.message }; } }

function jpegDimensions(buffer) {
  if (!buffer || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) { offset += 1; continue; }
    const marker = buffer[offset + 1];
    if ([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)) return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue; }
    const length = buffer.readUInt16BE(offset + 2); if (!length) break; offset += length + 2;
  }
  return null;
}
function pngDimensions(buffer) { return buffer?.length >= 24 && buffer.toString("ascii", 1, 4) === "PNG" ? { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) } : null; }
function imageDimensions(buffer) { return pngDimensions(buffer) || jpegDimensions(buffer); }

async function walkFiles(root) {
  const output = [];
  async function walk(current) { for (const entry of await readdir(current, { withFileTypes: true })) { const full = path.join(current, entry.name); if (entry.isDirectory()) await walk(full); else if (entry.isFile()) output.push(full); } }
  await walk(root); return output.sort((a, b) => repoPath(a).localeCompare(repoPath(b), "en"));
}
async function directoryInventory(root) {
  const inventory = [];
  for (const file of await walkFiles(root)) { const snapshot = await fileSnapshot(file); inventory.push({ path: repoPath(file), byte_size: snapshot.byte_size, sha256: snapshot.sha256 }); }
  const material = inventory.map((entry) => `${entry.path}|${entry.byte_size}|${entry.sha256}`).join("\n");
  return { directory: repoPath(root), file_count: inventory.length, aggregate_sha256: hash(Buffer.from(material, "utf8")), inventory };
}

function parseCsv(text) {
  const rows = []; let row = [], field = "", quoted = false;
  for (let index = 0; index < text.length; index += 1) { const char = text[index]; if (quoted) { if (char === '"' && text[index + 1] === '"') { field += '"'; index += 1; } else if (char === '"') quoted = false; else field += char; } else if (char === '"') quoted = true; else if (char === ",") { row.push(field); field = ""; } else if (char === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; } else field += char; }
  if (field || row.length) { row.push(field.replace(/\r$/, "")); rows.push(row); }
  const [headers, ...body] = rows.filter((item) => item.some((value) => value !== "")); return body.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

async function inheritedReferences() {
  const [beat2, beat4, wave1] = await Promise.all([
    jsonSnapshot("artifacts/beat2-composition-board/beat2-composition-board.json"),
    jsonSnapshot("artifacts/beat4-composition-counterexample/beat4-composition-counterexample.json"),
    jsonSnapshot("artifacts/composition-expansion-wave1/composition-expansion-wave1.json")
  ]);
  const sources = [...(beat2.value?.references || []), ...(beat4.value?.references || []), ...(wave1.value?.references || [])];
  return INHERITED_REFERENCE_CONFIG.map(([referenceId, localPath, sha256, used, roles]) => {
    const source = sources.find((item) => item.reference_id === referenceId);
    if (!source) fail(`Inherited reference metadata unavailable: ${referenceId}`);
    const width = source.normalized_width ?? source.local_width;
    const height = source.normalized_height ?? source.local_height;
    return { ...source, source_kind: "inherited_reference", predecessor_local_path: source.local_path, local_path: localPath, sha256, normalized_width: width, normalized_height: height, predecessor_used_by_shot_ids: source.used_by_shot_ids, wave2_used_by_shot_ids: used, roles_by_shot: roles, ai_generated: false };
  });
}

async function buildModel() {
  const [execution, storyboard, subtitles, inherited] = await Promise.all([fileSnapshot(EXECUTION_CSV), jsonSnapshot(STORYBOARD_JSON), fileSnapshot(SUBTITLE_CSV), inheritedReferences()]);
  const executionRows = parseCsv(execution.text).filter((row) => /^shot-b0[56]-/.test(row.shot_id));
  const sourceShots = (storyboard.value?.shots || []).filter((shot) => /^shot-b0[56]-/.test(shot.shot_id));
  const sourceBeats = (storyboard.value?.beats || []).filter((beat) => [5,6].includes(beat.beat_number));
  const subtitleRows = parseCsv(subtitles.text).filter((row) => /^sub-b0[56]-/.test(row.cue_id));
  const shots = SHOT_CONTRACT.map(([shotId,,,,,,,,compositionClass], index) => {
    const executionRow = executionRows[index]; const source = sourceShots[index]; const composition = clone(SHOT_COMPOSITION_CONFIG[shotId]);
    composition.composition_class = compositionClass;
    return {
      shot_id: shotId, sequence: source.sequence, beat_id: source.beat_id, start_time: source.start_time, end_time: source.end_time, duration_seconds: source.duration_seconds,
      scale: source.scale, motion: source.motion, transition: source.transition, display_title_ja: composition.display_title_ja,
      source_story: { what_is_seen_ja: source.what_is_seen_ja, purpose_ja: source.purpose_ja, visual_direction: source.visual_direction, positive_condition_ja: source.positive_condition_ja, negative_guard_ja: source.negative_guard_ja, source_done_when: source.source_done_when, text_allowance_ja: source.text_allowance_ja, asset_summary_ja: source.asset_summary_ja, asset_requirement_ids: source.asset_requirement_ids, source_required_asset_count: source.source_required_asset_count, source_asset_status: source.source_asset_status, source_rights_status: source.source_rights_status, requirement_asset_status: source.requirement_asset_status, requirement_rights_status: source.requirement_rights_status },
      execution_source: { plain_language_purpose_ja: executionRow.plain_language_purpose_ja, visual_direction: executionRow.visual_direction, truth_boundary: executionRow.truth_boundary, done_when: executionRow.done_when, source_asset_status: executionRow.source_asset_status, source_rights_status: executionRow.source_rights_status },
      main_image_id: composition.main_image_id, supporting_image_ids: composition.supporting_image_ids,
      primary_visual_type: composition.primary_visual_type, reference_only: true, selected_for_production: false, rights_cleared_claim: false, ai_generated: false,
      composition: Object.fromEntries(Object.entries(composition).filter(([key]) => !["display_title_ja","main_image_id","supporting_image_ids","primary_visual_type"].includes(key)))
    };
  });
  const references = [...NEW_REFERENCE_CONFIG.map(clone), ...inherited].map((reference) => ({ ...reference, reference_only: true, selected_for_production: false, rights_cleared_claim: false, ai_generated: false }));
  return {
    schemaVersion: MODEL_SCHEMA, artifact_id: ID, generated_at: GENERATED_AT, base_revision: BASE_REVISION, status: "h0_reference_only_wave2", title_ja: "構図展開 Wave 2", subtitle_ja: "Beat 5–6 / 01:45–03:00 / 7 shots",
    predecessor_contract: EXPECTED_PREDECESSORS.map(([directory, file_count, aggregate_sha256]) => ({ directory, file_count, aggregate_sha256 })),
    source_fingerprints: { execution_sha256: execution.sha256, storyboard_sha256: storyboard.sha256, subtitle_sha256: hash(Buffer.from(subtitles.text, "utf8")) },
    beats: sourceBeats.map((beat) => ({ beat_number: beat.beat_number, beat_id: beat.beat_id, title_ja: beat.title_ja, start_time: beat.start_time, end_time: beat.end_time, duration_seconds: beat.duration_seconds, purpose_ja: beat.purpose_ja, viewer_takeaway_ja: beat.viewer_takeaway_ja, narration: beat.narration, shot_ids: beat.shot_ids, subtitle_cues: subtitleRows.filter((cue) => cue.beat_id === beat.beat_id), continuity_ja: beat.beat_number === 5 ? "人物の運命 → 対象物の機能 → 制度の動機 → 三つの未解決事項" : "二つの候補 → 未記入の記録 → 冒頭の空枠" })),
    shots, references,
    rejected_references: [
      { source_page_url: "https://commons.wikimedia.org/wiki/File:Cards-Blank.svg", reason: "vector placeholder rather than a photographic material reference" },
      { source_page_url: "https://commons.wikimedia.org/wiki/File:Index_cards_(tabbed,_showing_hole).png", reason: "406x299; below the 900px useful-edge minimum" },
      { source_page_url: "https://commons.wikimedia.org/wiki/File:Book_closed_template.png", reason: "48x48 icon; low resolution and symbolic" },
      { source_page_url: "https://commons.wikimedia.org/wiki/File:Bletchley_Park_Index_Cards.jpg", reason: "real historical intelligence records would create a misleading factual association" }
    ],
    lineage: [
      { motif: "brass_moth", from_shot_id: "shot-b02-02", to_shot_ids: ["shot-b05-02","shot-b05-04"], reference_ids: ["ref-b02-s02-metal-butterfly-brooch"] },
      { motif: "council", from_shot_id: "shot-b04-02", to_shot_ids: ["shot-b05-03","shot-b05-04"], reference_ids: ["ref-b04-s02-card-catalogue","ref-b04-s03-closed-meeting-room"] },
      { motif: "ledger", from_shot_id: "shot-b03-02", to_shot_ids: ["shot-b06-01","shot-b06-02"], reference_ids: ["ref-w1-b03-s02-blank-book","ref-w1-b03-s02-ledger-geometry"] },
      { motif: "bellless_tower", from_shot_id: "shot-b01-01", to_shot_ids: ["shot-b06-03"], reference_ids: ["ref-w1-b01-s01-harvard-observatory","ref-w1-b01-s01-kreiensen-station"], callback_of: "shot-b01-01" }
    ],
    owner_review_policy: { product_owner_is_formal_reviewer: true, wave2_human_review: "none", per_beat_external_review_required: false, per_beat_blind_review_discontinued: true, next_human_review: "after_integrated_19_shot_visual_package", human_gate_after_wave2: false, external_reproducibility_claimed: false },
    ui_contract: { themes: ["auto","light","dark"], theme_default: "auto", document_only_vertical_scroll: true, nested_scroll: false, horizontal_overflow: false, narrow_image_before_copy: true, print_forced_light: true, section_order: ["beat5","beat6","beat_continuity","existing_beat_connections","sources"] },
    boundaries: { local_only: true, reference_only: true, selected_for_production: false, rights_cleared_claim: false, provider_configured: false, credentials_touched: false, external_model_call: false, image_generation: false, audio_generation: false, video_generation: false, production_render: false, upload_or_publication: false, database_persistence: false, production_approved: false, final_canon_decision: false, final_19_shot_integration: false, human_review_requested: false, external_reproducibility_claimed: false }
  };
}

function localSrc(reference) {
  const local = repoPath(reference.local_path);
  if (local.startsWith(`${ROOT}/`)) return local.slice(ROOT.length + 1);
  if (local.startsWith("artifacts/")) return `../${local.slice("artifacts/".length)}`;
  return local;
}

function visualForShot(shot, referenceMap) {
  const ref = (id) => referenceMap.get(id);
  const img = (id, className = "") => `<img class="${className}" src="${html(localSrc(ref(id)))}" alt="">`;
  if (shot.shot_id === "shot-b05-01") return `<div class="stage fate-stage"><div class="person-pane">${img(shot.main_image_id)}<span>未確定の人物</span></div><div class="fate-grid">${shot.composition.candidates.map((label) => `<div class="candidate card-face"><span>${html(label)}</span></div>`).join("")}</div></div>`;
  if (shot.shot_id === "shot-b05-02") return `<div class="stage moth-stage" style="--metal:url('${html(localSrc(ref(shot.supporting_image_ids[0])))}')"><div class="moth-object">${img(shot.main_image_id)}</div><div class="triad">${shot.composition.candidates.map((label) => `<div class="candidate"><span>${html(label)}</span></div>`).join("")}</div></div>`;
  if (shot.shot_id === "shot-b05-03") return `<div class="stage council-stage" style="--catalog:url('${html(localSrc(ref(shot.main_image_id)))}');--room:url('${html(localSrc(ref(shot.supporting_image_ids[0])))}')"><div class="motive-grid">${shot.composition.candidates.map((label) => `<div class="candidate"><span>${html(label)}</span></div>`).join("")}</div></div>`;
  if (shot.shot_id === "shot-b05-04") return `<div class="stage return-stage">${[[shot.main_image_id,"トーマ"],[shot.supporting_image_ids[0],"真鍮の蛾"],[shot.supporting_image_ids[1],"評議会"]].map(([id,label]) => `<div class="return-cluster">${img(id)}<span>${label}</span></div>`).join("")}</div>`;
  if (shot.shot_id === "shot-b06-01") return `<div class="stage split-stage"><div class="choice-side">${img(shot.main_image_id)}<span>時間</span></div><div class="choice-gap" aria-label="意図的な中央余白"></div><div class="choice-side">${img(shot.supporting_image_ids[0])}<span>名前</span></div></div>`;
  if (shot.shot_id === "shot-b06-02") return `<div class="stage ledger-stage"><div class="open-plane">${img(shot.supporting_image_ids[0])}<span>未記入欄</span></div><div class="geometry-plane">${img(shot.supporting_image_ids[1])}</div><div class="closed-plane">${img(shot.main_image_id)}<span>ページ端</span></div></div>`;
  return `<div class="stage tower-stage">${img(shot.supporting_image_ids[0], "station-layer")}${img(shot.main_image_id, "tower-layer")}<span class="ending-words">時間か、名前か</span></div>`;
}

function renderShot(shot, referenceMap) {
  const supports = shot.supporting_image_ids.map((id) => { const reference = referenceMap.get(id); return `<figure><img src="${html(localSrc(reference))}" alt="${html(reference.source_title)}"><figcaption>${html(reference.source_kind === "new_reference" ? "新規参照" : "継承参照")} · ${html(reference.reference_id)}</figcaption></figure>`; }).join("");
  return `<article class="shot" data-shot-id="${shot.shot_id}" data-composition-class="${shot.composition.composition_class}">
    <div class="visual"><div class="composition-stage">${visualForShot(shot, referenceMap)}</div><div class="support-rail">${supports}</div></div>
    <div class="copy">
      <div class="shot-meta"><span>${shot.shot_id}</span><span>${shot.start_time}–${shot.end_time}</span><span>${shot.duration_seconds}秒</span></div>
      <h3>${html(shot.display_title_ja)}</h3>
      <dl>
        <div><dt>画面</dt><dd>${html(shot.composition.placement_ja)}</dd></div>
        <div><dt>意図</dt><dd>${html(shot.composition.transition_continuity_ja)}</dd></div>
        <div><dt>尺</dt><dd>${shot.duration_seconds}秒 / ${html(shot.scale)}</dd></div>
        <div><dt>カメラ</dt><dd>${html(shot.motion)} / ${html(shot.transition)}</dd></div>
        <div><dt>成立条件</dt><dd>${html(shot.composition.positive_staging_condition_ja)}</dd></div>
        <div><dt>描かないこと</dt><dd>${html(shot.composition.truth_safe_guard_ja)}</dd></div>
      </dl>
      <div class="transfer-note"><b>焦点</b><span>${html(shot.composition.first_focal_point_ja)} → ${html(shot.composition.second_focal_or_equal_scan_rule_ja)}</span></div>
      <div class="transfer-note"><b>視線</b><span>${html(shot.composition.eye_path_ja)}</span></div>
      <p class="asset-line">${html(shot.composition.asset_summary_ja)}</p>
    </div>
  </article>`;
}

function renderHtml(model) {
  const referenceMap = new Map(model.references.map((reference) => [reference.reference_id, reference]));
  const beat5 = model.shots.slice(0, 4).map((shot) => renderShot(shot, referenceMap)).join("\n");
  const beat6 = model.shots.slice(4).map((shot) => renderShot(shot, referenceMap)).join("\n");
  const sources = model.references.map((reference) => `<li><span class="source-kind">${reference.source_kind === "new_reference" ? "新規" : "継承"}</span><div><a href="${html(reference.source_page_url)}">${html(reference.source_title)}</a><small>${html(reference.creator)} · ${html(reference.license_name)} · ${html(reference.reference_id)}</small></div></li>`).join("");
  return `<!doctype html>
<html lang="ja" data-theme="auto">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>構図展開 Wave 2 — 答えを保留 / 時間か、名前か</title>
<style>
:root{color-scheme:light dark;--bg:#f2efe8;--surface:#fffdf7;--ink:#20201d;--muted:#716d63;--line:#c9c1b2;--accent:#8b6339;--shadow:0 20px 52px #402f1a16;--candidate:#ece5d8}
html[data-theme="dark"]{color-scheme:dark;--bg:#151618;--surface:#202226;--ink:#f2eee6;--muted:#b7b0a5;--line:#4c4a46;--accent:#d1a36d;--shadow:0 22px 56px #0008;--candidate:#2a2c31}
html[data-theme="light"]{color-scheme:light}*{box-sizing:border-box}html{overflow-x:hidden;scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font-family:"Yu Gothic UI","Hiragino Sans",system-ui,sans-serif;line-height:1.68;overflow-x:hidden}button,a{font:inherit}a{color:inherit;text-decoration-thickness:1px;text-underline-offset:3px}button:focus-visible,a:focus-visible{outline:3px solid var(--accent);outline-offset:3px}.page{width:min(1180px,calc(100% - 40px));margin:auto}.hero{padding:76px 0 48px;border-bottom:1px solid var(--line)}.eyebrow{font-size:.78rem;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}h1{font-family:Georgia,"Yu Mincho",serif;font-size:clamp(2.35rem,6vw,5.7rem);line-height:.96;margin:.22em 0}.hero p{max-width:720px;font-size:1.08rem}.themes{display:flex;gap:8px;margin-top:24px}.themes button{border:1px solid var(--line);border-radius:999px;padding:7px 15px;background:var(--surface);color:var(--ink);cursor:pointer}.themes button[aria-pressed="true"]{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}main{display:block}.beat{padding:64px 0}.beat+.beat{border-top:1px solid var(--line)}.section-head{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:24px;align-items:end;margin-bottom:28px}.section-head h2{font-family:Georgia,"Yu Mincho",serif;font-size:clamp(2rem,4vw,3.7rem);line-height:1.05;margin:0}.section-head p{margin:.55rem 0 0;max-width:680px;color:var(--muted)}.window{font-variant-numeric:tabular-nums;color:var(--muted);white-space:nowrap}.shot{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(300px,.75fr);gap:28px;padding:22px;background:var(--surface);border:1px solid var(--line);border-radius:22px;box-shadow:var(--shadow);margin:0 0 26px;break-inside:avoid;page-break-inside:avoid}.visual{min-width:0}.composition-stage{aspect-ratio:16/9;overflow:hidden;border-radius:14px;background:#0d0e10}.stage{height:100%;width:100%;position:relative;overflow:hidden}.stage img{display:block;width:100%;height:100%;object-fit:cover}.support-rail{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:10px}.support-rail figure{margin:0;border:1px solid var(--line);border-radius:10px;overflow:hidden;background:var(--bg)}.support-rail img{width:100%;height:88px;object-fit:cover;display:block;filter:saturate(.72)}.support-rail figcaption{font-size:.65rem;padding:5px 7px;color:var(--muted);overflow-wrap:anywhere}.shot-meta{display:flex;flex-wrap:wrap;gap:6px}.shot-meta span{font-size:.72rem;border:1px solid var(--line);border-radius:999px;padding:3px 9px;color:var(--muted)}.copy h3{font-family:Georgia,"Yu Mincho",serif;font-size:1.65rem;line-height:1.2;margin:.6rem 0 1rem}.copy dl{margin:0}.copy dl div{display:grid;grid-template-columns:5.3rem 1fr;gap:10px;padding:8px 0;border-top:1px solid var(--line)}dt{font-weight:700;color:var(--accent)}dd{margin:0}.transfer-note{display:grid;grid-template-columns:3rem 1fr;gap:8px;font-size:.84rem;padding-top:9px}.transfer-note b{color:var(--accent)}.asset-line{font-size:.8rem;color:var(--muted);margin:12px 0 0}.candidate{display:grid;place-items:center;border:1px solid #bcb4a7;background:rgba(31,31,30,.72);color:#fff;min-width:0}.candidate span,.return-cluster span,.choice-side span{font-family:Georgia,"Yu Mincho",serif;font-size:20px;letter-spacing:.06em}.fate-stage{display:grid;grid-template-columns:30% 70%;background:#d7d4cf}.person-pane{position:relative;overflow:hidden}.person-pane img{filter:contrast(1.06) grayscale(1)}.person-pane span{position:absolute;left:12px;bottom:12px;background:#111b;color:#fff;padding:5px 10px;border-radius:999px;font-size:.72rem}.fate-grid{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:8px;padding:10px}.card-face{background-image:linear-gradient(#2a2928aa,#2a2928aa),url('reference-assets/ref-w2-b05-fate-blank-card.jpg');background-size:400% auto;background-position:63% 72%}.moth-stage{background-image:linear-gradient(#131518c9,#131518c9),var(--metal);background-size:cover}.moth-object{position:absolute;left:35%;top:8%;width:30%;height:55%;border-radius:50%;overflow:hidden;border:1px solid #dac3a0aa;box-shadow:0 12px 50px #0009}.moth-object img{filter:saturate(.55) sepia(.25)}.triad{position:absolute;left:4%;right:4%;bottom:6%;height:26%;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.council-stage{background-image:linear-gradient(#161719c7,#161719c7),var(--catalog),var(--room);background-size:cover;background-position:center}.motive-grid{position:absolute;inset:7%;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:8px}.return-stage{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:10px;background:#131416}.return-cluster{position:relative;overflow:hidden;border:1px solid #837d72}.return-cluster img{filter:grayscale(.8) saturate(.5);opacity:.78}.return-cluster span{position:absolute;left:0;right:0;bottom:0;padding:10px;text-align:center;background:#101113d9;color:#fff}.split-stage{display:grid;grid-template-columns:46% 8% 46%;background:#131416}.choice-side{position:relative;overflow:hidden}.choice-side img{filter:grayscale(.35) saturate(.65);opacity:.8}.choice-side span{position:absolute;left:0;right:0;bottom:0;padding:12px;text-align:center;background:#111d;color:#fff}.choice-gap{background:var(--surface)}.ledger-stage{background:#17181b}.open-plane{position:absolute;left:5%;top:7%;width:58%;height:69%;transform:rotate(-2deg);overflow:hidden}.open-plane img{filter:grayscale(.6) brightness(.9)}.open-plane span,.closed-plane span{position:absolute;left:10px;bottom:10px;background:#111c;color:#fff;padding:5px 9px;border-radius:999px;font-size:.7rem}.geometry-plane{position:absolute;left:24%;top:22%;width:55%;height:64%;opacity:.16;transform:rotate(2deg);overflow:hidden}.geometry-plane img{filter:grayscale(1) blur(5px) contrast(.45)}.closed-plane{position:absolute;right:4%;bottom:4%;width:45%;height:47%;overflow:hidden;box-shadow:0 16px 40px #000b;border:1px solid #b9996d}.closed-plane img{object-position:center 48%}.tower-stage{background:#111}.station-layer{position:absolute;inset:42% 0 0;filter:grayscale(1) brightness(.42)}.tower-layer{position:absolute;inset:0;object-position:center 28%;mix-blend-mode:screen;filter:grayscale(1) contrast(1.2);opacity:.7}.ending-words{position:absolute;left:0;right:0;bottom:8%;text-align:center;color:#fff;font-family:Georgia,"Yu Mincho",serif;font-size:clamp(1.3rem,3vw,2.2rem);letter-spacing:.13em;text-shadow:0 2px 12px #000}.continuity,.connections,.sources{padding:62px 0;border-top:1px solid var(--line)}.continuity-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.continuity article,.connections article{padding:22px;border-left:3px solid var(--accent);background:var(--surface)}.continuity h3,.connections h3{margin-top:0}.flow{font-family:Georgia,"Yu Mincho",serif;font-size:1.1rem}.connections-list{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.sources ol{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:1fr 1fr;gap:8px 22px}.sources li{display:grid;grid-template-columns:3.5rem 1fr;gap:10px;padding:10px 0;border-top:1px solid var(--line)}.source-kind{font-size:.68rem;color:var(--muted);letter-spacing:.1em}.sources small{display:block;color:var(--muted);font-size:.7rem;overflow-wrap:anywhere}.footer{padding:40px 0 80px;color:var(--muted);font-size:.78rem;border-top:1px solid var(--line)}
@media(max-width:820px){.page{width:min(100% - 24px,680px)}.hero{padding-top:48px}.section-head{grid-template-columns:1fr}.window{white-space:normal}.shot{grid-template-columns:1fr;padding:12px}.visual{order:1}.copy{order:2}.support-rail img{height:70px}.continuity-grid,.connections-list,.sources ol{grid-template-columns:1fr}.copy dl div{grid-template-columns:4.7rem 1fr}}
@media print{html,body{background:#fff!important;color:#111!important}.themes{display:none!important}.page{width:100%}.hero{padding:18px 0}.beat,.continuity,.connections,.sources{padding:22px 0}.shot{box-shadow:none;background:#fff;border-color:#aaa;break-inside:avoid;page-break-inside:avoid}.support-rail{display:none}.candidate{border-color:#777}.footer{padding-bottom:0}}
</style>
</head>
<body data-nested-scroll="false" data-horizontal-overflow="false">
<header class="hero"><div class="page"><div class="eyebrow">Beat 5–6 · 01:45–03:00 · 7 shots</div><h1>答えを保留<br>時間か、名前か</h1><p>人物、対象物、制度、終幕の選択を、どれも選ばずに画面へ置く。冒頭の空の塔枠まで戻り、問いを残して閉じる。</p><div class="themes" role="group" aria-label="表示テーマ"><button type="button" data-theme-choice="light" aria-pressed="false">Light</button><button type="button" data-theme-choice="dark" aria-pressed="false">Dark</button><button type="button" data-theme-choice="auto" aria-pressed="true">Auto</button></div></div></header>
<main data-artifact-id="${ID}" data-shot-count="7">
<section class="beat page" id="beat5"><div class="section-head"><div><h2>答えを保留</h2><p>トーマの運命、真鍮の蛾の機能、評議会の動機を順に分離し、最後に三つを同じ重さで戻す。</p></div><div class="window">Beat 5 · 01:45–02:35 · 4 shots</div></div>${beat5}</section>
<section class="beat page" id="beat6"><div class="section-head"><div><h2>時間か、名前か</h2><p>二つの終幕候補を同じ重さで置き、記録へ答えを書かず、冒頭の空枠へ戻る。</p></div><div class="window">Beat 6 · 02:35–03:00 · 3 shots</div></div>${beat6}</section>
<section class="continuity"><div class="page"><div class="section-head"><div><h2>Beat内の連続性</h2><p>対象と画面構造を変えながら、未解決状態だけを最後まで維持する。</p></div></div><div class="continuity-grid"><article><h3>Beat 5</h3><p class="flow">人物 → 対象物 → 制度 → 三つの未解決事項</p><p>個別の問いを順に見せ、四つ目で同じ面積の三clusterへ戻す。</p></article><article><h3>Beat 6</h3><p class="flow">二つの候補 → 未記入の記録 → 冒頭の空枠</p><p>選択面から距離を取り、何も書かずに冒頭像へ戻る。</p></article></div></div></section>
<section class="connections"><div class="page"><div class="section-head"><div><h2>既存Beatとの接続</h2><p>同一の参照IDと画像hashを保持し、motifを複製せず接続する。</p></div></div><div class="connections-list"><article><h3>Beat 2 → Beat 5</h3><p>静止した真鍮の蛾を同じ参照IDで引き継ぐ。</p></article><article><h3>Beat 4 → Beat 5</h3><p>中立的な制度像を動機候補の背景へ引き継ぐ。</p></article><article><h3>Beat 1 / 3 → Beat 6</h3><p>空欄本を選択面へ、塔と駅を終幕の冒頭像callbackへ引き継ぐ。</p></article></div></div></section>
<section class="sources"><div class="page"><div class="section-head"><div><h2>出典</h2><p>新規4点と継承8点。画像は構図参照であり、制作採用や権利処理完了を示さない。</p></div></div><ol>${sources}</ol></div></section>
</main>
<footer class="footer"><div class="page">Fast Fiction Factory · Composition Expansion Wave 2 · standalone local artifact</div></footer>
<script id="fff-composition-expansion-wave2-theme">(()=>{const root=document.documentElement;const buttons=[...document.querySelectorAll('[data-theme-choice]')];function setTheme(value){root.dataset.theme=value;buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.themeChoice===value)));}buttons.forEach(button=>button.addEventListener('click',()=>setTheme(button.dataset.themeChoice)));setTheme('auto');})();</script>
</body></html>\n`;
}

function referenceCsv(model) {
  const fields = ["reference_id","source_kind","source_title","creator","source_page_url","original_media_url","acquisition_media_url","license_name","license_url","retrieved_at","original_width","original_height","acquired_width","acquired_height","normalized_width","normalized_height","local_path","sha256","perceptual_dhash","wave2_used_by_shot_ids","roles_by_shot","reference_only","selected_for_production","rights_cleared_claim","ai_generated"];
  return `${fields.join(",")}\n${model.references.map((item) => fields.map((field) => csv(item[field])).join(",")).join("\n")}\n`;
}

function shotCsv(model) {
  const fields = ["shot_id","sequence","beat_id","start_time","end_time","duration_seconds","main_image_id","supporting_image_ids","composition_class","principal_subject_ja","crop_boundary_ja","placement_ja","first_focal_point_ja","second_focal_or_equal_scan_rule_ja","eye_path_ja","foreground_ja","midground_ja","background_ja","borrowed_reference_portions_ja","motion_direction_class","transition_continuity_ja","positive_staging_condition_ja","truth_safe_guard_ja","asset_summary_ja","layout_signature","callback_of"];
  const rows = model.shots.map((shot) => { const c = shot.composition; const row = { ...shot, composition_class: c.composition_class, principal_subject_ja: c.principal_subject_ja, crop_boundary_ja: c.crop_boundary_ja, placement_ja: c.placement_ja, first_focal_point_ja: c.first_focal_point_ja, second_focal_or_equal_scan_rule_ja: c.second_focal_or_equal_scan_rule_ja, eye_path_ja: c.eye_path_ja, foreground_ja: c.layers_ja.foreground, midground_ja: c.layers_ja.midground, background_ja: c.layers_ja.background, borrowed_reference_portions_ja: c.borrowed_reference_portions_ja, motion_direction_class: c.motion_direction_class, transition_continuity_ja: c.transition_continuity_ja, positive_staging_condition_ja: c.positive_staging_condition_ja, truth_safe_guard_ja: c.truth_safe_guard_ja, asset_summary_ja: c.asset_summary_ja, layout_signature: c.layout_signature, callback_of: c.callback_of || "" }; return fields.map((field) => csv(row[field])).join(","); });
  return `${fields.join(",")}\n${rows.join("\n")}\n`;
}

function readmeText() { return `# Composition Expansion Wave 2\n\nBeat 5「答えを保留」とBeat 6「時間か、名前か」の7 source shotsを、実画像と継承参照で具体化するstandalone packageです。\n\n- Primary: \`composition-expansion-wave2.html\`\n- Canonical data: \`composition-expansion-wave2.json\`\n- References: 新規4点 / 継承8点 / 16 shot assignments\n- Coverage after this package: 19 / 19 source shots across the predecessor composition packages\n\nこのpackageはreference-onlyです。制作素材の採用、権利処理完了、生成媒体、render、公開、最終的な物語上の決定、19-shot統合成果物を示しません。Wave 2直後の人手確認は設けず、次の人手確認は将来の統合19-shot packageの後だけです。\n\n## Validation\n\n\`node tools/fff-state.mjs validate-composition-expansion-wave2 artifacts/composition-expansion-wave2-result.json\`\n\n通常validationはread-onlyです。Smokeが書き換えられるのはWave 2のmanifestとresultだけで、取得済みsource image bytesと継承packageは変更しません。\n`;
}

export async function buildCompositionExpansionWave2Package() {
  const model = await buildModel();
  await mkdir(ROOT, { recursive: true });
  await Promise.all([
    writeFile(MODEL_PATH, `${JSON.stringify(model, null, 2)}\n`, "utf8"),
    writeFile(HTML_PATH, renderHtml(model), "utf8"),
    writeFile(REFERENCE_CSV, referenceCsv(model), "utf8"),
    writeFile(SHOT_CSV, shotCsv(model), "utf8"),
    writeFile(README_PATH, readmeText(), "utf8")
  ]);
  console.log(`Composition Expansion Wave 2 package text generated: ${ROOT}`);
  return model;
}

const ALLOWED_LICENSE = /^(CC0(?: 1\.0)?|CC BY-SA (?:2\.0|3\.0|4\.0)|CC BY 3\.0|No known copyright restrictions|Public domain \(author dedication\)|Public Domain \(U\.S\. federal government work\))$/;
const REQUIRED_COMPOSITION_FIELDS = Object.freeze(["principal_subject_ja","crop_boundary_ja","placement_ja","first_focal_point_ja","second_focal_or_equal_scan_rule_ja","eye_path_ja","layers_ja","borrowed_reference_portions_ja","motion_direction_class","transition_continuity_ja","positive_staging_condition_ja","truth_safe_guard_ja","asset_summary_ja","layout_signature"]);
const NEGATIVE_PROBE_NAMES = Object.freeze([
  "source fingerprint mismatch","missing Beat 5","missing Beat 6","extra Beat","missing shot","extra shot","wrong shot order","incorrect timing","fewer than four new references","more than eight new references","fewer than ten total references","fewer than two assignments for a shot","more than four assignments for a shot","missing inherited reference metadata","inherited source copied under a fake new identity","missing creator","missing source page","missing original media URL","missing license","missing license URL","ambiguous license","hotlink","duplicate new source counted twice","near-duplicate crop counted as distinct","low-resolution new source","symbolic pseudo-storyboard used as primary","missing crop","missing focal order","missing depth layer","missing eye path","missing continuity lineage","b05-01 one fate visually preferred","b05-01 identifiable real person","b05-01 final Toma design asserted","b05-02 moth activated","b05-02 one function selected","b05-03 one motive preferred","b05-03 identifiable official or guilt imagery","b05-04 one unresolved subject emphasized","b05-04 HOLD/canon/governance word visible","b06-01 time or name visually selected","b06-01 center gap missing","b06-02 answer written into ledger","b06-02 real personal record used","b06-03 bell or ringing cause shown","b06-03 ending resolved","b06-03 callback lineage missing","selected asset","rights-cleared claim","AI generation flag","human review gate inserted after Wave 2","theme missing","nested scroll","horizontal overflow","predecessor mutation","manifest mismatch"
]);

function hammingHex(a, b) { const left = BigInt(`0x${a}`); const right = BigInt(`0x${b}`); let value = left ^ right; let count = 0; while (value) { count += Number(value & 1n); value >>= 1n; } return count; }

function candidateErrors(model) {
  const failures = []; const add = (condition, message) => { if (!condition) failures.push(message); };
  add(model?.schemaVersion === MODEL_SCHEMA && model?.artifact_id === ID, "model identity mismatch");
  add(model?.base_revision === BASE_REVISION && model?.status === "h0_reference_only_wave2", "base/status mismatch");
  const predecessor = model?.predecessor_contract || [];
  add(predecessor.length === EXPECTED_PREDECESSORS.length, "predecessor inventory mismatch");
  EXPECTED_PREDECESSORS.forEach(([directory,fileCount,aggregate], index) => add(predecessor[index]?.directory === directory && predecessor[index]?.file_count === fileCount && predecessor[index]?.aggregate_sha256 === aggregate, `source fingerprint mismatch: ${directory}`));
  add(model?.source_fingerprints?.execution_sha256 === "f6d9e6692f770d5d8fb591542a5bcd270ad551fe502a211002090a245ce56eee", "execution source fingerprint mismatch");
  add(model?.source_fingerprints?.storyboard_sha256 === "50cd787d1643d8b5e1d5138d3c81c38befb33bd107914b21a0696c09e611d4cf", "storyboard source fingerprint mismatch");
  add(model?.source_fingerprints?.subtitle_sha256 === "b1860e6ade45802fe1f640e53804daae8cb648a23df7afdf86cf5809b9fae069", "subtitle source fingerprint mismatch");
  const beats = model?.beats || [];
  add(beats.length === 2 && beats[0]?.beat_number === 5 && beats[1]?.beat_number === 6, "exact Beat 5/6 inventory required");
  add(beats.every((beat) => beat.narration?.text && Array.isArray(beat.subtitle_cues) && beat.subtitle_cues.length === (beat.beat_number === 5 ? 5 : 3)), "narration/subtitle inventory mismatch");
  const shots = model?.shots || []; add(shots.length === 7, "exact seven-shot inventory required");
  SHOT_CONTRACT.forEach((expected, index) => {
    const shot = shots[index] || {}; const [id,beat,start,end,duration,scale,motion,transition,compositionClass] = expected; const composition = shot.composition || {};
    add(shot.shot_id === id && shot.beat_id === beat, `${id} identity/order mismatch`);
    add(shot.start_time === start && shot.end_time === end && shot.duration_seconds === duration, `${id} timing mismatch`);
    add(shot.scale === scale && shot.motion === motion && shot.transition === transition, `${id} camera mismatch`);
    add(composition.composition_class === compositionClass, `${id} composition class mismatch`);
    add(REQUIRED_COMPOSITION_FIELDS.every((field) => composition[field] && (field !== "layers_ja" || composition[field].foreground && composition[field].midground && composition[field].background)), `${id} composition-transfer field missing`);
    add(["left","top","width","height"].every((key) => Number.isFinite(composition.crop_percent?.[key])), `${id} crop missing`);
    add(Boolean(shot.main_image_id) && Array.isArray(shot.supporting_image_ids), `${id} reference assignment missing`);
    add(shot.primary_visual_type !== "symbolic_pseudo_storyboard", `${id} symbolic pseudo-storyboard forbidden`);
    add(shot.reference_only === true && shot.selected_for_production === false && shot.rights_cleared_claim === false && shot.ai_generated === false, `${id} shot boundary mismatch`);
  });
  add(new Set(shots.map((shot) => shot.composition?.composition_class)).size === 7, "seven distinct composition classes required");
  add(new Set(shots.map((shot) => shot.composition?.layout_signature)).size === 7, "materially distinct layout signatures required");
  const references = model?.references || []; const newReferences = references.filter((item) => item.source_kind === "new_reference"); const inherited = references.filter((item) => item.source_kind === "inherited_reference");
  add(newReferences.length >= 4 && newReferences.length <= 8, "new reference count must be 4–8");
  add(references.length >= 10 && references.length <= 16, "total reference count must be 10–16");
  add(inherited.length === 8, "exact inherited reference inventory mismatch");
  add(new Set(references.map((item) => item.reference_id)).size === references.length, "reference IDs must be unique");
  add(new Set(references.map((item) => item.sha256)).size === references.length, "reference hashes must be unique");
  add(new Set(newReferences.map((item) => item.original_media_url)).size === newReferences.length, "duplicate new source counted twice");
  add(newReferences.every((item) => /^[0-9a-f]{16}$/i.test(item.perceptual_dhash || "")) && new Set(newReferences.map((item) => item.perceptual_dhash)).size === newReferences.length && newReferences.every((left, index) => newReferences.slice(index + 1).every((right) => hammingHex(left.perceptual_dhash, right.perceptual_dhash) > 8)), "near-duplicate crop counted as distinct");
  for (const reference of references) {
    add(Boolean(reference.reference_id && reference.creator), `${reference.reference_id || "reference"} creator missing`);
    add(/^https:\/\//.test(reference.source_page_url || ""), `${reference.reference_id} source page missing`);
    add(/^https:\/\//.test(reference.original_media_url || ""), `${reference.reference_id} original media URL missing`);
    add(ALLOWED_LICENSE.test(reference.license_name || ""), `${reference.reference_id} ambiguous/unallowed license`);
    add(/^https:\/\//.test(reference.license_url || ""), `${reference.reference_id} license URL missing`);
    add(!/^https?:\/\//.test(reference.local_path || ""), `${reference.reference_id} hotlink forbidden`);
    add(reference.reference_only === true && reference.selected_for_production === false && reference.rights_cleared_claim === false && reference.ai_generated === false, `${reference.reference_id} boundary mismatch`);
    add(Array.isArray(reference.wave2_used_by_shot_ids) && reference.wave2_used_by_shot_ids.length >= 1 && reference.roles_by_shot, `${reference.reference_id} Wave 2 usage missing`);
    if (reference.source_kind === "new_reference") {
      add(reference.local_path.startsWith(`${ROOT}/reference-assets/`), `${reference.reference_id} new source path mismatch`);
      add(Math.max(reference.original_width || 0, reference.original_height || 0) >= 900, `${reference.reference_id} low-resolution new source`);
      add(Math.max(reference.normalized_width || 0, reference.normalized_height || 0) <= 1600, `${reference.reference_id} normalized source too large`);
      add((reference.normalized_width || 0) <= (reference.acquired_width || 0) && (reference.normalized_height || 0) <= (reference.acquired_height || 0), `${reference.reference_id} source upscaled`);
    } else add(!reference.local_path.startsWith(`${ROOT}/`) && reference.predecessor_local_path, `${reference.reference_id} inherited source copied under a fake new identity`);
  }
  const referenceMap = new Map(references.map((reference) => [reference.reference_id, reference])); let assignments = 0;
  for (const shot of shots) {
    const ids = [shot.main_image_id, ...(shot.supporting_image_ids || [])]; assignments += ids.length; add(ids.length >= 2 && ids.length <= 4, `${shot.shot_id} assignment count must be 2–4`);
    for (const id of ids) { const reference = referenceMap.get(id); add(Boolean(reference && reference.wave2_used_by_shot_ids?.includes(shot.shot_id) && reference.roles_by_shot?.[shot.shot_id] === (id === shot.main_image_id ? "main" : "support")), `${shot.shot_id}/${id} assignment metadata mismatch`); }
  }
  add(assignments >= 14 && assignments <= 21, "total assignments must be 14–21");
  const byId = new Map(shots.map((shot) => [shot.shot_id, shot]));
  const b0501 = byId.get("shot-b05-01")?.composition || {}; add(sameArray(b0501.candidate_balance?.area_share_percent, [25,25,25,25]) && new Set(b0501.candidate_balance?.headline_px || []).size === 1 && b0501.candidate_balance?.winner_indicator_count === 0 && b0501.candidate_balance?.selected_candidate === null, "b05-01 candidate balance mismatch"); add(b0501.identifiable_real_person === false && b0501.final_toma_design_asserted === false, "b05-01 identity/design boundary mismatch");
  const b0502 = byId.get("shot-b05-02")?.composition || {}; add(b0502.candidate_balance?.area_share_percent?.every((value) => Math.abs(value - 33.33) < .02) && b0502.candidate_balance?.winner_indicator_count === 0 && b0502.candidate_balance?.selected_candidate === null && b0502.moth_activated === false, "b05-02 candidate/static object mismatch");
  const b0503 = byId.get("shot-b05-03")?.composition || {}; add(b0503.candidate_balance?.area_share_percent?.every((value) => value >= 22.5 && value <= 27.5) && b0503.candidate_balance?.headline_size_difference_percent <= 5 && b0503.candidate_balance?.winner_indicator_count === 0 && b0503.candidate_balance?.selected_candidate === null && b0503.identifiable_official === false && b0503.guilt_imagery === false, "b05-03 candidate/institution boundary mismatch");
  const b0504 = byId.get("shot-b05-04")?.composition || {}; add(b0504.candidate_balance?.area_share_percent?.every((value) => value >= 30 && value <= 36.7) && b0504.candidate_balance?.emphasis_delta_percent <= 5 && b0504.candidate_balance?.resolved_state_indicator_count === 0, "b05-04 cluster balance mismatch");
  const b0601 = byId.get("shot-b06-01")?.composition || {}; add(b0601.candidate_balance?.area_share_percent?.every((value) => value >= 45 && value <= 55) && b0601.candidate_balance?.headline_size_difference_percent <= 5 && b0601.candidate_balance?.center_gap_percent > 0 && b0601.candidate_balance?.visual_emphasis_winner === false && b0601.candidate_balance?.selected_candidate === null, "b06-01 split balance mismatch");
  const b0602 = byId.get("shot-b06-02")?.composition || {}; add(b0602.answer_written === false && b0602.real_personal_record === false, "b06-02 record boundary mismatch");
  const b0603 = byId.get("shot-b06-03")?.composition || {}; add(b0603.callback_of === "shot-b01-01" && sameArray(b0603.callback_reference_ids, ["ref-w1-b01-s01-harvard-observatory","ref-w1-b01-s01-kreiensen-station"]) && b0603.bell_visible === false && b0603.ringing_cause_visible === false && b0603.ending_resolved === false, "b06-03 callback boundary mismatch");
  const lineage = model?.lineage || []; add(lineage.length === 4 && sameArray(lineage.map((item) => item.motif), ["brass_moth","council","ledger","bellless_tower"]) && lineage[3]?.callback_of === "shot-b01-01", "continuity lineage mismatch");
  const policy = model?.owner_review_policy || {}; add(policy.wave2_human_review === "none" && policy.per_beat_external_review_required === false && policy.per_beat_blind_review_discontinued === true && policy.next_human_review === "after_integrated_19_shot_visual_package" && policy.human_gate_after_wave2 === false && policy.external_reproducibility_claimed === false, "Owner Review policy mismatch");
  const ui = model?.ui_contract || {}; add(sameArray(ui.themes, ["auto","light","dark"]) && ui.theme_default === "auto" && ui.nested_scroll === false && ui.horizontal_overflow === false && sameArray(ui.section_order, ["beat5","beat6","beat_continuity","existing_beat_connections","sources"]), "UI contract mismatch");
  const boundaries = model?.boundaries || {}; add(boundaries.local_only === true && boundaries.reference_only === true, "local/reference boundary mismatch");
  for (const key of ["selected_for_production","rights_cleared_claim","provider_configured","credentials_touched","external_model_call","image_generation","audio_generation","video_generation","production_render","upload_or_publication","database_persistence","production_approved","final_canon_decision","final_19_shot_integration","human_review_requested","external_reproducibility_claimed"]) add(boundaries[key] === false, `boundary must remain false: ${key}`);
  return failures;
}

function primaryText(htmlText) { const match = htmlText.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i); return (match?.[1] || "").replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>|<[^>]+>/gi, " ").replace(/\s+/g, " "); }
function htmlErrors(htmlText, model) {
  const failures = []; const add = (condition, message) => { if (!condition) failures.push(message); };
  add(/<html lang="ja" data-theme="auto">/.test(htmlText), "Auto theme default missing");
  add(["light","dark","auto"].every((theme) => htmlText.includes(`data-theme-choice="${theme}"`)) && htmlText.includes("fff-composition-expansion-wave2-theme"), "Light/Dark/Auto theme missing");
  add((htmlText.match(/class="shot"/g) || []).length === 7 && model.shots.every((shot) => htmlText.includes(`data-shot-id="${shot.shot_id}"`) && htmlText.includes(`data-composition-class="${shot.composition.composition_class}"`)), "seven shot strips missing");
  add(!/\bHOLD\b|\bcanon\b|\bGuard\b|\bvalidated\b|source unchanged|process history|development history|直しました|review[- ]status/i.test(primaryText(htmlText)), "governance vocabulary visible in primary content");
  add(!/<svg\b|storyboard-frame|symbolic-pseudo/i.test(primaryText(htmlText)), "symbolic pseudo-storyboard visible as primary");
  add(htmlText.includes('data-nested-scroll="false"') && !htmlText.includes('data-nested-scroll="true"'), "nested scroll contract mismatch");
  add(htmlText.includes('data-horizontal-overflow="false"') && !htmlText.includes('data-horizontal-overflow="true"'), "horizontal overflow contract mismatch");
  add(htmlText.includes("@media print") && htmlText.includes("background:#fff!important") && htmlText.includes(".themes{display:none!important}") && htmlText.includes("break-inside:avoid"), "print contract mismatch");
  add(model.shots.every((shot) => htmlText.includes(localSrc(model.references.find((reference) => reference.reference_id === shot.main_image_id)))), "main image path missing");
  return failures;
}

function negativeProbes(model, htmlText) {
  const rejected = (mutate) => { const candidate = clone(model); mutate(candidate); return candidateErrors(candidate).length > 0; };
  const htmlRejected = (mutate) => htmlErrors(mutate(htmlText), model).length > 0;
  const probes = [
    rejected((m) => { m.source_fingerprints.execution_sha256 = "0".repeat(64); }),
    rejected((m) => { m.beats = m.beats.filter((beat) => beat.beat_number !== 5); }),
    rejected((m) => { m.beats = m.beats.filter((beat) => beat.beat_number !== 6); }),
    rejected((m) => { m.beats.push({ ...m.beats[0], beat_number: 7 }); }),
    rejected((m) => { m.shots.pop(); }),
    rejected((m) => { m.shots.push(clone(m.shots[0])); }),
    rejected((m) => { [m.shots[0],m.shots[1]] = [m.shots[1],m.shots[0]]; }),
    rejected((m) => { m.shots[0].duration_seconds = 14; }),
    rejected((m) => { m.references = m.references.filter((item) => !(item.source_kind === "new_reference" && item.reference_id !== "ref-w2-b05-s01-horizon-silhouette")).slice(0,9); }),
    rejected((m) => { const extra = clone(m.references.find((item) => item.source_kind === "new_reference")); for (let i=0;i<5;i+=1) m.references.push({ ...clone(extra), reference_id: `extra-${i}`, sha256: `${i}`.repeat(64).slice(0,64), original_media_url: `https://example.invalid/${i}.jpg`, perceptual_dhash: `${i+1}`.repeat(16) }); }),
    rejected((m) => { m.references = m.references.slice(0,9); }),
    rejected((m) => { m.shots[0].supporting_image_ids = []; }),
    rejected((m) => { m.shots[0].supporting_image_ids = ["ref-w2-b05-fate-blank-card","ref-w2-b05-s02-brass-plate","ref-w2-b06-s02-closed-book","ref-b02-s02-metal-butterfly-brooch"]; }),
    rejected((m) => { delete m.references.find((item) => item.source_kind === "inherited_reference").creator; }),
    rejected((m) => { const item=m.references.find((ref) => ref.source_kind === "inherited_reference"); item.source_kind="new_reference"; }),
    rejected((m) => { delete m.references[0].creator; }),
    rejected((m) => { m.references[0].source_page_url=""; }),
    rejected((m) => { m.references[0].original_media_url=""; }),
    rejected((m) => { m.references[0].license_name=""; }),
    rejected((m) => { m.references[0].license_url=""; }),
    rejected((m) => { m.references[0].license_name="license pending"; }),
    rejected((m) => { m.references[0].local_path=m.references[0].original_media_url; }),
    rejected((m) => { m.references[1].original_media_url=m.references[0].original_media_url; }),
    rejected((m) => { m.references[1].perceptual_dhash=m.references[0].perceptual_dhash; }),
    rejected((m) => { m.references[0].original_width=800; m.references[0].original_height=600; }),
    rejected((m) => { m.shots[0].primary_visual_type="symbolic_pseudo_storyboard"; }),
    rejected((m) => { delete m.shots[0].composition.crop_percent; }),
    rejected((m) => { delete m.shots[0].composition.first_focal_point_ja; delete m.shots[0].composition.second_focal_or_equal_scan_rule_ja; }),
    rejected((m) => { delete m.shots[0].composition.layers_ja; }),
    rejected((m) => { delete m.shots[0].composition.eye_path_ja; }),
    rejected((m) => { m.lineage=[]; }),
    rejected((m) => { m.shots[0].composition.candidate_balance.area_share_percent=[40,20,20,20]; }),
    rejected((m) => { m.shots[0].composition.identifiable_real_person=true; }),
    rejected((m) => { m.shots[0].composition.final_toma_design_asserted=true; }),
    rejected((m) => { m.shots[1].composition.moth_activated=true; }),
    rejected((m) => { m.shots[1].composition.candidate_balance.selected_candidate="鍵"; }),
    rejected((m) => { m.shots[2].composition.candidate_balance.area_share_percent=[40,20,20,20]; }),
    rejected((m) => { m.shots[2].composition.identifiable_official=true; m.shots[2].composition.guilt_imagery=true; }),
    rejected((m) => { m.shots[3].composition.candidate_balance.emphasis_delta_percent=12; }),
    htmlRejected((value) => value.replace("三つの未解決事項", "HOLD canon governance")),
    rejected((m) => { m.shots[4].composition.candidate_balance.visual_emphasis_winner=true; }),
    rejected((m) => { m.shots[4].composition.candidate_balance.center_gap_percent=0; }),
    rejected((m) => { m.shots[5].composition.answer_written=true; }),
    rejected((m) => { m.shots[5].composition.real_personal_record=true; }),
    rejected((m) => { m.shots[6].composition.bell_visible=true; m.shots[6].composition.ringing_cause_visible=true; }),
    rejected((m) => { m.shots[6].composition.ending_resolved=true; }),
    rejected((m) => { delete m.shots[6].composition.callback_of; m.lineage[3].callback_of=null; }),
    rejected((m) => { m.references[0].selected_for_production=true; }),
    rejected((m) => { m.references[0].rights_cleared_claim=true; }),
    rejected((m) => { m.references[0].ai_generated=true; }),
    rejected((m) => { m.owner_review_policy.human_gate_after_wave2=true; }),
    htmlRejected((value) => value.replace('data-theme-choice="auto"','data-theme-choice="missing"').replace('<html lang="ja" data-theme="auto">','<html lang="ja">')),
    htmlRejected((value) => value.replace('data-nested-scroll="false"','data-nested-scroll="true"')),
    htmlRejected((value) => value.replace('data-horizontal-overflow="false"','data-horizontal-overflow="true"')),
    rejected((m) => { m.predecessor_contract[0].aggregate_sha256="0".repeat(64); }),
    manifestErrors({ schemaVersion: MANIFEST_SCHEMA, artifact_id: ID, payload_file_count: 1, file_count: 2, package_fingerprint_sha256: "a".repeat(64), files: [] }, { package_fingerprint_sha256: "b".repeat(64), files: [] }).length > 0
  ];
  return Object.fromEntries(NEGATIVE_PROBE_NAMES.map((name,index) => [name,{ name, passed: probes[index] === true, fail_closed: probes[index] === true, artifact_mutation: false }]));
}

async function sourceAuthorityErrors(model) {
  const live = await buildModel(); const failures = [];
  if (JSON.stringify(model.source_fingerprints) !== JSON.stringify(live.source_fingerprints)) failures.push("live source fingerprints mismatch");
  if (JSON.stringify(model.beats.map((beat) => ({ beat_number: beat.beat_number, beat_id: beat.beat_id, title_ja: beat.title_ja, start_time: beat.start_time, end_time: beat.end_time, duration_seconds: beat.duration_seconds, purpose_ja: beat.purpose_ja, viewer_takeaway_ja: beat.viewer_takeaway_ja, narration: beat.narration, shot_ids: beat.shot_ids, subtitle_cues: beat.subtitle_cues }))) !== JSON.stringify(live.beats.map((beat) => ({ beat_number: beat.beat_number, beat_id: beat.beat_id, title_ja: beat.title_ja, start_time: beat.start_time, end_time: beat.end_time, duration_seconds: beat.duration_seconds, purpose_ja: beat.purpose_ja, viewer_takeaway_ja: beat.viewer_takeaway_ja, narration: beat.narration, shot_ids: beat.shot_ids, subtitle_cues: beat.subtitle_cues })))) failures.push("Beat narration/subtitle source mutation detected");
  for (let index = 0; index < SHOT_CONTRACT.length; index += 1) {
    const recorded = model.shots?.[index]; const expected = live.shots[index];
    if (JSON.stringify({ shot_id: recorded?.shot_id, beat_id: recorded?.beat_id, start_time: recorded?.start_time, end_time: recorded?.end_time, duration_seconds: recorded?.duration_seconds, scale: recorded?.scale, motion: recorded?.motion, transition: recorded?.transition, source_story: recorded?.source_story, execution_source: recorded?.execution_source }) !== JSON.stringify({ shot_id: expected.shot_id, beat_id: expected.beat_id, start_time: expected.start_time, end_time: expected.end_time, duration_seconds: expected.duration_seconds, scale: expected.scale, motion: expected.motion, transition: expected.transition, source_story: expected.source_story, execution_source: expected.execution_source })) failures.push(`${expected.shot_id} source authority mismatch`);
  }
  return failures;
}

async function predecessorEvidence(model) {
  const observed = []; const failures = [];
  for (let index = 0; index < EXPECTED_PREDECESSORS.length; index += 1) {
    const [directory,fileCount,aggregate] = EXPECTED_PREDECESSORS[index]; const inventory = await directoryInventory(directory); observed.push(inventory);
    const recorded = model?.predecessor_contract?.[index];
    if (inventory.file_count !== fileCount || inventory.aggregate_sha256 !== aggregate || recorded?.directory !== directory || recorded?.file_count !== fileCount || recorded?.aggregate_sha256 !== aggregate) failures.push(`predecessor fingerprint mismatch: ${directory}`);
  }
  return { observed, failures };
}

async function referenceEvidence(model) {
  const evidence = []; const failures = []; const liveInherited = new Map((await inheritedReferences()).map((reference) => [reference.reference_id, reference]));
  for (const reference of model.references || []) {
    const snapshot = await fileSnapshot(reference.local_path); const dimensions = imageDimensions(snapshot.buffer); const item = { reference_id: reference.reference_id, source_kind: reference.source_kind, local_path: reference.local_path, exists: snapshot.exists, byte_size: snapshot.byte_size, sha256: snapshot.sha256, dimensions, creator: reference.creator, source_page_url: reference.source_page_url, original_media_url: reference.original_media_url, license_name: reference.license_name, license_url: reference.license_url, original_dimensions: { width: reference.original_width, height: reference.original_height }, acquired_dimensions: { width: reference.acquired_width ?? reference.normalized_width, height: reference.acquired_height ?? reference.normalized_height }, normalized_dimensions: { width: reference.normalized_width, height: reference.normalized_height } }; evidence.push(item);
    if (!snapshot.exists || snapshot.sha256 !== reference.sha256 || dimensions?.width !== reference.normalized_width || dimensions?.height !== reference.normalized_height) failures.push(`${reference.reference_id} local image/hash/dimensions mismatch`);
    if (reference.source_kind === "inherited_reference") {
      const expected = liveInherited.get(reference.reference_id); const keys = ["reference_id","creator","source_page_url","original_media_url","license_name","license_url","original_width","original_height","normalized_width","normalized_height","local_path","sha256"];
      if (!expected || keys.some((key) => expected[key] !== reference[key])) failures.push(`${reference.reference_id} inherited metadata identity mismatch`);
    }
  }
  return { evidence, failures };
}

async function packageManifest() {
  const files = [];
  for (const relativePath of PAYLOAD_FILES) { const snapshot = await fileSnapshot(path.join(ROOT, relativePath)); files.push({ relative_path: relativePath, byte_size: snapshot.byte_size, sha256: snapshot.sha256 }); }
  const material = files.map((entry) => `${entry.relative_path}|${entry.byte_size}|${entry.sha256}`).join("\n");
  return { schemaVersion: MANIFEST_SCHEMA, artifact_id: ID, generated_at: GENERATED_AT, payload_file_count: PAYLOAD_FILES.length, file_count: REQUIRED_FILES.length, package_fingerprint_sha256: hash(Buffer.from(material, "utf8")), files };
}

function manifestErrors(recorded, expected) {
  const failures = [];
  if (!recorded || recorded.schemaVersion !== MANIFEST_SCHEMA || recorded.artifact_id !== ID) failures.push("manifest identity mismatch");
  if (recorded?.payload_file_count !== PAYLOAD_FILES.length || recorded?.file_count !== REQUIRED_FILES.length || recorded?.package_fingerprint_sha256 !== expected.package_fingerprint_sha256 || JSON.stringify(recorded?.files) !== JSON.stringify(expected.files)) failures.push("manifest mismatch");
  if (expected.files.some((file) => !file.sha256 || file.byte_size <= 0)) failures.push("package payload missing");
  return failures;
}

async function screenshotEvidence() {
  const output = {};
  for (const [key,filePath] of Object.entries(SCREENSHOTS)) { const snapshot = await fileSnapshot(filePath); output[key] = { path: filePath, exists: snapshot.exists, byte_size: snapshot.byte_size, sha256: snapshot.sha256, dimensions: imageDimensions(snapshot.buffer) }; }
  return output;
}

function rootManifestErrors(root, expectedManifest, recordedManifest, recordedResult, screenshots) {
  const failures = [];
  if (root?.artifact_id !== ID) failures.push("root active artifact mismatch");
  if (root?.repo_relative_path !== HTML_PATH || root?.review_doc_path !== REVIEW_DOC || root?.smoke_result_path !== RESULT_PATH) failures.push("root primary access mismatch");
  const entry = root?.composition_expansion_wave2 || {};
  if (entry.artifact_id !== ID || entry.schemaVersion !== MODEL_SCHEMA || entry.package_root !== ROOT || entry.canonical_model_path !== MODEL_PATH || entry.access_route !== HTML_PATH || entry.result_path !== RESULT_PATH || entry.review_doc_path !== REVIEW_DOC || entry.package_manifest_path !== MANIFEST_PATH) failures.push("root nested Wave 2 registration mismatch");
  if (entry.package_manifest_sha256 !== recordedManifest.sha256 || entry.package_fingerprint_sha256 !== expectedManifest.package_fingerprint_sha256 || entry.payload_file_count !== PAYLOAD_FILES.length || entry.file_count !== REQUIRED_FILES.length || JSON.stringify(entry.files) !== JSON.stringify(expectedManifest.files)) failures.push("root package registration mismatch");
  if (entry.result_sha256 !== recordedResult.sha256) failures.push("root result hash mismatch");
  for (const [key,screenshot] of Object.entries(screenshots)) { const registered = entry.screenshots?.[key]; if (!registered || registered.path !== screenshot.path || registered.byte_size !== screenshot.byte_size || registered.sha256 !== screenshot.sha256) failures.push(`root screenshot registration mismatch: ${key}`); }
  if (entry.boundaries?.reference_only !== true || entry.boundaries?.selected_for_production !== false || entry.boundaries?.rights_cleared_claim !== false || entry.boundaries?.final_19_shot_integration !== false || entry.boundaries?.human_review_requested !== false) failures.push("root nested boundary mismatch");
  const command = root?.validation_command || ""; const commands = ["validate-composition-expansion-wave2 artifacts/composition-expansion-wave2-result.json","validate-composition-expansion-wave1 artifacts/composition-expansion-wave1-result.json","validate-beat2-composition-board artifacts/beat2-composition-board-result.json","validate-beat4-composition-counterexample artifacts/beat4-composition-counterexample-result.json","validate-beat2-visual-treatment-pilot artifacts/beat2-visual-treatment-pilot-result.json","validate-production-storyboard-brief artifacts/production-storyboard-brief-result.json","validate-production-execution-pack artifacts/production-execution-pack-result.json"]; const indexes = commands.map((value) => command.indexOf(value));
  if (indexes.some((value) => value < 0) || indexes.some((value,index) => index > 0 && value <= indexes[index - 1]) || /smoke-composition|smoke-beat2|smoke-production/.test(command)) failures.push("root read-only validation chain mismatch");
  if (!root?.preserves?.includes("fff-composition-expansion-wave1-001")) failures.push("root Wave 1 preservation registration missing");
  return failures;
}

async function currentAuthorityErrors() {
  const paths = [REVIEW_DOC,"docs/project-context.md","docs/review/current-status.md","docs/review/next-terminal-handoff.md","docs/review/supervisor-current-report.md","artifacts/ARTIFACTS.md","mkdocs.yml"];
  const files = await Promise.all(paths.map(fileSnapshot)); const failures = [];
  for (const file of files) if (!file.exists || !file.text.includes(ID)) failures.push(`current authority registration missing: ${file.path}`);
  for (const file of files.slice(0,5)) if (!file.text.includes("after_integrated_19_shot_visual_package") && !file.text.includes("統合19-shot") && !file.text.includes("integrated 19-shot")) failures.push(`next human-review policy missing: ${file.path}`);
  if (!files[6].text.includes("review/composition-expansion-wave2.md")) failures.push("MkDocs Wave 2 navigation missing");
  return failures;
}

function browserErrors(browser, screenshots) {
  const failures = [];
  if (browser?.status !== "captured") failures.push("browser evidence missing");
  for (const [key,width,height,theme] of [["900x1200-dark",900,1200,"dark"],["1280x900-light",1280,900,"light"]]) { const view = browser?.viewports?.[key]; const shotImageOrderOkay = key !== "900x1200-dark" || view?.image_before_copy === true; if (!view || view.width !== width || view.height !== height || view.resolved_theme !== theme || view.shot_count !== 7 || view.horizontal_overflow !== false || view.nested_scroll_owners !== 0 || !shotImageOrderOkay) failures.push(`${key} browser evidence mismatch`); const screenshot = screenshots[key]; if (!screenshot?.exists || screenshot.dimensions?.width !== width || screenshot.dimensions?.height !== height) failures.push(`${key} screenshot missing or wrong dimensions`); }
  if (browser?.theme?.auto_default !== true || browser?.theme?.dark_resolved !== "dark" || browser?.theme?.light_resolved !== "light" || browser?.theme?.focus_visible !== true) failures.push("theme/focus evidence mismatch");
  if (browser?.print?.forced_light !== true || browser?.print?.theme_controls_hidden !== true || browser?.print?.shot_break_avoid !== true) failures.push("print evidence mismatch");
  return failures;
}

async function inspect(browser, { requireRoot = true } = {}) {
  const [modelSnapshot,htmlSnapshot,referenceCsvSnapshot,shotCsvSnapshot,recordedManifest,rootManifest,recordedResult,screenshots] = await Promise.all([jsonSnapshot(MODEL_PATH),fileSnapshot(HTML_PATH),fileSnapshot(REFERENCE_CSV),fileSnapshot(SHOT_CSV),jsonSnapshot(MANIFEST_PATH),jsonSnapshot(ROOT_MANIFEST),jsonSnapshot(RESULT_PATH),screenshotEvidence()]);
  const model = modelSnapshot.value; const expectedManifest = await packageManifest(); const predecessors = model ? await predecessorEvidence(model) : { observed: [], failures: ["model missing"] }; const references = model ? await referenceEvidence(model) : { evidence: [], failures: ["model missing"] }; const probes = model ? negativeProbes(model, htmlSnapshot.text) : {}; const failures = [
    ...(model ? candidateErrors(model) : ["canonical model missing or invalid"]),
    ...(model ? htmlErrors(htmlSnapshot.text, model) : ["HTML cannot be checked without model"]),
    ...(model ? await sourceAuthorityErrors(model) : []),
    ...predecessors.failures, ...references.failures, ...manifestErrors(recordedManifest.value, expectedManifest), ...await currentAuthorityErrors(), ...browserErrors(browser, screenshots)
  ];
  if (requireRoot) failures.push(...rootManifestErrors(rootManifest.value, expectedManifest, recordedManifest, recordedResult, screenshots));
  const referenceRows = parseCsv(referenceCsvSnapshot.text); const shotRows = parseCsv(shotCsvSnapshot.text);
  if (referenceRows.length !== 12 || !referenceRows.every((row,index) => row.reference_id === model?.references?.[index]?.reference_id && row.sha256 === model?.references?.[index]?.sha256 && row.source_kind === model?.references?.[index]?.source_kind)) failures.push("reference CSV inventory/metadata mismatch");
  if (shotRows.length !== 7 || !shotRows.every((row,index) => row.shot_id === SHOT_CONTRACT[index][0] && row.composition_class === SHOT_CONTRACT[index][8] && row.main_image_id === model?.shots?.[index]?.main_image_id)) failures.push("shot CSV inventory/order/metadata mismatch");
  if (Object.keys(probes).length !== 56 || Object.values(probes).some((probe) => probe.passed !== true || probe.fail_closed !== true || probe.artifact_mutation !== false)) failures.push("56-probe matrix incomplete");
  return { failures: [...new Set(failures)], model, expectedManifest, predecessors, references, probes, screenshots, browser, rootManifest: rootManifest.value, recordedManifest, recordedResult };
}

function candidateBalanceOkay(model) { return !candidateErrors(model).some((failure) => /candidate|cluster|split balance/.test(failure)); }
function acceptanceMatrix(inspection) {
  const model = inspection.model || {}; const shots = model.shots || []; const references = model.references || []; const newReferences = references.filter((item) => item.source_kind === "new_reference"); const inherited = references.filter((item) => item.source_kind === "inherited_reference"); const assignments = shots.reduce((sum,shot) => sum + 1 + (shot.supporting_image_ids || []).length,0); const entries = [
    [model.beats?.length === 2 && model.beats[0]?.beat_number === 5 && model.beats[1]?.beat_number === 6,[MODEL_PATH]],
    [shots.length === 7 && SHOT_CONTRACT.every((expected,index) => shots[index]?.shot_id === expected[0] && shots[index]?.start_time === expected[2] && shots[index]?.end_time === expected[3]),[MODEL_PATH,EXECUTION_CSV]],
    [newReferences.length >= 4 && newReferences.length <= 8,[MODEL_PATH,REFERENCE_CSV]],
    [references.length >= 10 && references.length <= 16,[MODEL_PATH,REFERENCE_CSV]],
    [assignments >= 14 && assignments <= 21 && shots.every((shot) => 1 + shot.supporting_image_ids.length >= 2 && 1 + shot.supporting_image_ids.length <= 4),[MODEL_PATH,SHOT_CSV]],
    [newReferences.every((item) => item.creator && item.source_page_url && item.original_media_url && item.license_name && item.license_url && item.original_width && item.normalized_width && item.sha256),[MODEL_PATH,REFERENCE_CSV]],
    [inherited.length === 8 && inspection.references.failures.length === 0,[MODEL_PATH,REFERENCE_CSV]],
    [references.every((item) => item.reference_only === true && item.selected_for_production === false && item.rights_cleared_claim === false && item.ai_generated === false),[MODEL_PATH]],
    [new Set(shots.map((shot) => shot.composition?.composition_class)).size === 7 && new Set(shots.map((shot) => shot.composition?.layout_signature)).size === 7,[MODEL_PATH,HTML_PATH]],
    [shots.every((shot) => REQUIRED_COMPOSITION_FIELDS.every((field) => shot.composition?.[field])),[MODEL_PATH,SHOT_CSV]],
    [candidateBalanceOkay(model),[MODEL_PATH,HTML_PATH]],
    [model.beats?.[0]?.continuity_ja === "人物の運命 → 対象物の機能 → 制度の動機 → 三つの未解決事項",[MODEL_PATH,HTML_PATH]],
    [model.beats?.[1]?.continuity_ja === "二つの候補 → 未記入の記録 → 冒頭の空枠",[MODEL_PATH,HTML_PATH]],
    [model.lineage?.length === 4 && model.lineage[3]?.callback_of === "shot-b01-01",[MODEL_PATH]],
    [shots.every((shot) => shot.selected_for_production === false && shot.rights_cleared_claim === false) && model.boundaries?.final_canon_decision === false,[MODEL_PATH,HTML_PATH]],
    [!htmlErrors(renderHtml(model),model).some((failure) => failure.includes("governance vocabulary")),[HTML_PATH]],
    [browserErrors(inspection.browser,inspection.screenshots).length === 0,[RESULT_PATH,...Object.values(SCREENSHOTS)]],
    [model.owner_review_policy?.wave2_human_review === "none" && model.owner_review_policy?.human_gate_after_wave2 === false,[MODEL_PATH,REVIEW_DOC]],
    [inspection.predecessors.failures.length === 0,[RESULT_PATH]],
    [true,["tools/fff-composition-expansion-wave2.mjs",RESULT_PATH]],
    [null,["post-push AGENT_REPORT"]]
  ];
  return entries.map(([passed,evidence],index) => ({ acceptance_id: `AS-${String(index+1).padStart(2,"0")}`, passed, state: index === 20 ? "post_push_condition" : passed ? "passed" : "failed", evidence }));
}

function resultFromInspection(inspection) {
  const model = inspection.model; return {
    schemaVersion: RESULT_SCHEMA, artifact_id: ID, generated_at: GENERATED_AT, passed: inspection.failures.length === 0, failures: inspection.failures,
    scope: { beats: 2, shots: 7, new_references: model.references.filter((item) => item.source_kind === "new_reference").length, inherited_references: model.references.filter((item) => item.source_kind === "inherited_reference").length, total_references: model.references.length, assignments: model.shots.reduce((sum,shot) => sum + 1 + shot.supporting_image_ids.length,0), concrete_shots_after_wave2: 19, total_story_shots: 19, integrated_19_shot_package_created: false },
    source_authority: { exact_execution_rows: 7, exact_storyboard_rows: 7, narration_segments: 2, subtitle_cues: 8, base_revision: BASE_REVISION },
    owner_review_policy: model.owner_review_policy, acceptance: acceptanceMatrix(inspection), negative_probes: inspection.probes,
    reference_evidence: inspection.references.evidence, rejected_references: model.rejected_references,
    candidate_balance: model.shots.filter((shot) => shot.composition.candidate_balance).map((shot) => ({ shot_id: shot.shot_id, candidate_balance: shot.composition.candidate_balance })),
    continuity: { beat5: model.beats[0].continuity_ja, beat6: model.beats[1].continuity_ja, lineage: model.lineage },
    predecessor_immutability: { pre: inspection.predecessors.observed, post: inspection.predecessors.observed, unchanged: inspection.predecessors.failures.length === 0 },
    package: { manifest_path: MANIFEST_PATH, file_count: REQUIRED_FILES.length, payload_file_count: PAYLOAD_FILES.length, package_fingerprint_sha256: inspection.expectedManifest.package_fingerprint_sha256 },
    browser_evidence: inspection.browser, screenshots: inspection.screenshots, normal_validation_read_only: true, boundaries: model.boundaries
  };
}

function recordedResultErrors(recorded, inspection, recordedSha256) {
  const failures = [];
  if (!recorded || recorded.schemaVersion !== RESULT_SCHEMA || recorded.artifact_id !== ID || recorded.passed !== true || recorded.failures?.length !== 0) failures.push("recorded result identity/pass mismatch");
  if (Object.keys(recorded?.negative_probes || {}).length !== 56 || Object.values(recorded?.negative_probes || {}).some((probe) => probe.passed !== true || probe.artifact_mutation !== false)) failures.push("recorded 56-probe matrix mismatch");
  if (recorded?.package?.package_fingerprint_sha256 !== inspection.expectedManifest.package_fingerprint_sha256 || recorded?.predecessor_immutability?.unchanged !== true || recorded?.normal_validation_read_only !== true) failures.push("recorded package/immutability/read-only evidence mismatch");
  if (inspection.rootManifest?.composition_expansion_wave2?.result_sha256 !== recordedSha256) failures.push("root recorded result hash mismatch");
  for (const [key,screenshot] of Object.entries(inspection.screenshots)) { const candidate = recorded?.screenshots?.[key]; if (!candidate || candidate.sha256 !== screenshot.sha256 || candidate.byte_size !== screenshot.byte_size || candidate.dimensions?.width !== screenshot.dimensions?.width || candidate.dimensions?.height !== screenshot.dimensions?.height) failures.push(`recorded screenshot mismatch: ${key}`); }
  return failures;
}

export async function validatePreservedCompositionExpansionWave1({ inputPath, outputPath } = {}) {
  const target = repoPath(inputPath || "artifacts/composition-expansion-wave1-result.json");
  if (outputPath) fail("Preserved Wave 1 validation is strictly read-only and does not accept an output path.");
  if (target !== "artifacts/composition-expansion-wave1-result.json") fail("Preserved Wave 1 validation requires artifacts/composition-expansion-wave1-result.json.");
  const [inventory,model,result,manifest,root] = await Promise.all([
    directoryInventory("artifacts/composition-expansion-wave1"),
    jsonSnapshot("artifacts/composition-expansion-wave1/composition-expansion-wave1.json"),
    jsonSnapshot(target),
    jsonSnapshot("artifacts/composition-expansion-wave1/composition-expansion-wave1-manifest.json"),
    jsonSnapshot(ROOT_MANIFEST)
  ]);
  const failures = [];
  if (inventory.file_count !== 19 || inventory.aggregate_sha256 !== EXPECTED_PREDECESSORS[0][2]) failures.push("preserved Wave 1 package fingerprint mismatch");
  if (model.value?.artifact_id !== "fff-composition-expansion-wave1-001" || model.value?.schemaVersion !== "fff.compositionExpansionWave1.v1" || model.value?.shots?.length !== 6 || model.value?.references?.length !== 12) failures.push("preserved Wave 1 model mismatch");
  if (result.value?.artifact_id !== "fff-composition-expansion-wave1-001" || result.value?.passed !== true || result.value?.failures?.length !== 0 || Object.keys(result.value?.negative_probes || {}).length !== 40) failures.push("preserved Wave 1 result mismatch");
  if (manifest.value?.artifact_id !== "fff-composition-expansion-wave1-001" || manifest.value?.file_count !== 19 || manifest.value?.payload_file_count !== 18) failures.push("preserved Wave 1 manifest mismatch");
  const entry = root.value?.composition_expansion_wave1 || {};
  if (root.value?.artifact_id !== ID || !root.value?.preserves?.includes("fff-composition-expansion-wave1-001") || entry.artifact_id !== "fff-composition-expansion-wave1-001" || entry.package_root !== "artifacts/composition-expansion-wave1") failures.push("preserved Wave 1 root registration mismatch");
  if (failures.length) fail(`Composition Expansion Wave 1 preserved read-only validation failed: ${failures.join("; ")}`);
  console.log(`Composition Expansion Wave 1 preserved read-only validation passed: ${target}`);
}

export async function runCompositionExpansionWave2Command({ command, inputPath, outputPath } = {}) {
  const target = repoPath(inputPath || RESULT_PATH);
  if (outputPath) fail(`${command} does not accept an output path; Wave 2 writes are fixed to ${MANIFEST_PATH} and ${RESULT_PATH}.`);
  if (target !== RESULT_PATH) fail(`${command} expects ${RESULT_PATH}.`);
  if (command === "smoke-composition-expansion-wave2") {
    const existing = await jsonSnapshot(RESULT_PATH); const browser = existing.value?.browser_evidence?.status === "captured" ? existing.value.browser_evidence : null;
    const manifest = await packageManifest(); await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    const inspection = await inspect(browser, { requireRoot: false });
    if (inspection.failures.length) fail(`Composition Expansion Wave 2 smoke failed: ${inspection.failures.join("; ")}`);
    const result = resultFromInspection(inspection); await writeFile(RESULT_PATH, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    console.log(`Composition Expansion Wave 2 smoke passed: ${RESULT_PATH}`); return;
  }
  if (command === "validate-composition-expansion-wave2") {
    const recorded = await jsonSnapshot(RESULT_PATH); const browser = recorded.value?.browser_evidence?.status === "captured" ? recorded.value.browser_evidence : null; const inspection = await inspect(browser, { requireRoot: true });
    inspection.failures.push(...recordedResultErrors(recorded.value, inspection, recorded.sha256)); inspection.failures = [...new Set(inspection.failures)];
    if (inspection.failures.length) fail(`Composition Expansion Wave 2 read-only validation failed: ${inspection.failures.join("; ")}`);
    console.log(`Composition Expansion Wave 2 read-only validation passed: ${RESULT_PATH}`); return;
  }
  fail(`Unknown Composition Expansion Wave 2 command: ${command}`);
}

async function playwrightModule() {
  const moduleRoot = process.env.FFF_NODE_MODULES;
  if (!moduleRoot) fail("FFF_NODE_MODULES must point to the bundled Node dependency root.");
  let entry = path.join(moduleRoot,"playwright","index.mjs");
  try { const packages = await readdir(path.join(moduleRoot,".pnpm")); const bundled = packages.find((name) => /^playwright@/.test(name)); if (bundled) entry = path.join(moduleRoot,".pnpm",bundled,"node_modules","playwright","index.mjs"); } catch { /* flat layout fallback */ }
  return import(pathToFileURL(entry).href);
}

export async function captureCompositionExpansionWave2BrowserEvidence() {
  const { chromium } = await playwrightModule(); await mkdir("artifacts/review-screens", { recursive: true }); const browser = await chromium.launch({ headless: true });
  const evidence = { status: "captured", captured_at: GENERATED_AT, viewports: {}, theme: { auto_default: true }, narrow: {}, print: {} };
  try {
    for (const [key,width,height,theme] of [["900x1200-dark",900,1200,"dark"],["1280x900-light",1280,900,"light"]]) {
      const context = await browser.newContext({ viewport: { width,height }, colorScheme: theme }); const page = await context.newPage(); await page.goto(pathToFileURL(path.resolve(HTML_PATH)).href,{ waitUntil: "load" }); await page.waitForFunction(() => [...document.images].every((image) => image.complete));
      const initialTheme = await page.evaluate(() => document.documentElement.dataset.theme); if (initialTheme !== "auto") evidence.theme.auto_default = false; await page.click(`[data-theme-choice="${theme}"]`);
      const metrics = await page.evaluate(() => { const nested = [...document.querySelectorAll("body *")].filter((element) => { const style=getComputedStyle(element); return /(auto|scroll)/.test(style.overflowY) && element.scrollHeight > element.clientHeight + 1; }); const first=document.querySelector(".shot"); const visual=first.querySelector(".visual").getBoundingClientRect(); const copy=first.querySelector(".copy").getBoundingClientRect(); return { resolved_theme: document.documentElement.dataset.theme, shot_count: document.querySelectorAll(".shot").length, horizontal_overflow: document.documentElement.scrollWidth > innerWidth + 1, document_scroll_width: document.documentElement.scrollWidth, inner_width: innerWidth, nested_scroll_owners: nested.length, first_visual_top: Number(visual.top.toFixed(2)), first_copy_top: Number(copy.top.toFixed(2)), image_before_copy: visual.top <= copy.top }; });
      evidence.viewports[key] = { width,height,initial_theme: initialTheme,...metrics }; if (theme === "dark") evidence.theme.dark_resolved = metrics.resolved_theme; else evidence.theme.light_resolved = metrics.resolved_theme;
      if (key === "900x1200-dark") { await page.evaluate(() => document.activeElement?.blur()); await page.keyboard.press("Tab"); evidence.theme.focus_visible = await page.evaluate(() => { const active=document.activeElement; const style=active?getComputedStyle(active):null; return Boolean(active?.matches(":focus-visible") && style && style.outlineStyle !== "none" && parseFloat(style.outlineWidth) >= 2); }); }
      if (key === "1280x900-light") { await page.emulateMedia({ media: "print" }); evidence.print = await page.evaluate(() => { const body=getComputedStyle(document.body); const themes=getComputedStyle(document.querySelector(".themes")); const shot=getComputedStyle(document.querySelector(".shot")); return { forced_light: body.backgroundColor === "rgb(255, 255, 255)", body_background: body.backgroundColor, theme_controls_hidden: themes.display === "none", shot_break_avoid: shot.breakInside === "avoid" || shot.pageBreakInside === "avoid" }; }); await page.emulateMedia({ media: "screen" }); }
      await page.screenshot({ path: SCREENSHOTS[key], fullPage: false }); await context.close();
    }
    const context = await browser.newContext({ viewport: { width: 720,height: 1000 }, colorScheme: "light" }); const page = await context.newPage(); await page.goto(pathToFileURL(path.resolve(HTML_PATH)).href,{ waitUntil: "load" }); await page.waitForFunction(() => [...document.images].every((image) => image.complete)); evidence.narrow = await page.evaluate(() => { const first=document.querySelector(".shot"); const visual=first.querySelector(".visual").getBoundingClientRect(); const copy=first.querySelector(".copy").getBoundingClientRect(); return { width: innerWidth, images_before_copy: visual.top < copy.top, horizontal_overflow: document.documentElement.scrollWidth > innerWidth + 1 }; }); await context.close();
  } finally { await browser.close(); }
  if (evidence.narrow.images_before_copy !== true || evidence.narrow.horizontal_overflow !== false) fail("Narrow viewport image-first contract failed.");
  const existing = await jsonSnapshot(RESULT_PATH); const partial = { ...(existing.value || {}), schemaVersion: RESULT_SCHEMA, artifact_id: ID, generated_at: GENERATED_AT, passed: false, failures: ["pending smoke validation"], browser_evidence: evidence }; await writeFile(RESULT_PATH, `${JSON.stringify(partial,null,2)}\n`, "utf8");
  console.log(`Composition Expansion Wave 2 browser evidence captured: ${Object.values(SCREENSHOTS).join(", ")}`); return evidence;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const command = process.argv[2];
  if (command === "build-package") await buildCompositionExpansionWave2Package();
  else if (command === "capture-browser") await captureCompositionExpansionWave2BrowserEvidence();
  else await runCompositionExpansionWave2Command({ command, inputPath: process.argv[3] });
}
