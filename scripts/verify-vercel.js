#!/usr/bin/env node
/**
 * verify-vercel.js
 * Enhanced version — verifies Vercel readiness and React entry points.
 * Usage: npm run verify:vercel [-- --fix]
 */

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

// Check for --fix flag
const args = process.argv.slice(2);
const fixMode = args.includes('--fix');

colorLog("\n🔍 Running Ishanime Vercel pre-deploy verification...\n", 'cyan');

// 🔸 Required top-level files
const rootFiles = [
  "package.json",
  "vite.config.ts", 
  "index.html",
  "vercel.json",
];

// 🔸 Required src-level files
const srcDir = path.join(process.cwd(), "src");
const srcFiles = [
  "main.tsx",
  "App.tsx",
];

let missing = [];

// Placeholder content templates
const templates = {
  "package.json": `{
  "name": "ishanime",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.1.1",
    "typescript": "^5.2.2",
    "vite": "^4.5.0"
  }
}`,
  "vite.config.ts": `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`,
  "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ishanime</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
  "vercel.json": `{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}`,
  "src/main.tsx": `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
  "src/App.tsx": `import React from 'react'

function App() {
  return (
    <div className="App">
      <h1>Ishanime</h1>
      <p>Welcome to Ishanime!</p>
    </div>
  )
}

export default App`
};

// Check root-level files
for (const file of rootFiles) {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    missing.push(file);
    if (fixMode) {
      try {
        fs.writeFileSync(filePath, templates[file], 'utf8');
        colorLog(`🔧 Created: ${file}`, 'yellow');
      } catch (error) {
        colorLog(`❌ Failed to create: ${file} - ${error.message}`, 'red');
      }
    } else {
      colorLog(`❌ Missing root file: ${file}`, 'red');
    }
  } else {
    colorLog(`✅ Found root file: ${file}`, 'green');
  }
}

// Check src folder
if (!fs.existsSync(srcDir)) {
  if (fixMode) {
    try {
      fs.mkdirSync(srcDir, { recursive: true });
      colorLog(`🔧 Created folder: src/`, 'yellow');
    } catch (error) {
      colorLog(`❌ Failed to create folder: src/ - ${error.message}`, 'red');
    }
  } else {
    colorLog(`❌ Missing folder: src/`, 'red');
    missing.push("src/");
  }
} else {
  colorLog(`✅ Found folder: src/`, 'green');
}

// Check src files (only if src folder exists)
if (fs.existsSync(srcDir)) {
  for (const file of srcFiles) {
    const filePath = path.join(srcDir, file);
    if (!fs.existsSync(filePath)) {
      if (fixMode) {
        try {
          fs.writeFileSync(filePath, templates[`src/${file}`], 'utf8');
          colorLog(`🔧 Created: src/${file}`, 'yellow');
        } catch (error) {
          colorLog(`❌ Failed to create: src/${file} - ${error.message}`, 'red');
        }
      } else {
        missing.push(`src/${file}`);
        colorLog(`❌ Missing source file: src/${file}`, 'red');
      }
    } else {
      colorLog(`✅ Found source file: src/${file}`, 'green');
    }
  }
}

// Final summary
if (missing.length > 0) {
  if (fixMode) {
    colorLog(`\n🔧 Fix mode completed. Created ${missing.length} missing file(s).`, 'yellow');
    colorLog("✨ Project structure should now be ready for Vercel deployment!\n", 'green');
  } else {
    colorLog(`\n🚨 ERROR: Missing critical files/folders required for Vercel deployment:`, 'red');
    missing.forEach(file => colorLog(`- ${file}`, 'red'));
    colorLog(`\n❗ Run 'npm run verify:vercel -- --fix' to auto-create missing files.\n`, 'yellow');
    process.exit(1);
  }
} else {
  colorLog("\n✨ All required files verified. Ready for Vercel deployment!", 'green');
  colorLog("🚀 Your project structure is correct for Vercel!\n", 'bright');
}
