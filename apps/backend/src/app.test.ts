import { describe, expect, it } from "vitest";
import { healthResponseSchema } from "@repo/shared-types";
import { app } from "./app";

describe("backend app", () => {
  it("responds ok on /health, conforming to the shared schema", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(healthResponseSchema.parse(body)).toEqual({ status: "ok" });
  });

  it("returns JSON 404 for unknown routes", async () => {
    const res = await app.request("/nope");
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "not found" });
  });

  it("allows the production origin via CORS", async () => {
    const res = await app.request("/health", {
      headers: { Origin: "https://ryanbarclay.ca" },
    });
    expect(res.headers.get("access-control-allow-origin")).toBe(
      "https://ryanbarclay.ca"
    );
  });

  it("does not allow arbitrary origins via CORS", async () => {
    const res = await app.request("/health", {
      headers: { Origin: "https://evil.example.com" },
    });
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
  });
});
