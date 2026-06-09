import './App.css';

function App() {
  return (
    <main className="app">
      <section className="hero">
        <h1>React forms</h1>
        <p>Submit forms and see saved submissions on the page.</p>

        <div className="actions">
          <button type="button">Open uncontrolled form</button>
          <button type="button">Open React Hook Form</button>
        </div>
      </section>

      <section className="submissions">
        <h2>Submissions</h2>
        <p>No submissions yet.</p>
      </section>
    </main>
  );
}

export default App;