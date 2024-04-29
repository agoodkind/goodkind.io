import type { PageContext } from "vike/types";

export type TPageContext = {
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
  isHydration: boolean;
  enableEagerStreaming: boolean;
} & PageContext;


