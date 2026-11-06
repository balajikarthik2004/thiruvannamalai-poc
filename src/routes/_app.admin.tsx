import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy } from "react";
import { useTranslation } from "react-i18next";
import { ShieldCheck, ArrowUpRight, QrCode, Gauge, Mountain } from "lucide-react";

import { AdminStatTiles } from "@/features/admin/components/AdminStatTiles";
import { LazyPanel } from "@/components/shared/LazyPanel";

// Recharts and the broadcast console are both heavy and below the fold.
const RevenueAnalytics = lazy(() =>
  import("@/features/admin/components/RevenueAnalytics").then((m) => ({ default: m.RevenueAnalytics }))
);
const EmergencyControl = lazy(() =>
  import("@/features/admin/components/EmergencyControl").then((m) => ({ default: m.EmergencyControl }))
);
import { CrowdOperations } from "@/features/admin/components/CrowdOperations";
import { StaffPanel } from "@/features/admin/components/StaffPanel";
import { ActivityFeed } from "@/features/admin/components/ActivityFeed";
import { Panel, StatusPill, Meter, ADMIN_BG } from "@/features/admin/components/AdminPrimitives";
import { LiveClock, useNow } from "@/hooks/use-now";
import { scanStats, opsKpis } from "@/data/operations";
import { girivalamSummary } from "@/data/girivalam";
import { formatCount } from "@/lib/currency";

export const Route = createFileRoute("/_app/admin")({
  head: () => ({
    meta: [
      { title: "Temple Operations Centre — OMG Devotee" },
      { name: "description", content: "Live footfall, revenue, crowd and emergency control for Tiruvannamalai Arunachaleswarar Temple." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { t } = useTranslation();
  const now = useNow(60000);

  return (
    <div className="min-h-screen text-slate-200" style={{ background: ADMIN_BG }}>
      {/* Ambient control-room glow */}
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-80 opacity-60"
          style={{
            background:
              "radial-gradient(900px 320px at 18% -10%, rgba(99,102,241,0.28), transparent 70%), radial-gradient(700px 300px at 85% -20%, rgba(244,63,94,0.22), transparent 70%)",
          }}
          aria-hidden
        />

        <div className="relative max-w-[1600px] mx-auto px-4 lg:px-8 py-6 space-y-4">
          {/* Header */}
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-1">
            <div className="flex items-start gap-3 min-w-0">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </span>
              <div className="min-w-0">
                <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                  {t("Temple Operations Centre")}
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  {t("Tiruvannamalai Arunachaleswarar Temple")} · {t("Tamil Nadu HR&CE")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <StatusPill tone="bad" pulse className="!px-3 !py-1.5 !text-xs uppercase tracking-wider">
                {t("LIVE")}
              </StatusPill>
              <span className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-slate-300">
                {now.toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-bold text-amber-300">
                <LiveClock />
              </span>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:border-white/30 transition-colors"
              >
                {t("Devotee view")} <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </header>

          <AdminStatTiles />

          <LazyPanel height="h-[26rem]" dark label="Loading revenue analytics">
            <RevenueAnalytics />
          </LazyPanel>

          {/* Crowd ops on the left, people + feed on the right */}
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] items-start">
            <div className="space-y-3 min-w-0">
              <CrowdOperations />
            </div>
            <div className="space-y-3 min-w-0">
              <StaffPanel />
              <ActivityFeed />
              <QrEntryPanel />
              <GirivalamSummaryPanel />
            </div>
          </div>

          <LazyPanel height="h-44" dark label="Loading emergency controls">
            <EmergencyControl />
          </LazyPanel>

          <footer className="pt-2 pb-6 text-center text-[11px] text-slate-600">
            {t("Simulated operations data for demonstration. No live temple systems are connected.")}
          </footer>
        </div>
      </div>
    </div>
  );
}

function QrEntryPanel() {
  const { t } = useTranslation();
  const validPct = Math.round((scanStats.valid / scanStats.totalToday) * 100);

  return (
    <Panel
      title={t("QR Entry Scanning")}
      icon={QrCode}
      action={
        <StatusPill tone={validPct >= 97 ? "ok" : "warn"}>
          {validPct}% {t("valid")}
        </StatusPill>
      }
    >
      <div className="grid grid-cols-2 gap-2.5">
        <Kpi label={t("Scans today")} value={formatCount(scanStats.totalToday)} tone="text-indigo-300" />
        <Kpi label={t("Valid entries")} value={formatCount(scanStats.valid)} tone="text-emerald-300" />
        <Kpi label={t("Expired / invalid")} value={formatCount(scanStats.invalid)} tone="text-rose-300" />
        <Kpi label={t("Avg scan time")} value={`${scanStats.avgScanSeconds}s`} tone="text-amber-300" />
      </div>

      <ul className="mt-4 pt-3 border-t border-white/10 space-y-2.5">
        {scanStats.lanes.map((l) => (
          <li key={l.lane}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-200">{t(l.lane)}</span>
              <span className="tabular-nums text-slate-400">
                {formatCount(l.scans)} · {l.avg}s
              </span>
            </div>
            <Meter value={(l.scans / scanStats.totalToday) * 100} tone="info" />
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function GirivalamSummaryPanel() {
  const { t } = useTranslation();
  const throughputPct = Math.round((opsKpis.throughput / opsKpis.throughputTarget) * 100);

  return (
    <Panel
      title={t("Girivalam Route")}
      icon={Mountain}
      action={
        <Link
          to="/girivalam"
          className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300"
        >
          {t("Open monitor")} <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      }
    >
      <div className="grid grid-cols-2 gap-2.5">
        <Kpi label={t("Walkers on route")} value={formatCount(girivalamSummary.walkersOnRoute)} tone="text-indigo-300" />
        <Kpi label={t("Avg completion")} value={girivalamSummary.avgCompletion} tone="text-slate-200" />
        <Kpi
          label={t("Water stations")}
          value={`${girivalamSummary.waterStationsActive}/${girivalamSummary.waterStationsTotal}`}
          tone="text-emerald-300"
        />
        <Kpi
          label={t("Medical posts")}
          value={`${girivalamSummary.medicalPostsActive}/${girivalamSummary.medicalPostsTotal}`}
          tone="text-amber-300"
        />
      </div>

      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="flex items-center gap-1.5 font-semibold text-slate-200">
            <Gauge className="w-3.5 h-3.5 text-amber-400" /> {t("Darshan throughput")}
          </span>
          <span className="tabular-nums text-slate-400">
            {formatCount(opsKpis.throughput)} / {formatCount(opsKpis.throughputTarget)} {t("per hour")}
          </span>
        </div>
        <Meter value={throughputPct} tone={throughputPct >= 90 ? "ok" : "warn"} height="h-2" />
      </div>
    </Panel>
  );
}

function Kpi({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-tight">
        {label}
      </div>
      <div className={`text-lg font-black tabular-nums leading-tight mt-1 ${tone}`}>{value}</div>
    </div>
  );
}
