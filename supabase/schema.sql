-- ============================================================
-- ChemnitzDeals — Pure Stamp Card System
-- Supabase PostgreSQL Schema
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- PARTNERS (Läden / Geschäfte)
-- ============================================================
create table public.partners (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null check (category in ('food','cafe','fitness','shopping','entertainment','beauty','culture','services')),
  location text not null,
  lat double precision,
  lng double precision,
  image text,
  description text,
  rating numeric(2,1) default 0,
  instagram text,
  stamps_needed int not null default 10, -- how many stamps for a reward
  reward_title text not null default 'Gratis Überraschung',
  reward_description text,
  brief_facts jsonb default '[]'::jsonb,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- USERS (App-Nutzer)
-- ============================================================
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  email text,
  avatar_url text,
  total_stamps int default 0,
  total_rewards_claimed int default 0,
  streak int default 0,
  streak_at_risk boolean default false,
  last_active_date date,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- STAMP CARDS (one per user per partner)
-- ============================================================
create table public.stamp_cards (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  partner_id uuid not null references public.partners(id) on delete cascade,
  stamps int not null default 0,
  is_completed boolean default false,
  reward_claimed boolean default false,
  created_at timestamptz default now(),
  unique(user_id, partner_id)
);

-- ============================================================
-- STAMPS (individual stamp events — audit log)
-- ============================================================
create table public.stamps (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  partner_id uuid not null references public.partners(id) on delete cascade,
  stamp_card_id uuid not null references public.stamp_cards(id) on delete cascade,
  type text not null check (type in ('checkin', 'story')),
  instagram_handle text, -- only for story stamps
  created_at timestamptz default now()
);

-- ============================================================
-- STORY LIMITS (track stories per user per partner per month)
-- Limit: max 4 stories per partner per month
-- ============================================================
create table public.story_limits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  partner_id uuid not null references public.partners(id) on delete cascade,
  month_year text not null, -- format: '2026-04'
  story_count int not null default 0,
  unique(user_id, partner_id, month_year)
);

