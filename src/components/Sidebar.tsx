import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Stamp, Trophy, Gift, User, Settings, LogOut, Bell, Flame } from "lucide-react";
import { useUser } from "../context/UserContext";
import Logo from "./Logo";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeTab, setActiveTab }) => {
  const { profile } = useUser();

  const menuItems = [
    { id: "stamps", label: "Stempel", icon: Stamp },
    { id: "rewards", label: "Rewards", icon: Gift },
    { id: "profile", label: "Profil", icon: User },
    { id: "leaderboard", label: "Ranking", icon: Trophy },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b border-gray-100">
              <Logo size="sm" />
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={22} className="text-gray-400" />
              </button>
            </div>

            {/* User Summary */}
            <div className="p-5 bg-gray-50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E63946] flex items-center justify-center text-white font-black text-lg">
                {profile.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-[#1A1A1A]">{profile.username}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-bold text-[#E63946]">{profile.totalStamps} Stempel</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                    <Flame size={12} /> {profile.streak}
                  </span>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); onClose(); }}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${
                    activeTab === item.id
                      ? "bg-[#E63946] text-white shadow-lg shadow-red-200"
                      : "text-[#1A1A1A] hover:bg-gray-50"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
                </button>
              ))}

              <div className="my-4 border-t border-gray-100" />

              <button className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[#1A1A1A] hover:bg-gray-50">
                <Bell size={20} className="text-gray-400" />
                <span className="text-sm font-bold uppercase tracking-widest">Benachrichtigungen</span>
              </button>
              <button className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[#1A1A1A] hover:bg-gray-50">
                <Settings size={20} className="text-gray-400" />
                <span className="text-sm font-bold uppercase tracking-widest">Einstellungen</span>
              </button>
            </nav>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100">
              <button className="flex items-center gap-4 px-4 py-3 w-full rounded-2xl text-red-500 hover:bg-red-50">
                <LogOut size={20} />
                <span className="text-sm font-black uppercase tracking-widest">Abmelden</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
