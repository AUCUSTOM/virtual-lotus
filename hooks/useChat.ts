"use client";
import { useState, useRef, useEffect } from "react";
import type { Character } from "../lib/characters";

type Message = { role: "user" | "ai"; text?: string; imageUrl?: string };

export function useChat(lang: string, userId: string | null) {
  const [chatChar, setChatChar] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
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

  function openChat(char: Character) {
    setChatChar(char);
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
    setMessages([{ role: "ai", text: g + " " + char.name + "." }]);
    setSessionId(null);
    setRemaining(null);
    setLimitHit(false);
    setLimitReason(null);
    setHoursLeft(null);
    setInput("");
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
        body: JSON.stringify({ message: text, characterId: chatChar.id, sessionId, userId }),
      });
      const data = await res.json();

      // Backend zwraca błąd?
      if (data.error) {
        setLimitHit(true);
        setLimitReason(data.error);
        setHoursLeft(data.hoursLeft ?? null);

        if (data.error === "sign_in_required") {
          // Gość kliknął premium char — pokaż sign-in modal
          setShowSignIn(true);
        } else {
          // Inne limity — premium modal
          setShowPremium(true);
        }
        return;
      }

      // Sukces — aktualizuj stan z backendu
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
  };
}