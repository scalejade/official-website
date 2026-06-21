import Link from 'next/link';
import * as motion from "framer-motion/client";
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';
import { getAllPosts } from '@/data/blog';

const BASE = 'https://scalejade.com';

export async function generateMetadata({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const { page } = await searchParams;
    const isId = locale === 'id';

    const pageNum = Math.max(1, Number(page) || 1);
    const suffix = pageNum > 1 ? `?page=${pageNum}` : '';
    const canonical = `${BASE}/${locale}/blog${suffix}`;
    const pageLabel = pageNum > 1 ? (isId ? ` — Halaman ${pageNum}` : ` — Page ${pageNum}`) : '';

    const title = (isId ? 'Wawasan' : 'Insights') + pageLabel;
    const description = isId
        ? 'Pemikiran dari tim ScaleJade tentang software, AI, data, cloud, dan blockchain untuk perusahaan dan institusi.'
        : 'Perspectives from the ScaleJade team on software, AI, data, cloud, and blockchain for enterprises and institutions.';

    return {
        metadataBase: new URL(BASE),
        title,
        description,
        alternates: {
            canonical,
            languages: {
                'en': `${BASE}/en/blog${suffix}`,
                'id': `${BASE}/id/blog${suffix}`,
                'x-default': `${BASE}/en/blog${suffix}`,
            },
        },
        openGraph: {
            type: 'website',
            url: canonical,
            title,
            description,
            siteName: 'ScaleJade',
            locale: isId ? 'id_ID' : 'en_US',
            images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: 'ScaleJade Insights' }],
        },
        twitter: { card: 'summary_large_image', title, description, images: [`${BASE}/opengraph-image`] },
    };
}

