"use client";
import { useState, useRef, useEffect } from "react";
import type { Character } from "../lib/characters";

type Message = { role: "user" | "ai"; text?: string; imageUrl?: string };

function dbMessageToUiMessage(m: { role: string; content: string }): Message {
  return {
    role: m.role === "assistant" ? "ai" : "user",
    text: m.content,
  };
}

export function useChat(lang: string, userId: string | null) {
  const [chatChar, setChatChar] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limitHit, setLimitHit] = useState(false);
  const [limitReason, setLimitReason] = useState<string | null>(null);
  const [hoursLeft, setHoursLeft] = useState<number | null>(null);
  const [showPremium, setShowPremium] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function getGreetingMessage(char: Character): Message {
    const greetings: Record<string, string> = {
      en: "Hey! I'm",
      pl: "Hej! Jestem",
      nl: "Hoi! Ik ben",
      de: "Hey! Ich bin",
      fr: "Salut! Je suis",
      es: "¡Hola! Soy",
      ja: "こんにちは！私は",
      ko: "안녕하세요! 저는",
      zh: "你好！我是",
      hi: "नमस्ते! मैं हूँ",
    };
    const g = greetings[lang] || greetings.en;
    return { role: "ai", text: g + " " + char.name + "." };
  }

  async function openChat(char: Character) {
    // Gość próbuje premium chara → pokaż modal logowania, nie otwieraj czatu
    if (!userId && char.premium) {
      setShowSignIn(true);
      return;
    }

    setChatChar(char);
    setInput("");
    setRemaining(null);
    setLimitHit(false);
    setLimitReason(null);
    setHoursLeft(null);

    const greetingMsg = getGreetingMessage(char);

    if (!userId) {
      setMessages([greetingMsg]);
      setSessionId(null);
      return;
    }

    setLoadingHistory(true);
    setMessages([]);

    try {
      const res = await fetch("/api/chat/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, characterId: char.id }),
      });
      const data = await res.json();

      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages.map(dbMessageToUiMessage));
        setSessionId(data.sessionId);
      } else {
        setMessages([greetingMsg]);
        setSessionId(null);
      }
    } catch (err) {
      console.error("[useChat] history load failed:", err);
      setMessages([greetingMsg]);
      setSessionId(null);
    } finally {
      setLoadingHistory(false);
    }
  }

  async function clearHistory() {
    if (!chatChar || !userId) return false;

    try {
      const res = await fetch("/api/chat/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, characterId: chatChar.id }),
      });
      const data = await res.json();

      if (data.ok) {
        setMessages([getGreetingMessage(chatChar)]);
        setSessionId(null);
        return true;
      }
      return false;
    } catch (err) {
      console.error("[useChat] clearHistory failed:", err);
      return false;
    }
  }

  async function sendMessage() {
    if (!input.trim() || !chatChar || loading) return;

    const text = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, characterId: chatChar.id, sessionId, userId, lang }),
      });
      const data = await res.json();

      if (data.error) {
        setLimitHit(true);
        setLimitReason(data.error);
        setHoursLeft(data.hoursLeft ?? null);

        if (data.error === "sign_in_required") {
          setShowSignIn(true);
        } else {
          setShowPremium(true);
        }
        return;
      }

      setSessionId(data.sessionId);
      setRemaining(data.remaining ?? null);
      setMessages((m) => [...m, { role: "ai", text: data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "Something went wrong... try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return {
    chatChar,
    setChatChar,
    messages,
    setMessages,
    input,
    setInput,
    loading,
    loadingHistory,
    sessionId,
    remaining,
    limitHit,
    limitReason,
    hoursLeft,
    showPremium,
    setShowPremium,
    showSignIn,
    setShowSignIn,
    messagesEndRef,
    openChat,
    sendMessage,
    clearHistory,
  };
}