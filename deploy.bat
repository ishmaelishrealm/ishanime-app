@echo off
echo 🚀 Ishanime Auto-Deploy for Windows
echo ====================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not available. Please check your Node.js installation.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are available

REM Run the deployment
echo 🚀 Starting deployment...
npm run deploy

if %errorlevel% equ 0 (
    echo.
    echo ✅ Deployment completed successfully!
    echo 🎉 Your Ishanime app is now live!
) else (
    echo.
    echo ❌ Deployment failed. Check the error messages above.
    echo 💡 Try running: npm run setup:deploy
)

echo.
echo Press any key to exit...
pause >nul


