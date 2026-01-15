import { NextResponse } from "next/server";
import crypto from "crypto";

const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

export async function POST(req: Request) {
  try {
    if (!razorpayKeySecret) {
      return NextResponse.json(
        { error: "Razorpay is not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { orderId, paymentId, signature } = body;

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: "Missing payment verification fields" },
        { status: 400 }
      );
    }

    const payload = `${orderId}|${paymentId}`;
    const expected = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(payload)
      .digest("hex");

    if (expected !== signature) {
      return NextResponse.json(
        { verified: false },
        { status: 400 }
      );
    }

    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error("Razorpay verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify Razorpay payment" },
      { status: 500 }
    );
  }
}

