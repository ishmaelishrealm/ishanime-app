# Ishanime Railway Auto-Deployment Script
# This script will help you automatically deploy your backend to Railway

Write-Host "🚀 Ishanime Railway Auto-Deployment" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

# Check if Railway CLI is installed
try {
    $railwayVersion = railway --version
    Write-Host "✅ Railway CLI found: $railwayVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI not found. Installing..." -ForegroundColor Red
    Write-Host "Please install Railway CLI from: https://docs.railway.app/develop/cli" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🔐 Step 1: Login to Railway" -ForegroundColor Cyan
Write-Host "Please run this command in your terminal:" -ForegroundColor Yellow
Write-Host "railway login" -ForegroundColor White
Write-Host ""
Write-Host "This will open your browser to authenticate with Railway." -ForegroundColor Gray
Write-Host ""

# Wait for user to login
$loginConfirm = Read-Host "Have you completed the Railway login? (y/n)"
if ($loginConfirm -ne "y" -and $loginConfirm -ne "Y") {
    Write-Host "Please complete the login first, then run this script again." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "📁 Step 2: Navigate to server directory" -ForegroundColor Cyan
Set-Location server

Write-Host ""
Write-Host "🚀 Step 3: Initialize Railway project" -ForegroundColor Cyan
Write-Host "Creating new Railway project..." -ForegroundColor Gray

try {
    # Initialize Railway project
    railway init --name "ishanime-backend"
    Write-Host "✅ Railway project initialized" -ForegroundColor Green
} catch {
    Write-Host "❌ Error initializing Railway project" -ForegroundColor Red
    Write-Host "You may need to run 'railway login' first" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🔧 Step 4: Set environment variables" -ForegroundColor Cyan
Write-Host "Setting up environment variables..." -ForegroundColor Gray

# Set environment variables
railway variables set PORT=13500
railway variables set NODE_ENV=production
railway variables set BUNNY_LIBRARY_ID=506159
railway variables set BUNNY_API_KEY=7f0a1d07-a8a4-4e07-af7ed42722ee-bfbd-4896
railway variables set BUNNY_DELIVERY_DOMAIN=vz-a01fffb9-e7a.b-cdn.net

Write-Host "✅ Environment variables set" -ForegroundColor Green

Write-Host ""
Write-Host "🚀 Step 5: Deploy to Railway" -ForegroundColor Cyan
Write-Host "Deploying your backend..." -ForegroundColor Gray

try {
    railway up
    Write-Host "✅ Deployment initiated!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error during deployment" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔗 Step 6: Get deployment URL" -ForegroundColor Cyan
Write-Host "Getting your Railway deployment URL..." -ForegroundColor Gray

try {
    $railwayUrl = railway domain
    Write-Host "✅ Your Railway backend URL: $railwayUrl" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Copy this URL: $railwayUrl" -ForegroundColor White
    Write-Host "2. Go to Vercel and deploy your frontend" -ForegroundColor White
    Write-Host "3. Set VITE_API_URL environment variable in Vercel to: $railwayUrl" -ForegroundColor White
    Write-Host "4. Update CORS in your backend to allow your Vercel domain" -ForegroundColor White
    Write-Host ""
    Write-Host "🎉 Your backend is now live on Railway!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not get Railway URL automatically" -ForegroundColor Yellow
    Write-Host "Check your Railway dashboard for the deployment URL" -ForegroundColor Gray
}

# Go back to project root
Set-Location ..
