import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Instagram, Flame, Gift, ChevronRight, UserPlus, Check, X } from "lucide-react";
import { useUser } from "../context/UserContext";
import { CATEGORY_EMOJIS, CATEGORY_LABELS, MOCK_TIPS } from "../constants";
import Logo from "./Logo";

// ============================================================
// STAMP CARD VISUAL
// ============================================================
const StampDots: React.FC<{ stamps: number; total: number }> = ({ stamps, total }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          initial={i === stamps - 1 ? { scale: 0 } : false}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            i < stamps
              ? "bg-[#E63946] border-[#E63946] text-white shadow-lg shadow-red-200"
              : "bg-white border-gray-200"
          }`}
        >
          {i < stamps && <Check size={14} strokeWidth={3} />}
        </motion.div>
      ))}
    </div>
  );
};

// ============================================================
// MAIN TAB
// ============================================================
const StampCardTab: React.FC = () => {
  const {
    profile,
    partners,
    stampCards,
    recentStamps,
    checkIn,
    submitStory,
    claimReward,
    getStampCard,
    getStoriesRemaining,
    canCheckIn,
    inviteFriend,
  } = useUser();

  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [storyModal, setStoryModal] = useState<{ isOpen: boolean; partnerId: string | null }>({ isOpen: false, partnerId: null });
  const [inviteModal, setInviteModal] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const selectedPartner = selectedPartnerId ? partners.find(p => p.id === selectedPartnerId) : null;
  const selectedCard = selectedPartnerId ? getStampCard(selectedPartnerId) : undefined;

  // Stats
  const totalStamps = profile.totalStamps;
  const activeCards = stampCards.filter(c => !c.rewardClaimed && c.stamps > 0).length;
  const completedCards = stampCards.filter(c => c.isCompleted && !c.rewardClaimed).length;

  return (
    <div className="flex flex-col min-h-full bg-[#FFFBEB]">
      {/* Hero */}
      <div className="flex flex-col items-center text-center px-6 pt-8 pb-6 gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-[#E63946] text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg shadow-red-200">
            <Flame size={18} />
            <span className="text-sm font-black">{profile.streak} Tage Streak</span>
          </div>
        </div>

        <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tight mt-2">
          {totalStamps} Stempel
        </h1>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {activeCards} aktive Karten · {completedCards > 0 && `${completedCards} bereit zum Einlösen!`}
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-t-[32px] flex-1 px-5 py-6 flex flex-col gap-6 shadow-2xl">

        {/* Quick Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setInviteModal(true)}
            className="flex-1 bg-purple-50 border border-purple-100 rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-[1.02] transition-transform"
          >
            <UserPlus size={22} className="text-purple-500" />
            <span className="text-[9px] font-black text-purple-700 uppercase tracking-widest">Freund einladen</span>
            <span className="text-[8px] font-bold text-purple-400">+1 Bonus-Stempel</span>
          </button>
          <button
            onClick={() => {
              setTipIndex(prev => (prev + 1) % MOCK_TIPS.length);
            }}
            className="flex-1 bg-amber-50 border border-amber-100 rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-[1.02] transition-transform"
          >
            <span className="text-2xl">💡</span>
            <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest">Tipp</span>
            <span className="text-[8px] font-bold text-amber-500 text-center leading-tight">{MOCK_TIPS[tipIndex]}</span>
          </button>
        </div>

        {/* Completed Cards Banner */}
        {completedCards > 0 && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Gift size={22} className="text-green-600" />
              <div>
                <p className="text-sm font-black text-green-800">{completedCards} Reward{completedCards > 1 ? "s" : ""} bereit!</p>
                <p className="text-[10px] text-green-600 font-bold">Karte voll — jetzt einlösen</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-green-400" />
          </motion.div>
        )}

        {/* Partner Cards Grid */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-black text-[#1A1A1A] uppercase tracking-widest">
            Deine Stempelkarten
          </h3>

          <div className="flex flex-col gap-3">
            {partners.map(partner => {
              const card = getStampCard(partner.id);
              const stamps = card?.stamps || 0;
              const isCompleted = card?.isCompleted || false;
              const storiesLeft = getStoriesRemaining(partner.id);
              const canDoCheckIn = canCheckIn(partner.id);
              const progress = Math.round((stamps / partner.stampsNeeded) * 100);

              return (
                <motion.button
                  key={partner.id}
                  onClick={() => setSelectedPartnerId(partner.id)}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    isCompleted
                      ? "bg-green-50 border-green-200 shadow-md shadow-green-100"
                      : stamps > 0
                      ? "bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-[#E63946]/30"
                      : "bg-gray-50 border-gray-100 hover:bg-white hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{CATEGORY_EMOJIS[partner.category]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-[#1A1A1A] truncate">{partner.name}</h4>
                        <span className={`text-xs font-black ${isCompleted ? "text-green-600" : "text-gray-400"}`}>
                          {stamps}/{partner.stampsNeeded}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className={`h-full rounded-full ${isCompleted ? "bg-green-500" : "bg-[#E63946]"}`}
                          />
                        </div>
                        {storiesLeft > 0 && (
                          <span className="text-[8px] font-bold text-pink-400 flex items-center gap-0.5">
                            <Instagram size={10} /> {storiesLeft}
                          </span>
                        )}
                      </div>
                      {isCompleted && (
                        <p className="text-[10px] font-black text-green-600 mt-1 uppercase tracking-wider">
                          🎉 {partner.rewardTitle} bereit!
                        </p>
                      )}
                    </div>
                    <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        {recentStamps.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-black text-[#1A1A1A] uppercase tracking-widest">
              Letzte Stempel
            </h3>
            <div className="flex flex-col gap-2">
              {recentStamps.slice(0, 5).map(stamp => {
                const p = partners.find(pp => pp.id === stamp.partnerId);
                return (
                  <div key={stamp.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{p ? CATEGORY_EMOJIS[p.category] : "📍"}</span>
                      <div>
                        <p className="text-xs font-bold text-[#1A1A1A]">{p?.name || "Unbekannt"}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                          {stamp.type === "checkin" ? "Check-in" : "Story"} · {new Date(stamp.createdAt).toLocaleDateString("de-DE")}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm">
                      {stamp.type === "checkin" ? "📍" : "📸"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="h-20" />
      </div>

      {/* ── Partner Detail Sheet ── */}
      <AnimatePresence>
        {selectedPartner && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPartnerId(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[110] max-h-[85vh] overflow-y-auto"
            >
              <div className="p-6 flex flex-col gap-5">
                {/* Handle */}
                <div className="flex justify-center">
                  <div className="w-10 h-1 bg-gray-200 rounded-full" />
                </div>

                {/* Partner Info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{CATEGORY_EMOJIS[selectedPartner.category]}</span>
                    <div>
                      <h2 className="text-xl font-black text-[#1A1A1A]">{selectedPartner.name}</h2>
                      <p className="text-xs text-gray-400 font-bold">{selectedPartner.location}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedPartnerId(null)} className="p-2 rounded-full bg-gray-100">
                    <X size={18} className="text-gray-400" />
                  </button>
                </div>

                {/* Stamp Card Visual */}
                <div className="bg-gray-50 rounded-2xl p-5 flex flex-col gap-4 items-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {selectedCard?.stamps || 0} von {selectedPartner.stampsNeeded} Stempeln
                  </p>
                  <StampDots
                    stamps={selectedCard?.stamps || 0}
                    total={selectedPartner.stampsNeeded}
                  />
                  <p className="text-xs font-bold text-[#E63946] text-center mt-1">
                    🎁 Reward: {selectedPartner.rewardTitle}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  {/* Check-in Button */}
                  <button
                    onClick={() => {
                      checkIn(selectedPartner.id);
                      // Keep sheet open to see result
                    }}
                    disabled={!canCheckIn(selectedPartner.id)}
                    className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all ${
                      canCheckIn(selectedPartner.id)
                        ? "bg-[#E63946] text-white shadow-lg shadow-red-200 active:scale-[0.98]"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <MapPin size={18} />
                    {canCheckIn(selectedPartner.id) ? "Check-in → +1 Stempel" : "Check-in Cooldown (20h)"}
                  </button>

                  {/* Story Button */}
                  {getStoriesRemaining(selectedPartner.id) > 0 ? (
                    <button
                      onClick={() => setStoryModal({ isOpen: true, partnerId: selectedPartner.id })}
                      className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-pink-200 active:scale-[0.98]"
                    >
                      <Instagram size={18} />
                      Story posten → +1 Stempel
                      <span className="text-[10px] opacity-80 ml-1">
                        ({getStoriesRemaining(selectedPartner.id)} übrig)
                      </span>
                    </button>
                  ) : (
                    <div className="w-full py-3 rounded-2xl bg-gray-100 text-gray-400 text-center text-xs font-bold">
                      Story-Limit erreicht (max 4/Monat)
                    </div>
                  )}

                  {/* Claim Reward */}
                  {selectedCard?.isCompleted && !selectedCard.rewardClaimed && (
                    <motion.button
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      onClick={() => {
                        claimReward(selectedPartner.id);
                        setSelectedPartnerId(null);
                      }}
                      className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 bg-green-500 text-white shadow-lg shadow-green-200 animate-pulse"
                    >
                      <Gift size={18} />
                      {selectedPartner.rewardTitle} einlösen!
                    </motion.button>
                  )}
                </div>

                {/* Partner Facts */}
                {selectedPartner.briefFacts.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Über den Laden</h4>
                    {selectedPartner.briefFacts.map((fact, i) => (
                      <p key={i} className="text-xs text-gray-600 flex items-start gap-2">
                        <span className="text-[#E63946] font-black">·</span> {fact}
                      </p>
                    ))}
                  </div>
                )}

                {/* Streak Info */}
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3">
                  <Flame size={20} className="text-amber-500" />
                  <div>
                    <p className="text-xs font-black text-amber-800">Streak-Bonus</p>
                    <p className="text-[10px] text-amber-600">3 Tage = +1 Bonus · 7 Tage = +2 Bonus</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Story Submit Modal ── */}
      <AnimatePresence>
        {storyModal.isOpen && storyModal.partnerId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setStoryModal({ isOpen: false, partnerId: null })}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[160] p-6"
            >
              <div className="flex flex-col gap-5">
                <div className="flex justify-center"><div className="w-10 h-1 bg-gray-200 rounded-full" /></div>
                <h3 className="text-lg font-black text-[#1A1A1A] text-center">Instagram Story posten</h3>
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  Poste eine Story in diesem Laden mit dem Location-Tag und bekomme 1 Stempel!
                </p>
                <div className="bg-pink-50 border border-pink-100 rounded-2xl p-4 text-center">
                  <p className="text-xs font-bold text-pink-600">
                    @{partners.find(p => p.id === storyModal.partnerId)?.instagram}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const partner = partners.find(p => p.id === storyModal.partnerId);
                    if (partner) submitStory(partner.id, partner.instagram);
                    setStoryModal({ isOpen: false, partnerId: null });
                  }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black uppercase tracking-widest text-sm shadow-lg"
                >
                  Story gepostet — Stempel abholen
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Invite Modal ── */}
      <AnimatePresence>
        {inviteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInviteModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[160] p-6"
            >
              <div className="flex flex-col gap-5 items-center">
                <div className="w-10 h-1 bg-gray-200 rounded-full" />
                <UserPlus size={40} className="text-purple-500" />
                <h3 className="text-lg font-black text-[#1A1A1A]">Freund einladen</h3>
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  Teile deinen Einladungslink. Wenn dein Freund sich anmeldet, bekommst du 1 Bonus-Stempel auf die Karte deiner Wahl!
                </p>
                <button
                  onClick={() => {
                    // Copy invite link to clipboard
                    navigator.clipboard?.writeText(`https://chemnitzdeals.de/invite/${profile.id}`);
                    setInviteModal(false);
                  }}
                  className="w-full py-4 rounded-2xl bg-purple-500 text-white font-black uppercase tracking-widest text-sm shadow-lg"
                >
                  Link kopieren
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StampCardTab;
