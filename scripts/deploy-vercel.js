/**
 * 🎨 Ishanime Frontend Auto-Deploy Script for Vercel
 * Run with: npm run deploy:frontend
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function colorLog(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Helper function to run commands
function run(cmd, options = {}) {
  colorLog(`\n🛠️  Running: ${cmd}`, 'cyan');
  try {
    execSync(cmd, { stdio: "inherit", ...options });
    return true;
  } catch (error) {
    colorLog(`❌ Command failed: ${cmd}`, 'red');
    return false;
  }
}

// Check if Vercel CLI is installed
function checkVercelCLI() {
  try {
    execSync("vercel --version", { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

// Deploy frontend to Vercel
async function deployFrontend() {
  colorLog("\n🎨 Starting Frontend Deployment to Vercel...", 'bright');
  
  // Check Vercel CLI
  if (!checkVercelCLI()) {
    colorLog("📦 Installing Vercel CLI...", 'yellow');
    if (!run("npm install -g vercel")) {
      colorLog("❌ Failed to install Vercel CLI", 'red');
      return false;
    }
  }

  // Check if logged in to Vercel
  try {
    execSync("vercel whoami", { stdio: "pipe" });
    colorLog("✅ Vercel CLI authenticated", 'green');
  } catch {
    colorLog("🔐 Please log in to Vercel...", 'yellow');
    if (!run("vercel login")) {
      colorLog("❌ Failed to login to Vercel", 'red');
      return false;
    }
  }

  // Build the project first
  colorLog("🔨 Building frontend project...", 'yellow');
  if (!run("npm run build")) {
    colorLog("❌ Build failed", 'red');
    return false;
  }

  // Set environment variable for backend URL
  colorLog("⚙️ Setting frontend environment variables...", 'yellow');
  run("vercel env add VITE_API_URL production https://ishanime-backend-production.up.railway.app");

  // Deploy to Vercel
  colorLog("🚀 Deploying to Vercel...", 'yellow');
  if (run("vercel --prod --yes")) {
    colorLog("✅ Frontend deployment successful!", 'green');
    
    // Get the deployment URL
    try {
      const output = execSync("vercel ls", { encoding: 'utf8', stdio: "pipe" });
      const lines = output.split('\n');
      const productionLine = lines.find(line => line.includes('production') && line.includes('https://'));
      const frontendUrl = productionLine ? productionLine.split('https://')[1].split(' ')[0] : null;
      
      if (frontendUrl) {
        colorLog(`🌐 Frontend URL: https://${frontendUrl}`, 'cyan');
        return `https://${frontendUrl}`;
      }
    } catch {
      colorLog("⚠️  Could not get frontend URL automatically", 'yellow');
    }
    
    return true;
  }
  
  return false;
}

// Main deployment function
async function main() {
  colorLog("🎨 Ishanime Frontend Auto-Deploy", 'bright');
  colorLog("===============================", 'bright');
  
  try {
    const result = await deployFrontend();
    if (result) {
      colorLog("\n✅ Frontend deployment successful!", 'green');
      colorLog("🎉 Your frontend is now live!", 'bright');
    } else {
      colorLog("\n❌ Frontend deployment failed", 'red');
    }
  } catch (error) {
    colorLog(`❌ Deployment failed: ${error.message}`, 'red');
  }
}

// Run the deployment
main().catch(console.error);

