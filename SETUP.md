# Ishanime - Setup Guide

Complete setup instructions for getting Ishanime running with Bunny CDN backend.

## Prerequisites

- Node.js 16+ installed
- Bunny CDN account with Stream/Video Library
- Your Bunny credentials ready

## Step 1: Backend Server Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `server/.env` with your Bunny credentials:
```env
PORT=13500
BUNNY_LIBRARY_ID=your_library_id_here
BUNNY_API_KEY=your_api_key_here
BUNNY_DELIVERY_DOMAIN=your_domain.b-cdn.net
```

### Finding Your Bunny Credentials

- **Library ID**: Dashboard → Stream → Your Library → Settings
- **API Key**: Dashboard → Stream → Your Library → API
- **Delivery Domain**: Your pull zone domain (e.g., `vz-xxxxx.b-cdn.net` or `ishanime.b-cdn.net`)

5. Start the server:
```bash
npm run dev
```

You should see:
```
🚀 Ishanime server listening on http://localhost:13500
📺 Test shows endpoint: http://localhost:13500/api/shows
```

6. Test the API:
Open http://localhost:13500/api/shows in your browser. You should see JSON with your shows.

## Step 2: Frontend Setup

1. Go back to project root:
```bash
cd ..
```

2. Create frontend environment file:
```bash
cp .env.example .env.local
```

3. Edit `.env.local`:
```env
VITE_API_URL=http://localhost:13500
```

4. Install frontend dependencies (if not already done):
```bash
npm install
```

5. Start the frontend:
```bash
npm run dev
```

## Step 3: Upload Test Videos to Bunny

1. Go to Bunny Dashboard → Stream → Your Library
2. Upload a few video files
3. Name them using this format for best results:
   - `Show Name - Episode 01`
   - `Show Name - Episode 02`
   - Or: `Show Name Episode 1`

Example titles:
- `Demon Slayer - Episode 01`
- `Demon Slayer - Episode 02`
- `Attack on Titan Episode 1`

The server will automatically group these into shows!

## Step 4: Test Everything

1. Open your frontend (usually http://localhost:5173 or http://localhost:3000)
2. You should see:
   - Header with Ishanime logo
   - Hero section with featured show
   - Carousels showing your Bunny shows
3. Click on a show card
4. You should see:
   - Show detail page
   - Video player with Bunny iframe
   - List of all episodes
5. Click an episode to play it!

## Troubleshooting

### "No shows available"
- Check that backend server is running on port 13500
- Check `server/.env` has correct Bunny credentials
- Check that you have videos uploaded to your Bunny library
- Open http://localhost:13500/api/shows to see raw API response

### "Failed to load anime"
- Make sure `VITE_API_URL` in `.env.local` matches your backend URL
- Check browser console for CORS errors
- Make sure both frontend and backend are running

### Video player not loading
- Check that `BUNNY_DELIVERY_DOMAIN` is correct in `server/.env`
- Check that video has finished encoding in Bunny Dashboard
- Check browser console for errors

### CORS errors
The server has CORS enabled by default for development. For production, edit `server/index.js`:
```javascript
app.use(cors({
  origin: 'https://your-domain.com'
}));
```

## Production Deployment

### Backend (server/)
Deploy to:
- Railway.app
- Render.com
- Heroku
- Any Node.js hosting

Set environment variables in your hosting dashboard.

### Frontend
Deploy to:
- Vercel
- Netlify
- Cloudflare Pages

Update `VITE_API_URL` to your production backend URL.

## Bunny Webhook (Optional)

To auto-refresh when new videos are uploaded:

1. Go to Bunny Dashboard → Stream → Your Library → Webhooks
2. Add webhook URL: `https://your-backend.com/api/webhook/bunny`
3. Enable "Video Uploaded" event
4. The cache will automatically clear when new content is added

## Next Steps

Once everything works:
- Customize the design/theme
- Add more metadata to your videos in Bunny
- Set up a database for persistent data
- Add user accounts and bookmarks
- Create an admin panel for managing content

## Need Help?

Common issues:
1. Port 13500 already in use? Change `PORT` in `server/.env`
2. Bunny API errors? Double-check your API key has correct permissions
3. Videos not grouping correctly? Rename them following the title format guide above
