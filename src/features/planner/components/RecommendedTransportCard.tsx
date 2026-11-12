import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bus,
  Car,
  Clock,
  MapPin,
  ExternalLink,
  Info,
  Calendar,
  Sparkles,
  Phone,
  Check,
  ChevronRight,
} from "lucide-react";

interface Props {
  originName?: string;
  destinationCity?: string;
  travelHours?: number;
  travelMins?: number;
}

export const RecommendedTransportCard = memo(function RecommendedTransportCard({
  originName = "Chennai",
  destinationCity = "Tiruvannamalai",
  travelHours = 4,
  travelMins = 39,
}: Props) {
  const { t } = useTranslation();
  const [selectedMode, setSelectedMode] = useState<"bus" | "car">("bus");

  const busDuration = `${travelHours + 1}h 00m`;
  const carDuration = `~ ${travelHours}h ${travelMins}m`;

  const isTiru = destinationCity.toLowerCase().includes("tiruvannamalai");
  const isUdupi = destinationCity.toLowerCase().includes("udupi");

  const busPrimaryTitle = isUdupi
    ? "KSRTC / Airavat Club Class (Majestic / Shantinagar)"
    : isTiru
    ? "TNSTC / SETC (Kilambakkam bus terminus)"
    : `Inter-city Express Buses (${originName} Central)`;

  const busSecondaryTitle = isUdupi
    ? "Rathotsava & Weekend Special Volvos"
    : isTiru
    ? "Festival special buses (Pournami / Deepam)"
    : "Weekend & Festival Special Buses";

  const busSecondaryAnnounce = isUdupi
    ? "Announced by KSRTC before each festival"
    : isTiru
    ? "Announced by TNSTC before each festival"
    : "Announced by State Transport ahead of weekends";

  const busSecondaryBadge = isTiru
    ? "Direct to Girivalam Path"
    : isUdupi
    ? "Direct to Car Street Entry"
    : "Direct to Temple Hub";

  const lastMileText = isTiru
    ? "Share-autos and mini-buses ply from Tiruvannamalai Bus Stand. ~10-15 m to temple. Fare: Share-Auto Rs. 30 · Private Auto Rs. 100"
    : isUdupi
    ? "City buses and auto-rickshaws ply regularly from Udupi Service Bus Stand to Sri Krishna Matha Car Street (~1.2 km). Fare: Auto Rs. 40"
    : `Share-autos and local transit ply from ${destinationCity} Bus Stand. ~10-15 min to temple. Fare: Auto Rs. 50 – 100`;

  const cabDesc = `Fastest and most flexible. Safe highway conditions. Ola, Uber, and local travel agencies offer outstation drops to ${destinationCity}.`;

  const suggestedRoute = isTiru
    ? "GST Road (NH 32) to Tindivanam, then NH 77 via Gingee (~195 km)"
    : isUdupi
    ? "NH 75 via Hassan, Sakleshpur Western Ghats & Mangaluru/Udupi coastal highway (~400 km)"
    : `National Highway direct corridor from ${originName} to ${destinationCity}`;

  const routeHighlight1 = isTiru
    ? "Fast 4-lane NH 32 Highway"
    : isUdupi
    ? "Scenic Western Ghats stretch"
    : "Fast multi-lane Highway";
  const routeHighlight2 = isTiru
    ? "Food courts at Tindivanam bypass"
    : isUdupi
    ? "Highway coffee stops at Sakleshpur"
    : "Highway food plazas & fuel stops";
  const routeHighlight3 = isTiru
    ? "Designated Temple Parking (Lot A/B)"
    : isUdupi
    ? "Car Street Dedicated Parking"
    : "Temple Pilgrims Parking Lot";

  return (
    <section className="bg-white border border-[#E8E2D5] rounded-3xl p-5 sm:p-7 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E8E2D5]/80">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C48437]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("Transit Guidance")}</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2F25] mt-1">
            {t("Recommended Transport Modes")}
          </h2>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-[#FAF6F0] p-1 border border-[#E8E2D5] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSelectedMode("bus")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              selectedMode === "bus"
                ? "bg-[#0B2F25] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>{t("By Bus")}</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedMode("car")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              selectedMode === "car"
                ? "bg-[#0B2F25] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>{t("Personal Car / Cab")}</span>
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* 1. BY BUS SECTION */}
        <div
          className={`rounded-2xl border transition-all ${
            selectedMode === "bus"
              ? "border-[#00875A]/40 bg-[#FAF6F0]/60 ring-2 ring-[#00875A]/10"
              : "border-[#E8E2D5] bg-white opacity-85 hover:opacity-100"
          } p-5 sm:p-6`}
        >
          {/* Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E2D5]/70">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00875A]/10 text-[#00875A] border border-[#00875A]/20">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t("By Bus")}
                </h3>
                <p className="text-xs text-slate-500">
                  {t(
                    "Frequent reliable bus services from your origin terminus to Tiruvannamalai."
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#00875A]/10 px-2.5 py-1 text-xs font-bold text-[#00875A]">
                <Clock className="w-3.5 h-3.5" />
                <span>~ 5h 39m</span>
              </span>
            </div>
          </div>

          {/* Bus Services Grid */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Service 1 */}
            <div className="rounded-xl border border-[#E8E2D5] bg-white p-4 shadow-2xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {t(busPrimaryTitle)}
                  </h4>
                  <p className="mt-1 text-xs text-slate-500 flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-slate-700">Frequent</span>
                    <span>·</span>
                    <span>round the clock</span>
                  </p>
                </div>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-extrabold text-[#0B2F25] shrink-0">
                  {busDuration}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Fare: ₹180 – ₹380</span>
                <span className="text-emerald-700 font-semibold">Every 20–30 mins</span>
              </div>
            </div>

            {/* Service 2 */}
            <div className="rounded-xl border border-[#E8E2D5] bg-white p-4 shadow-2xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {t(busSecondaryTitle)}
                  </h4>
                  <p className="mt-1 text-xs text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C48437]" />
                    <span className="text-slate-600">
                      {t(busSecondaryAnnounce)}
                    </span>
                  </p>
                </div>
                <span className="rounded-md bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-xs font-bold shrink-0">
                  5h+ on peak days
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{t(busSecondaryBadge)}</span>
                <span className="text-[#C48437] font-semibold">Special Transit Pass</span>
              </div>
            </div>
          </div>

          {/* Last Mile Transit Box */}
          <div className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50/70 p-3.5 text-xs text-slate-700">
            <div className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C48437] text-white text-[11px] font-bold">
                🛺
              </span>
              <div className="leading-relaxed">
                <strong className="text-slate-900 font-bold">
                  {t("Last Mile Transit")}:
                </strong>{" "}
                {t(lastMileText)}
              </div>
            </div>
          </div>
        </div>

        {/* 2. PERSONAL CAR / CAB SECTION */}
        <div
          className={`rounded-2xl border transition-all ${
            selectedMode === "car"
              ? "border-[#C48437]/40 bg-[#FAF6F0]/60 ring-2 ring-[#C48437]/10"
              : "border-[#E8E2D5] bg-white opacity-85 hover:opacity-100"
          } p-5 sm:p-6`}
        >
          {/* Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E2D5]/70">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C48437]/10 text-[#C48437] border border-[#C48437]/20">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t("Personal Car / Outstation Cab")}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  {t(cabDesc)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#C48437]/10 px-2.5 py-1 text-xs font-bold text-[#C48437]">
                <Clock className="w-3.5 h-3.5" />
                <span>{carDuration}</span>
              </span>
            </div>
          </div>

          {/* Suggested Route Card */}
          <div className="mt-4 rounded-xl border border-[#E8E2D5] bg-white p-4">
            <div className="flex items-start gap-2.5 text-xs text-slate-700">
              <MapPin className="w-4 h-4 text-[#C48437] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900">{t("Suggested Route")}:</span>{" "}
                <span>
                  {suggestedRoute}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t(routeHighlight1)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t(routeHighlight2)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t(routeHighlight3)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

