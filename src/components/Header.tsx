import { useState } from 'react';
import { Search, Menu, Bookmark, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { SearchBar } from './SearchBar';

interface HeaderProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filter: string) => void;
  currentFilter?: string;
  shows?: any[];
  onSelectShow?: (show: any) => void;
}

export function Header({ onSearch, onFilterChange, currentFilter = 'all', shows = [], onSelectShow }: HeaderProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleFilterClick = (filter: string) => {
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-[1920px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink onClick={() => handleFilterClick('all')} active={currentFilter === 'all'}>All</NavLink>
          <NavLink onClick={() => handleFilterClick('popular')} active={currentFilter === 'popular'}>Popular</NavLink>
          <NavLink onClick={() => handleFilterClick('new')} active={currentFilter === 'new'}>New</NavLink>
          <NavLink onClick={() => handleFilterClick('spring')} active={currentFilter === 'spring'}>Spring 2025</NavLink>
          <NavLink onClick={() => handleFilterClick('random')} active={currentFilter === 'random'}>Random</NavLink>
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          {/* Desktop Search */}
          {shows.length > 0 && onSelectShow && (
            <div className="hidden lg:block w-64">
              <SearchBar shows={shows} onSelectShow={onSelectShow} />
            </div>
          )}
          
          {/* Mobile Search Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5 text-gray-400" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors relative"
          >
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff2e97] rounded-full glow-pink-sm"></span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Bookmark className="w-5 h-5 text-gray-400" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-400" />
          </motion.button>

          {/* Logo on Right Side */}
          <motion.div
            className="ml-4 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <img 
              src="/assets/ishmael.png" 
              alt="Ishrealm" 
              className="w-10 h-10 object-contain"
            />
          </motion.div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showMobileSearch && shows.length > 0 && onSelectShow && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="lg:hidden border-t border-white/10 px-6 py-4"
        >
          <SearchBar shows={shows} onSelectShow={(show) => {
            onSelectShow(show);
            setShowMobileSearch(false);
          }} />
        </motion.div>
      )}
    </motion.header>
  );
}

function NavLink({ onClick, children, active }: { onClick?: () => void; children: React.ReactNode; active?: boolean }) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative text-sm transition-colors ${
        active ? 'text-white' : 'text-gray-400 hover:text-white'
      }`}
      whileHover={{ y: -2 }}
    >
      {children}
      {active && (
        <motion.div
          layoutId="activeNav"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#ff2e97] glow-pink-sm"
        />
      )}
    </motion.button>
  );
}
