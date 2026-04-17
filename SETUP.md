# Chemnitz Deals — Setup & Übersicht

## Was ist das?

Chemnitz Deals ist eine Gamification-App für lokale Geschäfte in Chemnitz. Nutzer besuchen Partner-Läden, posten Stories, schreiben Google-Bewertungen und bekommen dafür Coins + Gutscheine. Die App motiviert Leute, lokale Geschäfte zu besuchen und zu promoten.

---

## Schnellstart (3 Schritte)

```bash
# 1. Dependencies installieren
npm install

# 2. App starten
npm run dev

# 3. Im Browser öffnen
# User-App:  http://localhost:5173
# Admin:     http://localhost:5173/admin/login
```

**Admin-Login:** E-Mail = `admin@chemnitzdeals.de` / Passwort = `admin`

---

## Tech-Stack

- React 19 + TypeScript + Vite 6
- Tailwind CSS v4
- Motion (Framer Motion) für Animationen
- React Router v7

---

## Projektstruktur

```
src/
├── components/       # User-App Komponenten
│   ├── YuCoinTab     # Haupt-Tab (Coins, Check-in, Streak)
│   ├── QuestsTab     # Quest-Map + Level-Challenge-Popups
│   ├── RewardsTab    # Gutscheine einlösen
│   ├── ProfileTab    # Profil + ChemnitzMoji
│   ├── LeaderboardTab # Rangliste + Step-Duels
│   ├── InventoryModal # Power-Up Shop (Coins/Streaks/Werbung)
│   └── OnboardingSlides # Erklärung beim ersten Öffnen
│
├── admin/            # Admin-Panel (für uns als Betreiber)
│   ├── AdminDashboard    # Live-Übersicht: Gutscheine, Stories, Reviews
│   ├── AdminPartners     # Partner hinzufügen/bearbeiten/löschen
│   ├── AdminKunden       # Kunden verwalten + Gutscheine vergeben
│   ├── AdminActivities   # Level-Challenges bearbeiten
│   ├── AdminPowerUps     # Power-Up Shop konfigurieren
│   ├── AdminRewards      # Reward-Übersicht
│   ├── AdminUsers        # Nutzer-Verwaltung + Coins vergeben
│   └── AdminClaims       # Wer hat was eingelöst
│
├── context/          # React Context (Auth, User, Theme, Language)
├── types.ts          # Alle TypeScript-Typen
├── constants.ts      # Mock-Daten + Partner + Challenges
└── App.tsx           # Routing (User + Admin)
```

---

## Features

### User-App (/)
- Coin-System (100 Coins = 1€ Rabatt)
- Level-basierte Challenges (alle Partner-bezogen)
- Power-Up Shop (kaufen mit Coins, Streaks, oder Werbung)
- Step-Duels (24h Schritte-Challenge gegen andere)
- Onboarding-Slides beim ersten Öffnen
- CoinPower-System (steigt mit Challenges, verbessert Rewards)

### Admin-Panel (/admin)
- Dashboard mit Live-Daten: Gutscheine, Story-Status, Google-Reviews
- Partner CRUD mit Gutschein-Tier-Editor
- Kunden-Verwaltung + Gutschein-Vergabe
- Challenge-Editor (pro Level)
- Nutzer-Verwaltung mit Coin-Vergabe

---

## Aktuelle Partner

| Partner | Gutschein | Bedingung |
|---------|-----------|-----------|
| Roter Turm Döner | Döner für 1€ | Story + Google-Bewertung |
| Feuerbiss | Burger für 3€ | Story |
| Hychinka Chemnitz | 5€ Rabatt | Story + Google-Bewertung |
| Eisfenster Gloesa | 2. Kugel gratis | Story + Google-Bewertung |
| Döner Palace | Gratis Döner (750 Coins) | Coins |
| Café Roter Turm | Kaffeeflatrate (750 Coins) | Coins |
| + 4 weitere | ... | ... |

---

## Deployment (Netlify)

```bash
npm run build
npx netlify-cli deploy --prod --dir=dist --site=e3999cc5-42a4-4f13-88bc-7fcc2fea6795
```

Live-URL: https://chemnitz-deals.netlify.app

---

## Kontakt

Misha — OctaLyft
