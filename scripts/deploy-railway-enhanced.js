/**
 * 🚀 Enhanced Ishanime Railway Auto-Deploy Script
 * Run with: npm run deploy:backend
 * Enhanced version with better error handling and status reporting
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

// Environment variables for Railway
const envVars = {
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

// Check if Railway CLI is installed
function checkRailwayCLI() {
  try {
    execSync("railway --version", { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

// Get Railway project URL
function getRailwayUrl() {
  try {
    const output = execSync("railway domain", { encoding: 'utf8', stdio: "pipe" });
    return output.trim();
  } catch {
    return null;
  }
}

// Check Railway project status
function checkRailwayStatus() {
  try {
    const output = execSync("railway status", { encoding: 'utf8', stdio: "pipe" });
    colorLog("📊 Railway Project Status:", 'yellow');
    colorLog(output, 'cyan');
    return true;
  } catch {
    colorLog("⚠️  Could not get Railway status", 'yellow');
    return false;
  }
}

// Deploy backend to Railway
async function deployBackend() {
  colorLog("\n🚀 Starting Backend Deployment to Railway...", 'bright');
  
  const backendDir = path.join(process.cwd(), "server");
  
  // Check if server directory exists
  if (!fs.existsSync(backendDir)) {
    colorLog("❌ Server directory not found", 'red');
    return false;
  }

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

  try {
    // Navigate to server directory
    process.chdir(backendDir);
    
    // Check if project is linked
    try {
      const statusOutput = execSync("railway status", { encoding: 'utf8', stdio: "pipe" });
      colorLog("✅ Railway project is linked", 'green');
      
      // Check if a service is selected
      if (statusOutput.includes("Service: None")) {
        colorLog("📦 No service selected, creating service...", 'yellow');
        if (!run("railway add --service ishanime-backend")) {
          colorLog("❌ Failed to create service", 'red');
          return false;
        }
      }
    } catch {
      colorLog("📦 Linking Railway project...", 'yellow');
      if (!run("railway link")) {
        colorLog("❌ Failed to link Railway project", 'red');
        return false;
      }
      
      // Try to create service after linking
      colorLog("📦 Creating service...", 'yellow');
      run("railway add --service ishanime-backend");
    }

    // Set environment variables
    colorLog("⚙️ Setting environment variables...", 'yellow');
    let envVarsSet = 0;
    const setCommands = Object.entries(envVars).map(([key, value]) => `--set "${key}=${value}"`).join(' ');
    if (run(`railway variables ${setCommands}`)) {
      envVarsSet = Object.keys(envVars).length;
      colorLog(`✅ Set ${envVarsSet} environment variables`, 'green');
    }

    if (envVarsSet === 0) {
      colorLog("❌ Failed to set any environment variables", 'red');
      return false;
    }

    colorLog(`✅ Successfully set ${envVarsSet}/${Object.keys(envVars).length} environment variables`, 'green');

    // Deploy to Railway
    colorLog("🚀 Deploying to Railway...", 'yellow');
    if (run("railway up")) {
      colorLog("✅ Backend deployment successful!", 'green');
      
      // Get the deployment URL
      const backendUrl = getRailwayUrl();
      if (backendUrl) {
        colorLog(`🌐 Backend URL: ${backendUrl}`, 'cyan');
        
        // Test the deployment
        colorLog("🧪 Testing deployment...", 'yellow');
        try {
          const testResponse = execSync(`curl -s -o /dev/null -w "%{http_code}" ${backendUrl}/api/shows`, { 
            encoding: 'utf8', 
            stdio: "pipe",
            timeout: 10000
          });
          
          if (testResponse.trim() === '200') {
            colorLog("✅ Backend is responding correctly", 'green');
          } else {
            colorLog(`⚠️  Backend responded with status: ${testResponse.trim()}`, 'yellow');
          }
        } catch {
          colorLog("⚠️  Could not test backend endpoint (curl not available or endpoint not responding)", 'yellow');
        }
        
        return backendUrl;
      } else {
        colorLog("⚠️  Could not get backend URL automatically", 'yellow');
        return "https://your-backend-url.up.railway.app";
      }
    } else {
      colorLog("❌ Railway deployment failed", 'red');
      return false;
    }
  } catch (error) {
    colorLog(`❌ Backend deployment failed: ${error.message}`, 'red');
    return false;
  } finally {
    // Return to root directory
    process.chdir(path.join(process.cwd(), ".."));
  }
}

// Main deployment function
async function main() {
  colorLog("🚀 Enhanced Ishanime Railway Auto-Deploy", 'bright');
  colorLog("=======================================", 'bright');
  
  try {
    const backendUrl = await deployBackend();
    if (backendUrl) {
      colorLog("\n✅ Backend deployment successful!", 'green');
      colorLog("🎉 Your backend is now live!", 'bright');
      
      // Show project status
      process.chdir(path.join(process.cwd(), "server"));
      checkRailwayStatus();
      process.chdir(path.join(process.cwd(), ".."));
      
      colorLog("\n📋 Next steps:", 'yellow');
      colorLog(`1. Update frontend config with backend URL: ${backendUrl}`, 'cyan');
      colorLog("2. Deploy frontend to Vercel", 'cyan');
      colorLog("3. Update CORS settings if needed", 'cyan');
    } else {
      colorLog("\n❌ Backend deployment failed", 'red');
      colorLog("\n🔧 Troubleshooting tips:", 'yellow');
      colorLog("1. Check your Railway account and project permissions", 'cyan');
      colorLog("2. Verify your Bunny CDN credentials", 'cyan');
      colorLog("3. Check Railway logs for detailed error information", 'cyan');
    }
  } catch (error) {
    colorLog(`❌ Deployment failed: ${error.message}`, 'red');
  }
}

// Run the deployment
main().catch(console.error);

