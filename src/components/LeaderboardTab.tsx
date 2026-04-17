import React from "react";
import { motion } from "motion/react";
import { Trophy, Stamp, Flame } from "lucide-react";
import { useUser } from "../context/UserContext";

// Mock leaderboard data (will come from Supabase in production)
const MOCK_LEADERBOARD = [
  { rank: 1, username: "SaxonKing_C", stamps: 87, streak: 14 },
  { rank: 2, username: "ChemnitzExplorer", stamps: 64, streak: 9 },
  { rank: 3, username: "KarlsFan99", stamps: 52, streak: 7 },
  { rank: 4, username: "DönerQueen", stamps: 41, streak: 5 },
  { rank: 5, username: "NeumarktNinja", stamps: 28, streak: 3 },
  { rank: 6, username: "RoamingChemnitz", stamps: 15, streak: 2 },
];

const getRankBadge = (rank: number) => {
  if (rank === 1) return { bg: "bg-amber-100", text: "text-amber-600", emoji: "🥇" };
  if (rank === 2) return { bg: "bg-gray-100", text: "text-gray-600", emoji: "🥈" };
  if (rank === 3) return { bg: "bg-orange-100", text: "text-orange-600", emoji: "🥉" };
  return { bg: "bg-gray-50", text: "text-gray-400", emoji: "" };
};

const LeaderboardTab: React.FC = () => {
  const { profile } = useUser();

  return (
    <div className="flex flex-col min-h-full bg-[#EFF6FF]">
      <div className="flex flex-col items-center text-center px-6 pt-8 pb-6 gap-2">
        <Trophy size={32} className="text-amber-500" />
        <h2 className="text-xl font-black text-[#1A1A1A] tracking-tight">Chemnitz Ranking</h2>
        <p className="text-xs text-gray-400 font-bold">Wer sammelt die meisten Stempel?</p>
      </div>

      <div className="bg-white rounded-t-[32px] flex-1 px-5 py-6 flex flex-col gap-3 shadow-2xl">
        {/* Your Position */}
        <div className="bg-[#E63946]/5 border border-[#E63946]/20 rounded-2xl p-4 flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#E63946] flex items-center justify-center text-white font-black text-sm">
            {profile.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-[#1A1A1A]">{profile.username} (Du)</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-bold text-[#E63946] flex items-center gap-1">
                <Stamp size={12} /> {profile.totalStamps}
              </span>
              <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                <Flame size={12} /> {profile.streak}
              </span>
            </div>
          </div>
          <span className="text-xs font-black text-gray-400">#7</span>
        </div>

        {/* Leaderboard */}
        {MOCK_LEADERBOARD.map((entry, i) => {
          const badge = getRankBadge(entry.rank);
          return (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-2xl ${badge.bg}`}
            >
              <div className="w-8 text-center">
                {badge.emoji ? (
                  <span className="text-lg">{badge.emoji}</span>
                ) : (
                  <span className={`text-sm font-black ${badge.text}`}>#{entry.rank}</span>
                )}
              </div>
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-black text-sm text-gray-600 border border-gray-200">
                {entry.username.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-[#1A1A1A]">{entry.username}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold text-gray-400 flex items-center gap-0.5">
                    <Stamp size={10} /> {entry.stamps}
                  </span>
                  <span className="text-[10px] font-bold text-amber-400 flex items-center gap-0.5">
                    <Flame size={10} /> {entry.streak}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}

        <div className="h-20" />
      </div>
    </div>
  );
};

export default LeaderboardTab;
