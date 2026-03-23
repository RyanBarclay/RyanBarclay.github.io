/**
 * PerformanceHUDWrapper.tsx
 *
 * Collects R3F scene performance stats inside the Canvas context and stores
 * them in TerrainContext so the overlay can be rendered as a regular DOM element.
 */

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTerrainContext } from "../../context/TerrainContext";

interface PerformanceHUDWrapperProps {
  updateInterval?: number;
}

export default function PerformanceHUDWrapper({
  updateInterval = 30,
}: PerformanceHUDWrapperProps) {
  const { showStats, setPerfStats } = useTerrainContext();
  const { gl } = useThree();

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const framesRef = useRef(0);

  useFrame(() => {
    if (!showStats) return;

    frameCountRef.current++;
    framesRef.current++;

    if (frameCountRef.current % updateInterval !== 0) return;

    const now = Date.now();
    const delta = (now - lastTimeRef.current) / 1000;
    const fps = Math.round(framesRef.current / delta);

    const info = gl.info;
    const memory = info.memory;
    const render = info.render;

    setPerfStats({
      fps,
      triangles: memory.geometries * 1000,
      drawCalls: render.calls,
      memoryUsage: memory.geometries * 0.5 + memory.textures * 2,
      geometries: memory.geometries,
    });

    lastTimeRef.current = now;
    framesRef.current = 0;
  });

  return null;
}
