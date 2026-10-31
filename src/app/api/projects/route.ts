import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { dbErrorStatus, isAuthorized, jsonResponse, preflight, readJson } from '@/lib/api';
import {
    getProjectsForAdmin,
    imagePayloadToRow,
    mapProject,
    payloadToRow,
    PROJECT_SELECT,
    toPublic,
    type ImagePayload,
    type ProjectPayload,
    type ProjectRow,
} from '@/data/projects';
import { isOurPath, publicUrl } from '@/lib/media';

const METHODS = 'GET, POST';
const json = jsonResponse(METHODS);
export const OPTIONS = preflight(METHODS);

// GET /api/projects
//   public            -> published projects, confidential fields removed
//   token + ?all=true -> every project, unredacted, including unpublished
export async function GET(req: NextRequest) {
    const all = new URL(req.url).searchParams.get('all') === 'true';
    if (all && !isAuthorized(req)) return json({ error: 'Unauthorized' }, 401);

    try {
        const projects = await getProjectsForAdmin();
        if (all) return json({ projects });
        return json({ projects: projects.filter((p) => p.isPublished).map(toPublic) });
    } catch (e) {
        return json({ error: (e as Error).message }, 500);
    }
}

type CreatePayload = ProjectPayload & { images?: (ImagePayload & { path?: string })[] };

// POST /api/projects -> create a project, optionally with images by URL / storage path
export async function POST(req: NextRequest) {
    if (!isAuthorized(req)) return json({ error: 'Unauthorized' }, 401);

    const payload = await readJson<CreatePayload>(req);
    if (!payload) return json({ error: 'Invalid JSON body' }, 400);

    const parsed = payloadToRow(payload, false);
    if ('error' in parsed) return json({ error: parsed.error }, 400);

    // Validate images before writing anything.
    const imageRows: Record<string, unknown>[] = [];
    for (const [i, img] of (payload.images ?? []).entries()) {
        // `path` = a file uploaded through a signed URL from POST /api/media.
        if (img.path !== undefined && !isOurPath(img.path)) {
            return json({ error: `images[${i}].path is not a path issued by POST /api/media` }, 400);
        }
        const r = imagePayloadToRow(img.path ? { ...img, url: publicUrl(img.path) } : img, false);
        if ('error' in r) return json({ error: `images[${i}]: ${r.error}` }, 400);
        imageRows.push({ ...r.row, storage_path: img.path ?? null, sort_order: r.row.sort_order ?? (i + 1) * 10 });
    }

    try {
        const db = supabaseAdmin();
        const { data: created, error } = await db.from('projects').insert(parsed.row).select('id').single();
        if (error) return json({ error: error.message, code: error.code }, dbErrorStatus(error.code));

        if (imageRows.length) {
            const { error: imgErr } = await db
                .from('project_images')
                .insert(imageRows.map((r) => ({ ...r, project_id: created.id })));
            if (imgErr) {
                await db.from('projects').delete().eq('id', created.id); // keep it atomic
                return json({ error: imgErr.message, code: imgErr.code }, 500);
            }
        }

        const { data } = await db.from('projects').select(PROJECT_SELECT).eq('id', created.id).single();
        return json({ project: mapProject(data as ProjectRow) }, 201);
    } catch (e) {
        return json({ error: (e as Error).message }, 500);
    }
}
