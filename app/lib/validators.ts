export function normalizeTableCode(value: string) {
  const trimmed = value.trim().toUpperCase();
  return trimmed.replace(/\s+/g, "_");
}

export function isValidPhone(value: string) {
  return /^\d{10}$/.test(value.trim());
}

export function parseIsoDateTime(date: string, time: string) {
  const combined = `${date} ${time}`;
  const dateTime = new Date(combined);
  return Number.isNaN(dateTime.getTime()) ? null : dateTime;
}

export function isValidQuantity(value: unknown) {
  const quantity = Number(value);
  return Number.isFinite(quantity) && quantity > 0;
}

