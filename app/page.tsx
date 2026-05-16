"use client";
export const dynamic = 'force-dynamic'
import { useState, useEffect } from "react";
import { THEMES, type Theme } from "../lib/themes";
import { getSupabase } from "../lib/supabase";
import { CHARACTERS } from "../lib/characters";
import { TRANSLATIONS } from "../lib/translations";
import { useAuth } from "../hooks/useAuth";
import { useChat } from "../hooks/useChat";
import { useImageGeneration } from "../hooks/useImageGeneration";
import { PremiumModal } from "../components/PremiumModal";
import { CharacterCard } from "../components/CharacterCard";
import { Header } from "../components/Header";
import { ChatWindow } from "../components/ChatWindow";

function detectLang(): string {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language?.toLowerCase() || "en";
  if (lang.startsWith("pl")) return "pl";
  if (lang.startsWith("nl")) return "nl";
  if (lang.startsWith("de")) return "de";
  if (lang.startsWith("fr")) return "fr";
  if (lang.startsWith("es")) return "es";
  if (lang.startsWith("ja")) return "ja";
  if (lang.startsWith("ko")) return "ko";
  if (lang.startsWith("zh")) return "zh";
  if (lang.startsWith("hi")) return "hi";
  return "en";
}

export default function Home() {
  const [theme, setTheme] = useState<Theme>("warm");
  const [filter, setFilter] = useState("all");
  const [paying, setPaying] = useState(false);
  const [lang, setLang] = useState("en");

  const { user, isPremium, signOut } = useAuth();
  const chat = useChat(lang, user?.id ?? null);
  const t = THEMES[theme];
  const T = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const supabase = getSupabase();
  const img = useImageGeneration({ user, isPremium, chat, T });

  useEffect(() => {
    const saved = localStorage.getItem("vl-theme") as Theme;
    if (saved && THEMES[saved]) setTheme(saved);
    setLang(detectLang());
  }, []);

  const filtered = CHARACTERS.filter(c => {
    if (filter === "all") return true;
    if (filter === "premium") return c.premium;
    if (filter === "free") return !c.premium;
    if (filter === "m") return c.gender === "m";
    if (filter === "f") return c.gender === "f";
    return true;
  });

  async function startCheckout(plan: "monthly" | "yearly") {
    if (!user) {
      alert("Please sign in first to subscribe.");
      return;
    }
    setPaying(true);
    try {
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, userId: user.id })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Payment error. Please try again.");
    } catch {
      alert("Payment error. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  async function manageSubscription() {
    if (!user) return;
    try {
      const res = await fetch("/api/customer-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Could not open portal. Please try again.");
    } catch {
      alert("Could not open portal. Please try again.");
    }
  }

  const isDark = theme === "dark" || theme === "dusk";

  return (
    <div style={{ background: t.bg, color: t.text, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", transition: "background 0.4s, color 0.4s" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      <Header
        t={t}
        T={T}
        theme={theme}
        setTheme={setTheme}
        isDark={isDark}
        user={user}
        isPremium={isPremium}
        signOut={signOut}
        onPremiumClick={() => chat.setShowPremium(true)}
        onManageClick={manageSubscription}
      />

      <section style={{ paddingTop: 110, paddingBottom: 48, textAlign: "center", background: "linear-gradient(180deg, " + t.bg + " 0%, " + t.bg2 + " 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, background: "radial-gradient(circle, " + t.glow + " 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: t.text2, marginBottom: "1rem" }}>{T.tagline}</div>
        <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2.4rem, 5vw, 4.5rem)", fontWeight: 300, lineHeight: 1.1, marginBottom: "1rem", letterSpacing: "0.03em" }}>
          {T.hero1}<br /><em style={{ fontStyle: "italic", color: t.accent }}>{T.hero2}</em>
        </h1>
        <p style={{ color: t.text2, fontSize: "0.95rem", fontWeight: 300, maxWidth: 440, margin: "0 auto 2rem", lineHeight: 1.75 }}>{T.heroDesc}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "2.5rem", flexWrap: "wrap", padding: "0 1rem" }}>
          {[["24/7", T.availability],["100%", T.privacy],["∞", T.patience]].map(([n,l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.7rem", fontWeight: 400, color: t.accent }}>{n}</div>
              <div style={{ fontSize: "0.68rem", color: t.text2, letterSpacing: "0.08em", textTransform: "uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "20px 1rem 16px", flexWrap: "wrap" }}>
        {([["all", T.everyone],["f", T.women],["m", T.men],["free", T.free],["premium", T.premium]] as [string,string][]).map(([f,l]) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ background: filter === f ? t.accent : t.card, border: "0.5px solid " + (filter === f ? t.accent : t.border), color: filter === f ? "#fff" : t.text2, padding: "6px 18px", borderRadius: 20, fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s" }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.2rem", padding: "0 1rem 5rem", maxWidth: 1200, margin: "0 auto" }}>
        {filtered.map(char => (
          <CharacterCard
            key={char.id}
            char={char}
            t={t}
            T={T}
            isDark={isDark}
            onOpen={chat.openChat}
          />
        ))}
      </div>

      <ChatWindow
        chat={chat}
        img={img}
        t={t}
        T={T}
        user={user}
        isPremium={isPremium}
        remaining={chat.remaining ?? 0}
      />

      <PremiumModal
        show={chat.showPremium}
        onClose={() => chat.setShowPremium(false)}
        t={t}
        T={T}
        isDark={isDark}
        paying={paying}
        startCheckout={startCheckout}
        limitHit={chat.limitHit}
        hoursLeft={chat.hoursLeft}
      />

      <footer style={{ textAlign: "center", padding: "2rem", color: t.text2, fontSize: "0.72rem", borderTop: "0.5px solid " + t.border, letterSpacing: "0.05em" }}>
  <div style={{ marginBottom: "0.5rem" }}>
    <a href="/terms" style={{ color: t.text2, textDecoration: "none", marginRight: "1.5rem" }}>Terms of Service</a>
    <a href="/privacy" style={{ color: t.text2, textDecoration: "none" }}>Privacy Policy</a>
  </div>
  {T.footer}
</footer>

      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}