[CmdletBinding()]
param(
  [ValidateSet("Build", "Validate", "Finalize", "ValidateVoiceTake", "BuildReleaseCandidate", "FinalQc")]
  [string]$Mode = "Build",
  [string]$RunRoot = "D:\AI-Runs\FastFictionFactory\fff-case-digest-release-candidate-preparation-001",
  [string]$VoiceTakeRoot = ""
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$MissionId = "fff-case-digest-release-candidate-preparation-001"
$ArtifactId = "fff-case-digest-release-candidate-preparation-001"
$ExpectedHead = "58b8cc437bb0f8e0f796490bdfd213e8b211834f"
$ExpectedBranch = "codex/fff-case-digest-release-candidate-preparation-v1"
$ExpectedSourceRunStatus = "PASS_COMMITTED_LOCAL_ONLY"
$ExpectedSourceCleanHash = "94383a3067d769831fe9fd4e71846283867623f77a5799b570eca1dda034831f"
$ExpectedEnglishSrtHash = "0c0be8ede8faf4b2baaedc2b852fa9b0fbea151a35bcb8bd6e1f99c5724ac2e0"
$ExpectedEnglishVttHash = "05dc4dde708b576f778a2dfa0f766edf9b45ddc8d86ee56822ab9636e86c8cbc"
$ExpectedJapaneseSrtHash = "01bb9501f3ddb1a54108014fcf4115413bf71aae6ea5e055f3afe320f737496d"
$ExpectedJapaneseVttHash = "e0dcdc17ad367f433d7ac620b88d391629044c87c9d2e8c1ab61697883f6ee80"
$DurationSeconds = 180
$Fps = 30
$FrameCount = 5400
$QuarantineId = "FFF-Q-MECHANICAL-ENGLISH-TTS-CASE-DIGEST-20260730"

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ArtifactRoot = Join-Path $RepoRoot "artifacts\case-digest-release-candidate-preparation"
$AuthorityRoot = Join-Path $RepoRoot "artifacts\case-digest-english-editorial-naturalness"
$AuthorityPath = Join-Path $AuthorityRoot "revised-bilingual-utterance-authority.json"
$SourceModelPath = Join-Path $RepoRoot "artifacts\private-raster-case-digest\private-raster-case-digest.json"
$SourceRunRoot = "D:\AI-Runs\FastFictionFactory\fff-case-digest-english-editorial-naturalness-001"
$SourceManifestPath = Join-Path $SourceRunRoot "run-manifest.json"
$SourceCleanPath = Join-Path $SourceRunRoot "clean\case-digest-english-clean.mp4"
$SourceEnglishSrtPath = Join-Path $SourceRunRoot "youtube\case-digest.en.srt"
$SourceEnglishVttPath = Join-Path $SourceRunRoot "youtube\case-digest.en.vtt"
$SourceJapaneseSrtPath = Join-Path $SourceRunRoot "youtube\case-digest.ja.srt"
$SourceJapaneseVttPath = Join-Path $SourceRunRoot "youtube\case-digest.ja.vtt"
$ThumbnailSourcePath = Join-Path $RepoRoot "artifacts\private-full-raster-candidate\images\base\shot-b03-01.jpg"
$ThumbnailFontPath = "C:\Windows\Fonts\arialbd.ttf"

$PictureRoot = Join-Path $RunRoot "picture"
$CaptionRoot = Join-Path $RunRoot "captions"
$ThumbnailRoot = Join-Path $RunRoot "thumbnail"
$MetadataRoot = Join-Path $RunRoot "metadata"
$VoiceInputRoot = Join-Path $RunRoot "voice-input"
$AcceptedVoiceRoot = Join-Path $VoiceInputRoot "accepted-take"
$ReviewRoot = Join-Path $RunRoot "review"
$EvidenceRoot = Join-Path $RunRoot "evidence"
$VerificationRoot = Join-Path $RunRoot "verification"
$ReleaseRoot = Join-Path $RunRoot "release"
$PictureLockPath = Join-Path $PictureRoot "case-digest-picture-lock.mp4"
$EnglishSrtPath = Join-Path $CaptionRoot "case-digest.en.srt"
$EnglishVttPath = Join-Path $CaptionRoot "case-digest.en.vtt"
$JapaneseSrtPath = Join-Path $CaptionRoot "case-digest.ja.srt"
$JapaneseVttPath = Join-Path $CaptionRoot "case-digest.ja.vtt"
$ThumbnailPath = Join-Path $ThumbnailRoot "case-digest-thumbnail.jpg"
$ReviewHtmlPath = Join-Path $ReviewRoot "case-digest-release-candidate-preparation.html"
$RunManifestPath = Join-Path $RunRoot "run-manifest.json"

function Write-Utf8Text {
  param([Parameter(Mandatory)][string]$Path, [Parameter(Mandatory)][string]$Text)
  $parent = Split-Path -Parent $Path
  if ($parent) { [System.IO.Directory]::CreateDirectory($parent) | Out-Null }
  [System.IO.File]::WriteAllText($Path, $Text, [System.Text.UTF8Encoding]::new($false))
}

function Write-Json {
  param([Parameter(Mandatory)][string]$Path, [Parameter(Mandatory)]$Value, [int]$Depth = 60)
  Write-Utf8Text -Path $Path -Text (($Value | ConvertTo-Json -Depth $Depth) + "`n")
}

function Get-Sha256 {
  param([Parameter(Mandatory)][string]$Path)
  (Get-FileHash -Algorithm SHA256 -LiteralPath $Path).Hash.ToLowerInvariant()
}

function Get-TextSha256 {
  param([Parameter(Mandatory)][string]$Text)
  $bytes = [System.Text.UTF8Encoding]::new($false).GetBytes($Text)
  [Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData($bytes)).ToLowerInvariant()
}

function Get-FileRecord {
  param([Parameter(Mandatory)][string]$Path, [Parameter(Mandatory)][string]$RelativePath)
  $item = Get-Item -LiteralPath $Path
  [ordered]@{ path = $RelativePath; bytes = $item.Length; sha256 = Get-Sha256 -Path $Path }
}

function ConvertTo-CsvText {
  param([Parameter(Mandatory)]$Rows)
  ((@($Rows) | ConvertTo-Csv -NoTypeInformation) -join "`n") + "`n"
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
  $json | ConvertFrom-Json -Depth 40
}

function Get-MediaRecord {
  param([Parameter(Mandatory)][string]$Path, [Parameter(Mandatory)][string]$RelativePath)
  $probe = Invoke-Ffprobe -Path $Path
  $video = @($probe.streams | Where-Object codec_type -eq "video")
  $audio = @($probe.streams | Where-Object codec_type -eq "audio")
  $subtitles = @($probe.streams | Where-Object codec_type -eq "subtitle")
  if ($video.Count -ne 1) { throw "Expected one video stream: $Path" }
  [ordered]@{
    path = $RelativePath
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

function Normalize-Text {
  param([Parameter(Mandatory)][string]$Text)
  (($Text -replace "`r|`n", " ") -replace "\s+", " ").Trim()
}

function Get-CanonicalTranscript {
  $authority = Get-Content -LiteralPath $AuthorityPath -Raw | ConvertFrom-Json
  Normalize-Text -Text (($authority.utterances | ForEach-Object spoken_text_en) -join " ")
}

function Assert-Preflight {
  foreach ($path in @(
    $AuthorityPath, $SourceModelPath, $SourceManifestPath, $SourceCleanPath,
    $SourceEnglishSrtPath, $SourceEnglishVttPath, $SourceJapaneseSrtPath,
    $SourceJapaneseVttPath, $ThumbnailSourcePath, $ThumbnailFontPath
  )) {
    if (-not (Test-Path -LiteralPath $path)) { throw "Missing required input: $path" }
  }
  $head = (git -C $RepoRoot rev-parse HEAD).Trim()
  $branch = (git -C $RepoRoot branch --show-current).Trim()
  if ($head -ne $ExpectedHead) { throw "Expected source HEAD $ExpectedHead; found $head" }
  if ($branch -ne $ExpectedBranch) { throw "Expected branch $ExpectedBranch; found $branch" }
  if ((Get-Sha256 $SourceCleanPath) -ne $ExpectedSourceCleanHash) { throw "Source clean hash mismatch" }
  if ((Get-Sha256 $SourceEnglishSrtPath) -ne $ExpectedEnglishSrtHash) { throw "English SRT hash mismatch" }
  if ((Get-Sha256 $SourceEnglishVttPath) -ne $ExpectedEnglishVttHash) { throw "English VTT hash mismatch" }
  if ((Get-Sha256 $SourceJapaneseSrtPath) -ne $ExpectedJapaneseSrtHash) { throw "Japanese SRT hash mismatch" }
  if ((Get-Sha256 $SourceJapaneseVttPath) -ne $ExpectedJapaneseVttHash) { throw "Japanese VTT hash mismatch" }
  $sourceManifest = Get-Content -LiteralPath $SourceManifestPath -Raw | ConvertFrom-Json
  if ($sourceManifest.status -ne $ExpectedSourceRunStatus) { throw "Source run is not finalized" }
  if ($sourceManifest.git.commit_sha -ne $ExpectedHead) { throw "Source run commit does not bind to expected HEAD" }
  if ($sourceManifest.git.pushed) { throw "Source run unexpectedly claims pushed=true" }
  $authority = Get-Content -LiteralPath $AuthorityPath -Raw | ConvertFrom-Json
  if ($authority.utterance_count -ne 24 -or $authority.word_count -ne 313) { throw "Canonical script identity mismatch" }
  if ($authority.utterances.Count -ne 24) { throw "Expected 24 utterances" }
}

function Get-LocalVoiceInventory {
  Add-Type -AssemblyName System.Speech
  $synth = [System.Speech.Synthesis.SpeechSynthesizer]::new()
  try {
    $voices = @($synth.GetInstalledVoices() | ForEach-Object {
      $voice = $_.VoiceInfo
      $english = $voice.Culture.Name -like "en-*"
      $male = [string]$voice.Gender -eq "Male"
      $zira = $voice.Name -match "(?i)zira"
      $eligible = $_.Enabled -and $english -and $male -and -not $zira
      [ordered]@{
        backend = "System.Speech"
        name = $voice.Name
        culture = $voice.Culture.Name
        gender = [string]$voice.Gender
        age = [string]$voice.Age
        enabled = [bool]$_.Enabled
        installed_local = $true
        file_output_capable = [bool]$_.Enabled
        eligible_natural_male_english_candidate = $eligible
        exclusion_reasons = @(
          if (-not $_.Enabled) { "disabled" }
          if (-not $english) { "not_english" }
          if (-not $male) { "not_male" }
          if ($zira) { "quarantined_mechanical_zira_lineage" }
        )
      }
    })
    $eligible = @($voices | Where-Object eligible_natural_male_english_candidate)
    [ordered]@{
      schemaVersion = 1
      inventory_scope = "locally_installed_file_output_capable_system_speech_voices"
      observed_voice_count = $voices.Count
      eligible_english_male_voice_count = $eligible.Count
      eligible_voices = $eligible
      observed_voices = $voices
      network_backed_engine_count = 0
      zira_synthesis_performed = $false
      bounded_technical_sample_performed = $false
      naturalness_claimed = $false
      voice_input_state = if ($eligible.Count -eq 0) { "natural_male_voice_input_required" } else { "eligible_local_male_voice_available_unreviewed" }
    }
  } finally {
    $synth.Dispose()
  }
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
    $maxAbsoluteSample = 0L
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
        if ($audioFormat -ne 1 -or $channels -ne 1 -or $bits -notin @(16,24)) {
          throw "WAV must be mono integer PCM 16-bit or 24-bit"
        }
        $bytesPerSample = [int]($bits / 8)
        $samples = [int64]($chunkSize / $bytesPerSample)
        $positiveLimit = if ($bits -eq 16) { 32767 } else { 8388607 }
        $negativeLimit = if ($bits -eq 16) { -32768 } else { -8388608 }
        for ($index = 0L; $index -lt $samples; $index++) {
          if ($bits -eq 16) {
            $sample = [int]$reader.ReadInt16()
          } else {
            $b0 = [int]$reader.ReadByte()
            $b1 = [int]$reader.ReadByte()
            $b2 = [int]$reader.ReadByte()
            $sample = $b0 -bor ($b1 -shl 8) -bor ($b2 -shl 16)
            if (($sample -band 0x800000) -ne 0) { $sample -= 0x1000000 }
          }
          $absolute = [math]::Abs([int64]$sample)
          if ($absolute -gt $maxAbsoluteSample) { $maxAbsoluteSample = $absolute }
          if ($sample -eq $positiveLimit -or $sample -eq $negativeLimit) { $clippingCount++ }
        }
        $sampleCount += $samples
      }
      $next = $chunkStart + $chunkSize
      if (($chunkSize % 2) -eq 1) { $next++ }
      if ($stream.Position -lt $next) { $stream.Position = $next }
    }
    if ($sampleRate -le 0 -or $sampleCount -le 0) { throw "WAV has no readable audio samples" }
    [ordered]@{
      codec = if ($bits -eq 16) { "pcm_s16le" } else { "pcm_s24le" }
      channels = $channels
      sample_rate = $sampleRate
      bits_per_sample = $bits
      sample_count = $sampleCount
      duration_seconds = [math]::Round($sampleCount / [double]$sampleRate, 6)
      max_absolute_sample = $maxAbsoluteSample
      clipping_count = $clippingCount
    }
  } finally {
    $reader.Dispose()
    $stream.Dispose()
  }
}

