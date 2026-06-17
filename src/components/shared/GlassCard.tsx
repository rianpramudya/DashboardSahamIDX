'use client';

// Glassmorphism card component
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  glowColor?: string;
  onClick?: () => void;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, hover = true, glow = false, glowColor = 'cyan', onClick }, ref) => {
    const glowColorMap: Record<string, string> = {
      cyan: 'hover:shadow-cyan-500/10',
      emerald: 'hover:shadow-emerald-500/10',
      red: 'hover:shadow-red-500/10',
      purple: 'hover:shadow-purple-500/10',
    };

    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { scale: 1.005 } : undefined}
        className={cn(
          'rounded-xl border border-border/50 bg-card/60 backdrop-blur-xl',
          'shadow-sm transition-all duration-300',
          hover && 'hover:shadow-lg',
          glow && (glowColorMap[glowColor] || glowColorMap.cyan),
          'dark:bg-white/5 dark:border-white/10',
          'light:bg-white/80 light:border-black/10',
          className
        )}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }
);
GlassCard.displayName = 'GlassCard';
