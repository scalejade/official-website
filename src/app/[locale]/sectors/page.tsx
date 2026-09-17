import { useTranslations, useLocale } from 'next-intl';
import { Landmark, Building2, GraduationCap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

import { SITE_URL as BASE, localizedUrl, localeAlternates } from '@/lib/locale-url';
import { CORE_SECTORS, ALSO_WORKING_IN, SECTOR_NAMES_EN, type CoreSector } from '@/data/sectors';

const ICONS = {
    landmark: Landmark,
    building: Building2,
    graduation: GraduationCap,
} as const;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const isId = locale === 'id';
    const canonical = localizedUrl(locale, '/sectors');

    const title = isId ? 'Sektor yang Kami Layani | ScaleJade' : 'Sectors We Serve | ScaleJade';
    const description = isId
        ? 'ScaleJade bekerja mendalam di tiga sektor: institusi keuangan, pemerintah & sektor publik, serta pendidikan & riset — dibangun mengacu pada POJK, SPBE, UU PDP, ISO 20022, dan MAS TRM.'
        : 'ScaleJade works deeply in three sectors: financial institutions, government & public sector, and education & research — built against POJK, SPBE, UU PDP, ISO 20022 and MAS TRM.';

    return {
        metadataBase: new URL(BASE),
        title,
        description,
        alternates: localeAlternates(locale, '/sectors'),
        openGraph: {
            type: 'website',
            url: canonical,
            title,
            description,
            siteName: 'ScaleJade',
            locale: isId ? 'id_ID' : 'en_US',
            images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: 'Sectors ScaleJade serves' }],
        },
        twitter: { card: 'summary_large_image', title, description, images: [`${BASE}/opengraph-image`] },
    };
}

