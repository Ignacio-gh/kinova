from fastapi import APIRouter

from app.api.v1.routes import auth, exercises, patients, pose, routines, sessions

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(patients.router, prefix="/patients", tags=["Patients"])
api_router.include_router(routines.router, prefix="/routines", tags=["Routines"])
api_router.include_router(exercises.router, prefix="/exercises", tags=["Exercises"])
api_router.include_router(pose.router, prefix="/pose", tags=["Pose"])
api_router.include_router(sessions.router, prefix="/sessions", tags=["Sessions"])
