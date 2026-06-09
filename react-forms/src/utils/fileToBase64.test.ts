import { describe, expect, it } from "vitest";
import { fileToBase64 } from "./fileToBase64";

describe("fileToBase64", () => {
  it("converts file to base64 string", async () => {
    const file = new File(["test"], "avatar.png", {
      type: "image/png",
    });

    const result = await fileToBase64(file);

    expect(result).toContain("data:image/png;base64");
  });
});
