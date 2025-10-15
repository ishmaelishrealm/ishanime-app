/**
 * 🚀 Ishanime Complete Auto-Deploy Script
 * Deploys both frontend (Vercel) and backend (Railway) with one command
 * Run with: npm run deploy:full
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorLog(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Environment variables for Railway
const railwayEnvVars = {
  PORT: "13500",
  NODE_ENV: "production",
  BUNNY_LIBRARY_ID: "506159",
  BUNNY_API_KEY: "7f0a1d07-a8a4-4e07-af7ed42722ee-bfbd-4896",
  BUNNY_DELIVERY_DOMAIN: "vz-a01fffb9-e7a.b-cdn.net",
};

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

// Helper function to prompt user
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
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

// Check if Railway CLI is installed
function checkRailwayCLI() {
  try {
    execSync("railway --version", { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

// Deploy backend to Railway
async function deployBackend() {
  colorLog("\n🚀 Starting Backend Deployment to Railway...", 'bright');
  
  // Check Railway CLI
  if (!checkRailwayCLI()) {
    colorLog("📦 Installing Railway CLI...", 'yellow');
    if (!run("npm install -g @railway/cli")) {
      colorLog("❌ Failed to install Railway CLI", 'red');
      return false;
    }
  }

  // Check if logged in to Railway
  try {
    execSync("railway whoami", { stdio: "pipe" });
    colorLog("✅ Railway CLI authenticated", 'green');
  } catch {
    colorLog("🔐 Please log in to Railway...", 'yellow');
    if (!run("railway login")) {
      colorLog("❌ Failed to login to Railway", 'red');
      return false;
    }
  }

  // Deploy backend
  const backendDir = path.join(process.cwd(), "server");
  
  try {
    // Navigate to server directory and link project
    process.chdir(backendDir);
    
    colorLog("📦 Linking Railway project...", 'yellow');
    run("railway link");
    
    colorLog("📦 Ensuring service exists...", 'yellow');
    run("railway add --service ishanime-backend");

    colorLog("⚙️ Setting environment variables...", 'yellow');
    const setCommands = Object.entries(railwayEnvVars).map(([key, value]) => `--set "${key}=${value}"`).join(' ');
    run(`railway variables ${setCommands}`);

    colorLog("🚀 Deploying to Railway...", 'yellow');
    if (run("railway up")) {
      colorLog("✅ Backend deployment successful!", 'green');
      
      // Get the deployment URL
      try {
        const output = execSync("railway domain", { encoding: 'utf8', stdio: "pipe" });
        const backendUrl = output.trim();
        colorLog(`🌐 Backend URL: ${backendUrl}`, 'cyan');
        return backendUrl;
      } catch {
        colorLog("⚠️  Could not get backend URL automatically", 'yellow');
        return "https://your-backend-url.up.railway.app";
      }
    }
  } catch (error) {
    colorLog(`❌ Backend deployment failed: ${error.message}`, 'red');
    return false;
  } finally {
    // Return to root directory
    process.chdir(path.join(process.cwd(), ".."));
  }
  
  return false;
}

// Deploy frontend to Vercel
async function deployFrontend(backendUrl) {
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

  // Set environment variable for frontend
  if (backendUrl) {
    colorLog("⚙️ Setting frontend environment variables...", 'yellow');
    run(`vercel env add VITE_API_URL production "${backendUrl}"`);
  }

  // Deploy frontend
  colorLog("🚀 Deploying to Vercel...", 'yellow');
  if (run("vercel --prod --yes")) {
    colorLog("✅ Frontend deployment successful!", 'green');
    return true;
  }
  
  return false;
}

// Update backend CORS with frontend URL
async function updateBackendCORS(frontendUrl) {
  colorLog("\n🔧 Updating Backend CORS Configuration...", 'bright');
  
  if (!frontendUrl) {
    colorLog("⚠️  No frontend URL provided, skipping CORS update", 'yellow');
    return;
  }

  const serverPath = path.join(process.cwd(), "server", "index.js");
  
  try {
    let content = fs.readFileSync(serverPath, 'utf8');
    
    // Update CORS origins with the new frontend URL
    const corsRegex = /origin:\s*process\.env\.NODE_ENV\s*===\s*'production'\s*\?\s*\[([^\]]+)\]/;
    const match = content.match(corsRegex);
    
    if (match) {
      // Extract existing origins and add new one
      const existingOrigins = match[1];
      const newOrigins = existingOrigins.includes(frontendUrl) 
        ? existingOrigins 
        : `${existingOrigins}, '${frontendUrl}'`;
      
      content = content.replace(corsRegex, `origin: process.env.NODE_ENV === 'production' 
    ? [${newOrigins}]`);
      
      fs.writeFileSync(serverPath, content);
      colorLog("✅ CORS configuration updated", 'green');
    } else {
      colorLog("⚠️  Could not find CORS configuration to update", 'yellow');
    }
  } catch (error) {
    colorLog(`❌ Failed to update CORS: ${error.message}`, 'red');
  }
}

// Main deployment function
async function main() {
  colorLog("🚀 Ishanime Complete Auto-Deploy", 'bright');
  colorLog("================================", 'bright');
  
  try {
    // Deploy backend first
    const backendUrl = await deployBackend();
    if (!backendUrl) {
      colorLog("❌ Backend deployment failed. Stopping.", 'red');
      return;
    }

    // Deploy frontend
    const frontendSuccess = await deployFrontend(backendUrl);
    if (!frontendSuccess) {
      colorLog("❌ Frontend deployment failed.", 'red');
      return;
    }

    // Get frontend URL
    colorLog("🔍 Getting frontend URL...", 'yellow');
    try {
      const output = execSync("vercel ls", { encoding: 'utf8', stdio: "pipe" });
      const lines = output.split('\n');
      const productionLine = lines.find(line => line.includes('production') && line.includes('https://'));
      const frontendUrl = productionLine ? productionLine.split('https://')[1].split(' ')[0] : null;
      
      if (frontendUrl) {
        colorLog(`🌐 Frontend URL: https://${frontendUrl}`, 'cyan');
        
        // Update backend CORS
        await updateBackendCORS(`https://${frontendUrl}`);
        
        // Redeploy backend with updated CORS
        colorLog("🔄 Redeploying backend with updated CORS...", 'yellow');
        process.chdir(path.join(process.cwd(), "server"));
        run("railway up");
        process.chdir(path.join(process.cwd(), ".."));
      }
    } catch {
      colorLog("⚠️  Could not get frontend URL automatically", 'yellow');
    }

    colorLog("\n✅ Complete deployment successful!", 'green');
    colorLog("🎉 Your Ishanime app is now live!", 'bright');
    colorLog("\n📋 Next steps:", 'yellow');
    colorLog("1. Test your deployed application", 'cyan');
    colorLog("2. Update any hardcoded URLs in your code", 'cyan');
    colorLog("3. Set up monitoring and logging", 'cyan');

  } catch (error) {
    colorLog(`❌ Deployment failed: ${error.message}`, 'red');
  } finally {
    rl.close();
  }
}

// Run the deployment
main().catch(console.error);

