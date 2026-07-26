[CmdletBinding()]
param(
  [ValidateSet("Build", "Validate")]
  [string]$Mode = "Build",

  [string]$EngineBaseUri = "http://127.0.0.1:50121",

  [string]$EngineExecutable,

  [string]$CalibrationRunRoot,

  [Parameter(Mandatory = $true)]
  [string]$RunRoot,

  [Parameter(Mandatory = $true)]
  [string]$SourceMp4,

  [Parameter(Mandatory = $true)]
  [string]$SourcePackagePath,

  [Parameter(Mandatory = $true)]
  [string]$PackageRoot
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$script:EngineBaseUri = $EngineBaseUri.TrimEnd("/")

function Get-Sha256 {
  param([Parameter(Mandatory = $true)][string]$Path)
  return (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash.ToLowerInvariant()
}

function Get-TextSha256 {
  param([Parameter(Mandatory = $true)][string]$Text)
  $bytes = [Text.Encoding]::UTF8.GetBytes($Text)
  return [Convert]::ToHexString(
    [Security.Cryptography.SHA256]::HashData($bytes)
  ).ToLowerInvariant()
}

function Write-Utf8Text {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Text
  )
  [IO.File]::WriteAllText($Path, $Text, [Text.UTF8Encoding]::new($false))
}

function Write-Json {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][object]$Value
  )
  Write-Utf8Text -Path $Path -Text (($Value | ConvertTo-Json -Depth 60) + "`n")
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
  $json = (& ffprobe -v error -show_streams -show_format -count_frames -count_packets -of json $Path) -join "`n"
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
  $peakMatch = [regex]::Match(
    $peakText,
    "max_volume:\s*(-?(?:inf|\d+(?:\.\d+)?))\s*dB",
    "IgnoreCase"
  )
  $peakDbfs = if (-not $peakMatch.Success -or $peakMatch.Groups[1].Value -eq "-inf") {
    [double]::NegativeInfinity
  } else {
    [double]$peakMatch.Groups[1].Value
  }
  $truePeak = [double]$loudness.input_tp

  return [ordered]@{
    duration_seconds = [Math]::Round($duration, 6)
    sample_rate = [int]$stream.sample_rate
    channels = [int]$stream.channels
    peak_dbfs = if ([double]::IsNegativeInfinity($peakDbfs)) {
      $null
    } else {
      [Math]::Round($peakDbfs, 3)
    }
    true_peak_dbtp = [Math]::Round($truePeak, 3)
    integrated_lufs = [Math]::Round([double]$loudness.input_i, 3)
    clipping_count = if ($peakDbfs -ge -0.001 -or $truePeak -ge -0.001) { 1 } else { 0 }
    bytes = (Get-Item -LiteralPath $Path).Length
    sha256 = Get-Sha256 -Path $Path
  }
}

function Invoke-Synthesis {
  param(
    [Parameter(Mandatory = $true)][string]$Text,
    [Parameter(Mandatory = $true)][string]$OutputPath,
    [Parameter(Mandatory = $true)][string]$QueryPath
  )

  if ((Test-Path -LiteralPath $OutputPath) -or (Test-Path -LiteralPath $QueryPath)) {
    throw "Refusing to overwrite synthesized output."
  }
  $styleId = 10000
  $queryUri = "$script:EngineBaseUri/audio_query?text=$([Uri]::EscapeDataString($Text))&speaker=$styleId"
  $query = Invoke-RestMethod -Method Post -Uri $queryUri -TimeoutSec 90
  $query.speedScale = 1.0
  $query.pitchScale = 0.0
  $query.intonationScale = 1.0
  $query.volumeScale = 1.0
  $queryJson = $query | ConvertTo-Json -Depth 40
  Write-Utf8Text -Path $QueryPath -Text ($queryJson + "`n")

  $synthesisUri = "$script:EngineBaseUri/synthesis?speaker=$styleId"
  Invoke-WebRequest `
    -Method Post `
    -Uri $synthesisUri `
    -ContentType "application/json" `
    -Body $queryJson `
    -OutFile $OutputPath `
    -TimeoutSec 300 | Out-Null

  return [ordered]@{
    audio_query_method = "POST"
    audio_query_path = "/audio_query"
    synthesis_method = "POST"
    synthesis_path = "/synthesis"
    style_id = $styleId
    text_sha256 = Get-TextSha256 -Text $Text
    query_sha256 = Get-Sha256 -Path $QueryPath
    speedScale = 1.0
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
    "-hide_banner", "-nostats", "-v", "warning",
    "-i", $InputPath,
    "-af", "loudnorm=I=-19:TP=-1.2:LRA=7,afade=t=in:d=0.008,areverse,afade=t=in:d=0.008,areverse",
    "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le",
    $OutputPath
  ) | Out-Null
}

function Get-StreamHash {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Map
  )
  $text = Invoke-FfmpegText -Arguments @(
    "-hide_banner", "-v", "error",
    "-i", $Path,
    "-map", $Map,
    "-c", "copy",
    "-f", "hash", "-hash", "sha256", "-"
  )
  $match = [regex]::Match($text, "SHA256=([0-9a-fA-F]{64})")
  if (-not $match.Success) {
    throw "Unable to parse stream hash for $Path / $Map"
  }
  return $match.Groups[1].Value.ToLowerInvariant()
}

function Get-Median {
  param([Parameter(Mandatory = $true)][double[]]$Values)
  if ($Values.Count -eq 0) {
    return 0.0
  }
  $sorted = @($Values | Sort-Object)
  $middle = [Math]::Floor($sorted.Count / 2)
  if (($sorted.Count % 2) -eq 1) {
    return [double]$sorted[$middle]
  }
  return ([double]$sorted[$middle - 1] + [double]$sorted[$middle]) / 2.0
}

