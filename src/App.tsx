import { Component } from 'react';
import { fetchCharacters } from './api/charactersApi';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { CardList } from './components/CardList';
import { ErrorButton } from './components/ErrorButton';
import { Loader } from './components/Loader';
import { Search } from './components/Search';
import type { Character } from './types/character';
import './App.css';

const STORAGE_KEY = 'searchTerm';

interface AppState {
  characters: Character[];
  searchTerm: string;
  isLoading: boolean;
  errorMessage: string;
}

class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props);

    const savedSearchTerm = localStorage.getItem(STORAGE_KEY) ?? '';

    this.state = {
      characters: [],
      searchTerm: savedSearchTerm,
      isLoading: false,
      errorMessage: '',
    };
  }

  componentDidMount() {
    this.loadCharacters(this.state.searchTerm);
  }

  loadCharacters = async (searchTerm: string) => {
    this.setState({
      isLoading: true,
      errorMessage: '',
    });

    try {
      const characters = await fetchCharacters(searchTerm);

      this.setState({
        characters,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.';

      this.setState({
        characters: [],
        errorMessage,
        isLoading: false,
      });
    }
  };

  handleSearch = (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue === this.state.searchTerm) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, trimmedValue);

    this.setState(
      {
        searchTerm: trimmedValue,
      },
      () => {
        this.loadCharacters(trimmedValue);
      }
    );
  };

  renderResults() {
    const { characters, errorMessage, isLoading } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    if (errorMessage) {
      return <p className="error-message">{errorMessage}</p>;
    }

    return <CardList characters={characters} />;
  }

  render() {
    return (
      <AppErrorBoundary>
        <main className="app">
          <section className="search-section">
            <h1>Character search</h1>
            <Search
              initialValue={this.state.searchTerm}
              onSearch={this.handleSearch}
            />
          </section>

          <section className="results-section">
            <h2>Results</h2>
            {this.renderResults()}
          </section>

          <ErrorButton />
        </main>
      </AppErrorBoundary>
    );
  }
}

export default App;