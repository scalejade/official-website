-- =============================================================================
-- ScaleJade website — complete Supabase schema, in one file.
--
-- Run it in the Supabase SQL editor (or `psql -f supabase/schema.sql`).
-- Safe to re-run: every object is created only if missing, and the cleanup in
-- section 7 only touches untouched placeholder rows — content created or
-- edited through /api is never overwritten or deleted.
--
-- BEFORE RUNNING on a live project: set SUPABASE_SERVICE_ROLE_KEY in the app's
-- environment. Section 5 removes public write access, after which /api writes
-- only work with that key.
--
--   1. Shared helpers
--   2. blog_posts        — /blog, /insights, /api/posts
--   3. papers            — /research, /api/papers
--   4. projects + images — /portfolio, /api/projects   (server-only)
--   5. Access control    — grants and RLS policies for all tables
--   6. Storage           — public `media` bucket for /api/media uploads
--   7. Remove old placeholder content (nothing is seeded; content comes via /api)
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- 1. Shared helpers
-- -----------------------------------------------------------------------------

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- 2. blog_posts
-- Sections are JSONB: [{ heading?, paragraphs: string[], image?, imageCaption? }]
-- -----------------------------------------------------------------------------

create table if not exists public.blog_posts (
    id            uuid primary key default gen_random_uuid(),
    slug          text not null unique,
    title         text not null,
    excerpt       text not null default '',
    category      text not null default '',
    author        text not null default 'ScaleJade',
    published_at  date not null default current_date,
    reading_time  text not null default '',
    cover_image   text,
    sections      jsonb not null default '[]'::jsonb,
    is_published  boolean not null default true,
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now()
);

create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at desc);
create index if not exists blog_posts_category_idx     on public.blog_posts (category);

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
    before update on public.blog_posts
    for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 3. papers
-- authors/topics: string[]; links: { pdf?, arxiv?, code?, dataset? };
-- sections: [{ heading, paragraphs: string[] }]
-- -----------------------------------------------------------------------------

create table if not exists public.papers (
    id            uuid primary key default gen_random_uuid(),
    slug          text not null unique,
    title         text not null,
    summary       text not null default '',
    abstract      text not null default '',
    authors       jsonb not null default '[]'::jsonb,
    published_at  date not null default current_date,
    topics        jsonb not null default '[]'::jsonb,
    venue         text,
    links         jsonb not null default '{}'::jsonb,
    sections      jsonb not null default '[]'::jsonb,
    bibtex        text,
    is_published  boolean not null default true,
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now()
);

create index if not exists papers_published_at_idx on public.papers (published_at desc);
create index if not exists papers_topics_idx       on public.papers using gin (topics);

drop trigger if exists papers_set_updated_at on public.papers;
create trigger papers_set_updated_at
    before update on public.papers
    for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 4. projects + project_images
--
-- SERVER-ONLY. The site and /api read these with the service-role key and strip
-- confidential fields in src/data/projects.ts before anything leaves the
-- server. A public read policy would expose `client_name` of confidential
-- projects to anyone holding the publishable key, which ships to every browser.
-- -----------------------------------------------------------------------------

create table if not exists public.projects (
    id                     uuid primary key default gen_random_uuid(),
    slug                   text not null unique,
    title                  text not null,
    summary                text not null default '',

    -- client_name / client_logo_url are shown only when is_confidential = false;
    -- client_classification is always shown.
    client_name            text,
    client_classification  text not null default '',
    client_logo_url        text,
    is_confidential        boolean not null default true,   -- safe default: anonymised

    sector                 text not null
        check (sector in ('finance', 'public', 'education', 'energy_mining',
                          'manufacturing', 'healthcare', 'wholesale')),

    -- Case-study body. All optional; the page renders a section only when filled.
    challenge              text,
    constraints            jsonb not null default '[]'::jsonb, -- string[]  named regulations
    built                  jsonb not null default '[]'::jsonb, -- string[]  what we built
    role                   text,                               -- "Architecture, build and operations"
    team                   text,                               -- "4 engineers, 1 principal"
    duration               text,                               -- "7 months, 2025"
    highlights             jsonb not null default '[]'::jsonb, -- string[]
    outcomes               jsonb not null default '[]'::jsonb, -- [{ value, label }]
    tech_stack             jsonb not null default '[]'::jsonb, -- string[]
    quote                  jsonb,                              -- { text, name, role } | null

    is_published           boolean not null default true,
    is_featured            boolean not null default false,    -- home-page highlight
    sort_order             integer not null default 0,         -- ascending on /portfolio
    created_at             timestamptz not null default now(),
    updated_at             timestamptz not null default now()
);

