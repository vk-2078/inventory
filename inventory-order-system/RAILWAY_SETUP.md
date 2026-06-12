# Railway.app Backend Deployment Guide

## What You'll Do:
1. ✅ Already have: Backend image on Docker Hub (`vishalkkkk/inventory-backend:v1`)
2. Connect Docker Hub to Railway
3. Deploy with 1 click
4. Get your backend URL
5. Update frontend CORS

---

## Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub (easiest)
3. Create new project

---

## Step 2: Deploy PostgreSQL Database

1. Click "+ New" → Select "PostgreSQL"
2. Railway creates the database automatically
3. Go to "Variables" tab
4. Copy these values (you'll need them):
   - `DATABASE_URL` (full connection string)
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DB`

💡 Save these in a safe place!

---

## Step 3: Deploy Backend (Docker Hub Image)

1. Click "+ New" → "GitHub Repo" 
   OR "+ New" → "Docker Image"

2. If using Docker Image:
   - Enter: `vishalkkkk/inventory-backend:v1`
   - Click Deploy

3. If using GitHub Repo:
   - Connect your GitHub repo
   - Railway auto-detects and builds

---

## Step 4: Configure Environment Variables

In Railway Dashboard:

1. Select "backend" service
2. Go to "Variables"
3. Add these:
```
DATABASE_URL=<copy from PostgreSQL step>
CORS_ORIGINS=http://localhost:3000
BACKEND_PORT=8000
```

4. Click "Deploy"

---

## Step 5: Get Your Backend URL

1. In Railway, go to "Settings" → "Domains"
2. You'll see: `https://inventory-backend-xxx.railway.app`
3. Test it: Open `https://inventory-backend-xxx.railway.app/docs`

✅ If you see Swagger docs, it's working!

---

## Step 6: Update Frontend CORS

After you deploy frontend to Vercel:

1. Go back to Railway backend
2. Update `CORS_ORIGINS` to: `https://your-frontend.vercel.app`
3. Redeploy

---

## Important URLs

- 📱 **Backend API**: `https://inventory-backend-xxx.railway.app`
- 📖 **Swagger Docs**: `https://inventory-backend-xxx.railway.app/docs`
- 🗄️ **Database**: Auto-managed by Railway

---

## Quick Reference

Your Current Credentials (save this):
```
Database User: inventory_user
Database Password: P9@xKmL2$vQn8yJw#5TzR
Database Name: inventory_db
Docker Image: vishalkkkk/inventory-backend:v1
```

---

## Troubleshooting

**Q: Getting 502 error?**
- Check "Logs" tab in Railway
- Usually means DATABASE_URL is wrong
- Redeploy after fixing

**Q: API not accessible?**
- Wait 2-3 minutes for deployment
- Check if service shows "Running" (green)

**Q: Forgot DATABASE_URL?**
- Go to PostgreSQL service in Railway
- Variables tab → see all DB credentials
