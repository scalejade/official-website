import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

// Public (publishable-key) client for reading published posts and papers.
//
// Created on first use, not at import: a missing setting must not stop the
// site from building (the sitemap and other pages import this module during
// `next build`). Without settings the readers below return empty results and
// log why, so the site still deploys and shows its empty states.

let client: SupabaseClient | null | undefined;

export function publicDb(): SupabaseClient | null {
    if (client !== undefined) return client;
    const url = env('SUPABASE_URL');
    const key = env('SUPABASE_PUBLISHABLE_KEY');
    if (!url || !key) {
        console.error('Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY; posts and papers will be empty.');
        client = null;
        return client;
    }
    client = createClient(url, key, { auth: { persistSession: false } });
    return client;
}
