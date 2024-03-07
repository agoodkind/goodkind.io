import React from "react";
import { Hero } from "./sections/hero";
import { Information } from "./sections/information";
import { Skills } from "./sections/skills";

export const app = function () {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/png" href="/src/assets/src-favico.png" />
        <title>Alex</title>
        <link href="styles/main.css" rel="stylesheet" />
      </head>
      <body className="bg-gray-100 antialiased">
        <div id="root">
          <React.StrictMode>
            <main className="container mx-auto w-full max-w-5xl p-4 sm:max-w-[640px] sm:p-5 md:max-w-3xl">
              <div className="grid gap-5">
                <div className="space-y-5">
                  <Hero />
                  <Information />
                  <Skills />
                </div>
              </div>
            </main>
          </React.StrictMode>
        </div>
      </body>
    </html>
  );
};
