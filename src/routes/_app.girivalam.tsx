import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronRight,
  Footprints,
  Mountain,
  Clock,
  Users,
  Sun,
  CloudSun,
  Megaphone,
  Navigation,
  Flame,
  Compass,
  Building2,
  CalendarDays,
  X,
  Phone,
  ShieldAlert,
  HeartPulse,
  Baby,
} from "lucide-react";

import { LazyPanel } from "@/components/shared/LazyPanel";
import {
  MyJourneyCard,
  NextStopCard,
  NearbyFacilitiesCard,
  EmergencyHelpCard,
} from "@/features/girivalam/components/JourneyPanels";
import {
  RouteConditionsCard,
  TodaysGuidanceCard,
  WeatherSafetyCard,
  StatItem,
} from "@/features/girivalam/components/ConditionPanels";
import {
  AshtaLingamsPanel,
  MyGirivalamPanel,
  FacilitiesPanel,
  LiveUpdatesPanel,
} from "@/features/girivalam/components/TabPanels";
import {
  GIRIVALAM_DISTANCE_KM,
  ashtaLingamStatus,
  defaultJourney,
  girivalamSummary,
  girivalamWeather,
  crowdLevelLabel,
  todaysUpdate,
  journeyProgress,
  lingamSeverity,
} from "@/data/girivalam";
import { SEVERITY_BANDS } from "@/data/operations";

// Leaflet and its tile layers are the heaviest thing on the page.
const GirivalamMap = lazy(() =>
  import("@/features/girivalam/components/GirivalamMap").then((m) => ({ default: m.GirivalamMap }))
);

const TABS = [
  { id: "route", label: "Route & Navigation", icon: Navigation },
  { id: "lingams", label: "Ashta Lingams", icon: Flame },
  { id: "journey", label: "My Girivalam", icon: Compass },
  { id: "facilities", label: "Facilities", icon: Building2 },
  { id: "updates", label: "Live Updates", icon: CalendarDays },
] as const;
export type TabId = (typeof TABS)[number]["id"];

const TAB_IDS = TABS.map((tb) => tb.id) as readonly string[];

export const Route = createFileRoute("/_app/girivalam")({
  validateSearch: (search: Record<string, unknown>): { tab?: TabId } => {
    const tab = search.tab;
    return typeof tab === "string" && TAB_IDS.includes(tab) ? { tab: tab as TabId } : {};
  },
  head: () => ({
    meta: [
      { title: "Girivalam — Your Pilgrimage Companion | OMG Devotee" },
      {
        name: "description",
        content:
          "Live route, crowd status, Ashta Lingam waits and facilities for the 14 km Girivalam around Arunachala, Tiruvannamalai.",
      },
    ],
  }),
  component: GirivalamPage,
});

const NEXT_STOP_IMAGE = "/temples/tiruvannamalai/gopuram-sky.jpg";

