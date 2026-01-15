import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const menuItems = await prisma.menuItem.findMany({
      where: {
        restaurantId: id,
        isAvailable: true,
      },
    });

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error("GET MENU ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
