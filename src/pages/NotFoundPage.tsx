import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="app">
      <section className="content-section">
        <h1>404</h1>
        <p>Page not found.</p>
        <Link to="/?page=1">Back to main page</Link>
      </section>
    </main>
  );
}
