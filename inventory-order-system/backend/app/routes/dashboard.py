from decimal import Decimal
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Product, Customer, Order
from ..schemas import DashboardStats

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_products = db.query(Product).count()
    total_customers = db.query(Customer).count()
    total_orders = db.query(Order).count()
    total_revenue = db.query(func.coalesce(func.sum(Order.total_amount), 0)).scalar() or Decimal("0")
    inventory_value = db.query(func.coalesce(func.sum(Product.price * Product.stock_quantity), 0)).scalar() or Decimal("0")
    low_stock_products = db.query(Product).filter(Product.stock_quantity <= 5).order_by(Product.stock_quantity.asc()).limit(8).all()
    out_of_stock_count = db.query(Product).filter(Product.stock_quantity == 0).count()
    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "low_stock_count": len(low_stock_products),
        "out_of_stock_count": out_of_stock_count,
        "inventory_value": inventory_value,
        "low_stock_products": low_stock_products,
    }
