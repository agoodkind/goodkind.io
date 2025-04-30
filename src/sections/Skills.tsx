import BlockTitle from "@components/BlockTitle";
import Section from "@components/Section";

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
      <BlockTitle>{"Skills"}</BlockTitle>
      <div className={"-m-2 flex flex-wrap"}>
        <ul>
          {skills.map((skill) => (
            <li
              key={skill}
              className={
                "text-violet-500 bg-violet-100 m-1 inline-flex rounded-lg px-4 py-1 text-sm font-medium dark:text-violet-300 dark:bg-violet-800"
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
