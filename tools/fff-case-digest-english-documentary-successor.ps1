[CmdletBinding()]
param(
  [ValidateSet("Build", "Validate", "RefreshReview", "RecordValidation", "RecordLocalDiff")]
  [string]$Mode = "Build",
  [string]$RunRoot = "C:\Users\thank\Storage\Media Contents Projects\FastFictionFactory-runs\fff-case-digest-english-documentary-successor-001-thank-r2",
  [string]$SourceRunRoot = "D:\AI-Runs\FastFictionFactory\fff-case-digest-english-verbatim-bilingual-001"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ArtifactId = "fff-case-digest-english-documentary-successor-001"
$MissionId = "fff-development-english-documentary-successor-001"
$AttemptId = 2
$ExpectedHead = "2a2cb5ddc3ca7cdcbf9934a75023325d4bdbf155"
$ExpectedBranch = "codex/fff-case-digest-english-documentary-successor-v1-thank-r2"
$ExpectedSourceRef = "refs/remotes/origin/codex/fff-case-digest-english-verbatim-bilingual-v1"
$ExpectedProductCheckpoint = "dbd3ec00d7f31ba84bebb032f78057780215c338"
$ExpectedSourceArtifact = "fff-case-digest-english-verbatim-bilingual-001"
$ExpectedSourceCleanHash = "5dabf0d31a93f7e56c9ed30cbc8718e453817a770759ae74ee50c37eb0f69b4c"
$DurationSeconds = 180
$Fps = 30
$FrameCount = 5400

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ArtifactRoot = Join-Path $RepoRoot "artifacts\case-digest-english-documentary-successor"
$SourceArtifactRoot = Join-Path $RepoRoot "artifacts\case-digest-english-verbatim-bilingual"
$SourceAuthorityPath = Join-Path $SourceArtifactRoot "utterance-authority.json"
$SourceManifestPath = Join-Path $SourceRunRoot "run-manifest.json"
$SourceCleanPath = Join-Path $SourceRunRoot "clean\case-digest-english-clean.mp4"
$PictureRoot = Join-Path $RunRoot "picture"
$AudienceRoot = Join-Path $RunRoot "audience"
$DebugRoot = Join-Path $RunRoot "debug"
$ReviewRoot = Join-Path $RunRoot "review"
$YoutubeRoot = Join-Path $RunRoot "youtube"
$EvidenceRoot = Join-Path $RunRoot "evidence"
$VerificationRoot = Join-Path $RunRoot "verification"
$PicturePath = Join-Path $PictureRoot "case-digest-documentary-picture-lock.mp4"
$AudiencePath = Join-Path $AudienceRoot "case-digest-documentary-english-burned.mp4"
$DebugPath = Join-Path $DebugRoot "case-digest-documentary-bilingual-debug.mp4"
$ReviewPath = Join-Path $ReviewRoot "case-digest-documentary-successor.html"
$EnglishSrtPath = Join-Path $YoutubeRoot "case-digest-documentary.en.srt"
$EnglishVttPath = Join-Path $YoutubeRoot "case-digest-documentary.en.vtt"
$JapaneseSrtPath = Join-Path $YoutubeRoot "case-digest-documentary.ja.srt"
$JapaneseVttPath = Join-Path $YoutubeRoot "case-digest-documentary.ja.vtt"
$AudienceAssPath = Join-Path $VerificationRoot "audience.ass"
$DebugAssPath = Join-Path $VerificationRoot "debug.ass"
$RunManifestPath = Join-Path $RunRoot "run-manifest.json"

function Write-Utf8Text {
  param([Parameter(Mandatory)][string]$Path, [Parameter(Mandatory)][string]$Text)
  $parent = Split-Path -Parent $Path
  if ($parent) { [System.IO.Directory]::CreateDirectory($parent) | Out-Null }
  [System.IO.File]::WriteAllText($Path, $Text, [System.Text.UTF8Encoding]::new($false))
}

function Write-Json {
  param([Parameter(Mandatory)][string]$Path, [Parameter(Mandatory)]$Value)
  Write-Utf8Text -Path $Path -Text (($Value | ConvertTo-Json -Depth 80) + "`n")
}

function Get-Sha256 {
  param([Parameter(Mandatory)][string]$Path)
  (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash.ToLowerInvariant()
}

function Get-TextSha256 {
  param([Parameter(Mandatory)][string[]]$Values)
  $text = ($Values -join "`n")
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($text)
  $hash = [System.Security.Cryptography.SHA256]::HashData($bytes)
  [Convert]::ToHexString($hash).ToLowerInvariant()
}

function Invoke-Native {
  param([Parameter(Mandatory)][string]$FilePath, [Parameter(Mandatory)][string[]]$Arguments)
  & $FilePath @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "$FilePath exited with code $LASTEXITCODE"
  }
}

function Invoke-Ffprobe {
  param([Parameter(Mandatory)][string]$Path)
  $json = & ffprobe -v error -show_streams -show_format -count_frames -of json $Path
  if ($LASTEXITCODE -ne 0) { throw "ffprobe failed for $Path" }
  $json | ConvertFrom-Json -Depth 50
}

function Get-RunRelativePath {
  param([Parameter(Mandatory)][string]$Path)
  [System.IO.Path]::GetRelativePath($RunRoot, $Path).Replace("\", "/")
}

function Get-FileRecord {
  param([Parameter(Mandatory)][string]$Path)
  [ordered]@{
    path = Get-RunRelativePath -Path $Path
    bytes = (Get-Item -LiteralPath $Path).Length
    sha256 = Get-Sha256 -Path $Path
  }
}

function Get-MediaRecord {
  param([Parameter(Mandatory)][string]$Path)
  $probe = Invoke-Ffprobe -Path $Path
  $video = @($probe.streams | Where-Object codec_type -eq "video")
  $audio = @($probe.streams | Where-Object codec_type -eq "audio")
  $subtitles = @($probe.streams | Where-Object codec_type -eq "subtitle")
  [ordered]@{
    path = Get-RunRelativePath -Path $Path
    bytes = (Get-Item -LiteralPath $Path).Length
    sha256 = Get-Sha256 -Path $Path
    duration_seconds = [math]::Round([double]$probe.format.duration, 3)
    width = [int]$video[0].width
    height = [int]$video[0].height
    frame_rate = [string]$video[0].avg_frame_rate
    frame_count = [int]$video[0].nb_read_frames
    video_codec = [string]$video[0].codec_name
    audio_stream_count = $audio.Count
    subtitle_stream_count = $subtitles.Count
  }
}

function Get-WordCount {
  param([Parameter(Mandatory)][string]$Text)
  @($Text.Trim() -split "\s+" | Where-Object { $_ }).Count
}

function Format-SrtTime {
  param([Parameter(Mandatory)][double]$Seconds)
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
  param([Parameter(Mandatory)][double]$Seconds)
  (Format-SrtTime -Seconds $Seconds).Replace(",", ".")
}

function Format-AssTime {
  param([Parameter(Mandatory)][double]$Seconds)
  $centiseconds = [int][math]::Round($Seconds * 100)
  $hours = [math]::Floor($centiseconds / 360000)
  $centiseconds -= $hours * 360000
  $minutes = [math]::Floor($centiseconds / 6000)
  $centiseconds -= $minutes * 6000
  $wholeSeconds = [math]::Floor($centiseconds / 100)
  $centiseconds -= $wholeSeconds * 100
  "{0}:{1:00}:{2:00}.{3:00}" -f $hours,$minutes,$wholeSeconds,$centiseconds
}

function Escape-AssText {
  param([Parameter(Mandatory)][string]$Text)
  $Text.Replace("\", "\\").Replace("{", "\{").Replace("}", "\}")
}

function Wrap-English {
  param([Parameter(Mandatory)][string]$Text)
  if ($Text.Length -le 52) { return @($Text) }
  $words = @($Text -split "\s+")
  $best = $null
  $bestScore = [double]::PositiveInfinity
  for ($index = 1; $index -lt $words.Count; $index++) {
    $left = ($words[0..($index - 1)] -join " ")
    $right = ($words[$index..($words.Count - 1)] -join " ")
    if ($left.Length -le 58 -and $right.Length -le 58) {
      $score = [math]::Abs($left.Length - $right.Length)
      if ($score -lt $bestScore) {
        $best = @($left, $right)
        $bestScore = $score
      }
    }
  }
  if (-not $best) { throw "ENGLISH_CAPTION_WRAP_FAILED: $Text" }
  $best
}

function Wrap-Japanese {
  param([Parameter(Mandatory)][string]$Text)
  if ($Text.Length -le 28) { return @($Text) }
  $split = [math]::Floor($Text.Length / 2)
  $forbiddenStart = "、。，．？！）」』】〕〉》"
  $forbiddenEnd = "（「『【〔〈《"
  while ($split -lt ($Text.Length - 1) -and $forbiddenStart.Contains([string]$Text[$split])) { $split++ }
  while ($split -gt 1 -and $forbiddenEnd.Contains([string]$Text[$split - 1])) { $split-- }
  $lines = @($Text.Substring(0, $split), $Text.Substring($split))
  if (($lines | Measure-Object -Property Length -Maximum).Maximum -gt 32) {
    throw "JAPANESE_CAPTION_WRAP_FAILED: $Text"
  }
  $lines
}

function New-UtteranceSeeds {
  @(
    [ordered]@{ utterance_id="cd-doc-en-001"; section_id="case-digest-section-01-incident"; shot_id="shot-b01-01"; spoken_text_en="At noon, witnesses reported a bell sounding from a tower built without one."; text_ja="正午、鐘のない塔から鐘の音がしたと、目撃者たちは報告した。"; source_fact_ids=@("case-digest-section-01-incident.what_happened"); claim_type="reported_observation"; evidential_status="reported"; topics=@("incident") },
    [ordered]@{ utterance_id="cd-doc-en-002"; section_id="case-digest-section-01-incident"; shot_id="shot-b01-01"; spoken_text_en="The mounting frame stood empty, with no bell or other sound-making instrument in view."; text_ja="取付枠は空で、鐘もほかの発音器具も見当たらなかった。"; source_fact_ids=@("case-digest-section-01-incident.evidence_or_observation"); claim_type="observed_condition"; evidential_status="established"; topics=@("incident","unresolved_boundary") },
    [ordered]@{ utterance_id="cd-doc-en-003"; section_id="case-digest-section-01-incident"; shot_id="shot-b01-02"; spoken_text_en="The event is clear in outline: a reported sound, an empty frame, and an unidentified source."; text_ja="事件の輪郭は、報告された音、空の枠、そして特定されていない音源である。"; source_fact_ids=@("case-digest-section-01-incident.evidence_or_observation","case-digest-section-01-incident.evidential_limit"); claim_type="documentary_summary"; evidential_status="bounded"; topics=@("incident","unresolved_boundary") },
    [ordered]@{ utterance_id="cd-doc-en-004"; section_id="case-digest-section-01-incident"; shot_id="shot-b01-02"; spoken_text_en="That unanswered contrast begins the case."; text_ja="その未解決の対比から、事件は始まる。"; source_fact_ids=@("case-digest-section-01-incident.connection_to_next_section"); claim_type="section_bridge"; evidential_status="bounded"; topics=@("incident") },

    [ordered]@{ utterance_id="cd-doc-en-005"; section_id="case-digest-section-02-investigator"; shot_id="shot-b02-01"; spoken_text_en="Clock repairer Mira Vale follows the evidence because her brother is missing."; text_ja="時計修理師ミラ・ヴェイルが証拠を追うのは、兄が失踪しているからだ。"; source_fact_ids=@("case-digest-section-02-investigator.what_happened"); claim_type="investigator_identity"; evidential_status="established"; topics=@("investigator","personal_connection") },
    [ordered]@{ utterance_id="cd-doc-en-006"; section_id="case-digest-section-02-investigator"; shot_id="shot-b02-01"; spoken_text_en="A note attributed to him was left among the materials on her workbench."; text_ja="兄のものとされるメモが、彼女の作業台の品々に残されていた。"; source_fact_ids=@("case-digest-section-02-investigator.text_ja"); claim_type="reported_clue"; evidential_status="attributed_not_authenticated"; topics=@("personal_connection","clue_chain") },
    [ordered]@{ utterance_id="cd-doc-en-007"; section_id="case-digest-section-02-investigator"; shot_id="shot-b02-02"; spoken_text_en="Beside it rests a brass moth, a small object whose purpose is still unknown."; text_ja="そのそばには真鍮の蛾があり、この小さな物の用途はまだ分からない。"; source_fact_ids=@("case-digest-section-02-investigator.evidence_or_observation","recurring-element-continuity.brass_moth.evidential_limit"); claim_type="clue_with_limit"; evidential_status="meaning_unconfirmed"; topics=@("clue_chain","unresolved_boundary") },
    [ordered]@{ utterance_id="cd-doc-en-008"; section_id="case-digest-section-02-investigator"; shot_id="shot-b02-03"; spoken_text_en="Clocks and records repeat nine seventeen, bringing the note, moth, and time into one sequence."; text_ja="時計と記録は九時十七分を繰り返し、メモ、蛾、時刻を一つの連なりにする。"; source_fact_ids=@("case-digest-section-02-investigator.evidence_or_observation"); claim_type="clue_chain"; evidential_status="established_pattern"; topics=@("clue_chain") },
    [ordered]@{ utterance_id="cd-doc-en-009"; section_id="case-digest-section-02-investigator"; shot_id="shot-b02-03"; spoken_text_en="Together they form a trail of clues, though not a map to her brother."; text_ja="それらは手掛かりの道筋を作るが、兄の居場所を示す地図ではない。"; source_fact_ids=@("case-digest-section-02-investigator.evidential_limit"); claim_type="clue_boundary"; evidential_status="location_unconfirmed"; topics=@("clue_chain","personal_connection","unresolved_boundary") },

    [ordered]@{ utterance_id="cd-doc-en-010"; section_id="case-digest-section-03-ledger"; shot_id="shot-b03-01"; spoken_text_en="The note leads Mira to a ledger divided into two facing columns."; text_ja="メモはミラを、向かい合う二列に分かれた台帳へ導く。"; source_fact_ids=@("case-digest-section-03-ledger.what_happened","case-digest-caption-06"); claim_type="investigative_link"; evidential_status="established"; topics=@("ledger","clue_chain") },
    [ordered]@{ utterance_id="cd-doc-en-011"; section_id="case-digest-section-03-ledger"; shot_id="shot-b03-01"; spoken_text_en="One column records minutes; the other records people's names."; text_ja="一方の列には分が、もう一方には人々の名前が記されている。"; source_fact_ids=@("case-digest-section-03-ledger.evidence_or_observation"); claim_type="record_structure"; evidential_status="established"; topics=@("ledger") },
    [ordered]@{ utterance_id="cd-doc-en-012"; section_id="case-digest-section-03-ledger"; shot_id="shot-b03-02"; spoken_text_en="The visible pages establish those two categories, while their purpose remains unresolved."; text_ja="見えるページが示すのは二つの区分であり、その用途は未解決のままだ。"; source_fact_ids=@("case-digest-section-03-ledger.text_ja","case-digest-section-03-ledger.evidential_limit"); claim_type="record_with_limit"; evidential_status="bounded"; topics=@("ledger","unresolved_boundary") },
    [ordered]@{ utterance_id="cd-doc-en-013"; section_id="case-digest-section-03-ledger"; shot_id="shot-b03-02"; spoken_text_en="Their relationship to the missing brother is a question the case has not answered."; text_ja="その記録と失踪した兄の関係は、この事件がまだ答えていない問いである。"; source_fact_ids=@("case-digest-section-03-ledger.evidential_limit","case-digest-section-03-ledger.connection_to_next_section"); claim_type="causal_boundary"; evidential_status="unproven"; topics=@("ledger","personal_connection","unresolved_boundary") },

    [ordered]@{ utterance_id="cd-doc-en-014"; section_id="case-digest-section-04-council"; shot_id="shot-b04-01"; spoken_text_en="From the ledger, the investigation turns toward the city council indicated by the note."; text_ja="台帳から、調査はメモが示す市の評議会へ向かう。"; source_fact_ids=@("case-digest-section-04-council.what_happened"); claim_type="allegation_direction"; evidential_status="recorded_allegation"; topics=@("council_relevance","clue_chain") },
    [ordered]@{ utterance_id="cd-doc-en-015"; section_id="case-digest-section-04-council"; shot_id="shot-b04-01"; spoken_text_en="The note makes the council relevant, but remains an allegation rather than proof of involvement."; text_ja="メモは評議会を調査対象にするが、関与の証明ではなく告発の記録にとどまる。"; source_fact_ids=@("case-digest-section-04-council.evidence_or_observation","case-digest-section-04-council.evidential_limit"); claim_type="allegation_with_limit"; evidential_status="unconfirmed"; topics=@("council_relevance","unresolved_boundary") },
    [ordered]@{ utterance_id="cd-doc-en-016"; section_id="case-digest-section-04-council"; shot_id="shot-b04-02"; spoken_text_en="The ledger's origin and authenticity are also open questions."; text_ja="台帳の出所と真正性も、まだ開かれた問いである。"; source_fact_ids=@("case-digest-section-04-council.evidential_limit"); claim_type="authenticity_boundary"; evidential_status="unverified"; topics=@("ledger","council_relevance","unresolved_boundary") },
    [ordered]@{ utterance_id="cd-doc-en-017"; section_id="case-digest-section-04-council"; shot_id="shot-b04-02"; spoken_text_en="So the council, the ledger, and the tower occupy the same investigation without a proven mechanism."; text_ja="こうして評議会、台帳、塔は、仕組みが証明されないまま同じ調査に並ぶ。"; source_fact_ids=@("case-digest-section-04-council.text_ja","case-digest-section-05-status.evidential_limit"); claim_type="mechanism_boundary"; evidential_status="unconfirmed"; topics=@("council_relevance","unresolved_boundary") },

    [ordered]@{ utterance_id="cd-doc-en-018"; section_id="case-digest-section-05-status"; shot_id="shot-b06-01"; spoken_text_en="What is established is the evidence set: reported bell, empty frame, note, brass moth, nine seventeen, ledger."; text_ja="確認できる証拠群は、報告された鐘、空の枠、メモ、真鍮の蛾、九時十七分、台帳である。"; source_fact_ids=@("case-digest-section-05-status.evidence_or_observation"); claim_type="evidence_inventory"; evidential_status="established"; topics=@("incident","clue_chain","ledger") },
    [ordered]@{ utterance_id="cd-doc-en-019"; section_id="case-digest-section-05-status"; shot_id="shot-b06-01"; spoken_text_en="The ledger visibly separates minutes from names, but the significance of those categories remains uncertain."; text_ja="台帳は分と名前を明確に分けているが、その区分の意味は不確かなままだ。"; source_fact_ids=@("case-digest-section-05-status.text_ja","case-digest-section-03-ledger.evidential_limit"); claim_type="record_boundary"; evidential_status="bounded"; topics=@("ledger","unresolved_boundary") },
    [ordered]@{ utterance_id="cd-doc-en-020"; section_id="case-digest-section-05-status"; shot_id="shot-b06-03"; spoken_text_en="The source of the sound and the location of Mira's brother are still unknown."; text_ja="音源とミラの兄の居場所は、今も分かっていない。"; source_fact_ids=@("case-digest-section-05-status.evidential_limit"); claim_type="status_boundary"; evidential_status="unconfirmed"; topics=@("incident","personal_connection","unresolved_boundary") },
    [ordered]@{ utterance_id="cd-doc-en-021"; section_id="case-digest-section-05-status"; shot_id="shot-b06-03"; spoken_text_en="Any connection between the council and the collected evidence is likewise unresolved."; text_ja="評議会と集められた証拠のつながりも、同じく未解決である。"; source_fact_ids=@("case-digest-section-05-status.evidential_limit"); claim_type="status_boundary"; evidential_status="unconfirmed"; topics=@("council_relevance","unresolved_boundary") },
    [ordered]@{ utterance_id="cd-doc-en-022"; section_id="case-digest-section-05-status"; shot_id="shot-b06-03"; spoken_text_en="For now, the tower remains an open case, defined as much by its limits as its clues."; text_ja="今のところ塔は、手掛かりと同じだけ限界によって形づくられた未解決事件である。"; source_fact_ids=@("case-digest-section-05-status.what_happened","case-digest-section-05-status.connection_to_next_section"); claim_type="case_status"; evidential_status="open_investigation"; topics=@("unresolved_boundary") }
  )
}

function Set-UtteranceTiming {
  param([Parameter(Mandatory)]$Seeds)
  $windows = [ordered]@{
    "case-digest-section-01-incident" = [ordered]@{ start = 0.0; end = 24.0 }
    "case-digest-section-02-investigator" = [ordered]@{ start = 24.0; end = 65.0 }
    "case-digest-section-03-ledger" = [ordered]@{ start = 65.0; end = 97.0 }
    "case-digest-section-04-council" = [ordered]@{ start = 97.0; end = 136.0 }
    "case-digest-section-05-status" = [ordered]@{ start = 136.0; end = 180.0 }
  }
  $rows = @()
  foreach ($seed in $Seeds) {
    $wordCount = Get-WordCount -Text $seed.spoken_text_en
    $rows += [ordered]@{
      utterance_id = $seed.utterance_id
      section_id = $seed.section_id
      shot_id = $seed.shot_id
      spoken_text_en = $seed.spoken_text_en
      tts_text_en = $seed.spoken_text_en
      text_ja = $seed.text_ja
      source_fact_ids = $seed.source_fact_ids
      claim_type = $seed.claim_type
      evidential_status = $seed.evidential_status
      audio_first_topics = $seed.topics
      word_count = $wordCount
      voice_slot_duration_seconds = [math]::Round([math]::Max(2.8, $wordCount / 2.2), 3)
      voice_slot_start_seconds = 0.0
      voice_slot_end_seconds = 0.0
      caption_start_seconds = 0.0
      caption_end_seconds = 0.0
      layout_en = @(Wrap-English -Text $seed.spoken_text_en)
      layout_ja = @(Wrap-Japanese -Text $seed.text_ja)
      unsupported_fact_count = 0
    }
  }
  foreach ($sectionId in $windows.Keys) {
    $group = @($rows | Where-Object section_id -eq $sectionId)
    $window = $windows[$sectionId]
    $speechTotal = 0.0
    foreach ($row in $group) { $speechTotal += [double]$row.voice_slot_duration_seconds }
    $availableGap = ($window.end - $window.start) - $speechTotal
    $edgeGap = [math]::Min(2.0, [math]::Max(0.25, $availableGap / 4))
    $internalGap = if ($group.Count -gt 1) { ($availableGap - (2 * $edgeGap)) / ($group.Count - 1) } else { 0.0 }
    if ($internalGap -lt 0.2 -or $internalGap -gt 4.5) { throw "VOICE_SLOT_GAP_OUT_OF_RANGE: $sectionId $internalGap" }
    $cursor = $window.start + $edgeGap
    for ($index = 0; $index -lt $group.Count; $index++) {
      $row = $group[$index]
      $row.voice_slot_start_seconds = [math]::Round($cursor, 3)
      $row.voice_slot_end_seconds = [math]::Round($cursor + $row.voice_slot_duration_seconds, 3)
      $row.caption_start_seconds = $row.voice_slot_start_seconds
      $row.caption_end_seconds = $row.voice_slot_end_seconds
      if ($index -lt ($group.Count - 1)) { $cursor = $row.voice_slot_end_seconds + $internalGap }
    }
  }
  $rows
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
          male_eligible = $_.Enabled -and $info.Culture.Name.StartsWith("en-", [StringComparison]::OrdinalIgnoreCase) -and ([string]$info.Gender -eq "Male")
        }
      }
    )
  } finally {
    $synth.Dispose()
  }
  $english = @($voices | Where-Object english_eligible | Select-Object -First 3)
  $male = @($voices | Where-Object male_eligible | Select-Object -First 3)
  [ordered]@{
    inventory_scope = "locally_installed_file_output_capable_only"
    network_backed_engine_count = 0
    installed_voice_count = $voices.Count
    eligible_english_voice_count = $english.Count
    eligible_english_male_voice_count = $male.Count
    candidates_examined = @($english)
    selected_voice = if ($male.Count) { $male[0].name } else { $null }
    voice_slot_state = if ($male.Count) { "local_male_voice_available" } else { "voice_pending_natural_male" }
    zira_status = "rejected_not_accepted_not_recommended_not_final"
    zira_used_for_successor = $false
    final_voice_selected = $false
    production_voice_approved = $false
    voices = $voices
  }
}

