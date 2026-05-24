# app/api/v1/routes/

Endpoints HTTP y WebSocket agrupados por dominio.

## Archivos

| Archivo | Dominio | Prefijo |
|---|---|---|
| `auth.py` | Registro, login, autenticación | `/auth` |
| `patients.py` | Gestión de pacientes (lado kine) + dashboard del paciente | `/patients` |
| `kinesiologos.py` | Dashboard y datos del kinesiólogo | `/kinesiologos` |
| `exercises.py` | Catálogo de ejercicios (read-only) | `/exercises` |
| `routines.py` | Asignación de rutinas (kine → paciente) | `/routines` |
| `progressions.py` | Progresión semanal de ángulos articulares | `/progressions` |
| `sessions.py` | Sesiones de ejercicio (start, exec, end, historial) | `/sessions` |
| `pose.py` | WebSocket de análisis de pose en tiempo real | `/pose` |

## Convención

Cada archivo expone una variable `router` (instancia de `APIRouter`) que
se registra en `api.py`.

Los endpoints **no contienen lógica de negocio**. Solo:
1. Validan input con schemas Pydantic
2. Aplican dependencias de autenticación (`get_current_*`)
3. Llaman al service correspondiente
4. Devuelven la respuesta tipada
