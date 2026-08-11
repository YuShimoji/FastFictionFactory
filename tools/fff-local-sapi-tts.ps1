param(
    [Parameter(Mandatory = $true)]
    [string]$ConfigPath,

    [Parameter(Mandatory = $true)]
    [string]$OutputDirectory
)

$ErrorActionPreference = "Stop"

$resolvedConfig = [IO.Path]::GetFullPath($ConfigPath)
$resolvedOutput = [IO.Path]::GetFullPath($OutputDirectory)
if (-not [IO.File]::Exists($resolvedConfig)) {
    throw "TTS config does not exist: $resolvedConfig"
}
if (-not [IO.Directory]::Exists($resolvedOutput)) {
    [IO.Directory]::CreateDirectory($resolvedOutput) | Out-Null
}

$environmentFixApplied = $false
if ([string]::IsNullOrWhiteSpace($env:windir)) {
    if ([string]::IsNullOrWhiteSpace($env:SystemRoot)) {
        throw "Neither windir nor SystemRoot is available for SAPI voice-path expansion"
    }
    $env:windir = $env:SystemRoot
    $environmentFixApplied = $true
}

Add-Type -AssemblyName System.Speech
$config = Get-Content -Raw -Encoding UTF8 -LiteralPath $resolvedConfig | ConvertFrom-Json
$synth = [System.Speech.Synthesis.SpeechSynthesizer]::new()

try {
    $voice = $synth.GetInstalledVoices() | Where-Object {
        $_.Enabled -and $_.VoiceInfo.Name -eq $config.voice_name
    } | Select-Object -First 1
    if ($null -eq $voice) {
        throw "Required enabled SAPI voice is unavailable: $($config.voice_name)"
    }
    if ($voice.VoiceInfo.Culture.Name -ne $config.culture) {
        throw "SAPI voice culture mismatch: $($voice.VoiceInfo.Culture.Name)"
    }

    $synth.SelectVoice($config.voice_name)
    $synth.Rate = [int]$config.rate
    $synth.Volume = [int]$config.volume
    $rows = @()

    foreach ($cue in $config.cues) {
        if ([string]::IsNullOrWhiteSpace($cue.spoken_text_ja)) {
            throw "Empty spoken text for cue $($cue.cue_id)"
        }
        $fileName = "$($cue.cue_id).raw.wav"
        $outputPath = Join-Path $resolvedOutput $fileName
        $synth.SetOutputToWaveFile($outputPath)
        $synth.Speak([string]$cue.spoken_text_ja)
        $synth.SetOutputToNull()
        $rows += [pscustomobject]@{
            cue_id = [string]$cue.cue_id
            file_name = $fileName
            byte_size = [IO.FileInfo]::new($outputPath).Length
        }
    }

    [pscustomobject]@{
        result = "PASS"
        engine_id = "windows-system-speech-sapi-local"
        voice_name = $synth.Voice.Name
        culture = $synth.Voice.Culture.Name
        gender = [string]$synth.Voice.Gender
        rate = $synth.Rate
        volume = $synth.Volume
        environment_fix_applied = $environmentFixApplied
        external_call = $false
        credentials_touched = $false
        generated_cues = $rows
    } | ConvertTo-Json -Depth 5 -Compress
}
finally {
    $synth.Dispose()
}
