import * as motion from 'framer-motion/client';
import { Metadata } from 'next';
import { SITE_URL as BASE, localizedUrl, localeAlternates } from '@/lib/locale-url';
import { getAllPapers, topicsOf } from '@/data/papers';
import { PapersIndex } from '@/components/PapersIndex';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const isId = locale === 'id';
    const canonical = localizedUrl(locale, '/research');

    const title = isId ? 'Riset & Publikasi | ScaleJade' : 'Research & Papers | ScaleJade';
    const description = isId
        ? 'Publikasi riset terapan ScaleJade di bidang AI, blockchain, sistem terdistribusi, dan keamanan — mengubah penelitian mutakhir menjadi sistem andal untuk industri teregulasi.'
        : 'Applied research papers from ScaleJade across AI, blockchain, distributed systems, and security — turning frontier work into reliable systems for regulated industries.';

    return {
        metadataBase: new URL(BASE),
        title,
        description,
        alternates: localeAlternates(locale, '/research'),
        openGraph: {
            type: 'website',
            url: canonical,
            title,
            description,
            siteName: 'ScaleJade',
            locale: isId ? 'id_ID' : 'en_US',
            images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: 'ScaleJade Research' }],
        },
        twitter: { card: 'summary_large_image', title, description, images: [`${BASE}/opengraph-image`] },
    };
}

export default async function ResearchPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const isId = locale === 'id';
    const papers = await getAllPapers();
    const topics = topicsOf(papers);

    const badge = isId ? 'Riset' : 'Research';
    const heading = isId ? 'Riset & Publikasi' : 'Research & Papers';
    const intro = isId
        ? 'Penelitian terapan dari tim ScaleJade. Kami meneliti secara terbuka, mengukur dengan jujur, dan merilis sistem yang tahan terhadap tuntutan dunia nyata.'
        : 'Applied research from the ScaleJade team. We work in the open, measure honestly, and publish systems that hold up under real-world demands.';
    const allLabel = isId ? 'Semua' : 'All';

    return (
        <div className="min-h-screen bg-canvas pt-24 pb-32" role="main">
            {/* Structured Data — research collection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        name: 'ScaleJade Research',
                        description:
                            'Applied research papers from ScaleJade across AI, blockchain, distributed systems, and security.',
                        url: 'https://www.scalejade.com/research',
                        isPartOf: { '@id': 'https://www.scalejade.com/#website' },
                        hasPart: papers.map((p) => ({
                            '@type': 'ScholarlyArticle',
                            headline: p.title,
                            abstract: p.summary,
                            datePublished: new Date(p.date).toISOString(),
                            author: p.authors.map((name) => ({ '@type': 'Person', name })),
                            url: `https://www.scalejade.com/research/${p.slug}`,
                        })),
                    }),
                }}
            />

            {/* Header */}
            <section className="px-6 max-w-6xl mx-auto mb-16">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
                    <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-scalejade-800/20 bg-surface px-3 py-1 text-sm font-medium uppercase tracking-wide text-scalejade-800">
                        {badge}
                    </span>
                    <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
                        {heading}
                    </h1>
                    <p className="text-lg font-light leading-relaxed text-slate-500 md:text-xl">{intro}</p>
                </motion.div>
            </section>

            {/* Filterable papers grid */}
            <section className="px-6 max-w-6xl mx-auto">
                <PapersIndex papers={papers} topics={topics} locale={locale} allLabel={allLabel} />
            </section>
        </div>
    );
}
