from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=schemas.OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order(db, order)


@router.get("", response_model=List[schemas.OrderOut])
def get_orders(db: Session = Depends(get_db)):
    return crud.list_orders(db)


@router.get("/{order_id}", response_model=schemas.OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)):
    return crud.get_order_or_404(db, order_id)
