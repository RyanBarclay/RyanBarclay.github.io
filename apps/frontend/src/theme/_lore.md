# theme/ Layer

## Purpose
This layer owns the complete MUI theme definition for the application — both dark and light variants — plus the custom font declaration. It is the canonical location for all design tokens: color palette, typography scale, border radius, shadow ramp, component overrides, and custom palette extensions. Every visual decision that spans more than one component should be expressed as a theme token here rather than as an inline `sx` value.

## Files in this Layer
- `theme.tsx` — Defines `darkTheme` and `lightTheme` via MUI's `createTheme`, sharing a `sharedTheme` base for non-color tokens; also contains module augmentation declarations for custom palette namespaces.
- `fonts.css` — Declares the `GreatForest` display font via `@font-face` pointing to `/GreatForest.woff2` in the public directory; imported by `theme.tsx` so it loads whenever the theme is consumed.

## Key Patterns & Contracts

- **`sharedTheme` for non-color tokens**: All tokens that do not change between dark and light mode (typography, border radius, shadows, component overrides, transitions) live in `sharedTheme` and are spread into both theme variants. Only the `palette` differs per variant.
- **BC nature color palette**: Colors are semantically named after BC geography — "BC teal" primary, "BC sunset" secondary, "Autumn Red Maple" error, "Golden Larch" warning, "Mountain Lake Blue" info, "Spring Meadow" success. This is intentional branding, not arbitrary color picking.
- **Module augmentation for custom tokens**: The `declare module "@mui/material/styles"` block extends `Palette` with `gradient`, `overlay`, `ui`, and `social` namespaces, and extends `Duration` with a `slow` value. This gives TypeScript type safety when accessing `theme.palette.gradient.forest` in `sx` props without any casting.
- **Custom `Chip` variant**: A `technology` variant is declared via `ChipPropsVariantOverrides` augmentation and implemented in `sharedTheme.components.MuiChip.variants`. Use `<Chip variant="technology" />` to render tags with primary color fill.
- **12px base font size**: `typography.fontSize: 12` is intentional — it produces a compact UI where MUI's `rem`-based scale renders smaller than the browser default. Do not "fix" this to 14 or 16.
- **`GreatForest` font for display headings only**: `h1` and `h2` use `GreatForest`; `h3`–`h6` use the BC Sans / system stack. `GreatForest` is a display face — it degrades gracefully to `sans-serif` while the font loads (`font-display: swap`).
- **Card hover animation is theme-level**: The `translateY(-4px)` lift and shadow increase on `MuiCard` hover is defined in `sharedTheme.components.MuiCard`, not in individual card components. All MUI `Card` elements get this behavior automatically.
- **Shadow ramp replaces MUI defaults**: The full 25-level shadow array is overridden with custom values that use `rgba(0,0,0)` with increasing opacity and spread. The original MUI shadows are gone entirely.

## What Belongs Here
Design tokens, palette definitions, typography scale, component default props and style overrides, and custom MUI type augmentations. Do not put component logic, data, or layout decisions here.
