param(
  [switch]$Docs
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir "..\..")

if ($Docs) {
  Push-Location $repoRoot
  try {
    if (Get-Command uvx -ErrorAction SilentlyContinue) {
      uvx --with mkdocs-material mkdocs serve -a 127.0.0.1:8000
    } else {
      python -m mkdocs serve -a 127.0.0.1:8000
    }
  } finally {
    Pop-Location
  }
  exit $LASTEXITCODE
}

$reviewPath = Join-Path $repoRoot "public\review\index.html"
Invoke-Item $reviewPath
