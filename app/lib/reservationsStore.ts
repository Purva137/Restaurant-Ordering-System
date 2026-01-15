export type ReservationStatus = "confirmed" | "cancelled" | "no-show";

export type Reservation = {
  id: string;
  name: string;
  phone: string;
  date: string;   // YYYY-MM-DD
  time: string;
  guests: number;
  status: ReservationStatus;
};

export let reservations: Reservation[] = [
  {
    id: "RES-01",
    name: "Amit Gupta",
    phone: "9XXXXXXXXX",
    date: "2026-01-04",
    time: "7:30 PM",
    guests: 4,
    status: "confirmed",
  },
];

export function addReservation(res: Reservation) {
  reservations.push(res);
}

export function updateReservationStatus(
  id: string,
  status: ReservationStatus
) {
  reservations = reservations.map((r) =>
    r.id === id ? { ...r, status } : r
  );
}
