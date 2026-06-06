import os

from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv()

from database import Base, engine  # noqa: E402 — must run after load_dotenv
from routers import users_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Trustlayer API")

app.include_router(users_router)


@app.get("/health")
def health():
    return {"status": "ok", "db_configured": os.getenv("DATABASE_URL") is not None}
