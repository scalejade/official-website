import { supabase } from '@/lib/supabase';

// Research papers for /research (papers index) and /research/[slug] (detail).
// Backed by Supabase — see supabase/migrations/0004_create_papers.sql.

export type PaperSection = {
    heading: string;
    paragraphs: string[];
};

export type PaperLinks = {
    pdf?: string;
    arxiv?: string;
    code?: string;
    dataset?: string;
};

export type Paper = {
    slug: string;
    title: string;
    /** One- to two-sentence summary shown on the index card. */
    summary: string;
    /** Full abstract shown on the detail page. */
    abstract: string;
    authors: string[];
    /** ISO date (publication). */
    date: string;
    /** Topic tags used for filtering on the index. */
    topics: string[];
    /** Optional venue / status line, e.g. "Preprint · 2026". */
    venue?: string;
    links?: PaperLinks;
    sections?: PaperSection[];
    bibtex?: string;
};

// Shape of a row coming back from Supabase.
type PaperRow = {
    slug: string;
    title: string;
    summary: string | null;
    abstract: string | null;
    authors: string[] | null;
    published_at: string;
    topics: string[] | null;
    venue: string | null;
    links: PaperLinks | null;
    sections: PaperSection[] | null;
    bibtex: string | null;
};

function mapRow(row: PaperRow): Paper {
    return {
        slug: row.slug,
        title: row.title,
        summary: row.summary ?? '',
        abstract: row.abstract ?? '',
        authors: Array.isArray(row.authors) ? row.authors : [],
        date: row.published_at,
        topics: Array.isArray(row.topics) ? row.topics : [],
        venue: row.venue ?? undefined,
        links: row.links ?? undefined,
        sections: Array.isArray(row.sections) ? row.sections : undefined,
        bibtex: row.bibtex ?? undefined,
    };
}

const SELECT_COLUMNS =
    'slug, title, summary, abstract, authors, published_at, topics, venue, links, sections, bibtex';

export async function getAllPapers(): Promise<Paper[]> {
    const { data, error } = await supabase
        .from('papers')
        .select(SELECT_COLUMNS)
        .eq('is_published', true)
        .order('published_at', { ascending: false });

    if (error) {
        console.error('Failed to load papers from Supabase:', error.message);
        return [];
    }

    return (data as PaperRow[]).map(mapRow);
}

export async function getPaperBySlug(slug: string): Promise<Paper | undefined> {
    const { data, error } = await supabase
        .from('papers')
        .select(SELECT_COLUMNS)
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

    if (error) {
        console.error(`Failed to load paper "${slug}" from Supabase:`, error.message);
        return undefined;
    }

    return data ? mapRow(data as PaperRow) : undefined;
}

/** Unique, sorted topic tags across all published papers (for the filter chips). */
export function topicsOf(papers: Paper[]): string[] {
    return Array.from(new Set(papers.flatMap((p) => p.topics))).sort();
}

export async function getAllTopics(): Promise<string[]> {
    return topicsOf(await getAllPapers());
}
