# components/controls Layer

## Purpose
This layer renders the interactive control panel for terrain parameters. It owns all user-facing input widgets — sliders, toggles, preset buttons, playback controls — and is responsible for writing user intent into `pendingConfig` in context. No control here triggers terrain regeneration directly; that responsibility belongs exclusively to the "Generate Terrain" button in `ControlPanel`.

## Files in this Layer
- `ControlPanel.tsx` — Root container: accordion layout, wireframe/stats toggles, the sticky "Generate Terrain" button, and responsive behavior (sidebar on desktop, bottom drawer on mobile)
- `TerrainParameters.tsx` — Size, height scale, and seed controls; uses local state to prevent slider lag
- `NoiseSettings.tsx` — Octaves, persistence, lacunarity, and frequency sliders
- `WaterControls.tsx` — Water enable/disable, level, and opacity sliders
- `AnimationControls.tsx` — Play/pause/reset buttons and speed slider; the only control that calls `updateConfig` (not `updatePendingConfig`) for playback state
- `PresetSelector.tsx` — 2×2 grid of preset buttons that bulk-update noise parameters via `getPresetConfig`

## Key Patterns & Contracts

**All controls write to `pendingConfig`, not `config`.** The contract between this layer and context is: sliders and inputs call `updatePendingConfig`. The committed `config` (which actually drives terrain generation) is only updated when `ControlPanel.handleGenerate` fires. This prevents expensive regeneration on every slider tick.

**Exception: animation playback and wireframe are immediate.** `AnimationControls.togglePlayback` calls `updateConfig` (committed) because animation playback should start/stop without requiring a "Generate" click. Similarly, the wireframe switch in `ControlPanel` calls `updateConfig` directly. These are the only two cases where controls bypass the pending/commit pattern.

**Local state in `TerrainParameters` for instant slider feedback.** Size and height scale sliders maintain local `useState` values (`localSize`, `localHeight`) that update on every drag event. These are synced back to `pendingConfig` on the same event, but the displayed value reads from local state to prevent the React-context round-trip from causing visual lag. A `useEffect` syncs local state outward when `pendingConfig` changes externally (preset selection, reset).

**`handleGenerate` in `ControlPanel` passes `pendingConfig` directly.** The call is `generate(pendingConfig)` — not `generate()`. This avoids the stale closure problem where `config` in context may not yet reflect the freshly committed pending values within the same event handler tick.

**`ControlPanel` has two mobile modes.** When rendered standalone on the preview page, it shows a floating `MenuIcon` button and manages its own `Drawer`. When rendered inside the fullscreen `Dialog` from `index.tsx`, it receives `hideToggleButton={true}` and `onClose` — it renders content inline and delegates close behavior to the parent modal.

**Presets overwrite all noise parameters simultaneously.** `PresetSelector.applyPreset` calls `getPresetConfig` and then calls `updatePendingConfig` with all five noise parameters at once (`octaves`, `persistence`, `lacunarity`, `frequency`, `heightScale`). It does not call `generate` — the user still needs to click "Generate Terrain" to see the result.

**Adding a new control parameter.** Add the field to `TerrainConfig` in `types.ts` → initialize it in `TerrainContext.tsx` → consume it in `useTerrainGen.ts` → create a slider/input widget → import it inside `ControlPanel.tsx` as an `<AccordionDetails>` section.

## What Belongs Here
MUI input widgets that read from `pendingConfig` and write back via `updatePendingConfig`. No generation logic, no Three.js, no direct geometry manipulation.
