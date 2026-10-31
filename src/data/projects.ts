import 'server-only';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { slugify } from '@/lib/api';

// Projects (case studies) live in Supabase — see supabase/schema.sql, section 4.
//
// CONFIDENTIALITY. A row is fetched in full on the server and passed through
// `toPublic()` before it reaches a page or a public API response:
//   - confidential project → client name, client logo and the quote's name are
//     removed, and images flagged `is_confidential` are dropped;
//   - public project       → everything is shown.
// Never send a `ProjectRow` / `Project` to the browser; send `PublicProject`.

export const SECTORS = [
    'finance',
    'public',
    'education',
    'energy_mining',
    'manufacturing',
    'healthcare',
    'wholesale',
] as const;
export type Sector = (typeof SECTORS)[number];

export const IMAGE_KINDS = ['field', 'product', 'architecture', 'team', 'other'] as const;
export type ImageKind = (typeof IMAGE_KINDS)[number];

export type Outcome = { value: string; label: string };
export type Quote = { text: string; name: string; role: string };

export type ProjectImage = {
    id: string;
    url: string;
    alt: string;
    caption: string | null;
    kind: ImageKind;
    isConfidential: boolean;
    sortOrder: number;
};

/** Full record, including confidential fields. Server-side only. */
export type Project = {
    id: string;
    slug: string;
    title: string;
    summary: string;
    clientName: string | null;
    clientClassification: string;
    clientLogoUrl: string | null;
    isConfidential: boolean;
    sector: Sector;
    challenge: string | null;
    constraints: string[];
    built: string[];
    role: string | null;
    team: string | null;
    duration: string | null;
    highlights: string[];
    outcomes: Outcome[];
    techStack: string[];
    quote: Quote | null;
    isPublished: boolean;
    isFeatured: boolean;
    sortOrder: number;
    images: ProjectImage[];
    updatedAt: string;
};

/** What a visitor or public API caller may see. */
export type PublicProject = Omit<Project, 'clientName' | 'clientLogoUrl' | 'quote' | 'images' | 'isPublished'> & {
    clientName: string | null;
    clientLogoUrl: string | null;
    quote: { text: string; name: string | null; role: string } | null;
    images: Omit<ProjectImage, 'isConfidential'>[];
};

export type ProjectImageRow = {
    id: string;
    project_id: string;
    url: string;
    storage_path: string | null;
    alt: string;
    caption: string | null;
    kind: ImageKind;
    is_confidential: boolean;
    sort_order: number;
};

export type ProjectRow = {
    id: string;
    slug: string;
    title: string;
    summary: string;
    client_name: string | null;
    client_classification: string;
    client_logo_url: string | null;
    is_confidential: boolean;
    sector: Sector;
    challenge: string | null;
    constraints: string[] | null;
    built: string[] | null;
    role: string | null;
    team: string | null;
    duration: string | null;
    highlights: string[] | null;
    outcomes: Outcome[] | null;
    tech_stack: string[] | null;
    quote: Quote | null;
    is_published: boolean;
    is_featured: boolean;
    sort_order: number;
    updated_at: string;
    project_images?: ProjectImageRow[];
};

export const PROJECT_SELECT = '*, project_images(*)';

export function mapImage(row: ProjectImageRow): ProjectImage {
    return {
        id: row.id,
        url: row.url,
        alt: row.alt,
        caption: row.caption,
        kind: row.kind,
        isConfidential: row.is_confidential,
        sortOrder: row.sort_order,
    };
}

export function mapProject(row: ProjectRow): Project {
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        summary: row.summary,
        clientName: row.client_name,
        clientClassification: row.client_classification,
        clientLogoUrl: row.client_logo_url,
        isConfidential: row.is_confidential,
        sector: row.sector,
        challenge: row.challenge,
        constraints: row.constraints ?? [],
        built: row.built ?? [],
        role: row.role,
        team: row.team,
        duration: row.duration,
        highlights: row.highlights ?? [],
        outcomes: row.outcomes ?? [],
        techStack: row.tech_stack ?? [],
        quote: row.quote,
        isPublished: row.is_published,
        isFeatured: row.is_featured,
        sortOrder: row.sort_order,
        images: (row.project_images ?? []).map(mapImage).sort((a, b) => a.sortOrder - b.sortOrder),
        updatedAt: row.updated_at,
    };
}

