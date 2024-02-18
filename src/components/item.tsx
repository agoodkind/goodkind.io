import { ReactNode } from "react";

export function Item({ children }: { children: ReactNode }) {
  return <div className="flex items-center space-x-2">{children}</div>;
}
