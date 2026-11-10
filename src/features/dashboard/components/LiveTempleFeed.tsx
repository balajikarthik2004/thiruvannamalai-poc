import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { memo, useEffect, useMemo, useState } from "react";
import { useNow } from "@/hooks/use-now";
import { MapPin, ArrowRight, Radio, Search, Heart, Navigation, Clock } from "lucide-react";
import { CrowdBadge } from "@/components/shared/CrowdBadge";
import { templeThumb, type Temple } from "@/data/temples";
import { isOpenNow, optimalWindow, shortDeity } from "../utils";

type Tab = "all" | "nearby" | "favourites";
const FAV_KEY = "omg.favouriteTemples";

function loadFavs(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
  } catch {
    return [];
  }
}

interface Props {
  results: Temple[];
  q: string;
  setQ: (v: string) => void;
  activeTemple: Temple;
}

export const LiveTempleFeed = memo(function LiveTempleFeed({ results, q, setQ, activeTemple }: Props) {
  const { t } = useTranslation();
  // Open/closed only changes on the minute — no reason to tick every second.
  const now = useNow(60000);
  const [tab, setTab] = useState<Tab>("all");
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => setFavs(loadFavs()), []);

  const toggleFav = (slug: string) => {
    setFavs((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      try { localStorage.setItem(FAV_KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
      return next;
    });
  };

  // "Nearby" = temples in the same state as the temple currently in focus.
  const shown = useMemo(() => {
    if (tab === "nearby") return results.filter((x) => x.state === activeTemple.state);
    if (tab === "favourites") return results.filter((x) => favs.includes(x.slug));
    return results;
  }, [tab, results, favs, activeTemple.state]);

  const tabs: { id: Tab; label: string; icon?: typeof Heart }[] = [
    { id: "all", label: `${t("All Temples")} (${results.length})` },
    { id: "nearby", label: t("Nearby"), icon: Navigation },
    { id: "favourites", label: `${t("Favourites")}${favs.length ? ` (${favs.length})` : ""}`, icon: Heart },
  ];

  return (
    <section>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <h2 className="flex items-center gap-2 font-serif text-xl md:text-2xl font-bold text-slate-900">
          <Radio className="w-5 h-5 text-[#C48437]" /> {t("Live Darshan Feed")}
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <label className="relative sm:w-72">
            <span className="sr-only">{t("Search temple")}</span>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("Search temple (e.g. Palani, Madurai...)")}
              className="w-full h-10 pl-10 pr-3 rounded-full border border-rose-100 bg-white text-sm outline-none focus:border-saffron focus:ring-4 focus:ring-saffron/10"
            />
          </label>
          <div role="tablist" aria-label={t("Filter temples")} className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tb) => (
              <button
                key={tb.id}
                type="button"
                role="tab"
                aria-selected={tab === tb.id}
                onClick={() => setTab(tb.id)}
                title={tb.id === "nearby" ? `${t("Temples in")} ${t(activeTemple.state)}` : undefined}
                className={`shrink-0 inline-flex items-center gap-1.5 h-10 px-4 rounded-full text-sm font-semibold border transition-all ${
                  tab === tb.id ? "bg-[#0B2F25] text-white border-[#0B2F25] shadow-sm" : "bg-white text-slate-600 border-[#E8E2D5] hover:border-[#0B2F25]/50 hover:text-[#0B2F25]"
                }`}
              >
                {tb.icon && <tb.icon className="w-4 h-4" />} {tb.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {shown.map((temple) => {
          const open = isOpenNow(temple, now);
          const fav = favs.includes(temple.slug);
          return (
            <div key={temple.id} className="group relative bg-white border border-[#E8E2D5] rounded-3xl p-4 shadow-xs hover:shadow-md hover:border-[#0B2F25]/40 transition-all">
              <Link to="/temple/$slug" params={{ slug: temple.slug }} className="absolute inset-0 rounded-3xl" aria-label={t(temple.name)} />
              <div className="flex gap-4">
                <div className="w-[72px] h-[72px] rounded-2xl shrink-0 border border-[#E8E2D5]" style={{ background: templeThumb(temple, "center 30%") }} role="img" aria-label={t(temple.name)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif font-bold text-[15px] text-slate-900 leading-snug truncate group-hover:text-[#0B2F25] transition-colors" title={t(temple.name)}>{t(temple.name)}</h3>
                    <button
                      type="button"
                      onClick={() => toggleFav(temple.slug)}
                      aria-pressed={fav}
                      aria-label={fav ? t("Remove from favourites") : t("Add to favourites")}
                      className={`relative z-10 -mt-1 -mr-1 p-1.5 rounded-full shrink-0 transition-colors ${fav ? "text-[#C48437]" : "text-slate-300 hover:text-[#C48437]"}`}
                    >
                      <Heart className="w-4 h-4" fill={fav ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3.5 h-3.5 shrink-0" /> {t(temple.district)} · {t(shortDeity(temple.deity))}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                    <CrowdBadge status={temple.crowdStatus} />
                    <span className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">{temple.waitMin} {t("mins")}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${open ? "text-[#006300] bg-emerald-50 border-emerald-100" : "text-slate-600 bg-slate-100 border-slate-200"}`}>
                      {open ? t("Open Now") : t("Closed")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#E8E2D5] flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-3.5 h-3.5" /> {t("AI Optimal Darshan Time:")} <strong className="text-slate-800">{optimalWindow(temple)}</strong>
                </span>
                <span className="w-7 h-7 rounded-full border border-[#E8E2D5] flex items-center justify-center text-slate-400 group-hover:bg-[#0B2F25] group-hover:border-[#0B2F25] group-hover:text-white transition-colors" aria-hidden>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {shown.length === 0 && (
        <div className="text-center text-slate-500 py-14 bg-white rounded-3xl border border-[#E8E2D5]">
          <div className="text-3xl mb-2">🙏</div>
          <div className="font-semibold text-slate-800">{tab === "favourites" ? t("No favourites yet") : t("No temples found")}</div>
          <div className="text-sm mt-1">{tab === "favourites" ? t("Tap the heart on any temple to save it here.") : t("Try adjusting your filters or search terms.")}</div>
        </div>
      )}
    </section>
  );
});
