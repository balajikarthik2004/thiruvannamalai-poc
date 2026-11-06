import { DARSHAN_CATEGORIES, type BookingCart } from "../constants";

export interface BookingLine {
  id: string;
  label: string;
  /** Optional secondary text, e.g. "x2" or "3 nights". */
  note?: string;
  amount: number;
}

export interface BookingDetails {
  categoryId: string;
  persons: number;
}

/**
 * Single source of truth for booking prices. Both the live sidebar subtotal (Select Services)
 * and the Checkout total read from here, so they can never disagree.
 */
export function computeBookingTotals(cart: BookingCart, details: BookingDetails) {
  const persons = details.persons || 1;
  const category = DARSHAN_CATEGORIES.find((c) => c.id === details.categoryId);

  const darshan: BookingLine | null = category
    ? { id: `darshan-${category.id}`, label: category.name, note: `${persons} × ₹${category.price}`, amount: category.price * persons }
    : null;

  const services: BookingLine[] = [
    ...cart.poojas.map((p) => ({ id: p.id, label: p.name, amount: p.price })),
    ...(cart.archana.optIn
      ? [{ id: "archana", label: "Archana Thattu", note: cart.archana.partnerDelivery ? "with flower garland & rice" : undefined, amount: cart.archana.price }]
      : []),
    ...cart.prasadam.map((p) => ({ id: p.id, label: p.name, note: `x${p.qty}`, amount: p.price * p.qty })),
    ...(cart.accommodations.type
      ? [{ id: "room", label: cart.accommodations.type, note: `${cart.accommodations.nights} night${cart.accommodations.nights > 1 ? "s" : ""}`, amount: cart.accommodations.price * cart.accommodations.nights }]
      : []),
    ...(cart.venues.type ? [{ id: "venue", label: cart.venues.type, amount: cart.venues.price }] : []),
    ...(cart.donations?.amount && cart.donations.frequency !== "pledge"
      ? [{ id: "donation", label: "Temple Donation", amount: cart.donations.amount }]
      : []),
  ];

  const servicesTotal = services.reduce((sum, l) => sum + l.amount, 0);
  const total = (darshan?.amount ?? 0) + servicesTotal;

  return { category, darshan, services, servicesTotal, total };
}

export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;
