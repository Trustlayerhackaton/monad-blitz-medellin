from sqlalchemy.orm import Session

from models.user import User
from schemas.user import UserCreate


def get_users(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
    return db.query(User).offset(skip).limit(limit).all()


def get_user_by_wallet(db: Session, wallet_address: str) -> User | None:
    return db.query(User).filter(User.wallet_address == wallet_address).first()


def create_user(db: Session, data: UserCreate) -> User:
    user = User(wallet_address=data.wallet_address)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
