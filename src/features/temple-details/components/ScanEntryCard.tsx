import { memo } from "react";
import { useTranslation } from "react-i18next";
import { QrCode, CheckCircle2, XCircle, Timer, ScanLine } from "lucide-react";
import { scanStats } from "@/data/operations";
import { formatCount } from "@/lib/currency";

/**
 * QR entry-gate statistics. Shown on the temple detail page as the staff-facing
 * counterpart to the devotee's booking QR code.
 */
export const ScanEntryCard = memo(function ScanEntryCard({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const validPct = Math.round((scanStats.valid / scanStats.totalToday) * 100);

  const tiles = [
    { label: t("Total QR scans today"), value: formatCount(scanStats.totalToday), Icon: QrCode, tone: "text-indigo-600 bg-indigo-50 border-indigo-100" },
    { label: t("Valid entries"), value: formatCount(scanStats.valid), Icon: CheckCircle2, tone: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: t("Expired / invalid"), value: formatCount(scanStats.invalid), Icon: XCircle, tone: "text-rose-600 bg-rose-50 border-rose-100" },
    { label: t("Average scan time"), value: `${scanStats.avgScanSeconds}s`, Icon: Timer, tone: "text-amber-600 bg-amber-50 border-amber-100" },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
          <ScanLine className="w-5 h-5 text-saffron" /> {t("Scan Entry — Gate Terminals")}
        </h3>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {validPct}% {t("valid")}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tiles.map(({ label, value, Icon, tone }) => (
          <div key={label} className={`rounded-2xl border p-3 ${tone.split(" ").slice(1).join(" ")}`}>
            <Icon className={`w-4 h-4 mb-1.5 ${tone.split(" ")[0]}`} />
            <div className="text-xl font-black text-slate-900 tabular-nums leading-none">{value}</div>
            <div className="text-[11px] text-slate-500 mt-1 leading-tight">{label}</div>
          </div>
        ))}
      </div>

      {!compact && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            {t("By scanner lane")}
          </div>
          <ul className="space-y-1.5">
            {scanStats.lanes.map((l) => (
              <li key={l.lane} className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{t(l.lane)}</span>
                <span className="text-slate-500 tabular-nums">
                  {formatCount(l.scans)} · {l.avg}s {t("avg")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});
