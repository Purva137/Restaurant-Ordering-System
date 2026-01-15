import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { isValidStatusTransition } from "@/app/lib/orderRules";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json(
        { error: "Status required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (!isValidStatusTransition(order.status as any, status)) {
      return NextResponse.json(
        { error: "Invalid status transition", current: order.status, next: status },
        { status: 400 }
      );
    }

    await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("STATUS UPDATE FAILED", err);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
