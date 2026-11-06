/**
 * Simulated temple-operations data for the Admin Command Centre.
 *
 * Everything here is mock data for the trustee demo — no backend is involved.
 * Figures are modelled on Arulmigu Arunachaleswarar (Annamalaiyar) Temple,
 * Tiruvannamalai: five gopuram gates, five revenue heads used by HR&CE temples,
 * and a three-shift volunteer roster.
 */

export type Severity = "safe" | "moderate" | "high" | "critical";

/** Shared capacity thresholds used by the heatmap legend and the admin tiles. */
export const SEVERITY_BANDS: {
  key: Severity;
  label: string;
  short: string;
  min: number;
  max: number;
  dot: string;
  text: string;
  bg: string;
  border: string;
  hex: string;
}[] = [
  { key: "safe", label: "Safe", short: "< 60%", min: 0, max: 60, dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", hex: "#10b981" },
  { key: "moderate", label: "Moderate", short: "60–80%", min: 60, max: 80, dot: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", hex: "#f59e0b" },
  { key: "high", label: "High", short: "80–95%", min: 80, max: 95, dot: "bg-orange-500", text: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", hex: "#f97316" },
  { key: "critical", label: "Critical", short: "> 95%", min: 95, max: 1000, dot: "bg-rose-600", text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200", hex: "#e11d48" },
];

export const severityFor = (pct: number): Severity =>
  pct >= 95 ? "critical" : pct >= 80 ? "high" : pct >= 60 ? "moderate" : "safe";

export const bandFor = (pct: number) => SEVERITY_BANDS.find((b) => b.key === severityFor(pct))!;

/* ------------------------------------------------------------------ gates */

export interface GateStat {
  id: string;
  name: string;
  shortName: string;
  direction: string;
  open: boolean;
  entries: number;
  exits: number;
  queue: number;
  /** Devotees per hour currently passing through. */
  throughput: number;
  note: string;
}

export const gateStats: GateStat[] = [
  {
    id: "east",
    name: "Rajagopuram (East)",
    shortName: "Rajagopuram",
    direction: "East",
    open: true,
    entries: 12450,
    exits: 11200,
    queue: 340,
    throughput: 520,
    note: "11-storey main gateway — heaviest footfall all day.",
  },
  {
    id: "inner",
    name: "Vallala Gopuram (Inner)",
    shortName: "Vallala",
    direction: "Inner",
    open: true,
    entries: 8900,
    exits: 8100,
    queue: 120,
    throughput: 410,
    note: "Queues merge here before the sanctum approach.",
  },
  {
    id: "north",
    name: "Kili Gopuram (North)",
    shortName: "Kili",
    direction: "North",
    open: true,
    entries: 6200,
    exits: 5800,
    queue: 85,
    throughput: 300,
    note: "Nearest to the car shed and the main parking lot.",
  },
  {
    id: "south",
    name: "Thirumanjana Gopuram (South)",
    shortName: "Thirumanjana",
    direction: "South",
    open: false,
    entries: 0,
    exits: 0,
    queue: 0,
    throughput: 0,
    note: "Closed since 06:00 for Deepam mandapam scaffolding work.",
  },
  {
    id: "west",
    name: "Ammani Amman (West)",
    shortName: "Ammani Amman",
    direction: "West",
    open: true,
    entries: 4100,
    exits: 3900,
    queue: 45,
    throughput: 240,
    note: "Faces Arunachala — busy with devotees returning from Girivalam.",
  },
];

/* --------------------------------------------------------------- revenue */

export interface RevenueSource {
  key: string;
  label: string;
  amount: number;
  color: string;
}

/** Today's revenue by head — totals ₹12,84,500. */
export const revenueBySource: RevenueSource[] = [
  { key: "hundi", label: "Hundi", amount: 820000, color: "#f59e0b" },
  { key: "darshan", label: "Special Darshan", amount: 210000, color: "#e32c26" },
  { key: "store", label: "Temple Store", amount: 140000, color: "#6366f1" },
  { key: "annadhanam", label: "Annadhanam Sponsors", amount: 100000, color: "#10b981" },
  { key: "membership", label: "Membership", amount: 14500, color: "#06b6d4" },
];

export const todaysRevenue = revenueBySource.reduce((s, r) => s + r.amount, 0);

export interface DailyRevenue {
  day: string;
  date: string;
  hundi: number;
  darshan: number;
  store: number;
  annadhanam: number;
  membership: number;
  total: number;
}

const rawWeek = [
  { day: "Fri", date: "31 Oct", hundi: 742000, darshan: 186000, store: 118000, annadhanam: 86000, membership: 11000 },
  { day: "Sat", date: "1 Nov", hundi: 1180000, darshan: 342000, store: 214000, annadhanam: 148000, membership: 24000 },
  { day: "Sun", date: "2 Nov", hundi: 1296000, darshan: 388000, store: 236000, annadhanam: 162000, membership: 27500 },
  { day: "Mon", date: "3 Nov", hundi: 684000, darshan: 162000, store: 96000, annadhanam: 74000, membership: 9500 },
  { day: "Tue", date: "4 Nov", hundi: 708000, darshan: 174000, store: 104000, annadhanam: 81000, membership: 10500 },
  { day: "Wed", date: "5 Nov", hundi: 756000, darshan: 192000, store: 122000, annadhanam: 92000, membership: 12500 },
  { day: "Thu", date: "6 Nov", hundi: 820000, darshan: 210000, store: 140000, annadhanam: 100000, membership: 14500 },
];

export const weeklyRevenue: DailyRevenue[] = rawWeek.map((d) => ({
  ...d,
  total: d.hundi + d.darshan + d.store + d.annadhanam + d.membership,
}));

/** Month-to-date progress against the trust's November target. */
export const monthToDate = {
  collected: 28460000,
  target: 42000000,
  label: "November 2026",
  note: "Karthigai Deepam fortnight typically contributes 40% of the monthly total.",
};

/* ------------------------------------------------------- hourly footfall */

export interface HourlyFootfall {
  /** Decimal hour, e.g. 10.5 = 10:30 AM. */
  h: number;
  label: string;
  predicted: number;
  lastWeek: number;
}

/**
 * 24-hour predicted crowd curve for the temple, 05:30 to 22:00 in 30-minute
 * steps, with last Thursday's actuals for comparison. Peak ~15,800 at 10:30 AM.
 */
export const hourlyFootfall: HourlyFootfall[] = (() => {
  const points: HourlyFootfall[] = [];
  // Hand-shaped curve: morning build-up, 10:30 peak, afternoon lull (temple
  // closes 12:30–15:30), evening second peak around Sayarakshai pooja.
  //
  // This is a tuple list, not an object: JavaScript orders integer-like keys
  // ("6", "7", …) ahead of string keys ("5.5", "6.5", …), which silently sorted
  // the half-hours to the end and made the chart's time axis wrap around.
  const shape: [number, number][] = [
    [5.5, 2400], [6, 4200], [6.5, 6100], [7, 7900], [7.5, 9400], [8, 11200],
    [8.5, 12600], [9, 13700], [9.5, 14600], [10, 15300], [10.5, 15800],
    [11, 15100], [11.5, 13800], [12, 11900], [12.5, 6200], [13, 2100],
    [13.5, 1500], [14, 1300], [14.5, 1400], [15, 2200], [15.5, 5800],
    [16, 8100], [16.5, 9600], [17, 10900], [17.5, 12100], [18, 13400],
    [18.5, 14200], [19, 13600], [19.5, 12400], [20, 10700], [20.5, 8600],
    [21, 6300], [21.5, 3900], [22, 1800],
  ];
  for (const [h, predicted] of shape) {
    const hh = Math.floor(h);
    const mm = h % 1 ? "30" : "00";
    const ampm = hh >= 12 ? "PM" : "AM";
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    // Last Thursday was a regular day, not Pradosham: today runs roughly 40%
    // heavier, which is the figure the AI insight card quotes.
    const lastWeek = Math.round(predicted * (0.72 + 0.02 * Math.sin(h / 2)));
    points.push({ h, label: `${h12}:${mm} ${ampm}`, predicted, lastWeek });
  }
  return points;
})();

export const TEMPLE_CAPACITY = 18000;

/* ------------------------------------------------------ zones & capacity */

export interface ZoneCapacity {
  id: string;
  name: string;
  current: number;
  max: number;
}

export const zoneCapacities: ZoneCapacity[] = [
  { id: "sanctum", name: "Arunachaleswarar Sannithi", current: 2850, max: 2900 },
  { id: "amman", name: "Unnamulai Amman Sannithi", current: 1480, max: 2200 },
  { id: "queue-east", name: "East Queue Complex", current: 4100, max: 4500 },
  { id: "mandapam", name: "Thousand Pillar Mandapam", current: 760, max: 2000 },
  { id: "sivaganga", name: "Sivaganga Theertham", current: 980, max: 1800 },
  { id: "prakaram", name: "Outer Prakaram", current: 5200, max: 7000 },
  { id: "parking", name: "North Car Shed & Parking", current: 1640, max: 1800 },
];

/* ------------------------------------------------------ staff & shifts */

export interface Shift {
  id: string;
  name: string;
  window: string;
  status: "done" | "active" | "upcoming";
  strength: number;
}

export const shifts: Shift[] = [
  { id: "morning", name: "Morning", window: "6 AM – 2 PM", status: "done", strength: 127 },
  { id: "afternoon", name: "Afternoon", window: "2 PM – 10 PM", status: "active", strength: 118 },
  { id: "night", name: "Night", window: "10 PM – 6 AM", status: "upcoming", strength: 64 },
];

export interface ZoneDeployment {
  zone: string;
  assigned: number;
  present: number;
}

export const zoneDeployment: ZoneDeployment[] = [
  { zone: "East Rajagopuram & Queue", assigned: 42, present: 40 },
  { zone: "Sanctum & Inner Prakaram", assigned: 30, present: 29 },
  { zone: "Amman Sannithi", assigned: 18, present: 16 },
  { zone: "Annadhanam Hall", assigned: 22, present: 18 },
  { zone: "Girivalam Route Posts", assigned: 24, present: 17 },
  { zone: "Parking & Traffic", assigned: 14, present: 7 },
];

export const volunteerSummary = {
  deployed: 127,
  sanctioned: 150,
};

/* ------------------------------------------------------- activity feed */

export interface ActivityEvent {
  time: string;
  text: string;
  kind: "alert" | "medical" | "vip" | "info" | "ok";
}

export const activityFeed: ActivityEvent[] = [
  { time: "10:32 AM", text: "Crowd surge detected at East Rajagopuram. Redirected to North gate.", kind: "alert" },
  { time: "10:15 AM", text: "Medical incident at Queue Line 3. Ambulance dispatched.", kind: "medical" },
  { time: "09:45 AM", text: "VIP darshan group (15 pax) entered via Vallala Gopuram.", kind: "vip" },
  { time: "09:30 AM", text: "Morning shift volunteer count: 127/150.", kind: "info" },
  { time: "09:12 AM", text: "Annadhanam Hall B opened — 2,400 meals prepared for the noon serving.", kind: "ok" },
  { time: "08:50 AM", text: "Lost child reported near Sivaganga Theertham — reunited with family at 09:05 AM.", kind: "ok" },
  { time: "08:20 AM", text: "Hundi counting room sealed after the morning count: ₹4,12,000.", kind: "info" },
  { time: "07:40 AM", text: "Thirumanjana Gopuram (South) closed for scaffolding work.", kind: "alert" },
  { time: "06:15 AM", text: "Girivalam water station 7 (Varuna Lingam) refilled.", kind: "ok" },
  { time: "09:00 AM", text: "Temple opened. All gates operational.", kind: "ok" },
];

/* ------------------------------------------------------------ incidents */

export interface Incident {
  id: string;
  type: string;
  location: string;
  time: string;
  severity: Severity;
  status: "open" | "resolved";
}

export const incidents: Incident[] = [
  { id: "INC-2411-07", type: "Medical", location: "Queue Line 3, East Complex", time: "10:15 AM", severity: "high", status: "open" },
  { id: "INC-2411-06", type: "Crowd surge", location: "East Rajagopuram", time: "10:32 AM", severity: "moderate", status: "open" },
  { id: "INC-2411-05", type: "Lost child", location: "Sivaganga Theertham", time: "08:50 AM", severity: "moderate", status: "resolved" },
];

/* -------------------------------------------------- emergency broadcast */

export const ALERT_TYPES = [
  "Stampede Risk",
  "Medical Emergency",
  "Fire",
  "Weather",
  "Security",
  "General",
] as const;
export type AlertType = (typeof ALERT_TYPES)[number];

export const ALERT_SEVERITIES = ["Low", "Medium", "High", "Critical"] as const;
export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];

export const BROADCAST_CHANNELS = [
  { id: "push", label: "App Push Notification", reach: "2.4L devotees" },
  { id: "sms", label: "SMS", reach: "1.8L numbers" },
  { id: "pa", label: "PA System", reach: "38 speaker zones" },
  { id: "signage", label: "Digital Signage", reach: "22 displays" },
] as const;

export const ALERT_ZONES = [
  "East Rajagopuram",
  "Vallala Gopuram",
  "Kili Gopuram",
  "Thirumanjana Gopuram",
  "Ammani Amman Gopuram",
  "Arunachaleswarar Sannithi",
  "Unnamulai Amman Sannithi",
  "Thousand Pillar Mandapam",
  "Annadhanam Hall",
  "Girivalam Route",
  "Parking & Car Shed",
];

export const ALERT_TEMPLATES: Record<AlertType, string> = {
  "Stampede Risk":
    "URGENT: Dangerous crowd density detected. Devotees must stop moving forward and follow volunteer instructions. All gates to the affected zone are being held. Do not push.",
  "Medical Emergency":
    "Medical emergency in progress. Please clear a path for the ambulance team and keep the central corridor free. Nearest medical post is at the East Queue Complex.",
  Fire: "Fire alert. Proceed calmly to the nearest marked exit. Do not use the inner prakaram corridors. Volunteers in orange vests will guide you out.",
  Weather:
    "Heavy rain / lightning warning for the next 60 minutes. Devotees on the Girivalam route and in open prakarams should move to the covered mandapams immediately.",
  Security:
    "Security advisory. Please cooperate with the additional checks at all gates. Report unattended bags to the nearest volunteer or police post.",
  General:
    "Temple announcement for all devotees. Please follow the queue markings and the instructions of the volunteers on duty. Thank you for your cooperation.",
};

export interface PastAlert {
  id: string;
  time: string;
  date: string;
  type: AlertType;
  severity: AlertSeverity;
  zones: string[];
  channels: string[];
  status: "Resolved" | "Monitoring" | "Active";
}

export const pastAlerts: PastAlert[] = [
  {
    id: "ALT-2026-1104",
    time: "10:34 AM",
    date: "Today",
    type: "General",
    severity: "Medium",
    zones: ["East Rajagopuram"],
    channels: ["App Push Notification", "PA System"],
    status: "Monitoring",
  },
  {
    id: "ALT-2026-1098",
    time: "06:12 PM",
    date: "2 Nov",
    type: "Stampede Risk",
    severity: "Critical",
    zones: ["East Rajagopuram", "Arunachaleswarar Sannithi"],
    channels: ["App Push Notification", "SMS", "PA System", "Digital Signage"],
    status: "Resolved",
  },
  {
    id: "ALT-2026-1091",
    time: "04:48 AM",
    date: "1 Nov",
    type: "Weather",
    severity: "High",
    zones: ["Girivalam Route"],
    channels: ["App Push Notification", "SMS"],
    status: "Resolved",
  },
  {
    id: "ALT-2026-1086",
    time: "11:20 AM",
    date: "28 Oct",
    type: "Medical Emergency",
    severity: "Medium",
    zones: ["Thousand Pillar Mandapam"],
    channels: ["PA System"],
    status: "Resolved",
  },
];

/* ------------------------------------------------------------ QR / entry */

export const scanStats = {
  totalToday: 8450,
  valid: 8320,
  invalid: 130,
  avgScanSeconds: 2.3,
  lanes: [
    { lane: "East Lane 1", scans: 2840, avg: 2.1 },
    { lane: "East Lane 2", scans: 2610, avg: 2.4 },
    { lane: "Vallala Inner", scans: 1890, avg: 2.2 },
    { lane: "Ammani Amman", scans: 1110, avg: 2.6 },
  ],
};

/* ---------------------------------------------------------- top KPI set */

export const opsKpis = {
  footfall: 38240,
  footfallDeltaPct: 13,
  footfallCompare: "vs last Thursday",
  revenue: todaysRevenue,
  volunteersDeployed: volunteerSummary.deployed,
  volunteersSanctioned: volunteerSummary.sanctioned,
  openIncidents: incidents.filter((i) => i.status === "open").length,
  throughput: 1250,
  throughputTarget: 1500,
  occupancy: 86,
};
