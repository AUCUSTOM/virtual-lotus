import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabase";

const MODEL_FREE = "claude-haiku-4-5";
const MODEL_PREMIUM = "claude-sonnet-4-5";

// Pamięć sesji rozmów (zostaje w pamięci serwera na razie — v2 zrobimy chat_sessions w bazie)
const sessions: Record<string, { role: string; content: string }[]> = {};

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
    const supabase = getSupabaseAdmin();
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
    const { message, characterId, sessionId, userId, lang } = await req.json();

const languageNames: Record<string, string> = {
  en: "English", pl: "Polish", nl: "Dutch", de: "German",
  fr: "French", es: "Spanish", ja: "Japanese", ko: "Korean",
  zh: "Chinese", hi: "Hindi"
};
const langName = languageNames[lang as string] || "English";

    const char = characters[characterId];
    if (!char) return NextResponse.json({ error: "Character not found" }, { status: 404 });

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";

    const isPremiumUser = await checkIsPremium(userId);
    const supabase = getSupabaseAdmin();

    // ===== Sprawdź limit przez Supabase RPC =====
    const { data: limitCheck, error: limitError } = await supabase.rpc("can_send_message", {
      p_user_id: userId || null,
      p_ip: ip,
      p_is_premium_user: isPremiumUser,
      p_is_premium_char: char.premium,
    });

    if (limitError) {
      console.error("[chat] can_send_message error:", limitError);
      return NextResponse.json({ error: "limit_check_failed" }, { status: 500 });
    }

    if (!limitCheck?.allowed) {
      const reason = limitCheck?.reason || "limit";
      const hoursLeft = limitCheck?.hoursLeft || 0;

      // Gość próbuje premium char → modal "sign in"
      if (reason === "sign_in_required") {
        return NextResponse.json({ error: "sign_in_required", isPremiumChar: true }, { status: 401 });
      }

      // Free user wyczerpał preview 3/3 dla premium chars
      if (reason === "preview_limit") {
        return NextResponse.json({ error: "preview_limit", isPremiumChar: true }, { status: 429 });
      }

      // Gość wyczerpał 10 lifetime
      if (reason === "guest_limit") {
        return NextResponse.json({ error: "guest_limit", isPremiumChar: char.premium }, { status: 429 });
      }

      // Standardowy limit dzienny (free 15/day lub premium 150/day)
      return NextResponse.json({ error: "daily_limit", hoursLeft, isPremiumChar: char.premium }, { status: 429 });
    }

    // ===== Sesja rozmowy =====
    const sid = sessionId || Math.random().toString(36).slice(2);
    if (!sessions[sid]) sessions[sid] = [];
    sessions[sid].push({ role: "user", content: message });
    const history = sessions[sid].slice(-20);

    // ===== Model split =====
    const model = isPremiumUser ? MODEL_PREMIUM : MODEL_FREE;
    console.log(`[chat] userId=${userId ?? "guest"} ip=${ip} isPremium=${isPremiumUser} isPremiumChar=${char.premium} model=${model} remaining=${limitCheck?.remaining}`);

    // ===== Anthropic API call =====
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 200,
        system: `${char.systemPrompt}\n\nCRITICAL: Always reply in ${langName}. Even for short user messages like "hi" or "hej", reply in ${langName}. Never switch language regardless of how short the input is. Your character traits stay the same in every language.`,
        messages: history,
      }),
    });

    const data = await response.json();
    const reply = data.content[0].text;
    sessions[sid].push({ role: "assistant", content: reply });

    // ===== Inkrementuj licznik w Supabase =====
    const { error: incError } = await supabase.rpc("increment_message_usage", {
      p_user_id: userId || null,
      p_ip: ip,
      p_is_premium_char: char.premium,
    });

    if (incError) {
      console.error("[chat] increment_message_usage error:", incError);
      // Nie blokujemy odpowiedzi — wiadomość już poszła
    }

    return NextResponse.json({
      reply,
      sessionId: sid,
      remaining: limitCheck?.remaining ?? 0,
    });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Claude API error" }, { status: 500 });
  }
}