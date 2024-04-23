import avatarFallback from "@assets/avi.jpeg";
import avatar from "@assets/avi.webp";
import { Section } from "@components/section";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";

const hero = {
  name: "Alexander Goodkind",
  role: "Software Engineer",
  avatar,
  avatarFallback
};

export function Hero() {
  return (
    <Section variant={"without-padding"} className={"overflow-hidden"}>
      <div className={"h-32 bg-violet-500 bg-cover"}></div>
      <div className={"relative bg-white p-7 pt-14"}>
        <span
          className={
            "absolute right-7 top-4 rounded-3xl bg-gray-400 px-2 py-[0.125rem] text-xs font-semibold uppercase text-white"
          }
        >
          {"Busy"}
        </span>
        <a className={"#"}>
          <picture>
            <source srcSet={hero.avatar} type={"image/webp"}></source>
            <source srcSet={hero.avatarFallback} type={"image/jpeg"}></source>
            <img
              // @ts-expect-error this is stupid fix ur spec @react @mdn @js
              fetchpriority={"high"}
              src={hero.avatarFallback}
              alt={"Avatar"}
              className={
                "absolute -top-10 h-20 rounded-lg border-2 border-solid border-white shadow-md"
              }
            />
          </picture>
        </a>
        <div className={"mb-1.5 text-lg font-semibold"}>{hero.name}</div>
        <div className={"mb-7 text-sm text-gray-400"}>{hero.role}</div>

        <a
          href={"https://go.goodkind.io/resume"}
          download={"https://go.goodkind.io/resume"}
          className={"group flex"}
        >
          <button
            className={
              "btn w-full rounded-s-lg bg-violet-500 px-5 py-3 text-center font-semibold text-white hover:cursor-pointer hover:bg-violet-600"
            }
          >
            {"LinkedIn"}
          </button>
          <button
            className={
              "btn rounded-e-lg bg-violet-600 px-5 py-3 text-center text-white hover:cursor-pointer"
            }
          >
            <ArrowTopRightOnSquareIcon className={"h-5 w-5"} />
          </button>
        </a>
      </div>
    </Section>
  );
}
