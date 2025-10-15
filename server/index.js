// server/index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const morgan = require('morgan');
const slugify = require('slugify');

const PORT = process.env.PORT || 13500;
const LIBRARY_ID = process.env.BUNNY_LIBRARY_ID;
const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
const DELIVERY_DOMAIN = process.env.BUNNY_DELIVERY_DOMAIN; // e.g. vz-... .b-cdn.net or ishanime.b-cdn.net

if (!LIBRARY_ID || !BUNNY_API_KEY || !DELIVERY_DOMAIN) {
  console.warn('Missing one of BUNNY_LIBRARY_ID, BUNNY_API_KEY or BUNNY_DELIVERY_DOMAIN in env.');
}

const app = express();
app.use(express.json({ limit: '10mb' }));

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://ishanime.vercel.app', 'https://ishanime-git-main-ishmaelishrealm.vercel.app']
    : true,
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(morgan('tiny'));

/**
 * Helper: call Bunny Library API to list videos
 * Returns array of video objects (as returned by Bunny)
 */
async function fetchAllVideosFromBunny() {
  try {
    const url = `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`;
    // use AccessKey header (Bunny supports AccessKey)
    const res = await axios.get(url, {
      headers: {
        'AccessKey': BUNNY_API_KEY,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });
    return res.data.items || res.data || [];
  } catch (err) {
    console.error('Error fetching videos from Bunny:', err?.response?.data || err.message);
    throw err;
  }
}

/**
 * Helper: parse video title into show title + episode title
 * We use common patterns: "Show Title - Episode 01", or "Show Title Episode 1"
 */
function parseTitle(rawTitle) {
  if (!rawTitle) return { showTitle: 'Untitled', episodeTitle: rawTitle || 'Episode' };
  
  // try " - " first (most common pattern)
  if (rawTitle.includes(' - ')) {
    const [left, ...rest] = rawTitle.split(' - ');
    const right = rest.join(' - ');
    return { showTitle: left.trim(), episodeTitle: right.trim() || left.trim() };
  }
  
  // try " Episode " or "Ep " with better number extraction
  const epMatch = rawTitle.match(/(.+?)\s+[eE]p(?:isode)?\.?\s*(\d+)/);
  if (epMatch) {
    const episodeNum = epMatch[2].padStart(2, '0'); // Ensure 2-digit format (01, 02, etc.)
    return { showTitle: epMatch[1].trim(), episodeTitle: `Episode ${episodeNum}` };
  }
  
  // try patterns like "Show Title 01", "Show Title - 01", etc.
  const numMatch = rawTitle.match(/(.+?)\s*[-–]\s*(\d+)$/);
  if (numMatch) {
    const episodeNum = numMatch[2].padStart(2, '0');
    return { showTitle: numMatch[1].trim(), episodeTitle: `Episode ${episodeNum}` };
  }
  
  // fallback: try splitting by ":" or "("
  if (rawTitle.includes(':')) {
    const [left, ...rest] = rawTitle.split(':');
    return { showTitle: left.trim(), episodeTitle: rest.join(':').trim() || left.trim() };
  }
  
  return { showTitle: rawTitle.trim(), episodeTitle: rawTitle.trim() };
}

/**
 * Build front-end friendly show + episode objects from Bunny video list
 */
function buildShowsFromVideos(videos = []) {
  const showsMap = new Map();

  videos.forEach((video) => {
    // Bunny response fields may vary; common ones: guid, title
    const guid = video.guid || video.GUID || video.id || video.VideoId || video.videoGuid;
    const title = video.title || video.Title || video.name || '';
    const { showTitle, episodeTitle } = parseTitle(title);

    const showSlug = slugify(showTitle, { lower: true, strict: true });

    // Build episode with ALL Bunny CDN video source options
    const episode = {
      id: guid,
      title: episodeTitle || title,
      fullTitle: title,
      // Current thumbnail (always fresh from CDN)
      thumbnail: `https://${DELIVERY_DOMAIN}/${guid}/thumbnail.jpg`,
      
      // Bunny CDN Video Sources (in order of preference for sizing control)
      // 1. Direct Play URLs (best for custom sizing)
      directPlayUrl: `https://${DELIVERY_DOMAIN}/${guid}/play.mp4`,
      directPlayUrl720: `https://${DELIVERY_DOMAIN}/${guid}/play_720p.mp4`,
      directPlayUrl480: `https://${DELIVERY_DOMAIN}/${guid}/play_480p.mp4`,
      directPlayUrl360: `https://${DELIVERY_DOMAIN}/${guid}/play_360p.mp4`,
      
      // 2. HLS Streaming (good for adaptive quality)
      hlsUrl: `https://${DELIVERY_DOMAIN}/${guid}/playlist.m3u8`,
      
      // 3. Iframe URLs (limited sizing control)
      iframeUrl: `https://iframe.mediadelivery.net/play/${LIBRARY_ID}/${guid}`,
      embedUrl: `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${guid}?autoplay=false&loop=false&muted=false&responsive=true&preload=metadata`,
      
      // Legacy support
      mp4Url: `https://${DELIVERY_DOMAIN}/${guid}/play_720p.mp4`,
      mp4Url480: `https://${DELIVERY_DOMAIN}/${guid}/play_480p.mp4`,
      
      publishedAt: video.dateUploaded || video.createdAt || video.created || null,
      raw: video
    };

    if (!showsMap.has(showSlug)) {
      showsMap.set(showSlug, {
        id: showSlug,
        title: showTitle,
        slug: showSlug,
        coverUrl: episode.thumbnail,
        episodes: [episode],
        latestEpisode: episode
      });
    } else {
      const s = showsMap.get(showSlug);
      s.episodes.push(episode);
      // keep coverUrl as first thumbnail (or update if newer)
      s.latestEpisode = episode;
    }
  });

  // convert to array and sort episodes by episode number (oldest first)
  const shows = Array.from(showsMap.values()).map((s) => {
    // sort episodes by episode number (01, 02, 03...) instead of upload date
    s.episodes.sort((a, b) => {
      // Extract episode numbers from titles
      const aNum = parseInt(a.title.match(/\d+/)?.[0] || '0');
      const bNum = parseInt(b.title.match(/\d+/)?.[0] || '0');
      
      // If no episode numbers found, fall back to title alphabetical order
      if (aNum === 0 && bNum === 0) {
        return a.title.localeCompare(b.title);
      }
      
      return aNum - bNum; // Oldest episodes first (01, 02, 03...)
    });
    return s;
  });

  shows.sort((a, b) => {
    // sort by latestEpisode date if available
    const ta = new Date(a.latestEpisode?.publishedAt || 0).getTime();
    const tb = new Date(b.latestEpisode?.publishedAt || 0).getTime();
    return tb - ta;
  });

  return shows;
}

/** Caching simple in-memory (refresh every X seconds) */
let cache = { shows: null, timestamp: 0 };
const CACHE_TTL_MS = 30 * 1000; // 30s cache to avoid hitting Bunny every request

app.get('/api/shows', async (req, res) => {
  try {
    if (cache.shows && Date.now() - cache.timestamp < CACHE_TTL_MS) {
      return res.json({ success: true, data: cache.shows });
    }

    const videos = await fetchAllVideosFromBunny();
    const shows = buildShowsFromVideos(videos);
    cache.shows = shows;
    cache.timestamp = Date.now();
    res.json({ success: true, data: shows });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch shows' });
  }
});

app.get('/api/shows/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) return res.status(400).json({ success: false, error: 'Missing slug' });

    // ensure we have fresh cache
    if (!cache.shows || Date.now() - cache.timestamp >= CACHE_TTL_MS) {
      const videos = await fetchAllVideosFromBunny();
      cache.shows = buildShowsFromVideos(videos);
      cache.timestamp = Date.now();
    }

    const show = cache.shows.find((s) => s.slug === slug);
    if (!show) return res.status(404).json({ success: false, error: 'Show not found' });

    res.json({ success: true, data: show });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.get('/api/episodes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, error: 'Missing id' });

    // If we have it in cache, return
    if (cache.shows) {
      for (const s of cache.shows) {
        const ep = s.episodes.find((e) => e.id === id);
        if (ep) return res.json({ success: true, data: ep });
      }
    }

    // fallback: try fetching single video info from Bunny (if endpoint exists)
    try {
      const url = `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${id}`;
      const r = await axios.get(url, {
        headers: { 'AccessKey': BUNNY_API_KEY },
      });
      const v = r.data;
      const ep = {
        id: id,
        title: v.title || v.name || `Episode ${id}`,
        fullTitle: v.title || v.name,
        // Current thumbnail (always fresh from CDN)
        thumbnail: `https://${DELIVERY_DOMAIN}/${id}/thumbnail.jpg`,
        
        // Bunny CDN Video Sources (in order of preference for sizing control)
        // 1. Direct Play URLs (best for custom sizing)
        directPlayUrl: `https://${DELIVERY_DOMAIN}/${id}/play.mp4`,
        directPlayUrl720: `https://${DELIVERY_DOMAIN}/${id}/play_720p.mp4`,
        directPlayUrl480: `https://${DELIVERY_DOMAIN}/${id}/play_480p.mp4`,
        directPlayUrl360: `https://${DELIVERY_DOMAIN}/${id}/play_360p.mp4`,
        
        // 2. HLS Streaming (good for adaptive quality)
        hlsUrl: `https://${DELIVERY_DOMAIN}/${id}/playlist.m3u8`,
        
        // 3. Iframe URLs (limited sizing control)
        iframeUrl: `https://iframe.mediadelivery.net/play/${LIBRARY_ID}/${id}`,
        embedUrl: `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${id}?autoplay=false&loop=false&muted=false&responsive=true&preload=metadata`,
        
        // Legacy support
        mp4Url: `https://${DELIVERY_DOMAIN}/${id}/play_720p.mp4`,
        mp4Url480: `https://${DELIVERY_DOMAIN}/${id}/play_480p.mp4`,
        
        raw: v
      };
      return res.json({ success: true, data: ep });
    } catch (e) {
      console.warn('Could not fetch single video info, returning not found');
      return res.status(404).json({ success: false, error: 'Episode not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * Webhook handler for Bunny (auto-create / update)
 * You can register this endpoint in Bunny Dashboard -> Stream -> Webhooks
 */
app.post('/api/webhook/bunny', async (req, res) => {
  try {
    const body = req.body || {};
    console.log('Bunny Webhook received:', JSON.stringify(body).slice(0, 200));
    // You can process body here: create DB record, invalidate cache etc.
    // For now we simply clear the cache so next frontend request picks up new content
    cache = { shows: null, timestamp: 0 };
    res.json({ success: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Ishanime server listening on http://localhost:${PORT}`);
  console.log(`📺 Test shows endpoint: http://localhost:${PORT}/api/shows`);
});
