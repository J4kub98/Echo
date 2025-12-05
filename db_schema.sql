-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  avatar_url text,
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(username) >= 3)
);

-- Mood Entries table
create table public.mood_entries (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  headline text not null,
  reflection text not null,
  scope text check (scope in ('public', 'community', 'circle', 'private')) not null default 'public',
  mood_tone text default 'neutral',
  tags text[] default '{}',
  image_url text, -- Added in Phase 3
  is_anonymous boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reactions table (Likes)
create table public.reactions (
  id uuid default uuid_generate_v4() primary key,
  entry_id uuid references public.mood_entries(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text check (type in ('like', 'hug', 'support')) default 'like',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(entry_id, user_id)
);

-- Comments/Replies table
create table public.replies (
  id uuid default uuid_generate_v4() primary key,
  entry_id uuid references public.mood_entries(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  body text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Row Level Security)
alter table public.profiles enable row level security;
alter table public.mood_entries enable row level security;
alter table public.reactions enable row level security;
alter table public.replies enable row level security;

-- Profiles: Public read, Owner update
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Mood Entries: Scope based access
create policy "Public entries are viewable by everyone." on public.mood_entries for select using (scope = 'public' or scope = 'community');
create policy "Users can see their own private entries." on public.mood_entries for select using (auth.uid() = author_id);
create policy "Authenticated users can create entries." on public.mood_entries for insert with check (auth.uid() = author_id);

-- Reactions & Replies: Viewable if parent entry is viewable
create policy "Reactions viewable by everyone." on public.reactions for select using (true);
create policy "Authenticated users can react." on public.reactions for insert with check (auth.uid() = user_id);

create policy "Replies viewable by everyone." on public.replies for select using (true);
create policy "Authenticated users can reply." on public.replies for insert with check (auth.uid() = author_id);

-- Function to handle new user signup automatically
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- STORAGE SETUP (Phase 3)
insert into storage.buckets (id, name, public)
values ('mood-images', 'mood-images', true)
on conflict (id) do nothing;

create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'mood-images' );

create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check ( bucket_id = 'mood-images' and auth.role() = 'authenticated' );
