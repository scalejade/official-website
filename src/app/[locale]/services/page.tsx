import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Cpu, ShieldCheck, CloudCog, ChevronRight, Code2, ArrowRight, BarChart3 } from 'lucide-react';
import * as motion from "framer-motion/client";
import { Metadata } from 'next';

const BASE = 'https://scalejade.com';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const isId = locale === 'id';
    const canonical = `${BASE}/${locale}/services`;

    const title = isId
        ? 'Layanan Kami | ScaleJade'
        : 'Our Services | ScaleJade';
    const description = isId
        ? 'Lima layanan teknologi enterprise: Rekayasa Perangkat Lunak, Kecerdasan Buatan, Analitik Data, Infrastruktur Cloud, dan Blockchain & Buku Besar Terdistribusi.'
        : 'Five enterprise technology services: Software Engineering, Artificial Intelligence, Data Analytics, Cloud Infrastructure, and Blockchain & Distributed Ledger.';

    return {
        metadataBase: new URL(BASE),
        title,
        description,
        alternates: {
            canonical,
            languages: {
                'en': `${BASE}/en/services`,
                'id': `${BASE}/id/services`,
                'x-default': `${BASE}/en/services`,
            },
        },
        openGraph: {
            type: 'website',
            url: canonical,
            title,
            description,
            siteName: 'ScaleJade',
            locale: isId ? 'id_ID' : 'en_US',
            images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: 'ScaleJade Services' }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [`${BASE}/opengraph-image`],
        },
    };
}

