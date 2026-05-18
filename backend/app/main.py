from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kinova API",
    description="API de asistencia biomecánica para rehabilitación física domiciliaria",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health"])
def read_root():
    return {"message": "Kinova Backend API v0.1.0"}


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
