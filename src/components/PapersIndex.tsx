'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import * as motion from 'framer-motion/client';
import { ArrowUpRight } from 'lucide-react';
import type { Paper } from '@/data/papers';

function formatDate(iso: string, locale: string) {
    return new Date(iso).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export function PapersIndex({
    papers,
    topics,
    locale,
    allLabel,
}: {
    papers: Paper[];
    topics: string[];
    locale: string;
    allLabel: string;
}) {
    const [active, setActive] = useState<string>('__all__');

    const filtered = useMemo(
        () => (active === '__all__' ? papers : papers.filter((p) => p.topics.includes(active))),
        [papers, active]
    );

    const chips = [{ key: '__all__', label: allLabel }, ...topics.map((t) => ({ key: t, label: t }))];

    return (
        <>
            {/* Topic filter */}
            <div className="flex flex-wrap gap-2 mb-12">
                {chips.map((chip) => {
                    const isActive = active === chip.key;
                    return (
                        <button
                            key={chip.key}
                            onClick={() => setActive(chip.key)}
                            aria-pressed={isActive}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                                isActive
                                    ? 'bg-scalejade-900 text-white border-scalejade-900'
                                    : 'bg-surface text-slate-600 border-slate-200 hover:border-scalejade-600/50'
                            }`}
                        >
                            {chip.label}
                        </button>
                    );
                })}
            </div>

            {/* Papers grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {filtered.map((paper, idx) => (
                    <motion.div
                        key={paper.slug}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: Math.min(idx * 0.05, 0.3) }}
                    >
                        <Link
                            href={`/${locale}/research/${paper.slug}`}
                            className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-surface p-8 transition-all hover:border-scalejade-600/50 hover:shadow-lg hover:shadow-scalejade-900/5"
                        >
                            <div className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-scalejade-700">
                                {paper.topics.slice(0, 3).map((topic) => (
                                    <span key={topic} className="rounded-full bg-scalejade-50 px-2.5 py-1">
                                        {topic}
                                    </span>
                                ))}
                            </div>

                            <h2 className="mb-3 text-xl font-bold tracking-tight text-slate-900 group-hover:text-scalejade-800 md:text-2xl">
                                {paper.title}
                            </h2>

                            <p className="mb-6 flex-grow text-slate-600 leading-relaxed">{paper.summary}</p>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-slate-700">
                                        {paper.authors.join(', ')}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {paper.venue ?? formatDate(paper.date, locale)}
                                    </p>
                                </div>
                                <ArrowUpRight className="h-5 w-5 flex-none text-slate-300 transition-colors group-hover:text-scalejade-600" />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </>
    );
}
