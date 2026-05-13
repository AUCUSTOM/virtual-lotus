"use client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Theme = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Translations = any;

type Props = {
  show: boolean;
  onClose: () => void;
  t: Theme;
  T: Translations;
  isDark: boolean;
  paying: boolean;
  startCheckout: (plan: "monthly" | "yearly") => void;
  limitHit: boolean;
  hoursLeft: number | null;
};

export function PremiumModal({
  show,
  onClose,
  t,
  T,
  isDark,
  paying,
  startCheckout,
  limitHit,
  hoursLeft,
}: Props) {
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
        <div style={{ width: 36, height: 4, background: t.border, borderRadius: 2, margin: "0 auto 1.4rem" }} />
        <div
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.8rem",
            fontWeight: 300,
            color: t.accent,
            marginBottom: "0.4rem",
          }}
        >
          {T.premiumTitle}
        </div>
        <p style={{ color: t.text2, fontSize: "0.86rem", lineHeight: 1.7, marginBottom: "1.4rem" }}>
          {T.premiumDesc}
        </p>
        {limitHit && hoursLeft && (
          <div
            style={{
              background: t.surface,
              border: "0.5px solid " + t.border,
              borderRadius: 12,
              padding: "0.8rem",
              fontSize: "0.8rem",
              color: t.text2,
              marginBottom: "1.2rem",
            }}
          >
            ⏳ {T.premiumRefresh(hoursLeft)}
          </div>
        )}
        <ul style={{ textAlign: "left", listStyle: "none", marginBottom: "1.8rem" }}>
          {(T.features as string[]).map((f: string) => (
            <li
              key={f}
              style={{
                padding: "5px 0",
                fontSize: "0.83rem",
                display: "flex",
                gap: "0.6rem",
                alignItems: "center",
              }}
            >
              <span style={{ color: t.accent }}>✦</span> {f}
            </li>
          ))}
        </ul>
        <button
          onClick={() => startCheckout("monthly")}
          disabled={paying}
          style={{
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
            marginBottom: "0.6rem",
            opacity: paying ? 0.7 : 1,
          }}
        >
          {paying ? "Loading..." : T.monthly}
        </button>
        <button
          onClick={() => startCheckout("yearly")}
          disabled={paying}
          style={{
            width: "100%",
            background: t.surface,
            border: "0.5px solid " + t.accent,
            color: t.accent,
            padding: "13px",
            borderRadius: 14,
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.9rem",
            cursor: "pointer",
            marginBottom: "1.2rem",
            opacity: paying ? 0.7 : 1,
          }}
        >
          {paying ? "Loading..." : T.yearly}
        </button>
        <div style={{ fontSize: "0.7rem", color: t.text2, marginBottom: "1rem" }}>{T.payments}</div>
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
          {T.maybeLater}
        </button>
      </div>
    </div>
  );
}