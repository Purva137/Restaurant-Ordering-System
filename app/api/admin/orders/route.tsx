import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireRoleApi } from "@/app/lib/auth";

export async function GET(req: Request) {
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

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const orders = await prisma.order.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  const result = orders.map((o) => ({
    id: o.id,
    tableNumber: o.tableNumber,
    status: o.status,
    itemsCount: o.items.length,
    totalAmount: o.totalAmount,
    createdAt: o.createdAt,
  }));

  return NextResponse.json(result); // ✅ ALWAYS ARRAY
}
