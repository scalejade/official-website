import { useTranslations } from 'next-intl';
import * as motion from "framer-motion/client";
import { Mail, CalendarDays, ArrowRight, ShieldAlert } from 'lucide-react';
import { Metadata } from 'next';

const BASE = 'https://scalejade.com';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const isId = locale === 'id';
    const canonical = `${BASE}/${locale}/demo`;

    const title = isId ? 'Mulai Percakapan | ScaleJade' : 'Start a Conversation | ScaleJade';
    const description = isId
        ? 'Ceritakan tentang proyek Anda dan kami akan menemukan waktu untuk terhubung. Diskusi langsung tentang apa yang bisa kita bangun bersama.'
        : 'Tell us about your project and we will find a time to connect. A straightforward discussion about what we can build together — no pressure.';

    return {
        metadataBase: new URL(BASE),
        title,
        description,
        alternates: {
            canonical,
            languages: {
                'en': `${BASE}/en/demo`,
                'id': `${BASE}/id/demo`,
                'x-default': `${BASE}/en/demo`,
            },
        },
        openGraph: {
            type: 'website',
            url: canonical,
            title,
            description,
            siteName: 'ScaleJade',
            locale: isId ? 'id_ID' : 'en_US',
            images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: 'Contact ScaleJade' }],
        },
        twitter: { card: 'summary_large_image', title, description, images: [`${BASE}/opengraph-image`] },
        robots: { index: false, follow: false },
    };
}

export default function DemoPage() {
    const t = useTranslations('Demo');
    const calendlyUrl = "https://calendly.com/connect-scalejade/30min";

    return (
        <div className="min-h-screen bg-canvas pt-24 pb-32" role="main">

            {/* Structured Data - JSON-LD for Demo Page */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ContactPage",
                        "name": "Schedule a Consultation with ScaleJade",
                        "description": "Connect with ScaleJade senior engineers to discuss your technology needs",
                        "mainEntity": {
                            "@type": "ContactPoint",
                            "telephone": "+1-XXX-XXX-XXXX",
                            "contactType": "sales",
                            "email": "connect@scalejade.com",
                            "availableLanguage": ["English", "Indonesian"]
                        }
                    })
                }}
            />

            {/* 1. Header Section */}
            <section className="px-6 max-w-5xl mx-auto text-center mb-20" aria-labelledby="demo-heading">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-scalejade-800/20 bg-surface text-scalejade-800 text-sm font-medium tracking-wide uppercase"
                >
                    <ShieldAlert className="w-4 h-4" />
                    {t('badge')}
                </motion.div>

                <motion.h1
                    id="demo-heading"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6"
                >
                    {t('title')}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-slate-500 font-light leading-relaxed max-w-2xl mx-auto"
                >
                    {t('subtitle')}
                </motion.p>
            </section>

            {/* 2. Interactive Portal Grid */}
            <section className="px-6 max-w-7xl mx-auto" aria-label="Contact Options">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

                    {/* Kolom Kiri: Form Inkuiri Langsung */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-surface border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center">
                                <Mail className="w-6 h-6 text-scalejade-800" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                {t('form_title')}
                            </h2>
                        </div>

                        {/* Form HTML Standar. 
                Action mailto: akan membuka aplikasi email pengguna (Outlook/Gmail) 
                dan otomatis mengisi connect@scalejade.com 
            */}
                        <form action="mailto:connect@scalejade.com" method="post" encType="text/plain" className="space-y-6">

                            <div>
                                <label htmlFor="organization" className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                                    {t('form_org')}
                                </label>
                                <input
                                    type="text"
                                    id="organization"
                                    name="Organization"
                                    required
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-scalejade-600/50 focus:border-scalejade-600 transition-all"
                                    placeholder="e.g. Central Bank of..."
                                    aria-required="true"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                                    {t('form_email')}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="Email"
                                    required
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-scalejade-600/50 focus:border-scalejade-600 transition-all"
                                    placeholder="name@organization.com"
                                    aria-required="true"
                                />
                            </div>

                            <div>
                                <label htmlFor="requirements" className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                                    {t('form_req')}
                                </label>
                                <textarea
                                    id="requirements"
                                    name="Requirements"
                                    required
                                    rows={4}
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-scalejade-600/50 focus:border-scalejade-600 transition-all resize-none"
                                    placeholder="Describe your architectural needs..."
                                    aria-required="true"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-scalejade-900 hover:bg-scalejade-800 text-white font-medium px-6 py-4 rounded-lg transition-all flex items-center justify-center gap-2 group mt-4"
                            >
                                {t('form_submit')}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                        </form>
                    </motion.div>

                    {/* Kolom Kanan: Calendly Embed */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white border border-slate-200 rounded-3xl p-2 shadow-sm overflow-hidden flex flex-col"
                    >
                        <div className="p-6 md:p-8 pb-4">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 bg-surface border border-slate-200 rounded-xl flex items-center justify-center">
                                    <CalendarDays className="w-6 h-6 text-scalejade-800" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                    {t('cal_title')}
                                </h2>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed pl-16">
                                {t('cal_desc')}
                            </p>
                        </div>

                        {/* Native Iframe untuk Calendly */}
                        <div className="w-full flex-grow min-h-[500px] relative rounded-2xl overflow-hidden">
                            <iframe
                                src={calendlyUrl}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                title="Schedule a Consultation with ScaleJade"
                                className="absolute inset-0"
                                loading="lazy"
                            ></iframe>
                        </div>
                    </motion.div>

                </div>
            </section>

        </div>
    );
}