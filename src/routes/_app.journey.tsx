import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  Award,
  Footprints,
  CalendarCheck,
  Trophy,
  Flame,
  Ticket,
  HeartHandshake,
  ArrowRight,
  Mountain,
} from "lucide-react";

import {
  GIRIVALAM_DISTANCE_KM,
  defaultJourney,
  journeyProgress,
  pastWalks,
} from "@/data/girivalam";
import { formatINR } from "@/lib/currency";

export const Route = createFileRoute("/_app/journey")({
  head: () => ({
    meta: [
      { title: "My Journey — OMG Devotee" },
      { name: "description", content: "Your darshan history, Girivalam walks, bookings and offerings in one place." },
    ],
  }),
  component: MyJourney,
});

/** Simulated devotee history for the demo. */
const DARSHAN_HISTORY = [
  { date: "18 Oct 2026", temple: "Tiruvannamalai Arunachaleswarar Temple", type: "Special Entry", amount: 200 },
  { date: "20 Sep 2026", temple: "Tiruvannamalai Arunachaleswarar Temple", type: "Special Entry", amount: 200 },
  { date: "14 Sep 2026", temple: "Palani Murugan Temple", type: "VIP Darshan", amount: 500 },
  { date: "21 Aug 2026", temple: "Tiruvannamalai Arunachaleswarar Temple", type: "Free Darshan", amount: 0 },
];

const OFFERINGS = [
  { date: "18 Oct 2026", cause: "Annadhanam", amount: 2500 },
  { date: "20 Sep 2026", cause: "Temple maintenance", amount: 1001 },
  { date: "3 Aug 2026", cause: "Deepam fund", amount: 5000 },
];

function MyJourney() {
  const { t } = useTranslation();
  const p = journeyProgress(defaultJourney.completedKm);

  const totalKm = pastWalks.reduce((s, w) => s + w.completedKm, 0) + defaultJourney.completedKm;
  const fullRounds = pastWalks.filter((w) => w.completedKm >= GIRIVALAM_DISTANCE_KM).length;
  const totalOffered = OFFERINGS.reduce((s, o) => s + o.amount, 0);

  return (
    <div className="min-h-screen gv-surface pb-10">
      <header className="border-b border-[#e9e2d2] px-4 pb-7 pt-7 lg:px-7">
        <div className="mx-auto max-w-[1540px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e0cf9a] bg-[#fdf6e3] px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#b8860b]">
            <Award className="h-4 w-4" /> {t("My Journey")}
          </span>
          <h1 className="mt-3 font-serif text-3xl font-bold text-[#14532d]">
            {t("Your pilgrimage so far")}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            {t("Every Girivalam walk, darshan and offering you have made through OMG Devotee.")}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1540px] space-y-4 px-4 pt-5 lg:px-7">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Tile icon={Footprints} value={`${totalKm.toFixed(1)} km`} label={t("Total distance walked")} />
          <Tile icon={Trophy} value={String(fullRounds)} label={t("Full 14 km Girivalam rounds")} />
          <Tile icon={CalendarCheck} value={String(DARSHAN_HISTORY.length)} label={t("Darshans booked")} />
          <Tile icon={HeartHandshake} value={formatINR(totalOffered)} label={t("Total offered")} />
        </div>

        {/* Girivalam in progress */}
        <section className="gv-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-[#14532d]">
              <Mountain className="h-5 w-5 text-[#b8860b]" />
              {t("Girivalam in progress")}
            </h2>
            <Link
              to="/girivalam"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#14532d] px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:brightness-110"
            >
              {t("Open live monitor")} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-3 flex items-baseline justify-between gap-3">
            <span className="text-2xl font-black tabular-nums text-[#14532d]">
              {p.completedKm.toFixed(1)} km{" "}
              <span className="text-sm font-semibold text-slate-400">/ {GIRIVALAM_DISTANCE_KM} km</span>
            </span>
            <span className="text-sm font-bold text-slate-600">{p.percent}%</span>
          </div>
          <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-[#eae4d5]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#217a4f] to-[#14532d]"
              style={{ width: `${p.percent}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {t("Next stop")}: <strong className="text-slate-700">{t(p.nextName)}</strong> · {p.nextKm} km
            · ≈ {p.nextEtaLabel}
          </p>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Past walks */}
          <section className="gv-card p-5">
            <h2 className="mb-3 flex items-center gap-2 font-serif text-base font-bold text-[#14532d]">
              <Footprints className="h-4.5 w-4.5 text-[#b8860b]" />
              {t("Past Girivalam walks")}
            </h2>
            <ul className="divide-y divide-[#f3eee2]">
              {pastWalks.map((w) => (
                <li key={w.date} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-800">{w.date}</div>
                    <div className="truncate text-xs text-slate-400">
                      {t(w.occasion)} · {w.durationLabel}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      w.completedKm >= GIRIVALAM_DISTANCE_KM
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {w.completedKm} km
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Darshan history */}
          <section className="gv-card p-5">
            <h2 className="mb-3 flex items-center gap-2 font-serif text-base font-bold text-[#14532d]">
              <Ticket className="h-4.5 w-4.5 text-[#b8860b]" />
              {t("Darshan history")}
            </h2>
            <ul className="divide-y divide-[#f3eee2]">
              {DARSHAN_HISTORY.map((d, i) => (
                <li key={`${d.date}-${i}`} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-800">{t(d.temple)}</div>
                    <div className="truncate text-xs text-slate-400">
                      {d.date} · {t(d.type)}
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-bold tabular-nums text-slate-700">
                    {d.amount ? formatINR(d.amount) : t("Free")}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Offerings */}
        <section className="gv-card p-5">
          <h2 className="mb-3 flex items-center gap-2 font-serif text-base font-bold text-[#14532d]">
            <Flame className="h-4.5 w-4.5 text-[#b8860b]" />
            {t("Offerings & donations")}
          </h2>
          <ul className="divide-y divide-[#f3eee2]">
            {OFFERINGS.map((o, i) => (
              <li key={`${o.date}-${i}`} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-800">{t(o.cause)}</div>
                  <div className="text-xs text-slate-400">{o.date}</div>
                </div>
                <span className="shrink-0 text-sm font-bold tabular-nums text-[#217a4f]">
                  {formatINR(o.amount)}
                </span>
              </li>
            ))}
          </ul>
          <Link
            to="/donations"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#217a4f] underline-offset-2 hover:underline"
          >
            {t("Make another offering")} <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}

function Tile({
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
      <Icon className="h-7 w-7 shrink-0 text-[#b8860b]" strokeWidth={1.75} />
      <div className="min-w-0">
        <div className="truncate text-xl font-black leading-tight text-[#14532d]">{value}</div>
        <div className="truncate text-[11px] text-slate-500">{label}</div>
      </div>
    </div>
  );
}
