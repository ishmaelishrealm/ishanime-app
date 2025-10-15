import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

export function DemoModeIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="bg-[#151515]/95 backdrop-blur-sm border border-[#ff2e97]/30 rounded-lg p-4 shadow-lg max-w-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#ff2e97]/20 flex items-center justify-center flex-shrink-0">
            <Info className="w-4 h-4 text-[#ff2e97]" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white text-sm mb-1">Demo Mode</h4>
            <p className="text-xs text-gray-400">
              Viewing sample data. Download to connect Bunny CDN.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
