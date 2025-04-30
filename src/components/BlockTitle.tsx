import { ReactNode } from "react";

export default function BlockTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className={"mb-5 text-lg font-semibold dark:text-white"}>{children}</h2>
  );
}
