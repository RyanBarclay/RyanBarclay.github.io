import { serve } from "@hono/node-server";
import { app } from "./app";
import { logger } from "./logger";

// Cloud Run injects PORT; 8080 is its default and our local convention.
const port = Number(process.env.PORT ?? 8080);

serve({ fetch: app.fetch, port }, (info) => {
  logger.info("server_started", { port: info.port });
});
