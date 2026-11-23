import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[70] h-[3px] bg-slate-900/60 pointer-events-none"
      aria-hidden="true"
    >
      <motion.div
        className="h-full w-full bg-gradient-to-r from-cyan-500 via-indigo-400 to-emerald-400 shadow-[0_0_10px_rgba(34,211,238,0.75)] origin-left"
        style={{ scaleX }}
      />
    </div>
  );
};
