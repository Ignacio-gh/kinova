from datetime import date, datetime

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.patient import (
    PatientCreate,
    PatientDashboard,
    PatientListItem,
    PatientResponse,
    PatientStatusUpdate,
    PatientUpdate,
    TodayExerciseItem,
)
from app.services import adherence_service, routine_service


def _current_week(treatment_start_date: date) -> int:
    return (date.today() - treatment_start_date).days // 7 + 1


async def list_for_kinesiologo(
    db: AsyncSession,
    kine,
    search: str | None = None,
    status_filter: str | None = None,
) -> list[PatientListItem]:
    # TODO (modelos Agus): from app.models.patient import PatientProfile
    # TODO (modelos Agus): from app.models.user import User
    from app.models.patient import PatientProfile
    from app.models.user import User

    query = (
        select(PatientProfile, User)
        .join(User, User.id == PatientProfile.user_id)
        .where(PatientProfile.kinesiologo_id == kine.id)
    )

    if status_filter:
        query = query.where(PatientProfile.status == status_filter)

    if search:
        query = query.where(User.full_name.ilike(f"%{search}%"))

    result = await db.execute(query)
    rows = result.all()

    items = []
    for profile, user in rows:
        from app.models.session import Session

        adherence = await adherence_service.calculate_weekly_adherence(db, profile)
        current_week = _current_week(profile.treatment_start_date)

        last_session_result = await db.execute(
            select(func.max(Session.started_at)).where(
                Session.patient_id == profile.id,
                Session.status == "completed",
            )
        )
        last_session_at: datetime | None = last_session_result.scalar_one_or_none()

        items.append(
            PatientListItem(
                id=profile.id,
                full_name=user.full_name,
                email=user.email,
                diagnosis=profile.diagnosis,
                status=profile.status,
                current_week=current_week,
                treatment_weeks=profile.treatment_weeks,
                adherence_pct=adherence,
                last_session_at=last_session_at,
            )
        )
    return items


async def create_patient(
    db: AsyncSession,
    kine,
    data: PatientCreate,
) -> PatientResponse:
    # TODO (modelos Agus): from app.models.user import User
    # TODO (modelos Agus): from app.models.patient import PatientProfile
    from app.models.user import User
    from app.models.patient import PatientProfile

    existing = await db.execute(select(User).where(User.email == data.email))
    if existing.scalar_one_or_none() is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un usuario con ese email",
        )

    from app.core.security import hash_password
    import secrets

    temp_password = data.password if data.password else secrets.token_urlsafe(12)

    user = User(
        email=data.email,
        full_name=data.full_name,
        password_hash=hash_password(temp_password),
        role="paciente",
        is_active=True,
    )
    db.add(user)
    await db.flush()

    profile = PatientProfile(
        user_id=user.id,
        kinesiologo_id=kine.id,
        phone=data.phone,
        birth_date=data.birth_date,
        diagnosis=data.diagnosis,
        treatment_weeks=data.treatment_weeks,
        treatment_start_date=data.treatment_start_date,
        notes=data.notes,
        status="activo",
    )
    db.add(profile)
    await db.commit()
    await db.refresh(profile)
    await db.refresh(user)

    resp = await _build_patient_response(db, profile, user)
    resp.temp_password = temp_password
    return resp


async def get_patient_detail(
    db: AsyncSession,
    patient_id: int,
    kine,
) -> PatientResponse:
    from app.models.patient import PatientProfile
    from app.models.user import User

    result = await db.execute(
        select(PatientProfile, User)
        .join(User, User.id == PatientProfile.user_id)
        .where(PatientProfile.id == patient_id, PatientProfile.kinesiologo_id == kine.id)
    )
    row = result.first()

    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paciente no encontrado",
        )

    profile, user = row
    return await _build_patient_response(db, profile, user)


