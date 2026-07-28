import posthog from "posthog-js";

/**
 * PostHog product analytics — FE-direct topology per docs/backend-plan.md.
 *
 * Config comes from the COMMITTED .env file (VITE_POSTHOG_*): the project
 * key (phc_…) is a write-only ingest key that is public by design — it can
 * capture events and read feature flags, nothing else. Private keys
 * (phx_…) must never appear in frontend code or in .env.
 *
 * A missing/empty key disables analytics entirely (all helpers no-op),
 * so forks work without a PostHog project.
 *
 * Usage protection: analytics only runs in PRODUCTION builds — `npm run
 * dev` never sends events, so local development can't eat the free-tier
 * quota or pollute the data. To verify events end-to-end before a deploy,
 * use `npm run preview` (a production build served locally) as a
 * deliberate, one-off action.
 */
export const POSTHOG_KEY: string =
  import.meta.env.VITE_POSTHOG_PROJECT_TOKEN ?? "";
const POSTHOG_HOST: string =
  import.meta.env.VITE_POSTHOG_HOST ?? "https://us.i.posthog.com";

export const analyticsEnabled = (): boolean =>
  POSTHOG_KEY.length > 0 && import.meta.env.PROD;

export const initAnalytics = (): void => {
  if (!analyticsEnabled()) return;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // Pin PostHog's recommended settings baseline (newest available in
    // the installed SDK); the explicit options below still override
    // anything in the bundle.
    defaults: "2026-06-25",
    // HashRouter SPA: pageviews are captured manually on route change
    // (see AnalyticsPageviews in App.tsx) so every virtual navigation
    // counts exactly once — this deliberately overrides the defaults
    // bundle's history_change auto-capture.
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    // Error Tracking: capture unhandled FE exceptions (BE errors go to
    // GCP Error Reporting — see docs/backend-plan.md observability split).
    capture_exceptions: true,
    // Session Replay is on in the FE-direct topology (revisit before any
    // proxy adoption — replay payloads would eat proxy egress). Masking
    // is mandatory: the calculator takes personal financial numbers,
    // which must never appear in recordings.
    session_recording: {
      maskAllInputs: true,
    },
  });
};

/**
 * Manual SPA pageview — fired on every route change, including the first.
 *
 * HashRouter gotcha: window.location.pathname is ALWAYS "/" on this site,
 * so PostHog's derived $pathname would collapse every page into one. We
 * override $pathname with the React Router path so Web Analytics breaks
 * pages down correctly.
 */
export const capturePageview = (path: string): void => {
  if (!analyticsEnabled()) return;
  posthog.capture("$pageview", {
    $current_url: window.location.href,
    $pathname: path,
  });
};

/**
 * Named product events — use where autocapture is too generic to build
 * readable funnels (intent moments, not every click).
 */
export const captureEvent = (
  name: string,
  properties?: Record<string, unknown>
): void => {
  if (!analyticsEnabled()) return;
  posthog.capture(name, properties);
};
