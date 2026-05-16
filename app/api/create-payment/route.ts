import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

const PLANS = {
  monthly: process.env.STRIPE_PRICE_MONTHLY!,
  yearly:  process.env.STRIPE_PRICE_YEARLY!,
};

export async function POST(req: Request) {
  try {
    const { plan, userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
    }

    const priceId = PLANS[plan as keyof typeof PLANS] || PLANS.monthly;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal", "link"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/?success=true`,
      cancel_url:  `${req.headers.get("origin")}/`,
      automatic_tax: { enabled: true },
      metadata: {
        userId,
        plan: plan || "monthly",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: "Payment error" }, { status: 500 });
  }
}