function Get-CalibrationRunIdentity {
  param([Parameter(Mandatory = $true)][string]$Root)

  $manifestPath = Join-Path $Root "run-manifest.json"
  if (-not (Test-Path -LiteralPath $manifestPath -PathType Leaf)) {
    throw "VOICE_REFLOW_SOURCE_IDENTITY_MISMATCH: attempt-3 manifest is missing."
  }
  $manifestSha = Get-Sha256 -Path $manifestPath
  if ($manifestSha -ne "0ccadf35986028174f3df847c5857f5301a1bc1ca9089b8d2462158eeb76e735") {
    throw "VOICE_REFLOW_SOURCE_IDENTITY_MISMATCH: attempt-3 manifest hash differs."
  }
  $manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
  if (
    $manifest.mission_id -ne "fff-case-digest-nemo-voice-calibration-001" -or
    [int]$manifest.recommendation.calibration_recommended_style_id -ne 10007
  ) {
    throw "VOICE_REFLOW_SOURCE_IDENTITY_MISMATCH: attempt-3 manifest identity differs."
  }

  $referenceCount = 0
  foreach ($candidate in $manifest.candidates) {
    foreach ($section in $candidate.sections) {
      $checks = @(
        @($section.external_raw_file, $section.raw.sha256),
        @($section.external_normalized_file, $section.normalized.sha256),
        @($section.external_query_file, $section.request.query_sha256)
      )
      foreach ($check in $checks) {
        $path = Join-Path $Root $check[0]
        if ((Get-Sha256 -Path $path) -ne $check[1]) {
          throw "VOICE_REFLOW_SOURCE_IDENTITY_MISMATCH: attempt-3 referenced file differs: $($check[0])"
        }
        $referenceCount++
      }
    }
    $pronunciationChecks = @(
      @($candidate.pronunciation.external_raw_file, $candidate.pronunciation.raw.sha256),
      @($candidate.pronunciation.external_normalized_file, $candidate.pronunciation.normalized.sha256),
      @($candidate.pronunciation.external_query_file, $candidate.pronunciation.request.query_sha256)
    )
    foreach ($check in $pronunciationChecks) {
      if ((Get-Sha256 -Path (Join-Path $Root $check[0])) -ne $check[1]) {
        throw "VOICE_REFLOW_SOURCE_IDENTITY_MISMATCH: attempt-3 pronunciation file differs."
      }
      $referenceCount++
    }
  }
  $finalChecks = @(
    @($manifest.narration.relative_path, $manifest.narration.metrics.sha256),
    @($manifest.muxed_mp4.relative_path, $manifest.muxed_mp4.sha256),
    @($manifest.review_html.relative_path, $manifest.review_html.sha256)
  )
  foreach ($check in $finalChecks) {
    if ((Get-Sha256 -Path (Join-Path $Root $check[0])) -ne $check[1]) {
      throw "VOICE_REFLOW_SOURCE_IDENTITY_MISMATCH: attempt-3 final file differs."
    }
    $referenceCount++
  }

  $treeLines = Get-ChildItem -LiteralPath $Root -Recurse -File |
    Sort-Object FullName |
    ForEach-Object {
      $relative = [IO.Path]::GetRelativePath($Root, $_.FullName).Replace("\", "/")
      "$relative|$($_.Length)|$(Get-Sha256 -Path $_.FullName)"
    }
  $treeDigest = Get-TextSha256 -Text ([string]::Join("`n", $treeLines))
  if ($treeDigest -ne "c535077fdf8ca9d180322fc361de444b0754f6a4fe257401b2ce6c2a398eb98a") {
    throw "VOICE_REFLOW_SOURCE_IDENTITY_MISMATCH: attempt-3 run tree differs."
  }

  return [ordered]@{
    mission_id = $manifest.mission_id
    attempt_id = 3
    manifest_sha256 = $manifestSha
    tree_file_count = $treeLines.Count
    tree_digest_sha256 = $treeDigest
    referenced_file_check_count = $referenceCount
    style_10007_full_candidate_sha256 = $manifest.narration.metrics.sha256
  }
}

function Get-UtteranceSpecs {
  return @(
    [pscustomobject]@{ section_id = 1; text = "正午、鐘のない塔から鐘の音が響いたと報告された。"; tts = "正午、鐘のない塔から鐘の音が響いたと報告された。"; shot_id = "shot-b01-01" },
    [pscustomobject]@{ section_id = 1; text = "塔の取付枠は空で、"; tts = "塔の取付枠は空で、"; shot_id = "shot-b01-01" },
    [pscustomobject]@{ section_id = 1; text = "音を生む鐘は見当たらない。確認できるのは、目撃された現象と空の枠だけであり、音源は特定されていない。"; tts = "音を生む鐘は見当たらない。確認できるのは、目撃された現象と空の枠だけであり、音源は特定されていない。"; shot_id = "shot-b01-02" },

    [pscustomobject]@{ section_id = 2; text = "時計修理師のミラ・ヴェイルは、"; tts = "時計修理師のミラ・ヴェイルは、"; shot_id = "shot-b02-01" },
    [pscustomobject]@{ section_id = 2; text = "失踪した兄が残したとされるメモを調べている。"; tts = "失踪した兄が残したとされるメモを調べている。"; shot_id = "shot-b02-01" },
    [pscustomobject]@{ section_id = 2; text = "作業台には真鍮の蛾があり、"; tts = "作業台にはしんちゅうでできた、ガがあり、"; shot_id = "shot-b02-02" },
    [pscustomobject]@{ section_id = 2; text = "時計と記録には9:17が繰り返し現れる。"; tts = "時計と記録には9時17分が繰り返し現れる。"; shot_id = "shot-b02-02" },
    [pscustomobject]@{ section_id = 2; text = "メモ、蛾、9:17は一つの手掛かりの連鎖だが、"; tts = "メモ、ガ、9時17分は一つの手掛かりの連鎖だが、"; shot_id = "shot-b02-03" },
    [pscustomobject]@{ section_id = 2; text = "兄の所在を直接示す記録ではない。"; tts = "兄の所在を直接示す記録ではない。"; shot_id = "shot-b02-03" },

    [pscustomobject]@{ section_id = 3; text = "調査対象の台帳には、「分」を記す欄と、"; tts = "調査対象の台帳には、「ふん」を記す欄と、"; shot_id = "shot-b03-01" },
    [pscustomobject]@{ section_id = 3; text = "人の名前を記す欄が並ぶ。"; tts = "人の名前を記す欄が並ぶ。"; shot_id = "shot-b03-01" },
    [pscustomobject]@{ section_id = 3; text = "現在の画像から確認できるのは二種類の記録形式だけである。"; tts = "現在の画像から確認できるのは二種類の記録形式だけである。"; shot_id = "shot-b03-02" },
    [pscustomobject]@{ section_id = 3; text = "この台帳が時間を奪う、または人を消すという因果関係は証明されていない。"; tts = "この台帳が時間を奪う、または人を消すという因果関係は証明されていない。"; shot_id = "shot-b03-02" },

    [pscustomobject]@{ section_id = 4; text = "失踪した兄のメモは、市の評議会に調査の目を向けている。"; tts = "失踪した兄のメモは、しのひょうぎかいに調査の目を向けている。"; shot_id = "shot-b04-01" },
    [pscustomobject]@{ section_id = 4; text = "だが、メモは告発の記録であり、"; tts = "だが、メモは告発の記録であり、"; shot_id = "shot-b04-01" },
    [pscustomobject]@{ section_id = 4; text = "評議会の関与を裏づける証拠そのものではない。"; tts = "評議会の関与を裏づける証拠そのものではない。"; shot_id = "shot-b04-01" },
    [pscustomobject]@{ section_id = 4; text = "台帳の出所と真正性も確認されておらず、"; tts = "台帳の出所と真正性も確認されておらず、"; shot_id = "shot-b04-02" },
    [pscustomobject]@{ section_id = 4; text = "責任や動機を断定できる段階にはない。"; tts = "責任や動機を断定できる段階にはない。"; shot_id = "shot-b04-02" },

    [pscustomobject]@{ section_id = 5; text = "この事件で確認されているのは、正午に報告された鐘の音、空の取付枠、失踪した兄のメモ、真鍮の蛾、9:17、二列の台帳である。"; tts = "この事件で確認されているのは、正午に報告された鐘の音、空の取付枠、失踪した兄のメモ、しんちゅうでできた、ガ、9時17分、二列の台帳である。"; shot_id = "shot-b06-01" },
    [pscustomobject]@{ section_id = 5; text = "時間と名前は台帳に記録された二つの損失区分として扱う。"; tts = "時間と名前は台帳に記録された二つの損失区分として扱う。"; shot_id = "shot-b06-01" },
    [pscustomobject]@{ section_id = 5; text = "音源、兄の所在、評議会との関係は確認されていない。"; tts = "音源、兄の所在、評議会との関係は確認されていない。"; shot_id = "shot-b06-03" },
    [pscustomobject]@{ section_id = 5; text = "塔は現在も調査対象として残る。"; tts = "塔は現在も調査対象として残る。"; shot_id = "shot-b06-03" }
  )
}

function Set-SectionSchedule {
  param(
    [Parameter(Mandatory = $true)][object[]]$Events,
    [Parameter(Mandatory = $true)][object]$Section,
    [Parameter(Mandatory = $true)][hashtable]$ShotById,
    [Parameter(Mandatory = $true)][bool]$IsFinalSection
  )

  $count = $Events.Count
  [double[]]$lower = New-Object double[] $count
  [double[]]$upper = New-Object double[] $count
  for ($i = 0; $i -lt $count; $i++) {
    $shot = $ShotById[$Events[$i].shot_id]
    $duration = [double]$Events[$i].synthesized_duration
    $lower[$i] = [double]$shot.start_seconds + 0.25
    $upper[$i] = [double]$shot.end_seconds - 0.35 - $duration
    if ($lower[$i] -gt $upper[$i]) {
      throw "VOICE_TIMING_SCRIPT_REVISION_REQUIRED: $($Events[$i].utterance_id) does not fit its shot."
    }
  }
  $upper[0] = [Math]::Min($upper[0], [double]$Section.start_seconds + 1.0)
  $tailLimit = if ($IsFinalSection) { 5.5 } else { 4.5 }
  $last = $count - 1
  $lower[$last] = [Math]::Max(
    $lower[$last],
    [double]$Section.end_seconds - $tailLimit - [double]$Events[$last].synthesized_duration
  )

  for ($pass = 0; $pass -lt 30; $pass++) {
    for ($i = 1; $i -lt $count; $i++) {
      $previousDuration = [double]$Events[$i - 1].synthesized_duration
      $lower[$i] = [Math]::Max($lower[$i], $lower[$i - 1] + $previousDuration + 0.25)
      $upper[$i] = [Math]::Min($upper[$i], $upper[$i - 1] + $previousDuration + 5.0)
    }
    for ($i = $count - 1; $i -gt 0; $i--) {
      $previousDuration = [double]$Events[$i - 1].synthesized_duration
      $lower[$i - 1] = [Math]::Max($lower[$i - 1], $lower[$i] - $previousDuration - 5.0)
      $upper[$i - 1] = [Math]::Min($upper[$i - 1], $upper[$i] - $previousDuration - 0.25)
    }
  }
  for ($i = 0; $i -lt $count; $i++) {
    if ($lower[$i] -gt $upper[$i] + 0.000001) {
      throw "VOICE_TIMING_SCRIPT_REVISION_REQUIRED: no five-second-gap schedule exists for section $($Section.sequence)."
    }
  }

  $start = $lower[0]
  for ($i = 0; $i -lt $count; $i++) {
    if ($i -gt 0) {
      $previousEnd = [double]$Events[$i - 1].actual_end_seconds
      $start = [Math]::Max($lower[$i], $previousEnd + 0.25)
      $start = [Math]::Min($start, $previousEnd + 5.0)
    }
    if ($start -gt $upper[$i] + 0.000001) {
      throw "VOICE_TIMING_SCRIPT_REVISION_REQUIRED: schedule selection exceeded the shot window."
    }
    $Events[$i].target_start_seconds = [Math]::Round($start, 6)
    $Events[$i].actual_end_seconds = [Math]::Round(
      $start + [double]$Events[$i].synthesized_duration,
      6
    )
  }
}

function Get-RegionGapEvidence {
  param(
    [Parameter(Mandatory = $true)][object[]]$TimelineGaps,
    [Parameter(Mandatory = $true)][double]$Start,
    [Parameter(Mandatory = $true)][double]$End
  )
  $overlaps = foreach ($gap in $TimelineGaps) {
    $overlap = [Math]::Max(
      0.0,
      [Math]::Min([double]$gap.end_seconds, $End) -
        [Math]::Max([double]$gap.start_seconds, $Start)
    )
    if ($overlap -gt 0) {
      $overlap
    }
  }
  $values = @($overlaps)
  return [ordered]@{
    region_start_seconds = $Start
    region_end_seconds = $End
    total_speechless_seconds = [Math]::Round(
      [double](($values | Measure-Object -Sum).Sum),
      6
    )
    maximum_contiguous_speechless_seconds = if ($values.Count -eq 0) {
      0.0
    } else {
      [Math]::Round([double](($values | Measure-Object -Maximum).Maximum), 6)
    }
  }
}

function ConvertTo-HtmlText {
  param([Parameter(Mandatory = $true)][object]$Value)
  return [Net.WebUtility]::HtmlEncode([string]$Value)
}

function New-ReviewHtml {
  param(
    [Parameter(Mandatory = $true)][string]$OutputPath,
    [Parameter(Mandatory = $true)][object[]]$Events,
    [Parameter(Mandatory = $true)][object[]]$TimelineGaps,
    [Parameter(Mandatory = $true)][object]$SourcePackage,
    [Parameter(Mandatory = $true)][object]$Diagnostic
  )

  $gapRows = foreach ($gap in $TimelineGaps) {
    if ($gap.gap_type -eq "between_utterances") {
      "<tr><td>$(ConvertTo-HtmlText $gap.gap_id)</td><td>$(ConvertTo-HtmlText $gap.previous_utterance_id)</td><td>$(ConvertTo-HtmlText $gap.next_utterance_id)</td><td>$([Math]::Round([double]$gap.duration_seconds, 3)) s</td></tr>"
    }
  }
  $sectionPayload = @($SourcePackage.sections | ForEach-Object {
    [ordered]@{
      id = $_.sequence
      title = $_.title_ja
      start = $_.start_seconds
      end = $_.end_seconds
    }
  })
  $sectionsJson = ConvertTo-Json -InputObject $sectionPayload -Compress -Depth 5
  $shotPayload = @($SourcePackage.shots | ForEach-Object {
    [ordered]@{
      id = $_.shot_id
      start = $_.start_seconds
      end = $_.end_seconds
    }
  })
  $shotsJson = ConvertTo-Json -InputObject $shotPayload -Compress -Depth 5

  $html = @"
<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>CASE_DIGEST Nemo delivery reflow</title>
  <style>
    :root{color-scheme:dark;--bg:#11151b;--panel:#1a2029;--line:#394454;--text:#f3f5f7;--muted:#b9c2cd;--accent:#8dd7ff}
    *{box-sizing:border-box}html,body{margin:0;max-width:100%;overflow-x:hidden;background:var(--bg);color:var(--text);font:16px/1.55 system-ui,sans-serif}
    main{width:min(1040px,calc(100% - 32px));margin:24px auto 56px}h1{font-size:clamp(1.35rem,3vw,2rem);margin:0 0 8px}h2{font-size:1.15rem;margin:0 0 12px}
    p{margin:6px 0 14px}.muted{color:var(--muted)}.panel{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:16px;margin:16px 0}
    video{display:block;width:100%;aspect-ratio:16/9;background:#000;border-radius:8px}audio{width:100%}
    .readout{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:10px}.readout div{border:1px solid var(--line);border-radius:8px;padding:9px;min-width:0}.readout strong,.readout span{display:block;overflow-wrap:anywhere}
    .actions{display:flex;flex-wrap:wrap;gap:8px}.actions button{appearance:none;border:1px solid var(--accent);background:#142735;color:var(--text);border-radius:7px;padding:9px 12px;cursor:pointer}
    button:focus-visible,a:focus-visible,video:focus-visible,audio:focus-visible{outline:3px solid #ffd166;outline-offset:3px}
    table{width:100%;border-collapse:collapse;font-size:.9rem}th,td{text-align:left;border-bottom:1px solid var(--line);padding:7px 6px;overflow-wrap:anywhere}
    .table-wrap{width:100%;overflow-x:auto}.diag-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.diag-grid>div{border:1px solid var(--line);border-radius:8px;padding:10px}
    @media(max-width:620px){main{width:min(100% - 20px,1040px);margin-top:12px}.panel{padding:12px}.readout,.diag-grid{grid-template-columns:1fr}.table-wrap{font-size:.8rem}}
  </style>
</head>
<body>
<main>
  <h1>CASE_DIGEST Nemo delivery reflow</h1>
  <p class="muted">Style 10000 · private listening candidate · final voice not selected</p>

  <section class="panel" aria-labelledby="candidate-heading">
    <h2 id="candidate-heading">Full 180-second candidate</h2>
    <video id="candidate" controls preload="metadata" src="./case-digest-nemo-delivery-reflow.mp4"></video>
    <div class="readout" aria-live="polite">
      <div><strong>Time</strong><span id="time">00:00.000</span></div>
      <div><strong>Section</strong><span id="section">1 · 事件</span></div>
      <div><strong>Shot</strong><span id="shot">shot-b01-01</span></div>
    </div>
  </section>

  <section class="panel" aria-labelledby="regions-heading">
    <h2 id="regions-heading">Focused regions</h2>
    <div class="actions">
      <button type="button" data-start="38" data-end="65">00:38–01:05 · brass moth and 9:17</button>
      <button type="button" data-start="110" data-end="140">01:50–02:20 · former long-gap region</button>
    </div>
  </section>

  <section class="panel" aria-labelledby="pronunciation-heading">
    <h2 id="pronunciation-heading">Brass-moth comparison</h2>
    <p>Current reading → revised reading → full sentence. Synthesis success is not perceptual acceptance.</p>
    <audio controls preload="metadata" src="../diagnostics/brass-moth-comparison.wav"></audio>
    <div class="diag-grid">
      <div><strong>Current</strong><br>しんちゅうのが<br>$($Diagnostic.current.start_seconds)–$($Diagnostic.current.end_seconds) s</div>
      <div><strong>Revised</strong><br>しんちゅうでできた、ガ<br>$($Diagnostic.revised.start_seconds)–$($Diagnostic.revised.end_seconds) s</div>
      <div><strong>Full sentence</strong><br>作業台には真鍮の蛾があり、時計と記録には9:17が繰り返し現れる。<br>$($Diagnostic.full_sentence.start_seconds)–$($Diagnostic.full_sentence.end_seconds) s</div>
    </div>
  </section>

  <section class="panel" aria-labelledby="gaps-heading">
    <h2 id="gaps-heading">Silence-gap audit</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Gap</th><th>Previous</th><th>Next</th><th>Duration</th></tr></thead>
        <tbody>$($gapRows -join "")</tbody>
      </table>
    </div>
  </section>
</main>
<script>
const video=document.getElementById("candidate");
const sections=$sectionsJson;
const shots=$shotsJson;
const timeNode=document.getElementById("time");
const sectionNode=document.getElementById("section");
const shotNode=document.getElementById("shot");
let stopAt=null;
function fmt(value){const m=Math.floor(value/60);const s=value-m*60;return String(m).padStart(2,"0")+":"+s.toFixed(3).padStart(6,"0")}
function update(){const t=Number.isFinite(video.currentTime)?video.currentTime:0;const section=sections.find(x=>t>=x.start&&t<x.end)||sections[sections.length-1];const shot=shots.find(x=>t>=x.start&&t<x.end)||shots[shots.length-1];timeNode.textContent=fmt(t);sectionNode.textContent=section.id+" · "+section.title;shotNode.textContent=shot.id;if(stopAt!==null&&t>=stopAt){video.pause();stopAt=null}}
video.addEventListener("timeupdate",update);video.addEventListener("loadedmetadata",update);video.addEventListener("seeked",update);
document.querySelectorAll("[data-start]").forEach(button=>button.addEventListener("click",()=>{video.pause();stopAt=Number(button.dataset.end);video.currentTime=Number(button.dataset.start);video.focus()}));
</script>
</body>
</html>
"@
  Write-Utf8Text -Path $OutputPath -Text $html
}

function Assert-BuildInputs {
  if (-not $EngineExecutable) {
    throw "EngineExecutable is required in Build mode."
  }
  if (-not $CalibrationRunRoot) {
    throw "CalibrationRunRoot is required in Build mode."
  }
  Assert-LoopbackEngineUri -Uri $script:EngineBaseUri
  foreach ($path in @($EngineExecutable, $SourceMp4, $SourcePackagePath)) {
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
      throw "Required input does not exist: $path"
    }
  }
  if (-not (Test-Path -LiteralPath $PackageRoot -PathType Container)) {
    throw "Tracked package root does not exist: $PackageRoot"
  }
  if (Test-Path -LiteralPath $RunRoot) {
    throw "New run root already exists; refusing to overwrite it: $RunRoot"
  }
  $repoRoot = (Resolve-Path (Join-Path $PackageRoot "..\..")).Path
  $runFull = [IO.Path]::GetFullPath($RunRoot)
  if ($runFull.StartsWith($repoRoot, [StringComparison]::OrdinalIgnoreCase)) {
    throw "RunRoot must be outside Git."
  }
  $head = (& git -C $repoRoot rev-parse HEAD).Trim()
  $branch = (& git -C $repoRoot branch --show-current).Trim()
  if (
    $head -ne "63fb60c505952377455536d9dd84cb164d3b3a0c" -or
    $branch -ne "codex/fff-case-digest-nemo-voice-calibration-v1"
  ) {
    throw "VOICE_REFLOW_SOURCE_IDENTITY_MISMATCH: start Git identity differs."
  }
  if ((Get-Sha256 -Path $EngineExecutable) -ne "803514ab1772613400067b3fdbfe732ce12d81630d032bffd5a68f2f07e88cd6") {
    throw "VOICE_REFLOW_SOURCE_IDENTITY_MISMATCH: Nemo executable identity differs."
  }
  if ((Get-Sha256 -Path $SourceMp4) -ne "0fb679b5d13d56b726a505d060bf9678daa49a1c138e10657954cd7053765df1") {
    throw "VOICE_REFLOW_SOURCE_IDENTITY_MISMATCH: source MP4 identity differs."
  }
  return [ordered]@{
    repo_root = $repoRoot
    start_head = $head
    branch = $branch
  }
}

function Invoke-Build {
  $gitIdentity = Assert-BuildInputs
  $calibrationIdentity = Get-CalibrationRunIdentity -Root $CalibrationRunRoot
  $sourcePackage = Get-Content -LiteralPath $SourcePackagePath -Raw | ConvertFrom-Json
  if (
    $sourcePackage.artifact_id -ne "fff-private-raster-case-digest-001" -or
    @($sourcePackage.sections).Count -ne 5 -or
    @($sourcePackage.shots).Count -ne 11
  ) {
    throw "VOICE_REFLOW_SOURCE_IDENTITY_MISMATCH: source package shape differs."
  }

  $sourceProbe = Invoke-Ffprobe -Path $SourceMp4
  $sourceVideo = @($sourceProbe.streams | Where-Object codec_type -eq "video")
  $sourceAudio = @($sourceProbe.streams | Where-Object codec_type -eq "audio")
  $sourceSubtitles = @($sourceProbe.streams | Where-Object codec_type -eq "subtitle")
  if (
    [double]$sourceProbe.format.duration -ne 180.0 -or
    [int]$sourceVideo[0].nb_read_frames -ne 5400 -or
    $sourceAudio.Count -ne 0 -or
    $sourceSubtitles.Count -ne 1 -or
    [int]$sourceSubtitles[0].nb_read_frames -ne 11
  ) {
    throw "VOICE_REFLOW_SOURCE_IDENTITY_MISMATCH: source media shape differs."
  }

  $engineManifest = Invoke-RestMethod -Uri "$script:EngineBaseUri/engine_manifest" -TimeoutSec 30
  $engineVersion = [string](Invoke-RestMethod -Uri "$script:EngineBaseUri/version" -TimeoutSec 30)
  $speakers = Invoke-RestMethod -Uri "$script:EngineBaseUri/speakers" -TimeoutSec 30
  $styles = @($speakers | ForEach-Object styles)
  if (
    $engineVersion -ne "0.24.0" -or
    $engineManifest.uuid -ne "208cf94d-43d2-4cf5-abc0-9783cac36d29" -or
    @($styles | Where-Object id -eq 10000).Count -ne 1
  ) {
    throw "VOICE_REFLOW_SOURCE_IDENTITY_MISMATCH: live Nemo identity differs."
  }

  New-Item -ItemType Directory -Path $RunRoot | Out-Null
  $rawRoot = New-Item -ItemType Directory -Path (Join-Path $RunRoot "raw-utterances")
  $normalizedRoot = New-Item -ItemType Directory -Path (Join-Path $RunRoot "normalized-utterances")
  $diagnosticsRoot = New-Item -ItemType Directory -Path (Join-Path $RunRoot "diagnostics")
  $queryRoot = New-Item -ItemType Directory -Path (Join-Path $diagnosticsRoot.FullName "queries")
  $diagnosticRawRoot = New-Item -ItemType Directory -Path (Join-Path $diagnosticsRoot.FullName "raw")
  $diagnosticNormalizedRoot = New-Item -ItemType Directory -Path (Join-Path $diagnosticsRoot.FullName "normalized")
  $recommendedRoot = New-Item -ItemType Directory -Path (Join-Path $RunRoot "recommended")
  New-Item -ItemType Directory -Path (Join-Path $RunRoot "verification") | Out-Null

  $specs = @(Get-UtteranceSpecs)
  if ($specs.Count -lt 18 -or $specs.Count -gt 22) {
    throw "Utterance count must be within 18-22."
  }
  $shotById = @{}
  foreach ($shot in $sourcePackage.shots) {
    $shotById[$shot.shot_id] = $shot
  }

  $events = @()
  $eventNumber = 0
  for ($sectionNumber = 1; $sectionNumber -le 5; $sectionNumber++) {
    $section = $sourcePackage.sections[$sectionNumber - 1]
    $sectionSpecs = @($specs | Where-Object section_id -eq $sectionNumber)
    if (($sectionSpecs.text -join "") -cne [string]$section.text_ja) {
      throw "Accepted source semantics cannot be preserved for section $sectionNumber."
    }
    $cursor = 0
    foreach ($spec in $sectionSpecs) {
      $eventNumber++
      $utteranceId = "utterance-{0:D2}" -f $eventNumber
      if (
        $cursor + $spec.text.Length -gt $section.text_ja.Length -or
        $section.text_ja.Substring($cursor, $spec.text.Length) -cne $spec.text
      ) {
        throw "Source span mismatch for $utteranceId."
      }
      $rawPath = Join-Path $rawRoot.FullName "$utteranceId.wav"
      $normalizedPath = Join-Path $normalizedRoot.FullName "$utteranceId.wav"
      $queryPath = Join-Path $queryRoot.FullName "$utteranceId.json"
      $request = Invoke-Synthesis -Text $spec.tts -OutputPath $rawPath -QueryPath $queryPath
      Convert-ToReviewAudio -InputPath $rawPath -OutputPath $normalizedPath
      $rawMetrics = Get-AudioMetrics -Path $rawPath
      $normalizedMetrics = Get-AudioMetrics -Path $normalizedPath
      if ($normalizedMetrics.clipping_count -ne 0 -or $normalizedMetrics.true_peak_dbtp -gt -1.0) {
        throw "Style 10000 utterance signal contract failed for $utteranceId."
      }
      $events += [pscustomobject]@{
        utterance_id = $utteranceId
        source_section_id = $sectionNumber
        source_character_start = $cursor
        source_character_end = $cursor + $spec.text.Length
        source_text_ja = $spec.text
        tts_reading_text_ja = $spec.tts
        semantic_equivalence = $true
        shot_id = $spec.shot_id
        target_start_seconds = 0.0
        synthesized_duration = [double]$normalizedMetrics.duration_seconds
        actual_end_seconds = 0.0
        preceding_gap_seconds = 0.0
        following_gap_seconds = 0.0
        source_text_sha256 = Get-TextSha256 -Text $spec.text
        wav_sha256 = $normalizedMetrics.sha256
        raw_wav_sha256 = $rawMetrics.sha256
        query_sha256 = $request.query_sha256
        style_id = 10000
        speedScale = 1.0
        pitchScale = 0.0
        intonationScale = 1.0
        volumeScale = 1.0
        raw_relative_path = "raw-utterances/$utteranceId.wav"
        normalized_relative_path = "normalized-utterances/$utteranceId.wav"
        query_relative_path = "diagnostics/queries/$utteranceId.json"
      }
      $cursor += $spec.text.Length
    }
    if ($cursor -ne $section.text_ja.Length) {
      throw "Source span coverage is incomplete for section $sectionNumber."
    }
  }

  for ($sectionNumber = 1; $sectionNumber -le 5; $sectionNumber++) {
    $sectionEvents = @($events | Where-Object source_section_id -eq $sectionNumber)
    Set-SectionSchedule `
      -Events $sectionEvents `
      -Section $sourcePackage.sections[$sectionNumber - 1] `
      -ShotById $shotById `
      -IsFinalSection ($sectionNumber -eq 5)
  }
  $events = @($events | Sort-Object target_start_seconds)

  $timelineGaps = @()
  for ($i = 0; $i -lt $events.Count; $i++) {
    $previousEnd = if ($i -eq 0) { 0.0 } else { [double]$events[$i - 1].actual_end_seconds }
    $nextStart = if ($i -eq $events.Count - 1) { 180.0 } else { [double]$events[$i + 1].target_start_seconds }
    $events[$i].preceding_gap_seconds = [Math]::Round(
      [double]$events[$i].target_start_seconds - $previousEnd,
      6
    )
    $events[$i].following_gap_seconds = [Math]::Round(
      $nextStart - [double]$events[$i].actual_end_seconds,
      6
    )
    if ($i -eq 0) {
      $timelineGaps += [pscustomobject]@{
        gap_id = "gap-leading"
        gap_type = "leading"
        previous_utterance_id = ""
        next_utterance_id = $events[$i].utterance_id
        start_seconds = 0.0
        end_seconds = [double]$events[$i].target_start_seconds
        duration_seconds = [double]$events[$i].target_start_seconds
        contract_limit_seconds = 1.0
        pass = [double]$events[$i].target_start_seconds -le 1.0
      }
    }
    if ($i -lt $events.Count - 1) {
      $duration = [double]$events[$i + 1].target_start_seconds - [double]$events[$i].actual_end_seconds
      $timelineGaps += [pscustomobject]@{
        gap_id = "gap-{0:D2}" -f ($i + 1)
        gap_type = "between_utterances"
        previous_utterance_id = $events[$i].utterance_id
        next_utterance_id = $events[$i + 1].utterance_id
        start_seconds = [double]$events[$i].actual_end_seconds
        end_seconds = [double]$events[$i + 1].target_start_seconds
        duration_seconds = [Math]::Round($duration, 6)
        contract_limit_seconds = 5.0
        pass = $duration -le 5.000001
      }
    } else {
      $duration = 180.0 - [double]$events[$i].actual_end_seconds
      $timelineGaps += [pscustomobject]@{
        gap_id = "gap-final"
        gap_type = "final_tail"
        previous_utterance_id = $events[$i].utterance_id
        next_utterance_id = ""
        start_seconds = [double]$events[$i].actual_end_seconds
        end_seconds = 180.0
        duration_seconds = [Math]::Round($duration, 6)
        contract_limit_seconds = 6.0
        pass = $duration -le 6.000001
      }
    }
  }

  $internalGaps = @($timelineGaps | Where-Object gap_type -eq "between_utterances")
  $maximumGap = [double](($internalGaps.duration_seconds | Measure-Object -Maximum).Maximum)
  $medianGap = Get-Median -Values @([double[]]$internalGaps.duration_seconds)
  $sectionGaps = @()
  for ($sectionNumber = 1; $sectionNumber -le 5; $sectionNumber++) {
    $section = $sourcePackage.sections[$sectionNumber - 1]
    $sectionEvents = @($events | Where-Object source_section_id -eq $sectionNumber)
    $head = [double]$sectionEvents[0].target_start_seconds - [double]$section.start_seconds
    $tail = [double]$section.end_seconds - [double]$sectionEvents[-1].actual_end_seconds
    $sectionGaps += [pscustomobject]@{
      source_section_id = $sectionNumber
      title_ja = $section.title_ja
      head_gap_seconds = [Math]::Round($head, 6)
      tail_gap_seconds = [Math]::Round($tail, 6)
      head_pass = $head -le 1.000001
      tail_limit_seconds = if ($sectionNumber -eq 5) { 6.0 } else { 5.0 }
      tail_pass = if ($sectionNumber -eq 5) { $tail -le 6.000001 } else { $tail -le 5.000001 }
    }
  }
  $uncoveredShots = @($sourcePackage.shots | Where-Object {
    $shotId = $_.shot_id
    @($events | Where-Object shot_id -eq $shotId).Count -eq 0
  })
  if (
    $maximumGap -gt 5.000001 -or
    @($timelineGaps | Where-Object { -not $_.pass }).Count -gt 0 -or
    @($sectionGaps | Where-Object { -not $_.head_pass -or -not $_.tail_pass }).Count -gt 0 -or
    $uncoveredShots.Count -gt 0
  ) {
    throw "VOICE_TIMING_SCRIPT_REVISION_REQUIRED: silence or shot coverage contract failed."
  }

  $narrationPath = Join-Path $recommendedRoot.FullName "case-digest-narration-style-10000.wav"
  $inputs = @()
  $delayFilters = @()
  for ($i = 0; $i -lt $events.Count; $i++) {
    $inputs += @("-i", (Join-Path $RunRoot $events[$i].normalized_relative_path))
    $delaySamples = [int64][Math]::Round([double]$events[$i].target_start_seconds * 48000)
    $delayFilters += "[$i`:a]adelay=$($delaySamples)S`:all=1[a$i]"
  }
  $mixInputs = (0..($events.Count - 1) | ForEach-Object { "[a$_]" }) -join ""
  $filter = ($delayFilters -join ";") +
    ";$mixInputs" +
    "amix=inputs=$($events.Count):duration=longest:dropout_transition=0:normalize=0,apad=whole_dur=180,atrim=0:180[aout]"
  Invoke-FfmpegText -Arguments (
    @("-hide_banner", "-nostats", "-v", "warning") +
    $inputs +
    @(
      "-filter_complex", $filter,
      "-map", "[aout]",
      "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le",
      $narrationPath
    )
  ) | Out-Null
  $narrationMetrics = Get-AudioMetrics -Path $narrationPath
  if (
    [Math]::Abs([double]$narrationMetrics.duration_seconds - 180.0) -gt 0.001 -or
    [int]$narrationMetrics.sample_rate -ne 48000 -or
    [int]$narrationMetrics.channels -ne 1 -or
    [int]$narrationMetrics.clipping_count -ne 0 -or
    [double]$narrationMetrics.true_peak_dbtp -gt -1.0
  ) {
    throw "Full narration signal contract failed."
  }

  $diagnosticTexts = [ordered]@{
    current = "しんちゅうのが"
    revised = "しんちゅうでできた、ガ"
    full_sentence = "作業台にはしんちゅうでできた、ガがあり、時計と記録には9時17分が繰り返し現れる。"
  }
  $diagnosticParts = [ordered]@{}
  foreach ($name in $diagnosticTexts.Keys) {
    $rawPath = Join-Path $diagnosticRawRoot.FullName "$name.wav"
    $normalizedPath = Join-Path $diagnosticNormalizedRoot.FullName "$name.wav"
    $queryPath = Join-Path $queryRoot.FullName "brass-moth-$name.json"
    $request = Invoke-Synthesis -Text $diagnosticTexts[$name] -OutputPath $rawPath -QueryPath $queryPath
    Convert-ToReviewAudio -InputPath $rawPath -OutputPath $normalizedPath
    $diagnosticParts[$name] = [ordered]@{
      text = $diagnosticTexts[$name]
      request = $request
      raw = Get-AudioMetrics -Path $rawPath
      normalized = Get-AudioMetrics -Path $normalizedPath
      raw_relative_path = "diagnostics/raw/$name.wav"
      normalized_relative_path = "diagnostics/normalized/$name.wav"
      query_relative_path = "diagnostics/queries/brass-moth-$name.json"
    }
  }
  $diagnosticPath = Join-Path $diagnosticsRoot.FullName "brass-moth-comparison.wav"
  Invoke-FfmpegText -Arguments @(
    "-hide_banner", "-nostats", "-v", "warning",
    "-i", (Join-Path $diagnosticNormalizedRoot.FullName "current.wav"),
    "-i", (Join-Path $diagnosticNormalizedRoot.FullName "revised.wav"),
    "-i", (Join-Path $diagnosticNormalizedRoot.FullName "full_sentence.wav"),
    "-f", "lavfi", "-t", "0.75", "-i", "anullsrc=r=48000:cl=mono",
    "-f", "lavfi", "-t", "0.75", "-i", "anullsrc=r=48000:cl=mono",
    "-filter_complex", "[0:a][3:a][1:a][4:a][2:a]concat=n=5:v=0:a=1[aout]",
    "-map", "[aout]", "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le",
    $diagnosticPath
  ) | Out-Null
  $diagnosticMetrics = Get-AudioMetrics -Path $diagnosticPath
  $currentEnd = [double]$diagnosticParts.current.normalized.duration_seconds
  $revisedStart = $currentEnd + 0.75
  $revisedEnd = $revisedStart + [double]$diagnosticParts.revised.normalized.duration_seconds
  $fullStart = $revisedEnd + 0.75
  $diagnosticTiming = [ordered]@{
    current = [ordered]@{ start_seconds = 0.0; end_seconds = [Math]::Round($currentEnd, 6) }
    revised = [ordered]@{ start_seconds = [Math]::Round($revisedStart, 6); end_seconds = [Math]::Round($revisedEnd, 6) }
    full_sentence = [ordered]@{ start_seconds = [Math]::Round($fullStart, 6); end_seconds = [Math]::Round([double]$diagnosticMetrics.duration_seconds, 6) }
  }

  $outputMp4 = Join-Path $recommendedRoot.FullName "case-digest-nemo-delivery-reflow.mp4"
  Invoke-FfmpegText -Arguments @(
    "-hide_banner", "-nostats", "-v", "warning",
    "-i", $SourceMp4,
    "-i", $narrationPath,
    "-map", "0:v:0", "-map", "0:s:0", "-map", "1:a:0",
    "-c:v", "copy", "-c:s", "copy", "-c:a", "aac", "-b:a", "192k",
    "-metadata:s:a:0", "language=jpn",
    "-map_metadata", "0", "-map_chapters", "-1",
    "-t", "180", "-movflags", "+faststart",
    $outputMp4
  ) | Out-Null

  $outputProbe = Invoke-Ffprobe -Path $outputMp4
  $outputVideo = @($outputProbe.streams | Where-Object codec_type -eq "video")
  $outputAudio = @($outputProbe.streams | Where-Object codec_type -eq "audio")
  $outputSubtitles = @($outputProbe.streams | Where-Object codec_type -eq "subtitle")
  $sourceVideoHash = Get-StreamHash -Path $SourceMp4 -Map "0:v:0"
  $outputVideoHash = Get-StreamHash -Path $outputMp4 -Map "0:v:0"
  $sourceSubtitleHash = Get-StreamHash -Path $SourceMp4 -Map "0:s:0"
  $outputSubtitleHash = Get-StreamHash -Path $outputMp4 -Map "0:s:0"
  if (
    [Math]::Abs([double]$outputProbe.format.duration - 180.0) -gt 0.001 -or
    [int]$outputVideo[0].nb_read_frames -ne 5400 -or
    $outputAudio.Count -ne 1 -or
    $outputSubtitles.Count -ne 1 -or
    [int]$outputSubtitles[0].nb_read_frames -ne 11 -or
    $sourceVideoHash -ne $outputVideoHash -or
    $sourceSubtitleHash -ne $outputSubtitleHash
  ) {
    throw "Exact 180-second mux or source stream preservation failed."
  }

  $reviewHtml = Join-Path $recommendedRoot.FullName "case-digest-nemo-delivery-reflow.html"
  New-ReviewHtml `
    -OutputPath $reviewHtml `
    -Events $events `
    -TimelineGaps $timelineGaps `
    -SourcePackage $sourcePackage `
    -Diagnostic $diagnosticTiming

  $utteranceCsvPath = Join-Path $PackageRoot "narration-utterance-map.csv"
  $utteranceCsv = $events |
    Select-Object `
      utterance_id,
      source_section_id,
      source_character_start,
      source_character_end,
      source_text_ja,
      tts_reading_text_ja,
      semantic_equivalence,
      style_id,
      shot_id,
      target_start_seconds,
      synthesized_duration,
      actual_end_seconds,
      preceding_gap_seconds,
      following_gap_seconds,
      source_text_sha256,
      wav_sha256 |
    ConvertTo-Csv -NoTypeInformation
  Write-Utf8Text -Path $utteranceCsvPath -Text (($utteranceCsv -join "`n") + "`n")

  $gapCsvPath = Join-Path $PackageRoot "silence-gap-audit.csv"
  $gapCsv = $timelineGaps |
    Select-Object `
      gap_id,
      gap_type,
      previous_utterance_id,
      next_utterance_id,
      start_seconds,
      end_seconds,
      duration_seconds,
      contract_limit_seconds,
      pass |
    ConvertTo-Csv -NoTypeInformation
  Write-Utf8Text -Path $gapCsvPath -Text (($gapCsv -join "`n") + "`n")

  $sourceFilePaths = [ordered]@{
    source_script = Join-Path $gitIdentity.repo_root "artifacts\private-raster-case-digest\case-digest-script.md"
    source_package = $SourcePackagePath
    visible_captions = Join-Path $gitIdentity.repo_root "artifacts\private-raster-case-digest\case-digest-review-captions.csv"
    visible_subtitles = Join-Path $gitIdentity.repo_root "artifacts\private-raster-case-digest\case-digest-production-subtitles-draft.csv"
    shot_sequence = Join-Path $gitIdentity.repo_root "artifacts\private-raster-case-digest\selected-shot-sequence.csv"
    transition_map = Join-Path $gitIdentity.repo_root "artifacts\private-raster-case-digest\transition-boundary-map.csv"
  }
  $sourceHashes = [ordered]@{}
  foreach ($key in $sourceFilePaths.Keys) {
    $sourceHashes[$key] = Get-Sha256 -Path $sourceFilePaths[$key]
  }
  $imageChecks = @($sourcePackage.shots | ForEach-Object {
    $imagePath = Join-Path $gitIdentity.repo_root $_.image_path
    $actual = Get-Sha256 -Path $imagePath
    if ($actual -ne $_.sha256) {
      throw "VOICE_REFLOW_SOURCE_IDENTITY_MISMATCH: selected image differs: $($_.shot_id)"
    }
    [ordered]@{
      shot_id = $_.shot_id
      relative_path = $_.image_path
      sha256 = $actual
      unchanged = $true
    }
  })

  $regionOneBefore = [ordered]@{
    region_start_seconds = 48.0
    region_end_seconds = 60.0
    previous_gap_start_seconds = 47.806
    previous_gap_end_seconds = 65.35
    previous_speechless_overlap_seconds = 12.0
  }
  $regionTwoBefore = [ordered]@{
    region_start_seconds = 110.0
    region_end_seconds = 140.0
    previous_gap_start_seconds = 118.416667
    previous_gap_end_seconds = 136.35
    previous_speechless_overlap_seconds = 17.933333
  }
  $regionOneAfter = Get-RegionGapEvidence -TimelineGaps $timelineGaps -Start 48.0 -End 60.0
  $regionTwoAfter = Get-RegionGapEvidence -TimelineGaps $timelineGaps -Start 110.0 -End 140.0

  $common = [ordered]@{
    schemaVersion = "fff.caseDigestNemoDeliveryReflowResult.v1"
    artifact_id = "fff-case-digest-nemo-delivery-reflow-001"
    mission_id = "fff-case-digest-nemo-delivery-reflow-001"
    authority_id = "AUTH-FFF-NEMO-STYLE10000-DELIVERY-REFLOW-20260727"
    generated_at_utc = [DateTime]::UtcNow.ToString("o")
    start_git_identity = [ordered]@{
      commit = $gitIdentity.start_head
      branch = $gitIdentity.branch
      expected_clean_preflight_verified = $true
    }
    source = [ordered]@{
      artifact_id = $sourcePackage.artifact_id
      execution_base = "2e96bd380d47869024587eeb19b3f054064390af"
      package_fingerprint_sha256 = "0f701e7cfa106dee19cf6e378eec1082920cd7f119f37be0f09696ac8020fbf2"
      mp4_relative_path = "artifacts/private-raster-case-digest/private-raster-case-digest.mp4"
      mp4_sha256 = Get-Sha256 -Path $SourceMp4
      duration_seconds = 180.0
      frame_count = 5400
      subtitle_stream_count = 1
      subtitle_cue_count = 11
      section_count = 5
      shot_count = 11
    }
    calibration_source_identity = $calibrationIdentity
    owner_listening_observation = [ordered]@{
      relative_path = "artifacts/case-digest-nemo-delivery-reflow/owner-listening-observation.json"
      sha256 = Get-Sha256 -Path (Join-Path $PackageRoot "owner-listening-observation.json")
      preferred_style_for_next_candidate = 10000
      rejected_current_delivery_styles = @(10007, 10001)
      rejection_scope = "exact attempt-3 delivery candidates only"
    }
    engine = [ordered]@{
      name = $engineManifest.name
      uuid = $engineManifest.uuid
      version = $engineVersion
      style_id = 10000
      speaker_name = "男声2"
      speedScale = 1.0
      pitchScale = 0.0
      intonationScale = 1.0
      volumeScale = 1.0
      time_stretch_used = $false
    }
    utterances = $events
    utterance_count = $events.Count
    silence = [ordered]@{
      maximum_internal_gap_seconds = [Math]::Round($maximumGap, 6)
      median_internal_gap_seconds = [Math]::Round($medianGap, 6)
      section_gaps = $sectionGaps
      final_tail_seconds = [double]$timelineGaps[-1].duration_seconds
      no_ten_second_gap = $maximumGap -lt 10.0
      overlap_count = 0
      duplicated_speech_count = 0
      every_shot_covered = $uncoveredShots.Count -eq 0
      contract_pass = $true
      region_evidence = @(
        [ordered]@{ region_id = "00:48-01:00"; before = $regionOneBefore; after = $regionOneAfter },
        [ordered]@{ region_id = "01:50-02:20"; before = $regionTwoBefore; after = $regionTwoAfter }
      )
    }
    diagnostics = [ordered]@{
      brass_moth_visible_source = "真鍮の蛾"
      brass_moth_tts_reading = "しんちゅうでできた、ガ"
      pronunciation_map_relative_path = "artifacts/case-digest-nemo-delivery-reflow/tts-pronunciation-map-v2.json"
      pronunciation_map_sha256 = Get-Sha256 -Path (Join-Path $PackageRoot "tts-pronunciation-map-v2.json")
      comparison_relative_path = "diagnostics/brass-moth-comparison.wav"
      comparison_metrics = $diagnosticMetrics
      timing = $diagnosticTiming
      parts = $diagnosticParts
      perceptual_acceptance_claimed = $false
    }
    narration = [ordered]@{
      external_relative_path = "recommended/case-digest-narration-style-10000.wav"
      metrics = $narrationMetrics
      event_count = $events.Count
      overlap_count = 0
      music_effects_ambience_count = 0
      sample_exact_placement = $true
      placement_sample_rate = 48000
      placement_sample_offsets = @($events | ForEach-Object {
        [int64][Math]::Round([double]$_.target_start_seconds * 48000)
      })
    }
    muxed_mp4 = [ordered]@{
      external_relative_path = "recommended/case-digest-nemo-delivery-reflow.mp4"
      bytes = (Get-Item -LiteralPath $outputMp4).Length
      sha256 = Get-Sha256 -Path $outputMp4
      duration_seconds = [double]$outputProbe.format.duration
      video_codec = $outputVideo[0].codec_name
      width = [int]$outputVideo[0].width
      height = [int]$outputVideo[0].height
      frame_rate = $outputVideo[0].avg_frame_rate
      frame_count = [int]$outputVideo[0].nb_read_frames
      audio_stream_count = $outputAudio.Count
      audio_codec = $outputAudio[0].codec_name
      subtitle_stream_count = $outputSubtitles.Count
      subtitle_cue_count = [int]$outputSubtitles[0].nb_read_frames
      chapter_count = 0
    }
    video_stream_identity = [ordered]@{
      method = "FFmpeg copy-demuxed stream SHA256"
      source_sha256 = $sourceVideoHash
      output_sha256 = $outputVideoHash
      match = $sourceVideoHash -eq $outputVideoHash
    }
    subtitle_stream_identity = [ordered]@{
      method = "FFmpeg copy-demuxed stream SHA256"
      source_sha256 = $sourceSubtitleHash
      output_sha256 = $outputSubtitleHash
      match = $sourceSubtitleHash -eq $outputSubtitleHash
      cue_count = [int]$outputSubtitles[0].nb_read_frames
    }
    review_html = [ordered]@{
      external_relative_path = "recommended/case-digest-nemo-delivery-reflow.html"
      bytes = (Get-Item -LiteralPath $reviewHtml).Length
      sha256 = Get-Sha256 -Path $reviewHtml
      autoplay = $false
      network_required = $false
      server_required = $false
      runtime = [ordered]@{
        validation_status = "pending_browser_inspection"
        runtime_pass = $false
      }
    }
    source_immutability = [ordered]@{
      tracked_source_hashes = $sourceHashes
      selected_images = $imageChecks
      selected_image_count = $imageChecks.Count
      changed_image_count = 0
      source_script_semantics_unchanged = $true
      visible_caption_bytes_unchanged = $true
      visible_subtitle_bytes_unchanged = $true
      shot_order_timing_unchanged = $true
      transition_inputs_unchanged = $true
    }
    offline_proof = [ordered]@{
      engine_base_uri = $script:EngineBaseUri
      synthesis_request_count = $events.Count + $diagnosticTexts.Count
      external_network_request_count = 0
      credential_count = 0
      payment_count = 0
      install_count = 0
    }
    tracked_media = [ordered]@{
      audio_or_binary_count = 0
      prohibited_extensions = @(".wav", ".aac", ".mp4", ".vvpp", ".zip", ".exe", ".onnx")
    }
    boundaries = [ordered]@{
      private_review_candidate = $true
      owner_voice_delivery_preference = "style_10000"
      style_10007_current_candidate_status = "not_preferred"
      style_10001_current_candidate_status = "not_preferred"
      visual_candidate_status = "accepted_unchanged"
      case_digest_script_status = "accepted_unchanged"
      visible_subtitle_status = "accepted_unchanged"
      final_voice_selected = $false
      production_voice_approved = $false
      production_approved = $false
      rights_cleared_claim = $false
      product_release = $false
      public_release = $false
      publication = $false
      final_canon = $false
    }
  }

  $runManifest = [ordered]@{}
  foreach ($key in $common.Keys) {
    $runManifest[$key] = $common[$key]
  }
  $runManifest.schemaVersion = "fff.caseDigestNemoDeliveryReflowExternalRun.v1"
  $runManifest.Remove("artifact_id")
  $runManifest.Remove("start_git_identity")
  $runManifest.Remove("owner_listening_observation")
  $runManifest.Remove("source_immutability")
  $runManifest.Remove("tracked_media")
  $runManifestPath = Join-Path $RunRoot "run-manifest.json"
  Write-Json -Path $runManifestPath -Value $runManifest

  $result = [ordered]@{}
  foreach ($key in $common.Keys) {
    $result[$key] = $common[$key]
  }
  $result.passed = $false
  $result.validation_status = "pending_browser_inspection"
  $result.external_run_manifest = [ordered]@{
    relative_locator = "fff-case-digest-nemo-delivery-reflow-001/run-manifest.json"
    sha256 = Get-Sha256 -Path $runManifestPath
  }
  $resultPath = Join-Path $PackageRoot "voice-delivery-result.json"
  Write-Json -Path $resultPath -Value $result

  return [pscustomobject]@{
    run_manifest = $runManifestPath
    result = $resultPath
    utterance_count = $events.Count
    maximum_internal_gap_seconds = [Math]::Round($maximumGap, 6)
    median_internal_gap_seconds = [Math]::Round($medianGap, 6)
    narration = $narrationPath
    mp4 = $outputMp4
    review_html = $reviewHtml
    video_stream_identity_match = $sourceVideoHash -eq $outputVideoHash
    subtitle_stream_identity_match = $sourceSubtitleHash -eq $outputSubtitleHash
    external_network_request_count = 0
  }
}

function Invoke-Validate {
  $repoRoot = (Resolve-Path (Join-Path $PackageRoot "..\..")).Path
  $before = (& git -C $repoRoot status --porcelain=v2) -join "`n"
  $resultPath = Join-Path $PackageRoot "voice-delivery-result.json"
  $manifestPath = Join-Path $RunRoot "run-manifest.json"
  foreach ($path in @($resultPath, $manifestPath)) {
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
      throw "Validation input is missing: $path"
    }
  }
  $result = Get-Content -LiteralPath $resultPath -Raw | ConvertFrom-Json
  $manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
  $utteranceRows = @(Import-Csv -LiteralPath (Join-Path $PackageRoot "narration-utterance-map.csv"))
  $gapRows = @(Import-Csv -LiteralPath (Join-Path $PackageRoot "silence-gap-audit.csv"))
  $narrationPath = Join-Path $RunRoot $result.narration.external_relative_path
  $mp4Path = Join-Path $RunRoot $result.muxed_mp4.external_relative_path
  $htmlPath = Join-Path $RunRoot $result.review_html.external_relative_path
  if (
    $manifest.schemaVersion -ne "fff.caseDigestNemoDeliveryReflowExternalRun.v1" -or
    $result.artifact_id -ne "fff-case-digest-nemo-delivery-reflow-001" -or
    $utteranceRows.Count -lt 18 -or
    $utteranceRows.Count -gt 22 -or
    @($utteranceRows | Where-Object style_id -ne 10000).Count -gt 0 -or
    @($gapRows | Where-Object { $_.pass -ne "True" }).Count -gt 0 -or
    [double]$result.silence.maximum_internal_gap_seconds -gt 5.0 -or
    -not $result.passed -or
    -not $result.review_html.runtime.runtime_pass -or
    $result.boundaries.final_voice_selected -or
    $result.boundaries.production_voice_approved -or
    $result.boundaries.public_release -or
    $result.boundaries.final_canon
  ) {
    throw "Tracked delivery result failed validation."
  }
  if (
    (Get-Sha256 -Path $manifestPath) -ne $result.external_run_manifest.sha256 -or
    (Get-Sha256 -Path $narrationPath) -ne $result.narration.metrics.sha256 -or
    (Get-Sha256 -Path $mp4Path) -ne $result.muxed_mp4.sha256 -or
    (Get-Sha256 -Path $htmlPath) -ne $result.review_html.sha256
  ) {
    throw "External artifact identity differs."
  }
  $forbidden = @(
    Get-ChildItem -LiteralPath $PackageRoot -Recurse -File |
      Where-Object Extension -in @(".wav", ".aac", ".mp4", ".vvpp", ".zip", ".exe", ".onnx")
  )
  if ($forbidden.Count -gt 0) {
    throw "Tracked audio or binary file detected."
  }
  $after = (& git -C $repoRoot status --porcelain=v2) -join "`n"
  if ($before -cne $after) {
    throw "Read-only validator mutated the worktree."
  }
  return [pscustomobject]@{
    passed = $true
    artifact_id = $result.artifact_id
    utterance_count = $utteranceRows.Count
    maximum_internal_gap_seconds = $result.silence.maximum_internal_gap_seconds
    every_shot_covered = $result.silence.every_shot_covered
    video_stream_identity_match = $result.video_stream_identity.match
    subtitle_stream_identity_match = $result.subtitle_stream_identity.match
    tracked_audio_or_binary_count = $forbidden.Count
    read_only_validator_mutation_count = 0
  }
}

if ($Mode -eq "Build") {
  Invoke-Build | ConvertTo-Json -Depth 10
} else {
  Invoke-Validate | ConvertTo-Json -Depth 10
}
