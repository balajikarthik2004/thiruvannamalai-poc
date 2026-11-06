import { Landmark, Soup, Flower2, Check, RefreshCw, CalendarClock, Smartphone, CreditCard, Building2, Wallet } from "lucide-react";

export const CAUSES = [
  { id: "general", title: "General Hundi", desc: "Support temple maintenance", icon: Landmark },
  { id: "annadhanam", title: "Annadhanam", desc: "Feed devotees and visitors", icon: Soup },
  { id: "pooja", title: "Pooja & Abhishekam", desc: "Support daily poojas and rituals", icon: Flower2 },
];

export const PRESET_AMOUNTS = [101, 501, 1001, 2501, 5001];

export const FREQUENCIES = [
  { id: "one-time", title: "One-time", hint: "", icon: Check },
  { id: "recurring", title: "Recurring", hint: "Automatic auto-debit", icon: RefreshCw },
  { id: "pledge", title: "Pledge", hint: "Choose amount & date", icon: CalendarClock },
] as const;

export const PAYMENT_METHODS = [
  { id: "upi", label: "UPI (Google Pay, PhonePe, Paytm)", icon: Smartphone },
  { id: "card", label: "Debit / Credit Card", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", icon: Building2 },
  { id: "wallet", label: "Wallet", icon: Wallet },
];

/** "one-time" | "pledge" | "15days" | "30days" | "custom-N" → group id used by the UI. */
export const frequencyGroup = (f: string) => (f === "one-time" ? "one-time" : f === "pledge" ? "pledge" : "recurring");

export const frequencyLabel = (f: string) =>
  f === "one-time" ? "One-time"
  : f === "pledge" ? "Pledge"
  : f === "15days" ? "Every 15 days"
  : f === "30days" ? "Every 30 days"
  : f.startsWith("custom-") && f.split("-")[1] ? `Every ${f.split("-")[1]} days`
  : "Recurring";
