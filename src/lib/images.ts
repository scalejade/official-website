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
