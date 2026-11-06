import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Area, AreaChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { girivalamHourly } from "@/data/girivalam";
import { formatCount } from "@/lib/currency";

/** Walkers on the Girivalam route across the day, with a live NOW marker. */
export const GirivalamTrendChart = memo(function GirivalamTrendChart({ nowHour }: { nowHour: number }) {
  const { t } = useTranslation();

  const nowLabel = girivalamHourly.reduce((a, b) =>
    Math.abs(b.h - nowHour) < Math.abs(a.h - nowHour) ? b : a
  ).label;

  return (
    <div className="h-40 -ml-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={girivalamHourly} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="walkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e32c26" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#e32c26" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} minTickGap={16} />
          <YAxis
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
          />
          <Tooltip
            contentStyle={{ borderRadius: 10, border: "1px solid #f1dfd7", fontSize: 12 }}
            formatter={(v: any) => [formatCount(Number(v)), t("Walkers")]}
          />
          <ReferenceLine
            x={nowLabel}
            stroke="#0f172a"
            strokeWidth={1.5}
            label={{ value: t("NOW"), position: "top", fontSize: 9, fill: "#0f172a", fontWeight: 700 }}
          />
          <Area
            type="monotone"
            dataKey="walkers"
            stroke="#e32c26"
            strokeWidth={2}
            fill="url(#walkGrad)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});
