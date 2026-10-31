import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

// Shared plumbing for the /api route handlers.

const API_TOKEN = env('BLOG_API_TOKEN');

export function corsHeaders(methods: string): Record<string, string> {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': `${methods}, OPTIONS`,
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
        'Access-Control-Max-Age': '86400',
    };
}

export function jsonResponse(methods: string) {
    const headers = corsHeaders(methods);
    return (body: unknown, status = 200) => NextResponse.json(body, { status, headers });
}

export function preflight(methods: string) {
    return () => new NextResponse(null, { status: 204, headers: corsHeaders(methods) });
}

/** Writes require BLOG_API_TOKEN as `Authorization: Bearer …` or `x-api-key`. */
export function isAuthorized(req: NextRequest): boolean {
    if (!API_TOKEN) return false; // refuse writes until a token is configured
    const auth = req.headers.get('authorization');
    const bearer = auth?.startsWith('Bearer ') ? auth.slice(7) : undefined;
    const headerKey = req.headers.get('x-api-key') ?? undefined;
    return bearer === API_TOKEN || headerKey === API_TOKEN;
}

export function slugify(s: string): string {
    return s
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export async function readJson<T>(req: NextRequest): Promise<T | null> {
    try {
        return (await req.json()) as T;
    } catch {
        return null;
    }
}

export const isStringArray = (v: unknown): v is string[] =>
    Array.isArray(v) && v.every((x) => typeof x === 'string');

/** Postgres unique_violation -> 409, anything else -> 500. */
export const dbErrorStatus = (code?: string) => (code === '23505' ? 409 : 500);
