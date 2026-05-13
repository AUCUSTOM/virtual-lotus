"use client";
import { useState, useEffect } from "react";
import { getSupabase } from "../lib/supabase";

type User = { id: string } | null;

export function useAuth() {
  const [user, setUser] = useState<User>(null);
  const [isPremium, setIsPremium] = useState(false);
  const supabase = getSupabase();

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("plan_id, is_premium, subscription_status")
      .eq("id", userId)
      .single();
    if (data) {
      const active =
        data.plan_id === "pro_monthly" ||
        data.plan_id === "pro_yearly" ||
        data.is_premium === true;
      setIsPremium(active);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setIsPremium(false);
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase.auth.getSession().then((result: any) => {
      const session = result?.data?.session;
      console.log("🔐 getSession:", session?.user?.id ?? "NO USER");
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setUser(session?.user ?? null);
        if (session?.user) loadProfile(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setIsPremium(false);
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, isPremium, signOut };
}