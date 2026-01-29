/**
 * useAnimationLoop - Animation control hook for terrain morphing
 * 
 * Manages requestAnimationFrame-based animation loop that increments
 * the time parameter for procedural terrain evolution.
 * 
 * Features:
 * - Delta time calculation for consistent speed
 * - Play/pause/reset controls
 * - Speed adjustment multiplier
 * - Proper cleanup with cancelAnimationFrame
 * 
 * @module hooks/useAnimationLoop
 */

import { useEffect, useRef, useState } from 'react';
import { useTerrainContext } from '../context/TerrainContext';

interface UseAnimationLoopOptions {
  speed?: number;        // Animation speed multiplier (default: 1)
  enabled?: boolean;     // Enable/disable animation (default: false)
}

interface UseAnimationLoopReturn {
  isPlaying: boolean;
  currentTime: number;
  play: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
}

/**
 * Hook for animating terrain by incrementing time parameter
 * 
 * @param options - Animation configuration
 * @returns Animation controls
 * 
 * @example
 * const { isPlaying, play, pause, reset } = useAnimationLoop({
 *   speed: 1,
 *   enabled: true
 * });
 */
export function useAnimationLoop(
  options: UseAnimationLoopOptions = {}
): UseAnimationLoopReturn {
  const { speed = 1, enabled = false } = options;
  const { config, updateConfig } = useTerrainContext();
  
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());
  const [isPlaying, setIsPlaying] = useState<boolean>(enabled);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      if (!isPlaying) return;

      const now = Date.now();
      const delta = (now - lastTimeRef.current) / 1000; // Convert to seconds
      lastTimeRef.current = now;

      // Increment animation time
      const newTime = (config.animation?.time || 0) + delta * speed;
      
      updateConfig({
        animation: {
          ...config.animation,
          enabled: true,
          speed,
          time: newTime
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      lastTimeRef.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, speed, config.animation?.time, updateConfig]);

  const play = () => {
    setIsPlaying(true);
    lastTimeRef.current = Date.now();
  };

  const pause = () => {
    setIsPlaying(false);
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const reset = () => {
    pause();
    updateConfig({
      animation: {
        ...config.animation,
        time: 0
      }
    });
  };

  const setSpeed = (newSpeed: number) => {
    updateConfig({
      animation: {
        ...config.animation,
        speed: newSpeed
      }
    });
  };

  return {
    isPlaying: isPlaying,
    currentTime: config.animation?.time || 0,
    play,
    pause,
    reset,
    setSpeed
  };
}
