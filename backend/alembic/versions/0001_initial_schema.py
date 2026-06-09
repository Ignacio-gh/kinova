"""initial_schema

Revision ID: 0001
Revises:
Create Date: 2026-06-08

Crea todas las tablas con índices optimizados para las queries frecuentes
del backend Kinova (sesiones activas, rutinas por día, feedback por ejecución).
"""

from alembic import op
import sqlalchemy as sa

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── Enums (solo PostgreSQL los crea como tipos) ───────────────────────
    _is_pg = op.get_bind().dialect.name == "postgresql"

    if _is_pg:
        op.execute("CREATE TYPE user_role AS ENUM ('paciente', 'kinesiologo')")
        op.execute("CREATE TYPE patient_status AS ENUM ('activo', 'finalizado')")
        op.execute("CREATE TYPE session_status AS ENUM ('active', 'completed', 'abandoned')")
        op.execute("CREATE TYPE execution_status AS ENUM ('active', 'completed', 'abandoned')")
        op.execute("CREATE TYPE feedback_severity AS ENUM ('info', 'improve', 'bad')")
        op.execute(
            "CREATE TYPE day_of_week AS ENUM "
            "('monday','tuesday','wednesday','thursday','friday','saturday','sunday')"
        )
        op.execute(
            "CREATE TYPE exercise_zone AS ENUM "
            "('Rodilla','Cadera','Tobillo','Muslo','Glúteo')"
        )

    # ── users ─────────────────────────────────────────────────────────────
    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(100), nullable=False),
        sa.Column(
            "role",
            sa.Enum("paciente", "kinesiologo", name="user_role", create_type=False),
            nullable=False,
        ),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    # ── kinesiologo_profiles ───────────────────────────────────────────────
    op.create_table(
        "kinesiologo_profiles",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("matricula", sa.String(20), nullable=False),
        sa.Column("credencial_url", sa.String(500), nullable=True),
        sa.Column("especialidad", sa.String(100), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("ix_kinesiologo_profiles_user_id", "kinesiologo_profiles", ["user_id"], unique=True)

    # ── patient_profiles ──────────────────────────────────────────────────
    op.create_table(
        "patient_profiles",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("kinesiologo_id", sa.Integer, sa.ForeignKey("kinesiologo_profiles.id"), nullable=False),
        sa.Column("phone", sa.String(30), nullable=True),
        sa.Column("birth_date", sa.Date, nullable=True),
        sa.Column("diagnosis", sa.Text, nullable=False),
        sa.Column("notes", sa.Text, nullable=True),
        sa.Column("treatment_weeks", sa.Integer, nullable=False),
        sa.Column("treatment_start_date", sa.Date, nullable=False),
        sa.Column(
            "status",
            sa.Enum("activo", "finalizado", name="patient_status", create_type=False),
            nullable=False,
            server_default="activo",
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("ix_patient_profiles_user_id", "patient_profiles", ["user_id"], unique=True)
    op.create_index("ix_patient_profiles_kinesiologo_id", "patient_profiles", ["kinesiologo_id"])
    # Índice compuesto: "todos los pacientes activos de un kine" (lista principal del dashboard)
    op.create_index(
        "ix_patient_profiles_kinesiologo_status",
        "patient_profiles",
        ["kinesiologo_id", "status"],
    )

    # ── exercises ─────────────────────────────────────────────────────────
    op.create_table(
        "exercises",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column(
            "zone",
            sa.Enum("Rodilla", "Cadera", "Tobillo", "Muslo", "Glúteo", name="exercise_zone", create_type=False),
            nullable=False,
        ),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("steps", sa.JSON, nullable=False, server_default="[]"),
        sa.Column("benefits", sa.JSON, nullable=False, server_default="[]"),
        sa.Column("target_muscles", sa.JSON, nullable=False, server_default="[]"),
        sa.Column("image_url", sa.Text, nullable=True),
        sa.Column("video_url", sa.Text, nullable=True),
        sa.Column("evaluator_key", sa.String(50), nullable=True),
        sa.Column("default_landmarks_config", sa.JSON, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("ix_exercises_name", "exercises", ["name"], unique=True)

    # ── routines ──────────────────────────────────────────────────────────
    op.create_table(
        "routines",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("patient_id", sa.Integer, sa.ForeignKey("patient_profiles.id"), nullable=False),
        sa.Column("exercise_id", sa.Integer, sa.ForeignKey("exercises.id"), nullable=False),
        sa.Column("assigned_by_kinesiologo_id", sa.Integer, sa.ForeignKey("kinesiologo_profiles.id"), nullable=True),
        sa.Column(
            "day_of_week",
            sa.Enum(
                "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
                name="day_of_week",
                create_type=False,
            ),
            nullable=False,
        ),
        sa.Column("reps", sa.Integer, nullable=False, server_default="10"),
        sa.Column("sets", sa.Integer, nullable=False, server_default="3"),
        sa.Column("default_angle_min", sa.Float, nullable=True),
        sa.Column("default_angle_max", sa.Float, nullable=True),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("ix_routines_patient_id", "routines", ["patient_id"])
    # Índice compuesto principal: pose engine consulta por paciente + día + activo
    op.create_index(
        "ix_routines_patient_day",
        "routines",
        ["patient_id", "day_of_week", "is_active"],
    )

    # ── routine_progressions ──────────────────────────────────────────────
    op.create_table(
        "routine_progressions",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("routine_id", sa.Integer, sa.ForeignKey("routines.id"), nullable=False),
        sa.Column("week_number", sa.Integer, nullable=False),
        sa.Column("angle_min", sa.Float, nullable=True),
        sa.Column("angle_max", sa.Float, nullable=True),
        sa.Column("reps_override", sa.Integer, nullable=True),
        sa.Column("sets_override", sa.Integer, nullable=True),
        sa.Column("notes", sa.Text, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.UniqueConstraint("routine_id", "week_number", name="uq_routine_week"),
    )
    op.create_index("ix_routine_progressions_routine_id", "routine_progressions", ["routine_id"])

    # ── sessions ──────────────────────────────────────────────────────────
    op.create_table(
        "sessions",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("patient_id", sa.Integer, sa.ForeignKey("patient_profiles.id"), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("ended_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("duration_minutes", sa.Integer, nullable=True),
        sa.Column(
            "status",
            sa.Enum("active", "completed", "abandoned", name="session_status", create_type=False),
            nullable=False,
            server_default="active",
        ),
        sa.Column("adherence_pct", sa.Float, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("ix_sessions_patient_id", "sessions", ["patient_id"])
    # Índice compuesto: "sesión activa de un paciente" (consulta al abrir la app)
    op.create_index("ix_sessions_patient_status", "sessions", ["patient_id", "status"])

    # ── exercise_executions ───────────────────────────────────────────────
    op.create_table(
        "exercise_executions",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("session_id", sa.Integer, sa.ForeignKey("sessions.id"), nullable=False),
        sa.Column("routine_id", sa.Integer, sa.ForeignKey("routines.id"), nullable=True),
        sa.Column("started_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("ended_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("target_reps", sa.Integer, nullable=True),
        sa.Column("completed_reps", sa.Integer, nullable=False, server_default="0"),
        sa.Column("correct_reps", sa.Integer, nullable=False, server_default="0"),
        sa.Column("effective_angle_min", sa.Float, nullable=True),
        sa.Column("effective_angle_max", sa.Float, nullable=True),
        sa.Column("avg_score", sa.Float, nullable=True),
        sa.Column(
            "status",
            sa.Enum("active", "completed", "abandoned", name="execution_status", create_type=False),
            nullable=False,
            server_default="active",
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("ix_exercise_executions_session_id", "exercise_executions", ["session_id"])
    # Compuesto: ejecuciones completadas de una sesión
    op.create_index(
        "ix_exercise_executions_session_status",
        "exercise_executions",
        ["session_id", "status"],
    )
    # Para contar ejecuciones por semana (adherencia)
    op.create_index("ix_exercise_executions_started_at", "exercise_executions", ["started_at"])

    # ── feedback_logs ─────────────────────────────────────────────────────
    op.create_table(
        "feedback_logs",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "exercise_execution_id",
            sa.Integer,
            sa.ForeignKey("exercise_executions.id"),
            nullable=False,
        ),
        sa.Column("timestamp", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("correction_type", sa.String(100), nullable=False),
        sa.Column("message", sa.Text, nullable=True),
        sa.Column(
            "severity",
            sa.Enum("info", "improve", "bad", name="feedback_severity", create_type=False),
            nullable=False,
            server_default="info",
        ),
        sa.Column("joint_angles_snapshot", sa.JSON, nullable=True),
    )
    op.create_index(
        "ix_feedback_logs_exercise_execution_id",
        "feedback_logs",
        ["exercise_execution_id"],
    )
    op.create_index("ix_feedback_logs_timestamp", "feedback_logs", ["timestamp"])


def downgrade() -> None:
    op.drop_table("feedback_logs")
    op.drop_table("exercise_executions")
    op.drop_table("sessions")
    op.drop_table("routine_progressions")
    op.drop_table("routines")
    op.drop_table("exercises")
    op.drop_table("patient_profiles")
    op.drop_table("kinesiologo_profiles")
    op.drop_table("users")

    _is_pg = op.get_bind().dialect.name == "postgresql"
    if _is_pg:
        op.execute("DROP TYPE IF EXISTS feedback_severity")
        op.execute("DROP TYPE IF EXISTS execution_status")
        op.execute("DROP TYPE IF EXISTS session_status")
        op.execute("DROP TYPE IF EXISTS day_of_week")
        op.execute("DROP TYPE IF EXISTS exercise_zone")
        op.execute("DROP TYPE IF EXISTS patient_status")
        op.execute("DROP TYPE IF EXISTS user_role")
