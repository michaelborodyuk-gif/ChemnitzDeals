import React, { createContext, useContext, useState } from "react";

type Language = "de" | "en";

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

export const translations: Translations = {
  coins: { de: "Coins", en: "Coins" },
  quests: { de: "Quests", en: "Quests" },
  rewards: { de: "Rewards", en: "Rewards" },
  profile: { de: "Profil", en: "Profile" },
  leaderboard: { de: "Rangliste", en: "Leaderboard" },
  heroTitle: { de: "Entdecke Chemnitz", en: "Discover Chemnitz" },
  heroSub: { de: "Sammle Coins, schließe Quests ab und schalte exklusive Belohnungen bei deinen Lieblingspartnern frei.", en: "Collect coins, complete quests, and unlock exclusive rewards at your favorite local partners." },
  searchPlaceholder: { de: "Suche nach Partnern oder Kategorien...", en: "Search for partners or categories..." },
  categories: { de: "Kategorien", en: "Categories" },
  featuredRewards: { de: "Beliebte Rewards", en: "Featured Rewards" },
  viewAll: { de: "Alle ansehen", en: "View All" },
  noResults: { de: "Keine Partner gefunden. Versuche es mit einem anderen Suchbegriff.", en: "No partners found. Try a different search term." },
  redemptions: { de: "Einlösungen", en: "redemptions" },
  openInMaps: { de: "In Maps öffnen", en: "Open in Maps" },
  todayEarned: { de: "heute verdient", en: "earned today" },
  challengeAccepted: { de: "Challenge annehmen", en: "Accept Challenge" },
  remainingToday: { de: "übrig heute", en: "left today" },
  earnDescription: { de: "🏪 {checkins} Check-ins · 📸 {stories} Story", en: "🏪 {checkins} Check-ins · 📸 {stories} Story" },
  newBadge: { de: "NEU", en: "NEW" },
  joinQuest: { de: "Quest starten", en: "Start Quest" },
  questLocked: { de: "Gesperrt", en: "Locked" },
  socialUnlock: { de: "Poste @{partner} in deiner Story um freizuschalten", en: "Post @{partner} in your story to unlock" },
  activateReward: { de: "Reward aktivieren", en: "Activate Reward" },
  rewardActivated: { de: "Aktiviert! Zeig das dem Partner vor Ort", en: "Activated! Show this to the partner on site" },
  available: { de: "Verfügbar", en: "Available" },
  expiresIn: { de: "Läuft ab in {time}", en: "Expires in {time}" },
  onlyLeft: { de: "Nur noch {count} verfügbar", en: "Only {count} left" },
  basis: { de: "Basis", en: "Basis" },
  premium: { de: "Premium", en: "Premium" },
  createMoji: { de: "Moji erstellen", en: "Create Moji" },
  earnMojiReward: { de: "Verdiene 100 Coins wenn du deinen ChemnitzMoji erstellst", en: "Earn 100 coins when you create your ChemnitzMoji" },
  mojiCreated: { de: "Moji erstellt!", en: "Moji created!" },
  statsEarned: { de: "Gesamt verdient", en: "Total earned" },
  statsActivated: { de: "Rewards aktiviert", en: "Rewards activated" },
  statsCompleted: { de: "Quests erledigt", en: "Quests completed" },
  statsStreak: { de: "Streak", en: "Streak" },
  giftCoins: { de: "Coins schenken", en: "Gift Coins" },
  giftDescription: { de: "Zeig deinen Freunden dass du an sie denkst", en: "Show your friends you're thinking of them" },
  dailyReflection: { de: "Heutige Reflexion", en: "Today's Reflection" },
  earnOpportunity: { de: "Verdiene heute: {amount} Coins", en: "Earn today: {amount} Coins" },
  favorites: { de: "Favoriten", en: "Favorites" },
  myRedemptions: { de: "Meine Einlösungen", en: "My Redemptions" },
  settings: { de: "Einstellungen", en: "Settings" },
  history: { de: "Verlauf", en: "History" },
  expenses: { de: "Ausgaben", en: "Expenses" },
  joinLeaderboard: { de: "Rangliste beitreten", en: "Join Leaderboard" },
  leaderboardDescription: { de: "Tritt gegen andere Chemnitzer an und gewinne wöchentliche Preise!", en: "Compete against other Chemnitzers and win weekly prizes!" },
  duel: { de: "Duell", en: "Duel" },
  thisWeek: { de: "Diese Woche", en: "This Week" },
  allTime: { de: "Gesamt", en: "All Time" },
  trophy: { de: "Trophäe", en: "Trophy" },
  save: { de: "Speichern", en: "Save" },
  frisur: { de: "Frisur", en: "Hairstyle" },
  brille: { de: "Brille", en: "Glasses" },
  accessoire: { de: "Accessoire", en: "Accessory" },
  outfit: { de: "Outfit", en: "Outfit" },
  streakAtRisk: { de: "Rette deinen Streak! Noch {time}", en: "Save your streak! {time} left" },
  newBeginning: { de: "Frischer Start! Tag 1 🌱", en: "Fresh Start! Day 1 🌱" },
  luckyMoment: { de: "Glücksmoment! 🎉", en: "Lucky Moment! 🎉" },
  committed: { de: "Du hast dich verpflichtet!", en: "You've committed!" },
  consolation: { de: "Du hast {amount} Trost-Coins verdient!", en: "You've earned {amount} consolation coins!" },
  winner: { de: "Gewinner", en: "Winner" },
  loser: { de: "Verlierer", en: "Loser" },
  storyBonus: { de: "Story Bonus", en: "Story Bonus" },
  checkinBonus: { de: "Check-in Bonus", en: "Check-in Bonus" },
  giftFrom: { de: "{user} hat dir Coins geschenkt! 🎁", en: "{user} sent you coins! 🎁" },
  sentTo: { de: "Gesendet an {user} ✓", en: "Sent to {user} ✓" },
  challengesToday: { de: "Challenges heute", en: "Challenges today" },
  streakTage: { de: "Tage am Stück! 🔥", en: "days in a row! 🔥" },
  streakBonus: { de: "Morgen: +Bonus Coins wenn du weitermachst", en: "Tomorrow: +Bonus coins if you keep going" },
  mitmachen: { de: "MITMACHEN", en: "JOIN IN" },
  partnerBesuchen: { de: "CHECK-IN", en: "CHECK-IN" },
  coinsVerschenken: { de: "SCHENKEN", en: "GIFT" },
  freundEinladen: { de: "EINLADEN", en: "INVITE" },
  deineVerdienste: { de: "Deine Verdienste", en: "Your Earnings" },
  alleAnsehen: { de: "Alle ansehen", en: "View All" },
  tippDesTages: { de: "Chemnitz Tipp des Tages", en: "Chemnitz Tip of the Day" },
  levelUnlock: { de: "Freischalten auf Level", en: "Unlock at Level" },
  moreRewards: { de: "Mehr Belohnungen warten!", en: "More rewards ahead!" },
  moreRewardsDesc: { de: "Schließe täglich Challenges ab um schneller freizuschalten.", en: "Complete daily challenges to unlock faster." },
  verstanden: { de: "Verstanden!", en: "Got it!" },
  rewardPasses: { de: "DEINE REWARD PASSES", en: "YOUR REWARD PASSES" },
  levelUpToUnlock: { de: "Level up um freizuschalten!", en: "Level up to unlock!" },
  jetztAktivieren: { de: "Jetzt aktivieren", en: "Activate now" },
  heuteBesucht: { de: "heute besucht 🔥", en: "visited today 🔥" },
  peekText: { de: "👁 Das steckt dahinter", en: "👁 What's behind this" },
  nochNichtsHier: { de: "Noch nichts hier", en: "Nothing here yet" },
  checkInSuggestion: { de: "Check-in bei einem Partner um anzufangen!", en: "Check-in at a partner to get started!" },
  achievementProgress: { de: "Du hast heute schon {percent}% deines Tagesziels erreicht! 💪", en: "You've already reached {percent}% of your daily goal today! 💪" },
  gesamtBalance: { de: "GESAMT BALANCE", en: "TOTAL BALANCE" },
  karte: { de: "🗺 Karte", en: "🗺 Map" },
  liste: { de: "📋 Liste", en: "📋 List" },
  zurueck: { de: "← Zurück", en: "← Back" },
  inventar: { de: "Inventar", en: "Inventory" },
  belohnung: { de: "Belohnung", en: "Reward" },
  noch: { de: "Noch", en: "Still" },
  machenDasGerade: { de: "machen das gerade", en: "are doing this right now" },
  aktiv: { de: "AKTIV", en: "ACTIVE" },
  fortschrittVerfolgen: { de: "Fortschritt verfolgen →", en: "Track progress →" },
  meineStempelkarten: { de: "Meine Stempelkarten", en: "My Stamp Cards" },
  punkteKaufen: { de: "Punkte kaufen", en: "Buy Points" },
  tauschen: { de: "Tauschen", en: "Exchange" },
  hinweisTauschen: { de: "Hinweis: Direktes Sammeln lohnt sich mehr", en: "Note: Direct earning is more rewarding" },
  fastGeschafft: { de: "Fast geschafft! 🔥", en: "Almost there! 🔥" },
  nochPunkteBis: { de: "Noch {points} Punkte bis: {reward}", en: "{points} points left until: {reward}" }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("de");

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
