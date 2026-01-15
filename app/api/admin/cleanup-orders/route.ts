import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireRoleApi } from "@/app/lib/auth";

export async function DELETE() {
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

  try {
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});

    return NextResponse.json({ message: "All orders cleared" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to cleanup orders" },
      { status: 500 }
    );
  }
}
