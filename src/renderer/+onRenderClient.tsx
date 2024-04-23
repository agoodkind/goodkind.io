// https://vike.dev/onRenderClient
export { onRenderClient };

import { createRoot, hydrateRoot } from "react-dom/client";
import type { OnRenderClientAsync } from "vike/types";
import type { TPageContext } from "../shared";
import { PageLayout } from "./page-layout";

async function onRenderClient(
  pageContext: TPageContext
): ReturnType<OnRenderClientAsync> {
  const { Page, isHydration } = pageContext;

  if (!Page) {
    throw new Error("onRenderClient() hook expects pageContext.Page to be defined");
  }

  const root = document.getElementById("root");

  if (!root) {
    throw new Error("root element not found");
  }

  const pageElements = (
    <PageLayout>
      <Page />
    </PageLayout>
  );

  if (isHydration) {
    hydrateRoot(root, pageElements);
  } else {
    createRoot(root).render(pageElements);
  }
}
