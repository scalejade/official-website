import { MetadataRoute } from 'next';
import { getAllPosts } from '@/data/blog';

const BASE_URL = 'https://scalejade.com';
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();
    const blogPosts = await getAllPosts();

    const staticEntries = staticRoutes.flatMap(route =>
        locales.map(locale => ({
            url: `${BASE_URL}/${locale}${route}`,
            lastModified: now,
            changeFrequency: route === '' ? ('weekly' as const) : ('monthly' as const),
            priority: route === '' ? 1.0 : route === '/services' ? 0.9 : 0.8,
            alternates: {
                languages: {
                    en: `${BASE_URL}/en${route}`,
                    id: `${BASE_URL}/id${route}`,
                },
            },
        }))
    );

    const serviceEntries = serviceslugs.flatMap(slug =>
        locales.map(locale => ({
            url: `${BASE_URL}/${locale}/services/${slug}`,
            lastModified: now,
            changeFrequency: 'monthly' as const,
            priority: 0.85,
            alternates: {
                languages: {
                    en: `${BASE_URL}/en/services/${slug}`,
                    id: `${BASE_URL}/id/services/${slug}`,
                },
            },
        }))
    );

    const blogEntries = blogPosts.flatMap(post =>
        locales.map(locale => ({
            url: `${BASE_URL}/${locale}/blog/${post.slug}`,
            lastModified: new Date(post.date),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
            alternates: {
                languages: {
                    en: `${BASE_URL}/en/blog/${post.slug}`,
                    id: `${BASE_URL}/id/blog/${post.slug}`,
                },
            },
        }))
    );

    return [...staticEntries, ...serviceEntries, ...blogEntries];
}
