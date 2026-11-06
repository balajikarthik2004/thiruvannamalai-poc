/**
 * Girivalam route data — the 14 km barefoot circumambulation of Arunachala hill.
 *
 * Devotees start at the Arunachaleswarar temple and walk clockwise, keeping the
 * hill on their right, passing the eight Ashta Lingams that stand at the eight
 * compass points. Cumulative distances are the figures the temple publishes for
 * pilgrims; the markers sit at each lingam's true compass bearing, so the ring
 * is drawn evenly while the labels carry the real walking distances.
 *
 * All crowd, facility and weather figures are simulated for the demo.
 */

import { severityFor, type Severity } from "./operations";

export const GIRIVALAM_DISTANCE_KM = 14;

/* ----------------------------------------------------------------- geography */

export type LatLng = [number, number];

/** Centre of Arunachala hill — the ring is drawn around this point. */
export const ARUNACHALA_CENTER: LatLng = [12.23, 79.062];
export const ARUNACHALA_HEIGHT_FT = 2668;

/** Arulmigu Arunachaleswarar (Annamalaiyar) Temple — the start and end point. */
export const TEMPLE_LOCATION: LatLng = [12.2319, 79.0677];

/** Ring radius in degrees: 14 km circumference → ~2.23 km radius. */
const R_LAT = 2.23 / 111.32;
const R_LNG = 2.23 / (111.32 * Math.cos((12.23 * Math.PI) / 180));

/** Compass bearing (0 = North, clockwise) → a point on the route ring. */
export function pointAtBearing(bearingDeg: number, scale = 1): LatLng {
  const b = (bearingDeg * Math.PI) / 180;
  return [
    ARUNACHALA_CENTER[0] + R_LAT * scale * Math.cos(b),
    ARUNACHALA_CENTER[1] + R_LNG * scale * Math.sin(b),
  ];
}

/** Where on the ring the walk begins — the point nearest the temple. */
export const START_BEARING = (() => {
  const dLat = (TEMPLE_LOCATION[0] - ARUNACHALA_CENTER[0]) / R_LAT;
  const dLng = (TEMPLE_LOCATION[1] - ARUNACHALA_CENTER[1]) / R_LNG;
  const deg = (Math.atan2(dLng, dLat) * 180) / Math.PI;
  return (deg + 360) % 360;
})();

/** Kilometres walked → bearing on the ring. */
export const bearingForKm = (km: number) =>
  (START_BEARING + (km / GIRIVALAM_DISTANCE_KM) * 360) % 360;

/** Kilometres walked → a map position on the route. */
export const positionAtKm = (km: number): LatLng => pointAtBearing(bearingForKm(km));

/* ------------------------------------------------------------- ashta lingams */

export interface Lingam {
  id: string;
  /** Position in the clockwise walk, 1 = Indra (East). */
  order: number;
  name: string;
  tamilName: string;
  direction: string;
  /** Compass bearing in degrees, 0 = North, increasing clockwise. */
  bearing: number;
  position: LatLng;
  /** Presiding deity / guardian of that direction. */
  guardian: string;
  /** What devotees traditionally pray for here. */
  blessing: string;
  /** Devotees currently at or around the shrine. */
  crowd: number;
  capacity: number;
  /** Darshan wait at the shrine, in minutes. */
  waitMin: number;
  /** Km from the previous stop on the clockwise route. */
  distanceFromPrev: number;
  /** Cumulative km from the temple start. */
  cumulativeKm: number;
  facilities: string[];
  note: string;
}

