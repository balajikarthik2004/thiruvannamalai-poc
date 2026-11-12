import { memo } from "react";
import { useTranslation } from "react-i18next";
import { CalendarDays, Clock, Info } from "lucide-react";
import type { Temple } from "@/data/temples";

export interface ItineraryItem {
  time: string;
  activity: string;
  optional?: boolean;
}

interface Props {
  temple?: Temple;
  templeName?: string;
  selectedTime?: string;
  items?: ItineraryItem[];
  imageSrc?: string;
}

/**
 * Builds an authentic, realistic itinerary tailored to the specific temple and chosen time slot.
 * Strictly adheres to Agamic temple norms: avoids sanctum darshan between 11:00 AM - 3:30 PM.
 */
function getTempleItinerary(
  temple?: Temple,
  templeName: string = "Tiruvannamalai Arunachaleswarar Temple",
  selectedTime: string = "afternoon"
): ItineraryItem[] {
  const slug = temple?.slug?.toLowerCase() || "";
  const name = (temple?.name || templeName).toLowerCase();
  const city = temple?.city || "Temple Town";
  const deity = temple?.deity || "Presiding Deity";

  // 1. Udupi Sri Krishna Matha
  if (slug.includes("udupi") || name.includes("udupi")) {
    if (selectedTime === "earlyMorning") {
      return [
        { time: "05:30 AM", activity: "Arrive & Holy Dip at Madhwa Sarovara Sacred Tank" },
        { time: "06:00 AM", activity: "Nirmalya Visarjana & Ushakala First Darshan (Cool stone corridors)" },
        { time: "07:30 AM", activity: "Kanakana Kindi Window Darshan & Chandana Alankara Seva" },
        { time: "09:00 AM", activity: "Traditional Udupi Breakfast near Car Street (Golibaje / Idli)" },
        { time: "11:30 AM", activity: "Maha Pooja & World-Renowned Anna Santharpana (Community Feast)" },
        { time: "01:00 PM", activity: "Midday Rest at Hotel during Sanctum Closure (1:00 PM – 3:30 PM)" },
        { time: "04:00 PM", activity: "Evening Darshan & Ashta Mathas Sacred Heritage Walk" },
      ];
    }
    if (selectedTime === "morning") {
      return [
        { time: "07:30 AM", activity: "Arrive in Udupi & Freshen Up" },
        { time: "08:30 AM", activity: "Kanakana Kindi Darshan & Anantheshwara Temple Visit" },
        { time: "10:30 AM", activity: "Suvarna Gopura & Sri Mukhyaprana (Hanuman) Pradakshina" },
        { time: "11:30 AM", activity: "Sacred Udupi Anna Santharpana Prasadam Feast" },
        { time: "01:00 PM", activity: "Hotel Check-in & Midday Rest during Sanctum Closure" },
        { time: "04:00 PM", activity: "Matha Reopens: Evening Chants & Deeparadhana" },
        { time: "06:30 PM", activity: "Car Street Walk & Traditional Brass Handicrafts" },
      ];
    }
    if (selectedTime === "evening") {
      return [
        { time: "04:00 PM", activity: "Arrive in Udupi & Check into Hotel near Car Street" },
        { time: "05:00 PM", activity: "Evening Kanakana Kindi Darshan (Optimal crowd window)" },
        { time: "06:30 PM", activity: "Grand Rathotsava (Golden / Silver Chariot Procession on Car Street)" },
        { time: "08:00 PM", activity: "Night Chamara Seva & Shayanotsava Ceremony" },
        { time: "08:45 PM", activity: "Traditional Udupi Temple Prasada Dining" },
        { time: "09:30 PM", activity: "Overnight Stay in Udupi Town" },
      ];
    }
    // Afternoon (default)
    return [
      { time: "02:30 PM", activity: "Arrive at Udupi Car Street & Hotel Check-in" },
      { time: "03:30 PM", activity: "Freshen up as Matha Reopens (Sanctum opens 3:30 PM)" },
      { time: "04:00 PM", activity: "Kanakana Kindi Darshan (Silver 9-Hole Window) & Madhwa Sarovara", optional: true },
      { time: "05:30 PM", activity: "Suvarna Gopura Darshan & Mukhyaprana Sannidhi Pradakshina" },
      { time: "07:00 PM", activity: "Grand Car Street Rathotsava (Chariot Procession) & Chamara Seva" },
      { time: "08:30 PM", activity: "Famous Udupi Bhojana Prasada / Sattvic Annadhanam Dinner" },
      { time: "09:15 PM", activity: "Return Journey or Overnight Stay in Udupi Town" },
    ];
  }

  // 2. Tiruvannamalai Arunachaleswarar Temple
  if (slug.includes("tiruvannamalai") || name.includes("arunachaleswarar") || name.includes("tiruvannamalai")) {
    if (selectedTime === "earlyMorning") {
      return [
        { time: "05:00 AM", activity: "Arrive & Sacred Snanam / Freshen Up" },
        { time: "05:30 AM", activity: "Ushathkalam Pooja & First Darshan (Cool stone floors)" },
        { time: "07:30 AM", activity: "Kaalasanthi Darshan & Inner Prakaaram Circumambulation" },
        { time: "09:00 AM", activity: "Traditional Breakfast & Sri Ramana Ashram Visit" },
        { time: "11:30 AM", activity: "Temple Annadhanam Prasadam on Fresh Banana Leaf" },
        { time: "01:00 PM", activity: "Rest & Relaxation during Temple Closure (12:30 PM – 3:30 PM)" },
        { time: "04:00 PM", activity: "Sayarakshai Pooja or Girivalam (14 km) Walk" },
      ];
    }
    if (selectedTime === "morning") {
      return [
        { time: "07:00 AM", activity: "Arrive at Temple Town & Freshen Up" },
        { time: "08:00 AM", activity: "Kaalasanthi Special Darshan (Low queue, pleasant weather)" },
        { time: "10:00 AM", activity: "Navagraha & Unnamalai Amman Sannidhi Pradakshinam" },
        { time: "11:30 AM", activity: "Temple Annadhanam Feast on Banana Leaf" },
        { time: "01:00 PM", activity: "Hotel Check-in & Midday Rest during Sanctum Closure" },
        { time: "04:00 PM", activity: "Temple Reopens: Sayarakshai Pooja & Sacred Chants" },
        { time: "05:30 PM", activity: "Evening Girivalam Walk (14 km) under Cool Breeze" },
      ];
    }
    if (selectedTime === "evening") {
      return [
        { time: "04:00 PM", activity: "Arrive at Hotel & Check-in" },
        { time: "05:00 PM", activity: "Sayarakshai Evening Darshan & Golden Hour Aradhana" },
        { time: "06:30 PM", activity: "Girivalam (14 km) under Moonlight and Illuminated Path" },
        { time: "09:00 PM", activity: "Arthajama Closure & Sacred Vibhuti Prasadam" },
        { time: "10:00 PM", activity: "Traditional Dinner & Overnight Stay in Town" },
      ];
    }
    // Afternoon (default)
    return [
      { time: "02:30 PM", activity: "Arrive at Tiruvannamalai & Hotel Check-in" },
      { time: "03:30 PM", activity: "Freshen up as Temple Reopens (Sanctum opens 3:30 PM)" },
      { time: "04:00 PM", activity: "Special Darshan & Sayarakshai Deeparadhana", optional: true },
      { time: "05:30 PM", activity: "Girivalam (14 km) — Start under Sunset & Evening Breeze" },
      { time: "08:30 PM", activity: "Annadhanam / Dinner" },
      { time: "09:00 PM", activity: "Return Journey or Overnight Stay" },
    ];
  }

  // 3. Palani Dhandayuthapani Swamy
  if (slug.includes("palani") || name.includes("palani")) {
    if (selectedTime === "earlyMorning") {
      return [
        { time: "05:30 AM", activity: "Sacred Giri Veedhi Barefoot Pradakshina around Sivagiri Hill" },
        { time: "06:50 AM", activity: "Vila Pooja & Early Morning Hill Darshan" },
        { time: "08:30 AM", activity: "Traditional South Indian Breakfast at Adivaram" },
        { time: "11:30 AM", activity: "Temple Annadhanam Prasadam (Bountiful Lunch)" },
        { time: "01:00 PM", activity: "Hotel Rest during Midday Heat & Sanctum Closure" },
        { time: "04:00 PM", activity: "Evening Darshan & Idumban Hill Shrine Visit" },
      ];
    }
    if (selectedTime === "morning") {
      return [
        { time: "07:30 AM", activity: "Arrive & Ascend Sivagiri Hill via Rope Car / Steps" },
        { time: "08:30 AM", activity: "Kala Shanthi Darshan & Vibhuti Prasadam" },
        { time: "10:30 AM", activity: "Giri Veedhi Parikrama & Murugan Sannidhi Walk" },
        { time: "11:30 AM", activity: "Temple Annadhanam Feast on Fresh Banana Leaf" },
        { time: "01:00 PM", activity: "Hotel Check-in & Rest during Sanctum Closure" },
        { time: "04:00 PM", activity: "Evening Reopening & Special Panchamirtham Counters" },
      ];
    }
    if (selectedTime === "evening") {
      return [
        { time: "04:00 PM", activity: "Arrive & Check into Hotel near Adivaram" },
        { time: "05:00 PM", activity: "Rope-car Ascent for Sayaraksha Deeparadhana" },
        { time: "06:45 PM", activity: "Grand Golden Chariot (Thanga Ther) Procession" },
        { time: "08:00 PM", activity: "Rakkala Pooja & Peaceful Night Hill Atmosphere" },
        { time: "09:00 PM", activity: "Dinner & Overnight Stay in Palani" },
      ];
    }
    return [
      { time: "02:30 PM", activity: "Arrive at Palani & Hotel Check-in" },
      { time: "03:30 PM", activity: "Freshen up; Winch / Rope Car Ascent up Sivagiri Hill" },
      { time: "04:00 PM", activity: "Special Darshan of Lord Murugan (Dhandayuthapani Swamy)", optional: true },
      { time: "05:30 PM", activity: "Sayaraksha Pooja & Golden Chariot (Thanga Ther) Procession" },
      { time: "07:30 PM", activity: "Collect Sacred Panchamirtham Prasadam & Hill Descent" },
      { time: "08:30 PM", activity: "Traditional Tamil Dinner near Adivaram" },
      { time: "09:00 PM", activity: "Return Journey or Overnight Stay in Palani" },
    ];
  }

  // 4. Madurai Meenakshi Amman
  if (slug.includes("meenakshi") || name.includes("meenakshi") || name.includes("madurai")) {
    if (selectedTime === "earlyMorning") {
      return [
        { time: "05:00 AM", activity: "Thiruvanandal First Darshan (Serene spiritual aura)" },
        { time: "06:30 AM", activity: "Vizha Pooja & Golden Lotus Tank Circumambulation" },
        { time: "08:30 AM", activity: "Traditional Madurai Breakfast (Crisp Dosas & Filter Coffee)" },
        { time: "11:30 AM", activity: "Temple Annadhanam Feast on Banana Leaf" },
        { time: "01:00 PM", activity: "Midday Rest at Hotel during Sanctum Closure (12:30 PM – 4:00 PM)" },
        { time: "04:30 PM", activity: "Maalai Evening Pooja & Nayak Architecture Walk" },
      ];
    }
    if (selectedTime === "morning") {
      return [
        { time: "07:30 AM", activity: "Arrive & Enter through Majestic East / South Tower" },
        { time: "08:30 AM", activity: "Kalasandhi Darshan & Meenakshi Amman Archana" },
        { time: "10:30 AM", activity: "Thousand Pillar Hall Museum & Sculptures" },
        { time: "11:30 AM", activity: "Temple Annadhanam Feast on Banana Leaf" },
        { time: "01:00 PM", activity: "Hotel Check-in & Rest during Sanctum Closure" },
        { time: "04:30 PM", activity: "Reopening Darshan & Sacred Kumkum Prasadam" },
      ];
    }
    if (selectedTime === "evening") {
      return [
        { time: "04:00 PM", activity: "Arrive & Hotel Check-in near Temple Towers" },
        { time: "05:00 PM", activity: "Evening Darshan of Meenakshi Amman & Sundareswarar" },
        { time: "07:00 PM", activity: "Thousand Pillar Hall & Musical Pillars Exploration" },
        { time: "08:30 PM", activity: "Grand Palliarai Bedtime Pooja Procession" },
        { time: "09:30 PM", activity: "Authentic Madurai Dinner & Overnight Stay" },
      ];
    }
    return [
      { time: "02:30 PM", activity: "Arrive in Madurai & Hotel Check-in near Chithirai Veedhi" },
      { time: "03:30 PM", activity: "Freshen up as Temple Reopens (Sanctum opens 3:30 PM)" },
      { time: "04:00 PM", activity: "Meenakshi Amman Sanctum Darshan & Golden Lotus Pond", optional: true },
      { time: "05:30 PM", activity: "Sundareswarar Swamy Darshan & Thousand Pillar Hall" },
      { time: "07:30 PM", activity: "Evening Chants & Traditional Brass Lamps Illumination" },
      { time: "08:30 PM", activity: "Famous Madurai Dinner (Crisp Dosas / Jigarthanda)" },
      { time: "09:15 PM", activity: "Palliarai Bedtime Ceremony & Overnight Stay" },
    ];
  }

  // 5. Rameswaram Ramanathaswamy
  if (slug.includes("rameswaram") || name.includes("rameswaram")) {
    if (selectedTime === "earlyMorning") {
      return [
        { time: "05:00 AM", activity: "Holy Sea Bath at Agni Theertham during Sunrise" },
        { time: "06:00 AM", activity: "Sacred 22 Theerthams (Wells) Bath inside Temple Complex" },
        { time: "07:30 AM", activity: "Change Clothes & Spatika Lingam First Morning Darshan" },
        { time: "09:00 AM", activity: "Traditional Pilgrim Breakfast in Rameswaram Town" },
        { time: "11:30 AM", activity: "Temple Annadhanam Prasadam" },
        { time: "01:00 PM", activity: "Midday Rest during Sanctum Rest (1:00 PM – 3:30 PM)" },
        { time: "04:00 PM", activity: "Evening Darshan & Walk through the 1,212-Pillar Corridor" },
      ];
    }
    return [
      { time: "02:30 PM", activity: "Arrive in Rameswaram & Hotel Check-in" },
      { time: "03:30 PM", activity: "Freshen up as Temple Reopens (Sanctum opens 3:30 PM)" },
      { time: "04:00 PM", activity: "Spatika Lingam Darshan & Sacred Sanctum Visit", optional: true },
      { time: "05:30 PM", activity: "Walk through the World-Famous 1,212-Pillar Third Corridor" },
      { time: "07:00 PM", activity: "Evening Aradhana & Parvathavarthini Ambal Darshan" },
      { time: "08:30 PM", activity: "Temple Annadhanam / Traditional South Indian Dinner" },
      { time: "09:00 PM", activity: "Return Journey or Overnight Stay in Rameswaram" },
    ];
  }

  // 6. Generic Authentic Fallback for any temple
  if (selectedTime === "earlyMorning") {
    return [
      { time: "05:00 AM", activity: "Arrive & Sacred Snanam / Freshen Up" },
      { time: "05:30 AM", activity: `First Morning Darshan of ${deity} (Cool Stone Corridors)` },
      { time: "07:30 AM", activity: "Morning Pooja & Prakaaram Pradakshina" },
      { time: "09:00 AM", activity: "Traditional Breakfast near Temple Bazaar" },
      { time: "11:30 AM", activity: "Temple Annadhanam Prasadam on Fresh Banana Leaf" },
      { time: "01:00 PM", activity: "Midday Rest at Hotel during Sanctum Closure (12:30 PM – 3:30 PM)" },
      { time: "04:00 PM", activity: "Evening Reopening Darshan & Sacred Blessings" },
    ];
  }
  if (selectedTime === "morning") {
    return [
      { time: "07:00 AM", activity: `Arrive at ${city} & Freshen Up` },
      { time: "08:00 AM", activity: `Morning Special Darshan of ${deity} (Pleasant weather)` },
      { time: "10:00 AM", activity: "Sub-shrine Darshans & Parikrama (Before 11:00 AM)" },
      { time: "11:30 AM", activity: "Temple Annadhanam Feast / Traditional Lunch" },
      { time: "01:00 PM", activity: "Hotel Check-in & Rest during Sanctum Closure" },
      { time: "04:00 PM", activity: "Sanctum Reopens: Evening Chants & Deeparadhana" },
      { time: "06:30 PM", activity: "Temple Bazaar Walk & Heritage Exploration" },
    ];
  }
  if (selectedTime === "evening") {
    return [
      { time: "04:00 PM", activity: `Arrive at ${city} & Hotel Check-in` },
      { time: "05:00 PM", activity: `Evening Sandhya Darshan of ${deity} (Optimal Lighting)` },
      { time: "06:30 PM", activity: "Temple Complex Circumambulation & Bell Ringing Ceremony" },
      { time: "08:00 PM", activity: "Night Aarti & Sacred Vibhuti / Kumkum Prasadam" },
      { time: "09:00 PM", activity: `Traditional Dinner & Overnight Stay in ${city}` },
    ];
  }

  // Afternoon (default)
  return [
    { time: "02:30 PM", activity: `Arrive at ${city} & Hotel Check-in` },
    { time: "03:30 PM", activity: "Freshen up as Temple Reopens (Sanctum opens 3:30 PM)" },
    { time: "04:00 PM", activity: `Special Darshan of ${deity} & Deeparadhana`, optional: true },
    { time: "05:30 PM", activity: "Inner Prakaaram Circumambulation & Temple Pond Visit" },
    { time: "07:00 PM", activity: "Evening Sandhya Aarti & Sacred Prasadam Offering" },
    { time: "08:30 PM", activity: "Traditional Annadhanam / Local Vegetarian Dinner" },
    { time: "09:00 PM", activity: `Return Journey or Overnight Stay in ${city}` },
  ];
}

export const SampleItineraryCard = memo(function SampleItineraryCard({
  temple,
  templeName = "Tiruvannamalai Arunachaleswarar Temple",
  selectedTime = "afternoon",
  items,
  imageSrc,
}: Props) {
  const { t } = useTranslation();

  const activeTempleName = temple?.name || templeName;
  const schedule = items || getTempleItinerary(temple, activeTempleName, selectedTime);

  // Fallback image handling
  const displayImage =
    imageSrc ||
    temple?.image ||
    (temple?.slug?.includes("udupi")
      ? "https://commons.wikimedia.org/wiki/Special:FilePath/Udupi_Sri_Krishna_Matha_Temple.jpg?width=800"
      : "/planner_itinerary_temple_hd.jpg");

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
            {t("Preview for")} <span className="font-semibold text-slate-700">{activeTempleName}</span>
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
            src={displayImage}
            alt={activeTempleName}
            className="h-full w-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/planner_itinerary_temple_hd.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
              {activeTempleName.split(" ")[0]} Sacred Darshan
            </span>
          </div>
        </div>
      </div>
    </section>
  );
});
