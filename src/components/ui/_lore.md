# UI Layer

## Purpose
This layer owns leaf-level presentational components that are shared across pages. Each component is self-contained and stateless (or manages only local display state). They accept props, render markup, and expose no side effects beyond navigation. Pages and feature layers compose these components rather than duplicating markup.

## Files in this Layer
- `Hero.tsx` — full-viewport landing section with a parallax video background, rAF-throttled scroll handler, poster-image pre-load, and CTA buttons linking to `/projects` and `/about`
- `ProjectCard.tsx` — MUI Card with hover zoom/gradient overlay, technology chip list, optional tag badge, and whole-card click navigation via `useNavigation`
- `PageHero.tsx` — shorter (30–40 vh) banner for interior pages; accepts a `variant` key or explicit image/gradient overrides; no scroll or video logic
- `SectionHeader.tsx` — centered `h3` with a primary-color bottom border underline and optional subtitle; used to introduce content sections on listing pages
- `FeatureIconBox.tsx` — icon + title + body text block with a tinted square icon container; used for feature/skill grids on the About page
- `ThemeButton.tsx` — styled MUI `Switch` component that toggles dark/light mode; SVG icons baked into the thumb via data URIs

## Key Patterns & Contracts

### Hero parallax and performance
`Hero` registers a `scroll` listener with `{ passive: true }` and gates every state update behind `requestAnimationFrame` using a stored `rafRef`. This prevents layout thrashing — the scroll event fires at whatever rate the browser delivers, but `setScrollY` only runs once per animation frame. The parallax shift is applied as `translate3d(0, ${scrollY * 0.3}px, 0)` on a container marked `willChange: transform`, which promotes it to its own compositor layer and keeps the animation off the main thread.

The video wrapper is 120% tall (not 100%) to give the parallax movement room without revealing the container edge. The poster image sits absolutely positioned behind the video element and fades to opacity 0 once `onCanPlay` fires — this prevents a flash of empty background on slow connections.

### Hero height compensation
`Hero` sets `marginTop: -${NAVBAR_HEIGHT_WITH_PADDING}px` and `paddingTop: ${NAVBAR_HEIGHT}px` on its root box. This makes the section genuinely full-viewport (100vh) while ensuring the text content starts below the fixed Navbar. The difference between `NAVBAR_HEIGHT` (64 px) and `NAVBAR_HEIGHT_WITH_PADDING` (80 px) is intentional: the margin pulls the section up to fill behind the bar, and the smaller padding only offsets the content, not the full bleed. Any change to navbar height requires updating both constants.

### ProjectCard navigation contract
Card click is routed through `useNavigation` from `src/hooks/useNavigation.ts`. That hook returns a handler that opens `http*` URLs in a new tab (`noopener,noreferrer`) and calls React Router `navigate()` for internal paths. The `detailPage` prop is typed as `NavigationUrl` (`ExternalLink | InternalPath`), so TypeScript enforces valid URL shapes at the call site. If `detailPage` is falsy the cursor becomes `default` and clicks are no-ops.

### PageHero variant system
Variants (`default`, `project`, `dark`) are defined as a `const` object in `src/config/constants.ts` (`HERO_VARIANTS`). `PageHero` resolves the variant config first and then applies any explicit `backgroundImage` or `gradientOverlay` props as overrides. This means callers can use a named variant as a base and still customize either layer independently without rewriting both values.

### ThemeButton implementation detail
The sun and moon SVGs are embedded as `data:image/svg+xml;utf8,...` strings directly in the styled component rather than imported as files. This avoids a separate asset fetch and keeps the toggle self-contained. The thumb and track colors reference custom palette tokens (`theme.palette.ui.switchTrack`, `theme.palette.ui.switchThumbDark`, `theme.palette.ui.switchThumbLight`) defined in `src/theme/theme.tsx` — changing the toggle appearance requires editing the theme, not this component.

### What these components do not own
- No components in this layer fetch data or subscribe to contexts except `Hero.tsx` (reads `ThemeContext` for `isDarkTheme`) and `ThemeButton.tsx` (receives theme state as props from `Navbar`)
- No routing logic beyond delegating to `useNavigation`
- No animation libraries — all motion is CSS keyframes or MUI transitions

## What Belongs Here
Reusable presentational components that are used on more than one page, contain no feature-specific business logic, and whose entire interface is expressed through props — not page-specific panels, project-specific controls, or components that only appear in one place.
