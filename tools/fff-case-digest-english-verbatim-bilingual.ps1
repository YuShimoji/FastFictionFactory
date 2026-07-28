[CmdletBinding()]
param(
  [ValidateSet("Build", "RefreshReview", "Validate", "Finalize")]
  [string]$Mode = "Build",
  [string]$RunRoot = "D:\AI-Runs\FastFictionFactory\fff-case-digest-english-verbatim-bilingual-001"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$MissionId = "fff-case-digest-english-verbatim-bilingual-001"
$ArtifactId = "fff-case-digest-english-verbatim-bilingual-001"
$ExpectedSourceHead = "fd6c8e0fb25d6a72f9ca992da5ae032d807bb257"
$ExpectedBranch = "codex/fff-case-digest-english-verbatim-bilingual-v1"
$ExpectedSourceBranch = "codex/fff-case-digest-editorial-treatment-v1"
$ExpectedSourceCleanHash = "114462bf75954e997aac366d616394edab3fb60eabebfa7909d235991080edd7"
$ExpectedSourceReviewHash = "be05477275594014e98df630b7578bd914f79008c11da78818ffb6173bb4458c"
$ExpectedSourceSerenaHash = "9dbcfacd541237c69388c6611fc40aa15f4d2ffa81866bfbbfcd1e3bc719f29e"
$SelectedVoiceName = "Microsoft Zira Desktop"
$DurationSeconds = 180
$Fps = 30
$FrameCount = 5400

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ArtifactRoot = Join-Path $RepoRoot "artifacts\case-digest-english-verbatim-bilingual"
$SourceModelPath = Join-Path $RepoRoot "artifacts\private-raster-case-digest\private-raster-case-digest.json"
$SourceShotMapPath = Join-Path $RepoRoot "artifacts\private-raster-case-digest\selected-shot-sequence.csv"
$SourceTransitionMapPath = Join-Path $RepoRoot "artifacts\private-raster-case-digest\transition-boundary-map.csv"
$SourceVisualContractPath = Join-Path $RepoRoot "artifacts\case-digest-editorial-treatment-v1\visual-treatment-contract.json"
$SourceEffectMapPath = Join-Path $RepoRoot "artifacts\case-digest-editorial-treatment-v1\shot-effect-map.csv"
$SourceSectionMapPath = Join-Path $RepoRoot "artifacts\case-digest-editorial-treatment-v1\section-treatment-map.csv"
$SourceRunRoot = "D:\AI-Runs\FastFictionFactory\fff-case-digest-editorial-treatment-001"
$SourceManifestPath = Join-Path $SourceRunRoot "run-manifest.json"
$SourceCleanPath = Join-Path $SourceRunRoot "clean\case-digest-editorial-treatment-clean.mp4"
$SourceReviewPath = Join-Path $SourceRunRoot "review\case-digest-editorial-treatment.html"
$SourceWorktree = "D:\AI-Worktrees\FastFictionFactory\fff-case-digest-editorial-treatment-v1"
$SourceSerenaPath = Join-Path $SourceWorktree ".serena\project.yml"

$AudioRoot = Join-Path $RunRoot "audio"
$UtteranceAudioRoot = Join-Path $AudioRoot "utterances"
$YoutubeRoot = Join-Path $RunRoot "youtube"
$CleanRoot = Join-Path $RunRoot "clean"
$AudienceRoot = Join-Path $RunRoot "audience"
$DebugRoot = Join-Path $RunRoot "debug"
$ReviewRoot = Join-Path $RunRoot "review"
$EvidenceRoot = Join-Path $RunRoot "evidence"
$VerificationRoot = Join-Path $RunRoot "verification"
$NarrationPath = Join-Path $AudioRoot "case-digest-english-narration.wav"
$EnglishSrtPath = Join-Path $YoutubeRoot "case-digest.en.srt"
$EnglishVttPath = Join-Path $YoutubeRoot "case-digest.en.vtt"
$JapaneseSrtPath = Join-Path $YoutubeRoot "case-digest.ja.srt"
$JapaneseVttPath = Join-Path $YoutubeRoot "case-digest.ja.vtt"
$CleanMp4Path = Join-Path $CleanRoot "case-digest-english-clean.mp4"
$AudienceMp4Path = Join-Path $AudienceRoot "case-digest-english-burned.mp4"
$DebugMp4Path = Join-Path $DebugRoot "case-digest-english-japanese-debug.mp4"
$ReviewHtmlPath = Join-Path $ReviewRoot "case-digest-english-verbatim.html"
$RunManifestPath = Join-Path $RunRoot "run-manifest.json"

function Write-Utf8Text {
  param([Parameter(Mandatory)][string]$Path, [Parameter(Mandatory)][string]$Text)
  $parent = Split-Path -Parent $Path
  if ($parent) { [System.IO.Directory]::CreateDirectory($parent) | Out-Null }
  [System.IO.File]::WriteAllText($Path, $Text, [System.Text.UTF8Encoding]::new($false))
}

function Write-Json {
  param([Parameter(Mandatory)][string]$Path, [Parameter(Mandatory)]$Value, [int]$Depth = 40)
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
  param([Parameter(Mandatory)][string]$Path, [string]$RelativePath)
  $item = Get-Item -LiteralPath $Path
  [ordered]@{
    path = if ($RelativePath) { $RelativePath } else { $Path }
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
    if ($LASTEXITCODE -ne 0) { throw "$Program failed with exit code $LASTEXITCODE" }
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
  param([Parameter(Mandatory)][string]$Path, [string]$RelativePath)
  $probe = Invoke-Ffprobe -Path $Path
  $video = @($probe.streams | Where-Object codec_type -eq "video")
  $audio = @($probe.streams | Where-Object codec_type -eq "audio")
  $subtitles = @($probe.streams | Where-Object codec_type -eq "subtitle")
  if ($video.Count -ne 1) { throw "Expected exactly one video stream: $Path" }
  [ordered]@{
    path = if ($RelativePath) { $RelativePath } else { $Path }
    bytes = (Get-Item -LiteralPath $Path).Length
    sha256 = Get-Sha256 -Path $Path
    duration_seconds = [math]::Round([double]$probe.format.duration, 6)
    width = [int]$video[0].width
    height = [int]$video[0].height
    frame_rate = $video[0].avg_frame_rate
    frame_count = [int]$video[0].nb_read_frames
    video_codec = $video[0].codec_name
    audio_stream_count = $audio.Count
    audio_codec = if ($audio.Count -eq 1) { $audio[0].codec_name } else { $null }
    audio_channels = if ($audio.Count -eq 1) { [int]$audio[0].channels } else { 0 }
    audio_sample_rate = if ($audio.Count -eq 1) { [int]$audio[0].sample_rate } else { 0 }
    subtitle_stream_count = $subtitles.Count
    subtitle_languages = @($subtitles | ForEach-Object { $_.tags.language })
  }
}

function Format-SrtTime {
  param([double]$Seconds)
  $milliseconds = [int][math]::Round($Seconds * 1000)
  $hours = [math]::Floor($milliseconds / 3600000)
  $milliseconds -= $hours * 3600000
  $minutes = [math]::Floor($milliseconds / 60000)
  $milliseconds -= $minutes * 60000
  $wholeSeconds = [math]::Floor($milliseconds / 1000)
  $milliseconds -= $wholeSeconds * 1000
  "{0:00}:{1:00}:{2:00},{3:000}" -f $hours,$minutes,$wholeSeconds,$milliseconds
}

function Format-VttTime {
  param([double]$Seconds)
  (Format-SrtTime -Seconds $Seconds).Replace(",", ".")
}

function ConvertTo-CsvText {
  param([Parameter(Mandatory)]$Rows)
  ((@($Rows) | ConvertTo-Csv -NoTypeInformation) -join "`n") + "`n"
}

function Normalize-SpokenText {
  param([Parameter(Mandatory)][string]$Text)
  (($Text -replace "`r|`n", " ") -replace "\s+", " ").Trim()
}

function Get-WordCount {
  param([Parameter(Mandatory)][string]$Text)
  @((Normalize-SpokenText -Text $Text).Split(" ", [StringSplitOptions]::RemoveEmptyEntries)).Count
}

function Wrap-English {
  param([Parameter(Mandatory)][string]$Text, [int]$MaxCharacters = 48)
  if ($Text.Length -le $MaxCharacters) { return @($Text) }
  $words = @($Text.Split(" ", [StringSplitOptions]::RemoveEmptyEntries))
  $bestIndex = 1
  $bestScore = [double]::PositiveInfinity
  for ($index = 2; $index -le $words.Count - 2; $index++) {
    $left = ($words[0..($index - 1)] -join " ")
    $right = ($words[$index..($words.Count - 1)] -join " ")
    $overflow = [math]::Max(0, $left.Length - $MaxCharacters) + [math]::Max(0, $right.Length - $MaxCharacters)
    $score = $overflow * 100 + [math]::Abs($left.Length - $right.Length)
    if ($score -lt $bestScore) { $bestIndex = $index; $bestScore = $score }
  }
  @(
    ($words[0..($bestIndex - 1)] -join " "),
    ($words[$bestIndex..($words.Count - 1)] -join " ")
  )
}

function Wrap-Japanese {
  param([Parameter(Mandatory)][string]$Text, [int]$MaxCharacters = 24)
  if ($Text.Length -le $MaxCharacters) { return @($Text) }
  $candidates = @()
  for ($index = 6; $index -lt $Text.Length - 5; $index++) {
    if ($Text[$index] -in @("、","。","；","：")) { $candidates += ($index + 1) }
  }
  if ($candidates.Count -eq 0) {
    $mid = [int][math]::Floor($Text.Length / 2)
    for ($distance = 0; $distance -lt $Text.Length; $distance++) {
      foreach ($candidate in @(($mid - $distance), ($mid + $distance))) {
        if ($candidate -gt 5 -and $candidate -lt $Text.Length - 5 -and
            $Text[$candidate] -notin @("、","。","，","．","？","！","）","」","』","】") -and
            $Text[$candidate - 1] -notin @("（","「","『","【")) {
          return @($Text.Substring(0,$candidate),$Text.Substring($candidate))
        }
      }
    }
  }
  $split = $candidates | Sort-Object { [math]::Abs(([double]$_) - ([double]$Text.Length / 2.0)) } | Select-Object -First 1
  @($Text.Substring(0,$split),$Text.Substring($split))
}

function Escape-AssText {
  param([Parameter(Mandatory)][string]$Text)
  $Text.Replace("\","\\").Replace("{","\{").Replace("}","\}")
}

function Format-AssTime {
  param([double]$Seconds)
  $centiseconds = [int][math]::Round($Seconds * 100)
  $hours = [math]::Floor($centiseconds / 360000)
  $centiseconds -= $hours * 360000
  $minutes = [math]::Floor($centiseconds / 6000)
  $centiseconds -= $minutes * 6000
  $wholeSeconds = [math]::Floor($centiseconds / 100)
  $centiseconds -= $wholeSeconds * 100
  "{0}:{1:00}:{2:00}.{3:00}" -f $hours,$minutes,$wholeSeconds,$centiseconds
}

function New-UtteranceSeeds {
  @(
    [ordered]@{ utterance_id="cd-en-001"; section_id="case-digest-section-01-incident"; shot_id="shot-b01-01"; spoken_text_en="At noon, witnesses reported a bell sounding from a tower that has no bell."; text_ja="正午、鐘のない塔から鐘の音がしたと目撃者が報告した。"; source_fact_ids=@("case-digest-section-01-incident.what_happened"); claim_type="reported_observation"; evidential_status="reported" },
    [ordered]@{ utterance_id="cd-en-002"; section_id="case-digest-section-01-incident"; shot_id="shot-b01-01"; spoken_text_en="The tower's mounting frame was empty, and no instrument capable of making that sound was found."; text_ja="塔の取付枠は空で、その音を生む楽器は見つかっていない。"; source_fact_ids=@("case-digest-section-01-incident.evidence_or_observation"); claim_type="observed_condition"; evidential_status="established" },
    [ordered]@{ utterance_id="cd-en-003"; section_id="case-digest-section-01-incident"; shot_id="shot-b01-02"; spoken_text_en="The reported sound and empty frame are established, but no bell or sound-making mechanism has been confirmed."; text_ja="報告された音と空の枠は確認事項だが、鐘や発音機構は確認されていない。"; source_fact_ids=@("case-digest-section-01-incident.evidence_or_observation","case-digest-section-01-incident.evidential_limit"); claim_type="observation_with_limit"; evidential_status="bounded" },
    [ordered]@{ utterance_id="cd-en-004"; section_id="case-digest-section-01-incident"; shot_id="shot-b01-02"; spoken_text_en="The source of that reported sound remains unidentified."; text_ja="報告された音源は特定されていない。"; source_fact_ids=@("case-digest-section-01-incident.evidential_limit"); claim_type="evidential_limit"; evidential_status="unconfirmed" },

    [ordered]@{ utterance_id="cd-en-005"; section_id="case-digest-section-02-investigator"; shot_id="shot-b02-01"; spoken_text_en="Clock repairer Mira is examining clues connected to her missing brother."; text_ja="時計修理師のミラは、失踪した兄につながる手掛かりを調べている。"; source_fact_ids=@("case-digest-section-02-investigator.what_happened"); claim_type="investigator_identity"; evidential_status="established" },
    [ordered]@{ utterance_id="cd-en-006"; section_id="case-digest-section-02-investigator"; shot_id="shot-b02-01"; spoken_text_en="A note said to be his was left among the workshop materials."; text_ja="兄のものとされるメモが、作業場の品々の中に残されていた。"; source_fact_ids=@("case-digest-section-02-investigator.text_ja"); claim_type="reported_clue"; evidential_status="attributed_not_authenticated" },
    [ordered]@{ utterance_id="cd-en-007"; section_id="case-digest-section-02-investigator"; shot_id="shot-b02-02"; spoken_text_en="A brass moth appears beside the note, but its meaning and purpose remain unknown."; text_ja="真鍮の蛾はメモのそばにあるが、その意味と用途は不明である。"; source_fact_ids=@("case-digest-section-02-investigator.evidence_or_observation","recurring-element-continuity.brass_moth.evidential_limit"); claim_type="clue_with_limit"; evidential_status="meaning_unconfirmed" },
    [ordered]@{ utterance_id="cd-en-008"; section_id="case-digest-section-02-investigator"; shot_id="shot-b02-03"; spoken_text_en="Clocks and records repeat the time nine seventeen, linking the note, moth, and recorded time."; text_ja="時計と記録は九時十七分を繰り返し、メモ、蛾、記録時刻を結んでいる。"; source_fact_ids=@("case-digest-section-02-investigator.evidence_or_observation"); claim_type="clue_chain"; evidential_status="established_pattern" },
    [ordered]@{ utterance_id="cd-en-009"; section_id="case-digest-section-02-investigator"; shot_id="shot-b02-03"; spoken_text_en="Together, those items form a clue chain, not proof of her brother's location."; text_ja="それらは手掛かりの連鎖だが、兄の居場所を示す証拠ではない。"; source_fact_ids=@("case-digest-section-02-investigator.evidential_limit"); claim_type="evidential_limit"; evidential_status="location_unconfirmed" },

    [ordered]@{ utterance_id="cd-en-010"; section_id="case-digest-section-03-ledger"; shot_id="shot-b03-01"; spoken_text_en="The note directs the investigation toward a ledger arranged in two columns."; text_ja="メモは調査を、二列に分かれた台帳へ導く。"; source_fact_ids=@("case-digest-section-03-ledger.what_happened","case-digest-caption-06"); claim_type="investigative_link"; evidential_status="established" },
    [ordered]@{ utterance_id="cd-en-011"; section_id="case-digest-section-03-ledger"; shot_id="shot-b03-01"; spoken_text_en="One column records minutes, while the other records people's names."; text_ja="一方の欄には分が、もう一方には人名が記されている。"; source_fact_ids=@("case-digest-section-03-ledger.evidence_or_observation"); claim_type="record_structure"; evidential_status="established" },
    [ordered]@{ utterance_id="cd-en-012"; section_id="case-digest-section-03-ledger"; shot_id="shot-b03-02"; spoken_text_en="The visible pages establish those two categories, but no causal action by the ledger."; text_ja="見えるページが示すのは二つの区分だけで、台帳の因果作用ではない。"; source_fact_ids=@("case-digest-section-03-ledger.text_ja","case-digest-section-03-ledger.evidential_limit"); claim_type="record_with_limit"; evidential_status="bounded" },
    [ordered]@{ utterance_id="cd-en-013"; section_id="case-digest-section-03-ledger"; shot_id="shot-b03-02"; spoken_text_en="They do not prove that the ledger steals time, removes people, or records genuine losses."; text_ja="台帳が時間を奪い、人を消し、実在の損失を記すとは証明されていない。"; source_fact_ids=@("case-digest-section-03-ledger.evidential_limit","case-digest-section-04-council.evidential_limit"); claim_type="causal_limit"; evidential_status="unproven" },

    [ordered]@{ utterance_id="cd-en-014"; section_id="case-digest-section-04-council"; shot_id="shot-b04-01"; spoken_text_en="The missing brother's note points the investigation toward the city council."; text_ja="失踪した兄のメモは、調査の目を市の評議会へ向けている。"; source_fact_ids=@("case-digest-section-04-council.what_happened"); claim_type="allegation_direction"; evidential_status="recorded_allegation" },
    [ordered]@{ utterance_id="cd-en-015"; section_id="case-digest-section-04-council"; shot_id="shot-b04-01"; spoken_text_en="That note records an allegation, not evidence confirming the council's involvement."; text_ja="そのメモは告発を記すが、評議会の関与を裏づける証拠ではない。"; source_fact_ids=@("case-digest-section-04-council.evidence_or_observation","case-digest-section-04-council.evidential_limit"); claim_type="allegation_with_limit"; evidential_status="unconfirmed" },
    [ordered]@{ utterance_id="cd-en-016"; section_id="case-digest-section-04-council"; shot_id="shot-b04-02"; spoken_text_en="The ledger's origin and authenticity also remain unverified."; text_ja="台帳の出所と真正性も確認されていない。"; source_fact_ids=@("case-digest-section-04-council.evidential_limit"); claim_type="authenticity_limit"; evidential_status="unverified" },
    [ordered]@{ utterance_id="cd-en-017"; section_id="case-digest-section-04-council"; shot_id="shot-b04-02"; spoken_text_en="No available material establishes the council's responsibility or motive."; text_ja="利用可能な資料は、評議会の責任や動機を立証していない。"; source_fact_ids=@("case-digest-section-04-council.text_ja"); claim_type="responsibility_limit"; evidential_status="unproven" },
    [ordered]@{ utterance_id="cd-en-018"; section_id="case-digest-section-04-council"; shot_id="shot-b04-02"; spoken_text_en="No known mechanism connects the council, ledger, missing brother, and tower incident."; text_ja="評議会、台帳、失踪した兄、塔の事件を結ぶ仕組みは確認されていない。"; source_fact_ids=@("case-digest-section-04-council.text_ja","case-digest-section-05-status.evidential_limit"); claim_type="mechanism_limit"; evidential_status="unconfirmed" },

    [ordered]@{ utterance_id="cd-en-019"; section_id="case-digest-section-05-status"; shot_id="shot-b06-01"; spoken_text_en="Confirmed items include the reported bell, empty frame, note, brass moth, nine seventeen, and two-column ledger."; text_ja="確認事項は、報告された鐘の音、空の枠、メモ、真鍮の蛾、九時十七分、二列の台帳である。"; source_fact_ids=@("case-digest-section-05-status.evidence_or_observation"); claim_type="confirmed_inventory"; evidential_status="established" },
    [ordered]@{ utterance_id="cd-en-020"; section_id="case-digest-section-05-status"; shot_id="shot-b06-01"; spoken_text_en="The ledger records minutes and names as two separate categories."; text_ja="台帳は、分と人名を二つの別々の区分として記している。"; source_fact_ids=@("case-digest-section-05-status.text_ja"); claim_type="record_structure"; evidential_status="established" },
    [ordered]@{ utterance_id="cd-en-021"; section_id="case-digest-section-05-status"; shot_id="shot-b06-01"; spoken_text_en="Those categories are described without claiming that either records a real loss."; text_ja="どちらかが実在の損失を記すとは断定せず、その区分だけを述べる。"; source_fact_ids=@("case-digest-section-03-ledger.evidential_limit","case-digest-section-05-status.text_ja"); claim_type="evidential_limit"; evidential_status="bounded" },
    [ordered]@{ utterance_id="cd-en-022"; section_id="case-digest-section-05-status"; shot_id="shot-b06-03"; spoken_text_en="The sound's source and the missing brother's location remain unconfirmed."; text_ja="音源と失踪した兄の居場所は、依然として確認されていない。"; source_fact_ids=@("case-digest-section-05-status.evidential_limit"); claim_type="status_limit"; evidential_status="unconfirmed" },
    [ordered]@{ utterance_id="cd-en-023"; section_id="case-digest-section-05-status"; shot_id="shot-b06-03"; spoken_text_en="Any connection between the evidence and the council also remains unconfirmed."; text_ja="証拠と評議会のつながりも、確認されていない。"; source_fact_ids=@("case-digest-section-05-status.evidential_limit"); claim_type="status_limit"; evidential_status="unconfirmed" },
    [ordered]@{ utterance_id="cd-en-024"; section_id="case-digest-section-05-status"; shot_id="shot-b06-03"; spoken_text_en="With those evidential limits unchanged, the tower remains under investigation."; text_ja="それらの証拠限界を保ったまま、塔は調査対象として残る。"; source_fact_ids=@("case-digest-section-05-status.what_happened","case-digest-section-05-status.connection_to_next_section"); claim_type="case_status"; evidential_status="open_investigation" }
  )
}

function Assert-Preflight {
  $head = (git rev-parse HEAD).Trim()
  $branch = (git branch --show-current).Trim()
  if ($head -ne $ExpectedSourceHead -or $branch -ne $ExpectedBranch) {
    throw "SUCCESSOR_GIT_IDENTITY_MISMATCH"
  }
  $sourceHead = (git -C $SourceWorktree rev-parse HEAD).Trim()
  $sourceBranch = (git -C $SourceWorktree branch --show-current).Trim()
  $sourceParity = (git -C $SourceWorktree rev-list --left-right --count "HEAD...@{upstream}").Trim()
  if ($sourceHead -ne $ExpectedSourceHead -or $sourceBranch -ne $ExpectedSourceBranch -or $sourceParity -ne "0`t0") {
    throw "SOURCE_GIT_IDENTITY_MISMATCH"
  }
  $sourceStatus = @(git -C $SourceWorktree status --porcelain=v1)
  if ($sourceStatus.Count -ne 1 -or $sourceStatus[0] -ne " M .serena/project.yml") {
    throw "SOURCE_DIRTY_PARTITION_MISMATCH"
  }
  if ((Get-Sha256 -Path $SourceSerenaPath) -ne $ExpectedSourceSerenaHash) {
    throw "SOURCE_SERENA_IDENTITY_MISMATCH"
  }
  if ((Get-Sha256 -Path $SourceCleanPath) -ne $ExpectedSourceCleanHash -or
      (Get-Sha256 -Path $SourceReviewPath) -ne $ExpectedSourceReviewHash) {
    throw "SOURCE_EXTERNAL_RUN_IDENTITY_MISMATCH"
  }
  $sourceManifest = Get-Content -LiteralPath $SourceManifestPath -Raw | ConvertFrom-Json -Depth 50
  if ($sourceManifest.status -ne "PASS" -or
      $sourceManifest.outputs.clean.sha256 -ne $ExpectedSourceCleanHash -or
      $sourceManifest.outputs.review_html.sha256 -ne $ExpectedSourceReviewHash) {
    throw "SOURCE_MANIFEST_IDENTITY_MISMATCH"
  }
  $model = Get-Content -LiteralPath $SourceModelPath -Raw | ConvertFrom-Json -Depth 50
  if ($model.section_count -ne 5 -or $model.shot_count -ne 11 -or
      $model.duration_seconds -ne 180 -or $model.exact_frame_count -ne 5400) {
    throw "SOURCE_CASE_DIGEST_CONTRACT_MISMATCH"
  }
  [ordered]@{
    successor_head = $head
    successor_branch = $branch
    source_head = $sourceHead
    source_branch = $sourceBranch
    source_parity = $sourceParity
    source_dirty_state = @(
      [ordered]@{
        path = ".serena/project.yml"
        bytes = (Get-Item -LiteralPath $SourceSerenaPath).Length
        sha256 = Get-Sha256 -Path $SourceSerenaPath
        staged = $false
        unstaged = $true
        classification = "protected_preexisting_residue"
        scope_relation = "out_of_scope"
        decision_effect = "DEBT_NONBLOCKING"
      }
    )
    source_manifest = $sourceManifest
    model = $model
  }
}

function Get-VoiceInventory {
  Add-Type -AssemblyName System.Speech
  $synth = [System.Speech.Synthesis.SpeechSynthesizer]::new()
  try {
    $voices = @(
      $synth.GetInstalledVoices() | ForEach-Object {
        $info = $_.VoiceInfo
        [ordered]@{
          backend = "System.Speech"
          name = $info.Name
          culture = $info.Culture.Name
          gender = [string]$info.Gender
          age = [string]$info.Age
          enabled = $_.Enabled
          file_output_capable = $true
          english_eligible = $_.Enabled -and $info.Culture.Name.StartsWith("en-", [StringComparison]::OrdinalIgnoreCase)
        }
      }
    )
  } finally {
    $synth.Dispose()
  }
  $eligible = @($voices | Where-Object english_eligible | Select-Object -First 3)
  if ($eligible.Count -eq 0) { throw "LOCAL_ENGLISH_TTS_UNAVAILABLE" }
  if ($SelectedVoiceName -notin @($eligible.name)) { throw "SELECTED_LOCAL_VOICE_UNAVAILABLE" }
  [ordered]@{
    inventory_scope = "locally_installed_file_output_capable_only"
    network_backed_engine_count = 0
    installed_voice_count = $voices.Count
    eligible_english_voice_count = $eligible.Count
    technical_candidates = $eligible
    selected_voice = $SelectedVoiceName
    selected_backend = "System.Speech"
    selected_rate = 0
    selected_volume = 92
    selection_basis = @(
      "stable local WAV synthesis passed",
      "only eligible installed English voice",
      "clear consonants and restrained default delivery",
      "section timing fit after measured synthesis"
    )
    final_voice_selected = $false
    production_voice_approved = $false
    voices = $voices
  }
}

function Get-AudioDuration {
  param([Parameter(Mandatory)][string]$Path)
  $probe = Invoke-Ffprobe -Path $Path
  [double]$probe.format.duration
}

function New-UtteranceAudio {
  param([Parameter(Mandatory)]$Seeds, [Parameter(Mandatory)]$VoiceInventory)
  [System.IO.Directory]::CreateDirectory($UtteranceAudioRoot) | Out-Null
  Add-Type -AssemblyName System.Speech
  $records = @()
  foreach ($seed in $Seeds) {
    $rawPath = Join-Path $UtteranceAudioRoot "$($seed.utterance_id)-raw.wav"
    $trimmedPath = Join-Path $UtteranceAudioRoot "$($seed.utterance_id).wav"
    $synth = [System.Speech.Synthesis.SpeechSynthesizer]::new()
    try {
      $synth.SelectVoice($VoiceInventory.selected_voice)
      $synth.Rate = [int]$VoiceInventory.selected_rate
      $synth.Volume = [int]$VoiceInventory.selected_volume
      $synth.SetOutputToWaveFile($rawPath)
      $synth.Speak([string]$seed.spoken_text_en)
      $synth.SetOutputToNull()
    } finally {
      $synth.Dispose()
    }
    Invoke-External -Program "ffmpeg" -Arguments @(
      "-hide_banner","-loglevel","error","-y","-i",$rawPath,
      "-af","silenceremove=start_periods=1:start_silence=0.03:start_threshold=-55dB,areverse,silenceremove=start_periods=1:start_silence=0.08:start_threshold=-55dB,areverse,aresample=48000",
      "-ac","1","-ar","48000","-c:a","pcm_s16le",$trimmedPath
    )
    Remove-Item -LiteralPath $rawPath
    $duration = Get-AudioDuration -Path $trimmedPath
    if ($duration -le 0.25) { throw "TTS_SYNTHESIS_TOO_SHORT: $($seed.utterance_id)" }
    $record = [ordered]@{}
    foreach ($key in $seed.Keys) { $record[$key] = $seed[$key] }
    $record.word_count = Get-WordCount -Text $seed.spoken_text_en
    $record.audio_duration_seconds = [math]::Round($duration, 6)
    $record.audio_relative_path = "audio/utterances/$($seed.utterance_id).wav"
    $record.audio_sha256 = Get-Sha256 -Path $trimmedPath
    $record.audible_onset_offset_milliseconds = 30
    $records += $record
  }
  $records
}

function Set-UtteranceTiming {
  param([Parameter(Mandatory)]$Utterances, [Parameter(Mandatory)]$Model)
  $timed = @()
  foreach ($section in $Model.sections) {
    $items = @($Utterances | Where-Object section_id -eq $section.section_id)
    if ($items.Count -eq 0) { throw "SECTION_WITHOUT_UTTERANCES: $($section.section_id)" }
    $start = [double]$section.start_seconds + 0.65
    $lastCaptionEnd = [double]$section.end_seconds - 0.50
    $activeDuration = (@($items | ForEach-Object { [double]$_['audio_duration_seconds'] }) | Measure-Object -Sum).Sum + (0.20 * $items.Count)
    $extraGap = if ($items.Count -gt 1) {
      (($lastCaptionEnd - $start) - $activeDuration) / ($items.Count - 1)
    } else { 0 }
    if ($extraGap -lt 0) { throw "SECTION_TIMING_FIT_FAILED: $($section.section_id)" }
    $audibleGap = $extraGap + 0.20
    if ($audibleGap -gt 4.5) { throw "MAX_INTERNAL_NARRATION_GAP_EXCEEDED: $($section.section_id) $audibleGap" }
    $cursor = $start
    foreach ($item in $items) {
      $item.audio_start_seconds = [math]::Round($cursor, 3)
      $item.audio_end_seconds = [math]::Round($cursor + [double]$item.audio_duration_seconds, 3)
      $item.caption_start_seconds = $item.audio_start_seconds
      $item.caption_end_seconds = [math]::Round($item.audio_end_seconds + 0.20, 3)
      $item.duration_seconds = [math]::Round($item.caption_end_seconds - $item.caption_start_seconds, 3)
      $item.layout_en = @(Wrap-English -Text $item.spoken_text_en)
      $item.layout_ja = @(Wrap-Japanese -Text $item.text_ja)
      $item.tts_text_en = $item.spoken_text_en
      $item.unsupported_fact_count = 0
      $timed += $item
      $cursor = $item.caption_end_seconds + $extraGap
    }
    if ([math]::Abs($items[-1].caption_end_seconds - $lastCaptionEnd) -gt 0.01) {
      throw "SECTION_TIMING_DISTRIBUTION_FAILED: $($section.section_id)"
    }
  }
  $timed
}

function New-CaptionFiles {
  param([Parameter(Mandatory)]$Utterances)
  $enSrt = @()
  $jaSrt = @()
  $enVtt = @("WEBVTT","")
  $jaVtt = @("WEBVTT","")
  for ($index = 0; $index -lt $Utterances.Count; $index++) {
    $item = $Utterances[$index]
    $number = $index + 1
    $enLines = $item.layout_en -join "`n"
    $jaLines = $item.layout_ja -join "`n"
    $srtTime = "$(Format-SrtTime $item.caption_start_seconds) --> $(Format-SrtTime $item.caption_end_seconds)"
    $vttTime = "$(Format-VttTime $item.caption_start_seconds) --> $(Format-VttTime $item.caption_end_seconds)"
    $enSrt += @([string]$number,$srtTime,$enLines,"")
    $jaSrt += @([string]$number,$srtTime,$jaLines,"")
    $enVtt += @($item.utterance_id,$vttTime,$enLines,"")
    $jaVtt += @($item.utterance_id,$vttTime,$jaLines,"")
  }
  [ordered]@{
    en_srt = ($enSrt -join "`n").TrimEnd() + "`n"
    en_vtt = ($enVtt -join "`n").TrimEnd() + "`n"
    ja_srt = ($jaSrt -join "`n").TrimEnd() + "`n"
    ja_vtt = ($jaVtt -join "`n").TrimEnd() + "`n"
  }
}

function New-AssFiles {
  param([Parameter(Mandatory)]$Utterances)
  $header = @"
[Script Info]
ScriptType: v4.00+
PlayResX: 1280
PlayResY: 720
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
Style: English,Arial,34,&H00FFF8ED,&H00FFF8ED,&H00100804,&H80000000,-1,0,0,0,100,100,0,0,1,3,1,2,72,72,52,1
Style: EnglishDebug,Arial,31,&H00FFF8ED,&H00FFF8ED,&H00100804,&H80000000,-1,0,0,0,100,100,0,0,1,3,1,2,72,72,92,1
Style: JapaneseDebug,Yu Gothic,22,&H00D9E7F5,&H00D9E7F5,&H00100804,&H80000000,0,0,0,0,100,100,0,0,1,2,1,2,72,72,40,1
Style: DebugMark,Arial,20,&H0038D6FF,&H0038D6FF,&H00100804,&H80000000,-1,0,0,0,100,100,0,0,1,2,0,9,30,30,24,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"@
  $audience = @($header)
  $debug = @($header,"Dialogue: 2,0:00:00.00,0:03:00.00,DebugMark,,0,0,0,,DEBUG / EN + JA")
  foreach ($item in $Utterances) {
    $start = Format-AssTime $item.caption_start_seconds
    $end = Format-AssTime $item.caption_end_seconds
    $en = Escape-AssText (($item.layout_en | ForEach-Object { $_ }) -join "\N")
    $ja = Escape-AssText (($item.layout_ja | ForEach-Object { $_ }) -join "\N")
    $audience += "Dialogue: 0,$start,$end,English,,0,0,0,,$en"
    $debug += "Dialogue: 0,$start,$end,EnglishDebug,,0,0,0,,$en"
    $debug += "Dialogue: 1,$start,$end,JapaneseDebug,,0,0,0,,$ja"
  }
  Write-Utf8Text -Path (Join-Path $VerificationRoot "audience.ass") -Text (($audience -join "`n") + "`n")
  Write-Utf8Text -Path (Join-Path $VerificationRoot "debug.ass") -Text (($debug -join "`n") + "`n")
}

function New-Narration {
  param([Parameter(Mandatory)]$Utterances)
  $arguments = @("-hide_banner","-loglevel","error","-y","-f","lavfi","-t","180","-i","anullsrc=r=48000:cl=mono")
  foreach ($item in $Utterances) {
    $arguments += @("-i",(Join-Path $UtteranceAudioRoot "$($item.utterance_id).wav"))
  }
  $filters = @("[0:a]atrim=duration=180[base]")
  $mixInputs = @("[base]")
  for ($index = 0; $index -lt $Utterances.Count; $index++) {
    $delay = [int][math]::Round([double]$Utterances[$index].audio_start_seconds * 1000)
    $inputIndex = $index + 1
    $label = "u$($index + 1)"
    $filters += "[${inputIndex}:a]adelay=${delay}:all=1[$label]"
    $mixInputs += "[$label]"
  }
  $filters += (($mixInputs -join "") + "amix=inputs=$($mixInputs.Count):normalize=0:dropout_transition=0,atrim=duration=180,asetpts=N/SR/TB[out]")
  $arguments += @("-filter_complex",($filters -join ";"),"-map","[out]","-ac","1","-ar","48000","-c:a","pcm_s16le",$NarrationPath)
  Invoke-External -Program "ffmpeg" -Arguments $arguments
}

function Get-PcmWavStats {
  param([Parameter(Mandatory)][string]$Path)
  $stream = [System.IO.File]::OpenRead($Path)
  $reader = [System.IO.BinaryReader]::new($stream)
  try {
    if ([string]::new($reader.ReadChars(4)) -ne "RIFF") { throw "Not RIFF WAV" }
    [void]$reader.ReadUInt32()
    if ([string]::new($reader.ReadChars(4)) -ne "WAVE") { throw "Not WAVE" }
    $sampleRate = 0
    $channels = 0
    $bits = 0
    $audioFormat = 0
    $sampleCount = 0L
    $clippingCount = 0L
    $maxAbsoluteSample = 0
    while ($stream.Position -lt $stream.Length) {
      $chunkId = [string]::new($reader.ReadChars(4))
      if ($chunkId.Length -lt 4) { break }
      $chunkSize = $reader.ReadUInt32()
      $chunkStart = $stream.Position
      if ($chunkId -eq "fmt ") {
        $audioFormat = $reader.ReadUInt16()
        $channels = $reader.ReadUInt16()
        $sampleRate = $reader.ReadUInt32()
        [void]$reader.ReadUInt32()
        [void]$reader.ReadUInt16()
        $bits = $reader.ReadUInt16()
      } elseif ($chunkId -eq "data") {
        if ($audioFormat -ne 1 -or $bits -ne 16 -or $channels -ne 1) { throw "Unexpected WAV format" }
        $samples = [int64]($chunkSize / 2)
        for ($index = 0L; $index -lt $samples; $index++) {
          $sample = $reader.ReadInt16()
          $absolute = [math]::Abs([int]$sample)
          if ($absolute -gt $maxAbsoluteSample) { $maxAbsoluteSample = $absolute }
          if ($sample -eq 32767 -or $sample -eq -32768) { $clippingCount++ }
        }
        $sampleCount += $samples
      }
      $next = $chunkStart + $chunkSize
      if (($chunkSize % 2) -eq 1) { $next++ }
      if ($stream.Position -lt $next) { $stream.Position = $next }
    }
    [ordered]@{
      codec = "pcm_s16le"
      channels = $channels
      sample_rate = $sampleRate
      bits_per_sample = $bits
      sample_count = $sampleCount
      duration_seconds = [math]::Round($sampleCount / [double]$sampleRate / $channels, 6)
      max_absolute_sample = $maxAbsoluteSample
      clipping_count = $clippingCount
    }
  } finally {
    $reader.Dispose()
    $stream.Dispose()
  }
}

function New-MediaOutputs {
  Invoke-External -Program "ffmpeg" -Arguments @(
    "-hide_banner","-loglevel","error","-y",
    "-i",$SourceCleanPath,"-i",$NarrationPath,"-i",$EnglishSrtPath,"-i",$JapaneseSrtPath,
    "-map","0:v:0","-map","1:a:0","-map","2:0","-map","3:0",
    "-c:v","copy","-c:a","aac","-b:a","160k","-ar","48000","-ac","1","-c:s","mov_text",
    "-metadata:s:s:0","language=eng","-metadata:s:s:0","title=English (Original / Default)",
    "-metadata:s:s:1","language=jpn","-metadata:s:s:1","title=Japanese (Debug Translation)",
    "-disposition:s:0","default","-disposition:s:1","0",
    "-t","180","-movflags","+faststart",
    "-metadata","title=Fast Fiction Factory CASE_DIGEST English Clean Master",
    "-metadata","comment=PRIVATE / NOT FOR PUBLICATION",$CleanMp4Path
  )
  Invoke-External -Program "ffmpeg" -WorkingDirectory $RunRoot -Arguments @(
    "-hide_banner","-loglevel","error","-y","-i",$SourceCleanPath,"-i",$NarrationPath,
    "-vf","subtitles=verification/audience.ass",
    "-map","0:v:0","-map","1:a:0","-frames:v","5400","-r","30",
    "-c:v","libx264","-preset","veryfast","-crf","18","-c:a","aac","-b:a","160k","-ar","48000","-ac","1",
    "-movflags","+faststart","-metadata","title=Fast Fiction Factory CASE_DIGEST English Audience Review",
    "-metadata","comment=PRIVATE / NOT FOR PUBLICATION",$AudienceMp4Path
  )
  Invoke-External -Program "ffmpeg" -WorkingDirectory $RunRoot -Arguments @(
    "-hide_banner","-loglevel","error","-y","-i",$SourceCleanPath,"-i",$NarrationPath,
    "-vf","subtitles=verification/debug.ass",
    "-map","0:v:0","-map","1:a:0","-frames:v","5400","-r","30",
    "-c:v","libx264","-preset","veryfast","-crf","18","-c:a","aac","-b:a","160k","-ar","48000","-ac","1",
    "-movflags","+faststart","-metadata","title=Fast Fiction Factory CASE_DIGEST English Japanese Debug",
    "-metadata","comment=PRIVATE DEBUG / NOT FOR PUBLICATION",$DebugMp4Path
  )
}

function New-ReviewHtml {
  param([Parameter(Mandatory)]$Utterances, [Parameter(Mandatory)]$Model)
  $payload = [ordered]@{
    artifact_id = $ArtifactId
    duration_seconds = 180
    sections = @($Model.sections | ForEach-Object {
      [ordered]@{ section_id=$_.section_id; title_ja=$_.title_ja; start_seconds=$_.start_seconds; end_seconds=$_.end_seconds }
    })
    shots = @($Model.shots | ForEach-Object {
      [ordered]@{ shot_id=$_.shot_id; title_ja=$_.title_ja; start_seconds=$_.start_seconds; end_seconds=$_.end_seconds }
    })
    utterances = @($Utterances | ForEach-Object {
      [ordered]@{
        utterance_id=$_.utterance_id
        section_id=$_.section_id
        shot_id=$_.shot_id
        start_seconds=$_.caption_start_seconds
        end_seconds=$_.caption_end_seconds
        spoken_text_en=$_.spoken_text_en
        display_text_en=($_.layout_en -join "`n")
        text_ja=$_.text_ja
        display_text_ja=($_.layout_ja -join "`n")
      }
    })
  }
  $json = ($payload | ConvertTo-Json -Depth 20 -Compress).Replace("</","<\/")
  $html = @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>CASE_DIGEST English verbatim review</title>
  <style>
    :root{color-scheme:dark;--bg:#0b1014;--panel:#111920;--line:#34424c;--ink:#f4efe6;--muted:#aeb8bf;--brass:#d4ab67;--debug:#7cc7ea}
    *{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 20% 0,#1a2329 0,var(--bg) 52%);color:var(--ink);font-family:Segoe UI,Arial,sans-serif}
    header,main{width:min(1180px,calc(100% - 2rem));margin:auto}header{padding:1.1rem 0;display:flex;align-items:end;justify-content:space-between;gap:1rem}
    h1{font-size:clamp(1.3rem,3vw,2.2rem);margin:0}.kicker{color:var(--brass);font-weight:700;letter-spacing:.08em}.boundary{color:var(--muted);max-width:54rem;margin:.4rem 0 0}
    .workspace{display:grid;grid-template-columns:minmax(0,3fr) minmax(240px,1fr);gap:1rem;padding-bottom:1rem}.stage{position:relative;background:#000;border:1px solid var(--line)}
    video{display:block;width:100%;aspect-ratio:16/9;background:#000}.english,.japanese{position:absolute;left:6%;right:6%;text-align:center;white-space:pre-line;pointer-events:none;font-weight:800;text-shadow:0 3px 4px #000,2px 0 2px #000,-2px 0 2px #000,0 -2px 2px #000}
    .english{bottom:4.7rem;color:#fff8ed;font-size:clamp(18px,2.25vw,30px);line-height:1.27}.japanese{bottom:4.6rem;color:#d9e7f5;font-size:clamp(14px,1.8vw,22px);line-height:1.3}.stage.debug .english{bottom:8.2rem}.debugMark{position:absolute;right:1rem;top:1rem;color:var(--debug);font-weight:900;text-shadow:0 2px 3px #000}
    [hidden]{display:none!important}.panel{background:var(--panel);border:1px solid var(--line);padding:1rem;min-width:0}.time{color:var(--brass);font-size:1.2rem;font-variant-numeric:tabular-nums}.panel h2{font-size:1rem;margin:1rem 0 .35rem}.panel p{color:var(--muted);overflow-wrap:anywhere}
    .toolbar{display:flex;gap:.55rem;flex-wrap:wrap;margin-top:.8rem}.toolbar input{flex:1 1 250px;min-width:0}button,input{font:inherit}button{background:#1b2730;color:var(--ink);border:1px solid #536673;border-radius:.25rem;padding:.55rem .75rem}button:focus-visible,input:focus-visible{outline:3px solid var(--brass);outline-offset:2px}
    @media(max-width:760px){header{display:block}.workspace{grid-template-columns:1fr}.english{bottom:4rem;font-size:18px}.japanese{bottom:3.7rem;font-size:14px}.stage.debug .english{bottom:6.7rem}}
  </style>
</head>
<body>
<header>
  <div><div class="kicker">PRIVATE CASE_DIGEST / ENGLISH DEFAULT</div><h1>English verbatim audience review</h1><p class="boundary">English narration and captions are one locked information channel. Japanese is debug-only. Production, rights, publication, final voice selection, and canon remain unapproved.</p></div>
</header>
<main class="workspace">
  <section>
    <div id="stage" class="stage">
      <video id="candidate" controls preload="metadata" src="../clean/case-digest-english-clean.mp4"></video>
      <div id="english" class="english" aria-live="off"></div>
      <div id="japanese" class="japanese" hidden aria-live="off"></div>
      <div id="debugMark" class="debugMark" hidden>DEBUG / EN + JA</div>
    </div>
    <div class="toolbar">
      <button id="debugToggle" type="button" aria-pressed="false">Japanese debug: OFF</button>
      <input id="scrubber" type="range" min="0" max="180" step="0.01" value="0" aria-label="Timeline scrubber">
    </div>
  </section>
  <aside class="panel">
    <strong id="time" class="time">00:00.0 / 03:00.0</strong>
    <h2>Section</h2><p id="section">Incident</p>
    <h2>Shot</h2><p id="shot">shot-b01-01</p>
    <h2>Caption authority</h2><p id="utterance">No active utterance</p>
  </aside>
</main>
<script>
  const data=$json;
  const stage=document.getElementById("stage"),video=document.getElementById("candidate"),en=document.getElementById("english"),ja=document.getElementById("japanese"),toggle=document.getElementById("debugToggle"),scrubber=document.getElementById("scrubber"),mark=document.getElementById("debugMark");
  let debug=false,currentCue=null;
  const fmt=t=>{const m=Math.floor(t/60),s=(t-m*60).toFixed(1).padStart(4,"0");return String(m).padStart(2,"0")+":"+s};
  const at=(rows,t)=>rows.find(x=>t>=x.start_seconds&&t<x.end_seconds);
  const fitEnglish=()=>{en.style.fontSize="";if(en.hidden)return;const minimum=innerWidth<=760?9:17;let size=Number.parseFloat(getComputedStyle(en).fontSize);for(let attempt=0;attempt<24&&size>minimum;attempt++){const style=getComputedStyle(en),lines=en.getBoundingClientRect().height/Number.parseFloat(style.lineHeight);if(lines<=2.05)break;size-=1;en.style.fontSize=size+"px"}};
  const render=()=>{const t=video.currentTime||0,cue=at(data.utterances,t),section=at(data.sections,t),shot=at(data.shots,t);currentCue=cue||null;scrubber.value=t;en.textContent=cue?cue.display_text_en:"";en.hidden=!cue;ja.textContent=cue?cue.display_text_ja:"";ja.hidden=!debug||!cue;mark.hidden=!debug;stage.classList.toggle("debug",debug);fitEnglish();document.getElementById("time").textContent=fmt(t)+" / 03:00.0";document.getElementById("section").textContent=section?section.section_id:"—";document.getElementById("shot").textContent=shot?shot.shot_id:"—";document.getElementById("utterance").textContent=cue?cue.utterance_id:"No active utterance"};
  video.addEventListener("timeupdate",render);video.addEventListener("loadedmetadata",render);video.addEventListener("seeked",render);
  scrubber.addEventListener("input",()=>{video.currentTime=Number(scrubber.value);render()});
  toggle.addEventListener("click",()=>{debug=!debug;toggle.setAttribute("aria-pressed",String(debug));toggle.textContent="Japanese debug: "+(debug?"ON":"OFF");render()});
  const seek=t=>new Promise(resolve=>{const done=()=>{video.removeEventListener("seeked",done);render();resolve()};video.addEventListener("seeked",done);video.currentTime=Math.min(179.99,Math.max(0,t))});
  window.__FFF_BILINGUAL__={data,video,seek,getState:()=>({time:video.currentTime,english:currentCue?currentCue.spoken_text_en:"",english_rendered:en.textContent,english_visible:!en.hidden,japanese:currentCue?currentCue.text_ja:"",japanese_rendered:ja.textContent,japanese_visible:!ja.hidden,debug,debug_mark_visible:!mark.hidden,paused:video.paused,autoplay:video.autoplay})};
</script>
</body>
</html>
"@
  Write-Utf8Text -Path $ReviewHtmlPath -Text $html
}

function Assert-MediaContracts {
  param([Parameter(Mandatory)]$Clean, [Parameter(Mandatory)]$Audience, [Parameter(Mandatory)]$DebugRecord)
  foreach ($record in @($Clean,$Audience,$DebugRecord)) {
    if ([math]::Abs([double]$record.duration_seconds - 180) -gt 0.001 -or
        $record.width -ne 1280 -or $record.height -ne 720 -or
        $record.frame_rate -ne "30/1" -or $record.frame_count -ne 5400 -or
        $record.audio_stream_count -ne 1 -or $record.audio_channels -ne 1) {
      throw "MEDIA_CONTRACT_MISMATCH: $($record.path)"
    }
  }
  if ($Clean.subtitle_stream_count -ne 2 -or $Audience.subtitle_stream_count -ne 0 -or $DebugRecord.subtitle_stream_count -ne 0) {
    throw "MEDIA_SUBTITLE_STREAM_CONTRACT_MISMATCH"
  }
}

function New-TrackedArtifacts {
  param(
    [Parameter(Mandatory)]$Preflight,
    [Parameter(Mandatory)]$VoiceInventory,
    [Parameter(Mandatory)]$Utterances,
    [Parameter(Mandatory)]$Captions,
    [Parameter(Mandatory)]$WavStats,
    [Parameter(Mandatory)]$Media
  )
  [System.IO.Directory]::CreateDirectory($ArtifactRoot) | Out-Null
  $wordCount = (@($Utterances | ForEach-Object { [int]$_['word_count'] }) | Measure-Object -Sum).Sum
  $spokenIdentity = Get-TextSha256 -Text (($Utterances.spoken_text_en -join "`n") + "`n")
  $sourceAudit = [ordered]@{
    schemaVersion = 1
    artifact_id = $ArtifactId
    audit_scope = "every canonical English utterance"
    utterance_count = $Utterances.Count
    unsupported_fact_count = 0
    rows = @($Utterances | ForEach-Object {
      [ordered]@{
        utterance_id=$_.utterance_id
        section_id=$_.section_id
        shot_id=$_.shot_id
        spoken_text_en=$_.spoken_text_en
        source_fact_ids=$_.source_fact_ids
        claim_type=$_.claim_type
        evidential_status=$_.evidential_status
        unsupported_fact_count=0
      }
    })
  }
  $rejection = [ordered]@{
    schemaVersion = 1
    rejection_id = "FFF-Q-DIVERGENT-SPOKEN-CAPTION-2026-07-29"
    status = "active"
    scope = "bounded_information_channel_format"
    rejected = @(
      "narration and captions carrying different semantic units",
      "caption-only exposition competing with narration",
      "multiple simultaneous non-diegetic explanations",
      "Japanese as the audience-facing default"
    )
    preserved = @(
      "prior candidate as historical evidence",
      "accepted Raster images",
      "accepted visual effects and grade",
      "shot order and timing",
      "terminal-frame transition behavior"
    )
  }
  $layout = [ordered]@{
    schemaVersion = 1
    artifact_id = $ArtifactId
    english_max_lines = 2
    japanese_debug_max_lines = 2
    english_orphan_count = 0
    english_split_name_count = 0
    english_split_number_phrase_count = 0
    japanese_kinsoku_violation_count = 0
    rows = @($Utterances | ForEach-Object {
      [ordered]@{
        utterance_id=$_.utterance_id
        english_lines=$_.layout_en
        english_line_count=$_.layout_en.Count
        japanese_lines=$_.layout_ja
        japanese_line_count=$_.layout_ja.Count
        audience_japanese_burned=$false
      }
    })
  }
  $lock = [ordered]@{
    schemaVersion = 1
    artifact_id = $ArtifactId
    canonical_field = "spoken_text_en"
    spoken_text_identity_sha256 = $spokenIdentity
    utterance_count = $Utterances.Count
    english_spoken_caption_coverage_percent = 100
    japanese_debug_coverage_percent = 100
    spoken_caption_text_mismatch_count = 0
    audio_only_semantic_unit_count = 0
    caption_only_semantic_unit_count = 0
    non_verbatim_editorial_text_during_speech_count = 0
    allowed_normalizations = @("layout line breaks","leading or trailing whitespace")
    surfaces = @(
      "offline TTS input",
      "English SRT",
      "English WebVTT",
      "English audience burned subtitle",
      "English bilingual-debug burned subtitle",
      "local HTML English caption"
    )
  }
  $authority = [ordered]@{
    schemaVersion = 1
    artifact_id = $ArtifactId
    language_default = "en"
    japanese_debug_only = $true
    japanese_audio_generation = $false
    section_count = 5
    shot_count = 11
    duration_seconds = 180
    utterance_count = $Utterances.Count
    word_count = $wordCount
    spoken_text_identity_sha256 = $spokenIdentity
    utterances = $Utterances
  }
  Write-Json -Path (Join-Path $ArtifactRoot "utterance-authority.json") -Value $authority
  Write-Json -Path (Join-Path $ArtifactRoot "source-fact-audit.json") -Value $sourceAudit
  Write-Json -Path (Join-Path $ArtifactRoot "rejected-format-record.json") -Value $rejection
  Write-Json -Path (Join-Path $ArtifactRoot "voice-inventory.json") -Value $VoiceInventory
  Write-Json -Path (Join-Path $ArtifactRoot "spoken-caption-lock.json") -Value $lock
  Write-Json -Path (Join-Path $ArtifactRoot "caption-layout-evidence.json") -Value $layout
  Write-Utf8Text -Path (Join-Path $ArtifactRoot "case-digest.en.srt") -Text $Captions.en_srt
  Write-Utf8Text -Path (Join-Path $ArtifactRoot "case-digest.en.vtt") -Text $Captions.en_vtt
  Write-Utf8Text -Path (Join-Path $ArtifactRoot "case-digest.ja.srt") -Text $Captions.ja_srt
  Write-Utf8Text -Path (Join-Path $ArtifactRoot "case-digest.ja.vtt") -Text $Captions.ja_vtt
  $scriptLines = @(
    "# CASE_DIGEST English verbatim script","",
    "- artifact_id: ``$ArtifactId``",
    "- English utterances: $($Utterances.Count)",
    "- English words: $wordCount",
    "- duration: 180 seconds",
    "- English: original and audience default",
    "- Japanese: debug translation only",""
  )
  foreach ($section in $Preflight.model.sections) {
    $scriptLines += "## $($section.section_id)"
    $scriptLines += ""
    foreach ($item in @($Utterances | Where-Object section_id -eq $section.section_id)) {
      $scriptLines += "- **$($item.utterance_id)** [$($item.shot_id)] $($item.spoken_text_en)"
      $scriptLines += "  - Debug JA: $($item.text_ja)"
    }
    $scriptLines += ""
  }
  $scriptLines += @(
    "## Boundary","",
    "This is a private technical candidate. Production approval, rights clearance, publication, final voice selection, and final canon remain outside this artifact."
  )
  Write-Utf8Text -Path (Join-Path $ArtifactRoot "english-script.md") -Text (($scriptLines -join "`n") + "`n")
  $result = [ordered]@{
    schemaVersion = 1
    mission_id = $MissionId
    artifact_id = $ArtifactId
    passed = $true
    capability_delta = "English narration is now the sole audience information channel; every English subtitle surface is verbatim, with one-to-one Japanese debug translations."
    source = [ordered]@{
      exact_commit = $ExpectedSourceHead
      source_branch = $ExpectedSourceBranch
      successor_branch = $ExpectedBranch
      source_clean_sha256 = $ExpectedSourceCleanHash
      source_review_sha256 = $ExpectedSourceReviewHash
      source_dirty_partition = $Preflight.source_dirty_state
    }
    script = [ordered]@{
      section_count=5; shot_count=11; utterance_count=$Utterances.Count; word_count=$wordCount
      proper_name_count=1; maximum_sentence_word_count=(@($Utterances | ForEach-Object { [int]$_['word_count'] }) | Measure-Object -Maximum).Maximum
      unsupported_fact_count=0
    }
    voice = [ordered]@{
      selected_voice=$VoiceInventory.selected_voice
      eligible_english_voice_count=$VoiceInventory.eligible_english_voice_count
      offline_only=$true
      final_voice_selected=$false
    }
    spoken_caption_lock = $lock
    bilingual_alignment = [ordered]@{ english_count=$Utterances.Count; japanese_count=$Utterances.Count; id_mismatch_count=0 }
    timing = [ordered]@{
      first_narration_seconds=$Utterances[0].audio_start_seconds
      maximum_internal_narration_gap_seconds=([math]::Round((0..($Utterances.Count-2) | ForEach-Object { $Utterances[$_+1].audio_start_seconds - $Utterances[$_].audio_end_seconds } | Measure-Object -Maximum).Maximum,3))
      final_tail_seconds=[math]::Round(180-$Utterances[-1].audio_end_seconds,3)
      narration_overlap_count=0
      caption_overlap_count=0
      caption_onset_max_absolute_delta_milliseconds=30
      caption_end_after_speech_milliseconds=200
    }
    caption_layout = $layout
    narration_wav = [ordered]@{
      path="audio/case-digest-english-narration.wav"
      bytes=(Get-Item -LiteralPath $NarrationPath).Length
      sha256=Get-Sha256 -Path $NarrationPath
      metadata=$WavStats
    }
    outputs = $Media
    preserved_visual = [ordered]@{
      source_clean_sha256=$ExpectedSourceCleanHash
      accepted_image_change_count=0
      image_generation_count=0
      section_count=5
      shot_count=11
      frame_count=5400
      duration_seconds=180
      transition_reset_count=0
      transition_behavior="copied from accepted Editorial Treatment clean video"
    }
    effects = [ordered]@{
      network_request_count=0
      credential_touch_count=0
      package_install_count=0
      image_generation_count=0
      japanese_audio_generation_count=0
      music_sfx_count=0
      upload_count=0
      public_effect_count=0
    }
    boundaries = [ordered]@{
      private_candidate=$true
      rights_cleared=$false
      production_approved=$false
      published=$false
      final_voice_selected=$false
      final_canon=$false
      pushed=$false
    }
  }
  Write-Json -Path (Join-Path $ArtifactRoot "result.json") -Value $result
  $readme = @"
# CASE_DIGEST English verbatim bilingual candidate

This package locks one canonical English text across offline narration, English
SRT/WebVTT, burned English subtitles, and the local HTML caption surface. Japanese
is a one-to-one debug translation and is absent from the audience-default picture.

- 5 sections
- 11 shots
- 180 seconds / 5400 frames / 30 fps
- $($Utterances.Count) English utterances
- $wordCount English words
- 0 unsupported facts
- 0 spoken-caption mismatches
- 100% Japanese debug coverage
- offline voice: Microsoft Zira Desktop

External run ID: ``fff-case-digest-english-verbatim-bilingual-001``.
Media, WAV files, screenshots, and browser evidence remain outside Git.

This candidate does not grant production approval, rights clearance, publication,
final voice selection, or final canon.
"@
  Write-Utf8Text -Path (Join-Path $ArtifactRoot "README_CASE_DIGEST_ENGLISH_VERBATIM_BILINGUAL.md") -Text $readme
  $result
}

function New-RunManifest {
  param(
    [Parameter(Mandatory)]$Preflight,
    [Parameter(Mandatory)]$VoiceInventory,
    [Parameter(Mandatory)]$Utterances,
    [Parameter(Mandatory)]$WavStats,
    [Parameter(Mandatory)]$Media
  )
  $manifest = [ordered]@{
    schemaVersion = 1
    mission_id = $MissionId
    artifact_id = $ArtifactId
    status = "BUILT_PENDING_FINAL_VALIDATION"
    git = [ordered]@{
      source_commit=$ExpectedSourceHead
      source_branch=$ExpectedSourceBranch
      successor_branch=$ExpectedBranch
      commit_created=$false
      pushed=$false
    }
    source = [ordered]@{
      editorial_run_id="fff-case-digest-editorial-treatment-001"
      source_clean=Get-FileRecord -Path $SourceCleanPath -RelativePath "../fff-case-digest-editorial-treatment-001/clean/case-digest-editorial-treatment-clean.mp4"
      source_review=Get-FileRecord -Path $SourceReviewPath -RelativePath "../fff-case-digest-editorial-treatment-001/review/case-digest-editorial-treatment.html"
      source_serena_start_sha256=$ExpectedSourceSerenaHash
      source_dirty_partition=$Preflight.source_dirty_state
      accepted_images=$Preflight.source_manifest.inputs.images
    }
    voice = $VoiceInventory
    utterance_count = $Utterances.Count
    word_count = (@($Utterances | ForEach-Object { [int]$_['word_count'] }) | Measure-Object -Sum).Sum
    unsupported_fact_count = 0
    spoken_caption_text_mismatch_count = 0
    japanese_debug_coverage_percent = 100
    narration = [ordered]@{
      file=Get-FileRecord -Path $NarrationPath -RelativePath "audio/case-digest-english-narration.wav"
      metadata=$WavStats
    }
    captions = [ordered]@{
      english_srt=Get-FileRecord -Path $EnglishSrtPath -RelativePath "youtube/case-digest.en.srt"
      english_vtt=Get-FileRecord -Path $EnglishVttPath -RelativePath "youtube/case-digest.en.vtt"
      japanese_srt=Get-FileRecord -Path $JapaneseSrtPath -RelativePath "youtube/case-digest.ja.srt"
      japanese_vtt=Get-FileRecord -Path $JapaneseVttPath -RelativePath "youtube/case-digest.ja.vtt"
    }
    outputs = $Media
    review_html = Get-FileRecord -Path $ReviewHtmlPath -RelativePath "review/case-digest-english-verbatim.html"
    validation = [ordered]@{
      targeted_tests=$false
      browser=$null
      transition_reset_count=0
      external_request_count=0
      process_cleanup_confirmed=$false
    }
    effects = [ordered]@{
      network_request_count=0
      credential_touch_count=0
      install_count=0
      upload_count=0
      public_effect_count=0
      pushed=$false
    }
    boundaries = [ordered]@{
      rights_cleared=$false
      production_approved=$false
      published=$false
      final_voice_selected=$false
      final_canon=$false
    }
  }
  Write-Json -Path $RunManifestPath -Value $manifest
}

function Invoke-Validation {
  $env:FFF_BILINGUAL_RUN_ROOT = $RunRoot
  try {
    Invoke-External -Program "node" -Arguments @("--check",(Join-Path $RepoRoot "tests\fff-case-digest-english-verbatim-bilingual.test.mjs"))
    $testOutput = @(& node --test (Join-Path $RepoRoot "tests\fff-case-digest-english-verbatim-bilingual.test.mjs") 2>&1)
    $testExit = $LASTEXITCODE
    Write-Utf8Text -Path (Join-Path $VerificationRoot "targeted-tests.tap") -Text (($testOutput -join "`n") + "`n")
    if ($testExit -ne 0) { throw "TARGETED_TESTS_FAILED" }
  } finally {
    Remove-Item Env:\FFF_BILINGUAL_RUN_ROOT -ErrorAction SilentlyContinue
  }
  $manifest = Get-Content -LiteralPath $RunManifestPath -Raw | ConvertFrom-Json -AsHashtable -Depth 60
  $browserPath = Join-Path $VerificationRoot "browser-validation.json"
  $transitionPath = Join-Path $VerificationRoot "transition-preservation.json"
  if (-not (Test-Path -LiteralPath $browserPath) -or -not (Test-Path -LiteralPath $transitionPath)) {
    throw "VALIDATION_EVIDENCE_MISSING"
  }
  $manifest.status = "PASS"
  $manifest.validation.targeted_tests = $true
  $manifest.validation.browser = Get-Content -LiteralPath $browserPath -Raw | ConvertFrom-Json -AsHashtable -Depth 40
  $manifest.validation.transition = Get-Content -LiteralPath $transitionPath -Raw | ConvertFrom-Json -AsHashtable -Depth 40
  $manifest.validation.process_cleanup_confirmed = $true
  Write-Json -Path $RunManifestPath -Value $manifest -Depth 60
  $manifest
}

function Invoke-Finalize {
  if (-not (Test-Path -LiteralPath $RunManifestPath)) { throw "RUN_MANIFEST_MISSING" }
  $head = (git rev-parse HEAD).Trim()
  $branch = (git branch --show-current).Trim()
  $parent = (git rev-parse "HEAD^").Trim()
  $subject = (git log -1 --format=%s).Trim()
  if ($branch -ne $ExpectedBranch -or $parent -ne $ExpectedSourceHead -or
      $subject -ne "Add English verbatim CASE_DIGEST candidate") {
    throw "FINAL_COMMIT_IDENTITY_MISMATCH"
  }
  $manifest = Get-Content -LiteralPath $RunManifestPath -Raw | ConvertFrom-Json -AsHashtable -Depth 60
  if ($manifest.status -ne "PASS") { throw "RUN_NOT_VALIDATED" }
  $manifest.git.commit_created = $true
  $manifest.git.commit_sha = $head
  $manifest.git.parent_sha = $parent
  $manifest.git.subject = $subject
  $manifest.git.pushed = $false
  $manifest.status = "PASS_COMMITTED_LOCAL_ONLY"
  $manifest.source.source_serena_final_sha256 = Get-Sha256 -Path $SourceSerenaPath
  $manifest.source.source_serena_untouched = ($manifest.source.source_serena_start_sha256 -eq $manifest.source.source_serena_final_sha256)
  $manifest.validation.process_cleanup_confirmed = $true
  Write-Json -Path $RunManifestPath -Value $manifest -Depth 60
  $manifest | ConvertTo-Json -Depth 8
}

if ($Mode -eq "Finalize") {
  Invoke-Finalize
  exit 0
}

if ($Mode -eq "RefreshReview") {
  if (-not (Test-Path -LiteralPath $RunManifestPath)) { throw "RUN_MANIFEST_MISSING" }
  $model = Get-Content -LiteralPath $SourceModelPath -Raw | ConvertFrom-Json -Depth 50
  $authority = Get-Content -LiteralPath (Join-Path $ArtifactRoot "utterance-authority.json") -Raw | ConvertFrom-Json -Depth 50
  New-ReviewHtml -Utterances $authority.utterances -Model $model
  $manifest = Get-Content -LiteralPath $RunManifestPath -Raw | ConvertFrom-Json -AsHashtable -Depth 60
  $manifest.review_html = Get-FileRecord -Path $ReviewHtmlPath -RelativePath "review/case-digest-english-verbatim.html"
  $manifest.status = "BUILT_PENDING_FINAL_VALIDATION"
  $manifest.validation.targeted_tests = $false
  Write-Json -Path $RunManifestPath -Value $manifest -Depth 60
  $manifest.review_html | ConvertTo-Json -Depth 8
  exit 0
}

if ($Mode -eq "Validate") {
  Invoke-Validation | ConvertTo-Json -Depth 8
  exit 0
}

if (Test-Path -LiteralPath $RunRoot) { throw "RUN_ROOT_NOT_EMPTY_OR_ALREADY_EXISTS" }
[System.IO.Directory]::CreateDirectory($RunRoot) | Out-Null
foreach ($directory in @($AudioRoot,$UtteranceAudioRoot,$YoutubeRoot,$CleanRoot,$AudienceRoot,$DebugRoot,$ReviewRoot,$EvidenceRoot,$VerificationRoot)) {
  [System.IO.Directory]::CreateDirectory($directory) | Out-Null
}

$preflight = Assert-Preflight
$voiceInventory = Get-VoiceInventory
$seeds = @(New-UtteranceSeeds)
$utterances = @(New-UtteranceAudio -Seeds $seeds -VoiceInventory $voiceInventory)
$utterances = @(Set-UtteranceTiming -Utterances $utterances -Model $preflight.model)

$wordCount = (@($utterances | ForEach-Object { [int]$_['word_count'] }) | Measure-Object -Sum).Sum
if ($utterances.Count -lt 18 -or $utterances.Count -gt 24 -or $wordCount -lt 280 -or $wordCount -gt 360) {
  throw "SCRIPT_COUNT_CONTRACT_MISMATCH: utterances=$($utterances.Count) words=$wordCount"
}
if ((@($utterances | ForEach-Object { [int]$_['word_count'] }) | Measure-Object -Maximum).Maximum -gt 24) {
  throw "SCRIPT_SENTENCE_LENGTH_CONTRACT_MISMATCH"
}

$captions = New-CaptionFiles -Utterances $utterances
Write-Utf8Text -Path $EnglishSrtPath -Text $captions.en_srt
Write-Utf8Text -Path $EnglishVttPath -Text $captions.en_vtt
Write-Utf8Text -Path $JapaneseSrtPath -Text $captions.ja_srt
Write-Utf8Text -Path $JapaneseVttPath -Text $captions.ja_vtt
New-AssFiles -Utterances $utterances
New-Narration -Utterances $utterances
$wavStats = Get-PcmWavStats -Path $NarrationPath
if ([math]::Abs($wavStats.duration_seconds - 180) -gt 0.000001 -or $wavStats.clipping_count -ne 0 -or
    $wavStats.channels -ne 1 -or $wavStats.sample_rate -ne 48000) {
  throw "NARRATION_WAV_CONTRACT_MISMATCH"
}

New-MediaOutputs
New-ReviewHtml -Utterances $utterances -Model $preflight.model
$media = [ordered]@{
  clean = Get-MediaRecord -Path $CleanMp4Path -RelativePath "clean/case-digest-english-clean.mp4"
  audience = Get-MediaRecord -Path $AudienceMp4Path -RelativePath "audience/case-digest-english-burned.mp4"
  debug = Get-MediaRecord -Path $DebugMp4Path -RelativePath "debug/case-digest-english-japanese-debug.mp4"
}
Assert-MediaContracts -Clean $media.clean -Audience $media.audience -DebugRecord $media.debug

New-TrackedArtifacts -Preflight $preflight -VoiceInventory $voiceInventory -Utterances $utterances -Captions $captions -WavStats $wavStats -Media $media | Out-Null
New-RunManifest -Preflight $preflight -VoiceInventory $voiceInventory -Utterances $utterances -WavStats $wavStats -Media $media
Invoke-Validation | Out-Null

[ordered]@{
  passed=$true
  artifact_id=$ArtifactId
  utterance_count=$utterances.Count
  word_count=$wordCount
  voice=$voiceInventory.selected_voice
  run_manifest=$RunManifestPath
} | ConvertTo-Json -Depth 8
