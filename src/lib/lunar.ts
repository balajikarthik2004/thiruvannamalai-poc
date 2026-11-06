/**
 * Full-moon (Pournami) dates.
 *
 * Girivalam draws its biggest crowds on Pournami night, so the Girivalam
 * monitor and the temple pages need the next full moon without shipping a
 * hard-coded table that silently goes stale.
 *
 * Mean-phase approximation (Meeus, "Astronomical Algorithms", ch. 49) with the
 * main periodic correction. Accurate to within a few hours, which is plenty for
 * "the next Pournami is on …".
 */

const SYNODIC_MONTH = 29.530588853;

/** Julian Day Number for a JS Date. */
const toJD = (d: Date) => d.getTime() / 86400000 + 2440587.5;

/** JS Date for a Julian Day Number. */
const fromJD = (jd: number) => new Date((jd - 2440587.5) * 86400000);

function fullMoonJD(k: number): number {
  // k is offset by 0.5 for full moons (k integer = new moon).
  const kk = k + 0.5;
  const t = kk / 1236.85;
  const t2 = t * t;
  const t3 = t2 * t;

  let jd =
    2451550.09766 +
    SYNODIC_MONTH * kk +
    0.00015437 * t2 -
    0.00000015 * t3 +
    0.00000000073 * t2 * t2;

  const rad = Math.PI / 180;
  // Sun's mean anomaly
  const M = (2.5534 + 29.1053567 * kk - 0.0000014 * t2) * rad;
  // Moon's mean anomaly
  const Mp = (201.5643 + 385.81693528 * kk + 0.0107582 * t2) * rad;
  // Moon's argument of latitude
  const F = (160.7108 + 390.67050284 * kk - 0.0016118 * t2) * rad;

  jd +=
    -0.40614 * Math.sin(Mp) +
    0.17302 * Math.sin(M) +
    0.01614 * Math.sin(2 * Mp) +
    0.01043 * Math.sin(2 * F) +
    0.00734 * Math.sin(Mp - M) -
    0.00515 * Math.sin(Mp + M) +
    0.00209 * Math.sin(2 * M);

  return jd;
}

/** The next full moon strictly after `from` (defaults to now). */
export function nextFullMoon(from: Date = new Date()): Date {
  const jdNow = toJD(from);
  // Rough k for the current epoch, then walk forward to the first future one.
  const k = Math.floor(((jdNow - 2451550.09766) / SYNODIC_MONTH) - 1);
  for (let i = 0; i < 6; i++) {
    const jd = fullMoonJD(k + i);
    if (jd > jdNow) return fromJD(jd);
  }
  return fromJD(fullMoonJD(k + 6));
}

/** The n next full moons after `from`. */
export function upcomingFullMoons(count: number, from: Date = new Date()): Date[] {
  const out: Date[] = [];
  let cursor = from;
  for (let i = 0; i < count; i++) {
    const next = nextFullMoon(cursor);
    out.push(next);
    cursor = new Date(next.getTime() + 2 * 86400000);
  }
  return out;
}

/**
 * Karthigai Deepam — the Maha Deepam is lit on the Karthigai month Pournami,
 * which always falls on the full moon in late November or December.
 */
export function nextKarthigaiDeepam(from: Date = new Date()): Date {
  for (const moon of upcomingFullMoons(14, from)) {
    const m = moon.getMonth(); // 10 = Nov, 11 = Dec
    const d = moon.getDate();
    if ((m === 10 && d >= 20) || (m === 11 && d <= 15)) return moon;
  }
  return nextFullMoon(from);
}

export const formatFestivalDate = (d: Date) =>
  d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export const daysUntil = (d: Date, from: Date = new Date()) =>
  Math.max(0, Math.ceil((d.getTime() - from.getTime()) / 86400000));
