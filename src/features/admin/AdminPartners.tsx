import React from "react";
import { MOCK_PARTNERS, CATEGORY_EMOJIS } from "../../shared/config/constants";

const AdminPartners: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-gray-900">Partner verwalten</h2>
        <button className="bg-[#E63946] text-white px-4 py-2 rounded-xl text-sm font-bold">+ Neuer Partner</button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Partner</th>
              <th className="text-left px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Kategorie</th>
              <th className="text-left px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stempel</th>
              <th className="text-left px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reward</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PARTNERS.map(p => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span>{CATEGORY_EMOJIS[p.category]}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.location}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-xs font-bold text-gray-600 capitalize">{p.category}</td>
                <td className="px-5 py-3 text-xs font-black text-gray-900">{p.stampsNeeded}</td>
                <td className="px-5 py-3 text-xs font-bold text-[#E63946]">{p.rewardTitle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPartners;
