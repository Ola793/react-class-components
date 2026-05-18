import { useEffect, useState } from 'react';
import { fetchCharacters } from './api/charactersApi';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { CardList } from './components/CardList';
import { ErrorButton } from './components/ErrorButton';
import { Loader } from './components/Loader';
import { Search } from './components/Search';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Character } from './types/character';
import './App.css';

const STORAGE_KEY = 'searchTerm';

function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const { storedValue: searchTerm, updateStoredValue: setSearchTerm } =
    useLocalStorage(STORAGE_KEY);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isActualRequest = true;

    const loadCharacters = async () => {
      try {
        const data = await fetchCharacters(searchTerm);

        if (!isActualRequest) {
          return;
        }

        setCharacters(data.results);
        setErrorMessage('');
      } catch (error) {
        if (!isActualRequest) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.';

        setCharacters([]);
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
  }, [searchTerm]);

  const handleSearch = (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue === searchTerm) {
      return;
    }

    setIsLoading(true);
    setSearchTerm(trimmedValue);
  };

  const renderResults = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (errorMessage) {
      return <p className="error-message">{errorMessage}</p>;
    }

    return <CardList characters={characters} />;
  };

  return (
    <AppErrorBoundary>
      <main className="app">
        <section className="search-section">
          <h1>Character search</h1>
          <Search initialValue={searchTerm} onSearch={handleSearch} />
        </section>

        <section className="results-section">
          <h2>Results</h2>
          {renderResults()}
        </section>

        <ErrorButton />
      </main>
    </AppErrorBoundary>
  );
}

export default App;