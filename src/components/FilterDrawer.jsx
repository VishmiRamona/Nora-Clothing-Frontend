import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import FilterPanel from './FilterPanel';

export default function FilterDrawer({ open, onClose, ...filterProps }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy/50 z-40 lg:hidden"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 overflow-y-auto p-6 lg:hidden"
          >
            <button onClick={onClose} aria-label="Close filters" className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-beige text-navy">
              <X size={20} />
            </button>
            <div className="mt-8">
              <FilterPanel {...filterProps} />
            </div>
            <button
              onClick={onClose}
              className="mt-8 w-full bg-navy text-white font-semibold py-3 rounded-xl hover:bg-teal transition-colors"
            >
              Show Results
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
