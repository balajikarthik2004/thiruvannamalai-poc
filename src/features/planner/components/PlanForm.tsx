import { useTranslation } from "react-i18next";
import { useState, type ReactNode } from "react";
import {
  MapPin, Loader2, Landmark, CalendarDays, Clock, Users, Flag, LocateFixed, ChevronDown, ArrowRight, Sunrise, Sun, SunMedium, Moon, User, Heart, UsersRound, PersonStanding, Accessibility, Flame, PartyPopper, Star, Route as RouteIcon, BarChart3, ShieldCheck, type LucideIcon, BrainCircuit,
} from "lucide-react";
import { temples } from "@/data/temples";

type Option = [value: string, label: string, icon: LucideIcon];

export const TIME_OPTIONS: Option[] = [
  ["morning", "Early Morning", Sunrise],
  ["lateMorning", "Morning", Sun],
  ["afternoon", "Afternoon", SunMedium],
  ["evening", "Evening", Moon],
  ["any", "AI Decides", BrainCircuit],
];
const WHO_OPTIONS: Option[] = [
  ["solo", "Just Me", User],
  ["couple", "Couple", Heart],
  ["family", "Family", Users],
  ["friends", "Friends", UsersRound],
  ["senior", "With Seniors", PersonStanding],
  ["dis", "Differently-abled", Accessibility],
];
const PURPOSE_OPTIONS: Option[] = [
  ["darshan", "Regular Darshan", Landmark],
  ["pooja", "Special Pooja", Flame],
  ["festival", "Festival Attendance", PartyPopper],
  ["first", "First Visit", Star],
];

const FEATURES: [string, LucideIcon][] = [
  ["Personalized Itinerary", BrainCircuit],
  ["Best Time & Route", RouteIcon],
  ["Crowd Insights", BarChart3],
  ["Comfort & Accessibility", ShieldCheck],
];

