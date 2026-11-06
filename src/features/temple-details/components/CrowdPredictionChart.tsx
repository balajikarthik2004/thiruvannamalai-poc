import { memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Area,
  ComposedChart,
  Legend,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Sparkles, TrendingUp, Thermometer, Clock, Info } from "lucide-react";
import type { Temple } from "@/data/temples";
import { useNow } from "@/hooks/use-now";
import { formatCount } from "@/lib/currency";

/**
 * 24-hour interactive crowd prediction for a temple.
 *
 * Replaces the old single-series percentage forecast with an absolute head-count
 * curve the temple office can actually plan against: today's prediction, last
 * week's same-weekday actuals, the >80%-capacity danger band, the recommended
 * darshan windows, and a live "NOW" marker.
 */

export interface PredictionPoint {
  h: number;
  label: string;
  predicted: number;
  lastWeek: number;
}

interface Props {
  temple: Temple;
  /** 30-minute points from 05:30 to closing. */
  data: PredictionPoint[];
  capacity: number;
  /** Green windows the temple recommends, as [startHour, endHour] decimals. */
  recommended?: [number, number][];
  insights?: { icon: string; title: string; body: string; tone: "alert" | "info" | "warm" }[];
}

const toLabel = (h: number) => {
  const hh = Math.floor(h) % 24;
  const mm = h % 1 >= 0.5 ? "30" : "00";
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}:${mm} ${ampm}`;
};

const INSIGHT_TONE = {
  alert: { ring: "border-rose-200", bg: "bg-rose-50", title: "text-rose-900", body: "text-rose-800/80", Icon: TrendingUp },
  info: { ring: "border-indigo-200", bg: "bg-indigo-50", title: "text-indigo-900", body: "text-indigo-800/80", Icon: Info },
  warm: { ring: "border-amber-200", bg: "bg-amber-50", title: "text-amber-900", body: "text-amber-800/80", Icon: Thermometer },
} as const;

export const CrowdPredictionChart = memo(function CrowdPredictionChart({
  temple,
  data,
  capacity,
  recommended = [],
  insights = [],
}: Props) {
  const { t } = useTranslation();
  const now = useNow(60000);
  const [showLastWeek, setShowLastWeek] = useState(true);

  const nowH = now.getHours() + (now.getMinutes() >= 30 ? 0.5 : 0);
  const nowLabel = toLabel(nowH);

  const dangerLine = Math.round(capacity * 0.8);

  /** Contiguous stretches where the prediction crosses 80% of capacity. */
  const dangerBands = useMemo(() => {
    const bands: [number, number][] = [];
    let start: number | null = null;
    data.forEach((p, i) => {
      const over = p.predicted >= dangerLine;
      if (over && start === null) start = p.h;
      const last = i === data.length - 1;
      if ((!over || last) && start !== null) {
        bands.push([start, over && last ? p.h : data[Math.max(0, i - 1)].h]);
        start = null;
      }
    });
    return bands;
  }, [data, dangerLine]);

  const greenBands = useMemo(
    () => recommended.map(([a, b]) => [a, b] as [number, number]),
    [recommended]
  );

  const domain = useMemo<[number, number]>(
    () => [data[0]?.h ?? 5.5, data[data.length - 1]?.h ?? 22],
    [data]
  );

  /** Whole-hour ticks across the open window, every two hours. */
  const ticks = useMemo(() => {
    const out: number[] = [];
    for (let h = Math.ceil(domain[0]); h <= domain[1]; h += 2) out.push(h);
    return out;
  }, [domain]);

  const peak = useMemo(
    () => data.reduce((a, b) => (b.predicted > a.predicted ? b : a), data[0]),
    [data]
  );

  const nowPoint = useMemo(() => {
    let best = data[0];
    for (const p of data) if (Math.abs(p.h - nowH) < Math.abs(best.h - nowH)) best = p;
    return best;
  }, [data, nowH]);

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
        <div>
          <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-saffron" />
            {t("24-hour crowd prediction")}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {t("Predicted headcount at")} {t(temple.name)} · {t("capacity")} {formatCount(capacity)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowLastWeek((v) => !v)}
          aria-pressed={showLastWeek}
          className={`shrink-0 h-9 px-4 rounded-full text-xs font-bold border transition-colors ${
            showLastWeek
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
          }`}
        >
          {t("Compare last week")}
        </button>
      </div>

      {/* Live readout */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <Stat label={t("Right now")} value={formatCount(nowPoint.predicted)} sub={nowLabel} tone="live" />
        <Stat
          label={t("Today's peak")}
          value={formatCount(peak.predicted)}
          sub={peak.label}
          tone={peak.predicted >= dangerLine ? "danger" : "normal"}
        />
        <Stat
          label={t("Capacity used")}
          value={`${Math.round((nowPoint.predicted / capacity) * 100)}%`}
          sub={`${t("of")} ${formatCount(capacity)}`}
          tone={nowPoint.predicted >= dangerLine ? "danger" : "normal"}
        />
        <Stat
          label={t("vs last week")}
          value={`${nowPoint.lastWeek ? (nowPoint.predicted >= nowPoint.lastWeek ? "+" : "") + Math.round(((nowPoint.predicted - nowPoint.lastWeek) / nowPoint.lastWeek) * 100) : 0}%`}
          sub={t("same weekday")}
          tone="normal"
        />
      </div>

      <div className="h-72 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="predGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            {/* Recommended darshan windows */}
            {greenBands.map(([x1, x2]) => (
              <ReferenceArea
                key={`g-${x1}`}
                x1={x1}
                x2={x2}
                fill="#10b981"
                fillOpacity={0.1}
              />
            ))}
            {/* Over-capacity danger zones */}
            {dangerBands.map(([x1, x2]) => (
              <ReferenceArea
                key={`d-${x1}`}
                x1={x1}
                x2={x2}
                fill="#e11d48"
                fillOpacity={0.09}
              />
            ))}

            {/* A numeric time axis: points are spaced by the hour they fall on,
                so a 30-minute step is half the width of an hour step, and the
                reference bands can be given plain hour numbers. */}
            <XAxis
              dataKey="h"
              type="number"
              domain={domain}
              ticks={ticks}
              tickFormatter={toLabel}
              tick={{ fontSize: 10 }}
              stroke="#94a3b8"
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`)}
            />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
              formatter={(v: any, name: any) => [formatCount(Number(v)), name]}
              labelFormatter={(h) => `${t("At")} ${toLabel(Number(h))}`}
            />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} iconType="plainline" />

            <ReferenceLine
              y={dangerLine}
              stroke="#e11d48"
              strokeDasharray="4 4"
              strokeWidth={1}
              label={{ value: t("80% capacity"), position: "insideTopRight", fontSize: 10, fill: "#e11d48" }}
            />
            <ReferenceLine
              x={nowH}
              stroke="#0f172a"
              strokeWidth={2}
              label={{ value: t("NOW"), position: "top", fontSize: 10, fill: "#0f172a", fontWeight: 700 }}
            />

            {showLastWeek && (
              <Line
                type="monotone"
                dataKey="lastWeek"
                name={t("Last week (actual)")}
                stroke="#94a3b8"
                strokeWidth={1.75}
                strokeDasharray="5 4"
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            )}
            <Area
              type="monotone"
              dataKey="predicted"
              name={t("Predicted crowd")}
              stroke="#4f46e5"
              strokeWidth={2.5}
              fill="url(#predGradient)"
              dot={false}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend for the shaded bands */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 pt-4 border-t border-slate-100 text-[11px] font-semibold text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-400" />
          {t("Recommended darshan window")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-rose-500/20 border border-rose-400" />
          {t("Above 80% capacity")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-900" />
          {t("NOW")} · {nowLabel}
        </span>
      </div>

      {/* AI insight cards */}
      {insights.length > 0 && (
        <div className="grid sm:grid-cols-3 gap-3 mt-5">
          {insights.map((ins) => {
            const tone = INSIGHT_TONE[ins.tone];
            return (
              <div
                key={ins.title}
                className={`rounded-2xl border p-4 ${tone.ring} ${tone.bg}`}
              >
                <div className={`flex items-center gap-2 font-bold text-[13px] ${tone.title}`}>
                  <span aria-hidden className="text-base leading-none">{ins.icon}</span>
                  {t(ins.title)}
                </div>
                <p className={`text-xs mt-1.5 leading-relaxed ${tone.body}`}>{t(ins.body)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

function Stat({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone: "live" | "danger" | "normal";
}) {
  const ring =
    tone === "danger"
      ? "border-rose-200 bg-rose-50"
      : tone === "live"
        ? "border-indigo-200 bg-indigo-50"
        : "border-slate-200 bg-slate-50";
  return (
    <div className={`rounded-2xl border p-3 ${ring}`}>
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-xl font-black text-slate-900 tabular-nums leading-tight mt-0.5">{value}</div>
      <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>
    </div>
  );
}
