import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

if (!stripeSecretKey) {
  console.warn("STRIPE_SECRET_KEY is not set. Stripe payments will fail.");
}

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" })
  : null;

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { items, taxAmount, tipAmount, paymentMethod, idempotencyKey, tableCode } =
      body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Missing line items" },
        { status: 400 }
      );
    }

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: Number(item.quantity ?? 1),
    }));

    if (Number(taxAmount) > 0) {
      lineItems.push({
        price_data: {
          currency: "inr",
          product_data: { name: "Tax" },
          unit_amount: Math.round(Number(taxAmount) * 100),
        },
        quantity: 1,
      });
    }

    if (Number(tipAmount) > 0) {
      lineItems.push({
        price_data: {
          currency: "inr",
          product_data: { name: "Tip" },
          unit_amount: Math.round(Number(tipAmount) * 100),
        },
        quantity: 1,
      });
    }

    const method = String(paymentMethod ?? "CARD").toUpperCase();
    const paymentTypes =
      method === "WALLET" ? ["upi"] : ["card"];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: paymentTypes as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
      line_items: lineItems,
      success_url: `${baseUrl}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?payment=cancelled`,
      metadata: {
        idempotencyKey: idempotencyKey ?? "",
        tableCode: tableCode ?? "",
        paymentMethod: method,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout session error:", error);
    return NextResponse.json(
      { error: "Failed to start payment" },
      { status: 500 }
    );
  }
}

