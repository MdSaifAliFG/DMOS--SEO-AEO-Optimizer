Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Starting SeoSensing (SEO, AEO & GEO)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $rootDir "backend"
$frontendDir = Join-Path $rootDir "frontend"
$pythonExe = Join-Path $rootDir ".venv\Scripts\python.exe"

Write-Host "Launching Backend on http://localhost:8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendDir'; & '$pythonExe' -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

Write-Host "Launching Frontend on http://localhost:3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendDir'; npm run dev"

Write-Host ""
Write-Host "Both servers launched in dedicated PowerShell windows!" -ForegroundColor Green
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "- Backend:  http://localhost:8000/api/v1/health" -ForegroundColor Green
Write-Host "- API Docs: http://localhost:8000/docs" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