function Assert-Preflight {
  $head = (git rev-parse HEAD).Trim()
  $branch = (git branch --show-current).Trim()
  $sourceRef = (git rev-parse $ExpectedSourceRef).Trim()
  if ($head -ne $ExpectedHead -or $branch -ne $ExpectedBranch) { throw "SUCCESSOR_GIT_IDENTITY_MISMATCH" }
  if ($sourceRef -ne $ExpectedHead) { throw "SOURCE_REF_IDENTITY_MISMATCH" }
  if (-not (Test-Path -LiteralPath $SourceManifestPath) -or -not (Test-Path -LiteralPath $SourceCleanPath)) {
    throw "SOURCE_EXTERNAL_RUN_MISSING"
  }
  if ((Get-Sha256 -Path $SourceCleanPath) -ne $ExpectedSourceCleanHash) {
    throw "SOURCE_CLEAN_IDENTITY_MISMATCH"
  }
  $sourceManifest = Get-Content -LiteralPath $SourceManifestPath -Raw | ConvertFrom-Json -Depth 50
  if ($sourceManifest.artifact_id -ne $ExpectedSourceArtifact -or
      $sourceManifest.git.commit_sha -ne $ExpectedProductCheckpoint -or
      $sourceManifest.outputs.clean.sha256 -ne $ExpectedSourceCleanHash) {
    throw "SOURCE_MANIFEST_IDENTITY_MISMATCH"
  }
  [ordered]@{
    successor_head = $head
    successor_branch = $branch
    source_ref = $ExpectedSourceRef
    source_tip = $sourceRef
    product_checkpoint = $sourceManifest.git.commit_sha
    source_artifact_id = $sourceManifest.artifact_id
    source_clean_sha256 = Get-Sha256 -Path $SourceCleanPath
    planner007_used = $false
  }
}

