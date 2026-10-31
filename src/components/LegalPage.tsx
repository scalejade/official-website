import { Metadata } from 'next';

import { getLegalDocument, LegalKind } from '@/data/legal';
import { SITE_URL as BASE, localizedUrl, localeAlternates } from '@/lib/locale-url';

export function legalMetadata(kind: LegalKind, locale: string): Metadata {
    const doc = getLegalDocument(kind, locale);
    const title = `${doc.title} | ScaleJade`;
    return {
        metadataBase: new URL(BASE),
        title: { absolute: title },
        description: doc.description,
        alternates: localeAlternates(locale, `/${kind}`),
        openGraph: {
            type: 'website',
            url: localizedUrl(locale, `/${kind}`),
            title,
            description: doc.description,
            siteName: 'ScaleJade',
            locale: locale === 'id' ? 'id_ID' : 'en_US',
        },
    };
}

export function LegalPage({ kind, locale }: { kind: LegalKind; locale: string }) {
    const doc = getLegalDocument(kind, locale);

    return (
        <div className="min-h-screen bg-canvas pt-24 pb-32" role="main">
            <article className="px-6 max-w-3xl mx-auto">
                <header className="mb-14 border-b border-slate-200 pb-10">
                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-6">
                        {doc.title}
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mb-6">
                        {doc.updatedLabel}{' '}
                        <time dateTime={doc.updated}>
                            {new Date(doc.updated).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-GB', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </time>
                    </p>
                    <p className="text-lg text-slate-700 leading-relaxed">{doc.intro}</p>
                </header>

                <div className="space-y-12">
                    {doc.sections.map((section) => (
                        <section key={section.heading}>
                            <h2 className="text-xl font-semibold text-slate-900 tracking-tight mb-4">
                                {section.heading}
                            </h2>
                            {section.paragraphs?.map((p) => (
                                <p key={p} className="text-slate-700 leading-relaxed mb-4">{p}</p>
                            ))}
                            {section.list && (
                                <ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed mb-4">
                                    {section.list.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            )}
                            {section.note && <p className="text-slate-700 leading-relaxed">{section.note}</p>}
                        </section>
                    ))}
                </div>
            </article>
        </div>
    );
}
