import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  Loader2,
  Landmark,
  CalendarDays,
  Clock,
  Users,
  Flag,
  LocateFixed,
  ChevronDown,
  ArrowRight,
  Sunrise,
  Sun,
  SunMedium,
  Sunset,
  Sparkles,
  Check,
  Flame,
  PartyPopper,
  Footprints,
  FileText,
  Route as RouteIcon,
  BarChart3,
  Accessibility,
  Plus,
  Minus,
  type LucideIcon,
} from "lucide-react";
import { temples } from "@/data/temples";

export interface TimeOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

export const TIME_OPTIONS: TimeOption[] = [
  { value: "earlyMorning", label: "Early Morning", icon: Sunrise },
  { value: "morning", label: "Morning", icon: Sun },
  { value: "afternoon", label: "Afternoon", icon: SunMedium },
  { value: "evening", label: "Evening", icon: Sunset },
  { value: "ai", label: "AI Decide", icon: Sparkles },
];

export interface PurposeOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

export const PURPOSE_OPTIONS: PurposeOption[] = [
  { value: "darshan", label: "Regular Darshan", icon: Landmark },
  { value: "pooja", label: "Special Pooja", icon: Flame },
  { value: "festival", label: "Festival Attendance", icon: PartyPopper },
  { value: "first", label: "First Visit", icon: Footprints },
];

export interface PlanFormProps {
  fromLocation: string;
  setFromLocation: (val: string) => void;
  temple: string;
  setTemple: (val: string) => void;
  date: string;
  setDate: (val: string) => void;
  time: string;
  setTime: (val: string) => void;
  adults: number;
  setAdults: (val: number | ((prev: number) => number)) => void;
  childrenCount: number;
  setChildrenCount: (val: number | ((prev: number) => number)) => void;
  seniorsCount: number;
  setSeniorsCount: (val: number | ((prev: number) => number)) => void;
  purpose: string;
  setPurpose: (val: string) => void;
  handleGenerate: () => void;
  loading?: boolean;
}

