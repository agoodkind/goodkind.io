import { Hero } from "./sections/hero";
import { Information } from "./sections/information";
import { Skills } from "./sections/skills";

export default function App() {
  return (
    <main
      className={
        "container mx-auto w-full max-w-5xl p-4 sm:max-w-[640px] sm:p-5 md:max-w-3xl lg:max-w-5xl xl:max-w-7xl"
      }
    >
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
