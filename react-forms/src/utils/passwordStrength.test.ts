import { describe, expect, it } from "vitest";
import { getPasswordStrength } from "./passwordStrength";

describe("getPasswordStrength", () => {
  it("checks password strength rules", () => {
    expect(getPasswordStrength("Aa1!")).toEqual({
      hasNumber: true,
      hasUppercase: true,
      hasLowercase: true,
      hasSpecialCharacter: true,
    });
  });

  it("returns false values for empty password", () => {
    expect(getPasswordStrength("")).toEqual({
      hasNumber: false,
      hasUppercase: false,
      hasLowercase: false,
      hasSpecialCharacter: false,
    });
  });
});
