# Railway Deployment Guide

## Step 1: Deploy Backend to Railway

1. **Go to Railway.app** and sign in with your GitHub account
2. **Click "New Project"** → **"Deploy from GitHub repo"**
3. **Select your repository**: `ishmaelishrealm/ishanime-app`
4. **Configure the deployment**:
   - **Root Directory**: `server` (this tells Railway to deploy only the server folder)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. **Add Environment Variables** in Railway dashboard:
   ```
   PORT=13500
   NODE_ENV=production
   BUNNY_LIBRARY_ID=506159
   BUNNY_API_KEY=7f0a1d07-a8a4-4e07-af7ed42722ee-bfbd-4896
   BUNNY_DELIVERY_DOMAIN=vz-a01fffb9-e7a.b-cdn.net
   ```

6. **Deploy** - Railway will automatically build and deploy your backend

## Step 2: Deploy Frontend to Vercel

1. **Go to Vercel.com** and sign in with your GitHub account
2. **Click "New Project"** → **Import from GitHub**
3. **Select your repository**: `ishmaelishrealm/ishanime-app`
4. **Configure the deployment**:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (root of the project)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Add Environment Variables** in Vercel dashboard:
   ```
   VITE_API_URL=https://your-railway-backend-url.up.railway.app
   ```

6. **Deploy** - Vercel will automatically build and deploy your frontend

## Step 3: Update Backend CORS

After getting your Vercel URL, update the CORS configuration in your backend to allow your Vercel domain.

## Expected URLs:
- **Backend**: `https://ishanime-backend-production.up.railway.app`
- **Frontend**: `https://ishanime-app.vercel.app` (or similar)
