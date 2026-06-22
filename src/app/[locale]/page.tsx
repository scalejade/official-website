import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import * as motion from "framer-motion/client";
import { ArrowRight, Code2, Cpu, ShieldCheck, CloudCog, BarChart3 } from 'lucide-react';
import { Metadata } from 'next';

import { TrustSection } from '@/components/TrustSection';

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
        ? 'ScaleJade | Firma AI, Blockchain & Rekayasa Perangkat Lunak #1 di Asia Tenggara'
        : 'ScaleJade | #1 AI, Blockchain & Software Engineering Firm in Southeast Asia';
    const description = isId
        ? 'ScaleJade adalah firma AI #1, firma blockchain #1, dan layanan rekayasa perangkat lunak #1 di Asia Tenggara, serta mitra tepercaya untuk komputasi awan — membangun sistem AI, jaringan blockchain, perangkat lunak khusus, analitik data, dan infrastruktur cloud yang andal. Dibangun untuk berkinerja, dibangun untuk bertahan.'
        : "ScaleJade is Southeast Asia's #1 AI firm, #1 blockchain firm, and #1 software engineering service, and a trusted partner for cloud computing — building reliable AI systems, blockchain networks, custom software, data analytics, and cloud infrastructure. Built to perform, built to last.";

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

export default function HomePage() {
    const t = useTranslations('Hero');
    const c = useTranslations('Capabilities');
    const locale = useLocale();

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
            {/* Structured Data - JSON-LD for Organization */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "ScaleJade",
                        "url": locale === 'en' ? "https://scalejade.com/en" : "https://scalejade.com/id",
                        "logo": "https://scalejade.com/scalejade-green-withtext.svg",
                        "sameAs": [
                            "https://x.com/ScaleJade",
                            "https://www.linkedin.com/company/scalejade"
                        ],
                        "description": "ScaleJade is a technology firm helping enterprises build reliable software, AI systems, blockchain networks, and cloud infrastructure — built to perform, built to last.",
                        "foundingDate": "2024",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Global"
                        },
                        "hasOfferCatalog": {
                            "@type": "OfferCatalog",
                            "name": "Core Services",
                            "itemListElement": [
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Software Engineering",
                                        "description": "Custom software tailored to enterprise workflows, built to scale"
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Artificial Intelligence",
                                        "description": "AI systems and intelligent data pipelines for measurable business advantage"
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Blockchain & Distributed Ledger",
                                        "description": "Transparent, auditable ledger infrastructure for institutional record integrity"
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Cloud Infrastructure",
                                        "description": "Secure, compliant cloud environments with zero-downtime architecture"
                                    }
                                }
                            ]
                        }
                    })
                }}
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-scalejade-800/20 bg-surface text-scalejade-800 text-sm font-medium tracking-wide"
                >
                    <span className="w-2 h-2 rounded-full bg-scalejade-600 animate-pulse" />
                    {t('badge')}
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl"
                >
                    {t('title')}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-6 text-lg md:text-xl text-slate-500 max-w-2xl font-light tracking-wide leading-relaxed"
                >
                    {t('subtitle')}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-10 flex flex-col sm:flex-row gap-4"
                >
                    <Link
                        href={`/${locale}/services`}
                        className="bg-scalejade-600 hover:bg-scalejade-800 text-white px-8 py-4 rounded-md font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        {t('cta_primary')}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        href={`/${locale}/demo`}
                        className="bg-surface hover:bg-slate-100 text-slate-900 border border-slate-200 px-8 py-4 rounded-md font-medium transition-all flex items-center justify-center"
                    >
                        {t('cta_secondary')}
                    </Link>
                </motion.div>
            </section>

            <TrustSection />
            {/* Services — Five Services */}
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
                                        href={`/${locale}/services/${item.slug}`}
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
                                            href={`/${locale}/services/${item.slug}`}
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
        </main>
    );
}