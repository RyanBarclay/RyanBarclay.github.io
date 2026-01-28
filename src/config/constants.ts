/**
 * Default images and gradients used across the application
 */

// Hero Images
export const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1735508729860-c9a4752585eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicml0aXNoJTIwY29sdW1iaWElMjBtb3VudGFpbnN8ZW58MXx8fHwxNzY5MTk4MjU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export const PROJECT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjkxNTU5OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

// Gradient Overlays
export const DEFAULT_GRADIENT =
  "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7))";

export const PROJECT_GRADIENT =
  "linear-gradient(to bottom, rgba(0,137,123,0.5), rgba(0,137,123,0.8))";

export const DARK_GRADIENT =
  "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))";

// PageHero Variants
export const HERO_VARIANTS = {
  default: {
    backgroundImage: DEFAULT_HERO_IMAGE,
    gradientOverlay: DEFAULT_GRADIENT,
  },
  project: {
    backgroundImage: PROJECT_HERO_IMAGE,
    gradientOverlay: PROJECT_GRADIENT,
  },
  dark: {
    backgroundImage: DEFAULT_HERO_IMAGE,
    gradientOverlay: DARK_GRADIENT,
  },
} as const;

export type HeroVariant = keyof typeof HERO_VARIANTS;
