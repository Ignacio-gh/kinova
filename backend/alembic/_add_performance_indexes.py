"""add performance indexes

Agrega 10 índices sobre las columnas más consultadas para subir de
5 índices explícitos (solo PKs y uniques definidos en los modelos)
a 15. Los índices cubren todos los WHERE y JOIN frecuentes de
patient_service, routine_service, adherence_service y session routes.

Revision ID: a4f8c2e1b3d7
Revises:
Create Date: 2026-06-08
"""

from alembic import op
import sqlalchemy as sa

# ── Identificadores de esta migración ────────────────────────
revision = "a4f8c2e1b3d7"
down_revision = None   # primera migración del proyecto
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── patient_profiles ─────────────────────────────────────
    # list_for_kinesiologo: WHERE kinesiologo_id = ?
    op.create_index(
        "ix_patient_profiles_kinesiologo_id",
        "patient_profiles",
        ["kinesiologo_id"],
    )
    # list_for_kinesiologo con filtro: WHERE status = ?
    op.create_index(
        "ix_patient_profiles_status",
        "patient_profiles",
        ["status"],
    )

    # ── routines ─────────────────────────────────────────────
    # get_weekly_routine / assign_exercise: WHERE patient_id = ?
    op.create_index(
        "ix_routines_patient_id",
        "routines",
        ["patient_id"],
    )
    # assign_exercise — JOIN exercises: WHERE exercise_id = ?
    op.create_index(
        "ix_routines_exercise_id",
        "routines",
        ["exercise_id"],
    )
    # get_today_routine — hot path: WHERE patient_id = ? AND day_of_week = ? AND is_active
    # Índice parcial: solo rutinas activas (excluye las soft-deleted).
    op.create_index(
        "ix_routines_patient_day_active",
        "routines",
        ["patient_id", "day_of_week"],
        postgresql_where=sa.text("is_active = true"),
    )

    # ── sessions ─────────────────────────────────────────────
    # _build_history / adherence: WHERE patient_id = ?
    op.create_index(
        "ix_sessions_patient_id",
        "sessions",
        ["patient_id"],
    )
    # complete_exercise — busca sesión de hoy: WHERE patient_id = ? AND started_at >= ?
    # DESC para que las sesiones recientes se encuentren primero.
    op.create_index(
        "ix_sessions_patient_started",
        "sessions",
        ["patient_id", sa.text("started_at DESC")],
    )
    # _build_history / kine stats: WHERE status = 'completed'
    op.create_index(
        "ix_sessions_status",
        "sessions",
        ["status"],
    )

    # ── exercise_executions ───────────────────────────────────
    # _build_history — JOIN: ON session_id = sessions.id
    op.create_index(
        "ix_exercise_executions_session_id",
        "exercise_executions",
        ["session_id"],
    )
    # complete_exercise — check de duplicado: WHERE routine_id = ? AND status = ?
    op.create_index(
        "ix_exercise_executions_routine_id",
        "exercise_executions",
        ["routine_id"],
    )


def downgrade() -> None:
    op.drop_index("ix_exercise_executions_routine_id",  table_name="exercise_executions")
    op.drop_index("ix_exercise_executions_session_id",  table_name="exercise_executions")
    op.drop_index("ix_sessions_status",                 table_name="sessions")
    op.drop_index("ix_sessions_patient_started",        table_name="sessions")
    op.drop_index("ix_sessions_patient_id",             table_name="sessions")
    op.drop_index("ix_routines_patient_day_active",     table_name="routines")
    op.drop_index("ix_routines_exercise_id",            table_name="routines")
    op.drop_index("ix_routines_patient_id",             table_name="routines")
    op.drop_index("ix_patient_profiles_status",         table_name="patient_profiles")
    op.drop_index("ix_patient_profiles_kinesiologo_id", table_name="patient_profiles")
