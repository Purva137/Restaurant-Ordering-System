import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireRoleApi } from "@/app/lib/auth";

export async function POST(req: Request) {
  try {
    // 🔐 Role check - Only ADMIN can create menu items
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

  try {
    const body = await req.json();
    const {
      restaurantId,
      name,
      description,
      price,
      imageUrl,
      isAvailable,
      category,
    } = body;

    if (!restaurantId || !name || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        restaurantId,
        name,
        description,
        price,
        imageUrl: imageUrl ?? null,
        isAvailable: isAvailable ?? true,
        category: category ?? null,
      },
    });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    console.error("CREATE MENU ITEM ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
