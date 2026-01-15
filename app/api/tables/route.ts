import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireRoleApi } from "@/app/lib/auth";

export async function GET() {
  try {
    await requireRoleApi(["ADMIN", "STAFF"]);
  } catch (error: any) {
    if (error.message === "UNAUTHENTICATED") {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
    if (error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tables = await prisma.table.findMany({
    orderBy: { code: "asc" },
  });

  return NextResponse.json(tables);
}

export async function POST(req: Request) {
  try {
    await requireRoleApi(["ADMIN"]);
  } catch (error: any) {
    if (error.message === "UNAUTHENTICATED") {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
    if (error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { code, seats } = body;

  if (!code) {
    return NextResponse.json({ error: "Table code is required" }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.findFirst();
  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }

  const table = await prisma.table.create({
    data: {
      code: String(code).trim().toUpperCase(),
      label: String(code).trim().toUpperCase(),
      seats: Number(seats) || 2,
      restaurantId: restaurant.id,
    },
  });

  return NextResponse.json(table, { status: 201 });
}

