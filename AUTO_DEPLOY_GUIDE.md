# 🚀 Ishanime Auto-Deploy Guide

This guide provides complete automation for deploying both frontend and backend components of Ishanime with minimal manual intervention.

## 🎯 Quick Start

### One-Command Full Deployment
```bash
npm run deploy
```
This deploys both frontend (Vercel) and backend (Railway) automatically.

### Individual Deployments
```bash
# Deploy backend only (Railway)
npm run deploy:backend

# Deploy frontend only (Vercel)
npm run deploy:frontend

# Full deployment (both)
npm run deploy:full
```

## 🛠️ Initial Setup (One-time)

### 1. Install Deployment Tools
```bash
npm run setup:deploy
```
This installs Railway CLI and Vercel CLI globally.

### 2. Authenticate with Services
```bash
# Login to Railway
railway login

# Login to Vercel
vercel login
```

### 3. Deploy Everything
```bash
npm run deploy
```

## 📋 Available Commands

| Command | Description | What it does |
|---------|-------------|--------------|
| `npm run setup:deploy` | Setup deployment tools | Installs Railway & Vercel CLI |
| `npm run deploy` | Full deployment | Deploys frontend + backend |
| `npm run deploy:full` | Full deployment | Same as above |
| `npm run deploy:backend` | Backend only | Deploys to Railway |
| `npm run deploy:frontend` | Frontend only | Deploys to Vercel |
| `npm run deploy:railway` | Legacy backend deploy | Original Railway script |

## 🔧 What Each Script Does

### `deploy-full.js` - Complete Auto-Deploy
- ✅ Checks and installs Railway CLI
- ✅ Checks and installs Vercel CLI
- ✅ Authenticates with both services
- ✅ Deploys backend to Railway
- ✅ Sets all environment variables
- ✅ Deploys frontend to Vercel
- ✅ Updates CORS configuration
- ✅ Provides deployment URLs
- ✅ Tests deployment endpoints

### `deploy-railway-enhanced.js` - Enhanced Backend Deploy
- ✅ Better error handling
- ✅ Status reporting
- ✅ Environment variable validation
- ✅ Endpoint testing
- ✅ Detailed logging

### `deploy-vercel.js` - Frontend Deploy
- ✅ Builds project first
- ✅ Sets environment variables
- ✅ Deploys to Vercel production
- ✅ Provides deployment URL

### `setup-deployment.js` - Setup Assistant
- ✅ Checks project structure
- ✅ Validates dependencies
- ✅ Installs CLI tools
- ✅ Creates environment templates
- ✅ Provides setup instructions

## 🌐 Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │
│   (Vercel)      │◄──►│   (Railway)     │
│                 │    │                 │
│ - React App     │    │ - Express API   │
│ - Vite Build    │    │ - Bunny CDN     │
│ - Environment   │    │ - Environment   │
│   Variables     │    │   Variables     │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┘
                CORS Configured
```

## 🔑 Environment Variables

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend-url.up.railway.app
```

### Backend (Railway) - Auto-configured
```env
PORT=13500
NODE_ENV=production
BUNNY_LIBRARY_ID=506159
BUNNY_API_KEY=7f0a1d07-a8a4-4e07-af7ed42722ee-bfbd-4896
BUNNY_DELIVERY_DOMAIN=vz-a01fffb9-e7a.b-cdn.net
```

## 🚨 Troubleshooting

### Common Issues

#### Railway CLI Not Found
```bash
npm install -g @railway/cli
railway login
```

#### Vercel CLI Not Found
```bash
npm install -g vercel
vercel login
```

#### Authentication Issues
- Railway: `railway login`
- Vercel: `vercel login`

#### Build Failures
```bash
# Test build locally first
npm run build

# Check for missing dependencies
npm install
```

#### CORS Issues
The deployment scripts automatically update CORS configuration, but you can manually update `server/index.js`:

```javascript
const corsOptions = {
  origin: [
    'https://your-app.vercel.app',
    'https://your-app-git-main-yourname.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
```

### Deployment Logs
- Railway: Check Railway dashboard logs
- Vercel: Check Vercel dashboard logs
- Local: Check console output during deployment

## 🔄 Update Workflow

### After Code Changes
1. Push changes to GitHub
2. Run `npm run deploy` to deploy both services
3. Or run individual deployments as needed

### Environment Variable Updates
1. Update variables in deployment scripts
2. Run deployment to apply changes
3. Frontend variables are set during deployment
4. Backend variables are set during deployment

## 📊 Monitoring

### Health Checks
- Backend: `https://your-backend.up.railway.app/api/shows`
- Frontend: `https://your-app.vercel.app`

### Logs
- Railway: Dashboard → Project → Deployments → Logs
- Vercel: Dashboard → Project → Functions → Logs

## 🎯 Best Practices

1. **Test Locally First**: Always test builds locally before deploying
2. **Environment Variables**: Keep sensitive data in deployment scripts or platform dashboards
3. **Monitoring**: Check deployment logs regularly
4. **Backup**: Keep backup of working configurations
5. **Staging**: Consider using staging environments for testing

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Bunny CDN Documentation](https://docs.bunny.net/)
- [Original DEPLOYMENT.md](./DEPLOYMENT.md)
- [Railway Setup Guide](./RAILWAY_SETUP.md)

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review deployment logs
3. Verify environment variables
4. Test individual components
5. Check service status pages

The deployment scripts provide detailed error messages and suggestions for common issues.


