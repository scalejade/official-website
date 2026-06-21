import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import * as motion from "framer-motion/client";
import { ArrowRight, ChevronRight, Share2, Mail } from 'lucide-react';
import { Metadata } from 'next';
import { getAllPosts, getPostBySlug, getCoverImage } from '@/data/blog';

const BASE = 'https://scalejade.com';

export async function generateStaticParams() {
    const locales = ["en", "id"];
    const posts = await getAllPosts();
    return locales.flatMap(locale =>
        posts.map(post => ({ locale, slug: post.slug }))
    );
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
    const { slug, locale } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return {};

    const canonical = `${BASE}/${locale}/blog/${slug}`;
    const title = post.title;
    const cover = getCoverImage(post);

    return {
        metadataBase: new URL(BASE),
        title,
        description: post.excerpt,
        keywords: [post.category.toLowerCase(), 'ScaleJade', 'enterprise technology', 'insights'],
        authors: [{ name: post.author, url: BASE }],
        category: post.category,
        alternates: {
            canonical,
            languages: {
                'en': `${BASE}/en/blog/${slug}`,
                'id': `${BASE}/id/blog/${slug}`,
                'x-default': `${BASE}/en/blog/${slug}`,
            },
        },
        openGraph: {
            type: 'article',
            url: canonical,
            title,
            description: post.excerpt,
            siteName: 'ScaleJade',
            locale: locale === 'id' ? 'id_ID' : 'en_US',
            publishedTime: new Date(post.date).toISOString(),
            modifiedTime: new Date(post.date).toISOString(),
            authors: [post.author],
            section: post.category,
            images: [{ url: cover, width: 1600, height: 900, alt: post.title }],
        },
        twitter: { card: 'summary_large_image', title, description: post.excerpt, images: [cover] },
    };
}

