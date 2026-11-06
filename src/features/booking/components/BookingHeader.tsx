import { useCanGoBack, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Temple } from "@/data/temples";
import muruganImg from "@/assets/murugan.png";
import meenakshiImg from "@/assets/meenakshi.png";

const bgImages: Record<string, string> = {
  "tiruvannamalai": "/temples/tiruvannamalai/night.jpg",
  "palani-murugan": muruganImg,
  "madurai-meenakshi": meenakshiImg,
};

export function BookingHeader({ t }: { t: Temple }) {
  const { t: tStr } = useTranslation();
  const hasBgImg = !!bgImages[t.slug];
  const router = useRouter();
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();

  // Return to the page the devotee came from; on a direct visit fall back to the temple page.
  const goBack = () => {
    if (canGoBack) router.history.back();
    else navigate({ to: "/temple/$slug", params: { slug: t.slug } });
  };

  return (
    <div className="relative h-[160px] overflow-hidden" style={{
      background: hasBgImg
        ? `url(${bgImages[t.slug]}) center 30% / cover no-repeat`
        : t.image 
          ? `url(${t.image}) center 20% / cover no-repeat`
          : `linear-gradient(135deg, ${t.gradientFrom}, ${t.color})`
    }}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
      
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 z-10">
        <button type="button" onClick={goBack} aria-label={tStr("Go back")} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
      
      <div className="absolute bottom-0 inset-x-0 p-5 lg:p-8 text-white z-10">
        <div className="inline-flex items-center gap-1.5 bg-saffron/90 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2">
          {tStr("Special Entry Darshan")}
        </div>
        <h1 className="font-serif text-3xl font-semibold leading-tight drop-shadow-lg">{tStr(t.name)}</h1>
        <div className="text-sm opacity-90 flex items-center gap-1 mt-1 drop-shadow-md">
          {tStr(t.city)}, {tStr(t.district)} {tStr("District")}
        </div>
      </div>
    </div>
  );
}
