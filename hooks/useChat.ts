"use client";
import { useState, useRef, useEffect } from "react";
import type { Character } from "../lib/characters";
const MAX_FREE = 15;
const MAX_PREMIUM_PREVIEW = 5;
type Message = { role: "user" | "ai"; text?: string; imageUrl?: string };
export function useChat(lang: string, userId: string | null) {
  const [chatChar, setChatChar] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [msgCount, setMsgCount] = useState(0);
  const [limitHit, setLimitHit] = useState(false);
  const [hoursLeft, setHoursLeft] = useState<number | null>(null);
  const [showPremium, setShowPremium] = useState(false);
const messagesEndRef = useRef<HTMLDivElement>(null);
useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);
function openChat(char: Character) {
    if (limitHit && !char.premium) {
      setShowPremium(true);
      return;
    }
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
    setMsgCount(0);
    setLimitHit(false);
    setInput("");
  }
async function sendMessage() {
    if (!input.trim() || !chatChar || loading) return;
    const maxForChar = chatChar.premium ? MAX_PREMIUM_PREVIEW : MAX_FREE;
    if (msgCount >= maxForChar) {
      setLimitHit(true);
      setShowPremium(true);
      return;
    }
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
      if (data.error === "daily_limit") {
        setLimitHit(true);
        setHoursLeft(data.hoursLeft ?? null);
        setShowPremium(true);
        return;
      }
      setSessionId(data.sessionId);
      setMsgCount((n) => n + 1);
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
    msgCount,
    limitHit,
    hoursLeft,
    showPremium,
    setShowPremium,
    messagesEndRef,
    openChat,
    sendMessage,
  };
}