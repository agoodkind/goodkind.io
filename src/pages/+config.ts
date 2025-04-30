import vikeReact from "vike-react/config";
import type { Config } from "vike/types";
import Layout from "./Layout";

export default {
  prerender: true,
  extends: vikeReact,
  Layout,
} satisfies Config;
