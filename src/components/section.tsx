import clsx from "clsx";
import { ReactNode } from "react";

export default function Section({
  className,
  children,
  variant = "with-padding",
}: {
  className?: string;
  children: ReactNode;
  variant?: "without-padding" | "with-padding";
}) {
  return (
    <section
      className={clsx(
        "section animate-surfaced text-black bg-white rounded-xl shadow dark:bg-neutral-800",
        {
          "p-0": variant === "without-padding",
          "p-7": variant === "with-padding",
        },
        className,
      )}
    >
      {children}
    </section>
  );
}
