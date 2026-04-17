import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Partner, StampCard, Stamp, StoryLimit, RewardClaim, UserProfile, STAMP_CONFIG } from "../types";
import { MOCK_PARTNERS } from "../constants";
import { supabase, isSupabaseConfigured as isSupabaseConfiguredFlag } from "../lib/supabase";
import { useAuth } from "./AuthContext";

// ============================================================
// CONTEXT TYPE
// ============================================================
interface UserContextType {
  profile: UserProfile;
  partners: Partner[];
  stampCards: StampCard[];
  recentStamps: Stamp[];
  storyLimits: StoryLimit[];
  rewardClaims: RewardClaim[];
  isLoading: boolean;

  // Actions
  checkIn: (partnerId: string) => void;
  submitStory: (partnerId: string, instagramHandle: string) => void;
  claimReward: (partnerId: string) => void;
  inviteFriend: (partnerId: string) => void;
  getStampCard: (partnerId: string) => StampCard | undefined;
  getStoriesRemaining: (partnerId: string) => number;
  canCheckIn: (partnerId: string) => boolean;
  refreshData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// ============================================================
// DEFAULT PROFILE
// ============================================================
const DEFAULT_PROFILE: UserProfile = {
  id: "local-user",
  username: "Neuer Chemnitzer",
  totalStamps: 0,
  totalRewardsClaimed: 0,
  streak: 0,
  streakAtRisk: false,
  isAdmin: false,
  createdAt: new Date().toISOString(),
};

// ============================================================
// STREAK BONUS LOGIC
// 3 Tage Streak = 1 Bonus-Stempel auf letzte Karte
// 7 Tage Streak = 2 Bonus-Stempel auf letzte Karte
// ============================================================
function getStreakBonus(newStreak: number): number {
  if (newStreak > 0 && newStreak % 7 === 0) return 2;
  if (newStreak > 0 && newStreak % 3 === 0) return 1;
  return 0;
}

// ============================================================
// PROVIDER
// ============================================================
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [partners, setPartners] = useState<Partner[]>(MOCK_PARTNERS);
  const [stampCards, setStampCards] = useState<StampCard[]>([]);
  const [recentStamps, setRecentStamps] = useState<Stamp[]>([]);
  const [storyLimits, setStoryLimits] = useState<StoryLimit[]>([]);
  const [rewardClaims, setRewardClaims] = useState<RewardClaim[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const useSupabase = isSupabaseConfiguredFlag && !!auth.user;

  // ── Helper: current month string ──
  const currentMonth = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  // ── Helper: get or create stamp card (local) ──
  const getOrCreateCard = (partnerId: string): StampCard => {
    const existing = stampCards.find(c => c.partnerId === partnerId && !c.rewardClaimed);
    if (existing) return existing;

    const newCard: StampCard = {
      id: `sc-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      userId: profile.id,
      partnerId,
      stamps: 0,
      isCompleted: false,
      rewardClaimed: false,
      createdAt: new Date().toISOString(),
    };
    setStampCards(prev => [...prev, newCard]);
    return newCard;
  };

  // ── Load from Supabase ──
  const refreshData = useCallback(async () => {
    if (!useSupabase || !auth.user) return;
    setIsLoading(true);

    try {
      // Partners
      const { data: partnersData } = await supabase
        .from("partners")
        .select("*")
        .eq("is_active", true);

      if (partnersData) {
        setPartners(partnersData.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          location: p.location,
          coordinates: { lat: p.lat, lng: p.lng },
          image: p.image || "",
          description: p.description || "",
          rating: p.rating,
          instagram: p.instagram || "",
          stampsNeeded: p.stamps_needed,
          rewardTitle: p.reward_title,
          rewardDescription: p.reward_description || "",
          briefFacts: p.brief_facts || [],
          isActive: p.is_active,
        })));
      }

      // User profile
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", auth.user.id)
        .single();

      if (userData) {
        setProfile({
          id: userData.id,
          username: userData.username,
          email: userData.email,
          avatarUrl: userData.avatar_url,
          totalStamps: userData.total_stamps,
          totalRewardsClaimed: userData.total_rewards_claimed,
          streak: userData.streak,
          streakAtRisk: userData.streak_at_risk,
          lastActiveDate: userData.last_active_date,
          isAdmin: userData.is_admin,
          createdAt: userData.created_at,
        });
      }

      // Stamp cards
      const { data: cardsData } = await supabase
        .from("stamp_cards")
        .select("*")
        .eq("user_id", auth.user.id);

      if (cardsData) {
        setStampCards(cardsData.map((c: any) => ({
          id: c.id,
          userId: c.user_id,
          partnerId: c.partner_id,
          stamps: c.stamps,
          isCompleted: c.is_completed,
          rewardClaimed: c.reward_claimed,
          createdAt: c.created_at,
        })));
      }

      // Recent stamps
      const { data: stampsData } = await supabase
        .from("stamps")
        .select("*")
        .eq("user_id", auth.user.id)
        .order("created_at", { ascending: false })
        .limit(30);

      if (stampsData) {
        setRecentStamps(stampsData.map((s: any) => ({
          id: s.id,
          userId: s.user_id,
          partnerId: s.partner_id,
          stampCardId: s.stamp_card_id,
          type: s.type,
          instagramHandle: s.instagram_handle,
          createdAt: s.created_at,
        })));
      }

      // Story limits
      const { data: limitsData } = await supabase
        .from("story_limits")
        .select("*")
        .eq("user_id", auth.user.id)
        .eq("month_year", currentMonth());

      if (limitsData) {
        setStoryLimits(limitsData.map((l: any) => ({
          userId: l.user_id,
          partnerId: l.partner_id,
          monthYear: l.month_year,
          storyCount: l.story_count,
        })));
      }

      // Reward claims
      const { data: claimsData } = await supabase
        .from("reward_claims")
        .select("*")
        .eq("user_id", auth.user.id)
        .order("claimed_at", { ascending: false });

      if (claimsData) {
        setRewardClaims(claimsData.map((c: any) => ({
          id: c.id,
          userId: c.user_id,
          partnerId: c.partner_id,
          stampCardId: c.stamp_card_id,
          rewardTitle: c.reward_title,
          claimedAt: c.claimed_at,
          redeemedAt: c.redeemed_at,
          status: c.status,
        })));
      }
    } catch (err) {
      console.error("Error loading data:", err);
    }
    setIsLoading(false);
  }, [useSupabase, auth.user]);

  useEffect(() => { refreshData(); }, [refreshData]);

  // ── Realtime subscription ──
  useEffect(() => {
    if (!useSupabase) return;
    const channel = supabase
      .channel("realtime-stamps")
      .on("postgres_changes", { event: "*", schema: "public", table: "stamp_cards" }, () => refreshData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [useSupabase, refreshData]);

  // ── Helper: sync profile to Supabase ──
  const syncProfile = async (updates: Record<string, any>) => {
    if (!useSupabase || !auth.user) return;
    await supabase.from("users").update(updates).eq("id", auth.user.id);
  };

  // ── Helper: update streak ──
  const updateStreak = (): number => {
    const today = new Date().toISOString().split("T")[0];
    const lastDate = profile.lastActiveDate;

    let newStreak = profile.streak;

    if (lastDate === today) {
      // Already active today, no change
      return newStreak;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (lastDate === yesterdayStr) {
      newStreak += 1;
    } else {
      newStreak = 1; // reset
    }

    setProfile(prev => ({
      ...prev,
      streak: newStreak,
      lastActiveDate: today,
      streakAtRisk: false,
    }));

    syncProfile({
      streak: newStreak,
      last_active_date: today,
      streak_at_risk: false,
    });

    return newStreak;
  };

  // ── Add stamp to card (local + Supabase) ──
  const addStampToCard = async (
    partnerId: string,
    type: "checkin" | "story",
    instagramHandle?: string,
    bonusStamps: number = 0
  ) => {
    const card = getOrCreateCard(partnerId);
    const partner = partners.find(p => p.id === partnerId);
    if (!partner) return;

    const stampsToAdd = 1 + bonusStamps;
    const newStamps = Math.min(card.stamps + stampsToAdd, partner.stampsNeeded);
    const isCompleted = newStamps >= partner.stampsNeeded;

    // Update card locally
    setStampCards(prev =>
      prev.map(c =>
        c.id === card.id
          ? { ...c, stamps: newStamps, isCompleted }
          : c
      )
    );

    // Add stamp event
    const stamp: Stamp = {
      id: `s-${Date.now()}`,
      userId: profile.id,
      partnerId,
      stampCardId: card.id,
      type,
      instagramHandle,
      createdAt: new Date().toISOString(),
    };
    setRecentStamps(prev => [stamp, ...prev]);

    // Update profile
    setProfile(prev => ({
      ...prev,
      totalStamps: prev.totalStamps + stampsToAdd,
    }));

    // Supabase sync
    if (useSupabase && auth.user) {
      // Upsert stamp card
      await supabase.from("stamp_cards").upsert({
        id: card.id,
        user_id: auth.user.id,
        partner_id: partnerId,
        stamps: newStamps,
        is_completed: isCompleted,
      }, { onConflict: "user_id,partner_id" });

      // Insert stamp event
      await supabase.from("stamps").insert({
        user_id: auth.user.id,
        partner_id: partnerId,
        stamp_card_id: card.id,
        type,
        instagram_handle: instagramHandle,
      });

      // Update total stamps
      await syncProfile({ total_stamps: profile.totalStamps + stampsToAdd });
    }
  };

  // ============================================================
  // CHECK-IN: 1 Stempel + möglicher Streak-Bonus
  // ============================================================
  const checkIn = (partnerId: string) => {
    if (!canCheckIn(partnerId)) return;

    const newStreak = updateStreak();
    const bonus = getStreakBonus(newStreak);

    addStampToCard(partnerId, "checkin", undefined, bonus);
  };

  // ============================================================
  // INSTAGRAM STORY: 1 Stempel (max 4/Monat/Laden)
  // ============================================================
  const submitStory = (partnerId: string, instagramHandle: string) => {
    const remaining = getStoriesRemaining(partnerId);
    if (remaining <= 0) return;

    const month = currentMonth();

    // Update story limit locally
    setStoryLimits(prev => {
      const existing = prev.find(l => l.partnerId === partnerId && l.monthYear === month);
      if (existing) {
        return prev.map(l =>
          l.partnerId === partnerId && l.monthYear === month
            ? { ...l, storyCount: l.storyCount + 1 }
            : l
        );
      }
      return [...prev, { userId: profile.id, partnerId, monthYear: month, storyCount: 1 }];
    });

    addStampToCard(partnerId, "story", instagramHandle);

    // Supabase sync story limit
    if (useSupabase && auth.user) {
      supabase.from("story_limits").upsert({
        user_id: auth.user.id,
        partner_id: partnerId,
        month_year: month,
        story_count: (storyLimits.find(l => l.partnerId === partnerId && l.monthYear === month)?.storyCount || 0) + 1,
      }, { onConflict: "user_id,partner_id,month_year" });
    }
  };

  // ============================================================
  // CLAIM REWARD (when card is full)
  // ============================================================
  const claimReward = (partnerId: string) => {
    const card = stampCards.find(c => c.partnerId === partnerId && c.isCompleted && !c.rewardClaimed);
    const partner = partners.find(p => p.id === partnerId);
    if (!card || !partner) return;

    // Mark card as claimed
    setStampCards(prev =>
      prev.map(c =>
        c.id === card.id ? { ...c, rewardClaimed: true } : c
      )
    );

    // Add reward claim
    const claim: RewardClaim = {
      id: `rc-${Date.now()}`,
      userId: profile.id,
      partnerId,
      stampCardId: card.id,
      rewardTitle: partner.rewardTitle,
      claimedAt: new Date().toISOString(),
      status: "claimed",
    };
    setRewardClaims(prev => [claim, ...prev]);

    // Update profile
    setProfile(prev => ({
      ...prev,
      totalRewardsClaimed: prev.totalRewardsClaimed + 1,
    }));

    // Supabase sync
    if (useSupabase && auth.user) {
      supabase.from("stamp_cards").update({ reward_claimed: true }).eq("id", card.id);
      supabase.from("reward_claims").insert({
        user_id: auth.user.id,
        partner_id: partnerId,
        stamp_card_id: card.id,
        reward_title: partner.rewardTitle,
      });
      syncProfile({ total_rewards_claimed: profile.totalRewardsClaimed + 1 });
    }
  };

  // ============================================================
  // INVITE FRIEND: +1 Bonus-Stempel auf gewählte Karte
  // ============================================================
  const inviteFriend = (partnerId: string) => {
    addStampToCard(partnerId, "checkin", undefined, 0);
    // In production: validate via referral code on backend
  };

  // ============================================================
  // HELPERS
  // ============================================================
  const getStampCard = (partnerId: string): StampCard | undefined => {
    return stampCards.find(c => c.partnerId === partnerId && !c.rewardClaimed);
  };

  const getStoriesRemaining = (partnerId: string): number => {
    const month = currentMonth();
    const limit = storyLimits.find(l => l.partnerId === partnerId && l.monthYear === month);
    const used = limit?.storyCount || 0;
    return Math.max(0, STAMP_CONFIG.MAX_STORIES_PER_PARTNER_PER_MONTH - used);
  };

  const canCheckIn = (partnerId: string): boolean => {
    const lastCheckin = recentStamps.find(
      s => s.partnerId === partnerId && s.type === "checkin"
    );
    if (!lastCheckin) return true;
    const hoursSince = (Date.now() - new Date(lastCheckin.createdAt).getTime()) / (1000 * 60 * 60);
    return hoursSince >= STAMP_CONFIG.CHECKIN_COOLDOWN_HOURS;
  };

  return (
    <UserContext.Provider value={{
      profile,
      partners,
      stampCards,
      recentStamps,
      storyLimits,
      rewardClaims,
      isLoading,
      checkIn,
      submitStory,
      claimReward,
      inviteFriend,
      getStampCard,
      getStoriesRemaining,
      canCheckIn,
      refreshData,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
