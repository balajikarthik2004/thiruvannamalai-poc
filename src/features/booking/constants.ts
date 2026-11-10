import type { ComponentType, SVGProps } from "react";
import { Sparkles, Users, UserCheck, Accessibility } from "lucide-react";

export type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export interface DarshanCategory {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  desc: string;
  icon: IconType;
  badge?: string;
}

export const DARSHAN_CATEGORIES: DarshanCategory[] = [
  {
    id: "special",
    name: "Special Entry",
    price: 200,
    priceLabel: "₹200 per devotee",
    desc: "Fast-track entry queue",
    icon: Sparkles,
  },
  {
    id: "general",
    name: "General Darshan",
    price: 0,
    priceLabel: "Free (Temple Entry)",
    desc: "General queue for all devotees",
    icon: Users,
  },
  {
    id: "senior",
    name: "Senior Citizen",
    price: 0,
    priceLabel: "(60+ years)",
    desc: "Priority dedicated counter",
    icon: UserCheck,
  },
  {
    id: "accessibility",
    name: "Accessibility",
    price: 0,
    priceLabel: "Assistance Support",
    desc: "Wheelchair & physical assistance",
    icon: Accessibility,
  },
];

export interface TimeSlotInfo {
  time: string;
  status: "available" | "limited" | "full";
  left?: number;
}

/** Standard 12 time slots as seen in the reference design */
export const DEFAULT_TIME_SLOTS: TimeSlotInfo[] = [
  { time: "6:00 AM", status: "available" },
  { time: "7:00 AM", status: "limited", left: 12 },
  { time: "8:00 AM", status: "available" },
  { time: "9:00 AM", status: "available" },
  { time: "10:00 AM", status: "limited", left: 8 },
  { time: "11:00 AM", status: "full" },
  { time: "12:00 PM", status: "available" },
  { time: "4:00 PM", status: "available" },
  { time: "5:00 PM", status: "limited", left: 15 },
  { time: "6:00 PM", status: "available" },
  { time: "7:00 PM", status: "available" },
  { time: "8:00 PM", status: "available" },
];

export interface DevoteeMember {
  id: string;
  name: string;
  age: number | "";
  gender: "male" | "female" | "other";
  idType: string;
  idNumber: string;
}

export interface AddonService {
  id: string;
  name: string;
  tamilName?: string;
  price: number;
  unit: string;
  desc: string;
  category: "pooja" | "prasadam" | "seva" | "stay";
}

export const ADDON_SERVICES: AddonService[] = [
  {
    id: "archana",
    name: "Special Sankalpa Archana",
    tamilName: "சிறப்பு அர்ச்சனை",
    price: 100,
    unit: "per family",
    desc: "Chanting of names, gotra & nakshatra with prasadam delivery",
    category: "pooja",
  },
  {
    id: "abhishekam",
    name: "Kala Sandhi Abhishekam",
    tamilName: "காலசந்தி அபிஷேகம்",
    price: 500,
    unit: "per sankalpam",
    desc: "Sacred morning bath offering with vibhuti & theertham",
    category: "pooja",
  },
  {
    id: "laddu",
    name: "Temple Laddu Prasadam Box",
    tamilName: "லட்டு பிரசாதம் (4 pcs)",
    price: 50,
    unit: "per box",
    desc: "Authentic ghee laddu prepared at the temple madapalli",
    category: "prasadam",
  },
  {
    id: "deepam",
    name: "Agni Deepam Ghee Lamp Offering",
    tamilName: "அகல் நெய் தீபம்",
    price: 150,
    unit: "per devotee",
    desc: "Sacred earthen ghee lamp lit at the Arunachaleswarar sanctum",
    category: "seva",
  },
  {
    id: "stay",
    name: "Temple Devasthanam Guest Room",
    tamilName: "தங்கும் விடுதி அறை",
    price: 600,
    unit: "per day",
    desc: "Clean AC room inside the temple campus (2 persons)",
    category: "stay",
  },
];

export interface BookingCart {
  darshan: {
    type: string;
    persons: number;
    price: number;
    date: Date | null;
    time: string;
  };
  poojas: Array<{ id: string; name: string; price: number }>;
  prasadam: Array<{ id: string; name: string; qty: number; price: number }>;
  archana: { optIn: boolean; partnerDelivery: boolean; price: number };
  accommodations: { type: string; nights: number; price: number; checkIn: Date | null };
  venues: { type: string; price: number; date: Date | null };
  donations?: { amount: number; frequency: string; cause: string; pledgeDate?: string };
}
