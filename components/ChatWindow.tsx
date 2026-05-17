"use client";
import type { Character } from "../lib/characters";
import { AdModal } from "./AdModal";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ThemeColors = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Translations = any;

type Message = { role: "user" | "ai"; text?: string; imageUrl?: string };

type ChatState = {
  chatChar: Character | null;
  setChatChar: (c: Character | null) => void;
  messages: Message[];
  input: string;
  setInput: (v: string) => void;
  loading: boolean;
  loadingHistory: boolean;
  limitHit: boolean;
  hoursLeft: number | null;
  setShowPremium: (v: boolean) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  sendMessage: () => void;
  clearHistory: () => Promise<boolean>;
};

type ImgState = {
  generatingImage: boolean;
  imagesLeft: number;
  showImageInput: boolean;
  setShowImageInput: (v: boolean) => void;
  showAdModal: boolean;
  setShowAdModal: (v: boolean) => void;
  imagePrompt: string;
  setImagePrompt: (v: string) => void;
  generateImage: (watchedAd?: boolean) => void;
};

type Props = {
  chat: ChatState;
  img: ImgState;
  t: ThemeColors;
  T: Translations;
  user: { id: string } | null;
  isPremium: boolean;
  remaining: number;
};

export function ChatWindow({ chat, img, t, T, user, isPremium, remaining }: Props) {
  if (!chat.chatChar) return null;

  async function handleClearHistory() {
    const confirmed = window.confirm(
      "Are you sure you want to clear your chat history with this character? This cannot be undone."
    );
    if (!confirmed) return;
    await chat.clearHistory();
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) chat.setChatChar(null);
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
          border: "0.5px solid " + t.border,
          borderRadius: "24px 24px 0 0",
          width: "100%",
          maxWidth: 540,
          height: "88dvh",
          maxHeight: 680,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "1.2rem 1.5rem", borderBottom: "0.5px solid " + t.border, display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: t.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", overflow: "hidden" }}>
            {chat.chatChar.avatar.startsWith("/") ? (
              <img src={chat.chatChar.avatar} alt={chat.chatChar.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
            ) : (
              chat.chatChar.avatar
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem" }}>{chat.chatChar.name}</div>
            <div style={{ fontSize: "0.72rem", color: t.accent }}>{T.online}</div>
          </div>

          {isPremium && (
            <button
              onClick={handleClearHistory}
              title="Clear chat history"
              style={{ background: t.surface, border: "0.5px solid " + t.border, color: t.text2, width: 34, height: 34, borderRadius: "50%", cursor: "pointer", fontSize: "0.85rem" }}
            >
              🗑️
            </button>
          )}

          <button
            onClick={() => chat.setChatChar(null)}
            style={{ background: t.surface, border: "0.5px solid " + t.border, color: t.text2, width: 34, height: 34, borderRadius: "50%", cursor: "pointer", fontSize: "0.9rem" }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "1.2rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          {chat.messages.map((msg, i) => (
            <div key={i} style={{ maxWidth: "80%", alignSelf: msg.role === "ai" ? "flex-start" : "flex-end" }}>
              {msg.imageUrl ? (
                <img src={msg.imageUrl} alt="generated" style={{ width: "100%", borderRadius: 16, border: "0.5px solid " + t.border, display: "block" }} />
              ) : (
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: msg.role === "ai" ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
                    fontSize: "0.86rem",
                    lineHeight: 1.65,
                    background: msg.role === "ai" ? t.card : t.accent,
                    color: msg.role === "ai" ? t.text : "#fff",
                    border: msg.role === "ai" ? "0.5px solid " + t.border : "none",
                  }}
                >
                  {msg.text}
                </div>
              )}
            </div>
          ))}
          {(chat.loading || img.generatingImage || chat.loadingHistory) && (
            <div style={{ display: "flex", gap: 4, padding: "0.75rem 1rem", background: t.card, border: "0.5px solid " + t.border, borderRadius: "16px 16px 16px 4px", alignSelf: chat.loadingHistory ? "center" : "flex-start" }}>
              {[0, 0.2, 0.4].map((d, i) => (
                <div key={i} style={{ width: 6, height: 6, background: t.text2, borderRadius: "50%", animation: "bounce 1.2s " + d + "s infinite" }} />
              ))}
            </div>
          )}
          {chat.limitHit && (
            <div style={{ textAlign: "center", background: "rgba(196,168,130,0.1)", border: "0.5px solid " + t.accent2, borderRadius: 12, padding: "1rem", fontSize: "0.8rem", color: t.premium }}>
              ✦ {chat.hoursLeft ? (chat.chatChar.premium ? T.limitPremium(chat.hoursLeft) : T.limitFree(chat.hoursLeft)) : T.limitFree(24)}
            </div>
          )}
          <div ref={chat.messagesEndRef} />
        </div>

        {img.showImageInput && user && (
          <div style={{ padding: "0.8rem 1.2rem", borderTop: "0.5px solid " + t.border, display: "flex", gap: "0.7rem", background: t.surface }}>
            <input
              value={img.imagePrompt}
              onChange={(e) => img.setImagePrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") img.generateImage();
                if (e.key === "Escape") img.setShowImageInput(false);
              }}
              placeholder={T.describeImage}
              autoFocus
              style={{ flex: 1, background: t.card, border: "0.5px solid " + t.border, color: t.text, borderRadius: 14, padding: "10px 14px", fontFamily: "DM Sans, sans-serif", fontSize: "0.86rem", outline: "none" }}
            />
            <button
              onClick={() => img.generateImage()}
              disabled={img.generatingImage}
              style={{ background: t.accent, border: "none", color: "#fff", padding: "0 16px", borderRadius: 12, cursor: "pointer", fontSize: "0.8rem", opacity: img.generatingImage ? 0.5 : 1, whiteSpace: "nowrap" }}
            >
              {img.generatingImage ? T.generatingImage : "→"}
            </button>
          </div>
        )}

        <div style={{ padding: "0.9rem 1.2rem", borderTop: "0.5px solid " + t.border, display: "flex", gap: "0.7rem", alignItems: "flex-end" }}>
          {user && (
            <button
              onClick={() => img.setShowImageInput(!img.showImageInput)}
              title={T.generateImage}
              style={{
                background: img.showImageInput ? t.accent : t.surface,
                border: "0.5px solid " + t.border,
                color: img.showImageInput ? "#fff" : t.text2,
                width: 40,
                height: 40,
                borderRadius: 12,
                cursor: "pointer",
                fontSize: "1rem",
                flexShrink: 0,
              }}
            >
              🎨
            </button>
          )}
          <textarea
            value={chat.input}
            onChange={(e) => chat.setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                chat.sendMessage();
              }
            }}
            placeholder={T.write}
            rows={1}
            style={{ flex: 1, background: t.surface, border: "0.5px solid " + t.border, color: t.text, borderRadius: 14, padding: "10px 14px", fontFamily: "DM Sans, sans-serif", fontSize: "0.86rem", resize: "none", outline: "none" }}
          />
          <button
            onClick={chat.sendMessage}
            disabled={chat.loading || chat.limitHit}
            style={{ background: t.accent, border: "none", color: "#fff", width: 40, height: 40, borderRadius: 12, cursor: "pointer", fontSize: "0.9rem", opacity: chat.loading || chat.limitHit ? 0.4 : 1 }}
          >
            ➤
          </button>
        </div>

        {isPremium && (
          <div style={{ textAlign: "center", fontSize: "0.68rem", color: t.text2, padding: "0 1.2rem 0.6rem" }}>
            🎨 {T.imagesLeft(img.imagesLeft)}
          </div>
        )}
      </div>

      <AdModal
        show={img.showAdModal}
        t={t}
        onWatched={() => {
          img.setShowAdModal(false);
          img.generateImage(true);
        }}
        onClose={() => img.setShowAdModal(false)}
      />
    </div>
  );
}