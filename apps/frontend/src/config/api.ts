/**
 * Backend API access — the single chokepoint for the base URL (from the
 * committed mode-specific .env files) and the cold-start warm-up.
 */

export const API_URL: string = import.meta.env.VITE_API_URL ?? "";

/**
 * Fire-and-forget warm-up ping (docs/backend-plan.md cold-start
 * strategy): hitting /health the moment a visitor lands starts the
 * scale-to-zero Cloud Run container while they're still reading the
 * hero — any later real API call finds a warm instance.
 *
 * Production-only, like analytics: dev sessions shouldn't require a
 * local backend to be running just to avoid console noise.
 */
export const warmUpBackend = (): void => {
  if (!API_URL || !import.meta.env.PROD) return;
  fetch(`${API_URL}/health`).catch(() => {
    // Warm-up is best-effort; a failure just means the first real API
    // call pays the cold start instead.
  });
};
