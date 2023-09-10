import About from "@Sections/About";
import Education from "@Sections/Education";
import Hero from "@Sections/Hero";
import Information from "@Sections/Information";
import Resume from "@Sections/Resume";
import Skills from "@Sections/Skills";

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
