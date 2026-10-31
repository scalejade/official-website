import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

import { SITE_URL as BASE, localizedUrl, localeAlternates } from '@/lib/locale-url';
import { CONTACT_EMAIL, LEGAL_ENTITIES } from '@/lib/company';
import { CORE_SECTORS } from '@/data/sectors';
import { getAllPapers } from '@/data/papers';

// Structure follows Jane Street (facts woven into the story, values as concrete
// commitments, entity disclosure), Monzo (registration shown as a trust signal)
// and Hudson River Trading (engineer-led headline, dated history, office list).
//
// The team section was removed while its people were placeholders; the old
// component is in git history (commit bcc0562) if it needs restoring.

/**
 * Copy still carrying a `[placeholder]` is never rendered. Fill the value in the
 * message catalogs and the block appears on its own — no code change needed.
 * Publishing "[N] engineers" to a bank's procurement team is worse than
 * publishing nothing.
 */
const isDraft = (text: string) => /\[[^\]]*\]/.test(text);

/** `requires: 'papers'` — shown only once research is published. */
type Item = { title: string; text: string; requires?: 'papers' };

const OFFICES = [
    {
        city: 'Singapore',
        entity: LEGAL_ENTITIES.sg,
        lines: ['9 Raffles Place, #16-20', 'Republic Plaza II', 'Singapore 048619'],
    },
    {
        city: 'Jakarta',
        entity: LEGAL_ENTITIES.id,
        lines: ['Kb. Melati, Tanah Abang', 'Jakarta Pusat 10230', 'Indonesia'],
    },
];

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const isId = locale === 'id';
    const canonical = localizedUrl(locale, '/about');

    const title = isId ? 'Tentang | ScaleJade' : 'About | ScaleJade';
    const description = isId
        ? 'Dibangun oleh insinyur, dipimpin oleh insinyur. ScaleJade membangun dan menjalankan perangkat lunak untuk institusi teregulasi dari Singapura dan Jakarta.'
        : 'Built by engineers, led by engineers. ScaleJade builds and runs software for regulated institutions from Singapore and Jakarta.';

    return {
        metadataBase: new URL(BASE),
        title: { absolute: title },
        description,
        alternates: localeAlternates(locale, '/about'),
        openGraph: {
            type: 'website',
            url: canonical,
            title,
            description,
            siteName: 'ScaleJade',
            locale: isId ? 'id_ID' : 'en_US',
            images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: 'About ScaleJade' }],
        },
        twitter: { card: 'summary_large_image', title, description, images: [`${BASE}/opengraph-image`] },
    };
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
    return (
        <h2 id={id} className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight mb-10">
            {children}
        </h2>
    );
}

