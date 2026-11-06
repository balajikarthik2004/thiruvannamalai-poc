import { memo } from "react";
import { useTranslation } from "react-i18next";
import {
  BarChart3,
  Sun,
  CloudSun,
  Clock,
  Droplets,
  Footprints,
  Shield,
  Route as RouteIcon,
  TriangleAlert,
  Thermometer,
  type LucideIcon,
} from "lucide-react";

import {
  routeSegments,
  segmentSeverity,
  shortLeg,
  girivalamWeather,
  todaysGuidance,
} from "@/data/girivalam";
import { SEVERITY_BANDS } from "@/data/operations";

/** Devotee-facing wording for the four crowd bands. */
const BAND_LABEL: Record<string, string> = {
  safe: "Normal",
  moderate: "High",
  high: "Heavy",
  critical: "Very High",
};

const BAND_CHIP: Record<string, string> = {
  safe: "bg-emerald-100 text-emerald-800",
  moderate: "bg-amber-100 text-amber-800",
  high: "bg-rose-100 text-rose-800",
  critical: "bg-rose-200 text-rose-900",
};

/* ------------------------------------------------ Current route conditions */

export const RouteConditionsCard = memo(function RouteConditionsCard({
  limit = 3,
  startIndex = 1,
}: {
  limit?: number;
  startIndex?: number;
}) {
  const { t } = useTranslation();
  const legs = routeSegments.slice(startIndex, startIndex + limit);

  return (
    <section className="bg-white rounded-2xl border border-[#E8E2D5] p-4 shadow-xs">
      <h2 className="mb-3 flex items-center gap-2 font-serif text-sm font-bold text-[#073C2C]">
        <BarChart3 className="h-4 w-4 text-[#A86221]" />
        {t("Current Route Conditions")}
      </h2>
      <ul className="space-y-2.5">
        {legs.map((s) => {
          const band = segmentSeverity(s);
          return (
            <li key={s.id} className="flex items-center justify-between gap-3">
              <span className="min-w-0 truncate text-xs font-medium text-slate-800">
                {t(shortLeg(s))}{" "}
                <span className="text-slate-400 font-normal">({s.lengthKm} km)</span>
              </span>
              <span
                className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold ${BAND_CHIP[band]}`}
              >
                {t(BAND_LABEL[band])}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
});

/* ------------------------------------------------------- Today's guidance */

const GUIDE_ICON: Record<string, typeof Clock> = {
  clock: Clock,
  water: Droplets,
  shoe: Footprints,
  police: Shield,
  route: RouteIcon,
};

export const TodaysGuidanceCard = memo(function TodaysGuidanceCard() {
  const { t } = useTranslation();
  return (
    <section className="bg-white rounded-2xl border border-[#E8E2D5] p-4 shadow-xs">
      <h2 className="mb-3 flex items-center gap-2 font-serif text-sm font-bold text-[#073C2C]">
        <Sun className="h-4 w-4 text-[#A86221]" />
        {t("Today's Guidance")}
      </h2>
      <ul className="space-y-2">
        {todaysGuidance.map((g) => {
          const Icon = GUIDE_ICON[g.icon] ?? Clock;
          return (
            <li key={g.text} className="flex items-start gap-2 text-xs leading-snug text-slate-700">
              <span className="text-[#A86221] shrink-0 font-bold">•</span>
              <span>
                {g.highlight && (
                  <strong className="font-bold text-slate-900">{t(g.highlight)} </strong>
                )}
                {t(g.text)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
});

/* ---------------------------------------------------------- Weather & safety */

export const WeatherSafetyCard = memo(function WeatherSafetyCard() {
  const { t } = useTranslation();
  const w = girivalamWeather;

  return (
    <section className="bg-white rounded-2xl border border-[#E8E2D5] p-4 shadow-xs flex flex-col justify-between">
      <div>
        <h2 className="mb-2.5 flex items-center gap-2 font-serif text-sm font-bold text-[#073C2C]">
          <CloudSun className="h-4 w-4 text-[#A86221]" />
          {t("Weather & Safety")}
        </h2>

        <div className="flex items-center gap-3">
          <CloudSun className="h-10 w-10 shrink-0 text-amber-500" strokeWidth={1.5} />
          <div className="min-w-0 flex-1">
            <div className="text-2xl font-black leading-none text-slate-900">{w.tempC}°C</div>
            <div className="mt-0.5 truncate text-xs font-medium text-slate-500">{t(w.condition)}</div>
          </div>
          <div className="shrink-0 space-y-0.5 text-right text-xs text-slate-500 font-medium">
            <div>
              {t("H:")} <strong className="font-bold text-slate-800">{w.highC}°C</strong>
            </div>
            <div>
              {t("L:")} <strong className="font-bold text-slate-800">{w.lowC}°C</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-[#FEF9E7] px-2.5 py-2">
        <TriangleAlert className="h-3.5 w-3.5 shrink-0 text-amber-600" />
        <p className="text-[11px] leading-tight font-medium text-[#92400E]">{t(w.advisory)}</p>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------- Stats strip */

export const StatItem = memo(function StatItem({
  icon: Icon,
  value,
  label,
  tone = "text-[#A86221]",
}: {
  icon: typeof Thermometer | LucideIcon | any;
  value: string;
  label: string;
  tone?: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3 px-3.5 py-2.5">
      <Icon className={`h-6 w-6 shrink-0 ${tone}`} strokeWidth={1.75} />
      <div className="min-w-0">
        <div className="truncate text-sm sm:text-base font-black leading-tight text-slate-900">{value}</div>
        <div className="truncate text-[10.5px] font-medium text-slate-500">{label}</div>
      </div>
    </div>
  );
});
