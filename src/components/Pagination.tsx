import { Link } from "../i18n/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchTerm: string;
}

const createPageHref = (page: number, searchTerm: string) => {
  const params = new URLSearchParams();

  params.set("page", String(page));

  if (searchTerm) {
    params.set("query", searchTerm);
  }

  return `/?${params.toString()}`;
};

export function Pagination({ currentPage, totalPages, searchTerm }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <nav className="pagination" aria-label="Pagination">
      {isFirstPage ? (
        <button type="button" disabled>
          Previous
        </button>
      ) : (
        <Link href={createPageHref(currentPage - 1, searchTerm)}>Previous</Link>
      )}

      <span>
        Page {currentPage} of {totalPages}
      </span>

      {isLastPage ? (
        <button type="button" disabled>
          Next
        </button>
      ) : (
        <Link href={createPageHref(currentPage + 1, searchTerm)}>Next</Link>
      )}
    </nav>
  );
}