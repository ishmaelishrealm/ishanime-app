# Ishanime Deployment Guide

This guide covers deploying both the frontend (Vercel) and backend (Railway) components of Ishanime.

## Repository Structure

```
📁 ishanime/
├── 📁 src/            # Frontend (Vite + React + Tailwind)
├── 📁 server/         # Backend (Express + Bunny CDN)
├── 📁 scripts/        # Deployment automation scripts
│   └── deploy-railway.js  # One-command Railway deploy
├── 📄 package.json    # Frontend dependencies & scripts
├── 📄 vercel.json     # Vercel deployment config
├── 📄 railway.json    # Railway deployment config
├── 📄 DEPLOYMENT.md   # This guide
└── 📄 RAILWAY_SETUP.md # Railway automation guide
```

### Frontend (`src/` folder)
- React components with original UI design
- Vite build system
- Tailwind CSS styling
- Environment configuration

### Backend (`server/` folder)
- Express.js API server
- Bunny CDN integration
- Video streaming endpoints
- CORS configuration

### Automation (`scripts/` folder)
- Railway auto-deploy script
- One-command deployment setup
- Environment variable automation

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub repository connected to Vercel
- Bunny CDN credentials

### Steps
1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: `Vite`
   - Root Directory: `./` (leave empty)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-url.up.railway.app
   ```

   💡 **Tip**: If environment variables are updated, re-deploy manually via "Deploy" → "Redeploy" in Vercel Dashboard to clear build cache.

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy

## Backend Deployment (Railway)

### 🚀 Quick Deploy (Recommended)

**One-command deployment:**

```bash
npm run deploy:railway
```

**Prerequisites:**
```bash
# Install Railway CLI (one-time)
npm install -g @railway/cli

# Login to Railway (one-time)
railway login
```

The script automatically:
- ✅ Links your `server/` folder to Railway
- ✅ Sets all environment variables
- ✅ Deploys your backend
- ✅ Shows your live URL

📋 **See `RAILWAY_SETUP.md` for detailed setup instructions.**

### 📋 Manual Deployment (Alternative)

#### Prerequisites
- Railway account
- Bunny CDN credentials

#### Steps
1. **Connect Repository**
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project"
   - Deploy from GitHub repo

2. **Configure Service**
   - Select the `server` directory as root
   - Railway will auto-detect Node.js

3. **Environment Variables**
   Add these in Railway dashboard:
   ```
   PORT=13500
   NODE_ENV=production
   BUNNY_LIBRARY_ID=506159
   BUNNY_API_KEY=7f0a1d07-a8a4-4e07-af7ed42722ee-bfbd-4896
   BUNNY_DELIVERY_DOMAIN=vz-a01fffb9-e7a.b-cdn.net
   ```

   📝 **Note**: Railway automatically injects `PORT`. Do not hardcode it in the backend; use `process.env.PORT || 13500`.

4. **Deploy**
   - Railway will automatically deploy
   - Note the generated URL (e.g., `https://ishanime-backend-production.up.railway.app`)

## Update Configuration

After deploying:

1. **Update Frontend Config**
   - Update `src/config.ts` with your actual backend URL
   - Update Vercel environment variables

2. **Update Backend CORS**
   - Update `server/index.js` CORS origins with your Vercel URLs
   
   Example CORS configuration:
   ```javascript
   // server/index.js
   import cors from 'cors';
   app.use(cors({
     origin: [
       'https://ishanime.vercel.app',
       'https://ishanime-git-main-ishmaelishrealm.vercel.app'
     ],
     methods: ['GET', 'POST'],
     credentials: true
   }));
   ```
   
   💡 **For local testing**, you can temporarily add `'http://localhost:5173'` to the origin array.

3. **Redeploy**
   - Push changes to GitHub
   - Both platforms will auto-deploy

## Bunny CDN Integration

The backend uses Bunny CDN for secure video delivery. Ensure your Bunny credentials match your Bunny Stream account.

### API Endpoints
The backend provides these endpoints for video streaming:
- `GET /api/shows` → Lists all anime shows grouped from Bunny videos
- `GET /api/shows/:slug` → Retrieves a specific show with episodes
- `GET /api/episodes/:id` → Gets individual episode details
- `POST /api/webhook/bunny` → Webhook for Bunny CDN notifications

### Video Naming Convention
Name your videos in Bunny CDN using this format for automatic grouping:
- `Show Name - Episode 01`
- `Show Name - Episode 02`
- `Another Show - Episode 01`

The server will automatically parse these titles and group episodes into shows.

## Local Development

```bash
# Frontend
npm run dev

# Backend
npm run server:dev

# Deploy to Railway (one command)
npm run deploy:railway
```

## Environment Variables Reference

### Frontend (Vercel)
- `VITE_API_URL`: Backend API URL

### Backend (Railway)
- `PORT`: Server port (auto-set by Railway)
- `NODE_ENV`: Environment (production)
- `BUNNY_LIBRARY_ID`: Bunny CDN Library ID
- `BUNNY_API_KEY`: Bunny CDN API Key
- `BUNNY_DELIVERY_DOMAIN`: Bunny CDN delivery domain

## Troubleshooting

### Frontend Issues
- Check Vercel build logs
- Verify environment variables
- Ensure API URL is correct

### Backend Issues
- Check Railway logs
- Verify Bunny credentials
- Test API endpoints directly

### CORS Issues
- Update CORS origins in server
- Check browser console for errors
- Verify domain URLs match exactly
