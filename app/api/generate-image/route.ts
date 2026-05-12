import { NextResponse } from "next/server";

// Dzienny limit obrazów per IP dla premium
const imageCount: Record<string, { count: number; resetAt: number }> = {};
const MAX_IMAGES_PER_DAY = 5;

// Styl każdej postaci dla DALL-E
const characterStyles: Record<string, string> = {
  aurora:  "dreamy, ethereal, cosmic, soft watercolor, nebula colors, mystical atmosphere, painterly",
  mila:    "vibrant, fun, colorful, playful, bright and cheerful, modern illustration style",
  sofia:   "warm, romantic, soft golden light, flowers, gentle pastel colors, intimate and cozy",
  luca:    "Italian aesthetic, warm mediterranean light, rich colors, food and art, cinematic",
  noah:    "calm, minimal, ocean and nature, soft blue tones, peaceful, serene landscape",
  elena:   "elegant, high fashion, dramatic lighting, black and gold, refined and luxurious",
  zara:    "edgy, urban, street art, dark with pops of color, alternative, grunge aesthetic",
  ren:     "minimalist, dark, moonlight, shadows and silence, Japanese aesthetic, sparse",
  alex:    "surreal, boundary-breaking, mixed media, unexpected combinations, avant-garde art",
  kai:     "mysterious, deep space, fractals, intellectual, cosmic patterns, mind-bending",
};

export async function POST(req: Request) {
  try {
    const { prompt, characterId, isPremium } = await req.json();

    if (!isPremium) {
      return NextResponse.json({ error: "premium_required" }, { status: 403 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
    const now = Date.now();
    const key = ip + ":images";

    if (!imageCount[key] || now > imageCount[key].resetAt) {
      imageCount[key] = { count: 0, resetAt: now + 24 * 60 * 60 * 1000 };
    }

    if (imageCount[key].count >= MAX_IMAGES_PER_DAY) {
      const hoursLeft = Math.ceil((imageCount[key].resetAt - now) / (1000 * 60 * 60));
      return NextResponse.json({ error: "image_limit", hoursLeft }, { status: 429 });
    }

    imageCount[key].count++;

    const style = characterStyles[characterId] || "artistic, beautiful, detailed";
    const fullPrompt = `${prompt}. Style: ${style}. No text, no words in image.`;

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: fullPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("DALL-E error:", data.error);
      return NextResponse.json({ error: "generation_failed" }, { status: 500 });
    }

    const imageUrl = data.data[0].url;
    const remaining = MAX_IMAGES_PER_DAY - imageCount[key].count;

    return NextResponse.json({ imageUrl, remaining });

  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json({ error: "generation_failed" }, { status: 500 });
  }
}
