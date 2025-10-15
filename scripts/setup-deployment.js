/**
 * 🛠️ Ishanime Deployment Setup Script
 * Sets up all necessary tools and configurations for deployment
 * Run with: npm run setup:deploy
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

// Check if a command exists
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: "pipe" });
    return true;
  } catch {
    try {
      execSync(`${command} --version`, { stdio: "pipe" });
      return true;
    } catch {
      return false;
    }
  }
}

// Install Railway CLI
function installRailwayCLI() {
  if (commandExists("railway")) {
    colorLog("✅ Railway CLI already installed", 'green');
    return true;
  }

  colorLog("📦 Installing Railway CLI...", 'yellow');
  if (run("npm install -g @railway/cli")) {
    colorLog("✅ Railway CLI installed successfully", 'green');
    return true;
  } else {
    colorLog("❌ Failed to install Railway CLI", 'red');
    return false;
  }
}

// Install Vercel CLI
function installVercelCLI() {
  if (commandExists("vercel")) {
    colorLog("✅ Vercel CLI already installed", 'green');
    return true;
  }

  colorLog("📦 Installing Vercel CLI...", 'yellow');
  if (run("npm install -g vercel")) {
    colorLog("✅ Vercel CLI installed successfully", 'green');
    return true;
  } else {
    colorLog("❌ Failed to install Vercel CLI", 'red');
    return false;
  }
}

// Check project structure
function checkProjectStructure() {
  colorLog("\n📁 Checking project structure...", 'bright');
  
  const requiredPaths = [
    'src',
    'server',
    'scripts',
    'package.json',
    'vercel.json',
    'railway.json'
  ];

  let allPathsExist = true;
  
  requiredPaths.forEach(path => {
    if (fs.existsSync(path)) {
      colorLog(`✅ ${path}`, 'green');
    } else {
      colorLog(`❌ ${path} missing`, 'red');
      allPathsExist = false;
    }
  });

  return allPathsExist;
}

// Check dependencies
function checkDependencies() {
  colorLog("\n📦 Checking dependencies...", 'bright');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const serverPackageJson = JSON.parse(fs.readFileSync('server/package.json', 'utf8'));
    
    colorLog("✅ Frontend dependencies configured", 'green');
    colorLog("✅ Backend dependencies configured", 'green');
    
    return true;
  } catch (error) {
    colorLog(`❌ Error reading package.json files: ${error.message}`, 'red');
    return false;
  }
}

// Create deployment environment file
function createDeploymentEnv() {
  colorLog("\n⚙️ Creating deployment environment template...", 'bright');
  
  const envTemplate = `# Ishanime Deployment Environment Variables
# Copy this file to .env.local and fill in your values

# Frontend (Vercel)
VITE_API_URL=https://your-backend-url.up.railway.app

# Backend (Railway) - These are auto-configured by deployment scripts
PORT=13500
NODE_ENV=production
BUNNY_LIBRARY_ID=506159
BUNNY_API_KEY=7f0a1d07-a8a4-4e07-af7ed42722ee-bfbd-4896
BUNNY_DELIVERY_DOMAIN=vz-a01fffb9-e7a.b-cdn.net

# Deployment URLs (auto-populated after deployment)
# FRONTEND_URL=https://your-app.vercel.app
# BACKEND_URL=https://your-backend.up.railway.app
`;

  try {
    fs.writeFileSync('.env.deployment', envTemplate);
    colorLog("✅ Created .env.deployment template", 'green');
    return true;
  } catch (error) {
    colorLog(`❌ Failed to create deployment environment file: ${error.message}`, 'red');
    return false;
  }
}

// Main setup function
async function main() {
  colorLog("🛠️ Ishanime Deployment Setup", 'bright');
  colorLog("============================", 'bright');
  
  let setupSuccess = true;

  // Check project structure
  if (!checkProjectStructure()) {
    colorLog("\n❌ Project structure issues detected", 'red');
    setupSuccess = false;
  }

  // Check dependencies
  if (!checkDependencies()) {
    colorLog("\n❌ Dependency issues detected", 'red');
    setupSuccess = false;
  }

  // Install CLI tools
  colorLog("\n🔧 Installing deployment tools...", 'bright');
  
  const railwayInstalled = installRailwayCLI();
  const vercelInstalled = installVercelCLI();
  
  if (!railwayInstalled || !vercelInstalled) {
    setupSuccess = false;
  }

  // Create deployment environment file
  createDeploymentEnv();

  // Final status
  if (setupSuccess) {
    colorLog("\n✅ Deployment setup completed successfully!", 'green');
    colorLog("\n📋 Next steps:", 'yellow');
    colorLog("1. Run: railway login", 'cyan');
    colorLog("2. Run: vercel login", 'cyan');
    colorLog("3. Run: npm run deploy to deploy everything", 'cyan');
    colorLog("4. Or run individual deployments:", 'cyan');
    colorLog("   - npm run deploy:backend (Railway)", 'cyan');
    colorLog("   - npm run deploy:frontend (Vercel)", 'cyan');
  } else {
    colorLog("\n❌ Deployment setup completed with issues", 'red');
    colorLog("Please resolve the issues above before deploying", 'yellow');
  }

  colorLog("\n📚 Documentation:", 'yellow');
  colorLog("- DEPLOYMENT.md - Complete deployment guide", 'cyan');
  colorLog("- RAILWAY_SETUP.md - Railway specific setup", 'cyan');
}

// Run the setup
main().catch(console.error);


