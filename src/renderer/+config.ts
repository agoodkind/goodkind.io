import type { Config } from "vike/types";

export default {
  meta: {
    Page: {
      env: { server: true }
    },
    title: {
      env: { server: true }
    }
  }
} satisfies Config;
