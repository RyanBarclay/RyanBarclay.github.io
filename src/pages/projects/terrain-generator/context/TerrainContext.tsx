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
  size: 256,
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

  // Water
  water: {
    enabled: false,
    level: 10,
    opacity: 0.6,
  },
};

/**
 * Context state interface
 */
interface TerrainContextValue {
  config: TerrainConfig;
  pendingConfig: TerrainConfig; // Draft config for sliders - not applied until Generate
  updateConfig: (partial: Partial<TerrainConfig>) => void;
  updatePendingConfig: (partial: Partial<TerrainConfig>) => void;
  applyPendingConfig: () => void; // Commit pending changes to config
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
  const [pendingConfig, setPendingConfig] =
    useState<TerrainConfig>(DEFAULT_CONFIG);
  const [heightmap, setHeightmap] = useState<HeightmapData | null>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [regenerationKey, setRegenerationKey] = useState(0);

  /**
   * Update PENDING configuration with partial values
   * This is for slider changes that don't immediately affect the terrain
   */
  const updatePendingConfig = useCallback((partial: Partial<TerrainConfig>) => {
    setPendingConfig((prev) => {
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
      // Deep merge water config if provided
      if (partial.water && prev.water) {
        return {
          ...prev,
          ...partial,
          water: {
            ...prev.water,
            ...partial.water,
          },
        };
      }
      return { ...prev, ...partial };
    });
  }, []);

  /**
   * Commit pending config to actual config
   * Called when "Generate" button is clicked
   */
  const applyPendingConfig = useCallback(() => {
    setConfig(pendingConfig);
  }, [pendingConfig]);

  /**
   * Update configuration with partial values (direct update - for immediate changes)
   * This should only be used for visual settings like wireframe
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
    const newConfig = {
      ...DEFAULT_CONFIG,
      seed: Date.now().toString(), // Generate new seed on reset
    };
    setConfig(newConfig);
    setPendingConfig(newConfig);
    setHeightmap(null);
    setRegenerationKey((prev) => prev + 1);
  }, []);

  /**
   * Apply preset configuration
   * Updates both pending and actual config, then triggers regeneration
   */
  const applyPreset = useCallback((preset: TerrainPreset) => {
    const newConfig = (prev: TerrainConfig) => ({
      ...prev,
      preset,
      // Preset-specific noise parameters will be applied later
      // when presets.ts is implemented in Phase A Sequential
    });
    setConfig(newConfig);
    setPendingConfig(newConfig);
    setRegenerationKey((prev) => prev + 1);
  }, []);

  /**
   * Trigger terrain regeneration
   * Applies pending config and triggers generation
   */
  const generateTerrain = useCallback(() => {
    // Apply pending config before generating
    setConfig(pendingConfig);

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
  }, [geometry, pendingConfig]);

  const value: TerrainContextValue = {
    config,
    pendingConfig,
    updateConfig,
    updatePendingConfig,
    applyPendingConfig,
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
