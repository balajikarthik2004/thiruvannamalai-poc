import { useCanGoBack, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Temple } from "@/data/temples";

export function BookingHeader({ t }: { t: Temple }) {
  const { t: tStr } = useTranslation();
  const router = useRouter();
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();

  const goBack = () => {
    if (canGoBack) router.history.back();
    else navigate({ to: "/temple/$slug", params: { slug: t.slug } });
  };

  const isTiruvannamalai = t.slug === "tiruvannamalai";

  return (
    <header className="relative w-full overflow-hidden bg-[#1E0F07] text-white">
      {/* Background artwork placed on the right side without text */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-full sm:w-3/5 lg:w-1/2 overflow-hidden"
        aria-hidden
      >
        <img
          src={isTiruvannamalai ? "/booking_banner_art_hd.jpg" : "/temples/tiruvannamalai/temple-hill.jpg"}
          alt=""
          className="h-full w-full object-cover object-right brightness-95"
          onError={(e) => {
            (e.target as HTMLElement).src = "/temples/tiruvannamalai/temple-hill.jpg";
          }}
        />
        {/* Smooth gradient blending the background seamlessly */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E0F07] via-[#1E0F07]/60 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Golden Trishul icon in HD */}
            <div className="flex h-14 w-12 sm:h-16 sm:w-14 shrink-0 items-center justify-center">
              <img
                src="/trishul_gold_hd.png"
                alt="Trishul"
                className="h-13 sm:h-15 w-auto object-contain drop-shadow-[0_2px_8px_rgba(217,119,6,0.35)]"
                onError={(e) => {
                  (e.target as HTMLElement).src = "/trishul_gold.png";
                }}
              />
            </div>

            {/* Title & Temple Info */}
            <div className="min-w-0">
              <h2 className="font-serif text-lg font-medium tracking-wide text-amber-100/90 sm:text-xl">
                {isTiruvannamalai ? "Tiruvannamalai" : tStr(t.city)}
              </h2>
              <h1 className="font-serif text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl lg:text-3xl drop-shadow-sm">
                {isTiruvannamalai ? "Arunachaleswarar Temple" : tStr(t.name)}
              </h1>
              <p className="mt-0.5 text-xs font-medium text-amber-200/80 sm:text-sm">
                {tStr("Special Entry Darshan Booking")}
              </p>
            </div>
          </div>

          {/* Quick back button */}
          <button
            type="button"
            onClick={goBack}
            aria-label={tStr("Go back")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white/90 transition-all hover:bg-black/50 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
