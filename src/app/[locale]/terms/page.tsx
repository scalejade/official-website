import { Metadata } from 'next';
import { LegalPage, legalMetadata } from '@/components/LegalPage';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    return legalMetadata('terms', locale);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return <LegalPage kind="terms" locale={locale} />;
}
