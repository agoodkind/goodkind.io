import Section from "@components/Section";

const hero = {
  name: "Alexander Goodkind",
  role: "Software Engineer",
  avatar: "https://github.com/agoodkind.png",
};

export default function Hero() {
  // const handle;
  return (
    <Section variant="without-padding" className="overflow-hidden">
      <div className="h-32 bg-violet-500 bg-cover"></div>
      <div className="relative bg-white p-7 pt-14">
        <span className="absolute right-7 top-4 rounded-3xl bg-gray-400 px-2 py-[0.125rem] text-xs font-semibold uppercase text-white">
          Busy
        </span>
        <a className="">
          <img
            src={hero.avatar}
            alt="Avatar"
            className="absolute -top-10 h-20 rounded-lg border-2 border-solid border-white shadow-md"
          />
        </a>
        <div className="mb-1.5 text-lg font-semibold">{hero.name}</div>
        <div className="mb-7 text-sm text-gray-400">{hero.role}</div>

        <a
          href="https://go.goodkind.io/resume"
          download="https://go.goodkind.io/resume"
          className="group flex"
        >
          <button className="btn w-full rounded-s-lg bg-violet-500 px-5 py-3 text-center font-semibold text-white hover:cursor-pointer hover:bg-violet-600">
            Download CV
          </button>
          <button className="btn rounded-e-lg bg-violet-600 px-5 py-3 text-center text-white hover:cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              ></path>
            </svg>
          </button>
        </a>
      </div>
    </Section>
  );
}
