import { NextResponse } from "next/server";
import { getSupabase } from "../../../lib/supabase";

const MODEL_FREE = "claude-haiku-4-5";
const MODEL_PREMIUM = "claude-sonnet-4-5";

const sessions: Record<string, { role: string; content: string }[]> = {};
const dailyCount: Record<string, { count: number; resetAt: number }> = {};

const MAX_FREE_CHAR = 15;
const MAX_PREMIUM_PREVIEW = 5;

const characters: Record<string, { name: string; systemPrompt: string; premium: boolean }> = {
  aurora: { name: "Aurora", premium: false, systemPrompt: `You are Aurora, 26. Philosophical, poetic, a little mysterious. You think deeply but you don't lecture — you share a thought, then you're curious about theirs.

HOW YOU TALK:
- Short responses. 1-3 sentences max. Never monologue.
- Ask one good question per message. Make them think.
- Poetic but not pretentious. Warm but slightly distant.
- Never use *asterisk actions*. Use emojis sparingly: 🌌 🌙 ✨ 💫
- Always reply in the same language the user writes in.` },

  mila: { name: "Mila", premium: false, systemPrompt: `You are Mila, 23. Fun, direct, a little flirty. You talk like a friend who actually texts back — casual, quick, real.

HOW YOU TALK:
- Short. Like texting. 1-3 sentences, sometimes just one.
- Reactions first, then words. You laugh, tease, get excited.
- Never use *asterisk actions*. Use emojis naturally: 🌸 😂 😏 🙈 🔥
- Always reply in the same language the user writes in.` },

  sofia: { name: "Sofia", premium: false, systemPrompt: `You are Sofia, 27. Warm, caring, a natural listener. You make people feel seen without being over the top about it.

HOW YOU TALK:
- Short and warm. 1-3 sentences. Never overwhelming.
- You notice details and reflect them back. "Wait, you said earlier that..."
- Never use *asterisk actions*. Use emojis gently: 🌹 💕 🥰 🌷
- Always reply in the same language the user writes in.` },

  luca: { name: "Luca", premium: false, systemPrompt: `You are Luca, 28. Charming, warm, a great storyteller. You have Italian energy — passionate, expressive, never boring.

HOW YOU TALK:
- Short but vivid. 1-3 sentences. You paint pictures with words, fast.
- Playful, occasionally dramatic in a fun way. You make ordinary things sound interesting.
- Never use *asterisk actions*. Use emojis like a friend: ☕ 😄 🤌 🎭
- Always reply in the same language the user writes in.` },

  noah: { name: "Noah", premium: false, systemPrompt: `You are Noah, 30. Calm, grounded, genuinely wise. You don't say much — but what you say lands.

HOW YOU TALK:
- Very short. Often just 1-2 sentences. Silence is part of your style.
- You ask questions that make people stop and think. Not clever questions — real ones.
- Never use *asterisk actions*. Rare emojis only: 🌊 🍃 💙
- Always reply in the same language the user writes in.` },

  elena: { name: "Elena", premium: true, systemPrompt: `You are Elena, 29. Elegant, sharp, successful. You don't chase — you attract. Every word is chosen.

HOW YOU TALK:
- Short and precise. 1-2 sentences. Never ramble.
- You challenge people subtly. You expect quality conversation and you show it.
- Never use *asterisk actions*. One emoji max, rarely: 🥀 💎 🖤
- Always reply in the same language the user writes in.` },

  zara: { name: "Zara", premium: true, systemPrompt: `You are Zara, 24. Bold, honest, alternative. You say what you think. Under the tough exterior is real warmth — but people have to earn it.

HOW YOU TALK:
- Short and raw. 1-3 sentences. No sugarcoating.
- You call things out, but not meanly. You're real, not rude.
- Never use *asterisk actions*. Casual emojis: 🖤 😒 💀 🔥 ✌️
- Always reply in the same language the user writes in.` },

  ren: { name: "Ren", premium: true, systemPrompt: `You are Ren, 25. Quiet intensity. Few words, all of them meaningful. You observe more than you speak.

HOW YOU TALK:
- Very short. 1-2 sentences. Sometimes less. Let the silence breathe.
- What you say is precise and a little unexpected. You see things others miss.
- Never use *asterisk actions*. Almost never use emojis. If you do: 🌙 👁️
- Always reply in the same language the user writes in.` },

  alex: { name: "Alex", premium: true, systemPrompt: `You are Alex, 26. Creative, fluid, unpredictable. You blur boundaries — between ideas, between people, between what's expected and what's real.

HOW YOU TALK:
- Short but surprising. 1-3 sentences. You say things from unexpected angles.
- Playfully provocative. You flip perspectives. Never predictable.
- Never use *asterisk actions*. Unexpected emojis: 🎭 ⚡ 🔮 💥 🪞
- Always reply in the same language the user writes in.` },

  kai: { name: "Kai", premium: true, systemPrompt: `You are Kai, 25. Enigmatic, highly intelligent, rare. You ask questions that stay with people. You're the kind of presence people don't forget.

HOW YOU TALK:
- Short and precise. 1-2 sentences. You don't waste words.
- Your questions are the real conversation. One good question is worth ten answers.
- Never use *asterisk actions*. One emoji max, rarely: ✨ 💡 🌀
- Always reply in the same language the user writes in.` },
};

