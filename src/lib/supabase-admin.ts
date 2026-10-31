import 'server-only';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

// Service-role client. Bypasses RLS, so it must never reach the browser —
// `server-only` turns an accidental client-side import into a build error.
//
// Required for projects (whose tables have no public policies) and for every
// write through /api (supabase/schema.sql gives the public key read-only access).

let client: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
    if (client) return client;

    const url = env('SUPABASE_URL');
    const key = env('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) {
        throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
    }

    client = createClient(url, key, { auth: { persistSession: false } });
    return client;
}

/** Public bucket for uploaded media — created in supabase/schema.sql. */
export const MEDIA_BUCKET = 'media';
