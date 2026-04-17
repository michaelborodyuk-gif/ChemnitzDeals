import React from "react";
import { Store, Users, Stamp, Gift } from "lucide-react";
import { MOCK_PARTNERS } from "../constants";

const AdminDashboard: React.FC = () => {
  const stats = [
    { label: "Partner", value: MOCK_PARTNERS.length, icon: Store, color: "bg-blue-50 text-blue-600" },
    { label: "Nutzer", value: "—", icon: Users, color: "bg-green-50 text-green-600" },
    { label: "Stempel heute", value: "—", icon: Stamp, color: "bg-amber-50 text-amber-600" },
    { label: "Rewards eingelöst", value: "—", icon: Gift, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-black text-gray-900">Dashboard</h2>
      <p className="text-sm text-gray-500">Verbinde Supabase, um Live-Daten zu sehen.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-sm font-black text-gray-900 mb-4">Partner-Übersicht</h3>
        <div className="space-y-3">
          {MOCK_PARTNERS.map(p => (
            <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-bold text-gray-900">{p.name}</p>
                <p className="text-xs text-gray-400">{p.location} · {p.stampsNeeded} Stempel für Reward</p>
              </div>
              <span className="text-xs font-black text-[#E63946]">{p.rewardTitle}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
