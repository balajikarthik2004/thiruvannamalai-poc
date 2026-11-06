import { useTranslation } from "react-i18next";
import { Sun, Sunset, BrainCircuit } from "lucide-react";
import { LiveClock } from "@/hooks/use-now";

export function CrowdDashboard({ t, wait }: any) {
  const { t: tStr } = useTranslation();

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-white/95 backdrop-blur-xl p-8 text-foreground">
      <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-20 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="grid gap-8 md:grid-cols-3 md:items-center relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200/50 text-indigo-700 text-[10px] font-bold tracking-widest uppercase mb-3 shadow-sm">
            <BrainCircuit className="w-3 h-3 text-indigo-500" /> {tStr("AI Visit Intelligence")}
          </div>
          <div className="text-xl md:text-2xl font-bold font-serif text-slate-900 tracking-tight leading-snug mb-4">
            {tStr("Best times to visit")} {tStr("today:")}
          </div>
          <div className="flex flex-col gap-3 text-sm font-medium">
            <div className="flex items-start gap-3 bg-emerald-50/80 px-4 py-3 rounded-2xl border border-emerald-100/60 shadow-sm transition-all hover:shadow-md hover:bg-emerald-50">
              <div className="mt-0.5 rounded-full bg-emerald-200/50 p-1.5"><Sun className="w-4 h-4 text-emerald-700" /></div>
              <div className="text-emerald-900 leading-snug pt-1">{tStr("Early morning 6:00–7:30 AM — Very peaceful")}</div>
            </div>
            <div className="flex items-start gap-3 bg-amber-50/80 px-4 py-3 rounded-2xl border border-amber-100/60 shadow-sm transition-all hover:shadow-md hover:bg-amber-50">
              <div className="mt-0.5 rounded-full bg-amber-200/50 p-1.5"><Sunset className="w-4 h-4 text-amber-700" /></div>
              <div className="text-amber-900 leading-snug pt-1">{tStr("Afternoon 3:00–5:30 PM — Recommended ⭐")}</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/60 px-3.5 py-1.5 text-xs font-bold tracking-wider text-emerald-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              {tStr("LIVE")} <span className="text-emerald-600/80 font-semibold normal-case tracking-normal ml-1">· {tStr("Updated")} <LiveClock /></span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_12px_36px_rgba(0,0,0,0.06)] overflow-hidden w-full max-w-sm group hover:border-rose-200/80 transition-all duration-500">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500" />
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-50 rounded-full blur-3xl pointer-events-none group-hover:bg-rose-100/50 transition-colors duration-700" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-orange-50 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-100/50 transition-colors duration-700" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-100/50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-rose-600 mb-4 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> {tStr("Live Darshan Wait")}
              </div>

              <div className="flex items-baseline gap-1.5 justify-center">
                <div className="text-6xl font-extrabold tabular-nums tracking-tighter text-slate-800 drop-shadow-sm">{wait}</div>
                <div className="text-xl font-bold text-slate-500 mb-2">{tStr("mins")}</div>
              </div>

              <div className="mt-3 text-[13px] font-medium text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-3 w-full shadow-inner">
                {tStr("If you join the line now,")}<br />
                {tStr("you will reach the Sanctum in")} <strong className="text-rose-600 font-bold">{wait} {tStr("mins")}</strong>.
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center bg-slate-50/80 rounded-xl px-3.5 py-2.5 border border-slate-100 shadow-sm transition-all hover:bg-slate-50">
            <span className="text-slate-600 font-medium">{tStr("Today's Total Devotee")}</span>
            <span className="font-black tabular-nums text-slate-800">38,240</span>
          </div>
          <div className="flex justify-between items-center bg-rose-50/60 rounded-xl px-3.5 py-2.5 border border-rose-100/50 shadow-sm transition-all hover:bg-rose-50/80">
            <span className="text-slate-600 font-medium">{tStr("Peak (10:30 AM)")}</span>
            <span className="text-right">
              <div className="font-black tabular-nums text-slate-800">15,820</div>
              <div className="text-[10px] font-bold text-rose-500 mt-0.5 uppercase tracking-wider">{tStr("Maximum Wait:")} ~{t.waitMin + 45} {tStr("mins")}</div>
            </span>
          </div>
          <div className="flex justify-between items-center bg-emerald-50/60 rounded-xl px-3.5 py-2.5 border border-emerald-100/50 shadow-sm transition-all hover:bg-emerald-50/80">
            <span className="text-slate-600 font-medium">{tStr("Darshan Flow")}</span>
            <span className="font-black text-emerald-600 bg-emerald-100/50 px-2 py-0.5 rounded-md">1,250 / {tStr("hr")}</span>
          </div>
          <div className="flex justify-between items-center bg-amber-50/60 rounded-xl px-3.5 py-2.5 border border-amber-100/50 shadow-sm transition-all hover:bg-amber-50/80">
            <span className="text-slate-600 font-medium">
              {tStr("Next Peak")} <br /> <span className="text-[10px] text-amber-700/60 font-semibold">(5:00 PM - 6:30 PM)</span>
            </span>
            <span className="text-right">
              <div className="font-black text-slate-800">18,500 <span className="text-[9px] font-bold text-amber-600 uppercase bg-amber-100/50 px-1.5 py-0.5 rounded flex-inline ml-1">{tStr("Expected")}</span></div>
              <div className="text-[10px] font-bold text-amber-600 mt-1 uppercase tracking-wider">{tStr("Expected Wait:")} ~{t.waitMin + 60} {tStr("mins")}</div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