export default function ServicesPage() {
    const t = useTranslations('ServiceDetails');
    const a = useTranslations('ServiceApproach');
    const locale = useLocale();

    const flagship = [
        {
            id: 'software',
            icon: Code2,
            title: 'Software Engineering',
            oneLine: 'Custom software, engineered to scale and built to last.',
            desc: 'We build software the way your organization actually works — thoughtfully designed, thoroughly tested, and built to grow with you. Long-term partners, not short-term vendors.',
            slug: 'software-engineering',
        },
        {
            id: 'ai',
            icon: Cpu,
            title: 'Artificial Intelligence',
            oneLine: 'AI grounded in engineering, not trend-chasing.',
            desc: 'From LLM-powered assistants to production MLOps, we deploy AI that gives your organization a clear, measurable advantage. We also run a dedicated human-data practice with deep Southeast Asian language coverage.',
            slug: 'artificial-intelligence',
        },
        {
            id: 'data',
            icon: BarChart3,
            title: 'Data Analytics',
            oneLine: 'Turning fragmented data into a foundation you can build on.',
            desc: 'We transform raw, scattered data into something your organization can rely on — governed, accurate, and ready for both decisions and AI. From pipelines to predictive models.',
            slug: 'data-analytics',
        },
    ];

    const supporting = [
        {
            id: 'cloud',
            icon: CloudCog,
            title: 'Cloud Infrastructure',
            oneLine: 'Secure, compliant cloud for systems that can\'t go down.',
            desc: 'We design and operate cloud environments built for regulated industries — with the architecture, governance, and reliability your team cant afford to compromise.',
            slug: 'cloud-infrastructure',
        },
        {
            id: 'blockchain',
            icon: ShieldCheck,
            title: 'Blockchain & Distributed Ledger',
            oneLine: 'Auditable ledger infrastructure for absolute record integrity.',
            desc: 'Permissioned ledger networks for institutions where every record matters — settlement, compliance, and supply-chain traceability built to hold up under the highest scrutiny.',
            slug: 'blockchain',
        },
    ];

    const pillars = [
        {
            title: 'Engineering Depth',
            body: 'Our teams are practitioners, not generalists. Every engagement is led by engineers who have built production systems at scale — and carry that accountability into your project.',
        },
        {
            title: 'Domain Context',
            body: 'We operate at the intersection of technology and regulated industry. We understand compliance constraints, data governance requirements, and the operational realities your teams live with daily.',
        },
        {
            title: 'Built to Last',
            body: 'We design for the conditions that actually matter — not the average day, but the critical one. Systems we ship are built to hold up under real-world load, evolving requirements, and regulatory scrutiny.',
        },
    ];

    return (
        <div className="min-h-screen bg-canvas" role="main">

            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ServicesPage",
                        "name": "ScaleJade Services",
                        "description": "Enterprise software engineering, AI systems, data analytics, blockchain networks, and cloud infrastructure.",
                        "mainEntity": {
                            "@type": "ItemList",
                            "name": "Our Services",
                            "itemListElement": [
                                { "@type": "ListItem", "position": 1, "name": "Software Engineering" },
                                { "@type": "ListItem", "position": 2, "name": "Artificial Intelligence" },
                                { "@type": "ListItem", "position": 3, "name": "Data Analytics" },
                                { "@type": "ListItem", "position": 4, "name": "Cloud Infrastructure" },
                                { "@type": "ListItem", "position": 5, "name": "Blockchain & Distributed Ledger" },
                            ],
                        },
                    })
                }}
            />

            {/* ── 1. Header ── */}
            <div className="pt-24 pb-12 md:pb-20 px-4 sm:px-6 border-b border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <span className="text-scalejade-600 font-semibold tracking-widest uppercase text-xs mb-4 block">
                            {t('header_badge')}
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-5">
                            Five services.<br />One standard.
                        </h1>
                        <p className="text-base md:text-lg text-slate-500 font-light leading-relaxed">
                            We cover the full technology stack your enterprise needs — from the software your teams rely on every day to the infrastructure that keeps it running when it matters most.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* ── 2. Flagship Services ── */}
            <section className="pt-12 md:pt-20 pb-6 md:pb-8 px-4 sm:px-6" aria-labelledby="flagship-heading">
                <div className="max-w-7xl mx-auto">
                    <span className="text-scalejade-600 font-bold tracking-widest uppercase text-xs mb-6 md:mb-10 block">Flagship Services</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        {flagship.map((service, idx) => {
                            const Icon = service.icon;
                            return (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.08 }}
                                    className="group flex flex-col gap-4 md:gap-5 p-6 md:p-8 border border-slate-200 rounded-2xl bg-white hover:shadow-xl hover:shadow-scalejade-900/5 hover:border-scalejade-600/20 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-scalejade-900 text-white rounded-xl group-hover:bg-scalejade-600 transition-colors shrink-0">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                                            {service.title}
                                        </h2>
                                    </div>
                                    <p className="text-scalejade-700 text-sm font-semibold leading-snug">
                                        {service.oneLine}
                                    </p>
                                    <p className="text-slate-500 leading-relaxed text-sm flex-1 font-light">
                                        {service.desc}
                                    </p>
                                    <Link
                                        href={`/${locale}/services/${service.slug}`}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-scalejade-800 hover:text-scalejade-600 transition-colors mt-auto"
                                    >
                                        Explore {service.title} <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 3. Supporting Capabilities ── */}
            <section className="pt-6 md:pt-8 pb-12 md:pb-20 px-4 sm:px-6" aria-labelledby="supporting-heading">
                <div className="max-w-7xl mx-auto">
                    <span className="text-slate-400 font-bold tracking-widest uppercase text-xs mb-6 md:mb-10 block">Supporting Capabilities</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        {supporting.map((service, idx) => {
                            const Icon = service.icon;
                            return (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (idx + 3) * 0.08 }}
                                    className="group flex items-start gap-4 md:gap-6 p-5 md:p-7 border border-slate-200 rounded-2xl bg-white hover:shadow-lg hover:shadow-scalejade-900/5 hover:border-scalejade-600/20 transition-all"
                                >
                                    <div className="p-3 bg-slate-100 text-slate-600 rounded-xl group-hover:bg-scalejade-900 group-hover:text-white transition-colors shrink-0 mt-0.5">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0 gap-3">
                                        <h2 className="text-base font-bold text-slate-900 tracking-tight">
                                            {service.title}
                                        </h2>
                                        <p className="text-scalejade-700 text-xs font-semibold">
                                            {service.oneLine}
                                        </p>
                                        <p className="text-slate-500 leading-relaxed text-sm font-light">
                                            {service.desc}
                                        </p>
                                        <Link
                                            href={`/${locale}/services/${service.slug}`}
                                            className="flex items-center gap-1.5 text-xs font-semibold text-scalejade-800 hover:text-scalejade-600 transition-colors"
                                        >
                                            Explore {service.title} <ChevronRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 4. Our Competitive Edge ── */}
            <section className="bg-scalejade-900 py-16 md:py-28 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-white font-bold tracking-widest uppercase text-xs mb-6 block">
                            {a('advantage_label')}
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight whitespace-pre-line max-w-2xl">
                            {a('advantage_title')}
                        </h2>
                    </motion.div>

                    <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-px bg-scalejade-800/40 rounded-2xl overflow-hidden border border-scalejade-800/40">
                        {pillars.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-scalejade-900 p-7 md:p-10 flex flex-col gap-4 md:gap-5"
                            >
                                <h3 className="text-white font-bold text-xl tracking-tight">{item.title}</h3>
                                <p className="text-white/70 leading-relaxed text-sm">{item.body}</p>
                                <ArrowRight className="w-4 h-4 text-white/30 mt-auto" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 5. Our Method ── */}
            <section className="bg-white border-t border-slate-100 py-14 md:py-24 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-[220px_1fr] gap-6 md:gap-10 items-start bg-slate-50 rounded-2xl md:rounded-3xl px-6 py-10 md:px-16 md:py-16 border border-slate-100"
                    >
                        <div>
                            <span className="text-scalejade-600 font-bold tracking-widest uppercase text-xs">
                                {a('label')}
                            </span>
                        </div>
                        <p className="text-xl md:text-2xl lg:text-3xl text-slate-800 font-medium leading-snug tracking-tight">
                            {a('body')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── 6. From the Field ── */}
            <section className="bg-white border-t border-slate-100 py-14 md:py-24 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="md:sticky md:top-32"
                    >
                        <span className="text-scalejade-600 font-bold tracking-widest uppercase text-xs mb-4 block">
                            {a('story_label')}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                            {a('story_title')}
                        </h2>
                        <p className="text-lg text-slate-700 font-medium leading-relaxed border-l-4 border-scalejade-600 pl-5">
                            {a('story_intro')}
                        </p>
                        <div className="mt-10 flex items-center gap-3">
                            <div className="w-8 h-px bg-scalejade-900" />
                            <span className="text-xs text-slate-400 tracking-widest uppercase">ScaleJade Engineering</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6 text-slate-600 leading-relaxed text-[17px]"
                    >
                        <p>{a('story_p1')}</p>
                        <p>{a('story_p2')}</p>
                        <p className="font-medium text-slate-800">{a('story_p3')}</p>
                    </motion.div>
                </div>
            </section>

        </div>
    );
}
