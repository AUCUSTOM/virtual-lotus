"use client";
import type { Character } from "../lib/characters";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Theme = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Translations = any;

type Props = {
  char: Character;
  t: Theme;
  T: Translations;
  isDark: boolean;
  onOpen: (char: Character) => void;
};

export function CharacterCard({ char, t, T, isDark, onOpen }: Props) {
  const charT = T.chars?.[char.id] || { tagline: "", desc: "" };

  return (
    <div
      onClick={() => onOpen(char)}
      style={{
        background: t.card,
        border: "0.5px solid " + t.border,
        borderRadius: 20,
        padding: "1.6rem",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.25s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = t.accent;
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "0 12px 32px " + t.glow;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = t.border;
        el.style.transform = "none";
        el.style.boxShadow = "none";
      }}
    >
      {char.premium && (
        <div
          style={{
            position: "absolute",
            top: "0.8rem",
            right: "0.8rem",
            maxWidth: "calc(100% - 1.6rem)",
            background: "linear-gradient(135deg, " + t.accent2 + ", " + t.premium + ")",
            color: isDark ? "#1a1000" : "#fff",
            fontSize: "0.6rem",
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: 10,
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {T.previewBadge}
        </div>
      )}
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: t.bg2,
          border: "0.5px solid " + t.border,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.7rem",
          marginBottom: "1rem",
          overflow: "hidden",
        }}
      >
        {char.avatar.startsWith("/") ? (
          <img
            src={char.avatar}
            alt={char.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
          />
        ) : (
          char.avatar
        )}
      </div>
      <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.5rem", fontWeight: 400 }}>
        {char.name}
      </div>
      <div style={{ color: t.text2, fontSize: "0.78rem", marginBottom: "0.5rem" }}>{char.age}</div>
      <div
        style={{
          fontStyle: "italic",
          color: t.accent,
          fontSize: "0.84rem",
          marginBottom: "0.8rem",
          fontFamily: "Cormorant Garamond, serif",
        }}
      >
        {charT.tagline}
      </div>
      <div style={{ color: t.text2, fontSize: "0.8rem", lineHeight: 1.6, marginBottom: "1rem" }}>
        {charT.desc}
      </div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: "1.2rem" }}>
        {char.tags.map((tag) => (
          <span
            key={tag}
            style={{
              background: t.surface,
              border: "0.5px solid " + t.border,
              color: t.text2,
              padding: "2px 9px",
              borderRadius: 10,
              fontSize: "0.7rem",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      <button
        style={{
          width: "100%",
          background: "transparent",
          border: "0.5px solid " + t.accent,
          color: t.accent,
          padding: "9px",
          borderRadius: 12,
          fontFamily: "DM Sans, sans-serif",
          fontSize: "0.82rem",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.background = t.accent;
          el.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.background = "transparent";
          el.style.color = t.accent;
        }}
      >
        {char.premium ? T.unlock : T.startChat}
      </button>
    </div>
  );
}