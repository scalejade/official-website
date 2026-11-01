import { publicDb } from '@/lib/supabase';

export type BlogSection = {
    heading?: string;
    paragraphs: string[];
    image?: string; // optional inline image URL
    imageCaption?: string;
};

export type BlogPost = {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    date: string; // ISO date
    readingTime: string;
    sections: BlogSection[];
    coverImage?: string; // optional; falls back to a category image
};

// Default cover photography per category (Unsplash, free to use). A post with
// no coverImage of its own (or whose Unsplash photo the API could not find) gets one
// of its category's photos, chosen from the slug so it never changes between
// visits and neighbouring posts rarely share one.
const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

const categoryCovers: Record<string, string[]> = {
    "Software Engineering": [
        unsplash("1517694712202-14dd9538aa97"), // laptop with code
        unsplash("1555066931-4365d14bab8c"),    // code on a dark laptop
        unsplash("1607799279861-4dd421887fb3"), // code editor close-up
        unsplash("1504384308090-c894fdcc538d"), // engineering floor
    ],
    "Artificial Intelligence": [
        unsplash("1620712943543-bcc4688e7485"), // robot
        unsplash("1531403009284-440f080d1e12"), // whiteboard session
        unsplash("1532094349884-543bc11b234d"), // lab glassware
    ],
    "Data Analytics": [
        unsplash("1551288049-bebda4e38f71"),    // dashboard
        unsplash("1460925895917-afdab827c52f"), // analytics on a laptop
        unsplash("1554224155-6726b3ff858f"),    // reports and calculator
    ],
    "Cloud Infrastructure": [
        unsplash("1558494949-ef010cbdcc31"),    // server racks
        unsplash("1544197150-b99a580bb7a8"),    // network patch panel
        unsplash("1473341304170-971dccb5ac1e"), // transmission lines
    ],
    "Blockchain & Distributed Ledger": [
        unsplash("1639762681485-074b7f938ba0"), // ledger network render
        unsplash("1563013544-824ae1b704d3"),    // card payment
        unsplash("1486406146926-c627a92ad1ab"), // financial district
    ],
    "Company": [
        unsplash("1497366216548-37526070297c"), // office
        unsplash("1497366754035-f200968a6e72"), // office corridor
        unsplash("1522071820081-009f0129c71c"), // team
        unsplash("1450101499163-c8848c66ca85"), // signing documents
    ],
};

const FALLBACK_COVERS = categoryCovers["Company"];

/** Small, stable string hash — picks the same cover for a slug every time. */
function pick<T>(items: T[], key: string): T {
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
    return items[Math.abs(h) % items.length];
}

export function getCoverImage(post: BlogPost): string {
    return post.coverImage ?? pick(categoryCovers[post.category] ?? FALLBACK_COVERS, post.slug);
}

// Shape of a row coming back from Supabase.
type BlogPostRow = {
    slug: string;
    title: string;
    excerpt: string | null;
    category: string | null;
    author: string | null;
    published_at: string;
    reading_time: string | null;
    cover_image: string | null;
    sections: BlogSection[] | null;
};

function mapRow(row: BlogPostRow): BlogPost {
    return {
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt ?? '',
        category: row.category ?? '',
        author: row.author ?? 'ScaleJade',
        date: row.published_at,
        readingTime: row.reading_time ?? '',
        sections: Array.isArray(row.sections) ? row.sections : [],
        coverImage: row.cover_image ?? undefined,
    };
}

const SELECT_COLUMNS =
    'slug, title, excerpt, category, author, published_at, reading_time, cover_image, sections';

export async function getAllPosts(): Promise<BlogPost[]> {
    const db = publicDb();
    if (!db) return [];
    const { data, error } = await db
        .from('blog_posts')
        .select(SELECT_COLUMNS)
        .eq('is_published', true)
        .order('published_at', { ascending: false });

    if (error) {
        console.error('Failed to load blog posts from Supabase:', error.message);
        return [];
    }

    return (data as BlogPostRow[]).map(mapRow);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const db = publicDb();
    if (!db) return undefined;
    const { data, error } = await db
        .from('blog_posts')
        .select(SELECT_COLUMNS)
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

    if (error) {
        console.error(`Failed to load blog post "${slug}" from Supabase:`, error.message);
        return undefined;
    }

    return data ? mapRow(data as BlogPostRow) : undefined;
}