function formatDate(iso: string, locale: string) {
    return new Date(iso).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string; locale: string }>;
}) {
    const { slug, locale } = await params;
    const post = await getPostBySlug(slug);

    if (!post) notFound();

    const allPosts = await getAllPosts();
    const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

    const url = `${BASE}/${locale}/blog/${slug}`;
    const cover = getCoverImage(post);
    const wordCount = post.sections
        .flatMap((s) => [s.heading ?? '', ...s.paragraphs])
        .join(' ')
        .split(/\s+/)
        .filter(Boolean).length;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": [cover],
        "datePublished": new Date(post.date).toISOString(),
        "dateModified": new Date(post.date).toISOString(),
        "url": url,
        "inLanguage": locale === 'id' ? 'id-ID' : 'en-US',
        "articleSection": post.category,
        "wordCount": wordCount,
        "author": { "@type": "Organization", "name": post.author, "url": BASE },
        "publisher": {
            "@type": "Organization",
            "name": "ScaleJade",
            "url": BASE,
            "logo": { "@type": "ImageObject", "url": `${BASE}/scalejade-green-withtext.svg` },
        },
        "mainEntityOfPage": { "@type": "WebPage", "@id": url },
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": `${BASE}/${locale}` },
            { "@type": "ListItem", "position": 2, "name": "Insights", "item": `${BASE}/${locale}/blog` },
            { "@type": "ListItem", "position": 3, "name": post.title, "item": url },
        ],
    };

    return (
        <div className="min-h-screen bg-canvas">

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            {/* Hero — JPMorgan-style: cover image with overlapping white title card */}
            <header className="bg-white">
                <div className="max-w-[90rem] mx-auto px-6 md:px-12 lg:px-20 pt-8 md:pt-10">
                    <nav className="flex items-center flex-wrap gap-1.5 text-xs text-slate-400 mb-6 font-medium tracking-wide" aria-label="Breadcrumb">
                        <Link href={`/${locale}`} className="hover:text-scalejade-600 transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3 shrink-0" />
                        <Link href={`/${locale}/blog`} className="hover:text-scalejade-600 transition-colors">Insights</Link>
                        <ChevronRight className="w-3 h-3 shrink-0" />
                        <span className="text-slate-600 truncate max-w-[180px] sm:max-w-none">{post.title}</span>
                    </nav>

                    <div className="relative">
                        {/* Full-width cover image */}
                        <div className="relative w-full aspect-[16/9] md:aspect-[21/8] overflow-hidden rounded-lg bg-slate-100">
                            <Image
                                src={getCoverImage(post)}
                                alt={post.title}
                                fill
                                priority
                                sizes="100vw"
                                className="object-cover"
                            />
                            {/* gradient for legibility under the overlapping card */}
                            <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                        </div>

                        {/* Overlapping white title card (bottom-left) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative md:absolute md:bottom-0 md:left-0 bg-white md:max-w-3xl lg:max-w-4xl md:pt-8 md:pr-12 mt-6 md:mt-0"
                        >
                            <span className="block text-scalejade-600 text-xs font-bold tracking-[0.2em] uppercase mb-4">
                                Blog · {post.category}
                            </span>
                            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-slate-900 tracking-tight leading-[1.05]">
                                {post.title}
                            </h1>
                        </motion.div>
                    </div>

                    <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed max-w-2xl mt-8 md:mt-16">
                        {post.excerpt}
                    </p>
                </div>
            </header>

            {/* Meta bar — author / date / reading time + share (JPMorgan) */}
            <div className="border-b border-slate-200">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                        <span className="text-slate-800 font-semibold">{post.author}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>{formatDate(post.date, locale)}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>{post.readingTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <span className="text-xs font-semibold tracking-widest uppercase mr-1">{locale === 'id' ? 'Bagikan' : 'Share'}</span>
                        <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${BASE}/${locale}/blog/${slug}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Share on LinkedIn"
                            className="w-8 h-8 inline-flex items-center justify-center rounded-md border border-slate-200 hover:border-scalejade-600/50 hover:text-scalejade-700 transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                        </a>
                        <a
                            href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`${BASE}/${locale}/blog/${slug}`)}`}
                            aria-label="Share via email"
                            className="w-8 h-8 inline-flex items-center justify-center rounded-md border border-slate-200 hover:border-scalejade-600/50 hover:text-scalejade-700 transition-colors"
                        >
                            <Mail className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Body — narrow reading column, lead paragraph, accented headings */}
            <div className="px-4 sm:px-6 py-14 md:py-20">
                <div className="max-w-3xl mx-auto">
                    {post.sections.map((section, idx) => (
                        <motion.section
                            key={idx}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-12"
                        >
                            {section.heading && (
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-5 border-l-4 border-scalejade-600 pl-4">
                                    {section.heading}
                                </h2>
                            )}
                            {section.paragraphs.map((para, pIdx) => (
                                <p
                                    key={pIdx}
                                    className={
                                        idx === 0 && pIdx === 0
                                            ? 'text-xl md:text-2xl text-slate-800 leading-relaxed font-light mb-6'
                                            : 'text-lg text-slate-600 leading-relaxed font-light mb-5'
                                    }
                                >
                                    {para}
                                </p>
                            ))}

                            {section.image && (
                                <figure className="mt-8">
                                    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg bg-slate-100">
                                        <Image
                                            src={section.image}
                                            alt={section.imageCaption ?? section.heading ?? post.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 768px"
                                            className="object-cover"
                                        />
                                    </div>
                                    {section.imageCaption && (
                                        <figcaption className="mt-3 text-sm text-slate-400 font-light">
                                            {section.imageCaption}
                                        </figcaption>
                                    )}
                                </figure>
                            )}
                        </motion.section>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <section className="py-16 md:py-24 px-4 sm:px-6 bg-scalejade-900">
                <div className="max-w-3xl mx-auto flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                    <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight max-w-xl">
                        {locale === 'id' ? 'Punya proyek yang perlu dibangun dengan benar?' : 'Have something that needs to be built properly?'}
                    </p>
                    <Link
                        href={`/${locale}/demo`}
                        className="inline-flex items-center justify-center gap-2 bg-white text-scalejade-900 hover:bg-slate-100 px-7 py-3.5 rounded-md font-semibold transition-all w-full sm:w-auto md:shrink-0"
                    >
                        {locale === 'id' ? 'Mulai Percakapan' : 'Start a Conversation'}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* Related — Citadel-style divided list */}
            {related.length > 0 && (
                <section className="py-16 md:py-20 px-4 sm:px-6 border-t border-slate-100 bg-canvas">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-sm font-bold text-scalejade-600 tracking-widest uppercase mb-2">
                            {locale === 'id' ? 'Artikel Lainnya' : 'More Insights'}
                        </h2>
                        <div className="divide-y divide-slate-200 border-t-2 border-slate-900 mt-6">
                            {related.map((rel) => (
                                <Link
                                    key={rel.slug}
                                    href={`/${locale}/blog/${rel.slug}`}
                                    className="group grid md:grid-cols-[200px_1fr_auto] gap-3 md:gap-12 items-baseline py-8 md:py-10"
                                >
                                    <div className="flex md:flex-col gap-3 md:gap-3">
                                        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-scalejade-600">
                                            {rel.category}
                                        </span>
                                        <span className="text-sm text-slate-400 font-medium">
                                            {formatDate(rel.date, locale)}
                                        </span>
                                    </div>
                                    <div className="max-w-2xl">
                                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-snug mb-3 group-hover:text-scalejade-700 transition-colors">
                                            {rel.title}
                                        </h3>
                                        <p className="text-slate-500 leading-relaxed font-light">{rel.excerpt}</p>
                                    </div>
                                    <ArrowRight className="hidden md:block w-5 h-5 text-slate-300 group-hover:text-scalejade-600 group-hover:translate-x-1 transition-all self-center" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

        </div>
    );
}
