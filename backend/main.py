import os

from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv()

app = FastAPI(title="Trustlayer API")

DATABASE_URL = os.getenv("DATABASE_URL")


@app.get("/health")
def health():
    return {"status": "ok", "db_configured": DATABASE_URL is not None}
