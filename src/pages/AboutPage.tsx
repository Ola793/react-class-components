export function AboutPage() {
  return (
    <main className="app">
      <section className="content-section">
        <h1>About this app</h1>
        <p>
          This application was created as part of the React course task for
          practicing functional components, hooks, routing, pagination, and
          master-detail UI patterns.
        </p>

        <p>
          Author: Olha Teplova
        </p>

        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noreferrer"
        >
          RS School React course
        </a>
      </section>
    </main>
  );
}