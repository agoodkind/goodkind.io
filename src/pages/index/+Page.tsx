import { heroData } from "@data/hero-data";
import Hero from "@sections/Hero";
import Information from "@sections/Information";
import Skills from "@sections/Skills";

export default function App() {
  return (
    <>
      <Hero {...heroData} />
      <Information />
      <Skills />
    </>
  );
}
