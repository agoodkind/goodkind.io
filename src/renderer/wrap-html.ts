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

  const rawHTML = dangerouslySkipEscape(html);
  const pageTitle = dangerouslySkipEscape(getPageTitle(pageContext));
  const darkModeInit = dangerouslySkipEscape(require("nightwind/helper").init());

  return escapeInject`
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script async>${darkModeInit}</script>
    <link rel="icon" type="image/png" href="/assets/favicon.ico" />
    <title>${pageTitle}</title>
  <body>
    <div id="root">${rawHTML}</div>
  </body>
</html>`;
}
