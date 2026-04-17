import React from "react";
import { ClipboardList } from "lucide-react";

const AdminClaims: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-black text-gray-900">Reward Claims</h2>
      <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col items-center gap-4 text-center">
        <ClipboardList size={40} className="text-gray-200" />
        <p className="text-sm font-bold text-gray-400">Verbinde Supabase, um Claims zu sehen.</p>
        <p className="text-xs text-gray-300">Hier werden alle eingelösten Rewards angezeigt.</p>
      </div>
    </div>
  );
};

export default AdminClaims;
