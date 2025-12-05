-- 1. Add is_admin column to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean default false;

-- 2. Create Reports table
create table public.reports (
  id uuid default uuid_generate_v4() primary key,
  entry_id uuid references public.mood_entries(id) on delete cascade not null,
  reporter_id uuid references public.profiles(id) on delete cascade not null,
  reason text not null,
  status text check (status in ('pending', 'resolved', 'dismissed')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. RLS Policies for Reports

-- Authenticated users can create reports
alter table public.reports enable row level security;

create policy "Authenticated users can create reports"
  on public.reports for insert
  with check ( auth.role() = 'authenticated' );

-- Only admins can view reports (We will use a function or just RLS based on is_admin)
-- For simplicity in this MVP, we might need to adjust how we check admin status in RLS, 
-- but often it's easier to just allow the specific admin user UUID or use a secure function.
-- Let's try a policy based on the profiles table.

create policy "Admins can view reports"
  on public.reports for select
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

create policy "Admins can update reports"
  on public.reports for update
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- 4. Allow Admins to delete any mood entry
create policy "Admins can delete any entry"
  on public.mood_entries for delete
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );
