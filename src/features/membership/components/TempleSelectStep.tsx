import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, MapPin, Check, ArrowRight, Landmark, SlidersHorizontal, LayoutGrid, List, CheckCircle2, Info, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { temples, type Temple, templeThumb } from "@/data/temples";

const PAGE_SIZE = 12;

// Deity families for "More Filters" — matched against the temple's deity text.
const DEITY_FILTERS: { id: string; label: string; match: RegExp }[] = [
  { id: "shiva", label: "Lord Shiva", match: /shiva|nataraja|mahabaleshwar|somnath|trimbak|bhimashankar|grishneshwar|virupaksha|manjunatha/i },
  { id: "murugan", label: "Lord Murugan", match: /murugan|subramanya|kartikeya/i },
  { id: "vishnu", label: "Lord Vishnu / Krishna", match: /vishnu|krishna|ranganatha|venkateswara|vitthal|dwarkadhish|ranchhod|chennakeshava/i },
  { id: "goddess", label: "Goddess / Amman", match: /goddess|amman|devi|mata|bhavani|laxmi|lakshmi|mookambika|sharada|ambaji|kalika|rukmini/i },
  { id: "ganesha", label: "Lord Ganesha", match: /ganesha|ganapati|vinayak/i },
];

export function TempleSelectStep({
  selected,
  onSelect,
  onNext,
}: {
  selected: string | null;
  onSelect: (slug: string) => void;
  onNext: () => void;
}) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [state, setState] = useState("All");
  const [deities, setDeities] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const filtersRef = useRef<HTMLDivElement>(null);

  // Close the filter panel on outside click / Escape.
  useEffect(() => {
    if (!filtersOpen) return;
    const onDown = (e: MouseEvent) => { if (!filtersRef.current?.contains(e.target as Node)) setFiltersOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setFiltersOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [filtersOpen]);

  const matchesDeity = (x: Temple) =>
    deities.length === 0 || deities.some((id) => DEITY_FILTERS.find((d) => d.id === id)!.match.test(`${x.deity} ${x.name}`));

  const matchesQuery = (x: Temple) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [x.name, x.city, x.deity, x.district].some((v) => v.toLowerCase().includes(q));
  };

  // State pills show counts for the current search + deity filters.
  const stateCounts = useMemo(() => {
    const base = temples.filter((x) => matchesQuery(x) && matchesDeity(x));
    const counts: Record<string, number> = { All: base.length };
    base.forEach((x) => (counts[x.state] = (counts[x.state] ?? 0) + 1));
    return counts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, deities]);

  const states = useMemo(() => ["All", ...Array.from(new Set(temples.map((x) => x.state)))], []);

  const results = useMemo(
    () => temples.filter((x) => (state === "All" || x.state === state) && matchesQuery(x) && matchesDeity(x)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, state, deities],
  );

  const shown = results.slice(0, limit);
  const selectedTemple = temples.find((x) => x.slug === selected);

  const resetPaging = (fn: () => void) => {
    fn();
    setLimit(PAGE_SIZE);
  };

  const toggleDeity = (id: string) =>
    resetPaging(() => setDeities((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id])));

  return (
    <div className="fade-in">
      <h2 className="font-serif text-2xl lg:text-3xl font-bold text-slate-900 text-center">{t("Choose your temple")}</h2>
      <p className="text-sm text-slate-500 text-center mt-1 mb-6">{t("Your membership supports this temple directly.")}</p>

      {/* Search + filters + view */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center mb-4">
        <label className="relative flex-1">
          <span className="sr-only">{t("Search temple")}</span>
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => resetPaging(() => setQuery(e.target.value))}
            placeholder={t("Search temple, deity, city or district...")}
            className="w-full h-12 bg-white border border-rose-100 rounded-full pl-11 pr-4 text-sm outline-none focus:border-saffron focus:ring-4 focus:ring-saffron/10 transition-all shadow-sm"
          />
        </label>

        <div className="flex items-center gap-3">
          <div ref={filtersRef} className="relative">
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              aria-expanded={filtersOpen}
              className="relative h-12 inline-flex items-center gap-2 px-5 rounded-full bg-white border border-rose-100 text-sm font-semibold text-slate-700 hover:border-saffron/50 shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4" /> {t("More Filters")}
              {deities.length > 0 && (
                <span className="absolute top-2 right-3 w-2 h-2 rounded-full bg-saffron" aria-label={`${deities.length} ${t("filters active")}`} />
              )}
            </button>
            {filtersOpen && (
              <div className="absolute right-0 md:left-0 top-full mt-2 z-40 w-72 bg-white border border-rose-100 rounded-2xl shadow-xl p-4 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-slate-900">{t("Filter by deity")}</span>
                  {deities.length > 0 && (
                    <button type="button" onClick={() => resetPaging(() => setDeities([]))} className="text-xs font-semibold text-saffron hover:underline">
                      {t("Clear")}
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  {DEITY_FILTERS.map((d) => {
                    const on = deities.includes(d.id);
                    return (
                      <button
                        key={d.id}
                        type="button"
                        role="checkbox"
                        aria-checked={on}
                        onClick={() => toggleDeity(d.id)}
                        className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-slate-700 hover:bg-rose-50"
                      >
                        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center ${on ? "bg-saffron border-saffron text-white" : "border-slate-300"}`}>
                          {on && <Check className="w-3 h-3" strokeWidth={3} />}
                        </span>
                        {t(d.label)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div role="radiogroup" aria-label={t("View")} className="h-12 inline-flex items-center p-1 rounded-full bg-white border border-rose-100 shadow-sm">
            {([["grid", LayoutGrid, "Grid"], ["list", List, "List"]] as const).map(([v, Icon, label]) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={view === v}
                onClick={() => setView(v)}
                className={`h-full inline-flex items-center gap-1.5 px-4 rounded-full text-sm font-semibold transition-all ${view === v ? "bg-saffron text-white shadow" : "text-slate-600 hover:text-saffron"}`}
              >
                <Icon className="w-4 h-4" /> {t(label)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* State pills */}
      <div role="tablist" aria-label={t("State")} className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1 scrollbar-hide">
        {states.map((s) => {
          const active = state === s;
          return (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => resetPaging(() => setState(s))}
              className={`shrink-0 h-9 px-4 rounded-full text-sm font-semibold border transition-all ${
                active ? "bg-saffron text-white border-saffron shadow-md shadow-saffron/20" : "bg-white text-slate-600 border-rose-100 hover:border-saffron/50 hover:text-saffron"
              }`}
            >
              {s === "All" ? t("All Temples") : t(s)} ({stateCounts[s] ?? 0})
            </button>
          );
        })}
      </div>

      {results.length === 0 ? (
        <div className="text-center py-14 border-2 border-dashed border-rose-100 rounded-3xl bg-white">
          <Landmark className="w-9 h-9 mx-auto text-slate-300 mb-3" />
          <p className="text-sm font-semibold text-slate-500">{t("No temple found.")}</p>
          {(deities.length > 0 || query) && (
            <button type="button" onClick={() => resetPaging(() => { setDeities([]); setQuery(""); })} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-saffron hover:underline">
              <X className="w-4 h-4" /> {t("Clear search and filters")}
            </button>
          )}
        </div>
      ) : (
        <>
          <div role="radiogroup" aria-label={t("Choose your temple")} className={view === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-3" : "flex flex-col gap-2"}>
            {shown.map((temple) => (
              <TempleOption key={temple.slug} temple={temple} view={view} active={selected === temple.slug} onSelect={() => onSelect(temple.slug)} />
            ))}
          </div>

          {results.length > limit && (
            <button
              type="button"
              onClick={() => setLimit((n) => n + PAGE_SIZE)}
              className="mx-auto mt-5 block px-5 py-2.5 rounded-full border border-rose-100 bg-white text-sm font-semibold text-slate-700 hover:border-saffron/50 transition-all"
            >
              {t("Show more")} ({results.length - limit})
            </button>
          )}
        </>
      )}

      {/* Sticky selection bar */}
      <div className="sticky bottom-16 lg:bottom-4 mt-6 z-30">
        <div className="bg-white/95 backdrop-blur-md border border-rose-100 rounded-full shadow-lg pl-5 pr-2 py-2 flex items-center gap-3">
          <div className="flex-1 min-w-0 flex items-center gap-3 text-sm">
            {selectedTemple ? (
              <>
                <span className="flex items-center gap-1.5 font-bold text-slate-800 shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-[#0ca30c]" /> <span className="hidden sm:inline">{t("1 temple selected")}</span>
                </span>
                <span className="hidden sm:block w-px h-5 bg-rose-100" aria-hidden />
                <Link
                  to="/temple/$slug"
                  params={{ slug: selectedTemple.slug }}
                  target="_blank"
                  className="flex items-center gap-1.5 font-semibold text-saffron hover:underline truncate"
                  title={t(selectedTemple.name)}
                >
                  <Info className="w-4 h-4 shrink-0" />
                  <span className="truncate">{t("View temple details")}</span>
                </Link>
              </>
            ) : (
              <span className="font-semibold text-slate-500">{t("Select a temple to continue")}</span>
            )}
          </div>
          <button
            type="button"
            onClick={onNext}
            disabled={!selected}
            className="h-11 rounded-full bg-saffron text-white px-6 text-sm font-bold flex items-center gap-2 shadow-md shadow-saffron/25 hover:brightness-95 transition-all disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] shrink-0"
          >
            <span className="hidden sm:inline">{t("Continue to Choose Plan")}</span>
            <span className="sm:hidden">{t("Continue")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function TempleOption({ temple, active, onSelect, view }: { temple: Temple; active: boolean; onSelect: () => void; view: "grid" | "list" }) {
  const { t } = useTranslation();
  const list = view === "list";

  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onSelect}
      className={`group relative flex items-center gap-4 text-left bg-white border rounded-2xl p-3 transition-all duration-200 hover:shadow-md ${
        active ? "border-saffron bg-rose-50/60 ring-2 ring-saffron/15 shadow-md" : "border-rose-100 hover:border-saffron/40"
      }`}
    >
      <div
        className={`${list ? "w-20 h-14" : "w-24 h-[72px]"} rounded-xl shrink-0 border border-rose-100`}
        style={{ background: templeThumb(temple, "center 30%") }}
        role="img"
        aria-label={t(temple.name)}
      />
      <div className={`min-w-0 flex-1 pr-6 ${list ? "sm:flex sm:items-center sm:gap-6" : ""}`}>
        <div className={`font-bold text-sm text-slate-900 leading-snug ${list ? "sm:w-72 line-clamp-1" : "line-clamp-2"}`}>{t(temple.name)}</div>
        <div className={`flex items-center gap-1.5 text-xs text-slate-500 mt-1 ${list ? "sm:mt-0 sm:flex-1" : ""}`}>
          <span className="text-saffron font-serif shrink-0" aria-hidden>ॐ</span>
          <span className="line-clamp-1">{t(temple.deity)}</span>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-semibold text-slate-700 mt-1 ${list ? "sm:mt-0 sm:w-44" : ""}`}>
          <MapPin className="w-3.5 h-3.5 shrink-0 text-saffron" />
          <span className="truncate">{t(temple.city)}</span>
        </div>
      </div>
      <span
        className={`absolute top-3 right-3 w-5 h-5 rounded-full grid place-items-center transition-all ${
          active ? "bg-saffron text-white" : "border-2 border-slate-300 text-transparent group-hover:border-saffron/50"
        }`}
        aria-hidden
      >
        <Check className="w-3 h-3" strokeWidth={3} />
      </span>
    </button>
  );
}
