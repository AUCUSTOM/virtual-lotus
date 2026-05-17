import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabase";

async function checkIsPremium(userId: string): Promise<boolean> {
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
    const { userId, characterId } = await req.json();

    if (!userId || !characterId) {
      return NextResponse.json({ messages: [], sessionId: null });
    }

    // Tylko premium ma historię
    const isPremium = await checkIsPremium(userId);
    if (!isPremium) {
      return NextResponse.json({ messages: [], sessionId: null });
    }

    const supabase = getSupabaseAdmin();

    // Znajdź sesję
    const { data: session } = await supabase
      .from("chat_sessions")
      .select("id")
      .eq("user_id", userId)
      .eq("character_id", characterId)
      .maybeSingle();

    if (!session) {
      // Brak sesji = nowa rozmowa, brak historii
      return NextResponse.json({ messages: [], sessionId: null });
    }

    // Załaduj wiadomości (ostatnie 20, chronologicznie)
    const { data: messages, error } = await supabase
      .from("messages")
      .select("role, content")
      .eq("session_id", session.id)
      .order("created_at", { ascending: true })
      .limit(20);

    if (error) {
      console.error("[history] load error:", error);
      return NextResponse.json({ messages: [], sessionId: null });
    }

    return NextResponse.json({
      messages: messages || [],
      sessionId: session.id,
    });
  } catch (error) {
    console.error("[history] API error:", error);
    return NextResponse.json({ messages: [], sessionId: null });
  }
}