#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Ishanime Full Stack Deployment Script');
console.log('=====================================\n');

// Check if we're in the right directory
if (!fs.existsSync('server/package.json')) {
  console.error('❌ Error: server/package.json not found. Please run this script from the project root.');
  process.exit(1);
}

// Step 1: Commit and push to GitHub
console.log('📝 Step 1: Committing and pushing to GitHub...');
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "Deploy: Update configuration for Railway and Vercel deployment"', { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  console.log('✅ Successfully pushed to GitHub\n');
} catch (error) {
  console.error('❌ Error pushing to GitHub:', error.message);
  process.exit(1);
}

// Step 2: Display deployment instructions
console.log('🌐 Step 2: Deployment Instructions');
console.log('==================================\n');

console.log('🔧 RAILWAY DEPLOYMENT (Backend):');
console.log('1. Go to https://railway.app');
console.log('2. Sign in with GitHub');
console.log('3. Click "New Project" → "Deploy from GitHub repo"');
console.log('4. Select: ishmaelishrealm/ishanime-app');
console.log('5. Configure:');
console.log('   - Root Directory: server');
console.log('   - Build Command: npm install');
console.log('   - Start Command: npm start');
console.log('6. Add Environment Variables:');
console.log('   - PORT=13500');
console.log('   - NODE_ENV=production');
console.log('   - BUNNY_LIBRARY_ID=506159');
console.log('   - BUNNY_API_KEY=7f0a1d07-a8a4-4e07-af7ed42722ee-bfbd-4896');
console.log('   - BUNNY_DELIVERY_DOMAIN=vz-a01fffb9-e7a.b-cdn.net');
console.log('7. Deploy!\n');

console.log('🎨 VERCEL DEPLOYMENT (Frontend):');
console.log('1. Go to https://vercel.com');
console.log('2. Sign in with GitHub');
console.log('3. Click "New Project" → Import from GitHub');
console.log('4. Select: ishmaelishrealm/ishanime-app');
console.log('5. Configure:');
console.log('   - Framework Preset: Vite');
console.log('   - Root Directory: . (root)');
console.log('   - Build Command: npm run build');
console.log('   - Output Directory: dist');
console.log('6. Add Environment Variables:');
console.log('   - VITE_API_URL=https://your-railway-backend-url.up.railway.app');
console.log('7. Deploy!\n');

console.log('🔗 After deployment:');
console.log('1. Copy your Railway backend URL');
console.log('2. Update Vercel environment variable VITE_API_URL with the Railway URL');
console.log('3. Update the CORS configuration in server/index.js with your Vercel URL');
console.log('4. Redeploy both services\n');

console.log('✨ Your Ishanime app will be live!');
console.log('Backend: https://your-app.up.railway.app');
console.log('Frontend: https://your-app.vercel.app');
