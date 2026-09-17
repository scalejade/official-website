// Single source of truth for the sector taxonomy.
//
// Consumed by /sectors, /sectors/[slug], the service detail pages and the
// homepage trust tags. Previously three different lists existed — a four-item
// list on the service pages and homepage, a seven-item list on /sectors, and
// the two barely overlapped. Change the taxonomy here and it changes everywhere.
//
// Three core sectors own a page each; the rest are listed on the index only.
// "Regulated Industries" was removed deliberately: it is a descriptor, not a
// sector, and it overlapped Financial, Public Sector and Healthcare. It is the
// positioning umbrella now, not a taxonomy entry.
//
// ─────────────────────────────────────────────────────────────────────────────
// ⚠️  `regulations` BELOW ARE UNVERIFIED DRAFTS AND MUST BE CONFIRMED BEFORE
//     THIS SHIPS. Name only frameworks ScaleJade has genuinely built against —
//     listing one you have not worked with is worse than listing none, and this
//     is the one audience that will check. Delete any line you cannot stand
//     behind; the layout degrades cleanly with fewer entries.
// ─────────────────────────────────────────────────────────────────────────────

export const CORE_SECTOR_SLUGS = [
    'financial-institutions',
    'public-sector',
    'education-research',
] as const;

export type SectorSlug = (typeof CORE_SECTOR_SLUGS)[number];

export type SectorLead = {
    name: string;
    role: string;
    /** Team profile, once /team ships. */
    href?: string;
};

export type CoreSector = {
    slug: SectorSlug;
    /** Key under the `Sectors` message namespace (localised display name). */
    messageKey: 'finance' | 'public' | 'education';
    /** Icon name, resolved to a component in the page that renders it. */
    icon: 'landmark' | 'building' | 'graduation';
    /** Named frameworks — see the warning above. */
    regulations: string[];
    /** ids from clients.json, filtered to this sector. */
    clientIds: string[];
    /** ids from portfolio.json. */
    workIds: string[];
    /** slugs from the papers table. */
    paperSlugs: string[];
    /** null until the team page ships — the block is skipped rather than faked. */
    lead: SectorLead | null;
};

export const CORE_SECTORS: CoreSector[] = [
    {
        slug: 'financial-institutions',
        messageKey: 'finance',
        icon: 'landmark',
        regulations: [
            'POJK',
            'PBI',
            'BI-FAST',
            'SNAP open API',
            'APU-PPT (AML/CFT)',
            'ISO 20022',
            'MAS TRM Guidelines',
        ],
        clientIds: ['bank-indonesia', 'bni', 'finnova'],
        workIds: ['bni-core-settlement', 'finnova-banking-cloud'],
        paperSlugs: ['ledgerproof', 'driftguard'],
        lead: null,
    },
    {
        slug: 'public-sector',
        messageKey: 'public',
        icon: 'building',
        regulations: [
            'SPBE architecture',
            'UU PDP No. 27/2022',
            'Pusat Data Nasional residency',
            'BSSN baselines',
            'IM8',
        ],
        // No published work or papers in this sector yet. The proof block renders
        // empty rather than borrowing evidence from another sector.
        clientIds: [],
        workIds: [],
        paperSlugs: [],
        lead: null,
    },
    {
        slug: 'education-research',
        messageKey: 'education',
        icon: 'graduation',
        regulations: [
            'UU PDP No. 27/2022',
            'PDDIKTI reporting',
            'PDPA (Singapore)',
            'ISO 27001',
        ],
        clientIds: ['sbmitb', 'smu'],
        workIds: ['smu-research-network', 'sbmitb-academic-ledger'],
        paperSlugs: ['tutorbench'],
        lead: null,
    },
];

/**
 * Listed on the index only — no page, no paragraph. Each entry carries a
 * three-or-four-word capability qualifier (see `also_qualifier` in the message
 * catalogs) so the line itself does the work an explanatory sentence used to.
 *
 * "Energy & Resources" and "Mining & Resources" were two entries doing one job
 * across the two old taxonomies; they are merged here.
 */
export const ALSO_WORKING_IN = [
    'energy_mining',
    'manufacturing',
    'healthcare',
    'wholesale',
] as const;

export type AlsoSectorKey = (typeof ALSO_WORKING_IN)[number];

export function getCoreSector(slug: string): CoreSector | undefined {
    return CORE_SECTORS.find((s) => s.slug === slug);
}

/**
 * English sector names, for the surfaces that are not routed through the
 * message catalogs (service detail pages, JSON-LD).
 */
export const SECTOR_NAMES_EN: Record<SectorSlug, string> = {
    'financial-institutions': 'Financial Institutions',
    'public-sector': 'Government & Public Sector',
    'education-research': 'Education & Research',
};
