const DOMAIN = "goodkind.io";
const GH_USER = "agoodkind";

interface Env {
  ASSETS: Fetcher;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);

  if (url.searchParams.get("go-get") !== "1") {
    return context.env.ASSETS.fetch(context.request);
  }

  const pkg = url.pathname.replace(/^\//, "").replace(/\/$/, "");
  if (!pkg) {
    return context.env.ASSETS.fetch(context.request);
  }

  const root = pkg.split("/")[0];
  const repoURL = `https://github.com/${GH_USER}/${root}`;

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="go-import" content="${DOMAIN}/${root} git ${repoURL}">
<meta name="go-source" content="${DOMAIN}/${root} ${repoURL} ${repoURL}/tree/main{/dir} ${repoURL}/blob/main{/dir}/{file}#L{line}">
<meta http-equiv="refresh" content="0; url=${repoURL}">
</head>
<body>
Redirecting to <a href="${repoURL}">${repoURL}</a>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};
