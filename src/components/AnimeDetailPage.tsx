import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { API_URL } from '../config';

interface Episode {
  id: string;
  title: string;
  fullTitle?: string;
  thumbnail?: string;
  iframeUrl?: string;
  hlsUrl?: string;
  directPlayUrl?: string;
  directPlayUrl720?: string;
  directPlayUrl480?: string;
  directPlayUrl360?: string;
  mp4Url?: string;
  mp4Url480?: string;
  embedUrl?: string;
  publishedAt?: string;
}

interface Show {
  id: string;
  title: string;
  slug: string;
  coverUrl?: string;
  episodes: Episode[];
}

interface AnimeDetailPageProps {
  slug: string;
  onBack: () => void;
}

export function AnimeDetailPage({ slug, onBack }: AnimeDetailPageProps) {
  const [show, setShow] = useState<Show | null>(null);
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    
    setLoading(true);
    setError(null);
    
    fetch(`${API_URL}/api/shows/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (data?.success && data.data) {
          // Sort episodes to ensure Episode 01 comes first
          const sortedEpisodes = data.data.episodes.sort((a: Episode, b: Episode) => {
            const aNum = parseInt(a.title.match(/\d+/)?.[0] || '0');
            const bNum = parseInt(b.title.match(/\d+/)?.[0] || '0');
            return aNum - bNum;
          });
          
          setShow({ ...data.data, episodes: sortedEpisodes });
          setSelectedEpisodeIndex(0);
        } else {
          setError('Show not found');
        }
      })
      .catch(() => {
        setError('Backend not available. Download the project to use real Ishrealm streaming.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="mb-4">Loading anime...</div>
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <div className="text-white text-center py-20">
            <h2 className="mb-4">⚠️ {error || 'Show not found'}</h2>
            <p className="text-gray-400 mb-6">
              You're in demo mode. To watch real videos from Ishrealm:
            </p>
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-left max-w-2xl mx-auto">
              <ol className="space-y-3 text-sm text-gray-300">
                <li className="flex gap-3">
                  <span className="text-pink-500 flex-shrink-0">1.</span>
                  <span>Download this project from Figma Make</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-pink-500 flex-shrink-0">2.</span>
                  <span>Follow the setup guide in README.md or SETUP.md</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-pink-500 flex-shrink-0">3.</span>
                  <span>Configure your Ishrealm streaming credentials in server/.env</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-pink-500 flex-shrink-0">4.</span>
                  <span>Run the backend server and frontend locally</span>
                </li>
              </ol>
            </div>
            <button
              onClick={onBack}
              className="mt-6 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedEpisode = show.episodes[selectedEpisodeIndex];

  return (
    <div className="min-h-screen bg-black">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Cinematic Video Player Section */}
      <div className="w-full h-screen relative">
        {selectedEpisode && (
          <VideoPlayer
            videoId={selectedEpisode.id}
            iframeUrl={selectedEpisode.iframeUrl}
            hlsUrl={selectedEpisode.hlsUrl}
            directPlayUrl={selectedEpisode.directPlayUrl}
            directPlayUrl720={selectedEpisode.directPlayUrl720}
            directPlayUrl480={selectedEpisode.directPlayUrl480}
            directPlayUrl360={selectedEpisode.directPlayUrl360}
            mp4Url={selectedEpisode.mp4Url}
            mp4Url480={selectedEpisode.mp4Url480}
            embedUrl={selectedEpisode.embedUrl}
            thumbnail={selectedEpisode.thumbnail}
            title={show.title}
            episode={selectedEpisodeIndex + 1}
          />
        )}
      </div>

      {/* Show Info */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex gap-8 items-start">
          {/* Poster */}
          <div className="hidden md:block">
            <div className="w-48 aspect-[2/3] rounded-lg overflow-hidden">
              <ImageWithFallback
                src={show.coverUrl || selectedEpisode?.thumbnail || ''}
                alt={show.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-white text-3xl font-bold mb-4">{show.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-400">{show.episodes.length} Episodes</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm border border-green-500/30">
                HD
              </span>
              <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded text-sm border border-pink-500/30">
                Streaming Now
              </span>
            </div>
          </div>
        </div>

        {/* Episodes List */}
        <div className="mt-8">
          <h2 className="text-white text-xl font-semibold mb-4">Episodes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {show.episodes.map((episode, index) => (
              <div
                key={episode.id}
                onClick={() => {
                  setSelectedEpisodeIndex(index);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`bg-gray-900 rounded-lg p-4 border transition-all cursor-pointer ${
                  selectedEpisodeIndex === index
                    ? 'border-pink-500'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded flex items-center justify-center ${
                    selectedEpisodeIndex === index
                      ? 'bg-pink-500/20'
                      : 'bg-gray-800'
                  }`}>
                    <span className="text-pink-500 font-semibold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white mb-1">{episode.title}</h4>
                    {episode.fullTitle && episode.fullTitle !== episode.title && (
                      <p className="text-gray-400 text-sm">{episode.fullTitle}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}