import { describe, expect, it } from "vitest";
import { validateEmail } from "./validateEmail";

describe("validateEmail", () => {
  it("returns true for valid email", () => {
    expect(validateEmail("test@example.com")).toBe(true);
  });

  it("returns false when email has no at sign", () => {
    expect(validateEmail("test.example.com")).toBe(false);
  });

  it("returns false when email has empty local part", () => {
    expect(validateEmail("@example.com")).toBe(false);
  });

  it("returns false when domain has no dot", () => {
    expect(validateEmail("test@example")).toBe(false);
  });
});
