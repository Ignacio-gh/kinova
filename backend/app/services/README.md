# app/services/

**Capa de lógica de negocio.** Acá vive el cerebro del sistema.

## Qué hace un service

Un service implementa **casos de uso del dominio**. Ejemplos:

- "Registrar un paciente nuevo" (valida email único, hashea password,
  crea User + PatientProfile, devuelve el resultado)
- "Calcular el ángulo efectivo de hoy" (calcula semana actual, busca
  progresión, aplica fallback)
- "Cerrar una sesión" (calcula duración, calcula adherencia,
  actualiza el status)

## Qué NO hace un service

- **No habla con la DB directamente.** Eso es responsabilidad de los
  `repositories/`. El service llama a métodos del repository.
- **No conoce HTTP.** No sabe nada de status codes, headers, ni FastAPI.
  Solo recibe parámetros y devuelve objetos o lanza excepciones.

## Por qué separarlo

- **Testeable:** se pueden testear sin levantar el servidor.
- **Reusable:** el mismo service puede ser llamado desde un endpoint
  HTTP y desde un comando CLI o un job.
- **Independiente de la infraestructura:** si se cambia FastAPI por
  Flask, los services no se tocan.

## Archivos

| Archivo | Responsabilidad |
|---|---|
| `auth_service.py` | Registro, login, hashing, JWT |
| `patient_service.py` | CRUD de pacientes, validaciones de pertenencia |
| `kinesiologo_service.py` | Datos del kine, dashboard |
| `exercise_service.py` | Lectura del catálogo |
| `routine_service.py` | Asignación y consulta de rutinas |
| `progression_service.py` | Cálculo de semana actual y ángulos efectivos |
| `session_service.py` | Ciclo de vida de una sesión |
| `adherence_service.py` | Cálculo de adherencia (semanal, promedio) |
| `pose_service.py` | Orquesta el motor de visión artificial |
