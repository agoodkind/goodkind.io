import { renderToStaticMarkup } from "react-dom/server";
import { dangerouslySkipEscape, escapeInject } from "vike/server";
import type { OnRenderHtmlAsync, PageContext } from "vike/types";
import { PageLayout } from "./page-layout";

type TPageContext = {
  Page: () => JSX.Element;
  // this is some really shitty type work
  // wtf
  // vike really didn't even try here
  data: Record<string, unknown> & {
    title?: string;
  };
  config: Record<string, unknown> & {
    title?: string;
  };
} & PageContext;

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

export async function onRenderHtml(
  pageContext: TPageContext
): ReturnType<OnRenderHtmlAsync> {
  const { Page } = pageContext;

  if (!Page) {
    throw new Error("My onRenderHtml() hook expects pageContext.Page to be defined");
  }

  const pageHtml = renderToStaticMarkup(
    <PageLayout>
      <Page />
    </PageLayout>
  );

  const documentHtml = escapeInject`
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="/src/assets/src-favico.png" />
    <title>${getPageTitle(pageContext)}</title>
  </head>
  <body class="bg-gray-100 antialiased">
    <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
  </body>
</html>`;

  return {
    documentHtml,
    pageContext: {}
  };
}