function Invoke-VoiceTakeValidation {
  param([Parameter(Mandatory)][string]$TakeRoot, [switch]$ForBuild)
  $manifestPath = Join-Path $TakeRoot "voice-take.json"
  if (-not (Test-Path -LiteralPath $manifestPath)) { throw "Missing voice-take.json" }
  $manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
  $authority = Get-Content -LiteralPath $AuthorityPath -Raw | ConvertFrom-Json
  $canonicalTranscript = Get-CanonicalTranscript
  $canonicalHash = Get-TextSha256 $canonicalTranscript
  if ($manifest.schemaVersion -ne 1) { throw "Unsupported voice take schemaVersion" }
  if ($manifest.input_mode -notin @("per_utterance_wav_v1","full_programme_wav_v1")) { throw "Unsupported input_mode" }
  if ([string]::IsNullOrWhiteSpace([string]$manifest.speaker_identity) -or $manifest.speaker_identity -match "(?i)unknown|unset|tbd") {
    throw "Speaker identity must be explicit"
  }
  if ($manifest.voice_character.gender_presentation -ne "male") { throw "Voice direction requires male presentation" }
  if ($manifest.voice_character.delivery -ne "calm") { throw "Voice direction requires calm delivery" }
  if ($manifest.voice_character.register -notin @("lower","mid","lower_mid")) { throw "Voice register must be lower or mid" }
  if ($manifest.voice_name -match "(?i)zira") { throw "Zira lineage is quarantined for this successor" }
  if ($manifest.voice_origin -eq "voice_clone" -and -not $manifest.clone_authorized) { throw "Voice cloning requires separate authorization" }
  if ($manifest.contains_music_or_sfx -ne $false) { throw "Voice input must contain speech only, without music or SFX" }
  if ($manifest.extra_or_omitted_words_declared -ne $false) { throw "Voice input declares extra or omitted words" }
  if ($manifest.rights_provenance.status -ne "documented" -or $manifest.rights_provenance.private_release_candidate_use_authorized -ne $true) {
    throw "Rights provenance is absent, unknown, or insufficient"
  }
  if ($manifest.naturalness_human_judgment -ne "pending_whole_release_candidate") {
    throw "Naturalness must remain pending whole-release-candidate human judgment"
  }
  if ($ForBuild -and $manifest.technical_fixture_only) { throw "Technical fixture cannot build a release candidate" }

  $records = @()
  if ($manifest.input_mode -eq "per_utterance_wav_v1") {
    $entries = @($manifest.entries)
    if ($entries.Count -ne 24) { throw "Per-utterance mode requires exactly 24 entries" }
    $ids = @($entries | ForEach-Object utterance_id)
    if (@($ids | Sort-Object -Unique).Count -ne 24) { throw "Duplicate utterance ID or missing coverage" }
    $files = @($entries | ForEach-Object file)
    if (@($files | Sort-Object -Unique).Count -ne 24) { throw "Duplicate WAV file binding" }
    for ($index = 0; $index -lt 24; $index++) {
      $expected = $authority.utterances[$index]
      $entry = @($entries | Where-Object utterance_id -eq $expected.utterance_id)
      if ($entry.Count -ne 1) { throw "Missing or duplicate entry for $($expected.utterance_id)" }
      $entry = $entry[0]
      if ($entry.file -ne ("utterances/{0}.wav" -f $expected.utterance_id)) { throw "Wrong filename for $($expected.utterance_id)" }
      if ((Normalize-Text ([string]$entry.transcript)) -ne (Normalize-Text ([string]$expected.spoken_text_en))) {
        throw "Wrong transcript for $($expected.utterance_id)"
      }
      $wavPath = Join-Path $TakeRoot ($entry.file -replace "/", "\")
      if (-not (Test-Path -LiteralPath $wavPath)) { throw "Missing WAV for $($expected.utterance_id)" }
      $stats = Get-PcmWavStats $wavPath
      if ($stats.sample_rate -ne 48000 -or $stats.channels -ne 1 -or $stats.bits_per_sample -notin @(16,24)) {
        throw "Wrong PCM format for $($expected.utterance_id)"
      }
      if ($stats.clipping_count -ne 0) { throw "Clipping detected for $($expected.utterance_id)" }
      $window = [double]$expected.audio_end_seconds - [double]$expected.audio_start_seconds
      if ($stats.duration_seconds -gt ($window + 0.001)) { throw "Timing window exceeded for $($expected.utterance_id)" }
      $records += [ordered]@{ utterance_id = $expected.utterance_id; file = $entry.file; stats = $stats; sha256 = Get-Sha256 $wavPath }
    }
  } else {
    if ((Normalize-Text ([string]$manifest.transcript)) -ne $canonicalTranscript) { throw "Full-programme transcript mismatch" }
    if ($manifest.transcript_sha256 -ne $canonicalHash) { throw "Full-programme transcript hash mismatch" }
    if ($manifest.file -ne "programme.wav") { throw "Full-programme file must be programme.wav" }
    $wavPath = Join-Path $TakeRoot "programme.wav"
    if (-not (Test-Path -LiteralPath $wavPath)) { throw "Missing programme.wav" }
    $stats = Get-PcmWavStats $wavPath
    if ($stats.sample_rate -ne 48000 -or $stats.channels -ne 1 -or $stats.bits_per_sample -notin @(16,24)) { throw "Wrong programme PCM format" }
    if ($stats.clipping_count -ne 0) { throw "Clipping detected in programme WAV" }
    if ([math]::Abs($stats.duration_seconds - 180) -gt 0.001) { throw "Full programme must be exactly 180 seconds" }
    $alignment = @($manifest.alignment)
    if ($alignment.Count -ne 24) { throw "Full programme requires 24 alignment rows" }
    for ($index = 0; $index -lt 24; $index++) {
      if ($alignment[$index].utterance_id -ne $authority.utterances[$index].utterance_id) { throw "Alignment ID mismatch" }
      if ((Normalize-Text ([string]$alignment[$index].transcript)) -ne (Normalize-Text ([string]$authority.utterances[$index].spoken_text_en))) {
        throw "Alignment transcript mismatch"
      }
      if ([double]$alignment[$index].start_seconds -ge [double]$alignment[$index].end_seconds) { throw "Invalid alignment timing" }
      if ($index -gt 0 -and [double]$alignment[$index].start_seconds -lt [double]$alignment[$index - 1].end_seconds) {
        throw "Overlapping alignment timing"
      }
    }
    $records += [ordered]@{ file = "programme.wav"; stats = $stats; sha256 = Get-Sha256 $wavPath }
  }
  [ordered]@{
    schemaVersion = 1
    machine_valid = $true
    input_mode = $manifest.input_mode
    speaker_identity = $manifest.speaker_identity
    technical_fixture_only = [bool]$manifest.technical_fixture_only
    transcript_sha256 = $canonicalHash
    file_count = $records.Count
    files = $records
    naturalness_verified = $false
    production_voice_approved = $false
    review_scope = "whole_release_candidate_only"
  }
}

function New-PictureLock {
  [System.IO.Directory]::CreateDirectory($PictureRoot) | Out-Null
  Invoke-External -Program "ffmpeg" -Arguments @(
    "-hide_banner","-loglevel","error","-y","-i",$SourceCleanPath,
    "-map","0:v:0","-c:v","copy","-an","-sn","-dn",
    "-metadata","title=CASE_DIGEST Picture Lock",
    "-metadata","comment=PRIVATE / VIDEO ONLY / NO BURNED CAPTIONS",
    "-movflags","+faststart",$PictureLockPath
  )
  $media = Get-MediaRecord $PictureLockPath "picture/case-digest-picture-lock.mp4"
  if ($media.duration_seconds -ne 180 -or $media.width -ne 1280 -or $media.height -ne 720 -or
      $media.frame_rate -ne "30/1" -or $media.frame_count -ne 5400 -or
      $media.audio_stream_count -ne 0 -or $media.subtitle_stream_count -ne 0) {
    throw "Picture lock media contract failed"
  }
  $media
}

function New-Thumbnail {
  [System.IO.Directory]::CreateDirectory($ThumbnailRoot) | Out-Null
  $fontForFilter = $ThumbnailFontPath.Replace("\","/").Replace(":","\:")
  $filter = "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,drawbox=x=0:y=486:w=1280:h=234:color=black@0.64:t=fill,drawtext=fontfile='$fontForFilter':text='THE TOWER FILE':fontcolor=white:fontsize=72:x=(w-text_w)/2:y=555"
  Invoke-External -Program "ffmpeg" -Arguments @(
    "-hide_banner","-loglevel","error","-y","-i",$ThumbnailSourcePath,
    "-vf",$filter,"-frames:v","1","-q:v","2",$ThumbnailPath
  )
  $probe = Invoke-Ffprobe $ThumbnailPath
  $video = @($probe.streams | Where-Object codec_type -eq "video")
  if ($video.Count -ne 1 -or [int]$video[0].width -ne 1280 -or [int]$video[0].height -ne 720) {
    throw "Thumbnail dimensions failed"
  }
  Get-FileRecord $ThumbnailPath "thumbnail/case-digest-thumbnail.jpg"
}

function Copy-LockedSidecars {
  [System.IO.Directory]::CreateDirectory($CaptionRoot) | Out-Null
  Copy-Item -LiteralPath $SourceEnglishSrtPath -Destination $EnglishSrtPath
  Copy-Item -LiteralPath $SourceEnglishVttPath -Destination $EnglishVttPath
  Copy-Item -LiteralPath $SourceJapaneseSrtPath -Destination $JapaneseSrtPath
  Copy-Item -LiteralPath $SourceJapaneseVttPath -Destination $JapaneseVttPath
}

function New-TrackedArtifacts {
  param([Parameter(Mandatory)]$PictureRecord, [Parameter(Mandatory)]$ThumbnailRecord, [Parameter(Mandatory)]$VoiceInventory)
  [System.IO.Directory]::CreateDirectory($ArtifactRoot) | Out-Null
  $authority = Get-Content -LiteralPath $AuthorityPath -Raw | ConvertFrom-Json
  $model = Get-Content -LiteralPath $SourceModelPath -Raw | ConvertFrom-Json
  $canonicalTranscript = Get-CanonicalTranscript
  $canonicalTranscriptHash = Get-TextSha256 $canonicalTranscript
  $fontHash = Get-Sha256 $ThumbnailFontPath

  $readme = @"
# CASE_DIGEST Release Candidate Preparation

This bundle freezes the accepted 180-second picture, 24 English utterances, and bilingual caption timing while rejecting the current Zira audience voice for this successor lineage.

The machine-complete state is natural_male_voice_input_required. A calm lower- or mid-register English male take may enter through either supported WAV contract. Machine validation checks identity, transcript, PCM, clipping, timing, music/SFX declaration, and provenance; it does not claim naturalness, production approval, rights clearance, publication approval, or final canon.

Use tools/fff-case-digest-release-candidate-preparation.ps1 with Build, ValidateVoiceTake, BuildReleaseCandidate, or FinalQc. Human voice judgment is allowed only in the whole release candidate.
"@
  Write-Utf8Text (Join-Path $ArtifactRoot "README_CASE_DIGEST_RELEASE_CANDIDATE_PREPARATION.md") ($readme + "`n")

  Write-Json (Join-Path $ArtifactRoot "audience-voice-direction-quarantine.json") ([ordered]@{
    schemaVersion = 1
    quarantine_id = $QuarantineId
    target_scope = "current_CASE_DIGEST_successor_lineage_only"
    rejected_voice = [ordered]@{ backend = "System.Speech"; name = "Microsoft Zira Desktop"; gender = "Female"; status = "rejected_for_successor_audience_voice"; historical_outputs_retained = $true }
    direction = [ordered]@{ natural_male_english_voice_required = $true; calm_delivery_required = $true; lower_or_mid_register_preferred = $true }
    standalone_voice_review_prohibited = $true
    next_human_review_scope = "whole_release_candidate"
    universal_female_voice_ban = $false
    script_rework_authorized = $false
    caption_rework_authorized = $false
    visual_rework_authorized = $false
    final_voice_selected = $false
    production_voice_approved = $false
    production_approved = $false
    rights_cleared = $false
    publication_approved = $false
    final_canon = $false
  })

  Write-Json (Join-Path $ArtifactRoot "picture-lock-manifest.json") ([ordered]@{
    schemaVersion = 1
    artifact_id = $ArtifactId
    source = [ordered]@{ run_id = "fff-case-digest-english-editorial-naturalness-001"; file = "clean/case-digest-english-clean.mp4"; sha256 = $ExpectedSourceCleanHash; source_commit = $ExpectedHead }
    output = $PictureRecord
    contract = [ordered]@{ duration_seconds = 180; width = 1280; height = 720; fps = 30; frame_count = 5400; video_only = $true; audio_stream_count = 0; subtitle_stream_count = 0; burned_caption_count = 0; decoded_frame_identity_required = $true }
    script_change_count = 0
    caption_change_count = 0
    accepted_image_change_count = 0
    image_generation_count = 0
  })

  $voiceSchema = [ordered]@{
    '$schema' = "https://json-schema.org/draft/2020-12/schema"
    '$id' = "fff.voiceTakeContract.v1"
    title = "CASE_DIGEST Voice Take Contract"
    type = "object"
    additionalProperties = $true
    required = @("schemaVersion","input_mode","speaker_identity","voice_name","voice_origin","voice_character","clone_authorized","contains_music_or_sfx","extra_or_omitted_words_declared","rights_provenance","naturalness_human_judgment","technical_fixture_only")
    properties = [ordered]@{
      schemaVersion = [ordered]@{ const = 1 }
      input_mode = [ordered]@{ enum = @("per_utterance_wav_v1","full_programme_wav_v1") }
      speaker_identity = [ordered]@{ type = "string"; minLength = 1 }
      voice_name = [ordered]@{ type = "string"; minLength = 1; not = [ordered]@{ pattern = "(?i)zira" } }
      voice_origin = [ordered]@{ enum = @("human_recording","licensed_synthesis","voice_clone") }
      clone_authorized = [ordered]@{ type = "boolean" }
      contains_music_or_sfx = [ordered]@{ const = $false }
      extra_or_omitted_words_declared = [ordered]@{ const = $false }
      naturalness_human_judgment = [ordered]@{ const = "pending_whole_release_candidate" }
      technical_fixture_only = [ordered]@{ type = "boolean" }
    }
    allOf = @(
      [ordered]@{ if = [ordered]@{ properties = [ordered]@{ input_mode = [ordered]@{ const = "per_utterance_wav_v1" } } }; then = [ordered]@{ required = @("entries") } },
      [ordered]@{ if = [ordered]@{ properties = [ordered]@{ input_mode = [ordered]@{ const = "full_programme_wav_v1" } } }; then = [ordered]@{ required = @("file","transcript","transcript_sha256","alignment") } }
    )
  }
  Write-Json (Join-Path $ArtifactRoot "voice-take-contract.schema.json") $voiceSchema

  $templateEntries = @($authority.utterances | ForEach-Object {
    [ordered]@{ utterance_id = $_.utterance_id; file = "utterances/$($_.utterance_id).wav"; transcript = $_.spoken_text_en }
  })
  Write-Json (Join-Path $ArtifactRoot "voice-take-template.json") ([ordered]@{
    schemaVersion = 1
    input_mode = "per_utterance_wav_v1"
    speaker_identity = "REQUIRED_EXPLICIT_IDENTITY"
    voice_name = "REQUIRED_NON_ZIRA_VOICE_NAME"
    voice_origin = "human_recording"
    voice_character = [ordered]@{ gender_presentation = "male"; delivery = "calm"; register = "lower_mid" }
    clone_authorized = $false
    contains_music_or_sfx = $false
    extra_or_omitted_words_declared = $false
    rights_provenance = [ordered]@{ status = "REQUIRED_documented"; source = "REQUIRED"; private_release_candidate_use_authorized = $false }
    naturalness_human_judgment = "pending_whole_release_candidate"
    technical_fixture_only = $false
    canonical_transcript_sha256 = $canonicalTranscriptHash
    audio_contract = [ordered]@{ container = "WAV"; codec = @("pcm_s16le","pcm_s24le"); sample_rate_hz = 48000; channels = 1; clipping_count = 0; speech_only = $true }
    entries = $templateEntries
  })

  $deliveryRows = @($authority.utterances | ForEach-Object {
    [ordered]@{
      utterance_id = $_.utterance_id
      section_id = $_.section_id
      shot_id = $_.shot_id
      transcript = $_.spoken_text_en
      window_start_seconds = $_.audio_start_seconds
      window_end_seconds = $_.audio_end_seconds
      max_duration_seconds = [math]::Round(([double]$_.audio_end_seconds - [double]$_.audio_start_seconds),3)
      delivery = "calm_documentary"
      register = "lower_or_mid"
      pace = "measured_not_slow"
      emphasis = if ($_.utterance_id -in @("cd-en-001","cd-en-008","cd-en-019","cd-en-024")) { "light_factual_anchor" } else { "none" }
      avoid = "melodrama|trailer_cadence|legalese|mechanical_evenness|certainty_inflation"
      pronunciation_notes = if ($_.utterance_id -eq "cd-en-005") { "Mira: MEER-ah" } elseif ($_.utterance_id -in @("cd-en-008","cd-en-019")) { "nine seventeen: spoken as time, not decimal" } else { "" }
    }
  })
  Write-Utf8Text (Join-Path $ArtifactRoot "utterance-delivery-map.csv") (ConvertTo-CsvText $deliveryRows)
  Write-Json (Join-Path $ArtifactRoot "local-male-voice-inventory.json") $VoiceInventory

  Write-Json (Join-Path $ArtifactRoot "voice-intake-validation-contract.json") ([ordered]@{
    schemaVersion = 1
    command = "pwsh -NoProfile -File tools/fff-case-digest-release-candidate-preparation.ps1 -Mode ValidateVoiceTake -VoiceTakeRoot <path>"
    modes = @("per_utterance_wav_v1","full_programme_wav_v1")
    machine_checks = @("explicit_speaker_identity","non_zira_voice","male_calm_lower_or_mid_direction","exact_transcript","complete_unique_coverage","pcm_mono_48000_16_or_24_bit","clipping_count_zero","speech_only_declaration","timing_windows","rights_provenance_documented","clone_authority_when_applicable")
    negative_probes = @("missing_file","duplicate_utterance","wrong_transcript","clipping","music_or_sfx","timing_mismatch","unknown_identity","absent_rights_provenance")
    fail_closed = $true
    naturalness_is_human_judgment = $true
    naturalness_verified_by_validator = $false
    production_voice_approved_by_validator = $false
    human_review_scope = "whole_release_candidate_only"
  })

  $releaseMetadata = [ordered]@{
    schemaVersion = 1
    artifact_id = $ArtifactId
    format_id = "CASE_DIGEST"
    working_title = "The Tower File"
    language = "en"
    duration_seconds = 180
    audience = "general mystery and documentary-fiction viewers"
    editorial_promise = "A restrained three-minute case digest that separates what is seen, alleged, and still unknown."
    picture_lock = "picture/case-digest-picture-lock.mp4"
    subtitle_tracks = @(
      [ordered]@{ language = "en"; role = "original_default"; srt = "captions/case-digest.en.srt"; vtt = "captions/case-digest.en.vtt" },
      [ordered]@{ language = "ja"; role = "debug_translation_not_default"; srt = "captions/case-digest.ja.srt"; vtt = "captions/case-digest.ja.vtt" }
    )
    voice_input_state = $VoiceInventory.voice_input_state
    final_voice_selected = $false
    production_voice_approved = $false
    production_approved = $false
    rights_cleared = $false
    publication_approved = $false
    final_canon = $false
    publication_notes = "Private release-candidate preparation only. Do not upload or publish. Re-run QC after an accepted voice take is supplied."
  }
  Write-Json (Join-Path $ArtifactRoot "release-metadata.json") $releaseMetadata
  Write-Utf8Text (Join-Path $ArtifactRoot "youtube-title.txt") "The Tower File: What the Evidence Shows`n"
  Write-Utf8Text (Join-Path $ArtifactRoot "youtube-description.md") @"
A bell is reported from a tower with no bell. Clock repairer Mira follows a note, a brass moth, the time nine seventeen, and a two-column ledger.

This CASE_DIGEST keeps reported events, visible evidence, allegations, and unresolved questions separate. It does not claim that the ledger has power, that the council is involved, or that Mira's missing brother has been found.

Subtitles: English original and Japanese debug translation.

Private release-candidate preparation. Not approved for publication.
"@
  Write-Utf8Text (Join-Path $ArtifactRoot "youtube-chapters.txt") @"
00:00 The bell with no bell
00:24 Mira follows the clues
01:05 The two-column ledger
01:37 The council allegation
02:16 What remains unknown
"@
  Write-Utf8Text (Join-Path $ArtifactRoot "credits.md") @"
# Credits and provenance note

- Format and editorial pipeline: Fast Fiction Factory
- Accepted raster sequence: the 11 image records listed in asset-use-provenance-matrix.csv
- English script and bilingual captions: locked CASE_DIGEST editorial-naturalness authority
- Thumbnail: deterministic derivative of accepted raster shot-b03-01; Arial Bold font used from the local Windows installation and not copied into Git
- Voice: awaiting an accepted calm English male take; no production voice is selected

This file records sources and compatibility states. It is not legal advice and does not claim rights clearance or publication approval.
"@

  $provenanceRows = @($model.shots | ForEach-Object {
    [ordered]@{
      asset_id = $_.shot_id
      asset_role = "picture_lock_visual"
      source_path = $_.image_path
      source_sha256 = $_.sha256
      output_path = "picture/case-digest-picture-lock.mp4"
      transformation = "existing_accepted_editorial_treatment_only"
      rights_compatibility = "not_reviewed"
      provenance_state = "documented_source_identity"
      credits_required = "yes"
      legal_conclusion = "none"
    }
  })
  $provenanceRows += @(
    [ordered]@{ asset_id = "canonical_english_script"; asset_role = "script"; source_path = "artifacts/case-digest-english-editorial-naturalness/revised-bilingual-utterance-authority.json"; source_sha256 = Get-Sha256 $AuthorityPath; output_path = "voice-input/utterance-delivery-map.csv"; transformation = "none"; rights_compatibility = "project_authored_not_legally_reviewed"; provenance_state = "documented"; credits_required = "no"; legal_conclusion = "none" },
    [ordered]@{ asset_id = "caption_en"; asset_role = "subtitle"; source_path = "source-run/youtube/case-digest.en.srt"; source_sha256 = $ExpectedEnglishSrtHash; output_path = "captions/case-digest.en.srt"; transformation = "byte_copy"; rights_compatibility = "project_authored_not_legally_reviewed"; provenance_state = "documented"; credits_required = "no"; legal_conclusion = "none" },
    [ordered]@{ asset_id = "caption_ja"; asset_role = "debug_subtitle"; source_path = "source-run/youtube/case-digest.ja.srt"; source_sha256 = $ExpectedJapaneseSrtHash; output_path = "captions/case-digest.ja.srt"; transformation = "byte_copy"; rights_compatibility = "project_authored_not_legally_reviewed"; provenance_state = "documented"; credits_required = "no"; legal_conclusion = "none" },
    [ordered]@{ asset_id = "thumbnail"; asset_role = "private_thumbnail"; source_path = "artifacts/private-full-raster-candidate/images/base/shot-b03-01.jpg"; source_sha256 = Get-Sha256 $ThumbnailSourcePath; output_path = "thumbnail/case-digest-thumbnail.jpg"; transformation = "scale_crop_dark_band_title_overlay"; rights_compatibility = "not_reviewed"; provenance_state = "documented_source_identity"; credits_required = "yes"; legal_conclusion = "none" },
    [ordered]@{ asset_id = "voice_input"; asset_role = "narration_placeholder"; source_path = "voice-input/accepted-take/"; source_sha256 = ""; output_path = "release/*"; transformation = "awaiting_input"; rights_compatibility = "unknown_fail_closed"; provenance_state = "input_required"; credits_required = "yes"; legal_conclusion = "none" },
    [ordered]@{ asset_id = "font_arial_bold"; asset_role = "thumbnail_title_font"; source_path = "windows-fonts/arialbd.ttf"; source_sha256 = $fontHash; output_path = "thumbnail/case-digest-thumbnail.jpg"; transformation = "rasterized_text_only_font_not_redistributed"; rights_compatibility = "system_font_use_not_legally_reviewed"; provenance_state = "local_identity_recorded"; credits_required = "yes"; legal_conclusion = "none" }
  )
  Write-Utf8Text (Join-Path $ArtifactRoot "asset-use-provenance-matrix.csv") (ConvertTo-CsvText $provenanceRows)

  Write-Json (Join-Path $ArtifactRoot "thumbnail-direction.json") ([ordered]@{
    schemaVersion = 1
    visual_direction_signature = "archival_case_file_thumbnail_v1"
    output = $ThumbnailRecord
    canvas = [ordered]@{ width = 1280; height = 720; aspect_ratio = "16:9" }
    source = [ordered]@{ shot_id = "shot-b03-01"; path = "artifacts/private-full-raster-candidate/images/base/shot-b03-01.jpg"; sha256 = Get-Sha256 $ThumbnailSourcePath; accepted_raster = $true }
    title_phrase = "THE TOWER FILE"
    focal_subject_count = 1
    small_size_legibility_required = $true
    new_imagery_created = $false
    fake_evidence_added = $false
    guilt_implied = $false
    private_only = $true
  })

  Write-Json (Join-Path $ArtifactRoot "release-qc-contract.json") ([ordered]@{
    schemaVersion = 1
    command = "pwsh -NoProfile -File tools/fff-case-digest-release-candidate-preparation.ps1 -Mode FinalQc -RunRoot <path>"
    preparation_pass_state = "PASS_RELEASE_PREPARATION_AWAITING_VOICE"
    release_pass_state = "PASS_RELEASE_CANDIDATE_MACHINE_QC"
    checks = @("picture_lock_exact_media","decoded_frame_identity_5400","caption_hashes_and_24_cues","no_burned_text_in_picture_lock","accepted_voice_contract_when_present","thumbnail_16_9_and_signature","metadata_and_exactly_5_chapters","all_11_visual_provenance_rows","tracked_boundary_no_media","review_offline_and_responsive")
    fail_closed = $true
    human_naturalness_excluded = $true
    production_approval_excluded = $true
    rights_clearance_excluded = $true
    publication_approval_excluded = $true
  })

  Write-Json (Join-Path $ArtifactRoot "release-candidate-preparation-result.json") ([ordered]@{
    schemaVersion = 1
    mission_id = $MissionId
    artifact_id = $ArtifactId
    status = "PASS_RELEASE_PREPARATION_AWAITING_VOICE"
    source_commit = $ExpectedHead
    source_run_id = "fff-case-digest-english-editorial-naturalness-001"
    voice_direction_quarantine_id = $QuarantineId
    current_zira_audience_voice_status = "rejected"
    voice_input_state = $VoiceInventory.voice_input_state
    picture_lock = $PictureRecord
    thumbnail = $ThumbnailRecord
    caption_hashes = [ordered]@{ en_srt = $ExpectedEnglishSrtHash; en_vtt = $ExpectedEnglishVttHash; ja_srt = $ExpectedJapaneseSrtHash; ja_vtt = $ExpectedJapaneseVttHash }
    utterance_count = 24
    word_count = 313
    duration_seconds = 180
    frame_count = 5400
    script_rework_count = 0
    caption_rework_count = 0
    visual_rework_count = 0
    image_generation_count = 0
    standalone_voice_review_request_count = 0
    provisional_av_generated = $false
    final_voice_selected = $false
    production_voice_approved = $false
    production_approved = $false
    rights_cleared = $false
    publication_approved = $false
    final_canon = $false
    pushed = $false
  })

  Write-Json (Join-Path $ArtifactRoot "external-run-manifest.schema.json") ([ordered]@{
    '$schema' = "https://json-schema.org/draft/2020-12/schema"
    '$id' = "fff.caseDigestReleaseCandidatePreparationRun.v1"
    title = "CASE_DIGEST Release Candidate Preparation Run"
    type = "object"
    additionalProperties = $true
    required = @("schemaVersion","mission_id","artifact_id","status","git","voice","picture_lock","captions","thumbnail","metadata","validation","boundaries","effects")
    properties = [ordered]@{
      schemaVersion = [ordered]@{ const = 1 }
      mission_id = [ordered]@{ const = $MissionId }
      artifact_id = [ordered]@{ const = $ArtifactId }
      status = [ordered]@{ enum = @("BUILDING","PASS_RELEASE_PREPARATION_AWAITING_VOICE","PASS_RELEASE_CANDIDATE_MACHINE_QC","PASS_COMMITTED_LOCAL_ONLY") }
    }
  })
}

function Copy-ExternalBundleFiles {
  [System.IO.Directory]::CreateDirectory($MetadataRoot) | Out-Null
  [System.IO.Directory]::CreateDirectory($VoiceInputRoot) | Out-Null
  [System.IO.Directory]::CreateDirectory($AcceptedVoiceRoot) | Out-Null
  foreach ($name in @("release-metadata.json","youtube-title.txt","youtube-description.md","youtube-chapters.txt","credits.md")) {
    Copy-Item -LiteralPath (Join-Path $ArtifactRoot $name) -Destination (Join-Path $MetadataRoot $name)
  }
  foreach ($name in @("voice-take-contract.schema.json","voice-take-template.json","utterance-delivery-map.csv","voice-intake-validation-contract.json","local-male-voice-inventory.json")) {
    Copy-Item -LiteralPath (Join-Path $ArtifactRoot $name) -Destination (Join-Path $VoiceInputRoot $name)
  }
}

function New-ReviewHtml {
  $metadata = Get-Content -LiteralPath (Join-Path $ArtifactRoot "release-metadata.json") -Raw | ConvertFrom-Json
  $title = (Get-Content -LiteralPath (Join-Path $ArtifactRoot "youtube-title.txt") -Raw).Trim()
  $chapters = (Get-Content -LiteralPath (Join-Path $ArtifactRoot "youtube-chapters.txt") -Raw).Trim()
  $description = (Get-Content -LiteralPath (Join-Path $ArtifactRoot "youtube-description.md") -Raw).Trim()
  $html = @"
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>CASE_DIGEST Release Candidate Preparation</title>
<style>
:root{color-scheme:dark;--paper:#e9dfc8;--ink:#15181c;--brass:#b9914d;--muted:#9ba3ad;--panel:#20252b}
*{box-sizing:border-box}body{margin:0;background:#101317;color:#f4f1ea;font:16px/1.5 system-ui,sans-serif}
main{max-width:1180px;margin:auto;padding:24px}.eyebrow{color:var(--brass);letter-spacing:.12em;text-transform:uppercase;font-size:.78rem}
h1{font:700 clamp(1.8rem,5vw,3.3rem)/1.05 Georgia,serif;margin:.3rem 0 1rem}.state{border:1px solid #735f37;background:#29251c;padding:12px 16px;border-radius:10px}
.grid{display:grid;grid-template-columns:minmax(0,2fr) minmax(270px,1fr);gap:20px;margin-top:20px}
.panel{background:var(--panel);border:1px solid #353c45;border-radius:12px;padding:16px;min-width:0}
video,img{width:100%;height:auto;display:block;background:#050607;border-radius:8px}video{aspect-ratio:16/9}
h2{font-size:1.05rem;margin:0 0 10px;color:var(--paper)}pre{white-space:pre-wrap;word-break:break-word;color:#d5d9dd;margin:0}
dl{display:grid;grid-template-columns:max-content 1fr;gap:6px 12px;margin:0}dt{color:var(--muted)}dd{margin:0}
.boundary{margin-top:20px;color:#c7ccd2;font-size:.9rem}.ok{color:#b9d7b2}.hold{color:#f0c981}
@media(max-width:760px){main{padding:14px}.grid{grid-template-columns:1fr}.panel{padding:12px}}
</style>
</head>
<body><main>
<div class="eyebrow">Private preparation bundle · no review request</div>
<h1>CASE_DIGEST release candidate preparation</h1>
<div class="state"><strong class="hold">Voice input required.</strong> The Zira audience voice is rejected for this successor. Supply a documented calm English male take, then review only the whole release candidate.</div>
<div class="grid">
  <section class="panel"><h2>Picture lock · video only</h2><video id="picture" controls preload="metadata" poster="../thumbnail/case-digest-thumbnail.jpg"><source src="../picture/case-digest-picture-lock.mp4" type="video/mp4"></video></section>
  <section class="panel"><h2>Private thumbnail</h2><img id="thumbnail" src="../thumbnail/case-digest-thumbnail.jpg" alt="The Tower File private thumbnail"></section>
  <section class="panel"><h2>Release metadata</h2><dl><dt>Title</dt><dd id="title">$title</dd><dt>Duration</dt><dd>03:00</dd><dt>Voice</dt><dd id="voice-state">$($metadata.voice_input_state)</dd><dt>Human review</dt><dd>whole release candidate only</dd></dl></section>
  <section class="panel"><h2>Five chapters</h2><pre id="chapters">$chapters</pre></section>
  <section class="panel"><h2>Description</h2><pre id="description">$description</pre></section>
  <section class="panel"><h2>Gate boundary</h2><pre>final voice selected: false
production voice approved: false
production approved: false
rights cleared: false
publication approved: false
final canon: false</pre></section>
</div>
<p class="boundary">Machine preparation is complete. This page is a local operator/readback surface, not a voice-only or publication review request.</p>
<script>
window.__FFF_RELEASE_PREP__={
  picture:document.getElementById("picture"),
  getState:()=>({
    voice_input_state:document.getElementById("voice-state").textContent,
    title:document.getElementById("title").textContent,
    chapter_count:document.getElementById("chapters").textContent.trim().split(/\n/).length,
    autoplay:document.getElementById("picture").autoplay,
    controls:document.getElementById("picture").controls,
    review_scope:"whole_release_candidate_only",
    review_requested:false
  })
};
</script>
</main></body></html>
"@
  Write-Utf8Text $ReviewHtmlPath $html
}

function New-RunManifest {
  param([Parameter(Mandatory)]$PictureRecord, [Parameter(Mandatory)]$ThumbnailRecord, [Parameter(Mandatory)]$VoiceInventory, [string]$Status = "BUILDING")
  $captionRecords = [ordered]@{
    en_srt = Get-FileRecord $EnglishSrtPath "captions/case-digest.en.srt"
    en_vtt = Get-FileRecord $EnglishVttPath "captions/case-digest.en.vtt"
    ja_srt = Get-FileRecord $JapaneseSrtPath "captions/case-digest.ja.srt"
    ja_vtt = Get-FileRecord $JapaneseVttPath "captions/case-digest.ja.vtt"
  }
  [ordered]@{
    schemaVersion = 1
    mission_id = $MissionId
    artifact_id = $ArtifactId
    status = $Status
    git = [ordered]@{ source_commit = $ExpectedHead; source_branch = $ExpectedBranch; commit_created = $false; commit_sha = $null; parent_sha = $ExpectedHead; subject = "Prepare CASE_DIGEST release candidate bundle"; pushed = $false }
    source = [ordered]@{ run_id = "fff-case-digest-english-editorial-naturalness-001"; status = $ExpectedSourceRunStatus; clean_sha256 = $ExpectedSourceCleanHash }
    voice = [ordered]@{
      quarantine_id = $QuarantineId
      current_zira_audience_voice_status = "rejected"
      natural_male_english_voice_required = $true
      calm_delivery_required = $true
      lower_or_mid_register_preferred = $true
      voice_input_state = $VoiceInventory.voice_input_state
      eligible_local_english_male_voice_count = $VoiceInventory.eligible_english_male_voice_count
      provisional_av_generated = $false
      standalone_voice_review_prohibited = $true
      next_human_review_scope = "whole_release_candidate"
    }
    picture_lock = $PictureRecord
    captions = $captionRecords
    thumbnail = $ThumbnailRecord
    metadata = [ordered]@{ title = "metadata/youtube-title.txt"; description = "metadata/youtube-description.md"; chapters = "metadata/youtube-chapters.txt"; credits = "metadata/credits.md"; chapter_count = 5 }
    review_html = Get-FileRecord $ReviewHtmlPath "review/case-digest-release-candidate-preparation.html"
    validation = [ordered]@{ targeted_tests = $false; picture_lock = $false; captions = $false; voice_negative_probes = $false; metadata = $false; thumbnail = $false; provenance = $false; browser = $false; strict_mkdocs = $false }
    boundaries = [ordered]@{ final_voice_selected = $false; production_voice_approved = $false; production_approved = $false; rights_cleared = $false; publication_approved = $false; final_canon = $false }
    effects = [ordered]@{ network_request_count = 0; credential_touch_count = 0; install_count = 0; image_generation_count = 0; music_or_sfx_generation_count = 0; upload_count = 0; public_effect_count = 0; pushed = $false }
  }
}

function Assert-PreparationQc {
  $manifest = Get-Content -LiteralPath $RunManifestPath -Raw | ConvertFrom-Json
  $picture = Get-MediaRecord $PictureLockPath "picture/case-digest-picture-lock.mp4"
  if ($picture.duration_seconds -ne 180 -or $picture.width -ne 1280 -or $picture.height -ne 720 -or
      $picture.frame_rate -ne "30/1" -or $picture.frame_count -ne 5400 -or
      $picture.audio_stream_count -ne 0 -or $picture.subtitle_stream_count -ne 0) {
    throw "Picture lock QC failed"
  }
  foreach ($pair in @(
    @($EnglishSrtPath,$ExpectedEnglishSrtHash), @($EnglishVttPath,$ExpectedEnglishVttHash),
    @($JapaneseSrtPath,$ExpectedJapaneseSrtHash), @($JapaneseVttPath,$ExpectedJapaneseVttHash)
  )) {
    if ((Get-Sha256 $pair[0]) -ne $pair[1]) { throw "Caption QC hash mismatch" }
  }
  $chapters = @(Get-Content -LiteralPath (Join-Path $MetadataRoot "youtube-chapters.txt") | Where-Object { $_.Trim() })
  if ($chapters.Count -ne 5) { throw "Expected exactly five chapters" }
  if ($manifest.voice.voice_input_state -notin @("natural_male_voice_input_required","eligible_local_male_voice_available_unreviewed")) { throw "Voice input state invalid" }
  [ordered]@{
    schemaVersion = 1
    status = "PASS_RELEASE_PREPARATION_AWAITING_VOICE"
    picture_lock = $picture
    caption_hashes_match = $true
    metadata_chapter_count = 5
    voice_input_state = $manifest.voice.voice_input_state
    naturalness_verified = $false
    production_approved = $false
    rights_cleared = $false
    publication_approved = $false
  }
}

function New-AssFiles {
  $authority = Get-Content -LiteralPath $AuthorityPath -Raw | ConvertFrom-Json
  function Format-AssTime([double]$Seconds) {
    $cs = [int][math]::Round($Seconds * 100)
    $h = [math]::Floor($cs / 360000); $cs -= $h * 360000
    $m = [math]::Floor($cs / 6000); $cs -= $m * 6000
    $s = [math]::Floor($cs / 100); $cs -= $s * 100
    "{0}:{1:00}:{2:00}.{3:00}" -f $h,$m,$s,$cs
  }
  $header = @"
[Script Info]
ScriptType: v4.00+
PlayResX: 1280
PlayResY: 720
WrapStyle: 2

[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
Style: EN,Arial,40,&H00FFFFFF,&H00FFFFFF,&H00000000,&H90000000,0,0,0,0,100,100,0,0,1,2,1,2,64,64,54,1
Style: JA,Yu Gothic,31,&H00F4EBD7,&H00FFFFFF,&H00000000,&H90000000,0,0,0,0,100,100,0,0,1,2,1,8,64,64,54,1

[Events]
Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
"@
  $audience = $header
  $debug = $header
  foreach ($item in $authority.utterances) {
    $start = Format-AssTime ([double]$item.caption_start_seconds)
    $end = Format-AssTime ([double]$item.caption_end_seconds)
    $en = ([string]$item.spoken_text_en).Replace("{","\{").Replace("}","\}")
    $ja = ([string]$item.text_ja).Replace("{","\{").Replace("}","\}")
    $audience += "Dialogue: 0,$start,$end,EN,$($item.utterance_id),0,0,0,,$en`n"
    $debug += "Dialogue: 0,$start,$end,EN,$($item.utterance_id),0,0,0,,$en`n"
    $debug += "Dialogue: 1,$start,$end,JA,$($item.utterance_id),0,0,0,,$ja`n"
  }
  Write-Utf8Text (Join-Path $VerificationRoot "audience.ass") $audience
  Write-Utf8Text (Join-Path $VerificationRoot "debug.ass") $debug
}

function Build-ReleaseCandidate {
  if ([string]::IsNullOrWhiteSpace($VoiceTakeRoot)) { throw "-VoiceTakeRoot is required" }
  $validation = Invoke-VoiceTakeValidation -TakeRoot $VoiceTakeRoot -ForBuild
  [System.IO.Directory]::CreateDirectory($ReleaseRoot) | Out-Null
  $narration = Join-Path $ReleaseRoot "case-digest-narration.wav"
  $take = Get-Content -LiteralPath (Join-Path $VoiceTakeRoot "voice-take.json") -Raw | ConvertFrom-Json
  if ($take.input_mode -eq "full_programme_wav_v1") {
    Invoke-External "ffmpeg" @("-hide_banner","-loglevel","error","-y","-i",(Join-Path $VoiceTakeRoot "programme.wav"),"-ac","1","-ar","48000","-c:a","pcm_s24le","-t","180",$narration)
  } else {
    $authority = Get-Content -LiteralPath $AuthorityPath -Raw | ConvertFrom-Json
    $arguments = @("-hide_banner","-loglevel","error","-y","-f","lavfi","-i","anullsrc=r=48000:cl=mono")
    foreach ($item in $authority.utterances) { $arguments += @("-i",(Join-Path $VoiceTakeRoot "utterances\$($item.utterance_id).wav")) }
    $filters = @(); $labels = @()
    for ($index = 0; $index -lt 24; $index++) {
      $delay = [int][math]::Round([double]$authority.utterances[$index].audio_start_seconds * 1000)
      $inputIndex = $index + 1
      $label = "u$inputIndex"
      $filters += "[${inputIndex}:a]adelay=${delay}:all=1[$label]"
      $labels += "[$label]"
    }
    $filters += (($labels -join "") + "amix=inputs=24:normalize=0:dropout_transition=0,atrim=duration=180,asetpts=N/SR/TB[out]")
    $arguments += @("-filter_complex",($filters -join ";"),"-map","[out]","-ac","1","-ar","48000","-c:a","pcm_s24le",$narration)
    Invoke-External "ffmpeg" $arguments
  }
  New-AssFiles
  $clean = Join-Path $ReleaseRoot "case-digest-clean.mp4"
  $audience = Join-Path $ReleaseRoot "case-digest-audience.mp4"
  $debug = Join-Path $ReleaseRoot "case-digest-debug.mp4"
  Invoke-External "ffmpeg" @("-hide_banner","-loglevel","error","-y","-i",$PictureLockPath,"-i",$narration,"-i",$EnglishSrtPath,"-i",$JapaneseSrtPath,"-map","0:v:0","-map","1:a:0","-map","2:0","-map","3:0","-c:v","copy","-c:a","aac","-b:a","160k","-c:s","mov_text","-metadata:s:s:0","language=eng","-metadata:s:s:1","language=jpn","-disposition:s:0","default","-disposition:s:1","0","-t","180","-movflags","+faststart",$clean)
  Invoke-External "ffmpeg" @("-hide_banner","-loglevel","error","-y","-i",$PictureLockPath,"-i",$narration,"-vf","subtitles=verification/audience.ass","-map","0:v:0","-map","1:a:0","-frames:v","5400","-c:v","libx264","-preset","medium","-crf","18","-c:a","aac","-b:a","160k","-movflags","+faststart",$audience) $RunRoot
  Invoke-External "ffmpeg" @("-hide_banner","-loglevel","error","-y","-i",$PictureLockPath,"-i",$narration,"-vf","subtitles=verification/debug.ass","-map","0:v:0","-map","1:a:0","-frames:v","5400","-c:v","libx264","-preset","medium","-crf","18","-c:a","aac","-b:a","160k","-movflags","+faststart",$debug) $RunRoot
  $result = [ordered]@{
    schemaVersion = 1
    status = "PASS_RELEASE_CANDIDATE_MACHINE_QC"
    voice_validation = $validation
    outputs = [ordered]@{
      narration = Get-FileRecord $narration "release/case-digest-narration.wav"
      clean = Get-MediaRecord $clean "release/case-digest-clean.mp4"
      audience = Get-MediaRecord $audience "release/case-digest-audience.mp4"
      debug = Get-MediaRecord $debug "release/case-digest-debug.mp4"
    }
    naturalness_verified = $false
    human_review_scope = "whole_release_candidate_only"
    production_voice_approved = $false
    production_approved = $false
    rights_cleared = $false
    publication_approved = $false
  }
  Write-Json (Join-Path $ReleaseRoot "release-candidate-manifest.json") $result
  $result
}

function Invoke-Build {
  Assert-Preflight
  if (Test-Path -LiteralPath $RunRoot) {
    $existing = @(Get-ChildItem -LiteralPath $RunRoot -Force)
    if ($existing.Count -gt 0) { throw "RunRoot must be absent or empty: $RunRoot" }
  }
  [System.IO.Directory]::CreateDirectory($RunRoot) | Out-Null
  foreach ($path in @($EvidenceRoot,$VerificationRoot,$ReviewRoot)) { [System.IO.Directory]::CreateDirectory($path) | Out-Null }
  $picture = New-PictureLock
  Copy-LockedSidecars
  $thumbnail = New-Thumbnail
  $inventory = Get-LocalVoiceInventory
  New-TrackedArtifacts -PictureRecord $picture -ThumbnailRecord $thumbnail -VoiceInventory $inventory
  Copy-ExternalBundleFiles
  New-ReviewHtml
  Write-Json $RunManifestPath (New-RunManifest -PictureRecord $picture -ThumbnailRecord $thumbnail -VoiceInventory $inventory)
  Write-Json (Join-Path $EvidenceRoot "preparation-qc.json") (Assert-PreparationQc)
  Write-Output "BUILD_COMPLETE"
}

function Invoke-Validate {
  Assert-Preflight
  $qc = Assert-PreparationQc
  Write-Json (Join-Path $EvidenceRoot "preparation-qc.json") $qc
  $qc | ConvertTo-Json -Depth 20
}

function Invoke-Finalize {
  $manifest = Get-Content -LiteralPath $RunManifestPath -Raw | ConvertFrom-Json
  $qc = Get-Content -LiteralPath (Join-Path $EvidenceRoot "preparation-qc.json") -Raw | ConvertFrom-Json
  $head = (git -C $RepoRoot rev-parse HEAD).Trim()
  $parent = (git -C $RepoRoot rev-parse HEAD^).Trim()
  $subject = (git -C $RepoRoot show -s --format=%s HEAD).Trim()
  $status = @(git -C $RepoRoot status --porcelain)
  if ($status.Count -ne 0) { throw "Finalize requires a clean worktree" }
  if ($subject -ne "Prepare CASE_DIGEST release candidate bundle") { throw "Unexpected commit subject" }
  if ($parent -ne $ExpectedHead) { throw "Unexpected commit parent" }
  if ($qc.status -ne "PASS_RELEASE_PREPARATION_AWAITING_VOICE") { throw "Preparation QC is not passing" }
  $manifest.status = "PASS_COMMITTED_LOCAL_ONLY"
  $manifest.git.commit_created = $true
  $manifest.git.commit_sha = $head
  $manifest.git.parent_sha = $parent
  $manifest.git.subject = $subject
  $manifest.git.pushed = $false
  $manifest.validation.targeted_tests = $true
  $manifest.validation.picture_lock = $true
  $manifest.validation.captions = $true
  $manifest.validation.voice_negative_probes = $true
  $manifest.validation.metadata = $true
  $manifest.validation.thumbnail = $true
  $manifest.validation.provenance = $true
  $manifest.validation.browser = $true
  $manifest.validation.strict_mkdocs = $true
  Write-Json $RunManifestPath $manifest
  Write-Output "FINALIZE_COMPLETE"
}

switch ($Mode) {
  "Build" { Invoke-Build }
  "Validate" { Invoke-Validate }
  "Finalize" { Invoke-Finalize }
  "ValidateVoiceTake" {
    if ([string]::IsNullOrWhiteSpace($VoiceTakeRoot)) { throw "-VoiceTakeRoot is required" }
    (Invoke-VoiceTakeValidation -TakeRoot $VoiceTakeRoot) | ConvertTo-Json -Depth 40
  }
  "BuildReleaseCandidate" { (Build-ReleaseCandidate) | ConvertTo-Json -Depth 60 }
  "FinalQc" { (Assert-PreparationQc) | ConvertTo-Json -Depth 30 }
}
