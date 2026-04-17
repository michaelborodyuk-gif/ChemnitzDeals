-- ============================================================
-- CHEMNITZ DEALS - Supabase Database Schema
-- ============================================================
-- Dieses SQL-Script in der Supabase SQL-Konsole ausfuehren.
-- Es erstellt alle Tabellen, RLS Policies und Seed-Daten.
-- ============================================================

-- 1. PARTNERS
CREATE TABLE IF NOT EXISTS partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('food','cafe','fitness','shopping','entertainment','beauty','culture','services')),
  location TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL DEFAULT 0,
  lng DOUBLE PRECISION NOT NULL DEFAULT 0,
  image TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  rating DOUBLE PRECISION NOT NULL DEFAULT 0,
  visitor_count INTEGER NOT NULL DEFAULT 0,
  instagram TEXT NOT NULL DEFAULT '',
  brief_facts TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. REWARD_TIERS
CREATE TABLE IF NOT EXISTS reward_tiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL CHECK (type IN ('basis','premium')) DEFAULT 'basis',
  unlock_method TEXT NOT NULL CHECK (unlock_method IN ('none','story','coins')) DEFAULT 'none',
  coin_cost INTEGER DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. QUESTS
CREATE TABLE IF NOT EXISTS quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL CHECK (type IN ('visit','social','community','discovery','earn','special')) DEFAULT 'visit',
  reward INTEGER NOT NULL DEFAULT 0,
  max_progress INTEGER NOT NULL DEFAULT 1,
  deadline TIMESTAMPTZ,
  partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  node_number INTEGER,
  is_reward_node BOOLEAN DEFAULT false,
  category TEXT CHECK (category IN ('check-in','story','community','discovery')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. USERS (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL DEFAULT 'Chemnitzer',
  level INTEGER NOT NULL DEFAULT 1,
  level_progress INTEGER NOT NULL DEFAULT 0,
  level_max INTEGER NOT NULL DEFAULT 6,
  balance INTEGER NOT NULL DEFAULT 0,
  today_earned INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  streak_at_risk BOOLEAN DEFAULT false,
  moji_created BOOLEAN DEFAULT false,
  moji_config JSONB DEFAULT '{"hair":0,"glasses":0,"accessory":0,"outfit":0}',
  favorites TEXT[] DEFAULT '{}',
  leaderboard_joined BOOLEAN DEFAULT false,
  supported_partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  supported_since TIMESTAMPTZ,
  supporter_bonus_earned INTEGER DEFAULT 0,
  last_supporter_bonus_date DATE,
  duel_count INTEGER DEFAULT 0,
  blind_box_available BOOLEAN DEFAULT false,
  last_scratch_date DATE,
  social_followed TEXT[] DEFAULT '{}',
  reviewed_partners TEXT[] DEFAULT '{}',
  visited_partner_ids TEXT[] DEFAULT '{}',
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. USER_QUESTS (tracks quest progress per user)
CREATE TABLE IF NOT EXISTS user_quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('locked','active','pending','completed')) DEFAULT 'active',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, quest_id)
);

-- 6. USER_REWARDS (tracks reward claims per user)
CREATE TABLE IF NOT EXISTS user_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier_id UUID NOT NULL REFERENCES reward_tiers(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  is_unlocked BOOLEAN DEFAULT false,
  is_claimed BOOLEAN DEFAULT false,
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, tier_id)
);

-- 7. TRANSACTIONS
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('earn','spend','gift_send','gift_receive')),
  amount INTEGER NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('completed','pending')) DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. PARTNER_BALANCES (per-user per-partner coin balances)
CREATE TABLE IF NOT EXISTS partner_balances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, partner_id)
);

-- 9. CHALLENGES (daily challenges)
CREATE TABLE IF NOT EXISTS challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  max_progress INTEGER NOT NULL DEFAULT 1,
  reward INTEGER NOT NULL DEFAULT 0,
  deadline TEXT NOT NULL DEFAULT '',
  is_new BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. USER_CHALLENGES
CREATE TABLE IF NOT EXISTS user_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM users WHERE id = auth.uid()),
    false
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- PARTNERS: everyone can read, only admin can write
CREATE POLICY "partners_select" ON partners FOR SELECT USING (true);
CREATE POLICY "partners_insert" ON partners FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "partners_update" ON partners FOR UPDATE USING (is_admin());
CREATE POLICY "partners_delete" ON partners FOR DELETE USING (is_admin());

-- REWARD_TIERS: everyone can read, only admin can write
CREATE POLICY "reward_tiers_select" ON reward_tiers FOR SELECT USING (true);
CREATE POLICY "reward_tiers_insert" ON reward_tiers FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "reward_tiers_update" ON reward_tiers FOR UPDATE USING (is_admin());
CREATE POLICY "reward_tiers_delete" ON reward_tiers FOR DELETE USING (is_admin());

