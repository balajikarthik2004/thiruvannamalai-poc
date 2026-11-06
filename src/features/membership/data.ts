import { Star, Users, Flame, Crown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type BillingCycle = "year" | "lifetime";

export interface MembershipPlan {
  id: string;
  name: string;
  sanskritName: string;
  tagline: string;
  /** Price for temples inside India (₹). */
  inr: number;
  /** Price for the overseas (USA) temples ($). */
  usd: number;
  cycle: BillingCycle;
  /** How many devotees the membership covers. */
  seats: number;
  icon: LucideIcon;
  accent: string;
  gradient: string;
  popular?: boolean;
  benefits: string[];
  /** Same entitlements, spelled out in plain words for the scannable card. */
  cardBenefits: { title: string; detail: string }[];
  /** Short line printed under the price. */
  note: string;
}

/**
 * Tier structure and amounts follow the schemes actually run by Indian temple
 * trusts — annual devotee membership, the ₹5,000 "lifetime archana" scheme,
 * TTD SRIVANI-style break-darshan entitlement, and the ₹55,555 ISKCON-style
 * life patron donation. USD amounts mirror the US temple pattern
 * ($101 individual / $251 family / $1,116 life member).
 */
export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "nithya",
    name: "Nithya Sevak",
    sanskritName: "நித்ய சேவகர்",
    tagline: "For one devotee",
    inr: 1116,
    usd: 101,
    cycle: "year",
    seats: 1,
    icon: Star,
    accent: "#0284C7",
    gradient: "from-sky-500 to-cyan-500",
    note: "Renews yearly",
    benefits: ["Photo membership card", "Free archana on your birth star", "Priority queue lane"],
    cardBenefits: [
      {
        title: "Your own temple ID card",
        detail: "A printed card with your photo and member number. Carry it on every visit.",
      },
      {
        title: "One free archana each year",
        detail: "On your birth star, the priest says your name during the pooja. No extra charge.",
      },
      {
        title: "Skip the ordinary queue",
        detail: "Use the members' lane on normal days and wait far less for darshan.",
      },
    ],
  },
  {
    id: "kudumba",
    name: "Kudumba Sevak",
    sanskritName: "குடும்ப சேவகர்",
    tagline: "For a family of four",
    inr: 2500,
    usd: 251,
    cycle: "year",
    seats: 4,
    icon: Users,
    accent: "#7C3AED",
    gradient: "from-violet-500 to-fuchsia-500",
    popular: true,
    note: "Renews yearly",
    benefits: [
      "Everything in Nithya Sevak, ×4",
      "10% off poojas and abhishekam",
      "2 prasadam coupons every visit",
    ],
    cardBenefits: [
      {
        title: "Covers four people",
        detail: "You, your spouse and two more family members — each gets their own card.",
      },
      {
        title: "10% off every paid pooja",
        detail: "Applies to archana, abhishekam and homam booked at this temple.",
      },
      {
        title: "Two free meal coupons per visit",
        detail: "Exchange them at the annadhanam counter for prasadam meals.",
      },
    ],
  },
  {
    id: "archana",
    name: "Archana Life Member",
    sanskritName: "அர்ச்சனை வாழ்நாள்",
    tagline: "Your name in the sanctum, for life",
    inr: 5000,
    usd: 501,
    cycle: "lifetime",
    seats: 2,
    icon: Flame,
    accent: "#D97706",
    gradient: "from-amber-500 to-orange-500",
    note: "One-time, never renews",
    benefits: [
      "Yearly archana on your birth star, for life",
      "Prasadam couriered to your address",
      "All Nithya Sevak benefits, for life",
    ],
    cardBenefits: [
      {
        title: "Archana every year, for life",
        detail:
          "Paid once. The priest performs it in your name on your birth star, every year, forever.",
      },
      {
        title: "Prasadam posted to your home",
        detail: "After each archana the temple couriers the prasadam to your address.",
      },
      {
        title: "A card that never expires",
        detail: "No renewal, no yearly fee. All Nithya Sevak benefits stay active for life.",
      },
    ],
  },
  {
    id: "patron",
    name: "Life Patron",
    sanskritName: "வாழ்நாள் புரவலர்",
    tagline: "For families endowing the temple",
    inr: 55555,
    usd: 1116,
    cycle: "lifetime",
    seats: 6,
    icon: Crown,
    accent: "#B45309",
    gradient: "from-yellow-500 via-amber-500 to-orange-600",
    note: "One-time, EMI available",
    benefits: [
      "2 VIP break-darshan passes a year",
      "3 nights at the temple guest house",
      "Name engraved on the donor plaque",
    ],
    cardBenefits: [
      {
        title: "Two VIP darshan passes a year",
        detail:
          "Enter through the special-entry gate and reach the sanctum without the main queue.",
      },
      {
        title: "Three free nights at the guest house",
        detail: "Temple accommodation for your family, including two prasadam meals each day.",
      },
      {
        title: "Your name on the donor plaque",
        detail: "Engraved on the temple's stone donor board, kept permanently.",
      },
    ],
  },
];

/** Perks that ship with every tier — shown once instead of repeated per card. */
export const UNIVERSAL_PERKS = [
  "80G tax exemption receipt",
  "Digital card, ready to scan",
  "100% goes to your temple",
];

export const MEMBERSHIP_FAQ = [
  {
    q: "Is this eligible for tax deduction?",
    a: "Yes — the trust is registered under Sections 12A and 80G. Your receipt is e-mailed as soon as the payment succeeds. Add your PAN at checkout to claim it.",
  },
  {
    q: "Can I pay in instalments?",
    a: "Life Patron can be split into 3, 6 or 12 monthly instalments via Razorpay EMI. Annual plans are charged once and can be cancelled before renewal.",
  },
  {
    q: "How do I use it at the temple?",
    a: "Show the QR on your digital card at the members' counter, or carry the printed card posted to your address.",
  },
];

/** USA temples bill in dollars; everything else bills in rupees. */
export function currencyFor(state: string) {
  return state === "USA" ? "USD" : "INR";
}

export function priceFor(plan: MembershipPlan, currency: string) {
  return currency === "USD" ? plan.usd : plan.inr;
}

export function formatMoney(amount: number, currency: string) {
  return currency === "USD"
    ? `$${amount.toLocaleString("en-US")}`
    : `₹${amount.toLocaleString("en-IN")}`;
}
