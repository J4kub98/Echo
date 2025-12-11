-- Follows table
create table public.follows (
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (follower_id, following_id)
);

alter table public.follows enable row level security;

create policy "Follows are viewable by everyone." 
  on public.follows for select 
  using (true);

create policy "Users can follow others." 
  on public.follows for insert 
  with check (auth.uid() = follower_id);

create policy "Users can unfollow others." 
  on public.follows for delete 
  using (auth.uid() = follower_id);
