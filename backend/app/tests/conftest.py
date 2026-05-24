"""
conftest.py — Fixtures globales de pytest.

Fixtures planeados:
    @pytest.fixture
    async def db_session() -> AsyncSession:
        '''Sesión de DB de test (SQLite en memoria).'''

    @pytest.fixture
    async def client(db_session) -> AsyncClient:
        '''Cliente HTTP que apunta a la app FastAPI con la DB de test.'''

    @pytest.fixture
    async def test_patient(db_session) -> User:
        '''Crea un paciente de prueba.'''

    @pytest.fixture
    async def test_kinesiologo(db_session) -> User:
        '''Crea un kinesiólogo de prueba.'''

    @pytest.fixture
    async def auth_headers_patient(test_patient) -> dict:
        '''Headers con JWT válido del paciente.'''

    @pytest.fixture
    async def auth_headers_kine(test_kinesiologo) -> dict:
        '''Headers con JWT válido del kinesiólogo.'''
"""

# TODO: import pytest, pytest_asyncio
# TODO: from httpx import AsyncClient
# TODO: @pytest_asyncio.fixture async def db_session()
# TODO: @pytest_asyncio.fixture async def client(db_session)
# TODO: @pytest_asyncio.fixture async def test_patient(db_session)
# TODO: @pytest_asyncio.fixture async def test_kinesiologo(db_session)
# TODO: @pytest_asyncio.fixture async def auth_headers_patient(test_patient)
# TODO: @pytest_asyncio.fixture async def auth_headers_kine(test_kinesiologo)
