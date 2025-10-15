# 🚀 Enhanced Ishanime Auto-Deploy Script for Windows PowerShell
# This script deploys both frontend (Vercel) and backend (Railway)

param(
    [switch]$BackendOnly,
    [switch]$FrontendOnly,
    [switch]$FullDeploy = $true
)

Write-Host "🚀 Ishanime Enhanced Auto-Deploy" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Function to run commands with error handling
function Invoke-Command {
    param(
        [string]$Command,
        [string]$Description
    )
    
    Write-Host "🛠️  $Description" -ForegroundColor Yellow
    Write-Host "Running: $Command" -ForegroundColor Cyan
    
    try {
        Invoke-Expression $Command
        Write-Host "✅ $Description completed" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ $Description failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to check if a command exists
function Test-Command {
    param([string]$Command)
    
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

# Function to deploy backend
function Deploy-Backend {
    Write-Host "`n🚀 Starting Backend Deployment to Railway..." -ForegroundColor Green
    
    # Check if Railway CLI is installed
    if (-not (Test-Command "railway")) {
        Write-Host "📦 Installing Railway CLI..." -ForegroundColor Yellow
        if (-not (Invoke-Command "npm install -g @railway/cli" "Installing Railway CLI")) {
            Write-Host "❌ Failed to install Railway CLI" -ForegroundColor Red
            return $false
        }
    }
    
    # Check if logged in to Railway
    try {
        railway whoami | Out-Null
        Write-Host "✅ Railway CLI authenticated" -ForegroundColor Green
    } catch {
        Write-Host "🔐 Please log in to Railway..." -ForegroundColor Yellow
        if (-not (Invoke-Command "railway login" "Logging into Railway")) {
            return $false
        }
    }
    
    # Navigate to server directory
    $originalLocation = Get-Location
    Set-Location "server"
    
    try {
        # Link Railway project
        Invoke-Command "railway link" "Linking Railway project"
        
        # Set environment variables
        $envVars = @{
            "PORT" = "13500"
            "NODE_ENV" = "production"
            "BUNNY_LIBRARY_ID" = "506159"
            "BUNNY_API_KEY" = "7f0a1d07-a8a4-4e07-af7ed42722ee-bfbd-4896"
            "BUNNY_DELIVERY_DOMAIN" = "vz-a01fffb9-e7a.b-cdn.net"
        }
        
        Write-Host "⚙️ Setting environment variables..." -ForegroundColor Yellow
        $setCommands = ""
        foreach ($key in $envVars.Keys) {
            $value = $envVars[$key]
            $setCommands += "--set `"$key=$value`" "
        }
        Invoke-Command "railway variables $setCommands" "Setting environment variables"
        
        # Deploy to Railway
        if (Invoke-Command "railway up" "Deploying to Railway") {
            Write-Host "✅ Backend deployment successful!" -ForegroundColor Green
            
            # Get deployment URL
            try {
                $backendUrl = railway domain
                Write-Host "🌐 Backend URL: $backendUrl" -ForegroundColor Cyan
                return $backendUrl
            } catch {
                Write-Host "⚠️  Could not get backend URL automatically" -ForegroundColor Yellow
                return "https://your-backend-url.up.railway.app"
            }
        }
    } finally {
        # Return to original directory
        Set-Location $originalLocation
    }
    
    return $false
}

# Function to deploy frontend
function Deploy-Frontend {
    param([string]$BackendUrl)
    
    Write-Host "`n🎨 Starting Frontend Deployment to Vercel..." -ForegroundColor Green
    
    # Check if Vercel CLI is installed
    if (-not (Test-Command "vercel")) {
        Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
        if (-not (Invoke-Command "npm install -g vercel" "Installing Vercel CLI")) {
            Write-Host "❌ Failed to install Vercel CLI" -ForegroundColor Red
            return $false
        }
    }
    
    # Check if logged in to Vercel
    try {
        vercel whoami | Out-Null
        Write-Host "✅ Vercel CLI authenticated" -ForegroundColor Green
    } catch {
        Write-Host "🔐 Please log in to Vercel..." -ForegroundColor Yellow
        if (-not (Invoke-Command "vercel login" "Logging into Vercel")) {
            return $false
        }
    }
    
    # Build the project
    if (-not (Invoke-Command "npm run build" "Building frontend project")) {
        Write-Host "❌ Build failed" -ForegroundColor Red
        return $false
    }
    
    # Set environment variables if backend URL provided
    if ($BackendUrl) {
        Write-Host "⚙️ Setting frontend environment variables..." -ForegroundColor Yellow
        Invoke-Command "vercel env add VITE_API_URL production `"$BackendUrl`"" "Setting VITE_API_URL"
    }
    
    # Deploy to Vercel
    if (Invoke-Command "vercel --prod" "Deploying to Vercel") {
        Write-Host "✅ Frontend deployment successful!" -ForegroundColor Green
        
        # Get deployment URL
        try {
            $vercelOutput = vercel ls
            $frontendUrl = ($vercelOutput | Where-Object { $_ -match "production.*https://" } | ForEach-Object { ($_ -split "https://")[1] -split " " | Select-Object -First 1 })[0]
            if ($frontendUrl) {
                Write-Host "🌐 Frontend URL: https://$frontendUrl" -ForegroundColor Cyan
                return "https://$frontendUrl"
            }
        } catch {
            Write-Host "⚠️  Could not get frontend URL automatically" -ForegroundColor Yellow
        }
        
        return $true
    }
    
    return $false
}

# Main deployment logic
try {
    $backendUrl = $null
    $frontendUrl = $null
    
    if ($FullDeploy -or $BackendOnly) {
        $backendUrl = Deploy-Backend
        if (-not $backendUrl) {
            Write-Host "❌ Backend deployment failed. Stopping." -ForegroundColor Red
            exit 1
        }
    }
    
    if ($FullDeploy -or $FrontendOnly) {
        $frontendSuccess = Deploy-Frontend -BackendUrl $backendUrl
        if (-not $frontendSuccess) {
            Write-Host "❌ Frontend deployment failed." -ForegroundColor Red
            exit 1
        }
    }
    
    Write-Host "`n✅ Deployment completed successfully!" -ForegroundColor Green
    Write-Host "🎉 Your Ishanime app is now live!" -ForegroundColor Green
    
    Write-Host "`n📋 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Test your deployed application" -ForegroundColor Cyan
    Write-Host "2. Update any hardcoded URLs in your code" -ForegroundColor Cyan
    Write-Host "3. Set up monitoring and logging" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Check the troubleshooting section in AUTO_DEPLOY_GUIDE.md" -ForegroundColor Yellow
    exit 1
}
