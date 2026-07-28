import { useEffect, useLayoutEffect, useRef } from "react";
import { Box, alpha, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import componentLinkInfo from "../../config/routes";
import { GLASS_BORDER } from "../../config/constants";

/**
 * CompassNav — the mobile bottom navigation "compass".
 *
 * A squat squircle pill fixed to the bottom of the viewport. Nav
 * options scrub HORIZONTALLY through a center detent (the active
 * slot); there is deliberately no vertical gesture, so the browser's
 * own bottom-edge gestures are never contested.
 *
 * Physics: a small underdamped spring (rubber-band feel with a slight
 * overshoot) integrated in a rAF loop, with resistance past the two
 * ends. Frame styles are written imperatively to the DOM — React
 * renders the slots once and never re-renders per frame.
 *
 * Commit logic is decoupled from scrubbing: moving the pill never
 * navigates. On release the pill springs to the nearest detent
 * (fling-aware) and commits ~100ms after settling — a lift is a
 * confident signal. While the finger is still down, only a long dwell
 * (~1.5s) on a detent commits, so flick-throughs never mount pages.
 */

const OPTIONS = Object.values(componentLinkInfo).map(({ to, label }) => ({
  to,
  label,
}));
const MAX_INDEX = OPTIONS.length - 1;

const SLOT_WIDTH = 92;
const BAR_HEIGHT = 56;
/** The centered label scales up — wide enough to clear a thumb. */
const CENTER_SCALE = 1.18;
/** Lift on a detent = confident intent: commit fast. */
const RELEASE_COMMIT_MS = 100;
/** Finger still down: they may keep scrubbing — wait much longer. */
const DWELL_COMMIT_MS = 1500;
/** How close to a detent counts as "on" it for dwell commits. */
const DETENT_EPSILON = 0.12;
// Under critical damping (2·√k ≈ 26) → a small, alive overshoot.
const SPRING_STIFFNESS = 170;
const SPRING_DAMPING = 18;
/** Dragging past the ends moves the strip at 30% — rubber banding. */
const END_RESISTANCE = 0.3;
const HINT_STORAGE_KEY = "compass-hint-played";

/** Best nav index for a pathname (project pages count as Projects). */
const routeIndexFor = (pathname: string): number => {
  const exact = OPTIONS.findIndex((o) => o.to === pathname);
  if (exact !== -1) return exact;
  const prefix = OPTIONS.findIndex(
    (o) => o.to !== "/" && pathname.startsWith(o.to)
  );
  return prefix !== -1 ? prefix : 0;
};

const CompassNav = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const barRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // All physics state lives in one mutable ref — never React state, so
  // the 60fps loop can't cause re-renders.
  const s = useRef({
    x: 0,
    v: 0,
    target: null as number | null,
    dragging: false,
    releaseCommit: false,
    hintQueue: [] as number[],
    dragStartX: 0,
    dragStartPos: 0,
    lastMoveX: 0,
    lastMoveT: 0,
    tapCandidate: false,
    centerOffset: 0,
    raf: null as number | null,
    lastTick: 0,
    commitTimer: null as number | null,
    dwellTimer: null as number | null,
  }).current;

  const colors = useRef({ active: "", inactive: "" });
  colors.current = {
    active: theme.palette.primary.main,
    inactive: theme.palette.text.secondary,
  };

  const pathnameRef = useRef(location.pathname);
  pathnameRef.current = location.pathname;

  const apply = () => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translate3d(${
      s.centerOffset - s.x * SLOT_WIDTH
    }px, 0, 0)`;
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const d = Math.min(Math.abs(i - s.x), 1.5);
      const scale = CENTER_SCALE - (CENTER_SCALE - 1) * Math.min(d, 1);
      el.style.transform = `scale(${scale})`;
      el.style.opacity = String(1 - 0.55 * (d / 1.5));
      el.style.color = d < 0.5 ? colors.current.active : colors.current.inactive;
    });
  };

  const commit = (index: number) => {
    const to = OPTIONS[index]?.to;
    if (to && to !== pathnameRef.current) navigate(to);
  };

  const clearTimer = (key: "commitTimer" | "dwellTimer") => {
    if (s[key] !== null) {
      window.clearTimeout(s[key] as number);
      s[key] = null;
    }
  };

  const onSettle = (settledAt: number) => {
    if (s.hintQueue.length > 0) {
      s.target = s.hintQueue.shift() as number;
      kick();
      return;
    }
    if (s.releaseCommit && Number.isInteger(settledAt)) {
      s.releaseCommit = false;
      clearTimer("commitTimer");
      s.commitTimer = window.setTimeout(
        () => commit(settledAt),
        RELEASE_COMMIT_MS
      );
    }
  };

  const tick = (now: number) => {
    const dt = Math.min((now - s.lastTick) / 1000, 0.032);
    s.lastTick = now;
    if (s.target !== null && !s.dragging) {
      s.v += (-SPRING_STIFFNESS * (s.x - s.target) - SPRING_DAMPING * s.v) * dt;
      s.x += s.v * dt;
      if (Math.abs(s.x - s.target) < 0.002 && Math.abs(s.v) < 0.02) {
        const settledAt = s.target;
        s.x = settledAt;
        s.v = 0;
        s.target = null;
        apply();
        onSettle(settledAt);
      } else {
        apply();
      }
    }
    s.raf = s.target !== null ? requestAnimationFrame(tick) : null;
  };

  const kick = () => {
    if (s.raf === null) {
      s.lastTick = performance.now();
      s.raf = requestAnimationFrame(tick);
    }
  };

  const armDwell = () => {
    clearTimer("dwellTimer");
    s.dwellTimer = window.setTimeout(() => {
      const nearest = Math.round(s.x);
      if (s.dragging && Math.abs(s.x - nearest) < DETENT_EPSILON) {
        commit(Math.min(Math.max(nearest, 0), MAX_INDEX));
      }
    }, DWELL_COMMIT_MS);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    try {
      barRef.current?.setPointerCapture(e.pointerId);
    } catch {
      // Synthetic events (tests) can lack an active pointer — harmless.
    }
    s.dragging = true;
    s.target = null;
    s.hintQueue = [];
    s.releaseCommit = false;
    s.v = 0;
    s.dragStartX = e.clientX;
    s.dragStartPos = s.x;
    s.lastMoveX = e.clientX;
    s.lastMoveT = performance.now();
    s.tapCandidate = true;
    clearTimer("commitTimer");
    armDwell();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!s.dragging) return;
    const raw = s.dragStartPos + (s.dragStartX - e.clientX) / SLOT_WIDTH;
    let next = raw;
    if (raw < 0) next = raw * END_RESISTANCE;
    else if (raw > MAX_INDEX)
      next = MAX_INDEX + (raw - MAX_INDEX) * END_RESISTANCE;

    const now = performance.now();
    const dt = (now - s.lastMoveT) / 1000;
    if (dt > 0) {
      // Exponential smoothing — a single 60fps sample is far too noisy
      // to trust for fling detection.
      const instant = (next - s.x) / dt;
      s.v = 0.7 * instant + 0.3 * s.v;
    }
    s.lastMoveT = now;
    s.x = next;

    if (Math.abs(e.clientX - s.dragStartX) > 6) s.tapCandidate = false;
    armDwell();
    apply();
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!s.dragging) return;
    s.dragging = false;
    clearTimer("dwellTimer");

    let target: number;
    if (s.tapCandidate && barRef.current) {
      // A tap on a visible neighbor scrubs to it.
      const rect = barRef.current.getBoundingClientRect();
      const barCenter = rect.left + rect.width / 2;
      target = Math.round(s.x + (e.clientX - barCenter) / SLOT_WIDTH);
    } else {
      // A flick advances at most ONE extra slot past where the finger
      // left off — with four options, skipping further feels twitchy.
      const flick =
        Math.abs(s.v) > 3 ? Math.sign(s.v) : 0;
      target = Math.round(s.x) + flick;
    }
    s.target = Math.min(Math.max(target, 0), MAX_INDEX);
    s.releaseCommit = true;
    kick();
  };

  // Measure the bar so the active slot sits dead center.
  useLayoutEffect(() => {
    const measure = () => {
      s.centerOffset = (barRef.current?.offsetWidth ?? 0) / 2 - SLOT_WIDTH / 2;
      apply();
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Follow route changes (hamburger menu, links, back button) unless
  // the user is mid-gesture.
  useEffect(() => {
    const idx = routeIndexFor(location.pathname);
    if (!s.dragging && s.target === null && s.hintQueue.length === 0) {
      s.x = idx;
      s.v = 0;
      apply();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, theme.palette.mode]);

  // One-time discoverability nudge: the options shift once so the eye
  // registers a horizontal scrubber. Never replays; skipped for
  // reduced-motion users; cancelled by any interaction.
  useEffect(() => {
    let played = true;
    try {
      played = Boolean(window.localStorage.getItem(HINT_STORAGE_KEY));
    } catch {
      played = true;
    }
    if (played) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(HINT_STORAGE_KEY, "1");
      } catch {
        // Best-effort — the hint may replay in private mode.
      }
      if (s.dragging) return;
      const idx = routeIndexFor(pathnameRef.current);
      s.hintQueue = [Math.max(idx - 0.4, -0.2), idx];
      s.target = Math.min(idx + 0.4, MAX_INDEX + 0.2);
      kick();
    }, 900);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The hamburger doesn't open a second menu — it asks the compass to
  // sweep every option through the center, teaching the swipe.
  useEffect(() => {
    const sweep = () => {
      if (s.dragging) return;
      const idx = routeIndexFor(pathnameRef.current);
      s.releaseCommit = false;
      s.hintQueue = [0, idx];
      s.target = MAX_INDEX;
      kick();
    };
    window.addEventListener("compass:sweep", sweep);
    return () => window.removeEventListener("compass:sweep", sweep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup timers and the rAF loop.
  useEffect(
    () => () => {
      if (s.raf !== null) cancelAnimationFrame(s.raf);
      clearTimer("commitTimer");
      clearTimer("dwellTimer");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Box
      ref={barRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      sx={{
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        bottom: "calc(12px + env(safe-area-inset-bottom))",
        zIndex: theme.zIndex.appBar,
        width: "min(calc(100vw - 24px), 344px)",
        height: BAR_HEIGHT,
        // Squircle: between a rounded rect and a stadium pill.
        borderRadius: "24px",
        backgroundColor: alpha(theme.palette.background.paper, 0.85),
        backdropFilter: "blur(20px) saturate(180%)",
        border: GLASS_BORDER,
        boxShadow: 6,
        touchAction: "none",
        userSelect: "none",
        cursor: "grab",
        "&:active": { cursor: "grabbing" },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          borderRadius: "inherit",
          maskImage:
            "linear-gradient(to right, transparent, black 18%, black 82%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 18%, black 82%, transparent)",
        }}
      >
        <Box
          ref={trackRef}
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            display: "flex",
            willChange: "transform",
          }}
        >
          {OPTIONS.map((option, i) => (
            <Box
              key={option.to}
              ref={(el: HTMLDivElement | null) => {
                itemRefs.current[i] = el;
              }}
              sx={{
                width: SLOT_WIDTH,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.95rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
                willChange: "transform, opacity",
              }}
            >
              {option.label}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CompassNav;
