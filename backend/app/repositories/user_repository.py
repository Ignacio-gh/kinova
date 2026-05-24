"""
user_repository.py — Acceso a datos de Users.

Queries planeadas:
    async def get_by_id(db, user_id) -> User | None
    async def get_by_email(db, email) -> User | None
    async def create(db, email, password_hash, full_name, role) -> User
    async def email_exists(db, email) -> bool
"""

# TODO: from app.models.user import User
# TODO: from app.repositories.base import BaseRepository
# TODO: class UserRepository(BaseRepository[User])
