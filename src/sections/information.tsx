import { Section } from "../components/section";
import { Title } from "../components/title";

const information = [
  {
    title: "Location",
    answer: "San Francisco"
  },
  {
    title: "Remote",
    answer: "Hybrid"
  },
  {
    title: "Experience",
    answer: "3+ years"
  },
  {
    title: "Relocation",
    answer: "Let's Discuss"
  }
];

function InformationItem({ title, answer }: { title: string; answer: string }) {
  return (
    <li key={title} className={"flex justify-between"}>
      <div className={"text-gray-400 dark:text-gray-500"}>{title}</div>
      <div className={"text-gray-600 text-right font-medium"}>{answer}</div>
    </li>
  );
}

export function Information() {
  return (
    <Section>
      <Title>{"Information"}</Title>
      <ul className={"space-y-4"}>{information.map(InformationItem)}</ul>
    </Section>
  );
}
