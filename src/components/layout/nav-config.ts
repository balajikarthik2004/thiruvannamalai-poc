import type { ComponentType, SVGProps } from "react";
import {
  Home,
  Map,
  Mountain,
  CalendarCheck,
  Store,
  HelpCircle,
  Award,
  PhoneCall,
  Radio,
  CalendarDays,
  MapPin,
  UsersRound,
  Megaphone,
  MessageCircle,
  Settings,
  type LucideIcon,
} from "lucide-react";
import {
  TempleIcon,
  TripPlannerIcon,
  PoojaIcon,
  DonationsIcon,
  MyJourneyIcon,
} from "./nav-icons";

export type NavIcon = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;

/**
 * Every navigation destination in one place, so the desktop rail, the mobile
 * drawer and the bottom bar stay in step instead of each keeping their own list.
 */
export interface NavEntry {
  /** Route path. `undefined` marks a planned destination with no route yet. */
  to?: string;
  /** Search params for deep links, e.g. the Girivalam tab to open. */
  search?: Record<string, string>;
  label: string;
  /** One-line purpose, used as the tooltip and the drawer subtitle. */
  description?: string;
  icon: NavIcon;
  exact?: boolean;
  /** Draws the red emergency treatment. */
  emphasis?: "emergency";
  /** Shows the unread indicator. */
  badge?: boolean;
  /**
   * Set when the feature has no route yet. The item renders as a clearly
   * disabled "planned" row rather than a link that goes nowhere.
   */
  plannedNote?: string;
}

/** Primary devotee journey matching the exact OMG Devotee sidebar specification. */
export const MAIN_NAV: NavEntry[] = [
  { to: "/", label: "Dashboard", icon: Home, exact: true, description: "Your temple overview" },
  { to: "/temples", label: "Explore Temples", icon: TempleIcon, description: "Browse every temple" },
  { to: "/plan", label: "Trip Planner", icon: TripPlannerIcon, description: "Plan your visit with AI" },
  { to: "/heatmap", label: "Temple Map", icon: Map, description: "Live crowd heatmap" },
  { to: "/girivalam", label: "Girivalam", icon: Mountain, description: "The 14 km sacred walk" },
  {
    to: "/booking/tiruvannamalai",
    label: "Darshan Booking",
    icon: CalendarCheck,
    description: "Reserve your darshan slot",
  },
  { to: "/poojas", label: "Pooja & Seva", icon: PoojaIcon, description: "Timings and offerings" },
  { to: "/donations", label: "Donations", icon: DonationsIcon, description: "Support the temple" },
  { to: "/store", label: "Temple Store", icon: Store, description: "Prasadam and pooja items" },
  { to: "/journey", label: "My Journey", icon: MyJourneyIcon, description: "Your pilgrimage history" },
  { to: "/help", label: "Help & Support", icon: HelpCircle, description: "Contacts and FAQs" },
];

/**
 * Quick Help & Essentials.
 */
export const QUICK_HELP: NavEntry[] = [
  {
    to: "/help",
    label: "Emergency Help",
    description: "Medical, Police, Lost & Found and Family Assistance",
    icon: PhoneCall,
    emphasis: "emergency",
  },
  {
    to: "/girivalam",
    search: { tab: "updates" },
    label: "Live Updates",
    description: "Real-time crowd, route, weather and important alerts",
    icon: Radio,
    badge: true,
  },
  {
    to: "/festivals",
    label: "Festival Calendar",
    description: "Upcoming festivals and reminders",
    icon: CalendarDays,
  },
  {
    to: "/girivalam",
    search: { tab: "facilities" },
    label: "Nearby Facilities",
    description: "Drinking water, toilets, medical camps and rest areas",
    icon: MapPin,
  },
  {
    label: "Family & Group",
    description: "Family coordination, location sharing and meeting points",
    icon: UsersRound,
    plannedNote:
      "No route yet. Add a `/family` file route and point this entry at it — see QUICK_HELP in nav-config.ts.",
  },
  {
    to: "/notifications",
    label: "Announcements",
    description: "Official temple notices, route changes and safety advisories",
    icon: Megaphone,
  },
];

/** Secondary links kept in the rail footer so nothing from the old nav is lost. */
export const FOOTER_NAV: NavEntry[] = [
  { to: "/membership", label: "Membership", icon: Award },
  { to: "/chat", label: "Ask AI", icon: MessageCircle },
  { to: "/profile", label: "Settings", icon: Settings },
];

/** The five entries that fit the mobile bottom bar. */
export const MOBILE_BOTTOM_NAV: NavEntry[] = [
  MAIN_NAV[0], // Dashboard
  MAIN_NAV[4], // Girivalam
  MAIN_NAV[5], // Darshan Booking
  MAIN_NAV[7], // Donations
  MAIN_NAV[8], // Temple Store
];
