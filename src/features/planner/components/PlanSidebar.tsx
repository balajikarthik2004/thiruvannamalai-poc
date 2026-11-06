import { useTranslation } from "react-i18next";
import { Route as RouteIcon, Clock, Flame, Accessibility, CalendarDays, MapPin, Maximize2, BrainCircuit } from "lucide-react";
import type { Temple } from "@/data/temples";
import { temples } from "@/data/temples";

const FEATURES = [
  { icon: RouteIcon, title: "Optimized Route", desc: "Best travel and temple route" },
  { icon: Clock, title: "Ideal Timing", desc: "Minimize wait time, avoid peak crowds" },
  { icon: Flame, title: "Pooja Recommendations", desc: "Suggested services based on your purpose" },
  { icon: Accessibility, title: "Comfort Focus", desc: "Options for seniors and differently-abled" },
];

const HERO: Record<string, string> = { tiruvannamalai: "/temples/tiruvannamalai/plan-trip-hero.jpg" };

const toMins = (hhmm?: string) => (hhmm ? Number(hhmm.split(":")[0]) * 60 + Number(hhmm.split(":")[1]) : undefined);
const fmt = (mins: number) => {
  const d = new Date();
  d.setHours(Math.floor(mins / 60), mins % 60, 0, 0);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

/** Preview schedule built from the temple's opening hours and the chosen time of day. */
function buildItinerary(t: Temple, time: string) {
  const open = toMins(t.openTime) ?? 360;
  const base =
    time === "lateMorning" ? Math.max(open, 8 * 60)
    : time === "afternoon" ? toMins(t.afternoonOpen) ?? 15 * 60
    : time === "evening" ? 17 * 60 + 30
    : open; // early morning / AI decides → first darshan of the day, usually the quietest
  const quiet = time === "morning" || time === "any";
  return [
    { at: base - 30, label: "Arrive at temple" },
    { at: base, label: quiet ? "Darshan at opening (low crowd)" : "Special entry darshan" },
    { at: base + 90, label: "Participate in pooja" },
    { at: base + 135, label: "Prasadam & temple visit" },
  ];
}

interface Props {
  t?: Temple;
  time: string;
  fromLocation: string;
  travelHours: number;
  travelMins: number;
  setFullMap: (v: boolean) => void;
}

export function PlanSidebar({ t, time, fromLocation, travelHours, travelMins, setFullMap }: Props) {
  const { t: tStr } = useTranslation();
  const temple = t ?? temples[0];
  const itinerary = buildItinerary(temple, time);
  const showMap = !!t && fromLocation.trim().length >= 3;
  const art = HERO[temple.slug] ?? temple.image;

  return (
    <div className="space-y-5">
      <section className="bg-white border border-rose-100 rounded-3xl p-5 shadow-sm">
        <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-slate-900 mb-4">
          <BrainCircuit className="w-5 h-5 text-saffron" /> {tStr("AI Trip Planner")}
        </h2>
        <ul className="space-y-1">
          {FEATURES.map((f) => (
            <li key={f.title} className="flex items-start gap-3 rounded-xl px-2 py-2">
              <span className="w-9 h-9 rounded-xl bg-rose-50 text-saffron flex items-center justify-center shrink-0">
                <f.icon className="w-[18px] h-[18px]" />
              </span>
              <span>
                <span className="block text-sm font-bold text-slate-900 leading-tight">{tStr(f.title)}</span>
                <span className="block text-xs text-slate-500 mt-0.5">{tStr(f.desc)}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {showMap && (
        <section className="bg-white border border-rose-100 rounded-3xl overflow-hidden shadow-sm animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between px-4 py-3 border-b border-rose-100">
            <span className="flex items-center gap-2 text-sm font-bold text-slate-900"><MapPin className="w-4 h-4 text-saffron" /> {tStr("Live Route Preview")}</span>
            <span className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-saffron bg-rose-50 px-2 py-1 rounded-md">{travelHours}{tStr("h")} {travelMins}{tStr("m")}</span>
              <button type="button" onClick={() => setFullMap(true)} aria-label={tStr("Full view")} className="p-1.5 rounded-md text-saffron hover:bg-rose-50">
                <Maximize2 className="w-4 h-4" />
              </button>
            </span>
          </div>
          <iframe
            title={tStr("Route map")}
            className="w-full h-56 block"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?saddr=${encodeURIComponent(fromLocation)}&daddr=${encodeURIComponent(t!.city + ", TN")}&output=embed`}
          />
        </section>
      )}

      <section className="relative bg-gradient-to-b from-rose-50 to-white border border-rose-100 rounded-3xl p-5 shadow-sm overflow-hidden">
        <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-slate-900">
          <CalendarDays className="w-5 h-5 text-saffron" /> {tStr("Sample AI Itinerary")}
        </h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          {t ? `${tStr("Preview for")} ${tStr(t.name)}` : tStr("Pick a temple and time to personalise this preview")}
        </p>
        <ol className="relative z-10 bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100 p-4 space-y-4">
          {itinerary.map((s, i) => (
            <li key={s.label} className="relative flex items-start gap-3">
              {i < itinerary.length - 1 && <span className="absolute left-[5px] top-4 h-[calc(100%+0.5rem)] w-0.5 bg-rose-200" aria-hidden />}
              <span className="relative mt-1 w-3 h-3 rounded-full bg-saffron ring-4 ring-rose-100 shrink-0" aria-hidden />
              <span className="w-[4.75rem] shrink-0 text-sm font-bold text-slate-900 tabular-nums">{fmt(s.at)}</span>
              <span className="text-sm text-slate-700">{tStr(s.label)}</span>
            </li>
          ))}
        </ol>
        {art && (
          <div className="relative -mx-5 -mb-5 mt-4 h-28" aria-hidden>
            <img src={art} alt="" className="absolute inset-0 w-full h-full object-cover object-[center_25%] opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-white/40 to-transparent" />
          </div>
        )}
      </section>
    </div>
  );
}
