"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';

/**
 * Locale-free hrefs. The active-state check and the language toggle both work
 * on the locale-stripped path, so these are the canonical shapes.
 *
 * `work` points at /portfolio, the existing (previously unlinked) route. When
 * /work ships, change it here and 301 /portfolio.
 */
const NAV = [
    { key: 'services', href: '/services' },
    { key: 'sectors', href: '/sectors' },
    { key: 'work', href: '/portfolio' },
    { key: 'insights', href: '/insights' },
    { key: 'about', href: '/about' },
] as const;

/** next-intl runs `as-needed`: en is unprefixed, id is /id/*. */
function stripLocale(pathname: string) {
    return pathname.replace(/^\/id(?=\/|$)/, '') || '/';
}

export function Navigation({ locale }: { locale: string }) {
    const pathname = usePathname() ?? '/';
    const t = useTranslations('Nav');

    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const panelRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const prefix = locale === 'en' ? '' : `/${locale}`;
    const current = stripLocale(pathname);

    const isActive = (href: string) => (href === '/' ? current === '/' : current.startsWith(href));

    // Close on route change. Derived during render rather than in an effect, so
    // the panel is never painted open on the page it navigated to.
    const [lastPath, setLastPath] = useState(pathname);
    if (pathname !== lastPath) {
        setLastPath(pathname);
        if (open) setOpen(false);
    }

    // Scroll state: height only. No shadow, no blur, no logo shrink.
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const close = useCallback(() => {
        setOpen(false);
        triggerRef.current?.focus();
    }, []);

    // Body scroll lock, Escape to close, and a focus trap inside the panel.
    useEffect(() => {
        if (!open) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const focusable = () =>
            Array.from(
                panelRef.current?.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
                ) ?? []
            ).filter((el) => el.offsetParent !== null);

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                close();
                return;
            }
            if (event.key !== 'Tab') return;

            const items = focusable();
            if (items.length === 0) return;

            const first = items[0];
            const last = items[items.length - 1];
            const activeEl = document.activeElement;

            if (event.shiftKey && (activeEl === first || !panelRef.current?.contains(activeEl))) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && activeEl === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open, close]);

    return (
        <>
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[3px] focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
            >
                {t('skip')}
            </a>

            <header
                className={`sticky top-0 z-50 w-full border-t-2 border-t-ink-900 border-b border-b-line bg-canvas transition-[height] duration-200 ${
                    scrolled ? 'h-16' : 'h-[72px]'
                }`}
            >
                <div className="mx-auto flex h-full max-w-7xl items-center gap-10 px-6">
                    <Link
                        href={prefix || '/'}
                        className="shrink-0 transition-opacity hover:opacity-80"
                        aria-label="ScaleJade"
                    >
                        <Image
                            src="/scalejade-green-withtext.svg"
                            alt="ScaleJade"
                            width={140}
                            height={34}
                            className="object-contain"
                            priority
                        />
                    </Link>

                    {/* Left-aligned beside the logo, not absolutely centred on the
                        viewport — it scales as items are added and never collides.
                        Labels are sans sentence case; mono is reserved for the
                        utility cluster (SG · ID, EN / ID) and spec lines elsewhere. */}
                    <nav className="hidden h-full items-center gap-7 md:flex" aria-label={t('main_label')}>
                        {NAV.map(({ key, href }) => {
                            const active = isActive(href);
                            return (
                                <Link
                                    key={key}
                                    href={`${prefix}${href}`}
                                    aria-current={active ? 'page' : undefined}
                                    className={`relative flex h-full items-center py-2 text-[13px] font-medium tracking-[0.01em] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-scalejade-600 ${
                                        active
                                            ? 'text-ink-900 after:absolute after:-bottom-px after:left-0 after:h-0.5 after:w-full after:bg-scalejade-600'
                                            : 'text-ink-700 hover:text-ink-900'
                                    }`}
                                >
                                    {t(key)}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="ml-auto flex items-center gap-4">
                        <LanguageToggle pathname={pathname} label={t('language')} />

                        <span className="hidden h-4 w-px bg-line md:block" aria-hidden="true" />

                        <Link
                            href={`${prefix}/contact`}
                            className="hidden rounded-[3px] bg-scalejade-800 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-scalejade-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-scalejade-600 md:block"
                        >
                            {t('cta')}
                        </Link>

                        <button
                            ref={triggerRef}
                            type="button"
                            onClick={() => setOpen(true)}
                            aria-label={t('menu_open')}
                            aria-expanded={open}
                            aria-controls="mobile-nav"
                            className="-mr-2 grid h-11 w-11 place-items-center rounded-[3px] text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-scalejade-600 md:hidden"
                        >
                            <Menu className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Full-screen takeover, not a cramped dropdown. */}
            {open && (
                <div
                    ref={panelRef}
                    id="mobile-nav"
                    role="dialog"
                    aria-modal="true"
                    aria-label={t('main_label')}
                    className="overlay-in fixed inset-0 z-[55] flex flex-col overflow-y-auto bg-ink-900 md:hidden"
                >
                    <div className="flex h-[72px] shrink-0 items-center justify-between px-6">
                        <Image
                            src="/scalejade-white-withtext.svg"
                            alt="ScaleJade"
                            width={140}
                            height={34}
                            className="object-contain"
                        />
                        <button
                            type="button"
                            onClick={close}
                            aria-label={t('menu_close')}
                            autoFocus
                            className="-mr-2 grid h-11 w-11 place-items-center rounded-[3px] text-scalejade-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-scalejade-400"
                        >
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>

                    <nav className="flex flex-col px-6 pt-4" aria-label={t('main_label')}>
                        {NAV.map(({ key, href }, index) => {
                            const active = isActive(href);
                            return (
                                <Link
                                    key={key}
                                    href={`${prefix}${href}`}
                                    aria-current={active ? 'page' : undefined}
                                    className={`flex items-baseline gap-4 border-b border-scalejade-800 py-5 text-[28px] font-semibold tracking-tight transition-colors ${
                                        active ? 'text-scalejade-400' : 'text-scalejade-100'
                                    }`}
                                >
                                    <span className="font-mono text-[10px] text-scalejade-400" aria-hidden="true">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    {t(key)}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto space-y-5 px-6 pb-10 pt-8">
                        <Link
                            href={`${prefix}/contact`}
                            className="block rounded-[3px] bg-white py-4 text-center text-base font-medium text-ink-900"
                        >
                            {t('cta')}
                        </Link>
                        <LanguageToggle pathname={pathname} label={t('language')} tone="dark" />
                        <a
                            href="mailto:connect@scalejade.com"
                            className="block font-mono text-xs text-scalejade-400"
                        >
                            connect@scalejade.com
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}

/**
 * Shows both destinations rather than the language you are already in, and
 * preserves the current path across the switch (/services -> /id/services).
 *
 * No border, no separator, no icon. Weight, colour and case carry the state on
 * their own — a box beside the CTA read as a form control, and a slash between
 * two greys gave neither one enough contrast to look selected.
 */
function LanguageToggle({
    pathname,
    label,
    tone = 'light',
}: {
    pathname: string;
    label: string;
    tone?: 'light' | 'dark';
}) {
    const isId = pathname === '/id' || pathname.startsWith('/id/');
    const stripped = stripLocale(pathname);

    // Padding is for the tap target only; it draws nothing.
    const base =
        'px-1 py-2 text-[12px] leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2';
    const ring = tone === 'dark' ? 'focus-visible:outline-scalejade-400' : 'focus-visible:outline-scalejade-600';

    const state = (active: boolean) => {
        if (active) {
            return tone === 'dark'
                ? 'font-semibold uppercase tracking-[0.06em] text-white'
                : 'font-semibold uppercase tracking-[0.06em] text-ink-900';
        }
        return tone === 'dark'
            ? 'font-normal lowercase text-scalejade-100/50 hover:text-white'
            : 'font-normal lowercase text-ink-500 hover:text-ink-900';
    };

    return (
        <div className="flex items-center gap-3" role="group" aria-label={label}>
            <Link
                href={stripped}
                hrefLang="en"
                aria-current={!isId ? 'true' : undefined}
                className={`${base} ${ring} ${state(!isId)}`}
            >
                en
            </Link>
            <Link
                href={stripped === '/' ? '/id' : `/id${stripped}`}
                hrefLang="id"
                aria-current={isId ? 'true' : undefined}
                className={`${base} ${ring} ${state(isId)}`}
            >
                id
            </Link>
        </div>
    );
}
