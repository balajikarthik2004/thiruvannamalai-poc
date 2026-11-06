import { createFileRoute } from "@tanstack/react-router";
import { stores } from "@/data/store";
import { StoreCard } from "@/features/store/components/StoreCard";
import { Search, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_app/store/")({
  component: StoreIndex,
});

const HERO = "/temples/tiruvannamalai/gopuram-sky.jpg";

function StoreIndex() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [state, setState] = useState("All");

  const states = useMemo(() => ["All", ...Array.from(new Set(stores.map((s) => s.state)))], []);

  const bySearch = stores.filter((s) => {
    const q = search.trim().toLowerCase();
    return !q || [s.name, s.city, s.description].some((v) => v.toLowerCase().includes(q));
  });
  const filtered = bySearch.filter((s) => state === "All" || s.state === state);
  const count = (st: string) => (st === "All" ? bySearch.length : bySearch.filter((s) => s.state === st).length);

  return (
    <div className="min-h-screen bg-[#fdf8f6] pb-10">
      {/* Header banner */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-full md:w-2/5 pointer-events-none" aria-hidden>
          <img src={HERO} alt="" className="w-full h-full object-cover object-[center_42%] opacity-40 md:opacity-100" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fdf8f6] via-[#fdf8f6]/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#fdf8f6] to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 pt-8 pb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-100 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-saffron">
            <ShoppingBag className="w-4 h-4" /> {t("Official Temple Stores")}
          </span>
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-slate-900 mt-3">{t("Temple Stores")}</h1>
          <p className="text-sm text-slate-600 mt-2 max-w-md">
            {t("Purchase authentic prasadam, sacred idols, and merchandise directly from temple premises.")}
          </p>
          <label className="relative block max-w-md mt-5">
            <span className="sr-only">{t("Search for a temple store...")}</span>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("Search for a temple store...")}
              className="w-full h-12 pl-11 pr-4 rounded-full border border-rose-100 bg-white text-sm outline-none shadow-sm focus:border-saffron focus:ring-4 focus:ring-saffron/10"
            />
          </label>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div role="tablist" aria-label={t("State")} className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-1 px-1 scrollbar-hide">
          {states.map((s) => {
            const active = state === s;
            return (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setState(s)}
                className={`shrink-0 h-9 px-4 rounded-full text-sm font-semibold border transition-all ${
                  active ? "bg-saffron text-white border-saffron shadow-md shadow-saffron/20" : "bg-white text-slate-600 border-rose-100 hover:border-saffron/50 hover:text-saffron"
                }`}
              >
                {s === "All" ? t("All Stores") : t(s)} ({count(s)})
              </button>
            );
          })}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-rose-100 rounded-3xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">{t("No stores found")}</h3>
            <p className="text-sm text-slate-500">{t("Try adjusting your search term.")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
