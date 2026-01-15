import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { checkRateLimit, getClientIp } from "@/app/lib/rateLimit";
import { normalizeTableCode } from "@/app/lib/validators";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");
    const status = searchParams.get("status") ?? "OPEN";

    const restaurant =
      (restaurantId
        ? await prisma.restaurant.findUnique({ where: { id: restaurantId } })
        : await prisma.restaurant.findFirst()) ?? null;

    if (!restaurant) {
      return NextResponse.json([]);
    }

    const calls = await prisma.staffCall.findMany({
      where: {
        restaurantId: restaurant.id,
        status: status as "OPEN" | "HANDLED",
      },
      include: {
        table: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(calls);
  } catch (error) {
    console.error("GET /api/staff-calls error", error);
    return NextResponse.json(
      { error: "Failed to fetch staff calls" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const rateKey = `staff-calls:${getClientIp(req)}`;
    const rate = checkRateLimit(rateKey, 6, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { restaurantId, tableCode } = body;

    if (!tableCode) {
      return NextResponse.json(
        { error: "tableCode is required" },
        { status: 400 }
      );
    }

    const restaurant =
      (restaurantId
        ? await prisma.restaurant.findUnique({ where: { id: restaurantId } })
        : await prisma.restaurant.findFirst()) ?? null;

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    const normalizedCode = normalizeTableCode(String(tableCode));
    const table = await prisma.table.upsert({
      where: { code: normalizedCode },
      create: {
        code: normalizedCode,
        label: normalizedCode,
        restaurantId: restaurant.id,
      },
      update: {},
    });

    const call = await prisma.staffCall.create({
      data: {
        restaurantId: restaurant.id,
        tableId: table.id,
      },
    });

    return NextResponse.json(call, { status: 201 });
  } catch (error) {
    console.error("POST /api/staff-calls error", error);
    return NextResponse.json(
      { error: "Failed to create staff call" },
      { status: 500 }
    );
  }
}

