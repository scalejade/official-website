-- Write access for the blog API.
--
-- The service_role key bypasses RLS entirely, so if the API is configured with
-- SUPABASE_SERVICE_ROLE_KEY no policy below is required — that is the recommended
-- production setup.
--
-- The policies below allow the anon/publishable key to insert & update posts so
-- the API works with only the publishable key. NOTE: the publishable key is
-- public, so these policies let anyone with it write directly to the table,
-- bypassing the API token. For production, prefer the service-role key and drop
-- these two policies.

drop policy if exists "Anon can insert posts" on public.blog_posts;
create policy "Anon can insert posts"
    on public.blog_posts
    for insert
    to anon, authenticated
    with check (true);

drop policy if exists "Anon can update posts" on public.blog_posts;
create policy "Anon can update posts"
    on public.blog_posts
    for update
    to anon, authenticated
    using (true)
    with check (true);

drop policy if exists "Anon can delete posts" on public.blog_posts;
create policy "Anon can delete posts"
    on public.blog_posts
    for delete
    to anon, authenticated
    using (true);
