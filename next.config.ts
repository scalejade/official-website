import createNextIntlPlugin from 'next-intl/plugin';

// Point the plugin to our new config file
const withNextIntl = createNextIntlPlugin('./src/I18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https' as const, hostname: 'images.unsplash.com' },
        ],
    },
    async redirects() {
        return [
            // /demo was a sales contact form, not a product demo. Renamed to
            // /contact; keep the old URL working for anything already linking it.
            { source: '/demo', destination: '/contact', permanent: true },
            { source: '/id/demo', destination: '/id/contact', permanent: true },
        ];
    },
};

export default withNextIntl(nextConfig);