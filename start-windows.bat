@echo off
cd /d "%~dp0"
echo Starting MANUL local website at http://localhost:3000
py -3 -m http.server 3000
if errorlevel 1 (
  echo Python 3 was not found. Install Python or use VS Code Live Server.
  pause
)