-- ============================================================
-- REWARD CLAIMS (when a full card is redeemed)
-- ============================================================
create table public.reward_claims (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  partner_id uuid not null references public.partners(id) on delete cascade,
  stamp_card_id uuid not null references public.stamp_cards(id) on delete cascade,
  reward_title text not null,
  claimed_at timestamptz default now(),
  redeemed_at timestamptz, -- when partner confirms redemption
  status text default 'claimed' check (status in ('claimed', 'redeemed', 'expired'))
);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_stamp_cards_user on public.stamp_cards(user_id);
create index idx_stamp_cards_partner on public.stamp_cards(partner_id);
create index idx_stamps_user on public.stamps(user_id);
create index idx_stamps_partner on public.stamps(partner_id);
create index idx_stamps_created on public.stamps(created_at);
create index idx_story_limits_lookup on public.story_limits(user_id, partner_id, month_year);
create index idx_reward_claims_user on public.reward_claims(user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.partners enable row level security;
alter table public.users enable row level security;
alter table public.stamp_cards enable row level security;
alter table public.stamps enable row level security;
alter table public.story_limits enable row level security;
alter table public.reward_claims enable row level security;

-- Partners: everyone can read, admins can write
create policy "Partners are viewable by everyone" on public.partners
  for select using (true);

create policy "Admins can manage partners" on public.partners
  for all using (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
  );

-- Users: can read own data, admins can read all
create policy "Users can read own data" on public.users
  for select using (id = auth.uid());

create policy "Users can update own data" on public.users
  for update using (id = auth.uid());

create policy "Admins can read all users" on public.users
  for select using (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
  );

-- Stamp cards: users see own cards
create policy "Users can view own stamp cards" on public.stamp_cards
  for select using (user_id = auth.uid());

create policy "Users can insert own stamp cards" on public.stamp_cards
  for insert with check (user_id = auth.uid());

create policy "Users can update own stamp cards" on public.stamp_cards
  for update using (user_id = auth.uid());

-- Stamps: users see own stamps
create policy "Users can view own stamps" on public.stamps
  for select using (user_id = auth.uid());

create policy "Users can insert own stamps" on public.stamps
  for insert with check (user_id = auth.uid());

-- Story limits: users see own limits
create policy "Users can view own story limits" on public.story_limits
  for select using (user_id = auth.uid());

create policy "Users can upsert own story limits" on public.story_limits
  for insert with check (user_id = auth.uid());

create policy "Users can update own story limits" on public.story_limits
  for update using (user_id = auth.uid());

-- Reward claims: users see own claims
create policy "Users can view own claims" on public.reward_claims
  for select using (user_id = auth.uid());

create policy "Users can insert own claims" on public.reward_claims
  for insert with check (user_id = auth.uid());

-- Admins can manage all claims
create policy "Admins can manage claims" on public.reward_claims
  for all using (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
  );

-- ============================================================
-- SEED DATA: Chemnitz Partners
-- ============================================================
insert into public.partners (id, name, category, location, lat, lng, description, rating, instagram, stamps_needed, reward_title, reward_description, brief_facts) values
  ('d0a1b2c3-0001-4000-8000-000000000001', 'Döner Palace', 'food', 'Zwickauer Str. 12', 50.827, 12.912, 'Der beste Döner in Chemnitz mit frischen Zutaten.', 4.8, 'donerpalace_chemnitz', 10, 'Gratis Döner', 'Ein Döner deiner Wahl komplett gratis!', '["Täglich frisch gebackenes Brot", "Geheimrezept für die Kräutersoße", "Über 20 Jahre Erfahrung"]'),
  ('d0a1b2c3-0002-4000-8000-000000000002', 'Café Roter Turm', 'cafe', 'Markt 1', 50.833, 12.921, 'Traditionelles Café direkt am Wahrzeichen.', 4.5, 'caferoterturm', 8, 'Gratis Kaffee & Kuchen', 'Ein Heißgetränk + Kuchenstück gratis!', '["Bester Blick auf den Roten Turm", "Hausgemachte Torten nach Omas Rezept"]'),
  ('d0a1b2c3-0003-4000-8000-000000000003', 'Roter Turm Döner', 'food', 'Neumarkt, Chemnitz', 50.832, 12.922, 'Frischer Döner direkt am Roten Turm.', 4.7, 'roterdoner_chemnitz', 8, 'Döner für 1€', 'Dein nächster Döner für nur 1 Euro!', '["Direkt am Roten Turm", "Frische Zutaten täglich"]'),
  ('d0a1b2c3-0004-4000-8000-000000000004', 'Feuerbiss', 'food', 'Chemnitz Innenstadt', 50.834, 12.917, 'Saftige Burger mit Feuer-Feeling.', 4.6, 'feuerbiss_chemnitz', 10, 'Gratis Burger', 'Ein Signature Burger komplett gratis!', '["Hausgemachte Burger-Patties", "Scharfe Signature-Saucen"]'),
  ('d0a1b2c3-0005-4000-8000-000000000005', 'Hychinka Chemnitz', 'food', 'Chemnitz', 50.829, 12.919, 'Authentische Küche mit besonderem Flair.', 4.8, 'hychinka_chemnitz', 8, '5€ Rabatt', '5 Euro Rabatt auf deine nächste Bestellung!', '["Authentische Rezepte", "Familiäre Atmosphäre"]'),
  ('d0a1b2c3-0006-4000-8000-000000000006', 'Eisfenster Gloesa', 'food', 'Gloesa, Chemnitz', 50.831, 12.920, 'Cremiges Eis aus eigener Herstellung.', 4.9, 'eisfenster_gloesa', 6, '2 Kugeln gratis', 'Zwei Kugeln Eis deiner Wahl komplett gratis!', '["Über 20 hausgemachte Sorten", "Vegane Optionen"]'),
  ('d0a1b2c3-0007-4000-8000-000000000007', 'SportCity Chemnitz', 'fitness', 'Limbacher Str. 67', 50.841, 12.898, 'Modernes Fitnessstudio mit Sauna und Kursen.', 4.7, 'sportcity_chemnitz', 10, '1 Woche gratis', 'Eine ganze Woche kostenloses Training!', '["Größte Saunalandschaft", "Über 50 Kurse pro Woche"]'),
  ('d0a1b2c3-0008-4000-8000-000000000008', 'Galerie Roter Turm', 'shopping', 'Neumarkt 2', 50.832, 12.923, 'Das größte Shopping-Center im Herzen von Chemnitz.', 4.4, 'galerieroterturm', 12, '5€ Shopping Gutschein', 'Fünf Euro Gutschein für alle Shops!', '["Über 60 Fachgeschäfte", "Zentraler Treffpunkt"]'),
  ('d0a1b2c3-0009-4000-8000-000000000009', 'Beauty Lounge', 'beauty', 'Theaterstr. 4', 50.835, 12.918, 'Deine Oase für Entspannung und Schönheit.', 4.9, 'beautylounge_c', 8, 'Gratis Behandlung', 'Eine Basic-Behandlung komplett kostenlos!', '["Zertifizierte Naturkosmetik", "Individuelle Hautanalyse"]'),
  ('d0a1b2c3-0010-4000-8000-000000000010', 'Opernhaus Chemnitz', 'culture', 'Theaterplatz 2', 50.838, 12.924, 'Eines der modernsten Opernhäuser Deutschlands.', 4.8, 'theaterchemnitz', 6, '2-für-1 Ticket', 'Zwei Tickets zum Preis von einem!', '["Prachtvoller Bau am Theaterplatz", "Vielfältiges Programm"]');
