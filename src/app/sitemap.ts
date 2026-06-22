import { MetadataRoute } from 'next';
import { getAllPosts } from '@/data/blog';
import { localizedUrl } from '@/lib/locale-url';

const locales = ['en', 'id'] as const;

const serviceslugs = [
    'software-engineering',
    'artificial-intelligence',
    'data-analytics',
    'cloud-infrastructure',
    'blockchain',
];

const staticRoutes = [
    '',
    '/services',
    '/sectors',
    '/portfolio',
    '/about',
    '/blog',
    '/demo',
];

// hreflang alternates respecting the `as-needed` prefix (en has no prefix).
function languages(path: string) {
    return {
        en: localizedUrl('en', path),
        id: localizedUrl('id', path),
    };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();
    const blogPosts = await getAllPosts();

    const staticEntries = staticRoutes.flatMap(route =>
        locales.map(locale => ({
            url: localizedUrl(locale, route),
            lastModified: now,
            changeFrequency: route === '' ? ('weekly' as const) : ('monthly' as const),
            priority: route === '' ? 1.0 : route === '/services' ? 0.9 : 0.8,
            alternates: { languages: languages(route) },
        }))
    );

    const serviceEntries = serviceslugs.flatMap(slug =>
        locales.map(locale => ({
            url: localizedUrl(locale, `/services/${slug}`),
            lastModified: now,
            changeFrequency: 'monthly' as const,
            priority: 0.85,
            alternates: { languages: languages(`/services/${slug}`) },
        }))
    );

    const blogEntries = blogPosts.flatMap(post =>
        locales.map(locale => ({
            url: localizedUrl(locale, `/blog/${post.slug}`),
            lastModified: new Date(post.date),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
            alternates: { languages: languages(`/blog/${post.slug}`) },
        }))
    );

    return [...staticEntries, ...serviceEntries, ...blogEntries];
}
