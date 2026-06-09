#!/usr/bin/env bash
# ============================================================
# scripts/run_dev.sh — Arranque del backend para desarrollo (Linux/Mac).
# ============================================================
# Levanta uvicorn escuchando en TODAS las interfaces (0.0.0.0)
# para que el celu en la misma WiFi pueda conectarse al backend.
#
# Uso (desde la carpeta backend):
#   bash scripts/run_dev.sh
# ============================================================

cd "$(dirname "$0")/.."

# Activa el venv si existe
if [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
fi

echo ""
echo "=== Kinova Backend (dev) ==="
echo "Escuchando en 0.0.0.0:8000"
echo ""
echo "Para conectar desde el celu:"
echo "  1. Asegurate de estar en la MISMA WiFi que la PC"
echo "  2. La IP local de esta PC: hostname -I (Linux) / ifconfig (Mac)"
echo "  3. El celu va a conectarse a esa IP automaticamente via Expo"
echo ""

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
