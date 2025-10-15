import { motion } from 'framer-motion';
import { Play, Plus, Star } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface AnimeCardProps {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  episodes?: number;
  status?: string;
  score?: number;
  year?: number;
  badge?: string;
  onClick?: () => void;
}

export function AnimeCard({
  title,
  subtitle,
  image,
  episodes,
  status,
  score,
  year,
  badge,
  onClick,
}: AnimeCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative cursor-pointer group"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#151515]">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badge */}
        {badge && (
          <div className="absolute top-2 left-2 bg-[#ff2e97] text-white px-2 py-1 rounded text-xs glow-pink-sm">
            {badge}
          </div>
        )}
        
        {/* Episodes Count */}
        {episodes && (
          <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
            {episodes} EP
          </div>
        )}
        
        {/* Play Button - Always Visible */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 rounded-full bg-[#ff2e97]/80 backdrop-blur-sm flex items-center justify-center glow-pink hover:bg-[#ff4aa7]/90 transition-all opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </motion.button>
        </motion.div>
        
        {/* Hover Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-[#39ff14]/20 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Plus className="w-5 h-5 text-white" />
          </motion.button>
        </motion.div>
      </div>
      
      {/* Info */}
      <div className="mt-3 px-1">
        <h3 className="text-white line-clamp-1 mb-1 group-hover:text-[#ff2e97] transition-colors">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[#bbbbbb] text-sm line-clamp-1 mb-2">{subtitle}</p>
        )}
        
        <div className="flex items-center gap-3 text-xs text-[#888888]">
          {status && (
            <span className={status === 'Episode Released' ? 'text-[#ff2e97]' : ''}>
              {status}
            </span>
          )}
          {year && <span>{year}</span>}
          {score && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#ff2e97] text-[#ff2e97]" />
              <span className="text-white">{score}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
