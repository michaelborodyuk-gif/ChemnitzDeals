import React from "react";
import { motion } from "motion/react";
import { Stamp, Gift, Flame, MapPin, Trophy } from "lucide-react";
import { useUser } from "../../shared/context/UserContext";
import { CATEGORY_EMOJIS } from "../../shared/config/constants";

const ProfileTab: React.FC = () => {
  const { profile, stampCards, rewardClaims, partners, recentStamps } = useUser();

  const activeCards = stampCards.filter(c => !c.rewardClaimed && c.stamps > 0).length;
  const completedCards = stampCards.filter(c => c.isCompleted).length;
  const uniquePartners = new Set(recentStamps.map(s => s.partnerId)).size;

  return (
    <div className="flex flex-col min-h-full bg-[#FDF2F8]">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center px-6 pt-8 pb-6 gap-3">
        <div className="w-20 h-20 rounded-full bg-[#E63946] flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-red-200">
          {profile.username.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-xl font-black text-[#1A1A1A] tracking-tight">{profile.username}</h2>
        <div className="flex items-center gap-3">
          <div className="bg-[#E63946]/10 px-3 py-1 rounded-full flex items-center gap-1">
            <Flame size={14} className="text-[#E63946]" />
            <span className="text-xs font-black text-[#E63946]">{profile.streak} Tage</span>
          </div>
          <div className="bg-amber-100 px-3 py-1 rounded-full flex items-center gap-1">
            <Stamp size={14} className="text-amber-600" />
            <span className="text-xs font-black text-amber-600">{profile.totalStamps}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-t-[32px] flex-1 px-5 py-6 flex flex-col gap-6 shadow-2xl">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Stempel", value: profile.totalStamps, icon: Stamp, color: "text-[#E63946]" },
            { label: "Rewards", value: profile.totalRewardsClaimed, icon: Gift, color: "text-green-500" },
            { label: "Partner", value: uniquePartners, icon: MapPin, color: "text-blue-500" },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center gap-2">
              <stat.icon size={20} className={stat.color} />
              <span className="text-xl font-black text-[#1A1A1A]">{stat.value}</span>
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Active Cards */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-black text-[#1A1A1A] uppercase tracking-widest">Aktive Karten</h3>
          {stampCards.filter(c => !c.rewardClaimed && c.stamps > 0).length === 0 ? (
            <p className="text-xs text-gray-400 font-bold">Noch keine aktiven Stempelkarten.</p>
          ) : (
            stampCards
              .filter(c => !c.rewardClaimed && c.stamps > 0)
              .map(card => {
                const partner = partners.find(p => p.id === card.partnerId);
                if (!partner) return null;
                const pct = Math.round((card.stamps / partner.stampsNeeded) * 100);
                return (
                  <div key={card.id} className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                    <span className="text-2xl">{CATEGORY_EMOJIS[partner.category]}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-[#1A1A1A]">{partner.name}</span>
                        <span className="text-[10px] font-black text-gray-400">{card.stamps}/{partner.stampsNeeded}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          className={`h-full rounded-full ${card.isCompleted ? "bg-green-500" : "bg-[#E63946]"}`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>

        {/* Streak Info */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-amber-500" />
            <span className="text-sm font-black text-amber-800">Streak: {profile.streak} Tage</span>
          </div>
          <p className="text-xs text-amber-600">
            Checke jeden Tag ein, um deinen Streak zu halten. Alle 3 Tage bekommst du +1 Bonus-Stempel, alle 7 Tage +2!
          </p>
        </div>

        {/* Recent Claims */}
        {rewardClaims.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-black text-[#1A1A1A] uppercase tracking-widest">Letzte Rewards</h3>
            {rewardClaims.slice(0, 3).map(claim => {
              const partner = partners.find(p => p.id === claim.partnerId);
              return (
                <div key={claim.id} className="bg-gray-50 rounded-2xl p-3 flex items-center gap-3">
                  <Gift size={18} className="text-green-500" />
                  <div>
                    <p className="text-xs font-bold text-[#1A1A1A]">{claim.rewardTitle}</p>
                    <p className="text-[9px] text-gray-400">{partner?.name} · {new Date(claim.claimedAt).toLocaleDateString("de-DE")}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="h-20" />
      </div>
    </div>
  );
};

export default ProfileTab;
