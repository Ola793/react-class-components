import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { fetchCharacters } from "./api/charactersApi";
import type { Character } from "./types/character";
import { ThemeProvider } from "./context/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("./api/charactersApi", () => ({
  fetchCharacters: vi.fn(),
}));

const mockedFetchCharacters = vi.mocked(fetchCharacters);

const createCharactersResponse = (characters: Character[], pages = 1) => ({
  info: {
    count: characters.length,
    pages,
    next: null,
    prev: null,
  },
  results: characters,
});

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
        staleTime: Infinity,
      },
    },
  });

const renderApp = () => {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/?page=1"]}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const rick: Character = {
  id: 1,
  name: "Rick Sanchez",
  status: "Alive",
  species: "Human",
  image: "https://example.com/rick.png",
};

const morty: Character = {
  id: 2,
  name: "Morty Smith",
  status: "Alive",
  species: "Human",
  image: "https://example.com/morty.png",
};

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
    mockedFetchCharacters.mockReset();
  });

  it("fetches all characters on initial load when localStorage is empty", async () => {
    mockedFetchCharacters.mockResolvedValue(createCharactersResponse([rick]));

    renderApp();

    await waitFor(() => {
      expect(mockedFetchCharacters).toHaveBeenCalledWith("", 1);
    });

    expect(await screen.findByText(/rick sanchez/i)).toBeInTheDocument();
  });

  it("reads saved search term from localStorage and displays it in the input", async () => {
    localStorage.setItem("searchTerm", "Morty");
    mockedFetchCharacters.mockResolvedValue(createCharactersResponse([morty]));

    renderApp();

    expect(screen.getByDisplayValue("Morty")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedFetchCharacters).toHaveBeenCalledWith("Morty", 1);
    });

    expect(await screen.findByText(/morty smith/i)).toBeInTheDocument();
  });

  it("shows loading indicator while characters are being loaded", async () => {
    let resolveRequest: (response: ReturnType<typeof createCharactersResponse>) => void = () => {};

    const pendingRequest = new Promise<ReturnType<typeof createCharactersResponse>>((resolve) => {
      resolveRequest = resolve;
    });

    mockedFetchCharacters.mockReturnValue(pendingRequest);

    renderApp();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    resolveRequest(createCharactersResponse([rick]));

    expect(await screen.findByText(/rick sanchez/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  it("shows a readable error message when API request fails", async () => {
    mockedFetchCharacters.mockRejectedValue(new Error("Unable to load characters. Please try another search term."));

    renderApp();

    expect(
      await screen.findByText(/unable to load characters\. please try another search term\./i)
    ).toBeInTheDocument();
  });

  it("saves trimmed search term to localStorage and fetches matching results", async () => {
    const user = userEvent.setup();

    mockedFetchCharacters
      .mockResolvedValueOnce(createCharactersResponse([rick]))
      .mockResolvedValueOnce(createCharactersResponse([morty]));

    renderApp();

    expect(await screen.findByText(/rick sanchez/i)).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/search characters by name/i);

    await user.type(input, "  Morty  ");
    await user.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => {
      expect(mockedFetchCharacters).toHaveBeenCalledWith("Morty", 1);
    });

    expect(localStorage.getItem("searchTerm")).toBe("Morty");
    expect(await screen.findByText(/morty smith/i)).toBeInTheDocument();
  });

  it("does not make a new request when search term has not changed", async () => {
    const user = userEvent.setup();

    localStorage.setItem("searchTerm", "Rick");
    mockedFetchCharacters.mockResolvedValue(createCharactersResponse([rick]));

    renderApp();

    expect(await screen.findByText(/rick sanchez/i)).toBeInTheDocument();

    mockedFetchCharacters.mockClear();

    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(mockedFetchCharacters).not.toHaveBeenCalled();
  });

  it("uses cached page data and refetches after refresh", async () => {
    const user = userEvent.setup();

    mockedFetchCharacters
      .mockResolvedValueOnce(createCharactersResponse([rick], 2))
      .mockResolvedValueOnce(createCharactersResponse([morty], 2))
      .mockResolvedValueOnce(createCharactersResponse([rick], 2));

    renderApp();

    expect(await screen.findByText(/rick sanchez/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(await screen.findByText(/morty smith/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /previous/i }));

    expect(await screen.findByText(/rick sanchez/i)).toBeInTheDocument();

    expect(mockedFetchCharacters).toHaveBeenCalledTimes(2);

    await user.click(screen.getByRole("button", { name: /refresh list/i }));

    await waitFor(() => {
      expect(mockedFetchCharacters).toHaveBeenCalledTimes(3);
    });
  });
});
