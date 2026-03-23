# Randomizer Dialogs Layer

## Purpose
This directory holds the modal dialog components used by the Randomizer tool. These are pure presentational components — they own no state beyond their own input fields and surface user intent upward via callbacks. They know nothing about the Randomizer's data model or context; they deal only in strings and booleans.

## Files in this Layer
- `EditDialog.tsx` — A single-field text input dialog reused for creating and renaming both sets and items. Accepts an optional `initialName` to pre-fill the field.
- `ConfirmDeleteDialog.tsx` — A confirmation dialog for destructive delete actions. Displays the name of the set being deleted and exposes Cancel / Delete buttons.

## Key Patterns & Contracts

**Caller controls what "save" means**: Neither dialog calls into `RandomizerContext` directly. `EditDialog` calls `onSave(name: string)` with the trimmed input value, then closes itself. `ConfirmDeleteDialog` calls `onConfirm()`. The parent (`Randomizer.tsx`) wires these callbacks to the appropriate context mutations. This keeps the dialogs reusable and decoupled from data.

**`EditDialog` is used four times**: Create Set, Edit Set, Create Item, Edit Item. The `title` prop distinguishes the dialog header. The `initialName` prop controls whether the field starts empty (create) or pre-filled (edit). When `initialName` changes (i.e., a different item is selected for editing), a `useEffect` syncs the internal `name` state — this handles the case where the dialog stays mounted but its target changes between openings.

**Input state is local and ephemeral**: `EditDialog` holds `name` in local `useState`. On save, it calls `onSave`, then resets `name` to `""`. This ensures the field is blank the next time the dialog opens for a create operation. The reset-on-save is necessary because MUI dialogs do not unmount by default between open/close cycles.

**Save is blocked on empty input**: `EditDialog` disables the Save button when `name.trim()` is falsy and guards the `handleSave` function with the same check. Names consisting only of whitespace are rejected. Duplicate-name validation is enforced by the context layer (`RandomizerContext`), not here.

**`ConfirmDeleteDialog` is set-scoped only**: The current implementation only confirms set deletion (it receives `setName: string` as a prop). Item deletion in `Randomizer.tsx` is performed inline without a confirmation dialog — the delete icon button calls `removeItem` directly. This asymmetry is intentional: sets contain multiple items and are harder to recreate, so they warrant a confirmation gate.

**No context access**: Neither dialog imports `useRandomizer` or touches `RandomizerContext`. If a future dialog needs to perform a lookup (e.g., validate a name against existing sets before saving), that logic should live in the parent and be passed down as a prop, not accessed directly from context inside the dialog.

## What Belongs Here
Self-contained modal dialog components that collect a single string from the user or confirm a destructive action — no data fetching, no context reads, no business logic.
