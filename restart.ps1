# restart.ps1 - Restart the CBSE CS Hub dev server
# Usage: .\restart.ps1
# Usage: .\restart.ps1 -Port 4300  -Open

param(
    [int]$Port = 4200,
    [switch]$Open
)

Write-Host ""
Write-Host "  Restarting CBSE CS Hub dev server on port $Port..." -ForegroundColor Cyan

& "$PSScriptRoot\stop.ps1" -Port $Port

Write-Host ""

$startArgs = @("-Port", $Port)
if ($Open) { $startArgs += "-Open" }

& "$PSScriptRoot\start.ps1" @startArgs
