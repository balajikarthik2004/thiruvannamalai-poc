import { Clock, Utensils, Info, Coffee, Sun, Moon, Soup } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const getAnnadhanamData = (slug: string, tStr: any) => {
  switch (slug) {
    case "tiruvannamalai":
      return {
        complex: tStr("Arunachaleswarar Temple Annadhanam Hall (HR&CE)"),
        timings: [
          { name: tStr("Lunch"), code: "LU", time: tStr("12:00 PM onwards"), menu: tStr("Rice, Sambar, Rasam, Poriyal, Buttermilk, Payasam") },
        ],
        notes: tStr("Free meals under the HR&CE Annadhanam scheme. Timings and capacity change on Pournami and Karthigai Deepam days — check at the temple office."),
      };
    case "palani-murugan":
      return {
        complex: tStr("Dhandayuthapani Swamy Annadhanam Hall"),
        timings: [
          { name: tStr("Breakfast"), code: "BF", time: tStr("8:00 AM – 11:00 AM"), menu: tStr("Ven Pongal, Rava Upma, Sambar, Chutney") },
          { name: tStr("Lunch"), code: "LU", time: tStr("11:30 AM – 3:30 PM"), menu: tStr("Rice, Sambar, Rasam, Kootu, Poriyal, Buttermilk, Payasam") },
          { name: tStr("Dinner"), code: "DI", time: tStr("6:00 PM – 9:00 PM"), menu: tStr("Wheat Upma, Chapati, Veg Kurma") }
        ],
        notes: tStr("Annadhanam is provided continuously from morning to night. About 5,000 devotees are served daily.")
      };
    case "shirdi-sai":
      return {
        complex: tStr("Shri Sai Prasadalaya"),
        timings: [
          { name: tStr("Breakfast"), code: "BF", time: tStr("7:00 AM – 10:00 AM") },
          { name: tStr("Lunch"), code: "LU", time: tStr("10:30 AM – 3:00 PM") },
          { name: tStr("Dinner"), code: "DI", time: tStr("7:00 PM – 10:00 PM") }
        ],
        notes: tStr("One of the largest solar-powered dining halls. Both free and subsidized meals available.")
      };
    case "madurai-meenakshi":
      return {
        complex: tStr("HR&CE Annadhanam Hall"),
        timings: [
          { name: tStr("Lunch Service"), code: "LU", time: tStr("12:15 PM onwards") }
        ],
        notes: tStr("Provided as part of the HR&CE scheme. Tokens are usually issued earlier in the day.")
      };
    default:
      return {
        complex: tStr("Temple Annaprasadam Complex"),
        timings: [
          { name: tStr("Lunch"), code: "LU", time: tStr("11:30 AM – 2:30 PM") },
          { name: tStr("Dinner"), code: "DI", time: tStr("7:30 PM – 9:30 PM") }
        ],
        notes: tStr("Free service for all pilgrims. Timing may vary based on crowd and festival days. Please leave footwear outside.")
      };
  }
};

export function AnnadhanamDetails({ t }: { t: any }) {
  const { t: tStr } = useTranslation();
  const [waitTime, setWaitTime] = useState(30);

  const data = getAnnadhanamData(t.slug, tStr);

  useEffect(() => {
    // Simulating live wait time variation
    const i = setInterval(() => {
      setWaitTime(w => Math.max(10, Math.round(w + (Math.random() * 6 - 3))));
    }, 12000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="bg-white border border-slate-200/60 rounded-[32px] p-5 shadow-sm relative overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-saffron/10 border border-saffron/20 flex items-center justify-center text-saffron shrink-0">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-slate-900 text-lg leading-tight tracking-tight">{t.name} {tStr("Annadhanam")}</h3>
            <p className="text-[11px] font-semibold text-saffron mt-0.5">{data.complex}</p>
          </div>
        </div>

        <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-saffron/5 to-amber-50/50 border border-saffron/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Clock className="w-5 h-5 text-saffron" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 border-2 border-white rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-slate-800">{tStr("Live Wait Time")}</div>
              <div className="text-[10px] font-medium text-slate-500 mt-0.5">{tStr("Updates dynamically")}</div>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="text-xl font-black tabular-nums text-saffron leading-none">
              {waitTime} <span className="text-xs font-bold text-saffron/80">{tStr("min")}</span>
            </div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1">{tStr("Moderate Crowd")}</div>
          </div>
        </div>

        <div className="space-y-2.5">
          {data.timings.map((timing: any, idx: number) => (
            <div key={idx} className="flex items-start p-3 rounded-2xl border border-slate-100 hover:border-saffron/30 bg-slate-50/50 hover:bg-white transition-colors">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-slate-200 shadow-sm mr-3">
                {timing.code === "BF" && <Coffee className="w-3.5 h-3.5 text-saffron" />}
                {timing.code === "LU" && <Sun className="w-3.5 h-3.5 text-saffron" />}
                {timing.code === "DI" && <Moon className="w-3.5 h-3.5 text-saffron" />}
                {timing.code === "ALL" && <Soup className="w-3.5 h-3.5 text-saffron" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="text-[13px] font-bold text-slate-800">{timing.name}</div>
                  <div className="text-[10px] font-bold text-saffron bg-saffron/10 px-2 py-0.5 rounded-full border border-saffron/20">{timing.time}</div>
                </div>
                {timing.menu && <div className="text-[11px] text-slate-500 leading-snug pr-2 mt-1">{timing.menu}</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-2.5 text-[11px] font-medium text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200/60 leading-relaxed">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <p>{data.notes}</p>
        </div>
      </div>
    </div>
  );
}
