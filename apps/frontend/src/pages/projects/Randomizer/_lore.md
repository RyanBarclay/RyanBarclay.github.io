# Randomizer Layer

## Purpose
This directory implements a multi-set randomizer tool: users build named sets of items, toggle sets and items on/off, and press a button to get one random pick per enabled set. It is self-contained — state management, file I/O, types, and UI all live here. The tool is purely ephemeral: there is no persistence (no localStorage, no backend). All state is lost on page refresh. This is intentional — the tool is designed for lightweight, session-scoped use.

## Files in this Layer
- `Randomizer.tsx` — Top-level page component and primary UI: wraps `RandomizerContent` inside `RandomizerProvider`, renders the set accordion list, action buttons, results card, file I/O controls, and the floating randomize FAB.
- `RandomizerContext.tsx` — State layer: `RandomizerProvider` holds the `sets: ItemSet[]` array in React state and exposes CRUD operations plus `randomizeSelections()` and `importSet()` via context.
- `fileUtils.ts` — File I/O utilities: `parseSetFile` reads a plain-text format into an `ItemSet`, `setToFileContent` serialises back, `downloadSet` triggers a browser download.
- `types.ts` — Type definitions: `Item` (`{ name, enabled }`) and `ItemSet` (`{ name, enabled, items[] }`).

## Key Patterns & Contracts

**State ownership**: `RandomizerContext` is the single owner of all `ItemSet[]` state. `Randomizer.tsx` holds only transient UI state (which dialog is open, the current randomization results). Results from `randomizeSelections()` are returned as a value and stored in local component state — they are not persisted back into the context. Showing results is view-only.

**Name-as-key**: Sets and items are keyed by their `name` string, not by a generated ID. All CRUD operations in `RandomizerContext` look up by name (`sets.find(s => s.name === name)`). This means renaming is a two-step patch (find by old name, apply `{ name: newName }`) and duplicate names are explicitly blocked with `alert()`. This is intentional simplicity — it avoids generating IDs for a tool that doesn't persist data.

**`enabled` at both levels**: Both `ItemSet` and `Item` have an `enabled` boolean. `randomizeSelections()` filters to enabled sets, then filters to enabled items within each set. A set being disabled excludes it entirely from results. A set being enabled but having zero enabled items returns `{ selectedItem: null }` — this is surfaced in the UI as "No enabled items in this set". This is intentional behaviour, not a bug.

**Import replaces by name**: `importSet` in the context replaces an existing set if the imported file's set name matches an existing set name. This is a deliberate "upsert" — useful for refreshing a set from a file without having to delete it first.

**File format (plain text)**:
```
Set Name
- Item One
- Item Two
- Item Three
```
Line 1 is the set name. Subsequent lines starting with `- ` are items. Enabled state is not serialised — all imported items default to enabled. This format is human-editable in any text editor, which was the design goal over a JSON format.

**Dialog reuse pattern**: `EditDialog` is reused for four distinct operations (create set, edit set, create item, edit item) by varying its `title` and `initialName` props. The consumer (`Randomizer.tsx`) manages which dialog is "open" via four separate state variables, each null when closed. This avoids building four separate dialog components for structurally identical interactions.

**FAB visibility**: The floating randomize button uses MUI `Zoom` and is only visible (`in={sets.filter(s => s.enabled).length > 0}`) when at least one set is enabled. This prevents the confusing state of clicking randomize with nothing to randomize.

**No persistence — intentional**: There is no `localStorage` read/write. If persistence is added in the future, it belongs in `RandomizerContext` (in the `useState` initialiser and a `useEffect` write-back), not scattered across the UI components.

## What Belongs Here
All state, logic, types, file I/O, and UI components specific to the Randomizer tool — nothing here is imported outside this directory except by `src/config/projectRoutes.tsx` (which imports the root `Randomizer` component).
