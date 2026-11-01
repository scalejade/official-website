import { SITE_URL } from '@/lib/locale-url';
import { getAllPapers } from '@/data/papers';
import { getAllPosts } from '@/data/blog';

/**
 * /llms.txt — agent-facing infrastructure, not a citation lever.
 *
 * The 2026 evidence is that the major AI crawlers overwhelmingly read HTML and
 * barely fetch this file, and Google has stated it neither helps nor hurts
 * Search. It is here because it costs ~20 minutes and coding/browsing agents do
 * read it. Do not budget more than that, and do not expect ranking effects.
 *
 * Deliberately a single file. Generating per-page Markdown copies would create
 * duplicate content at scale and dilute crawl budget on the originals.
 */

const SERVICES = [
    ['Software engineering', '/services/software-engineering'],
    ['Artificial intelligence', '/services/artificial-intelligence'],
    ['Data analytics', '/services/data-analytics'],
    ['Cloud infrastructure', '/services/cloud-infrastructure'],
    ['Blockchain', '/services/blockchain'],
];

const SECTORS = [
    ['Financial institutions', '/sectors/financial-institutions'],
    ['Government & public sector', '/sectors/public-sector'],
    ['Education & research', '/sectors/education-research'],
];

const ABOUT = [
    ['About ScaleJade', '/about'],
    ['Selected work', '/portfolio'],
    ['Insights — engineering writing and research', '/insights'],
    ['Contact', '/contact'],
];

const link = ([label, path]: string[]) => `- [${label}](${SITE_URL}${path})`;

export const revalidate = 3600;

export async function GET() {
    const [papers, posts] = await Promise.all([getAllPapers(), getAllPosts()]);

    const body = `# ScaleJade

> ScaleJade builds and operates software, AI and ledger infrastructure for
> banks, universities and public institutions in Singapore and Indonesia.
> Founded 2024. Offices in Singapore and Jakarta.

## Services
${SERVICES.map(link).join('\n')}

## Sectors
${SECTORS.map(link).join('\n')}

## Research
${papers.map((p) => `- [${p.title}](${SITE_URL}/research/${p.slug})`).join('\n')}

## Latest insights
${posts.slice(0, 20).map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt}`).join('\n')}
- [All insights (RSS)](${SITE_URL}/feed.xml)

## About
${ABOUT.map(link).join('\n')}
`;

    return new Response(body, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
