"use client";
export const dynamic = 'force-dynamic'
import { useState, useRef, useEffect } from "react";
import { THEMES, type Theme } from "../lib/themes";
import { getSupabase } from "../lib/supabase";
import { CHARACTERS, type Character } from "../lib/characters";
import { TRANSLATIONS } from "../lib/translations";
import { useAuth } from "../hooks/useAuth";
import { useChat } from "../hooks/useChat";
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
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imagesLeft, setImagesLeft] = useState(5);
  const [showImageInput, setShowImageInput] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  
  const t = THEMES[theme];
  const T = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const supabase = getSupabase();

  
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

  async function generateImage(watchedAd = false) {
  console.log("🎨 click. user:", user, "isPremium:", isPremium, "watchedAd:", watchedAd);
    if (!imagePrompt.trim() || !chat.chatChar || generatingImage) return;
    if (!user) { chat.setShowPremium(true); return; }
    if (!isPremium && !watchedAd) { setShowAdModal(true); return; }
    setGeneratingImage(true);
    setShowImageInput(false);
    chat.setMessages(m => [...m, { role: "user", text: imagePrompt }]);
    const prompt = imagePrompt;
    setImagePrompt("");
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, characterId: chat.chatChar.id, userId: user?.id, watchedAd })
      });
      const data = await res.json();
      if (data.error === "image_limit") {
        chat.setMessages(m => [...m, { role: "ai", text: T.imagechat.limitHit(data.chat.hoursLeft) }]);
      } else if (data.imageUrl) {
        setImagesLeft(data.remaining);
        chat.setMessages(m => [...m, { role: "ai", imageUrl: data.imageUrl }]);
      } else {
        chat.setMessages(m => [...m, { role: "ai", text: T.imageError }]);
      }
    } catch {
      chat.setMessages(m => [...m, { role: "ai", text: T.imageError }]);
    } finally {
      setGeneratingImage(false);
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
        {filtered.map(char => {
          const charT = T.chars?.[char.id] || { tagline: "", desc: "" };
          return (
            <div key={char.id} onClick={() => chat.openChat(char)}
              style={{ background: t.card, border: "0.5px solid " + t.border, borderRadius: 20, padding: "1.6rem", cursor: "pointer", position: "relative", transition: "all 0.25s" }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = t.accent; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "0 12px 32px " + t.glow; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = t.border; el.style.transform = "none"; el.style.boxShadow = "none"; }}>
              {char.premium && (
                <div style={{ position: "absolute", top: "1rem", right: "1rem", background: "linear-gradient(135deg, " + t.accent2 + ", " + t.premium + ")", color: isDark ? "#1a1000" : "#fff", fontSize: "0.6rem", fontWeight: 600, padding: "3px 10px", borderRadius: 10, letterSpacing: "0.08em" }}>{T.previewBadge}</div>
              )}
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: t.bg2, border: "0.5px solid " + t.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.7rem", marginBottom: "1rem", overflow: "hidden" }}>
                {char.avatar.startsWith("/") ? <img src={char.avatar} alt={char.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : char.avatar}
              </div>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.5rem", fontWeight: 400 }}>{char.name}</div>
              <div style={{ color: t.text2, fontSize: "0.78rem", marginBottom: "0.5rem" }}>{char.age}</div>
              <div style={{ fontStyle: "italic", color: t.accent, fontSize: "0.84rem", marginBottom: "0.8rem", fontFamily: "Cormorant Garamond, serif" }}>{charT.tagline}</div>
              <div style={{ color: t.text2, fontSize: "0.8rem", lineHeight: 1.6, marginBottom: "1rem" }}>{charT.desc}</div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: "1.2rem" }}>
                {char.tags.map(tag => <span key={tag} style={{ background: t.surface, border: "0.5px solid " + t.border, color: t.text2, padding: "2px 9px", borderRadius: 10, fontSize: "0.7rem" }}>{tag}</span>)}
              </div>
              <button style={{ width: "100%", background: "transparent", border: "0.5px solid " + t.accent, color: t.accent, padding: "9px", borderRadius: 12, fontFamily: "DM Sans, sans-serif", fontSize: "0.82rem", cursor: "pointer" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = t.accent; el.style.color = "#fff"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = "transparent"; el.style.color = t.accent; }}>
                {char.premium ? T.unlock : T.startChat}
              </button>
            </div>
          );
        })}
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
              {(chat.loading || generatingImage) && (
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

            {showImageInput && user && (
              <div style={{ padding: "0.8rem 1.2rem", borderTop: "0.5px solid " + t.border, display: "flex", gap: "0.7rem", background: t.surface }}>
                <input value={imagePrompt} onChange={e => setImagePrompt(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") generateImage(); if (e.key === "Escape") setShowImageInput(false); }}
                  placeholder={T.describeImage} autoFocus
                  style={{ flex: 1, background: t.card, border: "0.5px solid " + t.border, color: t.text, borderRadius: 14, padding: "10px 14px", fontFamily: "DM Sans, sans-serif", fontSize: "0.86rem", outline: "none" }} />
                <button onClick={() => generateImage()} disabled={generatingImage}
                  style={{ background: t.accent, border: "none", color: "#fff", padding: "0 16px", borderRadius: 12, cursor: "pointer", fontSize: "0.8rem", opacity: generatingImage ? 0.5 : 1, whiteSpace: "nowrap" }}>
                  {generatingImage ? T.generatingImage : "→"}
                </button>
              </div>
            )}

            <div style={{ padding: "0.9rem 1.2rem", borderTop: "0.5px solid " + t.border, display: "flex", gap: "0.7rem", alignItems: "flex-end" }}>
              {user && (
                <button onClick={() => setShowImageInput(!showImageInput)} title={T.generateImage}
                  style={{ background: showImageInput ? t.accent : t.surface, border: "0.5px solid " + t.border, color: showImageInput ? "#fff" : t.text2, width: 40, height: 40, borderRadius: 12, cursor: "pointer", fontSize: "1rem", flexShrink: 0 }}>
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
                🎨 {T.imagesLeft(imagesLeft)}
              </div>
            )}
          </div>
        </div>
      )}

      {chat.showPremium && (
        <div onClick={e => { if (e.target === e.currentTarget) chat.setShowPremium(false); }}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: "env(safe-area-inset-bottom)" }}>
          <div style={{ background: t.bg2, border: "0.5px solid " + t.accent2, borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, padding: "2rem 2rem 1.6rem", textAlign: "center", maxHeight: "90dvh", overflowY: "auto" }}>
            <div style={{ width: 36, height: 4, background: t.border, borderRadius: 2, margin: "0 auto 1.4rem" }} />
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.8rem", fontWeight: 300, color: t.accent, marginBottom: "0.4rem" }}>{T.premiumTitle}</div>
            <p style={{ color: t.text2, fontSize: "0.86rem", lineHeight: 1.7, marginBottom: "1.4rem" }}>{T.premiumDesc}</p>
            {chat.limitHit && chat.hoursLeft && (
              <div style={{ background: t.surface, border: "0.5px solid " + t.border, borderRadius: 12, padding: "0.8rem", fontSize: "0.8rem", color: t.text2, marginBottom: "1.2rem" }}>
                ⏳ {T.premiumRefresh(chat.hoursLeft)}
              </div>
            )}
            <ul style={{ textAlign: "left", listStyle: "none", marginBottom: "1.8rem" }}>
              {(T.features as string[]).map((f: string) => (
                <li key={f} style={{ padding: "5px 0", fontSize: "0.83rem", display: "flex", gap: "0.6rem", alignItems: "center" }}>
                  <span style={{ color: t.accent }}>✦</span> {f}
                </li>
              ))}
            </ul>
            <button onClick={() => startCheckout("monthly")} disabled={paying}
              style={{ width: "100%", background: "linear-gradient(135deg, " + t.accent2 + ", " + t.premium + ")", color: isDark ? "#1a1000" : "#fff", border: "none", padding: "13px", borderRadius: 14, fontFamily: "DM Sans, sans-serif", fontSize: "0.9rem", fontWeight: 500, cursor: "pointer", marginBottom: "0.6rem", opacity: paying ? 0.7 : 1 }}>
              {paying ? "Loading..." : T.monthly}
            </button>
            <button onClick={() => startCheckout("yearly")} disabled={paying}
              style={{ width: "100%", background: t.surface, border: "0.5px solid " + t.accent, color: t.accent, padding: "13px", borderRadius: 14, fontFamily: "DM Sans, sans-serif", fontSize: "0.9rem", cursor: "pointer", marginBottom: "1.2rem", opacity: paying ? 0.7 : 1 }}>
              {paying ? "Loading..." : T.yearly}
            </button>
            <div style={{ fontSize: "0.7rem", color: t.text2, marginBottom: "1rem" }}>{T.payments}</div>
            <button onClick={() => chat.setShowPremium(false)}
              style={{ background: "transparent", border: "none", color: t.text2, cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem", textDecoration: "underline" }}>
              {T.maybeLater}
            </button>
          </div>
        </div>
      )}

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
