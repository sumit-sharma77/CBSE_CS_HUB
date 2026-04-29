# start.ps1 - Start the CBSE CS Hub dev server + content write server
# Usage:    .\start.ps1
# Port:     .\start.ps1 -Port 4300   (default: 4200)
# Browser:  .\start.ps1 -Open

param(
    [int]$Port = 4200,
    [switch]$Open
)

$appDir = Join-Path $PSScriptRoot "cbse-cs-hub"

if (-not (Test-Path $appDir)) {
    Write-Error "Could not find app directory: $appDir"
    exit 1
}

Write-Host ""
Write-Host "  CBSE CS Hub - Dev Server" -ForegroundColor Cyan
Write-Host "  URL  : http://localhost:$Port/CBSE_CS_HUB" -ForegroundColor Green
Write-Host "  Admin: http://localhost:$Port/CBSE_CS_HUB/admin  (dev only)" -ForegroundColor Yellow
Write-Host "  Press Ctrl+C to stop" -ForegroundColor DarkGray
Write-Host ""

Set-Location $appDir

# Start the content write server in the background (port 3001)
$contentServer = Start-Process -FilePath "node" -ArgumentList "content-server.js" `
    -WorkingDirectory $appDir -PassThru -WindowStyle Hidden
Write-Host "  Content server started (PID $($contentServer.Id), port 3001)" -ForegroundColor DarkGray

$ngArgs = @("node_modules/@angular/cli/bin/ng", "serve", "--port", $Port)
if ($Open) { $ngArgs += "--open" }

node @ngArgs

# Cleanup: stop content server when ng serve exits
if ($contentServer -and -not $contentServer.HasExited) {
    Stop-Process -Id $contentServer.Id -Force -ErrorAction SilentlyContinue
    Write-Host "  Content server stopped." -ForegroundColor DarkGray
}