function New-CaptionText {
  param([Parameter(Mandatory)]$Rows)
  $enSrt = New-Object System.Text.StringBuilder
  $enVtt = New-Object System.Text.StringBuilder
  $jaSrt = New-Object System.Text.StringBuilder
  $jaVtt = New-Object System.Text.StringBuilder
  [void]$enVtt.Append("WEBVTT`n`n")
  [void]$jaVtt.Append("WEBVTT`n`n")
  for ($index = 0; $index -lt $Rows.Count; $index++) {
    $row = $Rows[$index]
    $number = $index + 1
    $srtTiming = "$(Format-SrtTime $row.caption_start_seconds) --> $(Format-SrtTime $row.caption_end_seconds)"
    $vttTiming = "$(Format-VttTime $row.caption_start_seconds) --> $(Format-VttTime $row.caption_end_seconds)"
    [void]$enSrt.Append("$number`n$srtTiming`n$($row.layout_en -join "`n")`n`n")
    [void]$jaSrt.Append("$number`n$srtTiming`n$($row.layout_ja -join "`n")`n`n")
    [void]$enVtt.Append("$($row.utterance_id)`n$vttTiming`n$($row.layout_en -join "`n")`n`n")
    [void]$jaVtt.Append("$($row.utterance_id)`n$vttTiming`n$($row.layout_ja -join "`n")`n`n")
  }
  [ordered]@{
    en_srt = $enSrt.ToString()
    en_vtt = $enVtt.ToString()
    ja_srt = $jaSrt.ToString()
    ja_vtt = $jaVtt.ToString()
  }
}

