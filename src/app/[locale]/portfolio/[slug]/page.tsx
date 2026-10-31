import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { Metadata } from 'next';

import { SITE_URL as BASE, localizedUrl, localeAlternates } from '@/lib/locale-url';
import { getProject } from '@/data/projects';
import { CORE_SECTORS } from '@/data/sectors';
import { ProjectGallery } from '@/components/ProjectGallery';
import { isOptimizable } from '@/lib/images';

// Everything on this page comes from `getProject()`, which has already applied
// the confidentiality rules (src/data/projects.ts). Do not fetch the raw row here.

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
    const { slug, locale } = await params;
    const study = await getProject(slug);
    if (!study) return {};

    const title = `${study.title} | ScaleJade`;
    const canonical = localizedUrl(locale, `/portfolio/${slug}`);
    const image = study.images[0]?.url ?? `${BASE}/opengraph-image`;

    return {
        metadataBase: new URL(BASE),
        title: { absolute: title },
        description: study.summary,
        alternates: localeAlternates(locale, `/portfolio/${slug}`),
        openGraph: {
            type: 'article',
            url: canonical,
            title,
            description: study.summary,
            siteName: 'ScaleJade',
            locale: locale === 'id' ? 'id_ID' : 'en_US',
            images: [{ url: image, alt: study.images[0]?.alt ?? study.title }],
        },
        twitter: { card: 'summary_large_image', title, description: study.summary, images: [image] },
    };
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return <h2 className="text-sm font-medium text-scalejade-600 mb-5">{children}</h2>;
}

