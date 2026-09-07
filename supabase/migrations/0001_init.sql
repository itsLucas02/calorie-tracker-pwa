-- KiraCal initial schema sketch (for the Supabase handoff).
-- Mirrors src/lib/types.ts 1:1 so LocalMealRepository / LocalProfileRepository
-- map cleanly onto SupabaseProfileRepository / SupabaseMealRepository.

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  age smallint not null check (age between 13 and 100),
  sex text not null check (sex in ('female', 'male')),
  height_cm smallint not null,
  weight_kg numeric(5,1) not null,
  activity_level text not null check (activity_level in ('sedentary','light','moderate','active','very_active')),
  goal text not null check (goal in ('lose','maintain','gain')),
  calculated_calorie_target int not null,
  custom_calorie_target int,
  unique (user_id)
);

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date_key date not null,
  created_at timestamptz not null default now(),
  label text not null,
  original_description text not null,
  -- totals are derivable; kept denormalised for cheap day summaries
  calories int not null default 0,
  protein_g int not null default 0,
  carbs_g int not null default 0,
  fat_g int not null default 0
);

create table if not exists public.meal_items (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references public.meals (id) on delete cascade,
  name text not null,
  portion text not null default '1 serving',
  calories int not null default 0,
  protein_g int not null default 0,
  carbs_g int not null default 0,
  fat_g int not null default 0,
  position smallint not null default 0
);

create index if not exists meals_user_date_idx on public.meals (user_id, date_key);
create index if not exists meal_items_meal_idx on public.meal_items (meal_id);

-- Row Level Security: users only ever see their own rows.
alter table public.profiles enable row level security;
alter table public.meals enable row level security;
alter table public.meal_items enable row level security;

create policy "own profile" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own meals" on public.meals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own meal items" on public.meal_items
  for all using (
    exists (select 1 from public.meals m where m.id = meal_id and m.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.meals m where m.id = meal_id and m.user_id = auth.uid())
  );
