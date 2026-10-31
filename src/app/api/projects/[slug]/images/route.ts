import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAuthorized, jsonResponse, preflight, readJson } from '@/lib/api';
import { isOurPath, publicUrl, removeObject, uploadFile } from '@/lib/media';
import { imagePayloadToRow, mapImage, type ImagePayload, type ProjectImageRow } from '@/data/projects';

const METHODS = 'POST';
const json = jsonResponse(METHODS);
export const OPTIONS = preflight(METHODS);

type Ctx = { params: Promise<{ slug: string }> };

/**
 * POST /api/projects/{slug}/images — add an image to the gallery. Three forms:
 *   multipart/form-data  file=<image ≤4 MB>, alt, caption, kind, isConfidential, sortOrder
 *   JSON { path, ... }   a file already uploaded via a signed URL from POST /api/media
 *   JSON { url, ... }    an image hosted elsewhere
 */
export async function POST(req: NextRequest, { params }: Ctx) {
    if (!isAuthorized(req)) return json({ error: 'Unauthorized' }, 401);
    const { slug } = await params;

    const db = supabaseAdmin();
    const { data: project, error: findErr } = await db.from('projects').select('id').eq('slug', slug).maybeSingle();
    if (findErr) return json({ error: findErr.message }, 500);
    if (!project) return json({ error: 'Not found' }, 404);

    let payload: ImagePayload;
    let storagePath: string | null = null;

    if ((req.headers.get('content-type') ?? '').startsWith('multipart/form-data')) {
        const form = await req.formData();
        const file = form.get('file');
        if (!(file instanceof File)) return json({ error: '`file` is required in multipart uploads' }, 400);

        const field = (k: string) => (typeof form.get(k) === 'string' ? (form.get(k) as string) : undefined);
        payload = {
            alt: field('alt'),
            caption: field('caption'),
            kind: field('kind'),
            isConfidential: field('isConfidential') === undefined ? undefined : field('isConfidential') === 'true',
            sortOrder: field('sortOrder') === undefined ? undefined : Number(field('sortOrder')),
        };
        // Validate metadata before spending an upload.
        const check = imagePayloadToRow({ ...payload, url: 'pending' }, false);
        if ('error' in check) return json({ error: check.error }, 400);

        const uploaded = await uploadFile(file, 'projects');
        if ('error' in uploaded) return json({ error: uploaded.error }, uploaded.status);
        payload.url = uploaded.url;
        storagePath = uploaded.path;
    } else {
        const body = await readJson<ImagePayload & { path?: string }>(req);
        if (!body) return json({ error: 'Invalid JSON body' }, 400);
        if (body.path !== undefined) {
            if (!isOurPath(body.path)) return json({ error: '`path` is not a path issued by POST /api/media' }, 400);
            storagePath = body.path;
            body.url = publicUrl(body.path);
        }
        payload = body;
    }

    const parsed = imagePayloadToRow(payload, false);
    if ('error' in parsed) {
        await removeObject(storagePath);
        return json({ error: parsed.error }, 400);
    }

    // Append to the end of the gallery unless a position was given.
    if (parsed.row.sort_order === undefined) {
        const { data: last } = await db
            .from('project_images')
            .select('sort_order')
            .eq('project_id', project.id)
            .order('sort_order', { ascending: false })
            .limit(1)
            .maybeSingle();
        parsed.row.sort_order = (last?.sort_order ?? 0) + 10;
    }

    const { data, error } = await db
        .from('project_images')
        .insert({ ...parsed.row, project_id: project.id, storage_path: storagePath })
        .select('*')
        .single();
    if (error) {
        await removeObject(storagePath);
        return json({ error: error.message }, 500);
    }
    return json({ image: mapImage(data as ProjectImageRow) }, 201);
}
