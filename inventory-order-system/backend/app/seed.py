from decimal import Decimal
from .database import SessionLocal, Base, engine
from .models import Product, Customer

sample_products = [
    {"name": "Laptop Pro 14", "description": "High performance business laptop", "sku": "LAP-PRO-14", "price": Decimal("65000"), "stock_quantity": 12},
    {"name": "Wireless Mouse", "description": "Ergonomic rechargeable mouse", "sku": "MOU-WL-01", "price": Decimal("899"), "stock_quantity": 30},
    {"name": "Mechanical Keyboard", "description": "RGB blue-switch keyboard", "sku": "KEY-MECH-01", "price": Decimal("2499"), "stock_quantity": 6},
    {"name": "27 inch Monitor", "description": "Full HD IPS display", "sku": "MON-27-FHD", "price": Decimal("14500"), "stock_quantity": 4},
]

sample_customers = [
    {"name": "Ansh Saini", "email": "ansh@example.com", "phone": "9876543210", "address": "Kurukshetra"},
    {"name": "Rahul Sharma", "email": "rahul@example.com", "phone": "9876501234", "address": "Delhi"},
    {"name": "Priya Verma", "email": "priya@example.com", "phone": "9876512345", "address": "Mumbai"},
]

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Product).count() == 0:
            db.add_all([Product(**p) for p in sample_products])
        if db.query(Customer).count() == 0:
            db.add_all([Customer(**c) for c in sample_customers])
        db.commit()
        print("Sample data inserted successfully.")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
