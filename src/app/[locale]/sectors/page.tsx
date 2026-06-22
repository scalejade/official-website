import { useTranslations } from 'next-intl';
import { Landmark, GraduationCap, Zap, Package, Heart, Pickaxe, Factory } from 'lucide-react';
import * as motion from "framer-motion/client";
import Link from 'next/link';
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
    const canonical = localizedUrl(locale, '/sectors');

    const title = isId ? 'Industri yang Kami Layani | ScaleJade' : 'Industries We Serve | ScaleJade';
    const description = isId
        ? 'ScaleJade melayani institusi keuangan, energi & sumber daya, layanan kesehatan, pendidikan, manufaktur, pertambangan, dan grosir & distribusi di seluruh Asia Tenggara.'
        : 'ScaleJade serves financial institutions, energy & resources, healthcare, education, manufacturing, mining, and wholesale & distribution across Southeast Asia and beyond.';

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
            images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: 'Industries ScaleJade Serves' }],
        },
        twitter: { card: 'summary_large_image', title, description, images: [`${BASE}/opengraph-image`] },
    };
}

export default function SectorsPage() {
    const t = useTranslations('SectorDetails');
    const s = useTranslations('Sectors');

    const sectors = [
        { id: 'finance', title: s('finance'), desc: t('finance_desc'), icon: Landmark },
        { id: 'education', title: s('education'), desc: t('education_desc'), icon: GraduationCap },
        { id: 'energy', title: s('energy'), desc: t('energy_desc'), icon: Zap },
        { id: 'wholesale', title: s('wholesale'), desc: t('wholesale_desc'), icon: Package },
        { id: 'healthcare', title: s('healthcare'), desc: t('healthcare_desc'), icon: Heart },
        { id: 'mining', title: s('mining'), desc: t('mining_desc'), icon: Pickaxe },
        { id: 'manufacturing', title: s('manufacturing'), desc: t('manufacturing_desc'), icon: Factory },
    ];

    return (
        <div className="min-h-screen bg-canvas py-24 px-6 border-t border-slate-100" role="main">
            <div className="max-w-7xl mx-auto">

                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "CollectionPage",
                            "name": "Industries We Serve",
                            "description": "ScaleJade builds the technological foundations that power the world's most important industries.",
                            "mainContentOfPage": {
                                "@type": "ItemList",
                                "itemListElement": [
                                    { "@type": "ListItem", "position": 1, "name": "Financial Institutions", "description": "Core infrastructure and digital payment reliability for banks and payment providers." },
                                    { "@type": "ListItem", "position": 2, "name": "Education", "description": "Digital transformation and modernizing learning platforms for academic institutions." },
                                    { "@type": "ListItem", "position": 3, "name": "Energy & Supply Chain", "description": "Operational visibility and efficiency for energy companies and logistics operators." },
                                    { "@type": "ListItem", "position": 4, "name": "Wholesale & Distribution", "description": "Optimizing distribution networks and commerce at scale for wholesale operators." },
                                    { "@type": "ListItem", "position": 5, "name": "Healthcare", "description": "Secure data management and clinical excellence for healthcare providers." },
                                    { "@type": "ListItem", "position": 6, "name": "Mining & Resources", "description": "Operational systems for site management, safety compliance, and resource tracking." },
                                    { "@type": "ListItem", "position": 7, "name": "Manufacturing", "description": "Integrated systems connecting the factory floor to the supply chain at scale." }
                                ]
                            }
                        })
                    }}
                />

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <span className="text-scalejade-600 font-semibold tracking-wide uppercase text-sm mb-4 block">
                        {t('header_badge')}
                    </span>
                    <h1 id="sectors-heading" className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                        {t('header_title')}
                    </h1>
                    <p className="text-lg text-slate-500 font-light leading-relaxed">
                        {t('header_sub')}
                    </p>
                </motion.div>

                {/* Sector Grid */}
                <section aria-labelledby="sectors-heading">
                    <h2 className="sr-only">Industries We Serve</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sectors.map((sector, idx) => {
                            const Icon = sector.icon;
                            const isLast = idx === sectors.length - 1;
                            return (
                                <motion.div
                                    key={sector.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.08 }}
                                    className={`flex flex-col p-8 border border-slate-200 rounded-2xl bg-white hover:shadow-xl hover:shadow-scalejade-900/5 transition-all group${isLast && sectors.length % 2 !== 0 ? ' md:col-span-2 md:max-w-[calc(50%-12px)] md:mx-auto' : ''}`}
                                >
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className="p-3 bg-scalejade-900 text-white rounded-xl group-hover:bg-scalejade-600 transition-colors shrink-0">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                                            {sector.title}
                                        </h3>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed text-sm">
                                        {sector.desc}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-24 text-center max-w-2xl mx-auto"
                >
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                        {t('cta_title')}
                    </h2>
                    <p className="text-slate-500 font-light leading-relaxed mb-8">
                        {t('cta_sub')}
                    </p>
                    <Link
                        href="/demo"
                        className="inline-block bg-scalejade-900 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-scalejade-600 transition-colors"
                    >
                        {t('cta_button')}
                    </Link>
                </motion.div>

            </div>
        </div>
    );
}
