import { dangerouslySkipEscape, escapeInject } from "vike/server";
import type { TPageContext } from "../shared";

function getPageTitle(pageContext: TPageContext, fallback = ""): string {
  pageContext as any;

  const title =
    // Title defined dynamically by data()
    pageContext.data?.title ||
    // Title defined statically by /pages/some-page/+title.js (or by `export default { title }` in /pages/some-page/+config.js)
    // The setting 'pageContext.config.title' is a custom setting we defined at ./+config.ts
    pageContext.config.title ||
    fallback;
  return title;
}

export function wrapHtml(pageContext: TPageContext, html: string = "") {
  return escapeInject`
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="/src/assets/src-favico.png" />
    <title>${getPageTitle(pageContext)}</title>
  </head>
  <body>
    <div id="root">${dangerouslySkipEscape(html)}</div>
  </body>
</html>`;
}
