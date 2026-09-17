import Link from 'next/link';
import { Metadata } from 'next';

import { SITE_URL as BASE, localizedUrl, localeAlternates } from '@/lib/locale-url';
import { getAllPosts } from '@/data/blog';
import { getAllPapers } from '@/data/papers';

// One reverse-chronological stream of everything ScaleJade publishes. /blog and
// /research stay live as filtered views, so existing links and canonicals survive.
type Entry = {
    kind: 'article' | 'paper';
    slug: string;
    title: string;
    summary: string;
    date: string;
    meta: string;
};

const FILTERS = ['all', 'article', 'paper'] as const;
type Filter = (typeof FILTERS)[number];

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const isId = locale === 'id';
    const canonical = localizedUrl(locale, '/insights');

    const title = isId ? 'Wawasan | ScaleJade' : 'Insights | ScaleJade';
    const description = isId
        ? 'Tulisan teknik dan riset terapan dari tim ScaleJade — rekayasa perangkat lunak, AI, blockchain, dan infrastruktur untuk industri teregulasi.'
        : 'Engineering writing and applied research from the ScaleJade team — software, AI, blockchain and infrastructure for regulated industries.';

    return {
        metadataBase: new URL(BASE),
        title,
        description,
        alternates: localeAlternates(locale, '/insights'),
        openGraph: {
            type: 'website',
            url: canonical,
            title,
            description,
            siteName: 'ScaleJade',
            locale: isId ? 'id_ID' : 'en_US',
            images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: 'ScaleJade Insights' }],
        },
        twitter: { card: 'summary_large_image', title, description, images: [`${BASE}/opengraph-image`] },
    };
}

export default async function InsightsPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ type?: string }>;
}) {
    const { locale } = await params;
    const { type } = await searchParams;
    const isId = locale === 'id';
    const prefix = isId ? `/${locale}` : '';

    const active: Filter = FILTERS.includes(type as Filter) ? (type as Filter) : 'all';

    const [posts, papers] = await Promise.all([getAllPosts(), getAllPapers()]);

    const entries: Entry[] = [
        ...posts.map((post): Entry => ({
            kind: 'article',
            slug: `${prefix}/blog/${post.slug}`,
            title: post.title,
            summary: post.excerpt,
            date: post.date,
            meta: `${post.category} · ${post.readingTime}`,
        })),
        ...papers.map((paper): Entry => ({
            kind: 'paper',
            slug: `${prefix}/research/${paper.slug}`,
            title: paper.title,
            summary: paper.summary,
            date: paper.date,
            meta: paper.venue ?? paper.topics.join(' · '),
        })),
    ].sort((a, b) => b.date.localeCompare(a.date));

    const shown = active === 'all' ? entries : entries.filter((e) => e.kind === active);

    const label: Record<Filter, string> = {
        all: isId ? 'Semua' : 'All',
        article: isId ? 'Artikel' : 'Articles',
        paper: isId ? 'Publikasi' : 'Papers',
    };
    const kindLabel = { article: label.article, paper: label.paper };

    return (
        <div className="min-h-screen bg-canvas" role="main">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        name: 'ScaleJade Insights',
                        description: 'Engineering writing and applied research from ScaleJade.',
                        url: localizedUrl(locale, '/insights'),
                        isPartOf: { '@id': `${BASE}/#website` },
                    }),
                }}
            />

            <section className="pt-24 md:pt-32 pb-12 px-6 border-b border-slate-100">
                <div className="max-w-4xl mx-auto">
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-scalejade-600 mb-5 block">
                        {isId ? 'Wawasan' : 'Insights'}
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-slate-900 tracking-tight leading-[1.05] mb-6">
                        {isId ? 'Yang kami tulis dan ukur.' : 'What we write and what we measure.'}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-[62ch]">
                        {isId
                            ? 'Tulisan teknik dan riset terapan dalam satu aliran. Kami bekerja secara terbuka, mengukur dengan jujur, dan mempublikasikan sistem yang tahan terhadap tuntutan nyata.'
                            : 'Engineering writing and applied research in one stream. ScaleJade works in the open, measures honestly, and publishes systems that hold up under real-world demands.'}
                    </p>
                </div>
            </section>

            <section className="px-6 py-10 md:py-14">
                <div className="max-w-4xl mx-auto">
                    <nav className="flex flex-wrap gap-2 mb-12" aria-label={isId ? 'Saring' : 'Filter'}>
                        {FILTERS.map((f) => (
                            <Link
                                key={f}
                                href={f === 'all' ? `${prefix}/insights` : `${prefix}/insights?type=${f}`}
                                aria-current={active === f ? 'true' : undefined}
                                className={`rounded-[3px] border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
                                    active === f
                                        ? 'border-scalejade-600 bg-scalejade-50 text-scalejade-700'
                                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                                }`}
                            >
                                {label[f]}
                            </Link>
                        ))}
                    </nav>

                    {shown.length === 0 ? (
                        <p className="text-slate-700">
                            {isId ? 'Belum ada yang dipublikasikan di sini.' : 'Nothing published here yet.'}
                        </p>
                    ) : (
                        <ul className="divide-y divide-slate-100 border-t border-slate-200">
                            {shown.map((entry) => (
                                <li key={entry.slug}>
                                    <Link href={entry.slug} className="group block py-8">
                                        <div className="flex flex-wrap items-center gap-3 mb-3 font-mono text-[10px] uppercase tracking-[0.16em]">
                                            <span
                                                className={
                                                    entry.kind === 'paper'
                                                        ? 'rounded bg-scalejade-50 px-2 py-1 text-scalejade-700'
                                                        : 'rounded bg-slate-100 px-2 py-1 text-slate-700'
                                                }
                                            >
                                                {kindLabel[entry.kind]}
                                            </span>
                                            <span className="text-slate-500">{entry.meta}</span>
                                            <time className="text-slate-500" dateTime={entry.date}>
                                                {new Date(entry.date).toLocaleDateString(isId ? 'id-ID' : 'en-GB', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </time>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight leading-snug mb-3 transition-colors group-hover:text-scalejade-700">
                                            {entry.title}
                                        </h2>
                                        <p className="text-slate-700 leading-relaxed max-w-[70ch]">{entry.summary}</p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </div>
    );
}
