import { z } from "zod";

/**
 * Health-check response — the first shared schema, and the reference
 * pattern for every schema after it: the backend validates its response
 * against it, and the frontend's warm-up ping can parse with it.
 */
export const healthResponseSchema = z.object({
  status: z.literal("ok"),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
