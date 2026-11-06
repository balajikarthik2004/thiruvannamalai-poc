import { memo } from "react";
import { useTranslation } from "react-i18next";
import {
  Users,
  IndianRupee,
  UserCheck,
  AlertTriangle,
  Gauge,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { opsKpis, revenueBySource, incidents } from "@/data/operations";
import { formatCount, formatINRCompact } from "@/lib/currency";
import { Meter, StatusPill, PANEL, type StatusTone } from "./AdminPrimitives";

/** The five headline numbers a duty officer checks first. */
export const AdminStatTiles = memo(function AdminStatTiles() {
  const { t } = useTranslation();

  const throughputPct = Math.round((opsKpis.throughput / opsKpis.throughputTarget) * 100);
  const volunteerPct = Math.round((opsKpis.volunteersDeployed / opsKpis.volunteersSanctioned) * 100);
  const resolved = incidents.filter((i) => i.status === "resolved").length;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <Tile
        icon={Users}
        label={t("Today's Footfall")}
        value={formatCount(opsKpis.footfall)}
        tone="info"
        delta={{ up: true, text: `${opsKpis.footfallDeltaPct}% ${t(opsKpis.footfallCompare)}` }}
        footer={
          <div className="mt-3">
            <Meter value={opsKpis.occupancy} tone={opsKpis.occupancy >= 80 ? "warn" : "ok"} />
            <div className="mt-1.5 text-[11px] text-slate-400">
              {opsKpis.occupancy}% {t("of temple capacity right now")}
            </div>
          </div>
        }
      />

      <Tile
        icon={IndianRupee}
        label={t("Today's Revenue")}
        value={formatINRCompact(opsKpis.revenue)}
        tone="ok"
        delta={{ up: true, text: `9% ${t("vs last Thursday")}` }}
        footer={
          <ul className="mt-3 space-y-1">
            {revenueBySource.slice(0, 4).map((r) => (
              <li key={r.key} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: r.color }} />
                  {t(r.label)}
                </span>
                <span className="font-semibold text-slate-200 tabular-nums">
                  {formatINRCompact(r.amount)}
                </span>
              </li>
            ))}
          </ul>
        }
      />

      <Tile
        icon={UserCheck}
        label={t("Active Volunteers")}
        value={`${opsKpis.volunteersDeployed} / ${opsKpis.volunteersSanctioned}`}
        tone={volunteerPct >= 90 ? "ok" : "warn"}
        delta={{ up: false, text: `${opsKpis.volunteersSanctioned - opsKpis.volunteersDeployed} ${t("posts vacant")}` }}
        footer={
          <div className="mt-3">
            <Meter value={volunteerPct} tone={volunteerPct >= 90 ? "ok" : "warn"} />
            <div className="mt-1.5 text-[11px] text-slate-400">
              {volunteerPct}% {t("of sanctioned strength deployed")}
            </div>
          </div>
        }
      />

      <Tile
        icon={AlertTriangle}
        label={t("Open Incidents")}
        value={String(opsKpis.openIncidents)}
        tone={opsKpis.openIncidents > 2 ? "bad" : "warn"}
        delta={{ up: false, text: `${resolved} ${t("resolved today")}` }}
        footer={
          <ul className="mt-3 space-y-1.5">
            {incidents.slice(0, 2).map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-2 text-[11px]">
                <span className="truncate text-slate-300">{t(i.type)}</span>
                <StatusPill tone={i.status === "open" ? "bad" : "ok"} className="shrink-0 !px-2 !py-0.5">
                  {i.status === "open" ? t("Open") : t("Resolved")}
                </StatusPill>
              </li>
            ))}
          </ul>
        }
      />

      <Tile
        icon={Gauge}
        label={t("Darshan Throughput")}
        value={`${formatCount(opsKpis.throughput)}/hr`}
        tone={throughputPct >= 90 ? "ok" : "warn"}
        delta={{ up: false, text: `${t("target")} ${formatCount(opsKpis.throughputTarget)}/hr` }}
        footer={
          <div className="mt-3">
            <Meter value={throughputPct} tone={throughputPct >= 90 ? "ok" : "warn"} />
            <div className="mt-1.5 text-[11px] text-slate-400">
              {throughputPct}% {t("of target — add a counter at the East lane")}
            </div>
          </div>
        }
      />
    </div>
  );
});

function Tile({
  icon: Icon,
  label,
  value,
  tone,
  delta,
  footer,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  tone: StatusTone;
  delta: { up: boolean; text: string };
  footer?: React.ReactNode;
}) {
  const accent =
    tone === "bad" ? "text-rose-400" : tone === "warn" ? "text-amber-400" : tone === "ok" ? "text-emerald-400" : "text-indigo-400";
  const Trend = delta.up ? TrendingUp : TrendingDown;

  return (
    <article className={`${PANEL} rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)]`}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 leading-tight">
          {label}
        </span>
        <Icon className={`w-4 h-4 shrink-0 ${accent}`} />
      </div>
      <div className="mt-2 text-2xl font-black text-white tabular-nums leading-none">{value}</div>
      <div className={`mt-1.5 flex items-center gap-1 text-[11px] font-semibold ${delta.up ? "text-emerald-400" : "text-slate-400"}`}>
        <Trend className="w-3 h-3 shrink-0" />
        <span className="truncate">{delta.text}</span>
      </div>
      {footer}
    </article>
  );
}
