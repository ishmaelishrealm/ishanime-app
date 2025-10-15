# 🚀 Railway Auto-Deploy Setup

This guide sets up automatic deployment to Railway with a single command: `npm run deploy:railway`

## Quick Start

### 1. Install Railway CLI (One-time setup)
```bash
npm install -g @railway/cli
```

### 2. Login to Railway (One-time setup)
```bash
railway login
```

### 3. Deploy with one command
```bash
npm run deploy:railway
```

## What the Script Does

The `deploy:railway` script automatically:

✅ **Checks Railway CLI** - Verifies installation  
✅ **Links Project** - Connects your `server/` folder to Railway  
✅ **Sets Environment Variables** - Configures all Bunny CDN credentials  
✅ **Deploys** - Pushes your backend to Railway  
✅ **Provides URL** - Shows your live deployment URL  

## Environment Variables (Auto-Configured)

The script automatically sets these variables:

```env
PORT=13500
NODE_ENV=production
BUNNY_LIBRARY_ID=506159
BUNNY_API_KEY=7f0a1d07-a8a4-4e07-af7ed42722ee-bfbd-4896
BUNNY_DELIVERY_DOMAIN=vz-a01fffb9-e7a.b-cdn.net
```

## Project Structure

```
📁 Ishanime/
├── 📁 server/           # Backend (auto-deployed)
│   ├── index.js
│   ├── package.json
│   └── ...
├── 📁 src/              # Frontend (deploy to Vercel)
├── 📁 scripts/
│   └── deploy-railway.js # Auto-deploy script
└── package.json         # Contains deploy:railway command
```

## Troubleshooting

### Railway CLI Not Found
```bash
npm install -g @railway/cli
```

### Not Logged In
```bash
railway login
```

### Permission Issues
Make sure you have access to the Railway project or create a new one:
```bash
railway create
```

## Manual Steps (Alternative)

If you prefer manual setup:

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Create new project
3. Connect GitHub repository
4. Select `server` folder as root
5. Add environment variables
6. Deploy

## Next Steps

After Railway deployment:

1. **Get your backend URL** (e.g., `https://ishanime-backend-production.up.railway.app`)
2. **Update frontend config** in `src/config.ts`
3. **Deploy frontend** to Vercel
4. **Update CORS** in backend with Vercel URL

## Commands Reference

```bash
# Deploy backend to Railway
npm run deploy:railway

# Run backend locally
npm run server:dev

# Run frontend locally
npm run dev

# Build frontend
npm run build
```
