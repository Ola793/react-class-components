import { useEffect, useState } from "react";
import { Link, Outlet, useSearchParams } from "react-router-dom";
import { fetchCharacters } from "./api/charactersApi";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { CardList } from "./components/CardList";
import { ErrorButton } from "./components/ErrorButton";
import { Loader } from "./components/Loader";
import { Pagination } from "./components/Pagination";
import { Search } from "./components/Search";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { Character } from "./types/character";
import { SelectedItemsFlyout } from "./components/SelectedItemsFlyout";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
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

  const [characters, setCharacters] = useState<Character[]>([]);
  const [totalPages, setTotalPages] = useState(DEFAULT_PAGE);
  const { storedValue: searchTerm, updateStoredValue: setSearchTerm } = useLocalStorage(STORAGE_KEY);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const selectedCharacterId = searchParams.get("details");

  const currentPage = getValidPage(searchParams.get("page"));

  useEffect(() => {
    if (!searchParams.has("page")) {
      setSearchParams({ page: String(DEFAULT_PAGE) }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    let isActualRequest = true;

    const loadCharacters = async () => {
      try {
        const data = await fetchCharacters(searchTerm, currentPage);

        if (!isActualRequest) {
          return;
        }

        setCharacters(data.results);
        setTotalPages(data.info.pages);
        setErrorMessage("");
      } catch (error) {
        if (!isActualRequest) {
          return;
        }

        const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";

        setCharacters([]);
        setTotalPages(DEFAULT_PAGE);
        setErrorMessage(message);
      } finally {
        if (isActualRequest) {
          setIsLoading(false);
        }
      }
    };

    void loadCharacters();

    return () => {
      isActualRequest = false;
    };
  }, [searchTerm, currentPage]);

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

  const renderResults = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (errorMessage) {
      return <p className="error-message">{errorMessage}</p>;
    }

    return (
      <>
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
