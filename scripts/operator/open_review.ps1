[CmdletBinding(DefaultParameterSetName = "Review")]
param(
  [Parameter(ParameterSetName = "Review")]
  [ValidateSet(
    "brief",
    "home",
    "layout-lab",
    "bridge",
    "handoff",
    "revision",
    "derivative",
    "blueprint",
    "story",
    "designer",
    "draft",
    "source",
    "project",
    "artifacts"
  )]
  [string]$Mode = "brief",

  [Parameter(ParameterSetName = "Review")]
  [switch]$PrintUri,

  [Parameter(Mandatory = $true, ParameterSetName = "Docs")]
  [switch]$Docs
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir "..\..")

if ($Docs) {
  $uvx = Get-Command uvx -CommandType Application -ErrorAction SilentlyContinue
  if (-not $uvx) {
    throw "Docs mode requires uvx. Install uv, then retry with -Docs."
  }

  $exitCode = 0
  Push-Location $repoRoot
  try {
    & $uvx.Source --with mkdocs-material mkdocs serve -a 127.0.0.1:8000
    $exitCode = $LASTEXITCODE
  } finally {
    Pop-Location
  }
  exit $exitCode
}

$reviewPath = (Resolve-Path (Join-Path $repoRoot "public\review\index.html")).Path
$Mode = $Mode.ToLowerInvariant()
$reviewUri = ([System.Uri]$reviewPath).AbsoluteUri + "?mode=$Mode"

if ($PrintUri) {
  Write-Output $reviewUri
  exit 0
}

Start-Process -FilePath $reviewUri
