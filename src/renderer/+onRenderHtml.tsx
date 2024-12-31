import { renderToStaticMarkup, renderToString } from "react-dom/server";
import type { OnRenderHtmlAsync } from "vike/types";
import type { TPageContext } from "../shared";
import { PageLayout } from "./page-layout";
import { wrapHtml } from "./wrap-html";

export async function onRenderHtml(
  pageContext: TPageContext
): ReturnType<OnRenderHtmlAsync> {
  const { Page } = pageContext;

  if (!Page) {
    throw new Error("onRenderHtml() hook expects pageContext.Page to be defined");
  }

  const toRender = (
    <PageLayout>
      <Page />
    </PageLayout>
  );

  // in dev we can enable react client side hydration
  const pageHtml = process.env.DEV
    ? renderToString(toRender, {})
    : renderToStaticMarkup(toRender);

  return {
    documentHtml: wrapHtml(pageContext, pageHtml),
    pageContext: {} // I also hate this design, name it something fucking else if we arent supposed to return it
  };
}
