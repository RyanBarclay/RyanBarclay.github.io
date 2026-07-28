/**
 * WaterPlane.tsx
 *
 * Semi-transparent water plane that fills low-lying areas of terrain.
 *
 * Features:
 * - Adjustable water level
 * - Animated water surface with subtle wave effect
 * - Semi-transparent blue material
 * - Covers entire terrain area
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTerrainContext } from "../../context/TerrainContext";

/**
 * WaterPlane component
 *
 * Renders a large plane at specified height to simulate water.
 * Uses semi-transparent material with subtle animation.
 */
export default function WaterPlane() {
  const { config } = useTerrainContext();
  const meshRef = useRef<THREE.Mesh>(null);

  // Animate water surface (subtle wave motion)
  useFrame((state) => {
    if (meshRef.current && config.water?.enabled) {
      const time = state.clock.getElapsedTime();
      // Subtle vertical oscillation
      meshRef.current.position.y =
        (config.water?.level || 0) + Math.sin(time * 0.5) * 0.2;
    }
  });

  if (!config.water?.enabled) return null;

  const waterLevel = config.water?.level || 0;
  const waterOpacity = config.water?.opacity || 0.6;
  const terrainSize = config.size;

  return (
    <mesh
      ref={meshRef}
      position={[0, waterLevel, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[terrainSize, terrainSize, 64, 64]} />
      <meshStandardMaterial
        color="#1e90ff"
        transparent
        opacity={waterOpacity}
        side={THREE.FrontSide}
        metalness={0.1}
        roughness={0.1}
        envMapIntensity={1}
      />
    </mesh>
  );
}
