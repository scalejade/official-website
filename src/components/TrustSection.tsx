"use client";

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Layers, ShieldCheck } from 'lucide-react';
import * as motion from "framer-motion/client";
import clientData from '@/data/clients.json';

export function TrustSection() {
    const t = useTranslations('TrustSection');

    // The three core sectors from src/data/sectors.ts, localised.
    const tags = [t('tag_1'), t('tag_2'), t('tag_3')];

    // Kita gandakan data array agar efek marquee tidak terputus
    const duplicatedClients = [...clientData, ...clientData];

    return (
        <section className="py-20 bg-canvas border-y border-slate-100 overflow-hidden" aria-labelledby="trust-heading">
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 text-sm font-medium shadow-sm"
                >
                    <Layers className="w-4 h-4 text-scalejade-600" />
                    {t('badge')}
                </motion.div>

                {/* Headline */}
                <motion.h2
                    id="trust-heading"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-8"
                >
                    {t('title_main')}
                    <span className="text-scalejade-600">{t('title_highlight')}</span>
                </motion.h2>

                {/* Badges / Client Types */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-4 mb-20"
                    role="list"
                    aria-label="Client industry types"
                >
                    {tags.map((tag, idx) => (
                        <div
                            key={idx}
                            role="listitem"
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-700 text-sm font-semibold hover:border-scalejade-600/30 transition-colors"
                        >
                            <ShieldCheck className="w-4 h-4 text-scalejade-600" />
                            {tag}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Marquee of Client Logos */}
            <div className="w-full relative flex overflow-x-hidden group" aria-label="Trusted client logos">
                <div className="flex w-max animate-marquee items-center gap-16 md:gap-24 px-8">
                    {duplicatedClients.map((client, idx) => (
                        <div
                            key={`${client.id}-${idx}`}
                            className="relative w-32 h-12 md:w-40 md:h-16 lg:w-48 lg:h-20 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex-shrink-0 flex items-center justify-center cursor-pointer"
                        >
                            <Image
                                src={client.logo_url}
                                alt={`${client.name} Logo`}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}