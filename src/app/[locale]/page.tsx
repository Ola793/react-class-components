import type { Character } from "../../types/character";
import { getTranslations } from "next-intl/server";
import { fetchCharacters } from "../../api/charactersApi";
import { CardList } from "../../components/CardList";
import { CharacterDetails } from "../../components/CharacterDetails";
import { ErrorButton } from "../../components/ErrorButton";
import { Pagination } from "../../components/Pagination";
import { SearchForm } from "../../components/SearchForm";
import { SelectedItemsFlyout } from "../../components/SelectedItemsFlyout";

const DEFAULT_PAGE = 1;

type HomePageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    page?: string;
    query?: string;
    details?: string;
  }>;
};

const getValidPage = (page?: string) => {
  const parsedPage = Number(page);

  if (!Number.isInteger(parsedPage) || parsedPage < DEFAULT_PAGE) {
    return DEFAULT_PAGE;
  }

  return parsedPage;
};

export default async function HomePage({ params, searchParams }: HomePageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations({ locale, namespace: "HomePage" });

  const currentPage = getValidPage(resolvedSearchParams.page);
  const searchTerm = resolvedSearchParams.query ?? "";
  const selectedCharacterId = resolvedSearchParams.details ?? null;

  let characters: Character[] = [];
  let totalPages = DEFAULT_PAGE;
  let errorMessage = "";

  try {
    const data = await fetchCharacters(searchTerm, currentPage);

    characters = data.results;
    totalPages = data.info.pages;
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again.";
  }

  return (
    <>
      <section className="search-section">
        <h1>{t("title")}</h1>
        <SearchForm
          locale={locale}
          initialValue={searchTerm}
          placeholder={t("searchPlaceholder")}
          buttonLabel={t("searchButton")}
        />
      </section>

      <section className="results-section">
        <h2>{t("resultsTitle")}</h2>

        {errorMessage ? (
          <p className="error-message">{errorMessage}</p>
        ) : (
          <>
            <CardList characters={characters} currentPage={currentPage} searchTerm={searchTerm} />
            <Pagination currentPage={currentPage} totalPages={totalPages} searchTerm={searchTerm} />
          </>
        )}
      </section>

      {selectedCharacterId && (
        <CharacterDetails characterId={selectedCharacterId} currentPage={currentPage} searchTerm={searchTerm} />
      )}

      <SelectedItemsFlyout />
      <ErrorButton />
    </>
  );
}