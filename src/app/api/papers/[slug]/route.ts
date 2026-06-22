import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const writeKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const API_TOKEN = process.env.PAPERS_API_TOKEN || process.env.BLOG_API_TOKEN;

const CORS_HEADERS: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
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

// GET /api/papers/{slug} -> single paper (public)
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    try {
        const { data, error } = await db()
            .from('papers')
            .select('*')
            .eq('slug', slug)
            .eq('is_published', true)
            .maybeSingle();

        if (error) return json({ error: error.message }, 500);
        if (!data) return json({ error: 'Not found' }, 404);
        return json({ paper: data });
    } catch (e) {
        return json({ error: (e as Error).message }, 500);
    }
}

// DELETE /api/papers/{slug} -> delete a specific paper (token required)
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
            .from('papers')
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