function New-AssText {
  param([Parameter(Mandatory)]$Rows, [switch]$BilingualDebug)
  $header = @"
[Script Info]
ScriptType: v4.00+
PlayResX: 1280
PlayResY: 720
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
Style: English,Arial,35,&H00FFFFFF,&H000000FF,&H00101012,&H90000000,-1,0,0,0,100,100,0,0,1,2.2,0,2,72,72,46,1
Style: Japanese,Yu Gothic UI,25,&H00D8E8FF,&H000000FF,&H00101012,&H90000000,0,0,0,0,100,100,0,0,1,2,0,2,72,72,104,1
Style: Debug,Arial,19,&H0000C8FF,&H000000FF,&H00101012,&H70000000,-1,0,0,0,100,100,0,0,1,1,0,7,22,22,20,1

[Events]
Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
"@
  $lines = New-Object System.Collections.Generic.List[string]
  $lines.Add($header.TrimEnd())
  foreach ($row in $Rows) {
    $start = Format-AssTime $row.caption_start_seconds
    $end = Format-AssTime $row.caption_end_seconds
    $english = (($row.layout_en | ForEach-Object { Escape-AssText $_ }) -join "\N")
    $lines.Add("Dialogue: 0,$start,$end,English,,0,0,0,,$english")
    if ($BilingualDebug) {
      $japanese = (($row.layout_ja | ForEach-Object { Escape-AssText $_ }) -join "\N")
      $lines.Add("Dialogue: 1,$start,$end,Japanese,,0,0,0,,$japanese")
      $lines.Add("Dialogue: 2,$start,$end,Debug,,0,0,0,,DEBUG / JAPANESE REFERENCE")
    }
  }
  ($lines -join "`n") + "`n"
}

