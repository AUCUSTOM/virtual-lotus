"use client";
import { useState } from "react";
import { getSupabase } from "../../lib/supabase";

const THEMES = {
  warm: { bg: "#faf7f4", bg2: "#f5ede4", border: "rgba(139,107,90,0.15)", text: "#2a2020", text2: "#9a8070", accent: "#8b6b5a", accent2: "#c4a882", surface: "rgba(139,107,90,0.06)" },
};

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = THEMES.warm;

  async function sendMagicLink() {
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    const { error } = await getSupabase().auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div style={{ background: t.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: "1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <div style={{ background: t.bg2, border: "0.5px solid " + t.border, borderRadius: 24, padding: "2.5rem", width: "100%", maxWidth: 380, textAlign: "center" }}>
        <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.8rem", fontWeight: 300, letterSpacing: "0.12em", color: t.accent, marginBottom: "0.5rem" }}>
          Virtual<span style={{ fontStyle: "italic", color: t.text2 }}>Lotus</span>
        </div>

        {!sent ? (
          <>
            <p style={{ color: t.text2, fontSize: "0.86rem", lineHeight: 1.7, marginBottom: "1.8rem" }}>
              Enter your email and we&apos;ll send you a magic link to sign in.
            </p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") sendMagicLink(); }}
              placeholder="your@email.com"
              style={{ width: "100%", background: t.surface, border: "0.5px solid " + t.border, color: t.text, borderRadius: 14, padding: "12px 16px", fontFamily: "DM Sans, sans-serif", fontSize: "0.9rem", outline: "none", marginBottom: "0.8rem", boxSizing: "border-box" as const }}
            />
            {error && (
              <p style={{ color: "#c45a5a", fontSize: "0.8rem", marginBottom: "0.8rem" }}>{error}</p>
            )}
            <button
              onClick={sendMagicLink}
              disabled={loading}
              style={{ width: "100%", background: "linear-gradient(135deg, " + t.accent2 + ", " + t.accent + ")", color: "#fff", border: "none", padding: "13px", borderRadius: 14, fontFamily: "DM Sans, sans-serif", fontSize: "0.9rem", fontWeight: 500, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Sending..." : "✦ Send magic link"}
            </button>
            <p style={{ color: t.text2, fontSize: "0.75rem", marginTop: "1.2rem", lineHeight: 1.6 }}>
              No password needed. No personal data stored.
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✉️</div>
            <p style={{ color: t.text, fontSize: "0.95rem", fontWeight: 500, marginBottom: "0.5rem" }}>Check your email!</p>
            <p style={{ color: t.text2, fontSize: "0.84rem", lineHeight: 1.7 }}>
              We sent a magic link to <strong>{email}</strong>. Click it to sign in.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              style={{ background: "transparent", border: "none", color: t.text2, cursor: "pointer", fontSize: "0.8rem", textDecoration: "underline", marginTop: "1.5rem" }}>
              Use a different email
            </button>
          </>
        )}
      </div>
    </div>
  );
}
