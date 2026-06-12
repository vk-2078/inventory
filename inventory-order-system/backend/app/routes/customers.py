from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.post("", response_model=schemas.CustomerOut, status_code=status.HTTP_201_CREATED)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    return crud.create_customer(db, customer)


@router.get("", response_model=List[schemas.CustomerOut])
def get_customers(db: Session = Depends(get_db)):
    return crud.list_customers(db)


@router.get("/{customer_id}", response_model=schemas.CustomerOut)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    return crud.get_customer_or_404(db, customer_id)


@router.put("/{customer_id}", response_model=schemas.CustomerOut)
def update_customer(customer_id: int, customer: schemas.CustomerUpdate, db: Session = Depends(get_db)):
    return crud.update_customer(db, customer_id, customer)


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    crud.delete_customer(db, customer_id)
    return None
