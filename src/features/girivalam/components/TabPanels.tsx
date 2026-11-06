import { memo } from "react";
import { useTranslation } from "react-i18next";
import {
  Flame,
  MapPin,
  Clock,
  Footprints,
  CalendarCheck,
  Trophy,
  Droplets,
  Plus,
  Toilet,
  Shield,
  Utensils,
  Info,
  TriangleAlert,
  CircleCheck,
  Award,
} from "lucide-react";

import {
  ashtaLingamStatus,
  lingamSeverity,
  allFacilities,
  liveUpdates,
  pastWalks,
  girivalamSummary,
  journeyProgress,
  GIRIVALAM_DISTANCE_KM,
  type FacilityKind,
} from "@/data/girivalam";
import { SEVERITY_BANDS } from "@/data/operations";
import { formatCount } from "@/lib/currency";
import { formatDistance } from "./JourneyPanels";

const band = (key: string) => SEVERITY_BANDS.find((b) => b.key === key)!;
const BAND_LABEL: Record<string, string> = {
  safe: "Normal",
  moderate: "High",
  high: "Heavy",
  critical: "Very High",
};

/* ---------------------------------------------------------- Ashta Lingams */

export const AshtaLingamsPanel = memo(function AshtaLingamsPanel({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="gv-card p-5">
        <h2 className="mb-1 flex items-center gap-2 font-serif text-lg font-bold text-[#14532d]">
          <Flame className="h-5 w-5 text-[#b8860b]" />
          {t("The Eight Ashta Lingams")}
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          {t(
            "Eight shrines stand at the eight compass points around Arunachala. Devotees walk clockwise from the temple, worshipping each in turn."
          )}
        </p>

        <ul className="grid gap-3 sm:grid-cols-2">
          {ashtaLingamStatus.map((l) => {
            const b = band(lingamSeverity(l));
            const pct = Math.round((l.crowd / l.capacity) * 100);
            const active = selectedId === l.id;
            return (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => onSelect(l.id)}
                  className={`flex w-full gap-3 rounded-2xl border p-4 text-left transition-all ${
                    active
                      ? "border-[#c9a227] bg-[#fdf9ec] shadow-sm"
                      : "border-[#eee7d8] bg-white hover:border-[#c9a227]/50 hover:bg-[#faf7ef]"
                  }`}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                    style={{ background: b.hex }}
                  >
                    {l.order}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate font-bold text-slate-900">{t(l.name)}</span>
                      <span className="shrink-0 text-xs font-semibold text-slate-400">
                        {l.cumulativeKm} km
                      </span>
                    </span>
                    <span className="block truncate text-xs text-slate-500">{l.tamilName}</span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                        <MapPin className="h-3 w-3" /> {t(l.direction)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                        <Clock className="h-3 w-3" /> {l.waitMin} {t("min")}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${b.bg} ${b.text}`}
                      >
                        {t(BAND_LABEL[b.key])} · {pct}%
                      </span>
                    </span>
                    <span className="mt-1.5 block text-[11px] leading-snug text-slate-500">
                      {t(l.blessing)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Full status table */}
      <div className="gv-card p-5">
        <h3 className="mb-3 font-serif text-base font-bold text-[#14532d]">
          {t("Ashta Lingam Status")}
        </h3>
        <div className="-mx-5 overflow-x-auto px-5">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#eee7d8] text-[10px] uppercase tracking-wider text-slate-500">
                <th className="pb-2.5 text-left font-bold">{t("Lingam")}</th>
                <th className="pb-2.5 text-left font-bold">{t("Direction")}</th>
                <th className="pb-2.5 text-left font-bold">{t("Guardian")}</th>
                <th className="pb-2.5 text-left font-bold">{t("Crowd Level")}</th>
                <th className="pb-2.5 text-right font-bold">{t("Wait Time")}</th>
                <th className="pb-2.5 text-right font-bold">{t("From Previous")}</th>
                <th className="pb-2.5 text-right font-bold">{t("Cumulative")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3eee2]">
              {ashtaLingamStatus.map((l) => {
                const b = band(lingamSeverity(l));
                const pct = Math.round((l.crowd / l.capacity) * 100);
                return (
                  <tr
                    key={l.id}
                    onClick={() => onSelect(l.id)}
                    className={`cursor-pointer transition-colors ${
                      selectedId === l.id ? "bg-[#fdf9ec]" : "hover:bg-[#faf7ef]"
                    }`}
                  >
                    <td className="py-2.5 pr-3">
                      <div className="font-semibold text-slate-900">{t(l.name)}</div>
                      <div className="text-[11px] text-slate-400">{l.tamilName}</div>
                    </td>
                    <td className="py-2.5 pr-3 text-slate-600">{t(l.direction)}</td>
                    <td className="py-2.5 pr-3 text-xs text-slate-500">{t(l.guardian)}</td>
                    <td className="py-2.5 pr-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${b.bg} ${b.text} ${b.border}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${b.dot}`} />
                        {t(BAND_LABEL[b.key])} · {pct}%
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-semibold tabular-nums text-slate-800">
                      {l.waitMin} {t("min")}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-slate-500">
                      {l.distanceFromPrev} km
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-slate-500">
                      {l.cumulativeKm} km
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

/* ----------------------------------------------------------- My Girivalam */

export const MyGirivalamPanel = memo(function MyGirivalamPanel({
  completedKm,
  startedAt,
}: {
  completedKm: number;
  startedAt: string;
}) {
  const { t } = useTranslation();
  const p = journeyProgress(completedKm);
  const totalWalks = pastWalks.length;
  const fullRounds = pastWalks.filter((w) => w.completedKm >= GIRIVALAM_DISTANCE_KM).length;
  const totalKm = pastWalks.reduce((s, w) => s + w.completedKm, 0) + completedKm;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <SummaryTile icon={Footprints} value={`${totalKm.toFixed(1)} km`} label={t("Total distance walked")} />
        <SummaryTile icon={CalendarCheck} value={String(totalWalks + 1)} label={t("Girivalam walks")} />
        <SummaryTile icon={Trophy} value={String(fullRounds)} label={t("Full 14 km rounds")} />
        <SummaryTile icon={Clock} value={p.remainingLabel} label={t("Remaining today")} />
      </div>

      <div className="gv-card p-5">
        <h2 className="mb-1 flex items-center gap-2 font-serif text-lg font-bold text-[#14532d]">
          <Footprints className="h-5 w-5 text-[#b8860b]" />
          {t("Today's walk")}
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          {t("Started at")} {startedAt} · {p.completedKm.toFixed(1)} km {t("of")}{" "}
          {GIRIVALAM_DISTANCE_KM} km · {p.percent}%
        </p>

        {/* Lingam-by-lingam progress */}
        <ol className="space-y-0">
          {ashtaLingamStatus.map((l, i) => {
            const done = completedKm >= l.cumulativeKm;
            const current = !done && (i === 0 || completedKm >= ashtaLingamStatus[i - 1].cumulativeKm);
            return (
              <li key={l.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-black ${
                      done
                        ? "border-[#217a4f] bg-[#217a4f] text-white"
                        : current
                          ? "border-[#c9a227] bg-[#fdf9ec] text-[#b8860b]"
                          : "border-slate-200 bg-white text-slate-400"
                    }`}
                  >
                    {done ? <CircleCheck className="h-4 w-4" /> : l.order}
                  </span>
                  {i < ashtaLingamStatus.length - 1 && (
                    <span className={`w-0.5 flex-1 ${done ? "bg-[#217a4f]" : "bg-slate-200"}`} />
                  )}
                </div>
                <div className="min-w-0 flex-1 pb-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <span
                      className={`truncate text-sm font-bold ${done ? "text-slate-900" : "text-slate-500"}`}
                    >
                      {t(l.name)}
                    </span>
                    <span className="shrink-0 text-xs tabular-nums text-slate-400">
                      {l.cumulativeKm} km
                    </span>
                  </div>
                  <div className="truncate text-xs text-slate-400">
                    {l.tamilName} · {t(l.direction)}
                    {current && (
                      <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        {t("Next")}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="gv-card p-5">
        <h3 className="mb-3 flex items-center gap-2 font-serif text-base font-bold text-[#14532d]">
          <Award className="h-4.5 w-4.5 text-[#b8860b]" />
          {t("Past walks")}
        </h3>
        <ul className="divide-y divide-[#f3eee2]">
          {pastWalks.map((w) => (
            <li key={w.date} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-800">{w.date}</div>
                <div className="truncate text-xs text-slate-400">
                  {t(w.occasion)} · {t("Started at")} {w.startedAt}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-sm font-bold tabular-nums text-slate-800">
                  {w.completedKm} km
                </div>
                <div className="text-xs text-slate-400">{w.durationLabel}</div>
              </div>
              {w.completedKm >= GIRIVALAM_DISTANCE_KM ? (
                <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  {t("Complete")}
                </span>
              ) : (
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                  {t("Partial")}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

function SummaryTile({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Footprints;
  value: string;
  label: string;
}) {
  return (
    <div className="gv-card flex items-center gap-3 p-4">
      <Icon className="h-6 w-6 shrink-0 text-[#b8860b]" strokeWidth={1.75} />
      <div className="min-w-0">
        <div className="truncate text-lg font-black leading-tight text-[#14532d]">{value}</div>
        <div className="truncate text-[11px] text-slate-500">{label}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- Facilities */

const FACILITY_ICON: Record<FacilityKind, typeof Droplets> = {
  water: Droplets,
  medical: Plus,
  toilet: Toilet,
  police: Shield,
  annadhanam: Utensils,
  shoe: Footprints,
  parking: Shield,
};

export const FacilitiesPanel = memo(function FacilitiesPanel() {
  const { t } = useTranslation();
  const sorted = [...allFacilities].sort((a, b) => a.atKm - b.atKm);

  const counts = [
    { icon: Droplets, label: t("Water stations"), value: `${girivalamSummary.waterStationsActive} / ${girivalamSummary.waterStationsTotal}` },
    { icon: Plus, label: t("Medical posts"), value: `${girivalamSummary.medicalPostsActive} / ${girivalamSummary.medicalPostsTotal}` },
    { icon: Shield, label: t("Police posts"), value: String(girivalamSummary.policePosts) },
    { icon: Utensils, label: t("Annadhanam points"), value: String(girivalamSummary.annadhanamPoints) },
    { icon: Footprints, label: t("Shoe stands"), value: String(girivalamSummary.shoeStands) },
    { icon: Plus, label: t("Ambulances on standby"), value: String(girivalamSummary.ambulances) },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {counts.map((c) => (
          <div key={c.label} className="gv-card p-4 text-center">
            <c.icon className="mx-auto mb-1.5 h-5 w-5 text-[#b8860b]" strokeWidth={1.75} />
            <div className="text-lg font-black leading-tight text-[#14532d]">{c.value}</div>
            <div className="text-[11px] leading-tight text-slate-500">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="gv-card p-5">
        <h2 className="mb-1 font-serif text-lg font-bold text-[#14532d]">
          {t("All facilities along the route")}
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          {t("Listed in walking order from the temple. Distances are from your current position.")}
        </p>
        <ul className="divide-y divide-[#f3eee2]">
          {sorted.map((f) => {
            const Icon = FACILITY_ICON[f.kind];
            return (
              <li key={f.id} className="flex items-center gap-3 py-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    f.open ? "bg-[#f1f7f3] text-[#217a4f]" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-slate-800">{t(f.name)}</div>
                  <div className="truncate text-xs text-slate-400">
                    {t("At")} {f.atKm} km{f.note ? ` · ${t(f.note)}` : ""}
                  </div>
                </div>
                <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-500">
                  {formatDistance(f.distanceM)}
                </span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    f.open ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {f.open ? t("Open") : t("Closed")}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
});

/* ----------------------------------------------------------- Live Updates */

const UPDATE_META = {
  alert: { Icon: TriangleAlert, ring: "border-rose-200 bg-rose-50", color: "text-rose-600", label: "Alert" },
  info: { Icon: Info, ring: "border-sky-200 bg-sky-50", color: "text-sky-600", label: "Info" },
  ok: { Icon: CircleCheck, ring: "border-emerald-200 bg-emerald-50", color: "text-emerald-600", label: "Update" },
} as const;

export const LiveUpdatesPanel = memo(function LiveUpdatesPanel() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="gv-card p-5">
        <header className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-serif text-lg font-bold text-[#14532d]">{t("Live Updates")}</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            {t("Live")}
          </span>
        </header>

        <ol className="space-y-3">
          {liveUpdates.map((u, i) => {
            const meta = UPDATE_META[u.kind];
            return (
              <li key={`${u.time}-${i}`} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${meta.ring}`}>
                    <meta.Icon className={`h-4 w-4 ${meta.color}`} />
                  </span>
                  {i < liveUpdates.length - 1 && <span className="mt-1 w-px flex-1 bg-[#eee7d8]" />}
                </div>
                <div className="min-w-0 flex-1 pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <time className="text-[11px] font-bold tabular-nums text-slate-400">{u.time}</time>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${meta.color}`}>
                      {t(meta.label)}
                    </span>
                  </div>
                  <div className="mt-0.5 text-sm font-bold text-slate-900">{t(u.title)}</div>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{t(u.body)}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="gv-card p-5">
        <h3 className="mb-3 font-serif text-base font-bold text-[#14532d]">
          {t("Walkers on the route now")}
        </h3>
        <div className="text-3xl font-black text-[#14532d]">
          {formatCount(girivalamSummary.walkersOnRoute)}
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {t("Across the nine legs of the circuit. Updated every 30 seconds.")}
        </p>
      </div>
    </div>
  );
});
