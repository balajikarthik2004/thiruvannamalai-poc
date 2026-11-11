import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useMemo } from "react";
import { Sparkles, MapPin, X } from "lucide-react";
import { temples } from "@/data/temples";
import { useTranslation } from "react-i18next";

import { PlanForm } from "@/features/planner/components/PlanForm";
import { PlannerFeatureCards } from "@/features/planner/components/PlannerFeatureCards";
import { LiveRoutePreview } from "@/features/planner/components/LiveRoutePreview";
import { SampleItineraryCard } from "@/features/planner/components/SampleItineraryCard";
import { TempleVisitPlanCard } from "@/features/planner/components/TempleVisitPlanCard";
import { RecommendedTransportCard } from "@/features/planner/components/RecommendedTransportCard";
import { RecommendedStaysCard } from "@/features/planner/components/RecommendedStaysCard";

export const Route = createFileRoute("/_app/plan")({
  head: () => ({ meta: [{ title: "AI Smart Planner — OMG Devotee" }] }),
  component: PlanPage,
});

function PlanPage() {
  const { t } = useTranslation();

  // State matching the screenshot specifications
  const [fromLocation, setFromLocation] = useState("Chennai");
  const [templeSlug, setTempleSlug] = useState("tiruvannamalai");
  const [date, setDate] = useState("2026-11-09");
  const [time, setTime] = useState("afternoon");
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(1);
  const [seniorsCount, setSeniorsCount] = useState(0);
  const [purpose, setPurpose] = useState("darshan");
  const [loading, setLoading] = useState(false);
  const [fullMap, setFullMap] = useState(false);

  const planRef = useRef<HTMLDivElement>(null);

  const selectedTemple =
    temples.find((x) => x.slug === templeSlug) || temples[0];

  // Dynamic calculations for route distance & duration
  const { distanceKm, travelHours, travelMins, bestDarshanTime, crowdLevel } =
    useMemo(() => {
      const o = fromLocation.toLowerCase().trim();
      let dist = 195;
      let hrs = 4;
      let mins = 10;

      if (o.includes("bangalore") || o.includes("bengaluru")) {
        dist = 205;
        hrs = 4;
        mins = 35;
      } else if (o.includes("madurai")) {
        dist = 285;
        hrs = 5;
        mins = 40;
      } else if (o.includes("coimbatore")) {
        dist = 295;
        hrs = 5;
        mins = 50;
      } else if (o.includes("salem")) {
        dist = 135;
        hrs = 3;
        mins = 0;
      } else if (o.includes("trichy") || o.includes("tiruchirappalli")) {
        dist = 180;
        hrs = 3;
        mins = 45;
      }

      // Darshan time recommendation based on selected time preference
      let darshanSlot = "3:30 PM – 5:00 PM";
      if (time === "earlyMorning") darshanSlot = "5:30 AM – 7:00 AM";
      else if (time === "morning") darshanSlot = "8:30 AM – 10:30 AM";
      else if (time === "evening") darshanSlot = "5:30 PM – 7:30 PM";
      else if (time === "ai") darshanSlot = "6:00 AM – 7:30 AM";

      const crowd =
        time === "earlyMorning"
          ? "Low"
          : time === "afternoon"
          ? "Medium"
          : "Moderate";

      return {
        distanceKm: dist,
        travelHours: hrs,
        travelMins: mins,
        bestDarshanTime: darshanSlot,
        crowdLevel: crowd,
      };
    }, [fromLocation, time]);

  const formattedDate = useMemo(() => {
    if (!date) return "Nov 09, 2026";
    try {
      const parts = date.split("-");
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });
      }
      return date;
    } catch {
      return date;
    }
  }, [date]);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (planRef.current) {
        planRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 1000);
  };

  const heroImage =
    selectedTemple?.slug === "tiruvannamalai"
      ? "/temples/tiruvannamalai/plan-trip-hero.jpg"
      : selectedTemple?.image || "/temples/tiruvannamalai/plan-trip-hero.jpg";

  return (
    <div className="min-h-screen bg-[#FAF6F0] pb-16">
      {/* 1. Header Banner */}
      <header className="relative w-full overflow-hidden border-b border-[#E8E2D5] bg-[#FAF6F0] print:hidden">
        {/* Right background panoramic artwork */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-full sm:w-3/5 lg:w-1/2 overflow-hidden"
          aria-hidden
        >
          <img
            src={heroImage}
            alt=""
            className="h-full w-full object-cover object-right brightness-95"
            onError={(e) => {
              (e.target as HTMLElement).src = "/temples/tiruvannamalai/plan-trip-hero.jpg";
            }}
          />
          {/* Subtle gradient blending into ivory background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0] via-[#FAF6F0]/60 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
          {/* Badge: AI SMART PLANNER */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E8E2D5] bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#C48437] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C48437]" />
            <span>{t("AI SMART PLANNER")}</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0B2F25] mt-3">
            {t("Plan My Perfect Visit")}
          </h1>

          {/* Subtitle */}
          <p className="mt-2 max-w-xl text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t(
              "Tell us your preferences — AI will craft the ideal trip, route, and the flow with a premium comfort experience."
            )}
          </p>
        </div>
      </header>

      {/* 2. Main Content Flow */}
      <main className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 -mt-2 space-y-6 sm:space-y-8">
        {/* Step Form Card */}
        <div className="print:hidden">
          <PlanForm
            fromLocation={fromLocation}
            setFromLocation={setFromLocation}
            temple={templeSlug}
            setTemple={setTempleSlug}
            date={date}
            setDate={setDate}
            time={time}
            setTime={setTime}
            adults={adults}
            setAdults={setAdults}
            childrenCount={childrenCount}
            setChildrenCount={setChildrenCount}
            seniorsCount={seniorsCount}
            setSeniorsCount={setSeniorsCount}
            purpose={purpose}
            setPurpose={setPurpose}
            handleGenerate={handleGenerate}
            loading={loading}
          />
        </div>

        {/* Feature Highlights Grid */}
        <div className="print:hidden">
          <PlannerFeatureCards />
        </div>

        {/* Live Route Preview */}
        <div className="print:hidden">
          <LiveRoutePreview
            originName={fromLocation}
            destinationName={selectedTemple.city || "Tiruvannamalai"}
            distanceKm={distanceKm}
            durationHours={travelHours}
            durationMins={travelMins}
            onOpenFullMap={() => setFullMap(true)}
          />
        </div>

        {/* Sample AI Itinerary */}
        <div>
          <SampleItineraryCard
            templeName={selectedTemple.name}
            selectedTime={time}
            imageSrc="/planner_itinerary_temple_hd.jpg"
          />
        </div>

        {/* Your Temple Visit Plan Output Card */}
        <div ref={planRef}>
          <TempleVisitPlanCard
            templeName={selectedTemple.name}
            travelDate={formattedDate}
            bestDarshanTime={bestDarshanTime}
            distanceKm={distanceKm}
            travelHours={travelHours}
            travelMins={travelMins}
            originName={fromLocation}
            stayPrice="From ₹1,200 / night"
            waitTime="45 – 60 min"
            crowdLevel={crowdLevel}
            onOpenMap={() => setFullMap(true)}
          />
        </div>

        {/* Recommended Transport Modes */}
        <div>
          <RecommendedTransportCard
            originName={fromLocation}
            destinationCity={selectedTemple.city || "Tiruvannamalai"}
            travelHours={travelHours}
            travelMins={travelMins}
          />
        </div>

        {/* Recommended Stays Nearby */}
        <div>
          <RecommendedStaysCard
            travelDate={formattedDate}
            adults={adults}
            childrenCount={childrenCount}
            seniorsCount={seniorsCount}
          />
        </div>
      </main>

      {/* Full View Map Modal */}
      {fullMap && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex flex-col bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-[#E8E2D5] bg-white px-6 py-4 shadow-sm">
            <div className="flex items-center gap-2 font-serif text-lg font-bold text-[#0B2F25]">
              <MapPin className="w-5 h-5 text-[#C48437]" />
              <span>
                {t("Route to")} {selectedTemple.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setFullMap(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <iframe
            className="flex-1 w-full"
            style={{ border: 0 }}
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?saddr=${encodeURIComponent(
              fromLocation
            )}&daddr=${encodeURIComponent(
              selectedTemple.city + ", Tamil Nadu"
            )}&output=embed`}
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
