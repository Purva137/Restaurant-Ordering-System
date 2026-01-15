import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { checkRateLimit, getClientIp } from "@/app/lib/rateLimit";
import { isValidPhone, parseIsoDateTime } from "@/app/lib/validators";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");
    const status = searchParams.get("status") ?? undefined;

    const restaurant =
      (restaurantId
        ? await prisma.restaurant.findUnique({ where: { id: restaurantId } })
        : await prisma.restaurant.findFirst()) ?? null;

    if (!restaurant) {
      return NextResponse.json([]);
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        restaurantId: restaurant.id,
        status,
      },
      orderBy: { dateTime: "asc" },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error("GET /api/reservations error", error);
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const rateKey = `reservations:${getClientIp(req)}`;
    const rate = checkRateLimit(rateKey, 5, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const body = await req.json();
    const {
      restaurantId,
      name,
      phone,
      date,
      time,
      partySize,
      notes,
    } = body;

    if (!name || !phone || !date || !time || !partySize) {
      return NextResponse.json(
        { error: "Missing required reservation fields" },
        { status: 400 }
      );
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number" },
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

    const parsedPartySize = Number(partySize);
    if (!Number.isFinite(parsedPartySize) || parsedPartySize < 1 || parsedPartySize > 20) {
      return NextResponse.json(
        { error: "Invalid party size" },
        { status: 400 }
      );
    }

    const dateTime = parseIsoDateTime(date, time);
    if (!dateTime) {
      return NextResponse.json(
        { error: "Invalid date or time" },
        { status: 400 }
      );
    }

    const now = new Date();
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    if (dateTime < now || dateTime > maxDate) {
      return NextResponse.json(
        { error: "Reservation date must be within the next 3 months" },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        restaurantId: restaurant.id,
        name,
        phone,
        partySize: parsedPartySize,
        dateTime,
        notes: notes ?? null,
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error("POST /api/reservations error", error);
    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 }
    );
  }
}

