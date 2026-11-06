import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, BrainCircuit } from "lucide-react";
import { temples } from "@/data/temples";
import { useTranslation } from "react-i18next";

import { getTransportInfo } from "@/features/planner/utils/transport";
import { PlanForm } from "@/features/planner/components/PlanForm";
import { PlanResult } from "@/features/planner/components/PlanResult";
import { PlanSidebar } from "@/features/planner/components/PlanSidebar";

const HERO: Record<string, string> = { tiruvannamalai: "/temples/tiruvannamalai/plan-trip-hero.jpg" };

export const Route = createFileRoute("/_app/plan")({
  head: () => ({ meta: [{ title: "AI Smart Planner — OMG Smart Temple" }] }),
  component: PlanPage,
});

function PlanPage() {
  const { t: tStr } = useTranslation();
  const [fromLocation, setFromLocation] = useState("");
  const [temple, setTemple] = useState("tiruvannamalai");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("afternoon");
  const [who, setWho] = useState("family");
  const [purpose, setPurpose] = useState("darshan");
  const [result, setResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullMap, setFullMap] = useState(false);
  
  const t = temples.find(x => x.slug === temple);
  const trans = t ? getTransportInfo(fromLocation, t.slug, tStr) : { isInternational: false, roadTime: "0h", flights: [], trains: [], buses: [], route: "" };

  const handleGenerate = () => {
    setLoading(true);
    setResult(false);
    setTimeout(() => {
      setLoading(false);
      setResult(true);
    }, 1500);
  };

  const isIntl = trans.isInternational;
  const travelHours = isIntl ? 20 : (fromLocation ? (fromLocation.length % 5) + 2 : 4);
  const travelMins = isIntl ? 30 : (fromLocation ? (fromLocation.charCodeAt(0) % 60) : 30);
  
  // Sample listings near the temple — names/distances are indicative, verify before booking.
  const hotels = t?.slug === "tiruvannamalai" ? [
    { name: "Hotel Ramakrishna", rating: "4.1", dist: "0.6" },
    { name: "Sparsa Resort", rating: "4.4", dist: "3.5" },
    { name: "TTDC Hotel Tamil Nadu", rating: "3.9", dist: "1.5" }
  ] : t?.slug === "palani-murugan" ? [
    { name: "Hotel Tamil Nadu", rating: "4.2", dist: "1.2" },
    { name: "Ganpat Grand", rating: "4.5", dist: "0.5" },
    { name: "Hotel SR Palani", rating: "4.4", dist: "0.8" },
    { name: "Hotel Subam", rating: "4.3", dist: "0.9" }
  ] : t ? [
    { name: `Hotel ${t.city} Grand`, rating: "4.5", dist: "0.5" },
    { name: "Hotel Tamil Nadu", rating: "4.2", dist: "1.2" },
    { name: `${t.name.split(' ')[0]} Residency`, rating: "4.1", dist: "0.9" },
    { name: "Sree Kumaran Inn", rating: "4.0", dist: "1.5" }
  ] : [];

  const hero = HERO[t?.slug ?? "tiruvannamalai"] ?? t?.image;

  return (
    <div className="relative min-h-screen bg-[#fdf8f6] pb-10">
      {/* Header banner */}
      <header className="relative overflow-hidden print:hidden">
        {hero && (
          <div className="absolute inset-y-0 right-0 w-full md:w-3/5 pointer-events-none" aria-hidden>
            <img src={hero} alt="" className="w-full h-full object-cover object-[center_45%] opacity-60 md:opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#fdf8f6] via-[#fdf8f6]/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#fdf8f6] to-transparent" />
          </div>
        )}
        <div className="relative max-w-[1320px] mx-auto px-4 lg:px-8 pt-8 pb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-100 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-saffron">
            <BrainCircuit className="w-4 h-4" /> {tStr("AI Smart Planner")}
          </span>
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-slate-900 mt-3">{tStr("Plan My Perfect Visit")}</h1>
          <p className="text-sm text-slate-600 mt-2 max-w-md">
            {tStr("Tell us your preferences — AI will craft the ideal time, route, and on-site flow with a premium comfort focus.")}
          </p>
        </div>
      </header>

      <div className="max-w-[1320px] mx-auto px-4 lg:px-8 -mt-2 relative">
        <div className="print:hidden grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
          <PlanForm
            fromLocation={fromLocation} setFromLocation={setFromLocation}
            temple={temple} setTemple={setTemple}
            date={date} setDate={setDate}
            time={time} setTime={setTime}
            who={who} setWho={setWho}
            purpose={purpose} setPurpose={setPurpose}
            handleGenerate={handleGenerate} loading={loading}
          />
          <aside className="lg:sticky lg:top-6">
            <PlanSidebar t={t} time={time} fromLocation={fromLocation} travelHours={travelHours} travelMins={travelMins} setFullMap={setFullMap} />
          </aside>
        </div>

        {result && (
          <PlanResult 
            t={t} date={date} fromLocation={fromLocation}
            travelHours={travelHours} travelMins={travelMins}
            trans={trans} hotels={hotels} setFullMap={setFullMap}
          />
        )}

        {/* Full View Map Modal */}
        {fullMap && t && (
          <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
              <div className="flex items-center gap-2 font-serif text-lg font-semibold">
                <MapPin className="w-5 h-5 text-saffron" />
                {tStr("Route to")} {tStr(t.name)}
              </div>
              <button onClick={() => setFullMap(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <iframe
              className="flex-1 w-full"
              frameBorder="0"
              style={{ border: 0 }}
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?saddr=${encodeURIComponent(fromLocation)}&daddr=${encodeURIComponent(t.city + ', TN')}&output=embed`}
              allowFullScreen
            />
          </div>
        )}
      </div>
    </div>
  );
}
