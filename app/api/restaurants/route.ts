export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireRoleApi } from "@/app/lib/auth";

export async function POST(req: Request) {
  try {
    // 🔐 Role check - Only ADMIN can create restaurants
    const user = await requireRoleApi(["ADMIN"]);
  } catch (error: any) {
    if (error.message === "UNAUTHENTICATED") {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
    if (error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const restaurant = await prisma.restaurant.create({
      data: {
        name: body.name,
        description: body.description ?? null,
        isActive: body.isActive ?? true,
        ownerId: user.id,
      },
    });

    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    console.error("CREATE RESTAURANT ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
