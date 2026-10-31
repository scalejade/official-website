import { NextResponse } from 'next/server';

const CORS_HEADERS: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
    'Access-Control-Max-Age': '86400',
};

export function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

const spec = {
    name: 'ScaleJade Content API',
    version: '1.0.0',
    description: 'Create and manage blog posts, projects (case studies) and media stored in Supabase. Research papers: see /api/docs/research.',
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
            description: 'Create a post. `slug` and `reading_time` are auto-generated if omitted. The blog keeps the newest 300 posts (by date): creating one beyond that deletes the oldest, and their slugs are returned as `pruned`.',
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
        {
            method: 'PATCH',
            path: '/api/posts/{slug}',
            auth: true,
            description: 'Update any subset of a post. Send `isPublished: false` to unpublish without deleting.',
            body: {
                title: 'string', slug: 'string (renames the URL)', excerpt: 'string', category: 'string',
                author: 'string', date: 'YYYY-MM-DD', readingTime: 'string', coverImage: 'string | null',
                sections: 'Array<{ heading?, paragraphs: string[], image?, imageCaption? }>', isPublished: 'boolean',
            },
            responses: { '200': '{ post }', '400': 'Validation error', '401': 'Unauthorized', '404': 'Not found', '409': 'Slug taken' },
            example: {
                curl: `curl -X PATCH https://scalejade.com/api/posts/how-we-ship-reliable-software \\
  -H "Authorization: Bearer $BLOG_API_TOKEN" -H "Content-Type: application/json" \\
  -d '{ "excerpt": "Updated summary", "isPublished": true }'`,
            },
        },
        {
            method: 'POST',
            path: '/api/media',
            auth: true,
            description:
                'Upload an image to the public media bucket and get its URL — use it as a post coverImage / section image, a project clientLogoUrl, or a project image. Types: jpeg, png, webp, avif, gif (no SVG).',
            body: {
                'multipart/form-data': 'file (≤4 MB), folder? (projects | blog | papers | misc) -> 201 { url, path }',
                'application/json': '{ contentType, folder? } -> 201 { uploadUrl, token, path, url }. Then PUT the bytes to uploadUrl with the same Content-Type. Use this for files over 4 MB.',
            },
            example: {
                curl: `curl -X POST https://scalejade.com/api/media \\
  -H "Authorization: Bearer $BLOG_API_TOKEN" \\
  -F "file=@cover.jpg" -F "folder=blog"`,
            },
        },
        {
            method: 'GET',
            path: '/api/projects',
            auth: false,
            description:
                'List published projects in display order. Confidential projects are redacted: clientName, clientLogoUrl and quote.name are null, and images flagged isConfidential are omitted. With the token and ?all=true: every project, unredacted, including unpublished.',
            response: {
                projects: [
                    {
                        slug: 'string', title: 'string', summary: 'string',
                        clientName: 'string | null', clientClassification: 'string', clientLogoUrl: 'string | null',
                        isConfidential: 'boolean',
                        sector: 'finance | public | education | energy_mining | manufacturing | healthcare | wholesale',
                        challenge: 'string | null', constraints: 'string[]', built: 'string[]',
                        role: 'string | null', team: 'string | null', duration: 'string | null',
                        highlights: 'string[]', outcomes: '{ value, label }[]', techStack: 'string[]',
                        quote: '{ text, name | null, role } | null', isFeatured: 'boolean', sortOrder: 'number',
                        images: '{ id, url, alt, caption, kind, sortOrder }[]',
                    },
                ],
            },
        },
        {
            method: 'GET',
            path: '/api/projects/{slug}',
            auth: false,
            description: 'One project, redacted as above. With the token: unredacted, including unpublished.',
        },
        {
            method: 'POST',
            path: '/api/projects',
            auth: true,
            description:
                'Create a project. Every case-study field is optional; the page shows a section only when it is filled. isConfidential defaults to true. `images` may reference external URLs or `path`s returned by POST /api/media.',
            body: {
                title: 'string (required)',
                sector: 'string (required): finance | public | education | energy_mining | manufacturing | healthcare | wholesale',
                slug: 'string (optional, from title)', summary: 'string',
                clientName: 'string | null', clientClassification: 'string, e.g. "Indonesian state-owned bank"',
                clientLogoUrl: 'string | null', isConfidential: 'boolean (default true)',
                challenge: 'string', constraints: 'string[] (named regulations)', built: 'string[]',
                role: 'string', team: 'string', duration: 'string',
                highlights: 'string[]', outcomes: '{ value: string, label: string }[]', techStack: 'string[]',
                quote: '{ text, name, role } | null',
                isPublished: 'boolean (default true)', isFeatured: 'boolean (home-page highlight)', sortOrder: 'integer (ascending)',
                images: 'Array<{ url | path, alt?, caption?, kind?: field | product | architecture | team | other, isConfidential?, sortOrder? }>',
            },
            responses: { '201': '{ project } (unredacted)', '400': 'Validation error', '401': 'Unauthorized', '409': 'Slug taken' },
            example: {
                curl: `curl -X POST https://scalejade.com/api/projects \\
  -H "Authorization: Bearer $BLOG_API_TOKEN" -H "Content-Type: application/json" \\
  -d '{
    "title": "Real-time AML Screening",
    "sector": "finance",
    "clientName": "Example Bank",
    "clientClassification": "Indonesian private bank",
    "isConfidential": true,
    "summary": "Screening inside the payment path, under 50 ms at p99.",
    "constraints": ["APU-PPT", "BI-FAST"],
    "outcomes": [{ "value": "< 50 ms", "label": "p99 screening latency in production" }],
    "techStack": ["Go", "Kafka", "PostgreSQL"],
    "images": [{ "url": "https://…/dashboard.jpg", "alt": "Screening dashboard", "kind": "product" }]
  }'`,
            },
        },
        {
            method: 'PATCH',
            path: '/api/projects/{slug}',
            auth: true,
            description: 'Update any subset of fields (same names as POST, except images). E.g. { "isConfidential": false } once the client approves being named.',
        },
        {
            method: 'DELETE',
            path: '/api/projects/{slug}',
            auth: true,
            description: 'Delete a project, its gallery rows and their uploaded files.',
        },
        {
            method: 'POST',
            path: '/api/projects/{slug}/images',
            auth: true,
            description:
                'Add a gallery image. kind: field (implementation on site) | product (the live app) | architecture | team | other. isConfidential: hide this image while the project is confidential (e.g. it shows the client\'s branding).',
            body: {
                'multipart/form-data': 'file (≤4 MB), alt, caption, kind, isConfidential ("true"/"false"), sortOrder',
                'application/json': '{ path } from POST /api/media, or { url } for an external image; plus alt, caption, kind, isConfidential, sortOrder',
            },
            responses: { '201': '{ image }', '400': 'Validation error', '401': 'Unauthorized', '404': 'Project not found', '413': 'Too large — use a signed upload', '415': 'Unsupported type' },
            example: {
                curl: `curl -X POST https://scalejade.com/api/projects/core-banking-settlement/images \\
  -H "Authorization: Bearer $BLOG_API_TOKEN" \\
  -F "file=@ops-room.jpg" -F "alt=Operations room during cut-over" \\
  -F "caption=Cut-over weekend, Jakarta" -F "kind=field" -F "isConfidential=true"`,
            },
        },
        {
            method: 'PATCH',
            path: '/api/projects/{slug}/images/{id}',
            auth: true,
            description: 'Update alt, caption, kind, isConfidential or sortOrder of a gallery image.',
        },
        {
            method: 'DELETE',
            path: '/api/projects/{slug}/images/{id}',
            auth: true,
            description: 'Remove a gallery image and its uploaded file.',
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
              : 'response' in e && e.response
                ? `<h4>Response</h4><pre>${JSON.stringify(e.response, null, 2)}</pre>`
                : ''
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
