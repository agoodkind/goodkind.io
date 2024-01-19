import BlockTitle from "@components/block-title";
import Section from "@components/section";

const skills = [
  "JavaScript",
  "React",
  "SQL",
  "PHP",
  "HTML/CSS",
  "Java",
  "Python",
  "C/C++",
];

export default function Skills() {
  return (
    <Section>
      <BlockTitle>Skills</BlockTitle>
      <div className="-m-2 flex flex-wrap">
        <ul>
          {skills.map((skill) => (
            <li
              key={skill}
              className="m-1 inline-flex rounded-lg bg-violet-100 px-4 py-1 text-sm font-medium text-violet-500"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
