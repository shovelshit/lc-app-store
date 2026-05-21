const UPSTREAM_BASE = 'http://appstore.cnmlynk.org/api';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  // 拼接上游 URL：/api/fs/list -> http://appstore.cnmlynk.org/api/fs/list
  const upstreamUrl = UPSTREAM_BASE + url.pathname.replace(/^\/api/, '') + url.search;

  const response = await fetch(upstreamUrl, {
    method: context.request.method,
    headers: context.request.headers,
    body: context.request.method !== 'GET' && context.request.method !== 'HEAD'
      ? context.request.body
      : undefined,
  });

  const newHeaders = new Headers(response.headers);
  newHeaders.set('Access-Control-Allow-Origin', '*');
  newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  newHeaders.set('Access-Control-Allow-Headers', 'Content-Type');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