async def update_patient(
    db: AsyncSession,
    patient_id: int,
    data: PatientUpdate,
    kine,
) -> PatientResponse:
    from app.models.patient import PatientProfile
    from app.models.user import User

    result = await db.execute(
        select(PatientProfile, User)
        .join(User, User.id == PatientProfile.user_id)
        .where(PatientProfile.id == patient_id, PatientProfile.kinesiologo_id == kine.id)
    )
    row = result.first()

    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paciente no encontrado")

    profile, user = row

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)

    await db.commit()
    await db.refresh(profile)
    return await _build_patient_response(db, profile, user)


async def update_status(
    db: AsyncSession,
    patient_id: int,
    data: PatientStatusUpdate,
    kine,
) -> PatientResponse:
    from app.models.patient import PatientProfile
    from app.models.user import User
    from app.models.routine import Routine

    result = await db.execute(
        select(PatientProfile, User)
        .join(User, User.id == PatientProfile.user_id)
        .where(PatientProfile.id == patient_id, PatientProfile.kinesiologo_id == kine.id)
    )
    row = result.first()

    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paciente no encontrado")

    profile, user = row
    profile.status = data.status

    if data.status == "finalizado":
        routines_result = await db.execute(
            select(Routine).where(Routine.patient_id == patient_id, Routine.is_active == True)
        )
        for routine in routines_result.scalars().all():
            routine.is_active = False

    await db.commit()
    await db.refresh(profile)
    return await _build_patient_response(db, profile, user)


async def get_dashboard(
    db: AsyncSession,
    patient,
) -> PatientDashboard:
    from app.core.timezone import local_today_bounds
    from app.models.session import ExerciseExecution, Session

    today_routines = await routine_service.get_today_routine(db, patient)
    adherence = await adherence_service.calculate_weekly_adherence(db, patient)
    current_week = _current_week(patient.treatment_start_date)

    # Buscar que rutinas se completaron HOY
    today_start, _ = local_today_bounds()
    completed_result = await db.execute(
        select(ExerciseExecution.routine_id)
        .join(Session, Session.id == ExerciseExecution.session_id)
        .where(
            Session.patient_id == patient.id,
            ExerciseExecution.status == "completed",
            ExerciseExecution.started_at >= today_start,
        )
    )
    completed_routine_ids = {row[0] for row in completed_result.all()}

    today_exercises = [
        TodayExerciseItem(
            routine_id=r.routine_id,
            name=r.exercise.name,
            zone=r.exercise.zone,
            evaluator_key=r.exercise.evaluator_key,
            reps=r.reps,
            sets=r.sets,
            effective_angle_min=r.angle_min,
            effective_angle_max=r.angle_max,
            completed=r.routine_id in completed_routine_ids,
        )
        for r in today_routines
    ]

    return PatientDashboard(
        today_exercises=today_exercises,
        adherence_pct=adherence,
        current_week=current_week,
        treatment_weeks=patient.treatment_weeks,
    )


async def _build_patient_response(db, profile, user) -> PatientResponse:
    from app.models.session import Session
    from app.schemas.user import UserResponse

    adherence = await adherence_service.calculate_weekly_adherence(db, profile)
    current_week = _current_week(profile.treatment_start_date)

    last_session_result = await db.execute(
        select(func.max(Session.started_at)).where(
            Session.patient_id == profile.id,
            Session.status == "completed",
        )
    )
    last_session_at = last_session_result.scalar_one_or_none()

    return PatientResponse(
        id=profile.id,
        user=UserResponse.model_validate(user),
        kinesiologo_id=profile.kinesiologo_id,
        phone=profile.phone,
        birth_date=profile.birth_date,
        diagnosis=profile.diagnosis,
        notes=profile.notes,
        treatment_weeks=profile.treatment_weeks,
        treatment_start_date=profile.treatment_start_date,
        status=profile.status,
        current_week=current_week,
        adherence_pct=adherence,
        last_session_at=last_session_at,
        created_at=profile.created_at,
    )
