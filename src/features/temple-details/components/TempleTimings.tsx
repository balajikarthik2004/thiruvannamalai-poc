import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

function formatHM(hm?: string) {
  if (!hm) return "";
  let [h, m] = hm.split(":");
  let hInt = parseInt(h);
  let ampm = hInt >= 12 ? "PM" : "AM";
  if (hInt > 12) hInt -= 12;
  if (hInt === 0) hInt = 12;
  return `${hInt}:${m} ${ampm}`;
}

export function TempleTimings({ t }: any) {
  const { t: tStr } = useTranslation();

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-status-low animate-pulse" /><span className="font-bold text-slate-800">{tStr("Temple is open")}</span></div>
      <div className="mt-5 grid sm:grid-cols-2 gap-y-6 gap-x-4 text-sm">
        <div>
          <div className="text-slate-500 font-bold tracking-widest uppercase text-xs mb-1">{tStr("Morning")}</div>
          <div className="font-semibold text-slate-800">{tStr("Open")} {formatHM(t.openTime)}</div>
          <div className="text-slate-500 mt-0.5">{tStr("First Pooja")} {t.poojas[0]?.split(" ").slice(0, 2).join(" ")}</div>
        </div>
        <div>
          <div className="text-slate-500 font-bold tracking-widest uppercase text-xs mb-1">{tStr("Afternoon Break")}</div>
          <div className="font-semibold text-slate-800">{t.afternoonClose ? `${tStr("Closed")} ${formatHM(t.afternoonClose)}` : tStr("No Afternoon Break")}</div>
          <div className="text-slate-500 mt-0.5">{t.afternoonOpen ? `${tStr("Until")} ${formatHM(t.afternoonOpen)}` : tStr("Open All Day")}</div>
        </div>
        <div>
          <div className="text-slate-500 font-bold tracking-widest uppercase text-xs mb-1">{tStr("Evening")}</div>
          <div className="font-semibold text-slate-800">{t.afternoonOpen ? `${tStr("Reopens")} ${formatHM(t.afternoonOpen)}` : tStr("Evening Darshan")}</div>
          <div className="text-slate-500 mt-0.5">{tStr("Last Pooja")} {t.poojas[t.poojas.length - 1]?.split(" ").slice(0, 2).join(" ")}</div>
        </div>
        <div>
          <div className="text-slate-500 font-bold tracking-widest uppercase text-xs mb-1">{tStr("Closes")}</div>
          <div className="font-semibold text-slate-800">{tStr("Last Entry")} {formatHM(t.closeTime)}</div>
          <div className="text-slate-500 mt-0.5">{tStr("Gates close")} {formatHM(t.closeTime)}</div>
        </div>
      </div>
      <div className="mt-6 flex">
        <Link to="/poojas" search={{ temple: t.slug }} className="relative group inline-flex items-center justify-center gap-2.5 text-sm font-bold text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_25px_rgba(249,115,22,0.4)] bg-gradient-to-r from-orange-500 to-rose-500 shadow-lg shadow-orange-200 overflow-hidden w-full sm:w-auto">
          <span className="absolute inset-0 rounded-full border-2 border-orange-400 animate-[ping_2s_ease-in-out_infinite] opacity-40 pointer-events-none" />
          <div className="absolute inset-0 bg-white/20 group-hover:translate-x-[150%] -translate-x-[150%] skew-x-12 transition-transform duration-700 ease-out pointer-events-none" />
          <span className="relative z-10 tracking-wide">{tStr("View full pooja schedule")}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
        </Link>
      </div>
    </div>
  );
}
