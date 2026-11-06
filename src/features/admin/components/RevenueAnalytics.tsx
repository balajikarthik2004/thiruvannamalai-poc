import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import { IndianRupee, Target } from "lucide-react";
import { weeklyRevenue, revenueBySource, monthToDate, todaysRevenue } from "@/data/operations";
import { formatINR, formatINRCompact } from "@/lib/currency";
import { Panel, Meter } from "./AdminPrimitives";

const AXIS = { fontSize: 11, fill: "#94a3b8" };

const tooltipStyle = {
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "#0f1733",
  color: "#e2e8f0",
  fontSize: 12,
};

export const RevenueAnalytics = memo(function RevenueAnalytics() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"bars" | "trend">("bars");

  const mtdPct = Math.round((monthToDate.collected / monthToDate.target) * 100);
  const weekTotal = weeklyRevenue.reduce((s, d) => s + d.total, 0);
  const dailyAvg = Math.round(weekTotal / weeklyRevenue.length);

  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
      <Panel
        title={t("Revenue — last 7 days")}
        icon={IndianRupee}
        action={
          <div className="flex rounded-full border border-white/10 p-0.5 bg-white/5">
            {(["bars", "trend"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                  mode === m ? "bg-amber-400 text-[#0b1020]" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {m === "bars" ? t("By source") : t("Total trend")}
              </button>
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-3 gap-3 mb-4">
          <MiniStat label={t("Today")} value={formatINRCompact(todaysRevenue)} />
          <MiniStat label={t("7-day total")} value={formatINRCompact(weekTotal)} />
          <MiniStat label={t("Daily average")} value={formatINRCompact(dailyAvg)} />
        </div>

        <div className="h-56 -ml-3">
          <ResponsiveContainer width="100%" height="100%">
            {mode === "bars" ? (
              <BarChart data={weeklyRevenue} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="day" tick={AXIS} tickLine={false} axisLine={false} />
                <YAxis
                  tick={AXIS}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `${(v / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={tooltipStyle}
                  formatter={(v: any, n: any) => [formatINR(Number(v)), t(String(n))]}
                />
                {revenueBySource.map((r) => (
                  <Bar
                    key={r.key}
                    dataKey={r.key}
                    name={r.label}
                    stackId="rev"
                    fill={r.color}
                    radius={r.key === "membership" ? [4, 4, 0, 0] : undefined}
                  />
                ))}
              </BarChart>
            ) : (
              <AreaChart data={weeklyRevenue} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={AXIS} tickLine={false} axisLine={false} />
                <YAxis
                  tick={AXIS}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `${(v / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: any) => [formatINR(Number(v)), t("Total")]}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#fbbf24"
                  strokeWidth={2.5}
                  fill="url(#revTrend)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 pt-3 border-t border-white/10">
          {revenueBySource.map((r) => (
            <span key={r.key} className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="h-2 w-2 rounded-sm" style={{ background: r.color }} />
              {t(r.label)}
            </span>
          ))}
        </div>
      </Panel>

      <Panel title={t("Today by source")} icon={Target}>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={revenueBySource}
                dataKey="amount"
                nameKey="label"
                innerRadius="58%"
                outerRadius="92%"
                paddingAngle={2}
                stroke="none"
              >
                {revenueBySource.map((r) => (
                  <Cell key={r.key} fill={r.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v: any, n: any) => [formatINR(Number(v)), t(String(n))]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="mt-3 space-y-2">
          {revenueBySource.map((r) => {
            const share = Math.round((r.amount / todaysRevenue) * 100);
            return (
              <li key={r.key} className="flex items-center justify-between gap-3 text-xs">
                <span className="flex items-center gap-2 text-slate-300 truncate">
                  <span className="h-2 w-2 rounded-sm shrink-0" style={{ background: r.color }} />
                  <span className="truncate">{t(r.label)}</span>
                </span>
                <span className="shrink-0 tabular-nums text-slate-400">
                  <span className="font-semibold text-slate-200">{formatINRCompact(r.amount)}</span> · {share}%
                </span>
              </li>
            );
          })}
        </ul>

        {/* Month-to-date against the trust's target */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t("Month to date")} · {t(monthToDate.label)}
            </span>
            <span className="text-sm font-black text-amber-400 tabular-nums">{mtdPct}%</span>
          </div>
          <Meter value={mtdPct} tone={mtdPct >= 70 ? "ok" : mtdPct >= 50 ? "warn" : "bad"} height="h-2" />
          <div className="mt-2 flex justify-between text-[11px] text-slate-400 tabular-nums">
            <span>{formatINRCompact(monthToDate.collected)} {t("collected")}</span>
            <span>{t("target")} {formatINRCompact(monthToDate.target)}</span>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{t(monthToDate.note)}</p>
        </div>
      </Panel>
    </div>
  );
});

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
      <div className="text-base font-black text-white tabular-nums leading-tight mt-0.5">{value}</div>
    </div>
  );
}