export default function SectorsPage() {
    const t = useTranslations('SectorDetails');
    const s = useTranslations('Sectors');
    const p = useTranslations('SectorPages');
    const locale = useLocalePrefix();

    return (
        <div className="min-h-screen bg-canvas" role="main">

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        name: 'Sectors We Serve',
                        description:
                            'ScaleJade works deeply in three sectors: financial institutions, government and public sector, and education and research.',
                        url: `${BASE}/sectors`,
                        isPartOf: { '@id': `${BASE}/#website` },
                        hasPart: CORE_SECTORS.map((sector, idx) => ({
                            '@type': 'WebPage',
                            position: idx + 1,
                            name: SECTOR_NAMES_EN[sector.slug],
                            url: `${BASE}/sectors/${sector.slug}`,
                        })),
                    }),
                }}
            />

            {/* 1. Header — states the regulatory reality, not a promise about partnership */}
            <section className="pt-24 md:pt-32 pb-14 md:pb-20 px-6 border-b border-slate-100">
                <div className="max-w-4xl mx-auto">
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-scalejade-600 mb-5 block">
                        {t('header_badge')}
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-slate-900 tracking-tight leading-[1.05] mb-6">
                        {t('header_title')}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-[62ch]">
                        {t('header_sub')}
                    </p>
                </div>
            </section>

            {/* 2. Three featured sectors. Deliberately not a uniform grid — the
                hierarchy is the argument that three sectors are not seven. */}
            <section className="px-6 py-16 md:py-24" aria-labelledby="core-sectors-heading">
                <h2 id="core-sectors-heading" className="sr-only">Core sectors</h2>
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {CORE_SECTORS.map((sector) => (
                        <SectorCard
                            key={sector.slug}
                            sector={sector}
                            name={s(sector.messageKey)}
                            summary={p(`${sector.slug}.card_summary`)}
                            labels={{
                                regulations: t('proof_regulations'),
                                work: t('proof_work'),
                                lead: t('proof_lead'),
                                studies: t('count_studies', { count: sector.workIds.length }),
                                papers: t('count_papers', { count: sector.paperSlugs.length }),
                                view: t('view'),
                            }}
                            prefix={locale}
                        />
                    ))}
                </div>
            </section>

            {/* 3. Also working in. Each line carries its own capability qualifier,
                which is what lets the section stand without a sentence explaining
                why these sectors have no page. Full contrast, never greyed out —
                if a sector is worth listing it is worth reading. */}
            <section className="px-6 pb-20 md:pb-28" aria-labelledby="also-heading">
                <div className="max-w-7xl mx-auto border-t border-slate-200 pt-10">
                    <h2 id="also-heading" className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-3">
                        {t('also_title')}
                    </h2>
                    <p className="text-slate-700 leading-relaxed max-w-[58ch] mb-8">
                        {t('also_line')}
                    </p>
                    <dl className="max-w-3xl divide-y divide-slate-100 border-t border-slate-100">
                        {ALSO_WORKING_IN.map((key) => (
                            <div
                                key={key}
                                className="grid grid-cols-1 gap-x-8 gap-y-1 py-4 sm:grid-cols-[minmax(0,17rem)_1fr] sm:items-baseline"
                            >
                                <dt className="font-medium text-slate-900">{s(key)}</dt>
                                <dd className="font-mono text-xs uppercase tracking-[0.08em] text-slate-600">
                                    {t(`also_qualifier.${key}`)}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            {/* 4. CTA */}
            <section className="px-6 pb-24 md:pb-32">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-4">
                        {t('cta_title')}
                    </h2>
                    <p className="text-slate-700 leading-relaxed mb-8">
                        {t('cta_sub')}
                    </p>
                    <Link
                        href={`${locale}/contact`}
                        className="inline-flex items-center gap-2 bg-scalejade-600 text-white font-medium px-8 py-4 rounded-md hover:bg-scalejade-800 transition-colors"
                    >
                        {t('cta_button')}
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                </div>
            </section>
        </div>
    );
}

function SectorCard({
    sector,
    name,
    summary,
    labels,
    prefix,
}: {
    sector: CoreSector;
    name: string;
    summary: string;
    labels: {
        regulations: string;
        work: string;
        lead: string;
        studies: string;
        papers: string;
        view: string;
    };
    prefix: string;
}) {
    const Icon = ICONS[sector.icon];
    const shownRegs = sector.regulations.slice(0, 3);
    const extraRegs = sector.regulations.length - shownRegs.length;

    return (
        <Link
            href={`${prefix}/sectors/${sector.slug}`}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-8 transition-colors hover:border-scalejade-600/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-scalejade-600"
        >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-ink-900,#0f1a13)] text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
            </div>

            <h3 className="text-xl font-semibold tracking-tight text-slate-900 mb-3">{name}</h3>
            <p className="text-sm leading-relaxed text-slate-700 mb-7">{summary}</p>

            {/* The three proof rows are the point of this card: a regulation,
                a piece of published work, and a named human. */}
            <dl className="mt-auto space-y-3.5 border-t border-slate-200 pt-6 text-sm">
                <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1.5">
                        {labels.regulations}
                    </dt>
                    <dd className="font-mono text-xs leading-relaxed text-slate-800">
                        {shownRegs.join(' · ')}
                        {extraRegs > 0 && <span className="text-slate-500"> +{extraRegs}</span>}
                    </dd>
                </div>

                <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1.5">
                        {labels.work}
                    </dt>
                    <dd className="text-slate-800">
                        {labels.studies} · {labels.papers}
                    </dd>
                </div>

                {/* Rendered only once a sector lead exists — an empty slot is
                    better than a placeholder human. */}
                {sector.lead && (
                    <div>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1.5">
                            {labels.lead}
                        </dt>
                        <dd className="text-slate-800">
                            {sector.lead.name} — {sector.lead.role}
                        </dd>
                    </div>
                )}
            </dl>

            <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-scalejade-700">
                {labels.view}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
        </Link>
    );
}

/** next-intl serves the default locale unprefixed; mirror that in internal links. */
function useLocalePrefix() {
    const locale = useLocale();
    return locale === 'en' ? '' : `/${locale}`;
}
