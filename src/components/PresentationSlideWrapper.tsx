import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';

export type SlideTransitionVariant =
  | 'morph'
  | 'push-up'
  | 'depth-zoom'
  | 'curtain-wipe'
  | 'perspective-tilt';

interface PresentationSlideWrapperProps {
  children: React.ReactNode;
  slideNumber: number;
  totalSlides: number;
  slideTitle: string;
  variant?: SlideTransitionVariant;
  className?: string;
}

export const PresentationSlideWrapper: React.FC<PresentationSlideWrapperProps> = ({
  children,
  slideNumber,
  totalSlides,
  slideTitle,
  variant = 'morph',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 26,
    mass: 0.35,
  });

  // PPTX-inspired compositor-only scroll curves (content remains legible throughout)
  const opacity = useTransform(smoothProgress, [0, 0.14, 0.86, 1], [0.55, 1, 1, 0.72]);

  const yOffset = useTransform(
    smoothProgress,
    [0, 0.18, 0.82, 1],
    variant === 'push-up'
      ? [56, 0, 0, -28]
      : variant === 'curtain-wipe'
      ? [36, 0, 0, -18]
      : [28, 0, 0, -16]
  );

  const scale = useTransform(
    smoothProgress,
    [0, 0.16, 0.84, 1],
    variant === 'depth-zoom'
      ? [0.95, 1, 1, 0.975]
      : variant === 'morph'
      ? [0.975, 1, 1, 0.985]
      : [0.985, 1, 1, 0.99]
  );

  const rotateX = useTransform(
    smoothProgress,
    [0, 0.16, 0.84, 1],
    variant === 'perspective-tilt' ? [4, 0, 0, -2] : [0, 0, 0, 0]
  );

  const ruleScaleX = useTransform(smoothProgress, [0.02, 0.24], [0, 1]);
  const slideLabel = `${String(slideNumber).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;

  if (shouldReduceMotion) {
    return (
      <div ref={containerRef} className={`relative ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative [perspective:1600px] ${className}`}
    >
      {/* Subtle PPTX Chapter Transition Hairline & Slide Index */}
      {slideNumber > 1 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex items-center justify-between gap-4 text-[11px] font-mono text-slate-500 pb-2">
            <div className="flex items-center gap-2 tabular-nums">
              <span className="text-cyan-400/90 font-semibold">Slide {slideLabel}</span>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <span className="text-slate-400">{slideTitle}</span>
            </div>
            <span className="hidden sm:inline text-slate-600">
              {variant === 'morph' && 'Morph Transition'}
              {variant === 'push-up' && 'Push Elevation'}
              {variant === 'depth-zoom' && 'Spatial Zoom'}
              {variant === 'curtain-wipe' && 'Linear Reveal'}
              {variant === 'perspective-tilt' && 'Isometric Plane'}
            </span>
          </div>
          <div className="h-px w-full bg-slate-900 overflow-hidden">
            <motion.div
              style={{ scaleX: ruleScaleX, transformOrigin: 'left center' }}
              className="h-full w-full bg-gradient-to-r from-cyan-500/80 via-indigo-400/60 to-transparent"
            />
          </div>
        </div>
      )}

      <motion.div
        style={{
          opacity,
          y: yOffset,
          scale,
          rotateX,
          transformOrigin: 'center top',
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
