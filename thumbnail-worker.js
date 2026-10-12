// Stillroom private-thumbnail relay. Deploy as a Cloudflare Worker you own.
// Set the APP_ORIGIN variable to the exact origin of your GitHub Pages site.
// This worker does not store tokens, file metadata, or image bytes.
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowedOrigin = env.APP_ORIGIN || '';
    const cors = {
      'Access-Control-Allow-Origin': origin === allowedOrigin ? origin : 'null',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Vary': 'Origin'
    };
    if (!allowedOrigin || origin !== allowedOrigin) return new Response('Forbidden origin', { status: 403, headers: cors });
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'GET') return new Response('Method not allowed', { status: 405, headers: cors });
    const token = request.headers.get('Authorization');
    const fileId = new URL(request.url).searchParams.get('fileId');
    if (!token || !fileId || !/^[a-zA-Z0-9_-]+$/.test(fileId)) return new Response('Missing or invalid request', { status: 400, headers: cors });

    // Ask Drive for the current short-lived thumbnail URL, then stream it straight back.
    const meta = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?fields=thumbnailLink`, {
      headers: { Authorization: token }
    });
    if (!meta.ok) return new Response('Drive could not provide this thumbnail', { status: meta.status, headers: cors });
    const { thumbnailLink } = await meta.json();
    if (!thumbnailLink || !thumbnailLink.startsWith('https://')) return new Response('No thumbnail available', { status: 404, headers: cors });
    const image = await fetch(thumbnailLink, { headers: { Authorization: token } });
    if (!image.ok) return new Response('Thumbnail could not be loaded', { status: image.status, headers: cors });
    const headers = new Headers(cors);
    headers.set('Content-Type', image.headers.get('Content-Type') || 'image/jpeg');
    headers.set('Cache-Control', 'no-store, private');
    headers.set('X-Content-Type-Options', 'nosniff');
    return new Response(image.body, { status: 200, headers });
  }
};
