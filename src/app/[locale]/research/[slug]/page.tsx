import { notFound } from 'next/navigation';
import Link from 'next/link';
import * as motion from 'framer-motion/client';
import { ArrowLeft, FileText, ExternalLink, Code2, Database } from 'lucide-react';
import { Metadata } from 'next';
import { getAllPapers, getPaperBySlug } from '@/data/papers';
import { SITE_URL as BASE, localizedUrl, localeAlternates } from '@/lib/locale-url';

export async function generateStaticParams() {
    const locales = ['en', 'id'];
    const papers = await getAllPapers();
    return locales.flatMap((locale) =>
        papers.map((paper) => ({ locale, slug: paper.slug }))
    );
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
    const { slug, locale } = await params;
    const paper = await getPaperBySlug(slug);
    if (!paper) return {};

    const canonical = localizedUrl(locale, `/research/${slug}`);

    return {
        metadataBase: new URL(BASE),
        title: paper.title,
        description: paper.summary,
        keywords: [...paper.topics.map((t) => t.toLowerCase()), 'ScaleJade', 'research', 'paper'],
        authors: paper.authors.map((name) => ({ name })),
        alternates: localeAlternates(locale, `/research/${slug}`),
        openGraph: {
            type: 'article',
            url: canonical,
            title: paper.title,
            description: paper.summary,
            siteName: 'ScaleJade',
            locale: locale === 'id' ? 'id_ID' : 'en_US',
            publishedTime: new Date(paper.date).toISOString(),
            authors: paper.authors,
            images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: paper.title }],
        },
        twitter: { card: 'summary_large_image', title: paper.title, description: paper.summary, images: [`${BASE}/opengraph-image`] },
    };
}

function formatDate(iso: string, locale: string) {
    return new Date(iso).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

const LINK_META: Record<string, { label: string; icon: typeof FileText }> = {
    pdf: { label: 'PDF', icon: FileText },
    arxiv: { label: 'arXiv', icon: ExternalLink },
    code: { label: 'Code', icon: Code2 },
    dataset: { label: 'Dataset', icon: Database },
};

export default async function PaperDetailPage({
    params,
}: {
    params: Promise<{ slug: string; locale: string }>;
}) {
    const { slug, locale } = await params;
    const paper = await getPaperBySlug(slug);
    if (!paper) notFound();

    const isId = locale === 'id';
    const links = Object.entries(paper.links ?? {}).filter(([, href]) => Boolean(href));

    return (
        <article className="min-h-screen bg-canvas pt-24 pb-32" role="main">
            {/* Structured Data — ScholarlyArticle */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'ScholarlyArticle',
                        headline: paper.title,
                        abstract: paper.abstract,
                        datePublished: new Date(paper.date).toISOString(),
                        author: paper.authors.map((name) => ({ '@type': 'Person', name })),
                        publisher: { '@id': 'https://www.scalejade.com/#organization' },
                        isPartOf: { '@id': 'https://www.scalejade.com/#website' },
                        keywords: paper.topics.join(', '),
                        url: `https://www.scalejade.com/research/${paper.slug}`,
                    }),
                }}
            />

            <div className="px-6 max-w-3xl mx-auto">
                <Link
                    href={`/${locale}/research`}
                    className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-scalejade-700"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {isId ? 'Kembali ke Riset' : 'Back to Research'}
                </Link>

                {/* Header */}
                <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-scalejade-700">
                        {paper.topics.map((topic) => (
                            <span key={topic} className="rounded-full bg-scalejade-50 px-2.5 py-1">
                                {topic}
                            </span>
                        ))}
                    </div>

                    <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
                        {paper.title}
                    </h1>

                    <p className="text-slate-700">{paper.authors.join(', ')}</p>
                    <p className="text-sm text-slate-400">
                        {paper.venue ? `${paper.venue} · ` : ''}
                        {formatDate(paper.date, locale)}
                    </p>

                    {links.length > 0 && (
                        <div className="mt-8 flex flex-wrap gap-3">
                            {links.map(([key, href]) => {
                                const meta = LINK_META[key] ?? { label: key, icon: ExternalLink };
                                const Icon = meta.icon;
                                return (
                                    <a
                                        key={key}
                                        href={href as string}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-surface px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-scalejade-600/50 hover:text-scalejade-800"
                                    >
                                        <Icon className="h-4 w-4" />
                                        {meta.label}
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </motion.header>

                {/* Abstract */}
                <section className="mt-14" aria-labelledby="abstract-heading">
                    <h2 id="abstract-heading" className="mb-3 text-sm font-bold uppercase tracking-widest text-scalejade-600">
                        {isId ? 'Abstrak' : 'Abstract'}
                    </h2>
                    <p className="text-lg leading-relaxed text-slate-700">{paper.abstract}</p>
                </section>

                {/* Sections */}
                {paper.sections?.map((section) => (
                    <section key={section.heading} className="mt-12">
                        <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-900">{section.heading}</h2>
                        {section.paragraphs.map((p, i) => (
                            <p key={i} className="mb-4 leading-relaxed text-slate-700">
                                {p}
                            </p>
                        ))}
                    </section>
                ))}

                {/* BibTeX */}
                {paper.bibtex && (
                    <section className="mt-16" aria-labelledby="cite-heading">
                        <h2 id="cite-heading" className="mb-3 text-sm font-bold uppercase tracking-widest text-scalejade-600">
                            {isId ? 'Sitasi' : 'Cite'}
                        </h2>
                        <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-700">
                            <code>{paper.bibtex}</code>
                        </pre>
                    </section>
                )}
            </div>
        </article>
    );
}
