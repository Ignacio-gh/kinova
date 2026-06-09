@echo off
REM ============================================================
REM scripts/run_dev.bat — Arranque del backend para desarrollo (Windows).
REM ============================================================
REM Levanta uvicorn escuchando en TODAS las interfaces (0.0.0.0)
REM para que el celu en la misma WiFi pueda conectarse al backend.
REM
REM Uso (desde la carpeta backend):
REM   scripts\run_dev.bat
REM
REM Antes de la primera corrida, abrir el firewall:
REM   - Permitir que Python acepte conexiones entrantes en el puerto 8000
REM   - Windows te lo va a pedir la primera vez ("Permitir acceso")
REM ============================================================

cd /d "%~dp0\.."

REM Activa el venv si existe
if exist ".venv\Scripts\activate.bat" (
    call .venv\Scripts\activate.bat
)

echo.
echo === Kinova Backend (dev) ===
echo Escuchando en 0.0.0.0:8000
echo.
echo Para conectar desde el celu:
echo   1. Asegurate de estar en la MISMA WiFi que la PC
echo   2. La IP local de esta PC la podes ver con: ipconfig
echo   3. El celu va a conectarse a esa IP automaticamente via Expo
echo.

py -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
