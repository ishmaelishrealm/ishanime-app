import { motion } from 'framer-motion';
import { Play, Plus, Info, Star } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface HeroSectionProps {
  title: string;
  description: string;
  image: string;
  tags?: string[];
  score?: number;
  year?: number;
  episodes?: number;
  onWatch?: () => void;
}

export function HeroSection({
  title,
  description,
  image,
  tags = [],
  score,
  year,
  episodes,
  onWatch,
}: HeroSectionProps) {
  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Multi-layer gradient for dramatic effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1920px] mx-auto px-6 h-full flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          {/* Featured Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-[#ff2e97]/20 border border-[#ff2e97] text-[#ff2e97] rounded-full text-sm backdrop-blur-sm glow-pink-sm">
              🔥 Featured This Week
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4 text-white"
            style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1 }}
          >
            {title}
          </motion.h1>

          {/* Meta Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 mb-6"
          >
            {score && (
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-[#ff2e97] text-[#ff2e97]" />
                <span className="text-white">{score}</span>
              </div>
            )}
            {year && <span className="text-[#bbbbbb]">{year}</span>}
            {episodes && <span className="text-[#bbbbbb]">{episodes} Episodes</span>}
            <span className="px-3 py-1 bg-[#39ff14]/20 text-[#39ff14] rounded text-sm border border-[#39ff14]/30">
              HD
            </span>
          </motion.div>

          {/* Tags */}
          {tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/5 text-white rounded text-sm border border-white/10 hover:border-[#ff2e97]/50 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-[#bbbbbb] mb-8 line-clamp-3 max-w-xl"
          >
            {description}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onWatch}
              className="px-8 py-4 bg-[#ff2e97] text-white rounded-lg flex items-center gap-3 glow-pink hover:bg-[#ff4aa7] transition-colors"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Watch Now</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 text-white rounded-lg flex items-center gap-3 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>My List</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 text-white rounded-lg flex items-center gap-3 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
            >
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
