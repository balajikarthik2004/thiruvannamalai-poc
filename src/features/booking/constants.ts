import { Star, Crown, Heart } from "lucide-react";

// General (free) darshan is intentionally not bookable online.
export const DARSHAN_CATEGORIES = [
  { id: "special", name: "Special Entry", price: 200, desc: "Fast-track entry queue", icon: Star },
  { id: "vip", name: "VIP Darshan", price: 500, desc: "Direct sanctum access", icon: Crown },
  { id: "senior", name: "Senior Citizen / Differently Abled / Pregnant Women", price: 100, desc: "Priority entry with assistance", icon: Heart, isPremium: true },
];

export type BookingCart = {
  darshan: { type: string; persons: number; price: number; date: Date | null; time: string };
  poojas: Array<{ id: string; name: string; price: number }>;
  prasadam: Array<{ id: string; name: string; qty: number; price: number }>;
  archana: { optIn: boolean; partnerDelivery: boolean; price: number };
  accommodations: { type: string; nights: number; price: number; checkIn: Date | null };
  venues: { type: string; price: number; date: Date | null };
  donations?: { amount: number; frequency: string; cause: string; pledgeDate?: string };
};
