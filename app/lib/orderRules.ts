// app/lib/orderRules.ts

export type OrderStatus =
  | "RECEIVED"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

/**
 * Defines which status transitions are allowed
 */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  RECEIVED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY"],
  READY: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

/**
 * Check if a status change is allowed
 */
export function isValidStatusTransition(
  currentStatus: OrderStatus,
  nextStatus: OrderStatus
): boolean {
  const allowedNextStatuses =
    ORDER_STATUS_TRANSITIONS[currentStatus] || [];

  return allowedNextStatuses.includes(nextStatus);
}
