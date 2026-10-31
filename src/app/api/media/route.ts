import { NextRequest } from 'next/server';
import { isAuthorized, jsonResponse, preflight, readJson } from '@/lib/api';
import { createUploadUrl, FOLDERS, uploadFile, type Folder } from '@/lib/media';

const METHODS = 'POST';
const json = jsonResponse(METHODS);
export const OPTIONS = preflight(METHODS);

const folderOf = (v: unknown): Folder | null =>
    v === undefined || v === null ? 'misc' : FOLDERS.includes(v as Folder) ? (v as Folder) : null;

/**
 * POST /api/media — put an image in the public `media` bucket. Use the returned
 * `url` anywhere: a blog post's coverImage or section image, a project's
 * clientLogoUrl, or a project image (send `path` to /api/projects/{slug}/images).
 *
 *   multipart/form-data  file=<image ≤4 MB>, folder?
 *     -> 201 { url, path }
 *   JSON { contentType, folder? }   for larger files
 *     -> 201 { uploadUrl, token, path, url }; then
 *        PUT the file bytes to `uploadUrl` with the same Content-Type.
 */
export async function POST(req: NextRequest) {
    if (!isAuthorized(req)) return json({ error: 'Unauthorized' }, 401);

    if ((req.headers.get('content-type') ?? '').startsWith('multipart/form-data')) {
        const form = await req.formData();
        const file = form.get('file');
        if (!(file instanceof File)) return json({ error: '`file` is required' }, 400);
        const folder = folderOf(form.get('folder') ?? undefined);
        if (!folder) return json({ error: `\`folder\` must be one of ${FOLDERS.join(', ')}` }, 400);

        const result = await uploadFile(file, folder);
        if ('error' in result) return json({ error: result.error }, result.status);
        return json(result, 201);
    }

    const body = await readJson<{ contentType?: string; folder?: string }>(req);
    if (!body || typeof body.contentType !== 'string') {
        return json({ error: 'Send multipart `file`, or JSON { contentType, folder? } for a signed upload URL' }, 400);
    }
    const folder = folderOf(body.folder);
    if (!folder) return json({ error: `\`folder\` must be one of ${FOLDERS.join(', ')}` }, 400);

    const result = await createUploadUrl(folder, body.contentType);
    if ('error' in result) return json({ error: result.error }, result.status);
    return json(result, 201);
}