export default async function AboutPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const prefix = locale === 'en' ? '' : `/${locale}`;
    const t = await getTranslations({ locale, namespace: 'About' });

    const papers = await getAllPapers();
    const founded = t('stat_founded_value');

    const stats = [
        { value: founded, label: t('stat_founded') },
        { value: String(OFFICES.length), label: t('stat_offices') },
        { value: String(CORE_SECTORS.length), label: t('stat_sectors') },
        { value: String(papers.length), label: t('stat_papers') },
        { value: t('stat_engineers_value'), label: t('stat_engineers') },
        { value: t('stat_clients_value'), label: t('stat_clients') },
    ].filter((s) => !isDraft(s.value) && s.value !== '0');

    const values = [
        ...(t.raw('values') as Item[]),
        ...(t.raw('commitments') as Item[]),
    ].filter((v) => !isDraft(v.text) && !(v.requires === 'papers' && papers.length === 0));

    const working = (t.raw('working') as Item[]).filter((w) => !isDraft(w.text));
    const founding = t('founding_text');

    // History: dated facts only. Add milestones here as they become public.
    const history: { year: string; text: string; href?: string }[] = [
        ...(isDraft(founded) ? [] : [{ year: founded, text: t('history_founded') }]),
        ...papers.map((p) => ({
            year: String(new Date(p.date).getFullYear()),
            text: t('history_paper', { title: p.title }),
            href: `${prefix}/research/${p.slug}`,
        })),
    ].sort((a, b) => a.year.localeCompare(b.year));

    const registrations = [
        { entity: LEGAL_ENTITIES.sg, place: t('legal_sg'), reg: t('legal_sg_reg') },
        { entity: LEGAL_ENTITIES.id, place: t('legal_id'), reg: t('legal_id_reg') },
    ];

    return (
        <div className="min-h-screen bg-canvas" role="main">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'AboutPage',
                        name: 'About ScaleJade',
                        url: localizedUrl(locale, '/about'),
                        about: { '@id': `${BASE}/#organization` },
                        isPartOf: { '@id': `${BASE}/#website` },
                    }),
                }}
            />

            {/* 1. Hero — HRT's "Built by coders, led by coders." */}
            <section className="px-6 pt-24 pb-16 md:pt-32 md:pb-20" aria-labelledby="about-heading">
                <div className="max-w-5xl mx-auto">
                    <p className="text-sm font-medium text-scalejade-600 mb-5">{t('label')}</p>
                    <h1
                        id="about-heading"
                        className="text-4xl md:text-6xl font-semibold tracking-tight text-slate-900 leading-[1.05] mb-6 max-w-[18ch]"
                    >
                        {t('title')}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-[58ch]">{t('intro')}</p>
                </div>
            </section>

            {/* 2. Story with the facts woven in — Jane Street's "Established in 2000." */}
            <section className="px-6 py-16 md:py-20 border-t border-slate-200" aria-labelledby="story-heading">
                <div className="max-w-5xl mx-auto grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-16">
                    <h2 id="story-heading" className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight leading-tight">
                        {t('story_title', { year: founded })}
                    </h2>
                    <div className="space-y-5 text-lg text-slate-700 leading-relaxed max-w-[62ch]">
                        <p>{t('story_text', { sectors: CORE_SECTORS.length })}</p>
                        {!isDraft(founding) && <p>{founding}</p>}
                    </div>
                </div>

                <dl className={`max-w-5xl mx-auto mt-16 grid grid-cols-2 ${stats.length % 3 === 0 ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200`}>
                    {stats.map((s) => (
                        <div key={s.label} className="bg-white p-6">
                            <dd className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-1">{s.value}</dd>
                            <dt className="text-sm text-slate-600 leading-snug">{s.label}</dt>
                        </div>
                    ))}
                </dl>
            </section>

            {/* 3. Values as commitments — Jane Street's wording, Monzo's cards. */}
            <section className="px-6 py-16 md:py-20 bg-surface border-t border-slate-200" aria-labelledby="values-heading">
                <div className="max-w-5xl mx-auto">
                    <SectionTitle id="values-heading">{t('values_title')}</SectionTitle>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {values.map((v) => (
                            <li key={v.title} className="rounded-xl border border-slate-200 bg-white p-8">
                                <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-3">{v.title}</h3>
                                <p className="text-slate-700 leading-relaxed">{v.text}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* 4. Working with us — appears once the engagement copy is final. */}
            {working.length > 0 && (
                <section className="px-6 py-16 md:py-20 border-t border-slate-200" aria-labelledby="working-heading">
                    <div className="max-w-5xl mx-auto">
                        <SectionTitle id="working-heading">{t('working_title')}</SectionTitle>
                        <dl className="divide-y divide-slate-200 border-y border-slate-200">
                            {working.map((w) => (
                                <div key={w.title} className="grid grid-cols-1 gap-3 py-6 md:grid-cols-[minmax(0,16rem)_1fr] md:gap-12">
                                    <dt className="font-semibold text-slate-900">{w.title}</dt>
                                    <dd className="text-slate-700 leading-relaxed">{w.text}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </section>
            )}

            {/* 5. History — HRT's dated timeline. */}
            {history.length > 0 && (
                <section className="px-6 py-16 md:py-20 border-t border-slate-200" aria-labelledby="history-heading">
                    <div className="max-w-5xl mx-auto">
                        <SectionTitle id="history-heading">{t('history_title')}</SectionTitle>
                        <ol className="border-l border-slate-200 ml-2">
                            {history.map((h) => (
                                <li key={h.text} className="relative pl-8 pb-8 last:pb-0">
                                    <span
                                        aria-hidden="true"
                                        className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-scalejade-600"
                                    />
                                    <p className="text-sm font-semibold text-scalejade-700 mb-1">{h.year}</p>
                                    {h.href ? (
                                        <Link href={h.href} className="text-slate-800 leading-relaxed hover:text-scalejade-700">
                                            {h.text}
                                        </Link>
                                    ) : (
                                        <p className="text-slate-800 leading-relaxed">{h.text}</p>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>
            )}

            {/* 6. Offices — HRT's directory. */}
            <section className="px-6 py-16 md:py-20 border-t border-slate-200" aria-labelledby="offices-heading">
                <div className="max-w-5xl mx-auto">
                    <SectionTitle id="offices-heading">{t('offices_title')}</SectionTitle>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {OFFICES.map((o) => (
                            <li key={o.city} className="rounded-xl border border-slate-200 p-8">
                                <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-1">{o.city}</h3>
                                <p className="text-sm text-scalejade-700 font-medium mb-4">{o.entity}</p>
                                <address className="not-italic text-slate-700 leading-relaxed">
                                    {o.lines.map((line) => (
                                        <span key={line} className="block">{line}</span>
                                    ))}
                                </address>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-6 text-slate-700">
                        <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-scalejade-700 underline underline-offset-4 hover:text-scalejade-800">
                            {CONTACT_EMAIL}
                        </a>
                    </p>
                </div>
            </section>

            {/* 7. Research — only once there is research to read. */}
            {papers.length > 0 && (
            <section className="px-6 py-16 md:py-20 bg-surface border-t border-slate-200" aria-labelledby="research-heading">
                <div className="max-w-5xl mx-auto grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-16">
                    <h2 id="research-heading" className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
                        {t('research_title')}
                    </h2>
                    <div>
                        <p className="text-lg text-slate-700 leading-relaxed max-w-[58ch] mb-6">{t('research_text')}</p>
                        <Link
                            href={`${prefix}/research`}
                            className="inline-flex items-center gap-2 font-medium text-scalejade-700 hover:text-scalejade-800"
                        >
                            {t('research_cta')}
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </section>
            )}

            {/* 8. Close — contact first, careers second (HRT ends on "Join us"). */}
            <section className="px-6 py-16 md:py-20 border-t border-slate-200">
                <div className="max-w-5xl mx-auto grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-2xl bg-[var(--color-ink-900,#0f1a13)] p-10">
                        <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-8">
                            {t('contact_title')}
                        </h2>
                        <Link
                            href={`${prefix}/contact`}
                            className="inline-flex items-center gap-2 bg-white text-ink-900 font-medium px-6 py-3.5 rounded-[3px] hover:bg-scalejade-50 transition-colors"
                        >
                            {t('contact_cta')}
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-10">
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight mb-4">
                            {t('careers_title')}
                        </h2>
                        <p className="text-slate-700 leading-relaxed mb-6">{t('careers_text')}</p>
                        <Link
                            href={`${prefix}/contact`}
                            className="inline-flex items-center gap-2 font-medium text-scalejade-700 hover:text-scalejade-800"
                        >
                            {t('careers_cta')}
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 9. Legal entities — Jane Street's per-entity disclosure, shown on
                the page the way Monzo shows its FCA register number. */}
            <section className="px-6 py-12 border-t border-slate-200" aria-labelledby="legal-heading">
                <div className="max-w-5xl mx-auto">
                    <h2 id="legal-heading" className="text-sm font-semibold text-slate-900 mb-2">
                        {t('legal_title')}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{t('legal_text')}</p>
                    <ul className="space-y-1 text-sm text-slate-600">
                        {registrations.map((r) => (
                            <li key={r.entity}>
                                <span className="font-medium text-slate-800">{r.entity}</span> — {r.place}
                                {!isDraft(r.reg) && <>, {r.reg}</>}.
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
}
