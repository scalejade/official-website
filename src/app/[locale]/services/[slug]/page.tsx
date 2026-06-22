import { notFound } from 'next/navigation';
import Link from 'next/link';
import * as motion from "framer-motion/client";
import { ArrowRight, ChevronRight, ShieldCheck } from 'lucide-react';
import { Metadata } from 'next';
import { localizedUrl, localeAlternates } from '@/lib/locale-url';

const BASE = 'https://scalejade.com';

type SubService = { title: string; desc: string };

type ServiceData = {
    name: string;
    oneLine: string;
    heroParagraph: string;
    overview: string;
    overviewPull: string;
    subServices: SubService[];
    closingLine: string;
};

const serviceData: Record<string, ServiceData> = {
    "software-engineering": {
        name: "Software Engineering",
        oneLine: "Custom software, engineered to scale and built to last.",
        heroParagraph: "Most software fails not because it was built wrong, but because it was built for the wrong version of the problem. We spend the time upfront to understand how your organization actually works — then we build to that reality.",
        overview: "We build software the way your organization actually works — thoughtfully designed, thoroughly tested, and built to grow with you. Our teams work alongside yours as long-term partners. We carry the same ownership and accountability that your own engineers do, because we think that is the only way to ship software you can depend on for years.",
        overviewPull: "We don't hand off and disappear. We stay until the system is stable, understood, and genuinely yours.",
        subServices: [
            { title: "Custom application development", desc: "Web, mobile, and enterprise applications built around your workflows and your users — not a template that almost fits." },
            { title: "Systems integration & API development", desc: "Your existing tools shouldn't work against each other. We connect them so the data flows cleanly and the seams disappear." },
            { title: "Legacy modernization & migration", desc: "Aging systems carry institutional knowledge. We modernize the architecture without discarding what still works — and without disrupting your operations in the process." },
            { title: "Quality engineering & test automation", desc: "Reliability at scale requires more than code review. We build automated quality gates that catch regressions before they reach production." },
            { title: "Dedicated engineering teams", desc: "Senior engineers embedded as an extension of your own team — with the context, the continuity, and the judgment that contractors rarely provide." },
        ],
        closingLine: "If you're building something that needs to last, we'd like to be part of it.",
    },
    "artificial-intelligence": {
        name: "Artificial Intelligence",
        oneLine: "AI grounded in engineering, not trend-chasing.",
        heroParagraph: "A lot of AI deployments fail in production — not because the models are bad, but because no one built the surrounding system properly. We approach AI the same way we approach software: with engineering discipline, clear success criteria, and a focus on what actually works in your environment.",
        overview: "We design and deploy AI systems that give your organization a clear, measurable advantage — from LLM-powered assistants to production ML pipelines your teams can act on with confidence. Alongside our engineering work, we operate a dedicated human-data practice for training and evaluating large language models, with particular strength in Bahasa Indonesia and Southeast Asian languages.",
        overviewPull: "Real AI advantage comes from the whole system — the data, the model, the deployment, and the humans who use it. We build all of it.",
        subServices: [
            { title: "AI strategy & advisory", desc: "We help you cut through the noise — identifying where AI creates genuine, measurable value for your organization, and where it doesn't justify the investment." },
            { title: "LLM application development", desc: "Retrieval-augmented assistants, autonomous agents, and intelligent copilots built on your own knowledge and grounded in your data." },
            { title: "Model fine-tuning & custom development", desc: "Off-the-shelf models often underperform in specialized domains. We adapt and train models to your language, your data, and your constraints." },
            { title: "MLOps", desc: "Deploying a model is the beginning, not the end. We build the infrastructure to monitor, maintain, and improve models reliably in production." },
            { title: "Data labeling & annotation", desc: "A managed human-data practice covering RLHF and preference data, model evaluation and red-teaming, and high-quality annotation with deep coverage of Southeast Asian languages." },
        ],
        closingLine: "If AI is on your roadmap and you want it done properly, let's talk.",
    },
    "data-analytics": {
        name: "Data Analytics",
        oneLine: "Turning fragmented data into a foundation you can build on.",
        heroParagraph: "Data only creates value when it's trusted. Most organizations have more data than they can use — and less confidence in it than they need. We fix the foundation before we build the insights, because that's the only order that works.",
        overview: "We transform raw, scattered data into something your organization can genuinely rely on — governed, accurate, and ready for both decisions and AI. That means starting with the fundamentals: ownership, quality, and pipelines that don't break. Then building the analytics layer that your teams will actually use.",
        overviewPull: "If your team is making decisions around data they don't fully trust, that's the problem we solve first.",
        subServices: [
            { title: "Data strategy & governance", desc: "A clear framework for how data is owned, secured, and used across the organization — so that as you scale, the rules scale with you." },
            { title: "Data engineering & pipelines", desc: "Reliable pipelines and warehouse or lakehouse architecture that make your data usable — not just stored, but accessible, consistent, and current." },
            { title: "Business intelligence & dashboards", desc: "Decision-ready reporting built for the people who use it. Metrics your teams understand, trust, and can act on without calling the data team first." },
            { title: "Predictive & advanced analytics", desc: "Forecasting and modeling that turn historical data into forward-looking insight — so you're making decisions ahead of the curve, not behind it." },
            { title: "Data quality & master data management", desc: "Keeping your core data accurate, consistent, and trustworthy across every system that touches it. The unsexy work that makes everything else possible." },
        ],
        closingLine: "Data problems compound over time. The earlier you get the foundation right, the better.",
    },
    "cloud-infrastructure": {
        name: "Cloud Infrastructure",
        oneLine: "Secure, compliant cloud for systems that can't go down.",
        heroParagraph: "Cloud failures in regulated industries don't just cost money — they cost trust. We design cloud environments where the architecture itself enforces compliance, reliability is engineered in, and your team can deploy with confidence every time.",
        overview: "We design and operate secure, compliant cloud environments for organizations that cannot tolerate downtime or compromise. You focus on building; we handle architecture, governance, and reliability. For organizations with data-residency requirements or sector-specific regulations, we have deep experience with sovereign and hybrid deployments that keep you in control.",
        overviewPull: "The question isn't whether your cloud environment is secure. It's whether you can prove it — to your regulators, your auditors, and yourself.",
        subServices: [
            { title: "Cloud architecture & migration", desc: "Designing and moving to cloud environments built for performance and control — not just cost savings that erode the moment traffic spikes." },
            { title: "Cloud security & compliance", desc: "Architecture and governance designed around the requirements of regulated sectors. Security that satisfies your auditors and your engineers." },
            { title: "Sovereign & hybrid cloud", desc: "Deployments that respect data-residency constraints and sector-specific regulations — without sacrificing the capabilities of modern cloud infrastructure." },
            { title: "Managed operations / SRE", desc: "Continuous operation, proactive monitoring, and reliability engineering. We treat your uptime targets as our own." },
            { title: "Cost optimization (FinOps)", desc: "Visibility and control over cloud spend without sacrificing performance. We help you understand what you're paying for — and what you're not using." },
        ],
        closingLine: "If your cloud setup keeps you up at night, it's time to fix it properly.",
    },
    "blockchain": {
        name: "Blockchain & Distributed Ledger",
        oneLine: "Auditable ledger infrastructure for absolute record integrity.",
        heroParagraph: "Distributed ledger technology is valuable precisely when trust between parties is limited or when the cost of a disputed record is high. We work with institutions that understand this — and need the implementation to be as rigorous as the use case demands.",
        overview: "We build transparent, auditable ledger infrastructure for institutions that require absolute record integrity. Not because blockchain is fashionable — because for certain problems in settlement, compliance, and supply chain, it is genuinely the right architecture. We design permissioned networks that meet institutional requirements and hold up under regulatory scrutiny.",
        overviewPull: "Every implementation we deliver is designed to be explainable to regulators, auditable by counterparties, and operable by your own teams long after we're gone.",
        subServices: [
            { title: "DLT network design & implementation", desc: "Permissioned ledger networks designed around institutional requirements — governance, access control, and node architecture that fit the operational reality of regulated industries." },
            { title: "Smart contract development & auditing", desc: "Secure, independently audited contracts for high-stakes automated processes. Code that is correct by design, not by assumption." },
            { title: "Asset tokenization", desc: "Digitizing and managing assets with cryptographically verifiable provenance — enabling new forms of ownership, transfer, and settlement." },
            { title: "Settlement & clearing infrastructure", desc: "Ledger systems built for transparent, auditable settlement — reducing counterparty risk and creating a shared source of truth across institutions." },
            { title: "Supply chain traceability", desc: "End-to-end provenance and audit trails across complex, multi-party supply chains — so you can answer questions about origin, custody, and condition at any point in the chain." },
        ],
        closingLine: "If record integrity is non-negotiable for your institution, we'd like to understand your requirements.",
    },
};

