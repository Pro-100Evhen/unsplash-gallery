import { describe, expect, it } from "vitest";
import { registrationSchema } from "./registrationSchema";

const validValues = {
  fullName: "  Ada Lovelace  ",
  email: "  ada@example.com  ",
  password: "password1",
  confirmPassword: "password1",
  terms: true,
};

describe("registrationSchema", () => {
  it("trims identity fields and accepts valid values", () => {
    expect(registrationSchema.parse(validValues)).toMatchObject({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
    });
  });

  it.each([
    ["fullName", { fullName: "A" }],
    ["email", { email: "invalid" }],
    ["password length", { password: "pass1", confirmPassword: "pass1" }],
    ["password letter", { password: "12345678", confirmPassword: "12345678" }],
    ["password number", { password: "password", confirmPassword: "password" }],
    ["terms", { terms: false }],
  ])("rejects invalid %s", (_label, override) => {
    expect(
      registrationSchema.safeParse({ ...validValues, ...override }).success,
    ).toBe(false);
  });

  it("assigns a password mismatch to confirmPassword", () => {
    const result = registrationSchema.safeParse({
      ...validValues,
      confirmPassword: "different1",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({ path: ["confirmPassword"] }),
      );
    }
  });
});
