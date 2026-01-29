/**
 * TerrainContext - Global state management for Procedural Terrain Generator
 *
 * Manages:
 * - TerrainConfig state with partial updates
 * - Heightmap data storage
 * - Generation state (loading, error handling)
 * - Terrain regeneration triggers
 *
 * Follows React 19 concurrent features with proper state management patterns
 */

import React, { createContext, useContext, useState, useCallback } from "react";
import * as THREE from "three";
import type { TerrainConfig, TerrainPreset, HeightmapData } from "../types";

/**
 * Default terrain configuration
 */
const DEFAULT_CONFIG: TerrainConfig = {
  // Basic parameters
  size: 128,
  heightScale: 20,
  seed: Date.now().toString(),

  // Noise parameters
  octaves: 4,
  persistence: 0.5,
  lacunarity: 2.0,
  frequency: 1.0,

  // Visual settings
  preset: "mountains",
  colorScheme: "bc-nature",
  wireframe: false,

  // Animation
  animation: {
    enabled: false,
    speed: 1.0,
    time: 0,
  },
};

/**
 * Context state interface
 */
interface TerrainContextValue {
  config: TerrainConfig;
  updateConfig: (partial: Partial<TerrainConfig>) => void;
  resetConfig: () => void;
  applyPreset: (preset: TerrainPreset) => void;

  heightmap: HeightmapData | null;
  setHeightmap: (data: HeightmapData | null) => void;

  geometry: THREE.BufferGeometry | null;
  setGeometry: (geometry: THREE.BufferGeometry | null) => void;

  isGenerating: boolean;
  generateTerrain: () => void;

  regenerationKey: number; // Trigger for terrain regeneration
}

/**
 * Create context with undefined default (requires Provider)
 */
const TerrainContext = createContext<TerrainContextValue | undefined>(
  undefined,
);

/**
 * Provider component props
 */
interface TerrainProviderProps {
  children: React.ReactNode;
}

/**
 * TerrainProvider - Wraps components needing terrain state
 */
export const TerrainProvider: React.FC<TerrainProviderProps> = ({
  children,
}) => {
  const [config, setConfig] = useState<TerrainConfig>(DEFAULT_CONFIG);
  const [heightmap, setHeightmap] = useState<HeightmapData | null>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [regenerationKey, setRegenerationKey] = useState(0);

  /**
   * Update configuration with partial values
   * Merges new values with existing config
   */
  const updateConfig = useCallback((partial: Partial<TerrainConfig>) => {
    setConfig((prev) => {
      // Deep merge animation config if provided
      if (partial.animation && prev.animation) {
        return {
          ...prev,
          ...partial,
          animation: {
            ...prev.animation,
            ...partial.animation,
          },
        };
      }
      return { ...prev, ...partial };
    });
  }, []);

  /**
   * Reset configuration to defaults
   */
  const resetConfig = useCallback(() => {
    setConfig({
      ...DEFAULT_CONFIG,
      seed: Date.now().toString(), // Generate new seed on reset
    });
    setHeightmap(null);
    setRegenerationKey((prev) => prev + 1);
  }, []);

  /**
   * Apply preset configuration
   * Note: Actual preset values will be loaded from utils/noise/presets.ts
   * For now, this updates the preset field and triggers regeneration
   */
  const applyPreset = useCallback((preset: TerrainPreset) => {
    setConfig((prev) => ({
      ...prev,
      preset,
      // Preset-specific noise parameters will be applied later
      // when presets.ts is implemented in Phase A Sequential
    }));
    setRegenerationKey((prev) => prev + 1);
  }, []);

  /**
   * Trigger terrain regeneration
   * Sets loading state and increments regeneration key
   *
   * Performance: Disposes old geometry before creating new terrain
   */
  const generateTerrain = useCallback(() => {
    // Dispose old geometry before regenerating to prevent memory leaks
    if (geometry) {
      geometry.dispose();
      setGeometry(null);
    }

    setIsGenerating(true);
    setRegenerationKey((prev) => prev + 1);

    // Note: Actual generation logic will be implemented in useTerrainGen hook
    // This is a stub that will be connected in Phase B
    setTimeout(() => {
      setIsGenerating(false);
    }, 100);
  }, [geometry]);

  const value: TerrainContextValue = {
    config,
    updateConfig,
    resetConfig,
    applyPreset,
    heightmap,
    geometry,
    setGeometry,
    setHeightmap,
    isGenerating,
    generateTerrain,
    regenerationKey,
  };

  return (
    <TerrainContext.Provider value={value}>{children}</TerrainContext.Provider>
  );
};

/**
 * Custom hook to access TerrainContext
 * Throws error if used outside TerrainProvider
 */
export const useTerrainContext = (): TerrainContextValue => {
  const context = useContext(TerrainContext);

  if (context === undefined) {
    throw new Error("useTerrainContext must be used within a TerrainProvider");
  }

  return context;
};

/**
 * Export context for advanced use cases (testing, debugging)
 */
export { TerrainContext };