-- QUESTS: everyone can read, only admin can write
CREATE POLICY "quests_select" ON quests FOR SELECT USING (true);
CREATE POLICY "quests_insert" ON quests FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "quests_update" ON quests FOR UPDATE USING (is_admin());
CREATE POLICY "quests_delete" ON quests FOR DELETE USING (is_admin());

-- USERS: user can read/update own, admin can read/update all
CREATE POLICY "users_select_own" ON users FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "users_insert_own" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id OR is_admin());

-- USER_QUESTS: user can read/write own, admin can read/write all
CREATE POLICY "user_quests_select" ON user_quests FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "user_quests_insert" ON user_quests FOR INSERT WITH CHECK (auth.uid() = user_id OR is_admin());
CREATE POLICY "user_quests_update" ON user_quests FOR UPDATE USING (auth.uid() = user_id OR is_admin());

-- USER_REWARDS: user can read/write own, admin can read all
CREATE POLICY "user_rewards_select" ON user_rewards FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "user_rewards_insert" ON user_rewards FOR INSERT WITH CHECK (auth.uid() = user_id OR is_admin());
CREATE POLICY "user_rewards_update" ON user_rewards FOR UPDATE USING (auth.uid() = user_id OR is_admin());

-- TRANSACTIONS: user can read/write own, admin can read all
CREATE POLICY "transactions_select" ON transactions FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "transactions_insert" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id OR is_admin());

-- PARTNER_BALANCES: user can read/write own, admin can read all
CREATE POLICY "partner_balances_select" ON partner_balances FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "partner_balances_insert" ON partner_balances FOR INSERT WITH CHECK (auth.uid() = user_id OR is_admin());
CREATE POLICY "partner_balances_update" ON partner_balances FOR UPDATE USING (auth.uid() = user_id OR is_admin());

-- CHALLENGES: everyone can read, admin can write
CREATE POLICY "challenges_select" ON challenges FOR SELECT USING (true);
CREATE POLICY "challenges_insert" ON challenges FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "challenges_update" ON challenges FOR UPDATE USING (is_admin());
CREATE POLICY "challenges_delete" ON challenges FOR DELETE USING (is_admin());

-- USER_CHALLENGES: user can read/write own, admin can read all
CREATE POLICY "user_challenges_select" ON user_challenges FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "user_challenges_insert" ON user_challenges FOR INSERT WITH CHECK (auth.uid() = user_id OR is_admin());
CREATE POLICY "user_challenges_update" ON user_challenges FOR UPDATE USING (auth.uid() = user_id OR is_admin());

-- ============================================================
-- SEED DATA (Optional - die gleichen Mock-Daten)
-- ============================================================

INSERT INTO partners (id, name, category, location, lat, lng, image, description, rating, visitor_count, instagram, brief_facts)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Doener Palace', 'food', 'Zwickauer Str. 12', 50.827, 12.912, 'https://picsum.photos/seed/doner/800/600', 'Der beste Doener in Chemnitz mit frischen Zutaten.', 4.8, 47, 'donerpalace_chemnitz', ARRAY['Taeglich frisch gebackenes Brot','Geheimrezept fuer die Kraeutersosse','Ueber 20 Jahre Erfahrung','Beliebtester Spot fuer Nachtschwaermer']),
  ('00000000-0000-0000-0000-000000000002', 'Cafe Roter Turm', 'cafe', 'Markt 1', 50.833, 12.921, 'https://picsum.photos/seed/cafe/800/600', 'Traditionelles Cafe direkt am Wahrzeichen.', 4.5, 32, 'caferoterturm', ARRAY['Bester Blick auf den Roten Turm','Hausgemachte Torten nach Omas Rezept','Roestkaffee aus lokaler Manufaktur','Historisches Ambiente seit 1990']),
  ('00000000-0000-0000-0000-000000000004', 'SportCity Chemnitz', 'fitness', 'Limbacher Str. 67', 50.841, 12.898, 'https://picsum.photos/seed/gym/800/600', 'Modernes Fitnessstudio mit Sauna und Kursen.', 4.7, 56, 'sportcity_chemnitz', ARRAY['Groesste Saunalandschaft der Stadt','Ueber 50 Kurse pro Woche','Modernste E-Gym Geraete','Kostenlose Parkplaetze fuer Mitglieder']),
  ('00000000-0000-0000-0000-000000000005', 'Galerie Roter Turm', 'shopping', 'Neumarkt 2', 50.832, 12.923, 'https://picsum.photos/seed/shopping/800/600', 'Das groesste Shopping-Center im Herzen von Chemnitz.', 4.4, 120, 'galerieroterturm', ARRAY['Ueber 60 Fachgeschaefte','Zentraler Treffpunkt am Neumarkt','Regelmaessige Events und Aktionen','Grosses Parkhaus direkt im Center']),
  ('00000000-0000-0000-0000-000000000006', 'Beauty Lounge', 'beauty', 'Theaterstr. 4', 50.835, 12.918, 'https://picsum.photos/seed/beauty/800/600', 'Deine Oase fuer Entspannung und Schoenheit.', 4.9, 18, 'beautylounge_c', ARRAY['Zertifizierte Naturkosmetik','Individuelle Hautanalyse','Entspannende Massagen','Exklusive Make-up Beratung']),
  ('00000000-0000-0000-0000-000000000007', 'Opernhaus Chemnitz', 'culture', 'Theaterplatz 2', 50.838, 12.924, 'https://picsum.photos/seed/opera/800/600', 'Eines der modernsten Opernhaeuser Deutschlands.', 4.8, 85, 'theaterchemnitz', ARRAY['Prachtvoller Bau am Theaterplatz','Vielfaeltiges Programm (Oper, Ballett)','Herausragende Akustik','Blick hinter die Kulissen moeglich']);