export function PlanForm({
  fromLocation, setFromLocation,
  temple, setTemple,
  date, setDate,
  time, setTime,
  who, setWho,
  purpose, setPurpose,
  handleGenerate, loading,
}: any) {
  const { t: tStr } = useTranslation();
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState("");
  const selected = temples.find((x) => x.slug === temple);
  const today = new Date().toISOString().split("T")[0];
  const missing = [!fromLocation.trim() && tStr("starting point"), !temple && tStr("temple"), !date && tStr("date")].filter(Boolean);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocError(tStr("Location isn't available in this browser."));
      return;
    }
    setLocating(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFromLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        setLocating(false);
      },
      () => {
        setLocError(tStr("Couldn't get your location — please type a city instead."));
        setLocating(false);
      },
      { timeout: 10000 },
    );
  };

  return (
    <div className="bg-white border border-rose-100 rounded-3xl p-4 sm:p-6 shadow-sm">
      <ol className="divide-y divide-rose-100">
        <Step n={1} icon={MapPin} title={tStr("Where are you traveling from?")}>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              aria-label={tStr("Where are you traveling from?")}
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              placeholder={tStr("e.g. Chennai, Bangalore, Madurai...")}
              className="w-full h-12 pl-10 pr-12 bg-white border border-rose-100 rounded-xl text-sm outline-none focus:border-saffron focus:ring-4 focus:ring-saffron/10 transition-all"
            />
            <button
              type="button"
              onClick={useMyLocation}
              aria-label={tStr("Use my current location")}
              title={tStr("Use my current location")}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center text-saffron hover:bg-rose-50"
            >
              {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
            </button>
          </div>
          {locError && <p role="alert" className="text-xs text-rose-600 mt-1.5">{locError}</p>}
        </Step>

        <Step n={2} icon={Landmark} title={tStr("Which temple?")}>
          <div className="relative">
            {selected?.image ? (
              <img src={selected.image} alt="" className="absolute left-1.5 top-1/2 -translate-y-1/2 w-10 h-9 rounded-lg object-cover pointer-events-none" />
            ) : (
              <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-10 h-9 rounded-lg bg-rose-50 text-saffron flex items-center justify-center font-serif pointer-events-none" aria-hidden>ॐ</span>
            )}
            <select
              aria-label={tStr("Which temple?")}
              value={temple}
              onChange={(e) => setTemple(e.target.value)}
              className={`w-full h-12 pl-14 pr-10 bg-white border rounded-xl text-sm outline-none appearance-none cursor-pointer focus:border-saffron focus:ring-4 focus:ring-saffron/10 transition-all ${temple ? "text-slate-900 font-semibold border-rose-100" : "text-slate-400 border-rose-100"}`}
            >
              <option value="" disabled>{tStr("Select temple name")}</option>
              {temples.map((x) => <option key={x.id} value={x.slug}>{tStr(x.name)}</option>)}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </Step>

        <Step n={3} icon={CalendarDays} title={tStr("When do you plan to visit?")}>
          <input
            type="date"
            aria-label={tStr("When do you plan to visit?")}
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            className="w-full h-12 px-4 bg-white border border-rose-100 rounded-xl text-sm text-slate-800 outline-none focus:border-saffron focus:ring-4 focus:ring-saffron/10 transition-all"
          />
        </Step>

        <Step n={4} icon={Clock} title={tStr("What time do you prefer?")}>
          <PillRow label={tStr("What time do you prefer?")} value={time} setValue={setTime} options={TIME_OPTIONS} />
        </Step>

        <Step n={5} icon={Users} title={tStr("Who is visiting?")}>
          <PillRow label={tStr("Who is visiting?")} value={who} setValue={setWho} options={WHO_OPTIONS} />
        </Step>

        <Step n={6} icon={Flag} title={tStr("Visit purpose?")}>
          <PillRow label={tStr("Visit purpose?")} value={purpose} setValue={setPurpose} options={PURPOSE_OPTIONS} />
        </Step>
      </ol>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading || missing.length > 0}
        className="mt-4 w-full h-14 rounded-full bg-saffron text-white text-base font-bold flex justify-center items-center gap-2 shadow-lg shadow-saffron/25 hover:brightness-95 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
        {loading ? tStr("AI is planning...") : tStr("Generate AI Itinerary")}
        {!loading && <ArrowRight className="w-4 h-4" />}
      </button>
      {missing.length > 0 && !loading && (
        <p className="text-center text-xs text-slate-500 mt-2">{tStr("Add your")} {missing.join(", ")} {tStr("to continue.")}</p>
      )}

      <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
        {FEATURES.map(([label, Icon]) => (
          <li key={label} className="flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5 text-saffron" /> {tStr(label)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Step({ n, icon: Icon, title, children }: { n: number; icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <li className="py-4 first:pt-1">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-7 h-7 rounded-full bg-saffron text-white text-xs font-bold flex items-center justify-center shrink-0">{n}</span>
        <Icon className="w-5 h-5 text-saffron shrink-0" />
        <h2 className="text-[15px] font-bold text-slate-900">{title}</h2>
      </div>
      <div className="sm:pl-10">{children}</div>
    </li>
  );
}

function PillRow({ label, value, setValue, options }: { label: string; value: string; setValue: (v: string) => void; options: Option[] }) {
  const { t: tStr } = useTranslation();
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map(([v, l, Icon]) => {
        const active = value === v;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setValue(v)}
            className={`inline-flex items-center gap-1.5 text-[13px] rounded-full px-3 py-1.5 border font-semibold whitespace-nowrap transition-all ${
              active ? "bg-saffron text-white border-saffron shadow-md shadow-saffron/20" : "bg-white border-rose-100 text-slate-600 hover:border-saffron/50 hover:text-saffron"
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${active ? "text-white" : "text-saffron"}`} />
            {tStr(l)}
          </button>
        );
      })}
    </div>
  );
}
