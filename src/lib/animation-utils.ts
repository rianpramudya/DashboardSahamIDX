// Animation helper utilities

export const EASINGS = {
  easeOutQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
  easeInOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
  easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeInOutQuart: 'cubic-bezier(0.76, 0, 0.24, 1)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
};

export const DURATIONS = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  slower: 0.8,
  slowest: 1.2,
};

export const STAGGER = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
};

/**
 * Generate stagger delay
 */
export function getStaggerDelay(index: number, base: number = 0.1): number {
  return index * base;
}

/**
 * CSS transition shorthand
 */
export function transition(
  properties: string[] = ['all'],
  duration: number = DURATIONS.normal,
  easing: string = EASINGS.easeOutQuart
): string {
  return properties.map((p) => `${p} ${duration}s ${easing}`).join(', ');
}

/**
 * Framer Motion variants for common animations
 */
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATIONS.normal, ease: EASINGS.easeOutQuart },
  },
};

export const slideUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATIONS.normal, ease: EASINGS.easeOutQuart },
  },
};

export const slideDownVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATIONS.normal, ease: EASINGS.easeOutQuart },
  },
};

export const slideLeftVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATIONS.normal, ease: EASINGS.easeOutQuart },
  },
};

export const slideRightVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATIONS.normal, ease: EASINGS.easeOutQuart },
  },
};

export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATIONS.normal, ease: EASINGS.easeOutBack },
  },
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.normal,
      delayChildren: 0.1,
    },
  },
};

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATIONS.normal, ease: EASINGS.easeOutQuart },
  },
};

export const cardHoverVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: DURATIONS.fast, ease: EASINGS.easeOutQuart },
  },
};

/**
 * Number animation helper for count-up
 */
export function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Interpolate between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}
