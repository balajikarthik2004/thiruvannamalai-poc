import { Bell, CheckCircle2, Activity, Users, Clock, TrendingDown, BellRing } from "lucide-react";
import { useTranslation } from "react-i18next";

export function SmartAlerts({ t, pct, alertOn, setAlertOn }: any) {
  const { t: tStr } = useTranslation();

  return (
    <div className="bg-gradient-to-br from-[#fffdf5] to-[#fff7ed] border border-saffron/30 rounded-2xl p-5 shadow-md shadow-saffron/5 hover:shadow-lg hover:shadow-saffron/10 transition-all duration-300 relative group overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-saffron/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-all duration-700 group-hover:bg-saffron/20"></div>

      {/* Live Indicator pulse */}
      <div className="absolute top-5 right-5 flex items-center gap-1.5 bg-rose-50 border border-rose-100 px-2 py-1 rounded-md shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
        <span className="text-[9px] font-bold uppercase tracking-wider text-rose-600">{tStr("Live Status")}</span>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4 text-saffron">
          <Activity className="w-4 h-4" />
          <h3 className="font-serif text-lg font-bold text-slate-900">{tStr("Smart Alerts")}</h3>
        </div>

        <div className="bg-white/90 backdrop-blur-sm border border-saffron/20 rounded-xl p-4 mb-4 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-5">
            {/* Left: Progress Circle & Status */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="relative grid h-24 w-24 place-items-center mb-3">
                <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#fffbeb" strokeWidth="8" />
                  <circle cx="50" cy="50" r="44" fill="none" stroke="url(#alertGradient)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${(pct / 100) * 276} 276`} className="transition-all duration-1000 ease-out drop-shadow-md" />
                  <defs>
                    <linearGradient id="alertGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#e11d48" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="text-center flex flex-col items-center bg-white/60 w-16 h-16 rounded-full justify-center shadow-[inset_0_2px_10px_rgb(0,0,0,0.05)] backdrop-blur-sm border border-amber-50">
                  <div className="text-2xl font-black text-slate-800 tracking-tighter">{Math.round(pct)}%</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-[9px] uppercase text-slate-500 font-bold tracking-[0.2em] mb-1">{tStr("Current Rush")}</div>
                <div className="text-lg font-serif font-bold text-saffron bg-saffron/5 px-5 py-1 rounded-full border border-saffron/20 shadow-sm">
                  {pct > 80 ? tStr("Heavy Rush") : pct > 50 ? tStr("Moderate") : tStr("Peaceful")}
                </div>
              </div>
            </div>

            {/* Right: Stats Grid */}
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
              <div className="bg-slate-50/80 rounded-xl py-3 px-2 border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center">
                <div className="text-[9px] uppercase text-slate-500 font-extrabold tracking-wider mb-1">{tStr("Inside Temple")}</div>
                <div className="text-lg font-black tabular-nums text-slate-800">{t.crowd.toLocaleString()}</div>
              </div>
              <div className="bg-slate-50/80 rounded-xl py-3 px-2 border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center">
                <div className="flex items-center justify-center gap-1.5 mb-1 text-slate-400">
                  <Users className="w-3 h-3" />
                  <span className="text-[9px] uppercase text-slate-500 font-extrabold tracking-wider">{tStr("Waiting")}</span>
                </div>
                <div className="text-lg font-black tabular-nums text-slate-800">4,320</div>
              </div>
              <div className="bg-slate-50/80 rounded-xl py-3 px-2 border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center">
                <div className="flex items-center justify-center gap-1.5 mb-1 text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span className="text-[9px] uppercase text-slate-500 font-extrabold tracking-wider">{tStr("Wait Time")}</span>
                </div>
                <div className="text-lg font-black tabular-nums text-slate-800">45m</div>
              </div>
              <div className="bg-saffron/5 rounded-xl py-3 px-2 border border-saffron/20 shadow-[0_2px_10px_rgb(245,158,11,0.05)] flex flex-col items-center justify-center">
                <div className="flex items-center justify-center gap-1.5 mb-1 text-saffron">
                  <TrendingDown className="w-3 h-3" />
                  <span className="text-[9px] uppercase text-saffron font-extrabold tracking-wider">{tStr("Darshan")}</span>
                </div>
                <div className="text-lg font-black tabular-nums text-saffron">8m</div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="bg-saffron/10 text-saffron shrink-0 mt-0.5 p-1.5 rounded-full border border-saffron/20">
              <BellRing className="w-3 h-3" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">{tStr("Peaceful Darshan Alert")}</p>
              <p className="text-[10px] font-medium text-slate-600 mt-0.5 leading-relaxed">{tStr("We'll send you a gentle reminder when the crowd clears up so you can have a peaceful Darshan.")}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setAlertOn((a: boolean) => !a)}
          className={`relative overflow-hidden w-full rounded-xl py-2.5 text-xs font-bold transition-all duration-300 ${alertOn
              ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-200 shadow-inner"
              : "bg-gradient-to-r from-saffron to-rose-500 text-white shadow-md shadow-saffron/20 hover:shadow-lg hover:shadow-saffron/30 hover:-translate-y-0.5"
            }`}
        >
          <div className="relative z-10 flex items-center justify-center gap-1.5">
            {alertOn ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
            {alertOn ? tStr("You will be notified") : tStr("Notify me for peaceful Darshan")}
          </div>
        </button>
      </div>
    </div>
  );
}
