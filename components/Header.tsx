"use client";
import { THEMES, type Theme } from "../lib/themes";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ThemeColors = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Translations = any;

const themeColors: Record<Theme, string> = {
  warm: "#e8d5c0",
  dark: "#2a2420",
  rose: "#f0d0da",
  sage: "#c8dcc8",
  dusk: "#2a2040",
};

type Props = {
  t: ThemeColors;
  T: Translations;
  theme: Theme;
  setTheme: (th: Theme) => void;
  isDark: boolean;
  user: { id: string } | null;
  isPremium: boolean;
  signOut: () => void;
  onPremiumClick: () => void;
  onManageClick: () => void;
};

export function Header({ t, T, theme, setTheme, isDark, user, isPremium, signOut, onPremiumClick, onManageClick }: Props) {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: t.bg + "f0",
        backdropFilter: "blur(24px)",
        borderBottom: "0.5px solid " + t.border,
        height: "auto",
        minHeight: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.5rem",
        paddingTop: "max(8px, env(safe-area-inset-top))",
        paddingBottom: "8px",
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          flexShrink: 0,
        }}
      >
        <img
          src="/logo-256-transparent.png"
          alt="VirtualLotus logo"
          width={40}
          height={40}
          style={{
            display: "block",
            flexShrink: 0,
          }}
        />
        <div
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.4rem",
            fontWeight: 300,
            letterSpacing: "0.12em",
            color: t.accent,
          }}
        >
          Virtual<span style={{ fontStyle: "italic", color: t.text2 }}>Lotus</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            gap: 6,
            background: t.surface,
            border: "0.5px solid " + t.border,
            borderRadius: 24,
            padding: "5px 8px",
          }}
        >
          {(Object.keys(THEMES) as Theme[]).map((th) => (
            <button
              key={th}
              onClick={() => {
                setTheme(th);
                localStorage.setItem("vl-theme", th);
              }}
              title={th}
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: "2px solid " + (theme === th ? t.accent : "transparent"),
                cursor: "pointer",
                background: themeColors[th],
                transition: "all 0.2s",
                outline: "none",
              }}
            />
          ))}
        </div>
        {user ? (
          <button
            onClick={signOut}
            style={{
              background: "transparent",
              border: "0.5px solid " + t.border,
              color: t.text2,
              padding: "7px 14px",
              borderRadius: 20,
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.78rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {T.signOut}
          </button>
        ) : (
          <button
            onClick={() => (window.location.href = "/auth")}
            style={{
              background: "transparent",
              border: "0.5px solid " + t.border,
              color: t.text2,
              padding: "7px 14px",
              borderRadius: 20,
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.78rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {T.signIn}
          </button>
        )}
        <button
          onClick={isPremium ? onManageClick : onPremiumClick}
          style={{
            background: "linear-gradient(135deg, " + t.accent2 + ", " + t.premium + ")",
            color: isDark ? "#1a1000" : "#fff",
            border: "none",
            padding: "7px 16px",
            borderRadius: 20,
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.78rem",
            fontWeight: 500,
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {isPremium ? "⚙ Manage" : "✦ Premium"}
        </button>
      </div>
    </header>
  );
}