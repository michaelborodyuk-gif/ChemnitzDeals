import React from "react";
import { motion } from "motion/react";
import { Gift } from "lucide-react";
import { useUser } from "../context/UserContext";
import { CATEGORY_EMOJIS } from "../constants";

const RewardsTab: React.FC = () => {
  const { partners, rewardClaims, claimReward, getStampCard } = useUser();

  const readyToClaim = partners.filter(p => {
    const card = getStampCard(p.id);
    return card?.isCompleted && !card.rewardClaimed;
  });

  const inProgress = partners.filter(p => {
    const card = getStampCard(p.id);
    return card && card.stamps > 0 && !card.isCompleted;
  });

  const claimed = rewardClaims.filter(c => c.status === "claimed" || c.status === "redeemed");

  return (
    <div className="flex flex-col min-h-full bg-white">
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-xl font-black text-[#1A1A1A] tracking-tight">Rewards</h2>
        <p className="text-xs text-gray-400 font-bold mt-1">Sammle Stempel, löse Rewards ein</p>
      </div>

      <div className="px-5 flex flex-col gap-6 pb-28">
        {readyToClaim.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] font-black text-green-600 uppercase tracking-widest">Bereit zum Einlösen</h3>
            {readyToClaim.map(partner => (
              <motion.div
                key={partner.id}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{CATEGORY_EMOJIS[partner.category]}</span>
                  <div>
                    <p className="text-sm font-black text-[#1A1A1A]">{partner.rewardTitle}</p>
                    <p className="text-[10px] font-bold text-gray-400">{partner.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => claimReward(partner.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-green-200"
                >
                  Einlösen
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {inProgress.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">In Arbeit</h3>
            {inProgress.map(partner => {
              const card = getStampCard(partner.id)!;
              const pct = Math.round((card.stamps / partner.stampsNeeded) * 100);
              return (
                <div key={partner.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center gap-3">
                  <span className="text-2xl">{CATEGORY_EMOJIS[partner.category]}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-[#1A1A1A]">{partner.name}</p>
                      <p className="text-[10px] font-black text-gray-400">{card.stamps}/{partner.stampsNeeded}</p>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        className="h-full bg-[#E63946] rounded-full"
                      />
                    </div>
                    <p className="text-[9px] text-gray-400 font-bold mt-1">🎁 {partner.rewardTitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {claimed.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Eingelöste Rewards</h3>
            {claimed.map(claim => {
              const partner = partners.find(p => p.id === claim.partnerId);
              return (
                <div key={claim.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center gap-3 opacity-60">
                  <span className="text-2xl">{partner ? CATEGORY_EMOJIS[partner.category] : "🎁"}</span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#1A1A1A]">{claim.rewardTitle}</p>
                    <p className="text-[9px] text-gray-400 font-bold">
                      {partner?.name} · {new Date(claim.claimedAt).toLocaleDateString("de-DE")}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider ${
                    claim.status === "redeemed" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                  }`}>
                    {claim.status === "redeemed" ? "Eingelöst" : "Bereit"}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {readyToClaim.length === 0 && inProgress.length === 0 && claimed.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <Gift size={48} className="text-gray-200" />
            <p className="text-sm font-black text-gray-400">Noch keine Stempel</p>
            <p className="text-xs text-gray-300">Check ein bei einem Laden und starte deine erste Karte!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsTab;
