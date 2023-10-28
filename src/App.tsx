import About from "@sections/About";
import Education from "@sections/Education";
import Hero from "@sections/Hero";
import Information from "@sections/Information";
import Resume from "@sections/Resume";
import Skills from "@sections/Skills";

function App() {
  return (
    <main className="container mx-auto w-full max-w-5xl p-4 sm:max-w-[640px] sm:p-5 md:max-w-3xl lg:max-w-5xl xl:max-w-7xl">
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
