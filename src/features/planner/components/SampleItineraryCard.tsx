import { memo } from "react";
import { useTranslation } from "react-i18next";
import { CalendarDays, Clock } from "lucide-react";

export interface ItineraryItem {
  time: string;
  activity: string;
  optional?: boolean;
}

interface Props {
  templeName?: string;
  selectedTime?: string;
  items?: ItineraryItem[];
  imageSrc?: string;
}

// Generate sensible timeline steps according to the devotee's chosen time of day
const DEFAULT_AFTERNOON_ITINERARY: ItineraryItem[] = [
  { time: "03:00 PM", activity: "Arrive at Tiruvannamalai" },
  { time: "03:30 PM", activity: "Freshen up & Rest" },
  { time: "04:00 PM", activity: "Special Darshan / Pooja (Optional)", optional: true },
  { time: "05:30 PM", activity: "Girivalam (14 km) — Start" },
  { time: "08:30 PM", activity: "Annadhanam / Dinner" },
  { time: "09:00 PM", activity: "Return / Stay" },
];

const DEFAULT_EARLY_MORNING_ITINERARY: ItineraryItem[] = [
  { time: "05:00 AM", activity: "Arrive & Sacred Snanam / Freshen Up" },
  { time: "05:30 AM", activity: "Ushathkalam Pooja & First Darshan" },
  { time: "07:30 AM", activity: "Traditional Breakfast & Rest" },
  { time: "09:00 AM", activity: "Girivalam (14 km) Sacred Walk" },
  { time: "01:00 PM", activity: "Temple Annadhanam Prasadam" },
  { time: "03:00 PM", activity: "Town Exploration & Departure" },
];

const DEFAULT_MORNING_ITINERARY: ItineraryItem[] = [
  { time: "07:30 AM", activity: "Arrive at Temple Town" },
  { time: "08:30 AM", activity: "Kaalasanthi Special Darshan" },
  { time: "11:00 AM", activity: "Uchikalam Pooja & Deeparadhana" },
  { time: "12:30 PM", activity: "Annadhanam Feast on Banana Leaf" },
  { time: "04:30 PM", activity: "Evening Girivalam Walk" },
  { time: "08:30 PM", activity: "Dinner & Return Journey" },
];

const DEFAULT_EVENING_ITINERARY: ItineraryItem[] = [
  { time: "04:00 PM", activity: "Arrive at Hotel & Check-in" },
  { time: "05:00 PM", activity: "Sayarakshai Evening Darshan" },
  { time: "06:30 PM", activity: "Girivalam (14 km) Under Moonlight" },
  { time: "09:30 PM", activity: "Arthajama Closure & Sacred Prasadam" },
  { time: "10:30 PM", activity: "Overnight Stay in Town" },
];

export const SampleItineraryCard = memo(function SampleItineraryCard({
  templeName = "Tiruvannamalai Arunachaleswarar Temple",
  selectedTime = "afternoon",
  items,
  imageSrc = "/planner_itinerary_temple_hd.jpg",
}: Props) {
  const { t } = useTranslation();

  const schedule =
    items ||
    (selectedTime === "earlyMorning"
      ? DEFAULT_EARLY_MORNING_ITINERARY
      : selectedTime === "morning"
      ? DEFAULT_MORNING_ITINERARY
      : selectedTime === "evening"
      ? DEFAULT_EVENING_ITINERARY
      : DEFAULT_AFTERNOON_ITINERARY);

  return (
    <section className="bg-white border border-[#E8E2D5] rounded-3xl p-5 sm:p-6 shadow-xs overflow-hidden">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF6F0] text-[#C48437]">
            <CalendarDays className="w-4 h-4" />
          </span>
          <h2 className="font-serif text-lg font-bold text-[#0B2F25]">
            {t("Sample AI Itinerary")}
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          {t("Preview for")} {templeName}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-center">
        {/* Left Side: Timeline Steps */}
        <div className="space-y-4">
          {schedule.map((step, idx) => (
            <div
              key={idx}
              className="group flex items-center gap-3.5 rounded-xl p-2.5 transition-colors hover:bg-[#FAF6F0]/80"
            >
              <div className="flex items-center gap-2 shrink-0">
                <Clock className="w-4 h-4 text-[#EA580C]" />
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100/80 px-2 py-1 rounded-md">
                  {step.time}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-semibold text-slate-800">
                  {t(step.activity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Temple HD Photo */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-2xl border border-[#E8E2D5] shadow-xs">
          <img
            src={imageSrc}
            alt={templeName}
            className="h-full w-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLElement).src = "/temples/tiruvannamalai/rajagopuram.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
              {templeName.split(" ")[0]} Darshan
            </span>
          </div>
        </div>
      </div>
    </section>
  );
});

