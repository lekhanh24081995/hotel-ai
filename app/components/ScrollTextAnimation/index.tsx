'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LIST_AI_MODELS } from '@/app/lib/constants/common';

const ScrollTextAnimation = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % LIST_AI_MODELS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-7 overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8 }}
          className="absolute flex h-7 w-full items-center"
        >
          {LIST_AI_MODELS[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ScrollTextAnimation;
