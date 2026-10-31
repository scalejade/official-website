import Link from 'next/link';
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { CONTACT_EMAIL, LEGAL_ENTITIES } from '@/lib/company';

export function Footer({ locale }: { locale: string }) {
    const t = useTranslations('Footer');
    const currentYear = new Date().getFullYear();
    const prefix = locale === 'en' ? '' : `/${locale}`;

    const company = [
        { label: t('link_work'), href: '/portfolio' },
        { label: t('link_about'), href: '/about' },
        { label: t('link_insights'), href: '/insights' },
        { label: t('link_research'), href: '/research' },
        { label: t('link_contact'), href: '/contact' },
    ];

    return (
        <footer className="bg-scalejade-900 text-slate-300 py-16 border-t border-scalejade-800">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-16 md:gap-8">

                {/* Brand & entities */}
                <div className="md:max-w-sm">
                    <div className="mb-6 flex items-center">
                        <Image
                            src="/scalejade-white-withtext.svg"
                            alt="ScaleJade Logo"
                            width={200}
                            height={48}
                            className="object-contain transition-opacity hover:opacity-90"
                        />
                    </div>
                    <p className="text-scalejade-100/85 text-sm leading-relaxed mb-6">
                        {t('tagline')}
                    </p>
                    <ul className="text-scalejade-100/70 text-xs leading-relaxed space-y-1">
                        <li>{LEGAL_ENTITIES.sg} <span className="text-scalejade-100/50">· {t('entity_sg')}</span></li>
                        <li>{LEGAL_ENTITIES.id} <span className="text-scalejade-100/50">· {t('entity_id')}</span></li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-12 md:gap-16 lg:gap-20">

                    {/* Offices */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 text-sm">
                            {t('offices')}
                        </h4>
                        <ul className="space-y-5 text-xs text-scalejade-100/85 leading-relaxed">
                            <li>
                                <p className="text-scalejade-100/70 font-semibold text-sm mb-1">Singapore</p>
                                9 Raffles Place, #16-20<br />
                                Republic Plaza II<br />
                                Singapore 048619
                            </li>
                            <li>
                                <p className="text-scalejade-100/70 font-semibold text-sm mb-1">Jakarta</p>
                                Kb. Melati, Tanah Abang<br />
                                Jakarta Pusat 10230<br />
                                Indonesia
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 text-sm">
                            {t('company')}
                        </h4>
                        <ul className="space-y-4 text-sm text-scalejade-100/85">
                            {company.map((item) => (
                                <li key={item.href}>
                                    <Link href={`${prefix}${item.href}`} className="hover:text-white transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & follow */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 text-sm">
                            {t('contact')}
                        </h4>
                        <ul className="space-y-4 text-sm text-scalejade-100/85 mb-8">
                            <li>
                                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white transition-colors">
                                    {CONTACT_EMAIL}
                                </a>
                            </li>
                            <li>
                                <Link href={`${prefix}/contact`} className="hover:text-white transition-colors">
                                    {t('book_call')}
                                </Link>
                            </li>
                        </ul>
                        <div className="flex items-center gap-5">
                            <a href="https://x.com/ScaleJade" aria-label={t('follow_x')} className="text-slate-400 hover:text-white transition-colors">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
                                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                                </svg>
                            </a>
                            <a href="https://www.linkedin.com/company/scalejade" aria-label={t('follow_linkedin')} className="text-slate-400 hover:text-white transition-colors">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom legal bar */}
            <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-scalejade-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-scalejade-100/70">
                <p>&copy; {currentYear} {LEGAL_ENTITIES.sg} &amp; {LEGAL_ENTITIES.id}. {t('rights')}</p>
                <div className="flex gap-6">
                    <Link href={`${prefix}/privacy`} className="hover:text-white transition-colors">{t('privacy')}</Link>
                    <Link href={`${prefix}/terms`} className="hover:text-white transition-colors">{t('terms')}</Link>
                </div>
            </div>
        </footer>
    );
}
