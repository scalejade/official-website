import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { dbErrorStatus, isAuthorized, jsonResponse, preflight, readJson } from '@/lib/api';
import { removeObject } from '@/lib/media';
import {
    getProjectsForAdmin,
    mapProject,
    payloadToRow,
    PROJECT_SELECT,
    toPublic,
    type ProjectPayload,
    type ProjectRow,
} from '@/data/projects';

const METHODS = 'GET, PATCH, DELETE';
const json = jsonResponse(METHODS);
export const OPTIONS = preflight(METHODS);

type Ctx = { params: Promise<{ slug: string }> };

// GET /api/projects/{slug}
//   public -> published project, confidential fields removed
//   token  -> unredacted, including unpublished
export async function GET(req: NextRequest, { params }: Ctx) {
    const { slug } = await params;
    const admin = isAuthorized(req);
    try {
        const [project] = await getProjectsForAdmin(slug);
        if (!project || (!admin && !project.isPublished)) return json({ error: 'Not found' }, 404);
        return json({ project: admin ? project : toPublic(project) });
    } catch (e) {
        return json({ error: (e as Error).message }, 500);
    }
}

// PATCH /api/projects/{slug} -> update any subset of fields
export async function PATCH(req: NextRequest, { params }: Ctx) {
    if (!isAuthorized(req)) return json({ error: 'Unauthorized' }, 401);
    const { slug } = await params;

    const payload = await readJson<ProjectPayload>(req);
    if (!payload) return json({ error: 'Invalid JSON body' }, 400);

    const parsed = payloadToRow(payload, true);
    if ('error' in parsed) return json({ error: parsed.error }, 400);
    if (Object.keys(parsed.row).length === 0) return json({ error: 'Nothing to update' }, 400);

    try {
        const { data, error } = await supabaseAdmin()
            .from('projects')
            .update(parsed.row)
            .eq('slug', slug)
            .select(PROJECT_SELECT)
            .maybeSingle();
        if (error) return json({ error: error.message, code: error.code }, dbErrorStatus(error.code));
        if (!data) return json({ error: 'Not found' }, 404);
        return json({ project: mapProject(data as ProjectRow) });
    } catch (e) {
        return json({ error: (e as Error).message }, 500);
    }
}

// DELETE /api/projects/{slug} -> delete the project, its images and their files
export async function DELETE(req: NextRequest, { params }: Ctx) {
    if (!isAuthorized(req)) return json({ error: 'Unauthorized' }, 401);
    const { slug } = await params;

    try {
        const db = supabaseAdmin();
        // Read the file paths first: the cascade removes the image rows with the project.
        const { data: project, error: findErr } = await db
            .from('projects')
            .select('id, slug, title, project_images(storage_path)')
            .eq('slug', slug)
            .maybeSingle();
        if (findErr) return json({ error: findErr.message }, 500);
        if (!project) return json({ error: 'Not found' }, 404);

        const { error } = await db.from('projects').delete().eq('id', project.id);
        if (error) return json({ error: error.message }, 500);

        const images = (project.project_images ?? []) as { storage_path: string | null }[];
        await Promise.all(images.map((img) => removeObject(img.storage_path)));
        return json({ deleted: { slug: project.slug, title: project.title, images: images.length } });
    } catch (e) {
        return json({ error: (e as Error).message }, 500);
    }
}
