# Simple Deployment Setup
# Backend: Docker Hub + Your Server
# Frontend: Vercel

## Backend Deployment (Docker Hub)

Your backend image is already pushed:
- `vishalkkkk/inventory-backend:v1`

### Option 1: Run on Your Server with Docker

1. **Create `.env.prod` file:**
```bash
POSTGRES_USER=inventory_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=inventory_db
DOCKER_REGISTRY_USERNAME=vishalkkkk
BACKEND_IMAGE_TAG=v1
CORS_ORIGINS=https://your-frontend-url.vercel.app
```

2. **Start services:**
```bash
docker-compose -f docker-compose.simple.yml pull
docker-compose -f docker-compose.simple.yml up -d
```

3. **Verify:**
```bash
docker-compose -f docker-compose.simple.yml ps
curl http://localhost:8000/docs
```

### Option 2: Deploy Backend on a Container Service

- **Railway.app**: Push Docker image, set env vars, deploy in 1 click
- **Render**: Connect Docker Hub, auto-deploy on push
- **AWS ECS/ECR**: Upload image to ECR, create service
- **DigitalOcean App Platform**: Connect Docker Hub repo

---

## Frontend Deployment (Vercel)

### Setup for Vercel:

1. **Update `frontend/src/api/client.js`** with your backend URL:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.com';
```

2. **Update `frontend/package.json` build script** (if needed):
```json
"build": "vite build"
```

3. **Create `frontend/vercel.json`:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@vite_api_url"
  }
}
```

4. **Deploy to Vercel:**

   **Option A: Via Vercel CLI**
   ```bash
   npm install -g vercel
   cd frontend
   vercel --prod
   ```

   **Option B: Via Vercel Dashboard**
   - Go to https://vercel.com
   - Click "New Project"
   - Connect GitHub repo
   - Select `frontend` directory as root
   - Set env var: `VITE_API_URL=https://your-backend-url.com`
   - Click Deploy

5. **After Deployment:**
   - Update backend `CORS_ORIGINS` to include your Vercel URL
   - Test the frontend at `https://your-project.vercel.app`

---

## Testing

```bash
# Backend API
curl https://your-backend-url.com/docs

# Frontend
https://your-project.vercel.app
```

## Environment Variables

### Backend (.env.prod)
- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Strong password
- `POSTGRES_DB`: Database name
- `CORS_ORIGINS`: Your frontend Vercel URL

### Frontend (Vercel Environment)
- `VITE_API_URL`: Your backend URL (e.g., https://api.example.com)