create index if not exists projects_sector_idx on public.projects (sector);
create index if not exists projects_order_idx  on public.projects (sort_order, created_at desc);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
    before update on public.projects
    for each row execute function public.set_updated_at();

create table if not exists public.project_images (
    id               uuid primary key default gen_random_uuid(),
    project_id       uuid not null references public.projects (id) on delete cascade,
    url              text not null,
    storage_path     text,                 -- set when uploaded via /api; used to delete the file
    alt              text not null default '',
    caption          text,
    kind             text not null default 'other'
        check (kind in ('field', 'product', 'architecture', 'team', 'other')),
    -- Hidden while the project is confidential (e.g. it shows the client's
    -- branding). Shown when the project is public.
    is_confidential  boolean not null default false,
    sort_order       integer not null default 0,
    created_at       timestamptz not null default now()
);

create index if not exists project_images_project_idx on public.project_images (project_id, sort_order);

-- -----------------------------------------------------------------------------
-- 5. Access control
--
-- Grants are explicit because newer Supabase projects no longer grant table
-- privileges to the API roles by default (on older projects these are no-ops).
--   blog_posts, papers:      public may read published rows; writes = service_role
--   projects, images:        service_role only
-- -----------------------------------------------------------------------------

alter table public.blog_posts     enable row level security;
alter table public.papers         enable row level security;
alter table public.projects       enable row level security;
alter table public.project_images enable row level security;

grant select on public.blog_posts, public.papers to anon, authenticated;
revoke insert, update, delete on public.blog_posts, public.papers from anon, authenticated;
grant select, insert, update, delete on public.blog_posts, public.papers to service_role;

revoke all on public.projects, public.project_images from anon, authenticated;
grant select, insert, update, delete on public.projects, public.project_images to service_role;

drop policy if exists "Public can read published posts" on public.blog_posts;
create policy "Public can read published posts"
    on public.blog_posts for select to anon, authenticated
    using (is_published = true);

drop policy if exists "Public can read published papers" on public.papers;
create policy "Public can read published papers"
    on public.papers for select to anon, authenticated
    using (is_published = true);

-- Earlier setups let the publishable key write directly, bypassing the API
-- token. Remove them if present.
drop policy if exists "Anon can insert posts"  on public.blog_posts;
drop policy if exists "Anon can update posts"  on public.blog_posts;
drop policy if exists "Anon can delete posts"  on public.blog_posts;
drop policy if exists "Anon can insert papers" on public.papers;
drop policy if exists "Anon can update papers" on public.papers;
drop policy if exists "Anon can delete papers" on public.papers;

-- projects / project_images: intentionally no policies.

-- -----------------------------------------------------------------------------
-- 6. Storage — public bucket for uploads (/api/media, project galleries).
-- Object paths contain a random UUID, so an image is reachable only by someone
-- who was shown its URL. A URL that was ever rendered stays valid: delete the
-- image rather than only flagging it if it must disappear.
-- -----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- 7. Remove the old placeholder content
--
-- No content is seeded: posts, papers and projects are created through /api
-- (see /api/docs). Earlier versions of this file seeded 5 blog posts, 3 papers
-- and 6 projects; the statements below delete them if they are still there.
--
-- Only rows that still match the original seed exactly are deleted (slug plus
-- title, summary/excerpt, author or client, and date). Anything edited or
-- created through /api — even under one of these slugs — is left alone, so the
-- file stays safe to re-run.
-- -----------------------------------------------------------------------------

