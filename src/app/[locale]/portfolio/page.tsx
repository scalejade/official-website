import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Metadata } from 'next';

import { SITE_URL as BASE, localizedUrl, localeAlternates } from '@/lib/locale-url';
import { getAllProjects, SECTORS, type Sector } from '@/data/projects';
import { CoverSlideshow } from '@/components/CoverSlideshow';
import { Pagination, PAGE_SIZE, paginate } from '@/components/Pagination';


export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const isId = locale === 'id';
    const canonical = localizedUrl(locale, '/portfolio');

    const title = isId ? 'Portofolio | ScaleJade' : 'Portfolio | ScaleJade';
    const description = isId
        ? 'Pilihan keterlibatan ScaleJade di sektor keuangan, energi, rekayasa, dan pendidikan — sistem yang dibangun untuk institusi teregulasi di Singapura dan Indonesia.'
        : 'Selected ScaleJade engagements in finance, energy, engineering and education — systems built for regulated institutions in Singapore and Indonesia.';

    return {
        metadataBase: new URL(BASE),
        title: { absolute: title },
        description,
        alternates: localeAlternates(locale, '/portfolio'),
        openGraph: {
            type: 'website',
            url: canonical,
            title,
            description,
            siteName: 'ScaleJade',
            locale: isId ? 'id_ID' : 'en_US',
            images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: 'ScaleJade Portfolio' }],
        },
        twitter: { card: 'summary_large_image', title, description, images: [`${BASE}/opengraph-image`] },
    };
}

