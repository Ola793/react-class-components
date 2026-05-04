import { Component, type ChangeEvent, type FormEvent } from 'react';

interface SearchProps {
  initialValue: string;
  onSearch: (searchTerm: string) => void;
}

interface SearchState {
  searchTerm: string;
}

export class Search extends Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);

    this.state = {
      searchTerm: props.initialValue,
    };
  }

  componentDidUpdate(prevProps: SearchProps) {
    if (prevProps.initialValue !== this.props.initialValue) {
      this.setState({ searchTerm: this.props.initialValue });
    }
  }

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value });
  };

  handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.onSearch(this.state.searchTerm);
  };

  render() {
    return (
      <form className="search" onSubmit={this.handleSubmit}>
        <input
          className="search__input"
          type="text"
          value={this.state.searchTerm}
          onChange={this.handleChange}
          placeholder="Search characters by name"
        />
        <button className="search__button" type="submit">
          Search
        </button>
      </form>
    );
  }
}