-- 7a. Blog posts
delete from public.blog_posts b
using (values
        ('the-hidden-cost-of-software-that-almost-fits', 'The Hidden Cost of Software That Almost Fits', 'Off-the-shelf tools that nearly match your workflow quietly tax every team that touches them. Here is how to spot the drag — and when to build instead.', 'ScaleJade Engineering', date '2026-06-18'),
        ('legacy-systems-carry-institutional-knowledge', 'Legacy Systems Carry Institutional Knowledge', 'Modernizing an aging system is rarely about the code. It is about preserving the decades of decisions encoded inside it.', 'ScaleJade Engineering', date '2026-06-09'),
        ('why-we-embed-engineers-instead-of-handing-off', 'Why We Embed Engineers Instead of Handing Off', 'Contractors deliver and disappear. We stay until the system is stable, understood, and genuinely yours.', 'ScaleJade Engineering', date '2026-05-31'),
        ('test-automation-is-risk-management-not-overhead', 'Test Automation Is Risk Management, Not Overhead', 'Reliability at scale needs more than code review. Automated quality gates catch regressions before your users do.', 'ScaleJade Engineering', date '2026-05-22'),
        ('designing-apis-your-future-self-won-t-resent', 'Designing APIs Your Future Self Won''t Resent', 'The seams between systems are where complexity hides. Clean integration is a design discipline, not an afterthought.', 'ScaleJade Engineering', date '2026-05-13')
    ) as seed (slug, title, excerpt, author, published_at)
where b.slug = seed.slug
  and b.title = seed.title
  and b.excerpt = seed.excerpt
  and b.author = seed.author
  and b.published_at = seed.published_at;

-- 7b. Research papers
delete from public.papers p
using (values
        ('tutorbench', 'TutorBench: Evaluating Large Language Models as Adaptive Tutors', 'A benchmark and evaluation suite for measuring how well LLMs teach — not just answer — across adaptivity, correctness, and pedagogy.', date '2026-05-12'),
        ('ledgerproof', 'LedgerProof: Verifiable Settlement for Permissioned Blockchain Networks', 'A settlement protocol that produces succinct, externally verifiable proofs of finality for permissioned ledgers used in regulated finance.', date '2026-03-03'),
        ('driftguard', 'DriftGuard: Detecting Silent Data Drift in Production ML Pipelines', 'A lightweight monitoring method that flags distribution shift in deployed models before it degrades downstream business metrics.', date '2026-01-20')
    ) as seed (slug, title, summary, published_at)
where p.slug = seed.slug
  and p.title = seed.title
  and p.summary = seed.summary
  and p.published_at = seed.published_at;

-- 7c. Projects (untouched seeds have no images)
delete from public.projects p
using (values
        ('core-banking-settlement', 'Core Banking Settlement Ledger', 'Bank Negara Indonesia'),
        ('banking-cloud-integration', 'Banking Cloud Integration with Data Localisation', 'Finnova'),
        ('energy-asset-tracking', 'Resource Tracking & Predictive Maintenance', 'Solaris Energy'),
        ('industrial-iot-pipeline', 'Edge Failure Prediction for Precision Manufacturing', 'Smiths Group'),
        ('research-data-network', 'Cross-Institution Research Data Network', 'Singapore Management University'),
        ('academic-credential-ledger', 'Verifiable Academic Credentials', 'SBM ITB')
    ) as seed (slug, title, client_name)
where p.slug = seed.slug
  and p.title = seed.title
  and p.client_name = seed.client_name
  and not exists (select 1 from public.project_images i where i.project_id = p.id);

commit;
