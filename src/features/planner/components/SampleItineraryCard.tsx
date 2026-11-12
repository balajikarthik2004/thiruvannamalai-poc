import { memo } from "react";
import { useTranslation } from "react-i18next";
import { CalendarDays, Clock, Info } from "lucide-react";

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

// Strictly scheduled between 5:00 AM - 9:00 PM, avoiding 11:00 AM - 3:30 PM temple sanctum closure
const DEFAULT_AFTERNOON_ITINERARY: ItineraryItem[] = [
  { time: "02:30 PM", activity: "Arrive at Tiruvannamalai & Hotel Check-in" },
  { time: "03:30 PM", activity: "Freshen up as Temple Reopens (Sanctum opens 3:30 PM)" },
  { time: "04:00 PM", activity: "Special Darshan & Sayarakshai Deeparadhana", optional: true },
  { time: "05:30 PM", activity: "Girivalam (14 km) — Start under Sunset & Evening Breeze" },
  { time: "08:30 PM", activity: "Annadhanam / Dinner" },
  { time: "09:00 PM", activity: "Return Journey or Overnight Stay" },
];

const DEFAULT_EARLY_MORNING_ITINERARY: ItineraryItem[] = [
  { time: "05:00 AM", activity: "Arrive & Sacred Snanam / Freshen Up" },
  { time: "05:30 AM", activity: "Ushathkalam Pooja & First Darshan (Cool stone floors)" },
  { time: "07:30 AM", activity: "Kaalasanthi Darshan & Inner Prakaaram Circumambulation" },
  { time: "09:00 AM", activity: "Traditional Breakfast & Sri Ramana Ashram Visit" },
  { time: "11:30 AM", activity: "Temple Annadhanam Prasadam on Fresh Banana Leaf" },
  { time: "01:00 PM", activity: "Rest & Relaxation during Temple Closure (12:30 PM – 3:30 PM)" },
  { time: "04:00 PM", activity: "Sayarakshai Pooja or Girivalam (14 km) Walk" },
];

const DEFAULT_MORNING_ITINERARY: ItineraryItem[] = [
  { time: "07:00 AM", activity: "Arrive at Temple Town & Freshen Up" },
  { time: "08:00 AM", activity: "Kaalasanthi Special Darshan (Low queue, pleasant weather)" },
  { time: "10:00 AM", activity: "Navagraha & Ambal Sannidhi Pradakshinam (Before 11 AM)" },
  { time: "11:30 AM", activity: "Temple Annadhanam Feast on Banana Leaf" },
  { time: "01:00 PM", activity: "Hotel Check-in & Midday Rest during Sanctum Closure" },
  { time: "04:00 PM", activity: "Temple Reopens: Sayarakshai Pooja & Sacred Chants" },
  { time: "05:30 PM", activity: "Evening Girivalam Walk (14 km) under Cool Breeze" },
];

const DEFAULT_EVENING_ITINERARY: ItineraryItem[] = [
  { time: "04:00 PM", activity: "Arrive at Hotel & Check-in" },
  { time: "05:00 PM", activity: "Sayarakshai Evening Darshan & Golden Hour Aradhana" },
  { time: "06:30 PM", activity: "Girivalam (14 km) under Moonlight and Illuminated Path" },
  { time: "09:00 PM", activity: "Arthajama Closure & Sacred Vibhuti Prasadam" },
  { time: "10:00 PM", activity: "Traditional Dinner & Overnight Stay in Town" },
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
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E2D5]/70">
        <div>
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

        <div className="flex items-center gap-1.5 text-xs text-[#0B2F25] bg-[#FAF6F0] border border-[#E8E2D5] px-3 py-1 rounded-full self-start sm:self-auto font-medium">
          <Info className="w-3.5 h-3.5 text-[#C48437]" />
          <span>{t("Avoids 11 AM – 3:30 PM Closure")}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-center">
        {/* Left Side: Timeline Steps */}
        <div className="space-y-3.5">
          {schedule.map((step, idx) => (
            <div
              key={idx}
              className="group flex items-center gap-3.5 rounded-xl p-2.5 transition-colors hover:bg-[#FAF6F0]/80"
            >
              <div className="flex items-center gap-2 shrink-0">
                <Clock className="w-4 h-4 text-[#EA580C]" />
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100/90 px-2 py-1 rounded-md border border-slate-200/60">
                  {step.time}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-semibold text-slate-800 leading-snug">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
              {templeName.split(" ")[0]} Sacred Darshan
            </span>
          </div>
        </div>
      </div>
    </section>
  );
});
