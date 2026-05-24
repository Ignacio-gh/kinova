# app/tests/

Tests automatizados con pytest.

## Estructura

- **`conftest.py`** — Fixtures compartidos (cliente HTTP de test, DB de
  test, usuarios de prueba)
- **`test_*.py`** — Tests por dominio

## Cómo correrlos

```bash
pytest                              # Todos
pytest app/tests/test_auth.py       # Un archivo
pytest -k "test_login"              # Por nombre
pytest -v                           # Verbose
pytest --cov=app                    # Con coverage
```

## Convenciones

- Tests asíncronos: usar `pytest-asyncio` con `@pytest.mark.asyncio`
- DB de tests: SQLite en memoria, recreada en cada test
- HTTP: usar `httpx.AsyncClient` apuntando a la app de test
