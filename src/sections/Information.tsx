import Section from "@Components/Section";
import Title from "@Components/Title";

const information = [
  {
    title: "Location",
    answer: "San Francisco",
  },
  {
    title: "Remote",
    answer: "Hybrid",
  },
  {
    title: "Experience",
    answer: "3+ years",
  },
  {
    title: "Relocation",
    answer: "Let's Discuss",
  },
];

function InformationItem({ title, answer }: { title: string; answer: string }) {
  return (
    <li className="flex justify-between">
      <div className="text-gray-400">{title}</div>
      <div className="font-medium text-right text-gray-600">{answer}</div>
    </li>
  );
}

export default function Information() {
  return (
    <Section>
      <Title>Information</Title>
      <ul className="space-y-4">{information.map(InformationItem)}</ul>
    </Section>
  );
}
