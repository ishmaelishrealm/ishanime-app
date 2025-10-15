import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AnimeCarousel } from './components/AnimeCarousel';
import { AnimeDetailPage } from './components/AnimeDetailPage';
import { BackendStatus } from './components/BackendStatus';
import { DemoModeIndicator } from './components/DemoModeIndicator';
import { API_URL } from './config';

interface Episode {
  id: string;
  title: string;
  thumbnail?: string;
}

interface Show {
  id: string;
  title: string;
  slug: string;
  coverUrl?: string;
  episodes?: Episode[];
  latestEpisode?: Episode;
}

interface Anime {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  description: string;
  episodes?: number;
  status?: string;
  score?: number;
  year?: number;
  badge?: string;
  tags?: string[];
}

// Mock anime data
const mockAnimeData: Anime[] = [
  {
    id: '1',
    title: 'Demon Slayer: Kimetsu no Yaiba',
    subtitle: 'Kimetsu no Yaiba',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGFydHdvcmt8ZW58MXx8fHwxNzYwMTIyMjQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.',
    episodes: 26,
    status: 'Ongoing',
    score: 8.7,
    year: 2025,
    badge: '2',
    tags: ['Action', 'Supernatural', 'Shounen'],
  },
  {
    id: '2',
    title: 'Jujutsu Kaisen',
    subtitle: 'Sorcery Fight',
    image: 'https://images.unsplash.com/photo-1624682037173-966e60980367?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBuZW9ufGVufDF8fHx8MTc2MDE2MzQ2MHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman\'s school to be able to locate the demon\'s other body parts and thus exorcise himself.',
    episodes: 24,
    status: 'Episode Released',
    score: 8.8,
    year: 2024,
    badge: '3',
    tags: ['Action', 'Supernatural', 'School'],
  },
  {
    id: '3',
    title: 'Attack on Titan',
    subtitle: 'Shingeki no Kyojin',
    image: 'https://images.unsplash.com/photo-1601430854328-26d0d524344a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGFuaW1hdGlvbnxlbnwxfHx8fDE3NjAxMzMwMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'After his hometown is destroyed and his mother is killed, young Eren Yeager vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.',
    episodes: 87,
    status: 'Finished airing',
    score: 9.1,
    year: 2024,
    badge: '15',
    tags: ['Action', 'Drama', 'Military'],
  },
  {
    id: '4',
    title: 'My Hero Academia',
    subtitle: 'Boku no Hero Academia',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGFydHdvcmt8ZW58MXx8fHwxNzYwMTIyMjQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A superhero-admiring boy enrolls in a prestigious hero academy and learns what it really means to be a hero, after the strongest superhero grants him his own powers.',
    episodes: 113,
    status: 'Episode Released',
    score: 8.4,
    year: 2024,
    badge: '14',
    tags: ['Action', 'Comedy', 'School', 'Shounen'],
  },
  {
    id: '5',
    title: 'Spy x Family',
    image: 'https://images.unsplash.com/photo-1624682037173-966e60980367?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBuZW9ufGVufDF8fHx8MTc2MDE2MzQ2MHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A spy on an undercover mission gets married and adopts a child as part of his cover. His wife and daughter have secrets of their own, and all three must hide their true identities.',
    episodes: 25,
    status: 'Episode Released',
    score: 8.6,
    year: 2024,
    badge: '2',
    tags: ['Action', 'Comedy', 'Shounen'],
  },
  {
    id: '6',
    title: 'One Piece',
    image: 'https://images.unsplash.com/photo-1601430854328-26d0d524344a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGFuaW1hdGlvbnxlbnwxfHx8fDE3NjAxMzMwMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Follows the adventures of Monkey D. Luffy and his pirate crew in order to find the greatest treasure ever left by the legendary Pirate, Gold Roger.',
    episodes: 1100,
    status: 'Ongoing',
    score: 8.9,
    year: 2024,
    badge: '1178',
    tags: ['Action', 'Adventure', 'Comedy', 'Shounen'],
  },
  {
    id: '7',
    title: 'Chainsaw Man',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGFydHdvcmt8ZW58MXx8fHwxNzYwMTIyMjQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Denji has a simple dream—to live a happy and peaceful life, spending time with a girl he likes. This is a far cry from reality, however, as Denji is forced by the yakuza into killing devils.',
    episodes: 12,
    status: 'Finished airing',
    score: 8.5,
    year: 2024,
    badge: '12',
    tags: ['Action', 'Supernatural', 'Shounen'],
  },
  {
    id: '8',
    title: 'Frieren: Beyond Journey\'s End',
    image: 'https://images.unsplash.com/photo-1624682037173-966e60980367?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBuZW9ufGVufDF8fHx8MTc2MDE2MzQ2MHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'An elf mage who was part of the hero\'s party that defeated the Demon King embarks on a new journey to better understand humans and the meaning of their brief lives.',
    episodes: 28,
    status: 'Episode Released',
    score: 9.2,
    year: 2025,
    badge: '12',
    tags: ['Adventure', 'Drama', 'Fantasy'],
  },
  {
    id: '9',
    title: 'Tokyo Revengers',
    image: 'https://images.unsplash.com/photo-1601430854328-26d0d524344a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGFuaW1hdGlvbnxlbnwxfHx8fDE3NjAxMzMwMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'A young man is sent back in time to his middle school years in order to save his ex-girlfriend from a tragic fate by changing the timeline.',
    episodes: 24,
    status: 'Finished airing',
    score: 8.0,
    year: 2024,
    badge: '24',
    tags: ['Action', 'Drama', 'Supernatural'],
  },
  {
    id: '10',
    title: 'Vinland Saga',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGFydHdvcmt8ZW58MXx8fHwxNzYwMTIyMjQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Thorfinn pursues a journey with his father\'s killer in order to take revenge and end his life in a duel as an honorable warrior and pay his father a homage.',
    episodes: 48,
    status: 'Finished airing',
    score: 8.9,
    year: 2024,
    badge: '24',
    tags: ['Action', 'Adventure', 'Drama', 'Historical'],
  },
];

