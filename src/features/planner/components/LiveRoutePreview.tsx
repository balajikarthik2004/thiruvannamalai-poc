import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Navigation, Maximize2, ExternalLink, Car, Clock } from "lucide-react";

interface Props {
  originName: string;
  destinationName: string;
  distanceKm?: number;
  durationHours?: number;
  durationMins?: number;
  onOpenFullMap?: () => void;
}

export const LiveRoutePreview = memo(function LiveRoutePreview({
  originName = "Chennai",
  destinationName = "Tiruvannamalai",
  distanceKm = 195,
  durationHours = 4,
  durationMins = 10,
  onOpenFullMap,
}: Props) {
  const { t } = useTranslation();

  const originQuery = originName.trim() || "Chennai";
  const destQuery = destinationName.trim()
    ? `${destinationName.trim()}, Tamil Nadu`
    : "Tiruvannamalai, Tamil Nadu";

  const googleMapsUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(
    originQuery
  )}&daddr=${encodeURIComponent(destQuery)}&output=embed`;

  return (
    <section className="bg-white border border-[#E8E2D5] rounded-3xl p-5 sm:p-6 shadow-xs overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF6F0] text-[#C48437]">
            <Navigation className="w-4 h-4" />
          </span>
          <h2 className="font-serif text-lg font-bold text-[#0B2F25]">
            {t("Live Route Preview")}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-center">
        {/* Left Side: Route Stops & Info */}
        <div className="flex flex-col justify-between h-full space-y-4">
          <div className="relative pl-6 py-1">
            {/* Connecting Vertical Line */}
            <div className="absolute left-[7px] top-3 bottom-3 w-[2px] bg-[#E8E2D5]" />

            <div className="space-y-6">
              {/* Origin Stop */}
              <div className="relative flex items-baseline justify-between gap-2">
                <span className="absolute -left-6 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#EA580C] shadow-xs" />
                <span className="text-sm font-bold text-slate-900">
                  {originName || "Chennai"}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  ({t("Start")})
                </span>
              </div>

              {/* Waypoint / Break Stop */}
              <div className="relative flex items-baseline justify-between gap-2">
                <span className="absolute -left-6 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#EA580C] shadow-xs" />
                <span className="text-sm font-semibold text-slate-700">
                  {t("Ulundurpet")}
                </span>
                <span className="text-xs text-slate-400">
                  ({t("Break - 15 min")})
                </span>
              </div>

              {/* Destination Stop */}
              <div className="relative flex items-baseline justify-between gap-2">
                <span className="absolute -left-6 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#00875A] shadow-xs" />
                <span className="text-sm font-bold text-[#0B2F25]">
                  {destinationName || "Tiruvannamalai"}
                </span>
                <span className="text-xs text-[#00875A] font-semibold">
                  ({t("Destination")})
                </span>
              </div>
            </div>
          </div>

          {/* Logistics Badge */}
          <div className="flex items-center gap-2 rounded-xl bg-[#FAF6F0] px-4 py-2.5 text-xs font-bold text-[#0B2F25] border border-[#E8E2D5]/80">
            <Car className="w-4 h-4 text-[#C48437]" />
            <span>~{distanceKm} km</span>
            <span className="text-slate-300">|</span>
            <Clock className="w-4 h-4 text-[#C48437]" />
            <span>{durationHours} hr {durationMins} min</span>
          </div>
        </div>

        {/* Right Side: Google Maps Route Embed Container */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-2xl border border-[#E8E2D5] bg-[#FAF6F0]">
          <iframe
            title={t("Live Route Preview Map")}
            src={googleMapsUrl}
            className="h-full w-full border-0 block"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />

          {/* Top Right: Fullscreen Expand Button */}
          {onOpenFullMap && (
            <button
              type="button"
              onClick={onOpenFullMap}
              aria-label={t("Expand Map")}
              title={t("Expand Map")}
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-slate-700 shadow-sm border border-slate-200 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}

          {/* Bottom Right: "View on Map ↗" Button */}
          <div className="absolute bottom-3 right-3 z-10">
            <button
              type="button"
              onClick={onOpenFullMap}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#C48437] px-3.5 py-1.5 text-xs font-bold text-white shadow-md hover:bg-[#A96E28] transition-colors cursor-pointer"
            >
              <span>{t("View on Map")}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});
