# SETUP COMPLETADO ✓

## Estado actual

**Frontend:**
- ✓ Todas las dependencias instaladas
- ✓ Listo para correr con `npm run dev`
- ✓ URL: http://localhost:5173

**Backend:**
- ✓ Virtual environment creado (`venv/`)
- ✓ Todas las dependencias instaladas (FastAPI, MediaPipe, SQLAlchemy, etc.)
- ✓ Estructura de carpetas lista
- ✓ Configuración básica creada
- ✓ Listo para correr con `uvicorn app.main:app --reload`
- ✓ URL: http://localhost:8000 | Docs: http://localhost:8000/docs

---

## Quick Start

### Terminal 1 — Backend
```bash
cd backend
./venv/Scripts/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2 — Frontend
```bash
cd frontend
npm run dev
```

---

## Próximas tareas por persona

### Santi — Auth + REST API
1. Crear modelos ORM: `User`, `Exercise`, `Routine`, `Session`
2. Implementar endpoints de autenticación (`/auth/register`, `/auth/login`)
3. Crear routers de: Exercises, Routines, Sessions

### María — Pose Engine + WebSocket
1. Implementar `detector.py` (MediaPipe wrapper)
2. Implementar `angle_calculator.py`
3. Crear evaluadores: `SquatEvaluator`, `HipThrustEvaluator`, `LungeEvaluator`
4. Implementar WebSocket en `/api/pose/ws/{session_id}`

### Agus — Base de datos
1. Seedear el catálogo de ejercicios (3 del MVP: sentadilla, extensión, elevación)
2. Configurar índices en tablas frecuentes
3. Ayudar a migrar a PostgreSQL si es necesario

---

## Documentación

- **Backend Setup detallado:** `backend/SETUP.md`
- **Arquitectura del backend:** [Ver notas anteriores de la conversación]
- **Frontend:** Ya está en GitHub, listo para usar

---

## Cambios realizados hoy

✓ Instalado Node.js LTS
✓ Instalado pnpm
✓ Instaladas dependencias del frontend
✓ Creado virtual environment de Python
✓ Instaladas todas las dependencias del backend
✓ Estructura de carpetas completa
✓ Configuración inicial (config.py, database.py, main.py)
✓ .env y .gitignore configurados
✓ Documentación de setup

---

## Puertos en uso

- Frontend: `5173`
- Backend: `8000`
- Base de datos: SQLite local (`kinova.db`)

¡Listo para arrancar!
