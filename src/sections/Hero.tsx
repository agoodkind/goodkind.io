import Section from "@Components/Section";

const hero = {
  name: "Alexander Goodkind",
  role: "Software Engineer",
  avatar: "https://github.com/agoodkind.png",
};

export default function Hero() {
  // const handle;
  return (
    <Section variant="without-padding" className="overflow-hidden">
      <div className="h-32 bg-cover bg-violet-500"></div>
      <div className="pt-14 p-7 bg-white relative">
        <span className="rounded-3xl px-2 py-[0.125rem] bg-gray-400 text-white text-xs font-semibold uppercase top-4 right-7 absolute">
          Busy
        </span>
        <a className="">
          <img
            src={hero.avatar}
            alt="Avatar"
            className="absolute -top-10 rounded-lg shadow-md border-2 h-20 border-white border-solid
            "
          />
        </a>
        <div className="text-lg font-semibold mb-1.5">{hero.name}</div>
        <div className="text-sm text-gray-400 mb-7">{hero.role}</div>
        <div className="flex group">
          <button
            onClick={console.log}
            className="btn w-full bg-violet-500 hover:bg-violet-600 rounded-s-lg px-5 py-3 text-white"
          >
            Download CV
          </button>
          <button className="btn bg-violet-500 hover:bg-violet-600 rounded-e-lg py-3  px-5 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.8"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </Section>
  );
}
