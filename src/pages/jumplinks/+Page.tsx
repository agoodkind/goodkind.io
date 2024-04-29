import { heroData } from "@data/hero-data";
import { Hero } from "@sections/hero";

export default function JumpLinks() {
  const { links, ...rest } = heroData;
  return (
    <>
      <Hero {...{ ...rest, links: [] }} />
    </>
  );
}
