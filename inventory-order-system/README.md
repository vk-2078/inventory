# StockPilot — Inventory & Order Management System

A complete full-stack assessment project built with **FastAPI, React, PostgreSQL, SQLAlchemy, Docker and Docker Compose**.

## What is improved in this version?

- Premium dark glassmorphism UI different from the reference screenshots.
- Technical dashboard with revenue, inventory value, low-stock alerts and inventory health.
- Product CRUD with SKU validation, search and stock status badges.
- Customer CRUD with unique valid email validation and search.
- Order creation with multiple products, live subtotal/total calculation and frontend stock warning.
- Backend transaction safety using PostgreSQL row locking during order creation.
- Swagger docs, CORS, Docker, environment variables and deployment-ready structure.

## Folder Structure

```text
inventory-order-system/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── crud.py
│   │   ├── seed.py
│   │   └── routes/
│   │       ├── products.py
│   │       ├── customers.py
│   │       ├── orders.py
│   │       └── dashboard.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/client.js
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
└── README.md
```

## Run with Docker

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker-compose up --build
```

Open:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Swagger Docs: `http://localhost:8000/docs`

## Add Sample Data

After Docker is running:

```bash
docker-compose exec backend python -m app.seed
```

Sample products and customers will be inserted.

## API Endpoints

### Products

- `POST /products`
- `GET /products`
- `GET /products/{id}`
- `PUT /products/{id}`
- `DELETE /products/{id}`

### Customers

- `POST /customers`
- `GET /customers`
- `GET /customers/{id}`
- `PUT /customers/{id}`
- `DELETE /customers/{id}`

### Orders

- `POST /orders`
- `GET /orders`
- `GET /orders/{id}`

### Dashboard

- `GET /dashboard/stats`
- `GET /health`

## Business Rules Implemented

- SKU must be unique.
- Product price must be greater than 0.
- Product stock cannot be negative.
- Customer email must be valid and unique.
- Order must belong to an existing customer.
- Order must contain at least one product.
- Stock is checked before order creation.
- Order is rejected when stock is insufficient.
- Product stock automatically reduces after order placement.
- Total and subtotal are calculated automatically.
- Database transaction and `SELECT FOR UPDATE` row locking keep stock/order consistent.

## Environment Variables

### Backend

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/inventory_db
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
BACKEND_PORT=8000
```

### Frontend

```env
VITE_API_URL=http://localhost:8000
FRONTEND_PORT=3000
```

## Deployment

### Backend on Render/Railway

- Create PostgreSQL database.
- Deploy backend folder as Docker web service.
- Add environment variables:
  - `DATABASE_URL`
  - `CORS_ORIGINS=https://your-frontend-url.vercel.app`
  - `BACKEND_PORT=8000`
- Backend URL example: `https://your-backend.onrender.com`
- Docs URL: `https://your-backend.onrender.com/docs`

### Frontend on Vercel/Netlify

- Import GitHub repository.
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Add environment variable:
  - `VITE_API_URL=https://your-backend.onrender.com`

### Docker Hub Backend Image

```bash
docker login
docker build -t YOUR_DOCKER_USERNAME/inventory-backend:latest ./backend
docker push YOUR_DOCKER_USERNAME/inventory-backend:latest
```

## Form Submission Links

Submit these links in the company form:

```text
GitHub Repository Link: https://github.com/YOUR_USERNAME/inventory-order-system
Backend Docker Hub Image Link: https://hub.docker.com/r/YOUR_DOCKER_USERNAME/inventory-backend
Frontend Hosted URL: https://your-frontend.vercel.app
Backend API Hosted URL: https://your-backend.onrender.com
```
