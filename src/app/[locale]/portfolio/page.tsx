import { useTranslations } from 'next-intl';
import Image from 'next/image';
import * as motion from "framer-motion/client";
import portfolioData from '@/data/portfolio.json';
import { ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { Metadata } from 'next';

const BASE = 'https://scalejade.com';
import { localizedUrl, localeAlternates } from '@/lib/locale-url';

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
        ? 'Pilihan proyek yang telah kami kerjakan untuk klien di berbagai industri — dari platform keuangan hingga sistem AI dan jaringan blockchain.'
        : 'A selection of work we have delivered for clients across industries — from financial platforms to AI-powered systems and blockchain networks.';

    return {
        metadataBase: new URL(BASE),
        title,
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

export default function PortfolioPage() {
    const t = useTranslations('Portfolio');

    return (
        <div className="min-h-screen bg-canvas pt-24 pb-32" role="main">

            {/* Structured Data - JSON-LD for Portfolio */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemPage",
                        "name": "ScaleJade Portfolio",
                        "description": "A selection of projects we've completed for clients across industries",
                        "mainContentOfPage": {
                            "@type": "ItemList",
                            "name": "Featured Projects",
                            "numberOfItems": portfolioData.length,
                            "itemListElement": portfolioData.map((project, idx) => ({
                                "@type": "ListItem",
                                "position": idx + 1,
                                "name": project.title,
                                "description": project.description,
                                "url": `https://scalejade.com/portfolio/#${project.id}`
                            }))
                        }
                    })
                }}
            />

            {/* 1. Header Section */}
            <section className="px-6 max-w-4xl mx-auto text-center mb-32" aria-labelledby="portfolio-heading">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-scalejade-800/20 bg-surface text-scalejade-800 text-sm font-medium tracking-wide uppercase"
                >
                    {t('badge')}
                </motion.div>

                <motion.h1
                    id="portfolio-heading"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-8"
                >
                    {t('title')}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-2xl text-slate-500 font-light leading-relaxed"
                >
                    {t('subtitle')}
                </motion.p>
            </section>

            {/* 2. Portfolio Grid (Data Driven) */}
            <section className="px-6 max-w-7xl mx-auto flex flex-col gap-32" aria-label="Featured Projects">
                {portfolioData.map((project, idx) => {
                    // Determine if image should be on the left or right based on odd/even index
                    const isEven = idx % 2 === 0;

                    return (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7 }}
                            className={`flex flex-col gap-12 lg:gap-20 items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                        >

                            {/* Image Container */}
                            <div className="w-full lg:w-1/2 relative group">
                                <div className="absolute inset-0 bg-scalejade-900/5 translate-x-4 translate-y-4 rounded-3xl -z-10 transition-transform group-hover:translate-x-6 group-hover:translate-y-6" />
                                <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden border border-slate-200 bg-surface shadow-sm">
                                    <Image
                                        src={project.image_url}
                                        alt={`Architecture for ${project.title}`}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale hover:grayscale-0"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                    {/* Subtle Overlay Overlay */}
                                    <div className="absolute inset-0 ring-1 ring-inset ring-slate-900/10 rounded-3xl pointer-events-none" />
                                </div>
                            </div>

                            {/* Content Container */}
                            <div className="w-full lg:w-1/2 flex flex-col">
                                <div className="flex items-center gap-2 mb-4 text-scalejade-600">
                                    <ShieldCheck className="w-5 h-5" />
                                    <span className="text-sm font-bold tracking-widest uppercase">
                                        {project.client_classification}
                                    </span>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">
                                    {project.title}
                                </h2>

                                <p className="text-slate-600 text-lg leading-relaxed mb-10">
                                    {project.description}
                                </p>

                                {/* Metrics & Tech Stack Grid */}
                                <div className="grid grid-cols-2 gap-8 border-y border-slate-200 py-8 mb-10">
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                                            <Activity className="w-4 h-4" /> {t('metrics_header')}
                                        </h3>
                                        <ul className="space-y-3">
                                            {project.metrics.map((metric, mIdx) => (
                                                <li key={mIdx} className="text-sm font-medium text-slate-800 flex items-start gap-2">
                                                    <span className="text-scalejade-600 mt-0.5">▪</span> {metric}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-4">
                                            {t('tech_header')}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {project.tech_stack.map((tech, tIdx) => (
                                                <span key={tIdx} className="px-3 py-1 bg-surface border border-slate-200 rounded-md text-xs font-semibold text-slate-600">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </motion.div>
                    );
                })}
            </section>

        </div>
    );
}