export function PlanForm({
  fromLocation,
  setFromLocation,
  temple,
  setTemple,
  date,
  setDate,
  time,
  setTime,
  adults = 2,
  setAdults,
  childrenCount = 1,
  setChildrenCount,
  seniorsCount = 0,
  setSeniorsCount,
  purpose = "darshan",
  setPurpose,
  handleGenerate,
  loading = false,
}: PlanFormProps) {
  const { t } = useTranslation();
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState("");

  const selectedTemple = temples.find((x) => x.slug === temple) || temples[0];
  const today = new Date().toISOString().split("T")[0];

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocError(t("Location isn't available in this browser."));
      return;
    }
    setLocating(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFromLocation("Chennai"); // Default to known hub or coordinates
        setLocating(false);
      },
      () => {
        setLocError(t("Couldn't get your location — please type a city instead."));
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="bg-white border border-[#E8E2D5] rounded-3xl p-5 sm:p-8 shadow-xs">
      <div className="divide-y divide-[#E8E2D5]/70 space-y-4 sm:space-y-5">
        {/* Step 1: Where are you traveling from? */}
        <StepRow
          stepNumber={1}
          icon={MapPin}
          title={t("Where are you traveling from?")}
        >
          <div className="relative">
            <input
              type="text"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              placeholder={t("e.g. Chennai, Bangalore, Madurai...")}
              className="w-full h-12 pl-4 pr-12 bg-white border border-[#E8E2D5] rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-[#C48437] focus:ring-2 focus:ring-[#C48437]/15 transition-all"
            />
            <button
              type="button"
              onClick={useMyLocation}
              aria-label={t("Use my current location")}
              title={t("Use my current location")}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-lg text-[#C48437] hover:bg-[#FAF6F0] transition-colors"
            >
              {locating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LocateFixed className="w-4 h-4" />
              )}
            </button>
          </div>
          {locError && (
            <p className="text-xs text-rose-600 mt-1.5">{locError}</p>
          )}
        </StepRow>

        {/* Step 2: Which temple? */}
        <StepRow
          stepNumber={2}
          icon={Landmark}
          title={t("Which temple?")}
        >
          <div className="relative">
            {selectedTemple?.image ? (
              <img
                src={selectedTemple.image}
                alt=""
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-10 rounded-lg object-cover pointer-events-none"
              />
            ) : (
              <span className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-10 items-center justify-center rounded-lg bg-[#FAF6F0] text-[#C48437] font-serif text-sm pointer-events-none">
                🛕
              </span>
            )}
            <select
              value={temple}
              onChange={(e) => setTemple(e.target.value)}
              className="w-full h-12 pl-14 pr-10 bg-white border border-[#E8E2D5] rounded-xl text-sm font-bold text-slate-900 outline-none appearance-none cursor-pointer focus:border-[#C48437] focus:ring-2 focus:ring-[#C48437]/15 transition-all"
            >
              {temples.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </StepRow>

        {/* Step 3: When do you plan to visit? */}
        <StepRow
          stepNumber={3}
          icon={CalendarDays}
          title={t("When do you plan to visit?")}
        >
          <div className="relative">
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-12 px-4 pr-11 bg-white border border-[#E8E2D5] rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-[#C48437] focus:ring-2 focus:ring-[#C48437]/15 transition-all"
            />
            <CalendarDays className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C48437] pointer-events-none" />
          </div>
        </StepRow>

        {/* Step 4: What time do you prefer? */}
        <StepRow
          stepNumber={4}
          icon={Clock}
          title={t("What time do you prefer?")}
        >
          <div className="flex flex-wrap gap-2">
            {TIME_OPTIONS.map((opt) => {
              const active = time === opt.value;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTime(opt.value)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    active
                      ? "bg-[#0B2F25] text-white shadow-xs"
                      : "bg-white border border-[#E8E2D5] text-slate-700 hover:border-[#0B2F25]/40 hover:text-[#0B2F25]"
                  }`}
                >
                  {active ? (
                    <Check className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Icon className="w-3.5 h-3.5 text-[#C48437]" />
                  )}
                  <span>{t(opt.label)}</span>
                </button>
              );
            })}
          </div>
        </StepRow>

        {/* Step 5: Who is visiting? (Stepper counters) */}
        <StepRow
          stepNumber={5}
          icon={Users}
          title={t("Who is visiting?")}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Adults Counter */}
            <div className="flex items-center justify-between rounded-xl border border-[#E8E2D5] bg-[#FAF6F0]/40 px-3 py-2">
              <button
                type="button"
                onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                aria-label={t("Decrease Adults")}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E8E2D5] bg-white text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-slate-800">
                {adults} {adults === 1 ? t("Adult") : t("Adults")}
              </span>
              <button
                type="button"
                onClick={() => setAdults((prev) => prev + 1)}
                aria-label={t("Increase Adults")}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E8E2D5] bg-white text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Children Counter */}
            <div className="flex items-center justify-between rounded-xl border border-[#E8E2D5] bg-[#FAF6F0]/40 px-3 py-2">
              <button
                type="button"
                onClick={() => setChildrenCount((prev) => Math.max(0, prev - 1))}
                aria-label={t("Decrease Children")}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E8E2D5] bg-white text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-slate-800">
                {childrenCount} {childrenCount === 1 ? t("Child") : t("Children")}
              </span>
              <button
                type="button"
                onClick={() => setChildrenCount((prev) => prev + 1)}
                aria-label={t("Increase Children")}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E8E2D5] bg-white text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Seniors Counter */}
            <div className="flex items-center justify-between rounded-xl border border-[#E8E2D5] bg-[#FAF6F0]/40 px-3 py-2">
              <button
                type="button"
                onClick={() => setSeniorsCount((prev) => Math.max(0, prev - 1))}
                aria-label={t("Decrease Seniors")}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E8E2D5] bg-white text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-slate-800">
                {seniorsCount} {t("Senior (60+)")}
              </span>
              <button
                type="button"
                onClick={() => setSeniorsCount((prev) => prev + 1)}
                aria-label={t("Increase Seniors")}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E8E2D5] bg-white text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </StepRow>

        {/* Step 6: Visit purpose? */}
        <StepRow
          stepNumber={6}
          icon={Flag}
          title={t("Visit purpose?")}
        >
          <div className="flex flex-wrap gap-2">
            {PURPOSE_OPTIONS.map((opt) => {
              const active = purpose === opt.value;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPurpose(opt.value)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    active
                      ? "bg-[#0B2F25] text-white shadow-xs"
                      : "bg-white border border-[#E8E2D5] text-slate-700 hover:border-[#0B2F25]/40 hover:text-[#0B2F25]"
                  }`}
                >
                  {active ? (
                    <Check className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Icon className="w-3.5 h-3.5 text-[#C48437]" />
                  )}
                  <span>{t(opt.label)}</span>
                </button>
              );
            })}
          </div>
        </StepRow>
      </div>

      {/* CTA Button: Generate AI Itinerary */}
      <div className="mt-7">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !fromLocation.trim()}
          className="w-full h-14 rounded-full bg-[#0B2F25] text-white text-base font-bold flex justify-center items-center gap-2 shadow-lg shadow-[#0B2F25]/20 hover:bg-[#073C2C] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5 text-[#C48437]" />
          )}
          <span>
            {loading ? t("AI is crafting your plan...") : t("Generate AI Itinerary")}
          </span>
          {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
        </button>
      </div>

      {/* Bottom Feature Highlights Strip */}
      <div className="mt-6 pt-5 border-t border-[#E8E2D5]/70 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#C48437]" />
          <span>{t("Personalized Itinerary")}</span>
        </div>
        <span className="hidden sm:inline text-slate-300">|</span>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#C48437]" />
          <span>{t("Best Time & Route")}</span>
        </div>
        <span className="hidden sm:inline text-slate-300">|</span>
        <div className="flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-[#C48437]" />
          <span>{t("Crowd Insights")}</span>
        </div>
        <span className="hidden sm:inline text-slate-300">|</span>
        <div className="flex items-center gap-1.5">
          <Accessibility className="w-3.5 h-3.5 text-[#C48437]" />
          <span>{t("Comfort & Accessibility")}</span>
        </div>
      </div>
    </div>
  );
}

function StepRow({
  stepNumber,
  icon: Icon,
  title,
  children,
}: {
  stepNumber: number;
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="pt-4 first:pt-0">
      <div className="flex items-center gap-2.5 mb-2.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0B2F25] text-white text-xs font-bold">
          {stepNumber}
        </span>
        <Icon className="w-4 h-4 text-[#C48437] shrink-0" />
        <h3 className="text-sm font-bold text-slate-900 leading-snug">
          {title}
        </h3>
      </div>
      <div className="sm:pl-8">{children}</div>
    </div>
  );
}
