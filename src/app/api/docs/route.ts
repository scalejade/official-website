import { NextResponse } from 'next/server';

const CORS_HEADERS: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
    'Access-Control-Max-Age': '86400',
};

export function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

const spec = {
    name: 'ScaleJade Blog API',
    version: '1.0.0',
    description: 'Create and list blog posts stored in Supabase.',
    baseUrl: '/api',
    auth: {
        type: 'API token',
        description:
            'Write endpoints require the BLOG_API_TOKEN. Send it as `Authorization: Bearer <token>` or `x-api-key: <token>`. Read endpoints are public.',
    },
    cors: 'All origins allowed (Access-Control-Allow-Origin: *).',
    endpoints: [
        {
            method: 'GET',
            path: '/api/posts',
            auth: false,
            description: 'List published posts (newest first), without full body sections.',
            response: {
                posts: [
                    {
                        slug: 'string',
                        title: 'string',
                        excerpt: 'string',
                        category: 'string',
                        author: 'string',
                        published_at: 'YYYY-MM-DD',
                        reading_time: 'string',
                        cover_image: 'string | null',
                    },
                ],
            },
        },
        {
            method: 'POST',
            path: '/api/posts',
            auth: true,
            description: 'Create a post. `slug` and `reading_time` are auto-generated if omitted.',
            body: {
                title: 'string (required)',
                sections:
                    'Array<{ heading?: string; paragraphs: string[]; image?: string; imageCaption?: string }> (required, non-empty)',
                slug: 'string (optional, slugified)',
                excerpt: 'string (optional)',
                category: 'string (optional)',
                author: 'string (optional, default "ScaleJade")',
                date: 'YYYY-MM-DD (optional, default today)',
                readingTime: 'string (optional, auto-estimated)',
                coverImage: 'string (optional; falls back to a category image)',
                isPublished: 'boolean (optional, default true)',
            },
            responses: {
                '201': '{ post: { slug, title, category, author, published_at, reading_time, cover_image } }',
                '400': 'Invalid body / validation error',
                '401': 'Missing or invalid API token',
                '409': 'A post with that slug already exists',
                '500': 'Server / database error',
            },
            example: {
                curl: `curl -X POST https://scalejade.com/api/posts \\
  -H "Authorization: Bearer $BLOG_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "How We Ship Reliable Software",
    "category": "Software Engineering",
    "excerpt": "Reliability is a product of ownership, not heroics.",
    "coverImage": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80",
    "sections": [
      { "paragraphs": ["Opening paragraph...", "Second paragraph..."] },
      { "heading": "What we do", "paragraphs": ["..."], "image": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1600&q=80", "imageCaption": "Caption" }
    ]
  }'`,
            },
        },
        {
            method: 'GET',
            path: '/api/posts/{slug}',
            auth: false,
            description: 'Fetch a single published post by slug, including full body sections.',
            response: { post: { slug: 'string', title: 'string', sections: '[...]', '...': '...' } },
        },
        {
            method: 'DELETE',
            path: '/api/posts/{slug}',
            auth: true,
            description: 'Delete a specific post by slug.',
            responses: {
                '200': '{ deleted: { slug, title, published_at } }',
                '401': 'Missing or invalid API token',
                '404': 'No post with that slug',
                '500': 'Server / database error',
            },
            example: {
                curl: `curl -X DELETE https://scalejade.com/api/posts/how-we-ship-reliable-software \\
  -H "Authorization: Bearer $BLOG_API_TOKEN"`,
            },
        },
        {
            method: 'DELETE',
            path: '/api/posts?oldest=true',
            auth: true,
            description: 'Delete the oldest post (earliest published_at).',
            responses: {
                '200': '{ deleted: { slug, title, published_at } }',
                '400': 'Missing ?oldest=true',
                '401': 'Missing or invalid API token',
                '404': 'No posts to delete',
                '500': 'Server / database error',
            },
            example: {
                curl: `curl -X DELETE "https://scalejade.com/api/posts?oldest=true" \\
  -H "Authorization: Bearer $BLOG_API_TOKEN"`,
            },
        },
    ],
};

function html(): string {
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>${spec.name} — Docs</title>
<style>
  :root { color-scheme: light; }
  body { font: 15px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; background: #f8fafc; margin: 0; }
  .wrap { max-width: 860px; margin: 0 auto; padding: 48px 24px 96px; }
  h1 { font-size: 30px; margin: 0 0 4px; letter-spacing: -.02em; }
  .muted { color: #64748b; }
  .badge { display:inline-block; font-weight:700; font-size:12px; letter-spacing:.05em; padding:3px 8px; border-radius:6px; color:#fff; }
  .get { background:#0e7490; } .post { background:#15803d; } .delete { background:#b91c1c; }
  .ep { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:22px 24px; margin:18px 0; }
  .ep code.path { font-size:16px; font-weight:600; margin-left:8px; }
  pre { background:#0f172a; color:#e2e8f0; padding:16px; border-radius:10px; overflow:auto; font-size:13px; }
  code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  table { border-collapse: collapse; width:100%; margin-top:8px; }
  td, th { text-align:left; padding:6px 10px; border-bottom:1px solid #eef2f7; vertical-align:top; }
  th { color:#64748b; font-weight:600; font-size:12px; text-transform:uppercase; letter-spacing:.05em; }
  .pill { font-size:12px; color:#475569; background:#f1f5f9; border:1px solid #e2e8f0; border-radius:999px; padding:2px 10px; }
  a { color:#15803d; }
</style>
</head>
<body>
  <div class="wrap">
    <h1>${spec.name}</h1>
    <p class="muted">${spec.description} &middot; v${spec.version}</p>
    <p><span class="pill">Base URL: ${spec.baseUrl}</span> <span class="pill">CORS: all origins</span></p>

    <h3>Authentication</h3>
    <p class="muted">${spec.auth.description}</p>

    ${spec.endpoints
        .map(
            (e) => `
    <div class="ep">
      <span class="badge ${e.method.toLowerCase()}">${e.method}</span>
      <code class="path">${e.path}</code>
      ${e.auth ? '<span class="pill" style="float:right">🔒 token required</span>' : '<span class="pill" style="float:right">public</span>'}
      <p>${e.description}</p>
      ${
          'body' in e && e.body
              ? `<h4>Request body</h4><table><tr><th>Field</th><th>Type / notes</th></tr>${Object.entries(
                    e.body
                )
                    .map(([k, v]) => `<tr><td><code>${k}</code></td><td class="muted">${v}</td></tr>`)
                    .join('')}</table>`
              : ''
      }
      ${
          'responses' in e && e.responses
              ? `<h4>Responses</h4><table><tr><th>Status</th><th>Body</th></tr>${Object.entries(
                    e.responses
                )
                    .map(([k, v]) => `<tr><td><code>${k}</code></td><td class="muted">${v}</td></tr>`)
                    .join('')}</table>`
              : `<h4>Response</h4><pre>${JSON.stringify(e.response, null, 2)}</pre>`
      }
      ${'example' in e && e.example ? `<h4>Example</h4><pre>${e.example.curl}</pre>` : ''}
    </div>`
        )
        .join('')}

    <p class="muted">Machine-readable spec: <a href="/api/docs?format=json">/api/docs?format=json</a></p>
  </div>
</body>
</html>`;
}

export async function GET(req: Request) {
    const url = new URL(req.url);
    if (url.searchParams.get('format') === 'json') {
        return NextResponse.json(spec, { headers: CORS_HEADERS });
    }
    return new NextResponse(html(), {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'text/html; charset=utf-8' },
    });
}