export default async function PortfolioPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ sector?: string; page?: string }>;
}) {
    const { locale } = await params;
    const { sector, page } = await searchParams;
    const prefix = locale === 'en' ? '' : `/${locale}`;

    const t = await getTranslations({ locale, namespace: 'Portfolio' });
    const sectorNames = await getTranslations({ locale, namespace: 'Sectors' });

    const projects = await getAllProjects();
    // Only sectors with at least one published engagement get a filter.
    const sectorsInUse = SECTORS.filter((key) => projects.some((p) => p.sector === key));

    const active = sectorsInUse.includes(sector as Sector) ? (sector as Sector) : null;
    const filtered = active ? projects.filter((p) => p.sector === active) : projects;
    const { currentPage, totalPages, pageItems: shown } = paginate(filtered, page, PAGE_SIZE.projects);
    const pageHref = (n: number) => {
        const query = new URLSearchParams();
        if (active) query.set('sector', active);
        if (n > 1) query.set('page', String(n));
        const qs = query.toString();
        return `${prefix}/portfolio${qs ? `?${qs}` : ''}`;
    };

    const filters: { key: Sector | null; label: string }[] = [
        { key: null, label: t('filter_all') },
        ...sectorsInUse.map((key) => ({ key, label: sectorNames(key) })),
    ];

    return (
        <div className="min-h-screen bg-canvas pt-24 pb-32" role="main">

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        "name": "ScaleJade Portfolio",
                        "description": "Selected engagements for regulated institutions in Southeast Asia.",
                        "url": localizedUrl(locale, '/portfolio'),
                        "isPartOf": { "@id": `${BASE}/#website` },
                        "mainEntity": {
                            "@type": "ItemList",
                            "numberOfItems": projects.length,
                            "itemListElement": projects.map((project, idx) => ({
                                "@type": "ListItem",
                                "position": idx + 1,
                                "name": project.title,
                                "description": project.summary,
                                "url": localizedUrl(locale, `/portfolio/${project.slug}`)
                            }))
                        }
                    })
                }}
            />

            {/* 1. Header */}
            <section className="px-6 max-w-5xl mx-auto mb-16" aria-labelledby="portfolio-heading">
                <span className="text-sm font-medium text-scalejade-600 mb-5 block">
                    {t('badge')}
                </span>
                <h1
                    id="portfolio-heading"
                    className="text-4xl md:text-6xl font-semibold tracking-tight text-slate-900 mb-6"
                >
                    {t('title')}
                </h1>
                <p className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-[62ch] mb-6">
                    {t('subtitle')}
                </p>
                {projects.length > 0 && (
                    <p className="text-sm text-slate-600 leading-relaxed max-w-[70ch] flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-scalejade-600" aria-hidden="true" />
                        {t('nda_note')}
                    </p>
                )}
            </section>

            {/* 2. Sector filter — plain links, so every filtered view is crawlable
                and shareable without client-side state. */}
            {projects.length > 0 && (
            <section className="px-6 max-w-5xl mx-auto mb-12">
                <nav className="flex flex-wrap gap-2" aria-label={t('filter_label')}>
                    {filters.map(({ key, label }) => (
                        <Link
                            key={key ?? 'all'}
                            href={key ? `${prefix}/portfolio?sector=${key}` : `${prefix}/portfolio`}
                            aria-current={active === key ? 'true' : undefined}
                            scroll={false}
                            className={`rounded-[3px] border px-3.5 py-2 text-[13px] font-medium tracking-[0.01em] transition-colors ${
                                active === key
                                    ? 'border-scalejade-600 bg-scalejade-50 text-scalejade-700'
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
            </section>
            )}

            {/* 3. Engagements */}
            <section className="px-6 max-w-5xl mx-auto" aria-label={t('badge')}>
                {projects.length === 0 ? (
                    <p className="text-lg text-slate-700 leading-relaxed max-w-[62ch] border-t border-slate-200 pt-10">{t('none')}</p>
                ) : shown.length === 0 ? (
                    <p className="text-slate-700">{t('empty')}</p>
                ) : (
                    <ol className="divide-y divide-slate-200 border-y border-slate-200">
                        {shown.map((project) => (
                            <li key={project.slug} id={project.slug} className="scroll-mt-28">
                                <article className="grid grid-cols-1 gap-6 py-12 md:grid-cols-[minmax(0,14rem)_1fr] md:gap-12 md:py-16">
                                    <div className="text-sm font-medium leading-relaxed">
                                        <p className="text-scalejade-600 mb-2">
                                            {sectorNames(project.sector)}
                                        </p>
                                        <p className="text-slate-500">{project.clientClassification}</p>
                                        {!project.isConfidential && project.clientName && (
                                            <p className="mt-1 font-semibold text-slate-900">{project.clientName}</p>
                                        )}
                                    </div>

                                    <div>
                                        {project.images.length > 0 && (
                                            <Link
                                                href={`${prefix}/portfolio/${project.slug}`}
                                                className="relative mb-8 block aspect-[16/9] overflow-hidden rounded-xl border border-slate-200 bg-surface"
                                                tabIndex={-1}
                                                aria-hidden="true"
                                            >
                                                <CoverSlideshow
                                                    images={project.images}
                                                    sizes="(max-width: 768px) 100vw, 720px"
                                                />
                                            </Link>
                                        )}
                                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight mb-4">
                                            <Link href={`${prefix}/portfolio/${project.slug}`} className="hover:text-scalejade-700 transition-colors">
                                                {project.title}
                                            </Link>
                                        </h2>
                                        <p className="text-slate-700 text-base md:text-lg leading-relaxed mb-8 max-w-[65ch]">
                                            {project.summary}
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                                                    {t('metrics_header')}
                                                </h3>
                                                <ul className="space-y-2">
                                                    {project.highlights.map((metric) => (
                                                        <li key={metric} className="text-sm font-medium text-slate-800 flex items-start gap-2">
                                                            <span className="text-scalejade-600 mt-0.5" aria-hidden="true">▪</span> {metric}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                                                    {t('tech_header')}
                                                </h3>
                                                <ul className="flex flex-wrap gap-2">
                                                    {project.techStack.map((tech) => (
                                                        <li key={tech} className="px-3 py-1 bg-surface border border-slate-200 rounded-md text-xs font-semibold text-slate-600">
                                                            {tech}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <Link
                                            href={`${prefix}/portfolio/${project.slug}`}
                                            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-scalejade-700 hover:text-scalejade-800"
                                        >
                                            {t('read_case')}
                                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                                        </Link>
                                    </div>
                                </article>
                            </li>
                        ))}
                    </ol>
                )}
                <Pagination currentPage={currentPage} totalPages={totalPages} hrefFor={pageHref} locale={locale} />
            </section>

            {/* 4. Close — every listing page ends with a next step. */}
            <section className="px-6 max-w-5xl mx-auto mt-24" aria-labelledby="portfolio-cta-heading">
                <div className="rounded-2xl bg-[var(--color-ink-900,#0f1a13)] p-10 md:p-14">
                    <h2 id="portfolio-cta-heading" className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-4">
                        {t('cta_title')}
                    </h2>
                    <p className="text-lg text-scalejade-100/85 leading-relaxed max-w-[56ch] mb-8">
                        {t('cta_body')}
                    </p>
                    <Link
                        href={`${prefix}/contact`}
                        className="inline-flex items-center gap-2 bg-white text-ink-900 font-medium px-6 py-3.5 rounded-[3px] hover:bg-scalejade-50 transition-colors"
                    >
                        {t('cta_button')}
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                </div>
            </section>

        </div>
    );
}
