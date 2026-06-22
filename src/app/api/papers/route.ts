import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { PaperSection, PaperLinks } from '@/data/papers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Prefer the service-role key for writes (bypasses RLS); fall back to the
// publishable key (requires insert RLS policies — see migration 0006).
const writeKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Reuse the blog token if a papers-specific one isn't set.
const API_TOKEN = process.env.PAPERS_API_TOKEN || process.env.BLOG_API_TOKEN;

const CORS_HEADERS: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
    'Access-Control-Max-Age': '86400',
};

function json(body: unknown, status = 200) {
    return NextResponse.json(body, { status, headers: CORS_HEADERS });
}

// CORS preflight
export function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

function db() {
    if (!supabaseUrl || !writeKey) {
        throw new Error('Missing Supabase environment variables.');
    }
    return createClient(supabaseUrl, writeKey, { auth: { persistSession: false } });
}

function slugify(s: string): string {
    return s
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function isAuthorized(req: NextRequest): boolean {
    if (!API_TOKEN) return false; // refuse writes until a token is configured
    const auth = req.headers.get('authorization');
    const bearer = auth?.startsWith('Bearer ') ? auth.slice(7) : undefined;
    const headerKey = req.headers.get('x-api-key') ?? undefined;
    return bearer === API_TOKEN || headerKey === API_TOKEN;
}

type PaperPayload = {
    title?: string;
    slug?: string;
    summary?: string;
    abstract?: string;
    authors?: string[];
    date?: string; // YYYY-MM-DD
    topics?: string[];
    venue?: string;
    links?: PaperLinks;
    sections?: PaperSection[];
    bibtex?: string;
    isPublished?: boolean;
};

function isStringArray(v: unknown): v is string[] {
    return Array.isArray(v) && v.every((x) => typeof x === 'string');
}

function validateSections(sections: unknown): sections is PaperSection[] {
    if (!Array.isArray(sections)) return false;
    return sections.every(
        (s) =>
            s &&
            typeof s === 'object' &&
            typeof (s as PaperSection).heading === 'string' &&
            Array.isArray((s as PaperSection).paragraphs) &&
            (s as PaperSection).paragraphs.every((p) => typeof p === 'string')
    );
}

// GET /api/papers  -> list published papers (lightweight)
export async function GET() {
    try {
        const { data, error } = await db()
            .from('papers')
            .select('slug, title, summary, authors, published_at, topics, venue')
            .eq('is_published', true)
            .order('published_at', { ascending: false });

        if (error) return json({ error: error.message }, 500);
        return json({ papers: data });
    } catch (e) {
        return json({ error: (e as Error).message }, 500);
    }
}

// POST /api/papers  -> create a paper
export async function POST(req: NextRequest) {
    if (!isAuthorized(req)) {
        return json({ error: 'Unauthorized' }, 401);
    }

    let payload: PaperPayload;
    try {
        payload = await req.json();
    } catch {
        return json({ error: 'Invalid JSON body' }, 400);
    }

    if (!payload.title || typeof payload.title !== 'string') {
        return json({ error: '`title` is required' }, 400);
    }
    if (!payload.abstract || typeof payload.abstract !== 'string') {
        return json({ error: '`abstract` is required' }, 400);
    }
    if (payload.authors !== undefined && !isStringArray(payload.authors)) {
        return json({ error: '`authors` must be an array of strings' }, 400);
    }
    if (payload.topics !== undefined && !isStringArray(payload.topics)) {
        return json({ error: '`topics` must be an array of strings' }, 400);
    }
    if (payload.sections !== undefined && !validateSections(payload.sections)) {
        return json({ error: '`sections` must be an array of { heading: string, paragraphs: string[] }' }, 400);
    }

    const row = {
        slug: payload.slug ? slugify(payload.slug) : slugify(payload.title),
        title: payload.title,
        summary: payload.summary ?? '',
        abstract: payload.abstract,
        authors: payload.authors ?? ['ScaleJade Research'],
        published_at: payload.date ?? new Date().toISOString().slice(0, 10),
        topics: payload.topics ?? [],
        venue: payload.venue ?? null,
        links: payload.links ?? {},
        sections: payload.sections ?? [],
        bibtex: payload.bibtex ?? null,
        is_published: payload.isPublished ?? true,
    };

    try {
        const { data, error } = await db()
            .from('papers')
            .insert(row)
            .select('slug, title, authors, published_at, topics, venue')
            .single();

        if (error) {
            const status = error.code === '23505' ? 409 : 500; // unique_violation -> 409
            return json({ error: error.message, code: error.code }, status);
        }
        return json({ paper: data }, 201);
    } catch (e) {
        return json({ error: (e as Error).message }, 500);
    }
}

// DELETE /api/papers?oldest=true  -> delete the oldest paper
export async function DELETE(req: NextRequest) {
    if (!isAuthorized(req)) {
        return json({ error: 'Unauthorized' }, 401);
    }

    const url = new URL(req.url);
    if (url.searchParams.get('oldest') !== 'true') {
        return json(
            { error: 'Pass ?oldest=true to delete the oldest paper, or DELETE /api/papers/{slug} for a specific one.' },
            400
        );
    }

    try {
        const client = db();
        const { data: oldest, error: findErr } = await client
            .from('papers')
            .select('slug')
            .order('published_at', { ascending: true })
            .limit(1)
            .maybeSingle();

        if (findErr) return json({ error: findErr.message }, 500);
        if (!oldest) return json({ error: 'No papers to delete' }, 404);

        const { data, error } = await client
            .from('papers')
            .delete()
            .eq('slug', oldest.slug)
            .select('slug, title, published_at')
            .single();

        if (error) return json({ error: error.message }, 500);
        return json({ deleted: data });
    } catch (e) {
        return json({ error: (e as Error).message }, 500);
    }
}
