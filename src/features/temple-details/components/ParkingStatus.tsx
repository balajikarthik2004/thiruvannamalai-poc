import { useTranslation } from "react-i18next";

export function ParkingStatus({ t }: any) {
  const { t: tStr } = useTranslation();

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
      <h3 className="font-serif text-lg font-bold text-slate-900">{tStr("Parking status")}</h3>
      <div className="mt-4 space-y-2.5">
        {(["lotA", "lotB", "overflow"] as const).map((k) => {
          const v = t.parking[k];
          const label = k === "lotA" ? tStr("Lot A") : k === "lotB" ? tStr("Lot B") : tStr("Overflow");
          const colorClass = v > 80 ? "text-rose-600" : v > 50 ? "text-amber-500" : "text-emerald-500";
          const bgClass = v > 80 ? "bg-rose-500" : v > 50 ? "bg-amber-500" : "bg-emerald-500";
          return (
            <div key={k} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all gap-4">
              <div className="w-16 shrink-0">
                <div className="text-xs font-bold text-slate-700">{label}</div>
              </div>
              <div className="flex-1">
                <div className="h-2 bg-slate-200/60 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ease-out ${bgClass}`} style={{ width: `${v}%` }} />
                </div>
              </div>
              <div className={`w-10 text-right text-sm font-black tabular-nums ${colorClass}`}>{v}%</div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 text-[13px] font-medium text-indigo-900 bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-start gap-2">
        <span className="text-base">🤖</span>
        <span>{tStr("Park at Lot B or the overflow lot today — Lot A will be full by 10:30 AM.")}</span>
      </div>
    </div>
  );
}
