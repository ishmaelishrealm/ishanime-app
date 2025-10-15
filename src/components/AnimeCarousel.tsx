import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimeCard } from './AnimeCard';
import { API_URL } from '../config';

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

interface AnimeCarouselProps {
  title: string;
  onAnimeClick?: (show: Show) => void;
}

export function AnimeCarousel({ title, onAnimeClick }: AnimeCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/shows`)
      .then((r) => {
        if (!r.ok) throw new Error('Backend not available');
        return r.json();
      })
      .then((data) => {
        if (data?.success && data.data) {
          setShows(data.data || []);
        }
      })
      .catch(() => {
        // Backend not available - using demo mode with sample data
        setShows([
          {
            id: 'demo-1',
            title: 'Demon Slayer',
            slug: 'demon-slayer',
            coverUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400',
            episodes: [
              { id: '1', title: 'Episode 1', thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400' },
              { id: '2', title: 'Episode 2', thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400' },
            ],
            latestEpisode: { id: '2', title: 'Episode 2' },
          },
          {
            id: 'demo-2',
            title: 'Jujutsu Kaisen',
            slug: 'jujutsu-kaisen',
            coverUrl: 'https://images.unsplash.com/photo-1624682037173-966e60980367?w=400',
            episodes: [
              { id: '1', title: 'Episode 1', thumbnail: 'https://images.unsplash.com/photo-1624682037173-966e60980367?w=400' },
              { id: '2', title: 'Episode 2', thumbnail: 'https://images.unsplash.com/photo-1624682037173-966e60980367?w=400' },
            ],
            latestEpisode: { id: '2', title: 'Episode 2' },
          },
          {
            id: 'demo-3',
            title: 'Attack on Titan',
            slug: 'attack-on-titan',
            coverUrl: 'https://images.unsplash.com/photo-1601430854328-26d0d524344a?w=400',
            episodes: [
              { id: '1', title: 'Episode 1', thumbnail: 'https://images.unsplash.com/photo-1601430854328-26d0d524344a?w=400' },
            ],
            latestEpisode: { id: '1', title: 'Episode 1' },
          },
          {
            id: 'demo-4',
            title: 'My Hero Academia',
            slug: 'my-hero-academia',
            coverUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400',
            episodes: [
              { id: '1', title: 'Episode 1', thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400' },
            ],
            latestEpisode: { id: '1', title: 'Episode 1' },
          },
          {
            id: 'demo-5',
            title: 'One Piece',
            slug: 'one-piece',
            coverUrl: 'https://images.unsplash.com/photo-1624682037173-966e60980367?w=400',
            episodes: [
              { id: '1', title: 'Episode 1', thumbnail: 'https://images.unsplash.com/photo-1624682037173-966e60980367?w=400' },
            ],
            latestEpisode: { id: '1', title: 'Episode 1' },
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const newScrollLeft =
        direction === 'left'
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6 px-6">
          <h2 className="text-white">{title}</h2>
        </div>
        <div className="flex gap-6 px-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-shrink-0 w-48">
              <div className="aspect-[2/3] bg-[#151515] rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (shows.length === 0 && !loading) {
    return null; // Hide carousel if no shows
  }

  return (
    <div className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 px-6">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-white relative"
        >
          {title}
          <div className="absolute -bottom-1 left-0 w-16 h-1 bg-[#ff2e97] glow-pink-sm" />
        </motion.h2>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 border border-white/10 hover:border-[#ff2e97]/50 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 border border-white/10 hover:border-[#ff2e97]/50 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-6 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {shows.map((show, index) => (
          <motion.div
            key={show.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="flex-shrink-0 w-48"
          >
            <AnimeCard
              id={show.id}
              title={show.title}
              image={show.coverUrl || show.latestEpisode?.thumbnail || ''}
              episodes={show.episodes?.length}
              status="Available"
              onClick={() => onAnimeClick?.(show)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
