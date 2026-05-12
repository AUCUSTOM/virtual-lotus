import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

const PLANS = {
  monthly: { price: 999, name: "VirtualLotus Premium - Monthly" },
  yearly:  { price: 7999, name: "VirtualLotus Premium - Yearly" },
};

export async function POST(req: Request) {
  try {
    const { plan, successUrl, cancelUrl } = await req.json();

    const selectedPlan = PLANS[plan as keyof typeof PLANS] || PLANS.monthly;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal", "link"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: selectedPlan.name },
            unit_amount: selectedPlan.price,
            recurring: {
              interval: plan === "yearly" ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl || `${req.headers.get("origin")}/success`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/`,
      automatic_tax: { enabled: true },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: "Payment error" }, { status: 500 });
  }
}
