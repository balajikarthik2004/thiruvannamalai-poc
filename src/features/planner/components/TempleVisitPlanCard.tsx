import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CalendarDays,
  Landmark,
  Check,
  Car,
  Ticket,
  Clock,
  Compass,
  BedDouble,
  Hourglass,
  Flame,
  Mountain,
  Users,
  Download,
  Bell,
  Map,
  Share2,
  CheckCircle2,
  Sparkles,
  Sun,
  ShieldCheck,
  Info,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

interface Props {
  templeName?: string;
  travelDate?: string;
  bestDarshanTime?: string;
  distanceKm?: number;
  travelHours?: number;
  travelMins?: number;
  originName?: string;
  stayPrice?: string;
  waitTime?: string;
  crowdLevel?: string;
  onOpenMap?: () => void;
}

export const TempleVisitPlanCard = memo(function TempleVisitPlanCard({
  templeName = "Tiruvannamalai Arunachaleswarar Temple",
  travelDate = "Nov 09, 2026",
  bestDarshanTime = "3:45 PM – 5:15 PM",
  distanceKm = 195,
  travelHours = 4,
  travelMins = 10,
  originName = "Chennai",
  stayPrice = "From ₹1,200 / night",
  waitTime = "15 – 25 min",
  crowdLevel = "Medium",
  onOpenMap,
}: Props) {
  const { t } = useTranslation();
  const [alertSet, setAlertSet] = useState(false);
  const [shared, setShared] = useState(false);

  const handleExportPDF = () => {
    window.print();
  };

  const handleSetAlert = () => {
    setAlertSet(true);
    setTimeout(() => setAlertSet(false), 4000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${templeName} Visit Plan`,
          text: `My AI-crafted temple visit plan for ${templeName} on ${travelDate}.`,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 3000);
    }
  };

  const preferredRouteStr = `${originName || "Chennai"} → Tindivanam → ${templeName.split(" ")[0]}`;

  return (
    <section className="bg-white border border-[#E8E2D5] rounded-3xl p-5 sm:p-7 shadow-xs overflow-hidden">
      {/* 1. Header with Temple Title and Travel Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E8E2D5]/80">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C48437]">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>{t("Your Temple Visit Plan")}</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2F25] mt-1">
            {templeName}
          </h2>
        </div>

        {/* Travel Date Badge */}
        <div className="flex items-center gap-2.5 rounded-xl border border-[#E8E2D5] bg-[#FAF6F0] px-3.5 py-2 shrink-0 self-start sm:self-auto">
          <CalendarDays className="w-4 h-4 text-[#C48437]" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-tight">
              {t("TRAVEL DATE")}
            </div>
            <div className="text-xs font-extrabold text-[#0B2F25] leading-tight">
              {travelDate}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Highlight Banner: Best Time for Darshan (Guaranteed 5 AM - 11 AM or 3:30 PM - 9 PM) */}
      <div className="mt-5 rounded-2xl bg-[#00875A] p-4 sm:p-5 text-white shadow-md shadow-[#00875A]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 border border-white/30 backdrop-blur-sm">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">
              {t("RECOMMENDED TIME FOR TEMPLE VISIT")}
            </div>
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {bestDarshanTime}
            </div>
            <div className="text-[11px] text-emerald-100/90 mt-0.5 font-medium">
              {t("Optimal open window (Sanctum rest 12:30 PM – 3:30 PM avoided)")}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-1.5 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#00875A] shadow-xs">
            <Check className="w-3.5 h-3.5" />
            <span>{t("Fast Entry & Cool Floors")}</span>
          </span>
          <span className="text-[11px] text-emerald-100 font-medium">
            ~15–20 mins wait expected
          </span>
        </div>
      </div>

      {/* 3. AI Strategic Suggestions */}
      <div className="mt-5 rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#C48437]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            {t("AI Devotee Insights & Sacred Timing Guidance")}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-xl bg-white border border-[#E8E2D5]/80 p-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Users className="w-3.5 h-3.5 text-[#00875A]" />
              <span>{t("Lowest Crowd Window")}</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
              {t("Darshan lines drop to ~25% capacity right after 3:30 PM reopening and early at 6:00 AM.")}
            </p>
          </div>

          <div className="rounded-xl bg-white border border-[#E8E2D5]/80 p-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>{t("Thermal Comfort")}</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
              {t("Midday sun heats granite stone corridors (11 AM – 3:30 PM). Morning/evening slots ensure cool floors.")}
            </p>
          </div>

          <div className="rounded-xl bg-white border border-[#E8E2D5]/80 p-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Flame className="w-3.5 h-3.5 text-[#C48437]" />
              <span>{t("Kaala Pooja Sync")}</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
              {t("Synchronized with Sayarakshai Deeparadhana (5:30 PM) and Kaalasanthi (8:00 AM) Vedic chants.")}
            </p>
          </div>

          <div className="rounded-xl bg-white border border-[#E8E2D5]/80 p-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Mountain className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t("Girivalam Advice")}</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
              {t("Start the 14 km walk after 5:00 PM to finish comfortably under moonlight and breezy evening conditions.")}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Travel & Logistics Grid */}
      <div className="mt-5 rounded-2xl bg-[#FAF6F0]/80 border border-[#E8E2D5] p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3.5">
          <Car className="w-4 h-4 text-[#C48437]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            {t("Travel & Logistics")}
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-xl bg-white border border-[#E8E2D5]/80 p-3">
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Compass className="w-3 h-3 text-[#C48437]" /> {t("Distance")}
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              ~{distanceKm} km
            </div>
          </div>

          <div className="rounded-xl bg-white border border-[#E8E2D5]/80 p-3">
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#C48437]" /> {t("Travel Time")}
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              ~{travelHours} hr {travelMins} min
            </div>
          </div>

          <div className="rounded-xl bg-white border border-[#E8E2D5]/80 p-3">
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Car className="w-3 h-3 text-[#C48437]" /> {t("Preferred Route")}
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1 truncate" title={preferredRouteStr}>
              {preferredRouteStr}
            </div>
          </div>

          <div className="rounded-xl bg-white border border-[#E8E2D5]/80 p-3">
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <BedDouble className="w-3 h-3 text-[#C48437]" /> {t("Stay Options")}
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {stayPrice}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Darshan Ticket Insights Grid */}
      <div className="mt-4 rounded-2xl bg-[#FAF6F0]/80 border border-[#E8E2D5] p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3.5">
          <Ticket className="w-4 h-4 text-[#C48437]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            {t("Darshan Ticket Insights")}
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-xl bg-white border border-[#E8E2D5]/80 p-3">
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Hourglass className="w-3 h-3 text-[#C48437]" /> {t("Average Wait Time")}
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {waitTime}
            </div>
          </div>

          <div className="rounded-xl bg-white border border-[#E8E2D5]/80 p-3">
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Flame className="w-3 h-3 text-[#C48437]" /> {t("Special Pooja (Optional)")}
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1">
              ~30 min <span className="text-[10px] text-slate-400 font-normal">({t("Pre-booking recommended")})</span>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-[#E8E2D5]/80 p-3">
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Mountain className="w-3 h-3 text-[#C48437]" /> {t("Girivalam (14 km)")}
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1">
              ~3 – 4 hrs <span className="text-[10px] text-slate-400 font-normal">({t("Best: Evening / Moon")})</span>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-[#E8E2D5]/80 p-3">
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Users className="w-3 h-3 text-[#C48437]" /> {t("Crowd Level")}
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {crowdLevel} <span className="text-[10px] text-slate-400 font-normal">({travelDate})</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Action Buttons Footer */}
      <div className="mt-6 flex flex-wrap items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleExportPDF}
          className="inline-flex items-center gap-2 rounded-xl bg-[#C48437] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#A96E28] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{t("Export as PDF")}</span>
        </button>

        <button
          type="button"
          onClick={handleSetAlert}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            alertSet
              ? "bg-[#00875A] text-white border-[#00875A]"
              : "bg-white border-[#E8E2D5] text-slate-800 hover:border-[#0B2F25] hover:text-[#0B2F25]"
          }`}
        >
          {alertSet ? <CheckCircle2 className="w-4 h-4" /> : <Bell className="w-4 h-4 text-[#C48437]" />}
          <span>{alertSet ? t("Alert Enabled!") : t("Set Crowd Alert")}</span>
        </button>

        <Link
          to="/heatmap"
          className="inline-flex items-center gap-2 rounded-xl border border-[#E8E2D5] bg-white px-4 py-2.5 text-xs font-bold text-slate-800 hover:border-[#0B2F25] hover:text-[#0B2F25] transition-all"
        >
          <Map className="w-4 h-4 text-[#C48437]" />
          <span>{t("View Temple Map")}</span>
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            shared
              ? "bg-[#00875A] text-white border-[#00875A]"
              : "bg-white border-[#E8E2D5] text-slate-800 hover:border-[#0B2F25] hover:text-[#0B2F25]"
          }`}
        >
          {shared ? <CheckCircle2 className="w-4 h-4" /> : <Share2 className="w-4 h-4 text-[#C48437]" />}
          <span>{shared ? t("Link Copied!") : t("Share Plan")}</span>
        </button>
      </div>
    </section>
  );
});
