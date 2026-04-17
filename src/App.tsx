import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, Bell, Stamp, Gift, User, Trophy } from "lucide-react";
import Sidebar from "./components/Sidebar";
import StampCardTab from "./components/StampCardTab";
import RewardsTab from "./components/RewardsTab";
import ProfileTab from "./components/ProfileTab";
import LeaderboardTab from "./components/LeaderboardTab";
import Logo from "./components/Logo";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider, useUser } from "./context/UserContext";

// Admin imports
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminPartners from "./admin/AdminPartners";
import AdminRewards from "./admin/AdminRewards";
import AdminUsers from "./admin/AdminUsers";
import AdminClaims from "./admin/AdminClaims";

function UserAppContent() {
  const [activeTab, setActiveTab] = useState("stamps");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { profile } = useUser();

  const getTabBackground = () => {
    switch (activeTab) {
      case "stamps": return "bg-[#FFFBEB]";
      case "rewards": return "bg-white";
      case "profile": return "bg-[#FDF2F8]";
      case "leaderboard": return "bg-[#EFF6FF]";
      default: return "bg-white";
    }
  };

  const navItems = [
    { id: "stamps", label: "STEMPEL", icon: Stamp },
    { id: "rewards", label: "REWARDS", icon: Gift },
    { id: "profile", label: "PROFIL", icon: User },
    { id: "leaderboard", label: "RANKING", icon: Trophy },
  ];

  return (
    <div className={`min-h-screen ${getTabBackground()} transition-colors duration-500 flex flex-col font-sans text-[#1A1A1A] overflow-x-hidden`}>
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Menu size={22} className="text-[#1A1A1A]" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
            <Bell size={22} className="text-[#1A1A1A]" />
          </button>
        </div>

        <Logo size="sm" />

        <div className="flex items-center gap-2 bg-[#E63946]/10 px-3 py-1.5 rounded-full">
          <span className="text-sm font-black text-[#E63946]">
            {profile.totalStamps}
          </span>
          <Stamp size={16} className="text-[#E63946]" />
        </div>
      </header>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 pt-14 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="h-full"
          >
            {activeTab === "stamps" && <StampCardTab />}
            {activeTab === "rewards" && <RewardsTab />}
            {activeTab === "profile" && <ProfileTab />}
            {activeTab === "leaderboard" && <LeaderboardTab />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-100 z-50 flex items-center justify-around px-2 pb-safe">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 flex-1 transition-all duration-300 ${
              activeTab === item.id ? "text-[#E63946] scale-110" : "text-gray-400"
            }`}
          >
            <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function UserApp() {
  return (
    <UserProvider>
      <UserAppContent />
    </UserProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<UserApp />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="partners" element={<AdminPartners />} />
                <Route path="rewards" element={<AdminRewards />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="claims" element={<AdminClaims />} />
              </Route>
            </Routes>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