export default function App() {
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [selectedShowSlug, setSelectedShowSlug] = useState<string | null>(null);
  const [featuredShow, setFeaturedShow] = useState<Show | null>(null);

  // Fetch featured show for hero section
  useEffect(() => {
    fetch(`${API_URL}/api/shows`)
      .then((r) => {
        if (!r.ok) throw new Error('Backend not available');
        return r.json();
      })
      .then((data) => {
        if (data?.success && data.data && data.data.length > 0) {
          setFeaturedShow(data.data[0]);
        }
      })
      .catch(() => {
        // Backend not available - will use mock data for hero section
        setFeaturedShow(null);
      });
  }, []);

  const featuredAnime = mockAnimeData[0];
  const trendingAnime = mockAnimeData.slice(0, 8);
  const newReleases = mockAnimeData.slice(2, 10);
  const popularAnime = mockAnimeData.slice(1, 9);
  const springAnime = mockAnimeData.slice(3, 10);

  const handleAnimeClick = (anime: Anime) => {
    setSelectedAnime(anime);
    setSelectedShowSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowClick = (show: Show) => {
    setSelectedShowSlug(show.slug);
    setSelectedAnime(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedAnime(null);
    setSelectedShowSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchResult = (result: any) => {
    if (result.type === 'show') {
      setSelectedShowSlug(result.slug);
      setSelectedAnime(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (result.type === 'episode') {
      setSelectedShowSlug(result.slug);
      setSelectedAnime(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Show detail page for real Bunny content
  if (selectedShowSlug) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Header />
        <AnimeDetailPage slug={selectedShowSlug} onBack={handleBackToHome} />
      </div>
    );
  }

  // Show detail page for mock data (legacy)
  if (selectedAnime) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Header />
        <div className="pt-20 px-6 text-white text-center py-20">
          <h2 className="mb-4">Mock Data View</h2>
          <p className="text-[#bbbbbb] mb-6">
            This is using mock data. Click "Back to Home" and select a show from the carousel to see real Bunny content.
          </p>
          <button
            onClick={handleBackToHome}
            className="px-6 py-3 bg-[#ff2e97] text-white rounded-lg hover:bg-[#ff4aa7] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header onSearchResult={handleSearchResult} />
      <BackendStatus />
      <DemoModeIndicator />
      
      {/* Hero Section */}
      <div className="pt-20">
        {featuredShow ? (
          <HeroSection
            title={featuredShow.title}
            description={`Watch ${featuredShow.episodes?.length || 0} episodes now streaming in HD`}
            image={featuredShow.coverUrl || ''}
            tags={['HD', 'Streaming', 'Latest Episodes']}
            episodes={featuredShow.episodes?.length}
            onWatch={() => handleShowClick(featuredShow)}
          />
        ) : (
          <HeroSection
            title={featuredAnime.title}
            description={featuredAnime.description}
            image={featuredAnime.image}
            tags={featuredAnime.tags}
            score={featuredAnime.score}
            year={featuredAnime.year}
            episodes={featuredAnime.episodes}
            onWatch={() => handleAnimeClick(featuredAnime)}
          />
        )}
      </div>

      {/* Content Sections - Real Bunny Data */}
      <div className="py-12 space-y-8">
        {/* Hidden Bunny CDN section - still functional but invisible */}
        <div className="hidden">
          <AnimeCarousel
            title="🔥 Latest Shows from Bunny CDN"
            onAnimeClick={handleShowClick}
          />
        </div>

        <AnimeCarousel
          title="📺 All Available Shows"
          onAnimeClick={handleShowClick}
        />
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-[1920px] mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2e97] to-[#ff6ba9] uppercase tracking-wider mb-4 text-glow-pink">
                Ishrealm
              </h3>
              <p className="text-[#888888] text-sm">
                Your ultimate destination for streaming anime. Watch thousands of episodes, completely free.
              </p>
            </div>
            
            <div>
              <h4 className="text-white mb-4">Browse</h4>
              <ul className="space-y-2 text-sm text-[#888888]">
                <li className="hover:text-[#ff2e97] cursor-pointer transition-colors">New Releases</li>
                <li className="hover:text-[#ff2e97] cursor-pointer transition-colors">Popular</li>
                <li className="hover:text-[#ff2e97] cursor-pointer transition-colors">Trending</li>
                <li className="hover:text-[#ff2e97] cursor-pointer transition-colors">Random</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white mb-4">Genres</h4>
              <ul className="space-y-2 text-sm text-[#888888]">
                <li className="hover:text-[#ff2e97] cursor-pointer transition-colors">Action</li>
                <li className="hover:text-[#ff2e97] cursor-pointer transition-colors">Adventure</li>
                <li className="hover:text-[#ff2e97] cursor-pointer transition-colors">Comedy</li>
                <li className="hover:text-[#ff2e97] cursor-pointer transition-colors">Drama</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-[#888888]">
                <li className="hover:text-[#ff2e97] cursor-pointer transition-colors">Contact</li>
                <li className="hover:text-[#ff2e97] cursor-pointer transition-colors">Terms of Service</li>
                <li className="hover:text-[#ff2e97] cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-[#ff2e97] cursor-pointer transition-colors">DMCA</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center text-sm text-[#888888]">
            <p>© 2025 Ishrealm. All rights reserved. Made with 💖 for anime fans.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
