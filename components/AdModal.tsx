"use client";
import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ThemeColors = any;

type Props = {
  show: boolean;
  onWatched: () => void;
  onClose: () => void;
  t: ThemeColors;
};

const COUNTDOWN_SECONDS = 5;

export function AdModal({ show, onWatched, onClose, t }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);

  // Reset countdown every time modal opens
  useEffect(() => {
    if (show) {
      setSecondsLeft(COUNTDOWN_SECONDS);
    }
  }, [show]);

  // Countdown ticker
  useEffect(() => {
    if (!show || secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [show, secondsLeft]);

  if (!show) return null;

  const finished = secondsLeft <= 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        zIndex: 300,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      <div
        style={{
          background: "#000",
          border: "0.5px solid " + t.border,
          borderRadius: "24px 24px 0 0",
          width: "100%",
          maxWidth: 540,
          padding: "2.5rem 1.5rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.2rem",
          animation: "slideUp 0.3s ease-out",
        }}
      >
        {/* Placeholder zamiast prawdziwej reklamy */}
        <div
          style={{
            width: "100%",
            aspectRatio: "16/9",
            background: "#1a1a1a",
            border: "0.5px dashed #444",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.4rem",
          }}
        >
          <div style={{ fontSize: "2.4rem" }}>📺</div>
          <div style={{ color: "#aaa", fontFamily: "DM Sans, sans-serif", fontSize: "0.95rem", fontWeight: 500 }}>
            Reklama
          </div>
          <div style={{ color: "#666", fontFamily: "DM Sans, sans-serif", fontSize: "0.72rem", letterSpacing: "0.05em" }}>
            (test mode)
          </div>
        </div>

        {/* Countdown lub przycisk akcji */}
        {!finished ? (
          <div
            style={{
              color: "#bbb",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span>Reklama —</span>
            <span style={{ color: "#fff", fontWeight: 600, minWidth: 14, textAlign: "center" }}>{secondsLeft}s</span>
          </div>
        ) : (
          <button
            onClick={onWatched}
            style={{
              background: t.accent,
              border: "none",
              color: "#fff",
              padding: "12px 28px",
              borderRadius: 14,
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.9rem",
              fontWeight: 500,
              cursor: "pointer",
              width: "100%",
              maxWidth: 280,
            }}
          >
            🎨 Generuj obraz
          </button>
        )}

        {/* X dostępny dopiero po countdownie (lub gdy ktoś chce zrezygnować bez bonusu — opcjonalnie) */}
        {finished && (
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#666",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.75rem",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Anuluj
          </button>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
}