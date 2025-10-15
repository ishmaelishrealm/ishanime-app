import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle, X, ExternalLink } from 'lucide-react';
import { API_URL } from '../config';

export function BackendStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [showBanner, setShowBanner] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(`${API_URL}/api/shows`, {
          method: 'GET',
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          setStatus('connected');
          // Auto-hide if connected
          setTimeout(() => setShowBanner(false), 3000);
        } else {
          setStatus('disconnected');
        }
      } catch {
        // Backend not available - expected in Figma Make preview
        setStatus('disconnected');
      }
    };

    checkBackend();
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowBanner(false);
  };

  if (isDismissed || !showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-20 left-0 right-0 z-40 px-6"
      >
        <div className="max-w-4xl mx-auto">
          {status === 'checking' && (
            <div className="bg-[#151515] border border-blue-500/50 rounded-lg p-4 flex items-center gap-4 shadow-lg">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <div className="flex-1">
                <p className="text-white">Checking backend connection...</p>
              </div>
            </div>
          )}

          {status === 'connected' && (
            <div className="bg-[#151515] border border-[#39ff14]/50 rounded-lg p-4 flex items-center gap-4 shadow-lg">
              <CheckCircle className="w-5 h-5 text-[#39ff14] flex-shrink-0" />
              <div className="flex-1">
                <p className="text-white">✅ Connected to Bunny CDN backend</p>
                <p className="text-sm text-gray-400">Loading real anime content...</p>
              </div>
              <button onClick={handleDismiss} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {status === 'disconnected' && (
            <div className="bg-[#151515] border border-[#ff2e97]/50 rounded-lg p-4 shadow-lg glow-pink-sm">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-[#ff2e97] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-white mb-2">Backend Not Connected</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    You're viewing demo mode with sample data. To use real Bunny CDN streaming:
                  </p>
                  <ol className="text-sm text-gray-400 space-y-1 mb-3 ml-4 list-decimal">
                    <li>Download this project</li>
                    <li>Set up the backend server (see README.md)</li>
                    <li>Configure your Bunny CDN credentials</li>
                  </ol>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDismiss}
                      className="px-4 py-2 bg-[#ff2e97] text-white rounded text-sm hover:bg-[#ff4aa7] transition-colors"
                    >
                      Continue in Demo Mode
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="px-4 py-2 bg-white/10 text-white rounded text-sm hover:bg-white/20 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
                <button onClick={handleDismiss} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
