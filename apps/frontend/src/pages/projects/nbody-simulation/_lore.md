# N-Body Simulation Layer

## Purpose
This directory implements an interactive 3D gravitational n-body simulation using the Barnes-Hut algorithm. It is self-contained: all physics logic, rendering, types, and UI controls live here. The entry point wraps the simulation inside `ProjectDetailLayout` to give it the standard project page chrome (title, tech tags, description sections). The simulation itself runs entirely client-side in the browser using React state and `setInterval` — no workers, no GPU compute.

## Files in this Layer
- `index.tsx` — Page root: composes `ProjectDetailLayout` with static description sections and embeds `NBodySimulation` as `additionalContent`.
- `Simulation.tsx` — Stateful simulation shell: owns particle state, playback controls, file I/O (upload/download JSON), and the parameter bounds UI. Passes particles down to `AnimationViewPort`.
- `AnimationViewPort.tsx` — R3F Canvas host: runs the simulation tick loop via `setInterval`, decouples physics rate (100ms) from render rate (60fps cap), and renders each particle as a `sphereGeometry` mesh.
- `simulationStep.ts` — Pure physics engine: implements the full Barnes-Hut pipeline — octree build, center-of-mass computation, force calculation, and Velocity Verlet integration.
- `nBodyTypes.ts` — Type definitions: `Particle`, `OctalTree`, `BoundingBox`, `Vector3D`, `Point`.

## Key Patterns & Contracts

**Physics pipeline (per tick in `simulationStep.ts`)**:
```
particles[]
  -> octTreeBuild()          // axis-aligned bounding box + recursive octInsert
  -> trimEmptyLeaves()       // prune empty octants
  -> octTreeComputeCenterOfMass()  // bottom-up mass aggregation
  -> update_particles()      // calcForce (Barnes-Hut theta test) + Velocity Verlet
  -> return { particles, boundingBoxes }
```

**Barnes-Hut theta criterion**: In `calcForce`, if `D/r < theta` (where D is the octant width and r is distance to its center of mass), the entire subtree is treated as a single mass. Lower theta = higher accuracy, higher cost. Default theta = 0.1 (aggressive approximation). This is configurable but exposed in `Simulation.tsx` only as a hardcoded `useState(0.1)` — it is not currently wired to any UI slider.

**Decoupled physics/render rates**: `AnimationViewPort` runs physics at a fixed 100ms interval (`dt = 100`). Render updates are gated by a `lastRendered` counter — React state is only pushed to `renderedParticles` when at least one `msPerFrame` (16.67ms) has elapsed since the last render. This prevents physics ticks from over-driving re-renders.

**Particle state split**: `Simulation.tsx` holds two parallel particle arrays: `particles` (the "pristine" set used to restart) and `simulationParticles` (the live evolving set that can be downloaded). `AnimationViewPort` holds its own internal `particles` state that it mutates each tick. When paused, `AnimationViewPort` calls `updateSimulationParticles` to flush its current state back up so the download button in `Simulation.tsx` captures the live positions.

**Particle schema**: `color` is optional on `Particle` to maintain backward compatibility with JSON files uploaded by users that may lack the field. The central body always gets `color: "#000000"`.

**File format for save/load**: Download is a raw JSON serialisation of the `Particle[]` array. Upload validates structure inline (position/velocity x/y/z as numbers, radius, mass required). Colour is not required. Uploading pauses the simulation and replaces both particle arrays.

**`resetKey` pattern**: `regenerateParticles` increments `resetKey`, which is passed as the `key` prop to `AnimationViewPort`. This forces a full React unmount/remount, resetting all internal state and the `setInterval` without any imperative cleanup.

**Known limitation — theta not exposed**: The Barnes-Hut accuracy parameter `theta` is stored in `Simulation.tsx` state but has no UI control. Changing it requires editing code. This is intentional — the UI was kept simple.

**Known limitation — no softening**: `calcForceBetweenParticles` uses raw Newtonian gravity with no softening term (`epsilon`). Particles that pass very close will experience extreme force spikes, which can cause numerical instability at the default dt=100. This is a known trade-off of the implementation; adding softening would require modifying `simulationStep.ts`.

**Known limitation — Velocity Verlet approximation**: The integration in `update_particles` uses an averaged velocity (`(vf + vi) / 2 * dt`) for position update, which is Velocity Verlet. However, forces are not re-evaluated at the half-step; this is a simplification that is stable at small dt but may drift at dt=100.

## What Belongs Here
Physics types, the Barnes-Hut octree engine, R3F rendering, simulation controls, and file I/O — all scoped to this simulation. Nothing here is imported by any other project page.
