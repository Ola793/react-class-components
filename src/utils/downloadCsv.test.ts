import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Character } from "../types/character";
import { downloadSelectedItemsCsv } from "./downloadCsv";

const rick: Character = {
  id: 1,
  name: "Rick Sanchez",
  status: "Alive",
  species: "Human",
  image: "https://example.com/rick.png",
};

describe("downloadSelectedItemsCsv", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("creates csv file with selected items count in file name", () => {
    const createObjectURLMock = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:test-url");

    const revokeObjectURLMock = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

    const clickMock = vi.fn();

    vi.spyOn(document, "createElement").mockReturnValue({
      href: "",
      download: "",
      click: clickMock,
    } as unknown as HTMLAnchorElement);

    downloadSelectedItemsCsv([rick]);

    expect(createObjectURLMock).toHaveBeenCalledOnce();
    expect(revokeObjectURLMock).toHaveBeenCalledWith("blob:test-url");
    expect(clickMock).toHaveBeenCalledOnce();
  });
});
