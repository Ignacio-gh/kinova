# docker/

Configuración de contenedores Docker para el backend.

## Archivos

- **`Dockerfile`** — Imagen del backend (Python 3.12 + FastAPI).
- **`.dockerignore`** — Archivos a excluir del build context.

> 📌 **Nota:** el archivo `docker-compose.yml` vive en la raíz del
> backend, no acá, porque orquesta múltiples servicios.

## Build manual

```bash
docker build -t kinova-backend -f docker/Dockerfile .
docker run -p 8000:8000 --env-file .env kinova-backend
```

## Con docker-compose (recomendado)

```bash
docker-compose up --build
```
