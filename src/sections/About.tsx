import Section from "@Components/Section";
import BlockTitle from "@Components/BlockTitle";
import clsx from "clsx";

function AboutHoverableCliffLink({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <li>
      <a
        href="/personal_cv/index.html"
        className={clsx(
          active && ["text-violet-500", "border-b-violet-500"],
          ["hover:text-violet-500", "hover:border-b-violet-500"],
          [
            "inline-flex",
            "border-transparent",
            "pb-5",
            "border-b-2",
            "transition-all",
          ] // default
        )}
      >
        {label}
      </a>
    </li>
  );
}

const cliffLinks = [
  {
    label: "Resume",
    active: true,
  },
  {
    label: "GitHub",
    active: false,
  },
];

export default function About() {
  const emailMe = () => {
    window.location.href = atob("bWFpbHRvOmFsZXhAZ29vZGtpbmQuaW8=");
  };

  const isActive = true;

  return (
    <Section className="pb-0">
      {/* about me */}
      <BlockTitle>About me</BlockTitle>
      <p className="text-gray-600 mb-5">
        Libero quas veritatis nulla distinctio fuga nihil temporibus et. Quia
        dicta sapiente qui porro molestiae nobis incidunt voluptatem. Et
        voluptas sunt nihil. At perferendis voluptatem dolores nulla. Adipisci
        dolore non. Praesentium ipsa magnam ut quia explicabo voluptates.
      </p>
      <div className="flex flex-col space-y-4">
        <a href="#0" className="mail-link social-link-hover">
          <i className="bx bx-at text-xl"></i>
          <button className="btn" onClick={emailMe}>
            Email Me
          </button>
        </a>

        <ul className="flex space-x-5">
          <li>
            <a href="#0" className="social-link-hover">
              <i className="bx bxl-facebook-circle text-2xl"></i>
            </a>
          </li>
          <li>
            <a href="#0" className="social-link-hover">
              <i className="bx bxl-twitter text-2xl"></i>
            </a>
          </li>
          <li>
            <a href="#0" className="social-link-hover">
              <i className="bx bxl-github text-2xl"></i>
            </a>
          </li>
        </ul>
      </div>
      <div className="border-t border-gray-200 my-5"></div>
      <ul className="flex space-x-8 font-medium">
        {cliffLinks.map(AboutHoverableCliffLink)}
      </ul>
    </Section>
  );
}
