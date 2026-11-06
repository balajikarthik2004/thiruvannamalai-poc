import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Grid3x3 } from "lucide-react";
import { SEVERITY_BANDS, severityFor, zoneCapacities } from "@/data/operations";
import type { LiveZone } from "../hooks/useLiveCrowd";
import { formatCount } from "@/lib/currency";

const bandOf = (pct: number) => SEVERITY_BANDS.find((b) => b.key === severityFor(pct))!;

/**
 * Live headcount against the maximum safe occupancy of each temple zone.
 *
 * For Tiruvannamalai the maxima come from the operations dataset; other temples
 * get maxima derived from their own capacity so the panel is never empty.
 */
export const ZoneCapacityPanel = memo(function ZoneCapacityPanel({
  zones,
  templeCapacity,
  liveCrowd,
  useOperationsData,
}: {
  zones: LiveZone[];
  templeCapacity: number;
  liveCrowd: number;
  /** True for Tiruvannamalai, where real zone maxima are modelled. */
  useOperationsData: boolean;
}) {
  const { t } = useTranslation();

  const rows = useMemo(() => {
    if (useOperationsData) {
      return zoneCapacities.map((z) => {
        // Scale the modelled figure by how busy the temple is right now.
        const scale = Math.max(0.1, Math.min(1.2, liveCrowd / templeCapacity / 0.86));
        const current = Math.round(z.current * scale);
        return { id: z.id, name: z.name, current, max: z.max };
      });
    }
    return zones.map((z) => {
      const max = Math.round((templeCapacity / zones.length) * 1.3);
      return { id: z.id, name: z.name, current: Math.round((z.pct / 100) * max), max };
    });
  }, [useOperationsData, zones, templeCapacity, liveCrowd]);

  const totalCurrent = rows.reduce((s, r) => s + r.current, 0);
  const totalMax = rows.reduce((s, r) => s + r.max, 0);
  const overallPct = Math.round((totalCurrent / totalMax) * 100);
  const overallBand = bandOf(overallPct);

  return (
    <section className="bg-white border border-rose-100 rounded-3xl p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h2 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
          <Grid3x3 className="w-5 h-5 text-saffron" /> {t("Zone Capacity")}
        </h2>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${overallBand.bg} ${overallBand.text} ${overallBand.border}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${overallBand.dot}`} />
          {formatCount(totalCurrent)} / {formatCount(totalMax)} · {overallPct}%
        </span>
      </div>

      <ul className="space-y-2.5">
        {rows.map((r) => {
          const pct = Math.min(999, Math.round((r.current / r.max) * 100));
          const b = bandOf(pct);
          return (
            <li key={r.id}>
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <span className="text-xs font-semibold text-slate-800 truncate">{t(r.name)}</span>
                <span className="shrink-0 text-[11px] tabular-nums text-slate-500">
                  {formatCount(r.current)} / {formatCount(r.max)} ·{" "}
                  <span className="font-bold" style={{ color: b.hex }}>
                    {pct}%
                  </span>
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-[width] duration-700"
                  style={{ width: `${Math.min(100, pct)}%`, background: b.hex }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 pt-3 border-t border-rose-50 text-[11px] leading-relaxed text-slate-500">
        {t(
          "Maximum safe occupancy is set by the HR&CE crowd-safety plan. Zones above 95% are held at the gate until the count falls."
        )}
      </p>
    </section>
  );
});
