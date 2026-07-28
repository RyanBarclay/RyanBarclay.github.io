/**
 * Shared DTOs and Zod schemas — the single source of truth typing both
 * the frontend and the backend (see docs/backend-plan.md).
 *
 * Consumed as TypeScript source (no build step): apps bundle it via
 * their own toolchain (Vite / tsup). Zod arrives with the first real
 * schema in backend Phase 2.
 */

/** Placeholder export until Phase 2 lands the first real schema. */
export const SHARED_TYPES_VERSION = "0.0.0";
