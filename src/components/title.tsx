import { ReactNode } from "react";

export function Title({ children }: { children: ReactNode }) {
  return <h1 className={"mb-5 text-lg font-semibold"}>{children}</h1>;
}
