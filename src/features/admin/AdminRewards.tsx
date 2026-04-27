import React from "react";
import { MOCK_PARTNERS, CATEGORY_EMOJIS } from "../../shared/config/constants";

const AdminRewards: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-black text-gray-900">Rewards Übersicht</h2>
      <p className="text-sm text-gray-500">Jeder Partner hat einen Reward, der nach dem Sammeln aller Stempel freigeschaltet wird.</p>
      <div className="grid gap-4">
        {MOCK_PARTNERS.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{CATEGORY_EMOJIS[p.category]}</span>
              <div>
                <p className="text-sm font-black text-gray-900">{p.name}</p>
                <p className="text-xs text-gray-400">{p.stampsNeeded} Stempel nötig</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-[#E63946]">{p.rewardTitle}</p>
              <p className="text-[10px] text-gray-400">{p.rewardDescription}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRewards;
