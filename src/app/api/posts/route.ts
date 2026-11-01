import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { BlogSection } from '@/data/blog';
import { isAllowedImageUrl, verifyCoverImage } from '@/lib/images';
import { pathFromPublicUrl, removeObject } from '@/lib/media';
import { env } from '@/lib/env';

const supabaseUrl = env('SUPABASE_URL');
// Prefer the service-role key for writes (bypasses RLS); fall back to the
// publishable key, which can only read: supabase/schema.sql grants writes to
// service_role alone, so POST/PATCH/DELETE need SUPABASE_SERVICE_ROLE_KEY.
const writeKey =
    env('SUPABASE_SERVICE_ROLE_KEY') ||
    env('SUPABASE_PUBLISHABLE_KEY');

const API_TOKEN = env('BLOG_API_TOKEN');

// The blog keeps at most this many posts. Creating a post past the limit deletes
// the oldest ones (by date, then creation time), including their uploaded cover
// images. Override with BLOG_MAX_POSTS; default 300.
const MAX_POSTS = Math.max(1, Number(process.env.BLOG_MAX_POSTS) || 300);

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
// GET /api/posts?all=true with the token -> drafts included, with is_published
export async function GET(req: NextRequest) {
    const all = new URL(req.url).searchParams.get('all') === 'true';
    if (all && !isAuthorized(req)) {
        return json({ error: 'Unauthorized' }, 401);
    }
    try {
        let query = db()
            .from('blog_posts')
            .select(
                all
                    ? 'slug, title, excerpt, category, author, published_at, reading_time, cover_image, is_published'
                    : 'slug, title, excerpt, category, author, published_at, reading_time, cover_image'
            )
            .order('published_at', { ascending: false })
            .order('created_at', { ascending: false });
        if (!all) query = query.eq('is_published', true);
        const { data, error } = await query;

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

    if (payload.date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(payload.date)) {
        return json({ error: '`date` must be YYYY-MM-DD' }, 400);
    }
    if (payload.isPublished !== undefined && typeof payload.isPublished !== 'boolean') {
        return json({ error: '`isPublished` must be a boolean' }, 400);
    }

    const images = [payload.coverImage, ...(payload.sections ?? []).map((s) => s.image)].filter(
        (u): u is string => typeof u === 'string' && u !== ''
    );
    if (images.some((u) => !isAllowedImageUrl(u))) {
        return json({ error: 'Images must be https URLs from images.unsplash.com or uploaded through /api/media.' }, 400);
    }

    const warnings: string[] = [];
    let coverImage: string | null = null;
    if (payload.coverImage) {
        coverImage = await verifyCoverImage(payload.coverImage);
        if (!coverImage) warnings.push('coverImage could not be found, so the post uses its category image.');
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
        cover_image: coverImage,
        sections,
        is_published: payload.isPublished ?? true,
    };

    try {
        const { data, error } = await db()
            .from('blog_posts')
            .insert(row)
            .select('slug, title, category, author, published_at, reading_time, cover_image, is_published')
            .single();

        if (error) {
            const status = error.code === '23505' ? 409 : 500; // unique_violation -> 409
            return json({ error: error.message, code: error.code }, status);
        }

        // The post is saved; a failed clean-up must not turn that into an error.
        let pruned: string[] = [];
        try {
            pruned = await pruneOldest();
        } catch (e) {
            console.error('Failed to prune old blog posts:', (e as Error).message);
        }
        return json({ post: data, ...(pruned.length ? { pruned } : {}), ...(warnings.length ? { warnings } : {}) }, 201);
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

/** Delete every post beyond the newest MAX_POSTS. Returns the deleted slugs. */
async function pruneOldest(): Promise<string[]> {
    const client = db();
    const { data: excess, error } = await client
        .from('blog_posts')
        .select('id, slug, cover_image')
        .order('published_at', { ascending: false })
        .order('created_at', { ascending: false })
        .range(MAX_POSTS, MAX_POSTS + 999);
    if (error) throw new Error(error.message);
    if (!excess || excess.length === 0) return [];

    const { error: deleteError } = await client
        .from('blog_posts')
        .delete()
        .in('id', excess.map((p) => p.id));
    if (deleteError) throw new Error(deleteError.message);

    await Promise.all(excess.map((p) => removeObject(pathFromPublicUrl(p.cover_image))));
    return excess.map((p) => p.slug);
}