const validSlugs = Object.keys(serviceData);

export async function generateStaticParams() {
    const locales = ["en", "id"];
    return locales.flatMap(locale =>
        validSlugs.map(slug => ({ locale, slug }))
    );
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
    const { slug, locale } = await params;
    const service = serviceData[slug];
    if (!service) return {};

    const canonical = localizedUrl(locale, `/services/${slug}`);
    const title = `${service.name} | ScaleJade`;
    const description = `${service.oneLine} ${service.overview.slice(0, 120)}...`;

    return {
        metadataBase: new URL(BASE),
        title,
        description,
        keywords: [
            service.name.toLowerCase(),
            'enterprise technology',
            'ScaleJade',
            'Singapore',
            'Indonesia',
            ...service.subServices.map(s => s.title.toLowerCase()),
        ],
        alternates: localeAlternates(locale, `/services/${slug}`),
        openGraph: {
            type: 'website',
            url: canonical,
            title,
            description,
            siteName: 'ScaleJade',
            locale: locale === 'id' ? 'id_ID' : 'en_US',
            images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: `ScaleJade — ${service.name}` }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [`${BASE}/opengraph-image`],
        },
    };
}

const sectors = [
    "Financial Institutions",
    "Energy & Resources",
    "Regulated Industries",
    "Government & Public Sector",
];