function GirivalamPage() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const tab: TabId = search.tab ?? "route";
  const setTab = useCallback(
    (next: TabId) =>
      navigate({
        search: next === "route" ? {} : { tab: next },
        replace: true,
        resetScroll: false,
      }),
    [navigate]
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [completedKm, setCompletedKm] = useState(defaultJourney.completedKm);
  const [running, setRunning] = useState(defaultJourney.active);
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  const progress = useMemo(() => journeyProgress(completedKm), [completedKm]);
  const selected = ashtaLingamStatus.find((l) => l.id === selectedId) ?? null;

  const selectLingam = useCallback(
    (id: string) => setSelectedId((cur) => (cur === id ? null : id)),
    []
  );

  const goToFacilities = useCallback(() => setTab("facilities"), []);
  const goToLingams = useCallback(() => {
    setTab("lingams");
    if (progress.nextLingam) setSelectedId(progress.nextLingam.id);
  }, [progress.nextLingam]);

  const endJourney = useCallback(() => {
    setCompletedKm(GIRIVALAM_DISTANCE_KM);
    setRunning(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F0] pb-10">
      {/* Hero Banner matching the devotee design */}
      <header className="relative overflow-hidden border-b border-[#E9E2D8] bg-[#FAF7F0]">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-full sm:w-1/2 lg:w-2/5" aria-hidden>
          <img
            src="/temples/tiruvannamalai/girivalam_banner_mountain.png"
            alt=""
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F0] via-[#FAF7F0]/60 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-[1540px] px-4 pb-0 pt-5 lg:px-7">
          <div className="flex items-center gap-3.5">
            <img
              src="/deities/girivalam_deity_clean.png"
              alt="Annamalaiyar"
              className="h-12 w-auto shrink-0 object-contain drop-shadow-xs"
            />
            <div className="min-w-0">
              <h1 className="font-serif text-2xl font-bold leading-tight text-[#073C2C] sm:text-3xl">
                {t("Girivalam")}{" "}
                <span className="font-serif font-bold text-[#881D23]">
                  – {t("Your Pilgrimage Companion")}
                </span>
              </h1>
              <p className="mt-0.5 text-xs text-slate-600 sm:text-sm">
                {t("The sacred 14 km circumambulation around Arunachala")}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div
            role="tablist"
            aria-label={t("Girivalam sections")}
            className="scrollbar-hide -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-3 lg:mx-0 lg:px-0"
          >
            {TABS.map((tb) => {
              const active = tab === tb.id;
              return (
                <button
                  key={tb.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(tb.id)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-xs ${
                    active
                      ? "bg-[#0B3026] text-white shadow-sm"
                      : "border border-[#E2D9C8] bg-white text-slate-700 hover:border-[#14532D]/40 hover:text-[#0B3026]"
                  }`}
                >
                  <tb.icon className={`h-4 w-4 ${active ? "text-white" : "text-[#A86221]"}`} />
                  {t(tb.label)}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1540px] space-y-3.5 px-4 pt-3.5 lg:px-7">
        {/* Stats strip + today's update */}
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="bg-white rounded-2xl border border-[#E8E2D5] flex flex-wrap items-center divide-x divide-[#F0EAE0] overflow-hidden py-0.5 shadow-xs">
            <StatItem
              icon={Footprints}
              value={`${GIRIVALAM_DISTANCE_KM} km`}
              label={t("Total Route")}
              tone="text-[#A86221]"
            />
            <StatItem
              icon={Mountain}
              value="8"
              label={t("Ashta Lingams")}
              tone="text-[#A86221]"
            />
            <StatItem
              icon={Clock}
              value={girivalamSummary.avgWalkingTime}
              label={t("Avg. Walking Time")}
              tone="text-[#A86221]"
            />
            <StatItem
              icon={Users}
              value={t(crowdLevelLabel)}
              label={t("Current Crowd")}
              tone="text-[#A86221]"
            />
            <StatItem
              icon={CloudSun}
              value={`${girivalamWeather.tempC}°C`}
              label={t(girivalamWeather.condition)}
              tone="text-[#D97706]"
            />
          </div>

          <button
            type="button"
            onClick={() => setTab("updates")}
            className="flex items-center gap-3 rounded-2xl border border-[#D1ECD7] bg-[#EAF6ED] px-4 py-2.5 text-left shadow-xs transition-all hover:border-[#217A4F]/40 hover:shadow-sm"
          >
            <Megaphone className="h-5 w-5 shrink-0 text-[#217A4F]" />
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-[#14532D]">{t(todaysUpdate.title)}</span>
              <span className="block truncate text-xs text-[#2E7D4E]">{t(todaysUpdate.body)}</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-[#217A4F]/60" />
          </button>
        </div>

        {/* ------------------------------------------------ Route & Navigation */}
        {tab === "route" && (
          <div className="grid items-start gap-3.5 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-3.5">
              <LazyPanel height="h-[460px]" label="Loading route map">
                <GirivalamMap
                  walkerPosition={progress.position}
                  selectedId={selectedId}
                  onSelect={selectLingam}
                />
              </LazyPanel>

              {selected && (
                <SelectedLingamCard
                  lingamId={selected.id}
                  onClose={() => setSelectedId(null)}
                  onViewAll={() => setTab("lingams")}
                />
              )}

              <div className="grid gap-3.5 md:grid-cols-3">
                <RouteConditionsCard />
                <TodaysGuidanceCard />
                <WeatherSafetyCard />
              </div>
            </div>

            <aside className="min-w-0 space-y-3.5">
              <MyJourneyCard
                completedKm={completedKm}
                startedAt={defaultJourney.startedAt}
                running={running}
                onTogglePause={() => setRunning((v) => !v)}
                onEnd={endJourney}
              />
              <NextStopCard completedKm={completedKm} image={NEXT_STOP_IMAGE} onOpen={goToLingams} />
              <NearbyFacilitiesCard onViewAll={goToFacilities} />
              <EmergencyHelpCard onOpen={() => setEmergencyOpen(true)} />
            </aside>
          </div>
        )}

        {tab === "lingams" && <AshtaLingamsPanel selectedId={selectedId} onSelect={selectLingam} />}
        {tab === "journey" && (
          <MyGirivalamPanel completedKm={completedKm} startedAt={defaultJourney.startedAt} />
        )}
        {tab === "facilities" && <FacilitiesPanel />}
        {tab === "updates" && <LiveUpdatesPanel />}
      </div>

      {emergencyOpen && <EmergencyDialog onClose={() => setEmergencyOpen(false)} />}
    </div>
  );
}

/* --------------------------------------------- selected lingam detail card */

function SelectedLingamCard({
  lingamId,
  onClose,
  onViewAll,
}: {
  lingamId: string;
  onClose: () => void;
  onViewAll: () => void;
}) {
  const { t } = useTranslation();
  const l = ashtaLingamStatus.find((x) => x.id === lingamId);
  if (!l) return null;
  const band = SEVERITY_BANDS.find((b) => b.key === lingamSeverity(l))!;

  return (
    <section
      className="animate-in fade-in slide-in-from-top-1 rounded-2xl border p-4 duration-200"
      style={{ borderColor: `${band.hex}55`, background: `${band.hex}0f` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-serif text-lg font-bold text-[#14532D]">
            {l.order}. {t(l.name)}{" "}
            <span className="font-sans text-sm font-semibold text-slate-500">{l.tamilName}</span>
          </h3>
          <p className="mt-0.5 text-xs text-slate-600">
            {t(l.direction)} · {t(l.guardian)} · {l.cumulativeKm} km
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{t(l.note)}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {l.facilities.map((f) => (
              <span
                key={f}
                className="rounded-full border border-[#E4DDCC] bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600"
              >
                {t(f)}
              </span>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <button
            type="button"
            onClick={onClose}
            aria-label={t("Close")}
            className="rounded-full p-1 text-slate-400 transition-colors hover:bg-white hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onViewAll}
            className="whitespace-nowrap text-xs font-bold text-[#217A4F] underline-offset-2 hover:underline"
          >
            {t("View all lingams")}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- emergency dialog */

const EMERGENCY_LINES = [
  {
    icon: HeartPulse,
    label: "Medical emergency",
    detail: "Ambulance & first aid",
    number: "108",
    tone: "text-rose-600 bg-rose-50 border-rose-200",
  },
  {
    icon: ShieldAlert,
    label: "Police control room",
    detail: "Crowd & security",
    number: "100",
    tone: "text-blue-700 bg-blue-50 border-blue-200",
  },
  {
    icon: Baby,
    label: "Lost & Found",
    detail: "Lost child or belongings",
    number: "1098",
    tone: "text-amber-700 bg-amber-50 border-amber-200",
  },
  {
    icon: Phone,
    label: "Temple help desk",
    detail: "Family assistance",
    number: "04175 252 438",
    tone: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
];

function EmergencyDialog({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("Emergency help")}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-3xl border border-[#E4DDCC] bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between gap-3 border-b border-[#F0EADE] pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-md shadow-rose-600/30">
              <Phone className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-serif text-lg font-bold text-rose-950">{t("Emergency Contacts")}</h2>
              <p className="text-xs text-slate-500">
                {t("Tap any number to call immediately · Available 24/7")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("Close dialog")}
            className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ul className="mt-4 space-y-2.5">
          {EMERGENCY_LINES.map((line) => {
            const Icon = line.icon;
            return (
              <li key={line.number}>
                <a
                  href={`tel:${line.number.replace(/\s+/g, "")}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-3.5 transition-all hover:border-[#14532D] hover:bg-[#FAF7EF] hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${line.tone}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{t(line.label)}</div>
                      <div className="text-xs text-slate-500">{t(line.detail)}</div>
                    </div>
                  </div>
                  <span className="rounded-xl bg-[#073C2C] px-3 py-1.5 text-xs font-bold text-white shadow-xs">
                    {line.number}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
          <strong className="font-bold">{t("Important:")}</strong>{" "}
          {t("For medical emergencies, please provide your nearest Ashta Lingam or pole number to help teams reach you faster.")}
        </div>
      </div>
    </div>
  );
}
