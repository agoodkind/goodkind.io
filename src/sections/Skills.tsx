import BlockTitle from "@components/BlockTitle";
import Section from "@components/Section";

const skills = ["JavaScript", "React", "SQL", "HTML/CSS", "Java", "Python"];

export default function Skills() {
  return (
    <Section>
      <BlockTitle>Skills</BlockTitle>
      <div className="-m-2 flex flex-wrap">
        <ul>
          {skills.map((skill) => (
            <li className="m-1 inline-flex rounded-lg bg-violet-100 px-4 py-1 text-sm font-medium text-violet-500">
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
