"""initial_schema

Revision ID: 11f38a6af048
Revises:
Create Date: 2026-06-02
"""
from alembic import op
import sqlalchemy as sa

revision = '11f38a6af048'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'exercises',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('zone', sa.String(length=50), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('steps', sa.JSON(), nullable=False),
        sa.Column('benefits', sa.JSON(), nullable=False),
        sa.Column('target_muscles', sa.JSON(), nullable=False),
        sa.Column('image_url', sa.Text(), nullable=True),
        sa.Column('video_url', sa.Text(), nullable=True),
        sa.Column('evaluator_key', sa.String(length=50), nullable=True),
        sa.Column('default_landmarks_config', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name'),
    )
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=100), nullable=False),
        sa.Column('role', sa.String(length=20), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_table(
        'kinesiologo_profiles',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('matricula', sa.String(length=20), nullable=False),
        sa.Column('credencial_url', sa.String(length=500), nullable=True),
        sa.Column('especialidad', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id'),
    )
    op.create_table(
        'patient_profiles',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('kinesiologo_id', sa.Integer(), nullable=False),
        sa.Column('phone', sa.String(length=30), nullable=True),
        sa.Column('birth_date', sa.Date(), nullable=True),
        sa.Column('diagnosis', sa.Text(), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('treatment_weeks', sa.Integer(), nullable=False),
        sa.Column('treatment_start_date', sa.Date(), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.ForeignKeyConstraint(['kinesiologo_id'], ['kinesiologo_profiles.id']),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id'),
    )
    op.create_table(
        'routines',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('patient_id', sa.Integer(), nullable=False),
        sa.Column('exercise_id', sa.Integer(), nullable=False),
        sa.Column('assigned_by_kinesiologo_id', sa.Integer(), nullable=True),
        sa.Column('day_of_week', sa.String(length=20), nullable=False),
        sa.Column('reps', sa.Integer(), nullable=False),
        sa.Column('sets', sa.Integer(), nullable=False),
        sa.Column('default_angle_min', sa.Float(), nullable=True),
        sa.Column('default_angle_max', sa.Float(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.ForeignKeyConstraint(['assigned_by_kinesiologo_id'], ['kinesiologo_profiles.id']),
        sa.ForeignKeyConstraint(['exercise_id'], ['exercises.id']),
        sa.ForeignKeyConstraint(['patient_id'], ['patient_profiles.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_table(
        'sessions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('patient_id', sa.Integer(), nullable=False),
        sa.Column('started_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('ended_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('duration_minutes', sa.Integer(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('adherence_pct', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.ForeignKeyConstraint(['patient_id'], ['patient_profiles.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_table(
        'exercise_executions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('session_id', sa.Integer(), nullable=False),
        sa.Column('routine_id', sa.Integer(), nullable=True),
        sa.Column('started_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('ended_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('target_reps', sa.Integer(), nullable=True),
        sa.Column('completed_reps', sa.Integer(), nullable=False),
        sa.Column('correct_reps', sa.Integer(), nullable=False),
        sa.Column('effective_angle_min', sa.Float(), nullable=True),
        sa.Column('effective_angle_max', sa.Float(), nullable=True),
        sa.Column('avg_score', sa.Float(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.ForeignKeyConstraint(['routine_id'], ['routines.id']),
        sa.ForeignKeyConstraint(['session_id'], ['sessions.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_table(
        'routine_progressions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('routine_id', sa.Integer(), nullable=False),
        sa.Column('week_number', sa.Integer(), nullable=False),
        sa.Column('angle_min', sa.Float(), nullable=True),
        sa.Column('angle_max', sa.Float(), nullable=True),
        sa.Column('reps_override', sa.Integer(), nullable=True),
        sa.Column('sets_override', sa.Integer(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.ForeignKeyConstraint(['routine_id'], ['routines.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('routine_id', 'week_number', name='uq_routine_week'),
    )
    op.create_table(
        'feedback_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('exercise_execution_id', sa.Integer(), nullable=False),
        sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('correction_type', sa.String(length=100), nullable=False),
        sa.Column('message', sa.Text(), nullable=True),
        sa.Column('severity', sa.String(length=20), nullable=False),
        sa.Column('joint_angles_snapshot', sa.JSON(), nullable=True),
        sa.ForeignKeyConstraint(['exercise_execution_id'], ['exercise_executions.id']),
        sa.PrimaryKeyConstraint('id'),
    )


def downgrade() -> None:
    op.drop_table('feedback_logs')
    op.drop_table('routine_progressions')
    op.drop_table('exercise_executions')
    op.drop_table('sessions')
    op.drop_table('routines')
    op.drop_table('patient_profiles')
    op.drop_table('kinesiologo_profiles')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
    op.drop_table('exercises')