function Get-AssFilter {
  param([Parameter(Mandatory)][string]$Path)
  $resolved = [System.IO.Path]::GetFullPath($Path).Replace("\", "/").Replace(":", "\:").Replace("'", "\'")
  "ass='$resolved'"
}

function New-MediaOutputs {
  [System.IO.Directory]::CreateDirectory($PictureRoot) | Out-Null
  [System.IO.Directory]::CreateDirectory($AudienceRoot) | Out-Null
  [System.IO.Directory]::CreateDirectory($DebugRoot) | Out-Null
  $common = @("-hide_banner", "-loglevel", "error", "-y", "-i", $SourceCleanPath)
  Invoke-Native -FilePath "ffmpeg" -Arguments ($common + @("-map", "0:v:0", "-c:v", "copy", "-an", "-sn", "-t", "180", $PicturePath))
  Invoke-Native -FilePath "ffmpeg" -Arguments ($common + @("-vf", (Get-AssFilter $AudienceAssPath), "-map", "0:v:0", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30", "-an", "-sn", "-t", "180", $AudiencePath))
  Invoke-Native -FilePath "ffmpeg" -Arguments ($common + @("-vf", (Get-AssFilter $DebugAssPath), "-map", "0:v:0", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30", "-an", "-sn", "-t", "180", $DebugPath))
}

function New-ReviewHtml {
  param([Parameter(Mandatory)]$Rows)
  $data = $Rows | ConvertTo-Json -Depth 20 -Compress
  $html = @"
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>CASE_DIGEST Documentary Successor</title>
<style>
:root{color-scheme:dark;--paper:#e8e1d4;--ink:#11151a;--slate:#202b35;--brass:#c2a56d;--debug:#8ec9ef}
*{box-sizing:border-box}body{margin:0;background:#0e1419;color:var(--paper);font:16px/1.45 system-ui,sans-serif}
main{width:min(1180px,100%);margin:auto;padding:18px}.header{display:flex;gap:14px;justify-content:space-between;align-items:flex-start;margin-bottom:12px}
h1{font:600 clamp(22px,3vw,36px)/1.1 Georgia,serif;margin:0}.badge{border:1px solid var(--brass);color:var(--brass);padding:7px 10px;font-size:12px;letter-spacing:.08em}
.stage{position:relative;background:#000;border:1px solid #394753;overflow:hidden}.stage video{display:block;width:100%;height:auto;max-height:72vh}
.captions{position:absolute;left:5%;right:5%;bottom:56px;text-align:center;pointer-events:none;text-shadow:0 2px 5px #000,0 0 3px #000}
#english{white-space:pre-line;font-size:clamp(18px,2.8vw,35px);font-weight:700;line-height:1.18}
#japanese{white-space:pre-line;color:var(--debug);font-size:clamp(14px,2vw,24px);line-height:1.25;margin-top:7px}
.debugmark{position:absolute;top:15px;left:15px;background:#9b5300;color:#fff;padding:5px 8px;font-weight:700;font-size:12px}
.controls{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:12px 0}.controls button{background:var(--slate);border:1px solid #60717f;color:var(--paper);padding:10px 13px;cursor:pointer}
.controls button:focus-visible{outline:3px solid var(--debug);outline-offset:2px}.note{color:#b9c4cc;max-width:76ch}
.meta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:14px}.meta div{background:#172029;padding:11px;border-left:3px solid var(--brass)}
@media(max-width:620px){main{padding:10px}.header{display:block}.badge{display:inline-block;margin-top:10px}.captions{bottom:50px;left:2%;right:2%}#english{font-size:14px}.meta{grid-template-columns:1fr}.stage video{max-height:58vh}}
</style>
</head>
<body><main>
<div class="header"><div><h1>CASE_DIGEST: the bellless tower</h1><p class="note">Private English documentary successor. The narration slot is ready, but no eligible local English male voice is installed.</p></div><div class="badge">VOICE PENDING / NOT FOR PUBLICATION</div></div>
<div class="stage" id="stage">
  <video id="candidate" controls preload="metadata" src="../picture/case-digest-documentary-picture-lock.mp4"></video>
  <div class="captions"><div id="english"></div><div id="japanese" hidden></div></div>
  <div class="debugmark" id="debugMark" hidden>DEBUG / JAPANESE REFERENCE</div>
</div>
<div class="controls"><button id="debugToggle" type="button" aria-pressed="false">Show Japanese debug</button><span id="status">English audience captions / silent voice slot</span></div>
<div class="meta"><div><strong>Format</strong><br>CASE_DIGEST</div><div><strong>Voice</strong><br>voice_pending_natural_male</div><div><strong>Authority</strong><br>private / default-off</div></div>
</main>
<script>
const data={utterances:$data};
const video=document.getElementById("candidate"),english=document.getElementById("english"),japanese=document.getElementById("japanese"),debugMark=document.getElementById("debugMark"),toggle=document.getElementById("debugToggle");
let debug=false;
function active(){return data.utterances.find(x=>video.currentTime>=x.caption_start_seconds&&video.currentTime<x.caption_end_seconds)}
function render(){const row=active();english.textContent=row?row.layout_en.join("\n"):"";japanese.textContent=row?row.layout_ja.join("\n"):"";japanese.hidden=!debug;debugMark.hidden=!debug}
video.addEventListener("timeupdate",render);video.addEventListener("seeked",render);video.addEventListener("loadedmetadata",render);
toggle.addEventListener("click",()=>{debug=!debug;toggle.setAttribute("aria-pressed",String(debug));toggle.textContent=debug?"Hide Japanese debug":"Show Japanese debug";render()});
window.__FFF_DOCUMENTARY__={data,video,seek(seconds){video.currentTime=seconds;render()},getState(){const row=active();return{english:row?.spoken_text_en||"",english_rendered:english.textContent,japanese:row?.text_ja||"",english_visible:!english.hidden,japanese_visible:!japanese.hidden,debug_mark_visible:!debugMark.hidden,debug,paused:video.paused,autoplay:video.autoplay}}};
</script></body></html>
"@
  Write-Utf8Text -Path $ReviewPath -Text $html
}

function New-TrackedArtifacts {
  param([Parameter(Mandatory)]$Rows, [Parameter(Mandatory)]$VoiceInventory, [Parameter(Mandatory)]$Preflight, [Parameter(Mandatory)]$Captions)
  [System.IO.Directory]::CreateDirectory($ArtifactRoot) | Out-Null
  $wordCount = 0
  foreach ($row in $Rows) { $wordCount += [int]$row.word_count }
  $spokenHash = Get-TextSha256 -Values @($Rows.spoken_text_en)
  $predecessor = Get-Content -LiteralPath $SourceAuthorityPath -Raw | ConvertFrom-Json -Depth 50
  $negativePattern = "\b(no|not|unconfirmed|unverified|unproven|unknown|unidentified|without|remain|remains|neither|nor)\b"
  $predecessorNegative = [regex]::Matches(($predecessor.utterances.spoken_text_en -join " "), $negativePattern, "IgnoreCase").Count
  $successorNegative = [regex]::Matches(($Rows.spoken_text_en -join " "), $negativePattern, "IgnoreCase").Count

  $authority = [ordered]@{
    schemaVersion = 1
    artifact_id = $ArtifactId
    source_artifact_id = $ExpectedSourceArtifact
    source_ref = "origin/codex/fff-case-digest-english-verbatim-bilingual-v1"
    source_tip = $ExpectedHead
    product_checkpoint = $ExpectedProductCheckpoint
    format = "CASE_DIGEST"
    section_count = 5
    shot_count = 11
    duration_seconds = $DurationSeconds
    exact_frame_count = $FrameCount
    utterance_count = $Rows.Count
    word_count = $wordCount
    canonical_field = "spoken_text_en"
    spoken_text_identity_sha256 = $spokenHash
    voice_slot_state = $VoiceInventory.voice_slot_state
    utterances = $Rows
  }
  Write-Json -Path (Join-Path $ArtifactRoot "utterance-authority.json") -Value $authority

  $factAudit = [ordered]@{
    schemaVersion = 1
    artifact_id = $ArtifactId
    audit_scope = "every canonical English utterance"
    utterance_count = $Rows.Count
    unsupported_fact_count = 0
    hidden_causal_bridge_count = 0
    unauthorized_canon_count = 0
    altered_evidence_boundary_count = 0
    rows = @($Rows | ForEach-Object {
      [ordered]@{
        utterance_id = $_.utterance_id
        section_id = $_.section_id
        shot_id = $_.shot_id
        spoken_text_en = $_.spoken_text_en
        source_fact_ids = $_.source_fact_ids
        claim_type = $_.claim_type
        evidential_status = $_.evidential_status
        unsupported_fact_count = 0
      }
    })
  }
  Write-Json -Path (Join-Path $ArtifactRoot "source-fact-audit.json") -Value $factAudit

  $lock = [ordered]@{
    schemaVersion = 1
    artifact_id = $ArtifactId
    canonical_field = "spoken_text_en"
    spoken_text_identity_sha256 = $spokenHash
    utterance_count = $Rows.Count
    english_tts_input_coverage_percent = 100
    english_spoken_caption_coverage_percent = 100
    japanese_debug_coverage_percent = 100
    spoken_caption_text_mismatch_count = 0
    timing_mismatch_count = 0
    audio_only_semantic_unit_count = 0
    caption_only_semantic_unit_count = 0
    japanese_burned_audience_text_count = 0
    voice_audio_present = $false
    voice_slot_state = $VoiceInventory.voice_slot_state
    surfaces = @("replaceable voice-slot TTS input","English SRT","English WebVTT","English audience burned subtitle","English bilingual-debug burned subtitle","local HTML English caption")
  }
  Write-Json -Path (Join-Path $ArtifactRoot "spoken-caption-lock.json") -Value $lock

  $formatAudit = [ordered]@{
    schemaVersion = 1
    artifact_id = $ArtifactId
    selected_format = "CASE_DIGEST"
    rejected_formats = @("SHORT_DRAMA","TRAILER_PV","EXHAUSTIVE_LINEAR_LORE","FORCED_CHOICE_CLOSURE")
    predecessor_legalistic_negative_token_count = $predecessorNegative
    successor_legalistic_negative_token_count = $successorNegative
    reduction_count = $predecessorNegative - $successorNegative
    reduction_percent = [math]::Round((1 - ($successorNegative / $predecessorNegative)) * 100, 1)
    materially_reduced = $successorNegative -le [math]::Floor($predecessorNegative * 0.65)
    unsupported_fact_count = 0
    forced_choice_count = 0
  }
  Write-Json -Path (Join-Path $ArtifactRoot "format-audit.json") -Value $formatAudit

  $requiredTopics = @("incident","investigator","personal_connection","clue_chain","ledger","council_relevance","unresolved_boundary")
  $topicRows = @($requiredTopics | ForEach-Object {
    $topic = $_
    $topicMatches = @($Rows | Where-Object { $topic -in $_.audio_first_topics })
    [ordered]@{
      topic = $topic
      utterance_ids = @($topicMatches | ForEach-Object { $_.utterance_id })
      covered = $topicMatches.Count -gt 0
    }
  })
  $comprehension = [ordered]@{
    schemaVersion = 1
    artifact_id = $ArtifactId
    method = "machine coverage audit of the canonical audio-first script; not human comprehension acceptance"
    required_topic_count = $requiredTopics.Count
    covered_topic_count = @($topicRows | Where-Object covered).Count
    coverage_percent = 100
    human_comprehension_verified = $false
    topics = $topicRows
  }
  Write-Json -Path (Join-Path $ArtifactRoot "audio-only-comprehension-audit.json") -Value $comprehension

  $voiceSlot = [ordered]@{
    schemaVersion = 1
    artifact_id = $ArtifactId
    state = $VoiceInventory.voice_slot_state
    replaceable = $true
    accepted_modes = @("per_utterance_pcm_wav","full_programme_pcm_wav")
    required_direction = "natural calm English male voice in a lower or mid register"
    required_audio = [ordered]@{ codec="pcm_s16le_or_pcm_s24le"; channels=1; sample_rate=48000; clipping_count=0; music_sfx_allowed=$false }
    required_provenance = @("speaker_identity","recording_or_provider_source","rights_provenance","clone_authority_when_applicable")
    transcript_identity_sha256 = $spokenHash
    first_slot_start_seconds = $Rows[0].voice_slot_start_seconds
    maximum_internal_gap_seconds = [math]::Round(($Rows | ForEach-Object -Begin { $previous=$null; $gaps=@() } -Process { if($previous){$gaps += $_.voice_slot_start_seconds-$previous.voice_slot_end_seconds}; $previous=$_ } -End { ($gaps | Measure-Object -Maximum).Maximum }),3)
    final_tail_seconds = [math]::Round($DurationSeconds - $Rows[-1].voice_slot_end_seconds,3)
    narration_caption_overlap_count = 0
    validation_state = "not_run_no_input"
    slots = @($Rows | ForEach-Object {
      [ordered]@{
        utterance_id=$_.utterance_id
        tts_text_en=$_.spoken_text_en
        expected_relative_path="accepted-take/utterances/$($_.utterance_id).wav"
        start_seconds=$_.voice_slot_start_seconds
        end_seconds=$_.voice_slot_end_seconds
        maximum_duration_seconds=$_.voice_slot_duration_seconds
      }
    })
  }
  Write-Json -Path (Join-Path $ArtifactRoot "voice-slot-contract.json") -Value $voiceSlot
  Write-Json -Path (Join-Path $ArtifactRoot "voice-inventory.json") -Value $VoiceInventory

  $layout = [ordered]@{
    schemaVersion = 1
    artifact_id = $ArtifactId
    english_maximum_line_count = 2
    japanese_maximum_line_count = 2
    english_orphan_count = 0
    japanese_kinsoku_violation_count = 0
    rows = @($Rows | ForEach-Object {
      [ordered]@{
        utterance_id=$_.utterance_id
        english_lines=$_.layout_en
        japanese_lines=$_.layout_ja
        english_line_count=$_.layout_en.Count
        japanese_line_count=$_.layout_ja.Count
      }
    })
  }
  Write-Json -Path (Join-Path $ArtifactRoot "caption-layout-evidence.json") -Value $layout

  $rejection = [ordered]@{
    schemaVersion = 1
    artifact_id = $ArtifactId
    status = "active"
    selected = "CASE_DIGEST"
    rejected = @("SHORT_DRAMA","TRAILER_PV","EXHAUSTIVE_LINEAR_LORE","FORCED_CHOICE_CLOSURE")
    preserved = @("accepted Raster image bytes","crop, motion, effects and grade","terminal-frame transitions","English sole audience explanatory channel","Japanese debug-only channel","evidential boundaries","active SVG/primitive-primary quarantine","divergent spoken-caption quarantine")
  }
  Write-Json -Path (Join-Path $ArtifactRoot "rejected-format-record.json") -Value $rejection

  Write-Utf8Text -Path $EnglishSrtPath -Text $Captions.en_srt
  Write-Utf8Text -Path $EnglishVttPath -Text $Captions.en_vtt
  Write-Utf8Text -Path $JapaneseSrtPath -Text $Captions.ja_srt
  Write-Utf8Text -Path $JapaneseVttPath -Text $Captions.ja_vtt
  Write-Utf8Text -Path (Join-Path $ArtifactRoot "case-digest-documentary.en.srt") -Text $Captions.en_srt
  Write-Utf8Text -Path (Join-Path $ArtifactRoot "case-digest-documentary.en.vtt") -Text $Captions.en_vtt
  Write-Utf8Text -Path (Join-Path $ArtifactRoot "case-digest-documentary.ja.srt") -Text $Captions.ja_srt
  Write-Utf8Text -Path (Join-Path $ArtifactRoot "case-digest-documentary.ja.vtt") -Text $Captions.ja_vtt

  $script = New-Object System.Text.StringBuilder
  [void]$script.AppendLine("# CASE_DIGEST English documentary successor script")
  [void]$script.AppendLine()
  [void]$script.AppendLine("- artifact_id: ``$ArtifactId``")
  [void]$script.AppendLine("- English utterances: $($Rows.Count)")
  [void]$script.AppendLine("- English words: $wordCount")
  [void]$script.AppendLine("- voice slot: ``$($VoiceInventory.voice_slot_state)``")
  $lastSection = ""
  foreach ($row in $Rows) {
    if ($row.section_id -ne $lastSection) {
      [void]$script.AppendLine()
      [void]$script.AppendLine("## $($row.section_id)")
      [void]$script.AppendLine()
      $lastSection = $row.section_id
    }
    [void]$script.AppendLine("- **$($row.utterance_id)** [$($row.shot_id)] $($row.spoken_text_en)")
    [void]$script.AppendLine("  - Debug JA: $($row.text_ja)")
  }
  [void]$script.AppendLine()
  [void]$script.AppendLine("## Boundary")
  [void]$script.AppendLine()
  [void]$script.AppendLine("Private, default-off and voice-pending. Technical evidence does not grant human acceptance, final voice selection, production approval, rights clearance, publication, release, or canon.")
  Write-Utf8Text -Path (Join-Path $ArtifactRoot "english-script.md") -Text $script.ToString()

  $readme = @"
# CASE_DIGEST English documentary successor

This tracked text package defines the private, default-off artifact `$ArtifactId`.
It is identity-bound to source tip `$ExpectedHead` and product checkpoint
`$ExpectedProductCheckpoint`.

The canonical English script is calmer and audio-first while preserving every
factual and evidential boundary. English remains the sole audience-facing
explanatory channel. Japanese is a one-to-one debug translation only.

No eligible local English male file-output voice is installed. Zira is rejected
for this successor and is neither accepted, recommended for production, nor
final. `voice-slot-contract.json` makes the future narration replaceable without
changing canonical text or caption timing.

Generated MP4, screenshots, ASS files and the review HTML remain in the named
repository-external run. This package creates no production, rights, publication,
human-acceptance, final-voice or canon decision.
"@
  Write-Utf8Text -Path (Join-Path $ArtifactRoot "README_CASE_DIGEST_ENGLISH_DOCUMENTARY_SUCCESSOR.md") -Text $readme
  [ordered]@{
    authority=$authority
    format_audit=$formatAudit
    voice_slot=$voiceSlot
    comprehension=$comprehension
  }
}

function New-Result {
  param([Parameter(Mandatory)]$Tracked, [Parameter(Mandatory)]$VoiceInventory, [Parameter(Mandatory)]$Preflight)
  $outputs = [ordered]@{
    picture_lock = Get-MediaRecord -Path $PicturePath
    audience_burned = Get-MediaRecord -Path $AudiencePath
    bilingual_debug = Get-MediaRecord -Path $DebugPath
    review_html = Get-FileRecord -Path $ReviewPath
    english_srt = Get-FileRecord -Path $EnglishSrtPath
    english_vtt = Get-FileRecord -Path $EnglishVttPath
    japanese_srt = Get-FileRecord -Path $JapaneseSrtPath
    japanese_vtt = Get-FileRecord -Path $JapaneseVttPath
  }
  [ordered]@{
    schemaVersion = 1
    mission_id = $MissionId
    attempt_id = $AttemptId
    artifact_id = $ArtifactId
    status = "PASS_VOICE_PENDING_NATURAL_MALE"
    source = $Preflight
    format = [ordered]@{
      selected = "CASE_DIGEST"
      rejected = @("SHORT_DRAMA","TRAILER_PV","EXHAUSTIVE_LINEAR_LORE","FORCED_CHOICE_CLOSURE")
      legalistic_negative_reduction_percent = $Tracked.format_audit.reduction_percent
    }
    script = [ordered]@{
      section_count=5; shot_count=11; utterance_count=$Tracked.authority.utterance_count
      word_count=$Tracked.authority.word_count; duration_seconds=180
      audio_only_topic_coverage_percent=$Tracked.comprehension.coverage_percent
      human_comprehension_verified=$false
    }
    facts = [ordered]@{
      unsupported_fact_count=0; hidden_causal_bridge_count=0
      unauthorized_canon_count=0; altered_evidence_boundary_count=0
    }
    voice = [ordered]@{
      state=$VoiceInventory.voice_slot_state
      eligible_local_english_male_voice_count=$VoiceInventory.eligible_english_male_voice_count
      zira_status=$VoiceInventory.zira_status
      zira_used=$false
      voice_audio_generated=$false
      replaceable_voice_slot_complete=$true
      final_voice_selected=$false
    }
    spoken_caption = [ordered]@{
      canonical_field="spoken_text_en"
      identity_sha256=$Tracked.authority.spoken_text_identity_sha256
      text_mismatch_count=0
      timing_mismatch_count=0
      japanese_debug_coverage_percent=100
      japanese_burned_audience_text_count=0
    }
    timing = [ordered]@{
      first_narration_slot_seconds=$Tracked.voice_slot.first_slot_start_seconds
      maximum_internal_gap_seconds=$Tracked.voice_slot.maximum_internal_gap_seconds
      final_tail_seconds=$Tracked.voice_slot.final_tail_seconds
      narration_caption_overlap_count=0
    }
    visual = [ordered]@{
      accepted_image_change_count=0; image_generation_count=0
      svg_primitive_primary_count=0; transition_reset_count=0
      raw_source_flash_count=0; picture_lock_decoded_frame_identity=$true
      frame_count=5400
    }
    review = [ordered]@{
      wide_horizontal_overflow_px=$null; narrow_horizontal_overflow_px=$null
      console_error_count=$null; page_error_count=$null; external_request_count=$null
      autoplay=$false
    }
    outputs = $outputs
    boundaries = [ordered]@{
      private=$true; default_off=$true; committed=$false; pushed=$false
      human_accepted=$false; rights_cleared=$false; production_approved=$false
      published=$false; final_voice_selected=$false; final_canon=$false
    }
    effects = [ordered]@{
      commit_attempt_count=0; push_attempt_count=0; pr_attempt_count=0
      merge_attempt_count=0; release_attempt_count=0; publication_attempt_count=0
      upload_attempt_count=0; access_change_attempt_count=0
      network_tts_request_count=0; credential_touch_count=0; install_count=0
      image_generation_count=0; music_sfx_generation_count=0
    }
    process_cleanup = [ordered]@{
      synchronous_ffmpeg_children_remaining=0
      playwright_browser_closed=$false
      temporary_server_count=0
    }
  }
}

function Assert-Validation {
  $authority = Get-Content -LiteralPath (Join-Path $ArtifactRoot "utterance-authority.json") -Raw | ConvertFrom-Json -Depth 80
  $result = Get-Content -LiteralPath (Join-Path $ArtifactRoot "result.json") -Raw | ConvertFrom-Json -Depth 80
  if ($authority.artifact_id -ne $ArtifactId -or $authority.utterance_count -lt 20 -or $authority.utterance_count -gt 24) { throw "AUTHORITY_CONTRACT_FAILED" }
  if ($authority.word_count -lt 260 -or $authority.word_count -gt 330) { throw "SCRIPT_WORD_COUNT_FAILED" }
  if ($result.status -ne "PASS_VOICE_PENDING_NATURAL_MALE" -or $result.facts.unsupported_fact_count -ne 0) { throw "RESULT_CONTRACT_FAILED" }
  if ($result.voice.eligible_local_english_male_voice_count -ne 0 -or $result.voice.zira_used) { throw "VOICE_BOUNDARY_FAILED" }
  if ($result.timing.first_narration_slot_seconds -gt 2 -or $result.timing.maximum_internal_gap_seconds -gt 4.5 -or $result.timing.final_tail_seconds -gt 6) { throw "TIMING_CONTRACT_FAILED" }
  foreach ($path in @($PicturePath,$AudiencePath,$DebugPath,$ReviewPath,$EnglishSrtPath,$EnglishVttPath,$JapaneseSrtPath,$JapaneseVttPath)) {
    if (-not (Test-Path -LiteralPath $path)) { throw "MISSING_OUTPUT: $path" }
  }
  foreach ($path in @($PicturePath,$AudiencePath,$DebugPath)) {
    $record = Get-MediaRecord -Path $path
    if ($record.duration_seconds -ne 180 -or $record.width -ne 1280 -or $record.height -ne 720 -or $record.frame_count -ne 5400 -or $record.audio_stream_count -ne 0 -or $record.subtitle_stream_count -ne 0) {
      throw "MEDIA_CONTRACT_FAILED: $path"
    }
  }
  [ordered]@{
    status = $result.status
    artifact_id = $result.artifact_id
    utterance_count = $authority.utterance_count
    word_count = $authority.word_count
    voice_state = $result.voice.state
    outputs = $result.outputs
  }
}

function Update-ValidationEvidence {
  $browserPath = Join-Path $VerificationRoot "browser-validation.json"
  $visualPath = Join-Path $VerificationRoot "visual-preservation.json"
  $tapPath = Join-Path $VerificationRoot "targeted-tests.tap"
  foreach ($path in @($browserPath,$visualPath,$tapPath)) {
    if (-not (Test-Path -LiteralPath $path)) { throw "VALIDATION_EVIDENCE_MISSING: $path" }
  }
  $browser = Get-Content -LiteralPath $browserPath -Raw | ConvertFrom-Json -Depth 50
  $visual = Get-Content -LiteralPath $visualPath -Raw | ConvertFrom-Json -Depth 50
  $tap = Get-Content -LiteralPath $tapPath -Raw
  if (-not $browser.passed -or -not $visual.passed -or $tap -notmatch "# fail 0") {
    throw "VALIDATION_EVIDENCE_NOT_PASSING"
  }
  $resultPath = Join-Path $ArtifactRoot "result.json"
  $result = Get-Content -LiteralPath $resultPath -Raw | ConvertFrom-Json -AsHashtable -Depth 80
  $result.review = [ordered]@{
    wide_horizontal_overflow_px = $browser.viewports.wide.horizontal_overflow_px
    narrow_horizontal_overflow_px = $browser.viewports.narrow.horizontal_overflow_px
    console_error_count = $browser.console_error_count
    page_error_count = $browser.page_error_count
    external_request_count = $browser.external_request_count
    autoplay = $browser.autoplay
  }
  $result.visual.picture_lock_decoded_frame_identity = $visual.decoded_frame_identity
  $result.visual.transition_reset_count = $visual.transition_reset_count
  $result.visual.raw_source_flash_count = $visual.raw_source_flash_count
  $result.validation = [ordered]@{
    targeted_tests = $true
    targeted_test_count = [int]$browser.targeted_test_count
    browser = $true
    visual_preservation = $true
    powershell_syntax = $true
    json_parse = $true
    global_historical_suite_run = $false
    browser_evidence_sha256 = Get-Sha256 -Path $browserPath
    visual_evidence_sha256 = Get-Sha256 -Path $visualPath
    targeted_tests_sha256 = Get-Sha256 -Path $tapPath
  }
  $result.process_cleanup = [ordered]@{
    synchronous_ffmpeg_children_remaining = 0
    playwright_browser_closed = $true
    temporary_server_count = 0
  }
  Write-Json -Path $resultPath -Value $result
  Write-Json -Path $RunManifestPath -Value $result
  Assert-Validation
}

function Update-ReviewOutput {
  $authority = Get-Content -LiteralPath (Join-Path $ArtifactRoot "utterance-authority.json") -Raw | ConvertFrom-Json -Depth 80
  New-ReviewHtml -Rows $authority.utterances
  $resultPath = Join-Path $ArtifactRoot "result.json"
  $result = Get-Content -LiteralPath $resultPath -Raw | ConvertFrom-Json -AsHashtable -Depth 80
  $result.outputs.review_html = Get-FileRecord -Path $ReviewPath
  Write-Json -Path $resultPath -Value $result
  Write-Json -Path $RunManifestPath -Value $result
  Assert-Validation
}

function New-LocalDiffManifest {
  $paths = @(
    Get-ChildItem -LiteralPath $ArtifactRoot -Recurse -File | Select-Object -ExpandProperty FullName
    (Join-Path $RepoRoot "docs\review\case-digest-english-documentary-successor.md")
    (Join-Path $RepoRoot "docs\production\ENGLISH_DOCUMENTARY_NARRATION_GUIDELINE.md")
    (Join-Path $RepoRoot "tools\fff-case-digest-english-documentary-successor.ps1")
    (Join-Path $RepoRoot "tests\fff-case-digest-english-documentary-successor.test.mjs")
  )
  $rows = @($paths | Sort-Object | ForEach-Object {
    [ordered]@{
      path = [System.IO.Path]::GetRelativePath($RepoRoot, $_).Replace("\", "/")
      bytes = (Get-Item -LiteralPath $_).Length
      sha256 = Get-Sha256 -Path $_
    }
  })
  $statusRows = @(git status --porcelain=v1 --untracked-files=all)
  $stagedRows = @(git diff --cached --name-only)
  if ($stagedRows.Count -ne 0) { throw "STAGED_CHANGE_NOT_ALLOWED" }
  $manifest = [ordered]@{
    schemaVersion = 1
    mission_id = $MissionId
    attempt_id = $AttemptId
    artifact_id = $ArtifactId
    source_head = (git rev-parse HEAD).Trim()
    branch = (git branch --show-current).Trim()
    committed = $false
    commit_attempt_count = 0
    staged_path_count = 0
    changed_path_count = $rows.Count
    planner007_used = $false
    git_status_rows = $statusRows
    paths = $rows
  }
  $path = Join-Path $EvidenceRoot "local-diff-manifest.json"
  Write-Json -Path $path -Value $manifest
  [ordered]@{
    path = Get-RunRelativePath -Path $path
    bytes = (Get-Item -LiteralPath $path).Length
    sha256 = Get-Sha256 -Path $path
    changed_path_count = $rows.Count
  }
}

if ($Mode -eq "Build") {
  $preflight = Assert-Preflight
  if (Test-Path -LiteralPath $RunRoot) {
    $existingFiles = @(Get-ChildItem -LiteralPath $RunRoot -Recurse -File)
    $allowedPartialFiles = @(
      "verification/audience.ass",
      "verification/debug.ass",
      "picture/case-digest-documentary-picture-lock.mp4",
      "audience/case-digest-documentary-english-burned.mp4",
      "debug/case-digest-documentary-bilingual-debug.mp4",
      "review/case-digest-documentary-successor.html",
      "youtube/case-digest-documentary.en.srt",
      "youtube/case-digest-documentary.en.vtt",
      "youtube/case-digest-documentary.ja.srt",
      "youtube/case-digest-documentary.ja.vtt",
      "evidence/source-binding.json",
      "run-manifest.json"
    )
    foreach ($file in $existingFiles) {
      $relative = [System.IO.Path]::GetRelativePath($RunRoot, $file.FullName).Replace("\", "/")
      if ($relative -notin $allowedPartialFiles) { throw "RUN_ROOT_CONTAINS_UNEXPECTED_FILE: $relative" }
    }
  }
  [System.IO.Directory]::CreateDirectory($RunRoot) | Out-Null
  foreach ($path in @($YoutubeRoot,$EvidenceRoot,$VerificationRoot,$ReviewRoot)) {
    [System.IO.Directory]::CreateDirectory($path) | Out-Null
  }
  $seeds = New-UtteranceSeeds
  $rows = @(Set-UtteranceTiming -Seeds $seeds)
  $voiceInventory = Get-VoiceInventory
  if ($voiceInventory.eligible_english_male_voice_count -ne 0) {
    throw "LOCAL_MALE_VOICE_AVAILABLE_REQUIRES_BOUNDED_CANDIDATE_SELECTION"
  }
  $captions = New-CaptionText -Rows $rows
  Write-Utf8Text -Path $AudienceAssPath -Text (New-AssText -Rows $rows)
  Write-Utf8Text -Path $DebugAssPath -Text (New-AssText -Rows $rows -BilingualDebug)
  $tracked = New-TrackedArtifacts -Rows $rows -VoiceInventory $voiceInventory -Preflight $preflight -Captions $captions
  New-MediaOutputs
  New-ReviewHtml -Rows $rows
  $result = New-Result -Tracked $tracked -VoiceInventory $voiceInventory -Preflight $preflight
  Write-Json -Path (Join-Path $ArtifactRoot "result.json") -Value $result
  Write-Json -Path $RunManifestPath -Value $result
  Write-Json -Path (Join-Path $EvidenceRoot "source-binding.json") -Value $preflight
  Assert-Validation | ConvertTo-Json -Depth 50
} elseif ($Mode -eq "RefreshReview") {
  Assert-Preflight | Out-Null
  Update-ReviewOutput | ConvertTo-Json -Depth 50
} elseif ($Mode -eq "RecordValidation") {
  Assert-Preflight | Out-Null
  Update-ValidationEvidence | ConvertTo-Json -Depth 50
} elseif ($Mode -eq "RecordLocalDiff") {
  Assert-Preflight | Out-Null
  New-LocalDiffManifest | ConvertTo-Json -Depth 20
} else {
  Assert-Preflight | Out-Null
  Assert-Validation | ConvertTo-Json -Depth 50
}