function formatDate(iso: string, locale: string) {
    return new Date(iso).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

const PER_PAGE = 10;

export default async function BlogPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ page?: string }>;
}) {
    const { locale } = await params;
    const { page } = await searchParams;

    const blogPosts = await getAllPosts();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "ScaleJade Insights",
        "url": `${BASE}/${locale}/blog`,
        "publisher": {
            "@type": "Organization",
            "name": "ScaleJade",
            "url": BASE,
            "logo": `${BASE}/scalejade-green-withtext.svg`,
        },
        "blogPost": blogPosts.map((post) => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "datePublished": new Date(post.date).toISOString(),
            "author": { "@type": "Organization", "name": post.author },
            "url": `${BASE}/${locale}/blog/${post.slug}`,
        })),
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": `${BASE}/${locale}` },
            { "@type": "ListItem", "position": 2, "name": "Insights", "item": `${BASE}/${locale}/blog` },
        ],
    };

    const [featured, ...rest] = blogPosts;

    const totalPages = Math.max(1, Math.ceil(rest.length / PER_PAGE));
    const currentPage = Math.min(totalPages, Math.max(1, Number(page) || 1));
    const isFirstPage = currentPage === 1;
    const start = (currentPage - 1) * PER_PAGE;
    const pageItems = rest.slice(start, start + PER_PAGE);

    const pageHref = (p: number) =>
        p <= 1 ? `/${locale}/blog` : `/${locale}/blog?page=${p}`;

    return (
        <div className="min-h-screen bg-canvas pt-24 pb-32">

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            {/* Hero — editorial, left-aligned (Citadel) */}
            <section className="px-6 max-w-6xl mx-auto mb-14 md:mb-20" aria-labelledby="blog-intro-heading">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="block text-scalejade-600 text-xs font-semibold tracking-[0.2em] uppercase mb-6"
                >
                    {locale === 'id' ? 'Wawasan' : 'Insights'}
                </motion.span>

                <motion.h1
                    id="blog-intro-heading"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-3xl mb-6"
                >
                    {locale === 'id' ? 'Pemikiran dari tim kami' : 'Perspectives from our team'}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-slate-500 font-light leading-relaxed max-w-2xl"
                >
                    {locale === 'id'
                        ? 'Catatan praktis tentang software, AI, data, cloud, dan blockchain untuk perusahaan dan institusi.'
                        : 'Practical notes on software, AI, data, cloud, and blockchain for enterprises and institutions.'}
                </motion.p>
            </section>

            {/* Featured — full-width editorial lead with category badge (Claude). Page 1 only. */}
            {isFirstPage && featured && (
            <section className="px-6 max-w-6xl mx-auto mb-4 md:mb-8" aria-label="Featured article">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="border-t-2 border-slate-900 pt-8 md:pt-10"
                >
                    <Link
                        href={`/${locale}/blog/${featured.slug}`}
                        className="group grid md:grid-cols-[200px_1fr] gap-6 md:gap-12"
                    >
                        <div className="flex md:flex-col gap-3 md:gap-4">
                            <span className="inline-flex items-center self-start rounded-full bg-scalejade-50 text-scalejade-700 text-xs font-semibold tracking-wide px-3 py-1 border border-scalejade-600/15">
                                {featured.category}
                            </span>
                            <span className="text-sm text-slate-400 font-medium md:mt-1">
                                {formatDate(featured.date, locale)}
                            </span>
                        </div>
                        <div className="max-w-3xl">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-5 group-hover:text-scalejade-700 transition-colors">
                                {featured.title}
                            </h2>
                            <p className="text-lg text-slate-500 font-light leading-relaxed mb-6 max-w-2xl">
                                {featured.excerpt}
                            </p>
                            <span className="inline-flex items-center gap-2 text-scalejade-700 font-semibold text-sm">
                                {locale === 'id' ? 'Baca selengkapnya' : 'Read article'}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </div>
                    </Link>
                </motion.div>
            </section>
            )}

            {/* List — divided editorial rows (Citadel) */}
            <section className="px-6 max-w-6xl mx-auto" aria-label="All articles">
                <div className="divide-y divide-slate-200 border-t border-slate-200">
                    {pageItems.map((post, idx) => (
                        <motion.article
                            key={post.slug}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.08 }}
                        >
                            <Link
                                href={`/${locale}/blog/${post.slug}`}
                                className="group grid md:grid-cols-[200px_1fr_auto] gap-3 md:gap-12 items-baseline py-8 md:py-10"
                            >
                                <div className="flex md:flex-col gap-3 md:gap-3">
                                    <span className="text-xs font-semibold tracking-[0.15em] uppercase text-scalejade-600">
                                        {post.category}
                                    </span>
                                    <span className="text-sm text-slate-400 font-medium">
                                        {formatDate(post.date, locale)}
                                    </span>
                                </div>
                                <div className="max-w-2xl">
                                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-snug mb-3 group-hover:text-scalejade-700 transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-slate-500 leading-relaxed font-light">
                                        {post.excerpt}
                                    </p>
                                    <span className="mt-3 inline-block text-sm text-slate-400 font-medium md:hidden">
                                        {post.readingTime}
                                    </span>
                                </div>
                                <ArrowRight className="hidden md:block w-5 h-5 text-slate-300 group-hover:text-scalejade-600 group-hover:translate-x-1 transition-all self-center" />
                            </Link>
                        </motion.article>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <nav
                        className="mt-12 md:mt-16 flex items-center justify-between border-t border-slate-200 pt-8"
                        aria-label="Pagination"
                    >
                        {currentPage > 1 ? (
                            <Link
                                href={pageHref(currentPage - 1)}
                                className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-scalejade-700 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                {locale === 'id' ? 'Sebelumnya' : 'Previous'}
                            </Link>
                        ) : (
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 cursor-not-allowed">
                                <ChevronLeft className="w-4 h-4" />
                                {locale === 'id' ? 'Sebelumnya' : 'Previous'}
                            </span>
                        )}

                        <div className="hidden sm:flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <Link
                                    key={p}
                                    href={pageHref(p)}
                                    aria-current={p === currentPage ? 'page' : undefined}
                                    className={
                                        p === currentPage
                                            ? 'w-9 h-9 inline-flex items-center justify-center rounded-md bg-scalejade-900 text-white text-sm font-semibold'
                                            : 'w-9 h-9 inline-flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 text-sm font-medium transition-colors'
                                    }
                                >
                                    {p}
                                </Link>
                            ))}
                        </div>

                        <span className="sm:hidden text-sm font-medium text-slate-500">
                            {currentPage} / {totalPages}
                        </span>

                        {currentPage < totalPages ? (
                            <Link
                                href={pageHref(currentPage + 1)}
                                className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-scalejade-700 transition-colors"
                            >
                                {locale === 'id' ? 'Berikutnya' : 'Next'}
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        ) : (
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 cursor-not-allowed">
                                {locale === 'id' ? 'Berikutnya' : 'Next'}
                                <ChevronRight className="w-4 h-4" />
                            </span>
                        )}
                    </nav>
                )}
            </section>

        </div>
    );
}
