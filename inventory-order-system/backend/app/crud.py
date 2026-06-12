from decimal import Decimal
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload
from . import models, schemas


def list_products(db: Session):
    return db.query(models.Product).order_by(models.Product.id.desc()).all()


def get_product_or_404(db: Session, product_id: int):
    product = db.get(models.Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


def create_product(db: Session, data: schemas.ProductCreate):
    product = models.Product(**data.model_dump())
    db.add(product)
    try:
        db.commit()
        db.refresh(product)
        return product
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Product SKU already exists")


def update_product(db: Session, product_id: int, data: schemas.ProductUpdate):
    product = get_product_or_404(db, product_id)
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(product, key, value)
    try:
        db.commit()
        db.refresh(product)
        return product
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Product SKU already exists")


def delete_product(db: Session, product_id: int):
    product = get_product_or_404(db, product_id)
    db.delete(product)
    db.commit()


def list_customers(db: Session):
    return db.query(models.Customer).order_by(models.Customer.id.desc()).all()


def get_customer_or_404(db: Session, customer_id: int):
    customer = db.get(models.Customer, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


def create_customer(db: Session, data: schemas.CustomerCreate):
    customer = models.Customer(**data.model_dump())
    db.add(customer)
    try:
        db.commit()
        db.refresh(customer)
        return customer
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Customer email already exists")


def update_customer(db: Session, customer_id: int, data: schemas.CustomerUpdate):
    customer = get_customer_or_404(db, customer_id)
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(customer, key, value)
    try:
        db.commit()
        db.refresh(customer)
        return customer
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Customer email already exists")


def delete_customer(db: Session, customer_id: int):
    customer = get_customer_or_404(db, customer_id)
    db.delete(customer)
    db.commit()


def list_orders(db: Session):
    return (
        db.query(models.Order)
        .options(joinedload(models.Order.order_items).joinedload(models.OrderItem.product))
        .order_by(models.Order.id.desc())
        .all()
    )


def get_order_or_404(db: Session, order_id: int):
    order = (
        db.query(models.Order)
        .options(joinedload(models.Order.order_items).joinedload(models.OrderItem.product))
        .filter(models.Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


def create_order(db: Session, data: schemas.OrderCreate):
    customer = db.get(models.Customer, data.customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer does not exist")

    merged = {}
    for item in data.items:
        merged[item.product_id] = merged.get(item.product_id, 0) + item.quantity

    try:
        product_ids = list(merged.keys())
        products = (
            db.query(models.Product)
            .filter(models.Product.id.in_(product_ids))
            .with_for_update()
            .all()
        )
        product_map = {p.id: p for p in products}

        missing = [pid for pid in product_ids if pid not in product_map]
        if missing:
            raise HTTPException(status_code=404, detail=f"Products not found: {missing}")

        total = Decimal("0.00")
        order = models.Order(customer_id=data.customer_id, total_amount=total, status="PLACED")
        db.add(order)
        db.flush()

        for product_id, quantity in merged.items():
            product = product_map[product_id]
            if product.stock_quantity < quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for SKU {product.sku}. Available: {product.stock_quantity}, requested: {quantity}",
                )
            unit_price = Decimal(product.price)
            subtotal = unit_price * quantity
            product.stock_quantity -= quantity
            total += subtotal
            db.add(models.OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=quantity,
                unit_price=unit_price,
                subtotal=subtotal,
            ))

        order.total_amount = total
        db.commit()
        return get_order_or_404(db, order.id)
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise
