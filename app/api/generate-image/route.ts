import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const characterStyles: Record<string, string> = {
  aurora: "dreamy, ethereal, cosmic, soft watercolor, nebula colors, mystical atmosphere, painterly",
  mila:   "vibrant, fun, colorful, playful, bright and cheerful, modern illustration style",
  sofia:  "warm, romantic, soft golden light, flowers, gentle pastel colors, intimate and cozy",
  luca:   "Italian aesthetic, warm mediterranean light, rich colors, food and art, cinematic",
  noah:   "calm, minimal, ocean and nature, soft blue tones, peaceful, serene landscape",
  elena:  "elegant, high fashion, dramatic lighting, black and gold, refined and luxurious",
  zara:   "edgy, urban, street art, dark with pops of color, alternative, grunge aesthetic",
  ren:    "minimalist, dark, moonlight, shadows and silence, Japanese aesthetic, sparse",
  alex:   "surreal, boundary-breaking, mixed media, unexpected combinations, avant-garde art",
  kai:    "mysterious, deep space, fractals, intellectual, cosmic patterns, mind-bending",
};

export async function POST(req: Request) {
  try {
    const { prompt, characterId, userId, watchedAd } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
    }

    // Pobierz plan użytkownika
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan_id")
      .eq("id", userId)
      .single();

    const planId = profile?.plan_id || "free";
    const isFree = planId === "free";

    // Free musi obejrzeć reklamę
    if (isFree && !watchedAd) {
      return NextResponse.json({ error: "ad_required" }, { status: 402 });
    }

    // Sprawdź limit przez funkcję Supabase
    const { data: limitData } = await supabase
      .rpc("can_generate_image", { p_user_id: userId });

    if (!limitData?.allowed) {
      const hoursLeft = 24 - new Date().getHours();
      return NextResponse.json({ error: "image_limit", hoursLeft }, { status: 429 });
    }

    // Generuj obraz
    const style = characterStyles[characterId] || "artistic, beautiful, detailed";
    const fullPrompt = `${prompt}. Style: ${style}. No text, no words in image.`;

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
    model: "gpt-image-1-mini",
    prompt: fullPrompt,
    n: 1,
    size: "1024x1024",
    quality: "low",
  }),
});

    const data = await response.json();

    if (data.error) {
      console.error("DALL-E error:", data.error);
      return NextResponse.json({ error: "generation_failed" }, { status: 500 });
    }

    const imageUrl = `data:image/png;base64,${data.data[0].b64_json}`;

    // Inkrementuj licznik
    await supabase.rpc("increment_image_usage", { p_user_id: userId });

    // Zapisz w historii
    await supabase.from("generated_images").insert({
      user_id: userId,
      character_id: characterId,
      prompt,
      image_url: imageUrl,
      was_free: isFree,
      cost_usd: 0.011,
    });

    const remaining = (limitData.remaining || 1) - 1;

    return NextResponse.json({ imageUrl, remaining });

  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json({ error: "generation_failed" }, { status: 500 });
  }
}