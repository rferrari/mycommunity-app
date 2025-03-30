import { LoadingEffect } from './types';
import { matrixEffect } from './MatrixRain';
import { skateEffect } from './SkateEffect';
import { videoEffect } from './VideoEffect';

const effects: Record<string, LoadingEffect> = {
  matrix: matrixEffect,
  skate: skateEffect,
  video: videoEffect,
  // Add more effects here
};

export function getLoadingEffect(effectId: string): LoadingEffect {
  return effects[effectId] || effects.matrix; // Default to matrix effect
}