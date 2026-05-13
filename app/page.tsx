"use client";
export const dynamic = 'force-dynamic'
import { useState, useRef, useEffect } from "react";
import { THEMES, type Theme } from "../lib/themes";
import { getSupabase } from "../lib/supabase";
import { CHARACTERS, type Character } from "../lib/characters";
import { TRANSLATIONS } from "../lib/translations";
import { useAuth } from "../hooks/useAuth";
import { useChat } from "../hooks/useChat";
import { useImageGeneration } from "../hooks/useImageGeneration";
import { PremiumModal } from "../components/PremiumModal";
import { CharacterCard } from "../components/CharacterCard";
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
type Msg = { role: "user" | "ai"; text?: string; imageUrl?: string };
const MAX_FREE = 15;
const MAX_PREMIUM_PREVIEW = 5;
export default function Home() {
  const [theme, setTheme] = useState<Theme>("warm");
  const [filter, setFilter] = useState("all");
  
  const [paying, setPaying] = useState(false);
  
  const [lang, setLang] = useState("en");
  
  const { user, isPremium, signOut } = useAuth();
  const chat = useChat(lang);
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
    setPaying(true);
    try {
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan })
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

  const maxForCurrent = chat.chatChar?.premium ? MAX_PREMIUM_PREVIEW : MAX_FREE;
  const remaining = maxForCurrent - chat.msgCount;
  const themeColors: Record<Theme, string> = { warm: "#e8d5c0", dark: "#2a2420", rose: "#f0d0da", sage: "#c8dcc8", dusk: "#2a2040" };
  const isDark = theme === "dark" || theme === "dusk";

  return (
    <div style={{ background: t.bg, color: t.text, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", transition: "background 0.4s, color 0.4s" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: t.bg + "f0", backdropFilter: "blur(24px)", borderBottom: "0.5px solid " + t.border, height: "auto", minHeight: 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", paddingTop: "max(8px, env(safe-area-inset-top))", paddingBottom: "8px", paddingLeft: "max(1rem, env(safe-area-inset-left))", paddingRight: "max(1rem, env(safe-area-inset-right))" }}>
        <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.4rem", fontWeight: 300, letterSpacing: "0.12em", color: t.accent, flexShrink: 0 }}>
          Virtual<span style={{ fontStyle: "italic", color: t.text2 }}>Lotus</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 6, background: t.surface, border: "0.5px solid " + t.border, borderRadius: 24, padding: "5px 8px" }}>
            {(Object.keys(THEMES) as Theme[]).map(th => (
              <button key={th} onClick={() => { setTheme(th); localStorage.setItem("vl-theme", th); }} title={th}
                style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid " + (theme === th ? t.accent : "transparent"), cursor: "pointer", background: themeColors[th], transition: "all 0.2s", outline: "none" }} />
            ))}
          </div>
          {user ? (
            <button onClick={signOut}
              style={{ background: "transparent", border: "0.5px solid " + t.border, color: t.text2, padding: "7px 14px", borderRadius: 20, fontFamily: "DM Sans, sans-serif", fontSize: "0.78rem", cursor: "pointer", whiteSpace: "nowrap" }}>
              {T.signOut}
            </button>
          ) : (
            <button onClick={() => window.location.href = "/auth"}
              style={{ background: "transparent", border: "0.5px solid " + t.border, color: t.text2, padding: "7px 14px", borderRadius: 20, fontFamily: "DM Sans, sans-serif", fontSize: "0.78rem", cursor: "pointer", whiteSpace: "nowrap" }}>
              {T.signIn}
            </button>
          )}
          <button onClick={() => chat.setShowPremium(true)}
            style={{ background: "linear-gradient(135deg, " + t.accent2 + ", " + t.premium + ")", color: isDark ? "#1a1000" : "#fff", border: "none", padding: "7px 16px", borderRadius: 20, fontFamily: "DM Sans, sans-serif", fontSize: "0.78rem", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
            ✦ Premium
          </button>
        </div>
      </header>

      <section style={{ paddingTop: 110, paddingBottom: 48, textAlign: "center", background: "linear-gradient(180deg, " + t.bg + " 0%, " + t.bg2 + " 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, background: "radial-gradient(circle, " + t.glow + " 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: t.text2, marginBottom: "1rem" }}>{T.tagline}</div>
        <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2.4rem, 5vw, 4.5rem)", fontWeight: 300, lineHeight: 1.1, marginBottom: "1rem", letterSpacing: "0.03em" }}>
          {T.hero1}<br /><em style={{ fontStyle: "italic", color: t.accent }}>{T.hero2}</em>
        </h1>
        <p style={{ color: t.text2, fontSize: "0.95rem", fontWeight: 300, maxWidth: 440, margin: "0 auto 2rem", lineHeight: 1.75 }}>{T.heroDesc}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "2.5rem", flexWrap: "wrap", padding: "0 1rem" }}>
          {[["24/7", T.availability],["100%", T.privacy],["50+", T.languages],["∞", T.patience]].map(([n,l]) => (
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

      {chat.chatChar && (
        <div onClick={e => { if (e.target === e.currentTarget) chat.setChatChar(null); }}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: "env(safe-area-inset-bottom)" }}>
          <div style={{ background: t.bg2, border: "0.5px solid " + t.border, borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 540, height: "88dvh", maxHeight: 680, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "1.2rem 1.5rem", borderBottom: "0.5px solid " + t.border, display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: t.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", overflow: "hidden" }}>
                {chat.chatChar.avatar.startsWith("/") ? <img src={chat.chatChar.avatar} alt={chat.chatChar.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : chat.chatChar.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem" }}>{chat.chatChar.name}</div>
                <div style={{ fontSize: "0.72rem", color: t.accent }}>{T.online}</div>
              </div>
              <button onClick={() => chat.setChatChar(null)} style={{ background: t.surface, border: "0.5px solid " + t.border, color: t.text2, width: 34, height: 34, borderRadius: "50%", cursor: "pointer", fontSize: "0.9rem" }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "1.2rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {chat.messages.map((msg, i) => (
                <div key={i} style={{ maxWidth: "80%", alignSelf: msg.role === "ai" ? "flex-start" : "flex-end" }}>
                  {msg.imageUrl ? (
                    <img src={msg.imageUrl} alt="generated" style={{ width: "100%", borderRadius: 16, border: "0.5px solid " + t.border, display: "block" }} />
                  ) : (
                    <div style={{ padding: "0.75rem 1rem", borderRadius: msg.role === "ai" ? "16px 16px 16px 4px" : "16px 16px 4px 16px", fontSize: "0.86rem", lineHeight: 1.65, background: msg.role === "ai" ? t.card : t.accent, color: msg.role === "ai" ? t.text : "#fff", border: msg.role === "ai" ? "0.5px solid " + t.border : "none" }}>
                      {msg.text}
                    </div>
                  )}
                </div>
              ))}
              {(chat.loading || img.generatingImage) && (
                <div style={{ display: "flex", gap: 4, padding: "0.75rem 1rem", background: t.card, border: "0.5px solid " + t.border, borderRadius: "16px 16px 16px 4px", alignSelf: "flex-start" }}>
                  {[0, 0.2, 0.4].map((d, i) => <div key={i} style={{ width: 6, height: 6, background: t.text2, borderRadius: "50%", animation: "bounce 1.2s " + d + "s infinite" }} />)}
                </div>
              )}
              {chat.limitHit && (
                <div style={{ textAlign: "center", background: "rgba(196,168,130,0.1)", border: "0.5px solid " + t.accent2, borderRadius: 12, padding: "1rem", fontSize: "0.8rem", color: t.premium }}>
                  ✦ {chat.hoursLeft ? (chat.chatChar.premium ? T.limitPremium(chat.hoursLeft) : T.limitFree(chat.hoursLeft)) : T.limitFree(24)}
                </div>
              )}
              <div ref={chat.messagesEndRef} />
            </div>

            {remaining <= 3 && !chat.limitHit && (
              <div style={{ textAlign: "center", fontSize: "0.72rem", color: remaining <= 1 ? t.premium : t.text2, padding: "0 1.2rem 0.4rem" }}>
                {T.remaining(remaining)} · <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => chat.setShowPremium(true)}>{T.goPremium}</span>
              </div>
            )}

            {img.showImageInput && user && (
              <div style={{ padding: "0.8rem 1.2rem", borderTop: "0.5px solid " + t.border, display: "flex", gap: "0.7rem", background: t.surface }}>
                <input value={img.imagePrompt} onChange={e => img.setImagePrompt(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") img.generateImage(); if (e.key === "Escape") img.setShowImageInput(false); }}
                  placeholder={T.describeImage} autoFocus
                  style={{ flex: 1, background: t.card, border: "0.5px solid " + t.border, color: t.text, borderRadius: 14, padding: "10px 14px", fontFamily: "DM Sans, sans-serif", fontSize: "0.86rem", outline: "none" }} />
                <button onClick={() => img.generateImage()} disabled={img.generatingImage}
                  style={{ background: t.accent, border: "none", color: "#fff", padding: "0 16px", borderRadius: 12, cursor: "pointer", fontSize: "0.8rem", opacity: img.generatingImage ? 0.5 : 1, whiteSpace: "nowrap" }}>
                  {img.generatingImage ? T.img.generatingImage : "→"}
                </button>
              </div>
            )}

            <div style={{ padding: "0.9rem 1.2rem", borderTop: "0.5px solid " + t.border, display: "flex", gap: "0.7rem", alignItems: "flex-end" }}>
              {user && (
                <button onClick={() => img.setShowImageInput(!img.showImageInput)} title={T.img.generateImage}
                  style={{ background: img.showImageInput ? t.accent : t.surface, border: "0.5px solid " + t.border, color: img.showImageInput ? "#fff" : t.text2, width: 40, height: 40, borderRadius: 12, cursor: "pointer", fontSize: "1rem", flexShrink: 0 }}>
                  🎨
                </button>
              )}
              <textarea value={chat.input} onChange={e => chat.setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); chat.sendMessage(); }}}
                placeholder={T.write} rows={1}
                style={{ flex: 1, background: t.surface, border: "0.5px solid " + t.border, color: t.text, borderRadius: 14, padding: "10px 14px", fontFamily: "DM Sans, sans-serif", fontSize: "0.86rem", resize: "none", outline: "none" }} />
              <button onClick={chat.sendMessage} disabled={chat.loading || chat.limitHit}
                style={{ background: t.accent, border: "none", color: "#fff", width: 40, height: 40, borderRadius: 12, cursor: "pointer", fontSize: "0.9rem", opacity: chat.loading || chat.limitHit ? 0.4 : 1 }}>➤</button>
            </div>

            {isPremium && (
              <div style={{ textAlign: "center", fontSize: "0.68rem", color: t.text2, padding: "0 1.2rem 0.6rem" }}>
                🎨 {T.img.imagesLeft(img.imagesLeft)}
              </div>
            )}
          </div>
        </div>
      )}

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
        {T.footer}
      </footer>

      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}
