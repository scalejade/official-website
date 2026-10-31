import 'server-only';
import { randomUUID } from 'node:crypto';
import { supabaseAdmin, MEDIA_BUCKET } from '@/lib/supabase-admin';

// Uploads to the public `media` bucket (supabase/schema.sql, section 6).
//
// Two ways in:
//   - uploadFile(): multipart upload through our API. Serverless hosts cap the
//     request body (Vercel: ~4.5 MB), so this is for small images.
//   - createUploadUrl(): returns a signed URL the caller PUTs the file to
//     directly, with no size limit from our host. Use this for photos.

export const MAX_DIRECT_UPLOAD = 4 * 1024 * 1024;

// No SVG: an SVG served from our bucket can carry script.
const EXTENSIONS: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
    'image/gif': 'gif',
};
export const ALLOWED_TYPES = Object.keys(EXTENSIONS);

export const FOLDERS = ['projects', 'blog', 'papers', 'misc'] as const;
export type Folder = (typeof FOLDERS)[number];

function objectPath(folder: string, contentType: string) {
    return `${folder}/${randomUUID()}.${EXTENSIONS[contentType]}`;
}

export function publicUrl(path: string): string {
    return supabaseAdmin().storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function uploadFile(
    file: File,
    folder: string
): Promise<{ url: string; path: string } | { error: string; status: number }> {
    if (!ALLOWED_TYPES.includes(file.type)) {
        return { error: `Unsupported type "${file.type}". Allowed: ${ALLOWED_TYPES.join(', ')}`, status: 415 };
    }
    if (file.size > MAX_DIRECT_UPLOAD) {
        return {
            error: `File is ${(file.size / 1048576).toFixed(1)} MB; direct uploads are limited to 4 MB. Request a signed upload URL instead (POST /api/media with JSON).`,
            status: 413,
        };
    }

    const path = objectPath(folder, file.type);
    const { error } = await supabaseAdmin()
        .storage.from(MEDIA_BUCKET)
        .upload(path, await file.arrayBuffer(), { contentType: file.type, cacheControl: '31536000' });
    if (error) return { error: error.message, status: 500 };

    return { url: publicUrl(path), path };
}

export async function createUploadUrl(
    folder: string,
    contentType: string
): Promise<{ uploadUrl: string; token: string; path: string; url: string } | { error: string; status: number }> {
    if (!ALLOWED_TYPES.includes(contentType)) {
        return { error: `Unsupported type "${contentType}". Allowed: ${ALLOWED_TYPES.join(', ')}`, status: 415 };
    }
    const path = objectPath(folder, contentType);
    const { data, error } = await supabaseAdmin().storage.from(MEDIA_BUCKET).createSignedUploadUrl(path);
    if (error || !data) return { error: error?.message ?? 'Could not create upload URL', status: 500 };

    return { uploadUrl: data.signedUrl, token: data.token, path, url: publicUrl(path) };
}

export async function removeObject(path: string | null | undefined) {
    if (!path) return;
    const { error } = await supabaseAdmin().storage.from(MEDIA_BUCKET).remove([path]);
    if (error) console.error(`Failed to remove ${path} from storage:`, error.message);
}

/** Only accept storage paths we issued, so a caller cannot point an image row at someone else's object. */
export function isOurPath(path: unknown): path is string {
    return typeof path === 'string' && /^(projects|blog|papers|misc)\/[0-9a-f-]{36}\.(jpg|png|webp|avif|gif)$/.test(path);
}

/** The storage path of a URL in our public media bucket, or null for any other URL. */
export function pathFromPublicUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
    const i = url.indexOf(marker);
    if (i === -1) return null;
    const path = url.slice(i + marker.length).split('?')[0];
    return isOurPath(path) ? path : null;
}
