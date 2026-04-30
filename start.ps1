#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Start CBSE CS Hub dev environment (Docker Compose + Angular dev server)
.DESCRIPTION
    1. Copies .env.example → .env if not present
    2. docker compose up -d (postgres + redis + api)
    3. Starts Angular dev server on port 4200
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Write-Host "=== CBSE CS Hub Dev Startup ===" -ForegroundColor Cyan

# 1. Ensure .env exists
if (-not (Test-Path ".env")) {
    Write-Host "[setup] Copying .env.example → .env" -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "[setup] ⚠️  Edit .env with your secrets before proceeding." -ForegroundColor Yellow
    exit 1
}

# 2. Docker Compose (backend services)
Write-Host "[docker] Starting postgres, redis, cbse-api..." -ForegroundColor Green
docker compose up -d --build

# 3. Wait for api healthcheck
Write-Host "[docker] Waiting for api to be healthy..." -ForegroundColor Green
$retries = 0
do {
    Start-Sleep -Seconds 3
    $health = docker inspect --format='{{.State.Health.Status}}' cbse-api 2>$null
    $retries++
    if ($retries -ge 20) { Write-Host "[docker] API health check timed out." -ForegroundColor Red; break }
} while ($health -ne "healthy")

# 4. Angular dev server
Write-Host "[angular] Starting Angular on http://localhost:4200 ..." -ForegroundColor Green
Push-Location cbse-cs-hub
npm install --prefer-offline
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "ng serve --proxy-config proxy.conf.json --open"
Pop-Location

Write-Host ""
Write-Host "✅ All services started!" -ForegroundColor Green
Write-Host "   Frontend : http://localhost:4200" -ForegroundColor Cyan
Write-Host "   API      : http://localhost:8080" -ForegroundColor Cyan
Write-Host "   Swagger  : http://localhost:8080/swagger-ui.html (set SWAGGER_ENABLED=true)" -ForegroundColor Cyan
