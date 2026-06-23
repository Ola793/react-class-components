import { type ChangeEvent, type FormEvent, useState } from "react";

interface SearchProps {
  initialValue: string;
  onSearch: (searchTerm: string) => void;
}

export function Search({ initialValue, onSearch }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState(() => initialValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedSearchTerm = searchTerm.trim();

    setSearchTerm(trimmedSearchTerm);
    onSearch(trimmedSearchTerm);
  };

  return (
    <form className="search" onSubmit={handleSubmit}>
      <input
        className="search__input"
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search characters by name"
      />
      <button className="search__button" type="submit">
        Search
      </button>
    </form>
  );
}
