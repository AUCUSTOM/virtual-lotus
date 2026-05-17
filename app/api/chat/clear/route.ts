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
      return NextResponse.json({ error: "missing_params" }, { status: 400 });
    }

    const isPremium = await checkIsPremium(userId);
    if (!isPremium) {
      return NextResponse.json({ error: "premium_required" }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("user_id", userId)
      .eq("character_id", characterId);

    if (error) {
      console.error("[chat/clear] delete error:", error);
      return NextResponse.json({ error: "delete_failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[chat/clear] API error:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}