import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireRoleApi } from "@/app/lib/auth";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfYear(date: Date) {
  return new Date(date.getFullYear(), 0, 1);
}

function startOfNextDay(date: Date) {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  return next;
}

function startOfNextMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

export async function GET() {
  try {
    await requireRoleApi(["ADMIN"]);

    const now = new Date();
    const dayStart = startOfDay(now);
    const monthStart = startOfMonth(now);
    const yearStart = startOfYear(now);
    const dayEnd = startOfNextDay(dayStart);
    const monthEnd = startOfNextMonth(monthStart);

    const [restaurant, totalTables] = await Promise.all([
      prisma.restaurant.findFirst(),
      prisma.table.count(),
    ]);

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const [ordersToday, ordersMonth, ordersYear] = await Promise.all([
      prisma.order.count({
        where: { restaurantId: restaurant.id, createdAt: { gte: dayStart } },
      }),
      prisma.order.count({
        where: { restaurantId: restaurant.id, createdAt: { gte: monthStart } },
      }),
      prisma.order.count({
        where: { restaurantId: restaurant.id, createdAt: { gte: yearStart } },
      }),
    ]);

    const [revenueToday, revenueMonth, revenueYear] = await Promise.all([
      prisma.order.aggregate({
        where: { restaurantId: restaurant.id, createdAt: { gte: dayStart } },
        _sum: { totalAmount: true },
      }),
      prisma.order.aggregate({
        where: { restaurantId: restaurant.id, createdAt: { gte: monthStart } },
        _sum: { totalAmount: true },
      }),
      prisma.order.aggregate({
        where: { restaurantId: restaurant.id, createdAt: { gte: yearStart } },
        _sum: { totalAmount: true },
      }),
    ]);

    const [reservationsToday, reservationsMonth, reservationsYear] =
      await Promise.all([
        prisma.reservation.count({
          where: {
            restaurantId: restaurant.id,
            dateTime: { gte: dayStart, lt: dayEnd },
          },
        }),
        prisma.reservation.count({
          where: {
            restaurantId: restaurant.id,
            dateTime: { gte: monthStart, lt: monthEnd },
          },
        }),
        prisma.reservation.count({
          where: {
            restaurantId: restaurant.id,
            dateTime: { gte: yearStart },
          },
        }),
      ]);

    const [cancelledToday, cancelledMonth, cancelledYear] = await Promise.all([
      prisma.reservation.count({
        where: {
          restaurantId: restaurant.id,
          dateTime: { gte: dayStart, lt: dayEnd },
          status: "CANCELLED",
        },
      }),
      prisma.reservation.count({
        where: {
          restaurantId: restaurant.id,
          dateTime: { gte: monthStart, lt: monthEnd },
          status: "CANCELLED",
        },
      }),
      prisma.reservation.count({
        where: {
          restaurantId: restaurant.id,
          dateTime: { gte: yearStart },
          status: "CANCELLED",
        },
      }),
    ]);

    const currentMonthIndex = now.getMonth();
    const reservationsByMonth = await Promise.all(
      Array.from({ length: currentMonthIndex + 1 }, (_, index) => {
        const start = new Date(now.getFullYear(), index, 1);
        const end = new Date(now.getFullYear(), index + 1, 1);
        return prisma.reservation.count({
          where: {
            restaurantId: restaurant.id,
            dateTime: { gte: start, lt: end },
          },
        });
      })
    );

    const reservationMonths = reservationsByMonth.map((count, index) => ({
      month: new Date(now.getFullYear(), index, 1).toLocaleString("en-US", {
        month: "short",
      }),
      count,
    }));

    const topItems = await prisma.orderItem.groupBy({
      by: ["menuItemName"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
      where: {
        order: {
          restaurantId: restaurant.id,
          createdAt: { gte: monthStart },
        },
      },
    });

    const ordersForHeatmap = await prisma.order.findMany({
      where: {
        restaurantId: restaurant.id,
        createdAt: { gte: dayStart },
      },
      select: { createdAt: true },
    });

    const hourBuckets = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: 0,
    }));

    ordersForHeatmap.forEach((order) => {
      const hour = order.createdAt.getHours();
      hourBuckets[hour].count += 1;
    });

    const distinctTablesToday = await prisma.order.findMany({
      where: { restaurantId: restaurant.id, createdAt: { gte: dayStart } },
      distinct: ["tableId"],
      select: { tableId: true },
    });

    const tableUtilizationRate =
      totalTables > 0 ? distinctTablesToday.length / totalTables : 0;

    const completedOrders = await prisma.order.findMany({
      where: {
        restaurantId: restaurant.id,
        status: "COMPLETED",
        createdAt: { gte: dayStart },
      },
      select: { createdAt: true, updatedAt: true },
    });

    const avgPrepTimeMs =
      completedOrders.length > 0
        ? completedOrders.reduce(
            (sum, order) => sum + (order.updatedAt.getTime() - order.createdAt.getTime()),
            0
          ) / completedOrders.length
        : 0;

    const handledCalls = await prisma.staffCall.findMany({
      where: {
        restaurantId: restaurant.id,
        status: "HANDLED",
        createdAt: { gte: dayStart },
      },
      select: { createdAt: true, handledAt: true },
    });

    const avgStaffResponseMs =
      handledCalls.length > 0
        ? handledCalls.reduce((sum, call) => {
            if (!call.handledAt) return sum;
            return sum + (call.handledAt.getTime() - call.createdAt.getTime());
          }, 0) / handledCalls.length
        : 0;

    const walkInOrders = ordersToday;
    const reservationRatio =
      reservationsToday > 0 ? reservationsToday / (walkInOrders + reservationsToday) : 0;

    return NextResponse.json({
      orders: {
        today: ordersToday,
        month: ordersMonth,
        year: ordersYear,
      },
      revenue: {
        today: revenueToday._sum.totalAmount ?? 0,
        month: revenueMonth._sum.totalAmount ?? 0,
        year: revenueYear._sum.totalAmount ?? 0,
      },
      reservations: {
        today: reservationsToday,
        month: reservationsMonth,
        year: reservationsYear,
      },
      reservationsCancelled: {
        today: cancelledToday,
        month: cancelledMonth,
        year: cancelledYear,
      },
      bda: {
        topItems: topItems.map((item) => ({
          name: item.menuItemName,
          quantity: item._sum.quantity ?? 0,
        })),
        peakHours: hourBuckets,
        tableUtilizationRate,
        avgPrepTimeMs,
        avgStaffResponseMs,
        reservationRatio,
      },
      reservationsByMonth: reservationMonths,
    });
  } catch (error) {
    console.error("GET /api/admin/analytics error", error);
    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 }
    );
  }
}

