import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Activity, DoorOpen, Grid3x3 } from "lucide-react";
import {
  gateStats,
  zoneCapacities,
  SEVERITY_BANDS,
  severityFor,
  opsKpis,
  type GateStat,
} from "@/data/operations";
import { formatCount } from "@/lib/currency";
import { Panel, StatusPill, Meter, toneForPct } from "./AdminPrimitives";

const bandColor = (pct: number) => SEVERITY_BANDS.find((b) => b.key === severityFor(pct))!.hex;

/** Compact zone grid — the admin-side distillation of the devotee heatmap. */
export const MiniHeatmap = memo(function MiniHeatmap() {
  const { t } = useTranslation();
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {zoneCapacities.map((z) => {
          const pct = Math.round((z.current / z.max) * 100);
          return (
            <div
              key={z.id}
              className="rounded-xl border border-white/10 p-2.5 transition-colors"
              style={{ background: `${bandColor(pct)}1f` }}
              title={`${t(z.name)} — ${formatCount(z.current)} / ${formatCount(z.max)}`}
            >
              <div className="flex items-start justify-between gap-1.5">
                <span className="text-[10px] font-semibold text-slate-300 leading-tight line-clamp-2">
                  {t(z.name)}
                </span>
                <span
                  className="h-2 w-2 rounded-full shrink-0 mt-0.5"
                  style={{ background: bandColor(pct) }}
                />
              </div>
              <div className="mt-1.5 text-lg font-black tabular-nums leading-none" style={{ color: bandColor(pct) }}>
                {pct}%
              </div>
              <div className="text-[10px] text-slate-400 tabular-nums mt-0.5">
                {formatCount(z.current)} / {formatCount(z.max)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 pt-3 border-t border-white/10">
        {SEVERITY_BANDS.map((b) => (
          <span key={b.key} className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="h-2 w-2 rounded-full" style={{ background: b.hex }} />
            {t(b.label)} <span className="text-slate-500">{b.short}</span>
          </span>
        ))}
      </div>
    </div>
  );
});

export const GateStatusTable = memo(function GateStatusTable({
  gates = gateStats,
}: {
  gates?: GateStat[];
}) {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto -mx-5 px-5">
      <table className="w-full min-w-[620px] text-sm border-collapse">
        <thead>
          <tr className="text-[10px] uppercase tracking-wider text-slate-400 border-b border-white/10">
            <th className="text-left font-bold pb-2.5">{t("Gate")}</th>
            <th className="text-left font-bold pb-2.5">{t("Status")}</th>
            <th className="text-right font-bold pb-2.5">{t("Entries")}</th>
            <th className="text-right font-bold pb-2.5">{t("Exits")}</th>
            <th className="text-right font-bold pb-2.5">{t("Inside")}</th>
            <th className="text-right font-bold pb-2.5">{t("Queue")}</th>
            <th className="text-right font-bold pb-2.5">{t("Flow")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {gates.map((g) => {
            const inside = g.entries - g.exits;
            // Queue pressure relative to a 400-deep line being "critical".
            const queuePct = Math.min(100, (g.queue / 400) * 100);
            return (
              <tr key={g.id} className={`${g.open ? "" : "opacity-55"} hover:bg-white/5 transition-colors`}>
                <td className="py-2.5 pr-3">
                  <div className="font-semibold text-slate-100">{t(g.name)}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">{t(g.note)}</div>
                </td>
                <td className="py-2.5 pr-3">
                  <StatusPill tone={g.open ? "ok" : "idle"} pulse={g.open}>
                    {g.open ? t("Open") : t("Closed")}
                  </StatusPill>
                </td>
                <td className="py-2.5 text-right tabular-nums text-slate-200">{formatCount(g.entries)}</td>
                <td className="py-2.5 text-right tabular-nums text-slate-400">{formatCount(g.exits)}</td>
                <td className="py-2.5 text-right tabular-nums font-semibold text-slate-100">
                  {formatCount(inside)}
                </td>
                <td className="py-2.5 pl-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="tabular-nums text-slate-200 w-10 text-right">{g.queue}</span>
                    <Meter value={queuePct} tone={toneForPct(queuePct)} className="w-14" />
                  </div>
                </td>
                <td className="py-2.5 text-right tabular-nums text-slate-400 whitespace-nowrap">
                  {g.open ? `${formatCount(g.throughput)}/hr` : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-white/10 text-slate-300">
            <td className="pt-2.5 font-bold text-[11px] uppercase tracking-wider text-slate-400">
              {t("Total")}
            </td>
            <td />
            <td className="pt-2.5 text-right tabular-nums font-bold">
              {formatCount(gates.reduce((s, g) => s + g.entries, 0))}
            </td>
            <td className="pt-2.5 text-right tabular-nums font-bold">
              {formatCount(gates.reduce((s, g) => s + g.exits, 0))}
            </td>
            <td className="pt-2.5 text-right tabular-nums font-bold text-amber-400">
              {formatCount(gates.reduce((s, g) => s + g.entries - g.exits, 0))}
            </td>
            <td className="pt-2.5 text-right tabular-nums font-bold">
              {formatCount(gates.reduce((s, g) => s + g.queue, 0))}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
});

export const CrowdOperations = memo(function CrowdOperations() {
  const { t } = useTranslation();
  const occupancy = opsKpis.occupancy;
  const band = SEVERITY_BANDS.find((b) => b.key === severityFor(occupancy))!;

  return (
    <div className="space-y-3">
      <Panel
        title={t("Crowd Operations")}
        icon={Activity}
        action={
          <StatusPill tone={toneForPct(occupancy)} pulse>
            {t(band.label)} · {occupancy}% {t("capacity")}
          </StatusPill>
        }
      >
        <MiniHeatmap />
      </Panel>

      <Panel title={t("Gate Status")} icon={DoorOpen}>
        <GateStatusTable />
      </Panel>

      <Panel title={t("Zone Capacity")} icon={Grid3x3}>
        <ul className="space-y-3">
          {zoneCapacities.map((z) => {
            const pct = Math.round((z.current / z.max) * 100);
            return (
              <li key={z.id}>
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <span className="text-xs font-semibold text-slate-200 truncate">{t(z.name)}</span>
                  <span className="text-[11px] tabular-nums text-slate-400 shrink-0">
                    {formatCount(z.current)} / {formatCount(z.max)} ·{" "}
                    <span className="font-bold" style={{ color: bandColor(pct) }}>{pct}%</span>
                  </span>
                </div>
                <Meter value={pct} tone={toneForPct(pct)} />
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
});
