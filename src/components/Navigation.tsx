"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import Image from "next/image";

export function Navigation({ locale }: { locale: string }) {
    const pathname = usePathname();

    // Bulletproof locale path generation
    const getTogglePath = () => {
        const nextLocale = locale === 'en' ? 'id' : 'en';

        if (!pathname) return `/${nextLocale}`;

        // Ensure we only replace the exact locale segment at the base of the URL
        if (pathname === `/${locale}`) return `/${nextLocale}`;
        if (pathname.startsWith(`/${locale}/`)) {
            return pathname.replace(`/${locale}/`, `/${nextLocale}/`);
        }

        return `/${nextLocale}`;
    };

    const prefix = locale === 'en' ? '' : `/${locale}`;

    const navLinks = [
        { name: 'Services', href: `${prefix}/services` },
        { name: 'Sectors', href: `${prefix}/sectors` },
        // { name: 'Portfolio', href: `${prefix}/portfolio` },
        { name: 'Who We Are', href: `${prefix}/about` },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/90 backdrop-blur-md transition-all">
            {/* 1. Tambahkan 'relative' di sini agar menu absolut bisa berpatokan ke container ini */}
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">

                {/* Kiri: Identitas Merek */}
                <div className="flex-1 flex justify-start">
                    <Link href={prefix || '/'} className="flex items-center transition-transform duration-300 hover:opacity-80">
                        <Image
                            src="/scalejade-green-withtext.svg"
                            alt="ScaleJade Logo"
                            width={160}
                            height={40}
                            className="object-contain"
                            priority
                        />
                    </Link>
                </div>

                {/* Tengah: Navigasi Desktop (Terkunci Mutlak di Tengah dengan Absolute Positioning) */}
                <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-slate-600 hover:text-scalejade-600 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Kanan: Actions & Language Toggle (Tambahkan flex-1 dan justify-end) */}
                <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
                    <a
                        href={getTogglePath()}
                        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-scalejade-800 transition-colors px-3 py-2 rounded-md hover:bg-slate-50"
                        aria-label={`${locale.toUpperCase()} — switch language`}
                    >
                        <Globe className="w-4 h-4" aria-hidden="true" />
                        <span className="uppercase">{locale}</span>
                    </a>

                    <Link
                        href={`${prefix}/demo`}
                        className="hidden md:block bg-slate-900 hover:bg-scalejade-800 text-white text-sm font-medium px-5 py-2.5 rounded-md transition-all"
                    >
                        Client Portal
                    </Link>
                </div>

            </div>
        </header>
    );
}