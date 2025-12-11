-- 1. Add image_url column to mood_entries
ALTER TABLE public.mood_entries 
ADD COLUMN IF NOT EXISTS image_url text;

-- 2. Create a storage bucket for mood images
-- Note: This usually needs to be done in the dashboard, but we can try via SQL if the extension is enabled.
-- If this fails, create a public bucket named 'mood-images' in the Supabase Dashboard -> Storage.

insert into storage.buckets (id, name, public)
values ('mood-images', 'mood-images', true)
on conflict (id) do nothing;

-- 3. Set up security policies for the storage bucket

-- Allow anyone to view images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'mood-images' );

-- Allow authenticated users to upload images
create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check ( bucket_id = 'mood-images' and auth.role() = 'authenticated' );

-- Allow users to update/delete their own images (optional, good for cleanup)
create policy "Users can update own images"
  on storage.objects for update
  using ( bucket_id = 'mood-images' and auth.uid() = owner );

create policy "Users can delete own images"
  on storage.objects for delete
  using ( bucket_id = 'mood-images' and auth.uid() = owner );


-- 4. Create a storage bucket for avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 5. Set up security policies for the avatars bucket
create policy "Public Access Avatars"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Authenticated users can upload avatars"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

create policy "Users can update own avatars"
  on storage.objects for update
  using ( bucket_id = 'avatars' and auth.uid() = owner );

create policy "Users can delete own avatars"
  on storage.objects for delete
  using ( bucket_id = 'avatars' and auth.uid() = owner );
