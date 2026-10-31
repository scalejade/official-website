import { MetadataRoute } from 'next';
import { getAllPosts } from '@/data/blog';
import { getAllPapers } from '@/data/papers';
import { localizedUrl } from '@/lib/locale-url';
import { getAllProjects } from '@/data/projects';

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
    '/research',
    '/insights',
    '/blog',
    '/contact',
    '/privacy',
    '/terms',
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

    const papers = await getAllPapers();
    const paperEntries = papers.flatMap(paper =>
        locales.map(locale => ({
            url: localizedUrl(locale, `/research/${paper.slug}`),
            lastModified: new Date(paper.date),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
            alternates: { languages: languages(`/research/${paper.slug}`) },
        }))
    );

    const projects = await getAllProjects();
    const caseStudyEntries = projects.flatMap(study =>
        locales.map(locale => ({
            url: localizedUrl(locale, `/portfolio/${study.slug}`),
            lastModified: new Date(study.updatedAt),
            changeFrequency: 'monthly' as const,
            priority: 0.75,
            alternates: { languages: languages(`/portfolio/${study.slug}`) },
        }))
    );

    return [...staticEntries, ...serviceEntries, ...caseStudyEntries, ...blogEntries, ...paperEntries];
}
