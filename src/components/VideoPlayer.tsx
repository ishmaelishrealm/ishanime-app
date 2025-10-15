import { useEffect, useState } from 'react';
import { API_URL } from '../config';

interface VideoPlayerProps {
  videoId?: string;
  iframeUrl?: string | null;
  hlsUrl?: string | null;
  directPlayUrl?: string | null;
  directPlayUrl720?: string | null;
  directPlayUrl480?: string | null;
  directPlayUrl360?: string | null;
  mp4Url?: string | null;
  mp4Url480?: string | null;
  embedUrl?: string | null;
  thumbnail?: string;
  title?: string;
  episode?: number;
}

export function VideoPlayer({ 
  videoId, 
  iframeUrl, 
  hlsUrl, 
  directPlayUrl,
  directPlayUrl720,
  directPlayUrl480,
  directPlayUrl360,
  mp4Url, 
  mp4Url480, 
  embedUrl, 
  thumbnail, 
  title = 'Anime Episode', 
  episode = 1 
}: VideoPlayerProps) {
  const [iframe, setIframe] = useState<string | null>(iframeUrl ?? null);
  const [hls, setHls] = useState<string | null>(hlsUrl ?? null);
  const [directPlay, setDirectPlay] = useState<string | null>(directPlayUrl ?? null);
  const [directPlay720, setDirectPlay720] = useState<string | null>(directPlayUrl720 ?? null);
  const [directPlay480, setDirectPlay480] = useState<string | null>(directPlayUrl480 ?? null);
  const [directPlay360, setDirectPlay360] = useState<string | null>(directPlayUrl360 ?? null);
  const [mp4, setMp4] = useState<string | null>(mp4Url ?? null);
  const [mp4Low, setMp4Low] = useState<string | null>(mp4Url480 ?? null);
  const [embed, setEmbed] = useState<string | null>(embedUrl ?? null);
  const [poster, setPoster] = useState<string | null>(thumbnail ?? null);
  const [loading, setLoading] = useState<boolean>(true);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [useDirectVideo, setUseDirectVideo] = useState<boolean>(true); // Start with direct video for better sizing

  useEffect(() => {
    if (!iframe && !hls && !directPlay && videoId) {
      fetch(`${API_URL}/api/episodes/${videoId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data?.success && data.data) {
            setIframe(data.data.iframeUrl || null);
            setHls(data.data.hlsUrl || null);
            setDirectPlay(data.data.directPlayUrl || null);
            setDirectPlay720(data.data.directPlayUrl720 || null);
            setDirectPlay480(data.data.directPlayUrl480 || null);
            setDirectPlay360(data.data.directPlayUrl360 || null);
            setMp4(data.data.mp4Url || null);
            setMp4Low(data.data.mp4Url480 || null);
            setEmbed(data.data.embedUrl || null);
            setPoster(data.data.thumbnail || null);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch episode:', err);
          setVideoError(true);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [videoId, iframe, hls, directPlay]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-xl font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  // Show iframe player (default)
  if (iframe && !useDirectVideo) {
    return (
      <div className="w-full h-screen bg-black relative overflow-hidden">
        {/* Video Source Toggle Button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setUseDirectVideo(true)}
            className="px-3 py-1 bg-pink-500/80 text-white text-xs rounded hover:bg-pink-600/80 transition-colors backdrop-blur-sm"
          >
            Try Direct Video
          </button>
        </div>
        
        <iframe
          src={embed || iframe} // Use embed URL with custom sizing if available
          title="Video Player"
          className="w-full h-full border-none absolute inset-0"
          style={{ 
            width: '100vw', 
            height: '100vh', 
            position: 'absolute',
            top: 0,
            left: 0,
            border: 'none',
            outline: 'none',
            transform: 'scale(1)',
            transformOrigin: 'top left',
            minWidth: '100vw',
            minHeight: '100vh',
            maxWidth: '100vw',
            maxHeight: '100vh'
          }}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          onError={() => setVideoError(true)}
          onLoad={() => {
            // Force iframe to take full size after load
            const iframe = document.querySelector('iframe');
            if (iframe) {
              iframe.style.width = '100vw';
              iframe.style.height = '100vh';
            }
          }}
        />
      </div>
    );
  }

  // Direct MP4 video player - BEST sizing control (prioritized)
  if ((directPlay || directPlay720 || directPlay480 || directPlay360 || mp4) && (useDirectVideo || !iframe)) {
    return (
      <div className="w-full h-screen bg-black relative overflow-hidden">
        {/* Video Source Toggle Button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setUseDirectVideo(false)}
            className="px-3 py-1 bg-blue-500/80 text-white text-xs rounded hover:bg-blue-600/80 transition-colors backdrop-blur-sm"
          >
            Try Iframe Player
          </button>
        </div>
        
        <video
          className="w-full h-full object-contain"
          style={{ 
            width: '100vw', 
            height: '100vh', 
            position: 'absolute',
            top: 0,
            left: 0,
            minWidth: '100vw',
            minHeight: '100vh',
            maxWidth: '100vw',
            maxHeight: '100vh'
          }}
          controls
          autoPlay
          poster={poster || undefined}
          onError={() => setVideoError(true)}
          onLoadedData={() => {
            // Ensure video takes full size
            const video = document.querySelector('video');
            if (video) {
              video.style.width = '100vw';
              video.style.height = '100vh';
            }
          }}
        >
          {/* Prioritize direct play URLs for best quality and sizing control */}
          {directPlay720 && <source src={directPlay720} type="video/mp4" />}
          {directPlay && <source src={directPlay} type="video/mp4" />}
          {directPlay480 && <source src={directPlay480} type="video/mp4" />}
          {directPlay360 && <source src={directPlay360} type="video/mp4" />}
          {mp4 && <source src={mp4} type="video/mp4" />}
          {mp4Low && <source src={mp4Low} type="video/mp4" />}
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center relative">
      {poster && <img src={poster} alt={title} className="w-full h-full object-cover" />}
      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
        <div className="text-center text-white">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-300 mb-4">Episode {episode}</p>
          {videoError && (
            <div className="text-red-400 text-sm">
              Video unavailable. Please try again later.
            </div>
          )}
          {!videoError && (
            <div className="text-gray-400 text-sm">
              Loading video player...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}