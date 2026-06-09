import { useFormStore } from './store/formStore';
import './App.css';

function App() {
  const submissions = useFormStore((state) => state.submissions);

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

        {submissions.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          <div className="submission-list">
            {submissions.map((submission) => (
              <article
                className={`submission-card ${submission.isNew ? 'submission-card--new' : ''}`}
                key={submission.id}
              >
                <img src={submission.imageBase64} alt={submission.name} />
                <div>
                  <h3>{submission.name}</h3>
                  <p>{submission.email}</p>
                  <p>
                    {submission.age} years old · {submission.gender}
                  </p>
                  <p>{submission.country}</p>
                  <p>Submitted from: {submission.formType}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;