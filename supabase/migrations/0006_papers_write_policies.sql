-- Write access for the papers API.
--
-- The service_role key bypasses RLS entirely, so if the API is configured with
-- SUPABASE_SERVICE_ROLE_KEY no policy below is required — that is the recommended
-- production setup.
--
-- The policies below allow the anon/publishable key to insert, update & delete
-- papers so the API works with only the publishable key. NOTE: the publishable
-- key is public, so these policies let anyone with it write directly to the
-- table, bypassing the API token. For production, prefer the service-role key
-- and drop these policies.

drop policy if exists "Anon can insert papers" on public.papers;
create policy "Anon can insert papers"
    on public.papers
    for insert
    to anon, authenticated
    with check (true);

drop policy if exists "Anon can update papers" on public.papers;
create policy "Anon can update papers"
    on public.papers
    for update
    to anon, authenticated
    using (true)
    with check (true);

drop policy if exists "Anon can delete papers" on public.papers;
create policy "Anon can delete papers"
    on public.papers
    for delete
    to anon, authenticated
    using (true);
