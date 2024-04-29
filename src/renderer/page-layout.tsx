import "@styles/main.tailwind.css";
// @ts-ignore
import nightwind from "nightwind/helper";
import React from "react";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.StrictMode>
      <div className=" bg-gray-100 flex h-[100vh] w-full antialiased dark:bg-neutral-50">
        <main className={"container mx-auto w-full max-w-xl p-4 sm:max-w-3xl sm:p-5"}>
          <script dangerouslySetInnerHTML={{ __html: nightwind.init() }} />
          <div className={"grid gap-5"}>
            <div className={"space-y-5"}>{children}</div>
          </div>
        </main>
      </div>
    </React.StrictMode>
  );
}
