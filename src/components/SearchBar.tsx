import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { API_URL } from '../config';

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  coverUrl?: string;
  type: 'show' | 'episode';
  episodeTitle?: string;
  showTitle?: string;
}

interface SearchBarProps {
  shows?: any[];
  onSelectShow?: (show: any) => void;
  onResultClick?: (result: SearchResult) => void;
  placeholder?: string;
}

export function SearchBar({ shows = [], onSelectShow, onResultClick, placeholder = "Search anime..." }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(() => {
      try {
        const searchResults: SearchResult[] = [];
        
        // Search in provided shows array
        shows.forEach((show: any) => {
          // Search in show titles
          if (show.title.toLowerCase().includes(query.toLowerCase())) {
            searchResults.push({
              id: show.id,
              title: show.title,
              slug: show.slug,
              coverUrl: show.coverUrl,
              type: 'show',
              showTitle: show.title
            });
          }
          
          // Search in episode titles
          if (show.episodes) {
            show.episodes.forEach((episode: any) => {
              if (episode.title.toLowerCase().includes(query.toLowerCase()) ||
                  episode.fullTitle?.toLowerCase().includes(query.toLowerCase())) {
                searchResults.push({
                  id: episode.id,
                  title: episode.title,
                  slug: show.slug,
                  coverUrl: episode.thumbnail || show.coverUrl,
                  type: 'episode',
                  episodeTitle: episode.title,
                  showTitle: show.title
                });
              }
            });
          }
        });
        
        setResults(searchResults.slice(0, 6));
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, shows]);

  const handleResultClick = (result: SearchResult) => {
    if (onSelectShow && result.type === 'show') {
      onSelectShow(result);
    } else if (onResultClick) {
      onResultClick(result);
    }
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-400">
              Searching...
            </div>
          ) : results.length > 0 ? (
            results.map((result) => (
              <div
                key={`${result.type}-${result.id}`}
                onClick={() => handleResultClick(result)}
                className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                    {result.coverUrl ? (
                      <img
                        src={result.coverUrl}
                        alt={result.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-pink-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {result.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        result.type === 'show' 
                          ? 'bg-pink-500/20 text-pink-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {result.type === 'show' ? 'Show' : 'Episode'}
                      </span>
                    </div>
                    <h4 className="text-white font-medium truncate">
                      {result.type === 'episode' ? result.episodeTitle : result.title}
                    </h4>
                    {result.type === 'episode' && result.showTitle && (
                      <p className="text-gray-400 text-sm truncate">
                        from {result.showTitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-400">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}