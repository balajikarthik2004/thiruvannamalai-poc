import { Landmark, Soup, Flower2, Check, RefreshCw, CalendarDays, Smartphone, CreditCard, Building2, Wallet } from "lucide-react";

export interface CauseItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  details: string;
  icon: typeof Landmark;
}

export const CAUSES: CauseItem[] = [
  {
    id: "general",
    title: "General Hundi",
    desc: "Support temple maintenance and daily operations.",
    image: "/donation_hundi_gold_hd.jpg",
    details: "Contribute directly to the Sri Arunachaleswarar Temple general trust fund. Your offering supports daily temple rituals, lighting of sacred ghee lamps, temple gopuram preservation, and administration under HR&CE guidelines.",
    icon: Landmark,
  },
  {
    id: "annadhanam",
    title: "Annadhanam",
    desc: "Support meals for devotees and visitors.",
    image: "/donation_annadhanam_feast_hd.jpg",
    details: "Sponsor sacred meals (Annadhanam) served free of charge to thousands of pilgrims daily at the temple dining halls and across designated points along the 14 km Girivalam path. 100% tax exempted under Section 80G.",
    icon: Soup,
  },
  {
    id: "pooja",
    title: "Pooja & Abhishekam",
    desc: "Support approved temple rituals and special poojas.",
    image: "/donation_pooja_abhishekam_hd.jpg",
    details: "Sponsor sacred abhishekam materials (pure cow milk, vibhuthi, fragrant sandal paste, honey, and fresh flowers) for Lord Arunachaleswarar and Goddess Unnamulai Amman during daily kaala poojas.",
    icon: Flower2,
  },
];

export const PRESET_AMOUNTS = [101, 501, 1001, 2501, 5001];

export const FREQUENCIES = [
  {
    id: "one-time",
    title: "One-time",
    subtitle: "Make a single donation",
    icon: Check,
  },
  {
    id: "recurring",
    title: "Recurring",
    subtitle: "Auto-debit (Monthly / Quarterly / Yearly)",
    icon: RefreshCw,
  },
  {
    id: "pledge",
    title: "Pledge",
    subtitle: "Commit an amount & pay by a chosen date",
    icon: CalendarDays,
  },
] as const;

export const PAYMENT_METHODS = [
  { id: "upi", label: "UPI (Google Pay, PhonePe, Paytm)", icon: Smartphone },
  { id: "card", label: "Debit / Credit Card", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", icon: Building2 },
  { id: "wallet", label: "Wallet", icon: Wallet },
];

export const frequencyGroup = (f: string) =>
  f === "one-time" ? "one-time" : f === "pledge" ? "pledge" : "recurring";

export const frequencyLabel = (f: string) => {
  if (f === "one-time") return "One-time";
  if (f === "pledge") return "Pledge";
  if (f === "monthly") return "Monthly";
  if (f === "quarterly") return "Quarterly";
  if (f === "yearly") return "Yearly";
  if (f === "15days") return "Every 15 days";
  if (f === "30days") return "Every 30 days";
  if (f.startsWith("custom-") && f.split("-")[1]) return `Every ${f.split("-")[1]} days`;
  return "Recurring";
};
