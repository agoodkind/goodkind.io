import { heroData } from "@data/hero-data";
import Hero from "@sections/Hero";

export default function JumpLinks() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { links, ...rest } = heroData;
  return (
    <>
      <Hero {...{ ...rest, links: [] }} />
    </>
  );
}
