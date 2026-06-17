'use client';

// Animated section header with title and description
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({
  title,
  subtitle,
  action,
  className,
  align = 'left',
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className={cn(
        'flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6',
        align === 'center' && 'items-center text-center',
        className
      )}
    >
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </motion.div>
  );
}
