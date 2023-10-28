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
        "section rounded-xl bg-white shadow",
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
