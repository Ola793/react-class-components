import { describe, expect, it } from "vitest";
import { formSchema } from "./formSchema";

const createImage = () =>
  new File(["image"], "avatar.png", {
    type: "image/png",
  });

const validFormValues = {
  name: "Olha",
  age: "30",
  email: "olha@example.com",
  gender: "Female",
  termsAccepted: true,
  password: "Password1!",
  confirmPassword: "Password1!",
  country: "Poland",
  image: createImage(),
};

describe("formSchema", () => {
  it("validates correct form values", () => {
    const result = formSchema.safeParse(validFormValues);

    expect(result.success).toBe(true);
  });

  it("rejects name that starts with lowercase letter", () => {
    const result = formSchema.safeParse({
      ...validFormValues,
      name: "olha",
    });

    expect(result.success).toBe(false);
  });

  it("rejects negative age", () => {
    const result = formSchema.safeParse({
      ...validFormValues,
      age: "-1",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = formSchema.safeParse({
      ...validFormValues,
      email: "olha@example",
    });

    expect(result.success).toBe(false);
  });

  it("rejects unchecked terms", () => {
    const result = formSchema.safeParse({
      ...validFormValues,
      termsAccepted: false,
    });

    expect(result.success).toBe(false);
  });

  it("rejects mismatched passwords", () => {
    const result = formSchema.safeParse({
      ...validFormValues,
      confirmPassword: "AnotherPassword1!",
    });

    expect(result.success).toBe(false);
  });

  it("rejects unsupported image type", () => {
    const result = formSchema.safeParse({
      ...validFormValues,
      image: new File(["image"], "avatar.gif", {
        type: "image/gif",
      }),
    });

    expect(result.success).toBe(false);
  });

  it("rejects image larger than 1 MB", () => {
    const largeImage = new File([new Uint8Array(1024 * 1024 + 1)], "avatar.png", {
      type: "image/png",
    });

    const result = formSchema.safeParse({
      ...validFormValues,
      image: largeImage,
    });

    expect(result.success).toBe(false);
  });
});
