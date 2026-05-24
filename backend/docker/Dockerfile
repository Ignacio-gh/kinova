# ============================================================
# Dockerfile — Imagen del backend de Kinova (PLACEHOLDER)
# ============================================================
# Base: Python 3.12 slim
# Stack: FastAPI + uvicorn + MediaPipe + OpenCV
#
# TODO: Definir la imagen completa cuando se vaya a deployar.
# Estructura sugerida:
#   1. Stage de build: instalar dependencias
#   2. Stage final: copiar app, exponer puerto, ejecutar uvicorn
# ============================================================

# FROM python:3.12-slim
#
# WORKDIR /app
#
# # Dependencias del sistema (OpenCV, MediaPipe necesitan libs)
# RUN apt-get update && apt-get install -y \
#     libgl1 \
#     libglib2.0-0 \
#     && rm -rf /var/lib/apt/lists/*
#
# # Dependencias de Python
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt
#
# # Código de la app
# COPY app ./app
# COPY alembic ./alembic
# COPY alembic.ini ./
#
# EXPOSE 8000
#
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
