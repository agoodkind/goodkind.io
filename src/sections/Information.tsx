import Section from "@components/Section";
import Title from "@components/Title";

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
    <li key={title} className="flex justify-between">
      <div className="text-gray-400">{title}</div>
      <div className="text-right font-medium text-gray-600">{answer}</div>
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
