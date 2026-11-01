// next/image only optimises hosts listed in next.config `remotePatterns`.
// Images on any other host (e.g. a URL an API caller supplied) are loaded as-is.
export function isOptimizable(url: string): boolean {
    try {
        const host = new URL(url).hostname;
        return host.endsWith('.supabase.co') || host === 'images.unsplash.com';
    } catch {
        return true; // relative path under /public
    }
}

/**
 * Images the content API accepts: free stock from Unsplash, or files uploaded
 * to our own Supabase Storage through /api/media. Anything else is refused, so
 * an agent cannot attach a copyrighted news photo or a hotlinked image.
 */
export function isAllowedImageUrl(url: string): boolean {
    try {
        const u = new URL(url);
        if (u.protocol !== 'https:') return false;
        if (u.hostname === 'images.unsplash.com') return true;
        return u.hostname.endsWith('.supabase.co') && u.pathname.startsWith('/storage/v1/object/public/');
    } catch {
        return false;
    }
}

/**
 * Check a cover image an API caller picked. Unsplash URLs must point at a photo
 * that actually exists (an agent can make up a plausible photo ID), and are
 * normalised to one size so every cover crops the same way. Returns the URL to
 * store, or null when the photo cannot be found, so the caller falls back to the
 * category image instead of saving a broken one.
 */
export async function verifyCoverImage(url: string): Promise<string | null> {
    const u = new URL(url);
    if (u.hostname !== 'images.unsplash.com') return url; // our own uploads
    if (!/^\/photo-[\w-]+$/.test(u.pathname)) return null;
    const normalised = `https://images.unsplash.com${u.pathname}?auto=format&fit=crop&w=1600&q=80`;
    try {
        const res = await fetch(normalised, { method: 'HEAD', cache: 'no-store', signal: AbortSignal.timeout(5000) });
        return res.ok && res.headers.get('content-type')?.startsWith('image/') ? normalised : null;
    } catch {
        return null;
    }
}
