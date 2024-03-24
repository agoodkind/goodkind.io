import React from "react";
import { Hero } from "./sections/hero";
import { Information } from "./sections/information";
import { Skills } from "./sections/skills";
import "./styles/main.tailwind.css";

export const app = function (): React.JSX.Element {
  return (
    <html lang={"en"}>
      <head>
        <meta charSet={"UTF-8"} />
        <meta
          name={"viewport"}
          content={"width=device-width, initial-scale=1.0"}
        />
        <link
          rel={"icon"}
          type={"image/png"}
          href={"/src/assets/src-favico.png"}
        />
        <title>{"Alex"}</title>
      </head>
      <body className={"bg-gray-100 antialiased"}>
        <React.StrictMode>
          <main
            className={
              "container mx-auto w-full max-w-5xl p-4 sm:max-w-[640px] sm:p-5 md:max-w-3xl"
            }
          >
            <div className={"grid gap-5"}>
              <div className={"space-y-5"}>
                <Hero />
                <Information />
                <Skills />
              </div>
            </div>
          </main>
        </React.StrictMode>
        <script src={"/src/client.ts"} type={"module"} />
      </body>
    </html>
  );
};