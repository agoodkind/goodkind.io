import Section from "src/components/Section";

export default function Skills() {
  return (
    <Section>
      <h2 className="block-title">Skills</h2>
      <div className="-m-2 flex flex-wrap">
        <span className="skill-tag">JavaScript</span>
        <span className="skill-tag">React</span>
        <span className="skill-tag">Vue</span>
        <span className="skill-tag">SQL</span>
        <span className="skill-tag">HTML/CSS</span>
        <span className="skill-tag">Java</span>
      </div>
    </Section>
  );
}