/** The one place confidentiality is enforced. */
export function toPublic(project: Project): PublicProject {
    const hidden = project.isConfidential;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isPublished, ...rest } = project;
    return {
        ...rest,
        clientName: hidden ? null : project.clientName,
        clientLogoUrl: hidden ? null : project.clientLogoUrl,
        quote: project.quote
            ? { text: project.quote.text, role: project.quote.role, name: hidden ? null : project.quote.name }
            : null,
        images: project.images
            .filter((img) => !(hidden && img.isConfidential))
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(({ isConfidential, ...img }) => img),
    };
}

// ---------------------------------------------------------------- reads

async function query(filter?: { slug?: string; includeUnpublished?: boolean }): Promise<Project[]> {
    let q = supabaseAdmin()
        .from('projects')
        .select(PROJECT_SELECT)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
    if (!filter?.includeUnpublished) q = q.eq('is_published', true);
    if (filter?.slug) q = q.eq('slug', filter.slug);

    const { data, error } = await q;
    if (error) {
        console.error('Failed to load projects from Supabase:', error.message);
        return [];
    }
    return (data as ProjectRow[]).map(mapProject);
}

/** Published projects, redacted, in display order. */
export async function getAllProjects(): Promise<PublicProject[]> {
    try {
        return (await query()).map(toPublic);
    } catch (e) {
        console.error((e as Error).message);
        return [];
    }
}

export async function getProject(slug: string): Promise<PublicProject | undefined> {
    try {
        const [project] = await query({ slug });
        return project ? toPublic(project) : undefined;
    } catch (e) {
        console.error((e as Error).message);
        return undefined;
    }
}

/** The home-page highlight: the first featured project, else the first one. */
export async function getFeaturedProject(): Promise<PublicProject | undefined> {
    const all = await getAllProjects();
    return all.find((p) => p.isFeatured) ?? all[0];
}

/** Unredacted reads for authenticated API callers only. */
export async function getProjectsForAdmin(slug?: string): Promise<Project[]> {
    return query({ slug, includeUnpublished: true });
}

// ---------------------------------------------------------------- writes

export type ProjectPayload = {
    title?: string;
    slug?: string;
    summary?: string;
    clientName?: string | null;
    clientClassification?: string;
    clientLogoUrl?: string | null;
    isConfidential?: boolean;
    sector?: string;
    challenge?: string | null;
    constraints?: string[];
    built?: string[];
    role?: string | null;
    team?: string | null;
    duration?: string | null;
    highlights?: string[];
    outcomes?: Outcome[];
    techStack?: string[];
    quote?: Quote | null;
    isPublished?: boolean;
    isFeatured?: boolean;
    sortOrder?: number;
};

const isStr = (v: unknown) => typeof v === 'string';
const isStrOrNull = (v: unknown) => v === null || typeof v === 'string';
const isStrArr = (v: unknown) => Array.isArray(v) && v.every(isStr);

/**
 * Validates a camelCase API payload and converts it to a snake_case row.
 * `partial` (PATCH) only converts the keys that are present.
 */
