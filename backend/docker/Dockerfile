FROM python:3.12-slim

WORKDIR /app

# libgles2 + libegl1 proveen libGLESv2.so.2 que MediaPipe carga al iniciar,
# incluso en modo CPU. Sin estas librerías el proceso crashea en Render.
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libgles2 \
    libegl1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
