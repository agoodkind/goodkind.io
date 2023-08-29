import clsx from "clsx";
import { ReactNode } from "react";

export default function Section({
  className,
  children,
  variant,
}: {
  className?: string;
  children: ReactNode;
  variant?: "without-padding";
}) {
  const padding = variant === "without-padding" ? "p-0" : "p-7";
  return (
    <section
      className={clsx("section rounded-xl bg-white shadow", padding, className)}
    >
      {children}
    </section>
  );
}
