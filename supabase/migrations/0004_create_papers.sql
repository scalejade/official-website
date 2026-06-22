-- Research papers for the ScaleJade website (/research index + /research/[slug]).
-- Authors and topics are string arrays; links/sections are structured JSONB so
-- the full paper body lives alongside the row.

create extension if not exists "pgcrypto";

create table if not exists public.papers (
    id            uuid primary key default gen_random_uuid(),
    slug          text not null unique,
    title         text not null,
    summary       text not null default '',         -- index-card summary
    abstract      text not null default '',         -- full abstract (detail page)
    authors       jsonb not null default '[]'::jsonb, -- string[]
    published_at  date not null default current_date,
    topics        jsonb not null default '[]'::jsonb, -- string[] (filter tags)
    venue         text,                              -- e.g. "Preprint · 2026"
    links         jsonb not null default '{}'::jsonb, -- { pdf?, arxiv?, code?, dataset? }
    sections      jsonb not null default '[]'::jsonb, -- [{ heading, paragraphs: string[] }]
    bibtex        text,
    is_published  boolean not null default true,
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now()
);

create index if not exists papers_published_at_idx
    on public.papers (published_at desc);

-- GIN index so topic filtering (topics ? 'Applied AI') stays fast.
create index if not exists papers_topics_idx
    on public.papers using gin (topics);

-- Keep updated_at fresh on every write (reuses the shared trigger fn from 0001).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists papers_set_updated_at on public.papers;
create trigger papers_set_updated_at
    before update on public.papers
    for each row execute function public.set_updated_at();

-- Row Level Security: anonymous/public clients may read published papers only.
alter table public.papers enable row level security;

drop policy if exists "Public can read published papers" on public.papers;
create policy "Public can read published papers"
    on public.papers
    for select
    to anon, authenticated
    using (is_published = true);
