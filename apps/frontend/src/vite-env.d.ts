/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** PostHog public write-only ingest key (phc_…) — see .env */
  readonly VITE_POSTHOG_PROJECT_TOKEN?: string;
  readonly VITE_POSTHOG_HOST?: string;
  /** Backend base URL — see .env.development / .env.production */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
