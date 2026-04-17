import React, { useState } from "react";
import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Store, Gift, Users, ClipboardList, LogOut, Menu, X } from "lucide-react";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/partners", icon: Store, label: "Partner" },
  { to: "/admin/rewards", icon: Gift, label: "Rewards" },
  { to: "/admin/users", icon: Users, label: "Nutzer" },
  { to: "/admin/claims", icon: ClipboardList, label: "Claims" },
];

const AdminLayout: React.FC = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-[#E63946] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E63946] rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-black">CD</span>
              </div>
              <div>
                <h1 className="text-sm font-black text-gray-900">Chemnitz Deals</h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin Panel</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 p-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive ? "bg-[#E63946] text-white shadow-lg shadow-red-500/20" : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="px-4 py-2 mb-2">
              <p className="text-xs font-bold text-gray-400 truncate">{user.email}</p>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 w-full"
            >
              <LogOut size={20} /> Abmelden
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between lg:justify-end">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl">
            <Menu size={24} />
          </button>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Admin</span>
        </header>
        <main className="flex-1 p-6"><Outlet /></main>
      </div>
    </div>
  );
};

export default AdminLayout;
