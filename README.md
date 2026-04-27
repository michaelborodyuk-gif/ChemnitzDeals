# ChemnitzDeals

Stempelkarten-App für lokale Läden in Chemnitz — Check-in, Instagram Stories, Rewards.

## Was ist ChemnitzDeals?

ChemnitzDeals ist eine digitale Stempelkarten-App, die lokale Geschäfte in Chemnitz mit einer Loyalty-Lösung verbindet. Nutzer sammeln Stempel durch Check-ins und Instagram Stories und lösen Belohnungen ein.

### Wie es funktioniert

- **Check-in**: Vor Ort bei einem Partner einchecken → 1 Stempel (Cooldown: 20 Stunden)
- **Instagram Story**: Story über einen Partner posten → 1 Stempel (max. 4 pro Partner pro Monat)
- **Streak-Bonus**: 3 Tage in Folge aktiv = +1 Bonus-Stempel, 7 Tage = +2
- **Freunde einladen**: Einladung bringt einen Bonus-Stempel
- **Karte voll?** → Reward einlösen (z.B. Gratis Döner, Kaffee & Kuchen, etc.)

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL + Auth + Row Level Security)
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Routing**: React Router DOM v7

## Setup

```bash
# 1. Repo klonen
git clone https://github.com/michaelborodyuk-gif/ChemnitzDeals.git
cd ChemnitzDeals

# 2. Dependencies installieren
npm install

# 3. Environment-Variablen setzen
cp .env.example .env
# → VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY eintragen

# 4. Dev-Server starten
npm run dev
```

Die App läuft dann auf `http://localhost:3000`.

Ohne Supabase-Credentials läuft die App im Offline-/Mock-Modus (keine Datenpersistenz).

## Supabase einrichten

1. Neues Projekt auf [supabase.com](https://supabase.com) erstellen
2. SQL Editor öffnen → Inhalt von `supabase/schema.sql` ausführen
3. Project Settings → API → URL und `anon` Key kopieren
4. In `.env` eintragen

## Projektstruktur

```
src/
├── App.tsx                              # Routing + App Shell
├── main.tsx                             # Entry Point
├── features/
│   ├── stamps/StampCardView.tsx         # Stempelkarten (Hauptseite)
│   ├── rewards/RewardsView.tsx          # Rewards-Übersicht
│   ├── profile/ProfileView.tsx          # Nutzerprofil + Stats
│   ├── leaderboard/LeaderboardView.tsx  # Rangliste
│   └── admin/                           # Admin-Panel
│       ├── AdminLayout.tsx              # Admin Shell + Navigation
│       ├── AdminLogin.tsx               # Admin Login
│       ├── AdminDashboard.tsx           # Dashboard mit Stats
│       ├── AdminPartners.tsx            # Partner verwalten
│       ├── AdminRewards.tsx             # Rewards verwalten
│       ├── AdminUsers.tsx               # Nutzer verwalten
│       └── AdminClaims.tsx              # Eingelöste Rewards
├── shared/
│   ├── components/                      # Wiederverwendbare UI-Komponenten
│   ├── config/constants.ts              # Farben, Kategorien, Mock-Daten
│   ├── context/                         # React Context (Auth, User, Theme, Language)
│   ├── lib/supabase.ts                  # Supabase Client
│   └── types.ts                         # TypeScript Types
supabase/
└── schema.sql                           # Datenbank-Schema + Seed-Daten
```

## Scripts

| Befehl | Beschreibung |
|--------|-------------|
| `npm run dev` | Dev-Server auf Port 3000 |
| `npm run build` | Production Build |
| `npm run preview` | Build lokal testen |
| `npm run lint` | TypeScript Check |
| `npm run clean` | dist/ löschen |

## Admin-Panel

Erreichbar unter `/admin/login`. Dev-Zugangsdaten:

- **Email**: `admin@chemnitzdeals.de`
- **Passwort**: `admin`

(Funktioniert nur im Dev-Modus ohne Supabase-Verbindung)

## Partner (Seed-Daten)

Die App kommt mit 10 Chemnitz-Partnern vorinstalliert: Döner Palace, Café Roter Turm, Roter Turm Döner, Feuerbiss, Hychinka Chemnitz, Eisfenster Gloesa, SportCity Chemnitz, Galerie Roter Turm, Beauty Lounge, Opernhaus Chemnitz.
