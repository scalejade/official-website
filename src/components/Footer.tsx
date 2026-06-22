import Link from 'next/link';
import Image from "next/image";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-scalejade-900 text-slate-300 py-16 border-t border-scalejade-800">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-16 md:gap-8">

                {/* Kiri: Brand & Mission */}
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
                    <p className="text-scalejade-100/70 text-sm leading-relaxed mb-6">
                        Architecting high-assurance intelligence and mission-critical infrastructure for regulated markets worldwide.
                    </p>
                    <p className="text-scalejade-100/40 text-xs leading-relaxed">
                        PT Skala Kecerdasan Nusantara<br />
                        ScaleJade Technology Ltd
                    </p>
                </div>

                {/* Kanan: Navigasi & Socials */}
                <div className="flex flex-col sm:flex-row gap-12 md:gap-16 lg:gap-24">

                    {/* Kolom Offices */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 tracking-wider text-sm uppercase">
                            Offices
                        </h4>
                        <ul className="space-y-5 text-xs text-scalejade-100/60 leading-relaxed">
                            <li>
                                <p className="text-scalejade-100/40 font-semibold uppercase tracking-widest text-[10px] mb-1">Singapore</p>
                                9 Raffles Place, #16-20<br />
                                Republic Plaza II<br />
                                Singapore 048619
                            </li>
                            <li>
                                <p className="text-scalejade-100/40 font-semibold uppercase tracking-widest text-[10px] mb-1">Jakarta</p>
                                Kb. Melati, Tanah Abang<br />
                                Jakarta Pusat 10230<br />
                                Indonesia
                            </li>
                        </ul>
                    </div>

                    {/* Kolom Tautan */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 tracking-wider text-sm uppercase">
                            Resources
                        </h4>
                        <ul className="space-y-4 text-sm text-scalejade-100/70">
                            <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link href="/research" className="hover:text-white transition-colors">Research</Link></li>
                        </ul>
                    </div>

                    {/* Kolom Follow Us */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 tracking-widest text-sm uppercase">
                            Follow Us
                        </h4>
                        <div className="flex items-center gap-5">

                            {/* Logo X (Twitter) */}
                            <a href="https://x.com/ScaleJade" aria-label="Follow us on X" className="text-slate-400 hover:text-white transition-colors">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                                </svg>
                            </a>

                            {/* Logo LinkedIn */}
                            <a href="https://www.linkedin.com/company/scalejade" aria-label="Follow us on LinkedIn" className="text-slate-400 hover:text-white transition-colors">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>

                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Legal Bar */}
            <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-scalejade-800/50 flex flex-col md:flex-row items-center justify-between text-xs text-scalejade-100/50">
                <p>&copy; {currentYear} Scalejade Systems. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <Link href="#" className="hover:text-white transition-colors">Privacy Standard</Link>
                    <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}