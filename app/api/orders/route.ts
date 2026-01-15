import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { checkRateLimit, getClientIp } from "@/app/lib/rateLimit";
import { normalizeTableCode, isValidQuantity } from "@/app/lib/validators";

export async function POST(req: Request) {
  try {
    const rateKey = `orders:${getClientIp(req)}`;
    const rate = checkRateLimit(rateKey, 10, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const body = await req.json();
    const {
      tableCode,
      tableNumber,
      items,
      customerName,
      customerNote,
      idempotencyKey,
      restaurantId,
      paymentMethod,
      paymentReference,
      taxAmount,
      tipAmount,
    } = body;

    if (!tableCode && !tableNumber) {
      return NextResponse.json(
        { error: "tableCode or tableNumber missing" },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Order items missing" },
        { status: 400 }
      );
    }

    if (idempotencyKey) {
      const existing = await prisma.order.findUnique({
        where: { idempotencyKey },
      });
      if (existing) {
        return NextResponse.json({ success: true, orderId: existing.id });
      }
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

    const resolvedTableCode = normalizeTableCode(
      String(tableCode ?? tableNumber)
    );
    const table = await prisma.table.upsert({
      where: { code: resolvedTableCode },
      create: {
        code: resolvedTableCode,
        label: resolvedTableCode,
        restaurantId: restaurant.id,
      },
      update: {},
    });

    const menuItemIds = items.map((item: any) => item.menuItemId ?? item.id);
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
        restaurantId: restaurant.id,
      },
    });

    if (menuItems.length !== menuItemIds.length) {
      return NextResponse.json(
        { error: "One or more menu items are invalid" },
        { status: 400 }
      );
    }

    const orderItemsData = items.map((item: any) => {
      const menuItemId = item.menuItemId ?? item.id;
      const menuItem = menuItems.find((m) => m.id === menuItemId);
      const quantity = Number(item.quantity ?? item.qty ?? 0);

      if (!menuItem || !isValidQuantity(quantity)) {
        return null;
      }

      return {
        menuItemId: menuItem.id,
        menuItemName: menuItem.name,
        quantity,
        price: menuItem.price,
      };
    });

    if (orderItemsData.some((item) => item === null)) {
      return NextResponse.json(
        { error: "Invalid order item payload" },
        { status: 400 }
      );
    }

    const sanitizedItems = orderItemsData.filter(Boolean) as {
      menuItemId: string;
      menuItemName: string;
      quantity: number;
      price: number;
    }[];

    const subtotal = sanitizedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const normalizedTax = Math.max(0, Number(taxAmount ?? 0));
    const normalizedTip = Math.max(0, Number(tipAmount ?? 0));
    const totalAmount = subtotal + normalizedTax + normalizedTip;

    const normalizedPaymentMethod = String(paymentMethod ?? "COUNTER").toUpperCase();
    if (!["CARD", "WALLET", "COUNTER"].includes(normalizedPaymentMethod)) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        restaurantId: restaurant.id,
        tableId: table.id,
        tableNumber: resolvedTableCode,
        customerName: customerName ?? null,
        customerNote: customerNote ?? "",
        status: "RECEIVED",
        totalAmount,
        taxAmount: normalizedTax,
        tipAmount: normalizedTip,
        paymentMethod: normalizedPaymentMethod,
        paymentReference: paymentReference ?? null,
        idempotencyKey: idempotencyKey ?? null,
        items: {
          create: sanitizedItems,
        },
      },
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error("ORDER CREATE FAILED:", err);
    return NextResponse.json(
      { error: "Order failed" },
      { status: 500 }
    );
  }
}
