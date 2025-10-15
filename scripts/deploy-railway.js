/**
 * 🚀 Ishanime Railway Auto-Deploy Script
 * Run with: npm run deploy:railway
 * This script:
 *  - Checks if Railway CLI is installed
 *  - Logs into your account if needed
 *  - Links the backend folder
 *  - Pushes all environment variables
 *  - Deploys automatically
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const backendDir = path.join(process.cwd(), "server");

const envVars = {
  PORT: "13500",
  NODE_ENV: "production",
  BUNNY_LIBRARY_ID: "506159",
  BUNNY_API_KEY: "7f0a1d07-a8a4-4e07-af7ed42722ee-bfbd-4896",
  BUNNY_DELIVERY_DOMAIN: "vz-a01fffb9-e7a.b-cdn.net",
};

// Run command helper
function run(cmd, options = {}) {
  console.log(`\n🛠️  Running: ${cmd}`);
  execSync(cmd, { stdio: "inherit", ...options });
}

try {
  console.log("🔍 Checking for Railway CLI...");
  run("railway --version");

  console.log("📦 Linking Railway project...");
  run("cd server && railway link");
  
  console.log("📦 Ensuring service exists...");
  run("cd server && railway add --service ishanime-backend");

  console.log("⚙️ Setting environment variables...");
  const setCommands = Object.entries(envVars).map(([key, value]) => `--set "${key}=${value}"`).join(' ');
  run(`cd server && railway variables ${setCommands}`);

  console.log("🚀 Deploying to Railway...");
  run("cd server && railway up");

  console.log("\n✅ Deployment complete!");
  console.log("🌐 Visit your project on Railway: https://railway.app/dashboard");
} catch (err) {
  console.error("❌ Deployment failed:", err.message);
  console.log("💡 Make sure you're logged in with `railway login` first.");
}