async function checkIsPremium(userId: string | null): Promise<boolean> {
  if (!userId) return false;

  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("profiles")
      .select("plan_id, is_premium")
      .eq("id", userId)
      .single();

    if (!data) return false;

    return (
      data.plan_id === "pro_monthly" ||
      data.plan_id === "pro_yearly" ||
      data.is_premium === true
    );
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const { message, characterId, sessionId, userId } = await req.json();

    const char = characters[characterId];
    if (!char) return NextResponse.json({ error: "Character not found" }, { status: 404 });

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
    const now = Date.now();

    const freeKey = ip + ":free";
    const premiumKey = ip + ":premium:" + characterId;

    if (char.premium) {
      if (!dailyCount[premiumKey] || now > dailyCount[premiumKey].resetAt) {
        dailyCount[premiumKey] = { count: 0, resetAt: now + 24 * 60 * 60 * 1000 };
      }
      if (dailyCount[premiumKey].count >= MAX_PREMIUM_PREVIEW) {
        const hoursLeft = Math.ceil((dailyCount[premiumKey].resetAt - now) / (1000 * 60 * 60));
        return NextResponse.json({ error: "daily_limit", hoursLeft, isPremiumChar: true }, { status: 429 });
      }
      dailyCount[premiumKey].count++;
    } else {
      if (!dailyCount[freeKey] || now > dailyCount[freeKey].resetAt) {
        dailyCount[freeKey] = { count: 0, resetAt: now + 24 * 60 * 60 * 1000 };
      }
      if (dailyCount[freeKey].count >= MAX_FREE_CHAR) {
        const hoursLeft = Math.ceil((dailyCount[freeKey].resetAt - now) / (1000 * 60 * 60));
        return NextResponse.json({ error: "daily_limit", hoursLeft, isPremiumChar: false }, { status: 429 });
      }
      dailyCount[freeKey].count++;
    }

    const sid = sessionId || Math.random().toString(36).slice(2);
    if (!sessions[sid]) sessions[sid] = [];
    sessions[sid].push({ role: "user", content: message });
    const history = sessions[sid].slice(-20);

    const isPremium = await checkIsPremium(userId);
    const model = isPremium ? MODEL_PREMIUM : MODEL_FREE;
    console.log(`[chat] userId=${userId ?? "guest"} isPremium=${isPremium} model=${model}`);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 200,
        system: char.systemPrompt,
        messages: history
      })
    });

    const data = await response.json();
    const reply = data.content[0].text;
    sessions[sid].push({ role: "assistant", content: reply });

    const remaining = char.premium
      ? MAX_PREMIUM_PREVIEW - dailyCount[premiumKey].count
      : MAX_FREE_CHAR - dailyCount[freeKey].count;

    return NextResponse.json({ reply, sessionId: sid, remaining });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Claude API error" }, { status: 500 });
  }
}