import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const status = body.status ?? "HANDLED";

    const call = await prisma.staffCall.update({
      where: { id },
      data: {
        status,
        handledAt: status === "HANDLED" ? new Date() : null,
      },
    });

    return NextResponse.json(call);
  } catch (error) {
    console.error("PATCH /api/staff-calls/[id] error", error);
    return NextResponse.json(
      { error: "Failed to update staff call" },
      { status: 500 }
    );
  }
}

