import { heroData } from "@data/hero-data";
import { Hero } from "@sections/hero";
import { Information } from "@sections/information";
import { Skills } from "@sections/skills";

export default function App() {
  return (
    <>
      <Hero {...heroData} />
      <Information />
      <Skills />
    </>
  );
}
