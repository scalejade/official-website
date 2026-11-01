import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { BlogSection } from '@/data/blog';
import { slugify } from '@/lib/api';
import { isAllowedImageUrl, verifyCoverImage } from '@/lib/images';
import { env } from '@/lib/env';

const supabaseUrl = env('SUPABASE_URL');
const writeKey =
    env('SUPABASE_SERVICE_ROLE_KEY') ||
    env('SUPABASE_PUBLISHABLE_KEY');

const API_TOKEN = env('BLOG_API_TOKEN');

const CORS_HEADERS: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
    'Access-Control-Max-Age': '86400',
};

function json(body: unknown, status = 200) {
    return NextResponse.json(body, { status, headers: CORS_HEADERS });
}

export function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

function db() {
    if (!supabaseUrl || !writeKey) {
        throw new Error('Missing Supabase environment variables.');
    }
    return createClient(supabaseUrl, writeKey, { auth: { persistSession: false } });
}

function isAuthorized(req: NextRequest): boolean {
    if (!API_TOKEN) return false;
    const auth = req.headers.get('authorization');
    const bearer = auth?.startsWith('Bearer ') ? auth.slice(7) : undefined;
    const headerKey = req.headers.get('x-api-key') ?? undefined;
    return bearer === API_TOKEN || headerKey === API_TOKEN;
}

// GET /api/posts/{slug} -> single post (public)
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    try {
        const { data, error } = await db()
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .eq('is_published', true)
            .maybeSingle();

        if (error) return json({ error: error.message }, 500);
        if (!data) return json({ error: 'Not found' }, 404);
        return json({ post: data });
    } catch (e) {
        return json({ error: (e as Error).message }, 500);
    }
}

// DELETE /api/posts/{slug} -> delete a specific post (token required)
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    if (!isAuthorized(req)) {
        return json({ error: 'Unauthorized' }, 401);
    }

    const { slug } = await params;
    try {
        const { data, error } = await db()
            .from('blog_posts')
            .delete()
            .eq('slug', slug)
            .select('slug, title, published_at')
            .maybeSingle();

        if (error) return json({ error: error.message }, 500);
        if (!data) return json({ error: 'Not found' }, 404);
        return json({ deleted: data });
    } catch (e) {
        return json({ error: (e as Error).message }, 500);
    }
}

type PostPatch = {
    title?: string;
    slug?: string;
    excerpt?: string;
    category?: string;
    author?: string;
    date?: string; // YYYY-MM-DD
    readingTime?: string;
    coverImage?: string | null;
    sections?: BlogSection[];
    isPublished?: boolean;
};

const PATCH_COLUMNS: Record<keyof PostPatch, string> = {
    title: 'title',
    slug: 'slug',
    excerpt: 'excerpt',
    category: 'category',
    author: 'author',
    date: 'published_at',
    readingTime: 'reading_time',
    coverImage: 'cover_image',
    sections: 'sections',
    isPublished: 'is_published',
};

// PATCH /api/posts/{slug} -> update any subset of fields (token required).
// Set `isPublished: false` to take a post down without deleting it.
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    if (!isAuthorized(req)) {
        return json({ error: 'Unauthorized' }, 401);
    }

    let payload: PostPatch;
    try {
        payload = await req.json();
    } catch {
        return json({ error: 'Invalid JSON body' }, 400);
    }

    if (payload.date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(payload.date)) {
        return json({ error: '`date` must be YYYY-MM-DD' }, 400);
    }
    if (
        payload.sections !== undefined &&
        !(
            Array.isArray(payload.sections) &&
            payload.sections.length > 0 &&
            payload.sections.every((s) => s && Array.isArray(s.paragraphs) && s.paragraphs.every((p) => typeof p === 'string'))
        )
    ) {
        return json({ error: '`sections` must be a non-empty array of { heading?, paragraphs: string[], image?, imageCaption? }' }, 400);
    }
    if (payload.isPublished !== undefined && typeof payload.isPublished !== 'boolean') {
        return json({ error: '`isPublished` must be a boolean' }, 400);
    }

    const images = [payload.coverImage ?? undefined, ...(payload.sections ?? []).map((s) => s.image)].filter(
        (u): u is string => typeof u === 'string' && u !== ''
    );
    if (images.some((u) => !isAllowedImageUrl(u))) {
        return json({ error: 'Images must be https URLs from images.unsplash.com or uploaded through /api/media.' }, 400);
    }

    const warnings: string[] = [];
    if (payload.coverImage) {
        payload.coverImage = await verifyCoverImage(payload.coverImage);
        if (!payload.coverImage) warnings.push('coverImage could not be found, so the post uses its category image.');
    }

    const row: Record<string, unknown> = {};
    for (const [key, column] of Object.entries(PATCH_COLUMNS)) {
        const value = payload[key as keyof PostPatch];
        if (value !== undefined) row[column] = key === 'slug' ? slugify(String(value)) : value;
    }
    if (Object.keys(row).length === 0) {
        return json({ error: 'Nothing to update' }, 400);
    }

    const { slug } = await params;
    try {
        const { data, error } = await db()
            .from('blog_posts')
            .update(row)
            .eq('slug', slug)
            .select('slug, title, category, author, published_at, reading_time, cover_image, is_published')
            .maybeSingle();

        if (error) return json({ error: error.message, code: error.code }, error.code === '23505' ? 409 : 500);
        if (!data) return json({ error: 'Not found' }, 404);
        return json({ post: data, ...(warnings.length ? { warnings } : {}) });
    } catch (e) {
        return json({ error: (e as Error).message }, 500);
    }
}
