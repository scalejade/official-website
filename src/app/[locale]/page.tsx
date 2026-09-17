import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import * as motion from "framer-motion/client";
import { ArrowRight, Code2, Cpu, ShieldCheck, CloudCog, BarChart3 } from 'lucide-react';
import { Metadata } from 'next';

import { TrustSection } from '@/components/TrustSection';
import { CORE_SECTORS } from '@/data/sectors';
import { getAllPapers } from '@/data/papers';
import portfolioData from '@/data/portfolio.json';

import { SITE_URL as BASE, localizedUrl, localeAlternates } from '@/lib/locale-url';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const isId = locale === 'id';
    const canonical = localizedUrl(locale, '');

    const title = isId
        ? 'ScaleJade | Rekayasa Perangkat Lunak, AI & Blockchain untuk Industri Teregulasi'
        : 'ScaleJade | Software, AI & Blockchain Engineering for Regulated Industries';
    const description = isId
        ? 'ScaleJade membangun dan mengoperasikan perangkat lunak, sistem AI, jaringan blockchain, platform data, dan infrastruktur cloud untuk bank, universitas, dan institusi publik di Singapura dan Indonesia. Dibangun untuk berkinerja, dibangun untuk bertahan.'
        : 'ScaleJade builds and runs software, AI systems, blockchain networks, data platforms and cloud infrastructure for banks, universities and public institutions in Singapore and Indonesia. Built to perform, built to last.';

    return {
        metadataBase: new URL(BASE),
        title,
        description,
        alternates: localeAlternates(locale, ''),
        openGraph: {
            type: 'website',
            url: canonical,
            title,
            description,
            siteName: 'ScaleJade',
            locale: isId ? 'id_ID' : 'en_US',
            alternateLocale: isId ? 'en_US' : 'id_ID',
            images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: 'ScaleJade — Built to perform, built to last.' }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [`${BASE}/opengraph-image`],
        },
    };
}

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const prefix = locale === 'en' ? '' : `/${locale}`;

    const t = await getTranslations({ locale, namespace: 'Hero' });
    const c = await getTranslations({ locale, namespace: 'Capabilities' });
    const h = await getTranslations({ locale, namespace: 'Home' });
    const sectorNames = await getTranslations({ locale, namespace: 'Sectors' });

    const problems = h.raw('problems.items') as { title: string; body: string }[];

    // One case study, not a portfolio. It is the answer to the fear stated
    // directly above it — that is what makes proof land structurally.
    const highlight = portfolioData[0];

    const papers = (await getAllPapers()).slice(0, 3);

    const flagship = [
        { id: 'software', icon: Code2, title: c('software_title'), desc: c('software_desc'), link: c('software_link'), slug: 'software-engineering' },
        { id: 'ai',       icon: Cpu,   title: c('ai_title'),       desc: c('ai_desc'),       link: c('ai_link'),       slug: 'artificial-intelligence' },
        { id: 'data',     icon: BarChart3, title: c('data_title'), desc: c('data_desc'),     link: c('data_link'),     slug: 'data-analytics' },
    ];

    const supporting = [
        { id: 'cloud',      icon: CloudCog,    title: c('cloud_title'),      desc: c('cloud_desc'),      link: c('cloud_link'),      slug: 'cloud-infrastructure' },
        { id: 'blockchain', icon: ShieldCheck, title: c('blockchain_title'), desc: c('blockchain_desc'), link: c('blockchain_link'), slug: 'blockchain' },
    ];

    return (
        <main className="min-h-screen bg-canvas text-slate-900 selection:bg-scalejade-600 selection:text-white">
            {/* Organization + WebSite JSON-LD lives once, in the locale layout.
                A second Organization block here declared a different url and an
                addressLocality of "Global", which told retrieval systems there
                might be two companies. Entity resolution needs exactly one. */}

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
                {/* The hero is rendered visible in SSR and animated with CSS only.
                    Framer's `initial` prop inlined style="opacity:0" into the server HTML,
                    so the hero was blank without JS and hurt LCP. */}
                <div className="reveal mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-scalejade-800/20 bg-surface text-scalejade-800 text-sm font-medium tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-scalejade-600" />
                    {t('badge')}
                </div>

                <h1 className="reveal reveal-delay-1 text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl">
                    {t('title')}
                </h1>

                <p className="reveal reveal-delay-2 mt-6 text-lg md:text-xl text-slate-700 max-w-2xl font-normal leading-relaxed">
                    {t('subtitle')}
                </p>

                <div className="reveal reveal-delay-3 mt-10 flex flex-col sm:flex-row gap-4">
                    <Link
                        href={`${prefix}/services`}
                        className="bg-scalejade-600 hover:bg-scalejade-800 text-white px-8 py-4 rounded-md font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        {t('cta_primary')}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        href={`${prefix}/contact`}
                        className="bg-surface hover:bg-slate-100 text-slate-900 border border-slate-200 px-8 py-4 rounded-md font-medium transition-all flex items-center justify-center"
                    >
                        {t('cta_secondary')}
                    </Link>
                </div>
            </section>


            {/* 2. Three problems, in the reader's voice. Each heading states the
                reader's situation as fact; each body names the mechanism under
                the obvious symptom; ScaleJade appears last, in one short clause.
                This sits before any proof, per the reference teardown. */}
            <section className="px-6 py-16 md:py-24 border-t border-slate-100">
                <div className="max-w-5xl mx-auto grid grid-cols-1 gap-14 md:gap-20">
                    {problems.map((problem) => (
                        <article key={problem.title} className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-16">
                            {/* An H2, like Zuhlke's. Reading only the H1 and H2s
                                top to bottom should describe the reader's world. */}
                            <h2 className="text-2xl md:text-[28px] font-semibold text-slate-900 tracking-tight leading-[1.15]">
                                {problem.title}
                            </h2>
                            <p className="text-base md:text-lg text-slate-700 leading-relaxed max-w-[62ch]">
                                {problem.body}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            {/* 3. The fear, stated — then evidence produced against it. */}
            <section className="bg-[var(--color-ink-900,#0f1a13)] px-6 py-16 md:py-24" aria-labelledby="proof-heading">
                <div className="max-w-5xl mx-auto">
                    <h2 id="proof-heading" className="text-3xl md:text-5xl font-semibold text-white tracking-tight leading-[1.1] mb-6 max-w-[20ch]">
                        {h('proof.title')}
                    </h2>
                    <p className="text-lg text-scalejade-100/85 leading-relaxed max-w-[62ch] mb-12">
                        {h('proof.body')}
                    </p>

                    <div className="rounded-2xl border border-white/15 p-8 md:p-10">
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-scalejade-400 mb-4">
                            {h('proof.label')}
                        </p>
                        <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-3">
                            {highlight.title}
                        </h3>
                        <p className="text-sm text-scalejade-100/85 leading-relaxed max-w-[70ch] mb-8">
                            {highlight.description}
                        </p>
                        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/15 pt-8">
                            {highlight.metrics.map((metric) => (
                                <div key={metric}>
                                    <dt className="sr-only">{highlight.client_classification}</dt>
                                    <dd className="font-mono text-sm uppercase tracking-[0.08em] text-white">{metric}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <Link
                        href={`${prefix}/portfolio`}
                        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-scalejade-400 hover:text-white transition-colors"
                    >
                        {h('proof.cta')}
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                </div>
            </section>

            {/* 4. Sectors */}
            <section className="px-6 py-16 md:py-24" aria-labelledby="home-sectors-heading">
                <div className="max-w-5xl mx-auto">
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-scalejade-600 mb-5 block">
                        {h('sectors.label')}
                    </span>
                    <h2 id="home-sectors-heading" className="text-3xl md:text-5xl font-semibold text-slate-900 tracking-tight mb-10">
                        {h('sectors.title')}
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {CORE_SECTORS.map((sector) => (
                            <li key={sector.slug}>
                                <Link
                                    href={`${prefix}/sectors/${sector.slug}`}
                                    className="group block border-t border-slate-200 pt-5 transition-colors hover:border-scalejade-600"
                                >
                                    <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-3">
                                        {sectorNames(sector.messageKey)}
                                    </h3>
                                    <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-600 leading-relaxed">
                                        {sector.regulations.slice(0, 3).join(' · ')}
                                    </p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <Link
                        href={`${prefix}/sectors`}
                        className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-scalejade-700 hover:text-scalejade-800"
                    >
                        {h('sectors.cta')}
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                </div>
            </section>

            {/* 5. Services */}
            <section className="py-16 md:py-28 px-4 sm:px-6 border-t border-slate-100" aria-labelledby="capabilities-heading">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-10 md:mb-20"
                    >
                        <span className="text-scalejade-600 font-semibold tracking-widest uppercase text-xs mb-5 block">
                            {c('section_label')}
                        </span>
                        <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-20">
                            <h2 id="capabilities-heading" className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight md:w-1/2 shrink-0">
                                {c('heading')}
                            </h2>
                            <p className="text-base md:text-lg text-slate-500 font-light leading-relaxed md:w-1/2 md:pb-2">
                                {c('subheading')}
                            </p>
                        </div>
                    </motion.div>

                    {/* Flagship — three equal columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
                        {flagship.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.08 }}
                                    className="group p-6 md:p-10 border border-slate-100 rounded-xl bg-surface hover:bg-white hover:border-scalejade-600/20 hover:shadow-sm transition-all flex flex-col"
                                >
                                    <div className="mb-5 p-2.5 bg-white border border-slate-200 shadow-sm rounded-lg inline-block self-start">
                                        <Icon className="w-5 h-5 text-scalejade-700" />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 tracking-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 leading-relaxed mb-6 font-light text-sm flex-1">
                                        {item.desc}
                                    </p>
                                    <Link
                                        href={`${prefix}/services/${item.slug}`}
                                        className="text-sm font-semibold text-scalejade-800 hover:text-scalejade-600 transition-colors"
                                        aria-label={`Learn more about ${item.title}`}
                                    >
                                        {item.link}
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Supporting — two compact cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        {supporting.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: (idx + 3) * 0.08 }}
                                    className="group p-5 md:p-8 border border-slate-100 rounded-xl bg-surface hover:bg-white hover:border-scalejade-600/20 hover:shadow-sm transition-all flex items-start gap-4 md:gap-6"
                                >
                                    <div className="p-2.5 bg-white border border-slate-200 shadow-sm rounded-lg shrink-0 mt-0.5">
                                        <Icon className="w-4 h-4 text-scalejade-700" />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <h3 className="text-base font-bold text-slate-900 mb-2 tracking-tight">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-500 leading-relaxed mb-4 font-light text-sm">
                                            {item.desc}
                                        </p>
                                        <Link
                                            href={`${prefix}/services/${item.slug}`}
                                            className="text-sm font-semibold text-scalejade-800 hover:text-scalejade-600 transition-colors"
                                            aria-label={`Learn more about ${item.title}`}
                                        >
                                            {item.link}
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 6. Research — published, which is what makes it evidence. */}
            <section className="px-6 py-16 md:py-24 bg-surface border-t border-slate-100" aria-labelledby="home-research-heading">
                <div className="max-w-5xl mx-auto">
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-scalejade-600 mb-5 block">
                        {h('research.label')}
                    </span>
                    <h2 id="home-research-heading" className="text-3xl md:text-5xl font-semibold text-slate-900 tracking-tight mb-4 max-w-[24ch]">
                        {h('research.title')}
                    </h2>
                    <p className="text-lg text-slate-700 leading-relaxed max-w-[62ch] mb-10">
                        {h('research.body')}
                    </p>
                    <ul className="divide-y divide-slate-200 border-t border-slate-200">
                        {papers.map((paper) => (
                            <li key={paper.slug}>
                                <Link href={`${prefix}/research/${paper.slug}`} className="group block py-5">
                                    <h3 className="text-base md:text-lg font-semibold text-slate-900 tracking-tight transition-colors group-hover:text-scalejade-700">
                                        {paper.title}
                                    </h3>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <Link
                        href={`${prefix}/research`}
                        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-scalejade-700 hover:text-scalejade-800"
                    >
                        {h('research.cta')}
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                </div>
            </section>

            {/* 7. Clients — after the evidence, not before it. */}
            <TrustSection />

            {/* 8. Close */}
            <section className="px-6 py-20 md:py-28 border-t border-slate-100">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-semibold text-slate-900 tracking-tight mb-4">
                        {h('close.title')}
                    </h2>
                    <p className="text-lg text-slate-700 leading-relaxed mb-8">{h('close.body')}</p>
                    <Link
                        href={`${prefix}/contact`}
                        className="inline-flex items-center gap-2 bg-scalejade-600 text-white font-medium px-8 py-4 rounded-md hover:bg-scalejade-800 transition-colors"
                    >
                        {h('close.cta')}
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                </div>
            </section>
        </main>
    );
}