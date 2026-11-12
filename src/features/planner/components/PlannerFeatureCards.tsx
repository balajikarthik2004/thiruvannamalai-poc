import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Route as RouteIcon,
  Clock,
  Flower2,
  Armchair,
  Sparkles,
  CheckCircle2,
  Users,
  Compass,
} from "lucide-react";

export interface PlannerFeatureProps {
  originName?: string;
  templeName?: string;
  time?: string;
  purpose?: string;
  adults?: number;
  childrenCount?: number;
  seniorsCount?: number;
  distanceKm?: number;
  travelHours?: number;
  travelMins?: number;
}

export const PlannerFeatureCards = memo(function PlannerFeatureCards({
  originName = "Chennai",
  templeName = "Tiruvannamalai Arunachaleswarar Temple",
  time = "afternoon",
  purpose = "darshan",
  adults = 2,
  childrenCount = 0,
  seniorsCount = 0,
  distanceKm = 195,
  travelHours = 4,
  travelMins = 10,
}: PlannerFeatureProps) {
  const { t } = useTranslation();

  const oKey = (originName || "").toLowerCase().trim();

  // 1. Dynamic Route Card
  const routeInfo = useMemo(() => {
    if (oKey.includes("bangalore") || oKey.includes("bengaluru")) {
      return {
        title: t("Optimized Route from Bengaluru"),
        tag: `NH 44 & NH 77 (~205 km)`,
        desc: t(
          "Via Krishnagiri & Chengam (~4h 35m). Smooth 4-lane national highway with verified food courts near Krishnagiri toll plaza."
        ),
      };
    } else if (oKey.includes("madurai")) {
      return {
        title: t("Optimized Route from Madurai"),
        tag: `NH 38 via Trichy (~285 km)`,
        desc: t(
          "Via Melur, Trichy & Ulundurpet (~5h 40m). Well-paved highway with frequent fuel and clean family refreshment halts."
        ),
      };
    } else if (oKey.includes("coimbatore")) {
      return {
        title: t("Optimized Route from Coimbatore"),
        tag: `NH 544 via Salem (~295 km)`,
        desc: t(
          "Via Erode, Salem & Harur (~5h 50m). Scenic route bypassing urban congestion with clear signage to Tiruvannamalai."
        ),
      };
    } else if (oKey.includes("salem")) {
      return {
        title: t("Optimized Route from Salem"),
        tag: `SH 18 via Harur (~135 km)`,
        desc: t(
          "Direct state highway corridor (~3h 00m) with minimal toll delays and designated temple parking at Lot A."
        ),
      };
    }
    // Default Chennai or generic
    return {
      title: t("Optimized Highway Route from ") + (originName || "Chennai"),
      tag: `NH 32 & NH 77 (~${distanceKm} km)`,
      desc: t(
        "Direct 4-lane corridor via Tindivanam & Gingee (~" +
          travelHours +
          "h " +
          travelMins +
          "m) with verified clean refreshment stops at Tindivanam bypass."
      ),
    };
  }, [oKey, originName, distanceKm, travelHours, travelMins, t]);

  // 2. Dynamic Timing Window Card (Strictly 5 AM - 11 AM & 3:30 PM - 9 PM)
  const timingInfo = useMemo(() => {
    if (time === "earlyMorning") {
      return {
        title: t("Early Morning Darshan Window"),
        tag: "5:30 AM – 7:30 AM",
        desc: t(
          "Synchronized with Ushathkalam opening rituals. Pristine cool granite walkways and lowest wait times (~10-15 mins)."
        ),
      };
    } else if (time === "morning") {
      return {
        title: t("Morning Kaalasanthi Window"),
        tag: "8:00 AM – 10:30 AM",
        desc: t(
          "Finishes safely before 11:00 AM midday rush. Pleasant temperatures and live Nadaswaram recital in the outer prakaaram."
        ),
      };
    } else if (time === "evening") {
      return {
        title: t("Evening Sayarakshai Window"),
        tag: "6:00 PM – 8:00 PM",
        desc: t(
          "Deeparadhana with hundreds of glowing brass oil lamps. Majestic illuminated views of the Rajagopuram and holy hill."
        ),
      };
    } else if (time === "ai") {
      return {
        title: t("AI-Optimized Fast Entry Slot"),
        tag: "3:45 PM – 5:00 PM",
        desc: t(
          "Calculated as the lowest queue density slot of the day, entering right as sanctum reopens after afternoon rest."
        ),
      };
    }
    // Afternoon default
    return {
      title: t("Late Afternoon Reopening Slot"),
      tag: "3:45 PM – 5:15 PM",
      desc: t(
        "Enters as the sanctum reopens after afternoon rest (closed 12:30–3:30 PM). Comfortable evening breeze and smooth queue movement."
      ),
    };
  }, [time, t]);

  // 3. Dynamic Pooja & Purpose Card
  const purposeInfo = useMemo(() => {
    if (purpose === "pooja") {
      return {
        title: t("Special Pooja & Abhishekam"),
        tag: "Sankalpam & Archana",
        desc: t(
          "Recommended to pre-book Kaalasanthi or Sayarakshai Abhishekam. Sacred Bilva leaves, honey, and vibhuti prasadam included."
        ),
      };
    } else if (purpose === "festival") {
      return {
        title: t("Festival Crowds & Special Entry"),
        tag: "Processions & Deepam",
        desc: t(
          "Expect vibrant Utsava processions in the outer corridor. Pre-booked special entry pass recommended to bypass general rush."
        ),
      };
    } else if (purpose === "first") {
      return {
        title: t("First-Time Pilgrim Walkthrough"),
        tag: "East Gate to Sanctum",
        desc: t(
          "Enter through the East Rajagopuram, circumambulate the Thousand Pillared Hall, and receive sacred prasadam at Ambal Sannidhi."
        ),
      };
    }
    // Darshan default
    return {
      title: t("Regular Darshan Queue Flow"),
      tag: "Direct Sanctum Entry",
      desc: t(
        "Special Entry (₹200) saves 45+ minutes over free general queue, featuring shaded walkways and free drinking water facilities."
      ),
    };
  }, [purpose, t]);

  // 4. Dynamic Group & Comfort Card
  const comfortInfo = useMemo(() => {
    if (seniorsCount > 0) {
      return {
        title: t("Senior Citizen Priority Care"),
        tag: `${seniorsCount} Senior${seniorsCount > 1 ? "s" : ""} (60+)`,
        desc: t(
          "Free battery car transfer from parking to Rajagopuram. Dedicated senior citizen queue with cushioned bench seating and ramp entry."
        ),
      };
    } else if (childrenCount > 0) {
      return {
        title: t("Family & Child Comfort"),
        tag: `${childrenCount} Child${childrenCount > 1 ? "ren" : ""}`,
        desc: t(
          "Stroller parking near South Gopuram, clean baby care room near Annadhanam hall, and quick prasad counters along exit."
        ),
      };
    }
    return {
      title: t("Devotee Comfort & Amenities"),
      tag: `${adults} Adult${adults > 1 ? "s" : ""}`,
      desc: t(
        "Digital locker facilities at East Gate to deposit mobile phones and shoes safely before entering the sanctum."
      ),
    };
  }, [seniorsCount, childrenCount, adults, t]);

  const cards = [
    {
      icon: RouteIcon,
      ...routeInfo,
    },
    {
      icon: Clock,
      ...timingInfo,
    },
    {
      icon: Flower2,
      ...purposeInfo,
    },
    {
      icon: Armchair,
      ...comfortInfo,
    },
  ];

  return (
    <section className="bg-white border border-[#E8E2D5] rounded-3xl p-5 sm:p-6 shadow-xs animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E8E2D5]/70">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C48437]" />
          <h2 className="font-serif text-lg font-bold text-[#0B2F25]">
            {t("AI Smart Trip Intelligence")}
          </h2>
        </div>
        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{t("Customized to Your Trip")}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {cards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="group flex flex-col justify-between rounded-2xl border border-[#FAF6F0] bg-[#FAF6F0]/60 p-4 transition-all hover:border-[#C48437]/40 hover:bg-[#FAF6F0] hover:shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#E8E2D5] text-[#C48437] shadow-2xs group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5 text-[#C48437]" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C48437] bg-white border border-[#E8E2D5] px-2 py-0.5 rounded-md truncate max-w-[140px]" title={item.tag}>
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});
