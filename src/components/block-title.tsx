import { ReactNode } from "react";

export function BlockTitle({ children }: { children: ReactNode }) {
  return <h2 className={"mb-5 text-lg font-semibold"}>{children}</h2>;
}
