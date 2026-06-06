from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, field_validator


class UserCreate(BaseModel):
    wallet_address: str

    @field_validator("wallet_address")
    @classmethod
    def normalize(cls, v: str) -> str:
        return v.lower().strip()


class UserResponse(BaseModel):
    id: UUID
    wallet_address: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
