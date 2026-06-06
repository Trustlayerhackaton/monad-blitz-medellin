from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from controller import user_controller
from database import get_db
from schemas.user import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=list[UserResponse])
def list_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return user_controller.get_users(db, skip=skip, limit=limit)


@router.get("/{wallet_address}", response_model=UserResponse)
def get_user(wallet_address: str, db: Session = Depends(get_db)):
    user = user_controller.get_user_by_wallet(db, wallet_address.lower())
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", response_model=UserResponse, status_code=201)
def create_user(data: UserCreate, db: Session = Depends(get_db)):
    if user_controller.get_user_by_wallet(db, data.wallet_address):
        raise HTTPException(status_code=409, detail="Wallet already registered")
    return user_controller.create_user(db, data)
