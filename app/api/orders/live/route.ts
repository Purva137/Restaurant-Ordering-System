import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");

    const resolvedRestaurantId =
      restaurantId ??
      (await prisma.restaurant.findFirst({ select: { id: true } }))?.id;

    if (!resolvedRestaurantId) {
      return NextResponse.json([]);
    }

    const orders = await prisma.order.findMany({
      where: {
        restaurantId: resolvedRestaurantId,
        status: { in: ["RECEIVED", "PREPARING", "READY"] },
      },
      orderBy: { createdAt: "asc" },
      include: {
        items: true,
      },
    });

    return NextResponse.json(orders); // ✅ ALWAYS JSON
  } catch (err) {
    console.error("LIVE ORDERS FAILED", err);
    return NextResponse.json([]); // ✅ NEVER EMPTY RESPONSE
  }
}
