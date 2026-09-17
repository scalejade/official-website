import { useTranslations } from 'next-intl';
import * as motion from "framer-motion/client";
import { ArrowUpRight } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

const BASE = 'https://scalejade.com';
import { localizedUrl, localeAlternates } from '@/lib/locale-url';

/* HIDDEN with the team section below — restore both together.

const TEAM = [
  {
    initials: 'AP',
    name: 'A. Pradana',
    role: 'Principal Engineer, AI & Evaluation',
    history: 'Built evaluation infrastructure and LLM benchmarking pipelines for regulated institutions. Leads the firm\'s applied AI research practice.',
    prior: 'Previously at [prior employer]',
    papers: ['tutorbench'],
    linkedin: '#',
  },
  {
    initials: 'MW',
    name: 'M. Wibowo',
    role: 'Senior Engineer, Distributed Systems',
    history: 'Designed and operated consensus and replication layers for financial settlement systems. Leads the firm\'s blockchain infrastructure work.',
    prior: 'Previously at [prior employer]',
    papers: ['tutorbench'],
    linkedin: '#',
  },
  {
    initials: 'ST',
    name: 'S. Tan',
    role: 'Engineer, AI & Data',
    history: 'Built data annotation pipelines and evaluation rubrics for Southeast Asian language models. Leads data practice for education-sector engagements.',
    prior: 'Previously at [prior employer]',
    papers: ['tutorbench'],
    linkedin: '#',
  },
  {
    initials: 'RH',
    name: 'R. Halim',
    role: 'Principal Engineer, Blockchain & Security',
    history: 'Architected verifiable settlement protocols and cryptographic proof systems for permissioned ledger networks. Leads the firm\'s financial infrastructure practice.',
    prior: 'Previously at [prior employer]',
    papers: ['ledgerproof'],
    linkedin: '#',
  },
  {
    initials: 'DP',
    name: 'D. Putri',
    role: 'Senior Engineer, Distributed Systems',
    history: 'Built BFT consensus implementations and proof-aggregation schemes for regulated financial networks. Leads deployment for the firm\'s blockchain engagements.',
    prior: 'Previously at [prior employer]',
    papers: ['ledgerproof'],
    linkedin: '#',
  },
];

const PAPER_LINKS: Record<string, string> = {
  tutorbench: '/research/tutorbench',
  ledgerproof: '/research/ledgerproof',
};
*/

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
        ? 'Insinyur di Singapura dan Jakarta. Kami membangun dan menjalankan perangkat lunak untuk institusi tempat kegagalan adalah peristiwa yang wajib dilaporkan. Tanpa manajer akun, tanpa lapisan pengiriman, tanpa bangku cadangan.'
        : 'Engineers in Singapore and Jakarta. We build and run software for institutions where a failure is a reportable event. No account managers, no delivery layer, no bench.';

    return {
        metadataBase: new URL(BASE),
        title,
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

export default function AboutPage() {
    const t = useTranslations('About');

    const facts = [
        { label: t('fact_founded'), value: t('fact_founded_value') },
        { label: t('fact_team'), value: t('fact_team_value') },
        { label: t('fact_entities'), value: t('fact_entities_value') },
        { label: t('fact_clients'), value: t('fact_clients_value') },
        { label: t('fact_certifications'), value: t('fact_certifications_value') },
        { label: t('fact_data_residency'), value: t('fact_data_residency_value') },
        { label: t('fact_languages'), value: t('fact_languages_value') },
    ];

    return (
        <div className="min-h-screen bg-canvas pt-24 pb-32" role="main">

            {/* Structured Data - JSON-LD for About Page */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "AboutPage",
                        "name": "About ScaleJade",
                        "description": "ScaleJade is a technology firm building and running software for regulated institutions. Engineers in Singapore and Jakarta.",
                    })
                }}
            />

            {/* 1. Header */}
            <section className="px-6 max-w-4xl mx-auto text-center mb-32" aria-labelledby="about-heading">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-scalejade-800/20 bg-surface text-scalejade-800 text-sm font-medium tracking-wide uppercase"
                >
                    {t('intro_badge')}
                </motion.div>

                {/* HIDDEN — `intro_title` is still the "[N] engineers in Singapore
                    and Jakarta." placeholder. The visible headline is hidden until
                    the real headcount is confirmed; restore the block below and
                    delete the sr-only <h1> to bring it back.

                <motion.h1
                    id="about-heading"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-8"
                >
                    {t('intro_title')}
                </motion.h1>
                */}

                {/* Keeps the page's single <h1> and the section's aria-labelledby
                    target intact while the headline above is hidden. */}
                <h1 id="about-heading" className="sr-only">
                    {t('intro_badge')}
                </h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-2xl text-slate-500 font-light leading-relaxed max-w-2xl mx-auto"
                >
                    {t('intro_text')}
                </motion.p>
            </section>

            {/* 2. Founding Story */}
            <section className="px-6 max-w-7xl mx-auto mb-32" aria-labelledby="founding-heading">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-scalejade-900 rounded-3xl p-12 md:p-20 relative overflow-hidden"
                >
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />

                    <div className="relative z-10 max-w-3xl">
                        <h2 id="founding-heading" className="text-scalejade-400 font-semibold tracking-widest uppercase text-sm mb-6">
                            {t('founding_title')}
                        </h2>
                        <p className="text-2xl md:text-3xl text-white font-medium leading-relaxed">
                            {t('founding_text')}
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* HIDDEN — the team section. `team_title` / `team_intro` are still
                placeholder copy and TEAM below is placeholder people. Restore this
                block, and the TEAM / PAPER_LINKS constants at the top of the file,
                once the real team is ready to publish.

            3. The Team
            <section className="px-6 max-w-6xl mx-auto mb-32" aria-labelledby="team-heading">
                <div className="text-center mb-16">
                    <h2 id="team-heading" className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">
                        {t('team_title')}
                    </h2>
                    <p className="text-lg text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
                        {t('team_intro')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {TEAM.map((person, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.08 }}
                            className="group"
                        >
                            <div className="aspect-square bg-surface border border-slate-200 rounded-2xl flex items-center justify-center mb-5 overflow-hidden">
                                <span className="text-5xl font-bold text-scalejade-800/25 select-none">
                                    {person.initials}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                                {person.name}
                            </h3>
                            <p className="text-sm text-scalejade-600 font-medium mb-3">
                                {person.role}
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed mb-2">
                                {person.history}
                            </p>
                            <p className="text-xs text-slate-400 mb-3">
                                {person.prior}
                            </p>
                            <div className="flex items-center gap-4 text-xs">
                                <a
                                    href={person.linkedin}
                                    className="text-scalejade-600 hover:text-scalejade-800 font-medium transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    LinkedIn
                                </a>
                                {person.papers.map((slug) => (
                                    <Link
                                        key={slug}
                                        href={PAPER_LINKS[slug] || '#'}
                                        className="text-scalejade-600 hover:text-scalejade-800 font-medium transition-colors inline-flex items-center gap-1"
                                    >
                                        Paper <ArrowUpRight className="w-3 h-3" />
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            */}

            {/* 4. How We Work */}
            <section className="px-6 max-w-6xl mx-auto mb-32" aria-labelledby="how-we-work-heading">
                <div className="text-center mb-16">
                    <h2 id="how-we-work-heading" className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        {t('how_we_work_title')}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-surface border border-slate-200 p-10 rounded-2xl"
                    >
                        <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">
                            {t('engagement_title')}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                            {t('engagement_text')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-surface border border-slate-200 p-10 rounded-2xl"
                    >
                        <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">
                            {t('composition_title')}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                            {t('composition_text')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                        className="bg-surface border border-slate-200 p-10 rounded-2xl"
                    >
                        <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">
                            {t('ownership_title')}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                            {t('ownership_text')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-surface border border-slate-200 p-10 rounded-2xl"
                    >
                        <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">
                            {t('start_title')}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                            {t('start_text')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 5. Evidence (replacing values) */}
            <section className="px-6 max-w-6xl mx-auto mb-32" aria-labelledby="evidence-heading">
                <div className="text-center mb-16">
                    <h2 id="evidence-heading" className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        {t('evidence_title')}
                    </h2>
                </div>

                <div className="space-y-1">
                    {[
                        { label: t('evidence_1_label'), text: t('evidence_1_text') },
                        { label: t('evidence_2_label'), text: t('evidence_2_text') },
                        { label: t('evidence_3_label'), text: t('evidence_3_text') },
                        { label: t('evidence_4_label'), text: t('evidence_4_text') },
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.08 }}
                            className="flex flex-col md:flex-row gap-4 md:gap-8 py-6 border-b border-slate-200 last:border-b-0"
                        >
                            <span className="text-sm font-bold text-scalejade-600 tracking-widest uppercase shrink-0 md:w-48">
                                {item.label}
                            </span>
                            <p className="text-slate-600 leading-relaxed">
                                {item.text}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 6. The Facts */}
            <section className="px-6 max-w-4xl mx-auto mb-32" aria-labelledby="facts-heading">
                <h2 id="facts-heading" className="text-sm font-bold text-scalejade-600 tracking-widest uppercase mb-10 text-center">
                    {t('facts_title')}
                </h2>

                <div className="font-mono text-sm">
                    {facts.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 6 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex flex-col md:flex-row gap-2 md:gap-8 py-4 border-t border-slate-200"
                        >
                            <span className="text-xs font-medium text-slate-400 tracking-widest uppercase shrink-0 md:w-44">
                                {item.label}
                            </span>
                            <span className="text-slate-700">
                                {item.value}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 7. Research */}
            <section className="px-6 max-w-4xl mx-auto mb-32 text-center" aria-labelledby="research-heading">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-surface border border-slate-200 rounded-3xl p-12 md:p-16"
                >
                    <h2 id="research-heading" className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                        {t('research_title')}
                    </h2>
                    <p className="text-slate-600 leading-relaxed max-w-xl mx-auto mb-8">
                        {t('research_text')}
                    </p>
                    <Link
                        href="/research"
                        className="inline-flex items-center gap-2 text-scalejade-600 font-semibold hover:text-scalejade-800 transition-colors"
                    >
                        {t('research_cta')} <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </section>

            {/* 8. Careers / CTA */}
            <section className="px-6 max-w-4xl mx-auto text-center" aria-labelledby="careers-heading">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 id="careers-heading" className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                        {t('careers_title')}
                    </h2>
                    <p className="text-slate-500 leading-relaxed max-w-xl mx-auto mb-8">
                        {t('careers_text')}
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-scalejade-600 text-white font-semibold rounded-xl hover:bg-scalejade-700 transition-colors"
                    >
                        {t('careers_cta')} <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </section>

        </div>
    );
}
