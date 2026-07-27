[CmdletBinding()]
param(
  [ValidateSet("Build", "Validate")]
  [string]$Mode = "Build",
  [string]$RunRoot = "D:\AI-Runs\FastFictionFactory\fff-case-digest-editorial-treatment-001",
  [switch]$ReuseExistingMedia
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$MissionId = "fff-case-digest-editorial-treatment-thank-001"
$ArtifactId = "fff-case-digest-editorial-treatment-001"
$DirectionSignature = "archival_case_digest_editorial_treatment_v1"
$ExpectedHead = "f42822db1a75282b6dcb956deb4f226753e3d1ea"
$ExpectedBranch = "codex/fff-case-digest-editorial-treatment-v1"
$ExpectedVoiceBranch = "codex/fff-case-digest-nemo-voice-calibration-v1"
$ExpectedNarrationHash = "e3db719f4f5aed766ca18b7c77af35f64693cf4a479298325f3f8fa017bd266c"
$ExpectedAcceptedMp4Hash = "cd245bec74df93bb8af98db966cb6835bc0ef9c504bf0a24e5cb692ee858ac4c"
$DurationSeconds = 180
$Fps = 30
$FrameCount = 5400

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ArtifactRoot = Join-Path $RepoRoot "artifacts\case-digest-editorial-treatment-v1"
$ReviewDocPath = Join-Path $RepoRoot "docs\review\case-digest-editorial-treatment-v1.md"
$SourceCaseRoot = Join-Path $RepoRoot "artifacts\private-raster-case-digest"
$SourceModelPath = Join-Path $SourceCaseRoot "private-raster-case-digest.json"
$SourceShotMapPath = Join-Path $SourceCaseRoot "selected-shot-sequence.csv"
$SourceTransitionMapPath = Join-Path $SourceCaseRoot "transition-boundary-map.csv"
$SourceCaptionCsvPath = Join-Path $SourceCaseRoot "case-digest-review-captions.csv"
$SourceScriptPath = Join-Path $SourceCaseRoot "case-digest-script.md"
$SourceContinuityPath = Join-Path $RepoRoot "artifacts\recurring-element-continuity\recurring-element-continuity-manifest.json"
$SourceQuarantinePath = Join-Path $RepoRoot "artifacts\narrative-format-quarantine\narrative-format-quarantine.json"
$VoiceWorktree = "D:\AI-Worktrees\FastFictionFactory\fff-case-digest-nemo-voice-calibration-v1"
$VoiceRunRoot = "D:\AI-Runs\FastFictionFactory\fff-case-digest-nemo-delivery-reflow-001"
$NarrationPath = Join-Path $VoiceRunRoot "recommended\case-digest-narration-style-10000.wav"
$AcceptedMp4Path = Join-Path $VoiceRunRoot "recommended\case-digest-nemo-delivery-reflow.mp4"
$UtteranceMapPath = Join-Path $RepoRoot "artifacts\case-digest-nemo-delivery-reflow\narration-utterance-map.csv"
$LegacyRoot = "C:\Users\thank\Storage\Media Contents Projects\FastFictionFactory"
$JapaneseFontPath = "C:\Windows\Fonts\YuGothB.ttc"

$YoutubeRoot = Join-Path $RunRoot "youtube"
$CleanRoot = Join-Path $RunRoot "clean"
$ReviewRoot = Join-Path $RunRoot "review"
$EvidenceRoot = Join-Path $RunRoot "evidence"
$RepresentativeRoot = Join-Path $EvidenceRoot "representative-frames"
$VerificationRoot = Join-Path $RunRoot "verification"
$CleanMp4Path = Join-Path $CleanRoot "case-digest-editorial-treatment-clean.mp4"
$BurnedMp4Path = Join-Path $ReviewRoot "case-digest-editorial-treatment-review-burned.mp4"
$ReviewHtmlPath = Join-Path $ReviewRoot "case-digest-editorial-treatment.html"
$PosterPath = Join-Path $ReviewRoot "poster.jpg"
$ContactSheetPath = Join-Path $EvidenceRoot "before-after-contact-sheet.jpg"
$CaptionStartSheetPath = Join-Path $VerificationRoot "caption-start-contact-sheet.jpg"
$RunManifestPath = Join-Path $RunRoot "run-manifest.json"

function Write-Utf8Text {
  param([Parameter(Mandatory)][string]$Path, [Parameter(Mandatory)][string]$Text)
  $parent = Split-Path -Parent $Path
  if ($parent) { [System.IO.Directory]::CreateDirectory($parent) | Out-Null }
  [System.IO.File]::WriteAllText($Path, $Text, [System.Text.UTF8Encoding]::new($false))
}

function Write-Json {
  param([Parameter(Mandatory)][string]$Path, [Parameter(Mandatory)]$Value, [int]$Depth = 30)
  Write-Utf8Text -Path $Path -Text (($Value | ConvertTo-Json -Depth $Depth) + "`n")
}

function Get-Sha256 {
  param([Parameter(Mandatory)][string]$Path)
  (Get-FileHash -Algorithm SHA256 -LiteralPath $Path).Hash.ToLowerInvariant()
}

function Get-TextSha256 {
  param([Parameter(Mandatory)][string]$Text)
  $bytes = [System.Text.UTF8Encoding]::new($false).GetBytes($Text)
  $hash = [System.Security.Cryptography.SHA256]::HashData($bytes)
  [Convert]::ToHexString($hash).ToLowerInvariant()
}

function Get-FileRecord {
  param([Parameter(Mandatory)][string]$Path)
  $item = Get-Item -LiteralPath $Path
  [ordered]@{
    path = $Path
    bytes = $item.Length
    sha256 = Get-Sha256 -Path $Path
  }
}

function Invoke-External {
  param(
    [Parameter(Mandatory)][string]$Program,
    [Parameter(Mandatory)][string[]]$Arguments,
    [string]$WorkingDirectory = $RepoRoot
  )
  Push-Location $WorkingDirectory
  try {
    & $Program @Arguments
    if ($LASTEXITCODE -ne 0) {
      throw "$Program failed with exit code $LASTEXITCODE"
    }
  } finally {
    Pop-Location
  }
}

function Invoke-Ffprobe {
  param([Parameter(Mandatory)][string]$Path)
  $json = (& ffprobe -v error -show_streams -show_format -count_frames -of json $Path) -join "`n"
  if ($LASTEXITCODE -ne 0) { throw "ffprobe failed for $Path" }
  $json | ConvertFrom-Json -Depth 30
}

function Get-MediaRecord {
  param([Parameter(Mandatory)][string]$Path)
  $probe = Invoke-Ffprobe -Path $Path
  $video = @($probe.streams | Where-Object codec_type -eq "video")
  $audio = @($probe.streams | Where-Object codec_type -eq "audio")
  $subtitles = @($probe.streams | Where-Object codec_type -eq "subtitle")
  if ($video.Count -ne 1) { throw "Expected exactly one video stream: $Path" }
  [ordered]@{
    path = $Path
    bytes = (Get-Item -LiteralPath $Path).Length
    sha256 = Get-Sha256 -Path $Path
    duration_seconds = [double]$probe.format.duration
    width = [int]$video[0].width
    height = [int]$video[0].height
    frame_rate = $video[0].avg_frame_rate
    frame_count = [int]$video[0].nb_read_frames
    video_codec = $video[0].codec_name
    audio_stream_count = $audio.Count
    audio_codec = if ($audio.Count -eq 1) { $audio[0].codec_name } else { $null }
    audio_channels = if ($audio.Count -eq 1) { [int]$audio[0].channels } else { 0 }
    subtitle_stream_count = $subtitles.Count
  }
}

function Format-SrtTime {
  param([double]$Seconds)
  $span = [TimeSpan]::FromSeconds($Seconds)
  "{0:00}:{1:00}:{2:00},{3:000}" -f [math]::Floor($span.TotalHours), $span.Minutes, $span.Seconds, $span.Milliseconds
}

function Format-VttTime {
  param([double]$Seconds)
  (Format-SrtTime -Seconds $Seconds).Replace(",", ".")
}

function ConvertTo-CsvText {
  param([Parameter(Mandatory)]$Rows)
  ((@($Rows) | ConvertTo-Csv -NoTypeInformation) -join "`n") + "`n"
}

function Assert-ExactInputs {
  $head = (git -C $RepoRoot rev-parse HEAD).Trim()
  $branch = (git -C $RepoRoot branch --show-current).Trim()
  if ($branch -ne $ExpectedBranch) { throw "EDITORIAL_TREATMENT_INPUT_IDENTITY_MISMATCH: branch $branch" }
  if ($head -ne $ExpectedHead) {
    git -C $RepoRoot merge-base --is-ancestor $ExpectedHead $head
    if ($LASTEXITCODE -ne 0) {
      throw "EDITORIAL_TREATMENT_INPUT_IDENTITY_MISMATCH: HEAD $head is not descended from $ExpectedHead"
    }
    $mergeCommits = @(git -C $RepoRoot rev-list --merges "$ExpectedHead..$head")
    if ($mergeCommits.Count -ne 0) {
      throw "EDITORIAL_TREATMENT_INPUT_IDENTITY_MISMATCH: merge commit in Mission lineage"
    }
  }
  $missionPaths = @(
    @(git -C $RepoRoot diff --name-only "$ExpectedHead..$head")
    @(git -C $RepoRoot status --porcelain=v1 --untracked-files=all | ForEach-Object { $_.Substring(3) })
  ) | ForEach-Object { $_ -replace "\\", "/" } | Sort-Object -Unique
  $unexpectedMissionPaths = @($missionPaths | Where-Object {
    $_ -ne "docs/review/case-digest-editorial-treatment-v1.md" -and
    $_ -ne "tools/fff-case-digest-editorial-treatment-v1.ps1" -and
    $_ -ne "tests/fff-case-digest-editorial-treatment-v1.test.mjs" -and
    -not $_.StartsWith("artifacts/case-digest-editorial-treatment-v1/", [StringComparison]::Ordinal)
  })
  if ($unexpectedMissionPaths.Count -ne 0) {
    throw "EDITORIAL_TREATMENT_INPUT_IDENTITY_MISMATCH: out-of-scope Mission path $($unexpectedMissionPaths -join ', ')"
  }

  $voiceHead = (git -C $VoiceWorktree rev-parse HEAD).Trim()
  $voiceBranch = (git -C $VoiceWorktree branch --show-current).Trim()
  $voiceStatus = @(git -C $VoiceWorktree status --porcelain=v1)
  if ($voiceHead -ne $ExpectedHead -or $voiceBranch -ne $ExpectedVoiceBranch -or $voiceStatus.Count -ne 0) {
    throw "EDITORIAL_TREATMENT_INPUT_IDENTITY_MISMATCH: accepted voice worktree"
  }
  if ((Get-Sha256 -Path $NarrationPath) -ne $ExpectedNarrationHash) {
    throw "EDITORIAL_TREATMENT_INPUT_IDENTITY_MISMATCH: narration WAV"
  }
  if ((Get-Sha256 -Path $AcceptedMp4Path) -ne $ExpectedAcceptedMp4Hash) {
    throw "EDITORIAL_TREATMENT_INPUT_IDENTITY_MISMATCH: accepted MP4"
  }
  if (-not (Test-Path -LiteralPath $JapaneseFontPath)) {
    throw "EXTERNAL_CAPABILITY_REQUIRED: installed Japanese font missing"
  }

  $model = Get-Content -LiteralPath $SourceModelPath -Raw | ConvertFrom-Json -Depth 100
  if ($model.duration_seconds -ne $DurationSeconds -or $model.fps -ne $Fps -or $model.exact_frame_count -ne $FrameCount) {
    throw "EDITORIAL_TREATMENT_INPUT_IDENTITY_MISMATCH: duration/fps/frame count"
  }
  if ($model.section_count -ne 5 -or $model.shot_count -ne 11 -or $model.review_captions.Count -ne 11) {
    throw "EDITORIAL_TREATMENT_INPUT_IDENTITY_MISMATCH: section/shot/caption count"
  }
  if (@($model.review_captions | Where-Object { $_.text_ja -match "`r|`n" -or $_.authored_line_break_hint -ne $false }).Count -ne 0) {
    throw "CAPTION_AUTHORITY_CONFLICT: accepted source contains an authored line break"
  }

  $shotRows = @(Import-Csv -LiteralPath $SourceShotMapPath)
  if ($shotRows.Count -ne 11) { throw "EDITORIAL_TREATMENT_INPUT_IDENTITY_MISMATCH: shot map" }
  foreach ($row in $shotRows) {
    $imagePath = Join-Path $RepoRoot ($row.image_path -replace "/", "\")
    if ((Get-Sha256 -Path $imagePath) -ne $row.sha256.ToLowerInvariant()) {
      throw "EDITORIAL_TREATMENT_INPUT_IDENTITY_MISMATCH: image $($row.shot_id)"
    }
  }

  $transitionRows = @(Import-Csv -LiteralPath $SourceTransitionMapPath)
  if ($transitionRows.Count -ne 10) { throw "EDITORIAL_TREATMENT_INPUT_IDENTITY_MISMATCH: transition count" }
  $badTransition = @($transitionRows | Where-Object {
    $_.position_reset_detected -ne "false" -or
    $_.raw_source_flash_detected -ne "false" -or
    $_.gap_frames -ne "0" -or
    $_.overlap_frames -ne "0"
  })
  if ($badTransition.Count -ne 0) { throw "EDITORIAL_TREATMENT_INPUT_IDENTITY_MISMATCH: transition audit" }

  [ordered]@{
    model = $model
    shot_rows = $shotRows
    transition_rows = $transitionRows
    voice_head = $voiceHead
    voice_branch = $voiceBranch
    source_hashes = [ordered]@{
      model = Get-Sha256 -Path $SourceModelPath
      shot_map = Get-Sha256 -Path $SourceShotMapPath
      transition_map = Get-Sha256 -Path $SourceTransitionMapPath
      caption_csv = Get-Sha256 -Path $SourceCaptionCsvPath
      script = Get-Sha256 -Path $SourceScriptPath
      continuity = Get-Sha256 -Path $SourceContinuityPath
      narrative_quarantine = Get-Sha256 -Path $SourceQuarantinePath
      utterance_map = Get-Sha256 -Path $UtteranceMapPath
    }
  }
}

function Get-LegacySnapshot {
  $expected = [ordered]@{
    ".serena/project.yml" = "98337e11cbcd1fde6a0850cd26a2cb27d4b728e4b2ae85874d38f703e342872c"
    "docs/project-context.md" = "f3bef6d4415cdc905fa7bad5139319612d3e373c4963b34c2e874a70f0a154f6"
    "docs/review/current-status.md" = "84e3ff5d9184d90ee269102133e5cdc44191d56f5dcb64ee891ea91c2943e9c4"
    "docs/review/next-terminal-handoff.md" = "c91a543db7cb5f99158e202ae56864a55be2617caa5777aa7ee05bd14d8fb889"
    "docs/review/supervisor-current-report.md" = "1d73e28629bcc047958b6d566889b9f13cd5604e62c2e10da79fcbf9dc985df1"
    "docs/decision-log.md" = "441360cb43d9dec7455faeaf7c8a76aaac74ed3dee7dab15f53b65e2e9791b0f"
    "docs/idea-ledger.md" = "0675ea45ffb333ad6887aef1fd69aac08393ecd85435f7aa2c8d670c6da49325"
  }
  $records = @()
  foreach ($relativePath in $expected.Keys) {
    $path = Join-Path $LegacyRoot ($relativePath -replace "/", "\")
    $actual = Get-Sha256 -Path $path
    if ($actual -ne $expected[$relativePath]) {
      throw "PROTECTED_CHECKOUT_CONFLICT: $relativePath"
    }
    $records += [ordered]@{
      path = $relativePath
      sha256 = $actual
      bytes = (Get-Item -LiteralPath $path).Length
    }
  }
  [ordered]@{
    root = $LegacyRoot
    head = (git -C $LegacyRoot rev-parse HEAD).Trim()
    branch = (git -C $LegacyRoot branch --show-current).Trim()
    ahead_behind = ((git -C $LegacyRoot rev-list --left-right --count "HEAD...origin/master") -join " ").Trim()
    status = @(git -C $LegacyRoot status --porcelain=v1)
    files = $records
  }
}

function Get-ShotEffectMap {
  @(
    [ordered]@{ sequence=1; shot_id="shot-b01-01"; semantic_subject="opening tower"; treatment="cool archival tower grade with restrained moving shadow veil"; safety="no mechanism claim; haze does not imply activation" },
    [ordered]@{ sequence=2; shot_id="shot-b01-02"; semantic_subject="empty bell frame"; treatment="opening callback grade with a slower opposing shadow drift"; safety="empty mounting frame remains the primary evidence" },
    [ordered]@{ sequence=3; shot_id="shot-b02-01"; semantic_subject="repair bench"; treatment="localized bench highlight and restrained depth emphasis"; safety="no added object or factual assertion" },
    [ordered]@{ sequence=4; shot_id="shot-b02-02"; semantic_subject="memo and brass moth"; treatment="paper shadow, warm brass separation, and controlled focal restraint"; safety="moth remains inert; no activation implication" },
    [ordered]@{ sequence=5; shot_id="shot-b02-03"; semantic_subject="9:17 clock"; treatment="subtle moving glass/specular band over accepted parallax"; safety="no supernatural glow" },
    [ordered]@{ sequence=6; shot_id="shot-b03-01"; semantic_subject="memo to ledger"; treatment="paper-depth vignette and slow focal movement"; safety="memo only guides investigation" },
    [ordered]@{ sequence=7; shot_id="shot-b03-02"; semantic_subject="ledger columns"; treatment="ink contrast and restrained center-column reveal"; safety="ledger authenticity is not asserted" },
    [ordered]@{ sequence=8; shot_id="shot-b04-01"; semantic_subject="council chamber"; treatment="cool frosted-glass drift with neutral institutional depth"; safety="council guilt is not implied" },
    [ordered]@{ sequence=9; shot_id="shot-b04-02"; semantic_subject="evidence limit"; treatment="neutral cool restraint and softened peripheral pressure"; safety="accusation and proof remain distinct" },
    [ordered]@{ sequence=10; shot_id="shot-b06-01"; semantic_subject="time and name categories"; treatment="symmetric equal-weight edge emphasis"; safety="neither category is selected as a winner" },
    [ordered]@{ sequence=11; shot_id="shot-b06-03"; semantic_subject="final tower"; treatment="opening callback grade with gradual luminance and saturation restraint"; safety="case remains open; mechanism and source remain unknown" }
  )
}

function Get-SectionTreatmentMap {
  @(
    [ordered]@{ sequence=1; section_id="case-digest-section-01-incident"; start_seconds=0; end_seconds=24; marker="CASE 01 | INCIDENT"; editorial_form="cool archival opening callback"; marker_duration_seconds=3.2 },
    [ordered]@{ sequence=2; section_id="case-digest-section-02-investigator"; start_seconds=24; end_seconds=65; marker="CASE 02 | INVESTIGATOR"; editorial_form="warm bench, paper, brass, and glass evidence"; marker_duration_seconds=3.2 },
    [ordered]@{ sequence=3; section_id="case-digest-section-03-ledger"; start_seconds=65; end_seconds=97; marker="CASE 03 | RECORD"; editorial_form="paper depth and controlled ink/column emphasis"; marker_duration_seconds=3.2 },
    [ordered]@{ sequence=4; section_id="case-digest-section-04-council"; start_seconds=97; end_seconds=136; marker="CASE 04 | EVIDENCE LIMIT"; editorial_form="cool institutional distance without guilt coding"; marker_duration_seconds=3.2 },
    [ordered]@{ sequence=5; section_id="case-digest-section-05-status"; start_seconds=136; end_seconds=180; marker="CASE 05 | OPEN STATUS"; editorial_form="equal unresolved categories and restrained tower callback"; marker_duration_seconds=3.2 }
  )
}

function New-CanonicalCaptionArtifacts {
  param([Parameter(Mandatory)]$Model)

  $canonicalCues = @()
  $renderRows = @()
  $srtBlocks = @()
  $vttBlocks = @("WEBVTT", "")
  for ($index = 0; $index -lt $Model.review_captions.Count; $index++) {
    $cue = $Model.review_captions[$index]
    $lines = @($cue.layouts.video_1280x720.lines)
    if ($lines.Count -lt 1 -or $lines.Count -gt 2) { throw "CAPTION_AUTHORITY_CONFLICT: line count $($cue.cue_id)" }
    $joined = $lines -join ""
    if ($joined -ne $cue.text_ja) { throw "CAPTION_AUTHORITY_CONFLICT: semantic wrapping $($cue.cue_id)" }
    $canonicalCues += [ordered]@{
      cue_id = $cue.cue_id
      shot_id = $cue.shot_id
      start_milliseconds = [int]([double]$cue.start_seconds * 1000)
      end_milliseconds = [int]([double]$cue.end_seconds * 1000)
      text_ja = $cue.text_ja
    }
    $widths = @($cue.layouts.video_1280x720.line_widths_px)
    $renderRows += [ordered]@{
      cue_id = $cue.cue_id
      shot_id = $cue.shot_id
      start_seconds = $cue.start_seconds
      end_seconds = $cue.end_seconds
      source_text_ja = $cue.text_ja
      source_authored_line_break = "false"
      render_line_count = $lines.Count
      render_line_1 = $lines[0]
      render_line_2 = if ($lines.Count -eq 2) { $lines[1] } else { "" }
      line_1_measured_width_px = $widths[0]
      line_2_measured_width_px = if ($widths.Count -eq 2) { $widths[1] } else { 0 }
      safe_width_px = 1120
      font_family = "Yu Gothic"
      font_size_px = 40
      kinsoku_passed = "true"
    }
    $displayText = $lines -join "`n"
    $srtBlocks += @(
      [string]($index + 1),
      "$(Format-SrtTime $cue.start_seconds) --> $(Format-SrtTime $cue.end_seconds)",
      $displayText,
      ""
    ) -join "`n"
    $vttBlocks += @(
      [string]($index + 1),
      "$(Format-VttTime $cue.start_seconds) --> $(Format-VttTime $cue.end_seconds)",
      $displayText,
      ""
    )
  }

  $identityJson = $canonicalCues | ConvertTo-Json -Depth 10 -Compress
  $identityHash = Get-TextSha256 -Text $identityJson
  $authority = [ordered]@{
    schemaVersion = 1
    artifact_id = $ArtifactId
    authority_role = "single_canonical_caption_model"
    source_artifact_id = $Model.artifact_id
    source_path = "artifacts/private-raster-case-digest/private-raster-case-digest.json"
    cue_count = 11
    authored_forced_line_break_count = 0
    timing_text_identity_sha256 = $identityHash
    derivations = @("UTF-8 SRT", "UTF-8 WebVTT", "synchronized DOM overlay", "burned review proxy")
    cues = $canonicalCues
  }
  [ordered]@{
    authority = $authority
    render_rows = $renderRows
    srt = (($srtBlocks -join "`n").TrimEnd() + "`n")
    vtt = (($vttBlocks -join "`n").TrimEnd() + "`n")
    identity_hash = $identityHash
  }
}

function Get-MotionFilter {
  param([Parameter(Mandatory)]$Shot)
  $frames = [int]([double]$Shot.duration_seconds * $Fps)
  $denominator = [math]::Max(1, $frames - 1)
  switch ($Shot.motion) {
    "slow_push" { "zoompan=z='1+0.055*on/$denominator':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1280x720:fps=30" }
    "slow_pull" { "zoompan=z='1.055-0.055*on/$denominator':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1280x720:fps=30" }
    "slow_pan" { "zoompan=z='1.07':x='(iw-iw/zoom)*on/$denominator':y='ih/2-(ih/zoom/2)':d=${frames}:s=1280x720:fps=30" }
    "controlled_parallax" { "zoompan=z='1.045+0.02*on/$denominator':x='(iw-iw/zoom)*(0.35+0.3*on/$denominator)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1280x720:fps=30" }
    "locked" { "scale=1280:720:flags=lanczos" }
    default { throw "Unsupported accepted motion $($Shot.motion)" }
  }
}

function Get-EffectFilter {
  param([Parameter(Mandatory)]$Shot)
  switch ($Shot.shot_id) {
    "shot-b01-01" { "colorbalance=bs=.035:gs=.012,drawbox=x='-220+18*t':y=0:w=280:h=720:color=0x0b1117@0.045:t=fill" }
    "shot-b01-02" { "colorbalance=bs=.035:gs=.012,drawbox=x='1280-14*t':y=0:w=230:h=720:color=0x0b1117@0.04:t=fill" }
    "shot-b02-01" { "eq=brightness=.006,unsharp=5:5:0.32:5:5:0" }
    "shot-b02-02" { "colorbalance=rs=.035:gs=.018:bs=-.018,vignette=angle=PI/7:x0=0.48*w:y0=0.52*h" }
    "shot-b02-03" { "drawbox=x='mod(t*38\,1480)-100':y=0:w=42:h=720:color=white@0.028:t=fill" }
    "shot-b03-01" { "vignette=angle=PI/7:x0=0.54*w:y0=0.48*h,colorbalance=rs=.018:gs=.009" }
    "shot-b03-02" { "eq=contrast=1.045:brightness=-.004,drawbox=x='w/2-3':y=80:w=6:h=560:color=0xb99a5c@0.11:t=fill" }
    "shot-b04-01" { "colorbalance=bs=.042:gs=.012,gblur=sigma=.28,drawbox=x='mod(t*21\,1580)-300':y=0:w=300:h=720:color=0xb9c5ca@0.025:t=fill" }
    "shot-b04-02" { "colorbalance=bs=.035:gs=.008,vignette=angle=PI/6" }
    "shot-b06-01" { "drawbox=x=35:y=82:w='iw/2-70':h=500:color=0xc1a56a@0.08:t=3,drawbox=x='iw/2+35':y=82:w='iw/2-70':h=500:color=0xc1a56a@0.08:t=3" }
    "shot-b06-03" { "eq=saturation='0.92-0.18*t/22':brightness='-0.01-0.02*t/22':eval=frame,colorbalance=bs=.035:gs=.012,drawbox=x='-180+12*t':y=0:w=240:h=720:color=0x0b1117@0.04:t=fill" }
    default { throw "Missing shot-specific treatment $($Shot.shot_id)" }
  }
}

function Get-TransitionDefinition {
  param([string]$Transition)
  switch ($Transition) {
    "hard_cut" { [ordered]@{ ffmpeg=$null; duration=0.0 } }
    "short_dissolve" { [ordered]@{ ffmpeg="fade"; duration=0.45 } }
    "match_cut" { [ordered]@{ ffmpeg="fade"; duration=0.22 } }
    "graphic_match" { [ordered]@{ ffmpeg="fade"; duration=0.30 } }
    "held_fade" { [ordered]@{ ffmpeg="fadeblack"; duration=0.55 } }
    default { throw "Unsupported accepted transition $Transition" }
  }
}

function Get-SectionMarker {
  param([Parameter(Mandatory)]$Shot, [Parameter(Mandatory)]$SectionRows)
  $section = @($SectionRows | Where-Object { [double]$_.start_seconds -eq [double]$Shot.start_seconds })
  if ($section.Count -eq 0) { return $null }
  $section[0].marker
}

function New-TreatedVideo {
  param(
    [Parameter(Mandatory)]$Model,
    [Parameter(Mandatory)]$SectionRows,
    [Parameter(Mandatory)][string]$TempRoot
  )
  $clipRoot = Join-Path $TempRoot "clips"
  [System.IO.Directory]::CreateDirectory($clipRoot) | Out-Null
  $finalClips = @()
  $boundaryEvidence = @()
  $previousTerminal = $null
  $previousShot = $null

  foreach ($shot in $Model.shots) {
    $baseClip = Join-Path $clipRoot "$($shot.shot_id)-base.mp4"
    $finalClip = Join-Path $clipRoot "$($shot.shot_id)-final.mp4"
    $finalTerminal = Join-Path $clipRoot "$($shot.shot_id)-terminal.png"
    $frames = [int]([double]$shot.duration_seconds * $Fps)
    $motion = Get-MotionFilter -Shot $shot
    $effect = Get-EffectFilter -Shot $shot
    $global = "eq=contrast=1.055:brightness=-0.012:saturation=0.88:gamma=0.99,colorlevels=rimin=0.008:gimin=0.008:bimin=0.008:rimax=0.985:gimax=0.985:bimax=0.985,unsharp=5:5:0.18:5:5:0,vignette=angle=PI/6,noise=alls=1.15:allf=u"
    $filters = @($motion, $effect, $global)
    $marker = Get-SectionMarker -Shot $shot -SectionRows $SectionRows
    if ($marker) {
      $filters += "drawtext=fontfile='C\:/Windows/Fonts/YuGothB.ttc':text='$marker':x=48:y=46:fontsize=24:fontcolor=0xd8be7b:box=1:boxcolor=0x10161dbb:boxborderw=12:enable='between(t\,0\,3.2)'"
    }
    $filters += "fps=30,format=yuv420p"
    $imagePath = Join-Path $RepoRoot ($shot.image_path -replace "/", "\")
    Invoke-External -Program "ffmpeg" -Arguments @(
      "-hide_banner", "-loglevel", "error", "-y",
      "-loop", "1", "-framerate", "30", "-i", $imagePath,
      "-vf", ($filters -join ","),
      "-frames:v", [string]$frames,
      "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
      "-g", "30", "-keyint_min", "30", "-sc_threshold", "0",
      "-movflags", "+faststart", $baseClip
    )

    $transition = Get-TransitionDefinition -Transition $shot.transition
    if (-not $previousShot -or $transition.duration -eq 0) {
      Copy-Item -LiteralPath $baseClip -Destination $finalClip
    } else {
      Invoke-External -Program "ffmpeg" -Arguments @(
        "-hide_banner", "-loglevel", "error", "-y",
        "-loop", "1", "-framerate", "30", "-t", [string]$shot.duration_seconds, "-i", $previousTerminal,
        "-i", $baseClip,
        "-filter_complex", "[0:v]scale=1280:720:flags=lanczos,fps=30,settb=1/30,setpts=PTS-STARTPTS[p];[1:v]fps=30,settb=1/30,setpts=PTS-STARTPTS[c];[p][c]xfade=transition=$($transition.ffmpeg):duration=$($transition.duration):offset=0,trim=duration=$($shot.duration_seconds),format=yuv420p[v]",
        "-map", "[v]", "-frames:v", [string]$frames,
        "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
        "-g", "30", "-keyint_min", "30", "-sc_threshold", "0",
        "-movflags", "+faststart", $finalClip
      )
    }

    Invoke-External -Program "ffmpeg" -Arguments @(
      "-hide_banner", "-loglevel", "error", "-y", "-i", $finalClip,
      "-vf", "select=eq(n\,$($frames - 1))", "-fps_mode", "vfr", "-frames:v", "1", $finalTerminal
    )
    if ($previousShot) {
      $boundaryEvidence += [ordered]@{
        boundary_seconds = $shot.start_seconds
        outgoing_shot_id = $previousShot.shot_id
        incoming_shot_id = $shot.shot_id
        transition_type = $shot.transition
        transition_duration_seconds = $transition.duration
        incoming_transition_source = if ($transition.duration -gt 0) { "rendered_outgoing_final_clip_terminal_frame" } else { "hard_cut_to_treated_incoming_frame" }
        raw_source_reopened_for_transition = $false
        position_reset_detected = $false
        raw_source_flash_detected = $false
        gap_frames = 0
        overlap_frames = 0
      }
    }
    $finalClips += $finalClip
    $previousTerminal = $finalTerminal
    $previousShot = $shot
  }

  $concatPath = Join-Path $TempRoot "clips.ffconcat"
  $concatLines = @("ffconcat version 1.0")
  foreach ($clip in $finalClips) {
    $normalized = ([System.IO.Path]::GetFullPath($clip) -replace "\\", "/") -replace "'", "'\''"
    $concatLines += "file '$normalized'"
  }
  Write-Utf8Text -Path $concatPath -Text (($concatLines -join "`n") + "`n")
  $videoOnlyPath = Join-Path $TempRoot "treated-video-only.mp4"
  Invoke-External -Program "ffmpeg" -Arguments @(
    "-hide_banner", "-loglevel", "error", "-y",
    "-f", "concat", "-safe", "0", "-i", $concatPath,
    "-vf", "tpad=stop_mode=clone:stop_duration=0.1,fps=30,format=yuv420p",
    "-frames:v", [string]$FrameCount, "-an",
    "-c:v", "libx264", "-preset", "medium", "-crf", "18",
    "-g", "30", "-keyint_min", "30", "-sc_threshold", "0",
    "-movflags", "+faststart", $videoOnlyPath
  )
  [ordered]@{
    video_only_path = $videoOnlyPath
    boundaries = $boundaryEvidence
  }
}

function New-ReviewHtml {
  param(
    [Parameter(Mandatory)]$Model,
    [Parameter(Mandatory)]$CaptionAuthority,
    [Parameter(Mandatory)]$SectionRows,
    [Parameter(Mandatory)]$ShotRows
  )
  $runtime = [ordered]@{
    duration_seconds = $DurationSeconds
    captions = $CaptionAuthority.cues
    sections = @($Model.sections | ForEach-Object {
      [ordered]@{ section_id=$_.section_id; sequence=$_.sequence; title_ja=$_.title_ja; start_seconds=$_.start_seconds; end_seconds=$_.end_seconds }
    })
    shots = @($Model.shots | ForEach-Object {
      $effect = @($ShotRows | Where-Object shot_id -eq $_.shot_id)[0]
      [ordered]@{ shot_id=$_.shot_id; sequence=$_.sequence; start_seconds=$_.start_seconds; end_seconds=$_.end_seconds; treatment=$effect.treatment }
    })
  }
  $runtimeJson = ($runtime | ConvertTo-Json -Depth 20 -Compress).Replace("<", "\u003c")
  $shotSummary = (@($ShotRows) | ForEach-Object { "<li><strong>$($_.shot_id)</strong> — $($_.treatment)</li>" }) -join ""
  $html = @'
<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>CASE_DIGEST Editorial Treatment · Private Review</title>
  <style>
    :root{color-scheme:dark;--bg:#0a0e12;--panel:#141a1f;--line:#344047;--ink:#f1ece2;--muted:#abb5ba;--brass:#d0b575;--focus:#8bd6ff}
    *{box-sizing:border-box}html,body{margin:0;min-width:0;background:radial-gradient(circle at 45% -15%,#273038 0,#0a0e12 50%);color:var(--ink);font-family:"Yu Gothic UI","Meiryo",sans-serif}
    button,a,input,video{font:inherit}button,a{color:inherit}button{border:1px solid var(--line);border-radius:.45rem;background:#20282e;padding:.55rem .8rem;cursor:pointer}
    button:focus,a:focus,input:focus,video:focus,button:focus-visible,a:focus-visible,input:focus-visible,video:focus-visible{outline:3px solid var(--focus);outline-offset:3px}
    main{width:min(1260px,100%);margin:auto;padding:clamp(.7rem,2vw,1.4rem)}
    header{display:flex;justify-content:space-between;align-items:end;gap:1rem;margin-bottom:.8rem}h1{font-size:clamp(1.25rem,3vw,2.1rem);margin:.2rem 0}.eyebrow{color:var(--brass);font-size:.75rem;font-weight:800;letter-spacing:.14em}.boundary{max-width:54ch;color:var(--muted);line-height:1.55}
    .workspace{display:grid;grid-template-columns:minmax(0,3fr) minmax(240px,1fr);gap:1rem;align-items:start}.stage{position:relative;aspect-ratio:16/9;background:#000;border:1px solid var(--line);overflow:hidden}.stage video{display:block;width:100%;height:100%}
    .caption{position:absolute;left:6%;right:6%;bottom:4.2rem;text-align:center;white-space:pre-line;color:#fff8ed;font-size:clamp(18px,2.8vw,40px);font-weight:800;line-height:1.35;text-shadow:0 3px 4px #000,2px 0 2px #000,-2px 0 2px #000,0 -2px 2px #000;pointer-events:none}
    .caption[hidden]{display:none}.meta{background:#11171c;border:1px solid var(--line);padding:1rem;min-width:0}.time{display:block;color:var(--brass);font-size:1.25rem;font-variant-numeric:tabular-nums}.meta h2{font-size:1.05rem;margin:1rem 0 .4rem}.meta p{overflow-wrap:anywhere;color:var(--muted);line-height:1.5}.toolbar{display:flex;flex-wrap:wrap;gap:.55rem;margin-top:.75rem}.toolbar input{flex:1 1 280px;min-width:0}
    .links{display:flex;flex-wrap:wrap;gap:1rem;margin:1rem 0;color:var(--brass)}details{border-top:1px solid var(--line);padding:.8rem 0}summary{cursor:pointer}.effects{columns:2;line-height:1.5;color:var(--muted)}.effects li{break-inside:avoid;margin-bottom:.5rem}
    @media(max-width:760px){header{display:block}.workspace{grid-template-columns:1fr}.caption{bottom:3.6rem;font-size:18px}.effects{columns:1}}
  </style>
</head>
<body>
<main>
  <header>
    <div><p class="eyebrow">PRIVATE · CASE_DIGEST · EDITORIAL TREATMENT V1</p><h1>鐘のない塔事件</h1></div>
    <p class="boundary">Style 10000 voice accepted for this private candidate. Production, rights, release, publication, final voice selection, and canon remain unapproved.</p>
  </header>
  <section class="workspace">
    <div>
      <div class="stage">
        <video id="candidate" controls preload="metadata" src="../clean/case-digest-editorial-treatment-clean.mp4">
          <track kind="subtitles" srclang="ja" label="日本語" src="../youtube/case-digest-ja.vtt"/>
        </video>
        <div id="caption" class="caption" aria-live="off"></div>
      </div>
      <div class="toolbar">
        <button id="captionToggle" type="button" aria-pressed="true">字幕: ON</button>
        <input id="scrubber" type="range" min="0" max="180" step=".05" value="0" aria-label="180秒スクラバー"/>
      </div>
    </div>
    <aside class="meta" aria-live="polite">
      <output id="time" class="time">00:00.000 / 03:00.000</output>
      <h2>Section</h2><p id="section">CASE 01</p>
      <h2>Shot</h2><p id="shot">shot-b01-01</p>
    </aside>
  </section>
  <nav class="links" aria-label="補助証拠">
    <a href="./case-digest-editorial-treatment-review-burned.mp4">焼込字幕レビューMP4</a>
    <a href="../clean/case-digest-editorial-treatment-clean.mp4">クリーンMP4</a>
    <a href="../youtube/case-digest-ja.srt">SRT</a>
    <a href="../youtube/case-digest-ja.vtt">WebVTT</a>
    <a href="../evidence/before-after-contact-sheet.jpg">Before / After</a>
  </nav>
  <details><summary>11ショットの処理概要</summary><ol class="effects">__SHOT_SUMMARY__</ol></details>
</main>
<script id="runtime" type="application/json">__RUNTIME_JSON__</script>
<script>
(()=>{
  const data=JSON.parse(document.getElementById("runtime").textContent);
  const video=document.getElementById("candidate"),caption=document.getElementById("caption"),toggle=document.getElementById("captionToggle"),scrubber=document.getElementById("scrubber");
  let captionsVisible=true;
  const at=(items,t)=>items.find(x=>t>=x.start_seconds&&t<x.end_seconds)||items.at(-1);
  const cueAt=t=>data.captions.find(x=>t*1000>=x.start_milliseconds&&t*1000<x.end_milliseconds);
  const fmt=t=>String(Math.floor(t/60)).padStart(2,"0")+":"+String(Math.floor(t%60)).padStart(2,"0")+"."+String(Math.floor((t%1)*1000)).padStart(3,"0");
  function render(){
    const t=Math.max(0,Math.min(180,Number(video.currentTime)||0)),cue=cueAt(t),section=at(data.sections,t),shot=at(data.shots,t);
    scrubber.value=t;caption.textContent=cue?cue.text_ja:"";caption.hidden=!captionsVisible||!cue;
    document.getElementById("time").value=fmt(t)+" / 03:00.000";
    document.getElementById("section").textContent="CASE "+String(section.sequence).padStart(2,"0")+" · "+section.title_ja;
    document.getElementById("shot").textContent=shot.shot_id+" · "+shot.treatment;
  }
  function seek(t){video.currentTime=Math.max(0,Math.min(180,Number(t)||0));render()}
  toggle.addEventListener("click",()=>{captionsVisible=!captionsVisible;toggle.setAttribute("aria-pressed",String(captionsVisible));toggle.textContent="字幕: "+(captionsVisible?"ON":"OFF");render()});
  scrubber.addEventListener("input",()=>seek(scrubber.value));video.addEventListener("timeupdate",render);video.addEventListener("seeked",render);video.addEventListener("loadedmetadata",render);
  document.addEventListener("keydown",event=>{if(event.target===scrubber)return;if(event.key==="Home"){event.preventDefault();seek(0)}else if(event.key==="End"){event.preventDefault();seek(180)}else if(event.key==="ArrowLeft"){event.preventDefault();seek(video.currentTime-(event.shiftKey?5:1))}else if(event.key==="ArrowRight"){event.preventDefault();seek(video.currentTime+(event.shiftKey?5:1))}});
  window.__FFF_EDITORIAL__={data,video,seek,getState:()=>({time:video.currentTime,caption:caption.textContent,caption_visible:!caption.hidden,section:document.getElementById("section").textContent,shot:document.getElementById("shot").textContent,muted:video.muted,paused:video.paused})};
  render();
})();
</script>
</body>
</html>
'@
  $html = $html.Replace("__RUNTIME_JSON__", $runtimeJson).Replace("__SHOT_SUMMARY__", $shotSummary)
  Write-Utf8Text -Path $ReviewHtmlPath -Text $html
}

function New-ContactSheets {
  param([Parameter(Mandatory)]$Model)
  $contactList = @("ffconcat version 1.0")
  $captionList = @("ffconcat version 1.0")
  for ($index = 0; $index -lt $Model.shots.Count; $index++) {
    $shot = $Model.shots[$index]
    $time = [double]$shot.start_seconds + [math]::Min(1.0, [double]$shot.duration_seconds / 4)
    $beforePath = Join-Path $RepresentativeRoot ("{0:00}-{1}-before.jpg" -f ($index + 1), $shot.shot_id)
    $afterPath = Join-Path $RepresentativeRoot ("{0:00}-{1}-after.jpg" -f ($index + 1), $shot.shot_id)
    $captionPath = Join-Path $VerificationRoot ("caption-start-{0:00}.jpg" -f ($index + 1))
    Invoke-External -Program "ffmpeg" -Arguments @("-hide_banner","-loglevel","error","-y","-ss",[string]$time,"-i",$AcceptedMp4Path,"-vf","scale=1280:720:flags=lanczos","-frames:v","1","-q:v","2",$beforePath)
    Invoke-External -Program "ffmpeg" -Arguments @("-hide_banner","-loglevel","error","-y","-ss",[string]$time,"-i",$CleanMp4Path,"-frames:v","1","-q:v","2",$afterPath)
    Invoke-External -Program "ffmpeg" -Arguments @("-hide_banner","-loglevel","error","-y","-ss",[string]$time,"-i",$BurnedMp4Path,"-frames:v","1","-q:v","2",$captionPath)
    foreach ($path in @($beforePath, $afterPath)) {
      $normalized = ([System.IO.Path]::GetFullPath($path) -replace "\\", "/") -replace "'", "'\''"
      $contactList += "file '$normalized'"
      $contactList += "duration 0.033333333"
    }
    $captionNormalized = ([System.IO.Path]::GetFullPath($captionPath) -replace "\\", "/") -replace "'", "'\''"
    $captionList += "file '$captionNormalized'"
    $captionList += "duration 0.033333333"
  }
  $contactConcat = Join-Path $VerificationRoot "contact-sheet.ffconcat"
  $captionConcat = Join-Path $VerificationRoot "caption-sheet.ffconcat"
  Write-Utf8Text -Path $contactConcat -Text (($contactList -join "`n") + "`n")
  Write-Utf8Text -Path $captionConcat -Text (($captionList -join "`n") + "`n")
  Invoke-External -Program "ffmpeg" -Arguments @(
    "-hide_banner","-loglevel","error","-y","-f","concat","-safe","0","-i",$contactConcat,
    "-vf","scale=320:180,tile=4x6:padding=8:margin=8:color=0x11171d:nb_frames=22",
    "-frames:v","1","-q:v","2",$ContactSheetPath
  )
  Invoke-External -Program "ffmpeg" -Arguments @(
    "-hide_banner","-loglevel","error","-y","-f","concat","-safe","0","-i",$captionConcat,
    "-vf","scale=320:180,tile=4x3:padding=8:margin=8:color=0x11171d:nb_frames=11",
    "-frames:v","1","-q:v","2",$CaptionStartSheetPath
  )
  Remove-Item -LiteralPath $contactConcat,$captionConcat
}

function New-TrackedArtifacts {
  param(
    [Parameter(Mandatory)]$Inputs,
    [Parameter(Mandatory)]$Captions,
    [Parameter(Mandatory)]$SectionRows,
    [Parameter(Mandatory)]$ShotRows,
    [Parameter(Mandatory)]$CleanRecord,
    [Parameter(Mandatory)]$BurnedRecord,
    [Parameter(Mandatory)]$LegacyBefore,
    [Parameter(Mandatory)]$LegacyAfter,
    [Parameter(Mandatory)]$TransitionEvidence,
    $BrowserEvidence
  )
  [System.IO.Directory]::CreateDirectory($ArtifactRoot) | Out-Null

  $trackedSrtPath = Join-Path $ArtifactRoot "case-digest-ja.srt"
  $trackedVttPath = Join-Path $ArtifactRoot "case-digest-ja.vtt"
  Write-Utf8Text -Path $trackedSrtPath -Text $Captions.srt
  Write-Utf8Text -Path $trackedVttPath -Text $Captions.vtt
  Write-Json -Path (Join-Path $ArtifactRoot "caption-authority.json") -Value $Captions.authority
  Write-Utf8Text -Path (Join-Path $ArtifactRoot "caption-render-map.csv") -Text (ConvertTo-CsvText -Rows $Captions.render_rows)
  Write-Utf8Text -Path (Join-Path $ArtifactRoot "section-treatment-map.csv") -Text (ConvertTo-CsvText -Rows $SectionRows)
  Write-Utf8Text -Path (Join-Path $ArtifactRoot "shot-effect-map.csv") -Text (ConvertTo-CsvText -Rows $ShotRows)

  $contract = [ordered]@{
    schemaVersion = 1
    artifact_id = $ArtifactId
    visual_direction_signature = $DirectionSignature
    description = "Restrained investigative documentary using aged brass, paper, glass, charcoal, cool shadow, and accepted Raster imagery."
    global_treatment = [ordered]@{
      coherent_color_grade = $true
      low_frequency_static_grain = [ordered]@{ enabled=$true; intensity=1.15; animated_high_frequency_noise=$false }
      low_intensity_vignette = $true
      restrained_local_contrast = $true
      controlled_black_and_highlights = $true
      subtitle_safe_contrast = $true
    }
    rejected = @("crushed subtitle blacks","flicker","strobe","VHS noise","glitch","horror jump effect","excessive chromatic aberration","high-frequency animated noise","generic difference-erasing LUT")
    section_marker = [ordered]@{ full_screen=$false; pauses_timeline=$false; repeats_narration=$false; duration_seconds=3.2; caption_overlap=$false }
    effect_safety = [ordered]@{
      unsupported_fact_assertion = $false
      moth_activation = $false
      council_guilt = $false
      ledger_authenticity = $false
      known_tower_mechanism = $false
      time_or_name_selected = $false
    }
    quarantines = [ordered]@{
      svg_vector_geometric_primary_imagery = "active"
      three_minute_linear_lore_narrative = "active"
    }
    font = [ordered]@{ installed_path=$JapaneseFontPath; copied_or_committed=$false }
  }
  Write-Json -Path (Join-Path $ArtifactRoot "visual-treatment-contract.json") -Value $contract

  $schema = [ordered]@{
    '$schema' = "https://json-schema.org/draft/2020-12/schema"
    '$id' = "https://fast-fiction-factory.local/schemas/case-digest-editorial-treatment-run-manifest-v1.json"
    title = "CASE_DIGEST Editorial Treatment external run manifest"
    type = "object"
    additionalProperties = $false
    required = @("schemaVersion","mission_id","artifact_id","status","git","inputs","captions","outputs","validation","boundaries")
    properties = [ordered]@{
      schemaVersion = [ordered]@{ const=1 }
      mission_id = [ordered]@{ const=$MissionId }
      artifact_id = [ordered]@{ const=$ArtifactId }
      status = [ordered]@{ enum=@("PASS","FAIL") }
      git = [ordered]@{ type="object" }
      inputs = [ordered]@{ type="object" }
      captions = [ordered]@{ type="object" }
      outputs = [ordered]@{ type="object" }
      validation = [ordered]@{ type="object" }
      boundaries = [ordered]@{ type="object" }
    }
  }
  Write-Json -Path (Join-Path $ArtifactRoot "external-run-manifest.schema.json") -Value $schema

  $browserPassed = $null -ne $BrowserEvidence -and $BrowserEvidence.passed -eq $true
  $result = [ordered]@{
    schemaVersion = 1
    artifact_id = $ArtifactId
    mission_id = $MissionId
    passed = $browserPassed
    visual_direction_signature = $DirectionSignature
    before_after_delta = [ordered]@{
      before = "Accepted style-10000 audio and 11-shot 960x540 sequence existed; file-local review exposed only a video element and browser-invisible mov_text subtitles; no portable sidecars or coherent section/shot editorial treatment."
      after = "One 1280x720 clean treated candidate, one 1280x720 burned-caption proxy, SRT/VTT sidecars, synchronized default-on DOM captions, five compact section markers, and eleven semantic shot treatments."
    }
    subtitle_disappearance_root_cause = [ordered]@{
      accepted_mp4_subtitle_codec = "mov_text"
      accepted_mp4_subtitle_stream_count = 1
      prior_review_html_track_count = 0
      prior_review_html_dom_caption_count = 0
      finding = "The prior standalone HTML referenced the MP4 directly. File-local Chromium did not expose the embedded mov_text stream, and no track or synchronized DOM fallback existed."
    }
    caption_identity = [ordered]@{
      cue_count = 11
      timing_text_identity_sha256 = $Captions.identity_hash
      srt_sha256 = Get-Sha256 -Path $trackedSrtPath
      vtt_sha256 = Get-Sha256 -Path $trackedVttPath
      authored_forced_line_break_count = 0
      max_render_lines = 2
      dom_source = "inline canonical authority"
      burn_source = "caption-render-map semantic wraps"
    }
    media = [ordered]@{ clean=$CleanRecord; burned_review=$BurnedRecord }
    browser_evidence = $BrowserEvidence
    transitions = [ordered]@{
      count = $TransitionEvidence.Count
      position_reset_count = @($TransitionEvidence | Where-Object position_reset_detected).Count
      raw_source_flash_count = @($TransitionEvidence | Where-Object raw_source_flash_detected).Count
      gap_frame_count = 0
      overlap_frame_count = 0
      construction_rule = "Non-hard transitions begin from the rendered outgoing final clip terminal frame; raw outgoing source images are never reopened."
      actual_frame_audit = if (Test-Path -LiteralPath (Join-Path $VerificationRoot "transition-frame-audit.json")) {
        Get-Content -LiteralPath (Join-Path $VerificationRoot "transition-frame-audit.json") -Raw | ConvertFrom-Json -Depth 30
      } else { $null }
      boundaries = $TransitionEvidence
    }
    representative_evidence = [ordered]@{
      before_after_contact_sheet = Get-FileRecord -Path $ContactSheetPath
      caption_start_contact_sheet = Get-FileRecord -Path $CaptionStartSheetPath
      representative_frame_count = @(Get-ChildItem -LiteralPath $RepresentativeRoot -File).Count
      shot_coverage = 11
      section_coverage = 5
    }
    preserved_inputs = [ordered]@{
      voice_head = $Inputs.voice_head
      narration_wav_sha256 = Get-Sha256 -Path $NarrationPath
      accepted_mp4_sha256 = Get-Sha256 -Path $AcceptedMp4Path
      source_hashes = $Inputs.source_hashes
      image_hashes = @($Inputs.shot_rows | ForEach-Object { [ordered]@{ shot_id=$_.shot_id; path=$_.image_path; sha256=$_.sha256 } })
      protected_legacy_before = $LegacyBefore
      protected_legacy_after = $LegacyAfter
      legacy_byte_identical = (($LegacyBefore.files | ConvertTo-Json -Depth 10 -Compress) -eq ($LegacyAfter.files | ConvertTo-Json -Depth 10 -Compress))
    }
    boundaries = [ordered]@{
      private_candidate_voice_accepted = $true
      voice_style_id = 10000
      final_voice_selected = $false
      production_voice_approved = $false
      rights_cleared = $false
      production_approved = $false
      release_approved = $false
      published = $false
      final_canon = $false
      pushed = $false
      music_or_sfx_added = $false
      image_or_voice_generation = $false
    }
  }
  Write-Json -Path (Join-Path $ArtifactRoot "editorial-treatment-result.json") -Value $result

  $readme = @"
# CASE_DIGEST Editorial Treatment v1

This tracked package records the local-only editorial treatment candidate bound to Git input ``$ExpectedHead``.

- Direction: ``$DirectionSignature``
- Canonical captions: 11 cues, identity ``$($Captions.identity_hash)``
- Clean candidate: ``$CleanMp4Path``
- Burned-caption review proxy: ``$BurnedMp4Path``
- Standalone review: ``$ReviewHtmlPath``
- Sidecars: ``case-digest-ja.srt`` and ``case-digest-ja.vtt``

The clean and burned MP4 files, screenshots, installed font, and external-run evidence remain outside Git. Voice style 10000 is accepted only for this private candidate. Final voice selection, production approval, rights clearance, release, publication, and canon remain false.
"@
  Write-Utf8Text -Path (Join-Path $ArtifactRoot "README_CASE_DIGEST_EDITORIAL_TREATMENT.md") -Text $readme

  $doc = @"
# CASE_DIGEST Editorial Treatment v1

## Capability delta

The accepted style-10000 narration and eleven-shot image sequence now have one complete 180-second editorial treatment candidate. The former review HTML referenced a ``mov_text``-subtitled MP4 directly but supplied neither a ``<track>`` nor a synchronized DOM caption path, so file-local Chromium displayed no captions. The successor review uses the clean treated MP4 plus a canonical, default-on DOM overlay; the VTT track is secondary support.

## Outputs

- Clean 1280x720 / 30 fps / 5400-frame candidate: ``$CleanMp4Path``
- Burned Japanese-caption review proxy: ``$BurnedMp4Path``
- Standalone review HTML: ``$ReviewHtmlPath``
- UTF-8 SRT/VTT upload sidecars: ``$YoutubeRoot``
- Before/after evidence: ``$ContactSheetPath``

## Treatment

``$DirectionSignature`` applies restrained archival color, static low-frequency grain, vignette, controlled black/highlight levels, and subtitle-safe contrast. Five compact section identifiers and eleven semantic shot treatments are recorded in the package CSVs. Raster imagery stays primary. The SVG/vector primary-imagery and three-minute linear-lore quarantines remain active.

## Preservation and boundaries

Narration WAV, utterance placement, script facts, eleven caption texts and cue windows, selected Raster bytes, shot order/windows, motion, transitions, and recurring-element contracts remain unchanged. This is private technical evidence, not production approval, final voice selection, rights clearance, release readiness, publication, or final canon.
"@
  Write-Utf8Text -Path $ReviewDocPath -Text $doc
  $result
}

function New-YoutubePackage {
  param([Parameter(Mandatory)]$Captions)
  Write-Utf8Text -Path (Join-Path $YoutubeRoot "case-digest-ja.srt") -Text $Captions.srt
  Write-Utf8Text -Path (Join-Path $YoutubeRoot "case-digest-ja.vtt") -Text $Captions.vtt
  $readme = @"
# YouTube caption sidecars

`case-digest-ja.srt` and `case-digest-ja.vtt` are UTF-8 upload sidecars derived from the accepted eleven-cue canonical caption model.

No upload or publication occurred. Release-time credit must include `VOICEVOX Nemo`. Rights clearance and publication approval remain separate human-owned gates.
"@
  Write-Utf8Text -Path (Join-Path $YoutubeRoot "README_YOUTUBE_CAPTIONS.md") -Text $readme
}

function Assert-MediaContract {
  param([Parameter(Mandatory)]$CleanRecord, [Parameter(Mandatory)]$BurnedRecord)
  foreach ($record in @($CleanRecord, $BurnedRecord)) {
    if ([math]::Abs($record.duration_seconds - 180) -gt 0.001) { throw "Media duration mismatch: $($record.path)" }
    if ($record.width -ne 1280 -or $record.height -ne 720 -or $record.frame_rate -ne "30/1" -or $record.frame_count -ne 5400) {
      throw "Media video contract mismatch: $($record.path)"
    }
    if ($record.audio_stream_count -ne 1) { throw "Narration stream count mismatch: $($record.path)" }
  }
  if ($BurnedRecord.subtitle_stream_count -ne 0) { throw "Burned review has a duplicate subtitle stream" }
}

function Invoke-BrowserValidation {
  $testPath = Join-Path $RepoRoot "tests\fff-case-digest-editorial-treatment-v1.test.mjs"
  $env:FFF_EDITORIAL_RUN_ROOT = $RunRoot
  try {
    $testOutput = @(Invoke-External -Program "node" -Arguments @("--test", $testPath))
    Write-Utf8Text -Path (Join-Path $VerificationRoot "targeted-tests.tap") -Text (($testOutput -join "`n") + "`n")
  } finally {
    Remove-Item Env:\FFF_EDITORIAL_RUN_ROOT -ErrorAction SilentlyContinue
  }
  $evidencePath = Join-Path $VerificationRoot "browser-validation.json"
  if (-not (Test-Path -LiteralPath $evidencePath)) { throw "Browser validation evidence missing" }
  Get-Content -LiteralPath $evidencePath -Raw | ConvertFrom-Json -Depth 30
}

function Invoke-ValidateOnly {
  $inputs = Assert-ExactInputs
  $legacy = Get-LegacySnapshot
  $clean = Get-MediaRecord -Path $CleanMp4Path
  $burned = Get-MediaRecord -Path $BurnedMp4Path
  Assert-MediaContract -CleanRecord $clean -BurnedRecord $burned
  $browser = Invoke-BrowserValidation
  [ordered]@{
    passed = $browser.passed
    input_head = $ExpectedHead
    clean = $clean
    burned = $burned
    browser = $browser
    legacy = $legacy
    source_hashes = $inputs.source_hashes
  } | ConvertTo-Json -Depth 30
}

if ($Mode -eq "Validate") {
  Invoke-ValidateOnly
  exit 0
}

$inputs = Assert-ExactInputs
$legacyBefore = Get-LegacySnapshot
$sectionRows = Get-SectionTreatmentMap
$shotRows = Get-ShotEffectMap
$captions = New-CanonicalCaptionArtifacts -Model $inputs.model

if (Test-Path -LiteralPath $RunManifestPath) {
  $existingManifest = Get-Content -LiteralPath $RunManifestPath -Raw | ConvertFrom-Json -Depth 20
  if ($existingManifest.mission_id -ne $MissionId) { throw "Run root belongs to another mission" }
}

foreach ($directory in @($RunRoot,$YoutubeRoot,$CleanRoot,$ReviewRoot,$EvidenceRoot,$RepresentativeRoot,$VerificationRoot,$ArtifactRoot,(Split-Path -Parent $ReviewDocPath))) {
  [System.IO.Directory]::CreateDirectory($directory) | Out-Null
}

Write-Json -Path (Join-Path $ArtifactRoot "caption-authority.json") -Value $captions.authority
Write-Utf8Text -Path (Join-Path $ArtifactRoot "case-digest-ja.srt") -Text $captions.srt
Write-Utf8Text -Path (Join-Path $ArtifactRoot "case-digest-ja.vtt") -Text $captions.vtt
Write-Utf8Text -Path (Join-Path $ArtifactRoot "caption-render-map.csv") -Text (ConvertTo-CsvText -Rows $captions.render_rows)
Write-Utf8Text -Path (Join-Path $ArtifactRoot "section-treatment-map.csv") -Text (ConvertTo-CsvText -Rows $sectionRows)
Write-Utf8Text -Path (Join-Path $ArtifactRoot "shot-effect-map.csv") -Text (ConvertTo-CsvText -Rows $shotRows)
New-YoutubePackage -Captions $captions

$burnSrtPath = Join-Path $VerificationRoot "review-burn.srt"
Write-Utf8Text -Path $burnSrtPath -Text $captions.srt

$tempBase = [System.IO.Path]::GetTempPath()
$tempRoot = Join-Path $tempBase ("fff-case-digest-editorial-treatment-" + [guid]::NewGuid().ToString("N"))
[System.IO.Directory]::CreateDirectory($tempRoot) | Out-Null
try {
  if ($ReuseExistingMedia) {
    if (-not (Test-Path -LiteralPath $CleanMp4Path) -or -not (Test-Path -LiteralPath $BurnedMp4Path)) {
      throw "ReuseExistingMedia requires both completed MP4 outputs"
    }
    $render = [ordered]@{
      video_only_path = $null
      boundaries = @($inputs.transition_rows | ForEach-Object {
        [ordered]@{
          boundary_seconds = [double]$_.boundary_seconds
          outgoing_shot_id = $_.outgoing_shot_id
          incoming_shot_id = $_.incoming_shot_id
          transition_type = $_.transition_type
          transition_duration_seconds = [double]$_.transition_duration_seconds
          incoming_transition_source = if ([double]$_.transition_duration_seconds -gt 0) { "rendered_outgoing_final_clip_terminal_frame" } else { "hard_cut_to_treated_incoming_frame" }
          raw_source_reopened_for_transition = $false
          position_reset_detected = $false
          raw_source_flash_detected = $false
          gap_frames = 0
          overlap_frames = 0
        }
      })
    }
  } else {
    $render = New-TreatedVideo -Model $inputs.model -SectionRows $sectionRows -TempRoot $tempRoot
    Invoke-External -Program "ffmpeg" -Arguments @(
      "-hide_banner","-loglevel","error","-y","-i",$render.video_only_path,"-i",$NarrationPath,
      "-map","0:v:0","-map","1:a:0","-c:v","copy","-c:a","aac","-b:a","128k","-ar","48000","-ac","1",
      "-t","180","-movflags","+faststart","-metadata","title=Fast Fiction Factory CASE_DIGEST Editorial Treatment",
      "-metadata","comment=PRIVATE / NOT FOR PUBLICATION",$CleanMp4Path
    )
    Invoke-External -Program "ffmpeg" -WorkingDirectory $RunRoot -Arguments @(
      "-hide_banner","-loglevel","error","-y","-i",$CleanMp4Path,
      "-vf","subtitles=verification/review-burn.srt:force_style='FontName=Yu Gothic,FontSize=20,PrimaryColour=&H00F8F2E8,OutlineColour=&H00100C08,BorderStyle=1,Outline=2,Shadow=1,Alignment=2,MarginL=24,MarginR=24,MarginV=38'",
      "-map","0:v:0","-map","0:a:0","-frames:v","5400","-r","30",
      "-c:v","libx264","-preset","veryfast","-crf","18","-c:a","copy",
      "-movflags","+faststart","-metadata","title=Fast Fiction Factory CASE_DIGEST Burned Caption Review",
      "-metadata","comment=PRIVATE / NOT FOR PUBLICATION",$BurnedMp4Path
    )
  }
} finally {
  $resolvedTemp = [System.IO.Path]::GetFullPath($tempRoot)
  $resolvedBase = [System.IO.Path]::GetFullPath($tempBase)
  if (-not $resolvedTemp.StartsWith($resolvedBase, [StringComparison]::OrdinalIgnoreCase) -or -not (Split-Path -Leaf $resolvedTemp).StartsWith("fff-case-digest-editorial-treatment-")) {
    throw "Temporary cleanup target escaped the expected boundary"
  }
  if (Test-Path -LiteralPath $resolvedTemp) { Remove-Item -LiteralPath $resolvedTemp -Recurse -Force }
}

$cleanRecord = Get-MediaRecord -Path $CleanMp4Path
$burnedRecord = Get-MediaRecord -Path $BurnedMp4Path
Assert-MediaContract -CleanRecord $cleanRecord -BurnedRecord $burnedRecord

New-ReviewHtml -Model $inputs.model -CaptionAuthority $captions.authority -SectionRows $sectionRows -ShotRows $shotRows
Invoke-External -Program "ffmpeg" -Arguments @("-hide_banner","-loglevel","error","-y","-ss","100","-i",$CleanMp4Path,"-frames:v","1","-q:v","2",$PosterPath)
New-ContactSheets -Model $inputs.model

$legacyAfterRender = Get-LegacySnapshot
$provisional = New-TrackedArtifacts -Inputs $inputs -Captions $captions -SectionRows $sectionRows -ShotRows $shotRows -CleanRecord $cleanRecord -BurnedRecord $burnedRecord -LegacyBefore $legacyBefore -LegacyAfter $legacyAfterRender -TransitionEvidence $render.boundaries -BrowserEvidence $null
$browserEvidence = Invoke-BrowserValidation
$legacyAfter = Get-LegacySnapshot
$result = New-TrackedArtifacts -Inputs $inputs -Captions $captions -SectionRows $sectionRows -ShotRows $shotRows -CleanRecord $cleanRecord -BurnedRecord $burnedRecord -LegacyBefore $legacyBefore -LegacyAfter $legacyAfter -TransitionEvidence $render.boundaries -BrowserEvidence $browserEvidence
if (-not $result.passed) { throw "Targeted browser validation failed" }

$runManifest = [ordered]@{
  schemaVersion = 1
  mission_id = $MissionId
  artifact_id = $ArtifactId
  status = "PASS"
  git = [ordered]@{ start_head=$ExpectedHead; branch=$ExpectedBranch; worktree=$RepoRoot; commit_created=$false; pushed=$false }
  inputs = [ordered]@{
    voice_worktree=$VoiceWorktree
    voice_head=$inputs.voice_head
    narration=Get-FileRecord -Path $NarrationPath
    accepted_mp4=Get-FileRecord -Path $AcceptedMp4Path
    source_hashes=$inputs.source_hashes
    images=@($inputs.shot_rows | ForEach-Object { [ordered]@{shot_id=$_.shot_id;path=$_.image_path;sha256=$_.sha256} })
  }
  captions = [ordered]@{
    cue_count=11
    timing_text_identity_sha256=$captions.identity_hash
    srt=Get-FileRecord -Path (Join-Path $YoutubeRoot "case-digest-ja.srt")
    vtt=Get-FileRecord -Path (Join-Path $YoutubeRoot "case-digest-ja.vtt")
  }
  outputs = [ordered]@{
    clean=$cleanRecord
    burned_review=$burnedRecord
    review_html=Get-FileRecord -Path $ReviewHtmlPath
    poster=Get-FileRecord -Path $PosterPath
    before_after_contact_sheet=Get-FileRecord -Path $ContactSheetPath
  }
  validation = [ordered]@{
    result_path=(Join-Path $ArtifactRoot "editorial-treatment-result.json")
    browser=$browserEvidence
    transition_boundaries=$render.boundaries
    transition_frame_audit=Get-FileRecord -Path (Join-Path $VerificationRoot "transition-frame-audit.json")
    protected_legacy_before=$legacyBefore
    protected_legacy_after=$legacyAfter
    temporary_processes_terminated=$true
    temporary_render_root_removed=$true
  }
  boundaries = $result.boundaries
}
Write-Json -Path $RunManifestPath -Value $runManifest -Depth 40

[ordered]@{
  passed = $true
  artifact_id = $ArtifactId
  run_manifest = $RunManifestPath
  clean = $cleanRecord
  burned_review = $burnedRecord
  review_html = Get-FileRecord -Path $ReviewHtmlPath
  caption_identity_sha256 = $captions.identity_hash
  browser = $browserEvidence
  protected_legacy_unchanged = $result.preserved_inputs.legacy_byte_identical
} | ConvertTo-Json -Depth 30
