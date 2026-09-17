import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Landmark, Building2, GraduationCap } from 'lucide-react';
import { Metadata } from 'next';

import { SITE_URL as BASE, localizedUrl, localeAlternates } from '@/lib/locale-url';
import { CORE_SECTORS, getCoreSector, SECTOR_NAMES_EN } from '@/data/sectors';
import { getPaperBySlug } from '@/data/papers';
import clientData from '@/data/clients.json';
import portfolioData from '@/data/portfolio.json';

const ICONS = {
    landmark: Landmark,
    building: Building2,
    graduation: GraduationCap,
} as const;

type Block = { title: string; desc: string };

export function generateStaticParams() {
    const locales = ['en', 'id'];
    return locales.flatMap((locale) => CORE_SECTORS.map((s) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
    const { slug, locale } = await params;
    const sector = getCoreSector(slug);
    if (!sector) return {};

    const s = await getTranslations({ locale, namespace: 'Sectors' });
    const p = await getTranslations({ locale, namespace: 'SectorPages' });

    const name = s(sector.messageKey);
    const title = `${name} | ScaleJade`;
    const description = p(`${slug}.card_summary`);
    const canonical = localizedUrl(locale, `/sectors/${slug}`);

    return {
        metadataBase: new URL(BASE),
        title,
        description,
        alternates: localeAlternates(locale, `/sectors/${slug}`),
        openGraph: {
            type: 'website',
            url: canonical,
            title,
            description,
            siteName: 'ScaleJade',
            locale: locale === 'id' ? 'id_ID' : 'en_US',
            images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: name }],
        },
        twitter: { card: 'summary_large_image', title, description, images: [`${BASE}/opengraph-image`] },
    };
}

