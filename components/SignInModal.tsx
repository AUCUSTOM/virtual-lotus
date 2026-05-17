"use client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Theme = any;

type Props = {
  show: boolean;
  onClose: () => void;
  t: Theme;
  isDark: boolean;
};

export function SignInModal({ show, onClose, t, isDark }: Props) {
  if (!show) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(12px)",
        zIndex: 200,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div
        style={{
          background: t.bg2,
          border: "0.5px solid " + t.accent2,
          borderRadius: "24px 24px 0 0",
          width: "100%",
          maxWidth: 480,
          padding: "2rem 2rem 1.6rem",
          textAlign: "center",
          maxHeight: "90dvh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            width: 36,
            height: 4,
            background: t.border,
            borderRadius: 2,
            margin: "0 auto 1.4rem",
          }}
        />
        <div
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.8rem",
            fontWeight: 300,
            color: t.accent,
            marginBottom: "0.6rem",
          }}
        >
          ✦ Premium character
        </div>
        <p
          style={{
            color: t.text2,
            fontSize: "0.88rem",
            lineHeight: 1.7,
            marginBottom: "1.8rem",
          }}
        >
          Sign in to try premium characters. First few messages are free — no card required.
        </p>
        <a
          href="/auth"
          style={{
            display: "block",
            width: "100%",
            background: "linear-gradient(135deg, " + t.accent2 + ", " + t.premium + ")",
            color: isDark ? "#1a1000" : "#fff",
            border: "none",
            padding: "13px",
            borderRadius: 14,
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.9rem",
            fontWeight: 500,
            cursor: "pointer",
            marginBottom: "1rem",
            textDecoration: "none",
            boxSizing: "border-box",
          }}
        >
          Sign in
        </a>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: t.text2,
            cursor: "pointer",
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.8rem",
            textDecoration: "underline",
          }}
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}