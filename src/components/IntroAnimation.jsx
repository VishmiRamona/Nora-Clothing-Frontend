import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function IntroAnimation({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-teal to-navy overflow-hidden relative"
      initial={{ y: 0 }}
      exit={{ y: '100%' }}                 // slides down when removed
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* silk background (same as before) */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 800">
        <defs>
          <linearGradient id="silkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0,400 Q300,300 600,400 T1200,350 L1200,800 L0,800 Z"
          fill="url(#silkGrad)"
          animate={{
            d: [
              "M0,400 Q300,300 600,400 T1200,350 L1200,800 L0,800 Z",
              "M0,350 Q300,450 600,350 T1200,400 L1200,800 L0,800 Z",
              "M0,400 Q300,300 600,400 T1200,350 L1200,800 L0,800 Z",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,500 Q300,400 600,500 T1200,450 L1200,800 L0,800 Z"
          fill="url(#silkGrad)"
          animate={{
            d: [
              "M0,500 Q300,400 600,500 T1200,450 L1200,800 L0,800 Z",
              "M0,450 Q300,550 600,450 T1200,500 L1200,800 L0,800 Z",
              "M0,500 Q300,400 600,500 T1200,450 L1200,800 L0,800 Z",
            ],
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </svg>

      <motion.img
        src="/images/logo1.png"
        alt="NORA"
        className="h-36 w-auto drop-shadow-lg z-10"
        initial={{ scale: 0.8, opacity: 0.4 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1.2, type: 'spring', stiffness: 100 }}
      />

      <motion.div
        className="flex gap-3 mt-6 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-white rounded-full"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}