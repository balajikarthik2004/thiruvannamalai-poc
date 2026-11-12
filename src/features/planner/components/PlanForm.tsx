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
  Info,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { temples } from "@/data/temples";
import { LocationAutocomplete } from "./LocationAutocomplete";

export interface TimeOption {
  value: string;
  label: string;
  subLabel?: string;
  icon: LucideIcon;
}

// Recommended time windows: 5:00 AM to 9:00 PM, STRICTLY excluding 11:00 AM to 3:30 PM (Midday sanctum closure)
export const TIME_OPTIONS: TimeOption[] = [
  {
    value: "earlyMorning",
    label: "Early Morning",
    subLabel: "5:30–8 AM",
    icon: Sunrise,
  },
  {
    value: "morning",
    label: "Morning",
    subLabel: "8–10:30 AM",
    icon: Sun,
  },
  {
    value: "afternoon",
    label: "Afternoon",
    subLabel: "3:45–5:30 PM",
    icon: SunMedium,
  },
  {
    value: "evening",
    label: "Evening",
    subLabel: "6–8:30 PM",
    icon: Sunset,
  },
  {
    value: "ai",
    label: "AI Decide",
    subLabel: "Optimal",
    icon: Sparkles,
  },
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
  onReset?: () => void;
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
  onReset,
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
      () => {
        setFromLocation("Chennai"); // Default to verified hub
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
    <div className="bg-white border border-[#E8E2D5] rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-xs">
      {/* Tight, compact vertical layout engineered to fit in a single screen view */}
      <div className="space-y-3 sm:space-y-3.5">
        {/* Step 1: Where are you traveling from? */}
        <StepRow
          stepNumber={1}
          icon={MapPin}
          title={t("Where are you traveling from?")}
        >
          <LocationAutocomplete
            value={fromLocation}
            onChange={setFromLocation}
            onUseMyLocation={useMyLocation}
            locating={locating}
            locError={locError}
            placeholder="e.g. Chennai, Bangalore, Madurai..."
          />
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
                className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-8 rounded object-cover pointer-events-none"
              />
            ) : (
              <span className="absolute left-2 top-1/2 -translate-y-1/2 flex h-6 w-8 items-center justify-center rounded bg-[#FAF6F0] text-[#C48437] font-serif text-xs pointer-events-none">
                🛕
              </span>
            )}
            <select
              value={temple}
              onChange={(e) => setTemple(e.target.value)}
              className="w-full h-9 sm:h-10 pl-12 pr-9 bg-white border border-[#E8E2D5] rounded-xl text-xs sm:text-sm font-bold text-slate-900 outline-none appearance-none cursor-pointer focus:border-[#C48437] focus:ring-2 focus:ring-[#C48437]/15 transition-all shadow-2xs"
            >
              {temples.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
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
              onClick={(e) => {
                try {
                  (e.target as any).showPicker?.();
                } catch {
                  // Fallback
                }
              }}
              className="w-full h-9 sm:h-10 px-3.5 pr-10 bg-white border border-[#E8E2D5] rounded-xl text-xs sm:text-sm font-medium text-slate-800 outline-none focus:border-[#C48437] focus:ring-2 focus:ring-[#C48437]/15 transition-all shadow-2xs cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full"
            />
            <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C48437] pointer-events-none" />
          </div>
        </StepRow>

        {/* Step 4: What time do you prefer? (5 AM - 9 PM, avoiding 11 AM - 3:30 PM) */}
        <StepRow
          stepNumber={4}
          icon={Clock}
          title={t("What time do you prefer?")}
        >
          <div className="space-y-1.5">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {TIME_OPTIONS.map((opt) => {
                const active = time === opt.value;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTime(opt.value)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 sm:py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? "bg-[#0B2F25] text-white shadow-2xs"
                        : "bg-white border border-[#E8E2D5] text-slate-700 hover:border-[#0B2F25]/40 hover:text-[#0B2F25]"
                    }`}
                  >
                    {active ? (
                      <Check className="w-3 h-3 text-white" />
                    ) : (
                      <Icon className="w-3 h-3 text-[#C48437]" />
                    )}
                    <span>{t(opt.label)}</span>
                    {opt.subLabel && (
                      <span
                        className={`text-[10px] font-normal ${
                          active ? "text-emerald-200" : "text-slate-400"
                        }`}
                      >
                        ({opt.subLabel})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sacred Hours Guidance Banner */}
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-600 bg-[#FAF6F0] border border-[#E8E2D5] rounded-lg px-2.5 py-1">
              <Info className="w-3 h-3 text-[#C48437] shrink-0" />
              <span>
                <strong>{t("Sanctum Closed")}:</strong> 12:30–3:30 PM. AI schedules optimal open hours (5:30–10:30 AM & 3:45–8:30 PM).
              </span>
            </div>
          </div>
        </StepRow>

        {/* Step 5: Who is visiting? (Stepper counters) */}
        <StepRow
          stepNumber={5}
          icon={Users}
          title={t("Who is visiting?")}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            {/* Adults Counter */}
            <div className="flex items-center justify-between rounded-xl border border-[#E8E2D5] bg-[#FAF6F0]/40 px-2.5 py-1 sm:py-1.5">
              <button
                type="button"
                onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                aria-label={t("Decrease Adults")}
                className="flex h-6 w-6 items-center justify-center rounded-md border border-[#E8E2D5] bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold text-slate-800">
                {adults} {adults === 1 ? t("Adult") : t("Adults")}
              </span>
              <button
                type="button"
                onClick={() => setAdults((prev) => prev + 1)}
                aria-label={t("Increase Adults")}
                className="flex h-6 w-6 items-center justify-center rounded-md border border-[#E8E2D5] bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Children Counter */}
            <div className="flex items-center justify-between rounded-xl border border-[#E8E2D5] bg-[#FAF6F0]/40 px-2.5 py-1 sm:py-1.5">
              <button
                type="button"
                onClick={() => setChildrenCount((prev) => Math.max(0, prev - 1))}
                aria-label={t("Decrease Children")}
                className="flex h-6 w-6 items-center justify-center rounded-md border border-[#E8E2D5] bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold text-slate-800">
                {childrenCount} {childrenCount === 1 ? t("Child") : t("Children")}
              </span>
              <button
                type="button"
                onClick={() => setChildrenCount((prev) => prev + 1)}
                aria-label={t("Increase Children")}
                className="flex h-6 w-6 items-center justify-center rounded-md border border-[#E8E2D5] bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Seniors Counter */}
            <div className="flex items-center justify-between rounded-xl border border-[#E8E2D5] bg-[#FAF6F0]/40 px-2.5 py-1 sm:py-1.5">
              <button
                type="button"
                onClick={() => setSeniorsCount((prev) => Math.max(0, prev - 1))}
                aria-label={t("Decrease Seniors")}
                className="flex h-6 w-6 items-center justify-center rounded-md border border-[#E8E2D5] bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold text-slate-800">
                {seniorsCount} {t("Senior (60+)")}
              </span>
              <button
                type="button"
                onClick={() => setSeniorsCount((prev) => prev + 1)}
                aria-label={t("Increase Seniors")}
                className="flex h-6 w-6 items-center justify-center rounded-md border border-[#E8E2D5] bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
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
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {PURPOSE_OPTIONS.map((opt) => {
              const active = purpose === opt.value;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPurpose(opt.value)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 sm:py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-[#0B2F25] text-white shadow-2xs"
                      : "bg-white border border-[#E8E2D5] text-slate-700 hover:border-[#0B2F25]/40 hover:text-[#0B2F25]"
                  }`}
                >
                  {active ? (
                    <Check className="w-3 h-3 text-white" />
                  ) : (
                    <Icon className="w-3 h-3 text-[#C48437]" />
                  )}
                  <span>{t(opt.label)}</span>
                </button>
              );
            })}
          </div>
        </StepRow>
      </div>

      {/* CTA Button: Generate AI Itinerary + Reset */}
      <div className="mt-4 sm:mt-5 space-y-2">
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !fromLocation.trim()}
            className="flex-1 w-full h-11 sm:h-12 rounded-full bg-[#0B2F25] text-white text-sm font-bold flex justify-center items-center gap-2 shadow-md shadow-[#0B2F25]/15 hover:bg-[#073C2C] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-[#C48437]" />
            )}
            <span>
              {loading ? t("AI is crafting your plan...") : t("Generate AI Itinerary")}
            </span>
            {!loading && <ArrowRight className="w-3.5 h-3.5 ml-1" />}
          </button>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              title={t("Reset Form")}
              className="h-11 sm:h-12 px-5 rounded-full border border-[#E8E2D5] bg-white text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>{t("Reset")}</span>
            </button>
          )}
        </div>

        {!fromLocation.trim() && (
          <p className="text-center text-[11px] text-slate-400">
            {t("Enter your starting city above to generate a customized travel itinerary.")}
          </p>
        )}
      </div>

      {/* Bottom Feature Highlights Strip */}
      <div className="mt-3.5 pt-2.5 border-t border-[#E8E2D5]/70 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11px] text-slate-500">
        <div className="flex items-center gap-1">
          <FileText className="w-3 h-3 text-[#C48437]" />
          <span>{t("Personalized Itinerary")}</span>
        </div>
        <span className="hidden sm:inline text-slate-300">|</span>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-[#C48437]" />
          <span>{t("Best Time & Route")}</span>
        </div>
        <span className="hidden sm:inline text-slate-300">|</span>
        <div className="flex items-center gap-1">
          <BarChart3 className="w-3 h-3 text-[#C48437]" />
          <span>{t("Crowd Insights")}</span>
        </div>
        <span className="hidden sm:inline text-slate-300">|</span>
        <div className="flex items-center gap-1">
          <Accessibility className="w-3 h-3 text-[#C48437]" />
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
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0B2F25] text-white text-[10px] font-bold">
          {stepNumber}
        </span>
        <Icon className="w-3.5 h-3.5 text-[#C48437] shrink-0" />
        <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
          {title}
        </h3>
      </div>
      <div className="sm:pl-7">{children}</div>
    </div>
  );
}
