from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from controller.score_controller import compute_credit_score, compute_trust_score
from database import get_db
from models.credit_score import ScoreRecord
from schemas.score import CreditScoreRequest, ScoreResponse, TrustScoreRequest, score_to_level

router = APIRouter(prefix="/scores", tags=["scores"])


@router.post("/credit", response_model=ScoreResponse, status_code=201)
def credit_score(data: CreditScoreRequest, db: Session = Depends(get_db)):
    if not data.wallets:
        raise HTTPException(status_code=422, detail="At least one wallet address required")
    try:
        score, breakdown = compute_credit_score(data.wallets)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Scoring error: {exc}") from exc

    record = ScoreRecord(
        score_type="credit",
        subject=data.wallets[0],
        score=score,
        breakdown=breakdown,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return ScoreResponse(
        id=record.id,
        score=score,
        level=score_to_level(score),
        breakdown=breakdown,
        created_at=record.created_at,
    )


@router.post("/trustworthy", response_model=ScoreResponse, status_code=201)
def trust_score(data: TrustScoreRequest, db: Session = Depends(get_db)):
    try:
        score, breakdown = compute_trust_score(data.national_id, data.country_code)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Scoring error: {exc}") from exc

    import hashlib
    subject = hashlib.sha256(data.national_id.encode()).hexdigest()[:16]

    record = ScoreRecord(
        score_type="trustworthy",
        subject=subject,
        score=score,
        breakdown=breakdown,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return ScoreResponse(
        id=record.id,
        score=score,
        level=score_to_level(score),
        breakdown=breakdown,
        created_at=record.created_at,
    )
