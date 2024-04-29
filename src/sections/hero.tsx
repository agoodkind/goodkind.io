import { LinkButton } from "@components/link-button";
import { Section } from "../components/section";

export function Hero(hero: {
  name: string;
  role: string;
  avatar: string;
  avatarFallback: string;
  links: { url: string; text: string }[];
}) {
  return (
    <Section variant={"without-padding"} className={"overflow-hidden"}>
      <a href={"/"}>
        <div className={"bg-violet-500 h-32 bg-cover dark:bg-violet-50"}></div>
      </a>
      <div className={"bg-white relative p-7 pt-14 dark:bg-neutral-50"}>
        <span
          className={
            "text-white bg-gray-400 absolute right-7 top-4 rounded-3xl px-2 py-[0.125rem] text-xs font-semibold uppercase"
          }
        >
          {"Busy"}
        </span>
        <a href={"/"}>
          <picture className="animate-surfaced">
            <source srcSet={hero.avatar} type={"image/webp"}></source>
            <source srcSet={hero.avatarFallback} type={"image/jpeg"}></source>
            <img
              // @ts-expect-error this is stupid fix ur spec @react @mdn @js
              fetchpriority={"high"}
              src={hero.avatarFallback}
              alt={"Avatar"}
              className={
                "border-white absolute -top-10 h-20 rounded-lg border-2 border-solid shadow-md"
              }
            />
          </picture>
        </a>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <div className={"text-lg font-semibold"}>{hero.name}</div>
            <div className={"text-gray-400 text-sm"}>{hero.role}</div>
          </div>
          <div className={"flex w-full items-center justify-center gap-2"}>
            <div className="flex w-full flex-col gap-2">
              {hero.links.map(link => (
                <LinkButton key={link.url} url={link.url} text={link.text} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
