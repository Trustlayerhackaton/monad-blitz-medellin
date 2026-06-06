from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, field_validator


class CreditScoreRequest(BaseModel):
    wallets: list[str]

    @field_validator("wallets")
    @classmethod
    def normalize(cls, v: list[str]) -> list[str]:
        return [w.lower().strip() for w in v if w.strip()]


class TrustScoreRequest(BaseModel):
    national_id: str
    country_code: str = "CO"

    @field_validator("country_code")
    @classmethod
    def upper(cls, v: str) -> str:
        return v.upper().strip()


class ScoreResponse(BaseModel):
    id: UUID
    score: int
    level: str
    breakdown: dict
    created_at: datetime

    model_config = {"from_attributes": True}


def score_to_level(score: int) -> str:
    if score >= 750:
        return "LOW_RISK"
    if score >= 500:
        return "MEDIUM_RISK"
    if score >= 250:
        return "HIGH_RISK"
    return "CRITICAL_RISK"