const lingamSeed: Omit<Lingam, "position">[] = [
  {
    id: "indra",
    order: 1,
    name: "Indra Lingam",
    tamilName: "இந்திர லிங்கம்",
    direction: "East",
    bearing: 90,
    guardian: "Indra — king of the devas",
    blessing: "Prosperity and relief from debt",
    crowd: 820,
    capacity: 900,
    waitMin: 22,
    distanceFromPrev: 1.8,
    cumulativeKm: 1.8,
    facilities: ["Water station", "Medical post", "Shoe stand", "Toilets"],
    note: "The first lingam after the temple, and the busiest stretch of the whole route.",
  },
  {
    id: "agni",
    order: 2,
    name: "Agni Lingam",
    tamilName: "அக்னி லிங்கம்",
    direction: "South-East",
    bearing: 135,
    guardian: "Agni — lord of fire",
    blessing: "Health and freedom from illness",
    crowd: 910,
    capacity: 950,
    waitMin: 28,
    distanceFromPrev: 1.3,
    cumulativeKm: 3.1,
    facilities: ["Water station", "Medical post", "Refreshment stall"],
    note: "The Chengam road side absorbs most of the early-morning crowd.",
  },
  {
    id: "yama",
    order: 3,
    name: "Yama Lingam",
    tamilName: "யம லிங்கம்",
    direction: "South",
    bearing: 180,
    guardian: "Yama — lord of dharma",
    blessing: "Release from the fear of death",
    crowd: 640,
    capacity: 900,
    waitMin: 15,
    distanceFromPrev: 1.8,
    cumulativeKm: 4.9,
    facilities: ["Water station", "Toilets"],
    note: "A quieter stretch where many devotees pause to rest.",
  },
  {
    id: "niruthi",
    order: 4,
    name: "Niruthi Lingam",
    tamilName: "நிருதி லிங்கம்",
    direction: "South-West",
    bearing: 225,
    guardian: "Nirṛti — guardian of the south-west",
    blessing: "Protection from misfortune",
    crowd: 410,
    capacity: 850,
    waitMin: 9,
    distanceFromPrev: 1.5,
    cumulativeKm: 6.4,
    facilities: ["Water station", "Shaded rest area"],
    note: "Good tree cover — the most comfortable stretch even at midday.",
  },
  {
    id: "varuna",
    order: 5,
    name: "Varuna Lingam",
    tamilName: "வருண லிங்கம்",
    direction: "West",
    bearing: 270,
    guardian: "Varuna — lord of the waters",
    blessing: "Rain, and calm of mind",
    crowd: 520,
    capacity: 900,
    waitMin: 12,
    distanceFromPrev: 1.4,
    cumulativeKm: 7.8,
    facilities: ["Water station", "Medical post", "Toilets", "Annadhanam point"],
    note: "Annadhanam is served here through the night on Pournami.",
  },
  {
    id: "vayu",
    order: 6,
    name: "Vayu Lingam",
    tamilName: "வாயு லிங்கம்",
    direction: "North-West",
    bearing: 315,
    guardian: "Vayu — lord of the winds",
    blessing: "Strength of breath and body",
    crowd: 280,
    capacity: 850,
    waitMin: 5,
    distanceFromPrev: 1.7,
    cumulativeKm: 9.5,
    facilities: ["Water station"],
    note: "The clearest view of the hill anywhere on the route.",
  },
  {
    id: "kubera",
    order: 7,
    name: "Kubera Lingam",
    tamilName: "குபேர லிங்கம்",
    direction: "North",
    bearing: 0,
    guardian: "Kubera — lord of wealth",
    blessing: "Wealth and abundance",
    crowd: 230,
    capacity: 900,
    waitMin: 6,
    distanceFromPrev: 1.3,
    cumulativeKm: 10.8,
    facilities: ["Water station", "Medical post", "Parking", "Toilets"],
    note: "Quietest point on the route, with parking — a good alternative start.",
  },
  {
    id: "esanya",
    order: 8,
    name: "Esanya Lingam",
    tamilName: "ஈசான்ய லிங்கம்",
    direction: "North-East",
    bearing: 45,
    guardian: "Ishana — a form of Shiva",
    blessing: "Knowledge and liberation",
    crowd: 470,
    capacity: 900,
    waitMin: 11,
    distanceFromPrev: 1.8,
    cumulativeKm: 12.6,
    facilities: ["Water station", "Refreshment stall"],
    note: "The last lingam before the walk closes back at the temple.",
  },
];

export const ashtaLingamStatus: Lingam[] = lingamSeed.map((l) => ({
  ...l,
  position: pointAtBearing(l.bearing),
}));

export const lingamSeverity = (l: Lingam): Severity =>
  severityFor((l.crowd / l.capacity) * 100);

