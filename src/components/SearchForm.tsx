import { searchCharactersAction } from "../app/actions";

type SearchFormProps = {
  locale: string;
  initialValue: string;
  placeholder: string;
  buttonLabel: string;
};

export function SearchForm({ locale, initialValue, placeholder, buttonLabel }: SearchFormProps) {
  return (
    <form className="search" action={searchCharactersAction}>
      <input type="hidden" name="locale" value={locale} />

      <input
        className="search__input"
        type="text"
        name="searchTerm"
        defaultValue={initialValue}
        placeholder={placeholder}
      />

      <button className="search__button" type="submit">
        {buttonLabel}
      </button>
    </form>
  );
}