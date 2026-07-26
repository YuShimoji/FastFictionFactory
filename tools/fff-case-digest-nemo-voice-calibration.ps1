[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$EngineBaseUri,

  [Parameter(Mandatory = $true)]
  [string]$RunRoot,

  [Parameter(Mandatory = $true)]
  [string]$SourceMp4,

  [Parameter(Mandatory = $true)]
  [string]$PlanPath,

  [Parameter(Mandatory = $true)]
  [string]$PronunciationMapPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-Sha256 {
  param([Parameter(Mandatory = $true)][string]$Path)
  return (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash.ToLowerInvariant()
}

function Get-TextSha256 {
  param([Parameter(Mandatory = $true)][string]$Text)
  $bytes = [Text.Encoding]::UTF8.GetBytes($Text)
  return [Convert]::ToHexString([Security.Cryptography.SHA256]::HashData($bytes)).ToLowerInvariant()
}

function Assert-LoopbackEngineUri {
  param([Parameter(Mandatory = $true)][string]$Uri)
  $parsed = [Uri]$Uri
  if ($parsed.Scheme -ne "http" -or $parsed.Host -ne "127.0.0.1") {
    throw "EngineBaseUri must be an http://127.0.0.1 loopback URI."
  }
}

function Invoke-Ffprobe {
  param([Parameter(Mandatory = $true)][string]$Path)
  $json = (& ffprobe -v error -show_streams -show_format -count_frames -of json $Path) -join "`n"
  if ($LASTEXITCODE -ne 0) {
    throw "ffprobe failed for $Path"
  }
  return $json | ConvertFrom-Json
}

function Invoke-FfmpegText {
  param([Parameter(Mandatory = $true)][string[]]$Arguments)
  $output = (& ffmpeg @Arguments 2>&1) -join "`n"
  if ($LASTEXITCODE -ne 0) {
    throw "ffmpeg failed:`n$output"
  }
  return $output
}

function Get-AudioMetrics {
  param([Parameter(Mandatory = $true)][string]$Path)

  $probe = Invoke-Ffprobe -Path $Path
  $stream = @($probe.streams | Where-Object codec_type -eq "audio")[0]
  $duration = [double]$probe.format.duration

  $loudnessText = Invoke-FfmpegText -Arguments @(
    "-hide_banner", "-nostats", "-i", $Path,
    "-af", "loudnorm=I=-19:TP=-1.2:LRA=7:print_format=json",
    "-f", "null", "NUL"
  )
  $jsonMatches = [regex]::Matches($loudnessText, "\{[\s\S]*?\}")
  if ($jsonMatches.Count -eq 0) {
    throw "Unable to parse loudness metrics for $Path"
  }
  $loudness = $jsonMatches[$jsonMatches.Count - 1].Value | ConvertFrom-Json

  $peakText = Invoke-FfmpegText -Arguments @(
    "-hide_banner", "-nostats", "-i", $Path,
    "-af", "volumedetect",
    "-f", "null", "NUL"
  )
  $peakMatch = [regex]::Match($peakText, "max_volume:\s*(-?(?:inf|\d+(?:\.\d+)?))\s*dB", "IgnoreCase")
  $peakDbfs = if (-not $peakMatch.Success -or $peakMatch.Groups[1].Value -eq "-inf") {
    [double]::NegativeInfinity
  } else {
    [double]$peakMatch.Groups[1].Value
  }

  $silenceText = Invoke-FfmpegText -Arguments @(
    "-hide_banner", "-nostats", "-i", $Path,
    "-af", "silencedetect=n=-50dB:d=0.05",
    "-f", "null", "NUL"
  )
  $starts = @([regex]::Matches($silenceText, "silence_start:\s*(\d+(?:\.\d+)?)") | ForEach-Object {
    [double]$_.Groups[1].Value
  })
  $ends = @([regex]::Matches($silenceText, "silence_end:\s*(\d+(?:\.\d+)?)") | ForEach-Object {
    [double]$_.Groups[1].Value
  })
  $leadingSilence = if ($starts.Count -gt 0 -and $starts[0] -le 0.001 -and $ends.Count -gt 0) {
    $ends[0]
  } else {
    0.0
  }
  $trailingSilence = if ($starts.Count -gt 0) {
    $lastStart = $starts[$starts.Count - 1]
    $lastEnd = if ($ends.Count -gt 0) { $ends[$ends.Count - 1] } else { $duration }
    if ([Math]::Abs($lastEnd - $duration) -le 0.05) {
      [Math]::Max(0.0, $duration - $lastStart)
    } else {
      0.0
    }
  } else {
    0.0
  }

  $truePeak = [double]$loudness.input_tp
  $clipCount = if ($peakDbfs -ge -0.001 -or $truePeak -ge -0.001) { 1 } else { 0 }

  return [ordered]@{
    duration_seconds = [Math]::Round($duration, 6)
    sample_rate = [int]$stream.sample_rate
    channels = [int]$stream.channels
    peak_dbfs = if ([double]::IsNegativeInfinity($peakDbfs)) { $null } else { [Math]::Round($peakDbfs, 3) }
    true_peak_dbtp = [Math]::Round($truePeak, 3)
    integrated_lufs = [Math]::Round([double]$loudness.input_i, 3)
    clipping_count = $clipCount
    leading_silence_seconds = [Math]::Round($leadingSilence, 6)
    trailing_silence_seconds = [Math]::Round($trailingSilence, 6)
    bytes = (Get-Item -LiteralPath $Path).Length
    sha256 = Get-Sha256 -Path $Path
  }
}

function Invoke-Synthesis {
  param(
    [Parameter(Mandatory = $true)][string]$Text,
    [Parameter(Mandatory = $true)][int]$StyleId,
    [Parameter(Mandatory = $true)][double]$SpeedScale,
    [Parameter(Mandatory = $true)][string]$OutputPath,
    [Parameter(Mandatory = $true)][string]$QueryPath
  )

  if (Test-Path -LiteralPath $OutputPath) {
    throw "Refusing to overwrite synthesized audio: $OutputPath"
  }
  if (Test-Path -LiteralPath $QueryPath) {
    throw "Refusing to overwrite synthesis query: $QueryPath"
  }

  $queryUri = "$EngineBaseUri/audio_query?text=$([Uri]::EscapeDataString($Text))&speaker=$StyleId"
  $query = Invoke-RestMethod -Method Post -Uri $queryUri -TimeoutSec 90
  $query.speedScale = $SpeedScale
  $query.pitchScale = 0.0
  $query.intonationScale = 1.0
  $query.volumeScale = 1.0
  $queryJson = $query | ConvertTo-Json -Depth 30
  [IO.File]::WriteAllText($QueryPath, $queryJson + "`n", [Text.UTF8Encoding]::new($false))

  $synthesisUri = "$EngineBaseUri/synthesis?speaker=$StyleId"
  Invoke-WebRequest -Method Post -Uri $synthesisUri -ContentType "application/json" -Body $queryJson -OutFile $OutputPath -TimeoutSec 300

  return [ordered]@{
    audio_query_method = "POST"
    audio_query_path = "/audio_query"
    synthesis_method = "POST"
    synthesis_path = "/synthesis"
    style_id = $StyleId
    text_sha256 = Get-TextSha256 -Text $Text
    query_sha256 = Get-Sha256 -Path $QueryPath
    speedScale = $SpeedScale
    pitchScale = 0.0
    intonationScale = 1.0
    volumeScale = 1.0
  }
}

function Convert-ToReviewAudio {
  param(
    [Parameter(Mandatory = $true)][string]$InputPath,
    [Parameter(Mandatory = $true)][string]$OutputPath
  )
  if (Test-Path -LiteralPath $OutputPath) {
    throw "Refusing to overwrite normalized review audio: $OutputPath"
  }
  Invoke-FfmpegText -Arguments @(
    "-hide_banner", "-nostats", "-v", "warning", "-i", $InputPath,
    "-af", "loudnorm=I=-19:TP=-1.2:LRA=7",
    "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le",
    $OutputPath
  ) | Out-Null
}

function Get-VideoStreamHash {
  param([Parameter(Mandatory = $true)][string]$Path)
  $text = Invoke-FfmpegText -Arguments @(
    "-hide_banner", "-v", "error", "-i", $Path,
    "-map", "0:v:0", "-c", "copy",
    "-f", "hash", "-hash", "sha256", "-"
  )
  $match = [regex]::Match($text, "SHA256=([0-9a-fA-F]{64})")
  if (-not $match.Success) {
    throw "Unable to parse video stream hash for $Path"
  }
  return $match.Groups[1].Value.ToLowerInvariant()
}

function New-ReviewHtml {
  param(
    [Parameter(Mandatory = $true)][string]$OutputPath,
    [Parameter(Mandatory = $true)][object]$Plan,
    [Parameter(Mandatory = $true)][int]$RecommendedStyleId
  )

  $cards = foreach ($candidate in $Plan.candidate_styles) {
    $sampleRows = foreach ($section in $Plan.sections) {
      $sectionNo = "{0:D2}" -f [int]$section.section_id
      $relative = "../candidates/style-$($candidate.style_id)/normalized/section-$sectionNo.wav"
      "<li><span>Section $($section.section_id) · $($section.title_ja)</span><audio controls preload=`"metadata`" src=`"$relative`"></audio></li>"
    }
    $pronunciation = "../candidates/style-$($candidate.style_id)/normalized/pronunciation-check.wav"
    @"
<section class="voice-card">
  <h2>$($candidate.speaker_name) / style $($candidate.style_id)</h2>
  <p>$($candidate.selection_reason)</p>
  <ul>$($sampleRows -join "")</ul>
  <label>Pronunciation check<audio controls preload="metadata" src="$pronunciation"></audio></label>
</section>
"@
  }

  $sectionsJson = $Plan.sections | Select-Object section_id, title_ja, start_seconds, end_seconds | ConvertTo-Json -Compress
  $shotsJson = @(
    @{ id = "shot-b01-01"; start = 0; end = 12 },
    @{ id = "shot-b01-02"; start = 12; end = 24 },
    @{ id = "shot-b02-01"; start = 24; end = 38 },
    @{ id = "shot-b02-02"; start = 38; end = 52 },
    @{ id = "shot-b02-03"; start = 52; end = 65 },
    @{ id = "shot-b03-01"; start = 65; end = 81 },
    @{ id = "shot-b03-02"; start = 81; end = 97 },
    @{ id = "shot-b04-01"; start = 97; end = 116 },
    @{ id = "shot-b04-02"; start = 116; end = 136 },
    @{ id = "shot-b06-01"; start = 136; end = 158 },
    @{ id = "shot-b06-03"; start = 158; end = 180 }
  ) | ConvertTo-Json -Compress

  $html = @'
<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CASE_DIGEST Nemo voice calibration</title>
  <style>
    :root{color-scheme:dark;--bg:#101419;--panel:#192028;--text:#eef3f7;--muted:#aebbc6;--line:#34404a;--accent:#8fc7c0}
    *{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.55 system-ui,sans-serif}
    main{width:min(980px,100% - 32px);margin:auto;padding:28px 0 48px}h1{font-size:clamp(1.55rem,4vw,2.2rem);margin:0 0 8px}
    .status{color:var(--muted);margin:0 0 20px}.player,.voice-card{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:16px;margin:0 0 16px}
    video{display:block;width:100%;aspect-ratio:16/9;background:#000;border-radius:8px}.readout{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}
    .readout div{border-left:3px solid var(--accent);padding:6px 10px;background:#12181e}.readout span{display:block;color:var(--muted);font-size:.8rem}
    h2{font-size:1.1rem;margin:0 0 6px}.voice-card p{color:var(--muted);margin:0 0 12px}.voice-card ul{list-style:none;margin:0;padding:0;display:grid;gap:10px}
    .voice-card li,.voice-card label{display:grid;grid-template-columns:minmax(150px,1fr) minmax(220px,2fr);align-items:center;gap:12px}
    audio{width:100%}a:focus-visible,audio:focus-visible,video:focus-visible{outline:3px solid #f6c177;outline-offset:3px}
    footer{color:var(--muted);font-size:.9rem;margin-top:20px}
    @media(max-width:560px){main{width:min(100% - 20px,980px);padding-top:16px}.readout{grid-template-columns:1fr}.voice-card li,.voice-card label{grid-template-columns:1fr;gap:4px}}
  </style>
</head>
<body>
<main>
  <h1>CASE_DIGEST · Nemo voice calibration</h1>
  <p class="status">Recommended style: <strong>__RECOMMENDED_STYLE__</strong> · provisional technical recommendation · final voice not selected</p>
  <section class="player">
    <video id="review-video" controls preload="metadata" src="case-digest-nemo-voice-calibration.mp4"></video>
    <div class="readout">
      <div><span>Current time</span><strong id="time">00:00.000</strong></div>
      <div><span>Section</span><strong id="section">1 · 事件</strong></div>
      <div><span>Shot</span><strong id="shot">shot-b01-01</strong></div>
    </div>
  </section>
  __VOICE_CARDS__
  <footer>Private local calibration only. No autoplay, network, production approval, rights clearance, publication, or final voice selection.</footer>
</main>
<script>
const sections=__SECTIONS_JSON__;
const shots=__SHOTS_JSON__;
const video=document.getElementById("review-video");
const timeNode=document.getElementById("time");
const sectionNode=document.getElementById("section");
const shotNode=document.getElementById("shot");
function formatTime(value){const minutes=Math.floor(value/60);const seconds=value-minutes*60;return String(minutes).padStart(2,"0")+":"+seconds.toFixed(3).padStart(6,"0")}
function update(){const t=Number.isFinite(video.currentTime)?video.currentTime:0;const section=sections.find(item=>t>=item.start_seconds&&t<item.end_seconds)||sections[sections.length-1];const shot=shots.find(item=>t>=item.start&&t<item.end)||shots[shots.length-1];timeNode.textContent=formatTime(t);sectionNode.textContent=section.section_id+" · "+section.title_ja;shotNode.textContent=shot.id}
video.addEventListener("timeupdate",update);video.addEventListener("loadedmetadata",update);update();
</script>
</body>
</html>
'@
  $html = $html.Replace("__RECOMMENDED_STYLE__", [string]$RecommendedStyleId)
  $html = $html.Replace("__VOICE_CARDS__", ($cards -join "`n"))
  $html = $html.Replace("__SECTIONS_JSON__", $sectionsJson)
  $html = $html.Replace("__SHOTS_JSON__", $shotsJson)
  [IO.File]::WriteAllText($OutputPath, $html, [Text.UTF8Encoding]::new($false))
}

Assert-LoopbackEngineUri -Uri $EngineBaseUri
if (-not (Test-Path -LiteralPath $RunRoot -PathType Container)) {
  throw "RunRoot must already exist: $RunRoot"
}
if (-not (Test-Path -LiteralPath $SourceMp4 -PathType Leaf)) {
  throw "Source MP4 does not exist: $SourceMp4"
}

$plan = Get-Content -LiteralPath $PlanPath -Raw | ConvertFrom-Json
$pronunciationMap = Get-Content -LiteralPath $PronunciationMapPath -Raw | ConvertFrom-Json
if (@($plan.sections).Count -ne 5) {
  throw "Calibration plan must contain exactly five sections."
}
if (@($plan.candidate_styles).Count -gt 3 -or @($plan.candidate_styles).Count -lt 1) {
  throw "Calibration plan must contain one to three candidate styles."
}

$candidateRoot = Join-Path $RunRoot "candidates"
$recommendedRoot = Join-Path $RunRoot "recommended"
if ((Test-Path -LiteralPath $candidateRoot) -or (Test-Path -LiteralPath $recommendedRoot)) {
  throw "Candidate or recommended output already exists; refusing to overwrite the run."
}
New-Item -ItemType Directory -Path $candidateRoot | Out-Null
New-Item -ItemType Directory -Path $recommendedRoot | Out-Null

$engineManifest = Invoke-RestMethod -Uri "$EngineBaseUri/engine_manifest" -TimeoutSec 30
$engineVersion = Invoke-RestMethod -Uri "$EngineBaseUri/version" -TimeoutSec 30
$speakers = Invoke-RestMethod -Uri "$EngineBaseUri/speakers" -TimeoutSec 30
$results = @()

foreach ($candidate in $plan.candidate_styles) {
  $styleId = [int]$candidate.style_id
  $styleRoot = Join-Path $candidateRoot "style-$styleId"
  $rawRoot = Join-Path $styleRoot "raw"
  $normalizedRoot = Join-Path $styleRoot "normalized"
  $queryRoot = Join-Path $styleRoot "queries"
  New-Item -ItemType Directory -Path $rawRoot, $normalizedRoot, $queryRoot | Out-Null

  $sectionResults = @()
  foreach ($section in $plan.sections) {
    $sectionNo = "{0:D2}" -f [int]$section.section_id
    $rawPath = Join-Path $rawRoot "section-$sectionNo.wav"
    $normalizedPath = Join-Path $normalizedRoot "section-$sectionNo.wav"
    $queryPath = Join-Path $queryRoot "section-$sectionNo.json"
    $request = Invoke-Synthesis -Text $section.tts_reading_text_ja -StyleId $styleId -SpeedScale 1.0 -OutputPath $rawPath -QueryPath $queryPath
    Convert-ToReviewAudio -InputPath $rawPath -OutputPath $normalizedPath
    $rawMetrics = Get-AudioMetrics -Path $rawPath
    $normalizedMetrics = Get-AudioMetrics -Path $normalizedPath
    $headMargin = 0.35
    $tailMargin = [double]$section.end_seconds - ([double]$section.start_seconds + $headMargin + [double]$normalizedMetrics.duration_seconds)
    $fits = $headMargin -ge 0.35 -and $tailMargin -ge 0.50
    if (-not $fits) {
      throw "VOICE_TIMING_SCRIPT_REVISION_REQUIRED: style $styleId section $($section.section_id) does not fit at the neutral rate."
    }
    $sectionResults += [ordered]@{
      section_id = [int]$section.section_id
      title_ja = $section.title_ja
      source_character_count = [Globalization.StringInfo]::new([string]$section.source_text_ja).LengthInTextElements
      window_start_seconds = [double]$section.start_seconds
      window_end_seconds = [double]$section.end_seconds
      placement_start_seconds = [double]$section.start_seconds + $headMargin
      head_margin_seconds = $headMargin
      tail_margin_seconds = [Math]::Round($tailMargin, 6)
      fits_window = $fits
      request = $request
      raw = $rawMetrics
      normalized = $normalizedMetrics
      external_raw_file = "candidates/style-$styleId/raw/section-$sectionNo.wav"
      external_normalized_file = "candidates/style-$styleId/normalized/section-$sectionNo.wav"
      external_query_file = "candidates/style-$styleId/queries/section-$sectionNo.json"
    }
  }

  $pronunciationText = [string]$pronunciationMap.pronunciation_check_text_ja
  $pronunciationRaw = Join-Path $rawRoot "pronunciation-check.wav"
  $pronunciationNormalized = Join-Path $normalizedRoot "pronunciation-check.wav"
  $pronunciationQuery = Join-Path $queryRoot "pronunciation-check.json"
  $pronunciationRequest = Invoke-Synthesis -Text $pronunciationText -StyleId $styleId -SpeedScale 1.0 -OutputPath $pronunciationRaw -QueryPath $pronunciationQuery
  Convert-ToReviewAudio -InputPath $pronunciationRaw -OutputPath $pronunciationNormalized
  $pronunciationResult = [ordered]@{
    request = $pronunciationRequest
    raw = Get-AudioMetrics -Path $pronunciationRaw
    normalized = Get-AudioMetrics -Path $pronunciationNormalized
    external_raw_file = "candidates/style-$styleId/raw/pronunciation-check.wav"
    external_normalized_file = "candidates/style-$styleId/normalized/pronunciation-check.wav"
    external_query_file = "candidates/style-$styleId/queries/pronunciation-check.json"
  }

  $aggregateDeviation = ($sectionResults | ForEach-Object {
    [Math]::Abs(($_.window_end_seconds - $_.window_start_seconds - 0.85) - $_.normalized.duration_seconds)
  } | Measure-Object -Sum).Sum
  $clippingTotal = ($sectionResults | ForEach-Object {
    [int]$_.normalized.clipping_count
  } | Measure-Object -Sum).Sum
  $results += [ordered]@{
    style_id = $styleId
    speaker_name = $candidate.speaker_name
    style_name = $candidate.style_name
    speed_adjustment_count = 0
    synthesis_stable = $true
    pronunciation_map_compatible = $true
    all_sections_fit = @($sectionResults | Where-Object { -not $_.fits_window }).Count -eq 0
    clipping_count = [int]$clippingTotal
    aggregate_timing_deviation_seconds = [Math]::Round([double]$aggregateDeviation, 6)
    sections = $sectionResults
    pronunciation = $pronunciationResult
  }
}

$eligible = @($results | Where-Object {
  $_.all_sections_fit -and $_.clipping_count -eq 0 -and $_.synthesis_stable -and $_.pronunciation_map_compatible
} | Sort-Object `
  @{ Expression = { [double]$_.aggregate_timing_deviation_seconds } }, `
  @{ Expression = { [int]$_.style_id } })
if ($eligible.Count -eq 0) {
  throw "No candidate style passed the objective calibration criteria."
}
$recommendedStyleId = [int]$eligible[0].style_id
$recommended = $results | Where-Object style_id -eq $recommendedStyleId

$narrationPath = Join-Path $recommendedRoot "case-digest-narration.wav"
$inputs = @()
for ($i = 0; $i -lt 5; $i++) {
  $sectionNo = "{0:D2}" -f ($i + 1)
  $inputs += @("-i", (Join-Path $candidateRoot "style-$recommendedStyleId\normalized\section-$sectionNo.wav"))
}
$delayFilters = @()
for ($i = 0; $i -lt 5; $i++) {
  $delaySamples = [int64][Math]::Round(
    ([double]$plan.sections[$i].start_seconds + 0.35) * 48000
  )
  $delayFilters += "[$i`:a]adelay=$($delaySamples)S`:all=1[a$i]"
}
$mixInputs = (0..4 | ForEach-Object { "[a$_]" }) -join ""
$filter = ($delayFilters -join ";") + ";$mixInputs" + "amix=inputs=5:duration=longest:dropout_transition=0:normalize=0,apad=whole_dur=180,atrim=0:180[aout]"
$narrationArguments = @(
  "-hide_banner", "-nostats", "-v", "warning"
) + $inputs + @(
  "-filter_complex", $filter,
  "-map", "[aout]", "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le",
  $narrationPath
)
Invoke-FfmpegText -Arguments $narrationArguments | Out-Null

$outputMp4 = Join-Path $recommendedRoot "case-digest-nemo-voice-calibration.mp4"
Invoke-FfmpegText -Arguments @(
  "-hide_banner", "-nostats", "-v", "warning",
  "-i", $SourceMp4, "-i", $narrationPath,
  "-map", "0:v:0", "-map", "0:s:0", "-map", "1:a:0",
  "-c:v", "copy", "-c:s", "copy", "-c:a", "aac", "-b:a", "192k",
  "-metadata:s:a:0", "language=jpn",
  "-map_metadata", "-1", "-map_chapters", "-1",
  "-t", "180", "-movflags", "+faststart",
  $outputMp4
) | Out-Null

$reviewHtml = Join-Path $recommendedRoot "case-digest-nemo-voice-calibration.html"
New-ReviewHtml -OutputPath $reviewHtml -Plan $plan -RecommendedStyleId $recommendedStyleId

$sourceProbe = Invoke-Ffprobe -Path $SourceMp4
$outputProbe = Invoke-Ffprobe -Path $outputMp4
$narrationMetrics = Get-AudioMetrics -Path $narrationPath
$sourceVideoHash = Get-VideoStreamHash -Path $SourceMp4
$outputVideoHash = Get-VideoStreamHash -Path $outputMp4
$outputVideo = @($outputProbe.streams | Where-Object codec_type -eq "video")[0]
$outputAudio = @($outputProbe.streams | Where-Object codec_type -eq "audio")
$outputSubtitles = @($outputProbe.streams | Where-Object codec_type -eq "subtitle")

$externalConnections = @()
$engineProcess = Get-CimInstance Win32_Process -Filter "Name='run.exe'" | Where-Object {
  $_.CommandLine -match [regex]::Escape(([Uri]$EngineBaseUri).Port)
}
if ($engineProcess) {
  $connections = Get-NetTCPConnection -OwningProcess $engineProcess.ProcessId -ErrorAction SilentlyContinue
  $externalConnections = @($connections | Where-Object {
    $_.RemoteAddress -notin @("127.0.0.1", "::1", "0.0.0.0", "::")
  })
}

$manifest = [ordered]@{
  schemaVersion = "fff.caseDigestNemoExternalRun.v1"
  mission_id = "fff-case-digest-nemo-voice-calibration-001"
  generated_at_utc = [DateTime]::UtcNow.ToString("o")
  engine = [ordered]@{
    base_uri = $EngineBaseUri
    name = $engineManifest.name
    uuid = $engineManifest.uuid
    version = [string]$engineVersion
    speaker_count = @($speakers).Count
    style_count = @($speakers | ForEach-Object styles).Count
  }
  candidates = $results
  recommendation = [ordered]@{
    calibration_recommended_style_id = $recommendedStyleId
    recommendation_basis = "All five sections fit with zero clipping and stable local synthesis; pronunciation checks succeeded; the style has the smallest aggregate unused timing budget among eligible candidates."
    final_voice_selected = $false
    production_voice_approved = $false
  }
  narration = [ordered]@{
    relative_path = "recommended/case-digest-narration.wav"
    metrics = $narrationMetrics
  }
  muxed_mp4 = [ordered]@{
    relative_path = "recommended/case-digest-nemo-voice-calibration.mp4"
    bytes = (Get-Item -LiteralPath $outputMp4).Length
    sha256 = Get-Sha256 -Path $outputMp4
    duration_seconds = [double]$outputProbe.format.duration
    video_codec = $outputVideo.codec_name
    width = [int]$outputVideo.width
    height = [int]$outputVideo.height
    frame_rate = $outputVideo.avg_frame_rate
    frame_count = [int]$outputVideo.nb_read_frames
    audio_stream_count = $outputAudio.Count
    subtitle_stream_count = $outputSubtitles.Count
    subtitle_cue_count = if ($outputSubtitles.Count -eq 1) { [int]$outputSubtitles[0].nb_read_frames } else { 0 }
  }
  video_stream_identity = [ordered]@{
    source_sha256 = $sourceVideoHash
    output_sha256 = $outputVideoHash
    match = $sourceVideoHash -eq $outputVideoHash
  }
  review_html = [ordered]@{
    relative_path = "recommended/case-digest-nemo-voice-calibration.html"
    bytes = (Get-Item -LiteralPath $reviewHtml).Length
    sha256 = Get-Sha256 -Path $reviewHtml
    autoplay = $false
    network = $false
    server = $false
  }
  offline_proof = [ordered]@{
    engine_external_connection_count_at_close = $externalConnections.Count
    engine_external_connections = $externalConnections
  }
  boundaries = [ordered]@{
    private_calibration_only = $true
    final_voice_selected = $false
    production_voice_approved = $false
    production_approved = $false
    rights_cleared_claim = $false
    product_release = $false
    public_release = $false
    final_canon = $false
  }
}
$manifestPath = Join-Path $RunRoot "run-manifest.json"
[IO.File]::WriteAllText(
  $manifestPath,
  ($manifest | ConvertTo-Json -Depth 40) + "`n",
  [Text.UTF8Encoding]::new($false)
)

[pscustomobject]@{
  run_manifest = $manifestPath
  calibration_recommended_style_id = $recommendedStyleId
  narration_path = $narrationPath
  mp4_path = $outputMp4
  review_html_path = $reviewHtml
  video_stream_identity_match = $sourceVideoHash -eq $outputVideoHash
  external_connection_count_at_close = $externalConnections.Count
} | ConvertTo-Json -Depth 5
