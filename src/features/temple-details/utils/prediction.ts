import { forecastFor, type Temple } from "@/data/temples";
import { hourlyFootfall, TEMPLE_CAPACITY } from "@/data/operations";
import { TIRUVANNAMALAI_SLUG } from "@/data/tiruvannamalai";
import type { PredictionPoint } from "../components/CrowdPredictionChart";

/**
 * Absolute head-count prediction for a temple, in 30-minute steps.
 *
 * Tiruvannamalai uses the hand-tuned operations curve (the one the admin centre
 * also plots). Every other temple derives its curve from the existing
 * percentage forecast scaled by that temple's own capacity, with last week's
 * series shifted down to represent a quieter non-festival day.
 */
export function predictionFor(temple: Temple): {
  data: PredictionPoint[];
  capacity: number;
  recommended: [number, number][];
} {
  if (temple.slug === TIRUVANNAMALAI_SLUG) {
    return {
      data: hourlyFootfall.map((p) => ({
        h: p.h,
        label: p.label,
        predicted: p.predicted,
        lastWeek: p.lastWeek,
      })),
      capacity: TEMPLE_CAPACITY,
      // Early morning before the build-up, and the mid-afternoon reopening.
      recommended: [
        [5.5, 7],
        [15.5, 16.5],
      ],
    };
  }

  const capacity = temple.capacity || 10000;
  const data: PredictionPoint[] = forecastFor(temple).map((p: any) => {
    const predicted = Math.round((p.pct / 100) * capacity);
    // A typical same-weekday last week: lighter, with a slightly flatter peak.
    const lastWeek = Math.round(predicted * (0.74 + 0.1 * Math.sin(p.hour / 2)));
    return { h: p.hour, label: p.label, predicted, lastWeek };
  });

  // Recommend the two quietest contiguous open stretches.
  const sorted = [...data].sort((a, b) => a.predicted - b.predicted);
  const quiet = sorted.slice(0, 4).map((p) => p.h).sort((a, b) => a - b);
  const recommended: [number, number][] = [];
  for (const h of quiet) {
    const last = recommended[recommended.length - 1];
    if (last && h - last[1] <= 1) last[1] = h + 0.5;
    else recommended.push([h, h + 0.5]);
  }

  return { data, capacity, recommended: recommended.slice(0, 2) };
}

/** Three AI-style insight cards shown under the prediction chart. */
export function insightsFor(temple: Temple, data: PredictionPoint[], capacity: number) {
  const peak = data.reduce((a, b) => (b.predicted > a.predicted ? b : a), data[0]);
  const quiet = data.reduce((a, b) => (b.predicted < a.predicted ? b : a), data[0]);
  const weekday = new Date().toLocaleDateString("en-IN", { weekday: "long" });
  const isTvm = temple.slug === TIRUVANNAMALAI_SLUG;

  return [
    {
      icon: "🔮",
      tone: "alert" as const,
      title: "Surge Alert",
      body: `Crowd expected to peak at ${peak.label} (~${peak.predicted.toLocaleString("en-IN")}), about ${Math.round((peak.predicted / capacity) * 100)}% of capacity. Arrive before 7:00 AM or after 3:00 PM for the shortest wait.`,
    },
    {
      icon: "📊",
      tone: "info" as const,
      title: isTvm ? "Today is Pradosham" : "Weekday pattern",
      body: isTvm
        ? `Pradosham days historically draw about 40% higher footfall than a regular ${weekday} at Arunachaleswarar. Expect longer queues at the Shiva sannithi after the evening abhishekam.`
        : `${weekday} footfall at ${temple.name} typically runs close to today's curve. The quietest window is around ${quiet.label}.`,
    },
    {
      icon: "🌡️",
      tone: "warm" as const,
      title: "Heat advisory",
      body: isTvm
        ? "Temperature will reach 34°C by 1 PM. Girivalam walkers should start before 6 AM — the granite path gets painfully hot for bare feet after 10 AM."
        : "Temperature will reach 34°C by 1 PM. Carry water and avoid the open prakaram between noon and 3 PM.",
    },
  ];
}