export default async function ServiceDetailPage({
    params,
}: {
    params: Promise<{ slug: string; locale: string }>;
}) {
    const { slug, locale } = await params;
    const service = serviceData[slug];

    if (!service) notFound();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": service.name,
        "description": service.overview,
        "url": `${BASE}/${locale}/services/${slug}`,
        "provider": {
            "@type": "Organization",
            "name": "ScaleJade",
            "url": BASE,
            "logo": `${BASE}/scalejade-green-withtext.svg`,
            "address": [
                { "@type": "PostalAddress", "addressLocality": "Singapore", "addressCountry": "SG" },
                { "@type": "PostalAddress", "addressLocality": "Jakarta", "addressCountry": "ID" },
            ],
        },
        "areaServed": ["SG", "ID", "APAC"],
        "serviceType": service.subServices.map(s => s.title),
    };

    return (
        <div className="min-h-screen bg-canvas">

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* 1. Hero */}
            <section className="pt-24 md:pt-28 pb-14 md:pb-24 px-4 sm:px-6 border-b border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <nav className="flex items-center flex-wrap gap-1.5 text-xs text-slate-400 mb-8 font-medium tracking-wide" aria-label="Breadcrumb">
                        <Link href={`/${locale}`} className="hover:text-scalejade-600 transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3 shrink-0" />
                        <Link href={`/${locale}/services`} className="hover:text-scalejade-600 transition-colors">Services</Link>
                        <ChevronRight className="w-3 h-3 shrink-0" />
                        <span className="text-slate-600 truncate max-w-[180px] sm:max-w-none">{service.name}</span>
                    </nav>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl"
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4 md:mb-5">
                            {service.name}
                        </h1>
                        <p className="text-lg md:text-xl lg:text-2xl text-scalejade-700 font-semibold leading-relaxed mb-5 md:mb-6">
                            {service.oneLine}
                        </p>
                        <p className="text-base md:text-lg text-slate-500 font-light leading-relaxed max-w-2xl mb-8 md:mb-10">
                            {service.heroParagraph}
                        </p>
                        <Link
                            href={`/${locale}/demo`}
                            className="inline-flex items-center gap-2 bg-scalejade-600 hover:bg-scalejade-800 text-white px-6 md:px-7 py-3 md:py-3.5 rounded-md font-medium transition-all shadow-sm text-sm md:text-base"
                        >
                            Start a Conversation
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* 2. Overview */}
            <section className="py-12 md:py-20 px-4 sm:px-6 border-b border-slate-100">
                <div className="max-w-7xl mx-auto grid md:grid-cols-[180px_1fr] lg:grid-cols-[220px_1fr] gap-6 md:gap-12 items-start">
                    <div>
                        <span className="text-scalejade-600 font-bold tracking-widest uppercase text-xs">How We Approach It</span>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-5 md:space-y-6"
                    >
                        <p className="text-lg md:text-xl lg:text-2xl text-slate-700 font-medium leading-snug tracking-tight">
                            {service.overview}
                        </p>
                        <p className="text-sm md:text-base text-scalejade-800 font-semibold border-l-4 border-scalejade-600 pl-4 md:pl-5 leading-relaxed">
                            {service.overviewPull}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 3. Sub-services */}
            <section className="py-12 md:py-20 px-4 sm:px-6 border-b border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-8 md:mb-12"
                    >
                        <span className="text-scalejade-600 font-bold tracking-widest uppercase text-xs mb-3 block">What We Deliver</span>
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Service Areas
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                        {service.subServices.map((sub, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.06 }}
                                className="bg-white p-6 md:p-8 flex flex-col gap-2 md:gap-3 hover:bg-slate-50 transition-colors"
                            >
                                <h3 className="font-bold text-slate-900 tracking-tight text-sm md:text-base">{sub.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-light">{sub.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Sector strip */}
            <section className="py-10 md:py-16 px-4 sm:px-6 bg-slate-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-5">
                        <span className="text-scalejade-600 font-bold tracking-widest uppercase text-xs">Industries We Serve</span>
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                        {sectors.map((sector, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-700 text-xs md:text-sm font-semibold"
                            >
                                <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-scalejade-600 shrink-0" />
                                {sector}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Closing CTA */}
            <section className="py-16 md:py-24 px-4 sm:px-6 bg-scalejade-900">
                <div className="max-w-7xl mx-auto flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-xl"
                    >
                        <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                            {service.closingLine}
                        </p>
                    </motion.div>
                    <Link
                        href={`/${locale}/demo`}
                        className="inline-flex items-center justify-center gap-2 bg-white text-scalejade-900 hover:bg-slate-100 px-7 py-3.5 rounded-md font-semibold transition-all w-full sm:w-auto md:shrink-0"
                    >
                        Start a Conversation
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

        </div>
    );
}
