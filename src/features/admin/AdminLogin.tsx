import React, { useState } from "react";
import { useAuth } from "../../shared/context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminLogin: React.FC = () => {
  const { signIn, isAdmin, user, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-[#E63946] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#E63946] rounded-2xl mx-auto flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-black">CD</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Panel</h1>
            <p className="text-sm text-gray-500 mt-1">Chemnitz Deals Verwaltung</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">E-Mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E63946] focus:border-transparent outline-none text-sm"
                placeholder="admin@chemnitzdeals.de"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Passwort</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E63946] focus:border-transparent outline-none text-sm"
                placeholder="********"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            {user && !isAdmin && (
              <div className="bg-yellow-50 text-yellow-700 text-sm p-3 rounded-xl border border-yellow-100">
                Kein Admin-Zugang. Bitte mit einem Admin-Account anmelden.
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#E63946] text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-500/20 disabled:opacity-50 transition-all hover:bg-[#d32f3c]"
            >
              {loading ? "Anmelden..." : "Anmelden"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
