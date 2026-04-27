import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

// ── Dev credentials (works without Supabase) ──
const DEV_ADMIN_EMAIL = "admin@chemnitzdeals.de";
const DEV_ADMIN_PASSWORD = "admin";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fake user object for dev mode
const DEV_USER = { id: "dev-admin", email: DEV_ADMIN_EMAIL } as User;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [devUser, setDevUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if dev admin was logged in before
    const devLoggedIn = localStorage.getItem("cd_dev_admin");
    if (devLoggedIn === "true") {
      setDevUser(DEV_USER);
      setIsAdmin(true);
      setIsLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) checkAdmin(session.user.id);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        checkAdmin(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdmin = async (userId: string) => {
    if (!isSupabaseConfigured) return;
    const { data } = await supabase
      .from("users")
      .select("is_admin")
      .eq("id", userId)
      .single();
    setIsAdmin(data?.is_admin ?? false);
  };

  const signIn = async (email: string, password: string) => {
    // Dev mode login
    if (email === DEV_ADMIN_EMAIL && password === DEV_ADMIN_PASSWORD) {
      setDevUser(DEV_USER);
      setIsAdmin(true);
      localStorage.setItem("cd_dev_admin", "true");
      return { error: null };
    }

    // Also accept any email with "admin" password in dev mode
    if (!isSupabaseConfigured && password === DEV_ADMIN_PASSWORD) {
      setDevUser({ ...DEV_USER, email } as User);
      setIsAdmin(true);
      localStorage.setItem("cd_dev_admin", "true");
      return { error: null };
    }

    if (!isSupabaseConfigured) return { error: "Falsches Passwort. Dev-Login: Passwort = 'admin'" };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string, username: string) => {
    if (!isSupabaseConfigured) return { error: "Registrierung benötigt Supabase" };
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };

    if (data.user) {
      await supabase.from("users").insert({
        id: data.user.id,
        username,
        balance: 0,
      });
    }
    return { error: null };
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setDevUser(null);
    setIsAdmin(false);
    localStorage.removeItem("cd_dev_admin");
  };

  return (
    <AuthContext.Provider value={{
      session,
      user: devUser ?? session?.user ?? null,
      isAdmin,
      isLoading,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
