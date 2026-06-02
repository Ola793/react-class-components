import { useEffect } from "react";
import { Link, Outlet, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { CardList } from "./components/CardList";
import { ErrorButton } from "./components/ErrorButton";
import { Loader } from "./components/Loader";
import { Pagination } from "./components/Pagination";
import { Search } from "./components/Search";
import { SelectedItemsFlyout } from "./components/SelectedItemsFlyout";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { useCharactersQuery } from "./hooks/useCharactersQuery";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { queryKeys } from "./query/queryKeys";
import "./App.css";

const STORAGE_KEY = "searchTerm";
const DEFAULT_PAGE = 1;

const getValidPage = (page: string | null) => {
  const parsedPage = Number(page);

  if (!Number.isInteger(parsedPage) || parsedPage < DEFAULT_PAGE) {
    return DEFAULT_PAGE;
  }

  return parsedPage;
};

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const { storedValue: searchTerm, updateStoredValue: setSearchTerm } = useLocalStorage(STORAGE_KEY);

  const selectedCharacterId = searchParams.get("details");
  const currentPage = getValidPage(searchParams.get("page"));

  const { data, isLoading, isFetching, isError, error } = useCharactersQuery(searchTerm, currentPage);

  const characters = data?.results ?? [];
  const totalPages = data?.info.pages ?? DEFAULT_PAGE;

  useEffect(() => {
    if (!searchParams.has("page")) {
      setSearchParams({ page: String(DEFAULT_PAGE) }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSearch = (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue === searchTerm) {
      return;
    }

    setSearchTerm(trimmedValue);
    setSearchParams({ page: String(DEFAULT_PAGE) });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page) });
  };

  const handleCharacterSelect = (characterId: number) => {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.set("page", String(currentPage));
    nextParams.set("details", String(characterId));

    setSearchParams(nextParams);
  };

  const handleDetailsClose = () => {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.delete("details");
    nextParams.set("page", String(currentPage));

    setSearchParams(nextParams);
  };

  const handleRefresh = () => {
    void queryClient.invalidateQueries({
      queryKey: queryKeys.characters(searchTerm, currentPage),
    });
  };

  const renderResults = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (isError) {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";

      return <p className="error-message">{message}</p>;
    }

    return (
      <>
        <button className="refresh-button" type="button" onClick={handleRefresh} disabled={isFetching}>
          {isFetching ? "Refreshing..." : "Refresh list"}
        </button>

        <CardList characters={characters} onSelect={handleCharacterSelect} />

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </>
    );
  };

  return (
    <AppErrorBoundary>
      <main className="app">
        <nav className="app-navigation">
          <Link to="/?page=1">Home</Link>
          <Link to="/about">About</Link>
          <ThemeSwitcher />
        </nav>

        <section className="search-section">
          <h1>Character search</h1>
          <Search initialValue={searchTerm} onSearch={handleSearch} />
        </section>

        <section className="results-section">
          <h2>Results</h2>
          {renderResults()}
        </section>

        <Outlet
          context={{
            characterId: selectedCharacterId,
            onClose: handleDetailsClose,
          }}
        />

        <SelectedItemsFlyout />
        <ErrorButton />
      </main>
    </AppErrorBoundary>
  );
}

export default App;
