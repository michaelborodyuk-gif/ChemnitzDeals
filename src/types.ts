// ============================================================
// ChemnitzDeals — Pure Stamp Card System
// ============================================================

export type Category = "food" | "cafe" | "fitness" | "shopping" | "entertainment" | "beauty" | "culture" | "services";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Partner {
  id: string;
  name: string;
  category: Category;
  location: string;
  coordinates: Coordinates;
  image: string;
  description: string;
  rating: number;
  instagram: string;
  stampsNeeded: number;       // how many stamps to complete the card
  rewardTitle: string;         // what you get when card is full
  rewardDescription: string;
  briefFacts: string[];
  isActive: boolean;
}

export interface StampCard {
  id: string;
  userId: string;
  partnerId: string;
  stamps: number;
  isCompleted: boolean;
  rewardClaimed: boolean;
  createdAt: string;
}

export interface Stamp {
  id: string;
  userId: string;
  partnerId: string;
  stampCardId: string;
  type: "checkin" | "story";
  instagramHandle?: string;
  createdAt: string;
}

export interface StoryLimit {
  userId: string;
  partnerId: string;
  monthYear: string;    // '2026-04'
  storyCount: number;
}

export interface RewardClaim {
  id: string;
  userId: string;
  partnerId: string;
  stampCardId: string;
  rewardTitle: string;
  claimedAt: string;
  redeemedAt?: string;
  status: "claimed" | "redeemed" | "expired";
}

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  totalStamps: number;
  totalRewardsClaimed: number;
  streak: number;
  streakAtRisk: boolean;
  lastActiveDate?: string;
  isAdmin: boolean;
  createdAt: string;
}

// ============================================================
// STAMP CONFIG
// ============================================================
export const STAMP_CONFIG = {
  MAX_STORIES_PER_PARTNER_PER_MONTH: 4,  // 1 pro Woche
  CHECKIN_COOLDOWN_HOURS: 20,             // min hours between checkins at same partner
};
