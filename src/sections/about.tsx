import { BlockTitle } from "@components/block-title";
import { Section } from "@components/section";
import clsx from "clsx";
import React from "react";

function AboutHoverableCliffLink({
  label,
  active,
  href,
}: {
  label: string;
  active: boolean;
  href: string;
}) {
  return (
    <li key={label}>
      <a
        href={href}
        className={clsx(
          active && ["text-violet-500", "border-b-violet-500"],
          ["hover:text-violet-600", "hover:border-b-violet-600"],
          [
            "inline-flex",
            "border-transparent",
            "pb-5",
            "border-b-2",
            "transition-all",
          ], // default
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
    href: "#",
  },
  {
    label: "Projects",
    active: false,
    href: "#projects",
  },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/agoodkind",
    iconData: (
      <>
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-6 w-6 fill-slate-900"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"
          ></path>
        </svg>
      </>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/agoodkind/",
    iconData: <></>,
  },
];

function SocialLinkIconListItem({
  label,
  href,
  iconData,
}: {
  label: string;
  href: string;
  iconData: React.ReactNode;
}) {
  return (
    <li>
      <a href={href} aria-label={label} className="social-link-hover">
        {iconData}
      </a>
    </li>
  );
}

export default function About() {
  const emailMe = () => {
    window.location.href = atob("bWFpbHRvOmFsZXhAZ29vZGtpbmQuaW8=");
  };

  return (
    <Section className="pb-0">
      {/* about me */}
      <BlockTitle>About me</BlockTitle>
      <p className="mb-5 text-gray-600">
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
      <div className="my-5 border-t border-gray-200"></div>
      <ul className="flex space-x-8 font-medium">
        {cliffLinks.map(AboutHoverableCliffLink)}
      </ul>
    </Section>
  );
}
