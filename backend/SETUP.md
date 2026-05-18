# Kinova Backend Setup — Guía de instalación

## Requisitos completados ✓
- ✅ Python 3.12 instalado
- ✅ Virtual environment creado
- ✅ Dependencias instaladas (`requirements.txt`)
- ✅ Estructura de carpetas lista
- ✅ Archivos de configuración creados

## Comandos para correr el backend

### 1. Activar virtual environment (Windows)
```bash
cd backend
.\venv\Scripts\activate
```

### 2. Crear/Actualizar .env
```bash
cp .env.example .env
```

### 3. Correr el servidor en desarrollo
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

El backend estará disponible en: **http://localhost:8000**

Docs interactivos (Swagger): **http://localhost:8000/docs**

---

## Frontend Setup

### 1. Instalar dependencias
```bash
cd frontend
npm install
```

### 2. Correr en desarrollo
```bash
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

---

## Estructura del Backend

```
backend/
├── app/
│   ├── main.py              # Entry point de FastAPI
│   ├── config.py            # Configuración (desde .env)
│   ├── database.py          # Setup de SQLAlchemy
│   ├── models/              # ORM models (User, Exercise, etc.)
│   ├── schemas/             # Pydantic schemas (request/response)
│   ├── routers/             # Endpoints (auth, exercises, etc.)
│   ├── services/            # Lógica de negocio
│   ├── pose/                # Motor de visión artificial
│   │   ├── detector.py      # MediaPipe wrapper
│   │   ├── angle_calculator.py
│   │   ├── base_evaluator.py
│   │   └── evaluators/      # Evaluadores por ejercicio
│   └── utils/               # Funciones auxiliares
├── requirements.txt         # Dependencias Python
├── .env.example             # Template de variables de entorno
└── venv/                    # Virtual environment
```

---

## Ejercicios para el MVP

**Patologías:** Condromalacia rotuliana + Post-artroscopia de menisco

**Ejercicios:**
1. **Sentadilla a silla** — Control de flexión de rodilla
2. **Extensión de rodilla sentado** — Fortalecimiento de cuádriceps
3. **Elevación de pierna recta** — Extensión controlada de rodilla

**Configuración de cámara:** De costado, ~2 metros, vista lateral (sagital)

---

## Próximos pasos

- [ ] Santi: Crear modelos ORM en `app/models/`
- [ ] Santi: Implementar Auth endpoints
- [ ] María: Implementar detector de pose (`app/pose/`)
- [ ] Agus: Seed de ejercicios y configuración de DB
- [ ] Todos: Integrar con el frontend

---

## Notas de desarrollo

- La DB por defecto es SQLite (`kinova.db`). Para producción cambiar a PostgreSQL en `.env`
- Las dependencias incluyen MediaPipe, OpenCV y todas las librerías necesarias
- CORS ya está configurado para `localhost:5173` (frontend)
- JWT y autenticación están listos para implementar en los routers
