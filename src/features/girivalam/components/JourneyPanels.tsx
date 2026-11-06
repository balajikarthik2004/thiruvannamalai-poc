import { memo } from "react";
import { useTranslation } from "react-i18next";
import {
  Pause,
  Play,
  Square,
  Footprints,
  Clock,
  ChevronRight,
  Droplets,
  Plus,
  Toilet,
  Shield,
  Utensils,
  Phone,
  Lock,
} from "lucide-react";

import {
  GIRIVALAM_DISTANCE_KM,
  nearbyFacilities,
  journeyProgress,
  type Facility,
  type FacilityKind,
} from "@/data/girivalam";

/* ------------------------------------------------- My Girivalam Journey --- */

export const MyJourneyCard = memo(function MyJourneyCard({
  completedKm,
  startedAt,
  running,
  onTogglePause,
  onEnd,
}: {
  completedKm: number;
  startedAt: string;
  running: boolean;
  onTogglePause: () => void;
  onEnd: () => void;
}) {
  const { t } = useTranslation();
  const p = journeyProgress(completedKm);
  const finished = completedKm >= GIRIVALAM_DISTANCE_KM;

  return (
    <section className="bg-white rounded-2xl border border-[#E8E2D5] p-4 shadow-xs">
      <header className="mb-2.5 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-serif text-base font-bold text-[#073C2C]">
          <Footprints className="h-5 w-5 text-[#A86221]" />
          {t("My Girivalam Journey")}
        </h2>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
            finished
              ? "bg-emerald-100 text-emerald-800"
              : running
                ? "bg-[#EAF6ED] text-[#14532D] border border-[#CDEBD8]"
                : "bg-amber-100 text-amber-800"
          }`}
        >
          {finished ? t("Completed") : running ? t("In Progress") : t("Paused")}
        </span>
      </header>

      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-black tabular-nums text-slate-900">
            {p.completedKm.toFixed(1)} km
          </span>
          <span className="text-sm font-semibold text-slate-400">/ {GIRIVALAM_DISTANCE_KM} km</span>
        </div>
        <span className="text-xs sm:text-sm font-bold text-slate-600">
          {p.percent}% {t("Completed")}
        </span>
      </div>

      <div
        className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[#EAE4D5]"
        role="progressbar"
        aria-valuenow={p.percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-[#16A34A] transition-[width] duration-700"
          style={{ width: `${p.percent}%` }}
        />
      </div>

      <div className="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-slate-500">
        <span>
          {t("Started at")} <strong className="font-semibold text-slate-700">{startedAt}</strong>
        </span>
        <span>
          {t("Est. Remaining:")}{" "}
          <strong className="font-semibold text-slate-700">
            {p.remainingKm} km (≈ {p.remainingLabel})
          </strong>
        </span>
      </div>

      <div className="mt-3.5 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onTogglePause}
          disabled={finished}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {running ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
          {running ? t("Pause") : t("Resume")}
        </button>
        <button
          type="button"
          onClick={onEnd}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-300 bg-white text-xs font-bold text-rose-700 transition-colors hover:bg-rose-50"
        >
          <Square className="h-3 w-3 fill-current" />
          {t("End Journey")}
        </button>
      </div>
    </section>
  );
});

/* --------------------------------------------------------------- Next stop */

export const NextStopCard = memo(function NextStopCard({
  completedKm,
  image,
  onOpen,
}: {
  completedKm: number;
  image: string;
  onOpen: () => void;
}) {
  const { t } = useTranslation();
  const p = journeyProgress(completedKm);

  return (
    <section className="bg-white rounded-2xl border border-[#E8E2D5] p-3.5 shadow-xs">
      <h2 className="mb-2 font-serif text-xs font-bold text-slate-800">
        {t("Next Stop")}
      </h2>
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center gap-3 text-left transition-colors hover:opacity-95"
      >
        {/* Sacred deity emblem */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FDF6E3] to-[#F3E3B8] border border-[#E0CF9A] shadow-xs overflow-hidden">
          <img src="/deities/girivalam_deity_clean.png" alt="" className="h-8 w-8 object-contain" />
        </div>
        {/* Temple gopuram thumbnail */}
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-11 w-11 shrink-0 rounded-lg border border-[#E8E2D5] object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="truncate font-bold text-sm text-slate-900">{t(p.nextName)}</div>
          <div className="truncate text-xs text-slate-500 font-medium">{p.nextTamil}</div>
        </div>
        <div className="shrink-0 space-y-0.5 text-right">
          <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-slate-800">
            <Footprints className="h-3.5 w-3.5 text-[#A86221]" /> {p.nextKm} km
          </div>
          <div className="flex items-center justify-end gap-1.5 text-[11px] font-medium text-slate-500">
            <Clock className="h-3 w-3" /> ≈ {p.nextEtaLabel}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
      </button>
    </section>
  );
});

/* ------------------------------------------------------- Nearby facilities */

const FACILITY_ICON: Record<FacilityKind, typeof Droplets> = {
  water: Droplets,
  medical: Plus,
  toilet: Toilet,
  police: Shield,
  annadhanam: Utensils,
  shoe: Footprints,
  parking: Shield,
};

const FACILITY_TONE: Record<FacilityKind, string> = {
  water: "text-sky-500 bg-sky-50/80 border-sky-100",
  medical: "text-rose-500 bg-rose-50/80 border-rose-100",
  toilet: "text-purple-600 bg-purple-50/80 border-purple-100",
  police: "text-blue-700 bg-blue-50/80 border-blue-100",
  annadhanam: "text-amber-700 bg-amber-50/80 border-amber-100",
  shoe: "text-slate-600 bg-slate-50/80 border-slate-100",
  parking: "text-teal-700 bg-teal-50/80 border-teal-100",
};

export const formatDistance = (m: number) =>
  m >= 1000 ? `${(m / 1000).toFixed(1).replace(/\.0$/, "")} km` : `${m} m`;

export const NearbyFacilitiesCard = memo(function NearbyFacilitiesCard({
  facilities = nearbyFacilities,
  onViewAll,
}: {
  facilities?: Facility[];
  onViewAll: () => void;
}) {
  const { t } = useTranslation();

  return (
    <section className="bg-white rounded-2xl border border-[#E8E2D5] p-4 shadow-xs">
      <header className="mb-2.5 flex items-baseline justify-between gap-3">
        <h2 className="flex items-baseline gap-1.5 font-serif text-sm font-bold text-[#073C2C]">
          <Lock className="h-3.5 w-3.5 self-center text-[#A86221]" />
          {t("Nearby Facilities")}
          <span className="text-xs font-normal text-slate-400">({t("From your location")})</span>
        </h2>
        <button
          type="button"
          onClick={onViewAll}
          className="shrink-0 text-xs font-bold text-[#A86221] hover:underline"
        >
          {t("View All")}
        </button>
      </header>

      <ul className="grid grid-cols-5 gap-2">
        {facilities.map((f) => {
          const Icon = FACILITY_ICON[f.kind];
          const tone = FACILITY_TONE[f.kind];
          return (
            <li key={f.id}>
              <div
                className={`flex h-full flex-col items-center gap-1 rounded-xl border px-1 py-2 text-center ${tone}`}
                title={f.note ? `${t(f.name)} — ${t(f.note)}` : t(f.name)}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span className="w-full truncate text-[11px] font-bold leading-tight text-slate-800">
                  {t(f.name)}
                </span>
                <span className="text-[10px] font-semibold tabular-nums text-slate-500">
                  {formatDistance(f.distanceM)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
});

/* ----------------------------------------------------------- Emergency help */

export const EmergencyHelpCard = memo(function EmergencyHelpCard({ onOpen }: { onOpen: () => void }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3.5 rounded-2xl border border-[#FCDAD7] bg-[#FFF5F5] px-4 py-3.5 text-left shadow-xs transition-all hover:bg-[#FFEBEB] hover:border-rose-300"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#A61C24] text-white shadow-sm">
        <Phone className="h-5 w-5 fill-current" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-serif text-sm font-bold text-[#A61C24]">
          {t("Emergency Help")}
        </span>
        <span className="block truncate text-[11px] font-medium text-[#742A2A]">
          {t("Medical")} · {t("Police")} · {t("Lost & Found")} · {t("Family Assistance")}
        </span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-[#A61C24]" />
    </button>
  );
});
