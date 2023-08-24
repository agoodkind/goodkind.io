import About from "./sections/About";
import Education from "./sections/Education";
import Hero from "./sections/Hero";
import Information from "./sections/Information";
import Resume from "./sections/Resume";
import Skills from "./sections/Skills";

function App() {
  return (
    <main className="container p-5">
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5">
          <Hero />
          <Information />
          <Skills />
        </div>

        <div className="space-y-5 lg:col-span-2">
          <About />
          <Resume />
          <Education />
        </div>
      </div>
    </main>
  );
}

export default App;