export default async function SectorDetailPage({
    params,
}: {
    params: Promise<{ slug: string; locale: string }>;
}) {
    const { slug, locale } = await params;
    const sector = getCoreSector(slug);
    if (!sector) notFound();

    const s = await getTranslations({ locale, namespace: 'Sectors' });
    const p = await getTranslations({ locale, namespace: 'SectorPages' });
    const c = await getTranslations({ locale, namespace: 'SectorPages.common' });
    const d = await getTranslations({ locale, namespace: 'SectorDetails' });

    const prefix = locale === 'en' ? '' : `/${locale}`;
    const name = s(sector.messageKey);
    const Icon = ICONS[sector.icon];

    const pressures = p.raw(`${slug}.pressures`) as Block[];
    const systems = p.raw(`${slug}.systems`) as Block[];

    // Proof is assembled from what actually exists. A sector with no published
    // work renders the empty state rather than borrowing from another sector.
    const clients = clientData.filter((client) => sector.clientIds.includes(client.id));
    const work = portfolioData.filter((entry) => sector.workIds.includes(entry.id));
    const papers = (
        await Promise.all(sector.paperSlugs.map((paperSlug) => getPaperBySlug(paperSlug)))
    ).filter((paper) => paper !== undefined);
    const hasProof = clients.length > 0 || work.length > 0 || papers.length > 0;

    return (
        <div className="min-h-screen bg-canvas" role="main">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebPage',
                        name: SECTOR_NAMES_EN[sector.slug],
                        description: p(`${slug}.card_summary`),
                        url: localizedUrl(locale, `/sectors/${slug}`),
                        isPartOf: { '@id': `${BASE}/#website` },
                        about: { '@type': 'Thing', name: SECTOR_NAMES_EN[sector.slug] },
                        provider: { '@id': `${BASE}/#organization` },
                    }),
                }}
            />

            {/* 1. Header */}
            <section className="pt-24 md:pt-28 pb-14 md:pb-20 px-6 border-b border-slate-100">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href={`${prefix}/sectors`}
                        className="mb-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500 transition-colors hover:text-scalejade-700"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                        {c('back')}
                    </Link>

                    <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-ink-900,#0f1a13)] text-white">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-slate-900 tracking-tight leading-[1.05] mb-6">
                        {name}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-[62ch]">
                        {p(`${slug}.claim`)}
                    </p>
                </div>
            </section>

            {/* 2. What we see in this sector — the one dark full-bleed band */}
            <section className="bg-[var(--color-ink-900,#0f1a13)] px-6 py-16 md:py-24" aria-labelledby="pressures-heading">
                <div className="max-w-5xl mx-auto">
                    <h2
                        id="pressures-heading"
                        className="font-mono text-[11px] uppercase tracking-[0.18em] text-scalejade-400 mb-6"
                    >
                        {c('see_title')}
                    </h2>
                    <p className="text-xl md:text-2xl text-white leading-relaxed max-w-[58ch] mb-14">
                        {p(`${slug}.intro`)}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 border-t border-white/15 pt-12">
                        {pressures.map((item) => (
                            <div key={item.title}>
                                <h3 className="text-base font-semibold text-white mb-3 leading-snug">{item.title}</h3>
                                <p className="text-sm leading-relaxed text-scalejade-100/85">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. What we build against — the spec line */}
            <section className="px-6 py-16 md:py-20 border-b border-slate-100" aria-labelledby="regulations-heading">
                <div className="max-w-5xl mx-auto">
                    <h2
                        id="regulations-heading"
                        className="font-mono text-[11px] uppercase tracking-[0.18em] text-scalejade-600 mb-6"
                    >
                        {c('regulations_title')}
                    </h2>
                    <ul className="flex flex-wrap gap-x-3 gap-y-3 mb-5">
                        {sector.regulations.map((reg) => (
                            <li
                                key={reg}
                                className="rounded border border-slate-300 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] text-slate-800"
                            >
                                {reg}
                            </li>
                        ))}
                    </ul>
                    <p className="text-sm text-slate-600">{c('regulations_note')}</p>
                </div>
            </section>

            {/* 4. What we build — concrete systems, not service names */}
            <section className="px-6 py-16 md:py-24" aria-labelledby="systems-heading">
                <div className="max-w-5xl mx-auto">
                    <h2
                        id="systems-heading"
                        className="font-mono text-[11px] uppercase tracking-[0.18em] text-scalejade-600 mb-10"
                    >
                        {c('build_title')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        {systems.map((item) => (
                            <div key={item.title} className="border-t border-slate-200 pt-6">
                                <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-2.5">{item.title}</h3>
                                <p className="text-sm leading-relaxed text-slate-700">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Proof — work, research and logos filtered to this sector */}
            <section className="px-6 py-16 md:py-24 bg-surface border-y border-slate-100" aria-labelledby="proof-heading">
                <div className="max-w-5xl mx-auto">
                    <h2
                        id="proof-heading"
                        className="font-mono text-[11px] uppercase tracking-[0.18em] text-scalejade-600 mb-10"
                    >
                        {c('proof_title')}
                    </h2>

                    {!hasProof && (
                        <p className="text-slate-700 leading-relaxed max-w-[62ch]">{c('proof_empty')}</p>
                    )}

                    {clients.length > 0 && (
                        <div className="mb-14">
                            <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-6">
                                {c('proof_clients')}
                            </h3>
                            <div className="flex flex-wrap items-center gap-10">
                                {clients.map((client) => (
                                    <div key={client.id} className="relative h-12 w-32 md:h-14 md:w-40">
                                        <Image
                                            src={client.logo_url}
                                            alt={client.name}
                                            fill
                                            className="object-contain object-left"
                                            sizes="160px"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {work.length > 0 && (
                        <div className="mb-14">
                            <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-6">
                                {c('proof_work')}
                            </h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {work.map((entry) => (
                                    <li key={entry.id} className="rounded-xl border border-slate-200 bg-white p-6">
                                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-2">
                                            {entry.client_classification}
                                        </p>
                                        <h4 className="text-base font-semibold text-slate-900 tracking-tight mb-3">
                                            {entry.title}
                                        </h4>
                                        <ul className="flex flex-wrap gap-2">
                                            {entry.metrics.map((metric) => (
                                                <li
                                                    key={metric}
                                                    className="rounded bg-scalejade-50 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-scalejade-700"
                                                >
                                                    {metric}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href={`${prefix}/portfolio`}
                                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-scalejade-700 hover:text-scalejade-800"
                            >
                                {c('view_work')}
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                        </div>
                    )}

                    {papers.length > 0 && (
                        <div>
                            <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-6">
                                {c('proof_research')}
                            </h3>
                            <ul className="space-y-6">
                                {papers.map((paper) => (
                                    <li key={paper.slug} className="border-t border-slate-200 pt-6">
                                        <Link
                                            href={`${prefix}/research/${paper.slug}`}
                                            className="group block"
                                        >
                                            <h4 className="text-lg font-semibold text-slate-900 tracking-tight mb-2 group-hover:text-scalejade-700 transition-colors">
                                                {paper.title}
                                            </h4>
                                            <p className="text-sm leading-relaxed text-slate-700 mb-3 max-w-[70ch]">
                                                {paper.summary}
                                            </p>
                                            <span className="inline-flex items-center gap-2 text-sm font-medium text-scalejade-700">
                                                {c('read_paper')}
                                                <ArrowRight
                                                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </section>

            {/* 6. Who leads this sector — rendered only once a real person exists */}
            {sector.lead && (
                <section className="px-6 py-16 md:py-20 border-b border-slate-100" aria-labelledby="lead-heading">
                    <div className="max-w-5xl mx-auto">
                        <h2
                            id="lead-heading"
                            className="font-mono text-[11px] uppercase tracking-[0.18em] text-scalejade-600 mb-6"
                        >
                            {c('lead_title')}
                        </h2>
                        <p className="text-lg text-slate-900 font-semibold">{sector.lead.name}</p>
                        <p className="text-slate-700">{sector.lead.role}</p>
                    </div>
                </section>
            )}

            {/* 7. CTA — sector-specific */}
            <section className="px-6 py-20 md:py-28">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-4 leading-tight">
                        {p(`${slug}.cta_title`)}
                    </h2>
                    <p className="text-slate-700 leading-relaxed mb-8 max-w-[58ch]">{p(`${slug}.cta_body`)}</p>
                    <Link
                        href={`${prefix}/contact`}
                        className="inline-flex items-center gap-2 bg-scalejade-600 text-white font-medium px-8 py-4 rounded-md hover:bg-scalejade-800 transition-colors"
                    >
                        {d('cta_button')}
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
