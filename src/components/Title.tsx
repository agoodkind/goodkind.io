import { ReactNode } from "react";

export default function Title({ children }: { children: ReactNode }) {
  return <h1 className="font-semibold text-lg mb-5">{children}</h1>;
}
