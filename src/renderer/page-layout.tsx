import "@styles/main.tailwind.css";
import React from "react";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return <React.StrictMode>{children}</React.StrictMode>;
}
