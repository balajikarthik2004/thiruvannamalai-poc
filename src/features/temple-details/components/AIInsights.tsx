import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, AlertTriangle, XCircle, Info, BrainCircuit } from "lucide-react";
import { useTranslation } from "react-i18next";

function SlotCard({ time, period, label, ok, warn, bad, info }: any) {
  const c = ok ? "bg-emerald-50 border-emerald-100 text-emerald-700" : warn ? "bg-amber-50 border-amber-100 text-amber-700" : info ? "bg-blue-50 border-blue-100 text-blue-700" : "bg-rose-50 border-rose-100 text-rose-700";
  const Icon = ok ? CheckCircle2 : warn ? AlertTriangle : info ? Info : XCircle;
  return (
    <div className={`p-3 rounded-2xl border ${c} flex items-start gap-3`}>
      <Icon className="w-5 h-5 mt-0.5 shrink-0" />
      <div>
        <div className="font-bold text-sm leading-tight">{time}</div>
        <div className="text-[10px] uppercase tracking-widest opacity-80 mt-1 font-semibold">{period} · {label}</div>
      </div>
    </div>
  );
}

export function AIInsights({ t }: any) {
  const { t: tStr } = useTranslation();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-300">
      <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-indigo-700 font-bold text-lg mb-1">
          <BrainCircuit className="w-5 h-5" /> {tStr("AI Visit Intelligence")}
        </div>
        <div className="text-sm text-muted-foreground mb-5">{tStr("Predictive insights based on live crowd data & historical trends")}</div>

        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <SlotCard ok time="5:30 – 7:00 AM" period={tStr("Morning")} label={tStr("Highly Recommended")} />
          <SlotCard warn time="10:00 – 11:00 AM" period={tStr("Mid-morning")} label={tStr("Moderate Crowd")} />
          <SlotCard ok time="3:00 – 5:30 PM" period={tStr("Afternoon")} label={tStr("Recommended")} />
          <SlotCard info time="8:30 – 10:00 AM" period={tStr("Peak Time")} label={tStr("Morning Pooja")} />
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-indigo-100/50 rounded-xl p-4 shadow-sm flex gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <BrainCircuit className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-sm text-slate-700 leading-relaxed">
            <span className="font-semibold text-indigo-900 block mb-1">{tStr("Insight for Today")}</span>
            {tStr("Today is")} <strong>{tStr(new Date().toLocaleDateString('en-US', { weekday: 'long' }))}</strong> — {tStr("a highly auspicious day. Our models predict a")} <strong>40% {tStr("surge")}</strong> {tStr("in devotees. For a peaceful darshan, arrive before 7:00 AM or after 3:00 PM.")}
          </div>
        </div>

        <div className="mt-6 flex">
          <Link to="/chat" className="relative group inline-flex items-center justify-center gap-2.5 text-sm font-bold text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_25px_rgba(79,70,229,0.4)] bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-200 overflow-hidden">
            <span className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-[ping_2s_ease-in-out_infinite] opacity-40 pointer-events-none" />
            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-[150%] -translate-x-[150%] skew-x-12 transition-transform duration-700 ease-out pointer-events-none" />
            <BrainCircuit className="w-4 h-4 relative z-10" />
            <span className="relative z-10 tracking-wide">{tStr("Ask AI Assistant")}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
          </Link>
        </div>
      </div>
    </div>
  );
}
