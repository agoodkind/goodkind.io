import { ReactNode } from "react";

export default function Section({ children }: { children: ReactNode }) {
  return (
    <section className="section rounded-xl p-7 bg-white shadow">
      {children}
    </section>
  );
}
