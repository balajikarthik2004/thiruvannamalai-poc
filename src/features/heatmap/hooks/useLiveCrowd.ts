import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { format } from "date-fns";
import type { Temple } from "@/data/temples";
import { getUpcomingEvents } from "@/data/events";

// ---------------------------------------------------------------------------
// Crowd levels — fixed status colours, always shown with a text label.
// ---------------------------------------------------------------------------
export const LEVELS = [
  { key: "veryhigh", min: 85, label: "Very High", range: "> 85%", color: "#d03b3b" },
  { key: "high", min: 70, label: "High", range: "70% – 85%", color: "#ec835a" },
  { key: "moderate", min: 40, label: "Moderate", range: "40% – 70%", color: "#fab219" },
  { key: "low", min: 0, label: "Low", range: "≤ 40%", color: "#0ca30c" },
] as const;

export type Level = (typeof LEVELS)[number];
export const levelFor = (pct: number): Level => LEVELS.find((l) => pct > l.min || l.min === 0)!;

export const formatWait = (min: number) => {
  const m = Math.max(0, Math.round(min));
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} hr ${r} min` : `${h} hr`;
};

export const formatHour = (h: number) => {
  const hr = Math.floor(h);
  const min = Math.round((h - hr) * 60);
  const d = new Date();
  d.setHours(hr, min, 0, 0);
  return format(d, min ? "h:mm a" : "h a");
};

export interface LiveZone {
  id: string;
  kind: "gate" | "place";
  name: string;
  pct: number;
  advice: string;
  waitMin: number;
  level: Level;
}

export interface TrendPoint {
  h: number;
  typical: number;
  current?: number;
  /** Same hour, same weekday, last week — drawn by the historical overlay. */
  lastWeek: number;
}

// Hours shown on the trend chart (temple open ~5:30 AM – 9:30 PM).
const FIRST_HOUR = 6;
const LAST_HOUR = 22;

// Typical day: a morning peak, a dip while the sanctum closes after noon, and an evening peak.
function typicalShape(h: number) {
  const morning = Math.exp(-((h - 10.5) ** 2) / (2 * 2 ** 2));
  const evening = 0.85 * Math.exp(-((h - 18.5) ** 2) / (2 * 1.8 ** 2));
  return 0.12 + 0.88 * Math.max(morning, evening);
}

// Small deterministic wobble so refreshes look live without random jumps.
const wobble = (seed: number, amp: number) => Math.sin(seed * 12.9898) * amp;

const WAIT_FACTOR: Record<string, number> = { sanctum: 1.05, east: 0.8, amman: 0.7, girivalam: 0 };

interface BaseZone {
  id?: string;
  kind?: string;
  name: string;
  pct: number;
  advice: string;
}

const LIVE_REFRESH_MS = 5000;

export function useLiveCrowd(t: Temple, baseZones: BaseZone[]) {
  const [tick, setTick] = useState(0);
  const [updatedAt, setUpdatedAt] = useState(() => new Date());

  const refresh = useCallback(() => {
    setTick((n) => n + 1);
    setUpdatedAt(new Date());
  }, []);

  // Live feed: refresh every 5 s (skipped while the tab is hidden) so the counters visibly move.
  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) refresh();
    }, LIVE_REFRESH_MS);
    return () => clearInterval(id);
  }, [refresh]);

  // Today's total only ever goes up within a session; restart the count when the temple changes.
  const totalRef = useRef({ slug: t.slug, base: 0, startTick: 0 });
  if (totalRef.current.slug !== t.slug) totalRef.current = { slug: t.slug, base: 0, startTick: tick };

  return useMemo(() => {
    const now = updatedAt;
    const clockH = now.getHours() + now.getMinutes() / 60;
    const nowH = Math.min(LAST_HOUR, Math.max(FIRST_HOUR, clockH));
    const toH = (hhmm?: string) => (hhmm ? Number(hhmm.split(":")[0]) + Number(hhmm.split(":")[1]) / 60 : -1);
    const openH = toH(t.openTime);
    const closeH = toH(t.closeTime);
    const isClosed = clockH < openH || clockH >= closeH;

    // How busy this temple runs compared with a "typical" day (busier temples > 1).
    const dayFactor = Math.min(1.25, Math.max(0.6, t.crowdPct / 80));
    const peak = t.capacity * 0.9;
    const typicalAt = (h: number) => Math.round(peak * typicalShape(h));
    const currentAt = (h: number) => Math.round(typicalAt(h) * dayFactor * (1 + wobble(h + t.id, 0.035)));
    // Last week, same weekday: a little lighter, with a slightly earlier peak.
    const lastWeekAt = (h: number) =>
      Math.round(typicalAt(h - 0.25) * dayFactor * 0.82 * (1 + wobble(h * 2 + t.id, 0.05)));

    // Live figures follow the time of day; outside darshan hours only a trickle remains.
    const liveCrowd = Math.round((isClosed ? typicalAt(nowH) * 0.15 : currentAt(nowH)) * (1 + wobble(tick + t.id, 0.012)));
    const occupancy = Math.min(100, Math.round((liveCrowd / t.capacity) * 100));
    // Zone baselines in useHeatmapZones describe the temple's busy period; scale them to now.
    const zoneScale = Math.min(1.15, Math.max(0.15, liveCrowd / t.crowd));

    const zones: LiveZone[] = baseZones.map((z, i) => {
      const pct = Math.max(3, Math.min(100, Math.round(z.pct * zoneScale + wobble(tick * 7 + i, 4))));
      const id = z.id ?? `zone-${i}`;
      const factor = WAIT_FACTOR[id] ?? 0.6;
      return { id, kind: z.kind === "gate" ? "gate" : "place", name: z.name, advice: z.advice, pct, waitMin: pct * factor, level: levelFor(pct) };
    });

    const trend: TrendPoint[] = [];
    for (let h = FIRST_HOUR; h <= LAST_HOUR; h++) {
      trend.push({ h, typical: typicalAt(h), current: h < nowH ? currentAt(h) : undefined, lastWeek: lastWeekAt(h) });
    }
    // Exact "now" point so the line ends on the live figure.
    trend.push({ h: nowH, typical: typicalAt(nowH), current: liveCrowd, lastWeek: lastWeekAt(nowH) });
    trend.sort((a, b) => a.h - b.h);

    // KPIs
    const elapsed = trend.filter((p) => p.current !== undefined && p.h <= nowH);
    // Base from the day's curve plus arrivals since the page opened (~1 arrival per 90 min of stay per person).
    if (!totalRef.current.base) totalRef.current.base = Math.round(elapsed.reduce((s, p) => s + (p.current ?? 0), 0) * 1.25);
    let arrivals = 0;
    if (!isClosed) {
      for (let k = totalRef.current.startTick + 1; k <= tick; k++) arrivals += Math.round((liveCrowd / 1080) * (1 + Math.abs(wobble(k * 3 + t.id, 0.6))));
    }
    const totalToday = totalRef.current.base + arrivals;
    const vsTypicalPct = Math.round((dayFactor - 1) * 100 + wobble(t.id, 3));
    const avgWait = isClosed ? 0 : t.waitMin * zoneScale;
    const hourAgo = Math.max(FIRST_HOUR, nowH - 1);
    const waitHourAgo = t.waitMin * Math.min(1.15, Math.max(0.15, currentAt(hourAgo) / t.crowd));
    const waitDelta = isClosed ? 0 : Math.round(avgWait - waitHourAgo);

    // Peak / quiet windows: look ahead within today's darshan hours; once the day is
    // (nearly) over, roll forward to tomorrow's pattern.
    const closeStart = toH(t.afternoonClose);
    const closeEnd = toH(t.afternoonOpen);
    const lastStart = Math.min(LAST_HOUR, Math.floor(closeH)) - 2;
    const tomorrow = isClosed || Math.ceil(nowH) > lastStart;
    const from = tomorrow ? Math.ceil(Math.max(openH, FIRST_HOUR)) : Math.ceil(nowH);
    const prefix = tomorrow ? "Tomorrow, " : "";

    let peakH = from;
    for (let h = from; h <= lastStart; h++) if (typicalAt(h) + typicalAt(h + 1) > typicalAt(peakH) + typicalAt(peakH + 1)) peakH = h;

    let best = { h: from, load: Infinity };
    for (let h = from; h <= lastStart; h++) {
      if (closeStart !== -1 && h + 2 > closeStart && h < closeEnd) continue; // skip the afternoon closure
      const load = typicalAt(h) + typicalAt(h + 1);
      if (load < best.load) best = { h, load };
    }
    const bestWindow = best.load === Infinity ? null : `${prefix}${formatHour(best.h)} – ${formatHour(best.h + 2)}`;

    const gates = zones.filter((z) => z.kind === "gate");
    const busyGates = gates.filter((z) => z.pct >= 70).sort((a, b) => b.pct - a.pct);
    const quietestGate = [...gates].sort((a, b) => a.pct - b.pct)[0];
    const hottest = [...zones].sort((a, b) => b.pct - a.pct)[0];

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const nextEvent = getUpcomingEvents(t.slug).find((e) => {
      if (!e.bookDate) return false;
      const [y, m, d] = e.bookDate.split("-").map(Number);
      return new Date(y, m - 1, d) >= today;
    });

    return {
      tick,
      updatedAt,
      refresh,
      nowH,
      liveCrowd,
      occupancy,
      isClosed,
      openTime: formatHour(openH),
      overall: levelFor(occupancy),
      zones,
      trend,
      kpis: {
        totalToday,
        vsTypicalPct,
        weekday: format(now, "EEEE"),
        avgWait,
        waitDelta,
        peakWindow: `${formatHour(peakH)} – ${formatHour(peakH + 2)}`,
        peakIsTomorrow: tomorrow,
      },
      busyGates,
      quietestGate,
      hottest,
      bestWindow,
      nextEvent,
    };
  }, [t, baseZones, tick, updatedAt, refresh]);
}
