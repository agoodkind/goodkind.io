import { BlockTitle } from "../components/block-title";
import { Section } from "../components/section";

const skills = [
  "JavaScript",
  "React",
  "SQL",
  "PHP",
  "HTML/CSS",
  "Java",
  "Python",
  "C/C++"
];

export function Skills() {
  return (
    <Section>
      <BlockTitle>{"Skills"}</BlockTitle>
      <div className={"-m-2 flex flex-wrap"}>
        <ul>
          {skills.map(skill => (
            <li
              key={skill}
              className={
                "text-violet-500 bg-violet-100 m-1 inline-flex rounded-lg px-4 py-1 text-sm font-medium dark:text-violet-600"
              }
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
