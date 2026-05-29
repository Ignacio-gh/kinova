from fastapi import APIRouter

from app.api.v1.routes import patients, routines

api_router = APIRouter()

api_router.include_router(patients.router, prefix="/patients", tags=["Patients"])
api_router.include_router(routines.router, prefix="/routines", tags=["Routines"])

# TODO (Santi): agregar cuando estén listos
# api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
# api_router.include_router(kinesiologos.router, prefix="/kinesiologos", tags=["Kinesiologos"])
# api_router.include_router(exercises.router, prefix="/exercises", tags=["Exercises"])
# api_router.include_router(progressions.router, prefix="/progressions", tags=["Progressions"])
# api_router.include_router(sessions.router, prefix="/sessions", tags=["Sessions"])
# api_router.include_router(pose.router, prefix="/pose", tags=["Pose"])
