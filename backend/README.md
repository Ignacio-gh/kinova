# Kinova Backend

Backend del sistema **Kinova** — plataforma de asistencia biomecánica para rehabilitación física domiciliaria.

> ⚠️ **Estado actual:** esqueleto arquitectónico. No hay lógica implementada todavía.
> Solo está la estructura de carpetas, archivos y placeholders con comentarios.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework web | FastAPI |
| Servidor ASGI | uvicorn |
| Visión artificial | MediaPipe Pose |
| Procesamiento de imágenes | OpenCV (headless) |
| Cálculo numérico | NumPy |
| ORM | SQLAlchemy 2.0 |
| Migraciones | Alembic |
| Autenticación | JWT (python-jose) + bcrypt (passlib) |
| Configuración | pydantic-settings |
| Tests | pytest + httpx |
| Linter | ruff |

---

## Estructura de carpetas

```
backend/
├── app/
│   ├── api/v1/routes/    → Endpoints HTTP y WebSocket
│   ├── core/             → Seguridad, dependencias, excepciones
│   ├── models/           → Modelos ORM (SQLAlchemy)
│   ├── schemas/          → DTOs Pydantic (request/response)
│   ├── services/         → Lógica de negocio
│   ├── repositories/     → Acceso a datos (capa de abstracción de DB)
│   ├── db/               → Conexión y sesión de DB
│   ├── middlewares/      → CORS, logging, manejo de errores
│   ├── utils/            → Utilidades (datetime, validadores)
│   ├── config/           → Settings (lee del .env)
│   └── tests/            → Tests con pytest
├── alembic/              → Migraciones de DB
├── scripts/              → Scripts auxiliares (seed, admin)
├── docker/               → Dockerfile + dockerignore
├── docker-compose.yml    → Orquestación local
├── alembic.ini           → Configuración de Alembic
├── requirements.txt      → Dependencias de Python
├── .env.example          → Plantilla de variables de entorno
└── .env                  → Variables reales (gitignored)
```

---

## Setup local

1. Crear entorno virtual e instalar dependencias:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. Configurar variables de entorno:
   ```bash
   copy .env.example .env
   # Editar .env con los valores apropiados
   ```

3. Levantar el servidor en modo desarrollo:
   ```bash
   uvicorn app.main:app --reload
   ```

4. Abrir la documentación interactiva:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

---

## Roadmap de implementación

- [ ] Configuración base (settings, DB session, CORS)
- [ ] Autenticación (registro de paciente y kinesiólogo, login, JWT)
- [ ] CRUD de pacientes (kinesiólogo administra a sus pacientes)
- [ ] Catálogo de ejercicios (read-only seed)
- [ ] Asignación de rutinas (kinesiólogo → paciente)
- [ ] Progresión semanal de ángulos articulares
- [ ] Sesiones de ejercicio (start, exercise execution, end)
- [ ] Cálculo de adherencia
- [ ] Motor de pose (MediaPipe + evaluadores por ejercicio)
- [ ] WebSocket para feedback en tiempo real
- [ ] Tests de integración
- [ ] Deploy

---

## Equipo

- **Agus** — Base de datos (modelos, migraciones, seed)
- **Santi + María** — Backend completo (REST API + motor de cámara)
- **Ignacio** — Coordinación + frontend / integración
