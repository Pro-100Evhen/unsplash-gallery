import { describe, expect, it } from "vitest";
import nextConfig from "./next.config";

describe("Next.js security headers", () => {
  it("applies the expected hardening headers to every route", async () => {
    expect(nextConfig.headers).toBeTypeOf("function");

    const rules = await nextConfig.headers!();
    const headers = Object.fromEntries(
      rules
        .flatMap((rule) => rule.headers ?? [])
        .map(({ key, value }) => [key, value]),
    );

    expect(rules).toEqual(
      expect.arrayContaining([expect.objectContaining({ source: "/(.*)" })]),
    );
    expect(headers).toMatchObject({
      "Content-Security-Policy": expect.stringContaining(
        "frame-ancestors 'none'",
      ),
      "Permissions-Policy": expect.stringContaining("camera=()"),
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
    });
  });
});
