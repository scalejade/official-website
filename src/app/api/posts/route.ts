import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { BlogSection } from '@/data/blog';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Prefer the service-role key for writes (bypasses RLS); fall back to the
// publishable key (requires an insert RLS policy — see migration 0003).
const writeKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const API_TOKEN = process.env.BLOG_API_TOKEN;

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

function estimateReadingTime(sections: BlogSection[]): string {
    const words = sections
        .flatMap((s) => [s.heading ?? '', ...(s.paragraphs ?? [])])
        .join(' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
}

function isAuthorized(req: NextRequest): boolean {
    if (!API_TOKEN) return false; // refuse writes until a token is configured
    const auth = req.headers.get('authorization');
    const bearer = auth?.startsWith('Bearer ') ? auth.slice(7) : undefined;
    const headerKey = req.headers.get('x-api-key') ?? undefined;
    return bearer === API_TOKEN || headerKey === API_TOKEN;
}

type PostPayload = {
    title?: string;
    slug?: string;
    excerpt?: string;
    category?: string;
    author?: string;
    date?: string; // YYYY-MM-DD
    readingTime?: string;
    coverImage?: string;
    sections?: BlogSection[];
    isPublished?: boolean;
};

function validateSections(sections: unknown): sections is BlogSection[] {
    if (!Array.isArray(sections) || sections.length === 0) return false;
    return sections.every(
        (s) =>
            s &&
            typeof s === 'object' &&
            Array.isArray((s as BlogSection).paragraphs) &&
            (s as BlogSection).paragraphs.every((p) => typeof p === 'string')
    );
}

// GET /api/posts  -> list published posts (lightweight)
export async function GET() {
    try {
        const { data, error } = await db()
            .from('blog_posts')
            .select('slug, title, excerpt, category, author, published_at, reading_time, cover_image')
            .order('published_at', { ascending: false });

        if (error) {
            return json({ error: error.message }, 500);
        }
        return json({ posts: data });
    } catch (e) {
        return json({ error: (e as Error).message }, 500);
    }
}

// POST /api/posts  -> create a post
export async function POST(req: NextRequest) {
    if (!isAuthorized(req)) {
        return json({ error: 'Unauthorized' }, 401);
    }

    let payload: PostPayload;
    try {
        payload = await req.json();
    } catch {
        return json({ error: 'Invalid JSON body' }, 400);
    }

    if (!payload.title || typeof payload.title !== 'string') {
        return json({ error: '`title` is required' }, 400);
    }
    if (!validateSections(payload.sections)) {
        return json({ error: '`sections` must be a non-empty array of { heading?, paragraphs: string[], image?, imageCaption? }' }, 400);
    }

    const sections = payload.sections as BlogSection[];
    const row = {
        slug: payload.slug ? slugify(payload.slug) : slugify(payload.title),
        title: payload.title,
        excerpt: payload.excerpt ?? '',
        category: payload.category ?? '',
        author: payload.author ?? 'ScaleJade',
        published_at: payload.date ?? new Date().toISOString().slice(0, 10),
        reading_time: payload.readingTime ?? estimateReadingTime(sections),
        cover_image: payload.coverImage ?? null,
        sections,
        is_published: payload.isPublished ?? true,
    };

    try {
        const { data, error } = await db()
            .from('blog_posts')
            .insert(row)
            .select('slug, title, category, author, published_at, reading_time, cover_image')
            .single();

        if (error) {
            const status = error.code === '23505' ? 409 : 500; // unique_violation -> 409
            return json({ error: error.message, code: error.code }, status);
        }
        return json({ post: data }, 201);
    } catch (e) {
        return json({ error: (e as Error).message }, 500);
    }
}

// DELETE /api/posts?oldest=true  -> delete the oldest post
export async function DELETE(req: NextRequest) {
    if (!isAuthorized(req)) {
        return json({ error: 'Unauthorized' }, 401);
    }

    const url = new URL(req.url);
    if (url.searchParams.get('oldest') !== 'true') {
        return json(
            { error: 'Pass ?oldest=true to delete the oldest post, or DELETE /api/posts/{slug} for a specific one.' },
            400
        );
    }

    try {
        const client = db();
        const { data: oldest, error: findErr } = await client
            .from('blog_posts')
            .select('slug')
            .order('published_at', { ascending: true })
            .limit(1)
            .maybeSingle();

        if (findErr) return json({ error: findErr.message }, 500);
        if (!oldest) return json({ error: 'No posts to delete' }, 404);

        const { data, error } = await client
            .from('blog_posts')
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
