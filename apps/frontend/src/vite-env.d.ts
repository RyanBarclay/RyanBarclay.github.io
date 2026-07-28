/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** PostHog public write-only ingest key (phc_…) — see .env */
  readonly VITE_POSTHOG_PROJECT_TOKEN?: string;
  readonly VITE_POSTHOG_HOST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
