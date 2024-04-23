import { Hero } from "./sections/hero";
import { Information } from "./sections/information";
import { Skills } from "./sections/skills";

export default function App() {
  return (
    <main className={"container mx-auto w-full max-w-xl p-4 sm:max-w-3xl sm:p-5"}>
      <div className={"grid gap-5"}>
        <div className={"space-y-5"}>
          <Hero />
          <Information />
          <Skills />
        </div>
      </div>
    </main>
  );
}
