-- Blog posts for the ScaleJade website.
-- Sections (heading / paragraphs / optional image) are stored as JSONB so the
-- structured article body lives alongside the post in a single row.

create extension if not exists "pgcrypto";

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

-- Each section: { "heading"?: string, "paragraphs": string[], "image"?: string, "imageCaption"?: string }

create index if not exists blog_posts_published_at_idx
    on public.blog_posts (published_at desc);

create index if not exists blog_posts_category_idx
    on public.blog_posts (category);

-- Keep updated_at fresh on every write.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
    before update on public.blog_posts
    for each row execute function public.set_updated_at();

-- Row Level Security: anonymous/public clients may read published posts only.
alter table public.blog_posts enable row level security;

drop policy if exists "Public can read published posts" on public.blog_posts;
create policy "Public can read published posts"
    on public.blog_posts
    for select
    to anon, authenticated
    using (is_published = true);
