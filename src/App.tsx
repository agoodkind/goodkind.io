function goResume() {
  window.location.href = atob(
    "aHR0cHM6Ly9kcml2ZS5nb29nbGUuY29tL2ZpbGUvZC8xNXdwN1NuVGN3Nk5VaE9VdnZKa1NueEVUSER4WC1TQXovdmlldz91c3A9c2hhcmVfbGluaw=="
  );
}

function goContact() {
  window.location.href = atob("bWFpbHRvOmFsZXhAZ29vZGtpbmQuaW8=");
}

function App() {
  return (
    <>
      <div className="container d-flex w-100 p-3 mx-auto flex-column">
        <header className="mb-auto mt-auto">
          <h3 className="p-3">Alex Goodkind</h3>
          <p className="h-fyi fst-italic opacity-75">
            This website is a work in progress, more coming soon.
          </p>
        </header>

        <main className="h-50">
          <div className="button-container d-grid gap-2 col-3 mx-auto">
            <button
              type="button"
              className="btn btn-outline-*"
              onClick={goResume}
            >
              Resume
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={goContact}
            >
              Contact
            </button>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
