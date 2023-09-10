import Section from "@Components/Section";

const skills = ["JavaScript", "React", "SQL", "HTML/CSS"];

export default function Skills() {
  return (
    <Section>
      <h2 className="block-title">Skills</h2>
      <div className="-m-2 flex flex-wrap">
        <ul>
          {skills.map((skill) => (
            <li className="inline-flex">{skill}</li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
