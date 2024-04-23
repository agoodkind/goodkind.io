import type { Config } from "vike/types";

export default {
  meta: {
    Page: {
      env: { server: true, client: Boolean(process.env.DEV) }
    },
    title: {
      env: { server: true, client: Boolean(process.env.DEV) }
    }
  }
} satisfies Config;
