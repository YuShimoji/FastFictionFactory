[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ConfigPath,

    [Parameter(Mandatory = $true)]
    [string]$OutputDirectory
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Await-WinRtOperation {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Operation,

        [Parameter(Mandatory = $true)]
        [type]$ResultType
    )

    $method = [System.WindowsRuntimeSystemExtensions].GetMethods() |
        Where-Object {
            $_.Name -eq "AsTask" -and
            $_.IsGenericMethodDefinition -and
            $_.GetGenericArguments().Count -eq 1 -and
            $_.GetParameters().Count -eq 1
        } |
        Select-Object -First 1
    if ($null -eq $method) {
        throw "Unable to locate the WinRT AsTask adapter."
    }

    $task = $method.MakeGenericMethod($ResultType).Invoke($null, @($Operation))
    $task.GetAwaiter().GetResult()
}

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
        throw "Neither windir nor SystemRoot is available for OneCore voice-path expansion."
    }
    $env:windir = $env:SystemRoot
    $environmentFixApplied = $true
}

$config = Get-Content -Raw -Encoding UTF8 -LiteralPath $resolvedConfig | ConvertFrom-Json
if ([string]::IsNullOrWhiteSpace([string]$config.voice_name)) {
    throw "voice_name is required."
}
if ([string]::IsNullOrWhiteSpace([string]$config.culture)) {
    throw "culture is required."
}
if ([string]::IsNullOrWhiteSpace([string]$config.gender)) {
    throw "gender is required."
}

Add-Type -AssemblyName System.Runtime.WindowsRuntime
$synthesizerType = [Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime]
$streamType = [Windows.Media.SpeechSynthesis.SpeechSynthesisStream, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime]

$matches = @($synthesizerType::AllVoices | Where-Object {
    $_.DisplayName -eq [string]$config.voice_name -and
    $_.Language -eq [string]$config.culture -and
    [string]$_.Gender -eq [string]$config.gender
})
if ($matches.Count -ne 1) {
    throw "Required unique WinRT voice is unavailable: $($config.voice_name) / $($config.culture) / $($config.gender)"
}

$voice = $matches[0]
$synth = [Activator]::CreateInstance($synthesizerType)
$rows = @()
try {
    $synth.Voice = $voice
    if ($null -ne $config.speaking_rate) {
        $synth.Options.SpeakingRate = [double]$config.speaking_rate
    }

    foreach ($cue in $config.cues) {
        if ([string]::IsNullOrWhiteSpace([string]$cue.spoken_text_ja)) {
            throw "Empty spoken text for cue $($cue.cue_id)"
        }

        $fileName = "$($cue.cue_id).raw.wav"
        $outputPath = Join-Path $resolvedOutput $fileName
        if ([IO.File]::Exists($outputPath)) {
            throw "Refusing to overwrite synthesized output: $outputPath"
        }

        $operation = $synth.SynthesizeTextToStreamAsync([string]$cue.spoken_text_ja)
        $speechStream = Await-WinRtOperation -Operation $operation -ResultType $streamType
        $input = $null
        $output = $null
        try {
            $input = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($speechStream)
            $output = [IO.File]::Create($outputPath)
            $input.CopyTo($output)
        }
        finally {
            if ($null -ne $output) { $output.Dispose() }
            if ($null -ne $input) { $input.Dispose() }
            if ($null -ne $speechStream) { $speechStream.Dispose() }
        }

        $rows += [pscustomobject]@{
            cue_id = [string]$cue.cue_id
            file_name = $fileName
            byte_size = [IO.FileInfo]::new($outputPath).Length
        }
    }

    [pscustomobject]@{
        result = "PASS"
        engine_id = "windows-media-speechsynthesis-onecore-local"
        voice_name = $voice.DisplayName
        voice_id = $voice.Id
        culture = $voice.Language
        gender = [string]$voice.Gender
        speaking_rate = [double]$synth.Options.SpeakingRate
        environment_fix_applied = $environmentFixApplied
        external_call = $false
        credentials_touched = $false
        playback_used = $false
        generated_cues = $rows
    } | ConvertTo-Json -Depth 5 -Compress
}
finally {
    if ($null -ne $synth) { $synth.Dispose() }
}
