import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Server-rendered pagination: plain links, so every page is crawlable and
// shareable. Shared by /portfolio, /blog and /research.

export const PAGE_SIZE = { projects: 6, posts: 10, papers: 10 } as const;

/** Clamp a ?page= value into range and slice the items for it. */
export function paginate<T>(items: T[], pageParam: string | undefined, perPage: number) {
    const totalPages = Math.max(1, Math.ceil(items.length / perPage));
    const currentPage = Math.min(totalPages, Math.max(1, Number(pageParam) || 1));
    const start = (currentPage - 1) * perPage;
    return { currentPage, totalPages, pageItems: items.slice(start, start + perPage) };
}

export function Pagination({
    currentPage,
    totalPages,
    hrefFor,
    locale,
}: {
    currentPage: number;
    totalPages: number;
    hrefFor: (page: number) => string;
    locale: string;
}) {
    if (totalPages <= 1) return null;

    const isId = locale === 'id';
    const previous = isId ? 'Sebelumnya' : 'Previous';
    const next = isId ? 'Berikutnya' : 'Next';
    const link = 'group inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-scalejade-700 transition-colors';
    const disabled = 'inline-flex items-center gap-2 text-sm font-semibold text-slate-300 cursor-not-allowed';

    return (
        <nav
            className="mt-12 md:mt-16 flex items-center justify-between border-t border-slate-200 pt-8"
            aria-label={isId ? 'Halaman' : 'Pagination'}
        >
            {currentPage > 1 ? (
                <Link href={hrefFor(currentPage - 1)} className={link} rel="prev">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                    {previous}
                </Link>
            ) : (
                <span className={disabled} aria-disabled="true">
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    {previous}
                </span>
            )}

            <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                        key={p}
                        href={hrefFor(p)}
                        aria-current={p === currentPage ? 'page' : undefined}
                        aria-label={`${isId ? 'Halaman' : 'Page'} ${p}`}
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
                <Link href={hrefFor(currentPage + 1)} className={link} rel="next">
                    {next}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
            ) : (
                <span className={disabled} aria-disabled="true">
                    {next}
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </span>
            )}
        </nav>
    );
}
