import { Hono } from "hono";
import { cors } from "hono/cors";
import { healthResponseSchema } from "@repo/shared-types";
import { logger } from "./logger";

/**
 * The origins allowed to call this API from a browser. CORS is not a
 * security boundary (the API is public); this just keeps arbitrary
 * sites from embedding calls to it. localhost entries cover local
 * frontend dev/preview against a local or deployed backend.
 */
const ALLOWED_ORIGINS = [
  "https://ryanbarclay.ca",
  "http://localhost:5173",
  "http://localhost:4173",
];

export const app = new Hono();

app.use("*", cors({ origin: ALLOWED_ORIGINS }));

/**
 * Health check — also the target of the frontend's warm-up ping, which
 * starts this container while a visitor is still reading the hero
 * section (see apps/backend/_lore.md cold-start strategy).
 *
 * The response is parsed through the shared schema — the reference
 * pattern for all future endpoints: responses conform to
 * @repo/shared-types by construction, not by convention.
 */
app.get("/health", (c) => c.json(healthResponseSchema.parse({ status: "ok" })));

app.notFound((c) => {
  logger.info("not_found", { path: c.req.path });
  return c.json({ error: "not found" }, 404);
});

app.onError((err, c) => {
  logger.error("unhandled_error", {
    path: c.req.path,
    error: err.message,
    stack: err.stack,
  });
  return c.json({ error: "internal error" }, 500);
});
