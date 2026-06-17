'use client';

// Text reveal animation on scroll
import { motion } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function TextReveal({ text, className, delay = 0 }: TextRevealProps) {
  const words = text.split(' ');

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className || ''}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="mr-[0.25em] inline-block"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.4,
                delay: delay + i * 0.1,
                ease: [0.25, 1, 0.5, 1],
              },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
