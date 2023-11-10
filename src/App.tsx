import Section from "@components/Section";
import Title from "@components/Title";
import Hero from "@sections/Hero";
import Information from "@sections/Information";
import Skills from "@sections/Skills";

function App() {
  return (
    <main className="container mx-auto w-full max-w-5xl p-4 sm:max-w-[640px] sm:p-5 md:max-w-3xl">
      <div className="grid gap-5">
        <div className="space-y-5">
          <Hero />
          <Information />
          <Skills />
          <Section>
            <Title>Rest coming soon...</Title>
          </Section>
        </div>
      </div>
    </main>
  );
}

export default App;
