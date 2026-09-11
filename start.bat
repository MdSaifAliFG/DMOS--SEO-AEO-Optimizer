@echo off
title SeoSensing Dev Launcher
echo ==========================================
echo   Starting SeoSensing (SEO, AEO ^& GEO)
echo ==========================================
echo.

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%backend"
set "FRONTEND_DIR=%ROOT_DIR%frontend"
set "PYTHON_EXE=%ROOT_DIR%.venv\Scripts\python.exe"

echo Launching Backend on http://localhost:8000...
start "SeoSensing Backend :8000" cmd /k "cd /d "%BACKEND_DIR%" && "%PYTHON_EXE%" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo Launching Frontend on http://localhost:3000...
start "SeoSensing Frontend :3000" cmd /k "cd /d "%FRONTEND_DIR%" && npm run dev"

echo.
echo Both servers launched in separate windows!
echo - Frontend: http://localhost:3000
echo - Backend:  http://localhost:8000/api/v1/health
echo - API Docs: http://localhost:8000/docs
echo ==========================================