INSERT INTO reward_tiers (partner_id, title, description, type, unlock_method, coin_cost, sort_order)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Gratis Sosse', 'Basis, immer verfuegbar', 'basis', 'none', 0, 0),
  ('00000000-0000-0000-0000-000000000001', '1 Euro Rabatt auf alles', 'Nach ca. 7 Besuchen erreichbar', 'premium', 'coins', 100, 1),
  ('00000000-0000-0000-0000-000000000001', 'Gratis Doener', 'Fuer treue Stammkunden', 'premium', 'coins', 750, 2),
  ('00000000-0000-0000-0000-000000000002', 'Gratis Aufguss', 'Basis Reward', 'basis', 'none', 0, 0),
  ('00000000-0000-0000-0000-000000000002', 'Gratis Stueck Kuchen', 'Nach ca. 7 Besuchen', 'premium', 'coins', 100, 1),
  ('00000000-0000-0000-0000-000000000002', 'Kaffeeflatrate fuer einen Tag', 'Fuer echte Stammgaeste', 'premium', 'coins', 750, 2),
  ('00000000-0000-0000-0000-000000000004', 'Gratis Probestunde', 'Basis Reward', 'basis', 'none', 0, 0),
  ('00000000-0000-0000-0000-000000000004', '1 Woche gratis', 'Nach ca. 7 Besuchen', 'premium', 'coins', 100, 1),
  ('00000000-0000-0000-0000-000000000004', '1 Monat -50%', 'Fuer loyale Mitglieder', 'premium', 'coins', 750, 2),
  ('00000000-0000-0000-0000-000000000005', 'Gratis Parken (1h)', 'Basis Reward', 'basis', 'none', 0, 0),
  ('00000000-0000-0000-0000-000000000005', '5 Euro Shopping Gutschein', 'Nach ca. 20 Besuchen', 'premium', 'coins', 300, 1),
  ('00000000-0000-0000-0000-000000000006', 'Kostenlose Beratung', 'Basis Reward', 'basis', 'none', 0, 0),
  ('00000000-0000-0000-0000-000000000006', '10% auf Behandlungen', 'Nach ca. 7 Besuchen', 'premium', 'coins', 100, 1),
  ('00000000-0000-0000-0000-000000000007', 'Programmheft gratis', 'Basis Reward', 'basis', 'none', 0, 0),
  ('00000000-0000-0000-0000-000000000007', '2-fuer-1 Ticket', 'Nach ca. 20 Besuchen', 'premium', 'coins', 300, 1);

INSERT INTO quests (id, title, description, type, reward, max_progress, node_number, category, is_active)
VALUES
  ('00000000-0000-0000-0000-000000000101', 'Besuche heute 2 Partner in der Innenstadt', 'Check-in bei lokalen Partnern.', 'visit', 35, 2, 1, 'check-in', true),
  ('00000000-0000-0000-0000-000000000102', 'Sammle 50 Coins durch Check-ins', 'Sei aktiv in der Stadt.', 'earn', 25, 50, 2, 'discovery', true),
  ('00000000-0000-0000-0000-000000000103', 'Teile dein Erlebnis im Schnitzelhaus', 'Poste eine Story @schnitzelhaus_c', 'social', 20, 1, 3, 'story', true),
  ('00000000-0000-0000-0000-000000000104', 'Community Champion', 'Schenke 3 verschiedenen Nutzern Coins.', 'community', 40, 3, 4, 'community', true),
  ('00000000-0000-0000-0000-000000000105', 'Entdecker Tour', 'Besuche 3 neue Kategorien.', 'discovery', 60, 3, 5, 'discovery', true),
  ('00000000-0000-0000-0000-000000000106', 'Chemnitz Experte', 'Check-in bei 10 Partnern.', 'visit', 80, 10, 6, 'check-in', true);

INSERT INTO challenges (title, max_progress, reward, deadline, is_new, is_active)
VALUES
  ('Besuche heute 2 Partner in der Innenstadt', 2, 35, 'Noch 4h 23min', true, true),
  ('Schenke einem Freund 10 Coins', 1, 15, 'Noch 8h 12min', false, true);
