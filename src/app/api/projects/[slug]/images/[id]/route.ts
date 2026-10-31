import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAuthorized, jsonResponse, preflight, readJson } from '@/lib/api';
import { removeObject } from '@/lib/media';
import { imagePayloadToRow, mapImage, type ImagePayload, type ProjectImageRow } from '@/data/projects';

const METHODS = 'PATCH, DELETE';
const json = jsonResponse(METHODS);
export const OPTIONS = preflight(METHODS);

type Ctx = { params: Promise<{ slug: string; id: string }> };

const UUID = /^[0-9a-f-]{36}$/;

/** The image row, only if it belongs to the project in the URL. */
async function findImage(slug: string, id: string) {
    if (!UUID.test(id)) return { image: null, error: null };
    const { data, error } = await supabaseAdmin()
        .from('project_images')
        .select('*, projects!inner(slug)')
        .eq('id', id)
        .eq('projects.slug', slug)
        .maybeSingle();
    return { image: data as ProjectImageRow | null, error };
}

// PATCH /api/projects/{slug}/images/{id} -> alt, caption, kind, isConfidential, sortOrder
export async function PATCH(req: NextRequest, { params }: Ctx) {
    if (!isAuthorized(req)) return json({ error: 'Unauthorized' }, 401);
    const { slug, id } = await params;

    const body = await readJson<ImagePayload>(req);
    if (!body) return json({ error: 'Invalid JSON body' }, 400);
    if (body.url !== undefined) return json({ error: 'Replace an image by deleting it and adding a new one' }, 400);

    const parsed = imagePayloadToRow(body, true);
    if ('error' in parsed) return json({ error: parsed.error }, 400);
    if (Object.keys(parsed.row).length === 0) return json({ error: 'Nothing to update' }, 400);

    const { image, error: findErr } = await findImage(slug, id);
    if (findErr) return json({ error: findErr.message }, 500);
    if (!image) return json({ error: 'Not found' }, 404);

    const { data, error } = await supabaseAdmin()
        .from('project_images')
        .update(parsed.row)
        .eq('id', id)
        .select('*')
        .single();
    if (error) return json({ error: error.message }, 500);
    return json({ image: mapImage(data as ProjectImageRow) });
}

// DELETE /api/projects/{slug}/images/{id} -> remove the row and the stored file
export async function DELETE(req: NextRequest, { params }: Ctx) {
    if (!isAuthorized(req)) return json({ error: 'Unauthorized' }, 401);
    const { slug, id } = await params;

    const { image, error: findErr } = await findImage(slug, id);
    if (findErr) return json({ error: findErr.message }, 500);
    if (!image) return json({ error: 'Not found' }, 404);

    const { error } = await supabaseAdmin().from('project_images').delete().eq('id', id);
    if (error) return json({ error: error.message }, 500);

    await removeObject(image.storage_path);
    return json({ deleted: { id } });
}
