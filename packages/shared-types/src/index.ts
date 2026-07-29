/**
 * Shared DTOs and Zod schemas — the single source of truth typing both
 * the frontend and the backend (see docs/backend-plan.md).
 *
 * Consumed as TypeScript source (no build step): apps bundle it via
 * their own toolchain (Vite / tsup).
 */

export { healthResponseSchema, type HealthResponse } from "./health";
