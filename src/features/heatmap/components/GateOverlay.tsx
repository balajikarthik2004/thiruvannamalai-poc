import { memo } from "react";
import { useTranslation } from "react-i18next";
import { DoorOpen, DoorClosed, Users, Clock } from "lucide-react";
import { SEVERITY_BANDS, severityFor, gateStats } from "@/data/operations";
import type { LiveZone } from "../hooks/useLiveCrowd";
import { formatCount } from "@/lib/currency";

/**
 * Gate markers laid over the temple map.
 *
 * Positions are compass-aligned against the map image — the Arunachaleswarar
 * plan is drawn with North at the top, so the East Rajagopuram sits on the
 * right edge, Thirumanjana (South) at the bottom, and so on. Each marker shows
 * open/closed state, live queue length and entries so far today.
 */

const bandOf = (pct: number) => SEVERITY_BANDS.find((b) => b.key === severityFor(pct))!;

/** Percentage positions on the map image, keyed by the heatmap zone id. */
const GATE_POSITIONS: Record<string, { top: string; left: string; align: "left" | "right" | "center" }> = {
  east: { top: "48%", left: "88%", align: "right" },
  north: { top: "12%", left: "50%", align: "center" },
  south: { top: "86%", left: "50%", align: "center" },
  west: { top: "48%", left: "12%", align: "left" },
  inner: { top: "50%", left: "50%", align: "center" },
};

/** Live entry/exit counters, matched to the admin centre's gate figures. */
const COUNTS: Record<string, { entries: number; queue: number }> = Object.fromEntries(
  gateStats.map((g) => [g.id, { entries: g.entries, queue: g.queue }])
);

export const GateOverlay = memo(function GateOverlay({
  zones,
  selectedId,
  onSelect,
  isClosed,
}: {
  zones: LiveZone[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isClosed: boolean;
}) {
  const { t } = useTranslation();
  const gates = zones.filter((z) => z.kind === "gate" && GATE_POSITIONS[z.id]);

  if (gates.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {gates.map((g) => {
        const pos = GATE_POSITIONS[g.id];
        const band = bandOf(g.pct);
        const counts = COUNTS[g.id] ?? { entries: 0, queue: Math.round(g.pct * 4) };
        // The South gate is shut in today's scenario.
        const open = !isClosed && g.id !== "south";
        const selected = selectedId === g.id;
        const Icon = open ? DoorOpen : DoorClosed;

        return (
          <button
            key={g.id}
            type="button"
            onClick={() => onSelect(g.id)}
            aria-pressed={selected}
            className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 group transition-transform duration-200 ${
              selected ? "scale-105 z-20" : "z-10 hover:scale-105"
            }`}
            style={{ top: pos.top, left: pos.left }}
          >
            <span
              className={`flex flex-col items-${pos.align === "center" ? "center" : "start"} gap-1`}
            >
              {/* Pin */}
              <span className="relative flex items-center justify-center">
                <span
                  className="absolute h-9 w-9 rounded-full animate-ping opacity-25"
                  style={{ background: open ? band.hex : "#64748b" }}
                />
                <span
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-lg"
                  style={{ background: open ? band.hex : "#475569" }}
                >
                  <Icon className="h-4 w-4 text-white" />
                </span>
              </span>

              {/* Label card */}
              <span
                className={`rounded-xl border bg-white/95 backdrop-blur-sm px-2.5 py-1.5 shadow-lg text-left min-w-[7.5rem] ${
                  selected ? "border-slate-900" : "border-white/70"
                }`}
              >
                <span className="block text-[10px] font-black text-slate-900 leading-tight line-clamp-1">
                  {t(g.name).replace(/\s*\(.*\)$/, "")}
                </span>
                <span className="mt-0.5 flex items-center gap-1">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: open ? band.hex : "#94a3b8" }}
                  />
                  <span className="text-[9px] font-bold uppercase tracking-wide text-slate-500">
                    {open ? t(band.label) : t("Closed")}
                  </span>
                </span>
                <span className="mt-1 flex items-center justify-between gap-2 text-[9px] text-slate-600 tabular-nums">
                  <span className="inline-flex items-center gap-0.5">
                    <Clock className="h-2.5 w-2.5" /> {open ? counts.queue : 0}
                  </span>
                  <span className="inline-flex items-center gap-0.5">
                    <Users className="h-2.5 w-2.5" /> {formatCount(open ? counts.entries : 0)}
                  </span>
                </span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
});

/** Shared four-band legend used by the map and the Girivalam route. */
export const SeverityLegend = memo(function SeverityLegend({ className = "" }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-rose-100 bg-white px-4 py-3 shadow-sm ${className}`}
    >
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {t("Capacity")}
      </span>
      {SEVERITY_BANDS.map((b) => (
        <span key={b.key} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: b.hex }} />
          {t(b.label)}
          <span className="font-normal text-slate-400">{b.short}</span>
        </span>
      ))}
    </div>
  );
});
