import { ReactNode } from "react";

export default function BlockTitle({ children }: { children: ReactNode }) {
  return <h2 className="font-semibold mb-5 text-lg">{children}</h2>;
}
