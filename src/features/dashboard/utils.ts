import type { Temple } from "@/data/temples";

// Temple hours are stored in the temple's local time.
const US_CENTRAL = new Set(["dallas-arulmigu-mariamman-usa", "meenakshi-temple-pearland"]);
export const templeTimeZone = (t: Temple) =>
  t.state === "USA" ? (US_CENTRAL.has(t.slug) ? "America/Chicago" : "America/New_York") : "Asia/Kolkata";

const toMins = (hhmm?: string) => (hhmm ? Number(hhmm.split(":")[0]) * 60 + Number(hhmm.split(":")[1]) : undefined);

/** Minutes past midnight right now, in the temple's own time zone. */
function localMinutes(t: Temple, now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: templeTimeZone(t), hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(now);
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h * 60 + m;
}

export function isOpenNow(t: Temple, now: Date) {
  const m = localMinutes(t, now);
  const open = toMins(t.openTime)!;
  const close = toMins(t.closeTime)!;
  const breakStart = toMins(t.afternoonClose);
  const breakEnd = toMins(t.afternoonOpen);
  if (m < open || m >= close) return false;
  if (breakStart !== undefined && breakEnd !== undefined && m >= breakStart && m < breakEnd) return false;
  return true;
}

const fmt = (mins: number) => {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m ? `${h12}:${String(m).padStart(2, "0")}` : `${h12}:00`;
};
const ampm = (mins: number) => (Math.floor(mins / 60) % 24 >= 12 ? "PM" : "AM");

/** Quieter window: just after the afternoon reopening, or mid-afternoon if the temple stays open. */
export function optimalWindow(t: Temple) {
  const start = toMins(t.afternoonOpen) ?? 15 * 60;
  const end = Math.min(start + 120, (toMins(t.closeTime) ?? 21 * 60) - 30);
  return `${fmt(start)} – ${fmt(end)} ${ampm(end)}`;
}

/** "Lord Shiva (Arunachaleswarar / Annamalaiyar) & Unnamulai Amman" → "Lord Shiva". */
export const shortDeity = (deity: string) => deity.split(/\s[(&]/)[0].trim();

/** Same derivations the header uses, kept in one place so cards and header agree. */
export function templeStats(t: Temple) {
  return {
    todayTotal: Math.round(t.crowd * 1.73),
    peakWait: t.waitMin + 45,
    flowPerHour: Math.round(t.capacity / 20 / 10) * 10,
    nextPeakWait: t.waitMin + 60,
  };
}