export function payloadToRow(
    p: ProjectPayload,
    partial: boolean
): { row: Record<string, unknown> } | { error: string } {
    if (!partial) {
        if (!isStr(p.title) || !p.title) return { error: '`title` is required' };
        if (!isStr(p.sector)) return { error: `\`sector\` is required: one of ${SECTORS.join(', ')}` };
    }
    if (p.sector !== undefined && !SECTORS.includes(p.sector as Sector)) {
        return { error: `\`sector\` must be one of ${SECTORS.join(', ')}` };
    }
    for (const k of ['title', 'summary', 'clientClassification'] as const) {
        if (p[k] !== undefined && !isStr(p[k])) return { error: `\`${k}\` must be a string` };
    }
    for (const k of ['clientName', 'clientLogoUrl', 'challenge', 'role', 'team', 'duration'] as const) {
        if (p[k] !== undefined && !isStrOrNull(p[k])) return { error: `\`${k}\` must be a string or null` };
    }
    for (const k of ['constraints', 'built', 'highlights', 'techStack'] as const) {
        if (p[k] !== undefined && !isStrArr(p[k])) return { error: `\`${k}\` must be an array of strings` };
    }
    for (const k of ['isConfidential', 'isPublished', 'isFeatured'] as const) {
        if (p[k] !== undefined && typeof p[k] !== 'boolean') return { error: `\`${k}\` must be a boolean` };
    }
    if (p.sortOrder !== undefined && !Number.isInteger(p.sortOrder)) {
        return { error: '`sortOrder` must be an integer' };
    }
    if (
        p.outcomes !== undefined &&
        !(Array.isArray(p.outcomes) && p.outcomes.every((o) => o && isStr(o.value) && isStr(o.label)))
    ) {
        return { error: '`outcomes` must be an array of { value: string, label: string }' };
    }
    if (
        p.quote !== undefined &&
        p.quote !== null &&
        !(isStr(p.quote.text) && isStr(p.quote.name) && isStr(p.quote.role))
    ) {
        return { error: '`quote` must be { text, name, role } or null' };
    }

    const map: Record<keyof ProjectPayload, string> = {
        title: 'title',
        slug: 'slug',
        summary: 'summary',
        clientName: 'client_name',
        clientClassification: 'client_classification',
        clientLogoUrl: 'client_logo_url',
        isConfidential: 'is_confidential',
        sector: 'sector',
        challenge: 'challenge',
        constraints: 'constraints',
        built: 'built',
        role: 'role',
        team: 'team',
        duration: 'duration',
        highlights: 'highlights',
        outcomes: 'outcomes',
        techStack: 'tech_stack',
        quote: 'quote',
        isPublished: 'is_published',
        isFeatured: 'is_featured',
        sortOrder: 'sort_order',
    };

    const row: Record<string, unknown> = {};
    for (const [key, column] of Object.entries(map)) {
        const value = p[key as keyof ProjectPayload];
        if (value !== undefined) row[column] = value;
    }

    if (p.slug !== undefined && !isStr(p.slug)) return { error: '`slug` must be a string' };
    if (!partial) row.slug = slugify(p.slug || (p.title as string));
    else if (p.slug !== undefined) row.slug = slugify(p.slug);
    if (row.slug === '') return { error: '`slug` is empty after normalisation' };

    return { row };
}

// ---------------------------------------------------------------- images

export type ImagePayload = {
    url?: string;
    alt?: string;
    caption?: string | null;
    kind?: string;
    isConfidential?: boolean;
    sortOrder?: number;
};

export function imagePayloadToRow(
    p: ImagePayload,
    partial: boolean
): { row: Record<string, unknown> } | { error: string } {
    if (!partial && (!isStr(p.url) || !p.url)) return { error: '`url` is required (or upload a `file`)' };
    if (p.url !== undefined && !isStr(p.url)) return { error: '`url` must be a string' };
    if (p.alt !== undefined && !isStr(p.alt)) return { error: '`alt` must be a string' };
    if (p.caption !== undefined && !isStrOrNull(p.caption)) return { error: '`caption` must be a string or null' };
    if (p.kind !== undefined && !IMAGE_KINDS.includes(p.kind as ImageKind)) {
        return { error: `\`kind\` must be one of ${IMAGE_KINDS.join(', ')}` };
    }
    if (p.isConfidential !== undefined && typeof p.isConfidential !== 'boolean') {
        return { error: '`isConfidential` must be a boolean' };
    }
    if (p.sortOrder !== undefined && !Number.isInteger(p.sortOrder)) {
        return { error: '`sortOrder` must be an integer' };
    }

    // Full defaults on create: a bulk insert fills keys missing from one row
    // with NULL (not the column default), which breaks the NOT NULL columns
    // when only some images in a batch set e.g. isConfidential.
    const row: Record<string, unknown> = partial ? {} : { alt: '', caption: null, kind: 'other', is_confidential: false };
    if (p.url !== undefined) row.url = p.url;
    if (p.alt !== undefined) row.alt = p.alt;
    if (p.caption !== undefined) row.caption = p.caption;
    if (p.kind !== undefined) row.kind = p.kind;
    if (p.isConfidential !== undefined) row.is_confidential = p.isConfidential;
    if (p.sortOrder !== undefined) row.sort_order = p.sortOrder;
    return { row };
}
