import { supabase } from '@/lib/supabase';

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

// Default cover photography per category (Unsplash).
const categoryCovers: Record<string, string> = {
    "Software Engineering": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80",
    "Artificial Intelligence": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80",
    "Data Analytics": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    "Cloud Infrastructure": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80",
    "Blockchain & Distributed Ledger": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1600&q=80",
    "Company": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
};

const FALLBACK_COVER =
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80";

export function getCoverImage(post: BlogPost): string {
    return post.coverImage ?? categoryCovers[post.category] ?? FALLBACK_COVER;
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
    const { data, error } = await supabase
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
    const { data, error } = await supabase
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
