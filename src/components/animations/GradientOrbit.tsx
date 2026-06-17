'use client';

// Orbiting gradient background effect
import { motion } from 'framer-motion';

interface GradientOrbitProps {
  className?: string;
}

export function GradientOrbit({ className }: GradientOrbitProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className || ''}`}>
      {/* Gradient orb 1 */}
      <motion.div
        className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, 100, 50, 0],
          y: [0, 50, 100, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Gradient orb 2 */}
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(124, 77, 255, 0.06) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, -80, -40, 0],
          y: [0, -60, -100, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Gradient orb 3 */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 200, 83, 0.04) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