export default async function CaseStudyPage({
    params,
}: {
    params: Promise<{ slug: string; locale: string }>;
}) {
    const { slug, locale } = await params;
    const study = await getProject(slug);
    if (!study) notFound();

    const prefix = locale === 'en' ? '' : `/${locale}`;
    const t = await getTranslations({ locale, namespace: 'Portfolio' });
    const sectorNames = await getTranslations({ locale, namespace: 'Sectors' });

    const sectorName = sectorNames(study.sector);
    const coreSector = CORE_SECTORS.find((s) => s.messageKey === study.sector);
    const named = !study.isConfidential && study.clientName;

    const engagement = [
        { label: t('role'), value: study.role },
        { label: t('team'), value: study.team },
        { label: t('duration'), value: study.duration },
    ].filter((item): item is { label: string; value: string } => Boolean(item.value));

    const hasOutcomes = study.outcomes.length > 0;

    return (
        <div className="min-h-screen bg-canvas pt-20 pb-32" role="main">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Article',
                        headline: study.title,
                        description: study.summary,
                        url: localizedUrl(locale, `/portfolio/${slug}`),
                        image: study.images.map((img) => img.url),
                        about: sectorName,
                        keywords: study.techStack.join(', '),
                        dateModified: study.updatedAt,
                        author: { '@id': `${BASE}/#organization` },
                        publisher: { '@id': `${BASE}/#organization` },
                        isPartOf: { '@id': `${BASE}/#website` },
                    }),
                }}
            />

            {/* 1. Header */}
            <header className="px-6 max-w-5xl mx-auto mb-14">
                <Link
                    href={`${prefix}/portfolio`}
                    className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    {t('back')}
                </Link>
                <p className="text-sm font-medium leading-relaxed mb-5">
                    <span className="text-scalejade-600">{sectorName}</span>
                    <span className="text-slate-400"> · </span>
                    <span className="text-slate-500">{study.clientClassification}</span>
                </p>
                <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-slate-900 leading-[1.05] mb-6 max-w-[20ch]">
                    {study.title}
                </h1>
                <p className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-[62ch]">{study.summary}</p>

                {named ? (
                    <div className="mt-8 flex items-center gap-4">
                        {study.clientLogoUrl && (
                            <span className="relative h-10 w-28 shrink-0">
                                <Image src={study.clientLogoUrl} alt="" fill sizes="112px" unoptimized={!isOptimizable(study.clientLogoUrl)} className="object-contain object-left" />
                            </span>
                        )}
                        <p className="text-sm text-slate-600">
                            {t('client')}: <span className="font-semibold text-slate-900">{study.clientName}</span>
                        </p>
                    </div>
                ) : (
                    <p className="mt-8 inline-flex items-center gap-2 text-sm text-slate-600">
                        <ShieldCheck className="w-4 h-4 text-scalejade-600" aria-hidden="true" />
                        {t('confidential_note')}
                    </p>
                )}
            </header>

            {/* 2. Gallery — the system in the field and in production. */}
            {study.images.length > 0 && (
                <section className="px-6 max-w-5xl mx-auto mb-20" aria-label={t('gallery_title')}>
                    <ProjectGallery
                        images={study.images}
                        labels={{
                            open: t('gallery_open'),
                            close: t('gallery_close'),
                            previous: t('gallery_previous'),
                            next: t('gallery_next'),
                            kinds: {
                                field: t('kind_field'),
                                product: t('kind_product'),
                                architecture: t('kind_architecture'),
                                team: t('kind_team'),
                                other: t('kind_other'),
                            },
                        }}
                    />
                </section>
            )}

            {/* 3. Outcomes, when measured; otherwise the engineering highlights. */}
            {(hasOutcomes || study.highlights.length > 0) && (
                <section className="px-6 max-w-5xl mx-auto mb-20">
                    <div className="rounded-2xl bg-[var(--color-ink-900,#0f1a13)] p-8 md:p-10">
                        <h2 className="text-sm font-medium text-scalejade-400 mb-6">
                            {hasOutcomes ? t('outcomes') : t('metrics_header')}
                        </h2>
                        {hasOutcomes ? (
                            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                {study.outcomes.map((o) => (
                                    <div key={o.label}>
                                        <dd className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-2">{o.value}</dd>
                                        <dt className="text-sm text-scalejade-100/85 leading-relaxed">{o.label}</dt>
                                    </div>
                                ))}
                            </dl>
                        ) : (
                            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {study.highlights.map((m) => (
                                    <li key={m} className="text-lg font-medium text-white leading-snug">{m}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            )}

            {/* 4. Body — story on the left, facts on the right. */}
            <div className="px-6 max-w-5xl mx-auto grid grid-cols-1 gap-16 lg:grid-cols-[1fr_16rem] lg:gap-20">
                <div className="space-y-16 min-w-0">
                    {study.challenge && (
                        <section>
                            <SectionLabel>{t('challenge')}</SectionLabel>
                            <p className="text-lg text-slate-700 leading-relaxed max-w-[65ch]">{study.challenge}</p>
                        </section>
                    )}

                    {study.built.length > 0 && (
                        <section>
                            <SectionLabel>{t('built')}</SectionLabel>
                            <ul className="border-t border-slate-200">
                                {study.built.map((item) => (
                                    <li key={item} className="border-b border-slate-200 py-4 text-slate-700 leading-relaxed">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {hasOutcomes && study.highlights.length > 0 && (
                        <section>
                            <SectionLabel>{t('metrics_header')}</SectionLabel>
                            <ul className="space-y-2">
                                {study.highlights.map((m) => (
                                    <li key={m} className="text-slate-800 flex items-start gap-2">
                                        <span className="text-scalejade-600" aria-hidden="true">▪</span> {m}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {study.quote && (
                        <figure className="border-l-2 border-scalejade-600 pl-6">
                            <blockquote className="text-2xl font-medium text-slate-900 leading-snug tracking-tight mb-4">
                                “{study.quote.text}”
                            </blockquote>
                            <figcaption className="text-sm text-slate-600">
                                {study.quote.name && (
                                    <>
                                        <span className="font-semibold text-slate-900">{study.quote.name}</span>,{' '}
                                    </>
                                )}
                                {study.quote.role}
                            </figcaption>
                        </figure>
                    )}

                    <p className="text-sm text-slate-600 leading-relaxed">{t('reference')}</p>
                </div>

                <aside className="space-y-10 text-sm">
                    {engagement.length > 0 && (
                        <div>
                            <SectionLabel>{t('engagement')}</SectionLabel>
                            <dl className="space-y-4">
                                {engagement.map((item) => (
                                    <div key={item.label}>
                                        <dt className="text-slate-500 mb-1">{item.label}</dt>
                                        <dd className="text-slate-900 font-medium">{item.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )}

                    {study.constraints.length > 0 && (
                        <div>
                            <SectionLabel>{t('constraints')}</SectionLabel>
                            <ul className="flex flex-wrap gap-2">
                                {study.constraints.map((r) => (
                                    <li key={r} className="rounded bg-scalejade-50 px-2.5 py-1 text-xs font-medium text-scalejade-700">
                                        {r}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {study.techStack.length > 0 && (
                        <div>
                            <SectionLabel>{t('tech_header')}</SectionLabel>
                            <ul className="flex flex-wrap gap-2">
                                {study.techStack.map((tech) => (
                                    <li key={tech} className="px-3 py-1 bg-surface border border-slate-200 rounded-md text-xs font-semibold text-slate-600">
                                        {tech}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {coreSector && (
                        <Link
                            href={`${prefix}/sectors/${coreSector.slug}`}
                            className="inline-flex items-center gap-2 font-medium text-scalejade-700 hover:text-scalejade-800"
                        >
                            {t('sector_link')}
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                    )}
                </aside>
            </div>

            {/* 5. Close */}
            <section className="px-6 max-w-5xl mx-auto mt-24">
                <div className="rounded-2xl border border-slate-200 p-10 md:p-14">
                    <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-4">
                        {t('cta_title')}
                    </h2>
                    <p className="text-lg text-slate-700 leading-relaxed max-w-[56ch] mb-8">{t('cta_body')}</p>
                    <Link
                        href={`${prefix}/contact`}
                        className="inline-flex items-center gap-2 bg-scalejade-800 text-white font-medium px-6 py-3.5 rounded-[3px] hover:bg-scalejade-900 transition-colors"
                    >
                        {t('cta_button')}
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
