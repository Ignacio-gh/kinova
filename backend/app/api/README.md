# app/api/

Contiene **todas las versiones públicas** de la API de Kinova.

## Estructura

```
api/
└── v1/
    ├── api.py          → Agregador de routers de v1
    └── routes/         → Endpoints individuales por dominio
```

## Versionado

Cada versión mayor de la API vive en su propia carpeta (`v1/`, `v2/`, ...).
Esto permite mantener compatibilidad hacia atrás cuando se introducen
cambios breaking.

El prefijo `/api/v1` se aplica en `main.py` al incluir el router agregado.

## Convención

- **Rutas:** se agrupan por dominio en `routes/`. Ej: `routes/patients.py`
  contiene todos los endpoints relacionados a pacientes.
- **Sin lógica de negocio:** los archivos de rutas solo validan input,
  llaman a un service, y devuelven la respuesta. La lógica vive en `services/`.
