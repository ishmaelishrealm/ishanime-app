# 🎭 Demo Mode Information

You're currently viewing **Ishanime in Demo Mode** within Figma Make.

## What is Demo Mode?

Demo Mode shows you the complete UI/UX of Ishanime with sample anime data. This lets you:

✅ Explore the sleek dark theme and hot pink accents  
✅ See all the animations and interactions  
✅ Navigate between pages and components  
✅ Experience the design without backend setup  

## What's Different from Full Version?

In Demo Mode:
- ❌ No real video streaming from Bunny CDN
- ❌ Shows use sample/placeholder data
- ❌ Backend API endpoints aren't available
- ✅ All UI components work perfectly
- ✅ Full design system is visible
- ✅ Animations and interactions are active

## Unlock Full Functionality

To get real Bunny CDN video streaming:

### Step 1: Download Project
Export this project from Figma Make to your local machine.

### Step 2: Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
npm install
```

### Step 3: Configure Bunny CDN

Create `server/.env`:
```env
PORT=13500
BUNNY_LIBRARY_ID=your_library_id
BUNNY_API_KEY=your_api_key
BUNNY_DELIVERY_DOMAIN=your_domain.b-cdn.net
```

Get these credentials from your Bunny CDN Dashboard → Stream.

### Step 4: Upload Videos

In Bunny Dashboard:
1. Go to Stream → Your Library
2. Upload video files
3. Name them: `Show Name - Episode 01`

The backend will automatically group episodes into shows!

### Step 5: Run Locally

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

Open http://localhost:5173 (or your dev server port).

## Console Messages Explained

You may see these console messages in Demo Mode - they're **normal and expected**:

- `"Backend not available, using demo mode"` - Expected in browser preview
- `"Failed to fetch show"` - Normal when backend isn't running

These are **warnings, not errors**. The app handles them gracefully by showing demo data.

## Architecture Overview

```
┌─────────────────────┐
│   Figma Make        │  ← You Are Here (Demo Mode)
│   (Browser Only)    │     - Sample data
│   ✅ Frontend UI    │     - No video streaming
│   ❌ Backend API    │
└─────────────────────┘

┌─────────────────────┐
│   Downloaded &      │  ← Full Experience
│   Running Locally   │     - Real Bunny videos
│   ✅ Frontend UI    │     - Backend API
│   ✅ Backend API    │     - Auto episode grouping
│   ✅ Bunny CDN      │
└─────────────────────┘
```

## Need Help?

📖 Read **SETUP.md** for detailed setup instructions  
📖 Read **README.md** for project overview  
📖 Check **server/README.md** for API documentation  

---

**Enjoy exploring the Ishanime design!** 💖
When you're ready for the full experience, follow the setup guide above.
