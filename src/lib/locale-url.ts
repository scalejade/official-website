// Builds absolute URLs that respect next-intl's `as-needed` locale prefix:
// the default locale (en) is served without a prefix (/blog), other locales
// are prefixed (/id/blog). Keep canonical + hreflang consistent with routing.

export const SITE_URL = 'https://scalejade.com';

export const DEFAULT_LOCALE = 'en';

/** `path` must start with '/' (or be '' for the home page). */
export function localizedUrl(locale: string, path = ''): string {
    const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
    return `${SITE_URL}${prefix}${path}`;
}

/** Canonical + hreflang alternates for a given path, per Metadata.alternates. */
export function localeAlternates(locale: string, path = '') {
    return {
        canonical: localizedUrl(locale, path),
        languages: {
            en: localizedUrl('en', path),
            id: localizedUrl('id', path),
            'x-default': localizedUrl('en', path),
        },
    };
}