/* ----------------------------------------------------------------- segments */

export interface RouteSegment {
  id: string;
  fromId: string;
  toId: string;
  from: string;
  to: string;
  /** Walkers currently on this stretch of road. */
  walkers: number;
  capacity: number;
  lengthKm: number;
  /** Average walking pace on the segment, km/h. */
  paceKmph: number;
  startBearing: number;
  endBearing: number;
}

/** Nine legs: temple → Indra → … → Esanya → temple. */
const SEGMENT_SEED: { from: string; to: string; walkers: number }[] = [
  { from: "temple", to: "indra", walkers: 760 },
  { from: "indra", to: "agni", walkers: 820 },
  { from: "agni", to: "yama", walkers: 700 },
  { from: "yama", to: "niruthi", walkers: 460 },
  { from: "niruthi", to: "varuna", walkers: 320 },
  { from: "varuna", to: "vayu", walkers: 380 },
  { from: "vayu", to: "kubera", walkers: 240 },
  { from: "kubera", to: "esanya", walkers: 330 },
  { from: "esanya", to: "temple", walkers: 620 },
];

const nameOf = (id: string) =>
  id === "temple" ? "Arunachaleswarar Temple" : ashtaLingamStatus.find((l) => l.id === id)!.name;

const kmOf = (id: string, end = false) =>
  id === "temple"
    ? end
      ? GIRIVALAM_DISTANCE_KM
      : 0
    : ashtaLingamStatus.find((l) => l.id === id)!.cumulativeKm;

export const routeSegments: RouteSegment[] = SEGMENT_SEED.map((s, i) => {
  const startKm = kmOf(s.from);
  const endKm = kmOf(s.to, true);
  const lengthKm = Math.round((endKm - startKm) * 10) / 10;
  return {
    id: `${s.from}-${s.to}`,
    fromId: s.from,
    toId: s.to,
    from: nameOf(s.from),
    to: nameOf(s.to),
    walkers: s.walkers,
    capacity: 900,
    lengthKm,
    paceKmph: [2.8, 2.6, 2.4, 3.2, 3.6, 3.4, 3.8, 3.5, 3.0][i],
    startBearing: bearingForKm(startKm),
    endBearing: bearingForKm(endKm),
  };
});

export const segmentSeverity = (s: RouteSegment): Severity =>
  severityFor((s.walkers / s.capacity) * 100);

/** Short label such as "Indra → Agni". */
export const shortLeg = (s: RouteSegment) =>
  `${s.from.replace(/\s*Lingam$/i, "").replace("Arunachaleswarar Temple", "Temple")} → ${s.to
    .replace(/\s*Lingam$/i, "")
    .replace("Arunachaleswarar Temple", "Temple")}`;

export const busiestSegment = routeSegments.reduce((a, b) =>
  a.walkers / a.capacity > b.walkers / b.capacity ? a : b
);

export const quietestSegment = routeSegments.reduce((a, b) =>
  a.walkers / a.capacity < b.walkers / b.capacity ? a : b
);

export const recommendedStart = ashtaLingamStatus.reduce((a, b) =>
  a.crowd / a.capacity < b.crowd / b.capacity ? a : b
);

/* ------------------------------------------------------------- the journey */

/** Minutes per kilometre used for every "time remaining" figure on the page. */
export const PACE_MIN_PER_KM = 160 / 8.8; // ≈ 18.2 — 8.8 km left in 2h 40m

