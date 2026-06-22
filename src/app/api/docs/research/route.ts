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
    name: 'ScaleJade Research API',
    version: '1.0.0',
    description: 'Create and list research papers (the /research page) stored in Supabase.',
    baseUrl: '/api',
    auth: {
        type: 'API token',
        description:
            'Write endpoints require the PAPERS_API_TOKEN (falls back to BLOG_API_TOKEN). Send it as `Authorization: Bearer <token>` or `x-api-key: <token>`. Read endpoints are public.',
    },
    cors: 'All origins allowed (Access-Control-Allow-Origin: *).',
    endpoints: [
        {
            method: 'GET',
            path: '/api/papers',
            auth: false,
            description: 'List published papers (newest first), without abstract, sections, links, or bibtex.',
            response: {
                papers: [
                    {
                        slug: 'string',
                        title: 'string',
                        summary: 'string',
                        authors: 'string[]',
                        published_at: 'YYYY-MM-DD',
                        topics: 'string[]',
                        venue: 'string | null',
                    },
                ],
            },
        },
        {
            method: 'POST',
            path: '/api/papers',
            auth: true,
            description: 'Create a paper. `slug` is auto-generated from the title if omitted.',
            body: {
                title: 'string (required)',
                abstract: 'string (required) — full abstract shown on the detail page',
                summary: 'string (optional) — short blurb shown on the index card',
                slug: 'string (optional, slugified)',
                authors: 'string[] (optional, default ["ScaleJade Research"])',
                date: 'YYYY-MM-DD (optional, default today) — publication date',
                topics: 'string[] (optional) — tags used for filtering',
                venue: 'string (optional) — e.g. "Preprint · 2026"',
                links: '{ pdf?, arxiv?, code?, dataset? } (optional)',
                sections: 'Array<{ heading: string; paragraphs: string[] }> (optional)',
                bibtex: 'string (optional)',
                isPublished: 'boolean (optional, default true)',
            },
            responses: {
                '201': '{ paper: { slug, title, authors, published_at, topics, venue } }',
                '400': 'Invalid body / validation error',
                '401': 'Missing or invalid API token',
                '409': 'A paper with that slug already exists',
                '500': 'Server / database error',
            },
            example: {
                curl: `curl -X POST https://scalejade.com/api/papers \\
  -H "Authorization: Bearer $PAPERS_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Scaling Retrieval-Augmented Agents",
    "summary": "A study of memory and retrieval strategies for long-horizon agents.",
    "abstract": "We investigate how retrieval-augmented generation...",
    "authors": ["Jane Doe", "ScaleJade Research"],
    "date": "2026-06-22",
    "topics": ["Agents", "Retrieval"],
    "venue": "Preprint · 2026",
    "links": { "pdf": "https://example.com/paper.pdf", "arxiv": "https://arxiv.org/abs/0000.00000" },
    "sections": [
      { "heading": "Introduction", "paragraphs": ["..."] },
      { "heading": "Method", "paragraphs": ["...", "..."] }
    ],
    "bibtex": "@article{doe2026, ... }"
  }'`,
            },
        },
        {
            method: 'GET',
            path: '/api/papers/{slug}',
            auth: false,
            description: 'Fetch a single published paper by slug, including abstract, sections, links, and bibtex.',
            response: { paper: { slug: 'string', title: 'string', abstract: 'string', sections: '[...]', '...': '...' } },
        },
        {
            method: 'DELETE',
            path: '/api/papers/{slug}',
            auth: true,
            description: 'Delete a specific paper by slug.',
            responses: {
                '200': '{ deleted: { slug, title, published_at } }',
                '401': 'Missing or invalid API token',
                '404': 'No paper with that slug',
                '500': 'Server / database error',
            },
            example: {
                curl: `curl -X DELETE https://scalejade.com/api/papers/scaling-retrieval-augmented-agents \\
  -H "Authorization: Bearer $PAPERS_API_TOKEN"`,
            },
        },
        {
            method: 'DELETE',
            path: '/api/papers?oldest=true',
            auth: true,
            description: 'Delete the oldest paper (earliest published_at).',
            responses: {
                '200': '{ deleted: { slug, title, published_at } }',
                '400': 'Missing ?oldest=true',
                '401': 'Missing or invalid API token',
                '404': 'No papers to delete',
                '500': 'Server / database error',
            },
            example: {
                curl: `curl -X DELETE "https://scalejade.com/api/papers?oldest=true" \\
  -H "Authorization: Bearer $PAPERS_API_TOKEN"`,
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

    <p class="muted">Machine-readable spec: <a href="/api/docs/research?format=json">/api/docs/research?format=json</a></p>
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
