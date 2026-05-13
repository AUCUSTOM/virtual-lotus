"use client";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Translations = any;

type ChatLike = {
  chatChar: { id: string } | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setMessages: (updater: (m: any[]) => any[]) => void;
  setShowPremium: (v: boolean) => void;
};

type Args = {
  user: { id: string } | null;
  isPremium: boolean;
  chat: ChatLike;
  T: Translations;
};

export function useImageGeneration({ user, isPremium, chat, T }: Args) {
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imagesLeft, setImagesLeft] = useState(5);
  const [showImageInput, setShowImageInput] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");

  async function generateImage(watchedAd = false) {
    console.log("🎨 click. user:", user, "isPremium:", isPremium, "watchedAd:", watchedAd);
    if (!imagePrompt.trim() || !chat.chatChar || generatingImage) return;
    if (!user) {
      chat.setShowPremium(true);
      return;
    }
    if (!isPremium && !watchedAd) {
      setShowAdModal(true);
      return;
    }
    setGeneratingImage(true);
    setShowImageInput(false);
    chat.setMessages((m) => [...m, { role: "user", text: imagePrompt }]);
    const prompt = imagePrompt;
    setImagePrompt("");
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          characterId: chat.chatChar.id,
          userId: user?.id,
          watchedAd,
        }),
      });
      const data = await res.json();
      if (data.error === "image_limit") {
        chat.setMessages((m) => [...m, { role: "ai", text: T.imageLimitHit(data.hoursLeft) }]);
      } else if (data.imageUrl) {
        setImagesLeft(data.remaining);
        chat.setMessages((m) => [...m, { role: "ai", imageUrl: data.imageUrl }]);
      } else {
        chat.setMessages((m) => [...m, { role: "ai", text: T.imageError }]);
      }
    } catch {
      chat.setMessages((m) => [...m, { role: "ai", text: T.imageError }]);
    } finally {
      setGeneratingImage(false);
    }
  }

  return {
    generatingImage,
    imagesLeft,
    showImageInput,
    setShowImageInput,
    showAdModal,
    setShowAdModal,
    imagePrompt,
    setImagePrompt,
    generateImage,
  };
}