export const formatDuration = (minutes: number) => {
  const m = Math.round(minutes);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h}h ${rem}m` : `${h}h`;
};

export interface JourneyState {
  active: boolean;
  startedAt: string;
  completedKm: number;
}

export const defaultJourney: JourneyState = {
  active: true,
  startedAt: "04:00 AM",
  completedKm: 5.2,
};

/** Everything the "My Girivalam Journey" and "Next Stop" cards need. */
export function journeyProgress(completedKm: number) {
  const remainingKm = Math.max(0, GIRIVALAM_DISTANCE_KM - completedKm);
  const percent = Math.round((completedKm / GIRIVALAM_DISTANCE_KM) * 100);
  // The next shrine ahead; past the last lingam the walk closes at the temple.
  const nextLingam = ashtaLingamStatus.find((l) => l.cumulativeKm > completedKm) ?? null;
  const nextName = nextLingam?.name ?? "Arunachaleswarar Temple";
  const nextTamil = nextLingam?.tamilName ?? "அருணாசலேஸ்வரர் கோயில்";
  const nextKm = (nextLingam?.cumulativeKm ?? GIRIVALAM_DISTANCE_KM) - completedKm;
  return {
    completedKm,
    remainingKm: Math.round(remainingKm * 10) / 10,
    percent,
    remainingLabel: formatDuration(remainingKm * PACE_MIN_PER_KM),
    nextLingam,
    nextName,
    nextTamil,
    nextKm: Math.round(nextKm * 10) / 10,
    nextEtaLabel: formatDuration(nextKm * PACE_MIN_PER_KM),
    position: positionAtKm(completedKm),
  };
}

/* ----------------------------------------------------------------- facilities */

export type FacilityKind =
  | "water"
  | "medical"
  | "toilet"
  | "police"
  | "annadhanam"
  | "shoe"
  | "parking";

export interface Facility {
  id: string;
  kind: FacilityKind;
  name: string;
  /** Metres from the walker's current position. */
  distanceM: number;
  /** Where it sits on the route, in km from the temple. */
  atKm: number;
  open: boolean;
  note?: string;
}

/** The five tiles in "Nearby Facilities", nearest first. */
export const nearbyFacilities: Facility[] = [
  { id: "f-water", kind: "water", name: "Water", distanceM: 250, atKm: 5.45, open: true, note: "RO drinking water, free" },
  { id: "f-medical", kind: "medical", name: "Medical", distanceM: 450, atKm: 5.65, open: true, note: "First aid and ORS" },
  { id: "f-toilet", kind: "toilet", name: "Toilet", distanceM: 600, atKm: 5.8, open: true },
  { id: "f-police", kind: "police", name: "Police", distanceM: 800, atKm: 6.0, open: true, note: "Help desk and lost & found" },
  { id: "f-annadhanam", kind: "annadhanam", name: "Annadhanam", distanceM: 1200, atKm: 6.4, open: true, note: "Free meals, 6 AM – 10 PM" },
];

/** The full facility register shown on the Facilities tab. */
export const allFacilities: Facility[] = [
  ...nearbyFacilities,
  { id: "f-water-2", kind: "water", name: "Water station — Indra Lingam", distanceM: 3800, atKm: 1.8, open: true },
  { id: "f-shoe-1", kind: "shoe", name: "Shoe stand — Temple entrance", distanceM: 9000, atKm: 0, open: true },
  { id: "f-medical-2", kind: "medical", name: "Medical post — Agni Lingam", distanceM: 2100, atKm: 3.1, open: true },
  { id: "f-water-3", kind: "water", name: "Water station — Varuna Lingam", distanceM: 2600, atKm: 7.8, open: true },
  { id: "f-annadhanam-2", kind: "annadhanam", name: "Annadhanam — Varuna Lingam", distanceM: 2600, atKm: 7.8, open: true, note: "All night on Pournami" },
  { id: "f-parking-1", kind: "parking", name: "Parking — Kubera Lingam", distanceM: 5600, atKm: 10.8, open: true },
  { id: "f-toilet-2", kind: "toilet", name: "Toilets — Kubera Lingam", distanceM: 5600, atKm: 10.8, open: true },
  { id: "f-water-4", kind: "water", name: "Water station — Esanya Lingam", distanceM: 7400, atKm: 12.6, open: false, note: "Refilling, back by 2 PM" },
  { id: "f-medical-3", kind: "medical", name: "Medical post — Kubera Lingam", distanceM: 5600, atKm: 10.8, open: true },
];

export const girivalamSummary = {
  walkersOnRoute: routeSegments.reduce((sum, s) => sum + s.walkers, 0),
  avgCompletion: "4h 20m",
  avgWalkingTime: "4 – 5 hrs",
  waterStationsActive: 12,
  waterStationsTotal: 14,
  medicalPostsActive: 6,
  medicalPostsTotal: 6,
  shoeStands: 9,
  ambulances: 4,
  policePosts: 11,
  annadhanamPoints: 7,
  /** Best (coolest, least crowded) window for today. */
  bestWindow: "4:00 AM – 6:00 AM",
  bestWindowAlt: "after 8:00 PM",
  maxTempC: 34,
};

/* -------------------------------------------------------------- conditions */

/** Today's weather for the route. */
export const girivalamWeather = {
  tempC: 31,
  condition: "Partly Cloudy",
  highC: 34,
  lowC: 24,
  humidity: 62,
  sunrise: "6:12 AM",
  sunset: "5:48 PM",
  advisory: "Stay hydrated and avoid heat during noon.",
};

export const crowdLevelLabel = "Moderate";

/** Banner shown beside the stats strip. */
export const todaysUpdate = {
  title: "Today's Update",
  body: "Girivalam route is open. Moderate crowd till 6 PM.",
};

export const todaysGuidance: { icon: string; text: string; highlight?: string }[] = [
  { icon: "clock", text: "Best time:", highlight: "4:00 AM – 6:00 AM or after 8:00 PM" },
  { icon: "water", text: "Carry sufficient drinking water." },
  { icon: "shoe", text: "Wear comfortable footwear." },
  { icon: "police", text: "Follow crowd and police instructions." },
  { icon: "route", text: "Use only the official Girivalam route." },
];

/** Rolling feed for the Live Updates tab. */
export interface LiveUpdate {
  time: string;
  title: string;
  body: string;
  kind: "info" | "alert" | "ok";
}

export const liveUpdates: LiveUpdate[] = [
  { time: "10:30 AM", title: "Crowd building on the East stretch", body: "Indra → Agni is at 109% of comfortable capacity. Police are regulating flow near the Chengam road junction.", kind: "alert" },
  { time: "09:50 AM", title: "Water station 7 refilled", body: "The Varuna Lingam station is back in service after a 20-minute refill.", kind: "ok" },
  { time: "09:15 AM", title: "Annadhanam serving started", body: "Free meals are being served at the Varuna Lingam point until 10 PM.", kind: "info" },
  { time: "08:40 AM", title: "Esanya water station closed", body: "Temporarily shut for refilling. Expected back by 2 PM — carry water for that stretch.", kind: "alert" },
  { time: "06:00 AM", title: "Route opened for the day", body: "All nine legs are open. Barefoot lane marked in white on the inner edge.", kind: "ok" },
  { time: "04:00 AM", title: "Pre-dawn walk window open", body: "Coolest hours of the day. 3,600 walkers on the route at this hour.", kind: "info" },
];

/** Hourly walker counts on the route, used for the trend chart. */
export const girivalamHourly = [
  { h: 0, label: "12 AM", walkers: 1400 },
  { h: 2, label: "2 AM", walkers: 1900 },
  { h: 4, label: "4 AM", walkers: 3600 },
  { h: 6, label: "6 AM", walkers: 5200 },
  { h: 8, label: "8 AM", walkers: 4100 },
  { h: 10, label: "10 AM", walkers: 2600 },
  { h: 12, label: "12 PM", walkers: 1500 },
  { h: 14, label: "2 PM", walkers: 1200 },
  { h: 16, label: "4 PM", walkers: 2400 },
  { h: 18, label: "6 PM", walkers: 4800 },
  { h: 20, label: "8 PM", walkers: 5600 },
  { h: 22, label: "10 PM", walkers: 3200 },
];

/** Past walks shown on the My Girivalam tab. */
export const pastWalks = [
  { date: "18 Oct 2026", occasion: "Pournami", durationLabel: "4h 05m", completedKm: 14, startedAt: "04:20 AM" },
  { date: "20 Sep 2026", occasion: "Pournami", durationLabel: "4h 38m", completedKm: 14, startedAt: "05:00 AM" },
  { date: "21 Aug 2026", occasion: "Pournami", durationLabel: "5h 12m", completedKm: 14, startedAt: "04:45 AM" },
  { date: "3 Aug 2026", occasion: "Regular day", durationLabel: "2h 10m", completedKm: 6.4, startedAt: "06:30 AM" },
];
