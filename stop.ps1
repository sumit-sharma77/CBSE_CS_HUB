# stop.ps1 - Stop the CBSE CS Hub dev server + content write server
# Usage: .\stop.ps1
# Usage: .\stop.ps1 -Port 4300

param([int]$Port = 4200)

# Stop Angular dev server on specified port
$procs = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
         Select-Object -ExpandProperty OwningProcess |
         Sort-Object -Unique

if (-not $procs) {
    Write-Host "  No process found on port $Port." -ForegroundColor DarkGray
} else {
    foreach ($procId in $procs) {
        $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
        if ($proc) {
            Write-Host "  Stopping '$($proc.Name)' (PID $procId) on port $Port..." -ForegroundColor Yellow
            Stop-Process -Id $procId -Force
            Write-Host "  Stopped." -ForegroundColor Green
        }
    }
}

# Also stop content server on port 3001
$contentProcs = Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue |
                Select-Object -ExpandProperty OwningProcess |
                Sort-Object -Unique

if ($contentProcs) {
    foreach ($procId in $contentProcs) {
        $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
        if ($proc) {
            Write-Host "  Stopping content server '$($proc.Name)' (PID $procId) on port 3001..." -ForegroundColor Yellow
            Stop-Process -Id $procId -Force
            Write-Host "  Stopped." -ForegroundColor Green
        }
    }
}
